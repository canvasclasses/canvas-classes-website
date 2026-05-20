---
description: Physics Question Ingestion Workflow — Two-Phase System (JEE/NEET PYQs)
---

# PHYSICS QUESTION INGESTION WORKFLOW v1.0

> **Design principle:** Phase 1 and Phase 2 are ALWAYS separate operations. Never mix extraction and insertion in the same context window. This is the #1 rule of the entire system — same as chemistry.
>
> **Companion docs:**
> - `QUESTION_INGESTION_WORKFLOW.md` — chemistry/math sibling; same architecture
> - `physics-solution-workflow.md` — tier-based solution generation for physics (4 tiers matching the 4 physics `questionNature` tags)
> - `chemistry-solution-workflow.md` — chemistry sibling (8 tiers)

---

## QUICK REFERENCE (read this first)

### Physics Chapter Table — 32 chapters (Mathongo / NCERT-aligned)

```
CLASS 11 (16 chapters)
CHAPTER_ID            PREFIX   TAGS                       NAME
─────────────────────────────────────────────────────────────────────────────
ph11_math_phy         MIP      tag_mip_1..6               Mathematics in Physics
ph11_units            UNIT     tag_units_1..5             Units and Dimensions
ph11_kinematics1d     K1D      tag_k1d_1..6               Motion in One Dimension
ph11_kinematics2d     K2D      tag_k2d_1..5               Motion in Two Dimensions
ph11_nlm              NLM      tag_nlm_1..6               Laws of Motion
ph11_wep              WEP      tag_wep_1..6               Work, Power, Energy
ph11_com_mom          COM      tag_com_1..5               Center of Mass, Momentum and Collision
ph11_rotation         ROT      tag_rot_1..6               Rotational Motion
ph11_gravitation      GRAV     tag_grav_1..5              Gravitation
ph11_solids           SOLD     tag_solids_1..4            Mechanical Properties of Solids
ph11_fluids           FLUI     tag_fluids_1..6            Mechanical Properties of Fluids
ph11_shm              SHM      tag_shm_1..5               Oscillations
ph11_waves            WAVE     tag_waves_1..5             Waves and Sound
ph11_thermal_props    THPR     tag_thpr_1..5              Thermal Properties of Matter
ph11_thermo           TDYN     tag_tdyn_1..5              Thermodynamics
ph11_ktg              KTG      tag_ktg_1..5               Kinetic Theory of Gases

CLASS 12 (16 chapters)
CHAPTER_ID            PREFIX   TAGS                       NAME
─────────────────────────────────────────────────────────────────────────────
ph12_electrostatics   ELST     tag_elst_1..5              Electrostatics
ph12_capacitance      CAPC     tag_capc_1..6              Capacitance
ph12_current          CURR     tag_curr_1..5              Current Electricity
ph12_mag_matter       MAGM     tag_magm_1..4              Magnetic Properties of Matter
ph12_moving_charges   MVCH     tag_mvch_1..6              Magnetic Effects of Current
ph12_emi              EMI      tag_emi_1..5               Electromagnetic Induction
ph12_ac               ACUR     tag_ac_1..5                Alternating Current
ph12_ray_optics       ROPY     tag_rop_1..6               Ray Optics
ph12_wave_optics      WVOP     tag_wvop_1..5              Wave Optics
ph12_dual_nature      DUAL     tag_dual_1..4              Dual Nature of Matter
ph12_atoms            ATPH     tag_atph_1..5              Atomic Physics
ph12_nuclei           NUCL     tag_nucl_1..5              Nuclear Physics
ph12_em_waves         EMW      tag_emw_1..4               Electromagnetic Waves
ph12_semiconductors   SEMI     tag_semi_1..5              Semiconductors
ph12_communication    COMM     tag_comm_1..4              Communication System
ph12_exp_phy          EXPP     tag_expp_1..7              Experimental Physics
```

> Single source of truth for chapter and tag IDs is `lib/taxonomy/taxonomyData_from_csv.ts`. Never invent new tag IDs in scripts.

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

### Question Nature — SHARED 8 categories across all subjects

```
Pick exactly ONE based on what the SOLUTION will look like, not the topic.

Recall            → Single-fact retrieval. "SI unit of magnetic flux is?"
Rule_Application  → One rule, plugged once. Dimensional analysis,
                    sig fig in physics, single-formula plug.
Numerical         → Multi-step formula-driven calculation. DEFAULT for
                    most physics problems (mechanics, circuits, optics).
Comparative       → Rank/order 3+ items. "Order of wavelength /
                    energy / refractive index".
Graphical         → Plot/figure interpretation. v-t, x-t, P-V, ray
                    diagram, hysteresis loop, photoelectric I-V.
Conceptual        → Multi-statement reasoning. Assertion-Reason,
                    "Which is correct?", Statement I/II.
Mechanistic       → Organic chemistry only. NEVER used for physics.
Synthesis         → Organic chemistry only. NEVER used for physics.
```

