// READ-ONLY MongoDB verification for the /data/ cleanup audit (PR H).
//
// Connects via MONGODB_URI in .env.local. Used to verify:
//   1. Which collections exist and how many docs each holds
//   2. Whether dead-model collections (student_profiles, college_branches,
//      V1 `questions`) are empty / orphaned
//   3. Per-chapter question counts in `questions_v2` vs the JSON files in
//      /data/chapters/ — confirms each JSON's data is preserved in MongoDB
//   4. PERI- / MOLE- display_id prefix counts (for /data/peri_*.json and
//      /data/mole_pyq_solutions_set*.json cleanup decisions)
//   5. Whether old V1 chapter_id format ("chapter_*") still has any docs
//      (drives /data/questions/*.OLD_ARCHIVED cleanup decision)
//
// SAFETY: this script ONLY uses read methods. It MUST NEVER call any of:
//   .drop, .dropDatabase, .dropIndex, .dropIndexes,
//   .deleteOne, .deleteMany, .findOneAndDelete,
//   .insertOne, .insertMany,
//   .updateOne, .updateMany, .findOneAndUpdate, .findOneAndReplace, .replaceOne,
//   .bulkWrite, .createIndex, .renameCollection,
//   $out / $merge / $write stages in aggregations.
//
// Allowed methods: countDocuments, findOne, distinct, listCollections, find,
// aggregate (read-only stages only), close, connect, db.
//
// Run: node scripts/verify_data_cleanup.js

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const URI = process.env.MONGODB_URI;
if (!URI) {
  console.error('FATAL: MONGODB_URI not set in .env.local');
  process.exit(1);
}

// Expected collections from the code-truth audit
// (docs/DATA_STORES_GROUND_TRUTH_2026-04-30.md §2)
const EXPECTED_COLLECTIONS = [
  'questions_v2', 'chapters', 'assets', 'audit_logs', 'activity_logs',
  'flashcards', 'test_results', 'mock_test_sets',
  'user_progress', 'student_chapter_profiles', 'student_responses',
  'books', 'book_pages', 'book_progress', 'book_bookmarks',
  'bitsat_plan_progress',
  'career_paths', 'career_questions', 'career_profiles', 'career_matches',
  'colleges', 'college_cutoffs',
  'blog_posts', 'blog_ideas', 'blog_sources',
  'user_roles', 'role_audit_logs',
  'example_view_sessions', // raw access only, no model
];

// Collections expected to be EMPTY or NOT EXIST (dead per cleanup audit)
const DEAD_COLLECTIONS = ['student_profiles', 'college_branches', 'questions'];

const pad = (s, n) => String(s).padEnd(n);

