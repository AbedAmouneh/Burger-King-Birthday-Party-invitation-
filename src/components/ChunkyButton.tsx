"use client";

import type { ReactNode } from "react";
import { useSound } from "@/lib/use-sound";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  tone?: "flame" | "yellow" | "royal";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
};

const TONES = {
  // White, not cream: the iOS anti-zoom rule pins button text to 16px, where
  // WCAG AA wants 4.5:1. Cream on flame is 4.34:1; white on flame is 5.12:1.
  flame: "bg-flame text-white border-brown",
  yellow: "bg-yellow text-brown border-brown",
  royal: "bg-royal text-cream border-brown",
} as const;

/**
 * Every tappable thing in the palace makes a noise. Rendered as an <a> when
 * given an href so it stays a real link (middle-click, long-press, share).
 * Min height 44px per the touch-target rule.
 */
export function ChunkyButton({
  children,
  onClick,
  href,
  tone = "flame",
  type = "button",
  disabled,
  className,
}: Props) {
  const { play } = useSound();

  const classes = [
    "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border-4 px-5 py-2.5",
    "font-display text-lg uppercase tracking-wide",
    "shadow-[0_4px_0_var(--color-brown)] active:translate-y-[3px] active:shadow-[0_1px_0_var(--color-brown)]",
    "transition-[transform,box-shadow] duration-100 disabled:opacity-50",
    TONES[tone],
    className ?? "",
  ].join(" ");

  function handleClick() {
    play("crunch");
    onClick?.();
  }

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
