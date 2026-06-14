#!/usr/bin/env node
// dump-chapter.js — READ-ONLY. Dumps every question of a chapter (by display_id prefix)
// for NCERT-citation analysis. Does NOT write to questions_v2.
//
// Usage:  node scripts/ncert/dump-chapter.js <PREFIX> [--out=/path/file.json]
// Example: node scripts/ncert/dump-chapter.js ATOM --out=/tmp/atom-dump.json
//
// Output JSON: { prefix, count, questions: [{ display_id, type, stem, options:[{id,text}],
//                tag_ids, question_nature, exam_label, difficulty }] }

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const fs = require('fs');

function parseArgs() {
  const args = { _: [] };
  for (const a of process.argv.slice(2)) {
    const m = a.match(/^--([^=]+)(?:=(.*))?$/);
    if (m) args[m[1]] = m[2] === undefined ? true : m[2];
    else args._.push(a);
  }
  return args;
}

(async () => {
  const args = parseArgs();
  const prefix = args._[0];
  if (!prefix) { console.error('ERROR: prefix required'); process.exit(2); }
  const outPath = args.out || `/tmp/${prefix.toLowerCase()}-dump.json`;

  await mongoose.connect(process.env.MONGODB_URI);
  const Q = mongoose.connection.db.collection('questions_v2');

  const filter = {
    display_id: new RegExp(`^${prefix}-\\d+$`),
    deleted_at: null,
  };
  const docs = await Q.find(filter)
    .project({
      display_id: 1,
      type: 1,
      'question_text.markdown': 1,
      options: 1,
      'metadata.tag_ids': 1,
      'metadata.questionNature': 1,
      'metadata.examDetails': 1,
      'metadata.exam_source': 1,
      difficultyLevel: 1,
    })
    .sort({ display_id: 1 })
    .toArray();

  const questions = docs.map(d => {
    const md = (d.question_text && d.question_text.markdown) || '';
    const hasOptions = Array.isArray(d.options) && d.options.length > 0;
    const ed = d.metadata && d.metadata.examDetails;
    const examLabel = ed && ed.exam ? `${ed.exam} ${ed.year || ''}`.trim() : null;
    return {
      display_id: d.display_id,
      type: d.type || (hasOptions ? 'SCQ' : 'Integer'),
      // strip image markdown to keep the dump compact and text-focused
      stem: md.replace(/!\[[^\]]*\]\([^)]*\)/g, '[IMG]').trim(),
      options: hasOptions ? d.options.map(o => ({ id: o.id, text: (o.text || '').replace(/!\[[^\]]*\]\([^)]*\)/g, '[IMG]').trim() })) : null,
      tag_ids: (d.metadata && d.metadata.tag_ids) || [],
      question_nature: d.metadata && d.metadata.questionNature,
      exam_label: examLabel,
      difficulty: d.difficultyLevel ?? null,
    };
  });

  fs.writeFileSync(outPath, JSON.stringify({ prefix, count: questions.length, questions }, null, 2));
  console.log(`Wrote ${questions.length} ${prefix} questions → ${outPath}`);
  await mongoose.disconnect();
})().catch(e => { console.error(e.message); process.exit(1); });
