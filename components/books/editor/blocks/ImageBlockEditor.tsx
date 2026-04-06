'use client';

import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { ImageBlock } from '@/types/books';
import { UploadFn } from '../BookWorkspace';

interface Props { block: ImageBlock; onChange: (p: Partial<ImageBlock>) => void; onUpload: UploadFn; }

export default function ImageBlockEditor({ block, onChange, onUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setUploadError('');
    try {
      const url = await onUpload(file, block.id);
      onChange({ src: url, alt: block.alt || file.name.replace(/\.[^.]+$/, '') });
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Upload / URL */}
      <div className="flex gap-2">
        <input
          value={block.src}
          onChange={(e) => onChange({ src: e.target.value })}
          placeholder="https://… or upload below"
          className="flex-1 px-3 py-2 bg-[#0B0F15] border border-white/10 rounded-lg
            text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40"
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 bg-white/5
            hover:bg-white/10 text-xs text-white/60 transition-colors disabled:opacity-50"
        >
          <Upload size={13} />
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
      </div>

      {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}

      {/* Preview */}
      {block.src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={block.src} alt={block.alt} className="max-h-40 rounded-lg object-contain border border-white/10" />
      )}

      {/* Alt + Caption */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-white/40 mb-1 block">Alt text</label>
          <input value={block.alt} onChange={(e) => onChange({ alt: e.target.value })}
            placeholder="Describe the image"
            className="w-full px-3 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
              text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40" />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1 block">Caption</label>
          <input value={block.caption ?? ''} onChange={(e) => onChange({ caption: e.target.value })}
            placeholder="Optional caption"
            className="w-full px-3 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
              text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40" />
        </div>
      </div>

      {/* Width */}
      <div>
        <label className="text-xs text-white/40 mb-1 block">Width</label>
        <div className="flex gap-2">
          {(['full', 'half', 'third'] as const).map((w) => (
            <button key={w} onClick={() => onChange({ width: w })}
              className={`px-3 py-1 rounded-lg text-xs transition-colors
                ${block.width === w
                  ? 'bg-orange-500 text-black font-bold'
                  : 'bg-white/5 border border-white/10 text-white/50 hover:border-white/20'}`}>
              {w}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
