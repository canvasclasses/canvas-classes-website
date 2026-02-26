// Script to delete old GOC and HC questions (keeping 2025 JEE Main questions)
// DELETE: GOC-001 to GOC-134 (134 questions)
// DELETE: HC-001 to HC-147 (141 questions)
// KEEP: GOC-135 to GOC-147 (13 questions - 2025 JEE Main)
// KEEP: HC-148 to HC-173 (25 questions - 2025 JEE Main)

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function run() {
    console.log(`\n=== DELETING OLD GOC & HC QUESTIONS ===\n`);
    
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        const collection = db.collection('questions_v2');

        // Safety check: Count questions before deletion
        const gocCount = await collection.countDocuments({ display_id: { $regex: /^GOC-/ } });
        const hcCount = await collection.countDocuments({ display_id: { $regex: /^HC-/ } });
        
        console.log(`Current state:`);
        console.log(`  Total GOC questions: ${gocCount}`);
        console.log(`  Total HC questions: ${hcCount}`);
        console.log('');

        // Define deletion criteria
        // GOC: Delete 001-134 (keep 135-147)
        const gocToDelete = [];
        for (let i = 1; i <= 134; i++) {
            gocToDelete.push(`GOC-${String(i).padStart(3, '0')}`);
        }

        // HC: Delete 001-147 (keep 148-173)
        const hcToDelete = [];
        for (let i = 1; i <= 147; i++) {
            hcToDelete.push(`HC-${String(i).padStart(3, '0')}`);
        }

        console.log(`Questions to delete:`);
        console.log(`  GOC: ${gocToDelete.length} questions (GOC-001 to GOC-134)`);
        console.log(`  HC: ${hcToDelete.length} questions (HC-001 to HC-147)`);
        console.log('');

        // Delete GOC questions
        console.log('Deleting GOC questions...');
        const gocDeleteResult = await collection.deleteMany({
            display_id: { $in: gocToDelete }
        });
        console.log(`  Deleted ${gocDeleteResult.deletedCount} GOC questions`);

        // Delete HC questions
        console.log('Deleting HC questions...');
        const hcDeleteResult = await collection.deleteMany({
            display_id: { $in: hcToDelete }
        });
        console.log(`  Deleted ${hcDeleteResult.deletedCount} HC questions`);

        // Verify remaining questions
        console.log('\nVerifying remaining questions...');
        const remainingGoc = await collection
            .find({ display_id: { $regex: /^GOC-/ } })
            .sort({ display_id: 1 })
            .toArray();
        const remainingHc = await collection
            .find({ display_id: { $regex: /^HC-/ } })
            .sort({ display_id: 1 })
            .toArray();

        console.log(`\nRemaining GOC questions: ${remainingGoc.length}`);
        if (remainingGoc.length > 0) {
            console.log('  IDs:', remainingGoc.map(q => q.display_id).join(', '));
            
            // Verify all are 2025 JEE Main
            const all2025 = remainingGoc.every(q => 
                q.metadata?.exam_source?.year === 2025 && 
                q.metadata?.exam_source?.exam === 'JEE Main'
            );
            console.log(`  All are 2025 JEE Main: ${all2025 ? '✓' : '✗'}`);
        }

        console.log(`\nRemaining HC questions: ${remainingHc.length}`);
        if (remainingHc.length > 0) {
            console.log('  IDs:', remainingHc.map(q => q.display_id).join(', '));
            
            // Verify all are 2025 JEE Main
            const all2025 = remainingHc.every(q => 
                q.metadata?.exam_source?.year === 2025 && 
                q.metadata?.exam_source?.exam === 'JEE Main'
            );
            console.log(`  All are 2025 JEE Main: ${all2025 ? '✓' : '✗'}`);
        }

        console.log('\n=== DELETION COMPLETE ===');
        console.log(`Total deleted: ${gocDeleteResult.deletedCount + hcDeleteResult.deletedCount} questions`);
        console.log(`  GOC deleted: ${gocDeleteResult.deletedCount}`);
        console.log(`  HC deleted: ${hcDeleteResult.deletedCount}`);
        console.log(`\nTotal remaining: ${remainingGoc.length + remainingHc.length} questions (all 2025 JEE Main)`);
        console.log(`  GOC remaining: ${remainingGoc.length}`);
        console.log(`  HC remaining: ${remainingHc.length}`);
        console.log('\nNew questions can now be added starting from GOC-001 and HC-001');

    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
}

run();
