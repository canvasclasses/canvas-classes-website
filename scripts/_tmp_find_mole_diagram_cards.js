const dotenv = require('dotenv'); dotenv.config({ path: '.env.local' });
const mongoose = require('mongoose');
(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const c = mongoose.connection.db.collection('flashcards');
  const r = await c.find({ 'chapter.id': 'ch11_mole', $or: [
    { question: /hydrocarbon.*burnt|eudiometer/i },
    { question: /isotope.*abundance.*Cl/i },
  ] }, { projection: { flashcard_id: 1, topic: 1, question: 1 } }).toArray();
  r.forEach(x => console.log(x.flashcard_id, '|', x.topic.name, '|', x.question.slice(0, 110)));
  await mongoose.disconnect();
})();
