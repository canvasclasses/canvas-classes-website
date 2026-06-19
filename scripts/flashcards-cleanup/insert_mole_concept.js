/**
 * Mole Concept (ch11_mole) flashcard deck — Class 11 Physical Chemistry pilot.
 *
 * Authoring philosophy (founder, 2026-06-18):
 *   1. Concept coverage: every key law / formula / graph / shortcut in the chapter
 *      gets at least one card.
 *   2. Conceptual-gap cards: the SAME concept asked from a slightly different angle
 *      that exposes shallow understanding (where students typically fumble).
 *   3. "What if" cards: application that tests depth ("what would happen if you
 *      changed X — would Y still hold?").
 *
 * Conventions (CLAUDE.md §4, §4.5):
 *   - LaTeX: $...$ only. Never $$...$$.
 *   - All cards published. source = "Canvas Chemistry". class_num = 11.
 *   - Difficulty: real easy/medium/hard mix — not all-medium.
 *
 * ID prefix: FLASH-PHY-XXXX (continues physical chemistry sequence; highest before
 * this batch was FLASH-PHY-0449).
 */
const dotenv = require('dotenv'); dotenv.config({ path: '.env.local' });
const mongoose = require('mongoose');

const CHAPTER = { id: 'ch11_mole', name: 'Mole Concept', category: 'Physical Chemistry' };
const SOURCE = 'Canvas Chemistry';
const CLASS_NUM = 11;
const ID_START = 450;
const STAMP = new Date();

// ────────── Cards ──────────
const cards = [];
let idCursor = ID_START;
function add(topic, order, q, a, difficulty, tags = []) {
  const id = `FLASH-PHY-${String(idCursor).padStart(4, '0')}`;
  idCursor++;
  cards.push({
    flashcard_id: id,
    chapter: CHAPTER,
    topic: { name: topic, order },
    question: q.trim(),
    answer: a.trim(),
    metadata: {
      difficulty,
      tags,
      source: SOURCE,
      class_num: CLASS_NUM,
      created_at: STAMP,
      updated_at: STAMP,
    },
    deleted_at: null,
  });
}

// ════════════════ TOPIC 1: Laws of Combination, Sig Figs, Atomic Mass ════════════════
const T1 = 'Laws of Combination, Sig Figs & Atomic Mass';

add(T1, 1,
  'State the **Law of Conservation of Mass**.',
  'Matter can neither be created nor destroyed in a chemical reaction — the total mass of reactants equals the total mass of products.',
  'easy', ['laws']);

add(T1, 1,
  '**Conceptual gap:** When wood burns to ash, the ash weighs *less* than the wood. Does this violate the Law of Conservation of Mass?',
  'No. The "missing" mass left as gases ( $CO_2$, $H_2O$ vapour) plus heat. Mass is conserved in the *closed* system; an open fire is open to the atmosphere. The law holds — you just have to account for what escapes.',
  'medium', ['laws', 'conceptual']);

add(T1, 1,
  'State the **Law of Definite (Constant) Proportions**.',
  'A given chemical compound *always* contains the same elements combined in the same fixed mass ratio, regardless of source or method of preparation.',
  'easy', ['laws']);

add(T1, 1,
  '**What if** — Two samples of water are collected, one from a river and one from a lab synthesis. Both are pure. Which law tells you the mass ratio of H to O will be 1:8 in *both* samples?',
  'Law of Definite Proportions. It guarantees a pure compound has a fixed composition regardless of source.',
  'medium', ['laws', 'application']);

add(T1, 1,
  'State the **Law of Multiple Proportions** and give the classic example.',
  'When two elements form more than one compound, the masses of one element that combine with a fixed mass of the other are in a simple whole-number ratio.\n\nClassic example: For a fixed 12 g of C — in $CO$ it combines with 16 g O, in $CO_2$ with 32 g O. Ratio = 16:32 = **1:2** (simple whole numbers).',
  'medium', ['laws']);

add(T1, 1,
  '**Conceptual gap:** $H_2O$ and $H_2O_2$ both contain only H and O. Do they obey the Law of Multiple Proportions? Prove it.',
  'Yes. Fix the mass of H at 2 g.\n- In $H_2O$: combines with 16 g O.\n- In $H_2O_2$: combines with 32 g O.\n\nRatio of O masses for fixed H = 16:32 = **1:2** ✓',
  'medium', ['laws', 'application']);

add(T1, 1,
  'State **Gay-Lussac\'s Law of Gaseous Volumes**.',
  'When gases react, they do so in volumes that bear a simple whole-number ratio to one another *and* to the volumes of products (provided all volumes are measured at the same temperature and pressure).',
  'easy', ['laws', 'gases']);

add(T1, 1,
  'State **Avogadro\'s Law**.',
  'Equal volumes of all gases, under the same conditions of temperature and pressure, contain equal numbers of molecules. (Equivalently: at fixed T, P — V ∝ n.)',
  'easy', ['laws', 'gases']);

