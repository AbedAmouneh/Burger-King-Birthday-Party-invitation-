"use client";

import { ChunkyButton } from "./ChunkyButton";
import { FaceSticker } from "./FaceSticker";
import { Countdown } from "./Countdown";
import { copy } from "@/lib/copy";
import { downloadIcs, googleCalendarUrl } from "@/lib/calendar";
import {
  DRESS_CODE,
  EVENT_DATE_LONG,
  EVENT_TIME,
  EVENT_WEEKDAY,
  FEE,
  RSVP_DEADLINE_LABEL,
  VENUE,
} from "@/lib/event";
import headAbedBk from "../../public/photos/head-abed-bk.webp";
import headLynnCampfire from "../../public/photos/head-lynn-campfire.webp";

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t-2 border-dashed border-brown/30 py-3 first:border-t-0">
      <dt className="font-pixel text-[8px] tracking-[0.16em] text-royal uppercase">
        {label}
      </dt>
      <dd className="mt-1.5 font-display text-xl leading-tight text-brown">
        {children}
      </dd>
    </div>
  );
}

export function Decree() {
  return (
    <section
      id="decree"
      className="relative mx-auto flex max-w-screen-sm flex-col items-center gap-8 px-5 py-16"
    >
      {/* Crowned cut-outs loitering around the decree. Each `seed` picks its
          own crown, so nobody is permanently the king or the queen. */}
      <FaceSticker
        src={headAbedBk}
        alt="Abed"
        seed="decree-left"
        width={84}
        rotate={-9}
        className="absolute top-6 -left-1 z-10"
      />
      <FaceSticker
        src={headLynnCampfire}
        alt="Lynn"
        seed="decree-right"
        width={78}
        rotate={11}
        className="absolute top-2 -right-1 z-10"
      />

      <header className="mt-14 flex flex-col items-center gap-2 text-center">
        <h2 className="font-display text-4xl leading-none text-flame uppercase">
          {copy.decree.heading}
        </h2>
        <p className="font-display max-w-[22rem] text-lg text-brown">
          {copy.decree.opener}
        </p>
      </header>

      {/* Old menu-board energy: hard border, flat fills, no gradients. */}
      <dl className="w-full max-w-[24rem] rounded-2xl border-4 border-brown bg-cream px-5 py-3 shadow-[0_6px_0_var(--color-brown)]">
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

        {/* The fee is the one thing nobody may misread, so it gets the loudest
            treatment on the page after the title itself. */}
        <Row label={copy.decree.labels.tribute}>
          <span className="block font-display text-3xl leading-none text-flame">
            {FEE.amount}
          </span>
          <span className="font-pixel mt-1 block text-[9px] text-brown">
            {FEE.per.toUpperCase()}
          </span>
          <span className="mt-2 block text-base leading-snug font-normal">
            {copy.decree.tributeIncludes}
          </span>
          <span className="font-pixel mt-2 block text-[9px] leading-relaxed text-royal">
            {copy.decree.tributePayment}
          </span>
        </Row>

        <Row label={copy.decree.labels.rsvpBy}>{RSVP_DEADLINE_LABEL}</Row>
      </dl>

      <div className="flex w-full max-w-[24rem] flex-col gap-3">
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
          className="font-pixel flex min-h-[44px] items-center justify-center text-center text-[8px] tracking-widest text-brown/70 underline underline-offset-4 uppercase"
        >
          or add it to google calendar
        </a>
      </div>

      <Countdown />

      <p className="font-display text-xl text-flame">{copy.decree.closer}</p>
    </section>
  );
}
