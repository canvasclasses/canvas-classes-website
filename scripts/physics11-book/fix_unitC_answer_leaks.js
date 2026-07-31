'use strict';
/**
 * Browser-QA fix, 2026-07-29 — TWO "your turn" exercises were unanswerable-wrong:
 * the board's own readout panel printed the exact number the numeric exercise
 * asked for, so the question could be answered by reading, not thinking.
 *
 *   p27 "Your turn — read the resultant"  → readout showed  |R| 10.0 N
 *   p30 "Adding by components"            → readout showed  |R| 10.0 N
 *
 * Fixes:
 *   p27 — turn readout + formula OFF on the your-turn board. The numeric's
 *         worked_reveal already shows the full substitution after answering.
 *   p30 — that board IS the lesson (the î/ĵ column table is the whole point), so
 *         it keeps its readouts and LOSES the numeric; a separate your-turn
 *         board is appended with readouts off, matching p27/p29/p32.
 *
 * Run:  node scripts/physics11-book/fix_unitC_answer_leaks.js [--dry]
 */
const { savePage, withDb, computeReadingTime, computeContentTypes } = require('../lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const dryRun = process.argv.includes('--dry');

const NEW_P30_BOARD = {
  id: uuidv4(),
  type: 'vector_board',
  order: 0, // re-numbered on splice
  title: 'Your turn — add these two',
  archetype: 'analytical-addition',
  units: 'N',
  params: { max_mag: 15 },
  vectors: [
    { label: 'A', mag: 9, angle: 0, color: 'indigo', draggable: true },
    { label: 'B', mag: 12, angle: 90, color: 'amber', draggable: true },
  ],
  show: { components: true, readout: false, formula: false },
  caption: 'A 9 N force along x and a 12 N force along y. Work out the resultant before revealing.',
  numeric: {
    prompt: 'What is the magnitude of the resultant of these two forces, in newtons?',
    answer: 15,
    tolerance: 0.3,
    unit: 'N',
    worked_reveal:
      '$ R_x = 9 $ and $ R_y = 12 $, since each force lies neatly along an axis.\n\n' +
      '$ |\\vec{R}| = \\sqrt{9^2 + 12^2} = \\sqrt{81 + 144} = \\sqrt{225} = 15\\ \\mathrm{N} $\n\n' +
      'This is the 3-4-5 triangle scaled by 3. Spotting that saves you the arithmetic entirely — 9, 12, 15 should read as instantly as 3, 4, 5.',
  },
};

withDb(async (db) => {
  const pages = db.collection('book_pages');

  // ── p27: silence the readout on the your-turn board ────────────────────────
  const p27 = await pages.findOne({ slug: 'parallelogram-law-of-vector-addition' });
  if (!p27) throw new Error('p27 not found');
  const b27 = [...p27.blocks].sort((a, c) => a.order - c.order).map((blk) =>
    blk.type === 'vector_board' && blk.numeric
      ? { ...blk, show: { ...(blk.show || {}), readout: false, formula: false } }
      : blk
  );
  const r27 = await savePage(db, { slug: p27.slug }, b27, {
    author: 'unitC-qa-fix', summary: 'Your-turn board no longer prints the answer it asks for', dryRun,
    extraSet: { reading_time_min: computeReadingTime(b27), content_types: computeContentTypes(b27) },
  });
  console.log(`  p27: ${dryRun ? (r27.wouldBlock ? '!! WOULD BLOCK ' + JSON.stringify(r27.diff.reasons) : 'ok') : 'saved'}`);

  // ── p30: strip the numeric off the teaching board, append a your-turn board ─
  const p30 = await pages.findOne({ slug: 'analytical-method-of-vector-addition' });
  if (!p30) throw new Error('p30 not found');
  const sorted = [...p30.blocks].sort((a, c) => a.order - c.order);
  if (sorted.some((x) => x.type === 'vector_board' && /Your turn/.test(x.title || ''))) {
    console.log('  p30: already patched — skipping');
  } else {
    const stripped = sorted.map((blk) => {
      if (blk.type !== 'vector_board' || !blk.numeric) return blk;
      const { numeric, ...rest } = blk;
      return rest;
    });
    const quizIdx = stripped.findIndex((x) => x.type === 'inline_quiz');
    if (quizIdx < 0) throw new Error('p30: expected an inline_quiz to insert before');
    const merged = [
      ...stripped.slice(0, quizIdx),
      NEW_P30_BOARD,
      ...stripped.slice(quizIdx),
    ].map((blk, i) => ({ ...blk, order: i }));
    const r30 = await savePage(db, { slug: p30.slug }, merged, {
      author: 'unitC-qa-fix', summary: 'Move the numeric off the teaching board onto its own your-turn board', dryRun,
      extraSet: { reading_time_min: computeReadingTime(merged), content_types: computeContentTypes(merged) },
    });
    console.log(`  p30: ${dryRun ? (r30.wouldBlock ? '!! WOULD BLOCK ' + JSON.stringify(r30.diff.reasons) : 'ok') : 'saved'} (${p30.blocks.length} → ${merged.length} blocks)`);
  }
}).then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
