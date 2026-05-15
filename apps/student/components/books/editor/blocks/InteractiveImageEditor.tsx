'use client';

import { useRef, useState } from 'react';
import { Upload, Trash2, Plus } from 'lucide-react';
import { InteractiveImageBlock, Hotspot } from '@/types/books';
import { UploadFn } from '../BookWorkspace';

interface Props {
  block: InteractiveImageBlock;
  onChange: (p: Partial<InteractiveImageBlock>) => void;
  onUpload: UploadFn;
}

export default function InteractiveImageEditor({ block, onChange, onUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const url = await onUpload(file, block.id);
      onChange({ src: url });
    } catch { /* silent */ }
    finally { setUploading(false); }
  }

  function addHotspot(e: React.MouseEvent<HTMLDivElement>) {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const newHotspot: Hotspot = {
      id: crypto.randomUUID(),
      x: Math.round(x * 1000) / 1000,
      y: Math.round(y * 1000) / 1000,
      label: `Hotspot ${block.hotspots.length + 1}`,
      detail: '',
      icon: 'circle',
    };
    onChange({ hotspots: [...block.hotspots, newHotspot] });
  }

  function updateHotspot(id: string, patch: Partial<Hotspot>) {
    onChange({ hotspots: block.hotspots.map((h) => (h.id === id ? { ...h, ...patch } : h)) });
  }

  function deleteHotspot(id: string) {
    onChange({ hotspots: block.hotspots.filter((h) => h.id !== id) });
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Upload */}
      <div className="flex gap-2">
        <input value={block.src} onChange={(e) => onChange({ src: e.target.value })}
          placeholder="Image URL or upload"
          className="flex-1 px-3 py-2 bg-[#0B0F15] border border-white/10 rounded-lg
            text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40" />
        <button onClick={() => fileRef.current?.click()} disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10
            bg-white/5 hover:bg-white/10 text-xs text-white/60 disabled:opacity-50">
          <Upload size={13} />
          {uploading ? '…' : 'Upload'}
        </button>
        <input ref={fileRef} type="file" accept="image/*,.svg" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>

      {/* Image with clickable hotspot placement */}
      {block.src && (
        <div>
          <p className="text-xs text-white/40 mb-1">Click on the image to place a hotspot</p>
          <div
            ref={imgRef}
            className="relative w-full cursor-crosshair select-none overflow-hidden rounded-xl border border-white/10"
            onClick={addHotspot}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={block.src} alt={block.alt} className="w-full h-auto pointer-events-none" draggable={false} />
            {block.hotspots.map((h, i) => (
              <div
                key={h.id}
                className="absolute w-6 h-6 rounded-full bg-orange-500 border-2 border-white
                  flex items-center justify-center text-xs font-bold text-black pointer-events-none"
                style={{ left: `calc(${h.x * 100}% - 12px)`, top: `calc(${h.y * 100}% - 12px)` }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alt + Caption */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-white/40 mb-1 block">Alt text</label>
          <input value={block.alt} onChange={(e) => onChange({ alt: e.target.value })}
            className="w-full px-2 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
              text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40" />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1 block">Caption</label>
          <input value={block.caption ?? ''} onChange={(e) => onChange({ caption: e.target.value })}
            className="w-full px-2 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
              text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40" />
        </div>
      </div>

      {/* Hotspot list */}
      {block.hotspots.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-white/40">Hotspots</p>
          {block.hotspots.map((h, i) => (
            <div key={h.id} className="flex gap-2 items-start p-2 bg-[#0B0F15] border border-white/8 rounded-lg">
              <span className="text-xs text-white/30 mt-2 w-4 shrink-0 text-right">{i + 1}</span>
              <div className="flex-1 flex flex-col gap-1">
                <input value={h.label} onChange={(e) => updateHotspot(h.id, { label: e.target.value })}
                  placeholder="Label"
                  className="w-full px-2 py-1 bg-[#151E32] border border-white/10 rounded-lg
                    text-xs text-white placeholder-white/25 focus:outline-none" />
                <textarea value={h.detail} onChange={(e) => updateHotspot(h.id, { detail: e.target.value })}
                  placeholder="Detail shown on tap…"
                  rows={2}
                  className="w-full px-2 py-1 bg-[#151E32] border border-white/10 rounded-lg
                    text-xs text-white placeholder-white/25 resize-none focus:outline-none" />
              </div>
              <button onClick={() => deleteHotspot(h.id)}
                className="mt-1 text-white/20 hover:text-red-400 shrink-0">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
