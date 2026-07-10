// Orchestrator for the Class 12 "The d- and f-Block Elements" chapter (new ch#5
// of `ncert-simplified-12`). Ensures the chapter exists, then globs ./pages/*.js
// (each exports { page_number, chapter, slug, title, subtitle, tags, build(h) })
// and upserts each page (insert new / update existing by slug), linking it to
// the chapter's page_ids. Reuses the shared block helpers from scripts/ceq.
// published:false on all new pages. Dry-run by default; pass --apply to write.
//
// NCERT-FIDELITY CHAPTER (inorganic founder-rule): core content is transcribed
// faithfully from NCERT (same language/equations/numbers); enrichment from the
// founder's notes lives only in clearly-marked callouts. Two extra devices woven
// in: a "🔍 Decode This" assertion-reason trainer (NCERT sentence-pair → exam
// question) and an "🏛️ Exam Vault" (a real verified JEE/NEET PYQ shown next to
// the NCERT line it comes from). See _agents/plans/DFBLOCK_BUILD.md.
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const { makeHelpers, uuidv4 } = require('../ceq/_helpers');

const APPLY = process.argv.includes('--apply');
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').replace('--only=', ''); // build one slug
const CH = 5;
const CH_TITLE = 'Ch. 5 | The d- and f-Block Elements';
const CH_SLUG = 'd-and-f-block-elements';
const CH_DESC = 'The transition (d-block) and inner-transition (f-block) elements — electronic configurations, periodic trends, oxidation states, magnetic & colour properties, K2Cr2O7 & KMnO4, the lanthanoids & actinoids. Full NCERT Class 12, with a "Decode This" assertion-reason trainer, colour/magnetic memory aids, and a curated Exam Vault of real JEE/NEET PYQs.';

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  const booksCol = db.collection('books');
  const pagesCol = db.collection('book_pages');
  const book = await booksCol.findOne({ slug: 'ncert-simplified-12' });
  console.log(APPLY ? '=== APPLY ===' : '=== DRY-RUN (pass --apply) ===');

  // 1. ensure the chapter exists
  let ci = book.chapters.findIndex((c) => c.number === CH);
  if (ci === -1) {
    console.log(`Chapter ${CH} "${CH_TITLE}" — [NEW]`);
    if (APPLY) {
      const chapter = { number: CH, title: CH_TITLE, slug: CH_SLUG, description: CH_DESC, is_published: false, page_ids: [] };
      await booksCol.updateOne({ _id: book._id }, { $push: { chapters: chapter } });
      book.chapters.push(chapter);
      ci = book.chapters.length - 1;
    } else {
      book.chapters.push({ number: CH, title: CH_TITLE, slug: CH_SLUG, page_ids: [] });
      ci = book.chapters.length - 1;
    }
  } else {
    console.log(`Chapter ${CH} exists — ${(book.chapters[ci].page_ids || []).length} pages`);
  }

  // 2. load page modules
  const dir = path.join(__dirname, 'pages');
  if (!fs.existsSync(dir)) { console.log('(no pages/ dir yet)'); await client.close(); return; }
  let files = fs.readdirSync(dir).filter((f) => f.endsWith('.js')).sort();
  const modules = files.map((f) => require(path.join(dir, f)));

  for (const m of modules) {
    if (ONLY && m.slug !== ONLY) continue;
    const h = makeHelpers();
    const blocks = m.build(h);
    const existing = await pagesCol.findOne({ book_id: String(book._id), slug: m.slug });
    const contentTypes = [...new Set(blocks.map((b) => b.type))];
    console.log(`\nCh.${CH} p${m.page_number} "${m.slug}" — ${blocks.length} blocks ${existing ? '[update]' : '[NEW]'}`);
    console.log(`   ${contentTypes.join(', ')}`);
    if (!APPLY) continue;

    let _id;
    const common = {
      page_number: m.page_number, deleted_at: null,
      title: m.title, subtitle: m.subtitle || '', page_type: 'lesson',
      tags: m.tags || [], content_types: contentTypes,
      reading_time_min: m.reading_time_min || Math.max(3, Math.round(blocks.length / 3)),
      blocks, updated_at: new Date(),
    };
    if (existing) {
      await pagesCol.updateOne({ _id: existing._id }, { $set: common });
      _id = existing._id;
    } else {
      _id = uuidv4();
      await pagesCol.insertOne({ _id, book_id: String(book._id), chapter_number: CH, page_number: m.page_number, slug: m.slug, published: false, created_at: new Date(), ...common });
    }
    const pageIds = [...(book.chapters[ci].page_ids || [])];
    if (!pageIds.includes(_id)) { pageIds.push(_id); await booksCol.updateOne({ _id: book._id }, { $set: { [`chapters.${ci}.page_ids`]: pageIds } }); book.chapters[ci].page_ids = pageIds; }
    console.log(`  ✓ ${existing ? 'updated' : 'created'} ${_id}`);
  }
  await client.close();
})().catch((e) => { console.error(e); process.exit(1); });
