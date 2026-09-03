/**
 * Single source of truth for every hard fact about the party.
 * Anything that appears in the decree, the countdown, the .ics file and the
 * OG card reads from here, so a date change is a one-line change.
 */

export const TIMEZONE = "Asia/Beirut";

/** Party start: 6 September 2026, 18:00 Beirut (UTC+3 in September / EEST). */
export const EVENT_START_ISO = "2026-09-06T18:00:00+03:00";
/** Assumed 4 hours; only used for the calendar entry's end time. */
export const EVENT_END_ISO = "2026-09-06T22:00:00+03:00";

/** RSVP closes end of day Friday 4 September 2026, Beirut time. */
export const RSVP_DEADLINE_ISO = "2026-09-04T23:59:59+03:00";

export const EVENT_START = new Date(EVENT_START_ISO);
export const EVENT_END = new Date(EVENT_END_ISO);
export const RSVP_DEADLINE = new Date(RSVP_DEADLINE_ISO);

export const VENUE = {
  name: "Burger King",
  area: "Raouché, Beirut",
  mapsUrl: "https://maps.app.goo.gl/RKV1sgxDqdAV2tG96",
} as const;

export const DRESS_CODE = "Light colors";

export const FEE = {
  amount: "990,000 L.L.",
  per: "per guest",
  payment: "Cash at the door",
  includes: [
    "Kids meal",
    "A toy",
    "Animation",
    "Face paint",
    "A character",
  ],
} as const;

export const HOSTS = { king: "Abed", queen: "Lynn" } as const;

export const SITE_NAME = "Double Crown";

/**
 * Format a date in Beirut regardless of the viewer's own timezone.
 * Deriving the weekday (rather than hardcoding it) keeps the decree honest
 * if the date ever moves.
 */
export function formatInBeirut(
  date: Date,
  options: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat("en-GB", {
    ...options,
    timeZone: TIMEZONE,
  }).format(date);
}

export const EVENT_WEEKDAY = formatInBeirut(EVENT_START, { weekday: "long" });
export const EVENT_DATE_LONG = formatInBeirut(EVENT_START, {
  day: "numeric",
  month: "long",
  year: "numeric",
});
export const EVENT_TIME = formatInBeirut(EVENT_START, {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});
export const RSVP_DEADLINE_LABEL = formatInBeirut(RSVP_DEADLINE, {
  weekday: "long",
  day: "numeric",
  month: "long",
});
