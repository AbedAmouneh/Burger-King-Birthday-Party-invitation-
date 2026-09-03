/**
 * Five crown styles. CLAUDE.md asks for these to be mixed across sticker
 * instances rather than one fixed crown per person, so nobody is permanently
 * "the king" or "the queen".
 */

const OUTLINE = "#3d1b0e";

type CrownProps = { className?: string };

export function KingCrown({ className }: CrownProps) {
  return (
    <svg viewBox="0 0 120 84" className={className} aria-hidden="true">
      <path
        d="M12 74 L6 22 L34 44 L60 10 L86 44 L114 22 L108 74 Z"
        fill="#ffc72c"
        stroke={OUTLINE}
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <path d="M12 62 L108 62" stroke={OUTLINE} strokeWidth="6" />
      <circle cx="60" cy="34" r="7" fill="#d62300" stroke={OUTLINE} strokeWidth="4" />
    </svg>
  );
}

export function QueenCrown({ className }: CrownProps) {
  return (
    <svg viewBox="0 0 120 84" className={className} aria-hidden="true">
      <path
        d="M14 74 C10 46 22 30 34 38 C40 16 52 8 60 8 C68 8 80 16 86 38
           C98 30 110 46 106 74 Z"
        fill="#f5821f"
        stroke={OUTLINE}
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <g fill="#fdf1dc" stroke={OUTLINE} strokeWidth="4">
        <circle cx="34" cy="34" r="6" />
        <circle cx="60" cy="14" r="6" />
        <circle cx="86" cy="34" r="6" />
      </g>
    </svg>
  );
}

/** Parody paper crown: the shape, none of the branding. */
export function PaperCrown({ className }: CrownProps) {
  return (
    <svg viewBox="0 0 120 84" className={className} aria-hidden="true">
      <path
        d="M8 76 L16 30 L38 50 L60 16 L82 50 L104 30 L112 76 Z"
        fill="#f2b968"
        stroke={OUTLINE}
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <path
        d="M20 66 L100 66"
        stroke="#d62300"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Tiara({ className }: CrownProps) {
  return (
    <svg viewBox="0 0 120 84" className={className} aria-hidden="true">
      <path
        d="M10 72 C10 44 32 26 60 26 C88 26 110 44 110 72 Z"
        fill="#1e3a8a"
        stroke={OUTLINE}
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <path
        d="M60 26 L60 8 M46 16 L60 8 L74 16"
        fill="none"
        stroke={OUTLINE}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="60" cy="8" r="8" fill="#ffc72c" stroke={OUTLINE} strokeWidth="5" />
    </svg>
  );
}

export function JesterHat({ className }: CrownProps) {
  return (
    <svg viewBox="0 0 120 84" className={className} aria-hidden="true">
      <path
        d="M18 76 C10 40 26 18 60 18 C94 18 110 40 102 76 Z"
        fill="#d62300"
        stroke={OUTLINE}
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <path
        d="M60 18 C60 6 44 2 34 12"
        fill="none"
        stroke={OUTLINE}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <circle cx="32" cy="12" r="9" fill="#ffc72c" stroke={OUTLINE} strokeWidth="5" />
      <circle cx="94" cy="26" r="9" fill="#ffc72c" stroke={OUTLINE} strokeWidth="5" />
    </svg>
  );
}

export const CROWNS = [
  KingCrown,
  QueenCrown,
  PaperCrown,
  Tiara,
  JesterHat,
] as const;

/**
 * Pick a crown from a stable key. Math.random() would choose one crown on the
 * server and a different one on the client, which React reports as a hydration
 * mismatch; a hash of the key gives the same answer in both places while still
 * looking scattered.
 */
export function crownFor(key: string) {
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return CROWNS[hash % CROWNS.length];
}
