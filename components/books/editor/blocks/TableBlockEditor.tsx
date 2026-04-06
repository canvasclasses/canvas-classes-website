'use client';

import { TableBlock } from '@/types/books';
import { Plus, Trash2 } from 'lucide-react';

interface Props { block: TableBlock; onChange: (p: Partial<TableBlock>) => void; }

export default function TableBlockEditor({ block, onChange }: Props) {
  function updateHeader(i: number, v: string) {
    const h = [...block.headers]; h[i] = v; onChange({ headers: h });
  }
  function updateCell(r: number, c: number, v: string) {
    const rows = block.rows.map((row) => [...row]);
    rows[r][c] = v; onChange({ rows });
  }
  function addRow() {
    onChange({ rows: [...block.rows, block.headers.map(() => '')] });
  }
  function deleteRow(r: number) {
    onChange({ rows: block.rows.filter((_, i) => i !== r) });
  }
  function addCol() {
    onChange({
      headers: [...block.headers, `Column ${block.headers.length + 1}`],
      rows: block.rows.map((r) => [...r, '']),
    });
  }
  function deleteCol(c: number) {
    onChange({
      headers: block.headers.filter((_, i) => i !== c),
      rows: block.rows.map((r) => r.filter((_, i) => i !== c)),
    });
  }

  const cellClass = 'px-2 py-1 bg-[#0B0F15] border border-white/10 rounded text-xs text-white focus:outline-none focus:border-orange-500/40 w-full';

  return (
    <div className="flex flex-col gap-3 overflow-x-auto">
      <div>
        <label className="text-xs text-white/40 mb-1 block">Caption</label>
        <input value={block.caption ?? ''} onChange={(e) => onChange({ caption: e.target.value })}
          placeholder="Optional caption"
          className="w-full px-3 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
            text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40" />
      </div>

      <table className="text-sm border-collapse min-w-max">
        <thead>
          <tr>
            {block.headers.map((h, ci) => (
              <th key={ci} className="p-1 relative">
                <div className="flex items-center gap-1">
                  <input value={h} onChange={(e) => updateHeader(ci, e.target.value)}
                    className={`${cellClass} font-semibold bg-[#151E32]`} />
                  {block.headers.length > 1 && (
                    <button onClick={() => deleteCol(ci)} className="text-white/20 hover:text-red-400 shrink-0">
                      <Trash2 size={11} />
                    </button>
                  )}
                </div>
              </th>
            ))}
            <th className="p-1">
              <button onClick={addCol} className="text-white/25 hover:text-orange-400 text-xs flex items-center gap-0.5">
                <Plus size={12} />col
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} className="p-1">
                  <input value={cell} onChange={(e) => updateCell(ri, ci, e.target.value)} className={cellClass} />
                </td>
              ))}
              <td className="p-1">
                <button onClick={() => deleteRow(ri)} className="text-white/20 hover:text-red-400">
                  <Trash2 size={11} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={addRow}
        className="flex items-center gap-1 text-xs text-white/30 hover:text-orange-400 transition-colors">
        <Plus size={12} /> Add row
      </button>
    </div>
  );
}
