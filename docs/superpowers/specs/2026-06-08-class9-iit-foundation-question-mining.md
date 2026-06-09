# Junior Question Bank + IIT Foundation Question Mining (Class 6–10)

**Date:** 2026-06-08
**Status:** P0–P3 built (thin vertical slice). P2 first batch (10 Ch5 questions) seeded for review. P4/P5 pending.
**Owner:** Paaras

## What this is

A reusable, multi-grade **Junior Question Bank** (grades 6–10) powering livebook
chapter-end practice and custom mock tests — seeded by mining the legacy **IIT
Foundation Chemistry (Class 8 & 9)** question banks for material that still maps to the
new-syllabus livebooks. Crucible (`questions_v2`) stays competitive-only (JEE/NEET).

## Decisions (locked)

| # | Decision |
|---|---|
| 1 | Junior questions live in a **proper reusable collection** (`junior_questions`), NOT embedded-per-page, NOT in `questions_v2`. |
| 2 | Authoring is a **new admin-app panel + editor** (`apps/admin`). Not student-side. |
| 3 | Bank powers (a) livebook chapter-end practice, (b) **chapter-end custom mock test** like Crucible, (c) future worksheets/quizzes. |
| 4 | Question formats v1: **MCQ + assertion-reason**, diagram-capable. Richer formats (fill-blank/match) stay as in-page book interactions (`apply_challenge`/`classify_exercise`), NOT the bank. |
| 5 | **Progress unifies at the event/mastery layer**, not the question schema. Junior attempts write the same mastery-event shape Crucible uses; livebook progress feeds the adaptive/recommendation engine. |
| 6 | Crucible reserved for competitive MCQ/NVT (class 11–12 + advanced 9–10), reachable later via a `practice_link` on-ramp. |

## Why a separate junior store + unified progress (not Crucible-for-everything)

Grounded in live data (2026-06-08):
- `user_progress` = 0 docs, `student_chapter_profiles` = 0 docs — Crucible's progress
  base is essentially empty; no live cross-system sync to preserve.
- `user_mastery` = 19 docs (SM-2: `concept → {ease_factor, interval_days}`, JEE tags).
- `book_practice_attempts` = 14, `book_progress` = 192 — livebook progress already
  separate and in use.
- `learning_events` = 0 — a unified event stream is **scaffolded but unwired**.

Conclusion: question **store** and progress **layer** are separable concerns. Plural
fit-for-purpose stores + ONE source-agnostic mastery layer = scalability without
bending the governed `questions_v2` schema. Junior-CBSE mastery and JEE-chapter mastery
are different skill graphs anyway; cross-track sync is a someday-feature achievable via
`learning_events`.

## Three-layer architecture

```
LAYER 1 — Question stores (plural, fit-for-purpose)
  • questions_v2 (Crucible)  → competitive MCQ/NVT
  • junior_questions (NEW)   → grades 6–10, MCQ + assertion_reason, diagram-capable

LAYER 2 — Progress / mastery (UNIFIED, source-agnostic)  ← the sync seam
  • book_practice_attempts → raw attempts (exists)
  • learning_events        → unified stream (scaffolded; to wire)
  • user_mastery           → shared SM-2 mastery; junior reuses Crucible's model
  → feeds the recommendation/adaptive engine

LAYER 3 — In-page formative interactions (NOT banked)
  • inline_quiz / apply_challenge / classify_exercise  → quick checks, fill-blank, match
```

Discipline: **assessment questions** (banked, tracked, MCQ/AR) vs **learning
interactions** (in-page, formative, not banked). Non-MCQ richness goes to Layer 3.

## Data model — `junior_questions`

Mirror `questions_v2` field names where sensible (shared `MathRenderer`, easy future
merge), minus JEE metadata:

```
{
  _id: uuid,
  display_id: 'C9SCI-MIX-001',        // {grade}{subj}-{chapterPrefix}-{n}
  grade: 9, subject: 'science',
  book_slug: 'class9-science', chapter_number: 5, chapter_slug: 'mixtures-and-separation',
  format: 'mcq' | 'assertion_reason',
  concept_tag: 'concept'|'application'|'numerical'|'reasoning'|'recall',
  topic: 'chromatography',            // micro-concept, free text
  question_text: { markdown },
  image_src?: string, image_prompt?: string,   // diagram (Layer-1 image pipeline)
  // mcq:
  options: [{ id:'a', text, is_correct }],
  // assertion_reason: assertion, reason, ar_key (standard A/R option),
  explanation: { markdown },
  difficulty: 1..3,
  source: 'IIT_Foundation_Cl8' | 'IIT_Foundation_Cl9' | 'original',
  status: 'published' | 'draft' | 'flagged',
  deleted_at, created_by, updated_by, created_at, updated_at
}
```

## Admin panel + editor (admin app)

- New panel — but it is the **7th admin dashboard**. Per CLAUDE.md §8.11, that's the
  trigger to build the shared `<AdminPanel>` shell first (auth gate + toolbar + loading/
  empty states) and land this panel on it, instead of copy-pasting a 7th shell.
