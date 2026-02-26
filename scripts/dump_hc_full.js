// Dump all Hydrocarbons questions for audit
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const fs = require('fs');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const docs = await col.find({ 'metadata.chapter_id': 'ch11_hydrocarbon' })
    .sort({ display_id: 1 })
    .toArray();

  const out = docs.map(d => ({
    id: d.display_id,
    type: d.question_type,
    difficulty: d.metadata?.difficulty,
    tags: d.metadata?.tags,
    q: d.question_text?.markdown,
    opts: (d.options || []).map(o => ({ id: o.id, text: o.text, correct: o.is_correct })),
    answer: { correct_option: d.answer?.correct_option, numerical_value: d.answer?.numerical_value, explanation: d.answer?.explanation },
    sol: d.solution?.text_markdown,
    exam: d.metadata?.exam_source
  }));

  fs.writeFileSync('scripts/hc_full_dump.json', JSON.stringify(out, null, 2));
  console.log(`Dumped ${out.length} Hydrocarbons questions`);
  await mongoose.disconnect();
}
run().catch(e => { console.error(e); process.exit(1); });
