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
}: {
  children: ReactNode;
  className?: string;
  rotate: number;
  width: number;
}) {
  const { play } = useSound();
  return (
    <div className={className} style={{ width: `${width}px` }} aria-hidden="true">
      <div
        className="pointer-events-auto select-none drop-shadow-[0_3px_0_rgba(80,35,20,0.25)]"
        style={{ rotate: `${rotate}deg` }}
        onPointerDown={() => play("squeak")}
      >
        {children}
      </div>
    </div>
  );
}
