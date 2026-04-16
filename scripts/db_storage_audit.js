'use strict';
/**
 * Storage audit — reports actual sizes of every collection in the database.
 * Read-only. Run: node scripts/db_storage_audit.js
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

function fmt(bytes) {
  if (bytes == null) return 'N/A';
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 ** 2)   return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3)   return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(3)} GB`;
}

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('crucible');

    // ── DB-level stats ───────────────────────────────────────────────────────
    const dbStats = await db.command({ dbStats: 1, scale: 1 });
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  DATABASE: crucible');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`  Data size (uncompressed):  ${fmt(dbStats.dataSize)}`);
    console.log(`  Storage size (on-disk):    ${fmt(dbStats.storageSize)}`);
    console.log(`  Index size:                ${fmt(dbStats.indexSize)}`);
    console.log(`  Total size (storage+idx):  ${fmt(dbStats.storageSize + dbStats.indexSize)}`);
    console.log(`  Collections:               ${dbStats.collections}`);
    console.log(`  Objects (total docs):      ${dbStats.objects?.toLocaleString()}`);
    console.log();

    // ── Per-collection stats ─────────────────────────────────────────────────
    const collNames = await db.listCollections().toArray();
    const rows = [];

    for (const { name } of collNames) {
      try {
        const s = await db.command({ collStats: name, scale: 1 });
        rows.push({
          name,
          count:       s.count ?? 0,
          dataSize:    s.size ?? 0,
          storageSize: s.storageSize ?? 0,
          indexSize:   s.totalIndexSize ?? 0,
          avgDocSize:  s.avgObjSize ?? 0,
        });
      } catch {
        rows.push({ name, count: 0, dataSize: 0, storageSize: 0, indexSize: 0, avgDocSize: 0 });
      }
    }

    // Sort by storage size desc
    rows.sort((a, b) => b.storageSize - a.storageSize);

    console.log('  Collection breakdown (sorted by on-disk size)');
    console.log('─'.repeat(95));
    console.log(
      '  ' +
      'Collection'.padEnd(28) +
      'Docs'.padStart(8) +
      'Data (raw)'.padStart(14) +
      'On-disk'.padStart(12) +
      'Indexes'.padStart(12) +
      'Avg doc'.padStart(12)
    );
    console.log('─'.repeat(95));

    for (const r of rows) {
      const flag = r.avgDocSize > 50_000 ? ' ⚠ large avg doc' :
                   r.avgDocSize > 10_000 ? ' ▲ watch' : '';
      console.log(
        '  ' +
        r.name.padEnd(28) +
        r.count.toLocaleString().padStart(8) +
        fmt(r.dataSize).padStart(14) +
        fmt(r.storageSize).padStart(12) +
        fmt(r.indexSize).padStart(12) +
        fmt(r.avgDocSize).padStart(12) +
        flag
      );
    }
    console.log('─'.repeat(95));

    const totalStorage = rows.reduce((s, r) => s + r.storageSize, 0);
    const totalIndex   = rows.reduce((s, r) => s + r.indexSize,   0);
    console.log(
      '  ' +
      'TOTAL'.padEnd(28) +
      ''.padStart(8) +
      ''.padStart(14) +
      fmt(totalStorage).padStart(12) +
      fmt(totalIndex).padStart(12)
    );

    // ── Largest individual documents ─────────────────────────────────────────
    console.log('\n  Top 5 largest documents per collection (by bsonsize estimate)');
    console.log('─'.repeat(70));

    const largeCollections = ['book_pages', 'questions_v2', 'auditlogs', 'mock_test_sets', 'userprogress'];
    for (const coll of largeCollections) {
      try {
        // Use $bsonSize in aggregate (MongoDB 4.4+)
        const pipeline = [
          { $project: { _id: 1, title: 1, slug: 1, display_id: 1, action: 1, docSize: { $bsonSize: '$$ROOT' } } },
          { $sort: { docSize: -1 } },
          { $limit: 3 },
        ];
        const docs = await db.collection(coll).aggregate(pipeline).toArray();
        if (docs.length === 0) continue;
        console.log(`\n  ${coll}:`);
        for (const d of docs) {
          const label = d.title ?? d.slug ?? d.display_id ?? d.action ?? String(d._id).slice(0, 20);
          console.log(`    ${fmt(d.docSize).padStart(10)}  ${String(label).slice(0, 50)}`);
        }
      } catch {
        // collection may not exist — skip silently
      }
    }

    // ── audit_logs: check if book_page entries are bloated ──────────────────
    console.log('\n  Audit log breakdown by entity_type');
    console.log('─'.repeat(60));
    try {
      const auditBreakdown = await db.collection('auditlogs').aggregate([
        { $group: { _id: '$entity_type', count: { $sum: 1 }, avgSize: { $avg: { $bsonSize: '$$ROOT' } } } },
        { $sort: { avgSize: -1 } },
      ]).toArray();
      for (const row of auditBreakdown) {
        const flag = row.avgSize > 50_000 ? ' ⚠ bloated' : row.avgSize > 10_000 ? ' ▲ watch' : '';
        console.log(`  ${String(row._id ?? 'unknown').padEnd(20)} ${String(row.count).padStart(6)} docs   avg ${fmt(row.avgSize)}${flag}`);
      }
    } catch { console.log('  (auditlogs collection not found)'); }

    // ── mock_test_sets: question embedding check ─────────────────────────────
    console.log('\n  mock_test_sets: question count per test set');
    console.log('─'.repeat(60));
    try {
      const mockSets = await db.collection('mock_test_sets').aggregate([
        { $project: { title: 1, qCount: { $size: { $ifNull: ['$questions', []] } }, docSize: { $bsonSize: '$$ROOT' } } },
        { $sort: { docSize: -1 } },
      ]).toArray();
      if (mockSets.length === 0) {
        console.log('  (no mock test sets found)');
      } else {
        for (const m of mockSets) {
          console.log(`  ${String(m.title ?? m._id).padEnd(45).slice(0,45)}  ${String(m.qCount).padStart(4)} questions  ${fmt(m.docSize)}`);
        }
      }
    } catch { console.log('  (mock_test_sets collection not found)'); }

    // ── user_progress: largest docs ──────────────────────────────────────────
    console.log('\n  userprogress: largest user documents');
    console.log('─'.repeat(60));
    try {
      const upDocs = await db.collection('userprogress').aggregate([
        { $project: {
          user_email: 1,
          attemptedCount: { $size: { $ifNull: ['$all_attempted_ids', []] } },
          recentCount:    { $size: { $ifNull: ['$recent_attempts',   []] } },
          docSize: { $bsonSize: '$$ROOT' },
        }},
        { $sort: { docSize: -1 } },
        { $limit: 5 },
      ]).toArray();
      if (upDocs.length === 0) {
        console.log('  (no user progress records found)');
      } else {
        for (const u of upDocs) {
          const email = String(u.user_email ?? u._id).slice(0, 35);
          console.log(`  ${email.padEnd(35)}  ${String(u.attemptedCount).padStart(5)} attempted  ${String(u.recentCount).padStart(4)} recent  ${fmt(u.docSize)}`);
        }
      }
    } catch { console.log('  (userprogress collection not found)'); }

    console.log('\n✅ Audit complete.');
  } finally {
    await client.close();
  }
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
