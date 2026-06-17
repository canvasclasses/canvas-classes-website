'use strict';
/**
 * book-writer.js — the ONLY sanctioned gateway for mutating Live Book content.
 *
 * WHY: Live Book pages/blocks/assets are founder-authored and irreplaceable, and
 * removals are often invisible for months (a whole section + a recorded video was
 * silently hard-deleted on 2026-06-10, unnoticed until 2026-06-14). See CLAUDE.md
 * §0.6 and _agents/plans/CONTENT_PROTECTION.md.
 *
 * Every write through this module:
 *   1. Snapshots the CURRENT page into `book_page_versions` (full history).
 *   2. Runs the CONTENT-LOSS GUARD: if the change removes a block, unlinks an
 *      asset (src/url/audio_url/portrait_src), or sharply shrinks the page, it is
 *      BLOCKED unless allowContentLoss:true + a lossReason are passed (= founder
 *      consent given this session).
 *   3. Writes an audit row into `book_audit`.
 * Deletes are SOFT only (deleted_at) — pages are never erased, R2 files never touched.
 *
 * USAGE (new book scripts must use this instead of raw updateOne/deleteOne):
 *   const bw = require('./lib/book-writer');           // from scripts/
 *   await bw.withDb(async (db) => {
 *     await bw.savePage(db, { slug: 'scientific-measurement' }, newBlocks,
 *       { author: 'agent', summary: 'added pressure section' });
 *     // dry-run first to preview the diff without writing:
 *     console.log(await bw.savePage(db, { slug }, newBlocks, { dryRun: true }));
 *   });
 */
const crypto = require('crypto');
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

// ─── Pure helpers (ports of @canvas/data/books/utils) ───────────────────────
function flattenBlocks(arr) {
  const out = [];
  for (const b of arr || []) {
    if (b && b.type === 'section' && Array.isArray(b.columns)) {
      for (const col of b.columns) out.push(...(Array.isArray(col) ? col : []));
    } else out.push(b);
  }
  return out;
}
function computeReadingTime(arr) {
  const flat = flattenBlocks(arr);
  let w = 0, v = 0, a = 0;
  for (const b of flat) {
    if (!b) continue;
    if (b.type === 'text') w += (b.markdown || '').split(/\s+/).length;
    else if (b.type === 'heading') w += (b.text || '').split(/\s+/).length;
    else if (b.type === 'callout') w += (b.markdown || '').split(/\s+/).length;
    else if (b.type === 'video') v++;
    else if (b.type === 'audio_note') a++;
  }
  return Math.max(1, Math.ceil(w / 200) + v * 2 + a);
}
const INTERACTIVE = new Set([
  'inline_quiz', 'simulation', 'video', 'molecule_3d', 'interactive_image',
  'classify_exercise', 'reasoning_prompt', 'worked_example', 'practice_link',
]);
function computeContentTypes(arr) {
  const found = new Set();
  for (const b of flattenBlocks(arr)) if (b && INTERACTIVE.has(b.type)) found.add(b.type);
  return [...found].sort();
}

// Stable hash of a page's blocks (ignores key order).
function stableStringify(v) {
  if (Array.isArray(v)) return '[' + v.map(stableStringify).join(',') + ']';
  if (v && typeof v === 'object') {
    return '{' + Object.keys(v).sort().map((k) => JSON.stringify(k) + ':' + stableStringify(v[k])).join(',') + '}';
  }
  return JSON.stringify(v);
}
function hashBlocks(blocks) {
  return crypto.createHash('sha256').update(stableStringify(blocks || [])).digest('hex');
}

const ASSET_KEYS = new Set(['src', 'url', 'audio_url', 'portrait_src', 'poster', 'image_src']);
// Recursively collect every asset-URL string anywhere in the blocks tree.
function collectAssetRefs(node, acc = new Set()) {
  if (!node) return acc;
  if (Array.isArray(node)) { for (const x of node) collectAssetRefs(x, acc); return acc; }
  if (typeof node === 'object') {
    for (const [k, val] of Object.entries(node)) {
      if (ASSET_KEYS.has(k) && typeof val === 'string' && val.trim()) acc.add(val.trim());
      else collectAssetRefs(val, acc);
    }
  }
  return acc;
}
// Recursively collect every block id.
function collectBlockIds(node, acc = new Set()) {
  if (!node) return acc;
  if (Array.isArray(node)) { for (const x of node) collectBlockIds(x, acc); return acc; }
  if (typeof node === 'object') {
    if (typeof node.id === 'string' && node.type) acc.add(node.id);
    for (const val of Object.values(node)) if (val && typeof val === 'object') collectBlockIds(val, acc);
  }
  return acc;
}
const shortName = (u) => String(u).split('/').pop();

