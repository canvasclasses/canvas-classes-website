/**
 * Backfill empty `metadata.applicableExams` on published questions.
 *
 * WHY (QUESTION_LIBRARY_SPEC §5 Phase C data hygiene, 2026-07-18): the future
 * public Library URL is /questions/{exam}/... where {exam} =
 * applicableExams[0] lowercased. The 2026-07-18 audit found 79 published
 * questions with empty/missing applicableExams — their URL segment would be
 * ambiguous. This script fills them from the MAJORITY applicableExams of the
 * OTHER published questions in the same chapter (self-deriving — no
 * hardcoded chapter→exam map to drift).
 *
 * SAFETY (CLAUDE.md §0 rule 3):
 * - DRY-RUN BY DEFAULT: prints every would-be change and exits. Nothing is
 *   written without the explicit `--apply` flag.
 * - Affected docs: reported exactly by the dry run before any write
 *   (expected ~79 as of 2026-07-18; re-count at run time).
 * - ROLLBACK: on --apply, writes scripts/logs/backfill_applicable_exams_<ts>.json
 *   with {_id, display_id, before, after} for every modified doc. To roll
 *   back, restore `metadata.applicableExams` to `before` for each listed _id.
 * - Only touches `metadata.applicableExams`; never any other field.
 *
 * Run:  node scripts/backfill_applicable_exams.js           (dry run)
 *       node scripts/backfill_applicable_exams.js --apply   (writes)
 */

const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
const mongoose = require('mongoose');

const APPLY = process.argv.includes('--apply');

async function main() {
    await mongoose.connect(process.env.MONGODB_URI);
    const col = mongoose.connection.db.collection('questions_v2');

    const PUBLISHED = { deleted_at: null, status: 'published' };

    // Targets: published questions whose applicableExams is missing or empty.
    const targets = await col
        .find({
            ...PUBLISHED,
            $or: [
                { 'metadata.applicableExams': { $exists: false } },
                { 'metadata.applicableExams': { $size: 0 } },
                { 'metadata.applicableExams': null },
            ],
        })
        .project({ display_id: 1, 'metadata.chapter_id': 1, 'metadata.applicableExams': 1 })
        .toArray();

    console.log(`Published questions with empty applicableExams: ${targets.length}`);
    if (targets.length === 0) { await mongoose.disconnect(); return; }

    // Majority applicableExams per affected chapter, derived from the OTHER
    // published questions in that chapter.
    const chapters = [...new Set(targets.map((t) => t.metadata?.chapter_id).filter(Boolean))];
    const majority = {};
    for (const ch of chapters) {
        const counts = await col
            .aggregate([
                { $match: { ...PUBLISHED, 'metadata.chapter_id': ch, 'metadata.applicableExams.0': { $exists: true } } },
                { $group: { _id: '$metadata.applicableExams', n: { $sum: 1 } } },
                { $sort: { n: -1 } },
                { $limit: 1 },
            ])
            .toArray();
        if (counts.length) majority[ch] = counts[0]._id;
    }

    const changes = [];
    const skipped = [];
    for (const t of targets) {
        const ch = t.metadata?.chapter_id;
        const fill = ch && majority[ch];
        if (!fill || !fill.length) {
            skipped.push(t); // no peer signal in this chapter — needs a human call
            continue;
        }
        changes.push({ _id: t._id, display_id: t.display_id, chapter_id: ch, before: t.metadata?.applicableExams ?? null, after: fill });
    }

    console.log(`\nPlanned changes: ${changes.length} · Skipped (no peer signal): ${skipped.length}`);
    for (const c of changes) console.log(`  ${c.display_id} [${c.chapter_id}]: ${JSON.stringify(c.before)} -> ${JSON.stringify(c.after)}`);
    for (const s of skipped) console.log(`  SKIP ${s.display_id} [${s.metadata?.chapter_id}] — chapter has no questions with applicableExams; decide manually`);

    if (!APPLY) {
        console.log('\nDRY RUN — nothing written. Re-run with --apply to write the changes above.');
        await mongoose.disconnect();
        return;
    }

    // Rollback log FIRST, then writes.
    const logDir = path.join(__dirname, 'logs');
    fs.mkdirSync(logDir, { recursive: true });
    const logPath = path.join(logDir, `backfill_applicable_exams_${Date.now()}.json`);
    fs.writeFileSync(logPath, JSON.stringify(changes, null, 2));
    console.log(`\nRollback log written: ${logPath}`);

    let written = 0;
    for (const c of changes) {
        const res = await col.updateOne({ _id: c._id }, { $set: { 'metadata.applicableExams': c.after } });
        written += res.modifiedCount;
    }
    console.log(`Applied: ${written}/${changes.length} documents updated.`);
    await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
