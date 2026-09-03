import {
  EVENT_END,
  EVENT_START,
  FEE,
  SITE_NAME,
  VENUE,
  DRESS_CODE,
} from "./event";

/**
 * A stable UID means re-adding the event updates the existing entry instead of
 * creating a duplicate.
 */
const UID = "double-crown-2026@abed-and-lynn";

const TITLE = `${SITE_NAME}: Abed & Lynn`;
const LOCATION = `${VENUE.name}, ${VENUE.area}`;
const DESCRIPTION = [
  "By order of the King & Queen, you are summoned.",
  `Dress code: ${DRESS_CODE}.`,
  `Royal tribute: ${FEE.amount} ${FEE.per}. ${FEE.payment}.`,
  `Covers: ${FEE.includes.join(", ").toLowerCase()}.`,
  VENUE.mapsUrl,
].join("\n");

/** iCalendar UTC timestamp: 20260906T150000Z */
function toIcsUtc(date: Date): string {
  return `${date.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
}

/** RFC 5545 escaping for TEXT values. Backslash first, or it double-escapes. */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * RFC 5545 caps a content line at 75 octets, continued by CRLF + one space.
 * Folding is counted in BYTES, not characters, so a multi-byte character must
 * not be split across the boundary.
 */
function foldLine(line: string): string {
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= 75) return line;

  const out: string[] = [];
  let current = "";
  let bytes = 0;
  // Iterating the string yields whole code points, so surrogate pairs stay intact.
  for (const char of line) {
    const size = encoder.encode(char).length;
    // Continuation lines start with a space, which costs one of the 75 octets.
    const limit = out.length === 0 ? 75 : 74;
    if (bytes + size > limit) {
      out.push(current);
      current = "";
      bytes = 0;
    }
    current += char;
    bytes += size;
  }
  if (current) out.push(current);
  return out.join("\r\n ");
}

export function buildIcs(now: Date = new Date()): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Double Crown//Abed and Lynn//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${UID}`,
    `DTSTAMP:${toIcsUtc(now)}`,
    `DTSTART:${toIcsUtc(EVENT_START)}`,
    `DTEND:${toIcsUtc(EVENT_END)}`,
    `SUMMARY:${escapeText(TITLE)}`,
    `DESCRIPTION:${escapeText(DESCRIPTION)}`,
    `LOCATION:${escapeText(LOCATION)}`,
    `URL:${VENUE.mapsUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  // iCalendar requires CRLF line endings, and a trailing one.
  return `${lines.map(foldLine).join("\r\n")}\r\n`;
}

export function googleCalendarUrl(): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: TITLE,
    dates: `${toIcsUtc(EVENT_START)}/${toIcsUtc(EVENT_END)}`,
    details: DESCRIPTION,
    location: LOCATION,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Hand the browser a .ics file. Called from a click handler. */
export function downloadIcs(): void {
  const blob = new Blob([buildIcs()], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "double-crown.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke on the next tick: revoking synchronously can cancel the download.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
