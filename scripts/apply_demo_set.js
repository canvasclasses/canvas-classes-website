/**
 * scripts/apply_demo_set.js
 *
 * Stage 3 of the demo-curation pipeline. Reads one or more
 * scripts/output/demo_set_<chapter>.json proposals (from
 * propose_demo_set.js) and applies them to questions_v2 by setting
 * metadata.is_demo_question on the chosen IDs.
 *
 * Convergence semantics — running this script is idempotent:
 *   - For each chapter in a proposal, looks at the current set of demo
 *     questions in that chapter.
 *   - SETs is_demo_question=true on IDs that are in the proposal but
 *     not currently flagged.
 *   - UNSETs is_demo_question on IDs that ARE currently flagged but
 *     are NOT in the proposal.
 *   - Touches nothing on IDs that match.
 *
 * Re-runs after manual edits to the JSON converge cleanly.
 *
 * Per-question quality gate (mirrors the gate in /api/v2/questions/[id]):
 *   - solution.text_markdown ≥ 200 chars after trim
 *   - solution.latex_validated === true
 * Any picked ID that fails the gate at apply time is REJECTED — it stays
 * unflagged and is reported. This protects against stale proposals.
 *
 * Snapshot + AuditLog per chapter. Dry-run by default; --apply to commit.
 *
 * Usage:
 *   node scripts/apply_demo_set.js scripts/output/demo_set_ch11_mole.json
 *   node scripts/apply_demo_set.js scripts/output/demo_set_*.json --apply
 */

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

function readProposal(filePath) {
  const txt = fs.readFileSync(filePath, 'utf8');
  const j = JSON.parse(txt);
  if (!j.chapterId || !Array.isArray(j.questions)) {
    throw new Error(`Invalid proposal file: ${filePath}`);
  }
  return j;
}

async function applyForChapter(proposal, questions, auditLogs, opts) {
  const { apply } = opts;
  const chapterId = proposal.chapterId;

  // Current demo flag state in this chapter
  const currentDocs = await questions
    .find({
      'metadata.chapter_id': chapterId,
      'metadata.is_demo_question': true,
      deleted_at: null,
    })
    .project({ _id: 1, display_id: 1 })
    .toArray();
  const currentSet = new Set(currentDocs.map((d) => String(d._id)));

  // Proposed IDs
  const proposedIds = proposal.questions.map((q) => String(q._id));
  const proposedSet = new Set(proposedIds);

  // Set difference: to-add and to-remove
  const toAdd = proposedIds.filter((id) => !currentSet.has(id));
  const toRemove = [...currentSet].filter((id) => !proposedSet.has(id));

  // Quality gate check for to-add — fetch their current state and verify
  const candidateDocs = await questions
    .find({
      _id: { $in: toAdd },
      status: 'published',
      deleted_at: null,
    })
    .project({
      _id: 1,
      display_id: 1,
      'solution.text_markdown': 1,
      'solution.latex_validated': 1,
      flags: 1,
    })
    .toArray();
  const candidateById = new Map(candidateDocs.map((d) => [String(d._id), d]));

  const accepted = [];
  const rejected = [];
  for (const id of toAdd) {
    const d = candidateById.get(id);
    if (!d) {
      rejected.push({ id, reason: 'not found / not published' });
      continue;
    }
    const txt = (d.solution?.text_markdown || '').trim();
    if (txt.length < 200) {
      rejected.push({ id, display_id: d.display_id, reason: `solution too short (${txt.length} chars)` });
      continue;
    }
    if (d.solution?.latex_validated !== true) {
      rejected.push({ id, display_id: d.display_id, reason: 'latex_validated !== true' });
      continue;
    }
    if (Array.isArray(d.flags) && d.flags.some((f) => !f.resolved)) {
      rejected.push({ id, display_id: d.display_id, reason: 'unresolved flag' });
      continue;
    }
    accepted.push(id);
  }

  // ── Summary ─────────────────────────────────────────────────────────────
  console.log(`\n── ${chapterId} ──`);
  console.log(`  Current demo count:   ${currentSet.size}`);
  console.log(`  Proposed:             ${proposedSet.size}`);
  console.log(`  SET (new + accepted): ${accepted.length}`);
  console.log(`  UNSET (removed):      ${toRemove.length}`);
  console.log(`  Rejected (gate fail): ${rejected.length}`);
  if (rejected.length > 0) {
    console.log('  Reasons:');
    for (const r of rejected.slice(0, 10)) {
      console.log(`    ${r.display_id || r.id}: ${r.reason}`);
    }
    if (rejected.length > 10) console.log(`    … and ${rejected.length - 10} more`);
  }

  if (!apply) {
    return { chapterId, accepted: accepted.length, rejected: rejected.length, removed: toRemove.length };
  }

  if (accepted.length === 0 && toRemove.length === 0) {
    console.log(`  No changes to apply.`);
    return { chapterId, accepted: 0, rejected: rejected.length, removed: 0 };
  }

  // Snapshot before mutating
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const snapDir = path.join(__dirname, '_snapshots');
  if (!fs.existsSync(snapDir)) fs.mkdirSync(snapDir, { recursive: true });
  const snapPath = path.join(snapDir, `apply_demo_set_${chapterId}_${ts}_before.json`);
  const affected = await questions
    .find({ _id: { $in: [...accepted, ...toRemove] } })
    .project({ _id: 1, display_id: 1, 'metadata.is_demo_question': 1, version: 1 })
    .toArray();
  fs.writeFileSync(snapPath, JSON.stringify(affected, null, 2));
  console.log(`  Snapshot → ${snapPath}`);

  // Apply SET
  let setCount = 0;
  for (const id of accepted) {
    const r = await questions.updateOne(
      { _id: id },
      {
        $set: {
          'metadata.is_demo_question': true,
          updated_at: new Date(),
          updated_by: 'apply_demo_set.js',
        },
        $inc: { version: 1 },
      }
    );
    if (r.modifiedCount === 1) setCount++;
  }

  // Apply UNSET
  let unsetCount = 0;
  for (const id of toRemove) {
    const r = await questions.updateOne(
      { _id: id },
      {
        $set: {
          'metadata.is_demo_question': false,
          updated_at: new Date(),
          updated_by: 'apply_demo_set.js',
        },
        $inc: { version: 1 },
      }
    );
    if (r.modifiedCount === 1) unsetCount++;
  }

  // AuditLog — one entry per chapter
  await auditLogs.insertOne({
    _id: uuidv4(),
    entity_type: 'question_batch',
    entity_id: chapterId,
    action: 'apply_demo_set',
    changes: [
      { field: 'metadata.is_demo_question', old_value: 'multi', new_value: `+${setCount}/-${unsetCount}` },
    ],
    user_id: 'apply-demo-set-script',
    user_email: 'apply_demo_set.js',
    timestamp: new Date(),
    can_rollback: true,
    rollback_data: {
      snapshot_path: snapPath,
      set_count: setCount,
      unset_count: unsetCount,
      rejected_count: rejected.length,
      chapterId,
    },
  });

  console.log(`  Applied: SET ${setCount}, UNSET ${unsetCount}`);

  return { chapterId, accepted: setCount, rejected: rejected.length, removed: unsetCount };
}

