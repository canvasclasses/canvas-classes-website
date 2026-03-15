'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Save, X, FolderPlus, ChevronDown, Loader2, Eye, List, CheckCircle, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import SVGDropZone from '../components/SVGDropZone';
import { FLASHCARD_CATEGORIES, getCategoryNames, getFlashcardChaptersByCategory } from '@/lib/flashcardTaxonomy';

interface Flashcard {
  _id: string;
  flashcard_id: string;
  chapter: {
    id: string;
    name: string;
    category: string;
  };
  topic: {
    name: string;
    order: number;
  };
  question: string;
  answer: string;
  metadata: {
    difficulty?: 'easy' | 'medium' | 'hard';
    tags: string[];
    source: string;
    class_num: number;
    flashcard_type?: 'standard' | 'true-false';
  };
}

// Get categories from flashcard taxonomy
const CATEGORIES = getCategoryNames();

export default function EnhancedFlashcardAdmin() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [filteredFlashcards, setFilteredFlashcards] = useState<Flashcard[]>([]);
  const [chapters, setChapters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedChapter, setSelectedChapter] = useState<string>('All');
  const [selectedFlashcard, setSelectedFlashcard] = useState<Flashcard | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showChapterManager, setShowChapterManager] = useState(false);
  const [newChapterName, setNewChapterName] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    flashcard_id: '',
    chapter_name: '',
    category: 'Physical Chemistry',
    topic_name: '',
    question: '',
    answer: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    source: 'NCERT',
    flashcard_type: 'standard' as 'standard' | 'true-false',
  });

  // Fetch flashcards
  useEffect(() => {
    fetchFlashcards();
  }, []);

  // Extract unique chapters
  useEffect(() => {
    const uniqueChapters = Array.from(new Set(flashcards.map(f => f.chapter.name))).sort();
    setChapters(uniqueChapters);
  }, [flashcards]);

  // Filter flashcards
  useEffect(() => {
    let filtered = flashcards;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(f => f.chapter.category === selectedCategory);
    }

    if (selectedChapter !== 'All') {
      filtered = filtered.filter(f => f.chapter.name === selectedChapter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        f =>
          f.question.toLowerCase().includes(query) ||
          f.answer.toLowerCase().includes(query) ||
          f.chapter.name.toLowerCase().includes(query) ||
          f.topic.name.toLowerCase().includes(query)
      );
    }

    setFilteredFlashcards(filtered);
  }, [flashcards, selectedCategory, selectedChapter, searchQuery]);

  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v2/flashcards?limit=5000');
      const data = await res.json();
      setFlashcards(data.flashcards || []);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      showMessage('error', 'Failed to fetch flashcards');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEdit = (flashcard: Flashcard) => {
    setSelectedFlashcard(flashcard);
    setFormData({
      flashcard_id: flashcard.flashcard_id,
      chapter_name: flashcard.chapter.name,
      category: flashcard.chapter.category,
      topic_name: flashcard.topic.name,
      question: flashcard.question,
      answer: flashcard.answer,
      difficulty: flashcard.metadata.difficulty || 'medium',
      source: flashcard.metadata.source || 'NCERT',
      flashcard_type: flashcard.metadata.flashcard_type || 'standard',
    });
    setIsEditing(true);
  };

  const handleCreate = () => {
    const nextId = `FLASH-${Date.now()}`;
    setFormData({
      flashcard_id: nextId,
      chapter_name: '',
      category: 'Physical Chemistry',
      topic_name: '',
      question: '',
      answer: '',
      difficulty: 'medium',
      source: 'NCERT',
      flashcard_type: 'standard',
    });
    setIsCreating(true);
  };

  const handleSave = async () => {
    if (!formData.flashcard_id || !formData.question || !formData.answer) {
      showMessage('error', 'Please fill in all required fields');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        flashcard_id: formData.flashcard_id,
        chapter: {
          id: formData.chapter_name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
          name: formData.chapter_name,
          category: formData.category,
        },
        topic: {
          name: formData.topic_name,
          order: 0,
        },
        question: formData.question,
        answer: formData.answer,
        metadata: {
          difficulty: formData.difficulty,
          tags: [formData.topic_name, formData.chapter_name].filter(Boolean),
          source: formData.source,
          class_num: 12,
          flashcard_type: formData.flashcard_type,
        },
      };

      const url = isEditing
        ? `/api/v2/flashcards/${selectedFlashcard?.flashcard_id}`
        : '/api/v2/flashcards';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to save flashcard');
      }

      showMessage('success', isEditing ? 'Flashcard updated!' : 'Flashcard created!');
      setIsEditing(false);
      setIsCreating(false);
      setSelectedFlashcard(null);
      fetchFlashcards();
    } catch (error: any) {
      showMessage('error', error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (flashcard: Flashcard) => {
    if (!confirm(`Delete flashcard: ${flashcard.flashcard_id}?`)) return;

    try {
      const res = await fetch(`/api/v2/flashcards/${flashcard.flashcard_id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete');

      showMessage('success', 'Flashcard deleted!');
      fetchFlashcards();
    } catch (error) {
      showMessage('error', 'Failed to delete flashcard');
    }
  };

  const handleSVGUpload = (field: 'question' | 'answer', markdownLink: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field] + '\n\n' + markdownLink,
    }));
  };

  const addNewChapter = () => {
    if (!newChapterName.trim()) return;
    setFormData(prev => ({ ...prev, chapter_name: newChapterName }));
    setNewChapterName('');
    setShowChapterManager(false);
    showMessage('success', `Chapter "${newChapterName}" ready to use`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="flex h-screen">
        {/* Left Sidebar - List View */}
        <div className="w-96 border-r border-white/10 flex flex-col bg-slate-900/50">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <h1 className="text-2xl font-bold text-white mb-2">Flashcards</h1>
            <p className="text-slate-400 text-sm">
              {filteredFlashcards.length} of {flashcards.length} cards
            </p>
          </div>

          {/* Toolbar */}
          <div className="p-4 border-b border-white/10 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Filters */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={selectedChapter}
              onChange={e => setSelectedChapter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
            >
              <option value="All">All Chapters</option>
              {selectedCategory === 'All' ? (
                chapters.map(ch => (
                  <option key={ch} value={ch}>
                    {ch}
                  </option>
                ))
              ) : (
                getFlashcardChaptersByCategory(selectedCategory).map(ch => (
                  <option key={ch.id} value={ch.name}>
                    {ch.displayName}
                  </option>
                ))
              )}
            </select>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                New Card
              </button>
              <button
                onClick={() => setShowChapterManager(true)}
                className="px-3 py-2 bg-slate-800 border border-white/10 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                title="Manage Chapters"
              >
                <FolderPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Flashcards List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
              </div>
            ) : filteredFlashcards.length === 0 ? (
              <div className="text-center py-20 text-slate-500">
                No flashcards found
              </div>
            ) : (
              filteredFlashcards.map(flashcard => (
                <motion.div
                  key={flashcard._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedFlashcard?._id === flashcard._id
                      ? 'bg-purple-500/20 border-purple-500'
                      : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => handleEdit(flashcard)}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-xs font-mono">
                      {flashcard.flashcard_id}
                    </span>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleDelete(flashcard);
                      }}
                      className="p-1 hover:bg-red-500/20 text-red-400 rounded transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-white text-sm mb-1 line-clamp-2 prose prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {flashcard.question.substring(0, 150)}
                    </ReactMarkdown>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{flashcard.chapter.name}</span>
                    {flashcard.metadata.flashcard_type === 'true-false' && (
                      <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                        T/F
                      </span>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Editor & Preview */}
        <div className="flex-1 flex flex-col">
          {(isEditing || isCreating) ? (
            <>
              {/* Editor Header */}
              <div className="p-6 border-b border-white/10 bg-slate-900/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">
                    {isEditing ? 'Edit Flashcard' : 'Create Flashcard'}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setIsCreating(false);
                        setSelectedFlashcard(null);
                      }}
                      className="px-4 py-2 border border-white/10 text-slate-400 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              {/* Split View - Editor & Preview */}
              <div className="flex-1 flex overflow-hidden">
                {/* Left - Editor */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Flashcard ID *
                      </label>
                      <input
                        type="text"
                        value={formData.flashcard_id}
                        onChange={e => setFormData({ ...formData, flashcard_id: e.target.value })}
                        disabled={isEditing}
                        className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Type
                      </label>
                      <select
                        value={formData.flashcard_type}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            flashcard_type: e.target.value as 'standard' | 'true-false',
                            answer: e.target.value === 'true-false' ? 'True' : formData.answer,
                          })
                        }
                        className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                      >
                        <option value="standard">Standard</option>
                        <option value="true-false">True/False</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Chapter *
                      </label>
                      <input
                        type="text"
                        value={formData.chapter_name}
                        onChange={e => setFormData({ ...formData, chapter_name: e.target.value })}
                        placeholder="e.g., JEE 2026, Solutions"
                        list="chapters-list"
                        className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                      />
                      <datalist id="chapters-list">
                        {chapters.map(ch => (
                          <option key={ch} value={ch} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Topic
                      </label>
                      <input
                        type="text"
                        value={formData.topic_name}
                        onChange={e => setFormData({ ...formData, topic_name: e.target.value })}
                        placeholder="e.g., Raoult's Law"
                        className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Difficulty
                      </label>
                      <select
                        value={formData.difficulty}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            difficulty: e.target.value as 'easy' | 'medium' | 'hard',
                          })
                        }
                        className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  {/* Question Section */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Question * (Supports LaTeX: $$...$$)
                    </label>
                    <SVGDropZone
                      questionId={formData.flashcard_id}
                      fieldType="question"
                      onUploaded={(markdownLink) => handleSVGUpload('question', markdownLink)}
                      compact={false}
                    />
                    <textarea
                      value={formData.question}
                      onChange={e => setFormData({ ...formData, question: e.target.value })}
                      placeholder="What is Raoult's Law? Use $$P = P_0 \times X$$ for LaTeX"
                      rows={6}
                      className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 font-mono mt-2"
                    />
                  </div>

                  {/* Answer Section */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Answer * (Supports LaTeX & Markdown)
                    </label>
                    {formData.flashcard_type === 'true-false' ? (
                      <select
                        value={formData.answer}
                        onChange={e => setFormData({ ...formData, answer: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                      >
                        <option value="True">True</option>
                        <option value="False">False</option>
                      </select>
                    ) : (
                      <>
                        <SVGDropZone
                          questionId={formData.flashcard_id}
                          fieldType="solution"
                          onUploaded={(markdownLink) => handleSVGUpload('answer', markdownLink)}
                          compact={false}
                        />
                        <textarea
                          value={formData.answer}
                          onChange={e => setFormData({ ...formData, answer: e.target.value })}
                          placeholder="Raoult's law states that..."
                          rows={8}
                          className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 font-mono mt-2"
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Right - Live Preview */}
                <div className="w-1/2 border-l border-white/10 bg-slate-900/30 overflow-y-auto p-6">
                  <div className="sticky top-0 bg-slate-900/30 backdrop-blur-sm pb-4 mb-4 border-b border-white/10">
                    <div className="flex items-center gap-2 text-purple-400">
                      <Eye className="w-5 h-5" />
                      <h3 className="font-semibold">Live Preview</h3>
                    </div>
                  </div>

                  {/* Flashcard Preview */}
                  <div className="space-y-6">
                    {/* Question Preview */}
                    <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6">
                      <div className="text-xs font-semibold text-purple-400 mb-3 uppercase tracking-wider">
                        Question
                      </div>
                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                          {formData.question || '*No question yet*'}
                        </ReactMarkdown>
                      </div>
                    </div>

                    {/* Answer Preview */}
                    <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6">
                      <div className="text-xs font-semibold text-emerald-400 mb-3 uppercase tracking-wider">
                        Answer
                      </div>
                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                          {formData.answer || '*No answer yet*'}
                        </ReactMarkdown>
                      </div>
                    </div>

                    {/* Metadata Preview */}
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                        {formData.category}
                      </span>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                        {formData.chapter_name || 'No chapter'}
                      </span>
                      {formData.topic_name && (
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
                          {formData.topic_name}
                        </span>
                      )}
                      <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-xs">
                        {formData.difficulty}
                      </span>
                      {formData.flashcard_type === 'true-false' && (
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                          True/False
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              <div className="text-center">
                <List className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Select a flashcard to edit</p>
                <p className="text-sm mt-2">or create a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Message Toast */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 ${
              message.type === 'success'
                ? 'bg-emerald-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chapter Manager Modal */}
      <AnimatePresence>
        {showChapterManager && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Add New Chapter/Section</h3>
                <button
                  onClick={() => setShowChapterManager(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <p className="text-slate-400 text-sm mb-4">
                Create custom chapters like "JEE 2026", "JEE 2025 Jan", "NEET 2024", etc.
              </p>

              <input
                type="text"
                value={newChapterName}
                onChange={e => setNewChapterName(e.target.value)}
                placeholder="e.g., JEE 2026 PYQs"
                className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white mb-4 focus:outline-none focus:border-purple-500"
                onKeyPress={e => e.key === 'Enter' && addNewChapter()}
              />

              <div className="flex gap-3">
                <button
                  onClick={addNewChapter}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Add Chapter
                </button>
                <button
                  onClick={() => setShowChapterManager(false)}
                  className="px-4 py-2 border border-white/10 text-slate-400 rounded-lg hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="text-sm font-medium text-slate-300 mb-3">Existing Chapters:</div>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {chapters.map(ch => (
                    <div
                      key={ch}
                      className="px-3 py-2 bg-slate-800/50 rounded-lg text-slate-300 text-sm"
                    >
                      {ch}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
