/** Chemical Bonding rewrite — punchy, PYQ-flavoured. Bigger deck (~70+). */
const fs = require('fs');
const dotenv = require('dotenv'); dotenv.config({ path: '.env.local' });
const mongoose = require('mongoose');

const CHAPTER = { id: 'ch11_bonding', name: 'Chemical Bonding', category: 'Physical Chemistry' };
const SOURCE = 'Canvas Chemistry'; const CLASS_NUM = 11;
const ID_START = 1400; const STAMP = new Date(); const STAMP_KEY = '2026-06-18c';
const OLD_LO = 'FLASH-PHY-0629', OLD_HI = 'FLASH-PHY-0678';

const cards = []; const wishlist = []; let idCursor = ID_START;
function add(topic, order, q, a, difficulty, tags = [], diagram = null) {
  const id = `FLASH-PHY-${String(idCursor).padStart(4, '0')}`; idCursor++;
  cards.push({ flashcard_id: id, chapter: CHAPTER, topic: { name: topic, order }, question: q.trim(), answer: a.trim(), metadata: { difficulty, tags, source: SOURCE, class_num: CLASS_NUM, created_at: STAMP, updated_at: STAMP }, deleted_at: null });
  if (diagram) wishlist.push({ flashcard_id: id, topic, ...diagram });
}

const T1 = 'Ionic Bond, Lattice Energy & Born-Haber';
add(T1, 1, 'Three favourable conditions for ionic bond formation.', '1. **Low IE** of metal\n2. **High EA** of non-metal\n3. **High lattice energy** of product', 'easy', ['ionic']);
add(T1, 1, 'Lattice energy — definition + sign.', '$U$ = energy released when 1 mol of ionic solid forms from gaseous ions.\n$M^+(g) + X^-(g) \\to MX(s)$, $\\Delta H = -U$ (exothermic).', 'medium', ['lattice']);
add(T1, 1, 'Lattice energy proportionality.', '$U \\propto \\dfrac{|z_+ z_-|}{r_+ + r_-}$\nHigher charges + smaller ions = stronger lattice.', 'medium', ['lattice', 'formula']);
add(T1, 1, 'Higher lattice energy: $NaF$ or $NaCl$? Why?', '**$NaF$** — same charges, but $F^-$ smaller → shorter distance → stronger Coulombic attraction.\n(Why $NaF$ melts higher than $NaCl$.)', 'medium', ['lattice']);
add(T1, 1, 'Order lattice energy: $MgO$, $NaCl$, $CaO$, $NaF$.', '$MgO > CaO > NaF > NaCl$.\nCharge product dominates: $MgO$ and $CaO$ (2×2 = 4) beat $NaF, NaCl$ (1×1 = 1).\nWithin same charge: smaller ions win.', 'hard', ['lattice']);
add(T1, 1, 'Born-Haber cycle — what is it used for?', '**Indirect calculation of lattice energy** via Hess\'s law using measurable steps (sublimation, IE, BDE, EA, $\\Delta H_f$).', 'medium', ['born-haber'], { side: 'Answer', priority: 'High', description: 'NaCl Born-Haber cycle: closed energy loop with sublimation, ionization, bond dissociation, electron affinity, lattice energy, and ΔHf labels.', notes: 'Quintessential cycle diagram.' });
add(T1, 1, '**Conceptual:** Why does $AgCl$ dissolve poorly in water despite ionic charges of ±1?', '$Ag^+$ is $d^{10}$ → highly polarizing → AgCl has significant **covalent character** (Fajans) → low solubility.\nHydration energy $<$ lattice energy.', 'medium', ['hydration', 'fajans']);

