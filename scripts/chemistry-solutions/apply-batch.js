#!/usr/bin/env node
// apply-batch.js — validates a batch of chemistry solutions, writes to DB,
// appends to flag file, AND extracts 📐 diagram markers into a per-chapter
// wishlist file for later Notion sync.
//
// Usage:
//   node scripts/chemistry-solutions/apply-batch.js <batch-file.js> [--dry-run]
//
// Mirror of scripts/physics-solutions/apply-batch.js. Validator enforces the four
// required chemistry-solution-workflow headings: 🧠 🗺️ ⚡ ⚠️ (🖼️ and 💡 are
// optional per workflow).
//
// 📐 MARKER EXTRACTION (chemistry-specific):
// Solutions can contain inline markers of the form:
//   📐 [Solution diagram: <description of what to draw>]
// These are detected, parsed, and appended to:
//   _agents/solution-flags/<PREFIX>-diagram-wishlist.md
// (one row per marker, with display_id + description). The markers stay in the
// solution markdown — the student sees "diagram coming here" until you replace
// it with the actual generated image.

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const FLAG_DIR = path.join(__dirname, '..', '..', '_agents', 'solution-flags');

const QUESTION_NATURE_ENUM = new Set([
  'Recall', 'Rule_Application', 'Numerical', 'Comparative',
  'Graphical', 'Conceptual', 'Mechanistic', 'Synthesis',
]);

// ─── Heuristic validator (SHARED — single source of truth) ──────────────────
// validateSolution + normalizeCeCharges + the base forbidden-phrase list live in
// scripts/lib/solution-validator.js so the three toolkits can never drift again
// (that drift is what let this file keep hard-requiring the 4 icons after the v2
// switch shipped in math/physics — fixed 2026-06-13). Chemistry policy: forbid all
// v2 section icons, ban "monster"+"anchor". Change rules in the shared module.
const { validateSolution, normalizeCeCharges, POLICY } = require('../lib/solution-validator');

// ─── 📐 Diagram-marker extraction ───────────────────────────────────────────
// Match `📐 [Solution diagram: <description>]` anywhere in the solution.
// The description can contain any characters except an unescaped `]` (we use a
// lazy match so multi-bracket nests don't blow up — a single-level marker is
// the convention).
function extractDiagramMarkers(md) {
  if (!md || typeof md !== 'string') return [];
  const re = /📐\s*\[\s*Solution diagram:\s*([^\]]+)\s*\]/g;
  const out = [];
  let m;
  while ((m = re.exec(md)) !== null) {
    out.push(m[1].trim());
  }
  return out;
}

const WISHLIST_HEADER = (prefix) => `# ${prefix} — Solution-Side Diagrams Wishlist

Questions where a hand-drawn or generated diagram in the SOLUTION area would help students. Each row was detected from a 📐 [Solution diagram: ...] marker in the solution text.

Sync these to the Notion database '🖼️ Solution-Side Diagrams Wishlist' under the Crucible Development Tracker page when convenient.

| display_id | Diagram description | Status |
|---|---|---|
`;

function appendDiagramWishlist(prefix, entries) {
  if (!entries || entries.length === 0) return 0;
  const file = path.join(FLAG_DIR, `${prefix}-diagram-wishlist.md`);
  fs.mkdirSync(FLAG_DIR, { recursive: true });
  let body = '';
  if (!fs.existsSync(file)) body = WISHLIST_HEADER(prefix);
  else body = fs.readFileSync(file, 'utf8');

  // Avoid duplicate rows for the same display_id + description.
  const existing = new Set();
  for (const line of body.split('\n')) {
    const m = line.match(/^\|\s*\*\*([^*]+)\*\*\s*\|\s*([^|]+)\s*\|/);
    if (m) existing.add(`${m[1].trim()}::${m[2].trim()}`);
  }

  let appended = 0;
  for (const e of entries) {
    const key = `${e.display_id}::${e.description}`;
    if (existing.has(key)) continue;
    body += `| **${e.display_id}** | ${e.description.replace(/\|/g, '\\|')} | Not started |\n`;
    existing.add(key);
    appended++;
  }

  if (appended > 0) fs.writeFileSync(file, body);
  return appended;
}

// ─── Flag file appender (same as physics) ───────────────────────────────────
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
    `# ${prefix} — Chemistry Solution Flags`,
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

