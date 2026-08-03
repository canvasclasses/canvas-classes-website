'use strict';
/**
 * Relocates the micro-topic "Percentage Composition Calculations" from
 * tag_mole_3 ("Empirical/Molecular Formula") to tag_mole_8 ("Stoichiometry &
 * Analysis"), and fixes MOLE-214's orphaned micro-concept. Founder request,
 * 2026-07-30, triggered by MOLE-214 being mistagged under Empirical/Molecular
 * Formula for a question that never asks for a formula determination.
 *
 * Per CRUCIBLE_TAXONOMY_AND_TAGGING_RULES.md §1.4 ("splitting/merging tags" —
 * moving a micro-topic between parent tags is the same shape of migration):
 *   - The OLD node (micro_mole_3_6) is never deleted, only deprecated in
 *     place (renamed "[DEPRECATED] ...", id kept forever) — some already-
 *     graded/exported material may still reference it historically.
 *   - The NEW node (micro_mole_8_7) gets a fresh id under its real parent,
 *     same display name — nothing about what the concept IS has changed,
 *     only which primary tag it correctly belongs under.
 *   - Every affected question is re-tagged by EXPLICIT display_id, verified
 *     individually by reading the actual question text (not by trusting the
 *     old tag or bulk-matching a text pattern) — see the pre-flight audit
 *     in the PR/session notes: none of the 3 relocated questions ask for an
 *     empirical or molecular formula; all give the formula and ask for a
 *     plain mass-% of one element.
 *
 * Pre-flight audit (2026-07-30, before writing this script) confirmed:
 *   - Exactly 3 questions bank-wide have (tag_mole_3, "Percentage Composition
 *     Calculations"): MOLE-017, MOLE-102, MOLE-223. All read in full; none
 *     involve determining a formula.
 *   - MOLE-214 already has its primary tag correctly on tag_mole_8 (moved via
 *     the admin UI) but its stored microConcept ("Percentage Composition
 *     Calculations") does not resolve under tag_mole_8's taxonomy — it needs
 *     to become "Gravimetric Analysis" (micro_mole_8_3, already used by 11
 *     other questions; BaSO4-precipitation sulphur estimation IS the
 *     textbook gravimetric-analysis technique).
 *   - All 4 documents have a single-element metadata.tags array (weight 1,
 *     no secondary tags) — updates target tags.0.tag_id directly, no risk of
 *     clobbering an unrelated secondary tag.
 *
 * Usage:
 *   node scripts/relocate_pct_composition_micro.js --dry   # preview only
 *   node scripts/relocate_pct_composition_micro.js         # write
 *
 * ROLLBACK: re-run with REVERSE=true (undoes the taxonomy rename/insert and
 * re-tags the 3 questions back to tag_mole_3; MOLE-214's microConcept is
 * restored to its prior — already-broken — string, since that's the true
 * previous state). Non-destructive: only tag_id and microConcept string
 * fields are ever touched, no document is deleted or restructured.
 */
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const DRY = process.argv.includes('--dry');
const REVERSE = process.env.REVERSE === 'true';

const TAXONOMY_PATH = path.join(__dirname, '../packages/data/taxonomy/taxonomyData_from_csv.ts');

const OLD_TAG = 'tag_mole_3';
const NEW_TAG = 'tag_mole_8';
const OLD_MICRO_ID = 'micro_mole_3_6';
const NEW_MICRO_ID = 'micro_mole_8_7';
const MICRO_NAME = 'Percentage Composition Calculations';
const DEPRECATED_NAME = `[DEPRECATED] ${MICRO_NAME}`;

// Explicit, individually-verified list — never a bulk text-pattern match.
const RELOCATE_QUESTIONS = ['MOLE-017', 'MOLE-102', 'MOLE-223'];

const MOLE_214_FIX = {
  display_id: 'MOLE-214',
  from: MICRO_NAME,
  to: 'Gravimetric Analysis',
};

// ── 1. Taxonomy file ─────────────────────────────────────────────────────
function patchTaxonomyFile() {
  let src = fs.readFileSync(TAXONOMY_PATH, 'utf8');

  const oldNodeRe = new RegExp(
    `\\{ id: '${OLD_MICRO_ID}', name: '[^']*', parent_id: '${OLD_TAG}', type: 'micro_topic' \\},`
  );
  const oldMatch = src.match(oldNodeRe);
  if (!oldMatch) throw new Error(`${OLD_MICRO_ID} line not found`);

  const newMicroLine = `    { id: '${NEW_MICRO_ID}', name: '${MICRO_NAME}', parent_id: '${NEW_TAG}', type: 'micro_topic' },`;
  const lastExistingUnderNewTag = `{ id: 'micro_mole_8_6', name: 'POAC (Principle of Atom Conservation)', parent_id: '${NEW_TAG}', type: 'micro_topic' },`;

  if (!REVERSE) {
    // deprecate the old node in place
    src = src.replace(oldNodeRe, `{ id: '${OLD_MICRO_ID}', name: '${DEPRECATED_NAME}', parent_id: '${OLD_TAG}', type: 'micro_topic' },`);
    // insert the new node after the last existing tag_mole_8 micro
    if (src.includes(NEW_MICRO_ID)) {
      console.log(`  (${NEW_MICRO_ID} already present — skipping insert)`);
    } else {
      if (!src.includes(lastExistingUnderNewTag)) throw new Error('anchor line for insertion not found');
      src = src.replace(lastExistingUnderNewTag, `${lastExistingUnderNewTag}\n${newMicroLine}`);
    }
  } else {
    // undo: restore the old node's name, remove the new node
    src = src.replace(oldNodeRe, `{ id: '${OLD_MICRO_ID}', name: '${MICRO_NAME}', parent_id: '${OLD_TAG}', type: 'micro_topic' },`);
    const newLineRe = new RegExp(`\\n *\\{ id: '${NEW_MICRO_ID}',[^\\n]*\\},`);
    if (src.match(newLineRe)) src = src.replace(newLineRe, '');
  }

  return src;
}

