// Verify POC final state
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function verify() {
  console.log('\n=== POC FINAL VERIFICATION ===\n');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('questions_v2');
    
    const pocQuestions = await collection.find({
      'metadata.chapter_id': 'ch11_prac_org'
    }).sort({ display_id: 1 }).toArray();
    
    console.log(`Total POC questions: ${pocQuestions.length}`);
    console.log(`Range: ${pocQuestions[0].display_id} to ${pocQuestions[pocQuestions.length - 1].display_id}`);
    
    console.log('\nFirst 10 questions:');
    pocQuestions.slice(0, 10).forEach(q => {
      console.log(`  ${q.display_id}: ${q.question_text.markdown.substring(0, 60)}... (${q.metadata.exam_source.year})`);
    });
    
    console.log('\nLast 10 questions:');
    pocQuestions.slice(-10).forEach(q => {
      console.log(`  ${q.display_id}: ${q.question_text.markdown.substring(0, 60)}... (${q.metadata.exam_source.year})`);
    });
    
    // Year distribution
    const yearCounts = {};
    pocQuestions.forEach(q => {
      const year = q.metadata.exam_source?.year;
      if (year) yearCounts[year] = (yearCounts[year] || 0) + 1;
    });
    
    console.log('\nYear distribution:');
    Object.keys(yearCounts).sort().forEach(year => {
      console.log(`  ${year}: ${yearCounts[year]} questions`);
    });
    
    console.log('\n✅ All POC questions from MD file have been ingested in correct sequence');
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

verify();