add(T1, 1,
  '**What if** — At the same T and P, you have 1 L of $H_2$ and 1 L of $SO_2$. Which contains more molecules?',
  'Same number. By Avogadro\'s Law, equal volumes at equal T and P contain equal molecule counts. (Their *masses* differ — $SO_2$ is heavier — but molecule counts are identical.)',
  'medium', ['avogadro-law', 'conceptual']);

add(T1, 1,
  'How many significant figures are in **0.00450**?',
  '**Three** (4, 5, 0). Leading zeros are *not* significant; the trailing zero *after* a decimal point *is* significant.',
  'medium', ['sig-figs']);

add(T1, 1,
  '**Conceptual gap:** Compare significant figures: $4500$ vs $4500.$ vs $4.500 \\times 10^3$.',
  '- $4500$: ambiguous — typically taken as **2** sig figs.\n- $4500.$ (with explicit decimal): **4** sig figs.\n- $4.500 \\times 10^3$: **4** sig figs — scientific notation removes the ambiguity.\n\nThis is why scientific notation matters for precise reporting.',
  'hard', ['sig-figs', 'conceptual']);

add(T1, 1,
  'In multiplication / division of measurements, the result keeps how many significant figures?',
  'The same as the **measurement with the fewest sig figs** in the calculation. Example: $2.5 \\times 3.142 = 7.855 \\to 7.9$ (rounded to 2 sig figs because 2.5 has only 2).',
  'easy', ['sig-figs', 'shortcut']);

add(T1, 1,
  'In addition / subtraction of measurements, the result is reported to how many *decimal places*?',
  'The **fewest decimal places** among the inputs.\nExample: $12.11 + 18.0 + 1.012 = 31.122 \\to 31.1$ (because $18.0$ has only 1 decimal place).\n\n⚠️ Note: addition/subtraction rule is about *decimal places*, while multiplication/division is about *sig figs* — confusing them is a classic exam trap.',
  'medium', ['sig-figs', 'conceptual']);

add(T1, 1,
  'Distinguish **Precision** and **Accuracy** in one line each.',
  '- **Accuracy** — how close a measurement is to the *true value*.\n- **Precision** — how close *repeated measurements* are to one *another* (reproducibility).\n\nA broken scale that always reads 0.5 kg too high is **precise but not accurate**.',
  'easy', ['accuracy-precision']);

add(T1, 1,
  '**What if** — A student measures the mass of an object 4 times and gets 5.01, 5.02, 5.00, 5.01 g. The true mass is 5.50 g. Is the data precise? Accurate?',
  '**Precise** — readings cluster tightly (range 0.02 g). **Not accurate** — they\'re all ~0.5 g off the true value. Likely a systematic error (e.g. mis-calibrated balance).',
  'medium', ['accuracy-precision', 'application']);

add(T1, 1,
  'What is **average atomic mass**, and why isn\'t it a whole number for most elements?',
  'It is the *weighted average* of the masses of an element\'s naturally occurring isotopes, weighted by their relative abundances.\n\nIt isn\'t a whole number because most elements exist as a *mix* of isotopes. Example: Cl is ~75% $^{35}Cl$ + 25% $^{37}Cl$, giving an average of $\\approx 35.5$ amu — no single Cl atom has this mass.',
  'medium', ['atomic-mass']);

add(T1, 1,
  '**Shortcut** — Chlorine has two isotopes: $^{35}Cl$ (abundance 75%) and $^{37}Cl$ (abundance 25%). What is its average atomic mass?',
  'Weighted average: $\\frac{75 \\times 35 + 25 \\times 37}{100} = \\frac{2625 + 925}{100} = 35.5$ amu.',
  'easy', ['atomic-mass', 'shortcut']);

// ════════════════ TOPIC 2: Mole Basics — Mass, Volume, Particles ════════════════
const T2 = 'Mole Basics — Mass / Volume / Particles';

add(T2, 2,
  'What is the **value and significance** of Avogadro\'s number ( $N_A$ )?',
  '$N_A = 6.022 \\times 10^{23}$ per mole. It is the number of elementary entities (atoms / molecules / ions) in one mole of a substance — the bridge between the *macroscopic* (grams) and the *microscopic* (atoms).',
  'easy', ['mole-basics']);

add(T2, 2,
  'Modern definition of **1 mole**.',
  '1 mole = exactly $6.02214076 \\times 10^{23}$ elementary entities. (The older "mass of 12 g of $^{12}C$" definition was redefined by SI in 2019 to fix $N_A$ as an exact constant.)',
  'medium', ['mole-basics']);

add(T2, 2,
  'Write the three master conversion formulas for **moles**.',
  'For a substance of molar mass $M$:\n- From mass: $n = \\dfrac{m}{M}$\n- From number of particles: $n = \\dfrac{N}{N_A}$\n- From volume of gas at STP: $n = \\dfrac{V}{22.4 \\text{ L}}$ (at $0\\,°C$, 1 atm — old STP; modern IUPAC STP $\\to 22.7$ L)',
  'easy', ['mole-basics', 'formula']);

