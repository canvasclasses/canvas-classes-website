# Live Books 2.0 — 21st-Century Skills + Vedic Learning System + Gap-Solving Simulations

> **Status header**
> - **Status:** 🟡 Phase 0 COMPLETE + Phase 1 platform work done (2026-07-03) — canonical workflow doc written ([`LIFE_SKILLS_WORKFLOW.md`](../workflows/LIFE_SKILLS_WORKFLOW.md)), three practice block types shipped and typechecked. Pilot content authoring is next.
> - **Last touched:** 2026-07-03
> - **Next action:** Author the Focus module (10 pages per the blueprint in LIFE_SKILLS_WORKFLOW.md §10): create `life-skills-class-9` book + Chapter 1, write pages via book-writer, then images via the livebook-images pipeline. Founder can pick the brand name any time — slugs are brand-neutral, so naming never blocks.
> - **Blocked on:** Nothing hard. Brand name pending (display-title-only decision).
>
> **Decisions locked 2026-07-03 (founder):**
> - Standalone Life Skills book **per class**, skills split across **Class 9 + Class 10 only** — Class 11/12 syllabus is too heavy for additional study. Later the strand may widen to Class 8–10.
> - Split: Class 9 = "master yourself" (Focus, Stress, Health) · Class 10 = "master your world" (Money, Communication, + short Exam Season applied revisit).
> - **Hybrid placement confirmed** (standalone books + inter-chapter skill breaks).
> - **Focus module confirmed as pilot.**
> - Strand brand name: **pending** (only remaining open decision; cosmetic).

## Why this exists (the founder's framing, 2026-07-03)

"NCERT content refined a little" is not a revolutionary product and is hard to pitch to
investors. The product must ALSO teach the skills students need for the next decade —
communication, finance, health, stress management, and above all **the ability to focus**
in an age of ultra-fast content that degrades attention. All of it must connect to Vedic
teaching so this becomes a truly Indian learning system relevant to modern times. And
simulations must solve real learning gaps, not be fancy sliders and graphs.

---

## PART 1 — GAP ANALYSIS (what today's Live Books can and cannot do)

### What already exists (stronger than assumed)

