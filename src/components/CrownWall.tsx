"use client";

import { useEffect, useState } from "react";
import { crownFor } from "./Crowns";
import { copy } from "@/lib/copy";
import { getSupabase } from "@/lib/supabase";
import { useSound } from "@/lib/use-sound";
import type { Rsvp } from "@/lib/types";

/** Only the columns anon is granted; `select *` would hit the token digest. */
const COLUMNS = "id, name, coming, message, created_at";

function CrownCard({ rsvp }: { rsvp: Rsvp }) {
  const Crown = crownFor(rsvp.id);
  const { play } = useSound();

  // A "can't make it" crown is grey, tilted further, and wilting.
  const tilt = rsvp.coming
    ? ((rsvp.id.charCodeAt(0) % 7) - 3)
    : ((rsvp.id.charCodeAt(0) % 9) + 6);

  return (
    <li
      style={{ rotate: `${tilt}deg` }}
      onPointerDown={() => play(rsvp.coming ? "pop" : "sad")}
      className={`flex w-[8.5rem] shrink-0 flex-col items-center rounded-md border-[3px] px-2 py-2.5 text-center ${
        rsvp.coming
          ? "border-brown bg-cream shadow-[3px_3px_0_var(--color-brown)]"
          : "border-ash-dark bg-ash/25 shadow-[3px_3px_0_var(--color-ash-dark)]"
      }`}
    >
      <Crown
        className={`h-8 w-11 ${rsvp.coming ? "" : "opacity-45 grayscale"}`}
      />
      <p
        className={`font-display mt-1 leading-tight break-words ${
          rsvp.coming ? "text-brown" : "text-ash-dark"
        }`}
      >
        {rsvp.name}
        {rsvp.coming ? "" : " 😢"}
      </p>
      {rsvp.message ? (
        <p
          className={`font-pixel mt-1.5 text-[10px] leading-relaxed break-words ${
            rsvp.coming ? "text-brown/75" : "text-ash-dark/75"
          }`}
        >
          {rsvp.message}
        </p>
      ) : null}
    </li>
  );
}

export function CrownWall() {
  const [rsvps, setRsvps] = useState<Rsvp[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    const supabase = getSupabase();

    async function load() {
      const { data, error } = await supabase
        .from("rsvps")
        .select(COLUMNS)
        .order("created_at", { ascending: true })
        .limit(500);
      if (!active) return;
      if (error) {
        setFailed(true);
        return;
      }
      setRsvps((data ?? []) as Rsvp[]);
    }
    void load();

    // Realtime keeps the wall growing while people are looking at it. Deletes
    // arrive carrying only the primary key, which is all we need to drop one.
    const channel = supabase
      .channel("crown-wall")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rsvps" },
        (payload) => {
          if (!active) return;
          setRsvps((current) => {
            const list = current ?? [];
            if (payload.eventType === "INSERT") {
              const row = payload.new as Rsvp;
              if (list.some((r) => r.id === row.id)) return list;
              return [...list, row];
            }
            if (payload.eventType === "UPDATE") {
              const row = payload.new as Rsvp;
              return list.map((r) => (r.id === row.id ? { ...r, ...row } : r));
            }
            if (payload.eventType === "DELETE") {
              const gone = payload.old as { id?: string };
              return list.filter((r) => r.id !== gone.id);
            }
            return list;
          });
        },
      )
      .subscribe();

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  const coming = rsvps?.filter((r) => r.coming) ?? [];
  const notComing = rsvps?.filter((r) => !r.coming) ?? [];

  return (
    <section
      id="court"
      className="mx-auto flex w-full max-w-[28rem] flex-col items-center gap-5 px-5"
    >
      <h2 className="font-display text-3xl text-cream uppercase drop-shadow-[3px_3px_0_var(--color-brown)]">
        {copy.wall.heading}
      </h2>

      <div className="flex gap-2.5" aria-live="polite">
        <span className="font-pixel rounded-sm border-[3px] border-brown bg-yellow px-2.5 py-2 text-[10px] whitespace-nowrap text-brown uppercase">
          {coming.length} {copy.wall.coming}
        </span>
        {/* Muted against the yellow pill, but still cream-on-dark: ash-on-blue
            was too low contrast to read. */}
        <span className="font-pixel rounded-sm border-[3px] border-cream/45 bg-brown/45 px-2.5 py-2 text-[10px] whitespace-nowrap text-cream/85 uppercase">
          {notComing.length} {copy.wall.notComing}
        </span>
      </div>

      {failed ? (
        <p className="font-pixel text-center text-[10px] leading-relaxed text-cream/80">
          {copy.wall.failed}
        </p>
      ) : rsvps === null ? (
        <p className="font-pixel text-[10px] text-cream/70 uppercase">
          {copy.wall.loading}
        </p>
      ) : rsvps.length === 0 ? (
        <p className="font-display text-center text-lg text-cream">
          {copy.wall.empty}
        </p>
      ) : (
        <ul className="flex flex-wrap justify-center gap-3">
          {[...coming, ...notComing].map((rsvp) => (
            <CrownCard key={rsvp.id} rsvp={rsvp} />
          ))}
        </ul>
      )}
    </section>
  );
}
