"use client";

import { useEffect, useState } from "react";
import { EVENT_START } from "@/lib/event";
import { copy } from "@/lib/copy";

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

/**
 * The party is a fixed instant, so the gap to it is the same number of
 * milliseconds wherever the viewer is. No timezone conversion belongs here;
 * Asia/Beirut only matters for *displaying* the date, which event.ts handles.
 */
function remainingFrom(now: number): Remaining | null {
  const ms = EVENT_START.getTime() - now;
  if (ms <= 0) return null;
  const totalSeconds = Math.floor(ms / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function Cell({ value, label }: { value: string; label: string }) {
  return (
    // Sits on the dark menu board, so the slot is darker than the board and
    // outlined in yellow: brown-on-brown would disappear.
    <div className="flex min-w-[3.9rem] flex-col items-center rounded-md border-[3px] border-yellow/70 bg-[#2b1008] px-2 py-2 shadow-[inset_0_0_16px_rgba(0,0,0,0.55)]">
      <span className="font-display text-3xl leading-none text-yellow tabular-nums">
        {value}
      </span>
      <span className="font-pixel mt-1.5 text-[10px] tracking-widest text-cream/70 uppercase">
        {label}
      </span>
    </div>
  );
}

export function Countdown() {
  // null until mounted: the server has no idea what "now" is on the client,
  // and rendering a real number here would guarantee a hydration mismatch.
  const [remaining, setRemaining] = useState<Remaining | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setRemaining(remainingFrom(Date.now()));
    // Recomputed from Date.now() every tick, so a throttled background tab
    // catches up instead of drifting.
    const id = window.setInterval(
      () => setRemaining(remainingFrom(Date.now())),
      1000,
    );
    return () => window.clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-3">
      <h2 className="font-display text-2xl text-cream uppercase">
        {copy.countdown.heading}
      </h2>

      {mounted && remaining === null ? (
        <p className="font-display text-xl text-yellow">{copy.countdown.live}</p>
      ) : (
        <div
          className="flex gap-2"
          role="timer"
          aria-live="off"
          aria-label={copy.countdown.heading}
        >
          <Cell
            value={remaining ? String(remaining.days) : "--"}
            label={copy.countdown.units.days}
          />
          <Cell
            value={remaining ? pad(remaining.hours) : "--"}
            label={copy.countdown.units.hours}
          />
          <Cell
            value={remaining ? pad(remaining.minutes) : "--"}
            label={copy.countdown.units.minutes}
          />
          <Cell
            value={remaining ? pad(remaining.seconds) : "--"}
            label={copy.countdown.units.seconds}
          />
        </div>
      )}
    </div>
  );
}
