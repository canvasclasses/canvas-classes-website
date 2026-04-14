'use client';

import { useRef, useState, useEffect } from 'react';
import { Upload, Mic, Square, Loader2 } from 'lucide-react';
import { AudioNoteBlock } from '@/types/books';
import { UploadFn } from '../BookWorkspace';

interface Props { block: AudioNoteBlock; onChange: (p: Partial<AudioNoteBlock>) => void; onUpload: UploadFn; }

export default function AudioNoteEditor({ block, onChange, onUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const fileRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      mediaRecorderRef.current?.stop();
    };
  }, []);

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

  // Pick the best supported MIME type for recording. Prefer webm (Chrome/Edge),
  // fall back to ogg (Firefox), then let the browser choose (Safari → mp4/aac).
  function getBestMimeType(): { mimeType: string; ext: string } {
    const candidates = [
      { mimeType: 'audio/webm;codecs=opus', ext: 'webm' },
      { mimeType: 'audio/webm',             ext: 'webm' },
      { mimeType: 'audio/ogg;codecs=opus',  ext: 'ogg'  },
      { mimeType: 'audio/ogg',              ext: 'ogg'  },
      { mimeType: 'audio/mp4',              ext: 'mp4'  },
    ];
    for (const c of candidates) {
      if (MediaRecorder.isTypeSupported(c.mimeType)) return c;
    }
    return { mimeType: '', ext: 'webm' }; // browser default
  }

  async function startRecording() {
    setUploadError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const { mimeType, ext } = getBestMimeType();
      const mr = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      const recordedMime = mr.mimeType.split(';')[0] || `audio/${ext}`;
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: recordedMime });
        const file = new File([blob], `recording-${Date.now()}.${ext}`, { type: recordedMime });
        setRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
        const elapsed = recordingTimeRef.current;
        setRecordingTime(0);
        setUploading(true);
        try {
          const url = await onUpload(file, block.id);
          onChange({ src: url, duration_sec: elapsed });
        } catch (e) {
          setUploadError(e instanceof Error ? e.message : 'Upload failed');
        } finally {
          setUploading(false);
        }
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setRecording(true);
      setRecordingTime(0);
      recordingTimeRef.current = 0;
      timerRef.current = setInterval(() => {
        recordingTimeRef.current += 1;
        setRecordingTime((t) => t + 1);
      }, 1000);
    } catch {
      setUploadError('Microphone access denied. Please allow microphone in browser settings.');
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
  }

  // Ref to track elapsed time inside the onstop closure
  const recordingTimeRef = useRef(0);

  function fmtTime(s: number) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
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

      {/* Record / Upload row */}
      <div className="flex gap-2">
        <input value={block.src} onChange={(e) => onChange({ src: e.target.value })}
          placeholder="Audio URL or record / upload"
          className="flex-1 px-3 py-2 bg-[#0B0F15] border border-white/10 rounded-lg
            text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40" />

        {/* Record button */}
        {recording ? (
          <button
            onClick={stopRecording}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-500/50
              bg-red-500/10 text-red-400 text-xs font-medium animate-pulse"
          >
            <Square size={13} className="fill-red-400" />
            {fmtTime(recordingTime)}
          </button>
        ) : (
          <button
            onClick={startRecording}
            disabled={uploading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10
              bg-white/5 hover:bg-red-500/10 hover:border-red-500/40 hover:text-red-400
              text-xs text-white/60 transition-colors disabled:opacity-50"
            title="Record audio"
          >
            <Mic size={13} />
            Record
          </button>
        )}

        {/* File upload */}
        <button onClick={() => fileRef.current?.click()} disabled={uploading || recording}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10
            bg-white/5 hover:bg-white/10 text-xs text-white/60 disabled:opacity-50">
          {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
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
