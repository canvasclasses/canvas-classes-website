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
- [ ] Student code (`app/the-crucible/`) does NOT import from `app/crucible/admin/` — use shared locations:
  - Math/LaTeX: `@/components/MathRenderer`
  - Taxonomy: `@/lib/taxonomy/taxonomyData_from_csv`
  - Adaptive engine: `@/app/the-crucible/lib/adaptiveEngine`
- [ ] Cross-cutting utilities stay in `lib/`, not inside feature folders

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
