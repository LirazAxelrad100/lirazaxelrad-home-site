import IcalExpander from "ical-expander";
import { bookingConfig, type BookingConfig } from "../config/booking";

/**
 * Reads Liraz's real calendar so the booking page stops offering times she is
 * already busy.
 *
 * Deliberately uses Google Calendar's **secret iCal address** rather than the
 * Calendar API: it is read-only, needs no OAuth, no Google Cloud project and
 * no refresh tokens that expire a year from now. The trade-off is that Google
 * caches that feed — sometimes for hours — so a meeting added a moment ago may
 * not block a slot immediately. Liraz approves every booking by hand, so a
 * stale feed costs her one decline, not a double-booking.
 */

export interface BusyInterval {
  start: number;
  end: number;
}

/**
 * The feed is a couple of megabytes and every visitor to the contact page
 * triggers a slot lookup, so it is cached in module scope — which survives
 * between warm serverless invocations. Five minutes costs nothing in
 * freshness: Google's own copy of this feed is often hours stale anyway, and
 * Liraz approves every booking by hand.
 */
const FEED_TTL_MS = 5 * 60_000;
let feedCache: { fetchedAt: number; from: number; to: number; intervals: BusyInterval[] } | null = null;

/**
 * Busy periods from the calendar feed, already widened by the buffer so the
 * gap she wants around meetings applies to the ones already in her calendar,
 * not only to calls booked through the site.
 *
 * Returns an empty list — offering everything — if the calendar cannot be
 * read. That is the deliberate failure direction: a Google hiccup should make
 * the page over-offer (she declines a clash, exactly as it worked before this
 * existed) rather than show a visitor an empty page that looks broken.
 */
export async function busyIntervals(
  from: number,
  to: number,
  config: BookingConfig = bookingConfig,
): Promise<BusyInterval[]> {
  const url = import.meta.env.CALENDAR_ICS_URL;
  if (!url) return [];

  // The *parsed* intervals are cached, not the raw feed: parsing two
  // megabytes took ~0.7s on every request when only the download was cached.
  const fresh = feedCache && Date.now() - feedCache.fetchedAt < FEED_TTL_MS;
  if (fresh && feedCache!.from <= from && feedCache!.to >= to) return feedCache!.intervals;

  let ics: string;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) {
      console.error("Calendar feed responded", res.status);
      return feedCache?.intervals ?? [];
    }
    ics = await res.text();
  } catch (err) {
    console.error("Calendar feed could not be fetched", err);
    // Serve the last good copy rather than over-offering on a blip.
    return feedCache?.intervals ?? [];
  }

  // Parsed over a slightly wider window than asked for, so the cache stays
  // usable as `now` creeps forward between requests.
  const paddedFrom = from - 86_400_000;
  const paddedTo = to + 86_400_000;
  const intervals = parseBusy(ics, paddedFrom, paddedTo, config);
  feedCache = { fetchedAt: Date.now(), from: paddedFrom, to: paddedTo, intervals };
  return intervals;
}

/** Split out from the fetch so the parsing rules can be tested directly. */
export function parseBusy(
  ics: string,
  from: number,
  to: number,
  config: BookingConfig = bookingConfig,
): BusyInterval[] {
  try {
    const expander = new IcalExpander({ ics, maxIterations: 2000 });
    // `between` expands recurring events into their individual occurrences —
    // the reason a library is used here rather than hand-parsing. Her weekly
    // sessions are recurring events, and getting RRULE subtly wrong would
    // silently offer times she is teaching.
    const { events, occurrences } = expander.between(new Date(from), new Date(to));

    const all = [
      ...events.map((e: any) => ({ event: e, start: e.startDate, end: e.endDate })),
      ...occurrences.map((o: any) => ({ event: o.item, start: o.startDate, end: o.endDate })),
    ];

    const bufferMs = config.bufferMinutes * 60_000;
    const busy: BusyInterval[] = [];

    for (const { event, start, end } of all) {
      // Events she marked "Free" in Google Calendar are hers to ignore — it is
      // the one manual override she has without touching the config file.
      if (event.component?.getFirstPropertyValue("transp") === "TRANSPARENT") continue;

      // All-day entries are usually birthdays, holidays and reminders rather
      // than "I am away" — blocking on them would close whole days by
      // surprise. Use `blockedDates` in the config for real absences.
      if (!config.blockOnAllDayEvents && start.isDate) continue;

      busy.push({
        start: start.toJSDate().getTime() - bufferMs,
        end: end.toJSDate().getTime() + bufferMs,
      });
    }

    return busy;
  } catch (err) {
    console.error("Calendar feed could not be parsed", err);
    return [];
  }
}

/** True if a call occupying [start, end) runs into anything already booked. */
export function overlapsBusy(start: number, end: number, busy: BusyInterval[]) {
  // Strict comparison, so a call ending exactly when a busy period begins is
  // allowed — the buffer is already baked into the busy interval above.
  return busy.some((b) => start < b.end && end > b.start);
}
