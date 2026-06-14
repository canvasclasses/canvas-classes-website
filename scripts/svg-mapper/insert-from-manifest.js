#!/usr/bin/env node
/**
 * SVG MAPPER — Tool 2 of 2 (inserter)
 * ===================================
 * Reads a manifest.json (produced by the gallery mapper or hand-written),
 * uploads each SVG to Cloudflare R2, creates an Asset doc, and embeds the
 * figure into the right slot of its questions_v2 question:
 *   - slot "question"        -> append  ![..](url) to question_text.markdown
 *   - slot "optionA|B|C|D"   -> REPLACE options[id=a|b|c|d].text with ![..](url)
 *                               (these are the graph/shape-option questions whose
 *                                stored option text is a verbal placeholder)
 *   - slot "solution"        -> append  ![..](url) to solution.text_markdown
 *
 * Writes data identical in shape to what the admin upload route produces:
 *   - R2 key:  questions/<question._id>/svg/<ts>_<safeName>_<assetId8>.svg
 *   - Asset doc: exact packages/data/models/Asset.ts shape
 * (We mirror packages/core/r2-storage.ts rather than import it — that file is
 *  `import 'server-only'` and throws outside Next.js.)
 *
 * Usage:
 *   # DRY RUN (default) — resolves every entry, writes nothing:
 *   node scripts/svg-mapper/insert-from-manifest.js "<manifest.json>" "<svg-folder>"
 *
 *   # COMMIT — uploads to R2 + writes questions_v2 + writes a rollback file:
 *   node scripts/svg-mapper/insert-from-manifest.js "<manifest.json>" "<svg-folder>" --commit
 *
 * Safety:
 *   - Only questions named in the manifest are touched.
 *   - Idempotent: an SVG already embedded (same R2 checksum / url present) is skipped.
 *   - --commit writes rollback-<ts>.json (prior question_text / option text / asset_ids
 *     per touched question) so every change is reversible.
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env.local') });
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const [, , manifestPath, svgFolder] = process.argv;
const COMMIT = process.argv.includes('--commit');
if (!manifestPath || !svgFolder) {
  console.error('Usage: node scripts/svg-mapper/insert-from-manifest.js "<manifest.json>" "<svg-folder>" [--commit]');
  process.exit(1);
}

// ---- R2 (mirrors packages/core/r2-storage.ts getR2Config + uploadToR2) -------
function r2Config() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const bucketName = process.env.R2_BUCKET_NAME || 'canvas-chemistry-assets';
  return {
    accountId,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucketName,
    publicUrl: process.env.R2_PUBLIC_URL || `https://${bucketName}.${accountId}.r2.dev`,
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  };
}
let _s3 = null;
function s3() {
  if (_s3) return _s3;
  const c = r2Config();
  _s3 = new S3Client({ region: 'auto', endpoint: c.endpoint, credentials: { accessKeyId: c.accessKeyId, secretAccessKey: c.secretAccessKey } });
  return _s3;
}
async function uploadSvgToR2(buffer, questionId, originalName, assetId) {
  const c = r2Config();
  const safe = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `questions/${questionId}/svg/${Date.now()}_${safe}_${assetId.slice(0, 8)}.svg`;
  await s3().send(new PutObjectCommand({
    Bucket: c.bucketName, Key: key, Body: buffer, ContentType: 'image/svg+xml',
    Metadata: { 'uploaded-at': new Date().toISOString(), 'original-name': originalName },
  }));
  return { storage_path: key, cdn_url: `${c.publicUrl}/${key}` };
}

// ---- slot helpers ------------------------------------------------------------
const OPTION_SLOTS = { optionA: 'a', optionB: 'b', optionC: 'c', optionD: 'd' };
function fieldNameForSlot(slot) {
  if (slot === 'question') return 'question_text.markdown';
  if (slot === 'solution') return 'solution.text_markdown';
  if (OPTION_SLOTS[slot]) return `options.${OPTION_SLOTS[slot]}.text`;
  return null;
}

function imgMarkdown(displayId, slot, url) {
  return `![${displayId} ${slot}](${url})`;
}

// Place a solution-side figure in the right spot of a written 6-section solution:
//   1. replace a `📐 [Solution diagram: …]` marker if the author left one, else
//   2. drop it at the end of the 🖼️ Visual Sketch section (before the next section), else
//   3. append to the end (and flag it — usually means the solution isn't written yet).
const SECTION_EMOJIS = ['🗺️', '⚡', '💡', '⚠️', '📋', '🧠'];
function placeSolutionImage(markdown, img) {
  const markerRe = /📐\s*\[[^\]]*\]/;
  if (markerRe.test(markdown)) {
    return { text: markdown.replace(markerRe, img), where: 'replaced 📐 marker' };
  }
  const lines = markdown.split('\n');
  const viz = lines.findIndex((l) => l.includes('🖼️'));
  if (viz !== -1) {
    let next = lines.length;
    for (let i = viz + 1; i < lines.length; i++) {
      if (SECTION_EMOJIS.some((e) => lines[i].includes(e))) { next = i; break; }
    }
    lines.splice(next, 0, '', img, '');
    return { text: lines.join('\n').replace(/\n{3,}/g, '\n\n').trim(), where: 'into 🖼️ Visual Sketch' };
  }
  // No 🖼️ section (author skipped it) — create one in canonical position: after
  // 🧠 Reading, before 🗺️ Working It Out (or the first later section heading).
  const CREATE_BEFORE = ['🗺️', '⚡', '💡', '⚠️', '📋'];
  const at = lines.findIndex((l) => CREATE_BEFORE.some((e) => l.includes(e)));
  if (at !== -1) {
    lines.splice(at, 0, '**🖼️ Visual Sketch**', '', img, '');
    return { text: lines.join('\n').replace(/\n{3,}/g, '\n\n').trim(), where: 'created 🖼️ Visual Sketch section' };
  }
  return { text: (markdown.trimEnd() + '\n\n' + img).trim(), where: '⚠️ appended — no section headings (solution empty?)' };
}

async function main() {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const entries = manifest.entries || [];
  if (!entries.length) { console.error('Manifest has no entries.'); process.exit(1); }

  // Validate files + slots up front.
  const problems = [];
  for (const e of entries) {
    if (!fs.existsSync(path.join(svgFolder, e.file))) problems.push(`missing file: ${e.file}`);
    if (!fieldNameForSlot(e.slot)) problems.push(`bad slot "${e.slot}" for ${e.display_id}`);
  }
  if (problems.length) { console.error('Manifest problems:\n - ' + problems.join('\n - ')); process.exit(1); }

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const questions = client.db('crucible').collection('questions_v2');
  const assets = client.db('crucible').collection('assets');

  // Group entries by display_id so each question is read + written once.
  const byQuestion = new Map();
  for (const e of entries) {
    if (!byQuestion.has(e.display_id)) byQuestion.set(e.display_id, []);
    byQuestion.get(e.display_id).push(e);
  }

  const rollback = [];
  let nQuestions = 0, nAssetsNew = 0, nAssetsReused = 0, nSkipped = 0;
  const report = [];

  for (const [displayId, group] of byQuestion) {
    const q = await questions.findOne({ display_id: displayId });
    if (!q) { report.push(`✗ ${displayId}  NOT FOUND — skipped (${group.length} figs)`); continue; }

    const before = {
      display_id: displayId,
      _id: q._id,
      question_text_markdown: q.question_text?.markdown ?? '',
      options: (q.options || []).map((o) => ({ id: o.id, text: o.text, asset_ids: o.asset_ids || [] })),
      solution_text_markdown: q.solution?.text_markdown ?? '',
      asset_ids: q.asset_ids || [],
    };

    // Working copy of the mutable fields.
    let qMarkdown = before.question_text_markdown;
    let solMarkdown = before.solution_text_markdown;
    const options = (q.options || []).map((o) => ({ ...o, asset_ids: [...(o.asset_ids || [])] }));
    const topAssetIds = [...before.asset_ids];
    const lines = [];
    let touched = false;

    for (const e of group) {
      const buf = fs.readFileSync(path.join(svgFolder, e.file));
      const checksum = crypto.createHash('sha256').update(buf).digest('hex');

      // Dedup against existing assets by checksum.
      let asset = await assets.findOne({ 'file.checksum': checksum });
      let url, assetId, reused = false;
      if (asset) { url = asset.file.cdn_url; assetId = asset._id; reused = true; }
      else { assetId = uuidv4(); }

      const img = imgMarkdown(displayId, e.slot, url || `R2://questions/${q._id}/svg/(${e.file})`);

      // Idempotency: is this figure already embedded?
      const already =
        (e.slot === 'question' && url && qMarkdown.includes(url)) ||
        (e.slot === 'solution' && url && solMarkdown.includes(url)) ||
        (OPTION_SLOTS[e.slot] && url && (options.find((o) => o.id === OPTION_SLOTS[e.slot])?.text || '').includes(url));
      if (already) { lines.push(`    · ${e.slot}: already embedded — skip`); nSkipped++; continue; }

      // Resolve the option target early (so a bad option id fails before any upload).
      let optTarget = null;
      if (OPTION_SLOTS[e.slot]) {
        optTarget = options.find((o) => o.id === OPTION_SLOTS[e.slot]);
        if (!optTarget) { lines.push(`    · ${e.slot}: NO option "${OPTION_SLOTS[e.slot]}" on ${displayId} — skip`); nSkipped++; continue; }
      }

      if (COMMIT) {
        if (!reused) {
          const up = await uploadSvgToR2(buf, q._id, e.file, assetId);
          url = up.cdn_url;
          await assets.insertOne({
            _id: assetId, type: 'svg',
            file: { original_name: e.file, mime_type: 'image/svg+xml', size_bytes: buf.length, storage_path: up.storage_path, cdn_url: up.cdn_url, checksum },
            used_in: { questions: [q._id], question_field: fieldNameForSlot(e.slot) },
            metadata: { alt_text: `${displayId} ${e.slot}`, context: 'practice' },
            version: 1, previous_versions: [],
            created_at: new Date(), created_by: 'svg-mapper-script', updated_at: new Date(),
            processing_status: 'completed',
          });
          nAssetsNew++;
        } else {
          if (!asset.used_in.questions.includes(q._id)) {
            await assets.updateOne({ _id: assetId }, { $addToSet: { 'used_in.questions': q._id } });
          }
          nAssetsReused++;
        }
      } else {
        // dry run accounting
        if (reused) nAssetsReused++; else nAssetsNew++;
      }

      const finalImg = imgMarkdown(displayId, e.slot, url);
      // Apply to working copy.
      if (e.slot === 'question') { qMarkdown = (qMarkdown.trimEnd() + '\n\n' + finalImg).trim(); lines.push(`    · stem: append fig`); }
      else if (e.slot === 'solution') { const r = placeSolutionImage(solMarkdown, finalImg); solMarkdown = r.text; lines.push(`    · solution: ${r.where}`); }
      else { lines.push(`    · option ${optTarget.id}: REPLACE "${(optTarget.text || '').slice(0, 40)}" → image`); optTarget.text = finalImg; }
      if (!topAssetIds.includes(assetId)) topAssetIds.push(assetId);
      touched = true;
    }

    if (!touched) { report.push(`• ${displayId}  nothing to do`); continue; }

    if (COMMIT) {
      await questions.updateOne({ _id: q._id }, { $set: {
        'question_text.markdown': qMarkdown,
        'solution.text_markdown': solMarkdown,
        options,
        asset_ids: topAssetIds,
        updated_at: new Date(),
      } });
      rollback.push(before);
    }
    nQuestions++;
    report.push(`${COMMIT ? '✓' : '▷'} ${displayId}  (${group.length} fig${group.length > 1 ? 's' : ''})\n${lines.join('\n')}`);
  }

  console.log('\n' + report.join('\n'));
  console.log('\n' + '─'.repeat(60));
  console.log(`${COMMIT ? 'COMMITTED' : 'DRY RUN'} — manifest: ${path.basename(manifestPath)} (${manifest.sourceFolder || ''})`);
  console.log(`questions affected : ${nQuestions}`);
  console.log(`assets new / reused: ${nAssetsNew} / ${nAssetsReused}`);
  console.log(`figures skipped    : ${nSkipped}`);

  if (COMMIT) {
    const rbPath = path.join(path.dirname(manifestPath), `rollback-${Date.now()}.json`);
    fs.writeFileSync(rbPath, JSON.stringify({ db: 'crucible', collection: 'questions_v2', before: rollback }, null, 2));
    console.log(`rollback written   : ${rbPath}`);
    console.log('  (to revert: restore each question_text.markdown / options / asset_ids from this file)');
  } else {
    console.log('\nNothing was written. Re-run with --commit to upload + attach.');
  }

  await client.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
