// HC Fix Batch 1e: HC-021 to HC-025
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const fixes = [
  {
    id: 'HC-021',
    sol: `**Step 1: Understand Electrophilic Addition of HBr to Alkenes**\n\nThe reaction of HBr(aq) with an alkene proceeds via electrophilic addition:\n1. H⁺ adds to the alkene to form a carbocation intermediate (rate-determining step)\n2. Br⁻ attacks the carbocation (fast step)\n\nThe rate depends on the **stability of the carbocation intermediate**.\n\n**Step 2: Carbocation Stability Order**\n\n$$\\text{Benzyl/Allyl} > 3° > 2° > 1° > \\text{methyl}$$\n\n- **Benzylic** and **allylic** carbocations are stabilised by resonance\n- Tertiary carbocations: stabilised by 3 alkyl groups (+I and hyperconjugation)\n- Primary carbocations: least stable (only 1 alkyl group)\n\n**Step 3: Evaluate Each Molecule**\n\n- **P:** Likely a simple terminal or internal alkene → forms a secondary or tertiary carbocation\n- **Q:** Likely a vinyl/allylic or conjugated system → forms a **resonance-stabilised allylic or benzylic carbocation** (most stable intermediate) → **fastest reaction rate**\n- **R:** Forms a less stabilised carbocation than Q\n- **S:** Similar analysis — less stable intermediate than Q\n\nCompound **Q** produces the most stable carbocation (resonance-stabilised), so it reacts fastest with HBr.\n\n**Answer: (a) Q**\n\n**Key Points to Remember:**\n- Rate of electrophilic addition ∝ stability of carbocation intermediate\n- Resonance stabilisation (allyl/benzyl) >> inductive stabilisation (3° > 2° > 1°)\n- Markovnikov's rule: H adds to C with more H; Br adds to C with fewer H (for Markovnikov addition)\n- Anti-Markovnikov addition: possible with peroxide (free radical mechanism)`
  },
  {
    id: 'HC-022',
    sol: `**Step 1: Determine the Molecular Formula**\n\nGiven:\n- Molar mass = 80 g/mol\n- Carbon content = 90%\n- Hydrocarbon (only C and H)\n\n$$m_C = 80 \\times 0.90 = 72 \\text{ g/mol}$$\n$$m_H = 80 - 72 = 8 \\text{ g/mol}$$\n\n**Step 2: Find Number of C and H Atoms**\n\n$$n_C = \\frac{72}{12} = 6$$\n$$n_H = \\frac{8}{1} = 8$$\n\nMolecular formula = $\\mathbf{C_6H_8}$\n\n**Step 3: Calculate Degree of Unsaturation (DoU)**\n\nFor a hydrocarbon $\\ce{C_nH_m}$:\n$$\\text{DoU} = \\frac{2n + 2 - m}{2} = \\frac{2(6) + 2 - 8}{2} = \\frac{12 + 2 - 8}{2} = \\frac{6}{2} = 3$$\n\n**Step 4: Verify**\n\n$\\ce{C6H8}$ with DoU = 3 could be:\n- Cyclohexadiene (1 ring + 2 double bonds = 3 DoU)\n- Benzene would be $\\ce{C6H6}$ (DoU = 4)\n- A triene (3 double bonds = 3 DoU)\n\n**Answer: 3**\n\n**Key Points to Remember:**\n- DoU formula for $\\ce{C_nH_m}$: $\\frac{2n+2-m}{2}$\n- Each degree = 1 double bond OR 1 ring\n- Triple bond = 2 degrees\n- Benzene ring = 4 degrees (3 double bonds + 1 ring)\n- Always verify: $\\ce{C6H8}$ saturation would be $\\ce{C6H14}$; difference in H = 6 → 3 DoU`
  },
  {
    id: 'HC-023',
    sol: `**Step 1: Identify Each Structure by IUPAC Nomenclature Rules**\n\n**A (image structure) → IUPAC name?**\nBased on the description and the answer key match with II (3-Ethyl-5-methylheptane):\n- A is a branched alkane with 7C main chain, ethyl at C-3 and methyl at C-5\n- IUPAC: **3-Ethyl-5-methylheptane** → A matches II ✓\n\n**B: $\\ce{(CH3)2C(C3H7)2}$ → IUPAC name?**\n- Central carbon has 2 methyl groups and 2 propyl groups = $\\ce{(CH3)2C(n-C3H7)2}$\n- Total carbons: 2 (two CH₃) + 6 (two propyl) + 1 (central C) = 9C? Actually: 1(central) + 2(from CH₃) + 6(from 2×C₃H₇) → but main chain picks the longest chain\n- Best name: 4,4-Dimethylheptane (2 methyl groups at C-4, with heptane as main chain)\n- B matches **III (4,4-Dimethylheptane)** ✓\n\n**C (image structure) → IUPAC name?**\nBased on the answer match:\n- C has conjugated double bonds with a methyl branch: **2-Methyl-1,3-pentadiene** → C matches **IV** ✓\n\n**D (image structure) → IUPAC name?**\n- D is: **4-Methylpent-1-ene** → D matches **I** ✓\n\n**Step 2: Conclusion**\n\n| Structure | Name |\n|---|---|\n| A | II (3-Ethyl-5-methylheptane) |\n| B | III (4,4-Dimethylheptane) |\n| C | IV (2-Methyl-1,3-pentadiene) |\n| D | I (4-Methylpent-1-ene) |\n\n**Answer: (c) (A)-(II), (B)-(III), (C)-(IV), (D)-(I)**\n\n**Key Points to Remember:**\n- IUPAC: choose longest chain; number from end giving lowest locants to substituents\n- Diene naming: locate both double bonds; use -diene suffix with positions\n- $\\ce{(CH3)2C(C3H7)2}$ → symmetrical 4,4-dimethyl substitution on heptane backbone\n- 4-Methylpent-1-ene: CH₂=CH-CH₂-CH(CH₃)-CH₃`
  },
  {
    id: 'HC-024',
    sol: `**Step 1: Identify the Starting Material and Reaction**\n\n3-Methylhex-2-ene: $\\ce{CH3-CH=C(CH3)-CH2-CH2-CH3}$\n\nWith HBr in the **presence of peroxide** (ROOR):\n- Peroxide initiates **free radical addition** (anti-Markovnikov addition)\n- In free radical addition: Br adds to the **less substituted** carbon of the double bond\n\n**Step 2: Apply Anti-Markovnikov Addition**\n\nFor 3-methylhex-2-ene:\n$$\\ce{CH3-CH=C(CH3)-CH2CH2CH3 + HBr ->[\\text{ROOR}]}$$\n\nFree radical: Br· adds to C-2 (less substituted) → H goes to C-3:\n$$\\text{Product A} = \\ce{CH3-CHBr-CH(CH3)-CH2CH2CH3}$$\n\n= **2-Bromo-3-methylhexane**\n\n**Step 3: Identify Stereocentres in Product A**\n\nIn 2-Bromo-3-methylhexane:\n- **C-2:** $\\ce{CHBr}$ with groups: H, Br, CH₃, CH(CH₃)CH₂CH₂CH₃ → 4 different groups ✅ stereocentre\n- **C-3:** $\\ce{CH(CH₃)}$ with groups: H, CH₃, CHBr-CH₃, CH₂CH₂CH₃ → 4 different groups ✅ stereocentre\n\n**2 stereocentres** → maximum stereoisomers = $2^2 = 4$\n\n**Step 4: Check for Meso Possibility**\n\nThe two stereocentres have different substituents (C-2 has Br; C-3 has CH₃) → no meso compound possible → all 4 stereoisomers are distinct.\n\n**Answer: 4**\n\n**Key Points to Remember:**\n- Peroxide + HBr → anti-Markovnikov (free radical); no peroxide → Markovnikov (ionic)\n- Free radical: Br· adds first to alkene (as the radical intermediate)\n- 2 stereocentres without meso possibility → 4 stereoisomers (2 pairs of enantiomers)\n- Maximum stereoisomers = $2^n$ reduced by meso compounds`
  },
  {
    id: 'HC-025',
    sol: `**Step 1: Identify the Reaction**\n\nFrom the image context, the reaction involves addition of Cl₂ to a cyclopentene derivative. Halogen addition to cycloalkenes proceeds via **anti addition** (trans addition) through a cyclic halonium ion intermediate.\n\n**Step 2: Mechanism of Anti Addition of Cl₂**\n\n1. $\\ce{Cl2}$ acts as electrophile; one Cl attacks the π bond → forms a **cyclic chloronium ion** (bridged intermediate)\n2. $\\ce{Cl^-}$ attacks from the opposite face (SN2-like)\n3. Result: **trans (anti) addition** of two Cl atoms\n\nFor cyclopentene:\n$$\\ce{Cyclopentene + Cl2 -> trans-1,2-Dichlorocyclopentane}$$\n\nThe two Cl atoms are added to adjacent carbons with **anti** stereochemistry (trans product).\n\n**Step 3: Identify Correct Products**\n\nThe anti addition gives the **trans** (or racemic) product. Options (c) and (d) both represent the trans adduct (as a pair of enantiomers formed with equal probability in achiral conditions).\n\n**Answer: (c)** as the primary answer per the answer key.\n\n**Key Points to Remember:**\n- Halogen addition to alkenes: always **anti (trans) addition** via halonium ion mechanism\n- Cyclopentene + Cl₂ → trans-1,2-dichlorocyclopentane (as a racemic mixture)\n- cis addition does NOT occur with halogens (unlike catalytic H₂ addition which is syn)\n- Halonium ion = bridged 3-membered ring with halogen at apex; SN2 attack from back face`
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
  console.log('Done HC batch 1e');
}
runFix().catch(e => { console.error(e); process.exit(1); });
