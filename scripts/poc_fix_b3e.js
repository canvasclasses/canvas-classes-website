// POC Fix Batch 3e: POC-081 to POC-085
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const fixes = [
  {
    id: 'POC-081',
    opts_fix: [
      { id: 'a', text: '$\\ce{CoCl3}$', is_correct: false },
      { id: 'b', text: '$\\ce{FeCl3}$', is_correct: true },
      { id: 'c', text: '$\\ce{FeCl2}$', is_correct: false },
      { id: 'd', text: '$\\ce{CoCl2}$', is_correct: false }
    ],
    sol: `**Step 1: Understand Potassium Ferrocyanide**\n\nPotassium ferrocyanide = $\\ce{K4[Fe(CN)6]}$\n- Ferrocyanide anion: $\\ce{[Fe(CN)6]^{4-}}$ (iron in +2 oxidation state)\n- It is a reducing agent (can reduce $\\ce{Fe^{3+}}$ to $\\ce{Fe^{2+}}$)\n\n**Step 2: The Prussian Blue Test**\n\n$$\\ce{FeCl3 + K4[Fe(CN)6] -> Prussian blue precipitate}$$\n\n$\\ce{Fe^{3+}}$ ions react with $\\ce{[Fe(CN)6]^{4-}}$ (ferrocyanide) to form the characteristic **Prussian blue** precipitate:\n$$\\ce{4Fe^{3+} + 3[Fe(CN)6]^{4-} -> Fe4[Fe(CN)6]3}$$\n\nThis reaction is the basis of:\n1. Lassaigne's test for nitrogen (NaCN → FeCN complex → Prussian blue with FeSO₄)\n2. Qualitative analysis of $\\ce{Fe^{3+}}$ ions\n\n**Step 3: Evaluate Each Option**\n\n| Salt | Cation | Gives Prussian Blue with $\\ce{K4[Fe(CN)6]}$? |\n|---|---|---|\n| $\\ce{CoCl3}$ | $\\ce{Co^{3+}}$ | ❌ — gives different colour |\n| **$\\ce{FeCl3}$** ✅ | **$\\ce{Fe^{3+}}$** | **✅ — Prussian blue** |\n| $\\ce{FeCl2}$ | $\\ce{Fe^{2+}}$ | ❌ — Turnbull's blue uses $\\ce{Fe^{2+}}$ + $\\ce{K3[Fe(CN)6]}$ |\n| $\\ce{CoCl2}$ | $\\ce{Co^{2+}}$ | ❌ — no Prussian blue |\n\n**Answer: (b) $\\ce{FeCl3}$**\n\n**Key Points to Remember:**\n- $\\ce{FeCl3}$ + $\\ce{K4[Fe(CN)6]}$ → **Prussian blue** (Lassaigne test basis)\n- $\\ce{FeCl2}$ + $\\ce{K3[Fe(CN)6]}$ → **Turnbull's blue** (same compound as Prussian blue!)\n- Prussian blue formula: $\\ce{Fe4[Fe(CN)6]3}$\n- $\\ce{Co^{2+}}$ + $\\ce{K4[Fe(CN)6]}$ → olive green to greenish precipitate (not blue)`
  },
  {
    id: 'POC-082',
    q: `Nitrogen can be estimated by Kjeldahl's method for which of the following compounds?\n\n(a) Nitrobenzene ($\\ce{C6H5NO2}$)\n\n(b) Benzylamine ($\\ce{C6H5CH2NH2}$)\n\n(c) Pyridine\n\n(d) Azobenzene ($\\ce{C6H5-N=N-C6H5}$)`,
    sol: `**Step 1: Recall Limitations of Kjeldahl's Method**\n\nKjeldahl's method CANNOT estimate nitrogen in compounds where nitrogen is:\n- In a **nitro group** ($\\ce{-NO2}$): too oxidised, does not convert to $\\ce{(NH4)2SO4}$\n- In a **nitrile group** ($\\ce{-C≡N}$): ring-strain nitrile nitrogen doesn't convert well\n- In an **azo group** ($\\ce{-N=N-}$): N–N bonds are not cleaved under Kjeldahl conditions\n- In **heteroaromatic rings** (pyridine, quinoline): aromatic C–N bonds too stable\n- In **diazonium salts**: unstable and reactive differently\n\nKjeldahl's method WORKS for:\n- **Amines** ($\\ce{-NH2}$, $\\ce{-NHR}$, $\\ce{-NR2}$)\n- **Amides** ($\\ce{-CONH2}$, $\\ce{-CONHR}$)\n- **Amino acids**\n\n**Step 2: Evaluate Each Compound**\n\n**(a) Nitrobenzene $\\ce{C6H5NO2}$** — Contains $\\ce{-NO2}$ group → Kjeldahl's method FAILS ❌\n\n**(b) Benzylamine $\\ce{C6H5CH2NH2}$** — Contains $\\ce{-NH2}$ (primary amine) → Kjeldahl's method WORKS ✅\n\n**(c) Pyridine** — N in heteroaromatic ring → Kjeldahl's method FAILS ❌\n\n**(d) Azobenzene $\\ce{C6H5-N=N-C6H5}$** — Contains $\\ce{-N=N-}$ azo group → Kjeldahl's method FAILS ❌\n\n**Step 3: Conclusion**\n\nAnswer: **(b) Benzylamine** — only this compound has nitrogen in a form (amine) that Kjeldahl's method can estimate.\n\n**Key Points to Remember:**\n- Kjeldahl works for: amines, amides, amino acids, proteins\n- Kjeldahl FAILS for: $\\ce{-NO2}$, $\\ce{-N=N-}$, $\\ce{-C≡N}$, aromatic ring N (pyridine)\n- Benzylamine: $\\ce{C6H5CH2NH2}$ — primary aliphatic amine attached to benzyl group\n- Mnemonic for Kjeldahl failures: "NAP" — Nitro, Azo, Pyridine-type`
  },
  {
    id: 'POC-083',
    sol: `**Step 1: What Can Sodium Fusion Extract Detect?**\n\nIn Lassaigne's test, the organic compound is fused with sodium metal. The covalently bonded heteroatoms are converted to ionic sodium compounds in the extract:\n\n| Element | Product | Detection |\n|---|---|---|\n| N | $\\ce{NaCN}$ | Prussian blue with $\\ce{FeSO4}$ |\n| S | $\\ce{Na2S}$ | Violet with sodium nitroprusside |\n| Cl | $\\ce{NaCl}$ | White ppt with $\\ce{AgNO3}$ |\n| Br | $\\ce{NaBr}$ | Pale yellow ppt with $\\ce{AgNO3}$ |\n| I | $\\ce{NaI}$ | Yellow ppt with $\\ce{AgNO3}$ |\n| P | $\\ce{Na3PO4}$ | Yellow ppt with $\\ce{HNO3}$ + $\\ce{(NH4)2MoO4}$ |\n\n**Step 2: What CANNOT Be Detected?**\n\n- **Oxygen:** Cannot form a distinct, stable sodium ionic compound from covalently bonded O. Na fusion does not give a specific test for O. $\\ce{C=O}$ groups don't give a detectable product.\n- **Carbon, Hydrogen:** These form $\\ce{CO2}$ and $\\ce{H2O}$ during fusion — no specific ionic test.\n\n**Step 3: Evaluate Each Option**\n\n| Option | Elements | Contains O? | Correct? |\n|---|---|---|---|\n| (a) Halogens, N, **O**, S | Yes — O included | ❌ (O not detected) |\n| **(b) S, N, P, Halogens** | No O | ✅ |\n| (c) P, **O**, N, Halogens | Yes — O included | ❌ |\n| (d) N, P, **C**, S | Yes — C included | ❌ |\n\n**Answer: (b) Sulphur, Nitrogen, Phosphorus, Halogens**\n\n**Key Points to Remember:**\n- Oxygen CANNOT be detected by Lassaigne's test\n- Carbon CANNOT be detected by Lassaigne's test\n- Hydrogen CANNOT be detected by Lassaigne's test\n- The four elements detectable: N, S, Halogens (Cl, Br, I), and P`
  },
  {
    id: 'POC-084',
    sol: `**Step 1: Understand the Purpose of the Pre-Treatment**\n\nIn Lassaigne's test, after sodium fusion, the extract may contain:\n- $\\ce{NaCN}$ (if N present)\n- $\\ce{Na2S}$ (if S present)\n- $\\ce{NaX}$ (if halogen present, X = Cl, Br, I)\n\nTo test for halogens, $\\ce{AgNO3}$ is added. The problem is that $\\ce{CN^-}$ and $\\ce{S^{2-}}$ ions would give interfering precipitates:\n- $\\ce{Ag^+ + CN^- -> AgCN (white ppt)}$ — looks identical to $\\ce{AgCl}$\n- $\\ce{2Ag^+ + S^{2-} -> Ag2S (black ppt)}$ — masks any halide precipitate\n\n**Step 2: Why Acidify with Nitric Acid?**\n\nAdding **dilute $\\ce{HNO3}$** (and boiling) decomposes $\\ce{NaCN}$ and $\\ce{Na2S}$:\n$$\\ce{NaCN + HNO3 -> HCN(g) + NaNO3}$$\n$$\\ce{Na2S + 2HNO3 -> H2S(g) + 2NaNO3}$$\n\nBoth $\\ce{HCN}$ and $\\ce{H2S}$ escape as gases. Only $\\ce{NaX}$ remains, and:\n$$\\ce{NaX + AgNO3 -> AgX (ppt) + NaNO3}$$\n\n**Step 3: Evaluate Each Option**\n\n| Option | Assessment |\n|---|---|\n| (a) $\\ce{NaOH}$  | Would make solution alkaline — $\\ce{AgOH}$ brown ppt would form, not halide test |\n| (b) $\\ce{HCl}$  | Would introduce $\\ce{Cl^-}$ → $\\ce{AgCl}$ precipitate regardless of halogen test → Wrong choice |\n| **(c) $\\ce{HNO3}$** ✅ | Decomposes $\\ce{CN^-}$ and $\\ce{S^{2-}}$; doesn't interfere with $\\ce{AgNO3}$ halide test |\n| (d) $\\ce{NH3}$  | Would dissolve $\\ce{AgCl}$ and $\\ce{AgBr}$ — would destroy the precipitate |\n\n**Answer: (c) Nitric acid**\n\n**Key Points to Remember:**\n- Never add HCl before AgNO₃ — it introduces Cl⁻ and invalidates the test!\n- HNO₃ is the ONLY acid that works here: it decomposes interfering ions AND doesn't introduce new interfering ions\n- Boil with HNO₃ to completely expel HCN and H₂S gases\n- $\\ce{NH3}$ is added AFTER the precipitate forms (to distinguish AgCl, AgBr, AgI)`
  },
  {
    id: 'POC-085',
    opts_fix: [
      { id: 'a', text: 'Carius method is used for the estimation of nitrogen in an organic compound.', is_correct: true },
      { id: 'b', text: 'Carius tube is used in the estimation of sulphur in an organic compound.', is_correct: false },
      { id: 'c', text: "Kjeldahl's method is used for the estimation of nitrogen in an organic compound.", is_correct: false },
      { id: 'd', text: 'Phosphoric acid produced on oxidation of phosphorus present in an organic compound is precipitated as $\\ce{Mg2P2O7}$ by adding magnesia mixture.', is_correct: false }
    ],
    sol: `**Step 1: Identify which statement is FALSE**\n\n**(a) "Carius method is used for the estimation of nitrogen in an organic compound."**\n\n❌ **FALSE** — The Carius method is used for the estimation of **halogens** and **sulphur**, NOT nitrogen. For nitrogen, the methods used are **Dumas' method** and **Kjeldahl's method**. Statement (a) is the false statement.\n\n**(b) "Carius tube is used in the estimation of sulphur in an organic compound."**\n\n✅ **TRUE** — The Carius method uses a thick-walled, sealed glass tube called a Carius tube. This tube is used for both halogen and sulphur estimation.\n\n**(c) "Kjeldahl's method is used for the estimation of nitrogen in an organic compound."**\n\n✅ **TRUE** — Kjeldahl's method is indeed used for nitrogen estimation. The compound is heated with conc. H₂SO₄ → $\\ce{(NH4)2SO4}$ → $\\ce{NH3}$ liberated → absorbed in acid → titrated.\n\n**(d) "Phosphoric acid produced on oxidation of phosphorus is precipitated as $\\ce{Mg2P2O7}$ by adding magnesia mixture."**\n\n✅ **TRUE** — $\\ce{H3PO4}$ + magnesia mixture ($\\ce{MgCl2}$ + $\\ce{NH4Cl}$ + $\\ce{NH3}$) → $\\ce{MgNH4PO4}$ (white ppt) → ignited → $\\ce{Mg2P2O7}$ (magnesium pyrophosphate). This is the standard gravimetric method for phosphorus estimation.\n\n**Step 2: Conclusion**\n\nThe FALSE statement is **(a)** — Carius method is for halogens/sulphur, NOT nitrogen.\n\n**Answer: (a)**\n\n**Key Points to Remember:**\n- Nitrogen estimation: Dumas' method + Kjeldahl's method\n- Halogen estimation: Carius method (AgX precipitate)\n- Sulphur estimation: Carius method (BaSO₄ precipitate)\n- Phosphorus estimation: Oxidise → $\\ce{H3PO4}$ → magnesia mixture → $\\ce{Mg2P2O7}$`
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
  console.log('Done batch 3e');
}
runFix().catch(e => { console.error(e); process.exit(1); });
