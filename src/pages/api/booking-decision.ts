import type { APIRoute } from "astro";
import { Resend } from "resend";
import { bookingConfig } from "../../config/booking";
import { buildIcs, formatInZone, verifyBooking } from "../../lib/booking";

export const prerender = false;

/** Wording for the visitor's confirmation, in the language they booked in. */
const messages = {
  en: {
    approvedSubject: (when: string) => `Confirmed: our call on ${when}`,
    approvedBody: (when: string, zone: string) =>
      [
        `Your call is confirmed for ${when} (${zone}).`,
        "",
        `Where: ${bookingConfig.meetingLocation}`,
        "",
        "The attached invitation will add it to your calendar.",
        "If you need to change or cancel, just reply to this email.",
        "",
        "Looking forward to talking,",
        bookingConfig.organizerName,
      ].join("\n"),
    declinedSubject: "About your call request",
    declinedBody: [
      "Thank you for asking to talk — unfortunately that time does not work after all.",
      "",
      "Please pick another slot, or reply to this email and we will find a time together.",
      "",
      bookingConfig.organizerName,
    ].join("\n"),
  },
  he: {
    approvedSubject: (when: string) => `אישור: השיחה שלנו ב־${when}`,
    approvedBody: (when: string, zone: string) =>
      [
        `השיחה שלנו נקבעה ל־${when} (${zone}).`,
        "",
        `איפה: ${bookingConfig.meetingLocation}`,
        "",
        "ההזמנה המצורפת תוסיף את הפגישה ליומן שלך.",
        "אם צריך לשנות או לבטל, אפשר פשוט להשיב למייל הזה.",
        "",
        "נשמח לדבר,",
        "לירז",
      ].join("\n"),
    declinedSubject: "לגבי בקשת השיחה שלך",
    declinedBody: [
      "תודה על הפנייה — לצערי המועד הזה בכל זאת לא מסתדר.",
      "",
      "אפשר לבחור מועד אחר, או להשיב למייל הזה ונמצא יחד זמן שמתאים.",
      "",
      "לירז",
    ].join("\n"),
  },
};

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData().catch(() => null);
  const token = form?.get("token");
  const action = form?.get("action");
  if (typeof token !== "string" || (action !== "approve" && action !== "decline")) {
    return new Response("Bad request", { status: 400 });
  }

  const secret = import.meta.env.BOOKING_SECRET;
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!secret || !apiKey) {
    console.error("Booking is not configured");
    return new Response("Booking is not configured", { status: 500 });
  }

  const booking = verifyBooking(token, secret);
  if (!booking) return new Response("This link is not valid.", { status: 400 });

  const copy = messages[booking.locale] ?? messages.en;
  const whenThem = formatInZone(booking.start, booking.visitorTimeZone);
  const whenHer = formatInZone(booking.start, bookingConfig.timeZone);
  const resend = new Resend(apiKey);

  try {
    if (action === "decline") {
      const { error } = await resend.emails.send({
        from: `${bookingConfig.organizerName} <noreply@lirazaxelrad.com>`,
        to: booking.email,
        replyTo: bookingConfig.organizerEmail,
        subject: copy.declinedSubject,
        text: copy.declinedBody,
      });
      if (error) throw new Error(JSON.stringify(error));
      return redirect(`/booking-review?token=${encodeURIComponent(token)}&done=declined`, 303);
    }

    const ics = buildIcs(booking);
    const attachment = { filename: "call.ics", content: Buffer.from(ics).toString("base64") };

    const { error } = await resend.emails.send({
      from: `${bookingConfig.organizerName} <noreply@lirazaxelrad.com>`,
      to: booking.email,
      replyTo: bookingConfig.organizerEmail,
      subject: copy.approvedSubject(whenThem),
      text: copy.approvedBody(whenThem, booking.visitorTimeZone),
      attachments: [attachment],
    });
    if (error) throw new Error(JSON.stringify(error));

    // The same invitation to Liraz. Accepting it is what puts the meeting in
    // her calendar — which is also what will hide the slot once the booking
    // page starts reading her calendar.
    const { error: mineError } = await resend.emails.send({
      from: "Website booking <noreply@lirazaxelrad.com>",
      to: bookingConfig.organizerEmail,
      replyTo: booking.email,
      subject: `Confirmed: ${booking.name} — ${whenHer}`,
      text: [
        `You approved this call. ${booking.name} has been told.`,
        "",
        `When:   ${whenHer}`,
        `Email:  ${booking.email}`,
        `Phone:  ${booking.phone || "—"}`,
        `Topic:  ${booking.topic || "—"}`,
        "",
        "Accept the attached invitation to put it in your calendar.",
      ].join("\n"),
      attachments: [attachment],
    });
    if (mineError) console.error("Confirmation copy to organizer failed", mineError);

    return redirect(`/booking-review?token=${encodeURIComponent(token)}&done=approved`, 303);
  } catch (err) {
    console.error("Booking decision failed", err);
    return new Response("Something went wrong sending the email. Please try again.", { status: 502 });
  }
};
