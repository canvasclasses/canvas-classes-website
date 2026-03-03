'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, Loader2, Check, Copy, AlertCircle, Video } from 'lucide-react';

interface VideoDropZoneProps {
    questionId: string;
    onUploaded: (videoUrl: string) => void;
}

type UploadState = 'idle' | 'dragging' | 'uploading' | 'success' | 'error';

export default function VideoDropZone({ questionId, onUploaded }: VideoDropZoneProps) {
    const [state, setState] = useState<UploadState>('idle');
    const [lastUrl, setLastUrl] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [copied, setCopied] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const upload = useCallback(async (file: File) => {
        // Accept MP4 and WebM video types
        const allowed = ['video/mp4', 'video/webm'];
        const isVideoByExt = file.name.toLowerCase().endsWith('.mp4') || file.name.toLowerCase().endsWith('.webm');

        if (!allowed.includes(file.type) && !isVideoByExt) {
            setState('error');
            setErrorMsg('Only MP4 or WebM files allowed');
            setTimeout(() => setState('idle'), 3000);
            return;
        }

        if (file.size > 50 * 1024 * 1024) {
            setState('error');
            setErrorMsg('Video size must be less than 50MB');
            setTimeout(() => setState('idle'), 4000);
            return;
        }

        setState('uploading');
        setErrorMsg('');

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('question_id', questionId);
            formData.append('field_type', 'solution');

            const res = await fetch('/api/v2/assets/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Upload failed');
            }

            const cdnUrl: string = data.data.file.cdn_url;

            setLastUrl(cdnUrl);
            setState('success');
            onUploaded(cdnUrl);

            // Reset to idle after 4s so zone is reusable
            setTimeout(() => setState('idle'), 4000);
        } catch (err: any) {
            setState('error');
            setErrorMsg(err.message || 'Upload failed');
            setTimeout(() => setState('idle'), 4000);
        }
    }, [questionId, onUploaded]);

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
        await navigator.clipboard.writeText(lastUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [lastUrl]);

    return (
        <div className="flex flex-col gap-2 w-full mt-2">
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => state === 'idle' && inputRef.current?.click()}
                className={`flex-1 min-h-[6rem] flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-all cursor-pointer select-none px-3 py-3
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
                            Drop MP4 Video here<br />
                            <span className="text-gray-600 group-hover:text-purple-500/70">or click to browse</span>
                        </span>
                    </>
                )}
                {state === 'dragging' && (
                    <>
                        <Video size={22} className="text-purple-400 animate-bounce" />
                        <span className="text-xs text-purple-300 font-medium">Release to upload</span>
                    </>
                )}
                {state === 'uploading' && (
                    <>
                        <Loader2 size={20} className="text-blue-400 animate-spin" />
                        <span className="text-xs text-blue-400">Uploading Video to R2…</span>
                    </>
                )}
                {state === 'success' && (
                    <>
                        <Check size={20} className="text-green-400" />
                        <span className="text-xs text-green-400 text-center">Video Uploaded!</span>
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
                    accept="video/mp4,video/webm"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            {lastUrl && (
                <button
                    onClick={copyUrl}
                    title="Copy direct video URL"
                    className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded text-[10px] font-bold tracking-wide uppercase border transition mx-auto
            ${copied
                            ? 'border-green-500/50 bg-green-900/20 text-green-400'
                            : 'border-gray-700/50 bg-gray-800/30 text-gray-400 hover:border-purple-500/50 hover:text-purple-400'
                        }`}
                >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? 'Copied URL!' : 'Copy Video URL'}
                </button>
            )}
        </div>
    );
}
