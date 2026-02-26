// Audit HC questions for short solutions
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const docs = await col.find({ 'metadata.chapter_id': 'ch11_hydrocarbon' })
    .sort({ display_id: 1 })
    .toArray();

  const issues = [];
  for (const d of docs) {
    const sol = d.solution?.text_markdown || '';
    const wordCount = sol.split(/\s+/).length;
    const hasSteps = sol.includes('Step') || sol.includes('**Step');
    const hasKeyPoints = sol.includes('Key Point');
    const isShort = wordCount < 100;
    const isBoilerplate = sol.includes('Step-by-Step Analysis') || sol.includes('Applying Concepts');

    if (isShort || isBoilerplate || !hasSteps || !hasKeyPoints) {
      issues.push({
        id: d.display_id,
        wordCount,
        hasSteps,
        hasKeyPoints,
        isBoilerplate,
        isShort,
        solSnippet: sol.substring(0, 120)
      });
    }
  }

  console.log(`Total HC questions: ${docs.length}`);
  console.log(`Issues found: ${issues.length}`);
  issues.forEach(i => {
    console.log(`\n${i.id} [${i.wordCount} words] boilerplate=${i.isBoilerplate} steps=${i.hasSteps} keypoints=${i.hasKeyPoints}`);
    console.log(`  "${i.solSnippet}..."`);
  });

  await mongoose.disconnect();
}
run().catch(e => { console.error(e); process.exit(1); });
