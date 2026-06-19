/**
 * Chemical Bonding (ch11_bonding) — Class 11 Inorganic Chemistry.
 * Continues FLASH-PHY sequence (Chem Eq tail: 0628). Note: ch11_bonding is
 * classified as 'inorganic' chapterType, but for flashcard ID continuity we
 * keep the FLASH-PHY prefix that the existing Atomic Structure (also ch11)
 * uses. The flashcard chapter is still under "Physical Chemistry" category
 * to match the existing Atomic Structure placement.
 *
 * Actually: existing flashcardTaxonomy splits Bonding into 'Inorganic Structures'
 * already under Inorganic. We'll add Chemical Bonding as a NEW deck under
 * Physical (per the Crucible chapter classification 'inorganic' but flashcard
 * categorisation follows existing taxonomy pragmatically — Atomic Structure is
 * under Physical too despite covering quantum-mechanical inorganic foundations).
 *
 * Decision: place under Physical Chemistry to sit next to Atomic Structure
 * (logical pedagogical pairing: atoms → bonding).
 */
const fs = require('fs');
const dotenv = require('dotenv'); dotenv.config({ path: '.env.local' });
const mongoose = require('mongoose');

const CHAPTER = { id: 'ch11_bonding', name: 'Chemical Bonding', category: 'Physical Chemistry' };
const SOURCE = 'Canvas Chemistry';
const CLASS_NUM = 11;
const ID_START = 629;
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

// ═══════════ T1: Ionic Bond, Lattice Energy & Born-Haber ═══════════
const T1 = 'Ionic Bond, Lattice Energy & Born-Haber';

add(T1, 1,
  'List the **three favourable conditions** for ionic bond formation.',
  '1. **Low ionization energy** of the metal (easy to lose electrons; large atoms, low EN).\n2. **High electron affinity** of the non-metal (gains electrons readily).\n3. **High lattice energy** of the resulting solid (the released crystal-formation energy must compensate for IE + EA cost).\n\nGroup-1 metals + Group-17 non-metals (e.g. NaCl, KBr) fit all three.',
  'easy', ['ionic']);

add(T1, 1,
  'Define **Lattice Energy** with sign convention.',
  'Lattice Energy ($U$) is the energy *released* when 1 mole of an ionic solid is formed from its gaseous ions:\n\n$M^+(g) + X^-(g) \\to MX(s) \\quad \\Delta H = -U$ (exothermic; $U > 0$ as a magnitude).\n\nThe more *negative* $\\Delta H$ (i.e. larger magnitude of $U$), the more stable the ionic lattice.',
  'medium', ['lattice-energy']);

add(T1, 1,
  '**Formula** — Lattice energy proportionality (qualitative).',
  '$U \\propto \\dfrac{|z_+ \\cdot z_-|}{r_+ + r_-}$\n\nwhere $z_\\pm$ are ionic charges and $r_\\pm$ are ionic radii. So:\n- Higher charges → stronger lattice.\n- Smaller ions → stronger lattice.\n\nE.g. $MgO$ (2+/2−, small ions) has much higher U than $NaCl$ (1+/1−).',
  'medium', ['lattice-energy', 'formula']);

add(T1, 1,
  '**Conceptual gap:** Which has the higher lattice energy — $NaF$ or $NaCl$? Why?',
  '**$NaF$**. Both have same charges ($\\pm 1$); $F^-$ is smaller than $Cl^-$ → smaller inter-ion distance → larger Coulombic attraction → higher U.\n\n(This is why $NaF$ has a higher melting point than $NaCl$.)',
  'medium', ['lattice-energy', 'conceptual']);

add(T1, 1,
  'What is the **Born-Haber cycle**?',
  'A thermodynamic cycle (Hess\'s law applied) for an ionic compound that lets you *calculate* the lattice energy *indirectly* from experimentally measurable quantities: sublimation enthalpy, ionization energy, bond dissociation energy, electron affinity, and the standard enthalpy of formation.\n\n$\\Delta H_f^\\circ = \\Delta H_{\\text{sub}} + \\frac{1}{2}\\Delta H_{\\text{diss}} + IE + EA + (-U)$\n\nSolve for $U$.',
  'medium', ['born-haber'],
  { side: 'Answer', priority: 'High', description: 'Classic Born-Haber cycle diagram for NaCl: a closed energy-level loop showing Na(s)+½Cl2(g) → NaCl(s) at the bottom, with intermediate steps Na(g), Na+(g)+e-, Cl(g), Cl-(g), and the dashed lattice-energy arrow. Each step labelled with its ΔH (sublimation, ionization, bond dissociation, electron affinity, lattice energy).', notes: 'Quintessential cycle diagram — text alone cannot do it justice.' });

