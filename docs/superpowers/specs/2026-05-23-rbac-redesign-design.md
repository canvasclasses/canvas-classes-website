# RBAC Redesign — Design Spec

**Date:** 2026-05-23
**Status:** Approved (awaiting user spec review before implementation)
**Author:** Brainstormed with Claude (Opus 4.7)

## Goal

Replace the current three-tier role-based model (`super_admin` / `subject_admin` / `viewer`) with a chapter-level grant model that supports:

1. A single super admin tier defined in environment variables (not in the database).
2. Staff members (subject admins, interns, QA reviewers) with per-subject **and** per-chapter access defined in the database.
3. A per-grant access level: `view` (read-only access to the admin dashboard for granted chapters) or `edit` (can modify questions in granted chapters).
4. Question deletion restricted exclusively to super admins.

## Non-goals

- Cross-app permission portability (the student app's behavior for non-staff is unchanged — students still see public questions; they just have no `user_access` document).
- Per-question-level grants (chapter level is the finest granularity).
- A standalone audit-log viewer panel — audit entries are written but queried from Mongo only.
- Migrating the in-memory permissions cache to Redis. The DEEPENING_BACKLOG already tracks this independently.

## Why this redesign

The current model conflates two concepts:

- An **environment-level "super admin"** allow-list (`ADMIN_EMAILS`) that gates entry to the admin app at middleware.
- A **database-level role** (`user_roles.role`) that gates specific operations inside the app.

A user must currently exist in both to be a super admin — creating a "is in `ADMIN_EMAILS` but not in `user_roles` → silent 403" failure mode. The new model has one source of truth per tier:

- **Super admin = env (`SUPER_ADMIN_EMAILS`)**, full stop. Cannot be created or modified via any HTTP API.
- **Staff = `user_access` collection**, with explicit grants per subject + chapters + level.

The redesign also eliminates the role enum entirely. "Subject admin" and "intern" become UI labels for users with full-subject and partial-subject grants respectively — they are not formal roles with distinct code paths.

---

## Architecture

### Three enforcement layers

**Layer 1 — Edge middleware (`apps/admin/middleware.ts`):**

```
1. Skip public paths (/login, /api/auth/*, /_next/*, favicon).
2. Skip localhost dev bypass (NODE_ENV=development AND not Vercel AND hostname is localhost/127.0.0.1).
3. Resolve Supabase user. If no user → 401 (API) / redirect to /login (page).
4. If user.email is in SUPER_ADMIN_EMAILS env → allow.
5. If an active user_access document exists for user.email → allow.
6. Otherwise → 403.
```

Step 5 hits MongoDB, but the per-process permissions cache (60s TTL) absorbs repeat requests from the same user.

**Layer 2 — Route handlers (`packages/services/*.ts`):**

Every mutating handler re-checks permissions against the **stored** chapter_id of the target document (not the request body), preventing privilege escalation via spoofed body fields.

| Operation | Check |
|---|---|
| `POST /api/v2/questions` | `canEditQuestion(email, body.chapter_id)` |
| `PATCH /api/v2/questions/[id]` | `canEditQuestion(email, existingDoc.metadata.chapter_id)` |
| `DELETE /api/v2/questions/[id]` | `isSuperAdmin(email)` |
| `POST /api/v2/assets/upload` | **Required** `questionId` form field; look up question's chapter; `canEditQuestion(email, chapter_id)` |
| `DELETE /api/v2/assets/[id]` | `isSuperAdmin(email)` |
| `POST /api/v2/export/ppt` | `isSuperAdmin(email)` |
| `GET /api/v2/questions` (list) | `getQuestionFilter(email)` mongo filter applied to query |
| `PUT/DELETE /api/v2/admin/user-access` | `isSuperAdmin(email)` |

**Layer 3 — Client UI (`apps/admin/features/admin/hooks/usePermissions.ts`):**

UX-only. The hook fetches the user's effective access and exposes `canEdit(chapterId)`, `canView(chapterId)`, `isSuperAdmin`. Server-side checks remain authoritative; the hook just hides buttons that would 403.

### Student-app behavior (unchanged)

A logged-in student is a Supabase user with no `user_access` document. The shared services in `packages/services/*` treat this case as:

- `GET /api/v2/questions`: `getQuestionFilter(email)` returns `{}` (no restriction) → student sees public questions, same as today.
- `POST /api/v2/questions`: `canEditQuestion(email, chapter_id)` returns false → 403, same as today.

No changes needed in the student app's route wrappers.

---

## Schema

### New collection: `user_access`

`packages/data/models/UserAccess.ts`:

```ts
export type Subject = 'chemistry' | 'physics' | 'mathematics' | 'biology';
export type AccessLevel = 'view' | 'edit';

export interface Grant {
  subject: Subject;
  chapters: 'all' | string[];   // 'all' or specific chapter IDs within that subject
  level: AccessLevel;
}

export interface IUserAccess extends Document {
  email: string;                // lowercase, trimmed, unique
  grants: Grant[];              // can be empty (revoked, kept for audit)
  granted_by: string;           // email of the super admin who created/updated
  granted_at: Date;
  last_accessed_at?: Date;
  is_active: boolean;           // soft-delete flag
  notes?: string;               // max 500 chars
}
```

**Mongoose-level validation:**

- `email`: lowercase, trimmed, unique index.
- `grants`: array, max 50 entries.
- For each grant:
  - `subject` is one of the four enum values.
  - If `chapters` is an array, it must be non-empty AND every entry must belong to that grant's subject (verified via `getSubjectFromChapterId` against `TAXONOMY_FROM_CSV`).
  - `level` is `'view'` or `'edit'`.
- No two grants share the same `subject` in the same document.
- `notes` max 500 chars.

**Indexes:**

- `{ email: 1 }` unique.
- `{ email: 1, is_active: 1 }` for the middleware lookup.
- `{ is_active: 1, granted_at: -1 }` for the staff list pagination.

**Mongoose timestamps:** `timestamps: true` on the schema, adding `createdAt` / `updatedAt`. Matches the convention of every other model in `packages/data/models/`.

**Collection name:** `user_access` (deliberately different from the old `user_roles` so no code accidentally reads the wrong source during the cutover).

### Audit log: rename `role_audit_logs` → `user_access_audit_logs`

```js
{
  _id: uuid,
  action: 'access_created' | 'access_updated' | 'access_deleted',
  actor_email: string,             // super admin who took the action
  target_email: string,            // user whose access was changed
  timestamp: Date,
  changes: {
    before: { grants: Grant[], notes?: string } | null,
    after:  { grants: Grant[], notes?: string } | null,
  },
}
```

**Indexes** (carried over from the legacy `RoleAuditLog`):
- `{ target_email: 1, timestamp: -1 }` — "show history for user X"
- `{ actor_email: 1, timestamp: -1 }` — "what did super admin Y do recently"
- `{ timestamp: -1 }` — general timeline
- `{ timestamp: 1 }` with `expireAfterSeconds: 63072000` (2-year TTL) — automatic cleanup of stale audit data.

---

## Helper API: `packages/data/rbac.ts` (rewritten)

The file shrinks significantly — the role enum, `UserPermissions` interface, `canManageRoles`, `canExportData`, and `canDeleteQuestions` boolean flags are all removed.

```ts
// ── Pure env check, no I/O ──
export function isSuperAdmin(email: string | null | undefined): boolean;
export function listSuperAdmins(): string[];

// ── DB-backed, cached (60s TTL, 5000-entry cap) ──
export type EffectiveAccess =
  | { isSuperAdmin: true }
  | { isSuperAdmin: false; grants: Grant[] };

export async function getEffectiveAccess(email: string): Promise<EffectiveAccess>;

// ── Question-level checks ──
export async function canViewQuestion(email: string, chapterId: string): Promise<boolean>;
export async function canEditQuestion(email: string, chapterId: string): Promise<boolean>;
export async function canDeleteQuestion(email: string, chapterId: string): Promise<boolean>;
// (canDeleteQuestion ignores chapterId; included for API symmetry)

// ── List-endpoint filter ──
export async function getQuestionFilter(email: string): Promise<Record<string, unknown>>;
// super admin → {}
// staff → { 'metadata.chapter_id': { $in: [...readable chapters...] } }
//   Both view-level and edit-level grants contribute to "readable."
// unknown → {} (student case)

// ── Chapter ↔ subject mapping (unchanged) ──
export function getSubjectFromChapterId(chapterId: string): Subject | null;
export function getChapterIdsForSubject(subject: Subject): string[];

// ── Cache management ──
export function invalidateAccessCache(email: string): void;
export function clearAccessCache(): void;
```

### `canEditQuestion` implementation reference

```ts
async function canEditQuestion(email, chapterId) {
  if (isSuperAdmin(email)) return true;
  const access = await getEffectiveAccess(email);
  if (access.isSuperAdmin) return true;
  const subject = getSubjectFromChapterId(chapterId);
  if (!subject) return false;
  return access.grants.some(g =>
    g.subject === subject &&
    g.level === 'edit' &&
    (g.chapters === 'all' || g.chapters.includes(chapterId))
  );
}
```

`canViewQuestion` is identical except it accepts both `'view'` and `'edit'` levels. `canDeleteQuestion` is just `isSuperAdmin(email)`.

### Removed exports

- `UserRole` model (deleted).
- `RoleType`, `getUserPermissions`, `UserPermissions`, `canAccessChapter`, `getAccessibleChapters`.
- All references to `permissions.canEditQuestions`, `permissions.canDeleteQuestions`, `permissions.canManageRoles`, `permissions.canExportData`, `permissions.canAccessAnalytics`.

---

## Environment configuration

- **`SUPER_ADMIN_EMAILS`** (new, required) — comma-separated lowercase email list. Members have full access including delete and role management.
- **`ADMIN_EMAILS`** (removed) — no longer read by any code. Drop from Vercel env (prod, preview, all environments) as part of the cleanup.

`SUPER_ADMIN_EMAILS` should be set in Vercel prod + preview + local `.env.local` before the PR ships. Suggested initial value: copy the current `ADMIN_EMAILS` value (any super admin in the old `user_roles` collection should already be in `ADMIN_EMAILS`).

---

## Migration

Single-PR clean cut. One migration script that runs as part of the deploy.

### `scripts/migrate-user-roles-to-user-access.js`

Reads every active `user_roles` document. For each:

- `role === 'super_admin'` → log email to `super-admins-to-add.txt` output file. No DB write. (Manual step: confirm the email is in `SUPER_ADMIN_EMAILS` env before deploying.)
- `role === 'subject_admin'` with `subjects: [...]` → upsert a `user_access` doc with one grant per subject: `{ subject, chapters: 'all', level: 'edit' }`.
- `role === 'viewer'` with `subjects: [...]` → upsert a `user_access` doc with one grant per subject: `{ subject, chapters: 'all', level: 'view' }`.
- Skip `is_active: false` documents.
- Skip if a `user_access` document already exists for the email (idempotent — script can re-run safely).

End-of-run summary: counts of migrated subject_admins, viewers, super_admins logged for env review, and any skipped (already-migrated) docs.

### Run order on deploy day

1. **Pre-deploy:** confirm `SUPER_ADMIN_EMAILS` is set in Vercel (prod + preview) with at least the deploying user's email.
2. **Deploy PR.** New code is live. The middleware now checks `SUPER_ADMIN_EMAILS` AND `user_access`. Old `user_roles` collection is still in Mongo but no code reads it.
3. **Run migration script** against prod Mongo (`node scripts/migrate-user-roles-to-user-access.js`).
4. **Spot-check:** open Mongo, verify 2–3 known staff have correct `user_access` docs.
5. **Smoke test the admin app** as a super admin: load /staff, see the migrated grants, edit one, verify it persists.

### Rollback plan

If a critical bug is found post-deploy:

1. Revert the PR (single-PR design makes this clean).
2. Redeploy main.
3. The `user_access` collection persists but is unused. Old `user_roles` collection persists and is read again. No data loss.
4. The migration script's output (`super-admins-to-add.txt`) is committed to git for re-use if we re-ship.

### Self-lockout protection

- The super admin running the deploy must confirm their own email is in `SUPER_ADMIN_EMAILS` before merging — covered by a PR checklist item.
- `SUPER_ADMIN_EMAILS` is read at request time (not at build time), so adding an email to Vercel env propagates on next request — no redeploy strictly required for *adding* (still required for the initial setup).
- Existing self-modification guard ports to the new UI: server returns 403 if `email === currentUser.email` on `PUT /api/v2/admin/user-access`.

---

## Admin dashboard UI

### New route: `/staff`

- **Path:** `apps/admin/app/staff/page.tsx` (server component).
- **Component:** `apps/admin/features/admin/components/StaffAccessManager.tsx` (client component — replaces the deleted `RoleManagement.tsx`).
- **Landing card** added in `apps/admin/app/page.tsx` (the admin home grid).
- **Removed:** the inline `<RoleManagement />` mount in `apps/admin/app/crucible/page.tsx`.

### Page layout

1. **Header:** "Staff Access" + "Add staff" button.
2. **Super admins section** (read-only): list of emails from `SUPER_ADMIN_EMAILS` env, with helper text: "To add or remove a super admin, update `SUPER_ADMIN_EMAILS` in Vercel env."
3. **Staff table:** columns are Email / Access summary / Added / Actions. "Access summary" compresses each grant into `Subject · (all | N chapters) · ✎/👁`. Actions: Edit (opens modal), Remove (confirm → soft-delete).

### Add/Edit modal

- **Email field:** editable on Add, read-only on Edit.
- **Notes field:** optional, max 500 chars.
- **Grants list** (vertically stacked, repeatable):
  - **Subject dropdown** — chemistry / physics / mathematics / biology. Subjects already used in another row in this form are disabled client-side.
  - **Chapters control** — radio: "All chapters in subject" (stores `'all'`) OR "Specific chapters" (reveals a filterable checkbox list of chapter IDs for that subject, fetched from `getChapterIdsForSubject` with human-readable titles from `TAXONOMY_FROM_CSV`). At least one chapter required if "Specific chapters" is selected.
  - **Level toggle** — view / edit. **Default: view** (safer default for new staff).
  - **Remove grant** button.
- **"+ Add another grant"** button at the bottom of the grants list.
- **Save** → `PUT /api/v2/admin/user-access`.

### API: `apps/admin/app/api/v2/admin/user-access/route.ts`

| Method | Behavior | Auth |
|---|---|---|
| `GET` | List all active user_access docs (paginated, max 500) | super admin |
| `GET ?email=...` | Fetch one user's access (for edit modal) | super admin |
| `PUT` | Upsert by email (full replace of grants) | super admin |
| `DELETE ?email=...` | Soft-delete (sets `is_active: false`) | super admin |

`GET /api/v2/admin/permissions` response shape changes:

```jsonc
{
  "email": "priya@canvasclasses.in",
  "isSuperAdmin": false,
  "grants": [
    { "subject": "chemistry", "chapters": "all", "level": "edit" },
    { "subject": "physics",   "chapters": ["ph11_kinematics_1d"], "level": "view" }
  ],
  "superAdmins": ["paaras@canvasclasses.in", "..."]  // for the read-only display
}
```

### Server-side guards

- `PUT` and `DELETE`: 403 if `email === currentUser.email` (self-modification and self-deletion block).
- `PUT`: 400 if `email` is in `SUPER_ADMIN_EMAILS` ("Cannot grant access to a super admin — they already have full access via env").
- `PUT`: validate body via Zod (see schema below). 400 on failure.
- `PUT`: cross-field validation — every chapter ID in `chapters: string[]` must belong to the grant's `subject` (verified via `getSubjectFromChapterId`). 400 on mismatch.
- Every mutating action writes a `user_access_audit_logs` entry.
- Every mutating action calls `invalidateAccessCache(email)` so the per-process cache reflects changes within the same request.

### Active vs deleted semantics

- `is_active: true, grants: []` → user can log into the admin app (middleware lets them through) but every route returns 403. Use this when temporarily revoking access without losing the user record. The UI should make this state visible in the staff table ("No grants" badge).
- `is_active: false` → soft-deleted. Middleware treats the user as having no record at all; they hit the 403 at middleware. Use this when removing a staff member permanently.
- The "Remove" button in the staff table sets `is_active: false`. To temporarily revoke, edit the row and remove all grants instead.

### Zod schema

```ts
const GrantSchema = z.object({
  subject: z.enum(['chemistry', 'physics', 'mathematics', 'biology']),
  chapters: z.union([
    z.literal('all'),
    z.array(z.string()).min(1).max(100),
  ]),
  level: z.enum(['view', 'edit']),
});

const UserAccessSchema = z.object({
  email: z.string().email().toLowerCase(),
  grants: z.array(GrantSchema).max(50)
    .refine(g => new Set(g.map(x => x.subject)).size === g.length,
      { message: 'Duplicate subject in grants' }),
  notes: z.string().max(500).optional(),
});
```

### Client hook rewrite

`apps/admin/features/admin/hooks/usePermissions.ts` returns:

```ts
{
  email: string;
  isSuperAdmin: boolean;
  grants: Grant[];
  superAdmins: string[];
  canView: (chapterId: string) => boolean;
  canEdit: (chapterId: string) => boolean;
  loading: boolean;
  error: string | null;
}
```

`canView` / `canEdit` mirror the server-side helper logic (subject → grant → level check).

---

## Files changed

### New
- `packages/data/models/UserAccess.ts`
- `apps/admin/app/staff/page.tsx`
- `apps/admin/features/admin/components/StaffAccessManager.tsx`
- `apps/admin/app/api/v2/admin/user-access/route.ts`
- `scripts/migrate-user-roles-to-user-access.js`

### Rewritten (significantly)
- `packages/data/rbac.ts` — old role-based helpers removed, new grant-based helpers added.
- `apps/admin/features/admin/hooks/usePermissions.ts` — new response shape and helpers.
- `apps/admin/middleware.ts` — env super admin OR `user_access` doc check.
- `apps/admin/app/api/v2/admin/permissions/route.ts` — new response shape.

### Updated (smaller changes)
- `packages/services/questions.ts` — new helper names.
- `packages/services/questions-by-id.ts` — new helper names.
- `packages/services/assets-upload.ts` — require `questionId`, look up chapter, gate on `canEditQuestion`.
- `packages/services/assets-by-id.ts` — new helper names.
- `packages/services/export-ppt.ts` — `isSuperAdmin` check.
- `apps/admin/app/page.tsx` — add "Staff Access" landing card.
- `apps/admin/app/crucible/page.tsx` — remove inline `<RoleManagement />` mount.

### Renamed
- `packages/data/models/RoleAuditLog.ts` → `packages/data/models/UserAccessAuditLog.ts` (collection: `role_audit_logs` → `user_access_audit_logs`).

### Deleted
- `packages/data/models/UserRole.ts`
- `apps/admin/features/admin/components/RoleManagement.tsx`
- `apps/admin/app/api/v2/admin/roles/route.ts`

### Documentation
- `CLAUDE.md` §1, §7, §8 — replace `ADMIN_EMAILS` language with `SUPER_ADMIN_EMAILS` and document the `user_access` grant model.
- `_agents/adr/` — new ADR for this redesign (number TBD when the implementation lands).

---

## Verification

The user prefers not to run `npm run build` / `tsc` locally (memory exhaustion on their laptop). Verification is staged:

1. **Lint:** `npm run lint` — covers obvious type/import errors quickly.
2. **Targeted reads:** open each touched file post-edit, verify imports compile against the new helper signatures.
3. **Migration dry-run:** add a `--dry-run` flag to the migration script that logs what would happen without writing. Run it before the real run.
4. **Manual smoke test (post-deploy):**
   - As super admin: load `/staff`, see migrated grants, edit one grant, verify persistence, delete a test staff member.
   - As subject_admin (with chemistry edit): log in, edit a chemistry question (works), try to edit a physics question (403), try to delete any question (403).
   - As viewer (with physics view): log in, view physics questions (works), try to edit any question (403).
   - As anonymous: hit `/api/v2/admin/user-access` (401 from middleware).

No automated test suite changes — the repo has no automated tests today (per CLAUDE.md §5).

---

## Open implementation considerations

- **`scripts/insert_questions.js` and other batch scripts** use `hasScriptSecret` (the `x-admin-secret` header) to bypass auth. This continues to work; script-secret operations are treated as super admin equivalent. No change needed in the new design.
- **Cache invalidation across instances:** the per-process cache means a role change on one Vercel instance isn't reflected on others for up to 60 seconds. This is unchanged from today and is tracked in `_agents/DEEPENING_BACKLOG.md` for eventual Redis migration.
- **`ADMIN_EMAILS` removal timing:** the env var must be removed from Vercel after the PR ships, not before. The PR includes a deploy checklist item.

---

## Implementation handoff

After this spec is approved, hand off to the `writing-plans` skill to produce a step-by-step implementation plan with explicit subagent dispatch boundaries.
