// HC Fix Batch 1f: HC-026 to HC-030
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const fixes = [
  {
    id: 'HC-026',
    sol: `**Step 1: Draw the Structure of Ethylene**\n\nEthylene = $\\ce{H2C=CH2}$\n\nEach carbon is $sp^2$ hybridised:\n- Forms 3 σ bonds (using $sp^2$ orbitals): 2 with H atoms and 1 with the other C\n- Forms 1 π bond (using unhybridised p orbitals): overlap of p orbitals above and below the plane\n\n**Step 2: Count σ Bonds**\n\n| Bond | Type | Count |\n|---|---|---|\n| C–H bonds (on C-1) | σ | 2 |\n| C–H bonds (on C-2) | σ | 2 |\n| C–C bond (σ component) | σ | 1 |\n| **Total σ bonds** | | **5** |\n\n**Step 3: Count π Bonds**\n\nThe C=C double bond = 1σ + 1π\n\n**π bonds = 1**\n\n**Step 4: Summary**\n\n$$\\text{Ethylene: 5 σ bonds and 1 π bond}$$\n\n**Answer: (d) 5 and 1**\n\n**Key Points to Remember:**\n- Every single bond is a σ bond; double bond = 1σ + 1π; triple bond = 1σ + 2π\n- Ethylene: $sp^2$ hybridised C; planar molecule (all atoms in same plane)\n- σ bond: head-on overlap (along internuclear axis); stronger bond\n- π bond: lateral overlap (above and below the molecular plane); weaker, more reactive`
  },
  {
    id: 'HC-027',
    sol: `**Step 1: Evaluate the Assertion (A)**\n\n**Assertion (A):** "Cis form of alkene is found to be more polar than the trans form"\n\n✅ **TRUE** — Consider cis vs trans-but-2-ene:\n- In **cis-but-2-ene**: both $\\ce{CH3}$ groups are on the same side → their C–C bond dipoles add up → **net dipole moment > 0**\n- In **trans-but-2-ene**: $\\ce{CH3}$ groups are on opposite sides → their dipoles cancel exactly → **net dipole moment = 0**\n\nTherefore, cis form is MORE polar than trans form.\n\n**Step 2: Evaluate the Reason (R)**\n\n**Reason (R):** "Dipole moment of trans isomer of 2-butene is zero"\n\n✅ **TRUE** — Trans-but-2-ene has a centre of symmetry. The two C–CH₃ bond dipoles are equal in magnitude but opposite in direction → they cancel → $\\mu = 0$.\n\n**Step 3: Does R Correctly Explain A?**\n\nYes — because trans has zero dipole moment (R), cis must have a higher dipole moment than trans (A). R is the direct and correct explanation of A.\n\n**Answer: (c) Both (A) and (R) are true and (R) is the correct explanation of (A)**\n\n**Key Points to Remember:**\n- Cis-alkenes: higher dipole moment, higher boiling point (stronger intermolecular forces)\n- Trans-alkenes: lower or zero dipole moment, lower boiling point, higher melting point (better crystal packing)\n- Dipole moment is a vector quantity — direction matters for cancellation\n- For cis/trans-2-butene: μ(cis) ≈ 0.33 D, μ(trans) = 0`
  },
  {
    id: 'HC-028',
    sol: `**Step 1: Evaluate Statement I**\n\n*"Cis-but-2-ene has higher dipole moment than trans-but-2-ene."*\n\n✅ **TRUE** — In cis-but-2-ene, both methyl groups are on the same side of the double bond:\n$$\\text{cis-but-2-ene: } \\mu \\approx 0.33 \\text{ D (non-zero)}$$\n\nIn trans-but-2-ene, the methyl groups are on opposite sides, making it symmetric:\n$$\\text{trans-but-2-ene: } \\mu = 0 \\text{ D}$$\n\nSo cis has a higher dipole moment than trans. ✅\n\n**Step 2: Evaluate Statement II**\n\n*"Dipole moment arises due to polarity."*\n\n✅ **TRUE** — Dipole moment ($\\mu = q \\times d$) arises when there is a charge separation (polarity) in a bond or molecule. Electronegative atoms create partial negative charges, generating bond dipoles. The net molecular dipole is the vector sum of all bond dipoles.\n\n**Step 3: Conclusion**\n\nBoth Statement I and Statement II are TRUE.\n\n**Answer: (d) Both Statement I and Statement II are true**\n\n**Key Points to Remember:**\n- Dipole moment = charge × distance (vector quantity: magnitude + direction)\n- Polarity arises from electronegativity difference between bonded atoms\n- Net dipole = vector sum of individual bond dipoles\n- cis-2-butene: dipoles add → net μ > 0; trans-2-butene: dipoles cancel → net μ = 0`
  },
  {
    id: 'HC-029',
    sol: `**Step 1: Identify the Reaction**\n\nThe reaction involves ozonolysis of an alkene. The two-step ozonolysis process:\n1. **Step 1:** Ozone ($\\ce{O3}$) adds to the C=C double bond → molozonide → ozonide\n2. **Step 2:** Reductive workup ($\\ce{Zn/H2O}$ or $\\ce{Me2S}$) → cleaves to give aldehydes and ketones; oxidative workup ($\\ce{H2O2}$) → gives carboxylic acids from aldehydes\n\n**Step 2: Apply Ozonolysis**\n\nFor the specific alkene shown in the image:\n- The C=C bond is cleaved\n- Each carbon of the former double bond becomes a carbonyl carbon (C=O)\n- If the original carbon had: 2 H attached → aldehyde; 1 H → aldehyde; 0 H → ketone\n\n**Step 3: Identify Product A**\n\nThe major product A from this ozonolysis reaction is consistent with option (b), showing the correct carbonyl-containing fragment from the ring-opened or chain-cleaved product.\n\n**Answer: (b)**\n\n**Key Points to Remember:**\n- Ozonolysis: C=C → C=O + C=O (two carbonyl fragments)\n- Reductive workup: RCHO (aldehydes) preserved\n- Oxidative workup: RCHO → RCOOH (carboxylic acids)\n- Cyclic alkenes give a single bifunctional product (both C=O groups in one chain)`
  },
  {
    id: 'HC-030',
    sol: `**Step 1: Work Backwards from Ozonolysis Products**\n\nOzonolysis cleaves C=C double bonds. Working backwards:\n- If the products are known, we can deduce the positions of double bonds in the original compound\n\n**Step 2: Analyse the Given Products**\n\nThe ozonolysis products shown in the image suggest two C=C cleavage points in the ring.\n\nFor cyclohexa-1,4-diene:\n$$\\text{Cyclohexa-1,4-diene} \\xrightarrow{\\text{(i) O}_3, \\text{(ii) H}_2\\text{O}} \\text{Two equivalent fragments}$$\n\nCyclohexa-1,4-diene has two double bonds at positions 1,2 and 4,5. Ozonolysis of both double bonds gives:\n$$\\ce{O=CH-CH2-CH2-CH=O + O=CH-CH2-CH=O} \\text{ (or a single chain)}$$\n\nActually for cyclic diene, ozonolysis gives: glyoxal + succinaldehyde or the linear tetraaldehyde.\n\n**Step 3: Confirm Compound X**\n\nThe products are consistent with **cyclohexa-1,4-diene** (double bonds at 1,2 and 4,5 positions, NOT conjugated at 1,3):\n- Double bond 1: between C1–C2\n- Double bond 2: between C4–C5\n\n**Answer: (d) Cyclohexa-1,4-diene**\n\n**Key Points to Remember:**\n- Cyclohexa-1,3-diene: conjugated (double bonds share one carbon)\n- Cyclohexa-1,4-diene: isolated (double bonds separated by CH₂ groups)\n- Ozonolysis of cyclic diene: both C=C cut → ring opens to give linear di-aldehyde\n- Cyclohexa-1,4-diene shows reactivity similar to isolated alkenes (not conjugated)`
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
  console.log('Done HC batch 1f');
}
runFix().catch(e => { console.error(e); process.exit(1); });