add(T1, 1,
  '**What if** — Why is solubility of ionic compounds in water possible despite enormous lattice energies?',
  'Because **hydration energy** (energy released when gaseous ions are surrounded by water dipoles) can compensate.\n\nSolution rule of thumb: dissolves if $|\\Delta H_{\\text{hyd}}| \\gtrsim U$. E.g. $NaCl$ dissolves; $AgCl$ doesn\'t (lattice energy too large vs hydration).',
  'medium', ['hydration', 'application']);

// ═══════════ T2: Lewis Structures, Octet, Formal Charge ═══════════
const T2 = 'Lewis Structures, Octet & Formal Charge';

add(T2, 2,
  '**Formal charge** formula — write it and explain each term.',
  '$\\text{Formal charge} = (\\text{valence electrons}) - (\\text{lone pair electrons}) - \\dfrac{1}{2}(\\text{bonding electrons})$\n\nIt is the *hypothetical* charge an atom would have if bonding electrons were shared equally. Sum of formal charges = net charge on molecule/ion.',
  'medium', ['formal-charge', 'formula']);

add(T2, 2,
  '**Shortcut** — Among multiple valid Lewis structures, which is the *most stable*?',
  'The one with:\n1. The **smallest** formal charges (ideally 0 on every atom).\n2. Any negative formal charge sitting on the **most electronegative** atom.\n3. Adjacent atoms not carrying like-sign formal charges.\n\nThis is why $CO_2$ is $O=C=O$ (zero formal charges everywhere), not $:C\\equiv O - O:$.',
  'medium', ['formal-charge', 'shortcut']);

add(T2, 2,
  '**List exceptions to the octet rule** (three categories).',
  '1. **Incomplete octet** — central atom has < 8 electrons. E.g. $BF_3$ (B has 6), $BeCl_2$ (Be has 4), $AlCl_3$.\n2. **Expanded octet** — central atom has > 8 (requires available d-orbitals, so 3rd period or below). E.g. $PCl_5$ (10), $SF_6$ (12), $XeF_4$ (12).\n3. **Odd-electron species** — total e⁻ is odd → no way to pair all. E.g. $NO$ (11), $NO_2$ (17), $ClO_2$.',
  'medium', ['octet']);

add(T2, 2,
  '**What if** — Sketch the Lewis structure of $SO_4^{2-}$ and identify which O bears a formal charge.',
  'Central S, four O\'s around it. With S–O double bonds on two of the four (expanded octet on S), the two single-bonded O\'s carry formal charge $-1$ each. Two double-bonded O\'s carry formal charge 0.\n\nResonance averages: bond order on each S–O = 1.5; effective charge spreads symmetrically over the 4 O\'s.',
  'hard', ['lewis', 'application'],
  { side: 'Both', priority: 'Medium', description: 'SO4^2- Lewis structure with one resonance form drawn: central S, two S=O double bonds (drawn as double lines, O atoms with formal charge 0), two S–O single bonds (single lines, O atoms with formal charge −1 each). Plus a separate panel showing all four equivalent resonance structures.', notes: 'Lewis-structure cards land much better with an actual drawing than ASCII attempts.' });

// ═══════════ T3: Bond Parameters ═══════════
const T3 = 'Bond Parameters (Length, Energy, Order)';

add(T3, 3,
  '**Bond length trend** — Compare $C-C$, $C=C$, $C \\equiv C$.',
  'Single (154 pm) > Double (134 pm) > Triple (120 pm).\n\nMore bonds → atoms held closer → shorter bond. The same trend applies in $O-O / O=O$, $N-N / N=N / N\\equiv N$, etc.',
  'easy', ['bond-length']);

