#!/usr/bin/env node
// audit.js — end-of-chapter heuristic sweep over every solution in a math chapter.
//
// Usage:
//   node scripts/math-solutions/audit.js <PREFIX> [--missing-only] [--sample=N]
//
// What it does:
//   - Pulls every question in the chapter from questions_v2.
//   - Reports:  Total / has-solution / missing-solution / failed-validation.
//   - For every solution that fails heuristic validation, appends a soft flag
//     (or blocking flag if there is NO solution at all) to <PREFIX>-flags.md.
//   - Also flags answer-key gaps (correct_option null on MCQ, integer_value null on numerical).
//   - Optional --sample=N prints N random questions' display_ids for manual eyeballing
//     (the audit does NOT call any LLM; that's for the user / agent to do).
//
// This script is read-only against MongoDB. It only writes to the flag markdown file.

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const FLAG_DIR = path.join(__dirname, '..', '..', '_agents', 'solution-flags');

// Re-use the same validator rules as apply-batch.js (kept in sync manually for now).
const FORBIDDEN_PHRASES = [
  "let's dive in", "in conclusion", 'therefore, we can easily see',
  "let's break this down", 'delve', 'it is crucial to note',
  '1. The "Aha!" Moment', '2. Method 1: The Standard Approach',
  '3. Method 2: The 30-Second Trick', '3. Method 2: The Insight Shortcut',
  '4. Method 3: The Alternate Angle', 'The Aha Moment',
  '**The Smart Move**', '**Where Students Get Stuck**',
];

