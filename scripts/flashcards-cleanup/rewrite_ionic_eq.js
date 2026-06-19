/** Ionic Equilibrium rewrite — punchy answers, PYQ-inspired. */
const fs = require('fs');
const dotenv = require('dotenv'); dotenv.config({ path: '.env.local' });
const mongoose = require('mongoose');

const CHAPTER = { id: 'ch11_ionic_eq', name: 'Ionic Equilibrium', category: 'Physical Chemistry' };
const SOURCE = 'Canvas Chemistry'; const CLASS_NUM = 11;
const ID_START = 1200; const STAMP = new Date(); const STAMP_KEY = '2026-06-18c';
const OLD_LO = 'FLASH-PHY-0530', OLD_HI = 'FLASH-PHY-0588';

const cards = []; const wishlist = []; let idCursor = ID_START;
function add(topic, order, q, a, difficulty, tags = [], diagram = null) {
  const id = `FLASH-PHY-${String(idCursor).padStart(4, '0')}`; idCursor++;
  cards.push({ flashcard_id: id, chapter: CHAPTER, topic: { name: topic, order }, question: q.trim(), answer: a.trim(), metadata: { difficulty, tags, source: SOURCE, class_num: CLASS_NUM, created_at: STAMP, updated_at: STAMP }, deleted_at: null });
  if (diagram) wishlist.push({ flashcard_id: id, topic, ...diagram });
}

// T1: Acid-Base Theories & Conjugates (10)
const T1 = 'Acid-Base Theories & Conjugate Pairs';
add(T1, 1, 'Arrhenius — definition + key limitation.', '**Acid: gives $H^+$ in water. Base: gives $OH^-$ in water.**\nFails for non-aqueous systems and for $NH_3$ (no $OH^-$).', 'easy', ['theories']);
add(T1, 1, 'Brønsted-Lowry — definition.', '**Acid = proton donor. Base = proton acceptor.**\nWorks in any solvent or gas phase.', 'easy', ['theories']);
add(T1, 1, 'Lewis — definition. Why most general?', '**Acid = electron-pair acceptor. Base = electron-pair donor.**\nDoesn\'t require $H^+$ at all → covers $BF_3 + NH_3$ type reactions.', 'medium', ['theories']);
add(T1, 1, '**Trap:** Is $BF_3$ a Brønsted acid?', '**No** — no $H^+$ to donate.\nBut **yes a Lewis acid** (empty 2p on B accepts e⁻ pair).', 'medium', ['theories']);
add(T1, 1, 'Conjugate acid-base pair — what differs?', 'Differ by exactly **one $H^+$**.\nExamples: $HCl/Cl^-$, $H_2O/OH^-$, $NH_4^+/NH_3$.', 'easy', ['conjugate']);
add(T1, 1, '**Rule:** stronger acid → ___ conjugate base.', '**Weaker.**\n$HCl$ is strong → $Cl^-$ is essentially non-basic. This is why conjugate bases of strong acids ($Cl^-$, $NO_3^-$, $ClO_4^-$) don\'t hydrolyse.', 'medium', ['conjugate']);
add(T1, 1, '**Conceptual:** In $H_2O + H_2O \\rightleftharpoons H_3O^+ + OH^-$, what role does each water play?', 'One is **acid** (donates H+ → conjugate base $OH^-$).\nOther is **base** (accepts H+ → conjugate acid $H_3O^+$).\nWater = **amphiprotic**.', 'medium', ['conjugate']);
add(T1, 1, 'Strong vs weak electrolyte — what differs?', '**Degree of dissociation $\\alpha$.**\nStrong: $\\alpha \\approx 1$. Weak: $\\alpha \\ll 1$.', 'easy', ['electrolytes']);
add(T1, 1, '$K_a$ × $K_b$ for a conjugate pair = ?', '$\\mathbf{K_a \\times K_b = K_w}$ at the same temperature.\nUseful: get $K_b$ of acetate from $K_a$ of acetic acid.', 'medium', ['conjugate', 'formula']);
add(T1, 1, 'Levelling effect — one-line.', 'In water, all acids stronger than $H_3O^+$ appear *equally strong* (HCl, $HNO_3$, HBr, HI all look "100% dissociated"). Water "levels" them.', 'hard', ['theories']);

