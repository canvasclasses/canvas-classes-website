const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const MONTH_NUM = {Jan:1,January:1,Feb:2,February:2,Mar:3,Apr:4,April:4,May:5,Jun:6,June:6,Jul:7,July:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12};
function nm(m) { return MONTH_NUM[String(m||'').trim()] || 0; }
function ns(s) {
  const l = String(s||'').toLowerCase().replace(/[\s_]/g,'-');
  if (l==='morning'||l==='shift-i'||l==='shift-1') return 'M';
  if (l==='evening'||l==='shift-ii'||l==='shift-2') return 'E';
  return s;
}

async function main() {
  const res = await fetch('http://localhost:3000/api/v2/questions?chapter_id=ch12_carbonyl&limit=300&skip=0');
  const d = await res.json();
  const qs = (Array.isArray(d.data) ? d.data : []).filter(q => /^ALDO-\d+$/.test(q.display_id));

  // Check all the problematic ones - what's actually in the DB for these exam combos
  const checks = [
    // ALDO-018 slot: 2024 Apr 4 Evening
    {year:2024, month:4, day:4, shift:'E', label:'2024 Apr 4 Evening'},
    // ALDO-022 slot: 2025 Apr 3 Morning  
    {year:2025, month:4, day:3, shift:'M', label:'2025 Apr 3 Morning'},
    // ALDO-026 slot: 2025 Jan 29 Evening
    {year:2025, month:1, day:29, shift:'E', label:'2025 Jan 29 Evening'},
    // ALDO-028 slot: 2024 Jan 30 Morning
    {year:2024, month:1, day:30, shift:'M', label:'2024 Jan 30 Morning'},
    // ALDO-073 slot: 2024 Jan 29 Evening
    {year:2024, month:1, day:29, shift:'E', label:'2024 Jan 29 Evening'},
    // ALDO-078 slot: 2024 Jan 31 Morning
    {year:2024, month:1, day:31, shift:'M', label:'2024 Jan 31 Morning'},
    // ALDO-079,080 slots: 2024 Jan 31 Evening
    {year:2024, month:1, day:31, shift:'E', label:'2024 Jan 31 Evening'},
  ];

  for (const c of checks) {
    const matches = qs.filter(q => {
      const es = q.metadata?.exam_source;
      if (!es) return false;
      return es.year===c.year && nm(es.month)===c.month && es.day===c.day && ns(es.shift)===c.shift;
    }).sort((a,b) => a.display_id.localeCompare(b.display_id));
    
    console.log(`\n${c.label} (${matches.length} in DB):`);
    matches.forEach(q => {
      const preview = q.question_text.markdown.substring(0,100).replace(/\n/g,' ');
      console.log(`  ${q.display_id} | ${preview}`);
    });
  }
  
  // Also: which questions contain "dibenzalacetone"?
  console.log('\n--- Questions with "dibenzalacetone" ---');
  qs.filter(q => q.question_text.markdown.toLowerCase().includes('dibenzalacetone')).forEach(q => {
    const es = q.metadata?.exam_source;
    console.log(`  ${q.display_id} | ${es?.year} ${es?.month} ${es?.day} ${es?.shift}`);
  });
  
  // Which have "optically active"?
  console.log('\n--- Questions with "optically active" ---');
  qs.filter(q => q.question_text.markdown.toLowerCase().includes('optically active')).forEach(q => {
    const es = q.metadata?.exam_source;
    const preview = q.question_text.markdown.substring(0,60).replace(/\n/g,' ');
    console.log(`  ${q.display_id} | ${es?.year} ${es?.month} ${es?.day} ${es?.shift} | ${preview}`);
  });

  // Which have "least likely"?
  console.log('\n--- Questions with "least likely" ---');
  qs.filter(q => q.question_text.markdown.toLowerCase().includes('least likely')).forEach(q => {
    const es = q.metadata?.exam_source;
    console.log(`  ${q.display_id} | ${es?.year} ${es?.month} ${es?.day} ${es?.shift}`);
  });

  // Which have "NaHCO3"?
  console.log('\n--- Questions with "NaHCO3" on 2025 Jan 28 ---');
  qs.filter(q => {
    const es = q.metadata?.exam_source;
    return es?.year===2025 && nm(es?.month)===1 && es?.day===28 && q.question_text.markdown.includes('NaHCO');
  }).forEach(q => {
    const preview = q.question_text.markdown.substring(0,80).replace(/\n/g,' ');
    console.log(`  ${q.display_id} | ${preview}`);
  });
}
main();
