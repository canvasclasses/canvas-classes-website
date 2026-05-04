'use client';

import Link from 'next/link';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { ArrowRight, Play, FileText, Volume2, Clock, BookOpen, Image as LucideImage, Atom, HelpCircle, TrendingUp, BarChart3, Trophy, AlertTriangle } from 'lucide-react';
import { ELEMENTS, CATEGORY_COLORS } from '../../lib/elementsData';

// ─────────────────────────────────────────────────────────────────────────────
// CARD SHELL
// ─────────────────────────────────────────────────────────────────────────────

interface BentoCardProps {
  title: string;
  tagline: string;
  href: string;
  topAccent: string;
  titleColor?: string;
  className?: string;
  children: React.ReactNode;
}

function BentoCard({
  title,
  tagline,
  href,
  topAccent,
  titleColor = 'text-white/80',
  className = '',
  children,
}: BentoCardProps) {
  return (
    <Link
      href={href}
      className={`group relative flex flex-col rounded-2xl border border-white/[0.07] bg-[#0d1117] overflow-hidden hover:border-white/[0.14] transition-all duration-300 ${className}`}
    >
      <div className={`absolute top-0 left-0 right-0 h-px ${topAccent}`} />
      <div className="flex-1 relative overflow-hidden min-h-0">{children}</div>
      <div className="shrink-0 px-5 py-3.5 border-t border-white/[0.05] flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium leading-tight ${titleColor}`}>{title}</p>
          <p className="text-[11px] text-zinc-600 mt-0.5 leading-tight">{tagline}</p>
        </div>
        <span className="flex items-center gap-1 text-[11px] text-zinc-700 group-hover:text-zinc-300 transition-colors">
          Try it
          <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. THE CRUCIBLE DEMO
// ─────────────────────────────────────────────────────────────────────────────

const CRUCIBLE_OPTIONS = [
  { id: 'A', text: 'CH₃⁺  — Methyl' },
  { id: 'B', text: 'CH₃CH₂⁺  — Primary' },
  { id: 'C', text: '(CH₃)₂CH⁺  — Secondary' },
  { id: 'D', text: '(CH₃)₃C⁺  — Tertiary' },
] as const;

const WRONG_ID   = 'A';
const CORRECT_ID = 'D';

const CRUCIBLE_FEATURES = [
  { Icon: Play,     label: 'Video Explanation', sub: 'Full audio walkthrough',  bg: 'bg-red-950/60',    border: 'border-red-900/40',    icon: 'text-red-400'    },
  { Icon: FileText, label: 'Handwritten Notes', sub: "Paaras Sir's own notes",  bg: 'bg-amber-950/60',  border: 'border-amber-900/40',  icon: 'text-amber-400'  },
  { Icon: Volume2,  label: 'Audio Explanation', sub: 'Concept explained live',  bg: 'bg-violet-950/60', border: 'border-violet-900/40', icon: 'text-violet-400' },
  { Icon: Clock,    label: 'Timed Practice',    sub: 'Real exam conditions',    bg: 'bg-blue-950/60',   border: 'border-blue-900/40',   icon: 'text-blue-400'   },
];

function CrucibleDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [resetKey, setResetKey] = useState(0);
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);

  const [secs, setSecs] = useState(167);
  useEffect(() => {
    const id = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 167)), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = Math.floor(secs / 60).toString().padStart(2, '0');
  const ss = (secs % 60).toString().padStart(2, '0');

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setResetKey((k) => k + 1); },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setPhase(0);
    const timers = [
      setTimeout(() => setPhase(1), 1600),
      setTimeout(() => setPhase(2), 2500),
      setTimeout(() => setPhase(3), 3300),
    ];
    const loop = setTimeout(() => setResetKey((k) => k + 1), 9500);
    return () => { timers.forEach(clearTimeout); clearTimeout(loop); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  const solutionVisible = phase >= 3;

  return (
    <div ref={containerRef} className="h-full flex select-none">
      <div className="flex-1 p-5 flex flex-col gap-3.5 border-r border-white/[0.05] min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">GOC · Class 11</span>
          <span className="text-[11px] font-mono text-zinc-500">{mm}:{ss}</span>
        </div>
        <p className="text-[13px] font-medium text-white/90 leading-snug">Which carbocation is the most stable?</p>
        <div className="flex flex-col gap-2">
          {CRUCIBLE_OPTIONS.map((opt) => {
            const isWrongPick = opt.id === WRONG_ID  && phase === 1;
            const isWrongDone = opt.id === WRONG_ID  && phase >= 2;
            const isCorrect   = opt.id === CORRECT_ID && phase >= 2;
            let row = 'border-white/[0.06] bg-white/[0.02] text-zinc-400';
            let bdg = 'border-white/15 text-zinc-500';
            if (isWrongPick) { row = 'border-white/[0.12] bg-white/[0.04] text-white'; bdg = 'border-white/30 text-white'; }
            if (isWrongDone) { row = 'bg-red-950/60 border-red-900/50 text-zinc-500';  bdg = 'border-red-900/60 text-red-500'; }
            if (isCorrect)   { row = 'bg-emerald-950/60 border-emerald-900/50 text-emerald-100'; bdg = 'border-emerald-800/60 text-emerald-400'; }
            return (
              <motion.div
                key={opt.id}
                animate={isWrongDone ? { x: [0, -5, 5, -3, 3, 0] } : { x: 0 }}
                transition={{ duration: 0.35 }}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs border transition-all duration-300 ${row}`}
              >
                <span className={`w-5 h-5 shrink-0 rounded-full border text-[10px] font-mono flex items-center justify-center transition-all duration-300 ${bdg}`}>{opt.id}</span>
                <span className="flex-1">{opt.text}</span>
                {isCorrect   && <span className="text-emerald-400 text-[10px] font-semibold shrink-0">✓ Correct</span>}
                {isWrongDone && <span className="text-red-500/80 text-[10px] shrink-0">✗</span>}
              </motion.div>
            );
          })}
        </div>
        <motion.div
          animate={solutionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.35 }}
          className="mt-auto px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]"
        >
          <p className="text-[9px] text-zinc-600 uppercase tracking-widest font-semibold mb-1.5">Solution unlocked</p>
          <div className="flex gap-1.5 flex-wrap">
            {['Video', 'Handwritten Notes', 'Audio'].map((s) => (
              <span key={s} className="text-[10px] text-zinc-400 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full">{s}</span>
            ))}
          </div>
        </motion.div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-[2px] rounded-full bg-white/[0.06]"><div className="h-full w-[43%] rounded-full bg-white/20" /></div>
          <span className="text-[9px] text-zinc-700">12 / 28</span>
        </div>
      </div>
      <div className="w-[168px] shrink-0 p-4 flex flex-col justify-center gap-0">
        <p className="text-[9px] text-zinc-700 uppercase tracking-widest font-semibold mb-3">Every question includes</p>
        <div className="flex flex-col divide-y divide-white/[0.04]">
          {CRUCIBLE_FEATURES.map(({ Icon, label, bg, border, icon }) => (
            <div key={label} className="py-3 flex items-center gap-3">
              <div className={`w-7 h-7 shrink-0 rounded-lg border flex items-center justify-center ${bg} ${border}`}>
                <Icon size={12} className={icon} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-zinc-300 font-medium leading-tight">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. LIVE BOOKS DEMO
// ─────────────────────────────────────────────────────────────────────────────

const LIVE_BOOK_TYPES = [
  { Icon: BookOpen,     label: 'Rich Text',      sub: 'Theory & explanations',   bg: 'bg-indigo-950/60',  border: 'border-indigo-900/40',  icon: 'text-indigo-400'  },
  { Icon: LucideImage,  label: 'Diagrams',        sub: 'Visual representations',  bg: 'bg-sky-950/60',     border: 'border-sky-900/40',     icon: 'text-sky-400'     },
  { Icon: Play,         label: 'Video Lectures',   sub: 'Full concept coverage',   bg: 'bg-red-950/60',     border: 'border-red-900/40',     icon: 'text-red-400'     },
  { Icon: Volume2,      label: 'Audio Notes',      sub: 'Listen while you revise', bg: 'bg-violet-950/60',  border: 'border-violet-900/40',  icon: 'text-violet-400'  },
  { Icon: Atom,         label: 'Simulations',      sub: 'Interactive experiments',  bg: 'bg-cyan-950/60',    border: 'border-cyan-900/40',    icon: 'text-cyan-400'    },
  { Icon: HelpCircle,   label: 'Practice Quiz',    sub: 'Test understanding',      bg: 'bg-emerald-950/60', border: 'border-emerald-900/40', icon: 'text-emerald-400' },
];

const WAVEFORM_HEIGHTS = [3, 5, 8, 4, 7, 9, 6, 3, 5, 8, 6, 4, 7, 5, 3, 6, 8, 4, 5, 3, 7, 9, 5, 3, 6, 8, 4, 5];

function LiveBooksDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [resetKey, setResetKey] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setResetKey((k) => k + 1); },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setActiveIdx(0);
    const id = setInterval(() => setActiveIdx((i) => (i + 1) % 6), 2200);
    return () => clearInterval(id);
  }, [resetKey]);

  const scrollOffset = activeIdx <= 3 ? 0 : (activeIdx - 3) * 50;

  return (
    <div ref={containerRef} className="h-full flex select-none">
      {/* Book page preview — scrolling content with all media types */}
      <div className="flex-1 border-r border-white/[0.05] flex flex-col overflow-hidden min-w-0">
        <div className="px-4 pt-4 pb-2">
          <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-semibold">Science · Class 9</span>
          <p className="text-[13px] font-medium text-white/90 mt-1">Structure of the Atom</p>
        </div>

        <div className="flex-1 px-4 pb-3 overflow-hidden relative">
          <motion.div
            className="flex flex-col gap-2.5"
            animate={{ y: -scrollOffset }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            {/* 0 — Text */}
            <div className={`rounded-lg p-2.5 transition-all duration-500 ${activeIdx === 0 ? 'bg-indigo-950/25 ring-1 ring-indigo-400/15' : ''}`}>
              <div className="flex flex-col gap-[3px]">
                {[100, 88, 94, 72].map((w, i) => (
                  <div key={i} className="h-[3px] rounded-full bg-white/[0.08]" style={{ width: `${w}%` }} />
                ))}
              </div>
            </div>

            {/* 1 — Diagram / Image */}
            <div className={`rounded-lg transition-all duration-500 ${activeIdx === 1 ? 'ring-1 ring-sky-400/15' : ''}`}>
              <div className="h-16 rounded-lg bg-sky-950/20 border border-sky-900/15 flex items-center justify-center gap-3 px-3">
                <svg width="44" height="44" viewBox="0 0 44 44" className="shrink-0">
                  <circle cx="22" cy="22" r="4" fill="rgba(56,189,248,0.3)" />
                  <circle cx="22" cy="22" r="10" fill="none" stroke="rgba(56,189,248,0.2)" strokeWidth="0.7" strokeDasharray="2 2" />
                  <circle cx="22" cy="22" r="17" fill="none" stroke="rgba(56,189,248,0.12)" strokeWidth="0.7" strokeDasharray="2 2" />
                  <circle cx="32" cy="22" r="1.5" fill="rgba(56,189,248,0.5)" />
                  <circle cx="22" cy="12" r="1.5" fill="rgba(56,189,248,0.5)" />
                  <circle cx="10" cy="26" r="1.5" fill="rgba(56,189,248,0.4)" />
                  <circle cx="36" cy="14" r="1.5" fill="rgba(56,189,248,0.3)" />
                </svg>
                <div>
                  <p className="text-[9px] text-sky-400/50 font-medium">Bohr&apos;s Atomic Model</p>
                  <p className="text-[8px] text-zinc-700">Electron shell arrangement</p>
                </div>
              </div>
            </div>

            {/* Spacer text */}
            <div className="flex flex-col gap-[3px] px-1">
              {[90, 75].map((w, i) => (
                <div key={i} className="h-[3px] rounded-full bg-white/[0.06]" style={{ width: `${w}%` }} />
              ))}
            </div>

            {/* 2 — Video */}
            <div className={`rounded-lg transition-all duration-500 ${activeIdx === 2 ? 'ring-1 ring-red-400/15' : ''}`}>
              <div className="h-14 rounded-lg bg-black/40 border border-white/[0.06] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 to-transparent" />
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center z-10">
                  <Play size={10} className="text-white/70 ml-0.5" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/[0.06]">
                  <motion.div
                    key={`vid-${activeIdx === 2}`}
                    className="h-full rounded-full bg-red-400/40"
                    initial={{ width: activeIdx === 2 ? '0%' : '35%' }}
                    animate={{ width: activeIdx === 2 ? '100%' : '35%' }}
                    transition={{ duration: activeIdx === 2 ? 2.2 : 0.3, ease: 'linear' }}
                  />
                </div>
              </div>
            </div>

            {/* 3 — Audio */}
            <div className={`rounded-lg transition-all duration-500 ${activeIdx === 3 ? 'ring-1 ring-violet-400/15' : ''}`}>
              <div className="h-9 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center gap-2 px-2.5 relative overflow-hidden">
                <div className="w-5 h-5 rounded-full bg-violet-950/60 border border-violet-900/30 flex items-center justify-center shrink-0 z-10">
                  <Volume2 size={8} className="text-violet-400" />
                </div>
                <div className="flex-1 flex items-center gap-[2px] h-4 relative">
                  {WAVEFORM_HEIGHTS.map((h, i) => (
                    <div key={i} className="flex-1 bg-violet-400/30 rounded-full" style={{ height: `${h * 10}%` }} />
                  ))}
                  {activeIdx === 3 && (
                    <motion.div
                      className="absolute top-0 bottom-0 w-px bg-violet-400/60"
                      initial={{ left: '0%' }}
                      animate={{ left: '100%' }}
                      transition={{ duration: 2.2, ease: 'linear' }}
                    />
                  )}
                </div>
                <span className="text-[8px] text-zinc-600 shrink-0 z-10">3:42</span>
              </div>
            </div>

            {/* Spacer text */}
            <div className="flex flex-col gap-[3px] px-1">
              {[95, 80].map((w, i) => (
                <div key={i} className="h-[3px] rounded-full bg-white/[0.06]" style={{ width: `${w}%` }} />
              ))}
            </div>

            {/* 4 — Simulation */}
            <div className={`rounded-lg transition-all duration-500 ${activeIdx === 4 ? 'ring-1 ring-cyan-400/15' : ''}`}>
              <div className="h-14 rounded-lg bg-cyan-950/15 border border-cyan-900/15 flex items-center gap-3 px-3">
                <div className="relative w-10 h-10 shrink-0">
                  <div className="absolute inset-1 rounded-full border border-cyan-400/15" />
                  <div className="absolute inset-3 rounded-full border border-cyan-400/10" />
                  <motion.div
                    className="absolute w-2 h-2 rounded-full bg-cyan-400/50"
                    animate={{ x: [14, 0, -14, 0, 14], y: [0, -14, 0, 14, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                    style={{ left: '50%', top: '50%', marginLeft: -4, marginTop: -4 }}
                  />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-cyan-400/25" />
                </div>
                <div>
                  <p className="text-[9px] text-cyan-400/50 font-medium">Electron Configuration</p>
                  <p className="text-[8px] text-zinc-700">Drag electrons to fill orbitals</p>
                </div>
              </div>
            </div>

            {/* 5 — Quiz */}
            <div className={`rounded-lg p-2.5 transition-all duration-500 ${activeIdx === 5 ? 'bg-emerald-950/20 ring-1 ring-emerald-400/15' : ''}`}>
              <p className="text-[10px] text-white/60 mb-1.5">How many electrons in Carbon&apos;s outermost shell?</p>
              <div className="flex gap-1.5">
                {['2', '4', '6', '8'].map((o) => (
                  <div key={o} className={`px-2 py-0.5 rounded-md text-[10px] border transition-all duration-500 ${
                    o === '4' && activeIdx === 5 ? 'bg-emerald-950/60 border-emerald-900/50 text-emerald-200' : 'border-white/[0.06] text-zinc-600'
                  }`}>{o}</div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0d1117] to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Content types panel — mirrors Crucible features layout */}
      <div className="w-[156px] shrink-0 p-3 flex flex-col justify-center gap-0">
        <p className="text-[8px] text-zinc-700 uppercase tracking-widest font-semibold mb-2">Every chapter includes</p>
        <div className="flex flex-col divide-y divide-white/[0.04]">
          {LIVE_BOOK_TYPES.map(({ Icon, label, bg, border, icon }, i) => (
            <div key={label} className={`py-[7px] flex items-center gap-2.5 transition-all duration-500 ${i === activeIdx ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-6 h-6 shrink-0 rounded-md border flex items-center justify-center ${bg} ${border}`}>
                <Icon size={10} className={icon} />
              </div>
              <p className="text-[10px] text-zinc-300 font-medium leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. INTERACTIVE PERIODIC TABLE DEMO — Hero card, full 18-col grid
// ─────────────────────────────────────────────────────────────────────────────

// O(1) lookup — same dataset the real PT page uses
const ELEMENTS_BY_SYM = Object.fromEntries(ELEMENTS.map(el => [el.symbol, el]));

// Diverse cycle across all blocks (s/p/d/f) and periods 2-6
const PT_DEMO_CYCLE = [
  'Na', 'Fe', 'Cr', 'Cu', 'N', 'Ca', 'Br', 'K', 'Ag', 'Ce', 'Be', 'C', 'Mg', 'Mn', 'Au',
] as const;

// Oxide badge styles — keys match oxideNature in elementsData ('basic' | 'acidic' | 'amphoteric' | 'neutral')
const OXIDE_BADGE: Record<string, string> = {
  basic:      'text-emerald-400 bg-emerald-950/60 border-emerald-900/40',
  acidic:     'text-red-400 bg-red-950/60 border-red-900/40',
  amphoteric: 'text-amber-400 bg-amber-950/60 border-amber-900/40',
  neutral:    'text-zinc-400 bg-zinc-800/60 border-zinc-700/40',
};

const PT_FEATURES = [
  { label: 'spdf Block Summary',  color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.18)'  },
  { label: 'Nature of Oxide',     color: '#34d399', bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.18)'  },
  { label: 'Key Compounds',       color: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.18)'  },
  { label: 'Notable Exceptions',  color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.18)' },
];

// Features of the Interactive PT page — cycles in the left panel
const PT_PAGE_FEATURES = [
  { Icon: TrendingUp,    label: 'Property Heatmap',  sub: 'IE, EN & radius as colour map',  bg: 'bg-pink-950/60',    border: 'border-pink-900/40',    icon: 'text-pink-400'    },
  { Icon: BookOpen,      label: 'spdf Block Notes',   sub: '4 blocks · full JEE summaries',  bg: 'bg-blue-950/60',    border: 'border-blue-900/40',    icon: 'text-blue-400'    },
  { Icon: BarChart3,     label: 'Compare Elements',   sub: 'Side-by-side property table',    bg: 'bg-cyan-950/60',    border: 'border-cyan-900/40',    icon: 'text-cyan-400'    },
  { Icon: Trophy,        label: 'Built-in MCQ Quiz',  sub: 'Test yourself without switching',bg: 'bg-amber-950/60',   border: 'border-amber-900/40',   icon: 'text-amber-400'   },
  { Icon: AlertTriangle, label: 'Exceptions Mode',    sub: 'JEE anomalies · HIGH / MED / LOW',bg: 'bg-red-950/60',   border: 'border-red-900/40',     icon: 'text-red-400'     },
] as const;

function PeriodicTableDemo() {
  const [focusIdx, setFocusIdx] = useState(0);
  const [ptFeatureIdx, setPtFeatureIdx] = useState(0);
  const contentRef  = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollCtrl  = useAnimationControls();

  // Longer interval — gives the card time to auto-scroll through its content
  useEffect(() => {
    const id = setInterval(() => setFocusIdx(p => (p + 1) % PT_DEMO_CYCLE.length), 8000);
    return () => clearInterval(id);
  }, []);

  // Feature panel cycles independently
  useEffect(() => {
    const id = setInterval(() => setPtFeatureIdx(i => (i + 1) % PT_PAGE_FEATURES.length), 2200);
    return () => clearInterval(id);
  }, []);

  const sym     = PT_DEMO_CYCLE[focusIdx];
  const el      = ELEMENTS_BY_SYM[sym];
  const elColor = CATEGORY_COLORS[el?.category as keyof typeof CATEGORY_COLORS] ?? '#4dabf7';

  // On element change: reset scroll, then start auto-scroll after fade-in completes
  useEffect(() => {
    scrollCtrl.set({ y: 0 });
    const timer = setTimeout(() => {
      const content   = contentRef.current;
      const container = containerRef.current;
      if (content && container) {
        const overflow = content.offsetHeight - container.clientHeight + 20;
        if (overflow > 0) {
          scrollCtrl.start({
            y: -overflow,
            transition: {
              duration: Math.min(10, Math.max(4, overflow / 38)),
              ease:     'linear',
            },
          });
        }
      }
    }, 750); // wait for AnimatePresence fade-in to complete
    return () => clearTimeout(timer);
  }, [sym, scrollCtrl]);

  return (
    <div className="h-full flex select-none">

      {/* ── Far-left: PT page feature panel ── */}
      <div className="w-[155px] shrink-0 border-r border-white/[0.05] p-3 flex flex-col">
        <p className="text-[7.5px] text-zinc-700 uppercase tracking-[0.22em] font-semibold mb-2">Also explore</p>
        <div className="flex flex-col divide-y divide-white/[0.04]">
          {PT_PAGE_FEATURES.map(({ Icon, label, sub, bg, border, icon }, i) => (
            <div
              key={label}
              className={`py-[9px] flex items-center gap-2.5 transition-all duration-500 ${i === ptFeatureIdx ? 'opacity-100' : 'opacity-30'}`}
            >
              <div className={`w-6 h-6 shrink-0 rounded-md border flex items-center justify-center ${bg} ${border}`}>
                <Icon size={10} className={icon} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-zinc-300 font-medium leading-tight truncate">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Centre: periodic table grid ── */}
      <div className="flex-1 flex items-center justify-center min-w-0 overflow-hidden">
        <div
          className="grid shrink-0"
          style={{
            gridTemplateColumns: 'repeat(18, 20px)',
            gridTemplateRows:    'repeat(9,  20px)',
            gap: '1.5px',
          }}
        >
          {ELEMENTS.map((e) => {
            const active = e.symbol === sym;
            const ec = CATEGORY_COLORS[e.category as keyof typeof CATEGORY_COLORS] ?? '#888';
            return (
              <motion.div
                key={e.symbol}
                animate={active ? { scale: 1.3 } : { scale: 1 }}
                transition={{ duration: 0.3 }}
                className="rounded-[2px] flex flex-col items-center justify-center overflow-hidden"
                style={{
                  gridColumn:      e.col,
                  gridRow:         e.row,
                  backgroundColor: active ? ec + 'ee' : ec + '48',
                  border:         `1px solid ${active ? ec + 'ff' : ec + '40'}`,
                  color:           active ? '#fff'    : ec + 'cc',
                  zIndex:          active ? 10        : 0,
                  position:        'relative',
                }}
              >
                <span className="text-[3px] leading-none opacity-50">{e.atomicNumber}</span>
                <span className="text-[6px] font-bold leading-none">{e.symbol}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Subtle divider */}
      <div className="self-stretch w-px bg-white/[0.06] shrink-0" />

      {/* ── Right: auto-scrolling element card ── */}
      <div ref={containerRef} className="w-[218px] shrink-0 relative overflow-hidden">

        <AnimatePresence mode="wait">
          <motion.div
            key={sym}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Scrolling inner content */}
            <motion.div
              ref={contentRef}
              animate={scrollCtrl}
              className="p-3 flex flex-col gap-2.5"
            >

              {/* ── Header — coloured banner ── */}
              <div className="rounded-xl p-3 flex items-start justify-between gap-2"
                style={{ background: elColor + '22', border: `1px solid ${elColor}38` }}>
                <div className="min-w-0">
                  <p className="text-[22px] font-black leading-none" style={{ color: elColor }}>{sym}</p>
                  <p className="text-[10.5px] font-semibold text-white/90 mt-1 leading-tight">{el?.name}</p>
                  <p className="text-[8px] text-zinc-500 mt-0.5">{el?.category}</p>
                  {el?.electronConfig && (
                    <p className="text-[7px] font-mono text-zinc-700 mt-1">{el.electronConfig}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[15px] font-bold leading-none" style={{ color: elColor + 'bb' }}>{el?.atomicNumber}</p>
                  <p className="text-[8px] text-zinc-600 mt-1">{el?.atomicMass != null ? el.atomicMass.toFixed(3) : ''} u</p>
                  <span className="text-[7px] font-mono text-zinc-700 uppercase tracking-wide">{el?.block}-block</span>
                </div>
              </div>

              {/* ── Trend position ── */}
              {el?.trendPosition && (
                <p className="text-[8px] text-zinc-500 italic leading-relaxed pl-2.5 border-l-[2px]"
                  style={{ borderColor: elColor + '55' }}>{el.trendPosition}</p>
              )}

              {/* ── Key properties row ── */}
              {(el?.ionizationEnergy != null || el?.electronegativity != null || el?.atomicRadius != null) && (
                <div className="flex gap-1.5">
                  {el?.ionizationEnergy != null && (
                    <div className="flex-1 rounded-lg bg-white/[0.03] border border-white/[0.05] p-1.5 text-center">
                      <p className="text-[6px] text-zinc-700 uppercase tracking-wide">IE</p>
                      <p className="text-[9px] text-zinc-200 font-semibold tabular-nums mt-0.5">{el.ionizationEnergy}</p>
                      <p className="text-[6px] text-zinc-700">kJ/mol</p>
                    </div>
                  )}
                  {el?.electronegativity != null && (
                    <div className="flex-1 rounded-lg bg-white/[0.03] border border-white/[0.05] p-1.5 text-center">
                      <p className="text-[6px] text-zinc-700 uppercase tracking-wide">EN</p>
                      <p className="text-[9px] text-zinc-200 font-semibold tabular-nums mt-0.5">{el.electronegativity}</p>
                      <p className="text-[6px] text-zinc-700">Pauling</p>
                    </div>
                  )}
                  {el?.atomicRadius != null && (
                    <div className="flex-1 rounded-lg bg-white/[0.03] border border-white/[0.05] p-1.5 text-center">
                      <p className="text-[6px] text-zinc-700 uppercase tracking-wide">Radius</p>
                      <p className="text-[9px] text-zinc-200 font-semibold tabular-nums mt-0.5">{el.atomicRadius}</p>
                      <p className="text-[6px] text-zinc-700">pm</p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Anomalous Behavior ── */}
              {el?.anomalousBehavior && (
                <div className="rounded-xl border border-amber-900/30 bg-amber-950/15 p-2.5">
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <p className="text-[8px] font-bold uppercase tracking-wider text-amber-400">⚠ Anomalous Behavior</p>
                    <span className="text-[6.5px] px-1.5 py-0.5 rounded-full bg-amber-950/70 border border-amber-900/50 text-amber-500 shrink-0 uppercase tracking-wide">
                      JEE {el.anomalousBehavior.jeeRelevance}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {el.anomalousBehavior.facts.map((fact, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <div className="w-[4px] h-[4px] rounded-full bg-amber-600/70 shrink-0 mt-[5px]" />
                        <p className="text-[7.5px] text-zinc-400 leading-snug">{fact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Oxidation States ── */}
              {el?.oxidationStateCompounds && el.oxidationStateCompounds.length > 0 && (
                <div>
                  <p className="text-[7.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: elColor + 'bb' }}>
                    ⚡ Oxidation States
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {el.oxidationStateCompounds.map(({ state, compounds }) => (
                      <div key={state} className="flex items-start gap-2">
                        <span className="text-[9px] font-bold w-6 text-right shrink-0 leading-tight" style={{ color: elColor + '99' }}>+{state}</span>
                        <div className="flex flex-wrap gap-1">
                          {compounds.map(comp => (
                            <span key={comp} className="text-[7px] bg-white/[0.04] border border-white/[0.08] text-zinc-400 px-1.5 py-0.5 rounded">{comp}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Aquated Ion Colors (d/f block) ── */}
              {el?.ionColors && el.ionColors.length > 0 && (
                <div>
                  <p className="text-[7.5px] font-bold uppercase tracking-wider text-purple-400/80 mb-1.5">Aquated Ion Colors</p>
                  <div className="flex flex-col gap-1.5">
                    {el.ionColors.map(({ ion, config, color: ionColor, hexColor }) => (
                      <div key={ion} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: hexColor ?? '#888', boxShadow: `0 0 5px ${hexColor ?? '#888'}60` }} />
                        <span className="text-[8px] text-zinc-300 font-medium">{ion}</span>
                        <span className="text-[7px] text-zinc-700">({config})</span>
                        <span className="text-[7px] text-zinc-500 ml-auto">{ionColor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Oxides & Halides ── */}
              {((el?.oxides && el.oxides.length > 0) || (el?.halides && el.halides.length > 0)) && (
                <div className="flex flex-col gap-2">
                  {el?.oxides && el.oxides.length > 0 && (
                    <div>
                      <p className="text-[7px] text-zinc-600 uppercase tracking-wider mb-1">Oxides Formed</p>
                      <div className="flex flex-wrap gap-1">
                        {el.oxides.map(ox => (
                          <span key={ox} className="text-[7.5px] bg-white/[0.04] border border-white/[0.07] text-zinc-400 px-1.5 py-0.5 rounded">{ox}</span>
                        ))}
                      </div>
                      {el.oxideNatureDetails && (
                        <p className="text-[7px] text-zinc-700 italic mt-1 leading-snug">{el.oxideNatureDetails}</p>
                      )}
                    </div>
                  )}
                  {el?.halides && el.halides.length > 0 && (
                    <div>
                      <p className="text-[7px] text-zinc-600 uppercase tracking-wider mb-1">Halides Formed</p>
                      <div className="flex flex-wrap gap-1">
                        {el.halides.map(hal => (
                          <span key={hal} className="text-[7.5px] bg-white/[0.04] border border-white/[0.07] text-zinc-400 px-1.5 py-0.5 rounded">{hal}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Important Compounds ── */}
              {el?.compoundsInfo && el.compoundsInfo.length > 0 && (
                <div>
                  <p className="text-[7.5px] font-bold uppercase tracking-wider text-emerald-400/80 mb-1.5">Important Compounds</p>
                  <div className="flex flex-col gap-1.5">
                    {el.compoundsInfo.map(({ formula, color: compColor, hexColor, nature }) => (
                      <div key={formula} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: hexColor ?? '#888' }} />
                        <span className="text-[8px] text-zinc-300 font-medium">{formula}</span>
                        {nature && (
                          <span className={`text-[6.5px] px-1 py-0.5 rounded-full border ${OXIDE_BADGE[nature.toLowerCase()] ?? 'text-zinc-400 bg-zinc-800/60 border-zinc-700/40'}`}>
                            {nature}
                          </span>
                        )}
                        <span className="text-[7px] text-zinc-600 ml-auto">{compColor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Key Reactions ── */}
              {el?.keyReactions && el.keyReactions.length > 0 && (
                <div>
                  <p className="text-[7.5px] font-bold uppercase tracking-wider text-cyan-400/70 mb-1.5">Key Reactions</p>
                  <div className="flex flex-col gap-2">
                    {el.keyReactions.map((rxn, i) => (
                      <div key={i} className="rounded-lg bg-white/[0.02] border border-white/[0.05] p-2">
                        <p className="text-[7.5px] font-mono text-cyan-300/80 leading-snug">{rxn.equation}</p>
                        {rxn.conditions && (
                          <p className="text-[7px] text-zinc-600 mt-1">Conditions: <span className="text-zinc-500">{rxn.conditions}</span></p>
                        )}
                        {rxn.note && (
                          <p className="text-[7px] text-zinc-600 mt-0.5 italic">{rxn.note}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom clearance so last section clears the gradient fade */}
              <div className="h-8" />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Gradient fade at bottom — signals more content below */}
        <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-[#0d1117] to-transparent pointer-events-none z-10" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. FLAME TEST DEMO
// ─────────────────────────────────────────────────────────────────────────────

const FLAME_IONS = [
  { id: 'Na', name: 'Sodium',    symbol: 'Na⁺',  color: 'Golden Yellow', from: '#fef08a', via: '#eab308', to: '#f97316', hex: '#EAB308' },
  { id: 'K',  name: 'Potassium', symbol: 'K⁺',   color: 'Lilac',         from: '#e9d5ff', via: '#a855f7', to: '#7c3aed', hex: '#A855F7' },
  { id: 'Ca', name: 'Calcium',   symbol: 'Ca²⁺', color: 'Brick Red',     from: '#fca5a5', via: '#ef4444', to: '#c2410c', hex: '#EF4444' },
  { id: 'Cu', name: 'Copper',    symbol: 'Cu²⁺', color: 'Blue Green',    from: '#93c5fd', via: '#22d3ee', to: '#059669', hex: '#22d3ee' },
  { id: 'Li', name: 'Lithium',   symbol: 'Li⁺',  color: 'Crimson Red',   from: '#fda4af', via: '#e11d48', to: '#9f1239', hex: '#e11d48' },
  { id: 'Sr', name: 'Strontium', symbol: 'Sr²⁺', color: 'Crimson',       from: '#fecaca', via: '#dc2626', to: '#be185d', hex: '#DC2626' },
];

function FlameTestDemo() {
  const [ionIdx, setIonIdx] = useState(0);
  const [phase, setPhase] = useState<0 | 1>(0);
  useEffect(() => {
    if (phase === 0) {
      const t = setTimeout(() => setPhase(1), 700);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => { setPhase(0); setIonIdx((p) => (p + 1) % FLAME_IONS.length); }, 3000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const ion = FLAME_IONS[ionIdx];

  return (
    <div className="h-full flex flex-col select-none relative" style={{ background: 'linear-gradient(to bottom, #08090f, #040508)' }}>
      {/* Top labels */}
      <div className="px-4 pt-3 flex justify-between items-start z-20">
        <div>
          <p className="text-[9px] text-zinc-600 uppercase tracking-widest">Ion</p>
          <p className="text-sm font-semibold text-white/90">{ion.symbol}</p>
        </div>
        <AnimatePresence mode="wait">
          {phase === 1 && (
            <motion.div key={ion.id} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="text-right">
              <p className="text-[9px] text-zinc-600 uppercase tracking-widest">Flame</p>
              <p className="text-sm font-semibold" style={{ color: ion.hex }}>{ion.color}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Burner area — vertical layout */}
      <div className="flex-1 relative flex flex-col items-center justify-end pb-2 overflow-hidden">
        <AnimatePresence mode="wait">
          {phase === 1 && (
            <motion.div key={`glow-${ion.id}`} initial={{ opacity: 0 }} animate={{ opacity: 0.22 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 w-24 h-32 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: ion.hex }} />
          )}
        </AnimatePresence>
        <div className="relative flex flex-col items-center">
          <div className="relative w-12 h-24 flex items-end justify-center" style={{ filter: 'blur(3px)', mixBlendMode: 'screen' } as React.CSSProperties}>
            <motion.div animate={{ scaleY: [1, 1.06, 1] }} transition={{ repeat: Infinity, duration: 0.18 }} className="absolute bottom-0 w-3 h-10 bg-blue-600/80 rounded-full" />
            <AnimatePresence mode="wait">
              {phase === 1 && (
                <motion.div key={`flame-${ion.id}`} initial={{ scaleY: 0.2, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} exit={{ scaleY: 0.2, opacity: 0 }} transition={{ duration: 0.5 }}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8"
                  style={{ height: '100%', background: `linear-gradient(to top, ${ion.from}, ${ion.via}, ${ion.to})`, clipPath: 'polygon(50% 0%, 100% 70%, 80% 100%, 20% 100%, 0% 70%)', transformOrigin: 'bottom center' }} />
              )}
            </AnimatePresence>
          </div>
          <div className="flex flex-col items-center z-10">
            <div className="w-1.5 h-10 bg-zinc-600 rounded-t-sm" />
            <div className="w-12 h-3 bg-zinc-700 rounded-b-lg" />
          </div>
        </div>
      </div>

      {/* Bottom ion dots */}
      <div className="px-4 pb-3 flex justify-center gap-2.5 z-20">
        {FLAME_IONS.map((f, i) => (
          <div key={f.id} className="flex flex-col items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full transition-all duration-500"
              style={{
                backgroundColor: i === ionIdx ? f.hex : 'transparent',
                border: `1px solid ${i === ionIdx ? f.hex : 'rgba(255,255,255,0.12)'}`,
                boxShadow: i === ionIdx ? `0 0 6px ${f.hex}66` : 'none',
              }} />
            <span className={`text-[7px] transition-colors ${i === ionIdx ? 'text-zinc-400' : 'text-zinc-700'}`}>{f.id}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PHYSICS SIMULATIONS DEMO — pendulum + KE/PE bars
// ─────────────────────────────────────────────────────────────────────────────

function SimulationsDemo() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-4 select-none relative">
      <p className="absolute top-3 left-4 text-[9px] text-zinc-600 uppercase tracking-widest font-semibold">
        Pendulum · Conservation of Energy
      </p>
      {/* Pivot */}
      <div className="w-2 h-2 rounded-full bg-zinc-600 mt-6" />
      {/* String + bob */}
      <motion.div
        className="flex flex-col items-center"
        animate={{ rotate: [28, -28, 28] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        style={{ transformOrigin: 'top center' }}
      >
        <div className="w-px h-20 bg-zinc-500" />
        <div className="w-5 h-5 rounded-full bg-cyan-500/70 -mt-0.5" />
      </motion.div>
      {/* KE/PE bars */}
      <div className="absolute bottom-4 left-5 right-5 flex gap-4">
        <div className="flex-1">
          <p className="text-[8px] text-zinc-600 mb-1">KE</p>
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div className="h-full rounded-full bg-cyan-500/50"
              animate={{ width: ['8%', '92%', '8%'] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }} />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-[8px] text-zinc-600 mb-1">PE</p>
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div className="h-full rounded-full bg-violet-500/50"
              animate={{ width: ['92%', '8%', '92%'] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. FLASHCARD DEMO — cycling multi-card Q↔A
// ─────────────────────────────────────────────────────────────────────────────

const FLASHCARDS = [
  {
    q: 'Why does N have a higher first ionisation energy than O, even though oxygen has the greater atomic number?',
    a: "Nitrogen's half-filled 2p³ subshell is extra-stable due to exchange energy. Adding an electron to O forces spin-pairing in a 2p orbital, introducing repulsion — so ionising O is actually easier.",
  },
  {
    q: 'Why is CH₃COOH around 10¹¹× more acidic than C₂H₅OH when both contain an –OH group?',
    a: 'Resonance in the acetate ion delocalises the negative charge equally over both oxygens, greatly stabilising the conjugate base. Ethoxide has no resonance — its charge stays localised on one oxygen.',
  },
  {
    q: "Why does Cr adopt the configuration [Ar]3d⁵4s¹ instead of the expected [Ar]3d⁴4s²?",
    a: "A half-filled 3d⁵ subshell maximises exchange energy and gives perfectly symmetrical electron distribution — making it energetically more stable than the 3d⁴4s² arrangement.",
  },
];

const SR_BUTTONS = [
  { label: 'Again', bg: 'bg-red-950/70',     border: 'border-red-900/45',     text: 'text-red-400',     next: '<1m'  },
  { label: 'Hard',  bg: 'bg-amber-950/70',   border: 'border-amber-900/45',   text: 'text-amber-400',   next: '10m'  },
  { label: 'Good',  bg: 'bg-emerald-950/70', border: 'border-emerald-900/45', text: 'text-emerald-400', next: '1d'   },
  { label: 'Easy',  bg: 'bg-blue-950/70',    border: 'border-blue-900/45',    text: 'text-blue-400',    next: '4d'   },
] as const;

function FlashcardDemo() {
  const [cardIdx, setCardIdx] = useState(0);
  // phase 0 = Question · 1 = Answer · 2 = Answer + SR buttons
  const [phase, setPhase] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    setPhase(0);
    const t1 = setTimeout(() => setPhase(1), 2500);   // flip to answer
    const t2 = setTimeout(() => setPhase(2), 3400);   // reveal SR buttons
    const t3 = setTimeout(() => setCardIdx(i => (i + 1) % FLASHCARDS.length), 6800); // next card
    return () => [t1, t2, t3].forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardIdx]);

  const card    = FLASHCARDS[cardIdx];
  const flipped = phase >= 1;
  const showSR  = phase >= 2;

  return (
    <div className="h-full flex flex-col py-4 px-5 select-none">

      {/* ── Header ── */}
      <div className="flex items-center justify-between shrink-0 mb-3">
        <div>
          <p className="text-[9px] text-zinc-600 uppercase tracking-[0.2em] font-semibold">Chemistry Flashcards</p>
          <p className="text-[8.5px] text-purple-400/55 mt-0.5">Spaced repetition · 2,000+ cards</p>
        </div>
        <span className="text-[9px] text-zinc-700 tabular-nums">{cardIdx + 1} / {FLASHCARDS.length}</span>
      </div>

      {/* ── Fixed-height area: card stack + SR buttons ── */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <div className="w-full flex flex-col gap-2.5">

          {/* Card stack — ghost cards visible behind via rotation */}
          <div className="relative" style={{ height: '172px' }}>

            {/* Ghost 2 — deepest in the deck */}
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                background:   'rgba(59,7,100,0.30)',
                border:       '1px solid rgba(107,33,168,0.18)',
                transform:    'rotate(3.8deg)',
                transformOrigin: 'center bottom',
                zIndex: 0,
              }}
            />
            {/* Ghost 1 — one level up */}
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                background:   'rgba(59,7,100,0.42)',
                border:       '1px solid rgba(107,33,168,0.26)',
                transform:    'rotate(2deg)',
                transformOrigin: 'center bottom',
                zIndex: 1,
              }}
            />

            {/* Active card — flips between Q and A */}
            <AnimatePresence mode="wait">
              {!flipped ? (
                <motion.div
                  key={`q-${cardIdx}`}
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 rounded-2xl px-6 py-4 bg-purple-950/60 border border-purple-900/40 flex flex-col items-center justify-center text-center overflow-hidden"
                  style={{ zIndex: 2 }}
                >
                  <p className="text-[8px] text-zinc-600 uppercase tracking-[0.2em] mb-2.5 shrink-0">Question</p>
                  <p className="text-[12.5px] text-zinc-200 leading-relaxed font-medium">{card.q}</p>
                  <p className="text-[8px] text-zinc-700 mt-2.5 shrink-0">tap to reveal →</p>
                </motion.div>
              ) : (
                <motion.div
                  key={`a-${cardIdx}`}
                  initial={{ rotateY: -90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: 90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 rounded-2xl px-6 py-4 bg-emerald-950/50 border border-emerald-900/35 flex flex-col items-center justify-center text-center overflow-hidden"
                  style={{ zIndex: 2 }}
                >
                  <p className="text-[8px] text-zinc-600 uppercase tracking-[0.2em] mb-2.5 shrink-0">Answer</p>
                  <p className="text-[12.5px] text-white leading-relaxed font-medium">{card.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── SR Buttons — fade in after answer is revealed ── */}
          <motion.div
            animate={showSR ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            transition={{ duration: 0.22 }}
            className="shrink-0"
          >
            <p className="text-center text-[8px] text-zinc-600 mb-2">How well did you know this?</p>
            <div className="grid grid-cols-4 gap-1.5">
              {SR_BUTTONS.map(({ label, bg, border, text, next }) => (
                <div key={label} className={`flex flex-col items-center gap-0.5 py-2 rounded-xl border ${bg} ${border}`}>
                  <span className={`text-[10px] font-bold ${text}`}>{label}</span>
                  <span className="text-[7px] text-zinc-700">{next}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── Progress dots ── */}
      <div className="flex justify-center gap-2 mt-2.5 shrink-0">
        {FLASHCARDS.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${i === cardIdx ? 'w-4 h-1.5 bg-purple-400' : 'w-1.5 h-1.5 bg-zinc-800'}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. PERIODIC TRENDS DEMO — real data, cycling 3 properties
// ─────────────────────────────────────────────────────────────────────────────

const TREND_PROPERTIES = [
  { name: 'Ionization Energy', unit: 'kJ/mol', data: [
    { el: 'Li', value: 520 }, { el: 'Be', value: 899 }, { el: 'B', value: 801 },
    { el: 'C', value: 1086 }, { el: 'N', value: 1402 }, { el: 'O', value: 1314 }, { el: 'F', value: 1680 },
  ]},
  { name: 'Atomic Radius', unit: 'pm', data: [
    { el: 'Li', value: 152 }, { el: 'Be', value: 112 }, { el: 'B', value: 85 },
    { el: 'C', value: 77 }, { el: 'N', value: 75 }, { el: 'O', value: 66 }, { el: 'F', value: 64 },
  ]},
  { name: 'Electronegativity', unit: 'Pauling', data: [
    { el: 'Li', value: 0.98 }, { el: 'Be', value: 1.57 }, { el: 'B', value: 2.04 },
    { el: 'C', value: 2.55 }, { el: 'N', value: 3.04 }, { el: 'O', value: 3.44 }, { el: 'F', value: 3.98 },
  ]},
];

function TrendsDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [propIdx, setPropIdx] = useState(0);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPropIdx(0);
          setAnimating(false);
          requestAnimationFrame(() => setAnimating(true));
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const cycle = setInterval(() => {
      setAnimating(false);
      timer = setTimeout(() => {
        setPropIdx((i) => (i + 1) % TREND_PROPERTIES.length);
        setAnimating(true);
      }, 400);
    }, 3500);
    return () => { clearInterval(cycle); clearTimeout(timer); };
  }, []);

  const prop = TREND_PROPERTIES[propIdx];
  const maxVal = Math.max(...prop.data.map((d) => d.value));

  return (
    <div ref={ref} className="h-full flex flex-col p-3.5 select-none">
      <AnimatePresence mode="wait">
        <motion.p key={prop.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="text-[9px] text-zinc-600 uppercase tracking-widest font-semibold mb-2"
        >
          {prop.name} · Period 2 <span className="text-zinc-700 normal-case">({prop.unit})</span>
        </motion.p>
      </AnimatePresence>
      <div className="flex-1 flex items-end gap-[3px]">
        {prop.data.map((d, i) => (
          <div key={`${prop.name}-${d.el}`} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: animating ? `${(d.value / maxVal) * 85}%` : '0%' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
              className="w-full rounded-t-sm"
              style={{ background: 'linear-gradient(to top, #f472b6, #fb923c, #a3e635)' }}
            />
            <span className="text-[8px] text-zinc-600 leading-none">{d.el}</span>
          </div>
        ))}
      </div>
      {/* Property dots */}
      <div className="flex justify-center gap-1.5 mt-2">
        {TREND_PROPERTIES.map((_, i) => (
          <div key={i} className={`w-1 h-1 rounded-full transition-colors ${i === propIdx ? 'bg-pink-400' : 'bg-zinc-800'}`} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. ORGANIC REACTIONS DEMO — cycling reaction accordion
// ─────────────────────────────────────────────────────────────────────────────

const REACTIONS = [
  { name: 'Aldol Condensation',        type: 'Addition',            diff: 'Moderate' as const },
  { name: 'Cannizzaro Reaction',       type: 'Disproportionation',  diff: 'Hard'     as const },
  { name: 'Friedel-Crafts Alkylation', type: 'Substitution',        diff: 'Moderate' as const },
];

function ReactionsDemo() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % REACTIONS.length), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="h-full flex flex-col gap-1.5 p-3 select-none justify-center">
      {REACTIONS.map((r, i) => (
        <div
          key={r.name}
          className={`px-3 py-2 rounded-lg border text-[11px] transition-all duration-300 ${
            i === idx ? 'bg-white/[0.04] border-white/[0.12] text-white' : 'border-white/[0.04] text-zinc-600'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium truncate">{r.name}</span>
            {i === idx && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full shrink-0 ml-2 ${
                r.diff === 'Hard' ? 'bg-red-950/60 text-red-400' : 'bg-amber-950/60 text-amber-400'
              }`}>{r.diff}</span>
            )}
          </div>
          {i === idx && (
            <p className="text-[9px] text-zinc-500 mt-1">{r.type} reaction · Click to view mechanism</p>
          )}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. HANDWRITTEN NOTES DEMO — list with cycling download highlight
// ─────────────────────────────────────────────────────────────────────────────

const NOTES = [
  { title: 'Mole Concept',      cat: 'Physical'  },
  { title: 'Atomic Structure',   cat: 'Physical'  },
  { title: 'Chemical Bonding',   cat: 'Inorganic' },
  { title: 'GOC',                cat: 'Organic'   },
];

function NotesDemo() {
  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActiveIdx((i) => (i + 1) % NOTES.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="h-full flex flex-col gap-1 p-3 select-none justify-center">
      {NOTES.map((n, i) => (
        <div
          key={n.title}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-300 border ${
            i === activeIdx ? 'bg-white/[0.03] border-white/[0.10]' : 'border-transparent'
          }`}
        >
          <FileText size={12} className={i === activeIdx ? 'text-amber-400 shrink-0' : 'text-zinc-700 shrink-0'} />
          <div className="min-w-0">
            <p className={`text-[11px] font-medium leading-tight ${i === activeIdx ? 'text-zinc-200' : 'text-zinc-600'}`}>{n.title}</p>
            <p className="text-[9px] text-zinc-700">{n.cat}</p>
          </div>
          {i === activeIdx && <span className="ml-auto text-[9px] text-amber-400/70 shrink-0">PDF ↓</span>}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BENTO SHOWCASE
// ─────────────────────────────────────────────────────────────────────────────

export default function BentoShowcase() {
  return (
    <section className="w-full px-4 md:px-6 pt-20 pb-24 max-w-[1280px] mx-auto">

      {/* Section heading */}
      <div className="max-w-2xl mx-auto text-center mb-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-600 mb-4">
          The platform, in action
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold text-white/90 leading-tight mb-5">
          Built for how students actually learn
        </h2>
        <p className="text-base text-zinc-500 leading-relaxed max-w-lg mx-auto">
          Not just content — interactive tools, adaptive practice, and explanations designed by Paaras Sir that meet you where you are.
        </p>
      </div>

      {/* Grid — asymmetric bento: 3+1 → 1+3 → 1+2+1 → 2+2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">

        {/* Row 1 — Crucible (2) + Flashcard (2) ← balanced */}
        <BentoCard
          title="The Crucible"
          tagline="Adaptive question practice for JEE & NEET"
          href="/the-crucible"
          topAccent="bg-gradient-to-r from-orange-500 to-amber-400"
          titleColor="text-orange-400"
          className="md:col-span-2 lg:col-span-2 h-[430px]"
        >
          <CrucibleDemo />
        </BentoCard>

        <BentoCard
          title="Chemistry Flashcards"
          tagline="2,000+ cards · spaced repetition · all chapters"
          href="/chemistry-flashcards"
          topAccent="bg-white/15"
          className="md:col-span-2 lg:col-span-2 h-[430px]"
        >
          <FlashcardDemo />
        </BentoCard>

        {/* Row 2 — Simulations (1) + Periodic Table (3) ← right heavy */}
        <BentoCard
          title="Physics Simulations"
          tagline="Conservation of energy, motion, forces"
          href="/physics"
          topAccent="bg-white/15"
          className="h-[340px]"
        >
          <SimulationsDemo />
        </BentoCard>

        <BentoCard
          title="Interactive Periodic Table"
          tagline="Properties, compounds, exceptions & spdf block analysis"
          href="/interactive-periodic-table"
          topAccent="bg-gradient-to-r from-cyan-500 to-blue-500"
          titleColor="text-cyan-400"
          className="md:col-span-1 lg:col-span-3 h-[340px]"
        >
          <PeriodicTableDemo />
        </BentoCard>

        {/* Row 3 — FlameTest (1) + Live Books (2) + Trends (1) ← center focal */}
        <BentoCard
          title="Salt Analysis"
          tagline="Virtual flame tests & more"
          href="/salt-analysis"
          topAccent="bg-white/15"
          className="h-[300px]"
        >
          <FlameTestDemo />
        </BentoCard>

        <BentoCard
          title="Live Books"
          tagline="Read it. Hear it. See it. Do it."
          href="/live-books"
          topAccent="bg-gradient-to-r from-indigo-500 to-violet-500"
          titleColor="text-indigo-400"
          className="md:col-span-1 lg:col-span-2 h-[300px]"
        >
          <LiveBooksDemo />
        </BentoCard>

        <BentoCard
          title="Periodic Trends"
          tagline="Visualise atomic properties across any period"
          href="/periodic-trends"
          topAccent="bg-white/15"
          className="h-[300px]"
        >
          <TrendsDemo />
        </BentoCard>

        {/* Row 4 — Reactions (2) + Notes (2) ← balanced */}
        <BentoCard
          title="Organic Name Reactions"
          tagline="Full mechanism database for JEE & NEET"
          href="/organic-name-reactions"
          topAccent="bg-white/15"
          className="lg:col-span-2 h-[190px]"
        >
          <ReactionsDemo />
        </BentoCard>

        <BentoCard
          title="Handwritten Notes"
          tagline="Paaras Sir's notes — free PDF downloads"
          href="/handwritten-notes"
          topAccent="bg-white/15"
          className="lg:col-span-2 h-[190px]"
        >
          <NotesDemo />
        </BentoCard>

      </div>
    </section>
  );
}
