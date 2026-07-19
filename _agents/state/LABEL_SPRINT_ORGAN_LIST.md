# Label Sprint — Organ/Diagram Master List (Class 11 + 12 Biology)

> **This is the progress ledger for the Label Sprint library.** Every diagram-worthy
> structure across the full Class 11 + 12 NCERT Biology syllabus is listed here, grouped
> by chapter, so we can work through it "slowly and steadily" without losing track of
> what's done, what's next, and what still needs a source image. Update this file every
> time an organ moves status. See [`LABEL_SPRINT_WORKFLOW.md`](../workflows/LABEL_SPRINT_WORKFLOW.md)
> for the how; this file is only the what/when.

**Status key:**
- ✅ **Done** — image keyed+cropped, hotspots authored, verified live in the prototype, `.block.json` staged in `scripts/label-sprint/`
- 🟡 **In progress** — image sourced, hotspots not yet finished/verified
- ⚪ **Needs image** — prompt is ready (or listed below), waiting on a generated PNG
- 🧊 **3D fallback available** — a `.glb` already exists in `apps/student/public/anatomy/`, so Path B (Blender render) can produce this one fast if Path A stalls
- ⛔ **Skip / not diagram-shaped** — topic doesn't reduce to a labelled static image (process/cycle diagrams, punnett squares, graphs — better served by other block types, not Label Sprint)

_Last updated: 2026-07-15_

> **Batch 3 (2026-07-15) gotcha — floating dots are common on ring/layered structures.**
> On this batch's root and stem cross-sections (concentric-ring anatomy), several
> hand-drafted hotspots landed in the wrong ring (e.g. endodermis dot sitting in the
> cortex just outside the ring, pericycle dot overshooting into the stele) or off the
> subject entirely (epidermis dot floating above the circle in the transparent margin,
> a limb dot floating in background instead of on the limb). All were caught by the
> `verify_hotspots.py` overlay and fixed by direct pixel sampling (checking RGBA values
> at candidate coordinates) rather than re-eyeballing — worth doing for any future
> concentric-ring diagram (root/stem/vascular bundle T.S., cell wall layers, etc.).

> **Toolkit gotcha found 2026-07-15 (second one today):** a whole batch of 9 ChatGPT
> generations (animal cell, ear, chloroplast, alveolus, nucleus, DNA, HIV, endocrine map,
> male reproductive system) ignored the "solid deep-charcoal background #121316" prompt
> instruction and exported on an **opaque white background** — even though the *live*
> ChatGPT UI preview looked dark during generation, the downloaded PNG was flattened onto
> white. `prepare_illustration.py` couldn't key these with its default near-black
> threshold (it would key nothing — bounding-box = whole canvas, alpha stayed ~255
> everywhere). Fixed by adding a `mode` arg: `python3 prepare_illustration.py <in> <out>
> 820 235 white` keys near-white to transparent instead. **Always eyeball the raw
> downloaded PNG's background before running the script** — don't trust what the chat UI
> showed live.

---

## Progress snapshot

| Status | Count |
|---|---|
| ✅ Done | 35 |
| ⚪ Needs image | ~11 |
| 🧊 Has 3D model (fallback ready) | 5 |
| ⛔ Skip | ~10 |

**Done so far:** Heart (cross-section), Motor neuron, Nephron, Digestive system, Plant cell,
Human brain (mid-sagittal), Human eye (horizontal section), Respiratory system, Flower
(longitudinal section), Animal cell, Human ear, Chloroplast, Alveolus, Nucleus, DNA double
helix, HIV/retrovirus, Endocrine glands (whole-body map), Human male reproductive system,
Human skeleton, Human excretory system (gross), Frog (external, dorsal), Root (T.S.),
Sarcomere, Cell membrane (fluid mosaic), Stem (T.S.), Bacteriophage (T-phage), Antibody
(immunoglobulin), Chromosome, Human female reproductive system, Golgi apparatus,
Endoplasmic reticulum (rough + smooth), Anther (T.S.), Ovule (megasporangium), Pollen grain,
Human sperm, Graafian follicle (with ovum).

---

## Class 11

