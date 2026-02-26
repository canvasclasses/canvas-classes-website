// Find POC questions with any chapter_id pattern
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function run() {
  console.log('\n=== FINDING POC QUESTIONS ===\n');
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('questions_v2');
    
    // Search for POC in display_id
    const pocByDisplayId = await collection.find({ 
      display_id: /^POC-/i 
    }).sort({ display_id: 1 }).toArray();
    
    console.log(`POC questions by display_id pattern: ${pocByDisplayId.length}`);
    
    if (pocByDisplayId.length > 0) {
      console.log('\nFirst 10:');
      pocByDisplayId.slice(0, 10).forEach(q => {
        console.log(`  ${q.display_id} - chapter: ${q.metadata.chapter_id} - ${q.metadata.exam_source.year}`);
      });
      
      console.log('\nLast 10:');
      pocByDisplayId.slice(-10).forEach(q => {
        console.log(`  ${q.display_id} - chapter: ${q.metadata.chapter_id} - ${q.metadata.exam_source.year}`);
      });
      
      // Check chapter_id values
      const chapterIds = new Set(pocByDisplayId.map(q => q.metadata.chapter_id));
      console.log('\nUnique chapter_ids:', Array.from(chapterIds));
    }
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
