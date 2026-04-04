'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Tag, BookOpen, Layers, Target, FlaskConical, GraduationCap } from 'lucide-react';
import { TAXONOMY_FROM_CSV } from './taxonomy/taxonomyData_from_csv';

interface Question {
    metadata: {
        chapter_id: string;
        tags?: Array<{ tag_id: string }>;
        difficultyLevel?: number;
        is_pyq?: boolean;
        exam_source?: { exam: string };
        microConcept?: string;
    };
    type?: string;
}

interface Chapter {
    _id: string;
    name: string;
}

interface AnalyticsDashboardProps {
    questions: Question[];
    chapters: Chapter[];
    onClose: () => void;
    selectedChapterId?: string;
}

// ── Tiny helpers ─────────────────────────────────────────────────────────────

const PALETTE = [
    '#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b',
    '#ef4444', '#06b6d4', '#a855f7', '#f97316', '#84cc16',
    '#14b8a6', '#e879f9', '#fb7185', '#38bdf8', '#4ade80',
];

function pct(n: number, total: number) {
    if (total === 0) return 0;
    return Math.round((n / total) * 100);
}

// Simple horizontal bar with label
function HBar({ label, count, total, color, sublabel }: { label: string; count: number; total: number; color: string; sublabel?: string }) {
    const p = pct(count, total);
    return (
        <div className="flex items-center gap-3 group">
            <div className="w-40 shrink-0 text-right">
                <span className="text-xs text-gray-300 leading-tight line-clamp-2 block">{label}</span>
                {sublabel && <span className="text-[10px] text-gray-500">{sublabel}</span>}
            </div>
            <div className="flex-1 bg-gray-700/60 rounded-full h-5 overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-500 flex items-center px-2"
                    style={{ width: `${Math.max(p, 2)}%`, backgroundColor: color }}
                >
                    {p > 12 && <span className="text-[10px] font-bold text-white/90">{count}</span>}
                </div>
            </div>
            <span className="text-xs font-mono text-gray-400 w-16 shrink-0">{count} <span className="text-gray-600">({p}%)</span></span>
        </div>
    );
}

