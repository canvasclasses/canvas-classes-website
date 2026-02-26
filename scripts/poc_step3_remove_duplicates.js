// POC Step 3: Compare NEW with OLD, identify duplicates, remove duplicates from NEW set
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Simple text similarity function
function calculateSimilarity(text1, text2) {
  const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
  const norm1 = normalize(text1);
  const norm2 = normalize(text2);
  
  if (norm1 === norm2) return 1.0;
  
  // Check if one contains the other (substring match)
  if (norm1.includes(norm2) || norm2.includes(norm1)) {
    return 0.9;
  }
  
  // Simple word overlap
  const words1 = new Set(norm1.split(/\s+/));
  const words2 = new Set(norm2.split(/\s+/));
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

async function removeDuplicates() {
  console.log('\n=== POC STEP 3: REMOVE DUPLICATES ===\n');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('questions_v2');
    
    // Get OLD questions (POC-001 to POC-099)
    const oldQuestions = await collection.find({
      display_id: /^POC-\d{3}$/,
      'metadata.chapter_id': 'ch11_prac_org'
    }).sort({ display_id: 1 }).toArray();
    
    console.log(`Found ${oldQuestions.length} OLD questions (POC-001 to POC-099)`);
    
    // Get NEW questions (POC-NEW-xxx)
    const newQuestions = await collection.find({
      display_id: /^POC-NEW-/,
      'metadata.chapter_id': 'ch11_prac_org'
    }).sort({ display_id: 1 }).toArray();
    
    console.log(`Found ${newQuestions.length} NEW questions (POC-NEW-xxx)`);
    
    // Find duplicates
    console.log('\nComparing questions to find duplicates...');
    const duplicates = [];
    const threshold = 0.85; // 85% similarity threshold
    
    for (const newQ of newQuestions) {
      const newText = newQ.question_text.markdown;
      
      for (const oldQ of oldQuestions) {
        const oldText = oldQ.question_text.markdown;
        const similarity = calculateSimilarity(newText, oldText);
        
        if (similarity >= threshold) {
          duplicates.push({
            newId: newQ.display_id,
            oldId: oldQ.display_id,
            similarity: similarity.toFixed(2),
            newDbId: newQ._id
          });
          break; // Found duplicate, move to next NEW question
        }
      }
    }
    
    console.log(`\n✅ Found ${duplicates.length} duplicates`);
    
    if (duplicates.length > 0) {
      console.log('\nDuplicates to be removed (from NEW set):');
      duplicates.slice(0, 10).forEach(d => {
        console.log(`  ${d.newId} ≈ ${d.oldId} (${d.similarity} similarity)`);
      });
      if (duplicates.length > 10) {
        console.log(`  ... and ${duplicates.length - 10} more`);
      }
      
      // Delete duplicates from NEW set
      console.log(`\nDeleting ${duplicates.length} duplicate NEW questions...`);
      const idsToDelete = duplicates.map(d => d.newDbId);
      const deleteResult = await collection.deleteMany({
        _id: { $in: idsToDelete }
      });
      
      console.log(`✅ Deleted ${deleteResult.deletedCount} duplicate questions`);
    }
    
    // Get remaining NEW questions
    const remainingNew = await collection.find({
      display_id: /^POC-NEW-/,
      'metadata.chapter_id': 'ch11_prac_org'
    }).sort({ display_id: 1 }).toArray();
    
    console.log(`\n📊 Remaining NEW questions: ${remainingNew.length}`);
    console.log(`📊 Total unique questions: ${oldQuestions.length} (old) + ${remainingNew.length} (new) = ${oldQuestions.length + remainingNew.length}`);
    
    console.log(`\n✅ Duplicate removal complete!`);
    console.log(`\n📊 Next: Run step 4 to renumber all questions to POC-001 to POC-${oldQuestions.length + remainingNew.length}`);
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

removeDuplicates();
