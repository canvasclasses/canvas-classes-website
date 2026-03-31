---
description: Mathematics Question Ingestion Workflow — Two-Phase System
---

# MATHEMATICS QUESTION INGESTION WORKFLOW v3.0

> **Design principle:** Phase 1 and Phase 2 are ALWAYS separate operations. Never mix extraction and insertion in the same context window.

---

## QUICK REFERENCE

### Chapter Mappings (Mathematics)

Mathematics uses a **uniform pattern** across all 33 chapters:

```
CHAPTER_ID:   ma_[name]               (e.g., ma_complex, ma_quadratic)
PREFIX:       First 4 chars uppercase  (e.g., COMP, QUAD, PROB)
TAG_ID:       tag_{chapter_id}         (e.g., tag_ma_complex)
```

**Common math chapters:**
```
ma_complex       → COMP  → tag_ma_complex
ma_quadratic     → QUAD  → tag_ma_quadratic
ma_matrices      → MATR  → tag_ma_matrices
ma_probability   → PROB  → tag_ma_probability
ma_calculus      → CALC  → tag_ma_calculus
ma_vectors       → VECT  → tag_ma_vectors
ma_trigonometry  → TRIG  → tag_ma_trigonometry
ma_geometry      → GEOM  → tag_ma_geometry
ma_algebra       → ALGB  → tag_ma_algebra
```

### Type Detection
- 4 options, 1 correct → `SCQ`
- 4 options, 2+ correct → `MCQ`
- Numerical / "nearest integer" / fill in blank → `NVT`
- Assertion + Reason → `AR`
- Statement I + II → `MST`
- Match columns → `MTC`
- Matrix match → `MTC` with 4 rows

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
- **JEE Advanced PYQ** → `examBoard: 'JEE'`, `sourceType: 'PYQ'`, `examDetails: { exam: 'JEE_Advanced', year: 2024, paper: 'Paper 1' }`
- **Practice question** → `examBoard: 'JEE'`, `sourceType: 'Practice'`, `examDetails: null`
- **NCERT Exemplar** → `examBoard: 'CBSE'`, `sourceType: 'NCERT_Exemplar'`, `examDetails: null`

### Question Nature
- `Recall` - Formula/definition recall
- `Rule_Application` - Direct formula application
- `Mechanistic` - Step-by-step problem solving
- `Synthesis` - Multi-concept integration

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

**Math Notation (LaTeX - CRITICAL):**
- ALL math inside `$...$` — NEVER `$$...$$`
- NEVER `\dfrac` — use `\frac` only
- Vectors: `$\vec{a}$`, `$\hat{i}$`
- Matrices: `$\begin{pmatrix} a & b \\ c & d \end{pmatrix}$`
- Limits: `$\lim_{x \to 0}$`
- Integrals: `$\int_{0}^{1} f(x) dx$`
- Derivatives: `$\frac{dy}{dx}$` or `$f'(x)$`
- Count `$` per line — must be even
- NEVER use Unicode math symbols outside LaTeX

**Options:**
- Always 4 options `[{id:"a",...},{id:"b",...},{id:"c",...},{id:"d",...}]`
- NVT: `options: []`, answer in `answer.integer_value` or `answer.decimal_value`
- If answer key provided: set `is_correct: true` on correct option(s)
- If NO answer key: set ALL `is_correct: false`

**Source tag (required):**
```javascript
// SRC: "[first 8 words verbatim]" | AK: [a/b/c/d or null]
```

**Uncertainty:** If question illegible: `// ⚠️ Q[N] ILLEGIBLE — skipping`

### Step 1.3 — Output Format

```javascript
// SRC: "If the matrix A is given by" | AK: c
{
  display_id: 'MATR-001',
  type: 'SCQ',
  difficultyLevel: 4,
  question_text: { markdown: 'If the matrix $A$ is given by...' },
  options: [
    { id: 'a', text: '$0$', is_correct: false },
    { id: 'b', text: '$1$', is_correct: false },
    { id: 'c', text: '$2$', is_correct: true },
    { id: 'd', text: '$3$', is_correct: false }
  ],
  answer: { correct_option: 'c' },
  solution: null,
  tag_id: 'tag_ma_matrices',
  questionNature: 'Rule_Application',
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
  const docs = await col.find({ display_id: /^MATR-/ })
    .sort({ display_id: -1 }).limit(1).toArray();
  console.log('Last ID:', docs[0]?.display_id ?? 'none');
  await client.close();
}
main();
```

### Step 2.2 — Insertion Script Template

