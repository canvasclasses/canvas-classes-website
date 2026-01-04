'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowLeft,
    Clock,
    PlayCircle,
    ChevronRight,
    FileText,
    ExternalLink,
    BookOpen,
    X,
} from 'lucide-react';

interface Lecture {
    lectureNumber: number;
    title: string;
    description: string;
    youtubeUrl: string;
    duration: string;
}

interface Chapter {
    name: string;
    slug: string;
    class: '11' | '12';
    difficulty: string;
    notesLink: string;
    keyTopics: string[];
    lectures: Lecture[];
    totalDuration: string;
    videoCount: number;
}

interface ChapterPageClientProps {
    chapter: Chapter;
}

// Extract YouTube video ID from URL
function getYoutubeId(url: string): string | null {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? match[1] : null;
}

// Convert Google Drive view link to embeddable PDF link
function getEmbeddablePdfUrl(driveUrl: string): string | null {
    const match = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return null;
}

// Difficulty badge colors
const difficultyColors: Record<string, { bg: string; text: string; border: string }> = {
    'Easy': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    'Moderate': { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
    'Tough': { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' },
    'Easy to Moderate': { bg: 'bg-teal-500/20', text: 'text-teal-400', border: 'border-teal-500/30' },
};

export default function ChapterPageClient({ chapter }: ChapterPageClientProps) {
    const [activeTab, setActiveTab] = useState<'lectures' | 'notes'>('lectures');
    const [activeLecture, setActiveLecture] = useState<Lecture | null>(null);
    const diffStyle = difficultyColors[chapter.difficulty] || difficultyColors['Moderate'];
    const pdfUrl = chapter.notesLink ? getEmbeddablePdfUrl(chapter.notesLink) : null;

    const activeVideoId = activeLecture ? getYoutubeId(activeLecture.youtubeUrl) : null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
            {/* Header */}
            <section className="relative pt-32 pb-12 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/20 via-transparent to-transparent" />
                <div className="absolute top-20 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

                <div className="relative container mx-auto px-6">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-8">
                        <Link href="/" className="hover:text-teal-400 transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link href="/detailed-lectures" className="hover:text-teal-400 transition-colors">Lectures</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-teal-400">Class {chapter.class}</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-white">{chapter.name}</span>
                    </div>

                    {/* Back button */}
                    <Link
                        href="/detailed-lectures"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Lectures
                    </Link>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-4xl font-bold text-white mb-4"
                    >
                        {chapter.name}
                    </motion.h1>

                    {/* Meta info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-wrap items-center gap-4 mb-6"
                    >
                        <span className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${diffStyle.bg} ${diffStyle.text} ${diffStyle.border}`}>
                            {chapter.difficulty}
                        </span>
                        <span className="flex items-center gap-2 text-gray-400">
                            <PlayCircle className="w-5 h-5" />
                            {chapter.videoCount} videos
                        </span>
                        <span className="flex items-center gap-2 text-gray-400">
                            <Clock className="w-5 h-5" />
                            {chapter.totalDuration}
                        </span>
                        <span className="px-3 py-1.5 bg-gray-800/50 text-gray-300 rounded-lg text-sm border border-gray-700/50">
                            Class {chapter.class}
                        </span>
                    </motion.div>

                    {/* Topic Pills */}
                    {chapter.keyTopics.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap gap-2"
                        >
                            {chapter.keyTopics.map((topic, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 bg-gray-800/50 text-gray-300 text-sm rounded-full border border-gray-700/50"
                                >
                                    {topic}
                                </span>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Tabs */}
            <section className="border-b border-gray-800">
                <div className="container mx-auto px-6">
                    <div className="flex gap-8">
                        <button
                            onClick={() => setActiveTab('lectures')}
                            className={`py-4 px-2 text-base font-semibold border-b-2 transition-colors ${activeTab === 'lectures'
                                ? 'text-teal-400 border-teal-400'
                                : 'text-gray-400 border-transparent hover:text-white'
                                }`}
                        >
                            <PlayCircle className="w-5 h-5 inline mr-2" />
                            Video Lectures ({chapter.videoCount})
                        </button>
                        {pdfUrl && (
                            <button
                                onClick={() => setActiveTab('notes')}
                                className={`py-4 px-2 text-base font-semibold border-b-2 transition-colors ${activeTab === 'notes'
                                    ? 'text-teal-400 border-teal-400'
                                    : 'text-gray-400 border-transparent hover:text-white'
                                    }`}
                            >
                                <FileText className="w-5 h-5 inline mr-2" />
                                Chapter Notes
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 pb-24">
                <div className="container mx-auto px-6">
                    {activeTab === 'lectures' ? (
                        <div className="space-y-6">
                            {/* Inline Video Player */}
                            <AnimatePresence>
                                {activeLecture && activeVideoId && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-gray-800/60 rounded-2xl border border-teal-500/50 overflow-hidden"
                                    >
                                        {/* Player Header */}
                                        <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
                                            <div className="flex items-center gap-3">
                                                <span className="px-2.5 py-1 bg-teal-500 text-white text-xs font-bold rounded">
                                                    #{activeLecture.lectureNumber}
                                                </span>
                                                <h3 className="text-white font-semibold line-clamp-1">
                                                    {activeLecture.title}
                                                </h3>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={activeLecture.youtubeUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    YouTube
                                                </a>
                                                <button
                                                    onClick={() => setActiveLecture(null)}
                                                    className="p-2 bg-gray-700/50 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                        {/* YouTube Embed */}
                                        <div className="aspect-video">
                                            <iframe
                                                src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0`}
                                                className="w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                title={activeLecture.title}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Lectures List */}
                            <div className="space-y-4">
                                {chapter.lectures.map((lecture, index) => {
                                    const videoId = getYoutubeId(lecture.youtubeUrl);
                                    const thumbnailUrl = videoId
                                        ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
                                        : null;
                                    const isActive = activeLecture?.lectureNumber === lecture.lectureNumber;

                                    return (
                                        <motion.button
                                            key={lecture.lectureNumber}
                                            onClick={() => setActiveLecture(isActive ? null : lecture)}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.05 * index }}
                                            className={`group w-full text-left flex gap-4 md:gap-6 bg-gray-800/40 backdrop-blur-sm rounded-2xl p-4 border transition-all duration-300 ${isActive
                                                ? 'border-teal-500 bg-gray-800/60 ring-2 ring-teal-500/20'
                                                : 'border-gray-700/50 hover:border-teal-500/50 hover:bg-gray-800/60'
                                                }`}
                                        >
                                            {/* Thumbnail */}
                                            <div className="relative w-32 md:w-48 flex-shrink-0">
                                                <div className="aspect-video bg-gray-700 rounded-xl overflow-hidden relative">
                                                    {thumbnailUrl ? (
                                                        <Image
                                                            src={thumbnailUrl}
                                                            alt={lecture.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <PlayCircle className="w-10 h-10 text-gray-500" />
                                                        </div>
                                                    )}
                                                    {/* Play overlay */}
                                                    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isActive ? 'bg-teal-400' : 'bg-teal-500'}`}>
                                                            <PlayCircle className="w-6 h-6 text-white" />
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Duration badge */}
                                                {lecture.duration && (
                                                    <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white text-xs rounded">
                                                        {lecture.duration}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded ${isActive ? 'bg-teal-500 text-white' : 'bg-teal-500/20 text-teal-400'}`}>
                                                            #{lecture.lectureNumber}
                                                        </span>
                                                        {isActive && (
                                                            <span className="px-2 py-0.5 bg-teal-500/20 text-teal-400 text-xs font-medium rounded">
                                                                Now Playing
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <h3 className={`text-lg font-semibold transition-colors mb-2 line-clamp-1 ${isActive ? 'text-teal-400' : 'text-white group-hover:text-teal-400'}`}>
                                                    {lecture.title}
                                                </h3>
                                                {lecture.description && (
                                                    <p className="text-gray-400 text-sm line-clamp-2">
                                                        {lecture.description}
                                                    </p>
                                                )}
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        /* PDF Notes Viewer */
                        <div className="bg-gray-800/40 rounded-2xl border border-gray-700/50 overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
                                <div className="flex items-center gap-3">
                                    <BookOpen className="w-5 h-5 text-teal-400" />
                                    <span className="font-semibold text-white">{chapter.name} - Notes</span>
                                </div>
                                <a
                                    href={chapter.notesLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-teal-500/20 text-teal-400 rounded-lg hover:bg-teal-500/30 transition-colors text-sm font-medium"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Open in Drive
                                </a>
                            </div>
                            {pdfUrl && (
                                <iframe
                                    src={pdfUrl}
                                    className="w-full h-[70vh]"
                                    allow="autoplay"
                                    title={`${chapter.name} Notes`}
                                />
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
