"use client";

import type { ReactNode } from "react";
import { useSound } from "@/lib/use-sound";

/**
 * Positions and tilts a piece of sticker art, and makes it squeak. Positioning
 * lives on the outer element and the tilt on the inner one, so a caller's
 * `absolute` never collides with a `relative` from this component.
 */
export function Sticker({
  children,
  className,
  rotate,
  width,
  idle,
  delay = 0,
  enterAt,
}: {
  children: ReactNode;
  className?: string;
  rotate: number;
  width: number;
  /** Gentle continuous motion. "sway" is for things that hang or float. */
  idle?: "bob" | "sway";
  /** Offsets the idle loop so no two stickers move together. */
  delay?: number;
  /** Seconds into the arrival sequence when this sticker pops in. */
  enterAt?: number;
}) {
  const { play } = useSound();
  return (
    // Entrance lives on the outer element and the idle loop on the inner one:
    // two animations on one element would need a single shorthand, and this
    // keeps positioning, arrival and idle motion cleanly separated.
    <div
      className={`${className ?? ""} ${enterAt === undefined ? "" : "enter-pop"}`}
      style={{
        width: `${width}px`,
        animationDelay: enterAt === undefined ? undefined : `${enterAt}s`,
      }}
      aria-hidden="true"
    >
      {/* The tilt rides in a custom property rather than a `rotate` style: the
          idle keyframes set `transform`, which would otherwise overwrite it. */}
      <div
        className={`pointer-events-auto select-none drop-shadow-[0_3px_0_rgba(80,35,20,0.25)] ${
          idle === "sway" ? "idle-sway" : idle === "bob" ? "idle-bob" : ""
        }`}
        style={
          {
            "--tilt": `${rotate}deg`,
            transform: idle ? undefined : `rotate(${rotate}deg)`,
            animationDelay: idle ? `${delay}s` : undefined,
          } as React.CSSProperties
        }
        onPointerDown={() => play("squeak")}
      >
        {children}
      </div>
    </div>
  );
}
