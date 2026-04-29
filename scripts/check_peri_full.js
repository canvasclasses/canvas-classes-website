require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const col = db.collection('questions_v2');

  // Search for questions with "Which of the following orders" text (the [NEET] PERI-311)
  const textSearch = await col.find(
    { 'question_text.markdown': /Which of the following orders are correc/i, 'metadata.chapter_id': 'ch11_periodic' },
    { projection: { display_id: 1, 'question_text.markdown': 1, 'metadata.source': 1, 'metadata.pyq_year': 1 } }
  ).toArray();
  
  console.log('Search for "Which of the following orders are correc":');
  for (const q of textSearch) {
    console.log(`  display_id: ${q.display_id}, source: ${q.metadata?.source}, year: ${q.metadata?.pyq_year}`);
    console.log(`  text: ${(q.question_text?.markdown || '').slice(0, 100)}`);
  }

  // Check display_ids in range 308-325 - show ALL docs including any with deleted_at set
  const allInRange = await col.find(
    { 'metadata.chapter_id': 'ch11_periodic' },
    { projection: { display_id: 1, deleted_at: 1, 'metadata.source': 1, 'metadata.pyq_year': 1, 'question_text.markdown': 1 } }
  ).sort({ display_id: 1 }).toArray();
  
  // Count by display_id
  const byId = {};
  for (const q of allInRange) {
    if (!byId[q.display_id]) byId[q.display_id] = [];
    byId[q.display_id].push(q);
  }
  
  const dupes = Object.entries(byId).filter(([, arr]) => arr.length > 1);
  console.log(`\nTotal ch11_periodic questions: ${allInRange.length}`);
  console.log(`Duplicate display_ids: ${dupes.length}`);
  
  if (dupes.length > 0) {
    for (const [id, arr] of dupes.slice(0, 5)) {
      console.log(`\n${id}:`);
      for (const q of arr) {
        console.log(`  deleted_at: ${q.deleted_at}, source: ${q.metadata?.source}, year: ${q.metadata?.pyq_year}`);
        console.log(`  text: ${(q.question_text?.markdown || '').slice(0, 80)}`);
      }
    }
  }

  await mongoose.disconnect();
}
main().catch(console.error);
