/**
 * scripts/audit_status_workflow.js
 *
 * READ-ONLY status workflow audit. Answers:
 *   - When were 'review'-status questions created?
 *   - Who created them (admin UI vs script vs bulk)?
 *   - Are there 'review' questions being shown to students by mistake?
 *   - What deprecated fields are populated and how often?
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
    const col = db.collection('questions_v2');

    const chemFilter = {
        deleted_at: null,
        'metadata.chapter_id': { $regex: /^ch1[12]_/ },
    };

    // ─── Section A: Status × creation year ──────────────────────────────
    console.log('\n========== A. Status × Year of creation (chemistry only) ==========');
    const statusByYear = await col.aggregate([
        { $match: chemFilter },
        {
            $group: {
                _id: {
                    status: '$status',
                    year: { $year: '$created_at' },
                },
                count: { $sum: 1 },
            },
        },
        { $sort: { '_id.year': -1, '_id.status': 1 } },
    ]).toArray();

    const years = new Set();
    const statuses = new Set();
    const grid = {};
    for (const r of statusByYear) {
        const y = r._id.year || 'unknown';
        const s = r._id.status || '(null)';
        years.add(y);
        statuses.add(s);
        if (!grid[y]) grid[y] = {};
        grid[y][s] = r.count;
    }
    const sortedYears = Array.from(years).sort((a, b) => (b > a ? 1 : -1));
    const sortedStatuses = Array.from(statuses).sort();
    process.stdout.write('Year       ');
    for (const s of sortedStatuses) process.stdout.write(s.padEnd(12));
    process.stdout.write('Total\n');
    console.log('-'.repeat(11 + sortedStatuses.length * 12 + 6));
    for (const y of sortedYears) {
        process.stdout.write(String(y).padEnd(11));
        let total = 0;
        for (const s of sortedStatuses) {
            const c = grid[y][s] || 0;
            total += c;
            process.stdout.write(String(c).padStart(8) + '    ');
        }
        process.stdout.write(String(total).padStart(8) + '\n');
    }

    // ─── Section B: Status × creator (top 15 creators) ──────────────────────────────
    console.log('\n========== B. Top 15 creators by status (chemistry) ==========');
    const byCreator = await col.aggregate([
        { $match: chemFilter },
        {
            $group: {
                _id: { creator: '$created_by', status: '$status' },
                count: { $sum: 1 },
            },
        },
    ]).toArray();
    const creatorTotals = {};
    for (const r of byCreator) {
        const c = r._id.creator || '(null)';
        if (!creatorTotals[c]) creatorTotals[c] = { total: 0, by: {} };
        creatorTotals[c].total += r.count;
        creatorTotals[c].by[r._id.status] = r.count;
    }
    const topCreators = Object.entries(creatorTotals).sort((a, b) => b[1].total - a[1].total).slice(0, 15);
    console.log('Creator'.padEnd(36) + 'draft'.padStart(8) + 'review'.padStart(8) + 'published'.padStart(11) + 'archived'.padStart(10) + 'TOTAL'.padStart(8));
    console.log('-'.repeat(81));
    for (const [creator, info] of topCreators) {
        console.log(
            (creator.length > 35 ? creator.slice(0, 33) + '..' : creator).padEnd(36)
            + String(info.by.draft || 0).padStart(8)
            + String(info.by.review || 0).padStart(8)
            + String(info.by.published || 0).padStart(11)
            + String(info.by.archived || 0).padStart(10)
            + String(info.total).padStart(8)
        );
    }

    // ─── Section C: Recent 200 questions ──────────────────────────────
    console.log('\n========== C. Most recent 30 chemistry questions: status, creator, type ==========');
    const recent = await col.find(chemFilter, {
        projection: {
            display_id: 1, status: 1, type: 1, created_by: 1, created_at: 1,
            'metadata.is_pyq': 1, 'metadata.sourceType': 1,
        }
    }).sort({ created_at: -1 }).limit(30).toArray();
    console.log('display_id'.padEnd(14) + 'status'.padEnd(11) + 'type'.padEnd(6) + 'created_at'.padEnd(13) + 'is_pyq'.padEnd(8) + 'sourceType'.padEnd(12) + 'created_by');
    console.log('-'.repeat(110));
    for (const q of recent) {
        console.log(
            (q.display_id || '').padEnd(14)
            + (q.status || '').padEnd(11)
            + (q.type || '').padEnd(6)
            + (q.created_at?.toISOString().slice(0, 10) || '').padEnd(13)
            + String(q.metadata?.is_pyq).padEnd(8)
            + String(q.metadata?.sourceType || '').padEnd(12)
            + (q.created_by || '').slice(0, 30)
        );
    }

    // ─── Section D: Deprecated field population (chemistry, all statuses) ──────────────────────────────
    console.log('\n========== D. Deprecated/legacy field usage ==========');
    const total = await col.countDocuments(chemFilter);
    const fields = [
        { label: 'is_pyq set (any value)',           filter: { 'metadata.is_pyq':       { $exists: true } } },
        { label: 'is_pyq=true',                       filter: { 'metadata.is_pyq':       true                } },
        { label: 'is_top_pyq set (any value)',        filter: { 'metadata.is_top_pyq':   { $exists: true } } },
        { label: 'is_top_pyq=true',                   filter: { 'metadata.is_top_pyq':   true                } },
        { label: 'examBoard set (legacy)',            filter: { 'metadata.examBoard':    { $exists: true } } },
        { label: 'exam_source set (legacy)',          filter: { 'metadata.exam_source':  { $exists: true } } },
        { label: 'exam_source.exam set',              filter: { 'metadata.exam_source.exam': { $exists: true, $ne: null, $ne: '' } } },
        { label: 'difficulty set (legacy enum)',      filter: { 'metadata.difficulty':   { $exists: true } } },
        { label: 'sourceType set (modern)',           filter: { 'metadata.sourceType':   { $exists: true } } },
        { label: 'sourceType=PYQ (modern, true PYQ)', filter: { 'metadata.sourceType':   'PYQ'               } },
        { label: 'sourceType=Practice',               filter: { 'metadata.sourceType':   'Practice'          } },
        { label: 'examDetails.exam set (modern)',     filter: { 'metadata.examDetails.exam': { $exists: true, $ne: null } } },
        { label: 'applicableExams set (modern)',      filter: { 'metadata.applicableExams':  { $exists: true, $ne: [] } } },
        { label: 'difficultyLevel set (modern)',      filter: { 'metadata.difficultyLevel':  { $exists: true } } },
    ];
    console.log('Field'.padEnd(45) + 'Count'.padStart(8) + '   % of total');
    console.log('-'.repeat(70));
    for (const f of fields) {
        const c = await col.countDocuments({ ...chemFilter, ...f.filter });
        const pct = ((c / total) * 100).toFixed(1);
        console.log(f.label.padEnd(45) + String(c).padStart(8) + '   ' + pct + '%');
    }

    // ─── Section E: Conflict detection — fields that disagree ──────────────────────────────
    console.log('\n========== E. Field-disagreement / inconsistency patterns ==========');
    const checks = [
        {
            label: 'sourceType=PYQ but is_pyq != true',
            filter: { 'metadata.sourceType': 'PYQ', 'metadata.is_pyq': { $ne: true } },
        },
        {
            label: 'is_pyq=true but sourceType != PYQ',
            filter: { 'metadata.is_pyq': true, 'metadata.sourceType': { $ne: 'PYQ' } },
        },
        {
            label: 'sourceType=Practice but is_pyq=true',
            filter: { 'metadata.sourceType': 'Practice', 'metadata.is_pyq': true },
        },
        {
            label: 'sourceType=PYQ but no examDetails.exam',
            filter: { 'metadata.sourceType': 'PYQ', 'metadata.examDetails.exam': { $exists: false } },
        },
        {
            label: 'sourceType=PYQ but no year (anywhere)',
            filter: {
                'metadata.sourceType': 'PYQ',
                'metadata.examDetails.year': { $exists: false },
                'metadata.exam_source.year': { $exists: false },
            },
        },
        {
            label: 'examBoard != applicableExams[0] (sync drift)',
            filter: {
                'metadata.examBoard': { $exists: true, $ne: null },
                $expr: { $ne: ['$metadata.examBoard', { $arrayElemAt: ['$metadata.applicableExams', 0] }] },
            },
        },
        {
            label: 'difficulty (legacy) inconsistent with difficultyLevel',
            filter: {
                'metadata.difficulty': { $exists: true, $ne: null },
                $expr: {
                    $and: [
                        { $eq: ['$metadata.difficulty', 'Easy'] },
                        { $gt: ['$metadata.difficultyLevel', 2] },
                    ],
                },
            },
        },
    ];
    console.log('Inconsistency'.padEnd(55) + 'Count');
    console.log('-'.repeat(65));
    for (const c of checks) {
        try {
            const n = await col.countDocuments({ ...chemFilter, ...c.filter });
            console.log(c.label.padEnd(55) + String(n).padStart(8));
        } catch (e) {
            console.log(c.label.padEnd(55) + ' ERROR: ' + e.message);
        }
    }

    await mongoose.disconnect();
    console.log('\n✓ Workflow audit complete.');
}

main().catch((err) => {
    console.error('FATAL:', err);
    process.exit(1);
});
