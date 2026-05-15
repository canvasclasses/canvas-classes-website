/**
 * scripts/_audit_v1_v2_redundancy.js
 *
 * READ-ONLY audit. Answers:
 *  1. Does the legacy V1 `questions` collection still exist? How big?
 *  2. Which other collections exist and which look V1-era / unused?
 *  3. Within `questions_v2`, how many docs still carry LEGACY ALIAS fields
 *     that the canonical schema has retired? (per §4.5 of CLAUDE.md)
 *  4. Are there soft-deleted docs (`deleted_at != null`) still sitting around?
 *  5. Status enum distribution — any 'draft'/'review' leftovers?
 *  6. Duplicate display_id values?
 *  7. Index health — legacy indexes on deprecated fields?
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function main() {
    if (!process.env.MONGODB_URI) {
        console.error('FATAL: MONGODB_URI not set');
        process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    console.log('\n================================================================');
    console.log(' V1 → V2 REDUNDANCY AUDIT');
    console.log(' Database:', db.databaseName);
    console.log('================================================================');

    // ─── 1. All collections in DB with size info ───────────────────────────
    console.log('\n── 1. ALL COLLECTIONS IN DATABASE ─────────────────────────────');
    const collections = await db.listCollections().toArray();
    const collInfo = [];
    for (const c of collections) {
        try {
            const stats = await db.command({ collStats: c.name });
            collInfo.push({
                name: c.name,
                count: stats.count || 0,
                sizeMB: ((stats.size || 0) / 1024 / 1024).toFixed(2),
                storageMB: ((stats.storageSize || 0) / 1024 / 1024).toFixed(2),
                indexes: stats.nindexes || 0,
            });
        } catch (e) {
            collInfo.push({ name: c.name, count: 'err', sizeMB: 'err', storageMB: 'err', indexes: 'err' });
        }
    }
    collInfo.sort((a, b) => parseFloat(b.sizeMB) - parseFloat(a.sizeMB));
    console.log('name'.padEnd(35), 'count'.padStart(10), 'dataMB'.padStart(10), 'storageMB'.padStart(11), 'idx'.padStart(5));
    console.log('-'.repeat(75));
    for (const c of collInfo) {
        console.log(
            String(c.name).padEnd(35),
            String(c.count).padStart(10),
            String(c.sizeMB).padStart(10),
            String(c.storageMB).padStart(11),
            String(c.indexes).padStart(5),
        );
    }

    // ─── 2. V1 `questions` collection check ────────────────────────────────
    console.log('\n── 2. LEGACY V1 `questions` COLLECTION ───────────────────────');
    const hasV1 = collections.find((c) => c.name === 'questions');
    if (!hasV1) {
        console.log('  ✓ No `questions` collection — V1 fully removed.');
    } else {
        const v1 = db.collection('questions');
        const v1Count = await v1.countDocuments();
        const v1Sample = await v1.findOne({}, { projection: { _id: 1, display_id: 1, question_id: 1, chapter_id: 1, status: 1, created_at: 1 } });
        const v1Newest = await v1.find({}).sort({ created_at: -1 }).limit(1).project({ created_at: 1, _id: 1 }).toArray();
        const v1Oldest = await v1.find({}).sort({ created_at: 1 }).limit(1).project({ created_at: 1, _id: 1 }).toArray();
        console.log('  ⚠ `questions` collection EXISTS with', v1Count, 'documents.');
        console.log('     newest doc created_at:', v1Newest[0]?.created_at || 'n/a');
        console.log('     oldest doc created_at:', v1Oldest[0]?.created_at || 'n/a');
        console.log('     sample doc:', JSON.stringify(v1Sample));
    }

    // ─── 3. questions_v2 — legacy alias fields ─────────────────────────────
    console.log('\n── 3. LEGACY ALIAS FIELDS in `questions_v2` ──────────────────');
    const v2 = db.collection('questions_v2');
    const v2Total = await v2.countDocuments();
    console.log('  Total docs in questions_v2:', v2Total);
    console.log();

    const legacyChecks = [
        { label: 'metadata.difficulty (legacy enum, removed)', q: { 'metadata.difficulty': { $exists: true } } },
        { label: 'metadata.is_pyq (replaced by sourceType==PYQ)', q: { 'metadata.is_pyq': { $exists: true } } },
        { label: 'metadata.examBoard (replaced by applicableExams[0])', q: { 'metadata.examBoard': { $exists: true } } },
        { label: 'metadata.exam_source (replaced by examDetails)', q: { 'metadata.exam_source': { $exists: true } } },
        { label: 'solution_markdown (legacy, canonical is `solution.*`)', q: { solution_markdown: { $exists: true } } },
        { label: 'question_markdown (legacy, canonical is `question_text.markdown`)', q: { question_markdown: { $exists: true } } },
        { label: 'question_id (V1-style numeric id)', q: { question_id: { $exists: true } } },
        { label: 'chapter_id at root (V1; canonical is metadata.chapter_id)', q: { chapter_id: { $exists: true } } },
        { label: '__v (Mongoose internal — usually fine)', q: { __v: { $exists: true } } },
    ];

    console.log('  field'.padEnd(58), 'count'.padStart(8), 'pct');
    console.log('  ' + '-'.repeat(70));
    for (const c of legacyChecks) {
        const n = await v2.countDocuments(c.q);
        const pct = v2Total > 0 ? ((n / v2Total) * 100).toFixed(1) : '0.0';
        const flag = n > 0 ? '⚠' : ' ';
        console.log(' ', flag, c.label.padEnd(55), String(n).padStart(8), pct + '%');
    }

    // ─── 4. Soft-deleted docs ──────────────────────────────────────────────
    console.log('\n── 4. SOFT-DELETED docs (deleted_at != null) ─────────────────');
    const softDeleted = await v2.countDocuments({ deleted_at: { $ne: null } });
    const softDeletedExists = await v2.countDocuments({ deleted_at: { $exists: true, $ne: null } });
    console.log('  deleted_at != null:', softDeleted);
    console.log('  deleted_at exists & non-null:', softDeletedExists);
    if (softDeleted > 0) {
        const byChap = await v2.aggregate([
            { $match: { deleted_at: { $ne: null } } },
            { $group: { _id: '$metadata.chapter_id', n: { $sum: 1 } } },
            { $sort: { n: -1 } },
            { $limit: 10 },
        ]).toArray();
        console.log('  by chapter (top 10):');
        for (const r of byChap) console.log('    ', String(r._id).padEnd(28), r.n);
    }

    // ─── 5. Status distribution ────────────────────────────────────────────
    console.log('\n── 5. STATUS DISTRIBUTION in `questions_v2` ──────────────────');
    const byStatus = await v2.aggregate([
        { $match: { deleted_at: null } },
        { $group: { _id: '$status', n: { $sum: 1 } } },
        { $sort: { n: -1 } },
    ]).toArray();
    for (const r of byStatus) {
        const flag = (r._id === 'draft' || r._id === 'review') ? '⚠' : ' ';
        console.log(' ', flag, String(r._id || '(null)').padEnd(20), r.n);
    }

    // ─── 6. Duplicate display_ids ──────────────────────────────────────────
    console.log('\n── 6. DUPLICATE display_id values ─────────────────────────────');
    const dupes = await v2.aggregate([
        { $match: { deleted_at: null, display_id: { $exists: true, $ne: null } } },
        { $group: { _id: '$display_id', n: { $sum: 1 }, ids: { $push: '$_id' } } },
        { $match: { n: { $gt: 1 } } },
        { $sort: { n: -1 } },
        { $limit: 25 },
    ]).toArray();
    if (dupes.length === 0) {
        console.log('  ✓ No duplicate display_id values.');
    } else {
        console.log('  ⚠ Found', dupes.length, 'duplicate display_ids (showing up to 25):');
        for (const d of dupes) console.log('    ', String(d._id).padEnd(20), 'x', d.n);
    }

    // ─── 7. Docs missing required canonical fields ─────────────────────────
    console.log('\n── 7. DOCS MISSING REQUIRED CANONICAL FIELDS ─────────────────');
    const missingChecks = [
        { label: 'missing display_id', q: { deleted_at: null, $or: [{ display_id: { $exists: false } }, { display_id: null }, { display_id: '' }] } },
        { label: 'missing metadata.chapter_id', q: { deleted_at: null, $or: [{ 'metadata.chapter_id': { $exists: false } }, { 'metadata.chapter_id': null }] } },
        { label: 'missing question_text.markdown', q: { deleted_at: null, $or: [{ 'question_text.markdown': { $exists: false } }, { 'question_text.markdown': null }, { 'question_text.markdown': '' }] } },
        { label: 'missing status field', q: { deleted_at: null, $or: [{ status: { $exists: false } }, { status: null }] } },
    ];
    for (const c of missingChecks) {
        const n = await v2.countDocuments(c.q);
        const flag = n > 0 ? '⚠' : ' ';
        console.log(' ', flag, c.label.padEnd(50), n);
    }

    // ─── 8. Indexes on questions_v2 (look for legacy-field indexes) ────────
    console.log('\n── 8. INDEXES on `questions_v2` ──────────────────────────────');
    const idx = await v2.indexes();
    for (const i of idx) {
        const keys = Object.keys(i.key).join(', ');
        const looksLegacy = /\b(is_pyq|examBoard|exam_source|difficulty(?!Level)|question_markdown|solution_markdown|chapter_id$)\b/.test(keys);
        const flag = looksLegacy ? '⚠' : ' ';
        console.log(' ', flag, i.name.padEnd(45), `{ ${keys} }`);
    }

    // ─── 9. userprogress collection sanity ─────────────────────────────────
    console.log('\n── 9. userprogress orphans (refs to non-existent questions) ──');
    const upColl = collections.find((c) => c.name === 'userprogress');
    if (!upColl) {
        console.log('  (no userprogress collection)');
    } else {
        const up = db.collection('userprogress');
        const upCount = await up.countDocuments();
        console.log('  userprogress docs:', upCount);
        // Don't iterate all — sample-based orphan check
        const sample = await up.aggregate([{ $sample: { size: 200 } }]).toArray();
        let checkedRefs = 0;
        let orphanRefs = 0;
        const v2IdSet = new Set();
        const refIds = new Set();
        for (const d of sample) {
            const refs = [];
            if (Array.isArray(d.attempts)) for (const a of d.attempts) if (a.question_id) refs.push(a.question_id);
            if (Array.isArray(d.history)) for (const h of d.history) if (h.question_id) refs.push(h.question_id);
            if (d.question_id) refs.push(d.question_id);
            for (const r of refs) { refIds.add(r); checkedRefs++; }
        }
        if (refIds.size > 0) {
            const found = await v2.find({ _id: { $in: [...refIds] } }, { projection: { _id: 1 } }).toArray();
            for (const f of found) v2IdSet.add(f._id);
            for (const r of refIds) if (!v2IdSet.has(r)) orphanRefs++;
            console.log(`  sampled 200 userprogress docs → ${checkedRefs} question refs, ${refIds.size} unique`);
            console.log(`  orphan refs (point to deleted/missing v2 docs): ${orphanRefs}`);
        }
    }

    console.log('\n================================================================');
    console.log(' END OF AUDIT');
    console.log('================================================================\n');

    await mongoose.disconnect();
}

main().catch((e) => {
    console.error('AUDIT FAILED:', e);
    process.exit(1);
});
