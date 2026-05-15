'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import type { QuizData, QuizQuestion } from '@/app/lib/quizzes/types';

// Renders an interactive chemistry quiz. Users click an option — correct
// picks turn green, incorrect picks turn red and the correct answer is
// highlighted. The explanation is revealed automatically after any pick.
//
// SEO / AI-friendliness:
// The correct-answer + explanation block is ALWAYS in the rendered DOM
// regardless of UI state — when no option is picked, the block carries
// `sr-only` (screen-reader-only) styling, which keeps the text in the
// HTML output while hiding it visually. AI crawlers like ChatGPT and
// Perplexity that read raw HTML still see every answer and explanation
// on first fetch.

type OptionId = 'a' | 'b' | 'c' | 'd';

const DIFFICULTY_STYLES: Record<QuizQuestion['difficulty'], string> = {
    easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    hard: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
};

function Markdown({ children }: { children: string }) {
    return (
        <div className="prose prose-invert prose-sm md:prose-base max-w-none [&_p]:my-0 [&_p]:leading-relaxed [&_img]:my-3 [&_img]:rounded-lg [&_img]:bg-white [&_img]:p-2 [&_img]:max-w-full [&_img]:max-h-[420px] [&_img]:h-auto [&_img]:mx-auto [&_img]:block">
            <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
                    img: (props) => <img {...props} loading="lazy" />,
                }}
            >
                {children}
            </ReactMarkdown>
        </div>
    );
}

