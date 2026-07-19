# Live Books — The Learning Layer (plan)

> Born 2026-07-16 out of the Class 12 Biology publication audit
> ([`CLASS12_BIO_AUDIT_2026-07-16.md`](../reviews/CLASS12_BIO_AUDIT_2026-07-16.md)).
> Covers the founder's decisions: chapter summaries, NCERT exercises, NCERT-verbatim +
> hover definitions, highlighter, PYQ tagging, mindmaps, flashcards + spaced repetition.
>
> **Positioning rule (founder, 2026-07-16):** we sell **quality learning, not ranks**. We are not
> targeting PW's customer base and PW is **not** our quality benchmark. No FOMO/scarcity mechanics.
> Benchmark against the global gold standards and the learning science instead.

---

## 0. The organising principle (this is the whole doc in one idea)

The strongest finding in the research is uncomfortable for a beautiful textbook:

> Dunlosky et al. (2013) reviewed ten study techniques and rated **exactly two as high-utility:
> practice testing and distributed practice.** They rated **summarising, highlighting and
> rereading LOW.** Roediger & Karpicke showed students *default to rereading* and cannot
> self-assess — the **"illusion of competence."**

So every feature below is designed to the same rule:

**Anything a student merely READS is low-utility. Anything that makes them RETRIEVE is high-utility.**
A summary you read is worth little. A summary that makes you recall is worth a lot. Same content,
opposite value. This is why "chapter summary" below is *not* a summary.

---

## 1. Why we have a glossary nobody sees (answering the founder's question)

**Facts, measured 2026-07-16:**

| Book | Pages | Pages with glossary | Terms |
|---|---|---|---|
| class11-biology | 153 | 134 | **1,046** |
| class12-biology | 108 | 108 | **708** |
| ncert-simplified (Chem 11) | 143 | 0 | **0** |
| ncert-simplified-12 (Chem 12) | 102 | 0 | 0 |
| *all other 8 books* | — | 0 | 0 |

**Answer: no, Chemistry 11 has never used glossary. Nothing has.** `glossary` is a **biology-only
orphan**: it was invented by the Class 11 Biology page-module contract
(`scripts/bio-book/PAGE_MODULE_CONTRACT.md`), which required a per-page glossary; the Class 12
contract copied it. **1,754 terms have been authored across the two Bio books and no renderer has
ever consumed them.** `glossary` is not in `packages/data/types/books.ts` and not in the Zod schema —
it survives only because it rides along on the page document.

**This is a process bug worth naming:** the page contract mandated a field that no one had built a
home for, and nothing in the pipeline noticed for two books. **Fix the pipeline too:** the Zod
validator should fail a module that carries a field the renderer cannot display.

**The good news:** this is the cheapest big win available. The content is already written and paid
for. Building hover-definitions (§4) turns 1,754 dead terms into a live feature in days.

---

## 2. Chapter summary — better ways than summary paragraphs

**We already have a gold model in-house:** `ncert-simplified-12` Ch.5 **"Chapter Recap & Exam
Decoder"** (20 blocks) — and notably it contains **almost no prose**. It is: the colour key table,
the magnetic-moment ladder, the oxidation-state map, an exceptions list, a "🔍 Decode This" skill
box, a Quick Recap callout, and a 6-question quiz. That is the shape to copy.

**Biology needs a different spine from Chemistry.** Chemistry recaps around *tables of values*;
Biology chapters are **processes and classifications**. So the Bio recap is built from six devices,
ranked by learning value:

| # | Device | Why it beats a paragraph |
|---|---|---|
| 1 | **Skeleton mindmap** (§7) — the whole chapter as one branching map, **blanked first, revealed on tap** | Retrieval, not reading. Also auto-becomes a Label Sprint. |
| 2 | **The process spine** — the chapter in ≤10 numbered steps (Ch.1: anther→pollen · ovule→embryo sac · pollination · double fertilisation · seed & fruit) | Biology is mostly sequence; a spine is the actual structure |
| 3 | **"Numbers you must not blur"** table — 7-celled/8-nucleate, zygote 2n vs PEN 3n, Z = 0.1–0.2 vs 0.6–1.2, the 10% law, 34 hotspots | The exact facts NEET turns on, in one place |
| 4 | **The matching sets** — the NEET-heavy tables (six interaction sign-pairs, in situ vs ex situ, ZIFT/GIFT/IUT, microbe→product) | These *are* the exam questions |
| 5 | **"🔍 Decode This"** — how an NCERT line becomes an exam question | The transferable skill; proven in the Chem model |
| 6 | **Self-check prompts** — "cover this and state the five steps of decomposition" | Explicit retrieval practice |

