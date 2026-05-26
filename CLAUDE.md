# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 0. BEFORE YOU CODE — REQUIRED FOR ALL TASKS

Before writing any code or running any script:

1. **State assumptions explicitly.** If a request could mean two things (e.g., "fix the question UI" — which component?), name both interpretations and ask.
2. **Name the invariants you'll preserve** when touching Crucible-governed paths (`apps/student/app/the-crucible/`, `apps/student/app/api/v2/`, `apps/student/features/crucible/`, `packages/persona/`). Example: "I will not touch `server-actions/the-crucible.ts` outside the broken function."
3. **For any script writing to `questions_v2`:** state how many documents will be affected and what the rollback is, before running.

If uncertain about scope, stop and ask. Do not pick silently.

---

> **Before changing anything inside `apps/student/app/the-crucible/`, `apps/student/app/api/v2/`, `apps/student/features/crucible/`, `apps/admin/app/admin/`, `apps/admin/app/api/v2/`, `apps/admin/features/admin/`, `packages/data/models/UserProgress.ts`, `packages/data/models/StudentChapterProfile.ts`, `packages/persona/`, or `packages/data/models/ResourceLink.ts` — read [`_agents/CRUCIBLE_ARCHITECTURE.md`](_agents/CRUCIBLE_ARCHITECTURE.md).** It is the canonical reference for Crucible's structure, the persona pipeline, the recommendation bridge, and the invariants that must not be broken. If anything in this file or in code comments contradicts it, that document wins; the fix is to update the doc, never to silently diverge.

---

## 1. PROJECT OVERVIEW

**Crucible** is a JEE/NEET question bank and adaptive practice platform built for Canvas Classes — covering Chemistry, Physics, Maths, and Biology.

- **Framework**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Database**: MongoDB Atlas (questions, taxonomy, audit logs)
- **Auth**: Supabase (user accounts, session management). Super admin tier defined in `SUPER_ADMIN_EMAILS` env var; staff defined in `user_access` collection (see §7 RBAC).
- **Assets**: Cloudflare R2 (`canvas-chemistry-assets` bucket)

### Monorepo layout (as of Phase 5)

The codebase is split into two Next.js apps in an npm workspace:

| App | Host | Purpose |
|---|---|---|
| `apps/student/` | `canvasclasses.in` | Public student-facing site — `/the-crucible/*`, `/books/*`, `/class-*`, blog, public APIs |
| `apps/admin/` | `admin.canvasclasses.in` | Operator console — `/` (landing), `/crucible` (question editor), `/flashcards`, `/blog`, `/books`, `/taxonomy`, `/career-explorer`, `/dashboard`, `/preview`, admin write APIs |

Both apps share `@canvas/{core,data,persona,services,ui}` packages from `packages/*`. **Neither app may import from the other** — workspace-level boundary enforced by tsc.

