# Monorepo Migration Plan

**Status:** ✅ COMPLETE as of 2026-05-16. Phases 0 → 6 all DONE. Manual smoke test (5.9) and MongoDB user-permission split (5.5d) remain user-owned / deferred.
**Branch:** `code-refactor` (awaiting final smoke test before merge to `main`)
**Started:** 2026-05-15
**Completed:** 2026-05-16

This is the canonical tracker for the migration's execution. Architectural rationale lives in [`_agents/adr/`](./adr/) (immutable); this doc is the timeline. If anything in code contradicts an ADR, fix the code or write a new ADR — don't silently diverge.

---

## What we are doing

The repo is becoming a monorepo with two deployable apps and four shared packages:

```
canvas/
├── apps/
│   ├── admin/         deploys separately — admin-only routes + admin auth
│   └── student/       deploys separately — everything public-facing
├── packages/
│   ├── data/          Mongoose models, db, schemas, taxonomy, id-generator, difficulty
│   ├── persona/       persona writer, profile engine, recommendation, scoring
│   ├── ui/            shared components, design tokens, Tailwind preset
│   └── core/          rate-limit, latex utils, redirect validation, analytics, R2
├── scripts/           batch ingestion + backup (stays at root)
├── tools/             question-ingestion templates
├── _agents/           workflows + architecture docs (this file lives here)
├── docs/
├── package.json       workspace root (npm workspaces)
├── tsconfig.base.json shared TS config
└── turbo.json         [TBD — added in Phase 6 if needed]
```

**Rule:** packages contain code shared between admin and student. Anything used by only one app lives in that app's `features/` folder.

---

## How we ship each phase

Every phase MUST satisfy these gates before its commit lands:

| Gate | Command | Pass criteria |
|---|---|---|
| TypeScript | `npx tsc --noEmit --skipLibCheck` from each affected workspace | Zero errors |
| Lint | `npm run lint` from root | Zero NEW errors (pre-existing warnings tolerated) |
| Build | `npm run build` from root | Builds without error |
| Dev smoke | `npm run dev` + curl key routes | 200/expected status |
| Code review | Invoke `code-reviewer` skill on staged diff | No `Critical` findings; `Important` addressed or noted |
| Security audit | Invoke `security-auditor` skill on staged diff | No `Critical` or `High` findings |
| Plan update | Tick this doc | Phase status → `✅ DONE` with commit hash |

The two skills (`.claude/skills/code-reviewer/SKILL.md`, `.claude/skills/security-auditor/SKILL.md`) have monorepo-specific sections that fire on diffs touching `apps/*` or `packages/*`.

---

## Phase status

### Phase 0 — Monorepo skeleton  ✅ DONE
**Commits:** `8dbc92e`, `e095efc` (2026-05-15)

What landed:
- Root `package.json` (npm workspaces: `apps/*`, `packages/*`)
- Root `tsconfig.base.json`
- `apps/student/` holds the entire current Next.js app
- Empty scaffolds for `apps/admin/`, `packages/{data,persona,ui,core}/`
- `.env*` stays at repo root with symlinks from `apps/student/`
- All gates passed (TS clean, build clean, lint clean except pre-existing warnings)

Manual one-time action remaining: **Vercel Project Settings → Root Directory = `apps/student`**. Must happen before next deploy.

---

### Phase 1 — Extract `@canvas/data`  ✅ DONE
**Commit:** `107b0ef` (2026-05-15)
**Goal:** Move the data layer (models, db connection, schemas, taxonomy, id-generator, difficulty utils, shared types) out of `apps/student/lib/` and `apps/student/types/` into `packages/data/`.

