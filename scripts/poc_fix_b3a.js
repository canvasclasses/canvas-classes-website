// POC Fix Batch 3a: POC-061 to POC-065
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const fixes = [
  {
    id: 'POC-061',
    opts_fix: [
      { id: 'a', text: '$\\ce{N2H4 . HCl}$', is_correct: true },
      { id: 'b', text: '$\\ce{CH3NH2 . HCl}$', is_correct: false },
      { id: 'c', text: '$\\ce{NH4Cl}$', is_correct: false },
      { id: 'd', text: '$\\ce{NH2OH . HCl}$', is_correct: false }
    ],
    sol: `**Step 1: Understand the Requirements for a Positive Lassaigne's Test for BOTH N and Halogen**\n\nFor a compound to give positive Lassaigne's test for:\n- **Nitrogen:** The compound must contain nitrogen in organic covalent form so that Na fusion converts it to $\\ce{NaCN}$ → gives Prussian blue with $\\ce{FeSO4}$\n- **Halogen:** The compound must contain a halogen in organic covalent form so that Na fusion converts it to $\\ce{NaX}$ → gives precipitate with $\\ce{AgNO3}$\n\n**Step 2: The Critical Requirement — Organic vs Ionic**\n\nThe key is that **both N and X must be covalently bonded** to carbon, so that Na fusion is needed to convert them to ionic form.\n\nCompounds where N or X are already in ionic form (e.g., salts like $\\ce{NH4Cl}$, $\\ce{CH3NH3Cl}$) may not require Na fusion and may not give the standard positive test in the same way.\n\n**Step 3: Evaluate Each Option**\n\n**(a) $\\ce{N2H4.HCl}$ (Hydrazine hydrochloride)** ✅\n- $\\ce{N2H4.HCl}$ is an organic compound with N (in $\\ce{N-N}$ bond as hydrazinium) and Cl (as $\\ce{Cl^-}$)\n- The nitrogen from the $\\ce{N2H4}$ moiety can produce $\\ce{NaCN}$ on sodium fusion\n- The Cl is present as ionic $\\ce{Cl^-}$ which will give AgCl precipitate with $\\ce{AgNO3}$\n- Gives BOTH nitrogen AND halogen tests ✅\n\n**(b) $\\ce{CH3NH2.HCl}$ (Methylamine hydrochloride)** — Similar reasoning; N is present + Cl is ionic. Could also give both tests. But answer key says (a) only.\n\n**(c) $\\ce{NH4Cl}$** — Inorganic salt. N and Cl both ionic already — Na fusion gives $\\ce{NaCN}$? No, $\\ce{NH4Cl}$ gives $\\ce{NH3}$ on heating, not $\\ce{NaCN}$. Does NOT give positive nitrogen test. ❌\n\n**(d) $\\ce{NH2OH.HCl}$ (Hydroxylamine hydrochloride)** — N is present but in $\\ce{N-OH}$ form; Cl is ionic. Does not give $\\ce{NaCN}$ efficiently on fusion.\n\n**Step 4: Conclusion**\n\nAnswer: **(a) $\\ce{N2H4.HCl}$**\n\n**Key Points to Remember:**\n- $\\ce{NH4Cl}$ is INORGANIC — does NOT give Lassaigne's nitrogen test\n- For Lassaigne's test: nitrogen must be covalently bonded in organic compound\n- $\\ce{N2H4.HCl}$: organic N (from $\\ce{N2H4}$) + ionic Cl (from HCl salt) — gives both tests\n- Pure inorganic salts do not give Lassaigne's test`
  },
  {
    id: 'POC-062',
    sol: `**Step 1: Understand the Dumas' Method Apparatus**\n\nIn Dumas' method, the sequence of processes in the combustion tube is:\n1. Organic compound is heated with excess $\\ce{CuO}$ → produces $\\ce{CO2}$, $\\ce{H2O}$, and $\\ce{N2}$ (plus any $\\ce{NOx}$ oxides if N is present)\n2. The gas mixture exits the CuO section\n3. The gases are passed over **copper gauze** (reduced copper)\n4. Then passed through KOH solution (which absorbs $\\ce{CO2}$ and $\\ce{H2O}$)\n5. Only $\\ce{N2}$ remains and is collected in the nitrometer\n\n**Step 2: Why Copper Gauze?**\n\nDuring heating with CuO, some nitrogen oxides ($\\ce{NO}$, $\\ce{NO2}$) may be formed:\n$$\\ce{N + excess CuO -> NOx}$$\n\nThe gases are passed over **hot copper gauze** to reduce these nitrogen oxides back to $\\ce{N2}$:\n$$\\ce{NOx + Cu (gauze) -> N2 + CuO}$$\n\nThis ensures that ALL nitrogen is collected as $\\ce{N2}$ and the volume measured accurately.\n\n**Step 3: Evaluate Each Option**\n\n| Option | Reason it would be wrong |\n|---|---|\n| (a) Ni | Nickel is not used in this step |\n| **(b) Copper gauze** ✅ | Reduces NOₓ → N₂; ensures complete N₂ collection |\n| (c) Pd | Palladium is not used in Dumas' method |\n| (d) Copper oxide | CuO is already in the first stage; excess CuO would re-oxidise the gases |\n\n**Step 4: Conclusion**\n\nAnswer: **(b) Copper gauze**\n\n**Key Points to Remember:**\n- Dumas' method sequence: CuO oxidation → copper gauze (reduce NOₓ) → KOH absorption → nitrometer\n- Copper gauze ensures NOₓ → N₂ (prevents under-collection of N₂)\n- The nitrometer collects N₂ over KOH solution (not water, since CO₂ must be absorbed)\n- Final measurement: volume of N₂ at temperature T and pressure P`
  },
  {
    id: 'POC-063',
    difficulty: 'Hard',
    q: `0.400 g of an organic compound (X) gave 0.376 g of AgBr in Carius method for estimation of bromine. % of bromine in the compound (X) is ______.\n(Given: Molar mass AgBr = 188 g mol⁻¹, Br = 80 g mol⁻¹)`,
    sol: `**Step 1: Recall the Carius Method Formula for Bromine**\n\nIn the Carius method:\n$$\\ce{Organic-Br + HNO3(fuming) -> HBr}$$\n$$\\ce{HBr + AgNO3 -> AgBr(v)}$$\n\n$$\\%Br = \\frac{80}{188} \\times \\frac{m_{AgBr}}{m_{\\text{compound}}} \\times 100$$\n\n**Step 2: Substitute the Given Values**\n\n- $m_{AgBr}$ = 0.376 g\n- $m_{\\text{compound}}$ = 0.400 g\n- Molar mass of AgBr = 188 g/mol\n- Molar mass of Br = 80 g/mol\n\n$$m_{Br} = \\frac{80}{188} \\times 0.376 = \\frac{80 \\times 0.376}{188} = \\frac{30.08}{188} = 0.16 \\text{ g}$$\n\n**Step 3: Calculate the Percentage**\n\n$$\\%Br = \\frac{0.16}{0.400} \\times 100 = \\frac{16}{40} \\times 100 = \\mathbf{40\\%}$$\n\n**Answer: 40%**\n\n**Key Points to Remember:**\n- Bromine formula: $\\%Br = \\frac{80}{188} \\times \\frac{m_{AgBr}}{m_{\\text{compound}}} \\times 100$\n- The fraction $\\frac{80}{188} \\approx 0.4255$ is the mass fraction of Br in AgBr\n- Verify: 0.376 × 80/188 = 0.160 g Br; 0.160/0.400 × 100 = 40% ✓\n- For Cl: use 35.5/143.5; for I: use 127/235`
  },
  {
    id: 'POC-064',
    difficulty: 'Hard',
    q: `In sulphur estimation, 0.471 g of an organic compound gave 1.4439 g of barium sulphate. The percentage of sulphur in the compound is ______ (Nearest integer). (Given: Atomic mass Ba: 137 u, S: 32 u, O: 16 u)`,
    sol: `**Step 1: Recall the Sulphur Estimation Formula**\n\nIn the Carius method for sulphur:\n$$\\ce{S ->[\text{fuming HNO3}] H2SO4 ->[\text{BaCl2}] BaSO4(v)}$$\n\n$$\\%S = \\frac{32}{233} \\times \\frac{m_{BaSO_4}}{m_{\\text{compound}}} \\times 100$$\n\nWhere molar mass of $\\ce{BaSO4}$ = 137 + 32 + 4(16) = 137 + 32 + 64 = **233 g/mol**\n\n**Step 2: Calculate Mass of Sulphur in BaSO₄**\n\nGiven: $m_{BaSO_4}$ = 1.4439 g\n\n$$m_S = \\frac{32}{233} \\times 1.4439 = \\frac{46.205}{233} = 0.1983 \\text{ g}$$\n\n**Step 3: Calculate the Percentage**\n\n$m_{\\text{compound}}$ = 0.471 g\n\n$$\\%S = \\frac{0.1983}{0.471} \\times 100 = 42.1\\% \\approx \\mathbf{42\\%}$$\n\n**Answer: 42** (nearest integer)\n\n**Key Points to Remember:**\n- BaSO₄ molar mass = 233 g/mol (137 + 32 + 64)\n- Sulphur formula: $\\%S = \\frac{32}{233} \\times \\frac{m_{BaSO_4}}{m_{\\text{compound}}} \\times 100$\n- The fraction $\\frac{32}{233} \\approx 0.1373$\n- Carius method for S: sealed Carius tube + fuming HNO₃ → BaSO₄ precipitate (gravimetric)`
  },
  {
    id: 'POC-065',
    sol: `**Step 1: Identify the Products of Phenol + Dilute HNO₃**\n\nPhenol reacts with dilute $\\ce{HNO3}$ (cold, dilute) to produce two structural isomers:\n- **o-nitrophenol** (ortho-nitrophenol)\n- **p-nitrophenol** (para-nitrophenol)\n\nThese two compounds are structural isomers with very similar properties, making simple separation methods ineffective.\n\n**Step 2: Evaluate Each Separation Method**\n\n**(a) Chromatographic separation** ✅\nChromatography (column chromatography) separates compounds based on differential adsorption. Despite having similar structures, o-nitrophenol and p-nitrophenol have **different polarities** due to intramolecular vs intermolecular hydrogen bonding:\n- **o-nitrophenol:** Forms intramolecular H-bond (less polar, lower bp = 214°C)\n- **p-nitrophenol:** Forms intermolecular H-bond (more polar, higher bp = 279°C)\nThis polarity difference allows chromatographic separation. For large-scale use, column chromatography is most efficient.\n\n**(b) Fractional crystallisation** ❌\nBoth isomers have different melting points (o: 45°C, p: 113°C) — crystallisation is possible but NOT the most efficient for large scale separation of closely related compounds.\n\n**(c) Steam distillation** ❌\nWhile o-nitrophenol is steam-volatile (due to intramolecular H-bonding, low intermolecular association), this technique is NOT suitable for large-scale production.\n\n**(d) Sublimation** ❌\nNeither compound sublimes significantly at convenient conditions.\n\n**Step 3: Conclusion**\n\nAnswer: **(a) Chromatographic separation**\n\n**Key Points to Remember:**\n- o-nitrophenol: intramolecular H-bond → less polar → lower bp → more volatile → higher $R_f$\n- p-nitrophenol: intermolecular H-bond → more polar → higher bp → less volatile → lower $R_f$\n- Chromatography separates based on polarity differences — ideal for structural isomers\n- Note: steam distillation CAN separate them but NOT on large scale`
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
    if (f.opts_fix) {
      f.opts_fix.forEach((o, i) => {
        update.$set[`options.${i}.text`] = o.text;
        update.$set[`options.${i}.is_correct`] = o.is_correct;
      });
    }
    const res = await col.updateOne({ display_id: f.id }, update);
    console.log(`${f.id}: matched=${res.matchedCount}, modified=${res.modifiedCount}`);
  }
  await mongoose.disconnect();
  console.log('Done batch 3a');
}
runFix().catch(e => { console.error(e); process.exit(1); });
