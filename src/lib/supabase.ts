"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Browser client, created lazily so a missing env var surfaces as a runtime
 * error in the one component that needs it rather than failing the whole build.
 * Carries the anon key, so it can only do what the RLS policies in
 * supabase/schema.sql allow: select and insert.
 */
export function getSupabase(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy .env.local.example to .env.local and fill it in.",
    );
  }

  client = createClient(url, anonKey, {
    auth: { persistSession: false },
    realtime: { params: { eventsPerSecond: 5 } },
  });
  return client;
}
