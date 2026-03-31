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
ch12_coord    CORD     tag_coord_1..9
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

**Exam Taxonomy (NEW - 3-tier system):**
```
TIER 1: examBoard      → 'JEE' | 'NEET' | 'CBSE' | 'BITSAT'
TIER 2: sourceType     → 'PYQ' | 'Practice' | 'NCERT_Textbook' | 'NCERT_Exemplar' | 'Mock'
TIER 3: examDetails    → { exam, year, month, shift, phase, paper }

Common mappings:
- JEE Main PYQ 2024 Morning → examBoard: 'JEE', sourceType: 'PYQ', examDetails: { exam: 'JEE_Main', year: 2024, shift: 'Morning' }
- NEET PYQ 2024 Phase 1 → examBoard: 'NEET', sourceType: 'PYQ', examDetails: { exam: 'NEET_UG', year: 2024, phase: 'Phase 1' }
- Practice question → examBoard: 'JEE', sourceType: 'Practice', examDetails: null
- NCERT Exemplar → examBoard: 'CBSE', sourceType: 'NCERT_Exemplar', examDetails: null
```

---

## PHASE 1 — EXTRACTION (image reading only)

**Goal:** Produce a clean JSON array of question objects. No scripts. No DB calls. No solutions if not instructed.

### Step 1.1 — Image Survey (mandatory, output this block)
```
IMAGE SURVEY
Images: [N] | Questions detected: [N] | Answer key: YES/NO
Diagrams at: Q[list] or NONE
Starting extraction of Q[first] to Q[last].
```

### Step 1.2 — Extraction Rules

**VERBATIM FIRST.** Copy question text character by character from source. Never paraphrase, shorten, or add.

**Diagrams:** Never interpret organic structures. Use placeholder:
`![](https://canvas-chemistry-assets.r2.dev/questions/{DISPLAY_ID_LOWERCASE}/diagram.svg)`
e.g. for ALCO-155: `alco-155`

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
  questionNature: 'Recall',  // 'Recall' | 'Rule_Application' | 'Mechanistic' | 'Synthesis'
  examBoard: 'JEE',           // 'JEE' | 'NEET' | 'CBSE' | 'BITSAT' | null
  sourceType: 'PYQ',          // 'PYQ' | 'Practice' | 'NCERT_Textbook' | 'NCERT_Exemplar' | 'Mock'
  examDetails: {              // null if not PYQ
    exam: 'JEE_Main',         // 'JEE_Main' | 'JEE_Advanced' | 'NEET_UG' | 'NEET_PG'
    year: 2019,
    month: 'Jan',             // optional
    shift: 'Morning',         // for JEE Main
    phase: null,              // for NEET (Phase 1, Phase 2)
    paper: null               // for JEE Advanced (Paper 1, Paper 2)
  }
  // Legacy fields (kept for backward compatibility - DO NOT use for new questions):
  // is_pyq: true, is_top_pyq: false, exam_source: {...}
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

**Goal:** Take the Phase 1 JSON array and wrap it in a runnable insertion script. Do NOT re-read images in this phase.

### Step 2.1 — Pre-flight Check (run first)

Always query the DB to confirm the next available display_id before writing the script:
```javascript
// scripts/check_next_id.js
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');
  const docs = await col.find({ display_id: /^ALCO-/ })
    .sort({ display_id: -1 }).limit(1).toArray();
  console.log('Last ID:', docs[0]?.display_id ?? 'none');
  await client.close();
}
main();
```
Replace `ALCO` with the relevant prefix.

### Step 2.2 — Canonical Insertion Script

