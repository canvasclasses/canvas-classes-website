/**
 * Shared authentication helpers for API route handlers.
 *
 * These work with NextRequest (cookie-based auth) — use them in any
 * /api/** route. For Server Components / Server Actions, use
 * lib/bookAuth.ts instead (which uses next/headers).
 */

import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';

/**
 * Extract the Supabase user from the request cookies.
 * Returns null if unauthenticated or Supabase is not configured.
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<User | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return null;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: { getAll: () => request.cookies.getAll(), setAll: () => {} },
  });

  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Check if an email is in the ADMIN_EMAILS allow-list.
 */
export function isAdmin(email: string | undefined | null): boolean {
  if (!email) return false;
  const adminEmails = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map(e => e.trim().toLowerCase());
  return adminEmails.includes(email.toLowerCase());
}

/**
 * Check if the request carries the x-admin-secret header (for CLI scripts).
 */
export function hasScriptSecret(request: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return request.headers.get('x-admin-secret') === secret;
}