**Hard design rules for the recap page:**
- **No summary paragraph.** If a block can be passively read start-to-finish, it does not belong.
- **Blank-first.** Default state hides the answer; the student recalls, then reveals.
- **≤5 minutes.** The sourced revision benchmark is *"if biology notes take 20 minutes to revise,
  they are too long."* Our lesson pages are 4–11 min each — the recap must be the **fast** artifact.
- New `page_type: 'chapter_recap'`, placed **last** in each chapter.

---

## 3. NCERT exercises — we HAVE done this before

**The founder's memory is correct.** Precedent found:

- `ncert-simplified-12` ch5 p16 — **"Practice — NCERT Exercises"** — *"All 38 NCERT textbook
  exercises (8.1–8.38), reorganised from the textbook's running order into five revision themes."*
- Also `ncert-simplified` (2 pages) and 3 more pages in Chem 12.
- `class9-mathematics` integrates NCERT Exercise Sets inline (ch1 p5/p7/p8, ch2 p14/p18).

**The mechanism already exists and ships:** the **`practice_bank`** block —
`packages/data/books/schemas.ts:537–571`, renderer `packages/book-renderer/blocks/PracticeBankRenderer.tsx`.

```
practice_bank { title, intro, sections[] }
  section { id, title, blurb, items[] }
    item (kind: 'mcq')       { id, source, source_label, prompt, options[], correct_index, explanation }
    item (kind: 'numerical') { id, source, source_label, prompt, answer?, solution }
  source ∈ 'ncert_exercise' | 'ncert_exemplar' | 'cbse_pyq' | 'jee_neet' | 'mcq'
```

**Note the source enum already includes `cbse_pyq` and `jee_neet` — the PYQ foundation is built.**

### The plan for Biology
1. One **"Practice — NCERT Exercises"** page per chapter (13 pages), `practice_bank` block.
2. Pull items from the **EXERCISES** section of each `lebo1NN.txt` (already downloaded; verified
   present in every chapter).
3. **Regroup into revision themes, not NCERT's running order** — this is the value-add the Chem
   page proved (38 exercises → 5 themes).
4. **Every item gets a full worked solution, not just an answer.** Per the UWorld principle: the
   explanation *is* the product.
5. Tag `source: 'ncert_exercise'`, `source_label: 'NCERT 3.4'`.

**One open question:** NCERT Biology exercises are almost entirely **descriptive** short/long answer,
not numerical. The schema's two kinds are `mcq` and `numerical`. `numerical` is structurally right
(prompt + optional answer + required solution) but the *name* is wrong for Bio.
→ **Decide before building:** reuse `numerical` (zero schema/renderer change) vs add
`kind: 'descriptive'`. **Recommendation: reuse `numerical` for v1** unless the kind string is
surfaced in the UI — check `PracticeBankRenderer.tsx` first. Don't block the content on a rename.

---

## 4. NCERT verbatim + hover definitions

### 4a. The NCERT-verbatim layer (the differentiator)
**The problem this solves** (audit F4): 70–95% of NEET Bio questions come near-verbatim from NCERT
and examiners twist single words — **but our contract has us re-explaining NCERT in our own words.**
A student learns our better paraphrase and meets NCERT's exact sentence in the exam.

**The fix — do both, side by side:**
> **Our words to understand it. NCERT's words to answer it.**

