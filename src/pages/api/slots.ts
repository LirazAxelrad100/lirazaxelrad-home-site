import type { APIRoute } from "astro";
import { bookingConfig } from "../../config/booking";
import { availableSlots } from "../../lib/booking";

export const prerender = false;

/**
 * Open slots, as UTC milliseconds. Computed per request rather than at build
 * time so the list is never stale, and returned as instants rather than
 * wall-clock strings so the browser can render them in the visitor's own zone.
 */
export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      slots: availableSlots(),
      durationMinutes: bookingConfig.durationMinutes,
      organizerTimeZone: bookingConfig.timeZone,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // Short cache: slots change only when a day rolls over or the config
        // changes, but a stale minute here would show a slot that just fell
        // inside the 24h notice window.
        "Cache-Control": "public, max-age=60",
      },
    },
  );
