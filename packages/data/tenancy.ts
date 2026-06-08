import 'server-only';
import connectToDatabase from './db/mongodb';
import TenantMembership, { type ITenantMembership, type TenantRole } from './models/TenantMembership';

/**
 * TENANCY helpers (Phase 3, ADR-011 / UNIFIED_LEARNER_PERSONA.md §7).
 *
 * The single source of "which tenant does this user belong to". Every persona
 * write path resolves the user's tenant here and stamps it onto the learner
 * record / event at CREATION time (an identity field, like user_email) — never
 * through the persona writer, so the writer.ts invariant is untouched.
 *
 * Fail-safe by design: any error (no membership, DB blip) resolves to the
 * default `'public'` tenant. Tenancy must never break the student flow.
 */

/** Reserved default tenant — all existing/unmapped B2C students belong here. */
export const DEFAULT_TENANT_ID = 'public';

export type { TenantRole };

// user_id → tenant_id, cached briefly. Membership rarely changes, and this runs
// on the hot path (every event emit), so a short cache avoids a DB read per
// attempt. Per-instance + best-effort (CLAUDE.md §8.11) — fine at current scale.
const TTL_MS = 5 * 60_000;
const CAP = 5_000;
const cache = new Map<string, { at: number; tenantId: string }>();

/**
 * Resolve a user's tenant id. Returns DEFAULT_TENANT_ID when the user has no
 * active membership or on any error. Cached for 5 minutes.
 */
export async function resolveTenantId(userId: string | null | undefined): Promise<string> {
  if (!userId) return DEFAULT_TENANT_ID;
  const now = Date.now();
  const hit = cache.get(userId);
  if (hit && now - hit.at < TTL_MS) return hit.tenantId;

  try {
    await connectToDatabase();
    const m = await TenantMembership.findOne({ user_id: userId, status: 'active' })
      .select('tenant_id')
      .lean<{ tenant_id?: string } | null>();
    // A successful query resolves the tenant (the row's value, or 'public' when
    // there's no membership). Only THIS result is cacheable.
    const tenantId = m?.tenant_id ?? DEFAULT_TENANT_ID;
    if (cache.size > CAP) cache.clear();
    cache.set(userId, { at: now, tenantId });
    return tenantId;
  } catch {
    // Fail safe to public WITHOUT caching — a transient DB error must not get
    // pinned for 5 minutes and permanently misstamp a B2B student's persona doc
    // (tenant_id is set once at creation). The next call retries.
    return DEFAULT_TENANT_ID;
  }
}

/** Full active membership (role/section), or null when the user is default-public. */
export async function getMembership(
  userId: string | null | undefined,
): Promise<Pick<ITenantMembership, 'tenant_id' | 'role' | 'section'> | null> {
  if (!userId) return null;
  try {
    await connectToDatabase();
    return await TenantMembership.findOne({ user_id: userId, status: 'active' })
      .select('tenant_id role section')
      .lean<Pick<ITenantMembership, 'tenant_id' | 'role' | 'section'> | null>();
  } catch {
    return null;
  }
}

/** Invalidate the cache for a user (call after a membership change). */
export function invalidateTenantCache(userId: string): void {
  cache.delete(userId);
}

/**
 * Mongo filter for content a tenant may SEE: global content (no tenant_id set)
 * OR content owned by this tenant. Use on tenant-scoped content reads once
 * content carries an optional tenant_id (private per-school banks — a Phase 3
 * follow-on). Global/shared content (the default) stays visible to everyone.
 */
export function tenantContentFilter(tenantId: string): Record<string, unknown> {
  return {
    $or: [
      { tenant_id: { $exists: false } },
      { tenant_id: null },
      { tenant_id: tenantId },
    ],
  };
}
