// Phase 1 buffer for ph12_nuclei — Class 12 Physics — Nuclear Physics (Batch 2: Q52-Q98)
// Source: user-supplied PDF pages + answer key. JEE Main PYQs.
// (M) = Morning = Shift-I, (E) = Evening = Shift-II.

const questions = [
  // ============ NUCL-052 (carryover with options now visible) ============

  // SRC: "You are given that Mass of 7/3 Li" | AK: 4 | PAGE: page1
  {
    display_id: 'NUCL-052',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'You are given that Mass of $^7_3 Li = 7.0160\\,u$\n\nMass of $^4_2 He = 4.0026\\,u$\n\nand Mass of $^1_1 H = 1.0079\\,u$\n\nWhen $20$ g of $^7_3 Li$ is converted into $^4_2 He$ by proton capture, the energy liberated, (in kWh), is: [Mass of nudeon $= 1\\,GeV/c^2$]' },
    options: [
      { id: 'a', text: '$4.5 \\times 10^5$', is_correct: false },
      { id: 'b', text: '$8 \\times 10^6$', is_correct: false },
      { id: 'c', text: '$6.82 \\times 10^5$', is_correct: false },
      { id: 'd', text: '$1.33 \\times 10^6$', is_correct: true }
    ],
    answer: { correct_option: 'd' },
    solution: null,
    tag_id: 'tag_nucl_5',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2020, month: 'Sep', shift: 'Shift-I' }
  },

  // ============ NUCLEAR REACTIONS (must-do continued) ============

  // SRC: "Match the LIST-I with LIST-II" | AK: 2 | PAGE: page1
  {
    display_id: 'NUCL-053',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'Match the LIST-I with LIST-II\n\n| | LIST-I | | LIST-II |\n|---|---|---|---|\n| A. | $^1_0 n + ^{235}_{92} U \\rightarrow ^{140}_{54} Xe + ^{94}_{38} Sr + 2 ^1_0 n$ | I. | Chemical reaction |\n| B. | $2 H_2 + O_2 \\rightarrow 2 H_2 O$ | II. | Fusion with +ve Q value |\n| C. | $^2_1 H + ^2_1 H \\rightarrow ^3_2 He + ^1_0 n$ | III. | Fission |\n| D. | $^1_1 H + ^3_1 H \\rightarrow ^2_1 H + ^2_1 H$ | IV. | Fusion with -ve Q value |\n\nChoose the correct answer from the options given below :' },
    options: [
      { id: 'a', text: 'A-II, B-I, C-III, D-IV', is_correct: false },
      { id: 'b', text: 'A-III, B-I, C-II, D-IV', is_correct: true },
      { id: 'c', text: 'A-II, B-I, C-IV, D-III', is_correct: false },
      { id: 'd', text: 'A-III, B-I, C-IV, D-II', is_correct: false }
    ],
    answer: { correct_option: 'b' },
    solution: null,
    tag_id: 'tag_nucl_5',
    questionNature: 'Conceptual',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2025, month: 'Apr', shift: 'Shift-I' }
  },

  // SRC: "If three helium nuclei combine to form a" | AK: 727 | PAGE: page1
  {
    display_id: 'NUCL-054',
    type: 'NVT',
    difficultyLevel: 3,
    question_text: { markdown: 'If three helium nuclei combine to form a carbon nucleus then the energy released in this reaction is _____ $\\times 10^{-2}$ MeV. (Given $1u = 931$ MeV/$c^2$, atomic mass of helium $= 4.002603 u$)' },
    options: [],
    answer: { integer_value: 727 },
    solution: null,
    tag_id: 'tag_nucl_5',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2024, month: 'Apr', shift: 'Shift-I' }
  },

  // SRC: "In a hypothetical fission reaction 92X236 ->" | AK: 2 | PAGE: page1
  {
    display_id: 'NUCL-055',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'In a hypothetical fission reaction\n\n$_{92} X^{236} \\rightarrow _{56} Y^{141} + _{36} Z^{92} + 3 R$. The identity of emitted particles ($R$) is :' },
    options: [
      { id: 'a', text: 'Electron', is_correct: false },
      { id: 'b', text: 'Neutron', is_correct: true },
      { id: 'c', text: '$\\gamma$-radiations', is_correct: false },
      { id: 'd', text: 'Proton', is_correct: false }
    ],
    answer: { correct_option: 'b' },
    solution: null,
    tag_id: 'tag_nucl_5',
    questionNature: 'Conceptual',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2024, month: 'Apr', shift: 'Shift-II' }
  },

  // SRC: "The energy released in the fusion of 2" | AK: 1 | PAGE: page1
  {
    display_id: 'NUCL-056',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'The energy released in the fusion of $2$ kg of hydrogen deep in the sun is $E_H$ and the energy released in the fission of $2$ kg of $^{235}U$ is $E_U$. The ratio $\\frac{E_H}{E_U}$ is approximately:\n\n(Consider the fusion reaction as $4|H + 2 e^- \\rightarrow ^4_2 He + 2v + 6\\gamma + 26.7$ MeV, energy released in the fission reaction of $^{235}U$ is $200$ MeV per fission nucleus and $N_A = 6.023 \\times 10^{23}$)' },
    options: [
      { id: 'a', text: '$7.62$', is_correct: true },
      { id: 'b', text: '$25.6$', is_correct: false },
      { id: 'c', text: '$15.04$', is_correct: false },
      { id: 'd', text: '$9.13$', is_correct: false }
    ],
    answer: { correct_option: 'a' },
    solution: null,
    tag_id: 'tag_nucl_5',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2024, month: 'Apr', shift: 'Shift-II' }
  },

  // SRC: "In a nuclear fission reaction of an isotope" | AK: 3 | PAGE: page1
  {
    display_id: 'NUCL-057',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'In a nuclear fission reaction of an isotope of mass $M$, three similar daughter nuclei of same mass are formed. The speed of a daughter nuclei in terms of mass defect $\\Delta M$ will be :' },
    options: [
      { id: 'a', text: '$\\sqrt{\\frac{2 c \\Delta M}{M}}$', is_correct: false },
      { id: 'b', text: '$\\frac{\\Delta M c^2}{3}$', is_correct: false },
      { id: 'c', text: '$c\\sqrt{\\frac{2 \\Delta M}{M}}$', is_correct: true },
      { id: 'd', text: '$c\\sqrt{\\frac{3 \\Delta M}{M}}$', is_correct: false }
    ],
    answer: { correct_option: 'c' },
    solution: null,
    tag_id: 'tag_nucl_5',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2024, month: 'Jan', shift: 'Shift-II' }
  },

  // ============ RADIOACTIVITY (must-do) ============

  // SRC: "A radioactive material P first decays into" | AK: 2 | PAGE: page1
  {
    display_id: 'NUCL-058',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'A radioactive material P first decays into Q and then Q decays to non-radioactive material R. Which of the following figure represents time dependent mass of P, Q and R ?' },
    options: [
      { id: 'a', text: 'Graph (1)', is_correct: false },
      { id: 'b', text: 'Graph (2)', is_correct: true },
      { id: 'c', text: 'Graph (3)', is_correct: false },
      { id: 'd', text: 'Graph (4)', is_correct: false }
    ],
    answer: { correct_option: 'b' },
    solution: null,
    tag_id: 'tag_nucl_4',
    questionNature: 'Graphical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2025, month: 'Apr', shift: 'Shift-II' }
  },

  // SRC: "A radioactive nucleus n2 has 3 times the" | AK: 4 | PAGE: page1
  {
    display_id: 'NUCL-059',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'A radioactive nucleus $n_2$ has $3$ times the decay constant as compared to the decay constant of another radioactive nucleus $n_1$. If initial number of both nuclei are the same, what is the ratio of number of nuclei of $n_2$ to the number of nuclei of $n_1$, after one half-life of $n_1$?' },
    options: [
      { id: 'a', text: '$1/8$', is_correct: false },
      { id: 'b', text: '$8$', is_correct: false },
      { id: 'c', text: '$4$', is_correct: false },
      { id: 'd', text: '$1/4$', is_correct: true }
    ],
    answer: { correct_option: 'd' },
    solution: null,
    tag_id: 'tag_nucl_4',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2025, month: 'Jan', shift: 'Shift-I' }
  },

  // SRC: "The decay constant for a radioactive nuclide is" | AK: 15 | PAGE: page1
  {
    display_id: 'NUCL-060',
    type: 'NVT',
    difficultyLevel: 3,
    question_text: { markdown: 'The decay constant for a radioactive nuclide is $1.5 \\times 10^{-5}$ s$^{-1}$. Atomic weight of the substance is $60$ g mole$^{-1}$, $N_A = 6 \\times 10^{23}$. The activity of $1.0\\,\\mu g$ of the substance is _____ $\\times 10^{10}$ Bq.' },
    options: [],
    answer: { integer_value: 15 },
    solution: null,
    tag_id: 'tag_nucl_4',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2023, month: 'Apr', shift: 'Shift-I' }
  },

  // SRC: "Consider the following radioactive decay process: 218/84" | AK: 3 | PAGE: page1
  {
    display_id: 'NUCL-061',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'Consider the following radioactive decay process:\n\n$^{218}_{84} A \\xrightarrow{\\alpha} A_1 \\xrightarrow{\\beta^-} A_2 \\xrightarrow{\\gamma} A_3 \\xrightarrow{\\alpha} A_4 \\xrightarrow{\\beta^+} A_5 \\xrightarrow{\\gamma} A_6$\n\nThe mass number and the atomic number of $A_6$ are given by:' },
    options: [
      { id: 'a', text: '$210$ and $82$', is_correct: false },
      { id: 'b', text: '$210$ and $84$', is_correct: false },
      { id: 'c', text: '$210$ and $80$', is_correct: true },
      { id: 'd', text: '$211$ and $80$', is_correct: false }
    ],
    answer: { correct_option: 'c' },
    solution: null,
    tag_id: 'tag_nucl_3',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2023, month: 'Jan', shift: 'Shift-I' }
  },

  // SRC: "A radioactive element 242/92 X emits two alpha-particles" | AK: 87 | PAGE: page1
  {
    display_id: 'NUCL-062',
    type: 'NVT',
    difficultyLevel: 3,
    question_text: { markdown: 'A radioactive element $^{242}_{92} X$ emits two $\\alpha$-particles, one electron and two positrons. The product nucleus is represented by $^{234}_P Y$. The value of $P$ is _____.' },
    options: [],
    answer: { integer_value: 87 },
    solution: null,
    tag_id: 'tag_nucl_3',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2023, month: 'Jan', shift: 'Shift-I' }
  },

  // SRC: "Substance A has atomic mass number 16 and" | AK: 1 | PAGE: page1
  {
    display_id: 'NUCL-063',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'Substance $A$ has atomic mass number $16$ and half life of $1$ day. Another substance $B$ has atomic mass number $32$ and half life of $\\frac{1}{2}$ day. If both $A$ and $B$ simultaneously start undergo radio activity at the same time with initial mass $320$ g each, how many total atoms of $A$ and $B$ combined would be left after $2$ days' },
    options: [
      { id: 'a', text: '$3.38 \\times 10^{24}$', is_correct: true },
      { id: 'b', text: '$6.76 \\times 10^{24}$', is_correct: false },
      { id: 'c', text: '$6.76 \\times 10^{23}$', is_correct: false },
      { id: 'd', text: '$1.69 \\times 10^{24}$', is_correct: false }
    ],
    answer: { correct_option: 'a' },
    solution: null,
    tag_id: 'tag_nucl_4',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2023, month: 'Jan', shift: 'Shift-II' }
  },

  // SRC: "A radioactive nucleus decays by two different process" | AK: 300 | PAGE: page2
  {
    display_id: 'NUCL-064',
    type: 'NVT',
    difficultyLevel: 3,
    question_text: { markdown: 'A radioactive nucleus decays by two different process. The half life of the first process is $5$ minutes and that of the second process is $30$ s. The effective half-life of the nucleus is calculated to be $\\frac{\\alpha}{11}$ s. The value of $\\alpha$ is _____.' },
    options: [],
    answer: { integer_value: 300 },
    solution: null,
    tag_id: 'tag_nucl_4',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2023, month: 'Jan', shift: 'Shift-II' }
  },

  // SRC: "The disintegration rate of a certain radioactive sample" | AK: 3 | PAGE: page2
  {
    display_id: 'NUCL-065',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'The disintegration rate of a certain radioactive sample at any instant is $4250$ disintegrations per minute. $10$ minutes later, the rate becomes $2250$ disintegrations per minute. The approximate decay constant is (Take $\\log_e 1.88 = 0.63$)' },
    options: [
      { id: 'a', text: '$0.02$ min$^{-1}$', is_correct: false },
      { id: 'b', text: '$2.7$ min$^{-1}$', is_correct: false },
      { id: 'c', text: '$0.063$ min$^{-1}$', is_correct: true },
      { id: 'd', text: '$6.3$ min$^{-1}$', is_correct: false }
    ],
    answer: { correct_option: 'c' },
    solution: null,
    tag_id: 'tag_nucl_4',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2022, month: 'Jul', shift: 'Shift-I' }
  },

  // SRC: "What is the half-life period of a radioactive" | AK: 3 | PAGE: page2
  {
    display_id: 'NUCL-066',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'What is the half-life period of a radioactive material if its activity drops to $\\frac{1}{16^{th}}$ of its initial value of $30$ years ?' },
    options: [
      { id: 'a', text: '$9.5$ years', is_correct: false },
      { id: 'b', text: '$8.5$ years', is_correct: false },
      { id: 'c', text: '$7.5$ years', is_correct: true },
      { id: 'd', text: '$10.5$ years', is_correct: false }
    ],
    answer: { correct_option: 'c' },
    solution: null,
    tag_id: 'tag_nucl_4',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2022, month: 'Jul', shift: 'Shift-I' }
  },

  // SRC: "The activity of a radioactive material is 6.4" | AK: 4 | PAGE: page2
  {
    display_id: 'NUCL-067',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'The activity of a radioactive material is $6.4 \\times 10^{-4}$ curie. Its half life is $5$ days. The activity will become $5 \\times 10^{-6}$ curie after' },
    options: [
      { id: 'a', text: '$7$ days', is_correct: false },
      { id: 'b', text: '$15$ days', is_correct: false },
      { id: 'c', text: '$25$ days', is_correct: false },
      { id: 'd', text: '$35$ days', is_correct: true }
    ],
    answer: { correct_option: 'd' },
    solution: null,
    tag_id: 'tag_nucl_4',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2022, month: 'Jul', shift: 'Shift-II' }
  },

  // SRC: "A freshly prepared radioactive source of half life" | AK: 15 | PAGE: page2
  {
    display_id: 'NUCL-068',
    type: 'NVT',
    difficultyLevel: 3,
    question_text: { markdown: 'A freshly prepared radioactive source of half life $2$ hours $30$ minutes emits radiation which is $64$ times the permissible safe level. The minimum time, after which it would be possible to work safely with source, will be _____ hours.' },
    options: [],
    answer: { integer_value: 15 },
    solution: null,
    tag_id: 'tag_nucl_4',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2022, month: 'Jul', shift: 'Shift-I' }
  },

  // SRC: "A radioactive sample decays 7/8 times its original" | AK: 1 | PAGE: page2
  {
    display_id: 'NUCL-069',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'A radioactive sample decays $\\frac{7}{8}$ times its original quantity in $15$ minutes. The half-life of the sample is' },
    options: [
      { id: 'a', text: '$5$ min', is_correct: true },
      { id: 'b', text: '$7.5$ min', is_correct: false },
      { id: 'c', text: '$15$ min', is_correct: false },
      { id: 'd', text: '$30$ min', is_correct: false }
    ],
    answer: { correct_option: 'a' },
    solution: null,
    tag_id: 'tag_nucl_4',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2022, month: 'Jul', shift: 'Shift-II' }
  },

  // SRC: "Two radioactive materials A and B have decay" | AK: 9 | PAGE: page2
  {
    display_id: 'NUCL-070',
    type: 'NVT',
    difficultyLevel: 3,
    question_text: { markdown: 'Two radioactive materials $A$ and $B$ have decay constants $25\\lambda$ and $16\\lambda$ respectively. If initially they have the same number of nuclei, then the ratio of the number of nuclei of $B$ to that of $A$ will be "$e$" after a time $\\frac{1}{a\\lambda}$. The value of $a$ is _____.' },
    options: [],
    answer: { integer_value: 9 },
    solution: null,
    tag_id: 'tag_nucl_4',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2022, month: 'Jul', shift: 'Shift-II' }
  },

  // SRC: "A sample contains 10^-2 kg each of two" | AK: 25 | PAGE: page2
  {
    display_id: 'NUCL-071',
    type: 'NVT',
    difficultyLevel: 3,
    question_text: { markdown: 'A sample contains $10^{-2}$ kg each of two substances $A$ and $B$ with half lives $4$ s and $8$ s respectively. The ratio of their atomic weights is $1 : 2$. The ratio of the amounts of $A$ and $B$ after $16$ s is $\\frac{x}{100}$. The value of $x$ is _____.' },
    options: [],
    answer: { integer_value: 25 },
    solution: null,
    tag_id: 'tag_nucl_4',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2022, month: 'Jun', shift: 'Shift-II' }
  },

  // SRC: "Which of the following figure represents the variation" | AK: 2 | PAGE: page2
  {
    display_id: 'NUCL-072',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'Which of the following figure represents the variation of $\\ln\\left(\\frac{R}{R_0}\\right)$ with $\\ln A$ (if $R = $ radius of a nucleus and $A = $ its mass number)' },
    options: [
      { id: 'a', text: 'Graph (1)', is_correct: false },
      { id: 'b', text: 'Graph (2)', is_correct: true },
      { id: 'c', text: 'Graph (3)', is_correct: false },
      { id: 'd', text: 'Graph (4)', is_correct: false }
    ],
    answer: { correct_option: 'b' },
    solution: null,
    tag_id: 'tag_nucl_1',
    questionNature: 'Graphical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2022, month: 'Jun', shift: 'Shift-II' }
  },

  // SRC: "A radioactive nucleus can decay by two different" | AK: 4 | PAGE: page2
  {
    display_id: 'NUCL-073',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'A radioactive nucleus can decay by two different processes. Half-life for the first process is $3.0$ hours while it is $4.5$ hours for the second process. The effective halflife of the nucleus will be' },
    options: [
      { id: 'a', text: '$3.75$ hours', is_correct: false },
      { id: 'b', text: '$0.56$ hours', is_correct: false },
      { id: 'c', text: '$0.26$ hours', is_correct: false },
      { id: 'd', text: '$1.80$ hours', is_correct: true }
    ],
    answer: { correct_option: 'd' },
    solution: null,
    tag_id: 'tag_nucl_4',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2022, month: 'Jun', shift: 'Shift-II' }
  },

  // SRC: "Following statements related to radioactivity are given below" | AK: 3 | PAGE: page2
  {
    display_id: 'NUCL-074',
    type: 'MST',
    difficultyLevel: 3,
    question_text: { markdown: 'Following statements related to radioactivity are given below :\n\n(A) Radioactivity is a random and spontaneous process and is dependent on physical and chemical conditions.\n\n(B) The number of undecayed nuclei in the radioactive sample decays exponentially with time.\n\n(C) Slope of the graph of $\\log_e$ (no. of undecayed nuclei) vs. time represents the reciprocal of mean life time $(\\tau)$.\n\n(D) Product of decay constant $(\\lambda)$ and half-life time $\\left(T_{\\frac{1}{2}}\\right)$ is not constant.\n\nChoose the most appropriate answer from the options given below:' },
    options: [
      { id: 'a', text: '(A) and (B) only', is_correct: false },
      { id: 'b', text: '(B) and (D) only', is_correct: false },
      { id: 'c', text: '(B) and (C) only', is_correct: true },
      { id: 'd', text: '(C) and (D) only', is_correct: false }
    ],
    answer: { correct_option: 'c' },
    solution: null,
    tag_id: 'tag_nucl_4',
    questionNature: 'Conceptual',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2022, month: 'Jun', shift: 'Shift-II' }
  },

  // SRC: "The activity of a radioactive material is 2.56" | AK: 2 | PAGE: page2
  {
    display_id: 'NUCL-075',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'The activity of a radioactive material is $2.56 \\times 10^{-3}$ Ci. If the half life of the material is $5$ days, after how many days the activity will become $2 \\times 10^{-5}$ Ci?' },
    options: [
      { id: 'a', text: '$30$ days', is_correct: false },
      { id: 'b', text: '$35$ days', is_correct: true },
      { id: 'c', text: '$40$ days', is_correct: false },
      { id: 'd', text: '$25$ days', is_correct: false }
    ],
    answer: { correct_option: 'b' },
    solution: null,
    tag_id: 'tag_nucl_4',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2022, month: 'Jun', shift: 'Shift-I' }
  },

  // SRC: "The half life of a radioactive substance is" | AK: 20 | PAGE: page2
  {
    display_id: 'NUCL-076',
    type: 'NVT',
    difficultyLevel: 3,
    question_text: { markdown: 'The half life of a radioactive substance is $5$ years. After $x$ years a given sample of the radioactive substance gets reduced to $6.25\\%$ of its initial value. The value of $x$ is _____' },
    options: [],
    answer: { integer_value: 20 },
    solution: null,
    tag_id: 'tag_nucl_4',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2022, month: 'Jun', shift: 'Shift-II' }
  },

  // SRC: "A sample of a radioactive nucleus A disintegrates" | AK: 3 | PAGE: page2
  {
    display_id: 'NUCL-077',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'A sample of a radioactive nucleus $A$ disintegrates to another radioactive nucleus $B$, which in turn disintegrates to some other stable nucleus $C$. Plot of a graph showing the variation of number of atoms of nucleus $B$ vesus time is : (Assume that at $t = 0$, there are no $B$ atoms in the sample)' },
    options: [
      { id: 'a', text: 'Graph (1)', is_correct: false },
      { id: 'b', text: 'Graph (2)', is_correct: false },
      { id: 'c', text: 'Graph (3)', is_correct: true },
      { id: 'd', text: 'Graph (4)', is_correct: false }
    ],
    answer: { correct_option: 'c' },
    solution: null,
    tag_id: 'tag_nucl_4',
    questionNature: 'Graphical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2021, month: 'Aug', shift: 'Shift-I' }
  },

  // SRC: "The half life period of a radioactive element" | AK: 3 | PAGE: page3
  {
    display_id: 'NUCL-078',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'The half life period of a radioactive element $x$ is same as the mean life time of another radioactive element $y$. Initially they have the same number of atoms. Then:' },
    options: [
      { id: 'a', text: '$x$ and $y$ decay at the same rate always.', is_correct: false },
      { id: 'b', text: '$x$-will decay faster than $y$.', is_correct: false },
      { id: 'c', text: '$y$-will decay faster than $x$.', is_correct: true },
      { id: 'd', text: '$x$ and $y$ have same decay rate initially and later on different decay rate.', is_correct: false }
    ],
    answer: { correct_option: 'c' },
    solution: null,
    tag_id: 'tag_nucl_4',
    questionNature: 'Conceptual',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2021, month: 'Sep', shift: 'Shift-II' }
  },

  // SRC: "Some nuclei of a radioactive material are undergoing" | AK: 4 | PAGE: page3
  {
    display_id: 'NUCL-079',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'Some nuclei of a radioactive material are undergoing radioactive decay. The time gap between the instances when a quarter of the nuclei have decayed and when half of the nuclei have decayed is given as: (where $\\lambda$ is the decay constant)' },
    options: [
      { id: 'a', text: '$\\frac{1}{2}\\frac{\\ln 2}{\\lambda}$', is_correct: false },
      { id: 'b', text: '$\\frac{\\ln 2}{\\lambda}$', is_correct: false },
      { id: 'c', text: '$\\frac{2 \\ln 2}{\\lambda}$', is_correct: false },
      { id: 'd', text: '$\\frac{\\ln \\frac{3}{2}}{\\lambda}$', is_correct: true }
    ],
    answer: { correct_option: 'd' },
    solution: null,
    tag_id: 'tag_nucl_4',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2021, month: 'Jul', shift: 'Shift-I' }
  },

  // SRC: "If f denotes the ratio of the number" | AK: 3 | PAGE: page3
  {
    display_id: 'NUCL-080',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'If $f$ denotes the ratio of the number of nuclei decayed $(N_d)$ to the number of nuclei at $t = 0$, $(N_0)$ then for a collection of radioactive nuclei, the rate of change of $f$ with respect to time is given as: [$\\lambda$ is the radioactive decay constant]' },
    options: [
      { id: 'a', text: '$-\\lambda(1 - e^{-\\lambda t})$', is_correct: false },
      { id: 'b', text: '$\\lambda(1 - e^{-\\lambda t})$', is_correct: false },
      { id: 'c', text: '$\\lambda e^{-\\lambda t}$', is_correct: true },
      { id: 'd', text: '$-\\lambda e^{-\\lambda t}$', is_correct: false }
    ],
    answer: { correct_option: 'c' },
    solution: null,
    tag_id: 'tag_nucl_4',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2021, month: 'Jul', shift: 'Shift-I' }
  },

  // SRC: "The half-life of Au198 is 2.7 days" | AK: 2 | PAGE: page3
  {
    display_id: 'NUCL-081',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'The half-life of $Au^{198}$ is $2.7$ days. The activity of $1.50$ mg of $Au^{198}$, if its atomic weight is $198$ g mol$^{-1}$ is, $\\left(N_A = 6 \\times 10^{23}\\,\\text{mol}^{-1}\\right)$' },
    options: [
      { id: 'a', text: '$240$ Ci', is_correct: false },
      { id: 'b', text: '$357$ Ci', is_correct: true },
      { id: 'c', text: '$535$ Ci', is_correct: false },
      { id: 'd', text: '$252$ Ci', is_correct: false }
    ],
    answer: { correct_option: 'b' },
    solution: null,
    tag_id: 'tag_nucl_4',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2021, month: 'Mar', shift: 'Shift-II' }
  },

  // SRC: "A radioactive sample disintegrates via two independent decay" | AK: 3 | PAGE: page3
  {
    display_id: 'NUCL-082',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'A radioactive sample disintegrates via two independent decay processes having half lives $T_{1/2}^{(1)}$ and $T_{1/2}^{(2)}$ respectively. The effective half- life $T_{1/2}$ of the nuclei is :' },
    options: [
      { id: 'a', text: '$T_{1/2} = \\frac{T_{1/2}^{(1)} + T_{1/2}^{(2)}}{T_{1/2}^{(1)} - T_{1/2}^{(2)}}$', is_correct: false },
      { id: 'b', text: '$T_{1/2} = T_{1/2}^{(1)} + T_{1/2}^{(2)}$', is_correct: false },
      { id: 'c', text: '$T_{1/2} = \\frac{T_{1/2}^{(1)} T_{1/2}^{(2)}}{T_{1/2}^{(1)} + T_{1/2}^{(2)}}$', is_correct: true },
      { id: 'd', text: 'None of the above', is_correct: false }
    ],
    answer: { correct_option: 'c' },
    solution: null,
    tag_id: 'tag_nucl_4',
    questionNature: 'Rule_Application',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2021, month: 'Mar', shift: 'Shift-I' }
  },

  // SRC: "Two radioactive substances X and Y originally have" | AK: 2 | PAGE: page3
  {
    display_id: 'NUCL-083',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'Two radioactive substances $X$ and $Y$ originally have $N_1$ and $N_2$ nuclei respectively. Half life of $X$ is half of the half life of $Y$. After three half lives of $Y$, number of nuclei of both are equal. The ratio $\\frac{N_1}{N_2}$ will be equal to :' },
    options: [
      { id: 'a', text: '$\\frac{1}{3}$', is_correct: false },
      { id: 'b', text: '$\\frac{8}{1}$', is_correct: true },
      { id: 'c', text: '$\\frac{3}{1}$', is_correct: false },
      { id: 'd', text: '$\\frac{1}{8}$', is_correct: false }
    ],
    answer: { correct_option: 'b' },
    solution: null,
    tag_id: 'tag_nucl_4',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2021, month: 'Feb', shift: 'Shift-I' }
  },

  // SRC: "A radioactive sample is undergoing alpha decay, At" | AK: 3 | PAGE: page3
  {
    display_id: 'NUCL-084',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'A radioactive sample is undergoing $\\alpha$ decay, At any time $t_1$, its activity is $A$ and another time $t_2$, the activity is $\\frac{A}{5}$. What is the average life time for the sample ?' },
    options: [
      { id: 'a', text: '$\\frac{\\ln 5}{t_2 - t_1}$', is_correct: false },
      { id: 'b', text: '$\\frac{\\ln(t_2 + t_1)}{2}$', is_correct: false },
      { id: 'c', text: '$\\frac{t_2 - t_1}{\\ln 5}$', is_correct: true },
      { id: 'd', text: '$\\frac{t_1 - t_2}{\\ln 5}$', is_correct: false }
    ],
    answer: { correct_option: 'c' },
    solution: null,
    tag_id: 'tag_nucl_4',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2021, month: 'Feb', shift: 'Shift-II' }
  },

  // SRC: "In a radioactive material, a fraction of active" | AK: 3 | PAGE: page3
  {
    display_id: 'NUCL-085',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'In a radioactive material, a fraction of active material remaining after the time $t$ is $\\frac{9}{16}$. The fraction that was remaining after the time $\\frac{t}{2}$ is :' },
    options: [
      { id: 'a', text: '$\\frac{4}{5}$', is_correct: false },
      { id: 'b', text: '$\\frac{3}{5}$', is_correct: false },
      { id: 'c', text: '$\\frac{3}{4}$', is_correct: true },
      { id: 'd', text: '$\\frac{7}{8}$', is_correct: false }
    ],
    answer: { correct_option: 'c' },
    solution: null,
    tag_id: 'tag_nucl_4',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2020, month: 'Sep', shift: 'Shift-I' }
  },

  // SRC: "Activities of three radioactive substances A, B and" | AK: 3 | PAGE: page3
  {
    display_id: 'NUCL-086',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'Activities of three radioactive substances $A$, $B$ and $C$ are represented by the curves $A$, $B$ and $C$, in the figure. Then their half-lives $T_{\\frac{1}{2}}(A) : T_{\\frac{1}{2}}(B) : T_{\\frac{1}{2}}(C)$ are in the ratio:' },
    options: [
      { id: 'a', text: '$2 : 1 : 1$', is_correct: false },
      { id: 'b', text: '$3 : 2 : 1$', is_correct: false },
      { id: 'c', text: '$2 : 1 : 3$', is_correct: true },
      { id: 'd', text: '$4 : 3 : 1$', is_correct: false }
    ],
    answer: { correct_option: 'c' },
    solution: null,
    tag_id: 'tag_nucl_4',
    questionNature: 'Graphical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2020, month: 'Sep', shift: 'Shift-I' }
  },

  // SRC: "The activity of a radioactive sample falls from" | AK: 2 | PAGE: page3
  {
    display_id: 'NUCL-087',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'The activity of a radioactive sample falls from $700\\,s^{-1}$ to $500\\,s^{-1}$ in $30$ minutes. Its half life is close to:' },
    options: [
      { id: 'a', text: '$72$ min', is_correct: false },
      { id: 'b', text: '$62$ min', is_correct: true },
      { id: 'c', text: '$66$ min', is_correct: false },
      { id: 'd', text: '$52$ min', is_correct: false }
    ],
    answer: { correct_option: 'b' },
    solution: null,
    tag_id: 'tag_nucl_4',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2020, month: 'Jan', shift: 'Shift-II' }
  },

  // SRC: "Two radioactive materials A and B have decay" | AK: 2 | PAGE: page3
  {
    display_id: 'NUCL-088',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'Two radioactive materials A and B have decay constants $10\\lambda$ and $\\lambda$, respectively. If initially they have the same number of nuclei, then the ratio of the number of nuclei of A to that of B will be $1/e$ after a time:' },
    options: [
      { id: 'a', text: '$\\frac{1}{10\\lambda}$', is_correct: false },
      { id: 'b', text: '$\\frac{1}{9\\lambda}$', is_correct: true },
      { id: 'c', text: '$\\frac{1}{11\\lambda}$', is_correct: false },
      { id: 'd', text: '$\\frac{11}{10\\lambda}$', is_correct: false }
    ],
    answer: { correct_option: 'b' },
    solution: null,
    tag_id: 'tag_nucl_4',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2019, month: 'Apr', shift: 'Shift-I' }
  },

  // SRC: "Two radioactive substances A and B have decay" | AK: 2 | PAGE: page3
  {
    display_id: 'NUCL-089',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'Two radioactive substances A and B have decay constants $5\\lambda$ and $\\lambda$ respectively. At $t = 0$, a sample has the same number of the two nuclei. The time taken for the ratio of the number of nuclei to become $\\left(\\frac{1}{e}\\right)^2$ will be' },
    options: [
      { id: 'a', text: '$\\frac{1}{\\lambda}$', is_correct: false },
      { id: 'b', text: '$\\frac{1}{2\\lambda}$', is_correct: true },
      { id: 'c', text: '$\\frac{2}{\\lambda}$', is_correct: false },
      { id: 'd', text: '$\\frac{1}{4\\lambda}$', is_correct: false }
    ],
    answer: { correct_option: 'b' },
    solution: null,
    tag_id: 'tag_nucl_4',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2019, month: 'Apr', shift: 'Shift-II' }
  },

  // SRC: "Half lives of two radioactive nuclei A and" | AK: 4 | PAGE: page4
  {
    display_id: 'NUCL-090',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'Half lives of two radioactive nuclei A and B are $10$ minutes and $20$ minutes, respectively. If, initially a sample has equal number of nuclei, then after $60$ minutes, the ratio of decayed numbers of nuclei A and B will be:' },
    options: [
      { id: 'a', text: '$3 : 8$', is_correct: false },
      { id: 'b', text: '$8 : 1$', is_correct: false },
      { id: 'c', text: '$1 : 8$', is_correct: false },
      { id: 'd', text: '$9 : 8$', is_correct: true }
    ],
    answer: { correct_option: 'd' },
    solution: null,
    tag_id: 'tag_nucl_4',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2019, month: 'Apr', shift: 'Shift-II' }
  },

  // SRC: "A Sample of radioactive material A, that has" | AK: 4 | PAGE: page4
  {
    display_id: 'NUCL-091',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'A Sample of radioactive material $A$, that has an activity of $10\\,m$ Ci $\\left(1\\,Ci = 3.7 \\times 10^{10}\\,\\text{decays s}^{-1}\\right)$, has twice the number of nuclei as another sample of a different radioactive material $B$ which has an activity of $20\\,m$ Ci. The correct choices for half-lives of $A$ and $B$ would then be, respectively:' },
    options: [
      { id: 'a', text: '$5$ days and $10$ days', is_correct: false },
      { id: 'b', text: '$10$ days and $40$ days', is_correct: false },
      { id: 'c', text: '$20$ days and $10$ days', is_correct: false },
      { id: 'd', text: '$20$ days and $5$ days', is_correct: true }
    ],
    answer: { correct_option: 'd' },
    solution: null,
    tag_id: 'tag_nucl_4',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2019, month: 'Jan', shift: 'Shift-I' }
  },

  // SRC: "Using a nuclear counter the count rate of" | AK: 2 | PAGE: page4
  {
    display_id: 'NUCL-092',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'Using a nuclear counter the count rate of emitted particles from a radioactive source is measured. At $t = 0$ it was $1600$ counts per second and $t = 8$ seconds it was $100$ counts per second. The count rate observed, as counts per second, at $t = 6$ seconds is close to:' },
    options: [
      { id: 'a', text: '$400$', is_correct: false },
      { id: 'b', text: '$200$', is_correct: true },
      { id: 'c', text: '$150$', is_correct: false },
      { id: 'd', text: '$360$', is_correct: false }
    ],
    answer: { correct_option: 'b' },
    solution: null,
    tag_id: 'tag_nucl_4',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2019, month: 'Jan', shift: 'Shift-I' }
  },

  // ============ ADVANCED — NUCLEAR STRUCTURE ============

  // SRC: "Given below are two statements: one is labelled" | AK: 2 | PAGE: page4
  {
    display_id: 'NUCL-093',
    type: 'AR',
    difficultyLevel: 3,
    question_text: { markdown: 'Given below are two statements : one is labelled as **Assertion A** and the other is labelled as **Reason R**\n\n**Assertion A** : The nuclear density of nuclides $^{10}_5 B$, $^6_3 Li$, $^{56}_{26} Fe$, $^{20}_{10} Ne$ and $^{209}_{83} Bi$ can be arranged as $\\rho^N_{Bi} > \\rho^N_{Fe} > \\rho^N_{Ne} > \\rho^N_B > \\rho^N_{Li}$\n\n**Reason R** : The radius $R$ of nucleus is related to its mass number $A$ as $R = R_0 A^{\\frac{1}{3}}$, where $R_0$ is a constant.\n\nIn the light of the above statement, choose the correct answer from the options given below :' },
    options: [
      { id: 'a', text: 'Both A and R are true and R is the correct explanation of A', is_correct: false },
      { id: 'b', text: 'A is false but R is true', is_correct: true },
      { id: 'c', text: 'A is true but R is false', is_correct: false },
      { id: 'd', text: 'Both A and R are true but R is NOT the correct explanation of A', is_correct: false }
    ],
    answer: { correct_option: 'b' },
    solution: null,
    tag_id: 'tag_nucl_1',
    questionNature: 'Conceptual',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2023, month: 'Jan', shift: 'Shift-II' }
  },

  // ============ ADVANCED — NUCLEAR ENERGY ============

  // SRC: "A star has 100% helium composition. It starts" | AK: 15 | PAGE: page4
  {
    display_id: 'NUCL-094',
    type: 'NVT',
    difficultyLevel: 3,
    question_text: { markdown: 'A star has $100\\%$ helium composition. It starts to convert three $^4 He$ into one $^{12} C$ via triple alpha process as $^4 He + ^4 He + ^4 He \\rightarrow ^{12} C + Q$. The mass of the star is $2.0 \\times 10^{32}$ kg and it generates energy at the rate of $5.808 \\times 10^{30}$ W. The rate of converting these $^4 He$ to $^{12} C$ is $n \\times 10^{42}\\,s^{-1}$, where $n$ is _____. [Take, mass of $^4 He = 4.0026 u$, mass of $^{12} C = 12 u$]' },
    options: [],
    answer: { integer_value: 15 },
    solution: null,
    tag_id: 'tag_nucl_5',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2024, month: 'Apr', shift: 'Shift-II' }
  },

  // SRC: "For a nucleus AzX having mass number A" | AK: 2 | PAGE: page4
  {
    display_id: 'NUCL-095',
    type: 'MST',
    difficultyLevel: 3,
    question_text: { markdown: 'For a nucleus $^A_Z X$ having mass number A and atomic number Z\n\nA. The surface energy per nucleon $(b_s) = -a_1 A^{\\frac{2}{3}}$.\n\nB. The Coulomb contribution to the binding energy $b_c = -a_2 \\frac{Z(Z-1)}{A^{\\frac{4}{3}}}$.\n\nC. The volume energy $b_v = a_3 A$\n\nD. Decrease in the binding energy is proportional to surface area.\n\nE. While estimating the surface energy, it is assumed that each nucleon interacts with $12$ nucleons. ($a_1, a_2$ and $a_3$ are constants)\n\nChoose the most appropriate answer from the options given below:' },
    options: [
      { id: 'a', text: 'B, C, E only', is_correct: false },
      { id: 'b', text: 'C, D only', is_correct: true },
      { id: 'c', text: 'A, B, C, D only', is_correct: false },
      { id: 'd', text: 'B, C only', is_correct: false }
    ],
    answer: { correct_option: 'b' },
    solution: null,
    tag_id: 'tag_nucl_2',
    questionNature: 'Conceptual',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2023, month: 'Apr', shift: 'Shift-I' }
  },

  // SRC: "A nucleus with mass number 184 initially at" | AK: 4 | PAGE: page4
  {
    display_id: 'NUCL-096',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'A nucleus with mass number $184$ initially at rest emits an $\\alpha$-particle. If the $Q$ value of the reaction is $5.5$ MeV, calculate the kinetic energy of the $\\alpha$- particle.' },
    options: [
      { id: 'a', text: '$5.0$ MeV', is_correct: false },
      { id: 'b', text: '$5.5$ MeV', is_correct: false },
      { id: 'c', text: '$0.12$ MeV', is_correct: false },
      { id: 'd', text: '$5.38$ MeV', is_correct: true }
    ],
    answer: { correct_option: 'd' },
    solution: null,
    tag_id: 'tag_nucl_3',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2021, month: 'Jul', shift: 'Shift-I' }
  },

  // ============ ADVANCED — NUCLEAR REACTIONS ============

  // SRC: "The explosive in a Hydrogen bomb is a" | AK: 4 | PAGE: page4
  {
    display_id: 'NUCL-097',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'The explosive in a Hydrogen bomb is a mixture of $_1 H^2$, $_1 H^3$ and $_3 Li^6$ in some condensed form. The chain reaction is given by $_3 Li^6 + _0 n^1 \\rightarrow _2 He^4 + _1 H^3$ ; $_1 H^2 + _1 H^3 \\rightarrow _2 He^4 + _0 n^1$\n\nDuring the explosion the energy released is approximately\n\n[Given : $M(Li) = 6.01690$ amu, $M(_1 H^2) = 2.01471$ amu, $M(_2 He^4) = 4.00388$ amu and $1$ amu $= 931.5$ MeV]' },
    options: [
      { id: 'a', text: '$28.12$ MeV', is_correct: false },
      { id: 'b', text: '$12.64$ MeV', is_correct: false },
      { id: 'c', text: '$16.48$ MeV', is_correct: false },
      { id: 'd', text: '$22.22$ MeV', is_correct: true }
    ],
    answer: { correct_option: 'd' },
    solution: null,
    tag_id: 'tag_nucl_5',
    questionNature: 'Numerical',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2024, month: 'Jan', shift: 'Shift-I' }
  },

  // SRC: "Given the masses of various atomic particles" | AK: 3 | PAGE: page4
  {
    display_id: 'NUCL-098',
    type: 'SCQ',
    difficultyLevel: 3,
    question_text: { markdown: 'Given the masses of various atomic particles\n\n$m_p = 1.0072\\,u, m_n = 1.0087\\,u, m_e = 0.000548\\,u, m_{\\bar{v}} = 0, m_d = 2.0141\\,u$, where p $=$ proton, n $\\equiv$ neutron, e $\\equiv$ electron, $\\bar{v} \\equiv$ antineutrino and $\\bar{d} \\equiv$ deuteron. Which of the following process is allowed by momentum and energy conservation :' },
    options: [
      { id: 'a', text: '$n + n \\rightarrow$ deuterium atom (electron bound to the nucleus)', is_correct: false },
      { id: 'b', text: '$p \\rightarrow n + e^+ + \\bar{v}$', is_correct: false },
      { id: 'c', text: '$n + p \\rightarrow d + \\gamma$', is_correct: true },
      { id: 'd', text: '$e^+ + e^- \\rightarrow \\gamma$', is_correct: false }
    ],
    answer: { correct_option: 'c' },
    solution: null,
    tag_id: 'tag_nucl_3',
    questionNature: 'Conceptual',
    applicableExams: ['JEE'],
    sourceType: 'PYQ',
    examDetails: { exam: 'JEE_Main', year: 2020, month: 'Sep', shift: 'Shift-II' }
  }
];

module.exports = { questions };
