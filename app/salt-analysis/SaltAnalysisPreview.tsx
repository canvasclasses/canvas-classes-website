'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Flame } from 'lucide-react';

// Flame-test cations in the order they cycle. Colours match real laboratory
// observations for the CBSE Class 12 flame test.
const FLAME_CATIONS = [
    {
        ion: 'Na⁺',
        name: 'Sodium',
        colour: 'Golden yellow',
        outer: '#fbbf24',
        inner: '#fde68a',
        glow: 'rgba(251, 191, 36, 0.45)',
    },
    {
        ion: 'K⁺',
        name: 'Potassium',
        colour: 'Lilac / violet',
        outer: '#a78bfa',
        inner: '#ddd6fe',
        glow: 'rgba(167, 139, 250, 0.45)',
    },
    {
        ion: 'Ca²⁺',
        name: 'Calcium',
        colour: 'Brick red',
        outer: '#ef4444',
        inner: '#fca5a5',
        glow: 'rgba(239, 68, 68, 0.45)',
    },
    {
        ion: 'Sr²⁺',
        name: 'Strontium',
        colour: 'Crimson',
        outer: '#e11d48',
        inner: '#fda4af',
        glow: 'rgba(225, 29, 72, 0.45)',
    },
    {
        ion: 'Ba²⁺',
        name: 'Barium',
        colour: 'Apple green',
        outer: '#84cc16',
        inner: '#d9f99d',
        glow: 'rgba(132, 204, 22, 0.45)',
    },
    {
        ion: 'Cu²⁺',
        name: 'Copper',
        colour: 'Blue-green',
        outer: '#14b8a6',
        inner: '#99f6e4',
        glow: 'rgba(20, 184, 166, 0.45)',
    },
];

const CYCLE_MS = 3500;

