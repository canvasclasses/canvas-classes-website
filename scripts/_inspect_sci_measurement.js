'use strict';
// READ-ONLY inspection of the scientific-measurement page. Run: node scripts/_inspect_sci_measurement.js
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  const p = await db.collection('book_pages').findOne({ slug: 'scientific-measurement' });
  if (!p) { console.log('NOT FOUND'); await client.close(); return; }
  console.log(`TITLE: ${p.title}  | ch${p.chapter_number} p${p.page_number} | ${p.blocks?.length} blocks | published=${p.published}`);
  console.log('='.repeat(70));
  for (const b of (p.blocks || []).slice().sort((a, c) => a.order - c.order)) {
    let s = '';
    if (b.type === 'heading') s = `(h${b.level}) ${b.text}${b.objective ? '  ::obj=' + b.objective.slice(0,40) : ''}`;
    else if (b.type === 'callout') s = `[${b.variant}] ${b.title || ''}`;
    else if (b.type === 'image') s = `alt="${(b.alt || '').slice(0, 45)}"`;
    else if (b.type === 'text') s = `"${(b.markdown || '').slice(0, 70).replace(/\n/g, ' ')}"`;
    else if (b.type === 'comparison_card') s = `"${b.title || ''}" (${b.columns?.length}c)`;
    else if (b.type === 'table') s = `"${b.caption || ''}" [${(b.headers||[]).join('|')}]`;
    else if (b.type === 'latex_block') s = `${b.label || ''}: ${(b.latex||'').slice(0,40)}`;
    else if (b.type === 'inline_quiz') s = `${b.questions?.length || 0} Qs`;
    else if (b.type === 'simulation') s = `${b.simulation_id || ''}`;
    console.log(`${String(b.order).padEnd(3)} ${b.type.padEnd(16)} ${s}`);
  }
  // Dump the exam_tip callout + quiz in full so we can extend without disturbing balance
  console.log('\n' + '='.repeat(70) + '\nEXAM_TIP + QUIZ DETAIL:\n');
  for (const b of (p.blocks || [])) {
    if (b.type === 'callout' && b.variant === 'exam_tip') {
      console.log(`--- exam_tip "${b.title}" ---\n${b.markdown}\n`);
    }
    if (b.type === 'inline_quiz') {
      console.log(`--- inline_quiz (${b.questions.length} Qs, threshold ${b.pass_threshold}) ---`);
      b.questions.forEach((q, i) => {
        console.log(`Q${i+1} [diff ${q.difficulty_level}] correct=${q.correct_index} (${['A','B','C','D'][q.correct_index]})`);
      });
    }
  }
  console.log('\n' + '='.repeat(70) + '\nCLOSING SUMMARY (block before exam_tip) + TEMP TAIL:\n');
  for (const b of (p.blocks || []).slice().sort((a,c)=>a.order-c.order)) {
    if ((b.order === 25 || b.order === 27) && b.type === 'text') {
      console.log(`--- block ${b.order} (text) ---\n${b.markdown}\n`);
    }
  }
  await client.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
