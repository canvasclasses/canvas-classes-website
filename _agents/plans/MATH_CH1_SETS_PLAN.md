# Class 11 Math Live Book — Chapter Plan: **Sets** (NCERT Ch.1)

> **✅ BUILT 2026-07-24 (unpublished).** Book `class11-mathematics` + chapter "Sets" (chapter
> number 1, so Ch.2 "Relations and Functions" keeps its own number and Ch.3 Trig can be added
> later), **11 pages** authored via `scripts/math11-book/` (`_book_ch1.js` scaffold +
> `build_ch1_pages_0_4.js` + `build_ch1_pages_5_9.js` + `build_ch1_practice.js`), all
> `published:false` and Zod-valid (`_validate.mts`). **Zero `math_graph` blocks** — a deliberate
> scope call, see §C below. Practice bank: **49 NCERT questions** across Ex 1.1, 1.2, 1.3, 1.4,
> 1.5 and the Miscellaneous Exercise (verbatim from the source PDF).
>
> **This is a RAW-STRUCTURE first pass** — NCERT concepts, NCERT in-text examples, and NCERT
> exercise questions with full worked solutions, prioritizing completeness and accuracy over
> interactivity. Later refinement pass can add richer simulations / worked-example ladders.

---

## A. Source & a load-bearing discovery (read this before anything else)

