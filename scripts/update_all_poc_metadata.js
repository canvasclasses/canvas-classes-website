// Bulk update all POC questions with proper difficulty and tags
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Difficulty mapping based on question type and complexity
const difficultyMap = {
  // Easy: Direct concept questions, simple calculations
  'POC-003': 'Easy', 'POC-004': 'Easy', 'POC-005': 'Easy', 'POC-007': 'Easy',
  'POC-008': 'Easy', 'POC-009': 'Easy', 'POC-011': 'Easy', 'POC-012': 'Easy',
  'POC-015': 'Easy', 'POC-016': 'Easy', 'POC-018': 'Easy', 'POC-021': 'Easy',
  'POC-023': 'Easy', 'POC-033': 'Easy', 'POC-034': 'Easy', 'POC-035': 'Easy',
  'POC-036': 'Easy', 'POC-037': 'Easy', 'POC-041': 'Easy', 'POC-042': 'Easy',
  'POC-043': 'Easy', 'POC-044': 'Easy', 'POC-045': 'Easy', 'POC-046': 'Easy',
  'POC-047': 'Easy', 'POC-048': 'Easy', 'POC-049': 'Easy', 'POC-050': 'Easy',
  'POC-051': 'Easy', 'POC-052': 'Easy', 'POC-053': 'Easy', 'POC-054': 'Easy',
  'POC-055': 'Easy', 'POC-056': 'Easy', 'POC-057': 'Easy', 'POC-058': 'Easy',
  'POC-059': 'Easy', 'POC-060': 'Easy', 'POC-061': 'Easy', 'POC-062': 'Easy',
  'POC-063': 'Easy', 'POC-064': 'Easy', 'POC-065': 'Easy', 'POC-066': 'Easy',
  'POC-067': 'Easy', 'POC-068': 'Easy', 'POC-069': 'Easy', 'POC-070': 'Easy',
  'POC-097': 'Easy', 'POC-099': 'Easy',
  
  // Hard: Multi-step calculations, complex concepts
  'POC-014': 'Hard', 'POC-020': 'Hard', 'POC-022': 'Hard', 'POC-024': 'Hard',
  'POC-025': 'Hard', 'POC-026': 'Hard', 'POC-027': 'Hard', 'POC-028': 'Hard',
  'POC-029': 'Hard', 'POC-030': 'Hard', 'POC-031': 'Hard', 'POC-032': 'Hard',
  'POC-038': 'Hard', 'POC-039': 'Hard',
  
  // Medium: Everything else (default)
};

