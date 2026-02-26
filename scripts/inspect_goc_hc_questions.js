// Script to inspect GOC and HC questions before deletion
// This will show us exactly what exists in the database
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function run() {
    console.log(`\n=== INSPECTING GOC & HC QUESTIONS ===\n`);
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        const collection = db.collection('questions_v2');

        // Find all GOC questions
        console.log('--- GOC QUESTIONS ---');
        const gocQuestions = await collection
            .find({ display_id: { $regex: /^GOC-/ } })
            .sort({ display_id: 1 })
            .toArray();
        
        console.log(`Total GOC questions: ${gocQuestions.length}`);
        if (gocQuestions.length > 0) {
            console.log('\nGOC Question IDs:');
            gocQuestions.forEach(q => {
                const examInfo = q.metadata?.exam_source 
                    ? `${q.metadata.exam_source.exam} ${q.metadata.exam_source.year || ''} ${q.metadata.exam_source.month || ''}`
                    : 'No exam source';
                console.log(`  ${q.display_id} - ${examInfo} - Status: ${q.status}`);
            });
            
            // Separate 2025 JEE Main questions
            const goc2025 = gocQuestions.filter(q => 
                q.metadata?.exam_source?.year === 2025 && 
                q.metadata?.exam_source?.exam === 'JEE Main'
            );
            const gocOthers = gocQuestions.filter(q => 
                !q.metadata?.exam_source?.year || 
                q.metadata?.exam_source?.year !== 2025 ||
                q.metadata?.exam_source?.exam !== 'JEE Main'
            );
            
            console.log(`\n  2025 JEE Main questions (KEEP): ${goc2025.length}`);
            goc2025.forEach(q => console.log(`    ${q.display_id}`));
            
            console.log(`\n  Other questions (DELETE): ${gocOthers.length}`);
            gocOthers.forEach(q => console.log(`    ${q.display_id}`));
        }

        // Find all HC questions
        console.log('\n\n--- HYDROCARBON (HC) QUESTIONS ---');
        const hcQuestions = await collection
            .find({ display_id: { $regex: /^HC-/ } })
            .sort({ display_id: 1 })
            .toArray();
        
        console.log(`Total HC questions: ${hcQuestions.length}`);
        if (hcQuestions.length > 0) {
            console.log('\nHC Question IDs:');
            hcQuestions.forEach(q => {
                const examInfo = q.metadata?.exam_source 
                    ? `${q.metadata.exam_source.exam} ${q.metadata.exam_source.year || ''} ${q.metadata.exam_source.month || ''}`
                    : 'No exam source';
                console.log(`  ${q.display_id} - ${examInfo} - Status: ${q.status}`);
            });
            
            // Separate 2025 JEE Main questions
            const hc2025 = hcQuestions.filter(q => 
                q.metadata?.exam_source?.year === 2025 && 
                q.metadata?.exam_source?.exam === 'JEE Main'
            );
            const hcOthers = hcQuestions.filter(q => 
                !q.metadata?.exam_source?.year || 
                q.metadata?.exam_source?.year !== 2025 ||
                q.metadata?.exam_source?.exam !== 'JEE Main'
            );
            
            console.log(`\n  2025 JEE Main questions (KEEP): ${hc2025.length}`);
            hc2025.forEach(q => console.log(`    ${q.display_id}`));
            
            console.log(`\n  Other questions (DELETE): ${hcOthers.length}`);
            hcOthers.forEach(q => console.log(`    ${q.display_id}`));
        }

        console.log('\n\n=== SUMMARY ===');
        console.log(`GOC: ${gocQuestions.length} total questions`);
        console.log(`HC: ${hcQuestions.length} total questions`);
        console.log('\nNext step: Review this output and confirm deletion strategy.');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

run();
