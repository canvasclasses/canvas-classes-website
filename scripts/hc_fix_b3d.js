// HC Fix Batch 3d: HC-076 to HC-080
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const fixes = [
  {
    id: 'HC-076',
    sol: `**Step 1: Identify the Problem**\n\nBut-2-yne = $\\ce{CH3-C≡C-CH3}$ (an **internal** alkyne — NO terminal ≡C–H bond)\n\nThe question asks: which reagent converts but-2-yne to **cis-but-2-ene**?\n\n**Step 2: Why Na Cannot React with But-2-yne**\n\nSodium metal (Na) deprotonates terminal alkynes via:\n$$\\ce{R-C≡CH + Na -> R-C≡C-Na+ + \\frac{1}{2}H2}$$\n\nBut-2-yne has NO terminal ≡C–H (it has $\\ce{CH3-C≡C-CH3}$). Therefore:\n- **Na cannot react with but-2-yne** — no acidic proton to abstract\n- Na/liq. NH₃ works differently: it uses dissolved electrons in liquid ammonia for Birch reduction → but still gives **trans-but-2-ene** (anti addition)\n\n**Step 3: Identify the Correct Reagent for cis-Alkene**\n\nTo get **cis-but-2-ene** from but-2-yne:\n- Need **syn addition** of H₂\n- **Lindlar's catalyst** = H₂/Pd-C (partially deactivated) → syn H₂ addition → **cis-alkene**\n\n$$\\ce{CH3-C≡C-CH3 + H2 ->[Pd-C / \\text{Lindlar's}] cis-CH3-CH=CH-CH3}$$\n\n**Answer: (c) $\\ce{H2/Pd-C}$ (Lindlar's catalyst)**\n\n**Key Points to Remember:**\n- Terminal alkyne: Na reacts (gives acetylide); but-2-yne: Na does NOT react (no acidic H)\n- Cis-alkene from alkyne: Lindlar's catalyst (Pd/BaSO₄ or Pd/CaCO₃ + quinoline)\n- Trans-alkene from alkyne: Na/liq. NH₃ or Li/liq. NH₃ (Birch reduction)\n- $\\ce{NaBH4}$: reduces ketones/aldehydes, not alkynes\n- Sn-HCl: reduces nitro groups to amines (not relevant here)`
  },
  {
    id: 'HC-077',
    sol: `**Step 1: Identify the Reaction Sequence**\n\nFrom the image, the reaction shows ethyne ($\\ce{HC≡CH}$) undergoing:\n1. **Cyclic polymerization** (trimerization) → benzene\n2. **Gattermann-Koch reaction** on benzene → benzaldehyde compound\n\n**Step 2: Step 1 — Trimerization of Ethyne**\n\nEthyne can undergo cyclic trimerization:\n$$\\ce{3HC≡CH ->[600°C / \\text{Pd-charcoal}] Benzene (C6H6)}$$\n\nBenzene has 6 carbon atoms, all $sp^2$ hybridised.\n\n**Step 3: Step 2 — Gattermann-Koch Reaction**\n\nGattermann-Koch reaction introduces a **formyl group (-CHO)** onto benzene:\n$$\\ce{C6H6 + CO + HCl ->[\\text{AlCl3/CuCl}] C6H5-CHO (Benzaldehyde)}$$\n\nProduct X = **Benzaldehyde** ($\\ce{C6H5-CHO}$)\n\n**Step 4: Count sp² Carbon Atoms in Benzaldehyde**\n\nBenzaldehyde structure: $\\ce{C6H5-CHO}$\n\n| Carbon | Type | Hybridisation |\n|---|---|---|\n| 6 carbons in benzene ring | Aromatic C=C | All $sp^2$ |\n| CHO carbon (C=O) | Carbonyl C | $sp^2$ |\n\n**Total sp² carbons = 6 (ring) + 1 (CHO) = 7**\n\n**Answer: 7**\n\n**Key Points to Remember:**\n- Trimerization of ethyne: 3 × $\\ce{HC≡CH}$ → benzene (at high temp, Pd/charcoal)\n- Gattermann-Koch: benzene + CO/HCl/AlCl₃ → benzaldehyde (formylation)\n- Benzaldehyde: 7 carbons (6 ring + 1 CHO); all sp²\n- sp² carbon = involved in C=C double bond or C=O; bond angle ≈ 120°`
  },
  {
    id: 'HC-078',
    sol: `**Step 1: Identify the Reaction**\n\nThe reaction shows an **alkyne** treated with $\\ce{Hg^{2+}}$ and $\\ce{H2O}$ (acid catalyst). This is **Markovnikov hydration of an alkyne** (Kucherov reaction).\n\n**Step 2: Mechanism**\n\n1. $\\ce{Hg^{2+}}$ forms a complex with the C≡C triple bond (electrophilic activation)\n2. $\\ce{H2O}$ attacks the more substituted carbon (Markovnikov)\n3. Forms a vinyl alcohol (enol) intermediate via mercurinium ion\n4. Tautomerisation: enol → keto form → **ketone**\n\n$$\\ce{R-C≡C-R' + H2O ->[H2SO4/HgSO4] enol -> R-CO-CH2-R'}$$\n\n**Step 3: Product Type**\n\n- For **terminal alkyne** $\\ce{R-C≡CH}$: Markovnikov → H₂O adds to C≡C giving $\\ce{R-CO-CH3}$ (**methyl ketone**)\n- For **internal alkyne** $\\ce{R-C≡C-R'}$: gives mixture of two ketones\n\nFor the specific alkyne in the image, the major product is a **ketone** (option a).\n\n**Answer: (a) Ketone product**\n\n**Key Points to Remember:**\n- Alkyne + $\\ce{Hg^{2+}/H2O/H2SO4}$ → ketone (via enol tautomerisation)\n- Markovnikov hydration: OH on more substituted C; H on less substituted C\n- Terminal alkyne: always gives methyl ketone ($\\ce{R-CO-CH3}$)\n- Aldehydes from alkynes: only via anti-Markovnikov hydroboration-oxidation\n- Enol ↔ Keto tautomerism: keto form strongly favoured (>99%) in most cases`
  },
  {
    id: 'HC-079',
    sol: `**Step 1: Identify the Reaction**\n\nThe reaction shows an alkyne undergoing **ozonolysis** with a specific workup. For alkynes:\n\n**Ozonolysis of Alkynes:**\n$$\\ce{R-C≡C-R' + O3 ->[workup] RCOOH + R'COOH}$$\n\nAlkynes undergo ozonolysis more vigorously than alkenes. The triple bond is cleaved at BOTH π bonds:\n1. First O₃ molecule attacks the triple bond\n2. Formation of an acyl ozonide intermediate\n3. Decomposition to give carboxylic acids (most common) or diketones\n\n**Step 2: Mechanism for the Specific Alkyne**\n\nFor the alkyne in the image (which appears to be an internal alkyne with aryl groups or similar), ozonolysis gives:\n- Both carbons of the C≡C become carboxyl carbons\n- Product (d) shows the correct carboxylic acid fragments\n\n**Step 3: Note on Cyclic Alkyne Ozonolysis**\n\nFor a cyclic alkyne:\n- Ozonolysis opens the ring\n- Gives a single bifunctional molecule with two acid groups\n\n**Answer: (d)**\n\n**Key Points to Remember:**\n- Alkyne ozonolysis: C≡C → 2 RCOOH (oxidative, carboxylic acids)\n- More vigorous than alkene ozonolysis (attacks both π bonds)\n- Symmetric alkynes give one acid; asymmetric give two different acids\n- Cyclic alkyne → linear bifunctional diacid`
  },
  {
    id: 'HC-080',
    sol: `**Step 1: Identify the Reaction**\n\nThe reaction shows an alkyne undergoing **acid-catalysed hydration** with $\\ce{H2SO4/HgSO4}$. This is the Kucherov (Markovnikov) hydration of an alkyne.\n\n**Step 2: Apply Markovnikov's Rule to Alkyne**\n\nFor an internal alkyne $\\ce{R-C≡C-R'}$:\n$$\\ce{R-C≡C-R' + H2O ->[H2SO4, HgSO4] R-CO-CH2-R' (or R-CH2-CO-R')}$$\n\nThe enol intermediate tautomerises to the more stable keto form (ketone).\n\n**For a terminal alkyne $\\ce{R-C≡CH}$:**\n$$\\ce{R-C≡CH + H2O ->[H2SO4, HgSO4] R-CO-CH3}$$\nMarkovnikov: OH adds to C-1 (next to R group) → enol → **methyl ketone**\n\n**Step 3: Identify the Major Product**\n\nHydration gives a **ketone** as the major product. For the specific alkyne in the image:\n- The enol intermediate is less stable and rapidly tautomerises to the keto form\n- The ketone product is shown in option **(b)**\n\n**Answer: (b)**\n\n**Key Points to Remember:**\n- Alkyne + $\\ce{H2SO4/HgSO4}$ = Kucherov reaction → **ketone** (major product)\n- Mechanism: alkyne → mercurinium → enol → ketone (keto-enol tautomerism)\n- Terminal alkyne → methyl ketone (acetyl group: $\\ce{-CO-CH3}$)\n- Internal alkyne → ketone (symmetric internal alkyne gives one ketone)\n- Anti-Markovnikov hydroboration of terminal alkyne → **aldehyde** (alternative)`
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
  console.log('Done HC batch 3d');
}
runFix().catch(e => { console.error(e); process.exit(1); });
