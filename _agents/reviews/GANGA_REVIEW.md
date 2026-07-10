# गंगा (Class 9 Hindi) — Content Review

**Scope:** all 108 pages / 13 chapters, every block, graded against the source NCERT PDFs (`ihga101–112`, read visually because pdftotext mangles Devanagari) + the Hindi quality bars. Read-only; no content changed. **The book is currently unpublished (0/108)** — these are pre-launch catches.
**Method:** mechanical scan (all pages) + one expert Hindi-teacher/AI-slop reviewer per chapter, PDF read first. The book-wide quiz-key defect was verified by hand against the database.

**Severity tally:** 🔴 CRITICAL ≈30 · 🟠 MAJOR ≈89 · 🟡 MINOR ≈142. Per-chapter detail in `ganga/chNN-findings.md`.

> Headline: the teaching surfaces are competent and the literary text is *mostly* faithful — but गंगा carries a **systematic, book-wide answer-key bug** that mis-marks the best students, and the **assessment + vocabulary layers are weaker than Kaveri's**. Because it's pre-launch, every one of these is fixable before a student ever sees it.

---

## The 9 systemic patterns

### 1. 🔴 THE BIG ONE — 24 graded questions mis-keyed across every chapter (verified)
Every chapter's `chapter_practice` bank contains `h{N}-pr-21` and `h{N}-pr-23`, and **all 24 are broken the same way**: the `explanation` justifies **option 0** (the correct, on-theme answer), but `correct_index` is set to 1 or 2 — a clearly wrong or opposite statement. A student who understood the chapter is marked **wrong**.
- This is **invisible to the position-balance validator** — the keys are spread across A/B/C/D ({0:84,1:71,2:73,3:60} over 288 items), so the gate passes while these 24 sit on wrong options. Only a key-vs-explanation audit catches it.
- **Strong recommendation:** run a full key↔explanation consistency audit across all 288 graded items, not just pr-21/23 — whatever generation/transform step broke these two-per-chapter could have touched others. (Fixing the 24 also re-clusters answers onto option 0, so re-balance after.)

### 2. 🔴 Narrated passages edited/abridged — worse here because much of गंगा is poetry
The "original text is sacred" rule is broken in several chapters, and in verse every word/मात्रा matters:
- **Ch10** (निराला): drops a full line **"स्तव कर बहु-अर्थ-भरे!"** *and* the closing refrain "भारति, जय, विजयकरे!" — losing the poem's circular structure — yet the vocab cards *teach* that exact dropped line.
- **Ch9** (तुलसीदास): silently drops ~**half the चौपाइयाँ**, then quizzes lines the student never read.
- **Ch5** (मोहन राकेश): the reading passage is a **paraphrase**, not राकेश's prose, and drops the very line NCERT's exercise Q2 is built on ("मैं कुछ देर भूला रहा कि मैं मैं ही हूँ").
- **Ch7**: splices non-adjacent sentences and removes the प्रश्नोत्तर texture the chapter itself teaches as the essay's signature.
- Verbatim corruption: **Ch1** "स्थायी विषाद **स्थायी रूप से**" (duplicated word); **Ch8** पद reads "तुम सा देव **और**" vs PDF "**ओर**"; **Ch12** "किंतु **उनसे**" vs PDF "**उससे**".

### 3. 🔴/🟠 Fabricated facts presented as textual
- **Ch4**: invents a death year (**1942**) and Lata's age (**13**) for her father's passing — nowhere in the source — and hardens them into a reasoning reveal, a quiz explanation, and a practice item.
- **Ch3**: invents an author award **"मैथिलीशरण गुप्त सम्मान"** — the PDF says **"श्रीलाल शुक्ल स्मृति इफको साहित्य पुरस्कार."**
- **Ch11**: a fabricated/clipped quote in an अवतार vocab card example.

### 4. 🟠 Vocabulary cards drop NCERT's real शब्द-संपदा and substitute invented words
Against the rule "cards are sourced from the printed शब्द-संपदा, not invented":
- **Ch6** drops गंदुमी, डाट, करीने, दस्तक, खीस निपोरना; adds परिवेश/समाधान/टिप्पणी/दिखावा.
- **Ch5** drops कडल-काक, बाइनाक्यूलर्ज़; pads with everyday words (चट्टान, विस्तार).
- **Ch12** invents meta-terms (संबोधन, ध्वन्यात्मक, बहुआयामी) that aren't poem words.
- Several chapters miss the §8 floors (≥40 genuine hard words, ≥8 idioms) — Ch5 (~28), Ch6 (~33), Ch9 (no idioms page), Ch12 (no मुहावरे page).

