// restore_colleges_backup.js — roll back the `colleges` collection to a backup
// produced by update_college_data.js.
//   Usage: node scripts/restore_colleges_backup.js <path-to-backup.json>
// Restores each backed-up document via replaceOne (upsert), returning every
// field to its pre-update state.

const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });
const fs = require('fs');
const { MongoClient } = require('mongodb');

(async () => {
  const file = process.argv[2];
  if (!file) { console.error('Usage: node scripts/restore_colleges_backup.js <backup.json>'); process.exit(1); }
  const docs = JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'));
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('colleges');
  let restored = 0;
  for (const d of docs) {
    await col.replaceOne({ _id: d._id }, d, { upsert: true });
    restored++;
  }
  console.log(`Restored ${restored} colleges from ${file}`);
  await client.close();
})().catch((e) => { console.error('ERR', e); process.exit(1); });
