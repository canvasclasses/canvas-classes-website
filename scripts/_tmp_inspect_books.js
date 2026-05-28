require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const Book = mongoose.connection.collection('books');
  const books = await Book.find({}).toArray();
  for (const b of books) {
    console.log(`\n=== ${b.title} (slug=${b.slug}, subject=${b.subject}, grade=${b.grade}, published=${b.is_published}) ===`);
    for (const ch of (b.chapters || [])) {
      console.log(`  ch.number=${ch.number}  pub=${ch.is_published}  slug=${ch.slug}  title="${ch.title}"  pages=${(ch.page_ids||[]).length}`);
    }
  }
  await mongoose.disconnect();
})();
