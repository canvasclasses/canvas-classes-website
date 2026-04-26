'use client';

// ─────────────────────────────────────────────────────────────────────────────
// PROTOTYPE — Crucible landing redesign (v2 — compact rows + sticky sidebar)
// Throwaway page at /crucible/preview. Hardcoded sample data, no DB, no auth.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import {
    Search, X, BookOpen, Clock, Sparkles, ChevronRight, Plus, ArrowRight,
    Flame, Target, BarChart3,
} from 'lucide-react';

type Exam = 'JEE' | 'NEET' | 'BITSAT';
type Category = 'physical' | 'inorganic' | 'organic' | 'practical';
type ClassLevel = 11 | 12;

interface Chapter {
    id: string;
    name: string;
    category: Category;
    classLevel: ClassLevel;
    count: number;
    exams: Exam[];
    progress?: number; // 0..1, only set for returning-user demo
}

const CHAPTERS: Chapter[] = [
    // Class 11
    { id: 'mole', name: 'Some Basic Concepts', category: 'physical', classLevel: 11, count: 184, exams: ['JEE', 'NEET'], progress: 1.0 },
    { id: 'atom', name: 'Structure of Atom', category: 'physical', classLevel: 11, count: 210, exams: ['JEE', 'NEET'], progress: 0.72 },
    { id: 'thermo', name: 'Thermodynamics', category: 'physical', classLevel: 11, count: 165, exams: ['JEE', 'NEET'], progress: 0.35 },
    { id: 'chem_eq', name: 'Chemical Equilibrium', category: 'physical', classLevel: 11, count: 148, exams: ['JEE', 'NEET'], progress: 0.15 },
    { id: 'ionic_eq', name: 'Ionic Equilibrium', category: 'physical', classLevel: 11, count: 130, exams: ['JEE'] },
    { id: 'redox', name: 'Redox Reactions', category: 'physical', classLevel: 11, count: 95, exams: ['JEE', 'NEET'] },
    { id: 'periodic', name: 'Periodicity', category: 'inorganic', classLevel: 11, count: 140, exams: ['JEE', 'NEET'], progress: 0.88 },
    { id: 'bonding', name: 'Chemical Bonding', category: 'inorganic', classLevel: 11, count: 338, exams: ['JEE', 'NEET'], progress: 0.55 },
    { id: 'pblock11', name: 'P Block (11th)', category: 'inorganic', classLevel: 11, count: 180, exams: ['JEE', 'NEET'], progress: 0.22 },
    { id: 'goc', name: 'GOC', category: 'organic', classLevel: 11, count: 220, exams: ['JEE', 'NEET'], progress: 0.91 },
    { id: 'hc', name: 'Hydrocarbons', category: 'organic', classLevel: 11, count: 240, exams: ['JEE', 'NEET'], progress: 0.48 },
    { id: 'prac_org', name: 'Practical Organic', category: 'practical', classLevel: 11, count: 88, exams: ['JEE'] },
    // Class 12
    { id: 'sol', name: 'Solutions', category: 'physical', classLevel: 12, count: 185, exams: ['JEE', 'NEET'], progress: 0.63 },
    { id: 'ec', name: 'Electrochemistry', category: 'physical', classLevel: 12, count: 184, exams: ['JEE'], progress: 0.29 },
    { id: 'kin', name: 'Chemical Kinetics', category: 'physical', classLevel: 12, count: 177, exams: ['JEE', 'NEET'] },
    { id: 'pblock12', name: 'P Block (12th)', category: 'inorganic', classLevel: 12, count: 510, exams: ['JEE', 'NEET'], progress: 0.41 },
    { id: 'dnf', name: 'D & F Block', category: 'inorganic', classLevel: 12, count: 327, exams: ['JEE', 'NEET'], progress: 0.07 },
    { id: 'coord', name: 'Coordination Compounds', category: 'inorganic', classLevel: 12, count: 311, exams: ['JEE', 'NEET'], progress: 0.4 },
    { id: 'halo', name: 'Haloalkanes & Haloarenes', category: 'organic', classLevel: 12, count: 159, exams: ['JEE', 'NEET'] },
    { id: 'alco', name: 'Alcohols, Phenols & Ethers', category: 'organic', classLevel: 12, count: 179, exams: ['JEE', 'NEET'] },
    { id: 'aldo', name: 'Aldehydes, Ketones & Carboxylic Acids', category: 'organic', classLevel: 12, count: 302, exams: ['JEE', 'NEET'] },
    { id: 'amin', name: 'Amines', category: 'organic', classLevel: 12, count: 210, exams: ['JEE', 'NEET'] },
    { id: 'bio', name: 'Biomolecules', category: 'organic', classLevel: 12, count: 240, exams: ['JEE', 'NEET'] },
    { id: 'salt', name: 'Salt Analysis', category: 'practical', classLevel: 12, count: 225, exams: ['JEE'] },
];