**Build:** a new callout variant **`ncert_verbatim`** (smallest possible change — the callout block
and renderer already exist; this is a variant + a style).
```
callout { variant: 'ncert_verbatim', title: 'What NCERT actually says',
          markdown: '<the exact NCERT sentence, unaltered>',
          source_ref: 'NCERT XII Bio §1.2.1' }
```
Rendered as a visually distinct "this is the exam's own wording" box, placed immediately after our
explanation of that idea. Rule: **verbatim text is never edited, never simplified, never
paraphrased** — that's the entire point. It is quoted, attributed, and short (a sentence or two).

*Copyright note:* short attributed quotations of the specific examinable line are the intent. Keep
each quote to the sentence(s) at issue — do **not** reproduce whole NCERT sections.

### 4b. Hover definitions — ✅ BUILT 2026-07-16

**Shipped.** `glossary` is now in the `BookPage` type; `packages/book-renderer/glossary-context.tsx`
holds the context, the `rehypeGlossary` matcher and the `GlossaryTerm` popover; `PageRenderer`
injects `page.glossary`; `TextBlockRenderer` consumes it. Both apps typecheck and build clean.

**Measured against real content:** 108 Class 12 Bio pages, **529 of 708 terms (75%) match their
page's prose** and now render a dotted-underline term with a hover/tap definition. KaTeX intact on
4/4 LaTeX pages.

**Design decisions worth keeping:**
- **A rehype plugin, not string-replacement on markdown.** Our prose is full of `$LaTeX$`, `\ce{}`,
  links and image syntax; replacing on the raw source would corrupt a term appearing inside a URL or
  a formula. Running on the parsed tree means we only see real rendered text, and `code`/`pre`/`a`/
  `katex*` subtrees are skipped explicitly.
- **First occurrence only.** Underlining every "pollen" turns prose into noise.
- **Longest term wins** — "pollen tube" beats "pollen".
- **Empty glossary = the plugin isn't added at all** → a true no-op for the 10 books with no glossary.

**THREE bugs were found, each by a different kind of check — this is the lesson:**

1. **Only one term per sentence** — caught by a *headless unit test*. The matcher resumed *past* the
   trailing text node after a match, so "pollen tube" following "sporopollenin" was silently dropped.
   A build would never have caught it.
2. **The admin preview showed nothing at all** — caught by *opening the browser*. `BookWorkspace`
   builds a page **literal** (`page={{ title, subtitle, blocks, ... }}`) rather than passing
   `currentPage` through, so `glossary` was simply absent. Typecheck passed, build passed, 529 terms
   matched in a headless run — and a real user would have seen **zero**. Only looking at the screen
   found it. *(Rule: any page-level field the renderer reads must be added to that literal too.)*
3. **The feature was dead on mobile** — caught by a *real browser click*. The naive
   `onMouseEnter → open` + `onClick → toggle` breaks on touch, because mobile browsers fire a
   compatibility `mouseenter` immediately before `click`: the tap opened the card and the click shut
   it again, netting out to nothing. Verified the live event order is
   `pointerenter → mouseenter → pointerdown → mousedown → mouseup → click`.
   **Fixed** by gating hover to `pointerType === 'mouse'` and only toggling on click for non-mouse
   input, plus `onFocus`/`onBlur` for keyboard. All three paths re-verified in the browser:
   mouse hover ✓ · touch tap ✓ · keyboard focus ✓.

**The meta-lesson: "it compiles" and "the unit test passes" both said SHIPPED while the feature was
invisible to every real user and dead on every phone.** For anything a student touches, open the
browser and click it.

**Two follow-ups:**
1. **179 terms (25%) are orphans** — authored but never appearing in their own page's prose (e.g.
   `anemophily` is glossed while the text says "pollination by wind"). Harmless (they just don't
   render) but it means a quarter of the authoring effort still reaches nobody. Either use the term
   in the prose or drop it from the glossary. Worth a pass.
2. **Add `glossary` to the Zod schema + make the validator reject page fields the renderer can't
   display** — that gate is what would have caught this in month one.

---

### 4b-original. Why this was the cheapest win
**We had 1,754 authored terms and no feature.**

- Add `glossary` to `packages/data/types/books.ts` + the Zod schema (**it is currently in neither** —
  that is how it went unnoticed).
- Renderer: post-process `text` block markdown; wrap the **first occurrence** of each glossary term
  in a `<GlossaryTerm>` that shows a hover (desktop) / tap (mobile) popover with the definition.
