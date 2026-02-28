---
description: Question Ingestion Workflow Rules
---

# QUESTION INGESTION WORKFLOW

## RULE 0: ANTI-HALLUCINATION PROTOCOL

**You are a transcription tool first, a chemistry expert second.** Copy what is in the image — character by character. NEVER generate questions from training knowledge. NEVER report a fake audit.

### 0.1 — Image Survey (start of session, autonomous)
```
IMAGE SURVEY — [date]
Total questions detected: [N] | Answer key: YES/NO | Diagrams: [Q numbers or NONE]
Visibility check (first Q per image): [image] → Q[N] first 10 words: "[quote]" ✅
Illegible images: [list or NONE]
Proceeding to extract all [N] questions.
```
If an image is illegible: flag it `⚠️ ILLEGIBLE: [filename] — skipping`, continue with others.

### 0.2 — Continuous Extraction
Process ALL questions without stopping for confirmation. Only pause for: illegible images, answer key mismatch, or technical errors.

### 0.3 — Organic Chemistry Diagrams
Extract question text, text-only options, metadata. SKIP structure interpretation. Use placeholder: `![](https://canvas-chemistry-assets.r2.dev/questions/{id}/diagram.svg)`. Admin uploads actual diagrams later.

### 0.4 — Inline Source Tag
```javascript
// SRC: "[first 8 words from source]" | AK: [answer]
{ "_id": "...", "display_id": "SALT-001", ... }
```

### 0.5 — Uncertainty Handling
If uncertain whether text is from image or training knowledge: `⚠️ UNCERTAINTY FLAG — Q[N]: [details]. Skipping.` Never guess.

### 0.6 — End-of-Session Audit (sample-based, once)
Re-read source images for every 5th question + flagged ones. Report: SRC match, AK match, LaTeX, Solution status. List flagged/skipped questions.

---

## RULE 1: LaTeX Formatting (CRITICAL)

- Use `$...$` for ALL math (inline and display)
- **❌ NEVER use `$$...$$`** — breaks the renderer
- **❌ NEVER use `\dfrac`** — causes oversized rendering; use `\frac` only
- Chemical formulas: `\ce{H2SO4}`, `\ce{CaCO3}`, `\ce{Fe^{2+} + 2OH- -> Fe(OH)2 v}`
- Fractions: `\frac{num}{den}` | Greek: `\alpha`, `\Delta` | Arrows: `\rightarrow`, `\rightleftharpoons`
- MO configs inside `$...$`: `$\sigma_{1s}^2\sigma^*_{1s}^2\pi_{2p}^4$`
- Temperature: `25\,°C` | Units: `\text{mol}`, `\text{L}` | Concentration: `[\ce{H+}]`
- NO LaTeX commands (`\frac`, `\Delta`, `\rightarrow`) outside `$...$` delimiters
- NO raw Unicode arrows (`→`, `←`, `⇌`) outside `$...$`
- Count `$` per line — must be even (no unclosed delimiters)
- All `{` must have matching `}`, all `\left(` must have matching `\right)`
- Bold: `**text**` | Bullets: `- item` | Tables: markdown `|` syntax

### MTC Table Format (preferred)
```markdown
| | List I (label) | | List II (label) |
|---|---|---|---|
| A | item | I | item |
| B | item | II | item |
```
MTC answer matching goes ONLY in the solution, never in the question text.

---

## RULE 2: Difficulty Mapping
`E → "Easy"` | `M → "Medium"` | `T → "Hard"`

## RULE 3: Question Type Detection
- 4 options + 1 correct → `SCQ` | 4 options + 2+ correct → `MCQ`
- Numerical value / "nearest integer" → `NVT` | Assertion + Reason → `AR`
- Statement I + Statement II → `MST` | Match List-I with List-II → `MTC`

## RULE 4: Option Processing
```json
{ "id": "a", "text": "$\\ce{H2O}$", "is_correct": true }
```
- SCQ: exactly 1 `is_correct: true` | MCQ: 2+ `is_correct: true`
- NVT: store in `answer.integer_value` or `answer.decimal_value`, NO options array