**What landed:**
- `packages/data/` populated with 30 model files, `db/mongodb.ts`, taxonomy (data + lookup), schemas (Zod question payload), `id-generator/`, `difficulty.ts`, and `types/books.ts`
- 318 imports rewritten via codemod from `@/lib/...` and `@/types/books` to `@canvas/data/...` subpaths
- `recordAttempt` instance method removed from `UserProgress.ts`; 2 callers inlined to `applyAttemptToProgress(progress, attempt); await progress.save();` — breaks the future `@canvas/data ↔ @canvas/persona` cycle
- `apps/student/next.config.ts` gets `transpilePackages: ['@canvas/data']`
- `apps/student/package.json` adds `"@canvas/data": "*"` dep
- `CLAUDE.md` Key Files table + import-direction rules updated
- `_agents/CRUCIBLE_ARCHITECTURE.md` paths updated (taxonomy lookup, models, recommendation engine), `recordAttempt` references replaced with the new caller pattern
- `packages/data/README.md` documents subpath-first contract

**Audit results (2026-05-15):** 288 imports of these paths from inside `apps/student/`. Zero from `scripts/` (root scripts use raw `mongodb` driver). Cross-imports inside the data set were internal except for three architectural issues that were resolved in this phase.

**Files to move:**
- `apps/student/lib/models/*` → `packages/data/models/`
- `apps/student/lib/mongodb.ts` → `packages/data/db/mongodb.ts`
- `apps/student/lib/taxonomy/` → `packages/data/taxonomy/`
- `apps/student/lib/taxonomyLookup.ts` → `packages/data/taxonomy/lookup.ts`
- `apps/student/lib/schemas/question.ts` → `packages/data/schemas/question.ts`
- `apps/student/lib/questionIdGenerator.ts` → `packages/data/id-generator/index.ts`
- `apps/student/lib/difficultyUtils.ts` → `packages/data/difficulty.ts`
- `apps/student/types/books.ts` → `packages/data/types/books.ts` (~30 importers)

**Sub-tasks before/during file moves:**

1. **Cycle break (must happen first):** `apps/student/lib/models/UserProgress.ts` calls `applyAttemptToProgress` from `@/lib/personaWriter`. After Phase 2, persona lives in `@canvas/persona`, which depends on `@canvas/data` — creating a cycle. Fix: inline `recordAttempt` at its 2 call sites (`app/crucible/actions/progress.ts:98`, `app/api/v2/user/progress/route.ts:149`), remove the `recordAttempt` method from `UserProgress.ts`. Callers switch to `applyAttemptToProgress(progress, attempt); await progress.save();`.

2. **Extract `ActivityLog` from wrapper:** `apps/student/lib/models.ts` holds the live `ActivityLog` model (used by `/api/v2/questions/[id]/stats`). Move it to `packages/data/models/ActivityLog.ts`, then delete `lib/models.ts`.

3. **Co-locate `types/books.ts` with data:** book types are imported by both data models AND ~30 apps/student/ files. Moving them into the data package keeps the contract in one place; consumers update via codemod.

**Import codemod:**
- `from '@/lib/models/...'` → `from '@canvas/data/models/...'`
- `from '@/lib/mongodb'` → `from '@canvas/data/db/mongodb'`
- `from '@/lib/taxonomy/...'` → `from '@canvas/data/taxonomy/...'`
- `from '@/lib/taxonomyLookup'` → `from '@canvas/data/taxonomy/lookup'`
- `from '@/lib/schemas/question'` → `from '@canvas/data/schemas/question'`
- `from '@/lib/questionIdGenerator'` → `from '@canvas/data/id-generator'`
- `from '@/lib/difficultyUtils'` → `from '@canvas/data/difficulty'`
- `from '@/lib/models'` (V1 wrapper) → `from '@canvas/data/models/ActivityLog'`
- `from '@/types/books'` → `from '@canvas/data/types/books'`

**Package configuration:**
- `packages/data/package.json`: `name: "@canvas/data"`, `main: "./index.ts"`, `types: "./index.ts"`, no build step (consumed as TS source).
- `apps/student/next.config.ts`: add `transpilePackages: ['@canvas/data']` so Next compiles the package.
- `apps/student/package.json`: add `"@canvas/data": "*"` to dependencies.

**De-dup check (Phase 1.5):**
- Inline `interface IQuestion` style duplications outside `packages/data/models/`.
- Difficulty thresholds (Easy/Medium/Hard cutoffs) hardcoded outside `difficulty.ts`.
- Places parsing `display_id` with regex instead of using `id-generator` helpers.

