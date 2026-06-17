require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const PREFIXES = [
  // Maths
  'BOMA','QUAD','CMPL','PMCM','TRRI','SQSR','BNML','STLN','CRCL','PRBL','ELPS','HYPB',
  'LIMS','STRL','MTRX','DTRM','FUNC','CTDF','DIFF','DFEQ','ININ','DFIN','AUC','VCAL','TDGM','PROB','AODV',
  // Physics
  'UNIT','SEMI','WEP','ROT','NLM','SOLD','GRAV','FLUI','TDYN','KTG','SHM','ELST','CAPC','CURR',
  'MVCH','ACUR','EMI','ROPY','WVOP','DUAL','ATPH','K2D',
  // Chemistry
  'MOLE','ATOM','PERI','BOND','GOC','SALT','HC','PB11','PB12','RDX','CORD','DNF','HALO','ALDO','SOL','IEQ',
];

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');
  const out = {};
  for (const p of PREFIXES) {
    const docs = await col.find({ display_id: { $regex: `^${p}-\\d+$` } }, { projection: { display_id: 1 } }).toArray();
    let max = 0;
    for (const d of docs) {
      const n = parseInt(d.display_id.slice(p.length + 1), 10);
      if (n > max) max = n;
    }
    out[p] = max;
  }
  console.log(JSON.stringify(out, null, 0));
  await client.close();
}
main().catch(e => { console.error(e); process.exit(1); });