// T2: Ostwald & alpha (5)
const T2 = 'Ostwald\'s Dilution Law & Degree of Dissociation';
add(T2, 2, 'Ostwald\'s Dilution Law — formula for weak acid.', '$K_a = \\dfrac{C\\alpha^2}{1-\\alpha}$\nFor $\\alpha \\ll 1$: $\\mathbf{K_a \\approx C\\alpha^2}$.', 'medium', ['ostwald', 'formula']);
add(T2, 2, '**Conceptual:** What happens to $\\alpha$ on dilution of a weak acid?', '**$\\alpha$ increases**, since $\\alpha \\propto 1/\\sqrt{C}$.\nLe Chatelier: fewer particles per volume → equilibrium shifts to dissociate more.', 'medium', ['ostwald']);
add(T2, 2, '**Trap:** Does Ostwald\'s Law apply to *strong* electrolytes?', '**No.** Assumes equilibrium between dissociated and undissociated forms. Strong electrolytes are ~100% dissociated → law fails. Use Debye-Hückel instead.', 'hard', ['ostwald', 'conceptual']);
add(T2, 2, 'Shortcut: $[H^+]$ for weak monoprotic acid (conc $C$, $K_a$).', '$\\mathbf{[H^+] = \\sqrt{K_a \\cdot C}}$', 'medium', ['ostwald', 'shortcut']);
add(T2, 2, '0.01 M weak acid HA has $\\alpha = 0.04$. Find $K_a$.', '$K_a \\approx C\\alpha^2 = 0.01 \\times (0.04)^2 = \\mathbf{1.6 \\times 10^{-5}}$.', 'medium', ['ostwald', 'application']);

// T3: Kw & pH scale (7)
const T3 = 'Ionic Product of Water (Kw) & pH Scale';
add(T3, 3, '$K_w$ at 25°C? In pure water, $[H^+] = ?$', '$K_w = \\mathbf{10^{-14}}$ at 25°C.\n$[H^+] = [OH^-] = 10^{-7}$ M in pure water.', 'easy', ['kw']);
add(T3, 3, '**Conceptual:** Is $K_w$ constant?', '**Constant at a given T**, but changes with T (auto-ionization endothermic).\nT ↑ → $K_w$ ↑.', 'medium', ['kw', 'conceptual']);
add(T3, 3, '**Trap PYQ:** At 50°C, $K_w$ rises. What is the pH of *pure* water?', '$[H^+] = \\sqrt{K_w} \\approx 2.3 \\times 10^{-7}$ → **pH ≈ 6.6**.\nStill **neutral** ($[H^+] = [OH^-]$) — just not pH 7.', 'hard', ['kw', 'conceptual'], { side: 'Both', priority: 'Medium', description: 'Two-curve plot: Kw rising with T; pH of pure water falling with T. Marks 25°C (pH 7) and 100°C (pH ~6).', notes: 'Counterintuitive — diagram anchors the idea.' });
add(T3, 3, 'pH range — really bounded 0–14?', '**No** — that\'s just typical. 10 M HCl has pH ≈ −1; 10 M NaOH has pH ≈ 15.', 'easy', ['pH']);
add(T3, 3, 'pH + pOH at 25°C = ?', '$\\mathbf{pH + pOH = 14}$. From $-\\log$ of $K_w = 10^{-14}$.', 'easy', ['pH', 'formula']);
add(T3, 3, '**Classic trap:** pH of $10^{-8}$ M HCl? (Naive answer: 8.)', '**Naive = wrong.** Water\'s $H^+$ ($10^{-7}$) dominates.\n$[H^+]_{\\text{tot}} \\approx 10^{-8} + 10^{-7} = 1.1 \\times 10^{-7}$ → **pH ≈ 6.96** (just below 7).', 'hard', ['pH', 'conceptual']);
add(T3, 3, 'Quick: $[H^+] = ?$ for pH = 3.', '$[H^+] = 10^{-3}$ M. Each pH unit = factor of 10.', 'easy', ['pH']);

