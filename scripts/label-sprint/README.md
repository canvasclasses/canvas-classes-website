# Label Sprint — organ image + hotspot toolkit

Label Sprint is the "drop the name on the right spot" biology revision game. Every
round is just **one background image + a list of hotspots** (`{label, x, y}` in 0–1
image coordinates). This is the *same data* as an `interactive_image` book block
(`packages/data/books/schemas.ts` → `HotspotSchema`), so a Label Sprint round IS an
`interactive_image` block run in quiz mode.

Canonical workflow: [`_agents/workflows/LABEL_SPRINT_WORKFLOW.md`](../../_agents/workflows/LABEL_SPRINT_WORKFLOW.md).

## Two ways to get the image

### 1. Illustration PNG — PRIMARY (best teaching value)
Generate a labelled-diagram-style illustration (cross-section preferred — it exposes
interiors: valves, septum, chambers) with the prompt template in the workflow doc.
The generated image must have **no baked-in text/labels** and a **solid near-black
background**. Then:

```bash
python3 prepare_illustration.py ~/Downloads/heart.png heart_illus 820 18
# -> heart_illus.webp (transparent, compressed) + heart_illus.datauri.txt
```

Then author the `hotspots[]` (0–1 coords) by hand once, against the image.

### 2. 3D render — FALLBACK (organs we already model in `apps/student/public/anatomy/*.glb`)
Renders a clean flat-shaded still AND auto-projects a hotspot for every named mesh
(no hand-authoring), but only shows the external surface.

```bash
/Applications/Blender.app/Contents/MacOS/Blender --background --factory-startup \
  --python render_organ.py -- \
  ../../apps/student/public/anatomy/heart-v6.glb /tmp/heart.png front
# -> /tmp/heart.png  +  /tmp/heart.hotspots.json  (auto {mesh_name: {x,y,depth}})
```

`VIEW` arg is `front | back | left | right`. Auto-hotspots use the mesh names inside
the `.glb` (e.g. `aorta`, `right_ventricle`, `superior_vena_cava`).

## Rule of thumb
- Interiors, cross-sections, and anything we have **not** modelled in 3D → illustration PNG.
- External surface of an organ we **have** modelled → 3D render (hotspots come free).
- Keep every image on the **same generated style** (workflow prompt template) so the
  organ library reads as one set.
