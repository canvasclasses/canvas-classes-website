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

// ── JoSAA program-name heuristic → short branch code ──────────────────────────────
// JoSAA stores full academic program names like:
//   "Computer Science and Engineering (4 Years, Bachelor of Technology)"
// We split into short_name (for UI) and duration/degree (for filters).
function splitProgramName(raw) {
  const paren = raw.match(/\(([^)]+)\)\s*$/);
  const name = paren ? raw.slice(0, paren.index).trim() : raw.trim();
  const meta = paren ? paren[1] : '';

  const yearMatch = meta.match(/(\d+)\s*Years?/i);
  const duration = yearMatch ? parseInt(yearMatch[1], 10) : 4;

  const degreeHints = [
    { rx: /Bachelor of Technology/i, degree: 'B.Tech' },
    { rx: /Bachelor of Architecture/i, degree: 'B.Arch' },
    { rx: /Bachelor of Planning/i, degree: 'B.Plan' },
    { rx: /Dual Degree/i, degree: 'Dual Degree' },
    { rx: /Integrated M\.?Tech/i, degree: 'Int. M.Tech' },
    { rx: /Integrated M\.?Sc/i, degree: 'Int. M.Sc.' },
    { rx: /B\.?Tech\s*\+\s*M\.?Tech/i, degree: 'B.Tech + M.Tech' },
  ];
  const degreeHit = degreeHints.find((h) => h.rx.test(meta));
  const degree = degreeHit ? degreeHit.degree : 'B.Tech';

  // Short name: strip " Engineering" suffix + common abbreviations.
  const abbrev = {
    'Computer Science and Engineering': 'CSE',
    'Electronics and Communication Engineering': 'ECE',
    'Electrical Engineering': 'EE',
    'Electrical and Electronics Engineering': 'EEE',
    'Mechanical Engineering': 'ME',
    'Civil Engineering': 'CE',
    'Chemical Engineering': 'CHE',
    'Metallurgical and Materials Engineering': 'MME',
    'Aerospace Engineering': 'AE',
    'Biotechnology': 'BT',
    'Production and Industrial Engineering': 'PIE',
    'Information Technology': 'IT',
    'Artificial Intelligence': 'AI',
    'Artificial Intelligence and Machine Learning': 'AI & ML',
    'Data Science and Engineering': 'DSE',
  };
  const short = abbrev[name] || name
    .replace(/\s+Engineering\b/, '')
    .replace(/\s+/g, ' ')
    .trim();

  return { name, short_name: short, duration, degree };
}

// ── Institute name → college slug ──────────────────────────────────────────────────
// The authoritative mapping lives in the `colleges` collection. We slugify as a
// best-guess; unmatched institutes get reported at the end.
function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[,.'()]/g, '')
    .replace(/national institute of technology/g, 'nit')
    .replace(/indian institute of information technology/g, 'iiit')
    .replace(/indian institute of technology/g, 'iit')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
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
  const unmatchedInstitutes = new Set();
  let skipped = 0;

  for (const r of rows) {
    const institute = r.institute || '';
    const slug = slugify(institute);
    const college = bySlug.get(slug);
    if (!college) {
      unmatchedInstitutes.add(institute);
      skipped++;
      continue;
    }

    const { name: branchName, short_name: branchShort } = splitProgramName(r.academic_program_name || '');
    const year = parseInt(r.year, 10);
    const round = parseInt(r.round, 10);
    const opening = parseInt(String(r.opening_rank).replace(/[^\d]/g, ''), 10);
    const closing = parseInt(String(r.closing_rank).replace(/[^\d]/g, ''), 10);

    if (!Number.isFinite(year) || !Number.isFinite(round) || !Number.isFinite(opening) || !Number.isFinite(closing)) {
      skipped++;
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

  console.log(`Prepared ${docs.length} cutoff documents (${skipped} skipped).`);
  if (unmatchedInstitutes.size > 0) {
    console.log(`\n⚠ Unmatched institutes (seed these first): ${unmatchedInstitutes.size}`);
    [...unmatchedInstitutes].slice(0, 20).forEach((i) => console.log(`  - ${i}`));
    if (unmatchedInstitutes.size > 20) console.log(`  ... and ${unmatchedInstitutes.size - 20} more`);
  }

  console.log('\nFirst 3 prepared documents:');
  docs.slice(0, 3).forEach((d) => console.log(JSON.stringify(d, null, 2)));

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
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
