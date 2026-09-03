/**
 * The sticker sheet that came with the toy. Flat fills, one heavy outline, no
 * gradients: 90s print art, and it keeps every sticker legible at ~60px.
 */

const O = "#3d1b0e";
const SW = 7;

type S = { className?: string };

export function Fries({ className }: S) {
  return (
    <svg viewBox="0 0 100 120" className={className} aria-hidden="true">
      <g stroke={O} strokeWidth={SW} strokeLinejoin="round">
        <path d="M24 46 L18 8 L32 6 L38 44Z" fill="#ffc72c" />
        <path d="M40 44 L38 4 L52 4 L54 44Z" fill="#ffe08a" />
        <path d="M56 44 L64 6 L78 10 L70 46Z" fill="#ffc72c" />
        {/* carton */}
        <path d="M12 40 L88 40 L78 114 L22 114Z" fill="#d62300" />
      </g>
      <path d="M28 56 L72 56" stroke="#ffc72c" strokeWidth="9" strokeLinecap="round" />
    </svg>
  );
}

export function Nugget({ className }: S) {
  return (
    <svg viewBox="0 0 110 90" className={className} aria-hidden="true">
      <path
        d="M14 52 C6 30 26 10 52 12 C82 14 104 34 98 56 C92 78 60 86 38 80 C24 76 18 66 14 52Z"
        fill="#f0a83c"
        stroke={O}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
      <g fill="#d98a26">
        <ellipse cx="42" cy="38" rx="11" ry="7" />
        <ellipse cx="72" cy="52" rx="9" ry="6" />
      </g>
    </svg>
  );
}

export function Ketchup({ className }: S) {
  return (
    <svg viewBox="0 0 90 110" className={className} aria-hidden="true">
      <path
        d="M12 16 L78 16 L78 96 L12 96Z"
        fill="#d62300"
        stroke={O}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
      <path d="M12 30 L78 30" stroke={O} strokeWidth="5" strokeDasharray="7 6" />
      <path
        d="M30 50 C30 44 60 44 60 50 C60 62 48 66 45 78 C42 66 30 62 30 50Z"
        fill="#ffc72c"
        stroke={O}
        strokeWidth="5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SodaCup({ className }: S) {
  return (
    <svg viewBox="0 0 96 124" className={className} aria-hidden="true">
      <path d="M52 8 L74 14 L60 34" fill="none" stroke={O} strokeWidth={SW} strokeLinecap="round" />
      <path
        d="M14 34 L82 34 L72 116 L24 116Z"
        fill="#1e3a8a"
        stroke={O}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
      <path d="M10 26 L86 26 L86 40 L10 40Z" fill="#ffc72c" stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M30 56 L66 56 M28 74 L64 74" stroke="#5b7ad1" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

/** 90s promo starburst. Used behind the price, and small as a sticker. */
export function Starburst({
  points = 16,
  className,
  fill = "#ffc72c",
  stroke = O,
}: S & { points?: number; fill?: string; stroke?: string }) {
  const cx = 50;
  const cy = 50;
  const outer = 48;
  const inner = 37;
  let d = "";
  for (let i = 0; i < points * 2; i += 1) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * i) / points - Math.PI / 2;
    d += `${i === 0 ? "M" : "L"}${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)} `;
  }
  d += "Z";
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d={d} fill={fill} stroke={stroke} strokeWidth="4" strokeLinejoin="round" />
    </svg>
  );
}
