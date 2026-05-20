---
description: Math Question Ingestion Workflow — Two-Phase System (JEE Main / JEE Advanced PYQs)
---

# MATH QUESTION INGESTION WORKFLOW v1.0

> **Design principle:** Phase 1 and Phase 2 are ALWAYS separate operations. Never mix extraction and insertion in the same context window. This is the #1 rule of the entire system — same as chemistry and physics.
>
> **Companion docs:**
> - `QUESTION_INGESTION_WORKFLOW.md` — chemistry sibling; same architecture
> - `PHYSICS_QUESTION_INGESTION_WORKFLOW.md` — physics sibling; same architecture
> - `math-solution-workflow.md` — bespoke 5-part solution style for math (referenced in Phase 4)
> - `chemistry-solution-workflow.md` — chemistry sibling solution workflow (tier-based, 8 tiers)
> - `physics-solution-workflow.md` — physics sibling solution workflow (tier-based, 4 tiers)

> **Tagging scope (project decision, 2026-05-17):** This workflow ingests questions with a **single placeholder tag per chapter** (`tag_ma_<chapter>` — the existing "General Questions" tag in the taxonomy). Primary and micro-concept tags for math chapters are still being designed. Once the new tag set is finalized, we will run a **bulk re-tag pass** across all already-ingested math questions; the Phase 1 extractor should NOT invent or guess tags during this period. See "Tag Backfill (Future)" near the end of this doc.

---

## QUICK REFERENCE (read this first)

### Math Chapter Table — 33 chapters (canonical from `taxonomyData_from_csv.ts`)

> The prefixes below are **frozen** in `scripts/insert_questions.js` (`PREFIX_TO_CHAPTER` map). The insert script derives `chapter_id` and `subject` directly from `display_id`. Never invent new prefixes — if a chapter is missing, edit the insert script's table and this doc together.

```
ALGEBRA (11 chapters)
CHAPTER_ID            PREFIX   PLACEHOLDER TAG          NAME
─────────────────────────────────────────────────────────────────────────────
ma_basic_math         BOMA     tag_ma_basic_math        Basic of Mathematics
ma_quadratic          QUAD     tag_ma_quadratic         Quadratic Equation
ma_complex            CMPL     tag_ma_complex           Complex Number
ma_sequence           SQSR     tag_ma_sequence          Sequences and Series
ma_pnc                PMCM     tag_ma_pnc               Permutation Combination
ma_binomial           BNML     tag_ma_binomial          Binomial Theorem
ma_reasoning          MRES     tag_ma_reasoning         Mathematical Reasoning
ma_statistics         STAT     tag_ma_statistics        Statistics
ma_matrices           MTRX     tag_ma_matrices          Matrices
ma_determinants       DTRM     tag_ma_determinants      Determinants
ma_probability        PROB     tag_ma_probability       Probability

CALCULUS (10 chapters)
CHAPTER_ID            PREFIX   PLACEHOLDER TAG          NAME
─────────────────────────────────────────────────────────────────────────────
ma_sets_rel           STRL     tag_ma_sets_rel          Sets and Relations
ma_functions          FUNC     tag_ma_functions         Functions
ma_limits             LIMS     tag_ma_limits            Limits
ma_continuity_diff    CTDF     tag_ma_continuity_diff   Continuity and Differentiability
ma_differentiation    DIFF     tag_ma_differentiation   Differentiation
ma_aod                AODV     tag_ma_aod               Application of Derivatives
ma_indef_int          ININ     tag_ma_indef_int         Indefinite Integration
ma_def_int            DFIN     tag_ma_def_int           Definite Integration
ma_auc                AUC      tag_ma_auc               Area Under Curves
ma_diff_eq            DFEQ     tag_ma_diff_eq           Differential Equations

COORDINATE GEOMETRY (5 chapters)
CHAPTER_ID            PREFIX   PLACEHOLDER TAG          NAME
─────────────────────────────────────────────────────────────────────────────
ma_straight_lines     STLN     tag_ma_straight_lines    Straight Lines
ma_circle             CRCL     tag_ma_circle            Circle
ma_parabola           PRBL     tag_ma_parabola          Parabola
ma_ellipse            ELPS     tag_ma_ellipse           Ellipse
ma_hyperbola          HYPB     tag_ma_hyperbola         Hyperbola

TRIGONOMETRY (5 chapters)
CHAPTER_ID            PREFIX   PLACEHOLDER TAG          NAME
─────────────────────────────────────────────────────────────────────────────
ma_trig_ratios        TRRI     tag_ma_trig_ratios       Trigonometric Ratios & Identities
ma_trig_eq            TREQ     tag_ma_trig_eq           Trigonometric Equations
ma_itf                ITF      tag_ma_itf               Inverse Trigonometric Functions
ma_height_dist        HTDT     tag_ma_height_dist       Heights and Distances
ma_triangle_prop      PRTR     tag_ma_triangle_prop     Properties of Triangles

VECTOR ALGEBRA & 3D (2 chapters)
CHAPTER_ID            PREFIX   PLACEHOLDER TAG          NAME
─────────────────────────────────────────────────────────────────────────────
ma_vector_algebra     VCAL     tag_ma_vector_algebra    Vector Algebra
ma_3d_geom            TDGM     tag_ma_3d_geom           Three Dimensional Geometry
```

