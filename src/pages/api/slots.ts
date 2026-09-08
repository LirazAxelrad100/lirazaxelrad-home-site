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
        // This matters more than the in-process cache: at this site's traffic
        // almost every visitor would otherwise arrive after that cache had
        // expired and pay the full 2.2MB download and parse themselves.
        // `stale-while-revalidate` means even the unlucky one gets an instant
        // answer while the refresh happens behind them.
        //
        // The cost is that a slot Liraz just blocked can linger a few minutes.
        // She approves every booking by hand, so that costs one decline.
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    },
  );
