'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Type, Image as ImageIcon, Music, Trash2, Plus, ArrowRight, Save, ToggleLeft as Toggle, Mic, Square, Circle, Upload, X, RefreshCw, Play, Check } from 'lucide-react';
import { Level } from '../ConversionGame';
import { uploadAsset } from '../../../lib/uploadUtils';

interface LevelEditorProps {
    level: Level;
    onUpdate: (level: Level) => void;
    reagents: any[];
}

const SVGDropZone = ({ onSvgUpload, value, label }: { onSvgUpload: (svg: string) => void, value?: string, label: string }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleFile = (file: File) => {
        if (file && (file.type === 'image/svg+xml' || file.name.endsWith('.svg'))) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                onSvgUpload(content);
            };
            reader.readAsText(file);
        }
    };

    return (
        <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
            className={`
                relative border-2 border-dashed rounded-xl p-8 transition-all flex flex-col items-center justify-center gap-3
                ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}
                ${value ? 'border-emerald-500/30 bg-emerald-500/5' : ''}
            `}
        >
            <Upload size={24} className={value ? 'text-emerald-500' : 'text-slate-500'} />
            <div className="text-center">
                <p className="text-sm font-bold opacity-80">{value ? 'SVG Structure Loaded' : `Drop ${label} SVG`}</p>
                <p className="text-[10px] opacity-40">or click to browse</p>
            </div>
            {value && (
                <button
                    onClick={(e) => { e.stopPropagation(); onSvgUpload(''); }}
                    className="mt-2 text-[10px] text-red-500 font-bold uppercase hover:underline relative z-10"
                >
                    Clear Override
                </button>
            )}
            <input
                type="file"
                accept=".svg"
                className="hidden"
                id={`svg-upload-${label.replace(/\s+/g, '-')}`}
                onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            />
            <label htmlFor={`svg-upload-${label.replace(/\s+/g, '-')}`} className="absolute inset-0 cursor-pointer" />
        </div>
    );
};

