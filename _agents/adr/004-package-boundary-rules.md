# ADR-004: `@canvas/*` package boundary rules

**Status:** Accepted
**Date:** 2026-05-16
**Tags:** monorepo, packages, imports, build

## Context

The monorepo ended up with five workspace packages:

| Package | Role |
|---|---|
| `@canvas/data` | Mongoose models, taxonomy, schemas, id generation, RBAC |
| `@canvas/core` | Rate limiting, R2 storage, analytics, LaTeX validator, redirect validation |
| `@canvas/persona` | Recommendation engine, profile engine, persona writer |
| `@canvas/ui` | Shared React components (MathRenderer, flashcardMarkdown) |
| `@canvas/services` | Server-side route-handler logic (ADR-001) |

And two apps: `apps/student/` and `apps/admin/`.

Without explicit rules, package graphs naturally drift toward cycles,
sibling-app coupling, and unintentional public APIs. The migration plan
needed a stable set of import-direction rules a future reviewer (human or
agent) can enforce without re-deriving them from first principles.

## Decision

Four rules, enforced via code review and the `code-reviewer` skill checklist:

1. **No cross-app imports.** `apps/admin/` must not import from
   `apps/student/`, and vice versa. Sharing is via packages or not at all.

2. **No app imports from packages.** `packages/*/` must never import from
   `apps/*/`. Packages are app-agnostic by construction; if a function
   needs app-specific context, the app passes it in (see ADR-001's
   dependency injection).

3. **No `@/` alias in packages.** The `@/` alias is an app concern
   (it resolves to that app's `src/`). Packages use relative imports
   internally or import from other `@canvas/*` packages by name.

4. **Subpath imports for service surface.** Packages that export multiple
   independent modules (`@canvas/data/models/Question.v2`,
   `@canvas/services/questions`, etc.) declare them in `package.json`
   `exports`. Barrel `index.ts` files re-export only intentional public
   surface — no `export *`. This makes the public API auditable from
   `package.json` alone.

Dependency direction is one-way:

```
        ┌─ @canvas/ui ────────────────────────────────┐
apps  ─►│                                             │
        ├─ @canvas/services ─► @canvas/data ◄──┐      │
        │                  └─► @canvas/core ◄──┤      │
        ├─ @canvas/persona ──► @canvas/data ◄──┘      │
        └─ (apps also import directly from any of the above)
```

`@canvas/core` is a leaf — it imports from nothing else in the workspace.
`@canvas/data` may import `@canvas/core`. `@canvas/persona` and
`@canvas/services` may import either. `@canvas/ui` is a leaf for the
client side. No cycles.

## Consequences

**Wins**
- Build order is determinable. Each package's `tsc --noEmit` runs against
  a fixed graph; cycles can't sneak in.
- Public API is documented in `package.json` `exports`. A new agent can
  see the surface without grepping for `export`.
- Apps can be deployed independently. Admin doesn't accidentally bundle
  student-only persona logic, and vice versa.
- The "package surface = attack surface" rule (CLAUDE.md §8 +
  `security-auditor` skill) becomes well-defined: validate at the
  package boundary, not the app.

**Costs**
- Some shared code that lives in only one app today (e.g. a single
  helper used by both apps' admin pages) has to be promoted to a package
  before it can be reused. This is the right tradeoff but adds a step.
- New files added under `packages/*/` must be added to `exports` or be
  internal — there's a cognitive overhead.

## Alternatives considered

- **No package boundaries, just folders.** Rejected: works at the
  100-file scale, breaks at the 1000-file scale. We're already at the
  point where unrelated apps share unrelated modules; explicit
  boundaries are cheaper than implicit ones now.
- **One big shared package.** Rejected: a single `@canvas/lib` bundles
  everything together. Defeats per-app tree-shaking and makes the public
  API a single 1000-line `index.ts`.
- **Apps as packages (no top-level distinction).** Rejected: apps need
  Next.js-specific build config (`next.config.ts`, `app/` directory).
  The app/package distinction maps to "deployable vs. library."

## Links

- Code: `packages/{core,data,persona,services,ui}/`, `apps/{admin,student}/`
- Phase: Phase 0 (workspace scaffold), Phase 4 (apps/packages structure), Phase 6.0 (services package)
- CLAUDE.md: §7 Import direction rules
- Code-reviewer skill: monorepo section in `.claude/skills/code-reviewer/SKILL.md`
- Related: [ADR-001](./001-service-layer-di-pattern.md), [ADR-002](./002-admin-app-split.md)
