'use client';

import { Plus, Trash2 } from 'lucide-react';
import { ClassifyExerciseBlock, ClassifyExerciseRow } from '@/types/books';

interface Props {
  block: ClassifyExerciseBlock;
  onChange: (p: Partial<ClassifyExerciseBlock>) => void;
}

export default function ClassifyExerciseEditor({ block, onChange }: Props) {
  function updateRow(idx: number, patch: Partial<ClassifyExerciseRow>) {
    onChange({ rows: block.rows.map((r, i) => i === idx ? { ...r, ...patch } : r) });
  }

  function addRow() {
    onChange({ rows: [...block.rows, { substance: '', is_solution: true, explanation: '' }] });
  }

  function deleteRow(idx: number) {
    onChange({ rows: block.rows.filter((_, i) => i !== idx) });
  }

  function moveRow(idx: number, dir: -1 | 1) {
    const rows = [...block.rows];
    const swap = idx + dir;
    if (swap < 0 || swap >= rows.length) return;
    [rows[idx], rows[swap]] = [rows[swap], rows[idx]];
    onChange({ rows });
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Question text */}
      <div>
        <label className="text-xs text-white/40 mb-1 block">Question prompt</label>
        <input
          value={block.question}
          onChange={(e) => onChange({ question: e.target.value })}
          placeholder="Which of these are true solutions?"
          className="w-full px-3 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
            text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40"
        />
      </div>

      {/* Column label */}
      <div>
        <label className="text-xs text-white/40 mb-1 block">Substance column label (optional)</label>
        <input
          value={block.column_label ?? ''}
          onChange={(e) => onChange({ column_label: e.target.value || undefined })}
          placeholder="Substance (default)"
          className="w-full px-3 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
            text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40"
        />
      </div>

      {/* Rows */}
      <div>
        <label className="text-xs text-white/40 mb-2 block">Rows ({block.rows.length})</label>
        <div className="flex flex-col gap-2">
          {block.rows.map((row, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-white/[0.025] border border-white/8">
              {/* Top row: name | is_solution | move | delete */}
              <div className="flex gap-2 items-center mb-2">
                <input
                  value={row.substance}
                  onChange={(e) => updateRow(idx, { substance: e.target.value })}
                  placeholder="e.g. Steel"
                  className="flex-1 px-2.5 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
                    text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40"
                />
                {/* Toggle is_solution */}
                <button
                  onClick={() => updateRow(idx, { is_solution: !row.is_solution })}
                  title="Toggle answer"
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors
                    ${row.is_solution
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                      : 'bg-red-500/15 text-red-400 border border-red-500/25'
                    }`}
                >
                  {row.is_solution ? '✓' : '✗'}
                </button>
                {/* Move up / down */}
                <button
                  onClick={() => moveRow(idx, -1)}
                  disabled={idx === 0}
                  className="text-white/20 hover:text-white/50 disabled:opacity-30 transition-colors text-xs px-1"
                  title="Move up"
                >▲</button>
                <button
                  onClick={() => moveRow(idx, 1)}
                  disabled={idx === block.rows.length - 1}
                  className="text-white/20 hover:text-white/50 disabled:opacity-30 transition-colors text-xs px-1"
                  title="Move down"
                >▼</button>
                <button
                  onClick={() => deleteRow(idx)}
                  className="text-white/20 hover:text-red-400 transition-colors"
                  title="Delete row"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              {/* Explanation */}
              <textarea
                value={row.explanation}
                onChange={(e) => updateRow(idx, { explanation: e.target.value })}
                placeholder="Explanation shown after student answers…"
                rows={2}
                className="w-full px-2.5 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
                  text-sm text-white/70 placeholder-white/20 focus:outline-none focus:border-orange-500/40
                  resize-none leading-relaxed"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Add row */}
      <button
        onClick={addRow}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-white/15
          text-white/40 hover:border-orange-500/40 hover:text-orange-400 text-sm w-full justify-center transition-colors"
      >
        <Plus size={14} /> Add Row
      </button>
    </div>
  );
}