const SHRINK_THRESHOLD = 0.25; // >25% reading-time drop is flagged as content loss

// ─── The content-loss guard ─────────────────────────────────────────────────
function diffPage(oldBlocks, newBlocks) {
  const oldIds = collectBlockIds(oldBlocks), newIds = collectBlockIds(newBlocks);
  const removedBlockIds = [...oldIds].filter((id) => !newIds.has(id));
  const addedBlockIds = [...newIds].filter((id) => !oldIds.has(id));
  const oldAssets = collectAssetRefs(oldBlocks), newAssets = collectAssetRefs(newBlocks);
  const removedAssets = [...oldAssets].filter((a) => !newAssets.has(a));
  const rtOld = computeReadingTime(oldBlocks), rtNew = computeReadingTime(newBlocks);
  const shrinkPct = rtOld > 0 ? (rtOld - rtNew) / rtOld : 0;
  const reasons = [];
  if (removedBlockIds.length) reasons.push(`${removedBlockIds.length} block(s) removed`);
  if (removedAssets.length) reasons.push(`${removedAssets.length} asset ref(s) unlinked: ${removedAssets.map(shortName).join(', ')}`);
  if (shrinkPct > SHRINK_THRESHOLD) reasons.push(`reading time shrinks ${Math.round(shrinkPct * 100)}% (${rtOld}→${rtNew} min)`);
  return { removedBlockIds, addedBlockIds, removedAssets, rtOld, rtNew, shrinkPct, lossDetected: reasons.length > 0, reasons };
}

async function ensureIndexes(db) {
  await db.collection('book_page_versions').createIndex({ page_id: 1, version: -1 });
  await db.collection('book_audit').createIndex({ page_id: 1, at: -1 });
}

async function snapshotVersion(db, page, reason, author) {
  const versions = db.collection('book_page_versions');
  const version = (await versions.countDocuments({ page_id: page._id })) + 1;
  await versions.insertOne({
    _id: uuidv4(), page_id: page._id, version,
    title: page.title, slug: page.slug, blocks: page.blocks || [],
    content_hash: hashBlocks(page.blocks || []),
    asset_refs: [...collectAssetRefs(page.blocks || [])],
    reading_time_min: page.reading_time_min,
    deleted_at: page.deleted_at || null,
    doc: page, // full original document — lets us re-insert even after a hard delete
    snapshot_at: new Date(), snapshot_reason: reason, author,
  });
  return version;
}

// ─── savePage — the gateway for all content writes ──────────────────────────
async function savePage(db, selector, newBlocks, opts = {}) {
  const { author = 'script', summary = '', allowContentLoss = false, lossReason = '', dryRun = false, extraSet = {} } = opts;
  if (!Array.isArray(newBlocks)) throw new Error('book-writer.savePage: newBlocks must be an array');
  const pages = db.collection('book_pages');
  const query = selector.pageId ? { _id: selector.pageId } : { slug: selector.slug };
  const cur = await pages.findOne(query);
  if (!cur) throw new Error(`book-writer.savePage: page not found for ${JSON.stringify(selector)}`);

  const diff = diffPage(cur.blocks || [], newBlocks);

  // Dry-run previews the diff (including whether it WOULD be blocked) and writes nothing.
  if (dryRun) return { dryRun: true, slug: cur.slug, diff, wouldBlock: diff.lossDetected && !allowContentLoss };

  if (diff.lossDetected && !allowContentLoss) {
    await db.collection('book_audit').insertOne({
      _id: uuidv4(), page_id: cur._id, slug: cur.slug, action: 'save',
      author, summary, content_loss: true, loss_reasons: diff.reasons, blocked: true, at: new Date(),
    });
    const err = new Error(
      `CONTENT-LOSS BLOCKED for "${cur.slug}": ${diff.reasons.join('; ')}. ` +
      `This change removes founder content. Re-run with { allowContentLoss: true, lossReason: '...' } ONLY after explicit founder consent (CLAUDE.md §0.6).`
    );
    err.contentLoss = true; err.diff = diff;
    throw err;
  }

  const version = await snapshotVersion(db, cur, `pre-save: ${summary || '(no summary)'}`, author);
  await pages.updateOne({ _id: cur._id }, {
    $set: {
      blocks: newBlocks,
      reading_time_min: computeReadingTime(newBlocks),
      content_types: computeContentTypes(newBlocks),
      updated_at: new Date(),
      ...extraSet,
    },
  });
  await db.collection('book_audit').insertOne({
    _id: uuidv4(), page_id: cur._id, slug: cur.slug, action: 'save', author, summary,
    version_saved: version,
    change: { blocksBefore: (cur.blocks || []).length, blocksAfter: newBlocks.length, removedBlockIds: diff.removedBlockIds, addedBlockIds: diff.addedBlockIds, removedAssets: diff.removedAssets },
    content_loss: diff.lossDetected, loss_reason: lossReason || null, blocked: false, at: new Date(),
  });
  return { slug: cur.slug, version, diff };
}

