#!/usr/bin/env node
/**
 * Apply canonicalBranch() to every row in college_cutoffs, rewriting
 * branch_short_name (and the stored branch_name) in-place.
 *
 * This is idempotent — re-running after ingest has no effect on already-
 * canonical rows. Dry-run by default; pass --apply to write.
 *
 * Collision handling:
 *   If rewriting a row's short_name would conflict with the unique index
 *   (college_id, branch_short_name, year, round, category, gender, quota),
 *   we keep the row whose ORIGINAL branch_name matches the canonical
 *   clean_name more closely, and delete the other. This almost never happens
 *   in practice — the few cases we've seen all arose from the nested-paren
 *   parser bug producing two rows for the same underlying program.
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { canonicalBranch } = require('./data/canonicalBranch');

const APPLY = process.argv.includes('--apply');

const CutoffSchema = new mongoose.Schema({ _id: String }, { collection: 'college_cutoffs', strict: false, _id: false });
const Cutoff = mongoose.models.CollegeCutoff || mongoose.model('CollegeCutoff', CutoffSchema);

function rowKey(r, shortName) {
  return [r.college_id, shortName, r.year, r.round, r.category, r.gender, r.quota].join('|');
}

(async function () {
  await mongoose.connect(process.env.MONGODB_URI);
  const rows = await Cutoff.find({}).lean();
  console.log(`Scanning ${rows.length} cutoff rows…`);

  // Pass 1 — compute canonical name for every row.
  const updates = []; // { _id, from, to, cleanName }
  const unchanged = [];
  for (const r of rows) {
    const canon = canonicalBranch(r.branch_name || r.branch_short_name || '');
    if (canon.short_name === r.branch_short_name && canon.clean_name === r.branch_name) {
      unchanged.push(r);
    } else {
      updates.push({
        _id: r._id,
        row: r,
        to_short: canon.short_name,
        to_name: canon.clean_name,
      });
    }
  }

  console.log(`  Unchanged: ${unchanged.length}`);
  console.log(`  Will rewrite: ${updates.length}`);

  // Pass 2 — detect collisions. Build an index of EXISTING keys keyed by
  // (college, short, year, round, category, gender, quota). For every rewrite,
  // check if its target key already exists in another row.
  const existingKeys = new Map(); // key → _id
  for (const r of rows) existingKeys.set(rowKey(r, r.branch_short_name), r._id);

  // Track rewrites that would map onto an existing (different) row.
  const collisions = [];
  const willRewrite = [];
  for (const u of updates) {
    const newKey = rowKey(u.row, u.to_short);
    const existing = existingKeys.get(newKey);
    if (existing && existing !== u._id) {
      collisions.push({ ...u, collidesWith: existing });
    } else {
      willRewrite.push(u);
    }
  }

  console.log(`  Safe rewrites:   ${willRewrite.length}`);
  console.log(`  Collisions:      ${collisions.length}`);

  // Summarize the rewrites by (from → to) so it's skimmable.
  const pairs = new Map();
  for (const u of willRewrite) {
    const k = `${u.row.branch_short_name}  →  ${u.to_short}`;
    pairs.set(k, (pairs.get(k) ?? 0) + 1);
  }
  console.log('\nTop rewrite pairs (safe):');
  [...pairs.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .forEach(([k, n]) => console.log(`  [${String(n).padStart(4)}×]  ${k}`));

  if (collisions.length) {
    console.log('\nCollision examples (first 10):');
    collisions.slice(0, 10).forEach((c) => {
      console.log(`  ${c.row.college_id}  ${c.row.branch_short_name} (${c.row.year}) → ${c.to_short}  collides with _id=${c.collidesWith}`);
    });
  }

  if (!APPLY) {
    console.log('\nDry run — pass --apply to write.');
    await mongoose.disconnect();
    return;
  }

  // Apply the safe rewrites.
  let done = 0;
  for (const u of willRewrite) {
    await Cutoff.updateOne(
      { _id: u._id },
      { $set: { branch_short_name: u.to_short, branch_name: u.to_name } },
    );
    done++;
    if (done % 500 === 0) console.log(`  ...${done}/${willRewrite.length}`);
  }
  console.log(`\n✅ Rewrote ${done} rows.`);

  // Handle collisions — keep the row with the closer match to canonical,
  // delete the other.
  let merged = 0;
  for (const c of collisions) {
    const other = await Cutoff.findOne({ _id: c.collidesWith }).lean();
    if (!other) continue;
    // Prefer the row whose current branch_name already equals the canonical
    // clean_name; delete the other. If both/neither, keep the 'other' (it
    // already has the canonical short_name) and delete our rewrite candidate.
    const keepOther = other.branch_name === c.to_name || c.row.branch_name !== c.to_name;
    if (keepOther) {
      await Cutoff.deleteOne({ _id: c._id });
    } else {
      await Cutoff.deleteOne({ _id: c.collidesWith });
      await Cutoff.updateOne(
        { _id: c._id },
        { $set: { branch_short_name: c.to_short, branch_name: c.to_name } },
      );
    }
    merged++;
  }
  if (merged) console.log(`Merged ${merged} collisions.`);

  await mongoose.disconnect();
})().catch((err) => { console.error(err); process.exit(1); });
