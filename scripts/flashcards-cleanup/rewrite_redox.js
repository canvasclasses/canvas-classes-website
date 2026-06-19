/** Redox Reactions rewrite. */
const fs = require('fs');
const dotenv = require('dotenv'); dotenv.config({ path: '.env.local' });
const mongoose = require('mongoose');

const CHAPTER = { id: 'ch11_redox', name: 'Redox Reactions', category: 'Physical Chemistry' };
const SOURCE = 'Canvas Chemistry'; const CLASS_NUM = 11;
const ID_START = 1600; const STAMP = new Date(); const STAMP_KEY = '2026-06-18c';
const OLD_LO = 'FLASH-PHY-0712', OLD_HI = 'FLASH-PHY-0732';

const cards = []; const wishlist = []; let idCursor = ID_START;
function add(topic, order, q, a, difficulty, tags = [], diagram = null) {
  const id = `FLASH-PHY-${String(idCursor).padStart(4, '0')}`; idCursor++;
  cards.push({ flashcard_id: id, chapter: CHAPTER, topic: { name: topic, order }, question: q.trim(), answer: a.trim(), metadata: { difficulty, tags, source: SOURCE, class_num: CLASS_NUM, created_at: STAMP, updated_at: STAMP }, deleted_at: null });
  if (diagram) wishlist.push({ flashcard_id: id, topic, ...diagram });
}

const T1 = 'Oxidation, Reduction & Electron Transfer';
add(T1, 1, 'Oxidation vs reduction (electronic).', '- **Oxidation:** loss of e⁻ (ON ↑)\n- **Reduction:** gain of e⁻ (ON ↓)\nMnemonic: **OIL RIG**.', 'easy', ['redox']);
add(T1, 1, 'Oxidising agent vs reducing agent — quick.', '- **Oxidising agent (oxidant):** gets reduced (grabs e⁻)\n- **Reducing agent (reductant):** gets oxidised (gives e⁻)\nAgent does the OPPOSITE to the other.', 'easy', ['redox']);
add(T1, 1, '**PYQ:** In $H_2 + Cl_2 \\to 2HCl$, identify oxidised, reduced, agents.', 'H: $0 \\to +1$ (oxidised) → $H_2$ is **reducing agent**.\nCl: $0 \\to -1$ (reduced) → $Cl_2$ is **oxidising agent**.', 'medium', ['redox', 'pyq']);

const T2 = 'Oxidation Number Rules';
add(T2, 2, '8 ON rules — quick reference.', '1. Element (uncombined): ON = 0\n2. Monatomic ion: ON = charge\n3. Group 1: +1; Group 2: +2\n4. F: always −1\n5. H: +1 (with non-metal); −1 (with metal)\n6. O: −2 (usually); peroxide −1; superoxide −½; $OF_2$ +2\n7. Sum in neutral cpd = 0\n8. Sum in polyatomic ion = its charge', 'medium', ['on']);
add(T2, 2, '**Trap:** ON of O in $H_2O_2$, $OF_2$, $KO_2$, $K_2O$.', '| Cpd | O\'s ON |\n|---|---|\n| $H_2O_2$ (peroxide) | **−1** |\n| $OF_2$ | **+2** (F pulls!) |\n| $KO_2$ (superoxide) | **−½** |\n| $K_2O$ (normal oxide) | **−2** |', 'hard', ['on']);
add(T2, 2, 'ON of S in $S_2O_3^{2-}$ (thiosulphate)?', '$2x + 3(-2) = -2 \\Rightarrow x = \\mathbf{+2}$ (average).\nReal structure: one S at +5, one at −1. Average = +2.', 'medium', ['on']);
add(T2, 2, '**Trap:** ON of Fe in $Fe_3O_4$?', '$3x + 4(-2) = 0 \\Rightarrow x = \\mathbf{+8/3}$.\n$Fe_3O_4 = FeO \\cdot Fe_2O_3$ (1 Fe²⁺ + 2 Fe³⁺). Non-integer average.', 'hard', ['on']);

const T3 = 'Disproportionation & Comproportionation';
add(T3, 3, 'Disproportionation — definition + classic example.', 'Same element **simultaneously oxidised AND reduced**.\n$3Cl_2 + 6NaOH \\to 5NaCl + NaClO_3 + 3H_2O$ (Cl: 0 → −1 *and* +5).', 'medium', ['disprop']);
add(T3, 3, '**Conceptual:** Which elements can disproportionate? Rule?', 'Element must have **≥ 3 oxidation states** (so its middle state can go up *and* down).\nE.g. Cl (−1, 0, +1, +5, +7), Mn, O. Na (only 0, +1) cannot.', 'medium', ['disprop']);
add(T3, 3, 'Other classic disproportionations.', '- $4H_3PO_3 \\to 3H_3PO_4 + PH_3$ (P: +3 → +5, −3)\n- $2H_2O_2 \\to 2H_2O + O_2$ (O: −1 → −2, 0)\n- $Cu^+ \\to Cu + Cu^{2+}$ in aqueous', 'medium', ['disprop']);
add(T3, 3, 'Comproportionation — definition.', 'Reverse of disproportionation: **two ONs combine to give one intermediate ON**.\n$5Cl^- + ClO_3^- + 6H^+ \\to 3Cl_2 + 3H_2O$ (−1, +5 → 0).', 'medium', ['comp']);

