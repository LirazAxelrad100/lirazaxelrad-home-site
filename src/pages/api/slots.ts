import type { APIRoute } from "astro";
import { bookingConfig } from "../../config/booking";
import { offeredSlots } from "../../lib/booking";

export const prerender = false;

/**
 * Open slots, as UTC milliseconds. Computed per request rather than at build
 * time so the list is never stale, and returned as instants rather than
 * wall-clock strings so the browser can render them in the visitor's own zone.
 */
export const GET: APIRoute = async () =>
  new Response(
    JSON.stringify({
      slots: await offeredSlots(),
      durationMinutes: bookingConfig.durationMinutes,
      organizerTimeZone: bookingConfig.timeZone,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // Cached at Vercel's edge, not just inside the function. The response
        // is identical for every visitor — slots are UTC instants, and the
        // conversion to local time happens in the browser — so there is
        // nothing visitor-specific to leak.
        //
        // The long `stale-while-revalidate` is the important number here, and
        // it is long *because* this site has few visitors, not despite it. A
        // cold request costs ~8s (function start, then 2.2MB downloaded and
        // parsed). With sparse traffic nearly every visitor would be that cold
        // request. A day-long stale window means the edge always has an answer
        // to hand back immediately, and the refresh happens behind whoever
        // triggered it — so the wait lands on nobody.
        //
        // The cost: the first visitor after a very quiet stretch can see slots
        // up to a day stale, and might request one Liraz has since filled.
        // She approves every booking by hand, so that costs a decline, not a
        // double-booking — and the next visitor sees the corrected list.
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
      },
    },
  );
