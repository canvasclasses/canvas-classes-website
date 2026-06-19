'use strict';
// READ-ONLY: inspect ch12_haloalkanes dangling tags + real taxonomy tags to build a mapping.
const fs = require('fs'), path = require('path');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local'), quiet: true });

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
  const realTopics = tax.nodes.filter(n => n.type === 'topic' && tax.chapterOf(n.id)?.id === 'ch12_haloalkanes');
  console.log('=== REAL taxonomy TOPIC tags in ch12_haloalkanes ===');
  for (const t of realTopics) console.log(`  ${t.id.padEnd(20)} ${t.name}`);

  const client = new MongoClient(process.env.MONGODB_URI); await client.connect();
  const Q = client.db('crucible').collection('questions_v2');
  const validIds = new Set(tax.nodes.filter(n => n.type === 'topic' || n.type === 'micro_topic').map(n => n.id));

  const docs = await Q.find({ deleted_at: null, 'metadata.chapter_id': 'ch12_haloalkanes' },
    { projection: { display_id: 1, 'metadata.tags': 1 } }).toArray();
  console.log(`\n=== ${docs.length} live haloalkanes questions ===`);

  const stale = new Map(); // staleId -> {count, names:Map(name->count), examples:[]}
  let sampleTag = null;
  for (const q of docs) {
    for (const t of (q.metadata?.tags || [])) {
      if (!sampleTag) sampleTag = t;
      if (t?.tag_id && !validIds.has(t.tag_id)) {
        const s = stale.get(t.tag_id) || { count: 0, names: new Map(), examples: [] };
        s.count++;
        const nm = t.tag_name || '(no name)';
        s.names.set(nm, (s.names.get(nm) || 0) + 1);
        if (s.examples.length < 4) s.examples.push(q.display_id);
        stale.set(t.tag_id, s);
      }
    }
  }
  console.log('\n=== sample tag object shape ===');
  console.log('  ', JSON.stringify(sampleTag));
  console.log('\n=== STALE tags in ch12_haloalkanes (id → stored name(s)) ===');
  for (const [id, s] of [...stale.entries()].sort((a,b)=> {
    const na = +(a[0].match(/_(\d+)$/)?.[1]||0), nb = +(b[0].match(/_(\d+)$/)?.[1]||0); return na-nb;
  })) {
    console.log(`  ${id.padEnd(20)} x${s.count}  name(s): ${[...s.names.keys()].join(' | ')}  eg=${s.examples.join(',')}`);
  }
  await client.close();
})().catch(e => { console.error(e); process.exit(1); });
