// Build the Class 12 Ch.5 "The d- and f-Block Elements" end-of-chapter Practice page.
//   ./p_dblock.js → the practice_bank page (all 38 NCERT exercises, 5 themed sections)
// Targets book `ncert-simplified-12`, chapter number 5. published:false.
// Standalone & additive — creates/updates ONLY the d-and-f-block-practice page; never
// touches the 21 existing content pages. Dry-run by default; pass --apply.
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { makeHelpers, uuidv4 } = require('../ceq/_helpers');

const APPLY = process.argv.includes('--apply');
const m = require('./p_dblock.js');

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  const booksCol = db.collection('books');
  const pagesCol = db.collection('book_pages');
  const book = await booksCol.findOne({ slug: 'ncert-simplified-12' });
  console.log(APPLY ? '=== APPLY ===' : '=== DRY-RUN (pass --apply) ===');

  const ci = book.chapters.findIndex((c) => c.number === m.chapter);
  if (ci === -1) { console.error(`chapter ${m.chapter} not found`); process.exit(1); }
  const h = makeHelpers();
  const blocks = m.build(h);
  const bank = blocks.find((b) => b.type === 'practice_bank');
  const nItems = bank ? bank.sections.reduce((s, sec) => s + sec.items.length, 0) : 0;
  const existing = await pagesCol.findOne({ book_id: String(book._id), slug: m.slug });
  console.log(`\nCh.${m.chapter} p${m.page_number} "${m.slug}" — ${blocks.length} blocks · ${bank.sections.length} sections · ${nItems} items ${existing ? '[update]' : '[NEW]'}`);
  bank.sections.forEach((s) => console.log(`   • ${s.title} (${s.items.length})`));
  if (!APPLY) { await client.close(); return; }

  let _id;
  const common = { page_number: m.page_number, deleted_at: null, title: m.title, subtitle: m.subtitle, page_type: 'lesson', tags: m.tags || [], content_types: ['practice_bank'], reading_time_min: 25, blocks, updated_at: new Date() };
  if (existing) {
    await pagesCol.updateOne({ _id: existing._id }, { $set: common });
    _id = existing._id;
  } else {
    _id = uuidv4();
    await pagesCol.insertOne({ _id, book_id: String(book._id), chapter_number: m.chapter, page_number: m.page_number, slug: m.slug, published: false, created_at: new Date(), ...common });
  }
  const pageIds = [...(book.chapters[ci].page_ids || [])];
  if (!pageIds.includes(_id)) { pageIds.push(_id); await booksCol.updateOne({ _id: book._id }, { $set: { [`chapters.${ci}.page_ids`]: pageIds } }); }
  console.log(`  ✓ ${existing ? 'updated' : 'created'} ${_id}`);
  await client.close();
})().catch((e) => { console.error(e); process.exit(1); });
