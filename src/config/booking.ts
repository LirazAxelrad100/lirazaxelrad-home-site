/**
 * Everything about the "book a free 30-minute call" feature that Liraz may
 * want to change is in this one file. Edit it, commit, and the site updates —
 * no other file needs touching.
 *
 * Times are written in YOUR timezone (`timeZone` below). Visitors always see
 * the slots converted into their own local time automatically.
 */

export interface AvailabilityWindow {
  /** 24h clock, in `timeZone`. */
  start: string;
  end: string;
}

export const bookingConfig = {
  /** Your timezone. Slot times below are written in this zone. */
  timeZone: "Europe/Berlin",

  /** Length of the call offered. */
  durationMinutes: 30,

  /**
   * Free time kept after every call, so meetings never run back-to-back.
   * With a 30-minute call and a 30-minute buffer, a 09:30 slot is followed by
   * 10:30, not 10:00 — which is what Liraz asked for.
   */
  bufferMinutes: 30,

  /** Nobody can book something starting sooner than this. */
  minNoticeHours: 24,

  /** How far into the future slots are offered. */
  horizonDays: 21,

  /**
   * Which hours are open, per weekday. 0 = Sunday ... 6 = Saturday.
   * Delete a day to close it; add a second window for a split day, e.g.
   *   2: [{ start: "10:00", end: "12:00" }, { start: "14:00", end: "17:00" }]
   */
  weeklyAvailability: {
    1: [{ start: "09:00", end: "12:00" }],
    2: [{ start: "14:00", end: "17:00" }],
    4: [
      { start: "09:00", end: "12:00" },
      { start: "14:00", end: "18:00" },
    ],
    5: [{ start: "09:00", end: "12:00" }],
  } as Record<number, AvailabilityWindow[]>,

  /**
   * One-off days to close completely (holidays, travel), as YYYY-MM-DD in
   * your own timezone.
   */
  blockedDates: [] as string[],

  /** Where the approval request is sent, and who the invite comes from. */
  organizerName: "Liraz Axelrad",
  organizerEmail: "hello@lirazaxelrad.com",

  /** Shown in the confirmation email and the calendar invite. */
  meetingLocation: "Google Meet: https://meet.google.com/ujv-vwsk-fcc",
};

export type BookingConfig = typeof bookingConfig;
