// HC Fix Batch 2b: HC-036 to HC-040
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const fixes = [
  {
    id: 'HC-036',
    sol: `**Step 1: Identify Lindlar's Catalyst**\n\nLindlar's catalyst = **Pd deposited on CaCO₃ or BaSO₄, partially poisoned with quinoline or lead acetate**.\n\nIt selectively reduces alkynes to **cis-alkenes** (syn addition of H₂) but does NOT further reduce the cis-alkene to an alkane.\n\n**Step 2: Mechanism of Lindlar Reduction**\n\n$$\\ce{R-C≡C-R' + H2 ->[\\text{Lindlar's}] cis-R-CH=CH-R'}$$\n\n- H₂ undergoes **syn addition** (both H atoms add from the same face of the catalyst)\n- Both H atoms add from the SAME face → cis (Z) geometry\n- The catalyst is deactivated enough to stop at alkene (not reduce to alkane)\n\n**Step 3: Apply to the Given Alkyne**\n\nFor the alkyne shown in the image:\n$$\\text{R-C≡C-R'} \\xrightarrow{\\text{H}_2/\\text{Lindlar's}} \\text{cis (Z)-R-CH=CH-R'}$$\n\nThe major product is the **cis-alkene** with both substituents on the same side.\n\n**Answer: (b) cis-alkene**\n\n**Key Points to Remember:**\n- Lindlar's catalyst → cis-alkene (syn H₂ addition)\n- Birch reduction (Na/liq. NH₃) → trans-alkene (anti addition via radical anion)\n- Lindlar's catalyst does NOT reduce: benzene ring, ketones, esters\n- Full hydrogenation (Pd/C + H₂) → alkane (no selectivity for alkene stage)`
  },
  {
    id: 'HC-037',
    sol: `**Step 1: Calculate Moles of CO₂ and H₂O**\n\nFrom complete combustion:\n$$\\ce{C_xH_y + O2 -> CO2 + H2O}$$\n\nGiven: 1.8 g $\\ce{H2O}$ and 4.4 g $\\ce{CO2}$\n\n$$n_{CO_2} = \\frac{4.4}{44} = 0.1 \\text{ mol}$$\n$$n_{H_2O} = \\frac{1.8}{18} = 0.1 \\text{ mol}$$\n\n**Step 2: Find Number of C and H Atoms**\n\n$$n_C = n_{CO_2} = 0.1 \\text{ mol (each CO}_2\\text{ has 1 C)}$$\n$$n_H = 2 \\times n_{H_2O} = 2 \\times 0.1 = 0.2 \\text{ mol (each H}_2\\text{O has 2 H)}$$\n\n**Step 3: Determine C:H Ratio**\n\n$$C:H = 0.1 : 0.2 = 1 : 2$$\n\nEmpirical formula = $\\ce{CH2}$\n\n**Step 4: Find Molecular Formula**\n\nEmpirical formula mass = 12 + 2 = 14 g/mol\n\nLet molecular formula = $\\ce{(CH2)_n}$:\n$$\\text{Molar mass} = 14n$$\n\nFor molar mass 70: $14n = 70 \\Rightarrow n = 5$\n\nMolecular formula = $\\ce{C5H10}$\n\n**Step 5: Verify DoU**\n\n$$\\text{DoU} = \\frac{2(5)+2-10}{2} = \\frac{2}{2} = 1$$\n\nOne degree of unsaturation → 1 C=C or 1 ring → consistent with a cyclopentane or pentene.\n\n**Answer: 70 g/mol**\n\n**Key Points to Remember:**\n- C from CO₂: $n_C = \\frac{m_{CO_2}}{44}$\n- H from H₂O: $n_H = \\frac{2 \\times m_{H_2O}}{18}$\n- Empirical formula from molar ratios; n-fold to get molecular formula\n- $\\ce{C5H10}$ can be cyclopentane (ring), pent-1-ene, pent-2-ene, 2-methylbut-1-ene, etc.`
  },
  {
    id: 'HC-038',
    sol: `**Step 1: Draw 2-Methylbutane and Identify Unique Positions**\n\n2-Methylbutane = $\\ce{(CH3)2CH-CH2-CH3}$\n\nStructure:\n$$\\ce{CH3-CH(CH3)-CH2-CH3}$$\n\n**Step 2: Identify Unique Carbon Types (Excluding Stereoisomers)**\n\nFor monochlorination, replace one H at a time and count distinct products:\n\n| Position | Description | Unique product? |\n|---|---|---|\n| C-1: $\\ce{CH3}$ (at C-1 or C-1'*) | The two terminal CH₃ groups on C-2 are equivalent | **Product 1**: 1-chloro-2-methylbutane |\n| C-2: $\\ce{CH}$ | Tertiary C–H | **Product 2**: 2-chloro-2-methylbutane |\n| C-3: $\\ce{-CH2-}$ | Secondary C–H | **Product 3**: 1-chloro-3-methylbutane |\n| C-4: $\\ce{-CH3}$ | Terminal methyl | **Product 4**: 1-chloro-2-methylbutane? |\n\n*Note: Both methyl groups on C-2 are equivalent (by rotation) → same product.\n\nActually, careful enumeration:\n1. **Chlorination at C-1 (=C-1')**: $\\ce{ClCH2-CH(CH3)-CH2CH3}$ → **1-Chloro-2-methylbutane**\n2. **Chlorination at C-2**: $\\ce{CH3-CCl(CH3)-CH2CH3}$ → **2-Chloro-2-methylbutane**\n3. **Chlorination at C-3**: $\\ce{CH3-CH(CH3)-CHCl-CH3}$ → **2-Methyl-3-chlorobutane** (same as 3-chloro-2-methylbutane)\n4. **Chlorination at C-4**: $\\ce{CH3-CH(CH3)-CH2-CH2Cl}$ → **1-Chloro-3-methylbutane**\n\n**Total = 4 distinct monochlorination products (excluding stereoisomers)**\n\n**Answer: 4**\n\n**Key Points to Remember:**\n- Count unique carbons by symmetry analysis\n- 2-Methylbutane has 4 types of C–H bonds: C-1(×6 equiv.), C-2(×1), C-3(×2), C-4(×3)\n- Excluding stereoisomers: the 3° C product (2-chloro-2-methylbutane) has no stereocentre\n- Product at C-3 has a new chiral centre but question says "excluding stereoisomers"`
  },
  {
    id: 'HC-039',
    sol: `**Step 1: Draw 4-Methylpent-3-en-2-one**\n\n4-Methylpent-3-en-2-one IUPAC name breakdown:\n- **Pent-3-en-2-one:** 5-carbon chain with double bond at C3 and ketone at C2\n- **4-Methyl:** methyl group at C4\n\n$$\\ce{CH3-C(=O)-CH=C(CH3)-CH3}$$\n\nActually:\n- C1: CH₃\n- C2: C=O (ketone)\n- C3: =CH–\n- C4: =C(CH₃)–\n- C5: CH₃\n\nStructure: $\\ce{CH3-CO-CH=C(CH3)-CH3}$\n\n**Step 2: Identify the Common Name**\n\nThis compound has the structure of **mesityl oxide** — named because it was historically derived from the self-condensation of acetone (mesitylene precursor):\n$$\\ce{2CH3COCH3 ->[\\text{base}] CH3-CO-CH=C(CH3)-CH3 + H2O}$$\n\nMesityl oxide = 4-methylpent-3-en-2-one = $\\ce{CH3COCH=C(CH3)2}$\n\n**Answer: (d) Mesityl oxide**\n\n**Key Points to Remember:**\n- Mesityl oxide = 4-methylpent-3-en-2-one (systematic)\n- Formed by aldol condensation of acetone followed by dehydration\n- Contains both C=C (conjugated) and C=O groups → α,β-unsaturated ketone\n- Acetone → diacetone alcohol (aldol product) → mesityl oxide (dehydration product)\n- Common name vs IUPAC: many old compounds have trivial names (mesityl, mesitylene, etc.)`
  },
  {
    id: 'HC-040',
    sol: `**Step 1: Draw the Structure of Mesityl Oxide**\n\nMesityl oxide = 4-Methylpent-3-en-2-one = $\\ce{CH3-CO-CH=C(CH3)-CH3}$\n\nThe full structural formula:\n$$\\underset{\\text{(1)CH}_3}{} \\underset{\\text{(2)C=O}}{} \\underset{\\text{(3)CH=}}{} \\underset{\\text{(4)C(CH}_3\\text{)=}}{} \\underset{\\text{(5)CH}_3}{}$$\n\nExpanded: $\\ce{H3C-C(=O)-CH=C(CH3)-CH3}$\n\n**Step 2: Identify and Count C–C σ Bonds**\n\nEach C–C bond (single or as the σ component of a double bond) is a σ bond:\n\n| Bond | Type |\n|---|---|\n| C1–C2 (CH₃–CO) | C–C σ bond (1) |\n| C2–C3 (CO–CH=) | C–C σ bond (2) |\n| C3–C4 (CH=C) | C=C double bond = 1 σ + 1 π; count σ (3) |\n| C4–C5 (C–CH₃ at position 5) | C–C σ bond (4) |\n| C4–C6 (C–CH₃ at branch) | C–C σ bond (5) |\n\nWhere C6 is the methyl branch at C4.\n\n**Total C–C σ bonds = 5**\n\n**Answer: 5**\n\n**Key Points to Remember:**\n- Every C–C bond (single, double, or triple) contains exactly 1 σ bond\n- The σ component is always present; π bonds are additional\n- Mesityl oxide skeleton: $\\ce{C6}$ compound with 5 C–C connections\n- Structure: $\\ce{CH3-CO-CH=C(CH3)-CH3}$ has 5 C–C σ bonds and 1 C=O + 1 C=C (contributing σ + π)`
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
    const res = await col.updateOne({ display_id: f.id }, update);
    console.log(`${f.id}: matched=${res.matchedCount}, modified=${res.modifiedCount}`);
  }
  await mongoose.disconnect();
  console.log('Done HC batch 2b');
}
runFix().catch(e => { console.error(e); process.exit(1); });
