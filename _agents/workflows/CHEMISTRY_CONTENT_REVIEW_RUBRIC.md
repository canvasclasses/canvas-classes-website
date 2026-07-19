# Chemistry Live Book — Content Review Rubric

> **This is the canonical standard the chemistry content reviewer scores against.** It is a **living document**: every time the founder corrects a finding, that judgement is written into the [Calibration log](#calibration-log) at the bottom, and the reviewer gets sharper. The reviewer (the `/chem-content-critic` skill) never changes — *this file* is what improves.
>
> **When this file conflicts with anything else, this file wins** for chemistry Live Book reviews. Born 2026-07-12 from a pilot on Class 12 Ch.2 Electrochemistry.

---

## 0. The design in one paragraph

A strong model already knows the chemistry. What it does **not** know is the founder's *taste* — when a chapter has a soul versus when it reads like stitched paragraphs, when a simulation earns its place, when a student silently gets lost. So the system is two pieces: a **stateless, re-runnable reviewer** (the skill) and this **living rubric** (the taste). The reviewer is only ever as good as this file. Keep this file sharp and the reviews stay sharp.

## 0.5 Stage awareness — TEXT framework first (founder decision, 2026-07-12)

**Right now we are perfecting the TEXT framework.** Audio and video are recorded and attached by the founder **later, by hand**. Therefore:

- **Missing audio/video is NOT a defect.** Do not flag it as a problem or count it against the chapter. Instead, produce a **placement map**: name the 3–6 spots where a 60–90s clip will later earn its place (spatial/directional ideas, a multi-step derivation, a "why does this really happen" intuition). That map is a *to-do for the founder*, not a finding.
- Everything else in this rubric applies at full strength. The text has to stand completely on its own and be perfectly in sync **before** any media goes on top.

---

## 1. The gold-standard DNA (what "good" means)

Reverse-engineered from the founder's exemplar pages — **Practical Organic Chemistry pp. 1–8** and **Some Basic Concepts pp. 1–5**. A Canvas chemistry chapter has a soul when it has these ten traits. Score each page and the chapter as a whole against them.

1. **Cold-open hook on every lesson page.** A vivid, concrete, often-Indian story *before* any theory (the silver tree, the battery in your mouth, the $327M unit-mismatch crash, the Iron Pillar).
2. **Connective tissue.** Each page names what came before and leans into what comes next. The chapter reads as one arc, not stitched paragraphs. This is the "poem, not copy-paste" test.
3. **Plain teacher voice.** Short second-person sentences; daily-life analogies (masala chai, tug-of-war, sea level); zero AI-tell phrasing (no "delve/intricate/crucial/realm", no "it's not just X, it's Y", no drama closers). See `TEACHER_VOICE_SYSTEM.md`.
4. **India-rooted and human.** Kannauj attar, Jamnagar refinery, Sambhar Lake, Napoleon's aluminium plates, Acharya Kanad. A signature, not decoration.
5. **The page scaffold.** hook → concept in plain words → diagram → worked reasoning → a "think about it" reasoning prompt → JEE/NEET exam-insight box → 2–3 tricky quiz questions. A `reasoning` block on **every** page.
6. **Depth beyond NCERT, anchored to the exam.** Go deeper than the textbook (LLJP, overvoltage, Latimer diagrams, non-stoichiometric compounds) but always tie it back to why it is asked.
7. **Teacher's own voice, heard not just read.** Short audio/video where a concept needs to be *heard*. (See §0.5 — at the text stage this is a placement map, not a requirement.)
8. **Simulations that teach a prediction.** Each interactive has a "guess first" prompt and a reveal — the student learns something they could **not** get from text + image alone.
9. **Honest quizzes.** Every distractor is a real misconception; every question difficulty-tagged; balanced answer positions; no length-tell; no "All/None of the above". See §3.
10. **Accuracy and one consistent convention.** Real numbers, real dates; one sign convention held across the whole chapter.

---

## 2. The five review lenses

Read the **whole chapter in order** (dump it first — see §5), then judge through these five lenses. Every finding must cite a specific page and a specific fix.

**A. Continuity & soul.** Does page N+1 feel like the natural next breath after page N, or a topic-switch? Where does the voice change register (teacher → textbook)? Is there a through-line, or islands? Flag dry "reference-manual" stretches inside an otherwise narrative chapter.

**B. Conceptual gaps.** Does a page use a term/idea it never established? A logical jump a second-language student can't follow? A prerequisite assumed but not built? Track what's been introduced as you read.

**C. Where media will help (placement map, not a defect).** Point at the exact page/paragraph where a future 60–90s video / audio / worked example will carry a load the text carries clumsily. Spatial/directional → video; multi-step stumble → worked example; "why really" intuition → audio.

**D. Simulation utility — useful or decoration?** For each interactive: *what can a student do or understand after using this that text + image alone can't give?* If the honest answer is "nothing" / "just looks impressive" → flag as decorative. A sim with a genuine predict-then-reveal and a manipulation is load-bearing; a "drill with no interactive teaching beat" is a quiz in disguise — flag it to be play-tested or demoted.

**E. Level-fit, voice & quiz hygiene.** Plain classroom vocabulary for tier-2/3 town students; no AI-tells; a reasoning block per page; cognitive load not too high (don't stack many worked examples with no narration between). Plus the quiz-hygiene hard rules in §3.

---

## 3. Quiz-hygiene hard rules (measurable)

These are checkable with a script (`scripts/livebook-review/_scan_ch2.js` pattern). A chapter fails hygiene if any of these are violated:

- **Answer-position balance.** Correct answers must spread roughly evenly across A/B/C/D. *Fail example (Ch.2 pilot): 68/92 correct answers were option B (74%).* Target: within a few of even.
- **No length-tell.** The correct option must not be the conspicuously longest. *Fail example (Ch.2 pilot): correct = longest option in 69/92 (75%).* Fix by trimming the correct answer (its full reasoning lives in the explanation) and/or making distractors fuller — never by empty padding.
- **Every question difficulty-tagged** (`difficulty_level` 1/2/3: recall / application / multi-step-reasoning). *Fail example: 92/92 untagged.*
- **Every distractor a real, specific misconception** — not filler, not obviously silly.
- **No "All of the above" / "None of the above".**
- **No AI-worded explanations.**

Apply fixes **only** through `scripts/lib/book-writer.js` (versioned, content-loss-guarded, reversible). Rebalance positions and difficulty tags deterministically; author distractor rewrites with care (parallel subagents are fine — see the Ch.2 batch scripts in `scripts/livebook-review/`).

---

## 4. The report format

One finding per line, skimmable, ranked most-severe first:

**`Fn` · severity (High/Med/Low) · confidence (Confident / Needs-a-look) · page(s) · one-line issue → the specific fix.**

- Severity = how much it hurts the learner. Confidence = how sure you are (a database read can't exercise a simulation or verify a worked-example's internal maths — say so).
- **Always list what you could NOT check** (worked-example solution bodies, live simulations). A review that hides its blind spots is worse than one that shows them.
- Lead the write-up with a plain-English verdict; a strong chapter should be told it's strong before the nitpicks.

## 4.5 The correction loop (how this file evolves)

1. Deliver the report; the founder reacts (agrees / disagrees with each finding).
2. **Every disagreement or refinement is a calibration.** Write it into the [Calibration log](#calibration-log) as a new rule or example, dated.
3. Next review reads the updated rubric — so it applies the founder's *latest* taste, not last month's.

This is the whole point: over a term this file accumulates dozens of the founder's calls and catches what it would have missed today. If this file is stale, the system has failed.

---

## 5. Toolkit

Read-only + sanctioned-write tools in [`scripts/livebook-review/`](../../scripts/livebook-review/):

- `_dump_chapter.js <bookSlug> <chapter> [maxPage]` — dump a chapter's pages as readable text to review.
- `_scan_ch2.js` / `_scan_tell.js` — quiz-hygiene + length-tell scans (adapt the slug/chapter).
- `quiz_export.js` → subagent authoring → `apply_ch2_fixes_b*.js` — the batch pipeline that rebalances positions, breaks length-tells, and adds difficulty tags, all through `book-writer.js`.

Book slugs: Class 11 Chemistry `ncert-simplified`; Class 12 Chemistry `ncert-simplified-12`.

---

## Calibration log

Each entry is a correction the founder made, captured so the reviewer improves. Newest first.

- **2026-07-12 — Media is a placement map, not a defect (at the text stage).** The reviewer flagged "zero audio/video in 30 pages" as the top defect. Founder: audio/video are added by hand later; right now we build the *text framework* to perfection. → Lens C now produces a placement map and never penalises absent media. (See §0.5.)
- **2026-07-12 — "Sign error" was really a convention clash.** The reviewer called the water-potential mismatch (p22 `+0.82` vs p24 `−0.82`) an error. It's not a wrong number — both are defensible in isolation; they clash because p22 mislabels a reduction potential as an "oxidation." Reviewer lesson: distinguish *factual error* from *convention inconsistency*, and default the whole chapter to reduction-potential framing (the chapter's own spine). Fixed on p22.
- **2026-07-12 — Quiz-hygiene thresholds seeded.** Ch.2 pilot measured the failure bar concretely: 74% of correct answers on option B, 75% correct = longest option, 100% untagged. These are the reference "fail" magnitudes in §3.
