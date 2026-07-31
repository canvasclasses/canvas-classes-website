# Class 11 Biology Live Book — Continuity, Pedagogy & NCERT-Fidelity Audit

> Audit date **2026-07-29**. Scope: the **whole book** — `class11-biology`, 19 chapters,
> 153 pages (19 chapter openers + 134 lesson pages), 82,832 body words, 714 min of
> reading time, 535 quiz questions, 140 reasoning prompts, 1,046 glossary terms,
> 290 image blocks (766 hotspots).
>
> Method: full corpus pulled from Mongo and measured programmatically on every page,
> plus a close expert read of Ch.11 (Photosynthesis) end-to-end and of every
> `remember` / `table` block in Ch.14–17 (human physiology — the highest-risk half).
> Numeric facts were cross-checked against the **actual NCERT chapter text**
> (`scripts/bio-book/_ncert_pdfs/kebo109–119.txt`), which covers Ch.9–19.
> Per the precedent set by `CLASS12_BIO_AUDIT_2026-07-16.md`, **missing images are
> reported as a gap but not scored as a writing defect** — except where they block a
> feature that already exists.

---

## VERDICT

**The biology is right and the writing is better than I expected. Two things are
structurally wrong, and one of them is exactly the thing you flagged.**

What genuinely holds up: **factual fidelity is excellent** — of every numeric claim in
Ch.9–19, only 12 tokens had no match in the NCERT text, and on inspection all 12 are
legitimate (quiz distractors, a derived subtraction, safe general knowledge). Rule 0
demonstrably worked. Structural discipline is 100%: every one of the 134 lesson pages
carries a hook, a reasoning check, a "Lock These In", a "NEET Exam Insight", a quiz, and
a glossary — no gaps anywhere. AI-slop is negligible (19 tell-words in 82,832 words;
zero "not just X, but Y" constructions). Readability is right for the audience: mean
17.9 words/sentence, 15% polysyllabic.

**On your headline concern — page-to-page bridges — the book is in better shape than
you think, and I was wrong-footed at first.** My initial scan said 46% of transitions
had no bridge; that was a broken regex on my side. Corrected: **107 of 134 transitions
(80%) close with an explicit forward bridge.** Of the 27 that don't, **19 are the same
transition — chapter-opener → page 1, in every single chapter.** Only **6 lesson-to-lesson
pages genuinely end cold**, and all 6 sit in Ch.3–Ch.8. Ch.9–19 are 100% bridged. The
real continuity problem is elsewhere (F2, F3 below).

**The two structural failures:**

1. **The book teaches NCERT's facts in our words, almost never in NCERT's words.**
   Only **6.8%** of body prose is NCERT's own phrasing; the "Lock These In" blocks — the
   exact text a student memorises — are **2.3%**; the exam-tip blocks that say
   *"memorise this as written"* are **1.3%**. Terminology is faithful (68% of bolded key
   terms are verbatim NCERT), sentences are not. This is your stated red line, measured.

2. **Every reasoning prompt in the book asks a student to commit to an answer and then
   never tells them whether they were right.** 140 of 140. The renderer has no
   correctness verdict at all — `correct_index` isn't in the type, isn't in the Zod
   schema, and isn't read. 31 pages authored it anyway; it is silently discarded.

---

## FINDINGS (ranked by damage to the learner)

### F1 · CRITICAL · Confident · book-wide — NCERT's sentences are missing from the one place students memorise

Measured as 6-gram overlap against the real NCERT chapter text, Ch.9–19 (78 lesson pages):

| Block type | Share of wording that is NCERT's own |
|---|---|
| Body prose | **6.8%** |
| `remember` ("Lock These In") | **2.3%** |
| `exam_tip` ("NEET Exam Insight") | **1.3%** |

Bolded key terms *are* faithful — **3,670 of 5,420 (67.7%) appear verbatim in the NCERT
chapter**, and most misses are our own emphasis phrases ("Classic NEET question",
"Know the numbers cold"), not wrong biology. So: **the vocabulary is NCERT's, the
sentences are ours.**

Why this is the top finding and not a stylistic quibble: NEET lifts NCERT lines
near-verbatim and twists single words. A student who has memorised *our* cleaner sentence
meets NCERT's exact wording as a distractor and has no anchor. And it is worst precisely
where it matters most — the "Lock These In" block is the memorisation surface, and it is
97.7% our prose.

