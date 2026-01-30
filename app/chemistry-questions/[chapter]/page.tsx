import Link from 'next/link';
import { getQuestionsByChapterSlug, getAllChapterSlugs } from '../../lib/seoData';
import { notFound } from 'next/navigation';
import { ChevronLeft, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
    const slugs = await getAllChapterSlugs();
    return slugs.map((slug) => ({
        chapter: slug,
    }));
}

export async function generateMetadata(props: { params: Promise<{ chapter: string }> }) {
    const params = await props.params;
    const chapter = decodeURIComponent(params.chapter);
    const data = await getQuestionsByChapterSlug(chapter);
    if (!data) return {};

    return {
        title: `${data.chapterName} Questions & Answers - Class 12 Chemistry | Canvas Classes`,
        description: `Practice ${data.chapterName} questions for JEE, NEET and CBSE Class 12. Detailed answers and explanations for all top concepts.`,
    };
}

export default async function ChapterQuestionsPage(props: { params: Promise<{ chapter: string }> }) {
    const params = await props.params;
    const chapter = decodeURIComponent(params.chapter);
    const data = await getQuestionsByChapterSlug(chapter);

    if (!data) {
        return (
            <main className="min-h-screen bg-slate-950 pt-48 flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Chapter Not Found</h1>
                    <p className="text-slate-400 mb-8">Could not find questions for: "{chapter}"</p>
                    <Link href="/chemistry-questions" className="text-blue-400 hover:underline">Back to Directory</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-950 pt-48 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link
                    href="/chemistry-questions"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to All Chapters
                </Link>

                <div className="mb-12">
                    <span className="text-blue-400 font-medium mb-2 block">{data.questions[0].category}</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        {data.chapterName}
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Browse {data.questions.length} questions on {data.chapterName}. Click on any question to view the detailed answer and explanation.
                    </p>
                </div>

                <div className="space-y-4">
                    {data.questions.map((q) => (
                        <Link
                            key={q.id}
                            href={`/chemistry-questions/${params.chapter}/${q.slug}`}
                            className="block p-6 bg-slate-900/40 border border-white/5 rounded-xl hover:bg-slate-900 hover:border-blue-500/30 transition-all group"
                        >
                            <div className="flex items-start gap-4">
                                <FileText className="w-5 h-5 text-slate-500 mt-1 group-hover:text-blue-400 transition-colors" />
                                <div className="flex-1 overflow-hidden">
                                    <div className="text-lg font-medium text-slate-200 group-hover:text-white transition-colors overflow-hidden">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkMath]}
                                            rehypePlugins={[rehypeKatex]}
                                        >
                                            {q.question.length > 150 ? q.question.substring(0, 150) + '...' : q.question}
                                        </ReactMarkdown>
                                    </div>
                                    <span className="text-xs text-slate-500 mt-2 block uppercase tracking-wider">
                                        {q.topicName}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
