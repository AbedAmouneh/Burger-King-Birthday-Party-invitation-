"use client";

import Image, { type StaticImageData } from "next/image";
import { useSound } from "@/lib/use-sound";

type Props = {
  src: StaticImageData;
  alt: string;
  caption: string;
  /** Degrees of tilt. Small odd numbers read as "stuck on by hand". */
  rotate: number;
  /** Rendered width in px. A real prop, not a className override: two `w-*`
   *  utilities have equal specificity, so the caller's would not reliably win. */
  width: number;
  className?: string;
};

/**
 * A photo taped to the page. The tape strips are pseudo-elements on the
 * wrapper rather than images, so they cost nothing to download.
 */
export function Polaroid({
  src,
  alt,
  caption,
  rotate,
  width,
  className,
}: Props) {
  const { play } = useSound();

  return (
    <figure
      className={`relative shrink-0 bg-white p-1.5 pb-6 shadow-[0_6px_14px_rgba(80,35,20,0.28)] ${className ?? ""}`}
      style={{ rotate: `${rotate}deg`, width: `${width}px` }}
      onPointerDown={() => play("squeak")}
    >
      {/* tape, top-left and bottom-right */}
      <span
        aria-hidden="true"
        className="absolute -top-2 -left-3 h-5 w-12 -rotate-[24deg] bg-yellow/70 shadow-[0_1px_2px_rgba(80,35,20,0.25)]"
      />
      <span
        aria-hidden="true"
        className="absolute -right-3 -bottom-1 h-5 w-12 -rotate-[18deg] bg-yellow/70 shadow-[0_1px_2px_rgba(80,35,20,0.25)]"
      />
      <Image
        src={src}
        alt={alt}
        placeholder="blur"
        sizes="140px"
        className="h-auto w-full"
      />
      <figcaption className="font-pixel absolute inset-x-0 bottom-1 text-center text-[6px] text-brown/80">
        {caption}
      </figcaption>
    </figure>
  );
}
