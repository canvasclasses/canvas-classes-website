# Drop Year Planner — Build Spec (v1)

**Date:** 2026-06-07
**Author:** Canvas (with Claude)
**Status:** BUILT — live at **`/study-planner`** (renamed 2026-06-08 from `/drop-year-planner`, 301 redirect in place; product display name "Study Planner"). Multi-mode (Class 11/12/Dropper) shipped; **Phase 5 (Physics + Math in Dropper) shipped 2026-06-08**. NOTE: paths below that say `/drop-year-planner` are historical — the route folder is now `apps/student/app/study-planner/` (API path + saved-state key keep the `drop-planner` identifier).
**Last touched:** 2026-06-08
**2026-06-08 refinements:** "Study Plan" rename; physics grouped into PW/Allen modules (`PHYSICS_GROUP_MAP`); single-class groups drop the redundant "Class N" label; **roadmap day-count is student-editable** (`ModeState.chapterDays` → `computeRoadmapLayout` re-flows the whole timeline + buffer pool); plan-stat cards tinted.
**Next action:** Backfill physics/math research weightage + difficulty + one-shot videos (content task — edit the maps in `apps/student/app/study-planner/planner-data.ts`); optionally extend physics/math to the Class 11/12 modes; consider adding a JEE/NEET exam toggle alongside the batch modes.
**Blocked on:** —
**Scope:** Original v1 was Chemistry-only. Now: Class 11/12 modes (Chemistry) + Dropper mode (Chemistry full-feature, Physics + Math as catalog + BYO-resource with Crucible for practice).

---

## 1. Context & Goal

We have a YouTube video shipping on JEE 2027 drop-year strategy. Its core message: a
drop is **~6 months of real learning**, students fail from **stress + perfectionism + scattered
resources**, and the fix is a **systematic, chapter-wise plan** with the
**Learn → Solve → PYQ → Re-test** loop.

This spec turns that message into a product: a single evergreen page —
**`/drop-year-planner`** — that is one chapter-wise control panel for the entire
syllabus. Every chapter's lectures, notes, practice questions, and flashcards are one
click away, so a student never hunts across the site. It is also the video's **lead
magnet** (CTA: "open the free planner") and a natural funnel home for the future
mentored course.

### What makes this not-a-checklist (the flagship features)
1. **Reverse-planner from a target date** — back-distributes chapters across the weeks the student actually has.
2. **High-yield weightage badges** — derived from our existing per-chapter question counts.
3. **Learn → Solve → PYQ → Re-test loop** — four sub-steps per chapter, with an auto-scheduled spaced re-test.
4. **Diagnostic onboarding + progress dashboard** — self-rate per subject, pre-tag chapters, track streak + chapters-at-risk.
5. **Bring Your Own Lecture (student-added resources)** — paste a preferred YouTube/Drive/Vimeo link into any chapter; it plays inline in the same window as our curated resources. Personalisation without leaving the planner.

### Non-goals (v1)
- Physics / Math / Biology (deferred to v2; resource coverage is thinner there).
- Fixed calendar dates baked into the catalog (planner is date-agnostic; the student sets their own deadlines).
- A new admin CMS for the catalog — v1 curates a code-owned data file (see §4).
- Tagging the Book / Lecture data models with taxonomy IDs in Mongo (deferred; we use a curated map instead — §4.3).

---

## 2. Prior art we reuse (this is ~80% built)

The archived BITSAT plan is the same engine, day-based. We clone and re-shape it
**chapter-based**.

| BITSAT file (archived) | Reuse plan |
|---|---|
| `apps/student/app/_bitsat-2026-archive/page.tsx` | Model for the Server-Component landing + JSON-LD. |
| `apps/student/app/_bitsat-2026-archive/plan/PlanShell.tsx` | → `PlannerShell.tsx` (state orchestrator, responsive 3-col grid). |
| `.../plan/CurriculumRail.tsx` | → `SubjectRail.tsx` (subject → chapter nav, completion ticks). |
| `.../plan/DayContent.tsx` | → `ChapterContent.tsx` (chapter hero, the 4-step loop, embedded resource). |
| `.../plan/ResourcePanel.tsx` | Reused near-verbatim (resources grouped by kind, checkboxes, embeds). |
| `.../plan/planData.ts` | → `chemistryPlanData.ts` (chapter catalog + resources — see §4). |
| `.../usePlanProgress.ts` | → `usePlannerState.ts` (extended: completion **+ deadlines + diagnostic + settings** — see §5). |
| `.../api/.../progress/route.ts` | → `/api/drop-planner/progress` (Bearer-token GET/PUT, jsonb blob — see §5). |

