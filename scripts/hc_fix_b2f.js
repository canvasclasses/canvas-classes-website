// HC Fix Batch 2f: HC-056 to HC-060
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const fixes = [
  {
    id: 'HC-056',
    sol: `**Step 1: Understand Allylic Radical Stability**\n\nIn free radical halogenation, the most favourable compound (A) is the one that forms the most stable radical intermediate. The stability order of radicals is:\n$$\\text{Allylic} \\approx \\text{Tertiary} > \\text{Secondary} > \\text{Primary} > \\text{Methyl}$$\n\nAn **allylic radical** is exceptionally stable due to **resonance delocalisation**:\n$$\\ce{CH2=CH-\\dot{C}H-R <-> ^.CH2-CH=CH-R}$$\n\nThe radical is delocalised over two carbon atoms, providing extra stability.\n\n**Step 2: Identify Compound A**\n\nFor compound A to undergo easy free radical hydrogen replacement (e.g., bromination with NBS), the H being removed must be at an **allylic position** — i.e., adjacent to a C=C double bond.\n\nAmong the options given, the compound where the most stable allylic radical forms most easily is option **(b)**.\n\n**Step 3: Why Allylic Bromination is Favourable**\n\nNBS (N-bromosuccinimide) or Br₂ at low concentration selectively brominates allylic positions:\n1. Br· radical abstracts allylic H (low bond energy ~361 kJ/mol vs primary C-H ~410 kJ/mol)\n2. Allylic radical forms (stabilised by resonance)\n3. Br₂ attacks the radical → product + Br·\n\n**Answer: (b)**\n\n**Key Points to Remember:**\n- Allylic C–H bond is weak (≈361 kJ/mol) → easy H abstraction by radical\n- Allylic radical: resonance-stabilised; adjacent to C=C\n- NBS = selective allylic bromination reagent\n- Benzylic position has similar reactivity to allylic (both resonance-stabilised)`
  },
  {
    id: 'HC-057',
    sol: `**Step 1: Understand the Effect of -CF₃ Group**\n\n$\\ce{-CF3}$ (trifluoromethyl group) is a **very strong electron-withdrawing group (EWG)**:\n- Strong –I (inductive) effect through three electronegative F atoms\n- Destabilises adjacent positive charges (carbocations)\n\n**Step 2: Determine Regiochemistry with EWG**\n\nFor Markovnikov addition to $\\ce{CF3-CH=CH2}$:\n- Normal Markovnikov: H to C-1 (=CH₂), Br to C-2 (more substituted)\n- BUT $\\ce{-CF3}$ strongly destabilises the carbocation at C-2 via –I effect\n\nThe carbocation is MORE STABLE at C-1 (farther from –CF₃):\n$$\\ce{CF3-CH=CH2 + H+ -> CF3-\\dot{C}H-CH2 (unstable) OR CF3-CH2-CH2+ (secondary but farther from CF3)}$$\n\nThe secondary carbocation at C-1 ($\\ce{CF3-CH^+-CH3}$) — but this is next to CF₃ and DESTABILISED.\nThe primary carbocation at C-2 ($\\ce{CF3-CH2-CH2+}$) — primary but FAR from CF₃.\n\n**NET: Primary carbocation at C-2 is preferred** (less destabilised by CF₃) → **anti-Markovnikov product**.\n\n**Step 3: Identify Major Product**\n\n$$\\ce{CF3-CH=CH2 + HBr -> CF3-CH2-CH2Br (anti-Markovnikov)}$$\n\nBr goes to the terminal carbon (less substituted), H to the internal carbon.\n\n**Answer: (a) Anti-Markovnikov product**\n\n**Key Points to Remember:**\n- Strong EWG reverses Markovnikov selectivity (destabilises adjacent cation)\n- –CF₃ > –CCl₃ > –CHO as EWG by inductive effect\n- Result: Br goes to C farther from EWG (anti-Markovnikov)\n- Compare with EDG (-OCH₃, -OH): these push electrons to adjacent C → cation NEAR EDG is stabilised`
  },
  {
    id: 'HC-058',
    sol: `**Step 1: Identify the Multi-Step Reaction Sequence**\n\nFrom the solution hint, the sequence is:\n1. **HBr addition** to C=C double bond (Markovnikov addition) → alkyl bromide\n2. **Alc. KOH** → α,β-elimination (dehydrohalogenation) → conjugated diene\n3. **Enolisation** of the diene → stable aromatic product (phenol)\n\n**Step 2: Trace Each Step**\n\n**Step 1:** HBr + alkene (Markovnikov) → $\\ce{R-CHBr-CH3}$ (or similar)\n\n**Step 2:** Alc. KOH removes HBr → forms conjugated diene:\n$$\\ce{R-CHBr-CH3 + KOH(alc.) -> R-CH=CH2 + KBr + H2O}$$\n\nIf the compound has adjacent C=C after elimination, a **cyclohexadiene** may form.\n\n**Step 3:** Cyclohexadiene → **aromatisation** (loss of H₂) or **enolisation**:\n$$\\ce{Cyclohexadiene -> Phenol (via keto-enol tautomerism if C=O present)}$$\n\nThe diene undergoes tautomerisation/aromatisation to give the thermodynamically stable **phenol** (aromatic compound).\n\n**Answer: (b) Phenol (or substituted phenol)**\n\n**Key Points to Remember:**\n- HBr + alc. KOH sequence is a classic "add then eliminate" strategy\n- Consecutive eliminations can give dienes\n- Cyclohexadienol ↔ cyclohexadienone (tautomers) → aromatisation to phenol\n- Aromatisation is thermodynamically very favourable (benzene resonance energy ≈ 150 kJ/mol)`
  },
  {
    id: 'HC-059',
    sol: `**Step 1: Identify the Reaction**\n\nThe reaction involves an alkene treated with $\\ce{Cl2}$ followed by cyclisation. The two steps are:\n1. **Addition of Cl₂** to the double bond → 1,2-dichloride intermediate\n2. **Intramolecular cyclisation** to form a 6-membered ring\n\n**Step 2: Mechanism**\n\n**Step 1 — Anti addition of Cl₂:**\n$$\\ce{C=C + Cl2 -> cyclic chloronium ion -> anti addition -> 1,2-dichloride}$$\n\nThe anti addition gives a trans-1,2-dichloride.\n\n**Step 2 — Intramolecular cyclisation:**\nIf the molecule has a second nucleophilic site (e.g., an OH, NH₂, or another double bond), intramolecular displacement of one Cl forms a cyclic product.\n\nFor 6-membered ring formation (favoured by Baldwin's rules for exo-tet and endo-tet cyclisations), the appropriate nucleophile at the correct distance attacks the C–Cl bond.\n\n**Step 3: Identify Major Product**\n\nThe major product (b) shows a **6-membered ring** formed via intramolecular displacement after Cl₂ addition, consistent with the preferred ring size.\n\n**Answer: (b)**\n\n**Key Points to Remember:**\n- Cl₂ addition: anti (trans) via chloronium ion → 1,2-trans addition\n- Baldwin's rules: 6-endo-tet and 6-exo-tet both favoured\n- 5- and 6-membered rings preferred in intramolecular cyclisations\n- The leaving group (Cl) is displaced by internal nucleophile (OH, NH, etc.)`
  },
  {
    id: 'HC-060',
    sol: `**Step 1: Identify the Reaction — Ozonolysis**\n\nOzonolysis cleaves C=C double bonds:\n1. **Step 1:** $\\ce{O3}$ reacts with C=C → molozonide → rearranges to ozonide\n2. **Step 2:** Reductive workup ($\\ce{Zn/H2O}$ or $\\ce{Me2S}$) → aldehydes and/or ketones\n\n$$\\ce{R1R2C=CR3R4 ->[\\text{(i) O3; (ii) Zn/H2O}] R1R2C=O + R3R4C=O}$$\n\n**Step 2: Apply Ozonolysis to the Given Structure**\n\nFor the alkene in the image:\n- Each C of the double bond becomes a carbonyl carbon (C=O)\n- If the carbon had: H + R → aldehyde ($\\ce{RCHO}$)\n- If the carbon had: R + R' → ketone ($\\ce{R-CO-R'}$)\n- If the carbon had: H + H → formaldehyde ($\\ce{HCHO}$)\n\n**Step 3: Identify the Major Product**\n\nThe major product (a) shows the correct carbonyl fragment(s) from cleaving the specific alkene shown. With reductive workup, the aldehyde groups are preserved (not further oxidised).\n\n**Answer: (a)**\n\n**Key Points to Remember:**\n- Ozonolysis identifies original double bond positions by working backwards from products\n- $\\ce{Zn/H2O}$ (reductive) → aldehydes and ketones preserved\n- $\\ce{H2O2}$ or $\\ce{KMnO4}$ (oxidative) → aldehydes further oxidised to carboxylic acids\n- Cyclic alkene → single bifunctional product (both C=O groups in one molecule)`
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
  console.log('Done HC batch 2f');
}
runFix().catch(e => { console.error(e); process.exit(1); });
