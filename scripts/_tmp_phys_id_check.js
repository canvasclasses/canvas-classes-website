const dotenv = require('dotenv'); dotenv.config({ path: '.env.local' });
const mongoose = require('mongoose');
(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const c = mongoose.connection.db.collection('flashcards');
  const top = await c.find({ flashcard_id: /^FLASH-PHY-/ }).sort({ flashcard_id: -1 }).limit(5).toArray();
  console.log('Top FLASH-PHY ids:');
  top.forEach(t => console.log(' ', t.flashcard_id, '|', t.chapter.name));
  await mongoose.disconnect();
})();
