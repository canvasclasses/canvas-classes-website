'use client';

import { createContext, useContext } from 'react';

/**
 * §16 — chapter-wide figure/table reference map (`figure_key` → rendered label
 * like "Fig. 1.3"). Injected by PageRenderer from `page.figure_refs` (written by
 * the numbering finaliser), consumed where in-text `{fig:key}` tokens appear.
 * Empty default → tokens fall back to "the figure" (draft / pre-numbering state).
 */
export const FigureRefsContext = createContext<Record<string, string>>({});

export function FigureRefsProvider({
  value,
  children,
}: {
  value: Record<string, string>;
  children: React.ReactNode;
}) {
  return <FigureRefsContext.Provider value={value}>{children}</FigureRefsContext.Provider>;
}

export function useFigureRefs() {
  return useContext(FigureRefsContext);
}

/** Replace `{fig:key}` tokens in markdown with their resolved label. */
export function resolveFigureRefs(text: string, refs: Record<string, string>): string {
  if (!text || text.indexOf('{fig:') === -1) return text;
  return text.replace(/\{fig:([a-zA-Z0-9_-]+)\}/g, (_, k) => refs[k] ?? 'the figure');
}

/** The rendered label for a numbered block, e.g. "Fig. 1.3" / "Table 1.2" / "Eq. 1.5". */
export function figureLabel(blockType: string, figureNumber?: string): string | null {
  if (!figureNumber) return null;
  if (blockType === 'table') return `Table ${figureNumber}`;
  if (blockType === 'latex_block') return `Eq. ${figureNumber}`;
  return `Fig. ${figureNumber}`; // image, gallery
}

/** Shared figure/table caption: a bold "Fig. 1.3" label (when numbered) + caption. */
export function FigureCaption({
  blockType,
  figureNumber,
  caption,
  className = 'mt-2 text-center text-sm text-white/50 italic',
}: {
  blockType: string;
  figureNumber?: string;
  caption?: string;
  className?: string;
}) {
  const label = figureLabel(blockType, figureNumber);
  if (!label && !caption) return null;
  return (
    <figcaption className={className}>
      {label && <span className="font-semibold not-italic text-white/70">{label}</span>}
      {label && caption ? ' — ' : ''}
      {caption}
    </figcaption>
  );
}