const T2 = 'Lewis Structures, Octet & Formal Charge';
add(T2, 2, 'Formal charge — formula.', '$\\text{FC} = (\\text{valence e}^-) - (\\text{LP e}^-) - \\tfrac{1}{2}(\\text{BP e}^-)$', 'medium', ['formal-charge']);
add(T2, 2, '**Best Lewis structure rules** (3 criteria).', '1. **Smallest** formal charges (ideally 0).\n2. Negative FC on **most electronegative** atom.\n3. Avoid like-sign FC on adjacent atoms.', 'medium', ['formal-charge', 'shortcut']);
add(T2, 2, 'Three octet-rule exceptions.', '| Type | Example |\n|---|---|\n| **Incomplete** | $BF_3$, $BeCl_2$, $AlCl_3$ |\n| **Expanded** | $PCl_5$, $SF_6$, $XeF_4$ |\n| **Odd-electron** | $NO$, $NO_2$, $ClO_2$ |', 'medium', ['octet']);
add(T2, 2, '**Why** can $P$ form $PCl_5$ but $N$ can\'t form $NCl_5$?', 'P (period 3) has empty **3d orbitals** → expanded octet possible.\nN (period 2) — no d-orbitals → max 8 electrons → no $NCl_5$.', 'medium', ['octet']);
add(T2, 2, 'Lewis structure of $SO_4^{2-}$ — formal charge distribution?', '4 resonance forms with 2 double + 2 single S–O bonds.\nDouble-bonded O: FC = 0; single-bonded O: FC = $-1$. Average bond order = 1.5; charges spread symmetrically.', 'hard', ['lewis'], { side: 'Both', priority: 'Medium', description: 'SO4^2- Lewis structure with one form showing 2 S=O (FC=0) + 2 S-O (FC=-1); plus side panel of all 4 equivalent resonance forms.', notes: 'Drawing beats ASCII attempts.' });

const T3 = 'Bond Parameters (Length, Energy, Order)';
add(T3, 3, 'Bond length order: $C-C$, $C=C$, $C\\equiv C$.', '**Single (154 pm) > Double (134) > Triple (120)**. More bonds → tighter.', 'easy', ['bond-length']);
add(T3, 3, 'Bond energy order: $C-C$, $C=C$, $C\\equiv C$.', '**Triple (839) > Double (614) > Single (347) kJ/mol.**\nBut triple < 3× single — π bonds are weaker than σ.', 'medium', ['bond-energy']);
add(T3, 3, 'Bond order in $O_3$?', '**1.5** — resonance hybrid of two structures. Both O–O bonds equal length (~128 pm).', 'medium', ['resonance']);
add(T3, 3, 'Bond order in $CO_3^{2-}$? Number of resonance forms?', '**1.33** (= (1+1+2)/3). **3 equivalent** resonance forms.\nAll three C–O bonds identical length (~129 pm).', 'medium', ['resonance']);
add(T3, 3, '**PYQ:** Order bond length: $N_2$, $N_2^+$, $N_2^-$, $N_2^{2-}$.', '$N_2 < N_2^+ < N_2^- < N_2^{2-}$ (bond order 3, 2.5, 2.5, 2).\nWait: $N_2^+$ (2.5) and $N_2^-$ (2.5) have same BO but $N_2^+$ slightly shorter due to fewer e⁻ repulsion. Higher BO → shorter.', 'hard', ['mot', 'pyq']);

