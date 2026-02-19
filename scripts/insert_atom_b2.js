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
function mkAR(id, diff, text, opts, correctId, solution, tag, examSrc) {
  return { _id: uuidv4(), display_id: id, type: 'AR', question_text: { markdown: text, latex_validated: false },
    options: [{ id:'a', text:opts[0], is_correct:correctId==='a' },{ id:'b', text:opts[1], is_correct:correctId==='b' },{ id:'c', text:opts[2], is_correct:correctId==='c' },{ id:'d', text:opts[3], is_correct:correctId==='d' }],
    answer: { correct_option: correctId }, solution: { text_markdown: solution, latex_validated: false },
    metadata: { difficulty: diff, chapter_id: CHAPTER_ID, tags: [{ tag_id: tag, weight: 1.0 }], exam_source: examSrc, is_pyq: true, is_top_pyq: false },
    status: 'published', version: 1, quality_score: 85, needs_review: false, created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), deleted_at: null };
}

const questions = [

// Q16 - Frequency of de Broglie wave in Bohr's first orbit - NVT - Answer: 661
mkNVT('ATOM-216','Hard',
`Frequency of the de-Broglie wave of electron in Bohr's first orbit of hydrogen atom is ______ $\\times 10^{13}$ Hz (nearest integer).\n\n[Given: $R_H = 2.18 \\times 10^{-18}$ J, $h = 6.6 \\times 10^{-34}$ J·s]`,
{ integer_value: 661 },
`**Step 1:** Find KE of electron in Bohr's first orbit:\n$$KE = R_H = 2.18 \\times 10^{-18}\\,\\text{J}$$\n\n**Step 2:** Find velocity:\n$$\\frac{1}{2}m_e v^2 = 2.18 \\times 10^{-18}$$\n$$v = \\sqrt{\\frac{2 \\times 2.18 \\times 10^{-18}}{9.1 \\times 10^{-31}}} = 2.19 \\times 10^6\\,\\text{ms}^{-1}$$\n\n**Step 3:** de Broglie wavelength:\n$$\\lambda = \\frac{h}{m_e v} = \\frac{6.6 \\times 10^{-34}}{9.1 \\times 10^{-31} \\times 2.19 \\times 10^6} = 3.31 \\times 10^{-10}\\,\\text{m}$$\n\n**Step 4:** Frequency of de Broglie wave:\n$$\\nu = \\frac{v}{\\lambda} = \\frac{2.19 \\times 10^6}{3.31 \\times 10^{-10}} = 6.61 \\times 10^{15}\\,\\text{Hz} = 661 \\times 10^{13}\\,\\text{Hz}$$\n\n**Answer: 661**`,
'tag_atom_5', src(2024,'Apr',6,'Morning')),

// Q17 - HUP uncertainty in velocity in nucleus - NVT - Answer: 58
mkNVT('ATOM-217','Hard',
`Based on Heisenberg's uncertainty principle, the uncertainty in the velocity of the electron to be found within an atomic nucleus of diameter $10^{-15}$ m is ______ $\\times 10^9$ ms$^{-1}$ (nearest integer).\n\n[Given: mass of electron $= 9.1 \\times 10^{-31}$ kg, $h = 6.626 \\times 10^{-34}$ Js, $\\pi = 3.14$]`,
{ integer_value: 58 },
`**Heisenberg Uncertainty Principle:**\n$$\\Delta x \\cdot \\Delta p \\geq \\frac{h}{4\\pi}$$\n\n**Given:** $\\Delta x = 10^{-15}$ m (diameter of nucleus)\n\n$$\\Delta v \\geq \\frac{h}{4\\pi \\cdot m_e \\cdot \\Delta x}$$\n\n$$\\Delta v = \\frac{6.626 \\times 10^{-34}}{4 \\times 3.14 \\times 9.1 \\times 10^{-31} \\times 10^{-15}}$$\n\n$$= \\frac{6.626 \\times 10^{-34}}{1.143 \\times 10^{-44}} = 5.80 \\times 10^{10}\\,\\text{ms}^{-1}$$\n\n$$= 58 \\times 10^9\\,\\text{ms}^{-1}$$\n\n**Answer: 58**`,
'tag_atom_5', src(2024,'Apr',9,'Evening')),

// Q18 - Ionization energy of sodium - NVT - Answer: 494
mkNVT('ATOM-218','Medium',
`The ionization energy of sodium in kJ mol$^{-1}$, if electromagnetic radiation of wavelength 242 nm is just sufficient to ionize sodium atom, is ______ (nearest integer).`,
{ integer_value: 494 },
`**Energy of one photon:**\n$$E = \\frac{hc}{\\lambda} = \\frac{6.626 \\times 10^{-34} \\times 3 \\times 10^8}{242 \\times 10^{-9}}$$\n\n$$= \\frac{1.988 \\times 10^{-25}}{2.42 \\times 10^{-7}} = 8.21 \\times 10^{-19}\\,\\text{J}$$\n\n**Ionization energy per mole:**\n$$IE = E \\times N_A = 8.21 \\times 10^{-19} \\times 6.022 \\times 10^{23}$$\n\n$$= 4.94 \\times 10^5\\,\\text{J mol}^{-1} = \\mathbf{494}\\,\\text{kJ mol}^{-1}$$\n\n**Answer: 494**`,
'tag_atom_5', src(2024,'Jan',31,'Morning')),

// Q19 - Wavelength of electron with given KE - NVT - Answer: 7
mkNVT('ATOM-219','Medium',
`The wavelength of an electron of kinetic energy $4.50 \\times 10^{-29}$ J is ______ $\\times 10^{-5}$ m (nearest integer).\n\n[Given: mass of electron $= 9 \\times 10^{-31}$ kg, $h = 6.6 \\times 10^{-34}$ Js]`,
{ integer_value: 7 },
`**de Broglie wavelength:**\n$$\\lambda = \\frac{h}{\\sqrt{2m \\cdot KE}}$$\n\n$$= \\frac{6.6 \\times 10^{-34}}{\\sqrt{2 \\times 9 \\times 10^{-31} \\times 4.50 \\times 10^{-29}}}$$\n\n**Denominator:**\n$$\\sqrt{2 \\times 9 \\times 10^{-31} \\times 4.50 \\times 10^{-29}} = \\sqrt{8.1 \\times 10^{-59}} = 9.0 \\times 10^{-30}$$\n\n$$\\lambda = \\frac{6.6 \\times 10^{-34}}{9.0 \\times 10^{-30}} = 7.33 \\times 10^{-5}\\,\\text{m} \\approx \\mathbf{7} \\times 10^{-5}\\,\\text{m}$$\n\n**Answer: 7**`,
'tag_atom_5', src(2023,'Apr',6,'Morning')),

// Q20 - AR: Photoelectric effect - Answer: (2)
mkAR('ATOM-220','Medium',
`**Assertion A:** In the photoelectric effect, the electrons are ejected from the metal surface as soon as the beam of light of frequency greater than threshold frequency strikes the surface.\n\n**Reason R:** When the photon of any energy strikes an electron in the atom, transfer of energy from the photon to the electron takes place.\n\nChoose the most appropriate answer:`,
[
  'Both A and R are correct and R is the correct explanation of A',
  'A is correct but R is not correct',
  'Both A and R are correct but R is NOT the correct explanation of A',
  'A is not correct but R is correct'
],
'b',
`**Assertion A** is **correct** — photoelectric emission is instantaneous when $\\nu > \\nu_0$; there is no time delay.\n\n**Reason R** is **incorrect** — a photon transfers energy to an electron only if its energy equals or exceeds the work function ($h\\nu \\geq \\phi$). A photon of **any** energy does NOT necessarily cause ejection; the frequency must exceed the threshold. The statement "photon of any energy" is wrong.\n\n**Answer: Option (2) — A is correct but R is not correct**`,
'tag_atom_5', src(2023,'Apr',11,'Morning')),

// Q21 - Energy of 1 mole photons at 2e12 Hz - NVT - Answer: 798
mkNVT('ATOM-221','Easy',
`The energy of one mole of photons of radiation of frequency $2 \\times 10^{12}$ Hz in J mol$^{-1}$ is ______ (nearest integer).\n\n[Given: $h = 6.626 \\times 10^{-34}$ Js, $N_A = 6.022 \\times 10^{23}$ mol$^{-1}$]`,
{ integer_value: 798 },
`**Energy per photon:**\n$$E = h\\nu = 6.626 \\times 10^{-34} \\times 2 \\times 10^{12} = 1.325 \\times 10^{-21}\\,\\text{J}$$\n\n**Energy per mole:**\n$$E_{mol} = E \\times N_A = 1.325 \\times 10^{-21} \\times 6.022 \\times 10^{23}$$\n\n$$= 7.98 \\times 10^2 = \\mathbf{798}\\,\\text{J mol}^{-1}$$\n\n**Answer: 798**`,
'tag_atom_5', src(2023,'Jan',25,'Evening')),

// Q22 - IE of metal A from 663 nm - NVT - Answer: 181
mkNVT('ATOM-222','Medium',
`Electromagnetic radiation of wavelength 663 nm is just sufficient to ionise the atom of metal A. The ionization energy of metal A in kJ mol$^{-1}$ is ______ (rounded to nearest integer).\n\n[$h = 6.63 \\times 10^{-34}$ Js, $c = 3.00 \\times 10^8$ ms$^{-1}$, $N_A = 6.02 \\times 10^{23}$ mol$^{-1}$]`,
{ integer_value: 181 },
`**Energy per photon:**\n$$E = \\frac{hc}{\\lambda} = \\frac{6.63 \\times 10^{-34} \\times 3.00 \\times 10^8}{663 \\times 10^{-9}}$$\n\n$$= \\frac{1.989 \\times 10^{-25}}{6.63 \\times 10^{-7}} = 3.0 \\times 10^{-19}\\,\\text{J}$$\n\n**IE per mole:**\n$$IE = 3.0 \\times 10^{-19} \\times 6.02 \\times 10^{23} = 1.806 \\times 10^5\\,\\text{J mol}^{-1}$$\n\n$$= \\mathbf{181}\\,\\text{kJ mol}^{-1}$$\n\n**Answer: 181**`,
'tag_atom_5', src(2021,'Feb',25,'Evening')),

// Q23 - Max orbitals n=4, ml=0 - NVT - Answer: 4
mkNVT('ATOM-223','Medium',
`The maximum number of orbitals which can be identified with $n = 4$ and $m_l = 0$ is ______.`,
{ integer_value: 4 },
`For $n = 4$, the possible subshells are: $l = 0, 1, 2, 3$ (i.e., 4s, 4p, 4d, 4f).\n\n$m_l = 0$ is allowed for every value of $l$:\n\n| Subshell | $l$ | $m_l = 0$ allowed? |\n|----------|-----|--------------------|\n| 4s | 0 | Yes (only $m_l = 0$) |\n| 4p | 1 | Yes ($m_l = -1, 0, +1$) |\n| 4d | 2 | Yes ($m_l = -2,-1,0,+1,+2$) |\n| 4f | 3 | Yes ($m_l = -3,...,0,...,+3$) |\n\nEach subshell contributes **one** orbital with $m_l = 0$.\n\n**Total = 4 orbitals**\n\n**Answer: 4**`,
'tag_atom_6', src(2024,'Apr',4,'Evening')),

// Q24 - Electrons with n=4, |ml|=1, ms=-1/2 - NVT - Answer: 6
mkNVT('ATOM-224','Hard',
`In an atom, total number of electrons having quantum numbers $n = 4$, $|m_l| = 1$ and $m_s = -\\frac{1}{2}$ is ______.`,
{ integer_value: 6 },
`**Condition:** $n = 4$, $|m_l| = 1$ (so $m_l = +1$ or $m_l = -1$), $m_s = -\\frac{1}{2}$\n\n**Find subshells where $|m_l| = 1$ is possible:**\n\n| Subshell | $l$ | $m_l$ values | $|m_l|=1$ possible? |\n|----------|-----|--------------|---------------------|\n| 4s | 0 | 0 only | No |\n| 4p | 1 | $-1, 0, +1$ | Yes: $m_l = \\pm 1$ → 2 orbitals |\n| 4d | 2 | $-2,-1,0,+1,+2$ | Yes: $m_l = \\pm 1$ → 2 orbitals |\n| 4f | 3 | $-3,...,+3$ | Yes: $m_l = \\pm 1$ → 2 orbitals |\n\n**Total orbitals with $|m_l| = 1$:** 2 + 2 + 2 = **6 orbitals**\n\nEach orbital has one electron with $m_s = -\\frac{1}{2}$.\n\n**Answer: 6**`,
'tag_atom_6', src(2024,'Apr',5,'Evening')),

// Q25 - Quantum numbers of outermost electron of K - Answer: (2)
mkSCQ('ATOM-225','Easy',
`The four quantum numbers for the electron in the outermost orbital of potassium (atomic number 19) are:`,
[
  '$n = 4,\\ l = 2,\\ m = -1,\\ s = +\\frac{1}{2}$',
  '$n = 4,\\ l = 0,\\ m = 0,\\ s = +\\frac{1}{2}$',
  '$n = 3,\\ l = 0,\\ m = -1,\\ s = +\\frac{1}{2}$',
  '$n = 2,\\ l = 0,\\ m = 0,\\ s = +\\frac{1}{2}$'
],
'b',
`**Electronic configuration of K (Z = 19):**\n$$[\\text{Ar}]\\,4s^1$$\n\nThe outermost electron is in the **4s** orbital:\n- $n = 4$ (4th shell)\n- $l = 0$ (s subshell)\n- $m_l = 0$ (only one orbital in s subshell)\n- $m_s = +\\frac{1}{2}$ (first electron in empty orbital, spin up by convention)\n\n**Answer: Option (2)** — $n = 4, l = 0, m = 0, s = +\\frac{1}{2}$`,
'tag_atom_6', src(2024,'Jan',31,'Evening')),

// Q26 - Unpaired electrons for magnetic moment 4.90 BM - NVT - Answer: 4
mkNVT('ATOM-226','Medium',
`For a metal ion, the calculated magnetic moment is 4.90 BM. This metal ion has ______ number of unpaired electrons.`,
{ integer_value: 4 },
`**Spin-only magnetic moment formula:**\n$$\\mu = \\sqrt{n(n+2)}\\,\\text{BM}$$\n\nwhere $n$ = number of unpaired electrons.\n\n**Solve for n:**\n$$4.90 = \\sqrt{n(n+2)}$$\n$$24.01 = n(n+2)$$\n$$n^2 + 2n - 24 = 0$$\n$$(n+6)(n-4) = 0$$\n$$n = 4$$\n\n**Verify:** $\\sqrt{4 \\times 6} = \\sqrt{24} = 4.899 \\approx 4.90$ BM ✓\n\n**Answer: 4**`,
'tag_atom_6', src(2023,'Jan',25,'Evening')),

// Q27 - Orbitals with electron density along axis - NVT - Answer: 5
mkNVT('ATOM-227','Medium',
`The number of given orbitals which have electron density along the axis is:\n\n$$p_x,\\ p_y,\\ p_z,\\ d_{xy},\\ d_{yz},\\ d_{xz},\\ d_{z^2},\\ d_{x^2-y^2}$$`,
{ integer_value: 5 },
`**Orbitals with electron density along the axes (axial orbitals):**\n\n| Orbital | Electron density along axis? |\n|---------|------------------------------|\n| $p_x$ | ✓ Along x-axis |\n| $p_y$ | ✓ Along y-axis |\n| $p_z$ | ✓ Along z-axis |\n| $d_{xy}$ | ✗ Between axes (diagonal) |\n| $d_{yz}$ | ✗ Between axes |\n| $d_{xz}$ | ✗ Between axes |\n| $d_{z^2}$ | ✓ Along z-axis |\n| $d_{x^2-y^2}$ | ✓ Along x and y axes |\n\n**Orbitals with density along axes:** $p_x, p_y, p_z, d_{z^2}, d_{x^2-y^2}$ = **5**\n\n**Answer: 5**`,
'tag_atom_6', src(2023,'Jan',25,'Evening')),

// Q28 - Not allowed quantum number set - Answer: (3)
mkSCQ('ATOM-228','Easy',
`Which of the following sets of quantum numbers is **not** allowed?`,
[
  '$n = 3,\\ l = 2,\\ m_l = 0,\\ s = +\\frac{1}{2}$',
  '$n = 3,\\ l = 2,\\ m_l = -2,\\ s = +\\frac{1}{2}$',
  '$n = 3,\\ l = 3,\\ m_l = -3,\\ s = -\\frac{1}{2}$',
  '$n = 3,\\ l = 0,\\ m_l = 0,\\ s = -\\frac{1}{2}$'
],
'c',
`**Rule:** For a given $n$, $l$ can range from $0$ to $n-1$.\n\n**Check Option (3):** $n = 3,\\ l = 3$\n\nFor $n = 3$: $l$ can be $0, 1, 2$ only. $l = 3$ is **not allowed** when $n = 3$.\n\n**Check others:**\n- (1): $n=3, l=2$ ✓ (l < n); $m_l = 0$ ✓ (|ml| ≤ l) \n- (2): $n=3, l=2$ ✓; $m_l = -2$ ✓ (|ml| ≤ 2)\n- (4): $n=3, l=0$ ✓; $m_l = 0$ ✓\n\n**Answer: Option (3)** — $l = 3$ is not allowed for $n = 3$`,
'tag_atom_6', src(2022,'Jul',25,'Morning')),

// Q29 - Correct sets of quantum numbers - NVT - Answer: 2
mkNVT('ATOM-229','Medium',
`Consider the following sets of quantum numbers:\n\n| | n | l | $m_l$ |\n|---|---|---|-------|\n| A | 3 | 3 | −3 |\n| B | 3 | 2 | −2 |\n| C | 2 | 1 | +1 |\n| D | 2 | 2 | +2 |\n\nThe number of **correct** sets of quantum numbers is ______.`,
{ integer_value: 2 },
`**Rule:** $l$ ranges from $0$ to $n-1$; $m_l$ ranges from $-l$ to $+l$.\n\n| Set | n | l | $m_l$ | Valid? | Reason |\n|-----|---|---|-------|--------|--------|\n| A | 3 | 3 | −3 | ✗ | $l$ must be $< n$; $l=3$ not allowed for $n=3$ |\n| B | 3 | 2 | −2 | ✓ | $l=2 < 3$; $|m_l|=2 \\leq l=2$ |\n| C | 2 | 1 | +1 | ✓ | $l=1 < 2$; $|m_l|=1 \\leq l=1$ |\n| D | 2 | 2 | +2 | ✗ | $l=2$ not allowed for $n=2$ (max $l=1$) |\n\n**Correct sets: B and C → 2**\n\n**Answer: 2**`,
'tag_atom_6', src(2022,'Jun',27,'Evening')),

// Q30 - Magnetic quantum number of outermost electron of Zn+ - NVT - Answer: 0
mkNVT('ATOM-230','Hard',
`The value of magnetic quantum number of the outermost electron of $\\mathrm{Zn^+}$ ion is ______ (Integer answer).`,
{ integer_value: 0 },
`**Electronic configuration of Zn (Z = 30):**\n$$[\\text{Ar}]\\,3d^{10}\\,4s^2$$\n\n**Zn⁺ loses one electron:**\n$$\\mathrm{Zn^+}: [\\text{Ar}]\\,3d^{10}\\,4s^1$$\n\n**Outermost electron** is in the **4s** orbital:\n- $n = 4$, $l = 0$, $m_l = \\mathbf{0}$\n\n(For s orbital, $l = 0$, so $m_l$ can only be $0$)\n\n**Answer: 0**`,
'tag_atom_6', src(2021,'Aug',31,'Evening')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
