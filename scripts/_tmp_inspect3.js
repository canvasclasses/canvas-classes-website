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

  // Show all questions for papers that have shortfall
  const papers = [
    {year:2025,month:4,day:7,label:'2025 Apr 7'},
    {year:2025,month:4,day:4,label:'2025 Apr 4'},
    {year:2025,month:4,day:3,label:'2025 Apr 3'},
    {year:2024,month:1,day:29,label:'2024 Jan 29'},
    {year:2024,month:1,day:30,label:'2024 Jan 30'},
    {year:2024,month:2,day:1,label:'2024 Feb 1'},
    {year:2024,month:4,day:4,label:'2024 Apr 4'},
  ];

  for (const p of papers) {
    const matches = qs
      .filter(q => {
        const es = q.metadata?.exam_source;
        return es && es.year===p.year && nm(es.month)===p.month && es.day===p.day;
      })
      .sort((a,b) => ns(a.metadata.exam_source.shift).localeCompare(ns(b.metadata.exam_source.shift)) || a.display_id.localeCompare(b.display_id));
    console.log(`\n${p.label} (${matches.length} questions in DB):`);
    matches.forEach(q => {
      const es = q.metadata.exam_source;
      const preview = q.question_text.markdown.substring(0,80).replace(/\n/g,' ');
      console.log(`  ${q.display_id} shift=${ns(es.shift)}(${es.shift}) | ${preview}`);
    });
  }
}
main();