### Decision tree (top-down, take the first match)

1. References a graph/plot/figure (other than a structural diagram)? → `Graphical`
2. "Order of", "increasing/decreasing", "arrange", "largest/smallest" with 3+ items? → `Comparative`
3. "Which of the following is correct?", Assertion-Reason, Statement I/II, Match List-I/II? → `Conceptual`
4. Has a multi-step calculation with a numeric final answer? → `Numerical`
5. One rule applied once for a deterministic answer? → `Rule_Application`
6. Pure fact recall? → `Recall`

### Physics decision-tree examples (mapping to the 6 applicable tiers)

```
Graphical         v-t graph, x-t graph, P-V diagram, ray diagram,
                  photoelectric I-V curve, hysteresis loop, B-H curve,
                  resonance curve, stress-strain curve.

Numerical         Default tier for physics. Multi-loop circuits (KVL/KCL),
                  pulley/Atwood with constraints, FBD → Newton's laws,
                  projectile range/height, optical instrument magnification,
                  capacitor combinations, RC/LC time constants, Bohr orbit
                  radius, decay-law half-life, lens-mirror with two surfaces.

Rule_Application  Dimensional analysis, single-formula plug
                  ($v = u + at$ with all knowns), vector resolution into
                  components, finding resultant, Snell's law one-step,
                  single-resistor Ohm's law, single-mirror image distance.

Comparative       "Order by wavelength / frequency / KE / refractive index",
                  "rank by binding energy per nucleon", "arrange in
                  increasing time period".

Conceptual        AR (Assertion-Reason), Statement I/II, "which of the
                  following is correct about an electric dipole",
                  match-the-column (instrument ↔ use, phenomenon ↔ law).

Recall            "SI unit of magnetic flux is", "name the law that gives
                  the direction of induced EMF", "value of Planck's
                  constant", "dimensional formula of force".

Mechanistic, Synthesis  → Not used in physics. Skip.
```

### Exam Taxonomy (3-tier canonical, IDENTICAL across Chemistry / Physics / Math)

```
TIER 1: applicableExams → ('JEE' | 'NEET' | 'CBSE' | 'BITSAT')[]   ← multi-valued
TIER 2: sourceType      → 'PYQ' | 'Practice' | 'NCERT_Textbook' | 'NCERT_Exemplar' | 'Mock'
TIER 3: examDetails     → { exam, year, month, shift, phase, paper }
                          exam ∈ {'JEE_Main', 'JEE_Advanced', 'NEET_UG'} (enum, no free text)
                          shift: ALWAYS 'Shift-I' or 'Shift-II' (never 'Morning'/'Evening'/'M'/'Shift 1'/'shift-I')
```

**Per-exam shape (the field every PYQ must follow):**

| Exam | `exam` | `year` | `month` | `shift` | `paper` |
|---|---|---|---|---|---|
| JEE Main | `'JEE_Main'` | required | required (`'Jan'`..`'Dec'`) | required (`'Shift-I'` / `'Shift-II'`) | — |
| JEE Advanced | `'JEE_Advanced'` | required | `null` | `null` | required (`'Paper 1'` / `'Paper 2'`) |
| NEET UG | `'NEET_UG'` | required | `null` | `null` (single-shift exam) | — |

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

// NEET PYQ 2024 (single-shift exam — no month, no shift)
applicableExams: ['NEET'], sourceType: 'PYQ',
examDetails: { exam: 'NEET_UG', year: 2024, month: null, shift: null }

// Practice question (non-PYQ)
applicableExams: ['JEE'], sourceType: 'Practice', examDetails: null

