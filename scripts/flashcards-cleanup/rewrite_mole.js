/**
 * Mole Concept (ch11_mole) — REWRITE per founder feedback 2026-06-18:
 *  - Optimised for quick revision (short, scannable answers)
 *  - Conceptual-gap focus retained, but no paragraph walls
 *  - Soft-delete FLASH-PHY-0450..0529, insert at FLASH-PHY-1100+
 */
const fs = require('fs');
const dotenv = require('dotenv'); dotenv.config({ path: '.env.local' });
const mongoose = require('mongoose');

const CHAPTER = { id: 'ch11_mole', name: 'Mole Concept', category: 'Physical Chemistry' };
const SOURCE = 'Canvas Chemistry';
const CLASS_NUM = 11;
const ID_START = 1100;
const STAMP = new Date();
const STAMP_KEY = '2026-06-18c';
const OLD_LO = 'FLASH-PHY-0450', OLD_HI = 'FLASH-PHY-0529';

const cards = []; const wishlist = []; let idCursor = ID_START;
function add(topic, order, q, a, difficulty, tags = [], diagram = null) {
  const id = `FLASH-PHY-${String(idCursor).padStart(4, '0')}`;
  idCursor++;
  cards.push({ flashcard_id: id, chapter: CHAPTER, topic: { name: topic, order }, question: q.trim(), answer: a.trim(), metadata: { difficulty, tags, source: SOURCE, class_num: CLASS_NUM, created_at: STAMP, updated_at: STAMP }, deleted_at: null });
  if (diagram) wishlist.push({ flashcard_id: id, topic, ...diagram });
}

// ═══════════ T1: Laws of Combination, Sig Figs & Atomic Mass (15) ═══════════
const T1 = 'Laws of Combination, Sig Figs & Atomic Mass';

add(T1, 1, 'Law of Conservation of Mass — state it.', '**Mass is neither created nor destroyed** in a chemical reaction.\nLavoisier, 1789.', 'easy', ['laws']);

add(T1, 1, '**Trap:** Wood burns and ash weighs *less*. Does this violate conservation of mass?', '**No.** Open system — $CO_2$ + water vapour escape. Mass is conserved only in *closed* systems.', 'medium', ['laws', 'conceptual']);

add(T1, 1, 'Law of Definite Proportions — one-line.', '**A pure compound always has the same fixed mass ratio** of its elements, regardless of source.\nProust, 1799.', 'easy', ['laws']);

add(T1, 1, 'Law of Multiple Proportions — classic example.', 'C + O: in $CO$, 12 g C : 16 g O. In $CO_2$, 12 g C : 32 g O.\n**O-ratio = 1 : 2** (simple whole number). Dalton, 1803.', 'medium', ['laws']);

add(T1, 1, '**Conceptual:** Do $H_2O$ and $H_2O_2$ obey the Law of Multiple Proportions?', '**Yes.** Fix 2 g H. O combines as 16 g vs 32 g → ratio **1 : 2** ✓', 'medium', ['laws']);

add(T1, 1, 'Gay-Lussac\'s Law of Gaseous Volumes — state it.', 'When gases react, **volumes bear simple whole-number ratios** to each other and to products — at same T, P.', 'easy', ['laws']);

add(T1, 1, 'Avogadro\'s Law — one-liner.', '**Equal volumes of all gases at same T, P contain equal numbers of molecules.**\nEquivalently: $V \\propto n$ at fixed T, P.', 'easy', ['laws']);

add(T1, 1, '**Trap:** 1 L $H_2$ and 1 L $SO_2$ at same T, P — which has more molecules?', '**Same.** Avogadro\'s Law. (Different *mass*, same molecule count.)', 'easy', ['avogadro', 'conceptual']);

add(T1, 1, 'How many sig figs in **0.00450**?', '**3** (4, 5, 0). Leading zeros don\'t count; trailing zero *after* decimal does.', 'medium', ['sig-figs']);

add(T1, 1, '**Trap:** Sig figs in $4500$ vs $4500.$ vs $4.500 \\times 10^3$.', '| Form | Sig figs |\n|---|---|\n| 4500 | **2** (ambiguous) |\n| 4500. | **4** (explicit decimal) |\n| $4.500 \\times 10^3$ | **4** (unambiguous) |', 'hard', ['sig-figs']);

