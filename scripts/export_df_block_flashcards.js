require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const FlashcardSchema = new mongoose.Schema({}, { strict: false, collection: 'flashcards' });
const Flashcard = mongoose.model('Flashcard', FlashcardSchema);

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const cards = await Flashcard.find({ 'chapter.id': 'ch12_dblock', deleted_at: null })
    .sort({ 'topic.order': 1, flashcard_id: 1 })
    .lean();

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

  const outPath = path.join(__dirname, 'df_block_cards_export.json');
  fs.writeFileSync(outPath, JSON.stringify({ total: cards.length, byTopic }, null, 2));
  console.log(`Exported ${cards.length} cards to ${outPath}`);
  console.log('Topics:', Object.keys(byTopic).map(t => `${t} (${byTopic[t].length})`).join(', '));
  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
