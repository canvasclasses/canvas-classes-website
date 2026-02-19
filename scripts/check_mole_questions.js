const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '../.env.local' });

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI not set in .env.local');
const client = new MongoClient(uri);

async function checkMoleQuestions() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('crucible');
    const collection = db.collection('questions');
    
    // Count all questions with chapter_id = ch11_mole
    const count = await collection.countDocuments({ 'metadata.chapter_id': 'ch11_mole' });
    console.log(`\nTotal MOLE questions in MongoDB: ${count}`);
    
    // Get all MOLE question IDs
    const questions = await collection.find(
      { 'metadata.chapter_id': 'ch11_mole' },
      { projection: { display_id: 1, _id: 0 } }
    ).sort({ display_id: 1 }).toArray();
    
    console.log('\nQuestion IDs in MongoDB:');
    questions.forEach(q => console.log(`  - ${q.display_id}`));
    
    // Get ID range
    if (questions.length > 0) {
      const firstId = questions[0].display_id;
      const lastId = questions[questions.length - 1].display_id;
      console.log(`\nID Range: ${firstId} to ${lastId}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkMoleQuestions();
