require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const coll = mongoose.connection.db.collection('flashcards');
  const cards = await coll.find({ 'chapter.id': 'organic_name_reaction', deleted_at: null })
    .sort({ flashcard_id: 1 }).toArray();
  for (const c of cards) {
    console.log(`\n[${c.flashcard_id}] topic: ${c.topic?.name}`);
    console.log(`Q: ${c.question}`);
    console.log(`A: ${c.answer}`);
  }
  await mongoose.disconnect();
}
run().catch(e => { console.error(e); process.exit(1); });
