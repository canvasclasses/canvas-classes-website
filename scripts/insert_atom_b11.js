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

// Q38 — Neutron diffraction, λ=800pm, find characteristic velocity
mkSCQ('ATOM-373', 'Medium',
`Similar to electron diffraction, neutron diffraction microscope is also used for the determination of the structure of molecule. If the wavelength used here is 800 pm, calculate the characteristic velocity associated with the neutron. (mass of neutron $ = 1.675 \\times 10^{-27} $ kg)`,
[
  '$ 4.9 \\times 10^{2} $ ms$ ^{-1} $',
  '$ 2.5 \\times 10^{3} $ ms$ ^{-1} $',
  '$ 9.8 \\times 10^{2} $ ms$ ^{-1} $',
  '$ 0.2 \\times 10^{3} $ ms$ ^{-1} $',
],
'a',
`**Step 1: Apply De Broglie equation**

$$\\lambda = \\frac{h}{mv} \\Rightarrow v = \\frac{h}{m\\lambda}$$

**Step 2: Substitute values**

$$v = \\frac{6.626 \\times 10^{-34}}{1.675 \\times 10^{-27} \\times 800 \\times 10^{-12}}$$

$$v = \\frac{6.626 \\times 10^{-34}}{1.34 \\times 10^{-33}}$$

$$v = \\frac{6.626}{13.4} \\times 10^{-34+33} = 0.4944 \\times 10^{3} \\approx 4.9 \\times 10^{2} \\text{ ms}^{-1}$$

**Final Answer:** $ 4.9 \\times 10^{2} $ ms$ ^{-1} $ → **Option (a)**`,
'tag_atom_5'),

// Q39 — He+ 3rd orbit circumference = x, De Broglie wavelength
mkSCQ('ATOM-374', 'Medium',
`The circumference of the $ 3^{\\text{rd}} $ orbit of $ \\mathrm{He^+} $ ion is $ x $ m. The De-Broglie wavelength of $ e^- $ revolving in this orbit will be`,
[
  '$ x/3 $ m',
  '$ 3x $ m',
  '$ x/9 $ m',
  '$ 9x $ m',
],
'a',
`**Step 1: Bohr's quantization condition**

Bohr's condition states that the circumference of the $ n $-th orbit equals an integral multiple of the De Broglie wavelength:

$$2\\pi r_n = n\\lambda$$

**Step 2: Apply for n = 3**

$$\\text{Circumference} = 2\\pi r_3 = 3\\lambda$$

Given circumference $ = x $ m:

$$x = 3\\lambda$$

$$\\lambda = \\frac{x}{3} \\text{ m}$$

**Final Answer:** $ x/3 $ m → **Option (a)**`,
'tag_atom_5'),

// Q40 — Highest velocity for same De Broglie wavelength → lightest mass = electron
mkSCQ('ATOM-375', 'Easy',
`Out of electron, proton, neutron and $ \\alpha $-particle which one will have highest velocity to produce matter wave of the same wavelength?`,
[
  'electron',
  'proton',
  'neutron',
  '$ \\alpha $-particle',
],
'a',
`**Step 1: De Broglie relation**

$$\\lambda = \\frac{h}{mv} \\Rightarrow v = \\frac{h}{m\\lambda}$$

For the same wavelength $ \\lambda $:

$$v \\propto \\frac{1}{m}$$

**Step 2: Compare masses**

| Particle | Approximate mass |
|---|---|
| Electron | $ 9.1 \\times 10^{-31} $ kg |
| Proton | $ 1.67 \\times 10^{-27} $ kg |
| Neutron | $ 1.67 \\times 10^{-27} $ kg |
| $ \\alpha $-particle | $ 6.64 \\times 10^{-27} $ kg |

**Step 3: Conclusion**

Electron has the **smallest mass** → requires the **highest velocity** to produce the same wavelength.

**Final Answer:** Electron → **Option (a)**`,
'tag_atom_5'),

// Q41 — Electrons accelerated through V esu, h/λ = ?
mkSCQ('ATOM-376', 'Hard',
`A stream of electrons from a heated filament was passed between two charged plates kept at a potential difference $ V $ esu. The value of $ h/\\lambda $ is given by`,
[
  '$ 2meV $',
  '$ \\sqrt{meV} $',
  '$ \\sqrt{2meV} $',
  '$ meV $',
],
'c',
`**Step 1: Kinetic energy from potential difference**

When an electron (charge $ e $, mass $ m $) is accelerated through potential difference $ V $:

$$KE = eV = \\frac{1}{2}mv^2$$

**Step 2: De Broglie wavelength**

$$\\lambda = \\frac{h}{mv} \\Rightarrow \\frac{h}{\\lambda} = mv$$

**Step 3: Express $ mv $ in terms of $ eV $**

From $ \\frac{1}{2}mv^2 = eV $:

$$mv^2 = 2eV \\Rightarrow m^2v^2 = 2meV$$

$$(mv)^2 = 2meV \\Rightarrow mv = \\sqrt{2meV}$$

**Step 4: Result**

$$\\frac{h}{\\lambda} = mv = \\sqrt{2meV}$$

**Final Answer:** $ \\sqrt{2meV} $ → **Option (c)**`,
'tag_atom_5'),

