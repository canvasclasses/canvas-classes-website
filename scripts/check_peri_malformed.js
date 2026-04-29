require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const col = db.collection('questions_v2');

  // Find all PERI questions where display_id contains a space (malformed)
  const malformed = await col.find(
    { display_id: /^PERI-\d+ \[/ },
    { projection: { display_id: 1, _id: 1, 'metadata.source': 1, 'metadata.pyq_year': 1, 'question_text.markdown': 1 } }
  ).sort({ display_id: 1 }).toArray();

  console.log(`Malformed display_ids: ${malformed.length}`);
  
  // Group by the clean base ID they should have
  const byBase = {};
  for (const q of malformed) {
    const base = q.display_id.replace(/ \[.*$/, '');
    if (!byBase[base]) byBase[base] = [];
    byBase[base].push({ id: q.display_id, _id: q._id, src: q.metadata?.source, yr: q.metadata?.pyq_year, text: (q.question_text?.markdown || '').slice(0,60) });
  }

  console.log(`\nAffected base IDs: ${Object.keys(byBase).length}`);
  console.log('\nSample (first 10):');
  Object.entries(byBase).slice(0, 10).forEach(([base, arr]) => {
    console.log(`  ${base}: ${arr.map(a => `"${a.id}"`).join(', ')}`);
  });

  // Check which base IDs already exist as clean IDs
  const baseIds = Object.keys(byBase);
  const existing = await col.find(
    { display_id: { $in: baseIds } },
    { projection: { display_id: 1 } }
  ).toArray();
  const existingSet = new Set(existing.map(q => q.display_id));
  
  console.log(`\nBase IDs that already have a clean doc in DB: ${existingSet.size}`);
  console.log(Array.from(existingSet).join(', '));

  // Show the max clean PERI number
  const allClean = await col.find(
    { display_id: /^PERI-\d+$/ },
    { projection: { display_id: 1 } }
  ).toArray();
  
  const nums = allClean.map(q => parseInt(q.display_id.replace('PERI-', ''))).sort((a,b)=>a-b);
  console.log(`\nClean PERI IDs count: ${nums.length}`);
  console.log(`Range: PERI-${nums[0]} to PERI-${nums[nums.length-1]}`);
  console.log('Max:', nums[nums.length-1]);

  await mongoose.disconnect();
}
main().catch(console.error);
