"use client";

import { useState } from "react";
import { copy } from "@/lib/copy";
import { useSound } from "@/lib/use-sound";

export function Footer() {
  const { play } = useSound();
  const [copied, setCopied] = useState(false);

  async function share() {
    play("crunch");
    const url = window.location.origin;
    const text = `${copy.meta.title} ${url}`;

    // The native sheet is the right answer on a phone, which is where this
    // link lives. Clipboard is the desktop fallback.
    if (navigator.share) {
      try {
        await navigator.share({ title: copy.meta.title, text: copy.meta.description, url });
        return;
      } catch {
        // Cancelled, or not permitted: fall through to the clipboard.
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <footer className="flex flex-col items-center gap-4 bg-brown px-5 py-10 text-center">
      <button
        type="button"
        onClick={share}
        className="font-display inline-flex min-h-[44px] items-center rounded-xl border-4 border-cream bg-yellow px-5 py-2.5 text-lg text-brown uppercase shadow-[0_4px_0_var(--color-cream)] active:translate-y-[3px] active:shadow-none"
      >
        {copy.footer.share}
      </button>
      {copied ? (
        <p role="status" className="font-pixel text-[10px] text-yellow">
          {copy.footer.shareCopied}
        </p>
      ) : null}
      <p className="font-pixel text-[10px] text-cream/70">
        {copy.footer.madeBy}
      </p>
    </footer>
  );
}
