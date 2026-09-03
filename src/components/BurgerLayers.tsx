/**
 * The Whopper, drawn as six independent layers.
 *
 * Each layer is its own <svg> on a shared 400-unit-wide coordinate system, so
 * the scroll-linked split can translate them apart without any of them
 * clipping the others. Thick dark outlines keep the cartoon-sticker look at
 * small sizes.
 */

const OUTLINE = "#3d1b0e";
const SW = 7;

type LayerProps = { className?: string };

/**
 * One birthday candle. Two of them turn the Whopper into the cake, which is
 * the whole point: without these the hero reads as lunch, not a party.
 */
function Candle({
  x,
  height,
  stripe,
  lightAt,
}: {
  x: number;
  height: number;
  stripe: string;
  /** When this wick catches, in the page's arrival sequence. */
  lightAt: number;
}) {
  const top = -height;
  return (
    <g>
      {/* wax */}
      <rect
        x={x - 14}
        y={top}
        width="28"
        height={height + 20}
        rx="9"
        fill="#fdf1dc"
        stroke={OUTLINE}
        strokeWidth="6"
      />
      {/* barber stripes */}
      <g stroke={stripe} strokeWidth="8" strokeLinecap="round">
        <path d={`M${x - 10} ${top + 18} L${x + 10} ${top + 7}`} />
        <path d={`M${x - 10} ${top + 40} L${x + 10} ${top + 29}`} />
        <path d={`M${x - 10} ${top + 62} L${x + 10} ${top + 51}`} />
      </g>
      {/* wick */}
      <path
        d={`M${x} ${top} L${x} ${top - 4}`}
        stroke={OUTLINE}
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* flame, drawn from its own base so the flicker scales about the wick */}
      <g
        className="candle-flame"
        style={
          {
            transformOrigin: `${x}px ${top - 9}px`,
            "--light-at": `${lightAt}s`,
            "--flicker-at": `${lightAt + 0.5}s`,
          } as React.CSSProperties
        }
      >
        <path
          d={`M${x} ${top - 46} C${x + 17} ${top - 30} ${x + 15} ${top - 13} ${x} ${top - 8}
              C${x - 15} ${top - 13} ${x - 17} ${top - 30} ${x} ${top - 46} Z`}
          fill="#f5821f"
          stroke={OUTLINE}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d={`M${x} ${top - 33} C${x + 8} ${top - 25} ${x + 7} ${top - 16} ${x} ${top - 13}
              C${x - 7} ${top - 16} ${x - 8} ${top - 25} ${x} ${top - 33} Z`}
          fill="#ffc72c"
        />
      </g>
    </g>
  );
}

export function TopBun({ className }: LayerProps) {
  return (
    // The viewBox extends above the bun so the candles travel with this layer
    // when the scroll pulls the burger apart. The top must clear the TALLEST
    // flame tip, which sits at -(candle height) - 46; with a 74-unit candle
    // that is y = -120, so -134 leaves a little margin. Raise a candle and
    // this number has to move with it or the flame gets clipped.
    <svg viewBox="0 -134 400 266" className={className} aria-hidden="true">
      <Candle x={152} height={74} stripe="#d62300" lightAt={1.05} />
      <Candle x={248} height={62} stripe="#1e3a8a" lightAt={1.32} />

      {/* dome */}
      <path
        d="M14 124 C14 52 88 12 200 12 C312 12 386 52 386 124 Z"
        fill="#eaa94a"
        stroke={OUTLINE}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
      {/* sun-side highlight */}
      <path
        d="M52 104 C58 56 112 32 176 30 C140 44 96 68 82 106 Z"
        fill="#f7c878"
        opacity="0.85"
      />
      {/* sesame seeds */}
      <g fill="#fdf1dc" stroke={OUTLINE} strokeWidth="3">
        <ellipse cx="122" cy="70" rx="12" ry="7" transform="rotate(-28 122 70)" />
        <ellipse cx="196" cy="44" rx="12" ry="7" transform="rotate(6 196 44)" />
        <ellipse cx="268" cy="66" rx="12" ry="7" transform="rotate(26 268 66)" />
        <ellipse cx="86" cy="106" rx="11" ry="6.5" transform="rotate(-14 86 106)" />
        <ellipse cx="316" cy="102" rx="11" ry="6.5" transform="rotate(18 316 102)" />
        <ellipse cx="200" cy="96" rx="11" ry="6.5" transform="rotate(-4 200 96)" />
      </g>
    </svg>
  );
}

