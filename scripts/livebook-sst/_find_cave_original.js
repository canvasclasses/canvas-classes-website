'use strict';
const bw = require('../lib/book-writer');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';

async function main() {
  await bw.withDb(async (db) => {
    const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: 'underground-water-caves-and-karst-landscapes' });
    console.log('current page id:', page._id, 'current version:', page.version);
    const versions = await db.collection('book_page_versions')
      .find({ page_id: page._id })
      .sort({ version: 1 })
      .toArray();
    console.log(`Found ${versions.length} historical versions`);
    for (const v of versions) {
      const heroBlock = (v.blocks || []).find((b) => b.id === '0f4678ed-2428-4e1a-a022-d73fa4531cc6' || (b.type === 'image' && /cave/i.test(b.alt || '')));
      if (heroBlock) {
        console.log(`\n--- v${v.version} ---`);
        console.log(JSON.stringify({ id: heroBlock.id, src: heroBlock.src, alt: heroBlock.alt, caption: heroBlock.caption, generation_prompt: heroBlock.generation_prompt }, null, 2));
      }
    }
  });
}
main().catch((e) => { console.error(e); process.exit(1); });
