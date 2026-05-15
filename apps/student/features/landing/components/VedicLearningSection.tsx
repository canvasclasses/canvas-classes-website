'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Volume2, FlaskConical, Target } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// MANDALA — SVG geometric watermark, slow rotation, East-meets-West motif
// ─────────────────────────────────────────────────────────────────────────────

function Mandala() {
    const C = 300; // center

    // Generate petal circles evenly around a radius
    const petalRing = (r: number, count: number, pr: number) =>
        Array.from({ length: count }, (_, i) => {
            const a = (i * Math.PI * 2) / count;
            return (
                <circle
                    key={i}
                    cx={C + r * Math.cos(a)}
                    cy={C + r * Math.sin(a)}
                    r={pr}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="0.5"
                />
            );
        });

    // Generate spoke lines from inner radius to outer radius
    const spokes = (count: number, r1 = 24, r2 = 272) =>
        Array.from({ length: count }, (_, i) => {
            const a = (i * Math.PI * 2) / count;
            return (
                <line
                    key={i}
                    x1={C + r1 * Math.cos(a)} y1={C + r1 * Math.sin(a)}
                    x2={C + r2 * Math.cos(a)} y2={C + r2 * Math.sin(a)}
                    stroke="#f59e0b"
                    strokeWidth="0.25"
                />
            );
        });

    return (
        <motion.svg
            viewBox="0 0 600 600"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none select-none"
            style={{ opacity: 0.045 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 160, repeat: Infinity, ease: 'linear' }}
            aria-hidden="true"
        >
            {/* Center */}
            <circle cx={C} cy={C} r={7}  fill="#f59e0b" />
            <circle cx={C} cy={C} r={22} fill="none" stroke="#f59e0b" strokeWidth="1.2" />

            {/* Concentric rings */}
            {[60, 110, 165, 220, 272].map((r, i) => (
                <circle key={r} cx={C} cy={C} r={r} fill="none" stroke="#f59e0b"
                    strokeWidth={i === 4 ? 0.3 : 0.5} />
            ))}

            {/* Petal rings */}
            {petalRing(60,   8, 17)}
            {petalRing(110, 12, 14)}
            {petalRing(165, 16, 12)}
            {petalRing(220, 20, 10)}

            {/* Spokes */}
            {spokes(24)}
        </motion.svg>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const PILLARS = [
    {
        num: '01',
        sanskrit: 'श्रवणम्',
        roman: 'Shravanam',
        meaning: 'To Hear, Truly',
        Icon: Volume2,
        feature: 'Video Lectures & Audio',
        accentLine: 'from-amber-500 to-orange-400',
        text: 'text-amber-400',
        featureBg: 'bg-amber-950/50',
        featureBorder: 'border-amber-900/40',
        body: 'The guru speaks first. Before questioning is even possible, the student must truly hear — not multitask, not skim. Every lesson begins with Paaras Sir\'s voice, patient and precise, the way knowledge has always been transmitted between minds.',
        real: 'You\'ll hear how ionic equilibrium governs your kidneys. How thermodynamics beats at the heart of every engine, every ecosystem, every star.',
    },
    {
        num: '02',
        sanskrit: 'मननम्',
        roman: 'Mananam',
        meaning: 'To Question, Deeply',
        Icon: FlaskConical,
        feature: 'Simulations & Live Books',
        accentLine: 'from-blue-500 to-cyan-400',
        text: 'text-blue-400',
        featureBg: 'bg-blue-950/50',
        featureBorder: 'border-blue-900/40',
        body: 'The Vedic student was not expected to accept — they were expected to wrestle with ideas until doubt dissolved into clarity. Our simulations and live books put you in direct contact with the concept, not just a description of it.',
        real: 'You\'ll see Newton\'s laws animate in a satellite\'s orbit. Watch electrochemistry happen in real time. Connect bonding theory to the materials shaping the next century.',
    },
    {
        num: '03',
        sanskrit: 'निदिध्यासनम्',
        roman: 'Nididhyasanam',
        meaning: 'To Internalize, Completely',
        Icon: Target,
        feature: 'The Crucible',
        accentLine: 'from-emerald-500 to-teal-400',
        text: 'text-emerald-400',
        featureBg: 'bg-emerald-950/50',
        featureBorder: 'border-emerald-900/40',
        body: 'Knowledge that cannot survive pressure is not yet yours — it is borrowed. The Crucible places you in the arena, adaptive and honest, until the concept stops being something you recall and becomes something you simply are.',
        real: 'The student who truly internalises these ideas will not just clear JEE. They will see chemistry in every medicine, physics in every machine, and mathematics in every decision they ever make.',
    },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION
// ─────────────────────────────────────────────────────────────────────────────

export default function VedicLearningSection() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-8% 0px' });

    return (
        <section className="relative w-full py-28 md:py-36 px-6 overflow-hidden" style={{ backgroundColor: '#050505' }}>

            {/* ── Ambient glows — East (amber) + West (blue) ── */}
            <div
                className="absolute bottom-0 left-0 w-[700px] h-[700px] rounded-full blur-[220px] pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(180,83,9,0.13) 0%, transparent 70%)' }}
            />
            <div
                className="absolute bottom-0 right-0 w-[700px] h-[700px] rounded-full blur-[220px] pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(29,78,216,0.13) 0%, transparent 70%)' }}
            />
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-[160px] pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(217,119,6,0.06) 0%, transparent 70%)' }}
            />

            {/* ── Mandala watermark ── */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <Mandala />
            </div>

            <div ref={ref} className="relative z-10 max-w-6xl mx-auto">

                {/* ── Header ── */}
                <div className="text-center max-w-3xl mx-auto mb-20">

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-3 mb-7"
                    >
                        {/* Decorative line + label + line */}
                        <div className="h-px w-10 bg-gradient-to-r from-transparent to-amber-600/40" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-600/60">
                            ॥ The Canvas Philosophy ॥
                        </span>
                        <div className="h-px w-10 bg-gradient-to-l from-transparent to-amber-600/40" />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-[1.15] mb-7"
                    >
                        The curriculum gives you{' '}
                        <span className="text-amber-400/90">the formula.</span>
                        <br className="hidden md:block" />
                        {' '}We give you{' '}
                        <span className="text-amber-400/90">the universe behind it.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="text-base md:text-lg text-slate-400 font-light leading-relaxed"
                    >
                        Modern education turned knowledge into a transaction — study, score, move on. It forgot what the ancient Gurukul always knew: the purpose of learning is not to pass an exam. It is to become someone who sees the world differently. Canvas is built on that system — three movements that have always separated wisdom from information.
                    </motion.p>
                </div>

                {/* ── Three Pillars ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
                    {PILLARS.map((pillar, i) => {
                        const Icon = pillar.Icon;
                        return (
                            <motion.div
                                key={pillar.roman}
                                initial={{ opacity: 0, y: 32 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.7, delay: 0.3 + i * 0.13, ease: [0.22, 1, 0.36, 1] }}
                                className="relative flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
                            >
                                {/* Top accent */}
                                <div className={`h-px w-full bg-gradient-to-r ${pillar.accentLine}`} />

                                <div className="flex flex-col gap-5 p-6 flex-1">
                                    {/* Step number */}
                                    <span className="text-[10px] font-mono text-zinc-700 tracking-[0.2em]">{pillar.num}</span>

                                    {/* Sanskrit + transliteration + meaning */}
                                    <div>
                                        <p
                                            className={`text-[2rem] leading-tight font-medium mb-1.5 ${pillar.text}`}
                                            style={{ fontFamily: "'Noto Sans Devanagari', 'Mangal', Georgia, serif" }}
                                        >
                                            {pillar.sanskrit}
                                        </p>
                                        <p className="text-xs text-zinc-600 tracking-widest uppercase mb-1">{pillar.roman}</p>
                                        <p className="text-sm text-zinc-300 font-medium">{pillar.meaning}</p>
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px bg-white/[0.06]" />

                                    {/* Feature tag */}
                                    <div className="flex items-center gap-2.5">
                                        <div className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${pillar.featureBg} ${pillar.featureBorder}`}>
                                            <Icon size={11} className={pillar.text} />
                                        </div>
                                        <span className={`text-[11px] font-semibold uppercase tracking-wider ${pillar.text}`}>
                                            {pillar.feature}
                                        </span>
                                    </div>

                                    {/* Body */}
                                    <p className="text-sm text-slate-500 font-light leading-[1.75] flex-1">
                                        {pillar.body}
                                    </p>

                                    {/* Real-world line */}
                                    <div className="pt-4 border-t border-white/[0.04]">
                                        <p className="text-[11px] text-zinc-600 italic leading-relaxed">
                                            {pillar.real}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* ── Bottom awareness strip ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.65, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-8 rounded-2xl border border-white/[0.05] bg-white/[0.015] px-7 py-5 flex flex-col md:flex-row items-start md:items-center gap-4"
                >
                    <div className="shrink-0 flex items-center gap-3">
                        <div className="h-px w-8 bg-gradient-to-r from-amber-500/60 to-blue-500/60" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600">
                            Future-Ready Learning
                        </span>
                        <div className="h-px w-8 bg-gradient-to-r from-blue-500/60 to-amber-500/60 hidden md:block" />
                    </div>
                    <p className="text-sm text-slate-500 font-light leading-relaxed">
                        Every chapter on Canvas teaches not just what the textbook demands, but <em className="text-slate-400 not-italic font-normal">why it matters</em> — the real-world systems it explains, the problems it has already solved, and the ones it equips you to solve next. A student who learns this way arrives at university already thinking like a scientist.
                    </p>
                </motion.div>

            </div>
        </section>
    );
}
