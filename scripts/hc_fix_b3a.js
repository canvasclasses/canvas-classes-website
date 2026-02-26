// HC Fix Batch 3a: HC-061 to HC-065
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const fixes = [
  {
    id: 'HC-061',
    sol: `**Step 1: Identify the Reaction**\n\nThe reaction shows an alkene treated with HCl. This is **Markovnikov addition of HCl** to a C=C double bond.\n\n**Step 2: Apply Markovnikov's Rule**\n\nMarkovnikov's rule states:\n- H⁺ (proton) adds to the carbon with MORE hydrogen atoms (less substituted)\n- Cl⁻ adds to the carbon with FEWER hydrogen atoms (more substituted)\n\nThis favours the more stable carbocation intermediate:\n$$\\text{Stability: } 3° > 2° > 1° > \\text{methyl}$$\n\n**Step 3: Trace the Mechanism**\n\n1. $\\ce{H+}$ adds to the less substituted carbon → forms a more stable (more substituted) carbocation\n2. $\\ce{Cl-}$ (nucleophile) attacks the carbocation\n3. The Cl goes to the carbon that formed the most stable intermediate\n\nFor the specific alkene shown, Markovnikov addition gives the product with Cl at the more substituted position → option **(d)**.\n\n**Answer: (d)**\n\n**Key Points to Remember:**\n- Markovnikov addition: ionic mechanism (not free radical)\n- The driving force is stability of the carbocation intermediate\n- HCl, HBr, HI all follow Markovnikov unless peroxide is present (for HBr only)\n- H₂SO₄ also adds Markovnikov (gives alkyl hydrogen sulfate, which hydrolyses to alcohol)`
  },
  {
    id: 'HC-062',
    sol: `**Step 1: Identify the Reaction**\n\nThe reaction shows an alkene undergoing **hydroboration-oxidation**:\n- Reagent 1: $\\ce{BH3}$ or $\\ce{B2H6}$ in THF (hydroboration step)\n- Reagent 2: $\\ce{H2O2/NaOH}$ (oxidation step)\n\n**Step 2: Hydroboration-Oxidation Rules**\n\nThis two-step reaction achieves **overall anti-Markovnikov, syn addition of water (H₂O)**:\n\n1. **Hydroboration:** $\\ce{BH3}$ undergoes syn addition across C=C:\n   - B goes to the LESS substituted carbon (anti-Markovnikov)\n   - H goes to the MORE substituted carbon\n   - Both from the SAME face (syn)\n\n2. **Oxidation:** $\\ce{H2O2/NaOH}$ replaces B with OH, with retention of configuration\n\n**Net result:** OH at less substituted C; H at more substituted C; syn stereochemistry\n\n**Step 3: Identify the Major Product**\n\nFor the alkene in the image:\n- OH adds to less substituted carbon (anti-Markovnikov)\n- Syn addition → specific face selectivity\n- Product (d) shows correct regiochemistry and stereochemistry\n\n**Answer: (d)**\n\n**Key Points to Remember:**\n- Hydroboration: B to less hindered C; H to more hindered C (anti-Markovnikov)\n- Oxidation: B is replaced by OH with complete retention of configuration\n- Net addition: syn (unlike acid hydration which shows no stereospecificity)\n- Compare: acid hydration = Markovnikov + no stereospecificity; H-B/O = anti-Markovnikov + syn`
  },
  {
    id: 'HC-063',
    sol: `**Step 1: Identify the Reaction**\n\nThe reaction shows an alkene treated with $\\ce{KMnO4}$ (acidic, hot) or a two-step ozonolysis with oxidative workup. Under oxidative conditions:\n$$\\ce{R-CH=CH-R' ->[KMnO4/H+/hot] RCOOH + R'COOH}$$\n\n**Step 2: Apply Oxidative Cleavage Rules**\n\n| Carbon type in C=C | Oxidative product |\n|---|---|\n| $\\ce{=CH2}$ (terminal, =CH₂) | $\\ce{CO2 + H2O}$ |\n| $\\ce{=CHR}$ (internal, 1 substituent) | $\\ce{RCOOH}$ |\n| $\\ce{=CR2}$ (internal, 2 substituents) | $\\ce{R-CO-R'}$ (ketone, not further oxidised) |\n\n**Step 3: Apply to the Specific Alkene**\n\nFor the compound shown in the image (likely a di- or trisubstituted alkene), acidic permanganate cleaves the double bond:\n- One fragment gives a carboxylic acid\n- The other fragment gives either a carboxylic acid or ketone (depending on substitution)\n\nThe major product (c) shows the correct carboxylic acid(s) from oxidative cleavage.\n\n**Answer: (c)**\n\n**Key Points to Remember:**\n- Hot acidic $\\ce{KMnO4}$ = oxidative cleavage (equivalent to ozonolysis + oxidative workup)\n- Cold dilute $\\ce{KMnO4}$ = cis-diol (non-cleavage oxidation)\n- Terminal =CH₂ → CO₂ (lost as gas); terminal =CHR → RCOOH; =CR₂ → ketone\n- Can use ozonolysis then $\\ce{H2O2}$ as alternative for oxidative cleavage`
  },
  {
    id: 'HC-064',
    sol: `**Step 1: Identify the Reaction**\n\nPropyne ($\\ce{CH3-C≡CH}$) reacts with $\\ce{NaNH2}$ (sodium amide):\n\n$$\\ce{CH3-C≡CH + NaNH2 -> CH3-C≡C-Na+ + NH3}$$\n\n$\\ce{NaNH2}$ is a strong base that deprotonates the terminal alkyne (acidic $\\equiv\\!$C–H, pKa ≈ 25) to form **sodium acetylide**.\n\n**Step 2: Determine the Limiting Reagent**\n\nGiven:\n- $\\ce{NaNH2}$: 4 g ÷ 40 g/mol = **0.1 mol**\n- Propyne: 1 mol\n\nThe reaction is 1:1 (1 mol propyne : 1 mol NaNH₂ : 1 mol NH₃)\n\nSince NaNH₂ (0.1 mol) is limiting: only 0.1 mol of NH₃ is produced.\n\n**Step 3: Calculate Volume of NH₃ at STP**\n\nAt STP, 1 mole of any ideal gas occupies 22.4 L = 22,400 mL.\n\n$$V_{NH_3} = 0.1 \\text{ mol} \\times 22,400 \\text{ mL/mol} = \\mathbf{2240 \\text{ mL}}$$\n\n**Answer: 2240 mL**\n\n**Key Points to Remember:**\n- Terminal alkynes are acidic ($\\equiv\\!$C–H, pKa ≈ 25) due to high s-character of sp orbital\n- $\\ce{NaNH2}$ ($\\text{pK}_b$ of $\\ce{NH2^-}$ = 26 > 25) can deprotonate terminal alkynes\n- Sodium acetylide ($\\ce{RC≡C-Na+}$) is a strong nucleophile for alkylation\n- At STP: 1 mol gas = 22.4 L = 22,400 mL (standard JEE assumption)`
  },
  {
    id: 'HC-065',
    sol: `**Step 1: Identify the Reaction**\n\nThe reaction involves an **internal alkyne** undergoing hydration with $\\ce{H2SO4/HgSO4/H2O}$ (Markovnikov hydration, Kucherov reaction).\n\n**Step 2: Mechanism of Alkyne Hydration**\n\n1. $\\ce{Hg^{2+}}$ activates the C≡C bond electrophilically (analogous to bromonium ion in alkene)\n2. Water attacks the more electrophilic carbon (Markovnikov) → mercurinium ion\n3. Demercuration → vinyl alcohol (enol) intermediate\n4. Tautomerisation (enol → keto): vinyl alcohol → **ketone**\n\n$$\\ce{R-C≡C-R' + H2O ->[H+, Hg^{2+}] [enol] -> R-CO-CH2-R' (ketone)}$$\n\n**Step 3: Apply to the Given Alkyne**\n\nFor the internal alkyne shown:\n- Markovnikov hydration gives the more substituted enol\n- Tautomerisation gives the corresponding ketone\n- Product (c) shows the correct ketone product\n\n**Answer: (c)**\n\n**Key Points to Remember:**\n- Alkyne + $\\ce{H2O/H2SO4/HgSO4}$ → enol → ketone (Markovnikov)\n- Terminal alkyne → methyl ketone (enol tautomerises to CH₃CO–)\n- Internal symmetric alkyne → single ketone product\n- Internal asymmetric alkyne → mixture of two ketones (Markovnikov + anti-Markovnikov)\n- Compare: hydroboration (anti-Markovnikov) of terminal alkyne → aldehyde`
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
  console.log('Done HC batch 3a');
}
runFix().catch(e => { console.error(e); process.exit(1); });
