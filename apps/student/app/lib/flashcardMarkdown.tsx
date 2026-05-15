/**
 * Shared helpers for rendering flashcard markdown.
 *
 * Width syntax: `![alt|w=60%](url)` or `![alt|w=400](url)`
 *   - percent  → width: N%
 *   - bare num → width: Npx
 *   - no suffix → width: 100%
 */

import type { ComponentPropsWithoutRef } from 'react';
import type { Components } from 'react-markdown';

export interface ParsedAlt {
  alt: string;
  width: string | null;
}

export function parseAltWithWidth(raw: string | undefined | null): ParsedAlt {
  if (!raw) return { alt: '', width: null };
  const m = raw.match(/^(.*?)\|w=(\d+)(%?)$/);
  if (!m) return { alt: raw, width: null };
  const [, alt, num, pct] = m;
  return { alt, width: pct ? `${num}%` : `${num}px` };
}

/**
 * Rewrite a single `![alt](url)` occurrence in `text` — matched by `url` —
 * updating its alt to encode a new width (or stripping width if null).
 */
export function setImageWidthInText(
  text: string,
  url: string,
  width: string | null,
): string {
  // Escape regex metacharacters in url
  const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`!\\[([^\\]]*)\\]\\(${escapedUrl}\\)`);
  return text.replace(re, (_full, alt: string) => {
    const base = alt.replace(/\|w=\d+%?$/, '');
    if (!width) return `![${base}](${url})`;
    const token = width.endsWith('%') ? `w=${width.replace('%', '')}%` : `w=${width.replace('px', '')}`;
    return `![${base}|${token}](${url})`;
  });
}

/** All `![alt](url)` occurrences in `text`, in source order. */
export interface FoundImage {
  fullMatch: string;
  alt: string;
  url: string;
  width: string | null;
}

export function findImages(text: string): FoundImage[] {
  const out: FoundImage[] = [];
  const re = /!\[([^\]]*)\]\(([^)\s]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const [fullMatch, rawAlt, url] = m;
    const parsed = parseAltWithWidth(rawAlt);
    out.push({ fullMatch, alt: parsed.alt, url, width: parsed.width });
  }
  return out;
}

/** React-markdown `img` override that honours the `|w=NNN` alt suffix. */
function FlashcardImg({ alt, ...rest }: ComponentPropsWithoutRef<'img'>) {
  const parsed = parseAltWithWidth(alt);
  const style = parsed.width
    ? { display: 'block', marginTop: '1rem', width: parsed.width, maxWidth: '100%', height: 'auto' as const }
    : { display: 'block', marginTop: '1rem', maxWidth: '100%', height: 'auto' as const };
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img {...rest} alt={parsed.alt} style={style} />;
}

export const flashcardMarkdownComponents: Components = {
  img: FlashcardImg,
};
