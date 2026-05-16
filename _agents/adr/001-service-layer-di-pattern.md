# ADR-001: Service-layer DI pattern for shared route handlers

**Status:** Accepted
**Date:** 2026-05-16
**Tags:** monorepo, packages, services, auth, route-handlers

## Context

After the admin-app split (ADR-002), nine Next.js route handlers existed as
byte-for-byte duplicates in both `apps/student/` and `apps/admin/`:

- `/api/v2/chapters`
- `/api/v2/taxonomy/load`
- `/api/v2/assets/[id]` (DELETE)
- `/api/v2/assets/upload` (POST + GET)
- `/api/v2/export/ppt` (POST)
- `/api/v2/questions` (GET + POST)
- `/api/v2/questions/[id]` (GET + PATCH + DELETE)
- `/api/v2/flashcards` (GET + POST)
- `/api/v2/flashcards/[id]` (GET + PATCH + DELETE)

The only structural difference between each pair was a single import: student
imported `isLocalhostDev` from `@/lib/bookAuth`, admin imported it from
`@/lib/adminAuth`. The two implementations were verbatim equivalents.

This produced a real lockstep-change tax: any bug fix or feature added to one
copy had to be mirrored to the other within the same commit, or a drift-audit
script would catch the inconsistency later. About 3,800 lines of handler logic
lived in this duplicated state.

## Decision

Extract the handler logic into a new `@canvas/services` workspace package.
Each route file becomes a ~10-line wrapper that:

1. Imports the service function (`GET`, `POST`, etc.) from
   `@canvas/services/<route>`.
2. Constructs a `deps: ServiceDeps` object from the app-local auth helpers.
3. Re-exports thin closures: `export const GET = (req, ctx) => svcGET(req, ctx, deps)`.

`ServiceDeps` is the auth contract:

```ts
// packages/services/types.ts
export interface ServiceDeps {
  getAuthenticatedUser: (request: NextRequest) => Promise<User | null>;
  isAdmin: (email: string | undefined | null) => boolean;
  hasScriptSecret: (request: NextRequest) => boolean;
  isLocalhostDev: () => Promise<boolean>;
}
```

Both apps' auth helpers are identical implementations today, but each app
owns its own `lib/auth.ts` and either `lib/bookAuth.ts` (student) or
`lib/adminAuth.ts` (admin). The DI seam exists so admin can evolve its auth
shape (e.g. ADR-003 Shape B) without touching the shared package.

Next.js route-segment config (`export const runtime`, `maxDuration`, etc.)
stays in the wrapper file — Next reads these from the route module itself,
not from imported modules.

## Consequences

**Wins**
- ~1,600 net lines deleted (-3,882 / +2,253 across the 36-file diff).
- One source of truth per route. Drift becomes impossible by construction.
- Each app keeps its own auth boundary — Shape B migration can swap admin
  deps without rewriting the package.
- Package surface is explicit (`exports` field in `package.json`); the
  flat one-file-per-route layout makes audits trivial.

**Costs**
- Two-level indirection: route file → service file. New maintainers have
  to learn the pattern (mitigated by README in the package).
- Service functions accept a `deps` argument — slightly less idiomatic than
  Next.js' typical signature. The wrapper hides this from Next.
- Package treats request input as PUBLIC API: validation must live at the
  package boundary, not be assumed from the caller. We rely on existing
  Zod schemas in `@canvas/data/schemas/*`.

**Non-issues** (validated during code review)
- Rate-limiter Maps at module scope are per-app — each Vercel deployment
  gets its own bundled copy of the package, so the limiter is per-instance,
  not shared across student + admin.

## Alternatives considered

- **Auth helper consolidation in a package.** Rejected: would erase the
  per-app boundary that ADR-003 explicitly preserves for Shape B.
- **Lift to a base abstract handler class.** Rejected: Next.js route
  handlers are pure functions; introducing a class would conflict with
  the framework's expectations and obscure the request lifecycle.
- **Keep duplication, add a drift-audit script.** Rejected: maintenance
  tax doesn't go away, and a script in CI doesn't prevent the bug — it
  just catches it later.

## Links

- Code: `packages/services/`
- Phase: Phase 6.0 (commit `84b3afa`), Phase 6.1 audit fixes (commit `3d93e70`)
- Plan: [`_agents/MONOREPO_MIGRATION_PLAN.md`](../MONOREPO_MIGRATION_PLAN.md) Phase 6
- Related: [ADR-002](./002-admin-app-split.md) (which created the duplication this fixes), [ADR-004](./004-package-boundary-rules.md)