(async () => {
  console.log(REVERSE ? 'MODE: REVERSE (undo)' : 'MODE: FORWARD (apply)');
  console.log(DRY ? 'DRY RUN — no files or DB will be written\n' : 'LIVE RUN\n');

  const before = fs.readFileSync(TAXONOMY_PATH, 'utf8');
  const after = patchTaxonomyFile();

  console.log('── Taxonomy file changes ──');
  if (!REVERSE) {
    console.log(`  ${OLD_MICRO_ID}: "${MICRO_NAME}" -> "${DEPRECATED_NAME}"  (deprecated in place, kept)`);
    console.log(`  ${NEW_MICRO_ID}: (new, under ${NEW_TAG}) "${MICRO_NAME}"`);
  } else {
    console.log(`  ${OLD_MICRO_ID}: "${DEPRECATED_NAME}" -> "${MICRO_NAME}"  (un-deprecated)`);
    console.log(`  ${NEW_MICRO_ID}: (removed)`);
  }
  console.log(`  bytes: ${before.length} -> ${after.length}\n`);

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');

  console.log('── questions_v2 changes ──');
  const relocatePlan = [];
  for (const display_id of RELOCATE_QUESTIONS) {
    const fromTag = REVERSE ? NEW_TAG : OLD_TAG;
    const toTag = REVERSE ? OLD_TAG : NEW_TAG;
    const filter = { display_id, 'metadata.tags.0.tag_id': fromTag, deleted_at: null };
    const doc = await col.findOne(filter, { projection: { _id: 1 } });
    relocatePlan.push({ display_id, filter, fromTag, toTag, exists: !!doc });
    console.log(`  ${display_id}: primary tag ${fromTag} -> ${toTag}  ${doc ? '' : '  !! NOT FOUND matching expected current state'}`);
  }

  const fixFilter = {
    display_id: MOLE_214_FIX.display_id,
    'metadata.microConcept': REVERSE ? MOLE_214_FIX.to : MOLE_214_FIX.from,
    deleted_at: null,
  };
  const fixTo = REVERSE ? MOLE_214_FIX.from : MOLE_214_FIX.to;
  const fixDoc = await col.findOne(fixFilter, { projection: { _id: 1 } });
  console.log(`  ${MOLE_214_FIX.display_id}: microConcept "${REVERSE ? MOLE_214_FIX.to : MOLE_214_FIX.from}" -> "${fixTo}"  ${fixDoc ? '' : '  !! NOT FOUND matching expected current state'}`);

  const totalPlanned = relocatePlan.filter((p) => p.exists).length + (fixDoc ? 1 : 0);
  console.log(`\n  TOTAL: ${totalPlanned} document(s) will be modified`);
  console.log('  ROLLBACK: re-run with REVERSE=true env var.\n');

  if (relocatePlan.some((p) => !p.exists) || !fixDoc) {
    console.log('!! Some expected documents were not found in their expected current state. Aborting before any write — investigate before re-running.');
    await client.close();
    process.exit(1);
  }

  if (DRY) {
    console.log('--dry set — no files written, no DB writes performed.');
    await client.close();
    return;
  }

  fs.writeFileSync(TAXONOMY_PATH, after, 'utf8');
  console.log('✓ taxonomy file written');

  let modified = 0;
  for (const { display_id, filter, toTag } of relocatePlan) {
    const res = await col.updateOne(filter, { $set: { 'metadata.tags.0.tag_id': toTag } });
    console.log(`  ${display_id}: matched=${res.matchedCount} modified=${res.modifiedCount}`);
    modified += res.modifiedCount;
  }
  const fixRes = await col.updateOne(fixFilter, { $set: { 'metadata.microConcept': fixTo } });
  console.log(`  ${MOLE_214_FIX.display_id}: matched=${fixRes.matchedCount} modified=${fixRes.modifiedCount}`);
  modified += fixRes.modifiedCount;

  console.log(`✓ questions_v2 updates complete — ${modified} document(s) modified`);
  await client.close();
})().catch((e) => { console.error(e); process.exit(1); });
