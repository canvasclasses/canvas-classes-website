# ADR-002: Split admin into its own Next.js app (same-origin API)

**Status:** Accepted
**Date:** 2026-05-15
**Tags:** monorepo, apps, security, auth, deployment

## Context

Before Phase 5, the codebase was a single Next.js app at the repo root.
Admin surface lived under `/crucible/admin/` (UI) and `/api/v2/*` (writes),
sharing the same origin, the same Supabase client, the same middleware,
and the same Vercel deployment as student traffic.

Two specific problems:

1. **Blast radius.** A bug in any admin component, page, or route could
   leak into student bundles. An XSS in the admin question editor could
   in principle be reachable from a student session because the cookie
   scope was shared.
2. **Boundary clarity.** The codebase mixed admin and student concerns at
   every level: shared `lib/`, shared middleware matcher, shared API
   prefix. Reasoning about "what can the public reach?" required reading
   every route file individually.

The migration's broader goal was to make the security boundary visible at
the directory level (`apps/admin/` vs `apps/student/`). The remaining
question was *how* to split: cross-origin (admin app calls
`api.canvasclasses.in` over CORS) or same-origin (admin app hosts its own
`/api/v2/*` routes internally).

## Decision

**Split admin into its own Next.js app at `apps/admin/`, deployed to
`admin.canvasclasses.in`, with its own copy of every API route it needs.**
Both apps share the data layer (`@canvas/data`), shared UI primitives
(`@canvas/ui`), shared core utilities (`@canvas/core`), and shared
persona/recommendation logic (`@canvas/persona`) via workspace packages.
After ADR-001 they also share route-handler logic via `@canvas/services`.

Cross-origin (API in `apps/student/`, admin calls it over CORS) was
explicitly rejected.

## Consequences

**Wins**
- True network isolation: admin and student deployments are separate
  Vercel projects on separate origins. A breach of student doesn't
  automatically reach the admin API surface.
- Admin auth cookie lives on `admin.canvasclasses.in`, never on the
  student origin. ADR-003 Shape B (custom JWT) can be added to the admin
  app alone.
- Middleware gate is admin-specific — no path-matching gymnastics to
  exempt `/api/v2/` from admin checks while still gating `/crucible/admin/`.
- Bundles are physically separate. Admin-only React components never
  ship to student users.

**Costs**
- Route duplication: any handler needed by both apps must be hosted in
  both. Initially this meant 9 byte-for-byte duplicate routes. ADR-001
  addresses this by extracting handler logic to `@canvas/services` while
  keeping per-app wrappers.
- Two Vercel projects to operate. Two deploy URLs, two sets of env vars
  (mostly the same values), two monitoring dashboards.
- DNS coordination: `admin.canvasclasses.in` subdomain provisioning.

## Alternatives considered

- **Single app with stronger middleware.** Rejected: the security
  boundary stays soft — middleware bugs become full bypasses. The point
  of the split is to have the boundary enforced at the network layer.
- **Cross-origin API.** Rejected: admin app would call
  `api.canvasclasses.in` from `admin.canvasclasses.in`. CORS adds
  complexity, the API origin becomes a shared attack surface again, and
  admin cookies would have to be CORS-credentialed or replaced with
  bearer tokens. Defeats the isolation goal.
- **Subpath split (`/admin/*` on the student app).** Rejected: still
  same-origin from the browser's perspective. Doesn't move the
  boundary.

## Links

- Code: `apps/admin/`, `apps/student/`
- Phase: Phase 5.0–5.12 (decision locked in 5.0, executed 5.1–5.12)
- Plan: [`_agents/MONOREPO_MIGRATION_PLAN.md`](../MONOREPO_MIGRATION_PLAN.md) Phase 5
- Related: [ADR-001](./001-service-layer-di-pattern.md), [ADR-003](./003-admin-auth-shape-a-first.md)
