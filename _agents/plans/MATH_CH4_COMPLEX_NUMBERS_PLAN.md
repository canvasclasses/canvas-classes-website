# Class 11 Math Live Book — Chapter Plan: **Complex Numbers and Quadratic Equations** (NCERT Ch.4)

> **Status:** RECONCILED against the real NCERT PDF — 2026-07-24. Mirrors the `MATH_CH2_FUNCTIONS_PLAN.md`
> template. Book `class11-mathematics`, chapter 4 "Complex Numbers and Quadratic Equations", **10 pages**
> (page_number 0–9), all `published:false`, built via `scripts/math11-book/_book_ch4.js` (separate
> scaffold, does not touch `_book.js` or the Ch.1/Ch.3/Ch.5 scaffolds already in progress) +
> `build_ch4_pages_0_3.js` + `build_ch4_pages_4_7.js` + `build_ch4_practice_recap.js`, then
> **reconciled against the real Ch.4 PDF** (now available — see §A2) via
> `build_ch4_practice_recap.js` and `reconcile_ch4_ncert_practice.js`.
>
> This is a **first pass prioritizing completeness and mathematical accuracy**. Pedagogical polish
> (predict-first gates on every beat, faded worked-example ladders, full teacher-voice pass,
> `tier: competitive` marking) is deferred to a later refinement pass, per the task brief.

---

## A. Reference spine

NCERT Class 11 Mathematics, **Ch.4 Complex Numbers and Quadratic Equations**:

| Section | Scope |
|---|---|
| 4.2 | Need for complex numbers ($ x^2+1=0 $ has no real solution); definition; $ i $, $ i^2=-1 $; real/imaginary parts; powers of $ i $ |
| 4.3 | Algebra of complex numbers — addition, subtraction, multiplication, division; commutative/associative/distributive laws |
| 4.4 | Modulus and conjugate — definitions, properties, why the conjugate rationalizes a division |
| 4.5 | Argand plane and polar representation — plotting $ a+bi $ as $ (a,b) $; $ r(\cos\theta+i\sin\theta) $; argument; principal argument |
| 4.6 | Quadratic equations — $ ax^2+bx+c=0 $ with $ b^2-4ac<0 $, complex conjugate roots via the quadratic formula |

**Original sourcing note (superseded — kept for history):** at first-build time, no Chapter 4 PDF
existed in the source folder (only Ch1–3 were present), so the original pass used original,
independently-verified problems of the same type/difficulty as the standard exercise set, tagged
`source: 'mcq'`, never claiming verbatim NCERT sourcing. **This has now been resolved — see §A2.**

---

## A2. Reconciliation pass (2026-07-24) — the REAL NCERT spine

A real PDF is now available at `~/iCloud Drive (Archive)/Kindle Converter/Math Books/NCERT Class 11
Maths/Ch4 - Complex Numbers and Quadratic Equations.pdf` (13 pages, rationalized 2023-24 edition,
read start to end). It reveals a **materially different spine** from the one assumed in §A above —
this is a genuine textbook-rationalization fact (all 13 pages were read; nothing was extraction
gaps), not an artifact of a bad scan:

| Section (as printed) | Scope actually present in the PDF |
|---|---|
| 4.1 Introduction | Motivates with $ x^2+1=0 $ having no real solution |
| 4.2 Complex Numbers | Definition $ a+bi $, $ i^2=-1 $, Re/Im, equality of two complex numbers |
| 4.3 Algebra of Complex Numbers | 4.3.1 Addition, 4.3.2 Difference, 4.3.3 Multiplication, 4.3.4 Division, 4.3.5 Power of $ i $ (incl. negative exponents), 4.3.6 Square roots of a negative real number, 4.3.7 Identities (Examples 1–6, **Exercise 4.1** — 14 Qs) |
| 4.4 The Modulus and the Conjugate of a Complex Number | Definitions + 5 standard properties (no new exercise here — folds into Ex 4.1 Q11–14) |
| 4.5 Argand Plane and Polar Representation | **Heading text is a holdover from the pre-rationalization edition.** The actual body content ONLY covers: plotting $ a+bi $ as $ (x,y) $, modulus = distance from origin, conjugate = mirror image across the real axis. **There is no polar-form content anywhere** — no $ r(\cos\theta+i\sin\theta) $, no argument, no principal argument, no worked example converting between rectangular and polar form. |
| Miscellaneous Examples + Miscellaneous Exercise | Examples 7–8, then **Miscellaneous Exercise** — 14 Qs (harder identities/proofs) |
| Summary, Historical Note | Mahavira/Bhaskara/Cardan/Girard/Euler/Hamilton history; formula summary table |

