const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '../.env.local' });

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI not set in .env.local');
const client = new MongoClient(uri);

async function checkAllCollections() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas\n');
    
    const db = client.db('crucible');
    
    // Check questions collection (old)
    console.log('=== CHECKING "questions" COLLECTION (OLD) ===');
    const questionsOld = db.collection('questions');
    const countOld = await questionsOld.countDocuments({ 'metadata.chapter_id': 'ch11_mole' });
    console.log(`Total MOLE questions: ${countOld}`);
    
    if (countOld > 0) {
      const questionsListOld = await questionsOld.find(
        { 'metadata.chapter_id': 'ch11_mole' },
        { projection: { display_id: 1, _id: 0 } }
      ).sort({ display_id: 1 }).toArray();
      
      console.log(`First ID: ${questionsListOld[0].display_id}`);
      console.log(`Last ID: ${questionsListOld[questionsListOld.length - 1].display_id}`);
      console.log('\nAll IDs:');
      questionsListOld.forEach(q => console.log(`  - ${q.display_id}`));
    }
    
    // Check questions_v2 collection (new)
    console.log('\n=== CHECKING "questions_v2" COLLECTION (NEW) ===');
    const questionsNew = db.collection('questions_v2');
    const countNew = await questionsNew.countDocuments({ 'metadata.chapter_id': 'ch11_mole' });
    console.log(`Total MOLE questions: ${countNew}`);
    
    if (countNew > 0) {
      const questionsListNew = await questionsNew.find(
        { 'metadata.chapter_id': 'ch11_mole' },
        { projection: { display_id: 1, _id: 0 } }
      ).sort({ display_id: 1 }).toArray();
      
      console.log(`First ID: ${questionsListNew[0].display_id}`);
      console.log(`Last ID: ${questionsListNew[questionsListNew.length - 1].display_id}`);
      console.log('\nAll IDs:');
      questionsListNew.forEach(q => console.log(`  - ${q.display_id}`));
    }
    
    // List all collections
    console.log('\n=== ALL COLLECTIONS IN DATABASE ===');
    const collections = await db.listCollections().toArray();
    collections.forEach(c => console.log(`  - ${c.name}`));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkAllCollections();
