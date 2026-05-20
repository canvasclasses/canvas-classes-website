---
description: Question Ingestion Workflow — Two-Phase System
---

# QUESTION INGESTION WORKFLOW v3.0

> **Design principle:** Phase 1 and Phase 2 are ALWAYS separate operations. Never mix extraction and insertion in the same context window. This is the #1 rule of the entire system.

---

## QUICK REFERENCE (read this first)

**Chemistry (Legacy Pattern)**
```
CHAPTER_ID    PREFIX   TAGS (use tag_id exactly as shown)
─────────────────────────────────────────────────────────────────────────────
ch11_mole     MOLE     tag_mole_1..8
ch11_atom     ATOM     tag_atom_1..10
ch11_periodic PERI     tag_periodic_1..7
ch11_bonding  BOND     tag_bonding_1..10
ch11_thermo   THERMO   tag_thermo_1..10
ch11_chem_eq  CEQ      tag_chem_eq_1..6
ch11_ionic_eq IEQ      tag_ionic_eq_1..8
ch11_redox    RDX      tag_redox_1..4
ch11_pblock   PB11     tag_pblock11_1..6
ch11_goc      GOC      tag_goc_1..15
ch11_hydrocarbon HC    tag_hydrocarbon_1..10, tag_ch11_hydrocarbon_1771659235901
ch11_prac_org POC      tag_prac_org_1..7
ch12_solutions SOL     tag_solutions_1..7
ch12_electrochem EC    tag_electrochem_1..7
ch12_kinetics CK       tag_kinetics_1..8
ch12_pblock   PB12     tag_pblock12_1..9
ch12_dblock   DNF      tag_dblock_1..8
ch12_coord    CORD     tag_coord_1..10
ch12_haloalkanes HALO  tag_haloalkanes_1..9
ch12_alcohols ALCO     tag_alcohols_1..6, tag_ch12_alcohols_1771659358099
ch12_carbonyl ALDO     tag_aldehydes_1..7, tag_ch12_aldehydes_1771659373017, tag_carboxylic_1..4, tag_ch12_carboxylic_1771659384907
ch12_amines   AMIN     tag_amines_1..5, tag_ch12_amines_1771659399884
ch12_biomolecules BIO  tag_biomolecules_1..6
ch12_salt     SALT     tag_salt_1..14
ch12_prac_phys PPC     tag_prac_phys_1..6
```

**Mathematics (Uniform Pattern)**
```
Applies to all 33 math chapters (e.g., ma_quadratic, ma_matrices, ma_probability)
─────────────────────────────────────────────────────────────────────────────
CHAPTER_ID:  ma_[name]             (e.g., ma_complex)
PREFIX:      First 4 chars upper   (e.g., COMP)
TAGS:        tag_{chapter_id}      (e.g., tag_ma_complex)
```

**Type detection:**
- 4 options, 1 correct → `SCQ`
- 4 options, 2+ correct → `MCQ`
- Numerical / "nearest integer" → `NVT`
- Assertion + Reason → `AR`
- Statement I + II → `MST`
- Match List-I with List-II → `MTC`

**Difficulty:** `E → 1` | `EM → 2` | `M → 3` | `MH → 4` | `H → 5` | no marking → `3`

**Question Nature (REQUIRED — drives solution depth):**
```
Pick exactly ONE based on what the SOLUTION will look like, not the topic.

Recall            → Single-fact retrieval. "Which catalyst is used in...?" "State the law."
                    Answer is a memorized fact, color, name, or one-line definition.

Rule_Application  → One rule, plugged once. Sig fig counting, oxidation-state
                    assignment, electron config, periodic-trend lookup.

Numerical         → Multi-step formula-driven calculation. Mole math, gravimetric
                    analysis, thermodynamics, equilibrium, kinetics, mass-%, molarity.
                    DEFAULT for most physical-chemistry numerics.

Comparative       → Rank/order 3+ items. "Order of acidity", "Increasing BP",
                    "Arrange in decreasing stability", "Which is largest?".

Graphical         → Plot/figure interpretation. PV diagrams, rate-vs-time, titration
                    curves, energy profiles. Question requires reading a chart.

Conceptual        → Multi-statement reasoning. Assertion-Reason, "Which of the
                    following is correct?", Statement I/II, identify-the-flaw.
                    No single calc — student must evaluate each option's claim.

Mechanistic       → Organic arrow-pushing, intermediate stability, reaction-step
                    explanation. Almost always organic chemistry.

Synthesis         → Multi-step retrosynthesis or precursor → target chains.
                    Almost always organic chemistry.
```