const T4 = 'Dipole Moment & Polarity';
add(T4, 4, 'Dipole moment formula + unit.', '$\\mu = q \\times d$. Unit: **Debye** (1 D = $3.336 \\times 10^{-30}$ C·m). Vector quantity.', 'easy', ['dipole']);
add(T4, 4, '**Conceptual:** $CO_2$ has $\\mu = 0$, $H_2O$ has $\\mu = 1.85$ D. Why?', '- $CO_2$ **linear** → bond dipoles cancel.\n- $H_2O$ **bent** (~104.5°) → dipoles add → net $\\mu$.\n\nPolar bonds + symmetric geometry can cancel.', 'medium', ['dipole', 'conceptual'], { side: 'Answer', priority: 'High', description: 'LEFT: linear CO2, two equal opposite arrows, NET=0. RIGHT: bent H2O, two arrows at 104.5°, resultant arrow down. Makes vector cancellation visceral.', notes: 'Canonical polarity diagram.' });
add(T4, 4, '**Trap:** $BF_3$ vs $NF_3$ — which has $\\mu \\neq 0$?', '**$NF_3$** ($\\mu = 0.23$ D). $BF_3$ trigonal planar (cancels). $NF_3$ pyramidal (lone pair → asymmetric).', 'medium', ['dipole']);
add(T4, 4, '**Trap PYQ:** $NH_3$ ($\\mu = 1.47$ D) vs $NF_3$ (0.23 D). Why is $NH_3$ more polar despite F being more EN than H?', 'In $NH_3$: lone-pair dipole and 3 N–H bond dipoles point **same direction** (toward N) → add.\nIn $NF_3$: 3 N–F dipoles point **away** from N → partially **cancel** the LP dipole.', 'hard', ['dipole', 'pyq']);
add(T4, 4, '% ionic character (Pauling) — formula.', '$\\% = \\dfrac{\\mu_{\\text{obs}}}{\\mu_{\\text{ionic}}} \\times 100$, where $\\mu_{\\text{ionic}} = e \\times d$ (full transfer).\nE.g. HCl ≈ 17% ionic.', 'medium', ['ionic-character']);
add(T4, 4, 'Among $H_2O$, $H_2S$, $H_2Se$ — order dipole moment.', '$H_2O > H_2S > H_2Se$. EN difference shrinks down group → weaker bond dipoles.', 'medium', ['dipole']);

const T5 = 'Fajans\' Rule & Covalent Character';
add(T5, 5, 'Fajans\' Rules — when does covalent character increase?', '1. **High charge** (cation or anion)\n2. **Small cation** (high charge density)\n3. **Large anion** (more polarizable)\n4. **$d^{10}$ cation** (e.g. $Ag^+$, $Cu^+$, $Zn^{2+}$)', 'medium', ['fajans']);
add(T5, 5, 'Covalent character order: $LiCl$, $NaCl$, $KCl$, $CsCl$.', '$LiCl > NaCl > KCl > CsCl$. Smaller cation = more polarizing = more covalent.\n$LiCl$ is even soluble in organic solvents.', 'medium', ['fajans']);
add(T5, 5, 'Among $LiF$, $LiCl$, $LiBr$, $LiI$ — most covalent?', '**$LiI$.** Same cation; largest anion = most polarizable.\n(Most ionic: $LiF$.)', 'medium', ['fajans']);
add(T5, 5, '**Trap PYQ:** $AgCl$ vs $NaCl$ — which is more covalent and why?', '**$AgCl$.** $Ag^+$ is $d^{10}$ (pseudo noble-gas), much more polarizing than $Na^+$ (true noble-gas) → strong covalent character.', 'medium', ['fajans', 'pyq']);