Only **45 of 135 exam-tip callouts** flag an exact NCERT line at all, though
`BIOLOGY_BOOK_WORKFLOW.md` §1 point 3 makes "exact-NCERT-line flags" a required leverage
point.

**Caveat, stated honestly:** 6-gram overlap is a strict measure and understates
paraphrase-with-same-skeleton. The direction and the magnitude gap between prose (6.8%)
and recall blocks (2.3%) are the real signal, not the absolute number.

→ **Fix:** build the `ncert_verbatim` layer (Class 12 audit F4, planned, never built).
The exact NCERT sentence shown beside our explanation. *"Our words to understand it,
NCERT's words to answer it."* Start with the `remember` blocks — convert each bullet to
NCERT's sentence, keeping our phrasing as the sub-line. This is also the one thing rivals
cannot copy, because it requires having read the PDF line by line, which we have.

---

### F2 · CRITICAL · Confirmed · book-wide (140/140) — Reasoning prompts give no correctness feedback

`ReasoningPromptRenderer.tsx` renders the options, lets the student commit, shows
*"Your answer: B"*, and auto-reveals after 300 ms — **with no indication of whether B was
right**. `correct_index` is absent from `ReasoningPromptBlock`
(`packages/data/types/books.ts:822`), absent from the Zod schema
(`packages/data/books/schemas.ts:626`), and never read by the renderer. **31 of 140
blocks carry `correct_index` anyway** — the authors expected it to work; it's dead data.

Mitigating fact, so this isn't overstated: **134 of 140 reveals do restate the correct
option strongly**, so a careful student can self-diagnose. But committing to a wrong
answer and receiving an explanation that never says *"you picked wrong"* is the weakest
form of retrieval practice — corrective feedback is what converts a failed retrieval into
learning, and 300 ms of auto-reveal doesn't create the retrieval attempt the block is
named for.

→ **Fix:** add `correct_index` to the type + Zod schema + renderer (5 wiring points),
backfill the 109 missing values, and render a right/wrong verdict before the reveal.
This is the cheapest high-impact fix in the audit — the content already exists.

---

### F3 · HIGH · Confident · 134/134 pages — The book is machine-stamped to one beat

Every single lesson page, all 134:

- opens with an `image` (134/134)
- closes with an `inline_quiz` (134/134)
- carries exactly three callouts in exactly this order — **`fun_fact` → `remember` → `exam_tip`** (131/134; the other 3 are near-misses)
- uses **three callout variants total, book-wide**. `fun_fact` ×134, `remember` ×136, `exam_tip` ×135. Nothing else.

This is the "cross-page formulaic uniformity" the review rubric names as an AI tell:
each page passes on its own, but reading five in a row feels stamped. It is also *why*
the bridges read slightly mechanically even where they exist — the same closing move
("You now know X. Next, you'll…") lands 107 times.

A second-order problem falls out of the fixed order: **the bridge paragraph sits *after*
the "Lock These In" and "NEET Exam Insight" callouts**, so the reading order is
…summary → exam tips → one lone bridge sentence → quiz. The handoff to the next page is
buried behind two blocks of assessment furniture.

→ **Fix:** vary the closing move; let some pages end on the reasoning check, some on a
comparison, some on the quiz. Move the bridge sentence to sit immediately after the last
teaching block, before the recall/exam callouts. Introduce 2–3 more callout variants
(`real_world`, `did_you_know`, `misconception`) so the rhythm isn't 1-1-1 on every page.

---

### F4 · HIGH · Confirmed · 6 real dead-stop endings (the genuine bridge gaps)

The 6 lesson pages that end cold, with no handoff — all in Ch.3–Ch.8:

| Transition | Ends on |
|---|---|
| ch3 p6 `pteridophytes-first-vascular` → p7 | "…Psilopsida (Psilotum); Lycopsida (Selaginella, Lycopodium); Sphenopsida (Equisetum); and Pteropsida…" |
| ch3 p8 `angiosperms-flowering-plants` → p9 | "…That is the classification NCERT draws here, and it is enough to place a flowering plant into its class." |
| ch4 p3 `porifera-coelenterata-and-ctenophora` → p4 | "Examples: Pleurobrachia and Ctenoplana." |
| ch4 p5 `annelida-and-arthropoda` → p6 | "And Limulus, the king crab, is a living fossil." |
| ch5 p6 `the-fruit-and-the-seed` → p7 | "…the radicle is enclosed in the coleorhiza." |
| ch8 p3 `prokaryotic-cell-structure` → p4 | "…The filament is the longest part, and it's the piece that actually extends from the cell surface to the outside." |