// NCERT Exemplar (CBSE textbook source)
applicableExams: ['CBSE'], sourceType: 'NCERT_Exemplar', examDetails: null
```

**If the source is illegible.** Never guess year/month/shift/paper. Write `NEEDS_REVIEW: [field missing]` and continue. Past inconsistencies between subjects (mixed shift conventions, missing months) are why this rule exists.

**Legacy fields (`is_pyq`, `examBoard`, `exam_source`, `difficulty` enum) — DO NOT WRITE.**
As of Phase 2 of the 2026-05-07 cleanup, NEW questions must NOT include these
fields. The canonical fields above are the single source of truth. Phase 4 will
drop them from the schema entirely.

---

## PHASE 1 — EXTRACTION (image reading only)

**Goal:** Produce a clean JavaScript array of question objects. No scripts. No DB calls. No solutions if not instructed.

> **Source format:** Each input image is a single PDF page containing 8–12 questions. The 8-word verification gate is **per question**, not per image — the agent reads one image, sees N questions, emits N SRC tags.

> **Buffer file naming (mandatory):** Write the Phase 1 array to a per-chapter buffer at `scripts/_phase1_buffer_<prefix>.js` (lowercase prefix — e.g. `_phase1_buffer_curr.js` for Current Electricity, `_phase1_buffer_flui.js` for Fluids). The legacy single `_phase1_buffer.js` filename is a **shared scratchpad** and gets clobbered when two sessions ingest different chapters in parallel. Each session must own its own per-chapter buffer. The validator and Phase 2 insert script accept the path as a parameter, so this is a pure naming convention with no toolchain change.

### Step 1.1 — Image Survey (mandatory, output this block)

```
IMAGE SURVEY
Pages: [N images] | Questions detected: [N] | Answer key: YES/NO
Diagrams at: Q[list] or NONE
Multi-question pages: page1 (Q1–Q9), page2 (Q10–Q18), page3 (Q19–Q25)
Starting extraction of Q[first] to Q[last].
```

### Step 1.2 — Extraction Rules

**VERBATIM FIRST.** Copy question text character by character from source. Never paraphrase, shorten, or add. Never generate question content from physics training knowledge.

**Anti-hallucination gate (Rule 0).** Before writing each question, quote the first 8 words verbatim into the `// SRC:` comment. If you cannot read the first 8 words clearly, output `// ⚠️ Q[N] ILLEGIBLE — skipping` and continue. If a value (number, symbol) is unclear, write `NEEDS_REVIEW: [reason]` in that field rather than guessing.

**Diagrams.** Physics has heavy diagram density (circuits, ray diagrams, FBDs, graphs). The user adds figures manually via the admin dashboard after insert and tracks which questions need them — **do not insert any `[FIGURE: …]` placeholder or describe the diagram in the markdown**. Just write the prose surrounding the figure verbatim and stop. Never attempt to redraw or reconstruct a circuit/diagram in LaTeX.

### Step 1.3 — Physics LaTeX Rules (CRITICAL — renderer breaks if wrong)

**General (same as chemistry):**
- ALL math inside `$...$` — NEVER `$$...$$` inline
- NEVER `\dfrac` — use `\frac` only
- Arrows: `$\rightarrow$`, `$\rightleftharpoons$` — never raw `→` outside `$`
- Count `$` per line — must be even
- No LaTeX command outside `$...$`

**Physics-specific:**

| Concept | Correct | Wrong |
|---|---|---|
| Vectors | `$\vec{F}$`, `$\vec{v}$`, `$\vec{a}$` | `\mathbf{F}`, `\textbf{F}`, raw `→F` |
| Unit vectors | `$\hat{i}$`, `$\hat{j}$`, `$\hat{k}$`, `$\hat{n}$` | `\widehat{i}`, `i^`, `î` |
| Magnitude of vector | `$|\vec{F}|$` | `$\|F\|$`, `$mod(F)$` |
| Dot product | `$\vec{A} \cdot \vec{B}$` | `$A.B$` |
| Cross product | `$\vec{A} \times \vec{B}$` | `$AxB$`, `$A \cross B$` |
| Units (single) | `$5\,\text{m/s}$`, `$10\,\text{N}$`, `$2\,\text{kg}$` | `$5 m/s$` (no slash spacing), `$10N$` |
| Units (compound) | `$9.8\,\text{m/s}^2$`, `$2\,\text{kg·m}^2$` | `$9.8 m/s^2$` |
| Degrees | `$30^\circ$`, `$\theta = 45^\circ$` | `$30°$`, raw `°` outside `$` |
| Greek (common) | `$\theta$`, `$\omega$`, `$\lambda$`, `$\phi$`, `$\mu_0$`, `$\epsilon_0$`, `$\Delta$` | raw `θ`, `λ`, `Δ` outside `$` |
| Subscripts in symbol | `$v_x$`, `$F_\text{net}$`, `$E_k$` | `$vx$`, `$Fnet$` |
| Integrals | `$\int_0^L x\,dx$` | `$int_0^L x dx$` |
| Partial derivatives | `$\frac{\partial V}{\partial x}$` | `$dV/dx$` if it's actually partial |
| Scientific notation | `$1.6 \times 10^{-19}\,\text{C}$` | `$1.6e-19 C$` |
| Permittivity / permeability | `$\epsilon_0$`, `$\mu_0$` | `$E_0$`, `$M_0$` |
| Infinity | `$\infty$` | raw `∞` |
| Wavelength | `$\lambda = 500\,\text{nm}$` | `$lambda = 500nm$` |

