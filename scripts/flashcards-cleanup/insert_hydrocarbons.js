/**
 * Hydrocarbons (ch11_hydrocarbon) — Class 11 Organic Chemistry.
 * Switches to FLASH-ORG prefix (max before this batch: 0643).
 */
const fs = require('fs');
const dotenv = require('dotenv'); dotenv.config({ path: '.env.local' });
const mongoose = require('mongoose');

const CHAPTER = { id: 'ch11_hydrocarbon', name: 'Hydrocarbons', category: 'Organic Chemistry' };
const SOURCE = 'Canvas Chemistry';
const CLASS_NUM = 11;
const ID_START = 644;
const STAMP = new Date();

const cards = [];
const wishlist = [];
let idCursor = ID_START;
function add(topic, order, q, a, difficulty, tags = [], diagram = null) {
  const id = `FLASH-ORG-${String(idCursor).padStart(4, '0')}`;
  idCursor++;
  cards.push({
    flashcard_id: id,
    chapter: CHAPTER,
    topic: { name: topic, order },
    question: q.trim(),
    answer: a.trim(),
    metadata: { difficulty, tags, source: SOURCE, class_num: CLASS_NUM, created_at: STAMP, updated_at: STAMP },
    deleted_at: null,
  });
  if (diagram) wishlist.push({ flashcard_id: id, topic, ...diagram });
}

// ═══════════ T1: Classification & General Features ═══════════
const T1 = 'Classification & General Features';

add(T1, 1,
  'Classify hydrocarbons.',
  '**Hydrocarbons**\n├─ **Saturated:** **Alkanes** ($C_nH_{2n+2}$), only single bonds.\n├─ **Unsaturated:** \n│  ├─ **Alkenes** ($C_nH_{2n}$), at least one C=C.\n│  └─ **Alkynes** ($C_nH_{2n-2}$), at least one C≡C.\n└─ **Aromatic:** benzene + derivatives — special class (planar, conjugated, 4n+2 π electrons).',
  'easy', ['classification']);

add(T1, 1,
  '**General formula** — alkanes, alkenes, alkynes, cycloalkanes.',
  '- Alkanes: $C_nH_{2n+2}$\n- Alkenes (1 C=C): $C_nH_{2n}$\n- Alkynes (1 C≡C): $C_nH_{2n-2}$\n- Cycloalkanes (no double bond, ring): $C_nH_{2n}$ — *same* as alkenes (a ring "uses up" 2 H, like a C=C does).',
  'easy', ['classification', 'shortcut']);

add(T1, 1,
  '**Degree of unsaturation (DoU)** — formula and meaning.',
  '$\\text{DoU} = \\dfrac{2C + 2 + N - H - X}{2}$\n\nfor $C_xH_yN_aO_bX_z$. (Oxygen ignored.)\n\nEach DoU = one ring or one π-bond.\n- Alkane: 0.\n- Alkene/ring: 1.\n- Alkyne or 2 alkenes: 2.\n- Benzene: 4 (1 ring + 3 double bonds).',
  'medium', ['classification', 'shortcut']);

// ═══════════ T2: IUPAC Nomenclature ═══════════
const T2 = 'IUPAC Nomenclature';

add(T2, 2,
  '**Recipe** — Steps to write the IUPAC name of an alkane.',
  '1. Identify the **longest continuous carbon chain** → root name (-ane).\n2. Number the chain from the end that gives **lowest locants** to substituents.\n3. List substituents alphabetically (ignore di/tri/etc. when alphabetizing).\n4. Combine: locants-prefix-root-suffix.\n\nExample: 2-methylbutane (4-C chain, methyl on C2).',
  'medium', ['nomenclature']);

add(T2, 2,
  '**Conceptual gap:** Why is the longest-chain rule sometimes broken by the lowest-locant rule? Example.',
  'They are *sequential* rules — longest chain *first*, then lowest locant for substituents *on that chain*. If the longest chain has substituents at high positions, that\'s OK as long as the chain is genuinely the longest.\n\nWhere students slip: choosing a longer chain that passes through a branch instead of through the actual longest carbon path.',
  'medium', ['nomenclature', 'conceptual']);

add(T2, 2,
  'For unsaturated systems, where do the locants for the double/triple bond go?',
  'The chain must include the multiple bond; numbering must give the **double/triple bond the lowest possible locant**, *overriding* the lowest-locant rule for substituents.\n\nExample: pent-2-ene, not pent-3-ene (numbered from the end nearest the C=C).',
  'medium', ['nomenclature']);

