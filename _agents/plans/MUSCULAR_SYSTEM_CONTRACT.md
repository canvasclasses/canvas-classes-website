---
title: Muscular System — structure contract & peel-layer design (P2, first Explorer component)
date: 2026-06-22
status: DRAFT — awaiting founder sign-off on scope before the Blender build
---

# MUSCULAR SYSTEM — STRUCTURE CONTRACT

> The design the Blender naming + the `AnatomyViewer` config must agree on (workflow §7 step 4:
> decide tokens + layers BEFORE naming in Blender). First component of the Anatomy Explorer built on
> the new **shared `AnatomyViewer` core**. Source: Z-Anatomy `4: Muscular system`.

## 1. What's in the source (recon, 2026-06-22)
- **684 mesh objects (~348 unique, L/R twins) · ~2.05M polys · FLAT (no sub-grouping) · depth NOT
  labelled.** Names are TA Latin+English (e.g. `Latissimus dorsi muscle.r`).
- The 348 are a mix: **real muscles** (teaching targets) + **fascia/aponeuroses** (IT tract,
  epicranial/palmar/plantar aponeuroses, fascia lata, thoracolumbar fascia) + **~30 bursae** +
  **~20 tendon sheaths** + retinacula/septa + `Cross Section X/Y/Z` + the `Muscular system.g` parent.

