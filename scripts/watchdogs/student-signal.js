'use strict';
/**
 * student-signal.js — Layer-A watchdog #4 (AI-native supervisory layer).
 *
 * WHAT IT SURFACES: turns silent learning data into a signal — chapters where
 * students fail a lot (low accuracy, enough attempts to be real) and chapters
 * that have questions but are never attempted. Reads `learning_events`
 * (append-only attempts) + `user_progress.chapter_progress`, joins question
 * counts per chapter from questions_v2.
 *
 * HONEST BY DESIGN: with little usage the signal is noise, so below a minimum
 * attempt volume it reports "too sparse" instead of inventing findings
 * (AI_NATIVE_ROADMAP §5.4). It becomes useful automatically as usage grows.
 *
 * READ-ONLY.  RUN: node scripts/watchdogs/student-signal.js [--json]
 * EXIT: 1 if it found actionable high-failure chapters, else 0 (0 also when sparse).
 */
const bw = require('../lib/book-writer');

const asJson = process.argv.includes('--json');
const MIN_TOTAL_ATTEMPTS = 200;   // below this, signals aren't meaningful yet
const MIN_CH_ATTEMPTS = 20;       // per-chapter floor to flag accuracy
const FAIL_ACCURACY = 0.5;        // <50% correct = high-failure

async function run() {
  return bw.withDb(async (db) => {
    // Per-chapter attempts + correct from learning_events.
    const ev = await db.collection('learning_events').aggregate([
      { $match: { chapter_id: { $nin: [null, ''] } } },
      { $group: { _id: '$chapter_id', attempts: { $sum: 1 }, correct: { $sum: { $cond: ['$correct', 1, 0] } } } },
    ], { allowDiskUse: true }).toArray();

    const totalAttempts = ev.reduce((s, e) => s + e.attempts, 0);

    // Question counts per chapter (only chapters that actually have a bank).
    const qByCh = await db.collection('questions_v2').aggregate([
      { $match: { deleted_at: null, status: 'published', 'metadata.chapter_id': { $nin: [null, ''] } } },
      { $group: { _id: '$metadata.chapter_id', q: { $sum: 1 } } },
    ], { allowDiskUse: true }).toArray();
    const chaptersWithBank = new Set(qByCh.map((c) => c._id));
    const attemptedChapters = new Set(ev.map((e) => e._id));

    if (totalAttempts < MIN_TOTAL_ATTEMPTS) {
      return {
        name: 'student-signal', severity: 0,
        headline: `student data too sparse (${totalAttempts} attempts across ${attemptedChapters.size} chapter(s)) — signals not yet meaningful`,
        sparse: true, totalAttempts, attemptedChapters: attemptedChapters.size, chaptersWithBank: chaptersWithBank.size,
      };
    }

    const highFailure = ev
      .filter((e) => e.attempts >= MIN_CH_ATTEMPTS && e.correct / e.attempts < FAIL_ACCURACY)
      .map((e) => ({ chapter_id: e._id, attempts: e.attempts, accuracy: Math.round((e.correct / e.attempts) * 100) }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 20);

    const neverAttempted = [...chaptersWithBank].filter((c) => !attemptedChapters.has(c)).slice(0, 30);

    const severity = highFailure.length ? 1 : 0;
    return {
      name: 'student-signal', severity, sparse: false, totalAttempts,
      headline: highFailure.length ? `${highFailure.length} high-failure chapter(s) — students struggling` : `no high-failure chapters (${totalAttempts} attempts analysed)`,
      highFailure, neverAttempted, neverAttemptedCount: [...chaptersWithBank].filter((c) => !attemptedChapters.has(c)).length,
    };
  });
}

function printReport(r) {
  const L = console.log;
  L('\n=== Student-signal analyst ===');
  if (r.sparse) { L(`ℹ️  ${r.headline}`); L('   It will produce real signals automatically once usage grows.\n'); return; }
  L(`${r.totalAttempts} attempts analysed · 🟡 ${r.highFailure.length} high-failure\n`);
  if (r.highFailure.length) { L('🟡 Chapters where students struggle (build/fix here):'); for (const c of r.highFailure) L(`  • ${c.chapter_id} — ${c.accuracy}% correct over ${c.attempts} attempts`); L(''); }
  if (r.neverAttemptedCount) { L(`ℹ️  ${r.neverAttemptedCount} chapter(s) have a question bank but zero attempts. First few:`); for (const c of r.neverAttempted.slice(0, 10)) L(`  • ${c}`); L(''); }
  if (!r.highFailure.length) L('✅ No high-failure chapters in the analysed data.\n');
}

run()
  .then((r) => { if (asJson) console.log(JSON.stringify(r, null, 2)); else printReport(r); process.exit(r.severity); })
  .catch((e) => { console.error('student-signal failed:', e.message); process.exit(3); });
