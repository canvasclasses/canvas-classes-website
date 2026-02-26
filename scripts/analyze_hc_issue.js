require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('questions_v2');
    
    const hcQuestions = await collection.find(
      { display_id: /^HC-/ },
      { projection: { display_id: 1, question_text: 1, metadata: 1, _id: 0 } }
    ).sort({ display_id: 1 }).toArray();
    
    console.log('=== DETAILED ANALYSIS OF HC QUESTIONS ===\n');
    console.log('Questions HC-015 to HC-030:\n');
    
    hcQuestions.slice(14, 30).forEach(q => {
      const preview = q.question_text.markdown.substring(0, 100).replace(/\n/g, ' ');
      const exam = q.metadata.exam_source;
      const year = exam.year;
      const marker = year === 2025 ? ' ⚠️ 2025 - SHOULD BE SKIPPED!' : '';
      console.log(`${q.display_id}: ${year}-${exam.month}-${exam.day}${marker}`);
      console.log(`   Preview: ${preview}...`);
      console.log('');
    });
    
    console.log('\n=== SUMMARY ===');
    const total2025 = hcQuestions.filter(q => q.metadata.exam_source.year === 2025).length;
    console.log(`Total HC questions: ${hcQuestions.length}`);
    console.log(`Questions from 2025: ${total2025}`);
    console.log(`Questions from 2024 and earlier: ${hcQuestions.length - total2025}`);
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