add(T3, 3,
  '**Bond energy trend** — Compare $C-C$, $C=C$, $C \\equiv C$.',
  'Triple (839 kJ/mol) > Double (614) > Single (347).\n\n*But*: triple bond energy < 3 × single. The second and third π-bonds are weaker than the σ-bond. (This is why triple bonds open up easily in addition reactions.)',
  'medium', ['bond-energy']);

add(T3, 3,
  '**Conceptual gap:** Bond order in $O_3$ (ozone) is 1.5 — explain.',
  'Ozone is a resonance hybrid of two Lewis structures: $O=O-O \\leftrightarrow O-O=O$. The two O–O links average to 1.5 each. This is why both O–O bonds in $O_3$ have the *same* length (~127.8 pm), intermediate between single (148) and double (121).',
  'medium', ['resonance', 'bond-order']);

add(T3, 3,
  '**What if** — Bond order in $CO_3^{2-}$? How many resonance structures?',
  '$CO_3^{2-}$ has **3 equivalent resonance structures** (the C=O double bond rotates between the three O\'s). Bond order on each C–O = $\\dfrac{1 + 1 + 2}{3} = 1.33$.\n\nThis is why all three C–O bonds in carbonate are identical in length (~129 pm).',
  'medium', ['resonance', 'bond-order', 'application']);

// ═══════════ T4: Dipole Moment & Polarity ═══════════
const T4 = 'Dipole Moment & Molecular Polarity';

add(T4, 4,
  'Define **dipole moment** ( $\\mu$ ) with units.',
  '$\\mu = q \\times d$\n\nwhere $q$ is the magnitude of separated charge and $d$ is the distance between centres. Units: **Debye (D)**, where $1 D = 3.336 \\times 10^{-30}$ C·m.\n\nVector quantity — direction from + to − (or − to + by IUPAC convention; either is fine if consistent).',
  'easy', ['dipole']);

add(T4, 4,
  '**Conceptual gap:** $H_2O$ has $\\mu = 1.85$ D. $CO_2$ has $\\mu = 0$ D. Both have polar bonds — why does one have zero dipole?',
  '**Geometry / symmetry.**\n- $CO_2$: linear (O=C=O). Two equal-magnitude, opposite-direction C=O dipoles **cancel** vectorially. Net $\\mu = 0$.\n- $H_2O$: bent (~104.5°). Two O–H dipoles **add** (not cancel) → net $\\mu \\neq 0$.\n\nLesson: **polar bonds + non-symmetric geometry = polar molecule**. Polar bonds in symmetric geometry can cancel.',
  'medium', ['dipole', 'conceptual'],
  { side: 'Answer', priority: 'High', description: 'Side-by-side: (LEFT) Linear CO2 with two equal arrows pointing opposite, large \'NET = 0\' below. (RIGHT) Bent H2O with two arrows at ~104.5° angle, resultant arrow drawn pointing downward through O, label \'NET μ ≠ 0\'. Makes vector cancellation visceral.', notes: 'This is THE classic polarity diagram. Worth doing carefully.' });

add(T4, 4,
  '**Trap card:** $BF_3$ vs $NF_3$ — both have polar bonds. Which has $\\mu \\neq 0$?',
  '$NF_3$ has $\\mu \\approx 0.23$ D (small but nonzero). $BF_3$ has $\\mu = 0$.\n\nWhy: $BF_3$ is trigonal planar (symmetric, three F\'s in a flat triangle → bond dipoles cancel). $NF_3$ is trigonal pyramidal (N has a lone pair → asymmetric → dipoles don\'t cancel).\n\nFor the same reason: $BCl_3$ ($\\mu=0$) vs $NH_3$ ($\\mu=1.47$ D).',
  'medium', ['dipole', 'application']);

add(T4, 4,
  '**What if** — Among $NH_3$ ($\\mu=1.47$ D) and $NF_3$ ($\\mu=0.23$ D), why is $NH_3$ much more polar even though F is more electronegative than H?',
  'In $NH_3$: lone-pair dipole and three N–H bond dipoles all point in the **same** direction (N is the negative end of all of them). They add.\n\nIn $NF_3$: lone-pair dipole points up; the three N–F bond dipoles point *away from N* (toward F) — i.e. **opposite** to lone pair dipole. They partially cancel.\n\nNet result: $NH_3$ adds, $NF_3$ subtracts → $NH_3$ wins despite F being more EN than H.',
  'hard', ['dipole', 'conceptual']);

