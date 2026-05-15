require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const docs = await col.find(
    { 'metadata.chapter_id': 'ch11_mole', deleted_at: null },
    { projection: { display_id:1, type:1, 'question_text.markdown':1, options:1, answer:1, 'metadata.difficultyLevel':1, 'metadata.tags':1, 'metadata.microConcept':1, 'metadata.questionNature':1, 'metadata.sourceType':1, 'metadata.examDetails':1 } }
  ).sort({ display_id: 1 }).limit(3).toArray();
  console.log(JSON.stringify(docs, null, 2));
  await mongoose.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
