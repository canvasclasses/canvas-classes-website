# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
| Mongoose model | `lib/models.ts` | `lib/models/Question.v2.ts` |
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

**All question ingestion must follow `.agent/workflows/QUESTION_INGESTION_WORKFLOW.md` exactly.** That document is the canonical, version-controlled ruleset. When it conflicts with anything else (including this file), it wins.

Supporting rules live in:
- `.agent/rules/latex_formatting.md` — full LaTeX standards
- `.agent/rules/question_management.md` — ID generation, PYQ metadata, sync workflow
- `.agent/rules/security_protocol.md` — secret handling, git hygiene

### Automation Pipeline

**The automation pipeline has been permanently deleted.** Do not reference it, recreate it, or suggest using it. All ingestion is done via hand-written batch scripts in `scripts/` following the canonical template in the workflow document.

### Anti-Hallucination Rule (Rule 0)

> Before extracting any question, perform an image verification gate: quote the first 8 words of the question verbatim from the source image. If you cannot quote them, stop and flag the image as illegible. Never generate question content from chemistry training knowledge. If uncertain whether text came from the image or training knowledge, write `NEEDS_REVIEW: [reason]` in that field. Never fabricate. Never run a fake audit.

### Display ID Prefixes

Display ID prefixes (e.g. `ATOM`, `MOLE`, `SALT`) are defined in `.agent/workflows/QUESTION_INGESTION_WORKFLOW.md` — that file is the single source of truth and must not be duplicated here.

### Canonical Batch Script Pattern

Scripts go in `scripts/`, named `insert_{chapter}_b{N}.js`. Each script:
1. Loads `MONGODB_URI` from `.env.local` via `dotenv`
2. Queries `questions_v2` to find the current max `display_id` before assigning new ones
3. Checks for duplicate `display_id` values before inserting
4. Uses `uuidv4()` for `_id` — never `new ObjectId()`
5. Sets `deleted_at: null`, `status: 'review'` on all new documents
6. Disconnects after completion

Never use `node -e "..."` for scripts containing LaTeX — shell escaping corrupts backslashes. Always write a `.js` file and run `node scripts/file.js`.

---

## 4. LATEX RULES — QUICK REFERENCE

Full rules: `.agent/rules/latex_formatting.md`

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

## 5. DEVELOPMENT COMMANDS

```bash
npm run dev     # Start development server at http://localhost:3000
npm run build   # Production build
npm run lint    # ESLint
```

No automated test suite. Data integrity validation scripts are in `scripts/` (e.g. `validate_pyq_metadata.js`, `validate_question_spacing.js`).

---

## 6. ARCHITECTURE

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
- **Single source of truth**: `app/crucible/admin/taxonomy/taxonomyData_from_csv.ts`
- `metadata.chapter_id` on every `QuestionV2` document must match a chapter `id` in that file exactly

The taxonomy file is auto-updated by the dashboard at `/crucible/admin/taxonomy` via `POST /api/v2/taxonomy/save`. Do not edit it manually.

### Key Files

| Purpose | Path |
|---|---|
| MongoDB connection | `lib/mongodb.ts` |
| V2 Question model | `lib/models/Question.v2.ts` |
| Chapter model | `lib/models/Chapter.ts` |
| Asset model | `lib/models/Asset.ts` |
| AuditLog model | `lib/models/AuditLog.ts` |
| Taxonomy source of truth | `app/crucible/admin/taxonomy/taxonomyData_from_csv.ts` |
| LaTeX validator utility | `lib/latexValidator.ts` |
| V2 questions API | `app/api/v2/questions/route.ts` |
| Admin question editor | `app/crucible/admin/page.tsx` |
| Student landing | `app/the-crucible/page.tsx` |

### Design System (Dark Theme Only)

- Backgrounds: `#050505` (deepest) → `#0B0F15` (card) → `#151E32` (surface)
- Primary accent: `orange-500` / `amber-400` gradient
- Success: `emerald-500` | Error: `red-500`
- Primary button: `bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold`
- Ghost button: `bg-white/5 border border-white/10 hover:bg-white/10`
- Card: `bg-[#151E32] border border-white/5 rounded-xl`
