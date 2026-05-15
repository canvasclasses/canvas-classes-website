'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Save,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Upload,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

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
  };
}

const CATEGORIES = ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'JEE PYQ'];

export default function FlashcardAdminClient() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [filteredFlashcards, setFilteredFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFlashcard, setSelectedFlashcard] = useState<Flashcard | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
  });

  // Fetch flashcards
  useEffect(() => {
    fetchFlashcards();
  }, []);

  // Filter flashcards
  useEffect(() => {
    let filtered = flashcards;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(f => f.chapter.category === selectedCategory);
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
  }, [flashcards, selectedCategory, searchQuery]);

  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v2/flashcards?limit=1000');
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
    });
    setIsEditing(true);
  };

  const handleCreate = () => {
    setFormData({
      flashcard_id: '',
      chapter_name: '',
      category: 'Physical Chemistry',
      topic_name: '',
      question: '',
      answer: '',
      difficulty: 'medium',
      source: 'NCERT',
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
    } catch (error: unknown) {
      showMessage('error', error instanceof Error ? error.message : 'Unknown error');
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
    } catch (error: unknown) {
      showMessage('error', 'Failed to delete flashcard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Flashcard Admin</h1>
          <p className="text-slate-400">Manage chemistry flashcards</p>
        </div>

        {/* Message Toast */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
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

        {/* Toolbar */}
        <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search flashcards..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Create Button */}
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              Create Flashcard
            </button>
          </div>

          <div className="mt-4 text-sm text-slate-400">
            Showing {filteredFlashcards.length} of {flashcards.length} flashcards
          </div>
        </div>

        {/* Flashcards List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredFlashcards.map(flashcard => (
              <motion.div
                key={flashcard._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/50 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-mono">
                        {flashcard.flashcard_id}
                      </span>
                      <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm">
                        {flashcard.chapter.category}
                      </span>
                      <span className="text-slate-500 text-sm">
                        {flashcard.chapter.name} • {flashcard.topic.name}
                      </span>
                    </div>

                    <div className="prose prose-invert max-w-none mb-3">
                      <div className="text-white mb-2">
                        <strong>Q:</strong>{' '}
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                          {flashcard.question.substring(0, 200) + (flashcard.question.length > 200 ? '...' : '')}
                        </ReactMarkdown>
                      </div>
                      <div className="text-slate-400 text-sm">
                        <strong>A:</strong>{' '}
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                          {flashcard.answer.substring(0, 200) + (flashcard.answer.length > 200 ? '...' : '')}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(flashcard)}
                      className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(flashcard)}
                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Edit/Create Modal */}
        {(isEditing || isCreating) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {isEditing ? 'Edit Flashcard' : 'Create Flashcard'}
                </h2>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setIsCreating(false);
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="grid gap-4">
                {/* Flashcard ID */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Flashcard ID *
                  </label>
                  <input
                    type="text"
                    value={formData.flashcard_id}
                    onChange={e => setFormData({ ...formData, flashcard_id: e.target.value })}
                    placeholder="FLASH-PHY-0001"
                    disabled={isEditing}
                    className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 disabled:opacity-50"
                  />
                </div>

                {/* Category & Chapter */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
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
                      Chapter Name *
                    </label>
                    <input
                      type="text"
                      value={formData.chapter_name}
                      onChange={e => setFormData({ ...formData, chapter_name: e.target.value })}
                      placeholder="Solutions"
                      className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Topic & Difficulty */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Topic Name *
                    </label>
                    <input
                      type="text"
                      value={formData.topic_name}
                      onChange={e => setFormData({ ...formData, topic_name: e.target.value })}
                      placeholder="Raoult's Law"
                      className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
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
                      className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>

                {/* Question */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Question * (Supports LaTeX: $$...$$)
                  </label>
                  <textarea
                    value={formData.question}
                    onChange={e => setFormData({ ...formData, question: e.target.value })}
                    placeholder="What is Raoult's Law? Use $$P = P_0 \times X$$ for LaTeX"
                    rows={4}
                    className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono text-sm"
                  />
                </div>

                {/* Answer */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Answer * (Supports LaTeX & Markdown)
                  </label>
                  <textarea
                    value={formData.answer}
                    onChange={e => setFormData({ ...formData, answer: e.target.value })}
                    placeholder="Raoult's law states that..."
                    rows={6}
                    className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono text-sm"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Flashcard
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setIsCreating(false);
                    }}
                    className="px-6 py-3 border border-white/10 text-slate-400 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