- Reuse the popover pattern already built for `interactive_image` hotspots (point-anchored popover —
  the fix from the 2026-07-12 hotspot work).
- **Why this is high-leverage:** for a terminology-dense subject read by second-language students,
  a zero-navigation-cost lookup is simultaneously a **comprehension**, an **accessibility**, and a
  **localisation** feature. AMBOSS's hover-library is exactly this and it's a core reason students
  rate it above textbooks.
- Backfill Chemistry/other books' glossaries later — Bio is already sitting on 1,754 terms.

---

## 5. Highlighter (multicolour, like a paper book)

**Founder priority: after the test series ships.**

**The one hard problem: anchoring.** Naive character offsets break the moment a page is edited — and
our pages *will* be edited (this audit alone is rewriting 228 quiz questions). Do not store offsets.

**Use the W3C Web Annotation "text quote selector" pattern:**
```
book_highlights {
  _id, user_id, book_id, page_id, block_id,
  quote:  "<the exact highlighted text>",
  prefix: "<~32 chars before>",   // disambiguates repeated phrases
  suffix: "<~32 chars after>",
  color:  'yellow' | 'green' | 'blue' | 'pink',
  note:   "<optional student note>",
  created_at, updated_at
}
```
Re-anchor on load by searching `block_id` for `prefix+quote+suffix`. If the text is gone (edited
away), mark the highlight **orphaned** rather than deleting it — never silently destroy a student's
work (the §0.6 content-protection instinct, applied to student data).

**Make it a study tool, not a decoration.** A highlight that just sits on the page is **low-utility**
(Dunlosky rates highlighting LOW). It becomes high-utility when it feeds retrieval:
- **"My highlights"** review view, per chapter.
- **One-tap: turn a highlight into a flashcard** (§8). This is the whole point — it converts the
  student's own judgment of "this matters" into scheduled retrieval.
- Colour semantics the student chooses (e.g. yellow = important, pink = I got this wrong,
  blue = ask a teacher) — surface them as filters, don't dictate meaning.

---

## 6. PYQ tagging — per line

**Founder sequencing: after the Biology PYQ bank is built.** Two different granularities:

**(a) At the question level — already supported, zero work.** `practice_bank` items take
`source: 'cbse_pyq' | 'jee_neet'` + `source_label: 'NEET 2023'`. Use it the day the bank exists.

**(b) At the LINE level — the founder's actual ask, and the differentiator.** *"This exact NCERT
line was asked in NEET 2019 and 2023."* That is the NCERT-line-by-line phenomenon, productised.

**Do not put this in the block.** Tagging lines inside `blocks[]` means every PYQ re-tag rewrites the
page and churns version history. Use a **side index**:
```
pyq_line_refs {
  _id, book_id, page_id, block_id,
  quote, prefix, suffix,        // same anchoring as highlights — build once, use twice
  pyq_ids: [ ... ],             // → the PYQ bank
  exams: [ { exam: 'NEET_UG', year: 2023 }, ... ]
}
```
Renderer draws a small badge on the anchored line: `NEET '19 · '23`. Tap → the actual PYQs.
**Content and tags stay decoupled** — re-tag freely without touching the book.

**Note the reuse:** the highlighter (§5) and PYQ line-tagging (§6b) need *the same* text-anchoring
primitive. **Build it once, deliberately, and both features get cheap.**

---

## 7. Mindmaps

**Recommendation: do NOT build a new mindmap block type for v1.**

A mindmap *is* a labelled diagram. We already have `interactive_image` with tap-to-reveal hotspots,
a proven renderer, a hotspot-placement gate, and **automatic Label Sprint activation** from any
published interactive_image with ≥3 hotspots.

So: **author mindmaps as `interactive_image`.** For free, you get:
- image + tap-to-reveal nodes,
- **the blank-node recall drill** (Label Sprint) — i.e. the mindmap is a *retrieval* instrument on
  day one, not a poster,
- zero new renderer, zero new schema.

