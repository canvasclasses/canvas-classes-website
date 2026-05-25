#!/usr/bin/env node
// ============================================================================
// BITSAT cutoff scraper.
//
// Fetches https://www.bitsadmission.com/FD/BITSAT_cutOffs.html — the single page
// embeds ALL 9 academic years (2017-18 through 2025-26) in hidden <div id="YYYY-YYYY">
// blocks. One HTTP request returns the full historical dataset.
//
// The page uses TWO inconsistent table formats across years:
//
//   Format A (2017-18, 2018-19, 2019-20): three SEPARATE tables per year,
//     one per campus, each preceded by a heading
//     "Degree programme at <Campus> Campus".
//     Columns: <Programme> | <Cut-off score> | <Max marks>
//
//   Format B (2020-21 onward): ONE combined table per year,
//     columns: <Campus> | <Programme> | <Cut-off score> | <Max marks>
//
// The scraper detects format per <div id="YYYY-YYYY"> and normalizes both into
// a single row shape: { year, campus, programme, cutoff_score, max_score }.
//
// Output:
//   scripts/college-predictor/bitsat/data/bitsat_cutoffs.json
//   scripts/college-predictor/bitsat/data/bitsat_cutoffs.csv
//
// Usage:
//   node scripts/college-predictor/bitsat/fetch_bitsat_cutoffs.js
//   node scripts/college-predictor/bitsat/fetch_bitsat_cutoffs.js --cache /tmp/bits.html
// ============================================================================

const fs = require('node:fs');
const path = require('node:path');

const SOURCE_URL = 'https://www.bitsadmission.com/FD/BITSAT_cutOffs.html';
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Crucible-CollegePredictor/1.0';

const YEAR_DIVS = [
  '2017-2018',
  '2018-2019',
  '2019-2020',
  '2020-2021',
  '2021-2022',
  '2022-2023',
  '2023-2024',
  '2024-2025',
  '2025-2026',
];

const CAMPUSES = ['Pilani', 'Goa', 'Hyderabad'];

// Campus name variants seen across years. "K K Birla Goa" (2024-25, 2025-26),
// plain "Goa" (older), etc. all collapse to a single canonical campus.
const CAMPUS_ALIASES = [
  { canonical: 'Pilani',   matches: [/^pilani\b/i] },
  { canonical: 'Goa',      matches: [/^goa\b/i, /^k\.?\s*k\.?\s*birla\s+goa\b/i, /\bbirla\s+goa\b/i] },
  { canonical: 'Hyderabad', matches: [/^hyderabad\b/i, /^hyd\b/i] },
];

function matchCampusAlias(raw) {
  const s = raw.trim();
  for (const a of CAMPUS_ALIASES) {
    if (a.matches.some((rx) => rx.test(s))) return a.canonical;
  }
  return null;
}

