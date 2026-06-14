#!/usr/bin/env node
// fetch-batch.js — pulls N physics questions from a chapter that need solutions
//
// Usage:
//   node scripts/physics-solutions/fetch-batch.js <PREFIX> [--count=N] [--from=ID] [--only=ID1,ID2,...] [--rewrite]
//
// Examples:
//   node scripts/physics-solutions/fetch-batch.js MIP --count=10
//   node scripts/physics-solutions/fetch-batch.js NLM --from=NLM-016 --count=5
//   node scripts/physics-solutions/fetch-batch.js MIP --only=MIP-001,MIP-042
//   node scripts/physics-solutions/fetch-batch.js MIP --count=10 --rewrite
//
// Default: returns only questions with missing or very short (<300 chars) solutions.
// --rewrite includes all questions regardless of solution state — use when re-solving
// a chapter under the new workflow.
//
// Output: JSON to stdout with image URLs surfaced from question_text.markdown so the
// agent can `Read` each image before writing the solution.
//
//   {
//     prefix: "MIP",
//     count: 10,
//     questions: [
//       { display_id, question_markdown, options: [{id, text}, ...] | null,
//         answer_type: "MCQ" | "Integer",
//         stored_answer: { correct_option?, integer_value? },
//         image_urls: ["https://...r2.dev/..."],   // extracted from markdown
//         chapter_id?, tag_ids?, exam_details?,
//         current_solution_length, current_solution_preview }
//     ]
//   }

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { prepareImages } = require('../svg-mapper/image-prep');

function parseArgs() {
  const args = { _: [] };
  for (const a of process.argv.slice(2)) {
    const m = a.match(/^--([^=]+)(?:=(.*))?$/);
    if (m) args[m[1]] = m[2] === undefined ? true : m[2];
    else args._.push(a);
  }
  return args;
}

// Extract markdown image URLs: ![alt](url) and HTML <img src="url">.
function extractImageUrls(md) {
  if (!md || typeof md !== 'string') return [];
  const urls = new Set();
  // Markdown: ![alt](url) — url may contain query string; stop at whitespace or close paren.
  const mdRe = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let m;
  while ((m = mdRe.exec(md)) !== null) urls.add(m[1]);
  // HTML <img src="url">
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

  // Figures live as SVG/PNG URLs in the stem markdown and (for graph/shape-option
  // questions) in the option text. The vision API can't read SVG, so download +
  // rasterise each to a local dark-background PNG and surface its path in `images`.
  const imgDir = `/tmp/solfigs/${prefix}`;
  const questions = [];
  for (const d of docs) {
    const isMCQ = Array.isArray(d.options) && d.options.length > 0;
    const md = d.question_text && d.question_text.markdown;
    const sol = d.solution && d.solution.text_markdown ? d.solution.text_markdown : '';

    const labeled = [];
    for (const u of extractImageUrls(md)) labeled.push({ source: 'stem', url: u });
    if (isMCQ) for (const o of d.options) for (const u of extractImageUrls(o.text)) labeled.push({ source: `option ${o.id}`, url: u });
    const images = labeled.length ? await prepareImages(labeled, d.display_id, imgDir) : [];

    questions.push({
      display_id: d.display_id,
      question_markdown: md,
      options: isMCQ ? d.options.map(o => ({ id: o.id, text: o.text, is_correct: !!o.is_correct })) : null,
      answer_type: isMCQ ? 'MCQ' : 'Integer',
      stored_answer: {
        correct_option: d.answer ? d.answer.correct_option : null,
        integer_value: d.answer ? d.answer.integer_value : null,
      },
      image_urls: labeled.map(l => l.url),
      images, // [{ source: 'stem'|'option a'|…, url, file }] — Read each `file` (local dark-bg PNG)
      chapter_id: d.metadata && d.metadata.chapter_id,
      tag_ids: d.metadata && d.metadata.tag_ids,
      exam_details: d.metadata && d.metadata.examDetails,
      question_nature: d.metadata && d.metadata.questionNature,
      difficulty_level: d.metadata && d.metadata.difficultyLevel,
      current_solution_length: sol.length,
      current_solution_preview: sol.slice(0, 200),
    });
  }

  const out = { prefix, count: docs.length, fetched_at: new Date().toISOString(), image_dir: imgDir, questions };
  console.log(JSON.stringify(out, null, 2));
  await mongoose.disconnect();
})().catch(err => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
