/**
 * Fix GOC questions where is_pyq=false but exam_source is populated.
 * These create double-counting when filtering by source.
 * Fix: unset exam_source for all non-PYQ questions in ch11_goc.
 */
import 'dotenv/config';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

async function main() {
  await mongoose.connect(MONGODB_URI);
  const col = mongoose.connection.collection('questions_v2');

  // 1. Find all non-PYQ GOC questions that still have exam_source data
  const problematic = await col.find({
    'metadata.chapter_id': 'ch11_goc',
    'metadata.is_pyq': false,
    'metadata.exam_source': { $exists: true, $ne: null },
  }, { projection: { display_id: 1, 'metadata.exam_source': 1, 'metadata.is_pyq': 1 } }).toArray();

  console.log(`\nFound ${problematic.length} non-PYQ GOC questions with exam_source data:`);
  problematic.forEach(q => {
    console.log(`  ${(q as any).display_id}  exam_source: ${JSON.stringify((q as any).metadata.exam_source)}`);
  });

  if (problematic.length === 0) {
    console.log('Nothing to fix.');
    await mongoose.disconnect();
    return;
  }

  const ids = problematic.map(q => q._id);

  // 2. Unset exam_source for those questions
  const result = await col.updateMany(
    { _id: { $in: ids } },
    { $unset: { 'metadata.exam_source': '' }, $set: { updated_at: new Date() } }
  );

  console.log(`\nFixed ${result.modifiedCount} questions — exam_source unset.`);

  // 3. Verify totals
  const totalGoc = await col.countDocuments({ 'metadata.chapter_id': 'ch11_goc', deleted_at: null });
  const pyqMain  = await col.countDocuments({ 'metadata.chapter_id': 'ch11_goc', deleted_at: null, 'metadata.is_pyq': true, 'metadata.exam_source.exam': { $regex: /main/i } });
  const pyqAdv   = await col.countDocuments({ 'metadata.chapter_id': 'ch11_goc', deleted_at: null, 'metadata.is_pyq': true, 'metadata.exam_source.exam': { $regex: /adv/i } });
  const nonPyq   = await col.countDocuments({ 'metadata.chapter_id': 'ch11_goc', deleted_at: null, 'metadata.is_pyq': false });

  console.log(`\nPost-fix GOC totals:`);
  console.log(`  Total:        ${totalGoc}`);
  console.log(`  JEE Main:     ${pyqMain}`);
  console.log(`  JEE Advanced: ${pyqAdv}`);
  console.log(`  Non-PYQ:      ${nonPyq}`);
  console.log(`  Sum (M+A+NP): ${pyqMain + pyqAdv + nonPyq}`);
  console.log(`  Match:        ${totalGoc === pyqMain + pyqAdv + nonPyq ? '✅ YES' : '❌ NO — some PYQ questions may have neither main nor adv in exam name'}`);

  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
