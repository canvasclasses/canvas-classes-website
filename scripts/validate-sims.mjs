#!/usr/bin/env node
/*
 * validate-sims.mjs
 * -----------------
 * Automated consistency gate for interactive simulators, per
 * _agents/workflows/SIMULATION_DESIGN_WORKFLOW.md. This is the enforcement
 * layer that makes the design standard hold at scale WITHOUT anyone eyeballing
 * every sim — the machine checks each file, every push.
 *
 * What it enforces (high-confidence, unambiguous rules only — we deliberately
 * do NOT ban all raw hex yet; that tightens in the migration phase):
 *   1. No monospace fonts (font-mono / Courier / Menlo / Consolas).
 *   2. No ÷ glyph (reads as + from a distance — use the Frac component).
 *   3. No text below text-[10px] for readable text (text-[9px] etc.).
 *   4. No font-black at text-xs / text-[10px] (weight must scale down; the
 *      StepBar's text-[11px] font-black pill is the one exception and lives in
 *      the shared component, so it's never hand-rolled).
 *   5. No dark-violet #7c3aed as foreground (muddy on dark bg — use ACCENT).
 *   6. No raw .toExponential() render without prettyExp() ("e+23" confuses).
 *   7. Root wrapper background must be #0d1117 (or SIM_BG token) — warns only.
 *
 * SCOPE: by default only files CHANGED on this branch / in the working tree are
 * checked, so untouched legacy sims aren't flagged until someone edits them
 * (migrate-when-touched). Pass --all to audit the whole library.
 *
 * SUPPRESSION: add `// sim-lint-ok` on a line to intentionally exempt it (use
 * sparingly — real-world identity colours and the OK/BAD pass/fail pair).
 *
 * USAGE:
 *   node scripts/validate-sims.mjs            # gate: changed sim files only
 *   node scripts/validate-sims.mjs --all      # audit: every sim file
 *   node scripts/validate-sims.mjs --report   # never exit non-zero (report only)
 *
 * Exit code 1 if any ERROR-level violation is found (unless --report).
 */

import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const SIM_DIR = 'packages/book-renderer/blocks/simulations';
const ALL = process.argv.includes('--all');
const REPORT_ONLY = process.argv.includes('--report');

// Files/dirs that ARE the token/helper source — never checked against sims.
const SKIP = [
  `${SIM_DIR}/_shared/`,
  `${SIM_DIR}/_typography.tsx`,
];

const isSimFile = (p) =>
  p.startsWith(SIM_DIR) && p.endsWith('.tsx') && !SKIP.some((s) => p.startsWith(s) || p === s);

// ── Collect the file list ──────────────────────────────────────────────────
function sh(cmd) {
  try { return execSync(cmd, { cwd: ROOT, encoding: 'utf8' }); }
  catch { return ''; }
}

function changedFiles() {
  const set = new Set();
  const add = (out) => out.split('\n').map((l) => l.trim()).filter(Boolean).forEach((f) => set.add(f));
  // committed on this branch vs main, plus staged + unstaged working-tree edits
  add(sh('git diff --name-only main...HEAD'));
  add(sh('git diff --name-only'));
  add(sh('git diff --cached --name-only'));
  return [...set].filter(isSimFile);
}

function allSimFiles() {
  // NB: `git ls-files "dir/**/*.tsx"` under-matches (pathspec globbing quirk).
  // List the whole subtree and filter to .tsx ourselves.
  const out = sh(`git ls-files -- ${SIM_DIR}`);
  return out.split('\n').map((l) => l.trim()).filter((p) => p.endsWith('.tsx')).filter(isSimFile);
}

const files = (ALL ? allSimFiles() : changedFiles()).filter((f) => existsSync(join(ROOT, f)));

// ── Comment blanking ─────────────────────────────────────────────────────────
// Replace all comment characters with spaces (preserving newlines + column
// positions) so rules only ever see CODE. Without this, a line like
// `// never render the ÷ glyph` would be flagged for containing ÷ — a false
// positive that erodes trust in the gate. Handles //, /* */ (multi-line), and
// skips comment markers that appear inside '…', "…", or `…` strings.
function blankComments(src) {
  let out = '';
  let i = 0;
  let state = 'code'; // code | line | block | sq | dq | tq
  while (i < src.length) {
    const c = src[i], n = src[i + 1];
    if (state === 'code') {
      if (c === '/' && n === '/') { out += '  '; i += 2; state = 'line'; continue; }
      if (c === '/' && n === '*') { out += '  '; i += 2; state = 'block'; continue; }
      if (c === "'") { out += c; i++; state = 'sq'; continue; }
      if (c === '"') { out += c; i++; state = 'dq'; continue; }
      if (c === '`') { out += c; i++; state = 'tq'; continue; }
      out += c; i++; continue;
    }
    if (state === 'line') {
      if (c === '\n') { out += '\n'; i++; state = 'code'; continue; }
      out += ' '; i++; continue;
    }
    if (state === 'block') {
      if (c === '*' && n === '/') { out += '  '; i += 2; state = 'code'; continue; }
      out += c === '\n' ? '\n' : ' '; i++; continue;
    }
    // inside a string literal — copy verbatim, honour escapes, exit on closer
    const closer = state === 'sq' ? "'" : state === 'dq' ? '"' : '`';
    if (c === '\\') { out += src.slice(i, i + 2); i += 2; continue; }
    if (c === closer) { out += c; i++; state = 'code'; continue; }
    out += c; i++;
  }
  return out;
}

