# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 0. BEFORE YOU CODE — REQUIRED FOR ALL TASKS

Before writing any code or running any script:

1. **State assumptions explicitly.** If a request could mean two things (e.g., "fix the question UI" — which component?), name both interpretations and ask.
2. **Name the invariants you'll preserve** when touching Crucible-governed paths (`app/the-crucible/`, `app/api/v2/`, the persona pipeline). Example: "I will not touch `actions.ts` outside the broken function."
3. **For any script writing to `questions_v2`:** state how many documents will be affected and what the rollback is, before running.

If uncertain about scope, stop and ask. Do not pick silently.

---

> **Before changing anything inside `apps/student/app/the-crucible/`, `apps/student/app/crucible/admin/`, `apps/student/app/api/v2/`, `packages/data/models/UserProgress.ts`, `packages/data/models/StudentChapterProfile.ts`, `apps/student/lib/recommendationEngine.ts`, or `packages/data/models/ResourceLink.ts` — read [`_agents/CRUCIBLE_ARCHITECTURE.md`](_agents/CRUCIBLE_ARCHITECTURE.md).** It is the canonical reference for Crucible's structure, the persona pipeline, the recommendation bridge, and the invariants that must not be broken. If anything in this file or in code comments contradicts it, that document wins; the fix is to update the doc, never to silently diverge.

---

## 1. PROJECT OVERVIEW

**Crucible** is a JEE/NEET Chemistry question bank and adaptive practice platform built for Canvas Classes.

- **Framework**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Database**: MongoDB Atlas (questions, taxonomy, audit logs)
- **Auth**: Supabase (user accounts, session management)
- **Assets**: Cloudflare R2 (`canvas-chemistry-assets` bucket)

### Active System: V2

There are two versions of the question system. **V2 is the only active system.** Do not write to or create anything in V1.

| | V1 (Legacy — do not use) | V2 (Active) |
|---|---|---|
| Admin panel | `/the-crucible/admin/` | `/crucible/admin/` |
| API | `/api/questions/` | `/api/v2/` |
| Mongoose model | (deleted — V1 retired) | `packages/data/models/Question.v2.ts` |
| Collection | `questions` | `questions_v2` |
| Question IDs | Auto-increment strings | UUID v4 + `display_id` (e.g. `ATOM-042`) |

**Student-facing UI** lives at `/the-crucible/` and reads from V2 via server actions in `app/the-crucible/actions.ts`.

**Admin UI** lives at `/crucible/admin/` and communicates via `/api/v2/` REST routes.

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

When updating questions in `questions_v2`, write to the **canonical** schema fields defined in `packages/data/models/Question.v2.ts`. Do NOT write to legacy aliases — both the student UI (`apps/student/app/the-crucible/actions.ts`) and the admin UI (`apps/student/app/crucible/admin/page.tsx`) read from the canonical fields only.

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

When rendering "JEE Main 2024 · Jan · S-I" style labels in any UI surface, **always use [`formatExamLabel`](app/the-crucible/components/examLabel.ts)**. Never write inline rendering logic — multiple sites had drifted into incompatible bespoke formatters before the consolidation on 2026-05-07.

```ts
import { formatExamLabel } from '@/app/the-crucible/components/examLabel';

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
| `metadata.is_pyq` (boolean) | **Phase 1+2 complete.** Read paths migrated to `sourceType === 'PYQ'`. **Writes stopped** on new questions (insert template, bulk import, admin UI, API auto-fill all retired). Existing data still has the field; Phase 4 will $unset it. | Don't read or write. Use `sourceType === 'PYQ'`. The shared `isPyq()` helper in `app/the-crucible/components/examLabel.ts` handles the bridge. |
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
Student UI (/the-crucible/)
  └─ Server Actions (app/the-crucible/actions.ts)
       └─ MongoDB: questions_v2 collection

Admin UI (/crucible/admin/)
  └─ REST API (/api/v2/questions, /api/v2/taxonomy, ...)
       └─ MongoDB: questions_v2 + auditlogs
       └─ Supabase: auth check on every mutating request
```

### Taxonomy

Two-level hierarchy: **Chapter → Topic Tag**

- Chapter IDs: `ch11_mole`, `ch11_atom`, `ch12_solutions`, etc.
- Topic tag IDs: `tag_mole_1`, `tag_atom_3`, etc.
- **Single source of truth**: `packages/data/taxonomy/taxonomyData_from_csv.ts`
- `metadata.chapter_id` on every `QuestionV2` document must match a chapter `id` in that file exactly

The taxonomy file is auto-updated by the dashboard at `/crucible/admin/taxonomy` via `POST /api/v2/taxonomy/save`. Do not edit it manually.

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
| Math/LaTeX renderer (shared) | `apps/student/components/MathRenderer.tsx` |
| Adaptive engine (Crucible) | `apps/student/app/the-crucible/lib/adaptiveEngine.ts` |
| Recommendation engine | `apps/student/lib/recommendationEngine.ts` |
| Persona writer (mutation surface) | `apps/student/lib/personaWriter.ts` |
| Profile engine | `apps/student/lib/profileEngine.ts` |
| LaTeX validator utility | `apps/student/lib/latexValidator.ts` |
| V2 questions API | `apps/student/app/api/v2/questions/route.ts` |
| Admin question editor | `apps/student/app/crucible/admin/page.tsx` |
| Student server actions | `apps/student/app/the-crucible/actions.ts` |
| Student landing | `apps/student/app/the-crucible/page.tsx` |

> **Import direction rules** (post-monorepo migration):
> - Student code (`apps/student/app/the-crucible/`) and notes pages must never import from `apps/student/app/crucible/admin/`. Shared modules belong in `packages/data/`, `apps/student/lib/`, or `apps/student/components/`.
> - Anything inside `packages/*/` must not use the `@/` alias or import from `apps/*` — packages use relative paths internally and have no knowledge of which app consumes them.
> - The shared data layer (Mongoose models, db, taxonomy, schemas, id-generator, difficulty utils) lives in `@canvas/data` — import via `from '@canvas/data/models/X'` or `from '@canvas/data/db/mongodb'`, never via `@/lib/...`.

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
- **URL parameters**: User-supplied redirect URLs must pass through `sanitizeRedirect()` from `lib/redirectValidation.ts`. Never use `window.location.href = userInput` or `redirect(userInput)` directly.
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
