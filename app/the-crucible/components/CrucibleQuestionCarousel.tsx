'use client';

import { useEffect, useState } from 'react';
import MathRenderer from '@/app/crucible/admin/components/MathRenderer';

// Animated cycling question card — visual design and timing lifted from
// the Crucible landing's QuestionCard so the carousel looks identical
// wherever it's mounted. The data is parametric: pass in any 1+ question
// array and the carousel cycles them on a 4.8s loop with a built-in
// pick/reveal sequence (1.4s auto-pick → 2.2s reveal → 4.8s flip).
//
// Each option/body string is rendered through MathRenderer so chemistry
// macros (\ce{...}) render correctly.

export interface CarouselQuestion {
    /** Short exam tag, e.g. "JEE Main 2024". Falls back gracefully if empty. */
    exam: string;
    /** Question text in canonical markdown / LaTeX. */
    body: string;
    /** Option texts in canonical markdown / LaTeX. Up to 4 shown. */
    options: string[];
    /** 0-based index of the correct option in `options`. */
    correctIndex: number;
}

interface Props {
    questions: CarouselQuestion[];
    /** Pill label on the left of the meta row, e.g. "Physical Chemistry". */
    subjectLabel: string;
    /** Chapter name shown after the subject pill, e.g. "Mole Concept". */
    chapterName: string;
    /** Pill colour (matches the existing chapter accent palette). */
    subjectAccent: string;
}

