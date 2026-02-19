"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Chapter, Question } from '../components/types';
import BrowseView from '../components/BrowseView';
import TestConfigModal from '../components/TestConfigModal';
import TestView from '../components/TestView';

interface Props {
    chapter: Chapter;
    questions: Question[];
    allChapters: Chapter[];
}

type Mode = 'choose' | 'browse' | 'test';

const CAT_COLOR: Record<string, string> = {
    Physical: '#38bdf8',
    Organic: '#a78bfa',
    Inorganic: '#34d399',
    Practical: '#fbbf24',
};

export default function ChapterPracticePage({ chapter, questions, allChapters }: Props) {
    const router = useRouter();
    const [mode, setMode] = useState<Mode>('choose');
    const [testQuestions, setTestQuestions] = useState<Question[]>([]);
    const [showTestConfig, setShowTestConfig] = useState(false);

    const color = CAT_COLOR[chapter.category ?? 'Physical'] ?? '#a78bfa';
    const qCount = questions.length;

    const startTest = (count: number) => {
        setShowTestConfig(false);
        const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, count);
        setTestQuestions(shuffled);
        setMode('test');
    };

    if (mode === 'browse') {
        return <BrowseView questions={questions} chapters={allChapters} onBack={() => setMode('choose')} />;
    }

    if (mode === 'test') {
        return <TestView questions={testQuestions} onBack={() => setMode('choose')} />;
    }

    return (
        <div style={{ minHeight: '100vh', background: '#080a0f', color: '#fff' }}>
            {/* Nav */}
            <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(8,10,15,0.96)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <button onClick={() => router.push('/the-crucible')}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.07)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 12 }}>
                    ← Back
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{chapter.name}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Class {chapter.class_level} · {chapter.category} · {qCount} Questions</div>
                </div>
            </nav>

            <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 16px' }}>
                {/* Chapter hero */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 99, background: `${color}18`, border: `1px solid ${color}33`, fontSize: 11, fontWeight: 700, color, marginBottom: 16 }}>
                        {chapter.category} · Class {chapter.class_level}
                    </div>
                    <h1 style={{ fontSize: 'clamp(22px,5vw,32px)', fontWeight: 900, lineHeight: 1.2, margin: '0 0 12px' }}>{chapter.name}</h1>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                        {qCount > 0
                            ? `${qCount} curated PYQs from JEE Main, JEE Advanced & NEET`
                            : 'Questions coming soon — check back shortly.'}
                    </p>
                </div>

                {qCount === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ fontSize: 36, marginBottom: 12 }}>🔨</div>
                        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Questions being added</div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>This chapter is being populated. Come back soon!</div>
                    </div>
                ) : (
                    <>
                        {/* Stats row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 28 }}>
                            {[
                                [String(qCount), 'Total Qs', color],
                                [String(questions.filter(q => q.metadata.is_pyq).length), 'PYQs', '#fbbf24'],
                                [String(questions.filter(q => q.metadata.difficulty === 'Hard').length), 'Hard', '#f87171'],
                            ].map(([val, label, c]) => (
                                <div key={label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 10px', textAlign: 'center' }}>
                                    <div style={{ fontSize: 22, fontWeight: 800, color: c, fontFamily: 'monospace' }}>{val}</div>
                                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 3 }}>{label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <button onClick={() => setMode('browse')}
                                style={{ padding: '18px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                                📖 Browse All Questions
                                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>Solutions visible</span>
                            </button>
                            <button onClick={() => setShowTestConfig(true)}
                                style={{ padding: '18px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}>
                                ⏱ Take Timed Test
                                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 400 }}>Exam conditions</span>
                            </button>
                        </div>

                        {/* Other chapters quick-nav */}
                        <div style={{ marginTop: 40 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Other Chapters</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {allChapters
                                    .filter(ch => ch.id !== chapter.id && (ch.question_count ?? 0) > 0)
                                    .slice(0, 12)
                                    .map(ch => (
                                        <button key={ch.id} onClick={() => router.push(`/the-crucible/${ch.id}`)}
                                            style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)', fontSize: 11, cursor: 'pointer', transition: 'all 0.15s' }}>
                                            {ch.name} <span style={{ color: 'rgba(255,255,255,0.3)' }}>{ch.question_count}</span>
                                        </button>
                                    ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {showTestConfig && (
                <TestConfigModal maxQ={qCount} onStart={startTest} onClose={() => setShowTestConfig(false)} />
            )}
        </div>
    );
}
