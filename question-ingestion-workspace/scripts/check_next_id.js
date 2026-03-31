// scripts/check_next_id.js
// Query the database to find the next available display_id for a given prefix

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

// Configuration - CHANGE THESE for your batch
const PREFIX = 'ALCO';  // Example: 'ALCO', 'MATR', 'COMP', etc.
const PATTERN = new RegExp(`^${PREFIX}-`);

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const col = client.db('crucible').collection('questions_v2');
    
    // Find the highest display_id for this prefix
    const docs = await col
      .find({ display_id: PATTERN })
      .sort({ display_id: -1 })
      .limit(1)
      .toArray();
    
    const lastId = docs[0]?.display_id;
    
    if (lastId) {
      // Extract the number and calculate next
      const match = lastId.match(/-(\d+)$/);
      if (match) {
        const lastNum = parseInt(match[1], 10);
        const nextNum = lastNum + 1;
        console.log(`✅ Last ID found: ${lastId}`);
        console.log(`📝 Next available: ${PREFIX}-${nextNum.toString().padStart(3, '0')}`);
        console.log(`📊 Range for new batch: ${PREFIX}-${nextNum.toString().padStart(3, '0')} to ${PREFIX}-${(nextNum + 7).toString().padStart(3, '0')}`);
      } else {
        console.log(`⚠️ Last ID format unexpected: ${lastId}`);
        console.log(`📝 Suggest starting with: ${PREFIX}-001`);
      }
    } else {
      console.log(`ℹ️ No existing IDs found for prefix: ${PREFIX}`);
      console.log(`📝 Suggest starting with: ${PREFIX}-001`);
    }
    
    // Also count total questions for this prefix
    const count = await col.countDocuments({ display_id: PATTERN });
    console.log(`📊 Total ${PREFIX} questions in database: ${count}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('MONGODB_URI')) {
      console.error('💡 Make sure .env.local file exists with MONGODB_URI');
    }
  } finally {
    await client.close();
  }
}

main();
