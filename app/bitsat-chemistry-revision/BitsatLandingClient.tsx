'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { usePlanProgress } from './usePlanProgress';
import {
    AlertTriangle,
    Brain,
    Calculator,
    ChevronDown,
    FlaskConical,
    Layers,
    Sparkles,
    Target,
    Timer,
    TrendingUp,
    Trophy,
} from 'lucide-react';

// =====================================================================
// DATA — Session 1 visualisations
// =====================================================================

type StatCard = {
    label: string;
    value: number;
    prefix?: string;
    suffix: string;
    accent: string;
    icon: React.ComponentType<{ className?: string; size?: number }>;
    sub: string;
};

const SESSION1_STATS: StatCard[] = [
    {
        label: 'Mark Handicap',
        value: 30,
        prefix: '−',
        suffix: '',
        accent: 'text-red-400',
        icon: AlertTriangle,
        sub: 'lost by JEE-only aspirants ignoring deleted chapters',
    },
    {
        label: 'Deleted-Syllabus Qs',
        value: 10,
        suffix: '/paper',
        accent: 'text-orange-400',
        icon: Layers,
        sub: 'from Polymers, Solid State, s-Block, Environmental',
    },
    {
        label: '"Mark for Review"',
        value: 130,
        suffix: ' Qs',
        accent: 'text-amber-400',
        icon: Timer,
        sub: 'button was missing — UI panic',
    },
    {
        label: 'LPP + Stats Qs',
        value: 5,
        suffix: '/section',
        accent: 'text-emerald-400',
        icon: TrendingUp,
        sub: 'free marks JEE students usually skip',
    },
];

type TopicSlice = { label: string; value: number; color: string };

const CHEM_DISTRIBUTION: TopicSlice[] = [
    { label: 'Physical Chemistry', value: 32, color: '#10b981' },
    { label: 'Organic Chemistry', value: 28, color: '#a855f7' },
    { label: 'Inorganic (niche)', value: 15, color: '#f97316' },
    { label: 'Deleted-syllabus', value: 25, color: '#ef4444' },
];

type BarItem = { label: string; value: number };

const MATHS_DISTRIBUTION: BarItem[] = [
    { label: 'LPP', value: 5 },
    { label: 'Statistics', value: 4 },
    { label: 'Probability', value: 4 },
    { label: 'Calculus', value: 3 },
    { label: 'Coordinate', value: 3 },
    { label: 'Vectors / 3D', value: 3 },
    { label: 'Algebra', value: 2 },
];

type ToneKey = 'red' | 'orange' | 'amber' | 'emerald' | 'purple';

const TONE_CLASSES: Record<ToneKey, { border: string; borderHover: string; iconBg: string; iconBorder: string; text: string }> = {
    red: {
        border: 'border-red-500/20',
        borderHover: 'hover:border-red-500/40',
        iconBg: 'bg-red-500/10',
        iconBorder: 'border-red-500/20',
        text: 'text-red-400',
    },
    orange: {
        border: 'border-orange-500/20',
        borderHover: 'hover:border-orange-500/40',
        iconBg: 'bg-orange-500/10',
        iconBorder: 'border-orange-500/20',
        text: 'text-orange-400',
    },
    amber: {
        border: 'border-amber-500/20',
        borderHover: 'hover:border-amber-500/40',
        iconBg: 'bg-amber-500/10',
        iconBorder: 'border-amber-500/20',
        text: 'text-amber-400',
    },
    emerald: {
        border: 'border-emerald-500/20',
        borderHover: 'hover:border-emerald-500/40',
        iconBg: 'bg-emerald-500/10',
        iconBorder: 'border-emerald-500/20',
        text: 'text-emerald-400',
    },
    purple: {
        border: 'border-purple-500/20',
        borderHover: 'hover:border-purple-500/40',
        iconBg: 'bg-purple-500/10',
        iconBorder: 'border-purple-500/20',
        text: 'text-purple-400',
    },
};

type Trap = { title: string; body: string; icon: React.ComponentType<{ className?: string; size?: number }>; tone: ToneKey };

