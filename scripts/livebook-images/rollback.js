// Undo image write-backs recorded in _journal.jsonl by resetting each block's
// field to '' (the "no image yet" sentinel), so it re-enters the pending queue.
// Does NOT delete the uploaded R2 objects (harmless; they get overwritten on retry).
//
// Usage:
//   node scripts/livebook-images/rollback.js --last 5     # undo last 5 writes
//   node scripts/livebook-images/rollback.js --all        # undo everything in journal
//   node scripts/livebook-images/rollback.js --block <id> # undo one specific block
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

function arg(name, def = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : def;
}

const journalPath = path.join(__dirname, '_journal.jsonl');
const last = arg('last') ? Number(arg('last')) : null;
const all = process.argv.includes('--all');
const oneBlock = arg('block');

if (!last && !all && !oneBlock) {
  console.error('Specify --last N, --all, or --block <id>');
  process.exit(2);
}
if (!fs.existsSync(journalPath)) {
  console.error('No journal found — nothing to roll back.');
  process.exit(0);
}

let entries = fs.readFileSync(journalPath, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
if (oneBlock) entries = entries.filter((e) => e.blockId === oneBlock);
else if (last) entries = entries.slice(-last);

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  let undone = 0;
  for (const e of entries) {
    const res = await db.collection('book_pages').updateOne(
      { _id: e.pageId },
      { $set: { [`${e.arrayField}.$[b].${e.field}`]: '' } },
      { arrayFilters: [{ 'b.id': e.blockId }] }
    );
    if (res.modifiedCount) { undone++; console.log(`reset ${e.blockId.slice(0, 8)} ${e.field}`); }
  }
  console.log(`\nRolled back ${undone} block(s). R2 objects left in place (overwritten on retry).`);
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
