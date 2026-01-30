import Link from 'next/link';
import { getAllSEOQuestions } from '../lib/seoData';
import { Layers, ChevronRight } from 'lucide-react';

export const metadata = {
    title: 'Chemistry Questions & Answers for Class 12, JEE, NEET | Canvas Classes',
    description: 'Browse thousands of chemistry questions and answers for Class 12, JEE Main, and NEET preparation. Topic-wise solutions for Physical, Organic, and Inorganic Chemistry.',
};

export const dynamic = 'force-dynamic';

export default async function QuestionsDirectory() {
    const questions = await getAllSEOQuestions();

    // Group by chapter
    const chapters = Array.from(new Set(questions.map(q => JSON.stringify({ name: q.chapterName, slug: q.chapterSlug, category: q.category }))))
        .map(s => JSON.parse(s));

    // Sort chapters alphabetically
    chapters.sort((a, b) => a.name.localeCompare(b.name));

    return (
        <main className="min-h-screen bg-slate-950 pt-48 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Chemistry <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Question Bank</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Explore our comprehensive database of chemistry questions, expert answers, and detailed explanations for JEE, NEET, and Board exams.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {chapters.map((chapter) => (
                        <Link
                            key={chapter.slug}
                            href={`/chemistry-questions/${chapter.slug}`}
                            className="group flex items-center justify-between p-6 bg-slate-900/50 border border-white/5 rounded-2xl hover:bg-slate-900 transition-all hover:border-blue-500/30"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 group-hover:text-blue-300 transition-colors">
                                    <Layers className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
                                        {chapter.name}
                                    </h2>
                                    <span className="text-sm text-slate-500">
                                        {questions.filter(q => q.chapterSlug === chapter.slug).length} Questions
                                    </span>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