add(T4, 4,
  '**Percent ionic character** formula (Pauling).',
  '$\\% \\text{ ionic} = \\dfrac{\\mu_{\\text{observed}}}{\\mu_{\\text{ionic (theoretical, 100\\%)}}} \\times 100$\n\nWhere $\\mu_{\\text{ionic}} = e \\times d$ (charge × bond length, assuming full transfer).\n\nE.g. HCl: $\\mu_{obs} = 1.03$ D, $\\mu_{ionic} = 6.07$ D → 17% ionic.',
  'medium', ['ionic-character', 'formula']);

// ═══════════ T5: Fajans' Rule ═══════════
const T5 = 'Fajans\' Rule & Covalent Character in Ionic Bonds';

add(T5, 5,
  'State **Fajans\' Rules** — when does an ionic bond gain covalent character?',
  '**Increasing covalent character with:**\n1. **High charge** on cation/anion (more polarizing power / more polarizable).\n2. **Small cation** (high charge density).\n3. **Large anion** (more polarizable — its electron cloud distorts easily).\n4. **Cation with pseudo-noble gas configuration** ($d^{10}$, e.g. $Cu^+$, $Ag^+$, $Zn^{2+}$) — more polarizing than alkali metals.',
  'medium', ['fajans']);

add(T5, 5,
  '**Conceptual gap:** Why is $AgCl$ less soluble in water than $NaCl$, even though both are "1+/1−" ionic chlorides?',
  '$Ag^+$ is a $d^{10}$ pseudo-noble-gas cation → much more polarizing than $Na^+$ (which is true noble-gas). $AgCl$ is significantly **covalent in character** by Fajans, so it doesn\'t dissociate well in water → low solubility. $NaCl$ is essentially fully ionic → highly soluble.',
  'medium', ['fajans', 'conceptual']);

add(T5, 5,
  '**Trend** — Order $LiCl$, $NaCl$, $KCl$, $CsCl$ by covalent character.',
  '$LiCl$ > $NaCl$ > $KCl$ > $CsCl$.\n\nReason: smaller cation = more polarizing. $Li^+$ is the smallest in the series → polarizes $Cl^-$ most → most covalent. $CsCl$ is the most ionic.\n\nThis matches reality: $LiCl$ is soluble in organic solvents (covalent character), $CsCl$ isn\'t.',
  'medium', ['fajans']);

add(T5, 5,
  '**What if** — Among $LiF$, $LiCl$, $LiBr$, $LiI$, which is **most** covalent? Why?',
  '$LiI$. Same cation ($Li^+$); the anion size grows down the halogen group. Largest anion ($I^-$) = most polarizable → most covalent character.\n\nAccordingly, $LiF$ is the most ionic of the lithium halides (smallest, hardest anion).',
  'medium', ['fajans', 'application']);

// ═══════════ T6: VSEPR & Geometry ═══════════
const T6 = 'VSEPR & Molecular Geometry';

add(T6, 6,
  'State the **central idea** of VSEPR.',
  'Electron pairs in the valence shell of a central atom (both bond pairs and lone pairs) repel one another and arrange themselves to be as far apart as possible — minimising repulsion. This arrangement determines the molecular geometry.',
  'easy', ['vsepr']);

add(T6, 6,
  '**VSEPR repulsion order** — Rank lone pair (LP) and bond pair (BP) repulsions.',
  '**LP–LP > LP–BP > BP–BP**\n\nWhy: lone pairs are held by only one nucleus → "fatter," extend further out → repel more strongly.\n\nConsequence: each lone pair *compresses* the adjacent BP–BP angle. E.g. $CH_4$ angle = 109.5°; $NH_3$ = 107°; $H_2O$ = 104.5°.',
  'medium', ['vsepr']);

