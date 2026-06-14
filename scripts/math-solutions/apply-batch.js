#!/usr/bin/env node
// apply-batch.js — validates a batch of solutions, writes to DB, appends to flag file
//
// Usage:
//   node scripts/math-solutions/apply-batch.js <batch-file.js> [--dry-run]
//
// Batch file format (CommonJS):
//   module.exports = [
//     {
//       display_id: "STLN-017",
//       solution: `### 🧠 ...\n... $\\boxed{...}$`,
//       answer: { correct_option: "a" } | { integer_value: 16 },
//       verifier_note: "solver (c) vs verifier (a); tiebreaker chose (a)",  // optional → yellow flag
//       question_text_fix: { from: "...", to: "..." },                        // optional OCR fix
//       force_flag: { severity: "blocking"|"verify"|"soft", note: "..." },    // optional — write nothing, flag only
//     },
//     ...
//   ];
//
// For every item:
//   1. Heuristic-validate the solution (5 iconified headings, boxed answer, balanced math, no clichés).
//   2. Compare proposed answer with stored answer; overwrite if different/null.
//   3. Apply optional question_text fix.
//   4. Append to _agents/solution-flags/<PREFIX>-flags.md for any mismatch / blocking issue / soft note.
//   5. Write to DB (skip write only if blocking validation fails or force_flag.severity === 'blocking').

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const FLAG_DIR = path.join(__dirname, '..', '..', '_agents', 'solution-flags');

// ─── Heuristic validator (SHARED — single source of truth) ──────────────────
// validateSolution + normalizeCeCharges + the base forbidden-phrase list live in
// scripts/lib/solution-validator.js so the three toolkits can never drift again.
// Math policy: forbid all v2 section icons, ban "monster"+"anchor". Math is the
// only toolkit that opts into the crammed-step SOFT lint (softLint: true below).
const { validateSolution, normalizeCeCharges, POLICY } = require('../lib/solution-validator');

