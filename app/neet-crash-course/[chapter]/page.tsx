'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    PlayCircle,
    FileText,
    Video,
    ChevronRight,
    Clock,
    ExternalLink,
    X,
    BookOpen
} from 'lucide-react';
import { getNeetChapter, NeetChapter, NeetLecture } from '@/app/lib/neetCrashCourseData';

export default function NeetChapterPage() {
    const params = useParams();
    const slug = params.chapter as string;
    const [chapter, setChapter] = useState<NeetChapter | null>(null);
    const [loading, setLoading] = useState(true);

    // Tab State
    const [activeTab, setActiveTab] = useState<'lectures' | 'dpp' | 'solutions'>('lectures');

    // Video Player State
    const [activeLecture, setActiveLecture] = useState<NeetLecture | null>(null);

    useEffect(() => {
        const load = async () => {
            const data = await getNeetChapter(slug);
            if (data) {
                setChapter(data);
            }
            setLoading(false);
        };
        load();
    }, [slug]);

    if (!loading && !chapter) {
        notFound();
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex justify-center items-center">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!chapter) return null;

    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans">
            <main className="pt-28 pb-20 px-4 md:px-6 max-w-[1400px] mx-auto">
                {/* Breadcrumb / Back */}
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
                    <Link href="/neet-crash-course" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
                        <ArrowLeft size={16} /> Back to Course
                    </Link>
                    <span className="text-gray-600">/</span>
                    <span className="text-white truncate">{chapter.title}</span>
                </div>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-xs font-bold uppercase tracking-wider">
                            Class {chapter.classNum}
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                            Crash Course
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                        {chapter.title}
                    </h1>
                    <p className="text-gray-400 text-lg max-w-3xl">
                        {chapter.description}
                    </p>
                </div>

                {/* Navigation Tabs - Sticky */}
                <div className="sticky top-24 md:top-32 z-30 bg-gray-950/95 backdrop-blur-xl border-b border-gray-800 mb-8 overflow-x-auto scroller-none -mx-4 md:mx-0 px-4 md:px-0 transition-all">
                    <div className="flex items-center gap-2 min-w-max py-2">
                        <TabButton
                            active={activeTab === 'lectures'}
                            onClick={() => setActiveTab('lectures')}
                            icon={PlayCircle}
                            label="Lectures & Solutions"
                            count={chapter.lectures.length + chapter.dppSolutions.length}
                        />
                        <TabButton
                            active={activeTab === 'dpp'}
                            onClick={() => setActiveTab('dpp')}
                            icon={FileText}
                            label="DPP PDF"
                        />
                        <TabButton
                            active={activeTab === 'solutions'} // Using 'solutions' key for Notes now to minimize state refactor, or rename properly
                            onClick={() => setActiveTab('solutions')}
                            icon={BookOpen}
                            label="Chapter Notes"
                        />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="min-h-[500px]">
                    <AnimatePresence mode="wait">

                        {/* LECTURES & SOLUTIONS TAB */}
                        {activeTab === 'lectures' && (
                            <motion.div
                                key="lectures"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Lectures List */}
                                <VideoSection
                                    videos={chapter.lectures}
                                    activeVideo={activeLecture}
                                    onPlay={(video) => setActiveLecture(video)}
                                    onClose={() => setActiveLecture(null)}
                                    emptyMessage="No lectures uploaded for this chapter yet."
                                />

                                {/* Divider */}
                                <div className="pt-12 pb-6">
                                    <h3 className="text-2xl font-bold flex items-center gap-3">
                                        <div className="h-8 w-1.5 bg-indigo-500 rounded-full"></div>
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                                            DPP Solutions
                                        </span>
                                    </h3>
                                </div>

                                {/* DPP Solutions List */}
                                <VideoSection
                                    videos={chapter.dppSolutions}
                                    activeVideo={activeLecture}
                                    onPlay={(video) => setActiveLecture(video)}
                                    onClose={() => setActiveLecture(null)}
                                    emptyMessage="Video solutions coming soon."
                                />
                            </motion.div>
                        )}

                        {/* DPP PDF TAB */}
                        {activeTab === 'dpp' && (
                            <motion.div
                                key="dpp"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden min-h-[600px] flex flex-col"
                            >
                                {chapter.dppPdfUrl ? (
                                    <>
                                        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50">
                                            <div className="flex items-center gap-2">
                                                <FileText className="text-indigo-400" size={20} />
                                                <span className="font-semibold">Daily Practice Problems</span>
                                            </div>
                                            <a
                                                href={chapter.dppPdfUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                                            >
                                                Open in New Tab <ExternalLink size={14} />
                                            </a>
                                        </div>
                                        <iframe
                                            src={chapter.dppPdfUrl}
                                            className="w-full flex-1 bg-gray-800"
                                            title="DPP PDF Viewer"
                                        />
                                    </>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                                        <FileText size={48} className="mb-4 opacity-20" />
                                        <p>No DPP available for this chapter.</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* CHAPTER NOTES TAB (Formerly Solutions) */}
                        {activeTab === 'solutions' && (
                            <motion.div
                                key="solutions" // Actually Notes
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden min-h-[600px] flex flex-col"
                            >
                                {chapter.chapterNotesUrl ? (
                                    <>
                                        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="text-teal-400" size={20} />
                                                <span className="font-semibold">Chapter Notes</span>
                                            </div>
                                            <a
                                                href={chapter.chapterNotesUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                                            >
                                                Open in New Tab <ExternalLink size={14} />
                                            </a>
                                        </div>
                                        <iframe
                                            src={chapter.chapterNotesUrl}
                                            className="w-full flex-1 bg-gray-800"
                                            title="Chapter Notes Viewer"
                                        />
                                    </>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                                        <BookOpen size={48} className="mb-4 opacity-20" />
                                        <p>No Notes available for this chapter.</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

// Reusable Tab Button
function TabButton({ active, onClick, icon: Icon, label, count }: any) {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-4 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${active
                ? 'text-indigo-400 border-indigo-400 bg-indigo-500/5'
                : 'text-gray-400 border-transparent hover:text-gray-200 hover:bg-gray-800/50'
                }`}
        >
            <Icon size={18} />
            {label}
            {count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-xs ml-1 ${active ? 'bg-indigo-500/20 text-indigo-300' : 'bg-gray-800 text-gray-500'
                    }`}>
                    {count}
                </span>
            )}
        </button>
    );
}

// Reusable Video Section (List + Player)
function VideoSection({ videos, activeVideo, onPlay, onClose, emptyMessage }: any) {
    // If a video is active, show the player
    if (activeVideo && videos.some((v: any) => v.id === activeVideo.id)) {
        return (
            <div className="bg-black/40 rounded-3xl border border-gray-800 overflow-hidden mb-8">
                <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/50">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <PlayCircle className="text-indigo-500" size={20} />
                        Now Playing: <span className="text-indigo-300">{activeVideo.title}</span>
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="aspect-video bg-black">
                    <iframe
                        src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                            #{activeVideo.id}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white mb-2">{activeVideo.title}</h2>
                            {activeVideo.concepts && (
                                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                    {activeVideo.concepts}
                                </p>
                            )}
                            <button onClick={onClose} className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                                <ArrowLeft size={16} /> Back to List
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Otherwise show the list
    if (!videos || videos.length === 0) {
        return (
            <div className="text-center py-20 text-gray-500 bg-gray-900/20 rounded-3xl border border-gray-800/50">
                <PlayCircle size={48} className="mx-auto mb-4 opacity-20" />
                <p>{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {videos.map((video: any) => (
                <div
                    key={video.id}
                    onClick={() => onPlay(video)}
                    className="group bg-gray-900/40 border border-gray-800 hover:border-indigo-500/50 hover:bg-gray-900/60 rounded-xl p-3 cursor-pointer transition-all duration-300 flex gap-4 items-start relative overflow-hidden"
                >
                    {/* Components: Thumbnail Left, Content Right */}

                    {/* Thumbnail: Fixed Size Compact */}
                    <div className="relative w-36 md:w-64 aspect-video bg-gray-900 rounded-lg overflow-hidden flex-shrink-0 shadow-lg group-hover:shadow-indigo-500/20 transition-all">
                        <img
                            src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                            alt={video.title}
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        />
                        {/* Badge on Thumbnail - Hidden on tiny screens if needed, but useful */}
                        <div className="absolute top-0 left-0 bg-teal-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-br-md z-10 shadow-sm">
                            #{video.id}
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black/80 backdrop-blur-sm text-white text-[9px] md:text-[10px] font-bold px-1 py-0.5 rounded">
                            {video.duration || 'N/A'}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 py-0.5">
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm md:text-lg font-bold text-gray-100 group-hover:text-white transition-colors line-clamp-2 leading-tight mb-1.5 md:mb-2">
                                {video.title}
                            </h3>
                            {/* Arrow Desktop */}
                            <ChevronRight className="hidden md:block text-gray-600 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0" size={20} />
                        </div>

                        {/* Concepts - Mobile Optimized */}
                        <p className="text-xs md:text-sm text-gray-500 group-hover:text-gray-400 line-clamp-2 leading-snug">
                            {video.concepts || video.description || 'Topic coverage and problem solving.'}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
