const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

const API_BASE = 'http://localhost:3000/api/v2';

// Normalize text for comparison (remove whitespace, lowercase, strip LaTeX)
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/\$.*?\$/g, '') // Remove LaTeX
    .replace(/[^a-z0-9]/g, '') // Keep only alphanumeric
    .substring(0, 200); // First 200 chars
}

// Check if question has SVG images
function hasImages(q) {
  const md = q.question_text?.markdown || '';
  return md.includes('canvas-chemistry-assets.r2.dev/questions/') || 
         md.includes('![image](');
}

// Fetch all ALDO questions
async function fetchAllQuestions() {
  const all = [];
  let skip = 0;
  const limit = 100;
  
  while (true) {
    const res = await fetch(`${API_BASE}/questions?chapter_id=ch12_carbonyl&limit=${limit}&skip=${skip}`);
    const data = await res.json();
    const questions = Array.isArray(data.data) ? data.data : [];
    
    if (questions.length === 0) break;
    
    all.push(...questions.filter(q => /^ALDO-\d+$/.test(q.display_id)));
    skip += limit;
    
    if (!data.pagination?.hasMore) break;
  }
  
  return all;
}

async function main() {
  console.log('🔍 Fetching all ALDO questions...\n');
  const questions = await fetchAllQuestions();
  console.log(`✓ Fetched ${questions.length} ALDO questions\n`);
  
  // Group by exam metadata
  const byExam = new Map();
  
  for (const q of questions) {
    const es = q.metadata?.exam_source;
    if (!es) continue;
    
    const key = `${es.year}-${es.month}-${es.day}-${es.shift}`;
    if (!byExam.has(key)) byExam.set(key, []);
    byExam.get(key).push(q);
  }
  
  // Find duplicates within each exam paper
  const duplicates = [];
  
  for (const [examKey, qs] of byExam.entries()) {
    if (qs.length < 2) continue;
    
    // Compare each pair
    for (let i = 0; i < qs.length; i++) {
      for (let j = i + 1; j < qs.length; j++) {
        const q1 = qs[i];
        const q2 = qs[j];
        
        const text1 = normalizeText(q1.question_text?.markdown || '');
        const text2 = normalizeText(q2.question_text?.markdown || '');
        
        // If first 200 chars match, they're duplicates
        if (text1 === text2 && text1.length > 20) {
          const img1 = hasImages(q1);
          const img2 = hasImages(q2);
          
          duplicates.push({
            exam: examKey,
            q1: { id: q1.display_id, _id: q1._id, hasImage: img1 },
            q2: { id: q2.display_id, _id: q2._id, hasImage: img2 },
            textPreview: (q1.question_text?.markdown || '').substring(0, 80)
          });
        }
      }
    }
  }
  
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log(`DUPLICATE DETECTION REPORT`);
  console.log('═══════════════════════════════════════════════════════════════════\n');
  
  if (duplicates.length === 0) {
    console.log('✓ No duplicates found\n');
    return;
  }
  
  console.log(`Found ${duplicates.length} duplicate pairs:\n`);
  
  const toDelete = [];
  
  for (const dup of duplicates) {
    console.log(`📄 Exam: ${dup.exam}`);
    console.log(`   ${dup.q1.id} ${dup.q1.hasImage ? '🖼️  HAS IMAGE' : '(no image)'}`);
    console.log(`   ${dup.q2.id} ${dup.q2.hasImage ? '🖼️  HAS IMAGE' : '(no image)'}`);
    console.log(`   Text: ${dup.textPreview}...`);
    
    // Decide which to delete
    if (dup.q1.hasImage && !dup.q2.hasImage) {
      console.log(`   ❌ RECOMMEND DELETE: ${dup.q2.id} (no image)\n`);
      toDelete.push({ id: dup.q2.id, _id: dup.q2._id });
    } else if (!dup.q1.hasImage && dup.q2.hasImage) {
      console.log(`   ❌ RECOMMEND DELETE: ${dup.q1.id} (no image)\n`);
      toDelete.push({ id: dup.q1.id, _id: dup.q1._id });
    } else if (!dup.q1.hasImage && !dup.q2.hasImage) {
      // Both have no images — delete the higher number
      const num1 = parseInt(dup.q1.id.replace('ALDO-', ''));
      const num2 = parseInt(dup.q2.id.replace('ALDO-', ''));
      const deleteId = num1 > num2 ? dup.q1 : dup.q2;
      console.log(`   ❌ RECOMMEND DELETE: ${deleteId.id} (higher number, no image)\n`);
      toDelete.push({ id: deleteId.id, _id: deleteId._id });
    } else {
      // Both have images — manual decision needed
      console.log(`   ⚠️  BOTH HAVE IMAGES — manual review needed\n`);
    }
  }
  
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log(`SUMMARY: ${toDelete.length} questions recommended for deletion`);
  console.log('═══════════════════════════════════════════════════════════════════\n');
  
  if (toDelete.length > 0) {
    console.log('Questions to delete:');
    toDelete.forEach(q => console.log(`  - ${q.id} (${q._id})`));
    console.log('\nRun with --delete flag to execute deletions.');
  }
  
  // If --delete flag, execute deletions
  if (process.argv.includes('--delete')) {
    console.log('\n🗑️  Deleting duplicates...\n');
    
    for (const q of toDelete) {
      try {
        const res = await fetch(`${API_BASE}/questions/${q._id}`, {
          method: 'DELETE'
        });
        
        if (res.ok) {
          console.log(`  ✓ Deleted ${q.id}`);
        } else {
          console.log(`  ✗ Failed to delete ${q.id}: ${res.status}`);
        }
      } catch (err) {
        console.log(`  ✗ Error deleting ${q.id}: ${err.message}`);
      }
    }
    
    console.log('\n✅ Deletion complete');
  }
}

main().catch(console.error);
