'use strict';
// READ-ONLY: ch12_carbonyl real topics (+micros) and dangling stale tags grouped with question text.
const fs = require('fs'), path = require('path');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local'), quiet: true });
const CH = 'ch12_carbonyl';

function loadTax() {
  const text = fs.readFileSync(path.join(__dirname, '..', 'packages', 'data', 'taxonomy', 'taxonomyData_from_csv.ts'), 'utf8');
  const a = text.indexOf('TAXONOMY_FROM_CSV'), eq = text.indexOf('=', a), s = text.indexOf('[', eq);
  let d = 0, e = -1; for (let i = s; i < text.length; i++){ if (text[i]==='[') d++; else if (text[i]===']'){ d--; if(!d){e=i;break;} } }
  const nodes = Function(`"use strict"; return (${text.slice(s, e+1)});`)();
  const byId = new Map(nodes.map(n => [n.id, n]));
  const chapterOf = (id) => { let n = byId.get(id), g = 0; while (n && n.type !== 'chapter' && g++ < 12) n = byId.get(n.parent_id); return n && n.type === 'chapter' ? n : null; };
  return { nodes, byId, chapterOf };
}

(async () => {
  const tax = loadTax();
  const topics = tax.nodes.filter(n => n.type === 'topic' && tax.chapterOf(n.id)?.id === CH);
  console.log(`=== REAL TOPICS in ${CH} (${topics.length}) ===`);
  for (const t of topics) {
    console.log(`\n  ${t.id}  —  ${t.name}`);
    const micros = tax.nodes.filter(n => n.type === 'micro_topic' && n.parent_id === t.id);
    for (const m of micros) console.log(`       · ${m.name}`);
  }
  const validIds = new Set(tax.nodes.filter(n => n.type === 'topic' || n.type === 'micro_topic').map(n => n.id));

  const client = new MongoClient(process.env.MONGODB_URI); await client.connect();
  const Q = client.db('crucible').collection('questions_v2');
  const docs = await Q.find({ deleted_at: null, 'metadata.chapter_id': CH },
    { projection: { display_id: 1, 'metadata.tags': 1, 'question_text.markdown': 1 } }).toArray();
  console.log(`\n\n=== ${docs.length} live questions; dangling stale tags grouped ===`);

  const groups = new Map();
  for (const q of docs) for (const t of (q.metadata?.tags || [])) {
    if (t?.tag_id && !validIds.has(t.tag_id)) { if (!groups.has(t.tag_id)) groups.set(t.tag_id, []); groups.get(t.tag_id).push(q); }
  }
  const order = [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
  for (const [tag, qs] of order) {
    console.log(`\n########## ${tag}  (${qs.length}) ##########`);
    for (const q of qs) {
      const txt = (q.question_text?.markdown || '').replace(/!\[[^\]]*\]\([^)]*\)/g, '[IMG]').replace(/\s+/g, ' ').trim().slice(0, 150);
      console.log(`  [${q.display_id}] ${txt}`);
    }
  }
  await client.close();
})().catch(e => { console.error(e); process.exit(1); });
