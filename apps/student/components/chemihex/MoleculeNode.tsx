import React from 'react';
import { MoleculeNodeData } from '../../types/chemihex';
import { FlaskConical } from 'lucide-react';

interface MoleculeNodeProps {
    data: MoleculeNodeData;
    feedbackStatus?: 'success' | 'error' | null;
    onClick?: () => void;
}

export const MoleculeNode: React.FC<MoleculeNodeProps> = ({ data, feedbackStatus, onClick }) => {
    // Hexagon styling calculations could go here, for now using a card
    return (
        <div
            className={`
        relative w-32 h-32 flex flex-col items-center justify-center p-2
        bg-slate-800/80 backdrop-blur-md rounded-2xl border-2 
        transition-all duration-300 transform hover:scale-105 cursor-pointer
        ${feedbackStatus === 'success' ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : ''}
        ${feedbackStatus === 'error' ? 'border-red-500 animate-shake shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'border-slate-600'}
      `}
            onClick={onClick}
        >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 px-2 py-1 rounded-full">
                <FlaskConical className="w-4 h-4 text-teal-400" />
            </div>

            <h3 className="text-white font-bold text-center text-sm mb-1">{data.name}</h3>
            <code className="text-[10px] text-slate-400 bg-slate-900 px-1 rounded">{data.smiles}</code>
            <div className="text-[9px] text-teal-500 mt-1 uppercase tracking-widest">{data.type.replace(/_/g, ' ')}</div>
        </div>
    );
};
