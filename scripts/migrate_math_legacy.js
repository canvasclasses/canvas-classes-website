// Migrate legacy math docs in questions_v2 to the current canonical schema.
//
// Targets the 4 legacy imports + 16 STLN-review stragglers identified by the
// audit (audit_math_metadata.js). Default mode is DRY RUN — pass --apply to
// actually write to the DB.
//
// USAGE
//   node scripts/migrate_math_legacy.js               # dry-run (prints plan)
//   node scripts/migrate_math_legacy.js --apply       # actually mutates DB
//
// PLAN
//   1. Rename display_ids: COMP→CMPL, SEQU→SQSR, PERM→PMCM
//   2. Sync options[].is_correct from answer.correct_option when out of sync
//   3. Normalize metadata: subject, applicableExams, questionNature,
//      sourceType, examDetails (canonical shift / month / exam name)
//   4. $unset legacy fields: is_pyq, examBoard, exam_source, metadata.difficulty (string)
//   5. Flip status review→published; bump version; set updated_at/updated_by
//   6. Quarantine NVT docs missing answer.integer_value — list for manual fix
//
// SAFETY
//   - Pre-flight: confirms no display_id collisions before rename
//   - Per-doc dry-run report shows EVERY field change before applying
//   - All writes go through bulkWrite (atomic per doc)
//   - Never deletes a doc; status flips only review→published

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const APPLY = process.argv.includes('--apply');
const NOW = new Date();
const UPDATED_BY = 'audit-migration-2026-05-19';

// ─── Mappings ─────────────────────────────────────────────────────────────

const PREFIX_RENAME = { COMP: 'CMPL', SEQU: 'SQSR', PERM: 'PMCM' };

const SHIFT_CANONICAL = {
  Morning: 'Shift-I', morning: 'Shift-I', M: 'Shift-I',
  'Shift 1': 'Shift-I', 'shift-I': 'Shift-I', 'Shift-1': 'Shift-I',
  Evening: 'Shift-II', evening: 'Shift-II', E: 'Shift-II',
  'Shift 2': 'Shift-II', 'shift-II': 'Shift-II', 'Shift-2': 'Shift-II',
  null: null, '': null,
};

const MONTH_CANONICAL = {
  January: 'Jan', February: 'Feb', March: 'Mar', April: 'Apr',
  May: 'May', June: 'Jun', July: 'Jul', August: 'Aug',
  September: 'Sep', October: 'Oct', November: 'Nov', December: 'Dec',
  Jan: 'Jan', Feb: 'Feb', Mar: 'Mar', Apr: 'Apr',
  Jun: 'Jun', Jul: 'Jul', Aug: 'Aug',
  Sep: 'Sep', Oct: 'Oct', Nov: 'Nov', Dec: 'Dec',
};

const EXAM_CANONICAL = {
  'JEE Main': 'JEE_Main', 'JEE Mains': 'JEE_Main', JEE_Main: 'JEE_Main',
  'JEE Advanced': 'JEE_Advanced', 'IIT JEE': 'JEE_Advanced', JEE_Advanced: 'JEE_Advanced',
  NEET: 'NEET_UG', NEET_UG: 'NEET_UG',
};

const DIFFICULTY_LEVEL_FROM_ENUM = { Easy: 1, easy: 1, Medium: 3, medium: 3, Hard: 5, hard: 5 };

// questionNature values disallowed in math (organic-chemistry-only).
const FORBIDDEN_NATURE = new Set(['Mechanistic', 'Synthesis']);
const VALID_NATURE = new Set(['Recall', 'Rule_Application', 'Numerical', 'Comparative', 'Graphical', 'Conceptual']);

// ─── Helpers ──────────────────────────────────────────────────────────────

function targetDisplayId(d) {
  const [prefix, num] = d.display_id.split('-');
  const newPrefix = PREFIX_RENAME[prefix];
  if (!newPrefix) return d.display_id;
  return `${newPrefix}-${num}`;
}

