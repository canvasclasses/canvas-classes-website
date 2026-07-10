---
title: Anatomy & Physiology Live Book — continuation brief (Science-of-Yoga-informed)
date: 2026-06-21
status: active — content structure phase next, then images
---

# Anatomy & Physiology Live Book — CONTINUATION BRIEF

> **Read this first, then `_agents/state/LIVE_BOOKS_STATE.md` (Anatomy & Physiology section),
> the `_agents/PROJECTS.md` rows "Anatomy & Physiology Live Book" / "↳ … Ch.2 Heart" /
> "3D Anatomy Viewer", `_agents/workflows/BOOK_PAGE_WORKFLOW.md`, and CLAUDE.md §0.6
> (content protection) + §6 (sims).** This brief is the single handoff for resuming the work.

## 0. ONE-LINE STATUS
A new class-agnostic Live Book **"Anatomy & Physiology"** (`anatomy-physiology`, biology,
grade-11 anchor) exists with **2 complete, UNPUBLISHED chapters** (Skeletal System + Heart &
Circulation, 12 pages, all pass `validateBlocks`). The next phase is a **content-structure
upgrade** informed by DK's *Science of Yoga* (analysis done this session), THEN sourcing
accurate images. **Nothing is published — do not publish without explicit founder consent
(publishing = live on production canvasclasses.in).**

## 1. WHAT ALREADY EXISTS (built this session)
- **3D sims (live in the Biology Hub):** `skeleton-3d` ([Skeleton3DViewer.tsx](../../apps/student/features/anatomy/Skeleton3DViewer.tsx))
  and `heart-3d` ([Heart3DViewer.tsx](../../apps/student/features/anatomy/Heart3DViewer.tsx)),
  registered in [extraSimulators.tsx](../../apps/student/features/books/lib/extraSimulators.tsx),
  catalog [biologySimulations.ts](../../packages/data/simulations/biologySimulations.ts).
  Skeleton model is `apps/student/public/anatomy/skeleton-v8.glb` (warm-bone material + N8AO +
  costal cartilage + intervertebral discs + a "Ligaments + joint cartilage" toggle layer; 13
  individually-tappable skull bones). Full 3D pipeline + gotchas are in
  [ANATOMY_3D_SIMULATOR_WORKFLOW.md](../workflows/ANATOMY_3D_SIMULATOR_WORKFLOW.md).
- **The book** (`anatomy-physiology`): Ch.1 **Skeletal System** (opener + `what-your-skeleton-does`,
  `inside-a-bone`, `the-chemistry-of-bone`, `axial-and-appendicular`, `joints-where-bones-meet`);
  Ch.2 **The Heart & Circulation** (opener + `what-the-heart-does`, `the-four-chambers`,
  `heart-valves`, `follow-a-drop-of-blood`, `blood-vessels`). All `published:false`.
- **Creation scripts** (reuse their patterns): `scripts/create_anatomy_book.js`,
  `scripts/append_anatomy_pages.js`, `scripts/create_heart_chapter.js`,
  `scripts/patch_anatomy_quality.js`, `scripts/patch_heart_quality.js`,
  `scripts/_validate_anatomy.ts` (run: `node --import tsx scripts/_validate_anatomy.ts`).

## 2. THE DECISION (from analyzing DK's *Science of Yoga*, Ann Swanson)
Our deep, **interactive** per-system model is strong and already ahead of the book in one key
way: our sims are live/rotatable/tappable where the book is static print. **Keep our model.**
But the book is better at *making anatomy matter*; adopt four things (founder approved):

1. **"In real life" application beat on EVERY page** — tie each structure to **movement,
   exercise, posture, sport, common injuries, daily life** (not just NEET facts). This is the
   founder's core ask: fundamentals + practical application, for a *global* learner.
2. **Macro → micro → clinical triad on every system** — we have macro (3D sim). Add, per page
   where it fits: a **microscope/histology view** (e.g. compact-bone osteons, muscle striations,
   cartilage cells) and a **"what can go wrong" clinical note** (osteoporosis, arthritis,
   fracture, heart attack, varicose veins…). We already started clinical (osteoporosis on
   `the-chemistry-of-bone`); make it systematic.
3. **New opening chapter "How the Body Is Built"** (atom → cell → tissue → organ → system),
   like the book's "Cell to System" page — the front door for any class. Add as a chapter
   BEFORE Skeletal (renumber, see §4 mechanics) or as a standalone intro chapter.
