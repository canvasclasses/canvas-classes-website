const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');

const CHAPTER_ID = 'ch11_atom';
function src(year, month, day, shift) { return { exam_name: 'JEE Main', year, month, day, shift }; }
function mkNVT(id, diff, text, answer, solution, tag, examSrc) {
  return { _id: uuidv4(), display_id: id, type: 'NVT', question_text: { markdown: text, latex_validated: false }, options: [], answer,
    solution: { text_markdown: solution, latex_validated: false },
    metadata: { difficulty: diff, chapter_id: CHAPTER_ID, tags: [{ tag_id: tag, weight: 1.0 }], exam_source: examSrc, is_pyq: true, is_top_pyq: false },
    status: 'published', version: 1, quality_score: 85, needs_review: false, created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), deleted_at: null };
}

// Q90 only - the rest were in b6 main file
const questions = [
mkNVT('ATOM-290','Medium',
`The work function of sodium metal is $4.41 \\times 10^{-19}$ J. If photons of wavelength 300 nm are incident on the metal, the kinetic energy of the ejected electrons will be ______ $\\times 10^{-21}$ J.\n\n[$h = 6.63 \\times 10^{-34}$ J s, $c = 3 \\times 10^8$ m s$^{-1}$]`,
{ integer_value: 222 },
`**Energy of incident photon:**\n$$E = \\frac{hc}{\\lambda} = \\frac{6.63 \\times 10^{-34} \\times 3 \\times 10^8}{300 \\times 10^{-9}} = 6.63 \\times 10^{-19}\\,\\text{J}$$\n\n**KE of ejected electron:**\n$$KE = E - \\phi = 6.63 \\times 10^{-19} - 4.41 \\times 10^{-19} = 2.22 \\times 10^{-19}\\,\\text{J}$$\n\n$$= 222 \\times 10^{-21}\\,\\text{J}$$\n\n**Answer: 222**`,
'tag_atom_5', src(2020,'Sep',2,'Evening')),
];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
