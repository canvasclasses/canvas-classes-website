'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, FileText, Beaker, Download, X, ExternalLink, BookOpen } from 'lucide-react';
import { getChapters, NcertChapter, NcertBooksData } from '@/app/lib/ncertBooksData';

interface NcertBooksClientProps {
    initialData: NcertBooksData;
}

// Data is now fetched on the server and passed as props for SEO
export default function NcertBooksClient({ initialData }: NcertBooksClientProps) {
    const [activeTab, setActiveTab] = useState<'textbook' | 'exemplar' | 'lab-manual'>('textbook');
    const [readingChapter, setReadingChapter] = useState<NcertChapter | null>(null);
    const data = initialData;

    // Get chapters for both classes
    const chapters11 = getChapters(data, '11', activeTab);
    const chapters12 = getChapters(data, '12', activeTab);

    // Get icon for active tab
    const getTabIcon = () => {
        switch (activeTab) {
            case 'textbook': return Book;
            case 'exemplar': return FileText;
            case 'lab-manual': return Beaker;
        }
    };
    const TabIcon = getTabIcon();

    // Get gradient for active tab
    const getTabGradient = () => {
        switch (activeTab) {
            case 'textbook': return 'from-indigo-500 to-purple-500';
            case 'exemplar': return 'from-teal-500 to-cyan-500';
            case 'lab-manual': return 'from-orange-500 to-amber-500';
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-indigo-500/30">
            {/* Focus Reader Modal */}
            <AnimatePresence>
                {readingChapter && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex flex-col"
                    >
                        {/* Reader Toolbar */}
                        <div className="h-16 border-b border-gray-800 bg-gray-900/90 flex items-center justify-between px-4 md:px-6">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 shrink-0">
                                    <BookOpen size={20} />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-gray-100 text-sm md:text-base truncate">{readingChapter.title}</h3>
                                    <p className="text-xs text-gray-500">Focus Mode • Class {readingChapter.classNum}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 md:gap-3 shrink-0">
                                <a
                                    href={readingChapter.pdfUrl}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs md:text-sm font-semibold transition-all"
                                >
                                    <Download size={16} /> <span className="hidden md:inline">Download</span>
                                </a>
                                <button
                                    onClick={() => setReadingChapter(null)}
                                    className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg text-gray-400 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* PDF Viewer Iframe */}
                        <div className="flex-1 bg-gray-900 relative">
                            <iframe
                                src={readingChapter.pdfUrl.includes('drive.google.com')
                                    ? readingChapter.pdfUrl.replace('/view', '/preview')
                                    : readingChapter.pdfUrl}
                                className="w-full h-full border-0"
                                title={readingChapter.title}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="pt-28 pb-20 px-4 md:px-6 max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-semibold text-sm mb-6">
                        📚 Digital Library
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                        NCERT <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">Bookshelf</span>
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
                        Access official NCERT Textbooks, Exemplars, and Lab Manuals instantly. Read distraction-free or download for offline use.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-10">
                    <div className="flex items-center gap-2 p-1.5 bg-gray-900/50 border border-gray-800 rounded-2xl overflow-x-auto scrollbar-hide">
                        <TabButton
                            active={activeTab === 'textbook'}
                            onClick={() => setActiveTab('textbook')}
                            icon={Book}
                            label="Textbooks"
                            gradient="from-indigo-600 to-purple-600 shadow-indigo-500/20"
                        />
                        <TabButton
                            active={activeTab === 'exemplar'}
                            onClick={() => setActiveTab('exemplar')}
                            icon={FileText}
                            label="Exemplar"
                            gradient="from-teal-600 to-cyan-600 shadow-teal-500/20"
                        />
                        <TabButton
                            active={activeTab === 'lab-manual'}
                            onClick={() => setActiveTab('lab-manual')}
                            icon={Beaker}
                            label="Lab Manual"
                            gradient="from-orange-600 to-amber-600 shadow-orange-500/20"
                        />
                    </div>
                </div>

                {/* List Layout */}
                <div className="space-y-10">
                    {/* Class 11 Section */}
                    {chapters11.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`w-1.5 h-8 rounded-full bg-gradient-to-b ${getTabGradient()}`}></div>
                                <h2 className="text-2xl md:text-3xl font-bold text-white">Class 11</h2>
                                <span className="ml-2 px-3 py-1 rounded-full bg-gray-800 text-gray-400 text-sm font-medium">
                                    {chapters11.length} {chapters11.length === 1 ? 'Chapter' : 'Chapters'}
                                </span>
                            </div>
                            <div className="space-y-3">
                                {chapters11.map((chapter, index) => (
                                    <ChapterRow
                                        key={chapter.id}
                                        chapter={chapter}
                                        index={index}
                                        icon={TabIcon}
                                        gradient={getTabGradient()}
                                        onRead={() => setReadingChapter(chapter)}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Divider between classes */}
                    {chapters11.length > 0 && chapters12.length > 0 && (
                        <div className="flex items-center gap-4 py-4">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
                        </div>
                    )}

                    {/* Class 12 Section */}
                    {chapters12.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`w-1.5 h-8 rounded-full bg-gradient-to-b ${getTabGradient()}`}></div>
                                <h2 className="text-2xl md:text-3xl font-bold text-white">Class 12</h2>
                                <span className="ml-2 px-3 py-1 rounded-full bg-gray-800 text-gray-400 text-sm font-medium">
                                    {chapters12.length} {chapters12.length === 1 ? 'Chapter' : 'Chapters'}
                                </span>
                            </div>
                            <div className="space-y-3">
                                {chapters12.map((chapter, index) => (
                                    <ChapterRow
                                        key={chapter.id}
                                        chapter={chapter}
                                        index={index}
                                        icon={TabIcon}
                                        gradient={getTabGradient()}
                                        onRead={() => setReadingChapter(chapter)}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Empty State */}
                    {chapters11.length === 0 && chapters12.length === 0 && (
                        <div className="text-center py-20 bg-gray-900/30 rounded-3xl border border-gray-800 border-dashed">
                            <Book size={48} className="mx-auto mb-4 text-gray-600" />
                            <p className="text-gray-500 text-lg">No {activeTab === 'lab-manual' ? 'lab manuals' : activeTab + 's'} available yet.</p>
                            <p className="text-gray-600 text-sm mt-2">Try switching categories.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

// Chapter Row Component
function ChapterRow({
    chapter,
    index,
    icon: Icon,
    gradient,
    onRead
}: {
    chapter: NcertChapter;
    index: number;
    icon: React.ElementType;
    gradient: string;
    onRead: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            onClick={onRead}
            className="group flex items-center justify-between bg-gray-900/50 hover:bg-gray-800/80 border border-gray-800/60 hover:border-gray-700 rounded-xl px-5 py-4 cursor-pointer transition-all duration-200"
        >
            <div className="flex items-center gap-4 overflow-hidden">
                {/* Icon */}
                <div className={`shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-10 flex items-center justify-center text-white/80 group-hover:scale-105 transition-transform`}>
                    <Icon size={22} />
                </div>

                {/* Title */}
                <div className="min-w-0">
                    <h3 className="text-lg md:text-xl font-bold text-gray-100 group-hover:text-white truncate pr-4 transition-colors">
                        {chapter.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">Click to read • PDF</p>
                </div>
            </div>

            {/* Action Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    window.open(chapter.pdfUrl, '_blank');
                }}
                className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white text-sm font-semibold transition-all"
            >
                <ExternalLink size={16} />
                <span className="hidden md:inline">Open</span>
            </button>
        </motion.div>
    );
}

function TabButton({ active, onClick, icon: Icon, label, gradient }: { active: boolean; onClick: () => void; icon: React.ElementType; label: string; gradient: string }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all relative overflow-hidden whitespace-nowrap ${active
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
                }`}
        >
            {active && (
                <motion.div
                    layoutId="bookshelf-tab"
                    className={`absolute inset-0 bg-gradient-to-r ${gradient} shadow-lg z-0`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
            <Icon size={16} className={`relative z-10 ${active ? 'text-white' : 'text-gray-500'}`} />
            <span className="relative z-10">{label}</span>
        </button>
    );
}
