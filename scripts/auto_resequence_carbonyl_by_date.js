#!/usr/bin/env node
/**
 * Auto-resequence ch12_carbonyl questions by exam date (chronological order)
 * Uses the Next.js API instead of direct MongoDB connection
 */

const readline = require('readline');

const API_BASE = 'http://localhost:3000/api/v2';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

const monthOrder = { 
  Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, 
  Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 
};

const shiftOrder = { Morning: 1, Evening: 2, Afternoon: 2 };

async function fetchAllCarbonylQuestions() {
  console.log('📊 Fetching all ch12_carbonyl questions via API...\n');
  
  const response = await fetch(`${API_BASE}/questions?chapter_id=ch12_carbonyl&limit=500`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(`API error: ${data.error}`);
  }
  
  // Filter to only ALDO questions (exclude CARB-001, CARB-002)
  const aldoQuestions = data.data.questions.filter(q => /^ALDO-\d+$/.test(q.display_id));
  
  console.log(`✓ Found ${aldoQuestions.length} ALDO questions\n`);
  return aldoQuestions;
}

function sortByExamDate(questions) {
  return questions.sort((a, b) => {
    const esA = a.metadata?.exam_source || {};
    const esB = b.metadata?.exam_source || {};
    
    // Year DESC (newer first)
    if (esB.year !== esA.year) return (esB.year || 0) - (esA.year || 0);
    
    // Month DESC
    const monthA = monthOrder[esA.month] || 0;
    const monthB = monthOrder[esB.month] || 0;
    if (monthB !== monthA) return monthB - monthA;
    
    // Day DESC
    if ((esB.day || 0) !== (esA.day || 0)) return (esB.day || 0) - (esA.day || 0);
    
    // Shift (Morning before Evening)
    const shiftA = shiftOrder[esA.shift] || 0;
    const shiftB = shiftOrder[esB.shift] || 0;
    if (shiftA !== shiftB) return shiftA - shiftB;
    
    // Fallback: current display_id
    return a.display_id.localeCompare(b.display_id);
  });
}

function generateNewMapping(sortedQuestions) {
  const mapping = [];
  let sequence = 16; // Start from ALDO-016
  
  sortedQuestions.forEach(q => {
    const newDisplayId = `ALDO-${String(sequence).padStart(3, '0')}`;
    const es = q.metadata?.exam_source || {};
    
    mapping.push({
      _id: q._id,
      old_display_id: q.display_id,
      new_display_id: newDisplayId,
      exam_metadata: `${es.exam || 'N/A'} ${es.year || ''} ${es.month || ''} ${es.day || ''} ${es.shift || ''}`.trim(),
      question_preview: q.question_text.markdown.substring(0, 80).replace(/\n/g, ' ')
    });
    
    sequence++;
  });
  
  return mapping;
}

async function applyResequencing(mapping) {
  console.log('\n🔄 Applying resequencing via API...\n');
  
  let success = 0;
  let failed = 0;
  
  for (const item of mapping) {
    if (item.old_display_id === item.new_display_id) {
      console.log(`  ⏭️  ${item.old_display_id} → no change`);
      success++;
      continue;
    }
    
    try {
      const response = await fetch(`${API_BASE}/questions/${item._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_id: item.new_display_id })
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log(`  ✓ ${item.old_display_id} → ${item.new_display_id}`);
        success++;
      } else {
        console.log(`  ✗ ${item.old_display_id} → ${item.new_display_id} (${data.error})`);
        failed++;
      }
    } catch (error) {
      console.log(`  ✗ ${item.old_display_id} → ${item.new_display_id} (network error)`);
      failed++;
    }
    
    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`✓ Success: ${success}`);
  console.log(`✗ Failed: ${failed}`);
  console.log('═══════════════════════════════════════════════════════════\n');
}

async function main() {
  try {
    // Step 1: Fetch questions
    const questions = await fetchAllCarbonylQuestions();
    
    if (questions.length === 0) {
      console.log('⚠️  No ALDO questions found. Exiting.');
      rl.close();
      return;
    }
    
    // Step 2: Sort by exam date
    console.log('📅 Sorting by exam date (newest → oldest)...\n');
    const sorted = sortByExamDate(questions);
    
    // Step 3: Generate new mapping
    const mapping = generateNewMapping(sorted);
    
    // Step 4: Show preview
    console.log('═══════════════════════════════════════════════════════════');
    console.log('PREVIEW: New Sequence (first 20 questions)');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    mapping.slice(0, 20).forEach((item, idx) => {
      const arrow = item.old_display_id !== item.new_display_id ? '→' : '=';
      console.log(`${String(idx + 1).padStart(3)}. ${item.old_display_id} ${arrow} ${item.new_display_id} | ${item.exam_metadata}`);
    });
    
    if (mapping.length > 20) {
      console.log(`\n... and ${mapping.length - 20} more questions\n`);
    }
    
    // Count changes
    const changes = mapping.filter(m => m.old_display_id !== m.new_display_id).length;
    console.log(`\n📊 Summary: ${changes} questions will be renumbered, ${mapping.length - changes} stay the same\n`);
    
    // Step 5: Save preview to file
    const fs = require('fs');
    const previewPath = '/Users/CanvasClasses/Desktop/canvas/carbonyl_resequencing_preview.json';
    fs.writeFileSync(previewPath, JSON.stringify(mapping, null, 2));
    console.log(`💾 Full preview saved to: ${previewPath}\n`);
    
    // Step 6: Ask for confirmation
    const answer = await ask('❓ Apply this resequencing? (yes/no): ');
    
    if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
      await applyResequencing(mapping);
      console.log('✅ Resequencing complete!\n');
    } else {
      console.log('❌ Cancelled. No changes made.\n');
    }
    
    rl.close();
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
}

main();
