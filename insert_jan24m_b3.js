// JEE Main 2025 Jan 24 Morning — Batch 3: Q61–Q65
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const EXAM_SOURCE = { exam: 'JEE Main', year: 2025, month: 'Jan', day: 24, shift: 'Morning' };

const questions = [
  {
    _id: uuidv4(), display_id: 'BIO-142',
    question_text: { markdown: `The carbohydrates "Ribose" present in DNA is:\n\nA. A pentose sugar\nB. present in pyranose form\nC. in "D" configuration\nD. a reducing sugar, when free\nE. in α-anomeric form\n\n(a) A, C and D Only \\quad (b) A, B and E Only \\quad (c) B, D and E Only \\quad (d) A, B and D Only`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: 'A, C and D Only', is_correct: true },
      { id: 'b', text: 'A, B and E Only', is_correct: false },
      { id: 'c', text: 'B, D and E Only', is_correct: false },
      { id: 'd', text: 'A, B and D Only', is_correct: false },
    ],
    answer: { correct_option: 'a', explanation: 'Ribose in DNA is actually deoxyribose (2-deoxy-D-ribose). A: pentose (5C) ✓. B: in DNA it is in furanose form (5-membered ring), NOT pyranose ✗. C: D-configuration ✓. D: free reducing sugar ✓. E: in DNA it is β-anomeric form, not α ✗. Correct: A, C, D.' },
    solution: { text_markdown: `**Note:** The ribose in DNA is actually **2-deoxy-D-ribose** (β-D-2-deoxyribose).\n\n**Evaluating each statement:**\n\n- **(A) Pentose sugar** — ✅ TRUE. Ribose/deoxyribose has 5 carbons.\n\n- **(B) Pyranose form** — ❌ FALSE. In DNA, deoxyribose exists in **furanose** form (5-membered ring), not pyranose (6-membered ring).\n\n- **(C) D-configuration** — ✅ TRUE. It is D-ribose (OH on right at C4 in Fischer projection).\n\n- **(D) Reducing sugar when free** — ✅ TRUE. Free deoxyribose has a free anomeric –OH → can reduce Fehling's/Tollens' reagent.\n\n- **(E) α-anomeric form** — ❌ FALSE. In DNA, the nucleoside bond is in **β-configuration** (N-glycosidic bond is β).\n\n**Correct: A, C and D → Answer: (a)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch12_biomolecules', tags: [{ tag_id: 'tag_bio_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: EXAM_SOURCE },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null
  },
  {
    _id: uuidv4(), display_id: 'DBLOCK-002',
    question_text: { markdown: `Preparation of potassium permanganate from $\\text{MnO}_2$ involves two step process in which the 1st step is a reaction with KOH and $\\text{KNO}_3$ to produce:\n\n(a) $\\text{K}_4[\\text{Mn(OH)}_6]$ \\quad (b) $\\text{K}_3\\text{MnO}_4$ \\quad (c) $\\text{KMnO}_4$ \\quad (d) $\\text{K}_2\\text{MnO}_4$`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '$\\text{K}_4[\\text{Mn(OH)}_6]$', is_correct: false },
      { id: 'b', text: '$\\text{K}_3\\text{MnO}_4$', is_correct: false },
      { id: 'c', text: '$\\text{KMnO}_4$', is_correct: false },
      { id: 'd', text: '$\\text{K}_2\\text{MnO}_4$', is_correct: true },
    ],
    answer: { correct_option: 'd', explanation: 'Step 1: MnO2 + KOH + KNO3 (oxidising agent) → K2MnO4 (potassium manganate, Mn in +6 state). Step 2: K2MnO4 is oxidised/disproportionated to KMnO4 (Mn in +7 state).' },
    solution: { text_markdown: `**Preparation of KMnO₄ from MnO₂ — two steps:**\n\n**Step 1 — Fusion with KOH and KNO₃:**\n\n$$\\text{MnO}_2 + 2\\text{KOH} + \\text{KNO}_3 \\xrightarrow{\\Delta} \\text{K}_2\\text{MnO}_4 + \\text{KNO}_2 + \\text{H}_2\\text{O}$$\n\n- MnO₂ (Mn = +4) is oxidised to K₂MnO₄ (Mn = +6)\n- KNO₃ acts as the oxidising agent\n- Product: **potassium manganate** $\\text{K}_2\\text{MnO}_4$ (green)\n\n**Step 2 — Oxidation/disproportionation:**\n\n$$3\\text{K}_2\\text{MnO}_4 + 2\\text{H}_2\\text{O} \\rightarrow 2\\text{KMnO}_4 + \\text{MnO}_2 + 4\\text{KOH}$$\n\nor electrolytic oxidation:\n$$\\text{K}_2\\text{MnO}_4 \\xrightarrow{\\text{oxidation}} \\text{KMnO}_4$$\n\n**Answer: (d) K₂MnO₄**`, latex_validated: true },
    metadata: { difficulty: 'Easy', chapter_id: 'ch12_dblock', tags: [{ tag_id: 'tag_dblock_3', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: EXAM_SOURCE },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null
  },
  {
    _id: uuidv4(), display_id: 'SBLOCK-001',
    question_text: { markdown: `The large difference between the melting and boiling points of oxygen and sulphur may be explained on the basis of:\n\n(a) Atomic size \\quad (b) Atomicity \\quad (c) Electronegativity \\quad (d) Electron gain enthalpy`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: 'Atomic size', is_correct: false },
      { id: 'b', text: 'Atomicity', is_correct: true },
      { id: 'c', text: 'Electronegativity', is_correct: false },
      { id: 'd', text: 'Electron gain enthalpy', is_correct: false },
    ],
    answer: { correct_option: 'b', explanation: 'Oxygen exists as O2 (atomicity = 2, diatomic). Sulphur exists as S8 (atomicity = 8, polyatomic ring). S8 has much stronger intermolecular van der Waals forces due to larger molecular size → much higher melting and boiling points than O2.' },
    solution: { text_markdown: `**Key concept — Atomicity:**\n\n- Oxygen: $\\text{O}_2$ (atomicity = 2, diatomic molecule)\n- Sulphur: $\\text{S}_8$ (atomicity = 8, crown-shaped ring)\n\n**Effect on melting/boiling points:**\n\nThe larger the molecule, the stronger the **van der Waals (London dispersion) forces**.\n\n$\\text{S}_8$ has a much larger molecular mass and surface area than $\\text{O}_2$:\n- $M(\\text{O}_2) = 32\\,\\text{g/mol}$\n- $M(\\text{S}_8) = 256\\,\\text{g/mol}$\n\nThis leads to significantly stronger intermolecular forces in sulphur → much higher melting point ($113°\\text{C}$) and boiling point ($445°\\text{C}$) compared to oxygen (mp = $-219°\\text{C}$, bp = $-183°\\text{C}$).\n\n**The large difference is due to atomicity (S₈ vs O₂).**\n\n**Answer: (b) Atomicity**`, latex_validated: true },
    metadata: { difficulty: 'Easy', chapter_id: 'ch12_pblock', tags: [{ tag_id: 'tag_sblock_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: EXAM_SOURCE },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null
  },
  {
    _id: uuidv4(), display_id: 'CK-145',
    question_text: { markdown: `For a reaction, $\\text{N}_2\\text{O}_{5(g)} \\rightarrow 2\\text{NO}_{2(g)} + \\dfrac{1}{2}\\text{O}_{2(g)}$ in a constant volume container, no products were present initially. The final pressure of the system when 50% of reaction gets completed is:\n\n(a) $7/2$ times of initial pressure\n(b) $5$ times of initial pressure\n(c) $5/2$ times of initial pressure\n(d) $7/4$ times of initial pressure`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '$7/2$ times of initial pressure', is_correct: false },
      { id: 'b', text: '$5$ times of initial pressure', is_correct: false },
      { id: 'c', text: '$5/2$ times of initial pressure', is_correct: false },
      { id: 'd', text: '$7/4$ times of initial pressure', is_correct: true },
    ],
    answer: { correct_option: 'd', explanation: 'At t=0: P0 (N2O5 only). At 50% completion: N2O5 = P0/2, NO2 = P0, O2 = P0/4. Total = P0/2 + P0 + P0/4 = 7P0/4.' },
    solution: { text_markdown: `**Reaction:** $\\text{N}_2\\text{O}_5 \\rightarrow 2\\text{NO}_2 + \\tfrac{1}{2}\\text{O}_2$\n\n**At constant volume, pressure is proportional to moles.**\n\nLet initial pressure of $\\text{N}_2\\text{O}_5 = P_0$.\n\n| Species | $t = 0$ | At 50% completion |\n|---|---|---|\n| $\\text{N}_2\\text{O}_5$ | $P_0$ | $P_0 - \\tfrac{P_0}{2} = \\tfrac{P_0}{2}$ |\n| $\\text{NO}_2$ | $0$ | $2 \\times \\tfrac{P_0}{2} = P_0$ |\n| $\\text{O}_2$ | $0$ | $\\tfrac{1}{2} \\times \\tfrac{P_0}{2} = \\tfrac{P_0}{4}$ |\n\n**Total pressure:**\n\n$$P_{\\text{total}} = \\frac{P_0}{2} + P_0 + \\frac{P_0}{4} = \\frac{2P_0 + 4P_0 + P_0}{4} = \\frac{7P_0}{4}$$\n\n$$\\boxed{P_{\\text{total}} = \\frac{7}{4} \\times P_0}$$\n\n**Answer: (d) 7/4 times of initial pressure**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch12_chem_kinetics', tags: [{ tag_id: 'tag_ck_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: EXAM_SOURCE },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null
  },
  {
    _id: uuidv4(), display_id: 'ALDE-001',
    question_text: { markdown: `Which of the following arrangements with respect to their reactivity in nucleophilic addition reaction is correct?\n\n(a) benzaldehyde $<$ acetophenone $<$ p-tolualdehyde $<$ p-nitrobenzaldehyde\n(b) acetophenone $<$ benzaldehyde $<$ p-tolualdehyde $<$ p-nitrobenzaldehyde\n(c) acetophenone $<$ p-tolualdehyde $<$ benzaldehyde $<$ p-nitrobenzaldehyde\n(d) p-nitrobenzaldehyde $<$ benzaldehyde $<$ p-tolualdehyde $<$ acetophenone`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: 'benzaldehyde $<$ acetophenone $<$ p-tolualdehyde $<$ p-nitrobenzaldehyde', is_correct: false },
      { id: 'b', text: 'acetophenone $<$ benzaldehyde $<$ p-tolualdehyde $<$ p-nitrobenzaldehyde', is_correct: false },
      { id: 'c', text: 'acetophenone $<$ p-tolualdehyde $<$ benzaldehyde $<$ p-nitrobenzaldehyde', is_correct: true },
      { id: 'd', text: 'p-nitrobenzaldehyde $<$ benzaldehyde $<$ p-tolualdehyde $<$ acetophenone', is_correct: false },
    ],
    answer: { correct_option: 'c', explanation: 'Nucleophilic addition increases with electrophilicity of carbonyl carbon. Electron-withdrawing groups increase reactivity; electron-donating groups decrease it. Ketones < aldehydes (steric + electronic). p-CH3 (EDG) decreases reactivity vs benzaldehyde. p-NO2 (EWG) increases reactivity most. Order: acetophenone < p-tolualdehyde < benzaldehyde < p-nitrobenzaldehyde.' },
    solution: { text_markdown: `**Nucleophilic addition reactivity** depends on the electrophilicity of the carbonyl carbon.\n\n**Factors:**\n1. **Steric effect:** More substituents on C=O → less accessible → less reactive\n2. **Electronic effect:** EWG increases electrophilicity (+reactivity); EDG decreases it\n\n**Ranking:**\n\n| Compound | Effect | Relative reactivity |\n|---|---|---|\n| Acetophenone | Ketone (2 groups on C=O) + Ph (–M) | Lowest |\n| p-Tolualdehyde | Aldehyde + p-CH₃ (EDG, +I) | Low |\n| Benzaldehyde | Aldehyde, no substituent | Medium |\n| p-Nitrobenzaldehyde | Aldehyde + p-NO₂ (EWG, –M) | Highest |\n\n**Order (increasing reactivity):**\n$$\\text{acetophenone} < \\text{p-tolualdehyde} < \\text{benzaldehyde} < \\text{p-nitrobenzaldehyde}$$\n\n**Answer: (c)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch12_aldehyde_ketone', tags: [{ tag_id: 'tag_alde_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: EXAM_SOURCE },
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
  console.log(`\nBatch 3 done: ${ok} OK, ${fail} FAIL`);
  await mongoose.disconnect();
}

main().catch(console.error);
