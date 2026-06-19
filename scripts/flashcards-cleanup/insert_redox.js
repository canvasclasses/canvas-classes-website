/**
 * Redox Reactions (ch11_redox) — Class 11 Physical Chemistry.
 * FLASH-PHY (continues 0711 → ).
 */
const fs = require('fs');
const dotenv = require('dotenv'); dotenv.config({ path: '.env.local' });
const mongoose = require('mongoose');

const CHAPTER = { id: 'ch11_redox', name: 'Redox Reactions', category: 'Physical Chemistry' };
const SOURCE = 'Canvas Chemistry';
const CLASS_NUM = 11;
const ID_START = 712;
const STAMP = new Date();

const cards = [];
const wishlist = [];
let idCursor = ID_START;
function add(topic, order, q, a, difficulty, tags = [], diagram = null) {
  const id = `FLASH-PHY-${String(idCursor).padStart(4, '0')}`;
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

// ═══════════ T1: Concepts of Oxidation & Reduction ═══════════
const T1 = 'Oxidation, Reduction & Electron Transfer';

add(T1, 1,
  'Modern (electronic) definition of **oxidation** and **reduction**.',
  '- **Oxidation:** **loss** of electrons by a species. Oxidation number *increases*.\n- **Reduction:** **gain** of electrons by a species. Oxidation number *decreases*.\n\nMnemonic: **OIL RIG** — Oxidation Is Loss (of electrons), Reduction Is Gain.\n\nReplaces older definitions (oxidation = addition of O / removal of H; reduction = opposite), which fail for many redox reactions without O or H.',
  'easy', ['redox', 'definitions']);

add(T1, 1,
  '**Oxidising agent** vs **reducing agent** — define each.',
  '- **Oxidising agent (oxidant):** the species that gets *reduced* (gains electrons) → causes the *other* species to get oxidised.\n- **Reducing agent (reductant):** the species that gets *oxidised* (loses electrons) → causes the *other* species to get reduced.\n\nTrick: the oxidiser is the *electron grabber*; the reducer is the *electron donor*.',
  'easy', ['redox']);

add(T1, 1,
  '**Conceptual gap:** In $H_2 + Cl_2 \\to 2HCl$, what is oxidised, reduced, the oxidising agent, and the reducing agent?',
  'Oxidation numbers: $H$ goes $0 \\to +1$ (oxidised); $Cl$ goes $0 \\to -1$ (reduced).\n\n- $H_2$ is oxidised → it is the **reducing agent**.\n- $Cl_2$ is reduced → it is the **oxidising agent**.\n\nKey: the *agent* gets the *opposite* change of its action. Easy to flip — keep "agent does what to the OTHER" in mind.',
  'medium', ['redox', 'conceptual']);

// ═══════════ T2: Oxidation Number Rules ═══════════
const T2 = 'Oxidation Number Rules';

add(T2, 2,
  'List the **8 standard rules** for assigning oxidation numbers.',
  '1. Free element (uncombined) → ON = 0.\n2. Monatomic ion → ON = its charge.\n3. **Group 1** in compounds → +1; **Group 2** → +2.\n4. **F** in compounds → always −1.\n5. **H** → usually +1 (with non-metals); −1 with metals (hydrides like NaH).\n6. **O** → usually −2; exceptions: peroxides ($H_2O_2$, $-1$), superoxides ($KO_2$, $-1/2$), $OF_2$ ($+2$).\n7. Sum of ONs in a neutral compound = 0.\n8. Sum of ONs in a polyatomic ion = its charge.',
  'medium', ['oxidation-no']);

add(T2, 2,
  '**Trap card:** Oxidation number of O in $H_2O_2$, $OF_2$, $KO_2$, $K_2O$.',
  '- $H_2O_2$ (peroxide): O = **−1** (each O shares O–O bond with another O; only one bond to H).\n- $OF_2$: O = **+2** (F is the most EN; pulls electrons → O is positive).\n- $KO_2$ (superoxide): O = **−1/2** (one extra e⁻ shared by two O atoms).\n- $K_2O$ (regular oxide): O = −2.\n\nO\'s ON spans **−2 to +2** depending on partner — a classic trap.',
  'hard', ['oxidation-no']);

add(T2, 2,
  '**What if** — Find oxidation number of S in $S_2O_3^{2-}$ (thiosulphate).',
  'Let ON of S = $x$. Sum: $2x + 3(-2) = -2 \\implies 2x = 4 \\implies x = +2$.\n\n*Average* ON of S in thiosulphate is **+2**, but the two S atoms in $S_2O_3^{2-}$ are actually *non-equivalent* (one is +5, one is −1). Average rule gives the convenient bookkeeping number.',
  'medium', ['oxidation-no', 'application']);

add(T2, 2,
  '**Trap card:** Find ON of Fe in $Fe_3O_4$ (magnetite).',
  'Let avg ON of Fe = $x$. Sum: $3x + 4(-2) = 0 \\implies x = +8/3$.\n\n**Non-integer average** because $Fe_3O_4$ is actually $FeO \\cdot Fe_2O_3$ — i.e. 1 Fe²⁺ + 2 Fe³⁺ → mean $= (2+3+3)/3 = 8/3$.\n\nCommon in mixed oxides (e.g. $Mn_3O_4$ has +8/3 too).',
  'hard', ['oxidation-no', 'application']);

// ═══════════ T3: Disproportionation & Comproportionation ═══════════
const T3 = 'Disproportionation & Comproportionation';

add(T3, 3,
  'Define **disproportionation** with a classic example.',
  'A single species *simultaneously* undergoes both oxidation and reduction — i.e. some atoms of one element get oxidised while others of the *same element* get reduced.\n\n**Classic:** $3 Cl_2 + 6 NaOH \\to 5 NaCl + NaClO_3 + 3H_2O$ (Cl: 0 → −1 *and* +5).\n\nOther examples: $4 H_3PO_3 \\to 3 H_3PO_4 + PH_3$; $2 H_2O_2 \\to 2 H_2O + O_2$.',
  'medium', ['disproportionation']);

add(T3, 3,
  '**Conceptual gap:** Which element can disproportionate? What\'s the rule?',
  'The element must have **at least three accessible oxidation states**. From its *middle* (intermediate) state, it can go both up and down.\n\nExamples:\n- $Cl$ (states: −1, 0, +1, +3, +5, +7). At 0 (in $Cl_2$), can disproportionate up to +1/+5 and down to −1.\n- $Mn$ (multi-state). $H_2O_2$ (O at −1, can go to 0 or −2).\n\nElements with only two states (e.g. Na has only +1 / 0) cannot disproportionate.',
  'medium', ['disproportionation', 'conceptual']);

add(T3, 3,
  'What is **comproportionation**?',
  'The *reverse* of disproportionation: two species of the same element in different ONs combine to give a single species in an intermediate ON.\n\nExample: $5 Cl^- + ClO_3^- + 6 H^+ \\to 3 Cl_2 + 3 H_2O$ (the +5 and −1 chlorines come together as 0).',
  'medium', ['comproportionation']);

// ═══════════ T4: Balancing Redox Equations ═══════════
const T4 = 'Balancing Redox in Acid/Base';

add(T4, 4,
  '**Ion-electron (half-reaction) method** — steps for **acidic** medium.',
  '1. Split into two half-reactions (oxidation, reduction).\n2. Balance atoms *other than O and H* first.\n3. Balance O by adding $H_2O$.\n4. Balance H by adding $H^+$.\n5. Balance charges by adding electrons.\n6. Multiply each half so electrons cancel; add the two halves.\n\nFinal: cancel any species that appears on both sides ($H^+$, $H_2O$).',
  'medium', ['balancing', 'shortcut']);

add(T4, 4,
  '**Ion-electron method** — extra step for **basic** medium.',
  'Balance first as if acidic, then **convert** $H^+$ to $OH^-$:\n- For every $H^+$ in the equation, add an equal amount of $OH^-$ to *both* sides.\n- Combine $H^+ + OH^- \\to H_2O$ on the side that had $H^+$.\n- Cancel any $H_2O$ appearing on both sides.\n\nResult: a balanced equation in basic medium with no free $H^+$.',
  'hard', ['balancing']);

add(T4, 4,
  '**Quick check** — In a balanced redox equation, two conservation laws must hold simultaneously. Name them.',
  '1. **Mass balance** (atoms of each element conserved).\n2. **Charge balance** (net charge same on both sides).\n\nIf either fails, the equation is wrong. Many students balance atoms but forget charge — *always* verify both.',
  'medium', ['balancing']);

// ═══════════ T5: n-factor & Equivalent in Redox ═══════════
const T5 = 'n-factor & Equivalent Weight in Redox';

add(T5, 5,
  '**n-factor in redox** — how to determine it.',
  '**n-factor = number of electrons gained or lost per molecule/formula unit** of the reagent in that reaction.\n\nIt is *reaction-dependent*. Same compound can have different n-factors in different reactions (see $KMnO_4$ in acidic vs basic).',
  'medium', ['n-factor']);

add(T5, 5,
  '**Conceptual gap:** $KMnO_4$ n-factor in acidic / neutral / basic medium.',
  '- **Acidic** ($H^+$): Mn $+7 \\to +2$ → 5 electrons → **n-factor = 5** (E.W. = 158/5 = 31.6)\n- **Neutral** ($H_2O$): Mn $+7 \\to +4$ ($MnO_2$) → 3 electrons → **n = 3** (E.W. = 52.7)\n- **Basic** ($OH^-$): Mn $+7 \\to +6$ ($MnO_4^{2-}$) → 1 electron → **n = 1** (E.W. = 158)\n\nThe same reagent has *three* different equivalent weights depending on environment — pure conceptual trap.',
  'hard', ['n-factor', 'conceptual']);

add(T5, 5,
  '**n-factor** for $K_2Cr_2O_7$ in acidic medium.',
  'Cr in $Cr_2O_7^{2-}$ is $+6$; reduces to $Cr^{3+}$ ($+3$). Each Cr gains 3 electrons → **2 Cr × 3 = 6 electrons** per formula unit.\n\nSo **n-factor = 6**; equivalent weight = $294/6 = 49$.\n\n$K_2Cr_2O_7$ is preferred for primary-standard titrations because it has fixed n-factor (acidic only) and doesn\'t self-decompose.',
  'medium', ['n-factor', 'application']);

add(T5, 5,
  '**Equivalence law** in titrations — relate gram equivalents of two reactants.',
  'At endpoint of any titration:\n\n$\\text{gram equivalents of A} = \\text{gram equivalents of B}$\n\nor $N_A V_A = N_B V_B$.\n\nWorks for *any* reaction (acid-base, redox, precipitation) because n-factor folds in the stoichiometry. This is why Normality (not Molarity) is the working unit in titration calculations.',
  'medium', ['equivalent', 'titration']);

// ═══════════ T6: Common Redox Titrations ═══════════
const T6 = 'Common Redox Titrations';

add(T6, 6,
  '**Permanganate titration** — what is the **indicator**, and why?',
  '**Self-indicating** — $KMnO_4$ itself is intense purple; reduces to colorless $Mn^{2+}$ in acid. The endpoint is the first persistent pink tinge of unreacted $MnO_4^-$.\n\nNo external indicator needed. Saves a reagent step.',
  'easy', ['titration']);

add(T6, 6,
  '**Dichromate titration** — what indicator?',
  '**Diphenylamine** (or N-phenylanthranilic acid). $K_2Cr_2O_7$ is orange but the reduced $Cr^{3+}$ is green → not enough contrast for self-indication. The indicator gives a sharp blue-violet endpoint.',
  'medium', ['titration']);

add(T6, 6,
  '**Iodometric** vs **Iodimetric** titration — what\'s the difference?',
  '- **Iodimetric (direct):** Direct titration *with* $I_2$ as titrant against a reducing agent. E.g. titrating $Na_2S_2O_3$ with $I_2$.\n- **Iodometric (indirect):** An oxidising agent first liberates $I_2$ from KI; the liberated $I_2$ is then titrated with $Na_2S_2O_3$. E.g. estimating $CuSO_4$.\n\nBoth use **starch** as indicator (deep blue with $I_2$; disappears at endpoint).',
  'medium', ['titration', 'conceptual']);

add(T6, 6,
  '**Why use starch only near the endpoint** in iodometric titrations?',
  'If starch is added when $[I_2]$ is high, the starch-iodine complex is so tight that some $I_2$ is "trapped" and unreleased — gives a delayed/uncertain endpoint.\n\nAdd starch when the solution is *pale yellow* (small remaining $I_2$); then a single drop of thiosulphate gives sharp colorless endpoint.',
  'medium', ['titration', 'shortcut']);

// ─────── INSERT ───────
(async () => {
  console.log(`Prepared ${cards.length} cards for ch11_redox (FLASH-PHY-${String(ID_START).padStart(4,'0')} → FLASH-PHY-${String(idCursor-1).padStart(4,'0')})`);
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
  console.log(`ROLLBACK: db.flashcards.deleteMany({ flashcard_id: { $gte: "FLASH-PHY-${String(ID_START).padStart(4,'0')}", $lte: "FLASH-PHY-${String(idCursor-1).padStart(4,'0')}" } })`);
  await mongoose.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
