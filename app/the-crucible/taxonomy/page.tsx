'use client';

import { useState, useEffect } from 'react';
import { Save, Check, AlertCircle, Video, FileText, ExternalLink, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface TaxonomyEntry {
    _id: string;
    name: string;
    parent_id: string | null;
    subject: string;
    chapter: string;
    question_count: number;
    remedial_video_url?: string;
    remedial_notes_url?: string;
    is_chapter_tag?: boolean;
}

interface TaxonomyStats {
    total: number;
    chapters: number;
    concepts: number;
    withRemedialVideo: number;
    withRemedialNotes: number;
    missingVideo: number;
}

export default function TaxonomyAdminPage() {
    const [taxonomy, setTaxonomy] = useState<TaxonomyEntry[]>([]);
    const [stats, setStats] = useState<TaxonomyStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValues, setEditValues] = useState<{ video?: string; notes?: string }>({});
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const fetchTaxonomy = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/taxonomy');
            const data = await res.json();
            setTaxonomy(data.taxonomy || []);
            setStats(data.stats || null);
        } catch (error) {
            console.error('Failed to fetch taxonomy:', error);
            setMessage({ type: 'error', text: 'Failed to load taxonomy' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTaxonomy();
    }, []);

    const startEdit = (entry: TaxonomyEntry) => {
        setEditingId(entry._id);
        setEditValues({
            video: entry.remedial_video_url || '',
            notes: entry.remedial_notes_url || ''
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditValues({});
    };

    const saveEntry = async (tagId: string) => {
        setSavingId(tagId);
        setMessage(null);

        try {
            const res = await fetch('/api/taxonomy', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tag_id: tagId,
                    updates: {
                        remedial_video_url: editValues.video || null,
                        remedial_notes_url: editValues.notes || null
                    }
                })
            });

            const data = await res.json();

            if (data.success) {
                setMessage({ type: 'success', text: `Updated ${tagId}` });
                setEditingId(null);
                fetchTaxonomy(); // Refresh
            } else {
                setMessage({ type: 'error', text: data.error || 'Update failed' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save changes' });
        } finally {
            setSavingId(null);
        }
    };

    // Group by chapter
    const chapters = taxonomy.filter(t => t.is_chapter_tag);
    const concepts = taxonomy.filter(t => !t.is_chapter_tag);

    const conceptsByChapter = concepts.reduce((acc, c) => {
        const parent = c.parent_id || 'Uncategorized';
        if (!acc[parent]) acc[parent] = [];
        acc[parent].push(c);
        return acc;
    }, {} as Record<string, TaxonomyEntry[]>);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-400" />
                    <p className="text-gray-400">Loading taxonomy...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            {/* Header */}
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                            Taxonomy Manager
                        </h1>
                        <p className="text-gray-400 mt-1">Add remedial videos and notes to your skill tree</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={fetchTaxonomy}
                            className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
                        >
                            <RefreshCw size={16} />
                            Refresh
                        </button>
                        <Link
                            href="/the-crucible/admin"
                            className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-500 transition"
                        >
                            Questions Admin
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
                        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                            <div className="text-2xl font-bold text-white">{stats.total}</div>
                            <div className="text-xs text-gray-400 uppercase">Total Tags</div>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                            <div className="text-2xl font-bold text-blue-400">{stats.chapters}</div>
                            <div className="text-xs text-gray-400 uppercase">Chapters</div>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                            <div className="text-2xl font-bold text-purple-400">{stats.concepts}</div>
                            <div className="text-xs text-gray-400 uppercase">Concepts</div>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                            <div className="text-2xl font-bold text-green-400">{stats.withRemedialVideo}</div>
                            <div className="text-xs text-gray-400 uppercase">With Video</div>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                            <div className="text-2xl font-bold text-amber-400">{stats.withRemedialNotes}</div>
                            <div className="text-xs text-gray-400 uppercase">With Notes</div>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                            <div className="text-2xl font-bold text-red-400">{stats.missingVideo}</div>
                            <div className="text-xs text-gray-400 uppercase">Missing Video</div>
                        </div>
                    </div>
                )}

                {/* Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' :
                        'bg-red-500/10 border border-red-500/30 text-red-400'
                        }`}>
                        {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                        {message.text}
                    </div>
                )}

                {/* Taxonomy List */}
                <div className="space-y-6">
                    {Object.entries(conceptsByChapter).map(([chapterId, conceptsList]) => {
                        const chapter = chapters.find(c => c._id === chapterId);
                        return (
                            <div key={chapterId} className="bg-gray-800/30 rounded-2xl border border-gray-700/50 overflow-hidden">
                                <div className="bg-gray-800/80 px-6 py-4 border-b border-gray-700/50">
                                    <h2 className="text-lg font-bold text-blue-400">
                                        {chapter?.name || chapterId.replace('TAG_CHAPTER_', '').replace(/_/g, ' ')}
                                    </h2>
                                    <p className="text-xs text-gray-500">{conceptsList.length} concepts</p>
                                </div>

                                <div className="divide-y divide-gray-700/30">
                                    {conceptsList.map(concept => (
                                        <div
                                            key={concept._id}
                                            className={`px-6 py-4 transition ${editingId === concept._id ? 'bg-purple-900/10' : 'hover:bg-gray-800/30'}`}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-medium text-white">{concept.name}</span>
                                                        <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300">
                                                            {concept.question_count} Q
                                                        </span>
                                                        {concept.remedial_video_url && (
                                                            <span className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-400 flex items-center gap-1">
                                                                <Video size={10} /> Video
                                                            </span>
                                                        )}
                                                        {concept.remedial_notes_url && (
                                                            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 flex items-center gap-1">
                                                                <FileText size={10} /> Notes
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-500 font-mono mt-1">{concept._id}</div>
                                                </div>

                                                {editingId === concept._id ? (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => saveEntry(concept._id)}
                                                            disabled={savingId === concept._id}
                                                            className="px-3 py-1.5 bg-green-600 rounded text-sm font-medium hover:bg-green-500 transition disabled:opacity-50"
                                                        >
                                                            {savingId === concept._id ? 'Saving...' : 'Save'}
                                                        </button>
                                                        <button
                                                            onClick={cancelEdit}
                                                            className="px-3 py-1.5 bg-gray-700 rounded text-sm font-medium hover:bg-gray-600 transition"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => startEdit(concept)}
                                                        className="px-3 py-1.5 bg-gray-700 rounded text-sm font-medium hover:bg-gray-600 transition"
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                            </div>

                                            {editingId === concept._id && (
                                                <div className="mt-4 space-y-3 animate-in slide-in-from-top-2">
                                                    <div>
                                                        <label className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-1">
                                                            <Video size={12} /> Remedial Video URL
                                                        </label>
                                                        <input
                                                            type="url"
                                                            value={editValues.video || ''}
                                                            onChange={(e) => setEditValues(v => ({ ...v, video: e.target.value }))}
                                                            placeholder="https://youtube.com/watch?v=..."
                                                            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-sm focus:border-purple-500 outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-1">
                                                            <FileText size={12} /> Remedial Notes URL
                                                        </label>
                                                        <input
                                                            type="url"
                                                            value={editValues.notes || ''}
                                                            onChange={(e) => setEditValues(v => ({ ...v, notes: e.target.value }))}
                                                            placeholder="https://drive.google.com/..."
                                                            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-sm focus:border-purple-500 outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Show existing URLs if not editing */}
                                            {editingId !== concept._id && (concept.remedial_video_url || concept.remedial_notes_url) && (
                                                <div className="mt-2 flex gap-4">
                                                    {concept.remedial_video_url && (
                                                        <a
                                                            href={concept.remedial_video_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1"
                                                        >
                                                            <ExternalLink size={10} /> View Video
                                                        </a>
                                                    )}
                                                    {concept.remedial_notes_url && (
                                                        <a
                                                            href={concept.remedial_notes_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
                                                        >
                                                            <ExternalLink size={10} /> View Notes
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
