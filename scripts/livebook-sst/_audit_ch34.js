'use strict';
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env.local') });
const { MongoClient } = require('mongodb');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';

(async () => {
  const c = new MongoClient(process.env.MONGODB_URI); await c.connect();
  const db = c.db('crucible');
  for (const chapNum of [3, 4]) {
    const pages = (await db.collection('book_pages').find({ book_id: BOOK_ID, chapter_number: chapNum }).toArray())
      .sort((a,b)=>a.page_number-b.page_number);
    console.log(`\n════════ CHAPTER ${chapNum} — ${pages.length} pages ════════`);
    const posCount = [0,0,0,0]; let qTotal=0, lenTells=0, wrongCount=0;
    for (const p of pages) {
      const quiz = (p.blocks||[]).find(b=>b.type==='inline_quiz');
      const qs = quiz ? (quiz.questions||[]) : [];
      if (qs.length !== 3) console.log(`  ⚠ ${p.slug}: ${qs.length} quiz questions (expected 3)`);
      qs.forEach((q,i)=>{
        qTotal++;
        const ci = q.correct_index;
        if (ci>=0 && ci<4) posCount[ci]++;
        const opts = q.options||[];
        const lens = opts.map(o=>o.length);
        const correctLen = lens[ci]||0;
        const others = lens.filter((_,idx)=>idx!==ci);
        const maxOther = Math.max(...others), minOther=Math.min(...others);
        const avgOther = others.reduce((a,b)=>a+b,0)/others.length;
        // length-tell: correct is the longest AND notably longer than average distractor
        const isLongest = correctLen >= Math.max(...lens);
        const isShortest = correctLen <= Math.min(...lens);
        const ratioLong = correctLen/avgOther;
        if ((isLongest && ratioLong>1.35) || (isShortest && avgOther/correctLen>1.35)) {
          lenTells++;
          console.log(`  ⚠ LEN-TELL ${p.slug} q${i+1}: correct=${correctLen}c vs distractors[${minOther}-${maxOther}] avg${Math.round(avgOther)} (${isLongest?'longest':'shortest'}, ratio ${ratioLong.toFixed(2)})`);
          console.log(`      Q: ${q.question.slice(0,80)}`);
        }
        // sanity: correct_index valid + explanation present
        if (ci==null||ci<0||ci>3) { wrongCount++; console.log(`  ✗ ${p.slug} q${i+1}: bad correct_index ${ci}`); }
        if (!q.explanation) console.log(`  ⚠ ${p.slug} q${i+1}: no explanation`);
      });
    }
    const pct = posCount.map(n=>Math.round(100*n/qTotal));
    console.log(`\n  QUIZ SUMMARY ch${chapNum}: ${qTotal} questions | correct_index spread A/B/C/D = ${posCount.join('/')} (${pct.join('/')}%) | length-tells: ${lenTells} | bad-index: ${wrongCount}`);
  }
  // dump scenario blocks
  console.log(`\n\n════════ SCENARIO / FLAGSHIP BLOCKS ════════`);
  const allPages = await db.collection('book_pages').find({ book_id: BOOK_ID, chapter_number: {$in:[3,4]} }).toArray();
  for (const p of allPages) {
    for (const b of (p.blocks||[])) {
      if (b.type==='you_solve_it') {
        console.log(`\n[YOU_SOLVE_IT] ${p.slug} :: ${b.title}`);
        console.log(`  solutions: ${(b.solutions||[]).length} | each has upside+tradeoff: ${(b.solutions||[]).every(s=>s.upside&&s.tradeoff)} | source_note: ${!!b.source_note} | reality_check: ${!!b.reality_check}`);
      }
      if (b.type==='perspective_scenario') {
        console.log(`\n[PERSPECTIVE] ${p.slug} :: ${b.title}`);
        console.log(`  options: ${(b.options||[]).length} | each has real_position+perspective: ${(b.options||[]).every(o=>o.real_position&&o.perspective)} | source_note: ${!!b.source_note} | synthesis: ${!!b.synthesis}`);
      }
    }
  }
  await c.close();
})().catch(e=>{console.error(e);process.exit(1);});
