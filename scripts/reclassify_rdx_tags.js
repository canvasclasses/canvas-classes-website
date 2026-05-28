// scripts/reclassify_rdx_tags.js
// Reclassify all 150 RDX (Redox Reactions) questions:
//   - primary tag  (tags[0]) — single-tag, weight 1.0
//   - microConcept (human-readable name from taxonomyData_from_csv.ts)
//   - questionNature (one of: Recall/Rule_Application/Numerical/Comparative/Graphical/Conceptual/Mechanistic/Synthesis)
//   - difficultyLevel (1-5)
//
// Usage:
//   node scripts/reclassify_rdx_tags.js              # dry-run (no writes)
//   node scripts/reclassify_rdx_tags.js --apply      # actually write
//
// Per CRUCIBLE_TAXONOMY_AND_TAGGING_RULES.md §5:
//   - dry-run is default; --apply must be explicit
//   - per-document line: display_id | field | old → new
//   - writes auditlogs entry per document on --apply

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const DRY_RUN = !process.argv.includes('--apply');
const SCRIPT_NAME = 'reclassify_rdx_tags.js';

// Taxonomy lookup: maps micro_id → human-readable name (must match
// packages/data/taxonomy/taxonomyData_from_csv.ts exactly).
const MICRO_NAME = {
  micro_redox_1_1: 'Oxidation Number Method',
  micro_redox_1_2: 'Half-Reaction (Ion-Electron) Method - Acidic Medium',
  micro_redox_1_3: 'Half-Reaction Method in Basic Medium',
  micro_redox_1_4: 'Disproportionation Reactions',
  micro_redox_1_5: 'Balancing Complex Redox Equations',
  micro_redox_2_1: 'Oxidation & Reduction Definitions',
  micro_redox_2_2: 'Oxidation Number Rules',
  micro_redox_2_3: 'Oxidation Number Calculations',
  micro_redox_2_4: 'Identifying Oxidizing & Reducing Agents',
  micro_redox_2_5: 'Fractional Oxidation States',
  micro_redox_2_6: 'Oxidation State in Organic Compounds',
  micro_redox_3_1: 'Permanganometry',
  micro_redox_3_2: 'Dichromatometry',
  micro_redox_3_3: 'Iodometry',
  micro_redox_3_4: 'Iodimetry',
  micro_redox_3_5: 'Equivalent Weight in Redox',
  micro_redox_3_6: 'Redox Titration Calculations',
  micro_redox_4_1: 'Combination & Decomposition Redox',
  micro_redox_4_2: 'Displacement Reactions',
  micro_redox_4_3: 'Disproportionation & Comproportionation',
  micro_redox_4_4: 'Intramolecular Redox',
  micro_redox_4_5: 'Redox Reactions in Electrochemistry',
};
const m = (id) => MICRO_NAME[id]; // shorthand

