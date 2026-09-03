"use client";

import Image, { type StaticImageData } from "next/image";
import { crownFor } from "./Crowns";
import { useSound } from "@/lib/use-sound";

type Props = {
  src: StaticImageData;
  alt: string;
  /** Stable key: also decides which crown this instance wears. */
  seed: string;
  width: number;
  rotate: number;
  className?: string;
};

/**
 * A cut-out head with a cartoon crown perched on it. The crown is drawn on top
 * rather than baked into the image so the same four head files can wear five
 * different crowns across the page.
 */
export function FaceSticker({
  src,
  alt,
  seed,
  width,
  rotate,
  className,
}: Props) {
  const Crown = crownFor(seed);
  const { play } = useSound();

  return (
    // Two elements on purpose: the outer one carries the caller's positioning,
    // the inner one is the `relative` anchor the crown hangs off. Merging them
    // would pit the caller's `absolute` against this component's `relative`,
    // two equal-specificity utilities whose winner depends on stylesheet order.
    <div className={className} style={{ width: `${width}px` }}>
      <div
        className="pointer-events-auto relative select-none"
        style={{ rotate: `${rotate}deg` }}
        onPointerDown={() => play("squeak")}
      >
        {/* Overlapping the hair, not hovering above it: the cut-outs carry a
            white sticker outline, so a crown parked clear of the head reads as
            a detached blob. */}
        <Crown className="absolute -top-[15%] left-1/2 w-[52%] -translate-x-1/2 -rotate-[8deg] drop-shadow-[0_2px_0_rgba(80,35,20,0.3)]" />
        <Image
          src={src}
          alt={alt}
          sizes="140px"
          className="h-auto w-full drop-shadow-[0_4px_6px_rgba(80,35,20,0.3)]"
        />
      </div>
    </div>
  );
}
