// POC Fix Batch 1c: POC-011 to POC-015 (options LaTeX fix + solutions)
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const fixes = [
  {
    id: 'POC-011',
    sol: `**Step 1: Properties of Essential Oils**\n\nEssential oils are steam-volatile organic compounds responsible for fragrance in flowers. Key characteristics:\n1. Steam volatile (appreciable vapour pressure)\n2. Generally insoluble in water at room temperature\n3. Miscible with water vapour in the vapour phase\n4. Heat-sensitive (decompose at elevated temperatures)\n\n**Step 2: Eliminate Wrong Options**\n\n**(a) Crystallisation** ❌ — Used for solid compounds by dissolving in a hot solvent and allowing recrystallisation on cooling. Essential oils are liquids — crystallisation is inapplicable.\n\n**(b) Distillation under reduced pressure** ❌ — Used for very high-bp, heat-sensitive compounds that cannot be distilled at atmospheric pressure. While essential oils are heat-sensitive, they are volatile enough that vacuum distillation is unnecessary and impractical for large-scale extraction from plant material.\n\n**(c) Distillation** ❌ — High temperature required would decompose the essential oils. Also inefficient for extracting oils embedded in plant tissue.\n\n**Step 3: Why Steam Distillation is the Correct Choice**\n\n**(d) Steam distillation** ✅\n\nPrinciple:\n$$P_{\\text{oil}} + P_{\\text{water}} = P_{\\text{atm}}$$\n\nThe mixture boils **below 100°C**, preventing thermal decomposition of the heat-sensitive oil.\n\nProcess:\n1. Steam passed through crushed flowers → oil vaporises with steam\n2. Mixed vapours condensed in a condenser\n3. Condensate: oil layer + water layer (immiscible)\n4. Oil separated from water using a separating funnel\n\n**Step 4: Conclusion**\n\nAnswer: **(d) Steam distillation**\n\n**Key Points to Remember:**\n- Both conditions required: steam-volatile AND water-immiscible\n- Examples: rose oil, lavender oil, eucalyptus oil, clove oil — all extracted industrially by steam distillation\n- Operating temperature always < 100°C (key advantage over direct distillation)\n- Separating funnel used to recover the oil from the condensate`
  },
  {
    id: 'POC-012',
    sol: `**Step 1: Requirements for a Good Adsorbent**\n\nAn adsorbent for chromatography must be:\n1. Chemically inert (must not react with compounds being separated)\n2. Porous with large surface area (for maximum adsorption)\n3. Available in appropriate polarity\n\n**Step 2: Evaluate Each Option**\n\n**A. Silica gel ($\\ce{SiO2 . xH2O}$)** ✅\n- Polar adsorbent with surface silanol ($\\ce{Si-OH}$) groups\n- Surface area: 200–600 m²/g\n- Standard adsorbent in column chromatography and TLC\n- Adsorption order: carboxylic acids > alcohols > ketones > esters > hydrocarbons\n\n**B. Alumina ($\\ce{Al2O3}$)** ✅\n- Polar adsorbent; available in acidic (pH 4–4.5), neutral (pH ~7), and basic (pH 9–10) forms\n- Surface area: 150–400 m²/g\n- Used for separating alkaloids, steroids, and pigments\n\n**C. Quick lime ($\\ce{CaO}$)** ❌\n- Too reactive — reacts with water (forming $\\ce{Ca(OH)2}$) and acidic organic compounds\n- Used as a drying agent and in cement manufacturing\n- NOT used in chromatography\n\n**D. Magnesia ($\\ce{MgO}$)** ❌\n- Not a standard chromatography adsorbent\n- Limited use in carotenoid separation only\n- Very rarely encountered; not relevant for JEE purposes\n\n**Step 3: Conclusion**\n\nOnly silica gel and alumina are standard adsorbents → Answer: **(c) A and B only**\n\n**Key Points to Remember:**\n- Silica gel: most widely used; available in various mesh sizes (60–230 mesh)\n- Alumina: three forms — acidic, neutral, basic (choose based on compound stability)\n- Quick lime and magnesia are NOT adsorbents for chromatography\n- Activated charcoal = non-polar adsorbent (used for decolorisation and separating non-polar compounds)`
  },
  {
    id: 'POC-013',
    sol: `**Step 1: Recall the $R_f$ Formula**\n\n$$R_f = \\frac{\\text{Distance moved by sample}}{\\text{Distance moved by solvent front}}$$\n\n**Step 2: Read TLC Data from the Figure**\n\n- Solvent front distance: 12.5 cm from baseline\n- Sample A spot: 5.0 cm from baseline\n- Sample C spot: 10.0 cm from baseline\n\n**Step 3: Calculate Individual $R_f$ Values**\n\n$$R_f(A) = \\frac{5.0}{12.5} = 0.4$$\n\n$$R_f(C) = \\frac{10.0}{12.5} = 0.8$$\n\n**Step 4: Calculate the Ratio and Convert**\n\n$$\\frac{R_f(A)}{R_f(C)} = \\frac{0.4}{0.8} = 0.5$$\n\nConverting to the required format $x \\times 10^{-2}$:\n$$0.5 = 50 \\times 10^{-2}$$\n\nTherefore $x = \\mathbf{50}$.\n\n**Key Points to Remember:**\n- Sample C (higher $R_f = 0.8$) → less polar → would elute **first** from a column\n- Sample A (lower $R_f = 0.4$) → more polar → would elute **last** from a column\n- In TLC, the spot that travels furthest = least polar compound\n- Column chromatography elution order (polar adsorbent): least polar compound exits first\n- Sample B at 6.5 cm → $R_f(B) = 0.52$ (intermediate polarity, elutes between C and A)`
  },
  {
    id: 'POC-014',
    sol: `**Step 1: Evaluate Statement A**\n\n*"Glycerol is purified by vacuum distillation because it decomposes at its normal boiling point."*\n\n✅ **CORRECT** — Glycerol (propane-1,2,3-triol) has bp = 290°C but decomposes at that temperature. Distillation under reduced pressure lowers the effective bp (e.g., to ~150°C at ~15 mmHg), allowing purification without decomposition.\n\n**Step 2: Evaluate Statement B**\n\n*"Aniline can be purified by steam distillation as aniline is miscible in water."*\n\n❌ **INCORRECT** — Aniline is **im**miscible with water (solubility: ~3.6 g/100 mL at 20°C). The requirement for steam distillation is that the compound be water-**immiscible**. Statement B gives the wrong reason — aniline qualifies for steam distillation precisely because it is immiscible, not miscible.\n\n**Step 3: Evaluate Statement C**\n\n*"Ethanol can be separated from ethanol-water mixture by azeotropic distillation because it forms an azeotrope."*\n\n✅ **CORRECT** — Ethanol-water forms a minimum-boiling azeotrope at 95.6% ethanol (bp = 78.1°C). Normal fractional distillation cannot exceed 95.6% ethanol (called rectified spirit). Azeotropic distillation (adding benzene or cyclohexane) breaks this azeotrope to yield absolute alcohol (100% ethanol).\n\n**Step 4: Evaluate Statement D**\n\n*"An organic compound is pure if mixed MP remains the same."*\n\n✅ **CORRECT** — The mixed melting point test: mixing the compound with a known pure sample. If the MP is unchanged → compound is pure (or identical to reference). Any impurity depresses the MP and broadens the melting range (eutectic mixture effect).\n\n**Correct Statements: A, C, D** → **Option (b)**\n\n**Key Points to Remember:**\n- Aniline + water → steam distillation (aniline is water-**im**miscible!)\n- Azeotrope: constant-boiling mixture that cannot be separated by normal distillation\n- Mixed MP test: melting point depression indicates impurity\n- Glycerol bp = 290°C → vacuum distillation; Glucose similarly uses vacuum distillation`
  },
  {
    id: 'POC-015',
    opts_fix: [
      { id: 'a', text: 'Organic compounds run faster than solvent in the thin layer chromatographic plate.', is_correct: false },
      { id: 'b', text: 'Non-polar compounds are retained at top and polar compounds come down in column chromatography.', is_correct: false },
      { id: 'c', text: '$R_f$ of a polar compound is smaller than that of a non-polar compound.', is_correct: true },
      { id: 'd', text: '$R_f$ is an integral value.', is_correct: false }
    ],
    sol: `**Step 1: Analyse Statement (a)**\n\n*"Organic compounds run faster than solvent in TLC"* ❌\n\nFalse. By definition, $R_f < 1$ always. The solvent front travels faster than any compound. If a compound moved at the same speed as the solvent, it would have $R_f = 1$ — meaning zero adsorption. In practice, compounds always interact with the adsorbent to some extent, so $R_f$ is always less than 1.\n\n**Step 2: Analyse Statement (b)**\n\n*"Non-polar compounds are retained at top; polar compounds come down in column chromatography"* ❌\n\nFalse — this is the exact opposite of reality. On a **polar adsorbent** (silica gel/alumina):\n- Polar compounds → stronger adsorption → move SLOWLY → retained higher up in the column\n- Non-polar compounds → weak adsorption → move FAST → elute first (exit at the bottom)\n\n**Step 3: Analyse Statement (c)**\n\n*"$R_f$ of a polar compound is smaller than that of a non-polar compound"* ✅\n\nTrue. On polar adsorbents (silica gel, alumina):\n- Polar compound → stronger adsorption → shorter distance traveled → lower $R_f$\n- Non-polar compound → weaker adsorption → longer distance traveled → higher $R_f$\n$$R_f(\\text{polar}) < R_f(\\text{non-polar})$$\n\n**Step 4: Analyse Statement (d)**\n\n*"$R_f$ is an integral value"* ❌\n\nFalse. $R_f$ is always a **decimal fraction** strictly between 0 and 1 (e.g., 0.4, 0.7, 0.82). It is never a whole number.\n\n**Conclusion:** Only statement (c) is correct → **Option (c)**\n\n**Key Points to Remember:**\n- $R_f$ range: 0 to 1 (decimal, never > 1, never an integer)\n- Solvent front always moves faster than any compound in TLC\n- Polar compound → stronger adsorption → lower $R_f$ → retained longer in column\n- Non-polar compound → weaker adsorption → higher $R_f$ → elutes first`
  }
];

async function runFix() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  for (const f of fixes) {
    const update = { $set: {} };
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
  console.log('Done batch 1c');
}
runFix().catch(e => { console.error(e); process.exit(1); });
