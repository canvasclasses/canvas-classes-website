const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

async function main() {
  const res = await fetch('http://localhost:3000/api/v2/questions?chapter_id=ch12_carbonyl&limit=300&skip=0');
  const data = await res.json();
  const questions = (Array.isArray(data.data) ? data.data : []).filter(q => /^ALDO-\d+$/.test(q.display_id));
  
  // Find all Claisen-Schmidt questions
  const claisen = questions.filter(q => {
    const text = q.question_text?.markdown || '';
    return text.toLowerCase().includes('claisen') && text.includes('dibenzalacetone') && text.includes('3.51');
  });
  
  console.log(`Found ${claisen.length} Claisen-Schmidt dibenzalacetone questions:\n`);
  
  claisen.forEach(q => {
    const es = q.metadata?.exam_source;
    const hasImg = q.question_text.markdown.includes('canvas-chemistry-assets.r2.dev/questions/');
    console.log(`${q.display_id} | ${es?.year} ${es?.month} ${es?.day} ${es?.shift} | ${hasImg ? '🖼️  HAS IMAGE' : 'no image'}`);
    console.log(`  _id: ${q._id}`);
    console.log(`  Text preview: ${q.question_text.markdown.substring(0, 100).replace(/\n/g, ' ')}\n`);
  });
  
  // Also check what's currently at ALDO-018
  const aldo018 = questions.find(q => q.display_id === 'ALDO-018');
  if (aldo018) {
    const es = aldo018.metadata?.exam_source;
    console.log(`\nCurrent ALDO-018:`);
    console.log(`  Exam: ${es?.year} ${es?.month} ${es?.day} ${es?.shift}`);
    console.log(`  Text: ${aldo018.question_text.markdown.substring(0, 120).replace(/\n/g, ' ')}`);
  }
  
  // Check ALDO-022
  const aldo022 = questions.find(q => q.display_id === 'ALDO-022');
  if (aldo022) {
    const es = aldo022.metadata?.exam_source;
    console.log(`\nCurrent ALDO-022:`);
    console.log(`  Exam: ${es?.year} ${es?.month} ${es?.day} ${es?.shift}`);
    console.log(`  Text: ${aldo022.question_text.markdown.substring(0, 120).replace(/\n/g, ' ')}`);
  }
  
  // Check ALDO-026
  const aldo026 = questions.find(q => q.display_id === 'ALDO-026');
  if (aldo026) {
    const es = aldo026.metadata?.exam_source;
    console.log(`\nCurrent ALDO-026:`);
    console.log(`  Exam: ${es?.year} ${es?.month} ${es?.day} ${es?.shift}`);
    console.log(`  Text: ${aldo026.question_text.markdown.substring(0, 120).replace(/\n/g, ' ')}`);
  }
}

main();