// ═══════════ T3: Alkane Preparation & Reactions ═══════════
const T3 = 'Alkanes — Preparation & Reactions';

add(T3, 3,
  '**Wurtz Reaction** — equation and significance.',
  '$2\\,R-X + 2\\,Na \\xrightarrow{\\text{dry ether}} R-R + 2\\,NaX$\n\nCouples two alkyl halides to give a symmetrical alkane with **doubled carbon count**. Used to synthesize even-numbered, symmetrical alkanes (e.g. $2\\,CH_3I + 2Na \\to C_2H_6$).\n\nLimitation: mixing two different R–X gives a mixture (statistical 3-way product).',
  'medium', ['alkane-prep'],
  { side: 'Answer', priority: 'Medium', description: 'Wurtz reaction skeleton: 2 R-X → R-R + 2 NaX with Na and dry ether above arrow. Show the C-C bond formation visually.', notes: 'Helps students remember it\'s coupling, not substitution.' });

add(T3, 3,
  '**Kolbe\'s electrolysis** — equation and what it produces.',
  '$2\\,RCOONa + 2\\,H_2O \\xrightarrow{\\text{electrolysis}} R-R + 2\\,CO_2 + 2\\,NaOH + H_2$\n\nElectrolysis of a sodium carboxylate solution; at the anode, two R groups couple to give an alkane (after CO₂ loss). E.g. $CH_3COONa$ → $C_2H_6$.',
  'medium', ['alkane-prep']);

add(T3, 3,
  'Why are alkanes called "**paraffins**"?',
  'From Latin "parum affinis" = *low affinity*. Alkanes are unusually **unreactive** toward most reagents (acids, bases, oxidisers) at room temperature because C–C and C–H bonds are strong and non-polar.',
  'easy', ['alkane']);

add(T3, 3,
  '**Halogenation of alkanes** — mechanism class and required condition.',
  '**Free-radical substitution.** Requires UV light or heat (to homolyze $X-X$).\n\nThree steps:\n1. **Initiation:** $X_2 \\xrightarrow{h\\nu} 2X\\cdot$\n2. **Propagation:** $X\\cdot + RH \\to R\\cdot + HX$; then $R\\cdot + X_2 \\to RX + X\\cdot$\n3. **Termination:** $R\\cdot + X\\cdot \\to RX$ (or $R\\cdot + R\\cdot$).\n\nGives mixtures of mono/di/poly-halogenated products.',
  'medium', ['alkane-rxn']);

add(T3, 3,
  '**Conceptual gap:** Why does $F_2$ react explosively with alkanes but $I_2$ doesn\'t react at all?',
  '$F_2$: very weak F–F bond + very strong H–F bond → reaction violently exothermic → uncontrolled.\n\n$I_2$: very strong I–I bond + weak H–I bond → reaction is endothermic, very slow, *and* HI is a strong enough reducing agent to push the equilibrium back. So we use $Cl_2$ or $Br_2$ for controllable alkane halogenation.\n\nReactivity order: $F_2 > Cl_2 > Br_2 > I_2$.',
  'hard', ['alkane-rxn', 'conceptual']);

// ═══════════ T4: Alkene Preparation & Reactions ═══════════
const T4 = 'Alkenes — Preparation & Reactions';

add(T4, 4,
  '**Two key preparations** of alkenes.',
  '1. **Dehydration of alcohols** (acid-catalyzed, $E_1$ for 2°/3°):\n   $R-CH_2-CH_2OH \\xrightarrow{\\text{conc. } H_2SO_4, \\Delta} R-CH=CH_2 + H_2O$\n\n2. **Dehydrohalogenation** of alkyl halides (alcoholic KOH, $E_2$):\n   $R-CH_2-CH_2X \\xrightarrow{\\text{alc. KOH}} R-CH=CH_2 + HX$\n\nBoth follow **Saytzeff\'s rule** (more substituted alkene preferred).',
  'medium', ['alkene-prep']);

add(T4, 4,
  '**Markovnikov\'s Rule** — state it.',
  'When **HX** adds across a C=C of an *unsymmetrical* alkene, **H adds to the carbon with more H atoms**, and X to the carbon with fewer H atoms. (Polar mechanism via the more stable carbocation intermediate.)\n\nExample: propene + HBr → 2-bromopropane (not 1-bromo).',
  'medium', ['markovnikov']);

