// Orchestrator for the Chemical Equilibrium (Ch.6) page build.
// Globs scripts/ceq/pages/*.js (each exports {page_number, slug, title, subtitle,
// page_type, build(h)}), builds each with fresh helpers, and upserts to the
// ncert-simplified book chapter 6 (insert new / update-blocks if slug exists),
// linking new pages into chapters[6].page_ids. published:false.
// Dry-run by default; pass --apply to write. One DB connection, sequential, no races.
//   node scripts/ceq/build_chapter.js            # dry-run (plan)
//   node scripts/ceq/build_chapter.js --apply    # write
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const { makeHelpers, uuidv4 } = require('./_helpers');

const BOOK_SLUG = 'ncert-simplified';
const CH = 6;
const APPLY = process.argv.includes('--apply');

(async () => {
  const dir = path.join(__dirname, 'pages');
  if (!fs.existsSync(dir)) { console.error('no pages/ dir yet'); process.exit(1); }
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js')).sort();
  const modules = files.map(f => require(path.join(dir, f))).sort((a, b) => a.page_number - b.page_number);
  if (!modules.length) { console.error('no page modules found in pages/'); process.exit(1); }

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  const booksCol = db.collection('books');
  const pagesCol = db.collection('book_pages');
  const book = await booksCol.findOne({ slug: BOOK_SLUG });
  const ci = (book.chapters || []).findIndex(c => c.number === CH);
  if (ci === -1) throw new Error(`chapter ${CH} not found`);
  let pageIds = [...(book.chapters[ci].page_ids || [])];

  console.log(`Ch.${CH} "${book.chapters[ci].title}" — ${pageIds.length} pages currently; ${modules.length} module(s) to upsert`);
  console.log(APPLY ? '\n=== APPLY ===' : '\n=== DRY-RUN (pass --apply) ===');

  for (const m of modules) {
    const h = makeHelpers();
    const blocks = m.build(h);
    const existing = await pagesCol.findOne({ book_id: String(book._id), slug: m.slug });
    console.log(`\n— p${m.page_number} "${m.slug}" (${m.page_type || 'lesson'}) — ${blocks.length} blocks${existing ? ' [update]' : ' [NEW]'}`);
    blocks.forEach(b => console.log(`    [${String(b.order).padStart(2)}] ${b.type}${b.variant ? '/' + b.variant : ''} :: ${(b.title || b.label || b.text || b.prompt || (b.markdown || '').slice(0, 48) || b.generation_prompt || '').toString().replace(/\s+/g, ' ').slice(0, 50)}`));
    if (!APPLY) continue;
    if (existing) {
      await pagesCol.updateOne({ _id: existing._id }, { $set: { blocks, title: m.title, subtitle: m.subtitle, page_type: m.page_type || 'lesson', reading_time_min: Math.max(2, Math.round(blocks.length * 0.8)), updated_at: new Date() } });
      if (!pageIds.includes(existing._id)) pageIds.push(existing._id);
      console.log(`    ✓ updated ${existing._id}`);
    } else {
      const _id = uuidv4();
      await pagesCol.insertOne({ _id, book_id: String(book._id), chapter_number: CH, page_number: m.page_number, slug: m.slug, title: m.title, subtitle: m.subtitle, page_type: m.page_type || 'lesson', blocks, tags: [], published: false, reading_time_min: Math.max(2, Math.round(blocks.length * 0.8)), created_at: new Date(), updated_at: new Date() });
      pageIds.push(_id);
      console.log(`    ✓ created ${_id}`);
    }
  }

  if (APPLY) {
    await booksCol.updateOne({ _id: book._id }, { $set: { [`chapters.${ci}.page_ids`]: pageIds, updated_at: new Date() } });
    console.log(`\n✓ Ch.${CH} linked to ${pageIds.length} pages.`);
  } else {
    console.log('\nDRY-RUN done. Re-run with --apply to write (published:false).');
  }
  await client.close();
})().catch(e => { console.error(e); process.exit(1); });
