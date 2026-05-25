/**
 * Role-Based Access Control (RBAC) — grant-based model
 *
 * Architecture:
 *   - Super admin: defined in SUPER_ADMIN_EMAILS env var. Cannot be created or
 *     modified via HTTP. Has all powers including delete and role management.
 *   - Staff: stored in `user_access` collection as a list of grants
 *     { subject, chapters: 'all' | string[], level: 'view' | 'edit' }.
 *   - Unknown user: no env entry AND no user_access doc → fail-safe, no powers.
 *
 * Three enforcement layers (see CLAUDE.md §7):
 *   1. Middleware (apps/admin/middleware.ts): env OR active user_access doc.
 *   2. Service handlers (packages/services/*): per-chapter check on stored doc.
 *   3. Client hook (apps/admin/features/admin/hooks/usePermissions.ts): UX hint.
 */

import type { Grant, Subject, IUserAccess } from './models/UserAccess';
import { UserAccess } from './models/UserAccess';
import connectToDatabase from './db/mongodb';
import { TAXONOMY_FROM_CSV } from './taxonomy/taxonomyData_from_csv';

export type { Grant, Subject, AccessLevel } from './models/UserAccess';

// ── Chapter ↔ subject mapping ────────────────────────────────────────────────
// IMPORTANT: this mapping is duplicated in packages/data/models/UserAccess.ts
// (inside getSubjectFromChapterId there). Keep the two in sync. CLAUDE.md §9
// rules out extracting a shared helper until a third caller appears.

export function getSubjectFromChapterId(chapterId: string): Subject | null {
  if (chapterId.startsWith('ch11_') || chapterId.startsWith('ch12_')) return 'chemistry';
  if (chapterId.startsWith('ph11_') || chapterId.startsWith('ph12_')) return 'physics';
  if (chapterId.startsWith('ma_')) return 'mathematics';
  if (
    chapterId.startsWith('bio9_') ||
    chapterId.startsWith('bio11_') ||
    chapterId.startsWith('bio12_')
  ) {
    return 'biology';
  }
  return null;
}

interface TaxonomyNode {
  type: string;
  id: string;
}

export function getChapterIdsForSubject(subject: Subject): string[] {
  return (TAXONOMY_FROM_CSV as TaxonomyNode[])
    .filter((node) => node.type === 'chapter')
    .filter((node) => getSubjectFromChapterId(node.id) === subject)
    .map((node) => node.id);
}

// ── Env super-admin check (pure, no I/O) ────────────────────────────────────

