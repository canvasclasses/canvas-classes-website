// READ-ONLY. Exports every Class 12 Biology inline-quiz question with a
// globally-computed target answer position (to flatten the A/B/C/D distribution)
// and a length-tell flag. Output feeds the subagent authoring pass, then
// bio12_quiz_apply.js writes each page ONCE through book-writer.
//
// Mirrors the proven Chem Ch.2 pipeline (quiz_export.js -> subagents -> apply).
// Usage: node scripts/livebook-review/bio12_quiz_export.js <outDir>
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const BOOK = 'class12-biology';
const outDir = process.argv[2];
if (!outDir) { console.error('pass an output dir'); process.exit(1); }
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  const c = new MongoClient(process.env.MONGODB_URI); await c.connect();
  const db = c.db('crucible');
  const book = await db.collection('books').findOne({ slug: BOOK });
  const pages = await db.collection('book_pages')
    .find({ book_id: String(book._id), deleted_at: null }).toArray();
  pages.sort((a, b) => (a.chapter_number - b.chapter_number) || (a.page_number - b.page_number));

  // Pass 1 — collect every question.
  const rows = [];
  for (const p of pages) {
    for (const b of (p.blocks || [])) {
      if (b.type !== 'inline_quiz') continue;
      for (const q of (b.questions || [])) {
        const L = q.options.map((o) => o.length);
        const sorted = [...L].sort((x, y) => y - x);
        const isLongest = L[q.correct_index] === Math.max(...L);
        rows.push({
          chapter: p.chapter_number,
          page_id: p._id,
          page_number: p.page_number,
          page_title: p.title,
          block_id: b.id,
          id: q.id,
          question: q.question,
          options: q.options,
          correct_index: q.correct_index,
          correct_text: q.options[q.correct_index],
          explanation: q.explanation,
          difficulty_level: q.difficulty_level ?? null,
          // hygiene diagnostics
          option_lengths: L,
          length_tell: isLongest,
          tell_margin: isLongest ? sorted[0] - sorted[1] : 0,
          strict_tell: isLongest && (sorted[0] - sorted[1]) >= 8,
        });
      }
    }
  }

  // Pass 2 — deterministic global position plan: round-robin A/B/C/D in
  // chapter/page order so the whole book lands ~even without randomness.
  rows.forEach((r, i) => { r.target_index = i % 4; });

  // Write one file per chapter for the authoring subagents.
  const byCh = {};
  for (const r of rows) (byCh[r.chapter] = byCh[r.chapter] || []).push(r);
  for (const [ch, list] of Object.entries(byCh)) {
    fs.writeFileSync(path.join(outDir, `ch${ch}.json`), JSON.stringify(list, null, 2));
  }
  fs.writeFileSync(path.join(outDir, 'all.json'), JSON.stringify(rows, null, 2));

  const tell = rows.filter((r) => r.length_tell).length;
  const strict = rows.filter((r) => r.strict_tell).length;
  console.log(`exported ${rows.length} questions across ${Object.keys(byCh).length} chapters -> ${outDir}`);
  console.log(`  length_tell: ${tell}  |  strict_tell (>=8 chars): ${strict}`);
  await c.close();
})().catch((e) => { console.error(e); process.exit(1); });
