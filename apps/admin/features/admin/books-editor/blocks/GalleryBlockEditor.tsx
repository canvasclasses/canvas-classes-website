'use client';

import { useRef, useState } from 'react';
import { Upload, Plus, Trash2, ArrowUp, ArrowDown, ImageIcon } from 'lucide-react';
import { GalleryBlock, GalleryItem } from '@canvas/data/types/books';
import { UploadFn } from '../BookWorkspace';

interface Props { block: GalleryBlock; onChange: (p: Partial<GalleryBlock>) => void; onUpload: UploadFn; }

const ASPECT_OPTIONS: { value: NonNullable<GalleryBlock['aspect_ratio']> | 'natural'; label: string }[] = [
  { value: 'natural', label: 'Natural' },
  { value: '16:9', label: '16 : 9' },
  { value: '4:3', label: '4 : 3' },
  { value: '1:1', label: '1 : 1' },
  { value: '16:5', label: '16 : 5' },
  { value: '21:9', label: '21 : 9' },
];

// Overall carousel size — same presets as the single Image block.
const WIDTH_LABELS: Record<NonNullable<GalleryBlock['width']>, string> = {
  full: '100%', five_sixth: '83%', three_quarter: '75%', two_third: '67%',
  half: '50%', two_fifth: '40%', third: '33%', quarter: '25%',
};
const WIDTH_OPTIONS: NonNullable<GalleryBlock['width']>[] = [
  'full', 'five_sixth', 'three_quarter', 'two_third', 'half', 'two_fifth', 'third', 'quarter',
];

export default function GalleryBlockEditor({ block, onChange, onUpload }: Props) {
  const items = block.items ?? [];
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [error, setError] = useState('');
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  function patchItem(i: number, patch: Partial<GalleryItem>) {
    const next = items.map((it, j) => (j === i ? { ...it, ...patch } : it));
    onChange({ items: next });
  }
  function addItem() {
    onChange({ items: [...items, { id: crypto.randomUUID(), src: '', alt: '' }] });
  }
  function removeItem(i: number) {
    onChange({ items: items.filter((_, j) => j !== i) });
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange({ items: next });
  }
  async function handleFile(i: number, file: File) {
    if (!file.type.startsWith('image/')) { setError('Please choose an image file.'); return; }
    setUploadingIdx(i); setError('');
    try {
      const url = await onUpload(file, block.id);
      patchItem(i, { src: url, alt: items[i].alt || file.name.replace(/\.[^.]+$/, '') });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploadingIdx(null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[11px] text-white/35 leading-snug">
        A swipeable carousel for <span className="text-white/55">2–6 images on one concept</span> — readers swipe/tap-zoom.
        Use a regular Image block for a single figure.
      </p>

      {/* Aspect ratio */}
      <div>
        <label className="text-xs text-white/40 mb-1 block">Frame aspect ratio (all slides share it)</label>
        <div className="flex flex-wrap gap-2">
          {ASPECT_OPTIONS.map(({ value, label }) => {
            const current = block.aspect_ratio ?? 'natural';
            return (
              <button key={value}
                onClick={() => onChange({ aspect_ratio: value === 'natural' ? undefined : value as GalleryBlock['aspect_ratio'] })}
                className={`px-3 py-1 rounded-lg text-xs transition-colors
                  ${current === value ? 'bg-violet-500 text-white font-bold' : 'bg-white/5 border border-white/10 text-white/50 hover:border-white/20'}`}>
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Width — overall carousel size */}
      <div>
        <label className="text-xs text-white/40 mb-1 block">Width</label>
        <div className="flex flex-wrap gap-2">
          {WIDTH_OPTIONS.map((w) => {
            const current = block.width ?? 'full';
            return (
              <button key={w} onClick={() => onChange({ width: w === 'full' ? undefined : w })}
                className={`px-3 py-1 rounded-lg text-xs transition-colors
                  ${current === w ? 'bg-orange-500 text-black font-bold' : 'bg-white/5 border border-white/10 text-white/50 hover:border-white/20'}`}>
                {WIDTH_LABELS[w]}
              </button>
            );
          })}
        </div>
      </div>

      {/* §16 — figure key */}
      <div className="flex items-center gap-2">
        <label className="text-[11px] text-white/40 shrink-0">Figure key</label>
        <input value={block.figure_key ?? ''} onChange={(e) => onChange({ figure_key: e.target.value || undefined })}
          placeholder="auto if blank — e.g. apparatus-variants"
          className="flex-1 px-2.5 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg text-xs text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40" />
        {block.figure_number && <span className="text-[11px] font-semibold text-orange-300">Fig. {block.figure_number}</span>}
      </div>

      {/* Items */}
      <div className="flex flex-col gap-2">
        {items.map((it, i) => (
          <div key={it.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-3 flex gap-3">
            {/* Thumb / upload */}
            <div className="shrink-0">
              <div
                onClick={() => fileRefs.current[i]?.click()}
                className="w-20 h-20 rounded-lg border border-white/10 bg-[#0B0F15] overflow-hidden flex items-center justify-center cursor-pointer hover:border-white/25 relative"
              >
                {uploadingIdx === i && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
                    <span className="text-[10px] text-orange-400 animate-pulse">…</span>
                  </div>
                )}
                {it.src
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={it.src} alt={it.alt} className="w-full h-full object-cover" />
                  : <ImageIcon size={20} className="text-white/20" />}
              </div>
              <input ref={(el) => { fileRefs.current[i] = el; }} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(i, f); }} />
            </div>

            {/* Fields */}
            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
              <div className="flex gap-1.5">
                <input value={it.src} onChange={(e) => patchItem(i, { src: e.target.value })}
                  placeholder="https://… or upload ↑"
                  className="flex-1 px-2.5 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg text-xs text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40" />
                <button onClick={() => fileRefs.current[i]?.click()}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-[11px] text-white/60">
                  <Upload size={12} /> Upload
                </button>
              </div>
              <input value={it.alt} onChange={(e) => patchItem(i, { alt: e.target.value })}
                placeholder="Alt text (describe the image)"
                className="px-2.5 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg text-xs text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40" />
              <input value={it.caption ?? ''} onChange={(e) => patchItem(i, { caption: e.target.value })}
                placeholder="Caption (optional — shown under this slide)"
                className="px-2.5 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg text-xs text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40" />
            </div>

            {/* Controls */}
            <div className="shrink-0 flex flex-col items-center gap-1">
              <button onClick={() => move(i, -1)} disabled={i === 0} title="Move up"
                className="p-1 rounded text-white/40 hover:text-white/80 disabled:opacity-20"><ArrowUp size={14} /></button>
              <button onClick={() => move(i, 1)} disabled={i === items.length - 1} title="Move down"
                className="p-1 rounded text-white/40 hover:text-white/80 disabled:opacity-20"><ArrowDown size={14} /></button>
              <button onClick={() => removeItem(i)} title="Remove"
                className="p-1 rounded text-red-400/60 hover:text-red-400"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button onClick={addItem}
        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-white/15 text-white/40 hover:border-orange-500/40 hover:text-orange-400 text-xs transition-colors">
        <Plus size={14} /> Add image
      </button>
    </div>
  );
}