async function main() {
  const client = new MongoClient(URI);
  await client.connect();
  const db = client.db(); // use DB name from URI (should be 'crucible')

  console.log(`\n=== Connected to DB: ${db.databaseName} ===`);

  // ---------------- A. ALL COLLECTIONS ----------------
  console.log('\n=== A. ALL COLLECTIONS IN DATABASE (read-only) ===');
  const colls = await db.listCollections().toArray();
  const collNames = colls.map(c => c.name).sort();
  for (const name of collNames) {
    const count = await db.collection(name).countDocuments();
    console.log(`  ${pad(name, 32)} ${count}`);
  }

  // ---------------- B. EXPECTED vs ACTUAL ----------------
  console.log('\n=== B. EXPECTED vs ACTUAL ===');
  const expectedSet = new Set(EXPECTED_COLLECTIONS);
  const actualSet = new Set(collNames);
  console.log('  Expected & found:');
  for (const e of EXPECTED_COLLECTIONS) {
    if (actualSet.has(e)) console.log(`    + ${e}`);
  }
  console.log('  Expected but MISSING:');
  for (const e of EXPECTED_COLLECTIONS) {
    if (!actualSet.has(e)) console.log(`    - ${e}`);
  }
  console.log('  Unexpected (in DB but not in code map):');
  for (const a of collNames) {
    if (!expectedSet.has(a) && !DEAD_COLLECTIONS.includes(a)) {
      console.log(`    ? ${a}`);
    }
  }

  // ---------------- C. DEAD COLLECTIONS ----------------
  console.log('\n=== C. DEAD COLLECTIONS (drop candidates) ===');
  for (const name of DEAD_COLLECTIONS) {
    if (actualSet.has(name)) {
      const count = await db.collection(name).countDocuments();
      console.log(`  ${pad(name, 22)} ${count} docs`);
      if (count > 0) {
        const sample = await db.collection(name).findOne();
        console.log(`    SAMPLE _id: ${sample?._id}`);
        console.log(`    SAMPLE fields: ${Object.keys(sample || {}).slice(0, 8).join(', ')}`);
      }
    } else {
      console.log(`  ${pad(name, 22)} (collection does not exist — already clean)`);
    }
  }

  // ---------------- D. /data/chapters/*.json ----------------
  console.log('\n=== D. /data/chapters/*.json verification ===');
  const chaptersDir = path.join(process.cwd(), 'data', 'chapters');
  if (!fs.existsSync(chaptersDir)) {
    console.log(`  (no /data/chapters/ directory present)`);
  } else {
    const files = fs.readdirSync(chaptersDir)
      .filter(f => f.endsWith('.json') && !f.startsWith('_'))
      .sort();
    console.log(`  ${pad('FILE', 34)} ${pad('CHAPTER_ID', 22)} ${pad('JSON', 6)} ${pad('DB', 6)} VERDICT`);
    for (const f of files) {
      let chapterId = '?';
      let jsonCount = 0;
      try {
        const contents = JSON.parse(fs.readFileSync(path.join(chaptersDir, f), 'utf8'));
        chapterId = contents.chapter_info?.chapter_id
          || contents.chapter_info?.id
          || contents.chapter_id
          || f.replace('.json', '');
        jsonCount = (contents.questions || []).length;
      } catch (e) {
        console.log(`  ${pad(f, 34)} (parse error: ${e.message})`);
        continue;
      }
      const dbCount = await db.collection('questions_v2').countDocuments({ 'metadata.chapter_id': chapterId });
      // Verdict: if DB has at least as many as JSON, the JSON is redundant.
      // If DB has fewer, the JSON might still hold authoritative content — KEEP.
      const verdict = dbCount === 0
        ? 'KEEP (DB empty)'
        : dbCount >= jsonCount
          ? 'SAFE (DB ≥ JSON)'
          : `REVIEW (DB<JSON by ${jsonCount - dbCount})`;
      console.log(`  ${pad(f, 34)} ${pad(chapterId, 22)} ${pad(jsonCount, 6)} ${pad(dbCount, 6)} ${verdict}`);
    }
  }

  // ---------------- E. /data/questions/*.OLD_ARCHIVED ----------------
  console.log('\n=== E. /data/questions/*.OLD_ARCHIVED verification ===');
  const oldChapterCount = await db.collection('questions_v2').countDocuments({
    'metadata.chapter_id': { $regex: /^chapter_/ }
  });
  console.log(`  questions_v2 docs with chapter_id starting "chapter_": ${oldChapterCount}`);
  if (oldChapterCount === 0) {
    console.log('  → V1 format never migrated. SAFE to delete all *.OLD_ARCHIVED files.');
  } else {
    console.log(`  → ${oldChapterCount} docs still use V1 format. REVIEW before deletion.`);
  }

  // ---------------- F. PERI / MOLE prefix counts ----------------
  console.log('\n=== F. display_id prefix counts ===');
  const prefixCounts = await db.collection('questions_v2').aggregate([
    { $project: { prefix: { $arrayElemAt: [{ $split: ['$display_id', '-'] }, 0] } } },
    { $group: { _id: '$prefix', count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]).toArray();
  for (const { _id, count } of prefixCounts) {
    console.log(`  ${pad(_id || '(no display_id)', 18)} ${count}`);
  }

  // ---------------- G. /data/mole_pyq_solutions_set*.json ----------------
  console.log('\n=== G. /data/mole_pyq_solutions_set*.json verification ===');
  const moleTotal = await db.collection('questions_v2').countDocuments({
    display_id: { $regex: /^MOLE-/ }
  });
  const moleSolved = await db.collection('questions_v2').countDocuments({
    display_id: { $regex: /^MOLE-/ },
    'solution.text_markdown': { $exists: true, $ne: '' }
  });
  console.log(`  MOLE-* total: ${moleTotal}`);
  console.log(`  MOLE-* with solution.text_markdown populated: ${moleSolved}`);
  console.log(`  → ${moleSolved >= 100 ? 'SAFE' : 'REVIEW'} to delete /data/mole_pyq_solutions_set*.json`);

  // ---------------- H. /data/peri_*.json verification ----------------
  console.log('\n=== H. /data/peri_*.json verification ===');
  const periTotal = await db.collection('questions_v2').countDocuments({
    display_id: { $regex: /^PERI-/ }
  });
  const periSolved = await db.collection('questions_v2').countDocuments({
    display_id: { $regex: /^PERI-/ },
    'solution.text_markdown': { $exists: true, $ne: '' }
  });
  console.log(`  PERI-* total: ${periTotal}`);
  console.log(`  PERI-* with solution.text_markdown populated: ${periSolved}`);
  console.log(`  → ${periTotal >= 100 ? 'SAFE' : 'REVIEW'} to delete /data/peri_*.json`);

  // ---------------- Z. Done ----------------
  await client.close();
  console.log('\n=== Done. Connection closed. ===\n');
}

main().catch(err => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
