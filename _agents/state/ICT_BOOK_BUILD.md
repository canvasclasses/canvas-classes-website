# Class 9 ICT — Live Book Build Ledger

> Resume ledger for the **Class 9 ICT** Live Book. Read this FIRST before any
> ICT book task. It holds the source→chapter map, the locked build settings,
> the per-chapter page plan + resume point, and the **video shot-list** (the
> brief for whoever records the software walkthroughs).
>
> Companion: `_agents/state/LIVE_BOOKS_STATE.md` (live DB inventory) and
> `_agents/workflows/BOOK_PAGE_WORKFLOW.md` (canonical block spec).

## Book identity

| Field | Value |
|---|---|
| Slug | `class9-ict` |
| Book `_id` | `7f60bb4f-3a98-4114-ad54-9c9c935af5a1` |
| Subject | `ict` (added to `Book` enum + `bookDesign.tsx` theme/decor + `bookPageSeo.ts` label, 2026-06-04) |
| Grade / Board | 9 / CBSE |
| Title | Information & Communication Technology — Class 9 |

## Source PDFs → DB chapter map

Folder: `~/Downloads/Class 9 ICT/`. Extract with `pdfplumber` (installed).

| DB Ch | Source PDF | Title | Nature |
|---|---|---|---|
| 1 | `iict101.pdf` (13p) | Introduction to ICT | Concept-only |
| 2 | `iict102.pdf` (25p) | Creating Textual Communication | LibreOffice Writer — **video-driven** |
| 3 | `iict103.pdf` (18p) | Creating Visual Communication | GIMP / image editing — **video-driven** |
| 4 | `iict104.pdf` (13p) | Creating Audio Video Communication | Audacity / OpenShot — **video-driven** |
| 5 | `iict105.pdf` (8p)  | Presenting Ideas | LibreOffice Impress — **video-driven** |
| 6 | `iict106.pdf` (15p) | Getting Connected: Internet | Concept + browser/email how-to |
| 7 | `iict107.pdf` (9p)  | Safety and Security in the Cyber World | Concept-only |
| 8 | `iict108.pdf` (21p) | Fun with Logic | Intro to logic/algorithms |

(`iict1ps.pdf` = prelims/TOC — reference only, not a chapter.)

## Locked build settings (do NOT deviate without the user saying so)

- **English-only**: every page ships `hinglish_blocks: []`. No Hinglish twins. (User decision 2026-06-04.)
- **`published: false`** on every new page; chapters `is_published: false` until the user publishes.
- **Adapted software-tutorial template** (see below) — NOT the science "Exploration" template.
- **No LaTeX** except where genuinely needed (Ch.8 logic). No `\ce{}`, no JEE/NEET exam tips.
- **Hero image** per page: `type: image`, `src: ''` + `generation_prompt`, `aspect_ratio: '16:5'`, `width: 'full'`, `caption: ''`. The `scripts/livebook-images/` pipeline fills `src` later.
- **Videos** = the primary "show me how" surface (replaces step screenshots). Placeholder convention below.
- **One setup script per chapter**: `scripts/setup_class9_ict_ch{N}.js` (mirrors the class9-physics pattern — direct Mongo insert + `$push` into `chapters.$.page_ids`; idempotent, skips existing slugs). Book shell: `scripts/setup_class9_ict_book.js`.

## Adapted page template (block order)

One page = one fully-closed sub-topic, passable by its own 3-Q quiz.

1. `image` hero (16:5, `src:''` + `generation_prompt`)
2. `callout[fun_fact]` — real-life hook (the NCERT Muskan/Tanya/Samayra stories map directly)
3. `heading` + `text` — the concept, conversational/second-person
4. `video` — bite-sized software walkthrough **(tutorial chapters 2–5, parts of 6 & 8 only)** — placeholder until recorded
5. `callout[note]` titled "Try it yourself — Activity" — maps to NCERT "Activity"/Exercise boxes; gives computer/mobile students something real to do
6. `callout[remember]` (optional) — keyboard shortcut / pro-tip, or a bridge to the next chapter
7. `table` / `timeline` / `comparison_card` where genuinely useful
8. `inline_quiz` — exactly 3 questions (recall → application → reasoning), `pass_threshold: 0.67`, **LAST block**