// Per-question plan. Single tag + micro + nature + difficulty.
const PLAN = [
  // id           , primary tag   , micro key       , nature             , difficulty
  ['RDX-001', 'tag_redox_2', 'micro_redox_2_3', 'Rule_Application', 3],
  ['RDX-002', 'tag_redox_2', 'micro_redox_2_3', 'Comparative',       2],
  ['RDX-003', 'tag_redox_2', 'micro_redox_2_3', 'Numerical',         2],
  ['RDX-004', 'tag_redox_4', 'micro_redox_4_2', 'Conceptual',        2],
  ['RDX-005', 'tag_redox_2', 'micro_redox_2_4', 'Conceptual',        3],
  ['RDX-006', 'tag_redox_4', 'micro_redox_4_3', 'Rule_Application', 3],
  ['RDX-007', 'tag_redox_2', 'micro_redox_2_4', 'Conceptual',        3],
  ['RDX-008', 'tag_redox_4', 'micro_redox_4_1', 'Conceptual',        3],
  ['RDX-009', 'tag_redox_4', 'micro_redox_4_3', 'Conceptual',        3],
  ['RDX-010', 'tag_redox_4', 'micro_redox_4_3', 'Recall',            2],
  ['RDX-011', 'tag_redox_4', 'micro_redox_4_3', 'Conceptual',        3],
  ['RDX-012', 'tag_redox_4', 'micro_redox_4_1', 'Conceptual',        2],
  ['RDX-013', 'tag_redox_4', 'micro_redox_4_3', 'Recall',            2],
  ['RDX-014', 'tag_redox_1', 'micro_redox_1_2', 'Rule_Application', 3],
  ['RDX-015', 'tag_redox_3', 'micro_redox_3_6', 'Numerical',         3],
  ['RDX-016', 'tag_redox_3', 'micro_redox_3_6', 'Conceptual',        2],
  ['RDX-017', 'tag_redox_3', 'micro_redox_3_1', 'Recall',            2],
  ['RDX-018', 'tag_redox_3', 'micro_redox_3_1', 'Rule_Application', 3],
  ['RDX-019', 'tag_redox_3', 'micro_redox_3_6', 'Numerical',         3],
  ['RDX-020', 'tag_redox_3', 'micro_redox_3_2', 'Numerical',         3],
  ['RDX-021', 'tag_redox_3', 'micro_redox_3_6', 'Conceptual',        2],
  ['RDX-022', 'tag_redox_3', 'micro_redox_3_6', 'Conceptual',        2],
  ['RDX-023', 'tag_redox_3', 'micro_redox_3_6', 'Numerical',         3],
  ['RDX-024', 'tag_redox_2', 'micro_redox_2_5', 'Conceptual',        3],
  ['RDX-025', 'tag_redox_2', 'micro_redox_2_3', 'Rule_Application', 3],
  ['RDX-026', 'tag_redox_2', 'micro_redox_2_3', 'Rule_Application', 2],
  ['RDX-027', 'tag_redox_2', 'micro_redox_2_3', 'Rule_Application', 3],
  ['RDX-028', 'tag_redox_2', 'micro_redox_2_2', 'Recall',            2],
  ['RDX-029', 'tag_redox_2', 'micro_redox_2_4', 'Conceptual',        3],
  ['RDX-030', 'tag_redox_2', 'micro_redox_2_4', 'Conceptual',        2],
  ['RDX-031', 'tag_redox_2', 'micro_redox_2_4', 'Recall',            2],
  ['RDX-032', 'tag_redox_2', 'micro_redox_2_4', 'Conceptual',        2],
  ['RDX-033', 'tag_redox_2', 'micro_redox_2_4', 'Rule_Application', 3],
  ['RDX-034', 'tag_redox_2', 'micro_redox_2_4', 'Comparative',       3],
  ['RDX-035', 'tag_redox_4', 'micro_redox_4_3', 'Conceptual',        3],
  ['RDX-036', 'tag_redox_4', 'micro_redox_4_3', 'Conceptual',        4],
  ['RDX-037', 'tag_redox_4', 'micro_redox_4_3', 'Conceptual',        3],
  ['RDX-038', 'tag_redox_4', 'micro_redox_4_3', 'Conceptual',        3],
  ['RDX-039', 'tag_redox_4', 'micro_redox_4_3', 'Conceptual',        3],
  ['RDX-040', 'tag_redox_1', 'micro_redox_1_3', 'Rule_Application', 2],
  ['RDX-041', 'tag_redox_1', 'micro_redox_1_2', 'Rule_Application', 3],
  ['RDX-042', 'tag_redox_3', 'micro_redox_3_1', 'Numerical',         4],
  ['RDX-043', 'tag_redox_1', 'micro_redox_1_2', 'Rule_Application', 4],
  ['RDX-044', 'tag_redox_1', 'micro_redox_1_2', 'Rule_Application', 3],
  ['RDX-045', 'tag_redox_3', 'micro_redox_3_2', 'Synthesis',         5],
  ['RDX-046', 'tag_redox_3', 'micro_redox_3_6', 'Numerical',         2],
  ['RDX-047', 'tag_redox_3', 'micro_redox_3_6', 'Numerical',         4],
  ['RDX-048', 'tag_redox_3', 'micro_redox_3_2', 'Numerical',         3],
  ['RDX-049', 'tag_redox_3', 'micro_redox_3_6', 'Rule_Application', 3],
  ['RDX-050', 'tag_redox_3', 'micro_redox_3_1', 'Numerical',         4],
  ['RDX-051', 'tag_redox_3', 'micro_redox_3_6', 'Numerical',         3],
  ['RDX-052', 'tag_redox_3', 'micro_redox_3_2', 'Numerical',         3],
  ['RDX-053', 'tag_redox_3', 'micro_redox_3_6', 'Numerical',         4],
  ['RDX-054', 'tag_redox_3', 'micro_redox_3_6', 'Numerical',         3],
  ['RDX-055', 'tag_redox_3', 'micro_redox_3_1', 'Numerical',         4],
  ['RDX-056', 'tag_redox_3', 'micro_redox_3_1', 'Numerical',         3],
  ['RDX-057', 'tag_redox_3', 'micro_redox_3_6', 'Conceptual',        3],
  ['RDX-058', 'tag_redox_4', 'micro_redox_4_1', 'Recall',            2],
  ['RDX-059', 'tag_redox_3', 'micro_redox_3_6', 'Numerical',         3],
  ['RDX-060', 'tag_redox_1', 'micro_redox_1_3', 'Rule_Application', 3],
  ['RDX-061', 'tag_redox_3', 'micro_redox_3_6', 'Conceptual',        2],
  ['RDX-062', 'tag_redox_3', 'micro_redox_3_1', 'Recall',            3],
  ['RDX-063', 'tag_redox_3', 'micro_redox_3_6', 'Graphical',         3],
  ['RDX-064', 'tag_redox_3', 'micro_redox_3_6', 'Conceptual',        3],
  ['RDX-065', 'tag_redox_3', 'micro_redox_3_6', 'Conceptual',        3],
  ['RDX-066', 'tag_redox_3', 'micro_redox_3_3', 'Numerical',         4],
  ['RDX-067', 'tag_redox_3', 'micro_redox_3_1', 'Conceptual',        2],
  ['RDX-068', 'tag_redox_3', 'micro_redox_3_6', 'Recall',            2],
  ['RDX-069', 'tag_redox_3', 'micro_redox_3_3', 'Numerical',         4],
  ['RDX-070', 'tag_redox_3', 'micro_redox_3_1', 'Numerical',         4],
  ['RDX-071', 'tag_redox_3', 'micro_redox_3_1', 'Numerical',         4],
  ['RDX-072', 'tag_redox_3', 'micro_redox_3_6', 'Graphical',         3],
  ['RDX-073', 'tag_redox_3', 'micro_redox_3_2', 'Numerical',         4],
  ['RDX-074', 'tag_redox_3', 'micro_redox_3_1', 'Synthesis',         4],
  ['RDX-075', 'tag_redox_3', 'micro_redox_3_1', 'Rule_Application', 2],
  ['RDX-076', 'tag_redox_1', 'micro_redox_1_3', 'Rule_Application', 4],
  ['RDX-077', 'tag_redox_3', 'micro_redox_3_6', 'Numerical',         4],
  ['RDX-078', 'tag_redox_3', 'micro_redox_3_6', 'Rule_Application', 3],
  ['RDX-079', 'tag_redox_3', 'micro_redox_3_6', 'Numerical',         4],
  ['RDX-080', 'tag_redox_3', 'micro_redox_3_6', 'Numerical',         5],
  ['RDX-081', 'tag_redox_3', 'micro_redox_3_5', 'Conceptual',        4],
  ['RDX-082', 'tag_redox_3', 'micro_redox_3_2', 'Synthesis',         5],
  ['RDX-083', 'tag_redox_4', 'micro_redox_4_1', 'Conceptual',        3],
  ['RDX-084', 'tag_redox_2', 'micro_redox_2_4', 'Conceptual',        4],
  ['RDX-085', 'tag_redox_2', 'micro_redox_2_3', 'Rule_Application', 4],
  ['RDX-086', 'tag_redox_2', 'micro_redox_2_5', 'Numerical',         5],
  ['RDX-087', 'tag_redox_2', 'micro_redox_2_5', 'Rule_Application', 4],
  ['RDX-088', 'tag_redox_2', 'micro_redox_2_2', 'Conceptual',        4],
  ['RDX-089', 'tag_redox_4', 'micro_redox_4_3', 'Conceptual',        2],
  ['RDX-090', 'tag_redox_1', 'micro_redox_1_2', 'Conceptual',        4],
  ['RDX-091', 'tag_redox_3', 'micro_redox_3_5', 'Rule_Application', 3],
  ['RDX-092', 'tag_redox_3', 'micro_redox_3_6', 'Numerical',         3],
  ['RDX-093', 'tag_redox_3', 'micro_redox_3_1', 'Synthesis',         5],
  ['RDX-094', 'tag_redox_3', 'micro_redox_3_1', 'Synthesis',         5],
  ['RDX-095', 'tag_redox_2', 'micro_redox_2_3', 'Rule_Application', 2],
  ['RDX-096', 'tag_redox_2', 'micro_redox_2_2', 'Rule_Application', 3],
  ['RDX-097', 'tag_redox_2', 'micro_redox_2_2', 'Recall',            2],
  ['RDX-098', 'tag_redox_2', 'micro_redox_2_2', 'Recall',            1],
  ['RDX-099', 'tag_redox_2', 'micro_redox_2_3', 'Recall',            4],
  ['RDX-100', 'tag_redox_2', 'micro_redox_2_3', 'Recall',            2],
  ['RDX-101', 'tag_redox_2', 'micro_redox_2_1', 'Rule_Application', 2],
  ['RDX-102', 'tag_redox_2', 'micro_redox_2_3', 'Rule_Application', 4],
  ['RDX-103', 'tag_redox_2', 'micro_redox_2_5', 'Comparative',       3],
  ['RDX-104', 'tag_redox_2', 'micro_redox_2_4', 'Conceptual',        2],
  ['RDX-105', 'tag_redox_2', 'micro_redox_2_4', 'Conceptual',        2],
  ['RDX-106', 'tag_redox_2', 'micro_redox_2_4', 'Conceptual',        3],
  ['RDX-107', 'tag_redox_4', 'micro_redox_4_3', 'Conceptual',        3],
  ['RDX-108', 'tag_redox_2', 'micro_redox_2_3', 'Conceptual',        3],
  ['RDX-109', 'tag_redox_2', 'micro_redox_2_4', 'Comparative',       3],
  ['RDX-110', 'tag_redox_2', 'micro_redox_2_4', 'Conceptual',        3],
  ['RDX-111', 'tag_redox_2', 'micro_redox_2_3', 'Rule_Application', 4],
  ['RDX-112', 'tag_redox_2', 'micro_redox_2_3', 'Comparative',       3],
  ['RDX-113', 'tag_redox_3', 'micro_redox_3_5', 'Recall',            2],
  ['RDX-114', 'tag_redox_3', 'micro_redox_3_5', 'Rule_Application', 2],
  ['RDX-115', 'tag_redox_3', 'micro_redox_3_5', 'Rule_Application', 2],
  ['RDX-116', 'tag_redox_3', 'micro_redox_3_5', 'Rule_Application', 3],
  ['RDX-117', 'tag_redox_3', 'micro_redox_3_5', 'Rule_Application', 3],
  ['RDX-118', 'tag_redox_1', 'micro_redox_1_1', 'Rule_Application', 3],
  ['RDX-119', 'tag_redox_1', 'micro_redox_1_1', 'Rule_Application', 3],
  ['RDX-120', 'tag_redox_1', 'micro_redox_1_3', 'Rule_Application', 3],
  ['RDX-121', 'tag_redox_1', 'micro_redox_1_2', 'Rule_Application', 4],
  ['RDX-122', 'tag_redox_1', 'micro_redox_1_5', 'Rule_Application', 4],
  ['RDX-123', 'tag_redox_2', 'micro_redox_2_6', 'Rule_Application', 2],
  ['RDX-124', 'tag_redox_2', 'micro_redox_2_6', 'Rule_Application', 3],
  ['RDX-125', 'tag_redox_2', 'micro_redox_2_6', 'Rule_Application', 2],
  ['RDX-126', 'tag_redox_2', 'micro_redox_2_6', 'Rule_Application', 3],
  ['RDX-127', 'tag_redox_2', 'micro_redox_2_6', 'Rule_Application', 2],
  ['RDX-128', 'tag_redox_2', 'micro_redox_2_3', 'Rule_Application', 4],
  ['RDX-129', 'tag_redox_2', 'micro_redox_2_6', 'Rule_Application', 3],
  ['RDX-130', 'tag_redox_2', 'micro_redox_2_1', 'Conceptual',        3],
  ['RDX-131', 'tag_redox_2', 'micro_redox_2_1', 'Conceptual',        3],
  ['RDX-132', 'tag_redox_4', 'micro_redox_4_3', 'Conceptual',        3],
  ['RDX-133', 'tag_redox_2', 'micro_redox_2_3', 'Rule_Application', 4],
  ['RDX-134', 'tag_redox_2', 'micro_redox_2_3', 'Comparative',       3],
  ['RDX-135', 'tag_redox_3', 'micro_redox_3_1', 'Recall',            2],
  ['RDX-136', 'tag_redox_3', 'micro_redox_3_4', 'Recall',            2],
  ['RDX-137 [NEET 2025]', 'tag_redox_2', 'micro_redox_2_2', 'Recall',            2],
  ['RDX-138', 'tag_redox_4', 'micro_redox_4_5', 'Rule_Application', 4],
  ['RDX-139', 'tag_redox_4', 'micro_redox_4_1', 'Conceptual',        3],
  ['RDX-140', 'tag_redox_2', 'micro_redox_2_1', 'Recall',            2],
  ['RDX-141', 'tag_redox_4', 'micro_redox_4_5', 'Rule_Application', 3],
  ['RDX-142', 'tag_redox_1', 'micro_redox_1_5', 'Rule_Application', 3],
  ['RDX-143', 'tag_redox_3', 'micro_redox_3_1', 'Rule_Application', 3],
  ['RDX-144', 'tag_redox_4', 'micro_redox_4_2', 'Recall',            2],
  ['RDX-145', 'tag_redox_2', 'micro_redox_2_3', 'Rule_Application', 2],
  ['RDX-146', 'tag_redox_2', 'micro_redox_2_6', 'Rule_Application', 2],
  ['RDX-147', 'tag_redox_4', 'micro_redox_4_3', 'Recall',            3],
  ['RDX-148', 'tag_redox_2', 'micro_redox_2_3', 'Comparative',       2],
  ['RDX-149', 'tag_redox_1', 'micro_redox_1_2', 'Rule_Application', 3],
  ['RDX-150', 'tag_redox_3', 'micro_redox_3_1', 'Recall',            2],
];