add(T2, 2,
  '**Conceptual gap:** 1 g of $H_2$ vs 1 g of $O_2$ — which contains more *molecules*?',
  '$H_2$ — and by a factor of 16.\n\n- moles of $H_2 = 1/2 = 0.5$ mol → $0.5 N_A$ molecules\n- moles of $O_2 = 1/32 \\approx 0.031$ mol → $0.031 N_A$ molecules\n\nLighter molar mass packs more molecules into the same mass.',
  'medium', ['mole-basics', 'conceptual']);

add(T2, 2,
  '**What if** — 22.4 L of an unknown gas at STP weighs 64 g. What is its molar mass, and what gas could it be?',
  '$M = 64$ g/mol (since 22.4 L at STP is exactly 1 mole of any gas).\n\nLikely candidates: $SO_2$ (M = 64) or $N_2H_4 \\cdot CH_4$ won\'t fit — $SO_2$ is the standard answer.',
  'medium', ['mole-basics', 'application']);

add(T2, 2,
  '**Trap card:** 1 mole of liquid water occupies 22.4 L at STP. True or false?',
  '**False.** The 22.4 L rule applies *only to gases* at STP. 1 mole of water (18 g) at room temperature is just 18 mL of liquid — about 1244× smaller than 22.4 L.',
  'medium', ['mole-basics', 'conceptual']);

add(T2, 2,
  'How many atoms are in 1 mole of $CO_2$?',
  '3 × $N_A$ = $3 \\times 6.022 \\times 10^{23} = 1.81 \\times 10^{24}$ atoms.\n\nEach $CO_2$ molecule has 3 atoms (1 C + 2 O); 1 mole has $N_A$ molecules; multiply.',
  'easy', ['mole-basics']);

add(T2, 2,
  '**What if** — You have 4.4 g of $CO_2$. How many *oxygen atoms* does it contain?',
  'Moles of $CO_2 = 4.4/44 = 0.1$ mol.\nEach $CO_2$ has 2 O atoms → moles of O atoms $= 0.2$ mol.\nNumber of O atoms $= 0.2 \\times N_A = 1.2044 \\times 10^{23}$.',
  'medium', ['mole-basics', 'application']);

add(T2, 2,
  'How many *electrons* are in 9 g of water?',
  'Moles of $H_2O = 9/18 = 0.5$ mol.\nElectrons per $H_2O$ = 10 (2 from H + 8 from O).\nTotal electrons = $0.5 \\times 10 \\times N_A = 5 N_A = 3.011 \\times 10^{24}$.',
  'medium', ['mole-basics', 'shortcut']);

add(T2, 2,
  'Define **average molar mass** of a gas mixture (formula form).',
  '$M_{avg} = \\sum x_i M_i$\n\nwhere $x_i$ = mole fraction of component $i$ and $M_i$ = its molar mass. (Equivalently, total mass ÷ total moles.)',
  'medium', ['mole-basics', 'formula']);

add(T2, 2,
  '**Shortcut** — Air is ~80% $N_2$ and 20% $O_2$ by mole. What is its average molar mass?',
  '$M_{avg} = 0.8 \\times 28 + 0.2 \\times 32 = 22.4 + 6.4 = 28.8$ g/mol.\n\n(This is why air "weighs" close to nitrogen — N₂ dominates by mole fraction.)',
  'easy', ['mole-basics', 'shortcut']);

// ════════════════ TOPIC 3: Concentration Units ════════════════
const T3 = 'Concentration Units';

add(T3, 3,
  'Define **Molarity (M)** and give its formula.',
  'Molarity = moles of solute per litre of *solution*.\n\n$M = \\dfrac{\\text{moles of solute}}{V_{\\text{solution}} \\text{ in L}}$\n\nUnits: mol/L (or mol/dm³).',
  'easy', ['molarity', 'formula']);

add(T3, 3,
  'Define **Molality (m)** and give its formula.',
  'Molality = moles of solute per **kg of solvent** (not solution).\n\n$m = \\dfrac{\\text{moles of solute}}{\\text{mass of solvent in kg}}$\n\nUnits: mol/kg.',
  'easy', ['molality', 'formula']);

add(T3, 3,
  '**Conceptual gap:** Why is **molality** temperature-independent but **molarity** is not?',
  'Molality uses *mass* of solvent (kg) — mass doesn\'t change with temperature.\n\nMolarity uses *volume* of solution — volume *expands* on heating (density drops), so molarity drifts as T changes. For accurate work over a temperature range, molality is preferred.',
  'medium', ['molarity', 'molality', 'conceptual']);

add(T3, 3,
  '**What if** — A 1.00 M aqueous NaCl solution is heated from 25 °C to 80 °C. Without adding or removing anything, what happens to its molarity?',
  '**Molarity decreases.** Heating expands the solution\'s volume (density falls); the same moles of NaCl are now in a larger V. By contrast, molality is unchanged.',
  'medium', ['molarity', 'conceptual', 'what-if']);

