/**
 * The scalloped edge of a paper tray liner, used where a colour block meets
 * the page. Drawn as an explicit path rather than a CSS mask so the teeth stay
 * the same size at any width instead of stretching.
 */
export function ZigzagEdge({
  fill,
  flip = false,
  teeth = 16,
  className,
}: {
  /** CSS colour for the block this edge belongs to. */
  fill: string;
  /** false: teeth point down (block is above). true: teeth point up. */
  flip?: boolean;
  teeth?: number;
  className?: string;
}) {
  const w = 100;
  const h = 4;
  const step = w / teeth;

  let d = `M0 0`;
  for (let i = 0; i < teeth; i += 1) {
    d += ` L${(i + 0.5) * step} ${h} L${(i + 1) * step} 0`;
  }
  d += ` L${w} 0 Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className={`block h-3 w-full ${flip ? "rotate-180" : ""} ${className ?? ""}`}
      aria-hidden="true"
    >
      <path d={d} fill={fill} />
    </svg>
  );
}
