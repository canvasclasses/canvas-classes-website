'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, Edit2, Save, X, Play, Volume2, Image as ImageIcon, Beaker, Check, RefreshCw, Circle } from 'lucide-react';
import { Level } from '../ConversionGame';
import gameDataInitial from '../../../data/conversion_game_data.json';
import reagentsData from '../../../data/reagents_data.json';
import LevelEditor from './LevelEditor';
import ArenaPreview from './ArenaPreview';

const AdminDashboard = () => {
    const [levels, setLevels] = useState<Level[]>(gameDataInitial as Level[]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const filteredLevels = levels.filter(l =>
        l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.chapter.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeLevel = levels.find(l => l.id === selectedLevelId) || null;

    const handleSaveAll = async (updatedLevels: Level[]) => {
        setIsSaving(true);
        setSaveStatus('idle');
        try {
            const response = await fetch('/api/organic-wizard/save-levels', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ levels: updatedLevels }),
            });

            if (response.ok) {
                setSaveStatus('success');
                setHasUnsavedChanges(false);
                setTimeout(() => setSaveStatus('idle'), 3000);
            } else {
                setSaveStatus('error');
            }
        } catch (error) {
            console.error('Save failed:', error);
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateLevel = (updatedLevel: Level) => {
        const newLevels = levels.map(l => l.id === updatedLevel.id ? updatedLevel : l);
        setLevels(newLevels);
        setHasUnsavedChanges(true);
        // Removed auto-save to prevent flickering/reload loops
    };

    const handleAddLevel = () => {
        const newId = `new_level_${Date.now()}`;
        const newLevel: Level = {
            id: newId,
            chapter: "Hydrocarbons",
            title: "New Conversion",
            description: "Convert X to Y",
            start_smiles: "C",
            target_smiles: "CC",
            difficulty: "Easy",
            steps: [
                {
                    step_order: 1,
                    reagent_id: "r_hbo_01",
                    reagent_display: "B2H6, H2O2 / OH-",
                    mechanism_hint: "Add hint here"
                }
            ]
        };
        const newLevels = [newLevel, ...levels];
        setLevels(newLevels);
        setSelectedLevelId(newId);
        handleSaveAll(newLevels);
    };

    const handleDeleteLevel = (id: string) => {
        if (confirm('Are you sure you want to delete this level?')) {
            const newLevels = levels.filter(l => l.id !== id);
            setLevels(newLevels);
            if (selectedLevelId === id) setSelectedLevelId(null);
            handleSaveAll(newLevels);
        }
    };

    return (
        <div className="flex h-screen w-full bg-[#0a0a0a] text-slate-300 font-outfit overflow-hidden">
            {/* Sidebar Level List */}
            <div className="w-80 flex-shrink-0 border-r border-white/5 flex flex-col bg-[#0f0f0f]">
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-bold text-white flex items-center gap-2">
                            <Beaker className="text-emerald-500" size={24} />
                            Wizard Admin
                        </h1>
                        <button
                            onClick={handleAddLevel}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white p-1.5 rounded-lg transition-colors"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search levels..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500/50 transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                    {filteredLevels.map((level) => (
                        <div
                            key={level.id}
                            onClick={() => setSelectedLevelId(level.id)}
                            className={`
                                group p-4 rounded-xl mb-1 cursor-pointer transition-all border
                                ${selectedLevelId === level.id
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                    : 'bg-transparent border-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200'
                                }
                            `}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs uppercase tracking-widest opacity-50 font-bold">{level.chapter}</span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteLevel(level.id); }}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <h3 className="font-bold truncate mt-1">{level.title}</h3>
                            <p className="text-xs truncate opacity-60 mt-0.5">{level.description}</p>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-white/5 bg-[#0a0a0a]">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest">
                            <span className="opacity-30">Storage State</span>
                            {hasUnsavedChanges ? (
                                <span className="text-amber-500 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-current" /> Unsaved Draft</span>
                            ) : (
                                <span className="text-emerald-500 flex items-center gap-1"><Check size={10} /> Synced</span>
                            )}
                        </div>

                        <button
                            disabled={!hasUnsavedChanges || isSaving}
                            onClick={() => handleSaveAll(levels)}
                            className={`
                                w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2
                                ${hasUnsavedChanges
                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                                    : 'bg-white/5 text-white/20 cursor-not-allowed'}
                            `}
                        >
                            {isSaving ? (
                                <RefreshCw size={14} className="animate-spin" />
                            ) : (
                                <Save size={14} />
                            )}
                            {isSaving ? 'Processing...' : 'Save All Changes'}
                        </button>

                        {saveStatus === 'error' && (
                            <p className="text-[10px] text-red-500 text-center font-bold">Write Encountered error!</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {activeLevel ? (
                    <div className="flex-1 flex overflow-hidden">
                        {/* Editor Panel */}
                        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                            <LevelEditor
                                level={activeLevel}
                                onUpdate={handleUpdateLevel}
                                reagents={reagentsData}
                            />
                        </div>

                        {/* Live Preview Panel */}
                        <div className="w-[600px] flex-shrink-0 border-l border-white/5 bg-[#0a0a0a] flex flex-col p-6 overflow-y-auto custom-scrollbar">
                            <h2 className="text-sm font-bold uppercase tracking-widest opacity-30 mb-6">Live Arena Preview</h2>
                            <ArenaPreview level={activeLevel} />
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-20">
                        <Beaker size={80} strokeWidth={1} />
                        <p className="mt-4 font-bold text-xl uppercase tracking-widest">Select a level to edit</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
