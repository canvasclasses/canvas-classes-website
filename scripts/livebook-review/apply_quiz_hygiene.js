// Central apply: merges the subagent authoring outputs with the global position
// plan and writes each Ch2 page ONCE through book-writer (versioned, reversible).
// Sets, per quiz question: rebalanced answer position (even A/B/C/D), difficulty
// tag, and (for length-tell questions) the rewritten distractors.
// Dry-run by default; pass --apply to write.
const fs = require('fs');
const bw = require('../lib/book-writer');

const SCRATCH = '/private/tmp/claude-501/-Users-CanvasClasses-Desktop-canvas/714cb4c6-699d-448f-acc3-919c9c4c41fa/scratchpad';
const APPLY = process.argv.includes('--apply');
const must = (c, m) => { if (!c) throw new Error('SAFETY: ' + m); };

const inRows = JSON.parse(fs.readFileSync(`${SCRATCH}/ch2_quiz_in.json`, 'utf8'));
const byId = Object.fromEntries(inRows.map((r) => [r.id, r]));

// merge subagent outputs
const out = {};
for (const b of ['b1', 'b2', 'b3', 'b4', 'b5']) {
  const arr = JSON.parse(fs.readFileSync(`${SCRATCH}/ch2_quiz_out_${b}.json`, 'utf8'));
  for (const o of arr) { must(!out[o.id], `duplicate id across batches: ${o.id}`); out[o.id] = o; }
}
// coverage: every input question must be covered + tagged
for (const r of inRows) {
  must(out[r.id], `missing subagent output for ${r.id} (p${r.page})`);
  must([1, 2, 3].includes(out[r.id].difficulty_level), `bad difficulty for ${r.id}`);
}

function rebuild(q) {
  const o = out[q.id]; const meta = byId[q.id];
  const eff = o.rewrite ? o.rewrite.options : q.options;
  const ci = o.rewrite ? o.rewrite.correct_index : q.correct_index;
  must(Array.isArray(eff) && eff.length === meta.n_options, `option count mismatch for ${q.id}`);
  must(eff[ci] != null, `correct option missing for ${q.id}`);
  const correctText = eff[ci];
  const others = eff.filter((_, i) => i !== ci);
  const target = meta.target_index;
  const newOpts = [];
  let oi = 0;
  for (let s = 0; s < eff.length; s++) newOpts[s] = (s === target) ? correctText : others[oi++];
  // verify: correct sits at target, and it is NOT the strict-longest option
  must(newOpts[target] === correctText, `placement error for ${q.id}`);
  const lens = newOpts.map((x) => String(x).length);
  const tell = lens[target] > Math.max(...lens.filter((_, i) => i !== target));
  return { options: newOpts, correct_index: target, difficulty_level: o.difficulty_level, tell };
}

(async () => {
  await bw.withDb(async (db) => {
    const pages = db.collection('book_pages');
    const bk = await db.collection('books').findOne({ slug: 'ncert-simplified-12' });
    const pageDocs = await pages.find({ book_id: bk._id, chapter_number: 2, deleted_at: null }).sort({ page_number: 1 }).toArray();

    const finalPos = [0, 0, 0, 0]; let tellLeft = 0, saved = 0;
    for (const p of pageDocs) {
      let touched = false;
      const blocks = JSON.parse(JSON.stringify(p.blocks));
      for (const b of blocks) {
        if (b.type === 'inline_quiz' && Array.isArray(b.questions)) {
          for (const q of b.questions) {
            const r = rebuild(q);
            q.options = r.options; q.correct_index = r.correct_index; q.difficulty_level = r.difficulty_level;
            finalPos[r.correct_index]++; if (r.tell) tellLeft++;
            touched = true;
          }
        }
      }
      if (!touched) continue;
      const dry = await bw.savePage(db, { pageId: p._id }, blocks, { dryRun: true });
      must(!dry.wouldBlock, `content-loss guard would block p${p.page_number}: ${dry.diff.reasons.join('; ')}`);
      if (APPLY) {
        const res = await bw.savePage(db, { pageId: p._id }, blocks, {
          author: 'agent:chem-review',
          summary: 'Quiz hygiene: rebalance answer positions (even A/B/C/D), break length-tells, add difficulty tags',
        });
        saved++; console.log(`  p${p.page_number} saved v${res.version}`);
      }
    }
    console.log(`\nFinal correct-answer spread A/B/C/D: ${JSON.stringify(finalPos)}`);
    console.log(`Length-tells remaining: ${tellLeft}`);
    console.log(APPLY ? `\n✅ Applied to ${saved} pages.` : '\n(dry-run — re-run with --apply)');
  });
})().catch((e) => { console.error('\n❌', e.message); process.exit(1); });
