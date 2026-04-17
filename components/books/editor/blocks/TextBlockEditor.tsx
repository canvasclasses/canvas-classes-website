'use client';

import { useRef, useState } from 'react';
import { ImagePlus, Upload, X } from 'lucide-react';
import { TextBlock } from '@/types/books';
import { UploadFn } from '../BookWorkspace';

interface Props {
  block: TextBlock;
  onChange: (p: Partial<TextBlock>) => void;
  /**
   * When provided, the "Insert image" picker enables drag/drop upload.
   * If omitted, the picker still works via URL input only.
   */
  onUpload?: UploadFn;
}

// Layout presets mirror INLINE_IMAGE_LAYOUTS in TextBlockRenderer.
// Any change here must be reflected there or the author will see a mismatch.
const LAYOUT_OPTIONS: { value: string; label: string; hint: string }[] = [
  { value: '',            label: 'Block (full width)', hint: 'Stands alone, no text wrap' },
  { value: 'right',       label: 'Float right',        hint: 'Text wraps on the left' },
  { value: 'left',        label: 'Float left',         hint: 'Text wraps on the right' },
  { value: 'right-sm',    label: 'Float right (small)',hint: 'Narrower float' },
  { value: 'left-sm',     label: 'Float left (small)', hint: 'Narrower float' },
  { value: 'center-half', label: 'Centred half-width', hint: 'Block, narrower than full' },
];

export default function TextBlockEditor({ block, onChange, onUpload }: Props) {
  const [showPicker, setShowPicker] = useState(false);
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [layout, setLayout] = useState('right');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function resetPicker() {
    setUrl(''); setAlt(''); setLayout('right'); setCaption('');
    setUploadError(''); setUploading(false);
  }

  async function handleFile(file: File) {
    if (!onUpload) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please drop an image file.');
      return;
    }
    setUploading(true);
    setUploadError('');
    try {
      const uploaded = await onUpload(file, block.id);
      setUrl(uploaded);
      // Auto-fill alt from filename if author hasn't typed anything
      if (!alt) setAlt(file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '));
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  /**
   * Build the markdown snippet and insert it at the textarea cursor position.
   * Forms:
   *   ![alt](url)                             → plain block image
   *   ![alt](url "right")                     → float right
   *   ![alt](url "right|Caption text")        → float right with caption
   */
  function handleInsert() {
    if (!url.trim()) {
      setUploadError('Paste a URL or upload a file first.');
      return;
    }
    // Caption with a `|` would break the split parse in the renderer — escape
    // any user-typed `|` so captions survive the round trip.
    const safeCaption = caption.replace(/\|/g, '\\|').trim();
    const titleParts = [layout, safeCaption].filter(Boolean);
    const titleAttr = titleParts.length > 0 ? ` "${titleParts.join('|')}"` : '';
    const snippet = `![${alt.trim()}](${url.trim()}${titleAttr})`;

    const textarea = textareaRef.current;
    if (!textarea) {
      // No ref yet — append with a blank line separator
      onChange({ markdown: `${block.markdown}\n\n${snippet}\n\n` });
    } else {
      const start = textarea.selectionStart ?? block.markdown.length;
      const end = textarea.selectionEnd ?? start;
      const before = block.markdown.slice(0, start);
      const after = block.markdown.slice(end);
      // Ensure blank lines around the snippet so markdown treats it as its own block
      const needsLeadingNewline = before.length > 0 && !before.endsWith('\n\n');
      const needsTrailingNewline = after.length > 0 && !after.startsWith('\n\n');
      const prefix = needsLeadingNewline ? (before.endsWith('\n') ? '\n' : '\n\n') : '';
      const suffix = needsTrailingNewline ? (after.startsWith('\n') ? '\n' : '\n\n') : '';
      const next = `${before}${prefix}${snippet}${suffix}${after}`;
      onChange({ markdown: next });
      // Restore cursor focus after the inserted snippet
      requestAnimationFrame(() => {
        const newPos = before.length + prefix.length + snippet.length;
        textarea.focus();
        textarea.setSelectionRange(newPos, newPos);
      });
    }

    resetPicker();
    setShowPicker(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs text-white/40">Markdown (supports $LaTeX$)</label>
        <button
          type="button"
          onClick={() => setShowPicker(v => !v)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium
            text-white/55 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white/80
            transition-colors"
        >
          <ImagePlus size={12} />
          Insert image
        </button>
      </div>

      {showPicker && (
        <div className="rounded-lg border border-orange-500/20 bg-orange-500/[0.03] p-3 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-orange-300/80 uppercase tracking-wider">
              Insert inline image
            </span>
            <button
              type="button"
              onClick={() => { resetPicker(); setShowPicker(false); }}
              className="text-white/40 hover:text-white/80"
            >
              <X size={14} />
            </button>
          </div>

          {/* URL + upload */}
          <div className="flex gap-2">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste image URL or upload below"
              className="flex-1 px-2.5 py-1.5 bg-[#0B0F15] border border-white/10 rounded-md
                text-[13px] text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40"
            />
            {onUpload && (
              <>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-white/10 bg-white/5
                    hover:bg-white/10 text-[11px] text-white/60 transition-colors disabled:opacity-50"
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

          {/* Alt text */}
          <input
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Alt text (describe the image for accessibility)"
            className="w-full px-2.5 py-1.5 bg-[#0B0F15] border border-white/10 rounded-md
              text-[13px] text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40"
          />

          {/* Layout preset */}
          <div>
            <label className="text-[10px] text-white/40 mb-1 block">Layout</label>
            <div className="flex flex-wrap gap-1.5">
              {LAYOUT_OPTIONS.map(opt => (
                <button
                  key={opt.value || 'block'}
                  type="button"
                  onClick={() => setLayout(opt.value)}
                  title={opt.hint}
                  className={`px-2.5 py-1 rounded-md text-[11px] transition-colors
                    ${layout === opt.value
                      ? 'bg-orange-500 text-black font-bold'
                      : 'bg-white/5 border border-white/10 text-white/55 hover:border-white/20'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Caption (optional) */}
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Caption (optional) — e.g. 'Source: NASA' or 'Fig 1: cell structure'"
            className="w-full px-2.5 py-1.5 bg-[#0B0F15] border border-white/10 rounded-md
              text-[13px] text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40"
          />

          {uploadError && <p className="text-[11px] text-red-400">{uploadError}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => { resetPicker(); setShowPicker(false); }}
              className="px-3 py-1.5 rounded-md text-[11px] text-white/55 hover:text-white/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleInsert}
              disabled={!url.trim()}
              className="px-3 py-1.5 rounded-md text-[11px] font-bold bg-orange-500 text-black
                hover:bg-orange-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Insert at cursor
            </button>
          </div>
        </div>
      )}

      <textarea
        ref={textareaRef}
        value={block.markdown}
        onChange={(e) => onChange({ markdown: e.target.value })}
        rows={6}
        placeholder="Write content here…"
        className="w-full px-3 py-2 bg-[#0B0F15] border border-white/10 rounded-lg
          text-sm text-white placeholder-white/25 resize-y focus:outline-none focus:border-orange-500/40
          font-mono leading-relaxed"
      />
    </div>
  );
}
