# Math Live Book — Page Workflow (canonical)

> **Read this before authoring ANY page of a math Live Book.** It is the math-specific
> companion to [`BOOK_PAGE_WORKFLOW.md`](BOOK_PAGE_WORKFLOW.md) — that doc still governs
> page structure, hero banners, image prompts, callout variants and quiz hygiene. This
> doc governs what makes a *math* page different, and it is the reusable pedagogy
> distilled from building **Chapter 0 "Meet the Graphs"** and **Chapter 2 "Relations and
> Functions"** (Class 11). Every later math chapter — Trigonometry, Straight Lines,
> Conics, Sequences, Limits — follows this.
>
> Reference standard: **Thomas' Calculus §1.1–1.2** (the founder's chosen reference).
> Research basis: `_agents/plans/MATH_LIVEBOOK_PLAN.md` §3 (math-averse pedagogy).
>
> **White-text opacity is governed globally** by [`BOOK_PAGE_WORKFLOW.md`](BOOK_PAGE_WORKFLOW.md) §17.3.1 — a strict four-tier scale (`/82` body · `/85` emphasis · `/60` secondary · `/45` meta; ceiling `/85`, floor `/45`, `/90` and the `/25`–`/40` band banned). It applies to every Live Book renderer, this track included — never introduce another `text-white/NN` value.

---

## 1. The one rule that governs everything

**In a math book, the interactive graph IS the diagram.** Where a chemistry page reaches
for an `image` block, a math page reaches for a **`math_graph`** block. Static graph
images are not authored — the engine draws vector graphs from data, so they are
theme-aware, crisp, editable by faculty, and need no image pipeline.

The corollary, learned the hard way: **a moving curve and a family of curves teach
different things.** An interactive shows *cause and effect* ("I moved k, it went up"); a
multi-curve figure shows *relationship* ("these four are the same bowl at four heights").
A good math page uses **both**, in that order.

---

## 2. The page rhythm (the reusable spine)

Every concept-teaching math page follows this beat order. Not every page needs every
beat, but the **order never changes** — it is a concreteness-fading ladder.

| # | Beat | Block | Why |
|---|---|---|---|
| 1 | **Setup — what the dials do** | `text` (bullets) | 2–3 bullets: *this is X, this is Y, **Try this:** …*. **Never a prose paragraph** — this is a hands-on instruction, not theory. |
| 2 | **Play — the interactive** | `math_graph` (archetype) | One idea at a time. Ungated on first exposure (see §4). |
| 3 | **Notice — a reflective nudge** | `curiosity_prompt` | Open-ended, no MCQ, no gate. Points at the surprising bit. |
| 4 | **Family — the revision figure** | `math_graph` (static, 3–4 curves) | The Thomas move: several curves at once, coloured + labelled. Quick visual revision of what they just practised. |
| 5 | **Rule — the formula card** | `callout[remember]` | The boxed reference. Short, memorable, the "Shift Formulas" idea. |
| 6 | **Prove it — the challenge** | `math_graph` + `challenge` | Auto-checkable: match the dashed goal. Our superpower over paper. |
| 7 | **Worked example** | `worked_example` (+ paired graph) | Pair every worked example with a small `math_graph` where the result is visual. |
| 8 | **Check** | `inline_quiz` / `reasoning_prompt` | Per `BOOK_PAGE_WORKFLOW` §3.6.1 — real-misconception distractors. |
| 9 | **Bridge** | `text` | One line to the next page. |

---

## 3. The `math_graph` toolkit (what the engine gives you)

All of it is **data** — faculty author every one of these in the admin books-editor with
no code. Extending what the engine *can do* is a code ship; using it is not.
(Governance: `MATH_LIVEBOOK_PLAN.md` §2A.)

**Modes**
- **Archetype** — a named, pedagogically-loaded construction (14 available: `line-explorer`,
  `transformations`, `shift-explorer`, `stretch-explorer`, `power-family`, `unit-circle`,
  `step-explorer`, `vlt-sweep`, `even-odd-mirror`, `piecewise-highlight`, `tangent-explorer`,
  `area-under-curve`, `reflection`, `sequence-pattern`).
