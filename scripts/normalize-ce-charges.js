#!/usr/bin/env node
// normalize-ce-charges.js — canonicalize ion charges inside \ce{...} in stored
// solutions: `^2+` → `^{2+}`. Fixes the historical "Mg²+ (sign on baseline)"
// data form so it matches CLAUDE.md §4 (`\ce{Fe^{2+}}`). The renderer shim is
// already fixed; this is data hygiene + robustness for other render/export paths.
//
// Usage:
//   node scripts/normalize-ce-charges.js <PREFIX> [--limit=N] [--dry-run]
//   node scripts/normalize-ce-charges.js ATOM --limit=15
//
// Scope: only digit+sign charges inside \ce{} (one brace-nesting level), so plain
// math like `n^2+1` is never touched. Single-sign (`^+`/`^-`) and already-braced
// (`^{2+}`) charges are left as-is.
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

function normalizeCeCharges(md) {
  if (!md || typeof md !== 'string') return md;
  return md.replace(/\\ce\{((?:[^{}]|\{[^{}]*\})*)\}/g, (_whole, inner) => {
    const fixed = inner.replace(/\^(\d+[+\-])/g, '^{$1}');
    return `\\ce{${fixed}}`;
  });
}

(async () => {
  const args = process.argv.slice(2);
  const prefix = args.find(a => !a.startsWith('--'));
  const dryRun = args.includes('--dry-run');
  const limitArg = args.find(a => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : 5000;
  if (!prefix) { console.error('ERROR: prefix required'); process.exit(2); }

  await mongoose.connect(process.env.MONGODB_URI);
  const Q = mongoose.connection.db.collection('questions_v2');
  const docs = await Q.find({ display_id: new RegExp(`^${prefix}-\\d+$`) })
    .project({ display_id: 1, 'solution.text_markdown': 1 })
    .sort({ display_id: 1 }).limit(limit).toArray();

  let changed = 0;
  for (const d of docs) {
    const md = d.solution && d.solution.text_markdown;
    if (!md) continue;
    const fixed = normalizeCeCharges(md);
    if (fixed !== md) {
      changed++;
      console.log(`${d.display_id}  charges braced`);
      if (!dryRun) await Q.updateOne({ display_id: d.display_id }, { $set: { 'solution.text_markdown': fixed, updated_at: new Date() } });
    }
  }
  console.log(`\n${dryRun ? 'DRY-RUN ' : ''}${prefix}: ${changed} solution(s) normalized of ${docs.length} scanned.`);
  await mongoose.disconnect();
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
