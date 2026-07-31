# Class 11 Math Live Book — Chapter Plan: **Linear Inequalities** (NCERT Ch.5)

> **Status: RECONCILED against the real NCERT PDF, 2026-07-24 (unpublished).** Book
> `class11-mathematics`, chapter 5 "Linear Inequalities", **8 pages**, originally
> authored via `scripts/math11-book/` (`_book_ch5.js` scaffold + `build_ch5_pages_0_4.js`
> + `build_ch5_pages_5_7.js` + `build_ch5_practice.js`) without a source PDF, then
> reconciled this session once `Math Books/NCERT Class 11 Maths/Ch5 - Linear
> Inequalities.pdf` became available (read in full, 11 pages). All pages
> `published:false` and Zod-valid (`_validate.mts`). **Pages 2–4 remain the reference
> build for the `math_graph` `regions[]` capability** — shaded half-plane inequalities —
> though see §A below: that content turns out to be an *extension* beyond the current
> rationalized NCERT syllabus, not a transcription of it.

---

## A. The real NCERT spine (found 2026-07-24, supersedes the assumed spine below)

The rationalized **2023-24 edition** of NCERT Class 11 Maths Ch.5 is **11 pages** and
covers **one-variable inequalities only** — there is no two-variable graphing content
anywhere in the chapter:

| Real section | Scope |
|---|---|
| **5.1 Introduction** | Motivates inequalities vs. equations (packets-of-rice / registers-and-pens examples). |
| **5.2 Inequalities** | Definitions only — numerical vs. literal vs. double inequalities, strict vs. slack, and a list of the *general forms* `ax+b<c` … `ax+by≥c` (two-variable forms are shown here purely as notation examples, never solved or graphed). |
| **5.3 Algebraic Solutions of Linear Inequalities in One Variable and their Graphical Representation** | The two sign rules (Rule 1: add/subtract unchanged; Rule 2: multiply/divide by positive unchanged, by negative **reverses**). Examples 1–8: domain-restricted solving (natural/integer/real), the sign-flip trap, compound inequalities, number-line graphs (Fig 5.1, 5.2), and two word problems (marks average, consecutive odd integers). Then **Exercise 5.1 (26 questions)**. |
| **Miscellaneous Examples (9–13)** | Systems of ONE-variable inequalities solved simultaneously (double inequalities), a Celsius↔Fahrenheit word problem, and an acid-mixture word problem. Then **Miscellaneous Exercise on Chapter 5 (14 questions)**. Then a Summary box. Chapter ends there — **11 pages total, no more sections.** |

**There is no "5.4 Graphical solution of linear inequalities in two variables" and no
"5.5 System of linear inequalities in two variables"** — both were cut in the
rationalization (likely folded into or superseded by the Linear Programming treatment
elsewhere). Every real exercise/example question in this chapter is one-variable
(including compound/double inequalities and systems-of-one-variable), plus three word
problem families: marks/average, temperature conversion, and acid/water mixtures.

**Consequence for this build:** pages 2, 3, and 4 (`graphing-a-linear-inequality`,
`systems-of-two-linear-inequalities`, `systems-of-three-linear-inequalities`) teach
content that is **not in the current rationalized NCERT Ch.5 at all**. This was
authored against an assumed pre-rationalization-style spine before the real PDF was
available (see the original §A below, kept for history). Per CLAUDE.md §0.6 (never
delete founder content), **these pages were NOT removed** — the two-variable graphing
skill is mathematically sound, well-built, directly grounds Linear Programming (a later
chapter), and is the reference implementation for the `math_graph` `regions[]`
capability. Instead, an honest **"A Note on Scope"** callout was added to page 2 (via
`scripts/math11-book/reconcile_ch5_syllabus_note.js`) clarifying plainly that this
content is a **deliberate extension beyond the current textbook**, not a transcription
of it — so the chapter never misrepresents itself. The chapter's `description` metadata
in the `books` collection was updated to match. **Open question for the founder:**
whether to keep pages 2–4 as extension content (current state), move them to a later
"bridge to Linear Programming" chapter, or trim them — see §G.

**The practice bank (page 6) is now genuinely NCERT-sourced.** All 40 real questions —
**Exercise 5.1, Q1–Q26** and the **Miscellaneous Exercise, Q1–Q14** — were transcribed
verbatim from the PDF (Rule 0 gate: quoted before extracting), independently re-derived
by hand, and cross-checked against the standard published NCERT answer key before being
written into the bank. This replaces the previous 23 hand-authored-but-honestly-labelled
items via `scripts/math11-book/reconcile_ch5_practice.js` (see §A.1 below and the
Changelog entry in `_agents/state/LIVE_BOOKS_STATE.md`, 2026-07-24).

