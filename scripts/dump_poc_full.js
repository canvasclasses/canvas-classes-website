// Dump full data of all POC questions for analysis
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const fs = require('fs');

async function dump() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const docs = await col.find({ 'metadata.chapter_id': 'ch11_prac_org' })
    .sort({ display_id: 1 }).toArray();
  
  // Write to JSON for analysis
  const data = docs.map(d => ({
    id: d.display_id,
    type: d.type,
    difficulty: d.metadata?.difficulty,
    tags: d.metadata?.tags,
    q: d.question_text?.markdown,
    opts: (d.options || []).map(o => ({ id: o.id, text: o.text, correct: o.is_correct })),
    answer: d.answer,
    sol: d.solution?.text_markdown,
    exam: d.metadata?.exam_source
  }));
  
  fs.writeFileSync('scripts/poc_full_dump.json', JSON.stringify(data, null, 2));
  console.log(`Dumped ${data.length} questions to scripts/poc_full_dump.json`);
  
  await mongoose.disconnect();
}
dump().catch(e => { console.error(e); process.exit(1); });