---

### Phase 2 — Extract `@canvas/persona`  ✅ DONE
**Commit:** `f7540a1` (2026-05-15)
**Goal:** Move the persona pipeline (writer + profile + recommendation + scoring) into `packages/persona/`. Refined intent (2026-05-15): the package is the **canonical home for the persona contract** — tier rules, mastery thresholds, interpretation helpers, recommendation scoring, and the writers that encode them. Admin won't run the writers, but admin dashboards and future AI training pipelines WILL read documents from `@canvas/data` and interpret them using rules from `@canvas/persona`. If admin re-implemented those rules inline, the read-side and write-side would drift silently.

**What landed:**
- 4 files moved via `git mv` into `packages/persona/` (writer.ts, profile-engine.ts, recommendation-engine.ts, scoring.ts)
- New `packages/persona/contract.ts` — pure read-side: `ALLOWED_TIERS`, `RECENT_ATTEMPTS_CAP`, `MASTERY_THRESHOLDS`, `PROFICIENCY_ORDER`, plus classifiers `resolveConfidenceTier`, `computeChapterMasteryLevel`, `computeProficiencyLevel`, `shouldDropBack`, `dropOneLevel`, `computeDominantWeakness`
- `writer.ts` now imports `RECENT_ATTEMPTS_CAP`, `resolveConfidenceTier`, and `computeChapterMasteryLevel` from contract; the inline mastery if-chain is replaced with the classifier (single source of truth)
- `profile-engine.ts` now imports `PROFICIENCY_ORDER` + the four classifiers from contract; re-exports them for back-compat
- Codemod across `apps/student/` (~12 sites) from `@/lib/{personaWriter,profileEngine,recommendationEngine,questionScoring}` to `@canvas/persona/{writer,profile-engine,recommendation-engine,scoring}`
- `apps/student/next.config.ts`: `'@canvas/persona'` added to `transpilePackages`
- `apps/student/package.json`: `"@canvas/persona": "*"` added
- `packages/persona/package.json`: declares `@canvas/data` dep + `mongoose` peer; subpath exports map
- `apps/student/app/the-crucible/dashboard/utils/calculateAnalytics.ts`: clarifying comment on `getAccuracyLabel` distinguishing it from the persona contract (different concept, intentional non-dedup)
- `packages/persona/README.md` rewritten to describe what landed (was stale)
- TestView.tsx stale comment fixed to reference new path
- Unused `StuckPoint` import dropped from profile-engine.ts
- Writer docblock notes the "caller validates input" contract for future package consumers

**Files to move:**
- `apps/student/lib/personaWriter.ts` → `packages/persona/writer.ts`
- `apps/student/lib/profileEngine.ts` → `packages/persona/profile-engine.ts`
- `apps/student/lib/recommendationEngine.ts` → `packages/persona/recommendation-engine.ts`
- `apps/student/lib/questionScoring.ts` → `packages/persona/scoring.ts`

**Read/write separation (happens during the move, not a separate phase):**
- Identify pure-read code inside the four files: tier-threshold constants, mastery-level cutoffs, label maps, "what does counter X mean" helpers, `resolveConfidenceTier`-like classifiers
- Lift those into `packages/persona/contract.ts` — the file admin dashboards + AI pipelines import
- Keep `applyAttemptToProgress`, `updateProfileFromAttempt`, etc. (true write functions) in their original files; they import constants from `contract.ts` so there's one source of truth
- The package's `index.ts` re-exports read-side from `contract.ts` and points consumers at subpaths for the heavier write functions

**De-dup check:**
- Inline `getUserId` / `isAdmin` in route files (we fixed this once — re-check).
- Code that re-implements tiered confidence resolution outside `resolveConfidenceTier`.
- Mastery-level thresholds (`≥20+80% → 'Mastered'`) duplicated outside persona writer — high priority to consolidate, since the audit step is the natural moment.

