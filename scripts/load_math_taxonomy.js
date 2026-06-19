#!/usr/bin/env node
/**
 * load_math_taxonomy.js
 * One-off loader: inserts the math macro (topic) + micro (micro_topic) tags from
 * the founder's "Canvas Maths Tagging [v2]" CSV into taxonomyData_from_csv.ts.
 *
 * Surgical, non-destructive:
 *   - Inserts new topic/micro lines right AFTER each chapter's existing
 *     "General Questions" placeholder topic (placeholder is KEPT so existing
 *     question tags stay valid until the later re-tagging job).
 *   - Touches ONLY the 32 math chapters present in the CSV. Mathematical
 *     Reasoning and every other subject are left byte-identical.
 *   - Applies the agreed cleanups (see FIXES) and merges duplicate micros.
 *
 * Dry-run by default. Pass --apply to write the file.
 * Rollback: git checkout packages/data/taxonomy/taxonomyData_from_csv.ts
 */
const fs = require('fs');
const path = require('path');

const CSV_PATH = '/Users/CanvasClasses/Downloads/Canvas Maths Tagging [v2] - Maths Taxonomy.csv';
const TAX_PATH = path.join(__dirname, '..', 'packages', 'data', 'taxonomy', 'taxonomyData_from_csv.ts');
const APPLY = process.argv.includes('--apply');

// CSV chapter name -> existing taxonomy chapter id (must match exactly; assert below)
const CHAP_ID = {
  'Complex Number': 'ma_complex',
  'Continuity and Differentiability': 'ma_continuity_diff',
  'Functions': 'ma_functions',
  'Definite Integration': 'ma_def_int',
  'Matrices': 'ma_matrices',
  'Determinants': 'ma_determinants',
  'Indefinite Integration': 'ma_indef_int',
  'Differentiation': 'ma_differentiation',
  'Limits': 'ma_limits',
  'Application of Derivatives': 'ma_aod',
  'Area Under Curves': 'ma_auc',
  'Quadratic Equation': 'ma_quadratic',
  'Differential Equation': 'ma_diff_eq',
  'Three Dimensional Geometry': 'ma_3d_geom',
  'Sequences and Series': 'ma_sequence',
  'Basic of Mathematics': 'ma_basic_math',
  'Probability': 'ma_probability',
  'Inverse Trigonometric Functions': 'ma_itf',
  'Properties of Triangles': 'ma_triangle_prop',
  'Trigonometric Equations': 'ma_trig_eq',
  'Trigonometric Ratios & Identities': 'ma_trig_ratios',
  'Binomial Theorem': 'ma_binomial',
  'Heights and Distances': 'ma_height_dist',
  'Vector Algebra': 'ma_vector_algebra',
  'Statistics': 'ma_statistics',
  'Sets and Relations': 'ma_sets_rel',
  'Straight Lines': 'ma_straight_lines',
  'Circle': 'ma_circle',
  'Ellipse': 'ma_ellipse',
  'Parabola': 'ma_parabola',
  'Hyperbola': 'ma_hyperbola',
  'Permutation Combination': 'ma_pnc',
};

// Agreed cleanups. Returns [macro, micro] after corrections.
function applyFixes(chapter, macro, micro) {
  if (chapter === 'Hyperbola') {
    if (macro === 'Tangent of Ellipse') macro = 'Tangent of Hyperbola';
    if (macro === 'Normal of Ellipse') macro = 'Normal of Hyperbola';
    if (micro === 'Intersection of ellipse and other curves') micro = 'Intersection of hyperbola and other curves';
    if (micro === 'Fundamental Definition SP + SQ = 2a') micro = 'Fundamental Definition |SP − SQ| = 2a';
  }
  const microTypos = {
    'Aixed properties of triangle': 'Mixed properties of triangle',
    'mixed probkems': 'mixed problems',
    'Matrix Multiplication without Trignometry': 'Matrix Multiplication without Trigonometry',
    'Matrix Multiplication with Trignometry': 'Matrix Multiplication with Trigonometry',
    'Area of curve involving trigometric functions': 'Area of curve involving trigonometric functions',
    'Area of curve involving exponential and logarithimic function': 'Area of curve involving exponential and logarithmic function',
  };
  if (microTypos[micro]) micro = microTypos[micro];
  if (micro.includes('dervied')) micro = micro.replace('dervied', 'derived');
  return [macro, micro];
}

// Minimal RFC-4180-ish CSV parser (handles quotes, escaped quotes, embedded commas/newlines)
function parseCSV(text) {
  const rows = []; let row = []; let field = ''; let inQ = false; let i = 0;
  while (i < text.length) {
    const c = text[i];
    if (inQ) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i += 2; continue; } inQ = false; i++; continue; }
      field += c; i++; continue;
    }
    if (c === '"') { inQ = true; i++; continue; }
    if (c === ',') { row.push(field); field = ''; i++; continue; }
    if (c === '\r') { i++; continue; }
    if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; i++; continue; }
    field += c; i++;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

