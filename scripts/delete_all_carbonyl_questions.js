const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

const API_BASE = 'http://localhost:3000/api/v2';
const DRY_RUN = !process.argv.includes('--confirm');

async function fetchAllCarbonylQuestions() {
  const all = [];
  let skip = 0;
  const limit = 100;
  
  while (true) {
    const res = await fetch(`${API_BASE}/questions?chapter_id=ch12_carbonyl&limit=${limit}&skip=${skip}`);
    const data = await res.json();
    const questions = Array.isArray(data.data) ? data.data : [];
    
    if (questions.length === 0) break;
    all.push(...questions);
    skip += limit;
    
    if (!data.pagination?.hasMore) break;
  }
  
  return all;
}

async function deleteQuestion(questionId) {
  const res = await fetch(`${API_BASE}/questions/${questionId}`, {
    method: 'DELETE'
  });
  
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }
  
  return res.json();
}

async function main() {
  console.log('🗑️  Carbonyl Questions Deletion Script');
  console.log('═══════════════════════════════════════════════════════════════════\n');
  
  if (DRY_RUN) {
    console.log('⚠️  DRY RUN MODE - No deletions will be performed');
    console.log('   Run with --confirm flag to actually delete questions\n');
  } else {
    console.log('🔴 DELETION MODE - Questions will be permanently deleted!\n');
  }
  
  console.log('Fetching all ch12_carbonyl questions...\n');
  const questions = await fetchAllCarbonylQuestions();
  
  console.log(`Found ${questions.length} questions in ch12_carbonyl chapter\n`);
  
  if (questions.length === 0) {
    console.log('✓ No questions to delete\n');
    return;
  }
  
  // Group by display_id prefix for summary
  const byPrefix = {};
  questions.forEach(q => {
    const prefix = q.display_id.split('-')[0];
    if (!byPrefix[prefix]) byPrefix[prefix] = [];
    byPrefix[prefix].push(q.display_id);
  });
  
  console.log('Questions by prefix:');
  for (const [prefix, ids] of Object.entries(byPrefix)) {
    console.log(`  ${prefix}: ${ids.length} questions (${ids[0]} to ${ids[ids.length - 1]})`);
  }
  console.log('');
  
  if (DRY_RUN) {
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log(`DRY RUN: Would delete ${questions.length} questions`);
    console.log('═══════════════════════════════════════════════════════════════════\n');
    console.log('To proceed with deletion, run: node scripts/delete_all_carbonyl_questions.js --confirm\n');
    return;
  }
  
  // Actual deletion
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('Starting deletion...\n');
  
  let deleted = 0;
  let failed = 0;
  
  for (const q of questions) {
    try {
      await deleteQuestion(q._id);
      deleted++;
      
      if (deleted % 10 === 0) {
        console.log(`  Deleted ${deleted}/${questions.length}...`);
      }
    } catch (err) {
      failed++;
      console.log(`  ✗ Failed to delete ${q.display_id}: ${err.message}`);
    }
  }
  
  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log('DELETION COMPLETE');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log(`  ✓ Deleted: ${deleted}`);
  console.log(`  ✗ Failed:  ${failed}`);
  console.log('═══════════════════════════════════════════════════════════════════\n');
  
  // Verify deletion
  console.log('Verifying deletion...');
  const remaining = await fetchAllCarbonylQuestions();
  console.log(`Remaining questions in ch12_carbonyl: ${remaining.length}\n`);
  
  if (remaining.length === 0) {
    console.log('✅ All ch12_carbonyl questions successfully deleted\n');
  } else {
    console.log('⚠️  Some questions still remain:');
    remaining.forEach(q => console.log(`  - ${q.display_id}`));
    console.log('');
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