add(T4, 4,
  '**Peroxide effect (Kharasch effect)** — what does it do, and to which reagent does it apply?',
  '**Reverses Markovnikov\'s rule** — gives *anti-Markovnikov* product.\n\nApplies *only* to **HBr** (not HCl or HI). Mechanism switches from polar to free-radical (Br radical adds first to the less substituted C; then more stable C radical picks up H).\n\nExample: propene + HBr / peroxide → 1-bromopropane (anti-Markovnikov).',
  'medium', ['markovnikov', 'shortcut']);

add(T4, 4,
  '**What if** — Propene reacts with HBr (a) without peroxide, (b) with peroxide. Compare products.',
  '(a) Markovnikov: $CH_3-CHBr-CH_3$ (2-bromopropane) — Br on more substituted C.\n(b) Anti-Markovnikov: $CH_3-CH_2-CH_2Br$ (1-bromopropane) — Br on less substituted C.\n\nKey: peroxide effect only works for HBr (Cl is too strongly bonded to form free radicals; I is too weak).',
  'medium', ['markovnikov', 'application']);

add(T4, 4,
  '**Ozonolysis** — what does it tell you about an alkene?',
  '$R_2C=CR\'_2 \\xrightarrow{O_3, \\text{then } Zn/H_2O} R_2C=O + O=CR\'_2$\n\nCleaves the C=C and converts each carbon to a carbonyl group (ketone or aldehyde, depending on substitution).\n\n**Diagnostic use:** identify the *position* of a double bond by examining the carbonyl fragments produced.',
  'medium', ['alkene-rxn']);

add(T4, 4,
  '**What if** — An alkene on ozonolysis gives only acetone ($CH_3COCH_3$). What is the alkene?',
  '$(CH_3)_2C=C(CH_3)_2$ → 2,3-dimethyl-2-butene.\n\nReasoning: ozonolysis cuts a C=C into two carbonyl fragments. If *both* fragments are acetone, the alkene must be perfectly symmetric with two identical $(CH_3)_2C=$ halves.',
  'medium', ['alkene-rxn', 'application']);

add(T4, 4,
  '**Hydroboration-oxidation** — what is special about its regiochemistry?',
  '$R-CH=CH_2 \\xrightarrow{1.\\,BH_3 \\quad 2.\\,H_2O_2/OH^-} R-CH_2-CH_2-OH$\n\n**Anti-Markovnikov** addition of water (giving a 1° alcohol from a terminal alkene), without the need for peroxide. Cleaner alternative to HBr/peroxide for alcohol synthesis.',
  'medium', ['alkene-rxn']);

add(T4, 4,
  '**Baeyer\'s test** for unsaturation — reagent, observation, what it confirms.',
  'Reagent: dilute, alkaline cold $KMnO_4$ (pink/purple).\n\nObservation: pink color **discharges** if unsaturation (C=C or C≡C) is present; a *diol* (or further oxidation product) forms.\n\nUse: rapid lab test for whether a hydrocarbon is unsaturated.',
  'medium', ['alkene-rxn']);

// ═══════════ T5: Alkynes ═══════════
const T5 = 'Alkynes — Preparation & Reactions';

add(T5, 5,
  '**Lab preparation** of ethyne (acetylene).',
  '$CaC_2 + 2\\,H_2O \\to C_2H_2 + Ca(OH)_2$\n\nCalcium carbide + water gives acetylene gas. Industrial method.\n\nAlso: dehalogenation of vicinal/geminal dihalides with alcoholic KOH:\n$R-CHX-CHX-R\' \\xrightarrow{\\text{alc. KOH}} R-C\\equiv C-R\'$',
  'medium', ['alkyne-prep']);

add(T5, 5,
  '**Conceptual gap:** Why are terminal alkynes (1-alkynes) **acidic** while alkanes/alkenes are not?',
  '$\\equiv C-H$ has roughly $pK_a \\approx 25$ — vastly more acidic than alkanes ($pK_a \\approx 50$).\n\n**Reason:** the C in $\\equiv C-H$ is $sp$-hybridized → 50% s-character → orbital closer to nucleus → conjugate base ($RC\\equiv C^-$) is more stable (lone pair held in a low-energy $sp$ orbital).\n\nGeneral: $sp \\gg sp^2 \\gg sp^3$ acidity for C–H.',
  'medium', ['alkyne', 'acidity', 'conceptual']);