const TRAPS: Trap[] = [
    {
        title: 'The Deleted-Syllabus Trap',
        body: 'BITSAT does NOT follow the reduced JEE syllabus. Polymers, Solid State, s-Block and Environmental Chemistry account for ~30 marks. Ignoring them = an automatic handicap.',
        icon: Layers,
        tone: 'red',
    },
    {
        title: 'The Calculation Trap',
        body: 'Physical Chemistry is now calculation-heavy with awkward numbers (e.g. 10.1 min half-life). No calculator allowed — approximation skill is the differentiator.',
        icon: Calculator,
        tone: 'orange',
    },
    {
        title: 'The Inorganic Trivia Trap',
        body: 'Niche fact-checks like "lightest metal" or "oxidation state of Fe in deoxymyoglobin" appear. Flashcards are the only viable defense.',
        icon: Brain,
        tone: 'amber',
    },
    {
        title: 'The UI Glitch Trap',
        body: '"Mark for Review" was missing for the first 130 questions in Session 1. Practise without it — track doubts on a physical rough sheet.',
        icon: AlertTriangle,
        tone: 'emerald',
    },
    {
        title: 'The Bonus-Question Trap',
        body: 'Bonus block was reported as "weirdly hard" with duplicate options. Unlock ONLY if you have 20+ minutes and 115+ confident attempts.',
        icon: Trophy,
        tone: 'purple',
    },
];

const FAQS = [
    {
        q: 'Why is BITSAT Chemistry harder than JEE Mains Chemistry?',
        a: 'BITSAT does not follow the reduced JEE syllabus. Polymers, Solid State, s-Block, Chemistry in Everyday Life and Environmental Chemistry account for 5–10 questions per paper — roughly 30 marks JEE-only aspirants typically lose.',
    },
    {
        q: 'Which Chemistry chapters were most asked in BITSAT Session 1?',
        a: 'Solid State, Polymers, Chemistry in Everyday Life, Electrochemistry, Chemical Kinetics, Stereoisomerism, Coordination Compounds — plus niche trivia like Polydispersity Index, Agostic interactions, oxidation state of Fe in deoxymyoglobin.',
    },
    {
        q: 'Is 30 days enough for BITSAT Chemistry?',
        a: 'Yes. Days 1–7 lock in the deleted syllabus — Day 5 adds Periodicity + Chemical Bonding. Days 8–17 build calculation stamina (Redox alongside Electrochemistry on Day 15). Days 18–25 cover GOC through full Organic. Days 26–30 handle Practical Chemistry and mock simulation.',
    },
    {
        q: 'How do I practise without a calculator the way BITSAT demands?',
        a: 'Round numbers to one significant figure first, then refine. Memorise log 2 = 0.30 and log 3 = 0.48. If a Physical Chemistry calculation takes more than 90 seconds, skip and return.',
    },
    {
        q: 'Should I attempt the BITSAT bonus questions?',
        a: 'Only if you have 20+ minutes left and have confidently attempted 115+ regular questions. The Session 1 bonus block was advanced and trap-heavy — high risk to your accuracy.',
    },
    {
        q: 'Is this BITSAT Chemistry plan free?',
        a: 'Yes — the entire 30-day plan and every linked resource (flashcards, interactive periodic table, one-shot lectures, handwritten notes) is completely free on Canvas Classes.',
    },
];

// =====================================================================
// HELPERS
// =====================================================================

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
    const [display, setDisplay] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const done = useRef(false);

    useEffect(() => {
        if (done.current || value === 0) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !done.current) {
                    done.current = true;
                    const dur = 1400;
                    const start = performance.now();
                    const tick = (now: number) => {
                        const t = Math.min((now - start) / dur, 1);
                        const eased = 1 - Math.pow(1 - t, 3);
                        setDisplay(Math.floor(eased * value));
                        if (t < 1) requestAnimationFrame(tick);
                        else setDisplay(value);
                    };
                    requestAnimationFrame(tick);
                }
            },
            { threshold: 0.4 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [value]);

    return (
        <span ref={ref}>
            {display}
            {suffix}
        </span>
    );
}

