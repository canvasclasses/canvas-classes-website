// Final verification: check HC questions for short/boilerplate solutions
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function verify() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');

  const hcQuestions = await col.find(
    { 'metadata.chapter_id': 'ch11_hydrocarbon' },
    { projection: { display_id: 1, 'solution.text_markdown': 1 } }
  ).sort({ display_id: 1 }).toArray();

  console.log(`Total HC questions: ${hcQuestions.length}`);

  const short = [];
  const ok = [];

  for (const q of hcQuestions) {
    const sol = q.solution?.text_markdown || '';
    const len = sol.length;
    const hasSteps = sol.includes('**Step');
    const hasKeyPoints = sol.toLowerCase().includes('key point');
    if (len < 300 || !hasSteps || !hasKeyPoints) {
      short.push({ id: q.display_id, len, hasSteps, hasKeyPoints, preview: sol.slice(0, 80) });
    } else {
      ok.push(q.display_id);
    }
  }

  console.log(`\n✅ OK (detailed solutions): ${ok.length}`);
  console.log(`⚠️  Still short/missing structure: ${short.length}`);
  if (short.length > 0) {
    console.log('\nProblematic questions:');
    for (const s of short) {
      console.log(`  ${s.id}: len=${s.len}, hasSteps=${s.hasSteps}, hasKeyPoints=${s.hasKeyPoints}`);
      console.log(`    Preview: ${s.preview}`);
    }
  }

  await mongoose.disconnect();
}
verify().catch(e => { console.error(e); process.exit(1); });
