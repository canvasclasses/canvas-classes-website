/**
 * Finds the bug class the founder hit on 2026-07-29: an SVG shape painted as a
 * LATER SIBLING of a pointer-handling element, without `pointerEvents="none"`.
 *
 * SVG has no z-index — later siblings paint on top and, unless opted out, they
 * also RECEIVE the pointer. So a decorative dot drawn after its own invisible
 * hit area silently steals pointerdown from it, creating a dead zone exactly
 * over the thing the student is told to grab. tsc, ESLint and Zod cannot see it;
 * only a hand-drag or this audit can.
 *
 * Heuristic (deliberately noisy-but-reviewable): inside any JSX region that
 * contains a pointer handler, report every subsequent shape element that has a
 * visible paint (`fill=`/`stroke=`) and no pointer-events opt-out.
 *
 * Run:  node scripts/audit/svg-pointer-guard-audit.mjs
 */
import { readFileSync } from 'fs';
import { execSync } from 'child_process';

const SHAPES = ['circle', 'rect', 'line', 'path', 'polygon', 'polyline', 'ellipse', 'text', 'image'];
const HANDLERS = /on(?:PointerDown|MouseDown|PointerUp|Click|PointerMove)\s*=/;
// Must match BOTH forms: the JSX attribute `pointerEvents="none"` and the
// style-object form `style={{ pointerEvents: 'none' }}` — missing the second
// produced a page of false positives on the mechanics-bench/fbd sims, which
// were in fact already correct.
const GUARD = /pointerEvents\s*[=:]\s*\{?\s*['"]?none|pointer-events\s*:\s*none/;

const files = execSync(
  "grep -rl 'onPointerDown\\|onMouseDown' packages/book-renderer --include=*.tsx",
  { encoding: 'utf8' }
).trim().split('\n').filter(Boolean);

let flagged = 0;
const report = [];

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const lines = src.split('\n');

  // Find every line index that opens a shape element.
  const elements = [];
  lines.forEach((line, i) => {
    for (const tag of SHAPES) {
      const re = new RegExp(`<${tag}[\\s/>]`);
      if (re.test(line)) elements.push({ i, tag, line });
    }
  });

  // An element's full text runs until its closing '>' or '/>' — collect it so
  // multi-line elements are judged on all their attributes, not just line 1.
  const textOf = (idx) => {
    let out = '';
    for (let k = idx; k < Math.min(idx + 12, lines.length); k++) {
      out += lines[k] + '\n';
      if (/\/>|>\s*$/.test(lines[k]) && k > idx) break;
      if (/\/>/.test(lines[k])) break;
    }
    return out;
  };

  // Which shapes carry a handler themselves?
  const handlerLines = elements.filter((e) => HANDLERS.test(textOf(e.i))).map((e) => e.i);
  if (!handlerLines.length) continue;

  for (const e of elements) {
    const body = textOf(e.i);
    if (HANDLERS.test(body)) continue;                 // it IS the hit target
    if (GUARD.test(body)) continue;                    // already opted out
    const hasPaint = /fill\s*=|stroke\s*=/.test(body);
    if (!hasPaint) continue;
    // Only care about shapes painted AFTER a handler element and near it —
    // within 25 lines is a good proxy for "same group".
    const after = handlerLines.filter((h) => h < e.i && e.i - h <= 25);
    if (!after.length) continue;
    flagged++;
    report.push({ file, line: e.i + 1, tag: e.tag, handlerAt: after[after.length - 1] + 1, snippet: e.line.trim().slice(0, 96) });
  }
}

const byFile = {};
for (const r of report) (byFile[r.file] ||= []).push(r);

console.log(`\nSVG pointer-guard audit — ${files.length} files with pointer handlers scanned\n`);
for (const [file, rows] of Object.entries(byFile)) {
  console.log(`── ${file}`);
  for (const r of rows) console.log(`   L${String(r.line).padStart(4)} <${r.tag}>  (handler at L${r.handlerAt})  ${r.snippet}`);
  console.log('');
}
console.log(`${flagged} shape(s) painted after a pointer handler without pointerEvents="none".`);
console.log('Each needs a judgement call: if it sits ON TOP of the hit area, it creates a dead zone.\n');
