'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Search, FileText, Download, ExternalLink, Filter } from 'lucide-react';

interface SamplePaper {
    id: string;
    title: string;
    subject: 'Chemistry' | 'Physics' | 'Maths' | 'Biology';
    year: string;
    pdfUrl: string;
    solutionUrl?: string;
}

export default function SamplePapersPage() {
    const [papers, setPapers] = useState<SamplePaper[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState<string>('All');
    const [selectedYear, setSelectedYear] = useState<string>('All');

    useEffect(() => {
        const fetchPapers = async () => {
            try {
                const res = await fetch('/api/sample-papers');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setPapers(data);
                }
            } catch (error) {
                console.error('Failed to load sample papers', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPapers();
    }, []);

    // Extract unique years for filter
    const uniqueYears = Array.from(new Set(papers.map(p => p.year))).sort().reverse();
    const subjects = ['Chemistry', 'Physics', 'Maths', 'Biology'];

    const filteredPapers = papers.filter(paper => {
        const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = selectedSubject === 'All' || paper.subject === selectedSubject;
        const matchesYear = selectedYear === 'All' || paper.year === selectedYear;
        return matchesSearch && matchesSubject && matchesYear;
    });

    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-teal-500/30">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/20 via-gray-950 to-gray-950 pointer-events-none" />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-300 mb-6 drop-shadow-lg p-2">
                            Sample Papers
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
                            Practice with official CBSE sample papers and marking schemes.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Filters & Search */}
            <section className="px-4 pb-12 relative z-10 sticky top-20">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 p-4 rounded-2xl shadow-xl flex flex-col lg:flex-row gap-4 justify-between items-center">

                        {/* Filters Group */}
                        <div className="flex flex-wrap gap-4 w-full lg:w-auto justify-center lg:justify-start">
                            {/* Subject Filter */}
                            <div className="flex gap-2 p-1 bg-gray-950/50 rounded-xl overflow-x-auto max-w-full">
                                <button
                                    onClick={() => setSelectedSubject('All')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedSubject === 'All' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'text-gray-400 hover:text-white'}`}
                                >
                                    All
                                </button>
                                {subjects.map(subject => (
                                    <button
                                        key={subject}
                                        onClick={() => setSelectedSubject(subject)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedSubject === subject ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        {subject}
                                    </button>
                                ))}
                            </div>

                            {/* Year Filter */}
                            <div className="flex items-center gap-2 bg-gray-950/50 px-3 py-1 rounded-xl border border-gray-800">
                                <Filter size={16} className="text-gray-500" />
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="bg-transparent text-gray-300 text-sm font-medium focus:outline-none cursor-pointer py-2"
                                >
                                    <option value="All" className="bg-gray-900">All Years</option>
                                    {uniqueYears.map(year => (
                                        <option key={year} value={year} className="bg-gray-900">{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="relative w-full lg:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search papers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-950 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Papers Grid */}
            <section className="px-4 pb-20 max-w-6xl mx-auto">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredPapers.length === 0 ? (
                            <div className="col-span-full text-center py-20 text-gray-500">
                                <p className="text-xl">No sample papers found.</p>
                            </div>
                        ) : (
                            filteredPapers.map((paper, idx) => (
                                <motion.div
                                    key={paper.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-gray-900/40 border border-gray-800/60 rounded-2xl p-6 hover:border-teal-500/40 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 flex flex-col"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 rounded-lg bg-teal-500/10 text-teal-400">
                                                <FileText size={24} />
                                            </div>
                                            <div>
                                                <span className="text-xs font-semibold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                                                    {paper.subject}
                                                </span>
                                                <span className="ml-2 text-xs font-semibold text-gray-400 bg-gray-800 px-2 py-0.5 rounded border border-gray-700">
                                                    {paper.year}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-200 mb-6 flex-grow">
                                        {paper.title}
                                    </h3>

                                    <div className="flex gap-3 mt-auto">
                                        <a
                                            href={paper.pdfUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-teal-900/20"
                                        >
                                            <Download size={16} />
                                            Paper
                                        </a>
                                        {paper.solutionUrl && (
                                            <a
                                                href={paper.solutionUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg text-sm font-medium transition-colors border border-gray-700 flex items-center justify-center gap-2"
                                            >
                                                <ExternalLink size={16} />
                                                Solution
                                            </a>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}
