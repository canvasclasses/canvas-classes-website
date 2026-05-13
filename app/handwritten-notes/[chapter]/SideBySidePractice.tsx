'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ExternalLink, Lightbulb, Loader2, X, XCircle } from 'lucide-react';
import MathRenderer from '../../crucible/admin/components/MathRenderer';

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

// NVT correctness — matches the canonical check in AdaptiveQuestionCard.
//   - integer_value: exact equality
//   - decimal_value: within `tolerance` (defaults to 0.01)
function isNvtCorrect(q: QuickTestQuestion, inputStr: string): boolean {
    if (!q.answer) return false;
    const v = parseFloat(inputStr);
    if (Number.isNaN(v)) return false;
    if (typeof q.answer.integer_value === 'number') {
        return v === q.answer.integer_value;
    }
    if (typeof q.answer.decimal_value === 'number') {
        const tol = q.answer.tolerance ?? 0.01;
        return Math.abs(v - q.answer.decimal_value) <= tol;
    }
    return false;
}

// Stringified canonical answer for the "Correct: 9.8" hint after a wrong NVT submit.
function nvtCorrectAnswerLabel(q: QuickTestQuestion): string | null {
    if (!q.answer) return null;
    const unit = q.answer.unit ? ` ${q.answer.unit}` : '';
    if (typeof q.answer.integer_value === 'number') return `${q.answer.integer_value}${unit}`;
    if (typeof q.answer.decimal_value === 'number') return `${q.answer.decimal_value}${unit}`;
    return null;
}