Key persistence pattern we keep: **localStorage-first hydration, then Supabase merge on
auth, debounced PUT sync.** (`usePlanProgress.ts:101-220` is the reference implementation.)

---

## 3. Architecture & rendering (must follow CLAUDE.md §10)

```
/drop-year-planner                         page.tsx  (Server Component, cacheable)
  ├─ export const revalidate = 3600        // public catalog; NEVER force-dynamic
  ├─ generateMetadata()                    // SEO + JSON-LD
  ├─ getChemistryCatalog()                 // public read: taxonomy + question counts
  └─ <PlannerClient catalog={...} />       // 'use client' island — ALL per-user state
```

- The page is a **Server Component reading only public data** (chapter list + question
  counts). It is fully cacheable.
- **Every per-user bit** (completion, deadlines, diagnostic ratings, target date, streak,
  revision queue) lives in the `'use client'` island via `usePlannerState`. No
  `cookies()`/`headers()` at page or layout level. No `force-dynamic`. No server
  `searchParams` read.
- Catalog data: chapter `id`, `name`, `category`, `class_level`, `question_count`,
  `star_question_count` come from `buildChaptersWithCounts()`
  (`apps/student/features/crucible/lib/chapterCounts.ts`) — already public and used by
  `/the-crucible/[chapterId]`. The curated resource links (§4) are static and bundled.
- Reference implementations to mirror for the cacheable-shell + client-island split:
  `apps/student/app/the-crucible/[chapterId]/page.tsx` + `CrucibleChapterClient.tsx`.

---

## 4. The catalog & the resource map (the real work)

The UI is mostly ported. **The critical path is the per-chapter resource catalog**,
because lectures/notes/flashcards are **not** keyed by taxonomy chapter ID today.

### 4.1 Catalog shape (`chemistryPlanData.ts`)

```ts
export type ResourceKind = 'lecture' | 'notes' | 'questions' | 'flashcards' | 'tool';

export type PlannerResource = {
  label: string;
  kind: ResourceKind;
  href: string;            // deep link into the site
  embedUrl?: string;       // YouTube/PDF iframe (lectures, notes) — same as BITSAT
};

export type LoopStep = 'learn' | 'solve' | 'pyq' | 'retest';

export type ChapterPlanItem = {
  chapterId: string;       // taxonomy id, e.g. 'ch11_mole'  (authoritative key)
  name: string;            // 'Mole Concept'
  category: 'Physical' | 'Inorganic' | 'Organic' | 'Practical';
  classLevel: 11 | 12;
  sequence: number;
  // weightage tier is DERIVED at render from question counts (§ flagship 2),
  // with an optional curated override here:
  weightOverride?: 'high' | 'medium' | 'low';
  resources: PlannerResource[];                 // grouped by kind in the UI
  // which resource indices satisfy each loop step (so a step is "done"
  // when its mapped resources are checked):
  stepResources: Partial<Record<LoopStep, number[]>>;
};

export const CHEMISTRY_CHAPTERS: ChapterPlanItem[] = [ /* ~25 chapters */ ];
```

