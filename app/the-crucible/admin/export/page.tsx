'use client';

import { useState, useEffect, useRef } from 'react';
import { getQuestions, getTaxonomy } from '../../actions';
import { Question, QuestionOption, TaxonomyNode } from '../../types';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import 'katex/dist/katex.min.css';
import { Filter, FileText, MonitorPlay, ChevronDown, Check, X, Download, Printer, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import pptxgen from 'pptxgenjs';

// --- Types ---
interface SelectionState {
    [questionId: string]: boolean;
}

// --- Component: Rendered Question (Handles Math & Layout) ---
const RenderedQuestion = ({ question, mode = 'preview' }: { question: Question, mode?: 'preview' | 'export' }) => {
    return (
        <div className={`w-full text-left relative overflow-hidden ${mode === 'export' ? 'text-black' : 'text-gray-100'}`}>
            {/* Watermark Overlay (Only visual for Export/Print) */}
            {mode === 'export' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] z-0">
                    <img src="/logo.png" alt="Watermark" className="w-[50%] object-contain" crossOrigin="anonymous" />
                </div>
            )}

            {/* Hidden Print Watermark (Shows via CSS) */}
            <div className="print-watermark-overlay hidden absolute inset-0 items-center justify-center pointer-events-none opacity-[0.05] z-0">
                <img src="/logo.png" alt="Watermark" className="w-[50%] object-contain" />
            </div>

            {/* Question Stem */}
            <div className={`relative z-10 prose ${mode === 'export' ? 'prose-xl prose-p:text-black prose-headings:text-black prose-strong:text-black' : 'prose-invert prose-sm'} max-w-none mb-6`}>
                <ReactMarkdown
                    remarkPlugins={[remarkMath, remarkGfm]}
                    rehypePlugins={[rehypeKatex, rehypeRaw]}
                    components={{
                        // Force images to be block and full width if needed
                        img: ({ node, ...props }) => (
                            <img
                                {...props}
                                style={{
                                    maxWidth: '100%',
                                    // Restrict huge images
                                    maxHeight: mode === 'export' ? '400px' : '600px',
                                    width: 'auto',
                                    height: 'auto',
                                    display: 'block',
                                    margin: '1em 0', // Left align usually looks better for questions, or keep centered if preferred. Let's do 0 for left align to match text
                                    borderRadius: '8px',
                                    border: mode === 'export' ? '1px solid #eee' : '1px solid #333'
                                }}
                            />
                        ),
                        p: ({ node, ...props }) => <div {...props} className="mb-4" />
                    }}
                >
                    {question.textMarkdown}
                </ReactMarkdown>
            </div>

            {/* Options Grid */}
            {question.options && question.options.length > 0 && (
                <div className={`relative z-10 grid ${mode === 'export' ? 'grid-cols-2 gap-6' : 'grid-cols-1 md:grid-cols-2 gap-3'}`}>
                    {question.options.map((opt, i) => (
                        <div key={opt.id} className={`flex items-start gap-4 p-4 rounded-xl border ${mode === 'export' ? 'border-gray-300 bg-gray-50' : 'border-white/10 bg-white/5'}`}>
                            <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg ${mode === 'export' ? 'bg-black text-white' : 'bg-white/10 text-gray-300'}`}>
                                {String.fromCharCode(65 + i)}
                            </span>
                            <div className={`pt-1 w-full ${mode === 'export' ? 'text-lg text-black font-medium' : 'text-sm text-gray-300'} prose ${mode !== 'export' ? 'prose-invert' : ''}`}>
                                <ReactMarkdown
                                    remarkPlugins={[remarkMath, remarkGfm]}
                                    rehypePlugins={[rehypeKatex, rehypeRaw]}
                                    components={{
                                        img: ({ node, ...props }) => (
                                            <img
                                                {...props}
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: '200px', // Smaller max height for options
                                                    width: 'auto',
                                                    height: 'auto',
                                                    display: 'block'
                                                }}
                                            />
                                        )
                                    }}
                                >
                                    {opt.text}
                                </ReactMarkdown>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default function ExportDashboard() {
    // --- State ---
    const [questions, setQuestions] = useState<Question[]>([]);
    const [chapters, setChapters] = useState<TaxonomyNode[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [selectedChapter, setSelectedChapter] = useState('all');
    const [selectedType, setSelectedType] = useState('all');

    // Selection
    const [selection, setSelection] = useState<SelectionState>({});
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);

    // Filtered Questions Logic
    const filteredQuestions = questions.filter(q => {
        // Filter by Chapter (Match by Name or ID to be safe)
        if (selectedChapter !== 'all') {
            // Find the chapter object to compare names if IDs fail
            const chapterObj = chapters.find(c => c.name === selectedChapter || c.id === selectedChapter);

            // Check if quesiton chapterId matches selections ID OR selection's Name (handles legacy data)
            const matchesId = q.chapterId === selectedChapter;
            const matchesName = q.chapterId === (chapterObj?.name);

            if (!matchesId && !matchesName) return false;
        }

        if (selectedType !== 'all' && q.questionType !== selectedType) return false;
        return true;
    });

    const selectedCount = Object.values(selection).filter(Boolean).length;

    // --- Export State (PPT) ---
    const [exportQueue, setExportQueue] = useState<string[]>([]);
    const [pptPres, setPptPres] = useState<pptxgen | null>(null);
    const exportRef = useRef<HTMLDivElement>(null);

    // Current question to render for Export
    const exportQuestionId = exportQueue[0];
    const exportQuestion = exportQuestionId ? questions.find(q => q.id === exportQuestionId) : null;

    // --- Data Loading ---
    useEffect(() => {
        Promise.all([
            getQuestions(),
            getTaxonomy()
        ]).then(([q, t]) => {
            setQuestions(q);
            setChapters(t.filter(n => n.type === 'chapter'));
            setLoading(false);
        });
    }, []);

    // --- PPT Export Processor (Queue Consumer) ---
    useEffect(() => {
        // If queue is empty but we have a presentation object, it means we just finished
        if (exportQueue.length === 0 && pptPres) {
            // Save and reset
            pptPres.writeFile({ fileName: `Crucible_Export_${new Date().toISOString().split('T')[0]}.pptx` });
            setPptPres(null);
            setIsExporting(false);
            setExportProgress(0);
            return;
        }

        // Process next item in queue
        if (exportQueue.length > 0 && exportRef.current && exportQuestion) {
            const processNext = async () => {
                // Wait for KaTeX/Images to render (critical delay)
                await new Promise(r => setTimeout(r, 1000));

                if (!exportRef.current) return;

                try {
                    const canvas = await html2canvas(exportRef.current, {
                        scale: 2, // High res for slides
                        useCORS: true,
                        backgroundColor: '#ffffff'
                    });

                    const imgData = canvas.toDataURL('image/png');

                    // Initialize or use existing presentation
                    const pres = pptPres || new pptxgen();
                    if (!pptPres) {
                        pres.layout = 'LAYOUT_16x9';
                        setPptPres(pres);
                    }

                    // Add Slide
                    const slide = pres.addSlide();
                    // 16:9 slide size is 10 x 5.625 inches
                    // We fit the image within these bounds
                    slide.addImage({ data: imgData, x: 0, y: 0, w: 10, h: 5.625 });

                } catch (err) {
                    console.error("Error capturing slide:", err);
                }

                // Move to next
                setExportQueue(prev => prev.slice(1));
                setExportProgress(prev => prev + 1);
            };

            processNext();
        }
    }, [exportQueue, pptPres, exportQuestion]); // Added exportQuestion to dependency to trigger only when data is ready


    // --- Handlers ---
    const toggleSelection = (id: string) => {
        setSelection(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const selectAllFiltered = () => {
        const newSelection = { ...selection };
        filteredQuestions.forEach(q => newSelection[q.id] = true);
        setSelection(newSelection);
    };

    const deselectAll = () => {
        setSelection({});
    };

    const startPPTExport = () => {
        const selectedIds = Object.keys(selection).filter(id => selection[id]);
        if (selectedIds.length === 0) return;

        setIsExporting(true);
        setExportProgress(0);
        setExportQueue(selectedIds);
        // The useEffect will take over
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30 print:bg-white print:text-black">

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    @page { margin: 0.5cm; size: auto; }
                    body { background: white !important; color: black !important; -webkit-print-color-adjust: exact; }
                    .print-hidden { display: none !important; }
                    .print-visible { display: block !important; }
                    .question-break { 
                        break-inside: avoid; 
                        page-break-inside: avoid; 
                        margin-bottom: 2rem; 
                        border-bottom: 1px solid #eee; 
                        padding-bottom: 2rem; 
                        position: relative;
                        page-break-after: auto;
                    }
                    /* Reset prose for print */
                    .prose-invert { 
                        --tw-prose-body: #000 !important; 
                        color: #000 !important; 
                    }
                    .prose-invert p, .prose-invert li, .prose-invert span, .prose-invert strong, .prose-invert div { 
                        color: #000 !important; 
                    }
                    .prose-invert h1, .prose-invert h2, .prose-invert h3, .prose-invert h4 { 
                        color: #000 !important; 
                    }
                    
                    /* Force images to be visible and correctly sized */
                    img {
                        max-width: 100% !important;
                        display: block !important;
                        /* INVERT IMAGES FOR PRINT to make white lines visible on white paper */
                        filter: invert(1) hue-rotate(180deg);
                        /* Optional: add contrast to make it sharper */
                        /* mix-blend-mode: multiply; */ 
                    }

                    /* Prevent the logo watermark from being inverted back if we don't want it to */
                    .print-watermark-overlay img {
                        filter: none !important;
                        opacity: 0.05 !important;
                    }

                    /* Watermark Visualization in Print */
                    .print-watermark-overlay {
                        display: flex !important;
                    }
                }
            `}</style>

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 z-50 flex items-center justify-between px-6 print-hidden">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                        <Printer size={18} className="text-white" />
                    </div>
                    <h1 className="text-lg font-medium tracking-tight">Export Dashboard</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-400">
                        {selectedCount} selected
                    </div>
                    <button
                        onClick={startPPTExport}
                        disabled={selectedCount === 0 || isExporting}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                            ${selectedCount > 0
                                ? 'bg-white text-black hover:bg-gray-200'
                                : 'bg-white/10 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {isExporting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                PPT {exportProgress}/{Object.keys(selection).filter(k => selection[k]).length}
                            </>
                        ) : (
                            <>
                                <MonitorPlay size={16} />
                                Export PPT
                            </>
                        )}
                    </button>
                    <button
                        onClick={() => window.print()}
                        disabled={selectedCount === 0}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 text-sm font-medium border border-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download size={16} />
                        Print / PDF
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-24 pb-12 px-6 flex gap-8 h-screen overflow-hidden print:h-auto print:overflow-visible print:pt-0 print:block">
                {/* Sidebar / Filters (Hidden on Print) */}
                <aside className="w-64 shrink-0 flex flex-col gap-6 sticky top-24 h-[calc(100vh-8rem)] print-hidden">
                    <div className="space-y-4">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Filters</h3>

                        <div className="space-y-2">
                            <label className="text-xs text-gray-400">Chapter</label>
                            <select
                                value={selectedChapter}
                                onChange={(e) => setSelectedChapter(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 outline-none focus:border-purple-500/50 transition-colors"
                            >
                                <option value="all">All Chapters</option>
                                {chapters.map(c => (
                                    // Use name as value if data uses names
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-gray-400">Type</label>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 outline-none focus:border-purple-500/50 transition-colors"
                            >
                                <option value="all">All Types</option>
                                <option value="SCQ">Single Correct</option>
                                <option value="MCQ">Multi Correct</option>
                                <option value="NVT">Numerical</option>
                                <option value="AR">Assertion Reason</option>
                                <option value="MST">Multi Statement</option>
                                <option value="MTC">Match Column</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                        <button
                            onClick={selectAllFiltered}
                            className="w-full text-left px-3 py-2 text-sm text-purple-400 hover:bg-purple-500/10 rounded-md transition-colors"
                        >
                            Select All Visible
                        </button>
                        <button
                            onClick={deselectAll}
                            className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:bg-white/5 rounded-md transition-colors"
                        >
                            Deselect All
                        </button>
                    </div>
                </aside>

                {/* Question Grid / Print List */}
                <div className="flex-1 overflow-y-auto pr-2 print:overflow-visible print:pr-0 pb-20">
                    {loading ? (
                        <div className="flex items-center justify-center h-64 text-gray-500">Loading questions...</div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 print:block">
                            {filteredQuestions.map(q => {
                                const isSelected = !!selection[q.id];
                                return (
                                    <div
                                        key={q.id}
                                        onClick={() => toggleSelection(q.id)}
                                        className={`group relative p-6 rounded-xl border transition-all cursor-pointer question-break
                                            ${isSelected
                                                ? 'bg-purple-900/10 border-purple-500/50 shadow-[0_0_20px_-5px_rgba(168,85,247,0.15)] print:bg-transparent print:border-gray-200 print:shadow-none print:block'
                                                : 'bg-white/[0.02] border-white/5 hover:border-white/10 print:hidden'
                                            }`}
                                    >
                                        <div className="absolute top-4 right-4 h-5 w-5 rounded border border-white/20 flex items-center justify-center transition-colors print:hidden">
                                            {isSelected && <div className="h-full w-full bg-purple-500 rounded flex items-center justify-center text-white"><Check size={12} strokeWidth={3} /></div>}
                                        </div>

                                        <div className="pr-12 print:pr-0">
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border print:text-black print:border-black ${q.questionType === 'SCQ' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' :
                                                    q.questionType === 'MCQ' ? 'text-blue-400 border-blue-500/20 bg-blue-500/10' :
                                                        'text-gray-400 border-gray-500/20 bg-gray-500/10'
                                                    }`}>
                                                    {q.questionType}
                                                </span>
                                                <span className="text-xs text-gray-500 font-mono print:text-gray-500">{q.id}</span>
                                            </div>

                                            {/* Rendered Question (Preview Mode) */}
                                            <div className="print:text-black">
                                                <RenderedQuestion question={q} mode="preview" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Empty State */}
                            {filteredQuestions.length === 0 && (
                                <div className="text-center py-20 text-gray-500">
                                    No questions found for the selected filters.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Hidden Export Stage (Off-screen but rendered) for PPT Generation */}
            {/* We place it z-[-10] to ensure it renders but isn't seen */}
            <div className="fixed top-0 left-0 bg-white z-[-10] overflow-hidden"
                style={{ width: '1280px', height: '720px', opacity: 0, pointerEvents: 'none' }}>
                <div ref={exportRef} className="w-[1280px] h-[720px] bg-white text-black p-16 flex flex-col relative">
                    {exportQuestion && (
                        <>
                            {/* Slide Header */}
                            <div className="flex justify-between items-center pb-6 border-b-2 border-gray-100 mb-8">
                                <span className="text-2xl font-bold text-gray-500 tracking-tight uppercase">
                                    {exportQuestion.chapterId}
                                </span>
                                <span className="px-4 py-2 bg-gray-100 rounded-lg text-lg font-semibold text-gray-600">
                                    {exportQuestion.questionType}
                                </span>
                            </div>

                            {/* Slide Content - Centered vertically if possible, or just top aligned */}
                            <div className="flex-1">
                                <RenderedQuestion question={exportQuestion} mode="export" />
                            </div>

                            {/* Slide Footer */}
                            <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between text-sm text-gray-400 font-mono">
                                <span>Canvas Classes</span>
                                <span>ID: {exportQuestion.id}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
