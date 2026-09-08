import { createHmac, timingSafeEqual, randomUUID } from "node:crypto";
import { bookingConfig, type BookingConfig } from "../config/booking";
import { busyIntervals, overlapsBusy } from "./calendar";

/**
 * Slot maths, signing and calendar-invite building for the booking feature.
 *
 * Everything here works in UTC milliseconds internally. Wall-clock times only
 * appear at the two edges: the availability windows Liraz writes in her own
 * timezone, and the times a visitor sees in theirs. That matters more than it
 * sounds — Israel and the EU change clocks on different dates, so for about
 * two weeks a year the Berlin/Jerusalem gap is not the usual one. Anything
 * that stores a fixed offset instead of a real timezone gets those weeks wrong.
 */

/** How far `timeZone` is ahead of UTC at a given instant, in milliseconds. */
function zoneOffsetMs(utcMs: number, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts: Record<string, string> = {};
  for (const p of dtf.formatToParts(new Date(utcMs))) parts[p.type] = p.value;
  const asIfUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second),
  );
  return asIfUtc - utcMs;
}

/**
 * Turn a wall-clock time in `timeZone` into a UTC instant.
 *
 * Done in two passes: the first guess uses the offset at the wrong instant,
 * the second re-reads the offset at the corrected one. That second pass is
 * what makes the hours either side of a DST change land correctly.
 */
export function zonedTimeToUtcMs(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
): number {
  const naive = Date.UTC(year, month - 1, day, hour, minute);
  let utc = naive - zoneOffsetMs(naive, timeZone);
  utc = naive - zoneOffsetMs(utc, timeZone);
  return utc;
}

/** The civil (calendar) date it is *right now* in `timeZone`. */
function civilTodayIn(timeZone: string, now: number) {
  const dtf = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [year, month, day] = dtf.format(new Date(now)).split("-").map(Number);
  return { year, month, day };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function parseClock(value: string) {
  const [hour, minute] = value.split(":").map(Number);
  return { hour, minute };
}

/**
 * Every bookable slot start, as UTC milliseconds, soonest first.
 *
 * Slots step by duration + buffer, so the gap Liraz asked for is built into
 * the grid itself rather than checked afterwards.
 *
 * This is her standing availability only. What is already in her calendar is
 * subtracted by `offeredSlots` below — kept separate so the pure grid stays
 * synchronous and testable.
 */
export function availableSlots(now = Date.now(), config: BookingConfig = bookingConfig): number[] {
  const { timeZone, durationMinutes, bufferMinutes, minNoticeHours, horizonDays } = config;
  const stepMs = (durationMinutes + bufferMinutes) * 60_000;
  const durationMs = durationMinutes * 60_000;
  const earliest = now + minNoticeHours * 3_600_000;
  const latest = now + horizonDays * 86_400_000;

  const today = civilTodayIn(timeZone, now);
  const slots: number[] = [];

  for (let dayOffset = 0; dayOffset <= horizonDays; dayOffset++) {
    // Civil-date arithmetic via Date.UTC is safe: no timezone is involved
    // until the window times below are converted.
    const cursor = new Date(Date.UTC(today.year, today.month - 1, today.day + dayOffset));
    const year = cursor.getUTCFullYear();
    const month = cursor.getUTCMonth() + 1;
    const day = cursor.getUTCDate();
    const isoDate = `${year}-${pad(month)}-${pad(day)}`;

    if (config.blockedDates.includes(isoDate)) continue;

    const windows = config.weeklyAvailability[cursor.getUTCDay()];
    if (!windows?.length) continue;

    for (const window of windows) {
      const from = parseClock(window.start);
      const to = parseClock(window.end);
      const windowEnd = zonedTimeToUtcMs(year, month, day, to.hour, to.minute, timeZone);

      for (
        let slot = zonedTimeToUtcMs(year, month, day, from.hour, from.minute, timeZone);
        slot + durationMs <= windowEnd;
        slot += stepMs
      ) {
        if (slot >= earliest && slot <= latest) slots.push(slot);
      }
    }
  }

  return slots.sort((a, b) => a - b);
}

/**
 * The slots actually offered: her standing availability, minus whatever is
 * already in her calendar. Both the slot list and the booking endpoint go
 * through this, so a crafted request cannot book over a real meeting either.
 */
export async function offeredSlots(now = Date.now(), config: BookingConfig = bookingConfig): Promise<number[]> {
  const slots = availableSlots(now, config);
  if (slots.length === 0) return slots;

  const durationMs = config.durationMinutes * 60_000;
  const busy = await busyIntervals(slots[0], slots[slots.length - 1] + durationMs, config);
  if (busy.length === 0) return slots;

  return slots.filter((slot) => !overlapsBusy(slot, slot + durationMs, busy));
}

/** True if `startMs` is a slot the site is currently offering. */
export async function isOfferedSlot(startMs: number, now = Date.now(), config: BookingConfig = bookingConfig) {
  return (await offeredSlots(now, config)).includes(startMs);
}

/** Human-readable time in a given zone, for emails. */
export function formatInZone(utcMs: number, timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(utcMs));
}

/* ------------------------------------------------------------------ */
/* Signed approval links                                               */
/* ------------------------------------------------------------------ */

export interface BookingRequest {
  name: string;
  email: string;
  phone: string;
  topic: string;
  /** Slot start, UTC milliseconds. */
  start: number;
  /** The visitor's own timezone, so the confirmation speaks their local time. */
  visitorTimeZone: string;
  /** Which language the visitor booked in, so the confirmation matches. */
  locale: "he" | "en";
}

function base64url(input: Buffer | string) {
  return Buffer.from(input).toString("base64url");
}

/**
 * The whole booking travels inside the approval link, signed. That is what
 * lets this feature run with no database at all: nothing has to be remembered
 * between the visitor's request and Liraz clicking approve.
 */
export function signBooking(request: BookingRequest, secret: string): string {
  const payload = base64url(JSON.stringify(request));
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyBooking(token: string, secret: string): BookingRequest | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  const given = Buffer.from(signature);
  const want = Buffer.from(expected);
  // Length check first: timingSafeEqual throws on a length mismatch.
  if (given.length !== want.length || !timingSafeEqual(given, want)) return null;

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString()) as BookingRequest;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Calendar invite                                                     */
/* ------------------------------------------------------------------ */

function icsStamp(ms: number) {
  return new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Escape the characters iCalendar treats as structure. */
function icsText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

export function buildIcs(
  request: BookingRequest,
  config: BookingConfig = bookingConfig,
  uid = `${randomUUID()}@lirazaxelrad.com`,
) {
  const end = request.start + config.durationMinutes * 60_000;
  const summary = `${config.organizerName} & ${request.name} — intro call`;
  const description = [
    `Topic: ${request.topic || "—"}`,
    `Email: ${request.email}`,
    `Phone: ${request.phone || "—"}`,
  ].join("\n");

  // METHOD:REQUEST makes mail clients show this as an invitation with RSVP
  // buttons rather than a plain attachment.
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//lirazaxelrad.com//booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${icsStamp(Date.now())}`,
    `DTSTART:${icsStamp(request.start)}`,
    `DTEND:${icsStamp(end)}`,
    `SUMMARY:${icsText(summary)}`,
    `DESCRIPTION:${icsText(description)}`,
    `LOCATION:${icsText(config.meetingLocation)}`,
    `ORGANIZER;CN=${icsText(config.organizerName)}:mailto:${config.organizerEmail}`,
    `ATTENDEE;CN=${icsText(request.name)};RSVP=TRUE:mailto:${request.email}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