**Numerical answers must include units in the question text and bare value in `answer.integer_value` / `answer.decimal_value`.**

> Example: question says "Find the current in amperes." Answer field stores `5` (integer), not `"5 A"`. The unit lives in the question prompt — the answer is unitless.

### Step 1.4 — Options

- SCQ/MCQ/AR/MST/MTC: always 4 options `[{id:"a",...},{id:"b",...},{id:"c",...},{id:"d",...}]`
- NVT: `options: []`, answer in `answer.integer_value` or `answer.decimal_value`
- If answer key provided: set `is_correct: true` on the correct option(s)
- If NO answer key: set ALL options `is_correct: false`, answer fields `null`

### Step 1.5 — Source tag (required on every question object)

```javascript
// SRC: "[first 8 words verbatim from the image]" | AK: [a/b/c/d or null] | PAGE: [page1/page2/...]
```

### Step 1.6 — Output Format

Output a raw JavaScript array (not wrapped in a script). Each object:

```javascript
// SRC: "A particle is projected at an angle theta" | AK: c | PAGE: page1
{
  display_id: 'K2D-001',
  type: 'SCQ',
  difficultyLevel: 3,
  question_text: { markdown: 'A particle is projected at an angle $\\theta$ with the horizontal with initial velocity $u$. The maximum height reached is...' },
  options: [
    { id: 'a', text: '$\\frac{u^2 \\sin^2\\theta}{g}$', is_correct: false },
    { id: 'b', text: '$\\frac{u^2 \\sin\\theta}{2g}$', is_correct: false },
    { id: 'c', text: '$\\frac{u^2 \\sin^2\\theta}{2g}$', is_correct: true },
    { id: 'd', text: '$\\frac{2u^2 \\sin\\theta}{g}$', is_correct: false }
  ],
  answer: { correct_option: 'c' },
  solution: null,
  tag_id: 'tag_k2d_2',
  questionNature: 'Rule_Application',
  applicableExams: ['JEE'],
  sourceType: 'PYQ',
  examDetails: { exam: 'JEE_Main', year: 2023, month: 'Jan', shift: 'Shift-I' }
}
```

### Step 1.7 — End-of-Phase Verification

After outputting all questions, output this summary:

```
EXTRACTION SUMMARY
Extracted: [N] questions (Q[first]–Q[last])
Display IDs assigned: [PREFIX]-[start] to [PREFIX]-[end]
Answer key used: YES/NO
Diagrams flagged with [FIGURE: ...]: [list of display_ids or NONE]
Illegible/skipped: [list or NONE]
NEEDS_REVIEW fields: [list or NONE]
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
    .find({ display_id: /^CURR-/ }).sort({ display_id: -1 }).limit(1).toArray();
  console.log('Last ID:', docs[0]?.display_id ?? 'none');
  await c.close();
})();
```

Replace `CURR` with the relevant prefix. The generic insert script also runs a full collision check at run time, so this pre-flight is purely informational for picking the starting number.

### Step 2.2 — Run the Generic Insert Script

```bash
node scripts/insert_questions.js scripts/_phase1_buffer_<prefix>.js
```

`scripts/insert_questions.js` is the single, generic Phase-2 driver. It:

- Reads the Phase 1 buffer and derives `chapter_id` + `subject` from the prefix in `display_id` (override via optional `module.exports.chapter_id` / `subject` if needed).
- Runs a single full-batch collision check before writing.
- Inserts everything in one `insertMany`. Atomic, ordered, fast.
- Sets all canonical metadata: `status: 'published'`, `needs_review: false`, `version: 1`, `deleted_at: null`, `applicableExams`, `sourceType`, `examDetails`, `is_top_pyq: false`. Never writes legacy fields (`is_pyq`, `examBoard`, `exam_source`, `difficulty` enum).
- Prints inserted/verified counts + chapter total.
- Never calls the cache-bust endpoint.

The Phase 1 validator (`validate_phase1_output.js`) is the correctness gate — run it first; the insert script does not re-validate.

### Step 2.3 — Execution Rules

- **Do NOT** create `insert_<short>_b<N>.js` per-batch scripts. The legacy "6–8 questions per file" rule is retired — `insertMany` is atomic and the validator already guarantees correctness. One buffer = one insert command.
- NEVER run inline with `node -e "..."` — shell escaping corrupts LaTeX backslashes.
- After each batch: confirm `Inserted N of N` and `Verified in DB: N/N` before continuing.
- Do NOT proceed to next batch if the previous batch had failures.

