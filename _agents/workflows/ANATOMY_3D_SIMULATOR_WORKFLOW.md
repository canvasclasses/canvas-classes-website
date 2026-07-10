---
description: 3D Anatomy Simulator Workflow — Canvas Classes Live Books (heart is the reference build)
---

# 3D ANATOMY SIMULATOR WORKFLOW v1.0

> **This is the single source of truth for building interactive 3D anatomy models
> (heart, nephron, neuron, …) for Live Books.** The Human Heart (`heart-3d`) is the
> finished reference implementation — copy its patterns exactly. When this doc
> conflicts with anything else, this doc wins; fix the doc, don't silently diverge.
>
> For 2D/canvas simulators (chemistry/physics SVG sims) use
> [`SIMULATION_DESIGN_WORKFLOW.md`](SIMULATION_DESIGN_WORKFLOW.md) instead. This doc
> is specifically for **glTF 3D organ models rendered with three.js / R3F**.

---

## 0. QUICK REFERENCE (read first)

```
ASSET SOURCE     Z-Anatomy (Blender file inside Z-Anatomy.zip), built on BodyParts3D
LICENCE          CC BY-SA — commercial OK. Load UNMODIFIED .glb + transform at runtime
                 = attribution-only. ALWAYS show the credit line in-UI (see §6).
RENDER STACK     three + @react-three/fiber + @react-three/drei (already in apps/student)
BLENDER          drive it headless via scripts/blender/blender_client.py (socket :9876)
HOSTING          static file: apps/student/public/anatomy/<organ>-vN.glb (versioned)
VIEWER TEMPLATE  apps/student/features/anatomy/Heart3DViewer.tsx  (copy it)
CATALOG          packages/data/simulations/biologySimulations.ts  (add a row)
INJECTION        EXTRA_SIMULATORS in apps/student/features/books/lib/extraSimulators.tsx
OXYGENATION      deoxygenated = BLUE #3b82f6 · oxygenated = RED #ef4444
HIGHLIGHT        current/flow structure = EMERALD #34d399 · tap-selected = INDIGO #6366f1
CANVAS           16:9 (aspectRatio:'16/9', minHeight 320 fallback)
GOLDEN RULE      RENDER IT AND LOOK before declaring done — in Blender AND the browser.
```

---

## 1. PHILOSOPHY & WHY THIS EXISTS

- **Harvest a public good, don't buy assets.** Academically-accurate, segmented,
  labelled human geometry already exists for free (Z-Anatomy → BodyParts3D, funded
  by Japan's DBCLS). We don't model or license organs — we adapt this.
- **The render engine is already paid for.** three / R3F / drei are installed in
  `apps/student`. No new heavy dependency.
- **The wedge vs. paid atlases** (Complete Anatomy / Visible Body, $35–75/yr): we are
  **NCERT/NEET-scoped, in-chapter, bilingual-ready, near-zero marginal cost.** The
  win is pedagogical fit + curriculum integration, not raw model fidelity.
- **Built for a learner with zero biology.** Guided, step-by-step, plain English,
  names on the model, colour-coded. Not a reference atlas — a teaching tool.

---

## 2. ASSET SOURCE & LICENCE (non-negotiable)

- **Source:** `Z-Anatomy.zip` from GitHub `Z-Anatomy/Models-of-human-anatomy`
  (the `Startup.blend` inside is ~293 MB, ~7,184 objects, ~1,944 collections). It is
  organised into nested collections per system/organ (e.g. a top-level `Heart`
  collection with child collections `Right atrium`, `Valvular complex of heart`, …).
- **Licence: CC BY-SA** (Z-Anatomy 4.0; BodyParts3D 2.1-JP). Verified against CC's
  own legal text: ShareAlike attaches **only to modified mesh files**, not to our
  app/code. We **load the unmodified `.glb` and do all peel/colour/label work at
  runtime** → we never distribute a modified mesh → **attribution-only**.
- **MANDATORY:** show the credit line in the viewer UI (heart viewer has it as a
  footer):
  `3D model: BodyParts3D © The Database Center for Life Science (CC BY-SA 2.1 Japan) · Z-Anatomy — the libre 3D atlas of anatomy (CC BY-SA 4.0).`
- Never ship a model tagged `-NC` (non-commercial) or `-ND` (no-derivatives) from any
  marketplace. Supplements: NIH 3D (CC0/CC-BY), Open Anatomy (BSD) — per-model check.

---

## 3. THE BLENDER BRIDGE (how to drive Blender)

Blender runs on the founder's machine with the **Blender Lab "MCP" add-on** (needs
Blender ≥ 5.1, "Allow Online Access" ON, MCP server started → listens on
`localhost:9876`). Two ways to talk to it:

