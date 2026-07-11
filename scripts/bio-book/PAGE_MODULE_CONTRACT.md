# Class 11 Biology — Page Module Authoring Contract

You are authoring ONE page of the Class 11 Biology Live Book (NEET/CBSE). Output a
single CommonJS module file exporting one page object. Follow this contract exactly.

## Non-negotiables

1. **NCERT is the source of truth (Rule 0).** Every fact, name, example, and number
   must come from the NCERT chapter text you are given — never from memory. If NCERT
   doesn't say it, don't write it. Do NOT add facts from coaching books or outside NCERT.
   You may re-teach/re-explain NCERT's content more clearly, but never invent content.
2. **Voice = a warm, plain-English classroom teacher** (for tier-2/3-town NEET aspirants).
   No AI tells: no "delve", no "it's not X, it's Y" constructions, no reveal-frames, no
   drama closers, no "in conclusion". Short concrete sentences. Explain the *mechanism* and
   *why*, with a picture the student can hold in their head — don't just reword the NCERT line.
3. **NEET-first depth, not breadth.** Add value via: mnemonics for lists (kingdoms, classes,
   groups), comparison tables/cards for "differentiate between X and Y", and `exam_tip`
   callouts flagging the exact NCERT lines/facts NEET lifts verbatim. Do not pad.
4. **This book's differentiator = interactive diagrams.** Where the page has a labelled
   diagram (bacterial shapes, a protozoan gallery, virus structure, algae/moss/fern anatomy,
   a cone, etc.), use an **`interactive_image`** block with 3–8 hotspots (tap-to-reveal
   labels). This is expected on most pages — it's what makes the book stand out.
5. **Images: `src: ""` + a real `generation_prompt`.** DO NOT generate images. Every image /
   interactive_image / hero gets `src: ""` and a specific prompt. Biology image style
   (§3.14): "Scientific textbook illustration of [subject]. Flat 2D educational diagram on a
   dark background (#0a0a0a near-black). Clean white outlines, biologically accurate
   proportions, labels in white text with thin white leader lines. [functional colours:
   green=living/photosynthetic, pink/magenta=animal soft tissue, brown/tan=dead/woody,
   blue=water, red=blood]. No photorealism, no cartoon, no mascots." Hero banners are
   painterly/atmospheric on a dark, naturalistic setting, `aspect_ratio: "16:5"`, no labels.

## Page object shape

```js
module.exports = {
  slug: 'kebab-case-slug',            // given to you
  title: 'Page Title',                 // given to you
  subtitle: 'One-line hook — what they understand after reading',
  page_number: N,                      // given to you
  page_type: 'lesson',
  tags: ['tag-one', 'the-topic'],
  glossary: [ { term: 'antheridium', definition: '1–2 plain sentences.' }, ... ],
  blocks: [ /* see below */ ],
};
```

## Block palette (every block needs `id` (uuid v4 string), `type`, `order` (0-indexed, sequential))

- **image** (hero, block 0): `{ id, type:'image', order:0, src:'', alt, caption:'', width:'full', aspect_ratio:'16:5', generation_prompt }`
- **callout**: `{ id, type:'callout', order, variant, title, markdown }` — variants: `fun_fact` (real-life hook, block 1), `remember` (must-not-get-wrong facts), `exam_tip` (NEET insight; near the end), `warning` (common mistake). exam_tip markdown format: `**Term:** explanation.` lines + a `**Classic NEET question:** "..." → answer.`
- **text**: `{ id, type:'text', order, markdown }` — bold key terms on first use.
- **heading**: `{ id, type:'heading', order, text, level:2, objective:'outcome or driving question — not "we will learn"' }`
- **image** (diagram): same as hero but `aspect_ratio:'16:9'` or `'4:3'`, a real `caption` starting `📸 `, `width:'full'`.
- **interactive_image**: `{ id, type:'interactive_image', order, src:'', alt, caption:'📸 Tap each dot to explore …', generation_prompt, hotspots:[ { id, x:0..1, y:0..1, label, detail:'markdown, 1–3 sentences', icon:'circle' }, ... ] }` — 3–8 hotspots, coordinates roughly matching where each part sits in the described diagram.
- **comparison_card**: `{ id, type:'comparison_card', order, title:'X vs Y', columns:[ { heading, points:[ 'point', ... ] }, ... ] }` — 2–4 columns. Great for the 4 fungal classes, 3 algae classes, 4 protozoan groups, dicot vs monocot, liverwort vs moss.
- **table**: `{ id, type:'table', order, caption, headers:[...], rows:[[...],...] }` — 2–5 cols. Use for NCERT Tables 2.1 / 3.1.
- **worked_example**: `{ id, type:'worked_example', order, label, variant:'solved_example', problem, solution, reveal_mode:'tap_to_reveal' }` — only if the source has a genuine worked/numerical item (rare in these chapters; usually skip).
- **reasoning_prompt** (mid-page check, after a concept): `{ id, type:'reasoning_prompt', order, reasoning_type:'logical', prompt, options:[4 strings], reveal:'why the answer is right + why the tempting wrong one is wrong', difficulty_level:2 }` — place AFTER the text that teaches what's needed. One or two per page.
- **inline_quiz** (ALWAYS the last block): `{ id, type:'inline_quiz', order, pass_threshold:0.67, questions:[ { id, question, options:[4], correct_index, explanation, difficulty_level:1|2|3 }, ... ] }` — 3–4 questions.

## Quiz / distractor rules (§3.6.1 — enforced)

Every MCQ (reasoning_prompt + inline_quiz) has exactly 4 options, all four a *real* trap a
half-prepared student could pick — each a specific NCERT-based misconception (wrong kingdom,
swapped feature, wrong example organism, wrong pigment/wall/spore). NO "all/none of the
above", no joke option, no length tell (don't make the key the long detailed one — match all
four in length/shape), no grammar tell. Explanations name why the key is right AND why the
most tempting distractor is wrong — never "option B is correct because B".

## Page flow (§4A)

hero(0) → `callout[fun_fact]`(1) → `text` core concept → `heading[2]`+`text`(+diagram/interactive_image) per sub-topic → a mid-page `reasoning_prompt` after the first big concept → (comparison_card/table where it fits) → `remember` for the must-memorise facts → `exam_tip` → `inline_quiz` (last). Keep ≤ ~16 blocks / one sub-topic. End the last `text` before the quiz with a one-line bridge to the next page.

## Reference

- Gold standard already in the DB: `scripts/build_class11_biology_ch1.js` (2 lesson pages with
  interactive_image, reasoning_prompt, exam_tip, quiz, glossary) — mirror its shapes/voice.
- Workflow: `_agents/workflows/BIOLOGY_BOOK_WORKFLOW.md` + `_agents/workflows/BOOK_PAGE_WORKFLOW.md`
  (§3 block reference, §4A template, §3.14 biology image style, §3.6.1 quiz rules, §15 experience).

Write the file to the exact path given, then report the path and a one-line summary. Do NOT
insert into the database — the orchestrator does that after validating your module.
