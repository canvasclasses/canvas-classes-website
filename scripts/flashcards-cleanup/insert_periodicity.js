/**
 * Periodic Table & Periodicity (ch11_periodic) — Class 11 Inorganic.
 * Uses FLASH-PHY prefix (continues 0732 → ).
 */
const fs = require('fs');
const dotenv = require('dotenv'); dotenv.config({ path: '.env.local' });
const mongoose = require('mongoose');

const CHAPTER = { id: 'ch11_periodic', name: 'Periodic Table & Periodicity', category: 'Physical Chemistry' };
const SOURCE = 'Canvas Chemistry';
const CLASS_NUM = 11;
const ID_START = 733;
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

// ═══════════ T1: Periodic Law & Classification ═══════════
const T1 = 'Periodic Law & Table Organization';

add(T1, 1,
  'State the **Modern Periodic Law**.',
  '*"The physical and chemical properties of elements are periodic functions of their **atomic numbers**."*\n\nReplaced Mendeleev\'s earlier "atomic mass" version. Atomic number (proton count) is the truly fundamental sequencing variable — it determines electronic configuration, which determines properties.',
  'easy', ['periodic-law']);

add(T1, 1,
  'Why was Mendeleev\'s "atomic mass" periodic law replaced by Moseley\'s "atomic number" version?',
  'Because there are *anomalies* in atomic-mass ordering: $Ar$ (40) before $K$ (39), $Te$ (128) before $I$ (127), $Co$ (59) before $Ni$ (58.7). Atomic *mass* puts these in the wrong group; atomic *number* puts each in the correct chemical family.\n\nMoseley\'s X-ray work in 1913 showed atomic number is the fundamental property.',
  'medium', ['periodic-law']);

add(T1, 1,
  '**Classification** — name the four blocks and the valence-shell configuration of each.',
  '- **s-block:** Groups 1, 2 (+ H, He). General: $ns^{1-2}$.\n- **p-block:** Groups 13-18. General: $ns^2 np^{1-6}$.\n- **d-block (transition):** Groups 3-12. General: $(n-1)d^{1-10} ns^{1-2}$.\n- **f-block (inner transition):** Lanthanides + Actinides. General: $(n-2)f^{1-14} (n-1)d^{0-1} ns^2$.',
  'medium', ['classification']);

// ═══════════ T2: Atomic & Ionic Radius ═══════════
const T2 = 'Atomic & Ionic Radius';

add(T2, 2,
  '**Periodic trends in atomic radius** — across a period and down a group.',
  '- **Across a period (L → R):** *Decreases.* More protons pull the same shell tighter; no new shell added.\n- **Down a group:** *Increases.* Each step adds a new shell → bigger atom; nuclear charge increase is *outweighed* by added shell.\n\nExceptions: noble gases listed with van der Waals radius (larger than predicted) — different measurement scale.',
  'easy', ['atomic-radius']);

add(T2, 2,
  '**Three types of atomic radius** — when do you use which?',
  '- **Covalent radius:** for atoms bonded covalently. Half of A–A bond length in $X_2$ molecule. Used for non-metals.\n- **Metallic radius:** half of M–M distance in metal lattice. Used for metals.\n- **Van der Waals radius:** half the distance between two non-bonded atoms (e.g. in $Cl_2$ crystal). Largest of the three; used for noble gases.\n\nFor the same element, $r_{vdW} > r_{metallic} > r_{covalent}$.',
  'medium', ['atomic-radius']);

add(T2, 2,
  '**Cation** vs **anion** vs **neutral atom** — radius order.',
  '$r(\\text{cation}) < r(\\text{neutral}) < r(\\text{anion})$.\n\n- Cation is smaller: fewer electrons, same nuclear charge → shells pulled in. Often *one fewer* shell (e.g. $Na: 2,8,1 \\to Na^+: 2,8$).\n- Anion is larger: more electrons, same nuclear charge → e–e repulsion expands the cloud.',
  'easy', ['ionic-radius']);

add(T2, 2,
  '**What if** — Compare radii of isoelectronic species: $N^{3-}, O^{2-}, F^-, Na^+, Mg^{2+}, Al^{3+}$.',
  'All have 10 electrons (Ne configuration), but **different nuclear charges**.\n\nAs Z increases, attraction on the same e⁻ cloud grows → radius *decreases*.\n\nOrder: $N^{3-} > O^{2-} > F^- > Na^+ > Mg^{2+} > Al^{3+}$.\n\nGeneral rule: in isoelectronic series, *more positive charge → smaller radius*.',
  'medium', ['ionic-radius', 'application']);

// ═══════════ T3: Ionization Energy ═══════════
const T3 = 'Ionization Energy';

