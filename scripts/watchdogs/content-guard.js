'use strict';
/**
 * content-guard.js — Layer-A watchdog #1 (AI-native supervisory layer).
 *
 * WHAT IT CATCHES: the 2026-06-10 failure class — a Live Book page that lost a
 * section, a video/audio/image, or got deleted, WITHOUT going through the
 * sanctioned gateway (scripts/lib/book-writer.js) and so with NO snapshot/audit.
 *
 * HOW: every page is snapshotted by the gateway (a baseline of all pages exists
 * from 2026-06-14, plus a pre-write snapshot on every gateway save). This
 * watchdog compares each LIVE page to its LATEST snapshot and classifies any
 * content loss as:
 *   • TRACKED   — the loss is explained by a matching book_audit row whose
 *                 version_saved == the latest snapshot version (founder gave
 *                 consent via allowContentLoss + lossReason). Reported as 🟡.
 *   • UNTRACKED — content shrank / blocks or assets vanished / the page is gone,
 *                 with NO audit row covering it. This is the June-10 signature.
 *                 Reported as 🔴 with the exact restore command.
 *
 * READ-ONLY. It connects, reads, reports. It never writes to the DB, never
 * touches R2, never mutates a page (AI_NATIVE_ROADMAP §5.1: watchdogs report).
 *
 * RUN:   node scripts/watchdogs/content-guard.js            # human-readable report
 *        node scripts/watchdogs/content-guard.js --json     # machine-readable
 * EXIT:  2 if any 🔴 untracked loss, 1 if only 🟡 warnings, 0 if all clean
 *        (so a scheduler / the founder advisor can alert on a non-zero exit).
 */
const bw = require('../lib/book-writer');

const asJson = process.argv.includes('--json');

function summarizeDiff(diff) {
  return diff.reasons.join('; ');
}

async function run() {
  return bw.withDb(async (db) => {
    const pages = db.collection('book_pages');
    const versions = db.collection('book_page_versions');
    const audit = db.collection('book_audit');

    // Latest snapshot per page (one doc per page_id, highest version).
    const latestSnaps = await versions.aggregate([
      { $sort: { page_id: 1, version: -1 } },
      { $group: {
          _id: '$page_id',
          version: { $first: '$version' },
          blocks: { $first: '$blocks' },
          content_hash: { $first: '$content_hash' },
          slug: { $first: '$slug' },
          title: { $first: '$title' },
          snapshot_at: { $first: '$snapshot_at' },
        } },
    ], { allowDiskUse: true }).toArray();

    // All current pages, keyed by _id.
    const curList = await pages.find({}, {
      projection: { _id: 1, slug: 1, title: 1, blocks: 1, deleted_at: 1, deletion_reason: 1, book_id: 1 },
    }).toArray();
    const curById = new Map(curList.map((p) => [String(p._id), p]));
    const snapPageIds = new Set(latestSnaps.map((s) => String(s._id)));

    const red = [];   // untracked content loss / unexplained disappearance
    const amber = []; // tracked (approved) loss, or currently soft-deleted
    let cleanCount = 0;

    for (const snap of latestSnaps) {
      const pid = String(snap._id);
      const cur = curById.get(pid);

      // (1) Page is gone from the collection entirely → hard-deleted.
      if (!cur) {
        const restorable = !!(await versions.findOne({ page_id: snap._id, version: snap.version }, { projection: { _id: 1 } }));
        red.push({
          kind: 'page_hard_deleted', slug: snap.slug, title: snap.title, page_id: pid,
          detail: `page no longer exists in book_pages (last snapshot v${snap.version})`,
          restore: restorable ? `node scripts/watchdogs/restore-helper.js ${pid} ${snap.version}` : '(no full-doc snapshot — escalate)',
        });
        continue;
      }

      // (2) Page currently soft-deleted → recoverable; report as amber for visibility.
      if (cur.deleted_at) {
        amber.push({
          kind: 'page_soft_deleted', slug: cur.slug, title: cur.title, page_id: pid,
          detail: `soft-deleted${cur.deletion_reason ? ` — reason: ${cur.deletion_reason}` : ''}`,
        });
        continue;
      }

      // (3) Cheap check: if the content hash matches the snapshot, nothing changed.
      if (snap.content_hash && bw.hashBlocks(cur.blocks || []) === snap.content_hash) {
        cleanCount++;
        continue;
      }

      // Content differs → diff against the snapshot.
      const diff = bw.diffPage(snap.blocks || [], cur.blocks || []);
      if (!diff.lossDetected) { cleanCount++; continue; } // grew or neutral change — fine

      // Loss detected. Is there an audit row explaining it (gateway-tracked)?
      const auditRow = await audit.findOne({ page_id: snap._id, version_saved: snap.version, action: 'save' });
      if (auditRow) {
        amber.push({
          kind: 'tracked_content_reduction', slug: cur.slug, title: cur.title, page_id: pid,
          detail: summarizeDiff(diff),
          approved_by: auditRow.author || 'unknown',
          loss_reason: auditRow.loss_reason || (auditRow.content_loss ? '(content_loss flag set, no reason text)' : '(reduction, not flagged as loss)'),
        });
      } else {
        red.push({
          kind: 'untracked_content_loss', slug: cur.slug, title: cur.title, page_id: pid,
          detail: summarizeDiff(diff),
          note: 'no book_audit row covers this change — it bypassed the gateway (June-10 signature)',
          restore: `node scripts/watchdogs/restore-helper.js ${pid} ${snap.version}  # review the diff first`,
        });
      }
    }

    // (4) Live pages with no snapshot at all → cannot be drift-checked.
    const unmonitored = curList
      .filter((p) => !snapPageIds.has(String(p._id)) && !p.deleted_at)
      .map((p) => ({ slug: p.slug, title: p.title, page_id: String(p._id) }));

    return {
      name: 'content-guard',
      severity: red.length ? 2 : amber.length ? 1 : 0,
      headline: red.length ? `${red.length} untracked content loss` : amber.length ? `${amber.length} tracked/soft-deleted page(s)` : 'no content loss vs snapshots',
      generated_at: new Date().toISOString(),
      totals: {
        pages_live: curList.filter((p) => !p.deleted_at).length,
        snapshots_tracked: latestSnaps.length,
        clean: cleanCount,
        red: red.length,
        amber: amber.length,
        unmonitored: unmonitored.length,
      },
      red, amber, unmonitored,
    };
  });
}

