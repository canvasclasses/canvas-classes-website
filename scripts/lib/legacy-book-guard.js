'use strict';
/**
 * legacy-book-guard.js — refuse-to-run guard for pre-§0.6 book scripts.
 *
 * The scripts that require this module predate the content-protection gateway
 * (CLAUDE.md §0.6). They hard-delete `book_pages` directly (deleteOne /
 * deleteMany / $pull) with NO version snapshot, NO content-loss guard, and NO
 * audit entry. They were one-off authoring/setup scripts and have already run.
 *
 * Re-running one today would silently erase a live page — AND any founder edits
 * made to that content since the script last ran (teacher-voice passes,
 * content-protection restores, etc.). That is exactly the failure class that
 * caused the 2026-06-10 incident (a section + the founder's video, lost for 4
 * days). See _agents/brain/incidents.md.
 *
 * Requiring this module HALTS the script unless ALLOW_LEGACY_BOOK_SCRIPT=1 is
 * explicitly set, forcing an intentional opt-in. New book mutations MUST go
 * through scripts/lib/book-writer.js (savePage / softDeletePage), which
 * snapshots + guards + audits and never hard-deletes.
 */
if (process.env.ALLOW_LEGACY_BOOK_SCRIPT !== '1') {
  console.error(
    '\n⛔ Refusing to run a legacy destructive book script (CLAUDE.md §0.6).\n' +
    '   This script hard-deletes book_pages with no snapshot / guard / audit and\n' +
    '   would erase live content plus any edits made since it last ran.\n\n' +
    '   • For ANY book change, use scripts/lib/book-writer.js (savePage / softDeletePage).\n' +
    '   • Do NOT copy this script as a template — copy the gateway pattern instead.\n' +
    '   • If you truly must re-run this archived one-off, opt in explicitly:\n' +
    '       ALLOW_LEGACY_BOOK_SCRIPT=1 node <script>\n'
  );
  process.exit(1);
}
console.warn('⚠ ALLOW_LEGACY_BOOK_SCRIPT=1 — running a LEGACY destructive book script. Confirm you have a current backup (CLAUDE.md §0.6).');
