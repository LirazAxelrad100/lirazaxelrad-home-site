import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Lightweight spam defences for the contact and booking forms.
 *
 * Deliberately no CAPTCHA. This site's whole purpose is being easy to reach,
 * a puzzle costs real submissions, and reCAPTCHA would send every EU
 * visitor's data to Google. Three cheap layers instead, none of which a
 * genuine visitor ever notices. If spam ever gets through these, the
 * escalation is Cloudflare Turnstile — free, privacy-preserving, and the DNS
 * is already there.
 */

/** Bots fill every field they find; people never see this one. */
export const HONEYPOT_FIELD = "website";

export function honeypotTripped(body: Record<string, unknown>) {
  const value = body[HONEYPOT_FIELD];
  return typeof value === "string" && value.trim().length > 0;
}

/* ------------------------------------------------------------------ */
/* Form tokens — proof the form was actually opened, and when          */
/* ------------------------------------------------------------------ */

const MIN_FILL_MS = 3_000;
const MAX_FORM_AGE_MS = 6 * 60 * 60_000;

/**
 * Issued when a form is opened, checked when it is submitted. A timestamp the
 * browser reports could simply be lied about; this one is signed, so the only
 * way to have a valid recent token is to have actually loaded the form.
 */
export function issueFormToken(secret: string, now = Date.now()): string {
  const issued = String(now);
  const signature = createHmac("sha256", secret).update(issued).digest("base64url");
  return `${issued}.${signature}`;
}

export type TokenVerdict = "ok" | "missing" | "invalid" | "too-fast" | "expired";

export function verifyFormToken(token: unknown, secret: string, now = Date.now()): TokenVerdict {
  if (typeof token !== "string" || !token.includes(".")) return "missing";

  const [issued, signature] = token.split(".");
  const expected = createHmac("sha256", secret).update(issued).digest("base64url");
  const given = Buffer.from(signature);
  const want = Buffer.from(expected);
  if (given.length !== want.length || !timingSafeEqual(given, want)) return "invalid";

  const age = now - Number(issued);
  // Submitted before a person could plausibly have typed the form.
  if (age < MIN_FILL_MS) return "too-fast";
  // Left open overnight; harmless, but a fresh token costs nothing.
  if (age > MAX_FORM_AGE_MS) return "expired";
  return "ok";
}

/* ------------------------------------------------------------------ */
/* Rate limiting                                                       */
/* ------------------------------------------------------------------ */

const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

/**
 * Per-IP throttle held in module scope. On serverless this is per-instance
 * rather than global, so it is a speed bump rather than a wall — enough to
 * stop one script hammering the endpoint, which is the realistic threat at
 * this site's size. A shared store would need a database, and the whole
 * design avoids one.
 */
export function rateLimited(request: Request, now = Date.now()): boolean {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Opportunistic cleanup so the map cannot grow without bound.
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }

  return recent.length > MAX_PER_WINDOW;
}

/** Guards against megabyte payloads in fields meant to hold a sentence. */
export function tooLong(body: Record<string, unknown>, limits: Record<string, number>) {
  return Object.entries(limits).some(([field, max]) => {
    const value = body[field];
    return typeof value === "string" && value.length > max;
  });
}