## 2. KEEP / DROP policy (cuts the 348 down to the teaching set)
- **DROP (noise for a learner):** all **bursae** (~30: subtendinous/subcutaneous/trochanteric…),
  all **tendon sheaths** (~20), **intermuscular septa**, **retinacula** (small straps), the
  **deep fascia *layers*** of thoracolumbar fascia, `Cross Section X/Y/Z`, `Muscular system.g`,
  tiny laryngeal/ocular sub-parts below NEET need (keep the eye's recti+obliques as ONE "extraocular
  muscles" group; keep pharyngeal constrictors merged). ~70–80 structures drop here.
- **KEEP merged into the muscle layer (visually load-bearing):** the big **aponeuroses/IT tract**
  (epicranial aponeurosis, iliotibial tract, palmar/plantar aponeurosis, fascia lata) — they read as
  part of the body surface; tag them to their parent muscle/region, not individually tappable.
- **KEEP as muscles:** everything else → grouped + depth-tagged below.

## 3. The PEEL model (the headline feature)
Two independent controls on the shared core (same machinery future systems reuse):
- **Depth peel — 3 tiers** (the classic teaching layering; superficial muscles fade/hide to reveal
  deep ones):
  - **L1 Superficial** — what you see first.
  - **L2 Intermediate.**
  - **L3 Deep.**
- **Region isolation** — `head_neck · trunk_anterior · back · shoulder_arm · forearm_hand ·
  hip_thigh · leg_foot` (tap a region → isolate; "show all" resets). Mirrors the skeleton's
  axial/appendicular toggle, generalized.

A muscle carries BOTH a `depth` (L1/L2/L3) and a `region` tag. Superficial-peel + region-isolate
compose (e.g. "deep muscles of the forearm").

## 4. Proposed TAPPABLE scope by region + depth
Recommended tier = **"major NEET + the headline superficial muscles" (~90 tappable tokens)** — every
muscle a NEET/board student names, plus the major surface muscles that make the body read as a body;
tiny intrinsic clusters merged into group tokens. (Scope options in §6 — founder picks.)

| Region | L1 Superficial (tappable) | L2 Intermediate | L3 Deep |
|---|---|---|---|
| **Head/neck** | frontalis, occipitalis, orbicularis oculi, orbicularis oris, zygomaticus (major+minor→`zygomaticus`), buccinator, masseter, temporalis, platysma, sternocleidomastoid | omohyoid, sternohyoid, digastric, mylohyoid, splenius capitis | scalenes (ant/mid/post→`scalenes`), longus colli/capitis→`prevertebral`, pterygoids, suboccipital group |
| **Trunk anterior** | pectoralis major, rectus abdominis, external oblique, serratus anterior | pectoralis minor, internal oblique, subclavius | transversus abdominis, external/internal/innermost intercostals→`intercostals`, diaphragm, transversus thoracis |
| **Back** | trapezius, latissimus dorsi | rhomboids (major+minor→`rhomboids`), levator scapulae, serratus posterior (sup+inf→`serratus_posterior`), splenius | erector spinae (iliocostalis+longissimus+spinalis→`erector_spinae`), multifidus, rotatores, quadratus lumborum, semispinalis |
| **Shoulder/arm** | deltoid (all parts→`deltoid`), biceps brachii (both heads→`biceps_brachii`), triceps brachii (all heads→`triceps_brachii`) | brachialis, coracobrachialis, supraspinatus, infraspinatus | subscapularis, teres major, teres minor, anconeus |
| **Forearm/hand** | brachioradialis, flexor carpi radialis/ulnaris + palmaris longus→`superficial_flexors`, extensor carpi radialis/ulnaris + extensor digitorum→`superficial_extensors` | flexor digitorum superficialis, pronator teres, supinator | flexor digitorum profundus, flexor pollicis longus, pronator quadratus, abductor pollicis longus; **hand intrinsics → `hand_intrinsics`** |
| **Hip/thigh** | gluteus maximus, rectus femoris, vastus lateralis/medialis/intermedius→keep 3, sartorius, biceps femoris, semitendinosus, semimembranosus, gracilis, tensor fasciae latae | gluteus medius, adductor longus/magnus/brevis→`adductors`, pectineus, iliopsoas (iliacus+psoas major→`iliopsoas`) | gluteus minimus, deep hip rotators (piriformis, gemelli, obturators, quadratus femoris→`deep_hip_rotators`) |
| **Leg/foot** | gastrocnemius (both heads→`gastrocnemius`), tibialis anterior, fibularis longus/brevis→`fibularis`, extensor digitorum longus | soleus, plantaris, extensor hallucis longus | tibialis posterior, flexor digitorum longus, flexor hallucis longus, popliteus; **foot intrinsics → `foot_intrinsics`** |

(extraocular recti+obliques → one `extraocular_muscles`; pharyngeal constrictors → `pharyngeal_constrictors`.)

## 5. Performance projection (quality-first, §8.2 budgets)
~2.05M source polys. Decimate the smooth sheets HARD (invisible): intercostals (~76–82K each),
IT tract (97K), external/internal obliques (~58–59K), transversus abdominis (69K), serratus anterior
(50K), aponeuroses — these alone are ~700K polys and lose nothing visibly at 0.1–0.2. Keep limb/face
muscles near source. **Target ≈ 500–800K tris → meshopt ≈ 2–3.5 MB over the wire.** Draw calls: ~90
tappable tokens, but **merged per (region × depth)** for rendering → well under the desktop budget;
isolate-a-region exposes per-muscle meshes for tap-to-label (same trick as the skeleton).

## 6. SCOPE OPTIONS (founder decision)
| Option | Tappable muscles | Feel | Build cost |
|---|---|---|---|
| **A — NEET-essential** | ~55 | clean, exam-focused; tiny muscles merged/dropped | fastest |
| **B — Major + surface (recommended)** | ~90 | looks like a real body, names every muscle a student meets | moderate |
| **C — Comprehensive** | ~200+ | near-atlas; every named muscle tappable | slowest, risks clutter |

All three use the SAME 3-tier peel + region model and the SAME glb (scope only changes how finely we
split tappable tokens vs merge). The peel/region UX is identical.

## 7. SKIN LAYER + EYEBALLS (founder decision, 2026-06-23)
**Problem found:** the bare muscular face reads as a skull/"monkey" — thin facial muscles over **empty
eye sockets**, no lips/cheeks/nose. (The body looks fine; only the face, where muscle is thin over
bone, looks stark. Confirmed via head close-up render `/tmp/anat-compress/muscular_face.png`.)

**Findings (verified this session):**
- **Eyeballs EXIST in Z-Anatomy** as real meshes (sclera, cornea, iris, lens, in the sense-organs
  system) → **add them** (append the eyeball mesh objects directly; collection-name append pulled the
  wrong objects, so append by object). This alone removes the hollow-socket skull cue. Applies to
  every head-containing system.
- **Z-Anatomy has NO skin/body-surface mesh.** Its "Skin"/"Integument" collections hold only **hair +
  nails** (~12K polys, 14 meshes); "9: Regions of human body" is only small surface patches + label
  anchors (~38K polys); a global search found no whole-body surface. BodyParts3D segmented *internal*
  structures only.

**Decision: source a free CC0 human body** (e.g. MakeHuman, CC0 mesh output — has a real face) and use
it as the **outermost "skin" peel layer**: default view = recognizable human → peel skin away → muscles
→ (Explorer: → skeleton/organs). This is the **universal outermost layer for the whole Anatomy
Explorer**, not just muscular — a strategic, reusable investment.

**Key risk = pose/proportion alignment:** the skin body must match Z-Anatomy's standing near-anatomical
pose (arms slightly abducted, palms ~forward) and enclose the muscles. When "skin on" is opaque it only
needs to *enclose* the muscles (forgiving); exact contact matters only if shown semi-transparent.
Sourcing + alignment approach is a **separate spike** (research launched 2026-06-23) — do NOT block the
muscular muscle-mesh build (naming/decimate/export, §1–6) on it; skin is an additive outer layer added
later. Eyeballs are added now.

**Skin source (research result, 2026-06-23): MakeHuman via the MPFB2 Blender plugin.** CC0 mesh output
(commercial-safe), generates a full body **with a real parametric face** directly in Blender, clean
~14K-vert quad topology, and its default A-pose is already close to Z-Anatomy's (arms down-and-out) —
so alignment = coarse bone-rotation + a lattice scale to *enclose* the muscles (NOT shrinkwrap), "hours
not days." Pipeline: generate in Blender → bake pose, delete rig/shape-keys → flat neutral skin-tone
material (no texture) → static GLB → meshopt. Fallback: Blender Studio "Human Base Meshes" (CC0). Avoid
Three D Scans (statues) and SMPL (research-license).

## 8. PROVEN "REFINED LOOK" RECIPE (preview validated 2026-06-23)
The founder compared our grey Blender QA view to Complete Anatomy and asked for that refinement. A
preview render (`~/Desktop/anatomy-previews/muscular-refined-preview.png`, script
`scripts/blender/_refined_preview_render.py`) proved **the gap is presentation, not geometry** — the
Z-Anatomy mesh is already good. The levers that closed it, to bake into the real build + viewer:
1. **Per-tissue colour (biggest lever):** muscle = **red** `(0.52, 0.11, 0.11)` with a slight wet sheen
   (roughness ~0.42), tendon/aponeurosis = **white/cream** `(0.90, 0.88, 0.82)`, bone = cream
   `(0.86, 0.80, 0.66)`. Set the glb's per-mesh base colour from the structure-map tissue type so the
   web viewer renders muscle red / tendon white out of the box. (The grey look was just untinted QA.)
2. **Drop the fascia (already in our drop-list):** the white investing/pectoral/abdominal fascia sheets
   blanket the torso and HIDE the red muscle — dropping them (§2) is what reveals the muscular figure.
3. **Soft lighting + ambient occlusion + smooth shading:** the viewer already has the realism recipe
   (generated Environment + N8AO + smooth normals); apply per-tissue PBR. Filmic/medium-contrast, NOT
   blown-out — keep lights moderate so red doesn't wash to pink.
4. **Skeleton as context (free):** skeleton + muscles are both Z-Anatomy → same coordinate space → they
   align with zero work; showing cream bone behind red muscle (like CA) is just loading both layers.
5. **Eyeballs + (later) transparency peel** for the face + superficial-over-deep layering.
Honest ceiling: Complete Anatomy has a decade of proprietary photoreal shaders; we won't 1:1 match, but
this recipe lands a clean, NEET-appropriate, recognisably-refined look on owned CC BY-SA assets.

## 9. HEAD-REFINEMENT GAPS vs Complete Anatomy (founder side-by-side, 2026-06-23)
**Root cause (the big one):** Z-Anatomy/BodyParts3D is derived from **one real cadaver** (segmented per
structure) — anatomically accurate but it's a real person's lumpy, asymmetric, prominent-featured body,
and separately-segmented muscles don't always abut cleanly. Complete Anatomy uses **idealised, artist-
sculpted, retopologised** models built for beauty + watertight blending. So the gap is largely
*scanned-real vs sculpted-ideal*, not a material/lighting bug.

Founder-flagged + my findings, by fixability:
- **FIXABLE NOW (parts exist in Z-Anatomy, add like eyeballs):** ears absent → add **auricle** (helix/
  concha/tragus/lobule… 18 parts, confirmed); **eyeballs** absent → add sclera/cornea/iris (confirmed,
  sits in socket). Apply to every head-containing system.
- **PARTLY FIXABLE:** *teeth protruding* — teeth are skeletal, visible only because there are no lips;
  **hide skeletal teeth in muscle-only view** (show with the skull layer). *Jaw line "section missing"*
  — masseter/buccal coverage is thin + gaps between segmented muscles; verify, may need a coverage patch.
  *Forehead bulge* + *inter-muscle gaps* — partly the specimen, partly no skin; smooth-shading + AO help.
- **INHERENT (only the skin layer or sculpting fixes):** *nose too big* — it's the bare **nasal bone**;
  Z-Anatomy has only the alar (tip) cartilage, no soft-tissue nose. *Overall proportions / lumpiness* —
  it's a real specimen.

## 10. HEAD GEOMETRY RESHAPE — Option B (founder chose 2026-06-23; "match CA, don't invent")
Founder approved reshaping the head toward the Complete Anatomy reference (a validated, textbook-typical
skull) — framed as **normalising an atypical cadaver specimen to the anatomical norm**, so accuracy holds
as long as edits are *proportional* (resize/reposition real structures, no fabrication) and verified vs
the reference. Execution path chosen: **coarse passes done by the agent via script, render-approved each
pass** (the live-viewport/artist path was offered; founder chose agent-driven).
- **Tool: `scripts/blender/_head_reshape.py`** — reproducible, parameterised: loads fresh, deforms a
  spatial ZONE across ALL layers at once (bone+cartilage+muscle move together → stay aligned), sets the
  working profile camera, renders. **Key learnings baked in:** camera up-axis MUST be local `Y`
  (`to_track_quat('-Z','Y')`) — `Z` rolls the view; and **`bpy.context.view_layer.update()` after
  append** is mandatory or framing reads stale origin transforms.
- **Sequence (founder order):** ① nose ② cranium depth ③ forehead back ④ chin/jawline.
- **① Nose — in progress:** anisotropic shrink toward the nasion root `(0,-0.085,1.555)`, params
  `SY=0.50` (forward projection — main lever), `SX=0.80`, `SZ=0.82`, zone `|x|<0.032, 1.50<z<1.60,
  y<-0.082`, teeth excluded. Pass 2 visibly de-beaked the nose (1583 verts). Renders:
  `~/Desktop/anatomy-previews/nose-BEFORE / -AFTER-pass2.png`. Awaiting founder approve/steer before ②.
- **To productionise:** the same zone-deform params get applied in BOTH the skeletal and muscular export
  pipelines so the shipped glbs stay consistent. (Not yet baked into exports — still prototyping the shape.)

**Strategic consequence — the MakeHuman skin layer is now the linchpin, not a nicety:** the idealised
skin (proper nose, ears, eyelids, smooth forehead, no gaps) is the *beautiful, complete* default view;
peel it to reveal the *accurate* muscle layer. This is honest pedagogy (real anatomy isn't airbrushed)
while looking great outside. We will NOT match CA's **sculpted muscle-layer beauty** without commissioning/
sculpting idealised muscle models (huge effort, defeats the free-asset strategy) — set that expectation.

## 11. HEAD RESHAPE — PAUSED; buy-vs-fix decided (founder, 2026-06-24)
**The blind script-loop head reshape failed.** ~12 passes (nose×4, teeth trim, global widen/de-elongate,
occiput, brow) net **degraded** the head — global tweaks silently dented earlier ones (the squish re-beaked
the nose; the teeth-trim broke the crowns; the brow bulged). **Reverted to the clean Z-Anatomy skull + the
one gentle nose reduction** (`_head_reshape.py` params: SY=0.74/SX=0.90/SZ=0.92/LIFT=0.35, everything else
=identity). **Lesson: fine craniofacial proportion-matching is interactive-artist work; stacking blind
numeric deformations is the wrong tool — do NOT resume it.** Nothing was ever baked into production assets.

**Buyable-model research (2026-06-24) — key findings:**
- **The license trap is the real constraint:** our three.js app serves raw glTF to the browser
  (downloadable), and TurboSquid/CGTrader/Sketchfab/**Zygote** all forbid end-user extraction / open
  stand-alone files. So most commercial models legally **can't** be served the way our web app works.
  **→ Z-Anatomy's CC BY-SA (free, segmented, TA-labelled, open-web-embeddable) is a genuine advantage,
  not just a cost saving.**
- **Best buyable fit = SciePro** ("SP ONE", 3,600+ segmented structures, TA-labelled, multi-system,
  **one-time licence**, built for interactive apps): **€30k single body / €50k both sexes** — but must get
  written confirmation that open-web glTF embedding is allowed. **Zygote** = enterprise/negotiate
  (royalty + extraction-protection). **BioDigital/3D4Medical/Visible Body** = rent-an-embedded-viewer,
  you don't own/drive the geometry → wrong for our three.js stack. Cheap marketplace = license trap.
- **Founder decision: keep Z-Anatomy for now; later hire a 3D artist** (~$1–3k) to re-sculpt the head
  proportions toward CA in a live viewport. SciePro (€30–50k) reserved as the no-compromise option if
  budget becomes no-object AND the web-embed clause is confirmed.

## 12. RESUMED: production muscle build (2026-06-24)
Per founder ("continue working on muscles, tissue, skin"). Building the real muscle asset via
`scripts/blender/_muscular_build.py` (adapts the proven skeleton recipe + the structure map): append
`4: Muscular system` → classify via map (drop-first + longest-match) → drop fascia → capture `.g`-parent
world matrices → bake into verts → flip mirrored-normal (neg-determinant) meshes → clear subsurf → red
material → **merge per token (~81 draw calls)** → decimate (smooth sheets 0.22, else 0.55) → export glb →
meshopt. Output: `muscular-v1.glb`. Next: QA render; add eyeballs+ears; shared `AnatomyViewer` + config +
register `muscular-3d`; then the MakeHuman **skin** layer (its own outer mesh, beautiful by default).

## 13. ASSET INVENTORY — built via the pipeline (2026-06-24)
Founder set the order (eyes/ears → skin → other systems → viewer last); I'm building systems with the
proven `_*_build.py` pipeline (append → classify → drop noise → bake `.g` → flip mirrored normals →
per-tissue material → merge per token → decimate if needed → export → `gltf-transform meshopt`). Built so far:

| Asset | Build script | Tokens / draw calls | Tris | meshopt size | Notes |
|---|---|---|---|---|---|
| `skeleton-v8.glb` (pre-existing) | (prior session) | 38 | 302K | 1.5 MB | + gentle nose reduction prototype (not baked) |
| `muscular-v1.glb` | `_muscular_build.py` | 81 | 743K | **3.3 MB** | red muscle, fascia dropped, normals OK |
| `head-features-v1.glb` | `_head_features_build.py` | 4 (`eyeball_l/r`,`ear_l/r`) | ~10K | **67 KB** | shared — shown on the head in EVERY layer; fills sockets |
| `viscera-v1.glb` | `_viscera_build.py` | 31 organs | ~33K | **438 KB** | respiratory+digestive+urinary+endocrine+reproductive; per-system colours |
| `nervous-v1.glb` | `_nervous_build.py` | 7 (cerebrum/cerebellum/brainstem/diencephalon/spinal_cord/ventricles/meninges) | ~305K | **1.47 MB** | brain + cord; 249 nerve curves dropped v1; sense organs skipped (in head-features) |
| `lymphoid-v1.glb` | `_lymph_build.py` | 4 (spleen/thymus/lymph_nodes/tonsils) | ~79K | **872 KB** | nodes merged into one group; green-coded |
| `cardio-v1.glb` | `_cardio_build.py` | 3 (heart/arteries/veins) | ~530K | **3.0 MB** | 654 vessel curves→tubes (heart recipe); red arteries/blue veins; merged via `gltf-transform join` (Blender join failed at 400+); FONT labels stripped. v1 notes: one retinal artery ballooned (radius), great-vessel thickness uniform-ish |

**✅ ALL MAJOR SYSTEMS BUILT (2026-06-24):** skeletal, muscular, visceral (5 organ systems), nervous,
lymphoid, cardiovascular + shared head-features (eyes/ears). Z-Anatomy systems 2 (Muscular insertions)
and 9 (Regions) are not real display layers; system 3 (Joints) cartilage/ligaments rode with the skeleton.
**Whole layered body ≈ 10.8 MB compressed, lazy-loaded per system.**

## 14. VIEWER BUILT (2026-06-24) — the integration
- **`apps/student/features/anatomy/AnatomyExplorer.tsx`** — multi-layer R3F viewer: per-system
  toggle + opacity "peel" slider, **lazy-loads each system glb only when toggled on**, tap-to-label
  (raycast → glb node token → prettified), head-features auto-shown with the head. Reuses the proven
  rules: `FrontSide`, manual one-time camera frame (`FrameOnce`), `frameloop="demand"`, generated
  `<Environment>` + `<Lightformer>` (no CDN) + N8AO, ACES, error boundary, CC BY-SA credit.
- **Wired:** glbs hosted static at `apps/student/public/anatomy/{skeleton,muscular,cardio,nervous,
  viscera,lymphoid,head-features}-v1.glb` (meshopt); registered `'anatomy-explorer'` in
  `EXTRA_SIMULATORS` (embeddable as a `simulation` block); catalog row in `biologySimulations.ts`
  (Biology Hub, status live); **dedicated route `/anatomy-explorer`** (cacheable server shell
  `page.tsx` + client island, `revalidate=86400` per §10).
- **Status: code-complete, `npm run lint` clean — NOT yet browser-verified** (no dev server per §5.2;
  founder runs `npm run dev` → `/anatomy-explorer`). Likely-iterate items on first run: camera framing,
  per-layer default opacities, label prettification.
- **Remaining after review:** skin layer (artist) + head polish (artist) + NEET teaching blurbs on the
  structure catalog + v1 refinements (viscera omentum as its own peel layer; parathyroid/thyroid split;
  vessel thickness; nerve curves).

## 15. PEDAGOGY PIVOT (founder, 2026-06-24) — "a model with sliders teaches nothing"
**Founder critique (correct):** the all-layers Explorer is a *reference atlas*, not a learning tool — the
opacity sliders are vanity, and layered models with only tap-to-name have no learning outcome. **The 3D
is the illustration; the learning is the part we hadn't built.** What creates learning value: (1) guided
tours (camera-led, plain-English + NEET relevance), (2) a real info panel (function + exam facts, not just
a name), (3) active recall quizzes (tap-to-identify), (4) cross-system relationship views (muscle + its
nerve + its artery), (5) NEET/NCERT curriculum mapping + Crucible links. Peel must be *purposeful*
(superficial→deep, isolate, reveal-underneath), not a dimmer.
**Reframe:** the Explorer = a *sandbox/reference*; real learning lives in **focused, guided single-system
viewers** (like the heart/skeleton sims) **and in the Anatomy & Physiology Live Book** (the existing engine
— plain-English pages + reasoning prompts + quizzes, with the models embedded). The model library we built
is the illustration set for that course. Bulk of remaining effort = **content** (accurate, NCERT-referenced).

**Decision: template the learning experience on ONE system first (muscular).** Built
`apps/student/features/anatomy/MuscularSystemViewer.tsx` (+ route `/muscular-system`, registered
`'muscular-system'`, catalog row, content `muscularLearning.ts` generated from the structure map):
- **Depth-peel** Superficial→Intermediate→Deep (purposeful — replaces vanity opacity).
- **Region isolate** (7 regions).
- **Tap-to-learn info panel** — label + region + depth + what-it-does blurb (NEET content from the map).
- **Guided tour** — 14 iconic muscles head→toe, camera focuses each + caption.
- **Quiz** — "tap the muscle" active recall, scored (superficial pool).
This is the replicable template; the other systems get the same treatment, then weave into the A&P book.
Status: code-complete; `npm run lint` pending; not browser-verified (founder runs dev server).

**Known v1 refinements (deferred, non-blocking):** (a) viscera — the greater **omentum covers the gut**
(anatomically correct but should become its own peel layer so the colon/stomach show); (b) **parathyroid
merged into thyroid** (the "thyroid" substring caught "para*thyroid*" — longest-match fix later); (c) the
44 visceral **curves** (small ducts/bronchi/ureters) were dropped for v1 — add via the heart's
curve→tube recipe later; (d) eyeball cornea/lens skipped (internal). **Next systems:** nervous (brain +
cord, solid meshes) → cardiovascular (vessels = curves, needs the heart tube-conversion recipe) →
lymphoid. Then MakeHuman **skin**, then the shared `AnatomyViewer` + wiring.
