'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Atom, Sparkles, FlaskConical, BookOpen, TrendingUp, Play, Lock, Ruler } from 'lucide-react';
import VSEPRSimulator from './VSEPRSimulator';
import BondAngleSimulator from './BondAngleSimulator';

interface NavItem {
    href: string;
    label: string;
    badge: string;
    icon: typeof Atom;
    color: string;
    activeClass: string;
    available: boolean;
    description: string;
}

const NAV_ITEMS: NavItem[] = [
    {
        href: '/inorganic-chemistry-hub/vsepr',
        label: 'VSEPR Theory',
        badge: 'New',
        icon: Atom,
        color: 'indigo',
        activeClass: 'bg-indigo-500/15 text-indigo-400',
        available: true,
        description: 'Interactive 3D molecular geometry builder',
    },
    {
        href: '/inorganic-chemistry-hub/bond-angles',
        label: 'Bond Angles',
        badge: 'New',
        icon: Ruler,
        color: 'violet',
        activeClass: 'bg-violet-500/15 text-violet-400',
        available: true,
        description: 'Explore bond angle trends and anomalies',
    },
];

const COMING_SOON_SIMULATORS = [
    {
        title: 'Crystal Field Theory',
        desc: 'Visualize d-orbital splitting in octahedral, tetrahedral, and square planar complexes.',
        icon: '💎',
        color: 'from-violet-500/10 to-purple-500/5 border-violet-500/15',
        badge: 'D-Block',
    },
    {
        title: 'Coordination Chemistry',
        desc: 'Build coordination compounds, identify isomers, and apply EAN rule interactively.',
        icon: '⚙️',
        color: 'from-blue-500/10 to-cyan-500/5 border-blue-500/15',
        badge: 'D-Block',
    },
    {
        title: 'Salt Analysis Lab',
        desc: 'Simulate systematic qualitative analysis with virtual reagents and observation logs.',
        icon: '🧪',
        color: 'from-amber-500/10 to-yellow-500/5 border-amber-500/15',
        badge: 'Qualitative',
    },
    {
        title: 'Hybridization Builder',
        desc: 'Step-by-step orbital mixing visualizer — from ground state to hybridized orbitals.',
        icon: '🔬',
        color: 'from-pink-500/10 to-rose-500/5 border-pink-500/15',
        badge: 'Bonding',
    },
    {
        title: 'MO Theory Diagrams',
        desc: 'Build molecular orbital diagrams for homonuclear and heteronuclear diatomics.',
        icon: '⚛️',
        color: 'from-cyan-500/10 to-sky-500/5 border-cyan-500/15',
        badge: 'Bonding',
    },
];

