/**
 * Re-ID the published TEMP-* display_ids to proper chapter-prefixed IDs.
 *
 * WHY (QUESTION_LIBRARY_SPEC §5 Phase C data hygiene, 2026-07-18): 5
 * published questions still carry TEMP-* display_ids (audit 2026-07-18:
 * TEMP-207 ch11_periodic; TEMP-216/256/319 ch12_biomolecules; TEMP-242
 * ch12_dblock). display_id is the future slug anchor
 * (/questions/.../{stem-slug}-{display_id}) and must be stable + meaningful.
 *
 * HOW: for each TEMP question, the new prefix is SELF-DERIVED as the modal
 * (most common) prefix among the OTHER published questions in the same
 * chapter (no hardcoded prefix map to drift from the workflow docs), and the
 * new number = (max numeric suffix for that prefix across the WHOLE
 * collection) + 1, assigned in ascending order. Collision-checked before
 * write.
 *
 * SAFETY (CLAUDE.md §0 rule 3):
 * - DRY-RUN BY DEFAULT; `--apply` required to write.
 * - Affected docs: exactly the published TEMP-* set, enumerated by the dry
 *   run (expected 5 as of 2026-07-18; re-count at run time).
 * - ROLLBACK: scripts/logs/reid_temp_display_ids_<ts>.json records
 *   {_id, before, after}; restore `display_id: before` per _id to undo.
 * - Only touches `display_id`. The public UUID URLs (/the-crucible/q/{uuid})
 *   are unaffected; the display_id→UUID redirect resolves the NEW id after
 *   the change (old TEMP-id links were never a public surface).
 *
 * Run:  node scripts/reid_temp_display_ids.js           (dry run)
 *       node scripts/reid_temp_display_ids.js --apply   (writes)
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

    const temps = await col
        .find({ ...PUBLISHED, display_id: /^TEMP-/ })
        .project({ display_id: 1, 'metadata.chapter_id': 1 })
        .sort({ display_id: 1 })
        .toArray();

    console.log(`Published TEMP-* questions: ${temps.length}`);
    if (temps.length === 0) { await mongoose.disconnect(); return; }

    const changes = [];
    const nextNumByPrefix = {};

    for (const t of temps) {
        const ch = t.metadata?.chapter_id;
        if (!ch) { console.log(`  SKIP ${t.display_id}: no chapter_id — fix manually`); continue; }

        // Modal prefix among the chapter's other published questions.
        const agg = await col
            .aggregate([
                { $match: { ...PUBLISHED, 'metadata.chapter_id': ch, display_id: { $not: /^TEMP-/ } } },
                { $project: { prefix: { $arrayElemAt: [{ $split: ['$display_id', '-'] }, 0] } } },
                { $group: { _id: '$prefix', n: { $sum: 1 } } },
                { $sort: { n: -1 } },
                { $limit: 1 },
            ])
            .toArray();
        if (!agg.length) { console.log(`  SKIP ${t.display_id} [${ch}]: chapter has no non-TEMP peers — pick a prefix manually`); continue; }
        const prefix = agg[0]._id;

        // Next free number for this prefix (collection-wide, once per prefix).
        if (!(prefix in nextNumByPrefix)) {
            const existing = await col
                .find({ display_id: new RegExp(`^${prefix}-\\d+$`) })
                .project({ display_id: 1 })
                .toArray();
            const maxNum = existing.reduce((m, d) => Math.max(m, parseInt(d.display_id.split('-')[1], 10) || 0), 0);
            nextNumByPrefix[prefix] = maxNum + 1;
        }
        const num = nextNumByPrefix[prefix]++;
        const newId = `${prefix}-${String(num).padStart(3, '0')}`;
        changes.push({ _id: t._id, before: t.display_id, after: newId, chapter_id: ch });
    }

    console.log(`\nPlanned re-IDs: ${changes.length}`);
    for (const c of changes) console.log(`  ${c.before} [${c.chapter_id}] -> ${c.after}`);

    // Collision check before any write.
    for (const c of changes) {
        const clash = await col.findOne({ display_id: c.after });
        if (clash) throw new Error(`Collision: ${c.after} already exists (${clash._id}) — aborting, nothing written.`);
    }

    if (!APPLY) {
        console.log('\nDRY RUN — nothing written. Re-run with --apply to write the changes above.');
        await mongoose.disconnect();
        return;
    }

    const logDir = path.join(__dirname, 'logs');
    fs.mkdirSync(logDir, { recursive: true });
    const logPath = path.join(logDir, `reid_temp_display_ids_${Date.now()}.json`);
    fs.writeFileSync(logPath, JSON.stringify(changes, null, 2));
    console.log(`\nRollback log written: ${logPath}`);

    let written = 0;
    for (const c of changes) {
        const res = await col.updateOne({ _id: c._id, display_id: c.before }, { $set: { display_id: c.after } });
        written += res.modifiedCount;
    }
    console.log(`Applied: ${written}/${changes.length} documents updated.`);
    await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
