/**
 * Check is_top_pyq counts per chapter
 * 
 * Usage: npx tsx scripts/check-top-pyq-counts.ts
 */

import 'dotenv/config';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

async function checkTopPYQCounts() {
  await mongoose.connect(MONGODB_URI);
  const col = mongoose.connection.collection('questions_v2');

  // Get counts per chapter
  const counts = await col.aggregate([
    { $match: { 'metadata.is_top_pyq': true, deleted_at: null } },
    { $group: { _id: '$metadata.chapter_id', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]).toArray();

  console.log('\n📊 Top PYQ Counts by Chapter:\n');
  console.log('Chapter ID'.padEnd(25) + 'Count');
  console.log('─'.repeat(35));
  
  counts.forEach((item: any) => {
    const status = item.count >= 20 ? '✅' : '⚠️ ';
    console.log(`${status} ${item._id.padEnd(23)} ${item.count}`);
  });

  const total = counts.reduce((sum: number, item: any) => sum + item.count, 0);
  console.log('─'.repeat(35));
  console.log(`Total: ${total} top PYQ questions\n`);

  // Show chapters with < 20 (won't show Quick Revision)
  const below20 = counts.filter((item: any) => item.count < 20);
  if (below20.length > 0) {
    console.log('\n⚠️  Chapters with < 20 top PYQs (Quick Revision hidden):\n');
    below20.forEach((item: any) => {
      console.log(`   ${item._id}: ${item.count} questions`);
    });
  }

  await mongoose.disconnect();
}

checkTopPYQCounts().catch(console.error);