add(T3, 3,
  'Define **Mole Fraction** ( $x$ ) and state the key constraint on the sum.',
  '$x_A = \\dfrac{n_A}{n_A + n_B + \\ldots}$\n\n**Sum of all mole fractions in a mixture = 1** ($\\sum x_i = 1$). It is dimensionless and temperature-independent.',
  'easy', ['mole-fraction', 'formula']);

add(T3, 3,
  'Define **ppm (parts per million)** for a dilute aqueous solution.',
  '$\\text{ppm} = \\dfrac{\\text{mass of solute}}{\\text{mass of solution}} \\times 10^6$\n\nFor dilute aqueous solutions (where solution mass ≈ water mass), ppm ≈ mg of solute per kg (or per litre) of water.',
  'easy', ['ppm', 'formula']);

add(T3, 3,
  '**Shortcut** — For a dilute aqueous solution, how do Molarity and Molality compare?',
  '**$M \\approx m$.** Because for dilute aqueous solutions, 1 L of solution ≈ 1 kg of water (density of water ≈ 1 g/mL and solute mass is negligible). The gap widens for concentrated solutions or non-aqueous solvents.',
  'medium', ['molarity', 'molality', 'shortcut']);

add(T3, 3,
  'Define **Normality (N)** and relate it to Molarity.',
  '$N = \\dfrac{\\text{gram equivalents of solute}}{\\text{volume of solution in L}}$\n\nRelation: **$N = M \\times \\text{n-factor}$**.\n\nExample: 1 M $H_2SO_4$ has $N = 2$ (n-factor of $H_2SO_4$ = 2, since 2 replaceable $H^+$).',
  'medium', ['normality', 'formula']);

add(T3, 3,
  '**Conceptual gap:** 1 M $HCl$ vs 1 M $H_2SO_4$ — which has more $H^+$ ions per litre?',
  '$H_2SO_4$ — twice as many. Each $HCl$ gives 1 $H^+$; each $H_2SO_4$ gives 2 $H^+$. So $H^+$ concentration: HCl → 1 N, $H_2SO_4$ → 2 N.\n\nMolarity hides this; Normality reveals it. This is why titration calculations prefer Normality.',
  'medium', ['normality', 'conceptual']);

add(T3, 3,
  'State the formula for **Volume Strength of $H_2O_2$** in terms of Molarity and Normality.',
  '**Volume strength** $= 11.2 \\times M = 5.6 \\times N$\n\nMeaning: "20-volume $H_2O_2$" releases 20 L of $O_2$ at STP per litre of $H_2O_2$ on decomposition.',
  'medium', ['volume-strength', 'h2o2', 'shortcut']);

add(T3, 3,
  '**What if** — 100 mL of 20-volume $H_2O_2$ fully decomposes. What volume of $O_2$ at STP is released?\n\nReaction: $2H_2O_2 \\to 2H_2O + O_2$',
  '"20-volume" means 1 L of this $H_2O_2$ gives 20 L of $O_2$ at STP. So 100 mL gives **2 L** of $O_2$ at STP.\n\n(Underlying: Molarity = $20/11.2 \\approx 1.79$ M; in 100 mL → 0.179 mol $H_2O_2$ → 0.0893 mol $O_2$ → ~2 L at STP. Match ✓)',
  'hard', ['volume-strength', 'application']);

add(T3, 3,
  '**Interconversion** — A solution has molarity $M$, density $d$ (g/mL), and solute molar mass $M_s$ (g/mol). Derive its molality $m$.',
  '$m = \\dfrac{1000 \\, M}{1000 \\, d - M \\cdot M_s}$\n\nWhy: 1 L of solution weighs $1000 d$ g. Solute mass = $M \\cdot M_s$ g. Solvent mass = $1000 d - M \\cdot M_s$ g. Molality = moles of solute (= M) per kg of solvent.',
  'hard', ['concentration', 'formula', 'interconversion']);

add(T3, 3,
  '**Shortcut** — In a binary solution of solvent A and solute B, relation between molality $m$ and mole fraction $x_B$ (small $x_B$).',
  'For dilute solutions: $m \\approx \\dfrac{x_B \\times 1000}{M_A}$\n\nwhere $M_A$ is molar mass of solvent. For water ($M_A = 18$): $m \\approx 55.5 \\, x_B$.',
  'hard', ['concentration', 'shortcut']);

add(T3, 3,
  '**Trap card:** "Mass percent" — what is the *denominator*?',
  'Mass of **solution** (not solvent).\n\n$\\text{Mass \\%} = \\dfrac{\\text{mass of solute}}{\\text{mass of solute} + \\text{mass of solvent}} \\times 100$\n\nConfusing it with mass-of-solvent is a common slip on multi-step problems.',
  'medium', ['mass-percent', 'conceptual']);

