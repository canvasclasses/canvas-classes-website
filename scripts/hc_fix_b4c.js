// HC Fix Batch 4c: HC-101 to HC-105
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const fixes = [
  {
    id: 'HC-101',
    sol: `**Step 1: Identify the Reaction Sequence**\n\nThe reaction sequence involves:\n1. **Nitration** of benzene/toluene → nitro compound\n2. **Reduction** of nitro group → amine\n3. **Diazotization** → diazonium salt\n\nStep-by-step:\n\n**Reaction A — Nitration:**\n$$\\ce{Benzene + HNO3 ->[H2SO4] Nitrobenzene (A)}$$\nElectrophile: $\\ce{NO2+}$ (nitronium ion). Product A = nitrobenzene.\n\n**Reaction B — Reduction:**\n$$\\ce{Nitrobenzene + 6[H] ->[Fe/HCl or Sn/HCl] Aniline (B) + 2H2O}$$\nProduct B = aniline ($\\ce{C6H5NH2}$).\n\n**Reaction C — Diazotisation:**\n$$\\ce{Aniline + NaNO2 + HCl ->[0-5°C] Diazonium salt (C) + NaCl + 2H2O}$$\nProduct C = benzenediazonium chloride ($\\ce{C6H5N2^+Cl^-}$).\n\n**Step 2: Confirm the Products A, B, C**\n\nOption **(b)** shows:\n- A = nitrobenzene ✅\n- B = aniline ✅\n- C = benzenediazonium salt ✅\n\n**Answer: (b)**\n\n**Key Points to Remember:**\n- Nitration: benzene + conc. HNO₃/H₂SO₄ → nitrobenzene (EAS, –M director formed)\n- Reduction: Ar–NO₂ → Ar–NH₂ (Fe/HCl, Sn/HCl, or H₂/Pd)\n- Diazotization: Ar–NH₂ + NaNO₂/HCl at 0–5°C → Ar–N₂⁺Cl⁻ (diazonium salt)\n- Diazonium salts are unstable above 5°C; used as intermediates for Sandmeyer reactions`
  },
  {
    id: 'HC-102',
    sol: `**Step 1: Identify the Reaction Sequence**\n\nThe reaction shows a Grignard reaction sequence. The typical Grignard sequence:\n1. Formation of Grignard reagent: $\\ce{R-X + Mg ->[\\text{dry ether}] RMgX}$\n2. Addition to carbonyl compound: $\\ce{RMgX + C=O -> alkoxide}$\n3. Acid hydrolysis: $\\ce{\\text{alkoxide} + H3O+ -> \\text{alcohol}}$\n\n**Step 2: Trace the Reaction Steps**\n\nFor the reaction shown:\n- **Step 1:** The alkyl/aryl halide reacts with Mg in dry ether → Grignard reagent\n- **Step 2:** Grignard reagent attacks the C=O of a carbonyl compound (aldehyde, ketone, or CO₂)\n- **Step 3:** Aqueous acid workup → alcohol product\n\nFor CO₂ as the carbonyl source:\n$$\\ce{RMgX + CO2 -> RCOO^-MgX+ ->[H3O+] RCOOH}$$\n\nFor aldehyde/ketone:\n$$\\ce{RMgX + R'CHO ->[H3O+] R-CH(OH)-R'}$$\n\n**Step 3: Identify the Correct Products**\n\nThe products A, B, and C in the given sequence are shown correctly in option **(c)**.\n\n**Answer: (c)**\n\n**Key Points to Remember:**\n- Grignard + formaldehyde → primary alcohol\n- Grignard + other aldehyde → secondary alcohol\n- Grignard + ketone → tertiary alcohol\n- Grignard + CO₂ → carboxylic acid\n- Grignard + ester → tertiary alcohol (2 equivalents of Grignard react)\n- Always use dry conditions (Grignard is destroyed by water/alcohol/acid)`
  },
  {
    id: 'HC-103',
    sol: `**Step 1: Identify the Target Molecule**\n\nTarget: **4-bromo-2-nitroethylbenzene** from benzene\n\nStructure: Benzene ring with:\n- Ethyl group at C-1\n- Bromo at C-4\n- Nitro at C-2\n\n**Step 2: Retrosynthetic Analysis**\n\nWorking backwards:\n- Final product has $\\ce{-NO2}$ at C-2 (ortho to ethyl at C-1) and $\\ce{-Br}$ at C-4 (para to ethyl)\n- Ethyl group is an ortho/para director: Br should go ortho/para to ethyl\n- After introducing ethyl, bromination at para position (more favoured over ortho)\n\n**Step 3: Correct Sequence**\n\n**Option (d):** $\\ce{CH3COCl/AlCl3, Zn-Hg/HCl, Br2/AlBr3, HNO3/H2SO4}$\n\n1. **$\\ce{CH3COCl/AlCl3}$** (FC acylation) → acetylbenzene (methyl ketone; avoids carbocation rearrangement)\n2. **$\\ce{Zn-Hg/HCl}$** (Clemmensen reduction) → ethylbenzene (reduces C=O → CH₂, adds the CH₃ to give –CH₂CH₃)\n\nWait: $\\ce{CH3COCl}$ gives –COCH₃; Clemmensen gives –CH₂CH₃ = ethyl group ✅\n\n3. **$\\ce{Br2/AlBr3}$** → bromination para to ethyl → 4-bromoethylbenzene\n4. **$\\ce{HNO3/H2SO4}$** → nitration ortho to ethyl (and directed by Br too) → 4-bromo-2-nitroethylbenzene ✅\n\nThis sequence correctly builds the target with proper regiochemistry.\n\n**Answer: (d)**\n\n**Key Points to Remember:**\n- FC acylation preferred over alkylation (avoids rearrangement)\n- Clemmensen: $\\ce{Zn-Hg/HCl}$ reduces C=O to CH₂ (acidic conditions)\n- Wolff-Kishner: $\\ce{NH2NH2/KOH/\\Delta}$ — same result (basic conditions)\n- Order matters: introduce directing groups in the correct order for desired regiochemistry`
  },
  {
    id: 'HC-104',
    sol: `**Step 1: Recall Aromaticity Criteria**\n\nFor aromaticity:\n1. Planar cyclic ring\n2. Fully conjugated (uninterrupted p orbital overlap)\n3. $4n+2$ π-electrons\n\nFor **non-aromaticity**, the compound fails either (1) or (2) — either lacks planarity OR lacks continuous conjugation (sp³ carbon or sp carbon oriented wrong way).\n\n**Step 2: Identify the Non-Aromatic Compound**\n\n**Option (b):** The compound has **absent conjugation**:\n- An sp³ carbon (or interrupted conjugation) in the ring breaks the continuous p orbital overlap\n- Even if cyclic and planar, if not fully conjugated → **non-aromatic**\n\nWithout continuous p orbital overlap around the ring, no delocalised π system can form → NOT aromatic.\n\n**Options (a), (c), (d):** These satisfy all three criteria:\n- Planar, cyclic, fully conjugated\n- $4n+2$ π-electrons\n→ **Aromatic** ✅\n\n**Answer: (b)**\n\n**Key Points to Remember:**\n- An sp³ carbon (two bonds to H, no p orbital for π system) in the ring → breaks conjugation → non-aromatic\n- An sp carbon perpendicular to ring plane can also disrupt aromaticity\n- Non-aromatic ≠ anti-aromatic: non-aromatic has NO extra stabilisation/destabilisation from ring\n- Example: 1,3-cyclohexadiene (sp³ CH₂ present) → non-aromatic (not cyclohexa-2,4-dien-1-yl ring)`
  },
  {
    id: 'HC-105',
    sol: `**Step 1: Recall Hybridisation Rules**\n\nHybridisation of a carbon atom is determined by the number of regions of electron density (bonds + lone pairs):\n\n| Bonds | Hybridisation | Bond angle | Example |\n|---|---|---|---|\n| 4 single | $sp^3$ | 109.5° | $\\ce{CH4}$, alkane C |\n| 1 double + others | $sp^2$ | 120° | alkene, carbonyl C |\n| 1 triple + 1 single | $sp$ | 180° | alkyne, nitrile C |\n\n**Step 2: Identify the Structure from the Image**\n\nFor the given molecule with carbons a, b, and c:\n\n**Carbon a:**\n- No double or triple bonds; forms 4 single bonds (sp³)\n- Bond angle ≈ 109.5°\n- **Hybridisation: $sp^3$**\n\n**Carbon b:**\n- Part of a C=C double bond (alkene or aromatic ring)\n- Forms 3 σ bonds + contributes to π bond\n- Bond angle ≈ 120°\n- **Hybridisation: $sp^2$**\n\n**Carbon c:**\n- Also part of a C=C double bond (or aromatic ring)\n- Forms 3 σ bonds + π contribution\n- Bond angle ≈ 120°\n- **Hybridisation: $sp^2$**\n\n**Step 3: Summary**\n\nHybridisation of a, b, c = $sp^3$, $sp^2$, $sp^2$\n\n**Answer: (a) $sp^3$, $sp^2$, $sp^2$**\n\n**Key Points to Remember:**\n- sp³: 4 different bonds (all single bonds); tetrahedral\n- sp²: double bond present on carbon; trigonal planar\n- sp: triple bond present on carbon; linear\n- Benzene ring: all 6 carbons are sp² (120° bond angles, planar molecule)`
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
  console.log('Done HC batch 4c');
}
runFix().catch(e => { console.error(e); process.exit(1); });
