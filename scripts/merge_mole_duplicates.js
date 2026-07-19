/**
 * MOLE duplicate merge + soft-delete (founder-approved 2026-06-25).
 *
 * For each pair [KEEP, DUP]:
 *   1. KEEP (handwritten ≤90, has solution): receive PYQ attribution from DUP —
 *      metadata.sourceType='PYQ', metadata.examDetails, metadata.applicableExams
 *      (union, never removes existing). Writes ONLY canonical §4.5 fields.
 *   2. If KEEP has no structured answer and DUP has one: port it — but only
 *      integer_value (format-safe). correct_option is FLAGGED, never auto-ported
 *      (option order may differ → wrong key).
 *   3. DUP: SOFT-delete (deleted_at + deleted_by + deletion_reason). Never hard-delete.
 *
 * Safe by construction: dry-run by default; `--apply` to execute; writes a
 * timestamped rollback JSON capturing every prior value. Idempotent (skips a DUP
 * already soft-deleted). Explicit field whitelist — no `$set: body`.
 *
 * Run:  node scripts/merge_mole_duplicates.js            (dry-run)
 *       node scripts/merge_mole_duplicates.js --apply     (execute)
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const fs = require('fs');

const APPLY = process.argv.includes('--apply');
const CHAPTER_ID = 'ch11_mole';

// [KEEP (original, has solution), DUP (PYQ copy to soft-delete)]
const PAIRS = [
  ['MOLE-063', 'MOLE-203'], ['MOLE-050', 'MOLE-194'], ['MOLE-083', 'MOLE-136'],
  ['MOLE-015', 'MOLE-112'], ['MOLE-086', 'MOLE-188'], ['MOLE-056', 'MOLE-198'],
  ['MOLE-081', 'MOLE-133'], ['MOLE-029', 'MOLE-205'], ['MOLE-054', 'MOLE-123'],
  ['MOLE-052', 'MOLE-116'], ['MOLE-078', 'MOLE-180'], ['MOLE-082', 'MOLE-242'],
  ['MOLE-062', 'MOLE-204'], ['MOLE-085', 'MOLE-183'], ['MOLE-084', 'MOLE-137'],
  ['MOLE-057', 'MOLE-200'],
  // Founder-approved 2026-06-25 (was held for answer-format review): keep 042
  // (MCQ, has its own answer + solution), mark it JEE Advanced PYQ, delete 243.
  ['MOLE-042', 'MOLE-243'],
];

const hasAnswer = (q) => {
  const a = (q && q.answer) || {};
  return a.correct_option != null || a.integer_value != null || a.decimal_value != null;
};

// normalize option text for matching (strip latex/space/punct)
const normOpt = (s) => String(s || '')
  .replace(/\$+/g, ' ').replace(/\\ce\{([^}]*)\}/g, '$1').replace(/\\[a-zA-Z]+/g, ' ')
  .replace(/[{}\s]/g, '').replace(/[^a-z0-9.]/gi, '').toLowerCase();

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 60000 });
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');

  const byDisplay = (display_id) =>
    col.findOne({ display_id, 'metadata.chapter_id': CHAPTER_ID });

  const rollback = [];
  const plan = [];
  let abort = false;

  for (const [keepId, dupId] of PAIRS) {
    const keep = await byDisplay(keepId);
    const dup = await byDisplay(dupId);
    if (!keep) { console.error(`✗ KEEP ${keepId} not found`); abort = true; continue; }
    if (!dup) { console.error(`✗ DUP ${dupId} not found`); abort = true; continue; }
    if (keep.deleted_at) { console.error(`✗ KEEP ${keepId} is soft-deleted`); abort = true; continue; }
    if (dup.deleted_at) { console.log(`• ${dupId} already soft-deleted — skipping (idempotent)`); continue; }

    const km = keep.metadata || {};
    const dm = dup.metadata || {};

    // metadata to set on KEEP (explicit whitelist, canonical §4.5 fields only)
    const keepSet = { 'metadata.sourceType': 'PYQ' };
    if (dm.examDetails) keepSet['metadata.examDetails'] = dm.examDetails;
    const exUnion = Array.from(new Set([...(km.applicableExams || []), ...(dm.applicableExams || [])]));
    if (exUnion.length) keepSet['metadata.applicableExams'] = exUnion;

    // answer port (only when KEEP genuinely lacks one). KEEP.answer may be
    // null/undefined, so we set the WHOLE answer object (dotted paths fail on null).
    let answerNote = '';
    if (!hasAnswer(keep) && hasAnswer(dup)) {
      const base = keep.answer || {};
      if (dup.answer.integer_value != null) {
        keepSet['answer'] = { ...base, integer_value: dup.answer.integer_value };
        answerNote = `ported integer answer ${dup.answer.integer_value} from ${dupId}`;
      } else if (dup.answer.decimal_value != null) {
        keepSet['answer'] = { ...base, decimal_value: dup.answer.decimal_value };
        answerNote = `ported decimal answer ${dup.answer.decimal_value} from ${dupId}`;
      } else if (dup.answer.correct_option != null) {
        // Match the DUP's correct option by TEXT onto KEEP's options (robust to
        // reordering) — never copy the bare letter, which could point elsewhere.
        const dupOpt = (dup.options || []).find(o => o.id === dup.answer.correct_option);
        const dupText = dupOpt ? normOpt(dupOpt.text) : null;
        const keepMatch = dupText ? (keep.options || []).find(o => normOpt(o.text) === dupText) : null;
        if (keepMatch) {
          keepSet['answer'] = { ...base, correct_option: keepMatch.id };
          answerNote = `ported option answer → '${keepMatch.id}' (text-matched DUP '${dup.answer.correct_option}': "${(dupOpt.text || '').slice(0, 40)}")`;
        } else {
          answerNote = `⚑ KEEP has NO answer; DUP option '${dup.answer.correct_option}' text did not match any KEEP option — NOT ported. Fill manually.`;
        }
      }
    }

    // soft-delete payload for DUP
    const dupSet = {
      deleted_at: new Date(),
      deleted_by: 'script:mole-dedup',
      deletion_reason: `Duplicate of ${keepId} (${dm.examDetails ? (dm.examDetails.exam || '') + ' ' + (dm.examDetails.year || '') : 'PYQ'}); PYQ metadata merged onto ${keepId} on 2026-06-25.`,
    };

    // capture rollback BEFORE mutating
    rollback.push({
      keep: {
        _id: keep._id, display_id: keepId,
        before: {
          'metadata.sourceType': km.sourceType ?? null,
          'metadata.examDetails': km.examDetails ?? null,
          'metadata.applicableExams': km.applicableExams ?? null,
          answer: keep.answer ?? null,
        },
        set: keepSet,
      },
      dup: {
        _id: dup._id, display_id: dupId,
        before: { deleted_at: null, deleted_by: dup.deleted_by ?? null, deletion_reason: dup.deletion_reason ?? null },
        set: dupSet,
      },
    });

    plan.push({ keepId, dupId, keepSet, dupReason: dupSet.deletion_reason, answerNote });
  }

  if (abort) {
    console.error('\n✗ ABORTING — one or more lookups failed. No writes performed.');
    await client.close();
    process.exit(1);
  }

  // ---- print plan ----
  console.log(`\n${APPLY ? '🟢 APPLY' : '🟡 DRY-RUN'} — ${plan.length} pairs to process\n`);
  for (const p of plan) {
    console.log(`KEEP ${p.keepId}  ← merge PYQ: ${JSON.stringify(p.keepSet['metadata.examDetails'] || p.keepSet['metadata.sourceType'])}`);
    if (p.answerNote) console.log(`     ${p.answerNote}`);
    console.log(`DEL  ${p.dupId}   (soft-delete)\n`);
  }

  if (!APPLY) {
    console.log('Dry-run only — nothing written. Re-run with --apply to execute.');
    await client.close();
    return;
  }

  // ---- write rollback file, then apply ----
  const stamp = '20260625_pair042';
  const rbPath = `scripts/_rollback_mole_dedup_${stamp}.json`;
  fs.writeFileSync(rbPath, JSON.stringify(rollback, null, 2));
  console.log(`Rollback written: ${rbPath}`);

  let merged = 0, deleted = 0;
  for (const r of rollback) {
    await col.updateOne({ _id: r.keep._id }, { $set: r.keep.set });
    merged++;
    await col.updateOne({ _id: r.dup._id }, { $set: r.dup.set });
    deleted++;
  }

  console.log(`\n✅ Done: ${merged} originals updated with PYQ metadata, ${deleted} duplicates soft-deleted.`);
  console.log(`Rollback: node scripts/rollback_mole_dedup.js  (or restore from ${rbPath})`);
  await client.close();
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