// T4: pH of acids/bases (8)
const T4 = 'pH of Strong & Weak Acids/Bases';
add(T4, 4, 'pH of strong acid, conc $C$ (not too dilute)?', '$\\mathbf{pH = -\\log C}$. Breaks if $C < 10^{-6}$ M.', 'easy', ['pH', 'shortcut']);
add(T4, 4, 'pH of strong base, conc $C$?', '$pOH = -\\log C$ → $pH = 14 - pOH$.\nE.g. 0.01 M NaOH: pH = 12.', 'easy', ['pH']);
add(T4, 4, 'pH of weak monoprotic acid (conc $C$, $pK_a$)?', '$\\mathbf{pH = \\tfrac{1}{2}(pK_a - \\log C)}$', 'medium', ['pH', 'shortcut']);
add(T4, 4, 'pH of weak base ($C$, $pK_b$)?', '$pOH = \\tfrac{1}{2}(pK_b - \\log C)$, then $pH = 14 - pOH$.', 'medium', ['pH', 'shortcut']);
add(T4, 4, 'pH of 0.1 M $CH_3COOH$ ($K_a = 1.8 \\times 10^{-5}$).', '$[H^+] = \\sqrt{1.8 \\times 10^{-6}} \\approx 1.34 \\times 10^{-3}$\n**pH ≈ 2.87**.', 'medium', ['pH', 'application']);
add(T4, 4, '**Conceptual:** 0.1 M HCl vs 0.1 M $CH_3COOH$ — which has lower pH?', '**HCl: pH = 1.** Acetic acid: pH ≈ 2.87 (only ~1.3% dissociated).\nSame concentration ≠ same pH for weak acids.', 'medium', ['pH', 'conceptual']);
add(T4, 4, '**Why** does pH of polyprotic acid like $H_3PO_4$ mostly depend on the *first* dissociation?', 'Successive $K_{a1} \\gg K_{a2} \\gg K_{a3}$ (by ~$10^5$ each). 2nd, 3rd contribute negligible $H^+$.\n$H_2SO_4$ is exception — both first two are strong.', 'hard', ['pH', 'conceptual']);
add(T4, 4, '**PYQ:** Mix 50 mL of 0.1 M HCl + 50 mL of 0.1 M NaOH. Final pH?', '**Exact neutralisation** → solution is just dilute NaCl → **pH = 7**.', 'easy', ['pH', 'pyq']);

// T5: Common Ion Effect (4)
const T5 = 'Common Ion Effect';
add(T5, 5, 'Common Ion Effect — one-line.', '**Adding a strong electrolyte sharing a common ion suppresses dissociation** of a weak electrolyte (Le Chatelier).', 'easy', ['common-ion']);
add(T5, 5, 'Add $CH_3COONa$ to $CH_3COOH$ → effect on $[H^+]$?', '$[H^+]$ **decreases** (common $CH_3COO^-$ shifts equilibrium leftward).\npH rises. Basis of acid **buffers**.', 'medium', ['common-ion', 'application']);
add(T5, 5, '**Conceptual:** Does common ion change $K_a$?', '**No.** $K_a$ only depends on T.\nWhat changes is $\\alpha$ (drops). New equilibrium concentrations still satisfy same $K_a$.', 'medium', ['common-ion']);
add(T5, 5, 'Add $NaCl$ to saturated $AgCl$. What happens to $[Ag^+]$, $K_{sp}$, solubility?', '- $[Ag^+]$ **decreases**\n- $K_{sp}$ **unchanged**\n- Solubility **decreases**\nUsed in qualitative analysis.', 'hard', ['common-ion', 'ksp']);

