'use strict';
/**
 * cost-sentinel.js — Layer-A watchdog #2 (AI-native supervisory layer).
 *
 * WHAT IT CATCHES (all from the June-2026 Vercel bill spike, CLAUDE.md §10 + the
 * 2026-06 cost audit):
 *   1. Public pages that opt out of the edge cache (`force-dynamic`/`revalidate=0`),
 *      over-aggressive `revalidate=60`, and the E132 trap (`cookies()`/`headers()`
 *      from next/headers at a layout level).
 *   2. Cost anti-patterns anywhere in apps/student + packages/services:
 *      - `revalidatePath('/', 'layout')` — busts the WHOLE site cache (vercel-cost #17)
 *      - bank-wide `revalidateTag('questions')` — invalidates every chapter (#18)
 *      - `@vercel/analytics` / `@vercel/speed-insights` — a redundant cost line (#19)
 *
 * READ-ONLY code scan. No DB, no network. Skips comment lines so the §10 warning
 * comments scattered through the codebase don't false-positive.
 *
 * RUN:  node scripts/watchdogs/cost-sentinel.js [--json]
 * EXIT: 2 if any 🔴, 1 if 🟡 only, else 0.
 */
const fs = require('fs');
const path = require('path');

const asJson = process.argv.includes('--json');
const REPO = path.join(__dirname, '..', '..');
const ROOT = path.join(REPO, 'apps', 'student', 'app');

const PER_USER = ['[profileId]', '/dashboard', '/account', '/profile', '/welcome'];
const isPerUser = (rel) => PER_USER.some((p) => rel.includes(p));

function walk(dir, out = [], exts = null) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'node_modules' && e.name !== '.next' && !e.name.startsWith('.next-') && e.name !== 'dist') walk(full, out, exts); }
    else if (!exts || exts.some((x) => e.name.endsWith(x))) out.push(full);
  }
  return out;
}

const isCommentLine = (line) => { const t = line.trim(); return t.startsWith('//') || t.startsWith('*') || t.startsWith('/*'); };

// Cost anti-patterns to catch as code REGRESSIONS (call sites, not comments).
const ANTI = [
  { re: /revalidatePath\(\s*['"]\/['"]\s*,\s*['"]layout['"]\s*\)/, sev: 'red', issue: "revalidatePath('/', 'layout')", note: 'busts the WHOLE site cache (§10) — scope or drop it (vercel-cost #17)' },
  { re: /revalidateTag\(\s*['"]questions['"]\s*\)/, sev: 'amber', issue: "revalidateTag('questions')", note: 'invalidates the ENTIRE question bank — prefer questions:<chapterId> (vercel-cost #18)' },
  { re: /from\s+['"]@vercel\/(analytics|speed-insights)/, sev: 'amber', issue: '@vercel analytics import', note: 'redundant with GA/Clarity/Mixpanel/CF — a whole cost line (vercel-cost #19)' },
];

function scanAntiPatterns(red, amber) {
  const dirs = [path.join(REPO, 'apps', 'student'), path.join(REPO, 'packages', 'services'), path.join(REPO, 'apps', 'admin', 'app', 'api')];
  const files = dirs.flatMap((d) => walk(d, [], ['.ts', '.tsx']));
  for (const f of files) {
    const rel = f.slice(REPO.length + 1).replace(/\\/g, '/');
    const lines = fs.readFileSync(f, 'utf8').split('\n');
    lines.forEach((line, i) => {
      if (isCommentLine(line)) return;
      for (const a of ANTI) {
        if (a.re.test(line)) (a.sev === 'red' ? red : amber).push({ file: `${rel}:${i + 1}`, issue: a.issue, note: a.note });
      }
    });
  }
}

function run() {
  const files = walk(ROOT);
  const red = [], amber = [];

  for (const f of files) {
    const rel = f.slice(ROOT.length).replace(/\\/g, '/');
    if (rel.includes('/api/')) continue;
    const base = path.basename(f);
    const src = fs.readFileSync(f, 'utf8');
    if (base === 'page.tsx') {
      const forceDyn = /^\s*export\s+const\s+dynamic\s*=\s*['"]force-dynamic['"]/m.test(src);
      const rev0 = /^\s*export\s+const\s+revalidate\s*=\s*0\b/m.test(src);
      const rev60 = /^\s*export\s+const\s+revalidate\s*=\s*60\b/m.test(src);
      if ((forceDyn || rev0) && !isPerUser(rel)) red.push({ file: 'apps/student/app' + rel, issue: forceDyn ? "export const dynamic = 'force-dynamic'" : 'export const revalidate = 0', note: 'public page opted out of edge cache (§10.2)' });
      if (rev60) amber.push({ file: 'apps/student/app' + rel, issue: 'export const revalidate = 60', note: 'too aggressive — up to 1440 regenerations/day; use 3600/86400 (§10.5)' });
    } else if (base === 'layout.tsx') {
      if (/from\s+['"]next\/headers['"]/.test(src) && /\b(cookies|headers)\s*\(/.test(src)) red.push({ file: 'apps/student/app' + rel, issue: 'cookies()/headers() in a layout', note: 'E132 trap — flips every page below to dynamic (§10.4)' });
    }
  }

  scanAntiPatterns(red, amber);

  const severity = red.length ? 2 : amber.length ? 1 : 0;
  return {
    name: 'cost-sentinel',
    severity,
    headline: red.length ? `${red.length} cost issue(s) need attention` : amber.length ? `${amber.length} cost warning(s)` : 'no cost regressions',
    scanned: files.filter((f) => /page\.tsx|layout\.tsx/.test(f)).length,
    red, amber,
  };
}

function printReport(r) {
  const L = console.log;
  L('\n=== Cost/perf sentinel ===');
  L(`🔴 ${r.red.length} · 🟡 ${r.amber.length}\n`);
  if (r.red.length) { L('🔴 Cost issues (cache bypass / whole-site busts):'); for (const x of r.red) L(`  • ${x.file}\n      ${x.issue} — ${x.note}`); L(''); }
  if (r.amber.length) { L('🟡 Cost warnings:'); for (const x of r.amber) L(`  • ${x.file} — ${x.issue} (${x.note})`); L(''); }
  if (!r.red.length && !r.amber.length) L('✅ No cost regressions: pages cacheable, no whole-site busts, no bank-wide question invalidation, no redundant analytics.\n');
}

const r = run();
if (asJson) console.log(JSON.stringify(r, null, 2)); else printReport(r);
process.exit(r.severity);