## RULE 5: Solution Generation

**Structure (mandatory 5-step format):**
```
**Step 1: Understand the Problem** — [what's being asked]
**Step 2: Identify Key Concepts** — [relevant formulas/concepts]
**Step 3: Apply the Concept** — [reasoning/calculations]
**Step 4: Calculate/Derive** — [step-by-step with units]
**Step 5: Conclusion** — [final answer with explanation]
**Key Points to Remember:** - Point 1 - Point 2 - Point 3
```

**Quality minimums:** SCQ ≥ 80 words, MCQ ≥ 100 words, NVT ≥ 60 words (must show full working), AR/MST ≥ 80 words, MTC ≥ 60 words. All need ≥ 3 steps. Use `\ce{}` for all formulas.

For organic mechanism questions: focus on conceptual understanding, elimination strategies, and problem-solving approach. Do NOT attempt to draw structures via LaTeX.

---

## RULE 6: Metadata

### Chapter & Tags
```javascript
chapter_id: 'ch12_salt'  // Must match taxonomyData_from_csv.ts exactly
tags: [{ tag_id: 'tag_salt_3', weight: 1.0 }]  // Primary tag from chapter
```
Source of truth: `app/crucible/admin/taxonomy/taxonomyData_from_csv.ts`

### Exam Source (PYQs only)
```javascript
exam_source: { exam: 'JEE Main', year: 2024, month: 'Apr', day: 10, shift: 'Morning' }
// exam: "JEE Main" or "JEE Advanced" (exact spelling, MANDATORY for PYQs)
// shift: "Morning"/"Evening" (Main) or "Paper 1"/"Paper 2" (Advanced)
```
Non-PYQ questions must NOT have `exam_source`.

### Source Provenance (MANDATORY)
```javascript
source_reference: {
  type: 'image',  // MUST be 'image' for PYQs
  verified_against_source: true,
  verification_date: new Date(),
  verified_by: 'ai_agent'
}
```

---

## RULE 7: Display ID Generation

**Format:** `{PREFIX}-{3-DIGIT-SEQ}` (e.g., `SALT-001`)

| chapter_id | Prefix | | chapter_id | Prefix |
|---|---|---|---|---|
| `ch11_atom` | `ATOM` | | `ch12_alcohols` | `ALCO` |
| `ch11_bonding` | `BOND` | | `ch12_aldehydes` | `ALDO` |
| `ch11_chem_eq` | `CEQ` | | `ch12_amines` | `AMIN` |
| `ch11_goc` | `GOC` | | `ch12_biomolecules` | `BIO` |
| `ch11_hydrocarbon` | `HC` | | `ch12_carboxylic` | `CARB` |
| `ch11_ionic_eq` | `IEQ` | | `ch12_coord` | `CORD` |
| `ch11_mole` | `MOLE` | | `ch12_dblock` | `DNF` |
| `ch11_pblock` | `PB11` | | `ch12_electrochem` | `EC` |
| `ch11_periodic` | `PERI` | | `ch12_haloalkanes` | `HALO` |
| `ch11_prac_org` | `POC` | | `ch12_kinetics` | `CK` |
| `ch11_redox` | `RDX` | | `ch12_pblock` | `PB12` |
| `ch11_thermo` | `THERMO` | | `ch12_phenols` | `PHEN` |
| `ch12_salt` | `SALT` | | `ch12_solutions` | `SOL` |

**Rules:**
- ❌ NEVER use exam-based prefixes (e.g., `JM25APR7M-51`)
- ❌ NEVER invent new prefixes or include `PYQ` in the ID
- ✅ ALWAYS query `questions_v2` for current max before assigning next ID
- ❌ NEVER embed exam date/year/shift in `question_text.markdown`

---

## RULE 8: Pre-Insertion Validation (MANDATORY)

