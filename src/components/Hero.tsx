"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { BURGER_LAYERS } from "./BurgerLayers";
import { Polaroid } from "./Polaroid";
import { Sticker } from "./Sticker";
import { Fries, Nugget, Starburst } from "./Stickers";
import { copy } from "@/lib/copy";
import { useSound } from "@/lib/use-sound";
import heroMirror from "../../public/photos/hero-mirror.webp";
import polaCampfire from "../../public/photos/polaroid-campfire.webp";
import polaBkCrown from "../../public/photos/polaroid-bk-crown.webp";

/**
 * Per-layer stacking. `tuck` is how far a layer slides under the one above it,
 * as a fraction of its OWN height; `z` is paint order (fillings in front of the
 * buns so the lettuce frills stick out); `split` is how far it travels, in
 * burger-widths, when the scroll pulls the burger apart.
 *
 * The split moves the burger into TWO groups rather than spreading all six
 * layers evenly: even spreading leaves six thin gaps and the reveal photo ends
 * up behind the fillings, whereas two groups open one clean window for it.
 *
 * Careful with `tuck`: a percentage margin-top resolves against the containing
 * block's WIDTH, not height. Since height = width / ratio, a tuck of `f`
 * own-heights is `f / ratio * 100` percent of width.
 */
const LAYER_STYLE: Record<string, { tuck: number; z: number; split: number }> =
  {
    "top-bun": { tuck: 0, z: 2, split: -0.62 },
    lettuce: { tuck: 0.3, z: 6, split: -0.5 },
    tomato: { tuck: 0.22, z: 5, split: 0.34 },
    cheese: { tuck: 0.18, z: 4, split: 0.44 },
    patty: { tuck: 0.2, z: 3, split: 0.55 },
    "bottom-bun": { tuck: 0.16, z: 1, split: 0.66 },
  };

const BURGER_WIDTH_PX = 336;

/**
 * One slice of the burger. Its own component so each layer can call
 * useTransform for itself; a hook inside a .map() callback would break the
 * rules of hooks.
 */
function BurgerLayer({
  layer,
  progress,
  travel,
}: {
  layer: (typeof BURGER_LAYERS)[number];
  progress: MotionValue<number>;
  travel: number;
}) {
  const { tuck, z, split } = LAYER_STYLE[layer.key];
  const y = useTransform(
    progress,
    [0, 1],
    [0, split * BURGER_WIDTH_PX * travel],
  );

  return (
    <motion.div
      style={{ marginTop: `${(-tuck / layer.ratio) * 100}%`, zIndex: z, y }}
      className="relative"
    >
      <layer.Component className="w-full drop-shadow-[0_5px_0_rgba(80,35,20,0.16)]" />
    </motion.div>
  );
}