Put one **skeleton mindmap** at the top of each `chapter_recap` page (§2, device #1).

**When to build a real `mindmap` block:** only if we need auto-layout, zoom/pan on 30+ nodes, or
student-editable maps. Revisit after the recap pages ship. (Student-*made* mindmaps would be
genuinely high-utility — generative work beats consuming a given map — but that's a v2 conversation.)

---

## 8. Flashcards + spaced repetition (the biggest lever)

**This is the single best-evidenced intervention available to us, and it fits NEET Biology exactly.**
- 2025 systematic review/meta-analysis in medical education: **pooled SMD ≈ 0.78** on objective
  assessments.
- Heavy Anki users beat minimal users by **4–13 points on USMLE Step 1**, with a **dose-response**
  on cards reviewed.
- **The critical detail:** that advantage holds for **Step 1 (factual recall)** and **not Step 2 CK
  (clinical application)**. **NEET Biology is a Step-1-shaped exam** — 90 questions of precision
  recall over NCERT. This is the mechanism aimed at our exact target.
- Caveat to hold honestly: the evidence is **largely observational**. SRS will move factual recall;
  it will **not** substitute for reasoning instruction. Don't let it become the whole strategy.

### The unfair advantage: we don't author the deck — we already own it
Cards seed automatically from content that **already exists**:

| Source (already in the DB) | Card shape | Volume (Class 12 Bio) |
|---|---|---|
| `glossary` terms | term → definition (both directions) | **708** |
| `interactive_image` hotspots | diagram with one label blanked → name it | **420** |
| `comparison_card` columns | "X vs Y: give the difference" | 30 cards |
| `callout[remember]` | the must-not-blur facts | ~95 |
| `table` rows | matching sets (microbe→product, disorder→pattern) | 26 tables |
| student highlights (§5) | student-chosen → cloze | user-generated |

**That is a ~1,200-card Class 12 Biology deck derivable today, with no new authoring** — plus ~1,046
more glossary cards from Class 11 Bio.

### Scheduler
- Use **FSRS** (modern, open, better-calibrated than SM-2). Don't invent an algorithm.
- Per-user card state (`due_at`, `stability`, `difficulty`, `lapses`, `last_rating`).
- **Cross-chapter and cross-session** — the engine decides *what to show today*. That is the whole
  point and the thing a book cannot do: **the book has no memory of the student.**
- The diagram cards **are** Label Sprint rounds — same engine, same content, one loop.

### Sequencing note
This is the **biggest build** in this doc and it depends on nothing else. But cards get much better
once (a) images exist (diagram cards need pictures) and (b) glossary ships (§4b). So: **glossary
first, images next, SRS after** — by which time the deck seeds itself.

---

## 9. Recommended order

| # | Item | Why here | Size |
|---|---|---|---|
| 1 | **Quiz length-tell fix** (audit F1) | Repairs our only high-utility mechanism; pipeline exists | ✅ in progress |
| 2 | **Ch.6 bridge fix** (F6) | One sentence | ✅ done |
| 3 | **Hover glossary** (§4b) | 1,754 terms already paid for, reaching nobody | Days |
| 4 | **Text-anchoring primitive** (§5/§6b) | Build once — highlighter AND PYQ line-tags both need it | Days |
| 5 | **`chapter_recap` pages** (§2) + **mindmaps as interactive_image** (§7) | The missing section; retrieval-shaped | Weeks |
| 6 | **NCERT exercises** via `practice_bank` (§3) | Mechanism already ships | Weeks |
| 7 | **`ncert_verbatim` callout** (§4a) | The differentiator; small change | Weeks |
| 8 | **Images pass** → Label Sprints light up | Unblocks diagram recall cards | (existing plan) |
| 9 | **Highlighter** (§5) | Founder: after test series | — |
| 10 | **PYQ line-tagging** (§6b) | Founder: after PYQ bank | — |
| 11 | **Flashcards + FSRS** (§8) | Biggest lever, biggest build; deck seeds itself by now | Quarter |

**Cross-cutting, decide early (retrofits are brutal):** localisation architecture (गंगा is live and
Bio is 0/108 Hinglish) and **WCAG 2.2 AA + a published VPAT** — now a procurement gate for
international schools, not a nicety.