add(T3, 3,
  'Define **Ionization Energy** ($IE_1$).',
  'Minimum energy required to remove the **most loosely held electron** from a *gaseous, isolated, neutral atom in its ground state* to form a gaseous cation:\n\n$X(g) \\to X^+(g) + e^- \\quad \\Delta H = IE_1 > 0$\n\nAlways positive (endothermic). Measured in kJ/mol or eV/atom.',
  'easy', ['ionization-energy']);

add(T3, 3,
  '**Trends in IE₁** — across period, down group, and the *two* second-period anomalies.',
  '- **Across period:** generally *increases* (more nuclear charge, same shell).\n- **Down group:** *decreases* (outer e⁻ further from nucleus, more shielding).\n\n**Anomalies in 2nd period:**\n1. $Be > B$ — Be ($2s^2$) is fully filled; B starts new 2p subshell, which is higher in energy.\n2. $N > O$ — N ($2p^3$) is half-filled (extra exchange stability); O has a paired 2p electron that\'s easier to remove.\n\nSimilar pattern in 3rd period: $Mg > Al$, $P > S$.',
  'hard', ['ionization-energy']);

add(T3, 3,
  '**Conceptual gap:** Why does $IE_2 \\gg IE_1$ for every element?',
  'After removing the first electron, the cation already has fewer electrons but the *same* nuclear charge → effective nuclear charge per electron rises → all remaining electrons are *more tightly* held → much more energy needed for the next removal.\n\nFor alkali metals, the jump $IE_2 \\gg IE_1$ is *enormous* because the second electron comes from a *new* (deeper, full) shell.',
  'medium', ['ionization-energy', 'conceptual']);

add(T3, 3,
  '**What if** — Na has the configuration $1s^2 2s^2 2p^6 3s^1$. Why is its $IE_2$ so dramatically higher than $IE_1$?',
  'After losing the $3s^1$ electron, $Na^+$ has the noble-gas configuration of neon: $1s^2 2s^2 2p^6$. \n\nRemoving the next electron means breaking into a *complete inner shell* — extremely high energy cost. This is *why* Na strongly prefers the +1 state and not +2.\n\nGeneral: huge jumps in successive IEs after each noble-gas-like configuration is reached.',
  'medium', ['ionization-energy', 'conceptual']);

add(T3, 3,
  '**Trap card:** Why does the *first* IE of nitrogen exceed that of oxygen, despite O being further right in the period?',
  'N\'s configuration: $1s^2 2s^2 2p^3$ — three unpaired electrons in degenerate 2p orbitals; **half-filled stability** (extra exchange energy).\n\nO: $1s^2 2s^2 2p^4$ — one pair in a 2p orbital; the paired electron experiences extra e–e repulsion → easier to remove.\n\nNet: O\'s outermost electron is *less* tightly bound than N\'s, despite O having higher Z. This is one of the most famous periodic anomalies.',
  'hard', ['ionization-energy']);

// ═══════════ T4: Electron Affinity ═══════════
const T4 = 'Electron Affinity';

add(T4, 4,
  'Define **Electron Affinity ($EA$)** — and clarify the sign convention.',
  '$X(g) + e^- \\to X^-(g) \\quad \\Delta H_{eg} = -EA$\n\n**EA is defined as energy released** when a gaseous atom gains an electron. (So $EA > 0$ for most non-metals.)\n\nThe more *negative* $\\Delta H_{eg}$, the more *positive* $EA$ → more energy released → atom likes to gain electrons.\n\nConfusion source: some textbooks use $\\Delta H_{eg}$ directly; sign flips. Be consistent.',
  'medium', ['electron-affinity']);

add(T4, 4,
  '**Trap card:** $EA$ of $F$ is *less* than $EA$ of $Cl$ — explain.',
  'Trend says EA should *decrease* down a group (larger atom, weaker pull on added electron). So why is $F < Cl$?\n\n**Reason:** F is tiny → the incoming electron must enter a *very compact* 2p subshell → high e–e repulsion → less energy released than expected.\n\nCl has 3p — a larger orbital → can accommodate the new electron more comfortably.\n\nSame anomaly: $O < S$, $N < P$ (across all 2nd-period vs 3rd-period electron affinities).',
  'hard', ['electron-affinity']);

add(T4, 4,
  '**Conceptual gap:** Why is the $EA$ of noble gases essentially zero (or negative)?',
  'Noble gases have *fully filled* outermost shells. Adding an electron would force it into the *next* (higher-energy) shell, with weak binding and high penalty.\n\nNo stability gain → process is endothermic → EA ≈ 0 or negative. This is why noble gases don\'t typically form anions.',
  'medium', ['electron-affinity', 'conceptual']);

// ═══════════ T5: Electronegativity ═══════════
const T5 = 'Electronegativity';

