import React, { useMemo } from 'react';
import { Reagent } from '../../types/chemihex';
import { motion } from 'framer-motion';

interface ReagentTrayProps {
    reagents: Reagent[];
    onDragStart: (reagentId: string) => void;
}

export const ReagentTray: React.FC<ReagentTrayProps> = ({ reagents, onDragStart }) => {
    // Group reagents by category
    const categories = useMemo(() => {
        const groups: Record<string, Reagent[]> = {};
        reagents.forEach(r => {
            if (!groups[r.category]) groups[r.category] = [];
            groups[r.category].push(r);
        });
        return groups;
    }, [reagents]);

    return (
        <div className="fixed bottom-0 left-0 right-0 h-64 bg-slate-900/90 backdrop-blur-xl border-t border-slate-700 p-4 overflow-x-auto z-50">
            <h3 className="text-white font-bold mb-4 sticky left-0">Reagent Tray</h3>
            <div className="flex gap-8 min-w-max">
                {Object.entries(categories).map(([category, items]) => (
                    <div key={category} className="flex flex-col gap-2 min-w-[200px]">
                        <h4 className="text-teal-400 text-xs uppercase tracking-wider font-bold mb-2 sticky left-0">{category}</h4>
                        <div className="grid grid-cols-1 gap-2">
                            {items.map(reagent => (
                                <div
                                    key={reagent.id}
                                    draggable
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData('reagentId', reagent.id);
                                        onDragStart(reagent.id);
                                    }}
                                    className="
                    bg-slate-800 border border-slate-700 rounded-lg p-3
                    cursor-grab active:cursor-grabbing hover:border-teal-500 hover:bg-slate-750 
                    transition-colors group relative
                  "
                                >
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-bold text-slate-200">{reagent.name}</span>
                                        <span className="text-[10px] text-slate-500">{reagent.id}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                                        {reagent.description}
                                    </p>

                                    {/* Tooltip on Hover */}
                                    <div className="
                    absolute bottom-full left-0 mb-2 w-48 bg-black/90 p-2 rounded 
                    text-xs text-slate-300 opacity-0 group-hover:opacity-100 
                    transition-opacity pointer-events-none z-50 border border-slate-700
                  ">
                                        <div className="font-bold text-teal-400 mb-1">Logic:</div>
                                        Inputs: {reagent.game_logic.valid_inputs.join(', ')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