> Single source of truth for chapter and tag IDs is `packages/data/taxonomy/taxonomyData_from_csv.ts`. Never invent new tag IDs in scripts. The placeholder tag column above is exactly what already exists in the taxonomy (one "General Questions" tag per chapter).

### Type Detection (same across all subjects)

```
4 options, 1 correct        → SCQ
4 options, 2+ correct       → MCQ
Numerical / nearest integer → NVT
Assertion + Reason          → AR
Statement I + II            → MST
Match List-I with List-II   → MTC
```

### Difficulty (same across all subjects)

`E → 1` | `EM → 2` | `M → 3` | `MH → 4` | `H → 5` | no marking → `3`

### Question Nature — 6 categories applicable to math

```
Pick exactly ONE based on what the SOLUTION will look like, not the topic.

Recall            → Single-fact retrieval. "Domain of $\sin^{-1}x$ is?"
                    "Order of differential equation $y'' + y = 0$ is?".
                    Answer is a memorized definition, formula, or property.

Rule_Application  → One rule, plugged once. Single-step derivative,
                    one-shot determinant of a 2×2, modulus of one complex
                    number, single-term integration, single-formula plug.

Numerical         → Multi-step formula-driven calculation. DEFAULT for
                    most math problems — definite integrals, sequence sums,
                    matrix products with a numeric scalar output, probability
                    counts, conic-section parameter extraction.

Comparative       → Rank/order 3+ items. "Increasing order of magnitude",
                    "arrange these functions by limit value at 0", "which
                    region has greater area".

Graphical         → Plot/figure interpretation. Function graphs, area-under-
                    curve sketches, locus diagrams in complex plane,
                    geometric figures (triangles, conics), region-bounded
                    integrals where reading the figure is part of the work.

Conceptual        → Multi-statement reasoning. Assertion-Reason, "Which of
                    the following is correct?", Statement I/II, identify-
                    the-flaw. No single calculation — student must evaluate
                    each option's claim independently.

Mechanistic       → NOT USED IN MATH. Organic-chemistry-only.
Synthesis         → NOT USED IN MATH. Organic-chemistry-only.
```

### Decision tree (top-down, take the first match)

1. References a graph/plot/figure (function plot, locus, geometric diagram)? → `Graphical`
2. "Order of", "increasing/decreasing", "arrange", "largest/smallest" with 3+ items? → `Comparative`
3. "Which of the following is correct?", Assertion-Reason, Statement I/II, Match List-I/II? → `Conceptual`
4. Has a multi-step calculation with a numeric final answer? → `Numerical`
5. One rule applied once for a deterministic answer? → `Rule_Application`
6. Pure fact recall? → `Recall`

### Math decision-tree examples (mapping to the 6 applicable tiers)