add(T5, 5,
  '**What if** — Reactions of terminal alkynes with $Na$ and with $NaNH_2$.',
  '$R-C\\equiv C-H + Na \\to R-C\\equiv C^- Na^+ + \\tfrac{1}{2}H_2$ (sodium acetylide).\n\nAlso $R-C\\equiv C-H + NaNH_2 \\to R-C\\equiv C^- Na^+ + NH_3$.\n\nUsed to extend carbon chains via nucleophilic substitution with $R\'X$: $R-C\\equiv C^- + R\'X \\to R-C\\equiv C-R\' + X^-$.',
  'medium', ['alkyne']);

add(T5, 5,
  '**Acidity order** — Rank: water, terminal alkyne, alkene, alkane.',
  '$H_2O$ (pKa ≈ 15.7) > terminal alkyne (≈25) > alkene (≈44) > alkane (≈50).\n\nAcidity decreases with decreasing s-character of the carbon bearing the H. This is why $NaNH_2$ (strong base) is needed to deprotonate alkynes — but NaOH can\'t.',
  'medium', ['alkyne', 'acidity']);

// ═══════════ T6: Aromaticity & Benzene ═══════════
const T6 = 'Aromaticity, Benzene & EAS';

add(T6, 6,
  'State **Hückel\'s rule** for aromaticity. What are the three other requirements?',
  '**Hückel\'s Rule:** $(4n+2)$ π electrons (n = 0, 1, 2, 3, ...) → aromatic.\n\n**Other requirements:**\n1. **Cyclic** (closed ring).\n2. **Planar** (all atoms in the ring lie in one plane).\n3. **Fully conjugated** (every ring atom must have a p-orbital perpendicular to the ring).\n\nAll four must hold. Miss any one → not aromatic.',
  'medium', ['aromaticity']);

add(T6, 6,
  '**What if** — Apply the aromaticity test to benzene (C₆H₆), cyclobutadiene (C₄H₄), cyclooctatetraene (C₈H₈).',
  '- **Benzene** ($C_6H_6$): cyclic ✓, planar ✓, conjugated ✓, 6 π e⁻ ($4n+2$ with n=1) ✓ → **aromatic**.\n- **Cyclobutadiene**: 4 π e⁻ ($4n$ with n=1) → **antiaromatic** (unstable).\n- **COT**: 8 π e⁻ ($4n$ with n=2). Would be antiaromatic if planar; instead it puckers into a tub shape → **non-aromatic**.',
  'medium', ['aromaticity', 'application']);

add(T6, 6,
  'Benzene resonance — what does it tell us about the structure?',
  'Benzene is a *resonance hybrid* of two Kekulé structures. All six C–C bonds have **identical length (~139 pm)** — intermediate between single (154) and double (134). Bond order = 1.5 on each.\n\nResonance energy ≈ 150 kJ/mol — that\'s the extra stability benzene has over hypothetical "1,3,5-cyclohexatriene." This is why benzene resists addition (which would destroy aromaticity) and prefers substitution.',
  'medium', ['aromaticity'],
  { side: 'Answer', priority: 'Medium', description: 'Two Kekulé structures of benzene side by side with double-headed resonance arrow between, plus a third representation showing the inscribed circle (delocalized π system). All three for the same molecule.', notes: 'Classic introduction — students often think benzene IS one Kekulé form.' });

add(T6, 6,
  '**Five EAS reactions** of benzene — name them with reagents.',
  '1. **Halogenation:** $C_6H_6 + X_2 \\xrightarrow{FeX_3} C_6H_5X$\n2. **Nitration:** $C_6H_6 + HNO_3 \\xrightarrow{H_2SO_4} C_6H_5NO_2$\n3. **Sulphonation:** $C_6H_6 + H_2SO_4 \\xrightarrow{\\text{(SO}_3\\text{ or fuming)}} C_6H_5SO_3H$\n4. **Friedel-Crafts Alkylation:** $C_6H_6 + R-Cl \\xrightarrow{AlCl_3} C_6H_5R$\n5. **Friedel-Crafts Acylation:** $C_6H_6 + R-COCl \\xrightarrow{AlCl_3} C_6H_5-CO-R$',
  'medium', ['eas']);