Decision tree (top-down, take the first match):
1. Does the question ask to identify/draw a mechanism or intermediate? → `Mechanistic`
2. Multi-step organic precursor→product chain? → `Synthesis`
3. References a graph/plot/figure (other than a structural diagram)? → `Graphical`
4. "Order of", "increasing/decreasing", "arrange", "largest/smallest" with 3+ items? → `Comparative`
5. "Which of the following is correct?", Assertion-Reason, Statement I/II? → `Conceptual`
6. Has a multi-step calculation with a numeric final answer? → `Numerical`
7. One rule applied once for a deterministic answer? → `Rule_Application`
8. Pure fact recall? → `Recall`

**Exam Taxonomy — 3-tier canonical (IDENTICAL across Chemistry / Physics / Math):**

```
TIER 1: applicableExams → ('JEE' | 'NEET' | 'CBSE' | 'BITSAT')[]   ← multi-valued, replaces examBoard
TIER 2: sourceType      → 'PYQ' | 'Practice' | 'NCERT_Textbook' | 'NCERT_Exemplar' | 'Mock'
TIER 3: examDetails     → { exam, year, month, shift, phase, paper }
                          exam ∈ {'JEE_Main', 'JEE_Advanced', 'NEET_UG'} (enum, no free text)
                          shift: ALWAYS use 'Shift-I' or 'Shift-II' (never 'Morning'/'Evening'/'M'/'Shift 1'/'shift-I')
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

**Legacy fields (`is_pyq`, `examBoard`, `exam_source`, `difficulty` enum) — REMOVED:**
As of Phase 2 of the 2026-05-07 cleanup, NEW questions must NOT include any of
these fields. The canonical fields above (`applicableExams`, `sourceType`,
`examDetails`, `difficultyLevel`) are the single source of truth. Read paths
bridge to legacy only for older docs that still carry them; new docs render
correctly with just the canonical fields. Phase 4 will drop these fields from
the schema entirely.

- `is_top_pyq` is **NOT** legacy — it powers the "Top Questions" practice mode and is set via the admin star-mark UI. Default to `false` on new questions; the admin curates afterwards.

---

## PHASE 1 — EXTRACTION (image reading only)

**Goal:** Produce a clean JSON array of question objects. No scripts. No DB calls. No solutions if not instructed.

> **Buffer file naming (mandatory):** Write the Phase 1 array to a per-chapter buffer at `scripts/_phase1_buffer_<prefix>.js` (lowercase prefix — e.g. `_phase1_buffer_mole.js` for Mole Concept, `_phase1_buffer_atom.js` for Atomic Structure). The legacy single `_phase1_buffer.js` filename is a **shared scratchpad** and gets clobbered when two sessions ingest different chapters in parallel. Each session must own its own per-chapter buffer. The validator and Phase 2 insert script accept the path as a parameter, so this is a pure naming convention with no toolchain change.

### Step 1.1 — Image Survey (mandatory, output this block)
```
IMAGE SURVEY
Images: [N] | Questions detected: [N] | Answer key: YES/NO
Diagrams at: Q[list] or NONE
Starting extraction of Q[first] to Q[last].
```

### Step 1.2 — Extraction Rules

**VERBATIM FIRST.** Copy question text character by character from source. Never paraphrase, shorten, or add.

**Diagrams:** Never interpret organic structures. The user maintains their own list of questions that need diagrams and uploads them via the admin dashboard after insertion — **do not insert any image placeholder, URL stub, or description in the markdown**. Just write the prose surrounding the figure verbatim and stop.

**LaTeX (CRITICAL — renderer will break if wrong):**
- ALL math inside `$...$` — NEVER `$$...$$`
- NEVER `\dfrac` — use `\frac` only
- Chemical formulas: `$\ce{H2SO4}$`, `$\ce{CH3OH}$`
- **Coordination Compounds (Square Brackets):** NEVER use `\ce{}` for formulas with `[` and `]`. Use `\mathrm{}` with explicit subscripts: `$\mathrm{[Fe(CN)_6]^{4-}}$` instead of `$\ce{[Fe(CN)6]^4-}$`. Our renderer replaces `[...]` within `\ce` with `\overset`, causing failure.
- Arrows: `$\rightarrow$`, `$\rightleftharpoons$` — NEVER raw `→` outside `$`
- Count `$` per line — must be even
- No LaTeX command outside `$...$`

**Options:**
- SCQ/MCQ/AR/MST/MTC: always 4 options `[{id:"a",...},{id:"b",...},{id:"c",...},{id:"d",...}]`
- NVT: `options: []`, answer in `answer.integer_value` or `answer.decimal_value`
- If answer key provided: set `is_correct: true` on correct option(s)
- If NO answer key: set ALL options `is_correct: false`, answer fields `null`

**Source tag (required on every question object):**
```javascript
// SRC: "[first 8 words verbatim]" | AK: [a/b/c/d or null]
```

**Uncertainty:** If you cannot read a question clearly: output `// ⚠️ Q[N] ILLEGIBLE — skipping` and continue.