// ── Programme canonicalization ───────────────────────────────────────────────
// Pre-Phase 4 of BITS programmes used inconsistent punctuation: "B.Pharm." in
// older years became "B. Pharm" later. Same for "B.E. Electrical & Electronics"
// vs "B.E. Electrical and Electronics". We collapse every variant into one
// stable programme_code so the predictor can build a single time-series.
//
// programme_code is the predictor's join key — never display this directly.
// programme_name is the canonical display string (the modern BITS rendering).
const PROGRAMME_CATALOG = [
  // B.E. (4-year engineering)
  { code: 'BE-CHE',  name: 'B.E. Chemical',                              degree: 'BE',   matches: [/^b\.?e\.?\s*chemical\b/i] },
  { code: 'BE-CIV',  name: 'B.E. Civil',                                 degree: 'BE',   matches: [/^b\.?e\.?\s*civil\b/i] },
  { code: 'BE-CSE',  name: 'B.E. Computer Science',                      degree: 'BE',   matches: [/^b\.?e\.?\s*computer\s+science\b/i] },
  { code: 'BE-EEE',  name: 'B.E. Electrical & Electronics',              degree: 'BE',   matches: [/^b\.?e\.?\s*electrical\s*(?:&|and)\s*electronics\b/i] },
  { code: 'BE-ECE',  name: 'B.E. Electronics & Communication',           degree: 'BE',   matches: [/^b\.?e\.?\s*electronics\s*(?:&|and)\s*communication\b/i] },
  { code: 'BE-EIE',  name: 'B.E. Electronics & Instrumentation',         degree: 'BE',   matches: [/^b\.?e\.?\s*electronics\s*(?:&|and)\s*instrumentation\b/i] },
  { code: 'BE-ECMP', name: 'B.E. Electronics and Computer',              degree: 'BE',   matches: [/^b\.?e\.?\s*electronics\s+and\s+computer\b/i] },
  { code: 'BE-MECH', name: 'B.E. Mechanical',                            degree: 'BE',   matches: [/^b\.?e\.?\s*mechanical\b/i] },
  { code: 'BE-MANF', name: 'B.E. Manufacturing',                         degree: 'BE',   matches: [/^b\.?e\.?\s*manufacturing\b/i] },
  { code: 'BE-MNC',  name: 'B.E. Mathematics and Computing',             degree: 'BE',   matches: [/^b\.?e\.?\s*mathematics\s+and\s+computing\b/i] },
  { code: 'BE-ENV',  name: 'B.E. Environmental and Sustainability',      degree: 'BE',   matches: [/^b\.?e\.?\s*environmental\s+and\s+sustainability\b/i] },

  // M.Sc. (4-year integrated science)
  { code: 'MSC-BIO',  name: 'M.Sc. Biological Sciences',                 degree: 'MSC',  matches: [/^m\.?sc\.?\s*biological\s+sciences\b/i, /^m\.?sc\.?\s*biology\b/i] },
  { code: 'MSC-CHEM', name: 'M.Sc. Chemistry',                           degree: 'MSC',  matches: [/^m\.?sc\.?\s*chemistry\b/i] },
  { code: 'MSC-ECON', name: 'M.Sc. Economics',                           degree: 'MSC',  matches: [/^m\.?sc\.?\s*economics\b/i] },
  { code: 'MSC-MATH', name: 'M.Sc. Mathematics',                         degree: 'MSC',  matches: [/^m\.?sc\.?\s*mathematics\b/i] },
  { code: 'MSC-PHYS', name: 'M.Sc. Physics',                             degree: 'MSC',  matches: [/^m\.?sc\.?\s*physics\b/i] },
  { code: 'MSC-SEMI', name: 'M.Sc. Semiconductor and Nanoscience',       degree: 'MSC',  matches: [/^m\.?sc\.?\s*semiconductor\s+and\s+nanoscience\b/i] },
  { code: 'MSC-GEN',  name: 'M.Sc. (Tech.) General Studies',             degree: 'MSC',  matches: [/^m\.?sc\.?\s*\(?tech\.?\)?\s*general\s+studies\b/i] },

  // B.Pharm.
  { code: 'BPHARM',  name: 'B. Pharm.',                                  degree: 'BPHARM', matches: [/^b\.?\s*pharm\b/i] },
];

function matchProgramme(raw) {
  const s = raw.trim();
  for (const p of PROGRAMME_CATALOG) {
    if (p.matches.some((rx) => rx.test(s))) {
      return { code: p.code, name: p.name, degree: p.degree };
    }
  }
  return null;
}

// ── HTML helpers ─────────────────────────────────────────────────────────────
function stripTags(s) {
  return s
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

// Extract the inner HTML of <div id="YYYY-YYYY"> up to (but not including) the
// next sibling <div id="YYYY-YYYY">. Last div runs until end-of-document.
function extractYearBlocks(html) {
  const blocks = {};
  const re = /<div\s+id="(\d{4}-\d{4})"[^>]*>/gi;
  const matches = [];
  let m;
  while ((m = re.exec(html)) !== null) matches.push({ year: m[1], start: m.index + m[0].length });
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].start;
    const end = i + 1 < matches.length ? matches[i + 1].start - matches[i + 1][0]?.length || matches[i + 1].start : html.length;
    // Simpler: end = start of next match minus header length, but we recorded start AFTER the opening tag.
    const nextStart = i + 1 < matches.length
      ? html.lastIndexOf('<div', matches[i + 1].start) // step back to the opening of the next div
      : html.length;
    blocks[matches[i].year] = html.slice(start, nextStart);
  }
  return blocks;
}

// Parse all <tr>…</tr> rows out of a block.
function extractRows(blockHtml) {
  const rows = [];
  const rowRe = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
  let m;
  while ((m = rowRe.exec(blockHtml)) !== null) {
    const inner = m[1];
    const cells = [];
    const cellRe = /<td\b[^>]*>([\s\S]*?)<\/td>/gi;
    let c;
    while ((c = cellRe.exec(inner)) !== null) cells.push(stripTags(c[1]));
    if (cells.length > 0) rows.push({ cells, raw: m[0] });
  }
  return rows;
}