add(T6, 6,
  '**Shape table** — Geometry for steric numbers 2 → 6 (all bond pairs, no LP).',
  '| Steric # | Geometry | Bond angle | Example |\n|---|---|---|---|\n| 2 | Linear | 180° | $BeCl_2$, $CO_2$ |\n| 3 | Trigonal planar | 120° | $BF_3$, $SO_3$ |\n| 4 | Tetrahedral | 109.5° | $CH_4$, $NH_4^+$ |\n| 5 | Trigonal bipyramidal | 90°, 120° | $PCl_5$ |\n| 6 | Octahedral | 90° | $SF_6$ |',
  'medium', ['vsepr'],
  { side: 'Answer', priority: 'High', description: 'Five-panel chart showing the 5 ideal VSEPR shapes in 3D: linear, trigonal planar, tetrahedral, trigonal bipyramidal, octahedral. Each labelled with steric number, bond angles, and one example molecule. The canonical VSEPR reference image.', notes: 'Every student needs this picture; it should be embedded permanently.' });

add(T6, 6,
  '**Shapes with lone pairs** — geometry vs *molecular shape* (4 BP and 4-pair LP variants).',
  '4-pair electron geometry is always tetrahedral. Molecular shape depends on how many of those pairs are lone:\n- 0 LP: **tetrahedral** ($CH_4$, 109.5°)\n- 1 LP: **trigonal pyramidal** ($NH_3$, 107°)\n- 2 LP: **bent / angular** ($H_2O$, 104.5°)\n\nMolecular shape ignores lone pairs in its name, but their *presence* shrinks bond angles.',
  'medium', ['vsepr']);

add(T6, 6,
  '**Conceptual gap:** $H_2O$ bond angle is 104.5°, $H_2S$ is 92°, $H_2Se$ is 91°. Why does it decrease down the group?',
  'Going down: central atom becomes larger and less electronegative. Bond pairs spend less time near the central atom (longer, weaker bonds). The lone pair repulsions therefore become *relatively* more dominant → compress the bond angle further.\n\nAlso, hybridization decreases: O is roughly $sp^3$; S, Se use closer-to-pure p-orbitals → ~90° angles.',
  'hard', ['vsepr', 'conceptual']);

add(T6, 6,
  '**What if** — Predict the shape of $XeF_4$.',
  '$Xe$ valence e⁻ = 8. In $XeF_4$, 4 are used in bonds → 4 left as 2 lone pairs. Steric number = 4 + 2 = 6 → **electron geometry: octahedral**.\n\nThe two LPs occupy opposite (trans) positions to minimise LP–LP repulsion → **molecular shape: square planar**.',
  'hard', ['vsepr', 'application']);

add(T6, 6,
  '**$PCl_5$ trap** — Are all five P–Cl bonds in $PCl_5$ equivalent?',
  '**No.** $PCl_5$ has trigonal bipyramidal geometry — 3 *equatorial* bonds at 120° and 2 *axial* bonds at 90° to equator. Axial bonds are slightly *longer* (more repulsion from the 3 equatorial neighbours at 90°) than equatorial.\n\nGeneral rule (Bent\'s rule): lone pairs and larger ligands prefer equatorial position in trigonal bipyramidal.',
  'medium', ['vsepr', 'conceptual']);

// ═══════════ T7: VBT & Hybridization ═══════════
const T7 = 'Valence Bond Theory & Hybridization';

add(T7, 7,
  'What is **hybridization**?',
  'The mixing of atomic orbitals on the *same* atom to form an equal number of equivalent **hybrid orbitals** with new shapes and energies, suitable for bonding.\n\nE.g. one $s$ + three $p$ → four $sp^3$ orbitals (tetrahedral arrangement). Hybridization explains why $CH_4$ has 109.5° bond angles even though raw p-orbitals are at 90°.',
  'easy', ['hybridization']);

add(T7, 7,
  '**Shortcut** — How to find the hybridization of a central atom (counting rule).',
  '$\\text{Hybridization steric number} = \\text{(no. of } \\sigma \\text{ bonds)} + \\text{(no. of lone pairs)}$\n\n| Steric # | Hybridization | Geometry |\n|---|---|---|\n| 2 | $sp$ | linear |\n| 3 | $sp^2$ | trigonal planar |\n| 4 | $sp^3$ | tetrahedral |\n| 5 | $sp^3 d$ | trigonal bipyramidal |\n| 6 | $sp^3 d^2$ | octahedral |\n\nNote: π-bonds don\'t change the steric count — only σ-bonds + lone pairs.',
  'medium', ['hybridization', 'shortcut']);

