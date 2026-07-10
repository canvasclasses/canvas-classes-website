require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const bw = require('../lib/book-writer.js');
(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db();
  const book = 'be7b5b7f-e993-4d3b-b9c8-52f7c308ab0e';
  const page = await db.collection('book_pages').findOne({ book_id: book, chapter_number: 7, page_number: 20 });
  const blocks = JSON.parse(JSON.stringify(page.blocks || []));
  const pb = blocks.find(b => b.type === 'practice_bank');
  let edited = [];
  for (const s of pb.sections) for (const it of (s.items||[])) {
    if (it.solution && it.solution.includes('NEEDS_REVIEW')) {
      const i = it.solution.indexOf('NEEDS_REVIEW');
      it.solution = it.solution.slice(0, i).replace(/\s+$/,'');
      edited.push(it.id);
    }
  }
  console.log('Items cleaned this pass:', edited);
  if (!edited.length) { console.log('nothing to do'); await client.close(); return; }
  const dry = await bw.savePage(db, { pageId: page._id }, blocks, { dryRun: true });
  console.log('DRY diff:', JSON.stringify(dry.diff), '| wouldBlock:', dry.wouldBlock);
  if (process.argv.includes('--apply') && !dry.wouldBlock) {
    const res = await bw.savePage(db, { pageId: page._id }, blocks, { author: 'agent', summary: 'IEQ p20: strip trailing NEEDS_REVIEW caveat on item 7-67 (keep computed Table-7.9 solubilities per founder)' });
    console.log('SAVED version', res.version);
  } else console.log('(dry only)');
  await client.close();
})().catch(e=>{console.error(e);process.exit(1);});
