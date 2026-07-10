# Social Science Live Book — Canonical Structure & Style Spec

> **This is the contract for building every Class 9–10 Social Science chapter.** Read it before
> authoring any Social Science page. It was finalised on 2026-07-10 after Chapters 1–2 were built,
> reviewed, and reworked. It supersedes the ad-hoc "Template adaptation" notes in
> [`_agents/state/SOCIAL_SCIENCE_BOOK_BUILD.md`](../state/SOCIAL_SCIENCE_BOOK_BUILD.md) (that file
> remains the **resumable build ledger** — which chapter/page is next; THIS file is the **how**).
>
> - **Book:** `class9-social-science` · BOOK_ID `a60d142c-c96b-48cc-ba72-e68d71d83802`
> - **Source:** NCERT *"Understanding Society: India and Beyond"*, Grade 9 Part 1 (new integrated
>   SS curriculum — one merged text covering Geography, History, Political Science, Economics).
> - **Track:** Class 9 "Exploration" template ([`BOOK_PAGE_WORKFLOW.md`](BOOK_PAGE_WORKFLOW.md) §4B),
>   adapted for humanities per this doc.
> - **Build settings (locked):** English-only · `published: false` on every new page until the
>   founder reviews · all mutations through `scripts/lib/book-writer.js` (never raw Mongo) · images
>   are `src: ''` + a `generation_prompt`/`image_prompt` placeholder, filled later via the image
>   pipeline.

---

## 1. THE GOLDEN RULE — re-teach, never reword

This is the single most important rule, and the reason Chapter 2 had to be reworked.

**Every concept paragraph must genuinely re-teach the idea — explain the *mechanism* and the *why*,
in the plain voice of a good classroom teacher — not lightly reword the NCERT sentence.**

- ❌ *Reworded NCERT:* "A meander is a winding curve or bend in the middle or lower course of a river,
  formed by lateral erosion of the outer bank and deposition on the inner bank."
- ✅ *Re-taught:* "When a river reaches gentler ground it almost never runs straight… on the **outer
  edge of a bend** the water runs faster and deeper, so it eats away at that bank; on the **inner
  edge** it moves slowly, so it drops its sand and silt there instead. Cut away one side while
  building up the other, bend after bend, and the loops grow larger every year."

Practical tests every concept paragraph must pass:
1. **Does it explain the mechanism** (the *how/why*), not just restate the definition?
2. **Is there a concrete image or analogy** a tier-2/3 town student can picture? (Earth as an onion;
   plates drifting "like biscuits over warm honey"; the mantle as a soup pot; a glacier as
   "sandpaper the size of a valley.")
3. **Is it in classroom-teacher English** — no textbook stiffness, no AI tells? (See
   `memory/feedback_livebook_page_quality.md`.)
4. **Where NCERT only *invites* depth** (a "Let's Explore" box, a one-line aside like the Sundarbans),
   **TEACH it fully** — don't echo the prompt. The Sundarbans went from "a delta popular with
   tourists" to a real teaching block (largest mangrove delta, tidal, cyclone-buffer roots, the
   swimming Royal Bengal tiger, UNESCO).

**Coverage rule:** everything in the NCERT chapter must be covered *and improved*. Before finishing a
chapter, diff the built pages against the source PDF section-by-section (this is how the Ch2 gaps —
inner/outer core, volcanic deposition — were caught). Nothing in NCERT may silently vanish.

**Anti-hallucination (Rule 0):** never write a fact from memory. Facts come from the NCERT source
or, for real current events, from a **web search done before writing**, with a visible citation.
When a PDF item looks like a typo/odd date, verify online (see `memory/feedback_pdf_typo_verify.md`).

---

## 2. THE STANDARD PAGE SKELETON