// ════════════════ TOPIC 4: Empirical & Molecular Formula ════════════════
const T4 = 'Empirical & Molecular Formula';

add(T4, 4,
  'Define **Empirical Formula** and **Molecular Formula** in one line each.',
  '- **Empirical Formula (EF)** — simplest *whole-number* ratio of atoms in a compound. E.g. glucose EF = $CH_2O$.\n- **Molecular Formula (MF)** — actual number of each kind of atom in one molecule. E.g. glucose MF = $C_6H_{12}O_6$.',
  'easy', ['empirical-formula']);

add(T4, 4,
  'State the relation between **Molecular Formula** and **Empirical Formula**.',
  '$MF = n \\times EF$\n\nwhere $n = \\dfrac{\\text{Molar mass}}{\\text{Empirical formula mass}}$\n\nAlways a positive integer.',
  'easy', ['empirical-formula', 'formula']);

add(T4, 4,
  '**Conceptual gap:** Glucose ($C_6H_{12}O_6$), formaldehyde ($CH_2O$), acetic acid ($C_2H_4O_2$), and ribose ($C_5H_{10}O_5$) all have the same Empirical Formula $CH_2O$. What does this tell — and *not* tell — about them?',
  '**Tells:** They all have the same percent composition by mass (C: 40%, H: 6.7%, O: 53.3%).\n\n**Does NOT tell:** Anything about their structure, properties, or molecular size. EF is purely an *atom ratio* — it can\'t distinguish a sugar from an aldehyde from an acid.',
  'medium', ['empirical-formula', 'conceptual']);

add(T4, 4,
  '**Method** — From percent composition (e.g. C = 40%, H = 6.7%, O = 53.3%), give the 4-step recipe to find the Empirical Formula.',
  '1. Assume 100 g sample → mass of each element = its % (in g).\n2. Divide each by atomic mass → moles of each element.\n3. Divide each by the *smallest* mole value → atom ratio.\n4. Multiply to clear fractions if needed → whole-number ratio = EF.',
  'medium', ['empirical-formula', 'shortcut']);

add(T4, 4,
  '**What if** — A compound has Empirical Formula $CH_2$ and molar mass $84$ g/mol. Find its Molecular Formula.',
  'EF mass of $CH_2$ = 14.\n$n = 84/14 = 6$.\nMF = $6 \\times CH_2 = C_6H_{12}$.\n\n(Could be cyclohexane or 1-hexene — MF doesn\'t fix the structure.)',
  'easy', ['empirical-formula', 'application']);

add(T4, 4,
  '**Combustion analysis** — An organic compound on combustion produces $m_{CO_2}$ g of $CO_2$ and $m_{H_2O}$ g of $H_2O$. Mass of C and H in the original sample?',
  '$m_C = m_{CO_2} \\times \\dfrac{12}{44}$\n\n$m_H = m_{H_2O} \\times \\dfrac{2}{18}$\n\nIf the compound also contains O, $m_O$ = (sample mass) − $m_C$ − $m_H$ (by difference).',
  'medium', ['combustion-analysis', 'formula']);

add(T4, 4,
  '**Conceptual gap:** Why do we calculate mass of O by *difference* in combustion analysis instead of measuring it directly?',
  'Because the O *in the compound* mixes indistinguishably with the O *from the $O_2$ burned* — there\'s no way to tell, by measurement, which oxygens came from where. So we mass-balance: total sample mass − (C + H + N + …) = O.',
  'hard', ['combustion-analysis', 'conceptual']);

add(T4, 4,
  '**Hydrate formula** — A 5.0 g sample of $BaCl_2 \\cdot xH_2O$ loses 0.737 g of water on heating. Find $x$.',
  'Mass of anhydrous $BaCl_2 = 5.0 - 0.737 = 4.263$ g.\nMoles of $BaCl_2 = 4.263/208 \\approx 0.0205$.\nMoles of $H_2O = 0.737/18 \\approx 0.0410$.\nRatio = $0.0410/0.0205 = 2$.\n\nSo $x = 2$ → $BaCl_2 \\cdot 2H_2O$.',
  'hard', ['empirical-formula', 'application']);

add(T4, 4,
  '**Shortcut** — Molar mass of a gas from its **vapour density (V.D.)**.',
  '$M = 2 \\times \\text{V.D.}$\n\nReason: V.D. is mass of a gas relative to $H_2$ at same T, P. Since $M_{H_2} = 2$, $M = 2 \\, \\text{V.D.}$ This is a one-line jump from V.D. to molar mass — common in gas / formula problems.',
  'medium', ['empirical-formula', 'shortcut']);

// ════════════════ TOPIC 5: Eudiometry (Gas Analysis) ════════════════
const T5 = 'Eudiometry';

add(T5, 5,
  'What is **Eudiometry**?',
  'A technique to determine the composition of gaseous mixtures (especially hydrocarbons) by analyzing the *volume changes* before and after a known reaction — usually combustion in excess $O_2$, all measured at constant T and P.',
  'easy', ['eudiometry']);

