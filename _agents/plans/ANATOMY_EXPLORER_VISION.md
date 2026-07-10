---
title: Anatomy Explorer — a full-body, multi-layer 3D atlas (our "Complete Anatomy")
date: 2026-06-22
status: vision / planning — research spike is the next concrete step
---

# ANATOMY EXPLORER — VISION & ARCHITECTURE

> Goal (founder, 2026-06-22): **one simulation that shows the whole body and lets you add/remove
> layers across every system — bones, muscles, nerves, vessels, organs, etc. — as good as
> Elsevier's Complete Anatomy. "No matter the time and effort."** This doc is the build plan.
> Prereq reading: [[reference_3d_anatomy_simulators]] memory + `ANATOMY_3D_SIMULATOR_WORKFLOW.md`
> (our proven single-system pipeline) — the Explorer is that pipeline, scaled to the whole body.

## 1. HONEST FRAMING
- **Complete Anatomy** = 3D4Medical/Elsevier: ~a decade, large team, proprietary medically-
  validated models, native Unity app, AR, physiology animations, ~$100+/yr. We won't 1:1 clone it.
- **What we CAN build:** a very good, **web-based, free, ownable, NEET-scoped** full-body layer
  explorer — integrated with our books/quizzes, offline-capable, near-zero marginal cost.
- **The unlock:** **Z-Anatomy** (CC BY-SA, BodyParts3D) is already a complete, fully-segmented,
  TA2-labelled full-body atlas of all systems — the years-long "label the whole body" work is
  DONE and free. Our job is to make it web-performant, layered and interactive. The **skeleton
  sim was the deliberate proof-of-concept** for this (per its workflow: "proves decimation +
  compression + lazy-load for future multi-layer sims").

## 2. THE CORE CHALLENGE = PERFORMANCE
The full `Startup.blend` is ~293 MB / ~7,000 objects / millions of polys — impossible to load at
once in a browser. The whole architecture is shaped by this:
- **Per-system glb exports** — one optimized, decimated, compressed glb per system (skeletal,
  muscular, nervous, cardiovascular, respiratory, digestive, urinary, lymphatic, endocrine,
  reproductive, integumentary). Same Blender pipeline as the skeleton, generalized + automated.
- **Lazy-load** — a system's glb is fetched only when its layer is toggled on (and unloaded /
  hidden when off). Never hold the whole body in memory at once on mobile.
