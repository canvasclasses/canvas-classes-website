# Phase 5 — Admin App Split

**Status:** code complete (as of 2026-05-16). Final commit `4199ba0`. Pending manual smoke test (5.9) before any preview deploy.
**Branch:** `code-refactor`
**Predecessor:** Phase 4.++ (`6de1434`)

## Commits

| Commit | Sub-phase |
|---|---|
| `e71d5a7` | 5.0 — decision record |
| `c6ad600` | 5.1 — scaffold apps/admin Next.js shell |
| `0f34ae4` | 5.2 — admin auth + middleware (Shape A: Supabase + ADMIN_EMAILS) |
| `09b7f89` | 5.3+5.4 — admin components and route shells moved |
| `3812df4` | 5.5a — move pure-admin API routes |
| `96994fa` | 5.5b — split MIXED API routes + finish admin moves |
| `c17a407` | 5.7 — cleanup student app + feature READMEs |
| `6b8a064` | 5.10 — code-reviewer fixes (C1: 8 duplicated routes; C2: stale /crucible URLs; I1-I3) |
| `4199ba0` | 5.11 — security-auditor fix (H1: open-redirect via backslash) |

This document records the load-bearing decisions for Phase 5 so they are not
relitigated mid-implementation. If an implementation diverges from this doc,
update the doc — don't silently drift.

---

## Goal

Split the Crucible admin surface — both its UI and its write API — out of
`apps/student/` into a separate Next.js app at `apps/admin/`, deploying to
`admin.canvasclasses.in`. Reduce the shared attack surface between
the public-facing student app and the admin-only operator app.

## Why we are doing this (security framing)

The student app at `canvasclasses.in` is a public-internet surface — anyone
can reach it, fuzz it, probe it for vulns. The admin app is for ~5 trusted
operator accounts. As long as admin API routes share the same network host
as the student app, every vulnerability in the public surface can potentially
pivot to the admin write surface.

Moving the admin API to `apps/admin/` puts a **hard network boundary** between
the public surface and the write surface. A vuln in a student page or student
API route cannot reach `/api/v2/books/[bookSlug]/route.ts`'s admin POST,
because that handler is no longer hosted on the student origin at all.

This does not give us **full** isolation — the underlying MongoDB cluster is
still shared. That second layer of defense (separate DB users with separate
permissions) is recorded as a deferred follow-up (Phase 5.5d in the task list).

---

## API surface inventory (as of 2026-05-16)

94 total route files under `apps/student/app/api/`. Classified by auth pattern:

| Class | Count | Examples |
|---|---|---|
| ADMIN (admin auth only) | 16 | `/v2/ai/*`, `/v2/books/[bookSlug]`, `/v2/career-explorer/careers/*`, `/v2/taxonomy/save` |
| MIXED (admin write + student/public GET in same file) | 14 | `/v2/mock-tests/*`, `/v2/books/[bookSlug]/pages/*` (some), `/v2/career-explorer/profiles/[id]/*`, `/v2/questions/[id]/reclassify`, blog routes, asset uploads |
| STUDENT (student auth only) | 28 | `/v2/user/*`, `/v2/test-results`, `/v2/flashcards/*`, `/v2/questions/route.ts` |
| PUBLIC (explicitly marked) | 7 | `/v2/college-predictor/*`, `/v2/notes-quicktest/*` |
| NOAUTH (intentional public reads + webhooks) | 29 | `/handwritten-notes`, `/lectures`, `/v2/chapters`, `/v2/taxonomy/load`, `/auth/google/*` |

Admin UI reaches **~30 of the 94 routes** (the 16 ADMIN + the admin methods
on the 14 MIXED + a handful of PUBLIC/NOAUTH reads for cross-cutting data
like chapters and taxonomy).

---

## Decision 1 — Split the API by method

**Decision:** split. Admin API routes move into `apps/admin/`.

- **ADMIN-only (16):** 1:1 file move to `apps/admin/app/api/v2/<same-path>/route.ts`.
- **MIXED (14):** split. Admin write handlers (POST/PATCH/PUT/DELETE) extract
  to `apps/admin/app/api/v2/<same-path>/route.ts`. Student/public GET handlers
  stay in `apps/student/`.
- **STUDENT (28), PUBLIC (7), NOAUTH (29):** stay in `apps/student/`.

**Shared business logic** between split halves extracts to `@canvas/data` /
`@canvas/persona` / a new `@canvas/services` package as duplication appears.
We do not pre-extract — let actual shared code signal what belongs in a
package.

**Why this over "keep API in student, admin calls cross-origin":** the
cross-origin approach leaves admin write routes on the public student host.
Same attack surface, just renamed. The point of Phase 5 is the hard network
boundary; the cross-origin approach defeats that point.

## Decision 2 — Auth shape

**Decision:** Shape A. Lift the existing Supabase + `ADMIN_EMAILS` allowlist
into the admin app as-is. No new auth model in Phase 5.

- `apps/admin/lib/auth.ts` ports `requireAdmin`, `getAuthenticatedUser`,
  `isAdmin`, `isLocalhostDev` from `apps/student/lib/{auth,bookAuth}.ts`.
