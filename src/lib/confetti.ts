"use client";

/**
 * Confetti is loaded on demand: it is ~7 KB that only matters after someone
 * actually claims a crown, so it should not sit in the first-load bundle.
 */
export async function crownConfetti(): Promise<void> {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const { default: confetti } = await import("canvas-confetti");
  const colors = ["#d62300", "#f5821f", "#ffc72c", "#1e3a8a", "#f5ebdc"];

  confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 }, colors });
  window.setTimeout(
    () =>
      confetti({
        particleCount: 45,
        spread: 100,
        decay: 0.92,
        scalar: 1.2,
        origin: { y: 0.65 },
        colors,
      }),
    140,
  );
}
