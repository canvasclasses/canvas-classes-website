// READ-ONLY. Exports every Ch2 inline-quiz question with a globally-computed
// target answer position (to flatten the A/B/C/D distribution) and a length-tell
// flag. Output feeds the subagent authoring pass + the central apply script.
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const fs = require('fs');

const OUT = '/private/tmp/claude-501/-Users-CanvasClasses-Desktop-canvas/714cb4c6-699d-448f-acc3-919c9c4c41fa/scratchpad/ch2_quiz_in.json';

(async () => {
  const c = new MongoClient(process.env.MONGODB_URI); await c.connect();
  const db = c.db('crucible');
  const bk = await db.collection('books').findOne({ slug: 'ncert-simplified-12' });
  const pages = await db.collection('book_pages')
    .find({ book_id: bk._id, chapter_number: 2, deleted_at: null }).sort({ page_number: 1 }).toArray();

  const rows = [];
  for (const p of pages) {
    (p.blocks || []).forEach((b, bi) => {
      if (b.type === 'inline_quiz' && Array.isArray(b.questions)) {
        b.questions.forEach((q, qi) => {
          const lens = (q.options || []).map((o) => String(o).length);
          const others = lens.filter((_, i) => i !== q.correct_index);
          const lengthTell = q.correct_index != null && others.length && lens[q.correct_index] > Math.max(...others);
          rows.push({
            page: p.page_number, slug: p.slug, block: bi, qi, id: q.id,
            question: q.question, options: q.options, correct_index: q.correct_index,
            explanation: q.explanation, difficulty_level: q.difficulty_level ?? null,
            length_tell: !!lengthTell, n_options: (q.options || []).length,
          });
        });
      }
    });
  }

  // Global position plan: greedy least-used slot, so correct answers spread evenly.
  const used = [0, 0, 0, 0];
  for (const r of rows) {
    let best = 0;
    for (let s = 1; s < r.n_options; s++) if (used[s] < used[best]) best = s;
    r.target_index = best; used[best]++;
  }

  fs.writeFileSync(OUT, JSON.stringify(rows, null, 2));
  const tellCount = rows.filter((r) => r.length_tell).length;
  console.log(`Exported ${rows.length} questions to ${OUT}`);
  console.log(`Length-tell questions needing a rewrite: ${tellCount}`);
  console.log(`Target position plan (A/B/C/D): ${JSON.stringify(used)}`);
  await c.close();
})().catch((e) => { console.error(e); process.exit(1); });
