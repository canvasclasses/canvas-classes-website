'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, Loader2, Check, Copy, AlertCircle, ImageIcon } from 'lucide-react';

interface SVGDropZoneProps {
  questionId: string;
  fieldType: 'question' | 'solution';
  onUploaded: (markdownLink: string, cdnUrl: string) => void;
  compact?: boolean;
}

type UploadState = 'idle' | 'dragging' | 'uploading' | 'success' | 'error';

export default function SVGDropZone({ questionId, fieldType, onUploaded, compact = false }: SVGDropZoneProps) {
  const [state, setState] = useState<UploadState>('idle');
  const [lastUrl, setLastUrl] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (file: File) => {
    // Accept SVG and common image types
    const allowed = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    // Some OS/browsers send SVG as text/plain — check extension too
    const isSvgByExt = file.name.toLowerCase().endsWith('.svg');
    if (!allowed.includes(file.type) && !isSvgByExt) {
      setState('error');
      setErrorMsg('Only SVG/PNG/JPG/WebP files allowed');
      setTimeout(() => setState('idle'), 3000);
      return;
    }

    setState('uploading');
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('question_id', questionId);
      formData.append('field_type', fieldType);

      const res = await fetch('/api/v2/assets/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      const cdnUrl: string = data.data.file.cdn_url;
      const markdownLink = `![image](${cdnUrl})`;

      setLastUrl(cdnUrl);
      setState('success');
      onUploaded(markdownLink, cdnUrl);

      // Reset to idle after 4s so zone is reusable
      setTimeout(() => setState('idle'), 4000);
    } catch (err: any) {
      setState('error');
      setErrorMsg(err.message || 'Upload failed');
      setTimeout(() => setState('idle'), 4000);
    }
  }, [questionId, fieldType, onUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState('idle');
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  }, [upload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState('dragging');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState('idle');
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    // Reset input so same file can be re-uploaded
    e.target.value = '';
  }, [upload]);

  const copyUrl = useCallback(async () => {
    if (!lastUrl) return;
    await navigator.clipboard.writeText(`![image](${lastUrl})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [lastUrl]);

  // ── Compact mode (used inline, e.g. in options) ──────────────────────────
  if (compact) {
    return (
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => state === 'idle' && inputRef.current?.click()}
        className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded border border-dashed text-xs cursor-pointer transition-all select-none
          ${state === 'dragging' ? 'border-purple-400 bg-purple-900/30 text-purple-300' : ''}
          ${state === 'uploading' ? 'border-blue-500/50 bg-blue-900/20 text-blue-400 cursor-wait' : ''}
          ${state === 'success' ? 'border-green-500/50 bg-green-900/20 text-green-400' : ''}
          ${state === 'error' ? 'border-red-500/50 bg-red-900/20 text-red-400' : ''}
          ${state === 'idle' ? 'border-gray-700/50 text-gray-500 hover:border-purple-500/50 hover:text-purple-400 hover:bg-gray-800/30' : ''}
        `}
      >
        {state === 'uploading' && <Loader2 size={12} className="animate-spin" />}
        {state === 'success' && <Check size={12} />}
        {state === 'error' && <AlertCircle size={12} />}
        {state === 'idle' && <Upload size={12} />}
        {state === 'dragging' && <ImageIcon size={12} />}
        <span>
          {state === 'uploading' ? 'Uploading…' :
           state === 'success' ? 'Inserted!' :
           state === 'error' ? (errorMsg || 'Error') :
           state === 'dragging' ? 'Drop!' :
           'Drop SVG'}
        </span>
        <input ref={inputRef} type="file" accept=".svg,.png,.jpg,.jpeg,.webp,image/*" onChange={handleFileChange} className="hidden" />
      </div>
    );
  }

  // ── Full mode (question text / solution) ─────────────────────────────────
  return (
    <div className="flex flex-col gap-2">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => state === 'idle' && inputRef.current?.click()}
        className={`flex-1 min-h-[7rem] flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-all cursor-pointer select-none px-3 py-4
          ${state === 'dragging' ? 'border-purple-400 bg-purple-900/20 scale-[1.02]' : ''}
          ${state === 'uploading' ? 'border-blue-500/40 bg-blue-900/10 cursor-wait' : ''}
          ${state === 'success' ? 'border-green-500/50 bg-green-900/10' : ''}
          ${state === 'error' ? 'border-red-500/50 bg-red-900/10' : ''}
          ${state === 'idle' ? 'border-gray-700/50 hover:border-purple-500/60 hover:bg-gray-800/20 group' : ''}
        `}
      >
        {state === 'idle' && (
          <>
            <Upload size={20} className="text-gray-500 group-hover:text-purple-400 transition" />
            <span className="text-xs text-gray-500 group-hover:text-purple-400 text-center leading-snug transition">
              Drop SVG here<br />
              <span className="text-gray-600 group-hover:text-purple-500/70">or click to browse</span>
            </span>
          </>
        )}
        {state === 'dragging' && (
          <>
            <ImageIcon size={22} className="text-purple-400 animate-bounce" />
            <span className="text-xs text-purple-300 font-medium">Release to upload</span>
          </>
        )}
        {state === 'uploading' && (
          <>
            <Loader2 size={20} className="text-blue-400 animate-spin" />
            <span className="text-xs text-blue-400">Uploading to R2…</span>
          </>
        )}
        {state === 'success' && (
          <>
            <Check size={20} className="text-green-400" />
            <span className="text-xs text-green-400 text-center">Inserted into text!</span>
          </>
        )}
        {state === 'error' && (
          <>
            <AlertCircle size={20} className="text-red-400" />
            <span className="text-xs text-red-400 text-center">{errorMsg || 'Upload failed'}</span>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".svg,.png,.jpg,.jpeg,.webp,image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Copy link button — shown after successful upload */}
      {lastUrl && (
        <button
          onClick={copyUrl}
          title="Copy markdown link to clipboard"
          className={`flex items-center justify-center gap-1.5 px-2 py-1 rounded text-xs border transition
            ${copied
              ? 'border-green-500/50 bg-green-900/20 text-green-400'
              : 'border-gray-700/50 bg-gray-800/30 text-gray-400 hover:border-purple-500/50 hover:text-purple-400'
            }`}
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? 'Copied!' : 'Copy link'}
        </button>
      )}

      <p className="text-[10px] text-gray-600 text-center leading-tight">
        Uploads to Cloudflare R2.<br />Link auto-inserted into text.
      </p>
    </div>
  );
}
