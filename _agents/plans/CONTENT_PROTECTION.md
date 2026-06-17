# Live Book Content Protection

> **Status:** 🟡 Phases 1 + 1.5 SHIPPED (version history + content-loss guard + soft-delete across scripts AND the admin UI) · **Last updated:** 2026-06-14
> **Done:** `scripts/lib/book-writer.js` gateway; `book_page_versions` + `book_audit`; baseline snapshot of all 672 pages (full doc); CLAUDE.md §0.6 + workflow rule; guard self-tested. **Phase 1.5:** soft-delete query middleware on `BookPage` + `Book` models (one place hides deleted content from every read); shared `@canvas/data/books/page-protection.ts` snapshot helper; admin page DELETE → soft-delete+snapshot, page PUT → snapshot-before-overwrite, book DELETE → soft-delete pages+book. Both apps typecheck clean; verified all 672 pages stay visible.
> **Pending:** asset registry; structural blueprint + daily watchdog; scheduled DB+R2 backups; dry-run/digest; make the unique indexes partial on `deleted_at:null`.
> **Blocked on:** —
> **Next action:** Phase 2 — asset registry (`book_assets`) + orphan/broken-link detection.

## Why this exists

Live Book content (pages/blocks + their video/audio/image assets in `book_pages` + R2) is founder-authored, irreplaceable, and **invisible to routine review**. On **2026-06-10** a "dedup/restructure" script silently **hard-deleted the Classification-of-Matter section and the founder's recorded video** (`20ad8d18…_Classification_of_Matter.mp4`); it went unnoticed until **2026-06-14**. Root cause: content is edited by one-off scripts that hit Mongo directly with `updateOne`/`deleteOne` — no version history, no guard, no audit, no alert. At the coming scale (thousands of videos, lakhs of images) this is unacceptable.

## The 6-layer system (publishing-grade)

| Layer | Guarantee | Status |
|---|---|---|
| **1. Version history + soft-delete** | Nothing is ever truly deleted; every page keeps full prior versions; restore anytime. | ✅ Phase 1 + 1.5 (scripts + admin UI) |
| **2. Content-loss guard (single gateway)** | A removal of a block/asset/page, or a sharp shrink, is **blocked** unless founder-approved (`allowContentLoss` + reason). | ✅ Phase 1 (scripts); admin UI uses soft-delete + version snapshot |
| **3. Asset registry + referential integrity** | Every video/image catalogued + back-referenced; orphan + broken-link detection; find any asset by query, not by digging. | ⬜ Phase 2 |
| **4. Structural blueprint + daily watchdog** | Founder-approved per-chapter blueprint; a daily diff alerts (Telegram/email) on any unapproved drift. | ⬜ Phase 2 |
| **5. Scheduled backups (DB + R2)** | Off-copy, versioned, restorable; written runbook. (`mongodb-backup.ts` / `r2-backup.ts` exist — need schedule + retention + R2 object-versioning.) | ⬜ Phase 3 |
| **6. Change visibility** | Scripts dry-run by default; weekly "what changed" digest. | ⬜ Phase 3 |

**Honest limit:** while scripts hold DB write credentials, a buggy script *could* still bypass the gateway. The end-state lock is to remove direct write-credentials from scripts and force all writes through the guarded API (mirrors the deferred Phase 5.5d DB split). Until then, Layers 1 + 4 are the recovery + detection net.

## Phase 1 — what shipped (2026-06-14)

- **`scripts/lib/book-writer.js`** — the ONLY sanctioned mutation gateway. API: `savePage(db, {slug|pageId}, newBlocks, opts)`, `softDeletePage`, `restorePageVersion`, `listVersions`, `diffPage`, `withDb`, plus the shared block helpers. Every save snapshots the prior version (full doc), runs the guard, writes a `book_audit` row. `dryRun: true` previews the diff + `wouldBlock` without writing.
- **Content-loss guard** flags: any removed block id, any unlinked asset URL (`src`/`url`/`audio_url`/`portrait_src`, deep-scanned), or a >25% reading-time drop. Blocked unless `{ allowContentLoss: true, lossReason }`.
- **Collections:** `book_page_versions` (full history incl. full `doc` for hard-delete recovery) and `book_audit` (every save/delete/restore + blocked attempts).
- **Baseline:** `scripts/snapshot-all-book-pages.js` snapshotted **all 672 pages** as version 1 — every page as-of-2026-06-14 is restorable.
- **Rule:** CLAUDE.md **§0.6** + a block at the top of `BOOK_PAGE_WORKFLOW.md` — no hard-deletes / silent drops; all mutations via the gateway; removal = soft-delete; R2 files never deleted on block removal; ask the founder before any removal.

### How new book scripts MUST write content (from `scripts/`)
```js
const bw = require('./lib/book-writer');
await bw.withDb(async (db) => {
  // preview first:
  console.log(await bw.savePage(db, { slug: 'scientific-measurement' }, newBlocks, { dryRun: true }));
  // then apply (non-destructive change):
  await bw.savePage(db, { slug: 'scientific-measurement' }, newBlocks,
    { author: 'agent', summary: 'add pressure section' });
});
// Removing content (only with founder consent given this session):
//   bw.savePage(db, sel, blocks, { allowContentLoss: true, lossReason: 'founder approved 2026-06-14: merged dup page' })
//   bw.softDeletePage(db, { slug }, { reason: 'founder approved …' })
//   bw.restorePageVersion(db, pageId, version)   // undo
```

## Phase 1.5 — what shipped (2026-06-14)

- **Soft-delete query middleware** on `packages/data/models/BookPage.ts` and `Book.ts`: every read/update auto-excludes `deleted_at != null` (bypass with `.setOptions({ includeDeleted: true })`). One place protects all ~15 read sites across both apps — no per-query edits to miss. Existing pages (no `deleted_at` field) stay visible because Mongo treats missing == null. Soft-delete fields added to the schemas + the `BookPage`/`Book` types.
- **`packages/data/books/page-protection.ts`** — `snapshotBookPageVersion(page, reason, author)` (apps can't import the `scripts/` CJS writer). Writes to `book_page_versions`, deduped by content hash, stores the full doc.
- **Admin routes converted:** page `DELETE` → snapshot + set `deleted_at` (was `findOneAndDelete`); page `PUT` → snapshot current state before overwrite (edit history); book `DELETE` → snapshot every page + soft-delete pages and book (was `deleteMany`/`deleteOne`).
- Both apps `tsc --noEmit` clean; verified all 672 pages remain visible.

### Known remaining gaps (later phases)

- **Unique indexes are not partial** on `deleted_at:null` — recreating a page with the same `(book_id, slug)` as a soft-deleted one would collide; restore the old page instead. (Phase-2 follow-up: partial indexes.)
- **No restore UI yet** — soft-deleted pages vanish from the admin sidebar; restore is via `scripts/lib/book-writer.js restorePageVersion` (Phase-2: a "trash" view).
- No asset registry, blueprint watchdog, scheduled backups, or alerting yet (Phases 2–3).
