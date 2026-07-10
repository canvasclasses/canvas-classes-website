'use strict';
const bw = require('../lib/book-writer');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';

function walk(blocks, path, hits) {
  for (const b of blocks) {
    if (b.aspect_ratio) {
      hits.push({ path, type: b.type, id: b.id, alt: b.alt, aspect_ratio: b.aspect_ratio, items: b.items ? b.items.length : undefined });
    }
    if (Array.isArray(b.blocks)) walk(b.blocks, path, hits);
  }
}

async function main() {
  await bw.withDb(async (db) => {
    const pages = await db.collection('book_pages').find({ book_id: BOOK_ID, deleted_at: null }).toArray();
    const hits = [];
    for (const p of pages) {
      walk(p.blocks || [], p.slug, hits);
    }
    console.log(JSON.stringify(hits, null, 2));
    console.log(`\nTotal blocks with aspect_ratio set: ${hits.length}`);
  });
}
main().catch((e) => { console.error(e); process.exit(1); });
