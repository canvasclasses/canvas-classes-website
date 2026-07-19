# Label Sprint — Canonical Workflow (Live Book revision game)

> **Read this before building any Label Sprint round or generating an organ image for one.**
> Label Sprint is the "drop the name on the right spot" game: a student taps a label,
> then taps where it belongs on an organ/diagram, against a timer, feeding the
> spaced-repetition deck. It is the biology counterpart to Chemistry/Physics
> `simulation` blocks — but for **retention of labelled structures**, not process.

Related docs: [`BOOK_PAGE_WORKFLOW.md`](BOOK_PAGE_WORKFLOW.md) §3.13 (`interactive_image`),
the image pipeline [`scripts/livebook-images/`](../../scripts/livebook-images/), and the
toolkit [`scripts/label-sprint/`](../../scripts/label-sprint/).

---

## 1. The framework — image + hotspots, never hand-drawn geometry

A Label Sprint round is exactly two things:

1. **A background image** — one flat raster (WebP/PNG), dark-native, authored once.
2. **A hotspot map** — a list of `{ label, x, y }` where `x, y ∈ [0,1]` are fractions
   of the image box (so pins float over the image and scale with it).

This is the **same data shape as an `interactive_image` block** — see
`packages/data/books/schemas.ts` → `HotspotSchema` (`{id, x, y, label, detail, icon}`)
and the renderer `packages/book-renderer/blocks/InteractiveImageBlockRenderer.tsx`
(positions each hotspot by `left: x*100%`, `top: y*100%`). **A Label Sprint round IS an
`interactive_image` block run in "quiz mode"** (reveal → recall). Do not invent a new
schema; reuse `hotspots[]`.

> Never hand-author organ shapes in SVG. That path is trial-and-error and drifts in
> style. Always start from a real image (below).

## 1.5 Rendering the diagram — size it with CSS, never a fixed JS pixel box

