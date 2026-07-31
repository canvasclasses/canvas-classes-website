#!/usr/bin/env node
/**
 * Validate the physics practice corpus in _agents/question-banks/physics-hcv/chapters/.
 *
 * Mirrors PracticeBankBlockSchema + WorkedExampleBlockSchema from
 * packages/data/books/schemas.ts. Those are the authority — if a check here ever
 * disagrees with the Zod schema, the Zod schema wins and this file is the bug.
 *
 * Also enforces the corpus-level rules that Zod cannot see:
 *   - no third-party book attribution anywhere (CLAUDE.md / founder rule)
 *   - no null values (Mixed-stored + Zod .optional() rejects null on save)
 *   - LaTeX: `$...$` only, never `$$`, balanced delimiters
 *   - MCQ correct-answer positions are spread, not clustered on one letter
 *
 * usage: node scripts/hcv-bank/validate.js [chapterFileOrNumber ...]
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', '..', '_agents', 'question-banks', 'physics-hcv', 'chapters');

const PRACTICE_SOURCE = ['ncert_exercise', 'ncert_exemplar', 'cbse_pyq', 'jee_neet', 'mcq'];
const REVEAL_MODE = ['always_visible', 'tap_to_reveal'];
const WE_VARIANT = ['solved_example', 'ncert_intext'];

// Anything that would tell a student where these questions came from.
const ATTRIBUTION = /\b(h\.?\s?c\.?\s?verma|verma|concepts\s+of\s+physics|bharati\s+bhawan|hcv)\b/i;
// Sources that would falsely imply NCERT/CBSE/PYQ provenance for rebuilt items.
const FORBIDDEN_SOURCE = new Set(['ncert_exercise', 'ncert_exemplar', 'cbse_pyq']);

let errors = [], warnings = [];
const err = (f, m) => errors.push(`${f}: ${m}`);
const warn = (f, m) => warnings.push(`${f}: ${m}`);

function walkStrings(node, visit, trail = '') {
  if (node === null) { visit(null, trail); return; }
  if (typeof node === 'string') { visit(node, trail); return; }
  if (Array.isArray(node)) return node.forEach((v, i) => walkStrings(v, visit, `${trail}[${i}]`));
  if (typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) walkStrings(v, visit, trail ? `${trail}.${k}` : k);
  }
}

// Text that reads as the author reasoning in public and correcting themselves
// mid-solution. A student must never see this; it means the item was written
// without the answer settled first and needs a rewrite, not a patch.
const FLAILING = /\b(wait,|recheck|re-check|let me reconsider|that cannot be right|which cannot be right|scratch that|actually,? no\b|on second thought|i made an error|the algebra and the reasoning disagree|re-reading)/i;
// An explanation that names an option letter breaks the moment options are reordered.
// Only a *bare* letter counts — "answer is a pure number" must not trip this.
const OPTION_LETTER = /\b(?:option|choice|alternative)\s*\(?[a-d]\)?(?![a-z])|\banswer\s+is\s*\([a-d]\)/i;

function checkText(file, where, s) {
  if (ATTRIBUTION.test(s)) err(file, `${where}: leaks source attribution -> "${s.match(ATTRIBUTION)[0]}"`);
  if (s.includes('$$')) err(file, `${where}: uses $$ (banned; use $...$)`);
  const dollars = (s.match(/(?<!\\)\$/g) || []).length;
  if (dollars % 2 !== 0) err(file, `${where}: unbalanced $ (${dollars})`);
  if (/\\dfrac/.test(s)) warn(file, `${where}: \\dfrac renders oversized; use \\frac`);
  if (FLAILING.test(s)) err(file, `${where}: reads as self-correction mid-text -> "${s.match(FLAILING)[0]}" (rewrite the item)`);
  if (OPTION_LETTER.test(s)) err(file, `${where}: refers to an option by letter -> "${s.match(OPTION_LETTER)[0].trim()}" (breaks when options are reordered)`);
}

function validateFile(file) {
  const full = path.join(DIR, file);
  let doc;
  try { doc = JSON.parse(fs.readFileSync(full, 'utf8')); }
  catch (e) { err(file, `unparseable JSON: ${e.message}`); return null; }

  for (const k of ['hcv_chapter', 'hcv_title', 'ncert', 'blocks']) {
    if (doc[k] === undefined) err(file, `missing top-level "${k}"`);
  }

  // No nulls anywhere — the Live Books save path Zod-rejects null on optional fields.
  walkStrings(doc, (s, trail) => {
    if (s === null) err(file, `null at ${trail} (use undefined / omit the key)`);
    else checkText(file, trail, s);
  });

  const ids = new Set();
  const useId = (id, where) => {
    if (!id) return err(file, `${where}: missing id`);
    if (ids.has(id)) err(file, `${where}: duplicate id "${id}"`);
    ids.add(id);
  };

  const positions = [];
  const pb = doc.blocks && doc.blocks.practice_bank;
  if (!pb) {
    err(file, 'blocks.practice_bank missing');
  } else {
    if (pb.type !== 'practice_bank') err(file, `practice_bank.type is "${pb.type}"`);
    useId(pb.id, 'practice_bank');
    if (typeof pb.order !== 'number' || pb.order < 0) err(file, 'practice_bank.order must be a non-negative integer');
    if (!Array.isArray(pb.sections) || pb.sections.length < 1) err(file, 'practice_bank.sections must be a non-empty array');
    (pb.sections || []).forEach((sec, si) => {
      const w = `sections[${si}]`;
      if (!sec.id) err(file, `${w}: missing id`);
      if (!sec.title) err(file, `${w}: missing title`);
      if (!Array.isArray(sec.items) || sec.items.length < 1) return err(file, `${w}: items must be non-empty`);
      sec.items.forEach((it, ii) => {
        const w2 = `${w}.items[${ii}]`;
        useId(it.id, w2);
        if (!PRACTICE_SOURCE.includes(it.source)) err(file, `${w2}: bad source "${it.source}"`);
        if (FORBIDDEN_SOURCE.has(it.source)) err(file, `${w2}: source "${it.source}" falsely implies NCERT/CBSE provenance`);
        if (it.kind === 'mcq') {
          if (!it.prompt) err(file, `${w2}: missing prompt`);
          if (!Array.isArray(it.options) || it.options.length !== 4) err(file, `${w2}: expected exactly 4 options, got ${it.options && it.options.length}`);
          if (!Number.isInteger(it.correct_index) || it.correct_index < 0 || it.correct_index >= (it.options || []).length) {
            err(file, `${w2}: correct_index ${it.correct_index} out of range`);
          } else positions.push(it.correct_index);
          if (!it.explanation) err(file, `${w2}: missing explanation`);
          const opts = (it.options || []).map(o => String(o).trim());
          if (new Set(opts).size !== opts.length) err(file, `${w2}: duplicate option text`);
          // length-tell: correct option should not be conspicuously the longest
          if (Number.isInteger(it.correct_index) && opts.length === 4) {
            const lens = opts.map(o => o.length);
            const c = lens[it.correct_index];
            const others = lens.filter((_, i) => i !== it.correct_index);
            if (c > Math.max(...others) * 1.8 && c > 24) warn(file, `${w2}: correct option is much longer than the rest (length-tell)`);
          }
        } else if (it.kind === 'numerical') {
          if (!it.prompt) err(file, `${w2}: missing prompt`);
          if (!it.solution) err(file, `${w2}: missing solution`);
        } else {
          err(file, `${w2}: unknown kind "${it.kind}"`);
        }
      });
    });
  }

  const wes = (doc.blocks && doc.blocks.worked_examples) || [];
  if (!Array.isArray(wes)) err(file, 'blocks.worked_examples must be an array');
  wes.forEach((we, i) => {
    const w = `worked_examples[${i}]`;
    if (we.type !== 'worked_example') err(file, `${w}: type is "${we.type}"`);
    useId(we.id, w);
    if (typeof we.order !== 'number' || we.order < 0) err(file, `${w}: order must be a non-negative integer`);
    if (!we.label) err(file, `${w}: missing label`);
    if (!WE_VARIANT.includes(we.variant)) err(file, `${w}: bad variant "${we.variant}"`);
    if (!REVEAL_MODE.includes(we.reveal_mode)) err(file, `${w}: bad reveal_mode "${we.reveal_mode}"`);
    if (!we.problem) err(file, `${w}: missing problem`);
    if (!we.solution) err(file, `${w}: missing solution`);
  });

  return { file, chapter: doc.hcv_chapter, mcqs: positions.length, worked: wes.length, positions };
}

// ── run ──────────────────────────────────────────────────────────────────────
const arg = process.argv.slice(2);
let files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter(f => f.endsWith('.json')).sort() : [];
if (arg.length) {
  const want = arg.map(a => (/^\d+$/.test(a) ? `ch${String(a).padStart(2, '0')}.json` : path.basename(a)));
  files = files.filter(f => want.includes(f));
}
if (!files.length) { console.error(`No chapter files found in ${DIR}`); process.exit(1); }

const rows = files.map(validateFile).filter(Boolean);

const all = rows.flatMap(r => r.positions);
const dist = [0, 1, 2, 3].map(i => all.filter(p => p === i).length);

console.log(`\n  ${'file'.padEnd(30)} ${'ch'.padStart(3)} ${'MCQ'.padStart(4)} ${'WE'.padStart(3)}   answer spread a/b/c/d`);
for (const r of rows) {
  const d = [0, 1, 2, 3].map(i => r.positions.filter(p => p === i).length).join('/');
  console.log(`  ${r.file.padEnd(30)} ${String(r.chapter).padStart(3)} ${String(r.mcqs).padStart(4)} ${String(r.worked).padStart(3)}   ${d}`);
}
console.log(`\n  TOTAL: ${rows.length} chapters, ${all.length} MCQs, ${rows.reduce((s, r) => s + r.worked, 0)} worked examples`);
console.log(`  Answer spread a/b/c/d: ${dist.join(' / ')}  (${dist.map(d => all.length ? (100 * d / all.length).toFixed(1) + '%' : '0%').join(', ')})`);

if (all.length >= 40) {
  dist.forEach((d, i) => {
    const pct = 100 * d / all.length;
    if (pct < 15 || pct > 35) warnings.push(`corpus: answer position ${'abcd'[i]} is ${pct.toFixed(1)}% (target 15-35%)`);
  });
}

if (warnings.length) { console.log(`\n  ${warnings.length} WARNING(S):`); warnings.forEach(w => console.log('   ! ' + w)); }
if (errors.length) {
  console.log(`\n  ${errors.length} ERROR(S):`);
  errors.forEach(e => console.log('   x ' + e));
  process.exit(1);
}
console.log('\n  ✓ all checks passed\n');