```
Graphical         Reading area under $y = f(x)$ between bounds, locus in
                  Argand plane, geometric figure for triangle/conic, ray
                  diagram of reflection in coordinate geometry, region-
                  bounded double integrals.

Numerical         Default tier for math. Definite integral evaluation,
                  sum of arithmetic/geometric series, $n^{th}$ derivative,
                  determinant of 3×3, system of equations via Cramer's rule,
                  probability of compound events, conic parameter extraction,
                  trigonometric equation roots in $[0, 2\pi]$.

Rule_Application  Direct chain-rule on a single composite, modulus of one
                  complex number, derivative of one standard function,
                  single-step integration ($\int x^n\,dx$), single Pythagorean
                  identity application, one row-operation on a 2×2 matrix.

Comparative       "Increasing order of $\sin 1, \cos 1, \tan 1$", "arrange
                  by eccentricity", "which sequence converges fastest",
                  "rank by domain size".

Conceptual        AR (Assertion-Reason), Statement I/II, "which of the
                  following matrices is invertible", "identify the false
                  statement about continuity", match-the-column (function ↔
                  domain, conic ↔ eccentricity range).

Recall            "Range of $\sec^{-1}x$ is", "value of $\binom{n}{0}$",
                  "formula for sum of first $n$ natural numbers", "definition
                  of an even function".
```

### Exam Taxonomy (3-tier canonical, IDENTICAL across Chemistry / Physics / Math)

```
TIER 1: applicableExams → ('JEE' | 'NEET' | 'CBSE' | 'BITSAT')[]   ← multi-valued
TIER 2: sourceType      → 'PYQ' | 'Practice' | 'NCERT_Textbook' | 'NCERT_Exemplar' | 'Mock'
TIER 3: examDetails     → { exam, year, month, shift, phase, paper }
                          exam ∈ {'JEE_Main', 'JEE_Advanced', 'NEET_UG'} (enum, no free text)
                          shift: ALWAYS 'Shift-I' or 'Shift-II' (never 'Morning'/'Evening'/'M'/'Shift 1'/'shift-I')
```

**Math is JEE-only territory** — math is not part of NEET. So `applicableExams` is always `['JEE']` for math PYQs.

**Per-exam shape (the field every PYQ must follow):**

| Exam | `exam` | `year` | `month` | `shift` | `paper` |
|---|---|---|---|---|---|
| JEE Main | `'JEE_Main'` | required | required (`'Jan'`..`'Dec'`) | required (`'Shift-I'` / `'Shift-II'`) | — |
| JEE Advanced | `'JEE_Advanced'` | required | `null` | `null` | required (`'Paper 1'` / `'Paper 2'`) |

**Canonical mappings (use these verbatim):**

```js
// JEE Main PYQ 2024 Morning slot
applicableExams: ['JEE'], sourceType: 'PYQ',
examDetails: { exam: 'JEE_Main', year: 2024, month: 'Jan', shift: 'Shift-I' }

// JEE Main PYQ 2023 Evening slot
applicableExams: ['JEE'], sourceType: 'PYQ',
examDetails: { exam: 'JEE_Main', year: 2023, month: 'Apr', shift: 'Shift-II' }

// JEE Advanced PYQ 2023 Paper 1 (no month, no shift)
applicableExams: ['JEE'], sourceType: 'PYQ',
examDetails: { exam: 'JEE_Advanced', year: 2023, month: null, shift: null, paper: 'Paper 1' }

// Practice question (non-PYQ)
applicableExams: ['JEE'], sourceType: 'Practice', examDetails: null

// NCERT Exemplar / Textbook (CBSE source)
applicableExams: ['CBSE'], sourceType: 'NCERT_Exemplar', examDetails: null
```

**PYQ metadata accuracy is the priority for this workflow.** Year, month, shift, and paper must be lifted verbatim from the source — never inferred, never defaulted. If any field is illegible or absent on the source page, write `NEEDS_REVIEW: [field missing]` rather than guess. Past inconsistencies between subjects (mixed shift conventions, missing months) are why this rule exists.

**Legacy fields (`is_pyq`, `examBoard`, `exam_source`, `difficulty` enum) — DO NOT WRITE.**
As of Phase 2 of the 2026-05-07 cleanup, new questions must not include these fields. The canonical fields above are the single source of truth.

---

## PHASE 1 — EXTRACTION (image reading only)

**Goal:** Produce a clean JavaScript array of question objects. No scripts. No DB calls. No solutions unless explicitly instructed.

