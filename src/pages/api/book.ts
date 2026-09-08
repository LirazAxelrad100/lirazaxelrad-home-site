import type { APIRoute } from "astro";
import { Resend } from "resend";
import { bookingConfig } from "../../config/booking";
import { formatInZone, isOfferedSlot, signBooking, type BookingRequest } from "../../lib/booking";

export const prerender = false;

interface BookPayload {
  name: string;
  email: string;
  phone: string;
  topic: string;
  start: number;
  visitorTimeZone: string;
  locale: "he" | "en";
}

function isBookPayload(body: unknown): body is BookPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.name === "string" &&
    b.name.trim().length > 0 &&
    typeof b.email === "string" &&
    b.email.includes("@") &&
    typeof b.phone === "string" &&
    typeof b.topic === "string" &&
    typeof b.start === "number" &&
    Number.isFinite(b.start)
  );
}

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!isBookPayload(body)) {
    return new Response(JSON.stringify({ error: "invalid payload" }), { status: 400 });
  }

  // The slot is re-checked here rather than trusted from the browser: without
  // this, a crafted request could book any time at all, including the middle
  // of the night or a day that is closed.
  if (!(await isOfferedSlot(body.start))) {
    return new Response(JSON.stringify({ error: "slot no longer available" }), { status: 409 });
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  const secret = import.meta.env.BOOKING_SECRET;
  if (!apiKey || !secret) {
    console.error("Booking is not configured", { hasApiKey: Boolean(apiKey), hasSecret: Boolean(secret) });
    return new Response(JSON.stringify({ error: "booking not configured" }), { status: 500 });
  }

  const bookingRequest: BookingRequest = {
    name: body.name.trim(),
    email: body.email.trim(),
    phone: body.phone.trim(),
    topic: body.topic.trim(),
    start: body.start,
    visitorTimeZone: body.visitorTimeZone || bookingConfig.timeZone,
    locale: body.locale === "he" ? "he" : "en",
  };

  const token = signBooking(bookingRequest, secret);
  const origin = new URL(request.url).origin;
  // A link, not a one-click approve endpoint: mail scanners follow links in
  // email, and a GET that confirmed the booking could be triggered by one.
  // The page this opens has the actual Approve/Decline buttons.
  const reviewUrl = `${origin}/booking-review?token=${encodeURIComponent(token)}`;

  const whenHer = formatInZone(bookingRequest.start, bookingConfig.timeZone);
  const whenThem = formatInZone(bookingRequest.start, bookingRequest.visitorTimeZone);

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "Website booking <noreply@lirazaxelrad.com>",
      to: bookingConfig.organizerEmail,
      replyTo: bookingRequest.email,
      subject: `Call request — ${bookingRequest.name}, ${whenHer}`,
      text: [
        `${bookingRequest.name} would like to book a ${bookingConfig.durationMinutes}-minute call.`,
        "",
        `When (your time):     ${whenHer}`,
        `When (their time):    ${whenThem} — ${bookingRequest.visitorTimeZone}`,
        `Email:                ${bookingRequest.email}`,
        `Phone:                ${bookingRequest.phone || "—"}`,
        `Topic:                ${bookingRequest.topic || "—"}`,
        `Site language:        ${bookingRequest.locale}`,
        "",
        "Nothing is confirmed yet. Open this to approve or decline:",
        reviewUrl,
      ].join("\n"),
    });
    if (error) {
      console.error("Resend rejected the booking request", { error });
      return new Response(JSON.stringify({ error: "send rejected" }), { status: 502 });
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("Booking request failed", err);
    return new Response(JSON.stringify({ error: "send failed" }), { status: 502 });
  }
};
