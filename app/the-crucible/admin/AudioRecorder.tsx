import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Upload, Check, RefreshCw, Settings } from 'lucide-react';
import { uploadAsset } from '../../../lib/uploadUtils';

interface AudioRecorderProps {
    questionId: string;
    onUploadComplete: (url: string) => void;
    existingAudioUrl?: string; // To show existing state if any
}

export default function AudioRecorder({ questionId, onUploadComplete, existingAudioUrl }: AudioRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
    const [permissionGranted, setPermissionGranted] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        // Check for existing audio usage
        if (existingAudioUrl) {
            // Optional: Set some state to indicate existing audio
        }
    }, [existingAudioUrl]);

    const requestPermissions = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            setPermissionGranted(true);
            await loadDevices();
        } catch (err) {
            console.error('Error accessing microphone:', err);
            alert('Microphone permission is required to record audio.');
        }
    };

    const loadDevices = async () => {
        try {
            const deviceList = await navigator.mediaDevices.enumerateDevices();
            const audioInputs = deviceList.filter(device => device.kind === 'audioinput');
            setDevices(audioInputs);

            // Auto-select default or first available
            if (audioInputs.length > 0) {
                const defaultDevice = audioInputs.find(d => d.deviceId === 'default');
                setSelectedDeviceId(defaultDevice ? defaultDevice.deviceId : audioInputs[0].deviceId);
            }
        } catch (err) {
            console.error('Error listing devices:', err);
        }
    };

    const startRecording = async () => {
        if (!selectedDeviceId) {
            await requestPermissions();
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: { deviceId: { exact: selectedDeviceId } }
            });

            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);

                // Stop all tracks to release mic
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);

        } catch (err) {
            console.error('Error starting recording:', err);
            alert('Could not start recording context. Please check permissions.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleUpload = async () => {
        if (!audioBlob) return;
        setUploading(true);

        try {
            const filename = `${questionId}_audio.webm`;
            const file = new File([audioBlob], filename, { type: 'audio/webm' });

            // Use Supabase Storage
            const { url } = await uploadAsset(file, 'audio', questionId);

            onUploadComplete(url);
            setAudioBlob(null); // Reset after success
        } catch (err) {
            console.error('Upload error:', err);
            alert('Upload failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
        } finally {
            setUploading(false);
        }
    };

    const resetRecording = () => {
        setAudioBlob(null);
        setAudioUrl(null);
    };

    return (
        <div className="bg-gray-900/50 rounded-lg border border-gray-700 p-2 space-y-2">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 min-w-0">
                    <Mic size={12} className="text-gray-400 shrink-0" />
                    {permissionGranted ? (
                        <select
                            value={selectedDeviceId}
                            onChange={(e) => setSelectedDeviceId(e.target.value)}
                            className="bg-transparent text-[10px] text-gray-500 border-none outline-none truncate max-w-[80px]"
                        >
                            {devices.map(device => (
                                <option key={device.deviceId} value={device.deviceId}>
                                    {device.label || `Mic ${device.deviceId.slice(0, 3)}`}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <button onClick={requestPermissions} className="text-[10px] text-blue-400 hover:underline">
                            Mic
                        </button>
                    )}
                </div>

                {!audioBlob && (
                    <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`py-1 px-3 rounded-md flex items-center justify-center gap-1.5 text-[10px] font-bold transition-all ${isRecording
                            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                            : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                            }`}
                    >
                        {isRecording ? (
                            <>
                                <Square size={10} fill="currentColor" /> Stop
                            </>
                        ) : (
                            <>
                                <div className="w-2 h-2 rounded-full bg-red-500"></div> Record
                            </>
                        )}
                    </button>
                )}
            </div>

            {audioBlob && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                    <div className="bg-black/40 rounded-md p-1.5 flex items-center gap-2 border border-gray-800">
                        <button
                            onClick={() => { const a = new Audio(audioUrl!); a.play(); }}
                            className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center hover:bg-green-500/30 transition"
                        >
                            <Play size={10} fill="currentColor" />
                        </button>
                        <div className="h-1 flex-1 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full w-full bg-green-500/50"></div>
                        </div>
                        <span className="text-[10px] text-green-400 font-mono">Recorded</span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="flex-1 py-1 bg-green-600 hover:bg-green-500 text-white rounded-md text-[10px] font-bold flex items-center justify-center gap-1.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? (
                                <RefreshCw size={10} className="animate-spin" />
                            ) : (
                                <Upload size={10} />
                            )}
                            {uploading ? '...' : 'Save Audio'}
                        </button>

                        <button
                            onClick={resetRecording}
                            disabled={uploading}
                            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-lg text-xs font-bold transition disabled:opacity-50"
                        >
                            Discard
                        </button>
                    </div>
                </div>
            )}

            {existingAudioUrl && !audioBlob && !isRecording && (
                <div className="text-[10px] text-emerald-400/80 flex items-center gap-1.5 bg-emerald-900/10 p-2 rounded border border-emerald-500/10">
                    <Check size={10} /> Has existing audio note
                </div>
            )}
        </div>
    );
}
