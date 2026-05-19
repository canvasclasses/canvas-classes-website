/**
 * Shared authentication helpers for API route handlers.
 *
 * These work with NextRequest (cookie-based auth) — use them in any
 * /api/** route. For Server Components / Server Actions, use
 * lib/bookAuth.ts instead (which uses next/headers).
 */

import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';

/**
 * Extract the Supabase user from a request. Tries an `Authorization: Bearer`
 * header first (used by client-side `fetch` calls that pass the access token
 * explicitly), then falls back to session cookies (used by SSR-style requests).
 *
 * Returns null if unauthenticated or Supabase is not configured. Anon key only —
 * never the service-role key.
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<User | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return null;

  // 1) Bearer token (client-side fetches pass `Authorization: Bearer <access_token>`)
  const authHeader = request.headers.get('authorization') ?? request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    if (token) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) return user;
    }
  }

  // 2) Cookie session (SSR / server-rendered fetches)
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: { getAll: () => request.cookies.getAll(), setAll: () => {} },
  });
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Returns the Supabase user id for the current request, or null if the
 * request is anonymous / Supabase is not configured. This is the route-handler
 * equivalent of getUserId() in lib/bookAuth.ts (which is for Server Components).
 *
 * Use this inside /api/** route handlers that need to identify the user for
 * per-user data (progress, bookmarks, saved notes). Supports both Bearer and
 * cookie auth — see getAuthenticatedUser.
 */
export async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  const user = await getAuthenticatedUser(request);
  return user?.id ?? null;
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
