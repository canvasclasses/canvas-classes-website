import Link from 'next/link';
import { getAllChapters } from '../lib/jee-pyqs/data';
import { ArrowRight, BookOpen, Star, Trophy, Video } from 'lucide-react';

export const metadata = {
    title: 'Top 500 JEE Main PYQs | Canvas Classes',
    description: 'Master JEE Main with our curated collection of the Top 500 Previous Year Questions. Chapter-wise best questions with detailed video solutions.',
};

export default function JeePyqsPage() {
    const chapters = getAllChapters();
    const categories = ['Physical', 'Organic', 'Inorganic'];

    return (
        <main className="min-h-screen bg-slate-950 pt-32 pb-20">
            {/* Hero Section */}
            <div className="container mx-auto px-4 mb-16 text-center">
                <span className="inline-block py-1 px-3 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4 border border-amber-500/20">
                    <Star className="w-3 h-3 inline mr-1 fill-current" />
                    Premium Collection
                </span>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    Top 500 <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">JEE Main PYQs</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
                    Don't just practice randomly. We have hand-picked the <strong>Top 25 Questions</strong> from every chapter that cover 90% of the concepts asked in recent years.
                </p>
                
                <div className="flex justify-center gap-6 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <span>High Weightage</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-blue-500" />
                        <span>Video Solutions</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-emerald-500" />
                        <span>Detailed Explanations</span>
                    </div>
                </div>
            </div>

            {/* Chapter Grid */}
            <div className="container mx-auto px-4 max-w-5xl">
                {categories.map(category => {
                    const categoryChapters = chapters.filter(c => c.category === category);
                    if (categoryChapters.length === 0) return null;

                    return (
                        <div key={category} className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-6 pl-2 border-l-4 border-amber-500">
                                {category} Chemistry
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {categoryChapters.map(chapter => (
                                    <Link 
                                        key={chapter.id}
                                        href={`/jee-pyqs/${chapter.id}`}
                                        className="group relative bg-slate-900/50 border border-white/5 rounded-xl p-5 hover:bg-slate-900 hover:border-amber-500/50 transition-all duration-300"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-colors">
                                                <span className="font-bold text-lg">{chapter.name.charAt(0)}</span>
                                            </div>
                                            <span className="text-xs font-medium bg-slate-800 text-slate-400 px-2 py-1 rounded">
                                                Top 25
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-200 mb-1 group-hover:text-white">
                                            {chapter.name}
                                        </h3>
                                        <p className="text-sm text-slate-500 flex items-center gap-1 group-hover:text-amber-400/80 transition-colors">
                                            Start Practice 
                                            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}