**Source PDF:** `…/iCloud Drive (Archive)/Kindle Converter/Math Books/NCERT Class 11 Maths/Ch1 - Sets.pdf`
(23 pages, watermarked "Reprint 2026-27" — the founder's actual current-edition NCERT). Read in
full, page-by-page, per Rule 0 (image-verification gate) before writing anything.

**Discovery: this rationalized NCERT print does NOT contain two sections/exercises that the
task brief's section spine expected**, because NCERT's syllabus rationalization removed them
from Chapter 1 some years back:

1. **"Power Set" is not a section in this book at all.** The chapter goes straight from
   §1.6/1.6.1/1.6.2 (Subsets / subsets of ℝ / intervals) to §1.7 **Universal Set** — there is no
   "§1.7 Power Set, P(A) = 2ⁿ" section, no worked example, and Exercise 1.3 tests subsets/
   intervals/universal-set only, never `P(A)`.
2. **"Practical problems on union and intersection" (the classic `n(A∪B) = n(A)+n(B)-n(A∩B)`
   word-problem section) does not exist either.** The chapter goes from §1.10 Complement
   straight to Miscellaneous Examples / Miscellaneous Exercise — no §1.11/1.12, no Exercise 1.6.
3. Consequently there is **no "Exercise 1.6"** — the chapter's exercises are **1.1, 1.2, 1.3,
   1.4, 1.5, and the Miscellaneous Exercise**, six graded sets in total, not seven.

**Decision (flagged for founder review, see §E):** Power Set and the union/intersection word-
problem formula are still universally taught (every other NCERT print, every coaching book, and
JEE/board papers all test both), and the task brief explicitly asked for them. Rather than
silently drop them **or** silently fabricate an NCERT attribution that doesn't exist in this
print, I kept both as **short, clearly-labeled supplementary pages**:
- Their worked examples use `variant: 'solved_example'` (own numbers), never `'ncert_intext'`.
- **Zero items in the practice bank are tagged `source: 'ncert_exercise'` for these two topics**
  — because no such NCERT exercise exists in this print to source them from. This keeps Rule 0
  intact: nothing is attributed to NCERT that isn't verifiably in the book.
- Pages 4 (power set half) and 8 (practical problems, whole page) are the two places this
  applies. Everything else in the chapter is verbatim/faithful to the actual PDF.

---

## B. NCERT section spine actually present in this print

| § | Title | Exercise |
|---|---|---|
| 1.1 | Introduction | — |
| 1.2 | Sets and their Representations (roster / set-builder) | **Ex 1.1** (6 Q) |
| 1.3 | The Empty Set | (feeds Ex 1.2) |
| 1.4 | Finite and Infinite Sets | (feeds Ex 1.2) |
| 1.5 | Equal Sets | **Ex 1.2** (6 Q, empty/finite/infinite/equal combined) |
| 1.6 / 1.6.1 / 1.6.2 | Subsets · subsets of ℝ · intervals as subsets of ℝ | **Ex 1.3** (8 Q, incl. universal-set Q7–8) |
| 1.7 | Universal Set | (folded into Ex 1.3) |
| 1.8 | Venn Diagrams | — |
| 1.9 / 1.9.1–1.9.3 | Operations on Sets · Union · Intersection · Difference | **Ex 1.4** (12 Q) |
| 1.10 | Complement of a Set (+ De Morgan's laws) | **Ex 1.5** (7 Q) |
| — | Miscellaneous Examples + Exercise | **Misc** (10 Q) |

Total NCERT exercise questions: 6+6+8+12+7+10 = **49**.

---

## C. The math_graph judgment call — ZERO graph blocks in this chapter

Per `MATH_LIVEBOOK_PLAN.md` §4 (Track A/B) and the task brief: Sets is fundamentally about
**discrete, unordered collections and logical relationships**, not continuous functions — the
one place a 2-D Cartesian tool could plausibly reach is representing an **interval as a subset
of ℝ** on a number line (page 3).

**Investigated and rejected.** The shipped `math_graph` engine (`packages/book-renderer/blocks/
math-graph/`) is a JSXGraph **2-D board** (x/y axes, `keepSquare`, function plots, sliders). It
has no 1-D number-line primitive, and every attempt to fake one is a hack that looks worse than
the alternative:
- Plotting two points at `y = 0` with different colors for "open" vs "closed" endpoints still
  renders on a full 2-D grid with a y-axis that means nothing — visually confusing, not clean.
- A "region" in the spec schema is an **inequality shaded region** (`y < f(x)` style) meant for
  2-D areas under/between curves, not a thickened 1-D segment on the x-axis.
- No archetype in `archetypes.ts` (`line-explorer`, `vlt-sweep`, `power-family`, `step-explorer`,
  `even-odd-mirror`, `piecewise-highlight`, `transformations`, `reflection`, `unit-circle`,
  `tangent-explorer`, `area-under-curve`, `sequence-pattern`) is a number-line primitive, or
  close enough to repurpose without looking bolted-on.

**Decision:** page 3 uses an `image` block (a generated, dark-background diagram of the four
interval types on a number line — mirroring NCERT's own Fig 1.1: open circle / closed circle at
each end) **plus** a `table` block (interval name · notation · set-builder form · endpoint rule ·
worked example) for the crisp symbolic reference. This is cleaner than a forced graph and matches
the workflow's explicit permission to use "a callout or table... instead" when `math_graph`
would look janky.

**Net effect: this chapter ships with zero `math_graph` blocks anywhere** — consistent with the
parent plan's framing that Sets is "light on graphing" (Venn diagrams, its one visual centerpiece,
are also explicitly out of scope for the graph tool and use `image` blocks instead, per the task
brief). This is a deliberate, documented scope choice, not an oversight.

---

## D. Final page list (11 pages, 0–10)

| # | Slug | Scope (one line) |
|---|---|---|
| 0 | `sets-opener` | Chapter opener — what a set is, why it underlies all of math, roadmap. |
| 1 | `sets-representations` | Roster form vs set-builder form; ∈/∉; standard number sets N/Z/Q/R. NCERT Examples 1, 3, 4, 5. |
| 2 | `empty-finite-infinite-equal-sets` | Empty set; cardinal number; finite vs infinite; equal sets. NCERT Examples 6, 7, 8. |
| 3 | `subsets-and-intervals` | Subset/proper-subset/singleton; subsets of ℝ (N⊂Z⊂Q⊂R); the four interval types via table + number-line image (see §C). NCERT Examples 9, 11. |
| 4 | `power-set-and-universal-set` | Universal set (real NCERT §1.7) + Power Set (flagged supplementary, see §A). |
| 5 | `venn-diagrams` | Reading Venn diagrams — rectangle = universal set, circles = subsets; shading convention. Image blocks (two/three-circle diagrams). |
| 6 | `operations-on-sets` | Union, intersection, difference; commutative/associative/distributive/identity laws; disjoint sets. NCERT Examples 12–19. |
| 7 | `complement-and-de-morgans-laws` | Complement A′; complement laws; De Morgan's laws (boxed `callout[remember]`). NCERT Examples 20–22. |
| 8 | `practical-problems-set-counting` | `n(A∪B) = n(A)+n(B)-n(A∩B)` word problems — flagged supplementary (see §A), own worked examples. |
| 9 | `sets-practice-ncert` | `practice_bank` — all 49 NCERT Ch.1 questions (Ex 1.1, 1.2, 1.3, 1.4, 1.5, Misc), verbatim, each with a full worked solution. |
| 10 | `sets-recap` | Retrieval-only recap — concept map, notation/traps table, integrative quiz, closing line. |

---

## E. Scope boundaries & open questions for the founder

**In (core, faithful to the actual NCERT print):** representations, empty/finite/infinite/equal
sets, subsets, intervals, universal set, Venn diagrams, union/intersection/difference, complement,
De Morgan's laws, and all 49 real NCERT exercise questions.

**Flagged supplementary (not in this NCERT print, included anyway per the task brief, clearly
un-attributed to NCERT):**
1. **Power Set** (page 4, second half) — standard `P(A)`, `|P(A)| = 2ⁿ` content, own worked
   example (not NCERT Example numbering, since none exists).
2. **Practical problems / `n(A∪B)` word-problem formula** (page 8, whole page) — classic
   two-set and light three-set counting problems, own numbers.

**Open questions for the founder to review:**
- Should pages 4 (power-set half) and 8 (whole page) be kept as supplementary enrichment, or
  trimmed out entirely to make the chapter a 100%-faithful mirror of this exact NCERT print? I
  judged "keep, but clearly un-attributed" is the better default because both topics are
  routinely tested (JEE/board), but this is a founder call, not an agent call.
- The zero-`math_graph` decision (§C) — confirm this reads as a deliberate design choice, not a
  gap, when reviewing the chapter in the admin books-editor.
- Venn diagram `image` blocks are AI-generation prompts, not yet rendered images (per the
  existing Live Books pipeline — hero + concept images across the whole platform are generated in
  a separate pass via `scripts/livebook-images/`). None of the 11 pages have real image URLs yet;
  all `src: ''` placeholders with `generation_prompt` set, matching the Ch.2 pattern exactly.

## F. Build sequencing

1. `_book_ch1.js` — copy of `_book.js` scaffold, `CH = { number: 1, title: 'Sets', slug: 'sets', ... }`.
2. `build_ch1_pages_0_4.js` — pages 0–4.
3. `build_ch1_pages_5_9.js` — pages 5–9 (Venn → operations → complement → practical problems →
   the NCERT practice bank, i.e. what the task brief calls "page 9"; note the practice bank is
   built in its own file, `build_ch1_practice.js`, for the same reason Ch.2 split it out — it's
   large and independently re-runnable).
4. `build_ch1_practice.js` — the 49-question `practice_bank` (this chapter's page 9).
5. `node scripts/math11-book/_validate.mts` → all pages `OK`.
6. `node scripts/livebooks-state.js` → refresh `_agents/state/LIVE_BOOKS_STATE.md`.

### Sources
- NCERT Class 11 Mathematics, **Ch.1 Sets** — `…/Math Books/NCERT Class 11 Maths/Ch1 - Sets.pdf`
  (Reprint 2026-27 print), read in full (23 pages) for this build. Spine.
- `_agents/workflows/MATH_BOOK_PAGE_WORKFLOW.md`, `_agents/workflows/BOOK_PAGE_WORKFLOW.md` —
  block/page rules.
- `_agents/plans/MATH_CH2_FUNCTIONS_PLAN.md` — the template this plan follows.