add(T1, 1, 'Sig-fig rule for **multiplication / division**.', 'Result keeps the **same number of sig figs as the least-precise factor**.\n$2.5 \\times 3.142 = 7.9$ (2 sig figs).', 'easy', ['sig-figs', 'shortcut']);

add(T1, 1, 'Sig-fig rule for **addition / subtraction**.', 'Result has the **fewest decimal places** among the inputs.\n$12.11 + 18.0 + 1.012 = 31.1$ (1 dp, set by 18.0).\n⚠️ *Decimal places*, not sig figs — common mix-up.', 'medium', ['sig-figs']);

add(T1, 1, 'Precision vs Accuracy in one line each.', '- **Accuracy** = closeness to **true value**.\n- **Precision** = closeness of **repeated readings** to each other.\n\nA biased balance can be precise *but not* accurate.', 'easy', ['accuracy-precision']);

add(T1, 1, 'Average atomic mass of Cl: $^{35}Cl$ (75%) + $^{37}Cl$ (25%).', '$\\dfrac{75 \\times 35 + 25 \\times 37}{100} = \\mathbf{35.5}$ amu.', 'easy', ['atomic-mass', 'shortcut']);

add(T1, 1, '**Why** is average atomic mass usually non-integer?', 'Elements exist as **isotope mixtures**; weighted average ≠ integer.\nMonoisotopic elements (F, P, Na, I, Au, etc.) *are* near-integer.', 'medium', ['atomic-mass']);

// ═══════════ T2: Mole Basics & Conversions (14) ═══════════
const T2 = 'Mole Basics — Mass / Volume / Particles';

add(T2, 2, 'Value of Avogadro\'s number?', '$N_A = \\mathbf{6.022 \\times 10^{23}}$ per mole.', 'easy', ['mole']);

add(T2, 2, 'Three master conversion formulas for moles.', '$n = \\dfrac{m}{M}$ (from mass)\n$n = \\dfrac{N}{N_A}$ (from particle count)\n$n = \\dfrac{V}{22.4 \\text{ L}}$ (gas at old STP, 1 atm 0°C)', 'easy', ['mole', 'formula']);

add(T2, 2, '**STP volume confusion** — modern IUPAC vs old STP.', '| Standard | T, P | $V_m$ |\n|---|---|---|\n| Old STP | 0°C, 1 atm | **22.4 L** |\n| IUPAC STP (post-1982) | 0°C, 1 bar | **22.7 L** |\n| NTP | 20°C, 1 atm | 24.05 L |\n\nJEE/NCERT mostly uses **22.4 L**.', 'medium', ['mole', 'conceptual']);

add(T2, 2, '**Trap:** 1 mole of liquid water occupies 22.4 L at STP. True or false?', '**False.** 22.4 L rule = *gases only*.\n1 mol $H_2O$ liquid ≈ **18 mL**.', 'medium', ['mole']);

add(T2, 2, '**Conceptual:** 1 g $H_2$ vs 1 g $O_2$ — which has more molecules?', '**$H_2$ — by factor 16.**\n$n(H_2) = 0.5$ mol, $n(O_2) = 0.031$ mol. Lighter molar mass → more particles per gram.', 'medium', ['mole', 'conceptual']);

add(T2, 2, 'Atoms in 1 mole of $CO_2$?', '$3 \\times N_A = \\mathbf{1.81 \\times 10^{24}}$ atoms (1 C + 2 O per molecule × $N_A$ molecules).', 'easy', ['mole']);

add(T2, 2, 'Oxygen atoms in 4.4 g of $CO_2$?', '$n(CO_2) = 4.4/44 = 0.1$ mol.\n$n(O) = 0.2$ mol → $\\mathbf{1.2 \\times 10^{23}}$ atoms.', 'medium', ['mole', 'application']);

add(T2, 2, 'Electrons in 9 g of water?', '$n(H_2O) = 0.5$ mol. 10 e⁻ per molecule (2H + 8O).\n$= 5 N_A = \\mathbf{3.01 \\times 10^{24}}$ electrons.', 'medium', ['mole', 'application']);

add(T2, 2, '**Average molar mass of a gas mixture** — formula.', '$M_{\\text{avg}} = \\sum x_i M_i$ (mole-fraction weighted)\n= total mass ÷ total moles.', 'medium', ['mole', 'formula']);

add(T2, 2, 'Average molar mass of air (~80% $N_2$, 20% $O_2$ by mole)?', '$0.8(28) + 0.2(32) = \\mathbf{28.8}$ g/mol.', 'easy', ['mole', 'shortcut']);