### Unit 2 — Structural Organisation in Animals and Plants
| Diagram | Status | Notes |
|---|---|---|
| Flower — longitudinal section | ✅ Done | `flower.block.json` |
| Root — T.S. (dicot) | ✅ Done | `root.block.json` |
| Stem — T.S. (dicot) | ✅ Done | `stem.block.json` |
| Leaf — T.S. (dorsiventral) | ⚪ | stomata + mesophyll layers |
| Seed — dicot (structure) | ⚪ | |
| Seed — monocot (structure) | ⚪ | |
| Inflorescence types (raceme/cyme/umbel) | ⛔ | comparison chart, not a single labelled diagram |
| Cockroach — external features + digestive system | ⚪ | zoology spotter, lower priority |
| Frog — external features (dorsal) | ✅ Done | `frog.block.json` |
| Earthworm — external/internal | ⚪ | lower priority (rarely heavily tested vs human physiology) |

### Unit 3 — Cell Structure and Function
| Diagram | Status | Notes |
|---|---|---|
| Plant cell | ✅ Done | `plant-cell.block.json` |
| Animal cell | ✅ Done | `animal-cell.block.json` |
| Mitochondria — internal structure | 🧊 | `mitochondria-v1.glb` exists |
| Chloroplast — internal structure | ✅ Done | `chloroplast.block.json` |
| Golgi apparatus | ✅ Done | `golgi.block.json` |
| Endoplasmic reticulum (RER/SER) | ✅ Done | `er.block.json` — combined RER + SER in one plate |
| Nucleus — internal structure | ✅ Done | `nucleus.block.json` |
| Lysosome | 🧊 | `lysosome-v1.glb` exists |
| Cell membrane — fluid mosaic model | ✅ Done | `cell-membrane.block.json` |
| Prokaryotic cell (bacterium) | ⚪ | |
| Mitosis / Meiosis stages | ⛔ | sequential-stage diagram, not single-image hotspots — better as a stepper/sequence block |

### Unit 4 — Plant Physiology
| Diagram | Status | Notes |
|---|---|---|
| Stomatal apparatus (guard cells) | ⚪ | pairs with transpiration |
| Root hair + xylem/phloem pathway (T.S. of root+stem) | ⚪ | could reuse the stem/root T.S. above |
| Photosynthesis — chloroplast + light/dark reaction sites | ⛔ | mostly a process-flow diagram, not label-a-structure |
| Nitrogenase / root nodule cross-section | ⚪ | pairs with Mineral Nutrition |

### Unit 5 — Human Physiology
| Diagram | Status | Notes |
|---|---|---|
| Digestive system (full alimentary canal + glands) | ✅ Done | `digestive-system.block.json` |
| Liver — gross structure | ⚪ | often folded into digestive system, could be a zoom-in round |
| Human respiratory system | ✅ Done | `respiratory-system.block.json` |
| Alveolus — structure (gas exchange) | ✅ Done | `alveolus.block.json` |
| Human heart — internal structure (cross-section) | ✅ Done | `heart_illus.webp` — no `.block.json` was ever written, see Pending Tasks below |
| Blood — components (cell types) | ⛔ | comparison plate, not a spatial diagram |
| Human excretory system (kidney + ureter + bladder, gross) | ✅ Done | `excretory.block.json` — separate from the nephron zoom-in |
| Nephron — structure | ✅ Done | `nephron.block.json` |
| Human skeleton (major bones) | ✅ Done | `skeleton.block.json` |
| Types of joints | ⛔ | comparison plate |
| Sarcomere / muscle structure | ✅ Done | `sarcomere.block.json` |
| Neuron — structure | ✅ Done | `motor-neuron.block.json` |
| Human brain (mid-sagittal) | ✅ Done | `brain.block.json` |
| Reflex arc | ⛔ | pathway/flow diagram, not a static labelled structure |
| Human eye (horizontal section) | ✅ Done | `eye.block.json` |
| Human ear (structure) | ✅ Done | `ear.block.json` |
| Endocrine glands — location map (whole body) | ✅ Done | `endocrine.block.json` |
| Adrenal gland — internal (cortex/medulla) | ⚪ | lower priority zoom-in |
| Thyroid/parathyroid — gross location | ⚪ | can fold into the endocrine location map above |

---

## Class 12

