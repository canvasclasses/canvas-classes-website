require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
(async () => {
  const c = new MongoClient(process.env.MONGODB_URI);
  await c.connect();
  const col = c.db('crucible').collection('questions_v2');
  const ids = ['QUAD-131','CMPL-156','PMCM-147','BNML-206'];
  const docs = await col.find({ display_id: { $in: ids } }).toArray();
  for (const d of docs) {
    const m = d.metadata;
    console.log(`${d.display_id} | type=${d.type} | exams=${JSON.stringify(m.applicableExams)} | src=${m.sourceType} | exam=${m.examDetails?.exam} yr=${m.examDetails?.year} | tag=${m.tags?.[0]?.tag_id} | correct=${d.options.find(o=>o.is_correct)?.id} | status=${d.status}`);
  }
  // counts
  const total = await col.countDocuments({ 'metadata.applicableExams': 'WBJEE', deleted_at: null });
  console.log(`\nTotal WBJEE-tagged questions in bank: ${total}`);
  await c.close();
})().catch(e=>{console.error(e.message);process.exit(1)});
