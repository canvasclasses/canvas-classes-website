'use strict';
/**
 * Reusable inspector for the finish-Science prose-enrichment pass.
 *   node scripts/science-augment/_dump.js <chapterNumber>
 * Prints every page's block sequence (with text/callout lengths + previews) so
 * the per-page enrichment builders can be authored against the real structure.
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const CH = Number(process.argv[2]);
if (!CH) { console.error('usage: node _dump.js <chapterNumber>'); process.exit(2); }

(async () => {
  const c = new MongoClient(process.env.MONGODB_URI);
  await c.connect();
  try {
    const db = c.db('crucible');
    const book = await db.collection('books').findOne({ slug: 'class9-science' });
    const pages = await db.collection('book_pages')
      .find({ book_id: String(book._id), chapter_number: CH })
      .sort({ page_number: 1 }).toArray();
    for (const p of pages) {
      console.log(`\n================ p${p.page_number} ${p.slug} (pub:${p.published}) ================`);
      for (const b of (p.blocks || [])) {
        if (b.type === 'text') console.log(`[TEXT ${(b.markdown || '').length}c] ${(b.markdown || '').slice(0, 240)}`);
        else if (b.type === 'heading') console.log(`[H] ${b.text}`);
        else if (b.type === 'callout') console.log(`[CALLOUT ${b.variant} "${b.title}" ${(b.markdown || '').length}c] ${(b.markdown || '').slice(0, 160)}`);
        else if (b.type === 'latex_block') console.log(`[LATEX] ${b.latex || b.markdown || ''}`);
        else if (b.type === 'worked_example') console.log(`[WORKED_EXAMPLE] ${JSON.stringify(b).length}c`);
        else console.log(`[${b.type}]`);
      }
    }
  } finally { await c.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