// Locate "Degree programme at <Campus> Campus" headers within a year block.
// Returns an array of { campus, offset } sorted by appearance.
function findCampusHeadings(blockHtml) {
  const headings = [];
  for (const campus of CAMPUSES) {
    const re = new RegExp(`Degree\\s+programme\\s+at\\s+${campus}\\s+Campus`, 'gi');
    let m;
    while ((m = re.exec(blockHtml)) !== null) headings.push({ campus, offset: m.index });
  }
  headings.sort((a, b) => a.offset - b.offset);
  return headings;
}

// Cells like "B.E. Computer Science" — keep wording, only fix whitespace.
// Preserve the space after the degree abbreviation; collapse runs of spaces.
function normalizeProgrammeName(raw) {
  return raw
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim()
    // Collapse trailing "..." into a single period.
    .replace(/\.+$/, '.')
    // Trim leading list punctuation.
    .replace(/^\s*[-—:]\s*/, '');
}

// Strict numeric parse — score cells are pure integers; reject empty/N.A.
function parseScore(raw) {
  const cleaned = raw.replace(/[^\d.]/g, '');
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) && n > 0 ? n : null;
}

// Decide if a row is a header row (e.g. "Campus", "Programme", "Cut-off ...")
function isHeaderRow(cells) {
  const joined = cells.join(' ').toLowerCase();
  return /campus|programme|cut[- ]?off|maximum marks|bitsat/i.test(joined) && !/\d{2,}/.test(joined);
}

// Format-B row recognizer: 4 cells, cell[0] is a campus name, cell[2] & cell[3] are numbers.
function tryParseFormatBRow(cells) {
  if (cells.length < 4) return null;
  const canonical = matchCampusAlias(cells[0]);
  if (!canonical) return null;
  const rawProgramme = normalizeProgrammeName(cells[1]);
  const match = matchProgramme(rawProgramme);
  const cutoff = parseScore(cells[2]);
  const max = parseScore(cells[3]);
  if (!match || cutoff == null || max == null) return null;
  return {
    campus: canonical,
    programme_code: match.code,
    programme_name: match.name,
    degree_type: match.degree,
    programme_raw: rawProgramme,
    cutoff_score: cutoff,
    max_score: max,
  };
}

// Format-A row recognizer: 3 cells, cell[0] is a programme name, cells[1] & [2] are numbers.
function tryParseFormatARow(cells) {
  if (cells.length < 3) return null;
  const rawProgramme = normalizeProgrammeName(cells[0]);
  const match = matchProgramme(rawProgramme);
  const cutoff = parseScore(cells[1]);
  const max = parseScore(cells[2]);
  if (!match || cutoff == null || max == null) return null;
  return {
    programme_code: match.code,
    programme_name: match.name,
    degree_type: match.degree,
    programme_raw: rawProgramme,
    cutoff_score: cutoff,
    max_score: max,
  };
}

// Determine the campus for a Format-A row by finding the closest preceding
// "Degree programme at X Campus" heading in the block.
function campusForOffset(headings, offset) {
  let current = null;
  for (const h of headings) {
    if (h.offset <= offset) current = h.campus;
    else break;
  }
  return current;
}

function parseYearBlock(year, blockHtml) {
  const headings = findCampusHeadings(blockHtml);
  const rows = [];

  // Iterate rows AND track each row's offset in the block so Format-A can
  // attribute each row to the preceding campus heading.
  const rowRe = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
  let m;
  while ((m = rowRe.exec(blockHtml)) !== null) {
    const offset = m.index;
    const inner = m[1];
    const cells = [];
    const cellRe = /<td\b[^>]*>([\s\S]*?)<\/td>/gi;
    let c;
    while ((c = cellRe.exec(inner)) !== null) cells.push(stripTags(c[1]));
    if (cells.length === 0 || isHeaderRow(cells)) continue;

    // Prefer Format B if the leading cell names a campus.
    const fb = tryParseFormatBRow(cells);
    if (fb) {
      rows.push({ year, ...fb });
      continue;
    }

    // Otherwise try Format A and attach a campus from the heading map.
    const fa = tryParseFormatARow(cells);
    if (fa) {
      const campus = campusForOffset(headings, offset);
      if (campus) rows.push({ year, campus, ...fa });
    }
  }

  return rows;
}

