require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('questions_v2');
    
    // Find all HC questions from 2025
    const hc2025Questions = await collection.find(
      { 
        display_id: /^HC-/,
        'metadata.exam_source.year': 2025
      },
      { projection: { display_id: 1, metadata: 1, _id: 0 } }
    ).sort({ display_id: 1 }).toArray();
    
    console.log('=== HC QUESTIONS FROM 2025 TO BE DELETED ===\n');
    hc2025Questions.forEach(q => {
      const exam = q.metadata.exam_source;
      console.log(`${q.display_id}: ${exam.year}-${exam.month}-${exam.day}`);
    });
    
    console.log(`\nTotal questions to delete: ${hc2025Questions.length}`);
    
    // Delete them
    const result = await collection.deleteMany({
      display_id: /^HC-/,
      'metadata.exam_source.year': 2025
    });
    
    console.log(`\n✅ Deleted ${result.deletedCount} HC questions from 2025`);
    
    // Verify remaining count
    const remainingCount = await collection.countDocuments({ display_id: /^HC-/ });
    console.log(`\n📊 Remaining HC questions: ${remainingCount}`);
    console.log(`Expected: 122 questions from 2024 and earlier`);
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