**What is genuinely NOT in the current rationalized print, despite the chapter's retained title
"...and Quadratic Equations":**
- **No section 4.6** on solving $ ax^2+bx+c=0 $ with $ D<0 $ via the quadratic formula. The
  quadratic-equations content that gave the chapter half its name has been fully rationalized out of
  this specific chapter's body text and exercises.
- **No Exercise 4.2 or 4.3** — the current print has only **Exercise 4.1 (14 Qs)** and the
  **Miscellaneous Exercise (14 Qs)**, 28 real exercise questions total, not the ~54 a pre-rationalized
  edition would have had across four exercises.
- **No explicit polar form / argument content**, despite the section 4.5 heading still saying "and
  Polar Representation".

**Judgment call — pages 5, 6, 7 (`polar-representation`, `quadratic-equations-complex-roots`,
`mixed-worked-examples`) were LEFT AS-IS, not deleted or restructured.** Reasoning:
1. CLAUDE.md §0.6 forbids hard-deleting or sharply shrinking Live Book content without explicit
   founder consent for that specific removal — deleting two full lesson pages is exactly the kind of
   irreversible-feeling action that rule exists to gate, even though `book-writer.js` would only
   soft-delete.
2. Polar form and quadratic-equations-with-complex-roots remain standard, exam-relevant content
   (JEE/competitive coverage, and consistent with the chapter's own retained title) even though the
   *current rationalized NCERT print* no longer poses exercise questions on them in this chapter.
3. This is a scope/judgment call best made by the founder, not unilaterally by an agent mid-reconciliation.

**Open question for the founder:** keep pages 5 and 6 as JEE-relevant enrichment beyond the current
rationalized NCERT print (recommended — matches the chapter's retained title and JEE syllabus
coverage), or trim/relabel them as explicitly "beyond NCERT" so a student cross-checking against the
printed book isn't confused that these topics aren't in their exercise set? No content was removed
either way pending that decision.

**What WAS fixed — the practice bank (page 8, `complex-numbers-practice`).** The previous 30 invented
`source:'mcq'` items were replaced with the **real, complete, verbatim set of 28 NCERT exercise
questions** — **Exercise 4.1 Q1–Q14** and **Miscellaneous Exercise Q1–Q14** — each transcribed from
the PDF, independently re-solved and verified (not reconstructed from memory), and tagged
`source: 'ncert_exercise'` with source labels like `'NCERT Ex 4.1 · Q9'` / `'NCERT Misc · Q11'`.
Regrouped into 5 revision themes (not the textbook's running order), matching the Ch.2 pattern:

| Theme | Items | Covers |
|---|---|---|
| Standard form & powers of i | 4 | Ex 4.1 Q1–Q3, Misc Q1 |
| Algebra: add, subtract, multiply, expand | 7 | Ex 4.1 Q4–Q10 |
| Multiplicative inverses & Ex 4.1 finale | 4 | Ex 4.1 Q11–Q14 |
| Conjugate, modulus & division mastery | 7 | Misc Q2, Q3, Q5–Q9 |
| Advanced identities & modulus proofs | 6 | Misc Q4, Q10–Q14 |

Applied via `scripts/math11-book/reconcile_ch4_ncert_practice.js`, which uses `book-writer.js`'s
`savePage` (version-snapshotted, audit-logged, no content-loss flagged — same 3 blocks kept, only the
`practice_bank` block's `sections` and the page's intro text/subtitle were rewritten to be accurate).

**Not done this pass (deferred, per task priority on the practice bank):** swapping any
`worked_example` blocks (variant `solved_example`) on pages 1–7 for the real NCERT in-text Examples
1–8 (`ncert_intext`). The existing worked examples are still original/independently-verified, not
false-labeled, so this is a polish opportunity rather than a correctness bug.

---

## B. Final page list (10 pages, `page_number` 0–9)

| # | Slug | Title | Scope |
|---|---|---|---|
| 0 | `complex-numbers-opener` | Complex Numbers and Quadratic Equations | Chapter opener: motivate with $ x^2+1=0 $, no real solution; outcome bullets. `page_type: chapter_opener`, minimal per §15.1 (no food-for-thought). |
| 1 | `what-is-a-complex-number` | What Is a Complex Number? | $ i $, $ i^2=-1 $; $ a+bi $; Re/Im; purely real/imaginary; powers of $ i $ cycle (table). |
| 2 | `algebra-of-complex-numbers` | The Algebra of Complex Numbers | Addition, subtraction, multiplication; commutative/associative/distributive laws; identities. |
| 3 | `conjugate-modulus-division` | Conjugate, Modulus & Division | Conjugate $ \bar z $; $ z\bar z=a^2+b^2 $; division by rationalizing; modulus $ \lvert z\rvert $; key properties. One `math_graph` (conjugate-as-reflection). |
| 4 | `the-argand-plane` | The Argand Plane | Plotting $ a+bi $ as the point $ (a,b) $; quadrants; distance = modulus. **Two `math_graph` blocks** (a 4-point family figure + an addition/parallelogram-rule figure). |
| 5 | `polar-representation` | Polar Representation | $ r $, $ \theta $ (argument), $ z=r(\cos\theta+i\sin\theta) $; principal argument; converting both ways. **Two `math_graph` blocks** (`unit-circle` archetype reused + a 3-point polar family figure). |
| 6 | `quadratic-equations-complex-roots` | Quadratic Equations with Complex Roots | $ b^2-4ac<0 $; quadratic formula; conjugate-pair roots. One `math_graph` (two parabolas, $ D>0 $ vs $ D<0 $, ties back to the opener). |
| 7 | `mixed-worked-examples` | Bringing It Together | 5 worked examples mixing algebra + conjugate/division + polar + quadratic roots — the integrative page before practice. |
| 8 | `complex-numbers-practice` | Practice — Exercises | `practice_bank`, 5 revision themes, 30 items, full worked solutions (see §D). |
| 9 | `complex-numbers-recap` | Chapter Recap | Formula/definition tables, a swap-traps table, 2 reasoning self-checks, one 4-question integrative quiz. |

---

## C. The Argand-plane `math_graph` judgment call (read before building similar pages)

The task asked for a genuinely graph-friendly treatment of the Argand plane: complex numbers as
points, and — where feasible — a rotating point on a circle for polar form. Decisions made:

1. **Points as data, not vectors.** `MathGraphSpecSchema.points[]` only accepts fixed `{x, y}` numbers
   (no expression-driven position) and there is **no native segment/line/arrow primitive** in spec
   mode — only `functions[]` (curves over the whole visible domain), `points[]`, `regions[]`
   (inequality shading), `annotations[]` (floating text) and `table`. So:
   - **Plotting a complex number as a point** → trivial, first-class use of `points[]`.
   - **"The vector from the origin to z"** → NOT literally drawable (no arrow primitive, confirmed by
     inspecting `MathGraphBoard.tsx`'s spec-mode renderer, which only wires `functions`/`points`/
     `annotations`/`table`). Represented instead by a labelled point **plus a text annotation**
     naming the modulus/argument — sufficient to teach the plane, per the task's own guidance.
   - **The parallelogram/addition rule** (Page 4, second graph) → drawn as **three labelled points**
     ($ z_1 $, $ z_2 $, $ z_1+z_2 $) with a `predict` gate ("where will the sum land?") and an
     `annotations[]` line spelling out the parallelogram rule in words. No connecting segments are
     drawn (the primitive doesn't exist) — this is a scope boundary, not an oversight.

2. **Rotating point on a circle for polar form (Page 5)** — the shipped **`unit-circle` archetype**
   (`packages/book-renderer/blocks/math-graph/archetypes.ts`) already IS exactly this: a $ \theta $
   slider drives a point at $ (\cos\theta, \sin\theta) $ on the unit circle, with live `sin θ`/`cos θ`
   readouts. It is reused as-is (no new archetype needed) and re-framed for this chapter: the point
   traces $ z=\cos\theta+i\sin\theta $, i.e. **every complex number of modulus 1**, as $ \theta $
   sweeps $ 0 $ to $ 2\pi $. This is a direct, honest fit — the archetype was built for trigonometry
   but the mathematics (a point parametrized by angle on a circle) is identical to the polar-form
   story.
   - **Limitation:** the archetype is fixed at radius 1 (no `r` param), so it only demonstrates
     modulus-1 complex numbers. For the **general-modulus** case (most exam questions), Page 5 adds a
     **second, static spec-mode family figure**: 3 labelled points at different $ (r,\theta) $ pairs
     (e.g. $ 1+i $, $ -1+i\sqrt3 $, $ -2i $), each annotated with both its rectangular and polar form.
     Building a new "rotating point at an arbitrary, author-set radius" archetype would be a code
     ship (§2A governance split) — reasonable future work, not required for this raw-structure pass.

3. **`keepSquare: true`** on every Argand-plane graph (equal unit scale — a real modulus must measure
   correctly on both axes).

---

## D. Practice bank (Page 8) — themes and count

> **Superseded by the §A2 reconciliation (2026-07-24).** The table below describes the ORIGINAL
> raw-structure build (30 invented items, `source:'mcq'`). It has been fully replaced with the real
> NCERT exercise set — see §A2 for the current 5-theme, 28-item breakdown (Ex 4.1 Q1–14 + Miscellaneous
> Exercise Q1–14, all `source:'ncert_exercise'`). Kept here for history only.

5 sections, **30 items total** *(original build — see §A2 for the current 28-item real-NCERT set)*,
all `kind: 'numerical'` with a full worked `solution`, `source: 'mcq'` (see §A sourcing note),
regrouped by skill rather than textbook exercise order:

| Section | Items | Covers |
|---|---|---|
| 1. Powers of $ i $ & definitions | 6 | Simplifying $ i^n $ for large/negative $ n $; identifying Re/Im; purely real vs purely imaginary |
| 2. Algebra of complex numbers | 6 | Add/subtract/multiply; verifying the algebraic laws; simplifying products |
| 3. Conjugate, modulus & division | 6 | Rationalizing a quotient; modulus/conjugate properties; multiplicative inverse |
| 4. Argand plane & polar form | 6 | Plotting/identifying quadrants; converting rectangular ↔ polar; principal argument |
| 5. Quadratic equations with complex roots | 6 | Solving $ ax^2+bx+c=0 $ with $ D<0 $; verifying conjugate-pair roots |

---

## E. Scope boundaries (deferred to a later refinement pass)

- **Deferred:** faded worked-example ladders (fully-worked → partial → solo), `tier: competitive`
  marking, a chapter-wide predict-first gate on every single interactive (only the marquee graphs
  carry `predict` in this pass), full FORMAT-v2 teacher-voice polish pass, and a
  `/math-content-critic`-style review.
- **Deferred (NCERT-adjacent but out of core scope):** De Moivre's theorem and $ n $-th roots of unity
  — not in the NCERT Class 11 Ch.4 core spine (an occasional JEE-enrichment topic); not built here.
  Complex coefficients in the quadratic (vs. the standard real-coefficient case) are also not covered
  — NCERT Ch.4's core treatment is real-coefficient quadratics with $ D<0 $.
- **In scope, fully built:** everything in §A's five sub-sections, both practice and recap.

---

## F. Build sequencing

1. `_book_ch4.js` — scaffold (copy of `_book.js` with `CH.number=4`).
2. `build_ch4_pages_0_3.js` — pages 0–3.
3. `build_ch4_pages_4_7.js` — pages 4–7 (the Argand/polar/quadratic/mixed pages).
4. `build_ch4_practice_recap.js` — pages 8–9 (practice bank + recap).
5. `npx tsx scripts/math11-book/_validate.mts` — confirm all pages, all chapters, Zod-valid.
6. `node scripts/livebooks-state.js` — refresh `_agents/state/LIVE_BOOKS_STATE.md`.
7. Founder review: visual/interaction pass on the 6 `math_graph` blocks (not eyeballed this session,
   per CLAUDE.md §5.2 — no preview server started).

### F2. Reconciliation sequencing (2026-07-24, done — see §A2)

8. Read the real Ch.4 PDF in full (13 pages) — found the real spine (§A2), including the
   no-quadratic-section / no-polar-form / only-2-exercises discovery.
9. Inspected all 10 live pages' current `blocks` via MongoDB directly (not the historical build
   scripts) to confirm the DB matches what the build scripts describe.
10. `reconcile_ch4_ncert_practice.js` — replaced the practice bank's 30 invented items with the 28
    real, verbatim, independently re-solved NCERT questions (`source:'ncert_exercise'`) via
    `book-writer.js`'s `savePage` (dry-run first, confirmed no content-loss flag, then applied —
    version 1 snapshotted, `book_audit` logged).
11. `npx tsx scripts/math11-book/_validate.mts` — re-confirmed `✅ ALL VALID` across every chapter.
12. `node scripts/livebooks-state.js` + manual Changelog entry.
13. **Left pages 5/6/7 structurally untouched** — flagged as an open founder decision (§A2), not
    unilaterally deleted/restructured, per CLAUDE.md §0.6.
14. **Still open for the founder:** the pages-5/6/7 scope decision (§A2), and — as a nice-to-have,
    not done this pass — swapping any invented `worked_example` blocks for the real NCERT in-text
    Examples 1–8 where a close match exists on the same page.