// Tag mapping based on topic
const tagMap = {
  // Purification methods (Q108-123)
  'POC-001': 'tag_poc_1', 'POC-002': 'tag_poc_1', 'POC-003': 'tag_poc_1',
  'POC-004': 'tag_poc_2', 'POC-005': 'tag_poc_1', 'POC-006': 'tag_poc_2',
  'POC-008': 'tag_poc_1', 'POC-009': 'tag_poc_2', 'POC-010': 'tag_poc_1',
  'POC-011': 'tag_poc_1', 'POC-012': 'tag_poc_2', 'POC-014': 'tag_poc_1',
  'POC-015': 'tag_poc_2', 'POC-016': 'tag_poc_1',
  
  // Chromatography (Q124-139)
  'POC-007': 'tag_poc_2', 'POC-013': 'tag_poc_2', 'POC-017': 'tag_poc_2',
  'POC-018': 'tag_poc_2', 'POC-019': 'tag_poc_1', 'POC-020': 'tag_poc_2',
  'POC-021': 'tag_poc_2', 'POC-022': 'tag_poc_2', 'POC-023': 'tag_poc_2',
  'POC-024': 'tag_poc_2', 'POC-025': 'tag_poc_2', 'POC-026': 'tag_poc_2',
  'POC-027': 'tag_poc_1', 'POC-028': 'tag_poc_2', 'POC-029': 'tag_poc_1',
  'POC-030': 'tag_poc_2', 'POC-031': 'tag_poc_2', 'POC-032': 'tag_poc_2',
  
  // Qualitative analysis (Q140-181)
  'POC-033': 'tag_poc_4', 'POC-034': 'tag_poc_3', 'POC-035': 'tag_poc_3',
  'POC-036': 'tag_poc_3', 'POC-037': 'tag_poc_3', 'POC-038': 'tag_poc_3',
  'POC-039': 'tag_poc_3', 'POC-041': 'tag_poc_4', 'POC-042': 'tag_poc_4',
  'POC-043': 'tag_poc_4', 'POC-044': 'tag_poc_4', 'POC-045': 'tag_poc_4',
  'POC-046': 'tag_poc_4', 'POC-047': 'tag_poc_3', 'POC-048': 'tag_poc_3',
  'POC-049': 'tag_poc_3', 'POC-050': 'tag_poc_3', 'POC-051': 'tag_poc_3',
  'POC-052': 'tag_poc_3', 'POC-053': 'tag_poc_3', 'POC-054': 'tag_poc_3',
  'POC-055': 'tag_poc_3', 'POC-056': 'tag_poc_3', 'POC-057': 'tag_poc_3',
  'POC-058': 'tag_poc_3', 'POC-059': 'tag_poc_3', 'POC-060': 'tag_poc_3',
  'POC-061': 'tag_poc_3', 'POC-062': 'tag_poc_3', 'POC-063': 'tag_poc_3',
  'POC-064': 'tag_poc_3', 'POC-065': 'tag_poc_3', 'POC-066': 'tag_poc_3',
  'POC-067': 'tag_poc_3', 'POC-068': 'tag_poc_3', 'POC-069': 'tag_poc_3',
  'POC-070': 'tag_poc_3', 'POC-071': 'tag_poc_3', 'POC-072': 'tag_poc_1',
  'POC-073': 'tag_poc_2',
  
  // Quantitative analysis (Q182-209)
  'POC-074': 'tag_poc_3', 'POC-075': 'tag_poc_3', 'POC-076': 'tag_poc_3',
  'POC-077': 'tag_poc_3', 'POC-078': 'tag_poc_3', 'POC-079': 'tag_poc_3',
  'POC-080': 'tag_poc_3', 'POC-081': 'tag_poc_3', 'POC-082': 'tag_poc_3',
  'POC-083': 'tag_poc_3', 'POC-084': 'tag_poc_3', 'POC-085': 'tag_poc_3',
  'POC-086': 'tag_poc_3', 'POC-087': 'tag_poc_3', 'POC-088': 'tag_poc_3',
  'POC-089': 'tag_poc_3', 'POC-090': 'tag_poc_3', 'POC-091': 'tag_poc_3',
  'POC-092': 'tag_poc_3', 'POC-093': 'tag_poc_3', 'POC-094': 'tag_poc_3',
  'POC-095': 'tag_poc_3', 'POC-096': 'tag_poc_3', 'POC-097': 'tag_poc_3',
  'POC-098': 'tag_poc_3', 'POC-099': 'tag_poc_1', 'POC-100': 'tag_poc_3',
  'POC-101': 'tag_poc_3', 'POC-102': 'tag_poc_3', 'POC-040': 'tag_poc_3'
};

async function updateAll() {
  console.log('\n=== UPDATE ALL POC METADATA ===\n');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('questions_v2');
    
    const allQuestions = await collection.find({
      'metadata.chapter_id': 'ch11_prac_org'
    }).toArray();
    
    console.log(`Found ${allQuestions.length} POC questions\n`);
    console.log('Updating difficulty and tags...\n');
    
    let updated = 0;
    for (const q of allQuestions) {
      const displayId = q.display_id;
      const difficulty = difficultyMap[displayId] || 'Medium';
      const tagId = tagMap[displayId] || 'tag_poc_1';
      
      await collection.updateOne(
        { _id: q._id },
        {
          $set: {
            'metadata.difficulty': difficulty,
            'metadata.tags': [{ tag_id: tagId, weight: 1.0 }],
            'metadata.is_top_pyq': difficulty === 'Easy' || difficulty === 'Medium',
            updated_at: new Date()
          }
        }
      );
      
      updated++;
      if (updated % 20 === 0) {
        console.log(`  ✅ Updated ${updated}/${allQuestions.length} questions`);
      }
    }
    
    console.log(`\n✅ Updated all ${updated} questions with proper metadata`);
    
    // Show distribution
    const easyCount = Object.values(difficultyMap).filter(d => d === 'Easy').length;
    const hardCount = Object.values(difficultyMap).filter(d => d === 'Hard').length;
    const mediumCount = allQuestions.length - easyCount - hardCount;
    
    console.log(`\n📊 Difficulty distribution:`);
    console.log(`   Easy: ${easyCount} questions`);
    console.log(`   Medium: ${mediumCount} questions`);
    console.log(`   Hard: ${hardCount} questions`);
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

updateAll();
