'use client';

import { useState, useEffect } from 'react';
import { getTaxonomy, saveTaxonomyNode, deleteTaxonomyNode } from '../../actions';
import { TaxonomyNode } from '../../types';
import { Loader, Plus, Trash2, Edit2, Save, X, Folder, Tag, ChevronRight } from 'lucide-react';

export default function TaxonomyPage() {
    const [nodes, setNodes] = useState<TaxonomyNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
    const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    // Load Data
    const loadData = async () => {
        setLoading(true);
        const data = await getTaxonomy();
        setNodes(data);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    // Derived State
    const chapters = nodes.filter(n => n.type === 'chapter');
    const tags = selectedChapterId ? nodes.filter(n => n.parent_id === selectedChapterId) : [];

    // Actions
    const handleAddChapter = async () => {
        const name = prompt("Enter Chapter Name:");
        if (!name) return;

        const id = `chapter_${name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')}`;
        const newNode: TaxonomyNode = { id, name, type: 'chapter', parent_id: null };

        await saveTaxonomyNode(newNode);
        await loadData();
    };

    const handleAddTag = async () => {
        if (!selectedChapterId) return;
        const name = prompt("Enter Tag Name:");
        if (!name) return;

        // Auto-generate tag ID
        const chapter = chapters.find(c => c.id === selectedChapterId);
        const prefix = chapter?.name.split(' ')[0].toUpperCase().substring(0, 4) || 'TAG';
        const suffix = name.toUpperCase().replace(/[^A-Z0-9]+/g, '_');
        const id = `TAG_${prefix}_${suffix}`;

        const newNode: TaxonomyNode = { id, name, type: 'topic', parent_id: selectedChapterId };

        await saveTaxonomyNode(newNode);
        await loadData();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This might break questions using this tag.")) return;
        const result = await deleteTaxonomyNode(id);
        if (!result.success) {
            alert(`Error: ${result.message}`);
            return;
        }
        if (selectedChapterId === id) setSelectedChapterId(null);
        await loadData();
    };

    const startEditing = (node: TaxonomyNode) => {
        setEditingNodeId(node.id);
        setEditName(node.name);
    };

    const saveEdit = async (node: TaxonomyNode) => {
        if (editName.trim() !== node.name) {
            await saveTaxonomyNode({ ...node, name: editName });
            await loadData();
        }
        setEditingNodeId(null);
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                        Taxonomy Manager
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Manage Chapters and Concept Tags</p>
                </div>
                <button
                    onClick={handleAddChapter}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg font-bold transition-all"
                >
                    <Plus size={18} /> Add Chapter
                </button>
            </header>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader className="animate-spin text-purple-500" size={40} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[70vh]">

                    {/* Chapter List (Sidebar) */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-gray-800 font-bold text-gray-400 uppercase text-xs flex justify-between items-center">
                            <span>Chapters ({chapters.length})</span>
                        </div>
                        <div className="overflow-y-auto flex-1 p-2 space-y-1">
                            {chapters.map(chapter => (
                                <div
                                    key={chapter.id}
                                    onClick={() => setSelectedChapterId(chapter.id)}
                                    className={`p-3 rounded-lg cursor-pointer flex items-center justify-between group transition-all ${selectedChapterId === chapter.id
                                        ? 'bg-purple-900/20 border border-purple-500/30 text-purple-300'
                                        : 'hover:bg-gray-800 text-gray-400 hover:text-white border border-transparent'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Folder size={16} className={selectedChapterId === chapter.id ? 'text-purple-400' : 'text-gray-600'} />
                                        <span className="text-sm font-medium truncate">{chapter.name}</span>
                                    </div>
                                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); startEditing(chapter); }}
                                            className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-blue-400"
                                        >
                                            <Edit2 size={12} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(chapter.id); }}
                                            className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-red-400"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tag Editor (Main Panel) */}
                    <div className="md:col-span-2 bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden flex flex-col">
                        {selectedChapterId ? (
                            <>
                                <div className="p-4 border-b border-gray-800 bg-black/20 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Folder size={18} className="text-purple-500" />
                                        <span className="font-bold text-lg">
                                            {chapters.find(c => c.id === selectedChapterId)?.name}
                                        </span>
                                        <ChevronRight size={16} className="text-gray-600" />
                                        <span className="text-sm text-gray-400">{tags.length} Tags</span>
                                    </div>
                                    <button
                                        onClick={handleAddTag}
                                        className="flex items-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                                    >
                                        <Plus size={14} /> Add Concept Tag
                                    </button>
                                </div>

                                <div className="p-4 overflow-y-auto flex-1">
                                    {tags.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-4">
                                            <Tag size={48} className="opacity-20" />
                                            <p>No tags in this chapter yet.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                            {tags.map(tag => (
                                                <div
                                                    key={tag.id}
                                                    className="bg-black/40 border border-gray-800 p-3 rounded-lg flex items-center justify-between group hover:border-gray-700 transition"
                                                >
                                                    {editingNodeId === tag.id ? (
                                                        <div className="flex-1 flex gap-2">
                                                            <input
                                                                value={editName}
                                                                onChange={(e) => setEditName(e.target.value)}
                                                                className="flex-1 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm outline-none focus:border-purple-500"
                                                                autoFocus
                                                            />
                                                            <button
                                                                onClick={() => saveEdit(tag)}
                                                                className="p-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30"
                                                            >
                                                                <Save size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingNodeId(null)}
                                                                className="p-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="flex flex-col overflow-hidden">
                                                                <span className="font-medium text-sm truncate text-gray-300">{tag.name}</span>
                                                                <span className="text-[10px] text-gray-600 font-mono truncate">{tag.id}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={() => startEditing(tag)}
                                                                    className="p-1.5 hover:bg-gray-800 rounded text-gray-500 hover:text-blue-400"
                                                                >
                                                                    <Edit2 size={12} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(tag.id)}
                                                                    className="p-1.5 hover:bg-gray-800 rounded text-gray-500 hover:text-red-400"
                                                                >
                                                                    <Trash2 size={12} />
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-4">
                                <Folder size={64} className="opacity-20" />
                                <p>Select a chapter to manage its tags</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
