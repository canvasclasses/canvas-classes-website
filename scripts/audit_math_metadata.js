// READ-ONLY audit of math-chapter metadata across questions_v2.
// Scans every doc with metadata.chapter_id starting with `ma_` and reports
// schema-canonical violations. Does NOT write to the DB.
//
// Usage:  node scripts/audit_math_metadata.js
//
// Exit codes: 0 = clean, 1 = defects found.

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// ─── Canonical reference data ─────────────────────────────────────────────

// Math prefixes from scripts/insert_questions.js — single source of truth.
const PREFIX_TO_CHAPTER = {
  BOMA: 'ma_basic_math', QUAD: 'ma_quadratic', CMPL: 'ma_complex',
  SQSR: 'ma_sequence', PMCM: 'ma_pnc', BNML: 'ma_binomial',
  MRES: 'ma_reasoning', STAT: 'ma_statistics', MTRX: 'ma_matrices',
  DTRM: 'ma_determinants', PROB: 'ma_probability', STRL: 'ma_sets_rel',
  FUNC: 'ma_functions', LIMS: 'ma_limits', CTDF: 'ma_continuity_diff',
  DIFF: 'ma_differentiation', AODV: 'ma_aod', ININ: 'ma_indef_int',
  DFIN: 'ma_def_int', AUC: 'ma_auc', DFEQ: 'ma_diff_eq',
  STLN: 'ma_straight_lines', CRCL: 'ma_circle', PRBL: 'ma_parabola',
  ELPS: 'ma_ellipse', HYPB: 'ma_hyperbola', TRRI: 'ma_trig_ratios',
  TREQ: 'ma_trig_eq', ITF: 'ma_itf', HTDT: 'ma_height_dist',
  PRTR: 'ma_triangle_prop', VCAL: 'ma_vector_algebra', TDGM: 'ma_3d_geom',
};
const VALID_MATH_CHAPTERS = new Set(Object.values(PREFIX_TO_CHAPTER));

// Pull valid tag ids out of taxonomyData_from_csv.ts by simple regex.
function loadValidTagIds() {
  const taxonomyPath = path.resolve('packages/data/taxonomy/taxonomyData_from_csv.ts');
  const src = fs.readFileSync(taxonomyPath, 'utf8');
  const ids = new Set();
  const re = /id:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(src)) !== null) ids.add(m[1]);
  return ids;
}
const VALID_TAG_IDS = loadValidTagIds();

const CANONICAL_EXAMS = new Set(['JEE_Main', 'JEE_Advanced', 'NEET_UG', 'NEET_PG']);
const CANONICAL_SHIFTS = new Set(['Shift-I', 'Shift-II']);
const CANONICAL_MONTHS = new Set([
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]);
const CANONICAL_APPLICABLE = new Set(['JEE', 'NEET', 'CBSE', 'BITSAT']);
const CANONICAL_SOURCE_TYPES = new Set(['PYQ', 'Practice', 'NCERT_Textbook', 'NCERT_Exemplar', 'Mock']);
const CHOICE_TYPES = new Set(['SCQ', 'MCQ', 'AR', 'MST', 'MTC']);

// ─── Check definitions ────────────────────────────────────────────────────
// Each returns null on pass, or a short defect string.