### Unit 6 — Reproduction
| Diagram | Status | Notes |
|---|---|---|
| Anther — T.S. (microsporangium) | ✅ Done | `anther.block.json` |
| Ovule — structure (megasporangium) | ✅ Done | `ovule.block.json` |
| Pollen grain — structure | ✅ Done | `pollen.block.json` |
| Human male reproductive system | ✅ Done | `male-repro.block.json` — generated via a rephrased clinical prompt after the original wording was silently content-policy-blocked twice |
| Human female reproductive system | ✅ Done | `female-repro.block.json` — image founder-generated 2026-07-15 after automated attempts were content-policy-blocked twice |
| Sperm — structure | ✅ Done | `sperm.block.json` |
| Human ovum / Graafian follicle | ✅ Done | `follicle.block.json` |
| Menstrual cycle — hormone graph | ⛔ | line graph, not a spatial diagram |
| Human embryo — early cleavage/implantation stages | ⛔ | sequence diagram |

### Unit 7 — Genetics and Evolution
| Diagram | Status | Notes |
|---|---|---|
| DNA — double helix structure | ✅ Done | `dna.block.json` |
| Chromosome — structure (centromere, telomere, arms) | ✅ Done | `chromosome.block.json` |
| Nucleosome / packaging of DNA | ⛔ | conceptual, low diagram value |
| Replication fork | ⛔ | process diagram |
| Transcription / translation | ⛔ | process diagram |
| Human karyotype | ⛔ | classification chart, not hotspot-shaped |
| Phylogenetic tree (evolution of horse, human) | ⛔ | branching diagram, different block type |

### Unit 8 — Biology and Human Welfare
| Diagram | Status | Notes |
|---|---|---|
| Plasmodium life cycle | ⛔ | cycle diagram |
| HIV / retrovirus — structure | ✅ Done | `hiv.block.json` |
| Antibody (immunoglobulin) — structure | ✅ Done | `antibody.block.json` |
| Lymphoid organs — location (thymus, spleen, lymph nodes) | 🧊 | `lymphoid-v1.glb` exists |
| Bacteriophage (T-phage) — structure | ✅ Done | `bacteriophage.block.json` |

### Unit 9 — Biotechnology
| Diagram | Status | Notes |
|---|---|---|
| Plasmid vector (pBR322) — map | ⛔ | circular map with restriction sites, more a map/legend than hotspot recall |
| PCR cycle | ⛔ | process diagram |
| Recombinant DNA technology steps | ⛔ | process diagram |

### Unit 10 — Ecology
| Diagram | Status | Notes |
|---|---|---|
| Ecological pyramid (energy/number/biomass) | ⛔ | chart, not spatial |
| Food chain / food web | ⛔ | network diagram, different block type |
| Nitrogen cycle / Carbon cycle | ⛔ | process diagram |

---

## Recommended build order (next up)

Three batches shipped on 2026-07-15: batch of 10 (9 shipped + 1 founder-generated), batch 3
of 11 (skeleton, excretory, frog, root, sarcomere, cell-membrane, stem, bacteriophage,
antibody, chromosome, female-repro), and batch 4 of 7 (golgi, er, anther, ovule, pollen,
sperm, follicle) — 35 organs shipped total. Picking the next highest syllabus-weight,
clearly-diagram-shaped, still-missing organs:

1. **Leaf — T.S. (dorsiventral)** — Unit 2, stomata + mesophyll layers, high syllabus weight
2. **Seed — dicot (structure)** — Unit 2
3. **Seed — monocot (structure)** — Unit 2, pairs with dicot seed
4. **Stomatal apparatus (guard cells)** — Unit 4, pairs with transpiration
5. **Prokaryotic cell (bacterium)** — Unit 3
6. **Liver — gross structure** — Unit 5, zoom-in off the digestive system round
7. **Adrenal gland — internal (cortex/medulla)** — lower-priority endocrine zoom-in
8. **Thyroid/parathyroid — gross location** — can fold into the endocrine location map
9. **Lymphoid organs — location** — glb exists (`lymphoid-v1.glb`) as Path B fallback

## Resolved items
- `heart.block.json` was missing despite the heart image/hotspots being done — written
  2026-07-15, closed.
- Human female reproductive system — founder hand-generated the image on 2026-07-15 after
  two silent content-policy blocks on the automated path; hotspots authored and verified,
  `female-repro.block.json` shipped.
- Batch 4 (golgi, ER, anther, ovule, pollen, sperm, follicle) — all 7 generated via ChatGPT
  (had to abandon a stalled sperm generation once and retry in a fresh chat), processed,
  hotspots authored and pixel-verified. Anther's tapetum hotspot and follicle's zona
  pellucida hotspot both needed pixel-sampled fixes (landed one ring/layer off on first
  pass) — same concentric-ring gotcha as batch 3's root/stem, now a recurring pattern for
  any layered cross-section diagram.
