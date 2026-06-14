# svg-mapper — attach pre-made SVG diagrams to Crucible questions

Three small scripts that take a folder of the founder's pre-generated SVGs (white-on-transparent,
timestamp filenames, in book order) and attach each to the right `questions_v2` question/option.

**Canonical rules + the proven sequence + pitfalls:**
[`_agents/workflows/FIGURE_INSERTION_WORKFLOW.md`](../../_agents/workflows/FIGURE_INSERTION_WORKFLOW.md).
Read it before running. The `figure-inserter` skill drives this end-to-end.

## The three tools

| Script | Role | Touches DB/R2? |
|---|---|---|
| `rasterize.js` | SVG folder → indexed PNGs on black (so figures are reviewable) + `_index.tsv` | No (reads .svg, writes .png) |
| `build-gallery.js` | SVG folder → self-contained dark-bg `gallery.html` for human mapping → exports `manifest.json` | No |
| `insert-from-manifest.js` | `manifest.json` → R2 upload + Asset docs + markdown embed in `questions_v2` | **Yes, on `--commit`** |
| `fetch-question-images.js` | question display_ids → downloads their figures, rasterizes SVG→dark PNG, writes local files an AI agent can `Read` | No (reads DB, writes PNGs) |

## Letting an AI agent SEE a question's figures (e.g. when writing solutions)

The Claude vision API can't decode **SVG**, and the Read tool needs **local** files — so an
agent that tries to view a question's R2 `.svg` URL fails with "image couldn't be read — try a
different format." Use this to get legible PNGs instead:

```bash
node scripts/svg-mapper/fetch-question-images.js NLM-188 NLM-190 SHM-122   # by display_id
node scripts/svg-mapper/fetch-question-images.js --prefix NLM --limit 20   # whole prefix
```
It prints a `display_id → [local png paths]` map; `Read` those PNGs (in small batches to stay
under the per-request image cap). This is the supported way for the solution-writing flow to view
SVG figures — the `📐`/🖼️ Visual Sketch grounding step.

## Quick flow (per ingested chapter)

```bash
# 1. Render so you can see them
node scripts/svg-mapper/rasterize.js "/Users/CanvasClasses/Desktop/Out - Ready for Database/<chapter>" "/tmp/ch_png" 640

# 2. (agent) match figures → display_id/slot using the chapter qmap + diagram-wishlist,
#    BOOK-VERIFY the a/b/c/d order of any 4-option-image question, write manifest.json
#    (or: build-gallery.js and let the founder map by hand)

# 3. Dry run — resolves every entry, writes nothing
node scripts/svg-mapper/insert-from-manifest.js "<chapter>/manifest.json" "<chapter>"

# 4. Commit — uploads to R2 + attaches + writes rollback-<ts>.json
node scripts/svg-mapper/insert-from-manifest.js "<chapter>/manifest.json" "<chapter>" --commit
```

## manifest.json shape

```json
{ "sourceFolder": "Properties of matter", "count": 26, "entries": [
  { "file": "Chem_....svg", "index": 0, "display_id": "GRAV-170", "slot": "optionA", "book_q": 12 }
] }
```
Slots: `question` · `optionA` `optionB` `optionC` `optionD` · `solution` · `skip`.

## Safety

- **Dry run by default.** `--commit` is required to write.
- **Idempotent:** an already-embedded figure (same R2 url present) is skipped on re-run.
- **Rollback:** `--commit` writes `rollback-<ts>.json` (prior `question_text.markdown` / `options`
  / `asset_ids` per touched question). Revert by restoring those fields.
- Only questions named in the manifest are touched.

## Hard rules (see workflow doc for the full list)

- **Always book-verify option a/b/c/d order** — generation order is NOT reliable, and the stored
  option text is an unreliable placeholder. Match SVG → book figure by shape.
- Use `pdftoppm` (poppler) for PDF rendering; `magick` PDF rendering needs ghostscript (absent).
- Solution figures go in `solution.text_markdown` as markdown, NOT `solution.asset_ids.svg[]`
  (the latter isn't rendered to students).