- **Spec** — declarative: `functions[]`, `sliders[]`, `points[]`, `regions[]`, `table`,
  `annotations[]`. This is how you build a **static family figure**.

**Features to reach for**
- `compare: true` — adds the **"Keep this curve"** family builder. Students freeze faint
  coloured copies and assemble the family by hand. **Put this on every transformation
  interactive.**
- `challenge: { targets, tolerance, prompt, success }` — the **match-the-graph** exercise.
  Draws a dashed *Goal* curve and self-checks as the student closes in.
- `predict: { prompt, options, answer_index, reveal }` — the predict-first gate. See §4.
- `spec.annotations[]` — free-floating labels ("up 2", "← left 3") for family figures.
- `spec.table` — the linked graph + table + equation panel (multi-representation).
- **The governing equation is automatic** — every slider-driven graph shows its live
  equation under the sliders. Never omit it; it is the drag→symbol link.

**Layout**: sliders live in an HTML sidebar *outside* the canvas; the graph is square and
grows to fill the row. Never put controls on the canvas (they were draggable — a real bug).

**Bounds — size to content, never leave the default**
- If you omit `spec.bounds`, the board falls back to a `-6..6` default on both axes. For an
  archetype whose natural geometry is small (e.g. `unit-circle`, radius 1), this strands the shape
  in a mostly-empty frame — a real bug, founder-reported 2026-07-24 on the Trig chapter's "Measuring
  Angles" page (screenshot showed a tiny circle in a huge empty grid).
- **Archetype blocks CAN still set `spec.bounds`** even though the archetype supplies the geometry —
  `archetype` and `spec` are independent fields, and `MathGraphBoard` reads `spec?.bounds`
  regardless of which mode drew the shapes. Pass a tight `spec: { bounds: {...} }` alongside
  `archetype: '...'` whenever the archetype's natural scale is much smaller than ±6 units.
- Rule of thumb: bounds should be roughly **1.3–1.8× the shape's natural extent** — enough margin
  for labels/readouts, not so much that the shape reads as tiny. For `unit-circle` (radius 1, with
  the readouts panel needing headroom), `{xmin:-1.8, xmax:2.6, ymin:-1.6, ymax:2.1}` is the
  reference value now in use across Ch.3.
- Check this on **every** archetype-only block you author — it's easy to miss because the block
  still renders successfully, it just looks wrong.

**Readouts — live key/value labels are boxed HTML, never raw canvas text**
- `readouts` (an `ArchetypeResult` field — see `archetypes.ts`) is the mechanism for a live,
  colour-coded key/value display on a graph, e.g. `sin θ = 0.90`, `cos θ = -0.43`. It returns
  `{ label, value, color }[]` from the current slider values, and the renderer places it in a
  proper boxed HTML panel (top-left corner of the canvas) automatically — matching the visual
  language of the equation card and the curve legend.
- **Never draw a live value as raw canvas text** via `board.create('text', ...)` inside an
  archetype. It renders small (fontSize 13, no background) and reads as inconsistent next to every
  other boxed readout in the engine. This was exactly the bug on `unit-circle`'s sin/cos display
  (founder-reported 2026-07-24, fixed by moving it to `readouts`) — if you're building a NEW
  archetype that needs to show a live number, use `readouts` from the start.
- This only matters when **adding or editing an archetype** (a code ship, per `MATH_LIVEBOOK_PLAN.md`
  §2A) — authoring a page from existing archetypes via the admin builder never touches this.

---

## 4. When to gate, and when NOT to (the hard-won rule)

> **Predict-first only works once the student has something to predict *from*.**

Asking a student to predict where `f(x+3)` moves *before they have ever seen a shift* is
not productive struggle — it is a coin flip, and for a math-anxious student it is
discouraging. This was the single biggest pedagogy correction in the build.

