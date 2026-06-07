'use strict';
const dotenv = require('dotenv'); dotenv.config({ path: '.env.local' });
const crypto = require('crypto');
const { MongoClient } = require('mongodb');
const DRY = process.argv.includes('--dry');
(async () => {
  const c = new MongoClient(process.env.MONGODB_URI); await c.connect();
  const db = c.db('crucible');
  const book = await db.collection('books').findOne({ slug: 'class9-science' });
  const page = await db.collection('book_pages').findOne({ book_id: String(book._id), slug: 'balanced-and-unbalanced-forces' });
  if (!page) throw new Error('page not found');
  if ((page.blocks||[]).some(b => b.type==='simulation' && b.simulation_id==='free-body-diagram')) {
    console.log('already present; nothing to do'); await c.close(); return;
  }
  const blocks = [...page.blocks];
  const quizIdx = blocks.findIndex(b => b.type === 'inline_quiz');
  const at = quizIdx === -1 ? blocks.length : quizIdx;
  const sim = { id: crypto.randomUUID(), type: 'simulation', order: 0, simulation_id: 'free-body-diagram', title: 'Free-Body Challenge' };
  blocks.splice(at, 0, sim);
  blocks.forEach((b, i) => { b.order = i; });
  const content_types = [...new Set([...(page.content_types||[]), 'simulation'])];
  console.log(`${DRY?'[DRY] ':''}insert free-body-diagram at index ${at}; page now ${blocks.length} blocks`);
  if (!DRY) await db.collection('book_pages').updateOne({ _id: page._id }, { $set: { blocks, content_types, updated_at: new Date() } });
  await c.close();
})().catch(e => { console.error(e); process.exit(1); });
