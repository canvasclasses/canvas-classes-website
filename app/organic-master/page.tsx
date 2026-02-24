'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { REACTIONS, QUICK_REF, TYPE_COLOR } from './data';
import type { Reaction } from './types';
import AcidityLab from './AcidityLab';
import PhysicalPropertiesLab from './PhysicalPropertiesLab';
import {
  Search, ChevronDown, ChevronUp, Play, FlaskConical, AlertTriangle,
  Lightbulb, ShieldAlert, Zap, Compass, Filter, Sparkles, BookOpen, Droplet, Hash,
  BarChart3
} from 'lucide-react';

// Tailwind color maps for chips
const bgColors: Record<string, string> = {
  blue: 'bg-blue-500/15 border-blue-500/40 text-blue-300',
  red: 'bg-orange-500/10 border-orange-500/25 text-rose-300/80',
  green: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
  amber: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
  indigo: 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300',
  teal: 'bg-teal-500/15 border-teal-500/40 text-teal-300',
  purple: 'bg-purple-500/15 border-purple-500/40 text-purple-300',
};

function InfoRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-4 px-4 py-2.5 border-b border-white/5 last:border-none">
      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest min-w-[85px] shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-[13.5px] text-white/70 leading-relaxed flex-1">
        {value}
      </span>
    </div>
  );
}

function Panel({ variant, label, body, icon: Icon }: { variant: 'stereo' | 'mistake' | 'hook' | 'jee'; label: string; body: string; icon: any }) {
  if (!body) return null;
  const s = {
    stereo: 'bg-blue-500/5 border-blue-500/20 text-blue-200',
    mistake: 'bg-orange-500/5 border-orange-500/15 text-rose-300/80',
    hook: 'bg-amber-500/5 border-amber-500/20 text-amber-200',
    jee: 'bg-indigo-500/5 border-indigo-500/20 text-indigo-200'
  }[variant];

  return (
    <div className={`rounded-lg p-3.5 mb-2.5 border ${s}`}>
      <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase mb-1.5 opacity-80">
        <Icon size={12} />
        {label}
      </div>
      <div className="text-[13.5px] leading-relaxed opacity-75">{body}</div>
    </div>
  );
}

