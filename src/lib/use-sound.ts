"use client";

import { useCallback, useSyncExternalStore } from "react";
import { isMuted, loadMuted, play, setMuted, unlockAudio, type Voice } from "./sound";

/**
 * Tiny external store so the mute button re-renders when the preference
 * changes, without dragging a context provider through the whole tree.
 */
const listeners = new Set<() => void>();

function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit(): void {
  listeners.forEach((fn) => fn());
}

let hydrated = false;

function getSnapshot(): boolean {
  if (!hydrated) {
    loadMuted();
    hydrated = true;
  }
  return isMuted();
}

/** The server has no localStorage, so it always renders the unmuted state. */
function getServerSnapshot(): boolean {
  return false;
}

export function useSound() {
  const muted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleMuted = useCallback(() => {
    // Toggling is itself a user gesture, so it is a valid moment to unlock.
    unlockAudio();
    setMuted(!isMuted());
    emit();
  }, []);

  const playVoice = useCallback((voice: Voice) => {
    play(voice);
  }, []);

  return { muted, toggleMuted, play: playVoice };
}
