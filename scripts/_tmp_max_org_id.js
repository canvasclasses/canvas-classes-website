const d = require('dotenv'); d.config({ path: '.env.local' });
const m = require('mongoose');
(async () => {
  await m.connect(process.env.MONGODB_URI);
  const r = await m.connection.db.collection('flashcards').find({ flashcard_id: /^FLASH-ORG-/ }).sort({ flashcard_id: -1 }).limit(3).toArray();
  r.forEach(x => console.log(x.flashcard_id, x.chapter.name));
  await m.disconnect();
})();
