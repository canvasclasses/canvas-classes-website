# Life Skills Strand — Canonical Workflow

> **Single source of truth for the Life Skills books and skill-break pages.**
> When building any Life Skills content, follow this document exactly. It sits
> alongside `BOOK_PAGE_WORKFLOW.md` (which still governs block mechanics, the
> reading-surface palette, image style, and the content-protection rules — all
> of that applies here too). Where the two conflict on Life-Skills-specific
> matters, this document wins.
>
> Parent plan: [`_agents/plans/LIVEBOOK_21C_VEDIC_VISION.md`](../plans/LIVEBOOK_21C_VEDIC_VISION.md)
> Founder decisions locked 2026-07-03: standalone books per class, skills split
> across Class 9 + 10 only (11/12 syllabus too heavy; 8th may join later),
> hybrid placement, Focus module pilots first. **Strand brand name: PENDING** —
> slugs below are brand-neutral so naming never blocks building.

---

## 1. What This Strand Is

The Life Skills strand teaches the skills students need for the next decade —
**focus, stress management, health, money, communication** — as a first-class
part of the Canvas learning system, connected to Indian Vedic teaching the same
way the Class 9/10 science track already is (BOOK_PAGE_WORKFLOW.md §13), but
going deeper: here the tradition's *practices* (dhāraṇā, prāṇāyāma, dinacharyā)
are the curriculum itself, taught in modern, evidence-aligned language.

**Two placement surfaces (the hybrid model):**

| Surface | What it is | Why it exists |
|---|---|---|
| **Standalone books** — one per class | `life-skills-class-9`, `life-skills-class-10` in the `books` collection, same page engine as every Live Book | Shelf presence: parents, students, and investors can *see* the differentiator |
| **Skill-break pages** — inside academic books | 1 short page (≤5 min) inserted between chapters of the Class 9/10 academic books, each linking into the standalone book | Exam-focused students meet the skills where they already are; the demo shows it |

**The core mechanic that makes this strand different from a "moral science
textbook": every page makes the student DO something, not just read.** That is
what the three practice blocks (§5) exist for.

---

## 2. Books & Structure

| Book | Slug | Theme | Modules |
|---|---|---|---|
| Life Skills — Class 9 | `life-skills-class-9` | **Master yourself** (mind + body) | 1. Focus & Attention · 2. Stress & Emotions · 3. Health (sleep, food, movement, screens) |
| Life Skills — Class 10 | `life-skills-class-10` | **Master your world** (money + people) | 1. Money & Financial Literacy · 2. Communication & Relationships · 3. Exam Season (short applied revisit of focus + stress in the board year) |

- Slugs are brand-neutral on purpose — the display `title` carries the brand
  name once the founder picks it; renaming a title later is a one-field update,
  renaming a slug breaks URLs.
- Each **module = a chapter** (`chapter_number` 1–3). Pages within a module are
  ordinary `book_pages`.
- Why this split: Class 9 gets the self-regulation foundation (focus/stress
  tools must be *practiced before* the board year, not discovered during it);
  Class 10 gets the outward-facing skills plus a light applied revisit when
  exam pressure is real. When an 8th-grade book joins later, it takes the
  gentlest habits (screens, sleep, attention basics) and Class 9/10 deepen.

---

## 3. Target Reader & Voice

Same reader as the Class 9/10 Vedic-Fusion science track (BOOK_PAGE_WORKFLOW.md
§1): a smart, curious student in a North Indian English-medium school, easily
lost in academic English. Additional rules for this strand:

- **Never preachy.** This is the fastest way to lose a 14-year-old. No "you
  should", no "good students always". Frame everything as *how your mind/body
  actually works* + *a tool you can try in 2 minutes*. The student is the
  scientist; their own attention is the lab.
- **Name the enemy honestly.** Students know reels are eating their attention —
  they don't need moralising, they need the mechanism explained (variable
  reward, dopamine prediction error, attention residue) in plain words, and a
  counter-move that works.
- **Classroom-teacher vocabulary, zero AI tells** (same bar as the Live Book
  page-quality standard). Hinglish twins can come later exactly like the
  science pages; write English-first.

---

## 4. Page Anatomy — the 6-beat arc

