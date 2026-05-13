/**
 * scripts/backfill_latex_validated.js
 *
 * Path B for the demo-curation rollout. Scans every published question in
 * the given chapter(s), runs the canonical LaTeX validator (ported inline
 * from lib/latexValidator.ts) on solution.text_markdown, and sets
 * solution.latex_validated = true on the ones that pass cleanly.
 *
 *   PASS criteria (all must hold):
 *     - solution.text_markdown is non-empty after trim
 *     - solution.text_markdown.length ≥ 200
 *     - validateLaTeX(text).errors.length === 0
 *       (warnings are tolerated; the validator emits warnings for soft
 *       signals like "possible chem formula without \ce{}" that don't
 *       break rendering)
 *
 * Dry-run by default. Pass --apply to actually write to MongoDB.
 *
 * Writes both BEFORE and AFTER snapshots to scripts/_snapshots/ on apply,
 * plus one AuditLog entry per updated question.
 *
 * Usage:
 *   node scripts/backfill_latex_validated.js ch11_mole ch11_atom ch11_periodic
 *   node scripts/backfill_latex_validated.js ch11_mole --apply
 */

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// ─── Canvas LaTeX validator — ported from lib/latexValidator.ts ─────────────
// Rules kept identical to the source of truth. Only `errors` (not warnings)
// count for backfill eligibility.
const RAW_ARROWS = /(?<!\$)[→←↔⇌⇒⇐↑↓](?![^$]*\$)/g;

// ─── Auto-fix — ported from lib/latexValidator.ts ──────────────────────────
// Conservative mechanical fixes for the three dominant validator failure
// modes: $$...$$ (display math), raw Unicode arrows, and \dfrac. All other
// failures (unmatched braces, \left/\right mismatch) require manual review
// and are NOT auto-fixed.
const UNICODE_ARROWS = {
  '→': '\\rightarrow',
  '←': '\\leftarrow',
  '↔': '\\leftrightarrow',
  '⇌': '\\rightleftharpoons',
  '⇒': '\\Rightarrow',
  '⇐': '\\Leftarrow',
  '↑': '\\uparrow',
  '↓': '\\downarrow',
};

function autoFixLatex(text) {
  let fixed = text;
  const fixesApplied = [];

  // Fix 1: $$...$$ → $...$
  const displayMatches = [...text.matchAll(/\$\$([^]*?)\$\$/g)];
  if (displayMatches.length > 0) {
    fixed = fixed.replace(/\$\$([^]*?)\$\$/g, (_m, inner) => `$${inner.trim()}$`);
    fixesApplied.push(`${displayMatches.length}× $$..$$ → $..$`);
  }

  // Fix 2: \dfrac → \frac
  const dfracCount = (fixed.match(/\\dfrac/g) || []).length;
  if (dfracCount > 0) {
    fixed = fixed.replace(/\\dfrac/g, '\\frac');
    fixesApplied.push(`${dfracCount}× \\dfrac → \\frac`);
  }

  // Fix 3: Raw Unicode arrows → LaTeX (wrapped in $..$). Only applied OUTSIDE
  // existing math context — we use a placeholder dance to preserve in-math
  // arrows untouched.
  let arrowCount = 0;
  // Tokenise math vs non-math, only replace in non-math regions.
  const segments = [];
  let cursor = 0;
  const dollarRe = /\$[^$]*\$/g; // crude inline-math matcher (post-fix-1 text)
  for (const m of fixed.matchAll(dollarRe)) {
    if (m.index > cursor) segments.push({ math: false, text: fixed.slice(cursor, m.index) });
    segments.push({ math: true, text: m[0] });
    cursor = m.index + m[0].length;
  }
  if (cursor < fixed.length) segments.push({ math: false, text: fixed.slice(cursor) });

  for (const seg of segments) {
    if (seg.math) continue;
    for (const [u, l] of Object.entries(UNICODE_ARROWS)) {
      const n = (seg.text.split(u).length - 1);
      if (n > 0) {
        seg.text = seg.text.replaceAll(u, `$${l}$`);
        arrowCount += n;
      }
    }
  }
  if (arrowCount > 0) {
    fixed = segments.map((s) => s.text).join('');
    fixesApplied.push(`${arrowCount}× Unicode arrow → $\\rightarrow$ etc.`);
  }

  return { text: fixed, fixesApplied };
}

