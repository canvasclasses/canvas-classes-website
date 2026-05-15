'use client';

import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { AnimationBlock } from '@/types/books';
import { UploadFn } from '../BookWorkspace';

interface Props { block: AnimationBlock; onChange: (p: Partial<AnimationBlock>) => void; onUpload: UploadFn; }

export default function AnimationBlockEditor({ block, onChange, onUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const url = await onUpload(file, block.id);
      onChange({ src: url });
    } catch { /* silent */ }
    finally { setUploading(false); }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input value={block.src} onChange={(e) => onChange({ src: e.target.value })}
          placeholder=".lottie or .json URL"
          className="flex-1 px-3 py-2 bg-[#0B0F15] border border-white/10 rounded-lg
            text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40" />
        <button onClick={() => fileRef.current?.click()} disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10
            bg-white/5 hover:bg-white/10 text-xs text-white/60 disabled:opacity-50">
          <Upload size={13} />
          {uploading ? '…' : 'Upload'}
        </button>
        <input ref={fileRef} type="file" accept=".json,.lottie" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={block.loop}
            onChange={(e) => onChange({ loop: e.target.checked })}
            className="accent-orange-500" />
          <span className="text-sm text-white/60">Loop</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={block.autoplay}
            onChange={(e) => onChange({ autoplay: e.target.checked })}
            className="accent-orange-500" />
          <span className="text-sm text-white/60">Autoplay</span>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-white/40 mb-1 block">Width</label>
          <div className="flex gap-2">
            {(['full', 'half'] as const).map((w) => (
              <button key={w} onClick={() => onChange({ width: w })}
                className={`px-3 py-1 rounded-lg text-xs transition-colors
                  ${block.width === w
                    ? 'bg-orange-500 text-black font-bold'
                    : 'bg-white/5 border border-white/10 text-white/50'}`}>
                {w}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1 block">Caption</label>
          <input value={block.caption ?? ''} onChange={(e) => onChange({ caption: e.target.value })}
            placeholder="Optional"
            className="w-full px-3 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
              text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40" />
        </div>
      </div>
    </div>
  );
}
