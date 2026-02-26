// Analyze current POC questions in database
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function run() {
  console.log('\n=== POC CURRENT DATABASE ANALYSIS ===\n');
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('questions_v2');
    
    // Get all POC questions
    const pocQuestions = await collection.find({ 
      'metadata.chapter_id': 'ch11_poc' 
    }).sort({ display_id: 1 }).toArray();
    
    console.log(`Total POC questions in DB: ${pocQuestions.length}`);
    console.log('\nFirst 10 questions:');
    pocQuestions.slice(0, 10).forEach(q => {
      console.log(`  ${q.display_id} - ${q.metadata.exam_source.year} ${q.metadata.exam_source.month}`);
    });
    
    console.log('\nLast 10 questions:');
    pocQuestions.slice(-10).forEach(q => {
      console.log(`  ${q.display_id} - ${q.metadata.exam_source.year} ${q.metadata.exam_source.month}`);
    });
    
    // Check for year distribution
    const yearCounts = {};
    pocQuestions.forEach(q => {
      const year = q.metadata.exam_source.year;
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    });
    
    console.log('\nYear distribution:');
    Object.keys(yearCounts).sort().forEach(year => {
      console.log(`  ${year}: ${yearCounts[year]} questions`);
    });
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
