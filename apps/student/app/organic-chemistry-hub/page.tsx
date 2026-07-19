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
  BarChart3, Dna, Atom
} from 'lucide-react';
import BiomoleculesSimulator from './BiomoleculesSimulator';
import SN1SN2Simulator from './SN1SN2Simulator';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';

// Convert Unicode subscripts/superscripts to HTML <sub>/<sup> tags
function chem(text: string): string {
  return text
    .replace(/₀/g, '<sub>0</sub>').replace(/₁/g, '<sub>1</sub>').replace(/₂/g, '<sub>2</sub>')
    .replace(/₃/g, '<sub>3</sub>').replace(/₄/g, '<sub>4</sub>').replace(/₅/g, '<sub>5</sub>')
    .replace(/₆/g, '<sub>6</sub>').replace(/₇/g, '<sub>7</sub>').replace(/₈/g, '<sub>8</sub>')
    .replace(/₉/g, '<sub>9</sub>')
    .replace(/⁰/g, '<sup>0</sup>').replace(/¹/g, '<sup>1</sup>').replace(/²/g, '<sup>2</sup>')
    .replace(/³/g, '<sup>3</sup>').replace(/⁴/g, '<sup>4</sup>').replace(/⁵/g, '<sup>5</sup>')
    .replace(/⁶/g, '<sup>6</sup>').replace(/⁷/g, '<sup>7</sup>').replace(/⁸/g, '<sup>8</sup>')
    .replace(/⁹/g, '<sup>9</sup>').replace(/⁺/g, '<sup>+</sup>').replace(/⁻/g, '<sup>−</sup>')
    .replace(/⁼/g, '<sup>=</sup>');
}

// Tailwind color maps for chips
const bgColors: Record<string, string> = {
  blue: 'bg-blue-500/15 border-blue-500/40 text-blue-300',
  red: 'bg-orange-500/10 border-orange-500/25 text-rose-300/80',
  green: 'bg-[#4E8CFF]/15 border-[#4E8CFF]/40 text-[#cfe0ff]',
  amber: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
  indigo: 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300',
  teal: 'bg-teal-500/15 border-teal-500/40 text-teal-300',
  purple: 'bg-purple-500/15 border-purple-500/40 text-purple-300',
};

// Simplified Reaction View - Focused on pedagogical clarity and visual impact

