require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('questions_v2');
    
    // Find all HC questions from HC-018 onwards
    const hcToDelete = await collection.find(
      { display_id: /^HC-/ },
      { projection: { display_id: 1, _id: 0 } }
    ).sort({ display_id: 1 }).toArray();
    
    const toDelete = hcToDelete.filter(q => {
      const num = parseInt(q.display_id.replace('HC-', ''));
      return num >= 18;
    });
    
    console.log(`Found ${toDelete.length} HC questions from HC-018 onwards to delete`);
    
    // Delete them
    const result = await collection.deleteMany({
      display_id: /^HC-(0[1-9][8-9]|[1-9][0-9]{2,})$/
    });
    
    console.log(`✅ Deleted ${result.deletedCount} HC questions from HC-018 onwards`);
    
    // Verify remaining count
    const remainingCount = await collection.countDocuments({ display_id: /^HC-/ });
    console.log(`\n📊 Remaining HC questions: ${remainingCount} (should be 17)`);
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