// ─── softDeletePage — never erases ──────────────────────────────────────────
async function softDeletePage(db, selector, opts = {}) {
  const { author = 'script', reason = '' } = opts;
  if (!reason) throw new Error('book-writer.softDeletePage requires a `reason` (founder consent, CLAUDE.md §0.6).');
  const pages = db.collection('book_pages');
  const cur = await pages.findOne(selector.pageId ? { _id: selector.pageId } : { slug: selector.slug });
  if (!cur) throw new Error(`softDeletePage: page not found for ${JSON.stringify(selector)}`);
  const version = await snapshotVersion(db, cur, `pre-delete: ${reason}`, author);
  await pages.updateOne({ _id: cur._id }, { $set: { deleted_at: new Date(), deleted_by: author, deletion_reason: reason, updated_at: new Date() } });
  await db.collection('book_audit').insertOne({ _id: uuidv4(), page_id: cur._id, slug: cur.slug, action: 'soft_delete', author, summary: reason, version_saved: version, blocked: false, at: new Date() });
  return { slug: cur.slug, version };
}

// ─── restorePageVersion — undo, also snapshots current first ────────────────
async function restorePageVersion(db, pageId, version, opts = {}) {
  const { author = 'script' } = opts;
  const versions = db.collection('book_page_versions');
  const pages = db.collection('book_pages');
  const snap = await versions.findOne({ page_id: pageId, version });
  if (!snap) throw new Error(`restorePageVersion: no version ${version} for page ${pageId}`);
  const cur = await pages.findOne({ _id: pageId });
  if (cur) {
    await snapshotVersion(db, cur, `pre-restore (restoring v${version})`, author);
    await pages.updateOne({ _id: pageId }, {
      $set: {
        blocks: snap.blocks, reading_time_min: computeReadingTime(snap.blocks),
        content_types: computeContentTypes(snap.blocks), deleted_at: null, updated_at: new Date(),
      },
      $unset: { deleted_by: '', deletion_reason: '' },
    });
  } else if (snap.doc) {
    // The page was hard-deleted — re-insert the full original document from the snapshot.
    const doc = { ...snap.doc, deleted_at: null, updated_at: new Date() };
    delete doc.deleted_by; delete doc.deletion_reason;
    await pages.insertOne(doc);
  } else {
    throw new Error(`restorePageVersion: page ${pageId} is gone and snapshot v${version} has no full doc to re-insert.`);
  }
  await db.collection('book_audit').insertOne({ _id: uuidv4(), page_id: pageId, slug: snap.slug, action: 'restore', author, summary: `restored v${version}`, blocked: false, at: new Date() });
  return { slug: snap.slug, restoredFrom: version };
}

async function listVersions(db, pageId) {
  return db.collection('book_page_versions').find({ page_id: pageId }).sort({ version: 1 })
    .project({ version: 1, title: 1, reading_time_min: 1, content_hash: 1, snapshot_at: 1, snapshot_reason: 1, author: 1 }).toArray();
}

// ─── withDb convenience ─────────────────────────────────────────────────────
async function withDb(fn) {
  const dotenv = require('dotenv');
  dotenv.config({ path: require('path').join(__dirname, '..', '..', '.env.local') });
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  try { return await fn(client.db('crucible')); }
  finally { await client.close(); }
}

module.exports = {
  flattenBlocks, computeReadingTime, computeContentTypes, hashBlocks,
  collectAssetRefs, collectBlockIds, diffPage, ensureIndexes, snapshotVersion,
  savePage, softDeletePage, restorePageVersion, listVersions, withDb,
};
