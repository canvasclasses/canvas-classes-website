'use client';

import { useState } from 'react';
import { kspData, categories } from '../lib/kspData';
import KspTable from './components/KspTable';
import KspGraph from './components/KspGraph';
import SolubilityCalculator from './components/SolubilityCalculator';
import ComparisonTool from './components/ComparisonTool';
import CommonIonSimulation from './components/CommonIonSimulation';
import SolubilityFAQ from './components/SolubilityFAQ';
import SolubilityExplanation from './components/SolubilityExplanation';
import QuizMode from './components/QuizMode';
import { Sparkles, Calculator, ArrowRight, FlaskConical } from 'lucide-react';
import Link from 'next/link';

type Tab = 'graph' | 'table' | 'calculator' | 'compare' | 'quiz' | 'simulation';

export default function KspCalculatorClient() {
    const [activeTab, setActiveTab] = useState<Tab>('graph');

    const tabs: { id: Tab; label: string; icon: string | React.ReactNode }[] = [
        { id: 'graph', label: 'Visual Graph', icon: '📈' },
        { id: 'table', label: 'Data Table', icon: '📊' },
        { id: 'simulation', label: 'Simulation', icon: <FlaskConical size={18} /> },
        { id: 'calculator', label: 'Calculator', icon: '🧮' },
        { id: 'compare', label: 'Compare', icon: '⚖️' },
        { id: 'quiz', label: 'Quiz', icon: '❓' },
    ];

    return (
        <main className="min-h-screen bg-[#0d1117] text-white">
            {/* Hero Header */}
            <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent" />
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute top-40 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/40 bg-purple-500/10 mb-6">
                        <Sparkles size={16} className="text-purple-400" />
                        <span className="text-sm font-medium text-purple-400">NCERT Ksp Data</span>
                    </div>

                    {/* Main Title with Gradient */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                            Solubility Product (Ksp) Calculator
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-8">
                        Interactive Ksp calculator with 70+ NCERT salts. Calculate molar solubility,
                        compare salts, and master precipitation for JEE & NEET.
                    </p>

                    {/* CTA Pills */}
                    <div className="flex flex-wrap justify-center gap-3">
                        <button
                            onClick={() => setActiveTab('graph')}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full text-white font-medium hover:from-purple-500 hover:to-violet-500 transition-all shadow-lg shadow-purple-500/25"
                        >
                            <Calculator size={18} />
                            Explore Ksp Data
                        </button>
                        <Link href="/periodic-trends" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-800/80 border border-gray-700 rounded-full text-gray-300 font-medium hover:bg-gray-700 hover:text-white transition-all">
                            Periodic Trends
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Quick Stats */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-10 hidden md:block">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Salts', value: `${kspData.length}`, desc: 'From NCERT' },
                        { label: 'Anion Types', value: `${categories.length}`, desc: 'Categories' },
                        { label: 'Ksp Range', value: '10⁻⁵⁰ — 10⁻⁵', desc: 'NCERT Values' },
                        { label: 'Tools', value: '4', desc: 'Interactive' },
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-gray-900/60 rounded-xl border border-gray-700/50 p-4 text-center backdrop-blur-sm">
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <div className="text-sm text-gray-400">{stat.label}</div>
                            <div className="text-xs text-gray-500">{stat.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Tab Navigation - Modern Pill Style */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
                <div className="bg-white/5 backdrop-blur-xl rounded-full border border-white/10 p-1.5 inline-flex gap-1 shadow-xl shadow-black/20">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={`relative flex items-center gap-2.5 px-6 py-3 font-medium transition-all duration-300 whitespace-nowrap text-base rounded-full
                                ${activeTab === tab.id
                                    ? 'bg-white text-gray-900 shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <span className="text-lg">{typeof tab.icon === 'string' ? tab.icon : tab.icon}</span>
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Content */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                {activeTab === 'graph' && (
                    <div className="space-y-16">
                        <KspGraph salts={kspData} />
                        <SolubilityExplanation />
                    </div>
                )}
                {activeTab === 'table' && <KspTable salts={kspData} categories={categories} />}
                {activeTab === 'simulation' && <CommonIonSimulation />}
                {activeTab === 'calculator' && <SolubilityCalculator salts={kspData} />}
                {activeTab === 'compare' && <ComparisonTool salts={kspData} />}
                {activeTab === 'quiz' && <QuizMode salts={kspData} />}
            </section>

            {/* Global FAQ Section */}
            <section className="border-t border-gray-800 bg-[#0d1117]/50 pt-16 pb-20">
                <SolubilityFAQ />
            </section>

        </main>
    );
}
