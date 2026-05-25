/**
 * Shared authentication helpers for admin app API route handlers.
 *
 * Port of apps/student/lib/auth.ts. Kept here (rather than promoted to a
 * @canvas/* package) because each app has its own auth boundary — admin's
 * auth model can evolve independently (e.g. Phase 7 Shape B bcrypt+JWT).
 *
 * CANONICAL PATTERN for admin route handlers — use `requireAdmin(request)`
 * exported below. It uniformly applies the three-tier gate (localhost dev
 * bypass → script-secret bypass → Supabase session + ADMIN_EMAILS check)
 * and stays in sync with the middleware. Do NOT re-implement the gate
 * inline. See CLAUDE.md §8.2 for the rule.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { isLocalhostDev } from './adminAuth';
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
  const adminEmails = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map(e => e.trim().toLowerCase());
  return adminEmails.includes(email.toLowerCase());
}

export function hasScriptSecret(request: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return request.headers.get('x-admin-secret') === secret;
}

/**
 * Scoped secret for the SEO morning-briefing routine. Granted ONLY at the
 * two briefing routes (`/api/v2/seo/digest` and `/api/v2/seo/briefing/synthesis`)
 * so a leaked briefing secret can read SEO data + write a synthesis, but can
 * NOT touch questions, flashcards, mock tests, or any other admin surface.
 *
 * Used by the remote Claude routine — see _agents/plans/SEO_DASHBOARD.md PR 4.
 */
export function hasBriefingSecret(request: NextRequest): boolean {
  const secret = process.env.BRIEFING_SECRET;
  if (!secret) return false;
  return request.headers.get('x-briefing-secret') === secret;
}

// =============================================================================
// CANONICAL admin gate for route handlers
// =============================================================================

/**
 * Identity surfaced by `requireAdmin`. On a real authenticated session this
 * mirrors the Supabase User's `id` and `email`. On a localhost dev bypass or
 * a script-secret bypass it's a synthetic placeholder so audit logs and
 * downstream code can use it uniformly without null-checks.
 */
export interface AdminIdentity {
  id: string;
  email: string;
}

export type AdminGateResult =
  | { ok: true; user: AdminIdentity }
  | { ok: false; response: NextResponse };

/**
 * The single canonical admin gate for all `apps/admin/app/api/**` route
 * handlers. Applies the three-tier check in order:
 *
 *   1. Localhost dev bypass (matches the admin middleware exactly so the gate
 *      doesn't say "401" on requests the middleware already let through).
 *   2. Script-secret bypass (`x-admin-secret` header == `ADMIN_SECRET`) for
 *      backend bulk-operation scripts that don't have a Supabase session.
 *   3. Supabase session + ADMIN_EMAILS allow-list — the production check.
 *
 * Usage:
 *
 *   export async function POST(request: NextRequest) {
 *     const gate = await requireAdmin(request);
 *     if (!gate.ok) return gate.response;
 *     // gate.user.id and gate.user.email are always strings here.
 *     ...
 *   }
 *
 * Do not call `getAuthenticatedUser` + `isAdmin` directly from a route
 * handler — the pattern silently forgets the localhost bypass and produces
 * the bug fixed in commit <pending>. Always use this helper instead.
 *
 * If a route needs a stricter check (e.g. RBAC permissions beyond the
 * ADMIN_EMAILS allow-list), apply that AFTER `requireAdmin` succeeds.
 */
export async function requireAdmin(request: NextRequest): Promise<AdminGateResult> {
  // Tier 1 — localhost dev bypass. Must match middleware.ts behaviour.
  if (await isLocalhostDev()) {
    return { ok: true, user: { id: 'dev-user', email: 'dev@localhost' } };
  }

  // Tier 2 — script-secret bypass for backend bulk scripts.
  if (hasScriptSecret(request)) {
    return { ok: true, user: { id: 'script', email: 'script@canvasclasses.in' } };
  }

  // Tier 3 — Supabase session + ADMIN_EMAILS allow-list.
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 },
      ),
    };
  }
  if (!isAdmin(user.email)) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 },
      ),
    };
  }

  return {
    ok: true,
    user: { id: user.id, email: user.email ?? 'unknown' },
  };
}
