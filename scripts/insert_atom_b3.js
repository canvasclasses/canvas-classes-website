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

const questions = [

// Q31 - Azimuthal QN for valence electrons of Ga+ - NVT - Answer: 0
mkNVT('ATOM-231','Medium',
`The Azimuthal quantum number for the valence electrons of $\\mathrm{Ga^+}$ ion is ______ (Atomic number of Ga = 31).`,
{ integer_value: 0 },
`**Electronic configuration of Ga (Z = 31):**\n$$[\\text{Ar}]\\,3d^{10}\\,4s^2\\,4p^1$$\n\n**Ga⁺ loses one electron (outermost 4p electron):**\n$$\\mathrm{Ga^+}: [\\text{Ar}]\\,3d^{10}\\,4s^2$$\n\n**Valence electrons** are in the **4s** subshell:\n- $l = 0$ for s subshell\n\n**Answer: 0**`,
'tag_atom_6', src(2021,'Jul',20,'Morning')),

// Q32 - Orbitals with n=5, ml=+2 - NVT - Answer: 3
mkNVT('ATOM-232','Medium',
`The number of orbitals with $n = 5$, $m_l = +2$ is ______ (Round off to the nearest integer).`,
{ integer_value: 3 },
`For $n = 5$, possible values of $l$: $0, 1, 2, 3, 4$\n\n$m_l = +2$ is allowed only when $l \\geq 2$:\n\n| Subshell | $l$ | $m_l = +2$ allowed? |\n|----------|-----|---------------------|\n| 5s | 0 | No |\n| 5p | 1 | No ($m_l$ max = ±1) |\n| 5d | 2 | Yes |\n| 5f | 3 | Yes |\n| 5g | 4 | Yes |\n\n**3 orbitals** (one from each of 5d, 5f, 5g)\n\n**Answer: 3**`,
'tag_atom_6', src(2021,'Mar',16,'Evening')),

// Q33 - Subshells with n=4, m=-2 - Answer: (2) = 2
mkSCQ('ATOM-233','Medium',
`The number of subshells associated with $n = 4$ and $m = -2$ quantum numbers is:`,
['8','2','16','4'],
'b',
`For $n = 4$, possible $l$ values: $0, 1, 2, 3$\n\n$m_l = -2$ is allowed only when $l \\geq 2$:\n\n| Subshell | $l$ | $m_l = -2$ allowed? |\n|----------|-----|---------------------|\n| 4s | 0 | No |\n| 4p | 1 | No |\n| 4d | 2 | Yes ($m_l = -2,-1,0,+1,+2$) |\n| 4f | 3 | Yes ($m_l = -3,...,+3$) |\n\n**2 subshells** (4d and 4f)\n\n**Answer: Option (2) — 2**`,
'tag_atom_6', src(2020,'Sep',2,'Evening')),

// Q34 - Orbitals with n=5, ms=+1/2 - Answer: (2) = 25
mkSCQ('ATOM-234','Medium',
`The number of orbitals associated with quantum numbers $n = 5$, $m_s = +\\frac{1}{2}$ is:`,
['11','25','50','15'],
'b',
`**Total orbitals in $n = 5$ shell:**\n$$\\text{Total orbitals} = n^2 = 5^2 = 25$$\n\nEach orbital can hold one electron with $m_s = +\\frac{1}{2}$ and one with $m_s = -\\frac{1}{2}$.\n\nThe quantum number $m_s$ does not restrict which **orbital** we're in — it specifies the spin of the **electron** in that orbital.\n\nAll **25 orbitals** in $n = 5$ can have an electron with $m_s = +\\frac{1}{2}$.\n\n**Answer: Option (2) — 25**`,
'tag_atom_6', src(2020,'Jan',7,'Morning')),

// Q35 - Electrons more likely found (radial distribution) - Answer: (3)
mkSCQ('ATOM-235','Medium',
`The electrons are more likely to be found:\n\n![Radial distribution graph showing regions a, b, c](https://cdn.mathpix.com/cropped/a79eb81f-2201-47b9-87cf-8e56a7926bae-04.jpg?height=265&width=263&top_left_y=129&top_left_x=797)\n\n(The graph shows radial probability distribution $4\\pi r^2 \\psi^2$ vs $r$ for a 2s orbital with regions a, b, c marked at the peaks and c being the outermost peak)`,
['Only in the region a','In the region a and b','In the region a and c','Only in the region c'],
'c',
`The graph shows the **radial probability distribution** $4\\pi r^2 \\psi^2$ vs $r$ for the **2s orbital**.\n\nThe 2s orbital has **2 peaks** (regions of high probability) separated by a radial node:\n- **Region a**: inner peak (closer to nucleus)\n- **Region b**: the radial node (probability = 0)\n- **Region c**: outer peak (farther from nucleus, higher probability)\n\nElectrons are **more likely** to be found at the **peaks** of the radial distribution function — regions **a** and **c**.\n\nRegion b is a **node** where probability = 0.\n\n**Answer: Option (3) — In the region a and c**`,
'tag_atom_6', src(2019,'Apr',12,'Morning')),

// Q36 - Plot of wavenumber vs 1/n^2 for emission from ni=8 - Answer: (3)
mkSCQ('ATOM-236','Hard',
`For emission line of atomic hydrogen from $n_i = 8$ to $n_f = n$, the plot of wave number $(\\bar{\\nu})$ against $\\left(\\dfrac{1}{n^2}\\right)$ will be: (The Rydberg constant $R_H$ is in wave number unit)`,
['Linear with slope $-R_H$','Non linear','Linear with slope $R_H$','Linear with intercept $-R_H$'],
'c',
`**Rydberg formula for emission:**\n$$\\bar{\\nu} = R_H\\left(\\frac{1}{n_f^2} - \\frac{1}{n_i^2}\\right) = R_H\\left(\\frac{1}{n^2} - \\frac{1}{64}\\right)$$\n\n$$\\bar{\\nu} = R_H \\cdot \\frac{1}{n^2} - \\frac{R_H}{64}$$\n\nThis is of the form $y = mx + c$ where:\n- $y = \\bar{\\nu}$\n- $x = \\dfrac{1}{n^2}$\n- **slope** $m = R_H$ (positive)\n- intercept $= -\\dfrac{R_H}{64}$\n\n**Linear with slope $R_H$**\n\n**Answer: Option (3)**`,
'tag_atom_4', src(2019,'Jan',9,'Morning')),

// Q37 - Energy ordering for multielectron system - Answer: (4)
mkSCQ('ATOM-237','Hard',
`Compare the energies of following sets of quantum numbers for a **multielectron** system:\n\n**(A)** $n=4, l=1$ (4p)\n**(B)** $n=4, l=2$ (4d)\n**(C)** $n=3, l=1$ (3p)\n**(D)** $n=3, l=2$ (3d)\n**(E)** $n=4, l=0$ (4s)\n\nChoose the correct answer:`,
['(B) > (A) > (C) > (E) > (D)','(E) < (C) < (D) < (A) < (B)','(E) > (C) > (A) > (D) > (B)','(C) < (E) < (D) < (A) < (B)'],
'd',
`**For multielectron atoms**, use $(n + l)$ rule:\n\n| Orbital | $n$ | $l$ | $n+l$ | Energy rank |\n|---------|-----|-----|-------|-------------|\n| (C) 3p | 3 | 1 | 4 | Lowest |\n| (E) 4s | 4 | 0 | 4 | Same n+l as 3p, but lower n → 3p < 4s |\n| (D) 3d | 3 | 2 | 5 | — |\n| (A) 4p | 4 | 1 | 5 | Same n+l as 3d, but lower n → 3d < 4p |\n| (B) 4d | 4 | 2 | 6 | Highest |\n\n**Energy order (increasing):** 3p < 4s < 3d < 4p < 4d\n$$\\text{(C) < (E) < (D) < (A) < (B)}$$\n\n**Answer: Option (4)**`,
'tag_atom_7', src(2024,'Apr',9,'Morning')),

// Q38 - Match element to electronic config - MTC - Answer: (1)
mkMTC('ATOM-238','Easy',
`Match List-I with List-II:\n\n| List-I (Element) | List-II (Electronic configuration) |\n|------------------|-------------------------------------|\n| A. N | I. $[\\text{Ar}]\\,3d^{10}\\,4s^2\\,4p^5$ |\n| B. S | II. $[\\text{Ne}]\\,3s^2\\,3p^4$ |\n| C. Br | III. $[\\text{He}]\\,2s^2\\,2p^3$ |\n| D. Kr | IV. $[\\text{Ar}]\\,3d^{10}\\,4s^2\\,4p^6$ |\n\nChoose the correct answer:`,
['A-III, B-II, C-I, D-IV','A-II, B-I, C-IV, D-III','A-I, B-IV, C-III, D-II','A-IV, B-III, C-II, D-I'],
'a',
`**Electronic configurations:**\n\n- **N (Z=7):** $[\\text{He}]\\,2s^2\\,2p^3$ → **III**\n- **S (Z=16):** $[\\text{Ne}]\\,3s^2\\,3p^4$ → **II**\n- **Br (Z=35):** $[\\text{Ar}]\\,3d^{10}\\,4s^2\\,4p^5$ → **I**\n- **Kr (Z=36):** $[\\text{Ar}]\\,3d^{10}\\,4s^2\\,4p^6$ → **IV**\n\n**Matching: A-III, B-II, C-I, D-IV**\n\n**Answer: Option (1)**`,
'tag_atom_7', src(2024,'Apr',9,'Evening')),

// Q39 - Electronic config of Neodymium (Z=60) - Answer: (1)
mkSCQ('ATOM-239','Medium',
`The electronic configuration for Neodymium is:\n\n[Atomic Number for Neodymium = 60]`,
['$[\\text{Xe}]\\,4f^4\\,6s^2$','$[\\text{Xe}]\\,5f^4\\,7s^2$','$[\\text{Xe}]\\,4f^6\\,6s^2$','$[\\text{Xe}]\\,4f^1\\,5d^1\\,6s^2$'],
'a',
`**Xe has Z = 54**, so Nd (Z = 60) has 6 electrons beyond Xe.\n\nFilling order after Xe: $6s^2$ first, then $4f$:\n$$\\text{Nd}: [\\text{Xe}]\\,4f^4\\,6s^2$$\n\n(6 − 2 = 4 electrons in 4f)\n\n**Verify:** 54 + 2 + 4 = 60 ✓\n\n**Answer: Option (1)** — $[\\text{Xe}]\\,4f^4\\,6s^2$`,
'tag_atom_7', src(2024,'Jan',27,'Morning')),

// Q40 - Increasing energy order of 4 electrons - Answer: (2)
mkSCQ('ATOM-240','Hard',
`Given below are the quantum numbers for 4 electrons:\n\n**A.** $n=3, l=2, m_l=1, m_s=+\\frac{1}{2}$ (3d)\n**B.** $n=4, l=1, m_l=0, m_s=+\\frac{1}{2}$ (4p)\n**C.** $n=4, l=2, m_l=-2, m_s=-\\frac{1}{2}$ (4d)\n**D.** $n=3, l=1, m_l=-1, m_s=+\\frac{1}{2}$ (3p)\n\nThe correct order of **increasing energy** is:`,
['D < B < A < C','D < A < B < C','B < D < A < C','B < D < C < A'],
'b',
`**Use $(n+l)$ rule for multielectron atoms:**\n\n| Electron | $n$ | $l$ | $n+l$ | Subshell |\n|----------|-----|-----|-------|----------|\n| D | 3 | 1 | 4 | 3p |\n| A | 3 | 2 | 5 | 3d |\n| B | 4 | 1 | 5 | 4p |\n| C | 4 | 2 | 6 | 4d |\n\n**When $n+l$ is same** (A and B both have $n+l=5$): lower $n$ has lower energy → 3d (A) < 4p (B)\n\n**Energy order:** 3p < 3d < 4p < 4d\n$$D < A < B < C$$\n\n**Answer: Option (2)**`,
'tag_atom_7', src(2022,'Jul',29,'Evening')),

// Q41 - Electronic config of Pt (Z=78) - Answer: (4)
mkSCQ('ATOM-241','Hard',
`The electronic configuration of Pt (atomic number 78) is:`,
['$[\\text{Kr}]\\,4f^{14}\\,5d^{10}$','$[\\text{Xe}]\\,4f^{14}\\,5d^{10}$','$[\\text{Xe}]\\,4f^{14}\\,5d^8\\,6s^2$','$[\\text{Xe}]\\,4f^{14}\\,5d^9\\,6s^1$'],
'd',
`**Xe has Z = 54.** Pt (Z = 78) has 24 electrons beyond Xe.\n\n**Expected filling:** $4f^{14}\\,5d^8\\,6s^2$ (option 3)\n\n**However, Pt is an exception** (like Pd, Au) — one electron from 6s moves to 5d for extra stability:\n$$\\text{Pt}: [\\text{Xe}]\\,4f^{14}\\,5d^9\\,6s^1$$\n\n**Verify:** 14 + 9 + 1 = 24 electrons beyond Xe ✓ (54 + 24 = 78)\n\n**Answer: Option (4)**`,
'tag_atom_7', src(2022,'Jun',29,'Morning')),

// Q42 - Electrons in p-orbitals of Vanadium (Z=23) - NVT - Answer: 12
mkNVT('ATOM-242','Medium',
`Number of electrons that Vanadium ($Z = 23$) has in p-orbitals is equal to ______.`,
{ integer_value: 12 },
`**Electronic configuration of V (Z = 23):**\n$$1s^2\\,2s^2\\,2p^6\\,3s^2\\,3p^6\\,3d^3\\,4s^2$$\nor $[\\text{Ar}]\\,3d^3\\,4s^2$\n\n**Count electrons in p-orbitals:**\n- $2p^6$: 6 electrons\n- $3p^6$: 6 electrons\n- Total p-electrons = 6 + 6 = **12**\n\n**Answer: 12**`,
'tag_atom_7', src(2021,'Jul',22,'Morning')),

// Q43 - 71st electron of element with Z=71 enters which orbital - Answer: (1)
mkSCQ('ATOM-243','Medium',
`The $71^{\\text{st}}$ electron of an element X with an atomic number of 71 enters the orbital:`,
['5d','4f','6p','6s'],
'a',
`**Electronic configuration of element Z = 71 (Lutetium):**\n\nFilling order: $[\\text{Xe}]\\,4f^{14}\\,5d^1\\,6s^2$\n\nXe has 54 electrons. Beyond Xe:\n- $6s^2$: electrons 55, 56\n- $4f^{14}$: electrons 57–70\n- $5d^1$: electron **71**\n\nThe **71st electron** enters the **5d** orbital.\n\n**Answer: Option (1) — 5d**`,
'tag_atom_7', src(2019,'Jan',10,'Evening')),

// Q44 - Moseley's graph (sqrt(v) vs Z) - Answer: (3)
mkSCQ('ATOM-244','Medium',
`Henry Moseley studied characteristic X-ray spectra of elements. The graph which represents his observation correctly is:\n\n(Given: $v$ = Frequency of X-ray emitted, $Z$ = Atomic number)\n\n![Option 1](https://cdn.mathpix.com/cropped/a79eb81f-2201-47b9-87cf-8e56a7926bae-05.jpg?height=219&width=240&top_left_y=442&top_left_x=253)\n![Option 2](https://cdn.mathpix.com/cropped/a79eb81f-2201-47b9-87cf-8e56a7926bae-05.jpg?height=231&width=265&top_left_y=438&top_left_x=623)\n![Option 3](https://cdn.mathpix.com/cropped/a79eb81f-2201-47b9-87cf-8e56a7926bae-05.jpg?height=227&width=270&top_left_y=438&top_left_x=993)\n![Option 4](https://cdn.mathpix.com/cropped/a79eb81f-2201-47b9-87cf-8e56a7926bae-05.jpg?height=253&width=276&top_left_y=438&top_left_x=1367)`,
['Option (1): $v$ vs $Z$ — curved','Option (2): $v$ vs $Z$ — linear','Option (3): $\\sqrt{v}$ vs $Z$ — linear','Option (4): $\\sqrt{v}$ vs $Z$ — curved'],
'c',
`**Moseley's Law:**\n$$\\sqrt{\\nu} = a(Z - b)$$\n\nwhere $a$ and $b$ are constants.\n\nThis means **$\\sqrt{\\nu}$ is linearly proportional to $Z$** (atomic number).\n\nThe correct graph shows a **straight line** when $\\sqrt{\\nu}$ is plotted against $Z$.\n\n**Answer: Option (3)** — Linear plot of $\\sqrt{v}$ vs $Z$`,
'tag_atom_1', src(2023,'Apr',8,'Evening')),

// Q45 - True statements about cathode ray electrons - NVT - Answer: 2
mkNVT('ATOM-245','Medium',
`Electrons in a cathode ray tube have been emitted with a velocity of 1000 ms$^{-1}$. The number of following statements which is/are **true** about the emitted radiation is:\n\n[Given: $h = 6 \\times 10^{-34}$ Js, $m_e = 9 \\times 10^{-31}$ kg]\n\n**(A)** The de Broglie wavelength of the electron emitted is 666.67 nm\n**(B)** The characteristics of electrons emitted depend upon the material of the electrodes of the cathode ray tube.\n**(C)** The cathode rays start from cathode and move towards anode.\n**(D)** The nature of the emitted electrons depends on the nature of the gas present in cathode ray tube.`,
{ integer_value: 2 },
`**Check each statement:**\n\n**(A)** de Broglie wavelength:\n$$\\lambda = \\frac{h}{mv} = \\frac{6 \\times 10^{-34}}{9 \\times 10^{-31} \\times 1000} = \\frac{6 \\times 10^{-34}}{9 \\times 10^{-28}} = 6.67 \\times 10^{-7}\\,\\text{m} = 666.7\\,\\text{nm}$$\n**✓ True**\n\n**(B)** Electrons are fundamental particles — their properties do **not** depend on electrode material. **✗ False**\n\n**(C)** Cathode rays travel from **cathode to anode** (negative to positive). **✓ True**\n\n**(D)** Electrons are identical regardless of gas used — their nature does **not** depend on the gas. **✗ False**\n\n**True statements: (A) and (C) → 2**\n\n**Answer: 2**`,
'tag_atom_1', src(2023,'Feb',1,'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
