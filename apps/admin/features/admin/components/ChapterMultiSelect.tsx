'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { TAXONOMY_FROM_CSV } from '@canvas/data/taxonomy/taxonomyData_from_csv';
import type { Subject } from '../hooks/usePermissions';

interface ChapterMultiSelectProps {
  subject: Subject;
  selected: string[];
  onChange: (chapterIds: string[]) => void;
}

interface ChapterRow {
  id: string;
  title: string;
}

const SUBJECT_PREFIXES: Record<Subject, string[]> = {
  chemistry: ['ch11_', 'ch12_'],
  physics: ['ph11_', 'ph12_'],
  mathematics: ['ma_'],
  biology: ['bio9_', 'bio11_', 'bio12_'],
};

function getChaptersForSubject(subject: Subject): ChapterRow[] {
  const prefixes = SUBJECT_PREFIXES[subject];
  return (TAXONOMY_FROM_CSV as Array<{ type: string; id: string; name: string }>)
    .filter((n) => n.type === 'chapter' && prefixes.some((p) => n.id.startsWith(p)))
    .map((n) => ({ id: n.id, title: n.name }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function ChapterMultiSelect({
  subject,
  selected,
  onChange,
}: ChapterMultiSelectProps) {
  const allChapters = useMemo(() => getChaptersForSubject(subject), [subject]);
  const [filter, setFilter] = useState('');

  const visible = useMemo(() => {
    const f = filter.trim().toLowerCase();
    if (!f) return allChapters;
    return allChapters.filter(
      (c) => c.id.toLowerCase().includes(f) || c.title.toLowerCase().includes(f),
    );
  }, [allChapters, filter]);

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const toggle = (id: string) => {
    const next = new Set(selectedSet);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(Array.from(next));
  };

  return (
    <div className="rounded-lg border border-white/10 bg-[#0B0F15] p-3">
      <div className="relative mb-2">
        <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter chapters…"
          className="w-full rounded-md bg-white/5 py-1.5 pl-8 pr-2 text-sm text-white placeholder:text-white/30 focus:bg-white/10 focus:outline-none"
        />
      </div>
      <div className="max-h-56 space-y-1 overflow-y-auto">
        {visible.length === 0 && (
          <div className="px-2 py-1 text-xs text-white/40">No chapters match.</div>
        )}
        {visible.map((c) => (
          <label
            key={c.id}
            className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm text-white/80 hover:bg-white/5"
          >
            <input
              type="checkbox"
              checked={selectedSet.has(c.id)}
              onChange={() => toggle(c.id)}
              className="accent-orange-500"
            />
            <span className="font-mono text-xs text-white/50">{c.id}</span>
            <span>{c.title}</span>
          </label>
        ))}
      </div>
      {selected.length > 0 && (
        <div className="mt-2 text-xs text-white/50">
          {selected.length} chapter{selected.length === 1 ? '' : 's'} selected
        </div>
      )}
    </div>
  );
}