add(T6, 6,
  '**EAS mechanism — general arrow flow.**',
  '1. **Generate electrophile** ($E^+$) using catalyst. E.g. $Cl_2 + FeCl_3 \\to Cl^+ + FeCl_4^-$.\n2. **π-electron attack** on $E^+$ → forms a **sigma complex** (arenium ion / cyclohexadienyl cation) — aromaticity is *broken* here.\n3. **Loss of $H^+$** from the sp³ carbon → restores aromaticity → substituted benzene.\n\nKey insight: aromaticity is restored, not destroyed, by EAS — that\'s why substitution wins over addition.',
  'hard', ['eas'],
  { side: 'Answer', priority: 'High', description: 'EAS mechanism diagram: benzene + E+ → sigma complex (with broken aromaticity, drawn as cyclohexadienyl cation with one sp3 C bearing E and H) → product (aromaticity restored) + H+. Show curved arrows for π attack and H+ loss.', notes: 'Mechanism diagrams are the foundation of organic chemistry; impossible to convey without arrows.' });

add(T6, 6,
  '**Directing effects** — Activating vs deactivating; ortho/para vs meta directors. Give one example each.',
  '- **Activating o/p directors:** $-OH$, $-NH_2$, $-OR$, $-R$ (alkyl), $-NR_2$. Donate electrons → ring more reactive → new substituent at ortho/para.\n- **Deactivating m directors:** $-NO_2$, $-COOH$, $-CHO$, $-SO_3H$, $-CN$, $-COR$. Withdraw electrons → ring less reactive → new substituent at meta.\n- **Deactivating o/p directors (exception):** halogens (X) — deactivate by inductive effect but still send next group to o/p by resonance donation of lone pair.',
  'hard', ['eas', 'directing']);

add(T6, 6,
  '**Conceptual gap:** Why is $-NO_2$ a meta-director while $-NH_2$ is an o/p-director?',
  '- $-NO_2$ withdraws electrons by resonance from o/p positions → destabilizes the σ-complex at o/p → favours attack at m (where charge isn\'t on the C bearing $NO_2$).\n- $-NH_2$ donates electrons by resonance (lone pair into the ring) to o/p positions → stabilizes the σ-complex at o/p → strongly favours those positions.\n\nGeneral principle: *the substituent stabilizes the intermediate at the positions it can interact with by resonance*.',
  'hard', ['eas', 'directing', 'conceptual']);

// ─────── INSERT ───────
(async () => {
  console.log(`Prepared ${cards.length} cards for ch11_hydrocarbon (FLASH-ORG-${String(ID_START).padStart(4,'0')} → FLASH-ORG-${String(idCursor-1).padStart(4,'0')})`);
  const bad = cards.filter(c => /\$\$/.test(c.question) || /\$\$/.test(c.answer));
  if (bad.length) { console.error('$$', bad.map(b=>b.flashcard_id)); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);
  const c = mongoose.connection.db.collection('flashcards');
  const exists = await c.find({ flashcard_id: { $in: cards.map(c=>c.flashcard_id) } }).toArray();
  if (exists.length) { console.error('COLLISION', exists); process.exit(1); }
  if (process.argv.includes('--dry-run')) {
    console.log('Mix:', JSON.stringify(cards.reduce((a,c)=>{a[c.metadata.difficulty]=(a[c.metadata.difficulty]||0)+1;return a;},{})));
    console.log(`Wishlist: ${wishlist.length}`);
    await mongoose.disconnect(); return;
  }
  const res = await c.insertMany(cards, { ordered: true });
  console.log(`Inserted: ${res.insertedCount}`);
  console.log('Mix:', JSON.stringify(cards.reduce((a,c)=>{a[c.metadata.difficulty]=(a[c.metadata.difficulty]||0)+1;return a;},{})));
  fs.writeFileSync(`_agents/snapshots/flashcards_diagrams_wishlist_${CHAPTER.id}.json`, JSON.stringify(wishlist, null, 2));
  console.log(`Wishlist: ${wishlist.length} entries`);
  console.log(`ROLLBACK: db.flashcards.deleteMany({ flashcard_id: { $gte: "FLASH-ORG-${String(ID_START).padStart(4,'0')}", $lte: "FLASH-ORG-${String(idCursor-1).padStart(4,'0')}" } })`);
  await mongoose.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