function validateSolution(md) {
  const issues = [];
  if (!md || typeof md !== 'string') return ['solution is empty or missing'];
  if (md.length < 800) issues.push(`too short (${md.length} chars)`);
  if (!/\*\*🧠/.test(md)) issues.push('missing 🧠 heading');
  if (!/\*\*🗺️/.test(md)) issues.push('missing 🗺️ heading');
  if (!/\*\*⚡/.test(md)) issues.push('missing ⚡ heading');
  if (!/\*\*⚠️/.test(md)) issues.push('missing ⚠️ heading');
  if (/^###\s/m.test(md)) issues.push('uses forbidden Markdown heading syntax (###)');
  const tail = md.slice(-300);
  if (!/\\boxed\{/.test(tail)) issues.push('missing $\\boxed{...}$');
  const dollarSingles = (md.match(/(?<!\$)\$(?!\$)/g) || []).length;
  if (dollarSingles % 2 !== 0) issues.push(`unbalanced $ (${dollarSingles})`);
  if (/\$\$/.test(md)) issues.push('uses $$ display math');
  const opens = (md.match(/\{/g) || []).length;
  const closes = (md.match(/\}/g) || []).length;
  if (opens !== closes) issues.push(`unbalanced braces (${opens} vs ${closes})`);
  const lower = md.toLowerCase();
  for (const phrase of FORBIDDEN_PHRASES) {
    if (lower.includes(phrase.toLowerCase())) issues.push(`cliche: "${phrase}"`);
  }
  // Numbered-step detector (workflow Rule 5)
  if (/^\*{0,2}step\s+\d/im.test(md)) {
    issues.push('uses numbered "Step N" enumeration');
  }
  return issues;
}

// ─── Flag file read/write (mirror of apply-batch.js) ────────────────────────
function readFlagFile(prefix) {
  const file = path.join(FLAG_DIR, `${prefix}-flags.md`);
  if (!fs.existsSync(file)) return { blocking: [], verify: [], soft: [] };
  const text = fs.readFileSync(file, 'utf8');
  const out = { blocking: [], verify: [], soft: [] };
  let section = null;
  for (const line of text.split('\n')) {
    if (/^##\s*🔴/.test(line)) { section = 'blocking'; continue; }
    if (/^##\s*🟡/.test(line)) { section = 'verify'; continue; }
    if (/^##\s*⚪/.test(line)) { section = 'soft'; continue; }
    if (/^##\s/.test(line)) { section = null; continue; }
    if (section && /^\s*-\s+/.test(line)) out[section].push(line.replace(/^\s*-\s+/, '- '));
  }
  return out;
}

function writeFlagFile(prefix, sections) {
  const file = path.join(FLAG_DIR, `${prefix}-flags.md`);
  const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
  const body = [
    `# ${prefix} — Math Solution Flags`,
    '',
    `_Last updated: ${now}_`,
    '',
    '## 🔴 Blocking — no solution written',
    '',
    sections.blocking.length ? sections.blocking.join('\n') : '_(none)_',
    '',
    '## 🟡 Needs verification — solution written, uncertain',
    '',
    sections.verify.length ? sections.verify.join('\n') : '_(none)_',
    '',
    '## ⚪ Soft quality — audit notes',
    '',
    sections.soft.length ? sections.soft.join('\n') : '_(none)_',
    '',
  ].join('\n');
  fs.mkdirSync(FLAG_DIR, { recursive: true });
  fs.writeFileSync(file, body);
}

function addOrReplaceFlag(sections, severity, displayId, note) {
  const entry = `- **${displayId}** — ${note}`;
  const sec = sections[severity];
  const idx = sec.findIndex(line => line.includes(`**${displayId}**`));
  if (idx >= 0) sec[idx] = entry;
  else sec.push(entry);
}

// ─── Main ───────────────────────────────────────────────────────────────────
(async () => {
  const prefix = process.argv[2];
  if (!prefix) {
    console.error('ERROR: prefix is required. Usage: audit.js <PREFIX>');
    process.exit(2);
  }
  const missingOnly = process.argv.includes('--missing-only');
  const sampleArg = process.argv.find(a => a.startsWith('--sample='));
  const sampleN = sampleArg ? parseInt(sampleArg.split('=')[1], 10) : 0;

  await mongoose.connect(process.env.MONGODB_URI);
  const Q = mongoose.connection.db.collection('questions_v2');

  const docs = await Q.find({ display_id: new RegExp(`^${prefix}-\\d+$`) })
    .project({
      display_id: 1,
      'solution.text_markdown': 1,
      answer: 1,
      options: 1,
    })
    .sort({ display_id: 1 })
    .toArray();

  const flagSections = readFlagFile(prefix);

  let total = 0;
  let withSolution = 0;
  let missingSolution = 0;
  let failedValidation = 0;
  let missingAnswer = 0;
  const issuesByDoc = [];

  // Set of display_ids already in blocking — avoid double-flagging in soft section.
  const alreadyBlocking = new Set(
    flagSections.blocking.map(line => {
      const m = line.match(/\*\*([A-Z]+-\d+)\*\*/);
      return m ? m[1] : null;
    }).filter(Boolean)
  );

  for (const d of docs) {
    total++;
    const md = d.solution && d.solution.text_markdown;
    const hasSolution = md && md.length >= 50;
    const isMCQ = Array.isArray(d.options) && d.options.length > 0;

    if (!hasSolution) {
      // "Not yet solved" is backlog, not an audit failure — track in stats only,
      // do NOT pollute the flag file. The flag file is for "tried and failed".
      missingSolution++;
      continue;
    }
    withSolution++;

    // Answer-key gaps only matter on questions that DO have a solution
    // (otherwise it's noise — the answer gets filled when the solver runs).
    if (isMCQ && !(d.answer && d.answer.correct_option)) {
      if (!alreadyBlocking.has(d.display_id)) {
        addOrReplaceFlag(flagSections, 'blocking', d.display_id, 'solution present but stored correct_option is null');
      }
      missingAnswer++;
    } else if (!isMCQ && !(d.answer && d.answer.integer_value != null)) {
      if (!alreadyBlocking.has(d.display_id)) {
        addOrReplaceFlag(flagSections, 'blocking', d.display_id, 'solution present but stored integer_value is null');
      }
      missingAnswer++;
    }

    if (missingOnly) continue;

    const issues = validateSolution(md);
    if (issues.length) {
      failedValidation++;
      // Skip soft flag if the doc is already blocking — avoids double-listing
      // questions like STLN-006 whose stale solution will be rewritten or removed
      // once the blocking issue is resolved.
      if (!alreadyBlocking.has(d.display_id)) {
        addOrReplaceFlag(flagSections, 'soft', d.display_id, `audit: ${issues.join('; ')}`);
      }
      issuesByDoc.push({ id: d.display_id, severity: 'soft', issues });
    }
  }

  writeFlagFile(prefix, flagSections);

  console.log('\n=== AUDIT SUMMARY ===');
  console.log(`Chapter:            ${prefix}`);
  console.log(`Total questions:    ${total}`);
  console.log(`With solution:      ${withSolution}`);
  console.log(`Missing solution:   ${missingSolution}`);
  console.log(`Failed validation:  ${failedValidation}`);
  console.log(`Missing answer-key: ${missingAnswer}`);

  if (issuesByDoc.length) {
    console.log('\nIssues:');
    for (const item of issuesByDoc) {
      console.log(`  [${item.severity.padEnd(8)}] ${item.id}  ${item.issues.join('; ')}`);
    }
  } else {
    console.log('\nNo issues detected. Chapter is clean ✓');
  }

  if (sampleN > 0) {
    const eligible = docs.filter(d => d.solution && d.solution.text_markdown && d.solution.text_markdown.length >= 800);
    const shuffled = eligible.sort(() => Math.random() - 0.5).slice(0, sampleN);
    console.log(`\nManual-review sample (${sampleN} random IDs to read for soft quality):`);
    for (const d of shuffled) console.log(`  ${d.display_id}`);
  }

  console.log(`\nFlag file: ${path.join(FLAG_DIR, prefix + '-flags.md')}`);
  await mongoose.disconnect();
})().catch(err => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
