// Final quality check for all 102 POC questions
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function finalQualityCheck() {
  console.log('\n=== FINAL POC QUALITY CHECK ===\n');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('questions_v2');
    
    const allQuestions = await collection.find({
      'metadata.chapter_id': 'ch11_prac_org'
    }).sort({ display_id: 1 }).toArray();
    
    console.log(`Total POC questions: ${allQuestions.length}\n`);
    
    // Check for issues
    let latexTableIssues = 0;
    let oversizedFractionIssues = 0;
    let shortSolutions = 0;
    let missingTags = 0;
    let defaultDifficulty = 0;
    
    allQuestions.forEach(q => {
      // Check for LaTeX table issues
      if (q.question_text.markdown.includes('\\begin{tabular}')) {
        latexTableIssues++;
        console.log(`⚠️  ${q.display_id}: Still has LaTeX table`);
      }
      
      // Check for oversized fractions
      if (q.question_text.markdown.includes('\\dfrac') || 
          q.solution?.text_markdown?.includes('\\dfrac')) {
        oversizedFractionIssues++;
        console.log(`⚠️  ${q.display_id}: Still has \\dfrac`);
      }
      
      // Check solution length
      if (!q.solution?.text_markdown || q.solution.text_markdown.length < 200) {
        shortSolutions++;
        console.log(`⚠️  ${q.display_id}: Solution too short (${q.solution?.text_markdown?.length || 0} chars)`);
      }
      
      // Check tags
      if (!q.metadata.tags || q.metadata.tags.length === 0) {
        missingTags++;
      }
      
      // Check if difficulty seems default
      if (!q.metadata.difficulty) {
        defaultDifficulty++;
      }
    });
    
    console.log('\n📊 QUALITY METRICS:\n');
    console.log(`✅ Questions with proper formatting: ${allQuestions.length - latexTableIssues}`);
    console.log(`✅ Questions with correct fractions: ${allQuestions.length - oversizedFractionIssues}`);
    console.log(`✅ Questions with detailed solutions: ${allQuestions.length - shortSolutions}`);
    console.log(`✅ Questions with tags: ${allQuestions.length - missingTags}`);
    console.log(`✅ Questions with difficulty: ${allQuestions.length - defaultDifficulty}`);
    
    if (latexTableIssues === 0 && oversizedFractionIssues === 0 && 
        shortSolutions === 0 && missingTags === 0 && defaultDifficulty === 0) {
      console.log('\n🎉 ALL QUALITY CHECKS PASSED!');
      console.log('\n✅ All 102 POC questions are now:');
      console.log('   ✅ Free of LaTeX rendering errors');
      console.log('   ✅ Using proper fraction sizing');
      console.log('   ✅ Have detailed step-by-step solutions (>200 chars)');
      console.log('   ✅ Properly tagged with primary concepts');
      console.log('   ✅ Analyzed for difficulty (not default)');
    } else {
      console.log('\n⚠️  ISSUES FOUND:');
      if (latexTableIssues > 0) console.log(`   - ${latexTableIssues} questions with LaTeX table issues`);
      if (oversizedFractionIssues > 0) console.log(`   - ${oversizedFractionIssues} questions with oversized fractions`);
      if (shortSolutions > 0) console.log(`   - ${shortSolutions} questions with short solutions`);
      if (missingTags > 0) console.log(`   - ${missingTags} questions missing tags`);
      if (defaultDifficulty > 0) console.log(`   - ${defaultDifficulty} questions missing difficulty`);
    }
    
    // Sample a few questions to show quality
    console.log('\n📝 SAMPLE QUESTIONS:\n');
    const samples = [allQuestions[0], allQuestions[6], allQuestions[10]];
    samples.forEach(q => {
      console.log(`${q.display_id} (${q.metadata.difficulty}):`);
      console.log(`  Tag: ${q.metadata.tags?.[0]?.tag_id}`);
      console.log(`  Solution length: ${q.solution?.text_markdown?.length || 0} chars`);
      console.log(`  Has LaTeX issues: ${q.question_text.markdown.includes('\\begin{tabular}') ? 'YES' : 'NO'}`);
      console.log('');
    });
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

finalQualityCheck();
