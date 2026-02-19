'use client';

import { useState, useEffect } from 'react';
import {
    Loader, Plus, Trash2, Edit2, Save, X, Folder, Tag, ChevronDown, ChevronRight,
    Beaker, Atom, Leaf, FlaskConical, Check, AlertCircle
} from 'lucide-react';
import { TAXONOMY_FROM_CSV, type TaxonomyNode } from './taxonomyData_from_csv';

type ChapterType = 'physical' | 'inorganic' | 'organic' | 'practical';

const BRANCHES = [
    { id: 'physical', name: 'Physical Chemistry', icon: Beaker, color: '#8B5CF6' },
    { id: 'inorganic', name: 'Inorganic Chemistry', icon: Atom, color: '#3B82F6' },
    { id: 'organic', name: 'Organic Chemistry', icon: Leaf, color: '#10B981' },
    { id: 'practical', name: 'Practical Chemistry', icon: FlaskConical, color: '#F59E0B' },
];

// CRITICAL: This taxonomy data is from user's CSV - DO NOT OVERWRITE
const NEW_TAXONOMY: TaxonomyNode[] = TAXONOMY_FROM_CSV;

interface EditingNode {
    id: string;
    name: string;
    parent_id: string | null;
    type: 'chapter' | 'topic';
    sequence_order?: number;
    class_level?: 11 | 12;
    chapterType?: ChapterType;
}

