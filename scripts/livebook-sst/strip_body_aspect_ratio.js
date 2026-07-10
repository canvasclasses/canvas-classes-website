'use strict';
// Founder feedback (2026-07-08): "On all the pages, most of the images are
// not in their natural aspect ratio, and you have forced a specific aspect
// ratio for most images... Keep all images in their natural aspect ratio by
// default."
//
// Scope: strip `aspect_ratio` from every BODY-content image/gallery block
// (block index > 0) added this session, so ImageBlockRenderer's existing
// natural-fallback and GalleryBlockRenderer's new natural-fallback (this
// session's code fix) take over. Block[0] (the hero banner) is deliberately
// left untouched — `aspect_ratio: '16:5'` there is a documented, platform-wide
// convention (BOOK_PAGE_WORKFLOW.md §3.4.1), confirmed in use across 9 other
// Live Books, not something invented for this book.
const bw = require('../lib/book-writer');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';

async function main() {
  await bw.withDb(async (db) => {
    const pages = await db.collection('book_pages').find({ book_id: BOOK_ID, deleted_at: null }).toArray();
    let totalStripped = 0;
    for (const page of pages) {
      let changed = false;
      const stripped = [];
      const updatedBlocks = page.blocks.map((b, i) => {
        if (i > 0 && b.aspect_ratio) {
          changed = true;
          stripped.push(`${b.type}${b.alt ? ` (${b.alt})` : ''} [was ${b.aspect_ratio}]`);
          const { aspect_ratio, ...rest } = b;
          return rest;
        }
        return b;
      });
      if (!changed) continue;
      const res = await bw.savePage(db, { slug: page.slug }, updatedBlocks, {
        author: 'agent',
        summary: `Stripped forced aspect_ratio from ${stripped.length} body-content block(s) so real photos/diagrams render at natural proportions instead of being cropped (hero banner at block[0] left untouched — documented 16:5 convention)`,
      });
      totalStripped += stripped.length;
      console.log(`✓ ${page.slug} — stripped ${stripped.length} (v${res.version})`);
      stripped.forEach((s) => console.log(`    - ${s}`));
    }
    console.log(`\nTotal blocks fixed: ${totalStripped}`);
  });
}
main().catch((e) => { console.error(e); process.exit(1); });
