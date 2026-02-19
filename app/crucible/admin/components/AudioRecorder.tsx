'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Upload, Trash2, Play, Pause } from 'lucide-react';

interface AudioRecorderProps {
  questionId: string;
  onAudioSaved: (audioUrl: string) => void;
  existingAudioUrl?: string;
}

export default function AudioRecorder({ questionId, onAudioSaved, existingAudioUrl }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(existingAudioUrl || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl && !existingAudioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl, existingAudioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const uploadAudio = async () => {
    if (!audioBlob) return;

    try {
      const formData = new FormData();
      formData.append('file', audioBlob, `solution_${questionId}.webm`);
      formData.append('question_id', questionId);
      formData.append('field_type', 'solution');

      const response = await fetch('/api/v2/assets/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        const cdnUrl = result.data?.file?.cdn_url || result.data?.url || '';
        onAudioSaved(cdnUrl);
        alert('Audio uploaded to Cloudflare R2 successfully!');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload audio');
    }
  };

  const deleteAudio = () => {
    if (confirm('Delete this audio recording?')) {
      setAudioBlob(null);
      if (audioUrl && !existingAudioUrl) URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      setRecordingTime(0);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Mic size={16} className="text-purple-400" />
          <span className="text-xs font-medium text-gray-400">Audio Solution</span>
        </div>
        {isRecording && (
          <span className="text-xs text-red-400 animate-pulse">
            Recording: {formatTime(recordingTime)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {!audioUrl ? (
          <>
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition"
              >
                <Mic size={14} />
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition"
              >
                <Square size={14} />
                Stop Recording
              </button>
            )}
          </>
        ) : (
          <>
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
            <button
              onClick={togglePlayback}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            {audioBlob && !existingAudioUrl && (
              <button
                onClick={uploadAudio}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition"
              >
                <Upload size={14} />
                Upload
              </button>
            )}
            <button
              onClick={deleteAudio}
              className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </>
        )}
      </div>

      {audioUrl && (
        <div className="mt-2 text-xs text-gray-500">
          {existingAudioUrl ? 'Saved audio available' : 'Audio recorded - click Upload to save'}
        </div>
      )}
    </div>
  );
}