- `apps/admin/middleware.ts` gates every path except `/login`, `/api/auth/*`,
  `/_next/*`. Non-admin logged-in users get 403.

**Shape B (custom bcrypt+JWT+admin_accounts MongoDB collection) is deferred.**
With admin API in its own app, Shape B becomes a self-contained change inside
`apps/admin/` and can ship as Phase 7 (or skipped entirely if Supabase remains
sufficient).

**Why this and not Shape B atomic:** bundling "split the app" with "rewrite
the auth model" doubles the risk surface of Phase 5. Two large changes done
sequentially is safer than two large changes intertwined.

## Decision 3 — URL strategy

**Decision:** admin gets its own subdomain.

- Production: `admin.canvasclasses.in` → `apps/admin/` Vercel deployment
- Production: `canvasclasses.in` → `apps/student/` Vercel deployment
- Local dev: student on `:3000`, admin on `:3001`

Admin URLs flatten. The `/crucible` prefix that exists today only because the
admin shared the student app's routing namespace is dropped.

| Today | After |
|---|---|
| `canvasclasses.in/crucible` | `admin.canvasclasses.in/` |
| `canvasclasses.in/crucible/admin` | `admin.canvasclasses.in/admin` |
| `canvasclasses.in/crucible/admin/blog` | `admin.canvasclasses.in/admin/blog` |
| `canvasclasses.in/crucible/admin/books` | `admin.canvasclasses.in/admin/books` |
| `canvasclasses.in/crucible/admin/flashcards` | `admin.canvasclasses.in/admin/flashcards` |
| `canvasclasses.in/crucible/admin/taxonomy` | `admin.canvasclasses.in/admin/taxonomy` |
| `canvasclasses.in/crucible/admin/career-explorer` | `admin.canvasclasses.in/admin/career-explorer` |
| `canvasclasses.in/crucible/dashboard` | `admin.canvasclasses.in/dashboard` |
| `canvasclasses.in/crucible/preview` | `admin.canvasclasses.in/preview` |
| `canvasclasses.in/crucible/admin/preview` | (merged into `/preview`) |

The `/crucible/*` routes are deleted from the student app entirely. There are
no internal student links to these — they were always intended as an admin
namespace.

---

## Implementation sequence

Per Phase 4 pattern, one commit per sub-phase. Each commit must pass TSC +
lint + build on both apps before being made.

| # | Title |
|---|---|
| 5.0 | This doc + decision lock |
| 5.1 | Scaffold `apps/admin/` Next.js shell |
| 5.2 | Admin auth + middleware (Shape A) |
| 5.3 | Move admin components from `features/crucible/components/admin/` → `apps/admin/features/admin/` |
| 5.4 | Move admin route shells from `app/crucible/*` → `apps/admin/app/*` |
| 5.5a | Move ADMIN-only API routes (16 files, 1:1) |
| 5.5b | Split MIXED API routes (14 files; admin half → admin app, student half → student app) |
| 5.5c | Extract shared service helpers to packages as duplication surfaces |
| 5.6 | Resolve cross-feature import edges (flashcards, molecule renderer) |
| 5.7 | Cleanup `apps/student/` + feature READMEs |
| 5.8 | Verification gates (TSC + lint + build on both apps) |
| 5.9 | Manual smoke test |
| 5.10 | code-reviewer skill on the diff |
| 5.11 | security-auditor skill on auth + cross-app boundary |
| 5.12 | Final docs (CLAUDE.md, CRUCIBLE_ARCHITECTURE.md, READMEs, memory) |
| 5.5d | (deferred follow-up) MongoDB user permission split |

---

## Things that are explicitly out of scope for Phase 5

- **Shape B auth (bcrypt+JWT+admin_accounts).** Deferred. Now self-contained
  inside `apps/admin/` after the split, so can ship later without coupling.
- **MongoDB user permission split.** Recorded as 5.5d, deferred until Phase 5
  is observed stable in production for at least a week.
- **Tests + ADR.** That's Phase 6.
- **Preview deploy + production cutover.** User's call, after all phases on
  the `code-refactor` branch are complete and merged.
- **Promoting flashcards helpers to a shared package.** If they have no
  student-side coupling (pure pure functions), we promote in 5.6. Otherwise
  we copy into admin with a divergence-risk comment and defer the package
  extraction. Pure judgment call at the time.

---

## Risks tracked

1. **Mixed-route splits introduce subtle bugs.** Mitigation: each split keeps
   the original shared imports until duplication clearly emerges; we don't
   pre-extract; we test reads + writes after each split.
2. **Shared cookie/session behavior between subdomains.** With the API split,
   admin auth is fully same-origin inside `admin.canvasclasses.in`. No
   cross-subdomain cookie config is needed — admin and student users are
   separate humans, separate sessions. Risk near zero.
3. **Vercel deployment config.** Two projects (or one project with two
   domains) need separate env vars. Documented in 5.12.
4. **`@canvas/data` imports from both apps.** Both apps import the same
   Mongoose models. Mongoose's connection caching is per-process and works
   fine for two independent Next.js apps. No code change needed.
5. **Admin UI calls that were `fetch('/api/v2/...')` with cookie auth.**
   These are same-origin in the admin app, so they keep working without
   change. The fetch call is relative; the admin app serves both UI and API.
