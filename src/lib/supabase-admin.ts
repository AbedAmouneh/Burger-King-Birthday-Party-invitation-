import "server-only";

import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client. Bypasses RLS entirely, so it must never be imported
 * into a client component. The "server-only" import above turns any such
 * mistake into a build error rather than a leaked key.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
