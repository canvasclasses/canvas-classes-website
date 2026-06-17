require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const PREFIXES = [
  // Maths
  'BOMA','QUAD','CMPL','SQSR','PMCM','BNML','MRES','STAT','MTRX','DTRM','PROB','STRL','FUNC','LIMS','CTDF','DIFF','AODV','ININ','DFIN','AUC','DFEQ','STLN','CRCL','PRBL','ELPS','HYPB','TRRI','TREQ','ITF','HTDT','PRTR','VCAL','TDGM',
  // Physics
  'MIP','UNIT','K1D','K2D','NLM','WEP','COM','ROT','GRAV','SOLD','FLUI','SHM','WAVE','THPR','TDYN','KTG','ELST','CAPC','CURR','MAGM','MVCH','EMI','ACUR','ROPY','WVOP','DUAL','ATPH','NUCL','EMW','SEMI','COMM','EXPP',
  // Chemistry
  'ATOM','BOND','CEQ','GOC','HC','IEQ','MOLE','PB11','PERI','POC','RDX','THERMO','ALCO','AMIN','BIO','ALDO','CORD','DNF','EC','HALO','CK','PB12','SALT','SOL',
];
async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');
  const out = {};
  for (const p of PREFIXES) {
    const docs = await col.find({ display_id: { $regex: `^${p}-\\d+$` } }, { projection: { display_id: 1 } }).toArray();
    let max = 0;
    for (const d of docs) { const n = parseInt(d.display_id.slice(p.length + 1), 10); if (n > max) max = n; }
    out[p] = max;
  }
  console.log(JSON.stringify(out));
  await client.close();
}
main().catch(e => { console.error(e); process.exit(1); });
