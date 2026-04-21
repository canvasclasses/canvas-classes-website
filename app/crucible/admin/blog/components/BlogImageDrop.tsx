'use client';

import { useCallback, useRef, useState } from 'react';
import { Upload, Loader2, Check, AlertCircle, ImageIcon } from 'lucide-react';

type UploadState = 'idle' | 'dragging' | 'uploading' | 'success' | 'error';

interface Props {
  slug: string;
  onUploaded: (markdownLink: string, cdnUrl: string) => void;
  compact?: boolean;
}

export default function BlogImageDrop({ slug, onUploaded, compact = false }: Props) {
  const [state, setState] = useState<UploadState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (file: File) => {
    const allowed = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    const isSvgByExt = file.name.toLowerCase().endsWith('.svg');
    if (!allowed.includes(file.type) && !isSvgByExt) {
      setState('error');
      setErrorMsg('Only SVG / PNG / JPG / WebP / GIF');
      setTimeout(() => setState('idle'), 3000);
      return;
    }

    setState('uploading');
    setErrorMsg('');

    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('slug', slug || 'general');
      const res = await fetch('/api/blog/upload-image', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Upload failed');

      onUploaded(data.data.markdown, data.data.url);
      setState('success');
      setTimeout(() => setState('idle'), 2500);
    } catch (err) {
      setState('error');
      setErrorMsg(err instanceof Error ? err.message : 'Upload failed');
      setTimeout(() => setState('idle'), 4000);
    }
  }, [slug, onUploaded]);

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
    e.target.value = '';
  }, [upload]);

  const classes = compact
    ? 'flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-dashed text-xs cursor-pointer transition select-none'
    : 'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed min-h-[8rem] px-4 py-6 cursor-pointer transition select-none';

  const tint =
    state === 'dragging' ? 'border-orange-400 bg-orange-500/10 text-orange-300' :
    state === 'uploading' ? 'border-sky-500/40 bg-sky-900/20 text-sky-300 cursor-wait' :
    state === 'success' ? 'border-emerald-500/40 bg-emerald-900/20 text-emerald-300' :
    state === 'error' ? 'border-red-500/40 bg-red-900/20 text-red-300' :
    'border-white/10 text-gray-500 hover:border-orange-500/50 hover:text-orange-300 hover:bg-white/5';

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => state === 'idle' && inputRef.current?.click()}
      className={`${classes} ${tint}`}
    >
      {state === 'uploading' ? <Loader2 size={compact ? 14 : 22} className="animate-spin" /> :
       state === 'success' ? <Check size={compact ? 14 : 22} /> :
       state === 'error' ? <AlertCircle size={compact ? 14 : 22} /> :
       state === 'dragging' ? <ImageIcon size={compact ? 14 : 22} /> :
       <Upload size={compact ? 14 : 22} />}
      <span className={compact ? 'text-xs' : 'text-sm font-medium'}>
        {state === 'uploading' ? 'Uploading to R2…' :
         state === 'success' ? 'Inserted!' :
         state === 'error' ? (errorMsg || 'Error') :
         state === 'dragging' ? 'Release to upload' :
         compact ? 'Drop image' : 'Drop an image here or click to browse'}
      </span>
      {!compact && state === 'idle' && (
        <span className="text-xs text-gray-600">PNG · JPG · WebP · GIF · SVG · up to 10MB</span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".svg,.png,.jpg,.jpeg,.webp,.gif,image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