export default function CrucibleQuestionCarousel({
    questions,
    subjectLabel,
    chapterName,
    subjectAccent,
}: Props) {
    const [idx, setIdx] = useState(0);
    const [revealed, setRevealed] = useState(false);
    const [picked, setPicked] = useState<number | null>(null);

    useEffect(() => {
        if (questions.length === 0) return;
        // Match the landing's pacing exactly: 1.4s pick → 2.2s reveal → 4.8s flip.
        const q = questions[idx];
        const t = setTimeout(() => setPicked(q.correctIndex), 1400);
        const r = setTimeout(() => setRevealed(true), 2200);
        const n = setTimeout(() => {
            setRevealed(false);
            setPicked(null);
            setIdx((i) => (i + 1) % questions.length);
        }, 4800);
        return () => {
            clearTimeout(t);
            clearTimeout(r);
            clearTimeout(n);
        };
    }, [idx, questions]);

    if (questions.length === 0) return null;
    const q = questions[idx];

    return (
        <>
            {/* Scoped keyframes — same names as the landing so they coexist when
                both renders land on the same page (unlikely but safe). */}
            <style>{`
                @keyframes crucibleHeroCardIn {
                    from { opacity: 0; transform: translateY(12px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0)    scale(1);    }
                }
                @keyframes crucibleHeroTimer { from { width: 0; } to { width: 100%; } }
            `}</style>
            {/* Outer card. minHeight + flex column with `justify-content:
                space-between` pins the footer (progress bar) to the bottom edge
                so the card holds a stable height across cycles even when a
                shorter question would otherwise let it collapse. Without this,
                every 4.8s when a shorter question comes up, the card shrinks
                and everything below it (in the rail and on the page) jumps. */}
            <div
                key={idx}
                style={{
                    position: 'relative',
                    width: '100%',
                    minHeight: 380,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '18px 18px 14px',
                    background:
                        'linear-gradient(180deg, rgba(20,20,32,0.88), rgba(14,14,22,0.94))',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    borderRadius: 14,
                    boxShadow:
                        '0 30px 60px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,138,61,0.06)',
                    pointerEvents: 'auto',
                    animation: 'crucibleHeroCardIn 380ms cubic-bezier(.2,.7,.2,1)',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 11,
                        marginBottom: 12,
                        flexWrap: 'wrap',
                    }}
                >
                    <span
                        style={{
                            fontWeight: 600,
                            fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
                            fontSize: 10,
                            letterSpacing: '0.1em',
                            padding: '3px 7px',
                            borderRadius: 4,
                            background: `${subjectAccent}2e`,
                            color: subjectAccent,
                        }}
                    >
                        {subjectLabel}
                    </span>
                    <span style={{ color: 'rgba(245,244,242,0.26)' }}>·</span>
                    <span style={{ color: 'rgba(245,244,242,0.62)' }}>{chapterName}</span>
                    {q.exam && (
                        <span
                            style={{
                                marginLeft: 'auto',
                                padding: '3px 8px',
                                background: 'rgba(255,138,61,0.10)',
                                color: '#FFD18A',
                                border: '1px solid rgba(255,138,61,0.22)',
                                borderRadius: 4,
                                fontSize: 10,
                                fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
                                letterSpacing: '0.06em',
                            }}
                        >
                            {q.exam}
                        </span>
                    )}
                </div>
                <div
                    style={{
                        fontSize: 14,
                        lineHeight: 1.45,
                        color: '#f5f4f2',
                        marginBottom: 12,
                    }}
                >
                    <MathRenderer markdown={truncate(q.body, 160)} fontSize={14} />
                </div>
                <div style={{ display: 'grid', gap: 6 }}>
                    {q.options.slice(0, 4).map((opt, i) => {
                        const isCorrect = revealed && i === q.correctIndex;
                        const isPicked = picked === i && !revealed;
                        const isWrong = revealed && picked === i && i !== q.correctIndex;
                        let bg = 'rgba(255,255,255,0.025)';
                        let border = '1px solid rgba(255,255,255,0.06)';
                        let color = 'rgba(245,244,242,0.86)';
                        let keyBg = 'rgba(255,255,255,0.05)';
                        let keyColor = 'rgba(245,244,242,0.62)';
                        if (isCorrect) {
                            border = '1px solid rgba(110,231,183,0.5)';
                            bg = 'rgba(110,231,183,0.10)';
                            color = 'rgb(180,255,220)';
                            keyBg = 'rgba(110,231,183,0.18)';
                            keyColor = 'rgb(110,231,183)';
                        } else if (isPicked) {
                            border = '1px solid rgba(255,138,61,0.45)';
                            bg = 'rgba(255,138,61,0.08)';
                            keyBg = 'rgba(255,138,61,0.18)';
                            keyColor = '#FFD18A';
                        } else if (isWrong) {
                            border = '1px solid rgba(245,100,100,0.4)';
                            bg = 'rgba(245,100,100,0.08)';
                        }
                        return (
                            <div
                                key={i}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    padding: '8px 10px',
                                    background: bg,
                                    border,
                                    borderRadius: 8,
                                    fontSize: 13,
                                    color,
                                    transition: 'all 220ms ease',
                                }}
                            >
                                <span
                                    style={{
                                        width: 20,
                                        height: 20,
                                        display: 'grid',
                                        placeItems: 'center',
                                        background: keyBg,
                                        borderRadius: 4,
                                        fontFamily:
                                            'ui-monospace, "JetBrains Mono", monospace',
                                        fontSize: 10,
                                        color: keyColor,
                                    }}
                                >
                                    {String.fromCharCode(65 + i)}
                                </span>
                                {/* MathRenderer needs a block container — div, not span */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <MathRenderer markdown={opt} fontSize={13} />
                                </div>
                                {isCorrect && (
                                    <span style={{ color: 'rgb(110,231,183)', fontWeight: 600 }}>
                                        ✓
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
                {/* Footer pinned to the bottom of the fixed-height card via
                    marginTop:auto — so shorter questions don't pull the
                    progress bar up and cause the surrounding layout to dance. */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        marginTop: 'auto',
                        paddingTop: 10,
                    }}
                >
                    <div
                        style={{
                            flex: 1,
                            height: 3,
                            background: 'rgba(255,255,255,0.06)',
                            borderRadius: 2,
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            key={idx}
                            style={{
                                height: '100%',
                                background: 'linear-gradient(90deg, #FFB46B, #FF8A3D)',
                                animation: 'crucibleHeroTimer 4.8s linear forwards',
                            }}
                        />
                    </div>
                    <div
                        style={{
                            fontSize: 10,
                            color: 'rgba(245,244,242,0.42)',
                            fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
                        }}
                    >
                        avg <span style={{ color: 'rgba(245,244,242,0.86)' }}>1m 42s</span>
                    </div>
                </div>
            </div>
        </>
    );
}

// Keep the question body compact in the carousel card. Cuts at word boundary
// when possible so we don't end mid-token (especially mid-LaTeX-command).
function truncate(s: string, max: number): string {
    if (s.length <= max) return s;
    const head = s.slice(0, max);
    const lastSpace = head.lastIndexOf(' ');
    return (lastSpace > max - 30 ? head.slice(0, lastSpace) : head) + '…';
}
