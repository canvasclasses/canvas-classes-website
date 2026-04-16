'use client';

import { useRef, useState } from 'react';
import { Upload, ImageIcon } from 'lucide-react';
import { ImageBlock } from '@/types/books';
import { UploadFn } from '../BookWorkspace';

interface Props { block: ImageBlock; onChange: (p: Partial<ImageBlock>) => void; onUpload: UploadFn; }

const WIDTH_LABELS: Record<NonNullable<ImageBlock['width']>, string> = {
  full: 'Full',
  half: 'Half',
  third: 'Third',
};

const WIDTH_PREVIEW: Record<NonNullable<ImageBlock['width']>, string> = {
  full: 'w-full',
  half: 'w-1/2',
  third: 'w-1/3',
};

const ASPECT_RATIO_OPTIONS: { value: NonNullable<ImageBlock['aspect_ratio']> | 'natural'; label: string }[] = [
  { value: 'natural', label: 'Natural' },
  { value: '16:9',    label: '16 : 9'  },
  { value: '4:3',     label: '4 : 3'   },
  { value: '3:2',     label: '3 : 2'   },
  { value: '1:1',     label: '1 : 1'   },
  { value: '21:9',    label: '21 : 9'  },
];

export default function ImageBlockEditor({ block, onChange, onUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const width = block.width ?? 'full';

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please drop an image file (PNG, JPG, SVG, WebP).');
      return;
    }
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

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragging(true);
  }

  function onDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="flex flex-col gap-3">

      {/* Drop zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !block.src && fileRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed
          transition-colors cursor-pointer
          ${dragging
            ? 'border-orange-500/70 bg-orange-500/5'
            : block.src
              ? 'border-white/10 bg-transparent cursor-default'
              : 'border-white/15 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]'}
          ${block.src ? 'p-2' : 'p-6'}`}
      >
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/60 z-10">
            <p className="text-xs text-orange-400 animate-pulse">Uploading…</p>
          </div>
        )}

        {block.src ? (
          /* Live preview at selected width */
          <div className="w-full flex flex-col items-start gap-2">
            <div className={`${WIDTH_PREVIEW[width]} transition-all duration-200`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={block.src}
                alt={block.alt}
                className="w-full rounded-lg object-contain border border-white/10 max-h-64"
              />
            </div>
            <p className="text-[10px] text-white/30">
              Previewing at <span className="text-white/50 font-medium">{WIDTH_LABELS[width]}</span> width —
              change below to compare
            </p>
          </div>
        ) : (
          <>
            <ImageIcon size={28} className="text-white/20" />
            <p className="text-xs text-white/35 text-center">
              Drag &amp; drop an image here<br />
              <span className="text-white/20">or click to browse</span>
            </p>
          </>
        )}
      </div>

      {/* URL input + upload button (for when src is already set or manual URL) */}
      <div className="flex gap-2">
        <input
          value={block.src}
          onChange={(e) => onChange({ src: e.target.value })}
          placeholder="https://… or drag & drop above"
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

      {/* Width selector */}
      <div>
        <label className="text-xs text-white/40 mb-1 block">Width</label>
        <div className="flex gap-2">
          {(['full', 'half', 'third'] as const).map((w) => (
            <button key={w} onClick={() => onChange({ width: w })}
              className={`px-3 py-1 rounded-lg text-xs transition-colors
                ${width === w
                  ? 'bg-orange-500 text-black font-bold'
                  : 'bg-white/5 border border-white/10 text-white/50 hover:border-white/20'}`}>
              {WIDTH_LABELS[w]}
            </button>
          ))}
        </div>
      </div>

      {/* Aspect ratio selector */}
      <div>
        <label className="text-xs text-white/40 mb-1 block">Aspect Ratio</label>
        <div className="flex flex-wrap gap-2">
          {ASPECT_RATIO_OPTIONS.map(({ value, label }) => {
            const current = block.aspect_ratio ?? 'natural';
            return (
              <button
                key={value}
                onClick={() => onChange({ aspect_ratio: value === 'natural' ? undefined : value as ImageBlock['aspect_ratio'] })}
                className={`px-3 py-1 rounded-lg text-xs transition-colors
                  ${current === value
                    ? 'bg-violet-500 text-white font-bold'
                    : 'bg-white/5 border border-white/10 text-white/50 hover:border-white/20'}`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <p className="mt-1.5 text-[10px] text-white/30 leading-snug">
          Natural = image shows at its full real height. Any other ratio locks the display height and crops to fill.
        </p>
      </div>

      {/* Alignment selector — controls whether the image sits centred on its own row
          or floats to one side with text beside it */}
      <div>
        <label className="text-xs text-white/40 mb-1 block">Placement</label>
        <div className="flex gap-2">
          {([
            { key: 'center', label: 'Centre' },
            { key: 'left',   label: 'Left + text right' },
            { key: 'right',  label: 'Right + text left' },
          ] as const).map(({ key, label }) => {
            const current = block.align ?? 'center';
            return (
              <button key={key} onClick={() => onChange({ align: key })}
                className={`px-3 py-1 rounded-lg text-xs transition-colors
                  ${current === key
                    ? 'bg-sky-500 text-black font-bold'
                    : 'bg-white/5 border border-white/10 text-white/50 hover:border-white/20'}`}>
                {label}
              </button>
            );
          })}
        </div>
        <p className="mt-1.5 text-[10px] text-white/30 leading-snug">
          Centre = standalone figure. Left/Right = image floats to that side with the text below sitting beside it on desktop.
        </p>
      </div>

      {/* Side text — only meaningful when align is left or right */}
      {(block.align === 'left' || block.align === 'right') && (
        <div>
          <label className="text-xs text-white/40 mb-1 flex items-center justify-between">
            <span>Side text (markdown, sits next to the image)</span>
            <span className="text-[10px] text-white/25">Supports **bold**, *italic*, lists, $LaTeX$</span>
          </label>
          <textarea
            value={block.side_text ?? ''}
            onChange={(e) => onChange({ side_text: e.target.value })}
            rows={6}
            placeholder="Write the text that should appear beside the image…"
            className="w-full px-3 py-2 bg-[#0B0F15] border border-white/10 rounded-lg
              text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40
              font-mono leading-relaxed resize-y"
          />
        </div>
      )}
    </div>
  );
}
