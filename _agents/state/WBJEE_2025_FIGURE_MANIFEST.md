# WBJEE 2025 — Figure Upload Manifest

**Purpose.** The single record of every WBJEE 2025 question that needs a diagram the founder will draw. When the founder hands over a folder of images, this maps each **paper question number** → the exact **`display_id`** in `questions_v2`, so figures land on the right question with no gap.

## How this works (founder ↔ agent contract)

1. **Founder draws** the diagrams and drops them in one folder.
2. **File-naming convention (IMPORTANT — prevents mis-mapping):** name each image by **subject + zero-padded paper question number**, e.g.
   - `PHY-04.png` = Physics paper Q4
   - `CHEM-12.png` = Chemistry paper Q12
   - `MATH-..` = (none — Maths has no figures)
   - For **option-image** questions (the four choices are themselves pictures), use `PHY-04-opts.png` (a single image showing all of A–D) or `PHY-04-a.png … -d.png`.
3. **Agent uploads** each image to its question using the `display_id` in the table below (R2 upload → Asset doc → embed in the question's `question_text.markdown`, or into the relevant option). The paper-Q#→display_id mapping here is the source of truth.

> The founder marks images by **paper question number per subject** (Physics 1–40, Chemistry 1–40). The `display_id` is chapter-based and is NOT the paper number — always resolve through this table.

## Status legend
`PENDING` = question ingested, figure awaited · `UPLOADED` = figure embedded · `OPTION-IMG` = the answer options are images (stem inserted with placeholder option labels).

---

## Mathematics — NO FIGURES
All 75 maths questions are pure text / LaTeX (equations, matrices, determinants rendered inline). **Nothing to draw.** ✅

---

## Physics (paper Q1–40)

| Paper Q# | display_id | Chapter | Figure location | What it shows | Status |
|---|---|---|---|---|---|
| **2** | `MIP-095` | ph11_math_phy | stem | Six labelled vectors a–f (magnitudes & directions) | PENDING — REQUIRED |
| **4** | `K1D-142` | ph11_kinematics1d | stem + options | a–t graph (stem) **and** the four v–t graphs are the options A–D | PENDING — REQUIRED · OPTION-IMG |
| **7** | `WEP-132` | ph11_wep | stem | v–t graph: 50 m/s at t=0 falling linearly to 0 at t=10 s | PENDING — REQUIRED |
| 8 | `COM-136` | ph11_com_mom | stem | Cylindrical rod, length L, area α, x=0 marked (illustrative) | PENDING — optional (text self-contained) |
| 10 | `SOLD-091` | ph11_solids | stem | Elevator box, 10 kg load, a=2 m/s² arrow (illustrative) | PENDING — optional (text self-contained) |
| 11 | `FLUI-178` | ph11_fluids | stem | Granite floating at mercury–water interface in a beaker (illustrative) | PENDING — optional (text self-contained) |
| **12** | `FLUI-179` | ph11_fluids | stem | U-tube with three liquid columns ρ₁/ρ₂/ρ₃ + their heights | PENDING — REQUIRED |
| **14** | `THPR-131` | ph11_thermal_props | options | The four rate-of-cooling R vs θ curves (options A–D) | PENDING — REQUIRED · OPTION-IMG |
| **15** | `TDYN-185` | ph11_thermo | stem + options | P–T diagram of cycle ABCA (stem) + four P–V plots (options A–D) | PENDING — REQUIRED · OPTION-IMG |
| **20** | `ELST-257` | ph12_electrostatics | stem | Charges +q(A), −q(B), midpoint C, point D; semicircle CSD + line CBD, L spacings | PENDING — REQUIRED |
| **21** | `CAPC-195` | ph12_capacitance | stem | Circuit: 1kΩ/2kΩ/4kΩ/4kΩ resistors, 1µF & 2µF caps, 6V cell | PENDING — REQUIRED |
| **25** | `ROPY-259` | ph12_ray_optics | stem | δ-vs-i prism graph (δ_min=30°, i from 15° to 60°) | PENDING — REQUIRED |
| **32** | `NUCL-125` | ph12_nuclei | stem + options | N–t decay curve (stem) + four N-vs-activity graphs (options A–D) | PENDING — REQUIRED · OPTION-IMG |
| **33** | `SEMI-001` | ph12_semiconductors | stem | Zener regulator circuit: Vin=10V, series Rs, zener Z, meters | PENDING — REQUIRED |
| **34** | `SEMI-002` | ph12_semiconductors | stem | Logic-gate combination (inputs A,B → NOT/NOR gates → output Y) | PENDING — REQUIRED |
| **35** | `SEMI-003` | ph12_semiconductors | stem + options | Diode∥resistance circuit (stem) + four I–V characteristics (options A–D) | PENDING — REQUIRED · OPTION-IMG |
| _Q36–40_ | — | — | — | (no figures — Q36–40 are text/equation only) | n/a |

**Physics figure count: 13 required (Q2, 4, 7, 12, 14, 15, 20, 21, 25, 32, 33, 34, 35) + 3 optional (Q8, 10, 11).** Of the 13 required, 5 are OPTION-IMG where the options themselves are graphs (Q4, 14, 15, 32, 35).

---

## Chemistry (paper Q1–40)

| Paper Q# | display_id | Chapter | Figure location | What it shows | Status |
|---|---|---|---|---|---|
| **16** | `HC-350` | ch11_hydrocarbon | options | Four ring hydrocarbon structures (options A–D) | PENDING — REQUIRED · OPTION-IMG |
| **17** | `AMIN-286` | ch12_amines | options | Four bromination-product structures of benzanilide (A–D) | PENDING — REQUIRED · OPTION-IMG |
| **18** | `HC-351` | ch11_hydrocarbon | options | Four C₈H₁₆ alkene structures (A–D) | PENDING — REQUIRED · OPTION-IMG |
| **30** | `HALO-218` | ch12_haloalkanes | stem | Structures of chloroarenes I–IV (substituents define the order) | PENDING — REQUIRED |
| **31** | `ALDO-386` | ch12_carbonyl | options | Four product structures (THF / open-chain) of the Grignard reaction (A–D) | PENDING — REQUIRED · OPTION-IMG |
| **32** | `HALO-219` | ch12_haloalkanes | options | Four allylic/vinylic bromide structures (A–D) | PENDING — REQUIRED · OPTION-IMG |
| **33** | `ALCO-242` | ch12_alcohols | options | Four (P, Q) product-pair structures — cumene/phenol route (A–D) | PENDING — REQUIRED · OPTION-IMG |
| **34** | `GOC-794` | ch11_goc | options | Structures for options A, C, D (B = acetone, already text) | PENDING — REQUIRED · OPTION-IMG |
| **35** | `ALCO-243` | ch12_alcohols | options | Four hydroxy-ketone structures (A–D) | PENDING — REQUIRED · OPTION-IMG |
| **36** | `GOC-795` | ch11_goc | stem | Structures of the four acids I–IV | PENDING — REQUIRED |
| **38** | `GOC-796` | ch11_goc | options | Four stereochemical (Fischer/3D) structures (A–D) | PENDING — REQUIRED · OPTION-IMG |

**Chemistry figure count: 11 required (Q16, 17, 18, 30, 31, 32, 33, 34, 35, 36, 38); of these 9 are OPTION-IMG (Q16,17,18,31,32,33,34,35,38).** Q15 needed no figure (structures transcribed as text formulae). Q19 & Q24 were skipped (orphan topics — see `WBJEE_2025_SKIPPED.md`).

> **⚑ Verify (not a figure issue):** `CORD-380` (paper Q28) — the compiled-PDF key marks option (b), but the chemistry points to option (a) (P = the cyanide complex). Stored per the key; confirm and correct in admin if needed.