export default function SaltAnalysisPreview() {
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        const id = setInterval(
            () => setIdx((i) => (i + 1) % FLAME_CATIONS.length),
            CYCLE_MS,
        );
        return () => clearInterval(id);
    }, []);

    const c = FLAME_CATIONS[idx];

    return (
        <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-black shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]">
            {/* Live indicator */}
            <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                    Live preview
                </span>
            </div>

            {/* Section label */}
            <div className="absolute right-4 top-4 z-20 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                <Flame size={14} className="text-amber-400" />
                Flame test
            </div>

            {/* Soft halo behind the flame, colour-matched to current cation */}
            <div
                className="absolute left-1/2 top-1/2 h-3/5 w-3/5 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-[background] duration-1000"
                style={{ background: c.glow }}
            />

            {/* Stage */}
            <div className="absolute inset-0 flex items-end justify-center pb-20">
                <div className="relative flex flex-col items-center">
                    {/* Flame */}
                    <svg
                        width="120"
                        height="180"
                        viewBox="0 0 120 180"
                        className="flame-flicker"
                        aria-hidden="true"
                    >
                        <defs>
                            <radialGradient
                                id="flame-outer"
                                cx="50%"
                                cy="80%"
                                r="60%"
                            >
                                <stop offset="0%" stopColor={c.outer} stopOpacity="0.95" />
                                <stop offset="65%" stopColor={c.outer} stopOpacity="0.6" />
                                <stop offset="100%" stopColor={c.outer} stopOpacity="0" />
                            </radialGradient>
                            <radialGradient
                                id="flame-inner"
                                cx="50%"
                                cy="78%"
                                r="55%"
                            >
                                <stop offset="0%" stopColor={c.inner} stopOpacity="0.95" />
                                <stop offset="60%" stopColor={c.inner} stopOpacity="0.55" />
                                <stop offset="100%" stopColor={c.inner} stopOpacity="0" />
                            </radialGradient>
                            <radialGradient
                                id="flame-base"
                                cx="50%"
                                cy="50%"
                                r="50%"
                            >
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                            </radialGradient>
                        </defs>
                        {/* Outer flame body */}
                        <path
                            d="M60 10 C 30 60, 20 110, 60 168 C 100 110, 90 60, 60 10 Z"
                            fill="url(#flame-outer)"
                            style={{ transition: 'fill 1s' }}
                        />
                        {/* Inner brighter core */}
                        <path
                            d="M60 50 C 44 80, 42 120, 60 160 C 78 120, 76 80, 60 50 Z"
                            fill="url(#flame-inner)"
                            style={{ transition: 'fill 1s' }}
                        />
                        {/* Cool blue base around the wire */}
                        <ellipse cx="60" cy="158" rx="18" ry="10" fill="url(#flame-base)" />
                    </svg>

                    {/*
                      Platinum wire + handle.
                      The wire is shifted right by 50% of its own width so that
                      its LEFT edge (where the loop sits) aligns with the centre
                      of the parent column — i.e. directly under the flame.
                    */}
                    <div
                        className="relative -mt-3 h-1 w-32 rounded-full bg-gradient-to-r from-slate-300 via-white to-slate-400 shadow-[0_0_12px_rgba(255,255,255,0.6)]"
                        style={{ transform: 'translateX(50%)' }}
                    >
                        {/* Handle at far right end */}
                        <div className="absolute right-0 top-1/2 h-2.5 w-8 -translate-y-1/2 rounded-full bg-gradient-to-r from-slate-500 to-slate-700" />
                        {/* Platinum loop at left end — aligned under the flame */}
                        <div className="absolute left-0 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
                    </div>
                </div>
            </div>

            {/* Cation label (cycles in sync with flame colour) */}
            <div className="absolute inset-x-4 top-14 z-10 flex justify-center">
                <div
                    key={idx}
                    className="flame-label rounded-2xl border border-white/10 bg-black/40 px-4 py-2 backdrop-blur-md"
                >
                    <div className="flex items-baseline gap-3">
                        <span
                            className="text-2xl font-bold"
                            style={{ color: c.outer, transition: 'color 0.6s' }}
                        >
                            {c.ion}
                        </span>
                        <span className="text-sm font-medium text-slate-300">
                            {c.name}
                        </span>
                    </div>
                    <p className="text-xs text-slate-400">
                        Burns with a{' '}
                        <span className="font-semibold text-white">{c.colour}</span> flame
                    </p>
                </div>
            </div>

            {/* Bottom: progress dots + CTA */}
            <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-3 border-t border-white/5 bg-black/30 px-4 py-3 backdrop-blur-md">
                <div className="flex gap-1.5">
                    {FLAME_CATIONS.map((_, i) => (
                        <span
                            key={i}
                            className={`h-1 rounded-full transition-all duration-500 ${
                                i === idx
                                    ? 'w-5 bg-white'
                                    : 'w-1.5 bg-white/20'
                            }`}
                        />
                    ))}
                </div>
                <a
                    href="#dry-tests"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 transition hover:text-emerald-200"
                >
                    Try the simulator
                    <ArrowRight size={12} />
                </a>
            </div>

            <style jsx>{`
                .flame-flicker {
                    animation: flicker 2.4s ease-in-out infinite;
                    transform-origin: 50% 100%;
                    will-change: transform, filter;
                }
                @keyframes flicker {
                    0%,
                    100% {
                        transform: scaleY(1) scaleX(1);
                        filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.18));
                    }
                    25% {
                        transform: scaleY(1.05) scaleX(0.97);
                        filter: drop-shadow(0 0 16px rgba(255, 255, 255, 0.28));
                    }
                    50% {
                        transform: scaleY(0.97) scaleX(1.03);
                        filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.22));
                    }
                    75% {
                        transform: scaleY(1.04) scaleX(0.98);
                        filter: drop-shadow(0 0 14px rgba(255, 255, 255, 0.24));
                    }
                }

                .flame-label {
                    animation: labelIn 0.6s ease-out;
                }
                @keyframes labelIn {
                    0% {
                        opacity: 0;
                        transform: translateY(6px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .flame-flicker,
                    .flame-label {
                        animation: none;
                    }
                }
            `}</style>
        </div>
    );
}
