#!/usr/bin/env node

/**
 * Update MOLE-202 question to fix table formatting
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'crucible';

async function updateQuestion() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection('questions_v2');
    
    console.log('🔄 Updating MOLE-202 with proper table markdown...\n');
    
    const result = await collection.updateOne(
      { display_id: 'MOLE-202' },
      {
        $set: {
          'question_text.markdown': 'Two students perform the same experiment. Their readings (true value $=3.0\\,\\text{g}$) are:\n\n| Student | Reading (i) | Reading (ii) |\n|---------|-------------|-------------|\n| A | $3.01$ | $2.99$ |\n| B | $3.05$ | $2.95$ |\n\nIdentify the correct statement about accuracy and precision.',
          'updated_at': new Date()
        }
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ MOLE-202 updated successfully!');
      console.log('   Table markdown is now properly formatted.\n');
    } else {
      console.log('⚠️  MOLE-202 not found or already up to date.\n');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

updateQuestion();
