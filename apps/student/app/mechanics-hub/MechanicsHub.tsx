'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { MoveUpRight, Gauge, Rocket, RefreshCw, Zap, Sparkles, Lock } from 'lucide-react';

// The Vector Lab lives in the shared @canvas/book-renderer package so the SAME
// component powers both this standalone hub and the embeddable '-vector-lab'
// book block. ssr:false because it is a heavy interactive client island.
const VectorLabSim = dynamic(() => import('@canvas/book-renderer/simulations/vector-lab'), {
    ssr: false,
    loading: () => <div className="min-h-[480px] flex items-center justify-center text-white/30">Loading Vector Lab…</div>,
});

interface NavItem {
    href: string;
    label: string;
    badge: string;
    icon: typeof MoveUpRight;
    available: boolean;
}

const NAV_ITEMS: NavItem[] = [
    { href: '/mechanics-hub/vectors', label: 'Vectors', badge: 'New', icon: MoveUpRight, available: true },
];

const COMING_SOON = [
    { title: 'Kinematics', desc: 'Motion graphs, equations of motion, and the area-under-the-curve intuition.', icon: Gauge, badge: 'Motion' },
    { title: "Newton's Laws", desc: 'Free-body diagrams, F = ma, and balancing forces built straight on vectors.', icon: Zap, badge: 'Dynamics' },
    { title: 'Projectile Motion', desc: 'Split velocity into components and watch range, height, and time of flight.', icon: Rocket, badge: 'Motion' },
    { title: 'Circular Motion', desc: 'Centripetal acceleration as a constantly-turning velocity vector.', icon: RefreshCw, badge: 'Dynamics' },
];

function ComingSoonGrid() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
                    Built on <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Vectors</span>
                </h2>
                <p className="text-gray-400 text-[15px] max-w-2xl leading-relaxed">
                    Every mechanics topic below is just vectors in disguise. Master the Vector Lab first — the rest of
                    this hub is being built on the exact same foundation.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
                {COMING_SOON.map((sim) => {
                    const Icon = sim.icon;
                    return (
                        <div
                            key={sim.title}
                            className="relative p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/5 border border-indigo-500/15"
                        >
                            <div className="absolute top-4 right-4">
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/30 border border-white/10 text-[10px] font-bold text-white/50 uppercase tracking-wider">
                                    <Lock size={9} /> Soon
                                </span>
                            </div>
                            <Icon size={26} className="text-indigo-400/70 mb-3" />
                            <span className="inline-block px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2">
                                {sim.badge}
                            </span>
                            <h3 className="text-lg font-bold text-white/90 leading-snug">{sim.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed mt-1">{sim.desc}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function MechanicsHubContent() {
    const pathname = usePathname();
    const onVectors = pathname === '/mechanics-hub/vectors';

    return (
        <div className="min-h-screen flex flex-col bg-[#080c14] text-[#d6e0f5] font-sans font-medium overflow-hidden">
            {/* Background ambience */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-900/10 blur-[120px]" />
            </div>

            <div className="flex flex-col md:flex-row h-[calc(100vh-88px-60px)] md:h-[calc(100vh-88px)] mt-[88px] relative z-10 w-full md:w-[96%] max-w-[1440px] mx-auto md:rounded-t-3xl overflow-hidden md:ring-1 md:ring-white/10 md:bg-[#080c14]/60 md:shadow-2xl">
                {/* ── DESKTOP SIDEBAR ── */}
                <aside className="hidden md:flex w-64 shrink-0 bg-[#0a0d14]/90 backdrop-blur-2xl border-r border-white/8 p-4 flex-col gap-1.5 overflow-y-auto">
                    <div className="flex items-center gap-2 text-xs font-bold text-white/40 tracking-[0.2em] uppercase px-3 pb-4 pt-2">
                        <Sparkles size={13} className="text-indigo-400" />
                        Mechanics Hub
                    </div>
                    <div className="px-3 pb-1">
                        <p className="text-[10px] font-bold text-white/25 uppercase tracking-[0.15em]">Simulations</p>
                    </div>
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center justify-between w-full p-3 rounded-xl text-[14px] font-semibold transition-all duration-200 group ${
                                    active ? 'bg-indigo-500/15 text-indigo-400 shadow-[inset_3px_0_currentColor]' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={17} className={active ? 'text-indigo-400' : 'text-gray-500 group-hover:text-indigo-400'} />
                                    {item.label}
                                </div>
                                <span className="text-[10px] bg-indigo-500/20 px-1.5 py-0.5 rounded text-indigo-300/70">{item.badge}</span>
                            </Link>
                        );
                    })}
                    <div className="px-3 pb-1 pt-4">
                        <p className="text-[10px] font-bold text-white/25 uppercase tracking-[0.15em]">Coming Soon</p>
                    </div>
                    {COMING_SOON.map((sim) => {
                        const Icon = sim.icon;
                        return (
                            <div key={sim.title} className="flex items-center justify-between w-full p-3 rounded-xl text-[13px] font-semibold text-gray-600 cursor-not-allowed select-none">
                                <div className="flex items-center gap-3">
                                    <Icon size={15} className="text-gray-700" />
                                    {sim.title}
                                </div>
                                <Lock size={11} className="text-gray-700" />
                            </div>
                        );
                    })}
                </aside>

                {/* ── MAIN CONTENT ── */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-12 scroll-smooth" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(99,102,241,0.2) transparent' }}>
                    <div className="max-w-[1200px] mx-auto">
                        {onVectors ? <VectorLabSim /> : <ComingSoonGrid />}
                    </div>
                </main>
            </div>
        </div>
    );
}
