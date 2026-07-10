require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const bw = require('../lib/book-writer.js');

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db();
  const book = 'be7b5b7f-e993-4d3b-b9c8-52f7c308ab0e';
  const page = await db.collection('book_pages').findOne({ book_id: book, chapter_number: 7, page_number: 20 });
  if (!page) throw new Error('p20 not found');

  // deep clone blocks
  const blocks = JSON.parse(JSON.stringify(page.blocks || []));
  const pb = blocks.find(b => b.type === 'practice_bank');
  let target = null;
  for (const s of pb.sections) for (const it of (s.items||[])) if (it.id === 'ieq-ncert-7-66') target = it;
  if (!target) throw new Error('item 7-66 not found');

  const before = target.solution;
  let sol = target.solution;
  // 1) drop the part-(a) "*(Using NCERT rounding ...)*" hedge parenthetical
  sol = sol.replace(/\s*\*\(Using NCERT rounding[\s\S]*?\)\*/,'');
  // 2) drop the trailing NEEDS_REVIEW editorial paragraph
  const idx = sol.indexOf('NEEDS_REVIEW');
  if (idx !== -1) sol = sol.slice(0, idx).replace(/\s+$/,'');
  target.solution = sol;

  console.log('--- BEFORE (tail) ---\n', before.slice(-700));
  console.log('\n--- AFTER (tail) ---\n', sol.slice(-700));
  console.log(`\nlen ${before.length} -> ${sol.length}  (removed ${before.length - sol.length} chars)`);

  const dry = await bw.savePage(db, { pageId: page._id }, blocks, { dryRun: true, author: 'agent', summary: 'IEQ p20: clean NEEDS_REVIEW + NCERT-rounding hedge on item 7-66 (keep computed pH 12.63/1.30 per founder)' });
  console.log('\nDRY-RUN diff:', JSON.stringify(dry.diff), '| wouldBlock:', dry.wouldBlock);

  const APPLY = process.argv.includes('--apply');
  if (APPLY && !dry.wouldBlock) {
    const res = await bw.savePage(db, { pageId: page._id }, blocks, { author: 'agent', summary: 'IEQ p20: clean NEEDS_REVIEW + NCERT-rounding hedge on item 7-66 (keep computed pH 12.63/1.30 per founder)' });
    console.log('\nSAVED. version:', res.version);
  } else if (APPLY && dry.wouldBlock) {
    console.log('\nNOT SAVED — guard would block (content loss). Inspect before forcing.');
  } else {
    console.log('\n(dry run only — re-run with --apply to commit)');
  }
  await client.close();
})().catch(e => { console.error(e); process.exit(1); });