> **Source format:** Each input image is typically a single PDF page containing 6–12 questions. The 8-word verification gate is **per question**, not per image — the agent reads one image, sees N questions, emits N SRC tags.

> **Buffer file naming (mandatory):** Write the Phase 1 array to a per-chapter buffer at `scripts/_phase1_buffer_<prefix>.js` using the **lowercase prefix** (e.g. `_phase1_buffer_quad.js` for Quadratic, `_phase1_buffer_cmpl.js` for Complex Number, `_phase1_buffer_dfin.js` for Definite Integration). The legacy single `_phase1_buffer.js` filename is a shared scratchpad and gets clobbered when two sessions ingest different chapters in parallel.

> **One buffer per user image-batch.** With the compact format below, 60–100 questions per buffer is comfortable. Do NOT pre-split a single user-supplied batch into `b1a / b1b / b1c` sub-files — `insertMany` is atomic and the validator already catches errors. Sub-batching only wastes a validator run and an `insertMany` call per split. Keep one buffer per user message that ships images.

### Step 1.1 — Image Survey (mandatory, output this block)

```
IMAGE SURVEY
Pages: [N images] | Questions detected: [N] | Answer key: YES/NO
Figures at: Q[list] or NONE (function plots, geometric diagrams, loci)
Multi-question pages: page1 (Q1–Q9), page2 (Q10–Q18), page3 (Q19–Q25)
Source: JEE_Main 2024 Jan Shift-I (or whichever)
Starting extraction of Q[first] to Q[last].
```

### Step 1.2 — Extraction Rules

**VERBATIM FIRST.** Copy question text character by character from source. Never paraphrase, shorten, reorder, or "fix" what the source says. Never generate question content from math training knowledge.

**Anti-hallucination gate (Rule 0).** Before writing each question, quote the first 8 words verbatim into the `// SRC:` comment. If you cannot read the first 8 words clearly, output `// ⚠️ Q[N] ILLEGIBLE — skipping` and continue. If a value (number, symbol, exponent) is unclear, write `NEEDS_REVIEW: [reason]` in that field rather than guessing.

**Figures.** Math has function plots, geometric diagrams, locus drawings in the Argand plane, and probability trees. The user adds figures manually via the admin dashboard after insert — **do not insert any `[FIGURE: …]` placeholder or describe the figure in the markdown**. Just write the prose surrounding the figure verbatim and stop. Never attempt to reconstruct a graph or geometric figure in LaTeX.

### Step 1.3 — Math LaTeX Rules (CRITICAL — renderer breaks if wrong)

**General (same as chemistry/physics):**
- ALL math inside `$...$` — NEVER `$$...$$` inline
- NEVER `\dfrac` — use `\frac` only
- Count `$` per line — must be even
- No LaTeX command outside `$...$`
- Space before and after `$`: `the value $ x = 5 $ is`

**Math-specific:**

