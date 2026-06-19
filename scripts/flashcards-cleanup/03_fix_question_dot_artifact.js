/**
 * Strip the trailing "." after "?" on flashcard questions (extraction artifact).
 * e.g. "What is Formalin?." -> "What is Formalin?"
 *
 * Conservative: only touches questions ending in /\?\.\s*$/.
 * Snapshots originals first.
 */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const mongoose = require('mongoose');

const DRY = process.argv.includes('--dry-run');
const STAMP = '2026-06-18';

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const c = mongoose.connection.db.collection('flashcards');
  const cursor = c.find({ deleted_at: null, question: /\?\.\s*$/ });

  const snapshot = [];
  const updates = [];
  for await (const doc of cursor) {
    const fixed = doc.question.replace(/\?\.\s*$/, '?');
    if (fixed === doc.question) continue;
    snapshot.push({ _id: doc._id, flashcard_id: doc.flashcard_id, question: doc.question });
    updates.push({ _id: doc._id, q: fixed });
  }

  console.log(`Will fix: ${updates.length}`);
  if (DRY || updates.length === 0) {
    updates.slice(0, 3).forEach(u => console.log(`  ${u._id} -> "${u.q.slice(-60)}"`));
    await mongoose.disconnect();
    return;
  }

  const snapPath = path.resolve(`_agents/snapshots/flashcards_qdot_${STAMP}.json`);
  fs.writeFileSync(snapPath, JSON.stringify(snapshot, null, 2));
  console.log(`Snapshot: ${snapPath}`);

  const bulk = c.initializeUnorderedBulkOp();
  updates.forEach(u => bulk.find({ _id: u._id }).updateOne({ $set: { question: u.q } }));
  const res = await bulk.execute();
  console.log(`Modified: ${res.modifiedCount}`);

  const remaining = await c.countDocuments({ deleted_at: null, question: /\?\.\s*$/ });
  console.log(`Remaining "?.": ${remaining} (should be 0)`);
  console.log(`ROLLBACK: node scripts/flashcards-cleanup/_rollback.js flashcards_qdot_${STAMP}.json`);

  await mongoose.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
