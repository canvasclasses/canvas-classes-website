'use client';

import { useMemo } from 'react';
import { ImageIcon, RotateCcw } from 'lucide-react';
import { findImages, setImageWidthInText } from '@/app/lib/flashcardMarkdown';

interface Props {
  label?: string;
  value: string;
  onChange: (next: string) => void;
}

/**
 * Renders one scale slider per `![...](url)` occurrence found in `value`.
 * Rewrites the alt text to encode `|w=NNN%` so both the admin preview and
 * the student-facing renderer honour the chosen size.
 */
export default function FlashcardImageScaleControls({ label = 'Image sizes', value, onChange }: Props) {
  const images = useMemo(() => findImages(value), [value]);
  if (images.length === 0) return null;

  return (
    <div className="mt-2 rounded-lg border border-white/10 bg-slate-900/40 p-2.5">
      <div className="flex items-center gap-1.5 mb-1.5">
        <ImageIcon className="w-3 h-3 text-slate-400" />
        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
          {label} ({images.length})
        </span>
      </div>
      <div className="space-y-1.5">
        {images.map((img, idx) => {
          const currentPct = (() => {
            if (!img.width) return 100;
            if (img.width.endsWith('%')) return parseInt(img.width, 10);
            return null;
          })();
          const filename = img.url.split('/').pop()?.split('?')[0] ?? img.url;
          const setWidth = (width: string | null) => onChange(setImageWidthInText(value, img.url, width));
          return (
            <div key={`${img.url}-${idx}`} className="flex items-center gap-2">
              <span
                className="text-[10px] text-slate-500 truncate max-w-[110px] font-mono"
                title={img.url}
              >
                {filename}
              </span>
              <input
                type="range"
                min={20}
                max={100}
                step={5}
                value={currentPct ?? 100}
                onChange={e => setWidth(`${e.target.value}%`)}
                className="flex-1 accent-purple-500 h-1"
              />
              <input
                type="number"
                min={10}
                max={100}
                value={currentPct ?? 100}
                onChange={e => {
                  const n = Math.max(10, Math.min(100, parseInt(e.target.value || '100', 10)));
                  setWidth(`${n}%`);
                }}
                className="w-12 px-1.5 py-0.5 bg-slate-800 border border-white/10 rounded text-white text-[10px] text-right focus:outline-none focus:border-purple-500"
              />
              <span className="text-[10px] text-slate-500">%</span>
              <button
                type="button"
                onClick={() => setWidth(null)}
                title="Reset to default (100%)"
                className="p-1 text-slate-500 hover:text-purple-400 hover:bg-white/5 rounded transition"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