Valid `callout` variants in use: `fun_fact` (hook), `note` (activity), `remember` (tip/bridge), `warning` (caution).

## Video placeholder convention

Software walkthrough videos are recorded later. Each video block ships as a placeholder:

```js
{ id: uuid, type: 'video', order: N,
  src: '',                 // empty until the clip is uploaded to R2
  provider: 'r2_direct',
  caption: '<student-facing one-liner — what the clip shows>',
  duration_sec: 0 }        // patched to real length when uploaded
```

The **exact thing each clip must demonstrate** goes in the per-chapter shot-list below, keyed by page slug, so whoever records has a precise brief. When a clip is ready: patch `src` (R2 URL), `poster`, and `duration_sec` on that block.

---

## Per-chapter progress

### Chapter 1 — Introduction to ICT  ✅ DONE (2026-06-04)
Concept-only — no walkthrough videos. 6 pages, all `published: false`.

| ✅ | Page | Slug | Sub-topic |
|---|---|---|---|
| ✅ | 1 | `what-is-ict` | The three words; 4 elements of communication |
| ✅ | 2 | `evolution-of-ict` | Smoke signals → smartphones (timeline) |
| ✅ | 3 | `why-ict` | Anywhere/anytime/anyone; cost; instant data |
| ✅ | 4 | `ict-in-life-and-learning` | MOOCs, planning, everyday life, education, inclusion |
| ✅ | 5 | `ict-all-around-us` | Applications across fields (table) |
| ✅ | 6 | `is-it-an-ict` | What counts as an ICT; bridge to rest of book |

Script: `scripts/setup_class9_ict_ch1.js`. Rollback: delete the 6 `book_pages` by slug + pull their ids from `chapters.1.page_ids` (or drop the whole book via its `_id`).

### Chapter 2 — Creating Textual Communication  ✅ DONE (2026-06-04)
LibreOffice Writer. 6 pages, 6 videos. Script: `scripts/setup_class9_ict_ch2.js`.
`writer-first-document` · `writer-page-setup-and-saving` · `writer-formatting-text` · `writer-editing-tools` · `writer-lists-and-tables` · `writer-pictures-printing-pdf`

### Chapter 3 — Creating Visual Communication  ✅ DONE (2026-06-04)
GIMP. 6 pages, 5 videos. Script: `scripts/setup_class9_ict_ch3.js`.
`gimp-getting-started` · `gimp-crop-flip-rotate` · `gimp-scale-and-brighten` · `gimp-layers-and-reflection` · `gimp-clone-tool` · `gimp-collage-and-formats`

### Chapter 4 — Creating Audio Video Communication  ✅ DONE (2026-06-04)
Audacity + OpenShot. 5 pages (p1 concept), 4 videos. Script: `scripts/setup_class9_ict_ch4.js`.
`multimedia-and-planning` · `audacity-recording` · `audacity-editing-exporting` · `openshot-importing-timeline` · `openshot-music-preview-export`

### Chapter 5 — Presenting Ideas  ✅ DONE (2026-06-04)
LibreOffice Impress. 4 pages, 4 videos. Script: `scripts/setup_class9_ict_ch5.js`.
`impress-first-presentation` · `impress-images-animation-transitions` · `impress-media-and-slideshow` · `impress-sharing-pdf`

### Chapter 6 — Getting Connected: Internet  ✅ DONE (2026-06-04)
Browser/search/email. 6 pages (p4 safety concept), 5 videos. Script: `scripts/setup_class9_ict_ch6.js`.
`web-browsers-and-websites` · `search-engines-and-keywords` · `search-operators-and-bookmarks` · `evaluating-and-safe-searching` · `setting-up-email` · `sending-receiving-email`

### Chapter 7 — Safety and Security in the Cyber World  ✅ DONE (2026-06-04)
Concept-only — 0 videos. 4 pages. Script: `scripts/setup_class9_ict_ch7.js`.
`cyber-world-and-footprint` · `spotting-email-fraud` · `social-media-safety` · `cyber-bullying`

