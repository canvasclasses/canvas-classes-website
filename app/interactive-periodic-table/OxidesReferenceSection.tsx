'use client';

import { Beaker, FlaskConical, Scale } from 'lucide-react';

// Helper to format chemical formulas (subscript numbers)
const formatFormula = (formula: string) => {
    const parts = formula.split(/(\d+)/);
    return parts.map((part, index) => {
        if (/^\d+$/.test(part) && index > 0 && /[A-Za-z]$/.test(parts[index - 1])) {
            return <sub key={index} className="text-[0.85em] align-baseline">{part}</sub>;
        }
        return <span key={index}>{part}</span>;
    });
};

// Complete data from NCERT images
const OXIDES_DATA = {
    acidic: {
        title: 'Acidic Oxides & Hydroxides',
        icon: FlaskConical,
        colorClass: 'red',
        explanation: 'React with bases to form salts and water. Turn blue litmus red.',
        items: [
            {
                group: 'Group 13',
                oxides: ['B₂O₃'],
                note: 'Boron trioxide'
            },
            {
                group: 'Group 14',
                oxides: ['CO₂', 'SiO₂', 'GeO₂'],
                note: 'Higher oxidation state oxides of non-metals'
            },
            {
                group: 'Group 15',
                oxides: ['N₂O₃', 'NO₂', 'N₂O₄', 'N₂O₅', 'P₄O₆', 'P₄O₁₀'],
                note: 'Nitrogen & Phosphorus oxides'
            },
            {
                group: 'Group 16',
                oxides: ['SO₂', 'SO₃', 'SeO₂', 'SeO₃', 'TeO₃'],
                note: 'Sulfur, Selenium, Tellurium oxides'
            },
            {
                group: 'Group 17',
                oxides: ['Cl₂O₇'],
                note: 'Dichlorine heptoxide'
            },
            {
                group: 'Transition Metals (Highest Oxidation)',
                oxides: ['Mn₂O₇', 'CrO₃'],
                note: 'Manganese(VII) oxide, Chromium(VI) oxide'
            }
        ]
    },
    basic: {
        title: 'Basic Oxides & Hydroxides',
        icon: Beaker,
        colorClass: 'blue',
        explanation: 'React with acids to form salts and water. Turn red litmus blue.',
        items: [
            {
                group: 's-Block Metals',
                oxides: ['Na₂O', 'K₂O', 'MgO', 'CaO', 'SrO', 'BaO'],
                note: 'Alkali & Alkaline Earth metal oxides'
            },
            {
                group: 'Group 13 (Heavy Metals)',
                oxides: ['In₂O₃', 'Tl₂O₃'],
                note: 'Indium & Thallium oxides'
            },
            {
                group: 'Group 15 (Heavy Metals)',
                oxides: ['Bi₂O₃'],
                note: 'Bismuth(III) oxide'
            },
            {
                group: 'Transition Metals (Lowest Oxidation)',
                oxides: ['CrO', 'V₂O₃'],
                note: 'Chromium(II) oxide, Vanadium(III) oxide'
            },
            {
                group: 'Lanthanoids',
                oxides: ['M₂O₃', 'M(OH)₃'],
                note: 'Lanthanoid oxides and hydroxides'
            }
        ]
    },
    amphoteric: {
        title: 'Amphoteric Oxides & Hydroxides',
        icon: Scale,
        colorClass: 'violet',
        explanation: 'React with both acids and bases. Show dual behavior.',
        items: [
            {
                group: 'Group 13',
                oxides: ['Al₂O₃', 'Ga₂O₃'],
                note: 'Aluminium & Gallium oxides'
            },
            {
                group: 'Group 14',
                oxides: ['SnO', 'SnO₂', 'PbO', 'PbO₂'],
                note: 'Tin & Lead oxides'
            },
            {
                group: 'Group 15',
                oxides: ['As₂O₃', 'As₂O₅', 'Sb₂O₃', 'Sb₂O₅'],
                note: 'Arsenic & Antimony oxides'
            },
            {
                group: 'Transition Metals (Intermediate Oxidation)',
                oxides: ['Cr₂O₃'],
                note: 'Chromium(III) oxide'
            },
            {
                group: 'Special Cases',
                oxides: ['V₂O₅', 'BeO', 'ZnO'],
                note: 'V₂O₅ predominantly acidic, BeO & ZnO from diagonal relationship'
            }
        ]
    }
};

