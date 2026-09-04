"use client";

import { useEffect, useState } from "react";
import { ChunkyButton } from "./ChunkyButton";
import { Sticker } from "./Sticker";
import { Starburst } from "./Stickers";
import { ZigzagEdge } from "./ZigzagEdge";
import { copy } from "@/lib/copy";
import { SIDE_QUEST, SIDE_QUEST_WHEN } from "@/lib/event";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

/** Live tally of who has ticked the side-quest box on their RSVP. */
function SideQuestCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    let active = true;
    const supabase = getSupabase();

    async function load() {
      const { count: n, error } = await supabase
        .from("rsvps")
        .select("id", { count: "exact", head: true })
        .eq("side_quest", true);
      if (active && !error) setCount(n ?? 0);
    }
    void load();

    // Same table as the crown wall, so any RSVP change can move this number.
    const channel = supabase
      .channel("side-quest-count")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rsvps" },
        () => void load(),
      )
      .subscribe();

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  if (count === null) return null;

  return (
    <p
      aria-live="polite"
      className="font-pixel rounded-sm border-[3px] border-brown bg-cream px-3 py-2 text-[10px] text-brown uppercase"
    >
      {count > 0
        ? `${count} ${copy.sideQuest.countSuffix}`
        : copy.sideQuest.countNone}
    </p>
  );
}

/**
 * The optional night-before outing. Its own orange block so it reads as a
 * bonus round rather than a second, competing invitation: the decree above is
 * the actual party.
 */
export function SideQuest() {
  return (
    <section id="side-quest" className="relative">
      <div className="bg-brown">
        <ZigzagEdge fill="var(--color-orange)" flip className="-mb-px" />
      </div>

      <div className="halftone bg-orange">
        <div className="relative mx-auto flex max-w-[28rem] flex-col items-center gap-5 px-5 pt-8 pb-12 text-center">
          <Sticker
            rotate={-14}
            width={64}
            idle="bob"
            className="absolute top-5 -left-3 z-0"
          >
            <Starburst points={14} fill="var(--color-yellow)" className="w-full" />
          </Sticker>

          <p className="font-pixel rounded-sm bg-brown px-2.5 py-1.5 text-[10px] tracking-[0.18em] text-yellow uppercase">
            {copy.sideQuest.eyebrow}
          </p>

          <h2 className="font-display text-[2.3rem] leading-[0.95] text-brown uppercase">
            {copy.sideQuest.heading}
          </h2>

          <p className="font-display -rotate-[1.5deg] bg-flame px-3 py-1 text-xl text-cream shadow-[4px_4px_0_var(--color-brown)]">
            {copy.sideQuest.blurb}
          </p>

          <dl className="paper hard-shadow w-full max-w-[21rem] rounded-md border-[5px] border-brown bg-cream px-5 py-3 text-left">
            <div className="py-2.5">
              <dt className="font-pixel text-[10px] tracking-[0.16em] text-flame uppercase">
                {copy.sideQuest.labelWhen}
              </dt>
              <dd className="font-display mt-1 text-xl text-brown">
                {SIDE_QUEST_WHEN}
              </dd>
            </div>
            <div className="border-t-[3px] border-dotted border-brown/35 py-2.5">
              <dt className="font-pixel text-[10px] tracking-[0.16em] text-flame uppercase">
                {copy.sideQuest.labelWhere}
              </dt>
              <dd className="font-display mt-1 text-xl text-brown">
                {SIDE_QUEST.venue}
              </dd>
            </div>
          </dl>

          <p className="font-display max-w-[19rem] text-lg text-brown">
            {copy.sideQuest.tagline}
          </p>

          <ChunkyButton tone="royal" href={SIDE_QUEST.reelUrl}>
            {copy.sideQuest.reel}
          </ChunkyButton>

          <SideQuestCount />
        </div>
      </div>

      <div className="bg-royal">
        <ZigzagEdge fill="var(--color-orange)" className="-mt-px" />
      </div>
    </section>
  );
}
