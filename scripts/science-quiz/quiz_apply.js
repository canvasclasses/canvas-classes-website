'use strict';
/**
 * Write the edited _ch<ch>_quiz.json back into the book_pages, matching each
 * question by (page_slug, block_id, q_id). Only touches question fields
 * (question / options / correct_index / explanation / difficulty_level).
 *
 *   node scripts/science-quiz/quiz_apply.js <ch> [--dry]
 */
const fs = require('fs');
const { withBook, savePageBlocks } = require('../science-practice/_lib');

const ch = Number(process.argv[2]);
const DRY = process.argv.includes('--dry');
if (!ch) { console.error('Usage: node quiz_apply.js <ch> [--dry]'); process.exit(1); }

const data = JSON.parse(fs.readFileSync(`scripts/science-quiz/_ch${ch}_quiz.json`, 'utf8'));

(async () => {
  await withBook(async ({ pages, allPages }) => {
    const byPage = {};
    for (const it of data.items) (byPage[it.page_slug] = byPage[it.page_slug] || []).push(it);

    let pagesUpdated = 0, qUpdated = 0, missing = 0;
    for (const [slug, items] of Object.entries(byPage)) {
      const page = allPages.find((p) => p.slug === slug && p.chapter_number === ch);
      if (!page) { console.log(`  ✗ page not found: ${slug}`); missing++; continue; }
      const blocks = (page.blocks || []).map((b) => ({ ...b }));
      for (const it of items) {
        const blk = blocks.find((b) => b.id === it.block_id);
        if (!blk || blk.type !== 'inline_quiz') { console.log(`  ✗ block: ${slug}/${it.block_id}`); missing++; continue; }
        const q = (blk.questions || []).find((x) => x.id === it.q_id);
        if (!q) { console.log(`  ✗ q: ${slug}/${it.q_id}`); missing++; continue; }
        if (!Array.isArray(it.options) || it.options.length !== 4) { console.log(`  ✗ ${slug} q${it.q_index}: not 4 options`); missing++; continue; }
        q.question = it.question;
        q.options = it.options;
        q.correct_index = it.correct_index;
        q.explanation = it.explanation;
        if (it.difficulty_level != null) q.difficulty_level = it.difficulty_level;
        qUpdated++;
      }
      if (!DRY) await savePageBlocks(pages, page._id, blocks);
      pagesUpdated++;
    }
    console.log(`${DRY ? '[DRY] ' : ''}Ch${ch}: ${qUpdated} questions across ${pagesUpdated} pages updated${missing ? `, ${missing} MISSING` : ''}`);
  });
})().catch((e) => { console.error(e); process.exit(1); });
