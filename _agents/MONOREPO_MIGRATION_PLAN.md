# Monorepo Migration Plan

**Status:** Living document. Every agent or developer returning to the migration reads here first.
**Branch:** `code-refactor`
**Started:** 2026-05-15

This is the canonical tracker. If anything contradicts it, this wins; fix the doc rather than diverging.

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

### Phase 1 — Extract `@canvas/data`  ⏳ PENDING
**Goal:** Move the data layer (models, db connection, schemas, taxonomy, id-generator, difficulty utils) out of `apps/student/lib/` into `packages/data/`, updating ~150+ import statements.

**Files to move:**
- `apps/student/lib/models/*` → `packages/data/models/`
- `apps/student/lib/mongodb.ts` → `packages/data/db/mongodb.ts`
- `apps/student/lib/taxonomy/` → `packages/data/taxonomy/`
- `apps/student/lib/taxonomyLookup.ts` → `packages/data/taxonomy/lookup.ts`
- `apps/student/lib/schemas/question.ts` → `packages/data/schemas/question.ts`
- `apps/student/lib/questionIdGenerator.ts` → `packages/data/id-generator/index.ts`
- `apps/student/lib/difficultyUtils.ts` → `packages/data/difficulty.ts`

**Files to delete:**
- `apps/student/lib/models.ts` (V1 legacy — verify no live callers first)

**Import codemod:** every `from '@/lib/models/...'` → `from '@canvas/data/models/...'` etc.

**De-dup check:**
- Inline `interface IQuestion` style duplications outside of `packages/data/models/` — should now use the shared model interfaces.
- Difficulty thresholds (Easy/Medium/Hard cutoffs) hardcoded anywhere outside `difficulty.ts`.
- Places parsing `display_id` with a regex instead of using `id-generator` helpers.

**Open question:** Confirm package name `@canvas/data` vs alternative scoped name.

---

### Phase 2 — Extract `@canvas/persona`  ⏳ PENDING
**Goal:** Move the persona pipeline (writer + profile + recommendation + scoring) into `packages/persona/`.

**Files to move:**
- `apps/student/lib/personaWriter.ts` → `packages/persona/lib/persona-writer.ts`
- `apps/student/lib/profileEngine.ts` → `packages/persona/lib/profile-engine.ts`
- `apps/student/lib/recommendationEngine.ts` → `packages/persona/lib/recommendation-engine.ts`
- `apps/student/lib/questionScoring.ts` → `packages/persona/lib/question-scoring.ts`

**De-dup check:**
- Inline `getUserId` / `isAdmin` in route files (we fixed this once — re-check).
- Code that re-implements tiered confidence resolution outside `resolveConfidenceTier`.
- Mastery-level thresholds (`≥20+80% → 'Mastered'`) duplicated outside persona writer.

