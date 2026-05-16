---
name: code-reviewer
description: Review code quality, best practices, performance, and security for the Canvas Classes Next.js codebase. Trigger when the user says "review this code", "code review", "review my changes", "audit this component", "check this PR", "review my implementation", or similar.
---

# Code Reviewer

You are reviewing code in the Canvas Classes Next.js 15 codebase. This is a full-stack app with App Router, React 19, TypeScript, Tailwind CSS 4, MongoDB (Mongoose), and Supabase auth.

**Before reviewing, read `CLAUDE.md`** — it contains the security rules (§8), canonical file locations, and import direction rules that define "correct" for this project.

## Output format

Always structure your review as:

```
### Critical  (must fix — security, data loss, broken feature)
### Important  (should fix — correctness, performance, maintainability)
### Suggestions  (nice to have — style, minor optimisations)
### Positive highlights  (well-done patterns worth noting)
```

Skip any section that has no items.

---

## Checklist

### TypeScript & types
- [ ] No unjustified `any` — use `unknown` + type guard instead
- [ ] Interfaces for shared shapes live in the right `types.ts` file (admin: `app/crucible/admin/types.ts`, student: `app/the-crucible/components/types.ts`)
- [ ] No local interface that duplicates an existing shared one

### Next.js App Router
- [ ] `'use client'` only when actually needed (event handlers, browser APIs, hooks)
- [ ] Server Components do data fetching; Client Components handle interactivity
- [ ] Server Actions in `actions.ts`, not inline in component files
- [ ] `unstable_cache` / `revalidateTag` used correctly for ISR
- [ ] `generateStaticParams` present on dynamic routes that should be statically generated

### Security (must check every API route)
- [ ] Every mutating endpoint (`POST`, `PATCH`, `DELETE`) calls `getAuthenticatedUser()` or `requireAdmin()` before touching the DB
- [ ] Auth imported from `lib/auth.ts` (route handlers) or `lib/bookAuth.ts` (server components) — never defined inline
- [ ] Request body validated with Zod schema or explicit field whitelist — never `$set: body`
- [ ] Error responses use generic messages, not `error.message` or stack traces
- [ ] Every `.find()` has a `.limit()` — no unbounded queries
- [ ] `process.env.NODE_ENV === 'development'` never used as an auth bypass (use `isLocalhostDev()`)

### Import direction
- [ ] Student code (`apps/student/features/crucible/` non-admin) does NOT import from `apps/student/features/crucible/components/admin/` — use shared locations:
  - Math/LaTeX: `@canvas/ui/MathRenderer`
  - Taxonomy: `@canvas/data/taxonomy/taxonomyData_from_csv`
  - Adaptive engine: `@/features/crucible/lib/adaptiveEngine`
- [ ] Cross-cutting utilities stay in `packages/data/`, `packages/persona/`, `packages/core/`, `packages/ui/`, or `apps/student/lib/` — not inside feature folders
- [ ] Packages (`packages/*/`) never import from `apps/*` or use the `@/` alias — relative paths only

### MongoDB / Mongoose
- [ ] `lean()` on read-only queries
- [ ] `deleted_at: null` filter on every query touching soft-deleted collections
- [ ] No mass assignment — explicit field whitelist in `$set`
- [ ] Writes to canonical field names (never legacy aliases — see CLAUDE.md §4.5)

### React patterns
- [ ] No inline object/array creation inside JSX that causes unnecessary re-renders
- [ ] `useCallback` / `useMemo` on functions/values passed to children or used as effect deps
- [ ] `key` props use stable IDs, not array indices

### Data model integrity (Crucible)
- [ ] New questions set `status: 'published'`, never `'draft'` or `'review'`
- [ ] Exam attribution uses canonical fields: `sourceType`, `applicableExams`, `examDetails` — not legacy `is_pyq`, `examBoard`, `exam_source`
- [ ] `is_top_pyq` not confused with `is_pyq` — they are separate (see CLAUDE.md §4.5)

### Simplicity
- [ ] No helper extracted for a single call site
- [ ] No error handling for scenarios that can't happen
- [ ] No backwards-compat shim for code that doesn't exist yet

---

## Monorepo migration review (only when diff touches `apps/*` or `packages/*`)

Fire this section in addition to the main checklist when the change is part of the canvas → monorepo migration tracked in `_agents/MONOREPO_MIGRATION_PLAN.md`.

### Workspace boundaries
- [ ] `apps/admin/` does not import from `apps/student/` (and vice versa) — search the diff for `from '../../student/'` or `from '@/...'` path aliases that cross apps
- [ ] No `@/` alias in any package — packages must use relative paths or other `@canvas/*` packages, never an app's `@/` alias
- [ ] Apps import from packages by package name (`from '@canvas/data'`), never via relative path crossing the workspace (`from '../../../packages/data/...'`)

### Package public surface
- [ ] Every new file in `packages/*/` is either (a) re-exported from `index.ts`, or (b) explicitly internal (named `_*.ts` or under `packages/X/internal/`)
- [ ] `index.ts` doesn't re-export internal helpers — only the intended public API
- [ ] Package `README.md` matches what `index.ts` actually exports (no stale promises)
- [ ] No `export *` from `index.ts` — be explicit so callers + future agents see the surface

### Dependency hygiene
- [ ] No package depends on a sibling package via relative path — only via `"@canvas/foo": "*"` in `package.json` `dependencies`
- [ ] No circular dependency: package A imports B, B imports A → fail
- [ ] No package imports from `apps/*` — packages must not know which app consumes them
- [ ] If a package is added/used, it's declared in the consumer's `package.json` (`workspaces` resolves it but the dep must be listed)

### File-move correctness (when a phase relocates code)
- [ ] `git mv` was used (or the rename is detected by git) — history preserved
- [ ] No stale imports left at old paths — `grep` the diff for the OLD path; should be zero hits
- [ ] If a path appears in `CLAUDE.md`, `_agents/`, or docs, the doc was updated in the same commit

### Feature folder hygiene (Phase 4+)
- [ ] Each `features/*/` slot used is justified (file or folder, not both)
- [ ] `seo.ts` per feature with metadata + JSON-LD, not scattered across `page.tsx` files
- [ ] `__tests__/` mirrors the source tree
- [ ] Public surface goes through `features/X/index.ts`; routes in `app/` are thin re-exports

### Plan doc currency
- [ ] If the diff completes a phase milestone listed in `_agents/MONOREPO_MIGRATION_PLAN.md`, the doc was updated in the same commit (phase status → DONE, commit hash filled in)
- [ ] If a previously-`[TBD]` decision was made, it's recorded under "Decision log" in the plan doc

### Common monorepo anti-patterns to flag

| Pattern | Severity |
|---|---|
| `apps/admin` importing `apps/student/lib/...` (or vice versa) | Critical |
| `apps/X/...` importing from `apps/Y/...` via path traversal | Critical |
| `packages/X` importing from `apps/Y` | Critical |
| `export *` from a package `index.ts` | Important |
| Package `README.md` describing features that don't exist in the package yet | Suggestion |
| Two packages importing each other (cycle) | Critical |
| `@/` alias used inside a package (not an app) | Important |
| Phase complete but plan doc not ticked | Important |
