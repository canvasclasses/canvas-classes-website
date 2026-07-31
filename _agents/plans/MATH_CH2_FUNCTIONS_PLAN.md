# Class 11 Math Live Book — Chapter Plan: **Relations and Functions** (NCERT Ch.2)

> **✅ BUILT 2026-07-23 (unpublished).** Book `class11-mathematics` + chapter "Relations and Functions",
> **11 pages** authored via `scripts/math11-book/` (`_book.js` scaffold + `build_ch2_pages_0_4.js` +
> `build_ch2_pages_5_9.js` + `build_ch2_practice.js`), all `published:false` and Zod-valid (`_validate.mts`).
> **12 `math_graph` blocks** across 7 archetypes (line-explorer, power-family, even-odd-mirror,
> piecewise-highlight, step-explorer, transformations, vlt-sweep) + spec/linked-table mode; 9 quizzes,
> 9 worked examples.
>
> **✅ PRACTICE PAGE BUILT 2026-07-24 (page 10, unpublished).** The Page-9 blueprint's `practice_bank` is
> now its own end-of-chapter page (`relations-functions-practice-ncert`, slug), mirroring the proven
> `scripts/*/\_practice/` CONTRACT: hero + intro + one `practice_bank` holding **all 36 NCERT Ch.2
> exercises** (Ex 2.1 ×10, Ex 2.2 ×9, Ex 2.3 ×5, Miscellaneous ×12) **sourced verbatim from the NCERT
> PDF** (`…/Math Books/NCERT Class 11 Maths/Ch2 - Relations and Functions.pdf`, Rule 0 satisfied) and
> **regrouped from textbook order into 5 revision themes** — Cartesian products (10) · relations/domain-range
> (9) · when-is-a-relation-a-function (5) · domain & range of real functions (7) · evaluating & combining
> functions (5). Every item is a tap-to-reveal **worked solution** in the book's plain teacher voice
> (arithmetic re-derived + verified by hand; no fabricated PYQ attribution — all tagged `ncert_exercise`).
> Recap page's closing line now points to it (via `book-writer.savePage`, versioned; `patch_ch2_recap_pointer.js`).
> Build: `scripts/math11-book/build_ch2_practice.js` (exports `practicePage` + guards DB write behind
> `require.main`, so it can be Zod-dry-run without a DB round-trip).
> The 5 new archetypes were added to the tool first. **Transformations is a core in-continuity page**
> (Page 8), not tier-competitive (founder call). Remaining: founder visual/interaction pass (graphs
> render client-side, not eyeballed this session per §5.2), then generate the 10 hero images (dark-bg
> prompts already on each page) via `scripts/livebook-images/`, then publish.
>
> **Status:** BUILD-READY blueprint — 2026-07-23. This is chapter 1 of the Class 11 Math Live Book
> (parent plan: [`MATH_LIVEBOOK_PLAN.md`](MATH_LIVEBOOK_PLAN.md); grapher tool already built §2A/§BUILD).
> **Spine:** NCERT Class 11 Mathematics **Chapter 2 — Relations and Functions** (`kemh102`, 19 pp;
> PDFs persisted at `…/Math Books/NCERT Class 11 Maths/`). **Enrichment:** Thomas' Calculus (Hass/Heil)
> **Ch.1 "Functions"** (physical pp.25–70) — the founder's chosen reference. **Pedagogy:** the
> math-averse principles in `MATH_LIVEBOOK_PLAN.md` §3.
>
> The purpose of building this chapter first: it is the real proving ground for the `math_graph` tool —
> every concept that is a graph is authored as a `math_graph` block, and the chapter surfaces exactly
> which new archetypes the tool still needs (see §D).

---

## A. The reference-blend policy (what to take from each)

NCERT and Thomas are complementary, not redundant. Hold both:

