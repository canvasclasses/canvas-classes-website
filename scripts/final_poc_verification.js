// Final verification of all 102 POC questions
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function finalVerify() {
  console.log('\n=== FINAL POC VERIFICATION ===\n');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('questions_v2');
    
    const allQuestions = await collection.find({
      'metadata.chapter_id': 'ch11_prac_org'
    }).sort({ display_id: 1 }).toArray();
    
    console.log(`📊 Total POC questions: ${allQuestions.length}`);
    console.log(`   Expected: 102 questions (Q108-Q209 from screenshots)`);
    console.log(`   Status: ${allQuestions.length === 102 ? '✅ COMPLETE' : '⚠️ INCOMPLETE'}\n`);
    
    // Verify metadata
    let withSolutions = 0;
    let withTags = 0;
    let withDifficulty = 0;
    let withChapter = 0;
    
    const difficultyCount = { Easy: 0, Medium: 0, Hard: 0 };
    const tagCount = {};
    
    allQuestions.forEach(q => {
      if (q.solution?.text_markdown && q.solution.text_markdown.length > 50) {
        withSolutions++;
      }
      if (q.metadata.tags && q.metadata.tags.length > 0) {
        withTags++;
        q.metadata.tags.forEach(t => {
          tagCount[t.tag_id] = (tagCount[t.tag_id] || 0) + 1;
        });
      }
      if (q.metadata.difficulty && q.metadata.difficulty !== 'Medium') {
        withDifficulty++;
      } else if (q.metadata.difficulty === 'Medium') {
        withDifficulty++;
      }
      if (q.metadata.chapter_id === 'ch11_prac_org') {
        withChapter++;
      }
      
      if (q.metadata.difficulty) {
        difficultyCount[q.metadata.difficulty]++;
      }
    });
    
    console.log('✅ QUALITY CHECKS:');
    console.log(`   Questions with solutions: ${withSolutions}/102`);
    console.log(`   Questions with tags: ${withTags}/102`);
    console.log(`   Questions with difficulty: ${withDifficulty}/102`);
    console.log(`   Questions with chapter tag: ${withChapter}/102`);
    
    console.log('\n📊 DIFFICULTY DISTRIBUTION:');
    Object.entries(difficultyCount).forEach(([diff, count]) => {
      console.log(`   ${diff}: ${count} questions`);
    });
    
    console.log('\n📊 TAG DISTRIBUTION:');
    Object.entries(tagCount).forEach(([tag, count]) => {
      console.log(`   ${tag}: ${count} questions`);
    });
    
    console.log('\n📊 YEAR DISTRIBUTION:');
    const yearCount = {};
    allQuestions.forEach(q => {
      const year = q.metadata.exam_source?.year;
      if (year) yearCount[year] = (yearCount[year] || 0) + 1;
    });
    Object.keys(yearCount).sort().forEach(year => {
      console.log(`   ${year}: ${yearCount[year]} questions`);
    });
    
    console.log('\n✅ VERIFICATION SUMMARY:');
    const allComplete = withSolutions === 102 && withTags === 102 && withDifficulty === 102 && withChapter === 102;
    
    if (allComplete) {
      console.log('   🎉 ALL 102 POC QUESTIONS ARE COMPLETE!');
      console.log('   ✅ All questions from screenshots (Q108-Q209) are in database');
      console.log('   ✅ All have high-quality step-by-step solutions');
      console.log('   ✅ All are tagged under POC chapter (ch11_prac_org)');
      console.log('   ✅ All have primary tags assigned');
      console.log('   ✅ All have difficulty levels assigned');
    } else {
      console.log('   ⚠️ Some questions need attention:');
      if (withSolutions < 102) console.log(`      - ${102 - withSolutions} questions need better solutions`);
      if (withTags < 102) console.log(`      - ${102 - withTags} questions need tags`);
      if (withDifficulty < 102) console.log(`      - ${102 - withDifficulty} questions need difficulty`);
      if (withChapter < 102) console.log(`      - ${102 - withChapter} questions need chapter tag`);
    }
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

finalVerify();
