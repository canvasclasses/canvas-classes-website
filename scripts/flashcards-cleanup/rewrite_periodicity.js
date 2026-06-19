/**
 * Periodicity (ch11_periodic) — REWRITE pass per founder feedback 2026-06-18:
 *  - Move chapter from Physical → Inorganic (correct subject classification)
 *  - Soft-delete the original 23 paragraph-style cards (FLASH-PHY-0733..0755)
 *  - Insert ~60 fresh PYQ-inspired tricky cards with SHORT, scannable answers
 *    (1-3 lines, tables, or bullets — never paragraphs)
 *
 * Answer style rule: bold key answer first, then 1-2 line justification.
 * Switch ID prefix to FLASH-INORG (max before this batch: 0956).
 */
const fs = require('fs');
const dotenv = require('dotenv'); dotenv.config({ path: '.env.local' });
const mongoose = require('mongoose');

const CHAPTER = { id: 'ch11_periodic', name: 'Periodic Table & Periodicity', category: 'Inorganic Chemistry' };
const SOURCE = 'Canvas Chemistry';
const CLASS_NUM = 11;
const ID_START = 957;
const STAMP = new Date();

const cards = [];
const wishlist = [];
let idCursor = ID_START;
function add(topic, order, q, a, difficulty, tags = [], diagram = null) {
  const id = `FLASH-INORG-${String(idCursor).padStart(4, '0')}`;
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

// ═══════════ T1: Periodic Law & Block Classification ═══════════
const T1 = 'Periodic Law & Classification';

add(T1, 1,
  'Modern periodic law — state it in one line.',
  '**Properties are periodic functions of atomic number** (not atomic mass).',
  'easy', ['periodic-law']);

add(T1, 1,
  'Why did atomic *mass* fail as the periodic sequencing variable? Name one pair where mass ordering breaks.',
  '**Ar (40) before K (39)**, **Te (128) before I (127)**, **Co (59) before Ni (58.7)** — mass puts them in wrong groups; atomic number fixes it.',
  'easy', ['periodic-law']);

add(T1, 1,
  'Last element of each block in the long form. Fill in:',
  '| Block | Last element |\n|---|---|\n| s | Ra (Z=88) |\n| p | Og (Z=118) |\n| d | Cn (Z=112) |\n| f | Lr (Z=103) |',
  'medium', ['classification']);

// ═══════════ T2: Effective Nuclear Charge & Slater's Rules ═══════════
const T2 = 'Effective Nuclear Charge (Slater\'s Rules)';

add(T2, 2,
  'Define $Z_{\\text{eff}}$ in one line.',
  '$Z_{\\text{eff}} = Z - \\sigma$ — net nuclear charge "felt" by a given electron, after subtracting shielding $\\sigma$ from other electrons.',
  'easy', ['z-eff', 'formula']);

add(T2, 2,
  '**Slater\'s rules** — shielding contribution from electrons in different groups.',
  '| Group | Contribution to $\\sigma$ |\n|---|---|\n| Same group (n,l), same shell | 0.35 |\n| (n−1) shell | 0.85 |\n| (n−2) or deeper | 1.00 |\n| Same shell as 1s | 0.30 |',
  'medium', ['slater', 'shortcut']);

add(T2, 2,
  '$Z_{\\text{eff}}$ on the 3p electron of P (Z=15)?',
  '**$Z_{\\text{eff}} = 4.80$**.\nP: $1s^2 2s^2 2p^6 3s^2 3p^3$. $\\sigma = 4(0.35) + 8(0.85) + 2(1.00) = 1.40 + 6.80 + 2.00 = 10.20$.\n$Z_{\\text{eff}} = 15 - 10.20 = 4.80$.',
  'hard', ['slater', 'application']);

add(T2, 2,
  'Why does $Z_{\\text{eff}}$ *increase* across a period?',
  'Each step adds 1 proton ($Z$ up by 1) but the new electron goes into the *same shell* — it shields only **~0.35** of that proton.\nNet $Z_{\\text{eff}}$ rises by ~0.65 per step.',
  'medium', ['z-eff']);

// ═══════════ T3: Atomic & Ionic Radius (10 cards) ═══════════
const T3 = 'Atomic & Ionic Radius';

add(T3, 3,
  'Three radius types — when to use which?',
  '- **Covalent** — non-metals (½ of $X_2$ bond length)\n- **Metallic** — metals (½ of M–M distance in lattice)\n- **van der Waals** — noble gases (½ of non-bonded close-contact)\n\nSize: $r_{vdW} > r_{metallic} > r_{covalent}$.',
  'easy', ['radius']);

add(T3, 3,
  'Order by radius: $N^{3-}, O^{2-}, F^-, Na^+, Mg^{2+}, Al^{3+}$. (PYQ favourite)',
  '**$N^{3-} > O^{2-} > F^- > Na^+ > Mg^{2+} > Al^{3+}$**\nAll isoelectronic (10 e⁻). More +Z → smaller radius.',
  'medium', ['radius', 'isoelectronic']);

add(T3, 3,
  'Order by radius: $Fe, Fe^{2+}, Fe^{3+}$.',
  '**$Fe > Fe^{2+} > Fe^{3+}$**. Same nucleus, fewer electrons → tighter cloud.',
  'easy', ['radius']);

add(T3, 3,
  'Order by radius: $O, O^-, O^{2-}$.',
  '**$O^{2-} > O^- > O$**. Same nucleus, more electrons → e–e repulsion expands cloud.',
  'easy', ['radius']);

add(T3, 3,
  'Largest atomic radius in period 3?',
  '**Na** (smallest $Z_{\\text{eff}}$ in the period). Radius decreases L→R as $Z_{\\text{eff}}$ rises.',
  'easy', ['radius']);

add(T3, 3,
  '**Lanthanide contraction** — what is it, and one consequence on d-block.',
  'Steady decrease in radius across the 14 lanthanides (4f weakly shields). \n\n**Consequence:** Zr ≈ Hf, Nb ≈ Ta, Mo ≈ W in size → 4d and 5d transition pairs have near-identical chemistry.',
  'medium', ['lanthanide-contraction']);

add(T3, 3,
  '**Trap:** Why is $Ga$ slightly *smaller* than $Al$, even though $Ga$ is below $Al$?',
  '**d-block contraction.** 10 d-electrons added between Al and Ga shield poorly → $Z_{\\text{eff}}$ on Ga\'s outer e⁻ jumps → contraction beats the new-shell expansion.',
  'hard', ['radius', 'd-contraction']);

add(T3, 3,
  'Compare: $Li^+$ vs $Mg^{2+}$ — which is smaller?',
  '**$Mg^{2+}$ (~72 pm) < $Li^+$ (~76 pm)** — close in size; this is the *origin* of the Li–Mg diagonal relationship.',
  'medium', ['radius', 'diagonal']);

add(T3, 3,
  'Smallest cation among: $K^+, Na^+, Rb^+, Cs^+$?',
  '**$Na^+$** — top of the group (size: $Na^+ < K^+ < Rb^+ < Cs^+$). Cation radius increases down a group.',
  'easy', ['radius']);

add(T3, 3,
  '**PYQ pattern** — Correct order of ionic radii:\n(a) $Mg^{2+} > Ba^{2+} > Ca^{2+}$\n(b) $Cs^+ > Rb^+ > Na^+$\n(c) $F^- > Cl^- > Br^-$\n(d) $La^{3+} > Ce^{3+} > Lu^{3+}$',
  '**(b) and (d) are correct.**\n- (a) wrong: $Ba^{2+} > Ca^{2+} > Mg^{2+}$ (down-group expands).\n- (b) ✓ (cation radius down-group rises).\n- (c) wrong: $Br^- > Cl^- > F^-$ (anion radius down-group rises).\n- (d) ✓ (lanthanide contraction: La largest, Lu smallest).',
  'hard', ['radius', 'pyq']);

// ═══════════ T4: Ionization Energy (12 cards) ═══════════
const T4 = 'Ionization Energy';

add(T4, 4,
  'Define $IE_1$ — three constraints often missed.',
  'Min energy to remove the *most loosely held* e⁻ from a:\n1. **gaseous**\n2. **isolated** (no other atoms)\n3. **ground-state** neutral atom.',
  'easy', ['ie']);

add(T4, 4,
  'Element with the highest first ionization energy?',
  '**He** (≈ 2372 kJ/mol). Tiny size + closed 1s shell.',
  'easy', ['ie']);

add(T4, 4,
  'Element with the lowest first ionization energy?',
  '**Cs** (≈ 376 kJ/mol). Largest stable atom, electron loosely held. (Fr is similar but radioactive.)',
  'easy', ['ie']);

add(T4, 4,
  'Order $IE_1$: $B, C, N, O, F, Ne$.',
  '**$Ne > F > N > O > C > B$**\n\nGeneral trend rises L→R, but the **N > O anomaly** (half-filled $2p^3$) breaks the smooth rise.',
  'medium', ['ie']);

add(T4, 4,
  '**Anomaly:** Why is $IE_1$ of **N > O**?',
  '- N: $2p^3$ — **half-filled, extra exchange stability**.\n- O: $2p^4$ — paired e⁻ in 2p suffers extra repulsion → easier to lose.',
  'medium', ['ie']);

add(T4, 4,
  '**Anomaly:** Why is $IE_1$ of **Be > B**?',
  '- Be: $2s^2$ (filled $s$, stable).\n- B: removes a higher-energy $2p^1$ e⁻ → easier.',
  'medium', ['ie']);

add(T4, 4,
  'PYQ-style — Element X has successive IE values (kJ/mol): 738, 1450, 7730, 10550, 13630. To which **group** does X belong?',
  '**Group 2** (alkaline earth metal — likely Mg).\n\nGiant jump from $IE_2 \\to IE_3$ → after losing 2 e⁻, next removal hits the noble-gas core. So X has 2 valence e⁻.',
  'hard', ['ie', 'pyq']);

add(T4, 4,
  'PYQ — Successive IE: 520, 7297, 11814. Identify group.',
  '**Group 1** (likely Li). Huge $IE_1 \\to IE_2$ jump (520 → 7297) → only 1 valence e⁻.',
  'medium', ['ie', 'pyq']);

add(T4, 4,
  'Compare $IE_1$: $Mg, Al, P, S, Cl, Ar$.',
  '**$Ar > Cl > P > S > Mg > Al$**\n\nBoth period-3 anomalies show up:\n- $Mg > Al$ ($3s^2$ vs $3p^1$).\n- $P > S$ (half-filled $3p^3$ vs paired $3p^4$).',
  'hard', ['ie']);

add(T4, 4,
  'Why $IE_2 \\gg IE_1$ always?',
  'After 1st removal, cation has fewer e⁻ but *same* Z → $Z_{\\text{eff}}$ per remaining e⁻ rises → much harder to remove next.',
  'easy', ['ie']);

add(T4, 4,
  '**Conceptual:** Higher IE means greater ___ character.',
  '**Non-metallic** character. Easy electron loss = metallic; tight hold = non-metallic.',
  'easy', ['ie']);

add(T4, 4,
  '**Trap PYQ:** $IE_1$ of $N$ vs $P$ — which is greater? Why?',
  '**$N > P$**. Going down → size up, e⁻ further out → easier to lose. So smaller P\'s $IE_1$ is less than N\'s.',
  'medium', ['ie']);

// ═══════════ T5: Electron Gain Enthalpy / EA (8 cards) ═══════════
const T5 = 'Electron Gain Enthalpy';

add(T5, 5,
  '**Sign convention:** electron gain enthalpy ($\\Delta_{eg}H$) — negative or positive when energy is *released*?',
  '**Negative** when energy released (favourable). More negative → atom *wants* the electron more.',
  'easy', ['ea']);

add(T5, 5,
  'Element with the most negative $\\Delta_{eg}H$?',
  '**Cl** (≈ −349 kJ/mol). Not F — see next card.',
  'medium', ['ea']);

add(T5, 5,
  '**Anomaly:** Why is $\\Delta_{eg}H$ of **Cl more negative than F**?',
  'F is tiny → incoming e⁻ enters a compact 2p shell with **high e–e repulsion** → less energy released than expected.\nCl\'s 3p is roomier.',
  'medium', ['ea']);

add(T5, 5,
  'Order $|\\Delta_{eg}H|$: $F, Cl, Br, I$.',
  '**$Cl > F > Br > I$** (magnitudes).',
  'medium', ['ea']);

add(T5, 5,
  'Why do **noble gases** have positive (or zero) $\\Delta_{eg}H$?',
  'Filled outer shell → added e⁻ must enter the next shell → unfavourable → process endothermic.',
  'easy', ['ea']);

add(T5, 5,
  '$\\Delta_{eg}H$ of **N**?',
  '**~0 (slightly positive)** — half-filled $2p^3$ is so stable that adding an e⁻ (to pair up) gains nothing.\nSame reason: noble-gas-like situation.',
  'medium', ['ea']);

add(T5, 5,
  '$\\Delta_{eg}H$ — which is more negative: **S or O**?',
  '**S more negative** than O. Same anomaly as F vs Cl: O\'s 2p is too compact for comfortable e⁻ addition.',
  'medium', ['ea']);

add(T5, 5,
  '**PYQ-style** — Correct order of $\\Delta_{eg}H$ (most negative first):\n(a) $Cl > F > Br > I$\n(b) $F > Cl > Br > I$\n(c) $F > Cl > Br > I = 0$\n(d) $Cl < F < Br < I$',
  '**(a)** is correct. F\'s small size makes its EA *less* favourable than Cl\'s, breaking the naive top-of-group trend.',
  'hard', ['ea', 'pyq']);

// ═══════════ T6: Electronegativity (6 cards) ═══════════
const T6 = 'Electronegativity';

add(T6, 6,
  'Most electronegative element (Pauling)?',
  '**F = 4.0** (Pauling scale reference).',
  'easy', ['en']);

add(T6, 6,
  'Mulliken EN — formula.',
  '$EN_M = \\dfrac{IE + EA}{2}$ — average of ionization energy and electron affinity.',
  'medium', ['en', 'formula']);

add(T6, 6,
  'PYQ — Order EN: $C, N, O, F$.',
  '**$F > O > N > C$** (Pauling: 4.0, 3.5, 3.0, 2.5 — neat 0.5 gaps).',
  'easy', ['en']);

add(T6, 6,
  '**Trap PYQ** — EN comparison: $N$ vs $Cl$?',
  '**$N \\approx Cl$** ($\\sim 3.0$ each). Diagonal similarity in EN; this is why $NCl_3$ has near-zero net polarity on the N–Cl bonds.',
  'medium', ['en']);

add(T6, 6,
  'Allred-Rochow EN — what physical quantity is it based on?',
  '**Effective nuclear charge ÷ (covalent radius)$^2$** — i.e. Coulombic force per unit charge on a bonding electron.',
  'medium', ['en']);

add(T6, 6,
  'Why does EN **decrease** down a group but **increase** across a period?',
  '- **Across:** $Z_{\\text{eff}}$ rises, atom shrinks → stronger pull on shared e⁻.\n- **Down:** new shell added, e⁻ further from nucleus, more shielding → weaker pull.',
  'easy', ['en']);

// ═══════════ T7: Diagonal Relationship & 2nd-Period Anomalies (8 cards) ═══════════
const T7 = 'Diagonal Relationship & Anomalies';

add(T7, 7,
  'Three classic diagonal pairs.',
  '**Li ~ Mg**, **Be ~ Al**, **B ~ Si**.',
  'easy', ['diagonal']);

add(T7, 7,
  'Why does the diagonal relationship exist?',
  'Down the group, polarising power (charge/radius²) *decreases*; across the period, it *increases*. Diagonally, the two effects cancel → similar polarising power → similar chemistry.',
  'medium', ['diagonal']);

add(T7, 7,
  '**Three properties** Li shares with Mg (not with the rest of group 1).',
  '1. Forms **nitride** with $N_2$ directly: $Li_3N$, $Mg_3N_2$.\n2. Forms only **normal oxide** ($Li_2O$, $MgO$) — not peroxide or superoxide.\n3. **LiCl, MgCl₂ both deliquescent** and soluble in alcohols (covalent character).',
  'medium', ['diagonal', 'li-mg']);

add(T7, 7,
  '**PYQ** — Which element of group 13 shows diagonal similarity with silicon?',
  '**Boron.** Both B and Si form acidic oxides, are non-metals/metalloids, form covalent halides hydrolysed by water, and form polymeric/network structures.',
  'medium', ['diagonal']);

add(T7, 7,
  '**Why is N₂ a gas but P₄ a solid?**',
  '- N: small, forms strong $p\\pi$–$p\\pi$ → triple bond → N≡N gas.\n- P: too large for effective $p\\pi$–$p\\pi$ → prefers single bonds → tetrahedral $P_4$ solid.',
  'medium', ['anomaly']);

add(T7, 7,
  '**Why is O₂ a gas but S₈ a solid?**',
  'Same logic — O forms strong $\\pi$ bonds (O=O), but S prefers chains/rings of single bonds → $S_8$ ring → solid.',
  'medium', ['anomaly']);

add(T7, 7,
  'Anomalous properties of **2nd-period elements** — three reasons.',
  '1. Smallest size in group (highest $Z_{\\text{eff}}$).\n2. **No d-orbitals** → strict octet, can\'t expand.\n3. Strong tendency for $p\\pi$–$p\\pi$ multiple bonds.',
  'medium', ['second-period']);

add(T7, 7,
  '**PYQ trap** — Why does F have a **lower bond enthalpy** than Cl in $X_2$ molecule (158 vs 242 kJ/mol)?',
  'F is so tiny that the **lone-pair lone-pair repulsion** across the F–F bond destabilizes the molecule → weaker bond. Same anomaly: H–O–O–H (peroxide) bond weak vs S–S.',
  'hard', ['anomaly', 'pyq']);

// ═══════════ T8: Nature of Oxides & Hydrides (5 cards) ═══════════
const T8 = 'Oxides, Hydrides — Acid/Base Character';

add(T8, 8,
  'Acid/base character of oxides across a period.',
  '**Basic → amphoteric → acidic** as you move L→R.\n\nE.g. period 3: $Na_2O$ basic, $MgO$ basic, $Al_2O_3$ amphoteric, $SiO_2, P_2O_5, SO_3, Cl_2O_7$ acidic.',
  'medium', ['oxides']);

add(T8, 8,
  'Name 4 common **amphoteric oxides**.',
  '**$Al_2O_3, ZnO, BeO, PbO$** (also $SnO, Sb_2O_3, Cr_2O_3, Ga_2O_3$).',
  'medium', ['oxides']);

add(T8, 8,
  'Which is most acidic: $N_2O_5, P_2O_5, As_2O_5, Sb_2O_5, Bi_2O_5$?',
  '**$N_2O_5$** (smallest, highest EN) — acidic character decreases down the group.\n$Bi_2O_5$ is even *basic*.',
  'medium', ['oxides']);

add(T8, 8,
  'Acidity of hydrides — order in group 16.',
  '**$H_2Te > H_2Se > H_2S > H_2O$**\nLarger central atom → weaker H–X bond → easier H+ release → more acidic.',
  'medium', ['hydrides']);

add(T8, 8,
  '**Trap** — Why is HF the *weakest* acid among HX (halogen hydrides)?',
  'Very strong H–F bond + strong H-bonding in solution keeps $H^+$ tightly held.\nAcid strength: **$HI > HBr > HCl > HF$**.',
  'medium', ['hydrides']);

// ═══════════ T9: Inert Pair Effect & Lanthanide Contraction (4 cards) ═══════════
const T9 = 'Inert Pair Effect & Special Trends';

add(T9, 9,
  '**Inert pair effect** — one-line.',
  'Down a group, the **outer $ns^2$ pair becomes reluctant to participate in bonding** → lower oxidation state grows more stable for heavier elements.',
  'medium', ['inert-pair']);

add(T9, 9,
  'Stable oxidation states going down group 13 (B → Tl)?',
  '- B, Al, Ga → +3 stable.\n- In, **Tl** → +1 increasingly stable; **Tl(+3) is a strong oxidizer**.',
  'medium', ['inert-pair']);

add(T9, 9,
  'Stable oxidation states in group 14 (C → Pb)?',
  '- C, Si → +4 only.\n- Ge, Sn → both +2 and +4 (Sn(+2) reducing).\n- **Pb** → +2 most stable; **Pb(+4) strong oxidizer** ($PbO_2$).',
  'medium', ['inert-pair']);

add(T9, 9,
  '**Lanthanide contraction** is responsible for which two famous similarities in d-block?',
  '1. **Zr ≈ Hf** (atomic & ionic radii almost identical) → nearly identical chemistry.\n2. **Nb ≈ Ta, Mo ≈ W** — similar consequence. Hard to separate Zr/Hf, Nb/Ta industrially.',
  'medium', ['lanthanide-contraction']);

// ─────── ROLLOUT ───────
const STAMP_KEY = '2026-06-18b';
const OLD_ID_LO = 'FLASH-PHY-0733';
const OLD_ID_HI = 'FLASH-PHY-0755';

(async () => {
  console.log(`Prepared ${cards.length} cards for ch11_periodic (FLASH-INORG-${String(ID_START).padStart(4,'0')} → FLASH-INORG-${String(idCursor-1).padStart(4,'0')})`);
  const bad = cards.filter(c => /\$\$/.test(c.question) || /\$\$/.test(c.answer));
  if (bad.length) { console.error('$$', bad.map(b=>b.flashcard_id)); process.exit(1); }

  await mongoose.connect(process.env.MONGODB_URI);
  const c = mongoose.connection.db.collection('flashcards');

  const exists = await c.find({ flashcard_id: { $in: cards.map(c=>c.flashcard_id) } }).toArray();
  if (exists.length) { console.error('COLLISION', exists); process.exit(1); }

  if (process.argv.includes('--dry-run')) {
    console.log('Mix:', JSON.stringify(cards.reduce((a,c)=>{a[c.metadata.difficulty]=(a[c.metadata.difficulty]||0)+1;return a;},{})));
    console.log('Wishlist:', wishlist.length);
    await mongoose.disconnect(); return;
  }

  // 1. Snapshot the 23 old cards before soft-delete
  const oldDocs = await c.find({ flashcard_id: { $gte: OLD_ID_LO, $lte: OLD_ID_HI }, deleted_at: null }).toArray();
  const snapPath = `_agents/snapshots/flashcards_periodicity_rewrite_${STAMP_KEY}.json`;
  fs.writeFileSync(snapPath, JSON.stringify(oldDocs.map(d => ({ _id: d._id, flashcard_id: d.flashcard_id, deleted_at: null })), null, 2));
  console.log(`Snapshot ${oldDocs.length} old cards → ${snapPath}`);

  // 2. Soft-delete old
  const delRes = await c.updateMany(
    { flashcard_id: { $gte: OLD_ID_LO, $lte: OLD_ID_HI }, deleted_at: null },
    { $set: { deleted_at: STAMP, deletion_reason: 'periodicity-rewrite-2026-06-18 (replaced by FLASH-INORG-0957..)' } }
  );
  console.log(`Soft-deleted: ${delRes.modifiedCount} old cards`);

  // 3. Insert new
  const insRes = await c.insertMany(cards, { ordered: true });
  console.log(`Inserted: ${insRes.insertedCount} new cards`);
  console.log('Mix:', JSON.stringify(cards.reduce((a,c)=>{a[c.metadata.difficulty]=(a[c.metadata.difficulty]||0)+1;return a;},{})));

  fs.writeFileSync(`_agents/snapshots/flashcards_diagrams_wishlist_${CHAPTER.id}_rewrite.json`, JSON.stringify(wishlist, null, 2));
  console.log(`Wishlist: ${wishlist.length} entries`);

  console.log(`\nROLLBACK (restore old + delete new):`);
  console.log(`  node scripts/flashcards-cleanup/_rollback.js flashcards_periodicity_rewrite_${STAMP_KEY}.json`);
  console.log(`  db.flashcards.deleteMany({ flashcard_id: { $gte: "FLASH-INORG-${String(ID_START).padStart(4,'0')}", $lte: "FLASH-INORG-${String(idCursor-1).padStart(4,'0')}" } })`);

  await mongoose.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
