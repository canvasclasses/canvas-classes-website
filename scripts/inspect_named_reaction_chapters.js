require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const coll = mongoose.connection.db.collection('flashcards');

  // Find all chapters whose name contains "named" or "reaction" (case-insensitive)
  const sample = await coll.aggregate([
    { $match: { deleted_at: null } },
    { $group: {
        _id: { chapterId: '$chapter.id', chapterName: '$chapter.name', category: '$chapter.category' },
        count: { $sum: 1 }
    }},
    { $sort: { '_id.category': 1, '_id.chapterName': 1 } }
  ]).toArray();

  console.log('\nAll chapters in DB:');
  for (const r of sample) {
    console.log(`  [${r._id.category}] "${r._id.chapterName}" (id: ${r._id.chapterId}) — ${r.count} cards`);
  }

  // Show full details of anything organic-named-reaction-ish
  const suspects = sample.filter(r =>
    r._id.chapterId?.toLowerCase().includes('named') ||
    r._id.chapterId?.toLowerCase().includes('organic_name') ||
    r._id.chapterName?.toLowerCase().includes('named react')
  );

  for (const s of suspects) {
    const cards = await coll.find({ 'chapter.id': s._id.chapterId, deleted_at: null })
      .sort({ 'topic.order': 1, flashcard_id: 1 }).toArray();
    console.log(`\n====== ${s._id.chapterName} (${s._id.chapterId}) — ${cards.length} cards ======`);
    for (const c of cards) {
      console.log(`  [${c.flashcard_id}] [${c.topic?.name}] ${c.question?.replace(/\n/g,' ').slice(0,100)}`);
    }
  }

  await mongoose.disconnect();
}
run().catch(e => { console.error(e); process.exit(1); });
