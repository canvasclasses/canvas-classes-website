require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const coll = mongoose.connection.db.collection('flashcards');
  const cards = await coll.find({ 'chapter.id': 'important_compounds_of_inorganic', deleted_at: null })
    .sort({ 'topic.order': 1, flashcard_id: 1 })
    .toArray();

  const byTopic = {};
  for (const c of cards) {
    const t = c.topic?.name || 'Untagged';
    if (!byTopic[t]) byTopic[t] = [];
    byTopic[t].push({
      id: c.flashcard_id,
      difficulty: c.metadata?.difficulty,
      q: c.question,
      a: c.answer,
    });
  }

  const outPath = path.join(__dirname, 'important_compounds_export.json');
  fs.writeFileSync(outPath, JSON.stringify({ total: cards.length, byTopic }, null, 2));
  console.log(`Exported ${cards.length} cards to ${outPath}`);
  console.log('Topics:', Object.keys(byTopic).map(t => `${t} (${byTopic[t].length})`).join(', '));
  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
