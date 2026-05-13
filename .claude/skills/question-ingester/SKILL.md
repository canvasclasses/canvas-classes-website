---
name: question-ingester
description: Ingest JEE/NEET PYQs or practice questions into the Crucible question bank (`questions_v2` collection). Enforces the canonical two-phase workflow — Phase 1 extraction into a per-chapter `scripts/_phase1_buffer_<prefix>.js` with SRC tags, Phase 2 insertion via per-batch scripts — plus the validator gate, `answer_pending` mode for batches without an answer key, year/month/shift metadata on every PYQ, and bulk-apply scripts when the answer key arrives later. Trigger when the user says "insert these questions", "extract these questions", "add to the chapter", "ingest this batch", "next batch of questions", "apply the answer key", "start the next chapter", uploads PDF page images of MCQs/NVTs, or mentions a chapter prefix like MIP/UNIT/K1D/MOLE/SALT followed by question content. Skip for solution-only ingestion (use solution-ingestion-workflow), mock test bundling (use MOCK_TEST_INGESTION_WORKFLOW), or single-question hand-edits via the admin UI.
---

# Question Ingester

You are ingesting questions into the Crucible question bank. **The canonical rulesets live in `_agents/workflows/`.** Read the right one for the subject before doing anything:

| Subject | Workflow doc | Display ID prefix examples |
|---|---|---|
| Physics | `_agents/workflows/PHYSICS_QUESTION_INGESTION_WORKFLOW.md` | MIP, UNIT, K1D, NLM, ELST, … |
| Chemistry | `_agents/workflows/QUESTION_INGESTION_WORKFLOW.md` | ATOM, MOLE, SALT, PERI, CORD, … |
| Maths | `_agents/workflows/QUESTION_INGESTION_WORKFLOW.md` (use the maths section) | QUAD, MTRX, LIMS, … |
| Solutions only | `_agents/workflows/solution-ingestion-workflow.md` | (separate flow) |

When anything below conflicts with the workflow doc, the workflow doc wins.

## STEP 0 — ALWAYS DO THIS FIRST

