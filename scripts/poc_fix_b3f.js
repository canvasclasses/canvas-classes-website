// POC Fix Batch 3f: POC-086 to POC-090
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const fixes = [
  {
    id: 'POC-086',
    opts_fix: [
      { id: 'a', text: '$\\ce{[Fe(CN)5NOS]^{4-}}$', is_correct: true },
      { id: 'b', text: '$\\ce{[Fe(SCN)6]^{4-}}$', is_correct: false },
      { id: 'c', text: '$\\ce{Fe4[Fe(CN)6]3 . H2O}$', is_correct: false },
      { id: 'd', text: '$\\ce{[Fe(CN)6]^{4-}}$', is_correct: false }
    ],
    sol: `**Step 1: Identify the Colours of Each Complex**\n\n| Complex | Name | Colour |\n|---|---|---|\n| $\\ce{[Fe(CN)5NOS]^{4-}}$ | Pentacyanonitrosylferrate sulphide | **Violet/Purple** ✅ |\n| $\\ce{[Fe(SCN)6]^{4-}}$* | Iron(II) thiocyanate | Blood red in +3 state |\n| $\\ce{Fe4[Fe(CN)6]3}$ | Prussian blue | Dark blue |\n| $\\ce{[Fe(CN)6]^{4-}}$ | Hexacyanoferrate(II) | Yellow/amber |\n\n**Step 2: Origin of the Violet Complex**\n\n$\\ce{[Fe(CN)5NOS]^{4-}}$ is formed in the Lassaigne sulphur test:\n$$\\ce{Na2S + Na2[Fe(CN)5NO] -> Na4[Fe(CN)5NOS]}$$\n\nWhen $\\ce{S^{2-}}$ ion from the sodium extract reacts with sodium nitroprusside $\\ce{Na2[Fe(CN)5NO]}$, the sulphide ion replaces the oxygen in the NO ligand to form the violet-coloured complex.\n\n**Step 3: Conclusion**\n\nAnswer: **(a) $\\ce{[Fe(CN)5NOS]^{4-}}$** is violet in colour.\n\n**Key Points to Remember:**\n- Violet/purple = $\\ce{[Fe(CN)5NOS]^{4-}}$ → indicates sulphur in Lassaigne's test\n- Blood red = $\\ce{[Fe(SCN)]^{2+}}$ → formed when N + S both present\n- Prussian blue = $\\ce{Fe4[Fe(CN)6]3}$ → indicates nitrogen in Lassaigne's test\n- Yellow = ammonium phosphomolybdate → indicates phosphorus`
  },
  {
    id: 'POC-087',
    opts_fix: [
      { id: 'a', text: '$\\ce{AgNO3}$', is_correct: true },
      { id: 'b', text: '$\\ce{HNO3}$', is_correct: false },
      { id: 'c', text: '$\\ce{BaSO4}$', is_correct: false },
      { id: 'd', text: '$\\ce{CuSO4}$', is_correct: false }
    ],
    sol: `**Step 1: Recall the Carius Method for Halogens**\n\nIn the Carius method, the organic compound containing halogen is placed in a thick-walled sealed glass tube (Carius tube) along with:\n1. **Fuming nitric acid** ($\\ce{HNO3}$, conc.) — strong oxidising agent\n2. **Silver nitrate** ($\\ce{AgNO3}$) — to precipitate the halide as silver halide\n\n**Step 2: The Reaction Sequence**\n\n$$\\ce{Organic-X + HNO3(fuming) -> CO2 + H2O + HX}$$\n$$\\ce{HX + AgNO3 -> AgX (v) + HNO3}$$\n\nThe halogen (X) is released as HX, which immediately reacts with $\\ce{AgNO3}$ to form the insoluble silver halide precipitate:\n- $\\ce{Cl}$ → $\\ce{AgCl}$ (white)\n- $\\ce{Br}$ → $\\ce{AgBr}$ (pale yellow)\n- $\\ce{I}$ → $\\ce{AgI}$ (yellow)\n\n**Step 3: Evaluate Each Option**\n\n| Reagent | Role in Carius Method? |\n|---|---|\n| **(a) $\\ce{AgNO3}$** ✅ | Precipitates halide as $\\ce{AgX}$ — essential reagent |\n| (b) $\\ce{HNO3}$ | This is fuming HNO₃ — already implied; but the question asks what's added alongside it |\n| (c) $\\ce{BaSO4}$ | Used for sulphur estimation — not halogens |\n| (d) $\\ce{CuSO4}$ | Catalyst in Kjeldahl's method — not Carius |\n\n**Answer: (a) $\\ce{AgNO3}$**\n\n**Key Points to Remember:**\n- Carius method (halogens): fuming $\\ce{HNO3}$ + **$\\ce{AgNO3}$** → $\\ce{AgX}$ precipitate\n- Carius method (sulphur): fuming $\\ce{HNO3}$ + **$\\ce{BaCl2}$** → $\\ce{BaSO4}$ precipitate\n- $\\ce{BaSO4}$ is the product of sulphur estimation, not the reagent\n- The tube must be sealed (high pressure) — fuming HNO₃ is required for complete oxidation`
  },
  {
    id: 'POC-088',
    opts_fix: [
      { id: 'a', text: '$\\ce{KFe[Fe(CN)6]}$', is_correct: true },
      { id: 'b', text: '$\\ce{K5Fe[Fe(CN)6]2}$', is_correct: false },
      { id: 'c', text: '$\\ce{Fe4[Fe(CN)6]3}$', is_correct: false },
      { id: 'd', text: '$\\ce{HFe[Fe(CN)6]}$', is_correct: false }
    ],
    sol: `**Step 1: Understand the Reaction Conditions**\n\nAcidic $\\ce{FeCl3}$ + **excess** $\\ce{K4[Fe(CN)6]}$ → Prussian blue colloidal species.\n\nKey feature: **excess** potassium ferrocyanide means K is present in the product.\n\n**Step 2: The Reaction**\n\n$$\\ce{FeCl3 + K4[Fe(CN)6] -> KFe[Fe(CN)6] + 3KCl}$$\n\nWhen $\\ce{K4[Fe(CN)6]}$ is in **excess**, the Prussian blue colloidal species formed is **$\\ce{KFe[Fe(CN)6]}$** (potassium ferric ferrocyanide), not the simple $\\ce{Fe4[Fe(CN)6]3}$.\n\n**Step 3: Distinguish from the Standard Formula**\n\n| Conditions | Product |\n|---|---|\n| Stoichiometric/standard | $\\ce{Fe4[Fe(CN)6]3}$ |\n| **Excess $\\ce{K4[Fe(CN)6]}$** | $\\ce{KFe[Fe(CN)6]}$ (soluble Prussian blue / Berlin blue) |\n\nThe **colloidal** Prussian blue in the presence of excess ferrocyanide contains K⁺ to balance charge:\n$$\\ce{Fe^{3+} + [Fe(CN)6]^{4-} + K^+ -> KFe[Fe(CN)6]}$$\n\n**Answer: (a) $\\ce{KFe[Fe(CN)6]}$**\n\n**Key Points to Remember:**\n- Stoichiometric Prussian blue: $\\ce{Fe4[Fe(CN)6]3}$ (Prussian blue, insoluble)\n- Prussian blue with excess ferrocyanide: $\\ce{KFe[Fe(CN)6]}$ (Berlin blue, colloidal/soluble form)\n- Both are blue; the K+ content in the excess-K4[Fe(CN)6] reaction stabilises the colloid\n- Prussian blue is used as a pigment and in the Lassaigne nitrogen test`
  },
  {
    id: 'POC-089',
    sol: `**Step 1: Identify Compound $\\ce{C_xH_yN_z}$ as $\\ce{C2H7N}$**\n\nThe compound is $\\ce{C2H7N}$. The balanced equation is:\n$$\\ce{C2H7N + (2x + \\frac{y}{2}) CuO -> x CO2 + \\frac{y}{2} H2O + \\frac{z}{2} N2 + (2x + \\frac{y}{2}) Cu}$$\n\n**Step 2: Identify x, y, z from the Molecular Formula**\n\nCompound: $\\ce{C2H7N}$\n- Carbon atoms: x = 2\n- Hydrogen atoms: y = 7\n- Nitrogen atoms: z = 1\n\n**Step 3: Verify the Balanced Equation**\n\n$$\\ce{C2H7N + (2(2) + \\frac{7}{2}) CuO -> 2CO2 + \\frac{7}{2}H2O + \\frac{1}{2}N2 + (4 + 3.5) Cu}$$\n\n$$\\ce{C2H7N + 7.5 CuO -> 2CO2 + 3.5H2O + 0.5N2 + 7.5Cu}$$\n\nLet me verify atom balance:\n- C: 2 = 2 ✓\n- H: 7 = 7 (from $3.5 \\times 2 = 7$) ✓\n- N: 1 = 1 (from $0.5 \\times 2 = 1$) ✓\n- O: 7.5 = $2 \\times 2 + 3.5 = 7.5$ ✓\n\n**Step 4: Read off the Value of y**\n\nFrom the molecular formula $\\ce{C2H7N}$:\n$$y = \\mathbf{7}$$\n\n**Answer: 7**\n\n**Key Points to Remember:**\n- In the Dumas' method equation, x, y, z are the subscripts in the molecular formula $\\ce{C_xH_yN_z}$\n- For $\\ce{C2H7N}$ (ethylamine or dimethylamine): x=2, y=7, z=1\n- The coefficient of CuO = $2x + \\frac{y}{2}$ (from oxidising C to CO₂ and H to H₂O)\n- The answer y = 7 is the number of H atoms in the compound`
  },
  {
    id: 'POC-090',
    difficulty: 'Hard',
    sol: `**Step 1: Recall the Carius Method Formula for Bromine**\n\n$$\\%Br = \\frac{80}{188} \\times \\frac{m_{AgBr}}{m_{\\text{compound}}} \\times 100$$\n\nWhere:\n- Molar mass of $\\ce{AgBr}$ = 108 + 80 = 188 g/mol\n- Atomic mass of Br = 80 g/mol\n\n**Step 2: Substitute Given Values**\n\n- $m_{AgBr}$ = 0.2397 g\n- $m_{\\text{compound}}$ = 0.15 g\n\n$$m_{Br} = \\frac{80}{188} \\times 0.2397 = \\frac{80 \\times 0.2397}{188} = \\frac{19.176}{188} = 0.10200 \\text{ g}$$\n\n**Step 3: Calculate Percentage**\n\n$$\\%Br = \\frac{0.10200}{0.15} \\times 100 = \\frac{10.200}{0.15} = 68.0\\%$$\n\n**Answer: 68** (nearest integer)\n\n**Verification:**\n$$\\frac{80 \\times 0.2397}{188 \\times 0.15} \\times 100 = \\frac{19.176}{28.2} \\times 100 = 67.99\\% \\approx 68\\% \\checkmark$$\n\n**Key Points to Remember:**\n- $\\%Br = \\frac{80}{188} \\times \\frac{m_{AgBr}}{m_{\\text{compound}}} \\times 100$\n- A high %Br (68%) suggests the compound has one or possibly two Br atoms (e.g., CHBr₃ has 94% Br)\n- AgBr molar mass: 108 (Ag) + 80 (Br) = 188 g/mol (not 187 or 189!)\n- Always double-check molar masses: Ag = 108, not 107`
  }
];

async function runFix() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  for (const f of fixes) {
    const update = { $set: {} };
    if (f.q) update.$set['question_text.markdown'] = f.q;
    if (f.sol) update.$set['solution.text_markdown'] = f.sol;
    if (f.difficulty) update.$set['metadata.difficulty'] = f.difficulty;
    if (f.opts_fix) {
      f.opts_fix.forEach((o, i) => {
        update.$set[`options.${i}.text`] = o.text;
        update.$set[`options.${i}.is_correct`] = o.is_correct;
      });
    }
    const res = await col.updateOne({ display_id: f.id }, update);
    console.log(`${f.id}: matched=${res.matchedCount}, modified=${res.modifiedCount}`);
  }
  await mongoose.disconnect();
  console.log('Done batch 3f');
}
runFix().catch(e => { console.error(e); process.exit(1); });
