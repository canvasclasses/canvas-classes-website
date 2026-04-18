require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const FlashcardSchema = new mongoose.Schema({}, { strict: false, collection: 'flashcards' });
const Flashcard = mongoose.model('Flashcard', FlashcardSchema);

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);

  // List all distinct chapters
  const chapters = await Flashcard.distinct('chapter');
  console.log('Total distinct chapters:', chapters.length);
  for (const ch of chapters) {
    const count = await Flashcard.countDocuments({ 'chapter.id': ch.id, deleted_at: null });
    console.log(`  ${ch.id} | ${ch.name} | cards=${count}`);
  }

  // Search for anything d/f related
  const dfSample = await Flashcard.findOne({ 'chapter.name': /d.*f|D.*F/i }).lean();
  console.log('\nSample D&F doc:', dfSample ? JSON.stringify(dfSample.chapter) : 'none');

  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