add(T7, 7,
  '**% s-character** in $sp$, $sp^2$, $sp^3$ — and what it predicts.',
  '- $sp$: 50% s\n- $sp^2$: 33.3% s\n- $sp^3$: 25% s\n\nMore s-character → orbital closer to nucleus → *shorter, stronger* bonds; *more acidic* C–H. This is why alkynes ($sp$ carbons) are more acidic than alkanes ($sp^3$). And $C-H$ bond length: $sp$ < $sp^2$ < $sp^3$.',
  'medium', ['hybridization', 'shortcut']);

add(T7, 7,
  '**Conceptual gap:** Hybridization of central atom in $H_2O$, $NH_3$, $CH_4$ — all $sp^3$. Then why are the bond angles so different (104.5°, 107°, 109.5°)?',
  'Hybridization predicts the **idealized** angle (109.5° for $sp^3$). Actual angle deviates because of lone-pair repulsions. With more lone pairs on central atom, the bond angle is squeezed more:\n- $CH_4$: 0 LP → 109.5° (ideal)\n- $NH_3$: 1 LP → 107°\n- $H_2O$: 2 LP → 104.5°\n\nLesson: hybridization alone is not enough; LP count fine-tunes the angle.',
  'medium', ['hybridization', 'vsepr', 'conceptual']);

add(T7, 7,
  '**Limitations of VBT** — name two.',
  '1. **Cannot explain paramagnetism** of $O_2$ (predicts diamagnetic but $O_2$ is paramagnetic).\n2. **Cannot explain bonding in odd-electron species** (e.g. $H_2^+$, $He_2^+$) — these have one electron in a bonding orbital, which VBT (electron-pair based) can\'t handle.\n\nThese gaps are why MOT is needed.',
  'medium', ['vbt']);

// ═══════════ T8: Bent's Rule, Drago's, Back-bonding ═══════════
const T8 = 'Bent\'s Rule, Drago\'s Rule & Back-Bonding';

add(T8, 8,
  'State **Bent\'s Rule** in one line.',
  'In a hybridized atom, *more electronegative substituents prefer hybrid orbitals with more p-character*; *more electropositive substituents (or lone pairs) prefer orbitals with more s-character*.\n\nConsequence: $H$ atoms get more s-character; halogens (F especially) get more p-character. Used to explain non-ideal bond angles.',
  'hard', ['bent']);

add(T8, 8,
  '**What if** — In $CH_2F_2$, are the H–C–H and F–C–F bond angles both 109.5°? Predict using Bent\'s rule.',
  '**No.** By Bent\'s rule, F (more electronegative) gets more p-character orbitals; H gets more s-character orbitals.\n- The H–C–H angle has more s-character → opens up *wider* (~112°).\n- The F–C–F angle has more p-character → closes *narrower* (~108°).\n\nThis is observed experimentally, contradicting the naive "all $sp^3$ → 109.5°."',
  'hard', ['bent', 'application']);

add(T8, 8,
  'State **Drago\'s Rule**.',
  'For a central atom from the 3rd period or below (e.g. P, S, Si) bonded to highly electronegative atoms (F, Cl, OH...), the central atom uses *pure p-orbitals* (no hybridization) when its electronegativity is low — bond angles ~90°.\n\nExamples: $PH_3$ (94°), $H_2S$ (92°), $H_2Se$ (91°), $AsH_3$ (92°).',
  'hard', ['drago']);

add(T8, 8,
  'What is **back-bonding** (back-donation)? Give one example.',
  'Donation of a lone pair from a substituent atom *into an empty orbital* on the central atom, forming a π-type bond *in addition to* the σ-bond. Strengthens and shortens that bond.\n\n**Classic example:** $BF_3$ — F lone pair donates into empty 2p on B → partial B=F double-bond character. This makes $BF_3$ a weaker Lewis acid than expected (compared to $BCl_3, BBr_3$ where back-bonding is weaker).',
  'hard', ['back-bonding'],
  { side: 'Answer', priority: 'Medium', description: 'BF3 molecule with three σ B-F bonds, and curved arrows from F lone pairs into the empty p orbital on B (perpendicular to the plane). Label the resulting partial π-bond. Mirrors the standard organic-chemistry electron-pushing convention.', notes: 'Back-bonding is invisible without an electron-flow diagram.' });

