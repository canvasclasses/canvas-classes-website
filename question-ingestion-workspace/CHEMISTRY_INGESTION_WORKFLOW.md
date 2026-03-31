---
description: Chemistry Question Ingestion Workflow — Two-Phase System
---

# CHEMISTRY QUESTION INGESTION WORKFLOW v3.0

> **Design principle:** Phase 1 and Phase 2 are ALWAYS separate operations. Never mix extraction and insertion in the same context window.

---

## QUICK REFERENCE

### Chapter Mappings (Chemistry)
```
CHAPTER_ID    PREFIX   TAGS
─────────────────────────────────────────────────────────────────
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
ch11_hydrocarbon HC    tag_hydrocarbon_1..10
ch11_prac_org POC      tag_prac_org_1..7
ch12_solutions SOL     tag_solutions_1..7
ch12_electrochem EC    tag_electrochem_1..7
ch12_kinetics CK       tag_kinetics_1..8
ch12_pblock   PB12     tag_pblock12_1..9
ch12_dblock   DNF      tag_dblock_1..8
ch12_coord    CORD     tag_coord_1..9
ch12_haloalkanes HALO  tag_haloalkanes_1..9
ch12_alcohols ALCO     tag_alcohols_1..6
ch12_carbonyl ALDO     tag_aldehydes_1..7, tag_carboxylic_1..4
ch12_amines   AMIN     tag_amines_1..5
ch12_biomolecules BIO  tag_biomolecules_1..6
ch12_salt     SALT     tag_salt_1..14
ch12_prac_phys PPC     tag_prac_phys_1..6
```

### Type Detection
- 4 options, 1 correct → `SCQ`
- 4 options, 2+ correct → `MCQ`
- Numerical / "nearest integer" → `NVT`
- Assertion + Reason → `AR`
- Statement I + II → `MST`
- Match List-I with List-II → `MTC`

### Difficulty Mapping
| Marking | difficultyLevel |
|---------|----------------|
| E (Easy) | 1 |
| EM (Easy-Medium) | 2 |
| M (Medium) | 3 |
| MH (Medium-Hard) | 4 |
| H (Hard) | 5 |
| No marking | 3 |

### Exam Taxonomy (3-tier system)
```
TIER 1: examBoard   → 'JEE' | 'NEET' | 'CBSE' | 'BITSAT'
TIER 2: sourceType  → 'PYQ' | 'Practice' | 'NCERT_Textbook' | 'NCERT_Exemplar' | 'Mock'
TIER 3: examDetails → { exam, year, month, shift, phase, paper }
```

**Common mappings:**
- **JEE Main PYQ 2024 Morning** → `examBoard: 'JEE'`, `sourceType: 'PYQ'`, `examDetails: { exam: 'JEE_Main', year: 2024, shift: 'Morning' }`
- **NEET PYQ 2024 Phase 1** → `examBoard: 'NEET'`, `sourceType: 'PYQ'`, `examDetails: { exam: 'NEET_UG', year: 2024, phase: 'Phase 1' }`
- **Practice question** → `examBoard: 'JEE'`, `sourceType: 'Practice'`, `examDetails: null`
- **NCERT Exemplar** → `examBoard: 'CBSE'`, `sourceType: 'NCERT_Exemplar'`, `examDetails: null`

### Question Nature
- `Recall` - Direct fact/knowledge recall
- `Rule_Application` - Apply a rule or formula
- `Mechanistic` - Mechanism-based reasoning
- `Synthesis` - Multi-step synthesis or complex reasoning

---

## PHASE 1 — EXTRACTION (Image Reading)

**Goal:** Produce a clean JSON array of question objects.

### Step 1.1 — Image Survey (output first)
```
IMAGE SURVEY
Images: [N] | Questions detected: [N] | Answer key: YES/NO
Diagrams at: Q[list] or NONE
Starting extraction of Q[first] to Q[last].
```

### Step 1.2 — Extraction Rules

**VERBATIM FIRST.** Copy question text exactly from source. Never paraphrase.

**Diagrams:** Use placeholder:
```
![](https://canvas-chemistry-assets.r2.dev/questions/{DISPLAY_ID_LOWERCASE}/diagram.svg)
```

**LaTeX (CRITICAL):**
- ALL math inside `$...$` — NEVER `$$...$$`
- NEVER `\dfrac` — use `\frac` only
- Chemical formulas: `$\ce{H2SO4}$`, `$\ce{CH3OH}$`
- **Coordination Compounds:** NEVER use `\ce{}` for formulas with `[` and `]`. Use `\mathrm{}`: `$\mathrm{[Fe(CN)_6]^{4-}}$`
- Arrows: `$\rightarrow$`, `$\rightleftharpoons$` — NEVER raw `→` outside `$`
- Count `$` per line — must be even

