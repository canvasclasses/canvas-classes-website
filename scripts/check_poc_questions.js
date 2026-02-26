require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('questions_v2');
    
    const pocQuestions = await collection.find(
      { display_id: /^POC-/ },
      { projection: { display_id: 1, _id: 0 } }
    ).sort({ display_id: 1 }).toArray();
    
    console.log('Existing POC questions:', pocQuestions.map(q => q.display_id).join(', '));
    console.log('Total POC questions:', pocQuestions.length);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