Every one is a **terminal enumeration** — the page runs out of list, not out of argument.

Separately: **all 19 chapter-opener → page-1 transitions have no bridge.** The opener
ends on a bullet list of objectives and page 1 opens cold on an anecdote. Nineteen
chapters, nineteen identical cold starts — this is the most repeated continuity defect in
the book, and it is the first thing a student meets in every chapter.

→ **Fix:** one closing sentence on each of the 6, and one opening line on each of the 19
openers ("NCERT starts where the confusion starts — with…"). 25 sentences total.

---

### F5 · HIGH · Confirmed · 535 questions — Quiz answer-position skew makes D nearly a dead option

| Position | A | B | C | **D** |
|---|---|---|---|---|
| Share of correct answers | 30% | 36% | 28% | **6%** |

**32 of 535 questions have D as the answer.** Six chapters have **zero** D answers
(Ch.2, 3, 13, 16, 17, 18). A student who simply never picks D loses 6% of marks and gains
a 1-in-3 guess everywhere else. Class 12's Ch.6 was flagged at 13% D and got a
book-wide rebalance; **Class 11 is half that and has never had the pass.**

**Length-tell: the correct option is uniquely the longest in 282 of 535 (53%).** Worst
chapters: Ch.10 (71%), Ch.17 (71%), Ch.11 (68%), Ch.15 (64%), Ch.9 (63%). Class 12's
pre-fix figure was 60% and triggered a founder-ordered book-wide rewrite. The tooling
already exists (`quiz_export.js` → subagent rewrite → `apply_quiz_hygiene.js`) and has
been proven twice.

Also: **explanations average 344 characters and address 1.73 of 3 distractors.** Same as
Class 12's F8 — the key plus the most tempting wrong answer, never all four.

→ **Fix:** run the existing quiz-hygiene pipeline. Deterministic round-robin to 25% each,
trim the key / fatten distractors (watch the mirror defect — don't push the key to
*shortest*), and extend explanations to all four options.

---

### F6 · HIGH · Confirmed · 228 of 1,046 glossary terms never reach a student

You asked for a hover-definition layer for hard words. **It exists and it works** —
`rehypeGlossary` + `GlossaryTerm`, wired through `PageRenderer` → `TextBlockRenderer`.
But it only fires inside **`text` blocks**, and terms have to match the prose exactly.
Result:

| | Count | |
|---|---|---|
| Authored | 1,046 | |
| **Render today** | **818** | **78%** |
| Would render if the matcher also tried the term without its parenthetical | +70 | e.g. `tidal volume (TV)`, `vasopressin (ADH)`, `M phase (mitotic phase)` |
| Would render if the matcher also ran on tables / comparison cards / hotspots | +84 | e.g. `PCT`, `DCT`, `bacillus`, `coccus`, `sepal`, `petal` |
| Would render with simple inflection matching (plural, `-ic`, `-al`) | +49 | `prokaryote`/prokaryotic, `autotroph`/autotrophic, `rhizoid`/rhizoids |
| **Genuinely absent from the page** | **25** | mostly slash-form entries: `reducing / non-reducing end`, `Rh positive / Rh negative`, `adaxial / abaxial epidermis` |

The pattern is diagnostic and slightly perverse: **the terms most likely to be dead are
the ones a student most needs hovered** — the ones that live in a comparison table or on
a diagram hotspot, which is exactly where dense terminology gets parked.

→ **Fix:** three small matcher changes (strip parentheticals, run on
`comparison_card` points / `table` cells / hotspot `detail`, add plural+adjective
inflection) take coverage **78% → 98%** with no new content authored. Split the 25
slash-form entries into two entries each.

---

### F7 · HIGH · Confirmed · Ch.15–19 — Five chapters have zero images, and they are the diagram chapters

| | interactive_image blocks | with an image | hotspots authored | hotspots a student can use |
|---|---|---|---|---|
| Book | 134 | 102 | 766 | 560 |

