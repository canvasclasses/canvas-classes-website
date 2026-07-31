# Live Book reusable diagram library

A growing collection of **canonical, chapter-level reference illustrations** —
orbital shapes, energy-level diagrams, standard experiments, radial functions —
redrawn in the platform's dark hand-drawn style, meant to be reused across
multiple Live Book pages/chapters rather than generated fresh per page.

## Why this exists (and why it's separate from the per-page image pipeline)

`scripts/livebook-images/` fills a **specific pending block on a specific page**
(text prompt → ChatGPT → verify → `ingest.js` writes straight into that block's
`src`/`image_src` field). That's the right tool for a one-off hero image or a
worked-example diagram tied to specific numbers.

This library is for the *other* kind of image: the ones that don't depend on
which page is asking — the shape of a d-orbital is the same shape everywhere.
Building these once and reusing them is more efficient than re-generating a
near-identical diagram for every chapter that needs it, and — since each entry
here is recreated from a real, technically-accurate reference image rather than
a from-scratch text prompt — more accurate for anything with a precise shape
(a graph curve, an orbital lobe count) that a text-only prompt can get subtly
wrong.

**Not a new Mongoose model** (CLAUDE.md Simplicity Constraint: don't add one
without being asked) — this is a small, curated, repo-tracked catalog. If it
ever grows large enough to need querying/filtering at scale, that's the trigger
to reconsider, not before.

## Source material and the caption rule

Reference images live outside the repo (e.g. `~/Desktop/Atomic structure
images/`) — screenshots/crops from various chemistry and physical chemistry
textbooks, gathered as *accuracy references*, not to be reproduced pixel-for-
pixel. Every entry here is a **fresh AI-generated illustration** grounded in
the real source (so the physics/shape is right), redrawn in our own style —
never a traced copy.

**Several source images have the original textbook's figure number and caption
baked into the same PNG** (e.g. "Figure 8.19 | The discovery of electron
spin..."), sometimes with the founder's own highlighting from reading the PDF.
**Every generation prompt must explicitly instruct: ignore any caption/citation
text baked into the reference image — do not include it in the output.** The
diagram is the reusable part; a specific textbook's figure numbering and prose
caption is not ours to reproduce. `manifest.json` entries track `had_caption`
so this is auditable later.

## Manifest schema (`manifest.json`)

```jsonc
{
  "entries": [
    {
      "id": "orbital-shapes-2d",              // slug, unique
      "subject": "chemistry",
      "concept": "Shapes of s, p, and d orbitals — 2D lobe diagrams with phase signs",
      "tags": ["orbitals", "quantum-numbers", "shapes", "atomic-structure"],
      "source_file": "Shapes of Orbitals.png", // filename in the original reference folder, for traceability
      "had_caption": false,                    // whether the source had baked-in caption/citation text (excluded from the recreation either way)
      "r2_url": "https://.../books/_library/orbital-shapes-2d_gen.webp",
      "alt_text": "...",
      "generation_prompt": "...",               // exact prompt used — lets a future agent regenerate or vary it
      "aspect_ratio": "4:3",
      "created_at": "2026-07-26T..."
    }
  ]
}
```

## Workflow

1. Pick a reference image, note `id`/`concept`/`tags`.
2. Write a prompt: describe the diagram accurately (grounded in the real
   reference — quote what it actually shows, per Rule 0), platform's dark
   hand-drawn style, sharp/clean lines (not sketchy — these are technical
   diagrams), + the standing caption-exclusion instruction.
3. Generate via ChatGPT-in-Chrome (same reused-chat convention as the main
   pipeline — 12-15 images per chat, never a new chat per image).
4. **Look at the result and compare to the real reference** — same content
   verification bar as the main pipeline.
5. `node scripts/livebook-images/library_ingest.js --file <png> --id <slug> ...`
   — compresses (`cwebp -q42`, same as the main pipeline), uploads to
   `books/_library/<id>_gen.webp` on R2, appends the manifest entry.
6. Commit `manifest.json` + this README's updates (if any) to the repo.

## Using the library when building a page

Before writing a fresh `generation_prompt` for a new page, check
`manifest.json` for a matching `concept`/`tags`. If one exists, reference its
`r2_url` directly in the block's `src` — no generation needed. Only fall back
to a bespoke per-page prompt (via the main `scripts/livebook-images/`
pipeline) for hero/narrative images or worked-example figures tied to specific
numbers, which this library deliberately does not cover.
