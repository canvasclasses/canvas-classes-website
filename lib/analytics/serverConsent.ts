import { createClient } from '@supabase/supabase-js';

// Intentional design: this helper FAILS OPEN.
//
// - Missing SUPABASE_SERVICE_ROLE_KEY → treat as consented.
// - Supabase lookup errors / thrown exceptions → treat as consented.
//
// Rationale: server events only fire for authenticated users, whose
// consent choice was captured at the banner before any server event
// was possible. Losing a server-side signal to a transient Supabase
// error or a temporary misconfiguration is a worse outcome than briefly
// sending one or two events for a user who has since revoked. The
// client-side gate remains strict — that is the primary enforcement.

const cache = new Map<string, { value: boolean; exp: number }>();
const TTL_MS = 60_000;
let warnedMissingKey = false;

export async function hasServerConsent(userId: string): Promise<boolean> {
  const cached = cache.get(userId);
  if (cached && cached.exp > Date.now()) return cached.value;

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceKey || !url) {
    if (!warnedMissingKey) {
      warnedMissingKey = true;
      console.warn(
        '[analytics] SUPABASE_SERVICE_ROLE_KEY is not set — server-side consent checks cannot run; defaulting to granted.'
      );
    }
    return true;
  }

  try {
    const admin = createClient(url, serviceKey);
    const { data, error } = await admin.auth.admin.getUserById(userId);
    if (error || !data?.user) return true;
    const consent = data.user.user_metadata?.consent;
    const value = consent !== 'denied';
    cache.set(userId, { value, exp: Date.now() + TTL_MS });
    return value;
  } catch {
    return true;
  }
}
