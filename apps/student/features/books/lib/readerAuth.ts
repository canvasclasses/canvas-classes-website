'use client';

import { createClient } from '@/app/utils/supabase/client';

/*
 * Shared client-side auth check for the book reader.
 *
 * Both FreeGate (the metered hard wall) and BookReader (the dismissible
 * sign-in nudge) need to know whether the visitor is logged in. Keeping the
 * cache in one module guarantees a single Supabase round-trip per tab — if
 * each component held its own cache they'd each pay the network latency.
 */

type AuthCache = { loggedIn: boolean; checkedAt: number } | null;
let authCache: AuthCache = null;
let authInflight: Promise<boolean> | null = null;

// Re-check at most once every 5 minutes in case the session flips (logout in
// another tab won't reach us; stale cache just means the gate still shows to
// anonymous users, which is the safe default).
const AUTH_TTL_MS = 5 * 60 * 1000;

export async function isReaderLoggedIn(): Promise<boolean> {
  const now = Date.now();
  if (authCache && now - authCache.checkedAt < AUTH_TTL_MS) return authCache.loggedIn;
  if (authInflight) return authInflight;

  authInflight = (async () => {
    try {
      const supabase = createClient();
      if (!supabase) return false;
      const { data } = await supabase.auth.getUser();
      const loggedIn = !!data.user;
      authCache = { loggedIn, checkedAt: Date.now() };
      return loggedIn;
    } catch {
      authCache = { loggedIn: false, checkedAt: Date.now() };
      return false;
    } finally {
      authInflight = null;
    }
  })();
  return authInflight;
}