One page = one closed idea. Typical block order (omit what doesn't fit; never pad):

1. **`image`** — hero banner, `aspect_ratio: "16:5"`.
2. **`curiosity_prompt`** — opens the page with a real, named hook (a place, a dated event) — the
   *relevance-first* beat. Not a generic "have you ever wondered."
3. **`text` (re-taught) interleaved with `image`** — the concept, explained per §1, with a supporting
   diagram/photo wherever there's something visual to show.
4. **`guided_reveal`** — for ANY list of 3–5 named sub-types/categories/stages (weathering types,
   dune types, the four disciplines). Never leave such a list as flat prose or a static table.
5. **`reasoning_prompt`** — a "now apply it" check (converges on one good answer). Options + a
   `reveal` that explains the *reasoning*, not just the answer.
6. **Callout(s)** — India context / real-life bridge (see §3 palette).
7. **The chapter flagship** — exactly **one** `you_solve_it` **per chapter** (or a
   `perspective_scenario` where the debate genuinely doesn't converge). Placed as the page's
   capstone, usually just before the quiz. See §4.
8. **`inline_quiz`** — always last. Exactly **3 questions**: one recall, one application, one
   reasoning. See §5.

Keep pages focused; ~10–16 blocks is normal. There is no hard block cap, but if a page runs long,
it's usually two ideas — split it.

---

## 3. THE MECHANIC PALETTE — when to use each

| Block | Use it for | Converges? |
|---|---|---|
| `curiosity_prompt` | Opening hook on every page — a real named place/event | — |
| `reasoning_prompt` | Quick "apply the concept" check | ✅ one answer |
| `guided_reveal` | Any 3–5 named sub-types/stages (click-to-advance) | — |
| `evidence_pack` (callout) | Weigh 2–3 sources/clues and infer | ✅ one reasoning |
| `perspective_scenario` | A real event where several stakeholder positions are each valid — *appreciate why smart people disagree* | ❌ never — no verdict |
| **`you_solve_it`** | A real **unsolved** problem — weigh the real proposed fixes, **commit and defend one**, then a reality-check | ✅ on the *student's* justified pick |
| `career_spotlight` | Name real jobs per discipline (chapter-closing pages) | — |
| `india_science` (callout) | "Remarkable India" spotlight (a place, tradition, institution) | — |
| `bridging_science` / `threads_of_curiosity` / `quest_continues` / `what_if` (callouts) | Real-life bridge / wonder-fact / open question / hypothetical | — |
| `meet_a_scientist` | A one-person story — for SS, a historical/political/economic **thinker** | — |
| `timeline` | Genuinely sequential content only (a river's course, an economic history, a dynasty) | — |
| `interactive_image` | Click-hotspots on a real multi-part diagram (Earth's layers) | — |
| `simulation` | A physical process worth animating (the river-journey sim) — Geography only | — |

**`perspective_scenario` vs `you_solve_it` — the key distinction:** perspective_scenario is about
*appreciating disagreement* and explicitly reaches no verdict (e.g. Western Ghats Gadgil vs
Kasturirangan). you_solve_it is about *solving* — the student must pick a fix and defend it, naming
their own choice's weakness, then sees where the real debate stands. Use you_solve_it as the chapter
flagship; use perspective_scenario when the honest answer is "there is no right answer."

**Four engagement principles** (from the Singapore MOE + Nordic phenomenon-based audit, 2026-07-08):
1. **Relevance is the opening beat, not the closer.** Lead with the real hook.
2. **Reasoning over recall.** Reward *why*, not *what*.
3. **Content resolves to a named real place.** Not "a coastal region" — Poompuhar, the Sundarbans, Bhadla.
4. **Name the job.** Every discipline has a real profession built on it (`career_spotlight`).

---

## 4. THE CHAPTER FLAGSHIP — one `you_solve_it` per chapter

Each chapter gets **exactly one** flagship problem-solving task on its most alive, real, *unsolved*
Indian debate. Structure (5 beats, always the same so students learn the *method*):

1. **The Problem** — real, named, current, with a human stake.
2. **Why it's stubborn** — the twist that keeps it unsolved (the teaching moment).
3. **Solutions on the table** — 3–4 *real* proposals, each with a genuine upside AND a genuine catch.
4. **Your call** — commit to one + name the biggest weakness of your *own* choice.
5. **Where the debate actually stands** — grounding reveal, cites real reports/experts, explicitly
   NOT "the one right answer."

**Non-negotiables:** every instance is **web-verified before writing**, with a visible `source_note`.
Add an infographic (`image_prompt` placeholder) that offloads the comparative facts.

**Real-Indian-issue map (flagship per chapter):**

| Ch | Discipline | Flagship problem (status) |
|---|---|---|
| 1 Understanding SS | all four | Delhi winter air / stubble burning — a four-discipline knot ✅ built |
| 2 Shaping the Earth | Geography | Kosi / "Sorrow of Bihar" floods ✅ built |
| 3 Atmosphere & Climate | Geography | Delhi/urban heat or cloudburst-vs-development (verify at build) |
| 4 Early Humans & Civilisation | History | *(History — use `perspective_scenario` on an interpretation debate, e.g. why the Harappan cities declined; or a heritage-vs-development case)* |
| 5 State & Society to 1000 CE | History | *(interpretation/heritage debate — verify at build)* |
| 6 Democracy / 7 Elections | Pol. Science | electoral/representation reform debate |
| 8 / 9 Economics | Economics | MSP / farm-income / jobs debate (numerical `worked_example` fits here) |

Backup real issues already researched: Bengaluru water crisis, coastal erosion (seawalls vs
mangroves), Joshimath subsidence.

---

## 5. QUIZ RULES

`inline_quiz` last on every page, **3 questions**: recall · application · reasoning.

**The recurring failure mode is the length-tell** — a long descriptive correct answer sitting next to
short bare-term distractors. **Author full-sentence distractors for EVERY question from the first
draft**, including recall questions. Each distractor must be a plausible real misconception, not
filler. Spread the correct option across positions (no clustering on B). See BOOK_PAGE_WORKFLOW §3.6.1.

---

## 6. GEOGRAPHY vs HISTORY vs POLITY/ECONOMICS — discipline adaptations

The template above was built and proven on **Geography** (Ch2). The four disciplines need different
emphases. Ch4 and Ch5 are **History** — a discipline this template has NOT yet been stress-tested on,
so this section is load-bearing for the next build.

### Geography (Ch2 done, Ch3 next)
- Content is **physical processes** → lean hard on §1 mechanism explanations + diagrams.
- `simulation` (animated process, e.g. the river-journey sim) and `interactive_image` (label a real
  structure) shine here.
- `guided_reveal` for the many landform/type lists.

### History (Ch4, Ch5)
- Content is **time, change, and evidence** — not mechanism. Adapt:
  - **`timeline`** does real work here (chronology, dynasties, phases) — but only for *genuinely
    sequential* content, never as decoration.
  - **Evidence-first framing**: History is built from sources (the four types — literary/
    archaeological/epigraphic/numismatic — already taught in Ch1). Use `evidence_pack` for
    "weigh the clues" tasks and `meet_a_scientist` for a historical **thinker**.
  - **Reasoning = cause & effect and interpretation**, not "how does the process work." `reasoning_prompt`
    prompts should ask *why did this change happen* / *what does this source let us conclude*.
  - **Flagship**: prefer `perspective_scenario` over `you_solve_it` for most History chapters — the
    honest questions are interpretation debates (why did the Harappan cities decline? how should a
    contested heritage site be handled?), which don't converge on a "solution." Use `you_solve_it`
    only if there's a genuinely open present-day problem (e.g. protecting an archaeological site
    from development).
  - **No physical-process simulations.** Maps and reconstructed scenes, yes; animated mechanisms, no.
- Same §1 golden rule: re-teach in vivid narrative, don't reword. History especially rewards
  storytelling — make the past feel like people making choices, not a list of dates.

### Political Science (Ch6, Ch7) & Economics (Ch8, Ch9)
- Content is **institutions, rights, and decisions** → `you_solve_it` is the natural flagship (real
  policy debates), and `perspective_scenario` for genuine multi-stakeholder tensions.
- Economics has real **numerical reasoning** → use `worked_example` (opportunity cost, demand/price)
  and `comparison_card`. This is the one place `simulation`/`worked_example` return outside Geography.

---

## 7. IMAGE STYLE

- **Standard generated style:** hand-drawn coloured illustration on a deep-charcoal dark background,
  muted earthy palette — **no glow/neon/orange-tell/3D** (see `memory/project_livebook_image_style.md`).
- **Real events & real places:** use **real, license-verified, visually-verified** photos first
  (Wikimedia Commons — read the license off the actual file page; *look at the pixels*, don't trust
  metadata). Reserve AI generation for what genuinely can't be sourced. Real-event heroes are
  photorealistic documentary-style shots of the actual place (no people in distress) + a clean
  infographic data panel; captions state "illustrative rendering… not an actual photograph."
- **Infographics** for real-event comparative/timeline facts (who proposed what, when, which %) —
  offload those from prose so the text stays short.
- **Technical/diagram style** (for process diagrams): dark background, orange accent labels, clean
  technical illustration — kept consistent within a chapter.
- Hero banners `16:5`; body images use their **natural aspect ratio** (never force-crop). Compress
  every upload with **`cwebp -q 42`**. Never delete an image when editing a page (the content-loss
  guard is the backstop, but preserve media by construction).

---

## 8. NON-NEGOTIABLE SAFETY & PROCESS

- **All mutations via `scripts/lib/book-writer.js`** (`savePage`) — versioned, content-loss guarded,
  audited. Never raw `updateOne`/`deleteOne` on `book_pages`. See CLAUDE.md §0.6.
- **Never hard-delete** a page/block/asset without explicit founder approval in the session.
- **`published: false`** on every new page until the founder reviews the chapter.
- **Validate after every write:** all pages must pass the real Zod `validateBlocks`
  (`scripts/livebook-sst/_validate_all21.ts` pattern). Fix, don't ship, on failure.
- **Per-chapter cadence (Phase A gate):** draft the page plan in the build ledger → founder approves
  → build all pages → refresh state + changelog → founder reviews. Never skip the plan gate.
- **Ledger discipline:** after advancing the book, update
  [`SOCIAL_SCIENCE_BOOK_BUILD.md`](../state/SOCIAL_SCIENCE_BOOK_BUILD.md) (tick pages + changelog)
  and run `node scripts/livebooks-state.js`. Required final step (CLAUDE.md §0.5, §3).

---

## 9. AUTHORING CHECKLIST (per page)

- [ ] One closed idea; hero + curiosity hook (real named place/event).
- [ ] Every concept paragraph **re-taught** (mechanism + analogy + teacher voice) — passes §1 tests.
- [ ] Everything in the NCERT section covered; nothing silently dropped; "Let's Explore" prompts
      taught, not echoed.
- [ ] Any 3–5 named list → `guided_reveal`.
- [ ] A supporting diagram/photo wherever there's something visual to show; media preserved.
- [ ] `reasoning_prompt` with a reasoning-focused `reveal`.
- [ ] Chapter flagship present exactly once (`you_solve_it` / `perspective_scenario`), web-verified,
      `source_note` visible.
- [ ] `inline_quiz` last: 3 Qs (recall/application/reasoning), full-sentence distractors, spread key.
- [ ] Discipline adaptations applied (§6).
- [ ] All facts sourced (NCERT or web-verified); no memory-facts.
- [ ] Saved via `book-writer`; all 21+ pages re-validate; `published: false`.