1. **The Vedic thread is already live — but shallow.** The Class 9/10 track is literally
   named "Vedic Fusion" (`BOOK_PAGE_WORKFLOW.md` §13): every page opens with a Gita/
   Upanishad/Veda verse in Sanskrit → Hindi → English three-part format, with one echo in
   the body and a no-tokenism rule ("the moral must emerge from the story of science
   itself"). Class 11/12 pages carry none of it.
2. **The block engine is rich (~40 block types)** — text, image, gallery, interactive
   image, video, audio, molecule 2D/3D, simulation, inline quiz with Bloom-tier ladder
   (L1→L3), reasoning_prompt, curiosity_prompt, meet_a_scientist, cultural_context_card,
   narrated_passage, dialogue_role_play, pronunciation_drill, practice banks. This engine
   can carry most life-skills content **without platform work**.
3. **A `tier: core | competitive` field already exists on every block** (stored, not yet
   enforced) — a ready-made hook for packaging/monetising the skills strand.
4. **The data loop half-exists**: Crucible knows what students get wrong per chapter/tag;
   the student-signal watchdog surfaces failed/abandoned concepts. Nothing feeds this into
   simulation choice yet.

### Gap 1 — Life-skills content: 100% absent
No book, chapter, page, template, or workflow doc touches communication, finance, health,
stress management, or focus/attention. All 5 books in the DB are academic (Chem 11/12,
Math 9, ICT 9, Hindi 9, Anatomy). The vision's core differentiator has zero footprint.

### Gap 2 — The engine teaches *knowing*, not *doing*
Every existing block type is read/watch/answer. Skills like focus and stress management
are built by **practice + repetition + reflection**, and the engine has no block for that:
no guided-exercise/timer block (breathing, focus sprints), no reflection-journal block, no
habit/streak tracking, no "come back tomorrow" mechanic. `userprogress` tracks question
attempts, not practices. This is the only real *platform* gap — everything else is content.

### Gap 3 — Vedic integration is decorative, not systemic
Today: verse opener + one echo, Class 9/10 only. A "truly Indian learning system" needs
three levels, of which only Level 1 exists:
- **L1 Anchor** (exists): verse opens the page.
- **L2 Lineage** (missing): Indian intellectual history taught *as content* where it is
  real — Pingala/binary, Baudhayana/geometry, Kanada/atomism, Charaka–Sushruta/medicine,
  Arthashastra/finance & governance. Rigorous sourcing, never inflated claims.
- **L3 Practice** (missing): actual techniques from the tradition, taught secularly and
  evidence-aligned — dhāraṇā/dhyāna → attention training; prāṇāyāma → stress physiology;
  Gita's sthitaprajña → emotional regulation; śaucha/dinacharyā → health routines. This is
  where Vedic teaching and the 21st-century-skills strand are the SAME feature, not two.

### Gap 4 — Simulations govern *look*, not *learning*
`SIMULATION_DESIGN_WORKFLOW.md` is a strong visual-consistency + accuracy ruleset (colors,
typography, anti-patterns) but has **no pedagogical gate**: nothing requires a sim to
target a documented misconception, and no sim is chosen from Crucible wrong-answer data.
That is exactly how "fancy sliders and graphs" happen: a sim that lets you vary M in
M = n/V is decoration; a sim that makes you *predict* what happens to boiling point when
you add salt, then confronts your wrong prediction, changes a mental model.

### Gap 5 — No measurement, so no investor story
Nothing today can produce the sentence "students on Canvas improved X by Y%." No pre/post
deltas, no attention-span metrics, no self-report scales. The focus thesis ("we rebuild
attention that reels destroyed") is the most pitchable claim and currently unprovable.

---

## PART 2 — THE PLAN (5 phases, sequenced so content leads and platform work stays minimal)

### Phase 0 — Name and frame the strand (founder decisions, ~1 session)
1. **Name it.** It needs an identity for the pitch deck and the UI. Candidate directions:
   *Jeevan Vidya*, *Sanskar*, *The Fifth Subject*, *Gurukul 2.0* (founder's call — this is
   brand).
2. **Placement model — recommendation: hybrid.**
   - A **standalone Life Skills book** per class level (its own shelf presence = visible
     differentiator for parents/investors), PLUS
   - **Inter-chapter "skill breaks"**: 1 short skill page inserted between academic
     chapters (e.g. after a heavy Thermodynamics chapter, a 5-minute "focus sprint"
     page). Standalone-only gets skipped by exam-focused students; woven-only is
     invisible in a demo. Hybrid solves both.
3. **Write the canonical workflow doc** `_agents/workflows/LIFE_SKILLS_WORKFLOW.md`
   mirroring BOOK_PAGE_WORKFLOW.md: voice, page anatomy (verse anchor → hook → concept →
   **practice** → reflection → tomorrow's cue), sourcing rules for Vedic claims
   (anti-tokenism + anti-inflation: never claim the tradition "already knew" something it
   didn't; cite the actual text), and the evidence bar for health/psychology claims
   (NCERT-grade caution; no medical advice).

### Phase 1 — Pilot: the FOCUS module (the flagship, ~2–3 weeks of content sessions)
Focus is the pilot because it is (a) the founder's strongest conviction, (b) the most
differentiating claim in the market (nobody in JEE/NEET prep teaches attention), (c) the
most natural Vedic bridge (dhāraṇā/dhyāna ARE attention training), and (d) directly
improves the academic product (students who can focus study better — self-reinforcing).

- **8–10 pages**, Class 9 level first: what attention is (spotlight model), what short-form
  video does to it (dopamine loop, in plain English), single-tasking vs multitasking myth,
  dhāraṇā as attention-rep training, the 25-minute focus sprint, environment design
  (phone out of the room), sleep and attention, a 7-day focus challenge.
- **Reuses existing blocks** for ~80% (text, callout, image, inline_quiz,
  reasoning_prompt, cultural_context_card, audio_note for guided practice).
- **Needs 3 new block types** (the only Phase-1 platform work, all following the existing
  Zod-schema + renderer pattern in `packages/data/books/schemas.ts` +
  `packages/book-renderer/`):
  1. `guided_practice` — timed, step-sequenced exercise (breathing pace, focus timer)
     with an audio track option.
  2. `reflection_journal` — a prompt + private text box persisted per user.
  3. `habit_tracker` — N-day challenge card with per-day check-ins and a streak.
  All three write to a new `skill_practice` area of user progress (extend `userprogress`
  via `packages/persona/writer.ts` conventions — no new collection unless needed).

### Phase 2 — Simulation upgrade: the "misconception-first" rule (parallel to Phase 1)
1. **Add a pedagogical gate to SIMULATION_DESIGN_WORKFLOW.md** (new §0, before the visual
   rules): every new/rebuilt sim MUST name (a) the specific misconception or
   hard-to-visualise concept it targets, (b) evidence it's a real gap (Crucible
   wrong-answer rates by tag, flag data, or teacher knowledge), and (c) follow
   **Predict → Observe → Explain**: student commits to a prediction BEFORE the sim runs,
   sim confronts the prediction, page explains the gap. A slider with no prediction step
   doesn't ship.
2. **Audit the existing ~56 sims** against that gate; rank into keep / retrofit
   (add prediction step) / rebuild. Output: a ranked list in this doc.
3. **Build the gap→sim pipeline**: a periodic pass (agent-run) over Crucible per-tag
   wrong-answer rates → "top 10 most-failed concepts with no sim" list → sim backlog.
   This turns the founder's "sims must solve learning gaps" into a standing mechanism,
   not a one-time intention.
4. **First 3 rebuilt/new sims** chosen from that list, each targeting a classic
   visualisation gap (candidates pending data: dynamic equilibrium as motion-not-stillness,
   entropy as microstates, electron cloud vs orbit).

### Phase 3 — Deepen Vedic integration to L2 + L3 (after pilot proves the format)
- **L2 Lineage:** extend the existing `cultural_context_card` / `meet_a_scientist` blocks
  with properly-sourced Indian-knowledge-system content woven into academic chapters where
  genuinely relevant (math: Pingala, Baudhayana, Aryabhata; chem: Kanada, Nagarjuna
  (rasashastra); bio/health: Charaka, Sushruta). One rule: every claim carries a primary
  text citation in the page's authoring notes.
- **L3 Practice:** the Life Skills strand IS the L3 vehicle (Phase 1). Extend Vedic-verse
  openers to the skills pages, and — decision for the founder — optionally a lighter
  verse-anchor variant for Class 11/12 pages (currently zero Vedic presence in the
  JEE/NEET track; a "sthitaprajña under exam pressure" thread is the natural fit there).

### Phase 4 — Other four skill modules (one at a time, in this order)
1. **Stress management** (closest twin to Focus, shares the practice blocks; exam-anxiety
   angle sells itself to parents) →
2. **Financial literacy** (compounding, budgeting, UPI-era scams, Arthashastra framing;
   mostly existing blocks + inline calculators as `simulation` blocks) →
3. **Health** (sleep, food, movement, screen hygiene; overlaps Anatomy book) →
4. **Communication** (hardest to teach in-app; needs `dialogue_role_play` (exists) +
   possibly AI-conversation practice later — do last).

### Phase 5 — Measurement layer (starts with the pilot, matures by investor season)
- **Per-module pre/post check**: the Focus module opens and closes with the same short
  assessment (a timed attention task + self-report scale) → "focus score" delta.
- **Behavioural proxies** the platform already sees: reading-session length trend,
  quiz-accuracy-late-in-session (fatigue curve), habit-tracker streak retention.
- **The investor slide this buys:** "N students completed the 7-day focus challenge;
  median attention-task score improved X%; reading session length up Y%." No other
  JEE/NEET product can show that slide.

---

## What NOT to do (scope guards)

- **Don't build all five skill modules at once.** Focus pilot first; its format is the
  template for the rest.
- **Don't invent a separate content platform.** The block engine carries this; only the
  3 practice blocks are new platform work in Phase 1.
- **Don't let Vedic content inflate.** The §13.4-style anti-tokenism rule extends to the
  skills strand: no "ancient India already knew quantum physics" claims — they destroy
  credibility with exactly the investors/educators this is meant to impress.
- **Don't gate the pilot on measurement infrastructure.** Ship the content with a simple
  pre/post quiz; instrument properly once the format is validated.

## Changelog
- 2026-07-03 — Doc created from founder vision session: gap analysis of Live Books vs the
  21st-century-skills + Vedic + gap-solving-sims vision; 5-phase plan defined. Nothing
  built yet.
- 2026-07-03 (later) — Founder locked decisions (per-class books, 9/10-only split, hybrid,
  Focus pilot). Phase 0 executed: `_agents/workflows/LIFE_SKILLS_WORKFLOW.md` written
  (page anatomy, Vedic L3 rules, evidence bar, Class 9/10 module maps, 10-page Focus
  blueprint). Phase 1 platform slice shipped: `guided_practice`, `reflection_journal`,
  `habit_tracker` block types (types + Zod + renderers in
  `packages/book-renderer/blocks/lifeskills/`, localStorage persistence per §5.4 of the
  workflow doc; admin editor forms deferred — preview pane works). Student-app typecheck
  clean. Next: author the 10 Focus pages.
- 2026-07-03 (evening) — **Focus module authored.** `life-skills-class-9` book + Ch.1
  created in DB via `scripts/setup_life_skills_class9_focus.js` (insert-only, idempotent):
  10 pages / 109 blocks, all `published:false`, all validated against the Zod block gate.
  Every page follows the 6-beat arc; p1/p10 carry the pre/post 60-second measurement;
  p10 carries the 7-Day Challenge tracker. `life_skills` subject added to the Book model,
  SEO labels and library decor. Hero images are placeholder prompts for the image
  pipeline. Next: founder review → images → publish → skill-break pages + Stress module.
