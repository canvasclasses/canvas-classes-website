// POC Fresh Start: Delete ALL existing POC questions
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function freshStart() {
  console.log('\n=== POC FRESH START: DELETE ALL EXISTING ===\n');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('questions_v2');
    
    // Delete ALL POC questions (any display_id starting with POC)
    console.log('Deleting ALL existing POC questions...');
    const deleteResult = await collection.deleteMany({
      $or: [
        { display_id: /^POC-/ },
        { 'metadata.chapter_id': 'ch11_prac_org' }
      ]
    });
    
    console.log(`✅ Deleted ${deleteResult.deletedCount} POC questions`);
    
    // Verify
    const remaining = await collection.countDocuments({
      $or: [
        { display_id: /^POC-/ },
        { 'metadata.chapter_id': 'ch11_prac_org' }
      ]
    });
    
    console.log(`\n📊 Remaining POC questions: ${remaining}`);
    console.log(`✅ Database is clean and ready for fresh ingestion`);
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

freshStart();
