'use client';

import React, { useState, useRef } from 'react';
import MoleculeViewer from '../MoleculeViewer';
import { Level } from '../ConversionGame';
import { ArrowRight, Play, Square, Music, Check } from 'lucide-react';

const AudioPlayer = ({ url }: { url: string }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const toggle = () => {
        if (!audioRef.current) return;
        if (isPlaying) audioRef.current.pause();
        else audioRef.current.play();
    };

    return (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center gap-4 group">
            <button
                onClick={toggle}
                className="bg-amber-500 p-2.5 rounded-full text-black hover:bg-amber-400 hover:scale-110 active:scale-95 transition-all flex-shrink-0"
            >
                {isPlaying ? <Square size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
            </button>
            <div className="min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Voice Explanation Linked</span>
                    <Check size={10} className="text-emerald-500" />
                </div>
                <div className="text-[9px] opacity-40 truncate font-mono mt-0.5">{url}</div>
            </div>
            <audio
                ref={audioRef}
                src={url}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
            />
        </div>
    );
};

interface ArenaPreviewProps {
    level: Level;
}

const ArenaPreview: React.FC<ArenaPreviewProps> = ({ level }) => {
    return (
        <div className="flex-1 flex flex-col gap-10">
            {/* Conversion Path Preview */}
            <div className="bg-[#141414] border border-white/10 rounded-2xl p-8 flex flex-col items-center gap-8">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-2">
                        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                            <MoleculeViewer
                                smiles={level.start_smiles}
                                svg={level.start_svg}
                                width={180}
                                height={150}
                            />
                        </div>
                        <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Start</span>
                    </div>

                    <div className="flex flex-col items-center gap-2 text-slate-700">
                        <div className="flex gap-1">
                            {level.steps.map((_, i) => (
                                <ArrowRight key={i} size={24} className="-mx-1 opacity-20" />
                            ))}
                        </div>
                        <span className="text-[10px] font-bold opacity-20 uppercase tracking-widest">{level.steps.length} Steps</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                            <MoleculeViewer
                                smiles={level.target_smiles}
                                svg={level.target_svg}
                                width={180}
                                height={150}
                            />
                        </div>
                        <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Target</span>
                    </div>
                </div>

                <div className="w-full h-px bg-white/5" />

                <div className="w-full space-y-3">
                    <h4 className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Reagent Sequence</h4>
                    <div className="flex flex-wrap gap-2">
                        {level.steps.map((step, i) => (
                            <div key={i} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-bold font-handwriting">
                                {(step.reagent_display || step.reagent_id).replace(/<[^>]*>?/gm, '')}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Audio Preview */}
            {level.audio_url && (
                <AudioPlayer url={level.audio_url} />
            )}

            {/* Info Preview */}
            <div className="space-y-6">
                <div>
                    <h4 className="text-[10px] font-bold opacity-30 uppercase tracking-widest mb-2">Display Text</h4>
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-white leading-tight">{level.title}</h3>
                        <p className="text-sm text-slate-400 italic font-medium">"{level.description}"</p>
                    </div>
                </div>

                {level.explanation_svg && (
                    <div
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 flex justify-center overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: level.explanation_svg }}
                    />
                )}

                <div className="bg-[#1a1a1a] border-l-2 border-emerald-500 p-4 rounded-r-xl">
                    <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2">Mechanism Explanation</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        {level.explanation || "No explanation provided."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ArenaPreview;
