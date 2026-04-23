#!/usr/bin/env node
/**
 * JoSAA cutoff CSV ingestion.
 *
 * Reads a normalized JoSAA cutoff CSV and writes to the `college_cutoffs`
 * collection. JoSAA itself is an ASPX site that's painful to scrape live, so
 * the workflow is: snapshot the data into a CSV (manual or semi-automated),
 * then run this script. See scripts/college-predictor/README.md.
 *
 * Expected CSV columns (header row required, case-insensitive):
 *   Institute, Academic_Program_Name, Quota, Seat_Type, Gender,
 *   Opening_Rank, Closing_Rank, Year, Round
 *
 * Usage:
 *   node scripts/college-predictor/ingest_josaa_csv.js path/to/file.csv           # dry run
 *   node scripts/college-predictor/ingest_josaa_csv.js path/to/file.csv --apply   # write to DB
 *
 * Rules:
 *  - Dry run prints a summary and the first 5 parsed rows; it does not touch Mongo.
 *  - `--apply` upserts on the unique index (college, branch, year, round, category, gender, quota).
 *  - Rows for colleges not yet present in the `colleges` collection are skipped and
 *    reported at the end — run the seed_colleges script first.
 *  - Final round is inferred per (year) as max(round) seen in the CSV; `is_final_round`
 *    is set on those rows. The predictor only reads final-round documents.
 */

require('dotenv').config({ path: '.env.local' });

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
// Hand-curated JoSAA-institute-name → college-slug map. The legacy per-year
// ingester (ingest_josaa_2024.js) has always used this; the generic ingester
// must too, otherwise formal names like "Malaviya National Institute of
// Technology Jaipur" silently fail to match our short slug `nit-jaipur`.
const { INSTITUTE_NAME_TO_SLUG } = require('./data/institute_name_map');
const { canonicalBranch } = require('./data/canonicalBranch');

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const csvPath = args.find((a) => !a.startsWith('--'));

if (!csvPath) {
  console.error('Usage: node ingest_josaa_csv.js <path-to-csv> [--apply]');
  process.exit(1);
}
if (!fs.existsSync(csvPath)) {
  console.error(`CSV not found: ${csvPath}`);
  process.exit(1);
}

// ── CSV parser (no external dep — JoSAA data has no embedded quotes worth worrying about,
//    but we still handle basic quoted fields) ─────────────────────────────────────────
function parseCSV(raw) {
  const rows = [];
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return rows;

  const splitLine = (line) => {
    const out = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
        else inQuotes = !inQuotes;
      } else if (c === ',' && !inQuotes) {
        out.push(cur); cur = '';
      } else {
        cur += c;
      }
    }
    out.push(cur);
    return out.map((s) => s.trim());
  };

  const headers = splitLine(lines[0]).map((h) => h.toLowerCase().replace(/\s+/g, '_'));
  for (let i = 1; i < lines.length; i++) {
    const cells = splitLine(lines[i]);
    const row = {};
    headers.forEach((h, idx) => { row[h] = cells[idx] ?? ''; });
    rows.push(row);
  }
  return rows;
}

// ── JoSAA program-name → short branch code ─────────────────────────────────────────
// Delegates to the shared canonicalBranch helper so every ingester produces the
// same branch short/long names (any drift here quietly corrupts the predictor).
function splitProgramName(raw) {
  const { short_name, clean_name, degree, duration } = canonicalBranch(raw);
  return { name: clean_name, short_name, duration, degree };
}

// JoSAA publishes preparatory ranks with a trailing "P" (e.g. "238P"). The
// predictor doesn't use prep pools — we drop them. Some upstream dumps also
// produce "1224.0"-style floats from a pandas pipeline; Number() handles both.
function parseRank(raw) {
  const s = String(raw ?? '').trim();
  if (!s || s.endsWith('P')) return null;
  const n = Number(s);
  return Number.isFinite(n) ? Math.round(n) : null;
}