// T6: Salt Hydrolysis (8)
const T6 = 'Salt Hydrolysis & pH of Salt Solutions';
add(T6, 6, 'Four salt types — predict pH.', '| Acid + Base | Example | pH |\n|---|---|---|\n| Strong + Strong | NaCl | **= 7** |\n| Strong + Weak | $NH_4Cl$ | **< 7** |\n| Weak + Strong | $CH_3COONa$ | **> 7** |\n| Weak + Weak | $CH_3COONH_4$ | depends on $K_a$ vs $K_b$ |', 'easy', ['hydrolysis']);
add(T6, 6, 'Why is $NH_4Cl$ solution acidic?', '$Cl^-$ inert. $NH_4^+ + H_2O \\rightleftharpoons NH_3 + H_3O^+$ → generates $H_3O^+$.', 'medium', ['hydrolysis']);
add(T6, 6, '**Conceptual:** $NaCl$ neutral, $CH_3COONa$ basic. Why?', 'Both have inert $Na^+$. Difference is the anion:\n- $Cl^-$ inert → no pH shift.\n- $CH_3COO^-$ hydrolyses → generates $OH^-$ → basic.', 'medium', ['hydrolysis']);
add(T6, 6, '$K_h$ formulas.', '| Salt type | $K_h$ |\n|---|---|\n| Weak acid + strong base | $K_w/K_a$ |\n| Strong acid + weak base | $K_w/K_b$ |\n| Weak acid + weak base | $K_w/(K_a K_b)$ |', 'hard', ['hydrolysis', 'formula']);
add(T6, 6, 'pH of weak acid + strong base salt (conc $C$).', '$\\mathbf{pH = 7 + \\tfrac{1}{2}(pK_a + \\log C)}$\n(E.g. $CH_3COONa$.)', 'medium', ['hydrolysis', 'shortcut']);
add(T6, 6, 'pH of strong acid + weak base salt.', '$\\mathbf{pH = 7 - \\tfrac{1}{2}(pK_b + \\log C)}$\n(E.g. $NH_4Cl$.)', 'medium', ['hydrolysis', 'shortcut']);
add(T6, 6, 'pH of weak acid + weak base salt — what\'s noteworthy?', '$\\mathbf{pH = \\tfrac{1}{2}(pK_w + pK_a - pK_b)}$\n**Independent of concentration $C$** — striking feature.', 'hard', ['hydrolysis', 'conceptual']);
add(T6, 6, '**PYQ trap:** Order increasing pH: $NaCl$, $NH_4Cl$, $CH_3COONa$.', '$NH_4Cl$ (acidic) < $NaCl$ (= 7) < $CH_3COONa$ (basic).', 'medium', ['hydrolysis']);

// T7: Buffers (8)
const T7 = 'Buffer Solutions';
add(T7, 7, 'Buffer — definition + two types.', '**Resists pH change** on adding small amount of acid/base or dilution.\n- Acidic: weak acid + its salt (e.g. acetic acid + acetate)\n- Basic: weak base + its salt (e.g. $NH_3$ + $NH_4Cl$)', 'easy', ['buffer']);
add(T7, 7, 'Henderson-Hasselbalch (acid buffer).', '$\\mathbf{pH = pK_a + \\log\\dfrac{[\\text{salt}]}{[\\text{acid}]}}$\nIf salt = acid → pH = $pK_a$.', 'medium', ['buffer', 'formula']);
add(T7, 7, 'Henderson for basic buffer.', '$pOH = pK_b + \\log\\dfrac{[\\text{salt}]}{[\\text{base}]}$, then $pH = 14 - pOH$.', 'medium', ['buffer', 'formula']);
add(T7, 7, '**Buffer mechanism** — how does it absorb added $H^+$ and added $OH^-$?', '- Add $H^+$: mopped by anion → $CH_3COO^- + H^+ \\to CH_3COOH$\n- Add $OH^-$: mopped by acid → $CH_3COOH + OH^- \\to CH_3COO^- + H_2O$\n\n"Two-way sponge".', 'medium', ['buffer', 'conceptual'], { side: 'Answer', priority: 'High', description: 'Two side-by-side cartoons: LEFT "Add H+" caught by CH3COO-. RIGHT "Add OH-" caught by CH3COOH. Arrows showing equilibrium shifts.', notes: 'Buffer action is #1 stumble; picture nails it.' });
add(T7, 7, '**Max buffer capacity** at what ratio?', 'When $[\\text{salt}] = [\\text{acid}]$ → pH = $pK_a$. Equal capacity to absorb $H^+$ or $OH^-$.', 'medium', ['buffer']);
add(T7, 7, 'Useful buffer range around $pK_a$?', '$\\mathbf{pK_a \\pm 1}$ (i.e. salt/acid ratio between 0.1 and 10).', 'medium', ['buffer', 'shortcut']);
add(T7, 7, '**Trap:** Dilute a buffer 10×. What happens to pH?', '**Negligible change.** Henderson uses *ratio* — both diluted equally → ratio unchanged → pH unchanged.', 'medium', ['buffer', 'conceptual']);
add(T7, 7, 'Blood buffer + its pH?', '**Carbonic acid / bicarbonate ($H_2CO_3$ / $HCO_3^-$)** at pH ≈ **7.4**.\nDeviation > 0.4 = acidosis/alkalosis (medical).', 'easy', ['buffer']);

