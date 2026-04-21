#!/usr/bin/env node
/**
 * Ingest a JoSAA final-round cutoff CSV (7-column format: Institute, Academic
 * Program Name, Quota, Seat Type, Gender, Opening Rank, Closing Rank).
 *
 * That format is used by both:
 *   - Quantum-Codes/JoSAA_2024 `josaa24.csv`     → YEAR=2024, ROUND=5
 *   - ksauraj/jee_counsellor ranks_all.csv files → per-year / per-round
 *
 * Year and round must be passed via CLI — the CSV itself does not carry them.
 *
 * Usage:
 *   node ingest_josaa_2024.js <csv> --year 2023 --round 6 --final            # dry run
 *   node ingest_josaa_2024.js <csv> --year 2023 --round 6 --final --apply    # write
 *
 * Pass --final only for the final round of the given year. Early-round ingests
 * (R1, R3, etc.) must omit --final so the predictor's "final-round" query path
 * keeps its original semantics.
 */

require('dotenv').config({ path: '.env.local' });

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { INSTITUTE_NAME_TO_SLUG } = require('./data/institute_name_map');
const { canonicalBranch } = require('./data/canonicalBranch');

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const IS_FINAL = args.includes('--final');
const yearFlag = args.indexOf('--year');
const roundFlag = args.indexOf('--round');
const YEAR = yearFlag >= 0 ? parseInt(args[yearFlag + 1], 10) : NaN;
const ROUND = roundFlag >= 0 ? parseInt(args[roundFlag + 1], 10) : NaN;
const csvPath = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--year' && args[i - 1] !== '--round');

if (!csvPath || !Number.isFinite(YEAR) || !Number.isFinite(ROUND)) {
  console.error('Usage: node ingest_josaa_2024.js <csv-path> --year <yyyy> --round <n> [--final] [--apply]');
  process.exit(1);
}
if (!fs.existsSync(csvPath)) {
  console.error(`CSV not found: ${csvPath}`);
  process.exit(1);
}

function parseCSV(raw) {
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const splitLine = (line) => {
    const out = []; let cur = ''; let q = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (q && line[i + 1] === '"') { cur += '"'; i++; }
        else q = !q;
      } else if (c === ',' && !q) { out.push(cur); cur = ''; }
      else cur += c;
    }
    out.push(cur);
    return out.map((s) => s.trim());
  };
  const headers = splitLine(lines[0]);
  const key = (h) => h.toLowerCase().replace(/\s+/g, '_');
  const keys = headers.map(key);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = splitLine(lines[i]);
    const row = {};
    keys.forEach((h, idx) => { row[h] = cells[idx] ?? ''; });
    rows.push(row);
  }
  return rows;
}

function splitProgramName(raw) {
  // Delegate to the shared canonical branch derivation. Keeps ingest + the
  // post-hoc normalizer in lockstep — if one of them drifts, the other
  // re-introduces the bug on the next run.
  const { short_name, clean_name, degree, duration } = canonicalBranch(raw);
  return { name: clean_name, short_name, duration, degree };
}

// JoSAA publishes preparatory ranks as "238P" — we drop those; they're used
// only for specific reserved-category fallback pools and aren't useful here.
//
// Some CSV sources export ranks as floats ("1224.0") from a pandas pipeline;
// stripping non-digits naively turned that into 12240 (10× too large). Use
// Number() + round so both integer strings and "X.0" floats parse correctly.
function parseRank(raw) {
  const s = String(raw).trim();
  if (!s || s.endsWith('P')) return null;
  const n = Number(s);
  return Number.isFinite(n) ? Math.round(n) : null;
}

