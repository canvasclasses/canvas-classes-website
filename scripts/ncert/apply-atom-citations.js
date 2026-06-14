#!/usr/bin/env node
// apply-atom-citations.js — prepend an "As per NCERT …" lead line to the solution of every
// Tier A/B ATOM question. Default = DRY RUN. Pass --commit to write. Pass --rollback to restore.
//
//   node scripts/ncert/apply-atom-citations.js            # dry run (no writes)
//   node scripts/ncert/apply-atom-citations.js --commit   # write + save backup
//   node scripts/ncert/apply-atom-citations.js --rollback # restore from backup
//
// Backup: scripts/_backup_atom_ncert_citations.json  ({ display_id, before } per touched doc)
// Idempotent: skips any solution that already starts with "**As per NCERT**".

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { MAP, buildCitation } = require('./atom-section-map');

const BACKUP = path.join(__dirname, '..', '_backup_atom_ncert_citations.json');
const MARKER = '**As per NCERT**';
const args = new Set(process.argv.slice(2));
const COMMIT = args.has('--commit');
const ROLLBACK = args.has('--rollback');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const Q = mongoose.connection.db.collection('questions_v2');

  if (ROLLBACK) {
    if (!fs.existsSync(BACKUP)) { console.error('No backup file found.'); process.exit(1); }
    const backup = JSON.parse(fs.readFileSync(BACKUP, 'utf8'));
    let restored = 0;
    for (const { display_id, before } of backup) {
      const r = await Q.updateOne({ display_id }, { $set: { 'solution.text_markdown': before } });
      if (r.modifiedCount) restored++;
    }
    console.log(`Rollback: restored ${restored}/${backup.length} solutions.`);
    await mongoose.disconnect();
    return;
  }

  const ids = Object.keys(MAP).filter(id => MAP[id][1] !== 'C'); // Tier A+B
  const docs = await Q.find({ display_id: { $in: ids } })
    .project({ display_id: 1, 'solution.text_markdown': 1 }).toArray();
  const byId = Object.fromEntries(docs.map(d => [d.display_id, d]));

  const plan = [];
  const skipped = { no_solution: [], already_cited: [], not_found: [] };
  for (const id of ids) {
    const d = byId[id];
    if (!d) { skipped.not_found.push(id); continue; }
    const cur = (d.solution && d.solution.text_markdown) || '';
    if (!cur.trim()) { skipped.no_solution.push(id); continue; }
    if (cur.trimStart().startsWith(MARKER)) { skipped.already_cited.push(id); continue; }
    const cite = buildCitation(id);
    plan.push({ display_id: id, before: cur, after: `${cite}\n\n${cur}` });
  }

  console.log(`Tier A+B ids: ${ids.length}`);
  console.log(`To update:    ${plan.length}`);
  console.log(`Skipped — no solution: ${skipped.no_solution.length}  | already cited: ${skipped.already_cited.length}  | not found: ${skipped.not_found.length}`);
  if (skipped.no_solution.length) console.log('  no-solution:', skipped.no_solution.join(','));
  if (skipped.not_found.length) console.log('  not-found:', skipped.not_found.join(','));

  console.log('\n--- 3 sample citations (lead line only) ---');
  for (const p of plan.slice(0, 3)) console.log(`${p.display_id}: ${buildCitation(p.display_id)}`);

  if (!COMMIT) { console.log('\nDRY RUN — no writes. Re-run with --commit to apply.'); await mongoose.disconnect(); return; }

  fs.writeFileSync(BACKUP, JSON.stringify(plan.map(p => ({ display_id: p.display_id, before: p.before })), null, 2));
  let updated = 0;
  for (const p of plan) {
    const r = await Q.updateOne({ display_id: p.display_id }, { $set: { 'solution.text_markdown': p.after } });
    if (r.modifiedCount) updated++;
  }
  console.log(`\nCOMMITTED: ${updated}/${plan.length} solutions updated. Backup → ${BACKUP}`);
  await mongoose.disconnect();
})().catch(e => { console.error(e.message); process.exit(1); });
