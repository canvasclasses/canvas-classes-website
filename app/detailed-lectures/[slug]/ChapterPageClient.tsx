'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowLeft,
    Clock,
    PlayCircle,
    ChevronRight,
    ChevronDown,
    FileText,
    ExternalLink,
    BookOpen,
    X,
    CheckCircle,
    AlertCircle,
    HelpCircle,
    Play,
    ZoomIn,
    Search,
    Map,
    Info,
    Sparkles,
} from 'lucide-react';
import { getNcertChapterName } from '@/app/lib/ncertMapping';

interface Lecture {
    lectureNumber: number;
    title: string;
    description: string;
    youtubeUrl: string;
    duration: string;
}

interface NCERTQuestion {
    id: number;
    classNum: number;
    chapter: string;
    questionNumber: string;
    questionText: string;
    difficulty: string;
    solutionContent: string;
    solutionType: string;
    youtubeUrl: string;
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
    hasMindmap: boolean;
    classification?: string;
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

// Helper to extract YouTube ID and create embed URL (for solutions)
const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
};

// Format solution content
const formatSolution = (content: string) => {
    return content.replace(/<br>/g, '\n').replace(/\|/g, '').trim();
};

// Difficulty badge colors
const difficultyColors: Record<string, { bg: string; text: string; border: string }> = {
    'Easy': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    'Moderate': { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
    'Tough': { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' },
    'Easy to Moderate': { bg: 'bg-teal-500/20', text: 'text-teal-400', border: 'border-teal-500/30' },
};

// NCERT Difficulty colors (for solutions)
const ncertDifficultyColors: Record<string, { bg: string; text: string; border: string; icon: typeof CheckCircle }> = {
    'Easy': { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', icon: CheckCircle },
    'Moderate': { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30', icon: AlertCircle },
    'Hard': { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', icon: HelpCircle },
};

export default function ChapterPageClient({ chapter }: ChapterPageClientProps) {
    const [activeTab, setActiveTab] = useState<'lectures' | 'notes' | 'solutions' | 'mindmap'>('lectures');
    const [activeLecture, setActiveLecture] = useState<Lecture | null>(null);
    const diffStyle = difficultyColors[chapter.difficulty] || difficultyColors['Moderate'];
    const pdfUrl = chapter.notesLink ? getEmbeddablePdfUrl(chapter.notesLink) : null;

    const activeVideoId = activeLecture ? getYoutubeId(activeLecture.youtubeUrl) : null;

    // NCERT Solutions State
    const [questions, setQuestions] = useState<NCERTQuestion[]>([]);
    const [loadingSolutions, setLoadingSolutions] = useState(false);
    const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    const [playingVideo, setPlayingVideo] = useState<number | null>(null);
    const [selectedNode, setSelectedNode] = useState<{ name: string; detail: string } | null>(null);
    const dataFetchedRef = useState(false); // To prevent double fetch if strict mode

    // Fetch NCERT Data when tab is changed to solutions
    const [hasFetchedSolutions, setHasFetchedSolutions] = useState(false);

    useEffect(() => {
        if (activeTab === 'solutions' && !hasFetchedSolutions) {
            setLoadingSolutions(true);
            fetch('/api/ncert-solutions')
                .then(res => res.json())
                .then(data => {
                    const allQuestions: NCERTQuestion[] = data.questions;
                    // Normalize and filter
                    const targetChapterName = getNcertChapterName(chapter.slug);

                    const matchingQuestions = allQuestions.filter((q: NCERTQuestion) => {
                        // If we have a direct mapping, use exact string match on chapter name
                        if (targetChapterName) {
                            return parseInt(chapter.class) === q.classNum && q.chapter === targetChapterName;
                        }

                        // Fallback to slug matching if no mapping found (legacy behavior)
                        const slug = q.chapter.toLowerCase()
                            .trim()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/^-+|-+$/g, '');

                        return parseInt(chapter.class) === q.classNum && slug === chapter.slug;
                    });
                    setQuestions(matchingQuestions);
                    setHasFetchedSolutions(true);
                })
                .catch(err => console.error(err))
                .finally(() => setLoadingSolutions(false));
        }

        // Listen for mindmap node clicks
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'MINDMAP_NODE_CLICK') {
                const nodeName = event.data.nodeName;
                const detail = saltAnalysisDetails[nodeName] || "Additional technical details for this section are coming soon. Stay tuned!";
                setSelectedNode({ name: nodeName, detail });
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [activeTab, hasFetchedSolutions, chapter]);

    const saltAnalysisDetails: Record<string, string> = {
        "Flame Test": "A qualitative test to identify metal ions based on characteristic flame colors. \n\n• Li: Crimson Red \n• Na: Golden Yellow \n• K: Violet \n• Ca: Brick Red \n• Sr: Crimson \n• Ba: Apple Green \n• Cu: Bluish Green",
        "Borax Bead Test": "Used mainly for transition metals. A borax bead (sodium metaborate and boric anhydride) forms characteristic colored metaborates in oxidizing/reducing flames. \n\n• Cu: Blue (Oxidizing), Red (Reducing) \n• Fe: Yellow (Hot), Brown (Cold) \n• Cr: Green",
        "Charcoal Cavity Test": "Heated salt in a charcoal cavity with Na2CO3. \n\n• Pb: White incrustation, malleable bead \n• Zn: Yellow (hot), White (cold) \n• Sn: White incrustation, malleable bead",
        "Cobalt Nitrate Test": "Performed on residues from charcoal cavity test. \n\n• Al: Blue mass (Thenard's Blue) \n• Zn: Green mass (Rinmann's Green) \n• Mg: Pink mass",
        "Zero Group": "Contains Ammonium (NH4+). \n\n• Test: Heat with NaOH → Pungent smell of Ammonia (NH3). \n• Confirmatory: White fumes with HCl-dipped rod; Nessler's Reagent → Reddish Brown ppt.",
        "Group I": "Contains Lead (Pb2+). \n\n• Group Reagent: Dilute HCl. \n• Observation: White ppt of PbCl2. \n• Confirmatory: Soluble in hot water; Potassium Chromate → Yellow ppt.",
        "Group II": "Contains Pb2+, Cu2+ (Group IIA) and As3+ (Group IIB). \n\n• Group Reagent: H2S gas in presence of Dilute HCl. \n• Observation: Black (Pb, Cu) or Yellow (As) sulphides.",
        "Group III": "Contains Iron (Fe3+) and Aluminium (Al3+). \n\n• Group Reagent: NH4OH in presence of NH4Cl. \n• Observation: Brown ppt (Fe) or White gelatinous ppt (Al).",
        "Group IV": "Contains Zn2+, Mn2+, Ni2+, Co2+. \n\n• Group Reagent: H2S in presence of NH4OH. \n• Observation: White (Zn), Flesh colored (Mn), Black (Ni, Co).",
        "Group V": "Contains Ba2+, Sr2+, Ca2+. \n\n• Group Reagent: (NH4)2CO3 in presence of NH4Cl and NH4OH. \n• Observation: White ppts of carbonates.",
        "Group VI": "Contains Magnesium (Mg2+). \n\n• Test: Add Disodium hydrogen phosphate (Na2HPO4). \n• Observation: White crystalline precipitate.",
        "Dilute H2SO4 Group": "Tests for anions like CO3(2-), S(2-), SO3(2-), NO2(-). \n\n• Carbonate: Colorless gas turns lime water milky. \n• Sulphide: Smell of rotten eggs (H2S), turns Lead Acetate paper black.",
        "Acetate (CH3COO -)": "Tests for Acetate ion. \n\n• Smell of Vinegar on heating with dilute H2SO4. \n• Ferric Chloride Test: Deep red color (formed Ferric Acetate).",
        "Sulphate (SO4 2-)": "Part of Special Group for anions. \n\n• Barium Chloride Test: White ppt of BaSO4 insoluble in all acids. \n• Lead Acetate Test: White ppt of PbSO4.",
        "Qualitative vs Quantitative": "Qualitative analysis focuses on 'What' is present (identifying elements/ions). Quantitative analysis focuses on 'How much' is present (measuring amounts/concentrations).",
        "Solubility Product": "The equilibrium constant for the dissolution of a sparingly soluble ionic compound. Precipitaiton occurs when Ionic Product (Qsp) > Solubility Product (Ksp).",
        "Common Ion Effect": "The suppression of the degree of dissociation of a weak electrolyte by the addition of a strong electrolyte containing a common ion. Essential in Buffer and salt precipitation.",
    };

    const getNcertDifficultyStyle = (difficulty: string) => {
        return ncertDifficultyColors[difficulty] || ncertDifficultyColors['Easy'];
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
            {/* Header */}
            <section className="relative pt-24 pb-6 md:pt-32 md:pb-12 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/20 via-transparent to-transparent" />
                <div className="absolute top-20 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

                <div className="relative container mx-auto px-6">
                    {/* Breadcrumb */}
                    <div className="hidden md:flex items-center gap-2 text-gray-400 text-sm mb-8">
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
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors mb-4 md:mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Lectures
                    </Link>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-4xl font-bold text-white mb-2 md:mb-4"
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


                </div>
            </section>

            {/* Tabs */}
            <section className="border-b border-gray-800">
                <div className="container mx-auto px-6">
                    <div className="flex gap-2 md:gap-8 overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setActiveTab('lectures')}
                            className={`py-3 px-2 text-xs md:text-base font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'lectures'
                                ? 'text-teal-400 border-teal-400'
                                : 'text-gray-400 border-transparent hover:text-white'
                                }`}
                        >
                            <PlayCircle className="w-4 h-4 md:w-5 md:h-5 inline mr-1.5 md:mr-2" />
                            Lectures ({chapter.videoCount})
                        </button>
                        {pdfUrl && (
                            <button
                                onClick={() => setActiveTab('notes')}
                                className={`py-3 px-2 text-xs md:text-base font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'notes'
                                    ? 'text-teal-400 border-teal-400'
                                    : 'text-gray-400 border-transparent hover:text-white'
                                    }`}
                            >
                                <FileText className="w-4 h-4 md:w-5 md:h-5 inline mr-1.5 md:mr-2" />
                                Notes
                            </button>
                        )}
                        <button
                            onClick={() => setActiveTab('solutions')}
                            className={`py-3 px-2 text-xs md:text-base font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'solutions'
                                ? 'text-teal-400 border-teal-400'
                                : 'text-gray-400 border-transparent hover:text-white'
                                }`}
                        >
                            <BookOpen className="w-4 h-4 md:w-5 md:h-5 inline mr-1.5 md:mr-2" />
                            NCERT Solutions
                        </button>
                        {chapter.hasMindmap && (
                            <button
                                onClick={() => setActiveTab('mindmap')}
                                className={`py-3 px-2 text-xs md:text-base font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'mindmap'
                                    ? 'text-teal-400 border-teal-400'
                                    : 'text-gray-400 border-transparent hover:text-white'
                                    }`}
                            >
                                <Map className="w-4 h-4 md:w-5 md:h-5 inline mr-1.5 md:mr-2" />
                                Mindmap
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-4 md:py-12 pb-24">
                <div className="container mx-auto px-6">
                    {activeTab === 'lectures' ? (
                        <div className="space-y-6 max-w-5xl mx-auto">
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

                    ) : activeTab === 'notes' ? (
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
                    ) : activeTab === 'mindmap' ? (
                        /* Mindmap Viewer */
                        <div className="max-w-6xl mx-auto space-y-6">
                            <div className="bg-gray-800/40 rounded-2xl border border-gray-700/50 overflow-hidden">
                                <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
                                    <div className="flex items-center gap-3">
                                        <Map className="w-5 h-5 text-teal-400" />
                                        <span className="font-semibold text-white">{chapter.name} - Interactive Mindmap</span>
                                    </div>
                                    <span className="text-xs text-gray-400 bg-gray-700/30 px-2 py-1 rounded">Interactive View</span>
                                </div>
                                <div className="relative w-full h-[600px] md:h-[850px] bg-[#f3f4f6]">
                                    <iframe
                                        src={`/mindmaps/${chapter.slug}.html?v=2`}
                                        className="absolute inset-0 w-full h-full border-0"
                                        title={`${chapter.name} Mindmap`}
                                    />
                                </div>
                                <div className="p-4 bg-gray-800/20 text-gray-400 text-xs text-center border-t border-gray-700/50">
                                    Tip: You can zoom and drag the mindmap. Click on any node to see more details below!
                                </div>
                            </div>

                            {/* Node Details View */}
                            <AnimatePresence>
                                {selectedNode && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-gray-800/60 rounded-2xl border border-teal-500/30 p-6 shadow-2xl backdrop-blur-md relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-4">
                                            <button
                                                onClick={() => setSelectedNode(null)}
                                                className="p-2 bg-gray-700/50 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center shrink-0 border border-teal-500/30">
                                                <Sparkles className="w-6 h-6 text-teal-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                                    {selectedNode.name}
                                                </h4>
                                                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap font-medium">
                                                    {selectedNode.detail}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                {!selectedNode && chapter.slug === 'salt-analysis' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="py-12 text-center border-2 border-dashed border-gray-800 rounded-2xl"
                                    >
                                        <Info className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                                        <p className="text-gray-500 font-medium">Click on any section of the mindmap above to see high-yield details here.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        /* NCERT Solutions Tab */
                        <div className="space-y-6 max-w-4xl mx-auto">
                            {loadingSolutions ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="bg-gray-800/40 rounded-2xl p-6 animate-pulse">
                                            <div className="h-5 bg-gray-700 rounded w-1/4 mb-3" />
                                            <div className="h-4 bg-gray-700 rounded w-3/4" />
                                        </div>
                                    ))}
                                </div>
                            ) : questions.length === 0 ? (
                                <div className="text-center py-16 bg-gray-800/20 rounded-2xl border border-gray-800">
                                    <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-400 text-lg">No NCERT solutions found for this chapter yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {questions.map((question, idx) => {
                                        const isExpanded = expandedQuestion === question.id;
                                        const diffStyle = getNcertDifficultyStyle(question.difficulty);
                                        const DiffIcon = diffStyle.icon;
                                        const isVideoPlaying = playingVideo === question.id;

                                        return (
                                            <motion.div
                                                key={question.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.03 * Math.min(idx, 10) }}
                                                className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
                                            >
                                                {/* Question Header */}
                                                <button
                                                    onClick={() => setExpandedQuestion(isExpanded ? null : question.id)}
                                                    className="w-full flex items-baseline gap-2 p-3 md:p-6 text-left hover:bg-gray-800/60 transition-colors"
                                                >
                                                    <span className="shrink-0 text-teal-200 font-bold text-base md:text-lg">
                                                        {question.questionNumber}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-teal-200 leading-relaxed mb-2 font-medium text-base md:text-lg">
                                                            {question.questionText}
                                                        </p>
                                                        <div className="flex items-center gap-2 md:gap-3 justify-end">
                                                            {question.youtubeUrl && (
                                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] md:text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                                                                    <Play className="w-3 h-3" />
                                                                    Video
                                                                </span>
                                                            )}
                                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] md:text-xs font-medium border ${diffStyle.bg} ${diffStyle.text} ${diffStyle.border}`}>
                                                                <DiffIcon className="w-3 h-3" />
                                                                {question.difficulty}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className={`shrink-0 w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-teal-500/20 text-teal-400' : 'text-gray-400'}`}>
                                                        <ChevronDown className="w-5 h-5" />
                                                    </div>
                                                </button>

                                                {/* Solution */}
                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="border-t border-gray-700/50"
                                                        >
                                                            <div className="p-3 md:p-6 bg-gray-900/30">
                                                                <h4 className="text-teal-400 font-semibold mb-3 flex items-center gap-2 text-xs md:text-sm uppercase tracking-wide">
                                                                    <CheckCircle className="w-4 h-4" />
                                                                    Solution
                                                                </h4>
                                                                <div className="text-gray-300 leading-loose whitespace-pre-wrap text-base font-sans tracking-wide">
                                                                    {formatSolution(question.solutionContent).split('\n').map((line, i) => {
                                                                        const isImageUrl = line.trim().match(/^https?:\/\/.*\.(png|jpg|jpeg|gif|webp)(\?.*)?$/i);

                                                                        if (isImageUrl) {
                                                                            return (
                                                                                <div
                                                                                    key={i}
                                                                                    className="my-6 relative group cursor-pointer rounded-xl overflow-hidden border border-gray-700/50 hover:border-teal-500/30 transition-colors shadow-lg max-w-2xl mx-auto"
                                                                                    onClick={() => setLightboxImage(line.trim())}
                                                                                >
                                                                                    <img
                                                                                        src={line.trim()}
                                                                                        alt={`Solution diagram for Q${question.questionNumber}`}
                                                                                        className="w-full h-auto"
                                                                                        loading="lazy"
                                                                                    />
                                                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                                                                                        <div className="bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 flex items-center gap-2 shadow-xl">
                                                                                            <ZoomIn size={14} /> Tap to Expand
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        }
                                                                        return <div key={i} className="mb-1">{line}</div>;
                                                                    })}
                                                                </div>

                                                                {question.youtubeUrl && (
                                                                    <div className="mt-6">
                                                                        {!isVideoPlaying ? (
                                                                            <button
                                                                                onClick={() => setPlayingVideo(question.id)}
                                                                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500/10 text-red-400 rounded-xl text-sm font-bold border border-red-500/20 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all group w-full md:w-auto justify-center"
                                                                            >
                                                                                <Play className="w-4 h-4 group-hover:fill-current" />
                                                                                Watch Video Solution
                                                                            </button>
                                                                        ) : (
                                                                            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-700 bg-black shadow-2xl">
                                                                                <iframe
                                                                                    src={getYouTubeEmbedUrl(question.youtubeUrl) || ''}
                                                                                    title={`Video solution for Q${question.questionNumber}`}
                                                                                    className="absolute inset-0 w-full h-full"
                                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                                    allowFullScreen
                                                                                />
                                                                                <button
                                                                                    onClick={() => setPlayingVideo(null)}
                                                                                    className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full backdrop-blur-md hover:bg-red-500 transition-colors"
                                                                                    title="Close Video"
                                                                                >
                                                                                    <X size={16} />
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section >


            {/* Topics Covered Section (Moved from text) */}
            {
                chapter.keyTopics.length > 0 && (
                    <section className="py-8 border-t border-gray-800/50">
                        <div className="container mx-auto px-6">
                            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4">Topics Covered</h3>
                            <div className="flex flex-wrap gap-2">
                                {chapter.keyTopics.map((topic, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 bg-gray-900 text-gray-400 text-sm rounded-full border border-gray-800"
                                    >
                                        {topic}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>
                )
            }
            {/* Lightbox */}
            <AnimatePresence>
                {lightboxImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
                        onClick={() => setLightboxImage(null)}
                    >
                        <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20">
                            <X size={24} />
                        </button>
                        <motion.img
                            src={lightboxImage || ''}
                            alt="Full screen solution"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl cursor-default"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