// ─── Flag file appender ─────────────────────────────────────────────────────
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
  const file = process.argv[2];
  const dryRun = process.argv.includes('--dry-run');
  if (!file) {
    console.error('ERROR: batch file path required');
    console.error('Usage: apply-batch.js <batch-file.js> [--dry-run]');
    process.exit(2);
  }

  const batchPath = path.resolve(file);
  const batch = require(batchPath);
  if (!Array.isArray(batch)) {
    console.error('ERROR: batch file must export an array');
    process.exit(2);
  }

  // Infer prefix from first display_id
  const firstId = batch[0] && batch[0].display_id;
  if (!firstId) {
    console.error('ERROR: first item has no display_id');
    process.exit(2);
  }
  const prefix = firstId.split('-')[0];

  await mongoose.connect(process.env.MONGODB_URI);
  const Q = mongoose.connection.db.collection('questions_v2');
  const flagSections = readFlagFile(prefix);

  let written = 0;
  let answerFixes = 0;
  let blocked = 0;
  let verifyFlags = 0;
  let softFlags = 0;
  const log = [];

  for (const item of batch) {
    const id = item.display_id;
    if (!id) { log.push(`SKIP (no display_id)`); continue; }

    // Force-flag mode — write nothing
    if (item.force_flag) {
      const sev = item.force_flag.severity === 'blocking' ? 'blocking'
                : item.force_flag.severity === 'verify' ? 'verify' : 'soft';
      addOrReplaceFlag(flagSections, sev, id, item.force_flag.note);
      if (sev === 'blocking') blocked++;
      else if (sev === 'verify') verifyFlags++;
      else softFlags++;
      log.push(`${id}  FORCE-FLAG ${sev}: ${item.force_flag.note.slice(0, 60)}...`);
      continue;
    }

    const cur = await Q.findOne(
      { display_id: id },
      { projection: { answer: 1, question_text: 1, options: 1, solution: 1 } }
    );
    if (!cur) {
      addOrReplaceFlag(flagSections, 'blocking', id, 'not found in DB');
      blocked++;
      log.push(`${id}  BLOCK: not found in DB`);
      continue;
    }

    // Canonicalize \ce{} ion charges (^n+ → ^{n+}) before validating/writing.
    if (item.solution) {
      const normed = normalizeCeCharges(item.solution);
      if (normed !== item.solution) {
        log.push(`${id}  NORMALIZED \\ce{} charges (^n± → ^{n±})`);
        item.solution = normed;
      }
    }

    // Validate solution (item.format: 'v2' = prose format, chemistry post-2026-06-12;
    // omitted/anything else = legacy 6-section, still canonical for physics & math)
    const allIssues = validateSolution(item.solution, { format: item.format, policy: POLICY.math, softLint: true });
    const hardIssues = allIssues.filter(i => !i.startsWith('SOFT:'));
    const softIssues = allIssues.filter(i => i.startsWith('SOFT:')).map(i => i.slice(5));
    if (hardIssues.length) {
      addOrReplaceFlag(flagSections, 'blocking', id, `validation failed: ${hardIssues.join('; ')}`);
      blocked++;
      log.push(`${id}  BLOCK: ${hardIssues.join('; ')}`);
      continue;
    }
    // Soft issues never block the write — surface as a soft flag + log note.
    if (softIssues.length) {
      addOrReplaceFlag(flagSections, 'soft', id, softIssues.join('; '));
      softFlags++;
      log.push(`${id}  SOFT: ${softIssues.join('; ')}`);
    }

    // Build $set — if the existing `solution` field is null/missing (older docs),
    // dotted-path $set on 'solution.text_markdown' fails because Mongo refuses to
    // create fields inside a scalar null. In that case, set the full object.
    const solutionIsObject = cur.solution && typeof cur.solution === 'object';
    const set = solutionIsObject
      ? {
          'solution.text_markdown': item.solution,
          'solution.latex_validated': true,
          updated_at: new Date(),
        }
      : {
          solution: { text_markdown: item.solution, latex_validated: true },
          updated_at: new Date(),
        };
    const notes = [];

    if (item.answer) {
      // Like `solution` above, older docs may store `answer: null` (a scalar).
      // A dotted-path $set on 'answer.correct_option' then fails ("Cannot create
      // field 'correct_option' in element {answer: null}"), so when answer is not
      // an object we set the whole `answer` object instead of dotted paths.
      const answerIsObject = cur.answer && typeof cur.answer === 'object';
      const desired = {};
      let answerChanged = false;
      if (item.answer.correct_option != null) {
        const old = answerIsObject ? cur.answer.correct_option : undefined;
        if (old !== item.answer.correct_option) {
          desired.correct_option = item.answer.correct_option;
          notes.push(old == null
            ? `answer null → (${item.answer.correct_option})`
            : `answer (${old}) → (${item.answer.correct_option})`);
          answerFixes++;
          answerChanged = true;
        }
      }
      if (item.answer.integer_value != null) {
        const old = answerIsObject ? cur.answer.integer_value : undefined;
        if (old !== item.answer.integer_value) {
          desired.integer_value = item.answer.integer_value;
          notes.push(old == null
            ? `integer null → ${item.answer.integer_value}`
            : `integer ${old} → ${item.answer.integer_value}`);
          answerFixes++;
          answerChanged = true;
        }
      }
      if (answerChanged) {
        if (answerIsObject) {
          for (const [k, v] of Object.entries(desired)) set[`answer.${k}`] = v;
        } else {
          set.answer = desired; // create the whole object over the null scalar
        }
      }
    }

    // Question-text OCR fix
    if (item.question_text_fix) {
      const oldText = cur.question_text && cur.question_text.markdown;
      if (oldText && oldText.includes(item.question_text_fix.from)) {
        set['question_text.markdown'] = oldText.split(item.question_text_fix.from).join(item.question_text_fix.to);
        notes.push(`Q-text: "${item.question_text_fix.from}" → "${item.question_text_fix.to}"`);
      } else {
        addOrReplaceFlag(flagSections, 'soft', id, `Q-text fix requested but "from" string not found`);
        softFlags++;
      }
    }

    // Verifier-mismatch note → yellow flag (still write the solution)
    if (item.verifier_note) {
      addOrReplaceFlag(flagSections, 'verify', id, item.verifier_note);
      verifyFlags++;
    }

    // Audio recommendation (format v2): the writer kept the text tight and flags
    // that the founder's recorded audio would carry the elaborate framing better.
    // Goes to the per-chapter audio wishlist — NEVER into student-visible text.
    if (item.audio_flag) {
      const audioFile = path.join(FLAG_DIR, `${prefix}-audio-wishlist.md`);
      if (!fs.existsSync(audioFile)) {
        fs.mkdirSync(FLAG_DIR, { recursive: true });
        fs.writeFileSync(audioFile, `# ${prefix} — Audio Explanation Wishlist\n\n> Questions where the founder's recorded audio should carry the elaborate framing\n> the compact v2 text deliberately omits. Founder records → audio attached via\n> solution.asset_ids.audio. One line per question, newest appended.\n\n`);
      }
      const line = `- **${id}** — ${item.audio_flag.note}\n`;
      const existing = fs.readFileSync(audioFile, 'utf8');
      if (!existing.includes(`**${id}**`)) fs.appendFileSync(audioFile, line);
    }

    if (!dryRun) {
      await Q.updateOne({ display_id: id }, { $set: set });
    }
    written++;
    log.push(`${id}  OK${notes.length ? '  [' + notes.join(', ') + ']' : ''}${dryRun ? '  (dry-run)' : ''}`);
  }

  if (!dryRun) writeFlagFile(prefix, flagSections);

  console.log('\n=== APPLY-BATCH SUMMARY ===');
  console.log(`Chapter prefix:         ${prefix}`);
  console.log(`Mode:                   ${dryRun ? 'DRY-RUN' : 'WRITE'}`);
  console.log(`Solutions written:      ${written}`);
  console.log(`Answer-key corrections: ${answerFixes}`);
  console.log(`Blocked (no write):     ${blocked}`);
  console.log(`Verify flags added:     ${verifyFlags}`);
  console.log(`Soft flags added:       ${softFlags}`);
  console.log('\nDetails:');
  for (const line of log) console.log('  ' + line);

  await mongoose.disconnect();
})().catch(err => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