const CATEGORY_META: Record<Category, { label: string; dot: string; bar: string; text: string; }> = {
    physical:  { label: 'Physical',  dot: 'bg-blue-500',    bar: 'bg-blue-500',    text: 'text-blue-300' },
    inorganic: { label: 'Inorganic', dot: 'bg-emerald-500', bar: 'bg-emerald-500', text: 'text-emerald-300' },
    organic:   { label: 'Organic',   dot: 'bg-purple-500',  bar: 'bg-purple-500',  text: 'text-purple-300' },
    practical: { label: 'Practical', dot: 'bg-orange-500',  bar: 'bg-orange-500',  text: 'text-orange-300' },
};

const ALL_EXAMS: { id: Exam; label: string; available: boolean }[] = [
    { id: 'JEE', label: 'JEE', available: true },
    { id: 'NEET', label: 'NEET', available: true },
    { id: 'BITSAT', label: 'BITSAT', available: false },
];

export default function CruciblePreviewPage() {
    const [userMode, setUserMode] = useState<'first' | 'returning'>('returning');
    const [selectedExams, setSelectedExams] = useState<Exam[]>(['JEE']);
    const [classFilter, setClassFilter] = useState<'all' | 11 | 12>('all');
    const [search, setSearch] = useState('');
    const [openChapter, setOpenChapter] = useState<Chapter | null>(null);
    const [progressOpen, setProgressOpen] = useState(false);

    const toggleExam = (exam: Exam) => {
        setSelectedExams(prev =>
            prev.includes(exam) ? prev.filter(e => e !== exam) : [...prev, exam]
        );
    };

    const filtered = CHAPTERS.filter(ch => {
        if (selectedExams.length > 0 && !ch.exams.some(e => selectedExams.includes(e))) return false;
        if (classFilter !== 'all' && ch.classLevel !== classFilter) return false;
        if (search && !ch.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const byCategory: Record<Category, Chapter[]> = {
        physical: [], inorganic: [], organic: [], practical: [],
    };
    filtered.forEach(ch => byCategory[ch.category].push(ch));

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            {/* Prototype banner */}
            <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-300 text-xs py-1.5 px-4 flex items-center justify-between flex-wrap gap-2">
                <span>🎨 PROTOTYPE v2 — compact rows + sticky sidebar · /crucible/preview</span>
                <div className="flex items-center gap-2">
                    <span className="text-amber-300/60">View:</span>
                    <button
                        onClick={() => setUserMode('first')}
                        className={`px-2 py-0.5 rounded text-xs transition ${userMode === 'first' ? 'bg-amber-500/20 text-amber-200' : 'text-amber-300/60 hover:text-amber-300'}`}
                    >First-time</button>
                    <button
                        onClick={() => setUserMode('returning')}
                        className={`px-2 py-0.5 rounded text-xs transition ${userMode === 'returning' ? 'bg-amber-500/20 text-amber-200' : 'text-amber-300/60 hover:text-amber-300'}`}
                    >Returning</button>
                </div>
            </div>

            {/* Header */}
            <header className="border-b border-white/5 bg-[#050505]/80 backdrop-blur sticky top-0 z-20">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-lg">🔥</div>
                        <div>
                            <h1 className="font-bold text-lg leading-none">The Crucible</h1>
                            <p className="text-orange-400/80 text-[10px] tracking-widest mt-1">FORGE YOUR RANK</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Progress button: mobile only — desktop sidebar handles this */}
                        {userMode === 'returning' && (
                            <button
                                onClick={() => setProgressOpen(true)}
                                className="lg:hidden px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm flex items-center gap-1.5"
                            >
                                <BarChart3 size={14} className="text-blue-400" />
                                Progress
                            </button>
                        )}
                        <button className="hidden lg:block px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm">Home</button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-6">
                {/* Top: exam chips + subject tab on one row */}
                <section className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-white/50">Practicing for:</span>
                        {ALL_EXAMS.map(exam => {
                            const active = selectedExams.includes(exam.id);
                            return (
                                <button
                                    key={exam.id}
                                    disabled={!exam.available}
                                    onClick={() => toggleExam(exam.id)}
                                    className={`px-3 py-1 rounded-full text-xs font-semibold transition border
                    ${!exam.available ? 'bg-white/[0.02] border-white/5 text-white/30 cursor-not-allowed' :
                                            active ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 border-orange-500/60 text-amber-200' :
                                                'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}
                                >
                                    {active && <span className="inline-block w-1 h-1 rounded-full bg-orange-400 mr-1.5 align-middle" />}
                                    {exam.label}
                                    {!exam.available && <span className="text-[9px] ml-1.5 text-white/30">soon</span>}
                                </button>
                            );
                        })}
                        <button className="px-2 py-1 rounded-full text-xs text-white/40 hover:text-white/70 flex items-center gap-1">
                            <Plus size={12} /> add
                        </button>
                    </div>

                    <div className="h-4 w-px bg-white/10 hidden md:block" />

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-white/50">Subject:</span>
                        <button className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 border border-blue-500/40 text-blue-200">
                            ⚗ Chemistry
                        </button>
                    </div>
                </section>

                {/* Two-column layout: chapters + sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
                    {/* MAIN — chapter list */}
                    <div>
                        {/* Search + class filter */}
                        <div className="flex flex-col sm:flex-row gap-2 mb-5">
                            <div className="relative flex-1">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search chapters…"
                                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0B0F15] border border-white/10 text-sm placeholder:text-white/30 focus:outline-none focus:border-orange-500/40 focus:bg-[#151E32] transition"
                                />
                            </div>
                            <div className="flex bg-[#0B0F15] border border-white/10 rounded-lg p-0.5">
                                {(['all', 11, 12] as const).map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setClassFilter(c)}
                                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition
                      ${classFilter === c ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/80'}`}
                                    >
                                        {c === 'all' ? 'All' : `Class ${c}`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Chapter rows grouped by category */}
                        {selectedExams.length === 0 ? (
                            <div className="text-center py-20 text-white/40 text-sm">
                                Pick at least one exam above to see chapters.
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {(['physical', 'inorganic', 'organic', 'practical'] as Category[]).map(cat => {
                                    const list = byCategory[cat];
                                    if (list.length === 0) return null;
                                    const totalQs = list.reduce((s, c) => s + c.count, 0);
                                    return (
                                        <div key={cat}>
                                            <div className="flex items-center justify-between mb-2 px-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${CATEGORY_META[cat].dot}`} />
                                                    <h2 className={`text-[10px] tracking-[0.18em] font-semibold ${CATEGORY_META[cat].text}`}>{CATEGORY_META[cat].label.toUpperCase()}</h2>
                                                </div>
                                                <span className="text-[10px] text-white/30 tabular-nums">{totalQs.toLocaleString()} Qs</span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                                                {list.map(ch => {
                                                    const showExamTag = !ch.exams.every(e => selectedExams.includes(e)) || ch.exams.length < selectedExams.length;
                                                    const isSubset = ch.exams.length < selectedExams.filter(e => ch.exams.includes(e)).length || ch.exams.length === 1;
                                                    return (
                                                        <button
                                                            key={ch.id}
                                                            onClick={() => setOpenChapter(ch)}
                                                            className="group text-left rounded-lg bg-[#0B0F15] hover:bg-[#151E32] border border-transparent hover:border-white/10 transition px-3 py-2.5 flex items-center gap-2"
                                                        >
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between gap-2">
                                                                    <div className="flex items-center gap-2 min-w-0">
                                                                        <span className="text-[10px] text-white/30 tabular-nums shrink-0">{ch.classLevel}</span>
                                                                        <span className="text-sm font-medium truncate">{ch.name}</span>
                                                                        {isSubset && ch.exams.length === 1 && (
                                                                            <span className="text-[9px] px-1 py-0.5 rounded bg-white/5 text-white/40 shrink-0">{ch.exams[0]} only</span>
                                                                        )}
                                                                    </div>
                                                                    <span className="text-xs text-white/50 font-mono tabular-nums shrink-0">{ch.count}</span>
                                                                </div>
                                                                {/* Progress bar — all chapters in returning mode */}
                                                                {userMode === 'returning' && (
                                                                    <div className="h-0.5 mt-2 rounded-full bg-white/[0.04] overflow-hidden">
                                                                        <div
                                                                            className={`h-full ${CATEGORY_META[cat].bar} transition-all`}
                                                                            style={{ width: `${(ch.progress ?? 0) * 100}%` }}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <ChevronRight size={14} className="text-white/20 group-hover:text-white/60 group-hover:translate-x-0.5 transition shrink-0" />
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                                {filtered.length === 0 && (
                                    <div className="text-center py-12 text-white/40 text-sm">
                                        No chapters match your search.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* SIDEBAR — sticky on desktop */}
                    {selectedExams.length > 0 && (
                        <aside className="hidden lg:block space-y-3 lg:sticky lg:top-[76px] lg:self-start">
                            {userMode === 'returning' ? (
                                <>
                                    {/* Continue */}
                                    <div className="rounded-xl bg-[#0B0F15] border-l-2 border-orange-500 border-t border-r border-b border-white/5 p-4 hover:bg-[#0F1320] transition cursor-pointer group">
                                        <p className="text-[9px] tracking-[0.18em] text-orange-400/80 mb-1.5">CONTINUE</p>
                                        <h3 className="font-bold text-sm mb-0.5">Coordination Compounds</h3>
                                        <p className="text-xs text-white/50 mb-3">Free Browse · 12 of 30 · 2h ago</p>
                                        <span className="text-orange-400 text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                                            Resume <ArrowRight size={12} />
                                        </span>
                                    </div>

                                    {/* Next Up */}
                                    <div className="rounded-xl bg-[#0B0F15] border-l-2 border-emerald-500 border-t border-r border-b border-white/5 p-4 hover:bg-[#0F1320] transition cursor-pointer group">
                                        <p className="text-[9px] tracking-[0.18em] text-emerald-400/80 mb-1.5">NEXT UP</p>
                                        <h3 className="font-bold text-sm mb-0.5">Hybridization needs work</h3>
                                        <p className="text-xs text-white/50 mb-3">38% accuracy · 5 picked for you</p>
                                        <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                                            Practice now <ArrowRight size={12} />
                                        </span>
                                    </div>

                                    {/* Today / stats */}
                                    <div className="rounded-xl bg-[#0B0F15] border border-white/5 p-4">
                                        <p className="text-[9px] tracking-[0.18em] text-white/50 mb-3">TODAY</p>
                                        <div className="space-y-2.5">
                                            <Stat icon={<Flame size={14} className="text-orange-400" />} label="Streak" value="7 days" />
                                            <Stat icon={<Target size={14} className="text-emerald-400" />} label="Goal" value="0 / 20 Qs" />
                                            <Stat icon={<BarChart3 size={14} className="text-blue-400" />} label="This week" value="74% accuracy" />
                                        </div>
                                    </div>

                                    {/* Recent (compact) */}
                                    <div className="rounded-xl bg-[#0B0F15] border border-white/5 p-4">
                                        <p className="text-[9px] tracking-[0.18em] text-white/50 mb-3">RECENT</p>
                                        <ul className="space-y-2 text-xs">
                                            <RecentRow name="Solutions" detail="5h ago" />
                                            <RecentRow name="Chemical Bonding" detail="Yesterday" />
                                            <RecentRow name="GOC" detail="2 days ago" />
                                        </ul>
                                    </div>
                                </>
                            ) : (
                                /* First-time sidebar — onboarding */
                                <div className="rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/5 border border-orange-500/30 p-4">
                                    <p className="text-[9px] tracking-[0.18em] text-orange-400/80 mb-2">WELCOME</p>
                                    <h3 className="font-bold text-sm mb-1.5">Where to start?</h3>
                                    <p className="text-xs text-white/60 mb-3">Pick any chapter on the left, then choose Learn / Test / Guide-me.</p>
                                    <p className="text-xs text-white/50 mb-1">Most students begin with:</p>
                                    <ul className="text-xs text-white/70 space-y-1">
                                        <li>• Chemical Bonding (foundational)</li>
                                        <li>• GOC (organic basics)</li>
                                        <li>• Mole Concept (calculations)</li>
                                    </ul>
                                </div>
                            )}
                        </aside>
                    )}
                </div>
            </main>

            {/* Progress bottom sheet — mobile only */}
            {progressOpen && userMode === 'returning' && (
                <div
                    className="fixed inset-0 z-30 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-[fadeIn_120ms_ease-out]"
                    onClick={() => setProgressOpen(false)}
                >
                    <div
                        className="w-full bg-[#0B0F15] border-t border-white/10 rounded-t-2xl p-5 animate-[slideUp_200ms_ease-out] max-h-[85vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Handle */}
                        <div className="mx-auto w-10 h-1 rounded-full bg-white/15 mb-5" />

                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-base">Your Progress</h2>
                            <button onClick={() => setProgressOpen(false)} className="text-white/40 hover:text-white/80 p-1">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {/* Continue */}
                            <div className="rounded-xl bg-[#151E32] border-l-2 border-orange-500 border-t border-r border-b border-white/5 p-4 cursor-pointer group">
                                <p className="text-[9px] tracking-[0.18em] text-orange-400/80 mb-1.5">CONTINUE</p>
                                <h3 className="font-bold text-sm mb-0.5">Coordination Compounds</h3>
                                <p className="text-xs text-white/50 mb-3">Free Browse · 12 of 30 · 2h ago</p>
                                <span className="text-orange-400 text-xs font-semibold flex items-center gap-1">Resume <ArrowRight size={12} /></span>
                            </div>

                            {/* Next Up */}
                            <div className="rounded-xl bg-[#151E32] border-l-2 border-emerald-500 border-t border-r border-b border-white/5 p-4 cursor-pointer">
                                <p className="text-[9px] tracking-[0.18em] text-emerald-400/80 mb-1.5">NEXT UP</p>
                                <h3 className="font-bold text-sm mb-0.5">Hybridization needs work</h3>
                                <p className="text-xs text-white/50 mb-3">38% accuracy · 5 picked for you</p>
                                <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">Practice now <ArrowRight size={12} /></span>
                            </div>

                            {/* Today / stats */}
                            <div className="rounded-xl bg-[#151E32] border border-white/5 p-4">
                                <p className="text-[9px] tracking-[0.18em] text-white/50 mb-3">TODAY</p>
                                <div className="space-y-2.5">
                                    <Stat icon={<Flame size={14} className="text-orange-400" />} label="Streak" value="7 days" />
                                    <Stat icon={<Target size={14} className="text-emerald-400" />} label="Goal" value="0 / 20 Qs" />
                                    <Stat icon={<BarChart3 size={14} className="text-blue-400" />} label="This week" value="74% accuracy" />
                                </div>
                            </div>

                            {/* Recent */}
                            <div className="rounded-xl bg-[#151E32] border border-white/5 p-4">
                                <p className="text-[9px] tracking-[0.18em] text-white/50 mb-3">RECENT</p>
                                <ul className="space-y-2 text-xs">
                                    <RecentRow name="Solutions" detail="5h ago" />
                                    <RecentRow name="Chemical Bonding" detail="Yesterday" />
                                    <RecentRow name="GOC" detail="2 days ago" />
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mode picker — bottom sheet on mobile, centered card on desktop */}
            {openChapter && (
                <div
                    className="fixed inset-0 z-30 flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm animate-[fadeIn_120ms_ease-out]"
                    onClick={() => setOpenChapter(null)}
                >
                    <div
                        className="w-full md:max-w-3xl bg-[#0B0F15] border-t border-white/10 md:border md:rounded-2xl rounded-t-2xl p-6 md:m-4 animate-[slideUp_200ms_ease-out]"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="md:hidden mx-auto w-10 h-1 rounded-full bg-white/15 mb-4" />

                        <div className="flex items-start justify-between mb-1">
                            <div className="min-w-0 pr-4">
                                <p className="text-[10px] tracking-widest text-white/40 mb-1">CHAPTER · CLASS {openChapter.classLevel}</p>
                                <h2 className="text-2xl font-bold mb-1">{openChapter.name}</h2>
                                <p className="text-sm text-white/60">{openChapter.count} questions · {openChapter.exams.join(' + ')}</p>
                            </div>
                            <button onClick={() => setOpenChapter(null)} className="text-white/40 hover:text-white/80 p-2 -m-2 shrink-0">
                                <X size={20} />
                            </button>
                        </div>

                        <p className="text-white/70 text-sm mt-6 mb-3">How do you want to practice?</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <ModeCard
                                icon={<BookOpen size={20} />}
                                label="Learn"
                                desc="Browse with solutions on tap. No clock."
                                accent="border-blue-500"
                                cta="Start →"
                            />
                            <ModeCard
                                icon={<Clock size={20} />}
                                label="Test"
                                desc="Timed exam-style. Speed and accuracy."
                                accent="border-orange-500"
                                cta="Start →"
                            />
                            <ModeCard
                                icon={<Sparkles size={20} />}
                                label="Guide me"
                                desc="Adaptive — picks questions for your level."
                                accent="border-emerald-500"
                                cta="Start →"
                                badge="BETA · GOC only"
                                disabled={openChapter.id !== 'goc'}
                            />
                        </div>

                        <details className="mt-6 group">
                            <summary className="text-xs text-white/50 hover:text-white/80 cursor-pointer flex items-center gap-1 select-none">
                                <ChevronRight size={12} className="group-open:rotate-90 transition" />
                                Filters (optional)
                            </summary>
                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                                {['Difficulty: Any', 'Source: Any', 'Year: Any'].map(f => (
                                    <button key={f} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 text-left hover:bg-white/10 transition">
                                        {f} ▾
                                    </button>
                                ))}
                            </div>
                        </details>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
                @keyframes slideUp { from { transform: translateY(24px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
            `}</style>
        </div>
    );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-white/60">{icon}{label}</span>
            <span className="text-white font-semibold tabular-nums">{value}</span>
        </div>
    );
}

function RecentRow({ name, detail }: { name: string; detail: string }) {
    return (
        <li className="flex items-center justify-between text-white/70 hover:text-white cursor-pointer transition">
            <span className="truncate">{name}</span>
            <span className="text-white/30 text-[10px] shrink-0 ml-2">{detail}</span>
        </li>
    );
}

function ModeCard({ icon, label, desc, accent, cta, badge, disabled }: {
    icon: React.ReactNode;
    label: string;
    desc: string;
    accent: string;
    cta: string;
    badge?: string;
    disabled?: boolean;
}) {
    return (
        <div className={`rounded-xl bg-[#151E32] border-l-2 ${accent} border-t border-r border-b border-white/5 p-4 flex flex-col ${disabled ? 'opacity-60' : ''}`}>
            <div className="flex items-center gap-2 text-white mb-2">{icon}<span className="font-bold">{label}</span></div>
            <p className="text-sm text-white/60 mb-4 flex-1">{desc}</p>
            {badge && <span className="text-[10px] tracking-wide text-amber-400/80 mb-2">{badge}</span>}
            <button
                disabled={disabled}
                className={`w-full py-2 rounded-lg text-sm font-bold transition
          ${disabled
                        ? 'bg-white/5 text-white/40 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-amber-500 text-black hover:opacity-90'}`}
            >
                {cta}
            </button>
        </div>
    );
}
