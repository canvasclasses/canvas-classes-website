'use client';

// Refined atmospheric background for the salt-analysis hero.
// Aurora mesh gradient + subtle molecular hex grid + slow flame-cycle
// + thin chromatography spectrum strip. No literal objects.
// All layers are pointer-events-none and respect prefers-reduced-motion.

export default function AnimatedLabBackground() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
        >
            {/* Aurora mesh: four large blurred blobs that drift slowly */}
            <div className="absolute inset-0">
                <div className="aurora-blob aurora-amber" />
                <div className="aurora-blob aurora-cyan" />
                <div className="aurora-blob aurora-violet" />
                <div className="aurora-blob aurora-emerald" />
            </div>

            {/* Subtle molecular hex grid pattern */}
            <svg
                className="absolute inset-0 h-full w-full opacity-[0.06]"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <pattern
                        id="hex-molecules"
                        x="0"
                        y="0"
                        width="80"
                        height="70"
                        patternUnits="userSpaceOnUse"
                    >
                        {/* Hexagon outline */}
                        <polygon
                            points="40,4 72,22 72,58 40,76 8,58 8,22"
                            fill="none"
                            stroke="rgba(148, 163, 184, 0.6)"
                            strokeWidth="0.7"
                        />
                        {/* Vertex nodes */}
                        <circle cx="40" cy="4" r="1.2" fill="rgba(148, 163, 184, 0.7)" />
                        <circle cx="72" cy="22" r="1.2" fill="rgba(148, 163, 184, 0.7)" />
                        <circle cx="72" cy="58" r="1.2" fill="rgba(148, 163, 184, 0.7)" />
                        <circle cx="40" cy="76" r="1.2" fill="rgba(148, 163, 184, 0.7)" />
                        <circle cx="8" cy="58" r="1.2" fill="rgba(148, 163, 184, 0.7)" />
                        <circle cx="8" cy="22" r="1.2" fill="rgba(148, 163, 184, 0.7)" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hex-molecules)" />
            </svg>

            {/* Slow flame-test color glow centered behind the headline */}
            <div className="lab-flame-glow absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60" />

            {/* Centre-out vignette to keep text contrast */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,6,23,0.5)_55%,rgba(2,6,23,0.85)_100%)]" />

            {/* Top edge fade so the navbar never fights the gradient */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-950/90 to-transparent" />

            {/* Bottom: thin chromatography spectrum strip */}
            <div className="absolute inset-x-0 bottom-0 h-[2px] spectrum-strip opacity-50" />
            {/* Soft halo above the strip */}
            <div className="absolute inset-x-0 bottom-0 h-12 spectrum-halo opacity-40" />

            <style jsx>{`
                .aurora-blob {
                    position: absolute;
                    border-radius: 9999px;
                    filter: blur(80px);
                    will-change: transform, opacity;
                }
                .aurora-amber {
                    width: 38vw;
                    height: 38vw;
                    top: -8%;
                    left: -10%;
                    background: radial-gradient(
                        circle,
                        rgba(245, 158, 11, 0.32) 0%,
                        rgba(245, 158, 11, 0) 70%
                    );
                    animation: drift1 26s ease-in-out infinite;
                }
                .aurora-cyan {
                    width: 42vw;
                    height: 42vw;
                    top: -12%;
                    right: -14%;
                    background: radial-gradient(
                        circle,
                        rgba(34, 211, 238, 0.28) 0%,
                        rgba(34, 211, 238, 0) 70%
                    );
                    animation: drift2 32s ease-in-out infinite;
                }
                .aurora-violet {
                    width: 36vw;
                    height: 36vw;
                    bottom: -10%;
                    left: 10%;
                    background: radial-gradient(
                        circle,
                        rgba(168, 85, 247, 0.22) 0%,
                        rgba(168, 85, 247, 0) 70%
                    );
                    animation: drift3 30s ease-in-out infinite;
                }
                .aurora-emerald {
                    width: 40vw;
                    height: 40vw;
                    bottom: -14%;
                    right: -8%;
                    background: radial-gradient(
                        circle,
                        rgba(16, 185, 129, 0.24) 0%,
                        rgba(16, 185, 129, 0) 70%
                    );
                    animation: drift4 36s ease-in-out infinite;
                }

                @keyframes drift1 {
                    0%,
                    100% {
                        transform: translate(0, 0) scale(1);
                    }
                    50% {
                        transform: translate(8vw, 6vw) scale(1.08);
                    }
                }
                @keyframes drift2 {
                    0%,
                    100% {
                        transform: translate(0, 0) scale(1);
                    }
                    50% {
                        transform: translate(-6vw, 8vw) scale(1.05);
                    }
                }
                @keyframes drift3 {
                    0%,
                    100% {
                        transform: translate(0, 0) scale(1);
                    }
                    50% {
                        transform: translate(10vw, -6vw) scale(1.1);
                    }
                }
                @keyframes drift4 {
                    0%,
                    100% {
                        transform: translate(0, 0) scale(1);
                    }
                    50% {
                        transform: translate(-8vw, -5vw) scale(1.06);
                    }
                }

                .lab-flame-glow {
                    background: radial-gradient(
                        ellipse at center,
                        rgba(250, 204, 21, 0.12) 0%,
                        rgba(34, 197, 94, 0.08) 35%,
                        rgba(59, 130, 246, 0.08) 65%,
                        transparent 100%
                    );
                    filter: blur(60px);
                    animation: flameCycle 22s ease-in-out infinite;
                }
                @keyframes flameCycle {
                    0%,
                    100% {
                        filter: blur(60px) hue-rotate(0deg);
                    }
                    25% {
                        filter: blur(60px) hue-rotate(35deg);
                    }
                    50% {
                        filter: blur(60px) hue-rotate(-25deg);
                    }
                    75% {
                        filter: blur(60px) hue-rotate(50deg);
                    }
                }

                /* Flame-test color spectrum: Na yellow → K lilac → Ca brick → Sr crimson → Ba apple-green → Cu blue-green */
                .spectrum-strip {
                    background: linear-gradient(
                        90deg,
                        rgba(250, 204, 21, 0) 0%,
                        rgba(250, 204, 21, 0.9) 8%,
                        rgba(167, 139, 250, 0.9) 25%,
                        rgba(220, 38, 38, 0.9) 42%,
                        rgba(225, 29, 72, 0.9) 58%,
                        rgba(132, 204, 22, 0.9) 75%,
                        rgba(20, 184, 166, 0.9) 92%,
                        rgba(20, 184, 166, 0) 100%
                    );
                    background-size: 200% 100%;
                    animation: spectrumShift 14s ease-in-out infinite;
                }
                .spectrum-halo {
                    background: linear-gradient(
                        to top,
                        rgba(250, 204, 21, 0.18),
                        rgba(167, 139, 250, 0.1) 35%,
                        transparent 100%
                    );
                    filter: blur(20px);
                }
                @keyframes spectrumShift {
                    0%,
                    100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .aurora-blob,
                    .lab-flame-glow,
                    .spectrum-strip {
                        animation: none !important;
                    }
                }
            `}</style>
        </div>
    );
}