function ComingSoonGrid() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
                    More <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Simulations</span> Coming Soon
                </h2>
                <p className="text-gray-400 text-[15px] max-w-2xl leading-relaxed">
                    We're building interactive simulations for every major inorganic chemistry topic. Each one is designed to make complex concepts click instantly.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {COMING_SOON_SIMULATORS.map(sim => (
                    <div
                        key={sim.title}
                        className={`relative p-5 rounded-2xl bg-gradient-to-br border ${sim.color} group hover:scale-[1.01] transition-all duration-200`}
                    >
                        <div className="absolute top-4 right-4">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/30 border border-white/10 text-[10px] font-bold text-white/50 uppercase tracking-wider">
                                <Lock size={9} /> Soon
                            </span>
                        </div>
                        <div className="text-3xl mb-3">{sim.icon}</div>
                        <div className="mb-2">
                            <span className="inline-block px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2">
                                {sim.badge}
                            </span>
                            <h3 className="text-lg font-bold text-white/90 leading-snug">{sim.title}</h3>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed">{sim.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function InorganicHubContent() {
    const pathname = usePathname();

    return (
        <div className="min-h-screen flex flex-col bg-[#080c14] text-[#d6e0f5] font-sans font-medium overflow-hidden">

            {/* Background ambience */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-900/10 blur-[120px]" />
                <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] rounded-full bg-blue-900/5 blur-[100px]" />
            </div>

            <div className="flex flex-col md:flex-row h-[calc(100vh-88px-60px)] md:h-[calc(100vh-88px)] mt-[88px] relative z-10 w-full md:w-[96%] max-w-[1440px] mx-auto md:rounded-t-3xl overflow-hidden md:ring-1 md:ring-white/10 md:bg-[#080c14]/60 md:shadow-2xl">

                {/* ── DESKTOP SIDEBAR ── */}
                <aside className="hidden md:flex w-64 shrink-0 bg-[#0a0d14]/90 backdrop-blur-2xl border-r border-white/8 p-4 flex-col gap-1.5 overflow-y-auto">
                    <div className="flex items-center gap-2 text-xs font-bold text-white/40 tracking-[0.2em] uppercase px-3 pb-4 pt-2">
                        <Sparkles size={13} className="text-indigo-400" />
                        Inorganic Hub
                    </div>

                    {/* Available simulations */}
                    <div className="px-3 pb-1">
                        <p className="text-[10px] font-bold text-white/25 uppercase tracking-[0.15em]">Simulations</p>
                    </div>

                    {NAV_ITEMS.map(item => {
                        const Icon = item.icon;
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center justify-between w-full p-3 rounded-xl text-[14px] font-semibold transition-all duration-200 group ${
                                    active
                                        ? `${item.activeClass} shadow-[inset_3px_0_currentColor]`
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={17} className={active ? 'text-indigo-400' : 'text-gray-500 group-hover:text-indigo-400'} />
                                    {item.label}
                                </div>
                                <span className="text-[10px] font-mono bg-indigo-500/20 px-1.5 py-0.5 rounded text-indigo-300/70">{item.badge}</span>
                            </Link>
                        );
                    })}

                    {/* Coming soon items */}
                    <div className="px-3 pb-1 pt-4">
                        <p className="text-[10px] font-bold text-white/25 uppercase tracking-[0.15em]">Coming Soon</p>
                    </div>

                    {COMING_SOON_SIMULATORS.map(sim => (
                        <div
                            key={sim.title}
                            className="flex items-center justify-between w-full p-3 rounded-xl text-[13px] font-semibold text-gray-600 cursor-not-allowed select-none"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-base">{sim.icon}</span>
                                {sim.title}
                            </div>
                            <Lock size={11} className="text-gray-700" />
                        </div>
                    ))}

                    {/* Sidebar CTAs */}
                    <div className="mt-auto pt-6 flex flex-col gap-2">
                        <Link
                            href="/periodic-trends"
                            className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 hover:border-amber-500/25 transition-all group"
                        >
                            <TrendingUp size={15} className="text-amber-400/60 group-hover:text-amber-400 transition-colors" />
                            <div>
                                <p className="text-xs font-bold text-white/60 group-hover:text-white/80 transition-colors">Periodic Trends</p>
                                <p className="text-[10px] text-gray-600">P, D & F Block</p>
                            </div>
                        </Link>
                        <Link
                            href="/interactive-periodic-table"
                            className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 hover:border-blue-500/25 transition-all group"
                        >
                            <FlaskConical size={15} className="text-blue-400/60 group-hover:text-blue-400 transition-colors" />
                            <div>
                                <p className="text-xs font-bold text-white/60 group-hover:text-white/80 transition-colors">Periodic Table</p>
                                <p className="text-[10px] text-gray-600">Interactive Explorer</p>
                            </div>
                        </Link>
                    </div>
                </aside>

                {/* ── MOBILE BOTTOM NAV ── */}
                <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0a0d14]/95 backdrop-blur-xl border-t border-white/10 flex items-center justify-around px-2 py-2 safe-pb">
                    <Link
                        href="/inorganic-chemistry-hub/vsepr"
                        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-[11px] font-bold transition-all ${pathname === '/inorganic-chemistry-hub/vsepr' ? 'text-indigo-400' : 'text-gray-500'}`}
                    >
                        <Atom size={20} />
                        VSEPR
                    </Link>
                    <Link
                        href="/inorganic-chemistry-hub/bond-angles"
                        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-[11px] font-bold transition-all ${pathname === '/inorganic-chemistry-hub/bond-angles' ? 'text-violet-400' : 'text-gray-500'}`}
                    >
                        <Ruler size={20} />
                        Angles
                    </Link>
                    <Link
                        href="/inorganic-chemistry-hub"
                        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-[11px] font-bold transition-all ${pathname === '/inorganic-chemistry-hub' ? 'text-indigo-400' : 'text-gray-500'}`}
                    >
                        <Sparkles size={20} />
                        Hub
                    </Link>
                    <Link
                        href="/periodic-trends"
                        className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-[11px] font-bold text-gray-500"
                    >
                        <TrendingUp size={20} />
                        Trends
                    </Link>
                </div>

                {/* ── MAIN CONTENT ── */}
                <main
                    className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-32 scroll-smooth"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(99,102,241,0.2) transparent' }}
                >
                    <div className="max-w-[1200px] mx-auto">
                        {pathname === '/inorganic-chemistry-hub/bond-angles' ? (
                            <BondAngleSimulator />
                        ) : (
                            <VSEPRSimulator />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