export function Lettuce({ className }: LayerProps) {
  return (
    <svg viewBox="0 0 400 58" className={className} aria-hidden="true">
      <path
        d="M8 10 C36 -4 58 20 86 8 C114 -4 132 20 162 8 C192 -4 210 22 240 9
           C270 -4 290 20 318 8 C346 -4 368 18 392 10
           L392 34 C368 52 344 34 320 48 C296 60 272 40 246 50
           C220 60 196 40 170 50 C144 60 120 40 94 50 C68 60 40 40 8 36 Z"
        fill="#79b247"
        stroke={OUTLINE}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
      <path
        d="M30 22 C70 14 110 30 150 20 C190 12 230 30 270 20"
        fill="none"
        stroke="#9ad36a"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Tomato({ className }: LayerProps) {
  return (
    <svg viewBox="0 0 400 48" className={className} aria-hidden="true">
      <g stroke={OUTLINE} strokeWidth={SW}>
        <ellipse cx="112" cy="24" rx="86" ry="20" fill="#d6412b" />
        <ellipse cx="288" cy="24" rx="86" ry="20" fill="#d6412b" />
        <ellipse cx="112" cy="22" rx="58" ry="11" fill="#e8674f" />
        <ellipse cx="288" cy="22" rx="58" ry="11" fill="#e8674f" />
      </g>
    </svg>
  );
}

export function Cheese({ className }: LayerProps) {
  return (
    <svg viewBox="0 0 400 62" className={className} aria-hidden="true">
      <path
        d="M18 8 L382 8 L382 26
           C382 26 366 24 358 34 C350 44 340 54 326 52 C312 50 306 34 292 34
           C278 34 272 50 258 50 C244 50 238 32 222 32 C206 32 200 50 184 50
           C168 50 162 32 146 32 C130 32 124 50 108 50 C92 50 86 34 72 36
           C58 38 48 26 18 26 Z"
        fill="#ffc72c"
        stroke={OUTLINE}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
      <path d="M34 18 L360 18" stroke="#ffe08a" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

export function Patty({ className }: LayerProps) {
  return (
    <svg viewBox="0 0 400 58" className={className} aria-hidden="true">
      <path
        d="M22 18 C22 6 44 2 200 2 C356 2 378 6 378 18 L378 40
           C378 52 356 56 200 56 C44 56 22 52 22 40 Z"
        fill="#5f3319"
        stroke={OUTLINE}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
      {/* char marks */}
      <g fill="#7c4522">
        <ellipse cx="96" cy="22" rx="26" ry="6" />
        <ellipse cx="200" cy="18" rx="32" ry="6" />
        <ellipse cx="306" cy="24" rx="26" ry="6" />
      </g>
    </svg>
  );
}

export function BottomBun({ className }: LayerProps) {
  return (
    <svg viewBox="0 0 400 76" className={className} aria-hidden="true">
      <path
        d="M14 8 L386 8 L386 34 C386 62 316 72 200 72 C84 72 14 62 14 34 Z"
        fill="#e39a3c"
        stroke={OUTLINE}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
      <path
        d="M40 18 C40 40 92 52 200 52"
        fill="none"
        stroke="#f2b968"
        strokeWidth="9"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Top to bottom, with the aspect ratio each layer needs to keep its shape. */
export const BURGER_LAYERS = [
  { key: "top-bun", Component: TopBun, ratio: 400 / 266 },
  { key: "lettuce", Component: Lettuce, ratio: 400 / 58 },
  { key: "tomato", Component: Tomato, ratio: 400 / 48 },
  { key: "cheese", Component: Cheese, ratio: 400 / 62 },
  { key: "patty", Component: Patty, ratio: 400 / 58 },
  { key: "bottom-bun", Component: BottomBun, ratio: 400 / 76 },
] as const;
