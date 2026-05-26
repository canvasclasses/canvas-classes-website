import { Dispatch, SetStateAction } from 'react';
import { Eye, LayoutList, LayoutGrid, Monitor, Smartphone, MonitorPlay, Volume2, ChevronDown, ChevronUp } from 'lucide-react';
import MathRenderer from '@canvas/ui/MathRenderer';
import AudioPlayer from './AudioPlayer';
import { type AdminQuestion as Question, QUESTION_TYPES } from './types';

export type PreviewMode = 'desktop' | 'mobile';
export type OptionsLayout = 'auto' | 'grid' | 'list';

interface QuestionPreviewPaneProps {
  selectedQuestion: Question;
  previewMode: PreviewMode;
  setPreviewMode: (mode: PreviewMode) => void;
  optionsLayout: OptionsLayout;
  setOptionsLayout: (layout: OptionsLayout) => void;
  videoExpanded: Record<string, boolean>;
  setVideoExpanded: Dispatch<SetStateAction<Record<string, boolean>>>;
  audioExpanded: Record<string, boolean>;
  setAudioExpanded: Dispatch<SetStateAction<Record<string, boolean>>>;
  getSvgScale: (field: string) => number;
}

/**
 * Live preview of the selected question — display-only mirror of the editor.
 * Owns no question state; reads `selectedQuestion` and the parent's UI
 * preference state (preview mode, options layout, expanded media panels).
 */
