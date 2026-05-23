#!/usr/bin/env node
// fetch-batch.js — pulls N chemistry questions from a chapter that need solutions
//
// Usage:
//   node scripts/chemistry-solutions/fetch-batch.js <PREFIX> [--count=N] [--from=ID] [--only=ID1,ID2,...] [--rewrite]
//
// Examples:
//   node scripts/chemistry-solutions/fetch-batch.js MOLE --count=10
//   node scripts/chemistry-solutions/fetch-batch.js ATOM --from=ATOM-016 --count=5
//   node scripts/chemistry-solutions/fetch-batch.js GOC --only=GOC-001,GOC-042
//   node scripts/chemistry-solutions/fetch-batch.js MOLE --count=10 --rewrite
//
// Mirror of scripts/physics-solutions/fetch-batch.js. Surfaces image URLs from
// question_text.markdown as image_urls[] so the agent can render the SVGs via
// the dark-background conversion (magick -background black -density 150) before
// writing the solution.

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

function parseArgs() {
  const args = { _: [] };
  for (const a of process.argv.slice(2)) {
    const m = a.match(/^--([^=]+)(?:=(.*))?$/);
    if (m) args[m[1]] = m[2] === undefined ? true : m[2];
    else args._.push(a);
  }
  return args;
}

function extractImageUrls(md) {
  if (!md || typeof md !== 'string') return [];
  const urls = new Set();
  const mdRe = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let m;
  while ((m = mdRe.exec(md)) !== null) urls.add(m[1]);
  const htmlRe = /<img\s[^>]*src=["']([^"']+)["']/gi;
  while ((m = htmlRe.exec(md)) !== null) urls.add(m[1]);
  return Array.from(urls);
}

(async () => {
  const args = parseArgs();
  const prefix = args._[0];
  if (!prefix) {
    console.error('ERROR: prefix is required. Usage: fetch-batch.js <PREFIX> [--count=N]');
    process.exit(2);
  }

  const count = Math.max(1, Math.min(50, parseInt(args.count || '5', 10)));
  const from = args.from || null;
  const only = args.only ? args.only.split(',').map(s => s.trim()).filter(Boolean) : null;
  const includeAll = !!args.rewrite;

  await mongoose.connect(process.env.MONGODB_URI);
  const Q = mongoose.connection.db.collection('questions_v2');

  const filter = { display_id: new RegExp(`^${prefix}-\\d+$`) };
  if (only) filter.display_id = { $in: only };
  if (from && !only) {
    filter.display_id = { $regex: `^${prefix}-\\d+$`, $gt: from };
  }
  if (!includeAll && !only) {
    filter.$or = [
      { 'solution.text_markdown': { $exists: false } },
      { 'solution.text_markdown': null },
      { 'solution.text_markdown': '' },
      { $expr: { $lt: [{ $strLenCP: { $ifNull: ['$solution.text_markdown', ''] } }, 300] } },
    ];
  }

  const docs = await Q.find(filter)
    .project({
      display_id: 1,
      'question_text.markdown': 1,
      options: 1,
      answer: 1,
      'metadata.chapter_id': 1,
      'metadata.tag_ids': 1,
      'metadata.examDetails': 1,
      'metadata.exam_source': 1,
      'metadata.questionNature': 1,
      'metadata.difficultyLevel': 1,
      'solution.text_markdown': 1,
    })
    .sort({ display_id: 1 })
    .limit(count)
    .toArray();

  const out = {
    prefix,
    count: docs.length,
    fetched_at: new Date().toISOString(),
    questions: docs.map(d => {
      const isMCQ = Array.isArray(d.options) && d.options.length > 0;
      const md = d.question_text && d.question_text.markdown;
      const sol = d.solution && d.solution.text_markdown ? d.solution.text_markdown : '';
      return {
        display_id: d.display_id,
        question_markdown: md,
        options: isMCQ ? d.options.map(o => ({ id: o.id, text: o.text, is_correct: !!o.is_correct })) : null,
        answer_type: isMCQ ? 'MCQ' : 'Integer',
        stored_answer: {
          correct_option: d.answer ? d.answer.correct_option : null,
          integer_value: d.answer ? d.answer.integer_value : null,
        },
        image_urls: extractImageUrls(md),
        chapter_id: d.metadata && d.metadata.chapter_id,
        tag_ids: d.metadata && d.metadata.tag_ids,
        exam_details: d.metadata && d.metadata.examDetails,
        question_nature: d.metadata && d.metadata.questionNature,
        difficulty_level: d.metadata && d.metadata.difficultyLevel,
        current_solution_length: sol.length,
        current_solution_preview: sol.slice(0, 200),
      };
    }),
  };

  console.log(JSON.stringify(out, null, 2));
  await mongoose.disconnect();
})().catch(err => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
