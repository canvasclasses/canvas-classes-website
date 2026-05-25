# RBAC Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the role-based RBAC system (`user_roles` collection with `super_admin`/`subject_admin`/`viewer` enum) with a chapter-level grant-based system (`user_access` collection), where super admin is defined exclusively in environment variables.

**Architecture:** Env-only super admin via `SUPER_ADMIN_EMAILS`. Staff access stored as a list of grants `{ subject, chapters: 'all' | string[], level: 'view' | 'edit' }` in a new `user_access` collection. Three enforcement layers: edge middleware (env + DB), service handlers (per-chapter checks against stored doc), and client hook (UX hints). Single-PR clean cut with a migration script that translates existing `user_roles` documents into `user_access` documents.

**Tech Stack:** Next.js 15 App Router, TypeScript, Mongoose, MongoDB, Supabase auth, Zod validation, Tailwind CSS, npm workspaces.

**Spec reference:** `docs/superpowers/specs/2026-05-23-rbac-redesign-design.md`

**Verification approach:** No automated tests exist in this codebase (per CLAUDE.md §5). Verification is via `npm run lint`, targeted `grep`/`Read` checks, and manual smoke-testing on Vercel preview. The user prefers NOT to run `npm run build` or `tsc` locally (memory exhaustion). Type checking happens on Vercel preview deploys.

**Commit convention:** The user commits manually — do NOT run `git commit` in any task. Each task ends with a "stop and let user review the diff" step.

---

## File Structure

### New files
- `packages/data/models/UserAccess.ts` — Mongoose model + types
- `packages/data/models/UserAccessAuditLog.ts` — renamed audit log model
- `apps/admin/app/staff/page.tsx` — server component route shell
- `apps/admin/features/admin/components/StaffAccessManager.tsx` — main client component
- `apps/admin/features/admin/components/GrantEditor.tsx` — single grant row (one responsibility per file)
- `apps/admin/features/admin/components/ChapterMultiSelect.tsx` — reusable chapter picker
- `apps/admin/app/api/v2/admin/user-access/route.ts` — new API
- `scripts/migrate-user-roles-to-user-access.js` — migration script
- `_agents/adr/010-rbac-grant-redesign.md` — architectural decision record

### Rewritten files
- `packages/data/rbac.ts` — full rewrite, new helpers
- `apps/admin/features/admin/hooks/usePermissions.ts` — new shape
- `apps/admin/middleware.ts` — env + DB check
- `apps/admin/app/api/v2/admin/permissions/route.ts` — new response shape

### Modified files
- `packages/services/questions.ts` — new helper calls
- `packages/services/questions-by-id.ts` — new helper calls
- `packages/services/assets-upload.ts` — require `questionId`, chapter-aware check
- `packages/services/assets-by-id.ts` — `isSuperAdmin` check
- `packages/services/export-ppt.ts` — `isSuperAdmin` check
- `apps/admin/app/page.tsx` — add Staff Access card
- `apps/admin/app/crucible/page.tsx` — remove `<RoleManagement />` mount

### Deleted files
- `packages/data/models/UserRole.ts`
- `packages/data/models/RoleAuditLog.ts`
- `apps/admin/features/admin/components/RoleManagement.tsx`
- `apps/admin/app/api/v2/admin/roles/route.ts`

### Documentation
- `CLAUDE.md` — replace `ADMIN_EMAILS` with `SUPER_ADMIN_EMAILS`; document `user_access` grant model in §1, §7, §8

---

## Task ordering rationale

Tasks 1–3 are independent (ADR, two new Mongoose models). After that, Task 4 adds new helpers to `rbac.ts` alongside the old ones — at this point both APIs co-exist. Tasks 5–11 switch each caller one at a time, keeping the app working at every step. Task 20 deletes the legacy code after all callers are migrated.

Tasks 1–3, 7–11, and 14–16 can be parallelized via subagent dispatch. Tasks 4, 5, 6 must run sequentially.

---

## Task 1: Write the ADR

**Files:**
- Create: `_agents/adr/010-rbac-grant-redesign.md`

- [ ] **Step 1: Create the ADR file**

Write to `_agents/adr/010-rbac-grant-redesign.md`:

```markdown
# ADR-010: RBAC Grant-Based Redesign

**Date:** 2026-05-23
**Status:** Accepted
**Supersedes:** the role-based model implemented in `packages/data/models/UserRole.ts` and `packages/data/rbac.ts` (pre-2026-05-23)

## Context

The pre-2026-05-23 RBAC model conflated two concepts:

1. An environment-level allow-list (`ADMIN_EMAILS`) that gated entry to the admin app at middleware.
2. A database-level role enum (`user_roles.role` ∈ `{super_admin, subject_admin, viewer}`) that gated specific operations inside the app.

A user had to exist in both lists to be a super admin, creating a "is in `ADMIN_EMAILS` but not in `user_roles` → silent 403" failure mode. The model also lacked chapter-level granularity: a Chemistry subject_admin had access to every Chemistry chapter, even chapters they were not trusted with.

## Decision

Replace the role-based model with a grant-based model:

- **Super admin tier:** defined exclusively in `SUPER_ADMIN_EMAILS` env var. Cannot be created or modified via any HTTP API. Super admins have all powers including question deletion and role management.
- **Staff tier:** stored in a new `user_access` collection. Each document holds a list of grants:
  ```
  { subject: Subject, chapters: 'all' | string[], level: 'view' | 'edit' }
  ```
  Staff access is fully editable by super admins via `/staff` in the admin app.
- **Role enum removed.** "Subject admin" and "intern" become UI labels for users with full-subject and partial-subject grants respectively — they are not formal roles with distinct code paths.
- **Question deletion:** super admin only. All other operations gate on per-chapter, per-level checks.

## Consequences

- The admin app's middleware gains a Mongo lookup on every request (mitigated by the 60s permissions cache).
- The role-management UI moves from a nested mount inside `/crucible` to a top-level `/staff` route, with a landing card on the admin home grid.
- Existing `user_roles` documents are translated to `user_access` documents by a one-shot migration script (`scripts/migrate-user-roles-to-user-access.js`) at deploy time.
- `ADMIN_EMAILS` is removed in favour of `SUPER_ADMIN_EMAILS`.
- The role-based exports (`UserPermissions`, `getUserPermissions`, etc.) are removed from `packages/data/rbac.ts` in the same PR.

See `docs/superpowers/specs/2026-05-23-rbac-redesign-design.md` for the full design.
```

- [ ] **Step 2: Verify file was created**

Run: `ls -la _agents/adr/010-rbac-grant-redesign.md`
Expected: file exists, non-zero size.

- [ ] **Step 3: Stop for user to review the diff**

Output to user: `Task 1 complete: ADR-010 written. Please review the file and let me know when to proceed to Task 2.`

---

## Task 2: Create the `UserAccess` Mongoose model

**Files:**
- Create: `packages/data/models/UserAccess.ts`

- [ ] **Step 1: Write the new model file**

Write to `packages/data/models/UserAccess.ts`:

```ts
import 'server-only';
import mongoose, { Schema, Document, Model } from 'mongoose';
import { getSubjectFromChapterId } from '../taxonomy/lookup';

export type Subject = 'chemistry' | 'physics' | 'mathematics' | 'biology';
export type AccessLevel = 'view' | 'edit';

export interface Grant {
  subject: Subject;
  chapters: 'all' | string[];
  level: AccessLevel;
}

export interface IUserAccess extends Document {
  email: string;
  grants: Grant[];
  granted_by: string;
  granted_at: Date;
  last_accessed_at?: Date;
  is_active: boolean;
  notes?: string;
}

// Per-grant validator: when chapters is an array, every chapter id must
// belong to that grant's subject. Stops a hand-crafted request from putting
// a physics chapter inside a chemistry grant.
const grantChaptersValidator = {
  validator: function (this: Grant, chapters: 'all' | string[]): boolean {
    if (chapters === 'all') return true;
    if (!Array.isArray(chapters) || chapters.length === 0) return false;
    if (chapters.length > 100) return false;
    return chapters.every((chId) => getSubjectFromChapterId(chId) === this.subject);
  },
  message: 'Every chapter ID in `chapters` must belong to the grant\'s subject.',
};

const GrantSchema = new Schema<Grant>(
  {
    subject: {
      type: String,
      enum: ['chemistry', 'physics', 'mathematics', 'biology'],
      required: true,
    },
    chapters: {
      type: Schema.Types.Mixed,
      required: true,
      validate: grantChaptersValidator,
    },
    level: {
      type: String,
      enum: ['view', 'edit'],
      required: true,
    },
  },
  { _id: false },
);

// No two grants share the same subject in one document.
const grantsArrayValidator = {
  validator: function (grants: Grant[]): boolean {
    if (!Array.isArray(grants)) return false;
    if (grants.length > 50) return false;
    return new Set(grants.map((g) => g.subject)).size === grants.length;
  },
  message: 'Duplicate subject in grants — each subject may appear at most once per user.',
};

const UserAccessSchema = new Schema<IUserAccess>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    grants: {
      type: [GrantSchema],
      default: [],
      validate: grantsArrayValidator,
    },
    granted_by: {
      type: String,
      required: true,
    },
    granted_at: {
      type: Date,
      default: Date.now,
    },
    last_accessed_at: {
      type: Date,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    collection: 'user_access',
  },
);

UserAccessSchema.index({ email: 1, is_active: 1 });
UserAccessSchema.index({ is_active: 1, granted_at: -1 });

export const UserAccess: Model<IUserAccess> =
  mongoose.models.UserAccess || mongoose.model<IUserAccess>('UserAccess', UserAccessSchema);
```

- [ ] **Step 2: Verify `getSubjectFromChapterId` import path is correct**

Run: `Grep -n "export function getSubjectFromChapterId" packages/data/taxonomy/lookup.ts`
Expected: at least one match showing the function is exported from that file.