export function Hero() {
  const [squished, setSquished] = useState(false);
  const reduceMotion = useReducedMotion();
  const { play } = useSound();
  const sectionRef = useRef<HTMLElement>(null);
  const scopeRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Reduced motion still gets the reveal, just a much shorter journey.
  const travel = reduceMotion ? 0.3 : 1;

  // Transforms stay with Framer (they track scroll exactly). Opacity does not:
  // see the note on the fade-* classes in globals.css. Publishing progress as
  // a CSS variable lets plain CSS derive every fade from the real scroll value.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    scopeRef.current?.style.setProperty("--p", v.toFixed(4));
  });

  const burgerScale = useTransform(scrollYProgress, [0, 1], [1, 0.78]);
  const photoScale = useTransform(scrollYProgress, [0.12, 0.55], [0.86, 1]);
  // The burger box centre is not the split window centre; nudge up to match.
  const photoY = useTransform(scrollYProgress, [0, 1], [0, -34]);

  function press() {
    setSquished(true);
    play("squish");
  }

  function release() {
    if (!squished) return;
    setSquished(false);
    play("unsquish");
  }

  return (
    <section ref={sectionRef} className="relative h-[260vh]">
      <div
        ref={scopeRef}
        data-scroll-scope
        className="paper sticky top-0 flex h-dvh flex-col items-center justify-center overflow-hidden bg-cream px-5 py-8"
      >
        {/* Everything, stickers included, lives in one centred column. The
            polaroids and sticker art are absolutely positioned; anchoring them
            to the sticky container instead would fling them to the viewport
            corners on a wide screen, far from the burger. */}
        <div className="relative flex w-full max-w-[26rem] flex-col items-center gap-3">
          <header className="fade-out-early flex flex-col items-center gap-2 text-center">
            <p className="font-pixel rounded-sm bg-royal px-2.5 py-1.5 text-[10px] tracking-[0.18em] text-cream uppercase">
              {copy.hero.eyebrow}
            </p>
            <h1 className="font-display -rotate-[2deg] bg-flame px-3 py-1 text-[2.9rem] leading-[0.95] text-cream uppercase shadow-[5px_5px_0_var(--color-brown)]">
              {copy.hero.title}
            </h1>
            <p className="font-display mt-1 text-lg text-brown">
              {copy.hero.tagline}
            </p>
          </header>

          <div
            className="relative w-full"
            style={{ maxWidth: `${BURGER_WIDTH_PX}px` }}
          >
            {/* Revealed between the layers as they part. */}
            <motion.div
              style={{ scale: photoScale, y: photoY }}
              className="fade-in-reveal pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
            >
              {/* The window the split opens is landscape, so the portrait
                original is cropped to fill it rather than shrunk to a stamp.
                objectPosition biases upward to keep both faces in frame. */}
              <div className="relative w-[84%] rotate-[-2deg] bg-white p-1.5 pb-5 shadow-[0_8px_20px_rgba(80,35,20,0.4)]">
                <div className="relative h-[178px] w-full">
                  <Image
                    src={heroMirror}
                    alt="Abed and Lynn in a Burger King kiosk mirror"
                    placeholder="blur"
                    fill
                    sizes="320px"
                    priority
                    className="object-cover"
                    style={{ objectPosition: "center 26%" }}
                  />
                </div>
                <p className="font-pixel absolute inset-x-0 bottom-1 text-center text-[10px] text-royal uppercase">
                  {copy.reveal.caption}
                </p>
              </div>
            </motion.div>

            <button
              type="button"
              aria-label={copy.hero.squishHint}
              data-squished={squished}
              className="relative block w-full cursor-pointer touch-manipulation select-none"
              onPointerDown={press}
              onPointerUp={release}
              onPointerLeave={release}
              onPointerCancel={release}
            >
              <motion.div
                style={{ scale: burgerScale }}
                className="origin-center"
              >
                {/* The squish is a CSS transition, not a JS spring: it runs on
                  the compositor, so it never contends with the scroll-linked
                  split for main-thread frames. */}
                <div
                  className="origin-bottom transition-transform duration-200 [transition-timing-function:var(--ease-back)] motion-reduce:transition-none"
                  style={{
                    transform: squished
                      ? "scaleY(0.74) scaleX(1.08)"
                      : undefined,
                  }}
                >
                  {BURGER_LAYERS.map((layer) => (
                    <BurgerLayer
                      key={layer.key}
                      layer={layer}
                      progress={scrollYProgress}
                      travel={travel}
                    />
                  ))}
                </div>
              </motion.div>
            </button>
          </div>

          <Sticker
            rotate={-18}
            width={54}
            className="absolute top-[6%] left-1 z-0"
          >
            <Fries className="w-full" />
          </Sticker>
          <Sticker
            rotate={20}
            width={52}
            className="absolute top-[4%] right-2 z-0"
          >
            <Nugget className="w-full" />
          </Sticker>

          {/* Polaroids are pinned to the viewport, not the burger box: the box
            does not move when the layers split, so corner-anchoring inside it
            would drop them straight onto the reveal photo. */}
          <div className="fade-in-late pointer-events-none absolute top-[11%] right-1 z-20">
            <Polaroid
              src={polaBkCrown}
              alt="Lynn wearing a paper crown, with Abed"
              caption={copy.reveal.polaroids.bkCrown}
              rotate={6}
              width={116}
              className="pointer-events-auto"
            />
          </div>
          <div className="fade-in-late pointer-events-none absolute bottom-[7%] left-1 z-20">
            <Polaroid
              src={polaCampfire}
              alt="Abed and Lynn by a campfire at night"
              caption={copy.reveal.polaroids.campfire}
              rotate={-7}
              width={116}
              className="pointer-events-auto"
            />
          </div>

          <div className="fade-out-immediate">
            <div className="animate-squish-hint relative flex h-[6.4rem] w-[6.4rem] items-center justify-center">
              <Starburst
                points={12}
                fill="var(--color-flame)"
                className="absolute inset-0 h-full w-full drop-shadow-[0_3px_0_rgba(61,27,14,0.35)]"
              />
              <span className="font-pixel relative -rotate-[8deg] px-4 text-center text-[10px] leading-[1.6] text-cream uppercase">
                {copy.hero.squishHint}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