function parseSuperAdminEmails(): string[] {
  return (process.env.SUPER_ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isSuperAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return parseSuperAdminEmails().includes(email.toLowerCase());
}

export function listSuperAdmins(): string[] {
  return parseSuperAdminEmails();
}

// ── Per-process cache for getEffectiveAccess (60s TTL, 5000-entry cap) ──────

export type EffectiveAccess =
  | { isSuperAdmin: true }
  | { isSuperAdmin: false; grants: Grant[] };

type CachedAccess = { value: EffectiveAccess; expiresAt: number };
const accessCache = new Map<string, CachedAccess>();
const ACCESS_TTL_MS = 60_000;
const ACCESS_CACHE_MAX = 5_000;

export function invalidateAccessCache(email: string): void {
  accessCache.delete(email.toLowerCase());
}

export function clearAccessCache(): void {
  accessCache.clear();
}

/**
 * Returns the effective access for `email`:
 *   - super admin → { isSuperAdmin: true }
 *   - staff with active user_access doc → { isSuperAdmin: false, grants }
 *   - unknown → { isSuperAdmin: false, grants: [] }
 *
 * Cached for {@link ACCESS_TTL_MS}. Writes to user_access SHOULD call
 * {@link invalidateAccessCache} for instant propagation.
 */
export async function getEffectiveAccess(email: string): Promise<EffectiveAccess> {
  if (isSuperAdmin(email)) return { isSuperAdmin: true };

  const key = email.toLowerCase();
  const now = Date.now();
  const hit = accessCache.get(key);
  if (hit && hit.expiresAt > now) return hit.value;

  // Periodic eviction so the map cannot grow unbounded under unique-email load.
  if (accessCache.size >= ACCESS_CACHE_MAX) {
    for (const [k, v] of accessCache) {
      if (v.expiresAt <= now) accessCache.delete(k);
    }
    if (accessCache.size >= ACCESS_CACHE_MAX) {
      const drop = Math.floor(ACCESS_CACHE_MAX / 2);
      let i = 0;
      for (const k of accessCache.keys()) {
        if (i++ >= drop) break;
        accessCache.delete(k);
      }
    }
  }

  await connectToDatabase();
  const doc: IUserAccess | null = await UserAccess.findOne({
    email: key,
    is_active: true,
  }).lean<IUserAccess>();

  const value: EffectiveAccess = doc
    ? { isSuperAdmin: false, grants: doc.grants ?? [] }
    : { isSuperAdmin: false, grants: [] };

  accessCache.set(key, { value, expiresAt: now + ACCESS_TTL_MS });

  if (doc) {
    // Fire-and-forget last-accessed tracking
    UserAccess.updateOne({ email: key }, { last_accessed_at: new Date() }).catch(() => {});
  }

  return value;
}

// ── Question-level checks (used by service handlers) ────────────────────────

function grantMatches(grant: Grant, subject: Subject, chapterId: string): boolean {
  if (grant.subject !== subject) return false;
  if (grant.chapters === 'all') return true;
  return grant.chapters.includes(chapterId);
}

export async function canViewQuestion(email: string, chapterId: string): Promise<boolean> {
  const access = await getEffectiveAccess(email);
  if (access.isSuperAdmin) return true;
  const subject = getSubjectFromChapterId(chapterId);
  if (!subject) return false;
  return access.grants.some((g) => grantMatches(g, subject, chapterId));
  // 'view' and 'edit' grants both satisfy a view check.
}

export async function canEditQuestion(email: string, chapterId: string): Promise<boolean> {
  const access = await getEffectiveAccess(email);
  if (access.isSuperAdmin) return true;
  const subject = getSubjectFromChapterId(chapterId);
  if (!subject) return false;
  return access.grants.some(
    (g) => g.level === 'edit' && grantMatches(g, subject, chapterId),
  );
}

// chapterId kept for API symmetry; only super admins can delete, irrespective of chapter.
export async function canDeleteQuestion(email: string, _chapterId: string): Promise<boolean> {
  return isSuperAdmin(email);
}

// ── List-endpoint filter ────────────────────────────────────────────────────

/**
 * Returns a Mongo filter that restricts a query to chapters the user can READ
 * (view-level OR edit-level grants).
 *
 *   - super admin → {} (no restriction)
 *   - staff       → { 'metadata.chapter_id': { $in: [...allowed...] } }
 *   - unknown     → {} (the student case — student app exposes only public content)
 *
 * NOTE: callers that do not want students to see staff-only data must apply
 * their own "has staff access" gate before calling this. Today's callers only
 * call getQuestionFilter for authenticated staff queries.
 */
export async function getQuestionFilter(email: string): Promise<Record<string, unknown>> {
  const access = await getEffectiveAccess(email);
  if (access.isSuperAdmin) return {};
  if (access.grants.length === 0) return {};

  const accessible = new Set<string>();
  for (const g of access.grants) {
    if (g.chapters === 'all') {
      for (const id of getChapterIdsForSubject(g.subject)) accessible.add(id);
    } else {
      for (const id of g.chapters) accessible.add(id);
    }
  }

  if (accessible.size === 0) return { _id: { $exists: false } };
  return { 'metadata.chapter_id': { $in: Array.from(accessible) } };
}