```javascript
// scripts/insert_ma_{chapter}_b{N}.js
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

// ── CHAPTER CONFIGURATION ────────────────────────────────────
const CHAPTER_ID = 'ma_matrices';      // ← SET THIS
const PREFIX = 'MATR';                  // ← SET THIS (4 chars)
const TAG_ID = 'tag_ma_matrices';       // ← SET THIS
// ──────────────────────────────────────────────────────────────

const now = new Date();

function mk(display_id, difficultyLevel, type, markdown, options, answer, solution, examBoard, sourceType, examDetails, questionNature = 'Rule_Application') {
  return {
    _id: uuidv4(), display_id,
    question_text: { markdown, latex_validated: false },
    type, options, answer: answer ?? null,
    solution: solution ? { text_markdown: solution, latex_validated: false } : null,
    metadata: {
      difficultyLevel,
      chapter_id: CHAPTER_ID,
      subject: 'maths',
      tags: [{ tag_id: TAG_ID, weight: 1.0 }],
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

function mkSCQ(display_id, difficultyLevel, markdown, opts, correct, examBoard, sourceType, examDetails, questionNature) {
  return mk(display_id, difficultyLevel, 'SCQ', markdown,
    ['a','b','c','d'].map((id,i) => ({ id, text: opts[i], is_correct: id === correct })),
    { correct_option: correct }, null, examBoard, sourceType, examDetails, questionNature);
}

function mkMCQ(display_id, difficultyLevel, markdown, opts, correctArr, examBoard, sourceType, examDetails, questionNature) {
  return mk(display_id, difficultyLevel, 'MCQ', markdown,
    ['a','b','c','d'].map((id,i) => ({ id, text: opts[i], is_correct: correctArr.includes(id) })),
    { correct_options: correctArr }, null, examBoard, sourceType, examDetails, questionNature);
}

function mkNVT(display_id, difficultyLevel, markdown, answer_val, examBoard, sourceType, examDetails, questionNature) {
  return mk(display_id, difficultyLevel, 'NVT', markdown, [],
    { integer_value: answer_val }, null, examBoard, sourceType, examDetails, questionNature);
}

// Usage: mkSCQ(display_id, difficultyLevel, markdown, opts, correct, examBoard, sourceType, examDetails, questionNature)
const questions = [
  // JEE Main PYQ example:
  // mkSCQ('MATR-001', 4, 'If the matrix $A$...', ['$0$', '$1$', '$2$', '$3$'], 'c', 'JEE', 'PYQ', {exam:'JEE_Main', year:2024, shift:'Morning'}, 'Rule_Application'),
  
  // JEE Advanced PYQ example:
  // mkSCQ('MATR-002', 5, 'Let $P$ be a matrix...', ['opt a', 'opt b', 'opt c', 'opt d'], 'a', 'JEE', 'PYQ', {exam:'JEE_Advanced', year:2024, paper:'Paper 1'}, 'Synthesis'),
  
  // Practice question example:
  // mkNVT('MATR-003', 3, 'Find the determinant...', 42, 'JEE', 'Practice', null, 'Mechanistic'),
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
    if (!q.display_id?.startsWith(PREFIX)) errors.push(`${q.display_id}: must start with ${PREFIX}`);
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
- File naming: `scripts/insert_ma_{chapter}_b{N}.js`
- Run: `node scripts/insert_ma_matrices_b1.js`
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
**Step 1: Understand the Problem** — [what is being asked]
**Step 2: Key Concepts** — [relevant formula/theorem]
**Step 3: Apply** — [step-by-step working]
**Step 4: Calculate** — [computations]
**Step 5: Answer** — [final answer]
**Remember:** [2–3 bullet points with key formulas]
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
9. ❌ NEVER use Unicode math symbols outside LaTeX
10. ✅ ALWAYS query DB for current max display_id before assigning new IDs

---

## MATH-SPECIFIC NOTES

### Matrix Questions
- Use `$\begin{pmatrix} ... \end{pmatrix}` for matrices
- Determinant: `$\det(A)$` or `$|A|$`
- Always specify matrix dimensions if relevant

### Calculus Questions
- Derivatives: `$\frac{dy}{dx}$`, `$f'(x)$`, `$\frac{d^2y}{dx^2}$`
- Integrals: `$\int_{a}^{b} f(x) dx$`
- Limits: `$\lim_{x \to a} f(x)$`

### Trigonometry
- Use `$\sin$`, `$\cos$`, `$\tan$` (not sin, cos, tan without `$`)
- Degrees: `$45^\circ$`
- Inverse: `$\sin^{-1}$` or `$\arcsin$`

### Vectors
- Vectors: `$\vec{a}$`, `$\vec{b}$`
- Unit vectors: `$\hat{i}$`, `$\hat{j}$`, `$\hat{k}$`
- Dot product: `$\vec{a} \cdot \vec{b}$`
- Cross product: `$\vec{a} \times \vec{b}$`

---

**Document Version:** 3.1 | **Last Updated:** 2026-03-31
