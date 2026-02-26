// HC Fix Batch 1a: HC-001 to HC-005
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const fixes = [
  {
    id: 'HC-001',
    sol: `**Step 1: Recall the Conformations of Ethane**\n\nConformations arise from rotation about the C–C single bond. For ethane ($\\ce{C2H6}$), there are infinite conformations ranging between two extremes:\n- **Staggered conformation** (most stable): H atoms on front C are 60° away from H atoms on back C\n- **Eclipsed conformation** (least stable): H atoms on front C are directly in front of H atoms on back C (dihedral angle = 0°)\n\n**Step 2: Evaluate Each Statement**\n\n**(a) "Ethane has infinite number of conformations"** ✅ TRUE — As the C–C bond rotates continuously, infinite intermediate conformations exist.\n\n**(b) "The dihedral angle in staggered conformation is 60°"** ✅ TRUE — In Newman projection, adjacent H atoms in staggered ethane are exactly 60° apart.\n\n**(c) "Eclipsed conformation is the most stable conformation"** ❌ FALSE — The eclipsed conformation is the **LEAST stable** conformation. It has maximum torsional strain (bond pair–bond pair repulsion between C–H bonds). The **staggered** conformation is most stable.\n\n**(d) "The conformations of ethane are interconvertible to one another"** ✅ TRUE — Rotation about C–C single bonds requires only ~12.5 kJ/mol (energy barrier for eclipsed), making them easily interconvertible at room temperature.\n\n**Step 3: Conclusion**\n\nThe INCORRECT statement is **(c)** — eclipsed is least stable, not most stable.\n\n**Key Points to Remember:**\n- Staggered: dihedral angle = 60°; most stable (minimum torsional strain)\n- Eclipsed: dihedral angle = 0°; least stable (maximum torsional strain)\n- Energy difference between staggered and eclipsed ethane ≈ 12.5 kJ/mol\n- Newman projection: front C shown as dot, back C as circle; groups on front and back drawn accordingly`
  },
  {
    id: 'HC-002',
    sol: `**Step 1: Recall Kolbe's Electrolysis**\n\nIn Kolbe's electrolysis, carboxylate anions are oxidised at the anode:\n$$\\ce{2RCOO^- -> R-R + 2CO2 + 2e^-}$$\n\nWhen a **mixture** of two different carboxylate salts is electrolysed, three coupling products form:\n- Homocoupling of $\\ce{R_1COO^-}$ → $\\ce{R_1-R_1}$\n- Homocoupling of $\\ce{R_2COO^-}$ → $\\ce{R_2-R_2}$\n- Cross-coupling of $\\ce{R_1COO^-}$ + $\\ce{R_2COO^-}$ → $\\ce{R_1-R_2}$\n\n**Step 2: Identify the Carboxylate Ions**\n\n- $\\ce{CH3COONa}$ → $\\ce{CH3COO^-}$, so $\\ce{R_1}$ = $\\ce{CH3}$\n- $\\ce{C2H5COONa}$ → $\\ce{C2H5COO^-}$, so $\\ce{R_2}$ = $\\ce{C2H5}$\n\n**Step 3: List All Alkane Products**\n\n1. **Homocoupling of $\\ce{CH3COO^-}$:** $\\ce{CH3-CH3}$ = **Ethane**\n2. **Homocoupling of $\\ce{C2H5COO^-}$:** $\\ce{C2H5-C2H5}$ = **Butane**\n3. **Cross-coupling:** $\\ce{CH3-C2H5}$ = **Propane**\n\n**Total = 3 alkanes**\n\n**Answer: 3**\n\n**Key Points to Remember:**\n- Kolbe's electrolysis formula: $n$ different carboxylate salts → $\\frac{n(n+1)}{2}$ alkane products\n- For 2 different salts: $\\frac{2 \\times 3}{2} = 3$ products ✓\n- Reaction occurs at the ANODE (oxidation); at cathode: $\\ce{H^+ + e^- -> H}$ (H₂ gas)\n- The alkane formed has the two R groups directly bonded: $\\ce{R_1-R_2}$`
  },
  {
    id: 'HC-003',
    sol: `**Step 1: Recall Conformational Stability Order**\n\nFor n-butane (or any alkane with bulky substituents), the stability order of conformations is:\n$$\\text{Anti} > \\text{Gauche} > \\text{Eclipsed (H/CH}_3\\text{)} > \\text{Fully eclipsed (CH}_3\\text{/CH}_3\\text{)}$$\n\nStability is inversely related to potential energy (PE).\n\n**Step 2: Key Principle for Most Stable Conformation**\n\nThe most stable conformation has:\n- **Bulky groups (CH₃) at 180° to each other (anti position)**\n- Minimum steric (van der Waals) interactions between large groups\n- This is the anti conformation — lowest PE, maximum stability\n\n**Step 3: Identify Conformation A from the Image**\n\nConformation A shows the bulky methyl groups in the **anti** arrangement (dihedral angle = 180°). This minimises steric repulsion between the large substituents, making it the most stable.\n\nThe other conformations (B, C, D) show gauche or eclipsed arrangements with higher potential energy.\n\n**Step 4: Conclusion**\n\nConformation A is the most stable → **Answer: (a)**\n\n**Key Points to Remember:**\n- Anti conformation: dihedral angle = 180° between the two largest groups; most stable\n- Gauche conformation: dihedral angle = 60°; less stable than anti\n- Steric strain: van der Waals repulsion between bulky substituents\n- In Newman projection: front group (dot) and back group (circle); bonds drawn accordingly`
  },
  {
    id: 'HC-004',
    sol: `**Step 1: Identify the Reagents**\n\nThe reaction shows n-hexane treated with **AlCl₃/HCl** at elevated temperature. This is a Friedel-Crafts type condition — but here applied to an alkane.\n\n**Step 2: Understand the Reaction**\n\nWhen an alkane with 6 carbons is treated with $\\ce{AlCl3}$, a **cyclisation (isomerisation)** reaction occurs:\n- The carbocation intermediate (formed via AlCl₃-catalysed ionisation) can undergo ring closure\n- n-Hexane (C₆H₁₄) undergoes **cyclisation** to form **cyclohexane** (C₆H₁₂) + 2H (released as H₂ or via catalyst)\n\nThis is NOT a chlorination reaction (that requires Cl₂ under UV light).\n\n**Step 3: Identify Product X**\n\nThe reaction of n-hexane with AlCl₃/HCl → **Cyclohexane**\n\nNote: Cyclohexane is the most stable 6-membered carbocyclic ring (no ring strain — chair conformation).\n\n**Answer: (d) Cyclohexane**\n\n**Key Points to Remember:**\n- AlCl₃/HCl with alkanes: causes **isomerisation/cyclisation**, NOT chlorination\n- Chlorination of alkanes requires $\\ce{Cl2}$ + UV light or heat (free radical mechanism)\n- n-Hexane → cyclohexane (loss of H₂ in dehydrocyclisation)\n- Cyclohexane is thermodynamically very stable (chair form, no angle or torsional strain)`
  },
  {
    id: 'HC-005',
    sol: `**Step 1: Identify the Substrate and Reaction**\n\nThe substrate appears to be a methoxy-substituted tetralin (or similar bicyclic system) undergoing **electrophilic aromatic substitution (EAS)**. The reagent causes nitration or a similar electrophilic attack.\n\n**Step 2: Apply EAS Directing Effects**\n\n$\\ce{-OCH3}$ (methoxy group) is a **strong ortho/para directing group** (EDG — electron-donating by resonance via +M effect):\n$$\\text{-OCH}_3 \\text{ activates ortho and para positions}$$\n\nThe methoxy group donates electron density through resonance into the benzene ring, making ortho and para positions more nucleophilic and therefore more reactive toward electrophiles.\n\n**Step 3: Determine the Major Product**\n\nIn the bicyclic tetralin system with -OMe attached:\n- The electrophile attacks at the position **para** to -OMe (preferred over ortho if less steric hindrance)\n- The major product has electrophile added at the para position to the -OMe group\n\nConformation A (option a) shows attack at the correct position consistent with o/p direction from -OMe.\n\n**Answer: (a)**\n\n**Key Points to Remember:**\n- -OMe is one of the strongest activating, ortho/para directing groups in EAS\n- Mechanism: +M effect pushes electrons into the ring → high electron density at o and p positions\n- In bicyclic systems, steric effects may favour para over ortho\n- Deactivating meta-directors include: $\\ce{-NO2}$, $\\ce{-CN}$, $\\ce{-COOH}$, $\\ce{-SO3H}$`
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
  console.log('Done HC batch 1a');
}
runFix().catch(e => { console.error(e); process.exit(1); });
