# Role-Based Access Control (RBAC)

**Status:** Canonical RBAC reference. Consolidates `RBAC_IMPLEMENTATION_GUIDE.md` + `RBAC_QUICK_START.md` (both retired 2026-05-22), updated for the post-monorepo layout.

> **What this doc is NOT:** the canonical security policy. For mandatory auth rules — what `getAuthenticatedUser` does, the `NODE_ENV` bypass ban, input-validation rules, etc. — see CLAUDE.md §8.

---

## 1. Two gates, not one

Admin access is gated in two independent layers. **Both must pass.** The `user_roles` collection only matters *after* a request has cleared the first gate.

| Gate | Where it lives | What it answers |
|---|---|---|
| **1. ADMIN_EMAILS allow-list** | `apps/admin/middleware.ts` + every admin route's `requireAdmin()` / `getAuthenticatedUser() + isAdmin()` | *Can this user touch the admin app at all?* |
| **2. Per-subject RBAC** | `packages/data/rbac.ts` (+ MongoDB `user_roles` collection) | *Within the admin, which subjects/chapters/actions are they allowed to use?* |

Gate 1 is the first line of defense and the only thing protecting the admin app from random internet traffic. Gate 2 is what lets you give one operator chemistry-only edit access while another gets physics-only.

ADR-003 explains why gate 1 is `ADMIN_EMAILS` today instead of a JWT/`admin_accounts` table — the latter ("Shape B") is deferred until post-launch and slots in via the same DI seam without touching gate 2.

---

## 2. Roles & subjects

The `user_roles` collection (`packages/data/models/UserRole.ts`) defines three roles:

```ts
{
  email: string;            // lowercase, unique
  role: 'super_admin' | 'subject_admin' | 'viewer';
  subjects: Subject[];      // ['chemistry', 'physics', 'mathematics', 'biology']
  granted_by: string;
  granted_at: Date;
  last_accessed_at: Date;
  is_active: boolean;
  notes: string;
}
```

| Role | Can edit | Can delete | Can manage roles |
|---|---|---|---|
| **super_admin** | All subjects | ✅ (only role that can) | ✅ |
| **subject_admin** | Only assigned subjects | ❌ | ❌ |
| **viewer** | ❌ (read-only on assigned subjects) | ❌ | ❌ |

**Subject mapping** (from `chapter_id` prefix → subject):

| Prefix | Subject |
|---|---|
| `ch11_*`, `ch12_*` | Chemistry |
| `ph11_*`, `ph12_*` | Physics |
| `ma_*` | Mathematics |
| `bi_*` | Biology |

The map is enforced by `getSubjectFromChapterId(chapter_id)` in `packages/data/rbac.ts`. Adding a new subject means updating this function + the `Subject` enum.

---

## 3. Authorization API — `packages/data/rbac.ts`

| Function | Purpose |
|---|---|
| `getUserPermissions(email)` | Full permission set: role + subjects + booleans (canEditQuestions, canDeleteQuestions, canManageRoles, canAccessAnalytics, canExportData) |
| `canAccessChapter(email, chapterId)` | Read gate for a specific chapter |
| `canEditQuestion(email, chapterId)` | Write gate for a specific chapter (called by every question-mutation handler) |
| `canDeleteQuestion(email, chapterId)` | Delete gate (super_admin only) |
| `getAccessibleChapters(email)` | Chapter IDs the user can see |
| `getQuestionFilter(email)` | MongoDB filter to scope question queries |

These are pure functions over the `user_roles` document. They do not touch auth — auth is upstream.

---

## 4. API surface

All under `apps/admin/app/api/v2/`:

| Endpoint | Who | Purpose |
|---|---|---|
| `GET /admin/permissions` | Any signed-in admin | Returns the caller's `getUserPermissions(...)` payload — used by the admin UI to hide/show actions |
| `GET /admin/roles` | super_admin only | List active roles |
| `POST /admin/roles` | super_admin only | Create / update a role |
| `DELETE /admin/roles?email=...` | super_admin only | Deactivate a role (soft-delete; sets `is_active: false`) |

The student-app question routes (and the admin-app question routes) call `getUserPermissions` + `getQuestionFilter` to apply per-subject scoping automatically. Subject admins literally cannot see questions outside their subjects — the filter is applied before the Mongo query.

---

## 5. Setup — bootstrap your first super_admin

The admin app middleware checks `ADMIN_EMAILS` before anything else. Your email must be in that env var. THEN you create the `user_roles` row that gates per-subject behavior.

### Step 1: Get your email into `ADMIN_EMAILS`

In `.env.local` (and the production deployment):

```
ADMIN_EMAILS=you@example.com,colleague@example.com
```

Comma-separated, case-insensitive.

### Step 2: Bootstrap the super_admin user_roles row

```bash
npx tsx scripts/bootstrap-super-admin.ts your-email@example.com
```

Expected output:

```
✅ Super admin role created successfully!
   Email: your-email@example.com
   Role: super_admin
   Access: All subjects
```

If the script does not exist or has drifted, do it manually in `mongosh`:

```js
db.user_roles.insertOne({
  email: 'your-email@example.com',
  role: 'super_admin',
  subjects: [],                 // empty for super_admin (treated as all)
  granted_by: 'system',
  granted_at: new Date(),
  is_active: true,
  notes: 'Initial super admin',
});
```

