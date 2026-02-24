// JEE Main 2025 Jan 24 Morning — Batch 4: Q66–Q70
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const EXAM_SOURCE = { exam: 'JEE Main', year: 2025, month: 'Jan', day: 24, shift: 'Morning' };

const questions = [
  {
    _id: uuidv4(), display_id: 'ALDE-002',
    question_text: { markdown: `Aman has been asked to synthesise the molecule cyclopent-2-en-1-yl methyl ketone (2-acetylcyclopent-2-en-1-one type). He thought of preparing the molecule using an aldol condensation reaction. He found a few cyclic alkenes in his laboratory. He thought of performing ozonolysis on alkene to produce a dicarbonyl compound followed by aldol reaction to prepare "x". Predict the suitable alkene that can lead to the formation of "x".\n\n(a) 1-methylcyclohex-1-ene\n(b) cyclohex-1-ene\n(c) methylenecyclohexane\n(d) 1-methylcyclopent-1-ene`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '1-methylcyclohex-1-ene', is_correct: true },
      { id: 'b', text: 'cyclohex-1-ene', is_correct: false },
      { id: 'c', text: 'methylenecyclohexane', is_correct: false },
      { id: 'd', text: '1-methylcyclopent-1-ene', is_correct: false },
    ],
    answer: { correct_option: 'a', explanation: 'Target x = cyclopentenyl methyl ketone. Ozonolysis of 1-methylcyclohex-1-ene gives a 7-carbon keto-aldehyde (6-oxoheptanal). Intramolecular aldol condensation of this dialdehyde/ketoaldehyde gives the 5-membered ring enone with methyl ketone substituent.' },
    solution: { text_markdown: `**Target molecule "x":** A cyclopentenone with a methyl ketone group (from the image: cyclopent-2-en-1-one with –C(=O)CH₃ at C1).\n\n**Strategy:** Ozonolysis of cyclic alkene → open-chain dicarbonyl → intramolecular aldol condensation → cyclic enone.\n\n**Working backwards:**\n\nThe target has a 5-membered ring → need a 7-carbon chain dicarbonyl after ozonolysis → need a 7-carbon cyclic alkene (cycloheptene) or a substituted 6-membered ring.\n\n**Option (a): 1-methylcyclohex-1-ene**\n\nOzonolysis of 1-methylcyclohex-1-ene:\n$$\\text{1-methylcyclohex-1-ene} \\xrightarrow{\\text{O}_3/\\text{Zn,H}_2\\text{O}/\\Delta} \\text{6-oxoheptanal}$$\n\nThe product is a 7-carbon keto-aldehyde: $\\text{CH}_3\\text{C(=O)(CH}_2)_4\\text{CHO}$\n\nIntramolecular aldol condensation:\n- Enolisation at the methyl ketone\n- Aldol addition to the aldehyde\n- Dehydration → 5-membered ring enone with –COCH₃ group\n\nThis gives the target molecule **x**.\n\n**Answer: (a) 1-methylcyclohex-1-ene**`, latex_validated: true },
    metadata: { difficulty: 'Hard', chapter_id: 'ch12_aldehyde_ketone', tags: [{ tag_id: 'tag_alde_4', weight: 1.0 }], is_pyq: true, is_top_pyq: true, exam_source: EXAM_SOURCE },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null
  },
  {
    _id: uuidv4(), display_id: 'SOL-158',
    question_text: { markdown: `Consider the given plots of vapour pressure (VP) vs temperature (T/K). Which amongst the following options is the correct graphical representation showing $\\Delta T_f$, depression in the freezing point of solvent in a solution?\n\n(Four graphs shown: (a) solution curve above liquid solvent, ΔTf shown; (b) frozen solution and liquid solvent curves; (c) frozen solution and liquid solvent with solution below; (d) solution and frozen solution curves)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: 'Graph (a): Solution VP above liquid solvent, ΔTf to the left', is_correct: false },
      { id: 'b', text: 'Graph (b): Frozen solution and liquid solvent intersect, ΔTf shown', is_correct: false },
      { id: 'c', text: 'Graph (c): Frozen solution above, solution below liquid solvent', is_correct: true },
      { id: 'd', text: 'Graph (d): Solution and frozen solution', is_correct: false },
    ],
    answer: { correct_option: 'c', explanation: 'A solution freezes when VP of solution = VP of frozen solution (solid). Adding non-volatile solute lowers VP of liquid solution below that of pure solvent. The solid (frozen solution) VP curve intersects the solution VP curve at a lower temperature than pure solvent freezing point. ΔTf = Tf° - Tf (positive). Graph (c) correctly shows frozen solution VP above solution VP, with ΔTf marked.' },
    solution: { text_markdown: `**Concept — Freezing point depression:**\n\nA solution freezes when the vapour pressure of the **liquid solution** equals the vapour pressure of the **solid (frozen solution)**.\n\n**Key facts:**\n1. Adding a non-volatile solute **lowers** the VP of the liquid solution below that of pure solvent.\n2. The VP of the solid (frozen solution) is approximately the same as pure solid solvent (solute is excluded on freezing).\n3. The liquid solution VP curve is **below** the pure liquid solvent VP curve.\n4. The intersection of the solid VP curve with the solution VP curve occurs at a **lower temperature** than the normal freezing point.\n\n**Correct graph:** Shows:\n- Liquid solvent VP curve (higher)\n- Solution VP curve (lower, shifted down)\n- Frozen solution VP curve intersecting solution curve at $T_f < T_f^0$\n- $\\Delta T_f = T_f^0 - T_f$ marked\n\nThis corresponds to **graph (c)**.\n\n**Answer: (c)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch12_solutions', tags: [{ tag_id: 'tag_sol_4', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: EXAM_SOURCE },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null
  },
  {
    _id: uuidv4(), display_id: 'MOLE-429',
    question_text: { markdown: `Which of the following statement is true with respect to $\\text{H}_2\\text{O}$, $\\text{NH}_3$ and $\\text{CH}_4$?\n\nA. The central atoms of all the molecules are $sp^3$ hybridized.\nB. The H–O–H, H–N–H and H–C–H angles in the above molecules are $104.5°$, $107.5°$ and $109.5°$ respectively.\nC. The increasing order of dipole moment is $\\text{CH}_4 < \\text{NH}_3 < \\text{H}_2\\text{O}$.\nD. Both $\\text{H}_2\\text{O}$ and $\\text{NH}_3$ are Lewis acids and $\\text{CH}_4$ is a Lewis base.\nE. A solution of $\\text{NH}_3$ in $\\text{H}_2\\text{O}$ is basic. In this solution $\\text{NH}_3$ and $\\text{H}_2\\text{O}$ act as Lowry-Bronsted acid and base respectively.\n\n(a) A and E Only \\quad (b) D and E Only \\quad (c) A, D and E Only \\quad (d) A, B and C Only`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: 'A and E Only', is_correct: false },
      { id: 'b', text: 'D and E Only', is_correct: false },
      { id: 'c', text: 'A, D and E Only', is_correct: false },
      { id: 'd', text: 'A, B and C Only', is_correct: true },
    ],
    answer: { correct_option: 'd', explanation: 'A: all sp3 ✓. B: bond angles 104.5°, 107.5°, 109.5° ✓. C: CH4 (0) < NH3 < H2O ✓. D: H2O and NH3 are Lewis BASES (lone pair donors), not acids ✗. E: NH3 acts as Bronsted BASE (accepts H+), H2O acts as Bronsted ACID (donates H+) ✗.' },
    solution: { text_markdown: `**Evaluating each statement:**\n\n- **(A) All central atoms are $sp^3$ hybridised:**\n  - H₂O: O is $sp^3$ (2 BP + 2 LP) ✓\n  - NH₃: N is $sp^3$ (3 BP + 1 LP) ✓\n  - CH₄: C is $sp^3$ (4 BP) ✓\n  → ✅ TRUE\n\n- **(B) Bond angles 104.5°, 107.5°, 109.5°:**\n  - H₂O: 104.5° (2 LP repulsion) ✓\n  - NH₃: 107.5° (1 LP repulsion) ✓\n  - CH₄: 109.5° (0 LP) ✓\n  → ✅ TRUE\n\n- **(C) Dipole moment: CH₄ < NH₃ < H₂O:**\n  - CH₄: $\\mu = 0$ (symmetric, tetrahedral)\n  - NH₃: $\\mu = 1.46\\,\\text{D}$\n  - H₂O: $\\mu = 1.85\\,\\text{D}$\n  → ✅ TRUE\n\n- **(D) H₂O and NH₃ are Lewis acids:** ❌ FALSE. They are **Lewis bases** (lone pair donors).\n\n- **(E) NH₃ acts as Bronsted acid, H₂O as base:** ❌ FALSE. NH₃ acts as **Bronsted base** (accepts H⁺ from H₂O); H₂O acts as **Bronsted acid**.\n\n**Correct: A, B and C → Answer: (d)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_mole', tags: [{ tag_id: 'tag_mole_3', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: EXAM_SOURCE },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null
  },
  {
    _id: uuidv4(), display_id: 'GOC-147',
    question_text: { markdown: `Given below are two statements:\n\n**Statement-I:** The conversion proceeds well in the less polar medium.\n$$\\text{CH}_3\\text{CH}_2\\text{CH}_2\\text{CH}_2\\text{Cl} \\xrightarrow{\\text{HO}^-} \\text{CH}_3\\text{CH}_2\\text{CH}_2\\text{CH}_2\\text{OH} + \\text{Cl}^-$$\n\n**Statement-II:** The conversion proceeds well in the more polar medium.\n$$\\text{CH}_3\\text{CH}_2\\text{CH}_2\\text{CH}_2\\text{Cl} \\xrightarrow{\\text{R}_3\\overset{..}{\\text{N}}} \\text{CH}_3\\text{CH}_2\\text{CH}_2\\text{CH}_2\\text{N}^+\\text{R}_3\\text{Cl}^-$$\n\n(a) Both statement I and statement II are true\n(b) Both statement I and statement II are false\n(c) Statement I is false but statement II is true\n(d) Statement I is true but statement II is false`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: 'Both statement I and statement II are true', is_correct: true },
      { id: 'b', text: 'Both statement I and statement II are false', is_correct: false },
      { id: 'c', text: 'Statement I is false but statement II is true', is_correct: false },
      { id: 'd', text: 'Statement I is true but statement II is false', is_correct: false },
    ],
    answer: { correct_option: 'a', explanation: 'Statement I: SN2 with HO- (charged nucleophile, charged leaving group). Reactant has higher charge density → transition state has dispersed charge → less polar solvent stabilises TS better → proceeds in less polar medium ✓. Statement II: Menschutkin reaction (neutral R3N + neutral RCl → ionic products). Transition state has higher charge density than reactants → more polar solvent stabilises TS → proceeds in more polar medium ✓.' },
    solution: { text_markdown: `**Statement I — SN2 with OH⁻:**\n\n$$\\text{R-Cl} + \\text{OH}^- \\rightarrow \\text{R-OH} + \\text{Cl}^-$$\n\nReactants: charged (OH⁻, high charge density)\nTransition state: $[\\text{HO}\\cdots\\text{C}\\cdots\\text{Cl}]^-$ — charge **dispersed** (lower charge density)\n\nA **less polar** solvent better stabilises the dispersed-charge TS relative to the concentrated-charge reactant → **reaction proceeds faster in less polar medium** → ✅ TRUE\n\n**Statement II — Menschutkin reaction (SN2):**\n\n$$\\text{R-Cl} + \\text{R}_3\\text{N} \\rightarrow [\\text{R}_3\\overset{+}{\\text{N}}\\cdots\\text{C}\\cdots\\text{Cl}^-]^{\\ddagger} \\rightarrow \\text{R}_3\\overset{+}{\\text{N-R}} + \\text{Cl}^-$$\n\nReactants: **neutral** (low charge density)\nTransition state: **charge developing** (higher charge density)\nProducts: **ionic** (highest charge density)\n\nA **more polar** solvent stabilises the charge-developing TS → lowers activation energy → **reaction proceeds faster in more polar medium** → ✅ TRUE\n\n**Answer: (a) Both statements are true**`, latex_validated: true },
    metadata: { difficulty: 'Hard', chapter_id: 'ch11_goc', tags: [{ tag_id: 'tag_goc_5', weight: 1.0 }], is_pyq: true, is_top_pyq: true, exam_source: EXAM_SOURCE },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null
  },
  {
    _id: uuidv4(), display_id: 'HC-173',
    question_text: { markdown: `The product (A) formed in the following reaction sequence is:\n\n$$\\text{CH}_3\\text{–C}\\equiv\\text{CH} \\xrightarrow{\\text{(i) Hg}^{2+}\\text{, H}_2\\text{SO}_4} \\xrightarrow{\\text{(ii) HCN}} \\xrightarrow{\\text{(iii) H}_2\\text{/Ni}} \\text{A}$$\n\n(a) $\\text{CH}_3\\text{–C(NH}_2\\text{)(CH}_3\\text{)–CH}_2\\text{–OH}$\n(b) $\\text{CH}_3\\text{–C(OH)(CH}_3\\text{)–CH}_2\\text{–NH}_2$\n(c) $\\text{CH}_3\\text{–CH}_2\\text{–CH(NH}_2\\text{)–CH}_2\\text{–OH}$\n(d) $\\text{CH}_3\\text{–CH}_2\\text{–CH(OH)–CH}_2\\text{–NH}_2$`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '$\\text{CH}_3\\text{–C(NH}_2\\text{)(CH}_3\\text{)–CH}_2\\text{–OH}$', is_correct: false },
      { id: 'b', text: '$\\text{CH}_3\\text{–C(OH)(CH}_3\\text{)–CH}_2\\text{–NH}_2$', is_correct: true },
      { id: 'c', text: '$\\text{CH}_3\\text{–CH}_2\\text{–CH(NH}_2\\text{)–CH}_2\\text{–OH}$', is_correct: false },
      { id: 'd', text: '$\\text{CH}_3\\text{–CH}_2\\text{–CH(OH)–CH}_2\\text{–NH}_2$', is_correct: false },
    ],
    answer: { correct_option: 'b', explanation: 'Step 1: CH3-C≡CH + Hg2+/H2SO4 (Markovnikov) → CH3-C(=O)-CH3 (acetone). Step 2: CH3COCH3 + HCN → CH3-C(OH)(CN)-CH3 (cyanohydrin). Step 3: H2/Ni reduces CN → CH2NH2 and keeps OH. Product: CH3-C(OH)(CH3)-CH2-NH2.' },
    solution: { text_markdown: `**Step 1 — Hydration of propyne (Markovnikov):**\n\n$$\\text{CH}_3\\text{–C}\\equiv\\text{CH} \\xrightarrow{\\text{Hg}^{2+}/\\text{H}_2\\text{SO}_4} \\text{CH}_3\\text{–C(=O)–CH}_3$$\n\nMarkovnikov addition of water to propyne gives **acetone** (methyl ketone at C2).\n\n**Step 2 — Cyanohydrin formation:**\n\n$$\\text{CH}_3\\text{–CO–CH}_3 + \\text{HCN} \\rightarrow \\text{CH}_3\\text{–C(OH)(CN)–CH}_3$$\n\nHCN adds to the carbonyl → **cyanohydrin**: OH and CN both on C2.\n\n**Step 3 — Reduction with H₂/Ni:**\n\n$$\\text{CH}_3\\text{–C(OH)(CN)–CH}_3 \\xrightarrow{\\text{H}_2/\\text{Ni}} \\text{CH}_3\\text{–C(OH)(CH}_2\\text{NH}_2\\text{)–CH}_3$$\n\nH₂/Ni reduces **–CN → –CH₂NH₂** (the OH group is not reduced under these conditions).\n\n**Product A:** $\\text{CH}_3\\text{–C(OH)(CH}_3\\text{)–CH}_2\\text{–NH}_2$\n\n**Answer: (b)**`, latex_validated: true },
    metadata: { difficulty: 'Hard', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hc_4', weight: 1.0 }], is_pyq: true, is_top_pyq: true, exam_source: EXAM_SOURCE },
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
  console.log(`\nBatch 4 done: ${ok} OK, ${fail} FAIL`);
  await mongoose.disconnect();
}

main().catch(console.error);