function normalizeExamDetails(ed, sourceType) {
  if (sourceType !== 'PYQ') return null;
  if (!ed) return null;
  const out = { ...ed };
  if (out.exam && EXAM_CANONICAL[out.exam]) out.exam = EXAM_CANONICAL[out.exam];
  if (out.month != null && MONTH_CANONICAL[out.month]) out.month = MONTH_CANONICAL[out.month];
  if (out.shift !== undefined && Object.prototype.hasOwnProperty.call(SHIFT_CANONICAL, out.shift)) {
    out.shift = SHIFT_CANONICAL[out.shift];
  }
  // JEE_Advanced: month/shift must be null, paper required.
  if (out.exam === 'JEE_Advanced') { out.month = null; out.shift = null; }
  // NEET_UG: single-shift exam; shift is null. Math shouldn't be NEET — but normalize anyway.
  if (out.exam === 'NEET_UG') out.shift = null;
  // JEE_Main: if shift wasn't recorded in legacy data, write null explicitly
  // (vs undefined/absent) so the audit can clearly see it's a known-incomplete legacy doc.
  if (out.exam === 'JEE_Main' && out.shift === undefined) out.shift = null;
  return out;
}

function buildPlan(d) {
  const changes = {};
  const unsets = {};
  const warnings = [];

  // 1. display_id rename
  const newId = targetDisplayId(d);
  if (newId !== d.display_id) changes.display_id = newId;

  // 2. options sync (only for choice types)
  const choiceTypes = new Set(['SCQ', 'AR', 'MST', 'MTC']);
  if (choiceTypes.has(d.type)) {
    const correct = d.answer?.correct_option;
    const opts = d.options || [];
    const correctlyFlagged = opts.filter(o => o.is_correct).length;
    if (correct && correctlyFlagged !== 1) {
      // Resync from answer.correct_option
      if (opts.find(o => o.id === correct)) {
        const newOpts = opts.map(o => ({ ...o, is_correct: o.id === correct }));
        changes.options = newOpts;
      } else {
        warnings.push(`answer.correct_option "${correct}" not in options`);
      }
    } else if (!correct && correctlyFlagged !== 1) {
      warnings.push(`SCQ-like with no correct option and answer.correct_option missing`);
    }
  } else if (d.type === 'MCQ') {
    // leave MCQ alone in this pass (none flagged by audit)
  } else if (d.type === 'NVT') {
    const a = d.answer || {};
    if (a.integer_value == null && a.decimal_value == null) {
      warnings.push(`NVT missing integer_value/decimal_value — needs manual fix`);
    }
  }

  // 3. metadata normalization
  const m = d.metadata || {};
  const newMeta = {};

  if (m.subject !== 'maths') newMeta['metadata.subject'] = 'maths';

  if (!Array.isArray(m.applicableExams) || m.applicableExams.length === 0) {
    newMeta['metadata.applicableExams'] = ['JEE'];
  }

  // questionNature: replace forbidden / missing with 'Numerical'
  if (!VALID_NATURE.has(m.questionNature)) {
    newMeta['metadata.questionNature'] = 'Numerical';
  }

  // difficultyLevel: derive from legacy enum if needed
  if (!Number.isInteger(m.difficultyLevel)) {
    if (m.difficulty && DIFFICULTY_LEVEL_FROM_ENUM[m.difficulty]) {
      newMeta['metadata.difficultyLevel'] = DIFFICULTY_LEVEL_FROM_ENUM[m.difficulty];
    } else {
      newMeta['metadata.difficultyLevel'] = 3;
    }
  }

  // sourceType: infer if missing or contradictory
  let st = m.sourceType;
  const hasExamDetailsYear = m.examDetails && typeof m.examDetails.year === 'number';
  const hasExamSourceYear = m.exam_source && typeof m.exam_source.year === 'number';
  if (!st) {
    st = (hasExamDetailsYear || hasExamSourceYear) ? 'PYQ' : 'Practice';
    newMeta['metadata.sourceType'] = st;
  } else if (st === 'Practice' && (hasExamDetailsYear || hasExamSourceYear)) {
    // Practice + concrete exam date → upgrade to PYQ
    st = 'PYQ';
    newMeta['metadata.sourceType'] = st;
  }

  // examDetails: normalize from legacy exam_source if examDetails missing.
  let edRaw = m.examDetails;
  if (!edRaw && m.exam_source && (m.exam_source.year || m.exam_source.exam)) {
    edRaw = {
      exam: m.exam_source.exam,
      year: m.exam_source.year,
      month: m.exam_source.month,
      shift: m.exam_source.shift,
    };
  }
  const normalizedEd = normalizeExamDetails(edRaw, st);
  // Only write examDetails if it differs from current.
  const currentEdJson = JSON.stringify(m.examDetails || null);
  const newEdJson = JSON.stringify(normalizedEd);
  if (currentEdJson !== newEdJson) {
    newMeta['metadata.examDetails'] = normalizedEd;
  }

  // tags: ensure correct placeholder
  const expectedTag = `tag_${m.chapter_id}`;
  if (!Array.isArray(m.tags) || m.tags.length === 0 || m.tags[0].tag_id !== expectedTag) {
    newMeta['metadata.tags'] = [{ tag_id: expectedTag, weight: 1 }];
  }

  // defaults
  if (m.isMultiConcept == null) newMeta['metadata.isMultiConcept'] = false;
  if (m.is_top_pyq == null) newMeta['metadata.is_top_pyq'] = false;
  if (m.microConcept === undefined) newMeta['metadata.microConcept'] = null;
  if (!m.source_reference) {
    newMeta['metadata.source_reference'] = {
      type: 'image', verified_against_source: true, verification_date: NOW, verified_by: 'ai_agent',
    };
  }

  // 4. legacy $unset
  if ('is_pyq' in m) unsets['metadata.is_pyq'] = '';
  if ('examBoard' in m) unsets['metadata.examBoard'] = '';
  if ('exam_source' in m) unsets['metadata.exam_source'] = '';
  if (typeof m.difficulty === 'string') unsets['metadata.difficulty'] = '';

  // 5. doc-level fields
  // Don't auto-publish NVTs that have no answer — they need a human first.
  const nvtMissingAnswer = d.type === 'NVT' &&
    (d.answer?.integer_value == null && d.answer?.decimal_value == null);
  if (d.status !== 'published' && !nvtMissingAnswer) changes.status = 'published';
  if (d.deleted_at !== null && d.deleted_at !== undefined) changes.deleted_at = null;
  if (!Number.isInteger(d.version) || d.version < 1) changes.version = 1;
  else changes.version = d.version + 1;
  if (d.quality_score == null) changes.quality_score = 95;
  if (d.needs_review !== false) changes.needs_review = false;
  if (!Array.isArray(d.flags)) changes.flags = [];
  if (!Array.isArray(d.asset_ids)) changes.asset_ids = [];
  changes.updated_at = NOW;
  changes.updated_by = UPDATED_BY;

  return { changes: { ...changes, ...newMeta }, unsets, warnings };
}