(async function main() {
  // Scripts are CommonJS and can't import the .ts models directly. Mongoose
  // only needs the schema shape at runtime, so we redefine minimal schemas here.
  const CollegeCutoffSchema = new mongoose.Schema({
    _id: String,
    college_id: String,
    college_short_name: String,
    college_type: String,
    branch_id: String,
    branch_short_name: String,
    branch_name: String,
    year: Number,
    round: Number,
    is_final_round: Boolean,
    category: String,
    gender: String,
    quota: String,
    opening_rank: Number,
    closing_rank: Number,
    created_at: { type: Date, default: Date.now },
  }, { collection: 'college_cutoffs' });

  const CollegeSchema = new mongoose.Schema({
    _id: String,
    name: String,
    short_name: String,
    type: String,
    institute_code: String,
  }, { collection: 'colleges' });

  const Cutoff = mongoose.models.CollegeCutoff
    || mongoose.model('CollegeCutoff', CollegeCutoffSchema);
  const CollegeModel = mongoose.models.College
    || mongoose.model('College', CollegeSchema);

  const raw = fs.readFileSync(path.resolve(csvPath), 'utf8');
  const rows = parseCSV(raw);
  console.log(`Parsed ${rows.length} rows from ${csvPath}`);

  if (rows.length === 0) {
    console.error('No rows parsed. Check CSV header/format.');
    process.exit(1);
  }

  // Connect before we need to look up colleges.
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error('MONGODB_URI not set'); process.exit(1); }
  await mongoose.connect(uri);
  console.log('Connected to MongoDB.');

  const colleges = await CollegeModel.find({}).lean();
  const bySlug = new Map(colleges.map((c) => [c._id, c]));

  // Build: max round per year → final-round marker
  const maxRoundByYear = new Map();
  for (const r of rows) {
    const y = parseInt(r.year, 10);
    const rd = parseInt(r.round, 10);
    if (!Number.isFinite(y) || !Number.isFinite(rd)) continue;
    maxRoundByYear.set(y, Math.max(maxRoundByYear.get(y) ?? 0, rd));
  }

  const docs = [];
  const notInMap = new Set();          // CSV name not in INSTITUTE_NAME_TO_SLUG
  const slugNotSeeded = new Set();     // mapped, but college not yet in DB
  let skippedIIT = 0;
  let skippedPrep = 0;
  let skippedBadYearRound = 0;

  for (const r of rows) {
    const institute = r.institute || '';

    // IITs are out of scope for the JEE-Main predictor. Skip silently.
    // We match on "Indian Institute of Technology" but NOT on "Information"
    // (which is the IIIT prefix).
    if (/Indian Institute of Technology/i.test(institute) && !/Information/i.test(institute)) {
      skippedIIT++;
      continue;
    }

    const slug = INSTITUTE_NAME_TO_SLUG[institute];
    if (!slug) {
      notInMap.add(institute);
      continue;
    }
    const college = bySlug.get(slug);
    if (!college) {
      slugNotSeeded.add(`${institute} → ${slug}`);
      continue;
    }

    const { name: branchName, short_name: branchShort } = splitProgramName(r.academic_program_name || '');
    const year = parseInt(r.year, 10);
    const round = parseInt(r.round, 10);
    const opening = parseRank(r.opening_rank);
    const closing = parseRank(r.closing_rank);

    if (!Number.isFinite(year) || !Number.isFinite(round)) {
      skippedBadYearRound++;
      continue;
    }
    if (opening === null || closing === null) {
      skippedPrep++;
      continue;
    }

    docs.push({
      _id: uuidv4(),
      college_id: college._id,
      college_short_name: college.short_name,
      college_type: college.type,
      branch_short_name: branchShort,
      branch_name: branchName,
      year,
      round,
      is_final_round: round === maxRoundByYear.get(year),
      category: r.seat_type,
      gender: r.gender,
      quota: r.quota,
      opening_rank: opening,
      closing_rank: closing,
    });
  }

  console.log(`\nPrepared ${docs.length} cutoff documents.`);
  console.log(`  Skipped IIT rows (out of scope):         ${skippedIIT}`);
  console.log(`  Skipped preparatory / invalid ranks:     ${skippedPrep}`);
  console.log(`  Skipped bad year/round:                  ${skippedBadYearRound}`);
  console.log(`  Institutes not in INSTITUTE_NAME_TO_SLUG: ${notInMap.size}`);
  console.log(`  Slug mapped but not in colleges DB:       ${slugNotSeeded.size}`);

  if (notInMap.size > 0) {
    console.log('\n⚠ Institutes NOT in INSTITUTE_NAME_TO_SLUG (add to map if in scope):');
    [...notInMap].sort().forEach((n) => console.log(`  - ${n}`));
  }
  if (slugNotSeeded.size > 0) {
    console.log('\n⚠ Slug in map but not in colleges DB (seed first):');
    [...slugNotSeeded].sort().forEach((n) => console.log(`  - ${n}`));
  }

  console.log('\nFirst 3 prepared documents:');
  docs.slice(0, 3).forEach((d) => console.log(JSON.stringify(d, null, 2)));

  if (!APPLY) {
    console.log('\nDry run — pass --apply to write to MongoDB.');
    await mongoose.disconnect();
    return;
  }

  // Batched upserts — sequential updateOne was ~11/sec against Atlas which
  // meant 2025 (53k rows) took over an hour. bulkWrite with 1000-op batches
  // brings the same workload under 2 minutes. Filter must match the unique
  // index on (college_id, branch_short_name, year, round, category, gender,
  // quota) so we replace-not-duplicate on re-ingest.
  console.log('\nUpserting (batched)...');
  const BATCH = 1000;
  let upserted = 0;
  for (let i = 0; i < docs.length; i += BATCH) {
    const slice = docs.slice(i, i + BATCH);
    const ops = slice.map((d) => {
      const { _id, ...rest } = d;
      return {
        updateOne: {
          filter: {
            college_id: d.college_id,
            branch_short_name: d.branch_short_name,
            year: d.year,
            round: d.round,
            category: d.category,
            gender: d.gender,
            quota: d.quota,
          },
          update: { $set: rest, $setOnInsert: { _id } },
          upsert: true,
        },
      };
    });
    await Cutoff.bulkWrite(ops, { ordered: false });
    upserted += slice.length;
    console.log(`  ...${upserted}/${docs.length}`);
  }
  console.log(`\n✅ Upserted ${upserted} cutoff documents.`);
  await mongoose.disconnect();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
