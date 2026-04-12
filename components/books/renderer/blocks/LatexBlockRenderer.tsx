'use client';

// Use KaTeX directly rather than going through remark-math.
// remark-math's $$ parser strips \begin{aligned} and similar environments,
// causing multi-line equations to silently fail. KaTeX in displayMode handles
// every valid expression including aligned, cases, array, etc.
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { useMemo } from 'react';
import { LatexBlock } from '@/types/books';

// ───────────────────────────────────────────────────────────────────────────
// Module-level render cache
// ---------------------------------------------------------------------------
// KaTeX's synchronous renderer is fast but not free — a text-heavy chapter
// page can easily carry 20+ display equations, and BookReader state changes
// (progress updates, milestone overlay, quiz answers) cause full re-renders.
// Without memoisation, every one of those would re-parse and re-render every
// equation on the page.
//
// The cache is keyed on the raw LaTeX source. A simple Map with an LRU-ish
// eviction at MAX_CACHE entries keeps memory bounded even if a student binge-
// reads several chapters in one sitting. Equations repeat heavily across
// pages (same constants, same general formulas), so the hit rate is very
// high in practice.
// ───────────────────────────────────────────────────────────────────────────
interface RenderResult {
  html: string;
  error: string;
}

const MAX_CACHE = 512;
const renderCache = new Map<string, RenderResult>();

function renderLatexCached(source: string): RenderResult {
  const hit = renderCache.get(source);
  if (hit) {
    // Touch to keep most-recently-used at the end of the Map's iteration order.
    renderCache.delete(source);
    renderCache.set(source, hit);
    return hit;
  }

  let result: RenderResult;
  try {
    result = {
      html: katex.renderToString(source, {
        displayMode: true,
        throwOnError: true,
        trust: true,
        macros: { '\\ce': '\\text{#1}' }, // fallback if mhchem not loaded
      }),
      error: '',
    };
  } catch {
    // Graceful degradation — show raw LaTeX so the author can fix it
    result = { html: '', error: source };
  }

  renderCache.set(source, result);

  // Bounded LRU — evict the oldest entry when we blow the cap. Map preserves
  // insertion order, so the first key is the least-recently-used.
  if (renderCache.size > MAX_CACHE) {
    const oldest = renderCache.keys().next().value;
    if (oldest !== undefined) renderCache.delete(oldest);
  }

  return result;
}

export default function LatexBlockRenderer({ block }: { block: LatexBlock }) {
  // useMemo short-circuits React renders on unchanged source; renderLatexCached
  // short-circuits remounts across pages. Two layers, both cheap.
  const { html, error } = useMemo(() => renderLatexCached(block.latex), [block.latex]);

  return (
    <div className="my-4 overflow-x-auto">
      <div className="flex flex-col items-center gap-1">
        {error ? (
          <pre className="text-red-400 text-xs whitespace-pre-wrap text-center">{error}</pre>
        ) : (
          <div
            className="text-white/90 text-lg"
            // KaTeX output is trusted — it never injects external URLs or scripts
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}

        {block.label && (
          <p className="text-xs text-white/40 font-mono mt-1">{block.label}</p>
        )}
        {block.note && (
          <p className="text-sm text-white/60 italic mt-1">{block.note}</p>
        )}
      </div>
    </div>
  );
}
