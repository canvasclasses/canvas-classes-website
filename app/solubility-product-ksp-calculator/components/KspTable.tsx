'use client';

import { useState, useMemo } from 'react';
import { Salt, formatKspParts, calculateSolubility, formatSolubilityParts } from '@/app/lib/kspData';

interface KspTableProps {
    salts: Salt[];
    categories: string[];
}

// Component to render scientific notation with styled superscript
function ScientificNotation({ coefficient, exponent, className }: { coefficient: number; exponent: number; className?: string }) {
    return (
        <span className={className}>
            {coefficient} × 10<sup className="text-[0.65em] font-semibold">{exponent}</sup>
        </span>
    );
}

export default function KspTable({ salts, categories }: KspTableProps) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedMetal, setSelectedMetal] = useState<string>('All');
    const [sortBy, setSortBy] = useState<'name' | 'ksp' | 'solubility'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // Extract unique metals from salt names
    const metals = useMemo(() => {
        const metalMap: { [key: string]: string } = {
            'Silver': 'Ag',
            'Aluminium': 'Al',
            'Barium': 'Ba',
            'Calcium': 'Ca',
            'Cadmium': 'Cd',
            'Chromic': 'Cr',
            'Cuprous': 'Cu',
            'Cupric': 'Cu',
            'Ferrous': 'Fe',
            'Ferric': 'Fe',
            'Mercurous': 'Hg',
            'Mercuric': 'Hg',
            'Magnesium': 'Mg',
            'Manganese': 'Mn',
            'Nickel': 'Ni',
            'Lead': 'Pb',
            'Stannous': 'Sn',
            'Strontium': 'Sr',
            'Thallous': 'Tl',
            'Zinc': 'Zn',
        };

        // Group by metal symbol to combine same metals
        const metalGroups: { [symbol: string]: string[] } = {};
        salts.forEach(salt => {
            const firstWord = salt.name.split(' ')[0];
            const symbol = metalMap[firstWord];
            if (symbol) {
                if (!metalGroups[symbol]) {
                    metalGroups[symbol] = [];
                }
                if (!metalGroups[symbol].includes(firstWord)) {
                    metalGroups[symbol].push(firstWord);
                }
            }
        });

        return Object.entries(metalGroups)
            .map(([symbol, names]) => ({ symbol, names }))
            .sort((a, b) => a.symbol.localeCompare(b.symbol));
    }, [salts]);

    const filteredSalts = useMemo(() => {
        let result = [...salts];

        // Filter by metal (check if salt name starts with any of the metal's name variants)
        if (selectedMetal !== 'All') {
            const metalData = metals.find(m => m.symbol === selectedMetal);
            if (metalData) {
                result = result.filter(s =>
                    metalData.names.some(name => s.name.startsWith(name))
                );
            }
        }

        // Filter by search
        if (search) {
            const searchLower = search.toLowerCase();
            result = result.filter(
                s => s.name.toLowerCase().includes(searchLower) ||
                    s.formula.toLowerCase().includes(searchLower)
            );
        }

        // Filter by category (anion)
        if (selectedCategory !== 'All') {
            result = result.filter(s => s.category === selectedCategory);
        }

        // Sort
        result.sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'name') {
                comparison = a.name.localeCompare(b.name);
            } else if (sortBy === 'ksp') {
                comparison = a.ksp - b.ksp;
            } else if (sortBy === 'solubility') {
                comparison = calculateSolubility(a) - calculateSolubility(b);
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [salts, search, selectedCategory, selectedMetal, sortBy, sortOrder, metals]);

    const handleSort = (column: 'name' | 'ksp' | 'solubility') => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const SortIcon = ({ column }: { column: 'name' | 'ksp' | 'solubility' }) => {
        if (sortBy !== column) return <span className="text-gray-600">↕</span>;
        return sortOrder === 'asc' ? <span className="text-purple-400">↑</span> : <span className="text-purple-400">↓</span>;
    };

    return (
        <div className="space-y-4">
            {/* Metal Filter Buttons */}
            <div className="bg-gray-900/60 rounded-xl p-3 border border-gray-700/50">
                <p className="text-gray-400 text-xs mb-2">Filter by Metal:</p>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedMetal('All')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedMetal === 'All'
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                            : 'bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white'
                            }`}
                    >
                        All
                    </button>
                    {metals.map(metal => (
                        <button
                            key={metal.symbol}
                            onClick={() => setSelectedMetal(metal.symbol)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedMetal === metal.symbol
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                                : 'bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white'
                                }`}
                        >
                            {metal.symbol}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search and Category Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search by name or formula..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-gray-900/60 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                </div>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-gray-900/60 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                    <option value="All">All Anions</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* Results count */}
            <p className="text-gray-400 text-sm">
                Showing {filteredSalts.length} of {salts.length} salts
            </p>

            {/* Table */}
            <div className="bg-gray-900/60 rounded-2xl border border-gray-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-800/50 border-b border-gray-700">
                                <th
                                    onClick={() => handleSort('name')}
                                    className="px-6 py-4 text-left text-sm font-semibold text-gray-300 cursor-pointer hover:text-white transition-colors"
                                >
                                    Salt <SortIcon column="name" />
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                    Formula
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                    Type
                                </th>
                                <th
                                    onClick={() => handleSort('ksp')}
                                    className="px-6 py-4 text-left text-sm font-semibold text-gray-300 cursor-pointer hover:text-white transition-colors"
                                >
                                    Ksp <SortIcon column="ksp" />
                                </th>
                                <th
                                    onClick={() => handleSort('solubility')}
                                    className="px-6 py-4 text-left text-sm font-semibold text-gray-300 cursor-pointer hover:text-white transition-colors"
                                >
                                    Solubility (M) <SortIcon column="solubility" />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSalts.map((salt, index) => (
                                <tr
                                    key={salt.formula}
                                    className={`border-b border-gray-700/30 hover:bg-gray-700/30 transition-colors ${index % 2 === 0 ? 'bg-gray-800/20' : ''
                                        }`}
                                >
                                    <td className="px-6 py-4 text-white font-medium">
                                        {salt.name}
                                    </td>
                                    <td className="px-6 py-4 text-purple-300 font-medium text-base">
                                        {salt.formula}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs px-2.5 py-1 bg-gray-700 text-gray-300 rounded-full border border-gray-600">
                                            {salt.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-sm">
                                        <ScientificNotation
                                            {...formatKspParts(salt)}
                                            className="text-cyan-300"
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-mono text-sm">
                                        <ScientificNotation
                                            {...formatSolubilityParts(calculateSolubility(salt))}
                                            className="text-emerald-300"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredSalts.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No salts found matching your search.
                </div>
            )}
        </div>
    );
}
