'use strict';
/**
 * Render EVERY LaTeX expression in the Class 12 Physics book through the real
 * KaTeX, with the same options the reader uses (see packages/ui/MathRenderer.tsx),
 * and report anything that fails to parse.
 *
 * The browser spot-check only proves the pages you happen to open. This proves
 * all 82 of them, which is the point.
 *
 * Also flags the two authoring mistakes that produce silently wrong output
 * rather than an error:
 *   • an ODD number of `$` on a line — an unclosed delimiter, so prose renders
 *     as maths (or vice versa) from there on;
 *   • `$$` anywhere — banned by the workflow (§4 / §6.1), oversized render.
 *
 * Run: node scripts/physics12-book/_latex_check.js
 */
const katex = require('katex');
const { withDb } = require('../lib/book-writer');

const KATEX_OPTS = { throwOnError: true, trust: true, strict: false };

/** Every string field in a block that the renderer may pass through KaTeX. */
const TEXT_KEYS = [
  'markdown', 'text', 'prompt', 'hint', 'reveal', 'problem', 'solution', 'intro',
  'title', 'subtitle', 'caption', 'label', 'note', 'latex', 'say', 'why', 'math',
  'question', 'explanation', 'answer', 'blurb', 'feedback_right', 'feedback_wrong',
  'blank_answer', 'reveal_after', 'definition', 'term', 'heading', 'alt',
];

/** Walk any nested block/array structure and yield [path, string]. */
function* strings(node, path = '') {
  if (node == null) return;
  if (typeof node === 'string') { yield [path, node]; return; }
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) yield* strings(node[i], `${path}[${i}]`);
    return;
  }
  if (typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (typeof v === 'string' && !TEXT_KEYS.includes(k)) continue; // ids, slugs, enums
      yield* strings(v, path ? `${path}.${k}` : k);
    }
  }
}

/** Pull the inline-maths spans out of a markdown string. */
function inlineMaths(s) {
  const out = [];
  const re = /\$([^$]+)\$/g;
  let m;
  while ((m = re.exec(s)) !== null) out.push(m[1]);
  return out;
}

withDb(async (db) => {
  const book = await db.collection('books').findOne({ slug: 'class12-physics' });
  const pages = (await db.collection('book_pages')
    .find({ book_id: book._id, deleted_at: null }).toArray())
    .sort((a, c) => a.chapter_number - c.chapter_number || a.page_number - c.page_number);

  const problems = [];
  let exprCount = 0;
  let fieldCount = 0;

  for (const p of pages) {
    const where = `ch${p.chapter_number} p${p.page_number} ${p.slug}`;
    const scope = { blocks: p.blocks, glossary: p.glossary, title: p.title, subtitle: p.subtitle };

    for (const [path, s] of strings(scope)) {
      fieldCount++;

      // ── banned display delimiter ──────────────────────────────────────────
      if (s.includes('$$')) problems.push(`${where} ${path}: contains BANNED '$$'`);

      // ── unbalanced inline delimiters ──────────────────────────────────────
      // Checked per line: a stray `$` only corrupts from there to the next one,
      // and markdown is line-oriented, so a line is the right unit.
      s.split('\n').forEach((line, i) => {
        const n = (line.match(/\$/g) || []).length;
        if (n % 2 !== 0) {
          problems.push(`${where} ${path} line ${i + 1}: ODD number of '$' (${n}) — unclosed maths: "${line.trim().slice(0, 70)}"`);
        }
      });

      // ── does every expression actually parse? ─────────────────────────────
      // Only `latex_block.latex` is a RAW expression. Everything else —
      // including `step_solver` steps' `math` field, which goes through
      // MathLine → InlineMarkdown (see StepSolverRenderer.tsx) — is markdown
      // carrying $…$ spans, and may legitimately mix prose with maths.
      const isRaw = path.endsWith('.latex');
      const exprs = isRaw ? [s] : inlineMaths(s);
      for (const e of exprs) {
        exprCount++;
        try {
          katex.renderToString(e, KATEX_OPTS);
        } catch (err) {
          problems.push(`${where} ${path}: KaTeX FAILED on "${e.slice(0, 60)}" :: ${err.message.slice(0, 110)}`);
        }
      }
    }
  }

  console.log(`\n── LaTeX check: ${pages.length} pages · ${fieldCount} text fields · ${exprCount} expressions`);
  console.log(`── Findings (${problems.length})`);
  if (!problems.length) console.log('   ✅ every expression parses; no unbalanced or banned delimiters');
  else problems.slice(0, 60).forEach((s) => console.log(`   • ${s}`));
  if (problems.length > 60) console.log(`   … and ${problems.length - 60} more`);
  console.log('');
}).then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