add(T5, 5,
  'Define **Electronegativity (EN)** and distinguish from $EA$.',
  '**EN:** the tendency of an atom *in a chemical bond* (not isolated) to attract the *shared* electron pair toward itself.\n\nKey differences from $EA$:\n- EA is for *isolated atoms* gaining an electron; EN is for *bonded atoms* sharing electrons.\n- EA has units (kJ/mol); EN is unitless on most scales.\n- EA can be measured directly; EN is a derived/relative quantity.',
  'medium', ['electronegativity']);

add(T5, 5,
  '**Periodic trends in EN** — across period and down group.',
  '- **Across period:** *Increases* (more protons, smaller atom → stronger pull on shared e⁻).\n- **Down group:** *Decreases* (larger atom, more shielding → weaker pull).\n\nMost EN element: **F** (Pauling EN = 4.0). Least EN: Cs/Fr (~0.7).',
  'easy', ['electronegativity']);

add(T5, 5,
  'Name the **three main EN scales** and what each is based on.',
  '- **Pauling scale:** based on bond dissociation energies. F = 4.0 reference. Most widely used.\n- **Mulliken scale:** average of IE and EA. $EN_M = \\dfrac{IE + EA}{2}$. Has physical units (kJ/mol).\n- **Allred-Rochow:** based on effective nuclear charge and atomic radius.\n\nValues differ in magnitude but trends agree. JEE problems usually use Pauling.',
  'medium', ['electronegativity']);

add(T5, 5,
  '**What if** — $EN$ difference between two atoms is 1.7. What is the predicted % ionic character of their bond (Pauling)?',
  'By Pauling\'s empirical scale: $\\Delta EN = 1.7$ → roughly **50% ionic character**.\n\nQuick rule of thumb:\n- $\\Delta EN < 0.4$ → essentially nonpolar covalent.\n- $0.4 < \\Delta EN < 1.7$ → polar covalent.\n- $\\Delta EN > 1.7$ → predominantly ionic.',
  'medium', ['electronegativity', 'shortcut']);

// ═══════════ T6: Diagonal Relationship & 2nd-period Anomalies ═══════════
const T6 = 'Diagonal Relationship & 2nd-Period Anomalies';

add(T6, 6,
  'What is the **Diagonal Relationship**? Give three classic pairs.',
  'Certain pairs of elements in the **2nd and 3rd periods that are diagonally adjacent** show striking chemical similarity, despite being in different groups.\n\nThree classic pairs:\n- **Li and Mg**\n- **Be and Al**\n- **B and Si**\n\nReason: opposing diagonal trends in atomic radius and charge density nearly cancel; the diagonal pair ends up with similar polarising power.',
  'medium', ['diagonal']);

add(T6, 6,
  '**What if** — Compare $Li$ and $Mg$ — name three similarities.',
  '1. **Both form normal oxides** ($Li_2O$, $MgO$) — not peroxides/superoxides like Na/K.\n2. **Both nitrides form directly with $N_2$** ($Li_3N$, $Mg_3N_2$) — unique among s-block.\n3. **Both have covalent character** in their compounds (Fajans: small cation + similar polarising power). E.g. $LiCl$, $MgCl_2$ both soluble in alcohols.\n\nAlso: similar bicarbonate solubility, similar reactivity with water (slow vs vigorous for other alkali metals).',
  'hard', ['diagonal', 'application']);

add(T6, 6,
  '**Anomalous behaviour of 2nd-period elements** — three reasons.',
  '1. **Small atomic size** (highest effective nuclear charge per shell).\n2. **High electronegativity / IE** (most non-metallic in their groups).\n3. **No vacant d-orbitals available** for bonding (forces simple octet, prevents expansion).\n\nConsequence: Li, Be, B, C, N, O, F all behave noticeably *differently* from the rest of their group.',
  'medium', ['second-period']);

add(T6, 6,
  '**Conceptual gap:** Why can\'t **N** form $NCl_5$ analogous to $PCl_5$?',
  'N is in period 2 → has *no* d-orbitals available. Maximum bonding capacity is 4 (octet limit).\n\nP is in period 3 → can use empty 3d orbitals to "expand its octet" to form $PCl_5$ ($sp^3d$ hybridization).\n\nSame reason F doesn\'t form pentahalides while Cl, Br, I do (e.g. $IF_7$, $BrF_5$).',
  'medium', ['second-period', 'conceptual']);

// ─────── INSERT ───────
(async () => {
  console.log(`Prepared ${cards.length} cards for ch11_periodic (FLASH-PHY-${String(ID_START).padStart(4,'0')} → FLASH-PHY-${String(idCursor-1).padStart(4,'0')})`);
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
