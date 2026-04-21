require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const coll = mongoose.connection.db.collection('flashcards');

  const chapters = ['ch12_solutions','ch12_electrochemistry','ch12_kinetics','ch11_atom','ch12_surface','ch12_solid_state'];
  for (const ch of chapters) {
    const sample = await coll.findOne({ 'chapter.id': ch, deleted_at: null });
    const count = await coll.countDocuments({ 'chapter.id': ch, deleted_at: null });
    const maxIdDoc = await coll.find({ 'chapter.id': ch, deleted_at: null }).sort({ flashcard_id: -1 }).limit(1).toArray();
    console.log(ch, '| count:', count, '| max_id:', maxIdDoc[0]?.flashcard_id);
    console.log('  chapter:', JSON.stringify(sample.chapter));
    console.log('  metadata keys:', Object.keys(sample.metadata || {}));
  }
  await mongoose.disconnect();
}
run().catch(e => { console.error(e); process.exit(1); });
