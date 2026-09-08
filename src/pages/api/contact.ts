import type { APIRoute } from "astro";
import { Resend } from "resend";
import { honeypotTripped, rateLimited, tooLong, verifyFormToken } from "../../lib/antispam";

export const prerender = false;

const TO_EMAIL = "hello@lirazaxelrad.com";

interface ContactPayload {
  name: string;
  email: string;
  topic?: string;
  message: string;
}

function isContactPayload(body: unknown): body is ContactPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return typeof b.name === "string" && typeof b.email === "string" && typeof b.message === "string";
}

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!isContactPayload(body)) {
    return new Response(JSON.stringify({ error: "invalid payload" }), { status: 400 });
  }
  const { name, email, topic, message } = body;

  // Same three cheap defences as the booking endpoint; see lib/antispam.ts.
  const record = body as unknown as Record<string, unknown>;
  if (honeypotTripped(record)) {
    console.warn("Contact message rejected: honeypot");
    return new Response(JSON.stringify({ error: "invalid payload" }), { status: 400 });
  }
  if (tooLong(record, { name: 120, email: 200, topic: 200, message: 5000 })) {
    return new Response(JSON.stringify({ error: "invalid payload" }), { status: 400 });
  }
  if (rateLimited(request)) {
    console.warn("Contact message rejected: rate limited");
    return new Response(JSON.stringify({ error: "too many requests" }), { status: 429 });
  }

  const formSecret = import.meta.env.BOOKING_SECRET;
  if (formSecret) {
    const verdict = verifyFormToken(record.formToken, formSecret);
    if (verdict !== "ok") {
      console.warn("Contact message rejected: form token", verdict);
      return new Response(JSON.stringify({ error: "invalid payload" }), { status: 400 });
    }
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set — contact form submission was not sent.", { name, email, topic });
    return new Response(JSON.stringify({ error: "email not configured" }), { status: 500 });
  }

  try {
    const resend = new Resend(apiKey);
    // The Resend SDK resolves (does not throw) when the API rejects a send —
    // it returns an `error` object instead. Without this check a refused send
    // reports success to the visitor and silently vanishes.
    const { error } = await resend.emails.send({
      // Sending from the verified domain, not Resend's shared onboarding@resend.dev
      // test sender — that one may only deliver to the Resend account's own address,
      // which silently blocked every submission to hello@lirazaxelrad.com.
      // noreply@ needs no inbox: replies go to the visitor via replyTo below.
      from: "Website contact form <noreply@lirazaxelrad.com>",
      to: TO_EMAIL,
      replyTo: email,
      subject: `New message from ${name}${topic ? ` — ${topic}` : ""}`,
      // `||` not `??` — an unpicked topic arrives as "", not undefined.
      text: `From: ${name} <${email}>\nTopic: ${topic || "No topic selected"}\n\n${message}`,
    });
    if (error) {
      console.error("Resend rejected the send", { error, to: TO_EMAIL, from: email });
      return new Response(JSON.stringify({ error: "send rejected" }), { status: 502 });
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("Resend send failed", err);
    return new Response(JSON.stringify({ error: "send failed" }), { status: 502 });
  }
};