export default function QuestionPreviewPane({
  selectedQuestion,
  previewMode,
  setPreviewMode,
  optionsLayout,
  setOptionsLayout,
  videoExpanded,
  setVideoExpanded,
  audioExpanded,
  setAudioExpanded,
  getSvgScale,
}: QuestionPreviewPaneProps) {
  return (
    <div className="w-1/2 flex flex-col overflow-hidden bg-gray-950/50">
                    <div className="p-3 border-b border-gray-800/50 bg-gray-900/50 flex items-center justify-between gap-3">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <Eye size={14} /> Live Preview
                        </h3>
                        <div className="flex items-center gap-2">
                            {/* Options layout toggle */}
                            {selectedQuestion && selectedQuestion.type !== 'NVT' && selectedQuestion.type !== 'SUBJ' && (
                                <div className="flex items-center gap-1 bg-gray-800/60 rounded-lg p-0.5">
                                    <button
                                        onClick={() => setOptionsLayout('list')}
                                        title="List layout"
                                        className={`p-1.5 rounded-md transition ${optionsLayout === 'list' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                    ><LayoutList size={13} /></button>
                                    <button
                                        onClick={() => setOptionsLayout('auto')}
                                        title="Auto layout (smart)"
                                        className={`px-2 py-1 rounded-md text-[10px] font-medium transition ${optionsLayout === 'auto' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                    >AUTO</button>
                                    <button
                                        onClick={() => setOptionsLayout('grid')}
                                        title="2×2 grid layout"
                                        className={`p-1.5 rounded-md transition ${optionsLayout === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                    ><LayoutGrid size={13} /></button>
                                </div>
                            )}
                            {/* Mobile / Desktop toggle */}
                            <div className="flex items-center gap-1 bg-gray-800/60 rounded-lg p-0.5">
                                <button
                                    onClick={() => setPreviewMode('desktop')}
                                    title="Desktop preview"
                                    className={`p-1.5 rounded-md transition ${previewMode === 'desktop' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                ><Monitor size={13} /></button>
                                <button
                                    onClick={() => setPreviewMode('mobile')}
                                    title="Mobile preview"
                                    className={`p-1.5 rounded-md transition ${previewMode === 'mobile' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                ><Smartphone size={13} /></button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto p-4 flex justify-center">
                        {selectedQuestion ? (
                            <div className={`space-y-4 transition-all duration-300 ${previewMode === 'mobile'
                                ? 'w-[420px] border border-gray-700/60 rounded-2xl overflow-y-auto shadow-2xl shadow-black/50 bg-gray-900 max-h-full'
                                : 'w-full max-w-[860px]'
                                }`}>
                                {previewMode === 'mobile' && (
                                    <div className="flex items-center justify-center gap-1 py-2 bg-gray-950/80 border-b border-gray-800">
                                        <div className="w-16 h-1 bg-gray-600 rounded-full" />
                                    </div>
                                )}
                                {/* Question Preview */}
                                <div className={`bg-gray-900/50 rounded-xl border border-gray-800/50 ${previewMode === 'mobile' ? 'p-4 rounded-none border-x-0' : 'p-6'}`}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-xs font-mono text-purple-400">{selectedQuestion.display_id}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded ${QUESTION_TYPES.find(t => t.id === selectedQuestion.type)?.color
                                            }`}>
                                            {selectedQuestion.type}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded ${selectedQuestion.metadata.difficultyLevel >= 4 ? 'bg-red-500/20 text-red-400' :
                                            selectedQuestion.metadata.difficultyLevel === 3 ? 'bg-orange-500/20 text-orange-400' :
                                                'bg-green-500/20 text-green-400'
                                            }`}>
                                            Level {selectedQuestion.metadata.difficultyLevel}
                                        </span>
                                    </div>
                                    <MathRenderer
                                        markdown={selectedQuestion.question_text.markdown}
                                        className="text-gray-300"
                                        fontSize={20}
                                        imageScale={getSvgScale('question')}
                                    />
                                    {selectedQuestion.type !== 'NVT' && selectedQuestion.type !== 'SUBJ' && (() => {
                                        const hasImages = selectedQuestion.options.some(opt =>
                                            opt.text.includes('![') || opt.text.includes('<img') || opt.text.includes('.svg') || opt.text.includes('.png')
                                        );
                                        const maxTextLength = Math.max(...selectedQuestion.options.map(opt => opt.text.length));
                                        const avgTextLength = selectedQuestion.options.reduce((sum, opt) => sum + opt.text.length, 0) / selectedQuestion.options.length;
                                        const autoGrid = hasImages || (avgTextLength < 20 && maxTextLength < 25);
                                        // On mobile preview, grid is only 2 cols for truly short/image options
                                        const useGrid = optionsLayout === 'grid'
                                            ? true
                                            : optionsLayout === 'list'
                                                ? false
                                                : (previewMode === 'mobile' ? (hasImages || (avgTextLength < 15 && maxTextLength < 18)) : autoGrid);

                                        return (
                                            <div className={`mt-4 ${useGrid
                                                ? 'grid grid-cols-2 gap-3'
                                                : 'space-y-2'
                                                }`}>
                                                {selectedQuestion.options.map(opt => (
                                                    <div key={opt.id} className="flex items-center gap-3">
                                                        <div className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center text-sm font-semibold ${opt.is_correct
                                                            ? 'bg-green-600/30 text-green-300 border border-green-500/60'
                                                            : 'bg-gray-700/40 text-gray-300 border border-gray-600/60'
                                                            }`}>
                                                            {opt.id.toUpperCase()}
                                                        </div>
                                                        <div className={`flex-1 p-3 rounded-lg border ${opt.is_correct
                                                            ? 'bg-green-900/20 border-green-600/50'
                                                            : 'bg-gray-800/30 border-gray-700/50'
                                                            }`}>
                                                            <MathRenderer
                                                                markdown={opt.text}
                                                                className="text-gray-300 option-text"
                                                                fontSize={20}
                                                                imageScale={getSvgScale(`option_${opt.id}`)}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })()}
                                </div>

                                {/* Solution Preview */}
                                <div className={`bg-gray-900/50 rounded-xl border border-gray-800/50 ${previewMode === 'mobile' ? 'p-4 rounded-none border-x-0' : 'p-6'}`}>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Solution</h4>

                                    {/* Media Controls Row - Video & Audio buttons at top */}
                                    {(selectedQuestion.solution?.video_url || (selectedQuestion.solution?.asset_ids?.audio && selectedQuestion.solution.asset_ids.audio.length > 0)) && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {/* Watch Video Solution Button with State Indicator */}
                                            {selectedQuestion.solution?.video_url && (
                                                <button
                                                    onClick={() => {
                                                        setVideoExpanded(prev => ({
                                                            ...prev,
                                                            [selectedQuestion._id]: !prev[selectedQuestion._id]
                                                        }));
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-medium text-sm transition-all duration-200 shadow-lg shadow-blue-900/40 hover:shadow-blue-800/50 active:scale-95"
                                                >
                                                    <MonitorPlay size={16} />
                                                    <span className="hidden sm:inline">
                                                        {videoExpanded[selectedQuestion._id] ? 'Hide' : 'Watch'} Video Solution
                                                    </span>
                                                    <span className="sm:hidden">Video</span>
                                                    {videoExpanded[selectedQuestion._id]
                                                        ? <ChevronUp size={14} className="transition-transform duration-200" />
                                                        : <ChevronDown size={14} className="transition-transform duration-200" />
                                                    }
                                                </button>
                                            )}

                                            {/* Audio Note Waveform Button with State Indicator */}
                                            {selectedQuestion.solution?.asset_ids?.audio && selectedQuestion.solution.asset_ids.audio.length > 0 && (
                                                selectedQuestion.solution.asset_ids.audio.map((url, idx) => {
                                                    const audioKey = `${selectedQuestion._id}-${idx}`;
                                                    return url ? (
                                                        <button
                                                            key={idx}
                                                            onClick={() => {
                                                                setAudioExpanded(prev => ({
                                                                    ...prev,
                                                                    [audioKey]: !prev[audioKey]
                                                                }));
                                                            }}
                                                            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-medium text-sm transition-all duration-200 shadow-lg shadow-purple-900/40 hover:shadow-purple-800/50 active:scale-95"
                                                        >
                                                            <Volume2 size={16} />
                                                            <span className="hidden sm:inline">
                                                                {audioExpanded[audioKey] ? 'Hide' : 'Play'} Audio Note{selectedQuestion.solution.asset_ids!.audio!.length > 1 ? ` ${idx + 1}` : ''}
                                                            </span>
                                                            <span className="sm:hidden">Audio{selectedQuestion.solution.asset_ids!.audio!.length > 1 ? ` ${idx + 1}` : ''}</span>
                                                            {audioExpanded[audioKey]
                                                                ? <ChevronUp size={14} className="transition-transform duration-200" />
                                                                : <ChevronDown size={14} className="transition-transform duration-200" />
                                                            }
                                                        </button>
                                                    ) : null;
                                                })
                                            )}
                                        </div>
                                    )}

                                    {/* Collapsible Video Player - Square Aspect Ratio (1:1) with Smooth Animation */}
                                    {selectedQuestion.solution?.video_url && (
                                        <div
                                            className={`mb-4 transition-all duration-300 ease-in-out overflow-hidden ${
                                                videoExpanded[selectedQuestion._id]
                                                    ? 'max-h-[600px] opacity-100'
                                                    : 'max-h-0 opacity-0'
                                            }`}
                                        >
                                            <div className={`bg-black rounded-lg overflow-hidden ${previewMode === 'mobile' ? 'w-full' : 'max-w-md mx-auto'}`} style={{ aspectRatio: '1/1' }}>
                                                <video
                                                    controls
                                                    className="w-full h-full object-contain"
                                                    src={selectedQuestion.solution.video_url}
                                                    onKeyDown={(e) => {
                                                        // Keyboard shortcuts
                                                        if (e.key === ' ') {
                                                            e.preventDefault();
                                                            const video = e.currentTarget;
                                                            video.paused ? video.play() : video.pause();
                                                        } else if (e.key === 'ArrowRight') {
                                                            e.preventDefault();
                                                            e.currentTarget.currentTime += 5;
                                                        } else if (e.key === 'ArrowLeft') {
                                                            e.preventDefault();
                                                            e.currentTarget.currentTime -= 5;
                                                        }
                                                    }}
                                                >
                                                    Your browser does not support the video tag.
                                                </video>
                                            </div>
                                        </div>
                                    )}

                                    {/* Collapsible Audio Players with Waveform and Smooth Animation */}
                                    {selectedQuestion.solution?.asset_ids?.audio && selectedQuestion.solution.asset_ids.audio.length > 0 && (
                                        <div className="space-y-2 mb-4">
                                            {selectedQuestion.solution.asset_ids.audio.map((url, idx) => {
                                                const audioKey = `${selectedQuestion._id}-${idx}`;
                                                return url ? (
                                                    <div
                                                        key={idx}
                                                        className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                                            audioExpanded[audioKey]
                                                                ? 'max-h-40 opacity-100'
                                                                : 'max-h-0 opacity-0'
                                                        }`}
                                                    >
                                                        <AudioPlayer src={url} label={`Audio Note${selectedQuestion.solution.asset_ids!.audio!.length > 1 ? ` ${idx + 1}` : ''}`} />
                                                    </div>
                                                ) : null;
                                            })}
                                        </div>
                                    )}

                                    <MathRenderer
                                        markdown={selectedQuestion.solution?.text_markdown || ''}
                                        className="text-gray-300 solution-text"
                                        fontSize={20}
                                        imageScale={getSvgScale('solution')}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-600">
                                <p className="text-sm">No question selected</p>
                            </div>
                        )}
                    </div>
    </div>
  );
}
