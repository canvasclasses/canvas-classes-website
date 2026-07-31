require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const S = new mongoose.Schema({}, { strict: false, _id: false });
const Post = mongoose.models.BlogPost || mongoose.model('BlogPost', new mongoose.Schema({}, { strict:false, collection:'blog_posts', _id:false }));
const Source = mongoose.models.BlogSource2 || mongoose.model('BlogSource2', new mongoose.Schema({}, { strict:false, collection:'blog_sources', _id:false }));

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const recent = await Post.find({}, { title:1, status:1, created_at:1, createdAt:1 }).sort({ _id:-1 }).limit(15).lean();
  console.log('=== RECENT POSTS ===');
  recent.forEach(p => console.log(`[${p.status}] ${p.title}`));

  const ids = ['7087c6d9-7507-4841-8ec3-c03ccc1229b7','1500a0e9-4edc-483e-860e-ebf503264eba'];
  const src = await Source.find({ _id: { $in: ids } }).lean();
  console.log('\n=== CANDIDATE SOURCES ===');
  src.forEach(s => console.log(JSON.stringify({ id:s._id, feed:s.feed_name||s.feed||s.source, url:s.url, title:s.title, summary:(s.summary||s.description||'').slice(0,600), published:s.published_at||s.pubDate })));
  await mongoose.disconnect();
}
main().catch(e=>{console.error(e);process.exit(1);});