// ═══════════ T9: Molecular Orbital Theory ═══════════
const T9 = 'Molecular Orbital Theory (MOT)';

add(T9, 9,
  'What is the **central idea** of MOT?',
  'Atomic orbitals on different atoms combine (LCAO — Linear Combination of Atomic Orbitals) to form *molecular* orbitals that span the entire molecule. Each combination of N atomic orbitals produces N molecular orbitals — half bonding, half antibonding (lower and higher in energy than the AOs).',
  'medium', ['mot']);

add(T9, 9,
  '**Bond order formula** in MOT.',
  '$\\text{Bond order} = \\dfrac{N_b - N_a}{2}$\n\nwhere $N_b$ = electrons in bonding MOs, $N_a$ = electrons in antibonding MOs.\n\nHigher bond order → stronger, shorter bond. Bond order 0 → molecule doesn\'t exist (e.g. $He_2$).',
  'easy', ['mot', 'formula']);

add(T9, 9,
  '**Conceptual gap:** Why is $He_2$ not a stable molecule, but $He_2^+$ exists?',
  '$He_2$: 4 electrons → 2 in $\\sigma_{1s}$ (bonding), 2 in $\\sigma_{1s}^*$ (antibonding). Bond order = $(2-2)/2 = 0$ → not bonded.\n\n$He_2^+$: 3 electrons → 2 bonding, 1 antibonding. Bond order = $(2-1)/2 = 0.5$ → weak but real bond. Observed in mass spectra.',
  'medium', ['mot', 'conceptual']);

add(T9, 9,
  'For $O_2$, give the MO electron configuration and bond order. Magnetic property?',
  '$\\sigma_{1s}^2 \\sigma_{1s}^{*2} \\sigma_{2s}^2 \\sigma_{2s}^{*2} \\sigma_{2p_z}^2 \\pi_{2p_x}^2 \\pi_{2p_y}^2 \\pi_{2p_x}^{*1} \\pi_{2p_y}^{*1}$\n\nBond order = $(10-6)/2 = 2$.\n\n**Paramagnetic** (two unpaired electrons in $\\pi^*$ orbitals). This is one of MOT\'s great triumphs — VBT predicted $O_2$ to be diamagnetic, which contradicts experiment.',
  'hard', ['mot'],
  { side: 'Answer', priority: 'High', description: 'MO energy-level diagram for O2: two columns of 2s and 2p atomic orbitals on the sides, central column of MOs (σ2s, σ*2s, σ2pz, π2px=π2py, π*2px=π*2py, σ*2pz) ordered by energy. Filled with 16 electrons (8 from each O) per Aufbau + Hund. Highlight the two unpaired electrons in the π* level.', notes: 'The classic MOT diagram for O2 — explains paramagnetism visually. Essential.' });

add(T9, 9,
  '**Trap card:** For $N_2$ and $O_2$, the energy order of $\\sigma_{2p_z}$ vs $\\pi_{2p}$ differs. Why?',
  'In **light diatomics ($Li_2$ through $N_2$):** $2s$ and $2p$ orbitals are close in energy → significant *sp mixing* → $\\sigma_{2p_z}$ is *raised above* $\\pi_{2p_x}, \\pi_{2p_y}$.\n\nIn **heavier ($O_2, F_2, Ne_2$):** $2s$-$2p$ energy gap widens, mixing reduced → $\\sigma_{2p_z}$ falls *below* the π pair (normal order).\n\nForgetting this order-switch gives wrong magnetic predictions for $N_2$ vs $O_2$.',
  'hard', ['mot', 'conceptual']);

add(T9, 9,
  '**What if** — Compare bond orders and stability: $O_2$, $O_2^+$, $O_2^-$, $O_2^{2-}$.',
  'Start from $O_2$ (B.O. = 2). \n- $O_2^+$: remove one electron from antibonding π* → B.O. = 2.5 (more stable, shorter bond).\n- $O_2^-$ (superoxide): add one antibonding electron → B.O. = 1.5.\n- $O_2^{2-}$ (peroxide): add two antibonding → B.O. = 1.\n\nBond strength order: $O_2^+ > O_2 > O_2^- > O_2^{2-}$.',
  'hard', ['mot', 'application']);