**Options:**
- Always 4 options `[{id:"a",...},{id:"b",...},{id:"c",...},{id:"d",...}]`
- NVT: `options: []`, answer in `answer.integer_value`
- If answer key provided: set `is_correct: true` on correct option(s)
- If NO answer key: set ALL `is_correct: false`

**Source tag (required):**
```javascript
// SRC: "[first 8 words verbatim]" | AK: [a/b/c/d or null]
```

**Uncertainty:** If question illegible: `// ⚠️ Q[N] ILLEGIBLE — skipping`

### Step 1.3 — Output Format

```javascript
// SRC: "The major product of the following reaction" | AK: b
{
  display_id: 'ALCO-155',
  type: 'SCQ',
  difficultyLevel: 3,
  question_text: { markdown: 'The major product...' },
  options: [
    { id: 'a', text: '...', is_correct: false },
    { id: 'b', text: '...', is_correct: true },
    { id: 'c', text: '...', is_correct: false },
    { id: 'd', text: '...', is_correct: false }
  ],
  answer: { correct_option: 'b' },
  solution: null,
  tag_id: 'tag_alcohols_4',
  questionNature: 'Mechanistic',
  examBoard: 'JEE',
  sourceType: 'PYQ',
  examDetails: {
    exam: 'JEE_Main',
    year: 2024,
    month: null,
    shift: 'Morning',
    phase: null,
    paper: null
  }
}
```

### Step 1.4 — Extraction Summary
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

## PHASE 2 — INSERTION (Script Writing)

**Goal:** Wrap Phase 1 JSON in a runnable insertion script.

### Step 2.1 — Pre-flight Check

Query DB for next available display_id:
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

### Step 2.2 — Insertion Script Template

