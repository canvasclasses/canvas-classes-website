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
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

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

// Simplified Reaction View - Focused on pedagogical clarity and visual impact

function Panel({ variant, label, body, icon: Icon }: { variant: 'stereo' | 'mistake' | 'hook' | 'jee'; label: string; body: string; icon: any }) {
  if (!body) return null;
  const s = {
    stereo: 'bg-white/[0.03] border-blue-500/30 text-blue-50/90',
    mistake: 'bg-white/[0.03] border-rose-500/30 text-rose-50/90',
    hook: 'bg-white/[0.03] border-amber-500/30 text-amber-50/90',
    jee: 'bg-white/[0.03] border-indigo-500/30 text-indigo-50/90'
  }[variant];

  const accent = {
    stereo: 'bg-blue-500',
    mistake: 'bg-rose-500',
    hook: 'bg-amber-500',
    jee: 'bg-indigo-500'
  }[variant];

  return (
    <div className={`relative rounded-xl py-3.5 px-5 border-l-4 border-y border-r border-white/5 transition-all duration-300 hover:bg-white/[0.05] ${s}`}>
      <div className={`absolute top-0 left-[-4px] bottom-0 w-1 ${accent} rounded-l-xl opacity-80`} />
      <div className="flex items-center gap-2 text-[12.5px] font-bold tracking-wider uppercase mb-1.5 opacity-60">
        <Icon size={15} strokeWidth={2.5} />
        {label}
      </div>
      <div className="text-[15px] leading-relaxed font-medium prose prose-invert prose-sm max-w-none">
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
          {body}
        </ReactMarkdown>
      </div>
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
      className={`rounded-2xl transition-all duration-300 ease-in-out ${isOpen ? 'bg-transparent border-transparent' : 'rounded-2xl border mb-4 bg-white/[0.02] border-white/10 hover:border-emerald-500/30 hover:bg-white/[0.04] shadow-sm'}`}
    >
      <div onClick={onToggle} className="p-5 cursor-pointer select-none">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="text-[18px] font-bold text-white/90 tracking-tight group-hover:text-emerald-300 transition-colors uppercase">{r.name}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 text-[10.5px] font-bold tracking-wider uppercase">
              <span className="inline-flex px-2 py-0.5 rounded-md border whitespace-nowrap opacity-80" style={typeStyle}>{r.type}</span>
              <span className="inline-flex px-2 py-0.5 rounded-md border border-white/5 bg-white/5 text-white/30 whitespace-nowrap">{r.chapter}</span>
              <span className={`inline-flex px-2 py-0.5 rounded-md border whitespace-nowrap ${pb}`}>{pLabel} Priority</span>
              <span className={`inline-flex px-2 py-0.5 rounded-md border whitespace-nowrap ${eb}`}>{eLabel}</span>
            </div>
          </div>
          {!isOpen && (
            <motion.div className="shrink-0 text-gray-500 p-2 bg-gray-800/30 rounded-full">
              <ChevronDown size={20} />
            </motion.div>
          )}
        </div>

        <div className="text-[16px] text-gray-300 leading-relaxed mt-4 lining-nums font-medium prose prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
            {r.summary}
          </ReactMarkdown>
        </div>

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
            className="px-5 pb-10 pt-5"
          >
            {/* Main Visual: Mechanism SVG */}
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1 px-1">
                <Compass size={12} />
                Mechanism Pathway
              </div>
              {r.images?.length > 0 ? (
                <>
                  {r.images.map((img, idx) => (
                    <div key={idx} className="rounded-2xl overflow-hidden border border-white/10 bg-[#050505] p-8 flex justify-center shadow-2xl relative group/img">
                      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity" />
                      <img src={img} alt={`${r.name} mechanism ${idx + 1}`} className="max-w-full max-h-[500px] object-contain opacity-95 group-hover/img:opacity-100 transition-all duration-500 group-hover/img:scale-[1.01]" />
                    </div>
                  ))}
                </>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
                  <FlaskConical size={40} className="mb-3 text-white/10" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/20">Mechanism and video explanation coming soon</span>
                </div>
              )}
            </div>

            {/* Watch Video Button - Positioned exactly as requested (below SVG) */}
            {r.videoUrl && (
              <div className="mb-10 flex justify-center md:justify-start">
                <a href={r.videoUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl text-[14px] font-black bg-red-500/10 border border-red-500/30 text-red-100 hover:bg-red-500/20 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-red-500/10 group/vid tracking-wide">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg shadow-red-600/40">
                    <Play size={18} fill="currentColor" className="ml-0.5" />
                  </div>
                  WATCH VIDEO EXPLANATION
                </a>
              </div>
            )}

            {/* Insights Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {r.stereo && <Panel variant="stereo" label="Stereochemistry" body={r.stereo} icon={Compass} />}
              <Panel variant="mistake" label="Common Mistake" body={r.mistake} icon={ShieldAlert} />
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-white/5 pt-8">
              <div className="flex flex-wrap gap-2">
                {r.tags.map(t => (
                  <span key={t} className="inline-flex px-3.5 py-1.5 rounded-xl text-xs font-bold text-emerald-400/60 border border-emerald-500/10 bg-emerald-500/[0.03]">
                    #{t}
                  </span>
                ))}
              </div>
              {r.audioUrl && (
                <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Audio Guide</span>
                  <audio src={r.audioUrl} controls className="h-8 w-40 opacity-50 hover:opacity-100 transition-opacity" />
                </div>
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

function NamedReactionsTab({ selectedId, onSelect }: { selectedId: string | null; onSelect: (id: string | null) => void }) {
  const [query, setQuery] = useState('');
  const [exam, setExam] = useState('all');
  const [prio, setPrio] = useState('all');
  const [openId, setOpenId] = useState<string | null>(null);

  // Sync internal open state with sidebar selection
  useEffect(() => {
    if (selectedId) setOpenId(selectedId);
  }, [selectedId]);

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

      {!selectedId && (
        <>
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
        </>
      )}

      {selectedId ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedId}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 min-h-[70vh]"
          >
            {REACTIONS.filter(r => r.id === selectedId).map(r => (
              <ReactionCard key={r.id} r={r} isOpen={true} onToggle={() => { }} />
            ))}
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white/[0.01] border border-dashed border-white/10 rounded-3xl animate-in fade-in zoom-in-95 duration-700">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <FlaskConical size={40} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Select a Named Reaction</h2>
          <p className="text-gray-400 text-sm max-w-[280px] text-center leading-relaxed mb-10">
            Browse the list on the left to explore detailed mechanisms, videos, and mastery tips.
          </p>

          <div className="w-full max-w-md px-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/60" size={18} />
              <input
                ref={searchRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search reactions, reagents..."
                className="w-full py-3.5 pl-11 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
            </div>
          </div>

          {query && (
            <div className="mt-8 w-full max-w-md grid grid-cols-1 gap-2 px-6">
              {visible.slice(0, 5).map(r => (
                <button
                  key={r.id}
                  onClick={() => onSelect(r.id)}
                  className="flex items-center gap-3 p-3 bg-white/5 hover:bg-emerald-500/10 border border-white/5 rounded-xl transition-all text-left group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-sm font-semibold text-gray-300 group-hover:text-emerald-300 truncate">{r.name}</span>
                </button>
              ))}
              {visible.length === 0 && (
                <p className="text-center text-xs text-gray-500 py-4 italic">No matching reactions found.</p>
              )}
            </div>
          )}
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
                  <div className="hidden lg:grid grid-cols-2 gap-0 border-b border-white/10 bg-white/5 text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-[20px] pr-5 py-3">
                    <div className="flex flex-row gap-4 items-center w-full pr-10 border-r border-white/5">
                      <div className="flex-[2] truncate">{table.headers[0]}</div>
                      <div className="flex-1 text-center truncate">{table.headers[1]}</div>
                      <div className="flex-[2] text-left truncate">{table.headers[2]}</div>
                    </div>
                    <div className="flex flex-row gap-4 items-center w-full pl-6">
                      <div className="flex-[2] truncate">{table.headers[0]}</div>
                      <div className="flex-1 text-center truncate">{table.headers[1]}</div>
                      <div className="flex-[2] text-left truncate">{table.headers[2]}</div>
                    </div>
                  </div>
                )}
                {/* Fallback headers for md screens only where it's 1 column but row layout */}
                {table.headers && (
                  <div className="hidden md:flex lg:hidden flex-row gap-4 px-5 py-3 border-b border-white/10 bg-white/5 text-[11px] font-bold text-gray-500 uppercase tracking-widest items-center pl-[20px]">
                    <div className="flex-[2] truncate">{table.headers[0]}</div>
                    <div className="flex-1 text-center truncate">{table.headers[1]}</div>
                    <div className="flex-[2] text-left truncate">{table.headers[2]}</div>
                  </div>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-0">
                  {table.rows.map((row, i) => (
                    <div key={i} className={`flex flex-col md:flex-row gap-y-1.5 md:gap-x-4 px-5 lg:px-6 py-2.5 hover:bg-white/[0.03] transition-colors items-start md:items-center border-b border-white/[0.03] ${i % 2 === 0 ? 'lg:border-r lg:border-white/[0.03] lg:pr-10' : 'lg:pl-6'}`}>
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

                      <span className={`flex-[2] w-full text-left leading-snug truncate ${table.title.toLowerCase().includes('pka') ? 'text-[15px] font-bold text-gray-200 tracking-wide' : 'text-[13px] font-medium text-gray-400'}`}>{row.note}</span>
                    </div>
                  ))}
                </div>
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
  const [selectedReactionId, setSelectedReactionId] = useState<string | null>(null);

  const handleSelectReaction = (id: string) => {
    setSelectedReactionId(id);
    setSection('named');
  };

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
            onClick={() => { setSection('lab'); setSelectedReactionId(null); }}
            className={`flex items-center justify-between w-full p-3 rounded-xl text-[14.5px] font-semibold transition-all duration-200 group ${section === 'lab' ? 'bg-cyan-500/15 text-cyan-400 shadow-[inset_3px_0_0_rgba(var(--tw-colors-cyan-500))]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <div className="flex items-center gap-3">
              <Droplet size={18} className={section === 'lab' ? 'text-cyan-400' : 'text-gray-500 group-hover:text-cyan-400'} />
              Acidity Lab
            </div>
            <span className="text-[11px] font-mono bg-black/30 px-2 py-0.5 rounded text-white/50">Sim</span>
          </button>

          <button
            onClick={() => { setSection('phys'); setSelectedReactionId(null); }}
            className={`flex items-center justify-between w-full p-3 rounded-xl text-[14.5px] font-semibold transition-all duration-200 group ${section === 'phys' ? 'bg-blue-500/15 text-blue-400 shadow-[inset_3px_0_0_rgba(var(--tw-colors-blue-500))]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <div className="flex items-center gap-3">
              <BarChart3 size={18} className={section === 'phys' ? 'text-blue-400' : 'text-gray-500 group-hover:text-blue-400'} />
              Physical Lab
            </div>
            <span className="text-[11px] font-mono bg-black/30 px-2 py-0.5 rounded text-white/50">Trends</span>
          </button>

          <button
            onClick={() => { setSection('ref'); setSelectedReactionId(null); }}
            className={`flex items-center justify-between w-full p-3 rounded-xl text-[14.5px] font-semibold transition-all duration-200 group ${section === 'ref' ? 'bg-indigo-500/15 text-indigo-400 shadow-[inset_3px_0_0_rgba(var(--tw-colors-indigo-500))]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <div className="flex items-center gap-3">
              <BookOpen size={18} className={section === 'ref' ? 'text-indigo-400' : 'text-gray-500 group-hover:text-indigo-400'} />
              Quick Reference
            </div>
            <span className="text-[11px] font-mono bg-black/30 px-2 py-0.5 rounded text-white/50">{QUICK_REF.length}</span>
          </button>

          <button
            onClick={() => { setSection('named'); setSelectedReactionId(null); }}
            className={`flex items-center justify-between w-full p-3 rounded-xl text-[14.5px] font-semibold transition-all duration-200 group ${section === 'named' ? 'bg-emerald-500/15 text-emerald-400 shadow-[inset_3px_0_0_rgba(var(--tw-colors-emerald-500))]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <div className="flex items-center gap-3">
              <FlaskConical size={18} className={section === 'named' ? 'text-emerald-400' : 'text-gray-500 group-hover:text-emerald-400'} />
              Name Reactions
            </div>
            <span className="text-[11px] font-mono bg-black/30 px-2 py-0.5 rounded text-white/50">{REACTIONS.length}</span>
          </button>

          {/* Conditional Sidebar Expansion for Name Reactions */}
          {section === 'named' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-4 flex-1 flex flex-col min-h-0 border-t border-white/5 pt-4"
            >
              <div className="flex items-center justify-between px-3 mb-3 shrink-0">
                <div className="text-[10px] font-bold text-white/30 tracking-[0.2em] uppercase">Existing Reactions</div>
                <span className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded-full text-white/40 border border-white/5">{REACTIONS.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1 pr-1">
                {REACTIONS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleSelectReaction(r.id)}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-all truncate flex items-center gap-2.5 group/item ${selectedReactionId === r.id ? 'bg-emerald-500/15 border-l-2 border-emerald-500 text-emerald-300 font-semibold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.5)]"
                      style={{ backgroundColor: TYPE_COLOR[r.type] ? TYPE_COLOR[r.type][2] : '#6ee7b7' }}
                    />
                    <span className="truncate group-hover/item:translate-x-0.5 transition-transform duration-200">{r.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
          <div className="mt-auto pt-8 border-t border-white/5 px-3">
            <div className="text-[12px] font-bold text-white/20 tracking-[0.15em] mb-4 uppercase">Keyboard Shortcuts</div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-[13.5px] text-gray-400 font-medium group/key">
                <span className="group-hover/key:text-gray-300 transition-colors">Focus Search</span>
                <kbd className="min-w-[24px] h-6 flex items-center justify-center px-1.5 bg-white/5 rounded border border-white/10 text-[11px] text-emerald-400 font-mono shadow-sm shadow-black/20" style={{ fontFamily: 'var(--font-geist-mono),monospace' }}>/</kbd>
              </div>
              <div className="flex items-center justify-between text-[13.5px] text-gray-400 font-medium group/key">
                <span className="group-hover/key:text-gray-300 transition-colors">Clear Search</span>
                <kbd className="px-2 h-6 flex items-center justify-center bg-white/5 rounded border border-white/10 text-[11px] text-emerald-400 font-mono shadow-sm shadow-black/20" style={{ fontFamily: 'var(--font-geist-mono),monospace' }}>Esc</kbd>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 pb-10 md:pb-40 scroll-smooth">
          <div className="max-w-6xl mx-auto min-h-full flex flex-col">
            <div className="flex-1">
              {section === 'named' && (
                <NamedReactionsTab
                  selectedId={selectedReactionId}
                  onSelect={setSelectedReactionId}
                />
              )}
              {section === 'lab' && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><AcidityLab /></div>}
              {section === 'phys' && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><PhysicalPropertiesLab /></div>}
              {section === 'ref' && <QuickReferenceTab />}
            </div>
            <div className="mt-20">
              <TheCrucibleCTA />
              <InorganicTrendsCTA />
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[60px] bg-[#0d1117]/95 backdrop-blur-3xl border-t border-white/10 flex items-center justify-around px-2 z-50">
        <button
          onClick={() => { setSection('lab'); setSelectedReactionId(null); }}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 ${section === 'lab' ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Droplet size={20} />
          <span className="text-[10px] font-semibold">Acidity</span>
        </button>
        <button
          onClick={() => { setSection('phys'); setSelectedReactionId(null); }}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 ${section === 'phys' ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <BarChart3 size={20} />
          <span className="text-[10px] font-semibold">Properties</span>
        </button>
        <button
          onClick={() => { setSection('ref'); setSelectedReactionId(null); }}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 ${section === 'ref' ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <BookOpen size={20} />
          <span className="text-[10px] font-semibold">Reference</span>
        </button>
        <button
          onClick={() => { setSection('named'); setSelectedReactionId(null); }}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 ${section === 'named' ? 'text-emerald-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <FlaskConical size={20} />
          <span className="text-[10px] font-semibold">Reactions</span>
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