4. **A future "Body in Motion" application layer** (the book's "Asanas" equivalent, but broader:
   everyday movement, fitness, sport, posture, injuries) once more systems exist — colour-coded
   "muscles engaging vs stretching" can be done LIVE in our 3D engine (the book can't).
Framing throughout: **"form follows function"**, always answer **"why?"**, **simple plain
global-classroom English** (everyday word first, technical term in brackets).

## 3. NEXT STEPS, IN ORDER
**Phase A — content structure (do FIRST, per founder):**
1. Define the **canonical A&P page template** (write it into BOOK_PAGE_WORKFLOW.md or a new
   `_agents/workflows/ANATOMY_PHYSIOLOGY_BOOK.md`): hero → hook → concept (form-follows-function)
   → 3D sim / interactive_image / gallery → **micro (histology)** → **clinical "what goes wrong"**
   → **"In real life / in movement"** beat → reasoning_prompt → §3.6.1 quiz.
2. Build the **"How the Body Is Built"** orientation chapter (cell→tissue→organ→system + the
   4 tissue types + the 11 systems overview).
3. **Retrofit Ch.1 (Skeletal) + Ch.2 (Heart)** to the new template — add the "In real life",
   micro, and clinical beats where missing. Edit existing pages via `book-writer.savePage`
   (NOT direct update) preserving block ids; new pages = direct insert (additive).
**Phase B — images (AFTER structure):**
4. Fill the `src:""` placeholders + galleries with **accurate images** from, in priority order:
   - **OpenStax *Anatomy & Physiology*** (CC BY 4.0) — the goldmine: accurate full-body figures,
     histology, clinical diagrams, free with attribution.
   - **Wikimedia Commons** (check each image's license) + **public-domain Gray's Anatomy** plates.
   - **Our own Blender renders** — set up a "render kit" that turns the skeleton/heart glTF
     models (Z-Anatomy, CC BY-SA) into DK-quality labelled stills (we already have realistic
     materials: warm bone, N8AO, generated environment). These are ours, consistent, free.
   - **ChatGPT image pipeline (`scripts/livebook-images/`) ONLY as fallback** — when no
     high-quality source image exists for a setup, or to improve/clean one. (Founder decision.)
   - **Galleries:** the renderer hides empty-`src` items, and `GalleryItem` has no
     `generation_prompt` field — panel prompts currently live in `IMAGE_GENERATION_PROMPTS`
     HTML comments in the text block above each gallery. When sourcing, fill each item's `src`.
   - **NEVER copy DK's images** (copyright) — generate/render/source our own; attribute CC sources.
5. After any content change: run `node scripts/livebooks-state.js` + add a Changelog line; update
   the `_agents/PROJECTS.md` rows. Re-run `_validate_anatomy.ts`.

## 4. KEY TECHNICAL FACTS / GOTCHAS (don't relearn the hard way)
- **Data model:** `books` collection (slug, title, subject enum incl. 'biology', grade 6–12,
  board, `chapters:[{number,title,slug,page_ids[],description,is_published}]`, is_published,
  soft-delete fields). `book_pages` collection (book_id, chapter_number, page_number, slug,
  title, subtitle, `blocks` (Mixed), page_type 'lesson'|'chapter_opener', published,
  reading_time_min, content_types, soft-delete). Models: `packages/data/models/{Book,BookPage}.ts`.
- **Create vs edit:** `book-writer.savePage` **only UPDATES existing pages** (throws if absent)
  and runs the content-loss guard (blocks if it removes block ids / unlinks assets / shrinks
  >25% unless `allowContentLoss`+reason). **Creating** book/chapter/pages = direct Mongo insert
  (additive, safe). **Editing** existing pages = `savePage`, and **preserve block ids** or the
  guard fires.
- **Block shapes that bit us:** `reasoning_prompt` needs `reasoning_type`
  ('logical'|'spatial'|'quantitative'|'analogical') + `reveal` + `difficulty_level` (1–5).
  `gallery.items` = `{id,src,alt,caption?}` (no prompt field; empty src hidden by renderer).
  `image`/`interactive_image` show the `generation_prompt` as a placeholder when `src:""`.
  `latex_block.latex` has NO `$` delimiters; inline LaTeX/mhchem `$\ce{...}$` is fine.
  Validate everything with `validateBlocks` (`scripts/_validate_anatomy.ts`).
- **Quizzes (§3.6.1):** 4 options, real distractors (no filler/joke/length-tell), spread the
  correct-answer positions across A/B/C/D (no clustering), `difficulty_level` on each,
  explanation names why the key is right + why the tempting distractor is wrong (by content,
  never "option B").
- **Sims in book pages:** a `simulation` block with `simulation_id:'skeleton-3d'` / `'heart-3d'`
  renders in the student reader (via ExtraSimulatorsProvider) but **NOT in the admin editor
  preview** (injected-sim limitation). Every sim should carry a `prediction` (predict-first).
- **3D pipeline gotchas** (if building more system models): capture `matrix_world` before
  deleting parent `.g` groups; `o.modifiers.clear()` (drop inherited SUBSURF) before
  join/decimate; flip winding when `matrix_world.determinant()<0` (mirrored left bones render
  inside-out single-sided — "perfect in Blender, broken in browser" == normals/winding);
  verify exported glb with `scripts/blender/_glb_tris.js`. Z-Anatomy has every system
  ("4: Muscular system", organs, etc.) at `/tmp/z-anatomy/...` (re-fetch if gone, see workflow).

## 5. PENDING HOUSEKEEPING (need founder OK where noted)
- **Delete stale model files** `apps/student/public/anatomy/skeleton-v2.glb … skeleton-v7.glb`
  (6 files, ~32 MB; only `skeleton-v8.glb` is live). `rm` is gated → confirm with founder.
- **Remove scratch** `scripts/_validate_anatomy.ts` (or keep as the book validator — it's handy).
- **GBrain log** offered, not yet written: the session's reusable lessons (3D pipeline normals/
  subsurf/parent-transform; "spend polys where users zoom"; the realism recipe N8AO+generated-
  environment+per-tissue materials; the Anatomy & Physiology book architecture + Science-of-Yoga
  decision). Offer again / write to `~/brain/reference/`.

## 6. REFERENCE
- Inspiration book: **Ann Swanson, *Science of Yoga* (DK, 2019)** — concise system primers
  (macro figure + histology inset + clinical box + practice box) then an application layer
  (poses as anatomy-in-action, colour-coded engage/stretch). Do not copy its text/images.
- Reference-first rule + library: `_agents/reference-books/REFERENCE_LIBRARY.md`.
