const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');

const CHAPTER_ID = 'ch11_atom';

function mkSCQ(id, diff, text, opts, cid, sol, tag) {
  return {
    _id: uuidv4(), display_id: id, type: 'SCQ',
    question_text: { markdown: text, latex_validated: false },
    options: [
      { id: 'a', text: opts[0], is_correct: cid === 'a' },
      { id: 'b', text: opts[1], is_correct: cid === 'b' },
      { id: 'c', text: opts[2], is_correct: cid === 'c' },
      { id: 'd', text: opts[3], is_correct: cid === 'd' },
    ],
    answer: { correct_option: cid },
    solution: { text_markdown: sol, latex_validated: false },
    metadata: {
      difficulty: diff, chapter_id: CHAPTER_ID,
      tags: [{ tag_id: tag, weight: 1.0 }],
      exam_source: 'Other', is_pyq: false, is_top_pyq: false,
    },
    status: 'published', version: 1, quality_score: 85,
    needs_review: false, created_by: 'admin', updated_by: 'admin',
    created_at: new Date(), updated_at: new Date(), deleted_at: null,
  };
}

function mkNVT(id, diff, text, ans, sol, tag) {
  return {
    _id: uuidv4(), display_id: id, type: 'NVT',
    question_text: { markdown: text, latex_validated: false },
    options: [],
    answer: ans,
    solution: { text_markdown: sol, latex_validated: false },
    metadata: {
      difficulty: diff, chapter_id: CHAPTER_ID,
      tags: [{ tag_id: tag, weight: 1.0 }],
      exam_source: 'Other', is_pyq: false, is_top_pyq: false,
    },
    status: 'published', version: 1, quality_score: 85,
    needs_review: false, created_by: 'admin', updated_by: 'admin',
    created_at: new Date(), updated_at: new Date(), deleted_at: null,
  };
}

