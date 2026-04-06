'use client';

import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { AudioNoteBlock } from '@/types/books';
import { UploadFn } from '../BookWorkspace';

interface Props { block: AudioNoteBlock; onChange: (p: Partial<AudioNoteBlock>) => void; onUpload: UploadFn; }

export default function AudioNoteEditor({ block, onChange, onUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setUploadError('');
    try {
      const url = await onUpload(file, block.id);
      onChange({ src: url });
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-white/40 mb-1 block">Label</label>
          <input value={block.label} onChange={(e) => onChange({ label: e.target.value })}
            placeholder="Teacher note"
            className="w-full px-3 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
              text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40" />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1 block">Duration (sec)</label>
          <input type="number" min={0} value={block.duration_sec}
            onChange={(e) => onChange({ duration_sec: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
              text-sm text-white focus:outline-none focus:border-orange-500/40" />
        </div>
      </div>

      <div className="flex gap-2">
        <input value={block.src} onChange={(e) => onChange({ src: e.target.value })}
          placeholder="Audio URL or upload"
          className="flex-1 px-3 py-2 bg-[#0B0F15] border border-white/10 rounded-lg
            text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40" />
        <button onClick={() => fileRef.current?.click()} disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10
            bg-white/5 hover:bg-white/10 text-xs text-white/60 disabled:opacity-50">
          <Upload size={13} />
          {uploading ? '…' : 'Upload'}
        </button>
        <input ref={fileRef} type="file" accept="audio/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>

      {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}

      {block.src && (
        <audio src={block.src} controls className="w-full h-8 mt-1" />
      )}

      <div>
        <label className="text-xs text-white/40 mb-1 block">Transcript (optional)</label>
        <textarea value={block.transcript ?? ''} onChange={(e) => onChange({ transcript: e.target.value })}
          rows={2} placeholder="Accessibility transcript…"
          className="w-full px-3 py-2 bg-[#0B0F15] border border-white/10 rounded-lg
            text-sm text-white placeholder-white/25 resize-none focus:outline-none focus:border-orange-500/40" />
      </div>
    </div>
  );
}
