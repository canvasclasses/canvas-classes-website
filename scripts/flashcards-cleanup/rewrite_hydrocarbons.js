/** Hydrocarbons rewrite — punchy, PYQ-inspired, mechanism-focused. */
const fs = require('fs');
const dotenv = require('dotenv'); dotenv.config({ path: '.env.local' });
const mongoose = require('mongoose');

const CHAPTER = { id: 'ch11_hydrocarbon', name: 'Hydrocarbons', category: 'Organic Chemistry' };
const SOURCE = 'Canvas Chemistry'; const CLASS_NUM = 11;
const ID_START = 1100; const STAMP = new Date(); const STAMP_KEY = '2026-06-18c';
const OLD_LO = 'FLASH-ORG-0644', OLD_HI = 'FLASH-ORG-0673';

const cards = []; const wishlist = []; let idCursor = ID_START;
function add(topic, order, q, a, difficulty, tags = [], diagram = null) {
  const id = `FLASH-ORG-${String(idCursor).padStart(4, '0')}`; idCursor++;
  cards.push({ flashcard_id: id, chapter: CHAPTER, topic: { name: topic, order }, question: q.trim(), answer: a.trim(), metadata: { difficulty, tags, source: SOURCE, class_num: CLASS_NUM, created_at: STAMP, updated_at: STAMP }, deleted_at: null });
  if (diagram) wishlist.push({ flashcard_id: id, topic, ...diagram });
}

const T1 = 'Classification & General Features';
add(T1, 1, 'Classify hydrocarbons.', '- Saturated: **Alkanes** ($C_nH_{2n+2}$)\n- Unsaturated: **Alkenes** ($C_nH_{2n}$), **Alkynes** ($C_nH_{2n-2}$)\n- **Aromatic** (benzene type, 4n+2 π e⁻)', 'easy', ['class']);
add(T1, 1, 'General formulas — alkane, alkene, alkyne, cycloalkane.', '| Class | Formula |\n|---|---|\n| Alkane | $C_nH_{2n+2}$ |\n| Alkene | $C_nH_{2n}$ |\n| Alkyne | $C_nH_{2n-2}$ |\n| Cycloalkane | $C_nH_{2n}$ (same as alkene!) |', 'easy', ['class']);
add(T1, 1, 'Degree of unsaturation (DoU) formula.', '$\\text{DoU} = \\dfrac{2C + 2 + N - H - X}{2}$\nEach DoU = 1 ring or 1 π bond.\nBenzene: 4 (ring + 3 π).', 'medium', ['class', 'shortcut']);

const T2 = 'IUPAC Nomenclature';
add(T2, 2, 'IUPAC steps for alkane name.', '1. **Longest continuous chain** → root\n2. Number from end giving **lowest locants**\n3. List substituents **alphabetically** (ignore di/tri)\n4. Combine: locant-prefix-root-suffix', 'medium', ['nomenclature']);
add(T2, 2, 'Locant priority for unsaturated/substituted alkenes?', 'C=C (or C≡C) gets **lowest locant first** — overrides lowest-locant rule for substituents.\n→ pent-**2**-ene (not pent-3-ene).', 'medium', ['nomenclature']);

