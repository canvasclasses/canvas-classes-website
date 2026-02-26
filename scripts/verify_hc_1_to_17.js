require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('questions_v2');
    
    const hcQuestions = await collection.find(
      { display_id: /^HC-0(0[1-9]|1[0-7])$/ },
      { projection: { display_id: 1, question_text: 1, metadata: 1, _id: 0 } }
    ).sort({ display_id: 1 }).toArray();
    
    console.log('=== HC-001 to HC-017 (TO BE PRESERVED) ===\n');
    hcQuestions.forEach(q => {
      const preview = q.question_text.markdown.substring(0, 80).replace(/\n/g, ' ');
      const exam = q.metadata.exam_source;
      console.log(`${q.display_id}: ${exam.year}-${exam.month}-${exam.day}`);
      console.log(`   ${preview}...`);
      console.log('');
    });
    
    console.log(`\nTotal HC-001 to HC-017: ${hcQuestions.length}`);
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