// SVG donut chart (pure, no deps)
function DonutChart({ segments, size = 120 }: { segments: { label: string; value: number; color: string }[]; size?: number }) {
    const total = segments.reduce((s, seg) => s + seg.value, 0);
    if (total === 0) return <div className="text-xs text-gray-500 text-center py-8">No data</div>;
    const r = 40; const cx = 60; const cy = 60; const stroke = 18;
    let cumAngle = -90;
    const arcs = segments
        .filter(s => s.value > 0)
        .map(seg => {
            const angle = (seg.value / total) * 360;
            const start = cumAngle;
            cumAngle += angle;
            const toRad = (d: number) => (d * Math.PI) / 180;
            const x1 = cx + r * Math.cos(toRad(start));
            const y1 = cy + r * Math.sin(toRad(start));
            const x2 = cx + r * Math.cos(toRad(cumAngle - 0.01));
            const y2 = cy + r * Math.sin(toRad(cumAngle - 0.01));
            const large = angle > 180 ? 1 : 0;
            return { ...seg, d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`, angle };
        });
    return (
        <svg width={size} height={size} viewBox="0 0 120 120">
            <circle cx={cx} cy={cy} r={r} fill="transparent" stroke="#1f2937" strokeWidth={stroke} />
            {arcs.map((arc, i) => (
                <path key={i} d={arc.d} fill={arc.color} opacity={0.9}>
                    <title>{arc.label}: {arc.value} ({pct(arc.value, total)}%)</title>
                </path>
            ))}
            <circle cx={cx} cy={cy} r={r - stroke / 2 - 2} fill="#111827" />
            <text x={cx} y={cy - 4} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">{total}</text>
            <text x={cx} y={cy + 10} textAnchor="middle" fill="#9ca3af" fontSize="7">total</text>
        </svg>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AnalyticsDashboard({ questions, chapters, onClose, selectedChapterId }: AnalyticsDashboardProps) {

    // Which chapter to show chapter-specific analytics for
    const [focusChapterId, setFocusChapterId] = useState<string>(
        selectedChapterId && selectedChapterId !== 'all' ? selectedChapterId : ''
    );

    // ── Global stats (across all loaded questions) ───────────────────────────
    const totalQuestions = questions.length;
    const fullyTagged = questions.filter(q => q.metadata.chapter_id && q.metadata.tags?.length > 0).length;
    const missingChapter = questions.filter(q => !q.metadata.chapter_id).length;
    const missingTag = questions.filter(q => q.metadata.chapter_id && (!q.metadata.tags || q.metadata.tags.length === 0)).length;
    const taggedPercentage = totalQuestions > 0 ? ((fullyTagged / totalQuestions) * 100).toFixed(1) : '0';

    // Chapter options for the selector (only those with questions)
    const chapterOptions = chapters.filter(ch => {
        return questions.some(q => q.metadata.chapter_id === ch._id);
    });

    // ── Chapter-scoped questions ─────────────────────────────────────────────
    const chapterQs = focusChapterId
        ? questions.filter(q => q.metadata.chapter_id === focusChapterId)
        : questions;
    const chapterName = focusChapterId
        ? (chapters.find(c => c._id === focusChapterId)?.name ?? focusChapterId)
        : 'All Loaded Chapters';
    const chTotal = chapterQs.length;

    // ── 1. Concept (primary tag) distribution ───────────────────────────────
    // Get topic nodes for the selected chapter
    const topicNodes = focusChapterId
        ? TAXONOMY_FROM_CSV.filter(n => n.type === 'topic' && n.parent_id === focusChapterId)
        : [];
    // Also build micro-topic nodes per topic
    const microByTopic: Record<string, { id: string; name: string }[]> = {};
    topicNodes.forEach(t => {
        microByTopic[t.id] = TAXONOMY_FROM_CSV.filter(n => n.type === 'micro_topic' && n.parent_id === t.id);
    });

    // Count questions per topic
    const conceptCounts: { id: string; name: string; count: number; microCounts: { id: string; name: string; count: number }[] }[] = topicNodes.map((t, i) => {
        const qs = chapterQs.filter(q => q.metadata.tags?.some((tag) => tag.tag_id === t.id));
        const micros = microByTopic[t.id] ?? [];
        const microCounts = micros.map(m => ({
            id: m.id,
            name: m.name,
            count: qs.filter(q => q.metadata.microConcept === m.id || q.metadata.tags?.some((tag) => tag.tag_id === m.id)).length,
        }));
        return { id: t.id, name: t.name, count: qs.length, microCounts };
    }).sort((a, b) => b.count - a.count);

    const untaggedCount = chapterQs.filter(q => !q.metadata.tags || q.metadata.tags.length === 0).length;

    // ── 2. Difficulty breakdown ──────────────────────────────────────────────
    const diffData = [
        { label: 'Level 1-2', value: chapterQs.filter(q => q.metadata.difficultyLevel <= 2).length, count: chapterQs.filter(q => q.metadata.difficultyLevel <= 2).length, color: '#10b981' },
        { label: 'Level 3', value: chapterQs.filter(q => q.metadata.difficultyLevel === 3).length, count: chapterQs.filter(q => q.metadata.difficultyLevel === 3).length, color: '#f59e0b' },
        { label: 'Level 4-5', value: chapterQs.filter(q => q.metadata.difficultyLevel >= 4).length, count: chapterQs.filter(q => q.metadata.difficultyLevel >= 4).length, color: '#ef4444' },
    ];

    // ── 3. Exam source breakdown ─────────────────────────────────────────────
    const jeeMainCount = chapterQs.filter(q => q.metadata.is_pyq && q.metadata.exam_source?.exam === 'JEE Main').length;
    const jeeAdvCount  = chapterQs.filter(q => q.metadata.is_pyq && q.metadata.exam_source?.exam === 'JEE Advanced').length;
    const otherPyqCount = chapterQs.filter(q => q.metadata.is_pyq && q.metadata.exam_source?.exam !== 'JEE Main' && q.metadata.exam_source?.exam !== 'JEE Advanced').length;
    const nonPyqCount  = chapterQs.filter(q => !q.metadata.is_pyq).length;

    const sourceData = [
        { label: 'JEE Main', value: jeeMainCount, count: jeeMainCount, color: '#3b82f6' },
        { label: 'JEE Advanced', value: jeeAdvCount, count: jeeAdvCount, color: '#8b5cf6' },
        { label: 'Other PYQ', value: otherPyqCount, count: otherPyqCount, color: '#06b6d4' },
        { label: 'Non-PYQ', value: nonPyqCount, count: nonPyqCount, color: '#6b7280' },
    ];

    // ── 4. Question type breakdown ───────────────────────────────────────────
    const typeData = [
        { label: 'Single Correct (SCQ)', count: chapterQs.filter(q => q.type === 'SCQ').length, color: '#10b981' },
        { label: 'Multi Correct (MCQ)', count: chapterQs.filter(q => q.type === 'MCQ').length, color: '#3b82f6' },
        { label: 'Numerical (NVT)', count: chapterQs.filter(q => q.type === 'NVT').length, color: '#a855f7' },
        { label: 'Assertion-Reason (AR)', count: chapterQs.filter(q => q.type === 'AR').length, color: '#f97316' },
        { label: 'Multi-Statement (MST)', count: chapterQs.filter(q => q.type === 'MST').length, color: '#06b6d4' },
        { label: 'Match Column (MTC)', count: chapterQs.filter(q => q.type === 'MTC').length, color: '#ec4899' },
        { label: 'Subjective (SUBJ)', count: chapterQs.filter(q => q.type === 'SUBJ').length, color: '#eab308' },
    ].filter(t => t.count > 0);

    // ── Global tag frequency (for overall tab) ───────────────────────────────
    const tagFrequency: Record<string, number> = {};
    questions.forEach(q => {
        if (q.metadata.tags?.length > 0) {
            q.metadata.tags.forEach((tag) => {
                tagFrequency[tag.tag_id] = (tagFrequency[tag.tag_id] || 0) + 1;
            });
        }
    });
    const topTags = Object.entries(tagFrequency).sort(([, a], [, b]) => b - a).slice(0, 10);

    const chapterStats = chapters.map(ch => {
        const chQs = questions.filter(q => q.metadata.chapter_id === ch._id);
        const chFullyTagged = chQs.filter(q => q.metadata.tags?.length > 0).length;
        return {
            name: ch.name,
            total: chQs.length,
            tagged: chFullyTagged,
            percentage: chQs.length > 0 ? Math.round((chFullyTagged / chQs.length) * 100) : 0,
        };
    }).filter(s => s.total > 0).sort((a, b) => b.total - a.total);

    // ── Tabs ─────────────────────────────────────────────────────────────────
    const [tab, setTab] = useState<'chapter' | 'global'>(focusChapterId ? 'chapter' : 'global');

    return (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col">

                {/* ── Header ── */}
                <div className="p-5 border-b border-gray-800 bg-gradient-to-r from-purple-900/20 to-pink-900/20 shrink-0">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <BarChart3 size={22} className="text-purple-400" />
                            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Chapter Analytics
                            </h2>
                        </div>

                        {/* Chapter selector */}
                        <div className="flex items-center gap-3 flex-1 max-w-sm">
                            <select
                                value={focusChapterId}
                                onChange={e => { setFocusChapterId(e.target.value); setTab('chapter'); }}
                                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-purple-500 outline-none"
                            >
                                <option value="">— All loaded chapters —</option>
                                {chapterOptions.map(ch => (
                                    <option key={ch._id} value={ch._id}>{ch.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Tab switcher */}
                        <div className="flex bg-gray-800 rounded-lg p-0.5 gap-0.5 shrink-0">
                            <button
                                onClick={() => setTab('chapter')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${tab === 'chapter' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Chapter Detail
                            </button>
                            <button
                                onClick={() => setTab('global')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${tab === 'global' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Global / Tagging
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition shrink-0"
                        >
                            Close
                        </button>
                    </div>
                </div>

                {/* ── Body ── */}
                <div className="flex-1 overflow-y-auto p-5">

                    {/* ════════ CHAPTER DETAIL TAB ════════ */}
                    {tab === 'chapter' && (
                        <div className="space-y-5">

                            {chTotal === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                                    <BookOpen size={40} className="mb-3 opacity-30" />
                                    <p className="text-sm">Select a chapter to see detailed analytics</p>
                                </div>
                            ) : (
                                <>
                                    {/* Chapter heading + summary cards */}
                                    <div>
                                        <p className="text-xs text-gray-500 mb-3">Showing analytics for: <span className="text-purple-300 font-medium">{chapterName}</span></p>
                                        <div className="grid grid-cols-4 gap-3">
                                            <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <BookOpen size={13} className="text-blue-400" />
                                                    <span className="text-[10px] text-gray-400 uppercase tracking-wide">Total</span>
                                                </div>
                                                <div className="text-2xl font-bold text-white">{chTotal}</div>
                                            </div>
                                            <div className={`border rounded-xl p-3 ${untaggedCount > 0 ? 'bg-yellow-900/20 border-yellow-600/40' : 'bg-green-900/20 border-green-600/40'}`}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Tag size={13} className={untaggedCount > 0 ? 'text-yellow-400' : 'text-green-400'} />
                                                    <span className="text-[10px] text-gray-400 uppercase tracking-wide">Untagged</span>
                                                </div>
                                                <div className={`text-2xl font-bold ${untaggedCount > 0 ? 'text-yellow-400' : 'text-green-400'}`}>{untaggedCount}</div>
                                            </div>
                                            <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <GraduationCap size={13} className="text-purple-400" />
                                                    <span className="text-[10px] text-gray-400 uppercase tracking-wide">PYQ</span>
                                                </div>
                                                <div className="text-2xl font-bold text-white">{jeeMainCount + jeeAdvCount + otherPyqCount}</div>
                                            </div>
                                            <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <FlaskConical size={13} className="text-emerald-400" />
                                                    <span className="text-[10px] text-gray-400 uppercase tracking-wide">Non-PYQ</span>
                                                </div>
                                                <div className="text-2xl font-bold text-white">{nonPyqCount}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Row 1: Difficulty + Source donuts ── */}
                                    <div className="grid grid-cols-2 gap-4">

                                        {/* Difficulty */}
                                        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                                            <h3 className="text-xs font-bold text-gray-300 mb-4 flex items-center gap-2">
                                                <Target size={13} className="text-amber-400" />
                                                Difficulty Distribution
                                            </h3>
                                            <div className="flex items-center gap-5">
                                                <DonutChart segments={diffData} size={110} />
                                                <div className="flex-1 space-y-2">
                                                    {diffData.map(d => (
                                                        <div key={d.label} className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                                                                <span className="text-xs text-gray-300">{d.label}</span>
                                                            </div>
                                                            <span className="text-xs font-bold text-gray-300">{d.count} <span className="text-gray-500 font-normal">({pct(d.count, chTotal)}%)</span></span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Exam source */}
                                        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                                            <h3 className="text-xs font-bold text-gray-300 mb-4 flex items-center gap-2">
                                                <GraduationCap size={13} className="text-blue-400" />
                                                Exam Source
                                            </h3>
                                            <div className="flex items-center gap-5">
                                                <DonutChart segments={sourceData.filter(s => s.count > 0)} size={110} />
                                                <div className="flex-1 space-y-2">
                                                    {sourceData.map(s => (
                                                        <div key={s.label} className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                                                                <span className="text-xs text-gray-300">{s.label}</span>
                                                            </div>
                                                            <span className="text-xs font-bold text-gray-300">{s.count} <span className="text-gray-500 font-normal">({pct(s.count, chTotal)}%)</span></span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Row 2: Question Type ── */}
                                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                                        <h3 className="text-xs font-bold text-gray-300 mb-4 flex items-center gap-2">
                                            <Layers size={13} className="text-cyan-400" />
                                            Question Type Breakdown
                                        </h3>
                                        <div className="space-y-2.5">
                                            {typeData.length === 0 ? (
                                                <p className="text-xs text-gray-500 text-center py-4">No data</p>
                                            ) : (
                                                typeData.map((t, i) => (
                                                    <HBar key={t.label} label={t.label} count={t.count} total={chTotal} color={t.color} />
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* ── Row 3: Concept (primary tag) distribution ── */}
                                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                                        <h3 className="text-xs font-bold text-gray-300 mb-1 flex items-center gap-2">
                                            <TrendingUp size={13} className="text-purple-400" />
                                            Concept Distribution
                                            {untaggedCount > 0 && (
                                                <span className="ml-2 px-1.5 py-0.5 bg-yellow-900/40 border border-yellow-600/40 rounded text-[10px] text-yellow-400">
                                                    {untaggedCount} untagged
                                                </span>
                                            )}
                                        </h3>
                                        {!focusChapterId ? (
                                            <p className="text-xs text-gray-500 py-4 text-center">Select a specific chapter above to see concept breakdown</p>
                                        ) : conceptCounts.length === 0 ? (
                                            <p className="text-xs text-gray-500 py-4 text-center">No topic tags found for this chapter</p>
                                        ) : (
                                            <div className="mt-3 space-y-2">
                                                {conceptCounts.map((c, i) => (
                                                    <div key={c.id}>
                                                        <HBar
                                                            label={c.name}
                                                            count={c.count}
                                                            total={chTotal}
                                                            color={PALETTE[i % PALETTE.length]}
                                                        />
                                                        {/* Micro-topic rows (indented) */}
                                                        {c.microCounts.filter(m => m.count > 0).map(m => (
                                                            <div key={m.id} className="ml-8 mt-1">
                                                                <HBar
                                                                    label={m.name}
                                                                    count={m.count}
                                                                    total={c.count || 1}
                                                                    color={PALETTE[i % PALETTE.length] + 'aa'}
                                                                    sublabel="micro"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}
                                                {untaggedCount > 0 && (
                                                    <HBar label="Untagged / Unknown" count={untaggedCount} total={chTotal} color="#6b7280" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* ════════ GLOBAL / TAGGING TAB ════════ */}
                    {tab === 'global' && (
                        <div className="space-y-5">
                            {/* Summary cards */}
                            <div className="grid grid-cols-4 gap-3">
                                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <BookOpen size={14} className="text-blue-400" />
                                        <span className="text-xs text-gray-400">Total Questions</span>
                                    </div>
                                    <div className="text-3xl font-bold text-white">{totalQuestions}</div>
                                </div>
                                <div className="bg-green-900/20 border border-green-600/50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle size={14} className="text-green-400" />
                                        <span className="text-xs text-gray-400">Fully Tagged</span>
                                    </div>
                                    <div className="text-3xl font-bold text-green-400">{fullyTagged}</div>
                                    <div className="text-xs text-green-300 mt-1">{taggedPercentage}% complete</div>
                                </div>
                                <div className="bg-red-900/20 border border-red-600/50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertTriangle size={14} className="text-red-400" />
                                        <span className="text-xs text-gray-400">Missing Chapter</span>
                                    </div>
                                    <div className="text-3xl font-bold text-red-400">{missingChapter}</div>
                                </div>
                                <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Tag size={14} className="text-yellow-400" />
                                        <span className="text-xs text-gray-400">Missing Tag</span>
                                    </div>
                                    <div className="text-3xl font-bold text-yellow-400">{missingTag}</div>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-300">Overall Tagging Progress</span>
                                    <span className="text-sm font-bold text-purple-400">{taggedPercentage}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
                                        style={{ width: `${taggedPercentage}%` }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                {/* Top Tags */}
                                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                                    <h3 className="text-xs font-bold text-gray-300 mb-4 flex items-center gap-2">
                                        <TrendingUp size={13} className="text-purple-400" />
                                        Most Used Tags
                                    </h3>
                                    <div className="space-y-2">
                                        {topTags.map(([tag, count], idx) => (
                                            <div key={tag} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-mono text-gray-500">#{idx + 1}</span>
                                                    <span className="text-xs font-mono text-purple-300">{tag}</span>
                                                </div>
                                                <span className="text-xs font-bold text-gray-400">{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Chapter Tagging Status */}
                                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                                    <h3 className="text-xs font-bold text-gray-300 mb-4 flex items-center gap-2">
                                        <BookOpen size={13} className="text-blue-400" />
                                        Chapter Tagging Status
                                    </h3>
                                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                        {chapterStats.map(stat => (
                                            <div key={stat.name}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs text-gray-300 truncate">{stat.name}</span>
                                                    <span className="text-xs font-bold text-gray-400">{stat.tagged}/{stat.total}</span>
                                                </div>
                                                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all ${
                                                            stat.percentage >= 80 ? 'bg-green-500' :
                                                            stat.percentage >= 50 ? 'bg-yellow-500' :
                                                            'bg-red-500'
                                                        }`}
                                                        style={{ width: `${stat.percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Recommendations */}
                            <div className="bg-purple-900/20 border border-purple-600/50 rounded-xl p-4">
                                <h3 className="text-xs font-bold text-purple-400 mb-3">📊 Recommendations</h3>
                                <ul className="space-y-2 text-xs text-gray-300">
                                    {missingChapter > 0 && (
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-400">•</span>
                                            <span><strong>{missingChapter} questions</strong> need chapter assignment. Use bulk mode to assign quickly.</span>
                                        </li>
                                    )}
                                    {missingTag > 0 && (
                                        <li className="flex items-start gap-2">
                                            <span className="text-yellow-400">•</span>
                                            <span><strong>{missingTag} questions</strong> need primary tags. Use AI suggestions for faster tagging.</span>
                                        </li>
                                    )}
                                    {parseFloat(taggedPercentage) >= 80 && (
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-400">•</span>
                                            <span>Great progress! <strong>{taggedPercentage}%</strong> of questions are fully tagged.</span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