function clearFlagsForId(sections, displayId) {
  for (const sev of ['blocking', 'verify', 'soft']) {
    const sec = sections[sev];
    for (let i = sec.length - 1; i >= 0; i--) {
      if (sec[i].includes(`**${displayId}**`)) sec.splice(i, 1);
    }
  }
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
  const diagramEntries = [];
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

    // Canonicalize \ce{} ion charges (^n+ → ^{n+}) before validating/writing.
    if (item.solution) {
      const normed = normalizeCeCharges(item.solution);
      if (normed !== item.solution) {
        log.push(`${id}  NORMALIZED \\ce{} charges (^n± → ^{n±})`);
        item.solution = normed;
      }
    }

    const issues = validateSolution(item.solution, { format: item.format, policy: POLICY.chemistry });
    if (issues.length) {
      addOrReplaceFlag(flagSections, 'blocking', id, `validation failed: ${issues.join('; ')}`);
      blocked++;
      log.push(`${id}  BLOCK: ${issues.join('; ')}`);
      continue;
    }

    // Validation passed: this is a clean write. Clear any stale flags from
    // prior runs (blocked/verify/soft) before applying new ones below.
    clearFlagsForId(flagSections, id);

    // Detect 📐 diagram markers and queue them for the wishlist.
    const markers = extractDiagramMarkers(item.solution);
    for (const desc of markers) {
      diagramEntries.push({ display_id: id, description: desc });
    }

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
      // If cur.answer is null (not an object), we must set the whole `answer` field
      // at once rather than dotted sub-paths (Mongo can't create fields on null).
      const curAnswerIsObject = cur.answer && typeof cur.answer === 'object';
      if (item.answer.correct_option != null) {
        const old = curAnswerIsObject ? cur.answer.correct_option : undefined;
        if (old !== item.answer.correct_option) {
          if (curAnswerIsObject) {
            set['answer.correct_option'] = item.answer.correct_option;
          } else {
            set.answer = { ...(set.answer || {}), correct_option: item.answer.correct_option };
          }
          notes.push(old == null
            ? `answer null → (${item.answer.correct_option})`
            : `answer (${old}) → (${item.answer.correct_option})`);
          answerFixes++;
        }
      }
      if (item.answer.integer_value != null) {
        const old = curAnswerIsObject ? cur.answer.integer_value : undefined;
        if (old !== item.answer.integer_value) {
          if (curAnswerIsObject) {
            set['answer.integer_value'] = item.answer.integer_value;
          } else {
            set.answer = { ...(set.answer || {}), integer_value: item.answer.integer_value };
          }
          notes.push(old == null
            ? `integer null → ${item.answer.integer_value}`
            : `integer ${old} → ${item.answer.integer_value}`);
          answerFixes++;
        }
      }
    }

    if (item.primary_concept) {
      if (typeof item.primary_concept !== 'string' || !/^tag_[a-z0-9_]+$/i.test(item.primary_concept)) {
        addOrReplaceFlag(flagSections, 'soft', id, `primary_concept malformed: ${item.primary_concept}`);
        softFlags++;
      } else {
        const existing = Array.isArray(cur.metadata?.tags) ? cur.metadata.tags : [];
        const rest = existing.filter(t => t.tag_id !== item.primary_concept);
        const newTags = [{ tag_id: item.primary_concept, weight: 1 }, ...rest];
        const oldPrimary = existing[0]?.tag_id;
        if (oldPrimary !== item.primary_concept) {
          set['metadata.tags'] = newTags;
          notes.push(`primary: ${oldPrimary || '(none)'} → ${item.primary_concept}`);
        }
      }
    }

    if (item.microConcept != null) {
      if (typeof item.microConcept !== 'string') {
        addOrReplaceFlag(flagSections, 'soft', id, `microConcept must be a string`);
        softFlags++;
      } else if (cur.metadata?.microConcept !== item.microConcept) {
        set['metadata.microConcept'] = item.microConcept;
        notes.push(`microConcept: ${cur.metadata?.microConcept || '(none)'} → ${item.microConcept}`);
      }
    }

    if (item.questionNature != null) {
      if (!QUESTION_NATURE_ENUM.has(item.questionNature)) {
        addOrReplaceFlag(flagSections, 'soft', id, `questionNature not in enum: ${item.questionNature}`);
        softFlags++;
      } else if (cur.metadata?.questionNature !== item.questionNature) {
        set['metadata.questionNature'] = item.questionNature;
        notes.push(`questionNature: ${cur.metadata?.questionNature || '(none)'} → ${item.questionNature}`);
      }
    }

    if (item.difficultyLevel != null) {
      if (![1, 2, 3, 4, 5].includes(item.difficultyLevel)) {
        addOrReplaceFlag(flagSections, 'soft', id, `difficultyLevel must be 1–5: ${item.difficultyLevel}`);
        softFlags++;
      } else if (cur.metadata?.difficultyLevel !== item.difficultyLevel) {
        set['metadata.difficultyLevel'] = item.difficultyLevel;
        notes.push(`difficultyLevel: ${cur.metadata?.difficultyLevel || '(none)'} → ${item.difficultyLevel}`);
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

    if (!dryRun) {
      await Q.updateOne({ display_id: id }, { $set: set });
    }
    const markerSuffix = markers.length ? `  [${markers.length} 📐 marker${markers.length > 1 ? 's' : ''}]` : '';
    written++;
    log.push(`${id}  OK${notes.length ? '  [' + notes.join(', ') + ']' : ''}${markerSuffix}${dryRun ? '  (dry-run)' : ''}`);
  }

  if (!dryRun) writeFlagFile(prefix, flagSections);
  const wishlistAppended = !dryRun ? appendDiagramWishlist(prefix, diagramEntries) : 0;

  console.log('\n=== APPLY-BATCH SUMMARY ===');
  console.log(`Chapter prefix:         ${prefix}`);
  console.log(`Mode:                   ${dryRun ? 'DRY-RUN' : 'WRITE'}`);
  console.log(`Solutions written:      ${written}`);
  console.log(`Answer-key corrections: ${answerFixes}`);
  console.log(`Blocked (no write):     ${blocked}`);
  console.log(`Verify flags added:     ${verifyFlags}`);
  console.log(`Soft flags added:       ${softFlags}`);
  console.log(`📐 markers detected:    ${diagramEntries.length}`);
  console.log(`📐 wishlist appended:   ${wishlistAppended} new row${wishlistAppended === 1 ? '' : 's'}`);
  console.log('\nDetails:');
  for (const line of log) console.log('  ' + line);

  await mongoose.disconnect();
})().catch(err => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
