#!/usr/bin/env node
// fetch-batch.js — pulls N questions from a chapter that need solutions
//
// Usage:
//   node scripts/math-solutions/fetch-batch.js <PREFIX> [--count=N] [--from=ID] [--only=ID1,ID2,...] [--rewrite]
//
// Examples:
//   node scripts/math-solutions/fetch-batch.js STLN --count=5
//   node scripts/math-solutions/fetch-batch.js STLN --from=STLN-016 --count=5
//   node scripts/math-solutions/fetch-batch.js STLN --only=STLN-042,STLN-051
//   node scripts/math-solutions/fetch-batch.js STLN --count=5 --rewrite   # include questions that already have solutions
//
// Default: returns only questions with missing or very short (<300 chars) solutions.
// The --rewrite flag overrides this and returns questions regardless of solution state
// (useful when re-solving a chapter to bring it up to the new workflow standard).
//
// Output: JSON to stdout, one object containing:
//   {
//     prefix: "STLN",
//     count: 5,
//     questions: [
//       { display_id, question_markdown, options: [{id, text}, ...] | null,
//         answer_type: "MCQ" | "Integer",
//         stored_answer: { correct_option?, integer_value? },
//         exam_label?, chapter_id?, tag_ids? }
//     ]
//   }

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { prepareImages } = require('../svg-mapper/image-prep');

// Markdown ![alt](url) + HTML <img src="url"> — used for both stem and option text.
function extractImageUrls(text) {
  if (!text || typeof text !== 'string') return [];
  const urls = new Set();
  let m;
  const mdRe = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  while ((m = mdRe.exec(text)) !== null) urls.add(m[1]);
  const htmlRe = /<img\s[^>]*src=["']([^"']+)["']/gi;
  while ((m = htmlRe.exec(text)) !== null) urls.add(m[1]);
  return Array.from(urls);
}

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
      type: 1,
      'question_text.markdown': 1,
      options: 1,
      answer: 1,
      'metadata.chapter_id': 1,
      'metadata.tag_ids': 1,
      'metadata.examDetails': 1,
      'metadata.exam_source': 1,
      'metadata.questionNature': 1,
      'solution.text_markdown': 1,
    })
    .sort({ display_id: 1 })
    .limit(count)
    .toArray();

  // Figures are SVG/PNG URLs in stem markdown + (for graph/shape-option questions)
  // option text. The vision API can't read SVG, so rasterise each to a local
  // dark-background PNG and surface its path in `images`.
  const imgDir = `/tmp/solfigs/${prefix}`;
  const questions = [];
  for (const d of docs) {
    const hasOptions = Array.isArray(d.options) && d.options.length > 0;
    // answer_type reflects the stored question type when present (SCQ vs MCQ vs NVT),
    // falling back to options-presence for older docs.
    const answer_type = d.type || (hasOptions ? 'SCQ' : 'Integer');
    const md = (d.question_text && d.question_text.markdown) || '';

    const labeled = [];
    for (const u of extractImageUrls(md)) labeled.push({ source: 'stem', url: u });
    if (hasOptions) for (const o of d.options) for (const u of extractImageUrls(o.text)) labeled.push({ source: `option ${o.id}`, url: u });
    const images = labeled.length ? await prepareImages(labeled, d.display_id, imgDir) : [];

    questions.push({
      display_id: d.display_id,
      question_markdown: md,
      options: hasOptions ? d.options.map(o => ({ id: o.id, text: o.text })) : null,
      answer_type,
      image_urls: labeled.map(l => l.url),
      images, // [{ source: 'stem'|'option a'|…, url, file }] — Read each `file` (local dark-bg PNG)
      stored_answer: {
        correct_option: d.answer ? (d.answer.correct_option || null) : null,
        correct_options: d.answer ? (d.answer.correct_options || null) : null,
        integer_value: d.answer ? (d.answer.integer_value ?? null) : null,
      },
      chapter_id: d.metadata && d.metadata.chapter_id,
      tag_ids: d.metadata && d.metadata.tag_ids,
      exam_details: d.metadata && d.metadata.examDetails,
      current_solution_length: d.solution && d.solution.text_markdown ? d.solution.text_markdown.length : 0,
    });
  }

  const out = { prefix, count: docs.length, fetched_at: new Date().toISOString(), image_dir: imgDir, questions };
  console.log(JSON.stringify(out, null, 2));
  await mongoose.disconnect();
})().catch(err => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
