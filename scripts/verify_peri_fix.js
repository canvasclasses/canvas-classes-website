require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const col = db.collection('questions_v2');

  const all = await col.find(
    { display_id: /^PERI-/ },
    { projection: { display_id: 1 } }
  ).toArray();

  console.log(`Total PERI docs: ${all.length}`);

  const byId = {};
  for (const q of all) {
    byId[q.display_id] = (byId[q.display_id] || 0) + 1;
  }

  const dupes = Object.entries(byId).filter(([, n]) => n > 1);
  const malformed = Object.keys(byId).filter(id => / \[/.test(id));

  console.log(`Duplicate display_ids: ${dupes.length}`);
  console.log(`Still-malformed display_ids: ${malformed.length}`);

  if (dupes.length) console.log('Dupes:', dupes);
  if (malformed.length) console.log('Malformed:', malformed);

  // Show the new IDs 345-354
  const newRange = await col.find(
    { display_id: /^PERI-(34[5-9]|35[0-4])$/ },
    { projection: { display_id: 1, 'question_text.markdown': 1, 'metadata.source': 1 } }
  ).sort({ display_id: 1 }).toArray();
  
  console.log(`\nNewly reassigned PERI-345 to PERI-354 (${newRange.length} docs):`);
  for (const q of newRange) {
    console.log(`  ${q.display_id}: ${(q.question_text?.markdown || '').slice(0, 60)}`);
  }

  await mongoose.disconnect();
}
main().catch(console.error);
