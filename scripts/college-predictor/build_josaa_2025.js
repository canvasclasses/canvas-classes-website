#!/usr/bin/env node
/**
 * Build JoSAA 2025 cutoff CSV by consolidating the 6 round files published by
 * the community dataset at:
 *   https://github.com/BulkTornado/JoSAA-Rank-Analyser-2025
 *
 * Those files are TAB-delimited (despite the .csv extension) and have no
 * header. Columns in order are:
 *   Institute, Academic Program Name, Quota, Seat Type, Gender,
 *   Opening Rank, Closing Rank
 *
 * This script:
 *   1. Downloads rounds 1..6 (the "_ALL" file, which covers all categories)
 *   2. Converts each row to a proper CSV row
 *   3. Adds Year=2025 and Round=<round> columns (needed by ingest_josaa_csv.js)
 *   4. Writes a single consolidated CSV at data/josaa_2025.csv
 *
 * Run:
 *   node scripts/college-predictor/build_josaa_2025.js
 *
 * Then run the existing ingester (dry-run first):
 *   node scripts/college-predictor/ingest_josaa_csv.js scripts/college-predictor/data/josaa_2025.csv
 *   node scripts/college-predictor/ingest_josaa_csv.js scripts/college-predictor/data/josaa_2025.csv --apply
 *
 * IMPORTANT: The source is a community dataset. Before shipping, spot-check
 * 5–10 rows against the official JoSAA OR-CR PDF to confirm accuracy.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const YEAR = 2025;
const ROUNDS = [1, 2, 3, 4, 5, 6];
const SOURCE_BASE =
  'https://raw.githubusercontent.com/BulkTornado/JoSAA-Rank-Analyser-2025/main';
const OUT_PATH = path.resolve(
  __dirname,
  'data',
  `josaa_${YEAR}.csv`,
);

// ── helpers ────────────────────────────────────────────────────────────────

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return resolve(fetch(res.headers.location));
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      })
      .on('error', reject);
  });
}

// CSV-quote a value: wrap in quotes if it contains a comma, quote, or newline;
// double any internal quotes.
function csvQuote(v) {
  const s = String(v ?? '').trim();
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

// Parse a TSV line. Fields are tab-separated, no quoting expected (JoSAA
// program names contain commas but never tabs).
function parseTsvLine(line) {
  return line.split('\t').map((s) => s.trim());
}

// ── main ───────────────────────────────────────────────────────────────────

(async function main() {
  console.log(`Building consolidated JoSAA ${YEAR} CSV…`);
  console.log(`Source: ${SOURCE_BASE}`);
  console.log(`Target: ${OUT_PATH}`);
  console.log('');

  const header = [
    'Institute',
    'Academic Program Name',
    'Quota',
    'Seat Type',
    'Gender',
    'Opening Rank',
    'Closing Rank',
    'Year',
    'Round',
  ];
  const outLines = [header.join(',')];
  let totalRows = 0;
  const skipped = { malformed: 0, nonNumericRanks: 0 };
  const quotasSeen = new Set();
  const seatTypesSeen = new Set();
  const gendersSeen = new Set();

  for (const round of ROUNDS) {
    const url = `${SOURCE_BASE}/JoSAA_Round_${round}_Result_ALL.csv`;
    process.stdout.write(`  Round ${round}: fetching… `);
    const raw = await fetch(url);
    const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
    process.stdout.write(`${lines.length} rows → parsing\n`);

    for (const line of lines) {
      const cells = parseTsvLine(line);
      if (cells.length !== 7) {
        skipped.malformed++;
        continue;
      }
      const [
        institute,
        program,
        quota,
        seatType,
        gender,
        openingRank,
        closingRank,
      ] = cells;

      // Sanity: ranks must be positive integers. Some JoSAA rows have "P" for
      // preparatory seats — we skip them (the predictor doesn't use prep).
      const op = Number(String(openingRank).replace(/[^\d]/g, ''));
      const cl = Number(String(closingRank).replace(/[^\d]/g, ''));
      if (!Number.isFinite(op) || !Number.isFinite(cl) || op <= 0 || cl <= 0) {
        skipped.nonNumericRanks++;
        continue;
      }

      quotasSeen.add(quota);
      seatTypesSeen.add(seatType);
      gendersSeen.add(gender);

      outLines.push(
        [
          csvQuote(institute),
          csvQuote(program),
          csvQuote(quota),
          csvQuote(seatType),
          csvQuote(gender),
          String(op),
          String(cl),
          String(YEAR),
          String(round),
        ].join(','),
      );
      totalRows++;
    }
  }

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, outLines.join('\n') + '\n', 'utf8');

  console.log('');
  console.log(`✅ Wrote ${totalRows.toLocaleString()} rows to ${OUT_PATH}`);
  console.log(`   Skipped (malformed): ${skipped.malformed}`);
  console.log(`   Skipped (non-numeric ranks, e.g. prep seats): ${skipped.nonNumericRanks}`);
  console.log('');
  console.log('Vocabulary summary (verify these match CollegeCutoff schema):');
  console.log('  Quotas:      ', [...quotasSeen].sort().join(', '));
  console.log('  Seat Types:  ', [...seatTypesSeen].sort().join(', '));
  console.log('  Genders:     ', [...gendersSeen].sort().join(', '));
  console.log('');
  console.log('Next: run the ingester in dry-run mode to verify');
  console.log('  node scripts/college-predictor/ingest_josaa_csv.js scripts/college-predictor/data/josaa_2025.csv');
})().catch((err) => {
  console.error('\nBuilder failed:', err);
  process.exit(1);
});
