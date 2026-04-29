require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const col = db.collection('questions_v2');

  // Get all PERI-311 through PERI-320 questions
  const questions = await col.find(
    { display_id: { $in: ['PERI-311','PERI-312','PERI-313','PERI-314','PERI-315','PERI-316','PERI-317','PERI-318','PERI-319','PERI-320'] } },
    { projection: { display_id: 1, 'question_text.markdown': 1, status: 1, 'metadata.source': 1, 'metadata.pyq_year': 1, 'metadata.chapter_id': 1 } }
  ).sort({ display_id: 1 }).toArray();

  console.log(`Found ${questions.length} questions for PERI-311 to PERI-320`);
  for (const q of questions) {
    const text = (q.question_text?.markdown || '').slice(0, 60);
    console.log(`${q.display_id} | source: ${q.metadata?.source} | year: ${q.metadata?.pyq_year} | chapter: ${q.metadata?.chapter_id} | ${text}`);
  }

  // Also check the range 300-330 to see all IDs
  const range = await col.find(
    { display_id: /^PERI-(3[0-9]{2})$/ },
    { projection: { display_id: 1 } }
  ).sort({ display_id: 1 }).toArray();
  
  const ids = range.map(q => q.display_id);
  console.log(`\nAll PERI-3xx IDs found (${ids.length}):`);
  console.log(ids.join(', '));

  await mongoose.disconnect();
}
main().catch(console.error);
