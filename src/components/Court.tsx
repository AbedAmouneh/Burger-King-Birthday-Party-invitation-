"use client";

import { CrownWall } from "./CrownWall";
import { FaceSticker } from "./FaceSticker";
import { RsvpForm } from "./RsvpForm";
import { Sticker } from "./Sticker";
import { Ketchup, Nugget } from "./Stickers";
import { ZigzagEdge } from "./ZigzagEdge";
import { copy } from "@/lib/copy";
import { isSupabaseConfigured } from "@/lib/supabase";
import headAbedBk from "../../public/photos/head-abed-bk.webp";
import headLynnRestaurant from "../../public/photos/gallery/restaurant-mirror-head-1.webp";

/**
 * RSVP and the crown wall share one royal-blue block, so the page reads as
 * cream -> red -> brown -> blue rather than repeating a ground.
 */
export function Court() {
  return (
    <section className="relative">
      <div className="bg-royal">
        <ZigzagEdge fill="var(--color-brown)" className="-mt-px" />
      </div>

      <div className="halftone-light bg-royal">
        <div className="relative mx-auto flex max-w-[28rem] flex-col items-center gap-8 px-5 pt-8 pb-14">
          <Sticker
            rotate={-13}
            width={48}
            className="absolute top-[5.5rem] -left-2 z-10"
          >
            <Ketchup className="w-full" />
          </Sticker>
          <Sticker
            rotate={15}
            width={54}
            className="absolute top-[4.5rem] -right-2 z-10"
          >
            <Nugget className="w-full" />
          </Sticker>

          <header className="flex flex-col items-center gap-2 text-center">
            <h2 className="font-display text-[2.1rem] leading-[0.95] text-cream uppercase drop-shadow-[3px_3px_0_var(--color-brown)]">
              {copy.rsvp.heading}
            </h2>
            <p className="font-display text-lg text-yellow">{copy.rsvp.sub}</p>
          </header>

          {isSupabaseConfigured() ? (
            <>
              {/* Same treatment as the decree liner: the pair tuck in behind
                  the form so only their shoulders are hidden, and different
                  seeds give them different crowns from the decree pair. */}
              <div className="relative mt-16 w-full max-w-[23rem]">
                <FaceSticker
                  src={headAbedBk}
                  alt="Abed"
                  seed="court-left"
                  width={80}
                  rotate={-12}
                  className="absolute -top-[5.2rem] left-1 z-0"
                />
                <FaceSticker
                  src={headLynnRestaurant}
                  alt="Lynn"
                  seed="court-right"
                  width={76}
                  rotate={14}
                  className="absolute -top-[5rem] right-2 z-0"
                />
                <div className="relative z-10">
                  <RsvpForm />
                </div>
              </div>
              <CrownWall />
            </>
          ) : (
            <p className="font-pixel max-w-[22rem] rounded-sm border-[3px] border-yellow bg-royal px-4 py-3 text-center text-[10px] leading-relaxed text-yellow">
              {copy.rsvp.notConfigured}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