| Situation | Gate? |
|---|---|
| **First exposure** to a shape or a transformation | **No.** Ungated exploration + a `curiosity_prompt`. |
| The student has already played with that exact idea | **Yes** — a predict gate now lands as earned productive struggle. |
| Revision / recognition pages | **Yes**, and add a `challenge`. |

Chapter 0 is the reference implementation: **9 ungated interactives, 1 gentle predict** at
the very end, then challenges. Chapter 2's gates are earned because Ch.0 precedes it.

A foundations chapter should say so out loud — Ch.0's opener promises *"no tests and no
predict-the-answer traps, just play"*. That promise lowers anxiety and is worth keeping.

---

## 5. Building a family / revision figure (the Thomas figure)

A static `math_graph` with 3–4 curves. Rules:

- **3–4 curves maximum.** Five is soup.
- **One colour per curve**, from the accent palette (`violet`, `sky`, `amber`, `emerald`,
  `pink`, `orange`), and **label every curve** via `functions[].label`.
- Put the **base curve in `sky`** and the variations in violet/amber/emerald, so the
  "original vs changed" reading is instant.
- Add `annotations[]` for the *distance* ("up 2", "← left 3") — this is what makes the
  relationship legible rather than merely visible.
- **Place it AFTER the interactive**, never before. It is revision, not instruction.
- Caption it with the takeaway sentence, not a description.

```jsonc
{
  "type": "math_graph",
  "title": "Revision: sliding up and down",
  "caption": "Same bowl, three heights.",
  "spec": {
    "bounds": { "xmin": -4, "xmax": 4, "ymin": -4, "ymax": 8 },
    "functions": [
      { "expr": "x^2 + 2", "color": "violet", "label": "x² + 2" },
      { "expr": "x^2",     "color": "sky",    "label": "x²" },
      { "expr": "x^2 - 2", "color": "amber",  "label": "x² − 2" }
    ],
    "annotations": [{ "x": 0.35, "y": 1, "text": "up 2", "color": "violet" }],
    "showGrid": true, "showAxes": true, "keepSquare": true
  }
}
```

**`keepSquare`**: leave it `true` (equal unit scale — a circle must look round). Set it
`false` only when the two axes have genuinely different natural ranges (e.g. °C → °F).

---

## 6. Writing the setup bullets (beat 1)

This replaced prose paragraphs after founder feedback: *"this is not theory."*

