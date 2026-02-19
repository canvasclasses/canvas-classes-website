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

// Q68 — d-shell with 4 unpaired electrons, number of exchange electrons = 6
mkNVT('ATOM-390', 'Hard',
`A d-shell containing 4 unpaired $ e^- $ can exchange ______ electrons.`,
{ integer_value: 6 },
`**Step 1: Exchange energy concept**

Exchange energy arises when electrons with the **same spin** can exchange positions. The number of exchange pairs among $ n $ electrons of the same spin is $ \\binom{n}{2} = \\frac{n(n-1)}{2} $.

**Step 2: Configuration of d-shell with 4 unpaired electrons**

A d-subshell with 4 unpaired electrons: $ d^4 $ configuration (e.g., Cr²⁺, Mn³⁺)

$$\\uparrow \\quad \\uparrow \\quad \\uparrow \\quad \\uparrow \\quad \\_ $$

All 4 unpaired electrons have the **same spin** (↑).

**Step 3: Count exchange pairs**

Number of exchange pairs $ = \\binom{4}{2} = \\frac{4 \\times 3}{2} = 6 $

Each exchange pair represents one exchange interaction, so the number of electrons that can be exchanged = **6**.

**Final Answer: 6**`,
'tag_atom_7'),

// Q2 — Electron and proton accelerated through V, pp:pe momentum ratio
mkSCQ('ATOM-391', 'Medium',
`An electron and a proton are accelerated through a potential $ V $. If $ p_e $ and $ p_p $ are their momenta, then $ p_p : p_e $ ratio is approximately equal to`,
[
  '$ 1 : 1836 $',
  '$ 1 : 1 $',
  '$ 1836 : 1 $',
  '$ 43 : 1 $',
],
'd',
`**Step 1: Momentum from kinetic energy**

When a particle of charge $ e $ and mass $ m $ is accelerated through potential $ V $:

$$eV = \\frac{1}{2}mv^2 = \\frac{p^2}{2m} \\Rightarrow p = \\sqrt{2meV}$$

**Step 2: Ratio of momenta**

$$\\frac{p_p}{p_e} = \\sqrt{\\frac{m_p}{m_e}} = \\sqrt{\\frac{1836\\,m_e}{m_e}} = \\sqrt{1836} \\approx 42.85 \\approx 43$$

**Step 3: Conclusion**

$$p_p : p_e \\approx 43 : 1$$

**Final Answer:** $ 43 : 1 $ → **Option (d)**`,
'tag_atom_5'),

// Q3 — Laser emits 6×10^15 quanta/sec·m², λ=662.6nm, power output
mkSCQ('ATOM-392', 'Medium',
`A certain laser transition emits $ 6.0 \\times 10^{15} $ quanta/sec·m² of $ \\lambda = 662.6 $ nm. What is the power output in J/sec·m²?`,
[
  '$ 1.8 \\times 10^{-3} $',
  '$ 6.626 \\times 10^{-4} $',
  '$ 1.8 \\times 10^{3} $',
  '$ 6.626 \\times 10^{-12} $',
],
'a',
`**Step 1: Energy per photon**

$$E = \\frac{hc}{\\lambda} = \\frac{6.626 \\times 10^{-34} \\times 3 \\times 10^8}{662.6 \\times 10^{-9}}$$

$$E = \\frac{1.988 \\times 10^{-25}}{6.626 \\times 10^{-7}} = 3.0 \\times 10^{-19} \\text{ J}$$

**Step 2: Power output**

$$\\text{Power} = n \\times E = 6.0 \\times 10^{15} \\times 3.0 \\times 10^{-19}$$

$$= 18 \\times 10^{-4} = 1.8 \\times 10^{-3} \\text{ J/sec·m}^2$$

**Verification using the image's method:**

$$\\text{Power} = \\frac{n \\cdot hc/\\lambda}{t} = \\frac{6 \\times 10^{15} \\times 6.626 \\times 10^{-34} \\times 3 \\times 10^8}{1 \\times 662.6 \\times 10^{-9}} = 1.8 \\times 10^{-3} \\text{ J/s·m}^2$$

**Final Answer:** $ 1.8 \\times 10^{-3} $ J/s·m² → **Option (a)**`,
'tag_atom_1'),

