// Shared helpers for /api/v2/career-explorer/* routes.
//
// Auth guard, admin guard, rate limiter, and consistent error shape.
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

export async function requireAuthedUser(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return { ok: false as const, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { ok: true as const, user };
}

export function errorResponse(message: string, status = 500) {
  // Never leak internals — message must be a safe, user-facing string.
  return NextResponse.json({ error: message }, { status });
}

// Minimal in-memory rate limit (copy of the pattern in college-predictor).
// TODO(production): replace with Upstash Redis when traffic scales.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_ENTRIES = 5000;

type RateEntry = { count: number; reset_at: number };
const rateStore = new Map<string, RateEntry>();

export function rateLimit(ip: string, max: number): { ok: boolean; remaining: number } {
  const now = Date.now();
  if (rateStore.size > RATE_LIMIT_MAX_ENTRIES) {
    for (const [k, v] of rateStore) {
      if (v.reset_at < now) rateStore.delete(k);
      if (rateStore.size <= RATE_LIMIT_MAX_ENTRIES) break;
    }
  }
  const entry = rateStore.get(ip);
  if (!entry || entry.reset_at < now) {
    rateStore.set(ip, { count: 1, reset_at: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true, remaining: max - 1 };
  }
  if (entry.count >= max) return { ok: false, remaining: 0 };
  entry.count++;
  return { ok: true, remaining: max - entry.count };
}

export function requestIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}