- **Compression** — Draco or meshopt per glb (we currently ship uncompressed; for the Explorer
  this becomes necessary — verify the decoder works in our viewer + CSP; the heart deliberately
  avoided Draco's CDN, so self-host the decoder or use meshopt).
- **LOD (level of detail)** — a low-poly "overview" mesh when many systems are on / zoomed out;
  swap to higher detail when a system is isolated or zoomed in.
- **Draw-call budget** — merge each system's structures into a handful of meshes for the overview
  (like the skeleton's 218→22), but keep per-structure meshes available for tap-to-label when
  isolated. Likely **desktop-first** for the full multi-system view; mobile gets lighter subsets.

## 3. THE FOUR PILLARS
1. **Asset pipeline (scaled):** generalize the skeleton scripts into a repeatable per-system
   exporter — append collection → drop `.i/.j` helpers + non-structures → keep/name to tokens →
   decimate per importance → per-tissue material → bake (handle the parent-`.g`, subsurf, and
   mirrored-normals gotchas) → export glb → compress → QA render. Output: `public/anatomy/<system>-vN.glb`.
2. **Structure metadata catalog:** extract Z-Anatomy's object names (TA2 Latin + English) per
   system/region/parent into a catalog, then layer our **plain-English blurbs + NEET mapping**
   on top (curated progressively). Powers tap-to-label, search, and the info panel across the
   whole body. (Z-Anatomy ships the labels; we add the teaching layer.)
3. **The Explorer engine** (new `AnatomyExplorer` R3F component): system layer toggles (add/remove
   each system); per-system + per-structure opacity ("peel"); **depth peel** for muscles
   (superficial→deep); **region isolation** (head/thorax/limb); tap-to-label; **search**;
   cross-section/clip; fade-others/isolate-one; reset; guided tours; (later) "muscles engaging vs
   stretching" overlays + clinical layers. Reuses our viewer rules (manual framing, frameloop
   demand, FrontSide, the realism material: warm tones + generated Environment + N8AO).
4. **Integration:** the Explorer is the flagship at a dedicated route (e.g. `/anatomy-explorer`)
   AND embeddable in Live Books as a `simulation` block; the focused single-organ sims (heart,
   skeleton) stay as lesson-level tools. One shared catalog (`biologySimulations.ts` + the new
   structure catalog).

## 4. ROADMAP (phased; honest scope = multi-month, not a weekend)
- **P0 — DONE:** single-system sims (skeleton, heart) → pipeline + viewer + realism + lazy-load
  concept all proven.
- **P1 — RESEARCH SPIKE (do first, fresh session):**
  a. Does a usable **web export of Z-Anatomy** already exist (saves enormous effort)? Survey
     open-source three.js anatomy viewers.
  b. **Performance benchmark:** how many systems / total polys can a mid-range phone and a desktop
     sustain in three.js? Sets the LOD + lazy-load + desktop-vs-mobile budgets.
  c. **Compression:** get Draco *or* meshopt decoding working in our viewer within CSP (self-host
     decoder). Measure size wins.
  d. **Extract the Z-Anatomy name catalog** (per-system object lists already partially mapped in
     `scripts/blender/_*` outputs) → the metadata backbone.
  e. **Build-vs-license decision** (see §5).
- **P2 — 2–3 more systems + catalog:** build the **muscular system** (the headline — superficial
  + deep layers) and the **cardiovascular/nervous** as optimized glbs; stand up the structure
  catalog. Generalize + automate the exporter.
- **P3 — the Explorer engine:** lazy-loading layered viewer with skeleton + muscles + heart/vessels;
  layer toggles, peel, tap-label, search, isolate, cross-section.
- **P4 — fill + polish:** remaining systems; LOD; mobile tuning; guided tours/quizzes; clinical +
  movement overlays; book integration.

## 5. BUILD vs LICENSE (the strategic fork)
- **Build on Z-Anatomy (recommended):** own it, free, integrated, offline-capable, NEET-scoped —
  fits the founder's whole harvest-free-assets strategy. Cost = engineering time (multi-month).
- **License BioDigital Human (shortcut):** has an embed/API, high quality, fast to ship — but
  recurring cost, third-party dependency, not owned, limited customization, needs internet.
  Consider a short BioDigital trial only to benchmark the UX target, then build our own.

## 6. RISKS & MITIGATIONS
- **Mobile performance** (biggest) → desktop-first full view; lazy-load; LOD; aggressive decimation.
- **Geometry cleanup** (Z-Anatomy isn't 3D4Medical-clean) → per-system QA render pass; fix worst.
- **Metadata/labelling effort** (thousands of structures) → curate progressively, NEET-first.
- **Scope creep** → ship the explorer with 3 systems (P3) before chasing all 11.

## 7. IMMEDIATE NEXT ACTION
~~Run **P1 the research spike**~~ **DONE 2026-06-22 — see §8 P1 Findings below.** Next action is now
**P2** (build the muscular system superficial+deep + stand up the structure catalog), per the
go/no-go in §8.6.

---

## 8. P1 FINDINGS (research spike — 2026-06-22)

> **Verdict: GO. Build on Z-Anatomy; do NOT license BioDigital.** The performance wall is real but
> tractable with the lazy-load + LOD + draw-call-merge recipe we already proved on the skeleton.
> Compression is solved with zero CSP work. No turnkey web port exists, so we build the renderer
> either way — which kills the license argument. Budgets and evidence below.

### 8.1 Existing-work survey — is there a shortcut? (deliverable a)
**A shortcut exists only at the ASSET layer, not the APP layer.**
- **Z-Anatomy DOES have a live web build — but it's a Unity WebGL app**, not three.js/glTF:
  runs at `z-anatomy.com` and `lluisv.itch.io/z-anatomy`; source `github.com/LluisV/Z-Anatomy`
  (Unity, 83% C#, CC BY-SA 4.0, ~367★, last meaningful release **Oct 2022**). Models ship as
  **FBX + .blend**; **there is no three.js/glTF export.** Embedding Unity WebGL (~150 MB, slow
  first load) into our Next.js/R3F site is a non-starter. So the reusable shortcut is the
  **content** (the fully-labelled, layered, Terminologia-Anatomica body), via our existing
  `blend → glb → three.js` pipeline. No one has done the three.js port for us.
- **No turnkey open-source three.js full-body explorer exists.** Best code references (for the
  *atlas data model* + edu layer, not drop-in): **Open Anatomy `oabrowser`** (openanatomy.org;
  three.js but **dead AngularJS** — read for concepts only) and **OPANEX**
  (`biocat-ugent/Open-Anatomy-Explorer`, **Apache-2.0**, has quiz-on-model + annotation — the most
  product-shaped reference). UX references: Zygote Body (ex-Google Body), Visible Body.
- A Dec-2025 three.js-forum thread proposing exactly this project got the community answer "**get
  the model from z-anatomy.com, export blend→glb→three.js**" — i.e. our planned path; the build
  (layer toggle, transparency, highlight) is considered the *easy* part, model-prep the hard part.

**Implication:** we build the renderer/UX ourselves regardless of build-vs-license. The years-long
"label the whole body" work is what Z-Anatomy hands us free.

### 8.2 Performance budget (deliverable b)

> **QUALITY-FIRST STANCE (founder decision, 2026-06-22).** This is a **desktop-first, quality-first**
> tool — we will **not** dilute the visual experience to save megabytes, and we are **not** targeting
> high mobile performance. Critically, the three levers are not equal:
> - **Lossless compression (meshopt) — KEPT.** It's a "zip for 3D": the decoded model is identical;
>   it only loads faster. Zero visual cost, so there is no reason to skip it (§8.3). Good internet
>   doesn't make it pointless — it cuts first-load wait + serving cost with no downside.
> - **Mesh MERGING (many meshes → few) — KEPT and leaned on hard.** Also **quality-neutral**:
>   combining meshes loses no geometry, it only cuts draw calls (the #1 perf lever). This + lazy-load
>   is how a quality-first model stays renderable.
> - **Polygon DECIMATION (LOD) — MINIMIZED.** This is the *only* lever that actually costs detail, so
>   we use it sparingly: keep models at/near source resolution; decimate only smooth/far-from-camera
>   parts where it's invisible, and treat a low-poly LOD0 as an *optional* zoomed-out/overview tier,
>   not the default the student normally sees.
> - **The real ceiling is the GPU, not the connection.** Faster internet does not help a graphics
>   card hold ~2M triangles. So **lazy-load (load each system when toggled on) stays** — but it's
>   "render what you're looking at" at full quality, NOT a quality compromise. It's what lets a
>   high-res model run smoothly at all.

Derived from our **two shipped assets** (measured this spike) + cited community ceilings. **A live
on-device benchmark was NOT run** (would need a dev server — can do on request). Measured:

| Asset | Triangles | Draw calls (mesh nodes) | Uncompressed glb | Bytes/tri |
|---|---|---|---|---|
| heart-v6 (one organ) | 154,804 | 29 | 3.06 MB | ~19.7 |
| skeleton-v8 (one full-body **system**, merged 218 bones→38 nodes) | 302,140 | 38 | 6.56 MB | ~21.7 |

**The #1 lever is DRAW CALLS, not triangles** (community consensus + our own 218→38 merge). A
single 300K-tri merged mesh renders fine; 300 tiny meshes choke mobile CPU. Budgets to design to:

| Budget | Mid-range phone (test on **iOS Safari** — the worst case) | Desktop |
|---|---|---|
| Draw calls (active view) | **< ~50** (hard ceiling ~100) | < ~300–500 |
| Visible triangles | ~150K soft cap | 1M+ OK |
| Resident geometry (decoded) | **~3 MB** | ~15 MB |
| Initial download (meshopt+brotli) | a few MB, lazy-load the rest | 10–20 MB OK |

**What this means concretely for the Explorer (the core architecture decision):**
- A full body = **9 systems**. If each system is skeleton-shaped (~30 draw calls, ~250K tris,
  ~1 MB meshopt-over-wire), **all 9 at once ≈ 270 draw calls, ~2M tris, ~10–14 MB** — that **blows
  the mobile budget ~5× on draw calls and ~13× on tris.** This *confirms the doc's core thesis:
  never load the whole body at once.**
- **Mobile:** show **1–2 systems at full detail at a time**, OR a single merged low-LOD whole-body
  overview. Hard cap ~2–3 concurrent systems. **Desktop:** ~3–5 concurrent systems at full detail;
  all-layers only via the LOD overview tier.
- **LOD tiers:** **LOD0 "overview"** = per-system aggressively-decimated + merged to 1–few draw
  calls (e.g. skeleton-overview ~80K tris / ~3 calls) for zoomed-out / many-on / mobile; **LOD1
  "detail"** = the current per-system glb when that system is isolated/zoomed; per-structure meshes
  exposed only when a system is isolated (for tap-to-label).
- **Lazy-load** each system as its own glb fetched on layer-toggle (~1 MB meshopt over the wire),
  unloaded when toggled off. Initial paint = skeleton overview only (~0.3 MB).

### 8.3 Compression in our viewer + CSP (deliverable c) — SOLVED, zero CSP work
Ran `gltf-transform` on **skeleton-v8.glb** (6.56 MB uncompressed baseline):

| Variant | glb on disk | + brotli (CDN edge, over-the-wire) | vs baseline |
|---|---|---|---|
| baseline (uncompressed) | 6.56 MB | 3.08 MB | — |
| **meshopt** (`EXT_meshopt_compression` + `KHR_mesh_quantization`) | **1.56 MB** | **1.07 MB** | **−76% disk / −65% wire** |
| draco (`KHR_draco_mesh_compression`) | 1.01 MB | 0.96 MB | −85% disk |

- **Node names are preserved identically (38/38)** in both — so tap-to-label tokens and the viewer's
  `match[]` classifier keep working after compression.
- **Meshopt is the pick, and it already works with our exact setup:** three ships the decoder
  **locally** (`three/examples/jsm/libs/meshopt_decoder.module.js`, 32 KB), and drei's `useGLTF`
  wires `MeshoptDecoder` **by default** (`setMeshoptDecoder` in drei `Gltf.js`). Our existing call
  **`useGLTF(url, false)`** (draco off, meshopt on) decodes a meshopt glb with **no CDN and no CSP
  change**. The heart/skeleton glbs are currently *un*compressed (verified — the "meshopt on"
  viewer comment was aspirational); just running them through `gltf-transform meshopt` shrinks them
  ~76% with no code change.
- **Draco is ~10% smaller over the wire but rejected:** its decoder is bigger and drei defaults
  Draco to a **gstatic CDN** → we'd have to self-host `draco/*` under `/public` AND it fights our
  CSP. Meshopt's marginally larger file isn't worth that friction. (Reserve Draco only if a future
  organ is still too big after meshopt.)
- **Pipeline for every Explorer asset:** `gltf-transform weld → simplify → quantize → meshopt`,
  ship `.glb` static under `public/anatomy/`, let the edge brotli it, decoder stays local.

### 8.4 Structure catalog (deliverable d) — DRAFT BUILT
Directory-read of `Startup.blend` (no scene mutation, no source write) →
**`packages/data/simulations/anatomy-structure-catalog.draft.json`** (233 KB). Contents:
- **7,184 objects** total → drop **1,572 `.i/.j` label-helper anchors** → **5,612 real structures**;
  **1,944 collections** (the full TA2 region/structure name tree — exact, the richest search/label
  backbone). Built by `scripts/blender/_explorer_catalog_build.py` (scratch).
- Z-Anatomy groups the body as **9 numbered top-level systems** (not 11 — our 11-system pedagogy
  maps onto these): `1 Skeletal · 2 Muscular insertions · 3 Joints · 4 Muscular · 5 Cardiovascular ·
  6 Lymphoid · 7 Nervous & Sense organs · 8 Visceral systems · 9 Regions of human body`.
- Per-system **keyword first-cut** counts (objects / unique base names): skeletal 1,282/1,048 ·
  muscular 967/755 · cardiovascular 682/451 · nervous 573/349 · joints 390/272 · visceral 358/312 ·
  lymphoid 218/165 · regions 123/76 · **unclassified ~1,017 (~18%)**. The grouping is **approximate**
  (objects often lack a system token); **exact per-system membership is captured at build time** when
  each numbered collection is appended (that's already a build step). The teaching layer
  (plain-English blurbs + NEET mapping) is layered on top progressively, NEET-first.

### 8.5 Build vs license (deliverable e) — BUILD on Z-Anatomy
**BioDigital Human:** has a JS API + iOS/Android SDKs + iframe embed — but **all gated behind paid
School/Business plans**, and **pricing is not published** (every path → "Contact Sales"; annual,
non-refundable; a free "Personal" tier explicitly **excludes** the developer/embed toolkits). Online-
only, third-party, limited customization. A "May 2026 changes to Individual Plans" notice means terms
are in flux. Net: opaque recurring enterprise cost for something we can't deeply customize or take
offline.

**Recommendation — BUILD.** (1) We build the renderer/UX either way (no turnkey web port exists), so
licensing only buys *models*, which Z-Anatomy gives free under CC BY-SA. (2) Owned, offline-capable,
NEET-scoped, near-zero marginal cost — fits the founder's harvest-free-assets strategy. (3) The two
things that made BioDigital/Complete Anatomy's moat — the labelled atlas and the layered renderer —
are respectively *handed to us by Z-Anatomy* and *the work we're already doing*. Optionally spin up a
BioDigital free trial purely to benchmark the UX target; don't build on it.

### 8.6 GO / NO-GO
**GO.** Proceed to **P2**: build the **muscular system** (headline — superficial + deep peel layers)
+ **cardiovascular** as meshopt glbs using the proven skeleton recipe, tuned to the **quality-first
stance (§8.2)**: keep meshes at/near source resolution, lean on **mesh merging** (quality-neutral
draw-call cut) + **lazy-load** to stay renderable, and **decimate only sparingly** (smooth/far parts
where it's invisible), then `gltf-transform meshopt` (lossless). Stand up the structure catalog
(curate the muscular + cardiovascular slices of the draft with NEET blurbs). Bake the §8.2 budgets +
quality-first stance + §8.3 meshopt step into `ANATOMY_3D_SIMULATOR_WORKFLOW.md`. Defer the
`AnatomyExplorer` engine to P3 (after 3 systems exist). Risks unchanged from §6; the spike confirmed
they're tractable, not blocking.