export default function TaxonomyPage() {
    const [taxonomy, setTaxonomy] = useState<TaxonomyNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
    const [editingNode, setEditingNode] = useState<EditingNode | null>(null);
    const [newNode, setNewNode] = useState<Partial<TaxonomyNode>>({});
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedChapterType, setSelectedChapterType] = useState<ChapterType>('physical');
    const [selectedClassLevel, setSelectedClassLevel] = useState<11 | 12>(11);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        loadData();
        
        // Listen for showAddChapterForm event from Navbar
        const handleShowAddForm = () => {
            setShowAddForm(true);
        };
        window.addEventListener('showAddChapterForm', handleShowAddForm);
        
        return () => {
            window.removeEventListener('showAddChapterForm', handleShowAddForm);
        };
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setTaxonomy(NEW_TAXONOMY);
        } catch (error) {
            console.error('Error loading taxonomy:', error);
            setMessage({ type: 'error', text: 'Failed to load taxonomy data' });
        } finally {
            setLoading(false);
        }
    };

    const toggleExpandChapter = (chapterId: string) => {
        const newExpanded = new Set(expandedChapters);
        if (newExpanded.has(chapterId)) {
            newExpanded.delete(chapterId);
        } else {
            newExpanded.add(chapterId);
        }
        setExpandedChapters(newExpanded);
    };

    const startEdit = (node: TaxonomyNode) => {
        setEditingNode({
            id: node.id,
            name: node.name,
            parent_id: node.parent_id,
            type: node.type,
            sequence_order: node.sequence_order,
            class_level: node.class_level,
            chapterType: node.chapterType
        });
    };

    const saveEdit = async () => {
        if (!editingNode) return;

        try {
            setTaxonomy(prev => 
                prev.map(node => 
                    node.id === editingNode.id 
                        ? { ...node, ...editingNode }
                        : node
                )
            );

            setEditingNode(null);
            setMessage({ type: 'success', text: 'Node updated successfully' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update node' });
        }
    };

    const deleteNode = async (nodeId: string) => {
        if (!confirm('Are you sure you want to delete this node and all its children?')) return;

        try {
            const removeNodeAndChildren = (id: string, nodes: TaxonomyNode[]): TaxonomyNode[] => {
                return nodes.filter(node => {
                    if (node.id === id) return false;
                    if (node.parent_id === id) return false;
                    return true;
                });
            };

            setTaxonomy(prev => removeNodeAndChildren(nodeId, prev));
            setMessage({ type: 'success', text: 'Node deleted successfully' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete node' });
        }
    };

    const addChapter = async () => {
        if (!newNode.name) {
            setMessage({ type: 'error', text: 'Please enter chapter name' });
            return;
        }

        try {
            const maxOrder = Math.max(...taxonomy.filter(n => n.type === 'chapter').map(n => n.sequence_order || 0), 0);
            const newId = `ch${selectedClassLevel}_${selectedChapterType}_${Date.now()}`;

            const createdNode: TaxonomyNode = {
                id: newId,
                name: newNode.name,
                parent_id: null,
                type: 'chapter',
                sequence_order: maxOrder + 1,
                class_level: selectedClassLevel,
                chapterType: selectedChapterType
            };

            setTaxonomy(prev => [...prev, createdNode]);
            setNewNode({});
            setShowAddForm(false);
            setMessage({ type: 'success', text: 'Chapter added successfully' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to add chapter' });
        }
    };

    const addTag = async (chapterId: string) => {
        const tagName = prompt('Enter concept tag name:');
        if (!tagName) return;

        try {
            const newId = `tag_${chapterId}_${Date.now()}`;
            const createdNode: TaxonomyNode = {
                id: newId,
                name: tagName,
                parent_id: chapterId,
                type: 'topic'
            };

            setTaxonomy(prev => [...prev, createdNode]);
            setMessage({ type: 'success', text: 'Tag added successfully' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to add tag' });
        }
    };

    const getChapterTags = (chapterId: string): TaxonomyNode[] => {
        return taxonomy.filter(node => node.type === 'topic' && node.parent_id === chapterId);
    };

    const getBranchIcon = (branchId: ChapterType) => {
        const branch = BRANCHES.find(b => b.id === branchId);
        return branch ? branch.icon : Folder;
    };

    const getBranchColor = (branchId: ChapterType) => {
        const branch = BRANCHES.find(b => b.id === branchId);
        return branch ? branch.color : '#6B7280';
    };

    const getBranchName = (branchId: ChapterType) => {
        const branch = BRANCHES.find(b => b.id === branchId);
        return branch ? branch.name : branchId;
    };

    const renderChapter = (chapter: TaxonomyNode) => {
        const tags = getChapterTags(chapter.id);
        const isExpanded = expandedChapters.has(chapter.id);
        const isEditing = editingNode?.id === chapter.id;
        const Icon = getBranchIcon(chapter.chapterType || 'physical');
        const color = getBranchColor(chapter.chapterType || 'physical');

        return (
            <div key={chapter.id} className="mb-4 bg-gray-800 rounded-xl shadow-sm border border-gray-700 overflow-hidden">
                <div 
                    className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-750 transition-colors group"
                    onClick={() => toggleExpandChapter(chapter.id)}
                >
                    {isExpanded ? 
                        <ChevronDown className="w-5 h-5 text-gray-500" /> : 
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                    }
                    
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
                        <Icon className="w-5 h-5" style={{ color }} />
                    </div>
                    
                    {isEditing ? (
                        <div className="flex-1 flex gap-2" onClick={(e) => e.stopPropagation()}>
                            <input
                                type="text"
                                value={editingNode.name}
                                onChange={(e) => setEditingNode({ ...editingNode, name: e.target.value })}
                                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                autoFocus
                            />
                            <select
                                value={editingNode.chapterType || 'physical'}
                                onChange={(e) => setEditingNode({ ...editingNode, chapterType: e.target.value as ChapterType })}
                                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                            >
                                <option value="physical">Physical</option>
                                <option value="inorganic">Inorganic</option>
                                <option value="organic">Organic</option>
                                <option value="practical">Practical</option>
                            </select>
                        </div>
                    ) : (
                        <span className="flex-1 font-semibold text-gray-200">{chapter.name}</span>
                    )}
                    
                    <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${color}20`, color }}>
                            {getBranchName(chapter.chapterType || 'physical')}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-400">
                            Class {chapter.class_level}
                        </span>
                        <span className="text-xs text-gray-500">{tags.length} tags</span>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); saveEdit(); }}
                                    className="p-2 hover:bg-green-900/50 rounded-lg transition-colors"
                                    title="Save"
                                >
                                    <Save className="w-4 h-4 text-green-500" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setEditingNode(null); }}
                                    className="p-2 hover:bg-red-900/50 rounded-lg transition-colors"
                                    title="Cancel"
                                >
                                    <X className="w-4 h-4 text-red-500" />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); startEdit(chapter); }}
                                    className="p-2 hover:bg-blue-900/50 rounded-lg transition-colors"
                                    title="Edit Chapter"
                                >
                                    <Edit2 className="w-4 h-4 text-blue-500" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteNode(chapter.id); }}
                                    className="p-2 hover:bg-red-900/50 rounded-lg transition-colors"
                                    title="Delete Chapter"
                                >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-700">
                        <div className="mt-3 space-y-2">
                            {tags.length === 0 ? (
                                <p className="text-sm text-gray-500 py-4 text-center">No concept tags yet</p>
                            ) : (
                                tags.map(tag => (
                                    <div key={tag.id} className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 rounded-lg group">
                                        <Tag className="w-4 h-4 text-gray-500" />
                                        {editingNode?.id === tag.id ? (
                                            <input
                                                type="text"
                                                value={editingNode.name}
                                                onChange={(e) => setEditingNode({ ...editingNode, name: e.target.value })}
                                                className="flex-1 px-2 py-1 bg-gray-600 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                                autoFocus
                                            />
                                        ) : (
                                            <span className="flex-1 text-sm text-gray-300">{tag.name}</span>
                                        )}
                                        
                                        {editingNode?.id === tag.id ? (
                                            <>
                                                <button
                                                    onClick={() => saveEdit()}
                                                    className="p-1 hover:bg-green-900/50 rounded"
                                                >
                                                    <Save className="w-3 h-3 text-green-500" />
                                                </button>
                                                <button
                                                    onClick={() => setEditingNode(null)}
                                                    className="p-1 hover:bg-red-900/50 rounded"
                                                >
                                                    <X className="w-3 h-3 text-red-500" />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                                                <button
                                                    onClick={() => startEdit(tag)}
                                                    className="p-1 hover:bg-blue-900/50 rounded"
                                                >
                                                    <Edit2 className="w-3 h-3 text-blue-500" />
                                                </button>
                                                <button
                                                    onClick={() => deleteNode(tag.id)}
                                                    className="p-1 hover:bg-red-900/50 rounded"
                                                >
                                                    <Trash2 className="w-3 h-3 text-red-500" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                        
                        <button
                            onClick={() => addTag(chapter.id)}
                            className="mt-3 w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="text-sm">Add Concept Tag</span>
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const chapters11 = taxonomy.filter(n => n.type === 'chapter' && n.class_level === 11);
    const chapters12 = taxonomy.filter(n => n.type === 'chapter' && n.class_level === 12);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <Loader className="w-8 h-8 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-400">Loading taxonomy...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 p-6 pt-24">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="bg-gray-800 rounded-xl shadow-sm p-6 mb-6 border border-gray-700">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Chemistry Taxonomy Manager</h1>
                            <p className="text-gray-400 mt-1">Manage chapters and concept tags for JEE Chemistry</p>
                        </div>
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Chapter
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                        {BRANCHES.map(branch => {
                            const BranchIcon = branch.icon;
                            const count = taxonomy.filter(n => n.type === 'chapter' && n.chapterType === branch.id).length;
                            return (
                                <div key={branch.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-700/50 border border-gray-600">
                                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${branch.color}20` }}>
                                        <BranchIcon className="w-5 h-5" style={{ color: branch.color }} />
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold" style={{ color: branch.color }}>{count}</div>
                                        <div className="text-xs text-gray-400">{branch.name}</div>
                                    </div>
                                </div>
                            );
                        })}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-700 border border-gray-600">
                            <div className="p-2 rounded-lg bg-gray-600">
                                <Tag className="w-5 h-5 text-gray-300" />
                            </div>
                            <div>
                                <div className="text-xl font-bold text-gray-300">{taxonomy.filter(n => n.type === 'topic').length}</div>
                                <div className="text-xs text-gray-400">Total Tags</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Message */}
                {message && (
                    <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
                        message.type === 'success' ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-red-900/50 text-red-300 border border-red-700'
                    }`}>
                        {message.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        {message.text}
                    </div>
                )}

                {/* Add Chapter Form */}
                {showAddForm && (
                    <div id="add-chapter-form" className="bg-gray-800 rounded-xl shadow-sm p-6 mb-6 border border-gray-700">
                        <h2 className="text-lg font-semibold mb-4 text-white">Add New Chapter</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-3">
                                <label className="block text-sm font-medium text-gray-300 mb-1">Chapter Name</label>
                                <input
                                    type="text"
                                    value={newNode.name || ''}
                                    onChange={(e) => setNewNode({ ...newNode, name: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                                    placeholder="Enter chapter name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Class Level</label>
                                <select
                                    value={selectedClassLevel}
                                    onChange={(e) => setSelectedClassLevel(parseInt(e.target.value) as 11 | 12)}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                >
                                    <option value={11}>Class 11</option>
                                    <option value={12}>Class 12</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Chapter Type</label>
                                <select
                                    value={selectedChapterType}
                                    onChange={(e) => setSelectedChapterType(e.target.value as ChapterType)}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                >
                                    {BRANCHES.map(branch => (
                                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={addChapter}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Add Chapter
                            </button>
                            <button
                                onClick={() => {
                                    setShowAddForm(false);
                                    setNewNode({});
                                }}
                                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Chapters List */}
                <div className="space-y-8">
                    {/* Class 11 Section */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">11</span>
                            Class 11 Chapters
                            <span className="text-sm font-normal text-gray-500">({chapters11.length} chapters)</span>
                        </h2>
                        <div className="space-y-3">
                            {chapters11.map(chapter => renderChapter(chapter))}
                        </div>
                    </div>

                    {/* Class 12 Section */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">12</span>
                            Class 12 Chapters
                            <span className="text-sm font-normal text-gray-500">({chapters12.length} chapters)</span>
                        </h2>
                        <div className="space-y-3">
                            {chapters12.map(chapter => renderChapter(chapter))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
