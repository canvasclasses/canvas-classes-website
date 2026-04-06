'use client';

import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { VideoBlock } from '@/types/books';
import { UploadFn } from '../BookWorkspace';

interface Props { block: VideoBlock; onChange: (p: Partial<VideoBlock>) => void; onUpload: UploadFn; }

export default function VideoBlockEditor({ block, onChange, onUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setUploadError('');
    try {
      const url = await onUpload(file, block.id);
      onChange({ src: url, provider: 'r2_direct' });
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Provider */}
      <div>
        <label className="text-xs text-white/40 mb-1 block">Source</label>
        <div className="flex gap-2">
          {(['r2_direct', 'cloudflare_stream', 'youtube_nocookie'] as const).map((p) => (
            <button key={p} onClick={() => onChange({ provider: p })}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors
                ${block.provider === p
                  ? 'bg-orange-500 text-black font-bold'
                  : 'bg-white/5 border border-white/10 text-white/50 hover:border-white/20'}`}>
              {p === 'r2_direct' ? 'Upload' : p === 'cloudflare_stream' ? 'Cloudflare' : 'YouTube'}
            </button>
          ))}
        </div>
      </div>

      {/* URL / ID */}
      <div className="flex gap-2">
        <input
          value={block.src}
          onChange={(e) => onChange({ src: e.target.value })}
          placeholder={block.provider === 'cloudflare_stream' ? 'Stream ID' : block.provider === 'youtube_nocookie' ? 'YouTube video ID' : 'URL or upload'}
          className="flex-1 px-3 py-2 bg-[#0B0F15] border border-white/10 rounded-lg
            text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40"
        />
        {block.provider === 'r2_direct' && (
          <>
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10
                bg-white/5 hover:bg-white/10 text-xs text-white/60 disabled:opacity-50">
              <Upload size={13} />
              {uploading ? '…' : 'Upload'}
            </button>
            <input ref={fileRef} type="file" accept="video/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </>
        )}
      </div>

      {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}

      {/* Duration + Caption */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-white/40 mb-1 block">Duration (sec)</label>
          <input type="number" min={0} value={block.duration_sec}
            onChange={(e) => onChange({ duration_sec: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
              text-sm text-white focus:outline-none focus:border-orange-500/40" />
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
