'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Sprout, BookOpenCheck, Atom, Stethoscope, ArrowRight, type LucideIcon } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// "Choose your path" — self-segmentation router.
// Every student lands on one page; this is where they pick their journey.
// Destinations are all real, existing hubs.
// ─────────────────────────────────────────────────────────────────────────────

type Path = {
    Icon: LucideIcon;
    eyebrow: string;
    title: string;
    blurb: string;
    href: string;
    accent: string;   // icon + hover text color
    ring: string;     // hover border color
    glow: string;     // radial glow tint on hover
};

const PATHS: Path[] = [
    {
        Icon: Sprout,
        eyebrow: 'Class 9 – 10',
        title: 'Build your foundation',
        blurb: 'All subjects, taught through interactive Live Books — the base every topper is built on.',
        href: '/class-9',
        accent: 'text-emerald-400',
        ring: 'hover:border-emerald-500/40',
        glow: 'from-emerald-500/15',
    },
    {
        Icon: BookOpenCheck,
        eyebrow: 'Class 11 – 12',
        title: 'Master the board syllabus',
        blurb: 'Physics, Chemistry & Maths in depth — with NCERT solutions and concept lectures. Biology coming soon.',
        href: '/class-11',
        accent: 'text-blue-400',
        ring: 'hover:border-blue-500/40',
        glow: 'from-blue-500/15',
    },
    {
        Icon: Atom,
        eyebrow: 'JEE',
        title: 'Crack JEE Main & Advanced',
        blurb: 'Previous-year questions and The Crucible — adaptive practice that finds your weak spots.',
        href: '/the-crucible',
        accent: 'text-orange-400',
        ring: 'hover:border-orange-500/40',
        glow: 'from-orange-500/15',
    },
    {
        Icon: Stethoscope,
        eyebrow: 'NEET',
        title: 'Prepare for NEET UG',
        blurb: 'Focused practice and a crash course built around what the exam actually asks.',
        href: '/neet-crash-course',
        accent: 'text-rose-400',
        ring: 'hover:border-rose-500/40',
        glow: 'from-rose-500/15',
    },
];

export default function PathRouterSection() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

    return (
        <section className="relative w-full bg-[#050505] px-4 md:px-6 py-20 md:py-24 overflow-hidden">
            <div ref={ref} className="relative z-10 max-w-[1180px] mx-auto">

                {/* Heading */}
                <div className="max-w-2xl mx-auto text-center mb-12">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-600 mb-4">
                        Start where you are
                    </p>
                    <h2 className="text-3xl md:text-4xl font-semibold text-white/90 leading-tight mb-4">
                        Which stage are you at?
                    </h2>
                    <p className="text-base text-zinc-500 leading-relaxed max-w-lg mx-auto">
                        Pick your class or exam and go straight to what matters — no hunting through menus.
                    </p>
                </div>

                {/* Path grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {PATHS.map((p, i) => (
                        <motion.div
                            key={p.eyebrow}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <Link
                                href={p.href}
                                className={`group relative flex flex-col h-full rounded-2xl border border-white/[0.07] bg-[#0d1117] p-6 overflow-hidden transition-all duration-300 ${p.ring}`}
                            >
                                {/* hover glow */}
                                <div className={`absolute -top-16 -right-10 w-40 h-40 rounded-full bg-gradient-to-b ${p.glow} to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                                <div className="relative flex items-center justify-between mb-5">
                                    <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                                        <p.Icon size={20} className={p.accent} />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-600">
                                        {p.eyebrow}
                                    </span>
                                </div>

                                <h3 className="relative text-lg font-semibold text-white/90 leading-snug mb-2">
                                    {p.title}
                                </h3>
                                <p className="relative text-[13px] text-zinc-500 leading-relaxed flex-1">
                                    {p.blurb}
                                </p>

                                <span className="relative mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium">
                                    <span className={`${p.accent} opacity-80 group-hover:opacity-100 transition-opacity`}>Explore</span>
                                    <ArrowRight size={13} className={`${p.accent} group-hover:translate-x-0.5 transition-transform`} />
                                </span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
