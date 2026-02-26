// HC Fix Batch 4b: HC-096 to HC-100
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const fixes = [
  {
    id: 'HC-096',
    sol: `**Step 1: Identify the Reaction — Friedel-Crafts Alkylation**\n\nFriedel-Crafts (FC) alkylation:\n$$\\ce{ArH + RX ->[AlCl3] Ar-R + HX}$$\n\nMechanism:\n1. $\\ce{AlCl3}$ (Lewis acid) abstracts $\\ce{X^-}$ from $\\ce{RX}$ → generates carbocation $\\ce{R+}$ (or tight ion pair)\n2. $\\ce{R+}$ (electrophile) attacks the π system of benzene ring → arenium ion intermediate\n3. Loss of $\\ce{H+}$ (with $\\ce{AlCl4^-}$) → arene product + HX + AlCl₃ (catalyst regenerated)\n\n**Step 2: Apply to Specific Reaction**\n\nFor the reaction shown in the image, the alkyl halide undergoes Friedel-Crafts alkylation on the benzene ring:\n- The alkyl group attaches to the ring via a C–C bond\n- Product shows the alkyl group attached to benzene at the correct position\n\n**Step 3: Identify the Major Product**\n\nThe major product (a) shows the correct Friedel-Crafts alkylation product. Note: FC alkylation can undergo carbocation rearrangement if the initially formed cation can rearrange to a more stable one.\n\n**Answer: (a)**\n\n**Key Points to Remember:**\n- FC alkylation: $\\ce{RX + ArH + AlCl3 -> Ar-R + HCl}$\n- Carbocation rearrangement is common in FC alkylation (1,2-H or 1,2-methyl shifts)\n- FC alkylation NOT possible with: deactivated rings (–NO₂ present), amines (complex with AlCl₃)\n- Multiple alkylation can occur (polyalkylation) — limitation of FC alkylation\n- FC acylation ($\\ce{RCOCl + AlCl3}$) avoids rearrangement (acylium ion is more stable)`
  },
  {
    id: 'HC-097',
    sol: `**Step 1: Recall the Principle**\n\nReactivity towards EAS depends on **electron density on the ring**:\n$$\\text{Higher electron density} \\Rightarrow \\text{More reactive towards EAS}$$\n\n- Electron-donating groups (EDG) increase electron density → increase EAS reactivity\n- Electron-withdrawing groups (EWG) decrease electron density → decrease EAS reactivity\n\n**Step 2: Rank the EDG Strength**\n\nStrength of common groups (EDG to EWG):\n$$\\ce{-NR2} > \\ce{-NH2} > \\ce{-OH} > \\ce{-OR} > \\text{alkyl} > \\ce{H} > \\text{halogen} > \\ce{-NO2}$$\n\n**Step 3: Apply to Compounds a-e**\n\nFor the compounds given:\n- **e:** Strongest EDG attached → highest electron density → most reactive\n- **d:** Second strongest EDG\n- **a:** Moderate (benzene with weak EDG or H)\n- **b:** Weak deactivating or halogen\n- **c:** Strongest EWG → least electron density → least reactive\n\nDecreasing EAS reactivity: **e > d > a > b > c**\n\n**Answer: (b) e > d > a > b > c**\n\n**Key Points to Remember:**\n- The EAS reactivity directly reflects the electron density at the ring\n- Aniline ($\\ce{-NH2}$) reacts with Br₂/H₂O without catalyst (very reactive)\n- Nitrobenzene ($\\ce{-NO2}$) requires very harsh conditions for further EAS (fuming $\\ce{HNO3}$, $\\ce{H2SO4}$)\n- Phenol (intermediate reactivity): reacts with dil. Br₂/H₂O to give 2,4,6-tribromophenol`
  },
  {
    id: 'HC-098',
    sol: `**Step 1: Evaluate the Assertion (A)**\n\n**Assertion (A):** "Benzene is more stable than hypothetical cyclohexatriene"\n\n✅ **TRUE** — Benzene has about **150 kJ/mol** more stability than the hypothetical non-resonance cyclohexatriene (with alternating single and double bonds). This extra stabilisation is called **resonance energy** or aromatic stabilisation energy.\n\nEvidence:\n- Heat of hydrogenation of benzene ≈ 208 kJ/mol (for 3 double bonds)\n- Predicted heat of hydrogenation of cyclohexatriene = 3 × 120 kJ/mol (cyclohexene) = 360 kJ/mol\n- Difference = 360 – 208 = **152 kJ/mol** = resonance energy\n\n**Step 2: Evaluate the Reason (R)**\n\n**Reason (R):** "The delocalised π electron cloud is attracted more strongly by nuclei of carbon atoms"\n\n✅ **TRUE** — In benzene:\n- π electrons are delocalised over all 6 carbon atoms (above and below the ring)\n- Delocalised BMO (bonding molecular orbital) electrons are at LOWER energy than localised π bonds\n- The electrons are closer to the nuclei on average → stronger attractive interaction → more stable\n\n**Step 3: Does R Correctly Explain A?**\n\nYes — the delocalised π cloud in benzene (R) is the direct reason for the extra stability of benzene over hypothetical cyclohexatriene (A).\n\n**Answer: (c) Both (A) and (R) are correct and (R) is the correct explanation of (A)**\n\n**Key Points to Remember:**\n- Resonance energy of benzene ≈ 150–152 kJ/mol (from hydrogenation data)\n- Delocalised BMO: π electrons in benzene occupy BMOs that are lower in energy than isolated π bonds\n- This is the molecular orbital explanation of aromaticity\n- Structural evidence: all C–C bonds in benzene equal length (139 pm, between single 154 pm and double 134 pm)`
  },
  {
    id: 'HC-099',
    sol: `**Step 1: Identify the Reaction — KMnO₄ Oxidation of Alkylbenzene**\n\n$\\ce{KMnO4}$ (acidic, hot) oxidises **benzylic carbons** (carbons directly attached to the benzene ring):\n\n$$\\ce{Ar-CH_xR_{3-x} ->[KMnO4/H+, \\Delta] Ar-COOH}$$\n\n**Key Rule:** A benzylic carbon is oxidised to –COOH **only if** it has at least one benzylic H atom. If the benzylic carbon has no H (quaternary), it is NOT oxidised.\n\n**Step 2: Apply the Rule**\n\nFor the compound shown:\n- Identify all benzylic positions (C directly attached to Ar ring)\n- If benzylic C has ≥1 H → oxidised to –COOH\n- If benzylic C has 0 H (quaternary) → NOT oxidised (ring is also stable)\n\n$$\\ce{Ar-CH2R -> Ar-COOH}$$\n$$\\ce{Ar-CHR2 -> Ar-COOH}$$\n$$\\ce{Ar-CR3 -> NO REACTION (quaternary benzylic C)}$$\n\n**Step 3: Identify the Major Product P**\n\nFor the given compound, the benzylic carbon(s) with H atoms are oxidised to –COOH groups. Product (d) shows the correct carboxylic acid product.\n\n**Answer: (d)**\n\n**Key Points to Remember:**\n- KMnO₄ (acidic, hot): oxidises benzylic C–H → COOH; does NOT cleave ring C–C bonds\n- Benzylic C with no H: not oxidised (e.g., tert-butylbenzene → no oxidation at the benzylic C)\n- Multiple benzylic groups on same ring: all are oxidised → polyacid product\n- This reaction is used to identify alkyl substituents on benzene ring by their acid products`
  },
  {
    id: 'HC-100',
    sol: `**Step 1: Apply Aromaticity Criteria to Each Compound**\n\nFor aromaticity:\n1. Planar cyclic ring\n2. Continuous π overlap (fully conjugated)\n3. $4n+2$ π-electrons (Hückel's rule)\n\n**Step 2: Evaluate Each Compound**\n\n**Compound A (from image):**\nCheck π-electron count and planarity:\n- If 4 π-electrons (e.g., cyclobutadiene) → anti-aromatic ✗\n- If sp³ carbon present → non-aromatic ✗\n→ **Not aromatic** based on answer key\n\n**Compound B:**\nSatisfies all criteria:\n- Cyclic, planar, $4n+2$ π-electrons (e.g., 6e with n=1)\n→ **Aromatic** ✅\n\n**Compound C:**\nSatisfies all criteria:\n- Cyclic, planar, $4n+2$ π-electrons\n→ **Aromatic** ✅\n\n**Compound D (from image):**\nFails one or more criteria:\n- Either sp³ centre breaks conjugation, or wrong π-electron count\n→ **Not aromatic** ✗\n\n**Step 3: Identify Aromatic Compounds**\n\nAromatic compounds: **B and C only**\n\n**Answer: (d) (B) and (C) only**\n\n**Key Points to Remember:**\n- Neutral 5-membered heteroaromatics: furan (6e), pyrrole (6e), thiophene (6e) — all aromatic\n- Cyclopentadienyl anion ($\\ce{C5H5^-}$): 6e → aromatic\n- Cyclopentadienyl cation ($\\ce{C5H5^+}$): 4e → anti-aromatic\n- Cycloheptatrienyl (tropylium) cation ($\\ce{C7H7^+}$): 6e → aromatic\n- Always count lone pairs that contribute to the π system (heteroatom lone pairs in p orbitals)`
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
  console.log('Done HC batch 4b');
}
runFix().catch(e => { console.error(e); process.exit(1); });
