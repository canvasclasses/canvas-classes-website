// JEE Main 2025 Jan 24 Morning — Batch 2: Q56–Q60
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const EXAM_SOURCE = { exam: 'JEE Main', year: 2025, month: 'Jan', day: 24, shift: 'Morning' };

const questions = [
  {
    _id: uuidv4(), display_id: 'DBLOCK-001',
    question_text: { markdown: `Which of the following ions is the strongest oxidising agent?\n\n(Atomic Number of Ce = 58, Eu = 63, Tb = 65, Lu = 71)\n\n(a) $\\text{Lu}^{3+}$ \\quad (b) $\\text{Eu}^{2+}$ \\quad (c) $\\text{Tb}^{4+}$ \\quad (d) $\\text{Ce}^{3+}$`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '$\\text{Lu}^{3+}$', is_correct: false },
      { id: 'b', text: '$\\text{Eu}^{2+}$', is_correct: false },
      { id: 'c', text: '$\\text{Tb}^{4+}$', is_correct: true },
      { id: 'd', text: '$\\text{Ce}^{3+}$', is_correct: false },
    ],
    answer: { correct_option: 'c', explanation: 'Tb4+ is the strongest oxidising agent. Tb (Z=65) has configuration [Xe]4f9 in Tb3+. Tb4+ has [Xe]4f8 — it strongly tends to gain an electron to reach the stable half-filled 4f7 configuration of Tb3+. This strong tendency to accept electrons makes Tb4+ the strongest oxidising agent.' },
    solution: { text_markdown: `**Oxidising agent** = species that gains electrons (gets reduced).\n\nThe stronger the tendency to gain electrons, the stronger the oxidising agent.\n\n**Electronic configurations:**\n\n| Ion | Config | Tendency |\n|---|---|---|\n| $\\text{Lu}^{3+}$ | $[\\text{Xe}]4f^{14}$ | Stable, no tendency to gain e⁻ |\n| $\\text{Eu}^{2+}$ | $[\\text{Xe}]4f^7$ | Half-filled, stable — **reducing agent** |\n| $\\text{Ce}^{3+}$ | $[\\text{Xe}]4f^1$ | Stable +3 state |\n| **$\\text{Tb}^{4+}$** | $[\\text{Xe}]4f^7$ | Strongly wants to gain 1e⁻ to reach stable $4f^8 \\to$ wait: Tb³⁺ = $4f^8$, Tb⁴⁺ = $4f^7$ |\n\n**Tb⁴⁺** has $4f^7$ (half-filled) configuration and strongly tends to gain an electron to reach $\\text{Tb}^{3+}$ ($4f^8$). Actually, Tb⁴⁺ ($4f^7$) is highly oxidising because it wants to revert to the more stable Tb³⁺ state.\n\nAmong lanthanides, **Tb⁴⁺** is the strongest oxidising agent due to its tendency to accept electrons and attain a stable electronic configuration.\n\n**Answer: (c) Tb⁴⁺**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch12_dblock', tags: [{ tag_id: 'tag_dblock_5', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: EXAM_SOURCE },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null
  },
  {
    _id: uuidv4(), display_id: 'IEQ-086',
    question_text: { markdown: `$K_{sp}$ for $\\text{Cr(OH)}_3$ is $1.6 \\times 10^{-30}$. What is the molar solubility of this salt in water?\n\n(a) $\\sqrt[4]{\\dfrac{1.6 \\times 10^{-30}}{27}}$ \\quad (b) $\\dfrac{1.8 \\times 10^{-30}}{27}$ \\quad (c) $\\sqrt[5]{1.8 \\times 10^{-30}}$ \\quad (d) $\\sqrt[4]{1.6 \\times 10^{-30}}$`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '$\\sqrt[4]{\\dfrac{1.6 \\times 10^{-30}}{27}}$', is_correct: true },
      { id: 'b', text: '$\\dfrac{1.8 \\times 10^{-30}}{27}$', is_correct: false },
      { id: 'c', text: '$\\sqrt[5]{1.8 \\times 10^{-30}}$', is_correct: false },
      { id: 'd', text: '$\\sqrt[4]{1.6 \\times 10^{-30}}$', is_correct: false },
    ],
    answer: { correct_option: 'a', explanation: 'Cr(OH)3 → Cr3+ + 3OH-. If s = molar solubility: Ksp = s × (3s)^3 = 27s^4. So s = (Ksp/27)^(1/4) = (1.6×10^-30/27)^(1/4).' },
    solution: { text_markdown: `**Dissolution equilibrium:**\n\n$$\\text{Cr(OH)}_3 \\rightleftharpoons \\text{Cr}^{3+} + 3\\text{OH}^-$$\n\nLet molar solubility = $s$:\n- $[\\text{Cr}^{3+}] = s$\n- $[\\text{OH}^-] = 3s$\n\n**Expression for $K_{sp}$:**\n\n$$K_{sp} = [\\text{Cr}^{3+}][\\text{OH}^-]^3 = s \\cdot (3s)^3 = 27s^4$$\n\n**Solving for $s$:**\n\n$$s^4 = \\frac{K_{sp}}{27} = \\frac{1.6 \\times 10^{-30}}{27}$$\n\n$$s = \\sqrt[4]{\\frac{1.6 \\times 10^{-30}}{27}}$$\n\n**Answer: (a)**`, latex_validated: true },
    metadata: { difficulty: 'Easy', chapter_id: 'ch11_ionic_eq', tags: [{ tag_id: 'tag_ieq_5', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: EXAM_SOURCE },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null
  },
  {
    _id: uuidv4(), display_id: 'THERMO-154',
    question_text: { markdown: `Let us consider an endothermic reaction which is non-spontaneous at the freezing point of water. However, the reaction is spontaneous at boiling point of water. Choose the correct option.\n\n(a) Both $\\Delta H$ and $\\Delta S$ are $(+\\text{ve})$\n(b) $\\Delta H$ is $(-\\text{ve})$ but $\\Delta S$ is $(+\\text{ve})$\n(c) $\\Delta H$ is $(+\\text{ve})$ but $\\Delta S$ is $(-\\text{ve})$\n(d) Both $\\Delta H$ and $\\Delta S$ are $(-\\text{ve})$`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: 'Both $\\Delta H$ and $\\Delta S$ are $(+\\text{ve})$', is_correct: true },
      { id: 'b', text: '$\\Delta H$ is $(-\\text{ve})$ but $\\Delta S$ is $(+\\text{ve})$', is_correct: false },
      { id: 'c', text: '$\\Delta H$ is $(+\\text{ve})$ but $\\Delta S$ is $(-\\text{ve})$', is_correct: false },
      { id: 'd', text: 'Both $\\Delta H$ and $\\Delta S$ are $(-\\text{ve})$', is_correct: false },
    ],
    answer: { correct_option: 'a', explanation: 'Endothermic → ΔH > 0. Non-spontaneous at 273K but spontaneous at 373K: ΔG = ΔH - TΔS. At low T: ΔG > 0 (non-spontaneous); at high T: ΔG < 0 (spontaneous). This requires ΔS > 0 so that TΔS term dominates at high T. Both ΔH and ΔS are positive.' },
    solution: { text_markdown: `**Given:** Endothermic → $\\Delta H > 0$ (+ve)\n\n**Condition for spontaneity:** $\\Delta G = \\Delta H - T\\Delta S < 0$\n\n**At freezing point (273 K):** Non-spontaneous → $\\Delta G > 0$\n$$\\Delta H - 273\\Delta S > 0$$\n\n**At boiling point (373 K):** Spontaneous → $\\Delta G < 0$\n$$\\Delta H - 373\\Delta S < 0$$\n\n**Analysis:**\n\nFor $\\Delta G$ to change from positive (at 273 K) to negative (at 373 K) as temperature increases, we need $\\Delta S > 0$.\n\n- If $\\Delta S < 0$: $-T\\Delta S$ becomes more positive with increasing T → $\\Delta G$ becomes more positive → never spontaneous at higher T. ✗\n- If $\\Delta S > 0$: $-T\\Delta S$ becomes more negative with increasing T → $\\Delta G$ decreases → can become negative at high T. ✓\n\n**Both $\\Delta H > 0$ and $\\Delta S > 0$**\n\n**Answer: (a)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_thermo', tags: [{ tag_id: 'tag_thermo_5', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: EXAM_SOURCE },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null
  },
  {
    _id: uuidv4(), display_id: 'GOC-146',
    question_text: { markdown: `Given below are two statements I and II.\n\n**Statement I:** Dumas method is used for estimation of "Nitrogen" in an organic compound.\n\n**Statement II:** Dumas method involves the formation of ammonium sulphate by heating the organic compound with conc $\\text{H}_2\\text{SO}_4$.\n\nIn the light of the above statements, choose the correct answer:\n\n(a) Both Statement I and Statement II are true\n(b) Statement I is false but Statement II is true\n(c) Both Statement I and Statement II are false\n(d) Statement I is true but Statement II is false`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: 'Both Statement I and Statement II are true', is_correct: false },
      { id: 'b', text: 'Statement I is false but Statement II is true', is_correct: false },
      { id: 'c', text: 'Both Statement I and Statement II are false', is_correct: false },
      { id: 'd', text: 'Statement I is true but Statement II is false', is_correct: true },
    ],
    answer: { correct_option: 'd', explanation: 'Statement I: Dumas method IS used for estimation of nitrogen ✓. Statement II: Dumas method converts N to N2 gas (not ammonium sulphate). Ammonium sulphate formation is Kjeldahl method ✗.' },
    solution: { text_markdown: `**Statement I — Dumas method for nitrogen estimation:**\n\nDumas method IS used for the estimation of **nitrogen** in organic compounds.\n\n→ Statement I is **TRUE** ✓\n\n**Statement II — Mechanism of Dumas method:**\n\nIn Dumas method, the organic compound is heated with **CuO** (copper oxide) in a stream of CO₂. Nitrogen in the compound is converted to **N₂ gas**, which is collected over KOH solution.\n\n$$\\text{Organic compound} + \\text{CuO} \\xrightarrow{\\Delta} \\text{N}_2 + \\text{CO}_2 + \\text{H}_2\\text{O}$$\n\nThe formation of **ammonium sulphate** by heating with conc H₂SO₄ is the **Kjeldahl method**, NOT Dumas method.\n\n→ Statement II is **FALSE** ✗\n\n**Answer: (d) Statement I is true but Statement II is false**`, latex_validated: true },
    metadata: { difficulty: 'Easy', chapter_id: 'ch11_goc', tags: [{ tag_id: 'tag_goc_1', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: EXAM_SOURCE },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null
  },
  {
    _id: uuidv4(), display_id: 'ATOM-426',
    question_text: { markdown: `Which of the following Statements are NOT true about the periodic table?\n\nA. The properties of elements are function of atomic weights.\nB. The properties of elements are function of atomic numbers.\nC. Elements having similar outer electronic configuration are arranged in same period.\nD. An element's location reflects the quantum numbers of the last filled orbital.\nE. The number of elements in a period is same as the number of atomic orbitals available in energy level that is being filled.\n\n(a) A, C and E Only \\quad (b) D and E Only \\quad (c) A and E Only \\quad (d) B, C and E Only`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: 'A, C and E Only', is_correct: true },
      { id: 'b', text: 'D and E Only', is_correct: false },
      { id: 'c', text: 'A and E Only', is_correct: false },
      { id: 'd', text: 'B, C and E Only', is_correct: false },
    ],
    answer: { correct_option: 'a', explanation: 'A is false (properties are function of atomic NUMBER, not weight). C is false (similar outer electronic config → same GROUP, not period). E is false (number of elements in a period = 2×(number of orbitals in that energy level), not equal to number of orbitals). B and D are true.' },
    solution: { text_markdown: `**Evaluating each statement:**\n\n- **(A)** "Properties are function of atomic weights" — ❌ **FALSE**. Properties are periodic function of **atomic number** (Moseley's law).\n\n- **(B)** "Properties are function of atomic numbers" — ✅ **TRUE**.\n\n- **(C)** "Similar outer electronic configuration → same period" — ❌ **FALSE**. Elements with similar outer electronic configuration are in the same **group**, not period.\n\n- **(D)** "Element's location reflects quantum numbers of last filled orbital" — ✅ **TRUE**. Period = principal quantum number; block = type of orbital (s, p, d, f).\n\n- **(E)** "Number of elements in a period = number of atomic orbitals available in that energy level" — ❌ **FALSE**. Number of elements = **2 × number of orbitals** (each orbital holds 2 electrons). E.g., 2nd period: 4 orbitals (1s+2s+2p... wait — 2nd period fills 2s and 2p = 4 orbitals → 8 elements, not 4).\n\n**NOT true: A, C, and E → Answer: (a)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_atom', tags: [{ tag_id: 'tag_atom_1', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: EXAM_SOURCE },
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
  console.log(`\nBatch 2 done: ${ok} OK, ${fail} FAIL`);
  await mongoose.disconnect();
}

main().catch(console.error);
