'use strict';
/**
 * Read-only hygiene detail for Ch.1: prose length-tells and explanations that
 * refer to an option by POSITION (those block a blind answer-position
 * rebalance, because permuting the options would make the wording wrong).
 *
 * Run: node scripts/physics11-book/_hygiene_report_ch1.js
 */
const { withDb } = require('../lib/book-writer');

const POSITIONAL = /\b(first|second|third|fourth|last)\s+(option|answer|choice)|option\s+[abcd]\b/i;
const isProse = (opts) => opts.every((o) => !o.includes('$'));

withDb(async (db) => {
  const book = await db.collection('books').findOne({ slug: 'class11-physics' });
  const pages = await db.collection('book_pages')
    .find({ book_id: book._id, chapter_number: 1, deleted_at: null }).toArray();
  pages.sort((a, b) => a.page_number - b.page_number);

  const proseTells = [], latexTells = [], positional = [];
  let total = 0, proseTotal = 0;

  const visit = (p, id, opts, ci, expl) => {
    if (!opts || opts.length !== 4) return;
    total++;
    const prose = isProse(opts);
    if (prose) proseTotal++;
    const lens = opts.map((o) => o.length);
    if (lens[ci] === Math.max(...lens) && new Set(lens).size > 1) {
      const rec = { page: p.page_number, id, ci, lens, correct: opts[ci].slice(0, 70) };
      (prose ? proseTells : latexTells).push(rec);
    }
    if (expl && POSITIONAL.test(expl)) {
      positional.push({ page: p.page_number, id, snippet: expl.match(POSITIONAL)[0] });
    }
  };

  for (const p of pages) {
    for (const b of p.blocks) {
      if (b.type === 'inline_quiz') {
        (b.questions || []).forEach((q, i) => visit(p, `quiz#${i}:${(q.question || '').slice(0, 44)}`, q.options, q.correct_index, q.explanation));
      }
      if (b.type === 'practice_bank') {
        for (const s of b.sections || []) for (const it of s.items || []) {
          if (it.kind === 'mcq') visit(p, it.id, it.options, it.correct_index, it.explanation);
        }
      }
    }
  }

  console.log(`\n4-option MCQs: ${total} (prose-only options: ${proseTotal})`);
  console.log(`\n=== PROSE LENGTH-TELLS (${proseTells.length}) — the ones that actually leak the answer ===`);
  proseTells.forEach((t) => console.log(`  p${t.page} ${t.id}\n      lens ${t.lens.join(',')} · correct[${t.ci}]: "${t.correct}"`));
  console.log(`\n=== LATEX-OPTION LENGTH-TELLS (${latexTells.length}) — string length is not a visual cue here ===`);
  latexTells.forEach((t) => console.log(`  p${t.page} ${t.id} · lens ${t.lens.join(',')}`));
  console.log(`\n=== EXPLANATIONS REFERRING TO A POSITION (${positional.length}) — must be reworded before permuting ===`);
  positional.forEach((t) => console.log(`  p${t.page} ${t.id} → "${t.snippet}"`));
  console.log('');
}).then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
