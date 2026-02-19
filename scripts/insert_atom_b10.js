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

const questions = [

// Q28 — Revolutions per second in Bohr orbit ∝ n^-3
mkSCQ('ATOM-363', 'Medium',
`For H-atom, the number of revolutions per second of $ e^- $ in the orbit of quantum number $ n $ is proportional to`,
[
  '$ n^3 $',
  '$ \\sqrt{n} $',
  '$ n^{-3} $',
  '$ n^{-1} $',
],
'c',
`**Step 1: Bohr orbit velocity**

Velocity of electron in $ n $-th orbit: $ v_n \\propto \\frac{1}{n} $

**Step 2: Bohr orbit radius**

Radius of $ n $-th orbit: $ r_n \\propto n^2 $

**Step 3: Revolutions per second**

$$\\nu = \\frac{v_n}{2\\pi r_n} \\propto \\frac{1/n}{n^2} = \\frac{1}{n^3} = n^{-3}$$

**Final Answer:** $ \\nu \\propto n^{-3} $ → **Option (c)**`,
'tag_atom_3'),

// Q29 — He+ ion, double angular momentum → n=4, energy needed
mkSCQ('ATOM-364', 'Hard',
`How much energy is needed for an $ e^- $ revolving in the 2nd orbit of $ \\mathrm{He^+} $ ion to double its angular momentum?`,
[
  '40.8 eV',
  '2.55 eV',
  '10.2 eV',
  '12.09 eV',
],
'c',
`**Step 1: Angular momentum in Bohr model**

$ L = \\frac{nh}{2\\pi} $. Doubling $ L $ means $ n: 2 \\to 4 $.

**Step 2: Energy of $ \\mathrm{He^+} $ (Z = 2)**

$$E_n = -13.6 \\times \\frac{Z^2}{n^2} \\text{ eV} = -13.6 \\times \\frac{4}{n^2} \\text{ eV}$$

$$E_2 = -13.6 \\times \\frac{4}{4} = -13.6 \\text{ eV}$$

$$E_4 = -13.6 \\times \\frac{4}{16} = -3.4 \\text{ eV}$$

**Step 3: Energy needed**

$$\\Delta E = E_4 - E_2 = -3.4 - (-13.6) = +10.2 \\text{ eV}$$

**Final Answer:** 10.2 eV → **Option (c)**`,
'tag_atom_3'),

// Q30 — Hypothetical atom IE=50eV, Bohr model, 5th orbit energy
mkSCQ('ATOM-365', 'Medium',
`I.E. of a hypothetical atom is 50 eV. If this atom obeys Bohr's atomic model, the energy of $ e^- $ in its $ 5^{\\text{th}} $ orbit will be`,
[
  '$ -1250 $ eV',
  '$ +2 $ eV',
  '$ -2 $ eV',
  '$ +1250 $ eV',
],
'c',
`**Step 1: Identify ground state energy**

I.E. = energy needed to remove electron from ground state ($ n = 1 $).

In Bohr model: $ E_1 = -\\text{I.E.} = -50 $ eV

**Step 2: Energy in nth orbit**

$$E_n = \\frac{E_1}{n^2}$$

**Step 3: Calculate $ E_5 $**

$$E_5 = \\frac{-50}{5^2} = \\frac{-50}{25} = -2 \\text{ eV}$$

**Final Answer:** $ -2 $ eV → **Option (c)**`,
'tag_atom_3'),

// Q31 — Emission transition, identify series from radii
mkSCQ('ATOM-366', 'Medium',
`An emission transition starts from the orbit having radius 1.3225 nm and ends at 211.6 pm. Name the series to which this transition belongs and the region of the spectrum.`,
[
  'Lyman, UV',
  'Balmer, visible',
  'Paschen, IR',
  'Brackett, IR',
],
'b',
`**Step 1: Bohr radius formula**

$ r_n = 0.0529 \\times n^2 $ nm (for H-atom)

**Step 2: Find orbit numbers**

Starting orbit: $ r = 1.3225 $ nm
$$n^2 = \\frac{1.3225}{0.0529} = 25 \\Rightarrow n = 5$$

Ending orbit: $ r = 211.6 $ pm $ = 0.2116 $ nm
$$n^2 = \\frac{0.2116}{0.0529} = 4 \\Rightarrow n = 2$$

**Step 3: Identify series**

Transition $ n = 5 \\to n = 2 $: this is the **Balmer series** (ends at $ n = 2 $).

Balmer series lies in the **visible** region of the spectrum.

**Final Answer:** Balmer, visible → **Option (b)**`,
'tag_atom_4'),

// Q32 — Balmer series correct statements
mkSCQ('ATOM-367', 'Medium',
`For the Balmer series in the spectrum of H-atom, $ \\bar{\\nu} = R_H \\left( \\frac{1}{n_1^2} - \\frac{1}{n_2^2} \\right) $, the correct statements among I to IV are:\n\n**I.** As wavelength decreases, the lines in the series converge.\n**II.** The integer $ n_1 = 2 $.\n**III.** For the line having maximum wavelength, $ n_2 = 3 $.\n**IV.** I.E. of H can be calculated from wave number of these lines.`,
[
  'I, II, IV',
  'II, III, IV',
  'I, III, IV',
  'I, II, III',
],
'd',
`**Evaluating each statement:**

**I ✓** — As wavelength decreases, $ \\bar{\\nu} $ increases, meaning $ n_2 $ increases. As $ n_2 \\to \\infty $, lines converge to the series limit. ✅

**II ✓** — Balmer series: transitions end at $ n_1 = 2 $. ✅

**III ✓** — Maximum wavelength = minimum $ \\bar{\\nu} $ = smallest $ n_2 $. For Balmer, minimum $ n_2 = 3 $. ✅

**IV ✗** — I.E. corresponds to $ n_1 = 1, n_2 = \\infty $ (Lyman series limit). Balmer series lines ($ n_1 = 2 $) give the energy to ionize from $ n = 2 $, not from ground state. I.E. cannot be directly calculated from Balmer lines alone without additional data. ✗

**Correct statements: I, II, III → Answer: Option (d)**`,
'tag_atom_4'),

// Q33 — Shortest λ Lyman H vs longest λ Balmer He+
mkSCQ('ATOM-368', 'Hard',
`The shortest wavelength of H-atom in the Lyman series is $ \\lambda_1 $. The longest wavelength in the Balmer series of $ \\mathrm{He^+} $ is`,
[
  '$ \\dfrac{36\\lambda_1}{5} $',
  '$ \\dfrac{5\\lambda_1}{9} $',
  '$ \\dfrac{9\\lambda_1}{5} $',
  '$ \\dfrac{27\\lambda_1}{5} $',
],
'c',
`**Step 1: Shortest wavelength of Lyman series (H-atom)**

Shortest $ \\lambda $ → highest $ \\bar{\\nu} $ → $ n_1 = 1, n_2 = \\infty $:

$$\\frac{1}{\\lambda_1} = R_H \\left(1 - 0\\right) = R_H$$

$$\\Rightarrow \\lambda_1 = \\frac{1}{R_H}$$

**Step 2: Longest wavelength of Balmer series ($ \\mathrm{He^+} $, Z = 2)**

Longest $ \\lambda $ → smallest $ \\bar{\\nu} $ → $ n_1 = 2, n_2 = 3 $:

$$\\frac{1}{\\lambda} = R_H Z^2 \\left(\\frac{1}{n_1^2} - \\frac{1}{n_2^2}\\right) = R_H \\times 4 \\times \\left(\\frac{1}{4} - \\frac{1}{9}\\right)$$

$$= 4R_H \\times \\frac{9 - 4}{36} = 4R_H \\times \\frac{5}{36} = \\frac{5R_H}{9}$$

$$\\Rightarrow \\lambda = \\frac{9}{5R_H} = \\frac{9\\lambda_1}{5}$$

**Final Answer:** $ \\dfrac{9\\lambda_1}{5} $ → **Option (c)**`,
'tag_atom_4'),

// Q34 — Line spectra differ because outermost electrons at different energy levels
mkSCQ('ATOM-369', 'Easy',
`The line spectra of two elements are not identical because`,
[
  'elements don\'t have the same number of neutrons',
  'they have different mass numbers',
  'their outermost $ e^- $ are at different energy levels',
  'all of the above',
],
'c',
`**Explanation:**

Line spectra arise from electronic transitions between energy levels. Each element has a unique set of energy levels determined by its nuclear charge (atomic number) and electron configuration.

- Options (a) and (b) — neutrons and mass numbers affect nuclear properties but **not** the electronic energy levels significantly.
- Option (c) ✓ — Different elements have different atomic numbers → different nuclear charges → different electron energy levels → different spectral lines.

The uniqueness of line spectra is entirely due to the unique electronic energy level structure of each element.

**Final Answer:** Option (c)**`,
'tag_atom_4'),

// Q35 — Brackett series lines when e- in 9th excited state
mkSCQ('ATOM-370', 'Hard',
`Number of possible spectral lines in the Brackett series of H-spectrum, when $ e^- $ present in the $ 9^{\\text{th}} $ excited state returns to the ground state, is`,
[
  '36',
  '45',
  '5',
  '6',
],
'd',
`**Step 1: Identify the orbit**

$ 9^{\\text{th}} $ excited state means $ n = 10 $ (ground state is $ n = 1 $, first excited = $ n = 2 $, ..., 9th excited = $ n = 10 $).

**Step 2: Brackett series definition**

Brackett series: transitions ending at $ n_1 = 4 $.

So $ n_2 $ can be $ 5, 6, 7, 8, 9, 10 $ (all values from 5 to 10).

**Step 3: Count lines**

Number of Brackett lines = $ 10 - 4 = 6 $

(Transitions: $ 5\\to4 $, $ 6\\to4 $, $ 7\\to4 $, $ 8\\to4 $, $ 9\\to4 $, $ 10\\to4 $)

**Final Answer:** 6 → **Option (d)**`,
'tag_atom_4'),

// Q36 — Forbidden transition 3d→4p (Δl = +1, emission must go lower energy)
mkSCQ('ATOM-371', 'Medium',
`Which of the following transitions is not allowed in the normal electronic emission spectrum of an atom?`,
[
  '$ 2s \\to 1s $',
  '$ 2p \\to 1s $',
  '$ 3d \\to 4p $',
  '$ 5p \\to 3s $',
],
'c',
`**Selection rule for electronic transitions:**

The quantum mechanical selection rule requires $ \\Delta l = \\pm 1 $ for allowed transitions.

**Evaluating each option:**

- **(a) $ 2s \\to 1s $:** $ \\Delta l = 0 - 0 = 0 $ → **Forbidden** by $ \\Delta l $ rule. However, this is also not observed.
- **(b) $ 2p \\to 1s $:** $ \\Delta l = 1 - 0 = -1 $ ✓ → Allowed (Lyman series).
- **(c) $ 3d \\to 4p $:** $ \\Delta l = 1 - 2 = -1 $ ✓ ($ \\Delta l $ is fine), but this is an **emission** transition from $ n=3 $ to $ n=4 $. In emission, the electron must go to **lower energy** (lower $ n $). Going from $ n=3 $ to $ n=4 $ is absorption, not emission. This transition is **not allowed in emission spectrum**. ✗
- **(d) $ 5p \\to 3s $:** $ \\Delta l = 0 - 1 = -1 $ ✓, and $ n $ decreases → Allowed emission.

**Final Answer:** $ 3d \\to 4p $ → **Option (c)**`,
'tag_atom_4'),

// Q37 — Wave nature of electron verified by Davisson & Germer
mkSCQ('ATOM-372', 'Easy',
`The wave nature of $ e^- $ is verified by`,
[
  'De-Broglie',
  'Davisson & Germer',
  'Rutherford',
  'Heisenberg',
],
'b',
`**Explanation:**

- **De-Broglie** — *proposed* the wave nature of matter ($ \\lambda = h/mv $), but did not experimentally verify it.
- **Davisson & Germer (1927)** — *experimentally verified* the wave nature of electrons by demonstrating **electron diffraction** from a nickel crystal. The diffraction pattern confirmed that electrons behave as waves.
- **Rutherford** — proposed the nuclear model of the atom (gold foil experiment).
- **Heisenberg** — proposed the uncertainty principle.

**Final Answer:** Davisson & Germer → **Option (b)**`,
'tag_atom_5'),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
