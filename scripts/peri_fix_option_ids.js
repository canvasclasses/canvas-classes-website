// Fix: my batch scripts replaced options arrays without the required `id` field.
// This script walks every PERI-027..100 doc and sets opt.id = 'a'/'b'/'c'/'d'/'e'
// based on position, but ONLY where opt.id is missing.
// Idempotent: safe to re-run.

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');

  const docs = await col.find({ display_id: { $regex: '^PERI-' } }).toArray();
  const targets = docs.filter(q => {
    const n = parseInt(q.display_id.split('-')[1], 10);
    return n >= 27 && n <= 100;
  });

  let fixed = 0, skipped = 0, archivedSkipped = 0;
  for (const q of targets) {
    if (q.deleted_at || q.status === 'archived') { archivedSkipped++; continue; }
    const opts = q.options || [];
    if (opts.length === 0) { skipped++; continue; } // PERI-041 has no options (Numerical)

    const needsFix = opts.some(o => !o.id);
    if (!needsFix) { skipped++; continue; }

    const fixedOpts = opts.map((o, i) => ({
      id: o.id || String.fromCharCode(97 + i), // 'a','b','c','d','e'
      text: o.text,
      is_correct: !!o.is_correct,
      ...(o.asset_ids ? { asset_ids: o.asset_ids } : {}),
    }));

    await col.updateOne({ display_id: q.display_id }, { $set: { options: fixedOpts } });
    console.log(`FIXED: ${q.display_id} (${fixedOpts.length} options)`);
    fixed++;
  }

  console.log(`\nDone. Fixed: ${fixed}, Already-OK: ${skipped}, Archived (skipped): ${archivedSkipped}`);
  await client.close();
})().catch(e => { console.error(e); process.exit(1); });
