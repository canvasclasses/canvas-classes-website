'use strict';
/* Class 11 Math · Ch.5 Linear Inequalities — SYLLABUS-SCOPE HONESTY NOTE.
   The real NCERT PDF (rationalised 2023-24 edition), read for the first time this
   session, shows the chapter's actual spine is ONLY:
     5.1 Introduction
     5.2 Inequalities (definitions/notation)
     5.3 Algebraic Solutions of Linear Inequalities in One Variable and their
         Graphical Representation (number-line only)
     Miscellaneous Examples/Exercise (systems of ONE-variable inequalities +
       three word-problem families)
   There is NO "graphical solution of linear inequalities in two variables" or
   "system of linear inequalities in two variables" section at all in this
   edition — that content was cut in the rationalisation. But this Live Book's
   pages 2-4 ("Graphing a Linear Inequality", "Systems of Two...", "Systems of
   Three...") teach exactly that cut content, because it was originally built
   against an assumed (pre-rationalisation-style) spine before the real PDF was
   available. See the chapter plan doc for the full history.

   Per CLAUDE.md §0.6 this content is NOT deleted (it's mathematically sound,
   well-built, and the reference implementation for the math_graph regions[]
   capability) — instead this script ADDS one honest, additive 'note' callout
   at the top of page 2, right after the existing "Did You Know" callout,
   clarifying the syllabus scope so the chapter never misrepresents itself as a
   literal transcription of the current NCERT textbook.

   Purely additive (new block, nothing removed) — passes the content-loss guard
   trivially. Idempotent: skips if the note is already present.
   Run: node scripts/math11-book/reconcile_ch5_syllabus_note.js */
const bw = require('../lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const NOTE_MARKDOWN =
  'A quick heads-up on scope: the current **rationalised NCERT textbook (2023-24 edition)** covers only ' +
  '**one-variable** linear inequalities in this chapter — the two-variable graphing and systems content on ' +
  'this page and the next two pages was **trimmed out of the official Class 11 syllabus** in that ' +
  'rationalisation. We have kept it here as a **deliberate extension**, because shading a half-plane and ' +
  'overlapping regions is exactly the skill **Linear Programming** (a later chapter) builds on, and it shows ' +
  'up often in competitive-exam and practical contexts. Nothing here is fabricated NCERT content — it is just ' +
  'clearly **beyond** what the current textbook exercise sets cover, which is why you will not find matching ' +
  'exercise numbers for it in the practice bank at the end of this chapter.';

async function main() {
  await bw.withDb(async (db) => {
    const pages = db.collection('book_pages');
    const cur = await pages.findOne({ slug: 'graphing-a-linear-inequality' });
    if (!cur) throw new Error('page not found: graphing-a-linear-inequality');

    const already = (cur.blocks || []).some(
      (blk) => blk.type === 'callout' && /rationalised NCERT textbook/.test(blk.markdown || ''),
    );
    if (already) { console.log('note already present — skipping (idempotent).'); return; }

    const sorted = [...(cur.blocks || [])].sort((a, b) => a.order - b.order);
    const insertAfterIdx = sorted.findIndex((blk) => blk.type === 'callout' && blk.order === 1);
    if (insertAfterIdx === -1) throw new Error('expected callout at order 1 not found — aborting to avoid a blind insert');

    const noteBlock = {
      id: uuidv4(), type: 'callout', variant: 'note', title: 'A Note on Scope',
      markdown: NOTE_MARKDOWN,
    };

    const withNote = [
      ...sorted.slice(0, insertAfterIdx + 1),
      noteBlock,
      ...sorted.slice(insertAfterIdx + 1),
    ];
    const newBlocks = withNote.map((blk, i) => ({ ...blk, order: i }));

    const res = await bw.savePage(db, { slug: 'graphing-a-linear-inequality' }, newBlocks, {
      author: 'agent',
      summary: 'Added an honest syllabus-scope callout clarifying that 2-variable graphing/systems content (pages 2-4) is an extension beyond the rationalised 2023-24 NCERT Ch.5, which is one-variable only — found on reading the real source PDF for the first time.',
    });
    console.log('SAVED', res.slug, 'version', res.version, 'blocks:', newBlocks.length);
  });
}

if (require.main === module) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
