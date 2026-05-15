import type { NextRequest } from 'next/server';

export interface RateLimitOptions {
  max?: number;
  windowMs?: number;
  maxEntries?: number;
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
}

export interface Limiter {
  check(key: string, overrides?: { max?: number }): RateLimitResult;
}

const DEFAULT_MAX = 30;
const DEFAULT_WINDOW_MS = 60_000;
const DEFAULT_MAX_ENTRIES = 5_000;

/**
 * Create an in-memory rate limiter with its own private budget.
 *
 * Each call to createRateLimiter() returns an independent Limiter — separate
 * routes get separate budgets so traffic on one endpoint can't deplete the
 * window on another.
 *
 * Notes:
 * - In a multi-instance deployment each instance has its own map, so effective
 *   limits are per-instance. For production scale, replace with Redis-backed
 *   rate limiting (e.g. @upstash/ratelimit).
 * - The limiter performs lazy cleanup on each call: expired entries are evicted
 *   once per 2× windowMs, and the map is hard-capped at maxEntries to prevent
 *   memory growth from unique IPs.
 */
export function createRateLimiter(options: RateLimitOptions = {}): Limiter {
  const max = options.max ?? DEFAULT_MAX;
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
  const maxEntries = options.maxEntries ?? DEFAULT_MAX_ENTRIES;

  const store = new Map<string, { count: number; resetAt: number }>();
  let lastCleanup = Date.now();

  function check(key: string, overrides?: { max?: number }): RateLimitResult {
    const effectiveMax = overrides?.max ?? max;
    const now = Date.now();

    if (now - lastCleanup > windowMs * 2) {
      for (const [k, v] of store) {
        if (now > v.resetAt) store.delete(k);
      }
      lastCleanup = now;
    }

    if (store.size >= maxEntries && !store.has(key)) {
      return { ok: false, remaining: 0 };
    }

    const entry = store.get(key);
    if (!entry || now > entry.resetAt) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return { ok: true, remaining: effectiveMax - 1 };
    }
    if (entry.count >= effectiveMax) {
      return { ok: false, remaining: 0 };
    }
    entry.count++;
    return { ok: true, remaining: effectiveMax - entry.count };
  }

  return { check };
}

/**
 * Extract the client IP from a NextRequest using the standard proxy headers.
 * Returns 'unknown' as a fallback to keep callers branch-free.
 */
export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown'
  );
}
