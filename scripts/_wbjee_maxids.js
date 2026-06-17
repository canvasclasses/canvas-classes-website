require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
(async () => {
  const c = new MongoClient(process.env.MONGODB_URI);
  await c.connect();
  const col = c.db('crucible').collection('questions_v2');
  for (const p of ['QUAD','CMPL','SQSR','PMCM','BNML']) {
    const docs = await col.find({ display_id: new RegExp('^'+p+'-\\d+$') }, { projection: { display_id: 1 } }).toArray();
    let max = 0;
    for (const d of docs) { const n = parseInt(d.display_id.split('-')[1],10); if (n>max) max=n; }
    console.log(`${p}: count=${docs.length} max=${max}`);
  }
  await c.close();
})().catch(e=>{console.error(e.message);process.exit(1)});