```javascript
// Run BEFORE every insertion
function validate(q) {
  const errors = [];
  if (['SCQ','MCQ','MTC','MST','AR'].includes(q.type) && q.options.length !== 4)
    errors.push(`${q.type} needs 4 options`);
  if (q.type === 'NVT' && !q.answer?.integer_value && !q.answer?.decimal_value)
    errors.push('NVT missing numerical answer');
  if (q.type === 'SCQ' && q.options.filter(o => o.is_correct).length !== 1)
    errors.push('SCQ needs exactly 1 correct option');
  if (q.type === 'MCQ' && q.options.filter(o => o.is_correct).length < 2)
    errors.push('MCQ needs 2+ correct options');
  if (!q.question_text?.markdown || q.question_text.markdown.length < 20)
    errors.push('Question text too short');
  if (!q.solution?.text_markdown || q.solution.text_markdown.length < 50)
    errors.push('Solution too short');
  if (q.metadata?.is_pyq && !q.metadata?.source_reference?.verified_against_source)
    errors.push('PYQ not verified against source');
  return errors;
}
```

---

## RULE 9: Database Insertion

### Schema Compatibility Checklist
1. `_id`: use `uuidv4()` string — NEVER `new ObjectId()`
2. Collection: `questions_v2` — NEVER `questions` or `questionv2s`
3. `deleted_at: null` — REQUIRED (API filters by this)
4. `display_id` must match regex `/^[A-Z0-9]{2,10}-\d{3,}$/`
5. `chapter_id` must match `taxonomyData_from_csv.ts` exactly

### Canonical Batch Script Template
```javascript
// scripts/insert_{chapter}_b{N}.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: '.env.local' });
const now = new Date();

function mk(display_id, difficulty, type, markdown, options, answer, sol, tag_id, exam_source) {
  const doc = {
    _id: uuidv4(), display_id,
    question_text: { markdown, latex_validated: true },
    type, options: options || [],
    solution: { text_markdown: sol, latex_validated: true },
    metadata: {
      difficulty, chapter_id: 'CHAPTER_ID_HERE',
      tags: [{ tag_id, weight: 1.0 }],
      is_pyq: true, is_top_pyq: false,
      exam_source,
      source_reference: { type: 'image', verified_against_source: true, verification_date: new Date(), verified_by: 'ai_agent' }
    },
    status: 'review', version: 1, quality_score: 95, needs_review: false,
    created_by: 'ai_agent', updated_by: 'ai_agent',
    created_at: now, updated_at: now, deleted_at: null
  };
  if (answer !== undefined) doc.answer = answer;
  return doc;
}

const questions = [ /* mk(...) calls */ ];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  // Duplicate check
  const existing = await col.find({ display_id: { $in: questions.map(q => q.display_id) } }).toArray();
  if (existing.length > 0) { console.log('Duplicates found, skipping.'); return; }
  let ok = 0, fail = 0;
  for (const doc of questions) {
    try { await col.insertOne(doc); console.log(`✅ ${doc.display_id}`); ok++; }
    catch(e) { console.log(`❌ ${doc.display_id}: ${e.message}`); fail++; }
  }
  console.log(`\n📊 ${ok} inserted, ${fail} failed`);
  await mongoose.disconnect();
}
main();
```

### Execution Rules
- Batch size: 5-10 questions per script file
- File naming: `insert_{chapter}_b{N}.js`
- Always check for existing IDs before running
- NEVER use `node -e "..."` for LaTeX content (shell escaping corrupts backslashes)
- Always write `.js` script files and run with `node scripts/file.js`
- After insertion, verify count in the database

---

## RULE 10: Question Text Integrity

**`question_text.markdown` must be VERBATIM from source — never shortened, paraphrased, or compressed.**
- Include every word, value, condition, unit, parenthetical instruction
- Include all `[Given: ...]` blocks exactly as shown
- Only convert plain-text math to LaTeX — do not change mathematical content
- If unsure whether to include something, **include it**

---

## RULE 11: Post-Ingestion Audit

After inserting any batch:
1. Sample audit (10% or min 5 questions) — cross-check against source
2. Run validation on all inserted questions
3. Report: total extracted, clean, flagged, skipped

---

**Document Version:** 2.0 | **Last Updated:** 2026-02-28
