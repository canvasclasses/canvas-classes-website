'use strict';
// READ-ONLY: dump ch12_haloalkanes questions grouped by their stale tag, to infer each stale tag's topic.
const fs = require('fs'), path = require('path');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local'), quiet: true });

const REAL = new Set(['tag_haloalkanes_1','tag_haloalkanes_2','tag_haloalkanes_3','tag_haloalkanes_4','tag_haloalkanes_5','tag_haloalkanes_6','tag_haloalkanes_7','tag_haloalkanes_8']);

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI); await client.connect();
  const Q = client.db('crucible').collection('questions_v2');
  const docs = await Q.find({ deleted_at: null, 'metadata.chapter_id': 'ch12_haloalkanes' },
    { projection: { display_id: 1, 'metadata.tags': 1, 'question_text.markdown': 1 } }).toArray();

  const groups = new Map();
  for (const q of docs) {
    for (const t of (q.metadata?.tags || [])) {
      if (t?.tag_id && t.tag_id.startsWith('tag_haloalkane_') && !REAL.has(t.tag_id)) {
        if (!groups.has(t.tag_id)) groups.set(t.tag_id, []);
        groups.get(t.tag_id).push(q);
      }
    }
  }
  const order = [...groups.keys()].sort((a,b)=> (+a.match(/_(\d+)$/)[1]) - (+b.match(/_(\d+)$/)[1]));
  for (const tag of order) {
    const qs = groups.get(tag);
    console.log(`\n########## ${tag}  (${qs.length} questions) ##########`);
    for (const q of qs) {
      const txt = (q.question_text?.markdown || '').replace(/\s+/g,' ').slice(0, 170);
      console.log(`  [${q.display_id}] ${txt}`);
    }
  }
  await client.close();
})().catch(e => { console.error(e); process.exit(1); });
