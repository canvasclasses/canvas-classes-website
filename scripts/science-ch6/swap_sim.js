'use strict';
const dotenv = require('dotenv'); dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const DRY = process.argv.includes('--dry');
(async () => {
  const c = new MongoClient(process.env.MONGODB_URI); await c.connect();
  const db = c.db('crucible');
  const book = await db.collection('books').findOne({ slug: 'class9-science' });
  const page = await db.collection('book_pages').findOne({ book_id: String(book._id), slug: 'balanced-and-unbalanced-forces' });
  const blocks = page.blocks.map(b => ({ ...b }));
  const sim = blocks.find(b => b.type === 'simulation');
  if (!sim) throw new Error('no simulation block on page');
  console.log(`current sim: ${sim.simulation_id} → newtons-motion-lab`);
  sim.simulation_id = 'newtons-motion-lab';
  sim.title = "Newton's Motion Lab";
  if (!DRY) await db.collection('book_pages').updateOne({ _id: page._id }, { $set: { blocks, updated_at: new Date() } });
  console.log(DRY ? '[DRY]' : '✅ swapped');
  await c.close();
})().catch(e => { console.error(e); process.exit(1); });
