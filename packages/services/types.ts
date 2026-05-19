import type { NextRequest } from 'next/server';
import type { User } from '@supabase/supabase-js';

/**
 * Auth dependencies passed by each app into a service function.
 *
 * Both apps' implementations are identical today (admin's `lib/auth.ts` is a
 * verbatim port of student's; their `bookAuth.ts` / `adminAuth.ts` have
 * identical `isLocalhostDev` bodies). Per-app indirection is preserved so
 * admin can evolve auth independently — e.g. a Phase 7 Shape B migration to
 * bcrypt+JWT+admin_accounts would only need to swap the admin app's deps,
 * not touch this package.
 */
export interface ServiceDeps {
  getAuthenticatedUser: (request: NextRequest) => Promise<User | null>;
  isAdmin: (email: string | undefined | null) => boolean;
  hasScriptSecret: (request: NextRequest) => boolean;
  isLocalhostDev: () => Promise<boolean>;
}
