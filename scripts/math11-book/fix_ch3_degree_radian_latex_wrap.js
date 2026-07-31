'use strict';
/* Class 11 Math · Ch.3 "Measuring Angles" page — the "Degree ↔ radian
   conversion" latex_block crammed three clauses onto one line:
     "π radian = 180°, so radian measure = π/180 × degree measure,
      degree measure = 180/π × radian measure"
   which overflowed its box and forced a horizontal scrollbar (founder-
   reported 2026-07-24, screenshot). No box-sizing fix alone solves this —
   the content itself needs to wrap. KaTeX display mode DOES support explicit
   line breaks inside a `gathered` environment, so this splits it into three
   short, centred rows instead of one long one.
   Purely a content edit via book-writer.savePage (versioned). Idempotent:
   skips if the block already uses \begin{gathered}.
   Run: node scripts/math11-book/fix_ch3_degree_radian_latex_wrap.js */
const bw = require('../lib/book-writer');

const SLUG = 'measuring-angles-degree-radian';
const NEW_LATEX =
  '\\begin{gathered} ' +
  '\\pi \\text{ radian} = 180^\\circ \\\\[6pt] ' +
  '\\text{radian measure} = \\frac{\\pi}{180} \\times \\text{degree measure} \\\\[6pt] ' +
  '\\text{degree measure} = \\frac{180}{\\pi} \\times \\text{radian measure} ' +
  '\\end{gathered}';

async function main() {
  await bw.withDb(async (db) => {
    const pages = db.collection('book_pages');
    const cur = await pages.findOne({ slug: SLUG });
    if (!cur) throw new Error(`page not found: ${SLUG}`);

    const idx = (cur.blocks || []).findIndex((b) => b.type === 'latex_block' && b.label === 'Degree ↔ radian conversion');
    if (idx === -1) throw new Error('target latex_block not found');

    if ((cur.blocks[idx].latex || '').includes('gathered')) {
      console.log('already wrapped — skipping (idempotent).');
      return;
    }

    const newBlocks = cur.blocks.map((b, i) => (i === idx ? { ...b, latex: NEW_LATEX } : b));

    const res = await bw.savePage(db, { slug: SLUG }, newBlocks, {
      author: 'agent',
      summary: 'Rewrote the "Degree ↔ radian conversion" latex_block as a 3-row `gathered` block instead of one long single-line expression — the single line overflowed its box and forced a horizontal scrollbar (founder-reported).',
    });
    console.log('SAVED', res.slug, 'version', res.version);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
