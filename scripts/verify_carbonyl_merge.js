// Verify the carbonyl chapter merge is complete
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');

  console.log('=== VERIFICATION REPORT ===\n');

  // Check old chapter IDs don't exist
  const oldAldehydes = await col.countDocuments({ 'metadata.chapter_id': 'ch12_aldehydes' });
  const oldCarboxylic = await col.countDocuments({ 'metadata.chapter_id': 'ch12_carboxylic' });
  
  console.log('Old chapter IDs (should be 0):');
  console.log('  ch12_aldehydes:', oldAldehydes);
  console.log('  ch12_carboxylic:', oldCarboxylic);

  // Check new unified chapter
  const newCarbonyl = await col.countDocuments({ 'metadata.chapter_id': 'ch12_carbonyl' });
  console.log('\nNew unified chapter:');
  console.log('  ch12_carbonyl:', newCarbonyl, 'questions');

  // Show sample questions with their tags
  const samples = await col.find({ 'metadata.chapter_id': 'ch12_carbonyl' })
    .limit(5)
    .project({ display_id: 1, 'metadata.tags': 1 })
    .toArray();

  console.log('\nSample questions in ch12_carbonyl:');
  samples.forEach(q => {
    const tagIds = q.metadata.tags.map(t => t.tag_id).join(', ');
    console.log(`  ${q.display_id}: [${tagIds}]`);
  });

  // Count questions by tag prefix
  const aldehydeTags = await col.countDocuments({ 
    'metadata.chapter_id': 'ch12_carbonyl',
    'metadata.tags.tag_id': /^tag_aldehydes_/
  });
  const carboxylicTags = await col.countDocuments({ 
    'metadata.chapter_id': 'ch12_carbonyl',
    'metadata.tags.tag_id': /^tag_carboxylic_/
  });

  console.log('\nTag distribution in ch12_carbonyl:');
  console.log('  Questions with aldehyde tags:', aldehydeTags);
  console.log('  Questions with carboxylic tags:', carboxylicTags);

  console.log('\n✅ Verification complete!');
  console.log('Expected: 0 old chapters, 17 in new unified chapter');
  console.log(`Actual: ${oldAldehydes + oldCarboxylic} old, ${newCarbonyl} new`);

  if (oldAldehydes === 0 && oldCarboxylic === 0 && newCarbonyl === 17) {
    console.log('\n✅ ALL CHECKS PASSED - Merge successful!');
  } else {
    console.log('\n❌ CHECKS FAILED - Please review');
  }

  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