| Concept | Correct | Wrong |
|---|---|---|
| Fractions | `$\frac{a}{b}$` | `$\dfrac{a}{b}$`, `$a/b$` when display fraction intended |
| Roots | `$\sqrt{x}$`, `$\sqrt[3]{x}$` | `$root(x)$`, raw `√` |
| Exponents (>1 char) | `$x^{10}$`, `$e^{-x}$`, `$2^{n+1}$` | `$x^10$`, `$e^-x$` |
| Subscripts (>1 char) | `$a_{n+1}$`, `$x_{ij}$` | `$a_n+1$`, `$x_ij$` |
| Matrices | `$\begin{pmatrix} a & b \\\\ c & d \end{pmatrix}$` | inline ASCII brackets |
| Determinants | `$\begin{vmatrix} a & b \\\\ c & d \end{vmatrix}$` | `$|a b; c d|$` |
| Limits | `$\lim_{x \to 0}$`, `$\lim_{n \to \infty}$` | `$lim x->0$`, raw `→` |
| Summation | `$\sum_{n=1}^{\infty} \frac{1}{n^2}$` | `$sum n=1 to inf$` |
| Integrals | `$\int_0^1 x\,dx$`, `$\int_{-\infty}^{\infty} e^{-x^2}\,dx$` | `$int 0 to 1 x dx$` |
| Definite-int spacing | `\,dx` (thin space before `dx`) | `dx` directly after integrand |
| Trig functions | `$\sin x$`, `$\cos^2\theta$`, `$\tan^{-1}x$` | `$sinx$`, `$cos^2 theta$` |
| Inverse trig | `$\sin^{-1}x$`, `$\tan^{-1}x$` | `$arcsin x$` (avoid arc-prefix in JEE context) |
| Set notation | `$\{x : x \in \mathbb{R}\}$`, `$A \cup B$`, `$A \cap B$` | `$set(x)$`, raw `∪` `∩` |
| Number sets | `$\mathbb{R}$`, `$\mathbb{N}$`, `$\mathbb{Z}$`, `$\mathbb{Q}$` | `$R$`, raw `ℝ` |
| Vectors (math) | `$\vec{a}$`, `$\vec{a} \cdot \vec{b}$`, `$\vec{a} \times \vec{b}$` | `$\mathbf{a}$` (physics uses `\vec`; math uses `\vec` too — single project convention) |
| Dot/cross product | `$\vec{a} \cdot \vec{b}$`, `$\vec{a} \times \vec{b}$` | `$a.b$`, `$a x b$` |
| Greek (common) | `$\theta$`, `$\alpha$`, `$\beta$`, `$\pi$`, `$\Delta$`, `$\phi$`, `$\lambda$` | raw `θ`, `α`, `π`, `Δ` outside `$` |
| Infinity | `$\infty$` | raw `∞` |
| Logarithms | `$\log x$`, `$\ln x$`, `$\log_{10}x$`, `$\log_e x$` | `$logx$`, `$ln(x)$` (without space) |
| Modulus / abs | `$|x|$`, `$|\vec{a}|$`, `$|z|$` | `$abs(x)$`, `$mod(x)$` |
| Floor / ceiling | `$\lfloor x \rfloor$`, `$\lceil x \rceil$` | `$[x]$` (ambiguous — only use if source uses brackets explicitly) |
| Combinations | `$\binom{n}{r}$`, or `$^{n}C_{r}$` if source uses that | `$nCr$`, `$C(n,r)$` |
| Piecewise | `$f(x) = \begin{cases} x & x \geq 0 \\\\ -x & x < 0 \end{cases}$` | inline conditionals |
| Implication | `$\Rightarrow$`, `$\Leftrightarrow$` | raw `⇒`, `⇔` |
| Element-of / subset | `$x \in A$`, `$A \subset B$`, `$A \subseteq B$` | raw `∈`, `⊂` |

**Numerical answers (NVT type):**
- Question prompt contains any unit if applicable; `answer.integer_value` / `answer.decimal_value` stores the bare numeric.
- Math NVTs are usually unitless integers — store as integer. If the answer is a decimal (e.g. `0.25`), use `answer.decimal_value` and store the bare number.

### Step 1.4 — Options

- SCQ/MCQ/AR/MST/MTC: always 4 options `[{id:"a",...},{id:"b",...},{id:"c",...},{id:"d",...}]`
- NVT: `options: []`, answer in `answer.integer_value` or `answer.decimal_value`
- If answer key provided: set `is_correct: true` on the correct option(s)
- If NO answer key: set ALL options `is_correct: false`, answer fields `null` (the user will run a separate "answer key apply" pass later)

### Step 1.5 — Source tag (per-page, not per-question)

Math PDFs are printed prose where OCR hallucination risk is low. The per-question `// SRC:` comment used in chemistry/physics is downgraded to a **per-page header comment** that records the source date and the question range covered:

```javascript
// ─── PAGE 1 ─── JEE_Main 2021 Jul Shift-II — Q64–Q75
// ─── PAGE 2 ─── JEE_Main 2021 Sep Shift-I  — Q76–Q87
```

The anti-hallucination gate is still per question — if a single value is unclear, write `NEEDS_REVIEW: [reason]` in that field. But the verbatim-quote comment is no longer required on every entry.

### Step 1.6 — Output Format (compact tuple — DEFAULT for math)

