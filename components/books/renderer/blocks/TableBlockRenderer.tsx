'use client';

import ReactMarkdown from 'react-markdown';
import { TableBlock } from '@/types/books';

export default function TableBlockRenderer({ block }: { block: TableBlock }) {
  const highlightSet = new Set(block.highlight_row ?? []);

  return (
    <figure className="my-4 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {block.headers.map((header, i) => (
              <th
                key={i}
                className="px-3 py-2 text-left text-xs font-semibold text-white/60 uppercase tracking-wide
                  bg-[#0B0F15] border border-white/10"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, ri) => (
            <tr
              key={ri}
              className={highlightSet.has(ri) ? 'bg-orange-500/10' : ri % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'}
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="px-3 py-2 text-white/80 border border-white/10 align-top"
                >
                  <ReactMarkdown components={{ p: 'span' }}>
                    {cell}
                  </ReactMarkdown>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {block.caption && (
        <figcaption className="mt-2 text-center text-sm text-white/50 italic">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}
