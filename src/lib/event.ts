/**
 * Single source of truth for every hard fact about the party.
 * Anything that appears in the decree, the countdown, the .ics file and the
 * OG card reads from here, so a date change is a one-line change.
 */

export const TIMEZONE = "Asia/Beirut";

/** Party runs 18:30 to 20:30 Beirut (UTC+3 in September / EEST). */
export const EVENT_START_ISO = "2026-09-06T18:30:00+03:00";
export const EVENT_END_ISO = "2026-09-06T20:30:00+03:00";

/**
 * The date the decree asks people to reply by. It is a request, not a gate:
 * nothing locks the form. A client-side lock also depended on the visitor's
 * own clock, so a phone set wrong would have shut a guest out with no recourse.
 */
export const RSVP_DEADLINE_ISO = "2026-09-05T23:59:59+03:00";

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
const timeOnly = (d: Date) =>
  formatInBeirut(d, { hour: "numeric", minute: "2-digit", hour12: true });

export const EVENT_TIME = timeOnly(EVENT_START);
export const EVENT_END_TIME = timeOnly(EVENT_END);

/** Guests need the finish time as much as the start: it is a two-hour slot. */
export const EVENT_TIME_RANGE = `${EVENT_TIME} to ${EVENT_END_TIME}`;
export const RSVP_DEADLINE_LABEL = formatInBeirut(RSVP_DEADLINE, {
  weekday: "long",
  day: "numeric",
  month: "long",
});

// ---------------------------------------------------------------------------
// Side quest: the informal one the night before.
// ---------------------------------------------------------------------------

export const SIDE_QUEST = {
  venue: "Frozen Cherry",
  startIso: "2026-09-05T18:00:00+03:00",
  // The ?igsi= parameter Instagram appends is a share-tracking token tied to
  // whoever copied the link, so it is stripped rather than published.
  reelUrl: "https://www.instagram.com/reel/DcwI0PYAGpI/",
} as const;

export const SIDE_QUEST_START = new Date(SIDE_QUEST.startIso);

export const SIDE_QUEST_WHEN = `${formatInBeirut(SIDE_QUEST_START, {
  weekday: "long",
  day: "numeric",
  month: "long",
})}, ${timeOnly(SIDE_QUEST_START)}`;