const T6 = 'VSEPR & Molecular Geometry';
add(T6, 6, 'VSEPR central idea.', 'Electron pairs in valence shell (BP + LP) **repel each other** and arrange to be as far apart as possible.', 'easy', ['vsepr']);
add(T6, 6, 'Repulsion order: LP–LP, LP–BP, BP–BP.', '**LP–LP > LP–BP > BP–BP.**\nLone pairs spread further out (single nucleus pull) → repel more.\nConsequence: $CH_4$ 109.5°, $NH_3$ 107°, $H_2O$ 104.5°.', 'medium', ['vsepr']);
add(T6, 6, 'VSEPR shapes (steric 2–6, all BP).', '| Steric # | Shape | Angle | Example |\n|---|---|---|---|\n| 2 | Linear | 180° | $BeCl_2$ |\n| 3 | Trigonal planar | 120° | $BF_3$ |\n| 4 | Tetrahedral | 109.5° | $CH_4$ |\n| 5 | Trigonal bipyramidal | 90,120° | $PCl_5$ |\n| 6 | Octahedral | 90° | $SF_6$ |', 'medium', ['vsepr'], { side: 'Answer', priority: 'High', description: 'Five-panel 3D reference of all five ideal VSEPR shapes with bond angles + examples.', notes: 'Foundational reference image — embed permanently.' });
add(T6, 6, '4-pair electron geometry — molecular shapes by LP count.', '| LPs | Shape | Example | Angle |\n|---|---|---|---|\n| 0 | Tetrahedral | $CH_4$ | 109.5° |\n| 1 | Trigonal pyramidal | $NH_3$ | 107° |\n| 2 | Bent | $H_2O$ | 104.5° |', 'medium', ['vsepr']);
add(T6, 6, '**Conceptual:** $H_2O$ 104.5°, $H_2S$ 92°, $H_2Se$ 91°. Why decrease down group?', 'Hybridization decreases down group (closer to pure p orbitals, ~90°). Also bond pairs spread less → LP repulsion compresses angle more.', 'hard', ['vsepr']);
add(T6, 6, '**Predict shape of $XeF_4$.**', 'Xe: 8 valence e⁻. 4 in bonds + 2 LPs = steric 6 → octahedral electron geometry.\nLPs trans (opposite) to minimize repulsion → **square planar** molecular shape.', 'hard', ['vsepr', 'application']);
add(T6, 6, '**Trap:** Are all P–Cl bonds in $PCl_5$ equivalent?', '**No.** Trigonal bipyramidal: 3 equatorial (120°) + 2 axial (90°). Axial slightly longer (more 90° repulsion from equatorials).\nBent\'s rule: LPs and larger ligands prefer equatorial.', 'medium', ['vsepr']);
add(T6, 6, 'Shape of $SF_4$, $ClF_3$, $XeF_2$ (steric 5 with LPs).', '| Molecule | LPs | Shape |\n|---|---|---|\n| $SF_4$ | 1 | See-saw |\n| $ClF_3$ | 2 | T-shape |\n| $XeF_2$ | 3 | Linear |\n\nLPs always go equatorial.', 'hard', ['vsepr']);

const T7 = 'VBT & Hybridization';
add(T7, 7, 'Hybridization — what is it?', 'Mixing of atomic orbitals on same atom → equivalent **hybrid orbitals** with new shapes/energies.\nExplains why $CH_4$ has 109.5° (not 90° from pure p).', 'easy', ['hybridization']);
add(T7, 7, 'Hybridization counting rule (shortcut).', 'Steric number = (# σ bonds) + (# LPs)\n| # | Hybrid | Shape |\n|---|---|---|\n| 2 | sp | linear |\n| 3 | $sp^2$ | trigonal planar |\n| 4 | $sp^3$ | tetrahedral |\n| 5 | $sp^3d$ | TBP |\n| 6 | $sp^3d^2$ | octahedral |\n\nπ bonds don\'t change count.', 'medium', ['hybridization', 'shortcut']);
add(T7, 7, 's-character of sp, $sp^2$, $sp^3$ — and what it predicts.', '| Hybrid | %s | Bond | Acidity |\n|---|---|---|---|\n| sp | 50% | shortest, strongest | most acidic |\n| $sp^2$ | 33% | mid | mid |\n| $sp^3$ | 25% | longest | least acidic |\n\nWhy alkynes ($sp$ C–H) are more acidic than alkanes.', 'medium', ['hybridization', 'shortcut']);
add(T7, 7, '**Conceptual:** $CH_4$, $NH_3$, $H_2O$ all $sp^3$. Why different bond angles?', 'Idealized 109.5°. Lone pair repulsion squeezes BP–BP angle:\n- $CH_4$: 0 LP → 109.5°\n- $NH_3$: 1 LP → 107°\n- $H_2O$: 2 LP → 104.5°', 'medium', ['hybridization']);
add(T7, 7, 'Two limitations of VBT.', '1. Can\'t explain **paramagnetism of $O_2$**.\n2. Fails for **odd-electron** species ($H_2^+$, $He_2^+$).\nMOT needed.', 'medium', ['vbt']);

