// JEE Main 2025 Jan 24 Morning — Batch 5: Q71–Q75 (Numerical)
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const EXAM_SOURCE = { exam: 'JEE Main', year: 2025, month: 'Jan', day: 24, shift: 'Morning' };

const questions = [
  {
    _id: uuidv4(), display_id: 'CK-146',
    question_text: { markdown: `$37.8\\,\\text{g}$ of $\\text{N}_2\\text{O}_5$ was taken in a 1 L reaction vessel and allowed to undergo the following reaction at 500 K:\n\n$$2\\text{N}_2\\text{O}_{5(g)} \\rightleftharpoons 2\\text{N}_2\\text{O}_{4(g)} + \\text{O}_{2(g)}$$\n\nThe total pressure at equilibrium was found to be 18.65 bar.\n\nThen, $K_p = \\underline{\\hspace{1cm}} \\times 10^{-2}$ (nearest integer)\n\nAssume $\\text{N}_2\\text{O}_5$ to behave ideally under these conditions.\n\nGiven: $R = 0.082\\,\\text{bar L mol}^{-1}\\text{K}^{-1}$`, latex_validated: true },
    type: 'NVT',
    options: [],
    answer: { correct_option: null, numerical_value: 962, explanation: 'Initial P(N2O5) = (37.8/108)×0.082×500 = 14.35 bar. At eq: 2P decrease in N2O5 → 2P N2O4 + P O2. Total = 14.35 - 2P + 2P + P = 14.35 + P = 18.65 → P = 4.3. P(N2O5)=5.75, P(N2O4)=8.6, P(O2)=4.3. Kp = (8.6)^2×4.3/(5.75)^2 = 9.619 ≈ 962×10^-2.' },
    solution: { text_markdown: `**Step 1 — Initial pressure of N₂O₅:**\n\n$$n = \\frac{37.8}{108} = 0.35\\,\\text{mol}$$\n\n$$P_0 = \\frac{nRT}{V} = \\frac{0.35 \\times 0.082 \\times 500}{1} = 14.35\\,\\text{bar}$$\n\n**Step 2 — ICE table (pressure):**\n\n$$2\\text{N}_2\\text{O}_5 \\rightleftharpoons 2\\text{N}_2\\text{O}_4 + \\text{O}_2$$\n\n| | $\\text{N}_2\\text{O}_5$ | $\\text{N}_2\\text{O}_4$ | $\\text{O}_2$ |\n|---|---|---|---|\n| $t=0$ | 14.35 | 0 | 0 |\n| $t_{eq}$ | $14.35-2P$ | $2P$ | $P$ |\n\n**Step 3 — Total pressure:**\n\n$$P_{\\text{total}} = 14.35 - 2P + 2P + P = 14.35 + P = 18.65$$\n$$P = 4.3\\,\\text{bar}$$\n\n**Step 4 — Equilibrium pressures:**\n\n- $P_{\\text{N}_2\\text{O}_5} = 14.35 - 2(4.3) = 5.75\\,\\text{bar}$\n- $P_{\\text{N}_2\\text{O}_4} = 2(4.3) = 8.6\\,\\text{bar}$\n- $P_{\\text{O}_2} = 4.3\\,\\text{bar}$\n\n**Step 5 — Calculate $K_p$:**\n\n$$K_p = \\frac{(P_{\\text{N}_2\\text{O}_4})^2 \\cdot P_{\\text{O}_2}}{(P_{\\text{N}_2\\text{O}_5})^2} = \\frac{(8.6)^2 \\times 4.3}{(5.75)^2}$$\n\n$$= \\frac{73.96 \\times 4.3}{33.0625} = \\frac{318.028}{33.0625} \\approx 9.619$$\n\n$$K_p = 9.619 \\approx 962 \\times 10^{-2}$$\n\n$$\\boxed{x = 962}$$`, latex_validated: true },
    metadata: { difficulty: 'Hard', chapter_id: 'ch12_chem_kinetics', tags: [{ tag_id: 'tag_ck_3', weight: 1.0 }], is_pyq: true, is_top_pyq: true, exam_source: EXAM_SOURCE },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null
  },
  {
    _id: uuidv4(), display_id: 'THERMO-155',
    question_text: { markdown: `Standard entropies of $\\text{X}_2$, $\\text{Y}_2$ and $\\text{XY}_5$ are 70, 50 and 110 J K⁻¹ mol⁻¹ respectively. The temperature in Kelvin at which the reaction:\n\n$$\\frac{1}{2}\\text{X}_2 + \\frac{5}{2}\\text{Y}_2 \\rightarrow \\text{XY}_5 \\quad \\Delta H^\\circ = -35\\,\\text{kJ mol}^{-1}$$\n\nwill be at equilibrium is _____ (Nearest integer)`, latex_validated: true },
    type: 'NVT',
    options: [],
    answer: { correct_option: null, numerical_value: 700, explanation: 'ΔS°rxn = S°(XY5) - [½S°(X2) + 5/2·S°(Y2)] = 110 - [35 + 125] = 110 - 160 = -50 J/K/mol. At equilibrium ΔG°=0: ΔH° = TΔS°. T = ΔH°/ΔS° = -35000/(-50) = 700 K.' },
    solution: { text_markdown: `**Step 1 — Calculate $\\Delta S^\\circ_{\\text{rxn}}$:**\n\n$$\\Delta S^\\circ_{\\text{rxn}} = S^\\circ(\\text{XY}_5) - \\left[\\frac{1}{2}S^\\circ(\\text{X}_2) + \\frac{5}{2}S^\\circ(\\text{Y}_2)\\right]$$\n\n$$= 110 - \\left[\\frac{1}{2}(70) + \\frac{5}{2}(50)\\right]$$\n\n$$= 110 - [35 + 125] = 110 - 160 = -50\\,\\text{J K}^{-1}\\text{mol}^{-1}$$\n\n**Step 2 — Equilibrium condition ($\\Delta G^\\circ = 0$):**\n\n$$\\Delta G^\\circ = \\Delta H^\\circ - T\\Delta S^\\circ = 0$$\n\n$$T = \\frac{\\Delta H^\\circ}{\\Delta S^\\circ} = \\frac{-35000\\,\\text{J mol}^{-1}}{-50\\,\\text{J K}^{-1}\\text{mol}^{-1}}$$\n\n$$\\boxed{T = 700\\,\\text{K}}$$`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_thermo', tags: [{ tag_id: 'tag_thermo_5', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: EXAM_SOURCE },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null
  },
  {
    _id: uuidv4(), display_id: 'ACID-001',
    question_text: { markdown: `$X\\,\\text{g}$ of benzoic acid on reaction with aq. $\\text{NaHCO}_3$ releases $\\text{CO}_2$ that occupied $11.2\\,\\text{L}$ volume at STP.\n\n$X$ is _____ g.`, latex_validated: true },
    type: 'NVT',
    options: [],
    answer: { correct_option: null, numerical_value: 61, explanation: 'C6H5COOH + NaHCO3 → C6H5COONa + H2O + CO2. Moles of CO2 = 11.2/22.4 = 0.5 mol. Moles of benzoic acid = 0.5 mol. Mass = 0.5 × 122 = 61 g.' },
    solution: { text_markdown: `**Reaction:**\n\n$$\\text{C}_6\\text{H}_5\\text{COOH} + \\text{NaHCO}_3 \\rightarrow \\text{C}_6\\text{H}_5\\text{COONa} + \\text{H}_2\\text{O} + \\text{CO}_2$$\n\n**Moles of CO₂:**\n\n$$n_{\\text{CO}_2} = \\frac{11.2\\,\\text{L}}{22.4\\,\\text{L mol}^{-1}} = 0.5\\,\\text{mol}$$\n\n**Stoichiometry:** 1 mol benzoic acid → 1 mol CO₂\n\n$$n_{\\text{benzoic acid}} = 0.5\\,\\text{mol}$$\n\n**Mass:**\n\n$$X = 0.5 \\times 122 = \\boxed{61\\,\\text{g}}$$\n\n(Molar mass of benzoic acid $\\text{C}_6\\text{H}_5\\text{COOH} = 122\\,\\text{g mol}^{-1}$)`, latex_validated: true },
    metadata: { difficulty: 'Easy', chapter_id: 'ch12_carboxylic_acid', tags: [{ tag_id: 'tag_acid_1', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: EXAM_SOURCE },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null
  },
  {
    _id: uuidv4(), display_id: 'DBLOCK-003',
    question_text: { markdown: `Among the following cations, the number of cations which will give characteristic precipitate in their identification tests with $\\text{K}_4[\\text{Fe(CN)}_6]$ is:\n\n$\\text{Cu}^{2+},\\; \\text{Fe}^{3+},\\; \\text{Ba}^{2+},\\; \\text{Ca}^{2+},\\; \\text{NH}_4^+,\\; \\text{Mg}^{2+},\\; \\text{Zn}^{2+}$`, latex_validated: true },
    type: 'NVT',
    options: [],
    answer: { correct_option: null, numerical_value: 4, explanation: 'K4[Fe(CN)6] (potassium ferrocyanide) gives characteristic precipitates with: Cu2+ (chocolate brown Cu2[Fe(CN)6]), Fe3+ (deep blue/prussian blue KFe[Fe(CN)6]), Zn2+ (white/pale yellow Zn2[Fe(CN)6]), and also with Ba2+ (white Ba2[Fe(CN)6]). NTA answer = 4. Ca2+, NH4+, Mg2+ do not give characteristic precipitates.' },
    solution: { text_markdown: `**$\\text{K}_4[\\text{Fe(CN)}_6]$ (Potassium ferrocyanide) reactions:**\n\n| Cation | Precipitate | Colour |\n|---|---|---|\n| $\\text{Cu}^{2+}$ | $\\text{Cu}_2[\\text{Fe(CN)}_6]$ | Chocolate brown ✓ |\n| $\\text{Fe}^{3+}$ | $\\text{KFe}[\\text{Fe(CN)}_6]$ (Prussian blue) | Deep blue ✓ |\n| $\\text{Zn}^{2+}$ | $\\text{Zn}_2[\\text{Fe(CN)}_6]$ | White/pale yellow ✓ |\n| $\\text{Ba}^{2+}$ | $\\text{Ba}_2[\\text{Fe(CN)}_6]$ | White ✓ |\n| $\\text{Ca}^{2+}$ | No characteristic precipitate | — |\n| $\\text{NH}_4^+$ | No precipitate | — |\n| $\\text{Mg}^{2+}$ | No precipitate | — |\n\n**Number of cations giving characteristic precipitate = 4**\n\n$$\\boxed{4}$$\n\n*(NTA official answer: 4)*`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch12_dblock', tags: [{ tag_id: 'tag_dblock_4', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: EXAM_SOURCE },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null
  },
  {
    _id: uuidv4(), display_id: 'MOLE-430',
    question_text: { markdown: `Consider the following reaction occurring in the blast furnace:\n\n$$\\text{Fe}_3\\text{O}_{4(s)} + 4\\text{CO}_{(g)} \\rightarrow 3\\text{Fe}_{(l)} + 4\\text{CO}_{2(g)}$$\n\n$x$ kg of iron is produced when $2.32 \\times 10^3$ kg of $\\text{Fe}_3\\text{O}_4$ and $2.8 \\times 10^2$ kg of CO are brought together in the furnace. The value of $x$ is _____ (nearest integer).\n\nGiven: Molar mass of $\\text{Fe}_3\\text{O}_4 = 232\\,\\text{g mol}^{-1}$, CO $= 28\\,\\text{g mol}^{-1}$, Fe $= 56\\,\\text{g mol}^{-1}$`, latex_validated: true },
    type: 'NVT',
    options: [],
    answer: { correct_option: null, numerical_value: 420, explanation: 'Moles Fe3O4 = 2.32×10^6/232 = 10^4 mol. Moles CO = 2.8×10^5/28 = 10^4 mol. Stoichiometry: 1 mol Fe3O4 needs 4 mol CO. Available CO = 10^4 mol → can react with 10^4/4 = 2500 mol Fe3O4. CO is limiting reagent. Fe produced = 3/4 × 10^4 = 7500 mol. Mass = 7500×56/1000 = 420 kg.' },
    solution: { text_markdown: `**Step 1 — Moles of each reactant:**\n\n$$n_{\\text{Fe}_3\\text{O}_4} = \\frac{2.32 \\times 10^3 \\times 10^3\\,\\text{g}}{232\\,\\text{g mol}^{-1}} = \\frac{2.32 \\times 10^6}{232} = 10^4\\,\\text{mol}$$\n\n$$n_{\\text{CO}} = \\frac{2.8 \\times 10^2 \\times 10^3\\,\\text{g}}{28\\,\\text{g mol}^{-1}} = \\frac{2.8 \\times 10^5}{28} = 10^4\\,\\text{mol}$$\n\n**Step 2 — Identify limiting reagent:**\n\nStoichiometry: $1\\,\\text{mol Fe}_3\\text{O}_4 : 4\\,\\text{mol CO}$\n\nFor $10^4$ mol Fe₃O₄, need $4 \\times 10^4$ mol CO.\nAvailable CO = $10^4$ mol → **CO is the limiting reagent**.\n\n**Step 3 — Moles of Fe produced:**\n\nFrom stoichiometry: $4\\,\\text{mol CO} \\rightarrow 3\\,\\text{mol Fe}$\n\n$$n_{\\text{Fe}} = \\frac{3}{4} \\times 10^4 = 7500\\,\\text{mol}$$\n\n**Step 4 — Mass of Fe:**\n\n$$m_{\\text{Fe}} = 7500 \\times 56\\,\\text{g} = 420000\\,\\text{g} = \\boxed{420\\,\\text{kg}}$$`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_mole', tags: [{ tag_id: 'tag_mole_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: EXAM_SOURCE },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null
  },
];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  let ok = 0, fail = 0;
  for (const q of questions) {
    try {
      await col.insertOne(q);
      console.log(`  OK  ${q.display_id}`);
      ok++;
    } catch (e) {
      console.log(`  FAIL ${q.display_id}: ${e.message}`);
      fail++;
    }
  }
  console.log(`\nBatch 5 done: ${ok} OK, ${fail} FAIL`);
  await mongoose.disconnect();
}

main().catch(console.error);
