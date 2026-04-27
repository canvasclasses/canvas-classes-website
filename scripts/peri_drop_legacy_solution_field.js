// Drop the legacy `solution_markdown` field from every doc that has it.
// Pre-condition: solution.text_markdown must equal solution_markdown.text_markdown.
// We verify equality first and refuse to drop if anything differs.

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

(async () => {
  const c = new MongoClient(process.env.MONGODB_URI);
  await c.connect();
  const col = c.db('crucible').collection('questions_v2');

  const docs = await col.find({ solution_markdown: { $exists: true } }).toArray();
  console.log(`Docs with legacy field: ${docs.length}`);

  let toDrop = [];
  let unsafe = 0;
  for (const d of docs) {
    const sol = d.solution?.text_markdown || '';
    const leg = d.solution_markdown?.text_markdown || '';
    if (sol && leg && sol === leg) {
      toDrop.push(d.display_id);
    } else {
      console.log(`UNSAFE: ${d.display_id} — content differs (canonical=${sol.length}c, legacy=${leg.length}c)`);
      unsafe++;
    }
  }

  if (unsafe > 0) {
    console.log(`\nAborting: ${unsafe} docs would lose data. Resolve manually first.`);
    await c.close();
    process.exit(1);
  }

  if (toDrop.length === 0) {
    console.log('Nothing to drop.');
    await c.close();
    return;
  }

  const r = await col.updateMany(
    { display_id: { $in: toDrop } },
    { $unset: { solution_markdown: '' } }
  );
  console.log(`Dropped legacy field on ${r.modifiedCount} docs.`);

  // Re-verify
  const stillHas = await col.countDocuments({ solution_markdown: { $exists: true } });
  console.log(`Docs still carrying solution_markdown: ${stillHas}`);

  await c.close();
})().catch(e => { console.error(e); process.exit(1); });
