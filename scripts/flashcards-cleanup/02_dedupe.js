/**
 * Soft-delete duplicate flashcards (same question text). Keeps the lower-numbered
 * flashcard_id per group; sets deleted_at on the rest.
 *
 * Snapshots originals first; rollback restores deleted_at: null.
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

  const groups = await c.aggregate([
    { $match: { deleted_at: null } },
    { $group: {
        _id: '$question',
        n: { $sum: 1 },
        docs: { $push: { _id: '$_id', flashcard_id: '$flashcard_id', chapter: '$chapter.name' } }
    }},
    { $match: { n: { $gt: 1 } } },
  ]).toArray();

  const toDelete = [];
  const snapshot = [];
  for (const g of groups) {
    const sorted = [...g.docs].sort((a, b) => a.flashcard_id.localeCompare(b.flashcard_id));
    const keeper = sorted[0];
    const losers = sorted.slice(1);
    console.log(`Group "${String(g._id).slice(0, 70)}" → keep ${keeper.flashcard_id} [${keeper.chapter}], delete: ${losers.map(l => `${l.flashcard_id}[${l.chapter}]`).join(', ')}`);
    for (const l of losers) {
      toDelete.push(l._id);
      snapshot.push({ _id: l._id, flashcard_id: l.flashcard_id, chapter: l.chapter, deleted_at: null });
    }
  }
  console.log(`\nGroups: ${groups.length} | Will soft-delete: ${toDelete.length}`);

  if (DRY || toDelete.length === 0) { await mongoose.disconnect(); return; }

  const snapPath = path.resolve(`_agents/snapshots/flashcards_dedupe_${STAMP}.json`);
  fs.writeFileSync(snapPath, JSON.stringify(snapshot, null, 2));
  console.log(`Snapshot: ${snapPath}`);

  const now = new Date();
  const res = await c.updateMany({ _id: { $in: toDelete } }, { $set: { deleted_at: now, deletion_reason: 'duplicate-question dedupe 2026-06-18' } });
  console.log(`Soft-deleted: ${res.modifiedCount}`);
  console.log(`ROLLBACK: node scripts/flashcards-cleanup/_rollback.js flashcards_dedupe_${STAMP}.json`);

  await mongoose.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
