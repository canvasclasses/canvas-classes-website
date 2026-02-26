// Final comprehensive verification of Stereochemistry merge into GOC
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function run() {
    console.log(`\n${'='.repeat(60)}`);
    console.log('FINAL VERIFICATION: STEREOCHEMISTRY → GOC MERGE');
    console.log('='.repeat(60));
    
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        
        // 1. Verify taxonomy file
        console.log('\n1. TAXONOMY FILE (taxonomyData_from_csv.ts)');
        const taxonomyPath = path.resolve(__dirname, '../app/crucible/admin/taxonomy/taxonomyData_from_csv.ts');
        const taxonomyContent = fs.readFileSync(taxonomyPath, 'utf-8');
        
        const hasStereoChapter = taxonomyContent.includes("id: 'ch11_stereo'");
        const gocTagCount = (taxonomyContent.match(/id: 'tag_goc_\d+'/g) || []).length;
        
        console.log(`   ch11_stereo chapter exists: ${hasStereoChapter ? '❌ FOUND (ERROR!)' : '✅ NOT FOUND'}`);
        console.log(`   GOC tags count: ${gocTagCount} (expected: 15)`);
        console.log(`   ${gocTagCount === 15 ? '✅' : '❌'} GOC tags: ${gocTagCount === 15 ? 'CORRECT' : 'INCORRECT'}`);
        
        // 2. Verify MongoDB chapters
        console.log('\n2. MONGODB CHAPTERS COLLECTION');
        const chaptersCollection = db.collection('chapters');
        
        const stereoChapter = await chaptersCollection.findOne({ _id: 'ch11_stereo' });
        const gocChapter = await chaptersCollection.findOne({ _id: 'ch11_goc' });
        const totalChapters = await chaptersCollection.countDocuments();
        
        console.log(`   ch11_stereo exists: ${stereoChapter ? '❌ YES (ERROR!)' : '✅ NO'}`);
        console.log(`   ch11_goc exists: ${gocChapter ? '✅ YES' : '❌ NO (ERROR!)'}`);
        console.log(`   Total chapters: ${totalChapters} (expected: 26)`);
        console.log(`   ${totalChapters === 26 ? '✅' : '❌'} Chapter count: ${totalChapters === 26 ? 'CORRECT' : 'INCORRECT'}`);
        
        // 3. Verify no questions with ch11_stereo
        console.log('\n3. QUESTIONS COLLECTION');
        const questionsCollection = db.collection('questions_v2');
        
        const stereoQuestions = await questionsCollection.countDocuments({ 'metadata.chapter_id': 'ch11_stereo' });
        const stereoTagQuestions = await questionsCollection.countDocuments({ 'metadata.tags.tag_id': { $regex: /^tag_stereo_/ } });
        
        console.log(`   Questions with ch11_stereo: ${stereoQuestions} (expected: 0)`);
        console.log(`   Questions with stereo tags: ${stereoTagQuestions} (expected: 0)`);
        console.log(`   ${stereoQuestions === 0 && stereoTagQuestions === 0 ? '✅' : '❌'} No stereo questions: ${stereoQuestions === 0 && stereoTagQuestions === 0 ? 'CORRECT' : 'ERROR!'}`);
        
        // 4. Verify chapter mapping files
        console.log('\n4. CHAPTER MAPPING FILES');
        
        const reclassifyPath = path.resolve(__dirname, '../app/api/v2/questions/[id]/reclassify/route.ts');
        const reclassifyContent = fs.readFileSync(reclassifyPath, 'utf-8');
        const hasSterPrefix = reclassifyContent.includes("'ch11_stereo'");
        
        const actionsPath = path.resolve(__dirname, '../app/the-crucible/actions.ts');
        const actionsContent = fs.readFileSync(actionsPath, 'utf-8');
        const hasStereoInActions = actionsContent.includes("id: 'ch11_stereo'");
        
        console.log(`   reclassify/route.ts has ch11_stereo: ${hasSterPrefix ? '❌ YES (ERROR!)' : '✅ NO'}`);
        console.log(`   actions.ts has ch11_stereo: ${hasStereoInActions ? '❌ YES (ERROR!)' : '✅ NO'}`);
        
        // 5. Overall status
        console.log('\n' + '='.repeat(60));
        console.log('OVERALL STATUS');
        console.log('='.repeat(60));
        
        const allChecks = [
            !hasStereoChapter,
            gocTagCount === 15,
            !stereoChapter,
            gocChapter !== null,
            totalChapters === 26,
            stereoQuestions === 0,
            stereoTagQuestions === 0,
            !hasSterPrefix,
            !hasStereoInActions
        ];
        
        const passedChecks = allChecks.filter(Boolean).length;
        const totalChecksCount = allChecks.length;
        
        console.log(`\nPassed: ${passedChecks}/${totalChecksCount} checks`);
        
        if (passedChecks === totalChecksCount) {
            console.log('\n🎉 ✅ ALL CHECKS PASSED - MERGE SUCCESSFUL!');
            console.log('\nSummary:');
            console.log('  • Stereochemistry chapter removed from taxonomy');
            console.log('  • 7 stereo tags merged into GOC (now 15 total GOC tags)');
            console.log('  • ch11_stereo deleted from MongoDB');
            console.log('  • Chapter mappings updated');
            console.log('  • Total chapters: 26 (Class 11: 12, Class 12: 14)');
            console.log('\n✨ Ready for new GOC questions with stereochemistry tags!');
        } else {
            console.log('\n⚠️  SOME CHECKS FAILED - REVIEW NEEDED');
        }
        
    } catch (err) {
        console.error('\n❌ Error:', err);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
}

run();
