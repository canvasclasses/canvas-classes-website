/*
 * One-shot Atlas connection-pool snapshot.
 *
 * Usage:  node scripts/check_mongo_connections.js
 *
 * Reports:
 *   - current / available / total-created (from db.serverStatus().connections)
 *   - rough "% of cap" so you can spot saturation immediately
 *
 * If you ever see `current` approaching the Atlas tier ceiling (M0/M2 = 500,
 * M10 = 1500), prime suspects in order:
 *   1. Vercel function instances each holding maxPoolSize connections.
 *      Lower maxPoolSize in packages/data/db/mongodb.ts.
 *   2. A long-running script that forgot to disconnect. Check `ps`.
 *   3. Multiple dev servers (student + admin) on the same machine.
 *   4. Connection leak in a new route — anything calling new MongoClient
 *      without an explicit close() in scripts/ is a usual suspect.
 *
 * This script connects with a tiny pool (max 2) and disconnects on exit, so
 * running it does not measurably affect the count it reports.
 */

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

(async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set in .env.local');
    process.exit(1);
  }

  const client = new MongoClient(uri, { maxPoolSize: 2, minPoolSize: 0 });
  await client.connect();
  try {
    const status = await client.db().admin().serverStatus();
    const { current, available, totalCreated } = status.connections;
    const cap = current + available;
    const pct = ((current / cap) * 100).toFixed(1);

    console.log('── Atlas connection pool snapshot ──');
    console.log(`  current      : ${current.toString().padStart(5)}`);
    console.log(`  available    : ${available.toString().padStart(5)}`);
    console.log(`  ceiling      : ${cap.toString().padStart(5)}    ${pct}% used`);
    console.log(`  totalCreated : ${totalCreated.toString().padStart(5)}    (lifetime)`);

    if (current / cap > 0.85) {
      console.log('\n  ⚠️  Pool over 85% full. Likely culprits:');
      console.log('     - Too many Vercel function instances × maxPoolSize');
      console.log('     - A script left running with an open connection');
      console.log('     - Both dev servers running on the same machine');
    } else if (current / cap > 0.6) {
      console.log('\n  Mild pressure (60-85%). Monitor but not urgent.');
    } else {
      console.log('\n  Healthy.');
    }
  } finally {
    await client.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