function ReactionCard({ r, isOpen, onToggle }: { r: Reaction; isOpen: boolean; onToggle: () => void }) {
  const c = TYPE_COLOR[r.type] ?? ['rgba(90,80,110,0.1)', 'rgba(90,80,110,0.3)', '#9890b0'];
  const typeStyle = { backgroundColor: c[0], borderColor: c[1], color: c[2] };

  const pb = r.priority === 'high' ? 'bg-rose-400/5 text-rose-300/70 border-rose-400/20' : r.priority === 'medium' ? 'bg-amber-400/5 text-amber-300/70 border-amber-400/20' : 'bg-emerald-400/5 text-emerald-300/70 border-emerald-400/20';
  const eb = r.exam === 'both' ? 'bg-indigo-400/5 text-indigo-300/70 border-indigo-400/20' : r.exam === 'advanced' ? 'bg-orange-400/5 text-orange-300/70 border-orange-400/20' : 'bg-blue-400/5 text-blue-300/70 border-blue-400/20';

  const pLabel = r.priority === 'high' ? 'High' : r.priority === 'medium' ? 'Medium' : 'Low';
  const eLabel = r.exam === 'both' ? 'Mains + Adv' : r.exam === 'advanced' ? 'Adv only' : 'Mains';

  return (
    <motion.div
      layout
      className={`rounded-2xl border mb-4 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'bg-indigo-500/5 border-emerald-500/40 shadow-lg shadow-emerald-900/10' : 'bg-white/[0.02] border-white/10 hover:border-emerald-500/30 hover:bg-white/[0.04]'}`}
    >
      <div onClick={onToggle} className="p-5 cursor-pointer select-none">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="text-[16.5px] font-bold text-white/90 tracking-tight group-hover:text-emerald-300 transition-colors">{r.name}</span>
              {r.videoUrl && (
                <a href={r.videoUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                  title="Watch video explanation"
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors">
                  <Play size={10} fill="currentColor" />
                  Video
                </a>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 text-[9.5px] font-bold tracking-wider uppercase">
              <span className="inline-flex px-2 py-0.5 rounded-md border whitespace-nowrap opacity-80" style={typeStyle}>{r.type}</span>
              <span className="inline-flex px-2 py-0.5 rounded-md border border-white/5 bg-white/5 text-white/30 whitespace-nowrap">{r.chapter}</span>
              <span className={`inline-flex px-2 py-0.5 rounded-md border whitespace-nowrap ${pb}`}>{pLabel} Priority</span>
              <span className={`inline-flex px-2 py-0.5 rounded-md border whitespace-nowrap ${eb}`}>{eLabel}</span>
            </div>
          </div>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="shrink-0 text-gray-500 p-2 bg-gray-800/30 rounded-full">
            <ChevronDown size={20} />
          </motion.div>
        </div>

        <p className="text-[13.5px] text-gray-400/80 leading-relaxed mt-3 lining-nums">{r.summary}</p>

        <AnimatePresence>
          {!isOpen && r.tags && r.tags.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-wrap gap-1.5 mt-4">
              {r.tags.slice(0, 5).map(t => (
                <span key={t} className="inline-flex px-2.5 py-1 rounded-md text-xs text-gray-400 border border-white/5 bg-white/[0.02]">
                  #{t}
                </span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-emerald-500/20 px-5 pb-6 pt-5 bg-black/20"
          >
            {r.svgUrl ? (
              <div className="mb-6 rounded-xl overflow-hidden border border-white/10 bg-white/[0.02] p-4 flex justify-center backdrop-blur-sm">
                <img src={r.svgUrl} alt={`${r.name} mechanism`} className="max-w-full max-h-56 object-contain filter invert opacity-90 hover:opacity-100 transition-opacity" />
              </div>
            ) : null}

            <div className="rounded-xl border border-white/10 bg-white/[0.01] overflow-hidden mb-5 backdrop-blur-md">
              <InfoRow label="Reactants" value={r.reactants} />
              <InfoRow label="Reagents" value={r.reagents} />
              <InfoRow label="Conditions" value={r.conditions} />
              <InfoRow label="Product" value={r.product} />
              <InfoRow label="Mechanism" value={r.mechanism} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
              {r.stereo && <Panel variant="stereo" label="Stereochemistry" body={r.stereo} icon={Compass} />}
              <Panel variant="mistake" label="Common Mistake" body={r.mistake} icon={ShieldAlert} />
              <Panel variant="hook" label="Memory Hook" body={r.hook} icon={Lightbulb} />
              <Panel variant="jee" label="JEE Relevance" body={r.jee} icon={Zap} />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex flex-wrap gap-2 flex-1">
                {r.tags.map(t => (
                  <span key={t} className="inline-flex px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-400/80 border border-emerald-500/20 bg-emerald-500/5">
                    #{t}
                  </span>
                ))}
              </div>
              {r.videoUrl && (
                <a href={r.videoUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors shrink-0">
                  <Play size={14} fill="currentColor" />
                  Watch Video Lesson
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Chip({ active, onClick, color, children }: { active: boolean; onClick: () => void; color?: string; children: React.ReactNode }) {
  const base = "px-3.5 py-1.5 rounded-lg border text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2 ";
  if (!active) {
    return <button onClick={onClick} className={base + "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"}>{children}</button>;
  }
  const colorStr = bgColors[color || 'emerald'] || bgColors.emerald;
  return <button onClick={onClick} className={base + colorStr + " shadow-[0_0_15px_rgba(var(--tw-colors-emerald-500),0.1)]"}>{children}</button>;
}

function NamedReactionsTab() {
  const [query, setQuery] = useState('');
  const [exam, setExam] = useState('all');
  const [prio, setPrio] = useState('all');
  const [openId, setOpenId] = useState<string | null>(null);

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchRef.current) { e.preventDefault(); searchRef.current?.focus(); }
      if (e.key === 'Escape') { setQuery(''); searchRef.current?.blur(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const visible = REACTIONS.filter(r => {
    if (exam !== 'all' && r.exam !== 'both' && r.exam !== exam) return false;
    if (prio !== 'all' && r.priority !== prio) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return r.name.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q) || r.chapter.toLowerCase().includes(q) || (r.tags && r.tags.some(t => t.toLowerCase().includes(q))) || r.reactants?.toLowerCase().includes(q) || r.reagents?.toLowerCase().includes(q);
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="mb-8 relative">
        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2 tracking-tight">Named Reactions</h2>
        <p className="text-gray-400 text-[15px]">{REACTIONS.length} reactions · Master every important organic reaction for JEE & NEET.</p>
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[80px] -z-10 rounded-full pointer-events-none" />
      </div>

      <div className="relative mb-5 group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-10 group-focus-within:opacity-25 transition duration-500"></div>
        <div className="relative flex items-center">
          <Search className="absolute left-4 text-emerald-500/60" size={20} />
          <input
            ref={searchRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search reactions, reagents, compounds… (Press '/' to focus)"
            className="w-full py-4 pl-12 pr-12 bg-[#121820]/80 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 shadow-inner font-medium text-[15px]"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 text-gray-500 hover:text-white transition-colors bg-white/5 p-1 rounded-md">
              &times;
            </button>
          )}
        </div>
      </div>

      <div className="mb-8 p-5 bg-[#121820]/60 backdrop-blur-md rounded-2xl border border-white/5 shadow-xl shadow-black/20 flex flex-col gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-widest min-w-[70px]">
            <Droplet size={14} /> Exam
          </div>
          <div className="flex gap-2 flex-wrap">
            <Chip active={exam === 'all'} onClick={() => setExam('all')}>All</Chip>
            <Chip active={exam === 'mains'} onClick={() => setExam('mains')} color="blue">JEE Mains</Chip>
            <Chip active={exam === 'advanced'} onClick={() => setExam('advanced')} color="red">JEE Advanced</Chip>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-widest min-w-[70px]">
            <AlertTriangle size={14} /> Prio
          </div>
          <div className="flex gap-2 flex-wrap">
            <Chip active={prio === 'all'} onClick={() => setPrio('all')}>All</Chip>
            <Chip active={prio === 'high'} onClick={() => setPrio('high')} color="red">High</Chip>
            <Chip active={prio === 'medium'} onClick={() => setPrio('medium')} color="amber">Medium</Chip>
            <Chip active={prio === 'low'} onClick={() => setPrio('low')} color="green">Low</Chip>
          </div>
        </div>
      </div>

      <div className="text-[13px] font-bold text-gray-500 tracking-widest uppercase mb-4 pl-1">
        Showing {visible.length} Reactions
      </div>

      {visible.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
          <FlaskConical size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No reactions found</h3>
          <p className="text-gray-400 text-sm">Adjust your filters or try a different search term.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map(r => (
            <ReactionCard key={r.id} r={r} isOpen={openId === r.id} onToggle={() => setOpenId(openId === r.id ? null : r.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function QuickReferenceTab() {
  const [activeTab, setActiveTab] = useState(0);
  const table = QUICK_REF[activeTab];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto pb-4 mb-6 no-scrollbar gap-2 -mx-4 px-4 md:mx-0 md:px-0">
        {QUICK_REF.map((t, i) => (
          <button
            key={t.title}
            onClick={() => setActiveTab(i)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all border ${activeTab === i
              ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
              }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {table && (
          <div key={table.title} className="bg-[#121820]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-5 py-4 border-b border-white/10 bg-white/5 flex flex-col gap-1">
              <div className="text-lg font-bold text-emerald-300 flex items-center gap-2">
                <Hash size={18} /> {table.title}
              </div>
              {table.description && <p className="text-[13px] text-gray-400 font-medium leading-relaxed">{table.description}</p>}
            </div>

            {table.layout === 'grid' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-5 bg-white/[0.01]">
                {table.rows.map((row, i) => (
                  <div key={i} className="flex flex-col sm:flex-row gap-5 p-5 bg-[#121820]/40 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all group overflow-hidden relative shadow-lg">
                    <div className="w-24 h-24 shrink-0 bg-[#050505] rounded-xl flex items-center justify-center p-2 border border-white/10 group-hover:scale-105 transition-transform duration-500 shadow-2xl relative z-10">
                      {row.svg && (
                        <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: row.svg }} />
                      )}
                    </div>
                    <div className="flex-1 relative z-10 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-3 mb-2">
                        <h4 className="text-[17px] font-bold text-white leading-tight group-hover:text-emerald-300 transition-colors">{row.name}</h4>
                        <span className="shrink-0 self-start text-[13px] text-cyan-300 font-mono bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]">{row.value}</span>
                      </div>
                      <p className="text-[13px] text-gray-400 leading-relaxed font-medium line-clamp-3">{row.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col">
                {table.headers && (
                  <div className="hidden md:flex flex-row gap-4 px-5 py-3 border-b border-white/10 bg-white/5 text-[11px] font-bold text-gray-500 uppercase tracking-widest items-center pl-[20px]">
                    <div className="flex-[2] truncate">{table.headers[0]}</div>
                    <div className="flex-1 text-center truncate">{table.headers[1]}</div>
                    <div className="flex-[2] text-left truncate">{table.headers[2]}</div>
                  </div>
                )}
                {table.rows.map((row, i) => (
                  <div key={i} className={`flex flex-col md:flex-row gap-y-1.5 md:gap-x-4 px-5 py-2.5 hover:bg-white/[0.03] transition-colors items-start md:items-center ${i < table.rows.length - 1 ? 'border-b border-white/[0.03]' : ''}`}>
                    <div className="flex-[2] w-full md:w-auto flex items-center justify-between md:justify-start gap-4 min-w-0">
                      <div className="flex items-center gap-4 min-w-0">
                        {row.svg && (
                          <div className="w-10 h-10 shrink-0 bg-white/5 rounded-lg flex items-center justify-center p-1 border border-white/10"
                            dangerouslySetInnerHTML={{ __html: row.svg }} />
                        )}
                        <span className="text-[14.5px] font-semibold text-white/90 truncate">{row.name}</span>
                      </div>

                      {/* Mobile Value Badge */}
                      <span className="md:hidden shrink-0 text-[13.5px] text-cyan-300 font-mono bg-cyan-500/10 px-2.5 py-1 rounded-md">{row.value}</span>
                    </div>

                    {/* Desktop Value Badge */}
                    <div className="hidden md:flex flex-1 justify-center">
                      <span className="text-[13.5px] text-cyan-300 font-mono bg-cyan-500/10 px-2.5 py-1 rounded-md truncate">{row.value}</span>
                    </div>

                    <span className="text-[13px] font-medium text-gray-400 flex-[2] w-full text-left leading-snug">{row.note}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TheCrucibleCTA() {
  return (
    <div className="mt-12 p-5 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px] -z-10 rounded-full group-hover:bg-emerald-500/10 transition-all duration-700" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400/80 text-[9px] font-bold uppercase tracking-wider mb-2 border border-emerald-500/10">
            <Sparkles size={10} /> 3000+ Questions & PYQs
          </div>
          <h3 className="text-lg font-bold text-white/90 mb-1 tracking-tight truncate">The Crucible</h3>
          <p className="text-gray-500 text-[12.5px] leading-snug">
            Curated problem bank with complete JEE/NEET PYQs.
          </p>
        </div>
        <Link
          href="/the-crucible"
          className="group/btn relative px-5 py-2.5 rounded-xl bg-emerald-500/90 text-black font-bold text-[12px] hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all shadow-lg shrink-0 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-1.5">
            Practice Now <Play size={12} fill="black" />
          </span>
        </Link>
      </div>
    </div>
  );
}

function InorganicTrendsCTA() {
  return (
    <div className="mt-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] -z-10 rounded-full group-hover:bg-blue-500/10 transition-all duration-700" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400/80 text-[9px] font-bold uppercase tracking-wider mb-2 border border-blue-500/10">
            <Sparkles size={10} /> Master Inorganic
          </div>
          <h3 className="text-lg font-bold text-white/90 mb-1 tracking-tight">Trends & Exceptions</h3>
          <p className="text-gray-500 text-[12.5px] leading-snug">
            Interactive Periodic Table and Trends Lab.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link
            href="/interactive-periodic-table"
            className="px-4 py-2 rounded-lg bg-white/5 text-white/70 font-bold text-[11px] hover:bg-white/10 transition-all border border-white/5"
          >
            Periodic Table
          </Link>
          <Link
            href="/periodic-trends"
            className="px-4 py-2 rounded-lg bg-blue-500/80 text-white font-bold text-[11px] hover:bg-blue-500 transition-all shadow-md"
          >
            Trends Lab
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrganicMasterPage() {
  const [section, setSection] = useState<'named' | 'lab' | 'phys' | 'ref'>('named');

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117] text-[#d4d6e0] selection:bg-emerald-500/30 font-sans font-medium overflow-hidden">

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-900/10 blur-[120px]" />
      </div>

      <div className="flex flex-col md:flex-row h-[calc(100vh-88px-60px)] md:h-[calc(100vh-88px)] mt-[88px] relative z-10 w-full md:w-[96%] max-w-[1380px] mx-auto md:rounded-t-3xl overflow-hidden md:ring-1 md:ring-white/10 md:bg-[#0a0d14]/40 md:shadow-2xl">

        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:flex w-64 shrink-0 bg-[#0d1117]/80 backdrop-blur-2xl border-r border-white/10 p-5 flex-col gap-2 overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-2 text-xs font-bold text-white/40 tracking-[0.2em] uppercase px-3 pb-4 pt-2">
            <Sparkles size={14} className="text-emerald-500" />
            Organic Hub
          </div>

          <button
            onClick={() => setSection('named')}
            className={`flex items-center justify-between w-full p-3 rounded-xl text-[14.5px] font-semibold transition-all duration-200 group ${section === 'named' ? 'bg-emerald-500/15 text-emerald-400 shadow-[inset_3px_0_0_rgba(var(--tw-colors-emerald-500))]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <div className="flex items-center gap-3">
              <FlaskConical size={18} className={section === 'named' ? 'text-emerald-400' : 'text-gray-500 group-hover:text-emerald-400'} />
              Name Reactions
            </div>
            <span className="text-[11px] font-mono bg-black/30 px-2 py-0.5 rounded text-white/50">{REACTIONS.length}</span>
          </button>

          <button
            onClick={() => setSection('lab')}
            className={`flex items-center justify-between w-full p-3 rounded-xl text-[14.5px] font-semibold transition-all duration-200 group ${section === 'lab' ? 'bg-cyan-500/15 text-cyan-400 shadow-[inset_3px_0_0_rgba(var(--tw-colors-cyan-500))]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <div className="flex items-center gap-3">
              <Droplet size={18} className={section === 'lab' ? 'text-cyan-400' : 'text-gray-500 group-hover:text-cyan-400'} />
              Acidity Lab
            </div>
            <span className="text-[11px] font-mono bg-black/30 px-2 py-0.5 rounded text-white/50">Sim</span>
          </button>

          <button
            onClick={() => setSection('phys')}
            className={`flex items-center justify-between w-full p-3 rounded-xl text-[14.5px] font-semibold transition-all duration-200 group ${section === 'phys' ? 'bg-blue-500/15 text-blue-400 shadow-[inset_3_px_0_0_rgba(var(--tw-colors-blue-500))]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <div className="flex items-center gap-3">
              <BarChart3 size={18} className={section === 'phys' ? 'text-blue-400' : 'text-gray-500 group-hover:text-blue-400'} />
              Physical Lab
            </div>
            <span className="text-[11px] font-mono bg-black/30 px-2 py-0.5 rounded text-white/50">Trends</span>
          </button>

          <button
            onClick={() => setSection('ref')}
            className={`flex items-center justify-between w-full p-3 rounded-xl text-[14.5px] font-semibold transition-all duration-200 group ${section === 'ref' ? 'bg-indigo-500/15 text-indigo-400 shadow-[inset_3px_0_0_rgba(var(--tw-colors-indigo-500))]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <div className="flex items-center gap-3">
              <BookOpen size={18} className={section === 'ref' ? 'text-indigo-400' : 'text-gray-500 group-hover:text-indigo-400'} />
              Quick Reference
            </div>
            <span className="text-[11px] font-mono bg-black/30 px-2 py-0.5 rounded text-white/50">{QUICK_REF.length}</span>
          </button>

          <div className="mt-auto pt-6 border-t border-white/5 px-2">
            <div className="text-[11px] font-bold text-white/30 tracking-wider mb-2 uppercase">Shortcuts</div>
            <div className="text-[12px] text-gray-500 flex flex-col gap-2 font-mono">
              <div className="flex items-center justify-between"><span>Focus Search</span><kbd className="px-1.5 py-0.5 bg-black/40 rounded border border-white/10 text-[10px]">/</kbd></div>
              <div className="flex items-center justify-between"><span>Clear Search</span><kbd className="px-1.5 py-0.5 bg-black/40 rounded border border-white/10 text-[10px]">Esc</kbd></div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 pb-10 md:pb-40 scroll-smooth">
          <div className="max-w-6xl mx-auto min-h-full flex flex-col">
            <div className="flex-1">
              {section === 'named' && <NamedReactionsTab />}
              {section === 'lab' && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><AcidityLab /></div>}
              {section === 'phys' && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><PhysicalPropertiesLab /></div>}
              {section === 'ref' && <QuickReferenceTab />}
            </div>
            <TheCrucibleCTA />
            <InorganicTrendsCTA />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[60px] bg-[#0d1117]/95 backdrop-blur-3xl border-t border-white/10 flex items-center justify-around px-2 z-50">
        <button
          onClick={() => setSection('named')}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 ${section === 'named' ? 'text-emerald-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <FlaskConical size={20} />
          <span className="text-[10px] font-semibold">Reactions</span>
        </button>
        <button
          onClick={() => setSection('lab')}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 ${section === 'lab' ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Droplet size={20} />
          <span className="text-[10px] font-semibold">Acidity</span>
        </button>
        <button
          onClick={() => setSection('phys')}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 ${section === 'phys' ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <BarChart3 size={20} />
          <span className="text-[10px] font-semibold">Properties</span>
        </button>
        <button
          onClick={() => setSection('ref')}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 ${section === 'ref' ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <BookOpen size={20} />
          <span className="text-[10px] font-semibold">Reference</span>
        </button>
      </nav>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(16, 185, 129, 0.4); }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
