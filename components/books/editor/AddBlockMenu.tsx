'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { BlockType } from '@/types/books';

const BLOCK_GROUPS: { label: string; blocks: { type: BlockType; icon: string; label: string }[] }[] = [
  {
    label: 'Content',
    blocks: [
      { type: 'text',        icon: '¶',  label: 'Text' },
      { type: 'heading',     icon: 'H',  label: 'Heading' },
      { type: 'callout',     icon: '💡', label: 'Callout' },
      { type: 'latex_block', icon: '∑',  label: 'Equation' },
    ],
  },
  {
    label: 'Media',
    blocks: [
      { type: 'image',             icon: '🖼️', label: 'Image' },
      { type: 'interactive_image', icon: '🔍', label: 'Interactive Image' },
      { type: 'video',             icon: '▶️', label: 'Video' },
      { type: 'audio_note',        icon: '🎙️', label: 'Audio Note' },
      { type: 'animation',         icon: '✨', label: 'Animation' },
    ],
  },
  {
    label: 'Structure',
    blocks: [
      { type: 'section',        icon: '▦', label: 'Section' },
      { type: 'table',           icon: '⊞', label: 'Table' },
      { type: 'timeline',        icon: '⟶', label: 'Timeline' },
      { type: 'comparison_card', icon: '⇌', label: 'Comparison' },
    ],
  },
  {
    label: 'Chemistry',
    blocks: [
      { type: 'molecule_2d', icon: '⬡', label: 'Molecule 2D' },
      { type: 'molecule_3d', icon: '🧬', label: 'Molecule 3D' },
    ],
  },
  {
    label: 'Interactive',
    blocks: [
      { type: 'practice_link',  icon: '🎯', label: 'Practice Link' },
      { type: 'inline_quiz',    icon: '🧠', label: 'Quiz (Milestone)' },
      { type: 'worked_example', icon: '📘', label: 'Worked Example' },
      { type: 'simulation',     icon: '⚗️', label: 'Simulation' },
    ],
  },
];

interface Props {
  onAdd: (type: BlockType) => void;
  afterId?: string;
  compact?: boolean;
  excludeTypes?: BlockType[];
}

export default function AddBlockMenu({ onAdd, afterId, compact = false, excludeTypes }: Props) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  function toggle() {
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const menuH = Math.min(window.innerHeight * 0.7, 420);
      const spaceBelow = window.innerHeight - rect.bottom;

      if (spaceBelow >= menuH || spaceBelow >= rect.top) {
        // Open downward
        setMenuStyle({ position: 'fixed', top: rect.bottom + 6, left: rect.left, width: 256 });
      } else {
        // Open upward
        setMenuStyle({ position: 'fixed', bottom: window.innerHeight - rect.top + 6, left: rect.left, width: 256 });
      }
    }
    setOpen((v) => !v);
  }

  function pick(type: BlockType) {
    onAdd(type);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={toggle}
        className={`flex items-center gap-1.5 transition-colors
          ${compact
            ? 'text-[11px] text-white/30 hover:text-orange-400/70 px-1 py-0.5'
            : 'px-4 py-2 rounded-xl border border-dashed border-white/15 text-white/40 hover:border-orange-500/40 hover:text-orange-400 text-sm w-full justify-center'
          }`}
      >
        <Plus size={compact ? 12 : 16} />
        {!compact && 'Add Block'}
      </button>

      {open && (
        <div
          style={menuStyle}
          className="bg-[#0B0F15] border border-white/10 rounded-xl shadow-2xl z-[200] overflow-y-auto"
          // Max height: 70vh, capped so it never overflows top or bottom
          ref={(el) => {
            if (el) el.style.maxHeight = `${Math.min(window.innerHeight * 0.7, 420)}px`;
          }}
        >
          {BLOCK_GROUPS.map((group) => {
            const filtered = group.blocks.filter(b => !excludeTypes?.includes(b.type));
            if (filtered.length === 0) return null;
            return (
              <div key={group.label}>
                <p className="px-3 pt-2.5 pb-1 text-[10px] font-semibold text-white/30 uppercase tracking-wider">
                  {group.label}
                </p>
                {filtered.map((b) => (
                  <button
                    key={b.type}
                    onClick={() => pick(b.type)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 transition-colors text-left"
                  >
                    <span className="text-base w-6 text-center">{b.icon}</span>
                    <span className="text-sm text-white/80">{b.label}</span>
                  </button>
                ))}
              </div>
            );
          })}
          <div className="h-2" />
        </div>
      )}
    </div>
  );
}