function printReport(r) {
  const L = console.log;
  L('\n=== Content-guard watchdog — ' + r.generated_at + ' ===');
  L(`pages live: ${r.totals.pages_live} · snapshots: ${r.totals.snapshots_tracked} · clean: ${r.totals.clean} · 🔴 ${r.totals.red} · 🟡 ${r.totals.amber} · unmonitored: ${r.totals.unmonitored}\n`);

  if (r.red.length) {
    L('🔴 UNTRACKED CONTENT LOSS — needs founder attention now:');
    for (const x of r.red) {
      L(`  • [${x.slug}] ${x.title || ''}`);
      L(`      ${x.detail}`);
      if (x.note) L(`      ${x.note}`);
      if (x.restore) L(`      restore: ${x.restore}`);
    }
    L('');
  }
  if (r.amber.length) {
    L('🟡 Tracked / expected (review, not urgent):');
    for (const x of r.amber) {
      const tag = x.kind === 'page_soft_deleted' ? 'soft-deleted' : x.kind === 'tracked_content_reduction' ? `approved reduction by ${x.approved_by}` : x.kind;
      L(`  • [${x.slug}] ${tag} — ${x.detail}${x.loss_reason ? ` (reason: ${x.loss_reason})` : ''}`);
    }
    L('');
  }
  if (r.unmonitored.length) {
    L(`ℹ️  ${r.unmonitored.length} live page(s) have NO snapshot yet (created/edited outside the gateway since the baseline) — not drift-checkable until they pass through book-writer.js once. First few:`);
    for (const x of r.unmonitored.slice(0, 10)) L(`  • [${x.slug}] ${x.title || ''}`);
    if (r.unmonitored.length > 10) L(`  …and ${r.unmonitored.length - 10} more`);
    L('');
  }
  if (!r.red.length && !r.amber.length) L('✅ No content loss detected against snapshots.\n');
}

run()
  .then((r) => {
    if (asJson) console.log(JSON.stringify(r, null, 2));
    else printReport(r);
    process.exit(r.red.length ? 2 : r.amber.length ? 1 : 0);
  })
  .catch((e) => {
    console.error('content-guard failed:', e.message);
    process.exit(3);
  });