const T8 = 'Bent\'s Rule, Drago\'s & Back-Bonding';
add(T8, 8, 'Bent\'s Rule — one-line.', '**More electronegative substituents prefer orbitals with more p-character**; more electropositive (or LPs) prefer more s-character.', 'hard', ['bent']);
add(T8, 8, '**Trap:** In $CH_2F_2$, are H–C–H and F–C–F angles both 109.5°?', '**No.**\n- H–C–H: more s-character → opens wider (~112°)\n- F–C–F: more p-character → closes narrower (~108°)\n\nBent\'s rule prediction matches experiment.', 'hard', ['bent', 'application']);
add(T8, 8, 'Drago\'s Rule — when does central atom NOT hybridize?', 'For 3rd-period (or below) elements with low EN bonded to highly EN atoms — uses **pure p orbitals**, angles ~90°.\nE.g. $PH_3$ (94°), $H_2S$ (92°), $AsH_3$ (92°).', 'hard', ['drago']);
add(T8, 8, 'Back-bonding (back-donation) — one example.', 'Substituent\'s LP donates into **empty orbital** on central atom → partial π bond.\n**$BF_3$:** F LP → empty 2p of B → partial B=F character. Makes $BF_3$ weaker Lewis acid than $BCl_3, BBr_3$.', 'hard', ['back-bonding'], { side: 'Answer', priority: 'Medium', description: 'BF3 with curved arrows from F lone pairs into empty p-orbital on B, partial π bond labelled.', notes: 'Electron-flow diagram essential.' });
add(T8, 8, 'Order Lewis acidity: $BF_3$, $BCl_3$, $BBr_3$.', '$BF_3 < BCl_3 < BBr_3$.\nBack-bonding strongest in $BF_3$ (F closest in size to B) → most "satisfied" → least Lewis-acidic.\nCounterintuitive — F is most EN but back-bonding dominates.', 'hard', ['back-bonding', 'pyq']);

const T9 = 'Molecular Orbital Theory (MOT)';
add(T9, 9, 'MOT central idea (one-line).', '**Atomic orbitals on different atoms combine (LCAO) → molecular orbitals** spanning the whole molecule. N AOs → N MOs (half bonding, half antibonding).', 'medium', ['mot']);
add(T9, 9, 'Bond order formula in MOT.', '$\\text{BO} = \\dfrac{N_b - N_a}{2}$\nHigher BO → shorter, stronger bond. BO = 0 → molecule doesn\'t exist.', 'easy', ['mot', 'formula']);
add(T9, 9, '**Conceptual:** Why is $He_2$ unstable but $He_2^+$ exists?', '$He_2$: BO = $(2-2)/2 = 0$ → no bond.\n$He_2^+$: BO = $(2-1)/2 = 0.5$ → weak but real bond (seen in mass spec).', 'medium', ['mot']);
add(T9, 9, '$O_2$ MO config, BO, magnetism.', '$\\sigma_{1s}^2 \\sigma^*_{1s}^2 \\sigma_{2s}^2 \\sigma^*_{2s}^2 \\sigma_{2p_z}^2 \\pi_{2p}^4 \\pi^*_{2p}^2$\n**BO = 2**, **Paramagnetic** (2 unpaired in $\\pi^*$).\nMOT\'s great triumph — VBT predicted diamagnetic.', 'hard', ['mot'], { side: 'Answer', priority: 'High', description: 'O2 MO energy-level diagram: 2s/2p AOs on sides, central MOs filled with 16 e⁻; highlight 2 unpaired in π* explaining paramagnetism.', notes: 'Essential MOT image.' });
add(T9, 9, '**Trap:** MO energy order — $N_2$ vs $O_2$. What differs?', 'Light ($Li_2$ → $N_2$): $\\sigma_{2p_z}$ **above** $\\pi_{2p}$ (sp mixing).\nHeavier ($O_2, F_2$): $\\sigma_{2p_z}$ **below** $\\pi_{2p}$ (normal order, less mixing).\nForgetting this gives wrong magnetic predictions.', 'hard', ['mot']);
add(T9, 9, 'Compare BO + stability: $O_2$, $O_2^+$, $O_2^-$, $O_2^{2-}$.', '| Species | BO |\n|---|---|\n| $O_2^+$ | 2.5 |\n| $O_2$ | 2 |\n| $O_2^-$ | 1.5 |\n| $O_2^{2-}$ | 1 |\n\nStrength: $O_2^+ > O_2 > O_2^- > O_2^{2-}$.', 'hard', ['mot']);
add(T9, 9, 'BO of $N_2$ vs $N_2^+$ — which is more stable?', '$N_2$: BO = 3 (full triple bond, all $\\pi$ + $\\sigma$ bonding).\n$N_2^+$: BO = 2.5 (lost a bonding e⁻).\n**$N_2 > N_2^+$** in stability. (Contrast $O_2^+ > O_2$ — removing an antibonding e⁻ strengthens.)', 'hard', ['mot']);

