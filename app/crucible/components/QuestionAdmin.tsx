'use client';

import { useState, useRef } from 'react';
import type { TaxonomyNode } from '../admin/taxonomy/taxonomyData';
import { HARDCODED_TAXONOMY } from '../admin/taxonomy/taxonomyData';
import { uploadToR2, UploadResult } from '@/lib/r2Storage';
import { 
  Plus, 
  Upload, 
  X, 
  Check, 
  Mic,
  FileAudio,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// ============================================
// QUESTION ADMIN INTERFACE
// Add questions with audio upload to R2
// ============================================

const QUESTION_TYPES = [
  { id: 'SCQ', name: 'Single Correct (MCQ)', color: 'bg-emerald-500/20 text-emerald-400' },
  { id: 'MCQ', name: 'Multiple Correct', color: 'bg-blue-500/20 text-blue-400' },
  { id: 'NVT', name: 'Numerical Value', color: 'bg-purple-500/20 text-purple-400' },
  { id: 'AR', name: 'Assertion-Reason', color: 'bg-orange-500/20 text-orange-400' },
  { id: 'MST', name: 'Multi-Statement', color: 'bg-cyan-500/20 text-cyan-400' },
];

const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'];

export default function QuestionAdmin() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Form state
  const [questionType, setQuestionType] = useState('SCQ');
  const [difficulty, setDifficulty] = useState('Medium');
  const [chapterId, setChapterId] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [solutionText, setSolutionText] = useState('');
  const [options, setOptions] = useState([
    { id: 'a', text: '', isCorrect: false },
    { id: 'b', text: '', isCorrect: false },
    { id: 'c', text: '', isCorrect: false },
    { id: 'd', text: '', isCorrect: false },
  ]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Audio upload state
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUploading, setAudioUploading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const audioInputRef = useRef<HTMLInputElement>(null);

  // Get chapters and tags from taxonomy
  const chapters = HARDCODED_TAXONOMY.filter((n: TaxonomyNode) => n.type === 'chapter');
  const tags = HARDCODED_TAXONOMY.filter((n: TaxonomyNode) => n.type === 'topic');
  const selectedChapterTags = tags.filter((t: TaxonomyNode) => t.parent_id === chapterId);

  const handleAudioSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Audio file must be under 50MB' });
        return;
      }
      setAudioFile(file);
      setMessage(null);
    }
  };

  const handleAudioUpload = async () => {
    if (!audioFile || !chapterId) {
      setMessage({ type: 'error', text: 'Please select a chapter first' });
      return;
    }

    setAudioUploading(true);
    try {
      // Generate display ID placeholder
      const displayId = `${chapterId.toUpperCase().replace('CH_', '')}-XXX`;
      const fileName = `${displayId}_audio_${Date.now()}.mp3`;
      
      const buffer = await audioFile.arrayBuffer();
      const result: UploadResult = await uploadToR2(
        Buffer.from(buffer),
        fileName,
        'audio',
        audioFile.type
      );

      if (result.success && result.url) {
        setAudioUrl(result.url);
        setMessage({ type: 'success', text: 'Audio uploaded successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Upload failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Upload failed. Check R2 configuration.' });
    } finally {
      setAudioUploading(false);
    }
  };

  const handleOptionChange = (id: string, text: string) => {
    setOptions(prev => prev.map(opt => 
      opt.id === id ? { ...opt, text } : opt
    ));
  };

  const handleCorrectToggle = (id: string) => {
    if (questionType === 'SCQ') {
      // Single correct: only one can be selected
      setOptions(prev => prev.map(opt => ({
        ...opt,
        isCorrect: opt.id === id
      })));
    } else {
      // Multiple correct: toggle
      setOptions(prev => prev.map(opt => 
        opt.id === id ? { ...opt, isCorrect: !opt.isCorrect } : opt
      ));
    }
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validation
    if (!chapterId) {
      setMessage({ type: 'error', text: 'Please select a chapter' });
      setIsSubmitting(false);
      return;
    }
    if (!questionText.trim()) {
      setMessage({ type: 'error', text: 'Question text is required' });
      setIsSubmitting(false);
      return;
    }
    if (options.some(o => !o.text.trim())) {
      setMessage({ type: 'error', text: 'All options must have text' });
      setIsSubmitting(false);
      return;
    }
    if (!options.some(o => o.isCorrect)) {
      setMessage({ type: 'error', text: 'Please mark at least one correct answer' });
      setIsSubmitting(false);
      return;
    }

    try {
      // Build question object
      const question = {
        type: questionType,
        difficulty,
        chapter_id: chapterId,
        question_text: {
          markdown: questionText,
          latex_validated: false,
        },
        options: options.map(o => ({
          id: o.id,
          text: o.text,
          is_correct: o.isCorrect,
        })),
        solution: {
          text_markdown: solutionText,
          latex_validated: false,
          asset_ids: {
            audio: audioUrl ? [audioUrl] : [],
          },
        },
        metadata: {
          difficulty: difficulty as 'Easy' | 'Medium' | 'Hard',
          chapter_id: chapterId,
          tags: selectedTags.map(tagId => ({ tag_id: tagId, weight: 1.0 / selectedTags.length })),
          is_pyq: false,
          is_top_pyq: false,
        },
      };

      // TODO: Send to server action to save in MongoDB
      console.log('Question to save:', question);
      
      setMessage({ type: 'success', text: 'Question prepared successfully! (Save to DB pending)' });
      
      // Reset form
      setQuestionText('');
      setSolutionText('');
      setOptions([
        { id: 'a', text: '', isCorrect: false },
        { id: 'b', text: '', isCorrect: false },
        { id: 'c', text: '', isCorrect: false },
        { id: 'd', text: '', isCorrect: false },
      ]);
      setSelectedTags([]);
      setAudioFile(null);
      setAudioUrl('');
      
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save question' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <Plus className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-white">Add New Question</h3>
            <p className="text-sm text-slate-400">Create question with audio explanation</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>

      {/* Expanded Form */}
      {isExpanded && (
        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700 space-y-6">
          {/* Message */}
          {message && (
            <div className={`p-3 rounded-lg flex items-center gap-2 ${
              message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
            }`}>
              <AlertCircle className="w-4 h-4" />
              {message.text}
            </div>
          )}

          {/* Question Type & Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Question Type
              </label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
              >
                {QUESTION_TYPES.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
              >
                {DIFFICULTY_LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Chapter
              </label>
              <select
                value={chapterId}
                onChange={(e) => {
                  setChapterId(e.target.value);
                  setSelectedTags([]);
                }}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Chapter</option>
                {chapters.map((ch: TaxonomyNode) => (
                  <option key={ch.id} value={ch.id}>{ch.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Question Text */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Question Text (Markdown + LaTeX supported)
            </label>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
              placeholder="Enter question text... Use $ for LaTeX: $E = mc^2$"
            />
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Options (Mark correct answer{questionType === 'SCQ' ? '' : 's'})
            </label>
            <div className="space-y-2">
              {options.map((option) => (
                <div key={option.id} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCorrectToggle(option.id)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      option.isCorrect 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
                        : 'bg-slate-700 text-slate-400 border border-slate-600'
                    }`}
                  >
                    {option.isCorrect ? <Check className="w-4 h-4" /> : option.id.toUpperCase()}
                  </button>
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionChange(option.id, e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
                    placeholder={`Option ${option.id.toUpperCase()}`}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Click the letter button to mark correct answer. 
              {questionType === 'SCQ' ? ' Only one can be correct.' : ' Multiple can be correct.'}
            </p>
          </div>

          {/* Solution Text */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Solution / Explanation
            </label>
            <textarea
              value={solutionText}
              onChange={(e) => setSolutionText(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
              placeholder="Enter detailed solution... Use ** for bold, * for italic, $ for math"
            />
          </div>

          {/* Audio Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Audio Explanation (Optional)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioSelect}
                ref={audioInputRef}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => audioInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                <Mic className="w-4 h-4" />
                {audioFile ? 'Change Audio' : 'Select Audio File'}
              </button>
              
              {audioFile && (
                <>
                  <span className="text-sm text-slate-400 flex items-center gap-2">
                    <FileAudio className="w-4 h-4" />
                    {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                  <button
                    type="button"
                    onClick={handleAudioUpload}
                    disabled={audioUploading}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    {audioUploading ? 'Uploading...' : 'Upload to R2'}
                  </button>
                </>
              )}
              
              {audioUrl && (
                <span className="text-sm text-emerald-400 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  Uploaded!
                </span>
              )}
            </div>
            {audioUrl && (
              <audio src={audioUrl} controls className="mt-3 w-full" />
            )}
          </div>

          {/* Concept Tags */}
          {chapterId && selectedChapterTags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Concept Tags ({selectedChapterTags.length} available)
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-slate-700/50 rounded-lg">
                {selectedChapterTags.map((tag: TaxonomyNode) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedTags.includes(tag.id)
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Selected: {selectedTags.length} tags
              </p>
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Save Question
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