1. **The terminal bridge (preferred for scripted pipeline):**
   `python3 scripts/blender/blender_client.py <code.py>` — sends a `.py` file to
   Blender's socket and runs it with `bpy` in scope; prints stdout + the `result`
   var. **Always send a `.py` FILE (never inline) so quoting survives.** Set a
   `result = {...}` dict in your code to get structured output back.
2. The `mcp__Blender__*` tools (if the connector is wired into the agent session).

**If the bridge says "connection refused":** Blender is closed or its MCP server is
stopped — ask the founder to open Blender → Preferences → Add-ons → MCP → Start MCP
Server (online access ON). **Reopening Blender = a fresh empty scene** (our appended
geometry is not saved), so the build pipeline (§4) must run from scratch each session.

`scripts/blender/` toolkit:
- **`blender_client.py`** — the bridge (keeper).
- **`upload_glb.js`** — `node upload_glb.js <local> <r2key>` uploads to R2 (used if
  hosting on R2; for the flagship we host STATIC instead — see §5).
- `_glb_nodes.js` / `_glb_bbox.js` / `_glb_tris.js` — parse a `.glb` to list node/mesh
  names, check the world bounding box, and count **per-node triangles** (verification).
  Always check `_glb_tris.js` on the EXPORTED glb — Blender's `data.polygons` can lie if
  a modifier is re-applied on export (see §4.7 #8).
- `_*.py` — scratch build steps from the heart build; use as templates, not gospel.

---

## 4. THE BLENDER → glTF PIPELINE (the hard-won recipe)

Run these as ordered steps via the bridge. The heart scripts (`_append_heart`,
`_build_heart`, `_v12_vessels`, `_export_v6`) are the working templates.

### 4.1 Append the organ
- `bpy.data.libraries.load(STARTUP_BLEND, link=False)` with
  `dst.collections = ['<Organ>']` to append the organ collection + its objects.
- Keep only **MESH** objects with geometry. Z-Anatomy also ships **FONT** label
  objects and **CURVE** objects (vessels) — handle separately (below).

### 4.2 Name to the STRUCTURE CONTRACT
- Rename each kept mesh to a canonical token (`right_atrium`, `left_ventricle`,
  `tricuspid`, `aorta`, …). **These tokens ARE the contract** the viewer matches on
  (`HEART_STRUCTURES.match`). Name Blender objects to match the viewer config, not
  the other way round.
- Multiple meshes may share a token (e.g. 3 pulmonary-valve leaflets → `pulmonary_valve`,
  `pulmonary_valve_2`, …). The viewer matches by substring, so suffixes are fine.

### 4.3 Colour by oxygenation (teaching colour, not realism)
- Right heart / deoxygenated → **BLUE** `(0.23,0.45,0.86)`; left heart / oxygenated →
  **RED** `(0.86,0.24,0.27)`; valves → **cream** `(0.90,0.88,0.80)`; muscle/papillary
  → **pink** `(0.94,0.45,0.66)`. Set both the Principled **Base Color** node (for
  glTF export) AND `material.diffuse_color` (for Blender Workbench QA renders).
- The two NEET "exceptions" must read correctly: **pulmonary artery = BLUE**
  (deoxygenated), **pulmonary veins = RED** (oxygenated).

### 4.4 Vessels are CURVES — convert them carefully
Z-Anatomy's great vessels (aorta, venae cavae, pulmonary arteries/veins, coronaries)
are **CURVE** objects, not meshes. To turn them into solid tubes:
1. **Un-parent, keeping world transform** (`mw = o.matrix_world.copy(); o.parent = None;
   o.matrix_world = mw`) — they're parented to FONT labels we delete.
2. **Normalise EVERY spline point's `radius` to 1.0.** Z-Anatomy stores per-point
   radii of 22–30 on big vessels → a uniform `bevel_depth` balloons into a giant
   blob without this. (This was the "exploded vessels" bug.)
3. Set tube thickness + smoothness: `bevel_depth` per vessel (aorta 0.013, venae
   cavae ~0.011–0.012, pulmonary artery 0.010, pulmonary veins 0.006, coronary
   0.0035), `bevel_resolution = 6` (~14 sides → round, NOT faceted), `resolution_u =
   10`, `use_fill_caps = True`.
4. **Convert with a context override** (reliable headless):
   `with bpy.context.temp_override(active_object=o, selected_objects=[o], selected_editable_objects=[o], object=o): bpy.ops.object.convert(target='MESH')`.
5. **Clean stray verts** — some curves have an off-path control point (e.g. one at the
   world origin). After convert, bmesh-delete verts farther than ~0.18 from the mesh's
   **median** vertex.
6. **Reposition strays** — the ascending aorta converts at the world origin; move it to
   the midpoint of (aortic valve centre, aortic arch centre).
- `smooth shading`: set `poly.use_smooth = True` on every polygon (vessels AND the
  whole model) so surfaces look round, not flat.

### 4.5 EXPORT (uniform-axis is critical)
- **Bake every object's transform into its geometry, then reset the node to identity**
  before export: `me.transform(o.matrix_world); o.matrix_world = Matrix.Identity(4)`
  (guard shared mesh data so you transform each mesh once). **Why:** if some objects
  keep a node transform and others don't, `export_yup` converts them to different
  axes (chambers Z-up, converted vessels Y-up) → the model bbox blows up to ~1.4 and
  the organ shrinks to a dot. Baking makes the axis conversion uniform.
- **Un-exclude all collections** in the view layer (`layer_collection.exclude = False`
  recursively) — Z-Anatomy ships many collections view-layer-EXCLUDED, and
  `use_selection=False` only exports view-layer objects → silently drops the rest
  (this dropped the valves the first time).
- **Strip non-mesh** (FONT/CURVE/EMPTY/CAMERA/LIGHT) from the scene first; selection
  in headless Blender is unreliable, so export the whole pruned scene with
  `use_selection=False`.
- Export call:
  `bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=False, export_yup=True, export_apply=True, export_cameras=False, export_lights=False, export_materials='EXPORT')`.
- Target poly budget: **≤ ~80K polys, ≤ ~3 MB** (heart v6 = 73K / 3.05 MB). Fine on a
  mid-range phone.

### 4.6 VERIFY IN BLENDER (the step that was skipped → "cabbage")
- `node scripts/blender/_glb_bbox.js /tmp/<organ>.glb` → overall bbox must be a
  **single tight cluster** (heart ≈ `[0.14, 0.23, 0.13]`), no axis 5–10× the others.
- `node scripts/blender/_glb_nodes.js /tmp/<organ>.glb` → node names must match the
  viewer's structure tokens.
- **Render it and LOOK** (Blender Workbench, single-sided, `_render*` templates) — does
  it look like the organ? Do not proceed on counts alone.

### 4.7 The known gotchas (don't re-hit these)
1. Collections ship **view-layer-excluded** → un-exclude before export.
2. Vessel/valve meshes are **parented to FONT labels** → un-parent (keep transform).
3. Curve **per-point radii** balloon tubes → normalise to 1.0.
4. **Z-up vs Y-up axis mismatch** → bake all transforms to identity before export.
5. Stray control points (often at the **world origin**) → bmesh-clean far verts.
6. **DoubleSide on open chamber shells** shows interiors through gaps = "mush" →
   the viewer renders **FrontSide by default** (see §5.3).
7. **Bones store world position in a parent group (`.g`) object, NOT in their own
   transform** (local verts are origin-centred). Deleting the parent first collapses
   every bone onto the origin (the whole skeleton became a blob). **Capture each
   object's `matrix_world` while the parents are still present, then bake that stored
   matrix into the verts** — never re-read `matrix_world` after detaching/deleting.
8. **Inherited SUBSURF modifier → 3–6× poly explosion on export (skeleton, 2026-06).**
   Some Z-Anatomy bones carry a `Subdivision` modifier. When you `join()` a group, the
   merged mesh inherits the **active object's** modifier stack, so the join silently
   picks up a subsurf. Your `Decimate` then applies *under* it ("modifier was not
   first" warning), `len(data.polygons)` looks small, but `export_apply=True`
   re-subdivides on export → a 152K-tri skeleton ballooned to 280–500K (7–14 MB) and
   the aggressive decimation underneath mangled the fine facial bone. **Fix:
   `o.modifiers.clear()` on every bone before joining/decimating** so detail is
   controlled purely by your own Decimate. Always sanity-check the *exported* glb tri
   count (`scripts/blender/_glb_tris.js`), not just Blender's `data.polygons`.
9. **Mirrored (left-side) bones render INSIDE-OUT in the single-sided viewer
   ("one half of the face looks broken/see-through", skeleton 2026-06).** Z-Anatomy
   builds each left bone by mirroring its right twin — the `.l` object's `matrix_world`
   has a **negative determinant** (mirror scale). When you bake that transform into the
   verts (`me.transform(matrix_world)`), the negative scale **flips the face winding**,
   so every left bone is inside-out. **Blender's solid view is double-sided → it looks
   perfect**, which sends you hunting a geometry bug that isn't there. But the viewer
   renders **FrontSide** (§5.3, so you don't see through the skull) → the flipped faces
   are culled and the whole left/face reads as broken. **Fix: after baking, if
   `world_mats[o].determinant() < 0`, reverse the winding** (`bmesh.ops.reverse_faces`).
   **Diagnostic tell: "perfect in Blender, broken in the browser" == a normals/winding
   problem, NOT geometry.** (Cost us ~4 rounds of chasing phantom asymmetry.)

---

### 4.8 BODY-SYSTEM (multi-part) models — performance recipe (skeleton, 2026-06)

The heart was one organ (~30 meshes). A body system has hundreds of parts; the two
levers that keep it phone-smooth — proven on the **skeleton** (first body-system sim):

1. **MERGE parts into a handful of tappable structures BEFORE decimating.** Z-Anatomy's
   skeletal system is **1,244 mesh objects + 966 zero-poly label anchors** (`.i`/`.j`
   suffix — drop them). 218 real bones were grouped by name into **22 tappable
   structures** (all skull bones→`skull`, all 24 ribs→`ribs`, left+right limb bones
   share one token) and `join()`ed — **218 draw calls → 22**. This draw-call collapse
   matters more than raw tris on mobile. (Group by name pattern; the flat
   `1: Skeletal system` collection has no usable sub-grouping, and the parallel
   `Bones of …` collections overlap and are full of `.i/.j` helpers.)
2. **Decimate per region, not uniformly.** Knobbly/thin bone keeps detail; smooth long
   bone decimates hard. Skeleton final: **506K base tris → 152K**, **3.25 MB**
   uncompressed (no Draco needed — viewer is `useGLTF(url, false)`).

   | region | ratio | note |
   |---|---|---|
   | **skull, mandible** | **1.0 (none)** | The face is the inspection focus. ANY collapse-decimation breaks left/right symmetry AND shrinks each facial bone inward, opening gaps at the sutures (founder rejected 0.30 *and* 0.62). Keep full source resolution. **KEEP the teeth but TRIM the roots** (route upper→`skull`, lower→`mandible`): excluding teeth leaves the thin alveolar bone as a jagged, asymmetric row of empty sockets; but a *whole* Z-Anatomy tooth is crown + a long root, and the maxilla doesn't enclose the roots, so from a rotated view the roots poke out as long "spiky" teeth (founder flagged this). Fix: bmesh-delete each tooth's root, keeping ~the biting 55% (upper teeth crown points −Z so keep low Z; lower teeth crown points +Z so keep high Z). The teeth meshes themselves ARE perfectly symmetric in the source (verify with a per-tooth `.l`/`.r` bbox dump) — the only asymmetry was the exposed roots + viewing angle. |
   | vertebrae, sacrum, pelvis, sternum | 0.30 | irregular shapes need some detail |
   | ribs, scapula, hands, feet | 0.11–0.15 | thin/smooth or small on screen → decimate hard |
   | long limb bones (femur/tibia/…) | 0.20–0.45 | smooth cylinders, decimate hard |

   Net result with a full-res face + teeth: **~250K tris, 6.3 MB** as **one combined
   glb** (glTF ≈ 21 bytes/tri uncompressed) — still no lazy-load/region-split needed.
   **Principle: spend the poly budget where the user zoom in (the face); decimate hard
   where they don't (limbs, ribs, hands, feet).** Decimating the smooth/long bones hard
   is invisible; decimating the intricate face is the first thing a learner notices. Split per region only if a future
   layered model (muscles + vessels + organs together) overshoots; the merge+decimate
   recipe is the same per layer.

3. **Strip the cross-section helper planes** (`Cross Section X/Y/Z`) that ride along with
   the collection, and any object not in your token set, before export. NB: the export
   script's `TOKENS` allow-list deletes everything not listed — when you add/rename
   tokens (e.g. splitting the skull), **update `TOKENS` too** or those bones silently
   vanish from the glb (the tri count drops but Blender still shows them).
4. **Tappability vs merging is a choice per region.** Merge where individual parts
   aren't taught (all 24 ribs → one `ribs`); split where they ARE. The skull shipped
   merged first, but the founder wanted to tap each bone, so it was split into 13
   individual cranial+facial tokens (frontal, parietals, temporals, occipital,
   sphenoid, ethmoid; maxillae+upper teeth, zygomatics, nasals, lacrimals, palatines,
   conchae, vomer) + mandible + hyoid. Splitting only changes node count (37 nodes,
   ~232K tris, 4.9 MB — still fine), not poly budget. When you split, also update: the
   viewer `STRUCTURES` (one entry per new token w/ NCERT blurb), the export `TOKENS`,
   and any `QUIZ_POOL` / `TOUR` ids that referenced the old merged token.

### 4.9 REALISTIC MATERIAL + SOFT TISSUE (skeleton, 2026-06)

Flat white geometry reads as "plastic." Two upgrades close most of the gap to the
paid atlases (Complete Anatomy / Visible Body), proven on the skeleton:

1. **Material + lighting (viewer-only, no rebuild — biggest visual win):**
   - **Ambient occlusion** is the #1 thing: `<EffectComposer><N8AO aoRadius={0.07}
     intensity={2.6}/></EffectComposer>` from `@react-three/postprocessing` (already a
     dep). It shades crevices (eye sockets, between teeth, rib gaps, sutures) so the
     model reads as 3D, not flat. Works fine with `frameloop="demand"` (renders on
     invalidate). We have no baked AO maps, so real-time AO is how you get it.
   - **Soft sheen** via a GENERATED `<Environment>` with inline `<Lightformer>`s (NOT a
     preset — presets fetch HDRIs from a CDN that CSP/offline can block, same class of
     bug as Draco). Set `mat.envMapIntensity` per tissue.
   - **Warm bone tone** (`#e3d4b2`), not white; `roughness ≈ 0.5`. ACES tone mapping.
   - Per-tissue materials, detected by node-name substring in the tag pass: bone
     (warm, rough 0.5), **cartilage/discs** (`#e9edf0`, glossy rough 0.2, env 0.85),
     **ligaments** (`#d8caaa`, matte rough 0.6).
2. **Soft tissue from the "3: Joints" system** (append it alongside `1: Skeletal
   system`; same bake/flip/material machinery): **costal cartilage** (rib→sternum, in
   the skeletal collection), **intervertebral discs** (always-on, spine layer, 0.5
   decimate), **joint cartilage** (menisci/discs/labra), and **ligaments** (294 straps,
   only ~27K tris). EXCLUDE joint **capsules + intercostal/interosseous membranes**
   (they wrap and obscure the bones) and the **nucleus pulposus** (hidden inside discs).
   Ligaments + joint cartilage go in a **"Ligaments" peel layer that's OFF by default**
   — they're numerous and clutter the clean bone view; the student toggles them on to
   study joints. Soft-tissue structures get `division: null` so the axial/appendicular
   toggle ignores them. Full build ≈ 302K tris / 6.6 MB (founder OK with "bulky if
   comprehensive"). Remember to add every new token to the export `TOKENS` allow-list.

## 5. HOSTING + VIEWER ARCHITECTURE

### 5.1 Host the model STATIC (no CORS, no hang)
- Copy the final `.glb` to **`apps/student/public/anatomy/<organ>-vN.glb`** (versioned
  filename to bust browser/CDN cache). Point the viewer at `/anatomy/<organ>-vN.glb`.
- **Why not R2 directly:** three.js loads models via `fetch` (CORS-restricted) and
  R2's public `pub-*.r2.dev` URL sends **no `Access-Control-Allow-Origin`** → the load
  is blocked in the browser (images/video are unaffected — they don't need CORS). A
  static same-origin file can't hang the way the server-side R2 proxy can.
- The R2 proxy route `apps/student/app/anatomy-model/[file]/route.ts` still exists for
  future admin-uploaded models; enabling CORS on the R2 bucket (Cloudflare dashboard)
  would let us serve straight from R2 and drop the proxy.

### 5.2 Wire it in (no schema change)
- The viewer is an **injected simulator**: register it in `EXTRA_SIMULATORS`
  ([extraSimulators.tsx](../../apps/student/features/books/lib/extraSimulators.tsx)),
  e.g. `'nephron-3d': Nephron3DViewer`, lazily via `dynamic(() => import(...), {ssr:false})`.
  It then renders anywhere a normal **`simulation` content block** has that id — in
  the reader AND the Biology Hub. (It does NOT render in the admin editor preview —
  that's an accepted limitation of app-injected sims.)
- Add a catalog row in
  [biologySimulations.ts](../../packages/data/simulations/biologySimulations.ts)
  (`id`, `title`, `description`, `topic`, `grades`, `status`). The Biology Hub page
  and the admin Simulation-block picker are both driven by this catalog.

### 5.3 Viewer rules (copy Heart3DViewer.tsx exactly)
- **Structure contract:** a `HEART_STRUCTURES`-style array of
  `{ id, label, layer, blurb, match[] }`. `classifyMesh(name)` tags each mesh's
  `userData.structureId`/`layer` by substring-matching `match[]`. `id` is the
  CLASSIFIER id used everywhere (highlight, flow, labels).
- **Layers:** a `HEART_LAYERS` array (peel groups). **Hide empty layers** — the viewer
  filters the panel to layers actually present in the model (reported via `onReady`).
- **Single-sided by default** (`material.side = FrontSide`); flip to `DoubleSide`
  **only while cross-section is active** so the cut reads solid. (Open shells +
  DoubleSide = mush.)
- **Camera framing = MANUAL, not drei `<Bounds observe>`.** A `useEffect` frames the
  camera on load + on real canvas resize (ResizeObserver), targets the model's
  (off-origin) bbox centre, and runs **never per-frame**. drei `observe` continuously
  refits and **fights the user's zoom / the animation** — do not use it.
- **`frameloop="demand"`.** Animations (blood flow) self-invalidate (`invalidate()` /
  `state.invalidate()`) only while animating, then idle — battery-friendly and
  zoom-safe.
- **Canvas aspect = match the subject.** The heart (compact) uses 16:9. A **tall
  subject (full skeleton) must use a TALL canvas** — `height: 'min(80vh, 820px)',
  minHeight: 460` — or it sits tiny in a wide letterbox with huge wasted vertical
  space (founder feedback, skeleton). The hub modal is `max-w-6xl` to give room.
- **For large/tall models, enable `zoomToCursor` + `screenSpacePanning` on
  `OrbitControls`.** Default OrbitControls always dollies toward the model centre, so on
  a 1.7 m skeleton you can't zoom into the skull or the feet (founder feedback).
  `zoomToCursor` makes the wheel zoom toward wherever you point; `screenSpacePanning`
  (+ `enablePan`) lets right-drag / two-finger move up–down the body. Put the hint in
  the header ("scroll to zoom where you point · right-drag to move").
- **Tap-to-label:** raycast → `userData.structureId` → side panel shows the NCERT
  `label` + `blurb`. Selected structure glows INDIGO.
- **Graceful states:** error boundary + "model loading soon" fallback if the `.glb`
  is missing.

### 5.4 The GUIDED "follow a drop of blood" pattern (flagship pedagogy)
- **Parent owns the state machine** (`flowStop`, `flowFrom`, `animKey`, `flowPlaying`);
  the in-Canvas `BloodFlow` component is dumb — it animates one drop `from → stop`
  whenever the parent bumps `animKey`, then rests. (Don't put progression logic in
  `useFrame` — it can't be paused/seeked cleanly.)
- **`FLOW_STOPS` ids MUST be the classifier structure ids** (`svc`, `pulmonary_trunk`,
  …) — **not the mesh token names**. Using mesh names silently skips stops / freezes
  the journey. (This bit us; the centroid lookup matches `userData.structureId`.)
- Each stop: the drop pauses, the structure lights **emerald** + gets an **on-model
  name label** (drei `<Html>` at its centroid), a big **plain-English caption overlays
  the canvas** ("Step n of 8 · Oxygen-poor blood — …"), and the drop **lerps
  blue→red across the lungs** / red→blue at the body.
- **Player controls:** ‹ Prev · ❚❚ Pause/▶ Play · Next › · ↻ Replay-step.
- **Sequence strip below the sim:** clickable colour-coded chips of the whole circuit,
  current highlighted, with a "· lungs +O₂ ·" marker and "↺ to body" loop hint; tap a
  chip → jump+pause. Doubles as an at-a-glance map.

---

## 6. DESIGN SYSTEM (match these tokens)

Inherits the simulator design system ([`SIMULATION_DESIGN_WORKFLOW.md`](SIMULATION_DESIGN_WORKFLOW.md)).
Heart viewer constants (`C`):

```
root #0d1117 · card #0B0F15 · input #151E32
canvas radial-gradient(circle at center, #1e204a 0%, #050614 100%)
indigo #6366f1 / #818cf8 / #c4b5fd   (accent, selection)
emerald #34d399                       (active flow / highlight)
oxygenation  BLUE #3b82f6 (deoxy) · RED #ef4444 (oxy)
border rgba(255,255,255,0.08) · textDim rgba(255,255,255,0.5)
```
- Sans-serif only (inherited Geist), no monospace, no `÷`.
- The CC BY-SA credit line is **required** in the viewer footer.

---

## 7. ADD-A-NEW-ORGAN RUNBOOK (nephron, neuron, …)

1. Confirm Blender is open + MCP server running (bridge reachable).
2. Find the organ's collection name in `Startup.blend`
   (`bpy.data.libraries.load` directory read; grep collection names).
3. **Append** the collection → keep solid meshes (§4.1).
4. **Decide the structure tokens + layers** for that organ → write them into a new
   `<Organ>3DViewer.tsx` config (copy Heart3DViewer.tsx) BEFORE naming in Blender, so
   the Blender names and the viewer contract agree.
5. **Rename + colour** meshes to the tokens (§4.2–4.3). Convert any curves (§4.4).
6. **Bake transforms + un-exclude + export** `.glb` (§4.5).
7. **VERIFY** bbox + node names + render-and-look (§4.6).
8. Copy to `apps/student/public/anatomy/<organ>-v1.glb`; set the viewer's model URL.
9. Register in `EXTRA_SIMULATORS` + add the catalog row (§5.2).
10. If it teaches a flow/process, define `FLOW_STOPS` (classifier ids!) for a guided
    journey (§5.4).
11. **Browser-verify** (start the dev server, open the hub, drive every control). A
    churned dev server (HMR) can stall the load — restart `npm run dev` if it sticks.
12. **Accuracy gate:** check every structure + label against NCERT + the founder's
    reference books before publishing. tsc + eslint clean. Update this doc + the
    cockpit if anything new is learned.

---

## 8. VERIFICATION CHECKLIST (before declaring done)

- [ ] Blender Workbench render looks like the organ (not a blob).
- [ ] `_glb_bbox.js`: single tight cluster, sane size.
- [ ] `_glb_nodes.js`: node names == viewer structure tokens.
- [ ] Browser: model renders, framed, recognisable; **0 console errors**.
- [ ] Empty layer toggles hidden; layer peel + opacity work.
- [ ] Cross-section reveals interior (DoubleSide kicks in).
- [ ] Tap-to-label shows correct NCERT name + blurb.
- [ ] Zoom HOLDS during animation (no snap-back).
- [ ] Guided journey advances through all stops; oxygen colour flips at the lungs;
      on-model labels + captions + sequence chips all in sync; Pause/Next/Prev/Replay
      + chip-jump all work.
- [ ] CC BY-SA credit line visible.
- [ ] Accuracy reviewed vs NCERT + reference books.

---

## 9. FILE MAP

| Thing | Path |
|---|---|
| Viewer template | `apps/student/features/anatomy/Heart3DViewer.tsx` |
| Injected-sim registry | `apps/student/features/books/lib/extraSimulators.tsx` |
| Catalog (single source of truth) | `packages/data/simulations/biologySimulations.ts` |
| Public hub | `apps/student/app/biology-hub/` |
| Admin sim picker | `apps/admin/features/admin/books-editor/blocks/SimulationBlockEditor.tsx` |
| Static models | `apps/student/public/anatomy/<organ>-vN.glb` |
| R2 model proxy (fallback) | `apps/student/app/anatomy-model/[file]/route.ts` |
| R2 `'model'` asset type | `packages/core/r2-storage.ts` + `…/books/assets/upload/route.ts` |
| Blender bridge + tools | `scripts/blender/` |
| 2D/canvas sim design | `_agents/workflows/SIMULATION_DESIGN_WORKFLOW.md` |
