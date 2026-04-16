'use strict';
/**
 * Class 12 — Chapter 5: Solutions
 * Pages 7–13: Raoult's Law → Van't Hoff Factor
 */
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const BOOK_ID   = 'be7b5b7f-e993-4d3b-b9c8-52f7c308ab0e';
const BOOK_SLUG = 'ncert-simplified';
const CHAPTER   = 5;
const NOW       = new Date();

function page(page_number, title, subtitle, slug, blocks) {
  return {
    _id: uuidv4(), book_id: BOOK_ID, book_slug: BOOK_SLUG,
    chapter_number: CHAPTER, page_number, title, subtitle, slug,
    blocks, tags: [], published: true,
    reading_time_min: Math.max(5, Math.round(blocks.length * 0.9)),
    created_at: NOW, updated_at: NOW,
  };
}

const PAGES = [

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 7 — Raoult's Law
// ═══════════════════════════════════════════════════════════════════════════════
page(7, "Raoult's Law and Vapour Pressure of Solutions",
  'How dissolved substances reduce vapour pressure — and Dalton\'s law of composition',
  'raoults-law',
[
  { id: uuidv4(), type: 'reasoning_prompt', order: 0,
    reasoning_type: 'quantitative',
    prompt: 'You mix equal moles of benzene (vapour pressure = 95 mmHg) and toluene (vapour pressure = 29 mmHg) at 25°C. A classmate says: "The total vapour pressure must be close to 95 mmHg since benzene dominates with its high vapour pressure." Another says it must be exactly 62 mmHg — the arithmetic mean. Who is right, and how would you calculate the true answer?',
    options: [
      'The first classmate is right — the more volatile component always dominates the total pressure',
      'The second classmate is right — the total is always the average of the two vapour pressures',
      'Neither — the total pressure is the sum of each component\'s contribution, weighted by mole fraction: p_total = p°_A × x_A + p°_B × x_B = 95×0.5 + 29×0.5 = 62 mmHg. The second classmate gets the right number for the wrong reason (average only works for equal moles)',
      'The total is 95 + 29 = 124 mmHg — all vapour pressures add directly',
    ],
    correct_index: 2,
    reveal: 'Raoult\'s law: each component contributes to the total vapour pressure in proportion to its mole fraction. p_total = p°(benzene) × x(benzene) + p°(toluene) × x(toluene) = 95 × 0.5 + 29 × 0.5 = 47.5 + 14.5 = 62 mmHg. The arithmetic mean gives 62 mmHg here only because mole fractions are equal (both 0.5). With unequal moles, the more volatile component\'s contribution would dominate — but it is still weighted by mole fraction, not absolute.',
    difficulty_level: 2,
  },
  { id: uuidv4(), type: 'callout', variant: 'fun_fact', order: 1,
    title: 'Real Life Hook',
    markdown: 'François-Marie Raoult spent twelve years (1878–1890) patiently measuring the vapour pressures of hundreds of solutions. He discovered the same law applied to all dilute solutions regardless of the chemical identity of the solute — as long as it was non-volatile. His insight was that *only the solvent evaporates*, and its ability to evaporate is reduced in proportion to how much solute is blocking the surface. A simple geometric idea that now underpins everything from industrial distillation to osmotic drug delivery.',
  },
  { id: uuidv4(), type: 'heading', order: 2, text: "Raoult's Law — For Volatile Solutes", level: 2 },
  { id: uuidv4(), type: 'text', order: 3,
    markdown: "For a solution of two volatile components (A and B), each component obeys Raoult's law independently:\n\n$$p_A = p_A^\\circ \\cdot x_A \\qquad p_B = p_B^\\circ \\cdot x_B$$\n\nBy **Dalton's law of partial pressures**, the total vapour pressure:\n$$p_{\\text{total}} = p_A + p_B = p_A^\\circ x_A + p_B^\\circ x_B$$\n\nwhere $p_A^\\circ$ and $p_B^\\circ$ are the vapour pressures of pure A and pure B, and $x_A$, $x_B$ are their mole fractions in solution.\n\n**Key result:** $p_{\\text{total}}$ lies between $p_A^\\circ$ and $p_B^\\circ$ — the total pressure is always intermediate.",
  },
  { id: uuidv4(), type: 'heading', order: 4, text: "Raoult's Law — For Non-Volatile Solutes", level: 2 },
  { id: uuidv4(), type: 'text', order: 5,
    markdown: "When the solute is non-volatile (solid dissolved in liquid — e.g. NaCl in water), it contributes zero vapour pressure. Only the solvent evaporates:\n\n$$p_{\\text{solution}} = p_1^\\circ \\cdot x_1$$\n\nSince $x_1 = 1 - x_2$ (mole fraction of solvent = 1 − mole fraction of solute):\n$$p_{\\text{solution}} = p_1^\\circ (1 - x_2)$$\n\n**Relative lowering of vapour pressure (RLVP):**\n$$\\frac{p_1^\\circ - p_{\\text{solution}}}{p_1^\\circ} = x_2$$\n\nRLVP equals the mole fraction of the solute — a colligative property that depends only on *how many* solute particles are present, not *what* they are.",
  },
  { id: uuidv4(), type: 'image', order: 6,
    src: '', alt: "Graph showing total vapour pressure vs mole fraction for benzene-toluene system obeying Raoult's law",
    caption: "📸 Benzene-toluene vapour pressure diagram: linear variation of p_A, p_B, and p_total with mole fraction — a textbook ideal solution",
    width: 'full',
    generation_prompt: "Vapour pressure vs mole fraction graph for benzene-toluene ideal solution. X-axis: mole fraction of benzene (0 to 1). Y-axis: vapour pressure in mmHg (0 to 120). Three lines: (1) p_toluene: linear from 29 mmHg at x=0 to 0 at x=1, in blue. (2) p_benzene: linear from 0 at x=0 to 95 mmHg at x=1, in orange. (3) p_total: linear from 29 mmHg at x=0 to 95 mmHg at x=1, in white/amber, labelled p_total = p°_toluene × x_toluene + p°_benzene × x_benzene. Mark the midpoint at x_benzene = 0.5 showing p_total = 62 mmHg. Dark background, orange accent labels, clean technical illustration style.",
  },
  { id: uuidv4(), type: 'callout', variant: 'remember', order: 7,
    title: 'Remember',
    markdown: "**Raoult's law applies to the solvent, not the solute.** The solvent's partial pressure = $p^\\circ_{\\text{solvent}} \\times x_{\\text{solvent}}$.\n\n**RLVP = mole fraction of solute:** $\\frac{p^\\circ - p_s}{p^\\circ} = x_2$ — valid for dilute solutions only.\n\n**Composition of vapour ≠ composition of liquid.** The vapour is richer in the more volatile component. This is the basis of distillation.",
  },
  { id: uuidv4(), type: 'worked_example', order: 8,
    label: 'NCERT 2.6', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: "The vapour pressure of pure benzene at 25°C is 0.850 bar. A non-volatile, non-electrolyte solid weighing 0.5 g is dissolved in 39.0 g of benzene (molar mass = 78 g/mol). The vapour pressure of the solution is 0.845 bar. Find the molar mass of the solid.",
    solution: "**Step 1 — RLVP:**\n$$\\frac{p^\\circ - p_s}{p^\\circ} = \\frac{0.850 - 0.845}{0.850} = \\frac{0.005}{0.850} = 5.88 \\times 10^{-3}$$\n\n**Step 2 — Moles of benzene:**\n$$n_1 = \\frac{39.0}{78} = 0.5 \\text{ mol}$$\n\n**Step 3 — Mole fraction of solute = RLVP:**\n$$x_2 = \\frac{n_2}{n_1 + n_2} \\approx \\frac{n_2}{n_1} = 5.88 \\times 10^{-3}$$\n(approximation valid for dilute solution)\n\n$$n_2 = 5.88 \\times 10^{-3} \\times 0.5 = 2.94 \\times 10^{-3} \\text{ mol}$$\n\n**Step 4 — Molar mass:**\n$$M_2 = \\frac{0.5}{2.94 \\times 10^{-3}} = 170 \\text{ g/mol}$$\n\n**Answer:** Molar mass of solid = **170 g/mol**",
  },
  { id: uuidv4(), type: 'callout', variant: 'exam_tip', order: 9,
    title: 'JEE / NEET Exam Insight',
    markdown: "**RLVP for dilute solutions:** $\\frac{p^\\circ - p_s}{p^\\circ} \\approx \\frac{n_2}{n_1}$ (approximation when $n_2 \\ll n_1$). The exact formula is $\\frac{n_2}{n_1 + n_2}$.\n\n**Vapour composition:** Mole fraction of A in vapour: $y_A = \\frac{p_A}{p_{\\text{total}}} = \\frac{p_A^\\circ x_A}{p_{\\text{total}}}$. The vapour is always richer in the more volatile component.\n\n**Colligative property check:** RLVP depends only on $x_2$ (number of solute particles), not on the nature of the solute. 1 mol glucose and 1 mol urea in the same solvent give the same RLVP.",
  },
  { id: uuidv4(), type: 'inline_quiz', order: 10, pass_threshold: 0.67,
    questions: [
      { id: uuidv4(), question: "According to Raoult's law, the partial vapour pressure of a component in a liquid mixture is:", options: ['Equal to the vapour pressure of the pure component', 'Equal to the vapour pressure of the pure component multiplied by its mole fraction in the solution', 'Inversely proportional to its mole fraction', 'Independent of the composition of the solution'], correct_index: 1, explanation: "Raoult's law: p_A = p°_A × x_A. The vapour pressure is reduced from the pure value in proportion to the mole fraction. The more solute present (smaller x_A for solvent), the greater the reduction in vapour pressure." },
      { id: uuidv4(), question: 'Equal masses of methanol (M = 32) and ethanol (M = 46) are mixed. The vapour pressures of pure methanol and pure ethanol at 25°C are 90 mmHg and 44 mmHg. What is the total vapour pressure of the mixture?', options: ['67 mmHg (arithmetic average)', '70.4 mmHg', '134 mmHg', '90 mmHg'], correct_index: 1, explanation: 'Take 100 g of each. n(methanol) = 100/32 = 3.125 mol. n(ethanol) = 100/46 = 2.174 mol. Total = 5.299 mol. x(methanol) = 3.125/5.299 = 0.590. x(ethanol) = 0.410. p_total = 90×0.590 + 44×0.410 = 53.1 + 18.0 = 71.1 ≈ 70.4 mmHg. It is not the arithmetic average (67) because the mole fractions are not equal.' },
      { id: uuidv4(), question: 'The relative lowering of vapour pressure (RLVP) of two solutions — one with 1 mol of glucose and one with 1 mol of NaCl, each dissolved in 1 kg of water — are compared. A student predicts they will be equal since both have "1 mol of solute." Is she right?', options: ['Yes — colligative properties depend only on the number of moles, and both have 1 mol', 'No — NaCl dissociates into 2 ions (Na⁺ + Cl⁻) giving 2 mol of particles in solution, while glucose gives 1 mol of particles. NaCl solution has approximately twice the RLVP of glucose solution', 'Yes — NaCl and glucose both have the same molar mass so the effect is identical', 'No — glucose is larger and blocks more surface area, giving a higher RLVP'], correct_index: 1, explanation: 'Colligative properties depend on the number of dissolved particles (moles of solute particles), not the identity or original moles of solute. NaCl is a strong electrolyte: 1 mol → 2 mol particles (Na⁺ + Cl⁻). Glucose is a non-electrolyte: 1 mol → 1 mol particles. The NaCl solution has approximately twice as many particles → approximately twice the RLVP. This is accounted for by the van\'t Hoff factor (i), covered in the final page.' },
    ],
  },
]),

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 8 — Ideal and Non-Ideal Solutions
// ═══════════════════════════════════════════════════════════════════════════════
page(8, 'Ideal and Non-Ideal Solutions',
  "Deviations from Raoult's law, azeotropes, and why like dissolves like",
  'ideal-nonideal-solutions',
[
  { id: uuidv4(), type: 'reasoning_prompt', order: 0,
    reasoning_type: 'analogical',
    prompt: 'When ethanol and water are mixed, the total volume is slightly less than the sum of the pure volumes — the mixture "contracts." When acetone and carbon disulphide are mixed, the volume expands slightly. What do these observations reveal about the intermolecular forces in each mixture — and what would you predict about how their boiling points compare to Raoult\'s law predictions?',
    options: [
      'Volume change tells us nothing about intermolecular forces or boiling points',
      'Volume contraction (ethanol-water) suggests stronger A-B interactions than pure A-A or B-B — molecules pack closer. This gives negative deviation from Raoult\'s law (lower vapour pressure, higher boiling point than predicted). Volume expansion suggests weaker A-B interactions — positive deviation (higher vapour pressure, lower boiling point)',
      'Volume contraction means the mixture is denser, which always lowers the boiling point',
      'Volume changes are caused by temperature effects, not intermolecular forces',
    ],
    correct_index: 1,
    reveal: 'ΔV_mix = 0 is a condition of ideal solutions. Contraction means the new A-B interactions are stronger than what existed in pure A and pure B — molecules are held more tightly, vapour pressure falls below Raoult\'s prediction (negative deviation). Expansion means A-B interactions are weaker — molecules escape more easily, vapour pressure exceeds Raoult\'s prediction (positive deviation). These observations (volume, heat of mixing, vapour pressure) all reflect the same underlying reality: intermolecular force changes on mixing.',
    difficulty_level: 3,
  },
  { id: uuidv4(), type: 'callout', variant: 'fun_fact', order: 1,
    title: 'Real Life Hook',
    markdown: 'Pure ethanol boils at 78.4°C. Pure water boils at 100°C. You might expect that a mixture would boil somewhere between these two temperatures. But at 95.6% ethanol, the mixture boils at 78.1°C — *lower than pure ethanol*. This is a **minimum-boiling azeotrope**: a mixture that boils at a lower temperature than either pure component. You can\'t distil it any further — the vapour has the same composition as the liquid. This is why you cannot make 100% pure alcohol by distillation alone. Every bottle of whisky, rum, and vodka is a living demonstration of non-ideal solution behaviour.',
  },
  { id: uuidv4(), type: 'heading', order: 2, text: 'Ideal Solutions', level: 2 },
  { id: uuidv4(), type: 'text', order: 3,
    markdown: "An **ideal solution** obeys Raoult's law at every concentration. It forms when:\n- A-B intermolecular forces = A-A and B-B forces\n- $\\Delta H_{\\text{mix}} = 0$ (no heat released or absorbed on mixing)\n- $\\Delta V_{\\text{mix}} = 0$ (no volume change on mixing)\n\n**Examples:** benzene + toluene, ethanol + methanol, $n$-hexane + $n$-heptane (similar molecules, similar forces)",
  },
  { id: uuidv4(), type: 'heading', order: 4, text: 'Non-Ideal Solutions — Deviations from Raoult\'s Law', level: 2 },
  { id: uuidv4(), type: 'comparison_card', order: 5,
    title: 'Positive vs Negative Deviation',
    columns: [
      { heading: 'Positive Deviation', points: ['p_observed > p_Raoult (higher vapour pressure than predicted)', 'A-B interactions weaker than A-A and B-B', 'ΔH_mix > 0 (endothermic mixing)', 'ΔV_mix > 0 (volume expansion)', 'Forms minimum-boiling azeotrope', 'Examples: ethanol-water, acetone-CS₂, acetone-benzene'] },
      { heading: 'Negative Deviation', points: ['p_observed < p_Raoult (lower vapour pressure than predicted)', 'A-B interactions stronger than A-A and B-B', 'ΔH_mix < 0 (exothermic mixing)', 'ΔV_mix < 0 (volume contraction)', 'Forms maximum-boiling azeotrope', 'Examples: acetone-chloroform, HNO₃-water, phenol-aniline'] },
    ],
  },
  { id: uuidv4(), type: 'heading', order: 6, text: 'Azeotropes', level: 2 },
  { id: uuidv4(), type: 'text', order: 7,
    markdown: 'An **azeotrope** is a mixture that boils at a constant temperature and has the same composition in vapour and liquid phases — it cannot be further separated by simple distillation.\n\n**Minimum-boiling azeotrope** (positive deviation):\n- Boils below both pure components\n- Example: ethanol-water at 95.6% ethanol, 78.1°C\n- Absolute alcohol cannot be made by distillation alone\n\n**Maximum-boiling azeotrope** (negative deviation):\n- Boils above both pure components\n- Example: $\\ce{HNO3}$-water at 68% $\\ce{HNO3}$, 120.5°C\n- Purifying by distillation produces the azeotropic composition, not pure component',
  },
  { id: uuidv4(), type: 'image', order: 8,
    src: '', alt: 'Vapour pressure vs composition curves showing positive and negative deviation from Raoult\'s law',
    caption: '📸 Non-ideal solutions: curves bulge above (positive deviation) or below (negative deviation) the straight Raoult\'s law line',
    width: 'full',
    generation_prompt: "Two side-by-side vapour pressure vs mole fraction graphs. Left graph labelled 'Positive Deviation': X-axis mole fraction of A (0 to 1), Y-axis vapour pressure. Show dashed straight Raoult's law line between p°_B and p°_A. Show solid curve bulging ABOVE the dashed line, labelled 'Observed p_total'. Label region 'p > Raoult prediction'. Right graph labelled 'Negative Deviation': same axes. Show dashed straight Raoult's law line. Show solid curve dipping BELOW the dashed line, labelled 'Observed p_total'. Label region 'p < Raoult prediction'. Both graphs show component contributions p_A and p_B. Dark background, orange accent labels, clean technical illustration style.",
  },
  { id: uuidv4(), type: 'callout', variant: 'exam_tip', order: 9,
    title: 'JEE / NEET Exam Insight',
    markdown: '**Memory aid for deviations:**\n- Positive deviation → **weaker** new interactions → molecules escape more easily → **higher** vapour pressure → **lower** boiling point\n- Negative deviation → **stronger** new interactions → molecules escape less easily → **lower** vapour pressure → **higher** boiling point\n\n**Azeotrope exam pattern:** "Which cannot be separated by distillation?" → Azeotrope.\n\n**JEE frequently tests:** Acetone + chloroform → negative deviation (C=O of acetone forms H-bond with CHCl₃). Ethanol + water → positive deviation (H-bonding between unlike molecules is weaker than water-water H-bonds).',
  },
  { id: uuidv4(), type: 'inline_quiz', order: 10, pass_threshold: 0.67,
    questions: [
      { id: uuidv4(), question: 'Which conditions must both be satisfied for a solution to be ideal?', options: ['ΔH_mix = 0 and ΔS_mix = 0', 'ΔH_mix = 0 and ΔV_mix = 0', 'ΔG_mix = 0 and ΔV_mix = 0', 'ΔS_mix > 0 and ΔH_mix < 0'], correct_index: 1, explanation: 'An ideal solution has ΔH_mix = 0 (no energy change on mixing — A-B forces equal A-A and B-B) and ΔV_mix = 0 (no volume change). ΔS_mix is always positive for any mixing process (entropy increases), so it does not distinguish ideal from non-ideal.' },
      { id: uuidv4(), question: 'When acetone and chloroform are mixed, the mixture becomes warm and its volume contracts slightly. What type of deviation from Raoult\'s law does this system show?', options: ['Positive deviation — the exothermic mixing shows stronger forces', 'Negative deviation — stronger A-B interactions (chloroform H-bonds to acetone C=O) reduce vapour pressure below the Raoult\'s law prediction', 'Ideal behaviour — volume contraction indicates ideal conditions', 'Positive deviation — the heat released indicates weaker interactions'], correct_index: 1, explanation: 'Warm mixture (ΔH_mix < 0, exothermic) + volume contraction (ΔV_mix < 0) = negative deviation. The CHCl₃ hydrogen bonds strongly to the C=O group of acetone — these new A-B interactions are stronger than what existed in pure acetone (dipole-dipole) or pure chloroform (weak H-bonds). Stronger interactions → molecules held more firmly → lower vapour pressure → negative deviation.' },
      { id: uuidv4(), question: 'A distillation column processes an ethanol-water mixture and concentrates ethanol from 60% to 95.6%. At 95.6%, further distillation produces vapour of the same composition as the liquid. What happens when you try to distil this mixture further, and why?', options: ['Further distillation produces pure ethanol because ethanol is more volatile', 'Further distillation produces pure water because the azeotrope breaks down at 95.6%', 'No further separation occurs — the 95.6% ethanol-water mixture is an azeotrope where liquid and vapour have identical composition. Boiling it produces vapour of the same composition, leaving the liquid composition unchanged', 'The mixture decomposes chemically at this concentration'], correct_index: 2, explanation: 'An azeotrope is a mixture where liquid and vapour have identical composition at a fixed temperature. When you boil it, vapour and liquid are the same — no enrichment occurs. For the ethanol-water minimum-boiling azeotrope (95.6% ethanol, bp 78.1°C), distillation cannot break through this composition. Absolute ethanol (100%) requires drying with molecular sieves, CaO, or other desiccants to remove the residual 4.4% water.' },
    ],
  },
]),

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 9 — Colligative Properties + Relative Lowering of Vapour Pressure
// ═══════════════════════════════════════════════════════════════════════════════
page(9, 'Colligative Properties',
  'What they are, why they depend only on particle count, and relative lowering of vapour pressure',
  'colligative-properties-intro',
[
  { id: uuidv4(), type: 'reasoning_prompt', order: 0,
    reasoning_type: 'logical',
    prompt: 'You add 10 g of table salt (NaCl) to boiling water while cooking pasta. A friend says this "raises the boiling point and cooks pasta faster." Is this chemically correct? Does 10 g of NaCl in 1 litre of water produce a meaningful boiling point elevation?',
    options: [
      'Yes — any amount of dissolved salt raises the boiling point significantly',
      'Technically yes, but practically no: 10 g NaCl in 1 L gives molality ≈ 0.17 m (factoring i = 2 for NaCl dissociation → 0.34 effective molal particles). ΔTb = 0.52 × 0.34 ≈ 0.18°C — far too small to noticeably change cooking time. The real reason you add salt is flavour',
      'No — salt actually lowers the boiling point, which is why pasta cooks faster',
      'Yes — the boiling point rises by at least 5°C, significantly speeding up cooking',
    ],
    correct_index: 1,
    reveal: 'Boiling point elevation is real but minuscule for typical cooking salt quantities. ΔTb = Kb × m, Kb(water) = 0.52 K·kg/mol. With NaCl (i = 2): effective molality ≈ 0.34 mol/kg. ΔTb ≈ 0.18°C — negligible. You\'d need to add nearly a kilogram of NaCl to raise the boiling point by 1°C. Cooks add salt for taste, not physics. But the same equation predicts a 1.86°C depression per molal particle for freezing — which is why road salt melts ice at −10°C.',
    difficulty_level: 2,
  },
  { id: uuidv4(), type: 'callout', variant: 'fun_fact', order: 1,
    title: 'Real Life Hook',
    markdown: 'The four **colligative properties** were discovered and quantified between 1870 and 1900 — and they revolutionised chemistry. Before them, chemists had no reliable method for determining molar masses of large molecules. After them, you could dissolve a mysterious protein in water, measure how much the freezing point dropped, and calculate its molar mass. **François-Marie Raoult** and **Jacobus van\'t Hoff** (Nobel Prize 1901) developed this toolkit. Every molar mass in 1890s chemistry was determined this way.',
  },
  { id: uuidv4(), type: 'heading', order: 2, text: 'What Are Colligative Properties?', level: 2 },
  { id: uuidv4(), type: 'text', order: 3,
    markdown: '**Colligative properties** are solution properties that depend only on the **number of solute particles** (moles), not on the identity, size, charge, or chemical nature of those particles.\n\nThe four colligative properties:\n1. **Relative lowering of vapour pressure (RLVP)**\n2. **Elevation of boiling point** ($\\Delta T_b$)\n3. **Depression of freezing point** ($\\Delta T_f$)\n4. **Osmotic pressure** ($\\pi$)\n\n**Why particle count only?** These properties arise from how solute particles dilute the solvent — replacing solvent molecules at the liquid surface or membrane interface. A large molecule and a small molecule, if equally numerous, have the same effect.',
  },
  { id: uuidv4(), type: 'heading', order: 4, text: 'Relative Lowering of Vapour Pressure (RLVP)', level: 2 },
  { id: uuidv4(), type: 'text', order: 5,
    markdown: "From Raoult's law for non-volatile solute:\n$$\\text{RLVP} = \\frac{p_1^\\circ - p_{\\text{solution}}}{p_1^\\circ} = x_2 = \\frac{n_2}{n_1 + n_2}$$\n\nFor dilute solutions ($n_2 \\ll n_1$):\n$$\\frac{p_1^\\circ - p_s}{p_1^\\circ} \\approx \\frac{n_2}{n_1} = \\frac{w_2 \\cdot M_1}{w_1 \\cdot M_2}$$\n\nThis equation is the basis of **molar mass determination** from vapour pressure measurements.",
  },
  { id: uuidv4(), type: 'worked_example', order: 6,
    label: 'NCERT 2.7', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: "The vapour pressure of water is 12.3 kPa at 300 K. Calculate the vapour pressure of 1 molal solution of a non-volatile solute at this temperature. (Molar mass of water = 18 g/mol)",
    solution: "**Step 1 — 1 molal means:** 1 mol solute in 1000 g water.\n\n**Step 2 — Moles:**\n$n_1$ (water) $= \\frac{1000}{18} = 55.5$ mol, $\\quad n_2 = 1$ mol\n\n**Step 3 — Mole fraction of solute:**\n$$x_2 = \\frac{1}{55.5 + 1} = \\frac{1}{56.5} = 0.0177$$\n\n**Step 4 — Mole fraction of water:**\n$$x_1 = 1 - 0.0177 = 0.9823$$\n\n**Step 5 — Vapour pressure of solution:**\n$$p_s = p_1^\\circ \\cdot x_1 = 12.3 \\times 0.9823 = 12.08 \\text{ kPa}$$\n\n**Answer:** Vapour pressure = **12.08 kPa**",
  },
  { id: uuidv4(), type: 'callout', variant: 'exam_tip', order: 7,
    title: 'JEE / NEET Exam Insight',
    markdown: '**Colligative property identification:** "Depends on number of particles, not identity" → colligative. If a question says "0.1 m glucose" vs "0.1 m NaCl," they do NOT give the same colligative effect — NaCl gives 0.2 m effective particles (i = 2).\n\n**RLVP for molar mass:** Rearranged: $M_2 = \\frac{w_2 M_1 p_1^\\circ}{w_1 (p_1^\\circ - p_s)}$\n\n**Key numbers to remember:**\n- $K_b$ (water) = 0.52 K·kg/mol\n- $K_f$ (water) = 1.86 K·kg/mol\n- $K_b$(benzene) = 2.53, $K_f$(benzene) = 5.12\n- $K_f$(camphor) = 37.7 — very large, useful for molar mass of polymers',
  },
  { id: uuidv4(), type: 'inline_quiz', order: 8, pass_threshold: 0.67,
    questions: [
      { id: uuidv4(), question: 'Which of the following is NOT a colligative property?', options: ['Osmotic pressure', 'Electrical conductivity of a solution', 'Elevation of boiling point', 'Depression of freezing point'], correct_index: 1, explanation: 'Electrical conductivity depends on the identity of the ions (their charge, size, mobility) — not just how many particles there are. A solution of NaCl and a solution of glucose with the same number of particles have completely different conductivities (NaCl conducts; glucose doesn\'t). Therefore conductivity is NOT a colligative property. All the others depend only on particle count.' },
      { id: uuidv4(), question: 'The vapour pressure of pure water at 25°C is 23.8 mmHg. When 18 g of glucose (M = 180 g/mol) is dissolved in 90 g of water, the vapour pressure drops to:', options: ['23.4 mmHg', '23.56 mmHg', '22.8 mmHg', '23.0 mmHg'], correct_index: 1, explanation: 'n(glucose) = 18/180 = 0.1 mol. n(water) = 90/18 = 5 mol. x(water) = 5/5.1 = 0.9804. p_s = 23.8 × 0.9804 = 23.33 mmHg ≈ 23.34 mmHg. The closest option is 23.4 mmHg, which corresponds to approximate calculation with RLVP = 0.1/5.1 ≈ 0.0196.' },
      { id: uuidv4(), question: '1 mol of glucose and 1 mol of NaCl are each dissolved separately in 1 kg of water. Which solution has a lower vapour pressure, and by roughly how much?', options: ['Glucose — it is a larger molecule so it blocks more surface area', 'NaCl — it dissociates into 2 particles per formula unit (Na⁺ + Cl⁻), giving twice the number of solute particles, roughly twice the mole fraction of solute, and roughly twice the RLVP', 'Both give identical vapour pressure lowering — 1 mol is 1 mol', 'Glucose — because it does not dissociate, it stays intact and is more effective'], correct_index: 1, explanation: '1 mol NaCl → 2 mol particles (in dilute solution). 1 mol glucose → 1 mol particles. RLVP ∝ x(solute) ∝ n(solute particles). NaCl gives approximately twice as many particles → approximately twice the RLVP → lower vapour pressure. This is the essence of the van\'t Hoff factor (i = 2 for NaCl), which modifies all colligative property calculations for electrolytes.' },
    ],
  },
]),

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 10 — Elevation of Boiling Point
// ═══════════════════════════════════════════════════════════════════════════════
page(10, 'Elevation of Boiling Point',
  'Why solutions boil higher, the ebullioscopic constant, and molar mass determination',
  'boiling-point-elevation',
[
  { id: uuidv4(), type: 'reasoning_prompt', order: 0,
    reasoning_type: 'logical',
    prompt: 'A liquid boils when its vapour pressure equals atmospheric pressure. A dissolved non-volatile solute always lowers the vapour pressure of the solvent. Without any equations, predict: will a solution have a higher or lower boiling point than the pure solvent, and why?',
    options: [
      'Lower boiling point — solute weakens intermolecular forces, making it easier to vaporise',
      'Higher boiling point — since the solution\'s vapour pressure is lower than the pure solvent at the same temperature, you must heat it to a higher temperature for its vapour pressure to reach atmospheric pressure. More heat needed = higher boiling point',
      'Same boiling point — the solute does not affect the vapour pressure at the boiling point',
      'Lower boiling point — the solute adds extra molecules that escape more easily',
    ],
    correct_index: 1,
    reveal: 'The reasoning is purely from the vapour pressure curve. A pure solvent boils at Tb° (where VP = 1 atm). The solution\'s VP curve is shifted downward by the solute. To reach 1 atm, the solution must be heated beyond Tb° — the boiling point rises. The amount of rise (ΔTb) is proportional to the mole fraction of solute, and since molality is proportional to mole fraction for dilute solutions, ΔTb = Kb × m. The solute "gets in the way" of evaporation — more heat is needed to overcome this effect.',
    difficulty_level: 2,
  },
  { id: uuidv4(), type: 'callout', variant: 'fun_fact', order: 1,
    title: 'Real Life Hook',
    markdown: 'Car engines run at temperatures above 100°C. If the coolant were pure water, it would boil away in minutes. Engine coolant (ethylene glycol + water) has a boiling point elevated to ~108°C and a freezing point depressed to −37°C. A single solution — one compound — provides protection against both summer boiling and winter freezing. This is boiling point elevation and freezing point depression working simultaneously, designed precisely using $\\Delta T_b = K_b m$ and $\\Delta T_f = K_f m$.',
  },
  { id: uuidv4(), type: 'heading', order: 2, text: 'The Equation', level: 2 },
  { id: uuidv4(), type: 'text', order: 3,
    markdown: '$$\\Delta T_b = T_b - T_b^\\circ = K_b \\cdot m$$\n\nwhere:\n- $\\Delta T_b$ = elevation of boiling point (K or °C)\n- $T_b^\\circ$ = boiling point of pure solvent\n- $T_b$ = boiling point of solution ($> T_b^\\circ$)\n- $K_b$ = **ebullioscopic constant** (molal boiling point elevation constant) — depends only on the solvent\n- $m$ = molality of solution (mol of solute per kg of solvent)\n\n**Molality formula expanded:**\n$$\\Delta T_b = K_b \\times \\frac{w_2 \\times 1000}{M_2 \\times w_1}$$\n\nwhere $w_2$ = mass of solute (g), $M_2$ = molar mass of solute, $w_1$ = mass of solvent (g).',
  },
  { id: uuidv4(), type: 'table', order: 4,
    caption: 'Ebullioscopic constants (Kb) and normal boiling points of common solvents',
    headers: ['Solvent', 'Boiling Point (°C)', 'Kb (K·kg/mol)'],
    rows: [
      ['Water', '100.0', '0.52'],
      ['Benzene', '80.1', '2.53'],
      ['Ethanol', '78.4', '1.20'],
      ['Chloroform', '61.2', '3.63'],
      ['Carbon tetrachloride', '76.7', '5.03'],
    ],
  },
  { id: uuidv4(), type: 'worked_example', order: 5,
    label: 'NCERT 2.8', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: '1.8 g of glucose ($\\ce{C6H12O6}$, $M = 180$ g/mol) is dissolved in 100 g of water. Find the boiling point of the solution. ($K_b$ for water = 0.52 K·kg/mol)',
    solution: '**Step 1 — Molality:**\n$$m = \\frac{w_2 \\times 1000}{M_2 \\times w_1} = \\frac{1.8 \\times 1000}{180 \\times 100} = \\frac{1800}{18000} = 0.1 \\text{ mol/kg}$$\n\n**Step 2 — ΔTb:**\n$$\\Delta T_b = K_b \\times m = 0.52 \\times 0.1 = 0.052 \\text{ K}$$\n\n**Step 3 — Boiling point of solution:**\n$$T_b = 100 + 0.052 = 100.052°\\text{C}$$\n\n**Answer:** Boiling point = **100.052°C** (negligibly above pure water)',
  },
  { id: uuidv4(), type: 'worked_example', order: 6,
    label: 'NCERT 2.9', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: 'The boiling point of benzene is 353.23 K. When 1.80 g of a non-volatile solute is dissolved in 90 g of benzene, the boiling point is raised to 354.11 K. Calculate the molar mass of the solute. ($K_b$ for benzene = 2.53 K·kg/mol)',
    solution: '**Step 1 — ΔTb:**\n$$\\Delta T_b = 354.11 - 353.23 = 0.88 \\text{ K}$$\n\n**Step 2 — Molality from ΔTb:**\n$$m = \\frac{\\Delta T_b}{K_b} = \\frac{0.88}{2.53} = 0.348 \\text{ mol/kg}$$\n\n**Step 3 — Moles of solute in 90 g benzene:**\n$$n_2 = 0.348 \\times \\frac{90}{1000} = 0.0313 \\text{ mol}$$\n\n**Step 4 — Molar mass:**\n$$M_2 = \\frac{1.80}{0.0313} = 57.5 \\text{ g/mol}$$\n\n**Answer:** Molar mass = **57.5 g/mol**',
  },
  { id: uuidv4(), type: 'callout', variant: 'exam_tip', order: 7,
    title: 'JEE / NEET Exam Insight',
    markdown: '**ΔTb is always positive** — boiling point always rises when solute is added.\n\n**Unit trap:** $K_b$ is in K·kg/mol. Molality must be in mol/kg. Mass of solvent must be in kg in the formula (or use the expanded form with 1000 factor).\n\n**Electrolyte trap:** For electrolytes, use effective molality = $i \\times m$ where $i$ is van\'t Hoff factor. NaCl: $\\Delta T_b = 2 \\times K_b \\times m$.\n\n**Molar mass shortcut:** $M_2 = \\frac{K_b \\times w_2 \\times 1000}{\\Delta T_b \\times w_1}$',
  },
  { id: uuidv4(), type: 'inline_quiz', order: 8, pass_threshold: 0.67,
    questions: [
      { id: uuidv4(), question: 'What does the ebullioscopic constant (Kb) of a solvent physically represent?', options: ['The boiling point of the pure solvent', 'The increase in boiling point per unit molality of any solute dissolved in that solvent', 'The ratio of solute moles to solvent moles at the boiling point', 'The energy needed to vaporise the solvent'], correct_index: 1, explanation: 'Kb is the boiling point elevation caused by 1 mol/kg (1 molal) of any non-volatile, non-electrolyte solute. It depends only on the identity of the solvent, not the solute. Water\'s Kb = 0.52 means 1 molal solution of any non-electrolyte boils at 100.52°C.' },
      { id: uuidv4(), question: '1 g of polymer is dissolved in 100 g of benzene, and the boiling point rises by 0.13°C. What is the approximate molar mass of the polymer? (Kb for benzene = 2.53)', options: ['194 g/mol', '19.4 kg/mol', '2.53 kg/mol', '253 g/mol'], correct_index: 0, explanation: 'ΔTb = Kb × m. m = ΔTb/Kb = 0.13/2.53 = 0.0514 mol/kg. Moles in 100 g benzene = 0.0514 × 0.1 = 0.00514 mol. M = 1/0.00514 = 194 g/mol. This is a low-mass polymer — most real polymers would show even smaller ΔTb, making precise measurement difficult and favouring freezing point depression (higher Kf) for large molecule molar mass determination.' },
      { id: uuidv4(), question: 'Two solutions are prepared in water: (A) 0.1 molal glucose, (B) 0.1 molal NaCl. Which has a higher boiling point, and by what approximate ratio?', options: ['(A) has a higher boiling point — glucose is larger', 'Both have identical boiling points — molality is the same', '(B) has approximately twice the boiling point elevation because NaCl dissociates into 2 particles (Na⁺ + Cl⁻) per formula unit, giving effective molality ≈ 0.2 mol/kg', '(B) has a higher boiling point but by a factor of 3, because NaCl is a stronger electrolyte'], correct_index: 2, explanation: 'Colligative properties depend on the number of solute particles. Glucose: 0.1 molal → 0.1 mol particles. NaCl: 0.1 molal → ~0.2 mol particles (i ≈ 2). ΔTb(glucose) = 0.52 × 0.1 = 0.052°C. ΔTb(NaCl) = 0.52 × 0.2 = 0.104°C (approximately). Solution B has roughly double the boiling point elevation. The exact value is slightly less than 2× because NaCl\'s van\'t Hoff factor is actually ~1.87 at 0.1 m due to ion pairing.' },
    ],
  },
]),

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 11 — Depression of Freezing Point
// ═══════════════════════════════════════════════════════════════════════════════
page(11, 'Depression of Freezing Point',
  'Why solutions freeze lower, cryoscopic constants, and anti-freeze chemistry',
  'freezing-point-depression',
[
  { id: uuidv4(), type: 'reasoning_prompt', order: 0,
    reasoning_type: 'quantitative',
    prompt: 'Road crews have a choice: spread NaCl (M = 58.5 g/mol, i = 2) or CaCl₂ (M = 111 g/mol, i = 3) on icy roads. Per 100 g of salt spread, which provides greater freezing point depression — and by how much? (Kf water = 1.86 K·kg/mol)',
    options: [
      'NaCl — it is lighter so more molecules per gram',
      'CaCl₂ — its 3 ions per formula unit outweigh the molar mass disadvantage: ΔTf(CaCl₂) ≈ 1.86 × (3 × 100/111) ≈ 5.0 K vs ΔTf(NaCl) ≈ 1.86 × (2 × 100/58.5) ≈ 6.4 K per kg water — so NaCl is actually more effective per gram due to its lower molar mass',
      'Both give the same depression since they are both chloride salts',
      'CaCl₂ is always better regardless of mass — more ions always wins',
    ],
    correct_index: 1,
    reveal: 'For 100 g salt in 1 kg water: ΔTf = i × Kf × (100/M). NaCl: 2 × 1.86 × (100/58.5) = 6.36 K. CaCl₂: 3 × 1.86 × (100/111) = 5.03 K. Per gram, NaCl is more effective! But CaCl₂ has an important practical advantage: it releases heat on dissolving (exothermic), which helps melt ice thermally AND lowers the freezing point. It works at lower temperatures (−30°C vs −10°C for NaCl). The choice involves cost, environmental impact, and performance at extreme cold — not just the calculation.',
    difficulty_level: 3,
  },
  { id: uuidv4(), type: 'callout', variant: 'fun_fact', order: 1,
    title: 'Real Life Hook',
    markdown: 'Antifreeze in a car radiator is typically 50% ethylene glycol ($\\ce{HOCH2CH2OH}$, $M = 62$) in water. At 50% by volume, this lowers the freezing point to about $-37°\\text{C}$ and raises the boiling point to about $108°\\text{C}$. But why don\'t we use pure ethylene glycol? Because the freezing point of pure glycol is $-13°\\text{C}$ — worse than the mixture! Adding water to glycol initially lowers the freezing point (colligative effect). The mixture beats either pure component. Nature\'s own antifreeze strategy: Arctic fish produce glycoproteins that interact with ice crystals and prevent their growth — a different mechanism but the same goal.',
  },
  { id: uuidv4(), type: 'heading', order: 2, text: 'The Equation', level: 2 },
  { id: uuidv4(), type: 'text', order: 3,
    markdown: '$$\\Delta T_f = T_f^\\circ - T_f = K_f \\cdot m$$\n\nwhere:\n- $\\Delta T_f$ = depression of freezing point (K or °C), always **positive**\n- $T_f^\\circ$ = freezing point of pure solvent; $T_f$ = freezing point of solution ($< T_f^\\circ$)\n- $K_f$ = **cryoscopic constant** (molal freezing point depression constant) — depends only on the solvent\n- $m$ = molality of solution\n\n**Expanded form:**\n$$\\Delta T_f = K_f \\times \\frac{w_2 \\times 1000}{M_2 \\times w_1}$$\n\nSolving for molar mass:\n$$M_2 = \\frac{K_f \\times w_2 \\times 1000}{\\Delta T_f \\times w_1}$$',
  },
  { id: uuidv4(), type: 'table', order: 4,
    caption: 'Cryoscopic constants (Kf) for common solvents',
    headers: ['Solvent', 'Freezing Point (°C)', 'Kf (K·kg/mol)'],
    rows: [
      ['Water', '0.0', '1.86'],
      ['Benzene', '5.5', '5.12'],
      ['Acetic acid', '16.6', '3.90'],
      ['Camphor', '179.0', '37.7'],
      ['Cyclohexane', '6.6', '20.2'],
    ],
  },
  { id: uuidv4(), type: 'worked_example', order: 5,
    label: 'NCERT 2.10', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: '45 g of ethylene glycol ($\\ce{C2H6O2}$, $M = 62$ g/mol) is mixed with 600 g of water. Calculate the freezing point of the solution. ($K_f$ for water = 1.86 K·kg/mol)',
    solution: '**Step 1 — Molality:**\n$$m = \\frac{w_2 \\times 1000}{M_2 \\times w_1} = \\frac{45 \\times 1000}{62 \\times 600} = \\frac{45000}{37200} = 1.209 \\text{ mol/kg}$$\n\n**Step 2 — ΔTf:**\n$$\\Delta T_f = K_f \\times m = 1.86 \\times 1.209 = 2.25 \\text{ K}$$\n\n**Step 3 — Freezing point of solution:**\n$$T_f = 0 - 2.25 = -2.25°\\text{C}$$\n\n**Answer:** The solution freezes at **−2.25°C**',
  },
  { id: uuidv4(), type: 'worked_example', order: 6,
    label: 'NCERT 2.11', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: '1.00 g of an unknown non-electrolyte dissolved in 50.0 g of benzene lowered the freezing point of benzene from 5.48°C to 5.25°C. Find the molar mass of the unknown. ($K_f$ for benzene = 5.12 K·kg/mol)',
    solution: '**Step 1 — ΔTf:**\n$$\\Delta T_f = 5.48 - 5.25 = 0.23 \\text{ K}$$\n\n**Step 2 — Molar mass:**\n$$M_2 = \\frac{K_f \\times w_2 \\times 1000}{\\Delta T_f \\times w_1} = \\frac{5.12 \\times 1.00 \\times 1000}{0.23 \\times 50.0}$$\n$$M_2 = \\frac{5120}{11.5} = 445 \\text{ g/mol}$$\n\n**Answer:** Molar mass of the unknown = **445 g/mol**',
  },
  { id: uuidv4(), type: 'callout', variant: 'exam_tip', order: 7,
    title: 'JEE / NEET Exam Insight',
    markdown: '**Kf vs Kb:** $K_f > K_b$ for the same solvent. This makes freezing point depression a more sensitive method for molar mass determination — especially for camphor ($K_f = 37.7$, Rast\'s method for large molecules).\n\n**Common trap:** $\\Delta T_f = T_f^\\circ - T_f$. The freezing point *falls*, so $\\Delta T_f$ is positive even though $T_f$ decreases. Students often get the sign wrong.\n\n**Electrolytes:** $\\Delta T_f = i \\cdot K_f \\cdot m$. For NaCl: $i \\approx 2$. For AlCl₃: $i \\approx 4$ (Al³⁺ + 3Cl⁻). For weak electrolytes: $i$ between 1 and maximum based on degree of dissociation.',
  },
  { id: uuidv4(), type: 'inline_quiz', order: 8, pass_threshold: 0.67,
    questions: [
      { id: uuidv4(), question: 'The freezing point of a solution is always _____ than the freezing point of the pure solvent, and the value of ΔTf is always _____:', options: ['Higher; negative', 'Lower; positive', 'Lower; negative', 'Higher; positive'], correct_index: 1, explanation: 'Adding solute always lowers the freezing point — the solution freezes at a lower temperature. ΔTf = T°f − Tf. Since T°f > Tf (solution freezes lower), the difference is positive. ΔTf is defined as a positive quantity representing the magnitude of depression.' },
      { id: uuidv4(), question: 'The molar mass of haemoglobin was historically estimated by dissolving 1.00 g in 100 mL of water and measuring a freezing point depression of 1.8 × 10⁻⁴ °C. Using Kf = 1.86, estimate the molar mass.', options: ['~10,000 g/mol', '~100,000 g/mol', '~1,000 g/mol', '~1,000,000 g/mol'], correct_index: 1, explanation: 'ΔTf = Kf × m. m = ΔTf/Kf = 1.8×10⁻⁴/1.86 = 9.68×10⁻⁵ mol/kg. In 100 mL ≈ 0.1 kg water: moles = 9.68×10⁻⁶ mol. Molar mass = 1.00 g / 9.68×10⁻⁶ mol ≈ 103,000 g/mol ≈ 100,000 g/mol. Actual molar mass of haemoglobin is ~64,500 g/mol. The tiny ΔTf for large molecules is why modern methods (mass spectrometry, light scattering) replaced freezing point depression for proteins.' },
      { id: uuidv4(), question: 'Sea water freezes at about −1.9°C rather than 0°C. Using Kf = 1.86, estimate the total molality of dissolved particles in sea water.', options: ['~0.5 mol/kg', '~1.0 mol/kg', '~1.8 mol/kg', '~2.5 mol/kg'], correct_index: 1, explanation: 'ΔTf = 1.9°C. m(effective) = ΔTf/Kf = 1.9/1.86 = 1.02 mol/kg. Sea water has total dissolved solids of ~35 g/kg, predominantly NaCl (~27 g/kg). With NaCl: 27/58.5 = 0.46 mol/kg × 2 ions = 0.92 mol/kg particles. Plus contributions from MgCl₂, MgSO₄, etc., total reaches ~1 mol/kg effective particles. This matches our calculation — a satisfying consistency check.' },
    ],
  },
]),

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 12 — Osmosis and Osmotic Pressure
// ═══════════════════════════════════════════════════════════════════════════════
page(12, 'Osmosis and Osmotic Pressure',
  'Semipermeable membranes, the van\'t Hoff equation, and reverse osmosis',
  'osmosis-osmotic-pressure',
[
  { id: uuidv4(), type: 'reasoning_prompt', order: 0,
    reasoning_type: 'analogical',
    prompt: 'A cucumber shrivels when placed in concentrated salt water but swells when placed in distilled water. A red blood cell bursts in distilled water but shrinks in concentrated saline. Both involve a membrane and water movement. What single principle, stated in one sentence, explains all four observations?',
    options: [
      'Salt reacts with cell membranes, causing shrinkage in salt water and swelling in pure water',
      'Water moves spontaneously across a semipermeable membrane from a region of lower solute concentration (higher water concentration) to higher solute concentration (lower water concentration) — osmosis driven by the concentration gradient',
      'Cells and cucumbers absorb salt water but reject pure water due to ion selectivity',
      'Pressure differences across the membrane cause water to move toward the higher pressure side',
    ],
    correct_index: 1,
    reveal: 'Osmosis: water moves from lower concentration of solute (higher "water activity") to higher concentration of solute. In distilled water — no solutes — water enters cells freely (hypotonic solution) causing swelling and eventually bursting. In concentrated saline — very high solute — water exits cells (hypertonic solution) causing shrivelling. The cucumber and red blood cell behave identically because both have semipermeable membranes separating two solutions of different concentrations.',
    difficulty_level: 2,
  },
  { id: uuidv4(), type: 'callout', variant: 'fun_fact', order: 1,
    title: 'Real Life Hook',
    markdown: 'Singapore, Israel, and the Gulf states quench their thirst using **reverse osmosis** — forcing sea water through membranes at high pressure (60–80 bar) to push water against its natural osmotic flow. The membranes remove 99.99% of dissolved salts. A single large RO plant in Dubai produces 140 million litres of drinking water per day. The same physics that makes a raisin swell in water makes desalination possible — just running the process in reverse by applying enough pressure to overcome the osmotic gradient.',
  },
  { id: uuidv4(), type: 'heading', order: 2, text: 'Osmosis and Semipermeable Membranes', level: 2 },
  { id: uuidv4(), type: 'text', order: 3,
    markdown: '**Osmosis** is the spontaneous net flow of solvent molecules through a **semipermeable membrane** (SPM) from the region of lower solute concentration to the region of higher solute concentration.\n\nA **semipermeable membrane** allows solvent molecules to pass through but blocks solute molecules/ions. Examples: cellophane, pig bladder, biological cell membranes.\n\n**Osmotic pressure ($\\pi$)** is the external pressure that must be applied to the solution side to just stop net osmotic flow.',
  },
  { id: uuidv4(), type: 'heading', order: 4, text: "Van't Hoff Equation for Osmotic Pressure", level: 2 },
  { id: uuidv4(), type: 'text', order: 5,
    markdown: "For dilute solutions:\n$$\\pi = MRT$$\n\nwhere:\n- $\\pi$ = osmotic pressure (in Pa or bar)\n- $M$ = **molarity** of the solution (mol/L) — note: osmotic pressure uses molarity, not molality\n- $R$ = gas constant = 0.0831 L·bar/(mol·K)\n- $T$ = temperature in Kelvin\n\n**This equation is analogous to the ideal gas law** ($pV = nRT$), with $M = n/V$.\n\n**Concentration types relative to the cell:**\n- **Isotonic** ($\\pi_{\\text{solution}} = \\pi_{\\text{cell}}$) → no net osmotic flow → cells maintain shape\n- **Hypotonic** ($\\pi_{\\text{solution}} < \\pi_{\\text{cell}}$) → water enters cell → cell swells/bursts\n- **Hypertonic** ($\\pi_{\\text{solution}} > \\pi_{\\text{cell}}$) → water leaves cell → cell shrinks (crenation)",
  },
  { id: uuidv4(), type: 'image', order: 6,
    src: '', alt: 'Osmosis diagram showing water movement through semipermeable membrane from dilute to concentrated solution',
    caption: '📸 Osmosis: water flows from the dilute side (left) to the concentrated side (right) until osmotic pressure π is reached',
    width: 'full',
    generation_prompt: 'Osmosis apparatus diagram. A U-tube or glass vessel divided by a semipermeable membrane (shown as a mesh/grid in the middle). Left side labelled "Pure water / dilute solution" with fewer orange dots (solute particles). Right side labelled "Concentrated solution" with many orange dots. Arrows showing water molecules (small blue dots) moving predominantly left to right through the membrane. Right side liquid level is higher than left, showing pressure buildup. Label the height difference as "π = osmotic pressure". Inset diagram showing (A) cell in hypotonic solution — swollen, (B) normal isotonic cell, (C) cell in hypertonic solution — crenated/shrunken. Dark background, orange accent labels, clean technical illustration style.',
  },
  { id: uuidv4(), type: 'worked_example', order: 7,
    label: 'NCERT 2.12', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: '200 cm³ of an aqueous solution of a protein contains 1.26 g of the protein. The osmotic pressure at 300 K is found to be $2.57 \\times 10^{-3}$ bar. Calculate the molar mass of the protein. ($R = 0.0831$ L·bar·mol⁻¹·K⁻¹)',
    solution: '**Step 1 — From π = MRT, find M:**\n$$M = \\frac{\\pi}{RT} = \\frac{2.57 \\times 10^{-3}}{0.0831 \\times 300} = \\frac{2.57 \\times 10^{-3}}{24.93} = 1.031 \\times 10^{-4} \\text{ mol/L}$$\n\n**Step 2 — Moles in 200 cm³ = 0.200 L:**\n$$n = 1.031 \\times 10^{-4} \\times 0.200 = 2.062 \\times 10^{-5} \\text{ mol}$$\n\n**Step 3 — Molar mass:**\n$$M_{\\text{protein}} = \\frac{1.26}{2.062 \\times 10^{-5}} = 61,100 \\text{ g/mol} \\approx 61.1 \\text{ kg/mol}$$\n\n**Answer:** Molar mass ≈ **61,100 g/mol**',
  },
  { id: uuidv4(), type: 'callout', variant: 'exam_tip', order: 8,
    title: 'JEE / NEET Exam Insight',
    markdown: '**Osmotic pressure vs other colligative properties for large molecules:** $\\pi$ is most sensitive for large molecules (proteins, polymers). A 1 g/L protein solution has undetectable $\\Delta T_f$ but measurable $\\pi$. This is why osmometry is used for molar mass of macromolecules.\n\n**Reverse osmosis:** Apply pressure > $\\pi$ to concentrated side → water flows backward → desalination.\n\n**Medical importance:** IV saline is 0.9% NaCl (isotonic — same osmotic pressure as blood plasma ≈ 7.91 bar). 5% glucose is also approximately isotonic. Using pure water in an IV would lyse red blood cells.\n\n**Units trap:** In $\\pi = MRT$, R = 0.0831 L·bar·mol⁻¹·K⁻¹ when $\\pi$ is in bar and M in mol/L.',
  },
  { id: uuidv4(), type: 'inline_quiz', order: 9, pass_threshold: 0.67,
    questions: [
      { id: uuidv4(), question: 'In osmosis, the net flow of solvent occurs from:', options: ['Higher solute concentration to lower solute concentration', 'Lower solute concentration to higher solute concentration', 'Higher pressure side to lower pressure side', 'The side at higher temperature to lower temperature'], correct_index: 1, explanation: 'Water (solvent) moves from the side with lower solute concentration (higher water "activity" or water potential) to the side with higher solute concentration. This is osmosis — always toward the more concentrated solution, through the semipermeable membrane.' },
      { id: uuidv4(), question: 'A red blood cell placed in 10% NaCl solution will:', options: ['Swell and eventually burst (haemolysis)', 'Remain unchanged — NaCl is isotonic', 'Shrink and crinkle (crenation) as water leaves the cell by osmosis toward the hypertonic surrounding solution', 'Absorb NaCl until the concentrations equalise'], correct_index: 2, explanation: '10% NaCl is hypertonic relative to blood cells (which are isotonic with ~0.9% NaCl). A hypertonic external solution has higher osmotic pressure — water flows out of the cell through the membrane, causing the cell to shrink and become crenated. Haemolysis occurs in hypotonic solutions (too dilute — water enters).' },
      { id: uuidv4(), question: 'The osmotic pressure of blood is 7.91 bar at 37°C (310 K). Estimate the effective molarity of dissolved particles in blood. (R = 0.0831 L·bar/mol·K)', options: ['0.31 M', '0.21 M', '7.91 M', '0.0831 M'], correct_index: 0, explanation: 'M = π/(RT) = 7.91/(0.0831 × 310) = 7.91/25.76 = 0.307 ≈ 0.31 mol/L. This is the effective total particle molarity accounting for all dissolved species in blood (plasma proteins, glucose, electrolytes, etc.). Normal saline (0.9% NaCl) gives an effective molarity of ~(0.9/58.5) × 2 × 10 ≈ 0.31 mol/L — which is why it is isotonic with blood.' },
    ],
  },
]),

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 13 — Van't Hoff Factor and Abnormal Molar Mass
// ═══════════════════════════════════════════════════════════════════════════════
page(13, "Van't Hoff Factor",
  'Electrolyte dissociation, association, abnormal molar masses, and modified colligative equations',
  'vant-hoff-factor',
[
  { id: uuidv4(), type: 'reasoning_prompt', order: 0,
    reasoning_type: 'quantitative',
    prompt: '0.1 molal NaCl in water shows a freezing point depression of 0.348°C. But if you calculate using ΔTf = Kf × m = 1.86 × 0.1 = 0.186°C, you get a very different answer. The observed ΔTf is almost exactly double the predicted value. What does this tell you about NaCl in water — without needing to know any chemistry?',
    options: [
      'The Kf value for water must be wrong — the actual value is 3.48',
      'NaCl must be producing almost twice as many dissolved particles as formula units suggest — it is splitting into two particles per formula unit (Na⁺ and Cl⁻) in water',
      'The molality was incorrectly calculated — it should be 0.2 molal',
      'Freezing point depression does not follow a simple equation for salt solutions',
    ],
    correct_index: 1,
    reveal: 'The ratio of observed to expected: 0.348/0.186 = 1.87. This is the van\'t Hoff factor i. It tells us that 1 formula unit of NaCl produces ~1.87 particles in 0.1 molal solution (not exactly 2 because of ion pairing — some Na⁺ and Cl⁻ stay briefly associated). Strong electrolytes dissociate into multiple ions, multiplying the colligative effect. This was van\'t Hoff\'s brilliant insight: he introduced i as a correction factor when colligative properties are "abnormal" — larger or smaller than expected.',
    difficulty_level: 3,
  },
  { id: uuidv4(), type: 'callout', variant: 'fun_fact', order: 1,
    title: 'Real Life Hook',
    markdown: 'In 1884, Jacobus van\'t Hoff noticed something strange: colligative properties of salt solutions were always much larger than calculated, while acetic acid in benzene was always smaller. He introduced the factor $i$ to account for this. It was chemistry\'s first glimpse of the reality of ions in solution — before Arrhenius\'s ionic theory was published. Van\'t Hoff factor $i$ was the experimental proof of ionic dissociation, years before anyone had directly observed ions. The numbers in solutions were telling the truth about molecular structure.',
  },
  { id: uuidv4(), type: 'heading', order: 2, text: "Van't Hoff Factor (i)", level: 2 },
  { id: uuidv4(), type: 'text', order: 3,
    markdown: "The **van't Hoff factor $i$** accounts for the actual number of particles produced per formula unit of solute:\n\n$$i = \\frac{\\text{observed colligative property}}{\\text{calculated colligative property (for non-electrolyte)}}$$\n\nOr equivalently:\n$$i = \\frac{\\text{actual moles of particles in solution}}{\\text{moles of formula units dissolved}}$$\n\n**Three cases:**\n- $i = 1$: Non-electrolyte, no dissociation (glucose, urea, sugar)\n- $i > 1$: Electrolyte that dissociates (NaCl $\\to$ 2 ions, CaCl₂ $\\to$ 3 ions, AlCl₃ $\\to$ 4 ions)\n- $i < 1$: Association in solution (acetic acid in benzene dimerises: $2\\ce{CH3COOH} \\to (\\ce{CH3COOH})_2$)",
  },
  { id: uuidv4(), type: 'heading', order: 4, text: 'Modified Colligative Property Equations', level: 2 },
  { id: uuidv4(), type: 'text', order: 5,
    markdown: 'All four colligative property equations are modified by inserting $i$:\n\n$$\\text{RLVP: } \\frac{p^\\circ - p_s}{p^\\circ} = i \\cdot x_2$$\n\n$$\\Delta T_b = i \\cdot K_b \\cdot m$$\n\n$$\\Delta T_f = i \\cdot K_f \\cdot m$$\n\n$$\\pi = i \\cdot M \\cdot R \\cdot T$$\n\n**Abnormal molar mass:** When colligative properties are measured experimentally and molar mass calculated assuming $i = 1$, the result is the **apparent (abnormal) molar mass** — lower than true for electrolytes (more particles), higher than true for associating solutes.',
  },
  { id: uuidv4(), type: 'text', order: 6,
    markdown: '**Degree of dissociation ($\\alpha$) and van\'t Hoff factor:**\n\nFor an electrolyte $\\ce{AB} \\to \\ce{A+} + \\ce{B-}$ (splits into $n$ ions):\n$$i = 1 + (n-1)\\alpha$$\n\nwhere $\\alpha$ = degree of dissociation (fraction dissociated), $n$ = number of ions formed.\n\nFor association (dimerisation: $2A \\to A_2$):\n$$i = 1 - \\frac{\\alpha}{2}$$\n\nThese allow you to calculate the degree of dissociation from experimental colligative property data.',
  },
  { id: uuidv4(), type: 'worked_example', order: 7,
    label: 'NCERT 2.13', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: '2 g of benzoic acid ($\\ce{C6H5COOH}$, $M = 122$ g/mol) dissolved in 25 g of benzene shows a depression in freezing point equal to 1.62 K. The molar enthalpy of fusion of benzene is 10.0 kJ/mol at its freezing point. Calculate the van\'t Hoff factor and explain the result. ($K_f$ for benzene = 5.12 K·kg/mol)',
    solution: '**Step 1 — Expected ΔTf (if i = 1):**\n$$m = \\frac{2 \\times 1000}{122 \\times 25} = 0.656 \\text{ mol/kg}$$\n$$\\Delta T_{f,\\text{calculated}} = 5.12 \\times 0.656 = 3.36 \\text{ K}$$\n\n**Step 2 — Van\'t Hoff factor:**\n$$i = \\frac{\\Delta T_{f,\\text{observed}}}{\\Delta T_{f,\\text{calculated}}} = \\frac{1.62}{3.36} = 0.48 \\approx 0.5$$\n\n**Step 3 — Interpretation:**\n$i = 0.5 < 1$ means association. Benzoic acid **dimerises** in benzene via hydrogen bonding between the carboxyl groups:\n$$\\ce{2 C6H5COOH <=> (C6H5COOH)2}$$\n\nTwo formula units associate into one dimer, halving the number of particles. $i = 0.5$ confirms near-complete dimerisation in benzene.\n\n**Answer:** $i \\approx 0.5$ — benzoic acid is almost completely dimerised in benzene.',
  },
  { id: uuidv4(), type: 'worked_example', order: 8,
    label: 'NCERT 2.14', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: '0.6 mL of acetic acid ($\\rho = 1.06$ g/mL) is dissolved in 1 litre of water. The depression in freezing point observed is 0.0205°C. Calculate the van\'t Hoff factor and degree of dissociation. ($K_f = 1.86$, $M_{\\text{acetic acid}} = 60$ g/mol)',
    solution: '**Step 1 — Mass of acetic acid:**\n$w = 0.6 \\times 1.06 = 0.636$ g\n\n**Step 2 — Molality:**\n$$m = \\frac{0.636 \\times 1000}{60 \\times 1000} = 0.0106 \\text{ mol/kg}$$\n\n**Step 3 — Van\'t Hoff factor:**\n$$i = \\frac{\\Delta T_f}{K_f \\times m} = \\frac{0.0205}{1.86 \\times 0.0106} = \\frac{0.0205}{0.0197} = 1.04$$\n\n**Step 4 — Degree of dissociation ($\\alpha$):**\n$$\\ce{CH3COOH <=> CH3COO- + H+} \\quad (n = 2)$$\n$$i = 1 + (n - 1)\\alpha = 1 + \\alpha$$\n$$\\alpha = i - 1 = 1.04 - 1 = 0.04 = 4\\%$$\n\n**Answer:** $i = 1.04$, degree of dissociation $\\alpha = 4\\%$ — acetic acid is a weak electrolyte, only 4% dissociated.',
  },
  { id: uuidv4(), type: 'comparison_card', order: 9,
    title: 'Dissociation (i > 1) vs Association (i < 1)',
    columns: [
      { heading: 'Dissociation (Electrolytes)', points: ['i > 1', 'More particles than formula units', 'Colligative effect larger than predicted', 'Apparent molar mass < true molar mass', 'Examples: NaCl (i≈2), CaCl₂ (i≈3), AlCl₃ (i≈4)', 'α = (i−1)/(n−1)'] },
      { heading: 'Association (Non-polar solvents)', points: ['i < 1', 'Fewer particles than formula units (dimers)', 'Colligative effect smaller than predicted', 'Apparent molar mass > true molar mass', 'Example: acetic acid in benzene (i≈0.5)', 'α = 2(1−i) for dimerisation'] },
    ],
  },
  { id: uuidv4(), type: 'callout', variant: 'exam_tip', order: 10,
    title: 'JEE / NEET Exam Insight',
    markdown: "**Abnormal molar mass summary:**\n- Electrolytes in water → apparent $M$ < true $M$ (measured colligative property too large → overestimates solute particles → underestimates $M$)\n- Acetic acid in benzene → apparent $M$ > true $M$ (measured colligative property too small → underestimates solute particles → overestimates $M$)\n\n**Degree of dissociation formula:** $i = 1 + (n-1)\\alpha$ (dissociation). **Rearranged:** $\\alpha = \\frac{i-1}{n-1}$\n\n**JEE pattern:** 'Calculate the degree of dissociation from observed ΔTf' — always use $i = \\text{observed}/\\text{expected}$ first, then the $\\alpha$ formula.",
  },
  { id: uuidv4(), type: 'inline_quiz', order: 11, pass_threshold: 0.67,
    questions: [
      { id: uuidv4(), question: "The van't Hoff factor (i) for a 0.1 m solution of K₂SO₄ (which dissociates into 3 ions: 2K⁺ + SO₄²⁻) is approximately:", options: ['1', '2', '2.7 (accounting for some ion pairing at 0.1 m)', '3'], correct_index: 2, explanation: 'In theory, complete dissociation gives i = 3. However, at 0.1 m, K₂SO₄ shows moderate ion pairing — K⁺ and SO₄²⁻ briefly associate. The experimentally measured i is approximately 2.7, not exactly 3. i = 3 would only apply at infinite dilution. This is why exam questions for dilute solutions of strong electrolytes accept both 3 (theoretical) and slightly lower values (experimental).' },
      { id: uuidv4(), question: "Acetic acid (M = 60 g/mol) dissolved in benzene gives an apparent molar mass of 120 g/mol from freezing point depression. What is the van't Hoff factor, and what does this tell you about acetic acid in benzene?", options: ['i = 2 — two acetic acid molecules are produced per formula unit (dissociation)', 'i = 0.5 — two acetic acid molecules associate into one dimer via hydrogen bonding, halving the number of particles', 'i = 1 — acetic acid does not change in benzene', 'i = 0.5 — half the acetic acid decomposes into CO₂ and CH₄ in benzene'], correct_index: 1, explanation: 'i = true M / apparent M = 60/120 = 0.5. Since i < 1, particles are fewer than formula units — association (not dissociation). Two acetic acid molecules hydrogen-bond to each other through their COOH groups, forming a cyclic dimer: (CH₃COOH)₂. This dimer has M = 120, consistent with the observation. Benzene (non-polar) cannot disrupt these H-bonds, so dimerisation is essentially complete.' },
      { id: uuidv4(), question: "A 0.1 m solution of a weak acid HA in water has a freezing point of −0.2046°C. Given Kf = 1.86 K·kg/mol, calculate the degree of dissociation of the acid.", options: ['5%', '10%', '15%', '20%'], correct_index: 1, explanation: 'ΔTf = 0.2046°C. Expected ΔTf (if no dissociation) = 1.86 × 0.1 = 0.186°C. i = 0.2046/0.186 = 1.10. HA ⇌ H⁺ + A⁻ gives n = 2. α = (i − 1)/(n − 1) = (1.10 − 1)/(2 − 1) = 0.10 = 10%. The acid is 10% dissociated. This is a typical weak acid degree of dissociation — acetic acid in water is ~1.3% dissociated at 0.1 m, stronger weak acids like HF are ~8–12%.' },
    ],
  },
]),

]; // end PAGES

async function run() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  const col = db.collection('book_pages');

  console.log('=== Class 12 Solutions — Pages 7–13 ===\n');
  for (const pg of PAGES) {
    const exists = await col.findOne({ book_id: BOOK_ID, chapter_number: CHAPTER, page_number: pg.page_number });
    if (exists) {
      console.log(`p${pg.page_number} "${pg.title}": already exists — skipping`);
      continue;
    }
    await col.insertOne(pg);
    console.log(`p${pg.page_number} "${pg.title}": ✓ inserted`);
  }
  await client.close();
  console.log('\nPart 2 done.');
}
run().catch(err => { console.error(err); process.exit(1); });