**Note:** No `@canvas/auth` package — admin and student each own their own auth slice per the [admin auth decision](#admin-auth-decision-2026-05-15).

---

### Phase 3 — Extract `@canvas/ui` + `@canvas/core`  ⏳ PENDING
**Goal:** Move shared visual components into `packages/ui/` and cross-cutting platform code into `packages/core/`.

**`@canvas/ui`:**
- `apps/student/components/MathRenderer.tsx` → `packages/ui/components/MathRenderer.tsx`
- `apps/student/components/WaveformAudioPlayer.tsx` → ...
- `apps/student/components/WatermarkOverlay.tsx` → ...
- `apps/student/components/ChemicalStructure.tsx` → ...
- Tailwind preset extracted to `packages/ui/tailwind-preset.ts`

**`@canvas/core`:**
- `apps/student/lib/rateLimit.ts` → `packages/core/rate-limit/`
- `apps/student/lib/latexValidator.ts` → `packages/core/latex-utils/`
- `apps/student/lib/redirectValidation.ts` → `packages/core/redirect-validation/`
- `apps/student/lib/analytics/*` → `packages/core/analytics/`
- `apps/student/lib/r2Storage.ts` → `packages/core/r2-storage/`
- `apps/student/lib/utils.ts` → `packages/core/utils.ts`

**De-dup check:**
- Empty states, loading skeletons, error boundaries — are there 5 copies of "no data" UI in `apps/student/`?
- "Card" components — should be one in `packages/ui/`.
- Date formatting / time-ago helpers.

---

### Phase 4 — Reorganize `apps/student/` into `features/*` slices  ⏳ PENDING
**Goal:** Group routes by feature inside `apps/student/features/`. Page files become thin re-exports.

**Feature slices to create:**
- `features/crucible/` — `BrowseView`, `TestView`, `AdaptiveSession`, `actions.ts`
- `features/notes/` — handwritten-notes + books
- `features/simulations/` — organic + inorganic + physical hubs, salt-analysis, KSP
- `features/flashcards/`
- `features/career-explorer/`
- `features/college-predictor/`
- `features/blog/`
- `features/landing/`
- `features/account/`
- `features/public-content/` — `chemistry-questions/`, `jee-pyqs/`, `quiz/`, `top-50-concepts/`, `quick-recap/`, `2-minute-chemistry/` (moved as-is per [legacy hubs decision](#legacy-duplicate-hubs--keep-as-is-during-migration-2026-05-15))

**Each feature folder follows the contract:** `components/`, `lib/` (or `lib.ts`), `types.ts`, `seo.ts`, `__tests__/`, `index.ts`, `README.md` — slots optional, scale to feature size.

**De-dup check (BIG ONE):**
- Across feature pairs — what do they share? (Notes + Crucible both render question cards; Notes + Simulations both render NCERT chapter structure.)
- SEO scaffolding — common pattern across `seo.ts` files; extract a builder.
- Pagination components, filter dropdowns, breadcrumbs — likely 3+ copies.

---

### Phase 5 — Split admin out into `apps/admin/`  ⏳ PENDING (HIGH RISK)
**Goal:** Move `apps/student/app/crucible/admin/` + admin-only API routes into `apps/admin/`, with the admin app deploying separately. New custom admin auth lands here.

**Routes to move into `apps/admin/`:**
- `apps/student/app/crucible/admin/*` → `apps/admin/app/crucible/*`
- `apps/student/features/crucible/` (admin sub-features only, e.g. question-admin) → `apps/admin/features/`
- Admin-only API routes: [TBD — see API split decision](#api-route-split-rule-tbd)

**Admin auth (per [decision](#admin-auth-decision-2026-05-15)):** Shape B — email + password, `admin_accounts` MongoDB collection, super-admin-managed, **not** Supabase. Custom JWT cookie. RBAC via merged `admin_accounts` collection (replaces `UserRole`).

**Deployment:**
- New Vercel project: root directory `apps/admin/`, domain `[TBD — see subdomain decision]`
- No shared cookie domain (admin auth is independent of student Supabase auth)

**De-dup check:**
- Anything in both apps that should be in `packages/`? Common culprits: layout shells, theme providers, error boundaries, providers, middleware helpers.

---

### Phase 6 — Tests, docs, ADR  ⏳ PENDING
**Goal:** Test scaffolding in place, documentation rewritten, decisions recorded.

**Tasks:**
- Add `vitest.workspace.ts` at root + per-app/package `vitest.config.ts`
- Smoke test per package (just `import * as foo from '@canvas/foo'` to verify wiring)
- CI workflow: `npm ci && npm test && npm run build` (npm workspaces per [package manager decision](#package-manager--npm-2026-05-15))
- Rewrite `CLAUDE.md` for new paths
- New `MONOREPO.md` (developer onboarding) at repo root
- ADR documenting the split

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

### Admin auth decision (2026-05-15)
**Shape B — custom email + password, MongoDB-backed.**
- New `admin_accounts` collection: `{ email, password_hash, role, status, accessible_subjects, accessible_chapters, created_by, created_at, last_login_at }`
- Replaces the existing `UserRole` collection (merged into `admin_accounts`)
- Super admin creates accounts (no self-signup)
- bcrypt for hashing, JWT for session
- **No Supabase RBAC** — Supabase auth + RLS don't apply because admin requests carry our own JWT, and admin data lives in MongoDB (Supabase can't see it).
- Existing custom `rbac.ts` stays; reads from `admin_accounts` instead of `UserRole` after migration.
- Phase 5 task. Implementation specifics deferred to that phase.

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
