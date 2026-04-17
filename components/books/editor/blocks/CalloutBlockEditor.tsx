'use client';

import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { CalloutBlock, CalloutVariant } from '@/types/books';
import { UploadFn } from '../BookWorkspace';

const VARIANTS: { value: CalloutVariant; label: string; icon: string }[] = [
  { value: 'note',      label: 'Note',      icon: '📝' },
  { value: 'remember',  label: 'Remember',  icon: '🔁' },
  { value: 'warning',   label: 'Warning',   icon: '⚠️' },
  { value: 'exam_tip',  label: 'Exam Tip',  icon: '🎯' },
  { value: 'fun_fact',  label: 'Fun Fact',  icon: '💡' },
];

interface Props {
  block: CalloutBlock;
  onChange: (p: Partial<CalloutBlock>) => void;
  onUpload?: UploadFn;
}

export default function CalloutBlockEditor({ block, onChange, onUpload }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  async function handleFile(file: File) {
    if (!onUpload) return;
    if (!file.type.startsWith('image/')) { setUploadError('Please select an image file.'); return; }
    setUploading(true);
    setUploadError('');
    try {
      const url = await onUpload(file, block.id);
      onChange({ image_src: url });
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="text-xs text-white/40 mb-1.5 block">Variant</label>
        <div className="flex flex-wrap gap-2">
          {VARIANTS.map((v) => (
            <button key={v.value} onClick={() => onChange({ variant: v.value })}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-colors
                ${block.variant === v.value
                  ? 'bg-orange-500 text-black font-bold'
                  : 'bg-white/5 border border-white/10 text-white/50 hover:border-white/20'}`}>
              {v.icon} {v.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-white/40 mb-1 block">Title (optional)</label>
        <input value={block.title ?? ''} onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Override default title…"
          className="w-full px-3 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
            text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40" />
      </div>

      <div>
        <label className="text-xs text-white/40 mb-1 block">Content (markdown)</label>
        <textarea value={block.markdown} onChange={(e) => onChange({ markdown: e.target.value })}
          rows={4} placeholder="Callout content…"
          className="w-full px-3 py-2 bg-[#0B0F15] border border-white/10 rounded-lg
            text-sm text-white placeholder-white/25 resize-y focus:outline-none focus:border-orange-500/40 font-mono" />
      </div>

      <div className="pt-1 border-t border-white/6">
        <label className="text-xs text-white/40 mb-1 block">Bottom image (optional)</label>
        <div className="flex gap-2">
          <input
            value={block.image_src ?? ''}
            onChange={(e) => onChange({ image_src: e.target.value || undefined })}
            placeholder="Paste R2 URL, or upload →"
            className="flex-1 px-3 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
              text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40"
          />
          {onUpload && (
            <>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10
                  bg-white/5 hover:bg-white/10 text-[11px] text-white/60 transition-colors disabled:opacity-50"
              >
                <Upload size={11} />
                {uploading ? 'Uploading…' : 'Upload'}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
            </>
          )}
        </div>
        {uploadError && <p className="text-[11px] text-red-400 mt-1">{uploadError}</p>}
      </div>

      <div>
        <label className="text-xs text-white/40 mb-1 block">Image generation prompt (optional)</label>
        <textarea
          value={block.image_prompt ?? ''}
          onChange={(e) => onChange({ image_prompt: e.target.value || undefined })}
          rows={2}
          placeholder="Detailed AI image generation prompt — shown as placeholder until image is uploaded…"
          className="w-full px-3 py-2 bg-[#0B0F15] border border-white/10 rounded-lg
            text-sm text-white placeholder-white/25 resize-y focus:outline-none focus:border-orange-500/40 font-mono"
        />
      </div>
    </div>
  );
}