### Chapter 8 — Fun with Logic  ✅ DONE (2026-06-04)
Sequence/logic + Scratch (MIT). 4 pages (p1 concept), 3 videos. Script: `scripts/setup_class9_ict_ch8.js`.
`logic-and-sequence` · `meet-scratch` · `scratch-sprites-and-stage` · `scratch-scripting-a-story`

---

## VIDEO SHOT-LIST (27 clips to record)

Each page below has a placeholder `video` block (`src:''`). Record the clip, upload to R2, then patch the block's `src` (R2 URL), `poster`, and `duration_sec`. The student-facing caption is already on each block; the brief is what to capture.

**Ch.2 — LibreOffice Writer**
- `writer-first-document` — Open Writer; create a new blank document; point out the "Untitled 1" title bar and the cursor.
- `writer-page-setup-and-saving` — Set page size (A4), orientation (Portrait↔Landscape), margins, background; then Save As with a name + Ctrl+S.
- `writer-formatting-text` — Change font name/size/colour; apply bold/italic/underline; show the four alignments; line/paragraph spacing.
- `writer-editing-tools` — Run spell/grammar check (F7), Add to Dictionary; Find & Replace (Ctrl+H); Cut/Copy/Paste.
- `writer-lists-and-tables` — Make a bulleted and a numbered list; insert a table; add rows, borders, bold headings; merge cells.
- `writer-pictures-printing-pdf` — Insert a picture; add header + footer with page number; Print Preview + print; export to PDF.

**Ch.3 — GIMP**
- `gimp-getting-started` — Open GIMP; open an image; tour canvas, toolbox, layers panel; show a tooltip.
- `gimp-crop-flip-rotate` — Crop out unwanted edges; flip horizontally/vertically; rotate 90°.
- `gimp-scale-and-brighten` — Scale an image down (show pixel size shrink); brighten a dull photo.
- `gimp-layers-and-reflection` — Duplicate a layer; flip it; build a faded mirror reflection with opacity.
- `gimp-clone-tool` — Use the Clone tool: Ctrl-click a source, paint out an unwanted object/text.
- `gimp-collage-and-formats` — Open several photos as layers; scale/move into a collage; File → Export as JPEG.

**Ch.4 — Audacity + OpenShot**
- `audacity-recording` — Open Audacity; new track; record a clean narration; stop with Space.
- `audacity-editing-exporting` — Select+Delete a cough; File→Import music; mix tracks; save .aup; Export .mp3.
- `openshot-importing-timeline` — Organise files; import into OpenShot (or Ctrl+F); place clips on the timeline; drag to reorder.
- `openshot-music-preview-export` — Drag music to Track 1; preview with Play; save .osp; Export .mp4.

