# Class 12 Biology — NCERT Exercises page authoring contract

You are authoring the **"Practice — NCERT Exercises"** page for ONE chapter of the Class 12
Biology Live Book. Output one CommonJS module exporting a page object. Follow this exactly.

## What this page is

The end-of-chapter drill: **every** NCERT textbook exercise for the chapter, reorganised from
the textbook's running order into 3–5 **revision themes**, each question with a **full worked
solution** (not just an answer). This mirrors the proven Chem-12 "Practice — NCERT Exercises"
page. The worked solution IS the product — a student who gets a question wrong should learn the
whole idea from your solution (the UWorld principle).

## Non-negotiables

1. **The PROMPT is the exact NCERT question, verbatim (Rule 0).** Copy the question text as-is
   from the source file you are given. Do NOT paraphrase, simplify, renumber, or "improve" the
   question — students will meet this exact wording. Fix only obvious OCR artefacts (a stray
   line-break mid-word, "dibybrid" → "dihybrid", a missing space). If a question has parts
   (a)(b)(c), keep them in the prompt.
2. **Every exercise must appear exactly once.** Do not drop, merge, or invent questions. Count
   the questions in the source; your page must contain that many items.
3. **The SOLUTION is yours, and it must be excellent + NCERT-faithful.** Full, plain,
   teacher-voice answer. For "Differentiate between X and Y" give the actual contrasts (a short
   markdown table is ideal). For "With a neat diagram, explain…" describe what the diagram shows
   and label the key parts in words (we can't draw here). For a numerical/cross, show the steps
   and the final ratio/answer. Everything must be consistent with NCERT Class 12 Biology — do not
   introduce facts from outside NCERT. No AI-tell words ("crucial", "delve", "it's not just X,
   it's Y").
4. **Voice** = the same warm, plain classroom teacher used across the book. Short sentences.

## Item kinds

- **Default: `kind: 'numerical'`** — for descriptive / short-answer / diagram / cross questions
  (i.e. almost all of them). Shape:
  `{ kind:'numerical', id, source:'ncert_exercise', source_label:'NCERT <ch>.<n>', prompt, answer, solution }`
  - `answer` (optional but include it): a ONE-LINE crisp answer / final result (e.g. "3 : 1",
    "16 gamete types", "Tapetum nourishes the microspores and lays down the exine"). It's the
    quick self-check; the full reasoning goes in `solution`.
  - `solution` (required, min 1 char): the full worked answer in markdown.
- **`kind: 'mcq'`** — ONLY if the NCERT question is genuinely multiple-choice ("Which of the
  following…"). Shape:
  `{ kind:'mcq', id, source:'ncert_exercise', source_label:'NCERT <ch>.<n>', prompt, options:[…], correct_index, explanation }`
  Most chapters have zero of these.

`source_label` format: **`NCERT <chapterNumber>.<questionNumber>`** — e.g. `NCERT 4.3`. Use the
chapter number you are told and the question's own number from the source.

## Sections (the revision themes)

Group the questions into **3–5 sections** by sub-topic, NOT the textbook's running order — this
regrouping is the value-add. Each section:
`{ id, title, blurb, items:[…] }`
- `id`: short kebab-case, e.g. `s1-pollen`.
- `title`: the theme, e.g. "Microsporogenesis & the pollen grain".
- `blurb` (optional, 1 line): what this cluster drills.
A question can only go in one section. Order sections in a sensible learning order.

## Page object shape (output this)

```js
module.exports = {
  slug: 'ch<N>-practice-ncert-exercises',   // e.g. 'ch1-practice-ncert-exercises'
  title: 'Practice — NCERT Exercises',
  subtitle: 'All <COUNT> NCERT textbook exercises for the chapter, grouped into <K> revision themes with full worked solutions.',
  page_type: 'lesson',
  tags: ['ncert-exercises', 'practice'],
  blocks: [
    // block 0 — hero image (src:'' + a real generation_prompt, aspect_ratio '16:5', biology dark style)
    { id:'<uuid>', type:'image', order:0, src:'', alt:'…', caption:'', width:'full', aspect_ratio:'16:5', generation_prompt:'…' },
    // block 1 — short intro text ("You've read the chapter — now drill it. Below are all N NCERT exercises, regrouped…")
    { id:'<uuid>', type:'text', order:1, markdown:'…' },
    // block 2 — the practice_bank
    { id:'<uuid>', type:'practice_bank', order:2, title:'NCERT Exercises <ch>.1–<ch>.<last>', intro:'…', sections:[ … ] },
  ],
};
```

Every `id` (blocks, sections, items) must be a **unique uuid v4 string**. Block `order` is
0,1,2. **The page ends on the practice_bank — do NOT add an inline_quiz** (this page type is the
drill itself).

## Reference
- Real inserted example to mirror: `ncert-simplified-12` book, page slug `d-and-f-block-practice`
  (the Chem-12 "Practice — NCERT Exercises" page).
- Schema (authoritative): `packages/data/books/schemas.ts` → `PracticeBankBlockSchema`.

Write the module to the exact path given, then report the path, the question count, and the
number of sections. Do NOT insert into any database.
