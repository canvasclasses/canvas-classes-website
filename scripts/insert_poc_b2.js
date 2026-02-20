const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');

const CHAPTER_ID = 'ch11_prac_org';

function mkSCQ(id, diff, text, opts, cid, sol, tag) {
  return {
    _id: uuidv4(), display_id: id, type: 'SCQ',
    question_text: { markdown: text, latex_validated: false },
    options: [
      { id: 'a', text: opts[0], is_correct: cid === 'a' },
      { id: 'b', text: opts[1], is_correct: cid === 'b' },
      { id: 'c', text: opts[2], is_correct: cid === 'c' },
      { id: 'd', text: opts[3], is_correct: cid === 'd' },
    ],
    answer: { correct_option: cid },
    solution: { text_markdown: sol, latex_validated: false },
    metadata: {
      difficulty: diff, chapter_id: CHAPTER_ID,
      tags: [{ tag_id: tag, weight: 1.0 }],
      exam_source: 'JEE Main', is_pyq: true, is_top_pyq: false,
    },
    status: 'published', version: 1, quality_score: 90,
    needs_review: false, created_by: 'admin', updated_by: 'admin',
    created_at: new Date(), updated_at: new Date(), deleted_at: null,
  };
}

const questions = [

// Q67 — Most efficient method for large scale separation of phenol nitration products; Ans: (3) Fractional Crystallisation
mkSCQ('POC-011', 'Medium',
`Phenol on reaction with dilute nitric acid, gives two products. Which method will be most efficient for large scale separation?`,
[
  'Chromatographic separation',
  'Steam distillation',
  'Fractional Crystallisation',
  'Sublimation',
],
'c',
`**Reaction of phenol with dilute HNO₃:**

Phenol + dilute HNO₃ → **ortho-nitrophenol** + **para-nitrophenol**

**Properties of the two products:**

| Product | BP/MP | Steam volatile? | Solubility |
|---|---|---|---|
| o-Nitrophenol | BP 214°C, MP 45°C | **Yes** (intramolecular H-bond) | Less soluble in water |
| p-Nitrophenol | MP 114°C | No (intermolecular H-bond) | More soluble in water |

**Separation methods:**

- **Steam distillation:** Can separate o-nitrophenol (steam volatile) from p-nitrophenol (not steam volatile) — works but not most efficient at large scale
- **Fractional Crystallisation:** Based on different solubilities in a solvent — most efficient for **large scale** separation of solid isomers

For large-scale industrial separation, **fractional crystallisation** is most efficient as it can handle large quantities.

**Final Answer: Option (3) — Fractional Crystallisation**`,
'tag_poc_1'),

// Q68 — Technique NOT used to spot components on TLC; Ans: (3) Visualisation agent as component of mobile phase
mkSCQ('POC-012', 'Medium',
`Which one of the following techniques is not used to spot components of a mixture separated on thin layer chromatographic plate?`,
[
  '$ \\mathrm{I_2} $ (Solid)',
  'U.V. Light',
  'Visualisation agent as a component of mobile phase',
  'Spraying of an appropriate reagent',
],
'c',
`**Methods used to visualize spots on TLC plates:**

| Method | How it works |
|---|---|
| **(1) I₂ (solid)** | Iodine vapour adsorbs on organic compounds → brown spots ✓ |
| **(2) U.V. Light** | Fluorescent TLC plates glow under UV; compounds quench fluorescence ✓ |
| **(3) Visualisation agent in mobile phase** | **NOT used** — adding a visualisation agent to the mobile phase would interfere with the separation itself ✗ |
| **(4) Spraying reagent** | e.g., ninhydrin for amino acids, KMnO₄ for oxidizable compounds ✓ |

**The visualisation agent must be applied AFTER the separation, not as part of the mobile phase.** Adding it to the mobile phase would change the polarity of the eluent and affect $ \\mathrm{R_f} $ values.

**Final Answer: Option (3)**`,
'tag_poc_1'),

// Q69 — Purification of high boiling organic liquid that decomposes near BP; Ans: (4) Reduced pressure distillation
mkSCQ('POC-013', 'Easy',
`Which purification technique is used for high boiling organic liquid compound (decomposes near its boiling point)?`,
[
  'Simple distillation',
  'Steam distillation',
  'Fractional distillation',
  'Reduced pressure distillation',
],
'd',
`**Distillation under reduced pressure (vacuum distillation):**

When a compound has a **high boiling point** and **decomposes near its boiling point**, the boiling point can be lowered by reducing the pressure. At lower pressure, the compound boils at a lower temperature without decomposing.

**Principle:** Boiling point decreases with decrease in pressure ($ \\mathrm{BP \\propto P} $).

**Examples:**
- Glycerol (decomposes at normal BP ~290°C) → distilled under reduced pressure
- High molecular weight compounds, vitamins, hormones

**Other methods:**
- Simple distillation: for compounds with BP difference > 25°C (no decomposition issue)
- Steam distillation: for steam-volatile, water-immiscible compounds
- Fractional distillation: for mixtures of liquids with close boiling points

**Final Answer: Option (4) — Reduced pressure distillation**`,
'tag_poc_1'),

// Q70 — Purification in chromatography independent of; Ans: (4) Physical state of pure compound
mkSCQ('POC-014', 'Medium',
`In chromatography technique, the purification of a compound is independent of:`,
[
  'Mobility or flow of solvent system',
  'Solubility of the compound',
  'Length of the column or TLC Plate',
  'Physical state of the pure compound',
],
'd',
`**Factors that affect chromatographic separation:**

| Factor | Affects separation? |
|---|---|
| (1) Mobility/flow of solvent | Yes — faster flow = less separation time, affects resolution |
| (2) Solubility of compound | Yes — determines how compound partitions between stationary and mobile phase |
| (3) Length of column/TLC plate | Yes — longer column = better separation (more theoretical plates) |
| **(4) Physical state of pure compound** | **No** — whether the pure compound is solid, liquid, or gas does NOT affect the chromatographic separation process |

The chromatographic separation depends on the interaction of the compound with the stationary and mobile phases, not on the physical state of the isolated pure compound.

**Final Answer: Option (4) — Physical state of the pure compound**`,
'tag_poc_1'),

// Q71 — Statements about Rf; Ans: (1) Statement I true, Statement II false
mkSCQ('POC-015', 'Medium',
`Given below are two statements:\n**Statement-I:** Retardation factor ($ \\mathrm{R_f} $) can be measured in meter/centimetre.\n**Statement-II:** $ \\mathrm{R_f} $ value of a compound remains constant in all solvents.\n\nChoose the most appropriate answer from the options given below:`,
[
  'Statement-I is true but statement-II is false',
  'Both statement-I and statement-II are true',
  'Both statement-I and statement-II are false',
  'Statement-I is false but statement-II is true',
],
'a',
`**Evaluating Statement-I:**

$$\\mathrm{R_f} = \\frac{\\text{Distance travelled by substance (cm)}}{\\text{Distance travelled by solvent (cm)}}$$

Both numerator and denominator are in the same units (cm or m), so $ \\mathrm{R_f} $ is a **dimensionless ratio** (no units). However, the distances themselves are measured in cm or m.

**Statement-I says "Rf can be measured in meter/centimetre"** — this is technically TRUE in the sense that the distances used to calculate Rf are measured in these units. The ratio itself is dimensionless, but the measurement involves cm/cm.

**Statement-I is TRUE** ✓

**Evaluating Statement-II:**

$ \\mathrm{R_f} $ value of a compound **changes with different solvents** (mobile phases). The $ \\mathrm{R_f} $ depends on:
- The polarity of the solvent (mobile phase)
- The nature of the stationary phase
- Temperature

**Statement-II is FALSE** ✗ ($ \\mathrm{R_f} $ is NOT constant in all solvents)

**Final Answer: Option (1) — Statement-I is true but Statement-II is false**`,
'tag_poc_1'),

// Q72 — Glycerol separated in soap industries by; Ans: (4) Distillation under reduced pressure
mkSCQ('POC-016', 'Easy',
`Glycerol is separated in soap industries by:`,
[
  'Fractional distillation',
  'Differential distillation',
  'Steam distillation',
  'Distillation under reduced pressure',
],
'd',
`**Glycerol (propane-1,2,3-triol):**

- Boiling point: ~290°C at atmospheric pressure
- At this temperature, glycerol **decomposes** (charring occurs)
- Glycerol is **not steam volatile** (highly water-soluble, forms H-bonds with water)

**Purification method:**

**Distillation under reduced pressure (vacuum distillation)** is used because:
- Lowering pressure reduces the boiling point significantly
- Glycerol can be distilled at ~150°C under reduced pressure without decomposition

In soap manufacturing, glycerol is a by-product of saponification. It is separated from the spent lye (aqueous solution) by vacuum distillation.

**Final Answer: Option (4) — Distillation under reduced pressure**`,
'tag_poc_1'),

// Q73 — Principle of column chromatography; Ans: (1) Differential adsorption on solid phase
mkSCQ('POC-017', 'Easy',
`The principle of column chromatography is:`,
[
  'Differential adsorption of the substances on the solid phase.',
  'Differential absorption of the substances on the solid phase.',
  'Gravitational force.',
  'Capillary action',
],
'a',
`**Column chromatography:**

The stationary phase in column chromatography is a **solid** (silica gel, alumina) packed in a column.

**Principle: Differential adsorption**

Different components of the mixture adsorb to different extents on the solid stationary phase:
- More polar compounds → stronger adsorption → move slower → elute later
- Less polar compounds → weaker adsorption → move faster → elute first

**Note:** "Adsorption" (surface phenomenon) vs "Absorption" (bulk phenomenon):
- Column chromatography uses **adsorption** (components stick to surface of silica/alumina)
- Paper chromatography uses **partition** (distribution between water in paper and mobile phase)

**Gravitational force** helps the mobile phase flow down the column, but it is NOT the principle of separation.

**Final Answer: Option (1) — Differential adsorption of the substances on the solid phase**`,
'tag_poc_1'),

// Q74 — Nitrogen compound not giving Lassaigne's test; Ans: (4) Hydrazine
mkSCQ('POC-018', 'Hard',
`Which of the following nitrogen containing compound does not give Lassaigne's test?`,
[
  'Urea',
  'Phenyl hydrazine',
  'Glycine',
  'Hydrazine',
],
'd',
`**Lassaigne's test (sodium fusion test):**

In Lassaigne's test, the organic compound is fused with sodium metal to convert covalently bonded N, S, halogens into ionic forms (NaCN, Na₂S, NaX). These are then detected in the sodium fusion extract.

**For nitrogen detection:** NaCN is formed → detected with FeSO₄ and FeCl₃ (Prussian blue).

**Evaluating each compound:**

| Compound | Contains N? | Gives Lassaigne's test? |
|---|---|---|
| Urea ($ \\mathrm{NH_2CONH_2} $) | Yes (N–C bond) | Yes ✓ |
| Phenyl hydrazine ($ \\mathrm{C_6H_5NHNH_2} $) | Yes (N–C bond) | Yes ✓ |
| Glycine ($ \\mathrm{H_2NCH_2COOH} $) | Yes (N–C bond) | Yes ✓ |
| **Hydrazine ($ \\mathrm{N_2H_4} $)** | Yes, but **no C–N bond** | **No** ✗ |

**Hydrazine** ($ \\mathrm{H_2N-NH_2} $) is an **inorganic compound** — it has no carbon. Lassaigne's test is for **organic** compounds. The test converts organic N (C–N bonds) to NaCN. Hydrazine has no carbon, so no NaCN is formed.

**Final Answer: Option (4) — Hydrazine**`,
'tag_poc_2'),

// Q75 — Lassaigne's test used for detection of; Ans: (4) Nitrogen, Sulphur, and halogens
mkSCQ('POC-019', 'Easy',
`Lassaigne's test is used for detection of:`,
[
  'Nitrogen and Sulphur only',
  'Nitrogen, Sulphur and Phosphorous Only',
  'Phosphorous and halogens only',
  'Nitrogen, Sulphur, and halogens',
],
'd',
`**Lassaigne's test (Sodium Fusion Test):**

The organic compound is fused with sodium metal, converting heteroatoms into ionic compounds:

| Element | Product formed | Detection |
|---|---|---|
| **Nitrogen** | NaCN | Prussian blue with FeSO₄/FeCl₃ |
| **Sulphur** | Na₂S | Purple with sodium nitroprusside |
| **Halogens** | NaX (NaCl, NaBr, NaI) | White/pale yellow precipitate with AgNO₃ |

**Phosphorus** is NOT detected by Lassaigne's test. Phosphorus is detected by a separate test (heating with oxidizing agent → phosphoric acid → yellow precipitate with ammonium molybdate).

**Lassaigne's test detects: N, S, and Halogens (Cl, Br, I)**

**Final Answer: Option (4) — Nitrogen, Sulphur, and halogens**`,
'tag_poc_2'),

// Q76 — Formula of purple colour in Lassaigne's test for sulphur; Ans: (1) Na₄[Fe(CN)₅(NOS)]
mkSCQ('POC-020', 'Hard',
`The formula of the purple colour formed in Lassaigne's test for sulphur using sodium nitroprusside is`,
[
  '$ \\mathrm{Na_4[Fe(CN)_5(NOS)]} $',
  '$ \\mathrm{NaFe[Fe(CN)_6]} $',
  '$ \\mathrm{Na[Cr(NH_3)_2(NCS)_4]} $',
  '$ \\mathrm{Na_2[Fe(CN)_5(NO)]} $',
],
'a',
`**Lassaigne's test for Sulphur:**

**Step 1:** Organic compound fused with Na → $ \\mathrm{Na_2S} $ formed

**Step 2:** Sodium fusion extract + sodium nitroprusside ($ \\mathrm{Na_2[Fe(CN)_5NO]} $)

**Reaction:**
$$\\mathrm{Na_2S + Na_2[Fe(CN)_5NO] \\to Na_4[Fe(CN)_5NOS]}$$

The S²⁻ ion replaces the NO group partially → forms the purple-coloured complex **$ \\mathrm{Na_4[Fe(CN)_5(NOS)]} $**

**Note:**
- Option (2) $ \\mathrm{NaFe[Fe(CN)_6]} $ = Prussian blue (for nitrogen test)
- Option (4) $ \\mathrm{Na_2[Fe(CN)_5(NO)]} $ = sodium nitroprusside itself (the reagent, not the product)

**Final Answer: Option (1) — $ \\mathrm{Na_4[Fe(CN)_5(NOS)]} $**`,
'tag_poc_2'),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
