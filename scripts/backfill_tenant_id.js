/**
 * backfill_tenant_id.js — Phase 3 (ADR-011) one-time backfill.
 *
 * Stamps `tenant_id: 'public'` onto existing user_progress and
 * student_chapter_profiles documents that predate multi-tenancy (i.e. have no
 * tenant_id). New docs are stamped at creation by the routes; this only makes
 * the OLD data uniform so tenant-filtered queries don't need an $exists branch.
 *
 * SAFE BY DEFAULT: dry-run unless you pass --apply.
 *   node scripts/backfill_tenant_id.js            # report counts only (no writes)
 *   node scripts/backfill_tenant_id.js --apply     # perform the backfill
 *
 * Scope: only documents WHERE tenant_id is missing. Documents that already have
 * a tenant_id (any value) are never touched.
 * Rollback: $unset tenant_id on the same filter, or restore from the daily
 * Atlas snapshot. Reads already treat a missing tenant_id as 'public', so not
 * running this changes no behaviour — it is purely a data-hygiene step.
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
const mongoose = require('mongoose');

const DEFAULT_TENANT_ID = 'public';
const APPLY = process.argv.includes('--apply');

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error('MONGODB_URI not set'); process.exit(1); }
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const targets = [
    { coll: 'user_progress', label: 'UserProgress' },
    { coll: 'student_chapter_profiles', label: 'StudentChapterProfile' },
  ];

  console.log(`\nMode: ${APPLY ? 'APPLY (writing)' : 'DRY RUN (no writes)'}\n`);
  for (const { coll, label } of targets) {
    const c = db.collection(coll);
    const filter = { tenant_id: { $exists: false } };
    const missing = await c.countDocuments(filter);
    const total = await c.estimatedDocumentCount();
    console.log(`${label} (${coll}): ${missing} of ~${total} docs missing tenant_id`);
    if (APPLY && missing > 0) {
      const res = await c.updateMany(filter, { $set: { tenant_id: DEFAULT_TENANT_ID } });
      console.log(`  → set tenant_id='${DEFAULT_TENANT_ID}' on ${res.modifiedCount} docs`);
    }
  }

  if (!APPLY) console.log('\nDry run complete. Re-run with --apply to perform the backfill.');
  await mongoose.disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