```javascript
// scripts/insert_{chapter}_b{N}.js
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

// ── CHAPTER CONSTANTS (do NOT change) ─────────────────────────
const CHAPTER_ID = 'ch12_alcohols';  // ← set once per script
// ──────────────────────────────────────────────────────────────

const now = new Date();

function mk(display_id, difficultyLevel, type, markdown, options, answer, solution, tag_id, examBoard, sourceType, examDetails, questionNature = 'Rule_Application') {
  return {
    _id: uuidv4(), display_id,
    question_text: { markdown, latex_validated: false },
    type, options,
    answer: answer ?? null,
    solution: solution ? { text_markdown: solution, latex_validated: false } : null,
    metadata: {
      difficultyLevel,           // NEW: 1-5 instead of 'Easy'/'Medium'/'Hard'
      difficulty: null,          // DEPRECATED: kept for backward compatibility
      chapter_id: CHAPTER_ID,
      subject: 'chemistry',      // NEW: required field
      tags: [{ tag_id, weight: 1.0 }],
      
      // NEW: 3-Tier Exam Taxonomy
      examBoard: examBoard ?? null,        // 'JEE' | 'NEET' | 'CBSE' | 'BITSAT'
      sourceType: sourceType ?? null,      // 'PYQ' | 'Practice' | 'NCERT_Textbook' | 'NCERT_Exemplar' | 'Mock'
      examDetails: examDetails ?? null,    // { exam, year, shift, phase, paper, month }
      
      // NEW: Question Nature tagging
      questionNature: questionNature,     // 'Recall' | 'Rule_Application' | 'Mechanistic' | 'Synthesis'
      
      // Multi-dimensional tagging
      microConcept: null,
      isMultiConcept: false,
      
      // DEPRECATED: Old fields (kept for backward compatibility)
      is_pyq: sourceType === 'PYQ',
      is_top_pyq: false,
      exam_source: examDetails ? {
        exam: examDetails.exam === 'JEE_Main' ? 'JEE Main' : 
              examDetails.exam === 'JEE_Advanced' ? 'JEE Advanced' :
              examDetails.exam === 'NEET_UG' ? 'NEET' : examDetails.exam,
        year: examDetails.year,
        month: examDetails.month ?? null,
        shift: examDetails.shift ?? null
      } : null,
      
      source_reference: { 
        type: 'image', 
        verified_against_source: true,
        verification_date: now, 
        verified_by: 'ai_agent' 
      }
    },
    status: 'review', 
    version: 1, 
    quality_score: 95,
    created_by: 'ai_agent', 
    updated_by: 'ai_agent',
    created_at: now, 
    updated_at: now, 
    deleted_at: null
  };
}

// Helper functions with new signature
function mkSCQ(display_id, difficultyLevel, markdown, opts, correct, tag_id, examBoard, sourceType, examDetails, questionNature) {
  return mk(display_id, difficultyLevel, 'SCQ', markdown,
    ['a','b','c','d'].map((id,i) => ({ id, text: opts[i], is_correct: id === correct })),
    { correct_option: correct }, null, tag_id, examBoard, sourceType, examDetails, questionNature);
}

function mkMCQ(display_id, difficultyLevel, markdown, opts, correctArr, tag_id, examBoard, sourceType, examDetails, questionNature) {
  // correctArr = ['a','c'] for example
  return mk(display_id, difficultyLevel, 'MCQ', markdown,
    ['a','b','c','d'].map((id,i) => ({ id, text: opts[i], is_correct: correctArr.includes(id) })),
    { correct_options: correctArr }, null, tag_id, examBoard, sourceType, examDetails, questionNature);
}

function mkNVT(display_id, difficultyLevel, markdown, answer_val, tag_id, examBoard, sourceType, examDetails, questionNature) {
  return mk(display_id, difficultyLevel, 'NVT', markdown, [],
    { integer_value: answer_val }, null, tag_id, examBoard, sourceType, examDetails, questionNature);
}

// ── QUESTIONS (paste Phase 1 output here, adapt to mkSCQ/mkNVT signatures) ──
// Usage: mkSCQ(display_id, difficultyLevel, markdown, opts, correct, tag_id, examBoard, sourceType, examDetails, questionNature)

const questions = [
  // JEE Main PYQ example:
  // mkSCQ('ALCO-155', 3, 'The major product...', ['opt a','opt b','opt c','opt d'], 'b', 'tag_alcohols_4', 'JEE', 'PYQ', {exam:'JEE_Main', year:2024, shift:'Morning'}, 'Mechanistic'),
  
  // NEET PYQ example:
  // mkSCQ('ALCO-156', 2, 'What is the...', ['opt a','opt b','opt c','opt d'], 'c', 'tag_alcohols_5', 'NEET', 'PYQ', {exam:'NEET_UG', year:2024, phase:'Phase 1'}, 'Recall'),
  
  // Practice question example:
  // mkSCQ('ALCO-157', 4, 'Calculate the...', ['opt a','opt b','opt c','opt d'], 'd', 'tag_alcohols_6', 'JEE', 'Practice', null, 'Rule_Application'),
];

async function main() {
  if (questions.length === 0) { console.log('❌ No questions defined'); return; }

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');

  // Duplicate check
  const ids = questions.map(q => q.display_id);
  const existing = await col.find({ display_id: { $in: ids } }).toArray();
  if (existing.length > 0) {
    console.log('❌ Duplicate IDs found — aborting:', existing.map(e => e.display_id));
    await client.close(); return;
  }

  // Validate before insert
  const errors = [];
  for (const q of questions) {
    // Validation: check new fields exist
    if (!q.metadata?.examBoard && q.metadata?.sourceType !== 'Practice') errors.push(`${q.display_id}: examBoard required (or use 'Practice' sourceType)`);
    if (!q.metadata?.sourceType) errors.push(`${q.display_id}: sourceType required`);
    if (!q.metadata?.difficultyLevel || q.metadata.difficultyLevel < 1 || q.metadata.difficultyLevel > 5) errors.push(`${q.display_id}: difficultyLevel must be 1-5`);
    if (!q.metadata?.questionNature) errors.push(`${q.display_id}: questionNature required`);
    if (q.metadata?.sourceType === 'PYQ' && !q.metadata?.examDetails) errors.push(`${q.display_id}: examDetails required for PYQ questions`);
    
    // Legacy validation (keep for now)
    if (['SCQ','MCQ','AR','MST','MTC'].includes(q.type) && q.options.length !== 4) errors.push(`${q.display_id}: needs 4 options`);
    if (q.type === 'SCQ' && q.options.filter(o => o.is_correct).length !== 1) errors.push(`${q.display_id}: SCQ needs exactly 1 correct`);
    if (!q.question_text?.markdown || q.question_text.markdown.length < 10) errors.push(`${q.display_id}: question text too short`);
    if (q.metadata.chapter_id !== CHAPTER_ID) errors.push(`${q.display_id}: wrong chapter_id`);
    if (q.deleted_at !== null) errors.push(`${q.display_id}: deleted_at must be null`);
  }
  if (errors.length > 0) { console.log('❌ Validation failed:\n' + errors.join('\n')); await client.close(); return; }

  // Insert
  let ok = 0, fail = 0;
  for (const doc of questions) {
    try { await col.insertOne(doc); console.log(`✅ ${doc.display_id}`); ok++; }
    catch(e) { console.log(`❌ ${doc.display_id}: ${e.message}`); fail++; }
  }
  console.log(`\n📊 ${ok} inserted, ${fail} failed`);

  // Verify
  const inserted = await col.find({ display_id: { $in: ids } }).toArray();
  console.log(`✅ Verified in DB: ${inserted.length}/${questions.length}`);

  await client.close();
}
main();
```

### Step 2.3 — Execution Rules

- Batch size: **6–8 questions per script file** — no more
- File naming: `scripts/insert_{chapter}_b{N}.js` (e.g. `insert_alco_b1.js`)
- NEVER run inline with `node -e "..."` — shell escaping corrupts LaTeX backslashes
- ALWAYS run: `node scripts/insert_alco_b1.js`
- After each batch: confirm inserted count matches expected count before continuing
- Do NOT proceed to next batch if previous batch had failures

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
8. ❌ NEVER use old exam_source only — always include new examBoard, sourceType, examDetails
9. ❌ NEVER skip questionNature tagging — always specify: 'Recall' | 'Rule_Application' | 'Mechanistic' | 'Synthesis'
10. ❌ NEVER omit subject field — must be 'chemistry' | 'physics' | 'maths' | 'biology'
11. ✅ ALWAYS query DB for current max display_id before assigning new IDs

---

**Document Version:** 3.0 | **Last Updated:** 2026-03-01
