// Build-time data loader for the JEE Main PYQ SEO route.
//
// Reads JSON files synchronously off disk during SSG. No runtime DB calls;
// no client-side network. The export script (scripts/export_jee_main_pyqs.js)
// regenerates these files from MongoDB; re-run it after changes upstream.

import fs from 'node:fs';
import path from 'node:path';
import type {
    JmpChapterData,
    JmpChapterMeta,
    JmpManifest,
    JmpQuestion,
} from './types';

const DATA_DIR = path.join(process.cwd(), 'app', 'lib', 'jee-main-pyqs', 'data');

let _manifest: JmpManifest | null = null;
const _chapterCache = new Map<string, JmpChapterData>();

export function getManifest(): JmpManifest {
    if (_manifest) return _manifest;
    const text = fs.readFileSync(path.join(DATA_DIR, 'manifest.json'), 'utf8');
    _manifest = JSON.parse(text) as JmpManifest;
    return _manifest;
}

export function getChapters(): JmpChapterMeta[] {
    return getManifest().chapters;
}

export function getActiveChapters(): JmpChapterMeta[] {
    // Chapters with at least one question — empty chapters get excluded
    // from hub listings but their JSON files still exist for completeness.
    return getChapters().filter((c) => c.questionCount > 0);
}

export function getChapterBySlug(slug: string): JmpChapterMeta | null {
    return getManifest().chapters.find((c) => c.slug === slug) ?? null;
}

export function getChapterById(id: string): JmpChapterMeta | null {
    return getManifest().chapters.find((c) => c.id === id) ?? null;
}

export function getChapterData(chapterId: string): JmpChapterData {
    const cached = _chapterCache.get(chapterId);
    if (cached) return cached;
    const text = fs.readFileSync(path.join(DATA_DIR, `${chapterId}.json`), 'utf8');
    const data = JSON.parse(text) as JmpChapterData;
    _chapterCache.set(chapterId, data);
    return data;
}

export function getChapterQuestions(chapterId: string): JmpQuestion[] {
    return getChapterData(chapterId).questions;
}

export function getQuestion(chapterId: string, slug: string): JmpQuestion | null {
    const data = getChapterData(chapterId);
    return data.questions.find((q) => q.slug === slug) ?? null;
}

/**
 * Pick `limit` questions from the same chapter, excluding the current one.
 * Prefers questions with the same primary tag, then falls back to chapter siblings.
 */
export function getRelatedQuestions(
    chapterId: string,
    currentSlug: string,
    primaryTag: string | null,
    limit = 5
): JmpQuestion[] {
    const all = getChapterQuestions(chapterId).filter((q) => q.slug !== currentSlug);
    const sameTag = primaryTag ? all.filter((q) => q.primaryTag === primaryTag) : [];
    const picks: JmpQuestion[] = [];
    const seen = new Set<string>();
    for (const q of sameTag) {
        if (picks.length >= limit) break;
        picks.push(q);
        seen.add(q.slug);
    }
    if (picks.length < limit) {
        for (const q of all) {
            if (picks.length >= limit) break;
            if (seen.has(q.slug)) continue;
            picks.push(q);
        }
    }
    return picks;
}