// Q42 — De Broglie λ of He at -73°C is M times Ne at 727°C, find M (NVT, ans=5)
mkNVT('ATOM-377', 'Hard',
`The atomic masses of He and Ne are 4 and 20 amu, respectively. The value of the De-Broglie wavelength of He gas at $ -73^{\\circ} $ C is $ M $ times that of Ne at $ 727^{\\circ} $ C. The value of $ M $ is ______`,
{ integer_value: 5 },
`**Step 1: De Broglie wavelength for a gas molecule**

For a gas at temperature $ T $, the thermal De Broglie wavelength is:

$$\\lambda = \\frac{h}{\\sqrt{2mE_k}} = \\frac{h}{\\sqrt{2m \\cdot \\frac{3}{2}k_BT}} = \\frac{h}{\\sqrt{3mk_BT}}$$

So: $ \\lambda \\propto \\frac{1}{\\sqrt{mT}} $

**Step 2: Set up ratio**

$$M = \\frac{\\lambda_{\\text{He}}}{\\lambda_{\\text{Ne}}} = \\sqrt{\\frac{m_{\\text{Ne}} \\cdot T_{\\text{Ne}}}{m_{\\text{He}} \\cdot T_{\\text{He}}}}$$

**Step 3: Convert temperatures to Kelvin**

$$T_{\\text{He}} = -73 + 273 = 200 \\text{ K}$$
$$T_{\\text{Ne}} = 727 + 273 = 1000 \\text{ K}$$

**Step 4: Substitute values**

$$M = \\sqrt{\\frac{20 \\times 1000}{4 \\times 200}} = \\sqrt{\\frac{20000}{800}} = \\sqrt{25} = 5$$

**Final Answer:** $ M = 5 $`,
'tag_atom_5'),

// Q43 — Table-tennis ball uncertainty in position
mkSCQ('ATOM-378', 'Medium',
`Table-tennis ball has a mass of 10 g and a speed of 90 ms$ ^{-1} $. If speed can be measured with an accuracy of 4%, what will be the uncertainty in its position?`,
[
  '$ 2.6 \\times 10^{-23} $ m',
  '$ 1.46 \\times 10^{-32} $ m',
  '$ 2.8 \\times 10^{-20} $ m',
  '$ 1.00 \\times 10^{-34} $ m',
],
'b',
`**Step 1: Calculate uncertainty in speed**

$$\\Delta v = 4\\% \\times 90 = \\frac{4}{100} \\times 90 = 3.6 \\text{ ms}^{-1}$$

**Step 2: Calculate uncertainty in momentum**

$$\\Delta p = m \\cdot \\Delta v = 10 \\times 10^{-3} \\times 3.6 = 3.6 \\times 10^{-2} \\text{ kg ms}^{-1}$$

**Step 3: Apply Heisenberg's Uncertainty Principle**

$$\\Delta x \\cdot \\Delta p \\geq \\frac{h}{4\\pi}$$

$$\\Delta x = \\frac{h}{4\\pi \\cdot \\Delta p} = \\frac{6.626 \\times 10^{-34}}{4 \\times 3.14159 \\times 3.6 \\times 10^{-2}}$$

$$\\Delta x = \\frac{6.626 \\times 10^{-34}}{4.524 \\times 10^{-1}} = 1.465 \\times 10^{-33} \\approx 1.46 \\times 10^{-32} \\text{ m}$$

**Final Answer:** $ 1.46 \\times 10^{-32} $ m → **Option (b)**`,
'tag_atom_8'),

// Q44 — He+ 3rd orbit, product Δx·Δp can't be h/4π (HUP lower bound)
mkSCQ('ATOM-379', 'Medium',
`For an electron moving in $ 3^{\\text{rd}} $ orbit of $ \\mathrm{He^+} $ ion, the product of uncertainty in position and momentum can't be`,
[
  '$ h/4\\pi $',
  '$ h/2\\pi $',
  '$ h/\\pi $',
  '$ h/6\\pi $',
],
'd',
`**Step 1: Heisenberg's Uncertainty Principle**

$$\\Delta x \\cdot \\Delta p \\geq \\frac{h}{4\\pi}$$

The product $ \\Delta x \\cdot \\Delta p $ must be **greater than or equal to** $ \\dfrac{h}{4\\pi} $.

**Step 2: Evaluate each option**

- **(a) $ h/4\\pi $** — This equals the minimum value → **allowed** (equality case). ✓
- **(b) $ h/2\\pi $** — Greater than $ h/4\\pi $ → **allowed**. ✓
- **(c) $ h/\\pi $** — Greater than $ h/4\\pi $ → **allowed**. ✓
- **(d) $ h/6\\pi $** — Less than $ h/4\\pi $ (since $ 1/6 < 1/4 $) → **violates HUP** → **NOT possible**. ✗

**Final Answer:** $ h/6\\pi $ → **Option (d)**`,
'tag_atom_8'),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
