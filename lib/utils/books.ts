import { BlockType, ContentBlock } from '@/types/books';

/**
 * Recursively flattens section blocks into a flat array of leaf blocks.
 * Sections cannot nest, so this only goes one level deep.
 */
export function flattenBlocks(blocks: ContentBlock[]): ContentBlock[] {
  const result: ContentBlock[] = [];
  for (const block of blocks) {
    if (block.type === 'section') {
      for (const column of block.columns) {
        result.push(...column);
      }
    } else {
      result.push(block);
    }
  }
  return result;
}

/**
 * Estimates reading time in minutes from a page's block array.
 * Handles section blocks by flattening first.
 */
export function computeReadingTime(blocks: ContentBlock[]): number {
  const flat = flattenBlocks(blocks);
  let wordCount = 0;
  let videoCount = 0;
  let audioCount = 0;

  for (const block of flat) {
    if (block.type === 'text') wordCount += block.markdown.split(/\s+/).length;
    if (block.type === 'heading') wordCount += block.text.split(/\s+/).length;
    if (block.type === 'callout') wordCount += block.markdown.split(/\s+/).length;
    if (block.type === 'video') videoCount++;
    if (block.type === 'audio_note') audioCount++;
  }

  return Math.max(1, Math.ceil(wordCount / 200) + videoCount * 2 + audioCount * 1);
}

/** Block types worth surfacing as page-level content badges in the ToC. */
const INTERACTIVE_TYPES = new Set<BlockType>([
  'inline_quiz', 'simulation', 'video', 'molecule_3d', 'interactive_image',
  'classify_exercise', 'reasoning_prompt', 'worked_example', 'practice_link',
]);

/**
 * Returns a deduplicated, sorted list of "interesting" block types present on a
 * page. Used to show content-type icons (quiz, sim, video…) in the Table of
 * Contents without loading the full blocks payload.
 */
export function computeContentTypes(blocks: ContentBlock[]): BlockType[] {
  const flat = flattenBlocks(blocks);
  const found = new Set<BlockType>();
  for (const b of flat) {
    if (INTERACTIVE_TYPES.has(b.type)) found.add(b.type);
  }
  return [...found].sort();
}