add(T2, 2, '**Trap PYQ:** Number of molecules in 11.2 L of $O_2$ gas at STP?', '11.2 L = $\\tfrac{1}{2}$ mol → $\\mathbf{0.5\\, N_A = 3.01 \\times 10^{23}}$ molecules.\nAtoms: $2 \\times 0.5 N_A = N_A$.', 'medium', ['mole']);

add(T2, 2, '**Vapour density (V.D.)** → molar mass shortcut.', '$M = 2 \\times \\text{V.D.}$\n(V.D. is mass relative to $H_2$, and $M(H_2) = 2$.)', 'medium', ['mole', 'shortcut']);

add(T2, 2, '**PYQ-style:** A gas occupies 5.6 L at STP and weighs 16 g. Find molar mass.', '$n = 5.6/22.4 = 0.25$ mol.\n$M = 16/0.25 = \\mathbf{64}$ g/mol. (Likely $SO_2$.)', 'medium', ['mole', 'pyq']);

add(T2, 2, 'Mass of 1 atom of carbon-12?', '$\\dfrac{12}{N_A} = \\dfrac{12}{6.022 \\times 10^{23}} = \\mathbf{1.99 \\times 10^{-23}}$ g.', 'medium', ['mole']);

// ═══════════ T3: Concentration Units (16) ═══════════
const T3 = 'Concentration Units';

add(T3, 3, 'Molarity (M) — definition + units.', '$M = \\dfrac{\\text{moles solute}}{\\text{L solution}}$ (mol/L).\nDenominator is *solution*, not solvent.', 'easy', ['molarity']);

add(T3, 3, 'Molality (m) — definition + units.', '$m = \\dfrac{\\text{moles solute}}{\\text{kg solvent}}$ (mol/kg).\nDenominator is *solvent*, not solution.', 'easy', ['molality']);

add(T3, 3, '**Why** is molality temperature-independent but molarity isn\'t?', 'Molality uses **mass** (kg) — invariant.\nMolarity uses **volume** — expands on heating → falls with T.', 'medium', ['concentration', 'conceptual']);

add(T3, 3, '**Trap PYQ:** 1.00 M NaCl heated 25°C → 80°C. What happens to molarity?', '**Decreases.** Volume expands, moles unchanged → M drops.\nMolality unchanged.', 'medium', ['molarity', 'what-if']);

add(T3, 3, 'Mole fraction definition + key constraint.', '$x_A = \\dfrac{n_A}{\\sum n_i}$\n**$\\sum x_i = 1$** always. Dimensionless, T-independent.', 'easy', ['mole-fraction']);

add(T3, 3, 'ppm for dilute aqueous solution — formula.', '$\\text{ppm} = \\dfrac{m_{\\text{solute}}}{m_{\\text{soln}}} \\times 10^6$\nFor dilute aqueous: ppm ≈ **mg solute / kg water**.', 'easy', ['ppm']);

add(T3, 3, '**Shortcut:** For dilute aqueous solution, $M \\approx \\ ?$', '$\\mathbf{M \\approx m}$ — because 1 L solution ≈ 1 kg water (density ≈ 1, solute mass tiny). Breaks for concentrated/non-aqueous.', 'medium', ['concentration', 'shortcut']);

add(T3, 3, 'Normality — relation to Molarity.', '$\\mathbf{N = M \\times \\text{n-factor}}$\nE.g. 1 M $H_2SO_4$ → N = 2 (n-factor = 2).', 'medium', ['normality']);

add(T3, 3, '**Trap:** 1 M HCl vs 1 M $H_2SO_4$ — which has more $H^+$ per litre?', '**$H_2SO_4$ has 2×.** HCl gives 1 H+; $H_2SO_4$ gives 2.\nN: HCl = 1; $H_2SO_4$ = 2.', 'medium', ['normality', 'conceptual']);

add(T3, 3, 'Volume strength of $H_2O_2$ — formula.', '$\\text{V.S.} = 11.2 \\times M = 5.6 \\times N$\n"20-volume" → 1 L of solution releases 20 L $O_2$ at STP on decomposition.', 'medium', ['h2o2', 'shortcut']);

