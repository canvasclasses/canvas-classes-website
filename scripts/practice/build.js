// Build the two end-of-chapter Practice pages (NCERT Exemplar bank).
//   ./p_ceq.js → Ch.6 Chemical Equilibrium practice page
//   ./p_ieq.js → Ch.7 Ionic Equilibrium practice page
// Each module exports { page_number, chapter, slug, title, subtitle, build(h) }
// and returns blocks (a single practice_bank block via h.bank(...)). published:false.
// Dry-run by default; pass --apply to write. Standalone (does NOT touch other pages).
require('dotenv').config({ path: '.env.local' });
const path = require('path');
const { MongoClient } = require('mongodb');
const { makeHelpers, uuidv4 } = require('../ceq/_helpers');

const APPLY = process.argv.includes('--apply');
const MODULES = ['./p_ceq.js', './p_ieq.js'].map(f => require(path.join(__dirname, f)));

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  const booksCol = db.collection('books');
  const pagesCol = db.collection('book_pages');
  const book = await booksCol.findOne({ slug: 'ncert-simplified' });
  console.log(APPLY ? '=== APPLY ===' : '=== DRY-RUN (pass --apply) ===');

  for (const m of MODULES) {
    const ci = book.chapters.findIndex((c) => c.number === m.chapter);
    if (ci === -1) { console.error(`chapter ${m.chapter} not found`); continue; }
    const h = makeHelpers();
    const blocks = m.build(h);
    const bank = blocks.find((b) => b.type === 'practice_bank');
    const nItems = bank ? bank.sections.reduce((s, sec) => s + sec.items.length, 0) : 0;
    const existing = await pagesCol.findOne({ book_id: String(book._id), slug: m.slug });
    console.log(`\nCh.${m.chapter} p${m.page_number} "${m.slug}" — ${blocks.length} blocks · ${bank ? bank.sections.length : 0} sections · ${nItems} items ${existing ? '[update]' : '[NEW]'}`);
    if (bank) bank.sections.forEach((s) => console.log(`   • ${s.title} (${s.items.length})`));
    if (!APPLY) continue;

    let _id;
    if (existing) {
      await pagesCol.updateOne({ _id: existing._id }, { $set: { blocks, title: m.title, subtitle: m.subtitle, page_type: 'lesson', reading_time_min: 18, updated_at: new Date() } });
      _id = existing._id;
    } else {
      _id = uuidv4();
      await pagesCol.insertOne({ _id, book_id: String(book._id), chapter_number: m.chapter, page_number: m.page_number, slug: m.slug, title: m.title, subtitle: m.subtitle, page_type: 'lesson', blocks, tags: [], published: false, reading_time_min: 18, created_at: new Date(), updated_at: new Date() });
    }
    const pageIds = [...(book.chapters[ci].page_ids || [])];
    if (!pageIds.includes(_id)) { pageIds.push(_id); await booksCol.updateOne({ _id: book._id }, { $set: { [`chapters.${ci}.page_ids`]: pageIds } }); book.chapters[ci].page_ids = pageIds; }
    console.log(`  ✓ ${existing ? 'updated' : 'created'} ${_id}`);
  }
  await client.close();
})().catch((e) => { console.error(e); process.exit(1); });
