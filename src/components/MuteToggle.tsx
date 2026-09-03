"use client";

import { copy } from "@/lib/copy";
import { useSound } from "@/lib/use-sound";

/**
 * Sound is on by default, but a browser will not let an AudioContext start
 * before a user gesture, so nothing is audible until the first tap anyway.
 * This button is both the switch and a valid first gesture.
 */
export function MuteToggle() {
  const { muted, toggleMuted, play } = useSound();

  return (
    <button
      type="button"
      onClick={() => {
        toggleMuted();
        // Confirm the new state audibly, but only when turning sound back on.
        if (muted) play("squeak");
      }}
      aria-pressed={muted}
      aria-label={muted ? copy.sound.muteOff : copy.sound.muteOn}
      title={muted ? copy.sound.muteOff : copy.sound.muteOn}
      className="fixed right-3 bottom-3 z-50 flex h-11 w-11 items-center justify-center rounded-full border-4 border-brown bg-yellow shadow-[0_3px_0_var(--color-brown)] active:translate-y-[2px] active:shadow-none"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z"
          fill="#502314"
          stroke="#502314"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        {muted ? (
          <path
            d="M16 9.5l5 5M21 9.5l-5 5"
            stroke="#d62300"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M15.5 9c1.2 1.2 1.2 4.8 0 6M18 7c2.2 2.2 2.2 8 0 10"
            fill="none"
            stroke="#502314"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
      </svg>
    </button>
  );
}
