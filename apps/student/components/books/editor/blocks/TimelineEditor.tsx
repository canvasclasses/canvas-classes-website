'use client';

import { TimelineBlock, TimelineEvent } from '@/types/books';
import { Plus, Trash2 } from 'lucide-react';

interface Props { block: TimelineBlock; onChange: (p: Partial<TimelineBlock>) => void; }

export default function TimelineEditor({ block, onChange }: Props) {
  function updateEvent(id: string, patch: Partial<TimelineEvent>) {
    onChange({ events: block.events.map((e) => (e.id === id ? { ...e, ...patch } : e)) });
  }
  function addEvent() {
    onChange({ events: [...block.events, { id: crypto.randomUUID(), label: '' }] });
  }
  function deleteEvent(id: string) {
    onChange({ events: block.events.filter((e) => e.id !== id) });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-xs text-white/40 mb-1 block">Title</label>
          <input value={block.title ?? ''} onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Timeline title"
            className="w-full px-3 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
              text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40" />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1 block">Orientation</label>
          <div className="flex gap-2">
            {(['vertical', 'horizontal'] as const).map((o) => (
              <button key={o} onClick={() => onChange({ orientation: o })}
                className={`px-2.5 py-1.5 rounded-lg text-xs transition-colors
                  ${block.orientation === o
                    ? 'bg-orange-500 text-black font-bold'
                    : 'bg-white/5 border border-white/10 text-white/50'}`}>
                {o}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {block.events.map((event, idx) => (
          <div key={event.id} className="flex gap-2 items-start">
            <span className="text-xs text-white/30 mt-2 w-4 text-right shrink-0">{idx + 1}</span>
            <div className="flex-1 grid grid-cols-2 gap-2">
              <input value={event.label} onChange={(e) => updateEvent(event.id, { label: e.target.value })}
                placeholder="Label"
                className="px-2 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
                  text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40" />
              <input value={event.detail ?? ''} onChange={(e) => updateEvent(event.id, { detail: e.target.value })}
                placeholder="Detail (optional)"
                className="px-2 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
                  text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40" />
            </div>
            <input value={event.icon ?? ''} onChange={(e) => updateEvent(event.id, { icon: e.target.value })}
              placeholder="icon"
              className="w-12 px-2 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
                text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40 text-center" />
            <button onClick={() => deleteEvent(event.id)}
              className="mt-1.5 text-white/20 hover:text-red-400 shrink-0">
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      <button onClick={addEvent}
        className="flex items-center gap-1 text-xs text-white/30 hover:text-orange-400">
        <Plus size={12} /> Add event
      </button>
    </div>
  );
}
