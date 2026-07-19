# Class 12 Biology — Publication Audit (Ch.3 + Ch.6) + Competitive Position

> Audit date 2026-07-16. Chapters chosen at random: **Ch.3 Reproductive Health** (7pp) and
> **Ch.6 Evolution** (9pp). Scored against `_agents/workflows/CHEMISTRY_CONTENT_REVIEW_RUBRIC.md`
> (the founder's canonical taste, reverse-engineered from the gold-standard chemistry pages).
> Per rubric §0.5, **missing images/audio/video are NOT counted as defects** — the text framework
> is the stage under review. Findings that could be measured book-wide were measured book-wide.

## VERDICT

**The text framework is genuinely good and the scaffold is the best we've built.** Every lesson
page in both chapters carries its hook, reasoning check, exam tip and glossary — 100%, no gaps.
Difficulty tags are 100% present (the Chem Ch.2 pilot was 0%). Voice discipline held: only 15
AI-tell words across all 108 pages. Ch.3's seven page-bridges are all correct and genuinely
well-written; Ch.6's are 8/9. NCERT fidelity is high and the Rule-0 gate demonstrably worked.

**But the book is a stateless artifact, and three things actively hurt the learner**: the quizzes
have a severe length-tell that lets students score without knowing biology; 708 authored glossary
terms are dead data that never reach a student; and every chapter is missing the Summary and
Exercises that NCERT itself ends with.

---

## FIX STATUS (updated 2026-07-16, same day)

| Finding | Status |
|---|---|
| **F1 length-tell** | ✅ **FIXED book-wide.** 228 questions rewritten by 13 parallel subagents; correct=longest **60% → 0%**. Verified by independent re-scan of the live DB. |
| **F7 answer-position skew** | ✅ **FIXED book-wide.** Deterministic round-robin: now **exactly 95/95/95/95 (25% each)**. |
| **F6 Ch.6 broken bridge** | ✅ **FIXED.** p6 now bridges into deep time. |
| **F2 glossary dead data** | ✅ **BUILT.** `glossary` added to the `BookPage` type; new `packages/book-renderer/glossary-context.tsx` (context + `rehypeGlossary` matcher + `GlossaryTerm` popover); `PageRenderer` provides `page.glossary`; `TextBlockRenderer` consumes it. **529 of 708 Class 12 Bio terms (75%) match their page's prose and now render a hover/tap definition.** Both apps typecheck + build clean. |
| **F3 no NCERT exercises / no chapter recap** | ✅ **BOTH HALVES BUILT.** Exercises: all 13 chapters end with a "Practice — NCERT Exercises" page (179 exercises, 58 themes). Recap: **Ch.1 pilot built and verified live** — a retrieval-only page (mindmap, process spine, numbers table, swap-traps table, 2 reasoning self-checks, closing 8-Q integrative quiz), no summary paragraph anywhere. Both mechanisms verified live with real clicks (solution reveals, quiz answers, reasoning-prompt commit flow). **Scaling the recap to Ch.2–13 is paused pending refinement** — see `_recap/CONTRACT.md` open questions. |
| F4 rephrasing risk | 📋 Planned — §4a `ncert_verbatim` |
| F5 wall of text, F8 rationales, F9 worked examples, F10 sims, F11 AI-tells, F12 Hinglish | 📋 Open |

**Two detector bugs found by the fixing agents themselves (both real, both now handled):**
1. **A tie is not a tell.** The export counted "correct tied-longest" as a defect. If all four options
   are the same length, length teaches the student nothing — that is the *ideal* end state, not a
   failure. The apply script now gates on **uniquely** longest. (Overstated the original defect
   slightly; 60% is the tie-inclusive figure.)
2. **The mirror defect.** Naively killing "correct = longest" pushes the key to *shortest* — the same
   exploit inverted. One agent caught itself doing this (15/24 shortest on its first pass) and
   corrected. Book-wide the result is **31% shortest vs ~25% by chance** — a mild lean, not a usable
   strategy (a student following it is wrong 69% of the time), versus the 60% longest-tell which
   **was** usable. **Residual, accepted for now.** Note one agent measured ch2's untouched questions
   already at 37% shortest — so part of this lean predates the fix and is inherent to "the key is a
   crisp claim, the distractors are fuller wrong ideas."
   → **Follow-up:** teach the scan to flag *either* extreme before the next book's pass.

---

## FINDINGS (ranked by damage to the learner)

**F1 · HIGH · Confident · Ch.3 (83%), Ch.6 (56%), likely book-wide — Length-tell is corrupting our single best learning mechanism.**
In Ch.3 the correct option is the longest in **20/24 questions (83%)**; Ch.6 is 18/32 (56%). The
Chem Ch.2 pilot's 75% triggered a founder-ordered fix — Ch.3 is *worse than that bar*. This is not
cosmetic. Dunlosky et al. (2013) rate **practice testing as one of only two high-utility learning
techniques** of ten studied. Our 380 quiz questions are the most evidence-backed thing in the book,
and an 83% length-tell means a student can pick right without knowing biology — it trains guessing
strategy and produces a false mastery signal.
→ **Fix:** run the existing `quiz_export.js` → subagent rewrite → `apply_quiz_hygiene.js` pipeline
book-wide (already proven on Chem Ch.2). Trim the key; fatten distractors; never pad.

**F2 · HIGH · Confident · book-wide — 708 glossary terms are dead data.**
We author 5–8 glossary terms on every page (**708 across 108 pages**). No renderer consumes
`page.glossary`; it isn't in `packages/data/types/books.ts` or the Zod schema. **No student has ever
seen one.** Meanwhile AMBOSS's hover-definition is among the highest-leverage features in medical
ed for exactly our case: a terminology-dense subject read by second-language students.
→ **Fix:** ship tap/hover glossary in the renderer. **The cheapest high-impact win in this audit —
the content already exists and is paid for.**

**F3 · HIGH · Confident · book-wide (0/13 chapters) — No Summary, no NCERT Exercises, no revision artifact.**
Every NCERT chapter ends with **SUMMARY** and **EXERCISES** (verified in lebo103/lebo106 source).
We have neither, in any chapter. CBSE boards draw directly from back-exercises; NEET students drill
them. Worse: our pages are 4–11 minute reads, and the sourced revision benchmark is *"if biology
notes take 20 minutes to revise they are too long — the right notes are revisable in 3–5 minutes per
subtopic."* **By construction we have nothing usable in the final-60-day window**, which is when
NEET Bio is actually won.
→ **Fix:** add a `chapter_summary` page type, an NCERT-exercises-with-solutions page per chapter,
and a ≤5-minute revision card per chapter.

**F4 · HIGH · Confident · book-wide — We rephrase NCERT, and NEET Biology punishes rephrasing.**
Our build contract says *"You may re-teach/re-explain NCERT's content more clearly."* But **70–95% of
NEET Bio questions come near-verbatim from NCERT**, and examiners twist single words — "a single word
changes the meaning." A student who learns our (better) paraphrase meets NCERT's exact wording in the
exam. This risk is **baked into the build contract**, and it is the deepest strategic issue in the book.
Note this also conflicts with the rubric's own gold-DNA trait #6 ("depth beyond NCERT") — for Biology
we chose NCERT-fidelity over depth, which is defensible, but it should be a *conscious* decision.
→ **Fix (do not stop rephrasing):** add an **NCERT-verbatim layer** — the exact NCERT sentence shown
beside our explanation. *"Our words to understand it. NCERT's words to answer it."* This turns our
biggest liability into the thing rivals can't copy.

**F5 · MED · Confident · book-wide — Wall of text.**
Median text block: **148 words (Ch.3) / 169 (Ch.6)**. Blocks over 120 words: **20/25 and 22/30**.
**Longest unbroken paragraph: 154 / 180 words** (readable prose for this audience ≈ 40–80).
Worst offenders: Ch.3 p1 (the strategies block, 255 words) and Ch.6 p3 (evidences, 305 words).
This violates the rubric's own "short second-person sentences / cognitive load" rule and Mayer's
**segmenting principle** (chunks + learner pacing beat continuous streams).
→ **Fix:** split to 40–80 word paragraphs; convert the list-shaped passages (Ch.3 strategies, Ch.6
evidences) into bullets or a table — they are lists wearing a paragraph costume.

**F6 · MED · Confident · Ch.6 p6→p7 — Broken bridge (a promise to the reader that isn't kept).**
Hardy-Weinberg closes: *"…next we watch it actually reshape a population, sorting variation into the
patterns evolution leaves behind."* But p7 is the geological timeline. That promised content is p5
(Mechanism), which already happened — the author assumed a different page order.
→ **Fix:** rewrite one closing sentence to bridge into deep time.

**F7 · MED · Confident · Ch.6 — Answer-position skew.** B+C hold **68%** of correct answers; D only
**13%** (19/34/34/13). Ch.3 is clean (25/29/21/25). → deterministic rebalance in the F1 pass.

**F8 · MED · Confident · book-wide — Explanations cover 2 of 4 options.**
Mean explanation = **361 characters**, naming the key + the most tempting distractor. **UWorld's entire
moat is a full rationale for every option** — why a reasonable student picks it and why it fails.
→ **Fix:** amend the contract; rewrite explanations to address all four. Pure writing, no engineering.

**F9 · MED · Confident · book-wide — Only 4/108 pages carry a worked_example**, though the book is full
of genuinely numerical NEET topics: monohybrid/dihybrid ratios, Punnett squares, Hardy-Weinberg
p²+2pq+q², N(t+1)/r/K, the species-area slope Z, NPP = GPP − R, the 10% law, blood-group crosses.
The worked-example effect is well-evidenced for novices. → add them — **but** note the **expertise-
reversal effect**: worked examples must *fade* as the student improves, which a static book cannot do.

**F10 · MED · Confident · book-wide — 0/108 simulation blocks.** Class 11 Biology has 19 embedded;
the renderer supports it; relevant sims exist. Class 12 Bio has none.

**F11 · LOW · Confident · book-wide — AI-tells.** `crucial` ×7, `unlock` ×2, `seamless` ×1,
`landscape of` ×1, plus **4× the "not just X, but Y" construction** the rubric explicitly bans.
15 hits in 108 pages is low density — a cleanup, not a rewrite.

**F12 · LOW/STRATEGIC · book-wide — 0/108 Hinglish twins**, while Class 12 Chemistry Ch.2 is 29/30.
If Hinglish is part of the tier-2/3 promise, Biology is entirely without it.

### What I could NOT check (blind spots)
- **All images are `src:''`** — per rubric §0.5 not a defect, but it means **hotspot semantic placement
  is unverified**, and the Class 11 lesson is that the automated pixel gate is *insufficient* for this.
- **Worked-example internal maths** — I read shapes, not verified derivations.
- **Simulation utility** — there are none to evaluate.
- **Live rendering/UX** — no preview server started (§5.2).
- In the competitive brief: **Reddit/student sentiment was weakly sourced**, and several rival prices
  are JS-gated and unverified. Flagged, not guessed.

---

## ⚠️ FOUNDER CALIBRATION — 2026-07-16 (my competitive framing was WRONG; the findings stand)

The founder rejected the positioning conclusion below. Recorded per the rubric's §4.5 correction loop.
**Read this before trusting the "COMPETITIVE POSITION" section that follows it.**

| I concluded | Founder's correction |
|---|---|
| "The market buys the rank, and the person who promises it" — so chase that | **"We are not selling ranks, but quality learning."** |
| Position as a *complement* to PW; price under PW's ₹3–5k anchor | **"Not targeting PW customer base."** The PW anchor does not bound us — different segment, different buyer. |
| PW is the bar to beat on bundle value | **"PW doesn't offer very high quality content and no innovation so far."** PW is a *volume/price* leader, not a *quality* benchmark. Don't treat their bundle as the standard. |
| Rank-relative feedback ("you beat 70% of users") is emotionally required | **"Working for overall growth of students, not using FOMO."** No fear/scarcity mechanics. |

**What this changes:** the price-anchor argument, the "we need a cohort/rank signal" gap, and the
"teacher brand/parasocial" gap all lose force — they are artifacts of competing for PW's customer.
A test series is already being built in-house, which closes the practice-volume gap on our own terms.

**What this does NOT change:** every finding F1–F12 is a *quality/learning-outcome* defect and survives
the repositioning **entirely intact**. If anything they matter *more*: if the pitch is quality rather
than rank, then a quiz a student can game by picking the longest option, 708 invisible glossary terms,
and missing chapter summaries are not competitive gaps — **they are the product failing its own promise.**

**Standing rule going forward:** do not benchmark quality against PW. Benchmark against the global
gold standards (UWorld's per-distractor rationales, AMBOSS's hover-library, Brilliant's do-before-you-read,
PhET's implicit scaffolding) and against the learning science. Never propose FOMO/scarcity mechanics.

---

## COMPETITIVE POSITION
> *(Superseded in part by the calibration above — the market facts are accurate; the positioning
> recommendation was rejected. Kept for the factual record.)*

### The market frame
NEET 2025: **22.76 lakh registrations**. **Biology is 90 of 180 questions = 360 of 720 marks — half
the exam**, with −1 negative marking. Toppers are separated not by understanding but by **recall
precision and speed under a clock**.

### Where rivals are genuinely better than us
1. **Practice at exam scale.** Aakash sells **33 full-length tests for ₹12,000**; Allen's RACE/DPP
   books exist to grind volume. No quantity of inline quizzes substitutes for proctored full-lengths.
2. **Rank feedback.** AIATS, PW's monthly national mocks, everyone's rank predictor. They answer the
   only question an aspirant has: *"against 22 lakh people, where am I?"* **We have no cohort.**
3. **NCERT line-by-line + PYQ tagging.** Rivals ship NCERT-mapped question sets. See F4.
4. **3–5 minute revision artifacts.** Allen Handbooks. We are, by construction, slow.
5. **Teacher brand.** Alakh Pandey: 13.7M subscribers. Students buy *a person*. A book has no face.
6. **Human doubt-solving.** Aakash "Ask an Expert", Allen owns Doubtnut, PW in-app.
7. **Structure and accountability.** A batch has a schedule and a syllabus-completion date.
8. **Paper.** Allen's thriving secondhand module market proves students still want books they can annotate.

### The price anchor (hard constraint)
**PW: ₹3,000–5,000/year all-inclusive** (live classes + DPPs with video solutions + national mocks +
doubt-solving), 4.46M paid users, ₹2,887 Cr FY25 revenue, NSE-listed Nov 2025. **Aakash sells single
chapters at ₹99.** There is no argument that wins *"why is your book more than PW's entire course?"*

### The cautionary tale
**Embibe.** Reliance-funded, genuinely AI-adaptive, technically strong — and it has displaced nobody.
**The market does not buy learning technology. It buys the rank, and the person who promises it.**

### Our two real openings
1. **PW's Biology is its admitted weak subject.** The cheapest, largest player is weakest exactly where
   we are strongest — on the subject worth half the exam.
2. **Nobody ships the diagram-labelling drill.** **20%+ of NEET Bio marks are diagram/table recall**, and
   the universal advice is *"re-draw NCERT diagrams until you can label them blind."* That instruction
   **has no product** — students do it with pencil and paper. We have **71 diagrams / 420 labels** and a
   Label Sprint engine that auto-activates from them. **That is the wedge.**

### Positioning read
We are **not** a competitor to PW/Allen — we are a **complement**, and should be sold as one: an
**NCERT-faithful diagram/table/keyword recall instrument** for the subject where the ₹4,000 market
leader is weak, priced under the anchor, usable in the final-60-day window. The 3D models are marketing
surface; **the labelled-diagram recall loop is the product.**

---

## WHAT WORLD-CLASS REQUIRES (prioritised)

> **The one-line diagnosis:** a world-class 2026 product **remembers the student and acts on that
> memory**. Ours is a stateless artifact. Roediger & Karpicke's **"illusion of competence"** is the
> load-bearing finding: students cannot self-assess, default to rereading, and **a beautiful textbook
> actively feeds the illusion.** Dunlosky rates highlighting, rereading and summarising **low-utility** —
> those are precisely what a gorgeous book encourages.

### Tier 1 — strongest evidence, closest to reach
1. **A spaced-repetition scheduler that owns the student's forgetting curve.** Not end-of-chapter
   quizzes — a cross-chapter engine deciding *what to show today*. 2025 meta-analysis in medical
   education: **pooled SMD 0.78**; high-frequency Anki users beat minimal users by **4–13 points on USMLE
   Step 1**, dose-response. **Critically, that advantage holds for Step 1 (recall) and NOT Step 2 CK
   (application) — and NEET Biology is a Step-1-shaped exam.** This is the best-evidenced intervention
   available for our exact use case, and our biggest single gap.
2. **Per-distractor rationales** (F8). Editorial policy, not engineering.
3. **Hover glossary** (F2). The data exists. Ship the feature.
4. **NCERT-verbatim layer + PYQ tagging per diagram/statement** (F4). Which NEET year asked this line.
5. **"Attending Tips"** (AMBOSS's best idea) — a progressive hint that models *how a biologist reads the
   question*, without revealing the answer. Counters the illusion of competence without collapsing to
   answer-reveal.

### Tier 2 — structurally important
6. **Interaction as exposition, not illustration** (Brilliant's thesis). Make the student predict/
   manipulate *before* the reveal. Our read-then-quiz model is exactly what Brilliant was built to beat.
   Pair with PhET's **implicit scaffolding** — guide via affordances and constraints, never instructions.
7. **Fading worked examples** (F9 + expertise reversal). The most intellectually defensible reason to
   build adaptivity at all — it's cognitive load theory, not personalisation marketing.
8. **Error metacognition as a real surface** — Blueprint's *Lessons Learned Journal* / UWorld's
   *My Notebook*. Cheap; disproportionately valuable; our flags/persona data can feed it.
9. **Analytics with named dimensions + a teacher/parent view.** **Kognity's lesson is commercial:
   the dashboard is what schools actually buy.** Relevant the moment we sell to CBSE schools.

### Tier 3 — table stakes we are below
10. **WCAG 2.2 AA + a published VPAT/ACR.** Khan, Pearson and McGraw-Hill have all moved to 2.2 AA with
    annual conformance reports. **This is now a procurement gate for international schools, not a nicety.**
    For our 3D models and sims, PhET is the reference stack: keyboard navigation, interactive
    descriptions, **sonification**, voicing. Our dark-palette/reading-mode work shows we already think
    about visual comfort — this is the same instinct applied to students we currently cannot serve at all.
11. **Localisation as architecture — decide now.** PhET wrote a paper on making sims translatable
    *because retrofitting is brutal*. AMBOSS runs **regionally-adapted instances, not string swaps**.
    गंगा (Hindi) is in flight and Bio is 0/108 Hinglish — **this decision is live and gets 10× more
    expensive later.**
12. **Meet the paper book where it is.** Lecturio's *Bookmatcher* lets students photograph a page of
    their print book and jump to the matching lesson. **Every one of our students owns physical NCERT.**
    An NCERT page/section → Live Book deep link is cheap and **no Indian rival has it.**

### On going global (CBSE + NEET outside India)
There is a real tension: rubric trait #4 is **"India-rooted and human"** — a deliberate signature — and
the founder now wants global reach. **My read: keep it.** NEET is an Indian exam; NRI candidates sit the
same paper; NEET literally asks about Saheli/CDRI Lucknow. India-rooting is an *asset* for NEET.
What actually blocks international use is infrastructural, not cultural:
- **Offline + low-bandwidth** (Gulf/Africa CBSE schools) — our hero images are heavy; this will hurt.
- **WCAG 2.2 AA + VPAT** — the procurement gate above.
- **Gloss local terms in one line** (pug marks, Aravalli, gobar) — keep the flavour, remove the assumption.
- **Possible white space:** the research found **no product addressing NEET-for-international-students** —
  unverified either way, worth a dedicated pass before acting.

---

## RECOMMENDED ORDER OF WORK
1. **Quiz hygiene pass, book-wide** (F1+F7) — pipeline exists, fixes our best mechanism. Days.
2. **Ship the hover glossary** (F2) — 708 terms already written. Days.
3. **Summary + NCERT exercises + a ≤5-min revision card per chapter** (F3). Weeks.
4. **NCERT-verbatim layer + PYQ tagging** (F4) — the differentiator rivals can't copy. Weeks.
5. **Per-distractor rationales** (F8) + **prose de-densification** (F5) — same authoring pass.
6. **Images → Label Sprints light up** — the wedge becomes real.
7. **Then** the SRS scheduler (the biggest gap, the biggest build).