### Step 1.3 — Output Format

Output a raw JavaScript array (not wrapped in a script). Each object:
```javascript
// SRC: "The major product of the following reaction" | AK: b
{
  display_id: 'ALCO-155',
  type: 'SCQ',
  difficultyLevel: 3,        // 1-5 (was 'Medium')
  question_text: { markdown: 'The major product...' },
  options: [
    { id: 'a', text: '...', is_correct: false },
    { id: 'b', text: '...', is_correct: true },
    { id: 'c', text: '...', is_correct: false },
    { id: 'd', text: '...', is_correct: false }
  ],
  answer: { correct_option: 'b' },
  solution: null,   // null if TEXT-ONLY mode; populated string if solutions requested
  tag_id: 'tag_alcohols_4',
  questionNature: 'Recall',  // see Question Nature decision tree above (8 values)
  applicableExams: ['JEE'],   // multi-valued: ['JEE'], ['NEET'], or ['JEE','NEET'] for dual-use
  sourceType: 'PYQ',          // 'PYQ' | 'Practice' | 'NCERT_Textbook' | 'NCERT_Exemplar' | 'Mock'
  examDetails: {              // null if not PYQ
    exam: 'JEE_Main',         // 'JEE_Main' | 'JEE_Advanced' | 'NEET_UG' | 'NEET_PG'
    year: 2019,
    month: 'Jan',             // optional
    shift: 'Shift-I',         // canonical: 'Shift-I' | 'Shift-II' (NEVER 'Morning'/'M'/'Shift 1'); leave null for NEET
    phase: null,              // for NEET (Phase 1, Phase 2)
    paper: null               // for JEE Advanced (Paper 1, Paper 2)
  }
  // is_top_pyq: false  ← optional; default false. Admin curates Top PYQs via the dashboard.
}
```

### Step 1.4 — End-of-Phase Verification

After outputting all questions, output this summary:
```
EXTRACTION SUMMARY
Extracted: [N] questions (Q[first]–Q[last])
Display IDs assigned: [PREFIX]-[start] to [PREFIX]-[end]
Answer key used: YES/NO
Diagrams skipped: [list or NONE]
Illegible/skipped: [list or NONE]
Ready for Phase 2.
```

---

## PHASE 2 — INSERTION (script writing only)

**Goal:** Insert the validated Phase 1 buffer into MongoDB. Do NOT re-read images in this phase. Do NOT write per-batch insert scripts.

### Step 2.1 — Pre-flight (only when starting a new chapter)

When ingesting the **first batch of a chapter**, query for the current max `display_id` so you know where to start numbering:
```javascript
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
(async () => {
  const c = new MongoClient(process.env.MONGODB_URI); await c.connect();
  const docs = await c.db('crucible').collection('questions_v2')
    .find({ display_id: /^ALCO-/ }).sort({ display_id: -1 }).limit(1).toArray();
  console.log('Last ID:', docs[0]?.display_id ?? 'none');
  await c.close();
})();
```
Replace `ALCO` with the relevant prefix. The generic insert script also runs a full collision check at run time, so this pre-flight is purely informational.

