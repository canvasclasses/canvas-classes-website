'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Lock, Play, Beaker, ArrowDown, LayoutDashboard } from 'lucide-react';

interface Level {
    id: string;
    title: string;
    description: string;
    difficulty: string;
}

interface LevelSidebarProps {
    levels: Level[];
    currentLevelIndex: number;
    completedLevels: number[];
    onSelectLevel: (index: number) => void;
}

const LevelSidebar: React.FC<LevelSidebarProps> = ({
    levels,
    currentLevelIndex,
    completedLevels,
    onSelectLevel
}) => {
    // Group levels by chapter
    const chapters = [
        "Hydrocarbons",
        "Haloalkanes & Haloarenes",
        "Alcohols, Phenols and Ethers",
        "Aldehydes, Ketones and Carboxylic Acids",
        "Amines",
        "Biomolecules"
    ];

    const groupedLevels = chapters.reduce((acc, chapter) => {
        acc[chapter] = levels.filter((l: any) => l.chapter === chapter);
        return acc;
    }, {} as Record<string, Level[]>);

    // Fallback for levels without chapter or unknown chapter
    const otherLevels = levels.filter((l: any) => !chapters.includes(l.chapter));
    if (otherLevels.length > 0) {
        groupedLevels["Others"] = otherLevels;
        chapters.push("Others");
    }

    const [expandedChapters, setExpandedChapters] = React.useState<string[]>([]);

    // Auto-expand the chapter of the current level on first load
    React.useEffect(() => {
        const currentLevel = levels[currentLevelIndex];
        if (currentLevel && (currentLevel as any).chapter) {
            setExpandedChapters(prev => Array.from(new Set([...prev, (currentLevel as any).chapter])));
        }
    }, [currentLevelIndex, levels]);

    const toggleChapter = (chapter: string) => {
        setExpandedChapters(prev =>
            prev.includes(chapter) ? prev.filter(c => c !== chapter) : [...prev, chapter]
        );
    };

    return (
        <div className="h-full w-full bg-[#1e1e1e] border-r border-[#333] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-[#333]">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Beaker className="text-teal-400" size={24} />
                    Lab Journal
                </h2>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
                    NCERT Conversions
                </p>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
                {chapters.map((chapter) => {
                    const chapterLevels = groupedLevels[chapter] || [];
                    const isExpanded = expandedChapters.includes(chapter);

                    // Skip empty chapters
                    if (chapterLevels.length === 0) return null;

                    return (
                        <div key={chapter} className="mb-4">
                            <button
                                onClick={() => toggleChapter(chapter)}
                                className="w-full flex items-center justify-between px-2 py-3 mb-2 rounded hover:bg-[#2a2a2a] transition-colors group"
                            >
                                <div>
                                    <h3 className="text-sm font-bold text-slate-200 text-left font-outfit tracking-wide uppercase">{chapter}</h3>
                                </div>
                                <div className={`text-slate-600 group-hover:text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                                    <ArrowDown size={14} />
                                </div>
                            </button>

                            {isExpanded && (
                                <div className="space-y-2">
                                    {chapterLevels.map((level, subIndex) => {
                                        // Find global index for callbacks
                                        const globalIndex = levels.findIndex(l => l.id === level.id);
                                        const isActive = globalIndex === currentLevelIndex;
                                        const isCompleted = completedLevels.includes(globalIndex);

                                        return (
                                            <button
                                                key={level.id}
                                                onClick={() => onSelectLevel(globalIndex)}
                                                className={`
                                                    w-full text-left p-3 rounded-xl border transition-all duration-200 relative group
                                                    flex items-center gap-3
                                                    ${isActive
                                                        ? 'bg-[#0a201e] border-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.15)]' // Active: Dark Teal BG + Glow
                                                        : 'bg-[#1e1e1e] border-[#333] hover:border-[#444] hover:bg-[#252525]' // Inactive: Dark Grey
                                                    }
                                                `}
                                            >
                                                {/* Left: Number/Status Box */}
                                                <div className={`
                                                    w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center text-sm font-bold
                                                    ${isActive
                                                        ? 'bg-teal-500 text-black shadow-lg shadow-teal-900/50'
                                                        : isCompleted
                                                            ? 'bg-emerald-900/30 text-emerald-500 border border-emerald-500/30'
                                                            : 'bg-[#2a2a2a] text-slate-500 border border-[#333]'
                                                    }
                                                `}>
                                                    {isCompleted ? <Check size={18} strokeWidth={3} /> : subIndex + 1}
                                                </div>

                                                {/* Middle: Content */}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className={`
                                                        text-sm font-bold font-outfit truncate leading-tight
                                                        ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}
                                                    `}>
                                                        {level.description}
                                                    </h4>
                                                    <p className={`
                                                        text-[11px] mt-1 font-medium truncate
                                                        ${isActive ? 'text-teal-400/80' : 'text-slate-500'}
                                                    `}>
                                                        {level.title}
                                                    </p>
                                                </div>

                                                {/* Right: Play Icon (Only Active) */}
                                                {isActive && (
                                                    <div className="text-teal-500">
                                                        <Play size={16} fill="currentColor" />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="p-4 border-t border-[#333] bg-[#1a1a1a]">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span>Progress</span>
                    <span>{Math.round((completedLevels.length / levels.length) * 100)}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#333] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-teal-500 rounded-full transition-all duration-500"
                        style={{ width: `${(completedLevels.length / levels.length) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default LevelSidebar;
