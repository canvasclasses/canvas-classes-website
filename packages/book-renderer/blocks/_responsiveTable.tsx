'use client';

/**
 * _responsiveTable.tsx
 * --------------------
 * A GFM table that reads as a normal `<table>` on desktop and as a stack of
 * label:value cards on mobile — never a horizontally-scrolling table. Content
 * tables (node-counting rules, filling-order tables, etc.) tend to have more
 * columns than a narrow phone screen can hold; scrolling a data table to read
 * it is bad UX, and shrinking font/padding only delays the same problem.
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
        <div className="my-4 rounded-xl overflow-hidden border border-white/10 bg-[#0d1320]">
          <table className="w-full text-[13px] sm:text-[14px] border-collapse block sm:table">
            {children}
          </table>
        </div>
      );
    },
    // Hidden on mobile — the card layout shows labels inline per cell instead.
    thead: ({ children }: { children?: ReactNode }) => (
      <thead className="hidden sm:table-header-group bg-[#151e32] border-b border-white/10">
        {children}
      </thead>
    ),
    tbody: ({ children }: { children?: ReactNode }) => (
      <tbody className="block sm:table-row-group">{children}</tbody>
    ),
    tr: ({ children }: { children?: ReactNode }) => {
      colCounter = 0; // reset before this row's cells render (see module doc)
      return (
        <tr className="block sm:table-row mb-3 last:mb-0 sm:mb-0 rounded-lg sm:rounded-none border sm:border-0 border-white/10 bg-white/[0.02] sm:bg-transparent sm:border-b sm:border-white/[0.06] last:sm:border-0">
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
        <td className="flex sm:table-cell justify-between sm:justify-start items-baseline gap-3 px-3 py-2 sm:px-4 sm:py-2.5 border-b sm:border-0 border-white/[0.06] last:border-0 text-[13px] sm:text-[14px] text-white/82">
          {label && (
            <span className="sm:hidden shrink-0 text-[10px] font-semibold uppercase tracking-wide text-white/45">
              {label}
            </span>
          )}
          {/* First column reads as the row's identity (matches TextBlockRenderer's
              table styling) — bold on mobile always, and on desktop only since
              sm:font-normal below cancels it back for columns 2+ there too. */}
          <span className={`text-right sm:text-left ${isFirstCol ? 'font-semibold text-white/90' : 'sm:font-normal'}`}>
            {children}
          </span>
        </td>
      );
    },
  };
}
