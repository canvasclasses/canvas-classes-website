'use strict';
/**
 * Renames the 6 micro-topics under tag_redox_3 ("Redox Titrations") to
 * plainer, teacher-voice names, and adds a new micro-topic
 * micro_redox_3_7 = "Titrations Basics" for primary/secondary-standard
 * fundamentals (per founder request, 2026-07-30).
 *
 * Per CRUCIBLE_TAXONOMY_AND_TAGGING_RULES.md:
 *   - §1.3 "Renaming a micro-topic": id stays fixed, only `name` changes,
 *     and a backfill is REQUIRED because questions store the micro-concept
 *     NAME as a string (metadata.microConcept), not the id.
 *   - §0 rule 5: manual edits to taxonomyData_from_csv.ts are allowed when
 *     the change is a "scripted rename" — this is exactly that, done here
 *     atomically with the DB backfill so the two can never drift apart.
 *
 * Pre-flight audit (2026-07-30, before writing this script) confirmed:
 *   - Every one of the 6 old strings is used EXCLUSIVELY under tag_redox_3
 *     (global count === tag_redox_3-scoped count for all 6 — no other
 *     chapter/tag reuses these names).
 *   - The taxonomy file has exactly one micro_topic node per old name.
 *   - "Titrations Basics" does not already exist anywhere as a stored
 *     microConcept string.
 *   - One pre-existing, UNRELATED data anomaly was found and is deliberately
 *     NOT touched here: RDX-159 is tagged tag_redox_3 but carries
 *     microConcept "Equivalent Weight & n-factor Concept" — the MOLE
 *     chapter's micro-name, not a redox one. Out of scope for this rename;
 *     flagged separately.
 *
 * Usage:
 *   node scripts/rename_redox3_micro_concepts.js --dry   # preview only
 *   node scripts/rename_redox3_micro_concepts.js         # write
 *
 * ROLLBACK: re-run with REVERSE=true (swaps old/new in both the taxonomy
 * file and the DB $set), or `git checkout` the taxonomy file plus run the
 * same script with REVERSE=true for the DB half. Non-destructive either way
 * — this only ever changes a `name` string, never an id, never deletes.
 */
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const DRY = process.argv.includes('--dry');
const REVERSE = process.env.REVERSE === 'true';

const TAXONOMY_PATH = path.join(__dirname, '../packages/data/taxonomy/taxonomyData_from_csv.ts');
const TAG_ID = 'tag_redox_3';

const RENAMES = [
  { id: 'micro_redox_3_1', from: 'Permanganometry', to: 'Titrations with KMnO₄ (Permanganometry)' },
  { id: 'micro_redox_3_2', from: 'Dichromatometry', to: 'Titrations with K₂Cr₂O₇ (Dichromatometry)' },
  { id: 'micro_redox_3_3', from: 'Iodometry', to: 'Indirect Iodine Titrations (Iodometry)' },
  { id: 'micro_redox_3_4', from: 'Iodimetry', to: 'Direct Iodine Titrations (Iodimetry)' },
  { id: 'micro_redox_3_5', from: 'Equivalent Weight in Redox', to: 'Finding Equivalent Weight in Redox Titrations' },
  { id: 'micro_redox_3_6', from: 'Redox Titration Calculations', to: 'Titration Calculations (Volume & Normality)' },
];

const NEW_MICRO = { id: 'micro_redox_3_7', name: 'Titrations Basics', parent_id: TAG_ID, type: 'micro_topic' };
const NEW_MICRO_LINE =
  `    { id: '${NEW_MICRO.id}', name: '${NEW_MICRO.name}', parent_id: '${NEW_MICRO.parent_id}', type: '${NEW_MICRO.type}' },`;

function activePairs() {
  return RENAMES.map((r) => (REVERSE ? { id: r.id, from: r.to, to: r.from } : r));
}