**Why compact for math:** Math is JEE-only with no per-question multi-exam logic, no figures-as-data, and no Phase-1 solutions. The canonical object format repeats ~80% boilerplate (`applicableExams: ['JEE']`, `sourceType: 'PYQ'`, `solution: null`, identical `examDetails`, identical `tag_id`) on every entry. The compact format hoists all that to file-level constants and gives each question **one line** instead of ~25.

**The buffer file uses `expand()` from `scripts/_lib/compact.js`** to turn a tuple array into the canonical schema before exporting. The validator and `insert_questions.js` see the canonical schema and need no changes.

```javascript
// scripts/_phase1_buffer_dfin.js
const { expand } = require('./_lib/compact');

// Most questions in a batch share one source date — declare it once.
const SRC_2024_JAN_M = { exam: 'JEE_Main', year: 2024, month: 'Jan', shift: 'Shift-I' };
const SRC_2024_JAN_E = { exam: 'JEE_Main', year: 2024, month: 'Jan', shift: 'Shift-II' };
const SRC_ADV_2023_P1 = { exam: 'JEE_Advanced', year: 2023, month: null, shift: null, paper: 'Paper 1' };

// Tuple positions (positional):
//   [id, type, difficulty, nature, qmd, opts, ans, sourceOverride?]
// - opts: array of 4 strings (or null for NVT)
// - ans: 1-based correct index for SCQ/AR/MST/MTC; numeric for NVT; [i,j,…] for MCQ
// - sourceOverride: optional 8th slot, falls back to file-level `source` default

const Q = [
  ['DFIN-001', 'SCQ', 3, 'Numerical',
    'If the area of the region bounded by the curves $ y = x^2 $ and $ y = x $ is...',
    ['$\\frac{1}{2}$', '$\\frac{1}{3}$', '$\\frac{1}{6}$', '$\\frac{1}{12}$'],
    3],

  ['DFIN-002', 'NVT', 4, 'Numerical',
    'Let $ \\alpha $ and $ \\beta $ be the roots of...',
    null, 9, SRC_ADV_2023_P1],  // ← per-question override (this one is Advanced)

  // ...
];

module.exports = {
  questions: expand(Q, {
    source: SRC_2024_JAN_M,          // file-level default; per-Q overrides win
    tag_id: 'tag_ma_def_int',        // placeholder; back-filled with micro-tags later
    // applicableExams: ['JEE'],     // optional; defaults to ['JEE']
    // sourceType: 'PYQ',            // optional; defaults to 'PYQ'
  }),
};
```

**File-level defaults applied by `expand()`** (override per call if needed):
- `applicableExams: ['JEE']`
- `sourceType: 'PYQ'`
- `solution: null`
- `tag_id`: required — pass the chapter's placeholder tag (`tag_ma_<chapter>`)
- `examDetails`: from `source` arg, or per-tuple slot [7] override

**Mixing tuple and object entries is allowed.** If a single question has unusual shape (e.g. `sourceType: 'Practice'`, or `examDetails: null`, or a different `tag_id`), drop a canonical object into the `Q` array — `expand()` passes objects through untouched.

**Canonical object format (still valid):** If a chapter has so much per-question variation that the compact format stops helping (mixed exams, mixed source types, per-question tags), fall back to the canonical object format — same one used by physics and chemistry. The compact format is **default for math** but not mandatory; the validator and insert script accept either.

### Step 1.7 — End-of-Phase Verification

After outputting all questions, output this summary:

```
EXTRACTION SUMMARY
Extracted: [N] questions (Q[first]–Q[last])
Display IDs assigned: [PREFIX]-[start] to [PREFIX]-[end]
Source: [JEE_Main 2024 Jan Shift-I | JEE_Advanced 2023 Paper 1 | mixed]
Answer key used: YES/NO
Figures skipped (user uploads later): [list of display_ids or NONE]
Illegible/skipped: [list or NONE]
NEEDS_REVIEW fields: [list or NONE]
Placeholder tag applied to all: tag_ma_<chapter>
Ready for Phase 2.
```

---

## PHASE 2 — INSERTION (script writing only)

**Goal:** Insert the validated Phase 1 buffer into MongoDB. Do NOT re-read images in this phase. Do NOT regenerate question content. Do NOT write per-batch insert scripts.