- Editor scoped to MCQ + assertion-reason: stem (markdown+LaTeX), options/AR, correct
  answer, explanation, difficulty, concept_tag, topic, **diagram upload** (reuse
  `apps/admin/.../assets/upload` pipeline used by ImageBlock/Callout).
- Auth: `requireAdmin` / `requireSuperAdmin`; mutating APIs under `apps/admin/app/api/v2/`.
- List/filter by grade → subject → chapter; bulk import for script-seeded extraction.

## Custom mock test (chapter-end)

Mirror Crucible's on-the-fly generator (`testGenerator.ts` + `TestConfigModal`), simpler:
- Student picks chapter(s) + question count + difficulty → engine pulls from
  `junior_questions` → timed player → score + per-question review with explanations.
- Generated per session (no stored set needed); results → a results collection
  (reuse/extend `testresults` or a `junior_test_results`), and every item → Layer-2
  attempts/mastery.
- Surfaced from the livebook chapter via a small "Take a chapter test" entry + the
  practice block.

## Surfacing in livebooks

- Chapter-end **practice** block that queries `junior_questions` by `chapter_slug`
  (replaces embedded `chapter_practice.questions[]` with a bank-backed source; the
  `practice-bank` API + `practiceSelector` engine already model this).
- Per-page `inline_quiz` stays as Layer-3 quick checks (text MCQ), unchanged.

## Adaptive / recommendation

- Junior attempts (practice + test) update a junior `user_mastery` map (same SM-2 shape).
- Recommendation engine (`packages/persona/recommendation-engine.ts`) extended (or a
  junior variant) to read junior mastery → recommend weak chapters/concepts/next test.
- Livebook progress (`book_progress`) is an input signal.

## Phased build (walking-skeleton first)

| Phase | Deliverable | Gate |
|---|---|---|
| **P0** ✅ | `JuniorQuestion` model (`packages/data/models/JuniorQuestion.ts`) + Zod (`packages/data/schemas/juniorQuestion.ts`) + admin CRUD/bulk API (`apps/admin/app/api/v2/junior-questions/`) | — |
| **P1** ✅ | Admin editor panel (`apps/admin/app/junior-bank/`, `features/admin/junior-bank/JuniorBankWorkspace.tsx`) — MCQ+AR+diagram. `<AdminPanel>` shell deferred to spawned task (built mechanically-compatible). | P0 |
| **P2** ◧ | First batch: **10 Ch5 questions seeded** (`scripts/seed_junior_c9sci_ch5.js`) from IIT-F Cl8 Ch2, rewritten conceptual. Rest of Ch5 + Ch8/Ch9 pending review. | P1 |
| **P3** ✅ | `junior_practice` block (type+schema+`JuniorPracticeRenderer`+editor+registration) + public read API (`apps/student/app/api/v2/junior-questions/`) + attempt logging (science concept tags added to `books/practice`). Block placed on Ch5 Master Recap page. | P2 |
| **P4** | Custom mock-test generator + player at chapter end (`mode:'test'` scaffolded on the block). | P3 |
| **P5** | Wire junior mastery → recommendation engine. | P3 |

Recommendation: **P0→P3 as a thin vertical slice first** (author Ch 5 questions → see
them in a livebook practice page end-to-end) before P4/P5. De-risks the whole thing.

## Extraction detail (P2) — Class 9 Science Ch 5 pilot

Source map (verified from PDFs):

| Our Ch | Old-NCERT | Primary IIT-F source |
|---|---|---|
| 5 Mixtures & Separation | Is Matter Around Us Pure | **Cl8 Ch2** + Cl8 Ch5 (solution/solubility) |
| 8 Structure of the Atom | Structure of the Atom | Cl8 Ch1 + Cl9 Ch2 (basic) |
| 9 Atoms & Molecules | Atoms and Molecules | Cl8 Ch3 + Cl9 Ch5 (mole) |

Ch 5 page topics map ~1:1 to Cl8 Ch2 sections (Distillation, Chromatography,
Sublimation, Crystallisation, Centrifugation, Separating funnel, Solutions/Solubility).

Pipeline: `pdftotext -layout` (text layer present, no OCR) → Rule-0 anti-hallucination
(every Q quotable from source) → filter to L1/L2 + Test-Your-Concepts → **rewrite toward
conceptual/reasoning** (drop rote trivia; keep important recall as L1 phrased for the
*reason*; preserve applied L2) → stage to `scripts/_junior_buffer_c9sci_ch5.js` → human
review → idempotent insert into `junior_questions` (dedupe by text, uuid ids,
`status:'published'`) → verify.

Out of scope (no class-9 match): Cl9 Ch3 Periodic Table, Ch4 Bonding, Ch6 Kinetics,
Ch8 Metals/Non-metals, Ch9 Organic; Cl8 Ch6 Carbon, Ch7 N/P/S/Cl; gas-laws/molarity.

## Anti-goals / guardrails

- Do not touch `questions_v2`, the Crucible taxonomy, or persona invariants.
- New admin APIs follow §8 security rules (auth gate, Zod/whitelist, bounded queries).
- Junior questions are **rewritten/transformed** from the source, not copied verbatim.
