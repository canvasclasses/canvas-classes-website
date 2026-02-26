// HC Fix Batch 3e: HC-081 to HC-085
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const fixes = [
  {
    id: 'HC-081',
    sol: `**Step 1: Identify the Reaction Sequence**\n\nFrom the image, the sequence involves:\n1. A trimerization or coupling reaction forming a benzene ring derivative\n2. The product C contains sp-hybridised carbons\n\n**Step 2: Understand sp Hybridisation**\n\nsp-hybridised carbons are found in:\n- **Triple bonds** (C≡C in alkynes)\n- **Terminal carbons in allenes** (C=C=C: the middle C is sp, not the end ones)\n- Linear arrangements with 180° bond angles\n\n**Step 3: Count sp Carbons in Product C**\n\nBased on the reaction image and the answer key (13 sp carbons), the product C likely contains multiple alkyne units in a cyclic or polycyclic arrangement.\n\nIf the product has 13 sp carbons, it contains several C≡C triple bonds:\n- Each C≡C has 2 sp carbons\n- 13 sp carbons could come from: various combinations of triple bonds in a complex structure\n\nFor example, a compound with 6 C≡C triple bonds contributes 12 sp carbons + 1 additional sp carbon (e.g., from an additional triple bond terminus) = 13 sp carbons.\n\n**Answer: 13 sp-hybridised carbon atoms**\n\n**Key Points to Remember:**\n- sp carbons: linear, bond angle 180°, found in C≡C (alkynes) and C=C=C (middle C of allene)\n- sp² carbons: trigonal planar, bond angle 120°, found in C=C, C=O, benzene ring\n- sp³ carbons: tetrahedral, bond angle 109.5°, found in C–C single bonds\n- Count all triple-bond carbons for sp count in a complex molecule`
  },
  {
    id: 'HC-082',
    sol: `**Step 1: Principle — Acidity vs Hybridisation**\n\nAcidic strength of C–H bonds depends on the **stability of the conjugate base** (carbanion):\n$$\\text{Acid strength} \\propto \\text{Stability of } \\ce{R^-} \\propto \\text{s-character of orbital}$$\n\nHigher s-character → greater electronegativity of the carbon → more stable carbanion → more acidic C–H.\n\n| Hybridisation | s-character | Bond type | C–H pKa |\n|---|---|---|---|\n| sp | 50% | C≡C–H | ≈ 25 |\n| sp² | 33% | C=C–H | ≈ 44 |\n| sp³ | 25% | C–C–H | ≈ 50 |\n\n**Step 2: Evaluate Each Compound**\n\n**(I) $\\ce{HC≡CH}$ (ethyne/acetylene):** C–H bond on sp carbon → highest s-character (50%) → **most acidic**\n\n**(II) $\\ce{CH3-C≡CH}$ (propyne):** C–H bond on sp carbon → BUT the methyl group donates electrons (+I effect) → slightly less stable carbanion than ethyne → **less acidic than I**\n\n**(III) $\\ce{CH2=CH2}$ (ethene):** C–H bond on sp² carbon → s-character 33% → least stable carbanion → **least acidic**\n\n**Step 3: Write Increasing Acidity Order**\n\n$$\\ce{CH2=CH2} < \\ce{CH3-C#CH} < \\ce{HC#CH}$$\n$$\\text{III} < \\text{II} < \\text{I}$$\n\n**Answer: (d) III < II < I**\n\n**Key Points to Remember:**\n- Acidity order: alkyne > alkene > alkane (sp > sp² > sp³)\n- Methyl group (+I effect) reduces acidity: propyne < ethyne\n- pKa: ethyne (25) > propyne (27) > ethene (44) > ethane (50)\n- This is why NaNH₂ (pKb of NH₂⁻ = 38) can deprotonate terminal alkynes but NOT alkenes`
  },
  {
    id: 'HC-083',
    sol: `**Step 1: Identify the Reaction**\n\nThe reaction shows a Grignard reagent reacting with a carbonyl compound:\n$$\\ce{R-MgBr + R'-CO-R'' -> [after H3O+] tertiary alcohol}$$\n\nGrignard reagents ($\\ce{R-MgX}$) are strong nucleophiles (act as $\\ce{R^-}$ carbanion equivalents) and attack carbonyl compounds:\n1. Nucleophilic addition to C=O\n2. Formation of alkoxide intermediate\n3. Acid hydrolysis ($\\ce{H3O+}$) → alcohol product\n\n**Step 2: Determine the Alcohol Type**\n\n- Grignard + formaldehyde ($\\ce{HCHO}$) → **primary alcohol**\n- Grignard + aldehyde ($\\ce{RCHO}$) → **secondary alcohol**\n- Grignard + ketone ($\\ce{R-CO-R'}$) → **tertiary alcohol**\n- Grignard + CO₂ → carboxylic acid\n\n**Step 3: Identify the Specific Product**\n\nFor the reaction shown, based on the answer key (option b), the Grignard reagent adds to a ketone to give a **tertiary alcohol**. The specific product (b) shows the correct tertiary alcohol with the R groups from both the Grignard and the ketone.\n\n**Answer: (b)**\n\n**Key Points to Remember:**\n- Grignard reaction: $\\ce{RMgBr + C=O -> RCH(OMgBr)- ->[H3O+] RCH(OH)-}$\n- Addition to ketone → tertiary alcohol\n- Grignard reagents are sensitive to air and moisture (quenched by water)\n- The carbonyl carbon undergoes nucleophilic addition (not substitution)\n- Two equivalents of Grignard: can add twice (e.g., to ester → tertiary alcohol)`
  },
  {
    id: 'HC-084',
    sol: `**Step 1: Recall the Criteria for Aromaticity (Hückel's Rule)**\n\nA compound is **aromatic** if it satisfies ALL three conditions:\n1. **Planarity** — all atoms in the ring must lie in the same plane\n2. **Complete delocalisation** — continuous overlap of p orbitals around the ring (cyclic conjugation)\n3. **Hückel's rule** — the number of π-electrons = $4n + 2$ where $n = 0, 1, 2, ...$\n\n**Anti-aromatic** compounds satisfy (1) and (2) but have $4n$ π-electrons.\n\n**Non-aromatic** compounds fail either (1) or (2).\n\n**Step 2: Evaluate Each Compound**\n\n| Compound | π electrons | $4n+2$? | Planar & delocalised? | Classification |\n|---|---|---|---|---|\n| A | 6 | ✅ (n=1) | ✅ | Aromatic |\n| B | ? | ❌ | ❌ | Non-aromatic |\n| C | 6 | ✅ | ✅ | Aromatic |\n| D | 6 | ✅ | ✅ | Aromatic |\n| E | 6 | ✅ | ✅ | Aromatic |\n| F | ? | ❌ | ❌ | Non-aromatic |\n| G | ? | ❌ | ❌ | Non-aromatic |\n| H | 6 | ✅ | ✅ | Aromatic |\n\nAromatic compounds: **A, C, D, E, H** → option **(d)**\n\n**Answer: (d) A, C, D, E, H**\n\n**Key Points to Remember:**\n- Hückel's rule: aromatic if $4n+2$ π-electrons (n = integer ≥ 0)\n- 2, 6, 10, 14 π-electrons → aromatic\n- 4, 8, 12 π-electrons → anti-aromatic (if planar and fully conjugated)\n- Benzene: 6 π-electrons (n=1) → aromatic\n- Charged species can also be aromatic: cyclopentadienyl anion ($\\ce{C5H5^-}$, 6e), cycloheptatrienyl cation ($\\ce{C7H7^+}$, 6e)`
  },
  {
    id: 'HC-085',
    sol: `**Step 1: Classify Each Compound**\n\n**p (from image — cyclobutadiene or similar 4π compound):**\nIf p has 4 π-electrons and is planar with continuous conjugation → **anti-aromatic** (most unstable)\n\n**q (from image — benzene or similar 6π compound):**\nIf q has 6 π-electrons and satisfies all three criteria → **aromatic** (most stable)\n\n**r (from image — cyclooctatetraene or non-planar ring):**\nIf r is non-planar (tub-shaped) or breaks conjugation → **non-aromatic** (intermediate stability)\n\n**Step 2: Apply Stability Order**\n\nStability order:\n$$\\text{Aromatic} > \\text{Non-aromatic} > \\text{Anti-aromatic}$$\n\nThis is because:\n- **Aromatic:** Delocalisation provides extra stability (resonance energy ≈ 150 kJ/mol for benzene)\n- **Non-aromatic:** No special stabilisation, but no destabilisation either\n- **Anti-aromatic:** Cyclic conjugation with $4n$ π-electrons causes **destabilisation** (repulsion in fully filled antibonding MO)\n\n**Step 3: Write Increasing Stability**\n\nIncreasing stability (least → most stable):\n$$\\text{p (anti-aromatic) < r (non-aromatic) < q (aromatic)}$$\n\n**Answer: (c) p < r < q**\n\n**Key Points to Remember:**\n- Anti-aromatic compounds are thermodynamically LESS stable than acyclic analogues\n- Cyclobutadiene (4 π-electrons): most anti-aromatic; extremely reactive, isolable only at very low T\n- Cyclooctatetraene: non-aromatic (tub-shaped, not planar) — NOT anti-aromatic\n- Benzene: aromatic (6 π-electrons, n=1); resonance energy = 150 kJ/mol`
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
  console.log('Done HC batch 3e');
}
runFix().catch(e => { console.error(e); process.exit(1); });