// ---- Build structure from CSV ----
const csvText = fs.readFileSync(CSV_PATH, 'utf8');
const rows = parseCSV(csvText);
const header = rows.shift();
if (header[1].trim() !== 'Chapter' || header[2].trim() !== 'Macro Concept' || header[3].trim() !== 'Micro Concept') {
  throw new Error('Unexpected CSV header: ' + JSON.stringify(header));
}

// chapter -> Map(macro -> [micros, deduped in order])
const data = new Map();
let rawRows = 0;
for (const r of rows) {
  if (r.length < 4) continue;
  const chapter = (r[1] || '').trim();
  let macro = (r[2] || '').trim();
  let micro = (r[3] || '').trim();
  if (!chapter || !macro || !micro) continue;
  rawRows++;
  [macro, micro] = applyFixes(chapter, macro, micro);
  if (!CHAP_ID[chapter]) throw new Error('CSV chapter not mapped to a taxonomy id: ' + JSON.stringify(chapter));
  if (!data.has(chapter)) data.set(chapter, new Map());
  const macros = data.get(chapter);
  if (!macros.has(macro)) macros.set(macro, []);
  const arr = macros.get(macro);
  if (!arr.includes(micro)) arr.push(micro); // merge exact-duplicate micros
}

// ---- Generate node lines, insert after each chapter's placeholder ----
const escapeStr = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const nodeLine = (id, name, parent, type) =>
  `    { id: '${id}', name: '${escapeStr(name)}', parent_id: '${parent}', type: '${type}' },`;

let fileLines = fs.readFileSync(TAX_PATH, 'utf8').split('\n');
let grandTopics = 0, grandMicros = 0;
const perChapter = [];
let sampleBlock = null;

for (const [chapter, macros] of data) {
  const chapId = CHAP_ID[chapter];
  const placeholderRe = new RegExp(`id: 'tag_${chapId}', name: 'General Questions', parent_id: '${chapId}'`);
  const idx = fileLines.findIndex((l) => placeholderRe.test(l));
  if (idx < 0) throw new Error(`Placeholder 'General Questions' not found for ${chapId}`);

  const newLines = [];
  let ti = 0, chMicros = 0;
  for (const [macro, micros] of macros) {
    ti++;
    const topicId = `tag_${chapId}_${ti}`;
    newLines.push(nodeLine(topicId, macro, chapId, 'topic'));
    let mj = 0;
    for (const micro of micros) {
      mj++;
      newLines.push(nodeLine(`micro_${chapId}_${ti}_${mj}`, micro, topicId, 'micro_topic'));
    }
    chMicros += micros.length;
  }
  grandTopics += ti; grandMicros += chMicros;
  perChapter.push({ chapter, chapId, macros: ti, micros: chMicros });
  if (chapter === 'Complex Number') sampleBlock = newLines.slice(0, 8);

  fileLines.splice(idx + 1, 0, ...newLines);
}

// ---- Update footer summary counts if present ----
const bump = (re, add) => {
  const i = fileLines.findIndex((l) => re.test(l));
  if (i >= 0) {
    const cur = parseInt(fileLines[i].replace(/[^0-9]/g, ''), 10) || 0;
    fileLines[i] = fileLines[i].replace(/\d+/, String(cur + add));
  }
};
bump(/\/\/ Total Tags:/, grandTopics);
bump(/\/\/ Total Micro Topics:/, grandMicros);

// ---- Report ----
console.log(`\nCSV rows processed: ${rawRows}`);
console.log(`Chapters touched:   ${perChapter.length} (Mathematical Reasoning + all other subjects untouched)`);
console.log(`Macro tags to add:  ${grandTopics}`);
console.log(`Micro tags to add:  ${grandMicros}  (after merging duplicates)`);
console.log(`\nPer-chapter:`);
for (const p of perChapter) console.log(`  ${p.chapId.padEnd(20)} +${String(p.macros).padStart(2)} macros, +${String(p.micros).padStart(3)} micros   ${p.chapter}`);
console.log(`\nSample (Complex Number, first 8 inserted lines):`);
for (const l of sampleBlock) console.log(l);

if (APPLY) {
  fs.writeFileSync(TAX_PATH, fileLines.join('\n'), 'utf8');
  console.log(`\n✅ APPLIED. Wrote ${TAX_PATH}`);
  console.log(`   Rollback: git checkout packages/data/taxonomy/taxonomyData_from_csv.ts`);
} else {
  console.log(`\n(DRY RUN — no file written. Re-run with --apply to write.)`);
}
