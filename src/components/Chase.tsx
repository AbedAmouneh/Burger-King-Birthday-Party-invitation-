"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Runner } from "./Runner";
import headAbed from "../../public/photos/gallery/indoor-selfie-head-1.webp";
import headLynn from "../../public/photos/gallery/indoor-selfie-head-2.webp";
import headJamil from "../../public/photos/gallery/nour-jamil-head-1.webp";
import headNour from "../../public/photos/gallery/nour-jamil-head-2.webp";

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
  },
  {
    chaser: {
      head: headNour,
      shirt: "#f08fa8",
      legs: "#2e2725",
      weapon: "pistol" as const,
    },
    fleeing: { head: headJamil, shirt: "#2e2725", legs: "#e8dcc4" },
  },
];

type Run = {
  /** Changes every run so React remounts the pair and the animation restarts. */
  id: number;
  pair: number;
  direction: "ltr" | "rtl";
  /** Distance from the top of the viewport, in percent. */
  top: number;
  seconds: number;
};

const FIRST_RUN_MIN = 5_000;
const FIRST_RUN_JITTER = 5_000;
const GAP_MIN = 14_000;
const GAP_JITTER = 16_000;

function randomRun(): Run {
  return {
    id: Date.now(),
    pair: Math.floor(Math.random() * PAIRS.length),
    direction: Math.random() < 0.5 ? "ltr" : "rtl",
    // Kept away from the very top and bottom, where the fixed mute button and
    // the page's own headings live.
    top: 22 + Math.random() * 52,
    seconds: 4.2 + Math.random() * 2.6,
  };
}

/**
 * Every so often, one of the pairs tears across the screen: Lynn after Abed
 * with a slipper, or Nour after Jamil with a water pistol.
 *
 * Purely decorative: the layer never takes pointer events, sits below the mute
 * button and the admin panel, and is switched off entirely for anyone who asks
 * for reduced motion.
 */
export function Chase() {
  const reduceMotion = useReducedMotion();
  const [run, setRun] = useState<Run | null>(null);

  useEffect(() => {
    if (reduceMotion) return;

    let timer: number;
    const schedule = (delay: number) => {
      timer = window.setTimeout(() => {
        // Randomising on the client only: picking a route during render would
        // give the server one answer and the browser another.
        setRun(randomRun());
        schedule(GAP_MIN + Math.random() * GAP_JITTER);
      }, delay);
    };

    schedule(FIRST_RUN_MIN + Math.random() * FIRST_RUN_JITTER);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  if (!run) return null;
  const { chaser, fleeing } = PAIRS[run.pair];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
    >
      <div
        key={run.id}
        className={run.direction === "ltr" ? "chase-ltr" : "chase-rtl"}
        style={{ top: `${run.top}%`, animationDuration: `${run.seconds}s` }}
        onAnimationEnd={() => setRun(null)}
      >
        <div className="flex items-end gap-2">
          <Runner {...chaser} />
          <Runner {...fleeing} />
        </div>
      </div>
    </div>
  );
}
