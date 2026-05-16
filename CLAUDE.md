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

**Crucible** is a JEE/NEET Chemistry question bank and adaptive practice platform built for Canvas Classes.

- **Framework**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Database**: MongoDB Atlas (questions, taxonomy, audit logs)
- **Auth**: Supabase (user accounts, session management) — ADMIN_EMAILS allow-list for the admin app
- **Assets**: Cloudflare R2 (`canvas-chemistry-assets` bucket)

### Monorepo layout (as of Phase 5)

The codebase is split into two Next.js apps in an npm workspace:

| App | Host | Purpose |
|---|---|---|
| `apps/student/` | `canvasclasses.in` | Public student-facing site — `/the-crucible/*`, `/books/*`, `/class-*`, blog, public APIs |
| `apps/admin/` | `admin.canvasclasses.in` | Operator console — `/admin/*`, `/dashboard`, `/preview`, admin write APIs |

Both apps share `@canvas/{core,data,persona,ui}` packages from `packages/*`. **Neither app may import from the other** — workspace-level boundary enforced by tsc.

The admin app's API surface (under `apps/admin/app/api/v2/*`) hosts:
- Admin-write methods extracted from formerly-mixed routes (mock-tests, career-explorer/careers, career-explorer/questions write halves)
- 1:1 admin-only routes (ai/*, taxonomy/save, books/* admin methods, career-explorer/{matches,questions/[id]}, questions admin sub-routes, blog/*, admin/{permissions,roles,revalidate,debug/sentry})
- Byte-for-byte duplicates of routes admin UI also reads from (questions, flashcards, chapters, taxonomy/load, assets/[id], export/ppt) — each marked with a TODO header for future package consolidation

### Active System: V2

There are two versions of the question system. **V2 is the only active system.** Do not write to or create anything in V1.

| | V1 (Legacy — do not use) | V2 (Active) |
|---|---|---|
| Admin panel | `/the-crucible/admin/` | `admin.canvasclasses.in/admin/` |
| API | `/api/questions/` | `apps/student/app/api/v2/` (public/student reads + writes), `apps/admin/app/api/v2/` (admin writes) |
| Mongoose model | (deleted — V1 retired) | `packages/data/models/Question.v2.ts` |
| Collection | `questions` | `questions_v2` |
| Question IDs | Auto-increment strings | UUID v4 + `display_id` (e.g. `ATOM-042`) |

**Student-facing UI** lives at `/the-crucible/` (route shell at `apps/student/app/the-crucible/`) and reads from V2 via server actions in `apps/student/features/crucible/server-actions/the-crucible.ts`.

**Admin UI** lives at `admin.canvasclasses.in/admin/` (route shell at `apps/admin/app/admin/`, components in `apps/admin/features/admin/components/`). Admin pages call same-origin `/api/v2/*` routes, all served by the admin app. **The admin app never crosses into student-origin** — that boundary is the point of the Phase 5 split. See `_agents/plans/PHASE_5_ADMIN_SPLIT.md` for the decision record.

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
ADMIN_EMAILS=...
```

---

## 3. QUESTION INGESTION — READ THIS FIRST

### Single Source of Truth

**All question ingestion must follow `_agents/workflows/QUESTION_INGESTION_WORKFLOW.md` exactly.** That document is the canonical, version-controlled ruleset. When it conflicts with anything else (including this file), it wins.

LaTeX rules, ID generation, PYQ metadata conventions, and security/secret-handling
practices are documented inline in this file — see §4 (LaTeX), §4.5 (canonical
field names), §8 (security rules), and the workflow doc above for ingestion
specifics.

### Automation Pipeline

**The automation pipeline has been permanently deleted.** Do not reference it, recreate it, or suggest using it. All ingestion is done via hand-written batch scripts in `scripts/` following the canonical template in the workflow document.

### Anti-Hallucination Rule (Rule 0)

> Before extracting any question, perform an image verification gate: quote the first 8 words of the question verbatim from the source image. If you cannot quote them, stop and flag the image as illegible. Never generate question content from chemistry training knowledge. If uncertain whether text came from the image or training knowledge, write `NEEDS_REVIEW: [reason]` in that field. Never fabricate. Never run a fake audit.

### Display ID Prefixes

Display ID prefixes (e.g. `ATOM`, `MOLE`, `SALT`) are defined in `_agents/workflows/QUESTION_INGESTION_WORKFLOW.md` — that file is the single source of truth and must not be duplicated here.

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

**Phase 4** ($unset legacy field data + remove from `Question.v2.ts` schema + remove related Mongoose indexes) ships ~2 weeks after Phase 2 is stable. After Phase 4 the bridge fallbacks in helpers and read sites can be deleted (single-canonical-source mode).

---

## 5. DEVELOPMENT COMMANDS

```bash
npm run dev     # Start development server at http://localhost:3000
npm run build   # Production build
npm run lint    # ESLint
```

No automated test suite. Data integrity validation scripts are in `scripts/` (e.g. `validate_pyq_metadata.js`, `validate_question_spacing.js`).

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
  ├─ Admin UI (/admin/*, /dashboard, /preview)
  │    └─ same-origin fetch → /api/v2/* (also in admin app)
  └─ Admin APIs (apps/admin/app/api/v2/*)
       ├─ middleware.ts → ADMIN_EMAILS allow-list (first line of defense)
       └─ route handlers → requireAdmin() / getAuthenticatedUser + isAdmin
            └─ MongoDB: questions_v2 + auditlogs (same cluster, shared models)
            └─ Supabase: auth check on every mutating request (second line)
```

Both apps connect to the same MongoDB cluster via the same `@canvas/data` Mongoose models. The hard network boundary is at the API layer — admin write routes are not reachable from the public `canvasclasses.in` host. A future hardening step (tracked as Phase 5.5d) splits MongoDB users so the student app gets read-only access to admin-managed collections.

### Taxonomy

Two-level hierarchy: **Chapter → Topic Tag**

- Chapter IDs: `ch11_mole`, `ch11_atom`, `ch12_solutions`, etc.
- Topic tag IDs: `tag_mole_1`, `tag_atom_3`, etc.
- **Single source of truth**: `packages/data/taxonomy/taxonomyData_from_csv.ts`
- `metadata.chapter_id` on every `QuestionV2` document must match a chapter `id` in that file exactly

The taxonomy file is auto-updated by the dashboard at `admin.canvasclasses.in/admin/taxonomy` via `POST /api/v2/taxonomy/save` (served by the admin app). Do not edit it manually.

**For tag-level rules** (which tags to apply, how to weight them, micro-concept naming conventions): read `_agents/workflows/CRUCIBLE_TAXONOMY_AND_TAGGING_RULES.md`.

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
| V2 questions API (student-facing GET + create) | `apps/student/app/api/v2/questions/route.ts` |
| V2 questions API (admin same-origin copy) | `apps/admin/app/api/v2/questions/route.ts` (byte-for-byte duplicate; keep in sync) |
| Admin question editor | `apps/admin/features/admin/components/QuestionAdmin.tsx` (route shell: `apps/admin/app/admin/page.tsx`) |
| Admin auth helpers | `apps/admin/lib/auth.ts` (route handlers), `apps/admin/lib/adminAuth.ts` (server components) |
| Admin middleware | `apps/admin/middleware.ts` (Supabase + ADMIN_EMAILS gate, all paths except `/login` + `/api/auth/*` + `/_next/*`) |
| Student server actions | `apps/student/features/crucible/server-actions/the-crucible.ts` |
| Student auth helpers | `apps/student/lib/auth.ts` (route handlers), `apps/student/lib/bookAuth.ts` (server components) |
| Student landing | `apps/student/app/the-crucible/page.tsx` (renders `apps/student/features/crucible/` components) |

> **Import direction rules** (post-monorepo migration):
> - `apps/admin/` MUST NOT import from `apps/student/` and vice versa. Workspace tsc enforces this. Anything shared between the two apps must go through `packages/*/`.
> - Student feature code (`apps/student/features/<feature>/`) and notes pages must never reach into admin-only surfaces. Shared modules belong in `packages/data/`, `packages/persona/`, `packages/core/`, `packages/ui/`, or `apps/student/lib/`.
> - Anything inside `packages/*/` must not use the `@/` alias or import from `apps/*` — packages use relative paths internally and have no knowledge of which app consumes them.
> - The shared data layer (Mongoose models, db, taxonomy, schemas, id-generator, difficulty utils) lives in `@canvas/data` — import via `from '@canvas/data/models/X'` or `from '@canvas/data/db/mongodb'`, never via an app's `@/lib/...`.

### Duplicated route files (admin + student)

Some `/api/v2/*` routes exist in BOTH apps because both apps' UIs fetch them same-origin. The duplicates are byte-for-byte equal modulo a `@/lib/bookAuth` → `@/lib/adminAuth` rewrite. Each admin copy carries a TODO header noting the future consolidation target.

Routes duplicated:
- `assets/upload/route.ts` (5.5b)
- `questions/route.ts`, `questions/[id]/route.ts` (5.10)
- `flashcards/route.ts`, `flashcards/[id]/route.ts` (5.10)
- `chapters/route.ts`, `taxonomy/load/route.ts` (5.10)
- `assets/[id]/route.ts`, `export/ppt/route.ts` (5.10)

**Rule:** any change to one copy MUST be mirrored to the other. The compiler can't enforce equality. Until these promote to a shared service package, treat them as a single logical file with two physical copies.

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
| Route handlers (`/api/**`) | `lib/auth.ts` | `getAuthenticatedUser(request)`, `isAdmin(email)`, `hasScriptSecret(request)` |
| Server components / actions | `lib/bookAuth.ts` | `requireAdmin()`, `getUserId()`, `isAdminRequest()`, `isLocalhostDev()` |

**Never define a local `getAuthenticatedUser`, `isAdmin`, or `hasScriptSecret` inside a route file.** Always import from the shared modules above. If you need new auth logic, add it to one of these two files.

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

## 9. SURGICAL CHANGES — ONLY TOUCH WHAT THE TASK REQUIRES

- Fix a bug in one function → don't refactor adjacent helpers.
- Add a field to one API route → don't restructure the whole handler.
- Update a component → match existing Tailwind patterns; don't introduce new color tokens or class names.
- Notice unrelated dead code → mention it in your response, but don't delete it.

Every changed line must trace directly to the user's request. If it doesn't, revert it.
