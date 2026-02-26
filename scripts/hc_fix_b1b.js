// HC Fix Batch 1b: HC-006 to HC-010
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const fixes = [
  {
    id: 'HC-006',
    sol: `**Step 1: Recall Free Radical Halogenation with Excess Halogen**\n\nWhen ethane ($\\ce{C2H6}$) is treated with **excess** $\\ce{Br2}$ in diffused sunlight, free radical bromination occurs repeatedly. Each C–H bond can be successively replaced by a C–Br bond.\n\nEthane has the formula $\\ce{CH3-CH3}$ with 6 H atoms that can each be replaced.\n\n**Step 2: Systematically Count Bromo Derivatives**\n\nFor ethane ($\\ce{C2H6}$), bromo derivatives are $\\ce{C2H_{6-n}Br_n}$ where n = 1 to 6:\n\n| n | Formula | Name | Structural Isomers |\n|---|---|---|---|\n| 1 | $\\ce{C2H5Br}$ | Bromoethane | 1 |\n| 2 | $\\ce{C2H4Br2}$ | Dibromoethane | 2 (1,1-dibromo; 1,2-dibromo) |\n| 3 | $\\ce{C2H3Br3}$ | Tribromoethane | 2 (1,1,1-tribromo; 1,1,2-tribromo) |\n| 4 | $\\ce{C2H2Br4}$ | Tetrabromoethane | 2 (1,1,2,2-tetrabromo; 1,1,1,2-tetrabromo) |\n| 5 | $\\ce{C2HBr5}$ | Pentabromoethane | 1 |\n| 6 | $\\ce{C2Br6}$ | Hexabromoethane | 1 |\n\n**Step 3: Total Count**\n\n$$1 + 2 + 2 + 2 + 1 + 1 = \\mathbf{9}$$\n\n**Answer: 9**\n\n**Key Points to Remember:**\n- With excess halogen in diffused sunlight (free radical mechanism), all H atoms can be replaced\n- For $\\ce{C2H6}$: n can be 1 to 6, giving total 9 distinct bromo derivatives\n- Each formula has a limited number of structural isomers since ethane has only 2 carbons\n- Compare: methane ($\\ce{CH4}$) gives only 4 chloro derivatives (mono, di, tri, tetra)`
  },
  {
    id: 'HC-007',
    sol: `**Step 1: Understand the Relationship Between Staggered and Eclipsed Conformers**\n\nThe staggered and eclipsed conformers of ethane:\n- Have the **same molecular formula** ($\\ce{C2H6}$)\n- Have the **same connectivity** (same bonds)\n- Differ only in the **spatial arrangement** achieved by **rotation about the C–C single bond**\n- Are **interconvertible** at room temperature (low energy barrier ~12.5 kJ/mol)\n\n**Step 2: Classify the Relationship**\n\n| Term | Definition |\n|---|---|\n| Mirror images | Non-superimposable mirror images (enantiomers) |\n| Polymers | Large molecules from repeating monomers |\n| Enantiomers | Non-superimposable mirror images (chiral) |\n| **Rotamers** | Conformational isomers arising from rotation about single bonds |\n\n**Step 3: Apply the Classification**\n\nConformers that arise from rotation about a single bond are specifically called **rotamers** (rotational isomers or conformational isomers). They are:\n- NOT stereoisomers (too easily interconvertible)\n- NOT enantiomers (no chirality involved)\n- NOT mirror images (eclipsed and staggered ethane are not even mirror images of each other)\n\n**Answer: (d) Rotamers**\n\n**Key Points to Remember:**\n- Rotamers = conformers arising from rotation about single bonds\n- Conformers (rotamers) are NOT isolable at room temperature (rapid interconversion)\n- Conformational isomerism ≠ Configurational isomerism (which requires bond breaking)\n- In contrast, cis/trans isomers and enantiomers require bond breaking to interconvert`
  },
  {
    id: 'HC-008',
    sol: `**Step 1: Recall Potential Energy of n-Butane Conformations**\n\nFor n-butane, the key dihedral angle is between the two $\\ce{CH3}$ groups. The potential energy order (from lowest to highest):\n\n| Conformation | Dihedral angle (CH₃ to CH₃) | PE |\n|---|---|---|\n| **Anti** (I) | 180° | Lowest PE (most stable) |\n| **Gauche** (IV) | 60° | Intermediate |\n| **Eclipsed (H/CH₃)** (III) | 120° | Higher |\n| **Fully eclipsed (CH₃/CH₃)** (II) | 0° | Highest PE (least stable) |\n\n**Step 2: Apply the Energy Order**\n\n- **I (Anti, 180°):** $\\ce{CH3}$ groups farthest apart → minimum steric strain → **lowest PE**\n- **IV (Gauche, 60°):** $\\ce{CH3}$ groups at 60° → some steric strain → intermediate PE\n- **III (Eclipsed, 120°):** H eclipses $\\ce{CH3}$ → torsional strain → higher PE\n- **II (Fully eclipsed, 0°):** $\\ce{CH3}$ eclipses $\\ce{CH3}$ → maximum steric + torsional strain → **highest PE**\n\n**Step 3: Write the Increasing PE Order**\n\n$$\\text{I (Anti) < IV (Gauche) < III (Eclipsed) < II (Fully eclipsed)}$$\n\n**Answer: (b) I < IV < III < II**\n\n**Key Points to Remember:**\n- Potential energy is inversely related to stability\n- n-Butane PE plot: two minima (anti and gauche) and two maxima (eclipsed conformations)\n- Energy difference: Anti–Gauche ≈ 3.8 kJ/mol; Gauche–Eclipsed ≈ 12.5 kJ/mol; Anti–Fully eclipsed ≈ 19 kJ/mol\n- The anti conformation is always taken as reference (0 kJ/mol)`
  },
  {
    id: 'HC-009',
    sol: `**Step 1: Identify the Starting Material and Reaction**\n\nFrom the image context, the reaction shows cyclopentene being reduced. The question asks for product P.\n\n**Step 2: Identify the Reaction Type**\n\nCyclopentene ($\\ce{C5H8}$) undergoes **catalytic hydrogenation** (addition of $\\ce{H2}$) in the presence of a metal catalyst (Pd/C, Pt, or Ni):\n$$\\ce{Cyclopentene + H2 ->[\\text{Pd/C}] Cyclopentane}$$\n\nThis is an **addition reaction** where $\\ce{H2}$ adds across the C=C double bond:\n- The double bond in cyclopentene becomes a single bond\n- The 5-membered ring is retained\n- Both carbons of the former double bond now have an additional H\n\n**Step 3: Identify Product P**\n\nProduct = **Cyclopentane** ($\\ce{C5H10}$) — a fully saturated 5-membered ring.\n\n**Answer: (d) Cyclopentane**\n\n**Key Points to Remember:**\n- Catalytic hydrogenation ($\\ce{H2}$/Pd) converts alkene → alkane; cyclic alkene → cycloalkane\n- Reaction is stereospecific: syn addition (both H atoms add from same face)\n- Cyclopentane is a stable 5-membered ring (slight angle strain ~0.1 kJ/mol, ring is puckered)\n- Heats of hydrogenation: cyclopentene (~110 kJ/mol) > cyclohexene (~120 kJ/mol) [less stable → more heat released]`
  },
  {
    id: 'HC-010',
    sol: `**Step 1: Trace the Reaction Backwards**\n\nThe final product (after the reaction sequence) is **toluene** ($\\ce{C6H5CH3}$, benzene with a methyl group). We need to identify the starting material A.\n\nThe reagent sequence appears to be: A → [HCl/AlCl₃, heat] → Benzene → [methylation] → Toluene.\n\n**Step 2: Identify Intermediate**\n\nIf the first step gives **benzene** from A using AlCl₃/heat, then A must be a 6-carbon cyclic compound. The transformation of a 6-carbon cycloalkane to benzene involves **dehydrogenation/aromatization**:\n$$\\ce{Cyclohexane ->[\\text{Pt or Cr}_2\\text{O}_3,\\Delta] Benzene + 3H2}$$\n\nAlternatively, AlCl₃/HCl catalyzes **ring opening and recyclization** of appropriate alkanes.\n\n**Step 3: Identify Starting Material A**\n\nFor the reaction to go:\n- A → Benzene (6C aromatic) → Toluene (methylation)\n- A must be **cyclohexane** (6C cycloalkane)\n\n$\\ce{Cyclohexane}$ loses 3 molecules of $\\ce{H2}$ via dehydrogenation catalysed by AlCl₃/HCl or Pt/Cr₂O₃ to give benzene, which is then methylated to give toluene.\n\n**Answer: (c) Cyclohexane**\n\n**Key Points to Remember:**\n- Cyclohexane → Benzene: catalytic dehydrogenation (loss of 3H₂; reforming reaction)\n- Industrial process: catalytic reforming of naphtha uses Pt/Al₂O₃ catalyst\n- Toluene from benzene: Friedel-Crafts methylation (benzene + CH₃Cl/AlCl₃)\n- Dehydrogenation requires high temperature (400–600°C) and metal catalysts`
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
  console.log('Done HC batch 1b');
}
runFix().catch(e => { console.error(e); process.exit(1); });