```javascript
// scripts/insert_{chapter}_b{N}.js
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const CHAPTER_ID = 'ch12_alcohols';  // ← SET THIS
const now = new Date();

function mk(display_id, difficultyLevel, type, markdown, options, answer, solution, tag_id, examBoard, sourceType, examDetails, questionNature = 'Rule_Application') {
  return {
    _id: uuidv4(), display_id,
    question_text: { markdown, latex_validated: false },
    type, options, answer: answer ?? null,
    solution: solution ? { text_markdown: solution, latex_validated: false } : null,
    metadata: {
      difficultyLevel,
      chapter_id: CHAPTER_ID,
      subject: 'chemistry',
      tags: [{ tag_id, weight: 1.0 }],
      examBoard: examBoard ?? null,
      sourceType: sourceType ?? null,
      examDetails: examDetails ?? null,
      questionNature: questionNature,
      microConcept: null,
      isMultiConcept: false,
      // Legacy fields (auto-populated)
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
        type: 'image', verified_against_source: true,
        verification_date: now, verified_by: 'ai_agent' 
      }
    },
    status: 'review', version: 1, quality_score: 95,
    created_by: 'ai_agent', updated_by: 'ai_agent',
    created_at: now, updated_at: now, deleted_at: null
  };
}

function mkSCQ(display_id, difficultyLevel, markdown, opts, correct, tag_id, examBoard, sourceType, examDetails, questionNature) {
  return mk(display_id, difficultyLevel, 'SCQ', markdown,
    ['a','b','c','d'].map((id,i) => ({ id, text: opts[i], is_correct: id === correct })),
    { correct_option: correct }, null, tag_id, examBoard, sourceType, examDetails, questionNature);
}

function mkMCQ(display_id, difficultyLevel, markdown, opts, correctArr, tag_id, examBoard, sourceType, examDetails, questionNature) {
  return mk(display_id, difficultyLevel, 'MCQ', markdown,
    ['a','b','c','d'].map((id,i) => ({ id, text: opts[i], is_correct: correctArr.includes(id) })),
    { correct_options: correctArr }, null, tag_id, examBoard, sourceType, examDetails, questionNature);
}

function mkNVT(display_id, difficultyLevel, markdown, answer_val, tag_id, examBoard, sourceType, examDetails, questionNature) {
  return mk(display_id, difficultyLevel, 'NVT', markdown, [],
    { integer_value: answer_val }, null, tag_id, examBoard, sourceType, examDetails, questionNature);
}

// Usage: mkSCQ(display_id, difficultyLevel, markdown, opts, correct, tag_id, examBoard, sourceType, examDetails, questionNature)
const questions = [
  // JEE Main PYQ example:
  // mkSCQ('ALCO-155', 3, '...', ['opt a','opt b','opt c','opt d'], 'b', 'tag_alcohols_4', 'JEE', 'PYQ', {exam:'JEE_Main', year:2024, shift:'Morning'}, 'Mechanistic'),
  
  // NEET PYQ example:
  // mkSCQ('ALCO-156', 2, '...', ['opt a','opt b','opt c','opt d'], 'c', 'tag_alcohols_5', 'NEET', 'PYQ', {exam:'NEET_UG', year:2024, phase:'Phase 1'}, 'Recall'),
  
  // Practice question example:
  // mkSCQ('ALCO-157', 4, '...', ['opt a','opt b','opt c','opt d'], 'd', 'tag_alcohols_6', 'JEE', 'Practice', null, 'Rule_Application'),
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
    console.log('❌ Duplicate IDs:', existing.map(e => e.display_id));
    await client.close(); return;
  }

  // Validation
  const errors = [];
  for (const q of questions) {
    if (!q.metadata?.examBoard && q.metadata?.sourceType !== 'Practice') errors.push(`${q.display_id}: examBoard required`);
    if (!q.metadata?.sourceType) errors.push(`${q.display_id}: sourceType required`);
    if (!q.metadata?.difficultyLevel || q.metadata.difficultyLevel < 1 || q.metadata.difficultyLevel > 5) errors.push(`${q.display_id}: difficultyLevel must be 1-5`);
    if (!q.metadata?.questionNature) errors.push(`${q.display_id}: questionNature required`);
    if (q.metadata?.sourceType === 'PYQ' && !q.metadata?.examDetails) errors.push(`${q.display_id}: examDetails required for PYQ`);
    if (['SCQ','MCQ','AR','MST','MTC'].includes(q.type) && q.options.length !== 4) errors.push(`${q.display_id}: needs 4 options`);
    if (q.type === 'SCQ' && q.options.filter(o => o.is_correct).length !== 1) errors.push(`${q.display_id}: SCQ needs 1 correct`);
    if (q.metadata.chapter_id !== CHAPTER_ID) errors.push(`${q.display_id}: wrong chapter_id`);
  }
  if (errors.length > 0) { 
    console.log('❌ Validation failed:\n' + errors.join('\n')); 
    await client.close(); return; 
  }

  // Insert
  let ok = 0, fail = 0;
  for (const doc of questions) {
    try { await col.insertOne(doc); console.log(`✅ ${doc.display_id}`); ok++; }
    catch(e) { console.log(`❌ ${doc.display_id}: ${e.message}`); fail++; }
  }
  console.log(`\n📊 ${ok} inserted, ${fail} failed`);

  // Verify
  const inserted = await col.find({ display_id: { $in: ids } }).toArray();
  console.log(`✅ Verified: ${inserted.length}/${questions.length}`);
  await client.close();
}
main();
```

### Step 2.3 — Execution Rules

- Batch size: **6–8 questions per script**
- File naming: `scripts/insert_{chapter}_b{N}.js`
- Run: `node scripts/insert_alco_b1.js`
- Check count before proceeding to next batch

### Step 2.4 — Post-Insertion Report
```
INSERTION REPORT
Total inserted: [N]
Display IDs: [PREFIX]-[start] to [PREFIX]-[end]
Failed: [list or NONE]
Verified in DB: [N]/[N]
```

---

## SOLUTION GENERATION (when requested)

**5-step format:**
```
**Step 1: Understand the Problem**
**Step 2: Key Concepts**
**Step 3: Apply**
**Step 4: Calculate**
**Step 5: Answer**
**Remember:** [2–3 bullet points]
```

**Minimums:** SCQ ≥ 80 words | NVT ≥ 60 words | MCQ/AR ≥ 100 words

---

## CRITICAL RULES

1. ❌ NEVER use `$$...$$` — use `$...$` only
2. ❌ NEVER use `\dfrac` — use `\frac` only
3. ❌ NEVER use `new ObjectId()` — use `uuidv4()` for `_id`
4. ❌ NEVER insert into `questions` — use `questions_v2` only
5. ❌ NEVER omit `deleted_at: null`
6. ❌ NEVER use old 'Easy'/'Medium'/'Hard' — use difficultyLevel 1-5
7. ❌ NEVER use old exam_source only — include new examBoard, sourceType, examDetails
8. ❌ NEVER skip questionNature tagging
9. ✅ ALWAYS query DB for current max display_id before assigning new IDs

---

**Document Version:** 3.1 | **Last Updated:** 2026-03-31
