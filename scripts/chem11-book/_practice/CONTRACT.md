# Class 11 Chemistry — NCERT Exercises page authoring contract

You are authoring the **"Practice — NCERT Exercises"** page for ONE Live Book chapter of the
Class 11 Chemistry book (`ncert-simplified`, book_id `be7b5b7f-e993-4d3b-b9c8-52f7c308ab0e`).
Output one CommonJS module exporting a page object. Follow this exactly.

## What this page is

The end-of-chapter drill: NCERT textbook exercises for the chapter's matching NCERT unit,
reorganised from the textbook's running order into 3–5 **revision themes**, each question with a
**full worked solution** (not just an answer). This mirrors the proven Chem-12 "Practice — NCERT
Exercises" page and the Class 12 Biology toolkit it inspired. The worked solution IS the product —
a student who gets a question wrong should learn the whole idea from your solution.

## Non-negotiables

1. **The PROMPT is the exact NCERT question, verbatim (Rule 0).** Copy the question text as-is
   from the source `.txt` file you are given. Do NOT paraphrase, simplify, renumber, or "improve"
   the question — students will meet this exact wording. Fix only obvious OCR artefacts. If a
   question has parts (a)(b)(c), keep them in the prompt. Preserve chemical formulas exactly
   (subscripts/superscripts as plain text is fine, e.g. `H2SO4`, `Fe3+`).
2. **Every exercise in scope must appear exactly once.** Do not drop, merge, or invent questions.
   The founder has told you the exact question-number range in scope for this chapter (e.g.
   "6.1–6.34 only" or "8.18–8.35 only") — count them; your page must contain exactly that many
   items, no more, no less.
3. **The SOLUTION is yours, and it must be excellent + NCERT-faithful.** Full, plain,
   teacher-voice answer. For numerical problems, show every step (set up the equation, substitute
   values, compute, state the final answer with correct units/sig-figs). For conceptual/descriptive
   questions, give the real explanation in the chapter's own terms — don't hand-wave. Everything
   must be consistent with NCERT Class 11 Chemistry — do not introduce facts from outside NCERT
   or values that contradict the textbook's own conventions. No AI-tell words ("crucial", "delve",
   "it's not just X, it's Y").
4. **Verify numbers before writing them down.** For any calculation, re-derive the arithmetic
   yourself — do not copy the NCERT-provided selected-answer without checking it's internally
   consistent with the question. If the source `.txt` file includes an official NCERT answer for
   a question, treat it as a check on your own derivation, not a substitute for showing the work.
5. **Voice** = the same warm, plain classroom teacher used across the book. Short sentences.
6. **LaTeX**: use `$...$` for inline math (single dollar only, never `$$`), `\ce{...}` for chemical
   formulas/equations inside math mode. Follow the LaTeX rules in the root CLAUDE.md §4 exactly
   (no `\dfrac`, escape backslashes doubled if the file requires JSON-string escaping — this file
   is a JS module so a single backslash in a JS string is fine, e.g. `'$\\Delta H$'`).

## Item kinds

- **Default: `kind: 'numerical'`** — for descriptive / calculation / short-answer questions (i.e.
  almost all of them). Shape:
  `{ kind:'numerical', id, source:'ncert_exercise', source_label:'NCERT <unit>.<n>', prompt, answer, solution }`
  - `answer` (optional but include it): a ONE-LINE crisp final answer/result (e.g. "pH = 2.70",
    "sp³d² hybridisation", "ΔH = −92.4 kJ/mol"). It's the quick self-check; the full reasoning
    goes in `solution`.
  - `solution` (required, min 1 char): the full worked answer in markdown.
- **`kind: 'mcq'`** — ONLY if the NCERT question is genuinely multiple-choice ("Which of the
  following…", "predict... (a)/(b)/(c)/(d)"). Shape:
  `{ kind:'mcq', id, source:'ncert_exercise', source_label:'NCERT <unit>.<n>', prompt, options:[…], correct_index, explanation }`
  Most chapters have zero or very few of these.

`source_label` format: **`NCERT <NCERT-unit-number>.<questionNumber>`** — use the **NCERT
textbook's own unit number** (e.g. Unit 6 "Equilibrium" → `NCERT 6.x`, Unit 8 "Organic Chemistry —
Some Basic Principles and Techniques" → `NCERT 8.x`), NOT the Live Book chapter number, since the
two numbering schemes diverge (the founder will tell you which NCERT unit a given Live Book
chapter maps to).

## Sections (the revision themes)

Group the questions into **3–5 sections** by sub-topic, NOT the textbook's running order — this
regrouping is the value-add. Each section:
`{ id, title, blurb, items:[…] }`
- `id`: short kebab-case, e.g. `s1-mole-concept`.
- `title`: the theme, e.g. "Mole concept & stoichiometry".
- `blurb` (optional, 1 line): what this cluster drills.
A question can only go in one section. Order sections in a sensible learning order.

## Page object shape (output this)

```js
module.exports = {
  slug: 'ch<N>-practice-ncert-exercises',   // e.g. 'ch1-practice-ncert-exercises' — N is the LIVE BOOK chapter number
  title: 'Practice — NCERT Exercises',
  subtitle: 'All <COUNT> NCERT textbook exercises for the chapter, grouped into <K> revision themes with full worked solutions.',
  page_type: 'lesson',
  tags: ['ncert-exercises', 'practice'],
  blocks: [
    // block 0 — hero image (src:'' + a real generation_prompt, aspect_ratio '16:5', dark chemistry style)
    { id:'<uuid>', type:'image', order:0, src:'', alt:'…', caption:'', width:'full', aspect_ratio:'16:5', generation_prompt:'…' },
    // block 1 — short intro text ("You've read the chapter — now drill it. Below are all N NCERT exercises, regrouped…")
    { id:'<uuid>', type:'text', order:1, markdown:'…' },
    // block 2 — the practice_bank
    { id:'<uuid>', type:'practice_bank', order:2, title:'NCERT Exercises <unit>.<first>–<unit>.<last>', intro:'…', sections:[ … ] },
  ],
};
```

For the hero image `generation_prompt`, follow the STANDARD Live Book image style (see root
CLAUDE.md §6 and `_agents/workflows/SIMULATION_DESIGN_WORKFLOW.md` if unsure): hand-drawn coloured
illustration, deep-charcoal near-black background, muted earthy palette (ochre, terracotta, teal,
sage green, indigo, cream), no glow/neon/orange-haze/3D-render look, clean hand-lettered labels
only if any. Theme the image to the chapter's chemistry topic.

Every `id` (blocks, sections, items) must be a **unique uuid v4 string**. Block `order` is
0,1,2. **The page ends on the practice_bank — do NOT add an inline_quiz** (this page type is the
drill itself).

## Reference
- Real inserted example to mirror: `ncert-simplified-12` book, page slug `d-and-f-block-practice`
  (the Chem-12 "Practice — NCERT Exercises" page) — `scripts/practice-dblock/p_dblock.js`.
- Sibling toolkit this contract is ported from: `scripts/bio-book12/_practice/` (Class 12 Biology).
- Schema (authoritative): `packages/data/books/schemas.ts` → `PracticeBankBlockSchema`.

Write the module to the exact path given, then report the path, the question count, and the
number of sections. Do NOT insert into any database.