### A.1 — Original spine assumption (kept for history — superseded by the real spine above)

| Assumed NCERT section | Scope (as originally guessed, without a PDF) |
|---|---|
| **5.2 Inequalities** | Algebraic solutions of linear inequalities in one variable + their graphical representation on the **number line**. The sign rules: add/subtract same number → unchanged; multiply/divide by a **positive** number → unchanged; multiply/divide by a **negative** number → **reverses** the inequality. |
| **5.3 Graphical solution of linear inequalities in two variables** | Plot the boundary line (dashed for strict `<`/`>`, solid for `≤`/`≥`), shade the correct half-plane by testing a point (usually the origin). |
| **5.4 Solution of a system of linear inequalities in two variables** | The feasible/solution region as the **overlap** of several shaded half-planes — for two constraints, and again for three (which foreshadows, but does not teach, Linear Programming). |

No source PDF for Chapter 5 was available in the local NCERT PDF folder in the original
build session. Per the anti-hallucination guidance, every worked example and practice
item was therefore **authored as a clearly-correct, independently-verified problem of
the canonical NCERT type**, not transcribed from a scanned source image. Two
consequences, as originally stated (now resolved by the reconciliation above):

1. Lesson-page worked examples use `variant: 'solved_example'` throughout (not
   `'ncert_intext'`), since the exact NCERT wording/numbering could not be certified
   without the source. **Status: not yet swapped to `'ncert_intext'`** even for pages
   whose content does have a real counterpart (e.g. page 1's one-variable examples) —
   this was deliberately deferred this session (see §G) since two of the three worked
   examples on page 1 are tightly coupled to a companion number-line image whose
   generation prompt encodes the *exact numeric answers*; swapping the problems would
   require reworking that image prompt too, which risks disrupting page flow for a
   nice-to-have. Recommended for a future light pass.
2. The practice bank (page 6) was a **representative selection** (23 items across 4
   themes) rather than a literal 1:1 transcription — **now fully resolved**, see §A above.

---

## B. Final page list (8 pages, `page_number` 0–7)

| # | Slug | Title | Scope | `math_graph` (regions) |
|---|---|---|---|---|
| 0 | `linear-inequalities-opener` | Linear Inequalities | Chapter opener — motivates with a real constraint (pocket money / speed limit) as an inequality, not an equation. No quiz (§15.1 minimal template). | — |
| 1 | `inequalities-in-one-variable` | Inequalities in One Variable | The three sign rules (esp. the negative-multiply/divide flip); solving; number-line representation via image + bracket notation (no `math_graph` — a 2-D canvas isn't the natural fit for 1-D content, per the brief). 3 worked examples (sign-flip, natural/integer domain restriction, compound inequality). | — (number-line `image` instead) |
| 2 | `graphing-a-linear-inequality` | Graphing a Linear Inequality in Two Variables | Single inequality: dashed vs solid boundary, test-point method (origin). 3 worked examples of increasing difficulty (already-in-y-form → solve-for-y → negative-y-coefficient flip trap). | **3** single-region graphs |
| 3 | `systems-of-two-linear-inequalities` | Systems of Two Linear Inequalities | Two inequalities overlaid; the overlap is the system's solution. 2 worked systems (a `<`/`>` pair and a `≥`/`≤` pair, for variety). | **2** two-region overlay graphs |
| 4 | `systems-of-three-linear-inequalities` | Systems of Three Linear Inequalities | Three inequalities overlaid can close into a **bounded polygon** — the feasible region, foreshadowing (not teaching) Linear Programming. 1 worked triangle example with vertex-finding. | **1** three-region overlay graph (genuine bounded triangle) |
| 5 | `linear-inequalities-worked-examples` | More Worked Examples | Retrieval/consolidation — no new ideas. Mixes one-variable word problems (temperature conversion, marks/average, fraction-clearing) with one more two-variable graph. | **1** single-region graph |
| 6 | `linear-inequalities-practice-ncert` | Practice — NCERT-Style Exercises | `practice_bank`, **2 sections mirroring the real textbook (Ex 5.1 + Misc Exercise), 40 verbatim NCERT items total** (updated 2026-07-24 — see §A), every item independently re-solved and cross-checked. | — (practice items are text-only, no embedded graphs) |
| 7 | `linear-inequalities-recap` | Chapter Recap | Retrieval-only: sign-rule table, graphing-convention table, swap-traps table, 2 reasoning self-checks, 7-question integrative quiz. | — |

**Total `math_graph` / `regions[]` blocks: 7**, across pages 2, 3, 4, 5 — every
graphical-inequality page carries at least one, per the brief's "use `regions`
generously" instruction.

---

## C. How `regions[]` was used per page

- **Page 2 (single inequality):** each graph carries **one** entry in `regions[]` plus a
  matching `functions[]` entry for the visible boundary line (`dashed: true` for `<`/`>`,
  `dashed: false` for `≤`/`≥`). The engine's own auto-generated region boundary curve is
  always drawn `dash:2` internally (see limitation below) — the separate `functions[]`
  entry is what actually communicates strict-vs-non-strict to the student, exactly as the
  brief specified.
  - MG1 — `y < 2x + 3` (already solved for y; the warm-up, ungated first exposure).
  - MG2 — `x + 2y ≤ 8` → solved to `y ≤ 4 − x/2` (solid boundary).
  - MG3 — `3x − 2y > 6` → solved to `y < (3x − 6)/2` **(the negative-y-coefficient flip
    trap — dividing by −2 reverses `>` to `<`)**.
- **Page 3 (systems of two):** two entries in the **same** `regions[]` array, overlaid —
  the visual double-shaded overlap *is* the system's solution, per the brief.
  - MG4 — `x + y < 4` and `x − y > −2` (both solved to strict `<` in y — an unbounded
    downward wedge).
  - MG5 — `2x + y ≥ 6` and `3x + 4y ≤ 12` (a `≥`/`≤` combination, for contrast — an
    unbounded region opening the other way).
- **Page 4 (systems of three):** three entries overlaid, chosen so the intersection is a
  genuine **bounded triangle** — `x + y ≤ 6`, `y ≤ 2x`, `y ≥ 0`, vertices `(0,0)`,
  `(6,0)`, `(2,4)` (all three pairwise boundary intersections independently verified to
  satisfy the third constraint, confirming they are true vertices and the region is
  bounded, not an open wedge).
- **Page 5:** one more single-region graph (`5x + 4y ≥ 20` → `y ≥ 5 − 5x/4`) folded into
  the mixed worked-examples page, for reinforcement.

---

## D. The vertical-line-inequality limitation — how it was handled

`MathGraphSpecSchema.regions[].expr` shades the region where `y {op} expr(x)` holds — a
function *of x*. A pure vertical constraint like `x < 3` (or the classic
non-negativity restrictions `x ≥ 0` / `y ≥ 0` that show up constantly in
Linear-Programming-flavoured NCERT problems) has **no y-dependence**, so it cannot be
expressed as `y {op} expr(x)` at all — not even approximately without a hack (a
near-vertical `1000·(x−3)` line was considered and rejected: it reads as a broken graph,
which the brief explicitly said not to ship).

**Resolution, by page:**
- **Page 1** is the one-variable, number-line home for exactly this kind of content
  (`x < 3`-style solutions) — handled with `image` (number-line diagram) + prose bracket
  notation, never routed through `math_graph` at all. This is the brief's own suggested
  fallback (b), and it is the *natural* home for 1-D inequalities regardless of the
  engine limitation.
- **Pages 2–5 (2-D `regions[]` graphs):** every worked system in this chapter was
  **deliberately chosen to avoid a vertical-only constraint** — including the
  non-negativity constraint `y ≥ 0` on Page 4, which *is* representable (a horizontal
  line, `expr: '0'`, has no such problem — only the *x*-only case is unrepresentable).
  Page 4's three-inequality system uses `y ≥ 0` (fine) instead of `x ≥ 0` (not fine),
  which still delivers a genuine bounded feasible-region example without exposing the
  limitation at all.
- **Practice bank (page 6):** `practice_bank` items are text-only (`prompt` + `solution`
  markdown, no embedded graph field in the schema), so the limitation never applies
  there regardless of which inequalities appear in a given exercise's text.

**Net result:** the limitation is real and worth flagging for future engine work (a
`vertical` region mode, or a `regions[].axis: 'x'|'y'` flag, would remove the need for
this authorial workaround), but no page in this chapter needed a broken-looking
graph to work around it.

---

## E. Scope boundaries (so the chapter doesn't over- or under-reach)

- **In (NCERT Ch.5 core, this chapter's job):** algebraic + number-line solution of
  one-variable linear inequalities and the sign-flip rule; graphing a single two-variable
  linear inequality (dashed/solid, test-point shading); systems of two and three
  two-variable inequalities as overlapping half-planes.
- **Deliberately out of scope (flagged, not built):** **optimizing** over a feasible
  region (finding the maximum/minimum of an objective function subject to constraints) is
  **Linear Programming**, which NCERT teaches as its **own, later chapter** — Page 4's
  bounded-triangle example stops at *finding* the region and explicitly says so in a
  `real_world`-variant callout, deferring optimization to that future chapter. Do not
  pull LP content forward into this build.
- **Quadratic / non-linear inequalities:** out of scope — NCERT Ch.5 is linear only.
- **Full pedagogical polish** (concreteness-fading ladders per family, faded
  worked-example steps, interleaved retrieval scheduling, teacher-voice pass) is
  explicitly deferred to a later refinement pass per the founder's brief — this is a
  raw-structure-first build prioritizing completeness and mathematical accuracy.

---

## F. Build artifacts

- `scripts/math11-book/_book_ch5.js` — scaffold copy of `_book.js` with `CH = { number:
  5, title: 'Linear Inequalities', slug: 'linear-inequalities', ... }`. `_book.js`
  itself was **not** touched.
- `scripts/math11-book/build_ch5_pages_0_4.js` — pages 0–4.
- `scripts/math11-book/build_ch5_pages_5_7.js` — page 5 (more worked examples) and page 7
  (recap); page 6 (practice) is intentionally skipped here and filled by the next script.
- `scripts/math11-book/build_ch5_practice.js` — page 6, the `practice_bank`.
- Validation: `npx tsx scripts/math11-book/_validate.mts` → all chapter-5 pages `OK`.
- State refresh: `node scripts/livebooks-state.js`.

## G. Open questions / judgment calls for founder review

1. **~~Practice-bank provenance~~ — RESOLVED 2026-07-24.** The real PDF was read and the
   practice bank now holds all 40 real NCERT questions (Ex 5.1 Q1–26 + Misc Ex Q1–14),
   verbatim, each independently re-solved and cross-checked against the standard answer
   key. See §A above.
2. **Pages 2–4 are out-of-syllabus content — NEW, needs a founder decision.** The real
   rationalized NCERT Ch.5 has no two-variable graphing or systems-of-inequalities
   section at all (§A). Pages 2 (`graphing-a-linear-inequality`), 3
   (`systems-of-two-linear-inequalities`), and 4 (`systems-of-three-linear-inequalities`)
   — 3 of the chapter's 8 pages, carrying all 6 of its `math_graph` blocks — teach this
   cut content. Kept in place (not deleted, CLAUDE.md §0.6) with an honest "A Note on
   Scope" callout added to page 2. **Three options for the founder to choose from:**
   (a) leave as-is — a labelled extension, valuable JEE/LP-prep content bundled into
   this chapter; (b) move pages 2–4 into a later "Linear Programming" chapter as its
   opening bridge, once that chapter exists; (c) trim them out of this chapter entirely
   (would need explicit founder sign-off per §0.6 — nothing was removed this session
   without that).
3. **Page 1's worked-example provenance — still not swapped to verbatim, deliberately.**
   Two of page 1's three worked examples happen to closely match real content (Example 3
   `4x+3<6x+7` is literally the built "sign-flip trap" example's *intended* skill, and
   Example 1 `30x<200` is the real domain-restriction example), but the page's
   accompanying number-line image (order 9) bakes in the *current* invented examples'
   exact numeric answers (`x < -3` and `-1 < x \le 3`) into its `generation_prompt` text.
   Swapping the worked-example problems to the verbatim real ones would change those
   answers and require reworking the image prompt too — judged not worth the disruption
   risk for a "nice-to-have" (Step 5) in this pass. Left as originally built
   (`variant: 'solved_example'`, honestly not claiming `'ncert_intext'`). A future light
   pass could do this cleanly by re-deriving the image prompt's numbers alongside the
   swap.
4. **`regions[]` vertical-axis limitation** (§D, original build) — real engine gap,
   worked around by example choice rather than fixed. Consider a future
   `axis: 'x'|'y'` field on `regions[]` if a later chapter (e.g. Linear Programming
   itself, which needs `x ≥ 0` constraints routinely) can't route around it as cleanly
   as this one did.
5. **Page 4's LP foreshadow wording** — kept deliberately light (one callout, no
   objective-function content). Confirm this is the right amount of "seeding" versus
   leaving it out entirely until the LP chapter proper. (Relevant again given #2 above —
   if pages 2–4 move to an LP chapter, this foreshadow callout may need to move with
   them or be cut as redundant.)
6. Hero-banner images for all 8 pages are `src: ""` + `generation_prompt` only (per
   platform convention) — none generated this session; the next step before publish is
   the image pipeline pass. (Page 2's new callout has no image of its own — it's a text
   callout, consistent with other `note`-variant callouts elsewhere in the book.)