function DonutChart({ data, size = 220 }: { data: TopicSlice[]; size?: number }) {
    const total = data.reduce((s, d) => s + d.value, 0);
    const r = size / 2 - 18;
    const c = 2 * Math.PI * r;
    let acc = 0;

    return (
        <div className="flex flex-col md:flex-row items-center gap-6">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={28} />
                {data.map((slice) => {
                    const dash = (slice.value / total) * c;
                    const offset = c - acc;
                    acc += dash;
                    return (
                        <circle
                            key={slice.label}
                            cx={size / 2}
                            cy={size / 2}
                            r={r}
                            fill="none"
                            stroke={slice.color}
                            strokeWidth={28}
                            strokeDasharray={`${dash} ${c}`}
                            strokeDashoffset={offset}
                            transform={`rotate(-90 ${size / 2} ${size / 2})`}
                            strokeLinecap="butt"
                        />
                    );
                })}
                <text x="50%" y="46%" textAnchor="middle" className="fill-white font-bold" style={{ fontSize: 28 }}>
                    ~40
                </text>
                <text x="50%" y="60%" textAnchor="middle" className="fill-zinc-500" style={{ fontSize: 11 }}>
                    Chem Qs / paper
                </text>
            </svg>
            <div className="flex-1 grid grid-cols-1 gap-2.5 w-full">
                {data.map((slice) => (
                    <div key={slice.label} className="flex items-center justify-between gap-3 text-sm">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: slice.color }} />
                            <span className="text-zinc-300 truncate">{slice.label}</span>
                        </div>
                        <span className="text-white font-semibold tabular-nums">{slice.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function BarChart({ data }: { data: BarItem[] }) {
    const max = Math.max(...data.map((d) => d.value));
    return (
        <div className="space-y-2.5">
            {data.map((bar) => (
                <div key={bar.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-zinc-400">{bar.label}</span>
                        <span className="text-zinc-200 font-semibold tabular-nums">{bar.value} Qs</span>
                    </div>
                    <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${(bar.value / max) * 100}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

function FAQItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="rounded-xl bg-[#0B0F15] border border-white/[0.06] overflow-hidden">
            <button
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
            >
                <span className="text-sm md:text-base font-semibold text-white">{q}</span>
                <ChevronDown
                    size={18}
                    className={`shrink-0 text-zinc-400 transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <p className="px-5 pb-5 text-sm text-zinc-400 leading-relaxed">{a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// =====================================================================
// MAIN LANDING
// =====================================================================

export default function BitsatLandingClient() {
    const allTopics = useMemo(() => CHEM_DISTRIBUTION, []);
    const { resumeDay, hydrated } = usePlanProgress();

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            {/* ============ HERO ============ */}
            <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.12),transparent_60%)]" />
                <div className="relative max-w-6xl mx-auto px-5 md:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6 animate-fade-in">
                        <Target size={12} />
                        BITSAT 2026 · Session 2 Master Plan
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] max-w-4xl mx-auto animate-fade-in-up">
                        Crack BITSAT Chemistry in <span className="text-blue-400">30 Days</span>
                    </h1>
                    <p className="mt-5 md:mt-6 text-base md:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up">
                        Built from real Session 1 data. The chapters JEE aspirants ignore, the calculation traps that wreck timing, and a daily plan mapped to every free Canvas resource you need.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up">
                        {hydrated && resumeDay !== null ? (
                            <>
                                <Link
                                    href={`/bitsat-chemistry-revision/plan/day/${resumeDay}`}
                                    className="px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm transition-colors no-underline"
                                >
                                    Resume Day {resumeDay}
                                </Link>
                                <Link
                                    href="/bitsat-chemistry-revision/plan/day/1"
                                    className="px-6 py-3 rounded-full bg-white/[0.05] border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-colors no-underline"
                                >
                                    Start from Day 1
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/bitsat-chemistry-revision/plan/day/1"
                                    className="px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm transition-colors no-underline"
                                >
                                    Open the Plan
                                </Link>
                                <a
                                    href="#post-mortem"
                                    className="px-6 py-3 rounded-full bg-white/[0.05] border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-colors no-underline"
                                >
                                    Read Session 1 Post-Mortem
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* ============ POST-MORTEM ============ */}
            <section id="post-mortem" className="py-16 md:py-24 border-t border-white/[0.05]">
                <div className="max-w-6xl mx-auto px-5 md:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider mb-4">
                            <AlertTriangle size={12} />
                            Session 1 Post-Mortem
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight">
                            Session 1 wasn&apos;t a speed test. It was a{' '}
                            <span className="text-red-400">psychological trap</span>.
                        </h2>
                        <p className="mt-4 text-zinc-400 leading-relaxed">
                            The most prepared students didn&apos;t fail because they didn&apos;t know the concepts. They failed because they walked in expecting JEE — and got blindsided by deleted-syllabus questions and a missing UI button.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-12">
                        {SESSION1_STATS.map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={stat.label}
                                    className="p-4 md:p-5 rounded-2xl bg-[#0B0F15] border border-white/[0.06]"
                                >
                                    <Icon className={`${stat.accent} mb-3`} size={20} />
                                    <div className={`text-3xl md:text-4xl font-black ${stat.accent} tabular-nums`}>
                                        {stat.prefix ?? ''}
                                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                    </div>
                                    <div className="mt-1.5 text-xs font-semibold text-white">{stat.label}</div>
                                    <div className="mt-1 text-[11px] text-zinc-500 leading-relaxed">{stat.sub}</div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="grid lg:grid-cols-2 gap-4 md:gap-6 mb-12">
                        <div className="p-6 md:p-8 rounded-2xl bg-[#0B0F15] border border-white/[0.06]">
                            <div className="flex items-center gap-2 mb-1">
                                <FlaskConical size={16} className="text-emerald-400" />
                                <h3 className="text-base font-bold text-white">Chemistry Question Mix</h3>
                            </div>
                            <p className="text-xs text-zinc-500 mb-6">
                                Roughly 25% of Chemistry came from JEE-deleted chapters.
                            </p>
                            <DonutChart data={allTopics} />
                        </div>
                        <div className="p-6 md:p-8 rounded-2xl bg-[#0B0F15] border border-white/[0.06]">
                            <div className="flex items-center gap-2 mb-1">
                                <Calculator size={16} className="text-blue-400" />
                                <h3 className="text-base font-bold text-white">Maths Question Distribution</h3>
                            </div>
                            <p className="text-xs text-zinc-500 mb-6">
                                LPP, Stats and Probability dominated — easy marks JEE students skip.
                            </p>
                            <BarChart data={MATHS_DISTRIBUTION} />
                        </div>
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-white mb-5 flex items-center gap-2">
                        <Target size={20} className="text-blue-400" />
                        The 5 Traps That Cost Students Their Rank
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                        {TRAPS.map((trap) => {
                            const Icon = trap.icon;
                            const tone = TONE_CLASSES[trap.tone];
                            return (
                                <div
                                    key={trap.title}
                                    className={`p-5 rounded-2xl bg-[#0B0F15] border ${tone.border} ${tone.borderHover} transition-colors`}
                                >
                                    <Icon size={18} className={`${tone.text} mb-3`} />
                                    <h4 className="text-sm font-bold text-white mb-1.5">{trap.title}</h4>
                                    <p className="text-xs text-zinc-400 leading-relaxed">{trap.body}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ============ EXAM-DAY TACTICS ============ */}
            <section className="py-16 md:py-24 border-t border-white/[0.05]">
                <div className="max-w-5xl mx-auto px-5 md:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4">
                            <Target size={12} />
                            Exam-Day Tactics
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight">
                            The 4 rules that protect your accuracy
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {([
                            {
                                icon: Timer,
                                title: 'The 10-Second Skip Rule',
                                body: 'If a Physical Chemistry question looks like a multi-step calculation, OR a question seems mathematically off (duplicate options, impossible setup), skip in 10 seconds. Do not ego-solve.',
                                tone: 'orange' as ToneKey,
                            },
                            {
                                icon: Trophy,
                                title: 'The Bonus-Question Gate',
                                body: 'Unlock bonus questions ONLY when you have 20+ minutes left AND you have confidently attempted 115+ questions. Otherwise, do not touch them — they tank accuracy.',
                                tone: 'amber' as ToneKey,
                            },
                            {
                                icon: AlertTriangle,
                                title: 'The "No Mark for Review" Mindset',
                                body: 'Practise as if the button does not exist. Track your doubts on a physical rough sheet — write the question number, circle it, move on. Revisit only after one full pass.',
                                tone: 'red' as ToneKey,
                            },
                            {
                                icon: Calculator,
                                title: 'The 90-Second Trap Check',
                                body: 'Any Physical Chemistry calculation taking longer than 90 seconds is engineered to waste your time. Skip, finish the rest of the section, return at the end if you still have buffer.',
                                tone: 'emerald' as ToneKey,
                            },
                        ]).map((rule) => {
                            const Icon = rule.icon;
                            const tone = TONE_CLASSES[rule.tone];
                            return (
                                <div
                                    key={rule.title}
                                    className="p-5 md:p-6 rounded-2xl bg-[#0B0F15] border border-white/[0.06] hover:border-white/[0.15] transition-colors"
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tone.iconBg} border ${tone.iconBorder} mb-3`}>
                                        <Icon size={18} className={tone.text} />
                                    </div>
                                    <h4 className="text-base font-bold text-white mb-2">{rule.title}</h4>
                                    <p className="text-sm text-zinc-400 leading-relaxed">{rule.body}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ============ FAQ ============ */}
            <section className="py-16 md:py-24 border-t border-white/[0.05]">
                <div className="max-w-3xl mx-auto px-5 md:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-3">
                        {FAQS.map((f) => (
                            <FAQItem key={f.q} q={f.q} a={f.a} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ FOOTER CTA ============ */}
            <section className="py-16 md:py-20 border-t border-white/[0.05]">
                <div className="max-w-3xl mx-auto px-5 md:px-8 text-center">
                    <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-4">
                        Ready to start? The plan is one click away.
                    </h2>
                    <p className="text-zinc-400 leading-relaxed mb-6">
                        30 days. 4 phases. Every day mapped to a lecture, notes, and flashcards.
                    </p>
                    <Link
                        href="/bitsat-chemistry-revision/plan/day/1"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm transition-colors no-underline"
                    >
                        <Sparkles size={16} />
                        Open the Plan
                    </Link>
                </div>
            </section>
        </div>
    );
}
