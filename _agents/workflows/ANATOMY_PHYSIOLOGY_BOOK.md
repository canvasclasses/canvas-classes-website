---
title: Anatomy & Physiology Live Book — canonical page template & build workflow
date: 2026-06-22
status: active — canonical for every page of the `anatomy-physiology` book
supersedes: nothing (extends BOOK_PAGE_WORKFLOW.md for the A&P book specifically)
---

# Anatomy & Physiology Live Book — Canonical Workflow

> **Read this before authoring or editing ANY page of the `anatomy-physiology` book.**
> It is the single source of truth for the A&P page template. It **extends**
> [`BOOK_PAGE_WORKFLOW.md`](BOOK_PAGE_WORKFLOW.md) (block reference, LaTeX, §3.6.1 quiz
> rules, image style) — that doc still governs block shapes and the quiz toolchain; this
> one governs the *A&P-specific page shape and beats*. It also assumes
> [`ANATOMY_3D_SIMULATOR_WORKFLOW.md`](ANATOMY_3D_SIMULATOR_WORKFLOW.md) for the 3D sims,
> CLAUDE.md **§0.6** (content protection — never hard-delete; edit via `book-writer.savePage`),
> and the continuation brief [`_agents/plans/ANATOMY_BOOK_CONTINUATION.md`](../plans/ANATOMY_BOOK_CONTINUATION.md).

---

## 0. What this book is, and who it's for

A **class-agnostic** anatomy book: one chapter per body system (orientation, skeletal,
heart, muscular, respiratory, …), built **once** here so any grade's Biology book can
embed the chapters and the live 3D sims. Anchored to grade-11 (where anatomy depth lives)
but written for a **global classroom** — a curious 13-year-old and a NEET aspirant should
both get value from the same page.

**Our edge over print atlases (DK *Science of Yoga*, Complete Anatomy):** our macro view
is a **live, rotatable, tappable 3D model**, not a static plate. We keep that. What we
borrowed from *Science of Yoga* is how it **makes anatomy matter** — every structure is
tied to real movement, and each system gets a histology inset + a clinical box. This
template bakes those in.

### The three pillars (every page is judged on these)
1. **Form follows function** — never present a structure without answering **"why is it
   shaped/built this way?"** The shape is always the answer to a job.
2. **Macro → micro → clinical** — show the structure at three scales: the **3D/diagram**
   (macro), the **histology/microscope** view (micro), and **what goes wrong** (clinical).
3. **In real life / in movement** — tie the structure to **movement, posture, sport,
   exercise, injury, daily life** — not just exam facts. This is the founder's core ask.

### Voice (same as the rest of Live Books)
- **Simple, plain, global-classroom English.** Everyday word first, technical term in
  brackets: "the upper chambers (**atria**)", "the thigh bone (**femur**)".
- Classroom-teacher tone, never AI tells. Follow BOOK_PAGE_WORKFLOW.md §5.X (banned
  patterns) and §5 (voice).
- Always answer **"why?"**. Short sentences. Bold the load-bearing words.

---

## 1. The canonical A&P lesson-page template

A lesson page is built from these beats **in this order**. Not every beat is mandatory on
every page, but the **three new beats (micro, clinical, in-real-life) appear on every
lesson page where they make sense** — and they almost always make sense. Openers
(`page_type: 'chapter_opener'`) use only beats 0–2 + the "what you'll explore" list.

