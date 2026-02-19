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

mkSCQ('ATOM-406', 'Hard',
`The magnitude of the orbital angular momentum of an $ e^- $ is given by $ L = \\sqrt{5}\\,\\dfrac{h}{\\pi} $. How many orbitals of this kind are possible, belonging to an orbit?`,
[
  '4',
  '5',
  '11',
  '9',
],
'd',
`**Step 1: Orbital angular momentum formula**

$$L = \\sqrt{l(l+1)}\\,\\frac{h}{2\\pi}$$

Given: $ L = \\sqrt{5}\\,\\dfrac{h}{\\pi} $

**Step 2: Equate and solve for l**

$$\\sqrt{l(l+1)}\\,\\frac{h}{2\\pi} = \\sqrt{5}\\,\\frac{h}{\\pi}$$

$$\\sqrt{l(l+1)} = 2\\sqrt{5}$$

$$l(l+1) = 4 \\times 5 = 20$$

Solving: $ l^2 + l - 20 = 0 $

$$l = \\frac{-1 + \\sqrt{1 + 80}}{2} = \\frac{-1 + 9}{2} = 4$$

**Step 3: Number of orbitals**

For $ l = 4 $ (g-subshell):

Number of orbitals $ = 2l + 1 = 2(4) + 1 = 9 $

($ m_l = -4, -3, -2, -1, 0, +1, +2, +3, +4 $)

**Final Answer:** 9 orbitals → **Option (d)**`,
'tag_atom_6'),

// NVT9 (Image 10) — Min uncertainty in speed in 1D region of length 2a₀
mkNVT('ATOM-407', 'Hard',
`The minimum uncertainty in the speed of an $ e^- $ in a 1-D region of length $ 2a_0 $ ( $ a_0 = 52.9 $ pm) is ______ km s$ ^{-1} $.`,
{ integer_value: 548 },
`**Step 1: Apply Heisenberg's Uncertainty Principle**

$$\\Delta x \\cdot \\Delta p \\geq \\frac{h}{4\\pi}$$

For minimum uncertainty, use equality:

$$\\Delta x \\cdot m_e \\Delta v = \\frac{h}{4\\pi}$$

**Step 2: Identify Δx**

The electron is confined to a 1-D region of length $ 2a_0 $, so:

$$\\Delta x = 2a_0 = 2 \\times 52.9 \\times 10^{-12} \\text{ m} = 1.058 \\times 10^{-10} \\text{ m}$$

**Step 3: Calculate minimum Δv**

$$\\Delta v = \\frac{h}{4\\pi \\cdot m_e \\cdot \\Delta x}$$

$$\\Delta v = \\frac{6.626 \\times 10^{-34}}{4\\pi \\times 9.1 \\times 10^{-31} \\times 1.058 \\times 10^{-10}}$$

$$\\Delta v = \\frac{6.626 \\times 10^{-34}}{1.208 \\times 10^{-39}}$$

$$\\Delta v = 5.48 \\times 10^5 \\text{ m s}^{-1} = 548 \\text{ km s}^{-1}$$

**Final Answer: 548 km s⁻¹**`,
'tag_atom_8'),

// NVT (Image 8) — Ge Z=32, completely filled orbitals with ml=0 = 7
// Note: This is a different phrasing from ATOM-323 (which asks about "x completely filled orbitals")
// ATOM-323 uses display_id format and same content — confirmed duplicate, skip.
// Instead adding: electrons in completely filled subshells n=4, s=+1/2 already done as ATOM-405.
// Adding the remaining unique Q from images: Q2 (Image 7) — Quantum numbers statements NVT
// Already done as ATOM-404. 
// Last remaining unique question: none — all accounted for.
// Adding a bonus unique question from Image 6: NVT correct statements about orbitals already ATOM-403.
// All 13 unique questions covered. This batch has 3 (ATOM-406, ATOM-407, ATOM-408).
// ATOM-408: placeholder — actually we only have 2 remaining unique questions.
// Let me add the Ge Z=32 question with slightly different framing since ATOM-323 uses $m_l$ notation
// and this image uses $m_e=0$ notation — checking: ATOM-323 confirmed duplicate, skip.
// Final batch: just ATOM-406 and ATOM-407.

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