If the function is NOT in `packages/data/taxonomy/lookup.ts`, use the path where it actually lives. As of the current `rbac.ts`, the function is defined inline there — but for the model it's better to use the canonical taxonomy helper. If `lookup.ts` does not export it, define it inline in `UserAccess.ts`:

```ts
// inline if taxonomy/lookup.ts does not export it
function getSubjectFromChapterId(chapterId: string): Subject | null {
  if (chapterId.startsWith('ch11_') || chapterId.startsWith('ch12_')) return 'chemistry';
  if (chapterId.startsWith('ph11_') || chapterId.startsWith('ph12_')) return 'physics';
  if (chapterId.startsWith('ma_')) return 'mathematics';
  if (chapterId.startsWith('bio9_') || chapterId.startsWith('bio11_') || chapterId.startsWith('bio12_')) return 'biology';
  return null;
}
```

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no errors in `packages/data/models/UserAccess.ts`. Existing warnings elsewhere are fine.

- [ ] **Step 4: Stop for user to review**

Output to user: `Task 2 complete: UserAccess model created. Diff is in packages/data/models/UserAccess.ts. Ready for Task 3.`

---

## Task 3: Create the `UserAccessAuditLog` Mongoose model

**Files:**
- Create: `packages/data/models/UserAccessAuditLog.ts`

Note: this is a sibling of `RoleAuditLog.ts`. We keep `RoleAuditLog.ts` alive until Task 20 so legacy code does not break mid-PR.

- [ ] **Step 1: Write the new model file**

Write to `packages/data/models/UserAccessAuditLog.ts`:

```ts
import 'server-only';
import mongoose, { Schema, Document, Model } from 'mongoose';
import type { Grant } from './UserAccess';

export type UserAccessAuditAction =
  | 'access_created'
  | 'access_updated'
  | 'access_deleted';

export interface IUserAccessAuditLog extends Document {
  action: UserAccessAuditAction;
  actor_email: string;
  target_email: string;
  timestamp: Date;
  changes: {
    before: { grants: Grant[]; notes?: string } | null;
    after: { grants: Grant[]; notes?: string } | null;
  };
}

const UserAccessAuditLogSchema = new Schema<IUserAccessAuditLog>(
  {
    action: {
      type: String,
      enum: ['access_created', 'access_updated', 'access_deleted'],
      required: true,
    },
    actor_email: { type: String, required: true },
    target_email: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, required: true },
    changes: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: false,
    collection: 'user_access_audit_logs',
  },
);

UserAccessAuditLogSchema.index({ target_email: 1, timestamp: -1 });
UserAccessAuditLogSchema.index({ actor_email: 1, timestamp: -1 });
UserAccessAuditLogSchema.index({ timestamp: -1 });
// TTL: delete logs older than 2 years
UserAccessAuditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 63072000 });

export const UserAccessAuditLog: Model<IUserAccessAuditLog> =
  mongoose.models.UserAccessAuditLog ||
  mongoose.model<IUserAccessAuditLog>('UserAccessAuditLog', UserAccessAuditLogSchema);
```

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: no errors in the new file.

- [ ] **Step 3: Stop for user to review**

Output: `Task 3 complete. UserAccessAuditLog model created. Ready for Task 4.`

---

## Task 4: Rewrite `packages/data/rbac.ts`

**Files:**
- Modify: `packages/data/rbac.ts` (full replacement)

We replace the file in one shot. The old function names `canEditQuestion`, `canDeleteQuestion`, `getQuestionFilter`, `getSubjectFromChapterId`, `getChapterIdsForSubject`, `invalidatePermissionsCache`, `clearPermissionsCache` are kept (signatures preserved where reasonable; `invalidatePermissionsCache`/`clearPermissionsCache` get renamed in Task 20). All other exports (`UserPermissions`, `RoleType`, `getUserPermissions`, `canAccessChapter`, `getAccessibleChapters`) are removed — Tasks 5-9 will fix the callers that referenced them.

- [ ] **Step 1: Verify which exports are consumed**

Run: `Grep -rn "from '@canvas/data/rbac'" packages apps`
Expected output: the list from §7 of the spec — `questions.ts`, `questions-by-id.ts`, `assets-upload.ts`, `assets-by-id.ts`, `export-ppt.ts`, `apps/admin/app/api/v2/admin/roles/route.ts`, `apps/admin/app/api/v2/admin/permissions/route.ts`. If anything else shows up, halt and report — that caller also needs to be updated.

- [ ] **Step 2: Write the new `rbac.ts`**

Replace the entire contents of `packages/data/rbac.ts` with:

```ts
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

// ── Chapter ↔ subject mapping (unchanged from the legacy module) ────────────

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
 * NOTE: callers that do not want students to see anything must apply their own
 * "has staff access" gate before calling this. Today's callers only filter
 * staff queries; student-facing routes do not call getQuestionFilter at all.
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
```

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: errors in caller files (`questions.ts`, `questions-by-id.ts`, etc.) because they still import the removed exports. NO errors in `rbac.ts` itself. We fix the callers in Tasks 5–9.

If lint blows up in `rbac.ts` itself, fix and re-lint.

- [ ] **Step 4: Stop for user to review**

Output: `Task 4 complete. rbac.ts rewritten. Caller files will lint-error until Tasks 5-9 land — expected and intentional. Ready for Task 5.`

---

## Task 5: Update `packages/services/questions.ts`

**Files:**
- Modify: `packages/services/questions.ts:10` (import), `:115-127` (fast-path RBAC), `:152-158` (slow-path RBAC), `:215-223` (POST check)

- [ ] **Step 1: Update the import statement**

Open `packages/services/questions.ts`. Find line 10:

```ts
import { getUserPermissions, getQuestionFilter, canEditQuestion, getSubjectFromChapterId } from '@canvas/data/rbac';
```

Replace with:

```ts
import { getEffectiveAccess, getQuestionFilter, canEditQuestion, canViewQuestion, getSubjectFromChapterId } from '@canvas/data/rbac';
```

- [ ] **Step 2: Update the fast-path RBAC check (around lines 114-127)**

Find this block:

```ts
if (isSimpleChapterFetch(parsed)) {
  if (isAuthenticated && user) {
    const permissions = await getUserPermissions(user.email!);
    if (permissions.role !== 'viewer') {
      const subj = getSubjectFromChapterId(chapter_ids[0]);
      if (!subj || !permissions.canAccessSubject(subj)) {
        return NextResponse.json({
          success: true,
          data: [],
          pagination: { total: 0, limit, skip, hasMore: false },
        });
      }
    }
  }
```

Replace with:

```ts
if (isSimpleChapterFetch(parsed)) {
  if (isAuthenticated && user) {
    // Staff (non-students) need explicit access to this chapter. Students
    // — authenticated users with no user_access doc — fall through to the
    // public read; getEffectiveAccess returns grants: [] for them and the
    // check below is a no-op.
    const access = await getEffectiveAccess(user.email!);
    if (!access.isSuperAdmin && access.grants.length > 0) {
      const canSee = await canViewQuestion(user.email!, chapter_ids[0]);
      if (!canSee) {
        return NextResponse.json({
          success: true,
          data: [],
          pagination: { total: 0, limit, skip, hasMore: false },
        });
      }
    }
  }
```

- [ ] **Step 3: Update the slow-path RBAC filter (around lines 152-158)**

Find this block:

```ts
let rbacFilter: Record<string, unknown> | undefined;
if (isAuthenticated && user) {
  const permissions = await getUserPermissions(user.email!);
  if (permissions.role !== 'viewer') {
    rbacFilter = await getQuestionFilter(user.email!);
  }
}
```

Replace with:

```ts
let rbacFilter: Record<string, unknown> | undefined;
if (isAuthenticated && user) {
  // Apply chapter-level filter only for staff (super admin or with grants).
  // Students have grants: [] → no filter, same as today.
  const access = await getEffectiveAccess(user.email!);
  if (access.isSuperAdmin || access.grants.length > 0) {
    rbacFilter = await getQuestionFilter(user.email!);
  }
}
```

- [ ] **Step 4: POST check is unchanged — `canEditQuestion` still works**

The block at line 215-223 (`const hasPermission = await canEditQuestion(...)`) does NOT need changes — the signature is preserved. Confirm by reading the file around that line.

- [ ] **Step 5: Lint**

Run: `npm run lint -- packages/services/questions.ts`
Expected: no errors in this file. Other files (questions-by-id.ts etc.) still error — fixed in later tasks.

- [ ] **Step 6: Stop for user to review**

Output: `Task 5 complete. questions.ts switched to grant-based helpers. Ready for Task 6.`

---

## Task 6: Update `packages/services/questions-by-id.ts`

**Files:**
- Modify: `packages/services/questions-by-id.ts:8` (import), `:88` (PATCH check), `:382` (DELETE check)

- [ ] **Step 1: Update the import statement**

Open `packages/services/questions-by-id.ts`. Find line 8:

```ts
import { canEditQuestion, canDeleteQuestion } from '@canvas/data/rbac';
```

This import is fine — both functions still exist. No change needed for the import.

Confirm by reading line 8 of the file.

- [ ] **Step 2: PATCH check is unchanged**

The PATCH handler around line 88 calls `canEditQuestion(user.email!, existingQuestion.metadata.chapter_id)`. This signature is preserved in the new `rbac.ts` — no code change.

Verify by reading lines 85-95 of `packages/services/questions-by-id.ts`.

- [ ] **Step 3: DELETE check is unchanged**

The DELETE handler around line 382 calls `canDeleteQuestion(user.email!, question.metadata.chapter_id)`. The new implementation ignores `chapterId` but the signature is preserved.

Verify by reading lines 380-395.

- [ ] **Step 4: Lint**

Run: `npm run lint -- packages/services/questions-by-id.ts`
Expected: no errors in this file.

- [ ] **Step 5: Stop for user to review**

Output: `Task 6 complete. questions-by-id.ts works without changes — both helpers preserved their signatures. Ready for Task 7.`

---