| # | Beat | Block(s) | Required? | Notes |
|---|---|---|---|---|
| 0 | **Hero banner** | `image` 16:5, `src:""`+`generation_prompt` | ✅ every page | §3.4.1. Dark, cinematic, photoreal medical-illustration. No text. |
| 1 | **Hook** | `callout` `fun_fact` ("Did you know?") | ✅ | A surprising, true number/fact that makes the system feel alive. |
| 2 | **Why it exists** | `text` | ✅ | The form-follows-function framing: what job creates the need for this structure. |
| 3 | **Core concept** | `heading`(l2 + `objective`) + `text` (+ `table`/`comparison_card`) | ✅ | The actual anatomy/physiology. One sub-topic, fully closed (§4D). |
| 4 | **Macro view** | `simulation` (predict-first) **or** `gallery`/`image`/`interactive_image` | ✅ | Prefer the live 3D sim (`skeleton-3d`/`heart-3d`) when one exists for the system. Every sim carries a `prediction`. |
| 5 | **Micro / histology view** ⭐NEW | `image` (`src:""`+`generation_prompt`, `4:3`) | ⬤ where it fits | The microscope scale: osteons in compact bone, cardiac-muscle striations, capillary wall one cell thick. See §2. Upgrade to `interactive_image` once the real image is sourced. |
| 6 | **Clinical — "what goes wrong"** ⭐NEW | `callout` variant **`warning`**, custom title | ⬤ where it fits | The pathology beat: osteoporosis, arthritis, fracture, heart attack, valve murmur, varicose veins. Title it for the condition, e.g. "When It Goes Wrong — Osteoporosis". See §3. |
| 7 | **In real life / in movement** ⭐NEW | `heading`(l2 + `objective`) + `text` (bulleted concrete examples) | ✅ every lesson | Movement, sport, posture, exercise, injury, daily life. First-class section, always visible. See §4. |
| 8 | **Reasoning check** | `reasoning_prompt` | ✅ | Mid/late. `reasoning_type` ∈ logical/spatial/quantitative/analogical, `reveal`, `difficulty_level` 1–5. |
| 9 | **Lock it in** | `callout` `remember` (or `exam_tip` for NEET points) | ✅ | The one-box summary a student re-reads before a test. |
| 10 | **Quiz** | `inline_quiz` (LAST block) | ✅ | 3 questions, §3.6.1-compliant, answer positions spread, `difficulty_level` on each. |