const questions = [

// Q7 (Image 1) — Ratio of slopes of Kmax-frequency and Vs-frequency curves
mkSCQ('ATOM-396', 'Medium',
`The ratio of slopes of $ K_{\\max} $-frequency and $ V_s $-frequency curves in the photoelectric effect gives`,
[
  'charge of $ e^- $',
  "Planck's constant",
  'work function of emitter',
  '$ h/e $',
],
'a',
`**Step 1: Kmax–frequency curve**

From Einstein's photoelectric equation: $ K_{\\max} = h\\nu - \\phi $

This is a straight line $ y = mx + c $ where slope $ = h $ (Planck's constant).

**Step 2: Vs–frequency curve**

Stopping potential: $ V_s = \\frac{K_{\\max}}{e} = \\frac{h\\nu}{e} - \\frac{\\phi}{e} $

Slope of $ V_s $ vs $ \\nu $ curve $ = \\frac{h}{e} $

**Step 3: Ratio of slopes**

$$\\frac{\\text{slope of } K_{\\max}\\text{-frequency}}{\\text{slope of } V_s\\text{-frequency}} = \\frac{h}{h/e} = e$$

The ratio gives the **charge of the electron** $ e $.

**Final Answer:** Charge of $ e^- $ → **Option (a)**`,
'tag_atom_1'),

// Q3 (Image 3) — H-atom radius 5.3→21.2×10⁻¹¹m, find n
mkSCQ('ATOM-397', 'Easy',
`The radius of the H-atom in its ground state is $ 5.3 \\times 10^{-11} $ m. After collision with an $ e^- $, it is found to have a radius of $ 21.2 \\times 10^{-11} $ m. The principal quantum number of the final state of the atom is`,
[
  '2',
  '3',
  '4',
  '16',
],
'a',
`**Step 1: Bohr radius formula**

$$r_n = n^2 \\times r_1$$

where $ r_1 = 5.3 \\times 10^{-11} $ m (ground state radius).

**Step 2: Find n**

$$21.2 \\times 10^{-11} = n^2 \\times 5.3 \\times 10^{-11}$$

$$n^2 = \\frac{21.2}{5.3} = 4 \\Rightarrow n = 2$$

**Final Answer:** $ n = 2 $ → **Option (a)**`,
'tag_atom_3'),

// Q4 (Image 3) — Speed 0.547×10⁶ ms⁻¹, find orbital radius
mkSCQ('ATOM-398', 'Medium',
`The speed of $ e^- $ revolving around H-nucleus is $ 0.547 \\times 10^6 $ ms$ ^{-1} $. The distance of $ e^- $ from the nucleus is`,
[
  '$ 2.116 $ Å',
  '$ 4.761 $ Å',
  '$ 8.464 $ Å',
  '$ 0.529 $ Å',
],
'c',
`**Step 1: Bohr velocity formula**

$$v_n = \\frac{2.18 \\times 10^6}{n} \\text{ ms}^{-1} \\quad (\\text{for H-atom, } Z=1)$$

**Step 2: Find n**

$$0.547 \\times 10^6 = \\frac{2.18 \\times 10^6}{n}$$

$$n = \\frac{2.18}{0.547} = \\frac{2.18}{0.547} \\approx 4$$

**Step 3: Find radius**

$$r_n = 0.529 \\times n^2 \\text{ Å} = 0.529 \\times 16 = 8.464 \\text{ Å}$$

**Final Answer:** $ 8.464 $ Å → **Option (c)**`,
'tag_atom_3'),

// Q5 (Image 4) — Maxwell's theory, λ of radiation from H-atom GS revolution
mkSCQ('ATOM-399', 'Hard',
`According to Maxwell's theory of electrodynamics, an $ e^- $ going in a circle should emit radiation of frequency equal to its frequency of revolution. What should be the wavelength of the radiation emitted by a H-atom in the ground state if this rule is followed?`,
[
  '4500 nm',
  '450 nm',
  '45 nm',
  '4.5 nm',
],
'c',
`**Step 1: Period of revolution in ground state**

In Bohr's ground state ($ n = 1 $):
- Radius: $ r_1 = 0.529 $ Å $ = 0.529 \\times 10^{-10} $ m
- Velocity: $ v_1 = 2.18 \\times 10^6 $ ms$ ^{-1} $

Time period:
$$T = \\frac{2\\pi r_1}{v_1} = \\frac{2\\pi \\times 0.529 \\times 10^{-10}}{2.18 \\times 10^6}$$

$$T = \\frac{3.323 \\times 10^{-10}}{2.18 \\times 10^6} = 1.524 \\times 10^{-16} \\text{ s}$$

**Step 2: Wavelength of emitted radiation**

According to Maxwell's theory, $ \\nu_{\\text{radiation}} = \\nu_{\\text{revolution}} = 1/T $

$$\\lambda = c \\times T = 3 \\times 10^8 \\times 1.524 \\times 10^{-16}$$

$$\\lambda = 4.57 \\times 10^{-8} \\text{ m} \\approx 45 \\text{ nm}$$

**Final Answer:** 45 nm → **Option (c)**`,
'tag_atom_3'),

// Q6 (Image 5) — Even orbits only, max λ in visible = 16/3R
mkSCQ('ATOM-400', 'Hard',
`Suppose that in any Bohr atom or ion, orbits are only in even numbers like 2, 4, 6, ... The maximum wavelength of radiation emitted in the visible region of H-spectrum should be`,
[
  '$ 4/R $',
  '$ R/4 $',
  '$ 36/5R $',
  '$ 16/3R $',
],
'd',
`**Step 1: Available orbits**

Only even orbits: $ n = 2, 4, 6, 8, \\ldots $

**Step 2: Visible region = Balmer series**

In normal H-spectrum, Balmer series has $ n_1 = 2 $. With only even orbits, the lowest available orbit is $ n = 2 $, and the next is $ n = 4 $.

**Step 3: Maximum wavelength = minimum energy transition**

Minimum energy transition in visible region: $ n = 4 \\to n = 2 $

$$\\frac{1}{\\lambda_{\\max}} = R_H \\left(\\frac{1}{2^2} - \\frac{1}{4^2}\\right) = R_H \\left(\\frac{1}{4} - \\frac{1}{16}\\right) = R_H \\times \\frac{3}{16}$$

$$\\lambda_{\\max} = \\frac{16}{3R_H}$$

**Final Answer:** $ \\dfrac{16}{3R} $ → **Option (d)**`,
'tag_atom_4'),

// Q7 (Image 5) — Binding energy H-like ion, 3rd Balmer line 108.5nm
mkSCQ('ATOM-401', 'Hard',
`The binding energy of an $ e^- $ in the ground state of H-like ions in whose spectrum the third line of Balmer series is equal to 108.5 nm, is`,
[
  '13.6 eV',
  '54.4 eV',
  '122.4 eV',
  '14.4 eV',
],
'b',
`**Step 1: Identify the third line of Balmer series**

Balmer series: $ n_1 = 2 $. Lines: $ n_2 = 3, 4, 5, \\ldots $

Third line: $ n_2 = 5 \\to n_1 = 2 $

**Step 2: Find energy of this transition**

$$\\Delta E = \\frac{hc}{\\lambda} = \\frac{1240 \\text{ eV·nm}}{108.5 \\text{ nm}} = 11.43 \\text{ eV}$$

**Step 3: Relate to binding energy**

For H-like ion with atomic number $ Z $:

$$\\Delta E = BE \\left(\\frac{1}{n_1^2} - \\frac{1}{n_2^2}\\right) = BE \\left(\\frac{1}{4} - \\frac{1}{25}\\right) = BE \\times \\frac{21}{100}$$

$$BE = \\frac{11.43 \\times 100}{21} = 54.4 \\text{ eV}$$

**Verification:** $ BE = 13.6 \\times Z^2 = 54.4 \\Rightarrow Z^2 = 4 \\Rightarrow Z = 2 $ (He⁺ ion) ✓

**Final Answer:** 54.4 eV → **Option (b)**`,
'tag_atom_4'),

// Q8 (Image 6) — E1, E2, E3 KE with same De Broglie wavelength
mkSCQ('ATOM-402', 'Medium',
`If $ E_1 $, $ E_2 $ and $ E_3 $ are the KE of an $ e^- $, an $ \\alpha $-particle and a proton, with the same De-Broglie wavelength, then`,
[
  '$ E_1 > E_3 > E_2 $',
  '$ E_2 > E_3 > E_1 $',
  '$ E_1 > E_2 > E_3 $',
  '$ E_1 = E_2 = E_3 $',
],
'a',
`**Step 1: De Broglie wavelength and KE**

$$\\lambda = \\frac{h}{\\sqrt{2mE}} \\Rightarrow E = \\frac{h^2}{2m\\lambda^2}$$

For same $ \\lambda $: $ E \\propto \\frac{1}{m} $

**Step 2: Compare masses**

| Particle | Mass |
|---|---|
| Electron ($ E_1 $) | $ m_e = 9.1 \\times 10^{-31} $ kg |
| Proton ($ E_3 $) | $ m_p = 1836\\,m_e $ |
| $ \\alpha $-particle ($ E_2 $) | $ m_\\alpha = 4 \\times 1836\\,m_e = 7344\\,m_e $ |

**Step 3: Order of KE**

Since $ E \\propto 1/m $ and $ m_e < m_p < m_\\alpha $:

$$E_1 > E_3 > E_2$$

**Numerical check:**

$$m_e \\times E_1 = 4 \\times 1836\\,m_e \\times E_2 = 1836\\,m_e \\times E_3$$

$$E_1 = 4 \\times 1836\\,E_2 \\quad \\text{and} \\quad E_1 = 1836\\,E_3$$

**Final Answer:** $ E_1 > E_3 > E_2 $ → **Option (a)**`,
'tag_atom_5'),

// NVT1 (Image 6) — Correct statements about orbitals (A, D, E correct = 3)
mkNVT('ATOM-403', 'Medium',
`The number of correct statements from the following is ______\n\n**A.** For 1s orbital, the probability density is maximum at the nucleus.\n**B.** For 2s orbital, the probability density first increases to maximum and then decreases sharply to zero.\n**C.** Boundary surface diagrams of the orbitals enclose a region of 100% probability of finding the $ e^- $.\n**D.** p and d orbitals have 1 and 2 angular nodes respectively.\n**E.** Probability density of the p-orbital is zero at the nucleus.`,
{ integer_value: 3 },
`**Evaluating each statement:**

**A ✓** — For 1s orbital, $ \\psi^2 \\propto e^{-2r/a_0} $, which is maximum at $ r = 0 $ (the nucleus). The probability **density** (not probability) is indeed maximum at the nucleus for 1s. ✅

**B ✗** — For 2s orbital, the radial probability density $ 4\\pi r^2 \\psi^2 $ starts at zero (at nucleus), increases to a maximum, drops to zero at the radial node, then rises to a second maximum, and finally decreases to zero. The description "increases to maximum then decreases sharply to zero" is incomplete/incorrect — it has two maxima. ✗

**C ✗** — Boundary surface diagrams enclose a region of **90–95% probability**, NOT 100%. A 100% boundary would extend to infinity. ✗

**D ✓** — Angular nodes = $ l $. For p-orbitals: $ l = 1 $ → 1 angular node. For d-orbitals: $ l = 2 $ → 2 angular nodes. ✅

**E ✓** — For p-orbitals, $ \\psi $ contains an angular factor that is zero along the nodal plane passing through the nucleus. Therefore $ \\psi^2 = 0 $ at the nucleus for p-orbitals. ✅

**Correct statements: A, D, E → Answer: 3**`,
'tag_atom_6'),

// NVT2 (Image 7) — Quantum number statements, A, C, D correct = 3
mkNVT('ATOM-404', 'Medium',
`Consider the following statements. Which of the above statements are correct? (Enter the number of correct statements)\n\n**A.** The principal quantum number $ n $ is a positive integer with values of $ n = 1, 2, 3, \\ldots $\n**B.** The azimuthal quantum number $ l $ for a given $ n $ can have values as $ l = 0, 1, 2, \\ldots n $, and has $ (2n+1) $ values.\n**C.** Magnetic quantum number $ m $ for a particular $ l $ can have $ (2l+1) $ values.\n**D.** $ \\pm \\frac{1}{2} $ are two possible orientations of electron spin.\n**E.** For $ l = 5 $, there will be a total of 9 orbitals.`,
{ integer_value: 3 },
`**Evaluating each statement:**

**A ✓** — $ n = 1, 2, 3, \\ldots $ (positive integers). ✅

**B ✗** — $ l $ ranges from $ 0 $ to $ n-1 $ (NOT $ n $), giving $ n $ values (not $ 2n+1 $). The statement says $ l = 0, 1, 2, \\ldots n $ which is wrong — it should be $ 0 $ to $ n-1 $. ✗

**C ✓** — For a given $ l $, $ m_l $ ranges from $ -l $ to $ +l $, giving $ 2l+1 $ values. ✅

**D ✓** — Spin quantum number $ m_s = +\\frac{1}{2} $ (spin up) or $ -\\frac{1}{2} $ (spin down) — two orientations. ✅

**E ✗** — For $ l = 5 $: number of orbitals $ = 2l+1 = 11 $, not 9. ($ l = 4 $ gives 9 orbitals.) ✗

**Correct statements: A, C, D → Answer: 3**`,
'tag_atom_7'),

// NVT (Image 9) — electrons in completely filled subshells n=4, s=+1/2 = 16
mkNVT('ATOM-405', 'Medium',
`The number of $ e^- $ present in all the completely filled subshells having $ n = 4 $ and $ s = +\\frac{1}{2} $ is ______`,
{ integer_value: 16 },
`**Step 1: Subshells with n = 4**

For $ n = 4 $: $ l = 0, 1, 2, 3 $ → subshells: 4s, 4p, 4d, 4f

**Step 2: Electrons with $ m_s = +\\frac{1}{2} $ in each completely filled subshell**

In a completely filled subshell, each orbital has exactly 2 electrons (one with $ m_s = +1/2 $, one with $ m_s = -1/2 $). So the number of electrons with $ s = +1/2 $ = number of orbitals in that subshell.

| Subshell | $ l $ | No. of orbitals | $ e^- $ with $ s = +1/2 $ |
|---|---|---|---|
| 4s | 0 | 1 | 1 |
| 4p | 1 | 3 | 3 |
| 4d | 2 | 5 | 5 |
| 4f | 3 | 7 | 7 |

**Step 3: Total**

$$1 + 3 + 5 + 7 = 16$$

**Final Answer: 16**`,
'tag_atom_7'),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
