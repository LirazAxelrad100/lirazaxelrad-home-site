import type { APIRoute } from "astro";
import { issueFormToken } from "../../lib/antispam";

export const prerender = false;

/**
 * Handed to a form when it opens, and checked when it is submitted — proof
 * that someone actually loaded the page, and how long ago.
 */
export const GET: APIRoute = () => {
  const secret = import.meta.env.BOOKING_SECRET;
  if (!secret) {
    console.error("BOOKING_SECRET is not set — form tokens cannot be issued.");
    return new Response(JSON.stringify({ error: "not configured" }), { status: 500 });
  }
  return new Response(JSON.stringify({ token: issueFormToken(secret) }), {
    status: 200,
    // Never cached: a reused token would defeat the timing check.
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
};
