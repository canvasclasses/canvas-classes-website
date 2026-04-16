import { createClient } from '@supabase/supabase-js';

const cache = new Map<string, { value: boolean; exp: number }>();
const TTL_MS = 60_000;

export async function hasServerConsent(userId: string): Promise<boolean> {
  const cached = cache.get(userId);
  if (cached && cached.exp > Date.now()) return cached.value;

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceKey || !url) return true;

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