function Panel({ variant, label, body, icon: Icon }: { variant: 'stereo' | 'mistake' | 'hook' | 'jee'; label: string; body: string; icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }> }) {
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
  const typeStyle = {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.08)',
    color: c[2]
  };

  const pb = r.priority === 'high' ? 'bg-orange-500/15 text-orange-300 border-orange-500/25' : r.priority === 'medium' ? 'bg-amber-500/15 text-amber-300 border-amber-500/25' : 'bg-[#4E8CFF]/15 text-[#cfe0ff] border-[#4E8CFF]/25';
  const eb = r.exam === 'both' ? 'bg-blue-500/15 text-blue-300 border-blue-500/25' : r.exam === 'advanced' ? 'bg-lime-500/15 text-lime-300 border-lime-500/25' : 'bg-sky-500/15 text-sky-300 border-sky-500/25';
  const cb = 'bg-white/[0.04] text-gray-400 border-white/10';

  const pLabel = r.priority === 'high' ? 'High' : r.priority === 'medium' ? 'Medium' : 'Low';
  const eLabel = r.exam === 'both' ? 'Mains + Adv' : r.exam === 'advanced' ? 'Adv only' : 'Mains';

  return (
    <motion.div
      layout
      className={`rounded-2xl transition-colors duration-200 ${isOpen ? 'bg-transparent border-transparent' : 'rounded-2xl border mb-3 bg-[#161C24] border-white/[0.07] hover:border-[#4E8CFF]/40'}`}
    >
      <div onClick={onToggle} className="p-5 cursor-pointer select-none">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="text-[18px] font-semibold text-[#E6EAF0] tracking-tight">{r.name}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 text-[10px] tracking-wide font-[family-name:var(--font-geist-mono)]">
              <span className="inline-flex px-2 py-0.5 rounded-md border whitespace-nowrap" style={typeStyle}>{r.type}</span>
              <span className={`inline-flex px-2 py-0.5 rounded-md border whitespace-nowrap ${cb}`}>{r.chapter}</span>
              <span className={`inline-flex px-2 py-0.5 rounded-md border whitespace-nowrap ${pb}`}>{pLabel} Priority</span>
              <span className={`inline-flex px-2 py-0.5 rounded-md border whitespace-nowrap ${eb}`}>{eLabel}</span>
            </div>
          </div>
          {!isOpen && (
            <motion.div className="shrink-0 text-gray-500 p-2 bg-gray-800/40 hover:bg-gray-700/50 rounded-md transition-all">
              <ChevronDown size={18} />
            </motion.div>
          )}
        </div>

        <div className="text-[16px] text-gray-300 leading-relaxed mt-4 lining-nums font-medium prose prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex, rehypeRaw]}>
            {r.summary
              ? r.summary
                .replace(/Reagent:/g, '<span class="text-[#6FA8FF] font-bold">Reagent:</span>')
                .replace(/Mechanism:/g, '<span class="text-[#6FA8FF] font-bold">Mechanism:</span>')
                .replace(/Benefit:/g, '<span class="text-purple-400 font-bold">Benefit:</span>')
              : ''}
          </ReactMarkdown>
        </div>

        <AnimatePresence>
          {!isOpen && r.tags && r.tags.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-wrap gap-1.5 mt-4">
              {r.tags.slice(0, 5).map(t => (
                <span key={t} className="inline-flex px-2.5 py-1 rounded-md text-[11px] text-gray-400 border border-white/[0.06] bg-white/[0.02] font-[family-name:var(--font-geist-mono)]">
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
                    <div key={idx} className="rounded-2xl overflow-hidden border border-white/[0.06] bg-[#10151C] p-8 flex justify-center relative group/img">
                      <div className="absolute inset-0 bg-gradient-to-b from-[#4E8CFF]/5 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity" />
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
                  <span key={t} className="inline-flex px-3 py-1.5 rounded-lg text-[11px] text-[#6FA8FF]/70 border border-[#4E8CFF]/15 bg-[#4E8CFF]/[0.04] font-[family-name:var(--font-geist-mono)]">
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
  const base = "px-3 py-1 rounded-lg border text-[12px] font-medium transition-colors duration-150 cursor-pointer whitespace-nowrap flex items-center gap-2 font-[family-name:var(--font-geist-mono)] ";
  if (!active) {
    return <button onClick={onClick} className={base + "border-white/10 bg-white/[0.03] text-gray-400 hover:bg-white/[0.06] hover:text-white"}>{children}</button>;
  }
  const colorStr = bgColors[color || 'blue'] || bgColors.blue;
  return <button onClick={onClick} className={base + colorStr}>{children}</button>;
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
      <div style={{ marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, font: `400 11.5px ${SANS}`, color: '#5e6774', marginBottom: 7 }}>
          Organic Hub <span style={{ opacity: 0.5 }}>/</span> <span style={{ color: '#8a94a3' }}>Reference</span>
        </div>
        <h2 style={{ margin: 0, font: `600 23px ${SANS}`, color: '#E6EAF0', letterSpacing: '-.01em' }}>Name Reactions</h2>
        <p style={{ margin: '6px 0 0', font: `400 12.5px ${SANS}`, color: '#7a8494', maxWidth: 560 }}>
          Every name reaction for CBSE / JEE / NEET with handwritten mechanisms and revision key-points.
        </p>
      </div>

      {!selectedId && (
        <>
          <div className="relative mb-4">
            <div className="relative flex items-center">
              <Search className="absolute left-4 text-[#4E8CFF]/70" size={18} />
              <input
                ref={searchRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search reactions, reagents, compounds…  ( / to focus )"
                className="w-full py-3.5 pl-11 pr-11 rounded-xl focus:outline-none text-[14px]"
                style={{ background: '#161C24', border: '1px solid rgba(255,255,255,.07)', color: '#E6EAF0', fontFamily: SANS }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(78,140,255,.5)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.07)'; }}
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-3 text-gray-500 hover:text-white transition-colors bg-white/5 p-1 rounded-md">
                  &times;
                </button>
              )}
            </div>
          </div>

          <div className="mb-8 flex flex-col gap-3" style={{ padding: 16, background: '#12181F', borderRadius: 12, border: '1px solid rgba(255,255,255,.06)' }}>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 min-w-[64px]" style={{ font: `600 10px ${MONO}`, letterSpacing: '.12em', textTransform: 'uppercase', color: '#5e6774' }}>
                <Droplet size={13} /> Exam
              </div>
              <div className="flex gap-2 flex-wrap">
                <Chip active={exam === 'all'} onClick={() => setExam('all')}>All</Chip>
                <Chip active={exam === 'mains'} onClick={() => setExam('mains')} color="blue">JEE Mains</Chip>
                <Chip active={exam === 'advanced'} onClick={() => setExam('advanced')} color="red">JEE Advanced</Chip>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 min-w-[64px]" style={{ font: `600 10px ${MONO}`, letterSpacing: '.12em', textTransform: 'uppercase', color: '#5e6774' }}>
                <AlertTriangle size={13} /> Prio
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
        <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white/[0.01] border border-dashed border-white/10 rounded-2xl animate-in fade-in zoom-in-95 duration-700">
          <div className="w-20 h-20 bg-[#4E8CFF]/10 rounded-full flex items-center justify-center mb-6">
            <FlaskConical size={40} className="text-[#6FA8FF]" />
          </div>
          <h2 className="text-2xl font-semibold text-[#E6EAF0] mb-2 tracking-tight">Select a Named Reaction</h2>
          <p className="text-gray-400 text-sm max-w-[280px] text-center leading-relaxed mb-10">
            Browse the list on the left to explore detailed mechanisms, videos, and mastery tips.
          </p>

          <div className="w-full max-w-md px-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4E8CFF]/60" size={18} />
              <input
                ref={searchRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search reactions, reagents..."
                className="w-full py-3.5 pl-11 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#4E8CFF]/50 transition-all"
              />
            </div>
          </div>

          {query && (
            <div className="mt-8 w-full max-w-md grid grid-cols-1 gap-2 px-6">
              {visible.slice(0, 5).map(r => (
                <button
                  key={r.id}
                  onClick={() => onSelect(r.id)}
                  className="flex items-center gap-3 p-3 bg-white/5 hover:bg-[#4E8CFF]/10 border border-white/5 rounded-xl transition-all text-left group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6FA8FF] shrink-0" />
                  <span className="text-sm font-semibold text-gray-300 group-hover:text-[#cfe0ff] truncate">{r.name}</span>
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
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, font: `400 11.5px ${SANS}`, color: '#5e6774', marginBottom: 7 }}>
          Organic Hub <span style={{ opacity: 0.5 }}>/</span> <span style={{ color: '#8a94a3' }}>Reference</span>
        </div>
        <h2 style={{ margin: 0, font: `600 23px ${SANS}`, color: '#E6EAF0', letterSpacing: '-.01em' }}>Quick Reference</h2>
        <p style={{ margin: '6px 0 0', font: `400 12.5px ${SANS}`, color: '#7a8494', maxWidth: 560 }}>
          pKₐ values, reagents and functional-group cheat sheets for fast revision.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto pb-4 mb-6 no-scrollbar gap-2 -mx-4 px-4 md:mx-0 md:px-0">
        {QUICK_REF.map((t, i) => (
          <button
            key={t.title}
            onClick={() => setActiveTab(i)}
            className="whitespace-nowrap rounded-lg border transition-colors"
            style={activeTab === i
              ? { padding: '7px 14px', font: `600 12.5px ${SANS}`, background: 'rgba(78,140,255,.12)', borderColor: 'rgba(78,140,255,.5)', color: '#cfe0ff' }
              : { padding: '7px 14px', font: `500 12.5px ${SANS}`, background: '#161C24', borderColor: 'rgba(255,255,255,.07)', color: '#8a94a3' }}
          >
            {t.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {table && (
          <div key={table.title} className="bg-[#12181F] border border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06] bg-white/[0.02] flex flex-col gap-1">
              <div className="text-[16px] font-semibold text-[#E6EAF0] flex items-center gap-2">
                <Hash size={16} className="text-[#6FA8FF]" /> {table.title}
              </div>
              {table.description && <p className="text-[13px] text-gray-400 leading-relaxed">{table.description}</p>}
            </div>

            {table.layout === 'grid' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-5 bg-white/[0.01]">
                {table.rows.map((row, i) => (
                  <div key={i} className="flex flex-col sm:flex-row gap-5 p-5 bg-[#161C24] rounded-xl border border-white/[0.06] hover:border-[#4E8CFF]/40 transition-colors group overflow-hidden relative">
                    <div className="w-24 h-24 shrink-0 bg-[#10151C] rounded-xl flex items-center justify-center p-2 border border-white/[0.06] relative z-10">
                      {row.svg && (
                        <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: row.svg }} />
                      )}
                    </div>
                    <div className="flex-1 relative z-10 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-3 mb-2">
                        <h4 className="text-[16px] font-semibold text-[#E6EAF0] leading-tight">{row.name}</h4>
                        <span className="shrink-0 self-start text-[13px] text-[#cfe0ff] bg-[#4E8CFF]/10 px-3 py-1 rounded-full border border-[#4E8CFF]/20 font-[family-name:var(--font-geist-mono)]">{row.value}</span>
                      </div>
                      <p className="text-[13px] text-gray-400 leading-relaxed line-clamp-3">{row.note}</p>
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
                          <span className="text-[15.5px] font-semibold text-white/90 truncate" dangerouslySetInnerHTML={{ __html: chem(row.name) }} />
                        </div>

                        {/* Mobile Value Badge */}
                        <span className="md:hidden shrink-0 text-[13.5px] text-[#cfe0ff] font-[family-name:var(--font-geist-mono)] bg-[#4E8CFF]/10 px-2.5 py-1 rounded-md">{row.value}</span>
                      </div>

                      {/* Desktop Value Badge */}
                      <div className="hidden md:flex flex-1 justify-center">
                        <span className="text-[13.5px] text-[#cfe0ff] font-[family-name:var(--font-geist-mono)] bg-[#4E8CFF]/10 px-2.5 py-1 rounded-md truncate">{row.value}</span>
                      </div>

                      <span className={`flex-[2] w-full text-left leading-snug truncate ${table.title.toLowerCase().includes('pka') ? 'text-[16px] font-bold text-gray-200 tracking-wide' : 'text-[14px] font-medium text-gray-400'}`} dangerouslySetInnerHTML={{ __html: chem(row.note ?? '') }} />
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
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#4E8CFF]/5 blur-[60px] -z-10 rounded-full group-hover:bg-[#4E8CFF]/10 transition-all duration-700" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-[#4E8CFF]/10 text-[#6FA8FF]/80 text-[9px] font-bold uppercase tracking-wider mb-2 border border-[#4E8CFF]/10">
            <Sparkles size={10} /> 3000+ Questions & PYQs
          </div>
          <h3 className="text-lg font-bold text-white/90 mb-1 tracking-tight truncate">The Crucible</h3>
          <p className="text-gray-500 text-[12.5px] leading-snug">
            Curated problem bank with complete JEE/NEET PYQs.
          </p>
        </div>
        <Link
          href="/the-crucible"
          className="group/btn relative px-5 py-2.5 rounded-xl bg-[#4E8CFF]/90 text-black font-bold text-[12px] hover:bg-[#6FA8FF] hover:scale-105 active:scale-95 transition-all shadow-lg shrink-0 overflow-hidden"
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

const SANS = "var(--font-ibm-plex-sans), 'IBM Plex Sans', system-ui, sans-serif";
const MONO = "var(--font-geist-mono), 'Geist Mono', monospace";

type HubSection = 'named' | 'lab' | 'phys' | 'ref' | 'bio' | 'stereo';

const NAV_ITEMS: { id: HubSection; label: string; tag: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }[] = [
  { id: 'lab', label: 'Acidity Lab', tag: 'Sim', Icon: Droplet },
  { id: 'phys', label: 'Physical Lab', tag: 'Trends', Icon: BarChart3 },
  { id: 'ref', label: 'Quick Reference', tag: String(QUICK_REF.length), Icon: BookOpen },
  { id: 'named', label: 'Name Reactions', tag: String(REACTIONS.length), Icon: FlaskConical },
  { id: 'bio', label: 'Biomolecules', tag: 'Sim', Icon: Dna },
  { id: 'stereo', label: 'SN1 vs SN2', tag: 'Sim', Icon: Atom },
];

export default function OrganicMasterPage() {
  const [section, setSection] = useState<HubSection>('lab');
  const [selectedReactionId, setSelectedReactionId] = useState<string | null>(null);

  const handleSelectReaction = (id: string) => {
    setSelectedReactionId(id);
    setSection('named');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0E1319] text-[#c8cfda] selection:bg-[#4E8CFF]/30 overflow-hidden" style={{ fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans', system-ui, sans-serif" }}>

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#4E8CFF]/[0.04] blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#7A6BFF]/[0.04] blur-[130px]" />
      </div>

      <div className="flex flex-col md:flex-row h-[calc(100vh-88px-60px)] md:h-[calc(100vh-88px)] mt-[88px] relative z-10 w-full md:w-[96%] max-w-[1380px] mx-auto md:rounded-t-3xl overflow-hidden md:ring-1 md:ring-white/[0.08] md:bg-[#0E1319]/60 md:shadow-2xl">

        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:flex shrink-0 flex-col overflow-y-auto custom-scrollbar" style={{ width: 224, background: '#0A0E13', borderRight: '1px solid rgba(255,255,255,.06)', padding: '22px 14px' }}>
          {/* Wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '0 8px 20px' }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(140deg,#4E8CFF,#7A6BFF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FlaskConical size={15} color="#fff" strokeWidth={1.9} />
            </div>
            <div style={{ font: `600 12.5px ${SANS}`, letterSpacing: '.14em', color: '#c3ccd9' }}>ORGANIC&nbsp;HUB</div>
          </div>

          {/* Nav items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {NAV_ITEMS.map(item => {
              const isActive = section === item.id;
              const Icon = item.Icon;
              return (
                <button
                  key={item.id}
                  onClick={() => { setSection(item.id); setSelectedReactionId(null); }}
                  style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 11, padding: '9px 11px', borderRadius: 9, background: isActive ? 'rgba(78,140,255,.13)' : 'transparent', color: isActive ? '#cfe0ff' : '#8a94a3', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background .15s, color .15s' }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,.04)'; e.currentTarget.style.color = '#e6eaf0'; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8a94a3'; } }}
                >
                  {isActive && <span style={{ position: 'absolute', left: 0, top: 9, bottom: 9, width: 2.5, borderRadius: 2, background: '#4E8CFF' }} />}
                  <Icon size={17} strokeWidth={1.7} />
                  <span style={{ flex: 1, font: `${isActive ? 600 : 500} 13.5px ${SANS}` }}>{item.label}</span>
                  <span style={{ font: `500 10px ${MONO}`, color: isActive ? '#8fb3ff' : '#616b79', background: isActive ? 'rgba(78,140,255,.15)' : 'rgba(255,255,255,.05)', padding: '2px 6px', borderRadius: 5 }}>{item.tag}</span>
                </button>
              );
            })}
          </div>

          {/* Conditional Sidebar Expansion for Name Reactions */}
          {section === 'named' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              style={{ marginTop: 16, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, borderTop: '1px solid rgba(255,255,255,.05)', paddingTop: 16 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 3px', marginBottom: 12 }}>
                <span style={{ font: `600 9.5px ${MONO}`, letterSpacing: '.14em', color: '#4c5563' }}>ALL REACTIONS</span>
                <span style={{ font: `500 10px ${MONO}`, color: '#616b79', background: 'rgba(255,255,255,.05)', padding: '2px 6px', borderRadius: 999 }}>{REACTIONS.length}</span>
              </div>
              <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, paddingRight: 2 }}>
                {REACTIONS.map((r) => {
                  const on = selectedReactionId === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => handleSelectReaction(r.id)}
                      style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: 9, padding: '7px 9px', borderRadius: 7, background: on ? 'rgba(78,140,255,.13)' : 'transparent', color: on ? '#cfe0ff' : '#8a94a3', border: 'none', cursor: 'pointer', font: `${on ? 600 : 500} 12.5px ${SANS}`, whiteSpace: 'nowrap', overflow: 'hidden' }}
                      onMouseEnter={e => { if (!on) e.currentTarget.style.background = 'rgba(255,255,255,.04)'; }}
                      onMouseLeave={e => { if (!on) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: '50%', flex: 'none', backgroundColor: TYPE_COLOR[r.type] ? TYPE_COLOR[r.type][2] : '#8B93A7' }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Shortcuts */}
          <div style={{ marginTop: 'auto', padding: '14px 10px 4px', borderTop: '1px solid rgba(255,255,255,.05)' }}>
            <div style={{ font: `600 9.5px ${MONO}`, letterSpacing: '.14em', color: '#4c5563', marginBottom: 9 }}>SHORTCUTS</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
              <span style={{ font: `400 12px ${SANS}`, color: '#6f7987' }}>Focus search</span>
              <kbd style={{ font: `500 10.5px ${MONO}`, color: '#8a94a3', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 5, padding: '1px 6px' }}>/</kbd>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ font: `400 12px ${SANS}`, color: '#6f7987' }}>Clear</span>
              <kbd style={{ font: `500 10.5px ${MONO}`, color: '#8a94a3', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 5, padding: '1px 6px' }}>Esc</kbd>
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
              {section === 'bio' && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><BiomoleculesSimulator /></div>}
              {section === 'stereo' && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><SN1SN2Simulator /></div>}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[60px] flex items-center justify-around px-2 z-50" style={{ background: 'rgba(10,14,19,0.96)', backdropFilter: 'blur(24px)', borderTop: '1px solid rgba(255,255,255,.08)' }}>
        {NAV_ITEMS.map(item => {
          const isActive = section === item.id;
          const Icon = item.Icon;
          const shortLabel: Record<HubSection, string> = { lab: 'Acidity', phys: 'Properties', ref: 'Reference', named: 'Reactions', bio: 'Bio', stereo: 'Stereo' };
          return (
            <button
              key={item.id}
              onClick={() => { setSection(item.id); setSelectedReactionId(null); }}
              className="flex flex-col items-center justify-center w-full h-full gap-1"
              style={{ color: isActive ? '#4E8CFF' : '#6f7987' }}
            >
              <Icon size={20} strokeWidth={1.8} />
              <span style={{ font: `600 10px ${SANS}` }}>{shortLabel[item.id]}</span>
            </button>
          );
        })}
      </nav>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(78, 140, 255, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(78, 140, 255, 0.4); }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        /* Make subscripts and superscripts much more readable in chemical formulas */
        sub, sup {
          font-size: 0.85em !important;
          line-height: 0;
          position: relative;
          vertical-align: baseline;
          font-weight: 700;
        }
        
        sup {
          top: -0.5em;
        }
        
        sub {
          bottom: -0.25em;
        }
      `}} />
    </div>
  );
}