const T10 = 'Hydrogen Bonding & Intermolecular Forces';
add(T10, 10, 'H-bond — three requirements.', '1. H bonded to **F, O, or N** (donor)\n2. Lone pair on another **F, O, or N** (acceptor)\n3. Linear (180°) X–H...Y geometry strongest', 'easy', ['h-bond']);
add(T10, 10, 'Intermolecular vs intramolecular H-bonding — effects.', '| Type | Effect |\n|---|---|\n| Intermolecular | ↑ BP, ↑ viscosity, ↑ solubility in $H_2O$ |\n| Intramolecular | ↓ BP, ↓ solubility (molecule "satisfies itself") |\n\nE.g. $o$-nitrophenol (intramolecular) BP < $p$-nitrophenol (intermolecular).', 'medium', ['h-bond']);
add(T10, 10, '**Why** is $o$-nitrophenol more volatile than $p$-nitrophenol?', '$o$: intramolecular H-bond (OH...O=N) → no need for intermolecular network → easier to vaporize.\n$p$: only intermolecular network → stronger total → higher BP.\nBPs: $o$ ≈ 217°C, $p$ ≈ 279°C.', 'medium', ['h-bond'], { side: 'Answer', priority: 'Medium', description: 'LEFT: o-nitrophenol with dotted intramolecular H-bond to adjacent NO2. RIGHT: two p-nitrophenol molecules with intermolecular dotted bonds.', notes: 'Geometric explanation much clearer with a picture.' });
add(T10, 10, 'Three anomalies of water explained by H-bonding.', '1. **Abnormally high BP** (100°C vs $H_2S$ −60°C)\n2. **Ice less dense than water** (open 3D H-bond lattice → floats)\n3. **High specific heat + latent heats** (energy to break H-bonds)', 'medium', ['h-bond']);
add(T10, 10, 'Strength order of H-bonds: F–H...F, O–H...O, N–H...N.', '$F-H...F > O-H...O > N-H...N$. Higher EN of donor atom → stronger dipole → stronger H-bond.\n$(HF)_n$ exists as zigzag chains.', 'medium', ['h-bond']);
add(T10, 10, 'Order BP: $HF$, $HCl$, $HBr$, $HI$.', '**$HF > HI > HBr > HCl$.**\n$HF$ unusually high (H-bonding). Among rest: BP increases with size (more London dispersion).\nClassic anomaly + monotonic-down-from-Cl trend.', 'hard', ['h-bond', 'pyq']);

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