add(T3, 3, '**PYQ:** 100 mL of 20-volume $H_2O_2$ fully decomposes. $O_2$ released at STP?', '**2 L** (since "20-volume" → 1 L H₂O₂ → 20 L O₂, scale by 0.1).', 'hard', ['h2o2', 'application']);

add(T3, 3, '**Interconversion** — molality $m$ from molarity $M$, density $d$ (g/mL), solute molar mass $M_s$.', '$m = \\dfrac{1000 M}{1000 d - M M_s}$', 'hard', ['concentration', 'formula']);

add(T3, 3, '**Trap:** "Mass percent" — denominator is mass of ___?', '**Solution**, not solvent.\n$\\text{Mass \\%} = \\dfrac{m_{\\text{solute}}}{m_{\\text{solute}} + m_{\\text{solvent}}} \\times 100$', 'medium', ['concentration']);

add(T3, 3, 'Molarity of pure water?', '$M = \\dfrac{1000}{18} = \\mathbf{55.5}$ M.\n(Treating 1 L water ≈ 1000 g, divide by 18.)', 'medium', ['molarity', 'shortcut']);

add(T3, 3, 'Strength (g/L) ↔ Normality conversion.', '$\\text{Strength (g/L)} = N \\times \\text{Equivalent weight}$\nor $= M \\times \\text{Molar mass}$.', 'medium', ['concentration', 'formula']);

add(T3, 3, '**Mixing rule** — $M_1 V_1 + M_2 V_2 = M_{\\text{final}} (V_1 + V_2)$ assumes what?', '**Volumes are additive** (no contraction/expansion on mixing).\nTrue for dilute aqueous; can fail for concentrated mixes (e.g. ethanol + water shrinks).', 'medium', ['concentration', 'conceptual']);

// ═══════════ T4: Empirical & Molecular Formula (10) ═══════════
const T4 = 'Empirical & Molecular Formula';

add(T4, 4, 'EF vs MF — one-line each.', '- **EF** = simplest whole-number ratio of atoms (e.g. glucose EF = $CH_2O$).\n- **MF** = actual atom count per molecule ($C_6H_{12}O_6$).', 'easy', ['ef']);

add(T4, 4, 'Relation: MF, EF, molar mass.', '$\\mathbf{MF = n \\times EF}$, where $n = \\dfrac{\\text{molar mass}}{\\text{EF mass}}$ (integer).', 'easy', ['ef', 'formula']);

add(T4, 4, '**Conceptual:** Glucose, formaldehyde, acetic acid, ribose all have EF $CH_2O$. What does this NOT tell you?', '**Anything about structure or molecular size.** Same atom ratio ≠ same molecule.\nAll have 40 % C, 6.7 % H, 53.3 % O composition though.', 'medium', ['ef', 'conceptual']);

add(T4, 4, '**EF from % composition** — 4-step recipe.', '1. Assume 100 g → element % = element mass (g).\n2. ÷ atomic mass → moles.\n3. ÷ smallest mole value → ratio.\n4. Multiply to clear fractions → whole numbers = EF.', 'medium', ['ef', 'shortcut']);

add(T4, 4, 'EF = $CH_2$, molar mass = 84. Find MF.', 'EF mass = 14. $n = 84/14 = 6$ → **MF = $C_6H_{12}$**.\n(Could be cyclohexane, 1-hexene, etc.)', 'easy', ['ef', 'application']);

add(T4, 4, '**Combustion analysis** — convert masses of $CO_2$ and $H_2O$ → masses of C and H.', '$m_C = m_{CO_2} \\times \\dfrac{12}{44}$\n$m_H = m_{H_2O} \\times \\dfrac{2}{18}$\n$m_O = m_{\\text{sample}} - m_C - m_H$ (by difference).', 'medium', ['combustion']);

add(T4, 4, '**Why** is mass of O calculated *by difference* in combustion analysis?', 'O in sample and O from $O_2$ used in combustion mix indistinguishably → can\'t measure directly.\nUse mass balance: $m_O = m_{\\text{sample}} - (m_C + m_H + \\ldots)$.', 'hard', ['combustion', 'conceptual']);

add(T4, 4, '**PYQ:** $BaCl_2 \\cdot xH_2O$ — 5.00 g loses 0.737 g water on heating. Find $x$.', '$n(BaCl_2) = 4.263/208 \\approx 0.0205$\n$n(H_2O) = 0.737/18 \\approx 0.0410$\nRatio = 2 → **$x = 2$**, $BaCl_2 \\cdot 2H_2O$.', 'hard', ['ef', 'application']);

