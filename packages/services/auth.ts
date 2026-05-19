import { NextResponse, type NextRequest } from 'next/server';
import type { User } from '@supabase/supabase-js';
import type { ServiceDeps } from './types';

/**
 * Admin-gate result. On success, `user` may be `null` only when the request
 * came from localhost dev (where the bypass produces no Supabase session).
 */
export type AdminGateResult =
  | { ok: true; user: User | null }
  | { ok: false; response: NextResponse };

/**
 * Centralised admin gate for `@canvas/services` handlers. Replaces the
 * 12-line "localhost bypass → require user → require admin email" preamble
 * that was copy-pasted across every admin-only service route. Future
 * admin-mutation handlers added to this package should call this instead
 * of re-implementing the gate inline.
 *
 * Usage:
 *
 *   const gate = await requireAdmin(req, deps);
 *   if (!gate.ok) return gate.response;
 *   // gate.user is User | null (null only on localhost bypass)
 *
 * Auth shape ([ADR-003](../../_agents/adr/003-admin-auth-shape-a-first.md)):
 * delegates to the app's `deps.isAdmin` so a future Shape B migration
 * (bcrypt + JWT + admin_accounts) swaps one function per app and this gate
 * keeps working unchanged.
 */
export async function requireAdmin(
  request: NextRequest,
  deps: ServiceDeps,
): Promise<AdminGateResult> {
  if (await deps.isLocalhostDev()) {
    return { ok: true, user: null };
  }

  const user = await deps.getAuthenticatedUser(request);
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      ),
    };
  }

  if (!deps.isAdmin(user.email)) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 },
      ),
    };
  }

  return { ok: true, user };
}
