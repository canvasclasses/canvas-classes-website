// Applies the compound indexes defined in lib/models/Question.v2.ts to the
// live questions_v2 collection. createIndex is idempotent — safe to re-run.
//
// Run: node scripts/sync_question_indexes.js

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

// Keep this list in sync with lib/models/Question.v2.ts.
// Named indexes keep the new compounds identifiable; pre-existing indexes
// (tag_id, status+created_at, deleted_at, exam_source) use Mongo's default
// naming and are added without custom names so re-runs stay idempotent.
const INDEXES = [
  { key: { display_id: 1 }, options: { unique: true } },
  { key: { 'metadata.chapter_id': 1, status: 1, deleted_at: 1 }, options: { name: 'chapter_status_deleted' } },
  { key: { 'metadata.chapter_id': 1, 'metadata.is_top_pyq': 1, deleted_at: 1 }, options: { name: 'chapter_topPyq_deleted' } },
  { key: { 'metadata.chapter_id': 1, display_id: 1, deleted_at: 1 }, options: { name: 'chapter_display_deleted' } },
  { key: { 'metadata.tags.tag_id': 1 }, options: {} },
  { key: { status: 1, created_at: -1 }, options: {} },
  { key: { deleted_at: 1 }, options: {} },
  { key: { 'metadata.exam_source.year': 1, 'metadata.exam_source.exam': 1 }, options: {} },
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI missing from .env.local');

  const client = new MongoClient(uri);
  await client.connect();
  console.log('Connected to MongoDB');

  const col = client.db().collection('questions_v2');

  console.log('\nExisting indexes:');
  console.table((await col.indexes()).map((i) => ({ name: i.name, key: JSON.stringify(i.key) })));

  for (const { key, options } of INDEXES) {
    const name = await col.createIndex(key, options);
    console.log(`Ensured index: ${name}`);
  }

  console.log('\nFinal indexes:');
  console.table((await col.indexes()).map((i) => ({ name: i.name, key: JSON.stringify(i.key) })));

  await client.close();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
