/**
 * Shared authentication helpers for admin app API route handlers.
 *
 * Port of apps/student/lib/auth.ts. Kept here (rather than promoted to a
 * @canvas/* package) because each app has its own auth boundary — admin's
 * auth model can evolve independently (e.g. Phase 7 Shape B bcrypt+JWT).
 */

import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';

export async function getAuthenticatedUser(request: NextRequest): Promise<User | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return null;

  const authHeader = request.headers.get('authorization') ?? request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    if (token) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) return user;
    }
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: { getAll: () => request.cookies.getAll(), setAll: () => {} },
  });
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  const user = await getAuthenticatedUser(request);
  return user?.id ?? null;
}

export function isAdmin(email: string | undefined | null): boolean {
  if (!email) return false;
  const adminEmails = (process.env.SUPER_ADMIN_EMAILS ?? '')
    .split(',')
    .map(e => e.trim().toLowerCase());
  return adminEmails.includes(email.toLowerCase());
}

export function hasScriptSecret(request: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return request.headers.get('x-admin-secret') === secret;
}
