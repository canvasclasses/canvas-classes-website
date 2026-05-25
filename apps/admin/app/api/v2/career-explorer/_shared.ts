// Shared helpers for /api/v2/career-explorer/* routes in apps/admin.
//
// Auth guard, rate limiter, and consistent error shape. Slim port of
// apps/student/app/api/v2/career-explorer/_shared.ts — only the helpers
// admin routes actually use are kept. The student-side `requireAuthedUser`
// (permits any logged-in user) is intentionally omitted because admin
// middleware already enforces SUPER_ADMIN_EMAILS — there's no scenario in this
// app where we'd want "any authenticated user" auth.
// Follow CLAUDE.md Rule 8 — never define local auth helpers elsewhere.

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, isAdmin } from '@/lib/auth';

export async function requireAdminUser(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user || !isAdmin(user.email)) {
    return { ok: false as const, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { ok: true as const, user };
}

export function errorResponse(message: string, status = 500) {
  // Never leak internals — message must be a safe, user-facing string.
  return NextResponse.json({ error: message }, { status });
}

// Shared in-memory rate limiter for all /api/v2/career-explorer/* routes.
// One budget across the 3 sibling routes — matches the pre-consolidation behaviour.
import { createRateLimiter, getClientIp } from '@canvas/core/rate-limit';

const careerExplorerLimiter = createRateLimiter({ max: 300, windowMs: 60_000 });

export function rateLimit(ip: string, max: number): { ok: boolean; remaining: number } {
  return careerExplorerLimiter.check(ip, { max });
}

export const requestIp = getClientIp;