add(T5, 5,
  'Write the **general combustion equation** for a hydrocarbon $C_xH_y$.',
  '$C_xH_y + \\left(x + \\dfrac{y}{4}\\right)O_2 \\to x\\,CO_2 + \\dfrac{y}{2}\\,H_2O$',
  'medium', ['eudiometry', 'formula']);

add(T5, 5,
  '**Why** must all volumes in a eudiometry calculation be measured at the **same temperature and pressure**?',
  'So that, by Avogadro\'s Law, volume ratios = mole ratios. If T or P differ between measurements, you cannot directly compare volumes — you would have to convert via PV = nRT first.',
  'medium', ['eudiometry', 'conceptual']);

add(T5, 5,
  'In eudiometry, what does **KOH** (potassium hydroxide) absorb? What does it *not* absorb?',
  '**Absorbs:** $CO_2$ (acidic oxide).\n**Does NOT absorb:** $CO$, $H_2$, $N_2$, $O_2$, hydrocarbons.\n\nThis is the standard reagent for isolating $CO_2$ from a post-combustion gas mixture.',
  'medium', ['eudiometry', 'reagents']);

add(T5, 5,
  'In eudiometry, what does **alkaline pyrogallol** absorb?',
  '**$O_2$** (any *excess* oxygen left after combustion). It is the standard reagent to measure unreacted $O_2$.',
  'medium', ['eudiometry', 'reagents']);

add(T5, 5,
  '**Conceptual gap:** After combustion in a eudiometer, the water formed condenses out (room temperature). Why does this matter for the volume balance?',
  'Liquid water is treated as having *negligible* volume compared to the gas. So in the volume balance, $H_2O$ produced is *not counted* (drops out). That\'s why eudiometry problems often state "volumes measured after cooling to room temperature" — it lets you ignore water vapour.',
  'hard', ['eudiometry', 'conceptual']);

add(T5, 5,
  '**What if** — 10 mL of a hydrocarbon $C_xH_y$ is burnt with 70 mL of $O_2$ (excess). After combustion and cooling, the volume contraction is 30 mL and $CO_2$ formed is 20 mL. Find $x$ and $y$.',
  '$CO_2$ formed = $10x$ → $x = 2$.\n\n$O_2$ consumed = $10(x + y/4) = 10(2 + y/4)$.\n\nVolume change accounting (at room T after $H_2O$ condenses): you can derive $y = 4$. So the compound is $C_2H_4$ (ethene).',
  'hard', ['eudiometry', 'application']);

add(T5, 5,
  '**Shortcut** — Volume of $O_2$ needed to burn 1 volume of $C_xH_y$ completely.',
  '$V_{O_2} = \\left(x + \\dfrac{y}{4}\\right) \\times V_{\\text{hydrocarbon}}$\n\nE.g. for $CH_4$: $(1 + 4/4) = 2$ volumes of $O_2$ per 1 volume of $CH_4$.',
  'easy', ['eudiometry', 'shortcut']);

// ════════════════ TOPIC 6: Limiting Reagent & Yield ════════════════
const T6 = 'Limiting Reagent & Yield';

add(T6, 6,
  'What is the **Limiting Reagent (LR)**?',
  'The reactant that is **completely consumed first** in a reaction. It determines the maximum amount of product that can form. The other reactant(s) are in *excess* and some is left over.',
  'easy', ['limiting-reagent']);

add(T6, 6,
  '**Method** — Recipe to identify the Limiting Reagent.',
  '1. Convert all reactant amounts to *moles*.\n2. For each reactant, divide moles by its stoichiometric coefficient in the balanced equation.\n3. The reactant with the **smallest** $n/\\text{coefficient}$ ratio is the LR.\n\n⚠️ Comparing raw moles *without dividing by coefficient* is the classic mistake.',
  'medium', ['limiting-reagent', 'shortcut']);

add(T6, 6,
  '**Conceptual gap:** For $N_2 + 3H_2 \\to 2NH_3$, you mix 1 mol $N_2$ and 1 mol $H_2$. Which is the LR? (Common trap.)',
  '**$H_2$ is the LR.**\n\n$N_2: 1/1 = 1.0$. $H_2: 1/3 = 0.33$. Smaller ratio = LR → $H_2$.\n\nThe trap: someone seeing "1 mol of each" thinks they\'re balanced. They aren\'t — the equation needs 3 H₂ per 1 N₂.',
  'medium', ['limiting-reagent', 'conceptual']);

add(T6, 6,
  '**What if** — You mix 4 g $H_2$ and 32 g $O_2$ for $2H_2 + O_2 \\to 2H_2O$. Find LR, mass of $H_2O$ formed, and excess reagent left.',
  '$n_{H_2} = 4/2 = 2$ mol; $n_{O_2} = 32/32 = 1$ mol.\nRatios: $H_2: 2/2 = 1$; $O_2: 1/1 = 1$. **Stoichiometric — no LR**, both react completely.\nMoles of $H_2O$ formed = 2 → mass = 36 g. Excess reagent = 0 g.',
  'medium', ['limiting-reagent', 'application']);

