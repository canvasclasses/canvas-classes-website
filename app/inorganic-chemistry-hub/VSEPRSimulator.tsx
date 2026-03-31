'use client';

import { useRef, useState } from 'react';
import { Maximize2, RotateCcw, Info } from 'lucide-react';

export default function VSEPRSimulator() {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleReload = () => {
        if (iframeRef.current) {
            iframeRef.current.src = '/simulators/vsepr.html';
        }
    };

    const handleFullscreen = () => {
        const el = iframeRef.current?.parentElement;
        if (!el) return;
        if (!document.fullscreenElement) {
            el.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
        } else {
            document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            {/* Section Header */}
            <div className="mb-6 relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    3D Interactive Simulation
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
                    VSEPR Theory <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">3D Sandbox</span>
                </h2>
                <p className="text-gray-400 text-[15px] max-w-2xl leading-relaxed">
                    Build any molecule by adding bonds and lone pairs. See the 3D geometry update live, with bond angles, hybridization, and teacher insights for every shape.
                </p>
            </div>

            {/* Info chips */}
            <div className="flex flex-wrap gap-2 mb-5">
                {[
                    { label: 'Linear → Pentagonal Bipyramidal', color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' },
                    { label: '30+ Example Molecules', color: 'bg-violet-500/10 border-violet-500/20 text-violet-300' },
                    { label: 'Bond Angle Hotspots', color: 'bg-pink-500/10 border-pink-500/20 text-pink-300' },
                    { label: 'Drag to Rotate', color: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300' },
                ].map(chip => (
                    <span key={chip.label} className={`inline-flex items-center px-3 py-1 rounded-lg border text-xs font-semibold ${chip.color}`}>
                        {chip.label}
                    </span>
                ))}
            </div>

            {/* Simulator Frame */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-indigo-500/10 bg-[#0B1120]" style={{ height: 'calc(100vh - 320px)', minHeight: '520px' }}>
                {/* Toolbar */}
                <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                    <button
                        onClick={handleReload}
                        title="Reload simulator"
                        className="p-2 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-gray-400 hover:text-white hover:bg-black/60 transition-all"
                    >
                        <RotateCcw size={15} />
                    </button>
                    <button
                        onClick={handleFullscreen}
                        title="Fullscreen"
                        className="p-2 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-gray-400 hover:text-white hover:bg-black/60 transition-all"
                    >
                        <Maximize2 size={15} />
                    </button>
                </div>

                <iframe
                    ref={iframeRef}
                    src="/simulators/vsepr.html"
                    className="w-full h-full border-0"
                    title="VSEPR Theory 3D Simulator"
                    allow="fullscreen"
                />
            </div>

            {/* Usage Guide */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    {
                        icon: '🔵',
                        title: 'Add Bonds & Lone Pairs',
                        desc: 'Use the + / − controls at the bottom of the viewport to change the number of bonds and lone pairs around the central atom.'
                    },
                    {
                        icon: '🔄',
                        title: 'Rotate the Molecule',
                        desc: 'Click and drag inside the 3D panel to rotate the molecule freely. Use scroll to zoom in or out.'
                    },
                    {
                        icon: '💡',
                        title: 'Tap the Angle Labels',
                        desc: 'Click the pink bond-angle labels to reveal a teacher\'s insight explaining why that specific angle exists.'
                    },
                ].map(tip => (
                    <div key={tip.title} className="flex gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/20 transition-all">
                        <span className="text-2xl shrink-0 mt-0.5">{tip.icon}</span>
                        <div>
                            <p className="text-sm font-bold text-white/90 mb-1">{tip.title}</p>
                            <p className="text-xs text-gray-500 leading-relaxed">{tip.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* JEE/NEET relevance note */}
            <div className="mt-5 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/15 flex gap-3 items-start">
                <Info size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-400 leading-relaxed">
                    <span className="text-indigo-300 font-semibold">JEE / NEET Relevance:</span> VSEPR questions appear almost every year. Focus on exceptions — <span className="text-white/80">SnCl₂ (95°)</span>, <span className="text-white/80">Cl₂O (111°)</span>, <span className="text-white/80">NF₃ (102°)</span>, and the Bent's Rule molecules in the sp³d family.
                </p>
            </div>
        </div>
    );
}