**Ch.15 (15/15), Ch.16 (15/15), Ch.17 (13/13), Ch.18 (11/11), Ch.19 (15/15) are 100%
unillustrated** — 69 image blocks with `src: ''`. These are Body Fluids & Circulation,
Excretory, Locomotion, Neural, Chemical Coordination: the heart, the nephron, the
sarcomere, the neuron, the endocrine glands. **The five most diagram-dependent chapters
in NCERT Class 11 Biology are the five with no diagrams**, and ~206 authored hotspots sit
inert behind them. Any hotspot/label drill built on `interactive_image` is dark for
those chapters until the images land.

→ **Fix:** these five chapters are the highest-return image batch in the book. Prompts
were already swept clean of the leader-line defect on 2026-07-16, so the pipeline should
run without the earlier rework.

---

### F8 · MED · Confirmed · Ch.14 `exchange-of-gases` — a "Lock These In" block that contradicts itself

The body prose is careful and correct:
> *"That blood (now deoxygenated, pCO2 **45**) reaches the alveoli, where pCO2 is **40**"*

The `remember` callout compresses it into:
> *"**CO2 gradient:** tissues **45** → blood **40** → alveoli **40**"*
> *"…that's why its tiny **5 mm Hg** gradient still moves plenty of gas"*

**40 → 40 is a zero gradient.** The bullet contradicts the bullet directly below it, and
the 5 mm Hg it cites (45 − 40) is nowhere in the chain as written. The O2 line has the
same flaw — *"alveoli 104 → blood 40 → tissues 40"* drops the oxygenated-blood value of
95, so it also reads as blood and tissue at the same pressure.

This is a single confirmed instance, but it names a **class** of risk worth a targeted
sweep: the `remember` blocks are compressions of prose the same agent just wrote, and
compression is where a correct explanation quietly becomes a wrong one — in the exact
block a student memorises. Everything else I checked in Ch.14–17 against NCERT was
correct (Table 14.1 values, lung volumes and capacities, WBC percentages, ABO table,
cardiac cycle 0.8 s / 70 mL / 5 L, GFR 125 mL/min = 180 L/day, 300 → 1200 mOsmol/L,
axial 80 of 206, vertebrae 7/12/5/1/1, sarcomere bands, joint types).

→ **Fix:** correct these two bullets, then re-derive every numeric chain in all 136
`remember` blocks against its own page prose.

---

### F9 · MED · Confident · book-wide — No NCERT exercises, no chapter recap, no revision artifact

`page_type` across all 153 pages is only `chapter_opener` (19) and `lesson` (134).
**Zero `practice_bank` pages, zero recap pages** — while Class 12 Biology now ends every
one of its 13 chapters with a verbatim-NCERT exercises page (179 exercises) and has a
recap pilot. NCERT itself ends every chapter with SUMMARY and EXERCISES; CBSE draws from
them and NEET students drill them.

Pages average 5–6 minutes of reading (714 min total). **There is nothing in this book a
student can revise in the final 60 days**, which is when NEET Biology is actually won.

→ **Fix:** the `practice_bank` block type already exists and is proven on Class 12.
Port the pattern: one NCERT-exercises page per chapter, plus a ≤5-minute recall card.

---

### F10 · MED · Confident · book-wide — 11 of ~40 available block types are in use

Class 11 Biology uses: `text`, `heading`, `image`, `interactive_image`, `callout`,
`table`, `comparison_card`, `inline_quiz`, `reasoning_prompt`, `simulation` (19),
`worked_example` (3). **Everything else in the renderer is unused**, including several
built for exactly this subject:

| Block (already built) | Used | Where it belongs in this book |
|---|---|---|
| `classify_exercise` | **0** | The single best fit in the whole catalogue: sort organisms into kingdoms/phyla, hormones to glands, volumes vs capacities, ammonotelic/ureotelic/uricotelic, C3 vs C4 |
| `timeline` | **0** | Glycolysis → link → Krebs → ETS; mitosis and meiosis stages; urine formation; the cardiac cycle; the climb onto land |
| `mind_map` | **0** | Chapter recap (proven on Class 12 Ch.1) |
| `practice_bank` | **0** | NCERT exercises — see F9 |
| `meet_a_scientist` | **0** | Whittaker, Calvin, Krebs, Priestley, Ingenhousz, Robert Brown, Virchow, Singer & Nicolson — the chapters already tell these stories in plain prose |
| `gallery`, `video`, `audio_note`, `curiosity_prompt`, `you_solve_it` | **0** | — |

Only **3 worked examples** in the whole book, though the genuinely numerical NEET topics
are all here: the Calvin cycle ATP/NADPH budget, the 38-ATP balance sheet, respiratory
quotient, lung capacities, cardiac output, GFR.