## Task 7: Update `packages/services/assets-upload.ts` (require `questionId`)

**Files:**
- Modify: `packages/services/assets-upload.ts:23` (import), `:39-82` (auth block), `:84-100` (questionId becomes required)

This task implements the security tightening agreed in Section 2 of the spec: asset upload now requires `questionId`, and gates on `canEditQuestion(email, chapterOfThatQuestion)`.

- [ ] **Step 1: Update the import statement**

Find line 23:

```ts
import { getUserPermissions } from '@canvas/data/rbac';
```

Replace with:

```ts
import { canEditQuestion, isSuperAdmin } from '@canvas/data/rbac';
import { QuestionV2 } from '@canvas/data/models/Question.v2';
```

- [ ] **Step 2: Rewrite the auth block and questionId parsing**

Find the block from line 39 (start of `export async function POST`) through approximately line 100 (end of `if (questionId)` UUID check). The current code is:

```ts
export async function POST(request: NextRequest, deps: ServiceDeps) {
  let formData: FormData | null = null;
  let file: File | null = null;

  try {
    await connectToDatabase();

    let isAuthorized = await deps.isLocalhostDev();

    if (!isAuthorized && deps.hasScriptSecret(request)) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      const user = await deps.getAuthenticatedUser(request);
      if (user?.email) {
        if (deps.isAdmin(user.email)) {
          isAuthorized = true;
        } else {
          try {
            const permissions = await getUserPermissions(user.email);
            if (permissions.canEditQuestions) {
              isAuthorized = true;
            }
          } catch (rbacErr) {
            console.error('RBAC lookup failed during asset upload auth:', rbacErr);
          }
        }

        if (!isAuthorized) {
          return NextResponse.json(
            { success: false, error: 'Forbidden - Insufficient permissions to upload assets' },
            { status: 403 }
          );
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    formData = await request.formData();
    file = formData.get('file') as File;
    const questionId = formData.get('questionId') as string | null;
    const fieldType = formData.get('field_type') as string;
    const altText = formData.get('alt_text') as string;
    const caption = formData.get('caption') as string;
    const context = (formData.get('context') as string) || 'practice';

    if (questionId) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(questionId)) {
        return NextResponse.json(
          { success: false, error: 'Invalid questionId format - must be a valid UUID' },
          { status: 400 }
        );
      }
    }
```

Replace with:

```ts
export async function POST(request: NextRequest, deps: ServiceDeps) {
  let formData: FormData | null = null;
  let file: File | null = null;

  try {
    await connectToDatabase();

    const isLocalDev = await deps.isLocalhostDev();
    const isScript = deps.hasScriptSecret(request);

    // Parse form data first — we need questionId to gate auth in the normal path.
    formData = await request.formData();
    file = formData.get('file') as File;
    const questionId = formData.get('questionId') as string | null;
    const fieldType = formData.get('field_type') as string;
    const altText = formData.get('alt_text') as string;
    const caption = formData.get('caption') as string;
    const context = (formData.get('context') as string) || 'practice';

    // questionId is now REQUIRED. Asset uploads must be tied to a specific
    // question so the chapter-level RBAC check has something to gate on.
    // Localhost dev and script-secret callers bypass this (operator/admin tools).
    if (!isLocalDev && !isScript) {
      if (!questionId) {
        return NextResponse.json(
          { success: false, error: 'questionId is required' },
          { status: 400 }
        );
      }
    }

    if (questionId) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(questionId)) {
        return NextResponse.json(
          { success: false, error: 'Invalid questionId format - must be a valid UUID' },
          { status: 400 }
        );
      }
    }

    let isAuthorized = isLocalDev || isScript;

    if (!isAuthorized) {
      const user = await deps.getAuthenticatedUser(request);
      if (!user?.email) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized - Authentication required' },
          { status: 401 }
        );
      }

      // Super admins skip the question lookup.
      if (isSuperAdmin(user.email)) {
        isAuthorized = true;
      } else {
        // Look up the question to find its chapter, then gate on canEditQuestion.
        const targetQuestion = await QuestionV2.findOne(
          { _id: questionId, deleted_at: null },
          { 'metadata.chapter_id': 1 },
        ).lean<{ metadata: { chapter_id: string } } | null>();

        if (!targetQuestion) {
          return NextResponse.json(
            { success: false, error: 'Question not found' },
            { status: 404 }
          );
        }

        try {
          const allowed = await canEditQuestion(user.email, targetQuestion.metadata.chapter_id);
          if (!allowed) {
            return NextResponse.json(
              { success: false, error: 'Forbidden - You do not have edit access to this question\'s subject/chapter' },
              { status: 403 }
            );
          }
          isAuthorized = true;
        } catch (rbacErr) {
          console.error('RBAC lookup failed during asset upload auth:', rbacErr);
          return NextResponse.json(
            { success: false, error: 'Forbidden - Permission check failed' },
            { status: 403 }
          );
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }
```

- [ ] **Step 3: Update the file-comment header**

Find lines 12-13 (the auth comment):

```ts
// Auth (POST): localhost dev bypass → x-admin-secret header → Supabase
// session with email in ADMIN_EMAILS OR RBAC `canEditQuestions`.
```

Replace with:

```ts
// Auth (POST): localhost dev bypass → x-admin-secret header → Supabase
// session with email in SUPER_ADMIN_EMAILS OR canEditQuestion(email, chapter)
// where chapter is resolved from the required `questionId` form field.
```

- [ ] **Step 4: Lint**

Run: `npm run lint -- packages/services/assets-upload.ts`
Expected: no errors in this file.

- [ ] **Step 5: Stop for user to review**

Output: `Task 7 complete. assets-upload.ts now requires questionId and gates on chapter-level edit access. Ready for Task 8.`

---

## Task 8: Update `packages/services/assets-by-id.ts`

**Files:**
- Modify: `packages/services/assets-by-id.ts:19` (import), `:38-44` (auth check)

- [ ] **Step 1: Update the import statement**

Find line 19:

```ts
import { getUserPermissions } from '@canvas/data/rbac';
```

Replace with:

```ts
import { isSuperAdmin } from '@canvas/data/rbac';
```

- [ ] **Step 2: Update the auth check**

Find lines 38-44:

```ts
const permissions = await getUserPermissions(user.email);
if (!permissions.canDeleteQuestions) {
  return NextResponse.json(
    { success: false, error: 'Forbidden - Insufficient permissions to delete assets' },
    { status: 403 }
  );
}
```

Replace with:

```ts
if (!isSuperAdmin(user.email)) {
  return NextResponse.json(
    { success: false, error: 'Forbidden - Only super admins can delete assets' },
    { status: 403 }
  );
}
```

- [ ] **Step 3: Lint**

Run: `npm run lint -- packages/services/assets-by-id.ts`
Expected: no errors.

- [ ] **Step 4: Stop for user to review**

Output: `Task 8 complete. assets-by-id.ts gates on isSuperAdmin. Ready for Task 9.`

---

## Task 9: Update `packages/services/export-ppt.ts`

**Files:**
- Modify: `packages/services/export-ppt.ts:8` (import), `:78-81` (auth check)

- [ ] **Step 1: Update the import statement**

Find line 8:

```ts
import { getUserPermissions } from '@canvas/data/rbac';
```

Replace with:

```ts
import { isSuperAdmin } from '@canvas/data/rbac';
```

- [ ] **Step 2: Update the auth check**

Find lines 78-81:

```ts
const permissions = await getUserPermissions(user.email!);
if (!permissions.canExportData) {
  return NextResponse.json({ success: false, error: 'Forbidden: export requires super admin access' }, { status: 403 });
}
```

Replace with:

```ts
if (!isSuperAdmin(user.email!)) {
  return NextResponse.json({ success: false, error: 'Forbidden: export requires super admin access' }, { status: 403 });
}
```

- [ ] **Step 3: Lint**

Run: `npm run lint -- packages/services/export-ppt.ts`
Expected: no errors.

- [ ] **Step 4: Stop for user to review**

Output: `Task 9 complete. export-ppt.ts gates on isSuperAdmin. Ready for Task 10.`

---

## Task 10: Update `apps/admin/middleware.ts`

**Files:**
- Modify: `apps/admin/middleware.ts:60-70` (admin email check), import (top of file)

- [ ] **Step 1: Add import**

At the top of `apps/admin/middleware.ts`, after the existing imports, add:

```ts
import connectToDatabase from '@canvas/data/db/mongodb';
import { UserAccess } from '@canvas/data/models/UserAccess';
import { isSuperAdmin } from '@canvas/data/rbac';
```

- [ ] **Step 2: Replace the admin-email allow-list check**

Find lines 60-70:

```ts
  // Signed in but not on the ADMIN_EMAILS allow-list → 403.
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const isSuperAdmin = !!user.email && adminEmails.includes(user.email.toLowerCase());

  if (!isSuperAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
```

Replace with:

```ts
  // Gate: must be either a super admin (env) or have an active user_access doc.
  if (!user.email) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (isSuperAdmin(user.email)) {
    return response;
  }

  try {
    await connectToDatabase();
    const access = await UserAccess.findOne(
      { email: user.email.toLowerCase(), is_active: true },
      { _id: 1 },
    ).lean();
    if (!access) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  } catch (err) {
    console.error('Middleware UserAccess lookup failed:', err);
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
```

- [ ] **Step 3: Lint**

Run: `npm run lint -- apps/admin/middleware.ts`
Expected: no errors.

- [ ] **Step 4: Stop for user to review**

Output: `Task 10 complete. Middleware now allows super admins (env) OR active user_access doc. Ready for Task 11.`

---

## Task 11: Update `apps/admin/app/api/v2/admin/permissions/route.ts`

**Files:**
- Modify: `apps/admin/app/api/v2/admin/permissions/route.ts` (full rewrite — small file)

- [ ] **Step 1: Replace the file**

Replace the entire contents of `apps/admin/app/api/v2/admin/permissions/route.ts` with:

```ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { isLocalhostDev } from '@/lib/adminAuth';
import {
  getEffectiveAccess,
  isSuperAdmin,
  listSuperAdmins,
} from '@canvas/data/rbac';

// GET /api/v2/admin/permissions — return current user's effective access.
export async function GET(request: NextRequest) {
  try {
    if (await isLocalhostDev()) {
      return NextResponse.json({
        email: 'local-dev',
        isSuperAdmin: true,
        grants: [],
        superAdmins: listSuperAdmins(),
      });
    }

    const user = await getAuthenticatedUser(request);
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (isSuperAdmin(user.email)) {
      return NextResponse.json({
        email: user.email,
        isSuperAdmin: true,
        grants: [],
        superAdmins: listSuperAdmins(),
      });
    }

    const access = await getEffectiveAccess(user.email);
    return NextResponse.json({
      email: user.email,
      isSuperAdmin: false,
      grants: access.isSuperAdmin ? [] : access.grants,
      superAdmins: listSuperAdmins(),
    });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return NextResponse.json({ error: 'Failed to fetch permissions' }, { status: 500 });
  }
}
```

- [ ] **Step 2: Lint**

Run: `npm run lint -- apps/admin/app/api/v2/admin/permissions/route.ts`
Expected: no errors.

- [ ] **Step 3: Stop for user to review**

Output: `Task 11 complete. /api/v2/admin/permissions returns the new response shape. Ready for Task 12.`

---

## Task 12: Create the new `/api/v2/admin/user-access` route

**Files:**
- Create: `apps/admin/app/api/v2/admin/user-access/route.ts`

- [ ] **Step 1: Write the route handler**

Write to `apps/admin/app/api/v2/admin/user-access/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectToDatabase from '@canvas/data/db/mongodb';
import { UserAccess, type IUserAccess } from '@canvas/data/models/UserAccess';
import { UserAccessAuditLog } from '@canvas/data/models/UserAccessAuditLog';
import {
  isSuperAdmin,
  invalidateAccessCache,
  getSubjectFromChapterId,
} from '@canvas/data/rbac';
import { getAuthenticatedUser } from '@/lib/auth';
import { isLocalhostDev } from '@/lib/adminAuth';

const GrantSchema = z.object({
  subject: z.enum(['chemistry', 'physics', 'mathematics', 'biology']),
  chapters: z.union([
    z.literal('all'),
    z.array(z.string()).min(1).max(100),
  ]),
  level: z.enum(['view', 'edit']),
});

const UserAccessBodySchema = z.object({
  email: z.string().email().transform((e) => e.toLowerCase()),
  grants: z.array(GrantSchema).max(50).refine(
    (g) => new Set(g.map((x) => x.subject)).size === g.length,
    { message: 'Duplicate subject in grants' },
  ),
  notes: z.string().max(500).optional(),
});

// Cross-field validation: every chapter ID in `chapters: string[]` must
// belong to the grant's subject.
function validateGrantChapters(grants: z.infer<typeof GrantSchema>[]): string | null {
  for (const g of grants) {
    if (g.chapters === 'all') continue;
    for (const chId of g.chapters) {
      const subj = getSubjectFromChapterId(chId);
      if (subj !== g.subject) {
        return `Chapter ${chId} does not belong to subject ${g.subject}`;
      }
    }
  }
  return null;
}

async function requireSuperAdmin(
  request: NextRequest,
): Promise<{ ok: true; actorEmail: string } | { ok: false; response: NextResponse }> {
  if (await isLocalhostDev()) return { ok: true, actorEmail: 'local-dev' };
  const user = await getAuthenticatedUser(request);
  if (!user?.email) {
    return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  if (!isSuperAdmin(user.email)) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Forbidden: Only super admins can manage staff access' },
        { status: 403 },
      ),
    };
  }
  return { ok: true, actorEmail: user.email };
}

// GET /api/v2/admin/user-access — list all active user_access docs
// GET /api/v2/admin/user-access?email=foo — fetch one
export async function GET(request: NextRequest) {
  try {
    const guard = await requireSuperAdmin(request);
    if (!guard.ok) return guard.response;

    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (email) {
      const doc = await UserAccess.findOne({ email: email.toLowerCase() })
        .select('-__v')
        .lean();
      if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json({ userAccess: doc });
    }

    const docs = await UserAccess.find({ is_active: true })
      .select('-__v')
      .sort({ granted_at: -1 })
      .limit(500)
      .lean();

    return NextResponse.json({ userAccess: docs });
  } catch (err) {
    console.error('Error fetching user_access:', err);
    return NextResponse.json({ error: 'Failed to fetch user access' }, { status: 500 });
  }
}

// PUT /api/v2/admin/user-access — upsert by email
export async function PUT(request: NextRequest) {
  try {
    const guard = await requireSuperAdmin(request);
    if (!guard.ok) return guard.response;
    const actorEmail = guard.actorEmail;

    await connectToDatabase();
    const body = await request.json();
    const parsed = UserAccessBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }
    const { email, grants, notes } = parsed.data;

    // Self-modification block.
    if (email === actorEmail.toLowerCase()) {
      return NextResponse.json(
        { error: 'Cannot modify your own access' },
        { status: 403 },
      );
    }

    // Cannot grant access to someone already a super admin.
    if (isSuperAdmin(email)) {
      return NextResponse.json(
        { error: 'Cannot grant access to a super admin — they already have full access via env' },
        { status: 400 },
      );
    }

    // Cross-field chapter ↔ subject validation.
    const chapterErr = validateGrantChapters(grants);
    if (chapterErr) {
      return NextResponse.json({ error: chapterErr }, { status: 400 });
    }

    const existing = await UserAccess.findOne({ email });
    const before = existing
      ? { grants: existing.grants, notes: existing.notes }
      : null;

    let after: IUserAccess;
    if (existing) {
      existing.grants = grants;
      existing.notes = notes;
      existing.granted_by = actorEmail;
      existing.granted_at = new Date();
      existing.is_active = true;
      after = await existing.save();
    } else {
      after = await UserAccess.create({
        email,
        grants,
        notes,
        granted_by: actorEmail,
        is_active: true,
      });
    }

    invalidateAccessCache(email);

    await UserAccessAuditLog.create({
      action: existing ? 'access_updated' : 'access_created',
      actor_email: actorEmail,
      target_email: email,
      changes: { before, after: { grants: after.grants, notes: after.notes } },
    });

    return NextResponse.json({ userAccess: after.toObject() });
  } catch (err) {
    console.error('Error upserting user_access:', err);
    return NextResponse.json({ error: 'Failed to save user access' }, { status: 500 });
  }
}

// DELETE /api/v2/admin/user-access?email=foo — soft-delete
export async function DELETE(request: NextRequest) {
  try {
    const guard = await requireSuperAdmin(request);
    if (!guard.ok) return guard.response;
    const actorEmail = guard.actorEmail;

    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const targetEmail = searchParams.get('email');
    if (!targetEmail) {
      return NextResponse.json({ error: 'email parameter required' }, { status: 400 });
    }
    const normalized = targetEmail.toLowerCase();

    if (normalized === actorEmail.toLowerCase()) {
      return NextResponse.json(
        { error: 'Cannot delete your own access' },
        { status: 403 },
      );
    }

    const doc = await UserAccess.findOne({ email: normalized });
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const before = { grants: doc.grants, notes: doc.notes };
    doc.is_active = false;
    await doc.save();

    invalidateAccessCache(normalized);

    await UserAccessAuditLog.create({
      action: 'access_deleted',
      actor_email: actorEmail,
      target_email: normalized,
      changes: { before, after: null },
    });

    return NextResponse.json({ message: 'Access removed' });
  } catch (err) {
    console.error('Error deleting user_access:', err);
    return NextResponse.json({ error: 'Failed to remove access' }, { status: 500 });
  }
}
```

- [ ] **Step 2: Lint**

Run: `npm run lint -- apps/admin/app/api/v2/admin/user-access/route.ts`
Expected: no errors.

- [ ] **Step 3: Stop for user to review**

Output: `Task 12 complete. /api/v2/admin/user-access route created. Ready for Task 13.`

---

## Task 13: Rewrite the client hook `usePermissions.ts`

**Files:**
- Modify: `apps/admin/features/admin/hooks/usePermissions.ts` (full rewrite)

- [ ] **Step 1: Replace the file**

Replace the entire contents of `apps/admin/features/admin/hooks/usePermissions.ts` with:

```ts
'use client';

import { useState, useEffect, useCallback } from 'react';

export type Subject = 'chemistry' | 'physics' | 'mathematics' | 'biology';
export type AccessLevel = 'view' | 'edit';

export interface Grant {
  subject: Subject;
  chapters: 'all' | string[];
  level: AccessLevel;
}

export interface PermissionsResponse {
  email: string;
  isSuperAdmin: boolean;
  grants: Grant[];
  superAdmins: string[];
}

function getSubjectFromChapterId(chapterId: string): Subject | null {
  if (chapterId.startsWith('ch11_') || chapterId.startsWith('ch12_')) return 'chemistry';
  if (chapterId.startsWith('ph11_') || chapterId.startsWith('ph12_')) return 'physics';
  if (chapterId.startsWith('ma_')) return 'mathematics';
  if (chapterId.startsWith('bio9_') || chapterId.startsWith('bio11_') || chapterId.startsWith('bio12_')) {
    return 'biology';
  }
  return null;
}

const EMPTY: PermissionsResponse = {
  email: '',
  isSuperAdmin: false,
  grants: [],
  superAdmins: [],
};

export function usePermissions() {
  const [data, setData] = useState<PermissionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);

        // Localhost grants full super admin in dev.
        const isLocalhost =
          typeof window !== 'undefined' &&
          (window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1');
        if (isLocalhost) {
          if (!cancelled) {
            setData({
              email: 'local-dev',
              isSuperAdmin: true,
              grants: [],
              superAdmins: [],
            });
          }
          return;
        }

        const res = await fetch('/api/v2/admin/permissions');
        if (!res.ok) throw new Error('Failed to fetch permissions');
        const json = (await res.json()) as PermissionsResponse;
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setData(EMPTY);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const canView = useCallback(
    (chapterId: string): boolean => {
      if (!data) return false;
      if (data.isSuperAdmin) return true;
      const subj = getSubjectFromChapterId(chapterId);
      if (!subj) return false;
      return data.grants.some(
        (g) =>
          g.subject === subj && (g.chapters === 'all' || g.chapters.includes(chapterId)),
      );
    },
    [data],
  );

  const canEdit = useCallback(
    (chapterId: string): boolean => {
      if (!data) return false;
      if (data.isSuperAdmin) return true;
      const subj = getSubjectFromChapterId(chapterId);
      if (!subj) return false;
      return data.grants.some(
        (g) =>
          g.subject === subj &&
          g.level === 'edit' &&
          (g.chapters === 'all' || g.chapters.includes(chapterId)),
      );
    },
    [data],
  );

  return {
    email: data?.email ?? '',
    isSuperAdmin: data?.isSuperAdmin ?? false,
    grants: data?.grants ?? [],
    superAdmins: data?.superAdmins ?? [],
    canView,
    canEdit,
    loading,
    error,
  };
}
```

