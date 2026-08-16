import type { APIRoute } from "astro";
import { Resend } from "resend";

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

  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set — contact form submission was not sent.", { name, email, topic });
    return new Response(JSON.stringify({ error: "email not configured" }), { status: 500 });
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "Website contact form <onboarding@resend.dev>",
      to: TO_EMAIL,
      replyTo: email,
      subject: `New message from ${name}${topic ? ` — ${topic}` : ""}`,
      text: `From: ${name} <${email}>\nTopic: ${topic ?? "-"}\n\n${message}`,
    });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("Resend send failed", err);
    return new Response(JSON.stringify({ error: "send failed" }), { status: 502 });
  }
};