// ── Main ──────────────────────────────────────────────────────────────────
(async () => {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const files = args.filter((a) => !a.startsWith('--'));

  if (files.length === 0) {
    console.error('Usage: node scripts/apply_demo_set.js <proposal.json> [<proposal.json> ...] [--apply]');
    process.exit(1);
  }

  const mode = apply ? 'APPLY' : 'DRY-RUN';
  console.log(`\n[${mode}] Applying demo sets from ${files.length} proposal file(s)\n`);

  const proposals = files.map(readProposal);

  // Sanity: warn if any proposal is more than 7 days old
  for (const p of proposals) {
    if (p.generatedAt) {
      const ageDays = (Date.now() - new Date(p.generatedAt).getTime()) / (1000 * 60 * 60 * 24);
      if (ageDays > 7) {
        console.log(`  ⚠️  ${p.chapterId} proposal is ${ageDays.toFixed(1)} days old. Consider re-running the proposer.`);
      }
    }
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db();
  const questions = db.collection('questions_v2');
  const auditLogs = db.collection('auditlogs');

  const results = [];
  for (const p of proposals) {
    const r = await applyForChapter(p, questions, auditLogs, { apply });
    results.push(r);
  }

  // Final audit — re-count is_demo_question per chapter
  if (apply) {
    console.log('\n────── POST-APPLY AUDIT ──────');
    for (const r of results) {
      const n = await questions.countDocuments({
        'metadata.chapter_id': r.chapterId,
        'metadata.is_demo_question': true,
        deleted_at: null,
      });
      console.log(`  ${r.chapterId}: ${n} demo questions live`);
    }

    console.log('\nTo invalidate the side-by-side cached endpoint immediately, hit:');
    for (const r of results) {
      console.log(`  curl -X POST localhost:3000/api/v2/admin/revalidate -H 'Content-Type: application/json' \\`);
      console.log(`       -d '{"path":"/api/v2/notes-quicktest/${r.chapterId}"}'`);
    }
    console.log('\n(Otherwise the 24h ISR will refresh on its own.)');
  } else {
    console.log('\n[DRY-RUN] No writes performed. Re-run with --apply to commit.');
  }

  await client.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
