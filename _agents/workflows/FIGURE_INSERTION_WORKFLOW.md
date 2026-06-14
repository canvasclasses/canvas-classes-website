# Figure Insertion Workflow — attach pre-made SVGs to Crucible questions

Canonical ruleset for attaching the founder's pre-generated SVG diagrams (sitting in
`~/Desktop/Out - Ready for Database/<book chapter>/`) to the correct `questions_v2`
questions, in the correct slot (question stem / option a–d / solution sketch).

This is the **Crucible question-bank** figure pipeline. It is NOT the Live Books image
pipeline (`scripts/livebook-images/`, ChatGPT-in-Chrome generation) — different source,
different target. See `_agents/workflows/BOOK_PAGE_WORKFLOW.md` for that one.

Toolkit: [`scripts/svg-mapper/`](../../scripts/svg-mapper/) (`rasterize.js`, `build-gallery.js`,
`insert-from-manifest.js`). Operational steps for the agent live in the `figure-inserter` skill;
the **rules and the hard-won lessons** live here. When the skill conflicts with this doc, this doc wins.

---

## 0. What this solves

Attaching diagrams was the single biggest manual bottleneck in the Crucible flow: ~150+
figures queued across chapters, each historically hand-uploaded one at a time via the admin
UI, blocking the figure-dependent solutions. The founder generates all SVGs in bulk (white-on-
transparent, timestamp filenames, in book order, grouped per book chapter). This pipeline turns
"a folder of anonymous SVGs" into "figures correctly attached to questions" with a human
verification gate and a full rollback.

---

## 1. PREREQUISITE — the chapter must already be ingested

Figures attach to **existing** `questions_v2` documents. If the book chapter hasn't been
ingested (no `display_id`s exist for it), STOP — there is nothing to attach to. Ingest first
(`question-ingester` skill). As of 2026-06-12 the ingested Physics-MCQ chapters are Ch.1
(Mechanics 1), Ch.2 (Circular/Rotational/SHM), Ch.3 (Properties of Matter), Revision Exercise 1,
Revision Exercise 2, Heat & Thermodynamics, Sound, and Optics. (Remaining: Experimental Physics,
electrostatics, electric current in conductors, electromagnetism, Motion of charged particles.)