### Step 3: Sign in

Log in to `admin.canvasclasses.in` (or your local admin app dev server). Middleware checks `ADMIN_EMAILS` → passes. Routes then check `user_roles` → you get super_admin behavior.

### Step 4: Grant a subject admin

In the admin app, open the Roles panel (linked from the `/` card grid) and add another email:

```
Email: chemfaculty@example.com
Role: subject_admin
Subjects: [chemistry]
Notes: Chemistry faculty
```

Then **also add that email to `ADMIN_EMAILS`** — otherwise middleware blocks them before the role check ever runs.

> ⚠️ **Common gotcha:** granting a `user_roles` row WITHOUT adding the email to `ADMIN_EMAILS` produces a confusing 403 because middleware kicks the user out before the role-based UI ever loads. Both layers must allow the email.

---

## 6. Localhost dev — how the bypass actually works

CLAUDE.md §8.3 bans `process.env.NODE_ENV === 'development'` as an auth bypass (Vercel previews trigger that condition). The correct helper is `isLocalhostDev()` from:

- Student app: `apps/student/lib/bookAuth.ts`
- Admin app: `apps/admin/lib/adminAuth.ts`

`isLocalhostDev()` returns true only when **all three** hold:

1. `process.env.NODE_ENV === 'development'`
2. `process.env.VERCEL !== '1'` (not running on Vercel)
3. Hostname is `localhost` or `127.0.0.1`

When `isLocalhostDev()` is true, the admin app grants implicit super_admin without consulting `user_roles`. This is intentional — local dev should not require `mongosh` to function.

**Do not write new code that checks `window.location.hostname === 'localhost'` directly** (the old `usePermissions` hook + `permissions` API used to do this; both have been retired — see `_agents/archive/SECURITY_FIXES_CHANGELOG.md` for the original CVE).

---

## 7. Security guarantees

- **Database-level filtering** — every question query in the admin app applies `getQuestionFilter(email)` before hitting Mongo. Subject admins cannot accidentally `find()` other subjects.
- **API-level authorization** — every mutating endpoint calls `canEditQuestion` / `canDeleteQuestion` before writing.
- **UI-level restrictions** — the admin UI hides actions the user can't perform (cosmetic only; never trust the UI as the gate).
- **Audit logging** — role changes write to `audit_logs` with the old → new diff.
- **Self-modification prevention** — a user cannot edit their own `user_roles` row through the API (writes block when `email === actor.email`).
- **Soft delete** — `DELETE /admin/roles` sets `is_active: false`; rows are kept for audit.
- **Fail-safe defaults** — a signed-in user with no `user_roles` row gets `role: 'viewer'`, `subjects: []` — effectively no access.

---

## 8. Common scenarios

### Subject admin (chemistry) logs in

- Sees only chemistry chapters (`ch11_*`, `ch12_*`) in dropdowns.
- Question list is pre-filtered to chemistry only.
- Can create / edit / publish chemistry questions.
- Cannot delete any question (super_admin only).
- Cannot see physics, math, or biology data.
- Cannot access the Roles panel.

### Viewer (chemistry) logs in

- Sees chemistry chapters and questions, read-only.
- Save/publish/delete buttons are hidden (and the API rejects if they're somehow called).
- Can view analytics dashboards.

### Audit a recent role change

```js
db.audit_logs
  .find({ resource_type: 'user_role' })
  .sort({ timestamp: -1 })
  .limit(10);
```

---

## 9. Troubleshooting

**User signs in but gets 403 on every admin page.**
Their email is missing from `ADMIN_EMAILS`. Middleware blocks them before any handler runs. Add it to the env var and redeploy / restart the admin app.

**User passes middleware but can't see any questions.**
- Check `db.user_roles.findOne({ email })` — is the row present and `is_active: true`?
- If `role === 'subject_admin'`, does `subjects` contain at least one subject?
- Are there published questions in that subject? `db.questions_v2.countDocuments({ 'metadata.chapter_id': /^ch11_/, deleted_at: null })`

**Subject admin tries to edit and gets 403.**
The chapter they're editing isn't in their `subjects` list, OR they're trying to delete (only super_admin can).

**Role change didn't take effect.**
Permissions are fetched per-request. Ask the user to refresh the page. If still wrong, check the API response in DevTools Network tab.

---

## 10. Best practices

- **Principle of least privilege.** Grant only the subjects the faculty member actually owns. Reserve super_admin for ~2 trusted people.
- **Always have 2+ super_admins.** Use different email providers so no single Gmail / Google Workspace outage locks you out.
- **Document grants.** The `notes` field is searchable — write *why* the grant was given.
- **Review monthly.** `db.user_roles.find({ is_active: true })` + check `last_accessed_at` to spot dormant accounts.
- **Deactivate (don't delete).** Set `is_active: false` so audit history stays intact.

---

## See also

- [ADR-003 — Admin auth Shape A](./adr/003-admin-auth-shape-a-first.md) — why `ADMIN_EMAILS` is the gate today, what Shape B will look like
- [CLAUDE.md §8](../CLAUDE.md) — mandatory security rules
- [ARCHITECTURE.md §6](../ARCHITECTURE.md) — full auth model + defense-in-depth diagram
- `packages/data/rbac.ts` — the authoritative implementation
- `packages/data/models/UserRole.ts` — schema
- `apps/admin/middleware.ts` — the first gate