add(T4, 4, '% C in benzene ($C_6H_6$)?', '$\\dfrac{6 \\times 12}{78} \\times 100 \\approx \\mathbf{92.3\\%}$.', 'easy', ['ef', 'shortcut']);

add(T4, 4, '**Shortcut:** Molar mass from vapour density.', '$M = 2 \\times \\text{V.D.}$\n(Already covered — important enough to repeat in EF context.)', 'easy', ['ef', 'shortcut']);

// ═══════════ T5: Eudiometry (10) ═══════════
const T5 = 'Eudiometry';

add(T5, 5, 'What is **eudiometry**?', 'Technique to find gas composition by measuring **volume changes** during combustion (same T, P throughout).', 'easy', ['eudiometry']);

add(T5, 5, 'General combustion equation for $C_xH_y$.', '$C_xH_y + \\left(x + \\dfrac{y}{4}\\right)O_2 \\to x\\, CO_2 + \\dfrac{y}{2}\\, H_2O$', 'medium', ['eudiometry', 'formula']);

add(T5, 5, '**Why** must all volumes be measured at same T, P?', 'So **volume ratio = mole ratio** (Avogadro). If T or P differ, must use PV=nRT first.', 'medium', ['eudiometry']);

add(T5, 5, 'Eudiometry reagents — what does each absorb?', '| Reagent | Absorbs |\n|---|---|\n| KOH | $CO_2$ |\n| Alkaline pyrogallol | excess $O_2$ |\n| Bromine water | unsaturated HCs |\n| Conc. $H_2SO_4$ | water vapour |', 'medium', ['eudiometry', 'shortcut']);

add(T5, 5, '**Why** does water formed in combustion *not count* in volume balance?', 'At room T, $H_2O$ **condenses to liquid** → negligible volume vs gases.\nThat\'s why problems say "after cooling to room T".', 'hard', ['eudiometry', 'conceptual']);

add(T5, 5, '$O_2$ needed to burn 1 vol of $C_xH_y$ completely?', '$\\left(x + \\dfrac{y}{4}\\right)$ volumes.\nE.g. $CH_4$: 2 vol $O_2$ per 1 vol methane.', 'easy', ['eudiometry', 'shortcut']);

add(T5, 5, '**PYQ-style:** 10 mL $C_xH_y$ + 70 mL $O_2$. Combustion gives 20 mL $CO_2$. Find $x$.', '$CO_2$ formed = $10x = 20$ → **$x = 2$**.\nFurther volume balance gives $y = 4$ → $C_2H_4$ (ethene).', 'hard', ['eudiometry', 'pyq'], { side: 'Question', priority: 'High', description: 'Eudiometer tube before-and-after sketch: BEFORE — 10 mL hydrocarbon + 70 mL O2 (total 80 mL, labelled). AFTER cooling — final mix at room T with water condensed out, CO2 portion shaded. Annotate volume contraction.', notes: 'Volume balance picture removes calculation anxiety here.' });

add(T5, 5, 'What does conc. $H_2SO_4$ absorb? What does it *not*?', 'Absorbs **water vapour** only (drying agent).\nDoes NOT absorb gases like $CO_2$, $O_2$, $N_2$, hydrocarbons.', 'medium', ['eudiometry']);

add(T5, 5, '**Conceptual:** Why is potassium pyrogallate (alkaline pyrogallol) preferred over alkaline ferrous sulphate for $O_2$ absorption?', 'Pyrogallate absorbs $O_2$ **rapidly and quantitatively** at room T; ferrous sulphate is slow and less reliable.', 'medium', ['eudiometry']);

add(T5, 5, '**Trap:** $CO$ in eudiometric mixture — how is it distinguished from $CH_4$?', '$CO$ burns to $CO_2$ with **no water formed** (no H present).\n$CH_4$ burns to $CO_2$ + $H_2O$. The presence/absence of water vapour distinguishes.', 'hard', ['eudiometry']);

// ═══════════ T6: Limiting Reagent & Yield (10) ═══════════
const T6 = 'Limiting Reagent & Yield';

add(T6, 6, 'What is the **Limiting Reagent**?', 'The reactant **completely consumed first** — sets the max amount of product. Other(s) in *excess*.', 'easy', ['lr']);