async function fetchSource(cachePath) {
  if (cachePath && fs.existsSync(cachePath)) {
    return fs.readFileSync(cachePath, 'utf8');
  }
  const res = await fetch(SOURCE_URL, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'text/html' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${SOURCE_URL}`);
  const html = await res.text();
  if (cachePath) fs.writeFileSync(cachePath, html);
  return html;
}

// Academic year string "2024-2025" → integer 2024 (admission year).
function academicYearStart(yearStr) {
  return Number(yearStr.split('-')[0]);
}

function toCSV(rows) {
  const header = 'year,campus,programme_code,programme_name,degree_type,cutoff_score,max_score';
  const lines = rows.map((r) => {
    const name = `"${r.programme_name.replace(/"/g, '""')}"`;
    return `${r.year},${r.campus},${r.programme_code},${name},${r.degree_type},${r.cutoff_score},${r.max_score}`;
  });
  return [header, ...lines].join('\n') + '\n';
}

async function main() {
  const cacheArg = process.argv.findIndex((a) => a === '--cache');
  const cachePath = cacheArg >= 0 ? process.argv[cacheArg + 1] : null;

  console.log(`Fetching ${SOURCE_URL} …`);
  const html = await fetchSource(cachePath);
  console.log(`Got ${html.length.toLocaleString()} bytes.`);

  const blocks = extractYearBlocks(html);
  const foundYears = Object.keys(blocks).sort();
  console.log(`Detected year blocks: ${foundYears.join(', ')}`);

  const missing = YEAR_DIVS.filter((y) => !blocks[y]);
  if (missing.length > 0) {
    console.warn(`⚠ Missing year divs: ${missing.join(', ')}`);
  }

  const allRows = [];
  for (const yearStr of YEAR_DIVS) {
    const block = blocks[yearStr];
    if (!block) continue;
    const yearStart = academicYearStart(yearStr);
    const rows = parseYearBlock(yearStart, block);
    const perCampus = rows.reduce((acc, r) => {
      acc[r.campus] = (acc[r.campus] || 0) + 1;
      return acc;
    }, {});
    console.log(
      `  AY ${yearStr} (start=${yearStart}): ${rows.length} rows ` +
        `(${Object.entries(perCampus).map(([k, v]) => `${k}:${v}`).join(' ')})`,
    );
    allRows.push(...rows);
  }

  // Per-row deduplication on (year, campus, programme_code). Last write wins.
  const dedup = new Map();
  for (const r of allRows) {
    const key = `${r.year}::${r.campus}::${r.programme_code}`;
    if (dedup.has(key)) {
      const prev = dedup.get(key);
      if (prev.cutoff_score !== r.cutoff_score) {
        console.warn(
          `⚠ Conflicting cutoff for ${key}: ${prev.cutoff_score} (raw="${prev.programme_raw}") vs ${r.cutoff_score} (raw="${r.programme_raw}")`,
        );
      }
    }
    dedup.set(key, r);
  }
  const final = [...dedup.values()].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    if (a.campus !== b.campus) return a.campus.localeCompare(b.campus);
    return a.programme_code.localeCompare(b.programme_code);
  });

  console.log(`\nTotal unique rows: ${final.length}`);

  // Sanity: every year should have data from all three campuses (with the known
  // exception that some early years lacked ECE at Pilani — but each campus
  // should have at least ~10 programmes).
  const byYearCampus = {};
  for (const r of final) {
    const k = `${r.year}::${r.campus}`;
    byYearCampus[k] = (byYearCampus[k] || 0) + 1;
  }
  console.log('\nPer (year, campus) row counts:');
  for (const k of Object.keys(byYearCampus).sort()) {
    console.log(`  ${k}: ${byYearCampus[k]}`);
  }

  const outDir = path.join(__dirname, 'data');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const jsonPath = path.join(outDir, 'bitsat_cutoffs.json');
  fs.writeFileSync(jsonPath, JSON.stringify(final, null, 2));
  console.log(`\n✓ Wrote ${jsonPath}`);

  const csvPath = path.join(outDir, 'bitsat_cutoffs.csv');
  fs.writeFileSync(csvPath, toCSV(final));
  console.log(`✓ Wrote ${csvPath}`);
}

main().catch((err) => {
  console.error('Scraper failed:', err);
  process.exit(1);
});
