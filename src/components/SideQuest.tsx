"use client";

import { useEffect, useState } from "react";
import { ChunkyButton } from "./ChunkyButton";
import { useSound } from "@/lib/use-sound";
import { Sticker } from "./Sticker";
import { Starburst } from "./Stickers";
import { ZigzagEdge } from "./ZigzagEdge";
import { copy } from "@/lib/copy";
import { joinSideQuest } from "@/app/actions";
import { loadMyRsvp, RSVP_CHANGED_EVENT, type MyRsvp } from "@/lib/rsvp-token";
import { SIDE_QUEST, SIDE_QUEST_WHEN } from "@/lib/event";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

/**
 * Join button plus the live tally.
 *
 * The side quest sits after the RSVP, so it cannot be a field on that form:
 * the guest has already scrolled past it. Instead it asks for itself, using
 * the edit token the browser kept when they claimed their crown. Anyone who
 * has not RSVP'd yet is pointed back up rather than given a dead button.
 */
function JoinSideQuest() {
  const [mine, setMine] = useState<MyRsvp | null>(null);
  const [joined, setJoined] = useState(false);
  const [going, setGoing] = useState<{ id: string; name: string }[] | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { play } = useSound();

  useEffect(() => {
    setMounted(true);
    const sync = () => setMine(loadMyRsvp());
    sync();
    // This section renders below the form and mounts before anyone fills it
    // in, so a one-off read would leave it stuck on "claim your crown first".
    window.addEventListener(RSVP_CHANGED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(RSVP_CHANGED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    let active = true;
    const supabase = getSupabase();

    async function load() {
      // Names, not just a tally: a number tells nobody whether their friends
      // are going, which is the actual question people are asking.
      const { data: rows } = await supabase
        .from("rsvps")
        .select("id, name")
        .eq("side_quest", true)
        .order("created_at", { ascending: true })
        .limit(200);
      if (active) setGoing(rows ?? []);

      // Read back this device's own answer so the button shows the truth even
      // on a different browser session.
      const saved = loadMyRsvp();
      if (saved) {
        const { data } = await supabase
          .from("rsvps")
          .select("side_quest")
          .eq("id", saved.id)
          .maybeSingle();
        if (active && data) setJoined(Boolean(data.side_quest));
      }
    }
    void load();

    const channel = supabase
      .channel("side-quest")
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

  async function toggle() {
    if (!mine) return;
    setBusy(true);
    setFailed(false);
    const next = !joined;
    const result = await joinSideQuest({
      id: mine.id,
      token: mine.token,
      joining: next,
    });
    setBusy(false);
    if (!result.ok) {
      setFailed(true);
      return;
    }
    setJoined(next);
    play(next ? "tada" : "crunch");
  }

  return (
    <div className="flex w-full max-w-[21rem] flex-col items-center gap-3">
      {mounted && !mine ? (
        <>
          <p className="font-display text-lg leading-snug text-brown">
            {copy.sideQuest.needRsvp}
          </p>
          <ChunkyButton tone="flame" href="#court">
            {copy.sideQuest.needRsvpCta}
          </ChunkyButton>
        </>
      ) : null}

      {mounted && mine ? (
        <>
          {joined ? (
            <p className="font-display rounded-md border-4 border-brown bg-yellow px-4 py-2 text-lg text-brown">
              {copy.sideQuest.joined}
            </p>
          ) : null}
          <ChunkyButton
            tone={joined ? "royal" : "flame"}
            onClick={toggle}
            disabled={busy}
          >
            {busy
              ? copy.sideQuest.joining
              : joined
                ? copy.sideQuest.leave
                : copy.sideQuest.join}
          </ChunkyButton>
          {failed ? (
            <p role="alert" className="font-pixel text-[10px] text-brown">
              {copy.sideQuest.failed}
            </p>
          ) : null}
        </>
      ) : null}

      {going === null ? null : going.length === 0 ? (
        <p
          aria-live="polite"
          className="font-pixel rounded-sm border-[3px] border-brown bg-cream px-3 py-2 text-center text-[10px] text-brown uppercase"
        >
          {copy.sideQuest.countNone}
        </p>
      ) : (
        <div
          className="flex w-full flex-col items-center gap-2"
          aria-live="polite"
        >
          <p className="font-pixel rounded-sm border-[3px] border-brown bg-cream px-3 py-2 text-[10px] text-brown uppercase">
            {going.length} {copy.sideQuest.countSuffix}
          </p>
          <ul className="flex flex-wrap justify-center gap-2">
            {going.map((g) => (
              <li
                key={g.id}
                className="font-display rounded-full border-[3px] border-brown bg-yellow px-3 py-1 text-base leading-tight text-brown"
              >
                {g.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
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
      {/* Sits between the blue court above and the brown footer below. */}
      <div className="bg-royal">
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
            <Starburst
              points={14}
              fill="var(--color-yellow)"
              className="w-full"
            />
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

          <JoinSideQuest />
        </div>
      </div>

      <div className="bg-brown">
        <ZigzagEdge fill="var(--color-orange)" className="-mt-px" />
      </div>
    </section>
  );
}