add(T6, 6, '**Recipe** to find the LR.', '1. Convert all reactants → moles.\n2. ÷ each by its stoichiometric coefficient.\n3. **Smallest ratio = LR**.\n⚠️ Comparing raw moles without dividing = classic error.', 'medium', ['lr', 'shortcut']);

add(T6, 6, '**Trap PYQ:** $N_2 + 3H_2 \\to 2NH_3$. Mix 1 mol $N_2$ + 1 mol $H_2$. Which is LR?', '**$H_2$.**\nRatios: $N_2: 1/1 = 1.0$; $H_2: 1/3 = 0.33$. Smaller → LR.\nTrap: "1 mol each" looks balanced but isn\'t.', 'medium', ['lr', 'conceptual']);

add(T6, 6, 'Mix 4 g $H_2$ + 32 g $O_2$ for $2H_2 + O_2 \\to 2H_2O$. LR? Excess?', '$n(H_2) = 2$, $n(O_2) = 1$. Ratios both = 1 → **stoichiometric**, no LR.\nFull conversion: 36 g $H_2O$, no excess.', 'medium', ['lr', 'application']);

add(T6, 6, 'Same reaction, 6 g $H_2$ + 32 g $O_2$. LR? Excess?', '$n(H_2) = 3$, $n(O_2) = 1$. Ratios: 1.5 vs 1 → **$O_2$ is LR**.\nUses 2 mol $H_2$, leaving 1 mol = **2 g $H_2$** excess.', 'medium', ['lr', 'application']);

add(T6, 6, '% Yield formula.', '$\\text{\\% Yield} = \\dfrac{\\text{actual yield}}{\\text{theoretical yield from LR}} \\times 100$', 'easy', ['yield']);

add(T6, 6, '**Conceptual:** Can % yield exceed 100%? What does it usually mean if it does?', '**Physically no.** Measured > 100% usually means **impure product** (wet, contaminated, side products).\nIt\'s a signal of error, not over-production.', 'medium', ['yield', 'conceptual']);

add(T6, 6, '**% Purity** vs **% Yield** — one-line each.', '- **% purity:** how much of a **sample** is the named compound.\n- **% yield:** ratio of actual to theoretical **product from reaction**.', 'medium', ['yield', 'purity']);

add(T6, 6, '**PYQ:** 10 g $CaCO_3$ (80% pure) heated → mass of $CO_2$ released?\n($CaCO_3 \\to CaO + CO_2$)', 'Pure $CaCO_3$ = 8 g → $n = 0.08$ mol.\n$CO_2$ = 0.08 × 44 = **3.52 g**.', 'medium', ['yield', 'application']);

add(T6, 6, '**Why** does LR matter even more in *sequential* (multi-step) reactions?', 'The LR can **change at each step** — product of step 1 becomes reactant in step 2 and may itself become limiting.\nCheck LR fresh at every step.', 'hard', ['lr', 'conceptual']);

// ═══════════ T7: Equivalent Concept & n-factor (12) ═══════════
const T7 = 'Equivalent Concept & n-factor';

add(T7, 7, 'Equivalent weight — formula.', '$\\text{Eq. wt} = \\dfrac{\\text{Molar mass}}{n\\text{-factor}}$', 'easy', ['equivalent', 'formula']);

add(T7, 7, 'n-factor of an **acid** = ?', '**Replaceable $H^+$** per molecule (= basicity).\n$HCl$ : 1, $H_2SO_4$ : 2, $H_3PO_4$ : 3 (max).', 'easy', ['n-factor']);

add(T7, 7, 'n-factor of a **base** = ?', '**Replaceable $OH^-$** per formula (= acidity).\n$NaOH$ : 1, $Ca(OH)_2$ : 2, $Al(OH)_3$ : 3.', 'easy', ['n-factor']);

add(T7, 7, 'n-factor of a **salt** = ?', '**Total positive charge** per formula = (# cations) × (charge).\n$NaCl$ : 1, $Na_2SO_4$ : 2, $Al_2(SO_4)_3$ : 6.', 'medium', ['n-factor']);

add(T7, 7, 'n-factor in a **redox** reaction = ?', '**Electrons gained or lost** per formula in that specific reaction.\n*Reaction-dependent* — same compound can have multiple n-factors.', 'medium', ['n-factor', 'redox']);