1. Read the matching workflow doc end-to-end (don't paraphrase from memory).
2. Read the chapter section of `app/crucible/admin/taxonomy/taxonomyData_from_csv.ts` — confirm `chapter_id`, `tag_id` values, and that the prefix is wired into the prefix maps in **both** `app/api/v2/questions/route.ts` and `app/crucible/admin/page.tsx`.
3. Glance at the V2 schema at `lib/models/Question.v2.ts` — pay attention to `metadata.examDetails.{year, month, shift}` shape.

## STEP 1 — IMAGE SURVEY (anti-hallucination gate)

Before extracting, write a short IMAGE SURVEY block listing every question number visible per page, and which subsections (e.g. "Errors of Measurement", "Multiplication of Vectors") they fall under. Note any figures, tables, or partially-visible questions.

For every question, write a `// SRC:` comment quoting the **first 8 words verbatim** from the source image. If you cannot quote them, the image is illegible — flag it and stop. **Never** generate question content from training knowledge.

For figures: do **not** insert any `[FIGURE: …]` placeholder or describe the diagram in markdown. The user knows which questions need images and uploads them manually via the admin UI after insertion. Just write the prose surrounding the figure verbatim and stop. Never reconstruct diagrams in LaTeX.

## STEP 2 — PHASE 1: EXTRACT INTO BUFFER

Write all questions in this batch to a **per-chapter buffer** named `scripts/_phase1_buffer_<prefix>.js` (lowercase prefix, e.g. `_phase1_buffer_curr.js` for Current Electricity, `_phase1_buffer_flui.js` for Fluids). This prevents collisions when multiple sessions ingest different chapters in parallel — the legacy single `_phase1_buffer.js` is a shared scratchpad and gets clobbered.

```js
const questions = [
  {
    display_id: 'PREFIX-NNN',
    type: 'SCQ' | 'MCQ' | 'NVT' | 'AR' | 'MTC',
    difficultyLevel: 1-5,
    answer_pending: true,            // ONLY if no answer key for this batch
    question_text: { markdown: '...' },
    options: [...],                  // 4 options for non-NVT, [] for NVT
    answer: { ... },                 // omit when answer_pending
    tag_id: 'tag_xxx_N',
    questionNature: 'Recall' | 'Rule_Application' | 'Numerical' | 'Comparative' | 'Graphical' | 'Conceptual' | 'Mechanistic' | 'Synthesis',
    // CANONICAL exam taxonomy (project decision 2026-05-07). Do NOT use legacy
    // examBoard / is_pyq / exam_source — those have been retired (Phase 2).
    applicableExams: ['JEE'] | ['NEET'] | ['CBSE'] | ['BITSAT'],   // multi-valued array
    sourceType: 'PYQ' | 'Practice' | 'NCERT_Textbook' | 'NCERT_Exemplar' | 'Mock',
    examDetails: { exam: 'JEE_Main', year: 2024, month: 'Apr', shift: 'Shift-I' }
  },
  // ...
];
module.exports = { questions };
```

**Required metadata on every PYQ doc:** `year` (number), `month` (3-letter string `'Jan'` … `'Dec'`), `shift` (canonical `'Shift-I'` or `'Shift-II'` — NEVER `'Morning'`/`'Evening'`/`'M'`/`'E'`/`'Shift 1'`). NEET is a single-shift exam — leave shift `null` for NEET PYQs. Read from the image's date stamp like `"25 Jan 2023 (M)"` → year 2023, month `'Jan'`, shift `'Shift-I'`. The user has explicitly asked that year and month be correct on every question.

**LaTeX rules** (validated in step 3):
- Inline math only: `$...$` — never `$$...$$`
- Use `\frac`, never `\dfrac`
- All `{` and `}` balanced
- No raw Unicode arrows/Greek letters outside `$...$` — use `\rightarrow`, `\Delta`, etc.
- For physics: `\hat{i}`, `\vec{F}`, `\,\text{m/s}`, `^\circ`
- For chemistry: `\ce{H2SO4}` for formulas (not `H_2SO_4`)

**`answer_pending: true` semantics:**
- All choice options have `is_correct: false`
- NVT: omit the `answer` field entirely
- The validator skips correctness checks for these
- Bulk-apply the answer key later via a dedicated script (mirror `scripts/apply_answers_units.js`)

## STEP 3 — VALIDATE

Run:

```bash
node scripts/validate_phase1_output.js scripts/_phase1_buffer_<prefix>.js <subject>
```

Where `<subject>` is `physics`, `chemistry`, `maths`, or `biology`.

Must show `Clean: N/N | Errors: 0` before proceeding. Fix every error in the buffer and re-validate — never skip or override.

## STEP 4 — PHASE 2: INSERT

Use the **generic insert script** — no per-batch script writing. Run:

```bash
node scripts/insert_questions.js scripts/_phase1_buffer_<prefix>.js
```

The script reads the buffer, derives `chapter_id` + `subject` from the prefix, runs the pre-flight collision check across the entire batch, and inserts everything in a single `insertMany`. It already enforces all required canonical metadata (`status: 'published'`, `needs_review: false`, `version: 1`, `deleted_at: null`, `applicableExams`, `sourceType`, `examDetails`, etc.) and never writes legacy fields (`is_pyq`, `examBoard`, `exam_source`).

**Do NOT** create per-batch insert scripts (`insert_<short>_b<N>.js`). The legacy "6–8 questions per file" rule is retired — `insertMany` is atomic and the validator already gates correctness. One buffer = one insert command.

**Do NOT** include any cache-bust hook. The dev server's `/api/v2/admin/revalidate` endpoint is flaky; cache invalidation is a manual user call (`curl -X POST localhost:3000/api/v2/admin/revalidate -H 'Content-Type: application/json' -d '{"tag":"questions"}'`).

**For `answer_pending` batches** (no answer key yet): the buffer keeps `answer_pending: true` per question, omits the `answer` field, and all options have `is_correct: false`. The generic script handles these correctly. Bulk-apply the answer key later via a dedicated `scripts/apply_answers_<short>.js` (mirror `scripts/apply_answers_units.js`).

## STEP 5 — APPLY ANSWER KEY (separate pass, when key arrives)

When the user provides the answer key for a chapter or batch with `answer_pending` docs:

1. Write `scripts/apply_answers_<short>.js` mirroring `scripts/apply_answers_units.js`
2. Build the `KEY` object: `'PREFIX-NNN': '1'..'4'` for choice types, `'PREFIX-NNN': <number>` for NVT
3. The script must:
   - For choice types: rebuild the options array with `is_correct: true` on the right id, set `answer.correct_option`
   - For NVT: set `answer.integer_value` (or `decimal_value`)
   - Bump `version`, set `updated_at`, `updated_by: 'apply-answer-key-script'`
   - Audit: every doc has exactly one correct option flagged + matching `answer.correct_option` (or NVT answer present)
4. Run and confirm `Updated N / N. Mismatches: 0` and `Audit: all clean`.

## STEP 6 — METADATA AUDIT (end-of-chapter)

After the chapter is fully ingested AND the answer key is applied, mirror the audit pattern from `apply_answers_units.js`. Specifically check that every `display_id` in the chapter has:
- correct `metadata.examDetails.year`, `month`, `shift` matching the source PDF date stamps
- exactly one `is_correct: true` option (for choice types) or a definitive NVT answer
- `metadata.chapter_id` and `metadata.tags[].tag_id` resolving to live nodes in `taxonomyData_from_csv.ts`

Report total count, tag distribution, type distribution.

## CRITICAL INVARIANTS (must not violate)

1. **Two phases never mix.** Phase 1 = pure extraction, no DB writes. Phase 2 = pure insertion, no extraction.
2. **One image is one PDF page**, typically 8–12 questions. Not one question per image.
3. **Never generate question content from training knowledge.** If you can't read it from the image, write `NEEDS_REVIEW: [reason]`.
4. **Never run a fake audit.** If the audit script wasn't actually run, don't claim it passed.
5. **Don't use preview tools** — they conflict with the user's local dev server on port 3000.
6. **Don't include cache-bust hooks** in insertion scripts.
7. **Mechanistic / Synthesis** question natures are organic-chemistry-only. Reject them for physics/maths/biology — the validator enforces this.
8. **Display IDs follow `PREFIX-NNN` strictly** (3-digit zero-padded; PREFIX-NNNN allowed only past 999). Always check the current max `display_id` for the prefix before assigning new ones.

## SOLUTION GENERATION — IMAGE RULE

When generating solutions for existing questions (e.g. via `save_solutions_*.js` scripts):

9. **Questions with embedded images or graphs:** If a question's `question_text.markdown` contains an actual embedded image (`![`, `<img`, `[FIGURE:`), and the diagram is essential for solving the question (e.g. a graph to read values from, a circuit diagram, a geometric figure with labelled angles), **do not generate a solution from text alone**. Instead, stop and ask the user: *"UNIT-XXX has an embedded image I need to see — can you share a screenshot of this question including the diagram?"* When the user shares the screenshot, **use your vision capability** to read the diagram and then generate the full solution.
10. **False positives:** The word "figure", "graph", or "diagram" in question text without an actual image tag is NOT a trigger. Only actual `![...](...)`  or `<img` tags or `[FIGURE:` placeholders count.
11. **During ingestion from PDF images:** When ingesting questions from user-supplied PDF page screenshots, you already have the source image open. For any question in that batch that contains a diagram, **generate the solution immediately** during Phase 1 — write it into a `solution_markdown` comment block in the per-chapter buffer alongside the question. This is the optimal time since the image is visible. The solution can be committed to DB in the Phase 2 insert script alongside the question.

## ANTI-PATTERNS (what NOT to do)

- ❌ Running `node -e "..."` for scripts containing LaTeX (shell escaping corrupts backslashes — always write a `.js` file)
- ❌ Writing to legacy field aliases (`question_markdown`, `solution_markdown`) — use canonical fields per CLAUDE.md §4.5
- ❌ Writing to legacy exam-attribution fields (`is_pyq`, `examBoard`, `exam_source`, `difficulty` enum) — these were retired in Phase 2 of the 2026-05-07 cleanup. Use canonical `sourceType`, `applicableExams`, `examDetails`, `difficultyLevel` instead.
- ❌ Setting `status: 'review'` or `status: 'draft'` on new questions — every new question goes directly to `'published'`. Use `flags[]` with `type: 'tag_uncertain'` (or similar) if a question needs human attention.
- ❌ Using legacy shift values (`'Morning'`, `'Evening'`, `'M'`, `'E'`, `'Shift 1'`) — always use canonical `'Shift-I'` / `'Shift-II'`. NEET is single-shift, leave shift `null`.
- ❌ Setting `answer: {}` for `answer_pending` NVTs — omit the field entirely
- ❌ Skipping the validator step
- ❌ Assigning `tag_id` that doesn't exist in `taxonomyData_from_csv.ts`
- ❌ Mixing `subject: 'chemistry'` (the schema default) when the question is physics — always set explicitly
- ❌ Touching `app/the-crucible/` (V1, deprecated)
- ❌ Calling the cache-bust endpoint inside an insertion script

## SOLUTION FORMAT — CANONICAL TEMPLATE

All solutions written to `solution.text_markdown` must follow this exact format. The four section markers are emoji-only — no headings, no bold labels.

```
🎯
- [Given quantity / condition — one bullet per key fact]
- [What to find]

💡 [One-line insight: the conceptual key that unlocks the problem — why this approach works]

✏️
[Step-by-step working. Each line is a LaTeX equation or short prose + equation.]
[Use ⚠️ inline for a trap warning if a common mistake exists]

$\boxed{\text{Answer: (x)}}$   ← for MCQ/MTC
$\boxed{\text{Answer: N}}$      ← for NVT (numerical value)
```

### Section rules

| Section | Purpose | Length |
|---|---|---|
| 🎯 | Bullet-list the givens and the unknown. Extract numbers/formulas from the question text so the working is uncluttered. | 2–5 bullets |
| 💡 | Single sentence. The "why" — the non-obvious insight or the formula/law that drives the whole solution. No worked steps here. | 1 sentence |
| ✏️ | Full working. Show every algebraic step; don't skip from setup to answer. | As many lines as needed |
| ⚠️ | Optional. Flag a specific common mistake (wrong formula, wrong sign, forgotten factor) with a concrete counter-example. Place inline at the end of ✏️ before the boxed answer. | 1–3 sentences |

### LaTeX rules (enforced in solutions)

| Rule | Correct | Wrong |
|---|---|---|
| Math delimiters | `$...$` inline only | `$$...$$` — never |
| Fractions | `\frac{a}{b}` | `\dfrac{a}{b}` — oversized in inline math |
| Vectors | `\vec{F}`, `\hat{i}`, `\hat{j}`, `\hat{k}` | Raw bold or arrow Unicode |
| Units in prose | Outside math: `25 kg`, `m/s` | Unitless math expressions |
| Units in math | `\,\mathrm{kg}`, `\,\mathrm{m\,s^{-1}}` | `kg`, `ms^{-1}` bare |
| Greek / symbols | `\Delta`, `\alpha`, `\omega`, `\tau`, `\eta` inside `$` | Raw Unicode Δ, α outside `$` |
| Box | `$\boxed{\text{Answer: (b)}}$` | Any other answer format |
| Determinants | `\begin{vmatrix}...\end{vmatrix}` | ASCII tables |
| Chemical formulas | `\ce{H2SO4}` | `H_2SO_4` |

**JS escaping:** In JavaScript template literals every `\` becomes `\\`. So `\frac` → `\\frac`, `\vec` → `\\vec`, `\boxed` → `\\boxed`, etc.

### questionNature tag guide (physics)

Choose the tag that best describes *what the student must do*, not the topic:

| Tag | When to use |
|---|---|
| `Recall` | Answer requires only remembering a definition or formula verbatim; no calculation. |
| `Conceptual` | Answer requires reasoning about physical principles, identifying which rule applies, or spotting a contradiction — minimal or no algebra. Includes Match-the-Column (MTC) questions where matching is based on knowing formulas. |
| `Rule_Application` | Apply a single well-known formula or dimensional rule directly. One or two trivial substitution steps. |
| `Numerical` | Multi-step algebraic or arithmetic calculation; student must manipulate equations and/or convert units to reach a number. |
| `Graphical` | Reading, interpreting, or constructing a graph is essential to solve the question. |
| `Comparative` | Student must evaluate multiple cases/options against each other (beyond simple recall). |

Do **not** use `Mechanistic` or `Synthesis` for physics — those are organic-chemistry-only tags.

### Script naming convention

Solution scripts go in `scripts/`, named `save_solutions_<prefix>_b<N>.js`:
- `save_solutions_mip_b1.js` … `save_solutions_mip_b10.js` (Math in Physics, 94 questions — complete)
- `save_solutions_unit_b1.js` … (Units & Dimensions, 110 questions — in progress)

Each script uses the same boilerplate:
```js
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const UPDATES = { 'PREFIX-NNN': { questionNature: '...', text_markdown: `...` }, ... };
async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');
  const now = new Date();
  let ok = 0, fail = 0;
  for (const [display_id, update] of Object.entries(UPDATES)) {
    const res = await col.updateOne(
      { display_id },
      { $set: { 'solution.text_markdown': update.text_markdown, 'solution.latex_validated': false,
                'metadata.questionNature': update.questionNature, updated_at: now, updated_by: 'ai_agent' }}
    );
    res.matchedCount === 0 ? (console.log(`⚠️  ${display_id}: not found`), fail++) : (console.log(`✅ ${display_id}`), ok++);
  }
  console.log(`\n📊 ${ok} updated, ${fail} failed`);
  await client.close();
}
main();
```

### Voice and register

Solutions are read by tier-2 North Indian JEE/NEET students. Write in simple, clear English:
- Short sentences. No literary or refined vocabulary.
- Hinglish-friendly phrasing is fine (e.g. "so we get", "directly gives us").
- No multi-paragraph prose — keep ✏️ as a sequence of equations with minimal connective text.
- Never write multi-line balanced chemical equations in solution markdown — rendering breaks.
- For coordination compounds use `\mathrm{}` not `\ce{}` with square brackets.

---

## OUTPUT TO USER

After each batch, report:
- Total inserted, total in chapter so far
- Tag and type distribution
- Any per-question caveats (figures awaiting upload, ambiguous formulas, etc.)
- One-line "next step" hint (e.g. "send next batch" or "ready for answer key")

Keep the report short — the user wants progress, not narration.