### Step 2.2 — Run the Generic Insert Script

```bash
node scripts/insert_questions.js scripts/_phase1_buffer_<prefix>.js
```

`scripts/insert_questions.js` is the single, generic Phase-2 driver shared across all subjects (chemistry, physics, maths, biology). It:

- Reads the Phase 1 buffer and derives `chapter_id` + `subject` from the prefix in `display_id` (override via optional `module.exports.chapter_id` / `subject` if needed).
- Runs a full-batch collision check before writing.
- Inserts everything in one `insertMany`. Atomic and ordered.
- Sets all canonical metadata: `status: 'published'`, `needs_review: false`, `version: 1`, `deleted_at: null`, `applicableExams`, `sourceType`, `examDetails`, `is_top_pyq: false`. Never writes legacy fields (`is_pyq`, `examBoard`, `exam_source`, `difficulty` enum).
- Prints inserted/verified counts + chapter total.
- Never calls the cache-bust endpoint.

The Phase 1 validator (`validate_phase1_output.js`) is the correctness gate — run it first; the insert script does not re-validate.

### Step 2.3 — Execution Rules

- **Do NOT** create per-batch insert scripts (`insert_<chapter>_b<N>.js`). The legacy "6–8 questions per file" rule is retired — `insertMany` is atomic and the validator already enforces correctness. One buffer = one insert command.
- NEVER run inline with `node -e "..."` — shell escaping corrupts LaTeX backslashes.
- After each batch: confirm `Inserted N of N` and `Verified in DB: N/N` before continuing.
- Do NOT proceed to next batch if the previous batch had failures.

### Step 2.4 — Post-Insertion Report

After all batches complete, output:
```
INSERTION REPORT
Total inserted: [N]
Display IDs: [PREFIX]-[start] to [PREFIX]-[end]
Failed: [list or NONE]
Verified in DB: [N]/[N]
```

---

## SOLUTION GENERATION (only when explicitly requested)

**5-step format:**
```
**Step 1: Understand the Problem** — [what is being asked]
**Step 2: Key Concepts** — [relevant formula/concept]
**Step 3: Apply** — [reasoning]
**Step 4: Calculate** — [working with units]
**Step 5: Answer** — [final answer + why]
**Remember:** [2–3 bullet points]
```

**Minimums:** SCQ ≥ 80 words | NVT ≥ 60 words (full working) | MCQ/AR ≥ 100 words
**Use `$\ce{}$` for all chemical formulas. Never draw structures in LaTeX.**

---

## CRITICAL RULES (violations cause data corruption)

1. ❌ NEVER use `$$...$$` — use `$...$` only
2. ❌ NEVER use `\dfrac` — use `\frac` only
3. ❌ NEVER use `new ObjectId()` — use `uuidv4()` for `_id`
4. ❌ NEVER insert into `questions` collection — use `questions_v2` only
5. ❌ NEVER omit `deleted_at: null` — questions without it are invisible in the app
6. ❌ NEVER invent display_id prefixes — use QUICK REFERENCE table at top
7. ❌ NEVER use old 'Easy'/'Medium'/'Hard' — use difficultyLevel 1-5
8. ❌ NEVER write legacy fields (`is_pyq`, `examBoard`, `exam_source`, `difficulty` enum) on new questions — Phase 2 (2026-05-07) removed them. Use canonical `applicableExams`, `sourceType`, `examDetails`, `difficultyLevel` only. Use canonical shift values `'Shift-I'` / `'Shift-II'` (NEET shift = `null`).
9. ❌ NEVER skip questionNature tagging — always specify one of the 8 values per the decision tree in QUICK REFERENCE
10. ❌ NEVER omit subject field — must be 'chemistry' | 'physics' | 'maths' | 'biology'
11. ✅ ALWAYS query DB for current max display_id before assigning new IDs

---

**Document Version:** 3.1 | **Last Updated:** 2026-04-25 (added 4 questionNature values: Numerical, Comparative, Graphical, Conceptual)