### Step 2.1 — Pre-flight (only when starting a new chapter)

When ingesting the **first batch of a chapter**, query for the current max `display_id` so you know where to start numbering:

```javascript
// One-off pre-flight (skip on follow-up batches in the same chapter — IDs continue sequentially):
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
(async () => {
  const c = new MongoClient(process.env.MONGODB_URI); await c.connect();
  const docs = await c.db('crucible').collection('questions_v2')
    .find({ display_id: /^DFIN-/ }).sort({ display_id: -1 }).limit(1).toArray();
  console.log('Last ID:', docs[0]?.display_id ?? 'none');
  await c.close();
})();
```

Replace `DFIN` with the relevant math prefix. The generic insert script also runs a full collision check at run time, so this pre-flight is purely informational.

### Step 2.2 — Run the Generic Insert Script

```bash
node scripts/insert_questions.js scripts/_phase1_buffer_<prefix>.js
```

`scripts/insert_questions.js` is the single, generic Phase-2 driver shared across all subjects. For math, it:

- Reads the Phase 1 buffer and derives `chapter_id` + `subject = 'maths'` from the prefix in `display_id` (the math prefix table is hard-coded in `PREFIX_TO_CHAPTER`).
- Runs a full-batch collision check before writing.
- Inserts everything in one `insertMany`. Atomic, ordered, fast.
- Sets all canonical metadata: `status: 'published'`, `needs_review: false`, `version: 1`, `deleted_at: null`, `applicableExams`, `sourceType`, `examDetails`, `is_top_pyq: false`. Never writes legacy fields.
- Prints inserted/verified counts + chapter total.

The Phase 1 validator (`validate_phase1_output.js`) is the correctness gate — run it first; the insert script does not re-validate.

### Step 2.3 — Execution Rules

- **Do NOT** create per-batch insert scripts (`insert_<chapter>_b<N>.js`). The legacy "6–8 questions per file" rule is retired — `insertMany` is atomic and the validator already guarantees correctness. One buffer = one insert command.
- NEVER run inline with `node -e "..."` — shell escaping corrupts LaTeX backslashes.
- After each batch: confirm `Inserted N of N` and `Verified in DB: N/N` before continuing.
- Do NOT proceed to the next batch if the previous batch had failures.

### Step 2.4 — Post-Insertion Report

After insertion, output a tight summary:

```
INSERTION REPORT
Total inserted: [N]
Display IDs: [PREFIX]-[start] to [PREFIX]-[end]
Verified in DB: [N]/[N]
Chapter total now: [N]
Tag applied: tag_ma_<chapter> (placeholder — will be re-tagged in bulk later)
```

---

## PHASE 3 — FIGURE UPLOAD (manual, by user)

The user maintains their own list of which questions need figures (function plots, geometric diagrams, loci) and uploads them via the admin dashboard at `admin.canvasclasses.in/crucible`. **Agents must NOT insert `[FIGURE: …]` placeholders or describe figures in question markdown** — there is no agent-side bookkeeping for figures. Never attempt to reconstruct a graph or geometric figure in LaTeX.

After figures are uploaded, the user spot-checks 2–3 questions per batch for accuracy before greenlighting Phase 4.

---

## PHASE 4 — SOLUTION GENERATION (separate context, after Phase 3)

**Solutions are generated as a separate batch sweep AFTER:**
1. Questions are inserted (Phase 2 complete)
2. Figures are uploaded manually (Phase 3 complete)
3. User has spot-checked the batch for content accuracy
4. (Later) Micro-tags have been back-filled, so tier selection works correctly

> Why separate? Tier-based solution depth requires the question's `questionNature` (set during extraction) and, for `Graphical` tier, the actual figure visible in the rendered question. Mixing extraction with solutions blows the context budget and degrades both.

**Math-specific solution style** is documented in `math-solution-workflow.md` — the bespoke 5-part structure with section icons (🧠 🗺️ ⚡ 💡 ⚠️), the "Aha! moment + 2–3 methods + common traps" pattern, anti-AI tone rules, and the boxed-answer convention. Read it before generating any math solutions.

