"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { createAdminClient } from "@/lib/supabase-admin";
import type { Rsvp } from "@/lib/types";

/** Every action returns this shape so the client never has to guess. */
type Result<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Constant-time compare so a hash cannot be guessed byte by byte. */
function hashesMatch(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Change an existing crown. Authorised by the plaintext token the browser kept
 * when it created the row; the row itself holds only the digest.
 */
export async function updateRsvp(input: {
  id: string;
  token: string;
  coming: boolean;
  message: string | null;
}): Promise<Result> {
  if (!input.id || !input.token) {
    return { ok: false, error: "missing" };
  }

  const supabase = createAdminClient();
  const { data: row, error: readError } = await supabase
    .from("rsvps")
    .select("id, edit_token_hash")
    .eq("id", input.id)
    .maybeSingle();

  if (readError || !row) return { ok: false, error: "notfound" };
  if (
    !row.edit_token_hash ||
    !hashesMatch(row.edit_token_hash, sha256(input.token))
  ) {
    return { ok: false, error: "forbidden" };
  }

  // The name is deliberately not editable: changing it would let one guest
  // take over a name the duplicate rule is meant to protect.
  const { error } = await supabase
    .from("rsvps")
    .update({
      coming: input.coming,
      message: input.message?.trim() ? input.message.trim().slice(0, 180) : null,
    })
    .eq("id", input.id);

  if (error) return { ok: false, error: "failed" };
  return { ok: true, data: undefined };
}

/**
 * Opt in or out of the side quest, without touching anything else on the row.
 * Separate from updateRsvp so joining cannot accidentally overwrite the
 * guest's party answer or their message.
 */
export async function joinSideQuest(input: {
  id: string;
  token: string;
  joining: boolean;
}): Promise<Result> {
  if (!input.id || !input.token) return { ok: false, error: "missing" };

  const supabase = createAdminClient();
  const { data: row, error: readError } = await supabase
    .from("rsvps")
    .select("id, edit_token_hash")
    .eq("id", input.id)
    .maybeSingle();

  if (readError || !row) return { ok: false, error: "notfound" };
  if (
    !row.edit_token_hash ||
    !hashesMatch(row.edit_token_hash, sha256(input.token))
  ) {
    return { ok: false, error: "forbidden" };
  }

  const { error } = await supabase
    .from("rsvps")
    .update({ side_quest: input.joining })
    .eq("id", input.id);

  if (error) return { ok: false, error: "failed" };
  return { ok: true, data: undefined };
}

// ---------------------------------------------------------------------------
// Admin. Gated on ADMIN_PASSPHRASE, which never reaches the browser.
// ---------------------------------------------------------------------------

function passphraseValid(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSPHRASE;
  if (!expected) return false;
  const a = Buffer.from(candidate, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function adminList(
  passphrase: string,
): Promise<Result<Rsvp[]>> {
  if (!passphraseValid(passphrase)) return { ok: false, error: "forbidden" };

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("rsvps")
    .select("id, name, coming, message, side_quest, created_at")
    .order("created_at", { ascending: true })
    .limit(500);

  if (error) return { ok: false, error: "failed" };
  return { ok: true, data: (data ?? []) as Rsvp[] };
}

export async function adminDelete(
  passphrase: string,
  id: string,
): Promise<Result> {
  if (!passphraseValid(passphrase)) return { ok: false, error: "forbidden" };

  const supabase = createAdminClient();
  const { error } = await supabase.from("rsvps").delete().eq("id", id);
  if (error) return { ok: false, error: "failed" };
  return { ok: true, data: undefined };
}
