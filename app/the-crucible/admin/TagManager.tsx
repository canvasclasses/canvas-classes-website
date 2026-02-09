import { useState, useEffect, useMemo } from 'react';
import { Plus, X, Tag, Sparkles } from 'lucide-react';
import { Question, WeightedTag } from '../types';
import { TaxonomyNode } from '../actions';

interface TagManagerProps {
    question: Question;
    onUpdate: (field: keyof Question, value: any) => void;
    chapterName: string;
    taxonomy: TaxonomyNode[];
}

export default function TagManager({ question, onUpdate, chapterName, taxonomy }: TagManagerProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [selectedTagId, setSelectedTagId] = useState('');
    const [customTagName, setCustomTagName] = useState('');
    const [weight, setWeight] = useState('100');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Derived state for available tags
    const availableTags = useMemo(() => {
        if (!chapterName) return [];

        // Find matching chapter node (Normalize for safety)
        const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
        const targetSlug = normalize(chapterName);

        const chapterNode = taxonomy.find(n =>
            n.type === 'chapter' && (normalize(n.name) === targetSlug || n.id === `chapter_${targetSlug}`)
        );

        if (!chapterNode) return [];

        // Get children tags
        return taxonomy.filter(n => n.type === 'topic' && n.parent_id === chapterNode.id);
    }, [chapterName, taxonomy]);

    const currentTags = question.conceptTags || [];

    const handleAutoAnalyze = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            const text = (question.textMarkdown + ' ' + (question.solution?.textSolutionLatex || '')).toLowerCase();
            const foundTags: WeightedTag[] = [];

            // 1. Check Chapter Concepts
            availableTags.forEach(tag => {
                // Simple keyword matching - splitting tag name into words for better recall? 
                // No, whole phrase is safer, or at least significant parts.
                if (text.includes(tag.name.toLowerCase())) {
                    foundTags.push({ tagId: tag.id, weight: 0.5 });
                }
            });

            // 2. Check Generic Skills
            if (text.includes('calculate') || text.includes('find the value') || question.questionType === 'NVT') {
                foundTags.push({ tagId: 'TAG_SKILL_CALCULATION', weight: 0.3 });
            }

            // 3. Normalize Weights
            if (foundTags.length > 0) {
                const calcTag = foundTags.find(t => t.tagId === 'TAG_SKILL_CALCULATION');
                const concepts = foundTags.filter(t => t.tagId !== 'TAG_SKILL_CALCULATION');

                if (calcTag && concepts.length > 0) {
                    // Calc gets 0.3, rest get 0.7 split
                    const conceptWeight = 0.7 / concepts.length;
                    concepts.forEach(c => c.weight = parseFloat(conceptWeight.toFixed(2)));
                    calcTag.weight = 0.3; // Explicit
                } else if (concepts.length > 0) {
                    const w = 1.0 / concepts.length;
                    concepts.forEach(c => c.weight = parseFloat(w.toFixed(2)));
                }

                onUpdate('conceptTags', foundTags);

                // If Primary Tag is empty, pick the first concept
                if (!question.tagId && concepts.length > 0) {
                    onUpdate('tagId', concepts[0].tagId);
                }
            } else {
                // No matches
                alert("No specific concepts detected from the current keyword list.");
            }

            setIsAnalyzing(false);
        }, 600);
    };

    const handleAdd = () => {
        const tagId = customTagName.trim() ? `TAG_CUSTOM_${customTagName.trim().toUpperCase().replace(/\s+/g, '_')}` : selectedTagId;
        const finalWeight = parseInt(weight) / 100;

        if (!tagId) return;

        // Check format
        const newTag: WeightedTag = {
            tagId: tagId,
            weight: isNaN(finalWeight) ? 1.0 : finalWeight
        };

        // Add to list
        const updatedTags = [...currentTags, newTag];
        onUpdate('conceptTags', updatedTags);

        // If it's the first tag, or user wants, maybe set primary? 
        // For now, we just add to the breakdown. If primary is empty, set it.
        if (!question.tagId) {
            onUpdate('tagId', tagId);
        }

        // Reset
        setIsAdding(false);
        setSelectedTagId('');
        setCustomTagName('');
        setWeight('100');
    };

    const handleRemove = (index: number) => {
        const updatedTags = currentTags.filter((_, i) => i !== index);
        onUpdate('conceptTags', updatedTags);
    };

    const getTagName = (id: string) => {
        if (id.startsWith('TAG_CUSTOM_')) {
            return id.replace('TAG_CUSTOM_', '').replace(/_/g, ' ');
        }
        return taxonomy.find(t => t.id === id)?.name || id;
    };

    return (
        <div className="bg-black/20 rounded p-2.5 border border-gray-800 space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="text-[10px] uppercase font-bold text-gray-500 flex items-center gap-1">
                    <Tag size={10} /> Conccept Breakdown
                </h4>
                <div className="text-[9px] text-gray-600 flex items-center gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleAutoAnalyze(); }}
                        disabled={isAnalyzing}
                        className="text-[9px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 disabled:opacity-50"
                        title="Auto-detect concepts from text"
                    >
                        <Sparkles size={9} className={isAnalyzing ? "animate-spin" : ""} />
                        {isAnalyzing ? "Analyzing..." : "Auto-Analyze"}
                    </button>
                    <span>|</span>
                    Total: {(currentTags.reduce((acc, t) => acc + t.weight, 0) * 100).toFixed(0)}%
                </div>
            </div>

            {/* Current Tags List */}
            <div className="flex flex-wrap gap-2">
                {currentTags.length === 0 && (
                    <span className="text-[10px] text-gray-500 italic">No concepts tagged.</span>
                )}

                {currentTags.map((ct, idx) => (
                    <div
                        key={idx}
                        className="group flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/30 rounded px-2 py-1 transition-all hover:bg-purple-500/20"
                    >
                        <span className="text-[10px] text-purple-200">
                            {getTagName(ct.tagId)}
                        </span>
                        <span className="text-[9px] font-bold text-purple-400 bg-purple-500/10 px-1 rounded border border-purple-500/20">
                            {(ct.weight * 100).toFixed(0)}%
                        </span>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleRemove(idx); }}
                            className="opacity-0 group-hover:opacity-100 text-purple-400 hover:text-red-400 transition-opacity"
                        >
                            <X size={10} />
                        </button>
                    </div>
                ))}

                {/* Add Button */}
                {!isAdding && (
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsAdding(true); }}
                        className="flex items-center gap-1 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-[10px] text-gray-400 hover:text-white hover:border-gray-500 transition"
                    >
                        <Plus size={10} /> Add
                    </button>
                )}
            </div>

            {/* Add Tag Form */}
            {isAdding && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-200 bg-gray-900/50 p-2 rounded border border-gray-700 mt-2" onClick={e => e.stopPropagation()}>
                    <div className="grid grid-cols-[1fr_60px] gap-2 mb-2">
                        {/* Tag Selector */}
                        <div className="space-y-1">
                            <select
                                value={selectedTagId}
                                onChange={(e) => {
                                    setSelectedTagId(e.target.value);
                                    if (e.target.value === 'custom') setCustomTagName('');
                                }}
                                className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-[10px] text-gray-200 outline-none focus:border-purple-500"
                            >
                                <option value="">Select Concept...</option>
                                {availableTags.map(tag => (
                                    <option key={tag.id} value={tag.id}>{tag.name}</option>
                                ))}
                                <option value="custom" className="font-bold text-indigo-400">+ New Custom Tag</option>
                            </select>

                            {selectedTagId === 'custom' && (
                                <input
                                    type="text"
                                    placeholder="Enter custom tag name..."
                                    value={customTagName}
                                    onChange={(e) => setCustomTagName(e.target.value)}
                                    className="w-full bg-gray-800 border border-indigo-500/50 rounded px-2 py-1 text-[10px] text-indigo-300 outline-none placeholder:text-gray-600"
                                    autoFocus
                                />
                            )}
                        </div>

                        {/* Weight Input */}
                        <div>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-[10px] text-right font-mono outline-none focus:border-purple-500"
                                />
                                <span className="absolute right-4 top-1 text-[10px] text-gray-500">%</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setIsAdding(false)}
                            className="px-2 py-1 rounded text-[10px] text-gray-500 hover:text-gray-300 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAdd}
                            disabled={!selectedTagId && !customTagName}
                            className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add Tag
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
