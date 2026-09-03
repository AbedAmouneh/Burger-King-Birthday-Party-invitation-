"use client";

const STORAGE_KEY = "double-crown:my-rsvp";

export type MyRsvp = { id: string; token: string; name: string };

/**
 * The browser remembers which crown it put on the wall so the guest can come
 * back and change their answer. Only the plaintext token lives here; the row
 * stores nothing but its SHA-256 digest.
 */
export function loadMyRsvp(): MyRsvp | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof (parsed as MyRsvp).id === "string" &&
      typeof (parsed as MyRsvp).token === "string" &&
      typeof (parsed as MyRsvp).name === "string"
    ) {
      return parsed as MyRsvp;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveMyRsvp(value: MyRsvp): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Private mode: the guest simply loses the ability to edit later.
  }
}

export function clearMyRsvp(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to do.
  }
}

/** 256 bits of randomness, hex encoded. */
export function newToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * SubtleCrypto is only exposed on secure origins, which includes localhost.
 * Deployments are HTTPS, so this is always available in practice.
 */
export async function hashToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token),
  );
  return Array.from(new Uint8Array(digest), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}