const CHECKS = {
  display_id_format(d) {
    return /^[A-Z]+-\d{3,4}$/.test(d.display_id) ? null : `bad display_id "${d.display_id}"`;
  },
  prefix_chapter_alignment(d) {
    const prefix = d.display_id.split('-')[0];
    const expected = PREFIX_TO_CHAPTER[prefix];
    if (!expected) return `unknown prefix "${prefix}"`;
    if (d.metadata?.chapter_id !== expected) {
      return `prefix ${prefix} expects chapter_id ${expected}, got ${d.metadata?.chapter_id}`;
    }
    return null;
  },
  subject_is_maths(d) {
    return d.metadata?.subject === 'maths' ? null : `subject "${d.metadata?.subject}" (expected "maths")`;
  },
  tag_resolves(d) {
    const tags = d.metadata?.tags || [];
    if (tags.length === 0) return 'no tags';
    for (const t of tags) {
      if (!VALID_TAG_IDS.has(t.tag_id)) return `tag_id "${t.tag_id}" not in taxonomy`;
    }
    return null;
  },
  applicable_exams(d) {
    const ae = d.metadata?.applicableExams;
    if (!Array.isArray(ae) || ae.length === 0) return 'applicableExams missing/empty';
    for (const v of ae) {
      if (!CANONICAL_APPLICABLE.has(v)) return `applicableExams contains "${v}"`;
    }
    // Math is JEE-only territory.
    if (ae.length === 1 && ae[0] !== 'JEE') return `non-JEE math: applicableExams=${JSON.stringify(ae)}`;
    return null;
  },
  source_type(d) {
    const st = d.metadata?.sourceType;
    if (!CANONICAL_SOURCE_TYPES.has(st)) return `sourceType "${st}" not canonical`;
    return null;
  },
  exam_details_shape(d) {
    const st = d.metadata?.sourceType;
    const ed = d.metadata?.examDetails;
    // Non-PYQ must have null examDetails.
    if (st !== 'PYQ') {
      if (ed != null) return `non-PYQ should have examDetails=null, got ${JSON.stringify(ed)}`;
      return null;
    }
    // PYQ branch — must have canonical exam + year, and per-exam shape.
    if (!ed) return 'PYQ missing examDetails';
    if (!CANONICAL_EXAMS.has(ed.exam)) return `examDetails.exam "${ed.exam}" not canonical`;
    if (typeof ed.year !== 'number' || ed.year < 2000 || ed.year > 2030) {
      return `examDetails.year missing or out of range: ${ed.year}`;
    }
    if (ed.exam === 'JEE_Main') {
      if (!CANONICAL_MONTHS.has(ed.month)) return `JEE_Main month "${ed.month}" not canonical`;
      if (!CANONICAL_SHIFTS.has(ed.shift)) return `JEE_Main shift "${ed.shift}" not canonical`;
      if (ed.paper != null) return `JEE_Main has paper field (should be absent/null)`;
    } else if (ed.exam === 'JEE_Advanced') {
      if (ed.month != null) return `JEE_Advanced month should be null, got "${ed.month}"`;
      if (ed.shift != null) return `JEE_Advanced shift should be null, got "${ed.shift}"`;
      if (!ed.paper || !/^Paper [12]$/.test(ed.paper)) return `JEE_Advanced paper "${ed.paper}" not canonical`;
    } else if (ed.exam === 'NEET_UG') {
      // Math should never be NEET — flag separately as a sanity check.
      return `math doc tagged as NEET_UG PYQ — unexpected`;
    }
    return null;
  },
  no_legacy_fields(d) {
    const m = d.metadata || {};
    if ('is_pyq' in m) return 'legacy is_pyq present';
    if ('examBoard' in m) return 'legacy examBoard present';
    if ('exam_source' in m) return 'legacy exam_source present';
    if (typeof m.difficulty === 'string') return `legacy difficulty enum "${m.difficulty}"`;
    return null;
  },
  status_published(d) {
    if (d.status !== 'published') return `status "${d.status}" (expected "published")`;
    if (d.deleted_at != null) return `deleted_at not null: ${d.deleted_at}`;
    if (!d.version || d.version < 1) return `version "${d.version}"`;
    return null;
  },
  difficulty_level(d) {
    const dl = d.metadata?.difficultyLevel;
    if (!Number.isInteger(dl) || dl < 1 || dl > 5) return `difficultyLevel "${dl}" not 1–5`;
    return null;
  },
  question_nature(d) {
    const qn = d.metadata?.questionNature;
    const allowed = ['Recall', 'Rule_Application', 'Numerical', 'Comparative', 'Graphical', 'Conceptual'];
    if (!allowed.includes(qn)) return `questionNature "${qn}" not in math-allowed set`;
    return null;
  },
  answer_present(d) {
    if (CHOICE_TYPES.has(d.type)) {
      const opts = d.options || [];
      if (opts.length !== 4) return `${d.type} has ${opts.length} options (expected 4)`;
      const correctCount = opts.filter(o => o.is_correct).length;
      if (d.type === 'SCQ' || d.type === 'AR' || d.type === 'MST') {
        if (correctCount !== 1) return `${d.type} has ${correctCount} correct options (expected 1)`;
      } else if (d.type === 'MCQ') {
        if (correctCount < 2) return `MCQ has ${correctCount} correct options (expected ≥2)`;
      }
      if (!d.answer?.correct_option && !d.answer?.correct_options) return 'answer.correct_option(s) missing';
    } else if (d.type === 'NVT') {
      const a = d.answer || {};
      if (a.integer_value == null && a.decimal_value == null) return 'NVT answer missing';
      if ((d.options || []).length !== 0) return 'NVT has non-empty options';
    } else {
      return `unknown type "${d.type}"`;
    }
    return null;
  },
};