export default function OxidesReferenceSection() {
    const renderSection = (key: 'acidic' | 'basic' | 'amphoteric') => {
        const data = OXIDES_DATA[key];
        const Icon = data.icon;
        
        const colorMap = {
            red: {
                headerText: 'text-red-100',
                headerBg: 'bg-gradient-to-br from-red-900/40 to-red-800/30',
                border: 'border-red-800/40',
                cardBg: 'bg-gray-800/40',
                iconBg: 'bg-red-900/50',
                accent: 'border-l-red-500',
                dot: 'bg-red-400',
                formulaBg: 'bg-gray-700/60',
                formulaBorder: 'border-gray-600/50',
                formulaHover: 'hover:bg-gray-600/60 hover:border-gray-500',
                hoverBg: 'hover:bg-gray-700/30'
            },
            blue: {
                headerText: 'text-blue-100',
                headerBg: 'bg-gradient-to-br from-blue-900/40 to-blue-800/30',
                border: 'border-blue-800/40',
                cardBg: 'bg-gray-800/40',
                iconBg: 'bg-blue-900/50',
                accent: 'border-l-blue-500',
                dot: 'bg-blue-400',
                formulaBg: 'bg-gray-700/60',
                formulaBorder: 'border-gray-600/50',
                formulaHover: 'hover:bg-gray-600/60 hover:border-gray-500',
                hoverBg: 'hover:bg-gray-700/30'
            },
            violet: {
                headerText: 'text-violet-100',
                headerBg: 'bg-gradient-to-br from-violet-900/40 to-violet-800/30',
                border: 'border-violet-800/40',
                cardBg: 'bg-gray-800/40',
                iconBg: 'bg-violet-900/50',
                accent: 'border-l-violet-500',
                dot: 'bg-violet-400',
                formulaBg: 'bg-gray-700/60',
                formulaBorder: 'border-gray-600/50',
                formulaHover: 'hover:bg-gray-600/60 hover:border-gray-500',
                hoverBg: 'hover:bg-gray-700/30'
            }
        };

        const colors = colorMap[data.colorClass as keyof typeof colorMap];

        return (
            <div className={`flex-1 min-w-[320px] ${colors.cardBg} rounded-xl border ${colors.border} overflow-hidden backdrop-blur-sm`}>
                {/* Header */}
                <div className={`px-4 py-3 ${colors.headerBg} border-b ${colors.border} flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${colors.iconBg}`}>
                            <Icon size={18} className={colors.headerText} />
                        </div>
                        <h3 className={`text-base font-bold ${colors.headerText}`}>{data.title}</h3>
                    </div>
                </div>
                
                {/* Explanation */}
                <div className="px-4 py-2 bg-gray-900/30 border-b border-gray-700/30">
                    <p className="text-sm text-gray-400 italic">{data.explanation}</p>
                </div>

                {/* Content */}
                <div className="p-3 space-y-3">
                    {data.items.map((item, idx) => (
                        <div 
                            key={idx} 
                            className={`${colors.accent} border-l-2 pl-3 py-2 ${colors.hoverBg} transition-all rounded-r`}
                        >
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    {item.group}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-1.5">
                                {item.oxides.map((oxide, oIdx) => (
                                    <span 
                                        key={oIdx}
                                        className={`font-sans text-base text-gray-200 ${colors.formulaBg} border ${colors.formulaBorder} ${colors.formulaHover} px-2 py-0.5 rounded transition-all cursor-default`}
                                    >
                                        {formatFormula(oxide)}
                                    </span>
                                ))}
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed">{item.note}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="mt-8 px-2 sm:px-0">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
                {/* Main Header */}
                <div className="px-5 py-4 border-b border-gray-700 bg-gray-700/30">
                    <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                        <span className="text-2xl">🧪</span>
                        Nature of Oxides & Hydroxides
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                        Reference guide for Acidic, Basic, and Amphoteric compounds
                    </p>
                </div>

                {/* Three Column Layout */}
                <div className="p-4 md:p-6">
                    <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
                        {renderSection('acidic')}
                        {renderSection('basic')}
                        {renderSection('amphoteric')}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-gray-700 bg-gray-700/20">
                    <p className="text-center text-gray-500 text-xs">
                        Based on NCERT Chemistry • Acidic oxides react with bases, Basic oxides react with acids, Amphoteric oxides react with both
                    </p>
                </div>
            </div>
        </div>
    );
}
