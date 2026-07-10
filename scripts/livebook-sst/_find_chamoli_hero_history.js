'use strict';
const bw = require('../lib/book-writer');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';

async function main() {
  await bw.withDb(async (db) => {
    const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: 'landforms-and-disasters' });
    console.log('current page id:', page._id);
    const currentHero = (page.blocks || []).find((b) => b.id === 'ff04e412-74b1-4853-88c9-30269ebd9397');
    console.log('\n--- CURRENT ---');
    console.log(JSON.stringify({ src: currentHero.src, alt: currentHero.alt, caption: currentHero.caption, generation_prompt: currentHero.generation_prompt, aspect_ratio: currentHero.aspect_ratio }, null, 2));

    const versions = await db.collection('book_page_versions')
      .find({ page_id: page._id })
      .sort({ version: 1 })
      .toArray();
    console.log(`\nFound ${versions.length} historical versions`);
    for (const v of versions) {
      const heroBlock = (v.blocks || []).find((b) => b.id === 'ff04e412-74b1-4853-88c9-30269ebd9397');
      if (heroBlock) {
        console.log(`\n--- v${v.version} ---`);
        console.log(JSON.stringify({ src: heroBlock.src, alt: heroBlock.alt, caption: heroBlock.caption, generation_prompt: heroBlock.generation_prompt }, null, 2));
      }
    }
  });
}
main().catch((e) => { console.error(e); process.exit(1); });