(async function main() {
  const CollegeCutoffSchema = new mongoose.Schema({
    _id: String,
    college_id: String,
    college_short_name: String,
    college_type: String,
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
  }, { collection: 'colleges' });

  const Cutoff = mongoose.models.CollegeCutoff || mongoose.model('CollegeCutoff', CollegeCutoffSchema);
  const CollegeModel = mongoose.models.College || mongoose.model('College', CollegeSchema);

  const raw = fs.readFileSync(path.resolve(csvPath), 'utf8');
  const rows = parseCSV(raw);
  console.log(`Parsed ${rows.length} rows from ${csvPath}`);
  if (rows.length === 0) { console.error('Empty CSV.'); process.exit(1); }

  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error('MONGODB_URI not set'); process.exit(1); }
  await mongoose.connect(uri);
  console.log('Connected to MongoDB.');

  const colleges = await CollegeModel.find({}).lean();
  const bySlug = new Map(colleges.map((c) => [c._id, c]));
  console.log(`Found ${colleges.length} colleges in DB.`);

  const docs = [];
  const unmatchedInstitutes = new Set();
  const notInMap = new Set();
  let skippedPrep = 0;
  let skippedIIT = 0;
  let skippedBadRank = 0;

  for (const r of rows) {
    const institute = r.institute || '';
    const slug = INSTITUTE_NAME_TO_SLUG[institute];

    if (!slug) {
      // IITs aren't in our JEE Main predictor scope — skip quietly.
      if (/Indian Institute of Technology/i.test(institute) && !/Information/i.test(institute)) {
        skippedIIT++;
        continue;
      }
      notInMap.add(institute);
      continue;
    }
    const college = bySlug.get(slug);
    if (!college) {
      unmatchedInstitutes.add(`${institute} → ${slug}`);
      continue;
    }

    const { name: branchName, short_name: branchShort } = splitProgramName(r.academic_program_name || '');
    const opening = parseRank(r.opening_rank);
    const closing = parseRank(r.closing_rank);
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
      year: YEAR,
      round: ROUND,
      is_final_round: IS_FINAL,
      category: r.seat_type,
      gender: r.gender,
      quota: r.quota,
      opening_rank: opening,
      closing_rank: closing,
    });
  }

  console.log(`\nPrepared ${docs.length} cutoff documents`);
  console.log(`  Skipped IIT rows:          ${skippedIIT}`);
  console.log(`  Skipped preparatory ranks: ${skippedPrep}`);
  console.log(`  Institutes not in map:     ${notInMap.size}`);
  console.log(`  Seeded slug missing in DB: ${unmatchedInstitutes.size}`);

  if (notInMap.size > 0) {
    console.log('\n⚠ Institutes missing from INSTITUTE_NAME_TO_SLUG:');
    [...notInMap].slice(0, 20).forEach((n) => console.log('  -', n));
    if (notInMap.size > 20) console.log(`  ... and ${notInMap.size - 20} more`);
  }
  if (unmatchedInstitutes.size > 0) {
    console.log('\n⚠ Institute mapped but slug not yet in colleges collection:');
    [...unmatchedInstitutes].slice(0, 20).forEach((n) => console.log('  -', n));
    if (unmatchedInstitutes.size > 20) console.log(`  ... and ${unmatchedInstitutes.size - 20} more`);
  }

  if (docs.length > 0) {
    console.log('\nFirst document:');
    console.log(JSON.stringify(docs[0], null, 2));
  }

  if (!APPLY) {
    console.log('\nDry run — pass --apply to write to MongoDB.');
    await mongoose.disconnect();
    return;
  }

  console.log('\nUpserting...');
  let upserted = 0;
  for (const d of docs) {
    const filter = {
      college_id: d.college_id,
      branch_short_name: d.branch_short_name,
      year: d.year,
      round: d.round,
      category: d.category,
      gender: d.gender,
      quota: d.quota,
    };
    const { _id, ...rest } = d;
    await Cutoff.updateOne(
      filter,
      { $set: rest, $setOnInsert: { _id } },
      { upsert: true },
    );
    upserted++;
    if (upserted % 1000 === 0) console.log(`  ...${upserted}/${docs.length}`);
  }
  console.log(`\n✅ Upserted ${upserted} cutoff documents.`);
  await mongoose.disconnect();
})().catch((err) => { console.error(err); process.exit(1); });