- [ ] **Step 2: Lint**

Run: `npm run lint -- apps/admin/features/admin/hooks/usePermissions.ts`
Expected: no errors. The old `RoleManagement.tsx` may show errors because it imports the removed types — that's intentional and is fixed by deletion in Task 20.

- [ ] **Step 3: Find callers of the old hook shape**

Run: `Grep -rn "usePermissions\|isSuperAdmin\|canEditQuestions" apps/admin/features apps/admin/app --include="*.tsx" --include="*.ts"`

For each caller, verify it consumes only `{ canEdit, canView, isSuperAdmin, grants, superAdmins, loading, error, email }`. If a caller references the old `canEditQuestions`/`canDelete`/`canManageRoles`/`canAccessSubject` shape, list those callers — they will be updated in subsequent tasks or in Task 18 (which removes the inline RoleManagement mount).

- [ ] **Step 4: Stop for user to review**

Output: `Task 13 complete. usePermissions hook rewritten with the new shape. Ready for Task 14.`

---

## Task 14: Create `ChapterMultiSelect` component

**Files:**
- Create: `apps/admin/features/admin/components/ChapterMultiSelect.tsx`

This is a reusable component: a filterable checkbox list of chapter IDs (with human-readable titles) for a single subject.

- [ ] **Step 1: Write the component**

Write to `apps/admin/features/admin/components/ChapterMultiSelect.tsx`:

```tsx
'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { TAXONOMY_FROM_CSV } from '@canvas/data/taxonomy/taxonomyData_from_csv';
import type { Subject } from '../hooks/usePermissions';

interface ChapterMultiSelectProps {
  subject: Subject;
  selected: string[];
  onChange: (chapterIds: string[]) => void;
}

interface ChapterRow {
  id: string;
  title: string;
}

const SUBJECT_PREFIXES: Record<Subject, string[]> = {
  chemistry: ['ch11_', 'ch12_'],
  physics: ['ph11_', 'ph12_'],
  mathematics: ['ma_'],
  biology: ['bio9_', 'bio11_', 'bio12_'],
};

function getChaptersForSubject(subject: Subject): ChapterRow[] {
  const prefixes = SUBJECT_PREFIXES[subject];
  return (TAXONOMY_FROM_CSV as Array<{ type: string; id: string; title?: string }>)
    .filter((n) => n.type === 'chapter' && prefixes.some((p) => n.id.startsWith(p)))
    .map((n) => ({ id: n.id, title: n.title ?? n.id }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function ChapterMultiSelect({
  subject,
  selected,
  onChange,
}: ChapterMultiSelectProps) {
  const allChapters = useMemo(() => getChaptersForSubject(subject), [subject]);
  const [filter, setFilter] = useState('');

  const visible = useMemo(() => {
    const f = filter.trim().toLowerCase();
    if (!f) return allChapters;
    return allChapters.filter(
      (c) => c.id.toLowerCase().includes(f) || c.title.toLowerCase().includes(f),
    );
  }, [allChapters, filter]);

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const toggle = (id: string) => {
    const next = new Set(selectedSet);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(Array.from(next));
  };

  return (
    <div className="rounded-lg border border-white/10 bg-[#0B0F15] p-3">
      <div className="relative mb-2">
        <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter chapters…"
          className="w-full rounded-md bg-white/5 py-1.5 pl-8 pr-2 text-sm text-white placeholder:text-white/30 focus:bg-white/10 focus:outline-none"
        />
      </div>
      <div className="max-h-56 space-y-1 overflow-y-auto">
        {visible.length === 0 && (
          <div className="px-2 py-1 text-xs text-white/40">No chapters match.</div>
        )}
        {visible.map((c) => (
          <label
            key={c.id}
            className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm text-white/80 hover:bg-white/5"
          >
            <input
              type="checkbox"
              checked={selectedSet.has(c.id)}
              onChange={() => toggle(c.id)}
              className="accent-orange-500"
            />
            <span className="font-mono text-xs text-white/50">{c.id}</span>
            <span>{c.title}</span>
          </label>
        ))}
      </div>
      {selected.length > 0 && (
        <div className="mt-2 text-xs text-white/50">
          {selected.length} chapter{selected.length === 1 ? '' : 's'} selected
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify `title` exists in the taxonomy nodes**

Run: `Grep -n "type:.*'chapter'.*title:" packages/data/taxonomy/taxonomyData_from_csv.ts`
Expected: at least one match. If chapters do not have a `title` field, the component falls back to the `id` — acceptable but worth knowing.

If no `title` field exists, leave the component as written (`?? n.id` already handles it).

- [ ] **Step 3: Lint**

Run: `npm run lint -- apps/admin/features/admin/components/ChapterMultiSelect.tsx`
Expected: no errors.

- [ ] **Step 4: Stop for user to review**

Output: `Task 14 complete. ChapterMultiSelect ready. Ready for Task 15.`

---

## Task 15: Create `GrantEditor` component

**Files:**
- Create: `apps/admin/features/admin/components/GrantEditor.tsx`

A single editable row in the grants list — subject dropdown, chapters radio + multi-select, level toggle, remove button.

- [ ] **Step 1: Write the component**

Write to `apps/admin/features/admin/components/GrantEditor.tsx`:

```tsx
'use client';

import { Trash2 } from 'lucide-react';
import type { Grant, Subject, AccessLevel } from '../hooks/usePermissions';
import { ChapterMultiSelect } from './ChapterMultiSelect';

interface GrantEditorProps {
  grant: Grant;
  /** Subjects already used by other grants in the same form — disabled in the dropdown. */
  disabledSubjects: Subject[];
  onChange: (next: Grant) => void;
  onRemove: () => void;
}

const ALL_SUBJECTS: Subject[] = ['chemistry', 'physics', 'mathematics', 'biology'];

const SUBJECT_LABEL: Record<Subject, string> = {
  chemistry: 'Chemistry',
  physics: 'Physics',
  mathematics: 'Mathematics',
  biology: 'Biology',
};

