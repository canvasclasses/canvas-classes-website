# ADR-003: Ship admin auth as Shape A; defer Shape B

**Status:** Accepted
**Date:** 2026-05-15
**Tags:** auth, admin, security, supabase

## Context

The admin-app split (ADR-002) opened the door to changing how admin auth
works. The pre-migration model relied on Supabase user accounts gated by
an `ADMIN_EMAILS` allow-list in env vars. This had been adequate for a
small team but had two latent issues:

- **Allow-list rotation friction.** Adding or removing an admin requires
  an env var edit and a redeploy. There's no audit trail of when access
  was granted or revoked.
- **No per-admin scoping in the auth layer.** RBAC (subject/chapter
  scoping) lives in MongoDB (`UserRole` collection), not in the auth
  token. A Supabase session says "is this a real user?" but not "what
  can this admin touch?" — that's enforced post-auth, in route handlers.

Two shapes were considered during planning:

- **Shape A:** Existing model. Supabase auth + `ADMIN_EMAILS` allow-list.
  RBAC in MongoDB unchanged.
- **Shape B:** Custom email + password + bcrypt + signed JWT, backed by
  a new `admin_accounts` MongoDB collection that merges
  `UserRole` + auth into one record per admin. Super admin can
  create/disable accounts via UI.

Shape B is the strictly better long-term answer (audit trail, no
redeploys, account disablement, no dependency on a third-party auth
provider for the most sensitive surface). But it has substantial
implementation cost: a new collection, a login UI, a JWT signing key,
session cookie management, a credential-reset flow.

## Decision

**Ship admin in Shape A. Defer Shape B to a post-migration phase.**

The admin app at `apps/admin/` uses the same Supabase auth as the student
app for login, then enforces admin authority through:

1. Framework-level middleware at `apps/admin/middleware.ts` that gates
   the entire app on `ADMIN_EMAILS` membership.
2. Per-route `requireAdmin()` / `getAuthenticatedUser()` + `isAdmin()`
   calls (defense in depth).
3. Existing `UserRole`-backed `rbac.ts` for subject/chapter scoping.

The dependency-injection seam introduced by ADR-001 means a future Shape B
migration only has to swap the admin app's `lib/auth.ts` + `lib/adminAuth.ts`
implementations. The `@canvas/services` package itself doesn't change.

## Consequences

**Wins**
- Phase 5 ships without a custom credential system. The migration's risk
  surface stays bounded to "move files, preserve auth" rather than "build
  a new auth system mid-flight."
- Admins keep their existing Supabase logins. Zero account migration
  required at cutover.
- The DI seam is established now; Shape B becomes a future drop-in.

**Costs**
- Admin onboarding/offboarding still requires `ADMIN_EMAILS` env-var edits.
- No admin-side audit log for account changes (only operational changes
  are audited via `AuditLog`).
- Supabase remains a critical dependency for the most sensitive surface.

**Migration plan if Shape B is later adopted**
1. Add `admin_accounts` collection (merges `UserRole` + auth into one
   record per admin).
2. Build login UI at `apps/admin/login` (already exists in Shape A;
   needs handler swap).
3. Replace `getAuthenticatedUser` in `apps/admin/lib/auth.ts` with a
   JWT-verifying implementation.
4. Replace `isAdmin` (currently env-var lookup) with an
   `admin_accounts.role`-backed check.
5. Bcrypt-hash existing admin passwords on first login.
6. Decommission `ADMIN_EMAILS` env var.

Nothing in `@canvas/services` changes — that's the value of the DI
boundary.

## Alternatives considered

- **Ship Shape B as part of Phase 5.** Rejected: scope creep on a
  migration already touching 100+ files. New attack surface introduced
  mid-move is the worst time to make security changes.
- **Hybrid (use Shape A for sign-in but custom JWT for admin session).**
  Rejected: two auth systems running in parallel is strictly more
  complex than either alone.

## Links

- Code: `apps/admin/lib/auth.ts`, `apps/admin/lib/adminAuth.ts`, `apps/admin/middleware.ts`
- Phase: Phase 5.0 (decision locked), Phase 5.2 (auth moved into admin app)
- Plan: [`_agents/MONOREPO_MIGRATION_PLAN.md`](../MONOREPO_MIGRATION_PLAN.md) — "Admin auth decision" in the Decision log
- Related: [ADR-002](./002-admin-app-split.md), [ADR-001](./001-service-layer-di-pattern.md)
