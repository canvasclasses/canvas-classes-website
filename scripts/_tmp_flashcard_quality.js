const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const mongoose = require('mongoose');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const c = db.collection('flashcards');

  // 1. short answers by chapter
  console.log('=== SHORT-ANSWER CARDS (<15 chars) BY CHAPTER ===');
  const shortByCh = await c.aggregate([
    { $match: { deleted_at: null, $expr: { $lt: [{ $strLenCP: '$answer' }, 15] } } },
    { $group: { _id: '$chapter.name', n: { $sum: 1 } } },
    { $sort: { n: -1 } }
  ]).toArray();
  shortByCh.forEach(r => console.log(`- ${r._id}: ${r.n}`));

  // sample short ones
  console.log('\n=== SAMPLE SHORT-ANSWER CARDS ===');
  const shortSamples = await c.find({ deleted_at: null, $expr: { $lt: [{ $strLenCP: '$answer' }, 15] } }).limit(8).toArray();
  shortSamples.forEach(s => console.log(`  [${s.chapter.name}] Q: ${s.question} | A: ${s.answer}`));

  // 2. duplicate questions
  console.log('\n=== DUPLICATE QUESTION GROUPS ===');
  const dupes = await c.aggregate([
    { $match: { deleted_at: null } },
    { $group: { _id: '$question', n: { $sum: 1 }, chapters: { $addToSet: '$chapter.name' }, ids: { $push: '$flashcard_id' } } },
    { $match: { n: { $gt: 1 } } },
    { $sort: { n: -1 } }
  ]).toArray();
  dupes.forEach(d => console.log(`  (x${d.n}) [${d.chapters.join('/')}] ${String(d._id).slice(0,80)} | ids: ${d.ids.join(',')}`));

  // 3. sample real cards per category to judge quality
  console.log('\n=== QUALITY SAMPLES (2 per category, NCERT vs Canvas) ===');
  for (const cat of ['Physical Chemistry','Organic Chemistry','Inorganic Chemistry','JEE PYQ']) {
    const samples = await c.find({ deleted_at: null, 'chapter.category': cat }).limit(3).toArray();
    console.log(`\n--- ${cat} ---`);
    samples.forEach(s => {
      console.log(`Q: ${s.question}`);
      console.log(`A: ${s.answer}`);
      console.log(`   (chapter=${s.chapter.name}, topic=${s.topic?.name}, src=${s.metadata?.source}, diff=${s.metadata?.difficulty})\n`);
    });
  }

  // 4. flashcard_type distribution
  console.log('=== FLASHCARD TYPE / class distribution ===');
  const types = await c.aggregate([
    { $match: { deleted_at: null } },
    { $group: { _id: '$flashcard_type', n: { $sum: 1 } } }
  ]).toArray();
  console.log('types:', JSON.stringify(types));
  const classes = await c.aggregate([
    { $match: { deleted_at: null } },
    { $group: { _id: '$metadata.class_num', n: { $sum: 1 } } }, { $sort: { _id: 1 } }
  ]).toArray();
  console.log('class_num:', JSON.stringify(classes));

  await mongoose.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
