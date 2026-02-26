// Hydrocarbons - Batch 1: MD Questions 23-32 (HC-018 to HC-027) - 10 questions
// Including 2025 questions as per user request
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const questions = [
  {
    _id: uuidv4(), display_id: 'HC-018',
    question_text: { markdown: `A compound 'X' absorbs 2 moles of hydrogen and 'X' upon oxidation with $\\ce{KMnO4/H+}$ gives:\n\n![image](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-04.jpg?height=64&width=243&top_left_y=253&top_left_x=280)\n\nThe total number of σ bonds present in the compound 'X' is $\\underline{\\hspace{2cm}}$.`, latex_validated: true },
    type: 'NVT',
    options: [],
    answer: { correct_option: null, numerical_value: 27, explanation: 'Compound X is an alkene with two double bonds that gives the shown products on oxidation. Count all σ bonds.' },
    solution: { text_markdown: `Compound 'X' will be alkene having two double bonds.\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-18.jpg?height=465&width=834&top_left_y=714&top_left_x=1255)\n\nSo number of σ-bonds in compound 'X' = **27**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_4', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2025, month: 'Jan', day: 23, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 88
  },
  {
    _id: uuidv4(), display_id: 'HC-019',
    question_text: { markdown: `The incorrect statements regarding geometrical isomerism are:\n\nA. Propene shows geometrical isomerism.\nB. Trans isomer has identical atoms/groups on the opposite sides of the double bond.\nC. Cis-but-2-ene has higher dipole moment than trans-but-2-ene.\nD. 2-methylbut-2-ene shows two geometrical isomers.\nE. Trans-isomer has lower melting point than cis isomer.\n\nChoose the correct answer from the options given below:`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: 'B and C only', is_correct: false },
      { id: 'b', text: 'C, D and E only', is_correct: false },
      { id: 'c', text: 'A and E only', is_correct: false },
      { id: 'd', text: 'A, D and E only', is_correct: true }
    ],
    answer: { correct_option: 'd', explanation: 'A is incorrect (propene cannot show geometrical isomerism), D is incorrect (2-methylbut-2-ene has two identical methyl groups), E is incorrect (trans has higher melting point).' },
    solution: { text_markdown: `**Analysis:**\n\n- **A.** Propene ($\\ce{CH3-CH=CH2}$) does **not** show geometrical isomerism as one of the double-bonded carbon atom has two identical hydrogen atoms. ✗\n- **B.** Correct statement ✓\n- **C.** Correct statement ✓\n- **D.** 2-Methylbut-2-ene ($\\ce{CH3C(CH3)=CHCH3}$) does **not** show geometrical isomerism because one of the double-bonded carbon atom has two identical methyl groups. ✗\n- **E.** Trans-isomers have higher symmetry and better packing efficiency, leading to a **higher** melting point than cis-isomers. ✗\n\nAnswer: **(d) A, D and E only**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2025, month: 'Jan', day: 22, shift: 'Shift-I' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 90
  },
  {
    _id: uuidv4(), display_id: 'HC-020',
    question_text: { markdown: `Match List-I with List-II:\n\n| List-I (Isomers of $\\mathbf{C_{10}H_{14}}$) | List-II (Ozonolysis product) |\n|---|---|\n| (A) ![A](image) | (I) ![I](image) |\n| (B) ![B](image) | (II) ![II](image) |\n| (C) ![C](image) | (III) ![III](image) |\n| (D) ![D](image) | (IV) ![IV](image) |\n\nChoose the correct answer from the options given below:`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '(A)-(III), (B)-(IV), (C)-(I), (D)-(II)', is_correct: true },
      { id: 'b', text: '(A)-(II), (B)-(III), (C)-(I), (D)-(IV)', is_correct: false },
      { id: 'c', text: '(A)-(I), (B)-(IV), (C)-(III), (D)-(II)', is_correct: false },
      { id: 'd', text: '(A)-(III), (B)-(II), (C)-(I), (D)-(IV)', is_correct: false }
    ],
    answer: { correct_option: 'a', explanation: 'Match each isomer with its ozonolysis product by analyzing the double bond positions.' },
    solution: { text_markdown: `Analyze each structure and perform ozonolysis to match products.\n\nAnswer: **(a)**`, latex_validated: true },
    metadata: { difficulty: 'Hard', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_4', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2025, month: 'Jan', day: 23, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85
  },
  {
    _id: uuidv4(), display_id: 'HC-021',
    question_text: { markdown: `Following are the four molecules "P", "Q", "R" and "S". Which one among the four molecules will react with $\\ce{H-Br_{(aq)}}$ at the fastest rate?\n\n![Molecules P, Q, R, S](image)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: 'Q', is_correct: true },
      { id: 'b', text: 'R', is_correct: false },
      { id: 'c', text: 'P', is_correct: false },
      { id: 'd', text: 'S', is_correct: false }
    ],
    answer: { correct_option: 'a', explanation: 'Q forms the most stable carbocation intermediate due to resonance stabilization.' },
    solution: { text_markdown: `The addition of $\\ce{HBr(aq)}$ to an alkene follows an electrophilic addition mechanism, where a carbocation intermediate is formed in the rate-determining step.\n\nAmong P, Q, R, and S, compound **Q** forms the most stable carbocation intermediate due to **resonance stabilization**, making it the fastest to react.\n\nAnswer: **(a)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2025, month: 'Jan', day: 24, shift: 'Shift-I' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 88
  },
  {
    _id: uuidv4(), display_id: 'HC-022',
    question_text: { markdown: `The hydrocarbon (X) with molar mass $80\\ \\text{g mol}^{-1}$ and 90% carbon has $\\underline{\\hspace{2cm}}$ degree of unsaturation.`, latex_validated: true },
    type: 'NVT',
    options: [],
    answer: { correct_option: null, numerical_value: 3, explanation: 'Calculate molecular formula from mass and percentage, then apply degree of unsaturation formula.' },
    solution: { text_markdown: `**Calculate number of C and H atoms:**\n\nMass of carbon = $\\frac{80 \\times 90}{100} = 72$ g\n\nNumber of C-atoms = $\\frac{72}{12} = 6$\n\nMass of hydrogen = $80 - 72 = 8$ g\n\nNumber of H-atoms = $\\frac{8}{1} = 8$\n\nMolecular formula of hydrocarbon = $\\ce{C6H8}$\n\n**Degree of unsaturation** = $\\frac{12 + 2 - 8}{2} = 3$\n\nAnswer: **3**`, latex_validated: true },
    metadata: { difficulty: 'Easy', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_3', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2025, month: 'Jan', day: 24, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 88
  },
  {
    _id: uuidv4(), display_id: 'HC-023',
    question_text: { markdown: `Match List-I with List-II.\n\n| List-I (Structure) | List-II (IUPAC Name) |\n|---|---|\n| A. ![A](image) | I. 4-Methylpent-1-ene |\n| B. $(\\ce{CH3})_2\\ce{C}(\\ce{C3H7})_2$ | II. 3-Ethyl-5-methylheptane |\n| C. ![C](image) | III. 4,4-Dimethylheptane |\n| D. ![D](image) | IV. 2-Methyl-1,3-pentadiene |\n\nChoose the correct answer from the options given below:`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '(A)-(III), (B)-(II), (C)-(IV), (D)-(I)', is_correct: false },
      { id: 'b', text: '(A)-(III), (B)-(II), (C)-(I), (D)-(IV)', is_correct: false },
      { id: 'c', text: '(A)-(II), (B)-(III), (C)-(IV), (D)-(I)', is_correct: true },
      { id: 'd', text: '(A)-(II), (B)-(III), (C)-(I), (D)-(IV)', is_correct: false }
    ],
    answer: { correct_option: 'c', explanation: 'Match structures with IUPAC names based on nomenclature rules.' },
    solution: { text_markdown: `**Matching:**\n\n- **(A)** 3-Ethyl-5-methylheptane → **(II)**\n- **(B)** $(\\ce{CH3})_2\\ce{C}(\\ce{C3H7})_2$ = 4,4-Dimethylheptane → **(III)**\n- **(C)** 2-Methyl-1,3-pentadiene → **(IV)**\n- **(D)** 4-Methylpent-1-ene → **(I)**\n\nAnswer: **(c)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_3', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2025, month: 'Jan', day: 29, shift: 'Shift-I' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 88
  },
  {
    _id: uuidv4(), display_id: 'HC-024',
    question_text: { markdown: `3-Methylhex-2-ene on reaction with HBr in presence of peroxide forms an addition product (A). The number of possible stereoisomers for 'A' is $\\underline{\\hspace{2cm}}$.`, latex_validated: true },
    type: 'NVT',
    options: [],
    answer: { correct_option: null, numerical_value: 4, explanation: 'Anti-Markovnikov addition creates 2 chiral centers, giving 2^2 = 4 stereoisomers.' },
    solution: { text_markdown: `**Chemical reaction:**\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-19.jpg?height=150&width=555&top_left_y=1710&top_left_x=373)\n\n**Number of chiral centres:** 2\n\n**Number of stereoisomers** = $2^2 = 4$\n\nAnswer: **4**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2024, month: 'Jan', day: 27, shift: 'Shift-I' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 88
  },
  {
    _id: uuidv4(), display_id: 'HC-025',
    question_text: { markdown: `Major product of the following reaction is:\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-04.jpg?height=197&width=352&top_left_y=1371&top_left_x=280)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '![Option A](image)', is_correct: false },
      { id: 'b', text: '![Option B](image)', is_correct: false },
      { id: 'c', text: '![Option C](image)', is_correct: true },
      { id: 'd', text: '![Option D](image)', is_correct: true }
    ],
    answer: { correct_option: 'c', explanation: 'D-Cl addition to cyclopentene derivative gives the shown product.' },
    solution: { text_markdown: `The given reaction occurs as shown. Both (c) and (d) are acceptable answers.\n\nAnswer: **(c, d)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2024, month: 'Jan', day: 31, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85
  },
  {
    _id: uuidv4(), display_id: 'HC-026',
    question_text: { markdown: `Number of σ and π bonds present in ethylene molecule is respectively:`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '3 and 1', is_correct: false },
      { id: 'b', text: '5 and 2', is_correct: false },
      { id: 'c', text: '4 and 1', is_correct: false },
      { id: 'd', text: '5 and 1', is_correct: true }
    ],
    answer: { correct_option: 'd', explanation: 'Ethylene (C₂H₄) has 5 σ bonds (4 C-H and 1 C-C) and 1 π bond.' },
    solution: { text_markdown: `**Ethylene structure:**\n\n$$\\ce{H2C=CH2}$$\n\n**Number of σ bonds** = 4 (C-H) + 1 (C-C) = **5**\n\n**Number of π bonds** = **1** (C=C double bond has 1 π bond)\n\nAnswer: **(d)**`, latex_validated: true },
    metadata: { difficulty: 'Easy', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_3', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2024, month: 'April', day: 5, shift: 'Shift-I' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 88
  },
  {
    _id: uuidv4(), display_id: 'HC-027',
    question_text: { markdown: `Given below are two statements: one is labelled as Assertion (A) and the other is labelled as Reason (R).\n\n**Assertion (A):** Cis form of alkene is found to be more polar than the trans form\n\n**Reason (R):** Dipole moment of trans isomer of 2-butene is zero.\n\nIn the light of the above statements, choose the correct answer from the options given below:`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: 'Both (A) and (R) are true but (R) is NOT the correct explanation of (A)', is_correct: false },
      { id: 'b', text: '(A) is true but (R) is false', is_correct: false },
      { id: 'c', text: 'Both (A) and (R) are true and (R) is the correct explanation of (A)', is_correct: true },
      { id: 'd', text: '(A) is false but (R) is true', is_correct: false }
    ],
    answer: { correct_option: 'c', explanation: 'Both statements are true and R correctly explains A - trans has zero dipole moment due to symmetry.' },
    solution: { text_markdown: `**Net Dipole moment** is the vector sum of all dipoles.\n\n![Dipole moments](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-19.jpg?height=188&width=510&top_left_y=484&top_left_x=1314)\n\nDipole moment of cis form is greater than trans form.\n\nBoth (A) and (R) are correct and (R) is the correct explanation of (A).\n\nAnswer: **(c)**`, latex_validated: true },
    metadata: { difficulty: 'Easy', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2024, month: 'April', day: 5, shift: 'Shift-I' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 90
  }
];

async function run() {
  console.log('\n=== HYDROCARBONS REMAINING - BATCH 1: Q23-32 (HC-018 to HC-027) ===\n');
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('questions_v2');
    
    for (const q of questions) {
      await collection.insertOne(q);
      console.log(`✅ Inserted ${q.display_id} (${q.metadata.exam_source.year})`);
    }
    
    console.log(`\n✅ Successfully inserted ${questions.length} questions (Batch 1)`);
    console.log(`📊 Progress: HC-001 to HC-027 complete (27 questions)`);
    console.log(`⏭️  Remaining: 82 questions (HC-028 to HC-109)`);
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
