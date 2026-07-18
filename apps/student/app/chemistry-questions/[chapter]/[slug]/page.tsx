
import Link from 'next/link';
import { getQuestionBySlugs, getAllSEOQuestions, getRelatedQuestions } from '@/features/landing/lib/seoData';
import { notFound } from 'next/navigation';
import { ChevronLeft, Brain, Zap, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
// \ce{} chemistry macro support — without this, any \ce formula renders as a
// KaTeX ParseError (see QuestionMarkdown.tsx / QUESTION_LIBRARY_SPEC Phase A.1).
import 'katex/contrib/mhchem';

/*
export async function generateStaticParams() {
    const questions = await getAllSEOQuestions();
    return questions.map((q) => ({
        chapter: q.chapterSlug,
        slug: q.slug,
    }));
}
*/

// 28-day ISR — leaf SEO pages, content is the same for everyone. The
// generateStaticParams block above is commented out intentionally
// (was causing slow builds) — pages are generated on-demand on first
// request after the cache expires. 7d → 28d (2026-07-18): this was the last
// question family on the 7-day window, whose expiry resonated with the weekly
// value-bot sitemap sweep (every visit = just-expired page = SWR rebuild).
// Matches the-crucible/q and jee-main-pyqs. See QUESTION_LIBRARY_SPEC Phase A.5.
export const revalidate = 2419200;

export async function generateMetadata(props: { params: Promise<{ chapter: string; slug: string }> }) {
    const params = await props.params;
    const chapter = decodeURIComponent(params.chapter);
    const question = await getQuestionBySlugs(chapter, params.slug);
    if (!question) return {};

    return {
        title: `${question.question.substring(0, 50)}... - Class 12 Chemistry`,
        description: `Detailed answer for: ${question.question.substring(0, 120)}... Chapter: ${question.chapterName}.`,
        alternates: {
            canonical: `https://www.canvasclasses.in/chemistry-questions/${params.chapter}/${params.slug}`,
        },
    };
}

export default async function QuestionPage(props: { params: Promise<{ chapter: string; slug: string }> }) {
    const params = await props.params;
    const chapter = decodeURIComponent(params.chapter);
    const slug = params.slug;
    const question = await getQuestionBySlugs(chapter, slug);

    if (!question) {
        return (
            <main className="min-h-screen bg-slate-950 pt-48 flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Question Not Found</h1>
                    <p className="text-slate-400 mb-8">Could not find question in "{chapter}"</p>
                    <Link href={`/chemistry-questions/${chapter}`} className="text-blue-400 hover:underline">Back to Chapter</Link>
                </div>
            </main>
        );
    }

    const relatedQuestions = await getRelatedQuestions(question);

    // JSON-LD Schema for Q&A Page — education-exception shape (2026-07-18,
    // QUESTION_LIBRARY_SPEC Phase A.4): single expert acceptedAnswer capped at
    // 500 chars (was the COMPLETE untruncated answer — the most
    // AI-Overview-feedable object on the page), Person author for E-E-A-T
    // (was anonymous Organization), www-canonical URL (was bare domain,
    // violating SEO_PLAYBOOK Part A #1), + BreadcrumbList (was missing).
    const pageUrl = `https://www.canvasclasses.in/chemistry-questions/${params.chapter}/${params.slug}`;
    const answerTeaser = question.answer
        .replace(/\$\$?[^$]*\$\$?/g, '')
        .replace(/[*_`#>]/g, '')
        .trim()
        .substring(0, 500);
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'QAPage',
        'mainEntity': {
            '@type': 'Question',
            'name': question.question.substring(0, 200),
            'text': question.question,
            'answerCount': 1,
            'upvoteCount': 0,
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': answerTeaser,
                'upvoteCount': 0,
                'url': pageUrl,
                // Organization author — the "teacher as face of the brand"
                // question is an OPEN decision (QUESTION_LIBRARY_SPEC §7);
                // keep attribution neutral until it's made.
                'author': {
                    '@type': 'Organization',
                    'name': 'Canvas Classes',
                    'url': 'https://www.canvasclasses.in',
                }
            }
        },
        'breadcrumb': {
            '@type': 'BreadcrumbList',
            'itemListElement': [
                { '@type': 'ListItem', 'position': 1, 'name': 'Chemistry Questions', 'item': 'https://www.canvasclasses.in/chemistry-questions' },
                { '@type': 'ListItem', 'position': 2, 'name': question.chapterName, 'item': `https://www.canvasclasses.in/chemistry-questions/${params.chapter}` },
                { '@type': 'ListItem', 'position': 3, 'name': question.question.substring(0, 60), 'item': pageUrl },
            ],
        },
    };

    return (
        <main className="min-h-screen bg-slate-950 pt-48 pb-20">
            {/* Inject Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container mx-auto px-4 max-w-3xl">
                {/* Breadcrumb / Back Link */}
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 mb-8">
                    <Link href="/chemistry-questions" className="hover:text-white transition-colors">Questions</Link>
                    <span>/</span>
                    <Link href={`/chemistry-questions/${params.chapter}`} className="hover:text-white transition-colors">{question.chapterName}</Link>
                    <span>/</span>
                    <span className="text-slate-300 truncate max-w-[200px]">{question.question.substring(0, 20)}...</span>
                </div>

                <article className="bg-slate-900/40 border border-white/5 rounded-2xl p-8 mb-12">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
                            {question.topicName}
                        </span>
                        <span className="text-slate-500 text-sm">
                            {question.chapterName}
                        </span>
                    </div>

                    <div className="text-2xl md:text-3xl font-bold text-white mb-8 leading-relaxed">
                        <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            components={{
                                strong: ({ node, ...props }) => <span className="text-amber-300 font-bold" {...props} />,
                            }}
                        >
                            {question.question}
                        </ReactMarkdown>
                    </div>

                    {/* Answer Section */}
                    <div className="prose prose-invert prose-lg max-w-none border-t border-white/5 pt-8">
                        <h3 className="text-emerald-400 text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Brain className="w-4 h-4" />
                            Expert Answer
                        </h3>
                        <div className="text-slate-300 leading-relaxed">
                            <ReactMarkdown
                                remarkPlugins={[remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                                components={{
                                    strong: ({ node, ...props }) => <span className="text-amber-300 font-bold" {...props} />,
                                }}
                            >
                                {question.answer}
                            </ReactMarkdown>
                        </div>
                    </div>
                </article>

                {/* CTA - The Goal of this page */}
                <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/20 rounded-2xl p-8 text-center mb-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                        <Zap className="w-32 h-32 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 relative z-10">
                        Master this topic with Flashcards
                    </h3>
                    <p className="text-slate-300 mb-6 max-w-xl mx-auto relative z-10">
                        Use our Spaced Repetition flashcards to memorize {question.topicName} and ace your exams.
                    </p>
                    <Link
                        href="/chemistry-flashcards"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors relative z-10"
                    >
                        Start Practicing Now
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                {/* Related Questions */}
                {relatedQuestions.length > 0 && (
                    <div className="border-t border-white/5 pt-12">
                        <h3 className="text-xl font-bold text-white mb-6">Related Questions in {question.chapterName}</h3>
                        <div className="space-y-4">
                            {relatedQuestions.map(rq => (
                                <Link
                                    key={rq.id}
                                    href={`/chemistry-questions/${params.chapter}/${rq.slug}`}
                                    className="block p-4 rounded-xl bg-slate-800/30 hover:bg-slate-800 transition-colors border border-white/5"
                                >
                                    <div className="text-slate-200 font-medium">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkMath]}
                                            rehypePlugins={[rehypeKatex]}
                                        >
                                            {rq.question}
                                        </ReactMarkdown>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-8 text-center">
                            <Link
                                href={`/chemistry-questions/${params.chapter}`}
                                className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
                            >
                                View all {question.chapterName} questions →
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