Every standalone-book page follows this arc (blocks in this order; beats 4–6
are what make it a *practice* page, not an essay):

| Beat | Block(s) | Notes |
|---|---|---|
| 1. **Verse anchor** | `callout[fun_fact]`, three-part format | Same Sanskrit → Hindi → English format as §12.8/§13.1 of BOOK_PAGE_WORKFLOW.md. Chosen because it *genuinely* speaks to the page's skill (see §7). |
| 2. **Hook** | `curiosity_prompt` or `text` | A question or scene from the student's real life ("You opened your book 20 minutes ago. How much do you remember reading?") |
| 3. **Concept** | **`section` (50-50): `text` left + `image` right**, plus `comparison_card`, `inline_quiz` | The mechanism, plainly explained. One concept per page. **Image-heavy rule (founder, 2026-07-03): every substantial concept text block is wrapped in a 50-50 `section` — text in the left column, an illustrative image in the right column.** Short cue/transition texts stay full-width. Standard image style rules apply. |
| 4. **Practice** | **`guided_practice`** | The do-it-now exercise. Every page has one. ≤3 minutes for the first pages of a module. |
| 5. **Reflection** | **`reflection_journal`** | One prompt tying the practice to the student's own experience. |
| 6. **Carry it forward** | **`habit_tracker`** (module-level) or `text` cue | The final page of each module carries the module's N-day challenge; other pages end with a one-line "tonight, try…" cue. |

Skill-break pages (§9) compress this to beats 1 + 4 + 6.

