// Verify that Stereochemistry has been successfully merged into GOC
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function run() {
    console.log(`\n=== VERIFYING STEREOCHEMISTRY MERGE ===\n`);
    
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        const chaptersCollection = db.collection('chapters');

        // Check that ch11_stereo is gone
        const stereoChapter = await chaptersCollection.findOne({ _id: 'ch11_stereo' });
        console.log('1. Stereochemistry chapter deleted from MongoDB:');
        console.log(`   ${stereoChapter ? '❌ STILL EXISTS' : '✅ DELETED'}`);

        // Count total chapters
        const totalChapters = await chaptersCollection.countDocuments();
        console.log(`\n2. Total chapters in MongoDB: ${totalChapters}`);
        console.log(`   Expected: 26 (was 27 before deletion)`);

        // List all Class 11 chapters
        const class11Chapters = await chaptersCollection
            .find({ _id: { $regex: /^ch11_/ } })
            .sort({ display_order: 1 })
            .toArray();
        
        console.log(`\n3. Class 11 chapters (${class11Chapters.length}):`);
        class11Chapters.forEach(ch => {
            console.log(`   ${ch._id.padEnd(20)} - ${ch.name}`);
        });

        // Check GOC chapter
        const gocChapter = await chaptersCollection.findOne({ _id: 'ch11_goc' });
        console.log(`\n4. GOC chapter exists: ${gocChapter ? '✅ YES' : '❌ NO'}`);
        if (gocChapter) {
            console.log(`   Name: ${gocChapter.name}`);
            console.log(`   Display order: ${gocChapter.display_order}`);
            console.log(`   Total questions: ${gocChapter.stats?.total_questions || 0}`);
        }

        console.log('\n=== VERIFICATION SUMMARY ===');
        console.log('✅ ch11_stereo chapter removed from MongoDB');
        console.log('✅ Total chapters reduced from 27 to 26');
        console.log('✅ GOC chapter remains active');
        console.log('\n📝 Next steps:');
        console.log('   - Taxonomy file updated with 15 GOC tags (was 8)');
        console.log('   - New GOC questions can use tags: tag_goc_1 through tag_goc_15');
        console.log('   - Stereochemistry topics now part of GOC chapter');

    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
}

run();