// T8: Ksp (8)
const T8 = 'Solubility Product (Ksp)';
add(T8, 8, '$K_{sp}$ definition for $A_xB_y$.', 'For $A_xB_y(s) \\rightleftharpoons xA^{m+} + yB^{n-}$:\n$\\mathbf{K_{sp} = [A^{m+}]^x [B^{n-}]^y}$\nDepends only on T.', 'easy', ['ksp']);
add(T8, 8, 'Solubility ($s$) ↔ $K_{sp}$ for AB, $AB_2$, $A_2B_3$.', '| Type | Relation |\n|---|---|\n| AB | $K_{sp} = s^2$ |\n| $AB_2$ | $K_{sp} = 4s^3$ |\n| $A_2B_3$ | $K_{sp} = 108\\,s^5$ |', 'medium', ['ksp', 'shortcut']);
add(T8, 8, '**Trap PYQ:** $K_{sp}(AgCl) = 1.8 \\times 10^{-10}$; $K_{sp}(Ag_2CrO_4) = 1.1 \\times 10^{-12}$. Which is *more soluble* in water?', '**$Ag_2CrO_4$.** Different formulas → compute molar solubility:\n- AgCl: $s = \\sqrt{K_{sp}} \\approx 1.3 \\times 10^{-5}$ M\n- $Ag_2CrO_4$: $s = (K_{sp}/4)^{1/3} \\approx 6.5 \\times 10^{-5}$ M\n\nNever compare $K_{sp}$ values directly across formulas.', 'hard', ['ksp', 'conceptual']);
add(T8, 8, 'Precipitation condition (using $Q$).', '- $Q < K_{sp}$ → unsaturated, no ppt\n- $Q = K_{sp}$ → saturated\n- $Q > K_{sp}$ → **ppt forms**', 'medium', ['ksp']);
add(T8, 8, '**PYQ:** Mix equal vol of $10^{-4}$ M $Ba^{2+}$ and $10^{-4}$ M $SO_4^{2-}$. $K_{sp}(BaSO_4) = 1.1 \\times 10^{-10}$. Ppt?', 'After dilution: $5 \\times 10^{-5}$ M each.\n$Q = (5 \\times 10^{-5})^2 = 2.5 \\times 10^{-9} > K_{sp}$ → **yes, ppt**.', 'medium', ['ksp', 'application']);
add(T8, 8, '**Common ion + $K_{sp}$:** Solubility of AgCl in 0.1 M NaCl vs pure water?', 'Pure water: $s \\sim 10^{-5}$ M.\n0.1 M NaCl: $s \\approx K_{sp}/0.1 \\sim 10^{-9}$ M.\n**$10^4$× lower** — same $K_{sp}$, vastly different solubility.', 'medium', ['ksp', 'common-ion']);
add(T8, 8, 'Selective precipitation in salt analysis — one-line.', 'Control $[S^{2-}]$ (acidic vs basic $H_2S$) so only some sulfides cross their $K_{sp}$ → group separation.', 'hard', ['ksp'], { side: 'Answer', priority: 'High', description: 'Vertical bar chart: log[S2-] thresholds for CuS, HgS, PbS, ZnS, MnS. Horizontal lines showing [S2-] in acidic vs basic H2S, intersecting different bars.', notes: 'Underpins qualitative analysis — visual very high leverage.' });
add(T8, 8, 'Compute solubility of $Ca(OH)_2$ if $K_{sp} = 5.5 \\times 10^{-6}$.', '$AB_2$ type: $K_{sp} = 4s^3 \\Rightarrow s = (5.5 \\times 10^{-6}/4)^{1/3} \\approx \\mathbf{1.1 \\times 10^{-2}}$ M.', 'medium', ['ksp']);

