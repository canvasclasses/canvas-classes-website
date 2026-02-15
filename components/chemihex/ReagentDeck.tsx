import React, { useState } from 'react';
import { Reagent } from '../../types/chemihex';
import { ReagentCard } from './ReagentCard';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen } from 'lucide-react';

interface ReagentDeckProps {
    reagents: Reagent[];
    onDragStart: (reagentId: string) => void;
}

export const ReagentDeck: React.FC<ReagentDeckProps> = ({ reagents, onDragStart }) => {
    const [selectedReagent, setSelectedReagent] = useState<Reagent | null>(null);

    // Filter categories
    const categories = Array.from(new Set(reagents.map(r => r.category)));
    const [activeCategory, setActiveCategory] = useState<string>('All');

    const filteredReagents = activeCategory === 'All'
        ? reagents
        : reagents.filter(r => r.category === activeCategory);

    return (
        <div className="h-full flex flex-col bg-slate-900 border-t border-slate-700 relative z-20">

            {/* Category Tabs */}
            <div className="flex items-center gap-2 p-4 pb-2 overflow-x-auto border-b border-slate-800 custom-scrollbar">
                <button
                    onClick={() => setActiveCategory('All')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors whitespace-nowrap
                ${activeCategory === 'All' ? 'bg-teal-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}
            `}
                >
                    ALL CARDS
                </button>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-colors whitespace-nowrap
                    ${activeCategory === cat ? 'bg-teal-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}
                `}
                    >
                        {cat.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Deck Scroll Area */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 relative">
                <div className="flex gap-4 min-w-max pb-4 px-4 items-center h-full">
                    {filteredReagents.map(reagent => (
                        <div
                            key={reagent.id}
                            className="relative group perspective-1000"
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData('reagentId', reagent.id);
                                onDragStart(reagent.id);
                            }}
                        >
                            <ReagentCard
                                reagent={reagent}
                                compact={true}
                                onClick={() => setSelectedReagent(reagent)}
                            />

                            {/* Drag Hint Overlay */}
                            <div className="absolute inset-0 bg-teal-500/20 opacity-0 group-hover:opacity-100 
                                    transition-opacity rounded-xl flex items-center justify-center pointer-events-none">
                                <span className="bg-black/80 text-teal-400 text-[10px] font-bold px-2 py-1 rounded">
                                    DRAG TO ARENA
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Full Detail Modal */}
            <AnimatePresence>
                {selectedReagent && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-lg p-6 flex items-center justify-center"
                    >
                        <div className="relative max-w-2xl w-full h-full flex gap-8 items-center bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl">
                            <button
                                onClick={() => setSelectedReagent(null)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Large Card View */}
                            <div className="shrink-0 scale-125 origin-center">
                                <ReagentCard reagent={selectedReagent} />
                            </div>

                            {/* Extended Details */}
                            <div className="flex-1 space-y-4">
                                <h2 className="text-3xl font-black text-white mb-2">{selectedReagent.name}</h2>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-black/40 p-3 rounded-lg border border-slate-700">
                                        <h4 className="text-xs text-teal-400 font-bold uppercase mb-1">Type</h4>
                                        <p className="text-sm text-slate-200">{selectedReagent.category}</p>
                                    </div>
                                    <div className="bg-black/40 p-3 rounded-lg border border-slate-700">
                                        <h4 className="text-xs text-teal-400 font-bold uppercase mb-1">Mechanism</h4>
                                        <p className="text-xs text-slate-300 italic">{selectedReagent.game_logic.mechanism_note}</p>
                                    </div>
                                </div>

                                <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
                                    <h4 className="text-xs text-orange-400 font-bold uppercase mb-2 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" /> Valid Inputs
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedReagent.game_logic.valid_inputs.map(input => (
                                            <span key={input} className="bg-slate-700 text-slate-200 text-xs px-2 py-1 rounded-full border border-slate-600">
                                                {input.replace(/_/g, ' ')}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};
