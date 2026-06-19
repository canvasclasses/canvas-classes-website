'use strict';
/**
 * morning-brief.js — the founder-facing daily output of the supervisory layer.
 *
 * Runs every Layer-A watchdog, aggregates their {name, severity, headline} into
 * ONE prioritized brief, and exits with the worst severity so a scheduler can
 * alert only when something needs the founder. This is the "morning brief" the
 * AI_NATIVE_ROADMAP describes — what turns scattered scripts into a system.
 *
 * It runs the READ-ONLY watchdogs. The agent-run faces (founder advisor,
 * industry scout) are listed as manual/Max-plan steps, not executed here.
 *
 * RUN:  node scripts/watchdogs/morning-brief.js [--json]
 * EXIT: 2 if any watchdog is 🔴, 1 if any 🟡, 0 if all clean, 3 on runner error.
 */
const { execFileSync } = require('child_process');
const path = require('path');

const asJson = process.argv.includes('--json');
const HERE = __dirname;

const WATCHDOGS = [
  { name: 'content-guard', file: 'content-guard.js' },
  { name: 'cost-sentinel', file: 'cost-sentinel.js' },
  { name: 'gap-auditor', file: 'gap-auditor.js' },
  { name: 'student-signal', file: 'student-signal.js' },
];

// The watchdogs print a `--json` object (JSON.stringify indent 2 → starts with a
// lone `{` line). dotenv may print a startup banner to stdout first, so we
// extract from the first line that is exactly `{`, not the first `{` character.
function extractJson(out) {
  const lines = String(out).split('\n');
  const idx = lines.findIndex((l) => l.trim() === '{');
  if (idx === -1) throw new Error('no JSON object in output');
  return JSON.parse(lines.slice(idx).join('\n'));
}

function runOne(w) {
  const opts = { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, env: { ...process.env, DOTENV_CONFIG_QUIET: 'true' } };
  let out;
  try {
    out = execFileSync(process.execPath, [path.join(HERE, w.file), '--json'], opts);
  } catch (e) {
    // Non-zero exit is EXPECTED when a watchdog has findings — its JSON still printed to stdout.
    out = (e.stdout || '').toString();
    if (!out) return { name: w.name, severity: 3, headline: `runner error: ${(e.message || '').split('\n')[0]}`, ok: false };
  }
  try {
    const j = extractJson(out);
    return { name: w.name, severity: j.severity ?? 0, headline: j.headline || '(no headline)', ok: true };
  } catch (e) {
    return { name: w.name, severity: 3, headline: `parse error: ${e.message}`, ok: false };
  }
}

const results = WATCHDOGS.map(runOne);
const worst = results.reduce((m, r) => Math.max(m, r.severity === 3 ? 2 : r.severity), 0);
const ICON = { 0: '✅', 1: '🟡', 2: '🔴', 3: '⚠️' };

if (asJson) {
  console.log(JSON.stringify({ generated_at: new Date().toISOString(), worst, results }, null, 2));
} else {
  const L = console.log;
  L('\n╔══════════════════════════════════════════════════════════╗');
  L('║  CANVAS — morning brief (supervisory layer)                ║');
  L('╚══════════════════════════════════════════════════════════╝');
  for (const r of results.sort((a, b) => b.severity - a.severity)) L(`  ${ICON[r.severity] || '?'}  ${r.name.padEnd(16)} ${r.headline}`);
  L('');
  if (worst >= 2) L('→ Action needed today. Re-run the flagged watchdog without --json for detail.');
  else if (worst === 1) L('→ Some warnings to review when convenient.');
  else L('→ All clear across the watched joints.');
  L('\nAgent-run faces (Claude Max, on demand): /founder-advisor (full sweep + this brief in prose), /industry-scout (competitor/landscape scan).');
  L('');
}

process.exit(worst);
