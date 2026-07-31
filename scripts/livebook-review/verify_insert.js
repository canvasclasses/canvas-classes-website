// Verifies a chapter's practice page: wired correctly, is the chapter's last
// page, and its module is a true no-op against Mongo (idempotency check).
// Usage: node verify_insert.js <chapterNumber>
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const path = require('path');
const bw = require('../bio-book/../lib/book-writer.js');
const ch = Number(process.argv[2]);
(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  const book = await db.collection('books').findOne({ slug: 'class11-biology' });
  const chapEntry = book.chapters.find(c => c.number === ch);
  const page = await db.collection('book_pages').findOne({ book_id: String(book._id), chapter_number: ch, slug: `ch${ch}-practice-ncert-exercises` });
  const wired = page ? chapEntry.page_ids.map(String).includes(String(page._id)) : false;
  const isLast = page ? String(chapEntry.page_ids[chapEntry.page_ids.length - 1]) === String(page._id) : false;
  console.log(`ch${ch}: exists=${!!page} wired=${wired} isLastPage=${isLast} totalPagesInChapter=${chapEntry.page_ids.length}`);
  const mod = require(path.join(__dirname, '..', 'bio-book', '_practice', `ch${ch}.js`));
  const diff = bw.diffPage(page.blocks, mod.blocks);
  console.log(`ch${ch}: idempotency check — lossDetected=${diff.lossDetected}, removed=${diff.removedBlockIds.length}, added=${diff.addedBlockIds.length}`);
  await client.close();
})().catch(e => { console.error(e); process.exit(1); });