→ **Fix, in order of return:** `classify_exercise` drills on the classification-heavy
chapters (2, 3, 4, 5) where rote load is highest → `timeline` on the process chapters
(10, 11, 12, 15, 16) → `practice_bank` everywhere → `mind_map` recap.

---

### F11 · LOW · Confirmed · 148 sentences — Long sentences break the "simple language" bar

Overall readability is good (mean **17.9** words/sentence, median 17, p90 29, 15%
polysyllabic — right for a second-language Class 11 reader). But **148 sentences run over
35 words (3.3%)**, and the tail is extreme:

- **106 words** — ch8 `chromatin-chromosomes-and-microbodies` ("Now you can actually walk through one: a membrane, and in plants a wall, holding the boundary; an endomembrane system of ER, Golgi, lysosomes, and vac…")
- 67w ch8 `what-is-a-cell-and-cell-theory` · 62w ch2 `kingdom-fungi-features` · 59w ch12 `amphibolic-pathway-and-respiratory-quotient` · 57w ch8 `centrosome-and-the-nucleus`

Also **27 paragraphs exceed 120 words** (longest: 203), against a 40–80 word target for
this audience (Mayer's segmenting principle).

→ **Fix:** split the 148. Mechanical, one pass.

---

### F12 · LOW · Confirmed · book-wide — AI-tells, negligible density

19 hits across 82,832 words: `isn't just` ×11, `crucial` ×3, `is not just` ×2,
`the secret` ×2, `intricate` ×1, `here's the thing` ×1. **Zero** "not just X, but Y"
constructions. This is a cleanup, not a rewrite — and it's genuinely good discipline.

---

### F13 · STRATEGIC · book-wide — 0/153 Hinglish twins

Class 12 Chemistry Ch.2 is 29/30. Biology, the subject worth half the NEET paper for
exactly the tier-2/3 student the Hinglish layer was built for, has none in either class.
A standing decision, not a bug — but it should be a conscious one.

---

## WHAT I COULD NOT CHECK (blind spots — stated so they aren't mistaken for clean)

- **NCERT text for Ch.1–8 is not in the repo** (`_ncert_pdfs` holds kebo109–119 only).
  All fidelity measurements — numeric, verbatim-overlap, bolded-term — cover **Ch.9–19
  only**. Ch.1–8 fidelity is unverified against source.
- **Hotspot semantic placement in Ch.5–19 is unverified.** Ch.1–4 had a manual
  visual-semantic pass; Ch.5–14's images exist but have had only the pixel gate, which
  the Class 11 history already proved insufficient. Ch.15–19 have no images at all.
- **No live rendering check.** Per §5.2 I did not start a preview server. The glossary
  and reasoning-prompt findings are from reading the renderer source, not from clicking
  in a browser — they are code-level facts, but the UX around them is unobserved.
- **The 3 worked examples' internal maths** — I read shapes, not verified derivations.
- **The 19 embedded 3D sims** — placement was checked, teaching value was not.
- **F8-class errors elsewhere.** I read every `remember`/`table` block in Ch.14–17 and
  all of Ch.11 closely. Ch.1–10, 18, 19 recall blocks had a lighter pass; the Ch.14
  gradient defect is the kind of thing that only a close read finds, so **assume more
  exist until the sweep in F8 is run.**

---

## RECOMMENDED ORDER OF WORK

1. **F2 reasoning-prompt verdict** — 5 wiring points + backfill 109 values. Days. Fixes the book's most-used interactive block.
2. **F6 glossary matcher** — three small changes, 78% → 98%, zero new content. Days. This is your hover feature, already paid for.
3. **F5 quiz hygiene** — pipeline exists and is twice-proven. Days.
4. **F4 the 25 bridge sentences** (6 dead stops + 19 chapter openers). Hours.
5. **F8 recall-block sweep** — re-derive every numeric chain in 136 `remember` blocks.
6. **F1 the `ncert_verbatim` layer** — the deepest fix and the real differentiator. Start with `remember` blocks. Weeks.
7. **F7 images for Ch.15–19** — unlocks ~206 inert hotspots.
8. **F9 + F10** — `practice_bank` exercises, then `classify_exercise` and `timeline`.
9. **F3 rhythm** and **F11 long sentences** — fold into whichever authoring pass touches a page next.
