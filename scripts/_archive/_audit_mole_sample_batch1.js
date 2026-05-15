require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Stratified sample sizes per primary tag (proportional to counts; total 30)
const PLAN = [
  { tag: 'tag_mole_1', n: 3 },
  { tag: 'tag_mole_2', n: 5 },
  { tag: 'tag_mole_3', n: 4 },
  { tag: 'tag_mole_4', n: 2 },
  { tag: 'tag_mole_5', n: 2 },
  { tag: 'tag_mole_6', n: 3 },
  { tag: 'tag_mole_7', n: 4 },
  { tag: 'tag_mole_8', n: 7 },
];

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const PROJ = {
    display_id: 1, type: 1, 'question_text.markdown': 1,
    options: 1, answer: 1, 'solution.text_markdown': 1,
    'metadata.difficultyLevel': 1, 'metadata.tags': 1,
    'metadata.microConcept': 1, 'metadata.questionNature': 1,
    'metadata.sourceType': 1, 'metadata.examDetails': 1,
    'metadata.applicableExams': 1,
  };

  const out = [];
  for (const { tag, n } of PLAN) {
    // Take every k-th question across the bucket so it's spread, not clustered at low display_id.
    const all = await col.find(
      { 'metadata.chapter_id': 'ch11_mole', deleted_at: null, 'metadata.tags.0.tag_id': tag },
      { projection: PROJ }
    ).sort({ display_id: 1 }).toArray();
    if (all.length === 0) continue;
    const step = Math.max(1, Math.floor(all.length / n));
    const picks = [];
    for (let i = 0; i < n; i++) {
      const idx = Math.min(all.length - 1, i * step);
      picks.push(all[idx]);
    }
    out.push(...picks);
  }
  console.log('Sampled', out.length, 'questions');
  require('fs').writeFileSync('scripts/_audit_mole_batch1_input.json', JSON.stringify(out, null, 2));
  await mongoose.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
