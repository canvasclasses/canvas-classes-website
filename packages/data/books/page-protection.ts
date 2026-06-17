import 'server-only';
import mongoose from 'mongoose';
import { randomUUID, createHash } from 'crypto';
import { computeReadingTime } from './utils';
import type { BookPage } from '../types/books';

/**
 * Content protection (CLAUDE.md §0.6) — app-side mirror of scripts/lib/book-writer.js.
 * `snapshotBookPageVersion` records the CURRENT state of a page into
 * `book_page_versions` before any admin-UI overwrite or soft-delete, so every
 * change is reversible (see scripts/lib/book-writer.js `restorePageVersion`).
 * Apps cannot import the scripts/ CommonJS writer, hence this shared TS helper.
 */

const ASSET_KEYS = new Set(['src', 'url', 'audio_url', 'portrait_src', 'poster', 'image_src']);

function collectAssetRefs(node: unknown, acc = new Set<string>()): Set<string> {
  if (!node) return acc;
  if (Array.isArray(node)) { for (const x of node) collectAssetRefs(x, acc); return acc; }
  if (typeof node === 'object') {
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      if (ASSET_KEYS.has(k) && typeof v === 'string' && v.trim()) acc.add(v.trim());
      else collectAssetRefs(v, acc);
    }
  }
  return acc;
}

function stableStringify(v: unknown): string {
  if (Array.isArray(v)) return '[' + v.map(stableStringify).join(',') + ']';
  if (v && typeof v === 'object') {
    return '{' + Object.keys(v as Record<string, unknown>).sort()
      .map((k) => JSON.stringify(k) + ':' + stableStringify((v as Record<string, unknown>)[k])).join(',') + '}';
  }
  return JSON.stringify(v);
}

function hashBlocks(blocks: unknown): string {
  return createHash('sha256').update(stableStringify(blocks ?? [])).digest('hex');
}

type SnapshotablePage = Pick<BookPage, '_id' | 'title' | 'slug' | 'blocks' | 'reading_time_min' | 'deleted_at'> &
  Record<string, unknown>;

/**
 * Snapshot the page's current state into `book_page_versions`. Idempotent: if the
 * latest version already has the same content hash, nothing is written (returns null).
 * Returns the new version number when a snapshot is created.
 */
export async function snapshotBookPageVersion(
  page: SnapshotablePage,
  reason: string,
  author: string,
): Promise<number | null> {
  const db = mongoose.connection.db;
  if (!db) throw new Error('snapshotBookPageVersion: no active mongo connection');
  // Our _ids are UUID strings, not ObjectIds — type the collection accordingly.
  const versions = db.collection<{ _id: string; page_id: string; version: number; content_hash: string; [k: string]: unknown }>('book_page_versions');
  const hash = hashBlocks(page.blocks ?? []);
  const latest = await versions.find({ page_id: page._id }).sort({ version: -1 }).limit(1).toArray();
  if (latest[0]?.content_hash === hash) return null; // no change since last version
  const version = ((latest[0]?.version as number) ?? 0) + 1;
  await versions.insertOne({
    _id: randomUUID(),
    page_id: page._id,
    version,
    title: page.title,
    slug: page.slug,
    blocks: page.blocks ?? [],
    content_hash: hash,
    asset_refs: [...collectAssetRefs(page.blocks ?? [])],
    reading_time_min: page.reading_time_min ?? computeReadingTime((page.blocks ?? []) as never),
    deleted_at: page.deleted_at ?? null,
    doc: page, // full document — supports re-insert after a hard delete
    snapshot_at: new Date(),
    snapshot_reason: reason,
    author,
  });
  return version;
}