You need three inputs for a chapter:
- **SVG folder** — e.g. `~/Desktop/Out - Ready for Database/Properties of matter/`.
- **qmap** — `_agents/solution-seeds/physics-mcq-ch<N>-qmap.md` maps **book Q# → display_id** (+ chapter, answer key, which Qs have figures).
- **diagram wishlist** — `_agents/solution-flags/physics-mcq-ch<N>-diagram-wishlist.md` describes each needed figure (book Q#, what it shows, question-side vs solution-side, REQUIRED vs recommended). This is your matching key.

---

## 2. THE SEQUENCE

### Step 1 — Rasterize so you can see them
```bash
node scripts/svg-mapper/rasterize.js "<svg-folder>" "/tmp/<ch>_png" 640
```
Writes indexed PNGs (`00.png`, `01.png`, …) flattened on **black** (the SVGs are white-on-
transparent → invisible on white, visible on black; **no inversion needed**) plus `_index.tsv`
(idx → filename). The filename sort order == generation order == **book figure order**.

### Step 2 — Overview contact sheet
```bash
cd /tmp/<ch>_png && magick montage $(ls *.png | sort) -tile 5x -geometry 240x240+6+6 -background '#111' /tmp/<ch>_contact.png
```
Read the contact sheet. Tiles read left-to-right, top-to-bottom = index order.
(`gs`/Freetype warnings are harmless — the montage still renders; index by tile position.)

### Step 3 — First-pass match (shape + qmap + wishlist)
For each figure, assign a `display_id` + slot by matching the **figure's content** to a wishlist
description, then qmap that book Q# to its `display_id`. Slots: `question`, `optionA/B/C/D`,
`solution`, `skip`.
- **Count check is your friend:** the number of SVGs should equal the wishlist's question-side
  figure inventory (multi-option questions = 4 images each). A clean total with **no leftovers
  and no gaps** is strong evidence the mapping is right (Properties of Matter: 14 single-figure
  stems + 3×4 option images = 26 = exactly the folder count).
- Single-figure stems are low-risk (each is a visually distinct diagram, 1:1 with a description).

### Step 4 — ⚠️ BOOK-VERIFY OPTION ORDER (the step that catches bugs)
**For every question with 4 option-images (graphs / shapes), do NOT assume generation order =
option a/b/c/d.** It was scrambled in 2 of 3 cases on the first real chapter. Also: **the stored
option *text* is an unreliable placeholder — do NOT match against it.** Match SVG → book figure
by **shape**:
```bash
# locate the question's page (textPage; physical page differs by a fixed offset — calibrate once)
pdftotext -layout "<book.pdf>" /tmp/book.txt
awk 'BEGIN{p=1} /\f/{p++} /<distinctive phrase>/{print "txtPage "p": "$0}' /tmp/book.txt
# render that physical page at 300 dpi, crop + upscale the option grid
pdftoppm -f <physpage> -l <physpage> -r 300 -png "<book.pdf>" /tmp/qN
magick /tmp/qN-<physpage>.png -gravity South -crop 100%x34%+0+30 +repage -trim +repage -resize 1700x /tmp/qN_grid.png
```
Read the book grid, classify each option (a)(b)(c)(d) by shape, classify your SVGs by shape, and
map book-label → DB option id. **Confirm the figure matching the stored correct answer lands on
the correct option id.** Use `pdftoppm` (poppler) for PDF rendering — `magick`/`convert` need
ghostscript, which is not installed.

### Step 5 — Write the manifest
`<svg-folder>/manifest.json`:
```json
{ "sourceFolder": "...", "count": N, "entries": [
  { "file": "Chem_....svg", "index": 0, "display_id": "GRAV-170", "slot": "optionA", "book_q": 12 }
] }
```
(The `build-gallery.js` gallery exports this shape too, if a human maps instead of the agent.)

### Step 6 — Dry run
```bash
node scripts/svg-mapper/insert-from-manifest.js "<manifest>" "<svg-folder>"
```
Resolves every entry, writes nothing. Want **0 NOT FOUND, 0 skipped**; review the planned
changes (append-to-stem vs replace-option-text) and the affected-question count.

### Step 7 — Commit (writes to live DB + R2)
Per CLAUDE.md §3, state the scope first (N `questions_v2` docs, M assets, rollback). Then:
```bash
node scripts/svg-mapper/insert-from-manifest.js "<manifest>" "<svg-folder>" --commit
```
Uploads each SVG to R2, creates an Asset doc (exact `Asset.ts` shape), embeds the markdown
image in the slot, writes `rollback-<ts>.json` next to the manifest.

### Step 8 — Verify
Spot-check the DB (option images mapped to the right ids; correct option has the correct figure;
a stem ends with an embedded image) and `curl -I` one `cdn_url` (expect `200 image/svg+xml`).

### Step 9 — Refresh state (required final step)
- `node scripts/crucible-state.js` + add a dated Changelog line (CLAUDE.md §3).
- Update the `Physics MCQ book ingestion` row in `_agents/PROJECTS.md` (§0.5).
- Mark the chapter's wishlist List-A question figures done.

---

## 3. HOW ATTACHMENT WORKS (data model)

- **Question-side** (`slot: question`): append `![alt](cdn_url)` to `question_text.markdown`.
  The student renderer (`packages/ui/MathRenderer.tsx`) turns markdown `![]()` into `<img>`.
- **Option** (`slot: optionA/B/C/D`): **replace** `options[id].text` with `![alt](cdn_url)`.
  Used for graph/shape-option questions whose stored text is a placeholder. Option `id` and
  `is_correct` are preserved, so the answer key stays valid.
- **Solution** (`slot: solution`): append `![alt](cdn_url)` to `solution.text_markdown` (the
  🖼️ Visual Sketch section). **Do NOT** use `solution.asset_ids.svg[]` — that field exists in
  the schema but the student app does **not** render it; figures parked there are invisible.
- A new Asset doc is created per figure (dedup by SHA-256 checksum); `asset_ids[]` on the
  question is updated. R2 key: `questions/<question._id>/svg/<ts>_<safeName>_<assetId8>.svg`.

---

## 4. PITFALLS — things that bit us, do not repeat

1. **Generation order ≠ option order.** Always book-verify a/b/c/d (Step 4). GRAV-170 (c/d) and
   FLUI-161 (b/d) were scrambled on the first chapter.
2. **Stored option placeholder texts are unreliable.** They didn't match the book figures.
   Match by shape against the book, never against the stored text.
3. **White SVGs are invisible on white.** Rasterize on black. (Invert toggle exists in the
   gallery for any rare black-on-transparent SVG.)
4. **SVGs are path traces with no `<text>`.** No programmatic content match is possible — visual
   only. (Hence the rasterize-and-look step.)
5. **`r2-storage.ts` and `Asset.ts` are `import 'server-only'`** → they throw if imported in a
   plain Node script. `insert-from-manifest.js` replicates the R2 `PutObject` + Asset-doc shape
   directly instead. Keep them in sync if the canonical files change.
6. **`magick`/`convert` PDF rendering needs ghostscript (not installed).** Use `pdftoppm`
   (poppler) for PDF→PNG. Montage of already-rendered PNGs works fine (ignore gs/font warnings).
7. **`insert-from-manifest.js` arg order:** `uploadSvgToR2(buf, q._id, e.file, assetId)` —
   questionId BEFORE originalName. (A swap once produced cosmetically wrong R2 keys; harmless to
   rendering but wrong folder layout. Fixed.)
8. **Idempotency + rollback:** re-runs skip already-embedded figures; `--commit` always writes a
   rollback file. To revert, restore `question_text.markdown` / `options` / `asset_ids` per
   question from that file.

---

## 5. WHEN A HUMAN MAPS INSTEAD OF THE AGENT

If the agent can't confidently match (no qmap/wishlist, or ambiguous figures), generate the
review gallery and hand it over:
```bash
node scripts/svg-mapper/build-gallery.js "<svg-folder>"   # writes gallery.html into the folder
```
The founder opens `gallery.html`, sets display_id + slot per tile (with a "group 4 → options"
helper), and exports `manifest.json`. Then resume at Step 6 (dry run).
