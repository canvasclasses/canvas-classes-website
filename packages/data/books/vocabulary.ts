import { ContentBlock } from '../types/books';
import { flattenBlocks } from './utils';

/**
 * Word Vault harvesting.
 *
 * The Word Vault is a book-wide spaced-repetition vocabulary deck. Rather than
 * maintaining a separate word list (which would drift from the authored
 * content), the deck is *derived* from the book's own pages: every
 * `vocabulary_lab` card and every tappable `narrated_passage` gloss is a
 * candidate vault word. This module is pure data — no I/O, no React — so it can
 * run inside a cacheable API route, on the client, or in a script.
 */

export interface VaultWord {
  /** Stable, deterministic id used as the SRS card key. `vault:<slug>`. */
  wordId: string;
  word: string;
  meaning: string;
  pos?: string;
  hindi?: string;
  example?: string;
  pronunciation?: string;
  /** Where the word was harvested from. */
  source: 'vocabulary_lab' | 'gloss';
  /** Provenance — lets the review UI link back to where the word was met. */
  chapterNumber?: number;
  pageSlug?: string;
}

export interface HarvestContext {
  chapterNumber?: number;
  pageSlug?: string;
}

/** Lowercase slug, alphanumerics + single hyphens. Dependency-free. */
export function slugifyWord(word: string): string {
  return word
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function wordIdFor(word: string): string {
  return `vault:${slugifyWord(word)}`;
}

/**
 * Harvest vault-word candidates from a single page's blocks. Sections are
 * flattened first so nested vocabulary/passage blocks are included.
 */
export function harvestVocabulary(
  blocks: ContentBlock[],
  ctx: HarvestContext = {}
): VaultWord[] {
  const out: VaultWord[] = [];
  for (const block of flattenBlocks(blocks)) {
    if (block.type === 'vocabulary_lab') {
      for (const card of block.cards ?? []) {
        if (!card.word || !card.meaning) continue;
        out.push({
          wordId: wordIdFor(card.word),
          word: card.word,
          meaning: card.meaning,
          pos: card.pos,
          hindi: card.hindi,
          example: card.example,
          pronunciation: card.pronunciation,
          source: 'vocabulary_lab',
          chapterNumber: ctx.chapterNumber,
          pageSlug: ctx.pageSlug,
        });
      }
    } else if (block.type === 'narrated_passage') {
      for (const para of block.paragraphs ?? []) {
        for (const sentence of para.sentences ?? []) {
          for (const gloss of sentence.glosses ?? []) {
            if (!gloss.word || !gloss.meaning) continue;
            out.push({
              wordId: wordIdFor(gloss.word),
              word: gloss.word,
              meaning: gloss.meaning,
              pos: gloss.pos,
              hindi: gloss.hindi,
              example: gloss.example,
              source: 'gloss',
              chapterNumber: ctx.chapterNumber,
              pageSlug: ctx.pageSlug,
            });
          }
        }
      }
    }
  }
  return out;
}

/**
 * Collapse duplicates by `wordId`, keeping the richest record (a
 * `vocabulary_lab` card — which carries pronunciation + a curated example —
 * wins over a passage gloss of the same word). Earliest provenance is kept.
 */
export function dedupeVaultWords(words: VaultWord[]): VaultWord[] {
  const byId = new Map<string, VaultWord>();
  for (const w of words) {
    const existing = byId.get(w.wordId);
    if (!existing) {
      byId.set(w.wordId, w);
      continue;
    }
    // Prefer the vocabulary_lab record; otherwise backfill any missing fields.
    const preferred = existing.source === 'vocabulary_lab' ? existing : w;
    const other = preferred === existing ? w : existing;
    byId.set(w.wordId, {
      ...preferred,
      pos: preferred.pos ?? other.pos,
      hindi: preferred.hindi ?? other.hindi,
      example: preferred.example ?? other.example,
      pronunciation: preferred.pronunciation ?? other.pronunciation,
      chapterNumber: existing.chapterNumber ?? w.chapterNumber,
      pageSlug: existing.pageSlug ?? w.pageSlug,
    });
  }
  return Array.from(byId.values());
}