**Bug found + fixed 2026-07-15:** the prototype originally sized the diagram wrapper by
computing a pixel width/height in JS from constants tuned for the *worst-case* organ
(the one with the longest label tray). Every other organ then rendered far smaller than
the space actually available — wasted margin on all sides, and hotspot percentage-spacing
collapsed into too few real pixels, causing correctly-placed pills to visually and
physically cover neighbouring unplaced pins (see §3's spacing note).

**The fix is the same pattern the production renderer already uses**
(`InteractiveImageBlockRenderer.tsx`): let the `<img>` size itself via CSS
(`max-width:100%; max-height:100%; width:auto; height:auto; object-fit:contain`) inside a
`position:relative; display:inline-block` wrapper that shrink-wraps to the image's actual
rendered box — never pre-compute pixel dimensions in JS. This makes every organ use all
the space its own aspect ratio allows, automatically, with no per-organ tuning.

**The one flexbox gotcha that bit us:** if the diagram sits inside a `flex: 1` column
container, that container needs `min-height: 0` — without it, a flex item won't shrink
below its content's natural size, so a tall image can silently overflow its box and get
clipped symmetrically top/bottom by `overflow: hidden` on an ancestor. Always pair
`flex: 1` with `min-height: 0` on the containing axis when a Label Sprint (or any
`interactive_image`) diagram sits inside a flex layout.

### Multi-organ prototype tooling — the organ picker doesn't scale as a button row

The demo prototype (`bio-deck.html`, used to trial new organs before real integration)
originally listed every organ as a row of pill buttons under the Label Sprint header.
That breaks down past ~5 organs — it wraps ugly or overflows. **Fixed 2026-07-15:**
replaced with a dropdown (`#organ-trigger` + `#organ-menu`) — a single button showing the
current organ + label count, opening a scrollable list with a checkmark on the active
item and a transparent full-card backdrop (click-outside-to-close). Scales to dozens of
organs with no layout strain. This is prototype-only tooling — in production, each Label
Sprint is just the `interactive_image` block already on its own book page (§5), so there
is no picker; this pattern only matters for the trial/demo surface and for any future
admin tool that needs to browse many diagrams in one view.

---

## 2. Where the image comes from — two paths, in priority order

### Path A — Illustration PNG (PRIMARY)
Best teaching value. Prefer a **cross-section** — it exposes interiors (valves, septum,
chambers, chordae) that a surface view cannot show. Also the only option for anything we
have not modelled in 3D (flower, plant/animal cell, classification diagrams).

1. Generate the image with the **prompt template in §4**. It MUST come out with
   **no baked-in labels/text** and a **solid near-black (`#000`/`#121316`) background**.
   (Most generators bake in labels — regenerate insisting on none.)
2. **Before running the script, open the raw downloaded PNG and look at its background.**
   Bug found 2026-07-15 across a whole 9-image batch (animal cell, ear, chloroplast,
   alveolus, nucleus, DNA, HIV, endocrine map, male reproductive system): the background
   looked dark live in the ChatGPT UI during generation, but the *downloaded* PNG was
   flattened onto an opaque **white** canvas instead — the prompt's "solid deep-charcoal
   background" instruction didn't survive export. Never trust the live preview; always
   eyeball the actual file.
   ```bash
   python3 scripts/label-sprint/prepare_illustration.py ~/Downloads/heart.png heart_illus 820 18
   # if the source PNG has a white/light background instead of dark:
   python3 scripts/label-sprint/prepare_illustration.py ~/Downloads/ear.png ear_illus 820 235 white
   ```
   The script **crops to the visible (non-transparent) content before resizing** — a
   generated canvas is rarely filled edge-to-edge, and any leftover transparent margin
   survives into the exported webp, silently making the diagram render smaller than the
   space actually available (bug found 2026-07-15 on the respiratory-system image;
   fixed in the script — always use the current version, never an older cached copy).
3. Author the `hotspots[]` by hand once against the **cropped, resized** image (§3) — not
   against the original download. If you re-run the script on an image whose hotspots were
   already authored (e.g. after a tool fix), the crop box shifts and every fraction must be
   recomputed with an exact affine transform, not re-eyeballed — see the worked example in
   git history (`digestive-system.block.json` / `brain.block.json` / `eye.block.json` /
   `flower.block.json`, corrected 2026-07-15).

### Path B — 3D render (FALLBACK, external surface only)
For organs already modelled in `apps/student/public/anatomy/*.glb` (heart, nervous,
skeleton, muscular, viscera, …). Renders a clean flat-shaded still **and auto-projects a
hotspot for every named mesh** — zero hand-authoring — but shows only the external surface.

```bash
/Applications/Blender.app/Contents/MacOS/Blender --background --factory-startup \
  --python scripts/label-sprint/render_organ.py -- \
  apps/student/public/anatomy/heart-v6.glb /tmp/heart.png front
# -> /tmp/heart.png + /tmp/heart.hotspots.json  ({mesh_name:{x,y,depth}}, auto)
```

Use Path B when you want guaranteed style consistency or the surface view is enough;
use Path A whenever interior structures matter (they usually do).

---

## 3. Authoring hotspots (Path A)

- Coordinates are **fractions of the image (0–1)**, `y` measured from the top.
- Label only **structures actually visible** in that image (e.g. don't label the left
  atrium if the view hides it). Anatomical correctness gate — same bar as §3.13 / Rule 0.
- 6–10 hotspots per round is the sweet spot; keep them ≥ ~0.08 apart so the ~22px pins
  don't overlap.
- **Correctly-placed pins render as wider pills (the label text), not small dots — a pill
  can visually and physically cover a neighbouring *unplaced* pin if they started too close
  together, silently blocking that pin's tap target.** Bug found 2026-07-15 on the plant
  cell (nucleus 0.80/0.28 vs nucleolus 0.83/0.31, ~0.03–0.04 apart): placing nucleolus first
  made its pill cover the nucleus pin underneath. Fix was the same rule already stated above
  — ≥ 0.08 apart — but pairs that are *conceptually* nested (nucleolus inside nucleus, valve
  inside chamber) are the ones most tempted to violate it. When two real structures truly sit
  that close, push the pin for the outer/larger one out to open space on its own body rather
  than its geometric centre.
- The label text is the answer; `detail` (the `interactive_image` popup) doubles as the
  "why it's here" shown on a wrong attempt.

Store them as the block's `hotspots[]`:
```json
{ "id":"uuid", "x":0.64, "y":0.52, "label":"Bicuspid (mitral) valve",
  "detail":"Between the left atrium and left ventricle; two cusps.", "icon":"pin" }
```

---

## 4. Image generation prompt template (Path A)

Reusable — swap the **bracketed** organ line, keep everything else identical so the whole
library reads as one style. Follows §3.4.2 (prompt rules) + §3.14 (biology image style).

> **A clean modern educational anatomy illustration of a [ORGAN], shown as a frontal
> cross-section (coronal cut) opened to reveal [WHAT THE INTERIOR SHOULD SHOW].** Show
> these structures clearly separated and individually distinguishable: [LIST THE PARTS].
> Style: semi-realistic medical-textbook illustration, soft even studio lighting, smooth
> clean surfaces, a muted anatomical palette — arteries/oxygenated in muted crimson,
> veins/deoxygenated in muted slate blue, interiors darker, valves pale. Calm and flat:
> no glossy highlights, no neon, no glow, no 3D-render sheen. Composition: a single
> [ORGAN], centered and filling the frame, upright, symmetrical front view, generous even
> margins. Solid uniform deep-charcoal background, hex #121316, edge to edge.
> **Absolutely no text, no labels, no numbers, no letters, no leader lines, no arrows, no
> legend, no watermark — the illustration only.** Portrait 3:4, high resolution.

Negative-prompt field (if available): `text, labels, numbers, letters, leader lines, arrows, watermark, captions`.

**Non-negotiables:** (a) no baked-in labels, (b) solid near-black background (keyed to
transparent in step 2), (c) clearly separated structures.

---

## 5. Placement in the book — three surfaces, three jobs

Label Sprint is not one location; the same round is reused across three surfaces:

| Surface | Job | Notes |
|---|---|---|
| **Inline, on the organ/topic page** | First encounter, in context | It IS the `interactive_image` block on that page, offered in quiz mode after the student has explored it. Build this first — cheapest. |
| **End-of-chapter challenge** | Consolidation / mixed review | Bundles that chapter's Label Sprints + Sort Its into one gauntlet. Sits with §4F chapter-end practice. |
| **Book-level "Bio Deck" launcher** | The spaced-repetition home | Persistent "Due Today" across everything learned (streak/XP/deck). Cross-chapter, not per-page. |

The deck is the spine: every inline/end-of-chapter round feeds the same per-student deck,
which decides what resurfaces on the Day 1/3/7/14 curve.

---

## 6. Checklist before shipping a Label Sprint round
1. Image has **no baked-in labels** and a transparent (keyed) background.
2. Every hotspot lands on the correct structure (verify against the image, Rule 0).
3. Only visible structures are labelled.
4. Same generated style as the rest of the organ library.
5. Stored as an `interactive_image` block's `hotspots[]` (0–1 coords) — not a bespoke format.
