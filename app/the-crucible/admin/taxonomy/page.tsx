'use client';

import { useState, useEffect, useRef } from 'react';
import { getTaxonomy, saveTaxonomyNode, deleteTaxonomyNode } from '../../actions';
import { TaxonomyNode } from '../../types';
import {
    Loader, Plus, Trash2, Edit2, Save, X, Folder, Tag, Video, FileText,
    ExternalLink, Check, AlertCircle, GripVertical, ChevronDown, ChevronRight,
    Beaker, Atom, Leaf
} from 'lucide-react';

// Branch config
const BRANCHES = [
    { id: 'TAG_BRANCH_PHYSICAL', name: 'Physical Chemistry', icon: Beaker, color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.25)' },
    { id: 'TAG_BRANCH_INORG', name: 'Inorganic Chemistry', icon: Atom, color: '#3B82F6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)' },
    { id: 'TAG_BRANCH_ORGANIC', name: 'Organic Chemistry', icon: Leaf, color: '#10B981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)' },
];

export default function TaxonomyPage() {
    const [nodes, setNodes] = useState<TaxonomyNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
    const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editVideoUrl, setEditVideoUrl] = useState('');
    const [editNotesUrl, setEditNotesUrl] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [dragItem, setDragItem] = useState<string | null>(null);
    const [dragOverBranch, setDragOverBranch] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        const data = await getTaxonomy();
        setNodes(data);
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    // Derived data
    const chapters = nodes.filter(n => n.type === 'chapter');
    const topics = nodes.filter(n => n.type === 'topic');

    const chaptersInBranch = (branchId: string) =>
        chapters.filter(c => c.parent_id === branchId).sort((a, b) => a.name.localeCompare(b.name));

    const topicsInChapter = (chapterId: string) =>
        topics.filter(t => t.parent_id === chapterId).sort((a, b) => a.name.localeCompare(b.name));

    // Stats
    const totalTopics = topics.length;
    const withVideo = nodes.filter(n => n.remedial_video_url).length;
    const withNotes = nodes.filter(n => n.remedial_notes_url).length;

    // Toast
    const showMessage = (type: 'success' | 'error', text: string) => setMessage({ type, text });
    useEffect(() => {
        if (message) { const t = setTimeout(() => setMessage(null), 3000); return () => clearTimeout(t); }
    }, [message]);

    // ===== CRUD Actions =====
    const handleAddChapter = async (branchId: string) => {
        const name = prompt('Enter Chapter Name:');
        if (!name) return;
        const id = `chapter_${name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')}`;
        await saveTaxonomyNode({ id, name, type: 'chapter', parent_id: branchId });
        await loadData();
        showMessage('success', `Added chapter: ${name}`);
    };

    const handleAddTag = async (chapterId: string) => {
        const name = prompt('Enter Concept Tag Name:');
        if (!name) return;
        const chapter = chapters.find(c => c.id === chapterId);
        const prefix = chapter?.name.split(' ')[0].toUpperCase().substring(0, 4) || 'TAG';
        const suffix = name.toUpperCase().replace(/[^A-Z0-9]+/g, '_');
        const id = `TAG_${prefix}_${suffix}`;
        await saveTaxonomyNode({ id, name, type: 'topic', parent_id: chapterId });
        await loadData();
        showMessage('success', `Added tag: ${name}`);
    };

    const handleDelete = async (node: TaxonomyNode) => {
        const childCount = node.type === 'chapter' ? topicsInChapter(node.id).length : 0;
        const warning = childCount > 0
            ? `This chapter has ${childCount} concept tags. Delete anyway?`
            : 'Are you sure? This might break questions using this tag.';
        if (!confirm(warning)) return;

        // If deleting chapter, delete its topics first
        if (node.type === 'chapter') {
            for (const topic of topicsInChapter(node.id)) {
                await deleteTaxonomyNode(topic.id);
            }
        }

        const result = await deleteTaxonomyNode(node.id);
        if (!result.success) { showMessage('error', result.message); return; }
        if (expandedChapter === node.id) setExpandedChapter(null);
        await loadData();
        showMessage('success', `Deleted: ${node.name}`);
    };

    const startEditing = (node: TaxonomyNode) => {
        setEditingNodeId(node.id);
        setEditName(node.name);
        setEditVideoUrl(node.remedial_video_url || '');
        setEditNotesUrl(node.remedial_notes_url || '');
    };

    const cancelEditing = () => { setEditingNodeId(null); };

    const saveEdit = async (node: TaxonomyNode) => {
        const updated: TaxonomyNode = {
            ...node,
            name: editName.trim() || node.name,
            remedial_video_url: editVideoUrl.trim() || undefined,
            remedial_notes_url: editNotesUrl.trim() || undefined,
        };
        await saveTaxonomyNode(updated);
        await loadData();
        setEditingNodeId(null);
        showMessage('success', `Updated: ${updated.name}`);
    };

    // ===== Drag & Drop =====
    const handleDragStart = (e: React.DragEvent, chapterId: string) => {
        setDragItem(chapterId);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', chapterId);
    };

    const handleDragOver = (e: React.DragEvent, branchId: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverBranch(branchId);
    };

    const handleDragLeave = () => { setDragOverBranch(null); };

    const handleDrop = async (e: React.DragEvent, targetBranchId: string) => {
        e.preventDefault();
        setDragOverBranch(null);
        const chapterId = e.dataTransfer.getData('text/plain');
        if (!chapterId) return;

        const chapter = chapters.find(c => c.id === chapterId);
        if (!chapter || chapter.parent_id === targetBranchId) { setDragItem(null); return; }

        // Move chapter to new branch
        await saveTaxonomyNode({ ...chapter, parent_id: targetBranchId });
        await loadData();
        setDragItem(null);
        const branchName = BRANCHES.find(b => b.id === targetBranchId)?.name || targetBranchId;
        showMessage('success', `Moved "${chapter.name}" to ${branchName}`);
    };

    const handleDragEnd = () => { setDragItem(null); setDragOverBranch(null); };

    // ===== Render =====
    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8">
            {/* Header */}
            <header className="mb-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    Taxonomy Manager
                </h1>
                <p className="text-gray-500 text-sm mt-1">Drag chapters between branches • Click to expand • Edit tags & remedial resources</p>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                {BRANCHES.map(b => (
                    <div key={b.id} className="rounded-xl p-3 border" style={{ background: b.bg, borderColor: b.border }}>
                        <div className="text-xl font-bold" style={{ color: b.color }}>{chaptersInBranch(b.id).length}</div>
                        <div className="text-[10px] text-gray-400 uppercase">{b.name.split(' ')[0]}</div>
                    </div>
                ))}
                <div className="bg-gray-900/60 rounded-xl p-3 border border-gray-800">
                    <div className="text-xl font-bold text-amber-400">{totalTopics}</div>
                    <div className="text-[10px] text-gray-400 uppercase">Concept Tags</div>
                </div>
                <div className="bg-gray-900/60 rounded-xl p-3 border border-gray-800">
                    <div className="text-xl font-bold text-pink-400">{chapters.length}</div>
                    <div className="text-[10px] text-gray-400 uppercase">Total Chapters</div>
                </div>
            </div>

            {/* Toast */}
            {message && (
                <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm transition-all ${message.type === 'success'
                    ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                    : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
                    {message.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                    {message.text}
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader className="animate-spin text-purple-500" size={40} />
                </div>
            ) : (
                /* ===== Kanban Board ===== */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ minHeight: '65vh' }}>
                    {BRANCHES.map(branch => {
                        const BranchIcon = branch.icon;
                        const branchChapters = chaptersInBranch(branch.id);
                        const isDragOver = dragOverBranch === branch.id;

                        return (
                            <div
                                key={branch.id}
                                className="rounded-2xl border flex flex-col transition-all duration-200"
                                style={{
                                    background: isDragOver ? branch.bg : 'rgba(17,17,17,0.6)',
                                    borderColor: isDragOver ? branch.color : 'rgba(255,255,255,0.06)',
                                    boxShadow: isDragOver ? `0 0 30px ${branch.color}20` : 'none',
                                }}
                                onDragOver={(e) => handleDragOver(e, branch.id)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, branch.id)}
                            >
                                {/* Column Header */}
                                <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: branch.border }}>
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: branch.bg, border: `1px solid ${branch.border}` }}>
                                            <BranchIcon size={16} style={{ color: branch.color }} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm" style={{ color: branch.color }}>{branch.name}</div>
                                            <div className="text-[10px] text-gray-600">{branchChapters.length} chapters</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleAddChapter(branch.id)}
                                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                                        style={{ background: branch.bg, border: `1px solid ${branch.border}`, color: branch.color }}
                                        title="Add Chapter"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>

                                {/* Chapter Cards */}
                                <div className="p-2 flex-1 overflow-y-auto space-y-1.5" style={{ maxHeight: '70vh' }}>
                                    {branchChapters.map(chapter => {
                                        const isExpanded = expandedChapter === chapter.id;
                                        const chapterTopics = topicsInChapter(chapter.id);
                                        const isDragging = dragItem === chapter.id;

                                        return (
                                            <div
                                                key={chapter.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, chapter.id)}
                                                onDragEnd={handleDragEnd}
                                                className={`rounded-xl border transition-all duration-150 ${isDragging ? 'opacity-30 scale-95' : ''}`}
                                                style={{
                                                    background: isExpanded ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.015)',
                                                    borderColor: isExpanded ? branch.border : 'rgba(255,255,255,0.04)',
                                                }}
                                            >
                                                {/* Chapter Row */}
                                                <div
                                                    className="p-2.5 flex items-center gap-2 cursor-pointer group"
                                                    onClick={() => setExpandedChapter(isExpanded ? null : chapter.id)}
                                                >
                                                    <GripVertical size={12} className="text-gray-700 cursor-grab flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    {isExpanded
                                                        ? <ChevronDown size={13} style={{ color: branch.color }} className="flex-shrink-0" />
                                                        : <ChevronRight size={13} className="text-gray-600 flex-shrink-0" />
                                                    }
                                                    <Folder size={13} style={{ color: isExpanded ? branch.color : '#4B5563' }} className="flex-shrink-0" />
                                                    <span className="text-xs font-medium text-gray-300 flex-1 truncate">{chapter.name}</span>
                                                    <span className="text-[9px] text-gray-600 flex-shrink-0">{chapterTopics.length}</span>

                                                    {/* Chapter actions */}
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5 flex-shrink-0">
                                                        <button onClick={(e) => { e.stopPropagation(); startEditing(chapter); }}
                                                            className="p-1 rounded hover:bg-white/5 text-gray-600 hover:text-blue-400">
                                                            <Edit2 size={10} />
                                                        </button>
                                                        <button onClick={(e) => { e.stopPropagation(); handleDelete(chapter); }}
                                                            className="p-1 rounded hover:bg-white/5 text-gray-600 hover:text-red-400">
                                                            <Trash2 size={10} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Chapter edit panel */}
                                                {editingNodeId === chapter.id && (
                                                    <div className="px-3 pb-3 space-y-2 border-t border-white/5 pt-2">
                                                        <div>
                                                            <label className="text-[9px] text-gray-500 uppercase mb-1 block">Chapter Name</label>
                                                            <input value={editName} onChange={(e) => setEditName(e.target.value)}
                                                                className="w-full bg-black/40 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-purple-500" autoFocus />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => saveEdit(chapter)}
                                                                className="flex-1 flex items-center justify-center gap-1 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg py-1.5 text-xs hover:bg-green-500/20">
                                                                <Save size={11} /> Save
                                                            </button>
                                                            <button onClick={cancelEditing}
                                                                className="flex-1 flex items-center justify-center gap-1 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg py-1.5 text-xs hover:bg-red-500/20">
                                                                <X size={11} /> Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Expanded: Topic List */}
                                                {isExpanded && editingNodeId !== chapter.id && (
                                                    <div className="px-2 pb-2 border-t border-white/5">
                                                        <div className="pt-2 space-y-1">
                                                            {chapterTopics.length === 0 ? (
                                                                <div className="text-center py-3 text-gray-700 text-[10px]">No concept tags</div>
                                                            ) : (
                                                                chapterTopics.map(topic => (
                                                                    <div key={topic.id} className="group/tag">
                                                                        {editingNodeId === topic.id ? (
                                                                            /* Tag Edit Mode */
                                                                            <div className="rounded-lg bg-black/30 border border-purple-500/30 p-2 space-y-2">
                                                                                <div>
                                                                                    <label className="text-[9px] text-gray-500 uppercase mb-0.5 block">Tag Name</label>
                                                                                    <input value={editName} onChange={(e) => setEditName(e.target.value)}
                                                                                        className="w-full bg-black/60 border border-gray-700 rounded px-2 py-1 text-xs outline-none focus:border-purple-500" autoFocus />
                                                                                </div>
                                                                                <div>
                                                                                    <label className="text-[9px] text-gray-500 uppercase mb-0.5 flex items-center gap-1">
                                                                                        <Video size={8} className="text-green-400" /> Video URL
                                                                                    </label>
                                                                                    <input type="url" value={editVideoUrl} onChange={(e) => setEditVideoUrl(e.target.value)}
                                                                                        placeholder="https://youtube.com/..."
                                                                                        className="w-full bg-black/60 border border-gray-700 rounded px-2 py-1 text-xs outline-none focus:border-green-500" />
                                                                                </div>
                                                                                <div>
                                                                                    <label className="text-[9px] text-gray-500 uppercase mb-0.5 flex items-center gap-1">
                                                                                        <FileText size={8} className="text-amber-400" /> Notes URL
                                                                                    </label>
                                                                                    <input type="url" value={editNotesUrl} onChange={(e) => setEditNotesUrl(e.target.value)}
                                                                                        placeholder="https://drive.google.com/..."
                                                                                        className="w-full bg-black/60 border border-gray-700 rounded px-2 py-1 text-xs outline-none focus:border-amber-500" />
                                                                                </div>
                                                                                <div className="flex gap-1.5">
                                                                                    <button onClick={() => saveEdit(topic)}
                                                                                        className="flex-1 flex items-center justify-center gap-1 bg-green-500/10 text-green-400 rounded py-1 text-[10px] hover:bg-green-500/20">
                                                                                        <Save size={10} /> Save
                                                                                    </button>
                                                                                    <button onClick={cancelEditing}
                                                                                        className="flex-1 flex items-center justify-center gap-1 bg-red-500/10 text-red-400 rounded py-1 text-[10px] hover:bg-red-500/20">
                                                                                        <X size={10} /> Cancel
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            /* Tag Display Mode */
                                                                            <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-white/3 transition-colors">
                                                                                <Tag size={10} className="text-gray-600 flex-shrink-0" />
                                                                                <span className="text-[11px] text-gray-400 flex-1 truncate">{topic.name}</span>
                                                                                {/* Badges */}
                                                                                {topic.remedial_video_url && (
                                                                                    <a href={topic.remedial_video_url} target="_blank" rel="noopener noreferrer"
                                                                                        className="text-green-500 hover:text-green-400" onClick={e => e.stopPropagation()}>
                                                                                        <Video size={9} />
                                                                                    </a>
                                                                                )}
                                                                                {topic.remedial_notes_url && (
                                                                                    <a href={topic.remedial_notes_url} target="_blank" rel="noopener noreferrer"
                                                                                        className="text-amber-500 hover:text-amber-400" onClick={e => e.stopPropagation()}>
                                                                                        <FileText size={9} />
                                                                                    </a>
                                                                                )}
                                                                                {/* Tag actions */}
                                                                                <div className="opacity-0 group-hover/tag:opacity-100 transition-opacity flex gap-0.5">
                                                                                    <button onClick={() => startEditing(topic)}
                                                                                        className="p-0.5 rounded hover:bg-white/10 text-gray-600 hover:text-blue-400">
                                                                                        <Edit2 size={9} />
                                                                                    </button>
                                                                                    <button onClick={() => handleDelete(topic)}
                                                                                        className="p-0.5 rounded hover:bg-white/10 text-gray-600 hover:text-red-400">
                                                                                        <Trash2 size={9} />
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))
                                                            )}
                                                        </div>
                                                        {/* Add Tag Button */}
                                                        <button
                                                            onClick={() => handleAddTag(chapter.id)}
                                                            className="w-full mt-1.5 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-dashed text-[10px] transition-all hover:border-solid"
                                                            style={{ borderColor: branch.border, color: branch.color, background: 'transparent' }}
                                                            onMouseEnter={e => { (e.target as HTMLElement).style.background = branch.bg; }}
                                                            onMouseLeave={e => { (e.target as HTMLElement).style.background = 'transparent'; }}
                                                        >
                                                            <Plus size={10} /> Add Concept Tag
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {branchChapters.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-12 text-gray-700">
                                            <Folder size={28} className="opacity-20 mb-2" />
                                            <span className="text-[10px]">Drop chapters here</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
