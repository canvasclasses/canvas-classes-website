/**
 * scripts/audit_shift_data.js  — READ-ONLY
 *
 * Audits how shift data is populated across chemistry questions, in both
 * legacy (exam_source.shift) and modern (examDetails.shift) fields.
 * Goal: tell whether shift is missing (data) or just not rendered (UI).
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function main() {
    await mongoose.connect(process.env.MONGODB_URI);
    const col = mongoose.connection.db.collection('questions_v2');
    const CHEM = { 'metadata.chapter_id': { $regex: /^ch1[12]_/ } };
    const PYQ_SET = { ...CHEM, deleted_at: null, 'metadata.examDetails.exam': { $exists: true, $ne: null } };

    // 1. Total PYQ questions (have examDetails.exam set)
    const totalPyq = await col.countDocuments(PYQ_SET);
    console.log(`Total chemistry PYQs (examDetails.exam set): ${totalPyq}\n`);

    // 2. Modern field — examDetails.shift presence
    console.log('=== examDetails.shift coverage ===');
    const examDetailsShiftAny = await col.countDocuments({ ...PYQ_SET, 'metadata.examDetails.shift': { $exists: true, $ne: null, $ne: '' } });
    const examDetailsShiftMissing = totalPyq - examDetailsShiftAny;
    console.log(`  Has shift value:  ${examDetailsShiftAny.toString().padStart(5)}  (${(examDetailsShiftAny / totalPyq * 100).toFixed(1)}%)`);
    console.log(`  Missing/null/'': ${examDetailsShiftMissing.toString().padStart(5)}  (${(examDetailsShiftMissing / totalPyq * 100).toFixed(1)}%)`);

    const examDetailsShiftValues = await col.aggregate([
        { $match: { ...PYQ_SET, 'metadata.examDetails.shift': { $exists: true, $ne: null, $ne: '' } } },
        { $group: { _id: '$metadata.examDetails.shift', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
    ]).toArray();
    console.log('  Distinct values:');
    for (const v of examDetailsShiftValues) console.log(`    "${v._id}": ${v.count}`);

    // 3. Legacy field — exam_source.shift presence
    console.log('\n=== exam_source.shift coverage ===');
    const examSourceShiftAny = await col.countDocuments({ ...PYQ_SET, 'metadata.exam_source.shift': { $exists: true, $ne: null, $ne: '' } });
    const examSourceShiftMissing = totalPyq - examSourceShiftAny;
    console.log(`  Has shift value:  ${examSourceShiftAny.toString().padStart(5)}  (${(examSourceShiftAny / totalPyq * 100).toFixed(1)}%)`);
    console.log(`  Missing/null/'': ${examSourceShiftMissing.toString().padStart(5)}  (${(examSourceShiftMissing / totalPyq * 100).toFixed(1)}%)`);

    const examSourceShiftValues = await col.aggregate([
        { $match: { ...PYQ_SET, 'metadata.exam_source.shift': { $exists: true, $ne: null, $ne: '' } } },
        { $group: { _id: '$metadata.exam_source.shift', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
    ]).toArray();
    console.log('  Distinct values:');
    for (const v of examSourceShiftValues) console.log(`    "${v._id}": ${v.count}`);

    // 4. Cross-tab: where is shift present?
    console.log('\n=== Shift coverage cross-tab (examDetails.shift × exam_source.shift) ===');
    const both = await col.countDocuments({
        ...PYQ_SET,
        'metadata.examDetails.shift': { $exists: true, $ne: null, $ne: '' },
        'metadata.exam_source.shift': { $exists: true, $ne: null, $ne: '' },
    });
    const onlyModern = await col.countDocuments({
        ...PYQ_SET,
        'metadata.examDetails.shift': { $exists: true, $ne: null, $ne: '' },
        $or: [
            { 'metadata.exam_source.shift': { $exists: false } },
            { 'metadata.exam_source.shift': null },
            { 'metadata.exam_source.shift': '' },
        ],
    });
    const onlyLegacy = await col.countDocuments({
        ...PYQ_SET,
        'metadata.exam_source.shift': { $exists: true, $ne: null, $ne: '' },
        $or: [
            { 'metadata.examDetails.shift': { $exists: false } },
            { 'metadata.examDetails.shift': null },
            { 'metadata.examDetails.shift': '' },
        ],
    });
    const neither = totalPyq - both - onlyModern - onlyLegacy;
    console.log(`  Both fields set:    ${String(both).padStart(5)}`);
    console.log(`  Only modern set:    ${String(onlyModern).padStart(5)}`);
    console.log(`  Only legacy set:    ${String(onlyLegacy).padStart(5)}`);
    console.log(`  Neither (missing):  ${String(neither).padStart(5)}`);

    // 5. Shift coverage by chapter (only chapters with PYQs)
    console.log('\n=== Per-chapter PYQ shift coverage ===');
    const perChapter = await col.aggregate([
        { $match: PYQ_SET },
        {
            $group: {
                _id: '$metadata.chapter_id',
                total: { $sum: 1 },
                hasModernShift: {
                    $sum: {
                        $cond: [
                            { $and: [{ $ne: ['$metadata.examDetails.shift', null] }, { $ne: ['$metadata.examDetails.shift', ''] }] },
                            1,
                            0,
                        ],
                    },
                },
                hasLegacyShift: {
                    $sum: {
                        $cond: [
                            { $and: [{ $ne: ['$metadata.exam_source.shift', null] }, { $ne: ['$metadata.exam_source.shift', ''] }] },
                            1,
                            0,
                        ],
                    },
                },
                hasMonth: {
                    $sum: {
                        $cond: [
                            { $and: [{ $ne: ['$metadata.examDetails.month', null] }, { $ne: ['$metadata.examDetails.month', ''] }] },
                            1,
                            0,
                        ],
                    },
                },
            },
        },
        { $sort: { _id: 1 } },
    ]).toArray();

    console.log('Chapter'.padEnd(20) + 'Total'.padStart(8) + 'Mod.shift'.padStart(12) + 'Lgcy.shift'.padStart(12) + 'Month'.padStart(8));
    console.log('-'.repeat(60));
    for (const r of perChapter) {
        console.log(
            String(r._id || '(none)').padEnd(20)
            + String(r.total).padStart(8)
            + String(r.hasModernShift).padStart(12)
            + String(r.hasLegacyShift).padStart(12)
            + String(r.hasMonth).padStart(8)
        );
    }

    // 6. Sample 10 GOC questions to see actual data shape
    console.log('\n=== Sample 10 GOC PYQs: full examDetails + exam_source ===');
    const sampleGoc = await col.find(
        { 'metadata.chapter_id': 'ch11_goc', deleted_at: null, 'metadata.examDetails.exam': { $exists: true, $ne: null } },
        { projection: { display_id: 1, 'metadata.examDetails': 1, 'metadata.exam_source': 1 } }
    ).limit(10).toArray();
    for (const d of sampleGoc) {
        console.log(`  ${d.display_id}:`);
        console.log(`    examDetails: ${JSON.stringify(d.metadata?.examDetails)}`);
        console.log(`    exam_source: ${JSON.stringify(d.metadata?.exam_source)}`);
    }

    // 7. Is examDetails.month populated? Sample
    console.log('\n=== Top examDetails.month values across chemistry PYQs ===');
    const monthValues = await col.aggregate([
        { $match: { ...PYQ_SET, 'metadata.examDetails.month': { $exists: true, $ne: null, $ne: '' } } },
        { $group: { _id: '$metadata.examDetails.month', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 15 },
    ]).toArray();
    for (const v of monthValues) console.log(`  "${v._id}": ${v.count}`);

    await mongoose.disconnect();
}

main().catch((err) => { console.error('FATAL:', err); process.exit(1); });
