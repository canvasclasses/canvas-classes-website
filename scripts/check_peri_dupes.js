require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const col = db.collection('questions_v2');

  // Find all PERI questions
  const periQuestions = await col.find(
    { display_id: /^PERI-/ },
    { projection: { display_id: 1, 'question_text.markdown': 1, status: 1, created_at: 1, 'metadata.source': 1, 'metadata.pyq_year': 1 } }
  ).sort({ display_id: 1 }).toArray();

  console.log(`Total PERI questions: ${periQuestions.length}`);

  // Group by display_id
  const byId = {};
  for (const q of periQuestions) {
    if (!byId[q.display_id]) byId[q.display_id] = [];
    byId[q.display_id].push(q);
  }

  const dupes = Object.entries(byId).filter(([, arr]) => arr.length > 1);
  console.log(`\nDuplicate display_ids: ${dupes.length}`);
  
  for (const [id, arr] of dupes) {
    console.log(`\n--- ${id} (${arr.length} copies) ---`);
    for (const q of arr) {
      const text = (q.question_text?.markdown || '').slice(0, 80);
      console.log(`  _id: ${q._id}`);
      console.log(`  status: ${q.status}, source: ${q.metadata?.source}, year: ${q.metadata?.pyq_year}`);
      console.log(`  text: ${text}`);
      console.log(`  created_at: ${q.created_at}`);
    }
  }

  await mongoose.disconnect();
}
main().catch(console.error);