**Ch.5 — LibreOffice Impress**
- `impress-first-presentation` — Open Impress; title slide; add slides; type text; try a different layout.
- `impress-images-animation-transitions` — Insert an image; add ONE custom animation; apply a slide transition.
- `impress-media-and-slideshow` — Insert an audio/video clip; run slide show (F5); right-click navigate; Slide Sorter reorder.
- `impress-sharing-pdf` — Export the presentation to PDF (note effects don't appear in PDF).

**Ch.6 — Internet**
- `web-browsers-and-websites` — Open a browser; type a URL in the address bar; follow a hyperlink.
- `search-engines-and-keywords` — Search a keyword; filter the results to Images.
- `search-operators-and-bookmarks` — Demo AND / OR / "phrase"; bookmark a page with the star icon.
- `setting-up-email` — Create an email account; set a strong password (use the checklist).
- `sending-receiving-email` — Compose an email; attach a file; Send; open the Inbox and read a message.

**Ch.8 — Scratch**
- `meet-scratch` — Open Scratch; drag Move/Turn blocks into a sequence; run the cat (e.g. trace a square).
- `scratch-sprites-and-stage` — Add sprites; delete the default cat; set a backdrop; add a costume and a sound; show x/y coordinates.
- `scratch-scripting-a-story` — Stack instruction blocks (when-flag-clicked, move, say, play sound) for ≥2 sprites; play the animated story.

(Ch.1 and Ch.7 are concept-only — no videos.)

---

## INTERACTIVE SIMULATIONS (9 built, 2026-06-04)

Self-contained components in `packages/book-renderer/blocks/simulations/`, registered by `simulation_id` in `packages/book-renderer/blocks/SimulationBlockRenderer.tsx`, wired into pages via `scripts/wire_ict_simulations.js` (idempotent — re-run to add new ones). Follow `_agents/workflows/SIMULATION_DESIGN_WORKFLOW.md` tokens. Package + student app typecheck clean.

| simulation_id | File | Wired on page | Concept |
|---|---|---|---|
| `code-the-bot` | CodeTheBotSim | `meet-scratch` | Flagship: block-coding maze, sequence→loops→conditionals→functions (6 levels) |
| `logic-gate-lab` | LogicGateLabSim | `logic-and-sequence` | AND/OR/NOT/XOR gates + truth table + binary builder |
| `debug-it` | DebugItSim | `scratch-scripting-a-story` | Reorder/remove-step sequence debugging (Jason story) |
| `phishing-detective` | PhishingDetectiveSim | `spotting-email-fraud` | Judge 6 realistic 2026 scams (UPI/OTP/lookalike/job) |
| `password-forge` | PasswordForgeSim | `setting-up-email` | Live strength + crack-time + passphrase lesson |
| `pixel-layers-studio` | PixelLayersStudioSim | `gimp-getting-started` | RGB mixer + resolution + layer opacity/reflection |
| `how-the-web-works` | HowTheWebWorksSim | `web-browsers-and-websites` | Animated URL→DNS→server→render + https toggle |
| `search-query-builder` | SearchQueryBuilderSim | `search-operators-and-bookmarks` | AND/OR/"phrase" Boolean puzzle vs mock results |
| `sound-wave-studio` | SoundWaveStudioSim | `audacity-recording` | Amplitude/frequency + digital sampling |

To add a sim later: create `<Name>Sim.tsx` (default export, `'use client'`, no `@/` alias — packages use relative imports only), register the id in `SimulationBlockRenderer.tsx`, add a row to `WIRINGS` in `wire_ict_simulations.js`, re-run it. A `simulation` block is `{ id, type:'simulation', order, simulation_id, title }`; the wiring script inserts it before the page's `inline_quiz` so the quiz stays last.

**2026 modern-context callouts:** `scripts/add_ict_modern_callouts.js` (idempotent) added 8 `threads_of_curiosity` callouts titled "Where this is heading (2026)" on what-is-ict, gimp-collage-and-formats, openshot-music-preview-export, impress-sharing-pdf, web-browsers-and-websites, setting-up-email, social-media-safety, meet-scratch.

---

## Changelog
<!-- Newest first. -->
- 2026-06-04 — **Sim UX pass (v2) after live browser testing of all 9 sims.** Tested each through the real `BlockRenderer` path at reading-column width (~745px) via a throwaway `/ict-sim-test` route (since deleted). All 9 functioned correctly. High-impact fixes applied: **CodeTheBotSim** — maze + Run/Step controls now **sticky** (visible while scrolling/editing blocks), the **currently-executing block is highlighted** during playback, added a **Step ▸** button + **Fast/Slow** speed toggle, and the bot was redrawn with a face (was mistakable for a play-triangle); bigger touch targets on repeat/✕ controls. **SearchQueryBuilderSim** — default query changed to a neutral non-solving `youth OR nation` (was pre-solving challenge 1 on load). **DebugItSim** — reorder/remove buttons enlarged to 36px touch targets. Package + student app typecheck clean. Open enhancement ideas (not yet done): real Web Audio in SoundWaveStudio, styled chips instead of native `<select>` in SearchQueryBuilder, final score screen in PhishingDetective, drag-to-reorder in DebugIt.
- 2026-06-04 — **9 interactive simulations built + wired; 8 modern-context (2026) callouts added.** See the Simulations section above. Package + student app typecheck clean; 41 pages still valid.
- 2026-06-04 — **Chapters 2–8 built (35 pages); BOOK CONTENT COMPLETE at 41 pages.** 27 placeholder video blocks; full shot-list added above. Whole-book validation passed.
- 2026-06-04 — Book + subject infrastructure created; Chapter 1 (6 pages) built. Ledger created.