// ── 1. Taxonomy file: id-keyed rename (never matches on the old name text,
//    so this can't accidentally touch a different node that happens to share
//    a name) + insert/remove the new node. ─────────────────────────────────
function patchTaxonomyFile() {
  let src = fs.readFileSync(TAXONOMY_PATH, 'utf8');
  const pairs = activePairs();

  for (const { id, from, to } of pairs) {
    const lineRe = new RegExp(
      `\\{ id: '${id}', name: '[^']*', parent_id: '${TAG_ID}', type: 'micro_topic' \\},`
    );
    const match = src.match(lineRe);
    if (!match) throw new Error(`taxonomy line for ${id} not found or already changed`);
    if (!match[0].includes(`name: '${from}'`)) {
      throw new Error(`${id}: expected current name '${from}' but line is: ${match[0]}`);
    }
    const newLine = `{ id: '${id}', name: '${to}', parent_id: '${TAG_ID}', type: 'micro_topic' },`;
    src = src.replace(lineRe, newLine);
  }

  const anchorLine = `{ id: 'micro_redox_3_6', name: '${REVERSE ? RENAMES[5].from : RENAMES[5].to}', parent_id: '${TAG_ID}', type: 'micro_topic' },`;
  if (!REVERSE) {
    if (src.includes(NEW_MICRO.id)) {
      console.log(`  (${NEW_MICRO.id} already present — skipping insert)`);
    } else {
      if (!src.includes(anchorLine)) throw new Error('anchor line for insertion not found: ' + anchorLine);
      src = src.replace(anchorLine, `${anchorLine}\n${NEW_MICRO_LINE}`);
    }
  } else {
    const newLineRe = new RegExp(`\\n *\\{ id: '${NEW_MICRO.id}',[^\\n]*\\},`);
    if (src.match(newLineRe)) src = src.replace(newLineRe, '');
  }

  return src;
}

(async () => {
  console.log(REVERSE ? 'MODE: REVERSE (undo)' : 'MODE: FORWARD (apply)');
  console.log(DRY ? 'DRY RUN — no files or DB will be written\n' : 'LIVE RUN\n');

  // ── taxonomy file diff preview ──
  const before = fs.readFileSync(TAXONOMY_PATH, 'utf8');
  const after = patchTaxonomyFile();
  console.log('── Taxonomy file changes (packages/data/taxonomy/taxonomyData_from_csv.ts) ──');
  activePairs().forEach((p) => console.log(`  ${p.id}: "${p.from}" -> "${p.to}"`));
  if (!REVERSE) console.log(`  ${NEW_MICRO.id}: (new) "${NEW_MICRO.name}"`);
  else console.log(`  ${NEW_MICRO.id}: (removed)`);
  console.log(`  bytes: ${before.length} -> ${after.length}\n`);

  // ── DB dry-run counts ──
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');

  console.log('── questions_v2 backfill (metadata.microConcept), scoped to tag_redox_3 ──');
  let totalAffected = 0;
  const plan = [];
  for (const { from, to } of activePairs()) {
    const filter = { 'metadata.microConcept': from, 'metadata.tags.tag_id': TAG_ID, deleted_at: null };
    const count = await col.countDocuments(filter);
    totalAffected += count;
    plan.push({ filter, to, count, from });
    console.log(`  "${from}" -> "${to}"  :  ${count} document(s)`);
  }
  console.log(`  TOTAL: ${totalAffected} document(s) affected`);
  console.log(`  ROLLBACK: re-run with REVERSE=true env var (swaps every pair back).\n`);

  if (DRY) {
    console.log('--dry set — no files written, no DB writes performed.');
    await client.close();
    return;
  }

  // ── live writes ──
  fs.writeFileSync(TAXONOMY_PATH, after, 'utf8');
  console.log('✓ taxonomy file written');

  let totalModified = 0;
  for (const { filter, to, from } of plan) {
    const res = await col.updateMany(filter, { $set: { 'metadata.microConcept': to } });
    console.log(`  "${from}" -> "${to}": matched=${res.matchedCount} modified=${res.modifiedCount}`);
    totalModified += res.modifiedCount;
  }
  console.log(`✓ questions_v2 backfill complete — ${totalModified} document(s) modified`);

  await client.close();
})().catch((e) => { console.error(e); process.exit(1); });
