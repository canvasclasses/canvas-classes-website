# ADR-009: Per-app build-config conventions for shared packages

**Status:** Accepted
**Date:** 2026-05-22
**Tags:** monorepo, packages, build, tailwind, next-config

## Context

Three Vercel build failures in May 2026 (commits `0109335`, `bc20b4b`, `86c0103`)
revealed packaging conventions that weren't written down anywhere. Each
failure was a *silent* trap — local dev kept working, the production build
broke, and in one case the production page *rendered* but with no styling and
no error.

ADR-004 set the package import-direction rules but didn't cover three
build-system facts that turn out to be load-bearing:

1. **How Next.js finds package source.** Apps must list every `@canvas/*`
   package in `next.config.ts` `transpilePackages`. Without it, Vercel's
   fresh install (no hoisted symlinks) fails with `Module not found`.
2. **How Tailwind v4 finds class names.** Tailwind v4 scans content relative
   to the CSS entry point — by default it only sees the current app folder.
   `className=` strings inside `packages/*` are invisible unless the app's
   `globals.css` declares them with `@source`. Failure mode: page renders,
   no styling, no error.
3. **Where a package's runtime deps live.** A package that imports
   `lottie-react` must declare it in its own `package.json`. Relying on the
   consuming app to hoist works locally but fails on Vercel's isolated
   installs.

Note: the original `0109335` fix-up commit also removed `@canvas/book-renderer`'s
`exports` field and claimed "the other `@canvas/*` packages all skip the
exports field." That claim was wrong — five of six packages have `exports`
maps, including `@canvas/ui` which also has `.tsx` subpaths. `book-renderer`
has since been restored to the standard Shape A pattern (an `exports` map
with explicit `.tsx` extensions, identical in shape to `@canvas/ui`). This
ADR therefore covers build-config conventions only, not package shape.

## Decision

**One package shape, three build-config rules.** ADR-004 rule 4 stands as
written — every package declares its public subpaths in `package.json`
`exports`. `.tsx` subpaths spell the extension explicitly (`"./X": "./X.tsx"`),
matching the `@canvas/ui` pattern.

The three rules below apply to every package and every app that consumes it:

**1. `transpilePackages` registration.** Each app's `next.config.ts` lists
every package it imports:

```ts
// apps/{student,admin}/next.config.ts
transpilePackages: [
  '@canvas/book-renderer',
  '@canvas/core',
  '@canvas/data',
  '@canvas/persona',
  '@canvas/services',
  '@canvas/ui',
],
```

Adding a new package without this entry = `Module not found: Can't resolve
'@canvas/<name>'` on Vercel.

**2. Tailwind `@source` registration (only for packages with `className`
strings in `.tsx`).** Each app's `app/globals.css` declares a `@source`
directive pointing at the package:

```css
/* apps/{student,admin}/app/globals.css */
@import "tailwindcss";

@source "../../../packages/book-renderer";
@source "../../../packages/ui";
```

Missing this = Tailwind silently omits the package's classes from the bundle.
The page renders, no error fires, the layout is broken. This is the most
insidious of the three traps because there's no log to grep.

**3. Self-owned runtime deps.** A package's `package.json` `dependencies`
must enumerate every non-`@canvas/*` library the package imports at runtime.
Do not rely on the consuming app to provide them — Vercel's isolated builds
won't hoist them, even if `npm install` locally does. Example: `lottie-react`
must live in `packages/book-renderer/package.json`, not just in
`apps/student/package.json`.

Peer dependencies (React, Next.js, `lucide-react`) stay as `peerDependencies`
on the package and `dependencies` on the apps — the apps pin the versions,
the packages stay version-agnostic.

### Adding a new `@canvas/*` package — checklist

1. Create `packages/<name>/` with `package.json` (`main: ./index.ts`,
   `exports` map enumerating public subpaths, deps), `index.ts` barrel, and
   source files.
2. Register `'@canvas/<name>'` in `transpilePackages` in
   **both** `apps/student/next.config.ts` and `apps/admin/next.config.ts`.
3. If the package contains `className=` strings in `.tsx`, add a `@source`
   line to **both** apps' `app/globals.css`.
4. Declare every non-`@canvas/*` runtime library in the package's own
   `dependencies`. Peer libs (React, Next) go in `peerDependencies`.

Four steps. Mechanical.

## Consequences

**Wins**
- All three silent-failure modes now have a documented prevention rule.
- ADR-004 rule 4 holds for every package, including `book-renderer` — no
  "exception package" to remember.
- The `@source` requirement is now greppable from `globals.css` — anyone
  auditing what Tailwind sees can find the list in one place.

**Costs**
- Four registration points (`transpilePackages` × 2, `@source` × 2) per
  package is friction. The compensating discipline is small for a project
  with six packages; if the count grows past ~15 we should consider a
  `packages.json` manifest the apps read at build time.

## Alternatives considered

- **Generate the `transpilePackages` + `@source` registrations from a single
  source of truth** (e.g. a manifest file each app reads). Rejected for now —
  six packages don't justify the indirection. Revisit if the count grows
  past ~15.
- **Use a workspace-wide build tool (Turbo / Nx).** Out of scope for this
  ADR; `turbo.json` was noted as "TBD" in the migration plan but never
  materialised. The current `npm workspaces` setup is sufficient for two
  apps.
- **Skip the `exports` field on `.tsx` packages** (the path commit `0109335`
  originally chose). Rejected on review — it created two divergent package
  shapes for no real benefit. `@canvas/ui` already demonstrates that
  `exports` + `.tsx` works fine when entries spell the extension.

## Links

- Code:
  - `apps/{student,admin}/next.config.ts` (`transpilePackages`)
  - `apps/{student,admin}/app/globals.css` (`@source`)
  - `packages/book-renderer/package.json` (exports map for a `.tsx` package)
  - `packages/ui/package.json` (the pattern book-renderer matches)
- Commits this ADR consolidates:
  - `0109335` — `transpilePackages` registration (the part that stuck)
  - `bc20b4b` — Tailwind `@source` for book-renderer + ui
  - `86c0103` — declare `lottie-react` as a direct book-renderer dep
- Related ADRs: [ADR-004](./004-package-boundary-rules.md) (the import-direction
  rules these conventions sit alongside),
  [ADR-007](./007-books-editor-migration.md) (which created the book-renderer
  package and exposed the gaps).