**Package configuration:**
- `packages/persona/package.json`: `name: "@canvas/persona"`, `main: "./index.ts"`, depends on `@canvas/data` (peer or workspace dep)
- `apps/student/next.config.ts`: add `'@canvas/persona'` to `transpilePackages`
- `apps/student/package.json`: add `"@canvas/persona": "*"` to dependencies
- No `@/` alias inside the package; relative imports for siblings, `@canvas/data/...` for cross-package

**Cycle prevention:** Phase 1 already broke the data → persona cycle (removed `UserProgress.recordAttempt`). Verify no new cycles introduced during the move: `@canvas/persona` may import `@canvas/data`; `@canvas/data` must NEVER import `@canvas/persona`.

**Note:** No `@canvas/auth` package — admin and student each own their own auth slice per the [admin auth decision](#admin-auth-decision-2026-05-15).

---

### Phase 3a — Extract `@canvas/ui`  ✅ DONE
**Commit:** `00cdc99` (2026-05-16)
**Goal:** Move shared visual components used by both admin and student into `packages/ui/`. Be conservative — move only components verified by grep to be used cross-cuttingly. Feature-local components stay in `apps/student/components/`.

**Audit results (2026-05-16):**
- MathRenderer: 12 importers (7 student, 5 admin) — **moving**
- WaveformAudioPlayer: 2 importers (both student) — **staying in `apps/student/components/`** (not currently shared)
- WatermarkOverlay: 0 importers — **dead code, flagging for separate cleanup** (out of scope)
- ChemicalStructure: 0 importers — **dead code, flagging for separate cleanup** (out of scope)

**Files to move:**
- `apps/student/components/MathRenderer.tsx` → `packages/ui/MathRenderer.tsx`

The package starts deliberately small. Future moves (Phase 5 admin split may surface more shared primitives) will grow it. CLAUDE.md anti-speculation rule wins over the "have we put enough in here yet" instinct.

**Tailwind theme:** **deferred to Phase 5** per decision 2026-05-16. Tokens stay in `apps/student/app/globals.css`. When admin app is scaffolded in Phase 5, extract shared `theme.css` then.

**Package configuration:**
- `packages/ui/package.json`: `name: "@canvas/ui"`, `main: "./index.ts"`, peer deps on `react`, `react-dom`
- `apps/student/next.config.ts`: add `'@canvas/ui'` to `transpilePackages`
- `apps/student/package.json`: add `"@canvas/ui": "*"`

**De-dup check:**
- Inline LaTeX-rendering hacks outside `MathRenderer` — should now route through the package.
- Watermark overlay duplication — there were two copies of the watermark logic before; verify only `WatermarkOverlay` survives.

---

### Phase 3b — Extract `@canvas/core`  ✅ DONE
**Commit:** `f0b510f` (2026-05-16)
**Goal:** Move cross-cutting server-side platform utilities (rate-limit, latex utils, redirect validation, analytics, R2 storage, generic utils) into `packages/core/`.

**Follow-up flagged for separate commit:**
- `packages/core/r2-storage.ts` is missing `import 'server-only'` and `apps/student/app/crucible/components/QuestionAdmin.tsx` (a `'use client'` component) imports `uploadToR2` from it. Pre-existing bug surfaced by package boundary. Fix requires migrating the admin upload flow to a server route (`POST /api/v2/assets/upload` already exists); not in scope for the rename phase.
- `packages/core/r2-storage.ts:32` exports a placeholder `r2Client` that looks like dead code; audit + remove in follow-up.
- `packages/core/r2-storage.ts:153` leaks `error.message` to client — pre-existing §8.5 violation.

**Files to move:**
- `apps/student/lib/rateLimit.ts` → `packages/core/rate-limit.ts`
- `apps/student/lib/latexValidator.ts` → `packages/core/latex-validator.ts`
- `apps/student/lib/redirectValidation.ts` → `packages/core/redirect-validation.ts`
- `apps/student/lib/analytics/*` → `packages/core/analytics/`
- `apps/student/lib/r2Storage.ts` → `packages/core/r2-storage.ts`
- `apps/student/lib/utils.ts` → `packages/core/utils.ts`

**Package configuration:**
- `packages/core/package.json`: `name: "@canvas/core"`, `main: "./index.ts"`, peer deps as required (e.g. `@aws-sdk/client-s3` for R2)
- `apps/student/next.config.ts`: add `'@canvas/core'` to `transpilePackages`
- `apps/student/package.json`: add `"@canvas/core": "*"`

**Cycle prevention:** `@canvas/core` is leaf-status (no other-package deps). `@canvas/data`, `@canvas/persona`, and apps may import from `@canvas/core`. `@canvas/core` must NEVER import from `@canvas/data` or `@canvas/persona`.

**De-dup check:**
- Date formatting / time-ago helpers — likely duplicated in components.
- Inline `clsx`-style class-name composition without using `cn()` from `utils.ts`.

---

### Phase 4 — Reorganize `apps/student/` into `features/*` slices  ✅ DONE
**Commits:** `03f02af`, `973a47b`, `4785b89`, `af1480c`, `39ae825`, `7bde6af`, `6f32451`, `d77b029`, `8e5356d`, `0f19fda`, `db21fac`, `04c377a`, `675d01b` (2026-05-16, 13 commits)

**Outcome:**
- 12 feature folders created under `apps/student/features/`: legal, auth, blog, flashcards, career-explorer, college-predictor, notes, books, simulations, public-content, crucible, landing
- ~500 file renames across 12 feature commits
- Next.js routing files (page.tsx, layout.tsx, route.ts) kept under `app/` per Next.js convention; imports rewritten to point at `@/features/<feature>/...`
- Each feature has a `README.md` documenting its routes, slot structure, and cross-feature dependencies
- Each feature has an `index.ts` declaring its public surface (no `export *`)
- tsc clean across apps/student + 4 packages; lint baseline preserved; `npm run build` clean; dev smoke confirms 14/15 sampled routes return 200 (`/books` 404 is correct — no top-level page exists, only `[bookSlug]/[pageSlug]`)

**Deferred for follow-up (out of Phase 4 scope):**
- Inline route-local `.tsx` files (under `app/<route>/<X>.tsx`) for simulators (organic-chemistry-hub, physical-chemistry-hub, salt-analysis, etc.) and public-content routes stay in place. They're conceptually feature-local already; relocating them adds polish but not load-bearing structure. Per-feature READMEs flag this.
- Two parallel `Question` interfaces inside `features/crucible/` (camelCase shape in `types.ts`, V2 schema shape in `components/types.ts`) — pre-existing situation, consolidation is its own task.
- Site chrome (`Navbar.tsx`, `Footer.tsx`, `ConditionalFooter.tsx`, `BreadcrumbSchema.tsx`, analytics components) stays at `app/components/` for now. Could be promoted to `apps/student/components/` in a Phase 4.+ commit if desired.

**Code-reviewer + security-auditor skills:** deferred to Phase 4.+ batch review (current Phase 4 commits are pure file moves + import codemod; risk surface is limited to TypeScript correctness and runtime imports which the build verifies). Will run before Phase 5 starts since admin extraction depends on `features/crucible/components/admin/` being in its final shape.
**Goal:** Group feature implementation code under `apps/student/features/`. Next.js routing files (`page.tsx`, `layout.tsx`, `route.ts`) MUST stay under `apps/student/app/` per Next.js convention; their imports redirect to `@/features/<feature>/...`. The result: app routes are thin loaders + metadata; features are implementation homes.

**Audit (2026-05-16):** 60 top-level app routes, 30 components, 30 lib files. 12 features identified.

**Feature folder contract (slots used as needed, never speculative):**
```
features/<feature>/
├── components/       — React components (client + server)
├── lib/              — Feature-local utilities, data helpers, business logic
├── hooks/            — React hooks specific to this feature
├── data/             — Static data (JSON, constants)
├── types.ts          — Feature-local TS types
├── schemas/          — Zod schemas (where applicable)
├── server-actions/   — Server actions
├── seo.ts            — Metadata helpers (where applicable)
├── __tests__/        — Tests (added in Phase 6)
├── README.md         — Feature documentation
└── index.ts          — Public surface
```

**Feature mapping:**

| Feature | App routes |
|---|---|
| `legal` | `about/`, `privacy/`, `terms/` |
| `auth` | `auth/`, `login/`, `account/` |
| `blog` | `blog/`, `blog/[slug]/` |
| `flashcards` | `chemistry-flashcards/` |
| `career-explorer` | `career-explorer/` + sub-routes |
| `college-predictor` | `college-predictor/` + sub-routes |
| `notes` | `handwritten-notes/`, `handwritten-notes/[chapter]/` |
| `books` | `books/`, `live-books/`, `class-9/`, `class-10/`, `class-11/`, `class-12/`, `cbse-class-10/`, `cbse-class-11/`, `cbse-class-12/` |
| `simulations` | `organic-wizard/`, `salt-analysis/`, `solubility-product-ksp-calculator/`, `chemihex/`, `inorganic-chemistry-hub/`, `organic-chemistry-hub/`, `physical-chemistry-hub/`, `organic-name-reactions/`, `periodic-trends/`, `interactive-periodic-table/`, `physics/` |
| `public-content` | `2-minute-chemistry/`, `assertion-reason/`, `bitsat-chemistry-revision/`, `chemistry-questions/`, `detailed-lectures/`, `download-ncert-books/`, `jee-main-pyqs/`, `jee-pyqs/`, `ncert-solutions/`, `neet-crash-course/`, `one-shot-lectures/`, `quick-recap/`, `quiz/`, `top-50-concepts/` |
| `crucible` | `the-crucible/`, `crucible/`, `crucible/admin/` |
| `landing` | root `page.tsx`, landing-specific components in `app/components/` |

**What stays at `apps/student/` top-level (cross-feature shared):**
- `lib/auth.ts`, `lib/bookAuth.ts`, `lib/supabase.ts`, `lib/rbac.ts` — auth utilities used by every feature
- `lib/uploadUtils.ts`, `lib/chemAssets.ts` — cross-feature helpers
- `lib/schemas/` — generic Zod schemas
- `components/Navbar.tsx`, `components/Footer.tsx`, `app/components/AuthButton.tsx` — site chrome
- `app/components/BreadcrumbSchema.tsx`, `CloudflareAnalytics.tsx`, `GoogleAnalytics.tsx` — site-level SEO + analytics
- `app/sitemap.ts`, `app/robots.ts`, `app/layout.tsx`, `app/globals.css` — site-level Next.js config

**Execution order (each feature = one commit, smallest first to validate the pattern):**

1. Phase 4.1 — `features/legal`
2. Phase 4.2 — `features/auth`
3. Phase 4.3 — `features/blog`
4. Phase 4.4 — `features/flashcards`
5. Phase 4.5 — `features/career-explorer`
6. Phase 4.6 — `features/college-predictor`
7. Phase 4.7 — `features/notes`
8. Phase 4.8 — `features/books`
9. Phase 4.9 — `features/simulations`
10. Phase 4.10 — `features/public-content`
11. Phase 4.11 — `features/crucible` (largest)
12. Phase 4.12 — `features/landing` (highest-traffic, saved for last)

After all 12 features land, one comprehensive `code-reviewer` + `security-auditor` skill review over the full Phase 4 diff. Findings addressed in a follow-up commit.

**Per-feature workflow:** scaffold → git mv → codemod imports → tsc + lint + build + dev smoke → commit. Skill review batched at end (cost vs benefit at 12 features).

**De-dup check (after all features land):**
- Cross-feature shared components — promote to `apps/student/components/` (or `@canvas/ui` if cross-app).
- SEO `metadata` scaffolding — common pattern; extract a builder if 5+ repeats.
- Pagination, filter dropdowns, breadcrumbs — likely 3+ copies.

---

### Phase 5 — Split admin out into `apps/admin/`  ✅ DONE
**Goal:** Move admin UI + admin write APIs into a separate Next.js app deploying to `admin.canvasclasses.in`, separated from student.

**Outcome:** Admin app at `apps/admin/`, deployed independently. Initial admin auth landed as **Shape A** (Supabase + `ADMIN_EMAILS`) rather than the originally-planned Shape B — see [ADR-003](./adr/003-admin-auth-shape-a-first.md) for the deferral rationale. The DI seam from Phase 6.0 means Shape B becomes a future drop-in without touching `@canvas/services`.

**Sub-phases:**
- 5.0 — Decisions confirmed (subdomain `admin.canvasclasses.in`, in-app API not cross-origin, Shape A auth)
- 5.1 — Scaffolded `apps/admin/` Next.js shell
- 5.2 — Moved admin auth + middleware into apps/admin/
- 5.3 — Moved admin components to apps/admin/features/admin/
- 5.4 — Moved admin route shells to apps/admin/app/
- 5.5 — Moved admin API routes, split MIXED routes (mock-tests, careers, questions admin sub-routes)
- 5.6 — Resolved cross-feature edges (flashcards data, books renderer)
- 5.7 — Cleanup student app + feature READMEs
- 5.8 — Verification gates passed (TSC + lint both apps)
- 5.10 — code-reviewer skill on full diff (findings addressed in 5.11)
- 5.11 — security-auditor skill — addressed H1 (open-redirect via backslash) by using `sanitizeRedirect` from `@canvas/core/redirect-validation`
- 5.12 — Final docs sync (CLAUDE.md, ARCHITECTURE.md, READMEs, memory)
- 5.13a-d — Consolidated helper-level duplicates into shared packages (`@canvas/data/flashcards`, `@canvas/ui/flashcardMarkdown`, `@canvas/data/books`, `@canvas/data/rbac`)
- 5.5d — MongoDB user permission split DEFERRED until prod stability
- 5.9 — Manual smoke test OWNED BY USER

**See:** [ADR-002](./adr/002-admin-app-split.md), [ADR-003](./adr/003-admin-auth-shape-a-first.md)

---

### Phase 6 — Service-layer extraction, ADRs, docs  ✅ DONE
**Goal:** Eliminate the last must-stay-in-lockstep duplication between apps; record the architectural decisions made during the migration; refresh CLAUDE.md to match end-state.

**Sub-phases:**
- 6.0 — Service-layer extraction (commit `84b3afa`): nine duplicated route handlers extracted into `@canvas/services`, each app's route.ts reduced to a ~10-line wrapper. Net -1,629 lines. [ADR-001](./adr/001-service-layer-di-pattern.md).
- 6.1 — code-reviewer skill on 6.0 (commit `3d93e70`): fixed three findings — student `export/ppt` wrapper was missed; `taxonomy-load.ts` was leaking `error.message`; README named-export drift.
- 6.2 — Architecture Decision Records: created `_agents/adr/` with ADR-001 through ADR-004 covering the service-layer pattern, admin-app split, Shape A auth, and package boundary rules.
- 6.3 — Refresh CLAUDE.md, plan doc, auto-memory for end-of-migration state.

**Deferred from original Phase 6 scope (not blockers):**
- Vitest scaffolding and smoke-import tests — not blocking; defer to a separate ticket when tests are actually being added.
- Repo-root `MONOREPO.md` developer onboarding doc — superseded by the new ADR set + existing CLAUDE.md §7.

---

## Open decisions

These shape one or more phases. When answered, move the answer here AND update the affected phase section.

### Subdomain  `[TBD]`
**Working assumption:** `admin.canvasclasses.in`
**Affects:** Phase 5 deployment
**Once decided:** update Phase 5 Deployment subsection.

### API route split rule  `[TBD]`
**Working assumption:** admin owns its own writes (`POST /questions`, `/taxonomy/save`, `/admin/*`); student owns reads + user-state writes (`/user/progress*`, `/test-results`, `GET /questions`).
**Affects:** Phase 5 — which route files move.
**Alternative:** keep all `/api/v2/*` in student, admin calls them via fetch.

### Concurrent feature work  `[TBD]`
**Working assumption:** no parallel feature PRs against `main` during migration. If yes, we rebase the refactor branch on `main` between phases.

### Test file convention  `[TBD]`
**Working assumption:** `__tests__/` folder mirroring source tree, `.test.ts` / `.test.tsx` suffix.
**Affects:** Phase 6 setup. Locked when Phase 6 starts.

---

## Decision log

> Many of these have been promoted into immutable ADRs under [`_agents/adr/`](./adr/). The entries below are kept for chronological reference; ADRs are the canonical source going forward.

### Admin auth shape — revised to Shape A (2026-05-15, revised 2026-05-16)
**Shipped as Shape A: Supabase auth + `ADMIN_EMAILS` allow-list.** The original Shape B plan (custom email + password + bcrypt + JWT + `admin_accounts` MongoDB collection) was deferred to a post-migration phase to bound the migration's risk surface. The DI seam introduced by Phase 6.0 means Shape B becomes a future swap of `apps/admin/lib/auth.ts` + `apps/admin/lib/adminAuth.ts` without touching `@canvas/services`.
**See:** [ADR-003](./adr/003-admin-auth-shape-a-first.md)

### Service-layer extraction (2026-05-16)
Nine duplicated `/api/v2/*` route handlers extracted into a new `@canvas/services` package. Each app's route file is a thin wrapper that injects its app-local auth helpers via a `ServiceDeps` dependency-injection seam. Closes the last lockstep-duplication tax from the admin-app split.
**See:** [ADR-001](./adr/001-service-layer-di-pattern.md)

### Package boundary rules formalized (2026-05-16)
Four explicit rules — no cross-app imports, no app imports from packages, no `@/` alias in packages, subpath exports for service surface. Enforced via code review and the `code-reviewer` skill's monorepo section.
**See:** [ADR-004](./adr/004-package-boundary-rules.md)

### Admin-app split rationale (2026-05-15)
Admin runs as its own Next.js app at `admin.canvasclasses.in` with its own copy of every API route it needs. Cross-origin API (admin calls student-hosted `api.canvasclasses.in`) was explicitly rejected because it would defeat the network-isolation goal.
**See:** [ADR-002](./adr/002-admin-app-split.md)

### Package count = 4 (2026-05-15)
Confirmed during architecture review: `data`, `persona`, `ui`, `core`. Earlier proposal of `auth` package dropped because each app owns its own auth.

### Package manager = npm (2026-05-15)
**Stay on npm workspaces.** Already wired in Phase 0; switching mid-migration adds risk (new lockfile, Vercel build settings, possible Next 15 + pnpm hoisting issues) without proportional benefit at our size (2 apps, 4 packages). pnpm's wins (faster install, stricter dep hygiene) kick in at ~15–20 packages; we have 5. Reassess post-migration if pain emerges; no architectural lock-in.

### Migration cadence = per-phase ship (2026-05-15)
**Each phase commits + deploys before the next starts.** Smaller blast radius, easier to bisect regressions, plan doc stays in sync with prod. Cost: more deploy cycles — acceptable.

### Tests framework = deferred to Phase 6 (2026-05-15)
**Don't pick now.** Phases 1–5 are pure code moves with no new test coverage. Vitest remains the working assumption for Phase 6 but is not locked. Decision made when Phase 6 starts.

### Legacy duplicate hubs = keep as-is during migration (2026-05-15)
**Move `chemistry-questions/`, `jee-pyqs/`, `quiz/`, `top-50-concepts/`, `quick-recap/`, `2-minute-chemistry/` into `apps/student/features/public-content/` unchanged.** Migration ≠ cleanup. SEO + inbound links preserved. Delete-vs-redirect decision is a separate post-migration task.

---

## Cross-references

- Domain reference: [`_agents/CRUCIBLE_ARCHITECTURE.md`](./CRUCIBLE_ARCHITECTURE.md) — persona pipeline, tiered counter contract, invariants
- Project rules: [`/CLAUDE.md`](../CLAUDE.md) — security rules (§8), import direction (§7), canonical paths
- Historical refactor record: memory at `architecture_refactor_2026-05.md` (auto-memory, not committed)
- Code review skill: [`.claude/skills/code-reviewer/SKILL.md`](../.claude/skills/code-reviewer/SKILL.md) — has a Monorepo section
- Security audit skill: [`.claude/skills/security-auditor/SKILL.md`](../.claude/skills/security-auditor/SKILL.md) — has a Monorepo section
