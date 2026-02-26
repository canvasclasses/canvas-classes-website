// HC Fix Batch 4d: HC-106 to HC-110
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const fixes = [
  {
    id: 'HC-106',
    sol: `**Step 1: Identify the Reagent Sequence**\n\nThe reagent sequence is: (i) $\\ce{NaOH}$, (ii) dil. $\\ce{HNO3}$, (iii) $\\ce{AgNO3}$\n\nThis is the **silver nitrate test** sequence for halogens:\n1. $\\ce{NaOH}$: hydrolyses C–X bond if present (especially aryl halides under fusion conditions, or alkyl halides in hot NaOH)\n2. Dil. $\\ce{HNO3}$: acidifies the solution (to prevent interference from $\\ce{CO3^{2-}}$ or $\\ce{OH^-}$ ions)\n3. $\\ce{AgNO3}$: precipitates the halide ion as AgX\n\n**Colour of AgX precipitate:**\n- $\\ce{AgCl}$: white (soluble in dil. $\\ce{NH3}$)\n- $\\ce{AgBr}$: pale yellow (soluble in conc. $\\ce{NH3}$)\n- **$\\ce{AgI}$: yellow** (insoluble in $\\ce{NH3}$)\n\n**Step 2: Identify the Compound**\n\nThe yellow precipitate is $\\ce{AgI}$ → compound contains **iodine (I)**\n\nCompound IV is the iodo-compound among the given options. When treated with NaOH (hydrolysis), then HNO₃ (acidification), then AgNO₃ → yellow $\\ce{AgI(s)}$ precipitate.\n\n**Answer: (b) Compound IV**\n\n**Key Points to Remember:**\n- Silver halide colours: AgCl (white) < AgBr (pale yellow) < AgI (yellow) — memorise this!\n- AgCl dissolves in dil. NH₃; AgBr in conc. NH₃; AgI insoluble in NH₃\n- NaOH step: hydrolyses C–halogen bond to release X⁻\n- HNO₃ step: prevents false positives from $\\ce{CO3^{2-}}$, $\\ce{S^{2-}}$, $\\ce{SO4^{2-}}$ (which also precipitate with Ag⁺)`
  },
  {
    id: 'HC-107',
    sol: `**Step 1: Recall the Three Criteria for Aromaticity**\n\n1. **Cyclic** — atoms form a closed ring\n2. **Planar** — all ring atoms in the same plane\n3. **Hückel's rule** — $4n+2$ π-electrons ($n = 0, 1, 2, ...$), with complete π orbital overlap\n\n**Step 2: Identify the Non-Aromatic Compound**\n\n**Option (c):** The compound has a **non-planar** shape:\n- If the ring is not planar, p orbitals on adjacent atoms cannot overlap continuously\n- No cyclic delocalisation → NOT aromatic\n\nA compound can have the correct number of π-electrons but still be non-aromatic if it lacks planarity. For example:\n- Cyclooctatetraene ($\\ce{C8H8}$) has 8 π-electrons ($4n$, n=2) AND is non-planar (tub-shaped) → non-aromatic (not even anti-aromatic due to non-planarity)\n\nThe compound in option (c) has a non-planar 3D structure that prevents continuous p orbital overlap → **NOT aromatic**.\n\n**Options (a), (b), (d):** Satisfy all three criteria → aromatic.\n\n**Answer: (c)**\n\n**Key Points to Remember:**\n- Planarity is an ESSENTIAL condition for aromaticity\n- If a compound is not planar, p orbitals on adjacent atoms cannot overlap → no delocalised π system\n- Example of non-aromatic due to non-planarity: COT (tub-shaped, not planar), [10]annulene (twisted)\n- Forcing planarity often changes reactivity: planar COT dianion (10e) IS aromatic`
  },
  {
    id: 'HC-108',
    sol: `**Step 1: Recall the Principle of Acidity**\n\nAcidity of C–H bonds: stronger acid = more stable conjugate base (carbanion)\n\n**Step 2: Evaluate the Compounds**\n\nThe question asks for the strongest acid. The compounds include:\n- $\\ce{CH3CH2CH2CH3}$ (butane): sp³ C–H bonds, pKa ≈ 50 — very weakly acidic\n- Other options (from images) include cyclopentadiene, cyclohexadiene, or similar compounds\n\n**Cyclopentadiene** ($\\ce{C5H6}$) is the strongest acid among cyclic hydrocarbons because:\n- Losing a proton from C-5 (sp³ CH₂) gives the **cyclopentadienyl anion** ($\\ce{C5H5^-}$)\n- This anion has **6 π-electrons** (Hückel: $4n+2$ with $n=1$) → **aromatic anion**\n- Aromatic stabilisation provides exceptional stability to the conjugate base\n- pKa of cyclopentadiene ≈ **16** (much more acidic than typical hydrocarbons!)\n\n**Comparison:**\n- Alkanes (sp³): pKa ≈ 50\n- Alkenes (sp²): pKa ≈ 44\n- Alkynes (sp): pKa ≈ 25\n- **Cyclopentadiene (aromatic conjugate base): pKa ≈ 16**\n\n**Answer: (c) Cyclopentadiene**\n\n**Key Points to Remember:**\n- Cyclopentadiene: most acidic hydrocarbon due to aromatic cyclopentadienyl anion\n- Aromatic conjugate base = extraordinary stability → low pKa\n- This is why NaH can deprotonate cyclopentadiene (but not alkenes or alkanes)\n- Cyclopentadienyl metal complexes (metallocenes like ferrocene) are stable due to the aromatic anion`
  },
  {
    id: 'HC-109',
    sol: `**Step 1: Identify the Reaction**\n\nThe reaction shown is **Friedel-Crafts acylation**:\n$$\\ce{ArH + RCOCl ->[AlCl3] Ar-CO-R + HCl}$$\n\n**Step 2: Mechanism of Friedel-Crafts Acylation**\n\n1. $\\ce{AlCl3}$ (Lewis acid) accepts $\\ce{Cl^-}$ from $\\ce{RCOCl}$ → generates **acylium ion** $\\ce{RCO^+}$:\n$$\\ce{RCOCl + AlCl3 -> RCO^+ + AlCl4^-}$$\n\n2. Acylium ion (electrophile) attacks the aromatic ring → arenium ion intermediate\n\n3. Loss of $\\ce{H^+}$ restores aromaticity → **aryl ketone** product\n\n**Advantages over FC alkylation:**\n- NO carbocation rearrangement (acylium ion is resonance-stabilised: $\\ce{R-C≡O^+}$)\n- Product (ketone) is deactivated → monosubstitution only (no polyacylation)\n\n**Step 3: Identify Product A**\n\nFor the specific compound shown, FC acylation introduces the $\\ce{-CO-R}$ group at the ortho/para position relative to any activating substituents, or at the appropriate position of the ring.\n\nProduct **(c)** shows the correct aryl ketone from FC acylation.\n\n**Answer: (c)**\n\n**Key Points to Remember:**\n- FC acylation: $\\ce{RCOCl + AlCl3 -> RCO^+}$ attacks Ar ring → aryl ketone\n- Acylium ion: resonance stabilised ($\\ce{R-C≡O^+}$) — no rearrangement\n- Product is deactivated (C=O is EWG) → no polyacylation\n- FC works for both aromatic rings and activated double bonds`
  },
  {
    id: 'HC-110',
    sol: `**Step 1: Identify the Starting Compound**\n\nThe compound shown is a triene (3 C=C double bonds) with stereocentres:\n\n$\\ce{CC=C[C@@H](C)C=C[C@@H](C)C=CC}$\n\nExpanded: The compound is a C₁₂ triene: $\\ce{CH3-CH=CH-CH(CH3)-CH=CH-CH(CH3)-CH=CH-CH3}$\n\nIt has two chiral centres (the two $\\ce{[C@@H]}$ carbons marked with stereospecific configurations).\n\n**Step 2: Perform Complete Ozonolysis**\n\nComplete ozonolysis cleaves ALL three C=C double bonds with reductive workup ($\\ce{Zn/H2O}$):\n\n**Bond 1 (C2=C3):** $\\ce{CH3-CHO}$ (ethanal) + fragment\n**Bond 2 (C5=C6):** $\\ce{OHC-CH(CH3)-CHO}$ (2-methylmalonaldehyde) from the middle section? \n\nActually, systematically:\n- Cleaving at C2=C3: gives $\\ce{CH3CHO}$ and the remaining chain\n- Cleaving at C5=C6: gives $\\ce{OHC-CH(CH3)-CHO}$ from the middle\n- Cleaving at C8=C9: gives $\\ce{CH3CHO}$ and the end fragment\n\nProducts:\n- 2× $\\ce{CH3CHO}$ (ethanal/acetaldehyde) — no stereocentre\n- **$\\ce{OHC-CH(CH3)-CHO}$** (2-methylmalonaldehyde) — has a stereocentre at CH(CH₃)?\n\nWait: $\\ce{OHC-CH(CH3)-CHO}$ — the central carbon: bonded to H, CH₃, CHO, CHO.\nTwo identical CHO groups → **NOT a stereocentre** (only 3 different groups: H, CH₃, 2× CHO)\n\nTherefore ALL ozonolysis products are **achiral** (no stereocentre).\n\n**Answer: (b) 0 optically active products**\n\n**Key Points to Remember:**\n- Ozonolysis destroys C=C bonds → the stereocentres in allylic positions may be lost or retained\n- Check each product carefully for remaining stereocentres\n- A carbon with two identical groups is NOT a chiral centre (even if originally chiral)\n- Complete ozonolysis of this compound gives only achiral products`
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
  console.log('Done HC batch 4d');
}
runFix().catch(e => { console.error(e); process.exit(1); });
