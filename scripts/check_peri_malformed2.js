require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const col = db.collection('questions_v2');

  const malformed = await col.find(
    { display_id: /^PERI-\d+ \[/ },
    { projection: { display_id: 1, _id: 1, metadata: 1, status: 1, 'question_text.markdown': 1 } }
  ).sort({ display_id: 1 }).toArray();

  console.log(`\nAll ${malformed.length} malformed docs:\n`);
  for (const q of malformed) {
    const base = q.display_id.replace(/ \[.*$/, '');
    console.log(`display_id: "${q.display_id}"`);
    console.log(`  _id: ${q._id}`);
    console.log(`  status: ${q.status}`);
    console.log(`  metadata.source: ${q.metadata?.source}`);
    console.log(`  metadata.pyq_year: ${q.metadata?.pyq_year}`);
    console.log(`  metadata.board: ${q.metadata?.board}`);
    console.log(`  metadata.chapter_id: ${q.metadata?.chapter_id}`);
    console.log(`  text: ${(q.question_text?.markdown || '').slice(0, 80)}`);
    console.log();
  }

  await mongoose.disconnect();
}
main().catch(console.error);