const T3 = 'Alkanes — Preparation & Reactions';
add(T3, 3, 'Wurtz Reaction.', '$2R-X + 2Na \\xrightarrow{\\text{dry ether}} R-R + 2NaX$\nCouples two alkyl halides → symmetrical alkane with **doubled C count**.\nMixed R-X → mixture (3-way).', 'medium', ['alkane-prep'], { side: 'Answer', priority: 'Medium', description: '2 R-X + 2 Na → R-R + 2 NaX; show C-C bond formation.', notes: 'Reinforces coupling vs substitution.' });
add(T3, 3, 'Kolbe\'s electrolysis — product?', '$2RCOONa + 2H_2O \\xrightarrow{\\text{electrolysis}} R-R + 2CO_2 + 2NaOH + H_2$\nE.g. $CH_3COONa$ → ethane.', 'medium', ['alkane-prep']);
add(T3, 3, '**Why** are alkanes called "paraffins"?', 'Latin *parum affinis* = "low affinity". Unreactive toward acids, bases, oxidisers at room T (strong C–C, C–H, non-polar).', 'easy', ['alkane']);
add(T3, 3, 'Mechanism of alkane halogenation?', '**Free-radical substitution**. Need UV/heat.\n1. Initiation: $X_2 \\xrightarrow{h\\nu} 2X\\cdot$\n2. Propagation: $X\\cdot + RH \\to R\\cdot + HX$; $R\\cdot + X_2 \\to RX + X\\cdot$\n3. Termination', 'medium', ['alkane-rxn']);
add(T3, 3, '**Conceptual:** Halogenation reactivity order?', '$F_2 > Cl_2 > Br_2 > I_2$.\n$F_2$: violent (uncontrolled).\n$I_2$: doesn\'t react (endothermic, HI reverses).\nUse Cl₂ or Br₂ for control.', 'hard', ['alkane-rxn']);

const T4 = 'Alkenes — Preparation & Reactions';
add(T4, 4, 'Two key alkene preparations.', '1. **Dehydration** of alcohols (conc. $H_2SO_4$, $\\Delta$; E1 for 2°/3°)\n2. **Dehydrohalogenation** of alkyl halides (alc. KOH; E2)\nBoth follow **Saytzeff** (more substituted alkene preferred).', 'medium', ['alkene-prep']);
add(T4, 4, 'Markovnikov\'s Rule.', 'For HX addition to unsymmetrical alkene: **H to C with more H; X to C with fewer H.**\nMechanism via more stable carbocation.\nPropene + HBr → 2-bromopropane.', 'medium', ['markov']);
add(T4, 4, 'Peroxide (Kharasch) effect — what does it do?', '**Reverses Markovnikov** for **HBr only** (gives anti-Markovnikov product).\nMechanism switches polar → free-radical.\nPropene + HBr/peroxide → **1**-bromopropane.', 'medium', ['markov']);
add(T4, 4, '**PYQ:** Propene + HBr (a) without peroxide (b) with peroxide?', '(a) Markovnikov → $CH_3-CHBr-CH_3$ (2-bromopropane)\n(b) Anti-Markovnikov → $CH_3-CH_2-CH_2Br$ (1-bromopropane)\nPeroxide effect **HBr only** (not HCl or HI).', 'medium', ['markov', 'pyq']);
add(T4, 4, 'Ozonolysis — what does it do?', '$R_2C=CR_2\' \\xrightarrow{O_3,\\,Zn/H_2O} R_2C=O + O=CR_2\'$\n**Cleaves C=C → two carbonyls.** Identifies double-bond position.', 'medium', ['alkene-rxn']);
add(T4, 4, '**PYQ:** An alkene gives only acetone on ozonolysis. Identify.', 'Both fragments = acetone → both halves of C=C are $(CH_3)_2C=$.\n→ **2,3-dimethyl-2-butene** $(CH_3)_2C=C(CH_3)_2$.', 'medium', ['alkene-rxn', 'pyq']);
add(T4, 4, 'Hydroboration-oxidation — what\'s special?', '$R-CH=CH_2 \\xrightarrow{BH_3,\\,then\\,H_2O_2/OH^-} R-CH_2-CH_2-OH$\n**Anti-Markovnikov hydration** without peroxide. Gives primary alcohol from terminal alkene.', 'medium', ['alkene-rxn']);
add(T4, 4, 'Baeyer\'s test — reagent + observation.', 'Cold dilute alkaline $KMnO_4$ (pink/purple).\nPink **discharges** + diol forms → confirms C=C or C≡C.', 'medium', ['alkene-rxn']);
add(T4, 4, '**PYQ:** Alkene + cold dilute alkaline $KMnO_4$ → product?', '**Vicinal diol** (1,2-diol).\nE.g. ethene → ethylene glycol $CH_2(OH)-CH_2(OH)$.', 'medium', ['alkene-rxn', 'pyq']);

