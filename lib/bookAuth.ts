// Shared auth helpers for /api/v2/books/** routes.
//
// Every mutating book/page/chapter route must call requireAdmin() before
// touching the database. Keeping this logic in one place prevents the
// copy-paste drift that previously lived in 8 separate route files.

import { headers } from 'next/headers';
import { createClient } from '@/app/utils/supabase/server';

export interface AdminIdentity {
  email: string;
}

/**
 * Localhost dev bypass — only trips when the request host is 127.0.0.1 /
 * localhost AND we are explicitly in development mode. Prevents the old
 * behavior where a preview/staging deployment with NODE_ENV=development
 * was wide open to anonymous writes.
 */
export async function isLocalhostDev(): Promise<boolean> {
  if (process.env.NODE_ENV !== 'development') return false;
  // Vercel preview builds set NODE_ENV=development but run on a public host.
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

/**
 * Lightweight check — returns true if the current request belongs to an
 * admin. Use this inside GET routes that want to surface unpublished drafts
 * to admins but hide them from students.
 */
export async function isAdminRequest(): Promise<boolean> {
  return (await requireAdmin()) !== null;
}

/**
 * Returns the Supabase user id for the current request, or null if the
 * request is anonymous. Use this in endpoints that serve ANY authenticated
 * user (not just admins) — e.g. per-user reading progress.
 *
 * Applies the same localhost-only dev bypass as requireAdmin() so we never
 * accept 'dev-user' from a public host.
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