add(T6, 6,
  '**What if** — Same reaction, but now 6 g $H_2$ and 32 g $O_2$. Find LR and excess remaining.',
  '$n_{H_2} = 3$, $n_{O_2} = 1$. Ratios: 3/2 = 1.5 vs 1/1 = 1. **LR = $O_2$.**\n\nFrom 1 mol $O_2$, you consume 2 mol $H_2$. Excess $H_2$ left = $3 - 2 = 1$ mol = **2 g**.',
  'medium', ['limiting-reagent', 'application']);

add(T6, 6,
  'Define **Percentage Yield**.',
  '$\\text{\\% Yield} = \\dfrac{\\text{Actual yield}}{\\text{Theoretical yield}} \\times 100$\n\nTheoretical yield is calculated from the LR.',
  'easy', ['yield', 'formula']);

add(T6, 6,
  '**Conceptual gap:** Can percentage yield ever exceed 100%? If you measure >100%, what does it usually mean?',
  '**Physically, no** — you can\'t make more product than stoichiometry allows.\n\nIf the *measured* yield > 100%, it almost always means: (a) the product is impure (wet, contaminated with unreacted starting material, side products), or (b) a measurement / weighing error. It\'s a *signal of a problem*, not real over-production.',
  'medium', ['yield', 'conceptual']);

add(T6, 6,
  '**Percentage purity** — How is it different from percentage yield?',
  '- **% purity** = how much of a *given starting sample* is actually the named compound.\n  $\\text{\\% purity} = \\dfrac{\\text{mass of pure compound}}{\\text{mass of sample}} \\times 100$\n- **% yield** = ratio of actual to theoretical product *from a reaction*.\n\nPurity is about the *sample*; yield is about the *reaction*.',
  'medium', ['yield', 'conceptual']);

add(T6, 6,
  '**What if** — 10 g of $CaCO_3$ (80% pure) is heated. What mass of $CO_2$ is released? ($CaCO_3 \\to CaO + CO_2$)',
  'Pure $CaCO_3$ = 80% of 10 g = 8 g.\nMoles = $8/100 = 0.08$.\nMoles of $CO_2 = 0.08$ → mass = $0.08 \\times 44 = 3.52$ g.',
  'medium', ['yield', 'application']);

add(T6, 6,
  '**Sequential reactions** — Why does the LR concept become *more important* when you string two reactions together?',
  'Because the product of step 1 becomes a reactant in step 2 — and may itself become the new LR. You can\'t just compute "overall stoichiometry" naively; you must check the LR at *each* step. Failure to do this is a common multi-step problem trap.',
  'hard', ['limiting-reagent', 'conceptual']);

// ════════════════ TOPIC 7: Equivalent Concept & n-factor ════════════════
const T7 = 'Equivalent Concept & n-factor';

add(T7, 7,
  'Define **Equivalent Weight**.',
  '$\\text{Equivalent weight} = \\dfrac{\\text{Molar mass}}{n\\text{-factor}}$\n\nIt is the mass of substance that combines with (or displaces) 1 mole of $H^+$, 1 mole of $OH^-$, or 1 mole of electrons.',
  'easy', ['equivalent', 'formula']);

add(T7, 7,
  'Define **n-factor** for an **acid**.',
  'Number of **replaceable $H^+$** ions per molecule (i.e., basicity).\n\nExamples:\n- $HCl$: 1 \n- $H_2SO_4$: 2 \n- $H_3PO_4$: 3 (if all three H replaced)',
  'easy', ['n-factor']);

add(T7, 7,
  'Define **n-factor** for a **base**.',
  'Number of replaceable $OH^-$ ions per molecule (i.e., acidity of the base).\n\nExamples:\n- $NaOH$: 1\n- $Ca(OH)_2$: 2\n- $Al(OH)_3$: 3',
  'easy', ['n-factor']);

add(T7, 7,
  'Define **n-factor** for a **salt**.',
  '**n-factor = total positive charge** (or total negative charge) per formula unit\n= (number of cations) × (charge on cation).\n\nExamples:\n- $NaCl$: 1 \n- $Na_2SO_4$: 2 (2 Na × +1)\n- $Al_2(SO_4)_3$: 6 (2 × 3)',
  'medium', ['n-factor']);

add(T7, 7,
  'Define **n-factor** in a **redox reaction**.',
  'Number of **electrons gained or lost per molecule/formula unit** of the reagent in that reaction.\n\nThis is *reaction-dependent* — the same compound can have different n-factors in different redox environments. (See $KMnO_4$ card.)',
  'medium', ['n-factor', 'redox']);