The admin app's API surface (under `apps/admin/app/api/v2/*`) hosts:
- Admin-write methods extracted from formerly-mixed routes (mock-tests, career-explorer/careers, career-explorer/questions write halves)
- 1:1 admin-only routes (ai/*, taxonomy/save, books/* admin methods, career-explorer/{matches,questions/[id]}, questions admin sub-routes, blog/*, admin/{permissions,roles,revalidate,debug/sentry})
- Thin wrappers over `@canvas/services` for the nine routes both apps host (questions, questions/[id], flashcards, flashcards/[id], chapters, taxonomy/load, assets/[id], assets/upload, export/ppt). Each wrapper imports the service function and injects its app-local auth helpers — see [ADR-001](_agents/adr/001-service-layer-di-pattern.md).

### Active System: V2

There are two versions of the question system. **V2 is the only active system.** Do not write to or create anything in V1.

| | V1 (Legacy — do not use) | V2 (Active) |
|---|---|---|
| Admin panel | `/the-crucible/admin/` | `admin.canvasclasses.in/crucible` |
| API | `/api/questions/` | `apps/student/app/api/v2/` (public/student reads + writes), `apps/admin/app/api/v2/` (admin writes) |
| Mongoose model | (deleted — V1 retired) | `packages/data/models/Question.v2.ts` |
| Collection | `questions` | `questions_v2` |
| Question IDs | Auto-increment strings | UUID v4 + `display_id` (e.g. `ATOM-042`) |

**Student-facing UI** lives at `/the-crucible/` (route shell at `apps/student/app/the-crucible/`) and reads from V2 via server actions in `apps/student/features/crucible/server-actions/the-crucible.ts`.

**Admin UI** lives on the admin app at `admin.canvasclasses.in`. The landing at `/` is a card-grid of all operator panels; `/crucible` is the question editor (route shell at `apps/admin/app/crucible/`); other panels are flat siblings (`/flashcards`, `/blog`, `/books`, `/taxonomy`, `/career-explorer`, `/dashboard`, `/preview`). Components live in `apps/admin/features/admin/components/`. Admin pages call same-origin `/api/v2/*` routes, all served by the admin app. **The admin app never crosses into student-origin** — that boundary is the point of the Phase 5 split. See [ADR-002](_agents/adr/002-admin-app-split.md) and [ADR-005](_agents/adr/005-admin-url-flatten-and-landing.md).

---

## 2. DATABASE

- **Cluster**: `crucible-cluster`
- **Database name**: `crucible`
- **Active question collection**: `questions_v2`
- **Connection**: via `MONGODB_URI` env var only — never hardcoded anywhere in source code
- **Other collections**: `chapters`, `assets`, `auditlogs`, `userprogress`

> The word "canvas" appears only in the R2 bucket name (`canvas-chemistry-assets`). There is **no** "canvas" database. Never reference a "canvas" database.

Required env vars (all in `.env.local`, never committed):

```
MONGODB_URI=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPER_ADMIN_EMAILS=...
```

---

## 3. QUESTION INGESTION — READ THIS FIRST

### Single Source of Truth

**All question ingestion must follow the canonical workflow doc for the subject:**

| Subject | Workflow doc |
|---|---|
| Chemistry | [`_agents/workflows/QUESTION_INGESTION_WORKFLOW.md`](_agents/workflows/QUESTION_INGESTION_WORKFLOW.md) |
| Physics | [`_agents/workflows/PHYSICS_QUESTION_INGESTION_WORKFLOW.md`](_agents/workflows/PHYSICS_QUESTION_INGESTION_WORKFLOW.md) |
| Math | [`_agents/workflows/MATH_QUESTION_INGESTION_WORKFLOW.md`](_agents/workflows/MATH_QUESTION_INGESTION_WORKFLOW.md) |
| Biology | [`_agents/workflows/BIOLOGY_QUESTION_INGESTION_WORKFLOW.md`](_agents/workflows/BIOLOGY_QUESTION_INGESTION_WORKFLOW.md) |

All three docs share an **identical canonical exam-metadata block** (`applicableExams`, `sourceType`, `examDetails` with per-exam shape table + canonical mappings for JEE Main / JEE Advanced / NEET). Subject-specific differences live only in LaTeX rules, question-nature decision-tree examples, and chapter/prefix tables. When any doc conflicts with anything else (including this file), the workflow doc wins.

LaTeX rules, ID generation, PYQ metadata conventions, and security/secret-handling
practices are documented inline in this file — see §4 (LaTeX), §4.5 (canonical
field names), §8 (security rules), and the workflow docs above for ingestion
specifics.

### Automation Pipeline

**The automation pipeline has been permanently deleted.** Do not reference it, recreate it, or suggest using it. All ingestion is done via hand-written batch scripts in `scripts/` following the canonical template in the workflow document.

### Anti-Hallucination Rule (Rule 0)

> Before extracting any question, perform an image verification gate: quote the first 8 words of the question verbatim from the source image. If you cannot quote them, stop and flag the image as illegible. Never generate question content from chemistry training knowledge. If uncertain whether text came from the image or training knowledge, write `NEEDS_REVIEW: [reason]` in that field. Never fabricate. Never run a fake audit.

### Display ID Prefixes

Display ID prefixes are defined per subject in the workflow docs and frozen in [`scripts/insert_questions.js`](scripts/insert_questions.js)'s `PREFIX_TO_CHAPTER` map:

- Chemistry (e.g. `ATOM`, `MOLE`, `SALT`, `GOC`) — see chemistry workflow
- Physics (e.g. `MIP`, `UNIT`, `K1D`, `NLM`, `SHM`, `ELST`) — see physics workflow
- Math (e.g. `QUAD`, `CMPL`, `MTRX`, `LIMS`, `DFIN`, `PROB`) — see math workflow
- Biology (e.g. `CUOL`, `MBIH`, `PIVR`, `EVOL`, `HMRP`, `BTPP`) — see biology workflow

Those files are the single source of truth and must not be duplicated here.

### Canonical Batch Script Pattern

Scripts go in `scripts/`, named `insert_{chapter}_b{N}.js`. Each script:
1. Loads `MONGODB_URI` from `.env.local` via `dotenv`
2. Queries `questions_v2` to find the current max `display_id` before assigning new ones
3. Checks for duplicate `display_id` values before inserting
4. Uses `uuidv4()` for `_id` — never `new ObjectId()`
5. Sets `deleted_at: null`, `status: 'published'` on all new documents
6. Disconnects after completion

Never use `node -e "..."` for scripts containing LaTeX — shell escaping corrupts backslashes. Always write a `.js` file and run `node scripts/file.js`.

---

## 3.5 SOLUTION GENERATION — DIFFERENT WORKFLOW FROM INGESTION

§3 covers **adding new questions** to the bank. Writing **solutions** for questions that are already in the bank is a separate workflow with its own canonical doc and toolkit.

For **math solutions**:

- **Canonical workflow doc**: [`_agents/workflows/math-solution-workflow.md`](_agents/workflows/math-solution-workflow.md). Read this first. It defines the teacher-style "starting it right" philosophy, the 6-section solution structure (🧠 Reading the Question, 🖼️ Visual Sketch, 🗺️ Working It Out, ⚡ The Smart Move, 💡 A Different Angle, ⚠️ Where Students Get Stuck), the plain-English voice rules for tier-2/3 town students, the option-independent shortcut requirement, and the answer-verification protocol. A complete worked example lives at the bottom of the doc — agents should read it before writing their first solution.
- **Toolkit**: [`scripts/math-solutions/`](scripts/math-solutions/). Three Node scripts (`fetch-batch.js`, `apply-batch.js`, `audit.js`) plus a [README](scripts/math-solutions/README.md) with the kickoff prompt and per-batch flow. All toolkit paths are pre-approved in `.claude/settings.local.json`, so the agent can run them without permission prompts.
- **Flag file**: any question that can't be solved (corrupt question text, missing radius, no option matches derivation) goes into `_agents/solution-flags/<PREFIX>-flags.md` via `force_flag` — never hand-wave a derivation to fit the stored option.
- **Skill**: the `math-solution-writer` skill bundles this whole flow. Invoke it via `/math-solution-writer` or trigger by asking for math solutions.

For Chemistry and Physics solutions, follow `chemistry-solution-workflow.md` and `physics-solution-workflow.md` respectively (parallel structure; the math doc is the most polished and is the model the others will catch up to). For Biology solutions, follow [`_agents/workflows/biology-solution-workflow.md`](_agents/workflows/biology-solution-workflow.md) — same 6-section structure but section 3 is `📖 NCERT Reference` instead of `🗺️ Working It Out`, and there's no LaTeX (biology questions are text + images, not derivations). See [ADR-008](_agents/adr/008-biology-subject-addition.md) for the design decisions behind the biology subject addition.

---

## 4. LATEX RULES — QUICK REFERENCE

| Rule | Correct | Wrong |
|---|---|---|
| Math delimiters | `$...$` only | `$$...$$` — never use double dollar |
| Chemical formulas | `\ce{H2SO4}`, `\ce{Fe^{2+}}` | `H_2SO_4`, `\mathrm{H2O}` |
| Fractions | `\frac{a}{b}` | `\dfrac{a}{b}` — causes oversized render |
| Arrows | `$\rightarrow$`, `$\rightleftharpoons$` | Raw Unicode `→` outside `$` |
| Greek letters | `$\Delta$`, `$\alpha$`, `$\beta$`, `$\pi$`, `$\theta$` | `Δ`, `α` outside `$` |
| Units | Outside math: `25 °C`, `mol/L` | Unitless math expressions |
| JSON escaping | `\\\\frac`, `\\\\Delta` (four backslashes) | `\\frac` (two) |

Spacing rules:
- Always add a space before and after `$`: `the value $ x = 5 $ is`
- Even number of `$` per line — no unclosed delimiters
- Every `{` must have a matching `}`

---

## 4.5 CANONICAL FIELD NAMES — DO NOT USE LEGACY ALIASES

When updating questions in `questions_v2`, write to the **canonical** schema fields defined in `packages/data/models/Question.v2.ts`. Do NOT write to legacy aliases — both the student UI (`apps/student/features/crucible/server-actions/the-crucible.ts`) and the admin UI (`apps/student/features/crucible/components/admin/QuestionAdmin.tsx`) read from the canonical fields only.

| Canonical (read by UI) | Legacy alias (do not use) |
|---|---|
| `solution.text_markdown` | ~~`solution_markdown.text_markdown`~~ |
| `solution.latex_validated` | ~~`solution_markdown.latex_validated`~~ |
| `question_text.markdown` | ~~`question_markdown`~~ |
| `options[i].id` | (required — use `'a'`, `'b'`, `'c'`, `'d'`) |

If you read a doc and see a legacy field present alongside the canonical one, that's a migration artifact — write to canonical and `$unset` the legacy field in the same operation. Audit scripts must read the canonical field.

### Status policy (project decision 2026-05-07)

**All new questions MUST be inserted with `status: 'published'`.** There is no review gate. The admin dashboard does not show a separate "review" workflow; questions go live the moment they're created.

If a question has a problem, **flag it via `flags[]`** instead of holding it in `review` status. The flag system is the single canonical mechanism for "needs attention" signalling.

| Path | Required status |
|---|---|
| Admin UI manual save | `'published'` |
| Bulk Import Modal | `'published'` |
| AI agent batch scripts (insert-template.js) | `'published'` |
| `POST /api/v2/questions` default | `'published'` |

**Do NOT** set `status: 'review'` or `status: 'draft'` in any new ingestion pathway. The `'review'` and `'draft'` enum values are kept in the schema for compatibility only — they exist for the admin UI's manual override case (rare).

### Exam attribution canonical values (project decision 2026-05-07)

When setting `metadata.examDetails.exam`:

| Use this | Never use this | Notes |
|---|---|---|
| `'JEE_Main'` | `'JEE Main'`, `'Mains'`, `'JEE Mains'` | Modern AIEEE-descended exam |
| `'JEE_Advanced'` | `'IIT JEE'`, `'JEE Adv.'`, `'JEE Advanced'` | Was historically called "IIT JEE" — that legacy term ALWAYS maps to JEE_Advanced, never JEE_Main |
| `'NEET_UG'` | `'NEET'` | NEET = NEET_UG; the bare `'NEET'` value should not be used in `examDetails.exam` |
| `'NEET_PG'` | (rare in chem bank) | Postgraduate medical entrance |

When setting `metadata.examDetails.shift`:

| Use this | Never use this |
|---|---|
| `'Shift-I'` | `'Morning'`, `'M'`, `'Shift 1'` (with space), `'shift-I'` (lowercase) |
| `'Shift-II'` | `'Evening'`, `'E'`, `'Shift 2'` (with space), `'shift-II'` |
| (omit field) | `'null'` (the literal string — should be `null` or absent) |

Morning/Shift-I and Evening/Shift-II are equivalent. Always store the `Shift-I` / `Shift-II` form. **NEET is a single-shift exam** — leave `shift: null` for NEET PYQs.

### Rendering exam attribution — use the shared helper

When rendering "JEE Main 2024 · Jan · S-I" style labels in any UI surface, **always use [`formatExamLabel`](apps/student/features/crucible/components/examLabel.ts)**. Never write inline rendering logic — multiple sites had drifted into incompatible bespoke formatters before the consolidation on 2026-05-07.

```ts
import { formatExamLabel } from '@/features/crucible/components/examLabel';

const label = formatExamLabel(
  question.metadata.examDetails,    // canonical, modern
  question.metadata.exam_source     // legacy fallback
);
if (label) <span>{label}</span>     // null when no year is available anywhere
```

Output format (consistent across `BrowseView`, `QuestionDetailPage`, page metadata, `AdaptiveQuestionCard`):
- `JEE Main 2024 · Jan · S-I` — full data
- `JEE Main 2024 · Jan` — month only (no shift; e.g. NEET)
- `JEE Main 2024 · S-I` — shift only (no month)
- `JEE Main 2024` — neither
- `null` — no year available; caller hides the badge

The helper handles: exam-name normalization (`JEE_Main` → `JEE Main`, `NEET_UG` → `NEET`, legacy `IIT JEE` → `JEE Adv`), month abbreviation (`January` → `Jan`), shift compression (`Shift-I` → `S-I`, `Session-II` → `S-II`), and field fallback (modern → legacy per-key).

### Legacy field deprecation status

| Field | Status (as of 2026-05-07) | Action |
|---|---|---|
| `metadata.difficulty` (Easy/Medium/Hard enum) | **Removed.** $unset on 5,505 chemistry docs. Schema field still defined; safe to remove next Phase 4. | Don't write or read. Use `difficultyLevel` (1-5). |
| `metadata.is_pyq` (boolean) | **Phase 1+2 complete.** Read paths migrated to `sourceType === 'PYQ'`. **Writes stopped** on new questions (insert template, bulk import, admin UI, API auto-fill all retired). Existing data still has the field; Phase 4 will $unset it. | Don't read or write. Use `sourceType === 'PYQ'`. The shared `isPyq()` helper in `apps/student/features/crucible/components/examLabel.ts` handles the bridge. |
| `metadata.examBoard` (single-valued) | **Phase 1+2 complete.** Read paths migrated to `applicableExams[0]`. **Writes stopped** — API no longer auto-syncs from applicableExams on POST/PATCH. | Don't read or write. Use `applicableExams[0]`. |
| `metadata.exam_source` (legacy struct) | **Phase 1+2 complete.** Read paths migrated to `examDetails`. **Writes stopped** on new questions. | Don't read or write. Use `examDetails`. The `formatExamLabel()` helper handles fallback for older docs. |
| `metadata.is_top_pyq` (boolean) | **KEEP.** Powers "Top Questions" practice mode (admin star-mark). | Default false on new questions. The admin curates via the dashboard. **Never legacy.** |

**Phase 4** ($unset legacy field data + remove from `Question.v2.ts` schema + remove related Mongoose indexes) — target window **on or after 2026-06-01** (2 weeks after Phase 2 stability on 2026-05-07). After Phase 4 the bridge fallbacks in helpers and read sites can be deleted (single-canonical-source mode).

**If you are reading this after 2026-06-01:** check whether Phase 4 has shipped before trusting this table. Run `grep -r "is_pyq\|examBoard\|exam_source" packages/data/models/Question.v2.ts` — if those field definitions are gone, Phase 4 is done and the bridge code in helpers can also be removed. If they're still there, Phase 4 is pending and the table is still accurate.

---

## 5. DEVELOPMENT COMMANDS

```bash
npm run dev          # Start STUDENT dev server at http://localhost:3000
npm run dev:admin    # Start ADMIN dev server at http://localhost:3001
npm run build        # Production build (student)
npm run build:admin  # Production build (admin)
npm run lint         # ESLint (student)
npm run lint:admin   # ESLint (admin)
```

No automated test suite. Data integrity validation scripts are in `scripts/` (e.g. `validate_pyq_metadata.js`, `validate_question_spacing.js`).

### 5.1 ENV FILE LAYOUT (post-Phase 5 split)

Because admin and student are separate Next.js apps, env vars are split into a shared base + per-app overrides. **This layout is required — do not collapse it back to a single root `.env.local`.**

```
canvas/
├─ .env.local                              ← SHARED. Real file. 13 vars used by both apps + /scripts/*.
├─ .env.example                            ← Committed template for SHARED vars.
├─ apps/
│   ├─ admin/
│   │   ├─ .env.local                      ← SYMLINK → ../../.env.local (provides shared base to admin)
│   │   ├─ .env.development.local          ← Real file. ADMIN-only overrides (e.g. Sentry admin DSN).
│   │   └─ .env.development.local.example  ← Committed template.
│   └─ student/
│       ├─ .env.local                      ← SYMLINK → ../../.env.local (provides shared base to student)
│       ├─ .env.development.local          ← Real file. STUDENT-only overrides (Google OAuth, GA, cron, feature flags).
│       └─ .env.development.local.example  ← Committed template.
```

**Next.js load priority (highest → lowest in dev mode):** `process.env` > `.env.development.local` > `.env.local` > `.env.development` > `.env`. So app-specific (`.env.development.local`) automatically overrides shared (`.env.local`).

**Which vars go where:**

| Variable group | File | Why |
|---|---|---|
| `MONGODB_URI`, `NEXT_PUBLIC_SUPABASE_*`, `ADMIN_EMAILS`, `ADMIN_SECRET`, `NEXT_PUBLIC_ADMIN_SECRET`, `ANTHROPIC_API_KEY`, `R2_*` (5 keys), `NEXT_PUBLIC_BASE_URL` | Root `.env.local` (shared) | Used by both apps and/or by `/scripts/*.js` (which hardcode `dotenv.config({ path: '.env.local' })`) |
| `NEXT_PUBLIC_FEATURE_ADAPTIVE_PRACTICE`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_CLARITY_ID`, `NEXT_PUBLIC_CF_BEACON_TOKEN`, `CRON_SECRET` | `apps/student/.env.development.local` | Only student-side code reads these |
| `NEXT_PUBLIC_SENTRY_DSN_ADMIN`, `SENTRY_DSN_ADMIN` | `apps/admin/.env.development.local` | Only admin Sentry init reads these |

**Onboarding a fresh clone (e.g. second Mac):**
1. Copy values from the working Mac (manual — env files are gitignored).
2. Create the three files: root `.env.local`, `apps/admin/.env.development.local`, `apps/student/.env.development.local`.
3. Recreate the two symlinks:
   ```bash
   ln -s ../../.env.local apps/admin/.env.local
   ln -s ../../.env.local apps/student/.env.local
   ```
4. Restart any running dev server — Next.js only reads env files at startup.

**When in doubt: which file should this new env var go in?**
- Used by both apps OR by any `/scripts/*` file → root `.env.local`
- Only the student app code reads it → `apps/student/.env.development.local`
- Only the admin app code reads it → `apps/admin/.env.development.local`

**Why this split exists:** before Phase 5, a single root `.env.local` was symlinked into admin only. The student app had no env file at all (latent bug — student-only vars like `GOOGLE_CLIENT_ID` had nowhere to live), and any cross-Mac credential drift caused asset uploads, MongoDB, or auth to silently break with misleading "Failed to fetch" / "Network error" messages. The new layout makes ownership explicit and the failure modes obvious.

### 5.2 PREVIEW SERVER — DO NOT START WITHOUT EXPLICIT PERMISSION

**Never call `mcp__Claude_Preview__preview_start` (or any other tool that spins up a dev server / preview window) unless the user has explicitly asked for it in the current turn.** The user runs their own local dev server outside the agent's control, and a Claude-spawned server competes for port 3000, takes over `.env.local` watchers, and disrupts their workflow.

If you'd normally verify a UI change in the preview, instead:
- Edit the source file and stop. The user will refresh their own browser.
- If you genuinely need to query DOM state to debug, ask first: "Want me to start a preview server to verify X?" — and wait for an explicit yes.
- `mcp__Claude_Preview__preview_eval` / `_screenshot` / `_inspect` / `_console_logs` / `_logs` are also off-limits unless the user has authorised a preview session this turn, because they implicitly require a running server.

The only exception is when the user types something like "open the preview," "start a preview server," "spin up a dev server," "verify in the browser," or directly references a preview URL.

---

## 6. SIMULATIONS — READ THIS FIRST

**All interactive simulations** (Chemistry, Physics, Biology) must follow `_agents/workflows/SIMULATION_DESIGN_WORKFLOW.md` exactly. That document is the canonical ruleset for:
- Background colors and surface hierarchy
- Typography scale and font sizes
- Full color palette and atom colors
- Every reusable component pattern (StepBar, nav buttons, sidebars, SVG canvas)
- Academic accuracy gates and anti-hallucination rules
- Anti-patterns (what never to do)

**When building or editing any simulator:** Read `SIMULATION_DESIGN_WORKFLOW.md` before writing a single line. Never invent new colors, font sizes, or component structures — use only what is defined there.

Simulators live at: `app/[subject]-[hub-name]/[Topic]Simulator.tsx`

---

## 7. ARCHITECTURE

### Data Flow

```
Student app (canvasclasses.in, apps/student/)
  ├─ Student UI (/the-crucible/, /books/, /class-*)
  │    └─ Server Actions (apps/student/features/<feature>/server-actions/*.ts)
  │         └─ MongoDB: questions_v2, userprogress, bookpages, ...
  └─ Public/student APIs (apps/student/app/api/v2/*)
       └─ MongoDB + Supabase (auth check on writes)

Admin app (admin.canvasclasses.in, apps/admin/)
  ├─ Admin UI (/ landing, /crucible, /flashcards, /blog, /books, /taxonomy, /career-explorer, /dashboard, /preview)
  │    └─ same-origin fetch → /api/v2/* (also in admin app)
  └─ Admin APIs (apps/admin/app/api/v2/*)
       ├─ middleware.ts → SUPER_ADMIN_EMAILS env OR active user_access doc (first line of defense)
       └─ route handlers → requireAdmin() / per-chapter canEditQuestion / isSuperAdmin
            └─ MongoDB: questions_v2 + auditlogs (same cluster, shared models)
            └─ Supabase: auth check on every mutating request (second line)
```

Both apps connect to the same MongoDB cluster via the same `@canvas/data` Mongoose models. The hard network boundary is at the API layer — admin write routes are not reachable from the public `canvasclasses.in` host. Splitting MongoDB users so the student app gets read-only access to admin-managed collections (Phase 5.5d) is **deferred** until Phase 5 is observed stable in production. The decision and the future spec live in `_agents/plans/PHASE_5_ADMIN_SPLIT.md` under "Out of scope."

### Taxonomy

Two-level hierarchy: **Chapter → Topic Tag**

- Chapter IDs: `ch11_mole`, `ch11_atom`, `ch12_solutions`, etc.
- Topic tag IDs: `tag_mole_1`, `tag_atom_3`, etc.
- **Single source of truth**: `packages/data/taxonomy/taxonomyData_from_csv.ts`
- `metadata.chapter_id` on every `QuestionV2` document must match a chapter `id` in that file exactly

The taxonomy file is auto-updated by the dashboard at `admin.canvasclasses.in/taxonomy` via `POST /api/v2/taxonomy/save` (served by the admin app). Do not edit it manually.

**For tag-level rules** (which tags to apply, how to weight them, micro-concept naming conventions): read `_agents/workflows/CRUCIBLE_TAXONOMY_AND_TAGGING_RULES.md`.

### RBAC (Role-Based Access Control)

Per ADR-010, the admin app uses a grant-based access model:

- **Super admin tier** is defined in the `SUPER_ADMIN_EMAILS` env var. Members have all powers including delete and staff management. Cannot be created or modified via HTTP.
- **Staff tier** is stored in the `user_access` collection. Each document holds a list of grants `{ subject, chapters: 'all' | string[], level: 'view' | 'edit' }`.
- **Question deletion** is restricted to super admins. All other operations gate on per-chapter checks.

Helpers in `@canvas/data/rbac`:
- `isSuperAdmin(email)` — pure env check, no I/O.
- `canEditQuestion(email, chapterId)` / `canViewQuestion(email, chapterId)` / `canDeleteQuestion(email, _chapter)` — async, cached.
- `getQuestionFilter(email)` — Mongo filter for list endpoints.
- `getEffectiveAccess(email)` — full access object for the current user.

Staff are managed in the admin app at `/staff`. See `docs/superpowers/specs/2026-05-23-rbac-redesign-design.md` for the full design.

### Key Files

| Purpose | Path |
|---|---|
| MongoDB connection | `packages/data/db/mongodb.ts` |
| V2 Question model | `packages/data/models/Question.v2.ts` |
| Chapter model | `packages/data/models/Chapter.ts` |
| Asset model | `packages/data/models/Asset.ts` |
| AuditLog model | `packages/data/models/AuditLog.ts` |
| Taxonomy source of truth | `packages/data/taxonomy/taxonomyData_from_csv.ts` |
| Taxonomy lookup helpers | `packages/data/taxonomy/lookup.ts` |
| `display_id` generator | `packages/data/id-generator/index.ts` |
| Difficulty utils (shared) | `packages/data/difficulty.ts` |
| Math/LaTeX renderer (shared) | `packages/ui/MathRenderer.tsx` |
| 2D molecule renderer (shared) | `packages/ui/MoleculeViewer.tsx` — uses openchemlib; consumed by organic-wizard + Live Books |
| Live Books reader-side renderer (shared) | `packages/book-renderer/` — `PageRenderer`, `BlockRenderer`, 20 block renderers + 56 simulation files. Both the student `BookReader` and the admin editor's split-pane preview consume this package. App-route-local simulators (currently only `atomic-models`) are injected via `ExtraSimulatorsProvider` from `@canvas/book-renderer/simulators-context`. |
| Admin Books editor | `apps/admin/features/admin/books-editor/BookWorkspace.tsx` (route shell: `apps/admin/app/books/page.tsx`). Asset upload: `apps/admin/app/api/v2/books/assets/upload/route.ts`. |
| Adaptive engine (Crucible) | `apps/student/features/crucible/lib/adaptiveEngine.ts` |
| Recommendation engine | `packages/persona/recommendation-engine.ts` (+ read-side contract in `packages/persona/contract.ts`) |
| Persona writer (mutation surface) | `packages/persona/writer.ts` |
| Persona contract (constants + classifiers) | `packages/persona/contract.ts` |
| Profile engine | `packages/persona/profile-engine.ts` |
| LaTeX validator utility | `packages/core/latex-validator.ts` |
| Rate limiter | `packages/core/rate-limit.ts` |
| Redirect / SSRF validation | `packages/core/redirect-validation.ts` |
| R2 storage helper | `packages/core/r2-storage.ts` |
| Analytics (Mixpanel server + client) | `packages/core/analytics/` |
| `cn()` class-name merger | `packages/core/utils.ts` |
| Shared route-handler logic (questions, flashcards, chapters, taxonomy/load, assets/*, export/ppt) | `packages/services/<route>.ts` — each takes a `ServiceDeps` arg for auth DI |
| Shared admin gate for service handlers | `packages/services/auth.ts` — `requireAdmin(req, deps)` returns `{ ok: true; user } \| { ok: false; response }`. New admin-mutation service handlers MUST use this instead of re-implementing the localhost-bypass + auth + admin-email preamble inline. |
| Pure question-filter helpers (URL params → Mongo filter) | `packages/services/questions-filters.ts` — `parseQuestionParams`, `buildMongoFilter`, `buildProjection`, `isSimpleChapterFetch`. The §4.5 legacy-param bridge (`is_pyq` / `exam_level` / `examBoard`) lives in `buildMongoFilter` so the Phase 4 cleanup is a one-file delete. No I/O — unit-testable. |
| Pure persona state transition | `packages/services/../persona/user-progress-updater.ts` (`@canvas/persona/user-progress-updater`) — `computeUserProgressUpdate(snapshot, attempt): UserProgressUpdate`. The value-oriented core of `writer.ts`; safe to import from tests / admin simulators / AI replay. Writer.ts remains the canonical mutation surface (CRUCIBLE_ARCHITECTURE.md §9 invariant #3). |
| V2 questions API wrappers | `apps/student/app/api/v2/questions/route.ts` + `apps/admin/app/api/v2/questions/route.ts` (thin wrappers over `@canvas/services/questions`) |
| Admin home landing | `apps/admin/app/page.tsx` — card grid linking to each operator panel |
| Admin question editor (Crucible) | `apps/admin/features/admin/components/QuestionAdmin.tsx` (route shell: `apps/admin/app/crucible/page.tsx`) |
| Admin auth helpers | `apps/admin/lib/auth.ts` (route handlers), `apps/admin/lib/adminAuth.ts` (server components) |
| RBAC helpers | `packages/data/rbac.ts` (grant-based; see ADR-010) |
| User access model | `packages/data/models/UserAccess.ts` |
| User access audit log | `packages/data/models/UserAccessAuditLog.ts` |
| Admin middleware | `apps/admin/middleware.ts` (Supabase + SUPER_ADMIN_EMAILS / user_access gate, all paths except `/login` + `/api/auth/*` + `/_next/*`) |
| Student server actions | `apps/student/features/crucible/server-actions/the-crucible.ts` |
| Student auth helpers | `apps/student/lib/auth.ts` (route handlers), `apps/student/lib/bookAuth.ts` (server components) |
| Student landing | `apps/student/app/the-crucible/page.tsx` (renders `apps/student/features/crucible/` components) |

> **Import direction rules** (post-monorepo migration):
> - `apps/admin/` MUST NOT import from `apps/student/` and vice versa. Workspace tsc enforces this. Anything shared between the two apps must go through `packages/*/`.
> - Student feature code (`apps/student/features/<feature>/`) and notes pages must never reach into admin-only surfaces. Shared modules belong in `packages/data/`, `packages/persona/`, `packages/core/`, `packages/ui/`, or `apps/student/lib/`.
> - Anything inside `packages/*/` must not use the `@/` alias or import from `apps/*` — packages use relative paths internally and have no knowledge of which app consumes them.
> - The shared data layer (Mongoose models, db, taxonomy, schemas, id-generator, difficulty utils) lives in `@canvas/data` — import via `from '@canvas/data/models/X'` or `from '@canvas/data/db/mongodb'`, never via an app's `@/lib/...`.

### Routes hosted in both apps (now share one source)

Nine `/api/v2/*` routes exist in BOTH apps because both apps' UIs fetch them same-origin. After Phase 6.0 (commit `84b3afa`), the handler logic lives in `@canvas/services/<route>` and each app's `route.ts` is a thin wrapper that injects its app-local auth helpers via `ServiceDeps`. See [ADR-001](_agents/adr/001-service-layer-di-pattern.md) for the pattern and rationale.

Routes hosted by both apps (wrapper → service):
- `assets/upload/route.ts` → `@canvas/services/assets-upload`
- `assets/[id]/route.ts` → `@canvas/services/assets-by-id`
- `chapters/route.ts` → `@canvas/services/chapters`
- `taxonomy/load/route.ts` → `@canvas/services/taxonomy-load`
- `export/ppt/route.ts` → `@canvas/services/export-ppt`
- `questions/route.ts` → `@canvas/services/questions`
- `questions/[id]/route.ts` → `@canvas/services/questions-by-id`
- `flashcards/route.ts` → `@canvas/services/flashcards`
- `flashcards/[id]/route.ts` → `@canvas/services/flashcards-by-id`

**Rule:** any change to handler logic goes in the `@canvas/services` file. The wrappers should only ever change to add/remove a Next.js route-segment config export (`runtime`, `maxDuration`) — Next reads those from the route file itself.

**Helper-level duplicates are gone (Phase 5.13).** The pure-data and pure-React-component duplicates from Phase 5.5 / 5.10 have been consolidated into shared packages and removed from both apps:

| Helper | Canonical location |
|---|---|
| Flashcard taxonomy data + helpers | `@canvas/data/flashcards/flashcardTaxonomy` |
| Flashcard markdown component dict | `@canvas/ui/flashcardMarkdown` |
| Book block utilities (flattenBlocks, computeReadingTime, etc.) | `@canvas/data/books/utils` |
| Book block Zod schemas (validateBlocks) | `@canvas/data/books/schemas` |

`rbac` is also consolidated as `@canvas/data/rbac` (Phase 5.13d).

### Simplicity Constraint

- Don't add a new Mongoose model unless explicitly requested.
- Don't add a new API route as a "while I'm here" improvement.
- Don't create a shared utility function unless it's called from 3+ places.
- If a solution works in 30 lines, don't write 80.

### Design System (Dark Theme Only)

- Backgrounds: `#050505` (deepest) → `#0B0F15` (card) → `#151E32` (surface)
- Primary accent: `orange-500` / `amber-400` gradient
- Success: `emerald-500` | Error: `red-500`
- Primary button: `bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold`
- Ghost button: `bg-white/5 border border-white/10 hover:bg-white/10`
- Card: `bg-[#151E32] border border-white/5 rounded-xl`

---

## 8. SECURITY RULES — MANDATORY FOR EVERY CHANGE

These rules are **non-negotiable**. Every agent must follow them when creating or modifying any API route, server action, or backend logic. Violations are treated as bugs.

### 8.1 Authentication Is Required by Default

- **Every API route under `/api/v2/`** that performs a write (POST, PATCH, PUT, DELETE) **must** call an auth guard before touching the database. No exceptions.
- **Admin routes**: Use `requireAdmin()` from `lib/bookAuth.ts` (for server components/actions) or `getAuthenticatedUser()` + `isAdmin()` from `lib/auth.ts` (for route handlers).
- **Student routes** (e.g. flag submission, progress save): Use `getAuthenticatedUser()` from `lib/auth.ts` to verify the user is logged in.
- **Public read routes** are the only exception — if a GET returns non-sensitive public data, auth may be skipped. Document this explicitly with a `// PUBLIC: no auth required` comment.
- If you are unsure whether a route needs auth, **it needs auth**.

### 8.2 Canonical Auth Files — Never Duplicate

| Context | File | Functions |
|---|---|---|
| Admin route handlers (`apps/admin/app/api/**`) | `apps/admin/lib/auth.ts` | **`requireAdmin(request)`** (canonical gate), `getAuthenticatedUser(request)`, `isAdmin(email)`, `hasScriptSecret(request)`, `getUserIdFromRequest(request)` |
| Admin server components / actions | `apps/admin/lib/adminAuth.ts` | `requireAdmin()`, `getUserId()`, `isAdminRequest()`, `isLocalhostDev()` |
| Shared service handlers (`packages/services/*.ts`) | `packages/services/auth.ts` | `requireAdmin(request, deps)` |
| Student route handlers | `apps/student/lib/auth.ts` | `getAuthenticatedUser(request)`, `isAdmin(email)`, `hasScriptSecret(request)` |
| Student server components / actions | `apps/student/lib/bookAuth.ts` | `requireAdmin()`, `getUserId()`, `isAdminRequest()`, `isLocalhostDev()` |

**Never define a local `getAuthenticatedUser`, `isAdmin`, `hasScriptSecret`, or any "authorize"-style helper inside a route file.** Always import from the shared modules above. If you need new auth logic, add it to one of these files.

### 8.2.1 Canonical pattern for admin route handlers

Every admin route handler in `apps/admin/app/api/**` MUST start its mutating handler (POST/PATCH/DELETE) and any admin-only GET with this exact preamble:

```ts
import { requireAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;
  // gate.user.id and gate.user.email are always strings here.
  // ...
}
```

`requireAdmin` applies a three-tier check IN ORDER:

1. **Localhost dev bypass** — must stay in sync with `apps/admin/middleware.ts`. If you ever change one, change both.
2. **Script-secret bypass** — `x-admin-secret` header equal to `ADMIN_SECRET` env var. For backend bulk scripts.
3. **Supabase session + `ADMIN_EMAILS` allow-list** — the production check.

On bypass, `gate.user` is a synthetic identity (`{ id: 'dev-user', email: 'dev@localhost' }` or `{ id: 'script', email: 'script@canvasclasses.in' }`) so audit logs and `updated_by` fields work uniformly without null checks.

**Why this exists:** before the consolidation (commit `<pending>`), 17 admin routes re-implemented the gate inline. 9 of them missed the localhost bypass and silently 401'd on local dev even though the middleware let the request through — including question reclassify, mock-test mutations, blog post update, and flag resolution. The canonical helper eliminates that drift.

**Exceptions that should NOT use `requireAdmin`:**
- `apps/admin/app/api/v2/admin/permissions/route.ts` — returns the current user's permissions, not an admin gate. Has its own localhost bypass that returns synthetic super-admin permissions.
- `apps/admin/app/api/v2/admin/roles/route.ts` — uses RBAC `canManageRoles` permission, a stricter check than admin-email. Keeps its own per-handler gate.
- Service-layer routes (e.g. `apps/admin/app/api/v2/flashcards/*`) — these are thin wrappers that delegate to `@canvas/services/*`, which uses the service-side `requireAdmin(request, deps)` instead.

### 8.2.2 Canonical pattern for `@canvas/services` handlers

For handlers that live in `packages/services/*.ts` (because they're shared between student and admin), use the DI-friendly variant:

```ts
import { requireAdmin } from './auth';

export async function POST(request: NextRequest, deps: ServiceDeps) {
  const gate = await requireAdmin(request, deps);
  if (!gate.ok) return gate.response;
  // gate.user is User | null (null only on localhost bypass)
  // ...
}
```

The service-side helper takes `ServiceDeps` so each app can inject its own auth implementations (admin's stricter check vs student's lighter check). Service handlers must use this — do not call `deps.isLocalhostDev` + `deps.getAuthenticatedUser` + `deps.isAdmin` inline.

### 8.3 Never Use NODE_ENV for Auth Bypass

- `process.env.NODE_ENV === 'development'` must **never** be used to skip authentication. Vercel preview deployments also set `NODE_ENV=development`, making this a production bypass.
- For local dev convenience, use `isLocalhostDev()` from `lib/bookAuth.ts` — it checks hostname + NODE_ENV + confirms the app is not on Vercel.

### 8.4 Input Validation and Sanitization

- **Every POST/PATCH body** must be validated with a Zod schema or explicit field whitelist before reaching the database. Never pass raw `body` to `$set` or any Mongoose update.
- **File uploads**: Sanitize filenames (strip `..`, `/`, `\`, special chars), enforce size limits, and verify the resolved path stays within the intended directory.
- **URL parameters**: User-supplied redirect URLs must pass through `sanitizeRedirect()` from `@canvas/core/redirect-validation`. Never use `window.location.href = userInput` or `redirect(userInput)` directly.
- **HTML rendering**: Any `innerHTML` assignment must sanitize through `DOMPurify` first. Use the KaTeX MathML allowlist pattern from `MathRenderer.tsx`.

### 8.5 Error Responses Must Not Leak Internals

- Never return `error.message`, `error.stack`, or raw exception strings to the client.
- Use generic messages: `"Failed to save question"`, `"Internal server error"`.
- Log the full error server-side with `console.error()` for debugging.

### 8.6 Database Safety

- **No mass assignment**: Always use explicit field whitelists when updating documents. Never `$set: body`.
- **Concurrency**: Use Mongoose optimistic concurrency (`optimisticConcurrency: true` in schema) with retry loops for any read-modify-write pattern (e.g. user progress, counters).
- **Unique fields**: Wrap inserts that depend on unique fields (e.g. `display_id`) in a retry loop that catches `E11000` duplicate key errors and regenerates.
- **Queries must be bounded**: Every `.find()` that returns a list must include `.limit()`. Use URL params for pagination with a hard cap (e.g. `Math.min(requested, 200)`).

### 8.7 No Secrets in Client Code

- Never send secrets, API keys, or admin tokens in client-side headers or request bodies.
- `NEXT_PUBLIC_*` env vars are visible to every browser. Only Supabase URL and anon key belong there.
- Auth in the browser relies on Supabase session cookies — they are sent automatically on same-origin requests. No manual secret headers needed.

### 8.8 SSRF and External Requests

- Any server-side proxy or fetch to a user-supplied URL must validate the hostname with strict `.endsWith()` suffix matching against an allowlist. Never use `.includes()` — it allows subdomain spoofing (e.g. `evil-r2.dev.com` matches `.includes('r2.dev')`).
- Only allow HTTPS URLs for external requests.

### 8.9 Rate Limiting and Memory

- In-memory rate limiters (`Map`-based) must include periodic TTL cleanup and a hard cap on entries (e.g. 5000) to prevent OOM under sustained unique-IP traffic.
- Add a comment noting that Redis-based rate limiting (e.g. Upstash) should replace in-memory maps at production scale.

### 8.10 Pre-Task Plan + Post-Task Verification

For any task with 3+ steps, state the plan first:

```
1. [What I'll change] → verify: [how I'll confirm it worked]
2. [What I'll change] → verify: [how I'll confirm it worked]
```

For tasks that add or modify API routes, additionally run the security checklist before considering the work done:

1. Does every mutating endpoint have an auth guard?
2. Is the request body validated with a schema or whitelist?
3. Do error responses avoid leaking internal details?
4. Are database queries bounded with `.limit()`?
5. Are there any new local auth helper functions that should use the shared imports instead?

---

## 8.11 KNOWN ISSUES — AVOID RE-INTRODUCING

These are pre-existing gaps the codebase carries today. They're tracked in `_agents/DEEPENING_BACKLOG.md` but called out here so new code does NOT compound them.

### In-memory rate limiters do not scale across instances

**Where:** `packages/core/rate-limit.ts` and every route that calls `createRateLimiter(...)`.

**The gap:** `Map`-based limiters live in a single Node process. On Vercel each instance has its own Map, so the "30 requests per minute" cap is really "30 × N_instances per minute." Acceptable today (small fleet) but **do not deepen the pattern** in new high-volume endpoints. When traffic justifies it, swap to Upstash Redis or Cloudflare — see DEEPENING_BACKLOG item #5 for the port-adapter sketch.

**For new routes:** continue using `createRateLimiter` for low-volume admin/auth surfaces (existing pattern). For anything student-facing and high-volume, consult before adding — don't silently expand the in-memory footprint.

### Question PATCH lacks an explicit metadata-field whitelist

**Where:** `packages/services/questions-by-id.ts:PATCH`.

**The gap:** The handler spreads the incoming body into `metadata` rather than enumerating allowed sub-fields. Today the only callers are the admin UI (trusted) and bulk-update scripts (operator-controlled), so the risk is contained. But the path is a foot-gun: future code that calls this from a less-trusted surface, or a future bug that leaks user input into the body, would let arbitrary metadata fields land in the DB.

**For new code:** if you add a new caller of `PATCH /api/v2/questions/[id]`, validate the body against `QuestionSchema.partial()` before sending. If you extend the handler itself, consider replacing the spread with an explicit `pick()` of the canonical fields per §4.5.

### Six admin dashboards share a copy-pasted shell

**Where:** `apps/admin/app/{crucible,flashcards,blog,books,taxonomy,career-explorer}/page.tsx` and friends.

**The gap:** Same auth gate, same toolbar shape, same loading state, same empty state — repeated six times. Pre-existing and load-bearing; an `<AdminPanel>` abstraction is sketched in DEEPENING_BACKLOG #8 but not yet built.

**For new dashboards:** if you're tempted to add a 7th, **flag it before adding** — that's the trigger to do the abstraction first. Until then, copy the closest existing dashboard verbatim rather than inventing a new shape, so the future consolidation stays mechanical.

---

## 9. SURGICAL CHANGES — ONLY TOUCH WHAT THE TASK REQUIRES

- Fix a bug in one function → don't refactor adjacent helpers.
- Add a field to one API route → don't restructure the whole handler.
- Update a component → match existing Tailwind patterns; don't introduce new color tokens or class names.
- Notice unrelated dead code → mention it in your response, but don't delete it.

Every changed line must trace directly to the user's request. If it doesn't, revert it.
