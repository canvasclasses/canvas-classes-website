// Hydrocarbons - Batch 3: MD Questions 63-92 (HC-058 to HC-087) - 30 questions
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const questions = [
  // Q63 -> HC-058
  {
    _id: uuidv4(), display_id: 'HC-058',
    question_text: { markdown: `The major product of the following reaction is:\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-08.jpg?height=508&width=668&top_left_y=735&top_left_x=280)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '![Option A](image)', is_correct: false },
      { id: 'b', text: '![Option B](image)', is_correct: true },
      { id: 'c', text: '![Option C](image)', is_correct: false },
      { id: 'd', text: '![Option D](image)', is_correct: false }
    ],
    answer: { correct_option: 'b', explanation: 'Electrophilic addition followed by enolization gives phenol.' },
    solution: { text_markdown: `In presence of HBr, reactant containing C-C double bond undergoes electrophilic addition reaction and gives substituted alkyl halide. On further reaction with alc. KOH, α,β-elimination takes place that gives corresponding diene. The diene undergoes enolisation to give stable product (phenol).\n\nAnswer: **(b)**`, latex_validated: true },
    metadata: { difficulty: 'Hard', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2022, month: 'June', day: 24, shift: 'Shift-I' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85
  },
  // Q64 -> HC-059
  {
    _id: uuidv4(), display_id: 'HC-059',
    question_text: { markdown: `The major product of the following reaction is:\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-08.jpg?height=137&width=508&top_left_y=1352&top_left_x=291)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '![Option A](image)', is_correct: false },
      { id: 'b', text: '![Option B](image)', is_correct: true },
      { id: 'c', text: '![Option C](image)', is_correct: false },
      { id: 'd', text: '![Option D](image)', is_correct: false }
    ],
    answer: { correct_option: 'b', explanation: 'Addition of Cl₂ followed by six-membered ring formation.' },
    solution: { text_markdown: `(i) Addition of $\\ce{Cl2}$\n(ii) Six-membered ring formation\n\nAnswer: **(b)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2021, month: 'Sept', day: 2, shift: 'Shift-I' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85
  },
  // Q65 -> HC-060
  {
    _id: uuidv4(), display_id: 'HC-060',
    question_text: { markdown: `The major product of the following reaction is:\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-08.jpg?height=420&width=831&top_left_y=1972&top_left_x=289)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '![Option A](image)', is_correct: true },
      { id: 'b', text: '![Option B](image)', is_correct: false },
      { id: 'c', text: '![Option C](image)', is_correct: false },
      { id: 'd', text: '![Option D](image)', is_correct: false }
    ],
    answer: { correct_option: 'a', explanation: 'Ozonolysis followed by reduction gives aldehydes/ketones.' },
    solution: { text_markdown: `Ozonolysis reaction mechanism.\n\nAnswer: **(a)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_4', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2021, month: 'Aug', day: 31, shift: 'Shift-I' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85
  },
  // Q66 -> HC-061
  {
    _id: uuidv4(), display_id: 'HC-061',
    question_text: { markdown: `The major product of the following reaction is:\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-08.jpg?height=148&width=743&top_left_y=2384&top_left_x=339)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '![Option A](image)', is_correct: false },
      { id: 'b', text: '![Option B](image)', is_correct: false },
      { id: 'c', text: '![Option C](image)', is_correct: false },
      { id: 'd', text: '![Option D](image)', is_correct: true }
    ],
    answer: { correct_option: 'd', explanation: 'Addition of HCl to double bond according to Markovnikov addition.' },
    solution: { text_markdown: `Addition of HCl of double bond according to Markov addition.\n\nAnswer: **(d)**`, latex_validated: true },
    metadata: { difficulty: 'Easy', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2021, month: 'Aug', day: 27, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 88
  },
  // Q67 -> HC-062
  {
    _id: uuidv4(), display_id: 'HC-062',
    question_text: { markdown: `The major product of the following reaction is:\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-09.jpg?height=141&width=503&top_left_y=201&top_left_x=1314)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '![Option A](image)', is_correct: false },
      { id: 'b', text: '![Option B](image)', is_correct: false },
      { id: 'c', text: '![Option C](image)', is_correct: false },
      { id: 'd', text: '![Option D](image)', is_correct: true }
    ],
    answer: { correct_option: 'd', explanation: 'Hydroboration-oxidation gives anti-Markovnikov alcohol.' },
    solution: { text_markdown: `Hydroboration-oxidation mechanism.\n\nAnswer: **(d)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2021, month: 'Aug', day: 26, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85
  },
  // Q68 -> HC-063
  {
    _id: uuidv4(), display_id: 'HC-063',
    question_text: { markdown: `The major product of the following reaction is:\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-09.jpg?height=348&width=644&top_left_y=515&top_left_x=1307)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '![Option A](image)', is_correct: false },
      { id: 'b', text: '![Option B](image)', is_correct: false },
      { id: 'c', text: '![Option C](image)', is_correct: true },
      { id: 'd', text: '![Option D](image)', is_correct: false }
    ],
    answer: { correct_option: 'c', explanation: 'Ozonolysis followed by oxidation gives carboxylic acids.' },
    solution: { text_markdown: `Ozonolysis with oxidative workup.\n\nAnswer: **(c)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_4', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2021, month: 'Aug', day: 26, shift: 'Shift-I' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85
  },
  // Q69 -> HC-064
  {
    _id: uuidv4(), display_id: 'HC-064',
    question_text: { markdown: `4 g of $\\ce{NaNH2}$ is reacted with 1 mole of propyne. The volume of $\\ce{NH3}$ gas liberated at STP is $\\underline{\\hspace{2cm}}$ mL.`, latex_validated: true },
    type: 'NVT',
    options: [],
    answer: { correct_option: null, numerical_value: 2240, explanation: 'Calculate moles of NaNH₂, then moles of NH₃ produced, then volume at STP.' },
    solution: { text_markdown: `$$\\ce{CH3-C#CH + Na -> CH3-C#C-Na+ + 1/2 H2}$$\n\n$$\\ce{CH3-C#CH + NaNH2 -> CH3-C#C-Na+ + NH3}$$\n\n$(4\\ \\text{g} = \\frac{4}{40} = 0.1\\ \\text{mole})$\n\nAs, 1 mole of propyne liberates = 1 mole of $\\ce{NH3}$\n\n∴ 0.1 mole of propyne liberates = 0.1 mole of $\\ce{NH3}$\n\nAt STP, 1 mole of any gas occupies = 22.4 L (22,400 mL)\n\n∴ 0.1 mole of $\\ce{NH3}$ gas occupies = 2.24 L = **2,240 mL**\n\nAnswer: **2240**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2021, month: 'July', day: 27, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 88
  },
  // Q70 -> HC-065
  {
    _id: uuidv4(), display_id: 'HC-065',
    question_text: { markdown: `The major product of the following reaction is:\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-09.jpg?height=291&width=474&top_left_y=1522&top_left_x=1257)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '![Option A](image)', is_correct: false },
      { id: 'b', text: '![Option B](image)', is_correct: false },
      { id: 'c', text: '![Option C](image)', is_correct: true },
      { id: 'd', text: '![Option D](image)', is_correct: false }
    ],
    answer: { correct_option: 'c', explanation: 'Hydration of alkyne gives ketone.' },
    solution: { text_markdown: `Hydration of alkyne mechanism.\n\nAnswer: **(c)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2021, month: 'July', day: 27, shift: 'Shift-I' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85
  },
  // Q71 -> HC-066
  {
    _id: uuidv4(), display_id: 'HC-066',
    question_text: { markdown: `The major product of the following reaction is:\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-09.jpg?height=114&width=443&top_left_y=1857&top_left_x=1257)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '![Option A](image)', is_correct: false },
      { id: 'b', text: '![Option B](image)', is_correct: false },
      { id: 'c', text: '![Option C](image)', is_correct: false },
      { id: 'd', text: '![Option D](image)', is_correct: true }
    ],
    answer: { correct_option: 'd', explanation: 'Partial hydrogenation of alkyne gives alkene, then ozonolysis.' },
    solution: { text_markdown: `$$\\ce{CH3C#CH ->[H2][Pd/C] CH3CH=CH2}$$\n\nThen ozonolysis gives $\\ce{CH3CHO + HCHO}$\n\nAnswer: **(d)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_4', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2021, month: 'July', day: 22, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85
  },
  // Q72 -> HC-067
  {
    _id: uuidv4(), display_id: 'HC-067',
    question_text: { markdown: `A compound gives only one monobromo derivative on treatment with $\\ce{Br2}$ and light. The same compound on treatment with $\\ce{H2}$ in the presence of Pt catalyst gives a product that has four $\\pi$-electrons. The total number of $\\pi$-electrons present in the original compound is $\\underline{\\hspace{2cm}}$.`, latex_validated: true },
    type: 'NVT',
    options: [],
    answer: { correct_option: null, numerical_value: 8, explanation: 'Compound has 4 π-bonds initially (8 π-electrons), hydrogenation removes all to give 4 π-electrons in benzene ring.' },
    solution: { text_markdown: `The compound gives only one monobromo derivative, which means all hydrogen atoms are equivalent. The compound takes up four moles of hydrogen per mole for complete hydrogenation. Each mole of $\\ce{H2}$ adds to one π-bond in an unsaturated system.\n\nIf 4 moles of $\\ce{H2}$ are required, the compound initially contained 4 π-bonds.\n\nEach π-bond consists of two π-electrons.\n\nIf the molecule has 4 π-bonds, the total number of π-electrons is: $4 \\times 2 = 8$\n\nAnswer: **8**`, latex_validated: true },
    metadata: { difficulty: 'Hard', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_3', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2021, month: 'July', day: 20, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85
  },
  // Q73 -> HC-068
  {
    _id: uuidv4(), display_id: 'HC-068',
    question_text: { markdown: `The major product of the following reaction is:\n\n$$\\ce{CH3-C#CH ->[Na] A ->[CH3CH2CH2-Br] B}$$`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '$\\ce{CH3-C#C-CH2CH2CH3}$', is_correct: true },
      { id: 'b', text: '$\\ce{CH3-CH2-C#C-CH2CH3}$', is_correct: false },
      { id: 'c', text: '$\\ce{CH3-C#C-CH3}$', is_correct: false },
      { id: 'd', text: '$\\ce{CH3-CH2-C#CH}$', is_correct: false }
    ],
    answer: { correct_option: 'a', explanation: 'Sodium acetylide formation followed by alkylation.' },
    solution: { text_markdown: `$$\\ce{CH3-C#CH ->[Na] CH3-C#C-Na+ ->[CH3CH2CH2-Br] NaBr + CH3-C#C-CH2CH2CH3}$$\n\nAnswer: **(a)**`, latex_validated: true },
    metadata: { difficulty: 'Easy', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2021, month: 'March', day: 18, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 88
  },
  // Q74 -> HC-069
  {
    _id: uuidv4(), display_id: 'HC-069',
    question_text: { markdown: `The major product of the following reaction is:\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-09.jpg?height=117&width=569&top_left_y=316&top_left_x=366)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '![Option A](image)', is_correct: true },
      { id: 'b', text: '![Option B](image)', is_correct: false },
      { id: 'c', text: '![Option C](image)', is_correct: false },
      { id: 'd', text: '![Option D](image)', is_correct: false }
    ],
    answer: { correct_option: 'a', explanation: 'Lindlar catalyst gives cis-alkene.' },
    solution: { text_markdown: `Lindlar catalyst gives cis-alkene.\n\nAnswer: **(a)**`, latex_validated: true },
    metadata: { difficulty: 'Easy', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2021, month: 'March', day: 17, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 88
  },
  // Q75 -> HC-070
  {
    _id: uuidv4(), display_id: 'HC-070',
    question_text: { markdown: `The number of oxygen atoms present in the product P obtained from the following reaction is $\\underline{\\hspace{2cm}}$.\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-09.jpg?height=395&width=557&top_left_y=662&top_left_x=373)`, latex_validated: true },
    type: 'NVT',
    options: [],
    answer: { correct_option: null, numerical_value: 2, explanation: 'Na/liq. NH₃ gives trans alkene, then ozonolysis gives 2 oxygen atoms in product.' },
    solution: { text_markdown: `$\\ce{Na/liq. NH3}$ gives trans alkene.\n\n![Mechanism](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-23.jpg?height=395&width=557&top_left_y=662&top_left_x=373)\n\nHence, **2** oxygen atoms are present in Product P.\n\nAnswer: **2**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_4', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2021, month: 'March', day: 17, shift: 'Shift-I' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85
  },
  // Q76 -> HC-071
  {
    _id: uuidv4(), display_id: 'HC-071',
    question_text: { markdown: `Given below are two statements:\n\n**Statement I:** The C-C bond length in ethyne is shorter than that in ethene.\n\n**Statement II:** Ethyne is linear while ethene is planar.\n\nIn the light of the above statements, choose the correct answer from the options given below:`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: 'Both Statement I and Statement II are false', is_correct: false },
      { id: 'b', text: 'Statement I is false but Statement II is true', is_correct: false },
      { id: 'c', text: 'Both Statement I and Statement II are true', is_correct: false },
      { id: 'd', text: 'Statement I is true but Statement II is false', is_correct: true }
    ],
    answer: { correct_option: 'd', explanation: 'Statement I is true (C-C bond in ethyne is shorter). Statement II is false (both are planar, ethyne is also linear).' },
    solution: { text_markdown: `The C-C bonds in ethyne are much stronger than that in ethene, since they are shorter than that in ethene.\n\nThe structure of ethyne is $\\ce{HC#C-H}$. Thus, ethyne is linear and C-atoms are sp-hybridised.\n\nAnswer: **(d)**`, latex_validated: true },
    metadata: { difficulty: 'Easy', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_3', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2021, month: 'March', day: 16, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 88
  },
  // Q77 -> HC-072
  {
    _id: uuidv4(), display_id: 'HC-072',
    question_text: { markdown: `Given below are two statements:\n\n**Statement I:** But-2-yne gives But-2-ene on treatment with $\\ce{Na/liq. NH3}$.\n\n**Statement II:** But-2-yne gives But-1-ene on treatment with Lindlar's catalyst.\n\nIn the light of the above statements, choose the most appropriate answer from the options given below:`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: 'Both Statement I and Statement II are correct', is_correct: false },
      { id: 'b', text: 'Statement I is correct but Statement II is incorrect', is_correct: false },
      { id: 'c', text: 'Both Statement I and Statement II are incorrect', is_correct: false },
      { id: 'd', text: 'Statement I is incorrect but Statement II is correct', is_correct: false }
    ],
    answer: { correct_option: null, explanation: 'Bonus question - Statement I gives trans-but-2-ene (correct), Statement II gives cis-but-2-ene not but-1-ene (incorrect).' },
    solution: { text_markdown: `Trans alkene (B) $\\ce{<-[Na][liq. NH3] CH3-C#C-CH3 ->[Pd/C][H2]}$ cis alkene (A)\n\n- Boiling point of cis alkene > Trans alkene and melting point of trans alkene > cis alkene.\n- Polarity of cis alkene > Trans alkene. But dipole moment of cis alkene is not equal to zero.\n- Addition of $\\ce{Br2}$ will be anti-addition so trans can give meso product and cis can give racemic mixture.\n\nNTA answer key → (*)\n\nPW answer key → [Bonus Q.]\n\nAnswer: **Bonus**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2021, month: 'March', day: 16, shift: 'Shift-I' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85
  },
  // Q78 -> HC-073
  {
    _id: uuidv4(), display_id: 'HC-073',
    question_text: { markdown: `The major product of the following reaction is:\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-09.jpg?height=406&width=596&top_left_y=1746&top_left_x=348)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '![Option A](image)', is_correct: false },
      { id: 'b', text: '![Option B](image)', is_correct: true },
      { id: 'c', text: '![Option C](image)', is_correct: false },
      { id: 'd', text: '![Option D](image)', is_correct: false }
    ],
    answer: { correct_option: 'b', explanation: 'Ozonolysis of alkyne gives diketone.' },
    solution: { text_markdown: `Ozonolysis of alkyne mechanism.\n\nAnswer: **(b)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_4', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2021, month: 'Feb', day: 26, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85
  },
  // Q79 -> HC-074
  {
    _id: uuidv4(), display_id: 'HC-074',
    question_text: { markdown: `Lindlar's catalyst is:`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: 'Partially deactivated palladised charcoal', is_correct: true },
      { id: 'b', text: 'Partially deactivated platinum', is_correct: false },
      { id: 'c', text: 'Partially deactivated iron', is_correct: false },
      { id: 'd', text: 'Partially deactivated nickel', is_correct: false }
    ],
    answer: { correct_option: 'a', explanation: 'Lindlar\'s reagent is partially deactivated palladised charcoal.' },
    solution: { text_markdown: `Lindlar's reagent is **partially deactivated palladised charcoal**.\n\nAnswer: **(a)**`, latex_validated: true },
    metadata: { difficulty: 'Easy', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2021, month: 'Feb', day: 25, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 88
  },
  // Q80 -> HC-075
  {
    _id: uuidv4(), display_id: 'HC-075',
    question_text: { markdown: `Which of the following aldehydes cannot be prepared by Rosenmund's reduction?`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '$\\ce{CH3-CH2-CHO}$', is_correct: true },
      { id: 'b', text: '$\\ce{CH3-CHO}$', is_correct: false },
      { id: 'c', text: '$\\ce{HCHO}$', is_correct: false },
      { id: 'd', text: 'Benzaldehyde', is_correct: false }
    ],
    answer: { correct_option: 'a', explanation: 'CH₃-CH₂-CHO cannot be prepared by Rosenmund reduction as the corresponding acid chloride is not stable.' },
    solution: { text_markdown: `![Analysis](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-23.jpg?height=297&width=616&top_left_y=2226&top_left_x=346)\n\n$\\ce{CH3-CH2-CHO}$ can't be prepared by using above method.\n\nAnswer: **(a)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_4', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2021, month: 'Feb', day: 24, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85
  },
  // Q81 -> HC-076
  {
    _id: uuidv4(), display_id: 'HC-076',
    question_text: { markdown: `But-2-yne on reaction with $\\ce{Na/liq. NH3}$ forms trans-but-2-ene. The reagent used for the conversion of but-2-yne to cis-but-2-ene is:`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '$\\ce{NaBH4}$', is_correct: false },
      { id: 'b', text: '$\\ce{Li/NH3}$', is_correct: false },
      { id: 'c', text: '$\\ce{H2/Pd-C}$', is_correct: true },
      { id: 'd', text: '$\\ce{Sn-HCl}$', is_correct: false }
    ],
    answer: { correct_option: 'c', explanation: 'H₂/Pd-C (Lindlar catalyst) converts alkyne to cis-alkene.' },
    solution: { text_markdown: `In But-2-yne, due to the absence of acidic hydrogen, metallic sodium does not undergo reaction.\n\nFor cis-alkene formation, use **Lindlar catalyst** ($\\ce{H2/Pd-C}$).\n\nAnswer: **(c)**`, latex_validated: true },
    metadata: { difficulty: 'Easy', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2020, month: 'Sept', day: 6, shift: 'Shift-I' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 88
  },
  // Q82 -> HC-077
  {
    _id: uuidv4(), display_id: 'HC-077',
    question_text: { markdown: `In the following reaction, the number of $\\ce{sp^2}$ hybridised carbon atoms in compound 'X' is $\\underline{\\hspace{2cm}}$.\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-09.jpg?height=121&width=487&top_left_y=393&top_left_x=1262)`, latex_validated: true },
    type: 'NVT',
    options: [],
    answer: { correct_option: null, numerical_value: 7, explanation: 'Cyclic polymerization followed by Gattermann-Koch gives benzaldehyde derivative with 7 sp² carbons.' },
    solution: { text_markdown: `In the first step, cyclic polymerization will take place and in second one, Gattermann koch reaction will take place.\n\nNo. of $\\ce{sp^2}$ hybridised C = **7**\n\nAnswer: **7**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_3', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2020, month: 'Sept', day: 5, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85
  },
  // Q83 -> HC-078
  {
    _id: uuidv4(), display_id: 'HC-078',
    question_text: { markdown: `The major product of the following reaction is:\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-09.jpg?height=114&width=702&top_left_y=1074&top_left_x=1269)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '![Option A](image)', is_correct: true },
      { id: 'b', text: '![Option B](image)', is_correct: false },
      { id: 'c', text: '![Option C](image)', is_correct: false },
      { id: 'd', text: '![Option D](image)', is_correct: false }
    ],
    answer: { correct_option: 'a', explanation: 'Alkynes on treatment with Hg²⁺ and H₂O give ketones.' },
    solution: { text_markdown: `Alkynes on treatment with $\\ce{Hg^{2+}}$ and $\\ce{H2O}$ give ketones.\n\nAnswer: **(a)**`, latex_validated: true },
    metadata: { difficulty: 'Easy', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2020, month: 'Sept', day: 5, shift: 'Shift-I' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 88
  },
  // Q84 -> HC-079
  {
    _id: uuidv4(), display_id: 'HC-079',
    question_text: { markdown: `The major product of the following reaction is:\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-09.jpg?height=612&width=763&top_left_y=1341&top_left_x=1314)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '![Option A](image)', is_correct: false },
      { id: 'b', text: '![Option B](image)', is_correct: false },
      { id: 'c', text: '![Option C](image)', is_correct: false },
      { id: 'd', text: '![Option D](image)', is_correct: true }
    ],
    answer: { correct_option: 'd', explanation: 'Ozonolysis of alkyne gives diketone.' },
    solution: { text_markdown: `Ozonolysis mechanism.\n\nAnswer: **(d)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_4', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2020, month: 'Sept', day: 4, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85
  },
  // Q85 -> HC-080
  {
    _id: uuidv4(), display_id: 'HC-080',
    question_text: { markdown: `The major product (Y) in the following reaction is:\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-09.jpg?height=141&width=619&top_left_y=1950&top_left_x=1316)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '![Option A](image)', is_correct: false },
      { id: 'b', text: '![Option B](image)', is_correct: true },
      { id: 'c', text: '![Option C](image)', is_correct: false },
      { id: 'd', text: '![Option D](image)', is_correct: false }
    ],
    answer: { correct_option: 'b', explanation: 'Hydration of alkyne gives ketone as major product.' },
    solution: { text_markdown: `Hydration mechanism gives ketone as major product.\n\nAnswer: **(b)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2020, month: 'Sept', day: 4, shift: 'Shift-I' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85
  },
  // Q86 -> HC-081
  {
    _id: uuidv4(), display_id: 'HC-081',
    question_text: { markdown: `The total number of sp-hybridised carbon atoms present in the product (C) of the following reaction is $\\underline{\\hspace{2cm}}$.\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-09.jpg?height=142&width=441&top_left_y=2353&top_left_x=1362)`, latex_validated: true },
    type: 'NVT',
    options: [],
    answer: { correct_option: null, numerical_value: 13, explanation: 'Cyclic trimerization gives benzene ring, count sp carbons in product.' },
    solution: { text_markdown: `![Mechanism](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-23.jpg?height=142&width=441&top_left_y=2353&top_left_x=1362)\n\nAnswer: **13.00**`, latex_validated: true },
    metadata: { difficulty: 'Hard', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_3', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2020, month: 'Sept', day: 3, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 80
  },
  // Q87 -> HC-082
  {
    _id: uuidv4(), display_id: 'HC-082',
    question_text: { markdown: `Arrange the following in increasing order of acidity:\n\n(I) $\\ce{CH#CH}$\n(II) $\\ce{CH3-C#CH}$\n(III) $\\ce{CH2=CH2}$`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: 'III < I < II', is_correct: false },
      { id: 'b', text: 'I < II < III', is_correct: false },
      { id: 'c', text: 'II < III < I', is_correct: false },
      { id: 'd', text: 'III < II < I', is_correct: true }
    ],
    answer: { correct_option: 'd', explanation: 'Acidic strength depends on stability of conjugate base. sp > sp² > sp³ hybridization.' },
    solution: { text_markdown: `**Acidic strength** $\\propto$ stability of conjugate base\n\nE.N → sp carbon > $\\ce{sp^2}$ carbon > $\\ce{sp^3}$ carbon\n\n$$\\ce{CH#CH} > \\ce{CH3-C#CH} > \\ce{CH2=CH2}$$\n\nAnswer: **(d)**`, latex_validated: true },
    metadata: { difficulty: 'Easy', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_3', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2020, month: 'Sept', day: 3, shift: 'Shift-I' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 90
  },
  // Q88 -> HC-083
  {
    _id: uuidv4(), display_id: 'HC-083',
    question_text: { markdown: `The major product of the following reaction is:\n\n![Reaction](https://cdn.mathpix.com/cropped/7f992046-a881-40f4-801e-f73838d08313-10.jpg?height=73&width=569&top_left_y=382&top_left_x=352)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '![Option A](image)', is_correct: false },
      { id: 'b', text: '![Option B](image)', is_correct: true },
      { id: 'c', text: '![Option C](image)', is_correct: false },
      { id: 'd', text: '![Option D](image)', is_correct: false }
    ],
    answer: { correct_option: 'b', explanation: 'Grignard reaction followed by hydrolysis gives tertiary alcohol.' },
    solution: { text_markdown: `Grignard reaction mechanism.\n\nAnswer: **(b)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_4', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2020, month: 'Sept', day: 2, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85
  },
  // Q89 -> HC-084
  {
    _id: uuidv4(), display_id: 'HC-084',
    question_text: { markdown: `Which of the following compounds is/are aromatic in nature?\n\n![Compounds](image)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: 'A, C, D, E, H', is_correct: false },
      { id: 'b', text: 'A, B, D, E, H', is_correct: false },
      { id: 'c', text: 'A, C, D, E, F', is_correct: false },
      { id: 'd', text: 'A, C, D, E, H', is_correct: true }
    ],
    answer: { correct_option: 'd', explanation: 'Aromatic compounds satisfy planarity, complete delocalization, and Huckel\'s rule (4n+2 π electrons).' },
    solution: { text_markdown: `A compound is aromatic if it satisfies the following conditions:\n(i) Planarity\n(ii) Complete delocalisation of the π electrons in the ring\n(iii) Obey Huckle's rule $(4n+2\\pi)$ electrons.\n\nHence, among the given compounds, **Aromatic compounds** are: A, C, D, E, H\n\n**Not-aromatic compounds** are: B, F, G\n\nAnswer: **(d)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_5', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2020, month: 'Jan', day: 9, shift: 'Shift-I' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85
  },
  // Q90 -> HC-085
  {
    _id: uuidv4(), display_id: 'HC-085',
    question_text: { markdown: `Arrange the following compounds in the increasing order of stability:\n\n(p) ![p](image)\n(q) ![q](image)\n(r) ![r](image)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: 'r < p < q', is_correct: false },
      { id: 'b', text: 'q < r < p', is_correct: false },
      { id: 'c', text: 'p < r < q', is_correct: true },
      { id: 'd', text: 'p < q < r', is_correct: false }
    ],
    answer: { correct_option: 'c', explanation: 'Order of stability: aromatic > non-aromatic > anti-aromatic. Hence q > r > p.' },
    solution: { text_markdown: `Compound p is **anti-aromatic**.\n\nCompound q is **aromatic**.\n\nCompound r is **non-aromatic**.\n\nThe order of stability is: aromatic > non-aromatic > anti-aromatic.\n\nHence, **q > r > p**\n\nAnswer: **(c)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_5', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2020, month: 'Jan', day: 8, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 88
  },
  // Q91 -> HC-086
  {
    _id: uuidv4(), display_id: 'HC-086',
    question_text: { markdown: `Which one of the following is a meta directing group?`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '$-\\ce{OH}$', is_correct: false },
      { id: 'b', text: '$-\\ce{CN}$', is_correct: true },
      { id: 'c', text: '$-\\ce{Cl}$', is_correct: false },
      { id: 'd', text: '$-\\ce{CH3}$', is_correct: false }
    ],
    answer: { correct_option: 'b', explanation: '-CN is a meta directing group while -OH is an o/p directing group.' },
    solution: { text_markdown: `$-\\ce{CN}$ is a **meta directing group** while $-\\ce{OH}$ is an **o/p directing group**.\n\nHalogens ($\\ce{F, Cl, Br, I}$) are deactivating groups.\n\nAnswer: **(b)**`, latex_validated: true },
    metadata: { difficulty: 'Easy', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_5', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2020, month: 'Jan', day: 8, shift: 'Shift-I' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 90
  },
  // Q92 -> HC-087
  {
    _id: uuidv4(), display_id: 'HC-087',
    question_text: { markdown: `The number of isomers of $\\ce{C9H12}$ that can give two signals in $^1$H NMR and four signals in $^{13}$C NMR is $\\underline{\\hspace{2cm}}$.`, latex_validated: true },
    type: 'NVT',
    options: [],
    answer: { correct_option: null, numerical_value: 2, explanation: 'Two isomers of C₉H₁₂ satisfy the NMR signal conditions.' },
    solution: { text_markdown: `The above two isomers of $\\ce{C9H12}$ each possess four distinct positions available for aromatic electrophilic substitution reactions.\n\nAnswer: **2**`, latex_validated: true },
    metadata: { difficulty: 'Hard', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hydrocarbon_3', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2020, month: 'Jan', day: 7, shift: 'Shift-II' } },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 80
  }
];

async function run() {
  console.log('\n=== HYDROCARBONS BATCH 3: Q63-92 (HC-058 to HC-087) ===\n');
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('questions_v2');
    
    for (const q of questions) {
      await collection.insertOne(q);
      console.log(`✅ Inserted ${q.display_id} (${q.metadata.exam_source.year})`);
    }
    
    console.log(`\n✅ Successfully inserted ${questions.length} questions (Batch 3)`);
    console.log(`📊 Progress: HC-001 to HC-087 complete (87 questions)`);
    console.log(`⏭️  Remaining: 22 questions (HC-088 to HC-109)`);
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
