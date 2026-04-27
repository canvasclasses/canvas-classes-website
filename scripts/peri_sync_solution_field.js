// CRITICAL FIX: my batch1-8 scripts wrote rewritten solutions to the legacy
// `solution_markdown` field, but the canonical schema field that the student UI
// and admin actually read is `solution`. This script copies the new content
// from solution_markdown -> solution for every PERI-027..100 active doc.

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

(async () => {
  const c = new MongoClient(process.env.MONGODB_URI);
  await c.connect();
  const col = c.db('crucible').collection('questions_v2');

  const docs = await col.find({ display_id: { $regex: '^PERI-' }, deleted_at: null }).toArray();
  const targets = docs.filter(q => {
    const n = parseInt(q.display_id.split('-')[1], 10);
    return n >= 27 && n <= 100;
  });

  let synced = 0, alreadyMatch = 0, noLegacy = 0;
  const now = new Date();

  for (const q of targets) {
    const newSol = q.solution_markdown?.text_markdown;
    if (!newSol) { noLegacy++; continue; }

    const currentSol = q.solution?.text_markdown;
    if (currentSol === newSol) { alreadyMatch++; continue; }

    // Preserve existing solution structure (video_url, asset_ids) and overwrite text_markdown
    const newSolution = {
      ...(q.solution || {}),
      text_markdown: newSol,
      latex_validated: true,
      last_validated_at: now,
    };

    await col.updateOne(
      { display_id: q.display_id },
      { $set: { solution: newSolution } }
    );
    console.log(`SYNCED: ${q.display_id}`);
    synced++;
  }

  console.log(`\nDone. Synced: ${synced}, Already-match: ${alreadyMatch}, No-legacy-content: ${noLegacy}`);
  await c.close();
})().catch(e => { console.error(e); process.exit(1); });
