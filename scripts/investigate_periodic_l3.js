/**
 * scripts/investigate_periodic_l3.js   READ-ONLY
 *
 * The pre-audit flagged ch11_periodic as 74% L3 — suspicious uniformity.
 * This script forensically investigates whether the L3 cluster is:
 *
 *   (a) Real — the chapter genuinely skews medium-difficulty
 *   (b) An auto-tagging artifact — a bulk script applied L3 wholesale
 *   (c) Source-driven — PYQs of this chapter are predominantly L3
 *
 * Reports L3 vs non-L3 distribution along several axes that would
 * separate these explanations:
 *
 *   - By sourceType (PYQ vs Practice)
 *   - By PYQ exam (JEE Main vs JEE Advanced vs NEET)
 *   - By PYQ year
 *   - By creation date (clustered = bulk script applied)
 *   - By created_by (who imported these?)
 *   - By display_id prefix range (sequential batch = bulk action)
 *
 * Also spot-checks: 10 sample L3 questions printed with their first
 * 200 chars of text so we can eyeball whether they actually look
 * medium-difficulty.
 */

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const CHAPTER = 'ch11_periodic';

function tally(arr, keyFn) {
  const m = new Map();
  for (const x of arr) {
    const k = keyFn(x);
    m.set(k, (m.get(k) || 0) + 1);
  }
  return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
}

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db();
  const questions = db.collection('questions_v2');

  const docs = await questions
    .find({
      'metadata.chapter_id': CHAPTER,
      status: 'published',
      deleted_at: null,
    })
    .project({
      display_id: 1,
      question_text: 1,
      'metadata.difficultyLevel': 1,
      'metadata.sourceType': 1,
      'metadata.examDetails': 1,
      'metadata.exam_source': 1,
      'metadata.is_top_pyq': 1,
      created_at: 1,
      created_by: 1,
      updated_by: 1,
    })
    .toArray();

  const l3 = docs.filter((d) => d.metadata?.difficultyLevel === 3);
  const nonL3 = docs.filter((d) => d.metadata?.difficultyLevel !== 3);

  console.log(`\n────── ch11_periodic L3 dominance investigation ──────`);
  console.log(`Total: ${docs.length}`);
  console.log(`L3: ${l3.length} (${((l3.length / docs.length) * 100).toFixed(1)}%)`);
  console.log(`Non-L3: ${nonL3.length}\n`);

  // 1. sourceType comparison
  console.log('Question count by (difficulty, sourceType):');
  for (const level of [1, 2, 3, 4, 5]) {
    const at = docs.filter((d) => d.metadata?.difficultyLevel === level);
    const pyq = at.filter((d) => d.metadata?.sourceType === 'PYQ').length;
    const pra = at.filter((d) => d.metadata?.sourceType === 'Practice').length;
    if (at.length === 0) continue;
    console.log(`  L${level}: total ${at.length.toString().padStart(3)} | PYQ ${pyq.toString().padStart(3)} | Practice ${pra.toString().padStart(3)}`);
  }

  // 2. L3 by PYQ exam type
  console.log('\nL3 distribution by exam type (PYQ only):');
  const l3Pyq = l3.filter((d) => d.metadata?.sourceType === 'PYQ');
  const examTally = tally(l3Pyq, (d) => {
    const m = d.metadata?.examDetails?.exam || d.metadata?.exam_source?.exam;
    return m || '(unset)';
  });
  for (const [exam, n] of examTally) {
    console.log(`  ${String(exam).padEnd(20)} ${n}`);
  }

  // 3. L3 by PYQ year (helps see if a particular year is L3-heavy)
  console.log('\nL3 distribution by year (PYQ only):');
  const yearTally = tally(l3Pyq, (d) => {
    const y = d.metadata?.examDetails?.year || d.metadata?.exam_source?.year;
    return y || '(unset)';
  });
  for (const [yr, n] of yearTally.slice(0, 12)) {
    console.log(`  ${String(yr).padEnd(8)} ${n}`);
  }

  // 4. created_at clustering — month-level histogram
  console.log('\nL3 created_at by month (clustered = bulk action):');
  const monthTally = tally(l3, (d) => {
    if (!d.created_at) return '(unset)';
    const date = new Date(d.created_at);
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
  });
  for (const [m, n] of monthTally.slice(0, 12)) {
    console.log(`  ${m.padEnd(10)} ${n}`);
  }

  // 5. created_by distribution
  console.log('\nL3 created_by:');
  const creatorTally = tally(l3, (d) => d.created_by || '(unset)');
  for (const [c, n] of creatorTally.slice(0, 8)) {
    console.log(`  ${String(c).padEnd(40)} ${n}`);
  }

  // 6. updated_by — was a script applied?
  console.log('\nL3 updated_by:');
  const updaterTally = tally(l3, (d) => d.updated_by || '(unset)');
  for (const [u, n] of updaterTally.slice(0, 8)) {
    console.log(`  ${String(u).padEnd(40)} ${n}`);
  }

  // 7. display_id prefix sequence — bulk batches are usually contiguous
  console.log('\nL3 display_id range (first 5 + last 5 sorted):');
  const ids = l3.map((d) => d.display_id).sort();
  console.log(`  ${ids.slice(0, 5).join(', ')}  …  ${ids.slice(-5).join(', ')}`);

  // 8. Sample 10 L3 questions — eyeball whether they actually look medium
  console.log('\n────── 10 SAMPLE L3 QUESTIONS (first 180 chars) ──────');
  const sample = l3.slice(0, 10);
  for (const q of sample) {
    const txt = (q.question_text?.markdown || '').replace(/\s+/g, ' ').slice(0, 180);
    console.log(`\n[${q.display_id}] (created_by=${q.created_by || '?'})`);
    console.log(`  ${txt}`);
  }
  console.log('');

  await client.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
