require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const Schema = new mongoose.Schema({}, { strict: false, collection: 'blog_posts' });
const M = mongoose.models.BlogPostRead || mongoose.model('BlogPostRead', Schema);
(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const id = process.argv[2];
  const doc = await M.findOne({ _id: id }).lean();
  console.log(doc.content);
  await mongoose.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
