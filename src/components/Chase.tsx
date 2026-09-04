"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Runner } from "./Runner";
import headAbed from "../../public/photos/gallery/indoor-selfie-head-1.webp";
import headLynn from "../../public/photos/gallery/indoor-selfie-head-2.webp";
import headJamil from "../../public/photos/gallery/nour-jamil-head-1.webp";
import headNour from "../../public/photos/gallery/nour-jamil-head-2.webp";
import headSally from "../../public/photos/gallery/sally-head-1.webp";
import headMohammad from "../../public/photos/gallery/mohammad-head-1.webp";
import headDia from "../../public/photos/gallery/kassem-dia-head-1.webp";
import headKassem from "../../public/photos/gallery/kassem-dia-head-2.webp";

/**
 * Who chases whom, and with what. The chaser is listed first because in a flex
 * row travelling rightwards the leftmost figure trails: whoever is rightmost is
 * the one being chased.
 */
const PAIRS = [
  {
    chaser: {
      head: headLynn,
      shirt: "#d62300",
      legs: "#502314",
      weapon: "slipper" as const,
    },
    fleeing: { head: headAbed, shirt: "#f5ebdc", legs: "#1e3a8a" },
    /** Slipper range is arm's length, so they run close together. */
    gap: 8,
  },
  {
    chaser: {
      head: headNour,
      shirt: "#f08fa8",
      legs: "#2e2725",
      weapon: "pistol" as const,
    },
    fleeing: { head: headJamil, shirt: "#2e2725", legs: "#e8dcc4" },
    /** Wider: the barrel and the flash need clear air between them and Jamil. */
    gap: 82,
  },
  {
    chaser: {
      head: headSally,
      shirt: "#f5ebdc",
      legs: "#4a4644",
      weapon: "hand" as const,
    },
    fleeing: { head: headMohammad, shirt: "#2e2725", legs: "#4a4644" },
    /** A kaff lands at arm's length, same as the slipper. */
    gap: 8,
  },
  {
    chaser: {
      head: headDia,
      shirt: "#2e2725",
      legs: "#4a4644",
      weapon: "shout" as const,
      shout: "MAFI RADIANT",
    },
    fleeing: { head: headKassem, shirt: "#d62300", legs: "#e8dcc4" },
    /** Room for the bubble to sit between them rather than over his head. */
    gap: 70,
  },
];

type Run = {
  id: number;
  /** Which pairs run together. More than one makes a stampede. */
  pairs: number[];
  direction: "ltr" | "rtl";
  /** Distance from the top of the viewport, in percent. */
  top: number;
  seconds: number;
};

const FIRST_RUN_MIN = 4_000;
const FIRST_RUN_JITTER = 3_000;
const GAP_MIN = 7_000;
const GAP_JITTER = 8_000;

/** Chance a scheduled run sends two pairs at different heights at once. */
const DOUBLE_CHANCE = 0.3;
/** Chance it is a stampede: everyone in one line. */
const STAMPEDE_CHANCE = 0.12;

let nextId = 1;

function makeRun(pairs: number[], topBand: number): Run {
  return {
    id: nextId++,
    pairs,
    direction: Math.random() < 0.5 ? "ltr" : "rtl",
    // Bands keep simultaneous runs off each other, and away from the very top
    // and bottom where the fixed mute button and the headings live.
    top: topBand + Math.random() * 16,
    seconds: 4 + Math.random() * 2.8,
  };
}

/**
 * Every so often people tear across the screen: Lynn after Abed with a
 * slipper, Nour after Jamil with a pistol, Sally after Mohammad with a kaff.
 * Sometimes two chases at once, occasionally everyone at the same time.
 *
 * Purely decorative: the layer never takes pointer events, sits below the mute
 * button and the admin panel, and is off entirely under reduced motion.
 */
export function Chase() {
  const reduceMotion = useReducedMotion();
  const [runs, setRuns] = useState<Run[]>([]);
  const timer = useRef<number | undefined>(undefined);

  const spawn = useCallback(() => {
    const roll = Math.random();
    const order = PAIRS.map((_, i) => i).sort(() => Math.random() - 0.5);

    if (roll < STAMPEDE_CHANCE) {
      setRuns((r) => [...r, makeRun(order, 26 + Math.random() * 30)]);
      return;
    }

    if (roll < STAMPEDE_CHANCE + DOUBLE_CHANCE) {
      // Two chases at once, parked in separate bands so they do not collide.
      setRuns((r) => [...r, makeRun([order[0]], 20), makeRun([order[1]], 56)]);
      return;
    }

    setRuns((r) => [...r, makeRun([order[0]], 22 + Math.random() * 36)]);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const schedule = (delay: number) => {
      timer.current = window.setTimeout(() => {
        spawn();
        schedule(GAP_MIN + Math.random() * GAP_JITTER);
      }, delay);
    };

    schedule(FIRST_RUN_MIN + Math.random() * FIRST_RUN_JITTER);
    return () => window.clearTimeout(timer.current);
  }, [reduceMotion, spawn]);

  if (runs.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
    >
      {runs.map((run) => (
        <div
          key={run.id}
          className={run.direction === "ltr" ? "chase-ltr" : "chase-rtl"}
          style={{ top: `${run.top}%`, animationDuration: `${run.seconds}s` }}
          onAnimationEnd={() =>
            setRuns((current) => current.filter((r) => r.id !== run.id))
          }
        >
          <div className="flex items-end">
            {run.pairs.map((index, position) => {
              const { chaser, fleeing, gap } = PAIRS[index];
              return (
                <div
                  key={index}
                  className="flex items-end"
                  // Space between chases in a stampede, none before the first.
                  style={{ gap: `${gap}px`, marginLeft: position ? 46 : 0 }}
                >
                  <Runner {...chaser} />
                  <Runner {...fleeing} />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
