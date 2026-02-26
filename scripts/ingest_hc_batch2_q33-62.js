// Hydrocarbons - Batch 2: MD Questions 33-62 (HC-028 to HC-057) - 30 questions
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const questions = [
  // Q33 -> HC-028
  {
    _id: uuidv4(), display_id: 'HC-028',
    question_text: { markdown: `Given below are two statements:\n\n**Statement I:** Cis-but-2-ene has higher dipole moment than trans-but-2-ene.\n\n**Statement II:** Dipole moment arises due to polarity.\n\nIn the light of the above statements, choose the correct answer from the options given below:`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: 'Both Statement I and Statement II are false', is_correct: false },
      { id: 'b', text: 'Statement I is false but Statement II is true', is_correct: false },
      { id: 'c', text: 'Statement I is true but Statement II is false', is_correct: false },
      { id: 'd', text: 'Both Statement I and Statement II are true', is_correct: true }
    ],
    answer: { correct_option: 'd', explanation: 'Cis-but-2-ene has higher dipole moment than trans due to geometry. Dipole moment arises from polarity.' },
    solution: { text_markdown: `Dipole moment arises due to the polarity.\n\nHence, cis-but-2-ene has more dipole moment than trans-but-2-ene.\n\nAnswer: **(d)**`, latex_validated: true },
    metadata: { difficulty: 'Easy', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2024, month: 'April', day: 6, shift: 'Shift-I' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 88
  },
  // Q34 -> HC-029
  {
    _id: uuidv4(), display_id: 'HC-029',
    question_text: { markdown: `![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-05.jpg?height=272&width=481&top_left_y=744&top_left_x=1255)\n\nThe major product 'A' in the above reaction is:`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '![Option A](image)', is_correct: false },
      { id: 'b', text: '![Option B](image)', is_correct: true },
      { id: 'c', text: '![Option C](image)', is_correct: false },
      { id: 'd', text: '![Option D](image)', is_correct: false }
    ],
    answer: { correct_option: 'b', explanation: 'Ozonolysis followed by reduction gives the shown products.' },
    solution: { text_markdown: `Ozonolysis reaction mechanism gives product B.\n\nAnswer: **(b)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_4', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2024, month: 'April', day: 5, shift: 'Shift-I' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85
  },
  // Q35 -> HC-030
  {
    _id: uuidv4(), display_id: 'HC-030',
    question_text: { markdown: `Hydrocarbon 'X' is:\n\n![Hydrocarbon X](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-05.jpg?height=194&width=623&top_left_y=1438&top_left_x=1307)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: 'Cyclohexa-1,3-diene', is_correct: false },
      { id: 'b', text: 'Cyclohexa-1,2-diene', is_correct: false },
      { id: 'c', text: 'Cyclohexene', is_correct: false },
      { id: 'd', text: 'Cyclohexa-1,4-diene', is_correct: true }
    ],
    answer: { correct_option: 'd', explanation: 'Based on ozonolysis products, X must be cyclohexa-1,4-diene.' },
    solution: { text_markdown: `Hydrocarbon 'X' is **cyclohexa-1,4-diene**\n\nThe reaction is given below:\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-19.jpg?height=194&width=623&top_left_y=1438&top_left_x=1307)\n\nAnswer: **(d)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_4', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2024, month: 'April', day: 4, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 88
  },
  // Q36 -> HC-031
  {
    _id: uuidv4(), display_id: 'HC-031',
    question_text: { markdown: `The major product formed in the following reaction is:\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-05.jpg?height=299&width=736&top_left_y=1776&top_left_x=1176)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '![Option A](image)', is_correct: true },
      { id: 'b', text: '![Option B](image)', is_correct: false },
      { id: 'c', text: '![Option C](image)', is_correct: false },
      { id: 'd', text: '![Option D](image)', is_correct: false }
    ],
    answer: { correct_option: 'a', explanation: 'Reaction with H₂SO₄ at high temperature gives sulfonation product.' },
    solution: { text_markdown: `Reaction of alkene with $\\ce{H2SO4}$ at high temp. $-\\ce{SO3H}$ group is attached on alkene.\n\nAnswer: **(a)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2024, month: 'April', day: 4, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85
  },
  // Q37 -> HC-032
  {
    _id: uuidv4(), display_id: 'HC-032',
    question_text: { markdown: `Match List-I with List-II:\n\n| List-I (Alkyl halide) | List-II (Alkene formed) |\n|---|---|\n| A. 1-Bromo-2-methylbutane | I. Propene |\n| B. 2-Bromopropane | II. 2-Methylbutene |\n| C. 2-Bromopentane | III. Pent-1-ene and Pent-2-ene |\n| D. 2-Bromo-3,3-dimethylpentane | IV. 3,3-Dimethylpentene |\n\nChoose the correct answer from the options given below:`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: 'A-III, B-I, C-IV, D-II', is_correct: false },
      { id: 'b', text: 'A-IV, B-III, C-II, D-I', is_correct: false },
      { id: 'c', text: 'A-II, B-I, C-III, D-IV', is_correct: true },
      { id: 'd', text: 'A-I, B-II, C-III, D-IV', is_correct: false }
    ],
    answer: { correct_option: 'c', explanation: 'Match each alkyl halide with its elimination product.' },
    solution: { text_markdown: `**Matching:**\n\n- **A.** 1-Bromo-2-methylbutane → 2-Methylbutene **(II)**\n- **B.** 2-Bromopropane → Propene **(I)**\n- **C.** 2-Bromopentane → Pent-1-ene and Pent-2-ene **(III)**\n- **D.** 2-Bromo-3,3-dimethylpentane → 3,3-Dimethylpentene **(IV)**\n\nAnswer: **(c)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2024, month: 'April', day: 4, shift: 'Shift-I' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 88
  },
  // Q38 -> HC-033
  {
    _id: uuidv4(), display_id: 'HC-033',
    question_text: { markdown: `The major product of the following reaction is:\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-06.jpg?height=126&width=292&top_left_y=1402&top_left_x=475)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '![Option A](image)', is_correct: true },
      { id: 'b', text: '![Option B](image)', is_correct: false },
      { id: 'c', text: '![Option C](image)', is_correct: false },
      { id: 'd', text: '![Option D](image)', is_correct: false }
    ],
    answer: { correct_option: 'a', explanation: 'Markovnikov addition of HBr to the alkene.' },
    solution: { text_markdown: `The major product for the given reaction is explained in the following reaction mechanism.\n\n[The CN group present in the reactant is written as $\\ce{C#N}$]\n\nAnswer: **(a)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2023, month: 'April', day: 13, shift: 'Shift-I' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85
  },
  // Q39 -> HC-034
  {
    _id: uuidv4(), display_id: 'HC-034',
    question_text: { markdown: `The major product of the following reaction is:\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-06.jpg?height=345&width=869&top_left_y=1852&top_left_x=190)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '![Option A](image)', is_correct: false },
      { id: 'b', text: '![Option B](image)', is_correct: true },
      { id: 'c', text: '![Option C](image)', is_correct: false },
      { id: 'd', text: '![Option D](image)', is_correct: false }
    ],
    answer: { correct_option: 'b', explanation: 'Hydroboration-oxidation gives anti-Markovnikov alcohol.' },
    solution: { text_markdown: `The reaction mechanism for the given reaction is shown. Hydroboration-oxidation gives anti-Markovnikov product.\n\nAnswer: **(b)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2023, month: 'April', day: 11, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 88
  },
  // Q40 -> HC-035
  {
    _id: uuidv4(), display_id: 'HC-035',
    question_text: { markdown: `2-hexene on ozonolysis in the presence of water gives:`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: 'Acetic acid and butanoic acid', is_correct: true },
      { id: 'b', text: 'Propanoic acid', is_correct: false },
      { id: 'c', text: 'Acetic acid and propanal', is_correct: false },
      { id: 'd', text: 'Butanoic acid', is_correct: false }
    ],
    answer: { correct_option: 'a', explanation: 'Oxidative ozonolysis of 2-hexene gives acetic acid and butanoic acid.' },
    solution: { text_markdown: `2-hexene on ozonolysis in the presence of water give acetic acid and butanoic acid.\n\n$$\\ce{CH3CH=CHCH2CH2CH3 ->[[(i) O3][(ii) H2O]] CH3COOH + CH3CH2CH2COOH}$$\n\nIt is oxidative ozonolysis.\n\nAnswer: **(a)**`, latex_validated: true },
    metadata: { difficulty: 'Easy', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_4', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2023, month: 'April', day: 11, shift: 'Shift-I' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 90
  },
  // Q41 -> HC-036
  {
    _id: uuidv4(), display_id: 'HC-036',
    question_text: { markdown: `The major product formed in the following reaction is:\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-06.jpg?height=121&width=558&top_left_y=262&top_left_x=1280)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '![Option A](image)', is_correct: false },
      { id: 'b', text: '![Option B](image)', is_correct: true },
      { id: 'c', text: '![Option C](image)', is_correct: false },
      { id: 'd', text: '![Option D](image)', is_correct: false }
    ],
    answer: { correct_option: 'b', explanation: 'Lindlar catalyst gives cis-alkene as major product.' },
    solution: { text_markdown: `The reaction takes place as:\n\nLindlar's catalyst makes **cis-alkene** as the major product.\n\nAnswer: **(b)**`, latex_validated: true },
    metadata: { difficulty: 'Easy', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2023, month: 'April', day: 8, shift: 'Shift-I' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 88
  },
  // Q42 -> HC-037
  {
    _id: uuidv4(), display_id: 'HC-037',
    question_text: { markdown: `The molar mass of hydrocarbon (X) which on complete combustion produces 1.8 g of water and 4.4 g of $\\ce{CO2}$ is $\\underline{\\hspace{2cm}}$ g/mol.`, latex_validated: true },
    type: 'NVT',
    options: [],
    answer: { correct_option: null, numerical_value: 70, explanation: 'Calculate moles of CO₂ and H₂O to find molecular formula, then molar mass.' },
    solution: { text_markdown: `![Solution](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-20.jpg?height=275&width=820&top_left_y=778&top_left_x=1257)\n\nHence molar mass of hydrocarbon (X) is **70**.\n\nAnswer: **70**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_3', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2023, month: 'April', day: 6, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 88
  },
  // Q43 -> HC-038
  {
    _id: uuidv4(), display_id: 'HC-038',
    question_text: { markdown: `The number of possible isomeric products (excluding stereoisomers) on monochlorination of 2-methylbutane is $\\underline{\\hspace{2cm}}$.`, latex_validated: true },
    type: 'NVT',
    options: [],
    answer: { correct_option: null, numerical_value: 4, explanation: 'Count unique positions for chlorination on 2-methylbutane.' },
    solution: { text_markdown: `The number of possible isomeric products are:\n\n![Products](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-20.jpg?height=443&width=583&top_left_y=1144&top_left_x=1257)\n\nAnswer: **4**`, latex_validated: true },
    metadata: { difficulty: 'Easy', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_1', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2023, month: 'April', day: 6, shift: 'Shift-I' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 88
  },
  // Q44 -> HC-039
  {
    _id: uuidv4(), display_id: 'HC-039',
    question_text: { markdown: `The common name of 4-Methylpent-3-en-2-one is:`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: 'Acetone', is_correct: false },
      { id: 'b', text: 'Acetophenone', is_correct: false },
      { id: 'c', text: 'Benzophenone', is_correct: false },
      { id: 'd', text: 'Mesityl oxide', is_correct: true }
    ],
    answer: { correct_option: 'd', explanation: 'The common name of 4-Methylpent-3-en-2-one is Mesityl oxide.' },
    solution: { text_markdown: `The common name of 4-Methylpent-3-en-2-one is **Mesityl oxide**.\n\nAnswer: **(d)**`, latex_validated: true },
    metadata: { difficulty: 'Easy', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_3', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2023, month: 'Jan', day: 31, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 88
  },
  // Q45 -> HC-040
  {
    _id: uuidv4(), display_id: 'HC-040',
    question_text: { markdown: `The number of C-C sigma bonds in Mesityl oxide is $\\underline{\\hspace{2cm}}$.`, latex_validated: true },
    type: 'NVT',
    options: [],
    answer: { correct_option: null, numerical_value: 5, explanation: 'Count C-C sigma bonds in the structure of Mesityl oxide.' },
    solution: { text_markdown: `The structure of Mesityl oxide is:\n\n<smiles>CC(=O)C=C(C)C</smiles>\n\nHence, C-C sigma bonds are **5**.\n\nAnswer: **5**`, latex_validated: true },
    metadata: { difficulty: 'Easy', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_3', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2023, month: 'Jan', day: 31, shift: 'Shift-I' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 88
  },
  // Q46 -> HC-041
  {
    _id: uuidv4(), display_id: 'HC-041',
    question_text: { markdown: `Which of the following compounds will give positive iodoform test and negative Fehling test?`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: 'Acetone', is_correct: false },
      { id: 'b', text: 'Acetaldehyde', is_correct: false },
      { id: 'c', text: 'Benzaldehyde', is_correct: false },
      { id: 'd', text: 'Mesityl oxide', is_correct: true }
    ],
    answer: { correct_option: 'd', explanation: 'Mesityl oxide has -COCH₃ group (positive iodoform) but no aldehyde (negative Fehling).' },
    solution: { text_markdown: `**Iodoform test** → $-\\ce{C(=O)-CH3}$\n\n**Silver mirror test** → Given by aldehydes\n\n![Analysis](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-20.jpg?height=193&width=793&top_left_y=2022&top_left_x=1201)\n\nAnswer: **(d)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_4', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2023, month: 'Jan', day: 30, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 88
  },
  // Q47 -> HC-042
  {
    _id: uuidv4(), display_id: 'HC-042',
    question_text: { markdown: `The complete reactions are as follows:\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-20.jpg?height=148&width=538&top_left_y=2262&top_left_x=1334)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '![Option A](image)', is_correct: false },
      { id: 'b', text: '![Option B](image)', is_correct: false },
      { id: 'c', text: '![Option C](image)', is_correct: false },
      { id: 'd', text: '![Option D](image)', is_correct: true }
    ],
    answer: { correct_option: 'd', explanation: 'Ozonolysis followed by oxidation gives carboxylic acids.' },
    solution: { text_markdown: `The complete reactions are as follows. Ozonolysis with oxidative workup.\n\nAnswer: **(d)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_4', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2023, month: 'Jan', day: 30, shift: 'Shift-I' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85
  },
  // Q48 -> HC-043
  {
    _id: uuidv4(), display_id: 'HC-043',
    question_text: { markdown: `Which one of the following is an electron withdrawing group?`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '$-\\ce{CH3}$', is_correct: false },
      { id: 'b', text: '$-\\ce{OCH3}$', is_correct: false },
      { id: 'c', text: '$-\\ce{OH}$', is_correct: false },
      { id: 'd', text: '$-\\ce{NO2}$', is_correct: true }
    ],
    answer: { correct_option: 'd', explanation: '-NO₂ is an electron withdrawing group while -CH₃ is electron releasing.' },
    solution: { text_markdown: `$-\\ce{NO2}$ is an electron withdrawing group while $-\\ce{CH3}$ is an electron releasing group.\n\nAnswer: **(d)**`, latex_validated: true },
    metadata: { difficulty: 'Easy', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_5', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2023, month: 'Jan', day: 25, shift: 'Shift-I' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 88
  },
  // Q49 -> HC-044
  {
    _id: uuidv4(), display_id: 'HC-044',
    question_text: { markdown: `The major product of the following reaction is:\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-07.jpg?height=299&width=775&top_left_y=364&top_left_x=325)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '![Option A](image)', is_correct: false },
      { id: 'b', text: '![Option B](image)', is_correct: true },
      { id: 'c', text: '![Option C](image)', is_correct: false },
      { id: 'd', text: '![Option D](image)', is_correct: false }
    ],
    answer: { correct_option: 'b', explanation: 'Carbocation rearrangement followed by elimination.' },
    solution: { text_markdown: `The complete reaction is as follows with carbocation rearrangement.\n\nAnswer: **(b)**`, latex_validated: true },
    metadata: { difficulty: 'Hard', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2023, month: 'Jan', day: 24, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85
  },
  // Q50 -> HC-045
  {
    _id: uuidv4(), display_id: 'HC-045',
    question_text: { markdown: `The major product of the following reaction is:\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-07.jpg?height=494&width=779&top_left_y=1040&top_left_x=337)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '![Option A](image)', is_correct: true },
      { id: 'b', text: '![Option B](image)', is_correct: false },
      { id: 'c', text: '![Option C](image)', is_correct: false },
      { id: 'd', text: '![Option D](image)', is_correct: false }
    ],
    answer: { correct_option: 'a', explanation: 'Hydration followed by dehydration gives the conjugated diene.' },
    solution: { text_markdown: `The complete reaction mechanism is shown.\n\nAnswer: **(a)**`, latex_validated: true },
    metadata: { difficulty: 'Hard', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2022, month: 'July', day: 29, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85
  },
  // Q51 -> HC-046
  {
    _id: uuidv4(), display_id: 'HC-046',
    question_text: { markdown: `Which one of the following alkenes when treated with HCl yields majorly an optically inactive alkyl halide?`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '3-Methylcyclohexene', is_correct: false },
      { id: 'b', text: '3-Methylbut-1-ene', is_correct: false },
      { id: 'c', text: '2-Methylbut-2-ene', is_correct: false },
      { id: 'd', text: '3-Methylbutene', is_correct: true }
    ],
    answer: { correct_option: 'd', explanation: '3-Methylbutene produces optically inactive product as no chiral center is formed.' },
    solution: { text_markdown: `3-Methyl butene (option d) on reaction with HCl will not produce racemic products.\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-21.jpg?height=222&width=730&top_left_y=1613&top_left_x=350)\n\nAnswer: **(d)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2022, month: 'July', day: 28, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 88
  },
  // Q52 -> HC-047
  {
    _id: uuidv4(), display_id: 'HC-047',
    question_text: { markdown: `The major product of the following reaction is:\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-07.jpg?height=356&width=725&top_left_y=1918&top_left_x=291)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '![Option A](image)', is_correct: false },
      { id: 'b', text: '![Option B](image)', is_correct: false },
      { id: 'c', text: '![Option C](image)', is_correct: true },
      { id: 'd', text: '![Option D](image)', is_correct: false }
    ],
    answer: { correct_option: 'c', explanation: 'Ring expansion occurs to release ring strain, forming 6-membered ring.' },
    solution: { text_markdown: `In this reaction, ring expansion i.e., 5-membered to 6-membered ring occurs to release ring strain.\n\nAnswer: **(c)**`, latex_validated: true },
    metadata: { difficulty: 'Hard', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2022, month: 'July', day: 28, shift: 'Shift-I' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85
  },
  // Q53 -> HC-048
  {
    _id: uuidv4(), display_id: 'HC-048',
    question_text: { markdown: `Arrange the following isomers of hexane in order of their increasing heat of combustion:\n\n(a) 2-Methylpentane\n(b) 2,3-Dimethylbutane\n(c) 2,2-Dimethylbutane`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: 'a < b < c', is_correct: true },
      { id: 'b', text: 'c < b < a', is_correct: false },
      { id: 'c', text: 'b < c < a', is_correct: false },
      { id: 'd', text: 'c < a < b', is_correct: false }
    ],
    answer: { correct_option: 'a', explanation: 'Heat of combustion inversely proportional to stability. More branched = more stable = lower heat of combustion.' },
    solution: { text_markdown: `In the isomers of hydrocarbon, heat of combustion depend upon their stability. With the increase in stability, heat of combustion decrease.\n\nAs, **stability** a > b > c\n\nTherefore, **heat of combustion** c > b > a\n\nAnswer: **(a)**`, latex_validated: true },
    metadata: { difficulty: 'Easy', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_1', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2022, month: 'July', day: 27, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 90
  },
  // Q54 -> HC-049
  {
    _id: uuidv4(), display_id: 'HC-049',
    question_text: { markdown: `Arrange the following compounds in increasing order of their boiling points:\n\n(A) ![A](image)\n(B) ![B](image)\n(C) ![C](image)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: 'C < B < A', is_correct: true },
      { id: 'b', text: 'A < B < C', is_correct: false },
      { id: 'c', text: 'B < C < A', is_correct: false },
      { id: 'd', text: 'C < A < B', is_correct: false }
    ],
    answer: { correct_option: 'a', explanation: 'Boiling point inversely proportional to branching. More branched = lower boiling point.' },
    solution: { text_markdown: `**Boiling Point** $\\propto \\frac{1}{\\text{Branching}}$\n\nOrder: C < B < A\n\nAnswer: **(a)**`, latex_validated: true },
    metadata: { difficulty: 'Easy', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_1', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2022, month: 'July', day: 26, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 88
  },
  // Q55 -> HC-050
  {
    _id: uuidv4(), display_id: 'HC-050',
    question_text: { markdown: `Which of the following compounds will produce an optically inactive compound on catalytic hydrogenation?`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '![Option A](image)', is_correct: false },
      { id: 'b', text: '![Option B](image)', is_correct: true },
      { id: 'c', text: '![Option C](image)', is_correct: false },
      { id: 'd', text: '![Option D](image)', is_correct: false }
    ],
    answer: { correct_option: 'b', explanation: 'Compound B produces optically inactive compound on hydrogenation.' },
    solution: { text_markdown: `Compound B produces optically inactive compound on hydrogenation.\n\n![Analysis](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-21.jpg?height=198&width=553&top_left_y=660&top_left_x=1253)\n\nAnswer: **(b)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2022, month: 'July', day: 25, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85
  },
  // Q56 -> HC-051
  {
    _id: uuidv4(), display_id: 'HC-051',
    question_text: { markdown: `The total number of monohalogenated products (excluding stereoisomers) obtained from the following reaction is $\\underline{\\hspace{2cm}}$.\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-07.jpg?height=141&width=488&top_left_y=857&top_left_x=1316)`, latex_validated: true },
    type: 'NVT',
    options: [],
    answer: { correct_option: null, numerical_value: 8, explanation: 'Count all unique positions for chlorination on the given structure.' },
    solution: { text_markdown: `![Products](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-21.jpg?height=379&width=452&top_left_y=970&top_left_x=1316)\n\nSo, total **8** number of monohalogenated products will form.\n\nAnswer: **8**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_1', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2022, month: 'June', day: 29, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85
  },
  // Q57 -> HC-052
  {
    _id: uuidv4(), display_id: 'HC-052',
    question_text: { markdown: `The major product of the following reaction is:\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-07.jpg?height=151&width=571&top_left_y=1386&top_left_x=1314)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '![Option A](image)', is_correct: false },
      { id: 'b', text: '![Option B](image)', is_correct: false },
      { id: 'c', text: '![Option C](image)', is_correct: true },
      { id: 'd', text: '![Option D](image)', is_correct: false }
    ],
    answer: { correct_option: 'c', explanation: 'Hydroboration-oxidation gives anti-Markovnikov product.' },
    solution: { text_markdown: `Hydroboration-oxidation reaction mechanism.\n\nAnswer: **(c)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2022, month: 'June', day: 29, shift: 'Shift-I' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 88
  },
  // Q58 -> HC-053
  {
    _id: uuidv4(), display_id: 'HC-053',
    question_text: { markdown: `The major product of the following reaction is:\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-07.jpg?height=275&width=655&top_left_y=1778&top_left_x=1257)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '![Option A](image)', is_correct: false },
      { id: 'b', text: '![Option B](image)', is_correct: false },
      { id: 'c', text: '![Option C](image)', is_correct: true },
      { id: 'd', text: '![Option D](image)', is_correct: false }
    ],
    answer: { correct_option: 'c', explanation: 'Hydration of alkyne gives ketone via enol intermediate.' },
    solution: { text_markdown: `Hydration of alkyne mechanism.\n\nAnswer: **(c)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2022, month: 'June', day: 28, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85
  },
  // Q59 -> HC-054
  {
    _id: uuidv4(), display_id: 'HC-054',
    question_text: { markdown: `The major product of the following reaction is:\n\n![Reaction](image)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '![Option A](image)', is_correct: true },
      { id: 'b', text: '![Option B](image)', is_correct: false },
      { id: 'c', text: '![Option C](image)', is_correct: false },
      { id: 'd', text: '![Option D](image)', is_correct: false }
    ],
    answer: { correct_option: 'a', explanation: 'Electrophilic addition to conjugated diene.' },
    solution: { text_markdown: `Electrophilic addition mechanism.\n\nAnswer: **(a)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2022, month: 'June', day: 27, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85
  },
  // Q60 -> HC-055
  {
    _id: uuidv4(), display_id: 'HC-055',
    question_text: { markdown: `The major product of the following reaction is:\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-08.jpg?height=248&width=795&top_left_y=2253&top_left_x=1289)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '![Option A](image)', is_correct: false },
      { id: 'b', text: '![Option B](image)', is_correct: true },
      { id: 'c', text: '![Option C](image)', is_correct: false },
      { id: 'd', text: '![Option D](image)', is_correct: false }
    ],
    answer: { correct_option: 'b', explanation: 'Addition of HBr in excess leads to hydrolysis or addition according to Markovnikov rule.' },
    solution: { text_markdown: `Addition of HBr in excess leads to hydrolysis of $-\\ce{OCH3}$ group or addition of HBr to alkene according to Markovnikov's rule.\n\nAnswer: **(b)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2022, month: 'June', day: 26, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85
  },
  // Q61 -> HC-056
  {
    _id: uuidv4(), display_id: 'HC-056',
    question_text: { markdown: `In the following reaction, which of the following structures is the most favourable for compound (A)?\n\n![Reaction](image)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '![Option A](image)', is_correct: false },
      { id: 'b', text: '![Option B](image)', is_correct: true },
      { id: 'c', text: '![Option C](image)', is_correct: false },
      { id: 'd', text: '![Option D](image)', is_correct: false }
    ],
    answer: { correct_option: 'b', explanation: 'Formation of allyl radical promotes hydrogen replacement easily.' },
    solution: { text_markdown: `Formation of allyl radical will promote a hydrogen to replace easily.\n\nAnswer: **(b)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_1', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2022, month: 'June', day: 25, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85
  },
  // Q62 -> HC-057
  {
    _id: uuidv4(), display_id: 'HC-057',
    question_text: { markdown: `The major product of the following reaction is:\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-08.jpg?height=219&width=515&top_left_y=248&top_left_x=343)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '![Option A](image)', is_correct: true },
      { id: 'b', text: '![Option B](image)', is_correct: false },
      { id: 'c', text: '![Option C](image)', is_correct: false },
      { id: 'd', text: '![Option D](image)', is_correct: false }
    ],
    answer: { correct_option: 'a', explanation: 'Due to higher electron withdrawing nature of CF₃ group, follows anti-Markovnikov product.' },
    solution: { text_markdown: `Due to higher $\\ce{e-}$ withdrawing nature of $\\ce{CF3}$ group. It follow anti-markovnikov's product.\n\nAnswer: **(a)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2022, month: 'June', day: 24, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 88
  }
];

async function run() {
  console.log('\n=== HYDROCARBONS BATCH 2: Q33-62 (HC-028 to HC-057) ===\n');
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('questions_v2');
    
    for (const q of questions) {
      await collection.insertOne(q);
      console.log(`✅ Inserted ${q.display_id} (${q.metadata.exam_source.year})`);
    }
    
    console.log(`\n✅ Successfully inserted ${questions.length} questions (Batch 2)`);
    console.log(`📊 Progress: HC-001 to HC-057 complete (57 questions)`);
    console.log(`⏭️  Remaining: 52 questions (HC-058 to HC-109)`);
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
