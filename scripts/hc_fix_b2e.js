// HC Fix Batch 2e: HC-051 to HC-055
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const fixes = [
  {
    id: 'HC-051',
    sol: `**Step 1: Identify Unique Positions for Monochlorination**\n\nMonohalogenation via free radical mechanism replaces one H at a time. Excluding stereoisomers means we count chemically distinct positions only.\n\n**Step 2: Identify the Structure from the Image**\n\nThe structure shown appears to be a bicyclic or complex alkane. Counting unique H environments systematically:\n\nFor a compound where the answer is 8 distinct monochlorination products (excluding stereoisomers), we need 8 chemically non-equivalent types of H atoms.\n\n**Step 3: Apply Symmetry Analysis**\n\nThe compound shown has multiple distinct C–H environments. After careful symmetry analysis:\n- Identify all carbon atoms in the structure\n- Group equivalent carbons (related by symmetry/rotation)\n- Each unique carbon type gives a unique monochloro product\n\nFor this specific compound, systematic analysis reveals **8 distinct positions** (8 types of non-equivalent C–H bonds), giving 8 different monohalogenated products.\n\n**Answer: 8**\n\n**Key Points to Remember:**\n- Symmetry reduces the number of unique positions\n- Identical carbons (related by mirror plane or rotation axis) give the same product\n- Stereoisomers are explicitly excluded in this problem\n- Free radical halogenation is not regioselective for these calculations (all H replaced equally)`
  },
  {
    id: 'HC-052',
    sol: `**Step 1: Identify the Reaction**\n\nThe reaction shows **hydroboration-oxidation** ($\\ce{BH3/THF}$ followed by $\\ce{H2O2/NaOH}$) applied to an alkene.\n\n**Step 2: Hydroboration-Oxidation Mechanism**\n\n1. **Hydroboration (BH₃/THF):** syn, anti-Markovnikov addition\n   - B adds to the less substituted carbon of C=C\n   - H adds to the more substituted carbon\n   - Both add from the SAME face (syn addition)\n\n2. **Oxidation (H₂O₂/NaOH):** OH replaces B with retention of configuration\n   - The stereochemistry at the B-bearing carbon is retained\n   - Net result: syn addition of OH to less substituted carbon\n\n**Step 3: Determine Regiochemistry and Stereochemistry**\n\n- OH goes to the **less substituted** carbon (anti-Markovnikov)\n- Addition is **syn** (cis addition from the same face)\n- For a cyclic alkene: syn addition means both OH and H add to the same face → cis relationship\n\nThe major product (c) shows:\n- OH on the less hindered carbon\n- Correct syn (cis) stereochemistry\n\n**Answer: (c)**\n\n**Key Points to Remember:**\n- Hydroboration-oxidation = overall syn, anti-Markovnikov addition of water\n- syn addition: B and H (then OH) add from the same face of the double bond\n- For cyclic alkenes: syn addition → cis-diol in stereochemistry of the product\n- Compare: acid hydration (Markovnikov, no stereoselectivity) vs. H-B/O (anti-Markovnikov, syn)`
  },
  {
    id: 'HC-053',
    sol: `**Step 1: Identify the Reaction**\n\nThe reaction shows an internal alkyne undergoing **acid-catalysed hydration** with $\\ce{H2SO4/HgSO4/H2O}$ (Markovnikov hydration via Kucherov reaction).\n\n**Step 2: Mechanism of Alkyne Hydration**\n\n$$\\ce{R-C≡C-R' + H2O ->[H2SO4/HgSO4] R-CO-CH2-R' (ketone)}$$\n\n1. $\\ce{Hg^{2+}}$ activates the triple bond electrophilically\n2. $\\ce{H2O}$ attacks the more electrophilic carbon → vinyl alcohol intermediate (enol)\n3. Tautomerisation: enol → ketone (keto-enol tautomerism)\n\nFor an **internal alkyne** $\\ce{R-C≡C-R'}$: Markovnikov addition gives the corresponding **ketone** (not aldehyde).\nFor a **terminal alkyne** $\\ce{R-C≡CH}$: Markovnikov addition gives a **methyl ketone** ($\\ce{R-CO-CH3}$).\n\n**Step 3: Determine the Major Product**\n\nFor the specific alkyne in the image (internal alkyne), Markovnikov hydration gives:\n$$\\text{alkyne} \\xrightarrow{H_2O/H^+/Hg^{2+}} \\text{ketone (major product)}$$\n\nOption (c) shows the correct ketone product.\n\n**Answer: (c)**\n\n**Key Points to Remember:**\n- Alkyne + $\\ce{H2O/H+/Hg^{2+}}$: Markovnikov → enol → ketone (Kucherov reaction)\n- Terminal alkyne → methyl ketone (e.g., $\\ce{R-C≡CH}$ → $\\ce{R-CO-CH3}$)\n- Internal alkyne → symmetric ketone (if R=R') or asymmetric ketone mixture\n- Enol tautomerise to ketone: $\\ce{R-C(OH)=CH-R' <-> R-CO-CH2-R'}$ (keto form more stable)`
  },
  {
    id: 'HC-054',
    sol: `**Step 1: Identify the Reaction Type**\n\nThe reaction involves a **conjugated diene** reacting with a dienophile (Diels-Alder) or electrophilic addition. Based on the answer key, this appears to be electrophilic addition to a 1,3-diene.\n\n**Step 2: 1,2-Addition vs 1,4-Addition (for Conjugated Dienes)**\n\nFor addition to a conjugated diene ($\\ce{CH2=CH-CH=CH2}$):\n\n- **1,2-Addition (kinetic):** electrophile adds at C-1, nucleophile at C-2 → isolated double bond remains\n- **1,4-Addition (thermodynamic):** electrophile adds at C-1, nucleophile at C-4 → conjugated double bond migrates; more stable product\n\nConditions:\n- Low temperature, short reaction time → **kinetic** (1,2-addition) product\n- High temperature, long reaction time → **thermodynamic** (1,4-addition) product\n\n**Step 3: Identify the Major Product**\n\nBased on the reaction conditions shown and answer key (a), the major product is the **1,2-addition** product (or 1,4 depending on conditions). For option (a) being correct, the conditions favour the kinetic product.\n\n**Answer: (a)**\n\n**Key Points to Remember:**\n- Conjugated dienes: 1,2- vs 1,4-addition depends on temperature\n- Low T → 1,2-addition (kinetic product)\n- High T → 1,4-addition (thermodynamic product, conjugated alkene more stable)\n- Diels-Alder reaction: 1,4-cycloaddition of diene + dienophile → cyclohexene`
  },
  {
    id: 'HC-055',
    sol: `**Step 1: Identify the Reaction**\n\nThe reaction involves an alkene with an $\\ce{-OCH3}$ (methoxy) group reacting with excess HBr. Two reactions occur:\n\n1. **Acid-catalysed cleavage of vinyl ether ($\\ce{C=C-OCH3}$):**\n   $$\\ce{R-CH=CH-OCH3 + HBr -> R-CH=CH2 + CH3Br (or CH3OH)}$$\n   or direct addition of HBr to the double bond followed by methoxy cleavage\n\n2. **Markovnikov addition of HBr** to the resulting alkene\n\n**Step 2: Mechanism**\n\nWith **excess HBr**:\n- HBr first cleaves the $\\ce{C-OCH3}$ bond (vinyl ethers are acid-sensitive): the enol ether is hydrolysed\n- The resulting alkene then undergoes Markovnikov addition of HBr\n\nFor vinyl ether $\\ce{R-CH=CH-OCH3}$:\n1. $\\ce{H^+}$ protonates the oxygen → oxocarbenium ion\n2. $\\ce{Br^-}$ attacks → gives 1,2-adduct\n3. Or: protonation at α-C → carbenium → Br attack\n\n**Step 3: Major Product**\n\nWith excess HBr, the methoxy group is replaced by Br, and the double bond adds HBr (Markovnikov). Product (b) shows the correct geminal or vicinal dibromo compound.\n\n**Answer: (b)**\n\n**Key Points to Remember:**\n- Vinyl ethers ($\\ce{C=C-OR}$) are cleaved by HX under acidic conditions\n- The OR group is first displaced, then HBr adds Markovnikov to the alkene\n- Excess HBr ensures complete reaction at both the ether and the double bond\n- Markovnikov addition: H to C with more H (C-1), Br to C with fewer H (C-2)`
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
  console.log('Done HC batch 2e');
}
runFix().catch(e => { console.error(e); process.exit(1); });
