const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');

const CHAPTER_ID = 'ch12_pblock';
function src(year, month, day, shift) { return { exam_name: 'JEE Main', year, month, day, shift }; }

function mkSCQ(id, diff, text, opts, correctId, solution, tag, examSrc) {
  return {
    _id: uuidv4(), display_id: id, type: 'SCQ',
    question_text: { markdown: text, latex_validated: false },
    options: [
      { id: 'a', text: opts[0], is_correct: correctId === 'a' },
      { id: 'b', text: opts[1], is_correct: correctId === 'b' },
      { id: 'c', text: opts[2], is_correct: correctId === 'c' },
      { id: 'd', text: opts[3], is_correct: correctId === 'd' }
    ],
    answer: { correct_option: correctId },
    solution: { text_markdown: solution, latex_validated: false },
    metadata: { difficulty: diff, chapter_id: CHAPTER_ID, tags: [{ tag_id: tag, weight: 1.0 }], exam_source: examSrc, is_pyq: true, is_top_pyq: false },
    status: 'published', version: 1, quality_score: 85, needs_review: false,
    created_by: 'ai_agent', updated_by: 'ai_agent', created_at: new Date(), updated_at: new Date(), deleted_at: null
  };
}

const questions = [

// Q21 — Match catalysts with products (V2O5, TiCl4, PdCl2, Fe oxide); Answer: (2) A-R, B-S, C-P, D-Q (wait, answer key = (2))
mkSCQ('PB12-021', 'Medium',
`Match the catalysts (Column I) with products (Column II)

| | Column I (Catalyst) | | Column II (Product) |
|---|---|---|---|
| A. | $\\mathrm{V_2O_5}$ | P. | Polyethylene |
| B. | $\\mathrm{TiCl_4/Al(Me)_3}$ | Q. | Ethanal |
| C. | $\\mathrm{PdCl_2}$ | R. | $\\mathrm{H_2SO_4}$ |
| D. | Iron Oxide | S. | $\\mathrm{NH_3}$ |`,
[
  '(A)-(S); (B)-(R); (C)-(Q); (D)-(P)',
  '(A)-(R); (B)-(S); (C)-(P); (D)-(Q)',
  '(A)-(Q); (B)-(R); (C)-(P); (D)-(S)',
  '(A)-(R); (B)-(P); (C)-(Q); (D)-(S)'
],
'd',
`**Catalyst-product matching:**

- **$\\mathrm{V_2O_5}$:** Used in Contact process → $\\mathrm{SO_3}$ → $\\mathrm{H_2SO_4}$ (A-R)
- **$\\mathrm{TiCl_4/Al(Me)_3}$ (Ziegler-Natta catalyst):** Used for polymerization of ethylene → **Polyethylene** (B-P)
- **$\\mathrm{PdCl_2}$ (Wacker process):** $\\mathrm{CH_2=CH_2 + O_2 \\xrightarrow{PdCl_2} CH_3CHO}$ → **Ethanal** (C-Q)
- **Iron oxide:** Used in Haber process → $\\mathrm{NH_3}$ (D-S)

**Answer: Option (4) — (A)-(R), (B)-(P), (C)-(Q), (D)-(S)**`,
'tag_pblock12_3', src(2019, 'Apr', 9, 'Morning')),

// Q22 — Element not showing variable oxidation state; Answer: (4) Fluorine
mkSCQ('PB12-022', 'Easy',
`Element not showing variable oxidation state is:`,
[
  'Bromine',
  'Iodine',
  'Chlorine',
  'Fluorine'
],
'd',
`**Variable oxidation states of halogens:**

- **Cl:** −1, 0, +1, +3, +5, +7 (multiple states)
- **Br:** −1, 0, +1, +3, +5, +7 (multiple states)
- **I:** −1, 0, +1, +3, +5, +7 (multiple states)
- **F:** Only **−1 and 0** — Fluorine is the most electronegative element and cannot exhibit positive oxidation states. It has no d-orbitals and cannot expand its octet.

**Answer: Option (4) — Fluorine**`,
'tag_pblock12_7', src(2024, 'Jan', 27, 'Morning')),

// Q23 — Elemental form NOT present in enamel of teeth; Answer: (2) P^3+
mkSCQ('PB12-023', 'Medium',
`Which one of the following elemental forms is not present in the enamel of the teeth?`,
[
  '$\\mathrm{Ca^{2+}}$',
  '$\\mathrm{P^{3+}}$',
  '$\\mathrm{F^{-}}$',
  '$\\mathrm{P^{5+}}$'
],
'b',
`Tooth enamel is primarily composed of **hydroxyapatite** $\\mathrm{Ca_{10}(PO_4)_6(OH)_2}$ and **fluorapatite** $\\mathrm{Ca_{10}(PO_4)_6F_2}$.

Components present:
- $\\mathrm{Ca^{2+}}$ ✓ (calcium ions)
- $\\mathrm{P^{5+}}$ ✓ (phosphorus in phosphate $\\mathrm{PO_4^{3-}}$, oxidation state = +5)
- $\\mathrm{F^{-}}$ ✓ (fluoride ions in fluorapatite)

**$\\mathrm{P^{3+}}$** is NOT present in tooth enamel. Phosphorus in enamel exists as $\\mathrm{PO_4^{3-}}$ where P is in +5 state, not +3.

**Answer: Option (2) — $\\mathrm{P^{3+}}$**`,
'tag_pblock12_2', src(2022, 'Jun', 24, 'Morning')),

// Q24 — Correct order of bond dissociation enthalpy of halogens; Answer: (2) Cl2 > F2 > Br2 > I2
mkSCQ('PB12-024', 'Easy',
`The correct order of bond dissociation enthalpy of halogens is:`,
[
  '$\\mathrm{F_2 > Cl_2 > Br_2 > I_2}$',
  '$\\mathrm{Cl_2 > F_2 > Br_2 > I_2}$',
  '$\\mathrm{I_2 > Br_2 > Cl_2 > F_2}$',
  '$\\mathrm{Cl_2 > Br_2 > F_2 > I_2}$'
],
'b',
`Bond dissociation enthalpies of halogens:

| Halogen | Bond enthalpy (kJ/mol) |
|---|---|
| $\\mathrm{F_2}$ | 158 |
| $\\mathrm{Cl_2}$ | **242** (highest) |
| $\\mathrm{Br_2}$ | 193 |
| $\\mathrm{I_2}$ | 151 |

$\\mathrm{F_2}$ has an **anomalously low** bond enthalpy due to lone pair–lone pair repulsion between the small F atoms (very short F–F bond).

Order: $\\mathrm{Cl_2 > F_2 > Br_2 > I_2}$

**Answer: Option (2)**`,
'tag_pblock12_7', src(2021, 'Feb', 25, 'Evening')),

// Q25 — Soluble fluoride up to 1 ppm in drinking water; Answer: (4) safe for teeth
mkSCQ('PB12-025', 'Easy',
`The presence of soluble fluoride ion upto 1 ppm concentration in drinking water, is:`,
[
  'harmful for teeth',
  'harmful to skin',
  'harmful to bones',
  'safe for teeth'
],
'd',
`**Fluoride and dental health:**

- **< 1 ppm:** Insufficient fluoride → increased risk of dental caries (tooth decay)
- **~1 ppm:** **Safe for teeth** — provides protection against dental caries by converting hydroxyapatite to harder fluorapatite ✓
- **1.5–4 ppm:** Causes dental fluorosis (mottling of teeth)
- **> 10 ppm:** Causes skeletal fluorosis (harmful to bones)

At 1 ppm, fluoride is **safe and beneficial** for teeth.

**Answer: Option (4) — safe for teeth**`,
'tag_pblock12_2', src(2020, 'Sep', 6, 'Morning')),

// Q26 — HF has highest boiling point among HX because; Answer: (3) strongest hydrogen bonding
mkSCQ('PB12-026', 'Easy',
`HF has highest boiling point among hydrogen halides, because it has:`,
[
  'lowest dissociation enthalpy',
  'strongest van der Waals\' interactions',
  'strongest hydrogen bonding',
  'lowest ionic character'
],
'c',
`Boiling points of hydrogen halides:

| HX | Boiling point |
|---|---|
| HF | **19.5°C** (highest) |
| HCl | −85°C |
| HBr | −67°C |
| HI | −35°C |

HF has the highest boiling point because F is the most electronegative element and has a small size. This creates very **strong intermolecular hydrogen bonds** (F–H···F) that require significant energy to break.

The other HX molecules have only van der Waals forces (which increase from HCl to HI due to larger electron clouds), but none as strong as HF's hydrogen bonds.

**Answer: Option (3) — strongest hydrogen bonding**`,
'tag_pblock12_7', src(2019, 'Apr', 9, 'Evening')),

// Q27 — Reaction of H2 with halogen requiring catalyst; Answer: (2) H2 + I2
mkSCQ('PB12-027', 'Easy',
`Among the following reactions of hydrogen with halogens, the one that requires a catalyst is:`,
[
  '$\\mathrm{H_2 + Cl_2 \\rightarrow 2HCl}$',
  '$\\mathrm{H_2 + I_2 \\rightarrow 2HI}$',
  '$\\mathrm{H_2 + F_2 \\rightarrow 2HF}$',
  '$\\mathrm{H_2 + Br_2 \\rightarrow 2HBr}$'
],
'b',
`**Reactivity of H₂ with halogens:**

| Reaction | Conditions |
|---|---|
| $\\mathrm{H_2 + F_2}$ | Explosive even in dark at low temp |
| $\\mathrm{H_2 + Cl_2}$ | Explosive in sunlight/UV light |
| $\\mathrm{H_2 + Br_2}$ | Requires heating (~300°C) |
| $\\mathrm{H_2 + I_2}$ | Requires **catalyst** (Pt or Ni) + high temperature; reaction is reversible |

The reaction of $\\mathrm{H_2}$ with $\\mathrm{I_2}$ is the slowest and requires a catalyst because the I–I bond is weak but the reaction is endothermic and reversible.

**Answer: Option (2) — $\\mathrm{H_2 + I_2 \\rightarrow 2HI}$**`,
'tag_pblock12_7', src(2019, 'Jan', 10, 'Evening')),

// Q28 — Statements about noble gases boiling points; Answer: (4) Both false
mkSCQ('PB12-028', 'Medium',
`Give below are two statements:

**Statement-I:** Noble gases have very high boiling points.

**Statement-II:** Noble gases are monoatomic gases. They are held together by strong dispersion forces. Because of this they are liquefied at very low temperature. Hence, they have very high boiling points.

In the light of the above statements, choose the correct answer from the options given below:`,
[
  'Statement I is false but Statement II is true',
  'Both Statement I and Statement II are true',
  'Statement I is true but Statement II is false',
  'Both Statement I and Statement II are false'
],
'd',
`**Statement I:** Noble gases have **very LOW** boiling points (He: −269°C, Ne: −246°C, Ar: −186°C). They are among the lowest boiling substances known. Statement I is **false**. ✗

**Statement II:** Noble gases are monoatomic and held together by **weak** London dispersion forces (not strong). Because of weak forces, they are liquefied at **very low temperatures** → they have **very low** boiling points. The statement contradicts itself by saying "strong dispersion forces" and "very high boiling points." Statement II is **false**. ✗

**Answer: Option (4) — Both Statement I and Statement II are false**`,
'tag_pblock12_6', src(2024, 'Jan', 31, 'Morning')),

// Q29 — Correct order of electron gain enthalpy of inert gases; Answer: (1) Xe < Kr < Ne < He
mkSCQ('PB12-029', 'Medium',
`Inert gases have positive electron gain enthalpy. Its correct order is`,
[
  '$\\mathrm{Xe < Kr < Ne < He}$',
  '$\\mathrm{He < Ne < Kr < Xe}$',
  '$\\mathrm{He < Xe < Kr < Ne}$',
  '$\\mathrm{He < Kr < Xe < Ne}$'
],
'a',
`Noble gases have **positive** (endothermic) electron gain enthalpies because their outermost shells are completely filled — adding an electron would require placing it in a higher energy orbital.

The electron gain enthalpy becomes **more positive** (less favourable) as we go up the group (smaller atoms, higher nuclear charge relative to size, more stable configuration):

- He: Smallest, most stable → **most positive** EGE
- Ne: Very stable
- Kr: Less stable than Ne
- Xe: Least stable → **least positive** EGE

Order (increasing): $\\mathrm{Xe < Kr < Ne < He}$

**Answer: Option (1)**`,
'tag_pblock12_6', src(2023, 'Jan', 25, 'Morning')),

// Q30 — Match List: XeF2, XeO2F2, XeO3F2, XeF4 with lone pairs; Answer: (4) a-iv, b-ii, c-i, d-iii
mkSCQ('PB12-030', 'Hard',
`Match List-I with List-II:

| | List-I (Species) | | List-II (Number of lone pairs on central atom) |
|---|---|---|---|
| (a) | $\\mathrm{XeF_2}$ | (i) | 0 |
| (b) | $\\mathrm{XeO_2F_2}$ | (ii) | 1 |
| (c) | $\\mathrm{XeO_3F_2}$ | (iii) | 2 |
| (d) | $\\mathrm{XeF_4}$ | (iv) | 3 |

Choose the most appropriate answer from the options given below:`,
[
  '(a)-(iii), (b)-(iv), (c)-(ii), (d)-(i)',
  '(a)-(iv), (b)-(i), (c)-(ii), (d)-(iii)',
  '(a)-(iii), (b)-(ii), (c)-(iv), (d)-(i)',
  '(a)-(iv), (b)-(ii), (c)-(i), (d)-(iii)'
],
'd',
`**Counting lone pairs on Xe:**

Xe has 8 valence electrons. Each bond uses 1 electron from Xe (for single bonds) or 2 for double bonds.

| Species | Bonds | Electrons used | Lone pairs |
|---|---|---|---|
| $\\mathrm{XeF_2}$ | 2 F (single) | 2 | $(8-2)/2 = 3$ → **(iv) 3** |
| $\\mathrm{XeO_2F_2}$ | 2 O (double) + 2 F (single) | 4+2=6 | $(8-6)/2 = 1$ → **(ii) 1** |
| $\\mathrm{XeO_3F_2}$ | 3 O (double) + 2 F (single) | 6+2=8 | $(8-8)/2 = 0$ → **(i) 0** |
| $\\mathrm{XeF_4}$ | 4 F (single) | 4 | $(8-4)/2 = 2$ → **(iii) 2** |

**Answer: Option (4) — (a)-(iv), (b)-(ii), (c)-(i), (d)-(iii)**`,
'tag_pblock12_6', src(2021, 'Aug', 27, 'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (PB12-021 to PB12-030)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