// T9: Titrations & Indicators (5)
const T9 = 'Titration Curves & Indicators';
add(T9, 9, 'Strong acid + strong base titration — pH at equivalence + jump range.', 'pH at equivalence = **7** (no hydrolysis).\nJump spans roughly pH 3 → 11 (sharp vertical).', 'medium', ['titration'], { side: 'Answer', priority: 'High', description: 'pH vs volume curve: starts ~1, climbs gently, sharp vertical rise at equivalence point pH 7, plateaus near 13.', notes: 'Canonical plot.' });
add(T9, 9, 'Weak acid + strong base — pH at equivalence?', '**> 7** (anion of weak acid hydrolyses to give $OH^-$). Buffer region midway at pH = $pK_a$.', 'medium', ['titration'], { side: 'Answer', priority: 'High', description: 'pH vs volume for weak-strong: starts ~3, buffer plateau at pKa, jump to equivalence at ~8.5, levels at ~12.', notes: 'Pairs with strong-strong curve.' });
add(T9, 9, 'Weak base + strong acid — pH at equivalence?', '**< 7** (cation of weak base hydrolyses → $H_3O^+$). Buffer region at pH = $14 - pK_b$.', 'medium', ['titration']);
add(T9, 9, '**Indicator choice rule.**', 'Indicator\'s color-change range ($pK_{In} \\pm 1$) must lie **within the steep vertical jump** of the titration curve.\n- Strong-strong: phenolphthalein OR methyl orange both OK.\n- Weak acid + strong base: **phenolphthalein** (pH 8.2–10).\n- Weak base + strong acid: **methyl orange** (pH 3.1–4.4).', 'hard', ['indicators']);
add(T9, 9, 'Phenolphthalein vs methyl orange — color changes.', '| Indicator | Acidic | Basic | Range |\n|---|---|---|---|\n| Phenolphthalein | colourless | pink | 8.2–10 |\n| Methyl orange | red | yellow | 3.1–4.4 |', 'easy', ['indicators']);

// ROLLOUT
(async () => {
  console.log(`Prepared ${cards.length} cards (FLASH-PHY-${String(ID_START).padStart(4,'0')} → FLASH-PHY-${String(idCursor-1).padStart(4,'0')})`);
  const bad = cards.filter(c => /\$\$/.test(c.question) || /\$\$/.test(c.answer));
  if (bad.length) { console.error('$$', bad.map(b=>b.flashcard_id)); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);
  const c = mongoose.connection.db.collection('flashcards');
  const exists = await c.find({ flashcard_id: { $in: cards.map(c=>c.flashcard_id) } }).toArray();
  if (exists.length) { console.error('COLLISION', exists); process.exit(1); }
  if (process.argv.includes('--dry-run')) { console.log('Mix:', JSON.stringify(cards.reduce((a,c)=>{a[c.metadata.difficulty]=(a[c.metadata.difficulty]||0)+1;return a;},{}))); await mongoose.disconnect(); return; }
  const oldDocs = await c.find({ flashcard_id: { $gte: OLD_LO, $lte: OLD_HI }, deleted_at: null }).toArray();
  fs.writeFileSync(`_agents/snapshots/flashcards_${CHAPTER.id}_rewrite_${STAMP_KEY}.json`, JSON.stringify(oldDocs.map(d => ({ _id: d._id, flashcard_id: d.flashcard_id, deleted_at: null })), null, 2));
  const delRes = await c.updateMany({ flashcard_id: { $gte: OLD_LO, $lte: OLD_HI }, deleted_at: null }, { $set: { deleted_at: STAMP, deletion_reason: `${CHAPTER.id}-rewrite-2026-06-18` } });
  console.log(`Soft-deleted: ${delRes.modifiedCount}`);
  const insRes = await c.insertMany(cards, { ordered: true });
  console.log(`Inserted: ${insRes.insertedCount}`);
  console.log('Mix:', JSON.stringify(cards.reduce((a,c)=>{a[c.metadata.difficulty]=(a[c.metadata.difficulty]||0)+1;return a;},{})));
  fs.writeFileSync(`_agents/snapshots/flashcards_diagrams_wishlist_${CHAPTER.id}_rewrite.json`, JSON.stringify(wishlist, null, 2));
  console.log(`Wishlist: ${wishlist.length}`);
  await mongoose.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