const NATURE_ENUM = new Set([
  'Recall', 'Rule_Application', 'Numerical', 'Comparative',
  'Graphical', 'Conceptual', 'Mechanistic', 'Synthesis',
]);

function validatePlan() {
  const seen = new Set();
  for (const row of PLAN) {
    const [id, tag, microKey, nature, diff] = row;
    if (seen.has(id)) throw new Error(`Duplicate display_id in plan: ${id}`);
    seen.add(id);
    if (!/^RDX-\d{3}(\s\[.+\])?$/.test(id)) throw new Error(`Bad display_id format: ${id}`);
    if (!/^tag_redox_[1-4]$/.test(tag)) throw new Error(`${id}: bad tag ${tag}`);
    if (!MICRO_NAME[microKey]) throw new Error(`${id}: unknown micro key ${microKey}`);
    if (!microKey.startsWith(tag.replace('tag_', 'micro_') + '_')) {
      throw new Error(`${id}: micro ${microKey} does not belong to parent ${tag}`);
    }
    if (!NATURE_ENUM.has(nature)) throw new Error(`${id}: bad nature ${nature}`);
    if (!Number.isInteger(diff) || diff < 1 || diff > 5) throw new Error(`${id}: bad difficulty ${diff}`);
  }
}

(async () => {
  validatePlan();
  console.log(`Plan validated: ${PLAN.length} rows`);
  console.log(`Mode: ${DRY_RUN ? 'DRY-RUN' : 'WRITE'}`);
  console.log('');

  await mongoose.connect(process.env.MONGODB_URI);
  const Q = mongoose.connection.db.collection('questions_v2');
  const AuditLog = mongoose.connection.db.collection('auditlogs');

  let changedDocs = 0;
  let changedFields = 0;
  let unchanged = 0;
  let notFound = 0;

  for (const row of PLAN) {
    const [id, newTag, microKey, newNature, newDiff] = row;
    const newMicroName = MICRO_NAME[microKey];

    const cur = await Q.findOne(
      { display_id: id, deleted_at: null },
      { projection: { 'metadata.tags': 1, 'metadata.microConcept': 1, 'metadata.questionNature': 1, 'metadata.difficultyLevel': 1 } }
    );
    if (!cur) {
      console.log(`${id}  NOT FOUND`);
      notFound++;
      continue;
    }

    const oldTag = cur.metadata?.tags?.[0]?.tag_id || null;
    const oldMicro = cur.metadata?.microConcept || null;
    const oldNature = cur.metadata?.questionNature || null;
    const oldDiff = cur.metadata?.difficultyLevel ?? null;

    const set = {};
    const fieldChanges = {};
    const lines = [];

    if (oldTag !== newTag) {
      set['metadata.tags'] = [{ tag_id: newTag, weight: 1 }];
      fieldChanges['metadata.tags[0].tag_id'] = { old: oldTag, new: newTag };
      lines.push(`primary: ${oldTag} → ${newTag}`);
    }
    if (oldMicro !== newMicroName) {
      set['metadata.microConcept'] = newMicroName;
      fieldChanges['metadata.microConcept'] = { old: oldMicro, new: newMicroName };
      lines.push(`micro: ${oldMicro || '(none)'} → ${newMicroName}`);
    }
    if (oldNature !== newNature) {
      set['metadata.questionNature'] = newNature;
      fieldChanges['metadata.questionNature'] = { old: oldNature, new: newNature };
      lines.push(`nature: ${oldNature || '(none)'} → ${newNature}`);
    }
    if (oldDiff !== newDiff) {
      set['metadata.difficultyLevel'] = newDiff;
      fieldChanges['metadata.difficultyLevel'] = { old: oldDiff, new: newDiff };
      lines.push(`difficulty: ${oldDiff ?? '(none)'} → ${newDiff}`);
    }

    if (Object.keys(set).length === 0) {
      unchanged++;
      continue;
    }

    changedDocs++;
    changedFields += Object.keys(set).length;
    console.log(`${id}  ${lines.join(' | ')}${DRY_RUN ? '  (dry-run)' : ''}`);

    if (!DRY_RUN) {
      set.updated_at = new Date();
      await Q.updateOne({ display_id: id }, { $set: set });
      await AuditLog.insertOne({
        entity_id: id,
        entity_type: 'question_v2',
        action: 'bulk_update',
        field_changes: fieldChanges,
        actor: 'ai_agent',
        script_name: SCRIPT_NAME,
        run_at: new Date(),
      });
    }
  }

  console.log('');
  console.log('=== SUMMARY ===');
  console.log(`Mode:                 ${DRY_RUN ? 'DRY-RUN (no writes)' : 'APPLIED'}`);
  console.log(`Plan rows:            ${PLAN.length}`);
  console.log(`Documents changed:    ${changedDocs}`);
  console.log(`Field changes total:  ${changedFields}`);
  console.log(`Unchanged:            ${unchanged}`);
  console.log(`Not found:            ${notFound}`);

  await mongoose.disconnect();
})().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
