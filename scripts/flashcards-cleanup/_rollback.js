/**
 * Generic rollback: restore question/answer (and deleted_at if present) from a snapshot file.
 * Usage: node scripts/flashcards-cleanup/_rollback.js <filename-in-_agents/snapshots>
 */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const mongoose = require('mongoose');

const arg = process.argv[2];
if (!arg) { console.error('Pass snapshot filename'); process.exit(1); }
const file = path.resolve('_agents/snapshots', arg);
if (!fs.existsSync(file)) { console.error('Not found:', file); process.exit(1); }

(async () => {
  const snap = JSON.parse(fs.readFileSync(file, 'utf8'));
  await mongoose.connect(process.env.MONGODB_URI);
  const c = mongoose.connection.db.collection('flashcards');
  const bulk = c.initializeUnorderedBulkOp();
  for (const s of snap) {
    const set = {};
    if (s.question !== undefined) set.question = s.question;
    if (s.answer !== undefined) set.answer = s.answer;
    if (s.deleted_at !== undefined) set.deleted_at = s.deleted_at;
    bulk.find({ _id: s._id }).updateOne({ $set: set });
  }
  const res = await bulk.execute();
  console.log(`Restored ${res.modifiedCount} of ${snap.length} docs`);
  await mongoose.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
