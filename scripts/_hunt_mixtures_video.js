'use strict';
// READ-ONLY hunt for the deleted Class 11 Chem Ch.1 mixtures section + its video.
// Run: node scripts/_hunt_mixtures_video.js
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  const pages = db.collection('book_pages');
  const books = db.collection('books');

  // 1. Find the Class 11 chem book.
  const book = await books.findOne({ slug: 'ncert-simplified' });
  console.log(`BOOK: ${book?.title} (_id=${book?._id})`);
  const ch1 = (book?.chapters || []).find((c) => c.number === 1);
  console.log(`Ch1 "${ch1?.title}" page_ids: ${ch1?.page_ids?.length}`);

  // 2. Every Ch1 page: list video + audio_note + image blocks with src.
  console.log('\n=== VIDEO / AUDIO / IMAGE blocks across Ch1 pages ===');
  const ch1pages = await pages.find({ book_id: book._id, chapter_number: 1 }).toArray();
  for (const p of ch1pages.sort((a,b)=>a.page_number-b.page_number)) {
    const media = (p.blocks||[]).filter(b => ['video','audio_note','image'].includes(b.type));
    const vids = media.filter(b => b.type==='video');
    const auds = media.filter(b => b.type==='audio_note');
    if (vids.length || auds.length) {
      console.log(`\n[p${p.page_number}] ${p.slug} (${p.title})`);
      for (const v of vids) console.log(`   VIDEO src=${v.src || v.url || v.youtube_id || '(none)'} title="${v.title||v.caption||''}"`);
      for (const a of auds) console.log(`   AUDIO src=${a.src || a.url || a.audio_url || '(none)'} title="${a.title||a.caption||''}"`);
    }
  }

  // 3. ANY page (any book) whose content mentions the brine/sand homogeneity demo or mixtures classification.
  console.log('\n=== Pages mentioning brine / "sand or dirt" / homogeneous-sample demo (any book) ===');
  const hits = await pages.find({
    $or: [
      { 'blocks.markdown': { $regex: 'brine|sand or dirt|same composition|homogeneous mixture', $options: 'i' } },
      { title: { $regex: 'mixture|pure substance|classification of matter', $options: 'i' } },
    ],
  }).project({ slug:1, title:1, book_id:1, chapter_number:1, page_number:1, deleted_at:1 }).limit(30).toArray();
  for (const h of hits) console.log(`   ${h.slug} | "${h.title}" | book=${h.book_id===book._id?'THIS':h.book_id} ch${h.chapter_number} p${h.page_number} ${h.deleted_at?'[DELETED '+h.deleted_at+']':''}`);

  // 4. Any soft-deleted pages in this book.
  console.log('\n=== Soft-deleted pages in this book ===');
  const del = await pages.find({ book_id: book._id, deleted_at: { $ne: null } }).project({ slug:1, title:1, chapter_number:1, deleted_at:1 }).toArray();
  if (!del.length) console.log('   (none)');
  for (const d of del) console.log(`   ${d.slug} "${d.title}" ch${d.chapter_number} deleted ${d.deleted_at}`);

  await client.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
