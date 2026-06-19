const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const mongoose = require('mongoose');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const c = db.collection('flashcards');

  const total = await c.countDocuments();
  const active = await c.countDocuments({ deleted_at: null });
  const deleted = await c.countDocuments({ deleted_at: { $ne: null } });
  console.log('=== FLASHCARDS COLLECTION ===');
  console.log('Total docs:', total, '| Active:', active, '| Soft-deleted:', deleted);

  // counts per chapter (active only)
  const byChapter = await c.aggregate([
    { $match: { deleted_at: null } },
    { $group: {
        _id: { cat: '$chapter.category', chId: '$chapter.id', chName: '$chapter.name' },
        count: { $sum: 1 },
        topics: { $addToSet: '$topic.name' },
        difficulties: { $push: '$metadata.difficulty' },
        sources: { $addToSet: '$metadata.source' },
        classNums: { $addToSet: '$metadata.class_num' }
    }},
    { $sort: { '_id.cat': 1, count: -1 } }
  ]).toArray();

  console.log('\n=== PER-CHAPTER INVENTORY (active) ===');
  let curCat = '';
  for (const r of byChapter) {
    if (r._id.cat !== curCat) { curCat = r._id.cat; console.log('\n### ' + curCat); }
    const diffCounts = r.difficulties.reduce((a,d)=>{a[d||'(none)']=(a[d||'(none)']||0)+1;return a;},{});
    console.log(`- ${r._id.chName} [${r._id.chId}]: ${r.count} cards | ${r.topics.length} topics | class:${r.classNums.join(',')} | src:${r.sources.join(',')} | diff:${JSON.stringify(diffCounts)}`);
  }

  // category totals
  const byCat = await c.aggregate([
    { $match: { deleted_at: null } },
    { $group: { _id: '$chapter.category', count: { $sum: 1 }, chapters: { $addToSet: '$chapter.name' } } },
    { $sort: { count: -1 } }
  ]).toArray();
  console.log('\n=== CATEGORY TOTALS ===');
  for (const r of byCat) console.log(`- ${r._id}: ${r.count} cards across ${r.chapters.length} chapters`);

  // quality signals
  console.log('\n=== QUALITY SIGNALS ===');
  const noDiff = await c.countDocuments({ deleted_at: null, 'metadata.difficulty': { $in: [null, undefined] } });
  const noTags = await c.countDocuments({ deleted_at: null, $or: [{ 'metadata.tags': { $exists: false } }, { 'metadata.tags': { $size: 0 } }] });
  const hasImage = await c.countDocuments({ deleted_at: null, $or: [{ question: /!\[/ }, { answer: /!\[/ }] });
  const hasLatex = await c.countDocuments({ deleted_at: null, $or: [{ question: /\$/ }, { answer: /\$/ }] });
  console.log('Cards missing difficulty:', noDiff);
  console.log('Cards with no tags:', noTags);
  console.log('Cards containing an image:', hasImage);
  console.log('Cards containing LaTeX ($):', hasLatex);

  // answer/question length distribution
  const lenStats = await c.aggregate([
    { $match: { deleted_at: null } },
    { $project: { qLen: { $strLenCP: '$question' }, aLen: { $strLenCP: '$answer' } } },
    { $group: { _id: null, avgQ: { $avg: '$qLen' }, avgA: { $avg: '$aLen' }, minA: { $min: '$aLen' }, maxA: { $max: '$aLen' } } }
  ]).toArray();
  console.log('Length stats:', JSON.stringify(lenStats[0]));

  // very short answers (potential low quality)
  const shortAns = await c.countDocuments({ deleted_at: null, $expr: { $lt: [{ $strLenCP: '$answer' }, 15] } });
  console.log('Cards with very short answer (<15 chars):', shortAns);

  // duplicate question detection (same question text)
  const dupes = await c.aggregate([
    { $match: { deleted_at: null } },
    { $group: { _id: '$question', n: { $sum: 1 } } },
    { $match: { n: { $gt: 1 } } },
    { $count: 'dupGroups' }
  ]).toArray();
  console.log('Duplicate-question groups:', dupes[0]?.dupGroups || 0);

  await mongoose.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
