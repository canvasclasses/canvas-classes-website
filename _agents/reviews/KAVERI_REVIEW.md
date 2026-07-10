# Kaveri (Class 9 English) — Content Review

**Scope:** all 141 pages / 9 chapters, every block, graded against source NCERT PDFs + the canonical quality bars. Read-only; no content changed.
**Method:** mechanical scan (all pages) + one expert reviewer per chapter reading the source PDF first, then the full chapter. Highest-stakes CRITICALs spot-verified by hand against the PDF.

**Severity tally:** 🔴 CRITICAL ≈13 · 🟠 MAJOR ≈58 · 🟡 MINOR ≈131. Per-chapter detail in `kaveri/chNN-findings.md`.

> Headline: the book is **genuinely good** — the literary text itself is mostly reproduced verbatim, quiz answer-positions are well balanced (no A/B/C/D bias), device labelling is mostly correct, and the scaffolding is real. The gap between *good* and *great* lives almost entirely in the **authored commentary and the assessment layer**, not in the source text the student reads. The defects below are the ones invisible on a casual read.

---

## The 9 systemic patterns (these matter more than any single finding)

### 1. 🔴 Narrated passages are silently edited — the one block type forbidden from rewriting
The workflow forbids altering the original text inside `narrated_passage`. Two chapters break this:
- **Ch7** (`unit-7-reading-part-1`): condenses *"the mail transferred from the mail train onto buses before being hefted onto his shoulders is delivered…"* → *"the mail is delivered…"* and drops the whole sentence *"Often, the impression of his footprints reveals the weight of his mailbag."*
- **Ch8** (`unit-8-reading-part-2`): drops *"To fulfil them you will need to negotiate a path through a maze of hurdles… participants in your dreamscape would be many more."* — **then defines and quizzes "dreamscape" 8× later**, testing a word the student was never shown. *(Verified against PDF + corpus.)*

This is the single most serious finding: it's invisible (the page looks complete), it corrupts the primary text, and in Ch8 it breaks the assessment built on it.

### 2. 🔴 AI confidently adds "facts" not in the source (bios + callouts)
A consistent pattern of external/invented detail presented as fact:
- **Ch1**: Triveni's age at death given as **35** (she died at **34**); an invented "Sudha Murty said in interviews that Triveni's voice taught her own grandmother…" quote.
- **Ch6**: Mitra Phukan bio invents "b. 1950s" + book attributions; comparison_card says Nabin is *"moved to tears of pride"* — **PDF says "claps furiously… an expression of pride"** (no tears). *(Verified.)*
- **Ch5**: callout adds *"Murlikant Petkar (India's first Paralympic gold, 1972)"* — source says only "first medal… in swimming," no gold, no name.
- **Ch8**: *"supported by real research"* attached to the ten-year rule (the letter makes no such claim); author's nationality "Singaporean" stated though source never says.

These are externally-plausible, which is exactly why a teacher won't catch them — they read true.

### 3. 🟠 Quiz items with a defensible second answer (mis-marks the *thinking* student)
The most damaging assessment defect — a careful student is marked wrong:
- **Ch3**: collocation items mark *"have a seat"* and *"take responsibility"* wrong while the explanations themselves admit both are correct.
- **Ch5**: fact/opinion item marks *"two facts"* wrong though "I feel it was a personal victory" is defensibly a factual report of a feeling; "biggest challenge" keyed though source says "*one of the* significant challenges."
- **Ch4**: "central message" MCQs flatten the chapter's own "both are true" stance into one key.

### 4. 🔴/🟠 Outright broken items
- **Ch6** (`90fd4a52`): all four options are *questions*, not answers.
- **Ch8** (`ch8-pr-09`): stem quotes the "prospect of success" sentence but asks the meaning of "buoyed up" (a different sentence) — evidence doesn't match the question.
- **Ch9**: both assertion–reason items render with **no option list** (only `correct_index`), and one reverses cause/effect — A-R is the CBSE format most likely to mislead a student who actually knows it.

### 5. 🟠 Distractor weakness → quizzes gameable without reading
Chapter-wide: the correct option is frequently the only sensible / most-complete / longest one, with padded throwaway distractors ("a brand-new pottery factory has opened," "an infant has just been born"). A test-wise student passes by tone and elimination. (Note: the *mechanical* length-tell is only 20% book-wide, so this is concentrated in specific items, not universal — but real where it occurs.)

### 6. 🟡 Cross-page formulaic uniformity (the meta AI-tell)
Every chapter runs the identical page beat (banner → 1-line framing → reading block → reasoning_prompt with a long "reveal" → 3-Q quiz at difficulty 1/2/3), and each chapter recycles its central insight 3–4× in near-identical prose ("show don't tell" ×4 in Ch1; violin-from-Europe ×3 in Ch6; "three Indian masters, one tender subject" ×3 in Ch4). Each page passes alone; the chapter reads machine-stamped end to end.

### 7. 🟡 AI-slop prose tells
- **Em-dashes: 2,987 across the book; 528 blocks with ≥2** (workflow cap = 1/paragraph). This is the loudest fingerprint.
- Banned vocabulary: **vibrant ×23, intricate ×19, myriad ×17** — and "vibrant" is *taught as a model good word* in Ch3 & Ch4, directly against the banned-tell list and the chapter's own "show, don't tell" advice.
- Reveal-framing cadence ("the honest answer is both yes and no," "Both are true — because…") repeated as a structural beat; occasional patronising closers ("Imagine how much was lost," "That is a beautiful note to end on").

### 8. 🟡 Advertised-but-dead audio
Many `narrated_passage` blocks say *"Tap any line to hear it"* while every `audio_url` is empty (human audio not yet recorded). Known/pre-launch — but the UI copy promises a feature that silently does nothing today.

### 9. 🟡 Shipping artifacts + dropped NCERT exercises
- Encoding corruption in Hinglish commentary: `तूलika`, `जलीय ghaas` (Ch3), a stray Arabic-script fragment (Ch2), and the template leak **`wop_maker_`** (Ch2) — all student-facing. *(Verified.)*
- NCERT exercises omitted: prepositions + reported-speech (Ch4), listening/yazh + stress-intonation (Ch6), the second poem "Always Believe in Yourself" (Ch8).

---

## What is genuinely strong (so it isn't "fixed" away)
- Source text inside narrated_passage is **verbatim** in 7 of 9 chapters.
- Quiz **answer-position is clean** (A/B/C/D = 24.8/25.6/24.1/25.6%) — no position bias.
- Literary-device labelling is **correct** in almost every chapter (one slip in Ch6).
- Author bios in Ch2/Ch4/Ch7 check out against record.
- CBSE format coverage (assertion-reason, fact/opinion, inference, collocations) is present and mostly faithful.

## Recommended priority order for fixing
1. Restore the edited/dropped narrated-passage text (Ch7, Ch8) — content integrity. *(then re-validate Ch8's dreamscape quiz)*
2. Correct or remove the fabricated facts (Ch1 age + quote, Ch5 Petkar, Ch6 Phukan + "tears," Ch8 "research"/"Singaporean").
3. Fix the broken/ambiguous quiz items (Ch3 collocations, Ch4/Ch5 single-key items, Ch6 all-questions, Ch8 pr-09, Ch9 A-R).
4. De-slop pass: cut em-dashes to ≤1/paragraph, remove banned vocab (stop teaching "vibrant"), break the recycled reveal cadence.
5. Clean shipping artifacts (`wop_maker_`, encoding corruption); decide on the "tap to hear" copy until audio ships.
