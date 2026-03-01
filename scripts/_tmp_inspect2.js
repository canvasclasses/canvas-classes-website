const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

const MONTH_NUM = {
  Jan:1,January:1,Feb:2,February:2,Mar:3,Apr:4,April:4,May:5,Jun:6,June:6,
  Jul:7,July:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12
};
function nm(m) {
  if (!m) return 0;
  return MONTH_NUM[String(m).trim()] || parseInt(m) || 0;
}
function ns(s) {
  if (!s) return '';
  const l = String(s).toLowerCase().replace(/[\s_]/g,'-');
  if (l==='morning'||l==='shift-i'||l==='shift-1') return 'M';
  if (l==='evening'||l==='shift-ii'||l==='shift-2') return 'E';
  return s;
}

async function main() {
  const res = await fetch('http://localhost:3000/api/v2/questions?chapter_id=ch12_carbonyl&limit=300&skip=0');
  const d = await res.json();
  const qs = (Array.isArray(d.data) ? d.data : []).filter(q => /^ALDO-\d+$/.test(q.display_id));

  // Show all 2025 Jan questions sorted by day+shift
  const jan2025 = qs
    .filter(q => {
      const es = q.metadata?.exam_source;
      return es && es.year === 2025 && nm(es.month) === 1;
    })
    .sort((a, b) => {
      const ea = a.metadata.exam_source, eb = b.metadata.exam_source;
      if (ea.day !== eb.day) return ea.day - eb.day;
      return ns(ea.shift).localeCompare(ns(eb.shift));
    });

  console.log('\n=== 2025 JAN questions in DB ===');
  jan2025.forEach(q => {
    const es = q.metadata.exam_source;
    const preview = q.question_text.markdown.substring(0,70).replace(/\n/g,' ');
    console.log(`${q.display_id} | day=${es.day} shift=${es.shift} | ${preview}`);
  });

  // Also show 2024 Apr 4 and 2024 Apr 5 Morning
  const apr2024 = qs
    .filter(q => {
      const es = q.metadata?.exam_source;
      return es && es.year === 2024 && nm(es.month) === 4 && (es.day === 4 || es.day === 5 || es.day === 6);
    })
    .sort((a, b) => {
      const ea = a.metadata.exam_source, eb = b.metadata.exam_source;
      if (ea.day !== eb.day) return ea.day - eb.day;
      return ns(ea.shift).localeCompare(ns(eb.shift));
    });

  console.log('\n=== 2024 APR 4-6 questions in DB ===');
  apr2024.forEach(q => {
    const es = q.metadata.exam_source;
    const preview = q.question_text.markdown.substring(0,70).replace(/\n/g,' ');
    console.log(`${q.display_id} | day=${es.day} shift="${es.shift}" | ${preview}`);
  });

  // Show 2024 Jan 29-31 + Feb 1
  const jan2024 = qs
    .filter(q => {
      const es = q.metadata?.exam_source;
      return es && es.year === 2024 && nm(es.month) === 1 && es.day >= 29;
    })
    .sort((a, b) => {
      const ea = a.metadata.exam_source, eb = b.metadata.exam_source;
      if (ea.day !== eb.day) return ea.day - eb.day;
      return ns(ea.shift).localeCompare(ns(eb.shift));
    });
  const feb2024 = qs
    .filter(q => {
      const es = q.metadata?.exam_source;
      return es && es.year === 2024 && nm(es.month) === 2;
    });

  console.log('\n=== 2024 JAN 29-31 + FEB questions in DB ===');
  [...jan2024, ...feb2024].forEach(q => {
    const es = q.metadata.exam_source;
    const preview = q.question_text.markdown.substring(0,70).replace(/\n/g,' ');
    console.log(`${q.display_id} | ${es.month} ${es.day} shift="${es.shift}" | ${preview}`);
  });
}
main();
