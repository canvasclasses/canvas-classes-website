'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ExternalLink, Lightbulb, Loader2, X, XCircle } from 'lucide-react';
import QuestionMarkdown from '../../lib/jee-main-pyqs/QuestionMarkdown';

// Shape returned by /api/v2/notes-quicktest/[chapterId]. Mirrors the route's
// QuickTestQuestion type. Kept in sync manually — both are small.
interface QuickTestQuestion {
    display_id: string;
    type: 'SCQ' | 'MCQ' | 'NVT' | 'AR' | 'MST' | 'MTC';
    difficultyLevel: number;
    question_text: { markdown: string };
    options: Array<{ id: string; text: string; is_correct: boolean }>;
    answer?: { integer_value?: number; decimal_value?: number; tolerance?: number; unit?: string };
    solution: { text_markdown: string };
}

interface ApiResponse {
    success: boolean;
    chapterId: string;
    count: number;
    questions: QuickTestQuestion[];
}

interface Props {
    chapterId: string;
    chapterName: string;
}

// Soft conversion CTA — shown after every Nth answered question. Tuned low
// enough to feel helpful, not pushy.
const CTA_INTERVAL = 5;

// Difficulty label/colour. Kept inline (3-5 entries) instead of importing a
// shared util — keeps the panel self-contained.
function difficultyLabel(level: number): { label: string; cls: string } {
    if (level <= 2) return { label: 'Easy', cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
    if (level === 3) return { label: 'Medium', cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
    return { label: 'Hard', cls: 'bg-rose-500/15 text-rose-300 border-rose-500/30' };
}

export default function SideBySidePractice({ chapterId, chapterName }: Props) {
    const [data, setData] = useState<QuickTestQuestion[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Per-question state: selected option ids (Set), and whether the user has
    // "submitted" their answer (revealing correctness + solution).
    // Indexed by question position so navigating preserves what the student saw.
    const [idx, setIdx] = useState(0);
    const [selectedByIdx, setSelectedByIdx] = useState<Record<number, Set<string>>>({});
    const [submittedByIdx, setSubmittedByIdx] = useState<Record<number, boolean>>({});
    const [showSolutionByIdx, setShowSolutionByIdx] = useState<Record<number, boolean>>({});

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);
        fetch(`/api/v2/notes-quicktest/${chapterId}`, {
            // Browser cache is fine — the server response is ISR'd anyway.
            cache: 'default',
        })
            .then((r) => r.json())
            .then((j: ApiResponse) => {
                if (cancelled) return;
                if (!j.success) {
                    setError('Failed to load practice questions.');
                    return;
                }
                setData(j.questions);
            })
            .catch(() => {
                if (cancelled) return;
                setError('Failed to load practice questions.');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [chapterId]);

    const total = data?.length ?? 0;
    const current = data && data[idx];
    const selected = selectedByIdx[idx] ?? new Set<string>();
    const submitted = !!submittedByIdx[idx];
    const showSolution = !!showSolutionByIdx[idx];

    const answeredCount = useMemo(
        () => Object.keys(submittedByIdx).filter((k) => submittedByIdx[Number(k)]).length,
        [submittedByIdx]
    );

    // Show CTA after every CTA_INTERVAL submitted answers (1-indexed thresholds:
    // 5, 10, 15…). Hide once they've answered all the questions — final CTA
    // covers the wrap-up case instead.
    const showInlineCta =
        answeredCount > 0 && answeredCount % CTA_INTERVAL === 0 && answeredCount < total;

    function toggleOption(optId: string) {
        if (submitted) return;
        setSelectedByIdx((prev) => {
            const cur = new Set(prev[idx] ?? []);
            if (!current) return prev;
            if (current.type === 'SCQ' || current.type === 'AR') {
                // Single-select: replace
                return { ...prev, [idx]: new Set([optId]) };
            }
            // MCQ multi-select: toggle
            if (cur.has(optId)) cur.delete(optId);
            else cur.add(optId);
            return { ...prev, [idx]: cur };
        });
    }

    function submitAnswer() {
        if (selected.size === 0) return;
        setSubmittedByIdx((p) => ({ ...p, [idx]: true }));
        setShowSolutionByIdx((p) => ({ ...p, [idx]: true }));
    }

    function nextQuestion() {
        if (idx < total - 1) setIdx(idx + 1);
    }
    function prevQuestion() {
        if (idx > 0) setIdx(idx - 1);
    }

    // ── Loading / error / empty states ─────────────────────────────────────
    if (loading) {
        return (
            <div className="flex h-full items-center justify-center text-zinc-500">
                <Loader2 size={20} className="animate-spin" />
                <span className="ml-2 text-sm">Loading practice questions…</span>
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                <p className="text-sm text-zinc-400">{error}</p>
                <Link
                    href={`/the-crucible/${chapterId}?mode=browse`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-xs font-bold text-black hover:from-orange-400 hover:to-amber-400"
                >
                    Open Crucible directly <ExternalLink size={12} />
                </Link>
            </div>
        );
    }
    if (!data || total === 0) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                <Lightbulb size={28} className="text-zinc-600" />
                <p className="text-sm text-zinc-400">
                    Demo practice questions for this chapter are coming soon.
                </p>
                <Link
                    href={`/the-crucible/${chapterId}?mode=browse`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-xs font-bold text-black hover:from-orange-400 hover:to-amber-400"
                >
                    Practice on Crucible <ExternalLink size={12} />
                </Link>
            </div>
        );
    }

    // ── Wrap-up screen — after the last question, replace the panel ────────
    const allAnswered = answeredCount >= total;
    if (allAnswered && idx === total - 1 && submitted) {
        const correctCount = (data ?? []).reduce((acc, q, qIdx) => {
            if (!submittedByIdx[qIdx]) return acc;
            const sel = selectedByIdx[qIdx] ?? new Set<string>();
            const correctIds = q.options.filter((o) => o.is_correct).map((o) => o.id);
            const allRight =
                sel.size === correctIds.length && correctIds.every((c) => sel.has(c));
            return allRight ? acc + 1 : acc;
        }, 0);
        return (
            <WrapUp
                chapterId={chapterId}
                chapterName={chapterName}
                correct={correctCount}
                total={total}
                onReview={() => setIdx(0)}
            />
        );
    }

    if (!current) return null;

    const diff = difficultyLabel(current.difficultyLevel);
    const correctIds = current.options.filter((o) => o.is_correct).map((o) => o.id);
    const isFullyCorrect =
        submitted &&
        selected.size === correctIds.length &&
        correctIds.every((c) => selected.has(c));

    return (
        <div className="flex h-full flex-col bg-slate-950">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] bg-slate-900/60 px-3 py-2.5">
                <div className="flex items-center gap-2 text-[11px]">
                    <span className="font-mono font-bold text-orange-300">{current.display_id}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${diff.cls}`}>
                        {diff.label}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        {current.type}
                    </span>
                </div>
                <div className="text-[11px] text-zinc-500">
                    <span className="font-mono text-zinc-300">{idx + 1}</span>
                    <span className="mx-1">/</span>
                    <span className="font-mono">{total}</span>
                </div>
            </div>

            {/* Body — scrollable */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="text-[13.5px] leading-relaxed text-zinc-100">
                    <QuestionMarkdown>{current.question_text.markdown}</QuestionMarkdown>
                </div>

                {/* Options (SCQ/MCQ/AR). NVT-only render in future if needed. */}
                {current.options.length > 0 && (
                    <ul className="mt-4 space-y-2">
                        {current.options.map((opt) => {
                            const isSel = selected.has(opt.id);
                            const isCorrect = opt.is_correct;
                            const showState = submitted;
                            // Visual state after submit:
                            //   selected + correct   → green
                            //   selected + wrong     → red
                            //   not selected + correct (missed) → green outline (hint)
                            //   not selected + wrong → muted
                            let cls = 'border-white/10 bg-white/[0.02] hover:border-orange-500/40 hover:bg-orange-500/[0.04]';
                            if (showState && isSel && isCorrect) {
                                cls = 'border-emerald-500/50 bg-emerald-500/10';
                            } else if (showState && isSel && !isCorrect) {
                                cls = 'border-rose-500/50 bg-rose-500/10';
                            } else if (showState && !isSel && isCorrect) {
                                cls = 'border-emerald-500/30 bg-emerald-500/[0.04]';
                            } else if (isSel) {
                                cls = 'border-orange-500/50 bg-orange-500/[0.08]';
                            }
                            return (
                                <li key={opt.id}>
                                    <button
                                        type="button"
                                        onClick={() => toggleOption(opt.id)}
                                        disabled={submitted}
                                        className={`flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-[13px] leading-relaxed text-zinc-200 transition-all ${cls} ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                                    >
                                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/15 text-[10px] font-bold uppercase">
                                            {opt.id}
                                        </span>
                                        <span className="flex-1">
                                            <QuestionMarkdown>{opt.text}</QuestionMarkdown>
                                        </span>
                                        {showState && isSel && isCorrect && (
                                            <Check size={14} className="mt-0.5 text-emerald-400" />
                                        )}
                                        {showState && isSel && !isCorrect && (
                                            <X size={14} className="mt-0.5 text-rose-400" />
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}

                {/* Submit / verdict row */}
                {!submitted ? (
                    <button
                        type="button"
                        onClick={submitAnswer}
                        disabled={selected.size === 0}
                        className="mt-4 w-full rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-sm font-bold text-black transition-all hover:from-orange-400 hover:to-amber-400 disabled:cursor-not-allowed disabled:from-zinc-700 disabled:to-zinc-700 disabled:text-zinc-500"
                    >
                        Check answer
                    </button>
                ) : (
                    <div
                        className={`mt-4 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${
                            isFullyCorrect
                                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                                : 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                        }`}
                    >
                        {isFullyCorrect ? (
                            <>
                                <CheckCircle2 size={16} /> Correct
                            </>
                        ) : (
                            <>
                                <XCircle size={16} /> Not quite — check the solution below
                            </>
                        )}
                    </div>
                )}

                {/* Solution (revealed on submit) */}
                {showSolution && current.solution.text_markdown && (
                    <div className="mt-4 rounded-lg border border-orange-500/20 bg-orange-500/[0.04] p-3">
                        <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-orange-300">
                            <Lightbulb size={12} /> Solution
                        </div>
                        <div className="text-[13px] leading-relaxed text-zinc-200">
                            <QuestionMarkdown>{current.solution.text_markdown}</QuestionMarkdown>
                        </div>
                    </div>
                )}

                {/* Inline CTA — every CTA_INTERVAL answered questions */}
                {showInlineCta && (
                    <ConversionCta chapterId={chapterId} variant="inline" />
                )}
            </div>

            {/* Nav footer */}
            <div className="flex items-center justify-between border-t border-white/[0.06] bg-slate-900/60 px-3 py-2.5">
                <button
                    type="button"
                    onClick={prevQuestion}
                    disabled={idx === 0}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                    <ArrowLeft size={12} /> Prev
                </button>
                <div className="text-[10px] text-zinc-600">
                    {answeredCount > 0 ? `${answeredCount} answered` : 'Demo — not graded'}
                </div>
                <button
                    type="button"
                    onClick={nextQuestion}
                    disabled={idx === total - 1}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                    Next <ArrowRight size={12} />
                </button>
            </div>
        </div>
    );
}

// ── Wrap-up screen ─────────────────────────────────────────────────────────
// Shown after the student has submitted all questions. Designed as the
// natural conversion point: this is where the user has just experienced the
// quality of Crucible and is most receptive.
function WrapUp({
    chapterId,
    chapterName,
    correct,
    total,
    onReview,
}: {
    chapterId: string;
    chapterName: string;
    correct: number;
    total: number;
    onReview: () => void;
}) {
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    return (
        <div className="flex h-full flex-col items-center justify-center gap-4 bg-gradient-to-b from-slate-950 to-slate-900 px-6 py-8 text-center">
            <CheckCircle2 size={36} className="text-emerald-400" />
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Demo complete
                </p>
                <p className="mt-2 text-2xl font-bold text-white">
                    {correct} <span className="text-zinc-500">/ {total}</span>
                </p>
                <p className="text-sm text-zinc-400">{pct}% correct on this {chapterName} sampler</p>
            </div>
            <ConversionCta chapterId={chapterId} variant="block" />
            <button
                type="button"
                onClick={onReview}
                className="text-[11px] font-semibold text-zinc-500 underline-offset-2 hover:text-zinc-300 hover:underline"
            >
                Review my answers
            </button>
        </div>
    );
}

// ── Conversion CTA ─────────────────────────────────────────────────────────
// Two variants: 'inline' (between questions) and 'block' (full-card on wrap).
function ConversionCta({ chapterId, variant }: { chapterId: string; variant: 'inline' | 'block' }) {
    if (variant === 'inline') {
        return (
            <Link
                href={`/the-crucible/${chapterId}?mode=browse`}
                target="_blank"
                className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-amber-500/10 px-3 py-2.5 text-xs font-semibold text-orange-200 transition-all hover:border-orange-500/50 hover:from-orange-500/15 hover:to-amber-500/15"
            >
                <span>
                    Enjoying this? <span className="text-white">4,000+ more</span> with adaptive practice on Crucible.
                </span>
                <ExternalLink size={12} className="shrink-0" />
            </Link>
        );
    }
    return (
        <Link
            href={`/the-crucible/${chapterId}?mode=browse`}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-sm font-bold text-black transition-all hover:from-orange-400 hover:to-amber-400"
        >
            Practice 4,000+ more on Crucible <ExternalLink size={14} />
        </Link>
    );
}