**Image budget per page (image-heavy standard, founder decision 2026-07-03):**
1 full-width hero (16:5) + 1 side image (4:3) per concept text block — normally 2 —
so **~3 images per page, ~30 per module**. Side images ride in the right column of a
50-50 `section` (text left, image right — the founder's requested orientation).
All images start as `src:''` placeholders with `generation_prompt`s in the standard
hand-drawn dark style and are filled by the `scripts/livebook-images/` pipeline.

---

## 5. Life Skills Block Types

Three block types built for this strand (shipped 2026-07-03). Types:
`packages/data/types/books.ts` · Zod: `packages/data/books/schemas.ts` ·
Renderers: `packages/book-renderer/blocks/lifeskills/`.

### 5.1 `guided_practice` — the do-it-now block

```json
{
  "id": "uuid",
  "type": "guided_practice",
  "order": 4,
  "practice_kind": "breathing",
  "title": "The 2-Minute Breathing Reset",
  "intro": "One round of slow breathing lowers your heart rate — you can feel it happen.",
  "steps": [
    { "id": "uuid", "instruction": "Sit up straight. Let your shoulders drop." },
    { "id": "uuid", "instruction": "Follow the circle — breathe in as it grows, out as it shrinks." }
  ],
  "breath_pattern": { "inhale_sec": 4, "hold_sec": 4, "exhale_sec": 6, "cycles": 6 },
  "completion_note": "Notice your shoulders. That heaviness that just left — that was you doing it, not the app."
}
```

- `practice_kind`: `breathing` | `focus_timer` | `meditation` | `observation` | `custom`.
- **With `breath_pattern`**: the renderer shows an animated pacer circle
  (grow = inhale, shrink = exhale) for `cycles` rounds; `steps` become
  pre-practice setup notes shown before Begin.
- **Without `breath_pattern`**: steps run in sequence; a step with
  `duration_sec` shows a countdown + progress bar and auto-advances; a step
  without waits for a tap. Use this for focus sprints (one long timed step)
  and observation drills.
- `audio_url` (optional): a guided audio track (R2) offered before Begin.

#### 5.1.1 Breathing-reset reflection convention — before / after / how it felt / why (added 2026-07-05)

Any breathing-reset `guided_practice` (Focus's 4-4-6, and any future breathing
reset in Stress/Health) must close the loop on **both sides** of the practice,
not just the after:

- **Capture a baseline.** Add one line to the practice's `intro` nudging the
  student to notice their breath *before* pressing Begin ("how does your breath
  feel right now — fast, slow, shallow, deep?"). This makes "before" a real
  observation, not a retrospective guess.
- **The `reflection_journal` right after must ask all four:** how it felt
  during, what it was like **before**, what it's like **after**, and **why**
  the student thinks the shift happened. Fold in whatever page-specific asks
  already exist (e.g. "where in the body did you feel the exhale land," "pick
  your trigger moment") — don't drop them, add the four-part structure around
  them. See `breath-the-remote-control` page 6 (`scripts/lifeskills_focus_page6_stress_link.js`)
  for the reference wording.

**Why:** the founder's point — breathing and stress are a two-way relationship,
so the pedagogy should make the student *feel* the before/after gap and reason
about *why*, not just perform the technique and move on.

### 5.2 `reflection_journal` — the private thinking box

```json
{
  "id": "uuid",
  "type": "reflection_journal",
  "order": 5,
  "prompt": "When did you last lose track of time doing something — what was it?",
  "min_words": 20
}
```

- Saves on-device with a visible "Private — stays on this device" label.
  `min_words` is a gentle nudge under the box, never a gate.

### 5.3 `habit_tracker` — the N-day challenge card

```json
{
  "id": "uuid",
  "type": "habit_tracker",
  "order": 6,
  "title": "7-Day Focus Challenge",
  "habit": "One 25-minute focus sprint with your phone in another room.",
  "duration_days": 7,
  "why": "Attention is a muscle. Seven days of reps is where students first feel the difference."
}
```

- One check-in per calendar day; day cells fill left to right. Missed days get
  a no-guilt nudge ("the streak that matters is the one you restart") — never
  punish, never reset. `day_labels[]` optionally varies the task per day.

### 5.3.1 `focus_game` — the Steady Flame focus meter (added 2026-07-04, redesigned same day)

A **watch-the-flame, self-caught mind-wandering meter** used as the pre/post
measurement bookend (replaced the old "60-second stillness test" on Focus pages
1 & 10). One candle flame breathes on screen; a timer counts **up** beside it
showing the student's current unbroken hold. The instant they catch their mind
wandering they **tap** — which logs a "slip", resets the timer to zero, and
flickers the flame. Renderer: `blocks/lifeskills/FocusGameRenderer.tsx`.

> **History:** the first build (same day) was a gradCPT/SART tapping game
> (lanterns, lit/unlit, a 0-100 steadiness score). The founder judged that its
> abstract score "didn't make a student *feel* the problem" and asked for a
> flame + timer that surfaces the *urgency*. The block type/schema were unchanged;
> only the renderer + on-page copy were rebuilt. Do not reintroduce the lantern
> version.

```json
{
  "id": "uuid", "type": "focus_game", "order": 7,
  "test_id": "focus-attention",          // shared key so baseline + retest compare
  "role": "baseline",                     // 'baseline' | 'retest' | 'standalone'
  "title": "The Steady Flame — Watch Your Focus",
  "intro": "...", "duration_sec": 120, "completion_note": "..."
}
```

**Design rules (do not break):**
- **The headline metric is the LONGEST unbroken hold, in seconds** — almost always
  shockingly short (20-40s). Sub-stats: times slipped + average hold. This is a
  self-caught mind-wandering measure (a validated paradigm), not a reaction game.
- **The urgency reveal is the pedagogy.** The end screen extrapolates the student's
  average hold to a 45-minute class ("your attention would reset ~N times") — the
  wake-up call the rest of the chapter then answers. That small number is the point.
- **The reset-to-zero is the felt moment.** Watching your own timer fall back to 0
  on a tap is the visceral "I lost it" the chapter is built on. Keep it.
- **Deliberately un-game-y:** no points, no combos, no sound, no juice. A flashy
  focus game would be the very reels-style dopamine loop the chapter warns against.
- **Honest framing (evidence bar §7):** copy frames it as a *measure* + one *rep* of
  the notice-and-return skill — NEVER as a standalone "focus trainer". No evidence
  such games transfer to real focus; the chapter's daily practice is the training.
- **Vedic bridge:** steady flame-gazing IS *Trataka* (त्राटक) — an ancient
  concentration practice, here turned into a measurable self-test. This is the
  concrete modern-science ↔ Vedic-teaching link the whole strand is reaching for.
- **baseline vs retest:** both blocks share one `test_id`; the retest (page 10)
  reads the baseline (page 1) run from per-device storage and shows the delta in
  seconds (longest hold page-1 → page-10).
- Persistence is per-device localStorage (`canvas_practice:focus:<test_id>`), same
  pilot scope as §5.4.

### 5.3.2 `attention_xray` — the Notification Autopsy (added 2026-07-04)

An interactive reveal that **every innocent-looking part of a phone screen is a
deliberate, tested design choice** built to keep you scrolling — the *Social
Dilemma* idea, taught in our own classroom voice (we teach the documented design
mechanisms, never copy the film). The student taps each card to flip it (the
innocent thing → the hidden intent); once **all** cards are flipped, a closing
panel unlocks the business-model reveal (*you are the product*) and lands on
agency, not fear. Renderer: `blocks/lifeskills/AttentionXrayRenderer.tsx`. First
use: Focus page 3 ("Why Reels Feel Impossible to Stop").

```json
{
  "id": "uuid", "type": "attention_xray", "order": 7,
  "title": "The Notification Autopsy",
  "intro": "...tap each part...",
  "cards": [ { "id": "uuid", "front": "🔴 3", "label": "The little red dot", "reveal": "Red reads as danger…" } ],
  "closing": "you are not the customer — you are the product… (markdown, 1-2 paras)",
  "watch_note": "Want the full story? Watch *The Social Dilemma*…"
}
```

**Design rules (do not break):**
- **Content-driven** — all copy lives in the DB block; the renderer only handles
  the flip + gating. Retune wording without touching code.
- **Honest sourcing (evidence bar §7):** every reveal is a *documented* design
  practice (red-dot A/B testing, variable rewards, infinite scroll's inventor's
  public regret, attention-as-product). No invented stats. **Never reproduce the
  documentary's footage/script** — teach the underlying mechanisms in our voice.
- **Empowering, not doom:** the closing must end on "a student who can see the
  trick can beat it." No "quit all social media," no fear-mongering.
- The closing is **gated** behind flipping all cards, so the reveal lands after
  the student has *earned* it card by card.

### 5.3.3 `self_experiment` — notice → pinpoint → learn (added 2026-07-04)

A reusable block: the student runs a small real-world **experiment** (e.g. 5
minutes without reaching for the phone), then **multi-selects** which urges/
sensations showed up from a fixed list, and **each selected option reveals a
tailored plain-English explanation** of what that signal means. Turns a passive
"sit and watch" drill into an active notice → pinpoint → learn loop. Reusable
across the strand (focus / stress / health). Selections persist per-device.
Renderer: `blocks/lifeskills/SelfExperimentRenderer.tsx`. First use: Focus page 3
(replaced the old "Urge Surfing" `guided_practice` observation drill).

```json
{
  "id": "uuid", "type": "self_experiment", "order": 9,
  "title": "The 5-Minute Experiment",
  "intro": "...run a tiny experiment on yourself...",
  "steps": ["Put your phone across the room…", "Set 5 minutes…", "Notice what your mind does…"],
  "duration_sec": 300,
  "prompt": "Which of these showed up? Tick every one you felt.",
  "options": [ { "id": "uuid", "label": "A sudden itch to 'just check'…", "explanation": "That itch is a phantom cue…" } ],
  "min_select": 1,
  "completion_note": "the urge is not a command…"
}
```

**Design rules (do not break):**
- **Content-driven** — experiment, options, and per-option explanations all live
  in the DB block. The renderer handles timer + multi-select + reveal only.
- **Optional timer** (`duration_sec`): when set, the student can run a live
  countdown OR skip straight to "what I noticed" — never coercive.
- **Every option has a kind explanation** — including the "not much happened" one.
  No wrong answers; the tone is a scientist observing, not a test.
- Persistence is per-device localStorage (`canvas_practice:experiment:<blockId>`),
  same pilot scope as §5.4.

### 5.3.4 `guided_reveal` — the paced walkthrough / "slide deck" (added 2026-07-05)

A **click-to-advance walkthrough** that takes the student through an argument ONE
beat at a time — a build-up: the current beat is the bright focus, past beats
settle into a dimmed trail so the whole argument stays visible to scroll back
over. Advance by clicking the stage, the Next button, or the keyboard (→/Space
forward, ← back). Reusable **platform-wide** (any concept that benefits from a
paced reveal — a chemistry mechanism, a physics derivation), not just Life Skills.
Renderer: `blocks/lifeskills/GuidedRevealRenderer.tsx`. First use: Focus page 4
("The Multitasking Myth") — dismantles the "music helps me study" belief via the
shared-language-channel mechanism.

```json
{
  "id": "uuid", "type": "guided_reveal", "order": 3,
  "title": "The Multitasking Myth — one step at a time",
  "intro": "Tap to walk through it…",
  "steps": [
    { "id": "uuid", "kind": "point", "kicker": "The claim", "headline": "…", "body": "…(markdown)", "image_src": "…(optional)" },
    { "id": "uuid", "kind": "cost_checker", "kicker": "Test your own setup", "headline": "Will your playlist cost you?",
      "checker": {
        "task_label": "What are you studying?",
        "tasks":  [ { "id": "uuid", "label": "Reading / theory", "weight": 2 }, { "label": "Drilling known sums", "weight": 1 }, … ],
        "audio_label": "What's playing?",
        "audios": [ { "id": "uuid", "label": "Songs with lyrics", "weight": 2 }, { "label": "Instrumental", "weight": 1 }, { "label": "Silence", "weight": 0 } ],
        "verdicts": { "high": "…", "mild": "…", "clear": "…" }
      } }
  ],
  "outro": "…(markdown, shown after the last beat)"
}
```

**Design rules (do not break):**
- **Content-driven** — every beat's copy lives in the DB; the renderer only handles
  the reveal, the transitions, keyboard/click advance, and the checker math.
- **Two step kinds:** `point` (kicker + headline + body + optional image) and
  `cost_checker` (a tiny interactive verdict tool). The checker verdict tier =
  `task.weight × audio.weight` (≥4 **high** red · ≥2 **mild** amber · else **clear**
  green); copy for the three tiers lives in `checker.verdicts`. Keep weights honest
  (they encode a real mechanism — here, language-load × lyric-clash).
- **Build-up, not replace** — past beats stay visible (dimmed). An argument that
  builds needs its thread kept; don't switch to slide-replace.
- **Accessible + calm motion** — click AND keyboard advance; entrance animation is
  `motion-safe:` only (respects reduce-motion); a gentle pulse on the Start button
  teaches the interaction.
- **No persistence** — a walkthrough is a read-through, not a saved practice; it
  resets each visit (with a "walk through it again" restart).

### 5.3.5 Accent colour — use the `--book-accent` token, NEVER hardcode (design decision 2026-07-05)

Reading surfaces must not carry a high-saturation accent that competes with the
content for the reader's attention (the founder flagged the bright amber as
"too strong… makes it difficult to focus" — doubly wrong on a *focus* chapter).
So Live Books interactive blocks use a **calm steel-blue accent**, defined once as
CSS tokens in `apps/student/app/globals.css` `:root`:

```css
--book-accent: #9fb2d4;                          /* labels, headings, button text, active markers */
--book-accent-strong: #8fa6c9;                   /* thin progress fills, small solid elements */
--book-accent-bg: rgba(159,178,212,0.12);        /* tinted button / selected-card background */
--book-accent-border: rgba(159,178,212,0.40);    /* accent borders */
```

**Rules:**
- **Every interactive block reads the token**, never a hardcoded hue:
  `style={{ color: 'var(--book-accent, #9fb2d4)' }}` (always include the fallback,
  since the admin preview may not define the vars). All current blocks
  (`focus_game`, `attention_xray`, `self_experiment`, `guided_reveal`,
  `habit_tracker`) already do — copy that pattern for any new block.
- **This is the one knob.** Retune the accent for the whole strand by editing the
  four `:root` values — do not touch individual renderers.
- **Do NOT use the global orange/amber** (`#d97706`/`#fbbf24`, `orange-500`) on any
  Live Books reading surface. That warm accent stays in Crucible / the admin shell.
- **Exceptions that legitimately keep their own colour** (not the accent):
  semantic traffic-lights (the `guided_reveal` cost-checker verdict = red/amber/
  green), success/positive signals (emerald "done"/"noticed"), and literal
  content (the `focus_game` candle FLAME is warm — a blue flame would be wrong).

### 5.4 Persistence — pilot scope (deliberate)

All three save to **per-device localStorage** (`canvas_practice:<blockId>`,
helper in `blocks/lifeskills/practiceStorage.ts`). Server-side sync via the
progress API is a **planned follow-up**, gated on the pilot proving the format —
do not add API routes for this without a session decision. Journal entries stay
on-device **by design** even after sync exists (privacy promise in the UI).
Consequence to keep in mind while authoring: progress doesn't follow the
student across devices yet, and clearing browser data clears it.

### 5.5 Admin editor status

The admin books-editor **preview pane renders all three correctly** (it uses
`@canvas/book-renderer`). Dedicated *editing* forms in the block editor are not
built yet — pilot pages are authored via `scripts/lib/book-writer.js` like all
agent-authored content. If a founder-editing need appears, that's the trigger
to build the editor forms.

---

## 6. Vedic Integration Rules (this strand = Level 3 of the fusion)

The science track anchors pages with verses (L1) and lineage cards (L2). This
strand is where the tradition's **practices** live (L3). Rules:

1. **Verse anchors follow the §12.8 three-part format** (Sanskrit śloka →
   Hindi bhāvārth → English meaning) and must genuinely map to the page's
   skill. Canonical pairings to draw from: dhāraṇā/dhyāna (Yoga-sūtra 3.1–3.2,
   Gita 6.35 *abhyāsena tu kaunteya*) → focus; sthitaprajña passages (Gita
   2.54–2.58) → emotional steadiness; prāṇāyāma (Gita 4.29, Yoga-sūtra 2.49–52)
   → breathing; śarīram ādyaṁ khalu dharma-sādhanam → health; Arthashastra +
   ṛṇa (debt) teachings → money; satyaṁ brūyāt priyaṁ brūyāt → communication.
2. **Practices are taught secularly and mechanistically.** Dhāraṇā is
   "attention reps on a single object", prāṇāyāma is "slow exhale → vagus
   nerve → lower heart rate". The tradition gets full credit as the source;
   the explanation stays physiological. No religious instruction, no ritual
   prescription — a student of any background must feel the page is for them.
3. **Anti-inflation rule (hard).** Never claim the tradition anticipated
   modern science it didn't ("the Vedas knew about dopamine"). The honest
   claim is strong enough: *this tradition built systematic attention and
   self-regulation training millennia before psychology named it.* Every verse
   citation names its actual source text + verse number in the page's
   authoring notes (LIVE_BOOKS_STATE changelog line).
4. **Anti-tokenism rule** (inherited from §13.4): the value must emerge from
   the mechanism and the practice, never from a "this teaches us that…" moral.

## 7. Evidence Bar for Psychology & Health Claims

This strand makes claims about minds and bodies, so it carries a stricter bar
than a chemistry page:

- Only **mainstream-consensus** findings (spaced practice, sleep's role in
  memory, exercise and mood, slow-exhale downregulation, variable-reward
  loops). If a claim needs a specific 2020s study to be true, it's too fragile
  — leave it out.
- **No medical or mental-health advice.** Stress pages teach regulation tools
  and explicitly say (in-voice, not as a legal disclaimer) that ongoing
  low mood / anxiety is something to tell a trusted adult about — with the
  iCall/Tele-MANAS helpline numbers on the stress module's opener page.
- **No pop-neuroscience myths**: no "left/right brained", no "we use 10% of
  our brain", no "listening to X makes you smarter", no dopamine-detox
  pseudoscience. When debunking is the point (multitasking myth), cite the
  mechanism (attention switching cost), not a factoid.
- Finance pages: concepts and habits only (compounding, budgeting, scam
  patterns, ads-vs-needs) — **never investment advice or product
  recommendations**.

## 8. LaTeX / Formatting

Standard rules apply (CLAUDE.md §4). Finance pages will use `$…$` for
compounding math — same spacing/escaping rules as science pages.

---

## 9. Skill-Break Pages (the woven half of the hybrid)

- **What:** one page, ≤5 minutes, inserted as the last page of selected
  chapters in the Class 9/10 **academic** books. Compressed arc: verse anchor →
  `guided_practice` → one-line cue + `practice_link`-style pointer into the
  standalone book ("this is practice 3 of the Focus module — the full
  training lives there").
- **Placement heuristic:** after heavy/abstract chapters (where fatigue and
  frustration actually occur), not after every chapter — 3–4 per book
  maximum, so they stay special.
- **They reuse the standalone book's practices** (same exercise, same
  wording), so the skill break is a doorway, not a fork.
- Skill-break pages live in the academic book's `book_pages` and follow that
  book's numbering; tag them `life-skills-break` so state scripts can count
  them.

---

## 10. Pilot Blueprint — Focus Module (Class 9, Chapter 1)

10 pages. Every claim in beat 3 must clear §7; every verse must clear §6.

| # | Slug | Page | Practice (beat 4) |
|---|---|---|---|
| 1 | `your-attention-is-a-superpower` | The module opener + **baseline check**: a 3-minute focus task + 5-question self-report (this is the "pre" measurement) | `guided_practice[observation]` — 60-second single-object attention test |
| 2 | `the-spotlight-in-your-head` | Attention as a spotlight: one beam, aim it or lose it. Selective attention, what "paying" attention costs | `guided_practice[observation]` — spotlight drill: 90 seconds on one sound |
| 3 | `why-reels-feel-impossible-to-stop` | The variable-reward loop, plainly: slot machines, notification pings, infinite scroll. The honest mechanism, zero moralising | `guided_practice[observation]` — urge-surfing: notice the pull to check the phone for 2 minutes without acting |
| 4 | `the-multitasking-myth` | Task-switching cost + attention residue. Why "studying with WhatsApp open" is studying at half speed | `guided_practice[focus_timer]` — 10-minute single-task sprint |
| 5 | `dharana-the-original-attention-training` | The Vedic core page: dhāraṇā → dhyāna as reps for the mind (Yoga-sūtra 3.1–3.2, Gita 6.35 — Krishna agrees the mind is restless, *and* says practice tames it) | `guided_practice[meditation]` — 3-minute breath-counting dhāraṇā |
| 6 | `breath-the-remote-control` | Slow exhale → calm body → steadier attention. The physiological sigh / 4-4-6 pattern | `guided_practice[breathing]` — 4-4-6 pacer, 6 cycles |
| 7 | `design-your-environment` | Out of sight = out of mind is real (phone-in-another-room effect); friction design for your desk | `guided_practice[custom]` — 5-step desk + phone setup, right now |
| 8 | `the-25-minute-sprint` | The focus sprint protocol (work/break rhythm); what to do when the urge to switch hits mid-sprint | `guided_practice[focus_timer]` — one real 25-minute sprint |
| 9 | `sleep-the-night-shift-of-memory` | Sleep as when learning is written to storage; late-night scrolling as double theft (sleep + next-day attention) | `guided_practice[custom]` — tonight's wind-down: 3 steps |
| 10 | `your-7-day-focus-challenge` | Module closer + **post-check** (same task + self-report as page 1 → the student sees their own delta) | **`habit_tracker`** — the 7-Day Focus Challenge (daily sprint, phone away) |

Every page: `reflection_journal` at beat 5. Pages 1 and 10 are the measurement
bookends (Phase 5 of the parent plan starts here, cheaply).

---

## 11. Required Rituals (non-negotiable, same as every Live Book)

1. All page mutations via `scripts/lib/book-writer.js` (CLAUDE.md §0.6).
2. After any content change: `node scripts/livebooks-state.js` + one dated
   changelog line in `LIVE_BOOKS_STATE.md`, recording verse sources used.
3. Images follow the standard style (hand-drawn, dark bg, muted earthy
   palette — see memory/livebook image style) via the `scripts/livebook-images/`
   pipeline.
4. Cockpit row update in `_agents/PROJECTS.md` at check-out (CLAUDE.md §0.5).

## Changelog
- 2026-07-03 — Doc created. Hybrid model, Class 9/10 split, 6-beat page anatomy,
  three practice blocks shipped, Vedic L3 rules, evidence bar, Focus module
  blueprint (10 pages). Strand name still pending (slugs brand-neutral).
