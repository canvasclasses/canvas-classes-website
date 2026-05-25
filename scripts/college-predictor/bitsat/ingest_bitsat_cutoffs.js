#!/usr/bin/env node
// ============================================================================
// BITSAT cutoff ingestion.
//
// Reads scripts/college-predictor/bitsat/data/bitsat_cutoffs.json (produced by
// fetch_bitsat_cutoffs.js) and upserts into the `bitsat_cutoffs` Mongo
// collection. Mirrors the JoSAA ingest flow but is simpler — no quota/category
// dimensions and no separate Colleges seed step (campuses live in a static
// catalog under packages/data/bitsat/campuses.ts).
//
// Usage:
//   node scripts/college-predictor/bitsat/ingest_bitsat_cutoffs.js            # dry run
//   node scripts/college-predictor/bitsat/ingest_bitsat_cutoffs.js --apply    # write to DB
// ============================================================================

require('dotenv').config({ path: '.env.local' });

const fs = require('node:fs');
const path = require('node:path');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');

const DATA_PATH = path.join(__dirname, 'data', 'bitsat_cutoffs.json');
if (!fs.existsSync(DATA_PATH)) {
  console.error(`Data file not found: ${DATA_PATH}`);
  console.error('Run `node scripts/college-predictor/bitsat/fetch_bitsat_cutoffs.js` first.');
  process.exit(1);
}

const VALID_CAMPUSES = new Set(['Pilani', 'Goa', 'Hyderabad']);
const VALID_DEGREES  = new Set(['BE', 'MSC', 'BPHARM']);
const VALID_MAX_SCORES = new Set([390, 450]);

function validateRow(r, i) {
  const errs = [];
  if (!VALID_CAMPUSES.has(r.campus)) errs.push(`bad campus "${r.campus}"`);
  if (!r.programme_code) errs.push('missing programme_code');
  if (!r.programme_name) errs.push('missing programme_name');
  if (!VALID_DEGREES.has(r.degree_type)) errs.push(`bad degree_type "${r.degree_type}"`);
  if (!Number.isInteger(r.year) || r.year < 2017 || r.year > 2030) errs.push(`bad year ${r.year}`);
  if (!Number.isFinite(r.cutoff_score) || r.cutoff_score <= 0) errs.push(`bad cutoff_score ${r.cutoff_score}`);
  if (!VALID_MAX_SCORES.has(r.max_score)) errs.push(`bad max_score ${r.max_score}`);
  if (r.cutoff_score > r.max_score) errs.push(`cutoff_score ${r.cutoff_score} > max_score ${r.max_score}`);
  if (errs.length > 0) console.warn(`  row ${i}: ${errs.join('; ')}`);
  return errs.length === 0;
}

(async function main() {
  const raw = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  console.log(`Parsed ${raw.length} rows from ${DATA_PATH}`);

  const valid = raw.filter((r, i) => validateRow(r, i));
  console.log(`Valid rows: ${valid.length} / ${raw.length}`);

  if (valid.length === 0) {
    console.error('No valid rows; aborting.');
    process.exit(1);
  }

  // Summary breakdown for the operator before they decide to --apply.
  const byCampus = {};
  const byYear   = {};
  const byCode   = {};
  for (const r of valid) {
    byCampus[r.campus] = (byCampus[r.campus] || 0) + 1;
    byYear[r.year]   = (byYear[r.year]   || 0) + 1;
    byCode[r.programme_code] = (byCode[r.programme_code] || 0) + 1;
  }
  console.log('\nBy campus:');
  for (const k of Object.keys(byCampus).sort()) console.log(`  ${k.padEnd(12)} ${byCampus[k]}`);
  console.log('\nBy year:');
  for (const k of Object.keys(byYear).sort()) console.log(`  ${k.padEnd(12)} ${byYear[k]}`);
  console.log('\nBy programme_code:');
  for (const k of Object.keys(byCode).sort()) console.log(`  ${k.padEnd(12)} ${byCode[k]}`);

  console.log('\nFirst 3 rows:');
  for (const r of valid.slice(0, 3)) console.log('  ', JSON.stringify(r));

  if (!APPLY) {
    console.log('\n(dry run — re-run with --apply to write to MongoDB)');
    return;
  }

  // Define schema inline to match packages/data/models/BitsatCutoff.ts.
  const BitsatCutoffSchema = new mongoose.Schema({
    _id: String,
    campus: String,
    programme_code: String,
    programme_name: String,
    degree_type: String,
    year: Number,
    cutoff_score: Number,
    max_score: Number,
    created_at: { type: Date, default: Date.now },
  }, { collection: 'bitsat_cutoffs' });

  const BitsatCutoff = mongoose.models.BitsatCutoff
    || mongoose.model('BitsatCutoff', BitsatCutoffSchema);

  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error('MONGODB_URI not set'); process.exit(1); }
  await mongoose.connect(uri);
  console.log('\nConnected to MongoDB.');

  // Ensure indexes exist (idempotent).
  await BitsatCutoff.collection.createIndex(
    { campus: 1, programme_code: 1, year: 1 },
    { unique: true, name: 'bitsat_cutoff_uniqueness' },
  );

  // Upsert each row on (campus, programme_code, year). Generates a new uuid
  // only if the row doesn't already exist (preserves stable _ids on re-runs).
  let inserted = 0, updated = 0;
  const bulk = BitsatCutoff.collection.initializeUnorderedBulkOp();
  for (const r of valid) {
    bulk.find({ campus: r.campus, programme_code: r.programme_code, year: r.year }).upsert().updateOne({
      $set: {
        campus: r.campus,
        programme_code: r.programme_code,
        programme_name: r.programme_name,
        degree_type: r.degree_type,
        year: r.year,
        cutoff_score: r.cutoff_score,
        max_score: r.max_score,
      },
      $setOnInsert: {
        _id: uuidv4(),
        created_at: new Date(),
      },
    });
  }
  const result = await bulk.execute();
  inserted = result.nUpserted || 0;
  updated  = result.nModified || 0;
  console.log(`\n✓ Upsert complete — inserted: ${inserted}, modified: ${updated}, matched: ${result.nMatched || 0}`);

  await mongoose.disconnect();
})().catch(async (err) => {
  console.error('Ingest failed:', err);
  try { await mongoose.disconnect(); } catch { /* noop */ }
  process.exit(1);
});
