// Delete ch11_stereo chapter from MongoDB
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function run() {
    console.log(`\n=== DELETING STEREOCHEMISTRY CHAPTER FROM MONGODB ===\n`);
    
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        const chaptersCollection = db.collection('chapters');

        // Check if chapter exists
        const stereoChapter = await chaptersCollection.findOne({ _id: 'ch11_stereo' });
        
        if (!stereoChapter) {
            console.log('ch11_stereo chapter not found in MongoDB. Nothing to delete.');
        } else {
            console.log('Found ch11_stereo chapter:');
            console.log(JSON.stringify(stereoChapter, null, 2));
            
            // Delete the chapter
            const result = await chaptersCollection.deleteOne({ _id: 'ch11_stereo' });
            
            if (result.deletedCount === 1) {
                console.log('\n✅ Successfully deleted ch11_stereo chapter from MongoDB');
            } else {
                console.log('\n⚠️  Deletion failed - no documents deleted');
            }
        }

        // Verify deletion
        const verifyDeleted = await chaptersCollection.findOne({ _id: 'ch11_stereo' });
        console.log(`\nVerification: ch11_stereo exists = ${verifyDeleted ? 'YES (ERROR!)' : 'NO (SUCCESS!)'}`);

    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
}

run();