export default function SideBySidePractice({ chapterId, chapterName }: Props) {
    const [data, setData] = useState<QuickTestQuestion[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Per-question state, keyed by display_id (NOT array position). If the
    // chapter's demo set is edited in the admin while a student has the
    // session open and the API revalidates, position-keyed state would
    // silently attach to whatever question moved into that slot — confusing
    // at best, wrong-answer-marking at worst. display_id is stable across
    // re-fetches.
    const [idx, setIdx] = useState(0);
    const [selectedById, setSelectedById] = useState<Record<string, Set<string>>>({});
    const [submittedById, setSubmittedById] = useState<Record<string, boolean>>({});
    const [showSolutionById, setShowSolutionById] = useState<Record<string, boolean>>({});
    // NVT numerical inputs — free-form text, separate from option selections.
    const [nvtInputById, setNvtInputById] = useState<Record<string, string>>({});

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
    const currentId = current?.display_id ?? '';
    const selected = selectedById[currentId] ?? new Set<string>();
    const submitted = !!submittedById[currentId];
    const showSolution = !!showSolutionById[currentId];
    const nvtInput = nvtInputById[currentId] ?? '';
    const isNvt = current?.type === 'NVT';

    // Count submissions where the question still exists in the current data
    // set — protects against stale state lingering after a re-fetch.
    const answeredCount = useMemo(() => {
        if (!data) return 0;
        const present = new Set(data.map((q) => q.display_id));
        return Object.keys(submittedById).filter((id) => present.has(id) && submittedById[id]).length;
    }, [submittedById, data]);

    // Show CTA after every CTA_INTERVAL submitted answers (1-indexed thresholds:
    // 5, 10, 15…). Hide once they've answered all the questions — final CTA
    // covers the wrap-up case instead.
    const showInlineCta =
        answeredCount > 0 && answeredCount % CTA_INTERVAL === 0 && answeredCount < total;

    function toggleOption(optId: string) {
        if (submitted || !current) return;
        const key = current.display_id;
        setSelectedById((prev) => {
            const cur = new Set(prev[key] ?? []);
            if (current.type === 'SCQ' || current.type === 'AR') {
                // Single-select: replace
                return { ...prev, [key]: new Set([optId]) };
            }
            // MCQ multi-select: toggle
            if (cur.has(optId)) cur.delete(optId);
            else cur.add(optId);
            return { ...prev, [key]: cur };
        });
    }

    // True when the student has provided something to submit. NVT requires
    // a non-empty input; choice questions require ≥1 selected option.
    const canSubmit = isNvt ? nvtInput.trim().length > 0 : selected.size > 0;

    function submitAnswer() {
        if (!canSubmit || !currentId) return;
        setSubmittedById((p) => ({ ...p, [currentId]: true }));
        setShowSolutionById((p) => ({ ...p, [currentId]: true }));
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
        const correctCount = (data ?? []).reduce((acc, q) => {
            const key = q.display_id;
            if (!submittedById[key]) return acc;
            if (q.type === 'NVT') {
                return isNvtCorrect(q, nvtInputById[key] ?? '') ? acc + 1 : acc;
            }
            const sel = selectedById[key] ?? new Set<string>();
            const correctIds = q.options.filter((o) => o.is_correct).map((o) => o.id);
            if (correctIds.length === 0) return acc; // safety: ignore questions with no defined correct
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
        (isNvt
            ? isNvtCorrect(current, nvtInput)
            : correctIds.length > 0 &&
              selected.size === correctIds.length &&
              correctIds.every((c) => selected.has(c)));

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

            {/* Body — scrollable. Typography mirrors the canonical Crucible
                question card (AdaptiveQuestionCard) so the demo feels indistinguishable
                from the paid product: 17px question / 15px options with 1.7 line-height
                and the same MathRenderer that handles \ce{} chemistry macros. */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
                <div className="mb-5 text-white" style={{ fontSize: 17, lineHeight: 1.7 }}>
                    <MathRenderer markdown={current.question_text.markdown} fontSize={17} />
                </div>

                {/* Options (SCQ/MCQ/AR). NVT-only render in future if needed.
                    Sizing/colors mirror Crucible's AdaptiveQuestionCard: 14×18 padding,
                    12px radius, 15px option text, 24×24 badge with 6px radius. */}
                {current.options.length > 0 && (
                    <ul className="flex flex-col gap-2.5">
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
                            let badgeCls = 'bg-white/10 text-zinc-300';
                            if (showState && isSel && isCorrect) {
                                cls = 'border-emerald-500/50 bg-emerald-500/10';
                                badgeCls = 'bg-emerald-500 text-emerald-950';
                            } else if (showState && isSel && !isCorrect) {
                                cls = 'border-rose-500/50 bg-rose-500/10';
                                badgeCls = 'bg-rose-500 text-rose-950';
                            } else if (showState && !isSel && isCorrect) {
                                cls = 'border-emerald-500/40 bg-emerald-500/[0.06]';
                                badgeCls = 'bg-emerald-500/30 text-emerald-200';
                            } else if (isSel) {
                                cls = 'border-orange-500/50 bg-orange-500/[0.08]';
                                badgeCls = 'bg-orange-500 text-orange-950';
                            }
                            return (
                                <li key={opt.id}>
                                    <button
                                        type="button"
                                        onClick={() => toggleOption(opt.id)}
                                        disabled={submitted}
                                        className={`flex w-full items-center gap-3 rounded-xl border text-left text-white transition-all ${cls} ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                                        style={{ padding: '14px 18px' }}
                                    >
                                        <span
                                            className={`inline-flex shrink-0 items-center justify-center rounded-md font-bold uppercase ${badgeCls}`}
                                            style={{ width: 24, height: 24, fontSize: 11 }}
                                        >
                                            {showState && isSel && isCorrect ? <Check size={12} /> :
                                             showState && isSel && !isCorrect ? <X size={12} /> :
                                             opt.id.toUpperCase()}
                                        </span>
                                        <span
                                            className="flex-1"
                                            style={{
                                                fontSize: 15,
                                                color: showState && !isSel && !isCorrect ? 'rgba(255,255,255,0.4)' : '#fff',
                                            }}
                                        >
                                            <MathRenderer markdown={opt.text} fontSize={15} />
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}

                {/* NVT numerical input — only for NVT questions, mirrors Crucible's
                    AdaptiveQuestionCard pattern. Enter to submit; after submit shows
                    "Your answer / Correct" row in green or rose. */}
                {isNvt && !submitted && (
                    <div className="mt-2 flex items-stretch gap-2.5">
                        <input
                            type="text"
                            inputMode="decimal"
                            value={nvtInput}
                            onChange={(e) =>
                                currentId && setNvtInputById((p) => ({ ...p, [currentId]: e.target.value }))
                            }
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') submitAnswer();
                            }}
                            placeholder="Enter answer…"
                            className="flex-1 rounded-xl border border-white/[0.12] bg-white/[0.03] text-white outline-none transition-colors focus:border-orange-500/50"
                            style={{ padding: '14px 18px', fontSize: 16, fontWeight: 600 }}
                        />
                    </div>
                )}
                {isNvt && submitted && (
                    <div
                        className={`mt-2 flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3 ${
                            isFullyCorrect
                                ? 'border-emerald-500/30 bg-emerald-500/[0.08]'
                                : 'border-rose-500/30 bg-rose-500/[0.08]'
                        }`}
                    >
                        <span className="text-[13px] text-zinc-400">Your answer:</span>
                        <span
                            className="text-[16px] font-bold"
                            style={{ color: isFullyCorrect ? '#34d399' : '#f87171' }}
                        >
                            {nvtInput || '—'}
                        </span>
                        {!isFullyCorrect && nvtCorrectAnswerLabel(current) && (
                            <>
                                <span className="text-[13px] text-zinc-500">Correct:</span>
                                <span className="text-[16px] font-bold text-emerald-400">
                                    {nvtCorrectAnswerLabel(current)}
                                </span>
                            </>
                        )}
                    </div>
                )}

                {/* Submit / verdict row */}
                {!submitted ? (
                    <button
                        type="button"
                        onClick={submitAnswer}
                        disabled={!canSubmit}
                        className="mt-4 w-full rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-sm font-bold text-black transition-all hover:from-orange-400 hover:to-amber-400 disabled:cursor-not-allowed disabled:from-zinc-700 disabled:to-zinc-700 disabled:text-zinc-500"
                    >
                        Check answer
                    </button>
                ) : (
                    // For NVT, the green/rose answer row above already gives the verdict;
                    // hide the redundant verdict pill in that case.
                    !isNvt && (
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
                    </div>)
                )}

                {/* Solution (revealed on submit) */}
                {showSolution && current.solution.text_markdown && (
                    <div className="mt-5 rounded-xl border border-orange-500/20 bg-orange-500/[0.04] p-4">
                        <div className="mb-2.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-orange-300">
                            <Lightbulb size={12} /> Solution
                        </div>
                        <div className="text-zinc-100" style={{ fontSize: 15, lineHeight: 1.7 }}>
                            <MathRenderer markdown={current.solution.text_markdown} fontSize={15} />
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
