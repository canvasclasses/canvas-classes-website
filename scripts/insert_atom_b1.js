const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');

const CHAPTER_ID = 'ch11_atom';
function src(year, month, day, shift) { return { exam_name: 'JEE Main', year, month, day, shift }; }

function mkSCQ(id, diff, text, opts, correctId, solution, tag, examSrc) {
  return { _id: uuidv4(), display_id: id, type: 'SCQ', question_text: { markdown: text, latex_validated: false },
    options: [{ id:'a', text:opts[0], is_correct:correctId==='a' },{ id:'b', text:opts[1], is_correct:correctId==='b' },{ id:'c', text:opts[2], is_correct:correctId==='c' },{ id:'d', text:opts[3], is_correct:correctId==='d' }],
    answer: { correct_option: correctId }, solution: { text_markdown: solution, latex_validated: false },
    metadata: { difficulty: diff, chapter_id: CHAPTER_ID, tags: [{ tag_id: tag, weight: 1.0 }], exam_source: examSrc, is_pyq: true, is_top_pyq: false },
    status: 'published', version: 1, quality_score: 85, needs_review: false, created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), deleted_at: null };
}
function mkNVT(id, diff, text, answer, solution, tag, examSrc) {
  return { _id: uuidv4(), display_id: id, type: 'NVT', question_text: { markdown: text, latex_validated: false }, options: [], answer,
    solution: { text_markdown: solution, latex_validated: false },
    metadata: { difficulty: diff, chapter_id: CHAPTER_ID, tags: [{ tag_id: tag, weight: 1.0 }], exam_source: examSrc, is_pyq: true, is_top_pyq: false },
    status: 'published', version: 1, quality_score: 85, needs_review: false, created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), deleted_at: null };
}
function mkMTC(id, diff, text, opts, correctId, solution, tag, examSrc) {
  return { _id: uuidv4(), display_id: id, type: 'MTC', question_text: { markdown: text, latex_validated: false },
    options: [{ id:'a', text:opts[0], is_correct:correctId==='a' },{ id:'b', text:opts[1], is_correct:correctId==='b' },{ id:'c', text:opts[2], is_correct:correctId==='c' },{ id:'d', text:opts[3], is_correct:correctId==='d' }],
    answer: { correct_option: correctId }, solution: { text_markdown: solution, latex_validated: false },
    metadata: { difficulty: diff, chapter_id: CHAPTER_ID, tags: [{ tag_id: tag, weight: 1.0 }], exam_source: examSrc, is_pyq: true, is_top_pyq: false },
    status: 'published', version: 1, quality_score: 85, needs_review: false, created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), deleted_at: null };
}
function mkAR(id, diff, text, opts, correctId, solution, tag, examSrc) {
  return { _id: uuidv4(), display_id: id, type: 'AR', question_text: { markdown: text, latex_validated: false },
    options: [{ id:'a', text:opts[0], is_correct:correctId==='a' },{ id:'b', text:opts[1], is_correct:correctId==='b' },{ id:'c', text:opts[2], is_correct:correctId==='c' },{ id:'d', text:opts[3], is_correct:correctId==='d' }],
    answer: { correct_option: correctId }, solution: { text_markdown: solution, latex_validated: false },
    metadata: { difficulty: diff, chapter_id: CHAPTER_ID, tags: [{ tag_id: tag, weight: 1.0 }], exam_source: examSrc, is_pyq: true, is_top_pyq: false },
    status: 'published', version: 1, quality_score: 85, needs_review: false, created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), deleted_at: null };
}

