'use strict';
/**
 * restore-helper.js — one-command recovery for a content-guard finding.
 *
 * Wraps the sanctioned gateway's restorePageVersion (scripts/lib/book-writer.js),
 * which snapshots the CURRENT page first, then restores the chosen version —
 * so a restore is itself reversible and audited. This is the RECOVERY path, the
 * opposite of a destructive op: it only ever brings content BACK.
 *
 * USAGE:  node scripts/watchdogs/restore-helper.js <pageId> <version>
 *         node scripts/watchdogs/restore-helper.js <pageId> --list   # show versions first
 *
 * Always review the version list / the diff before restoring.
 */
const bw = require('../lib/book-writer');

const [, , pageId, arg] = process.argv;
if (!pageId) { console.error('usage: node scripts/watchdogs/restore-helper.js <pageId> <version|--list>'); process.exit(1); }

bw.withDb(async (db) => {
  if (!arg || arg === '--list') {
    const vs = await bw.listVersions(db, pageId);
    if (!vs.length) { console.log(`No snapshots for page ${pageId}.`); return; }
    console.log(`Versions for page ${pageId}:`);
    for (const v of vs) console.log(`  v${v.version}  ${v.snapshot_at ? new Date(v.snapshot_at).toISOString() : ''}  ${v.reading_time_min || '?'}min  — ${v.snapshot_reason || ''}`);
    console.log('\nRestore with: node scripts/watchdogs/restore-helper.js ' + pageId + ' <version>');
    return;
  }
  const version = Number(arg);
  if (!Number.isInteger(version)) { console.error('version must be an integer'); process.exit(1); }
  const res = await bw.restorePageVersion(db, pageId, version, { author: 'content-guard-restore' });
  console.log(`✓ Restored [${res.slug}] from v${res.restoredFrom}. The pre-restore state was snapshotted first (reversible).`);
}).catch((e) => { console.error('restore failed:', e.message); process.exit(2); });
