'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import 'katex/contrib/mhchem';
import { TableBlock } from '@/types/books';

// Cell content — supports inline markdown + LaTeX
function CellContent({ text }: { text: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        p: ({ children }) => <span>{children}</span>,
        strong: ({ children }) => (
          <strong className="font-semibold text-amber-200">{children}</strong>
        ),
        em: ({ children }) => <em className="italic text-white/65">{children}</em>,
        code: ({ children }) => (
          <code className="bg-white/10 px-1 rounded text-[12px] text-amber-300 font-mono">
            {children}
          </code>
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  );
}

export default function TableBlockRenderer({ block }: { block: TableBlock }) {
  const highlightSet = new Set(block.highlight_row ?? []);

  return (
    <figure className="my-6">
      {block.caption && (
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-white/35 mb-3 select-none">
          {block.caption}
        </p>
      )}

      {/* Outer wrapper — rounded card with subtle border */}
      <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0d1320]">
        <div className="overflow-x-auto">
          <table className="w-full text-[14px] border-collapse">

            {/* Header */}
            <thead>
              <tr className="bg-[#151e32] border-b border-white/10">
                {block.headers.map((header, i) => (
                  <th
                    key={i}
                    className={`
                      px-5 py-3.5 text-left font-semibold tracking-wide whitespace-nowrap
                      ${i === 0
                        ? 'text-sky-300 text-[13px]'
                        : 'text-white/55 text-[11px] uppercase tracking-[0.08em]'
                      }
                    `}
                  >
                    <CellContent text={header} />
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {block.rows.map((row, ri) => {
                const isHighlighted = highlightSet.has(ri);
                const isLast = ri === block.rows.length - 1;

                return (
                  <tr
                    key={ri}
                    className={`
                      group transition-colors
                      ${isHighlighted
                        ? 'bg-orange-500/10 hover:bg-orange-500/15'
                        : ri % 2 === 0
                          ? 'bg-transparent hover:bg-white/[0.03]'
                          : 'bg-white/[0.025] hover:bg-white/[0.05]'
                      }
                      ${!isLast ? 'border-b border-white/[0.06]' : ''}
                    `}
                  >
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className={`
                          px-5 py-3.5 align-middle leading-[1.55]
                          ${ci === 0
                            ? 'font-semibold text-white/90 min-w-[80px]'
                            : 'text-white/72'
                          }
                          ${isHighlighted && ci === 0 ? 'text-orange-300' : ''}
                        `}
                      >
                        <CellContent text={cell} />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      </div>
    </figure>
  );
}