### Step 2.4 — Post-Insertion Report

After insertion, output a tight summary:

```
INSERTION REPORT
Total inserted: [N]
Display IDs: [PREFIX]-[start] to [PREFIX]-[end]
Verified in DB: [N]/[N]
Chapter total now: [N]
```

---

## PHASE 3 — FIGURE UPLOAD (manual, by user)

The user maintains their own list of which questions need diagrams and uploads them via the admin dashboard at `/crucible/admin/`. **Agents must NOT insert `[FIGURE: …]` placeholders or describe diagrams in question markdown** — there is no agent-side bookkeeping for figures. Never generate, describe, or reconstruct a physics diagram.

After figures are uploaded, the user spot-checks 2–3 questions per batch for accuracy before greenlighting Phase 4.

---

## PHASE 4 — SOLUTION GENERATION (separate context, after Phase 3)

**Solutions are generated as a separate batch sweep AFTER:**
1. Questions are inserted (Phase 2 complete)
2. Figures are uploaded manually (Phase 3 complete)
3. User has spot-checked the batch for content accuracy

> Why separate? See `physics-solution-workflow.md`. Tier-based solution depth requires the question's `questionNature` (set during extraction) AND, for `Graphical` tier, the actual figure visible in the rendered question. Mixing extraction with solutions blows the context budget and degrades both.

**Tier selection for physics** is documented in `physics-solution-workflow.md` — 4 tiers mapping to the 4 physics `questionNature` tags (`Rule_Application`, `Numerical`, `Conceptual`, `Graphical`). All structural and voice rules live in that doc; this section only lists the physics-specific quirks.

**Physics-specific solution rules** (full detail in `physics-solution-workflow.md`):
- Always include units in numerical workings (`$F = ma = (2\,\text{kg})(3\,\text{m/s}^2) = 6\,\text{N}$`)
- Vectors stay vectors (`$\vec{F}$`, not `$F$`) until the final magnitude
- For Graphical tier, explicitly name the slope/intercept/area meaning before reading values
- Boxed answer format: `$\boxed{\text{Answer: (Option)}}$` or `$\boxed{\text{Answer: } 5\,\text{A}}$` — single `$`, never `$$`

---

## CRITICAL RULES (violations cause data corruption)

1. ❌ NEVER use `$$...$$` inline — use `$...$` only for inline math
2. ❌ NEVER use `\dfrac` — use `\frac` only
3. ❌ NEVER use `new ObjectId()` — use `uuidv4()` for `_id`
4. ❌ NEVER insert into `questions` collection — use `questions_v2` only
5. ❌ NEVER omit `deleted_at: null` — questions without it are invisible in the app
6. ❌ NEVER invent display_id prefixes — use the chapter table at top
7. ❌ NEVER use old 'Easy'/'Medium'/'Hard' — use difficultyLevel 1–5
8. ❌ NEVER write legacy fields (`is_pyq`, `examBoard`, `exam_source`, `difficulty` enum) on new questions — Phase 2 (2026-05-07) removed them. Use canonical `applicableExams`, `sourceType`, `examDetails`, `difficultyLevel` only. Use canonical shift values `'Shift-I'` / `'Shift-II'` (NEET shift = `null`).
9. ❌ NEVER omit subject field — must be `'physics'` for everything in this workflow
9. ❌ NEVER use `Mechanistic` or `Synthesis` questionNature for physics — those are organic-chemistry-only
10. ❌ NEVER skip `questionNature` tagging — always specify one of the 6 applicable values per the decision tree
11. ❌ NEVER mix Phase 1 and Phase 2 in the same context window
12. ❌ NEVER attempt to redraw or reconstruct a physics diagram — use `[FIGURE: description]` placeholder
13. ❌ NEVER write the unit inside `answer.integer_value` / `answer.decimal_value` — bare numeric only
14. ❌ NEVER paraphrase or shorten question text — verbatim from source
15. ❌ NEVER generate question content from physics training knowledge — read it from the image
16. ✅ ALWAYS query DB for current max display_id before assigning new IDs
17. ✅ ALWAYS use `\vec{}` for vectors and `\hat{i}\hat{j}\hat{k}` for unit vectors
18. ✅ ALWAYS use `$\,\text{unit}$` formatting for SI units in math expressions

---

**Document Version:** 1.1 | **Updated:** 2026-05-17 | **Companion:** chemistry ingestion at `QUESTION_INGESTION_WORKFLOW.md`, physics solutions at `physics-solution-workflow.md`, chemistry solutions at `chemistry-solution-workflow.md`
