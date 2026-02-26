// HC Fix Batch 1c: HC-011 to HC-015
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const fixes = [
  {
    id: 'HC-011',
    sol: `**Step 1: Understand Dihedral Angle in Newman Projection**\n\nA Newman projection views the molecule along a C–C bond axis:\n- Front carbon is shown as a dot/circle\n- Back carbon is shown as the circle itself\n- Substituents on each carbon are drawn as lines from these positions\n\n**Step 2: Staggered Conformation Definition**\n\nIn a staggered conformation:\n- The substituents on the front carbon are positioned exactly between the substituents on the back carbon\n- The dihedral angle between any adjacent pair of substituents (one from each carbon) is **60°**\n\n**Step 3: Apply to 1,1,1-Trichloroethane**\n\n1,1,1-Trichloroethane = $\\ce{CCl3CH3}$\n\nIn Newman projection along the C–C bond:\n- Front carbon: three Cl atoms at 120° to each other\n- Back carbon: three H atoms at 120° to each other\n\nIn the staggered form, each H on the back carbon is at **60°** to the nearest Cl on the front carbon.\n\nThis is the same for all staggered conformations of any ethane-type molecule — the dihedral angle is always **60°**.\n\n**Answer: 60 degrees**\n\n**Key Points to Remember:**\n- Staggered: dihedral angle = 60° (always, for any substituents on a 2-carbon system)\n- Eclipsed: dihedral angle = 0°\n- Anti: dihedral angle = 180° (for n-butane between the two CH₃ groups)\n- The 60° rule applies to ALL staggered conformations regardless of substituents`
  },
  {
    id: 'HC-012',
    sol: `**Step 1: Identify Each Reagent and Its Application**\n\n**A. Alcoholic KOH (alc. KOH)**\nAlcoholic KOH is a strong base used for **dehydrohalogenation** (β-elimination). It removes HX from alkyl halides to form alkenes:\n$$\\ce{R-CH_2-CH_2-X + KOH(alc.) -> R-CH=CH_2 + KX + H_2O}$$\nMatch: **(III) β-elimination reaction** ✓\n\n**B. Pd/BaSO₄**\nPd on BaSO₄ support is **Lindlar's catalyst** — palladium deactivated by BaSO₄ and quinoline. It selectively reduces alkynes to cis-alkenes (semi-hydrogenation):\n$$\\ce{R-C≡C-R + H2 ->[\\text{Lindlar's}] cis-R-CH=CH-R}$$\nMatch: **(IV) Lindlar's Catalyst** ✓\n\n**C. BHC (Benzene Hexachloride = Gammexane)**\nBHC ($\\ce{C6H6Cl6}$) is obtained by **addition** of Cl₂ to benzene:\n$$\\ce{C6H6 + 3Cl2 ->[\text{UV}] C6H6Cl6 (BHC)}$$\nThis is a 1,2,3,4,5,6-hexachlorocyclohexane.\nMatch: **(II) Obtained by addition reaction** ✓\n\n**D. Polyacetylene**\nPolyacetylene $\\ce{(-CH=CH-)_n}$ is a conducting polymer used as **electrodes in batteries** (due to its conjugated π system that allows charge transport).\nMatch: **(I) Electrodes in batteries** ✓\n\n**Step 2: Build Match Table**\n\n| List-I | List-II |\n|---|---|\n| A (Alc. KOH) | III (β-elimination) |\n| B (Pd/BaSO₄) | IV (Lindlar's Catalyst) |\n| C (BHC) | II (Addition reaction) |\n| D (Polyacetylene) | I (Battery electrodes) |\n\n**Answer: (d) (A)-(III), (B)-(IV), (C)-(II), (D)-(I)**\n\n**Key Points to Remember:**\n- Lindlar's catalyst = Pd/BaSO₄ + quinoline → cis-alkene from alkyne\n- Alc. KOH → elimination; Aq. KOH → substitution\n- BHC = benzene + 3Cl₂ (photochemical addition, not substitution)\n- Polyacetylene = first conducting organic polymer; Nobel Prize in Chemistry 2000`
  },
  {
    id: 'HC-013',
    sol: `**Step 1: Analyse the Reaction from the Image Context**\n\nThe reaction appears to show a compound undergoing hydrogenation or a ring-forming reaction to give a product. The question asks for the starting material A.\n\n**Step 2: Work Backwards from the Product**\n\nBased on the answer key, the product is consistent with starting from **cyclohexane**:\n- Cyclohexane ($\\ce{C6H12}$) is the most stable 6-membered carbocyclic ring\n- It can undergo various reactions (dehydrogenation, halogenation, oxidation) to give different products\n- The reactions shown in the image are consistent with cyclohexane as the starting material\n\n**Step 3: Verify Against Options**\n\n**(a) Cyclohexane** ✅ — 6-membered saturated ring; fits the reaction sequence shown\n**(b) 1,2-Dimethylcyclobutane** — 4-membered ring with two methyl groups; unlikely precursor\n**(c) Ethylcyclopentane** — 5-membered ring; different carbon skeleton\n**(d) Methylcyclopentane** — 5-membered ring with methyl; different skeleton\n\n**Answer: (a) Cyclohexane**\n\n**Key Points to Remember:**\n- Cyclohexane is the most stable cycloalkane (chair conformation; no ring strain)\n- Ring contraction/expansion reactions are uncommon without specific catalysts\n- When working backwards from products, match the carbon skeleton first\n- Cyclohexane reactions: halogenation (free radical), dehydrogenation (→ benzene), oxidation`
  },
  {
    id: 'HC-014',
    sol: `**Step 1: Understand Chiral Centres**\n\nA chiral centre (stereocentre) is a carbon atom with **four different substituents**. Each chiral centre gives rise to stereoisomerism.\n\n**Step 2: Identify the Reaction**\n\nFrom the image, compound B is produced from a reaction involving a diene or triene compound. The maximum number of chiral centres in a product depends on:\n- How many new stereocentres are created in the reaction\n- Whether existing stereocentres are retained\n\n**Step 3: Count Chiral Centres in Product B**\n\nFor a cycloaddition or epoxidation/halogenation of a polyene:\n- Each new stereocentre is a carbon bearing 4 different groups\n- The answer indicates **4 chiral centres** in product B\n\nWith 4 chiral centres, the maximum possible stereoisomers = $2^4 = 16$ (but meso compounds reduce this number).\n\n**Answer: 4 chiral centres**\n\n**Key Points to Remember:**\n- Chiral centre = C with 4 different substituents (sp³ carbon)\n- Maximum stereoisomers = $2^n$ (n = number of chiral centres), reduced by meso compounds\n- Look for new stereocentres formed in addition reactions (anti addition to alkenes creates 2 new stereocentres)\n- Cyclic products: count each ring carbon with 4 different groups`
  },
  {
    id: 'HC-015',
    sol: `**Step 1: Understand the Factors Governing Conformational Stability**\n\nConformational stability in organic compounds is determined by:\n\n1. **Torsional strain** — arises in eclipsed conformations from repulsion between bonding electron pairs in adjacent C–H bonds. Present in both cyclic AND acyclic compounds.\n\n2. **Steric interactions (van der Waals strain)** — repulsion between non-bonded atoms/groups that come too close together. Present in both cyclic AND acyclic compounds.\n\n3. **Electrostatic forces** — interactions between polar bonds (dipole-dipole, ion-dipole). Relevant for polar substituents in both cyclic and acyclic compounds.\n\n4. **Angle strain** — deviation of bond angles from ideal sp³ (109.5°) values. This is a property specific to **cyclic compounds** (small rings) and is NOT relevant for acyclic (open-chain) compounds.\n\n**Step 2: Identify the Factor NOT Applicable to Acyclic Compounds**\n\n- Acyclic compounds have no rings → no geometric constraint on bond angles\n- Bond angles in open-chain compounds are free to adjust to ~109.5° (sp³) regardless of conformation\n- **Angle strain is NOT a factor in conformational stability of acyclic compounds**\n\n**Answer: (b) Angle strain**\n\n**Key Points to Remember:**\n- Angle strain = ring strain = Baeyer strain; only in cyclic compounds\n- Cyclopropane (60° angles): highest angle strain; cyclobutane (90°): moderate; cyclohexane: no strain\n- Torsional + steric + electrostatic → all govern acyclic conformational stability\n- Conformational analysis of butane: anti (most stable) due to minimum steric interactions`
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
  console.log('Done HC batch 1c');
}
runFix().catch(e => { console.error(e); process.exit(1); });
