/* eslint-disable */
/**
 * One-time backfill — re-derive UserProgress.concept_mastery from
 * recent_attempts using the canonical schema introduced May 2026.
 *
 * Why: pre-migration documents had two failure modes —
 *   (a) old field names (`total_attempted/correct_count/weak_areas`) from the
 *       original schema that were never actually written by any code path; and
 *   (b) partial documents written by the batch route with `times_attempted/
 *       times_correct/last_attempted_at` but missing the required
 *       `tag_id/tag_name/accuracy_percentage` fields.
 *
 * This script wipes concept_mastery for each user and rebuilds it from their
 * recent_attempts (which already carry concept_tags). For users with no
 * recent_attempts the map stays empty — they will start fresh.
 *
 * Run:  node scripts/backfill_concept_mastery.js
 *
 * Idempotent — safe to re-run. Reads MONGODB_URI from .env.local.
 */

const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const mongoose = require('mongoose');

// Inline the taxonomy import — the JS-side script can't import the .ts file
// directly. We compile a minimal id→name map by reading the TS source and
// extracting ids/names. For correctness it's safer to require the compiled
// version if you've run `tsc`; otherwise the fallback below uses tag_id as
// tag_name (cosmetic only — counts are still correct).
let getTagName = (id) => id;
try {
  // If a built version exists (post-`tsc`), use it.
  const built = require(path.join(__dirname, '..', '.next', 'server', 'lib', 'taxonomyLookup.js'));
  if (built && typeof built.getTagName === 'function') getTagName = built.getTagName;
} catch { /* fall back to id */ }

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('[backfill] MONGODB_URI missing — set it in .env.local');
    process.exit(1);
  }
  await mongoose.connect(uri);
  console.log('[backfill] connected to Mongo');

  const db = mongoose.connection.db;
  const col = db.collection('user_progress');

  const cursor = col.find({}, { projection: { _id: 1, recent_attempts: 1 } });
  let scanned = 0;
  let updated = 0;
  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    scanned += 1;
    const attempts = Array.isArray(doc.recent_attempts) ? doc.recent_attempts : [];
    const masteryMap = {};
    for (const a of attempts) {
      const tags = Array.isArray(a.concept_tags) ? a.concept_tags : [];
      const isCorrect = !!a.is_correct;
      const at = a.attempted_at ? new Date(a.attempted_at) : new Date();
      for (const tagId of tags) {
        if (!tagId) continue;
        if (!masteryMap[tagId]) {
          masteryMap[tagId] = {
            tag_id: tagId,
            tag_name: getTagName(tagId),
            times_attempted: 0,
            times_correct: 0,
            accuracy_percentage: 0,
            last_attempted_at: at,
          };
        }
        const m = masteryMap[tagId];
        m.times_attempted += 1;
        if (isCorrect) m.times_correct += 1;
        if (at > m.last_attempted_at) m.last_attempted_at = at;
      }
    }
    // Compute accuracy
    for (const k of Object.keys(masteryMap)) {
      const m = masteryMap[k];
      m.accuracy_percentage = m.times_attempted > 0
        ? Math.round((m.times_correct / m.times_attempted) * 100)
        : 0;
    }

    await col.updateOne(
      { _id: doc._id },
      { $set: { concept_mastery: masteryMap, updated_at: new Date() } }
    );
    updated += 1;
    if (updated % 100 === 0) console.log(`[backfill] processed ${updated}/${scanned}`);
  }

  console.log(`[backfill] done — scanned ${scanned}, updated ${updated}`);
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('[backfill] FAILED', err);
  process.exit(1);
});