// ═══════════ T10: Hydrogen Bonding & IMF ═══════════
const T10 = 'Hydrogen Bonding & Intermolecular Forces';

add(T10, 10,
  'What is a **hydrogen bond**? What are its three key requirements?',
  'A strong dipole-dipole attraction between an H bonded to a highly electronegative atom (F, O, N) and a lone pair on another EN atom (F, O, N).\n\n**Three requirements:**\n1. H must be bonded to F, O, or N (the "donor" atom).\n2. There must be a lone pair on another F, O, or N (the "acceptor").\n3. The geometry must permit close approach (~180° X–H...Y alignment is strongest).',
  'easy', ['h-bonding']);

add(T10, 10,
  'Distinguish **intermolecular** vs **intramolecular** hydrogen bonding with examples.',
  '- **Intermolecular** — H-bond *between* molecules. Raises melting/boiling points, viscosity, solubility in water. E.g. water, alcohols, $HF$, $p$-nitrophenol.\n- **Intramolecular** — H-bond *within* the same molecule. Lowers BP and water solubility (molecule effectively "satisfies itself" and doesn\'t need partners). E.g. $o$-nitrophenol, $o$-hydroxybenzaldehyde.\n\nKey trick: ortho-substituted phenols often show intramolecular H-bonding while meta and para can\'t (geometric constraint) — leading to lower BP for ortho isomers.',
  'medium', ['h-bonding']);

add(T10, 10,
  '**What if** — Why is $o$-nitrophenol *more volatile* (lower BP) than $p$-nitrophenol?',
  'In $o$-nitrophenol, geometry allows the OH group to form an **intramolecular** H-bond with the NO₂ group on the adjacent carbon → molecules satisfy H-bonding *within* themselves → fewer intermolecular H-bonds → easier to vaporize.\n\nIn $p$-nitrophenol, the NO₂ is too far away → only intermolecular H-bonding possible → stronger network → higher BP.\n\nObserved: $o$-isomer BP ~217°C, $p$-isomer BP ~279°C.',
  'medium', ['h-bonding', 'application'],
  { side: 'Answer', priority: 'Medium', description: 'Two skeletal structures side by side. LEFT: o-nitrophenol with curved dotted line from -OH hydrogen to one O of -NO2 group on adjacent C, labelled "intramolecular H-bond". RIGHT: p-nitrophenol with -NO2 across the ring (no possible intramolecular bond); show two molecules with intermolecular dotted bonds between -OH of one and -NO2 of the other.', notes: 'Geometric explanation is much clearer with a picture.' });

add(T10, 10,
  '**Anomalies of water** — list three properties of water explained by H-bonding.',
  '1. **High BP (100°C)** — much higher than $H_2S$ (-60°C) despite being lighter.\n2. **Density max at 4°C** — ice (3D H-bonded lattice) is *less dense* than liquid water; ice floats. Crucial for aquatic life.\n3. **High specific heat & latent heats** — needs lots of energy to break H-bonds. Regulates climate.\n\nAlso: high surface tension, high viscosity, universal solvent.',
  'medium', ['h-bonding']);

add(T10, 10,
  '**Strength order** — Rank H-bond strength: F-H...F vs O-H...O vs N-H...N.',
  'F-H...F > O-H...O > N-H...N\n\nElectronegativity drives the dipole; higher EN gives stronger H-bond. F-H...F bond strength is so high in $HF$ that it polymerizes to zigzag chains ( $(HF)_n$ ).',
  'medium', ['h-bonding']);

// ────────── INSERT ──────────
(async () => {
  console.log(`Prepared ${cards.length} cards for ch11_bonding (FLASH-PHY-${String(ID_START).padStart(4,'0')} → FLASH-PHY-${String(idCursor-1).padStart(4,'0')})`);
  const bad = cards.filter(c => /\$\$/.test(c.question) || /\$\$/.test(c.answer));
  if (bad.length) { console.error('$$', bad.map(b=>b.flashcard_id)); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);
  const c = mongoose.connection.db.collection('flashcards');
  const ids = cards.map(c => c.flashcard_id);
  const exists = await c.find({ flashcard_id: { $in: ids } }).toArray();
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