// Q4 — O2 photochemical dissociation, max wavelength
mkSCQ('ATOM-393', 'Hard',
`$ \\mathrm{O_2} $ undergoes photochemical dissociation into one normal oxygen atom and one oxygen atom 1.2 eV more energetic than normal. The dissociation of $ \\mathrm{O_2} $ into two normal atoms of oxygen requires 482.5 kJ/mol. The maximum wavelength effective for photochemical dissociation of $ \\mathrm{O_2} $ is (1 eV = 96.5 kJ/mol)`,
[
  '248 nm',
  '1033.3 nm',
  '1236.2 nm',
  '200 nm',
],
'd',
`**Step 1: Energy needed for photochemical dissociation**

The photon must provide energy to:
1. Dissociate $ \\mathrm{O_2} $ into two normal O atoms: $ 482.5 $ kJ/mol
2. Give one O atom an extra $ 1.2 $ eV of energy

Converting 482.5 kJ/mol to eV:
$$482.5 \\text{ kJ/mol} \\div 96.5 \\text{ kJ/eV} = 5.0 \\text{ eV}$$

Total energy needed:
$$E = 5.0 + 1.2 = 6.2 \\text{ eV}$$

**Step 2: Maximum wavelength**

Maximum wavelength corresponds to minimum energy (= exactly 6.2 eV):

$$\\lambda = \\frac{hc}{E} = \\frac{1240 \\text{ eV·nm}}{6.2 \\text{ eV}} \\approx 200 \\text{ nm}$$

(Using $ hc = 1240 $ eV·nm)

**Final Answer:** 200 nm → **Option (d)**`,
'tag_atom_1'),

// Q5 — Light intensity halved, effect on photoelectron count Y and max KE Z
mkSCQ('ATOM-394', 'Medium',
`Light of wavelength $ \\lambda $ strikes a metal surface with intensity $ X $ and the metal emits $ Y $ electrons per second of maximum KE $ Z $. What will happen to $ Y $ and $ Z $ if $ X $ is halved?`,
[
  '$ Y $ will be halved and $ Z $ will be doubled',
  '$ Y $ will be doubled and $ Z $ will be halved',
  '$ Y $ will be halved and $ Z $ will remain the same',
  '$ Y $ will remain same and $ Z $ will be halved',
],
'c',
`**Key concepts of photoelectric effect:**

**Number of photoelectrons (Y):**
- Intensity $ \\propto $ number of photons per second
- Each photon (above threshold) ejects one electron
- Therefore: number of electrons emitted $ \\propto $ intensity
- If intensity is halved → **Y is halved** ✓

**Maximum kinetic energy (Z):**
- $ KE_{\\max} = h\\nu - \\phi $ (Einstein's photoelectric equation)
- $ KE_{\\max} $ depends only on the **frequency** (wavelength) of light, NOT on intensity
- Since wavelength $ \\lambda $ is unchanged, frequency is unchanged
- Therefore: **Z remains the same** ✓

**Final Answer:** Y will be halved and Z will remain the same → **Option (c)**`,
'tag_atom_1'),

// Q6 — Thomson model → Rutherford gold foil prediction
mkSCQ('ATOM-395', 'Medium',
`If the Thomson's model of atom was correct, then the result of Rutherford's Gold foil experiment would have been:`,
[
  'all of the $ \\alpha $-particles pass through the gold foil without decrease in speed',
  '$ \\alpha $-particles are deflected over a wide range of angles',
  'all $ \\alpha $-particles got bounced back by $ 180^{\\circ} $',
  '$ \\alpha $-particles pass through the gold foil deflected by small angle and with reduced speed',
],
'd',
`**Thomson's model of atom ("Plum pudding model"):**
- Atom is a uniform sphere of positive charge with electrons embedded throughout
- No concentrated nucleus — positive charge is spread uniformly
- No large empty space inside the atom

**Predicted result of Rutherford's experiment under Thomson's model:**

If positive charge were uniformly distributed:
- $ \\alpha $-particles would experience only **weak, distributed electrostatic forces**
- They would pass through but be **slightly deflected** by the diffuse positive charge
- They would also **lose some speed** due to interactions with the spread-out positive charge and electrons

This matches **Option (d)**: $ \\alpha $-particles pass through deflected by a small angle and with reduced speed.

**What actually happened (Rutherford's actual result):**
- Most $ \\alpha $-particles passed straight through (atom is mostly empty space)
- A few were deflected at large angles
- Very few bounced back (concentrated positive nucleus)

This disproved Thomson's model and led to the nuclear model.

**Final Answer:** Option (d)**`,
'tag_atom_2'),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