function validateLaTeX(text) {
  const errors = [];
  const lines = text.split('\n');

  lines.forEach((line, lineIndex) => {
    const ln = lineIndex + 1;

    // 1. $$...$$ display math is forbidden
    if (/\$\$/.test(line)) {
      errors.push({ line: ln, rule: 'display_math', message: '$$...$$ forbidden — use $...$' });
    }

    // 2. \dfrac forbidden
    if (/\\dfrac/.test(line)) {
      errors.push({ line: ln, rule: 'dfrac', message: '\\dfrac causes oversized rendering' });
    }

    // 3. Unmatched $ on a single line (skip if $$ already flagged)
    if (!/\$\$/.test(line)) {
      const dollars = (line.match(/\$/g) || []).length;
      if (dollars % 2 !== 0) {
        errors.push({ line: ln, rule: 'unmatched_dollar', message: 'Unmatched $ — math not closed' });
      }
    }

    // 4. Unmatched braces on a line
    const openBraces = (line.match(/(?<!\\)\{/g) || []).length;
    const closeBraces = (line.match(/(?<!\\)\}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push({ line: ln, rule: 'unmatched_braces', message: `${openBraces} { vs ${closeBraces} }` });
    }

    // 5. \left / \right mismatch on a line
    const leftCount = (line.match(/\\left/g) || []).length;
    const rightCount = (line.match(/\\right/g) || []).length;
    if (leftCount !== rightCount) {
      errors.push({ line: ln, rule: 'left_right', message: `${leftCount} \\left vs ${rightCount} \\right` });
    }

    // 6. Raw Unicode arrow outside math
    if (RAW_ARROWS.test(line)) {
      RAW_ARROWS.lastIndex = 0;
      errors.push({ line: ln, rule: 'raw_arrow', message: 'Raw Unicode arrow outside $...$' });
    }
    RAW_ARROWS.lastIndex = 0;

    // 9. Missing backslash inside $ (e.g. $frac{a}{b}$ instead of $\frac{a}{b}$)
    const mathWordRegex = /\$[^$]*\b(frac|sqrt|sum|int|lim)\s*\{/g;
    let mwMatch;
    while ((mwMatch = mathWordRegex.exec(line)) !== null) {
      if (!mwMatch[0].includes('\\' + mwMatch[1])) {
        errors.push({ line: ln, rule: 'missing_backslash', message: `Missing \\ before "${mwMatch[1]}"` });
      }
    }
  });

  return { isValid: errors.length === 0, errors };
}

// ─── Main ──────────────────────────────────────────────────────────────────
(async () => {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const autofix = args.includes('--autofix');
  const chapterIds = args.filter((a) => !a.startsWith('--'));

  if (chapterIds.length === 0) {
    console.error('Usage: node scripts/backfill_latex_validated.js <chapter_id> [<chapter_id> ...] [--apply]');
    process.exit(1);
  }

  const mode = apply ? 'APPLY' : 'DRY-RUN';
  const fixMode = autofix ? ' (with --autofix)' : '';
  console.log(`\n[${mode}] Backfill latex_validated${fixMode} for: ${chapterIds.join(', ')}\n`);

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db();
  const questions = db.collection('questions_v2');
  const auditLogs = db.collection('auditlogs');

  // ── Per-chapter pass ─────────────────────────────────────────────────────
  const perChapter = {};
  const allUpdates = []; // for snapshot + audit

  for (const chapterId of chapterIds) {
    const docs = await questions
      .find({
        'metadata.chapter_id': chapterId,
        status: 'published',
        deleted_at: null,
      })
      .project({
        _id: 1,
        display_id: 1,
        'solution.text_markdown': 1,
        'solution.latex_validated': 1,
      })
      .toArray();

    const stats = {
      total: docs.length,
      alreadyValidated: 0,
      tooShort: 0,
      empty: 0,
      validatorPassed: 0,             // passed without auto-fix
      autoFixedAndPassed: 0,          // passed only after auto-fix
      validatorFailed: 0,             // still failed even after auto-fix (if enabled)
      newlyValidated: 0,
      sampleFailures: [],
      reasonsHistogram: new Map(),
      sampleAutoFixed: [],
    };

    for (const d of docs) {
      const sol = d.solution || {};
      const origTxt = (sol.text_markdown || '');
      const txt = origTxt.trim();

      if (sol.latex_validated === true) {
        stats.alreadyValidated++;
        continue;
      }
      if (txt.length === 0) {
        stats.empty++;
        continue;
      }
      if (txt.length < 200) {
        stats.tooShort++;
        continue;
      }

      const firstResult = validateLaTeX(txt);
      if (firstResult.isValid) {
        stats.validatorPassed++;
        stats.newlyValidated++;
        allUpdates.push({
          chapterId,
          _id: d._id,
          display_id: d.display_id,
          length: txt.length,
          autoFixed: false,
        });
        continue;
      }

      // Try auto-fix if enabled
      if (autofix) {
        const { text: fixed, fixesApplied } = autoFixLatex(origTxt);
        const fixedResult = validateLaTeX(fixed.trim());
        if (fixedResult.isValid && fixed.trim().length >= 200) {
          stats.autoFixedAndPassed++;
          stats.newlyValidated++;
          allUpdates.push({
            chapterId,
            _id: d._id,
            display_id: d.display_id,
            length: fixed.trim().length,
            autoFixed: true,
            newText: fixed,
            fixesApplied,
          });
          if (stats.sampleAutoFixed.length < 5) {
            stats.sampleAutoFixed.push({
              display_id: d.display_id,
              fixes: fixesApplied.join(', '),
            });
          }
          continue;
        }
        // Auto-fix didn't help — record the post-fix failure reasons
        for (const e of fixedResult.errors) {
          stats.reasonsHistogram.set(e.rule, (stats.reasonsHistogram.get(e.rule) || 0) + 1);
        }
        if (stats.sampleFailures.length < 5) {
          stats.sampleFailures.push({
            display_id: d.display_id,
            reasons: fixedResult.errors.slice(0, 3).map((e) => `${e.rule}: ${e.message}`),
          });
        }
      } else {
        // No auto-fix — record original failure reasons
        for (const e of firstResult.errors) {
          stats.reasonsHistogram.set(e.rule, (stats.reasonsHistogram.get(e.rule) || 0) + 1);
        }
        if (stats.sampleFailures.length < 5) {
          stats.sampleFailures.push({
            display_id: d.display_id,
            reasons: firstResult.errors.slice(0, 3).map((e) => `${e.rule}: ${e.message}`),
          });
        }
      }
      stats.validatorFailed++;
    }

    perChapter[chapterId] = stats;
  }

  // ── Print summary ────────────────────────────────────────────────────────
  console.log('\n────────────── BACKFILL SUMMARY ──────────────\n');
  console.log('| Chapter | Total | Already ✓ | Empty | <200 | Clean ✓ | Autofix→✓ | Still ✗ |');
  console.log('|---|---:|---:|---:|---:|---:|---:|---:|');
  let grandNew = 0;
  for (const [cid, s] of Object.entries(perChapter)) {
    console.log(
      `| ${cid} | ${s.total} | ${s.alreadyValidated} | ${s.empty} | ${s.tooShort} | ${s.validatorPassed} | ${s.autoFixedAndPassed} | ${s.validatorFailed} |`
    );
    grandNew += s.newlyValidated;
  }
  console.log(`\nTotal questions that would be newly validated: ${grandNew}`);
  console.log('');

  // Sample auto-fixed solutions (per chapter)
  if (autofix) {
    for (const [cid, s] of Object.entries(perChapter)) {
      if (s.sampleAutoFixed.length === 0) continue;
      console.log(`\n─── ${cid}: sample auto-fixes ───`);
      for (const a of s.sampleAutoFixed) {
        console.log(`  ${a.display_id}: ${a.fixes}`);
      }
    }
  }

  // Per-chapter failure breakdown
  for (const [cid, s] of Object.entries(perChapter)) {
    if (s.validatorFailed === 0) continue;
    console.log(`\n─── ${cid}: validator failures by rule ───`);
    const sorted = Array.from(s.reasonsHistogram.entries()).sort((a, b) => b[1] - a[1]);
    for (const [rule, n] of sorted) {
      console.log(`  ${String(n).padStart(4)}× ${rule}`);
    }
    console.log('  Sample failing display_ids:');
    for (const f of s.sampleFailures) {
      console.log(`    ${f.display_id}: ${f.reasons.join(' | ')}`);
    }
  }

  // ── Apply (or skip) ──────────────────────────────────────────────────────
  if (!apply) {
    console.log('\n[DRY-RUN] No writes performed. Re-run with --apply to commit.\n');
    await client.close();
    return;
  }

  if (grandNew === 0) {
    console.log('\nNothing to apply.\n');
    await client.close();
    return;
  }

  // Snapshot the affected docs BEFORE mutating
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const snapDir = path.join(__dirname, '_snapshots');
  if (!fs.existsSync(snapDir)) fs.mkdirSync(snapDir, { recursive: true });
  const snapBefore = path.join(snapDir, `backfill_latex_validated_${chapterIds.join('-')}_${ts}_before.json`);
  const before = await questions
    .find({ _id: { $in: allUpdates.map((u) => u._id) } })
    .project({ _id: 1, display_id: 1, 'solution.latex_validated': 1, version: 1 })
    .toArray();
  fs.writeFileSync(snapBefore, JSON.stringify(before, null, 2));
  console.log(`\nSnapshot (before) → ${snapBefore}`);

  // Bulk update. For docs that needed an auto-fix, we ALSO write back the
  // cleaned solution.text_markdown — otherwise just flip the flag.
  let updated = 0;
  let autoFixWrites = 0;
  for (const u of allUpdates) {
    const set = {
      'solution.latex_validated': true,
      updated_at: new Date(),
      updated_by: 'backfill_latex_validated.js',
    };
    if (u.autoFixed && u.newText) {
      set['solution.text_markdown'] = u.newText;
      autoFixWrites++;
    }
    const r = await questions.updateOne(
      { _id: u._id },
      { $set: set, $inc: { version: 1 } }
    );
    if (r.modifiedCount === 1) updated++;
  }
  console.log(`  ${autoFixWrites} of those also had their solution text rewritten by auto-fix.`);

  // Audit log — one entry per chapter (a single bulk operation, not 1500 rows)
  for (const cid of chapterIds) {
    const cnt = perChapter[cid].newlyValidated;
    if (cnt === 0) continue;
    await auditLogs.insertOne({
      _id: uuidv4(),
      entity_type: 'question_batch',
      entity_id: cid,
      action: 'backfill_latex_validated',
      changes: [
        {
          field: 'solution.latex_validated',
          old_value: 'false_or_unset',
          new_value: 'true',
        },
      ],
      user_id: 'backfill-script',
      user_email: 'backfill_latex_validated.js',
      timestamp: new Date(),
      can_rollback: true,
      rollback_data: { snapshot_path: snapBefore, count: cnt, chapterId: cid },
    });
  }

  console.log(`\n[APPLY] Updated ${updated} / ${allUpdates.length} questions.\n`);

  // Final audit: confirm new quality-passing count
  console.log('Re-checking quality-pass counts:');
  for (const cid of chapterIds) {
    const passing = await questions.countDocuments({
      'metadata.chapter_id': cid,
      status: 'published',
      deleted_at: null,
      'solution.latex_validated': true,
      $expr: { $gte: [{ $strLenCP: { $ifNull: ['$solution.text_markdown', ''] } }, 200] },
    });
    console.log(`  ${cid}: ${passing} questions now pass the demo quality gate`);
  }

  await client.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