> **Why these three are callouts/sections, not new block types:** the `callout` `variant`
> enum is fixed (`remember|note|warning|exam_tip|fun_fact|…`). There is **no**
> `clinical`/`in_real_life` variant and inventing one fails `validateBlocks`. So:
> **clinical = `warning`** (red medical styling, custom title), **in-real-life =
> `heading`+`text`** (a real, always-visible section — `note` collapses, which buries the
> founder's core ask), **micro = `image`** placeholder. Do not try to add enum values.

---

## 2. The micro / histology beat

The 3D model shows the **macro** structure. The micro beat shows what you'd see **down a
microscope** — the level NEET actually tests and that print atlases do well.

- Block: `image`, `width:'full'`, `aspect_ratio:'4:3'`, `src:''`, with a `generation_prompt`
  following BOOK_PAGE_WORKFLOW.md **§3.14** (biology image style: dark `#0a0a0a` background,
  white labels + thin leader lines, anatomically accurate, no stylisation, functional
  colour palette — ivory bone, deep red blood, pink soft tissue).
- Caption starts with `📸 ` and names what to look for.
- **Examples per system:** compact bone → **osteons / Haversian systems** (concentric
  lamellae around a central canal); spongy bone → **trabecular lattice**; heart wall →
  **cardiac muscle striations + intercalated discs + branching fibres**; capillary →
  **endothelium one cell thick**; cartilage → **chondrocytes in lacunae**.
- **Upgrade path:** once the real histology image is sourced (OpenStax/Wikimedia, §6),
  swap the `image` for an `interactive_image` (§3.13) with hotspots placed on the *actual*
  image — hotspot coordinates only mean anything against a real picture, so never pre-place
  them on an empty `src`.

---

## 3. The clinical "what goes wrong" beat

Anatomy sticks when a student knows what breaks. One condition per page, tied to the
structure just taught.

- Block: `callout` `variant: 'warning'`, `title:` the condition (e.g. "When It Goes Wrong —
  Osteoporosis", "When It Goes Wrong — A Leaky Valve").
- 2–4 plain sentences: **what the condition is → why it follows from the anatomy → the
  human consequence**. Keep it true and non-alarming; this is education, not diagnosis.
- **Examples per page:** bone chemistry → osteoporosis; joints → arthritis; long bone →
  fracture & healing; heart muscle → heart attack (blocked coronary artery); valves →
  murmur / leaky valve; vessels → varicose veins, atherosclerosis.
- Where a structure's failure is the *whole point* of an exam question (pulmonary
  artery/vein exceptions, left-ventricle hypertrophy), the `exam_tip` callout still does
  that job — `warning` is for **pathology**, `exam_tip` for **exam traps**.

---

## 4. The "in real life / in movement" beat (the founder's core ask)

This is what separates our book from a syllabus. Every lesson ends its teaching with a
section that answers **"where does this show up in my body when I move?"**

- Blocks: `heading` (level 2, with an `objective`) + `text`. Title it concretely, e.g.
  "In real life: why your knees feel it on the stairs", "In movement: the spine as a
  spring".
- Content: 2–4 **concrete** ties — a sport, an everyday action, an exercise, a posture, a
  common injury. Bulleted. Prefer the specific ("a sprinter's push-off loads the femur to
  ~4× body weight") over the generic ("bones help you move").
- This is **not** the clinical beat (that's what *fails*); this is what the structure
  *does for you* in ordinary life and athletic life.
- **Future "Body in Motion" layer:** once several systems exist, a cross-system
  application chapter (the *Science of Yoga* "asanas" equivalent, broader) can colour-code
  "muscles engaging vs stretching" **live** in the 3D engine. Not built yet; noted so the
  in-real-life beats are written to feed it.

---

## 5. Build mechanics (read CLAUDE.md §0.6 first)

- **Creating** a book / chapter / new pages → **direct Mongo insert** (additive, safe).
  Pattern: `scripts/create_anatomy_book.js`, `scripts/create_heart_chapter.js`.
- **Editing** an existing page → **`book-writer.savePage`** ONLY. It snapshots the prior
  version, runs the content-loss guard, and writes an audit row. **Preserve every existing
  block `id`** — the retrofit splices NEW blocks (fresh uuids) into the existing array and
  re-numbers `order`; it never drops a block id, unlinks a `src`, or shrinks the page, so
  the guard stays green. If the guard ever fires, you removed something — stop and check.
- **Renumbering chapters** (to insert a chapter before existing ones) is metadata-only:
  update `books.chapters[].number` and each page's `chapter_number` (raw `updateOne` is
  fine — `chapter_number` is not page *content*, so the guard doesn't apply; never touch
  `blocks` with raw updates). The reader resolves the chapter title via
  `chapters.find(c => c.number === page.chapter_number)`, so the two must stay consistent.
- **Block-shape gotchas** (from the continuation brief — don't relearn): `reasoning_prompt`
  needs `reasoning_type` + `reveal` + `difficulty_level`(1–5); `gallery.items` =
  `{id,src,alt,caption?}` (no prompt field; empty-`src` items are hidden by the renderer —
  panel prompts live in an `IMAGE_GENERATION_PROMPTS` HTML comment in the `text` block
  above the gallery); `image`/`interactive_image` show the `generation_prompt` as a
  placeholder when `src:""`; `latex_block.latex` has **no** `$` delimiters (inline `$\ce{}$`
  is fine); a `simulation` block renders in the student reader (via
  `ExtraSimulatorsProvider`) but **NOT** in the admin editor preview.
- **Always** end with: `node --import tsx scripts/_validate_anatomy.ts` (every page must be
  valid) → `node scripts/livebooks-state.js` → add a Changelog line → update the
  `_agents/PROJECTS.md` rows. Quiz gate per §3.6.1.1 when quizzes change.
- **Nothing is published without explicit founder consent** (publishing = live on
  production canvasclasses.in). All pages stay `published:false`.

---

## 6. Image sourcing (Phase B — AFTER structure), priority order

1. **OpenStax *Anatomy & Physiology*** (CC BY 4.0) — accurate full-body figures, histology,
   clinical diagrams; free with attribution. The goldmine.
2. **Wikimedia Commons** (check each image's licence) + **public-domain Gray's Anatomy** plates.
3. **Our own Blender renders** — turn the skeleton/heart glTF models (Z-Anatomy, CC BY-SA)
   into DK-quality labelled stills (we have warm-bone material + N8AO + generated
   environment). Ours, consistent, free. See ANATOMY_3D_SIMULATOR_WORKFLOW.md.
4. **ChatGPT image pipeline** (`scripts/livebook-images/`) — **fallback only**, when no
   high-quality source exists or to clean one up.
- **Never copy DK's images** (copyright). Attribute every CC source. Fill each block's `src`
  (and convert micro `image`→`interactive_image` with real hotspots once the picture exists).

---

## 7. Page-build checklist (run before calling a page done)

- [ ] Hero (16:5) + hook + form-follows-function framing present.
- [ ] Macro view (sim predict-first, or diagram/gallery).
- [ ] **Micro/histology** beat present (or a noted reason it doesn't fit).
- [ ] **Clinical "what goes wrong"** beat present (or noted reason).
- [ ] **In real life / in movement** section present — concrete, not generic.
- [ ] A `reasoning_prompt` and a closing `remember`/`exam_tip`.
- [ ] `inline_quiz` last, 3 Qs, §3.6.1 (4 real distractors, positions spread, difficulty-tagged).
- [ ] Plain global-classroom English; everyday word before each technical term.
- [ ] `validateBlocks` passes; state + cockpit updated; `published:false`.