const T4 = 'Balancing Redox (Ion-Electron Method)';
add(T4, 4, 'Ion-electron method — acidic medium recipe.', '1. Split into two half-reactions.\n2. Balance atoms (other than O, H).\n3. Balance O with $H_2O$.\n4. Balance H with $H^+$.\n5. Balance charge with e⁻.\n6. Equalize e⁻ across halves, add.', 'medium', ['balancing']);
add(T4, 4, 'Basic medium — extra step.', 'After balancing as acidic, add equal $OH^-$ to both sides for every $H^+$.\nCombine $H^+ + OH^- \\to H_2O$. Cancel duplicate $H_2O$.', 'hard', ['balancing']);
add(T4, 4, 'Two conservation checks in balanced redox equation.', '1. **Mass** (atoms of each element)\n2. **Charge** (net charge both sides)\nForgetting charge balance is the classic error.', 'medium', ['balancing']);

const T5 = 'n-factor & Equivalent Weight in Redox';
add(T5, 5, 'n-factor in redox — what is it?', 'Number of **electrons gained or lost** per molecule/formula unit in the specific reaction.\n*Reaction-dependent* — same compound can have multiple n-factors.', 'medium', ['n-factor']);
add(T5, 5, '**Classic trap:** $KMnO_4$ in acidic, neutral, basic medium.', '| Medium | Mn change | n-factor | Eq. wt |\n|---|---|---|---|\n| Acidic | +7 → +2 | **5** | 31.6 |\n| Neutral | +7 → +4 ($MnO_2$) | **3** | 52.7 |\n| Basic | +7 → +6 ($MnO_4^{2-}$) | **1** | 158 |', 'hard', ['n-factor']);
add(T5, 5, '$K_2Cr_2O_7$ n-factor in acidic medium?', 'Cr: $+6 \\to +3$ (3 e⁻ per Cr) × 2 Cr = **6**. Eq. wt = 294/6 = 49.', 'medium', ['n-factor']);
add(T5, 5, 'Law of equivalence (titration).', '$\\mathbf{N_1 V_1 = N_2 V_2}$\nEquivalents of all reactants are equal at endpoint. Bakes in stoichiometry — no balanced equation needed.', 'medium', ['equivalent']);
add(T5, 5, '**PYQ:** $C_2O_4^{2-}$ (oxalate) reduces $MnO_4^-$ to $Mn^{2+}$. Find n-factor of oxalate.', 'C in oxalate: $+3 \\to +4$ (in $CO_2$), 1 e⁻ per C × 2 C = **2**. Eq. wt = 88/2 = 44.', 'hard', ['n-factor', 'pyq']);

const T6 = 'Common Redox Titrations';
add(T6, 6, 'Permanganate titration indicator?', '**Self-indicating** — purple $MnO_4^-$ → colourless $Mn^{2+}$. Endpoint = first persistent pink.', 'easy', ['titration']);
add(T6, 6, 'Dichromate titration indicator?', '**Diphenylamine** (or N-phenylanthranilic acid). Sharp blue-violet endpoint. (Self-indication fails: $Cr_2O_7^{2-}$ orange, $Cr^{3+}$ green — not sharp.)', 'medium', ['titration']);
add(T6, 6, 'Iodometric vs iodimetric — difference?', '- **Iodimetric (direct):** $I_2$ as titrant against reducing agent.\n- **Iodometric (indirect):** oxidiser liberates $I_2$ from $KI$; titrate $I_2$ with $Na_2S_2O_3$.\nBoth use **starch** indicator (blue with $I_2$, colourless without).', 'medium', ['titration']);
add(T6, 6, '**Why** add starch only near endpoint in iodometric titration?', 'Starch-iodine complex traps $I_2$ if added when $[I_2]$ high → delayed endpoint.\nAdd when solution is pale yellow → sharp endpoint with one drop.', 'medium', ['titration']);
add(T6, 6, '**PYQ:** 50 mL of 0.1 N FeSO₄ is titrated with $KMnO_4$ (in acid). Volume of 0.1 N $KMnO_4$ used?', '$N_1 V_1 = N_2 V_2 \\Rightarrow 0.1 \\times 50 = 0.1 \\times V$\n$V = \\mathbf{50}$ mL.\n(Note: Normality bakes in the 5 e⁻ transfer.)', 'medium', ['titration', 'pyq']);

(async () => {
  console.log(`Prepared ${cards.length} cards (FLASH-PHY-${String(ID_START).padStart(4,'0')} → FLASH-PHY-${String(idCursor-1).padStart(4,'0')})`);
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