add(T7, 7, '**Classic trap:** n-factor of $KMnO_4$ in acidic / neutral / basic medium.', '| Medium | Mn change | n-factor | Eq. wt |\n|---|---|---|---|\n| Acidic | +7 → +2 | **5** | 31.6 |\n| Neutral | +7 → +4 ($MnO_2$) | **3** | 52.7 |\n| Basic | +7 → +6 ($MnO_4^{2-}$) | **1** | 158 |', 'hard', ['n-factor', 'conceptual']);

add(T7, 7, 'n-factor of $K_2Cr_2O_7$ in acidic medium?', 'Cr: $+6 \\to +3$, 3 e⁻ per Cr × 2 Cr = **6 e⁻** → **n = 6**.\nEq. wt = 294/6 = 49.', 'medium', ['n-factor']);

add(T7, 7, '**Trap:** $H_3PO_4$ can have n-factor 1, 2, or 3. Why?', 'Depends on **how many H+ are actually neutralised**:\n- → $NaH_2PO_4$: n = 1\n- → $Na_2HPO_4$: n = 2\n- → $Na_3PO_4$: n = 3\nn-factor of polyprotic acid is set by the *reaction extent*, not the formula.', 'hard', ['n-factor', 'conceptual']);

add(T7, 7, 'Law of equivalence — one-line + practical form.', '**Equivalents of reactants = equivalents of products** in any reaction.\nTitration: $\\mathbf{N_1 V_1 = N_2 V_2}$.', 'medium', ['equivalent']);

add(T7, 7, '**PYQ:** 20 mL of 0.1 N HCl needs $V$ mL of 0.2 N NaOH for full neutralisation. Find $V$.', '$N_1 V_1 = N_2 V_2 \\Rightarrow 0.1 \\times 20 = 0.2 \\times V$\n$V = \\mathbf{10}$ mL.', 'easy', ['equivalent', 'pyq']);

add(T7, 7, 'Quick conversions: Normality, Molarity, gram equivalents.', '- $N = M \\times n$-factor\n- gram eq = moles × n-factor\n- $N = \\dfrac{\\text{gram eq}}{V (\\text{L})}$', 'medium', ['equivalent', 'formula']);

add(T7, 7, '**Why** use equivalents at all instead of moles?', '**1 equivalent of A reacts with exactly 1 equivalent of B** — no need to look up coefficients. $N_1 V_1 = N_2 V_2$ works for any titration without writing the balanced equation.', 'medium', ['equivalent', 'conceptual']);

// ─────── ROLLOUT ───────
(async () => {
  console.log(`Prepared ${cards.length} cards (FLASH-PHY-${String(ID_START).padStart(4,'0')} → FLASH-PHY-${String(idCursor-1).padStart(4,'0')})`);
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
  const oldDocs = await c.find({ flashcard_id: { $gte: OLD_LO, $lte: OLD_HI }, deleted_at: null }).toArray();
  fs.writeFileSync(`_agents/snapshots/flashcards_${CHAPTER.id}_rewrite_${STAMP_KEY}.json`, JSON.stringify(oldDocs.map(d => ({ _id: d._id, flashcard_id: d.flashcard_id, deleted_at: null })), null, 2));
  console.log(`Snapshot ${oldDocs.length} old → _agents/snapshots/flashcards_${CHAPTER.id}_rewrite_${STAMP_KEY}.json`);
  const delRes = await c.updateMany({ flashcard_id: { $gte: OLD_LO, $lte: OLD_HI }, deleted_at: null }, { $set: { deleted_at: STAMP, deletion_reason: `${CHAPTER.id}-rewrite-2026-06-18` } });
  console.log(`Soft-deleted: ${delRes.modifiedCount}`);
  const insRes = await c.insertMany(cards, { ordered: true });
  console.log(`Inserted: ${insRes.insertedCount}`);
  console.log('Mix:', JSON.stringify(cards.reduce((a,c)=>{a[c.metadata.difficulty]=(a[c.metadata.difficulty]||0)+1;return a;},{})));
  fs.writeFileSync(`_agents/snapshots/flashcards_diagrams_wishlist_${CHAPTER.id}_rewrite.json`, JSON.stringify(wishlist, null, 2));
  console.log(`Wishlist: ${wishlist.length}`);
  console.log(`ROLLBACK: node scripts/flashcards-cleanup/_rollback.js flashcards_${CHAPTER.id}_rewrite_${STAMP_KEY}.json && delete IDs ${ID_START}-${idCursor-1}`);
  await mongoose.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