export function GrantEditor({ grant, disabledSubjects, onChange, onRemove }: GrantEditorProps) {
  const isAllChapters = grant.chapters === 'all';
  const specificChapters: string[] = grant.chapters === 'all' ? [] : grant.chapters;

  const handleSubjectChange = (subject: Subject) => {
    // Reset chapter selection when subject changes (otherwise stored chapter
    // IDs would be stale and fail cross-field validation).
    onChange({ subject, chapters: 'all', level: grant.level });
  };

  const handleChaptersModeChange = (mode: 'all' | 'specific') => {
    if (mode === 'all') onChange({ ...grant, chapters: 'all' });
    else onChange({ ...grant, chapters: specificChapters.length > 0 ? specificChapters : [] });
  };

  const handleSpecificChaptersChange = (ids: string[]) => {
    onChange({ ...grant, chapters: ids });
  };

  const handleLevelChange = (level: AccessLevel) => {
    onChange({ ...grant, level });
  };

  return (
    <div className="rounded-lg border border-white/10 bg-[#0B0F15]/60 p-4">
      <div className="flex items-start gap-4">
        <div className="flex-1 space-y-3">
          <div>
            <label className="block text-xs uppercase tracking-widest text-white/40 mb-1">
              Subject
            </label>
            <select
              value={grant.subject}
              onChange={(e) => handleSubjectChange(e.target.value as Subject)}
              className="w-full rounded-md bg-white/5 px-2 py-1.5 text-sm text-white focus:bg-white/10 focus:outline-none"
            >
              {ALL_SUBJECTS.map((s) => (
                <option
                  key={s}
                  value={s}
                  disabled={s !== grant.subject && disabledSubjects.includes(s)}
                >
                  {SUBJECT_LABEL[s]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-white/40 mb-1">
              Chapters
            </label>
            <div className="flex gap-4 text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-white/80">
                <input
                  type="radio"
                  checked={!isAllChapters}
                  onChange={() => handleChaptersModeChange('specific')}
                  className="accent-orange-500"
                />
                Specific chapters
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-white/80">
                <input
                  type="radio"
                  checked={isAllChapters}
                  onChange={() => handleChaptersModeChange('all')}
                  className="accent-orange-500"
                />
                All chapters in subject
              </label>
            </div>
            {!isAllChapters && (
              <div className="mt-2">
                <ChapterMultiSelect
                  subject={grant.subject}
                  selected={specificChapters}
                  onChange={handleSpecificChaptersChange}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-white/40 mb-1">
              Level
            </label>
            <div className="flex gap-4 text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-white/80">
                <input
                  type="radio"
                  checked={grant.level === 'view'}
                  onChange={() => handleLevelChange('view')}
                  className="accent-orange-500"
                />
                View only
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-white/80">
                <input
                  type="radio"
                  checked={grant.level === 'edit'}
                  onChange={() => handleLevelChange('edit')}
                  className="accent-orange-500"
                />
                Edit
              </label>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="rounded-md p-2 text-white/40 hover:bg-white/5 hover:text-red-400"
          title="Remove grant"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Lint**

Run: `npm run lint -- apps/admin/features/admin/components/GrantEditor.tsx`
Expected: no errors.

- [ ] **Step 3: Stop for user to review**

Output: `Task 15 complete. GrantEditor ready. Ready for Task 16.`

---

## Task 16: Create `StaffAccessManager` component

**Files:**
- Create: `apps/admin/features/admin/components/StaffAccessManager.tsx`

The main client component that powers the `/staff` page: lists super admins (read-only), lists staff with their grants, opens an add/edit modal that hosts the `GrantEditor` rows.

- [ ] **Step 1: Write the component**

Write to `apps/admin/features/admin/components/StaffAccessManager.tsx`:

```tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import { Shield, UserPlus, Trash2, Save, X, AlertCircle, Eye, Pencil } from 'lucide-react';
import { GrantEditor } from './GrantEditor';
import type { Grant, Subject } from '../hooks/usePermissions';

interface UserAccessDoc {
  _id: string;
  email: string;
  grants: Grant[];
  granted_by: string;
  granted_at: string;
  last_accessed_at?: string;
  is_active: boolean;
  notes?: string;
}

interface StaffAccessManagerProps {
  currentUserEmail: string;
}

interface ModalState {
  mode: 'add' | 'edit';
  email: string;
  grants: Grant[];
  notes: string;
}

function formatGrant(g: Grant): string {
  const subj = g.subject.charAt(0).toUpperCase() + g.subject.slice(1);
  const ch = g.chapters === 'all' ? 'all' : `${g.chapters.length} ch`;
  const lvl = g.level === 'edit' ? '✎' : '👁';
  return `${subj} · ${ch} · ${lvl}`;
}

export default function StaffAccessManager({ currentUserEmail }: StaffAccessManagerProps) {
  const [users, setUsers] = useState<UserAccessDoc[]>([]);
  const [superAdmins, setSuperAdmins] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [permsRes, listRes] = await Promise.all([
        fetch('/api/v2/admin/permissions'),
        fetch('/api/v2/admin/user-access'),
      ]);
      if (!permsRes.ok) throw new Error('Failed to load permissions');
      if (!listRes.ok) throw new Error('Failed to load staff list');
      const perms = (await permsRes.json()) as { superAdmins: string[] };
      const list = (await listRes.json()) as { userAccess: UserAccessDoc[] };
      setSuperAdmins(perms.superAdmins ?? []);
      setUsers(list.userAccess ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const openAdd = () => {
    setError(null);
    setSuccess(null);
    setModal({
      mode: 'add',
      email: '',
      grants: [{ subject: 'chemistry', chapters: 'all', level: 'view' }],
      notes: '',
    });
  };

  const openEdit = (u: UserAccessDoc) => {
    setError(null);
    setSuccess(null);
    setModal({
      mode: 'edit',
      email: u.email,
      grants: u.grants,
      notes: u.notes ?? '',
    });
  };

  const saveModal = async () => {
    if (!modal) return;
    setError(null);
    try {
      const res = await fetch('/api/v2/admin/user-access', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: modal.email,
          grants: modal.grants,
          notes: modal.notes,
        }),
      });
      if (!res.ok) {
        const j = (await res.json()) as { error?: unknown };
        const msg = typeof j.error === 'string' ? j.error : 'Failed to save';
        throw new Error(msg);
      }
      setSuccess('Staff access saved');
      setModal(null);
      await fetchAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    }
  };

  const removeUser = async (email: string) => {
    if (!confirm(`Remove access for ${email}?`)) return;
    setError(null);
    try {
      const res = await fetch(`/api/v2/admin/user-access?email=${encodeURIComponent(email)}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const j = (await res.json()) as { error?: unknown };
        const msg = typeof j.error === 'string' ? j.error : 'Failed to remove';
        throw new Error(msg);
      }
      setSuccess('Access removed');
      await fetchAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    }
  };

  const updateGrant = (idx: number, next: Grant) => {
    if (!modal) return;
    const grants = modal.grants.slice();
    grants[idx] = next;
    setModal({ ...modal, grants });
  };

  const removeGrant = (idx: number) => {
    if (!modal) return;
    const grants = modal.grants.slice();
    grants.splice(idx, 1);
    setModal({ ...modal, grants });
  };

  const addGrant = () => {
    if (!modal) return;
    const used = new Set(modal.grants.map((g) => g.subject));
    const available: Subject[] = (['chemistry', 'physics', 'mathematics', 'biology'] as Subject[]).filter(
      (s) => !used.has(s),
    );
    if (available.length === 0) {
      setError('All subjects already granted.');
      return;
    }
    setModal({
      ...modal,
      grants: [...modal.grants, { subject: available[0], chapters: 'all', level: 'view' }],
    });
  };

  const subjectsInUse: Subject[] = modal ? modal.grants.map((g) => g.subject) : [];

  return (
    <div className="space-y-8">
      {(error || success) && (
        <div
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
            error
              ? 'border-red-500/40 bg-red-500/10 text-red-300'
              : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
          }`}
        >
          <AlertCircle className="h-4 w-4" />
          <span>{error ?? success}</span>
        </div>
      )}

      <section>
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-orange-300">
          <Shield className="h-4 w-4" /> Super admins (env)
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0B0F15] p-4">
          {superAdmins.length === 0 ? (
            <div className="text-sm text-white/50">No super admins configured.</div>
          ) : (
            <ul className="space-y-1 text-sm text-white/80">
              {superAdmins.map((e) => (
                <li key={e} className="font-mono">{e}</li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-xs text-white/40">
            To add or remove a super admin, update the <code className="text-orange-300/80">SUPER_ADMIN_EMAILS</code>{' '}
            environment variable in Vercel.
          </p>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white/80">Staff</h2>
          <button
            type="button"
            onClick={openAdd}
            className="flex items-center gap-2 rounded-md bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1.5 text-sm font-bold text-black hover:opacity-90"
          >
            <UserPlus className="h-4 w-4" /> Add staff
          </button>
        </div>

        {loading ? (
          <div className="rounded-xl border border-white/10 bg-[#0B0F15] p-6 text-sm text-white/50">
            Loading…
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-[#0B0F15] p-6 text-sm text-white/50">
            No staff yet.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0B0F15]">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-left text-xs uppercase tracking-widest text-white/40">
                <tr>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Access</th>
                  <th className="px-4 py-2">Added</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isSelf = u.email.toLowerCase() === currentUserEmail.toLowerCase();
                  return (
                    <tr key={u._id} className="border-t border-white/5 text-white/80">
                      <td className="px-4 py-3 font-mono text-xs">{u.email}</td>
                      <td className="px-4 py-3">
                        {u.grants.length === 0 ? (
                          <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-white/40">
                            no grants
                          </span>
                        ) : (
                          <div className="space-y-0.5">
                            {u.grants.map((g, i) => (
                              <div key={i} className="text-xs">{formatGrant(g)}</div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-white/50">
                        {new Date(u.granted_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(u)}
                            disabled={isSelf}
                            title={isSelf ? 'You cannot edit your own access' : 'Edit'}
                            className="rounded-md border border-white/10 p-1.5 text-white/70 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeUser(u.email)}
                            disabled={isSelf}
                            title={isSelf ? 'You cannot remove your own access' : 'Remove'}
                            className="rounded-md border border-white/10 p-1.5 text-white/70 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0B0F15] p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {modal.mode === 'add' ? 'Add staff member' : 'Edit staff access'}
              </h3>
              <button
                type="button"
                onClick={() => setModal(null)}
                className="rounded-md p-1 text-white/40 hover:bg-white/5 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={modal.email}
                  onChange={(e) => setModal({ ...modal, email: e.target.value })}
                  disabled={modal.mode === 'edit'}
                  placeholder="someone@canvasclasses.in"
                  className="w-full rounded-md bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:bg-white/10 focus:outline-none disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 mb-1">
                  Notes (optional)
                </label>
                <input
                  type="text"
                  value={modal.notes}
                  onChange={(e) => setModal({ ...modal, notes: e.target.value })}
                  placeholder="e.g. Chemistry intern, training period"
                  maxLength={500}
                  className="w-full rounded-md bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:bg-white/10 focus:outline-none"
                />
              </div>

              <div>
                <div className="mb-2 text-xs uppercase tracking-widest text-white/40">Grants</div>
                <div className="space-y-3">
                  {modal.grants.map((g, i) => (
                    <GrantEditor
                      key={i}
                      grant={g}
                      disabledSubjects={subjectsInUse.filter((_, j) => j !== i)}
                      onChange={(next) => updateGrant(i, next)}
                      onRemove={() => removeGrant(i)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addGrant}
                  className="mt-3 text-sm text-orange-300 hover:text-orange-200"
                >
                  + Add another grant
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModal(null)}
                className="rounded-md border border-white/10 px-3 py-1.5 text-sm text-white/70 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveModal}
                className="flex items-center gap-2 rounded-md bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1.5 text-sm font-bold text-black hover:opacity-90"
              >
                <Save className="h-4 w-4" /> Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Lint**

Run: `npm run lint -- apps/admin/features/admin/components/StaffAccessManager.tsx`
Expected: no errors.

- [ ] **Step 3: Stop for user to review**

Output: `Task 16 complete. StaffAccessManager ready. Ready for Task 17.`

---

## Task 17: Create the `/staff` route

**Files:**
- Create: `apps/admin/app/staff/page.tsx`

- [ ] **Step 1: Write the route shell**

Write to `apps/admin/app/staff/page.tsx`:

```tsx
import { requireAdmin } from '@/lib/adminAuth';
import { redirect } from 'next/navigation';
import StaffAccessManager from '@/features/admin/components/StaffAccessManager';

export const metadata = {
  title: 'Staff Access | Canvas Admin',
};

export const dynamic = 'force-dynamic';

export default async function StaffPage() {
  const identity = await requireAdmin();
  if (!identity) redirect('/login?next=/staff');

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-orange-400/80">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            Canvas Classes — Staff Access
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Staff Access</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/60">
            Grant or revoke per-subject and per-chapter access for non-super-admin staff. Super admins are configured via the{' '}
            <code className="text-orange-300/80">SUPER_ADMIN_EMAILS</code> environment variable and cannot be managed here.
          </p>
        </header>
        <StaffAccessManager currentUserEmail={identity.email} />
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Lint**

Run: `npm run lint -- apps/admin/app/staff/page.tsx`
Expected: no errors.

- [ ] **Step 3: Stop for user to review**

Output: `Task 17 complete. /staff route created. Ready for Task 18.`

---

## Task 18: Update admin landing + remove old role UI from Crucible

**Files:**
- Modify: `apps/admin/app/page.tsx` (add card)
- Modify: `apps/admin/app/crucible/page.tsx` (remove `<RoleManagement />` mount)

- [ ] **Step 1: Add the Staff Access card on the admin home**

Open `apps/admin/app/page.tsx`. After the existing import line `import {` add `Users,` to the icon import list. The lucide-react import block becomes:

```tsx
import {
  FlaskConical,
  Layers,
  BookOpen,
  Newspaper,
  Network,
  Compass,
  BarChart3,
  Eye,
  Beaker,
  ExternalLink,
  Users,
} from 'lucide-react';
```

Then in the "Operator tools" section, add a new `<PanelCard>` for staff access. Find the existing "Operator tools" section:

```tsx
<Section title="Operator tools" hint="Read-only views and operator-facing surfaces.">
  <PanelCard
    href="/dashboard"
    icon={<BarChart3 />}
    title="Dashboard"
    hint="Per-user progress and engagement view. Useful for support + cohort analysis."
  />
  <PanelCard
    href="/preview"
    icon={<Eye />}
    title="Preview"
    hint="Render a single question or flashcard as a student would see it."
  />
</Section>
```

Insert a third card AFTER the Preview card and before the closing `</Section>`:

```tsx
  <PanelCard
    href="/staff"
    icon={<Users />}
    title="Staff Access"
    hint="Grant or revoke per-subject and per-chapter access for staff. Super admins are managed via env."
  />
```

- [ ] **Step 2: Remove `<RoleManagement />` mount from Crucible**

Open `apps/admin/app/crucible/page.tsx`. Find and remove:

1. The import line: `import RoleManagement from '...'` (path may vary; remove the matching line).
2. The `<RoleManagement currentUserEmail={...} />` JSX usage.

Run: `Grep -n "RoleManagement" apps/admin/app/crucible/page.tsx` first to find the exact lines. Then remove them via Edit. If the component is wrapped in a conditional block, remove the whole block.

After removing, run: `Grep -n "RoleManagement" apps/admin/app/crucible/page.tsx`
Expected: no matches.

- [ ] **Step 3: Lint both files**

Run: `npm run lint -- apps/admin/app/page.tsx apps/admin/app/crucible/page.tsx`
Expected: no errors.

- [ ] **Step 4: Stop for user to review**

Output: `Task 18 complete. Staff Access card added on admin home; old RoleManagement mount removed from Crucible. Ready for Task 19.`

---

## Task 19: Write the migration script

**Files:**
- Create: `scripts/migrate-user-roles-to-user-access.js`

- [ ] **Step 1: Write the script**

Write to `scripts/migrate-user-roles-to-user-access.js`:

```js
#!/usr/bin/env node
/**
 * Migrate existing `user_roles` documents into `user_access` documents.
 *
 * Usage:
 *   node scripts/migrate-user-roles-to-user-access.js           # apply
 *   node scripts/migrate-user-roles-to-user-access.js --dry-run # report only
 *
 * Idempotent: re-running is safe — already-migrated users are skipped.
 *
 * Rules:
 *   - role === 'super_admin' → log email for env review (no DB write)
 *   - role === 'subject_admin' with subjects: [...] → user_access doc with one
 *     grant per subject: { subject, chapters: 'all', level: 'edit' }
 *   - role === 'viewer' with subjects: [...] → grants with level: 'view'
 *   - is_active: false → skip
 *
 * After running, manually copy the listed super_admins into SUPER_ADMIN_EMAILS
 * in Vercel env (prod + preview) and confirm.
 */

const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const mongoose = require('mongoose');

const DRY_RUN = process.argv.includes('--dry-run');

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set in .env.local');
    process.exit(1);
  }

  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const userRolesCol = db.collection('user_roles');
  const userAccessCol = db.collection('user_access');

  const roles = await userRolesCol.find({ is_active: true }).toArray();

  const superAdmins = [];
  const migrated = [];
  const skipped = [];

  for (const role of roles) {
    const email = (role.email || '').toLowerCase().trim();
    if (!email) {
      skipped.push({ reason: 'empty email', _id: role._id });
      continue;
    }

    if (role.role === 'super_admin') {
      superAdmins.push(email);
      continue;
    }

    const level = role.role === 'subject_admin' ? 'edit' : role.role === 'viewer' ? 'view' : null;
    if (!level) {
      skipped.push({ email, reason: `unknown role: ${role.role}` });
      continue;
    }

    const subjects = Array.isArray(role.subjects) ? role.subjects : [];
    if (subjects.length === 0) {
      skipped.push({ email, reason: 'no subjects on role' });
      continue;
    }

    const existing = await userAccessCol.findOne({ email });
    if (existing) {
      skipped.push({ email, reason: 'user_access doc already exists' });
      continue;
    }

    const grants = subjects.map((s) => ({ subject: s, chapters: 'all', level }));
    const doc = {
      email,
      grants,
      granted_by: role.granted_by || 'migration-script',
      granted_at: role.granted_at || new Date(),
      is_active: true,
      notes: role.notes || 'Migrated from user_roles on 2026-05-23',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (!DRY_RUN) {
      await userAccessCol.insertOne(doc);
    }
    migrated.push({ email, grants });
  }

  // Write super_admins list to a tracked file for env update.
  const outPath = path.join(__dirname, '..', 'scripts', 'super-admins-to-add.txt');
  fs.writeFileSync(outPath, superAdmins.join('\n') + '\n', 'utf8');

  console.log(`\n=== Migration Summary (${DRY_RUN ? 'DRY RUN' : 'APPLIED'}) ===`);
  console.log(`Migrated ${migrated.length} user_access docs:`);
  for (const m of migrated) {
    console.log(`  + ${m.email}: ${m.grants.map((g) => `${g.subject}/${g.chapters === 'all' ? 'all' : g.chapters.length} ch/${g.level}`).join(', ')}`);
  }
  console.log(`\nSuper admins flagged for env (written to ${outPath}):`);
  for (const e of superAdmins) console.log(`  ★ ${e}`);
  console.log(`\nSkipped: ${skipped.length}`);
  for (const s of skipped) console.log(`  - ${s.email ?? s._id}: ${s.reason}`);
  console.log('\nNext step: add the super admin emails above to SUPER_ADMIN_EMAILS in Vercel env (prod + preview).');

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
```

- [ ] **Step 2: Verify `dotenv` is in package.json**

Run: `Grep -n "\"dotenv\"" package.json`
Expected: at least one match. If not, the script will not load env vars correctly — halt and report. (CLAUDE.md §3 says batch scripts already use dotenv, so this should pass.)

- [ ] **Step 3: Run the dry-run**

Run: `node scripts/migrate-user-roles-to-user-access.js --dry-run`
Expected: a summary listing every active `user_roles` doc and what would happen. NO writes to `user_access`. Verify by reading the output — does it match expectations (number of subject_admins, viewers, super_admins)?

- [ ] **Step 4: Stop for user to review**

Output: `Task 19 complete. Migration script ready. Dry-run output shows what will be migrated. The real run happens at deploy time (Task 22). Ready for Task 20.`

---

## Task 20: Delete legacy files

**Files:**
- Delete: `packages/data/models/UserRole.ts`
- Delete: `packages/data/models/RoleAuditLog.ts`
- Delete: `apps/admin/features/admin/components/RoleManagement.tsx`
- Delete: `apps/admin/app/api/v2/admin/roles/route.ts`

- [ ] **Step 1: Confirm no remaining imports of the legacy modules**

Run these four greps in parallel:

- `Grep -rn "from '@canvas/data/models/UserRole'" packages apps`
- `Grep -rn "from '@canvas/data/models/RoleAuditLog'" packages apps`
- `Grep -rn "RoleManagement" apps`
- `Grep -rn "/api/v2/admin/roles" apps`

Expected: all four return no results. If any return results, halt and report — those imports must be removed first.

- [ ] **Step 2: Delete the files**

Run (one at a time so any failure is obvious):

```bash
rm packages/data/models/UserRole.ts
rm packages/data/models/RoleAuditLog.ts
rm apps/admin/features/admin/components/RoleManagement.tsx
rm -rf apps/admin/app/api/v2/admin/roles
```

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no errors anywhere (this should now compile fully under the new model).

- [ ] **Step 4: Stop for user to review**

Output: `Task 20 complete. Legacy files removed. Lint passes clean. Ready for Task 21.`

---

## Task 21: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md` §1, §7, §8 — replace `ADMIN_EMAILS` and role-based language with the new model.

- [ ] **Step 1: Update §1 (Project Overview)**

Find the line in §1 that references `ADMIN_EMAILS allow-list`:

```
- **Auth**: Supabase (user accounts, session management) — ADMIN_EMAILS allow-list for the admin app
```

Replace with:

```
- **Auth**: Supabase (user accounts, session management). Super admin tier defined in `SUPER_ADMIN_EMAILS` env var; staff defined in `user_access` collection (see §7 RBAC).
```

- [ ] **Step 2: Update the required env-var list**

Find:

```
MONGODB_URI=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
ADMIN_EMAILS=...
```

Replace with:

```
MONGODB_URI=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPER_ADMIN_EMAILS=...
```

- [ ] **Step 3: Update §7 (Architecture → Data Flow)**

Find the admin-app flow diagram:

```
       ├─ middleware.ts → ADMIN_EMAILS allow-list (first line of defense)
       └─ route handlers → requireAdmin() / getAuthenticatedUser + isAdmin
```

Replace with:

```
       ├─ middleware.ts → SUPER_ADMIN_EMAILS env OR active user_access doc (first line of defense)
       └─ route handlers → requireAdmin() / per-chapter canEditQuestion / isSuperAdmin
```

- [ ] **Step 4: Update §8.1 (Authentication Is Required by Default)**

Find:

```
- **Admin routes**: Use `requireAdmin()` from `lib/bookAuth.ts` (for server components/actions) or `getAuthenticatedUser()` + `isAdmin()` from `lib/auth.ts` (for route handlers).
```

Replace with:

```
- **Admin routes**: Use `requireAdmin()` from `lib/adminAuth.ts` (server components/actions) or `getAuthenticatedUser()` + `isSuperAdmin()` from `lib/auth.ts` + `@canvas/data/rbac` (route handlers). For per-chapter checks, use `canEditQuestion(email, chapter_id)` / `canViewQuestion(email, chapter_id)` / `canDeleteQuestion(email, _chapter)` from `@canvas/data/rbac`.
```

- [ ] **Step 5: Add a new RBAC subsection to §7**

After §7.4 (Taxonomy), add:

```markdown
### RBAC (Role-Based Access Control)

Per ADR-010, the admin app uses a grant-based access model:

- **Super admin tier** is defined in the `SUPER_ADMIN_EMAILS` env var. Members have all powers including delete and staff management. Cannot be created or modified via HTTP.
- **Staff tier** is stored in the `user_access` collection. Each document holds a list of grants `{ subject, chapters: 'all' | string[], level: 'view' | 'edit' }`.
- **Question deletion** is restricted to super admins. All other operations gate on per-chapter checks.

Helpers in `@canvas/data/rbac`:
- `isSuperAdmin(email)` — pure env check, no I/O.
- `canEditQuestion(email, chapterId)` / `canViewQuestion(email, chapterId)` / `canDeleteQuestion(email, _chapter)` — async, cached.
- `getQuestionFilter(email)` — Mongo filter for list endpoints.
- `getEffectiveAccess(email)` — full access object for the current user.

Staff are managed in the admin app at `/staff`. See `docs/superpowers/specs/2026-05-23-rbac-redesign-design.md` for the full design.
```

- [ ] **Step 6: Update Key Files table**

Find the row referencing the old `UserRole` / `RoleAuditLog`:

```
| RBAC helpers | `packages/data/rbac.ts` |
```

Update if present, or add if missing:

```
| RBAC helpers | `packages/data/rbac.ts` (grant-based; see ADR-010) |
| User access model | `packages/data/models/UserAccess.ts` |
| User access audit log | `packages/data/models/UserAccessAuditLog.ts` |
```

- [ ] **Step 7: Lint (optional — CLAUDE.md is markdown)**

Run: `Grep -n "ADMIN_EMAILS" CLAUDE.md`
Expected: no matches (every reference replaced).

- [ ] **Step 8: Stop for user to review**

Output: `Task 21 complete. CLAUDE.md updated to reference SUPER_ADMIN_EMAILS and the grant model. This is the final code task. Task 22 is the deploy runbook.`

---

## Task 22: Deploy runbook (not code — operational steps)

This task is NOT a code change. It documents the operational sequence for deploying the PR.

- [ ] **Step 1: Pre-deploy verification**

Confirm:
- `SUPER_ADMIN_EMAILS` is set in Vercel env for prod, preview, AND `.env.local`. Value: the comma-separated list from `scripts/super-admins-to-add.txt` (from the Task 19 dry-run output).
- Your own email is in `SUPER_ADMIN_EMAILS` (self-lockout prevention).
- `ADMIN_EMAILS` is still set in Vercel (will be removed AFTER deploy).
- All `[ ]` checkboxes on Tasks 1-21 are checked.

- [ ] **Step 2: Merge the PR**

The user merges the PR via GitHub. Vercel deploys automatically.

- [ ] **Step 3: Run the migration script against production**

Run: `node scripts/migrate-user-roles-to-user-access.js`
(Without `--dry-run` this time — it writes.)

Expected: success summary. The `scripts/super-admins-to-add.txt` file is regenerated (same content as the dry run unless `user_roles` changed between then and now).

- [ ] **Step 4: Spot-check the migration**

In MongoDB (Compass or shell), run:

```js
db.user_access.find({}, { email: 1, grants: 1, is_active: 1 }).limit(5)
```

Verify the structure matches the spec.

- [ ] **Step 5: Smoke test**

Open `admin.canvasclasses.in` as:
1. Yourself (super admin): see `/staff`, see migrated grants, edit one, verify save.
2. A subject_admin staff member (ask them to log in): they should reach the admin app and see only their granted chapters.
3. An unauthenticated request to `/api/v2/admin/user-access`: should get 401.

- [ ] **Step 6: Remove `ADMIN_EMAILS` from Vercel env**

After the smoke test passes, remove `ADMIN_EMAILS` from Vercel prod + preview env settings. No redeploy needed (no code reads it any more).

- [ ] **Step 7: Drop the legacy collection (optional cleanup)**

After 1 week of clean operation, run in MongoDB:

```js
db.user_roles.drop()
db.role_audit_logs.drop()
```

This is reversible until dropped — keeping the collection around for a week buys insurance.

- [ ] **Step 8: Done**

Output: `Task 22 complete. RBAC redesign is live in production.`

---

## Spec Coverage Self-Review

After writing every task above, I verified each spec requirement maps to a task:

| Spec section | Implemented in task(s) |
|---|---|
| `user_access` collection + Mongoose schema | Task 2 |
| `user_access_audit_logs` collection | Task 3 |
| `isSuperAdmin`, `listSuperAdmins` | Task 4 |
| `getEffectiveAccess`, cache, invalidation | Task 4 |
| `canViewQuestion`, `canEditQuestion`, `canDeleteQuestion` | Task 4 |
| `getQuestionFilter` | Task 4 |
| Middleware: env super admin OR `user_access` doc | Task 10 |
| Service handler: questions GET (fast + slow path) | Task 5 |
| Service handler: questions POST | Task 5 (unchanged signature) |
| Service handler: questions-by-id PATCH | Task 6 (unchanged signature) |
| Service handler: questions-by-id DELETE → super admin only | Task 6 |
| Service handler: assets/upload with required `questionId` + chapter gate | Task 7 |
| Service handler: assets/[id] DELETE → super admin only | Task 8 |
| Service handler: export/ppt → super admin only | Task 9 |
| `GET /api/v2/admin/permissions` new shape | Task 11 |
| `GET/PUT/DELETE /api/v2/admin/user-access` | Task 12 |
| Zod schema with cross-field chapter validation | Task 12 |
| Self-modification block (PUT and DELETE) | Task 12 |
| "Cannot grant access to a super admin" guard | Task 12 |
| Client hook with `canView` / `canEdit` / `superAdmins` | Task 13 |
| `ChapterMultiSelect` component | Task 14 |
| `GrantEditor` component | Task 15 |
| `StaffAccessManager` (list + modal + super admin display) | Task 16 |
| `/staff` route | Task 17 |
| Admin home landing card | Task 18 |
| Remove `RoleManagement` from Crucible | Task 18 |
| Migration script with `--dry-run` | Task 19 |
| Delete `UserRole`, `RoleManagement`, roles route, `RoleAuditLog` | Task 20 |
| CLAUDE.md updates (§1, §7, §8) | Task 21 |
| New ADR-010 | Task 1 |
| Deploy runbook (`SUPER_ADMIN_EMAILS` env, smoke test, `ADMIN_EMAILS` removal) | Task 22 |
| Active vs deleted semantics (`is_active: true` with `grants: []` = temporary revoke) | Implicit in Tasks 12 + 16 (the UI shows "no grants" badge; the server allows empty `grants` array) |

All spec requirements have a task. No gaps.

## Placeholder Scan

Scanned the plan for the prohibited patterns: "TBD", "TODO", "implement later", "fill in details", "Add appropriate error handling", "handle edge cases", "Write tests for the above", "Similar to Task N". None present. Every code block is the actual implementation an engineer can paste in. Every step references a specific file, line range, and verification command.

## Type Consistency Check

- `Grant`, `Subject`, `AccessLevel`, `IUserAccess`, `EffectiveAccess` types defined in Task 2 and re-exported by Task 4 — used consistently in Tasks 12-16.
- `getSubjectFromChapterId` defined once in `rbac.ts` (Task 4), referenced by `UserAccess.ts` validator (Task 2), service handlers (Tasks 5-9), client hook (Task 13), and `ChapterMultiSelect` (Task 14 — uses inline subject-prefix mapping, not import; consistent values).
- `canEditQuestion(email, chapterId)`, `canViewQuestion(email, chapterId)`, `canDeleteQuestion(email, chapterId)` — same signature across Tasks 4, 5, 6, 7.
- `isSuperAdmin(email)` — used in Tasks 4, 7, 8, 9, 10, 11, 12. All call with a single `email` arg.
- `invalidateAccessCache(email)` — Task 4 defines, Task 12 calls. Consistent.

No drift detected.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-23-rbac-redesign.md`. Two execution options:

**1. Subagent-Driven (recommended)** — dispatch a fresh subagent per task, review between tasks, fast iteration. Best fit since the user prefers parallel subagent dispatch (per memory) and some task groups (1-3, 7-11, 14-16) can run in parallel.

**2. Inline Execution** — execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