### 5. 🟠 अलंकार / device mislabels hardened into single-answer MCQs
Invisible to a student, plainly wrong to a CBSE examiner:
- **Ch2** generational *contrast* tagged विरोधाभास (paradox); **Ch3** a मुहावरा tagged अतिशयोक्ति; **Ch5** chiasmus ("शक्ति का विस्तार, विस्तार की शक्ति") tagged अतिशयोक्ति; **Ch8** one span tagged BOTH अनुप्रास and उपमा (so the single-answer MCQ is ambiguous); **Ch11** अनुप्रास claimed where the consonants differ; **Ch12** off-list enum "apostrophe" instead of मानवीकरण; **Ch10** contested द्विगु vs बहुव्रीहि (शतमुख) hardened into a key.

### 6. 🟠 Grammar/morphology errors taught as fact
- **Ch1**: teaches सींग = स्त्रीलिंग (standardly masculine — the book's own narration uses "सींग मारा").
- **Ch4**: splits स्वाभिमान as स्व+अभि+मान (should be स्व+अभिमान — which the *same chapter* gets right in h4-pr-10).
- **Ch6**: idiom "बाप सेर तो बेटा सवा सेर" glossed positively, though the text (and NCERT) use it ironically.

### 7. 🟡 Cloned boilerplate across chapters (verified)
The `chapter_practice` intro + lead-in ("सही उत्तर चुनिए और कारण समझिए।" / "अब अभ्यास का समय…") is **byte-identical across chapters 2–12** (9 duplicate blocks confirmed mechanically). It also promises a per-question "कारण/justify" step the block never implements — NCERT's *मेरे उत्तर मेरे तर्क* exercise family is named but unbuilt.

### 8. 🟠 Graded bank is recall-heavy and self-duplicating
Against the rubric's ~15% recall cap:
- **Ch7** ~9/24 bald recall; pr-15/16/17/18 restate inline-quiz items verbatim.
- **Ch12** ~50% recall, largely a re-pour of the inline quizzes/checkpoints.
- **Ch10** a duplicate question pair (pr-17 ≈ pr-23). Distractors are often throwaways (कारख़ाना/बाज़ार) → gameable without reading.

### 9. 🟡 Completeness / pre-launch gaps
- **28 empty image slots** book-wide (expected pre-launch, but blocks publish).
- **Ch13 (अपठित)** can't ship: empty hero images, a **CRITICAL arithmetic contradiction** (School स: 110 survived of 220 planted = exactly half, but passage *and* an assertion-reason item claim "less than half" — and that AR item is itself mis-keyed), and the standard शीर्षक (best-title) item type is missing.
- Missing सृजन / संवाद-लेखन / लघुकथा writing tasks NCERT prints (Ch8, Ch9).

---

## What is genuinely strong (don't "fix" it away)
- Where passages are quoted (not abridged), they're **verbatim** — including मात्रा/नुक़्ता in Ch11's famous ballad.
- Author bios are accurate in most chapters (Ch2, Ch7, Ch9, Ch10, Ch11).
- The triple-bridge **scaffold-flip vocabulary is rich** where it uses the real words (Ch1: 43 cards + 8 idioms).
- Device labels are **correct** in Ch9 (अनुप्रास/अतिशयोक्ति/रूपक all trace to NCERT's table).
- No English-style AI-word slop (it's Hindi), and em-dash/length issues are milder than Kaveri's.

## Recommended priority order
1. **Fix the 24 mis-keyed pr-21/pr-23 items** (key → option 0) — then run a full key↔explanation audit across all 288 graded items, then re-balance positions.
2. Restore the edited/dropped passage & poem text (Ch5, Ch7, Ch9, Ch10) and the verbatim slips (Ch1, Ch8, Ch12).
3. Remove fabricated facts (Ch4 dates, Ch3 award, Ch11 quote).
4. Rebuild vocab cards from the printed शब्द-संपदा; meet the §8 floors; add the missing मुहावरे pages.
5. Correct the अलंकार and grammar mislabels (they propagate into keyed MCQs).
6. De-duplicate the cloned practice intros; cut recall padding; fix Ch13's arithmetic before it ships.