add(T7, 7,
  '**Conceptual gap:** $KMnO_4$ — what is its n-factor in **acidic**, **neutral**, and **basic** medium?',
  '- **Acidic medium:** Mn goes $+7 \\to +2$ → **5 electrons** → n-factor = 5\n- **Neutral medium:** Mn goes $+7 \\to +4$ ($MnO_2$) → **3 electrons** → n-factor = 3\n- **Basic medium:** Mn goes $+7 \\to +6$ ($MnO_4^{2-}$) → **1 electron** → n-factor = 1\n\nSo equivalent weight of $KMnO_4$ (M = 158): 31.6, 52.7, or 158 — depending on medium. Pure conceptual trap.',
  'hard', ['n-factor', 'redox', 'conceptual']);

add(T7, 7,
  '**Conceptual gap:** $H_3PO_4$ can have n-factor 1, 2, *or* 3. Explain.',
  'Depends on **how many H+ are actually neutralized in the specific reaction**:\n- With excess NaOH → fully neutralized → n = 3 (forms $Na_3PO_4$)\n- Stops at $Na_2HPO_4$ → n = 2\n- Stops at $NaH_2PO_4$ → n = 1\n\nn-factor of a polyprotic acid is *not* fixed by its formula; it\'s fixed by the *extent* of the reaction.',
  'hard', ['n-factor', 'conceptual']);

add(T7, 7,
  'State the **law of equivalence** (one-line).',
  'In a chemical reaction, the **number of equivalents of all reactants and products is equal**.\n\nMathematically (for titration): $N_1V_1 = N_2V_2$.\n\nThis is why Normality is so useful — direct 1:1 comparison without needing the balanced equation.',
  'medium', ['equivalent', 'formula']);

add(T7, 7,
  '**What if** — 20 mL of 0.1 N $HCl$ is titrated against $NaOH$ of unknown strength and 10 mL is needed for complete neutralization. What is the normality of $NaOH$?',
  '$N_1V_1 = N_2V_2$\n$0.1 \\times 20 = N_2 \\times 10$\n$N_2 = 0.2$ N.\n\n(Notice you didn\'t need to write the balanced equation — Normality bakes it in.)',
  'easy', ['equivalent', 'application']);

add(T7, 7,
  '**Relation** — Connect Normality (N), Molarity (M), and Molality (m) to gram equivalents and moles.',
  '- $N = \\dfrac{\\text{gram equivalents}}{V \\text{ in L}}$\n- $M = \\dfrac{\\text{moles}}{V \\text{ in L}}$\n- $N = M \\times n\\text{-factor}$\n- gram equivalents $= \\text{moles} \\times n\\text{-factor}$',
  'medium', ['equivalent', 'normality', 'formula']);

add(T7, 7,
  '**Why use equivalents at all?** What\'s the advantage of equivalent / normality calculations over moles / molarity?',
  'With equivalents, **1 equivalent of any reactant reacts with exactly 1 equivalent of any other** — you don\'t need to look up the balanced equation\'s coefficients. This makes mixed-reaction titrations (acid + redox + salt) much faster, and is why $N_1V_1 = N_2V_2$ works for any titration.',
  'medium', ['equivalent', 'conceptual']);

// ──────────────── INSERT ────────────────
(async () => {
  console.log(`Prepared ${cards.length} cards for ch11_mole (FLASH-PHY-${String(ID_START).padStart(4,'0')} → FLASH-PHY-${String(idCursor-1).padStart(4,'0')})`);

  await mongoose.connect(process.env.MONGODB_URI);
  const c = mongoose.connection.db.collection('flashcards');

  // safety: ensure no ID collisions
  const ids = cards.map(c => c.flashcard_id);
  const existing = await c.find({ flashcard_id: { $in: ids } }, { projection: { flashcard_id: 1 } }).toArray();
  if (existing.length) {
    console.error('ID COLLISION:', existing.map(e => e.flashcard_id));
    process.exit(1);
  }

  // pre-flight: no double-dollar LaTeX (we just removed all of these)
  const bad = cards.filter(c => /\$\$/.test(c.question) || /\$\$/.test(c.answer));
  if (bad.length) {
    console.error('FORBIDDEN $$ found in', bad.length, 'cards');
    console.error(bad.map(b => b.flashcard_id));
    process.exit(1);
  }

  if (process.argv.includes('--dry-run')) {
    console.log('Dry-run OK. Sample card:');
    console.log(JSON.stringify(cards[0], null, 2));
    await mongoose.disconnect();
    return;
  }

  const res = await c.insertMany(cards, { ordered: true });
  console.log(`Inserted: ${res.insertedCount}`);

  // also write difficulty distribution to confirm we hit a real mix
  const dist = cards.reduce((a, c) => { a[c.metadata.difficulty] = (a[c.metadata.difficulty]||0)+1; return a; }, {});
  console.log('Difficulty mix:', JSON.stringify(dist));

  console.log(`ROLLBACK: db.flashcards.deleteMany({ flashcard_id: { $gte: "FLASH-PHY-${String(ID_START).padStart(4,'0')}", $lte: "FLASH-PHY-${String(idCursor-1).padStart(4,'0')}" } })`);

  await mongoose.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