const questions = [

mkSCQ('ATOM-201','Easy',
`Choose the **incorrect** statement about Dalton's Atomic Theory.`,
['Chemical reactions involve reorganization of atoms.','Matter consists of indivisible atoms.','Compounds are formed when atoms of different elements combine in **any** ratio.','All the atoms of a given element have identical properties including identical mass.'],
'c',
`**Dalton's Atomic Theory** states compounds form when atoms combine in a **fixed** ratio — not any ratio.\n\n**Step 1:** Evaluate each option:\n- (1) ✓ Correct — reactions involve reorganisation of atoms.\n- (2) ✓ Correct — atoms are indivisible (Dalton's postulate).\n- (3) ✗ **Incorrect** — Dalton said atoms combine in **fixed** ratios, not any ratio.\n- (4) ✓ Correct — all atoms of an element are identical in mass and properties.\n\n**Answer: Option (3)**`,
'tag_atom_1', src(2024,'Apr',4,'Evening')),

mkSCQ('ATOM-202','Medium',
`The incorrect postulates of Dalton's atomic theory are:\n\n**(A)** Atoms of different elements differ in mass.\n**(B)** Matter consists of **divisible** atoms.\n**(C)** Compounds form when atoms combine in a fixed ratio.\n**(D)** All atoms of a given element have **different** properties including mass.\n**(E)** Chemical reactions involve reorganisation of atoms.\n\nChoose the correct answer:`,
['(C), (D), (E) only','(B), (D) only','(A), (B), (D) only','(B), (D), (E) only'],
'b',
`**Dalton's postulates:** atoms are indivisible, identical within an element, combine in fixed ratios.\n\n- **(A)** ✓ Correct — different elements have different masses.\n- **(B)** ✗ **Incorrect** — Dalton said atoms are **indivisible**.\n- **(C)** ✓ Correct — fixed ratios (law of definite proportions).\n- **(D)** ✗ **Incorrect** — Dalton said atoms of same element are **identical**.\n- **(E)** ✓ Correct — reactions reorganise atoms.\n\n**Incorrect: (B) and (D) → Answer: Option (2)**`,
'tag_atom_1', src(2024,'Apr',5,'Morning')),

mkNVT('ATOM-203','Medium',
`The total number of isoelectronic species from the given set is ______.\n\n$$\\mathrm{O^{2-},\\ F^{-},\\ Al,\\ Mg^{2+},\\ Na^{+},\\ O^{+},\\ Mg,\\ Al^{3+},\\ F}$$`,
{ integer_value: 5 },
`**Isoelectronic** = same number of electrons.\n\n| Species | Z | Charge | Electrons |\n|---------|---|--------|-----------|\n| $\\mathrm{O^{2-}}$ | 8 | −2 | 10 |\n| $\\mathrm{F^{-}}$ | 9 | −1 | 10 |\n| $\\mathrm{Mg^{2+}}$ | 12 | +2 | 10 |\n| $\\mathrm{Na^{+}}$ | 11 | +1 | 10 |\n| $\\mathrm{Al^{3+}}$ | 13 | +3 | 10 |\n| $\\mathrm{Al}$ | 13 | 0 | 13 |\n| $\\mathrm{O^{+}}$ | 8 | +1 | 7 |\n| $\\mathrm{Mg}$ | 12 | 0 | 12 |\n| $\\mathrm{F}$ | 9 | 0 | 9 |\n\n**10-electron species (Ne config):** $\\mathrm{O^{2-}, F^{-}, Mg^{2+}, Na^{+}, Al^{3+}}$ → **5 species**\n\n**Answer: 5**`,
'tag_atom_2', src(2023,'Apr',15,'Morning')),

mkSCQ('ATOM-204','Easy',
`Which one of the following sets of ions represents a collection of **isoelectronic** species?\n\n(Atomic numbers: F = 9, Cl = 17, Na = 11, Mg = 12, Al = 13, K = 19, Ca = 20, Sc = 21)`,
['$\\mathrm{Li^+, Na^+, Mg^{2+}, Ca^{2+}}$','$\\mathrm{Ba^{2+}, Sr^{2+}, K^+, Ca^{2+}}$','$\\mathrm{N^{3-}, O^{2-}, F^-, S^{2-}}$','$\\mathrm{K^+, Cl^-, Ca^{2+}, Sc^{3+}}$'],
'd',
`**Option (4): $\\mathrm{K^+, Cl^-, Ca^{2+}, Sc^{3+}}$**\n\n| Ion | Z | Charge | Electrons |\n|-----|---|--------|-----------|\n| $\\mathrm{K^+}$ | 19 | +1 | 18 |\n| $\\mathrm{Cl^-}$ | 17 | −1 | 18 |\n| $\\mathrm{Ca^{2+}}$ | 20 | +2 | 18 |\n| $\\mathrm{Sc^{3+}}$ | 21 | +3 | 18 |\n\nAll have **18 electrons** (Ar configuration) ✓\n\n**Others fail:** (1) Li⁺ has 2e⁻; (2) Ba²⁺ has 54e⁻; (3) S²⁻ has 18e⁻ vs N³⁻/O²⁻/F⁻ with 10e⁻.\n\n**Answer: Option (4)**`,
'tag_atom_2', src(2023,'Feb',1,'Evening')),

mkNVT('ATOM-205','Hard',
`Consider an imaginary ion $\\,{}_{22}^{48}\\mathrm{X}^{3-}$. The nucleus contains '$a$'% more neutrons than the number of electrons in the ion. The value of '$a$' is ______.`,
{ integer_value: 4 },
`**Given:** Z = 22, A = 48, charge = 3−\n\n**Step 1:** Neutrons = A − Z = 48 − 22 = **26**\n\n**Step 2:** Electrons in ion = Z + 3 = 22 + 3 = **25** (gained 3 electrons)\n\n**Step 3:** % more neutrons:\n$$a = \\frac{26 - 25}{25} \\times 100 = \\frac{1}{25} \\times 100 = \\mathbf{4}\\%$$\n\n**Answer: 4**`,
'tag_atom_2', src(2022,'Jul',26,'Evening')),

mkSCQ('ATOM-206','Medium',
`Which of the following pair is **not** isoelectronic?\n\n(Atomic numbers: Sm = 62, Er = 68, Yb = 70, Lu = 71, Eu = 63, Tb = 65, Tm = 69)`,
['$\\mathrm{Sm^{2+}}$ and $\\mathrm{Er^{3+}}$','$\\mathrm{Yb^{2+}}$ and $\\mathrm{Lu^{3+}}$','$\\mathrm{Eu^{2+}}$ and $\\mathrm{Tb^{4+}}$','$\\mathrm{Tb^{2+}}$ and $\\mathrm{Tm^{4+}}$'],
'd',
`**Count electrons for each pair:**\n\n- (2) Yb²⁺: 70−2 = 68 | Lu³⁺: 71−3 = 68 → **Equal ✓**\n- (3) Eu²⁺: 63−2 = 61 | Tb⁴⁺: 65−4 = 61 → **Equal ✓**\n- (4) Tb²⁺: 65−2 = **63** | Tm⁴⁺: 69−4 = **65** → **Not equal ✗**\n\n**Answer: Option (4)** — Tb²⁺ and Tm⁴⁺ are NOT isoelectronic.`,
'tag_atom_2', src(2022,'Jul',28,'Evening')),

mkSCQ('ATOM-207','Easy',
`The pair in which ions are isoelectronic with $\\mathrm{Al^{3+}}$ is:`,
['$\\mathrm{Br^-}$ and $\\mathrm{Be^{2+}}$','$\\mathrm{Cl^-}$ and $\\mathrm{Li^+}$','$\\mathrm{S^{2-}}$ and $\\mathrm{K^+}$','$\\mathrm{O^{2-}}$ and $\\mathrm{Mg^{2+}}$'],
'd',
`$\\mathrm{Al^{3+}}$: Z = 13, charge = +3 → electrons = 13 − 3 = **10** (Ne configuration)\n\n| Ion | Electrons |\n|-----|-----------|\n| $\\mathrm{O^{2-}}$ | 8+2 = **10** ✓ |\n| $\\mathrm{Mg^{2+}}$ | 12−2 = **10** ✓ |\n| $\\mathrm{Cl^-}$ | 17+1 = 18 ✗ |\n| $\\mathrm{S^{2-}}$ | 16+2 = 18 ✗ |\n\n**Both O²⁻ and Mg²⁺ have 10 electrons → Answer: Option (4)**`,
'tag_atom_2', src(2022,'Jun',25,'Morning')),

mkSCQ('ATOM-208','Easy',
`The isoelectronic set of ions is:`,
['$\\mathrm{F^-, Li^+, Na^+}$ and $\\mathrm{Mg^{2+}}$','$\\mathrm{N^{3-}, Li^+, Mg^{2+}}$ and $\\mathrm{O^{2-}}$','$\\mathrm{N^{3-}, O^{2-}, F^-}$ and $\\mathrm{Na^+}$','$\\mathrm{Li^+, Na^+, O^{2-}}$ and $\\mathrm{F^-}$'],
'c',
`**Option (3): N³⁻(10), O²⁻(10), F⁻(10), Na⁺(10)** — all have **10 electrons** ✓\n\n**Others fail:** Li⁺ has only 2 electrons, breaking options (1), (2), (4).\n\n**Answer: Option (3)**`,
'tag_atom_2', src(2019,'Apr',10,'Morning')),

mkNVT('ATOM-209','Hard',
`The value of Rydberg constant $(R_H)$ is $2.18 \\times 10^{-18}\\,\\text{J}$. The velocity of electron having mass $9.1 \\times 10^{-31}\\,\\text{kg}$ in Bohr's first orbit of hydrogen atom = ______ $\\times 10^5\\,\\text{ms}^{-1}$ (nearest integer).`,
{ integer_value: 22 },
`**In Bohr's model:** KE = $-E_n = R_H$ for $n=1$\n\n$$\\frac{1}{2}m_e v^2 = 2.18 \\times 10^{-18}\\,\\text{J}$$\n\n$$v^2 = \\frac{2 \\times 2.18 \\times 10^{-18}}{9.1 \\times 10^{-31}} = \\frac{4.36 \\times 10^{-18}}{9.1 \\times 10^{-31}} = 4.79 \\times 10^{12}\\,\\text{m}^2\\text{s}^{-2}$$\n\n$$v = 2.19 \\times 10^6\\,\\text{ms}^{-1} = \\mathbf{22} \\times 10^5\\,\\text{ms}^{-1}$$\n\n**Answer: 22**`,
'tag_atom_3', src(2024,'Apr',5,'Morning')),

mkSCQ('ATOM-210','Easy',
`Maximum number of electrons that can be accommodated in shell with $n = 4$ are:`,
['16','32','50','72'],
'b',
`**Maximum electrons in a shell** = $2n^2$\n\nFor $n = 4$:\n$$2 \\times 4^2 = 2 \\times 16 = \\mathbf{32}$$\n\n**Subshells:** 4s(2) + 4p(6) + 4d(10) + 4f(14) = 32 ✓\n\n**Answer: Option (2) — 32**`,
'tag_atom_3', src(2023,'Jan',30,'Evening')),

mkNVT('ATOM-211','Medium',
`Wavenumber for a radiation having $5800\\,\\text{Å}$ wavelength is $x \\times 10\\,\\text{cm}^{-1}$. The value of $x$ is ______ (Integer answer).`,
{ integer_value: 1724 },
`**Wavenumber** $\\bar{\\nu} = \\dfrac{1}{\\lambda}$\n\n**Convert:** $\\lambda = 5800\\,\\text{Å} = 5.8 \\times 10^{-5}\\,\\text{cm}$\n\n$$\\bar{\\nu} = \\frac{1}{5.8 \\times 10^{-5}} = 1.724 \\times 10^4\\,\\text{cm}^{-1} = 1724 \\times 10\\,\\text{cm}^{-1}$$\n\n**Answer: $x = 1724$**`,
'tag_atom_4', src(2024,'Jan',29,'Evening')),

mkMTC('ATOM-212','Medium',
`Match List-I with List-II:\n\n| List-I (Spectral Series) | List-II (Spectral Region) |\n|--------------------------|---------------------------|\n| A. Lyman | I. Infrared region |\n| B. Balmer | II. UV region |\n| C. Paschen | III. Infrared region |\n| D. Pfund | IV. Visible region |\n\nChoose the correct answer:`,
['A-II, B-III, C-I, D-IV','A-I, B-III, C-II, D-IV','A-II, B-IV, C-III, D-I','A-I, B-II, C-III, D-IV'],
'c',
`**Hydrogen spectral series:**\n\n| Series | Lower level | Region |\n|--------|-------------|--------|\n| Lyman | n=1 | **UV** |\n| Balmer | n=2 | **Visible** |\n| Paschen | n=3 | **Infrared** |\n| Pfund | n=5 | **Infrared** |\n\n**Matching:** A→II, B→IV, C→III, D→I\n\n**Answer: Option (3)**`,
'tag_atom_4', src(2024,'Jan',29,'Evening')),

mkNVT('ATOM-213','Medium',
`Number of spectral lines obtained in $\\mathrm{He^+}$ spectra, when an electron makes transition from fifth excited state to first excited state will be ______.`,
{ integer_value: 10 },
`**Identify levels:**\n- Fifth excited state = $n = 6$\n- First excited state = $n = 2$\n\n**Number of lines** between $n_2 = 6$ and $n_1 = 2$:\n$$\\text{Lines} = \\frac{(n_2 - n_1)(n_2 - n_1 + 1)}{2} = \\frac{4 \\times 5}{2} = \\mathbf{10}$$\n\n**Answer: 10**`,
'tag_atom_4', src(2024,'Jan',30,'Evening')),

mkNVT('ATOM-214','Easy',
`When the excited electron of a H atom from $n = 5$ drops to the ground state, the maximum number of emission lines observed are ______.`,
{ integer_value: 10 },
`**Maximum emission lines** from $n = 5$:\n$$\\text{Lines} = \\frac{n(n-1)}{2} = \\frac{5 \\times 4}{2} = \\mathbf{10}$$\n\n**Transitions:** 5→4, 5→3, 5→2, 5→1, 4→3, 4→2, 4→1, 3→2, 3→1, 2→1 = 10 ✓\n\n**Answer: 10**`,
'tag_atom_4', src(2022,'Jul',25,'Evening')),

mkNVT('ATOM-215','Medium',
`The de Broglie's wavelength of an electron in the $4^{\\text{th}}$ orbit is ______ $\\pi a_0$. ($a_0$ = Bohr's radius)`,
{ integer_value: 8 },
`**de Broglie condition:** $2\\pi r_n = n\\lambda$\n\n**Bohr radius:** $r_n = n^2 a_0$\n\nFor $n = 4$: $r_4 = 16\\,a_0$\n\n$$\\lambda = \\frac{2\\pi r_4}{n} = \\frac{2\\pi \\times 16\\,a_0}{4} = 8\\pi\\,a_0$$\n\n**Answer: 8**`,
'tag_atom_5', src(2024,'Apr',4,'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
