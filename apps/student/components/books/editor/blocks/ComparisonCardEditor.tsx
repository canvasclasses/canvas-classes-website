'use client';

import { ComparisonCardBlock, ComparisonColumn } from '@/types/books';
import { Plus, Trash2 } from 'lucide-react';

interface Props { block: ComparisonCardBlock; onChange: (p: Partial<ComparisonCardBlock>) => void; }

export default function ComparisonCardEditor({ block, onChange }: Props) {
  function updateCol(i: number, patch: Partial<ComparisonColumn>) {
    const cols = block.columns.map((c, ci) => (ci === i ? { ...c, ...patch } : c));
    onChange({ columns: cols });
  }
  function updatePoint(colIdx: number, ptIdx: number, v: string) {
    const cols = block.columns.map((c, ci) => {
      if (ci !== colIdx) return c;
      const points = [...c.points]; points[ptIdx] = v;
      return { ...c, points };
    });
    onChange({ columns: cols });
  }
  function addPoint(colIdx: number) {
    updateCol(colIdx, { points: [...block.columns[colIdx].points, ''] });
  }
  function deletePoint(colIdx: number, ptIdx: number) {
    const points = block.columns[colIdx].points.filter((_, i) => i !== ptIdx);
    updateCol(colIdx, { points });
  }
  function addColumn() {
    if (block.columns.length >= 3) return;
    onChange({ columns: [...block.columns, { heading: `Option ${block.columns.length + 1}`, points: [''] }] });
  }
  function deleteColumn(i: number) {
    if (block.columns.length <= 2) return;
    onChange({ columns: block.columns.filter((_, ci) => ci !== i) });
  }

  const COLORS = ['blue', 'green', 'red', 'orange', 'purple'];

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="text-xs text-white/40 mb-1 block">Title</label>
        <input value={block.title ?? ''} onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Comparison title"
          className="w-full px-3 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
            text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40" />
      </div>

      <div className={`grid gap-3 ${block.columns.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {block.columns.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-2 p-3 bg-[#0B0F15] border border-white/10 rounded-xl">
            <div className="flex items-center gap-2">
              <input value={col.heading} onChange={(e) => updateCol(ci, { heading: e.target.value })}
                className="flex-1 px-2 py-1 bg-[#151E32] border border-white/10 rounded-lg
                  text-xs text-white font-bold focus:outline-none focus:border-orange-500/40"
                placeholder="Heading" />
              {block.columns.length > 2 && (
                <button onClick={() => deleteColumn(ci)} className="text-white/20 hover:text-red-400">
                  <Trash2 size={12} />
                </button>
              )}
            </div>

            <div className="flex gap-1 flex-wrap">
              {COLORS.map((color) => (
                <button key={color} onClick={() => updateCol(ci, { color })}
                  className={`w-4 h-4 rounded-full border-2 transition-colors
                    ${col.color === color ? 'border-white' : 'border-transparent'}
                    bg-${color}-500`} />
              ))}
            </div>

            <div className="flex flex-col gap-1">
              {col.points.map((pt, pi) => (
                <div key={pi} className="flex gap-1">
                  <input value={pt} onChange={(e) => updatePoint(ci, pi, e.target.value)}
                    placeholder={`Point ${pi + 1}`}
                    className="flex-1 px-2 py-1 bg-[#151E32] border border-white/10 rounded-lg
                      text-xs text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40" />
                  <button onClick={() => deletePoint(ci, pi)} className="text-white/20 hover:text-red-400 shrink-0">
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
            </div>

            <button onClick={() => addPoint(ci)}
              className="flex items-center gap-1 text-xs text-white/25 hover:text-orange-400">
              <Plus size={11} /> point
            </button>
          </div>
        ))}
      </div>

      {block.columns.length < 3 && (
        <button onClick={addColumn}
          className="flex items-center gap-1 text-xs text-white/30 hover:text-orange-400">
          <Plus size={12} /> Add column
        </button>
      )}
    </div>
  );
}
