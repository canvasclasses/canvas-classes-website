require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('questions_v2');
    
    // Get all HC questions
    const allHC = await collection.find(
      { display_id: /^HC-/ },
      { projection: { display_id: 1, _id: 1 } }
    ).sort({ display_id: 1 }).toArray();
    
    // Filter to keep only HC-001 to HC-017
    const toDelete = allHC.filter(q => {
      const num = parseInt(q.display_id.replace('HC-', ''));
      return num >= 18;
    });
    
    console.log(`Total HC questions: ${allHC.length}`);
    console.log(`Questions to delete (HC-018+): ${toDelete.length}`);
    console.log(`Questions to keep (HC-001 to HC-017): ${allHC.length - toDelete.length}`);
    
    // Delete by _id
    const idsToDelete = toDelete.map(q => q._id);
    const result = await collection.deleteMany({
      _id: { $in: idsToDelete }
    });
    
    console.log(`\n✅ Deleted ${result.deletedCount} HC questions`);
    
    // Verify
    const remainingCount = await collection.countDocuments({ display_id: /^HC-/ });
    console.log(`📊 Remaining HC questions: ${remainingCount} (expected: 17)`);
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
