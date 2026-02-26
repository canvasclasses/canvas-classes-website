// Delete ALL existing HC questions from questions_v2
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const res = await col.deleteMany({ 'metadata.chapter_id': 'ch11_hydrocarbon' });
  console.log(`Deleted: ${res.deletedCount} HC questions`);
  await mongoose.disconnect();
}
run().catch(e => { console.error(e); process.exit(1); });
