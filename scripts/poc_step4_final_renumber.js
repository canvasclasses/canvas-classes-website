// POC Step 4: Delete ALL old POC questions and renumber NEW to match MD file sequence
// This ensures the final database sequence EXACTLY matches the MD file
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function finalRenumber() {
  console.log('\n=== POC STEP 4: FINAL RENUMBERING ===\n');
  console.log('⚠️  Strategy: Delete ALL old POC-xxx questions, keep only NEW questions');
  console.log('   This ensures final sequence matches MD file exactly.\n');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('questions_v2');
    
    // Step 1: Delete ALL old POC questions (POC-001 to POC-099)
    console.log('Step 1: Deleting ALL old POC questions...');
    const deleteResult = await collection.deleteMany({
      display_id: /^POC-\d{3}$/,
      'metadata.chapter_id': 'ch11_prac_org'
    });
    console.log(`✅ Deleted ${deleteResult.deletedCount} old POC questions`);
    
    // Step 2: Get remaining NEW questions
    const newQuestions = await collection.find({
      display_id: /^POC-NEW-/,
      'metadata.chapter_id': 'ch11_prac_org'
    }).sort({ display_id: 1 }).toArray();
    
    console.log(`\nStep 2: Found ${newQuestions.length} NEW questions to renumber`);
    
    // Step 3: Renumber NEW questions to POC-001, POC-002, etc.
    console.log('\nStep 3: Renumbering NEW questions to POC-xxx...');
    
    for (let i = 0; i < newQuestions.length; i++) {
      const newDisplayId = `POC-${String(i + 1).padStart(3, '0')}`;
      await collection.updateOne(
        { _id: newQuestions[i]._id },
        { $set: { display_id: newDisplayId } }
      );
      
      if ((i + 1) % 10 === 0) {
        console.log(`  ✅ Renumbered ${i + 1}/${newQuestions.length} questions`);
      }
    }
    
    console.log(`\n✅ Successfully renumbered all ${newQuestions.length} questions`);
    
    // Step 4: Verify final state
    const finalQuestions = await collection.find({
      display_id: /^POC-\d{3}$/,
      'metadata.chapter_id': 'ch11_prac_org'
    }).sort({ display_id: 1 }).toArray();
    
    console.log(`\n📊 FINAL STATE:`);
    console.log(`   Total POC questions: ${finalQuestions.length}`);
    console.log(`   Range: ${finalQuestions[0].display_id} to ${finalQuestions[finalQuestions.length - 1].display_id}`);
    console.log(`\n✅ POC ingestion complete!`);
    console.log(`   Sequence now matches MD file (Q108-Q${107 + finalQuestions.length})`);
    
    // Show year distribution
    const yearCounts = {};
    finalQuestions.forEach(q => {
      const year = q.metadata.exam_source?.year;
      if (year) yearCounts[year] = (yearCounts[year] || 0) + 1;
    });
    
    console.log('\n   Year distribution:');
    Object.keys(yearCounts).sort().forEach(year => {
      console.log(`     ${year}: ${yearCounts[year]} questions`);
    });
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

finalRenumber();