| Take from **NCERT** (the spine — required scope, examples, exercises) | Take from **Thomas** (the pedagogy NCERT lacks) |
|---|---|
| Ordered pairs → Cartesian product `A×B` → relation as a **subset** of A×B → function as a **special relation** (this build-up has NO Thomas analogue) | **Function-as-machine** intuition; **dependence-first** opener ("y depends on x") before any symbol |
| Domain / codomain / range vocabulary; `range ⊂ codomain`; `n(A×B)=pq`; number of relations `2^{pq}` | **Domain/range mechanics** + **natural domain**; the **±√ as a non-function** hook; **vertical-line test** taught on the circle |
| The 7 function families (identity, constant, polynomial, rational, modulus, signum, greatest-integer) + their tables | The **function families as a connected catalogue** with symmetry + monotonicity; **even/odd** ("x+1 is neither") |
| Algebra of real functions (+, −, ×, ÷, scalar); Examples 16–17 | **Graphical addition** (f+g pointwise); **transformations** `a·f(b(x−h))+k` (the graph-tool gold) |
| The exam-facing exercises (2.1, 2.2, 2.3, Miscellaneous) — used verbatim in the practice bank | Real-world hooks with numbers (compound interest, carbon-14, parking-lot ceiling, open-box domain, Boyle's law) |

**Voice:** FORMAT v2 teacher voice (Hinglish-friendly plain English for tier-2/3 students; no icon headings;
Shortcut / Watch-out labels) — the math voice bank mirrors the chemistry one. **Attribution:** NCERT is the
frame; Thomas figures/examples are adapted (own numbers/wording), never copied.

## B. Chapter-wide design rules (math-averse, from parent §3)

1. **The interactive graph IS the diagram.** Where a science page uses an `image` block, a math page uses a
   **`math_graph`** block. Static graph images are avoided; the student manipulates instead.
2. **Predict-first gate on every marquee interactive** — commit a guess, *then* the graph unlocks
   (`math_graph.predict`). Never reveal the behaviour cold.
3. **Concreteness fading per function family:** machine/context → **numeric table** (NCERT's tables) →
   **graph** → **symbol**. The `math_graph` **linked table** mode does the table→graph bridge live.
4. **Worked-example ladder:** every problem type = fully-worked → faded → solo (extend `worked_example`).
5. **Interleave** in the practice bank (mix relation/function/domain/family/algebra items — force method choice).
6. **No timers; retryable quizzes;** real-misconception distractors (§3.6.1).
7. Per Live-Book template (§4A/§15): hero (16:5) → curiosity/fun_fact opener → objectives per `heading[2]` →
   concept → mid-page `reasoning_prompt` after each concept → worked examples → `inline_quiz` → one-line
   **bridge** to the next page. Cap ~18 blocks / one sub-topic per page (§15.8).

---

## C. Page-by-page blueprint (10 pages)

> Each page is a `book_pages` doc, authored via the admin books-editor + `book-writer.js`, `published:false`
> pending founder review. Block sequences below are the plan, not literal JSON. **MG#** cross-refs the
> interactive manifest in §D. Hero-banner prompts are dark-bg per §3.4.2 (written at build time).

### Page 0 — Chapter Opener: "Relations and Functions"
- **Type:** `chapter_opener` (§15.1 — minimal: hero + subtitle + outcome bullets; no food-for-thought).
- **Hero:** cinematic dark visual — a web of connected nodes / a machine turning inputs into outputs.
- **Intro (subtitle):** pattern & correspondence framing (NCERT 2.1) — "much of math is finding a link
  between quantities that change." Leibnitz (1673) as the origin of the word *function*.
- **Outcome bullets:** pair things up (Cartesian product) · spot a relation · tell when a relation earns the
  name *function* · read the function zoo · build new functions from old.
- No quiz. Auto-derived journey list.

### Page 1 — Ordered Pairs & Cartesian Products (NCERT 2.2)
- **Hook** (`callout[fun_fact]`): licence-plate codes (DL/MP/KA × 01/02/03) or colours×objects — pairing is
  everywhere. **Order matters:** (DL,01) ≠ (01,DL).
- **Concept** (`text`): ordered pair; `A×B = {(a,b): a∈A, b∈B}`; `n(A×B)=pq`; `A×φ=φ`; `A×B ≠ B×A`.
- **MG1 — `math_graph`:** the plane as `R×R`. Two draggable points `P=(a,b)` and `Q=(b,a)` on a lattice;
  dragging shows they land in different places → "order matters" made visual. (spec mode: 2 draggable points.)
  **Predict:** "Is (2,3) the same point as (3,2)?"
- **Worked examples:** NCERT Ex 1 (equal ordered pairs), Ex 3 (A×(B∩C) etc.), Ex 6 (recover A,B from A×B) —
  as a faded ladder.
- **Reasoning check** (`reasoning_prompt`): given n(A)=3, n(B)=2, how many pairs? how many relations later?
- **Quiz** (`inline_quiz`, 3 Q) → **Bridge:** "Pick out *some* of these pairs by a rule — that's a relation."

### Page 2 — Relations (NCERT 2.3)
- **Hook:** everyday relations (brother–sister, "x is the first letter of name y").
- **Concept:** relation = **subset** of A×B; arrow diagram; **domain / codomain / range** (`range ⊂ codomain`);
  number of relations `= 2^{pq}`.
- **Visual — arrow diagram:** `image` (mapping diagrams aren't graphs) OR `interactive_image`. **Plus MG2 —
  `math_graph`:** plot the relation `R = {(x,y): y=x+1}` on A={1..6} as **lattice points** (spec: fixed
  points) so students see a relation living in the plane, not just an arrow picture.
- **Worked:** NCERT Ex 7 (arrow diagram + domain/range), Ex 8 ("x is square of y" — note it's NOT a function,
  seeds page 3), Ex 9 (count relations).
- **Reasoning check** + **Quiz (3 Q)** → **Bridge:** "Example 8 broke a rule — one input, two outputs. When
  is that allowed? Next: what makes a relation a *function*."

### Page 3 — What Makes a Relation a Function? (NCERT 2.4 def + Thomas VLT) — **the pivot page**
- **Food-for-thought opener** (`curiosity_prompt` ×1–2): "A machine gives one output per input. Is 'the
  square root of x' a machine you can trust?" (seeds ±√ non-function).
- **Concept:** function = every element of A has **one and only one** image (NCERT Def 5). Thomas
  **machine** framing + arrow diagram (inputs may share an output; one input can't have two).
  **±√ as a non-function** (Thomas) — the sharp counter-example.
- **MG3 — `math_graph` (marquee, needs new archetype `vlt-sweep`, MG#9):** a draggable **vertical line**
  over a curve with a live **intersection counter**. Show it on the **circle** x²+y²=1 (2 hits → not a
  function) then on a parabola (1 hit → function). **Predict-first:** "Drag the line across the circle — how
  many times does it cross? Is a circle a function?"
- **Independent/dependent variable** language; `f: A→B`, `f(a)=b`, image/preimage.
- **Worked:** NCERT Ex 10 (y=2x on N — is it a function?), Ex 11 (three relations, which are functions).
- **Reasoning check** + **Quiz (4 Q)** → **Bridge:** "Every function has a *domain* it eats and a *range*
  it spits out. Let's measure them."

### Page 4 — Domain, Range & the Function Machine (NCERT real function + Thomas domain/range)
- **Hook:** Celsius→Fahrenheit machine `t(C)=9C/5+32` (NCERT Ex 2.3 Q4) — a real function you can feel.
- **Concept:** function-as-machine (independent x → dependent y); **domain, range, codomain**; **natural
  domain** (Thomas — "largest set of x giving real y"); real-valued / real function (NCERT Def 6).
- **MG4 — `math_graph` LINKED mode (linked graph + table + live equation):** `t(C)=9C/5+32` with a draggable
  input on C and the linked table updating live — the hallmark multi-representation interactive. This is the
  page that best shows the tool. **Predict:** "At C=100, is F above or below 200?"
- **Faded worked ladder — domain/range table** (Thomas Ex 1, adapted): `x²`, `1/x`, `√x`, `√(4−x)`,
  `√(1−x²)` → fully-worked, then faded, then solo. NCERT Ex 12 (f(x)=2x+1 table), Ex 21 (domain of a
  rational), Miscellaneous Ex 3/4/5 (domains/ranges).
- **Quick Recap** (`callout[exam_tip]`): how JEE asks "find the domain" (denominator ≠ 0, even-root ≥ 0).
- **Quiz (4 Q)** → **Bridge:** "Time to meet the regulars — the handful of functions that show up everywhere."

### Page 5 — The Function Zoo, Part 1: Lines & Powers (NCERT identity/constant/polynomial + Thomas powers/symmetry)
- **Concept:** identity `f(x)=x`; constant `f(x)=c`; **linear** `f(x)=mx+c` (NCERT Misc Ex 18/20 —
  f(x)=mx+c); polynomial; power functions `xⁿ`.
- **MG5a — `line-explorer` archetype (already built):** `y=mx+c` with m,c sliders. **Predict:** "increase c —
  does the line tilt or shift?"
- **MG5b — `math_graph` spec:** power family `x`, `x²`, `x³` together (later: n-slider, MG#4). NCERT Ex 13
  (x² table), Ex 14 (x³) as concreteness-fading tables → graph.
- **Even/odd symmetry** (Thomas): `x²` even (y-axis mirror), `x³` odd (180° rotation), and the clincher
  **"x is odd but x+1 is neither."** **MG5c — `reflection` archetype (built) / new `even-odd-mirror`
  (MG#6):** drag a point on the curve, watch its mirror partner `(−x, ±y)` live. **Predict:** "Is x³ symmetric?
  About what?"
- **Reasoning check** + **Quiz (4 Q)** → **Bridge:** "Not every regular is smooth — next, the functions with
  corners, jumps, and steps."

### Page 6 — The Function Zoo, Part 2: Rational, Modulus, Signum, Greatest-Integer (NCERT)
- **Rational `1/x`** (NCERT Ex 15): **MG6a — `math_graph` spec** `1/x` with a **draggable test point**
  tracing toward the asymptotes; domain hole at 0. **Predict:** "What happens to 1/x as x→0⁺?"
- **Modulus `|x|`** (NCERT): V-shape as two glued lines. **MG6b — `math_graph` spec** `abs(x)` (later:
  piecewise-branch highlight archetype, MG#7). **Predict:** "Where does |x| bend, and why?"
- **Signum** — the 3-level function; range {−1,0,1}.
- **Greatest-integer `[x]`** (NCERT — the hardest to teach statically): **MG6c — new `step-explorer`
  archetype (MG#8, top-3 to build):** drag x, read `[x]`, overlay `y=x`, show open/closed dots.
  **Predict:** "What is [2.9]? [−1.2]?" (the −1.2→−2 trap).
- **Quick Recap:** open vs closed dots; range of signum; `[x]` on negatives (the common JEE slip).
- **Quiz (4 Q)** → **Bridge:** "You've met the regulars — now build brand-new functions by combining them."

### Page 7 — Building New Functions: Algebra of Functions (NCERT 2.4.2)
- **Concept:** `(f+g)`, `(f−g)`, `(fg)`, `(f/g)` (g≠0), scalar `(kf)`; **domain = D(f)∩D(g)** (Thomas),
  quotient removes zeros of g.
- **MG7 — `math_graph` spec (graphical addition, MG#10):** plot `f`, `g`, and `f+g` together with a shared
  draggable x showing the pointwise y-add (Thomas Fig 1.25–26, adapted). **Predict:** "At x=1, if f=2 and
  g=3, where is (f+g)?"
- **Worked:** NCERT Ex 16 (f=x², g=2x+1), Ex 17 (f=√x, g=x on non-negatives — the domain-intersection case),
  Misc Ex 7. Faded ladder.
- **Quick Recap:** the domain-of-a-combination trap (intersection; quotient excludes g=0).
- **Quiz (4 Q)** → **Bridge:** "One last power move — take a graph you know and *move* it."

### Page 8 — Transformations: Moving & Reshaping Graphs (Thomas §1.2) — **`tier: competitive` enrichment**
- **Scope note:** transformations are light in NCERT Ch.2 (fuller in Class 12), so this page is **deepening /
  competitive-tier** — but it is where the graph tool shines brightest, and the founder wants to *see* the
  tool. Keep core-tier students oriented; mark advanced beats `tier: competitive`.
- **Concept:** shifts `f(x)+k` / `f(x−h)`; stretch/compress `a·f(x)` / `f(bx)`; reflections `−f(x)` / `f(−x)`.
- **MG8 — `transformations` archetype (already built — the flagship):** `a·f(b(x−h))+k`, 4 sliders, ghost of
  the original. **Predict-first:** "Which way does `f(x+3)` move — left or right?" (the classic reversal trap).
- **Worked:** Thomas Ex 3 (x²→x²+1, (x−2)²), Ex 4 (√x+1 stretch/reflect) — adapted with own numbers.
- **Quick Recap:** `f(x+3)` moves **left** (counter-intuitive); order of transforms matters.
- **Quiz (4 Q)** → **Bridge:** "You can pair, relate, test, measure, catalogue, combine, and reshape functions.
  Let's lock it in."
- **Optional "Beyond" card (`real_world`/competitive):** **composition** `f∘g` (Thomas §1.2) — noted as a
  Class-12 preview, `f∘g ≠ g∘f`. Not a core page (NCERT Ch.2 excludes composition).

### Page 9 — Chapter Recap & Practice (retrieval-only + practice bank)
- **Recap page** (per the retrieval-only pattern — no summary paragraphs): a mindmap
  (pairs→relation→function→families→algebra→transforms), the **function-family table** (name · rule · domain ·
  range · graph shape · symmetry), a **swap-traps table** (relation vs function; domain vs codomain vs range;
  `f(x+h)` vs `f(x)+k`; `[x]` on negatives; even/odd vs neither), 2 reasoning self-checks, and an integrative
  8-Q quiz mixing all sub-topics.
- **`practice_bank`:** NCERT **Exercise 2.1, 2.2, 2.3, and the Miscellaneous Exercise**, verbatim, themed and
  **interleaved** (not grouped by section). Difficulty-tagged. This is the exam-facing surface.

---

## D. Interactive-graph manifest (the tool test — build order)

Every graph above is a `math_graph` block. Most are **already buildable today** with the shipped tool
(declarative spec mode: functions + draggable points + linked table; or the `line-explorer` /
`transformations` / `reflection` archetypes). A handful need **new archetypes** — building them is the code
half of the governance split (§2A), done before/while authoring the chapter.

**Buildable now (spec mode or existing archetypes):**
- MG1 (points: order-matters), MG2 (relation lattice points), MG4 (**linked graph+table+equation** — the
  hallmark, C→F), MG5a (`line-explorer`), MG5b (power family x/x²/x³), MG6a (1/x + draggable point),
  MG6b (|x| via `abs(x)`), MG7 (graphical addition f/g/f+g), MG8 (`transformations` flagship).

**New archetypes to build first (ranked — this is what chapter 1 surfaces for the tool):**
1. **`step-explorer`** (MG#8, greatest-integer `[x]`) — drag x, read `[x]`, overlay `y=x`, open/closed dots.
   *Highest value: NCERT-specific and near-impossible to teach statically.*
2. **`vlt-sweep`** (MG#3/#9, vertical-line test) — draggable vertical line + live intersection counter over a
   curve. *Serves the pivotal "what is a function" page.*
3. **`even-odd-mirror`** (MG5c/#6) — draggable point with its live mirror partner `(−x, ±y)` + reflect motion.
   *Directly serves an NCERT learning objective (symmetry).*
4. **`piecewise-highlight`** (MG6b/#7) — `|x|` (and general piecewise) with the **active branch** highlighted
   as x is dragged.
5. *(stretch)* **power-family n-slider** (MG5b/#4) — integer-n slider sweeping `xⁿ`, highlighting (1,1) & origin.

Each new archetype = one entry in `packages/book-renderer/blocks/math-graph/archetypes.ts` + its
`ARCHETYPE_CATALOG` meta (so faculty can pick it). Ship them, then author the pages — no page needs code.

---

## E. Scope boundaries (so the chapter doesn't over- or under-reach)

- **In (NCERT Ch.2 core):** Cartesian products, relations, functions, the 7 families, algebra of functions,
  all four exercises. Pages 0–7, 9.
- **Enrichment (`tier: competitive`, clearly marked):** transformations (Page 8), even/odd symmetry depth,
  natural-domain nuance, VLT-on-a-circle. Valuable + tool-showcasing, but not tested as Ch.2 core.
- **Deferred to Class 12 (mention only, don't teach):** composition `f∘g` (a "Beyond" card at most), inverse
  functions, one-to-one/onto classification depth. NCERT Class 11 Ch.2 excludes these.
- **Trig / exponential / log:** their own NCERT chapters (Ch.3, later) — Thomas §1.3/1.5/1.6 hooks are saved
  for those chapters, not spent here.

---

## F. Build sequencing (next steps)

1. **Founder review of THIS plan** (page list, scope, the enrichment blend, the tier-competitive call on
   transformations).
2. **Build the 4 new archetypes** in the graph tool (§D) — `step-explorer`, `vlt-sweep`, `even-odd-mirror`,
   `piecewise-highlight` — the code half done up front.
3. **Author pages 0→9** through the admin books-editor + `book-writer.js` (`published:false`), each graph a
   `math_graph` block — the first real, at-scale exercise of the tool and its faculty-authoring flow.
4. **Founder visual/interaction pass** on the built chapter (this is also the promised first real look at the
   grapher in situ).
5. Run the future `/math-content-critic` (parent §Phase 4) once it exists.

### Sources
- NCERT Class 11 Mathematics, **Ch.2 Relations and Functions** (`kemh102`) — spine.
- Thomas' Calculus: Early Transcendentals (Hass, Heil, et al.), **Ch.1 Functions** (§1.1–1.6) — enrichment.
- Pedagogy: `MATH_LIVEBOOK_PLAN.md` §3 (math-averse principles + citations).