const T5 = 'Alkynes — Preparation & Reactions';
add(T5, 5, 'Lab preparation of ethyne (acetylene).', '$CaC_2 + 2H_2O \\to C_2H_2 + Ca(OH)_2$ (industrial).\nOr: alc. KOH on vicinal/geminal dihalide → alkyne.', 'medium', ['alkyne-prep']);
add(T5, 5, '**Why** are terminal alkynes acidic but alkanes/alkenes aren\'t?', 'sp-hybridised C: 50% s-character → orbital close to nucleus → $RC\\equiv C^-$ stable.\nAcidity order: **sp > sp² > sp³**.', 'medium', ['alkyne', 'acidity']);
add(T5, 5, 'Terminal alkyne + $Na$ / $NaNH_2$?', '$R-C\\equiv C-H + Na \\to R-C\\equiv C^-Na^+ + \\tfrac{1}{2}H_2$\nWith $NaNH_2$: gives acetylide + $NH_3$.\nUsed to extend carbon chain ($+ R\'X \\to RC\\equiv CR\'$).', 'medium', ['alkyne']);
add(T5, 5, 'Acidity order: $H_2O$, terminal alkyne, alkene, alkane (pKa).', '$H_2O$ (15.7) > $RC\\equiv CH$ (25) > alkene (44) > alkane (50).\nWhy $NaNH_2$ needed (NaOH not enough) to deprotonate alkyne.', 'medium', ['alkyne']);
add(T5, 5, 'Acetylene → benzene? Reagent.', '**Red-hot iron tube, 873 K** → polymerization of 3 acetylenes to benzene.\n$3C_2H_2 \\xrightarrow{Fe, 873K} C_6H_6$', 'medium', ['alkyne']);

const T6 = 'Aromaticity, Benzene & EAS';
add(T6, 6, 'Hückel\'s Rule + 3 other aromaticity conditions.', '$(4n+2)$ π electrons (n = 0, 1, 2...) **AND**:\n1. Cyclic\n2. Planar\n3. Fully conjugated (every ring atom has perpendicular p orbital)\n\nAll four required.', 'medium', ['aromatic']);
add(T6, 6, '**PYQ:** Aromatic, antiaromatic, or non-aromatic? Benzene, cyclobutadiene, cyclooctatetraene.', '- **Benzene** (6 π, planar): aromatic\n- **Cyclobutadiene** (4 π): antiaromatic (unstable)\n- **COT** (8 π): non-aromatic (puckers into tub to escape antiaromaticity)', 'medium', ['aromatic', 'pyq']);
add(T6, 6, 'Benzene — bond lengths, bond order, resonance energy.', '6 equivalent C–C, ~**139 pm** (between single 154 and double 134). BO = **1.5**.\nResonance energy ≈ **150 kJ/mol** — why benzene resists addition, prefers substitution.', 'medium', ['aromatic'], { side: 'Answer', priority: 'Medium', description: 'Two Kekulé structures + delocalized circle representation.', notes: 'Students often think benzene IS one Kekulé form.' });
add(T6, 6, 'Five EAS reactions of benzene — name + reagent.', '| Reaction | Reagent | Catalyst |\n|---|---|---|\n| Halogenation | $X_2$ | $FeX_3$ |\n| Nitration | $HNO_3$ | $H_2SO_4$ |\n| Sulphonation | $H_2SO_4$/$SO_3$ | — |\n| FC Alkylation | $R-Cl$ | $AlCl_3$ |\n| FC Acylation | $R-COCl$ | $AlCl_3$ |', 'medium', ['eas']);
add(T6, 6, 'EAS mechanism (general arrow flow).', '1. **Generate $E^+$** (with catalyst)\n2. π-electrons attack $E^+$ → **σ-complex** (arenium ion, aromaticity broken)\n3. Loss of $H^+$ → restores aromaticity\n\nSubstitution wins over addition because aromaticity is restored.', 'hard', ['eas'], { side: 'Answer', priority: 'High', description: 'EAS mechanism: benzene + E+ → cyclohexadienyl cation (broken aromaticity) → product + H+. Curved arrows for π attack and H+ loss.', notes: 'Foundation of organic chemistry; mechanism diagram essential.' });
add(T6, 6, 'Directing groups — activating o/p, deactivating m, halogen exception.', '- **Activating o/p:** $-OH, -NH_2, -OR, -R, -NR_2$\n- **Deactivating m:** $-NO_2, -COOH, -CHO, -SO_3H, -CN, -COR$\n- **Halogens** (X): deactivating BUT o/p (inductive vs resonance pull opposite)', 'hard', ['eas']);
add(T6, 6, '**Why** is $-NO_2$ meta but $-NH_2$ ortho/para?', '- $-NO_2$ withdraws by resonance at o/p → destabilizes σ-complex there → m preferred.\n- $-NH_2$ donates LP into ring (o/p) → stabilizes σ-complex at o/p → strongly favours those positions.\n\nThe substituent stabilizes/destabilizes the intermediate where resonance reaches.', 'hard', ['eas']);
add(T6, 6, '**PYQ:** Major product of toluene + $HNO_3/H_2SO_4$?', '**$o$- and $p$-nitrotoluene** (mixture; $-CH_3$ is activating, o/p directing).\nMinor: $m$-isomer.', 'medium', ['eas', 'pyq']);
add(T6, 6, '**PYQ trap:** Friedel-Crafts on nitrobenzene — works?', '**No.** $-NO_2$ is strongly deactivating; ring is too electron-poor for FC alkylation/acylation. Same for $-COOH, -SO_3H, -CN, -NH_3^+$.', 'hard', ['eas', 'pyq']);
add(T6, 6, '**Trap:** Friedel-Crafts on $-NH_2$ substituted benzene works directly?', '**No** — $-NH_2$ coordinates to $AlCl_3$ → deactivates catalyst.\nProtect $-NH_2$ as acetanilide first → then FC → then deprotect.', 'hard', ['eas']);

