require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const Schema = new mongoose.Schema({}, { strict: false, collection: 'blog_posts' });
const M = mongoose.models.BlogPostCheck || mongoose.model('BlogPostCheck', Schema);
(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const recent = await M.find(
    { created_at: { $gte: new Date(Date.now() - 14 * 24 * 3600 * 1000) } },
    { title: 1, status: 1, tags: 1, created_at: 1 }
  ).sort({ created_at: -1 }).limit(40).lean();
  console.log(JSON.stringify(recent, null, 2));
  await mongoose.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
