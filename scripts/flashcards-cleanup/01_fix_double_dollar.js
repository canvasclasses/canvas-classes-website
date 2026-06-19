/**
 * Replace forbidden $$...$$ LaTeX with $...$ across flashcards.
 *
 * - Reads `flashcards` collection (active only: deleted_at: null)
 * - Snapshots every doc that will be modified into _agents/snapshots/
 * - In-place updates `question` and `answer` fields only
 * - Idempotent: safe to re-run (no $$ left after first run)
 *
 * Rollback: see snapshot file path printed at the end.
 * Env: --dry-run (default off) to preview without writing.
 */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const mongoose = require('mongoose');

const DRY = process.argv.includes('--dry-run');
const STAMP = '2026-06-18';

function fixDouble(text) {
  if (typeof text !== 'string') return { text, changed: false };
  // Replace all $$ with $. KaTeX block math should be a single $ pair too in this codebase
  // (per CLAUDE.md §4). Some founder snippets use $$X$$ around inline math, which renders oversized.
  const next = text.replace(/\$\$/g, '$');
  return { text: next, changed: next !== text };
}

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const c = db.collection('flashcards');

  const cursor = c.find({
    deleted_at: null,
    $or: [{ question: /\$\$/ }, { answer: /\$\$/ }],
  });

  const snapshot = [];
  const updates = [];
  let scanned = 0;
  for await (const doc of cursor) {
    scanned++;
    const q = fixDouble(doc.question);
    const a = fixDouble(doc.answer);
    if (!q.changed && !a.changed) continue;
    snapshot.push({
      _id: doc._id,
      flashcard_id: doc.flashcard_id,
      chapter: doc.chapter?.name,
      question: doc.question,
      answer: doc.answer,
    });
    updates.push({ _id: doc._id, set: { question: q.text, answer: a.text } });
  }

  console.log(`Scanned: ${scanned} | Will update: ${updates.length}`);
  if (updates.length === 0) {
    console.log('Nothing to do.');
    await mongoose.disconnect();
    return;
  }

  if (DRY) {
    console.log('--- DRY RUN, first 3 changes ---');
    updates.slice(0, 3).forEach((u, i) => {
      const before = snapshot[i];
      console.log(`[${before.flashcard_id}]`);
      console.log(`  Q before: ${before.question.slice(0, 120)}`);
      console.log(`  Q after : ${u.set.question.slice(0, 120)}`);
      console.log(`  A before: ${before.answer.slice(0, 120)}`);
      console.log(`  A after : ${u.set.answer.slice(0, 120)}`);
    });
    await mongoose.disconnect();
    return;
  }

  const snapPath = path.resolve(`_agents/snapshots/flashcards_double_dollar_${STAMP}.json`);
  fs.writeFileSync(snapPath, JSON.stringify(snapshot, null, 2));
  console.log(`Snapshot written: ${snapPath}`);

  const bulk = c.initializeUnorderedBulkOp();
  updates.forEach(u => bulk.find({ _id: u._id }).updateOne({ $set: u.set }));
  const res = await bulk.execute();
  console.log(`Modified: ${res.modifiedCount}`);

  // verify zero $$ remain
  const remaining = await c.countDocuments({
    deleted_at: null,
    $or: [{ question: /\$\$/ }, { answer: /\$\$/ }],
  });
  console.log(`Cards still containing $$: ${remaining} (should be 0)`);
  console.log(`\nROLLBACK: node scripts/flashcards-cleanup/_rollback.js ${path.basename(snapPath)}`);

  await mongoose.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
