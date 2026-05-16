// Admin auth helpers for Server Components / Server Actions in apps/admin.
//
// Port of apps/student/lib/bookAuth.ts. Renamed to adminAuth.ts since the
// admin app has no books-specific scope — every page here is admin-only.

import { headers } from 'next/headers';
import { createClient } from '@/app/utils/supabase/server';

export interface AdminIdentity {
  email: string;
}

/**
 * Localhost dev bypass — only trips when the request host is 127.0.0.1 /
 * localhost AND we are explicitly in development mode AND not on Vercel.
 * Vercel preview builds set NODE_ENV=development but run on a public host;
 * the third check defends against that.
 */
export async function isLocalhostDev(): Promise<boolean> {
  if (process.env.NODE_ENV !== 'development') return false;
  if (process.env.VERCEL === '1') return false;
  try {
    const h = await headers();
    const host = (h.get('host') || '').toLowerCase();
    return host.startsWith('localhost') || host.startsWith('127.0.0.1');
  } catch {
    return false;
  }
}

/**
 * Returns the admin identity if the current request is authenticated AND
 * the user's email is in the ADMIN_EMAILS allow-list. Returns null otherwise.
 *
 * Callers should 403 when this returns null.
 */
export async function requireAdmin(): Promise<AdminIdentity | null> {
  if (await isLocalhostDev()) {
    return { email: 'dev@localhost' };
  }
  try {
    const supabase = await createClient();
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return null;

    const adminEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (!adminEmails.includes(user.email.toLowerCase())) return null;
    return { email: user.email };
  } catch {
    return null;
  }
}

export async function isAdminRequest(): Promise<boolean> {
  return (await requireAdmin()) !== null;
}

/**
 * Returns the Supabase user id for the current request, or null if
 * the request is anonymous. Applies the same localhost-only dev bypass
 * as requireAdmin so we never accept 'dev-user' from a public host.
 */
export async function getUserId(): Promise<string | null> {
  if (await isLocalhostDev()) return 'dev-user';
  try {
    const supabase = await createClient();
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id ?? null;
  } catch {
    return null;
  }
}
