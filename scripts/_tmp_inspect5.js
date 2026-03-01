const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
async function main() {
  const res = await fetch('http://localhost:3000/api/v2/questions?chapter_id=ch12_carbonyl&limit=300&skip=0');
  const d = await res.json();
  const qs = (Array.isArray(d.data) ? d.data : []).filter(q => /^ALDO-\d+$/.test(q.display_id));

  // Check the specific questions that are being matched incorrectly
  const ids = ['ALDO-078','ALDO-087','ALDO-029','ALDO-081','ALDO-086','ALDO-066'];
  ids.forEach(id => {
    const q = qs.find(q => q.display_id === id);
    if (q) {
      const es = q.metadata.exam_source;
      console.log(`\n${id} | ${es.year} ${es.month} ${es.day} ${es.shift}`);
      console.log(`   TEXT: ${q.question_text.markdown.substring(0,150).replace(/\n/g,' ')}`);
      console.log(`   contains 'haloform': ${q.question_text.markdown.toLowerCase().includes('haloform')}`);
      console.log(`   contains '56382579': ${q.question_text.markdown.includes('56382579')}`);
      console.log(`   contains 'ethyl acetate': ${q.question_text.markdown.toLowerCase().includes('ethyl acetate')}`);
      console.log(`   contains 'vanilla beans': ${q.question_text.markdown.toLowerCase().includes('vanilla beans')}`);
    }
  });
  
  // Also check what ALDO-066 currently is
  const q66 = qs.find(q => q.display_id === 'ALDO-066');
  if (q66) {
    const es = q66.metadata.exam_source;
    console.log(`\nALDO-066 current: ${es.year} ${es.month} ${es.day} ${es.shift}`);
    console.log(`   TEXT: ${q66.question_text.markdown.substring(0,120).replace(/\n/g,' ')}`);
  }
}
main();
