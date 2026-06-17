require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
(async () => {
  const c = new MongoClient(process.env.MONGODB_URI); await c.connect();
  const col = c.db('crucible').collection('questions_v2');
  for (const yr of [2023, 2024, 2025]) {
    const total = await col.countDocuments({ 'metadata.examDetails.exam': 'WBJEE', 'metadata.examDetails.year': yr, deleted_at: null });
    const bySubj = await col.aggregate([{ $match: { 'metadata.examDetails.exam':'WBJEE','metadata.examDetails.year':yr, deleted_at:null } },{ $group:{_id:'$metadata.subject',n:{$sum:1}} }]).toArray();
    console.log(`WBJEE ${yr}: ${total}  (${bySubj.map(s=>s._id+'='+s.n).join(', ')})`);
  }
  console.log('WBJEE total:', await col.countDocuments({ 'metadata.examDetails.exam': 'WBJEE', deleted_at: null }));
  await c.close();
})().catch(e=>{console.error(e.message);process.exit(1)});
