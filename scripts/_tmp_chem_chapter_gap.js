const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const mongoose = require('mongoose');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  // question bank counts per chemistry chapter
  const q = db.collection('questions_v2');
  const byCh = await q.aggregate([
    { $match: { deleted_at: null, 'metadata.subject': /chem/i } },
    { $group: { _id: { id: '$metadata.chapter_id', name: '$metadata.chapter_name' }, n: { $sum: 1 } } },
    { $sort: { n: -1 } }
  ]).toArray();
  console.log('=== questions_v2 CHEMISTRY chapters (chapter_id : count) ===');
  if (byCh.length === 0) {
    // fallback: subject field may differ
    const subs = await q.distinct('metadata.subject');
    console.log('No chem match. Subjects present:', JSON.stringify(subs));
  }
  byCh.forEach(r => console.log(`- ${r._id.id || '(no id)'} | ${r._id.name || ''}: ${r.n}`));

  // double-dollar latex check in flashcards (FORBIDDEN per CLAUDE.md §4)
  const fc = db.collection('flashcards');
  const dd = await fc.countDocuments({ deleted_at: null, $or: [{ question: /\$\$/ }, { answer: /\$\$/ }] });
  const ddByCh = await fc.aggregate([
    { $match: { deleted_at: null, $or: [{ question: /\$\$/ }, { answer: /\$\$/ }] } },
    { $group: { _id: '$chapter.name', n: { $sum: 1 } } }, { $sort: { n: -1 } }
  ]).toArray();
  console.log('\n=== FLASHCARDS using FORBIDDEN $$...$$ double-dollar LaTeX ===');
  console.log('Total:', dd);
  ddByCh.forEach(r => console.log(`- ${r._id}: ${r.n}`));

  // trailing "?." artifact (question ends with ?.)
  const qDotArtifact = await fc.countDocuments({ deleted_at: null, question: /\?\.\s*$/ });
  console.log('\n=== Questions ending with "?." (extraction artifact) ===', qDotArtifact);

  await mongoose.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
