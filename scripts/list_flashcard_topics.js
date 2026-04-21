require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const coll = mongoose.connection.db.collection('flashcards');
  for (const chId of ['ch12_dblock', 'ch12_coordination']) {
    const rows = await coll.aggregate([
      { $match: { 'chapter.id': chId, deleted_at: null } },
      { $group: { _id: { name: '$topic.name', order: '$topic.order' }, count: { $sum: 1 } } },
      { $sort: { '_id.order': 1, '_id.name': 1 } },
    ]).toArray();
    console.log(`\n=== ${chId} (${rows.reduce((s, r) => s + r.count, 0)} cards) ===`);
    for (const r of rows) {
      console.log(`  order=${r._id.order}  ${r._id.name}  (${r.count})`);
    }
  }
  await mongoose.disconnect();
}
run().catch(e => { console.error(e); process.exit(1); });
