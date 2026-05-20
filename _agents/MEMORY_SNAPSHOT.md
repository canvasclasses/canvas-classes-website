# Memory Snapshot — 2026-05-17

This is a verbatim copy of the per-project auto-memory directory from one
developer's machine, frozen at a point in time so it travels with the repo
and is accessible from any clone.

**Why this file exists:** Claude Code's auto-memory lives in
`~/.claude/projects/<project-hash>/memory/` — local-filesystem state that
doesn't sync across devices (even on the same Anthropic subscription) and
doesn't reach collaborators. This snapshot makes the captured context
portable. If a collaborator (or the same developer on a second device) opens
this repo, they can read this file to recover the same working context.

**What's in here:**

- **Project memos** — point-in-time handoffs from past sessions. The most
  recent one (monorepo migration complete) is canonical; the older ones
  (Phase 5 handoff, Phase 4.++ handoff, May 2026 refactor notes) are
  historical and superseded but kept for context.
- **Feedback memos** — durable preferences the user gave during past
  sessions. Several of these are now also captured in repo docs
  (`CLAUDE.md`, the workflows under `_agents/workflows/`) — those are the
  load-bearing copies. The memos here add the *reason* and the original
  incident that drove the rule.

**How to use it:**

- A new agent or new contributor should read [CLAUDE.md](../CLAUDE.md),
  then the [ADRs](./adr/), then the [migration plan](./MONOREPO_MIGRATION_PLAN.md),
  then [the deepening backlog](./DEEPENING_BACKLOG.md), and only then this
  snapshot. The snapshot fills in *colour* the canonical docs may leave out.
- Memories age. Many of the entries below were point-in-time observations
  about code that has since moved or been rewritten. Verify against current
  code before treating a file:line citation as fact. The "Last updated"
  date on each block is when it was captured into local memory, not when
  the code it describes was last touched.