**Math-specific solution mechanics:**
- Always show working step-by-step; never collapse a 4-line derivation into one line
- Boxed answer: `$\boxed{\text{Answer: (Option)}}$` or `$\boxed{\text{Answer: } 9}$`
- For Graphical tier, explicitly describe what the figure shows (slope, intercepts, intersection points) before reading values from it
- Vectors stay vectors (`$\vec{a}$`, not `$a$`) until you take the magnitude
- For inverse-trig and complex-number problems, state the principal value/branch explicitly

---

## TAG BACKFILL (FUTURE — not part of this workflow's scope)

Currently, every math question is ingested with a single placeholder tag (`tag_ma_<chapter>`, the existing "General Questions" tag in the taxonomy). The Phase 1 extractor must NOT invent or guess tags.

Once the math-tag design pass completes:
1. The taxonomy file will be updated with primary tags (5–8 per chapter) and micro-concept tags.
2. A one-time bulk re-tag script will sweep all math questions and assign correct `tag_id` values (and optionally `microConcept`) based on the question content.
3. This workflow doc will be updated to reflect the new tagging step in Phase 1.

Until then, the placeholder tag is the **correct** value — do not improvise.

---

## CRITICAL RULES (violations cause data corruption)

1. ❌ NEVER use `$$...$$` inline — use `$...$` only for inline math
2. ❌ NEVER use `\dfrac` — use `\frac` only
3. ❌ NEVER use `new ObjectId()` — use `uuidv4()` for `_id`
4. ❌ NEVER insert into `questions` collection — use `questions_v2` only
5. ❌ NEVER omit `deleted_at: null` — questions without it are invisible in the app
6. ❌ NEVER invent display_id prefixes — use the math chapter table at top
7. ❌ NEVER use old 'Easy'/'Medium'/'Hard' — use difficultyLevel 1–5
8. ❌ NEVER write legacy fields (`is_pyq`, `examBoard`, `exam_source`, `difficulty` enum) on new questions
9. ❌ NEVER use `Mechanistic` or `Synthesis` questionNature for math — those are organic-chemistry-only
10. ❌ NEVER omit subject — the insert script derives `subject: 'maths'` automatically from a math prefix; do not override unless you know why
11. ❌ NEVER mix Phase 1 and Phase 2 in the same context window
12. ❌ NEVER paraphrase, shorten, or "fix" question text — verbatim from source
13. ❌ NEVER generate question content from math training knowledge — read it from the image
14. ❌ NEVER attempt to reconstruct a function plot, locus, or geometric figure in LaTeX
15. ❌ NEVER write the unit inside `answer.integer_value` / `answer.decimal_value` — bare numeric only
16. ❌ NEVER guess or default `examDetails.year` / `month` / `shift` / `paper` — if illegible, write `NEEDS_REVIEW`
17. ❌ NEVER invent a math `tag_id` — use the placeholder `tag_ma_<chapter>` for every question until the bulk re-tag pass runs
18. ❌ NEVER use `'NEET'` or `'CBSE'` in `applicableExams` for a JEE PYQ — math is JEE-only; the source defines the value
19. ❌ NEVER use `month`/`shift` for JEE Advanced — Advanced has only `paper`, no shift, no month
20. ✅ ALWAYS query DB for current max `display_id` before assigning new IDs for a new chapter
21. ✅ ALWAYS canonical shift values `'Shift-I'` / `'Shift-II'` — never `'Morning'`, `'M'`, `'Shift 1'`, `'shift-I'`
22. ✅ ALWAYS use `\vec{}` for math vectors (not `\mathbf{}`) — single project convention shared with physics
23. ✅ ALWAYS use `\binom{n}{r}` (or `^{n}C_{r}` if source uses that), `\lim_{x \to a}`, `\int_a^b`, `\sum_{k=0}^{n}` with explicit bounds

---

**Document Version:** 1.1 | **Updated:** 2026-05-17 | **Companion:** chemistry ingestion at `QUESTION_INGESTION_WORKFLOW.md`, physics ingestion at `PHYSICS_QUESTION_INGESTION_WORKFLOW.md`, math solutions at `math-solution-workflow.md`, chemistry solutions at `chemistry-solution-workflow.md`, physics solutions at `physics-solution-workflow.md`