- **2–3 bullets, never a paragraph.**
- One bullet per dial: **bold the dial**, then what it does, in plain words.
- The last bullet is always **"Try this:"** — a concrete, do-able instruction.
- Reassure where the idea is counter-intuitive ("this one has a famous twist — don't take
  my word for it, drag it").

```markdown
- **m controls the tilt** — bigger m = steeper; negative m = downhill; m = 0 is flat.
- **c controls where it crosses the y-axis** — it slides the whole line up or down.
- **Try this:** drag m past zero into negative numbers. Nothing to get right — just notice.
```

---

## 7. Formula reference cards & standalone equations

Use `callout[remember]` with an explicit `title` (e.g. "Shift Formulas", "The Four Dials").
Keep them **short, boxed and scannable** — they are for recall, not teaching. Put them
*after* the exploration that earned them, before the quiz. Formulas use `$…$` LaTeX per
CLAUDE.md §4 (single dollars, `\frac` not `\dfrac`).

**Standalone equation cards (`latex_block`, `highlight: true`)** — for one important formula
that isn't wrapped in a `callout[remember]` (e.g. a chapter's "Arc length" or "Degree ↔ radian
conversion" card). The box is **shrink-to-fit** (it hugs short content and grows for long
content, never stretches to the full column width regardless of what's inside) — but box
sizing only solves half of what can go wrong:

- **One equation, or a short two-clause chain, per line — never three+.** `\theta = \frac{l}{r},
  \text{i.e.} \, l = r\theta` is fine on one line. Three independent statements joined by commas
  and `\quad`s is NOT — it forces horizontal scroll on a phone-width column, which is bad design
  (founder-reported 2026-07-24 on the Trig chapter's degree↔radian card, which crammed
  `π radian = 180°, so radian measure = ..., degree measure = ...` onto one line). If a formula
  has 2+ independent clauses, split it into a **multi-row `\begin{gathered} ... \\ ... \end{gathered}`**
  block instead — KaTeX supports line breaks inside `gathered`/`aligned`/`array` natively.
  `\\[6pt]` adds a little breathing room between rows.
- The box is a **neutral dark card by default, never a coloured tint background.** An earlier
  amber-wash version read as "unprofessional / neon" (founder feedback 2026-07-24 — the same
  lesson `CalloutBlockRenderer` had already learned once for callouts). Don't reintroduce a
  background tint on a per-block basis; if a chapter genuinely needs a distinct visual accent,
  that's an engine change to propose, not a one-off inline style.

```jsonc
{
  "type": "latex_block",
  "latex": "\\begin{gathered} \\pi \\text{ radian} = 180^\\circ \\\\[6pt] \\text{radian measure} = \\frac{\\pi}{180} \\times \\text{degree measure} \\\\[6pt] \\text{degree measure} = \\frac{180}{\\pi} \\times \\text{radian measure} \\end{gathered}",
  "label": "Degree ↔ radian conversion",
  "highlight": true
}
```

---

## 8. Match-the-graph challenges

The exercise a paper textbook cannot set. Use one per transformation page and one as a
chapter-closing "final boss".

- Pick a target that is **reachable but not trivial** — usually a pure shift early on,
  a shift+stretch later.
- `tolerance: 0.25` is a good default (forgiving enough not to frustrate, tight enough to
  mean something).
- The `prompt` should hint at the *kind* of move ("it hasn't been stretched — only moved").
- The `success` message must **name the resulting equation** — that is the learning.

---

## 9. Quality checklist (run before publishing a math page)

1. Does every interactive show its **governing equation**?
2. Is the **first exposure ungated**, with gates only where earned (§4)?
3. Is there a **family/revision figure** after the interactive?
4. Are the setup bullets **bullets**, ending in a **"Try this:"**?
5. Is there a **formula card** for any rule worth memorising?
6. Does the page have at least one **auto-checkable** element (challenge or quiz)?
7. Do quiz distractors encode **real misconceptions** (`BOOK_PAGE_WORKFLOW` §3.6.1)?
8. Is `keepSquare` correct for the axis ranges?
9. Does every archetype-only `math_graph` block have an explicit, content-sized `spec.bounds`
   (never left at the `-6..6` default — §3 "Bounds")?
10. Does any `latex_block` on the page cram 3+ clauses onto one line? If so, split it into a
    `\begin{gathered}...\end{gathered}` block instead (§7).
11. Does the page end with a **one-line bridge**?
12. Validate: `npx tsx scripts/math11-book/_validate.mts` → all pages Zod-valid.

---

## 10. Reference implementations

- **Chapter 0 "Meet the Graphs"** (`class11-mathematics`, chapter 0) — the foundations /
  ungated-exploration model, with compare mode, family figures, formula cards and
  challenges. Build scripts: `scripts/math11-book/build_ch0_meet_graphs.js` + `enrich_ch0.js`.
- **Chapter 2 "Relations and Functions"** — the NCERT-spine model: formal definitions,
  worked examples, earned predict gates. `scripts/math11-book/build_ch2_pages_*.js`.
- **Chapter 3 "Trigonometric Functions"** — the `unit-circle` archetype reused across several
  pages; also the source of the bounds/readouts/latex_block fixes in §3 and §7 (founder-reported
  2026-07-24, fixed via `scripts/math11-book/fix_ch3_unit_circle_bounds.js` and
  `fix_ch3_degree_radian_latex_wrap.js` — read these two scripts as worked examples of the
  `savePage`-based fix pattern for an already-published page).
- Engine: `packages/book-renderer/blocks/math-graph/` (`archetypes.ts`, `MathGraphBoard.tsx`,
  `theme.ts`) · standalone-equation renderer: `packages/book-renderer/blocks/LatexBlockRenderer.tsx`
  · admin authoring: `apps/admin/features/admin/books-editor/blocks/MathGraphEditor.tsx`.