function QuestionCard({ question }: { question: QuizQuestion }) {
    const [selectedId, setSelectedId] = useState<OptionId | null>(null);
    const correctOption = question.options.find((o) => o.id === question.answerId)!;
    const isAnswered = selectedId !== null;
    const isCorrect = selectedId === question.answerId;

    function optionState(optId: OptionId): 'unselected' | 'correct' | 'wrongPick' | 'faded' {
        if (!isAnswered) return 'unselected';
        if (optId === question.answerId) return 'correct';
        if (optId === selectedId) return 'wrongPick';
        return 'faded';
    }

    function optionButtonClass(optId: OptionId): string {
        const s = optionState(optId);
        if (s === 'unselected') {
            return 'bg-white/[0.02] border-gray-700/50 hover:border-orange-500/50 hover:bg-orange-500/5 cursor-pointer';
        }
        if (s === 'correct') {
            return 'bg-emerald-500/10 border-emerald-500/50 cursor-default';
        }
        if (s === 'wrongPick') {
            return 'bg-rose-500/10 border-rose-500/50 cursor-default';
        }
        return 'bg-white/[0.02] border-gray-800/40 opacity-50 cursor-default';
    }

    function optionBadgeClass(optId: OptionId): string {
        const s = optionState(optId);
        if (s === 'unselected') return 'bg-white/5 border-white/10 text-gray-400 group-hover:bg-orange-500/20 group-hover:border-orange-500/40 group-hover:text-orange-300';
        if (s === 'correct') return 'bg-emerald-500/30 border-emerald-500/60 text-emerald-200';
        if (s === 'wrongPick') return 'bg-rose-500/30 border-rose-500/60 text-rose-200';
        return 'bg-white/5 border-white/10 text-gray-500';
    }

    return (
        <div
            id={`q${question.id}`}
            className="rounded-xl border border-gray-700/50 bg-gray-900/40 overflow-hidden transition-colors"
        >
            <div className="p-5 md:p-6">
                {/* Status row */}
                <div className="flex items-center gap-2 flex-wrap mb-3">
                    <span className="text-xs font-mono text-gray-500">Q{question.id}</span>
                    <span
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${DIFFICULTY_STYLES[question.difficulty]}`}
                    >
                        {question.difficulty}
                    </span>
                    {question.sourcePYQ && (question.sourcePYQ.exam || question.sourcePYQ.year) && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border bg-violet-500/10 text-violet-300 border-violet-500/30">
                            {question.sourcePYQ.exam ? question.sourcePYQ.exam.replace(/_/g, ' ') : 'PYQ'}
                            {question.sourcePYQ.year ? ` · ${question.sourcePYQ.year}` : ''}
                        </span>
                    )}
                    {isAnswered && (
                        <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                                isCorrect
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            }`}
                        >
                            {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </span>
                    )}
                </div>

                {/* Question stem */}
                <div className="text-base md:text-lg text-white font-medium leading-relaxed mb-4">
                    <Markdown>{question.stem}</Markdown>
                </div>

                {/* Options — clickable buttons with feedback colours */}
                <ol className="space-y-2 list-none">
                    {question.options.map((opt) => {
                        const s = optionState(opt.id);
                        return (
                            <li key={opt.id}>
                                <button
                                    type="button"
                                    onClick={() => !isAnswered && setSelectedId(opt.id)}
                                    disabled={isAnswered}
                                    aria-pressed={selectedId === opt.id}
                                    className={`group w-full text-left rounded-lg border p-3 md:p-3.5 flex gap-3 items-start transition-all ${optionButtonClass(opt.id)}`}
                                >
                                    <span
                                        className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold mt-0.5 border transition-colors ${optionBadgeClass(opt.id)}`}
                                    >
                                        {opt.id}
                                    </span>
                                    <div className="flex-1 text-sm md:text-base text-gray-200 min-w-0">
                                        <Markdown>{opt.text}</Markdown>
                                    </div>
                                    {s === 'correct' && (
                                        <span
                                            className="flex-shrink-0 text-emerald-400 text-lg font-bold leading-none mt-0.5"
                                            aria-label="Correct answer"
                                        >
                                            ✓
                                        </span>
                                    )}
                                    {s === 'wrongPick' && (
                                        <span
                                            className="flex-shrink-0 text-rose-400 text-lg font-bold leading-none mt-0.5"
                                            aria-label="Your incorrect pick"
                                        >
                                            ✗
                                        </span>
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ol>

                {/* Reset button — only shown after answering */}
                {isAnswered && (
                    <button
                        type="button"
                        onClick={() => setSelectedId(null)}
                        className="mt-4 text-xs text-gray-500 hover:text-orange-400 transition-colors inline-flex items-center gap-1"
                    >
                        <span aria-hidden="true">↻</span>
                        <span>Try this question again</span>
                    </button>
                )}
            </div>

            {/*
                Correct-answer + explanation block.
                Always rendered into the DOM. Before the user picks an option
                it carries `sr-only` so the text stays in the HTML for AI
                crawlers and screen readers but is hidden visually. Once
                answered, full visual styles apply.
            */}
            <div
                aria-live="polite"
                className={
                    isAnswered
                        ? 'border-t border-gray-700/50 bg-gradient-to-b from-orange-500/5 to-transparent p-5 md:p-6'
                        : 'sr-only'
                }
            >
                <div className="flex items-start gap-2 mb-3 flex-wrap">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mt-1">
                        Correct answer:
                    </span>
                    <span className="flex items-center justify-center w-6 h-6 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                        {correctOption.id}
                    </span>
                    <div className="text-sm md:text-base text-emerald-100/90 font-medium flex-1 min-w-[12rem]">
                        <Markdown>{correctOption.text}</Markdown>
                    </div>
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    Explanation
                </div>
                <div className="text-sm md:text-base text-gray-300 leading-relaxed">
                    <Markdown>{question.explanation}</Markdown>
                </div>
            </div>
        </div>
    );
}

interface Props {
    quiz: QuizData;
}

export default function QuizClient({ quiz }: Props) {
    // Group consecutive same-topic questions for visual section dividers.
    const grouped: { topic: string; questions: QuizQuestion[] }[] = [];
    for (const q of quiz.questions) {
        const last = grouped[grouped.length - 1];
        if (last && last.topic === q.topic) {
            last.questions.push(q);
        } else {
            grouped.push({ topic: q.topic, questions: [q] });
        }
    }

    return (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Questions{' '}
                    <span className="text-gray-500 text-lg font-normal">
                        ({quiz.questions.length})
                    </span>
                </h2>
                <span className="text-xs text-gray-500">
                    Click an option — correct picks go green, wrong picks go red.
                </span>
            </div>

            {grouped.map((group, gi) => (
                <div key={gi} className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px flex-1 bg-gradient-to-r from-orange-500/40 to-transparent" />
                        <span className="text-xs font-semibold uppercase tracking-widest text-orange-400">
                            {group.topic}
                        </span>
                        <div className="h-px flex-1 bg-gradient-to-l from-orange-500/40 to-transparent" />
                    </div>

                    <div className="space-y-3">
                        {group.questions.map((q) => (
                            <QuestionCard key={q.id} question={q} />
                        ))}
                    </div>
                </div>
            ))}
        </section>
    );
}
