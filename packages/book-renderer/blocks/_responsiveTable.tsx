'use client';

/**
 * _responsiveTable.tsx
 * --------------------
 * A GFM table that reads as a normal `<table>` when there's room and as a
 * stack of label:value cards when there isn't — never a horizontally-
 * scrolling table. Content tables (node-counting rules, filling-order tables,
 * etc.) tend to have more columns than a narrow space can hold; scrolling a
 * data table to read it is bad UX, and shrinking font/padding only delays the
 * same problem.
 *
 * USES CONTAINER QUERIES (Tailwind v4 built-in `@container`/`@lg:`), NOT
 * viewport breakpoints (`sm:`). This callout can render in two very different
 * places on the same page at the same viewport width: inline in the ~912px
 * main reading column, or pulled into PageRenderer's persistent xl+ sidebar
 * rail, which is a fixed ~260px wide regardless of how wide the browser
 * window is. A viewport media query can't tell those apart — on any normal
 * desktop window `sm:` (640px viewport) is always satisfied, so the full
 * desktop `<table>` rendered inside that 260px rail just overflowed/clipped
 * (an earlier version of this file did exactly that). A container query asks
 * "how wide is MY container," which is the only question that's actually
 * correct in both places — the rail is always narrow and gets the card
 * layout; the main column gets the real table once it's wide enough.
 *
 * USAGE — inside a component that renders `block.markdown` via ReactMarkdown:
 *
 *   const tableHeaders = useMemo(() => extractGfmTableHeaders(block.markdown), [block.markdown]);
 *   const tableComponents = useMemo(() => buildResponsiveTableComponents(tableHeaders), [tableHeaders]);
 *   <ReactMarkdown components={{ ...otherComponents, ...tableComponents }}>{block.markdown}</ReactMarkdown>
 *
 * HOW IT WORKS: react-markdown's default table override receives the already
 * rendered `<thead>`/`<tbody>` React subtree as `children` — by then there's no
 * clean way to know a cell's column header. Rather than reach into katex-
 * transformed HAST (which would pick up katex's redundant accessibility/
 * annotation layers and mangle labels like "$n$"), we parse the column headers
 * straight from the raw markdown source ONCE per render. Column headers with
 * inline `$math$` have the dollar signs stripped for the mobile label (e.g.
 * "$n + l$" -> "n + l") — a minor, acceptable simplification since labels are
 * short.
 *
 * Cells still don't carry their column index by default, so `tr` resets a
 * closure-scoped counter before its children render, and `td` reads-and-
 * increments it. This relies on React invoking sibling elements in document
 * order during a synchronous render pass, which holds here (no Suspense
 * boundary inside a table). `table` advances a similar counter so multiple
 * tables in one markdown block each get their own header set, in order.
 */

import { type ReactNode } from 'react';

/** Parses `| a | b |` header rows immediately followed by a `|---|---|` rule. */
export function extractGfmTableHeaders(markdown: string): string[][] {
  const lines = markdown.split('\n');
  const separatorRe = /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?$/;
  const headers: string[][] = [];
  for (let i = 0; i < lines.length - 1; i++) {
    const headerLine = lines[i].trim();
    const sepLine = lines[i + 1].trim();
    if (headerLine.startsWith('|') && separatorRe.test(sepLine)) {
      const cells = headerLine
        .split('|')
        .slice(1, -1)
        .map((c) => c.trim().replace(/\$(.*?)\$/g, '$1'));
      headers.push(cells);
    }
  }
  return headers;
}

export function buildResponsiveTableComponents(allHeaders: string[][]) {
  let tableIndex = 0;
  let currentHeaders: string[] = [];
  let colCounter = 0;

  return {
    table: ({ children }: { children?: ReactNode }) => {
      currentHeaders = allHeaders[tableIndex++] ?? [];
      return (
        // Bug fix: the outer wrapper was `overflow-hidden`, which — on wide-
        // enough screens that the mobile card layout doesn't kick in — SILENTLY
        // CLIPS content that's still too wide for the container instead of
        // letting it scroll, cutting text off mid-word with no scrollbar at
        // all. The inner overflow-x-auto div (matching TextBlockRenderer's
        // table) is the real safety net; overflow-hidden on the outer div is
        // only for rounding the corners.
        <div className="@container my-4 rounded-xl overflow-hidden border border-white/10 bg-[#0d1320]">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px] @lg:text-[14px] border-collapse block @lg:table">
              {children}
            </table>
          </div>
        </div>
      );
    },
    // Hidden below the @lg container threshold — the card layout shows labels
    // inline per cell instead.
    thead: ({ children }: { children?: ReactNode }) => (
      <thead className="hidden @lg:table-header-group bg-[#151e32] border-b border-white/10">
        {children}
      </thead>
    ),
    tbody: ({ children }: { children?: ReactNode }) => (
      <tbody className="block @lg:table-row-group">{children}</tbody>
    ),
    tr: ({ children }: { children?: ReactNode }) => {
      colCounter = 0; // reset before this row's cells render (see module doc)
      return (
        <tr className="block @lg:table-row mb-3 last:mb-0 @lg:mb-0 rounded-lg @lg:rounded-none border @lg:border-0 border-white/10 bg-white/[0.02] @lg:bg-transparent @lg:border-b @lg:border-white/[0.06] last:@lg:border-0">
          {children}
        </tr>
      );
    },
    th: ({ children }: { children?: ReactNode }) => (
      <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-white/55 whitespace-nowrap">
        {children}
      </th>
    ),
    td: ({ children }: { children?: ReactNode }) => {
      const isFirstCol = colCounter === 0;
      const label = currentHeaders[colCounter++] ?? '';
      return (
        <td className="flex @lg:table-cell justify-between @lg:justify-start items-baseline gap-3 px-3 py-2 @lg:px-4 @lg:py-2.5 border-b @lg:border-0 border-white/[0.06] last:border-0 text-[13px] @lg:text-[14px] text-white/82">
          {label && (
            <span className="@lg:hidden shrink-0 text-[10px] font-semibold uppercase tracking-wide text-white/45">
              {label}
            </span>
          )}
          {/* First column reads as the row's identity (matches TextBlockRenderer's
              table styling) — bold in the card layout always, and at @lg only
              since @lg:font-normal below cancels it back for columns 2+ there too. */}
          <span className={`text-right @lg:text-left ${isFirstCol ? 'font-semibold text-white/90' : '@lg:font-normal'}`}>
            {children}
          </span>
        </td>
      );
    },
  };
}
