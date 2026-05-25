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