// ─── Main ─────────────────────────────────────────────────────────────────

(async () => {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI not set — check .env.local');
    process.exit(2);
  }
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');

  const docs = await col.find({
    'metadata.chapter_id': { $regex: '^ma_' },
    deleted_at: null,
  }).project({
    display_id: 1, type: 1, options: 1, answer: 1, metadata: 1,
    status: 1, deleted_at: 1, version: 1,
  }).toArray();

  console.log(`\nScanning ${docs.length} math docs across ${VALID_MATH_CHAPTERS.size} chapters…\n`);

  // Per-chapter buckets.
  const chapterStats = {};
  for (const ch of VALID_MATH_CHAPTERS) chapterStats[ch] = { total: 0, defectCount: 0, byCheck: {} };
  // Global per-check totals.
  const globalByCheck = Object.fromEntries(Object.keys(CHECKS).map(k => [k, 0]));
  // Worst offenders for inline listing (cap per check).
  const offenders = Object.fromEntries(Object.keys(CHECKS).map(k => [k, []]));
  const OFFENDER_CAP = 10;

  for (const d of docs) {
    const ch = d.metadata?.chapter_id || 'unknown';
    if (!chapterStats[ch]) chapterStats[ch] = { total: 0, defectCount: 0, byCheck: {} };
    chapterStats[ch].total += 1;

    let hadDefect = false;
    for (const [name, fn] of Object.entries(CHECKS)) {
      const msg = fn(d);
      if (msg) {
        hadDefect = true;
        globalByCheck[name] += 1;
        chapterStats[ch].byCheck[name] = (chapterStats[ch].byCheck[name] || 0) + 1;
        if (offenders[name].length < OFFENDER_CAP) {
          offenders[name].push(`${d.display_id} — ${msg}`);
        }
      }
    }
    if (hadDefect) chapterStats[ch].defectCount += 1;
  }

  // ─── Report ───
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('Per-chapter totals (chapter → total / docs-with-defects):');
  console.log('═══════════════════════════════════════════════════════════════');
  const rows = Object.entries(chapterStats)
    .filter(([, s]) => s.total > 0)
    .sort((a, b) => a[0].localeCompare(b[0]));
  for (const [ch, s] of rows) {
    const flag = s.defectCount === 0 ? '✅' : '⚠️ ';
    const breakdown = Object.entries(s.byCheck).map(([k, v]) => `${k}=${v}`).join(', ');
    console.log(`${flag} ${ch.padEnd(28)} ${String(s.total).padStart(4)} docs  | defects: ${s.defectCount}${breakdown ? ' (' + breakdown + ')' : ''}`);
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('Global per-check totals:');
  console.log('═══════════════════════════════════════════════════════════════');
  for (const [name, count] of Object.entries(globalByCheck)) {
    const flag = count === 0 ? '✅' : '⚠️ ';
    console.log(`${flag} ${name.padEnd(28)}: ${count}`);
  }

  const anyDefect = Object.values(globalByCheck).some(v => v > 0);

  if (anyDefect) {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log(`Offender samples (first ${OFFENDER_CAP} per check):`);
    console.log('═══════════════════════════════════════════════════════════════');
    for (const [name, list] of Object.entries(offenders)) {
      if (list.length === 0) continue;
      console.log(`\n• ${name}:`);
      for (const line of list) console.log(`    ${line}`);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log(anyDefect ? '⚠️  Defects found — see above.' : '✅ All math docs pass mechanical audit.');
  console.log('═══════════════════════════════════════════════════════════════\n');

  await client.close();
  process.exit(anyDefect ? 1 : 0);
})();