- Do NOT auto-execute things this snapshot describes (e.g. "promote X to a
  shared package") — those were *suggestions* in the moment, not standing
  orders. Treat them like a shared notebook, not a task list.

**How this file is maintained:**

This is a manual snapshot. The live auto-memory continues to live in
`~/.claude/projects/<project-hash>/memory/` on each developer's machine and
will drift over time. To refresh this snapshot, regenerate from the source
of truth (whichever developer's machine is most current) and commit. A more
permanent solution (e.g. symlink each developer's memory dir into an
iCloud/Dropbox-synced folder, or commit a small subset of durable memos
directly) is up for discussion. See the discussion at the end of this
file.

---

## Index (mirrors the local `MEMORY.md`)

### Project state (most recent first)
- [Monorepo migration COMPLETE (2026-05-16)](#monorepo-migration-complete--2026-05-16) — canonical
- [Phase 5 handoff (superseded)](#phase-5-handoff--admin-app-split-branch-code-refactor) — historical
- [Phase 4.++ handoff (superseded)](#phase-4-handoff--monorepo-refactor-branch-code-refactor) — historical
- [Architecture refactor May 2026](#codebase-architecture-refactor--may-2026) — historical

### Feedback / preferences
- [Don't use preview tools](#dont-use-preview-tools)
- [Diagnose before patching](#diagnose-before-patching)
- [Coord-chem LaTeX rules](#coord-chem-latex-rules)
- [Solution voice](#solution-voice--simple-hinglish-friendly-english)
- [Book-page image prompts use dark backgrounds](#book-page-image-prompts-use-dark-backgrounds)
- [No figure descriptions in question ingestion](#no-figure-descriptions-in-question-ingestion)

---

# Project state

## Monorepo migration COMPLETE — 2026-05-16

**Captured:** 2026-05-16 (canonical — supersedes Phase 5 + Phase 4.++ handoffs).

The canvas → monorepo migration is code-complete on branch `code-refactor`.
Phases 0 → 6 all DONE. Awaiting final smoke test before merge to `main`.

**Why:** Tracks the end state of a multi-week refactor so future agents don't
re-derive the structure or accidentally undo decisions. The ADRs are the
canonical "why"; this memory is the "where to look."

**How to apply:**
- Final repo shape: two apps (`apps/student/`, `apps/admin/`) + five
  packages (`@canvas/{core,data,persona,services,ui}`).
- Both apps host `/api/v2/*` routes. Nine of them are thin wrappers over
  `@canvas/services/<route>` (see ADR-001). Don't edit handler logic in
  `apps/*/app/api/v2/...` — go to the service file.
- Admin auth is Shape A (Supabase + ADMIN_EMAILS). Shape B is a future
  swap of `apps/admin/lib/auth.ts` only — see ADR-003.
- Read [`_agents/adr/`](./adr/) before changing route auth, package
  boundaries, or admin login.

**Key paths**:
- ADRs: `_agents/adr/001-…md` through `006-…md` + `README.md` (index)
- Migration plan: `_agents/MONOREPO_MIGRATION_PLAN.md` (now marked DONE)
- Deepening backlog: `_agents/DEEPENING_BACKLOG.md`
- CLAUDE.md §7 has the updated Key Files table

**Outstanding (user-owned or deferred):**
- Phase 5.9 — manual smoke test (admin login, question CRUD, flashcard
  CRUD, asset upload) before merging to `main`
- Phase 5.5d — MongoDB user permission split (read-only Mongo user for
  student app). Deferred until Phase 5 observed stable in prod.
- Vitest scaffolding — out of scope for this migration; defer to a
  separate ticket when tests are actually being added.

**Last commits on `code-refactor` (as of this snapshot, 2026-05-17):**
- `92ca5b7` docs(architecture): add deepening backlog from post-migration audit
- `626b849` fix(admin): stale /admin/blog redirect after URL flatten
- `9e28ad3` refactor(admin): flatten URLs, rename Crucible, add landing card grid
- `8fc6131` docs(monorepo): Phase 6.3 — refresh CLAUDE.md + plan doc for end-of-migration
- `5360b2f` docs(monorepo): Phase 6.2 — add Architecture Decision Records
- `3d93e70` chore(monorepo): Phase 6.1 — address code-reviewer findings
- `84b3afa` chore(monorepo): Phase 6.0 — extract duplicated routes into @canvas/services

---

## Phase 5 handoff — admin app split, branch `code-refactor`

**Captured:** 2026-05-16. **Superseded by** the "Monorepo migration COMPLETE"
memo above — kept for the per-commit narrative that the canonical memo
summarizes.

**Status (2026-05-16):** code-complete. HEAD = `c42096a`. Branch NOT yet
merged or deployed.

### Commits (in order)

| Commit | Sub-phase | Headline |
|---|---|---|
| `e71d5a7` | 5.0 | Decision record (`_agents/plans/PHASE_5_ADMIN_SPLIT.md`) — split API by method, Shape A auth, subdomain URL strategy |
| `c6ad600` | 5.1 | Scaffold `apps/admin/` Next.js 15 shell — deps, config, Sentry, tailwind, hello page |
| `0f34ae4` | 5.2 | Admin auth + middleware — Supabase + ADMIN_EMAILS, gates all paths except /login + /api/auth/* + /_next/* |
| `09b7f89` | 5.3+5.4 | Move ~30 admin components + ~16 route shells from student to admin; URL flattening (drop /crucible prefix) |
| `3812df4` | 5.5a | Move 12 pure-admin API routes (ai/*, books admin methods, career-explorer admin, taxonomy/save, etc.) |
| `96994fa` | 5.5b | Split MIXED API routes (careers/route, careers/[slug]/route, questions/route, mock-tests/route, mock-tests/[id]/route) + move admin-namespace routes (admin/*, blog/*, questions admin sub-routes, mock-tests/[id]/questions/*) + copy assets/upload to admin |
| `c17a407` | 5.7 | Strip dead /crucible/admin auth code from student/middleware.ts + rewrite features/crucible/README.md |
| `6b8a064` | 5.10 | **Code-reviewer fixes (Critical+Important):** C1 — duplicate 8 routes admin UI fetches (questions, questions/[id], flashcards, flashcards/[id], chapters, taxonomy/load, assets/[id], export/ppt); C2 — sweep stale /crucible/* URLs throughout admin; I1 — rewrite /admin/books placeholder copy; I2 — drop unused requireAuthedUser; I3 — tighten middleware matcher to exclude full /_next/* tree |
| `4199ba0` | 5.11 | **Security-auditor fix (High):** H1 — admin login open-redirect via backslash normalization. Replaced inline `startsWith('/') && !startsWith('//')` check with `sanitizeRedirect` from `@canvas/core/redirect-validation` (parser-based, spec-compliant) |
| `2f9b53d` | 5.12 | Final docs — CLAUDE.md monorepo layout + duplicates section, CRUCIBLE_ARCHITECTURE.md §0a topology, PHASE_5_ADMIN_SPLIT.md status + commit list |
| `9d7d40b` | 5.13a-c | Helper-package consolidation: flashcardTaxonomy → `@canvas/data/flashcards/`, flashcardMarkdown → `@canvas/ui/flashcardMarkdown`, books utils + schemas → `@canvas/data/books/`. Also fixed Low/Info: `/login?redirect=` → `/login?next=` |
| `c42096a` | 5.13d | Final pure-helper consolidation: rbac.ts → `@canvas/data/rbac` (12 consumers rewritten). All four pure-helper duplicates from 5.5/5.10 now resolved; only the 9 duplicated route handlers remain |

### What Phase 5 shipped, conceptually

- **`apps/admin/`** is a separate Next.js 15 app at `admin.canvasclasses.in`. Same npm workspace, same `@canvas/{core,data,persona,ui}` shared packages, different deployment.
- Admin gets its **own** `/api/v2/*` surface. Admin pages fetch them same-origin. Admin write routes are unreachable from `canvasclasses.in`.
- Auth model — **Shape A** lifted as-is into admin (Supabase + `ADMIN_EMAILS`). Shape B (bcrypt+JWT+admin_accounts) deferred — now self-contained inside admin app, easy to do later.
- URL strategy — admin URLs flatten: `/crucible/admin/blog` → `admin.canvasclasses.in/admin/blog`, `/crucible/dashboard` → `/dashboard`, etc. All `/crucible/*` routes deleted from student. **(Later revised in commit 9e28ad3 — admin URLs flattened further, dropping the `/admin/` prefix; see ADR-005.)**
- Code-review fixes — duplicated 8 routes (questions, flashcards, chapters, taxonomy/load, assets/[id], export/ppt + their list-style siblings) into admin because admin UI fetches them and they need to be same-origin. Marked with TODO headers for future shared-package consolidation. **(Later resolved in Phase 6.0 via `@canvas/services`.)**
- Security-audit fix — admin login `?next=` parameter open-redirect via backslash normalization. Fixed by routing through the existing `sanitizeRedirect` helper.

### Deferred / queued follow-up work from Phase 5

1. **Manual smoke test (5.9) — OWNED BY USER.** REQUIRED before any preview deploy.
2. **Book editor migration (deferred follow-up phase).** `apps/student/features/books/components/editor/` is 27 admin-only files coupled into the books reader feature, with one outbound edge to `MoleculeViewer` pulling three.js + openchemlib + smiles-drawer. Until the port lands, `admin.canvasclasses.in/books` renders a placeholder.
3. **Phase 5.5d — MongoDB user permission split. DEFERRED BY USER (2026-05-16).** Will revisit once Phase 5 has been deployed and observed stable in production.
4. **Vercel deployment config.** Two Vercel projects: admin.canvasclasses.in for `apps/admin/`, canvasclasses.in for `apps/student/`. Env vars on both. Configure Supabase auth callback URL to include admin.canvasclasses.in.

### Intentional duplications at time of Phase 5 close

After 5.13a-d, all pure-helper duplicates were gone. **Nine duplicated route files remained at the close of Phase 5** — these were resolved in Phase 6.0 by extracting them into `@canvas/services`. The list is preserved for the audit trail:

- `apps/{student,admin}/app/api/v2/questions/route.ts`
- `apps/{student,admin}/app/api/v2/questions/[id]/route.ts`
- `apps/{student,admin}/app/api/v2/flashcards/route.ts`
- `apps/{student,admin}/app/api/v2/flashcards/[id]/route.ts`
- `apps/{student,admin}/app/api/v2/chapters/route.ts`
- `apps/{student,admin}/app/api/v2/taxonomy/load/route.ts`
- `apps/{student,admin}/app/api/v2/assets/[id]/route.ts`
- `apps/{student,admin}/app/api/v2/assets/upload/route.ts`
- `apps/{student,admin}/app/api/v2/export/ppt/route.ts`

---

## Phase 4.++ handoff — monorepo refactor, branch `code-refactor`

**Captured:** 2026-05-16. **Superseded by** the migration-complete memo —
kept for the per-finding narrative of the audit-fix pass.

**Status (2026-05-16):** Phase 4.++ is **DONE**. Committed as `6de1434` after the TCC-revocation pause from the earlier session was lifted.

### Where we are

- Branch: `code-refactor` (based on `main`, **not yet pushed/merged**)
- HEAD at time of capture: `6de1434 chore(monorepo): Phase 4.++ — address security + code-review audit findings`
- Phases 1, 2, 3, 4, 4.+, 4.++ all committed. Local working tree clean.

### What Phase 4.++ shipped (commit 6de1434, 40 files / +107 / -8)

- **C1 (security)** — admin auth on `POST /api/v2/questions/[id]/reclassify` + replaced hardcoded `'admin'` attribution with `user.id`/`user.email` in AuditLog and `updated_by`.
- **I1 (security)** — `import 'server-only';` prepended as line 1 to: `packages/data/db/mongodb.ts`, `packages/data/id-generator/index.ts`, all 30 files in `packages/data/models/`, and `packages/persona/writer.ts`. **Skipped:** `persona/scoring.ts` (client-importable via TestView/BrowseView), `persona/profile-engine.ts` (pure), `persona/recommendation-engine.ts` (currently pure stub — re-evaluate when the real algorithm lands).
- **I2 (security)** — `createRateLimiter({ max: 30, windowMs: 60_000 })` + `getClientIp(req)` guard added to `/api/proxy-svg/route.ts`.
- **I3 (code-review)** — `## Cross-feature dependencies` section added to `features/{crucible,books,legal}/README.md`, each with a trip-wire note for the 2nd consumer.
- **I4 (code-review)** — `.claude/skills/code-reviewer/SKILL.md` import-direction examples refreshed to canonical monorepo paths.
- **I5 (code-review)** — `features/crucible/index.ts` populated with `CrucibleBrand`, `CrucibleQuestionCarousel` (+ `CarouselQuestion` type), `formatExamLabel`. Admin components intentionally NOT barreled.

**Verification:** `npx tsc --noEmit -p apps/student/tsconfig.json` clean, `npm run lint` 0 errors (59 pre-existing warnings), `npm run build` exit 0 with all 2241 static pages generated.

### Suggestions intentionally skipped (still skipped, listed for the record)

Per CLAUDE.md §9. List for the record, not action:
- Self-aliased imports inside same feature (~30 occurrences across crucible, books, etc.)
- Promote `MoleculeViewer` to `apps/student/components/` or `@canvas/ui/` (would also close I3 books→simulations edge — reconsider if a 3rd consumer appears)
- `features/landing/README.md` outbound-deps section
- `packages/core/index.ts` barrel comment about r2-storage server-only
- Add `.limit(5000)` to `.find()` queries on `books/{progress,bookmarks,stats}`, `user/{starred,welcome}` routes

---

## Codebase Architecture Refactor — May 2026

**Captured:** 2026-05-15. **Superseded by** later phase memos; preserved here
for the per-module move detail that the canonical docs summarize.

### Goal
Make the codebase agent-friendly: co-locate feature files, eliminate cross-feature imports, consolidate types, and clean up agent instructions. Done in phases on the `code-refactor` branch.

### Module Moves (as of 2026-05-15 — paths have since changed in the monorepo migration)

| Module | Canonical path at the time |
|---|---|
| MathRenderer | `components/MathRenderer.tsx` |
| Taxonomy data | `lib/taxonomy/taxonomyData_from_csv.ts` |
| Adaptive engine | `app/the-crucible/lib/adaptiveEngine.ts` |

**Shim removal (2026-05-15):** The three re-export shims at the old paths were deleted after ~22 callers were migrated to the canonical paths above. Verified by `npx tsc --noEmit` — zero TS2307 module-resolution errors.

**Import direction rule** (now in CLAUDE.md §7):
> Student-facing code (`app/the-crucible/`) and notes pages must never import from `app/crucible/admin/`. Shared modules belong in `lib/`, `lib/taxonomy/`, or `components/`.

### `/api/v2/questions/route.ts` decomposition (2026-05-15)

Route shrunk **647 → 413 lines** (-36%). Three deep utility modules extracted:

| Module (at the time) | Surface | Hides |
|---|---|---|
| `lib/schemas/question.ts` | `QuestionSchema` + `QuestionInput` type | Zod validation tree |
| `lib/questionIdGenerator.ts` | `generateDisplayId(chapterId)`, `regenerateDisplayId(prefix)`, `getDisplayIdPrefix(chapterId)` | `CHAPTER_PREFIX_MAP` (90+ prefixes), max-sequence query, padding |
| `lib/rateLimit.ts` | `createRateLimiter(opts)` → `Limiter`, `getClientIp(request)` | In-memory Map, TTL cleanup, hard-cap eviction, per-call max override |

**Rate-limit consolidation:** 5 sites previously had their own near-duplicate Map-based limiters. All migrated to `createRateLimiter()`.

### `admin/page.tsx` decomposition (2026-05-15)

**Phase A** (safe extractions, no JSX splits):

- Removed (-45 lines): Duplicate `CHAPTER_PREFIX_MAP` inside `handleAddQuestion`.
- Extracted to `app/crucible/admin/hooks/`: `useAdminKeyNav.ts`, `useAdminFilterUrlSync.ts`.
- Added navigation index: `§1`–`§7` grep-anchors.

**Phase B** (six components extracted with the dev server running). `admin/page.tsx: 2,247 → 1,642 (-605 net lines, -27% this phase; -700 lines / -30% since refactor start)`.

| Component | Lines | Purpose |
|---|---|---|
| `FlagModal.tsx` | 70 | Per-question flag modal. Owns its own `reason` + `note` form state. |
| `AdminSectionTabs.tsx` | 43 | Practice / Mock Tests / Reports tab cluster. |
| `AdminFilterRow.tsx` | 152 | The seven filter dropdowns in TOP_BAR row 2. |
| `AITagSuggestionsBox.tsx` | 52 | Purple inline strip with AI-suggested tag chips. |
| `QuestionPreviewPane.tsx` | 292 | The RIGHT 50% of the practice editor. |
| `QuestionTaggingRow.tsx` | 319 | The TOP metadata strip. |

**Still inline (intentional — interactive complexity / asset uploads):**
- The LEFT 50% question content editor (textareas + SVG drop zones + audio recorder + video drop zone) — ~400 lines.
- The TOP_BAR row 1 (search, prev/next, chapter selector, page navigation, save status, action icons).

### Persona writer centralization (2026-05-15)

The tiered counter contract from `_agents/CRUCIBLE_ARCHITECTURE.md §3.2` / §4.2 had been re-implemented inline in three places — and they had silently diverged. Centralised:

| Module (at the time) | Surface | Hides |
|---|---|---|
| `lib/personaWriter.ts` | `applyAttemptToProgress(progress, attempt)`, `resolveConfidenceTier(confidence, source)` | Tier resolution, all_attempted_ids dedup, chapter_progress mastery_level math, concept_mastery dual counters (mastery + exposure), stats totals, streak day-bucket math |

**Migrations:**
- `UserProgress.recordAttempt` (~140 lines) → delegates to `applyAttemptToProgress` + saves
- `/api/v2/user/progress/batch/route.ts` (~135 lines of duplicate counter math removed)
- `/api/v2/user/progress/route.ts` → uses `resolveConfidenceTier` for the inline ternary

**Side-effect fixes from unification:**
- Batch route's `recent_attempts` cap aligned to 200 (was 100).
- Batch route's `all_attempted_ids` index now includes test-source attempts at any tier (was HIGH only) — matches single-route rule.

### Shared question scoring (2026-05-15)

`isAnswerCorrect(question, selected)` extracted into `lib/questionScoring.ts` (now at `@canvas/persona/scoring.ts`). Three previous copies converged:
- `app/api/v2/test-results/route.ts` — server-side authoritative recompute
- `app/the-crucible/components/TestView.tsx` — client-side test-mode check
- `app/the-crucible/components/BrowseView.tsx` — inline check in `onSubmit`

Closes a security-shaped drift risk: if client and server scoring rules diverge, students could see "correct!" in the UI while the persona signal records "wrong".

### Type Consolidation

`app/crucible/admin/types.ts` (now `apps/admin/features/admin/components/types.ts`) was created — single home for `AdminQuestion`, `AdminChapter`, `QUESTION_TYPES`, `QuestionTypeId`.

### Agent Instruction Cleanup

- Skills moved from `_agents/skills/` (wrong dir, never loaded) to `.claude/skills/`.
- Orphaned workflows wired into the question-ingester skill routing table.
- ARCHITECTURE.md given a deprecation banner pointing to CLAUDE.md.

### What was NOT moved (intentionally — paths from that era)

- `lib/difficultyUtils.ts` — stays in `lib/` because it's used by ncert-solutions, handwritten-notes, and detailed-lectures (cross-feature, not crucible-only). _Now at `packages/data/difficulty.ts`._
- `lib/recommendationEngine.ts` — stays in `lib/` (cross-cutting). _Now at `packages/persona/recommendation-engine.ts`._
- `lib/auth.ts`, `lib/bookAuth.ts` — canonical auth files. _Now per-app at `apps/{student,admin}/lib/{auth,bookAuth,adminAuth}.ts`._

---

# Feedback / preferences

> Several of these have since been promoted into repo docs (workflows,
> CLAUDE.md). The memos here add the *why* and the original incident that
> motivated the rule — the canonical version lives in the linked repo file.

## Don't use preview tools

**Captured:** 2026-04-12 (35 days old at snapshot time).

Never use `preview_start` or any preview_* tools in this project. The user runs their own local server at `http://localhost:3000`. Starting a preview server conflicts with it and causes 404 errors.

**Why:** The preview tool spins up a second Next.js server, and both can't share the same port — the result is the user's dev server starts returning errors.

**How to apply:** After creating or editing a book page (or any other change), simply confirm what was done and let the user verify it themselves on their dashboard. Never open a preview.

**Note (snapshot time):** This is a per-developer preference (the conflict depends on having a local dev server running on 3000). It is NOT team-wide policy — a collaborator on another machine may not have the same setup. Keep in personal memory rather than promoting to CLAUDE.md.

---

## Diagnose before patching

**Captured:** 2026-05-06 (11 days old at snapshot time).

When the user reports something is broken (e.g. "PDFs not loading", "page is broken"), the first move is to **observe the actual failure**, not guess at causes and patch.

**Why:** In one session, the user pushed back after the third successive patchwork attempt: *"I want you to thoroughly check this and identify the root cause instead of doing patchwork."* The actual problem was site-wide `X-Frame-Options: DENY` set in `next.config.ts`. A single `curl -sI` to the endpoint would have shown the deny headers in the first response.

**How to apply:**
- For HTTP/route bugs: `curl -sI <url>` and `curl -so /tmp/x -w '%{http_code} %{content_type}\n' <url>` *first*. Inspect headers + body before touching code.
- For runtime bugs: check dev server logs, browser console — actual error messages — before editing.
- For UI bugs: read the offending screenshot carefully (alt text, error text, network tab) before assuming what's wrong.
- Resist the urge to make a "small fix and see" — that's how you end up with three successive band-aids that all miss the real cause.
- If you're about to change the same file/area for the second time without new diagnostic data, stop and gather data instead.

**Note:** This is team-wide good practice, not just a per-developer preference. Worth promoting to `CLAUDE.md` (e.g. under §10 "Debugging") in a follow-up pass.

---

## Coord-chem LaTeX rules

**Captured:** 2026-04-26 (21 days old at snapshot time).

For coordination compound solutions in `crucible.questions_v2`:

**Rule 1**: Use `\mathrm{...}` for complex/ion formulas, never `\ce{...}`.
- Correct: `$\mathrm{[Fe(C_2O_4)_3]^{3-}}$`, `$\mathrm{K_3[Fe(CN)_6]}$`
- Wrong: `\ce{[Fe(C2O4)3]^{3-}}`, `\ce{K3[Fe(CN)6]}`

**Rule 2**: Do not author detailed balanced reaction equations or any rendered diagrams inside solution markdown. They produce LaTeX rendering errors (verified in CORD-241). Describe reactions in prose instead, or omit the explicit balanced equation entirely. If a diagram is genuinely needed, defer to the image-needed list.

**Why:** User audited the first 5 sample workflow-rewrites (CORD-237/241/251/167/313). Structure and tone were approved; only these two LaTeX issues were flagged. They cause the question-bank front-end to render literal `\mathrm{...}` source text instead of the intended formula.

**How to apply:** Apply to all 320 remaining ch12_coord JEE Main + NEET solution rewrites, and any other coordination-chemistry content authored going forward. The CLAUDE.md general rule "use `\ce{}` for chemical formulas" is overridden specifically for this chapter/domain by this user feedback.

**Note:** Worth a follow-up pass to add this exception explicitly to CLAUDE.md §4 (LaTeX Rules) so the override is canonical, not just remembered.

---

## Solution voice — simple, Hinglish-friendly English

**Captured:** 2026-04-26 (21 days old at snapshot time).

When writing student-facing solutions, explanations, or any pedagogical content for the Crucible question bank (and Canvas Classes content broadly), use **simple, friendly English** at the level of a coaching-class teacher in a North Indian city — not the level of a textbook author or science journalist.

**Why:** The user explicitly flagged that words like "calibrated", "manufacture precision", "operand", "captive zero", "diagnose", "deterministic", "load-bearing", "intuition fails", "dressed up to look careful" are too refined. Students in Himachal, Uttarakhand, UP, Bihar etc. study in Hinglish, watch coaching videos in Hinglish, and will not connect with literary English even if they technically understand it. Connection matters as much as comprehension.

**How to apply:**
- Sentence length under 20 words; never over 30.
- Use "you" directly — like a teacher at the board.
- Replace refined vocabulary with the shorter/more common equivalent. The full ban list lives in `_agents/workflows/chemistry-solution-workflow.md` (mirrored in `physics-solution-workflow.md`) under "Voice & Vocabulary".
- It is fine to use NCERT subject terms (molar mass, oxidation state, atomicity, equivalent weight, STP) — those are subject vocabulary, not "refined English".
- Lean on friendly phrasings: "Many students mark this — but...", "The trick is...", "Don't get confused by...", "Remember:", "This is the most common mistake."
- The 🧠 section must sound like a teacher *saying* the line in class, not writing it for a journal.

**Scope:** This applies to all Crucible solutions, simulator copy, blog posts targeted at JEE/NEET aspirants, and any other student-facing prose. Does not apply to admin UI, internal docs, or code comments.

**Note:** Canonical versions are in `_agents/workflows/chemistry-solution-workflow.md` and `_agents/workflows/physics-solution-workflow.md` (the two sibling workflows share identical voice rules). This memo adds the reasoning + word-list examples that drove the rule.

---

## Book-page image prompts use dark backgrounds

**Captured:** 2026-05-04 (13 days old at snapshot time).

All image `generation_prompt` fields on book pages must specify a **dark background**, regardless of subject (chemistry, physics, biology) or block type (hero banner, apparatus, scene illustration, scientist portrait). The Canvas reader uses a dark theme; light-background images break visual consistency.

**Why:** Confirmed by user on 2026-05-03 while planning Class 9 motion chapter. Initial proposal was to use NCERT-style light/cream backgrounds for physics scene illustrations to mimic the printed textbook. User overrode: *"image prompts are designed for a dark background because that will be consistent with how we have designed every page."*

**How to apply:**
- Every `generation_prompt` ends with the standard tail: *"Dark background (#0a0a0a or near-black), orange accent labels and arrows, clean technical illustration style."*
- For Class 9 hero banners (painterly): *"Dark cinematic background, atmospheric Indian-illustration style, no text overlay."* — never bright white or sterile.
- For physics scene illustrations (a girl on a track, a car on a highway, a marble in a ring): keep characters in colour, but set them against a **dark or twilight backdrop** — never daylight blue sky or white page background.
- This rule overrides the NCERT printed-book aesthetic. We are not reproducing the textbook; we are presenting the same content in our own dark-themed reader.

**Note:** Should be promoted to `_agents/workflows/BOOK_PAGE_WORKFLOW.md` so this is canonical, not just remembered.

---

## No figure descriptions in question ingestion

**Captured:** 2026-05-08 (9 days old at snapshot time).

When ingesting questions, **do not write `[FIGURE: ...]` description blocks** inside `question_text.markdown`. The user adds the actual images manually via the admin dashboard after insertion, so a written description of the figure is redundant and clutters the markdown.

The question text may still reference "as shown in figure" if that wording appears in the source — just don't follow it with a description.

**Why:** User explicitly told me on 2026-05-07 during the WEP chapter: *"the questions containing images do not write the prompt for the image because images will be added manually, so the prompt is not required."*

**How to apply:** Skip the `[FIGURE: ...]` block in every new ingestion buffer. Existing inserted questions that already contain figure descriptions can be left as-is unless the user asks for a cleanup pass. The Phase 2 figure-upload step in the workflow doc still applies — I just don't pre-populate the description.

**Note:** Should be promoted to `_agents/workflows/QUESTION_INGESTION_WORKFLOW.md` so this is canonical.

---

# Future cleanup (recommended)

Several memos above are explicitly flagged as "promote to repo doc":

- **Coord-chem LaTeX rules** → add to `CLAUDE.md §4` (LaTeX Rules) as a chapter-scoped exception to the `\ce{...}` rule.
- **Book-page image prompts use dark backgrounds** → promote to `_agents/workflows/BOOK_PAGE_WORKFLOW.md`.
- **No figure descriptions in question ingestion** → promote to `_agents/workflows/QUESTION_INGESTION_WORKFLOW.md`.
- **Diagnose before patching** → optionally promote to `CLAUDE.md` as a team-wide debugging norm.

Once promoted, this snapshot can be regenerated (and the corresponding memo
can either be deleted from the local memory dir or kept as the "background"
copy with the canonical doc as the load-bearing reference).

Memos that should stay personal (not promoted):
- **Don't use preview tools** — per-developer machine setup.