(async () => {
  console.log(`Prepared ${cards.length} cards (FLASH-ORG-${String(ID_START).padStart(4,'0')} → FLASH-ORG-${String(idCursor-1).padStart(4,'0')})`);
  const bad = cards.filter(c => /\$\$/.test(c.question) || /\$\$/.test(c.answer));
  if (bad.length) { console.error('$$'); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);
  const c = mongoose.connection.db.collection('flashcards');
  const exists = await c.find({ flashcard_id: { $in: cards.map(c=>c.flashcard_id) } }).toArray();
  if (exists.length) { console.error('COLLISION'); process.exit(1); }
  const oldDocs = await c.find({ flashcard_id: { $gte: OLD_LO, $lte: OLD_HI }, deleted_at: null }).toArray();
  fs.writeFileSync(`_agents/snapshots/flashcards_${CHAPTER.id}_rewrite_${STAMP_KEY}.json`, JSON.stringify(oldDocs.map(d=>({_id:d._id,flashcard_id:d.flashcard_id,deleted_at:null})), null, 2));
  const delRes = await c.updateMany({ flashcard_id: { $gte: OLD_LO, $lte: OLD_HI }, deleted_at: null }, { $set: { deleted_at: STAMP, deletion_reason: `${CHAPTER.id}-rewrite-2026-06-18` } });
  console.log(`Soft-deleted: ${delRes.modifiedCount}`);
  const insRes = await c.insertMany(cards, { ordered: true });
  console.log(`Inserted: ${insRes.insertedCount}`);
  console.log('Mix:', JSON.stringify(cards.reduce((a,c)=>{a[c.metadata.difficulty]=(a[c.metadata.difficulty]||0)+1;return a;},{})));
  fs.writeFileSync(`_agents/snapshots/flashcards_diagrams_wishlist_${CHAPTER.id}_rewrite.json`, JSON.stringify(wishlist, null, 2));
  console.log(`Wishlist: ${wishlist.length}`);
  await mongoose.disconnect();
})().catch(e=>{console.error(e);process.exit(1);});