const AudioRecorder = ({ onUploadSuccess, currentUrl, levelId }: { onUploadSuccess: (url: string | undefined) => void, currentUrl?: string, levelId: string }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<any>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                await uploadAudio(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            timerRef.current = setInterval(() => {
                setRecordingTime(t => t + 1);
            }, 1000);
        } catch (err) {
            console.error("Failed to start recording:", err);
            alert("Microphone access denied or not found.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const uploadAudio = async (blob: Blob) => {
        setIsUploading(true);
        try {
            const filename = `level_${levelId}_explanation.webm`;
            const file = new File([blob], filename, { type: 'audio/webm' });

            // Using the standardized uploadAsset which uses Supabase
            const { url } = await uploadAsset(file, 'audio', levelId);
            onUploadSuccess(url);
        } catch (err) {
            console.error("Upload failed:", err);
            alert("Failed to upload audio to cloud.");
        } finally {
            setIsUploading(false);
        }
    };

    const togglePlayback = () => {
        if (!audioRef.current) return;
        if (isPlaying) audioRef.current.pause();
        else audioRef.current.play();
    };

    if (isRecording) {
        return (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 px-4 h-11 rounded-xl">
                <div className="flex items-center gap-2 text-red-500 animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-current" />
                    <span className="text-xs font-mono font-bold">
                        {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                    </span>
                </div>
                <button onClick={stopRecording} className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg transition-all ml-2 shadow-lg shadow-red-500/20">
                    <Square size={14} fill="currentColor" />
                </button>
            </div>
        );
    }

    if (isUploading) {
        return (
            <div className="flex items-center gap-3 text-amber-500 px-5 h-11 bg-amber-500/5 rounded-xl border border-amber-500/20">
                <RefreshCw size={16} className="animate-spin" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Saving Audio...</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            {!currentUrl ? (
                <button
                    onClick={startRecording}
                    className="h-11 px-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all shadow-lg shadow-emerald-600/20 group"
                >
                    <Mic size={16} className="group-hover:scale-110 transition-transform" />
                    <span>Start Voice Recording</span>
                </button>
            ) : (
                <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/20 p-1 rounded-2xl h-11">
                    {isConfirmingDelete ? (
                        <div className="flex items-center gap-1.5 px-3">
                            <span className="text-[10px] font-bold uppercase text-red-400 mr-2">Delete Audio?</span>
                            <button onClick={() => { onUploadSuccess(undefined); setIsConfirmingDelete(false); }} className="text-[10px] bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-all font-bold">Yes</button>
                            <button onClick={() => setIsConfirmingDelete(false)} className="text-[10px] bg-white/10 text-white/60 px-3 py-1.5 rounded-lg hover:bg-white/20 hover:text-white transition-all font-bold">No</button>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={togglePlayback}
                                className="w-9 h-9 rounded-xl bg-emerald-500 text-black flex items-center justify-center hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all shadow-md shadow-emerald-500/20"
                            >
                                {isPlaying ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                            </button>
                            <div className="px-3 flex flex-col justify-center min-w-[100px]">
                                <p className="text-[10px] font-bold text-emerald-500 uppercase leading-tight">Audio Note</p>
                                <p className="text-[9px] opacity-30 truncate font-mono mt-0.5">Synced to cloud</p>
                            </div>
                            <button
                                onClick={() => setIsConfirmingDelete(true)}
                                className="w-9 h-9 rounded-xl hover:bg-red-500/10 text-white/10 hover:text-red-500 flex items-center justify-center transition-all group"
                                title="Delete audio note"
                            >
                                <X size={16} className="group-hover:rotate-90 transition-transform" />
                            </button>
                        </>
                    )}
                    <audio
                        ref={audioRef}
                        src={currentUrl}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onEnded={() => setIsPlaying(false)}
                        className="hidden"
                    />
                </div>
            )}
        </div>
    );
};

const LevelEditor: React.FC<LevelEditorProps> = ({ level, onUpdate, reagents }) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onUpdate({ ...level, [name]: value });
    };

    const handleStepChange = (index: number, field: string, value: string) => {
        const newSteps = [...level.steps];
        if (field === 'reagent_id') {
            const reagent = reagents.find(r => r.id === value);
            newSteps[index] = {
                ...newSteps[index],
                reagent_id: value,
                reagent_display: reagent?.display || value
            };
        } else {
            newSteps[index] = { ...newSteps[index], [field]: value };
        }
        onUpdate({ ...level, steps: newSteps });
    };

    const addStep = () => {
        const newSteps = [...level.steps, {
            step_order: level.steps.length + 1,
            reagent_id: reagents[0].id,
            reagent_display: reagents[0].display,
            mechanism_hint: "Add hint..."
        }];
        onUpdate({ ...level, steps: newSteps });
    };

    const removeStep = (index: number) => {
        const newSteps = level.steps.filter((_, i) => i !== index).map((s, i) => ({ ...s, step_order: i + 1 }));
        onUpdate({ ...level, steps: newSteps });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            {/* Header Info */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 text-emerald-500 mb-2">
                    <div className="p-2 bg-emerald-500/10 rounded-lg"><Type size={20} /></div>
                    <h2 className="text-xl font-bold">Metadata & Title</h2>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest opacity-40">Chapter</label>
                        <input name="chapter" value={level.chapter} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 focus:border-emerald-500/50 outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest opacity-40">Difficulty</label>
                        <select name="difficulty" value={level.difficulty} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 focus:border-emerald-500/50 outline-none appearance-none">
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                        </select>
                    </div>
                    <div className="col-span-2 space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest opacity-40">Level Title</label>
                        <input name="title" value={level.title} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 focus:border-emerald-500/50 outline-none" />
                    </div>
                    <div className="col-span-2 space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest opacity-40">Short Description</label>
                        <input name="description" value={level.description} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 focus:border-emerald-500/50 outline-none" />
                    </div>
                </div>
            </section>

            {/* Audio Section (Shifted to top as requested) */}
            <section className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                            <Mic size={14} /> Voice Explanation Note
                        </h3>
                        <p className="text-[10px] opacity-40">Narrate the mechanism or provide a hint for this conversion.</p>
                    </div>
                    <AudioRecorder
                        currentUrl={level.audio_url}
                        levelId={level.id}
                        onUploadSuccess={(url) => onUpdate({ ...level, audio_url: url || undefined })}
                    />
                </div>
            </section>

            {/* Structures Section */}
            <section className="space-y-8">
                <div className="flex items-center gap-3 text-blue-500 mb-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg"><ImageIcon size={20} /></div>
                    <h2 className="text-xl font-bold">Structure Representation</h2>
                </div>

                <div className="grid grid-cols-2 gap-10">
                    {/* Start Molecule */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold opacity-60">Start Structure</h3>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold opacity-30 uppercase">SMILES (Fallback)</label>
                                <input name="start_smiles" value={level.start_smiles} onChange={handleChange} className="w-full bg-[#141414] border border-white/5 rounded-lg px-3 py-2 text-xs font-mono" />
                            </div>
                            <SVGDropZone
                                label="Start"
                                value={level.start_svg}
                                onSvgUpload={(svg) => onUpdate({ ...level, start_svg: svg })}
                            />
                        </div>
                    </div>

                    {/* Target Molecule */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold opacity-60">Target Structure</h3>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold opacity-30 uppercase">SMILES (Fallback)</label>
                                <input name="target_smiles" value={level.target_smiles} onChange={handleChange} className="w-full bg-[#141414] border border-white/5 rounded-lg px-3 py-2 text-xs font-mono" />
                            </div>
                            <SVGDropZone
                                label="Target"
                                value={level.target_svg}
                                onSvgUpload={(svg) => onUpdate({ ...level, target_svg: svg })}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Explanation (Moved above steps) */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 text-amber-500 mb-2">
                    <div className="p-2 bg-amber-500/10 rounded-lg"><Music size={20} /></div>
                    <h2 className="text-xl font-bold">Detailed Explanation</h2>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest opacity-40">Hand-Drawn Mechanism (SVG)</label>
                        <SVGDropZone
                            label="Mechanism"
                            value={level.explanation_svg}
                            onSvgUpload={(svg) => onUpdate({ ...level, explanation_svg: svg })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest opacity-40">Final Explanation Message</label>
                        <textarea name="explanation" value={level.explanation || ''} onChange={handleChange} rows={4} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500/50 outline-none resize-none" />
                    </div>
                </div>
            </section>

            {/* Steps & Reagents */}
            <section className="space-y-8">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3 text-purple-500">
                        <div className="p-2 bg-purple-500/10 rounded-lg"><Toggle size={20} /></div>
                        <h2 className="text-xl font-bold">Conversion Steps</h2>
                    </div>
                    <button onClick={addStep} className="flex items-center gap-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 px-3 py-2 rounded-lg transition-all">
                        <Plus size={16} /> Add Step
                    </button>
                </div>

                <div className="space-y-4">
                    {level.steps.map((step, idx) => (
                        <div key={idx} className="bg-[#141414] border border-white/5 p-6 rounded-2xl relative group">
                            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-800 border border-white/10 rounded-full flex items-center justify-center text-[10px] font-bold">
                                {idx + 1}
                            </div>

                            <div className="grid grid-cols-12 gap-6 items-start">
                                <div className="col-span-4 space-y-2">
                                    <label className="text-[10px] font-bold opacity-30 uppercase">Required Reagent</label>
                                    <select
                                        value={step.reagent_id}
                                        onChange={(e) => handleStepChange(idx, 'reagent_id', e.target.value)}
                                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
                                    >
                                        {reagents.map(r => (
                                            <option key={r.id} value={r.id}>
                                                {(r.display || r.name || r.id).replace(/<[^>]*>?/gm, '')}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-7 space-y-2">
                                    <label className="text-[10px] font-bold opacity-30 uppercase">Mechanism Hint</label>
                                    <input value={step.mechanism_hint} onChange={(e) => handleStepChange(idx, 'mechanism_hint', e.target.value)} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
                                </div>
                                <div className="col-span-1 pt-6 flex justify-end">
                                    <button onClick={() => removeStep(idx)} className="p-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="col-span-12 space-y-2 border-t border-white/5 pt-4 mt-2">
                                    <label className="text-[10px] font-bold opacity-30 uppercase">Interim SVG (Optional)</label>
                                    <textarea
                                        value={step.molecule_interim_svg || ''}
                                        onChange={(e) => handleStepChange(idx, 'molecule_interim_svg', e.target.value)}
                                        placeholder="Optional interim SVG if shown during steps..."
                                        className="w-full h-20 bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-[10px] font-mono resize-none outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>


        </div>
    );
};

export default LevelEditor;
