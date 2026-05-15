/**
 * scripts/_audit_v1_v2_redundancy_pt2.js — Follow-up READ-ONLY checks.
 *  - audit_logs vs auditlogs (which is V1?)
 *  - taxonomy vs taxonomies
 *  - user_progress vs userprogress vs student_chapter_profiles vs user_mastery
 *  - 311 null-status docs in questions_v2: who are they?
 *  - 919 V1 `questions` docs: what chapters/IDs?
 */
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function main() {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    console.log('\n=== DUPLICATE COLLECTION PAIRS ===\n');

    const pairs = [
        ['audit_logs', 'auditlogs'],
        ['taxonomy', 'taxonomies'],
        ['user_progress', 'userprogress'],
    ];
    for (const [a, b] of pairs) {
        const ca = await db.collection(a).countDocuments().catch(() => 'n/a');
        const cb = await db.collection(b).countDocuments().catch(() => 'n/a');
        const sa = await db.collection(a).findOne({}).catch(() => null);
        const sb = await db.collection(b).findOne({}).catch(() => null);
        console.log(`  ${a.padEnd(20)} : ${ca} docs`);
        if (sa) console.log(`     sample keys:`, Object.keys(sa).slice(0, 8).join(', '));
        console.log(`  ${b.padEnd(20)} : ${cb} docs`);
        if (sb) console.log(`     sample keys:`, Object.keys(sb).slice(0, 8).join(', '));
        console.log();
    }

    // recency of each audit_logs-style collection
    console.log('=== audit_logs / auditlogs RECENCY ===');
    for (const name of ['audit_logs', 'auditlogs']) {
        const c = db.collection(name);
        const newest = await c.find({}).sort({ created_at: -1, createdAt: -1, timestamp: -1 }).limit(1).toArray();
        const oldest = await c.find({}).sort({ created_at: 1, createdAt: 1, timestamp: 1 }).limit(1).toArray();
        const n = newest[0];
        const o = oldest[0];
        const pickDate = (d) => d?.created_at || d?.createdAt || d?.timestamp || d?.ts || null;
        console.log(`  ${name}: oldest=${pickDate(o)}  newest=${pickDate(n)}`);
        if (n) console.log(`     newest doc fields:`, Object.keys(n).slice(0, 12).join(', '));
    }

    // V1 questions content
    console.log('\n=== V1 `questions` collection breakdown ===');
    const v1 = db.collection('questions');
    const byChapter = await v1.aggregate([
        { $group: { _id: '$chapter_id', n: { $sum: 1 } } },
        { $sort: { n: -1 } },
    ]).toArray();
    console.log('  by chapter_id:');
    for (const r of byChapter) console.log('   ', String(r._id).padEnd(45), r.n);

    const v1Keys = new Set();
    const v1Sample = await v1.find({}).limit(20).toArray();
    for (const d of v1Sample) for (const k of Object.keys(d)) v1Keys.add(k);
    console.log('  field names seen across 20-doc sample:', [...v1Keys].sort().join(', '));

    // null-status docs in questions_v2
    console.log('\n=== questions_v2 docs with status==null ===');
    const v2 = db.collection('questions_v2');
    const nullStatus = await v2.find({ deleted_at: null, $or: [{ status: { $exists: false } }, { status: null }] }).limit(10).project({ _id: 1, display_id: 1, 'metadata.chapter_id': 1, created_at: 1, updated_at: 1, status: 1 }).toArray();
    console.log('  sample 10 of the 311:');
    for (const d of nullStatus) {
        console.log(`    ${String(d.display_id || '(no display_id)').padEnd(18)} chapter=${(d.metadata?.chapter_id || '?').padEnd(20)} status=${d.status} created=${d.created_at}`);
    }
    const nullStatusByChap = await v2.aggregate([
        { $match: { deleted_at: null, $or: [{ status: { $exists: false } }, { status: null }] } },
        { $group: { _id: '$metadata.chapter_id', n: { $sum: 1 } } },
        { $sort: { n: -1 } },
    ]).toArray();
    console.log('  by chapter:');
    for (const r of nullStatusByChap) console.log('   ', String(r._id).padEnd(28), r.n);

    // 79 draft + 1378 review — when were they created?
    console.log('\n=== questions_v2 draft/review docs — created_at distribution ===');
    const stuck = await v2.aggregate([
        { $match: { deleted_at: null, status: { $in: ['draft', 'review'] } } },
        { $group: {
            _id: { status: '$status', year: { $year: '$created_at' } },
            n: { $sum: 1 },
        }},
        { $sort: { '_id.year': -1, '_id.status': 1 } },
    ]).toArray();
    for (const r of stuck) console.log(`  status=${(r._id.status || '?').padEnd(8)} year=${r._id.year || 'unknown'}  n=${r.n}`);

    // collections that are 0-count (truly empty / abandoned)
    console.log('\n=== EMPTY / NEAR-EMPTY COLLECTIONS (likely candidates to drop) ===');
    const names = (await db.listCollections().toArray()).map((c) => c.name);
    const empties = [];
    for (const n of names) {
        const c = await db.collection(n).countDocuments();
        if (c < 5) empties.push({ name: n, count: c });
    }
    for (const e of empties) console.log(`  ${e.name.padEnd(35)} ${e.count}`);

    await mongoose.disconnect();
}

main().catch((e) => { console.error('FAIL:', e); process.exit(1); });