Module / step IDs (for completion tracking, mirroring BITSAT's `moduleId`):
- Resource module id: `${chapterId}#${resourceIndex}` (e.g. `ch11_mole#0`).
- Loop step id: `${chapterId}:${step}` (e.g. `ch11_mole:pyq`).

### 4.2 Resource deep-links per kind

| Kind | URL we link to | Mapping status |
|---|---|---|
| **questions** | `/the-crucible/{chapterId}` | ✅ Automatic — keyed by taxonomy id already. |
| **lectures** | `/class-11/chemistry` / `/class-12/chemistry` / `/one-shot-lectures` (+ YT `embedUrl`) | ⚠️ Curated — lecture data uses slugified names, not taxonomy ids. |
| **notes** | NCERT Simplified book page (+ Drive PDF `embedUrl`) | ⚠️ Curated — book chapters keyed by Mongo `chapter_number`, not taxonomy id. |
| **flashcards** | `/chemistry-flashcards/{slug}` | ⚠️ Curated — slug per chapter. |

### 4.3 How we build the curated map (one-time content pass)

1. **Seed script** (`scripts/seed-drop-planner-catalog.js`): pull the 25 chemistry chapters
   from taxonomy; for each, fuzzy-match by **name** against `lecturesData.ts`,
   the NCERT Simplified book chapters (Mongo), and the flashcard slugs. Emit a draft
   `chemistryPlanData.ts` with best-guess links + `NEEDS_REVIEW` markers where no
   confident match exists.
2. **Manual verification pass**: Canvas reviews/fixes the ~25×4 ≈ 100 links. This is the
   real cost of v1 — not the React. (`anti-hallucination`: never invent a link; mark
   `NEEDS_REVIEW` and leave the resource out until verified.)
3. The catalog ships as a bundled TS file (cacheable, no runtime DB lookups for links).

> **Decision:** code-owned data file for v1 (matches BITSAT's `planData.ts`). If the
> catalog later needs non-engineer editing, promote it to an admin-managed collection in
> a v2 — out of scope now.

---

## 5. Per-user state (`usePlannerState`)

We extend BITSAT's progress hook from "a set of completed modules" to a small JSON
document, because the planner stores deadlines, diagnostic, settings, and a revision
queue — not just completion.

```ts
type UserResource = {
  id: string;              // client-generated nanoid; module id = `${chapterId}#custom:${id}`
  label: string;           // student-provided title (cap 120 chars)
  kind: ResourceKind;      // default 'lecture'
  url: string;             // raw pasted URL (validated: https + host allowlist)
  embeddable: boolean;     // true => plays in-window; false => "open in new tab" link
  addedAt: string;         // ISO
};

type PlannerState = {
  completed: string[];                 // module + step ids done (see §4.1)
  deadlines: Record<string, string>;   // chapterId -> ISO date (student-set)
  diagnostic: Record<string, 'strong' | 'weak' | 'new'>;  // chapterId -> self-rating
  revision: { stepId: string; chapterId: string; dueOn: string }[];  // spaced re-tests
  customResources: Record<string, UserResource[]>;  // chapterId -> student-added (§6.5)
  settings: { targetDate?: string; track?: 'jee_main' | 'jee_advanced' | 'neet' };
  streak: { count: number; lastActiveDate: string };
  schemaVersion: 1;
};
```

> Note: we store the **raw `url`** (not a client-built embed src). The iframe `src` is
> re-derived at render by the shared pure parser `toEmbed(url)` (§6.5), so there is a
> single trusted source of truth and the server never has to trust a client-supplied
> embed string.

### Persistence (same model as BITSAT, richer payload)
- **localStorage key:** `drop-planner-state-v1` (single JSON blob).
- **Server:** `/api/drop-planner/progress` — `GET` returns `{ state }`, `PUT` upserts.
  Auth via Supabase Bearer token (reuse the exact pattern in `usePlanProgress.ts:110-123`).
- **Storage:** new Supabase table `drop_planner_progress (user_id uuid pk, state jsonb,
  updated_at timestamptz)`. One row per user. (Simpler than the BITSAT two-array schema;
  the whole blob is opaque to the server.)
- **Merge on auth:** local ∪ server, newest `updated_at` wins per top-level key; then
  debounced PUT. Same cancellable-effect shape as the reference hook.

### Security (CLAUDE.md §8)
- `PUT` validates the body with a Zod schema (`PlannerState`), caps array sizes (e.g.
  `completed` ≤ 500, `revision` ≤ 500, `customResources` ≤ 10 per chapter / ≤ 200 total),
  and writes only the authenticated user's row (`user_id` from the verified token, never
  from the body).
- **Custom-resource URLs** are validated server-side too (not just client): https-only,
  host via strict `.endsWith()` allowlist (`youtube.com`, `youtu.be`, `drive.google.com`,
  `vimeo.com`), and an ID must be extractable. The server never stores a client-built
  embed src — only the raw `url` + the `embeddable` flag it computes itself.
- Generic error messages only; no internals leaked.

---

## 6. Flagship features — behaviour

### 6.1 Reverse-planner from a target date
- Input: `settings.targetDate` (default suggestion: end of November = "syllabus-done"
  per the video; show the 6-month reality as helper text).
- Algorithm: take **incomplete** chapters in catalog order (optionally weighted by tier so
  high-yield front-loads). Compute `weeksAvailable = (targetDate - today)/7`. Assign each
  chapter a soft "do-by" week proportional to its share; surface **"you're N chapters
  behind pace"** by comparing completed-count vs expected-by-today.
- Pure function `computePace(state, catalog, today)` → `{ behindBy, suggestedThisWeek[],
  onTrack }`. No dates stored in the catalog; everything derived live. Unit-testable.

### 6.2 High-yield weightage badges
- Derive tier from existing counts at render:
  `high` if `star_question_count ≥ T1` or `question_count ≥ T2`, etc. (tune thresholds on
  real data); `weightOverride` in the catalog wins when set.
- Badge on each chapter row ("🔥 High yield" / "Core" / "Light"). Sort/filter control:
  "show high-yield first".

### 6.3 Learn → Solve → PYQ → Re-test loop
- Each chapter renders the 4 steps as ordered, checkable sub-items (not one "done").
- `stepResources` maps each step to the resources that satisfy it; checking the resources
  ticks the step (and vice-versa for a manual step check).
- **Spaced re-test:** when `solve`/`pyq` (or the whole chapter) is completed, push a
  `revision` entry `dueOn = today + 7d`. The **Revision Due** queue (top of dashboard)
  surfaces entries whose `dueOn ≤ today`, each linking back to that chapter's PYQ set +
  flashcards. Completing a re-test can re-schedule at +21d (expanding interval) — simple
  spaced repetition.

### 6.4 Diagnostic onboarding + progress dashboard
- **Onboarding** (first visit, dismissable, re-runnable): a quick pass to rate chapters
  (or category buckets) `strong / weak / new`. Effect:
  - `strong` → chapter defaults to **revise-only** (collapses the loop to just
    Re-test + notes skim).
  - `weak` / `new` → **full build** (all 4 steps).
- **Dashboard** (page header / side): overall %, per-category rings
  (Physical/Inorganic/Organic/Practical), **streak**, and **"chapters at risk"**
  (deadline `< today` and not complete). Pure derivations from `PlannerState` + catalog.

### 6.5 Bring Your Own Lecture (student-added resources)
Students aren't locked to our suggested lectures — they can add their own preferred
content per chapter, and it plays inline in the same embed window.

- **Add flow:** an **"+ Add your own"** button in the `ResourcePanel` for the chapter opens
  `AddResourceForm` — paste a URL, optional label, pick `kind` (default `lecture`). On
  submit we parse + validate, then append a `UserResource` to
  `state.customResources[chapterId]`.
- **Play-in-window:** the shared pure parser `toEmbed(url)` converts a watch URL to an
  embeddable src by extracting a validated ID:
  - YouTube (`watch?v=`, `youtu.be/`, `/shorts/`, `/embed/`, optional `t`/`start`) →
    `https://www.youtube.com/embed/<id>` (id `^[A-Za-z0-9_-]{11}$`).
  - Google Drive (`/file/d/<id>/`) → `…/preview`.
  - Vimeo (`vimeo.com/<digits>`) → `player.vimeo.com/video/<id>`.
  - Anything else → `embeddable: false`; saved as an **external "open in new tab" link**
    (we don't fake an embed that the host's CSP would block).
- **Parity with curated resources:** custom items render in the right group with a subtle
  **"yours"** tag, can be **selected into the play window**, **checked off** toward
  completion (module id `${chapterId}#custom:${id}`), **edited**, and **removed**. A
  `kind: 'lecture'` custom item shows under the chapter's Learn group and can manually
  satisfy the **Learn** loop step.
- **Cross-device:** because it lives in `PlannerState`, a logged-in student's added
  lectures sync across devices.
- **Safety:** the iframe is built only from `toEmbed()` output (never the raw string),
  https + host-allowlist enforced, sandbox/referrer attributes set. Blast radius is
  self-only, but we validate on client **and** server (§5 security).

---

## 7. Component inventory

Ported/adapted from BITSAT:
- `PlannerClient.tsx` (was the landing client) — top-level island; renders dashboard + shell.
- `PlannerShell.tsx` (was `PlanShell`) — responsive grid, rail/panel collapse, selected-resource embed.
- `SubjectRail.tsx` (was `CurriculumRail`) — Class 11/12 + category groups → chapter list with ticks + weight badges.
- `ChapterContent.tsx` (was `DayContent`) — chapter hero, the 4-step loop, embedded resource iframe.
- `ResourcePanel.tsx` — reused; resources grouped by kind with checkboxes + external-link/embed.

New for the planner:
- `ReversePlannerBar.tsx` — target-date picker + pace readout (6.1).
- `WeightageBadge.tsx` — tier chip (6.2).
- `DiagnosticModal.tsx` — onboarding self-rating (6.4).
- `ProgressDashboard.tsx` — rings, streak, chapters-at-risk (6.4).
- `RevisionQueue.tsx` — spaced re-test list (6.3).
- `DeadlinePicker.tsx` — per-chapter deadline + countdown/overdue state.
- `AddResourceForm.tsx` — paste-a-URL form for student-added resources (6.5).
- `lib/toEmbed.ts` — shared pure URL→embed parser + host allowlist (used by client form, render, and server validation).

Styling: same dark tokens as BITSAT/site — `bg-[#050505]` / `#0B0F15` / `#151E32`,
**orange-500 / amber-400** accents (the planner uses the orange brand line, not BITSAT
blue), `border-white/[0.05]`, `rounded-xl/2xl`, `var(--font-outfit)` headings.

---

## 8. SEO / discoverability (unlike archived BITSAT, this is indexed)
- `generateMetadata`: title e.g. **"Free JEE 2027 Drop Year Planner — Chapter-wise Study Tracker"**; keywords around "JEE drop year plan", "JEE 2027 study planner", "chapter wise JEE tracker".
- JSON-LD: `WebApplication` (or `Course`) schema.
- **Add to `apps/student/app/sitemap.ts`** (BITSAT was removed; this one stays in).
- robots: indexable; answer-crawlers allowed per §10.6 (no change needed).

---

## 9. Build phases

1. **Catalog** — seed script + manual verification of ~25 chemistry chapters' resources (§4.3). *Critical path; gates everything visual.*
2. **Engine port** — copy BITSAT plan components into `/drop-year-planner`, swap day→chapter, wire `chemistryPlanData.ts`, drop fixed dates. Page renders catalog + Crucible deep-links.
3. **State layer** — `usePlannerState` + `/api/drop-planner/progress` + Supabase table + Zod validation. Completion + deadlines working.
4. **Loop + revision + BYO resources** — 4-step model, spaced re-test queue (6.3), and student-added resources with `toEmbed` parser + `AddResourceForm` (6.5).
5. **Reverse-planner + weightage** — `computePace`, target-date bar, weight tiers/badges (6.1, 6.2).
6. **Diagnostic + dashboard** — onboarding modal, rings/streak/at-risk (6.4).
7. **SEO + polish** — metadata, JSON-LD, sitemap, responsive QA, empty/loading states.
8. **Verify** — caching check (no force-dynamic / E132), security checklist (§8.10), mobile pass.

Phases 2–6 are mostly mechanical given the BITSAT base. Phase 1 is the labour.

---

## 10. Open questions
1. **Route/name:** `/drop-year-planner` vs `/jee-2027-planner` vs evergreen `/jee-planner`? (Recommend `/drop-year-planner` — evergreen, matches the video.)
2. **Weight thresholds (T1/T2):** tune against live question counts before launch — or ship curated `weightOverride` for the top ~8 chapters and derive the rest?
3. **Diagnostic granularity:** rate per chapter (precise, slower onboarding) or per category bucket (faster, coarser)? (Recommend per-bucket with optional per-chapter refine.)
4. **Default target date:** hard-suggest "30 Nov" (the video's syllabus-done line) or leave blank until the student sets it?
5. **Lead-magnet tie-in:** should the video CTA point here instead of the static PDF checklist? (Recommend yes — stickier, drives sign-ins.)
6. **BYO-resource host allowlist (6.5):** v1 = YouTube + Google Drive + Vimeo. Add any others (e.g. a specific notes host) or keep it tight for safety?
7. **Non-embeddable links:** when a pasted URL can't be embedded, save it as an external "open in new tab" link (recommended) or reject with a message asking for a YouTube/Drive link?

---

## 11. Risks
- **Resource-map drift:** curated links break if lecture/book slugs change. Mitigation: the seed script is re-runnable as a periodic audit; `NEEDS_REVIEW` markers surface gaps.
- **Scope creep from 4 flagship features at once:** mitigate by shipping phases 2–3 behind a feature flag first (planner usable as a clean aggregator), then layering 4–6.
- **Caching regression:** any accidental server-side auth/searchParams read flips the page dynamic (§10). Mitigation: keep the page a pure public Server Component; all per-user logic in the island — enforced in Phase 8 verify.
