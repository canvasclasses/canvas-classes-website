import React from 'react';
import { Reagent } from '../../types/chemihex';
import { motion } from 'framer-motion';
import { FlaskConical, Info, AlertTriangle } from 'lucide-react';

interface ReagentCardProps {
    reagent: Reagent;
    onClick?: () => void;
    compact?: boolean;
}

export const ReagentCard: React.FC<ReagentCardProps> = ({ reagent, onClick, compact = false }) => {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`
        relative overflow-hidden cursor-pointer
        bg-slate-800/90 backdrop-blur-md border border-slate-700
        rounded-xl shadow-xl hover:shadow-2xl hover:border-teal-500/50 transition-all
        flex flex-col
        ${compact ? 'w-32 h-40 p-2' : 'w-56 h-80 p-4'}
      `}
        >
            {/* Card Header (Category Color) */}
            <div className={`absolute top-0 left-0 w-full h-1.5 
          ${reagent.category.includes('Oxid') ? 'bg-orange-500' :
                    reagent.category.includes('Reduc') ? 'bg-blue-500' :
                        reagent.category.includes('Bond') ? 'bg-green-500' : 'bg-purple-500'}
      `} />

            {/* Basic Info */}
            <div className="mt-2 flex items-start justify-between">
                <div className={`font-bold text-white ${compact ? 'text-xs' : 'text-lg leading-tight'}`}>
                    {reagent.name}
                </div>
                {!compact && <span className="text-[10px] text-slate-500 uppercase font-mono">{reagent.id}</span>}
            </div>

            <div className={`text-slate-400 font-medium ${compact ? 'text-[9px] mt-1' : 'text-xs mt-1 mb-2 uppercase tracking-wider'}`}>
                {reagent.category}
            </div>

            {/* Visual / Icon Placeholder */}
            <div className={`
        flex items-center justify-center bg-slate-900/50 rounded-lg border border-slate-700/50
        ${compact ? 'flex-1 my-1' : 'h-24 my-2'}
      `}>
                <FlaskConical className={`text-slate-600 ${compact ? 'w-6 h-6' : 'w-10 h-10'}`} />
            </div>

            {/* Description / Lore */}
            {!compact && (
                <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                    <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                        {reagent.description}
                    </p>
                    <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                        <div className="text-[10px] text-teal-400 font-bold mb-1 flex items-center gap-1">
                            <Info className="w-3 h-3" /> HINT
                        </div>
                        <p className="text-[10px] text-slate-400 italic">"{reagent.hint}"</p>
                    </div>
                    {reagent.exception && (
                        <div className="mt-2 text-[10px] text-red-300 flex items-start gap-1">
                            <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                            <span>{reagent.exception}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Compact Description (Line Clamp) */}
            {compact && (
                <p className="text-[9px] text-slate-400 line-clamp-3 leading-tight">
                    {reagent.description}
                </p>
            )}

        </motion.div>
    );
};
