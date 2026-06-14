---
name: figure-inserter
description: Attach the founder's pre-generated SVG diagrams (in `~/Desktop/Out - Ready for Database/<book chapter>/`) to the correct Crucible `questions_v2` questions — question stem, option a–d, or solution sketch — via the `scripts/svg-mapper/` toolkit (rasterize → match → dry-run → commit, with R2 upload + Asset doc + markdown embed + rollback). Enforces the canonical FIGURE_INSERTION_WORKFLOW, especially the hard-won rule that the a/b/c/d order of multi-option-image questions MUST be verified against the book PDF (generation/timestamp order is NOT reliable, and the stored option text is an unreliable placeholder). Trigger when the user says "attach the figures/SVGs for [chapter]", "insert the diagrams for [chapter]", "upload the question figures", "map the SVGs to questions", "do the figures for [chapter]", "run svg-mapper", "next chapter's figures", or points at a chapter folder of SVGs to attach to the question bank. Skip for: Live Books page images (that is the ChatGPT-in-Chrome `scripts/livebook-images/` pipeline + BOOK_PAGE_WORKFLOW, NOT this), question ingestion (use question-ingester), solution writing (use the subject solution workflow), or single-figure hand-uploads via the admin UI.
---

# Figure Inserter

You attach pre-made SVG diagrams to questions that already exist in `questions_v2`. This skill is
the **operational** layer; the rules, data model, and pitfalls live in the canonical workflow doc.

## STEP 0 — Read these before doing anything

1. **[`_agents/workflows/FIGURE_INSERTION_WORKFLOW.md`](../../../_agents/workflows/FIGURE_INSERTION_WORKFLOW.md)** — the canonical sequence, the data model (how a figure attaches per slot), and the PITFALLS section. When anything below conflicts with it, it wins.
2. **[`scripts/svg-mapper/README.md`](../../../scripts/svg-mapper/README.md)** — the toolkit.

The first real chapter (Properties of Matter, 26 SVGs → 17 questions) is the reference run.

## STEP 1 — Confirm the chapter is ingested + gather inputs

Figures attach to existing docs. If the chapter isn't in `questions_v2`, STOP — ingest first.
Gather: the **SVG folder**, the **qmap** (`_agents/solution-seeds/physics-mcq-ch<N>-qmap.md`,
book Q# → display_id), and the **diagram wishlist** (`_agents/solution-flags/physics-mcq-ch<N>-diagram-wishlist.md`,
the figure descriptions). State which chapter and roughly how many figures before proceeding.

## STEP 2 — Rasterize + overview
```bash
node scripts/svg-mapper/rasterize.js "<svg-folder>" "/tmp/<ch>_png" 640
cd /tmp/<ch>_png && magick montage $(ls *.png | sort) -tile 5x -geometry 240x240+6+6 -background '#111' /tmp/<ch>_contact.png
```
Read the contact sheet (tiles in index order). White SVGs are visible on the black background;
no inversion needed.

## STEP 3 — Match each figure → display_id + slot
Match figure content to wishlist descriptions; qmap the book Q# to its `display_id`. Run the
**count check** (total SVGs should equal the wishlist's question-side inventory, multi-option = 4
each; no leftovers/gaps ⇒ high confidence). Write `<svg-folder>/manifest.json`.

## STEP 4 — ⚠️ BOOK-VERIFY OPTION ORDER (do not skip)
For every 4-option-image question: locate it in the book PDF (`pdftotext` to find the page,
`pdftoppm` at 300 dpi to render, crop+upscale the option grid), classify each option by **shape**,
match your SVGs by shape, and confirm the **correct-answer figure lands on the stored correct
option id**. Generation order is NOT a/b/c/d, and the stored option text is an unreliable
placeholder — this step caught two scrambled questions on the first chapter. Fix the manifest.

## STEP 5 — Dry run, then commit (state scope first, per CLAUDE.md §3)
```bash
node scripts/svg-mapper/insert-from-manifest.js "<manifest>" "<svg-folder>"            # dry run: want 0 NOT FOUND, 0 skipped
# state: "<N> questions_v2 docs change, <M> assets, rollback file written" — then:
node scripts/svg-mapper/insert-from-manifest.js "<manifest>" "<svg-folder>" --commit
```

## STEP 6 — Verify + refresh state
Spot-check the DB (correct option → correct figure; stem has an embedded image) and `curl -I` one
`cdn_url` (expect `200 image/svg+xml`). Then the required final step: `node scripts/crucible-state.js`
+ Changelog line, update the `Physics MCQ book ingestion` row in `_agents/PROJECTS.md`, and mark the
chapter's wishlist List-A question figures done.

## If you can't confidently match
Generate the human-mapping gallery and hand it to the founder:
`node scripts/svg-mapper/build-gallery.js "<svg-folder>"` → they map in `gallery.html`, export
`manifest.json`, and you resume at STEP 5.
