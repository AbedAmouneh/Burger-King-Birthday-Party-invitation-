"use client";

import { ChunkyButton } from "./ChunkyButton";
import { Countdown } from "./Countdown";
import { FaceSticker } from "./FaceSticker";
import { PriceStarburst } from "./PriceStarburst";
import { Sticker } from "./Sticker";
import { Fries, Ketchup, Nugget, SodaCup } from "./Stickers";
import { ZigzagEdge } from "./ZigzagEdge";
import { copy } from "@/lib/copy";
import { downloadIcs, googleCalendarUrl } from "@/lib/calendar";
import {
  DRESS_CODE,
  EVENT_DATE_LONG,
  EVENT_TIME,
  EVENT_WEEKDAY,
  RSVP_DEADLINE_LABEL,
  VENUE,
} from "@/lib/event";
import headAbedBk from "../../public/photos/head-abed-bk.webp";
import headLynnCampfire from "../../public/photos/head-lynn-campfire.webp";

/** One line of the tray liner: pixel label, chunky value. */
function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t-[3px] border-dotted border-brown/35 py-3.5 first:border-t-0">
      <dt className="font-pixel text-[10px] tracking-[0.16em] text-flame uppercase">
        {label}
      </dt>
      <dd className="font-display mt-1.5 text-xl leading-tight text-brown">
        {children}
      </dd>
    </div>
  );
}

export function Decree() {
  return (
    <section id="decree" className="relative">
      {/* The red block's top edge is torn like a tray liner. `flip` puts the
          solid side at the bottom so the teeth bite up into the cream above. */}
      <div className="bg-cream">
        <ZigzagEdge fill="var(--color-flame)" flip className="-mb-px" />
      </div>

      <div className="halftone bg-flame">
        <div className="relative mx-auto flex max-w-screen-sm flex-col items-center gap-9 px-5 pt-4 pb-6">
          {/* Sticker sheet: scattered, tilted, never on top of the words. */}
          <Sticker rotate={-14} width={58} className="absolute top-24 -left-2 z-10">
            <Fries className="w-full" />
          </Sticker>
          <Sticker rotate={16} width={62} className="absolute top-16 -right-3 z-10">
            <SodaCup className="w-full" />
          </Sticker>
          <Sticker rotate={-9} width={54} className="absolute right-0 bottom-[17%] z-10">
            <Nugget className="w-full" />
          </Sticker>
          <Sticker rotate={12} width={44} className="absolute bottom-[13%] -left-2 z-10">
            <Ketchup className="w-full" />
          </Sticker>

          <header className="flex flex-col items-center gap-2 pt-6 text-center">
            <h2 className="font-display text-[2.7rem] leading-[0.88] text-cream uppercase drop-shadow-[3px_3px_0_var(--color-brown)]">
              {copy.decree.heading}
            </h2>
            <p className="font-display max-w-[20rem] text-lg text-yellow">
              {copy.decree.opener}
            </p>
          </header>

          {/* The liner itself: cream paper pinned onto the red block. */}
          <div className="relative mt-10 w-full max-w-[23rem]">
            <FaceSticker
              src={headAbedBk}
              alt="Abed"
              seed="decree-left"
              width={74}
              rotate={-11}
              className="absolute -top-12 -left-3 z-0"
            />
            <FaceSticker
              src={headLynnCampfire}
              alt="Lynn"
              seed="decree-right"
              width={70}
              rotate={13}
              className="absolute -top-14 -right-2 z-0"
            />

            <dl className="paper hard-shadow relative z-10 rounded-md border-[5px] border-brown bg-cream px-5 py-4">
              <Row label={copy.decree.labels.when}>
                {EVENT_WEEKDAY} {EVENT_DATE_LONG}
                <br />
                {EVENT_TIME}
              </Row>
              <Row label={copy.decree.labels.where}>
                {VENUE.name}
                <br />
                {VENUE.area}
              </Row>
              <Row label={copy.decree.labels.dress}>{DRESS_CODE}</Row>
              <Row label={copy.decree.labels.rsvpBy}>{RSVP_DEADLINE_LABEL}</Row>
            </dl>
          </div>

          {/* The fee gets its own promo starburst so nobody can miss it. */}
          <div className="flex w-full max-w-[23rem] flex-col items-center gap-3">
            <PriceStarburst />
            <p className="font-display max-w-[19rem] text-center text-lg leading-snug text-cream">
              {copy.decree.tributeIncludes}
            </p>
            <p className="font-pixel rounded-sm border-[3px] border-brown bg-yellow px-3 py-2 text-center text-[10px] leading-relaxed text-brown">
              {copy.decree.tributePayment}
            </p>
          </div>

          <div className="flex w-full max-w-[23rem] flex-col items-center gap-3">
            <div className="flex flex-wrap justify-center gap-3">
              <ChunkyButton tone="yellow" onClick={downloadIcs}>
                {copy.decree.addToCalendar}
              </ChunkyButton>
              <ChunkyButton tone="royal" href={VENUE.mapsUrl}>
                {copy.decree.openInMaps}
              </ChunkyButton>
            </div>
            <a
              href={googleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-pixel flex min-h-[44px] items-center justify-center text-center text-[10px] tracking-widest text-cream/85 underline underline-offset-4 uppercase"
            >
              or add it to google calendar
            </a>
          </div>
        </div>
      </div>

      {/* The menu board: dark slab, bright type, the way it hung over the till. */}
      <div className="bg-brown">
        <ZigzagEdge fill="var(--color-flame)" className="-mt-px" />
      </div>
      <div className="halftone-light bg-brown">
        <div className="mx-auto flex max-w-screen-sm flex-col items-center gap-6 px-5 py-12">
          <Countdown />
          <p className="font-display text-2xl text-yellow">
            {copy.decree.closer}
          </p>
        </div>
      </div>
    </section>
  );
}
