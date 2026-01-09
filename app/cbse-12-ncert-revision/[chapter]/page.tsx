'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { fetchRevisionData, RevisionChapter, getTopicsByChapter, RevisionTopic, getFlashcardsByChapter, FlashcardItem } from '../../lib/revisionData';
import { notFound, useParams } from 'next/navigation';
import { ArrowLeft, BookOpen, Image as ImageIcon, Layers, Zap, CheckCircle, ExternalLink, X, ChevronLeft, ChevronRight, RotateCcw, CheckCircle2, ZoomIn } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChapterPage() {
    const params = useParams();
    const slug = params.chapter as string;
    const [chapterData, setChapterData] = useState<RevisionChapter | null>(null);
    const [infographicsTopics, setInfographicsTopics] = useState<RevisionTopic[]>([]);

    // Flashcard State
    const [flashcards, setFlashcards] = useState<FlashcardItem[]>([]);
    const [flashcardTopics, setFlashcardTopics] = useState<string[]>([]);

    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'summary' | 'infographics' | 'flashcards'>('summary');

    // Lightbox State
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    // Flashcard Selection State
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [isPracticeMode, setIsPracticeMode] = useState(false);
    const [practiceQueue, setPracticeQueue] = useState<FlashcardItem[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        const loadChapterAndTopics = async () => {
            const chapters = await fetchRevisionData();
            const found = chapters.find((c) => c.slug === slug);

            if (found) {
                setChapterData(found);

                const topics = await getTopicsByChapter(found.chapterNum);
                setInfographicsTopics(topics.filter(t => t.infographicUrl));

                const cards = await getFlashcardsByChapter(found.chapterName);
                setFlashcards(cards);

                const uniqueTopics = Array.from(new Set(cards.map(c => c.topicName).filter(Boolean)));
                setFlashcardTopics(uniqueTopics);
            } else {
                setChapterData(null);
            }
            setLoading(false);
        };
        loadChapterAndTopics();
    }, [slug]);

    const handleTopicSelection = (topicName: string) => {
        if (selectedTopics.includes(topicName)) {
            setSelectedTopics(selectedTopics.filter(t => t !== topicName));
        } else {
            setSelectedTopics([...selectedTopics, topicName]);
        }
    };

    const startPractice = () => {
        const queue = flashcards.filter(card => selectedTopics.includes(card.topicName));
        if (queue.length > 0) {
            setPracticeQueue(queue);
            setCurrentCardIndex(0);
            setIsFlipped(false);
            setIsPracticeMode(true);
        }
    };

    const nextCard = () => {
        if (currentCardIndex < practiceQueue.length - 1) {
            setCurrentCardIndex(prev => prev + 1);
            setIsFlipped(false);
        }
    };

    const prevCard = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(prev => prev - 1);
            setIsFlipped(false);
        }
    };

    const exitPractice = () => {
        setIsPracticeMode(false);
        setPracticeQueue([]);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (!chapterData) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center text-white">
                <h2 className="text-2xl font-bold mb-4">Chapter not found</h2>
                <Link href="/cbse-12-ncert-revision" className="text-purple-400 hover:text-purple-300">Back to List</Link>
            </div>
        );
    }

    const currentCard = practiceQueue[currentCardIndex];

    // Markdown Renderers for Custom Summary Layout - Light Theme Design
    // Content Block Types: Numbered Sections, Headings, Bullet Points, Images, Paragraphs, LaTeX
    const markdownComponents = {
        // Ordered Lists → Numbered Section Headings with Teal Badges
        ol: ({ children, start, ...props }: any) => {
            // Get the starting number (defaults to 1)
            const startNum = start || 1;
            // Filter to only valid React elements (skip whitespace text nodes)
            const validChildren = React.Children.toArray(children).filter(
                (child) => React.isValidElement(child)
            );
            let itemIndex = 0;
            return (
                <div className="space-y-4 mb-6" {...props}>
                    {React.Children.map(children, (child) => {
                        if (React.isValidElement(child)) {
                            const currentNumber = startNum + itemIndex;
                            itemIndex++;
                            return React.cloneElement(child as React.ReactElement<any>, {
                                'data-number': currentNumber,
                                'data-is-numbered-section': true
                            });
                        }
                        return child;
                    })}
                </div>
            );
        },
        // List Items - Handle both ordered (numbered badges) and unordered (checkmarks)
        li: ({ children, node, ...props }: any) => {
            const isNumberedSection = props['data-is-numbered-section'];
            const number = props['data-number'];

            if (isNumberedSection && number) {
                // Numbered Section Heading with Teal Badge
                return (
                    <div className="flex items-start gap-3 mt-6 first:mt-0">
                        <div className="flex-shrink-0 w-7 h-7 rounded-md bg-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-teal-500/30 mt-0.5">
                            {number}
                        </div>
                        <div className="text-base md:text-lg font-bold text-gray-900 leading-snug flex-1">
                            {children}
                        </div>
                    </div>
                );
            }

            // Bullet Point with Teal Checkmark
            return (
                <li className="flex items-start gap-2.5 text-gray-700" {...props}>
                    <div className="flex-shrink-0 w-4 h-4 rounded-full bg-teal-500 flex items-center justify-center mt-1">
                        <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                    <span className="flex-1 leading-relaxed text-[15px]">{children}</span>
                </li>
            );
        },
        // Unordered Lists → Bullet Points with Checkmarks
        ul: ({ children }: any) => <ul className="space-y-2 mb-4 ml-0">{children}</ul>,
        // Paragraphs - Handle colon-based headings
        p: ({ node, children, ...props }: any) => {
            // Check for colon-based headings (e.g., "Key Concepts:")
            const textContent = typeof children === 'string' ? children :
                (Array.isArray(children) ? children.map((c: any) => typeof c === 'string' ? c : '').join('') : '');

            // If paragraph ends with colon and is short, treat as subheading
            if (textContent.trim().endsWith(':') && textContent.length < 80) {
                return (
                    <p className="mb-3 mt-6 text-gray-900 font-semibold text-base" {...props}>
                        {children}
                    </p>
                );
            }

            return <p className="mb-4 text-gray-700 leading-relaxed text-[15px]" {...props}>{children}</p>;
        },
        // Bold Text
        strong: ({ children }: any) => <strong className="text-gray-900 font-semibold">{children}</strong>,
        // Italic Text
        em: ({ children }: any) => <em className="text-gray-800 italic">{children}</em>,
        // Images with Captions - Constrained width on desktop
        img: ({ src, alt }: any) => (
            <div className="my-8 flex justify-center">
                <div
                    className="max-w-2xl w-full rounded-xl overflow-hidden border border-gray-200 shadow-lg bg-white cursor-pointer group relative"
                    onClick={() => setLightboxImage(src)}
                >
                    <img src={src} alt={alt || ''} className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.01]" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center pointer-events-none">
                        <div className="bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0">
                            <ZoomIn size={14} /> Tap to Expand
                        </div>
                    </div>
                    {alt && (
                        <p className="text-center text-sm text-gray-600 py-3 px-4 bg-gray-50 border-t border-gray-100 font-medium relative z-10">
                            {alt}
                        </p>
                    )}
                </div>
            </div>
        ),
        // Headers (if used directly in markdown)
        h1: ({ children }: any) => <h1 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{children}</h1>,
        h2: ({ children }: any) => <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">{children}</h2>,
        h3: ({ children }: any) => <h3 className="text-lg font-semibold text-gray-900 mt-5 mb-2">{children}</h3>,
        // Code blocks
        code: ({ children, inline }: any) => {
            if (inline) {
                return <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>;
            }
            return <code className="block bg-gray-100 text-gray-800 p-4 rounded-lg text-sm font-mono overflow-x-auto my-4">{children}</code>;
        },
        // Blockquotes
        blockquote: ({ children }: any) => (
            <blockquote className="border-l-4 border-teal-500 pl-4 py-2 my-4 bg-teal-50 rounded-r-lg italic text-gray-700">
                {children}
            </blockquote>
        ),
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-purple-500/30">

            <main className="pt-28 pb-20 px-4 md:px-6 max-w-[1400px] mx-auto">
                <Link href="/cbse-12-ncert-revision" className="inline-flex items-center text-gray-400 hover:text-purple-400 mb-6 transition-colors font-medium">
                    <ArrowLeft size={18} className="mr-2" />
                    Back to Revision
                </Link>

                <div className="mb-12">
                    <span className="text-purple-400 font-bold uppercase tracking-wider text-sm mb-2 block">Chapter {chapterData.chapterNum}</span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight">
                        {chapterData.chapterName}
                    </h1>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-gray-800 text-gray-400">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">{flashcardTopics.length + 5}</h3>
                                <p className="text-xs text-gray-400 font-medium">Total Topics</p>
                            </div>
                        </div>

                        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400">
                                <ImageIcon size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">{infographicsTopics.length}</h3>
                                <p className="text-xs text-gray-400 font-medium">Infographics</p>
                            </div>
                        </div>

                        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
                                <Layers size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">{flashcards.length}</h3>
                                <p className="text-xs text-gray-400 font-medium">Flashcards</p>
                            </div>
                        </div>

                        <button className="bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/30 transition-all rounded-2xl p-5 flex items-center justify-center gap-3 cursor-pointer group">
                            <div className="p-2 rounded-full bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                                <Zap size={20} fill="currentColor" />
                            </div>
                            <span className="font-bold text-emerald-300">Start Quiz</span>
                        </button>
                    </div>

                    <div className="flex border-b border-gray-800 mb-8 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('summary')}
                            className={`px-6 py-4 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${activeTab === 'summary'
                                ? 'text-teal-400 border-teal-400 bg-teal-500/5'
                                : 'text-gray-400 border-transparent hover:text-gray-200 hover:bg-gray-900/40'
                                }`}
                        >
                            <BookOpen size={18} /> Summary <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs ml-1">Available</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('infographics')}
                            className={`px-6 py-4 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${activeTab === 'infographics'
                                ? 'text-purple-400 border-purple-400 bg-purple-500/5'
                                : 'text-gray-400 border-transparent hover:text-gray-200 hover:bg-gray-900/40'
                                }`}
                        >
                            <ImageIcon size={18} /> Infographics <span className="px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 text-xs ml-1">{infographicsTopics.length}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('flashcards')}
                            className={`px-6 py-4 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${activeTab === 'flashcards'
                                ? 'text-indigo-400 border-indigo-400 bg-indigo-500/5'
                                : 'text-gray-400 border-transparent hover:text-gray-200 hover:bg-gray-900/40'
                                }`}
                        >
                            <Layers size={18} /> Flashcards <span className="px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 text-xs ml-1">{flashcards.length}</span>
                        </button>
                    </div>
                </div>

                <div className="min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'summary' && (
                            <motion.div
                                key="summary"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="rounded-3xl p-5 md:p-8 shadow-xl border border-gray-100" style={{ backgroundColor: '#eff9fc' }}
                            >
                                <div className="max-w-none">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkMath]}
                                        rehypePlugins={[rehypeKatex, rehypeRaw]}
                                        components={markdownComponents}
                                    >
                                        {chapterData.summary}
                                    </ReactMarkdown>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'infographics' && (
                            <motion.div
                                key="infographics"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {infographicsTopics.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {infographicsTopics.map((topic, idx) => (
                                            <div
                                                key={topic.id}
                                                onClick={() => setLightboxImage(topic.infographicUrl)}
                                                className="bg-white rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-200 group relative"
                                            >
                                                {/* Card Image */}
                                                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                                                    <img
                                                        src={topic.infographicUrl}
                                                        alt={topic.topicName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                                        <ImageIcon size={10} /> Infographic
                                                    </div>
                                                </div>

                                                {/* Card Content */}
                                                <div className="p-4">
                                                    <h3 className="font-bold text-gray-900 text-lg mb-4 line-clamp-2 leading-tight">
                                                        {topic.topicName}
                                                    </h3>
                                                    <div className="flex items-center justify-between">
                                                        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">
                                                            Easy
                                                        </span>
                                                        <span className="text-gray-400 text-xs font-medium">
                                                            Topic {topic.topicOrder}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 text-gray-500 bg-gray-900/20 rounded-3xl border border-gray-800/50">
                                        <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
                                        <p>No infographics found for this chapter.</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'flashcards' && !isPracticeMode && (
                            <motion.div
                                key="flashcards-select"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="bg-gray-900/40 border border-gray-800 rounded-3xl p-6 md:p-8"
                            >
                                <div className="max-w-3xl mx-auto">
                                    <div className="text-center mb-8">
                                        <h2 className="text-2xl font-bold text-white mb-2">Select Topics to Practice</h2>
                                        <p className="text-gray-400">Choose the topics you want to review and start your flashcard session.</p>
                                    </div>

                                    {flashcardTopics.length > 0 ? (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {flashcardTopics.map(topic => (
                                                    <div
                                                        key={topic}
                                                        onClick={() => handleTopicSelection(topic)}
                                                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${selectedTopics.includes(topic)
                                                            ? 'bg-indigo-500/10 border-indigo-500/50'
                                                            : 'bg-gray-900 border-gray-800 hover:border-gray-700'
                                                            }`}
                                                    >
                                                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${selectedTopics.includes(topic) ? 'bg-indigo-500 border-indigo-500' : 'border-gray-600'
                                                            }`}>
                                                            {selectedTopics.includes(topic) && <CheckCircle size={14} className="text-white" />}
                                                        </div>
                                                        <span className={`text-sm font-medium ${selectedTopics.includes(topic) ? 'text-indigo-200' : 'text-gray-300'}`}>
                                                            {topic}
                                                        </span>
                                                        <span className="ml-auto text-xs text-gray-500 px-2 py-0.5 bg-gray-800 rounded-full">
                                                            {flashcards.filter(f => f.topicName === topic).length} cards
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex justify-center pt-6">
                                                <button
                                                    onClick={startPractice}
                                                    disabled={selectedTopics.length === 0}
                                                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-indigo-900/20 flex items-center gap-2"
                                                >
                                                    <Layers size={20} />
                                                    Start Flashcards ({
                                                        flashcards.filter(card => selectedTopics.includes(card.topicName)).length
                                                    })
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 text-gray-500">
                                            <Layers size={48} className="mx-auto mb-4 opacity-20" />
                                            <p>No flashcards found for this chapter.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'flashcards' && isPracticeMode && currentCard && (
                            <motion.div
                                key="flashcards-practice"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex flex-col items-center justify-center min-h-[500px]"
                            >
                                <div className="w-full max-w-2xl mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <button onClick={exitPractice} className="text-gray-400 hover:text-white flex items-center gap-1 text-sm font-medium transition-colors">
                                            <X size={16} /> Quit
                                        </button>
                                        <span className="text-gray-400 text-sm font-medium">
                                            Card {currentCardIndex + 1} / {practiceQueue.length}
                                        </span>
                                    </div>

                                    {/* Flashcard Component */}
                                    <div
                                        className="aspect-[3/2] relative perspective-1000 cursor-pointer group"
                                        onClick={() => setIsFlipped(!isFlipped)}
                                    >
                                        <motion.div
                                            className="w-full h-full relative preserve-3d"
                                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                            style={{ transformStyle: 'preserve-3d' }}
                                        >
                                            {/* Front Side */}
                                            <div className="absolute inset-0 backface-hidden bg-gray-800 border-2 border-gray-700 rounded-3xl flex flex-col items-center justify-center p-8 shadow-2xl">
                                                <div className="text-center">
                                                    <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4 block">Question</span>
                                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                                                        {currentCard.question}
                                                    </h3>
                                                    <p className="text-gray-500 text-sm mt-4">Tap to reveal Answer</p>
                                                </div>
                                            </div>

                                            {/* Back Side */}
                                            <div
                                                className="absolute inset-0 backface-hidden bg-indigo-900 border-2 border-indigo-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center justify-center p-8"
                                                style={{ transform: 'rotateY(180deg)' }}
                                            >
                                                <div className="text-center">
                                                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4 block">Answer</span>
                                                    <p className="text-lg md:text-xl text-white font-medium">
                                                        {currentCard.answer}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                    <div className="text-center mt-4">
                                        <span className="text-sm text-gray-400 bg-gray-900/50 px-3 py-1 rounded-full">
                                            Topic: {currentCard.topicName}
                                        </span>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex items-center gap-6">
                                    <button
                                        onClick={prevCard}
                                        disabled={currentCardIndex === 0}
                                        className="p-4 rounded-full bg-gray-800 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>

                                    <button
                                        onClick={() => setIsFlipped(!isFlipped)}
                                        className="p-4 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/30"
                                    >
                                        <RotateCcw size={24} />
                                    </button>

                                    <button
                                        onClick={nextCard}
                                        disabled={currentCardIndex === practiceQueue.length - 1}
                                        className="p-4 rounded-full bg-gray-800 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </div>

                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Lightbox - Kept for Infographics */}
                <AnimatePresence>
                    {lightboxImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                            onClick={() => setLightboxImage(null)}
                        >
                            <button className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
                                <X size={32} />
                            </button>
                            <motion.img
                                src={lightboxImage}
                                alt="Full screen preview"
                                className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl"
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.9 }}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

            </main>
        </div>
    );
}