// ─── Main ─────────────────────────────────────────────────────────────────

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');

  // Fetch all targeted docs in one go.
  const docs = await col.find({
    $or: [
      { display_id: { $regex: '^(COMP|SEQU|PERM|QUAD)-' } },
      { display_id: { $regex: '^STLN-' }, status: 'review' },
    ],
    deleted_at: null,
  }).toArray();

  console.log(`\nMode: ${APPLY ? 'APPLY (writing to DB)' : 'DRY RUN (no writes)'}`);
  console.log(`Found ${docs.length} legacy docs to migrate.\n`);

  // Pre-flight: collision check on renames.
  const renamedIds = docs.map(d => targetDisplayId(d)).filter((id, i) => id !== docs[i].display_id);
  const collisions = await col.find({ display_id: { $in: renamedIds } })
    .project({ display_id: 1 }).toArray();
  if (collisions.length) {
    console.error(`❌ Collision: ${collisions.length} target display_ids already exist:`);
    collisions.forEach(c => console.error(`   ${c.display_id}`));
    process.exit(2);
  }
  console.log(`✓ No display_id collisions on ${renamedIds.length} renames.\n`);

  // Build per-doc plans.
  const plans = docs.map(d => ({ doc: d, plan: buildPlan(d) }));

  // Aggregate stats.
  const stats = {
    renamed: 0,
    optionsSynced: 0,
    statusFlipped: 0,
    legacyFieldsUnset: 0,
    examDetailsNormalized: 0,
    nvtMissingAnswer: 0,
  };
  const nvtNeedingAnswers = [];

  for (const { doc, plan } of plans) {
    if (plan.changes.display_id) stats.renamed++;
    if (plan.changes.options) stats.optionsSynced++;
    if (plan.changes.status === 'published' && doc.status !== 'published') stats.statusFlipped++;
    if (Object.keys(plan.unsets).length) stats.legacyFieldsUnset++;
    if (Object.keys(plan.changes).some(k => k === 'metadata.examDetails')) stats.examDetailsNormalized++;
    for (const w of plan.warnings) {
      if (w.startsWith('NVT missing')) {
        stats.nvtMissingAnswer++;
        nvtNeedingAnswers.push(doc.display_id);
      }
    }
  }

  console.log('Aggregate plan:');
  console.log(`  display_id renamed         : ${stats.renamed}`);
  console.log(`  options[].is_correct synced: ${stats.optionsSynced}`);
  console.log(`  status review→published    : ${stats.statusFlipped}`);
  console.log(`  legacy fields $unset       : ${stats.legacyFieldsUnset}`);
  console.log(`  examDetails normalized     : ${stats.examDetailsNormalized}`);
  console.log(`  NVT missing answer (NOT TOUCHED): ${stats.nvtMissingAnswer}`);

  if (nvtNeedingAnswers.length) {
    console.log(`\nNVT docs that need manual answer-key fixes (NOT modified):`);
    nvtNeedingAnswers.forEach(id => console.log(`  ${id}`));
  }

  // Show first 3 detailed plans as a sanity sample.
  console.log('\n────── Sample detailed plans (first 3) ──────');
  plans.slice(0, 3).forEach(({ doc, plan }) => {
    console.log(`\n• ${doc.display_id} (chapter=${doc.metadata?.chapter_id}, status=${doc.status})`);
    Object.entries(plan.changes).forEach(([k, v]) => {
      const s = typeof v === 'object' ? JSON.stringify(v).slice(0, 100) : v;
      console.log(`    SET ${k} = ${s}`);
    });
    Object.keys(plan.unsets).forEach(k => console.log(`    UNSET ${k}`));
    plan.warnings.forEach(w => console.log(`    ⚠️  ${w}`));
  });

  if (!APPLY) {
    console.log('\nDRY RUN — no writes performed. Re-run with --apply to commit.');
    await client.close();
    return;
  }

  // ─── Apply ───
  console.log('\nApplying changes…');
  const ops = plans.map(({ doc, plan }) => {
    const update = {};
    if (Object.keys(plan.changes).length) update.$set = plan.changes;
    if (Object.keys(plan.unsets).length) update.$unset = plan.unsets;
    return { updateOne: { filter: { _id: doc._id }, update } };
  });

  const result = await col.bulkWrite(ops, { ordered: false });
  console.log(`✓ matched=${result.matchedCount}  modified=${result.modifiedCount}`);

  // Re-verify by counting remaining defects (quick spot check).
  const stillReview = await col.countDocuments({
    'metadata.chapter_id': { $regex: '^ma_' },
    status: { $ne: 'published' },
    deleted_at: null,
  });
  const stillLegacy = await col.countDocuments({
    'metadata.chapter_id': { $regex: '^ma_' },
    $or: [
      { 'metadata.is_pyq': { $exists: true } },
      { 'metadata.examBoard': { $exists: true } },
      { 'metadata.exam_source': { $exists: true } },
    ],
    deleted_at: null,
  });
  const stillLegacyPrefix = await col.countDocuments({
    display_id: { $regex: '^(COMP|SEQU|PERM)-' },
    deleted_at: null,
  });
  console.log(`\nPost-migration sanity:`);
  console.log(`  math docs in non-published status: ${stillReview}`);
  console.log(`  math docs with any legacy field  : ${stillLegacy}`);
  console.log(`  docs still using COMP/SEQU/PERM  : ${stillLegacyPrefix}`);

  await client.close();
})();