// ── Rules ───────────────────────────────────────────────────────────────────
// Each rule: { test(line) => bool, msg, level }. Applied per non-suppressed line.
const RULES = [
  {
    id: 'monospace',
    level: 'error',
    test: (l) => /\bfont-mono\b/.test(l) || /fontFamily:\s*['"][^'"]*(mono|Courier|Menlo|Consolas)/i.test(l),
    msg: 'Monospace is banned in sims (§2). Use tabular-nums for column alignment.',
  },
  {
    id: 'divide-glyph',
    level: 'error',
    test: (l) => /÷/.test(l),
    msg: '÷ reads as + from a distance (§2). Use the <Frac> component from _shared.',
  },
  {
    id: 'tiny-text',
    level: 'error',
    test: (l) => /text-\[[0-9]px\]/.test(l), // single digit ⇒ ≤ 9px
    msg: 'Never below text-[10px] for readable text (§2).',
  },
  {
    id: 'weight-vs-size',
    level: 'error',
    // font-black paired with text-xs (12px) or text-[10px]. text-[11px] is the
    // sanctioned StepBar exception and is intentionally not matched here.
    test: (l) =>
      /(text-xs|text-\[10px\])[^"'`]*font-black/.test(l) ||
      /font-black[^"'`]*(text-xs|text-\[10px\])/.test(l),
    msg: 'font-black too heavy at ≤text-xs (§2 weight rule). Use font-semibold.',
  },
  {
    id: 'dark-violet',
    level: 'error',
    test: (l) => /#7c3aed/i.test(l),
    msg: 'Dark-violet #7c3aed is muddy on the dark bg. Use ACCENT (#c4b5fd) from _shared/tokens.',
  },
  {
    id: 'raw-exponential',
    level: 'error',
    test: (l) => /\.toExponential\s*\(/.test(l) && !/prettyExp\s*\(/.test(l),
    msg: 'Wrap toExponential() in prettyExp() (§2) — never render "e+23" to students.',
  },
];

// ── Run ──────────────────────────────────────────────────────────────────────
let errors = 0;
let warnings = 0;
const findings = [];

for (const file of files) {
  const rawSrc = readFileSync(join(ROOT, file), 'utf8');
  const src = blankComments(rawSrc);       // rules see code only, never comments
  const rawLines = rawSrc.split('\n');     // used for the sim-lint-ok suppression check
  const lines = src.split('\n');

  // Rule 7 (root bg) is file-level: warn if no #0d1117 / SIM_BG anywhere.
  if (!/#0d1117|SIM_BG/.test(src)) {
    warnings++;
    findings.push({ file, line: 1, level: 'warn', id: 'root-bg',
      msg: "Root wrapper background should be #0d1117 (or SIM_BG token) — none found." });
  }

  lines.forEach((line, i) => {
    if ((rawLines[i] || '').includes('sim-lint-ok')) return;
    for (const rule of RULES) {
      if (rule.test(line)) {
        if (rule.level === 'error') errors++; else warnings++;
        findings.push({ file, line: i + 1, level: rule.level, id: rule.id, msg: rule.msg });
      }
    }
  });
}

// ── Report ────────────────────────────────────────────────────────────────────
const RED = '\x1b[31m', YEL = '\x1b[33m', GRN = '\x1b[32m', DIM = '\x1b[2m', RST = '\x1b[0m';

if (!files.length) {
  console.log(`${GRN}✓ sim gate: no simulator files ${ALL ? 'found' : 'changed'} to check.${RST}`);
  process.exit(0);
}

console.log(`${DIM}Sim design gate — checking ${files.length} file(s)${ALL ? ' (--all)' : ' (changed only)'}${RST}`);

if (!findings.length) {
  console.log(`${GRN}✓ all ${files.length} simulator file(s) pass the design standard.${RST}`);
  process.exit(0);
}

const byFile = findings.reduce((m, f) => ((m[f.file] ??= []).push(f), m), {});
for (const [file, fs] of Object.entries(byFile)) {
  console.log(`\n${file}`);
  for (const f of fs.sort((a, b) => a.line - b.line)) {
    const tag = f.level === 'error' ? `${RED}error${RST}` : `${YEL}warn ${RST}`;
    console.log(`  ${tag} ${DIM}L${f.line}${RST} [${f.id}] ${f.msg}`);
  }
}

console.log(`\n${errors ? RED : GRN}${errors} error(s)${RST}, ${warnings} warning(s).`);
if (errors && !REPORT_ONLY) {
  console.log(`${DIM}Fix the errors above, or mark an intentional exception with // sim-lint-ok.${RST}`);
  process.exit(1);
}
process.exit(0);
