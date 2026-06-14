#!/usr/bin/env node
// apply-batch.js — validates a batch of physics solutions, writes to DB, appends to flag file.
//
// Usage:
//   node scripts/physics-solutions/apply-batch.js <batch-file.js> [--dry-run]
//
// Batch file format (CommonJS):
//   module.exports = [
//     {
//       display_id: "MIP-001",
//       solution: `**🧠 ...**\n... $\\boxed{...}$`,
//       format: "v2",                                                         // optional — see below
//       answer: { correct_option: "a" } | { integer_value: 16 },
//       verifier_note: "...",                                                 // optional → yellow flag
//       question_text_fix: { from: "...", to: "..." },                        // optional OCR fix
//       force_flag: { severity: "blocking"|"verify"|"soft", note: "..." },    // optional — write nothing, flag only
//     },
//     ...
//   ];
//
// Mirror of scripts/math-solutions/apply-batch.js. Two solution formats (physics-solution-workflow):
//   • LEGACY (no `format` field): the 6-section iconified template — validator requires
//     the four headings 🧠 🗺️ ⚡ ⚠️ (🖼️ and 💡 optional).
//   • FORMAT v2 (`format: 'v2'`): teacher-voice prose, NO iconified section headings (§🎤).
//     Validator forbids the legacy section icons (except 🖼️, kept as the figure anchor),
//     bans "monster", and still enforces boxed answer / balanced $ / no $$ / no "Step N".

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const FLAG_DIR = path.join(__dirname, '..', '..', '_agents', 'solution-flags');

// ─── Heuristic validator (SHARED — single source of truth) ──────────────────
// validateSolution + the base forbidden-phrase list live in
// scripts/lib/solution-validator.js so the three toolkits can never drift again.
// Physics policy (POLICY.physics): KEEPS 🖼️ as a v2 figure-anchor heading, ALLOWS
// the word "anchor" (legit physics term), and bans "monster" only in v2. Those
// intentional differences are encoded in the shared module's POLICY — change them
// there, not here.
const { validateSolution, POLICY } = require('../lib/solution-validator');

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
    `# ${prefix} — Physics Solution Flags`,
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
      { projection: { answer: 1, question_text: 1, options: 1, solution: 1, metadata: 1 } }
    );
    if (!cur) {
      addOrReplaceFlag(flagSections, 'blocking', id, 'not found in DB');
      blocked++;
      log.push(`${id}  BLOCK: not found in DB`);
      continue;
    }

    const issues = validateSolution(item.solution, { format: item.format, policy: POLICY.physics });
    if (issues.length) {
      addOrReplaceFlag(flagSections, 'blocking', id, `validation failed: ${issues.join('; ')}`);
      blocked++;
      log.push(`${id}  BLOCK: ${issues.join('; ')}`);
      continue;
    }

    const solutionIsObject = cur.solution && typeof cur.solution === 'object';
    const fmt = item.format === 'v2' ? 'v2' : 'legacy';
    const set = solutionIsObject
      ? {
          'solution.text_markdown': item.solution,
          'solution.latex_validated': true,
          'solution.format': fmt,
          updated_at: new Date(),
        }
      : {
          solution: { text_markdown: item.solution, latex_validated: true, format: fmt },
          updated_at: new Date(),
        };
    const notes = [];

    if (item.answer) {
      if (item.answer.correct_option != null) {
        const old = cur.answer && cur.answer.correct_option;
        if (old !== item.answer.correct_option) {
          set['answer.correct_option'] = item.answer.correct_option;
          notes.push(old == null
            ? `answer null → (${item.answer.correct_option})`
            : `answer (${old}) → (${item.answer.correct_option})`);
          answerFixes++;
        }
      }
      if (item.answer.integer_value != null) {
        const old = cur.answer && cur.answer.integer_value;
        if (old !== item.answer.integer_value) {
          set['answer.integer_value'] = item.answer.integer_value;
          notes.push(old == null
            ? `integer null → ${item.answer.integer_value}`
            : `integer ${old} → ${item.answer.integer_value}`);
          answerFixes++;
        }
      }
    }

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

    if (item.verifier_note) {
      addOrReplaceFlag(flagSections, 'verify', id, item.verifier_note);
      verifyFlags++;
    }

    // Optional metadata tag/nature/difficulty updates.
    // primary_tag_id: a single tag id (e.g. 'tag_rot_1') — replaces metadata.tags with [{tag_id, weight:1}].
    // question_nature: enum string per Question.v2.ts.
    // difficulty_level: integer 1–5.
    const VALID_NATURES = ['Recall','Rule_Application','Numerical','Comparative','Graphical','Conceptual','Mechanistic','Synthesis'];
    if (item.primary_tag_id) {
      const oldTags = (cur.metadata && cur.metadata.tags) || [];
      const oldPrimary = oldTags[0] && oldTags[0].tag_id;
      if (oldPrimary !== item.primary_tag_id) {
        set['metadata.tags'] = [{ tag_id: item.primary_tag_id, weight: 1 }];
        notes.push(`tag ${oldPrimary || 'null'} → ${item.primary_tag_id}`);
      }
    }
    if (item.question_nature) {
      if (!VALID_NATURES.includes(item.question_nature)) {
        addOrReplaceFlag(flagSections, 'soft', id, `invalid question_nature: ${item.question_nature}`);
        softFlags++;
      } else {
        const oldNat = cur.metadata && cur.metadata.questionNature;
        if (oldNat !== item.question_nature) {
          set['metadata.questionNature'] = item.question_nature;
          notes.push(`nature ${oldNat || 'null'} → ${item.question_nature}`);
        }
      }
    }
    if (item.difficulty_level != null) {
      const dl = Number(item.difficulty_level);
      if (!Number.isInteger(dl) || dl < 1 || dl > 5) {
        addOrReplaceFlag(flagSections, 'soft', id, `invalid difficulty_level: ${item.difficulty_level}`);
        softFlags++;
      } else {
        const oldDL = cur.metadata && cur.metadata.difficultyLevel;
        if (oldDL !== dl) {
          set['metadata.difficultyLevel'] = dl;
          notes.push(`difficulty ${oldDL || 'null'} → ${dl}`);
        }
      }
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
