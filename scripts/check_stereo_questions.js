// Check if any questions exist with ch11_stereo chapter_id or stereo tags
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function run() {
    console.log(`\n=== CHECKING STEREOCHEMISTRY QUESTIONS ===\n`);
    
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        const collection = db.collection('questions_v2');

        // Check for questions with ch11_stereo chapter_id
        const stereoChapterQuestions = await collection
            .find({ 'metadata.chapter_id': 'ch11_stereo' })
            .toArray();
        
        console.log(`Questions with chapter_id = 'ch11_stereo': ${stereoChapterQuestions.length}`);
        if (stereoChapterQuestions.length > 0) {
            console.log('Display IDs:', stereoChapterQuestions.map(q => q.display_id).join(', '));
        }

        // Check for questions with stereo tags
        const stereoTagQuestions = await collection
            .find({ 'metadata.tags.tag_id': { $regex: /^tag_stereo_/ } })
            .toArray();
        
        console.log(`\nQuestions with stereo tags: ${stereoTagQuestions.length}`);
        if (stereoTagQuestions.length > 0) {
            console.log('Display IDs:', stereoTagQuestions.map(q => q.display_id).join(', '));
        }

        // Check chapters collection
        const chaptersCollection = db.collection('chapters');
        const stereoChapter = await chaptersCollection.findOne({ _id: 'ch11_stereo' });
        
        console.log(`\nStereochemistry chapter in MongoDB: ${stereoChapter ? 'EXISTS' : 'NOT FOUND'}`);
        if (stereoChapter) {
            console.log('Chapter data:', JSON.stringify(stereoChapter, null, 2));
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

run();
