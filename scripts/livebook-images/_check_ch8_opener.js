require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const book = '69fbc73e-8f2c-4cf2-a678-c9fd41a1e706';
  const page = await db.collection('book_pages').findOne({ book_id: book, chapter_number: 8, slug: 'structure-of-the-atom-opener' });
  console.log('page_number:', page.page_number, 'slug:', page.slug, 'title:', page.title);
  const b = page.blocks.find(b => b.id === '7b2a7817-'.slice(0,-1) || b.id.startsWith('7b2a7817'));
  console.log(JSON.stringify(b, null, 2));
  await mongoose.disconnect();
})().catch(e=>{console.error(e);process.exit(1);});
