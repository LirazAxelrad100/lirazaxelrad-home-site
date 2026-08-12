import { NextResponse } from "next/server";
import { Resend } from "resend";

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

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!isContactPayload(body)) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }
  const { name, email, topic, message } = body;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set — contact form submission was not sent.", { name, email, topic });
    return NextResponse.json({ error: "email not configured" }, { status: 500 });
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
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend send failed", err);
    return NextResponse.json({ error: "send failed" }, { status: 502 });
  }
}
