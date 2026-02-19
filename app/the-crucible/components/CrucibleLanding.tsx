"use client";

import { useState, useEffect, useCallback } from 'react';
import { Flame, ChevronLeft, LogIn, LayoutGrid, Clock, Timer, X, ChevronRight, Star, Check } from 'lucide-react';
import { Chapter, Question } from './types';
import MathRenderer from '@/app/crucible/admin/components/MathRenderer';

interface CrucibleLandingProps { chapters: Chapter[]; }
type View = 'landing' | 'shloka' | 'browse' | 'test' | 'test-config';

const CAT_COLOR: Record<string, string> = { Physical: '#38bdf8', Organic: '#a78bfa', Inorganic: '#34d399', Practical: '#fbbf24' };
const CLS_COLOR: Record<string, string> = { '11': '#38bdf8', '12': '#a78bfa' };
const DAYS = ['M','T','W','T','F','S','S'];
const PLACEHOLDER = { streak: 14, attempted: 1205, totalQ: 2530, mastered: 4, masteredOf: 28, accuracy: 72, activeDays: [0,1,2,3,4] };

// ── Tiny progress bar ────────────────────────────────────────────────────────
function Bar({ value, color, h = 3 }: { value: number; color: string; h?: number }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 99, height: h, overflow: 'hidden', width: '100%' }}>
      <div style={{ width: `${Math.max(value > 0 ? 2 : 0, value)}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.55s cubic-bezier(.4,0,.2,1)', boxShadow: value > 0 ? `0 0 6px ${color}55` : 'none' }} />
    </div>
  );
}

// ── Shloka loading screen (2 seconds) ────────────────────────────────────────
function ShlokaScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 1600); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at center,#1a0e00 0%,#0a0700 45%,#050507 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-60%)', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(180,100,0,0.18) 0%,transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ fontSize: 52, color: 'rgba(160,100,20,0.55)', marginBottom: 24, fontFamily: 'serif', lineHeight: 1 }}>{String.fromCodePoint(0x0950)}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ width: 60, height: 1, background: 'linear-gradient(to right, transparent, rgba(180,130,40,0.4))' }} />
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(180,130,40,0.5)' }} />
        <div style={{ width: 60, height: 1, background: 'linear-gradient(to left, transparent, rgba(180,130,40,0.4))' }} />
      </div>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <p style={{ fontSize: 'clamp(32px,7vw,52px)', fontWeight: 900, fontFamily: 'serif', lineHeight: 1.35, margin: 0, background: 'linear-gradient(180deg,#fde68a 0%,#f59e0b 50%,#b45309 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          {String.fromCodePoint(0x0909,0x0926,0x094D,0x092F,0x092E,0x0947,0x0928)} {String.fromCodePoint(0x0939,0x093F)} {String.fromCodePoint(0x0938,0x093F,0x0927,0x094D,0x092F,0x0928,0x094D,0x0924,0x093F)}
        </p>
        <p style={{ fontSize: 'clamp(32px,7vw,52px)', fontWeight: 900, fontFamily: 'serif', lineHeight: 1.35, margin: 0, background: 'linear-gradient(180deg,#fde68a 0%,#f59e0b 50%,#b45309 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          {String.fromCodePoint(0x0915,0x093E,0x0930,0x094D,0x092F,0x093E,0x0923,0x093F)} {String.fromCodePoint(0x0928)} {String.fromCodePoint(0x092E,0x0928,0x094B,0x0930,0x0925,0x0948,0x0903)}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
        <div style={{ width: 60, height: 1, background: 'linear-gradient(to right, transparent, rgba(180,130,40,0.4))' }} />
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(180,130,40,0.5)' }} />
        <div style={{ width: 60, height: 1, background: 'linear-gradient(to left, transparent, rgba(180,130,40,0.4))' }} />
      </div>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textAlign: 'center', maxWidth: 320, lineHeight: 1.6 }}>
        Tasks are accomplished through effort,<br />not by mere wishes.
      </p>
      <div style={{ display: 'flex', gap: 8, marginTop: 36 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#d97706', animation: `shloka-dot 1.4s ease-in-out ${i * 0.2}s infinite` }} />
        ))}
      </div>
      <style>{`@keyframes shloka-dot { 0%,80%,100% { opacity:0.25; transform:scale(0.75); } 40% { opacity:1; transform:scale(1.1); } }`}</style>
    </div>
  );
}

// ── Progress card (matches screenshot 1) ────────────────────────────────────
function ProgressCard({ isLoggedIn }: { isLoggedIn: boolean }) {
  const p = PLACEHOLDER;
  const pct = Math.round((p.attempted / p.totalQ) * 100);
  const C = 2 * Math.PI * 30;
  return (
    <div style={{ background: 'linear-gradient(145deg,rgba(30,20,60,0.9),rgba(15,12,30,0.95))', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 18, padding: '18px 20px 14px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 14 }}>Your Progress</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <svg width="72" height="72" viewBox="0 0 72 72" style={{ flexShrink: 0 }}>
          <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6"/>
          <circle cx="36" cy="36" r="30" fill="none" stroke="url(#ring-grad)" strokeWidth="6" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)}
            transform="rotate(-90 36 36)" style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)' }}
          />
          <defs><linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#38bdf8"/><stop offset="100%" stopColor="#818cf8"/></linearGradient></defs>
          <text x="36" y="33" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="800" fontFamily="monospace">{pct}%</text>
          <text x="36" y="46" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="sans-serif">complete</text>
        </svg>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 28px', flex: 1 }}>
          <div><div style={{ fontSize: 22, fontWeight: 800, color: '#a78bfa', fontFamily: 'monospace', lineHeight: 1 }}>{p.attempted.toLocaleString()}</div><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>Attempted</div></div>
          <div><div style={{ fontSize: 22, fontWeight: 800, color: '#38bdf8', fontFamily: 'monospace', lineHeight: 1 }}>{p.totalQ.toLocaleString()}</div><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>Total Qs</div></div>
          <div><div style={{ fontSize: 22, fontWeight: 800, color: '#34d399', fontFamily: 'monospace', lineHeight: 1 }}>{p.mastered}/{p.masteredOf}</div><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>Mastered</div></div>
          <div><div style={{ fontSize: 22, fontWeight: 800, color: '#fbbf24', fontFamily: 'monospace', lineHeight: 1 }}>{p.accuracy}%</div><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>Accuracy</div></div>
        </div>
      </div>
      <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '14px 0 12px' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#f97316' }}>{String.fromCodePoint(0x1F525)} {p.streak}-day streak</span>
        <div style={{ display: 'flex', gap: 5 }}>
          {DAYS.map((d, i) => (
            <div key={i} style={{ width: 26, height: 26, borderRadius: 7, background: p.activeDays.includes(i) ? '#b45309' : 'rgba(255,255,255,0.07)', border: `1px solid ${p.activeDays.includes(i) ? '#d97706' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: p.activeDays.includes(i) ? '#fde68a' : 'rgba(255,255,255,0.3)' }}>{d}</div>
          ))}
        </div>
      </div>
      {!isLoggedIn && (
        <button style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 7, padding: '7px 16px', background: 'rgba(124,58,237,0.18)', border: '1px solid rgba(124,58,237,0.35)', borderRadius: 10, color: '#a78bfa', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
          <LogIn style={{ width: 13, height: 13 }} /> Log in to track real progress
        </button>
      )}
    </div>
  );
}

// ── Chapter row inside bottom sheet ─────────────────────────────────────────
function ChapterRow({ ch, selected, onToggle }: { ch: Chapter; selected: Set<string>; onToggle: (id: string) => void }) {
  const isSel  = selected.has(ch.id);
  const accent = CAT_COLOR[ch.category ?? 'Physical'];
  const qCount = ch.question_count ?? 0;
  return (
    <div onClick={() => onToggle(ch.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: isSel ? `${accent}12` : 'transparent', borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', transition: 'background 0.12s', userSelect: 'none' }}>
      <div style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, border: `1.5px solid ${isSel ? accent : 'rgba(255,255,255,0.25)'}`, background: isSel ? accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
        {isSel && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L4 7L9 1" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 14, lineHeight: 1.3, color: isSel ? '#fff' : 'rgba(255,255,255,0.85)', fontWeight: isSel ? 600 : 400 }}>{ch.name}</span>
          <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'monospace', color: qCount > 0 ? accent : 'rgba(255,255,255,0.3)', marginLeft: 12, flexShrink: 0 }}>
            {qCount > 0 ? `${qCount} Q` : '—'}
          </span>
        </div>
        <Bar value={qCount > 0 ? Math.min(100, Math.round((qCount / 200) * 100)) : 0} color={accent} h={2} />
      </div>
    </div>
  );
}

// ── Bottom sheet ─────────────────────────────────────────────────────────────
function ChapterSheet({ classLevel, chapters, selected, onToggle, onClose, onSelectAll, onClearClass }: {
  classLevel: number; chapters: Chapter[]; selected: Set<string>;
  onToggle: (id: string) => void; onClose: () => void; onSelectAll: () => void; onClearClass: () => void;
}) {
  const color    = CLS_COLOR[String(classLevel)];
  const selCount = chapters.filter(c => selected.has(c.id)).length;
  const totalQ   = chapters.reduce((s, c) => s + (c.question_count ?? 0), 0);
  const selQ     = chapters.filter(c => selected.has(c.id)).reduce((s, c) => s + (c.question_count ?? 0), 0);
  const grouped: Record<string, Chapter[]> = {};
  chapters.forEach(ch => { const cat = ch.category ?? 'Physical'; (grouped[cat] = grouped[cat] || []).push(ch); });
  const catOrder = ['Physical', 'Inorganic', 'Organic', 'Practical'];
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#0d0f1a', borderRadius: '22px 22px 0 0', border: '1px solid rgba(255,255,255,0.1)', borderBottom: 'none', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 -20px 60px rgba(0,0,0,0.7)', animation: 'sheetUp 0.3s cubic-bezier(.32,.72,0,1)', maxWidth: 720, width: '100%', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}><div style={{ width: 36, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.15)' }} /></div>
        <div style={{ padding: '8px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#000' }}>{classLevel}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Class {classLevel}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{chapters.length} chapters · {totalQ.toLocaleString()} questions</div>
              </div>
            </div>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.07)', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: selCount > 0 ? color : 'rgba(255,255,255,0.45)', fontWeight: selCount > 0 ? 600 : 400 }}>
              {selCount > 0 ? `${selCount} chapters · ${selQ.toLocaleString()} Qs selected` : 'Tap chapters to select'}
            </span>
            <div style={{ display: 'flex', gap: 14 }}>
              <button onClick={onSelectAll} style={{ fontSize: 12, color, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>All</button>
              {selCount > 0 && <button onClick={onClearClass} style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>}
            </div>
          </div>
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {catOrder.filter(cat => grouped[cat]?.length).map(cat => (
            <div key={cat}>
              <div style={{ padding: '8px 16px 4px', display: 'flex', alignItems: 'center', gap: 8, position: 'sticky', top: 0, background: '#0d0f1a', zIndex: 2 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: CAT_COLOR[cat], flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: CAT_COLOR[cat], textTransform: 'uppercase' }}>{cat}</span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginLeft: 'auto' }}>{grouped[cat].reduce((s, c) => s + (c.question_count ?? 0), 0)} Qs</span>
              </div>
              {grouped[cat].map(ch => <ChapterRow key={ch.id} ch={ch} selected={selected} onToggle={onToggle} />)}
            </div>
          ))}
          <div style={{ height: 20 }} />
        </div>
        <div style={{ padding: '12px 16px 32px', borderTop: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
          <button onClick={onClose} style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: selCount > 0 ? color : 'rgba(255,255,255,0.08)', color: selCount > 0 ? '#000' : 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}>
            {selCount > 0 ? `✓ Done — ${selCount} chapter${selCount > 1 ? 's' : ''} · ${selQ.toLocaleString()} Qs` : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Class card ───────────────────────────────────────────────────────────────
function ClassCard({ classLevel, chapters, selected, onOpen }: {
  classLevel: number; chapters: Chapter[]; selected: Set<string>; onOpen: () => void;
}) {
  const color    = CLS_COLOR[String(classLevel)];
  const selCount = chapters.filter(c => selected.has(c.id)).length;
  const totalQ   = chapters.reduce((s, c) => s + (c.question_count ?? 0), 0);
  const selQ     = chapters.filter(c => selected.has(c.id)).reduce((s, c) => s + (c.question_count ?? 0), 0);
  const p        = selCount > 0 ? Math.round((selCount / chapters.length) * 100) : 0;
  const C        = 2 * Math.PI * 18;
  return (
    <div onClick={onOpen} style={{ flex: 1, padding: '16px', borderRadius: 18, cursor: 'pointer', background: selCount > 0 ? `${color}12` : 'rgba(255,255,255,0.04)', border: `1.5px solid ${selCount > 0 ? color + '55' : 'rgba(255,255,255,0.1)'}`, transition: 'all 0.2s', userSelect: 'none', position: 'relative', overflow: 'hidden', boxShadow: selCount > 0 ? `0 0 24px ${color}20` : 'none' }}>
      {selCount > 0 && <div style={{ position: 'absolute', top: -30, right: -30, width: 110, height: 110, borderRadius: '50%', background: `radial-gradient(circle, ${color}25 0%, transparent 70%)`, pointerEvents: 'none' }} />}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#000', flexShrink: 0 }}>{classLevel}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Class {classLevel}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{chapters.length} chapters</div>
          </div>
        </div>
        <svg width="44" height="44" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4"/>
          <circle cx="22" cy="22" r="18" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - p / 100)}
            transform="rotate(-90 22 22)" style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(.4,0,.2,1)' }}
          />
          <text x="22" y="22" textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="9" fontWeight="800" fontFamily="monospace">{p}%</text>
        </svg>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color, fontFamily: 'monospace', lineHeight: 1 }}>{totalQ > 0 ? totalQ.toLocaleString() : '—'}</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>Total Qs</div>
        </div>
        {selCount > 0 && (
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', fontFamily: 'monospace', lineHeight: 1 }}>{selQ > 0 ? selQ.toLocaleString() : selCount}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{selQ > 0 ? 'Selected Qs' : 'chapters sel.'}</div>
          </div>
        )}
      </div>
      <Bar value={p} color={color} h={3} />
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {selCount > 0 ? (
          <span style={{ fontSize: 11, fontWeight: 700, color, background: `${color}18`, padding: '3px 10px', borderRadius: 99, border: `1px solid ${color}33` }}>{selCount} selected</span>
        ) : (
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Tap to select chapters</span>
        )}
        <ChevronRight style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.4)' }} />
      </div>
    </div>
  );
}

// ── Shared question fetcher ──────────────────────────────────────────────────
async function fetchQuestions(chapterIds: string[], limit?: number): Promise<Question[]> {
  const params = new URLSearchParams();
  chapterIds.forEach(id => params.append('chapter_id', id));
  params.set('limit', String(limit || 200));
  const res  = await fetch(`/api/v2/questions?${params.toString()}`);
  const json = await res.json();
  return (json.data || []).map((q: any) => ({
    id: q._id,
    display_id: q.display_id || q._id?.slice(0, 8)?.toUpperCase() || 'Q',
    question_text: { markdown: q.question_text?.markdown || '' },
    type: q.type,
    options: q.options,
    answer: q.answer,
    solution: { text_markdown: q.solution?.text_markdown || '' },
    metadata: {
      difficulty: q.metadata?.difficulty || 'Medium',
      chapter_id: q.metadata?.chapter_id || '',
      tags: q.metadata?.tags || [],
      is_pyq: q.metadata?.is_pyq || false,
      is_top_pyq: q.metadata?.is_top_pyq || false,
    },
    svg_scales: q.svg_scales || {},
  }));
}

const DIFF_COLOR = (d: string) => d === 'Easy' ? '#34d399' : d === 'Medium' ? '#fbbf24' : '#f87171';

// ── Browse / Practice mode ───────────────────────────────────────────────────
function BrowseView({ questions, chapters, onBack }: { questions: Question[]; chapters: Chapter[]; onBack: () => void }) {
  const [selIdx, setSelIdx] = useState<number | null>(null);
  const [showSol, setShowSol] = useState(false);
  const [starred, setStarred] = useState<Set<string>>(new Set());
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  // Per-card state for mobile accordion
  const [cardSol, setCardSol] = useState<Record<number, boolean>>({});
  const [cardOpt, setCardOpt] = useState<Record<number, string | null>>({});

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const q = selIdx !== null ? questions[selIdx] : questions[0];
  const desktopIdx = selIdx ?? 0;
  const chName = (id: string) => chapters.find(c => c.id === id)?.name || id;
  const toggleStar = (id: string) => setStarred(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const goTo = (i: number) => { setSelIdx(i); setShowSol(false); setSelectedOpt(null); };

  // Shared question detail renderer
  const renderDetail = (qq: Question, solShown: boolean, setSolShown: (v: boolean) => void, optChosen: string | null, setOptChosen: (v: string | null) => void) => (
    <div>
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 16px', marginBottom: 12 }}>
        <MathRenderer markdown={qq.question_text.markdown} className="text-sm leading-relaxed" imageScale={qq.svg_scales?.question ?? 100} />
      </div>
      {qq.options && qq.options.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 12 }}>
          {qq.options.map((opt: any) => {
            const sel = optChosen === opt.id; const correct = opt.is_correct; const rev = solShown;
            let bc = sel ? '#3b82f6' : 'rgba(255,255,255,0.1)', bg = sel ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.03)';
            if (rev && correct) { bc = '#34d399'; bg = 'rgba(52,211,153,0.1)'; } else if (rev && sel && !correct) { bc = '#f87171'; bg = 'rgba(248,113,113,0.08)'; }
            return (
              <button key={opt.id} onClick={() => { if (!solShown) { setOptChosen(opt.id); setSolShown(true); } }}
                style={{ padding: '11px 13px', borderRadius: 10, border: `1.5px solid ${bc}`, background: bg, display: 'flex', alignItems: 'center', gap: 10, cursor: solShown ? 'default' : 'pointer', textAlign: 'left', color: '#fff', fontSize: 13, width: '100%' }}>
                <span style={{ width: 24, height: 24, borderRadius: 6, border: `1.5px solid ${bc}`, background: sel ? (rev ? (correct ? '#34d399' : '#f87171') : '#3b82f6') : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: sel ? '#fff' : 'rgba(255,255,255,0.5)', flexShrink: 0 }}>
                  {rev && correct ? <Check style={{ width: 12, height: 12 }} /> : opt.id.toUpperCase()}
                </span>
                <span style={{ flex: 1 }}><MathRenderer markdown={opt.text || ''} className="text-sm" imageScale={qq.svg_scales?.[`option_${opt.id}`] ?? 100} /></span>
              </button>
            );
          })}
        </div>
      )}
      {qq.type === 'NVT' && !solShown && (
        <div style={{ marginBottom: 12 }}>
          <input type="text" placeholder="Enter integer answer" onKeyDown={e => { if (e.key === 'Enter') setSolShown(true); }} onChange={e => setOptChosen(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
          <button onClick={() => setSolShown(true)} style={{ marginTop: 8, padding: '10px 20px', borderRadius: 10, border: 'none', background: '#7c3aed', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Submit</button>
        </div>
      )}
      <button onClick={() => setSolShown(!solShown)}
        style={{ padding: '9px 16px', borderRadius: 9, border: '1px solid rgba(124,58,237,0.4)', background: solShown ? 'rgba(124,58,237,0.15)' : 'transparent', color: '#a78bfa', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
        <ChevronRight style={{ width: 13, height: 13, transform: solShown ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
        {solShown ? 'Hide Solution' : 'View Solution'}
      </button>
      {solShown && qq.solution.text_markdown && (
        <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.2)' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#a78bfa', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Solution</div>
          <MathRenderer markdown={qq.solution.text_markdown} className="text-sm leading-relaxed" imageScale={qq.svg_scales?.solution ?? 100} />
        </div>
      )}
    </div>
  );

  const sharedHeader = (
    <header style={{ background: 'rgba(8,10,15,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.07)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 12, flexShrink: 0 }}>
          <ChevronLeft style={{ width: 14, height: 14 }} /> EXIT
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Practice Session</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{questions.length} Questions{isMobile ? ' · tap to expand' : ' · Any Difficulty'}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 99, fontSize: 12, color: '#34d399', fontWeight: 700, flexShrink: 0 }}>
          {String.fromCodePoint(0x1F525)} 0 STREAK
        </div>
      </div>
    </header>
  );

  // ── MOBILE: full-screen accordion ───────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{ height: '100vh', overflow: 'hidden', background: '#080a0f', color: '#fff', display: 'flex', flexDirection: 'column' }}>
        {sharedHeader}
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' } as any}>
          {questions.map((qq, i) => {
            const expanded = selIdx === i;
            const solShown = cardSol[i] ?? false;
            const optChosen = cardOpt[i] ?? null;
            return (
              <div key={qq.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: expanded ? 'rgba(124,58,237,0.05)' : 'transparent', borderLeft: `3px solid ${expanded ? '#7c3aed' : 'transparent'}` }}>
                {/* Collapsed row */}
                <div onClick={() => expanded ? setSelIdx(null) : goTo(i)}
                  style={{ padding: '13px 14px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ width: 28, height: 28, borderRadius: 8, background: expanded ? '#7c3aed' : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: expanded ? '#fff' : 'rgba(255,255,255,0.5)', flexShrink: 0 }}>Q{i + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: 5, marginBottom: 5 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: DIFF_COLOR(qq.metadata.difficulty), background: DIFF_COLOR(qq.metadata.difficulty) + '18', padding: '1px 7px', borderRadius: 99 }}>{qq.metadata.difficulty}</span>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.06)', padding: '1px 7px', borderRadius: 99 }}>{qq.type}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' } as any}>
                      <MathRenderer markdown={qq.question_text.markdown.slice(0, 100)} className="text-sm" />
                    </div>
                  </div>
                  <ChevronRight style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.3)', flexShrink: 0, transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', marginTop: 6 }} />
                </div>
                {/* Expanded content */}
                {expanded && (
                  <div style={{ padding: '0 14px 4px' }}>
                    {renderDetail(qq, solShown, (v) => setCardSol(s => ({ ...s, [i]: v })), optChosen, (v) => setCardOpt(s => ({ ...s, [i]: v })))}
                    <button onClick={() => setSelIdx(null)}
                      style={{ width: '100%', marginTop: 8, marginBottom: 12, padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: 'rgba(255,255,255,0.4)', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <ChevronRight style={{ width: 13, height: 13, transform: 'rotate(-90deg)' }} /> Collapse
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          <div style={{ height: 40 }} />
        </div>
      </div>
    );
  }

  // ── DESKTOP: split panel ─────────────────────────────────────────────────────
  const dq = questions[desktopIdx];
  return (
    <div style={{ height: '100vh', overflow: 'hidden', background: '#080a0f', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      {sharedHeader}
      <div style={{ flex: 1, display: 'flex', width: '100%', overflow: 'hidden' }}>
        {/* Left list */}
        <div style={{ width: '38%', minWidth: 300, maxWidth: 480, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', overflowY: 'auto' }}>
          {questions.map((qq, i) => (
            <div key={qq.id} onClick={() => goTo(i)} style={{ padding: '13px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', background: i === desktopIdx ? 'rgba(124,58,237,0.1)' : 'transparent', borderLeft: i === desktopIdx ? '3px solid #7c3aed' : '3px solid transparent', transition: 'background 0.1s' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ width: 26, height: 26, borderRadius: 7, background: i === desktopIdx ? '#7c3aed' : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: i === desktopIdx ? '#fff' : 'rgba(255,255,255,0.5)', flexShrink: 0 }}>Q{i + 1}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 5, marginBottom: 5 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: DIFF_COLOR(qq.metadata.difficulty), background: DIFF_COLOR(qq.metadata.difficulty) + '18', padding: '1px 7px', borderRadius: 99 }}>{qq.metadata.difficulty}</span>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.06)', padding: '1px 7px', borderRadius: 99 }}>{qq.type}</span>
                  </div>
                  <div style={{ fontSize: 12, color: i === desktopIdx ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' } as any}>
                    <MathRenderer markdown={qq.question_text.markdown.slice(0, 120)} className="text-sm" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Right detail */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px 60px' }}>
          {dq && (
            <div style={{ maxWidth: 680, margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <span style={{ fontSize: 16, fontWeight: 800 }}>Question {desktopIdx + 1}</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginLeft: 10 }}>{chName(dq.metadata.chapter_id)}</span>
                </div>
                <button onClick={() => toggleStar(dq.id)} style={{ width: 34, height: 34, borderRadius: 8, background: starred.has(dq.id) ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.06)', border: `1px solid ${starred.has(dq.id) ? 'rgba(251,191,36,0.4)' : 'rgba(255,255,255,0.1)'}`, color: starred.has(dq.id) ? '#fbbf24' : 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Star style={{ width: 15, height: 15, fill: starred.has(dq.id) ? '#fbbf24' : 'none' }} />
                </button>
              </div>
              {renderDetail(dq, showSol, setShowSol, selectedOpt, setSelectedOpt)}
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                {desktopIdx > 0 && <button onClick={() => goTo(desktopIdx - 1)} style={{ padding: '10px 18px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><ChevronLeft style={{ width: 14, height: 14 }} /> Prev</button>}
                {desktopIdx < questions.length - 1 && <button onClick={() => goTo(desktopIdx + 1)} style={{ flex: 1, padding: '10px 18px', borderRadius: 10, border: 'none', background: '#3b82f6', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>Next <ChevronRight style={{ width: 14, height: 14 }} /></button>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Test config modal (choose question count) ───────────────────────────────
function TestConfigModal({ maxQ, onStart, onClose }: { maxQ: number; onStart: (count: number) => void; onClose: () => void }) {
  const presets = [10, 20, 30, 50].filter(n => n <= maxQ);
  if (maxQ > 50) presets.push(maxQ);
  const [count, setCount] = useState(Math.min(20, maxQ));
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#12141f', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '28px 24px', maxWidth: 380, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Configure Test</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>Choose the number of questions for your timed test</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Questions</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {presets.map(n => (
            <button key={n} onClick={() => setCount(n)} style={{ padding: '10px 18px', borderRadius: 10, border: `1.5px solid ${count === n ? '#7c3aed' : 'rgba(255,255,255,0.12)'}`, background: count === n ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.04)', color: count === n ? '#a78bfa' : 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
              {n}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 20 }}>
          Time: <strong style={{ color: '#fff' }}>{Math.ceil(count * 1.5)} min</strong> ({count} Qs × 1.5 min each)
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '13px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => onStart(count)} style={{ flex: 2, padding: '13px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 16px rgba(124,58,237,0.4)' }}>Start Test →</button>
        </div>
      </div>
    </div>
  );
}

// ── Test mode (timed exam with palette) ─────────────────────────────────────
function TestView({ questions, onBack }: { questions: Question[]; onBack: () => void }) {
  const [idx,        setIdx]        = useState(0);
  const [answers,    setAnswers]    = useState<Record<string, string>>({});
  const [marked,     setMarked]     = useState<Record<string, boolean>>({});
  const [nvtInputs,  setNvtInputs]  = useState<Record<string, string>>({});
  const [submitted,  setSubmitted]  = useState(false);
  const [seconds,    setSeconds]    = useState(Math.ceil(questions.length * 90));
  const [starred,    setStarred]    = useState<Set<string>>(new Set());
  const [reviewing,  setReviewing]  = useState(false);
  const [revIdx,     setRevIdx]     = useState(0);
  const [isMobile,   setIsMobile]   = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const toggleStar = (id: string) => setStarred(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (submitted) return;
    const t = setInterval(() => setSeconds(s => { if (s <= 1) { clearInterval(t); setSubmitted(true); return 0; } return s - 1; }), 1000);
    return () => clearInterval(t);
  }, [submitted, questions.length]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const q = questions[idx];

  const palStatus = (i: number) => {
    const qq = questions[i];
    if (i === idx) return { bg: '#3b82f6', color: '#fff', border: '#60a5fa' };
    if (marked[qq.id]) return { bg: '#7c3aed', color: '#fff', border: '#8b5cf6' };
    if (answers[qq.id] || nvtInputs[qq.id]) return { bg: '#059669', color: '#fff', border: '#34d399' };
    return { bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)', border: 'rgba(255,255,255,0.12)' };
  };

  const answeredCount = questions.filter(qq => answers[qq.id] || (nvtInputs[qq.id] && nvtInputs[qq.id].trim())).length;
  const markedCount = Object.values(marked).filter(Boolean).length;
  const notVisitedCount = questions.length - answeredCount;
  const score = submitted ? questions.filter(qq => {
    if (qq.type === 'NVT') return nvtInputs[qq.id]?.trim() === qq.answer?.integer_value?.toString();
    return qq.options?.find((o: any) => o.id === answers[qq.id])?.is_correct;
  }).length : 0;

  if (submitted) {
    const wrong = questions.filter(qq => {
      if (!answers[qq.id] && !nvtInputs[qq.id]) return false;
      if (qq.type === 'NVT') return nvtInputs[qq.id]?.trim() !== qq.answer?.integer_value?.toString();
      return answers[qq.id] && !qq.options?.find((o: any) => o.id === answers[qq.id])?.is_correct;
    }).length;
    const skipped = questions.length - answeredCount;

    // Review solutions mode
    if (reviewing) {
      const rq = questions[revIdx];
      const userAns = answers[rq.id] || nvtInputs[rq.id];
      const isCorrect = rq.type === 'NVT'
        ? nvtInputs[rq.id]?.trim() === rq.answer?.integer_value?.toString()
        : rq.options?.find((o: any) => o.id === answers[rq.id])?.is_correct;
      return (
        <div style={{ minHeight: '100vh', background: '#080a0f', color: '#fff', display: 'flex', flexDirection: 'column' }}>
          <header style={{ height: 48, borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(10,12,20,0.98)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
            <button onClick={() => setReviewing(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
              <ChevronLeft style={{ width: 14, height: 14 }} /> Back to Results
            </button>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Review Solutions</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{revIdx + 1}/{questions.length}</span>
          </header>
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px 60px' }}>
            <div style={{ maxWidth: 680, margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 18, fontWeight: 800 }}>Q{revIdx + 1}</span>
                <span style={{ fontSize: 11, color: DIFF_COLOR(rq.metadata.difficulty), background: DIFF_COLOR(rq.metadata.difficulty) + '18', padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>{rq.metadata.difficulty}</span>
                {userAns ? (
                  <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 99, background: isCorrect ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)', color: isCorrect ? '#34d399' : '#f87171', fontWeight: 700 }}>{isCorrect ? 'Correct' : 'Wrong'}</span>
                ) : (
                  <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 99, background: 'rgba(251,191,36,0.15)', color: '#fbbf24', fontWeight: 700 }}>Skipped</span>
                )}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '20px 22px', marginBottom: 24 }}>
                <MathRenderer markdown={rq.question_text.markdown} className="text-base leading-relaxed" />
              </div>
              {rq.options && rq.options.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                  {rq.options.map((opt: any) => {
                    const sel = answers[rq.id] === opt.id;
                    const correct = opt.is_correct;
                    let borderC = 'rgba(255,255,255,0.1)', bgC = 'rgba(255,255,255,0.03)';
                    if (correct) { borderC = '#34d399'; bgC = 'rgba(52,211,153,0.1)'; }
                    else if (sel && !correct) { borderC = '#f87171'; bgC = 'rgba(248,113,113,0.08)'; }
                    return (
                      <div key={opt.id} style={{ padding: '14px 16px', borderRadius: 12, border: `1.5px solid ${borderC}`, background: bgC, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ width: 26, height: 26, borderRadius: 7, border: `1.5px solid ${borderC}`, background: correct ? '#34d399' : (sel ? '#f87171' : 'transparent'), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: (correct || sel) ? '#fff' : 'rgba(255,255,255,0.5)', flexShrink: 0 }}>
                          {correct ? <Check style={{ width: 13, height: 13 }} /> : opt.id.toUpperCase()}
                        </span>
                        <span style={{ flex: 1, color: '#fff', fontSize: 14 }}><MathRenderer markdown={opt.text || ''} className="text-sm" /></span>
                        {sel && !correct && <span style={{ fontSize: 10, color: '#f87171' }}>Your answer</span>}
                      </div>
                    );
                  })}
                </div>
              )}
              {rq.type === 'NVT' && (
                <div style={{ marginBottom: 24, padding: '14px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Your answer: <strong style={{ color: nvtInputs[rq.id] ? '#fff' : '#fbbf24' }}>{nvtInputs[rq.id] || 'Not attempted'}</strong></div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Correct answer: <strong style={{ color: '#34d399' }}>{rq.answer?.integer_value ?? '—'}</strong></div>
                </div>
              )}
              {rq.solution.text_markdown && (
                <div style={{ padding: '18px 20px', borderRadius: 14, background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.2)', marginBottom: 24 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Solution</div>
                  <MathRenderer markdown={rq.solution.text_markdown} className="text-sm leading-relaxed" />
                </div>
              )}
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                {revIdx > 0 && <button onClick={() => setRevIdx(i => i - 1)} style={{ padding: '10px 18px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><ChevronLeft style={{ width: 14, height: 14 }} /> Prev</button>}
                {revIdx < questions.length - 1 && <button onClick={() => setRevIdx(i => i + 1)} style={{ flex: 1, padding: '10px 18px', borderRadius: 10, border: 'none', background: '#3b82f6', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>Next <ChevronRight style={{ width: 14, height: 14 }} /></button>}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div style={{ minHeight: '100vh', background: '#080a0f', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>{String.fromCodePoint(0x1F3AF)}</div>
        <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Test Complete!</div>
        <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 32 }}>You scored <span style={{ color: '#34d399', fontWeight: 700 }}>{score}</span> out of <span style={{ fontWeight: 700 }}>{questions.length}</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 32 }}>
          {([['Correct', score, '#34d399'], ['Wrong', wrong, '#f87171'], ['Skipped', skipped, '#fbbf24']] as [string,number,string][]).map(([l,v,c]) => (
            <div key={l} style={{ textAlign: 'center', padding: '16px 20px', background: 'rgba(255,255,255,0.04)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: c, fontFamily: 'monospace' }}>{v}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => { setReviewing(true); setRevIdx(0); }} style={{ padding: '13px 28px', borderRadius: 14, border: '1px solid rgba(124,58,237,0.4)', background: 'rgba(124,58,237,0.1)', color: '#a78bfa', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Review Solutions</button>
          <button onClick={onBack} style={{ padding: '13px 32px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Back to Home</button>
        </div>
      </div>
    );
  }

  // Shared overview + palette panel content
  const palettePanel = (
    <div style={{ padding: '16px 14px' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 10 }}>Overview</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
        {([
          [String(answeredCount), 'Answered', '#34d399'],
          [String(notVisitedCount), 'Not Visited', 'rgba(255,255,255,0.5)'],
          [String(markedCount), 'Marked', '#7c3aed'],
          ['0', 'Skipped', '#fbbf24'],
        ] as [string,string,string][]).map(([v,l,c]) => (
          <div key={l} style={{ textAlign: 'center', padding: '10px 6px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: c, fontFamily: 'monospace' }}>{v}</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginTop: 2, textTransform: 'uppercase' }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>Question Palette</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 5 }}>
        {questions.map((_, i) => {
          const s = palStatus(i);
          return <button key={i} onClick={() => { setIdx(i); setShowPalette(false); }} style={{ width: '100%', aspectRatio: '1', borderRadius: 7, border: `1.5px solid ${s.border}`, background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all 0.1s' }}>{i+1}</button>;
        })}
      </div>
      <button onClick={() => { if (confirm('Submit test? You cannot change answers after submission.')) setSubmitted(true); }}
        style={{ width: '100%', marginTop: 18, padding: '13px', borderRadius: 12, border: 'none', background: '#dc2626', color: '#fff', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>
        SUBMIT TEST
      </button>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: 6 }}>Once submitted, you cannot edit responses.</div>
    </div>
  );

  // Shared question body
  const questionBody = (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: isMobile ? '16px 14px 120px' : '24px 28px 100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <span style={{ fontSize: isMobile ? 17 : 20, fontWeight: 800 }}>Q{idx + 1}</span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>/{questions.length}</span>
        <span style={{ fontSize: 11, color: DIFF_COLOR(q.metadata.difficulty), background: DIFF_COLOR(q.metadata.difficulty) + '18', padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>{q.metadata.difficulty}</span>
        <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 99, background: 'rgba(52,211,153,0.12)', color: '#34d399' }}>+4</span>
        <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 99, background: 'rgba(248,113,113,0.12)', color: '#f87171' }}>-1</span>
        <button onClick={() => toggleStar(q.id)} style={{ marginLeft: 'auto', width: 30, height: 30, borderRadius: 8, background: starred.has(q.id) ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.06)', border: `1px solid ${starred.has(q.id) ? 'rgba(251,191,36,0.4)' : 'rgba(255,255,255,0.1)'}`, color: starred.has(q.id) ? '#fbbf24' : 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Star style={{ width: 13, height: 13, fill: starred.has(q.id) ? '#fbbf24' : 'none' }} />
        </button>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px 18px', marginBottom: 16 }}>
        <MathRenderer markdown={q.question_text.markdown} className="text-base leading-relaxed" />
      </div>
      {q.options && q.options.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {q.options.map((opt: any) => {
            const sel = answers[q.id] === opt.id;
            return (
              <button key={opt.id} onClick={() => setAnswers(a => ({ ...a, [q.id]: opt.id }))}
                style={{ padding: '12px 14px', borderRadius: 12, border: `1.5px solid ${sel ? '#3b82f6' : 'rgba(255,255,255,0.1)'}`, background: sel ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.03)', color: '#fff', fontSize: 13, textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
                <span style={{ width: 26, height: 26, borderRadius: 7, border: `1.5px solid ${sel ? '#3b82f6' : 'rgba(255,255,255,0.2)'}`, background: sel ? '#3b82f6' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{opt.id.toUpperCase()}</span>
                <span style={{ flex: 1 }}><MathRenderer markdown={opt.text || ''} className="text-sm" /></span>
              </button>
            );
          })}
        </div>
      )}
      {q.type === 'NVT' && (
        <input type="text" value={nvtInputs[q.id] || ''} onChange={e => setNvtInputs(n => ({ ...n, [q.id]: e.target.value }))}
          placeholder="Enter integer answer"
          style={{ width: '100%', padding: '13px 16px', borderRadius: 12, border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 15, outline: 'none', marginBottom: 16, boxSizing: 'border-box' }}
        />
      )}
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button onClick={() => { const n = {...answers}; delete n[q.id]; setAnswers(n); const m = {...nvtInputs}; delete m[q.id]; setNvtInputs(m); }}
          style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer' }}>Clear</button>
        <button onClick={() => { setMarked(m => ({ ...m, [q.id]: true })); if (idx < questions.length - 1) setIdx(i => i + 1); }}
          style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(124,58,237,0.4)', background: 'rgba(124,58,237,0.1)', color: '#a78bfa', fontSize: 12, cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>Mark & Next</button>
        <button onClick={() => { if (idx < questions.length - 1) setIdx(i => i + 1); }}
          style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: 'none', background: '#3b82f6', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>Save & Next <ChevronRight style={{ width: 13, height: 13 }} /></button>
      </div>
    </div>
  );

  return (
    <div style={{ height: '100vh', overflow: 'hidden', background: '#0a0c14', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ height: 48, borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(10,12,20,0.98)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', flexShrink: 0, gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <X style={{ width: 16, height: 16 }} />
          </button>
          {!isMobile && <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>Section 1: Chemistry</span>}
          {!isMobile && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)', fontWeight: 700, whiteSpace: 'nowrap' }}>SINGLE CORRECT</span>}
        </div>
        {/* Timer — always visible */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: seconds < 300 ? '#f87171' : 'rgba(255,255,255,0.85)', fontSize: 15, fontWeight: 700, fontFamily: 'monospace', flexShrink: 0 }}>
          <Timer style={{ width: 13, height: 13 }} /> {fmt(seconds)}
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          {/* Mobile: palette toggle button */}
          {isMobile && (
            <button onClick={() => setShowPalette(v => !v)}
              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: showPalette ? 'rgba(255,255,255,0.1)' : 'transparent', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              {answeredCount}/{questions.length}
            </button>
          )}
          <button onClick={() => { if (confirm('Submit test? You cannot change answers after submission.')) setSubmitted(true); }}
            style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: '#dc2626', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {isMobile ? 'Submit' : 'SUBMIT TEST'}
          </button>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* Question scroll area */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {questionBody}
        </div>

        {/* Desktop: right sidebar */}
        {!isMobile && (
          <div style={{ width: 240, borderLeft: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', overflowY: 'auto', flexShrink: 0 }}>
            {palettePanel}
          </div>
        )}

        {/* Mobile: palette bottom sheet */}
        {isMobile && showPalette && (
          <>
            <div onClick={() => setShowPalette(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 50, background: '#12141f', borderTop: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px 16px 0 0', maxHeight: '75vh', overflowY: 'auto', animation: 'sheetUp 0.22s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px 0' }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>Overview & Palette</span>
                <button onClick={() => setShowPalette(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 4 }}><X style={{ width: 16, height: 16 }} /></button>
              </div>
              {palettePanel}
            </div>
          </>
        )}
      </div>
    </div>
  );

}

// ── Main component ───────────────────────────────────────────────────────────
export default function CrucibleLanding({ chapters }: CrucibleLandingProps) {
  const [selectedChapters, setSelectedChapters] = useState<Set<string>>(new Set());
  const [view,             setView]             = useState<View>('landing');
  const [openSheet,        setOpenSheet]        = useState<number | null>(null);
  const [toast,            setToast]            = useState<string | null>(null);
  const [mounted,          setMounted]          = useState(false);
  const [questions,        setQuestions]        = useState<Question[]>([]);
  const [loading,          setLoading]          = useState(false);
  const [pendingMode,      setPendingMode]      = useState<'browse' | 'test' | null>(null);
  const [showTestConfig,   setShowTestConfig]   = useState(false);

  const isLoggedIn = false;

  useEffect(() => { setMounted(true); }, []);

  const onShlokaDone = useCallback(() => {
    if (pendingMode) { setView(pendingMode); setPendingMode(null); }
  }, [pendingMode]);

  if (!mounted) return (
    <div className="min-h-screen bg-[#080a0f] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const class11 = chapters.filter(ch => ch.class_level === 11);
  const class12 = chapters.filter(ch => ch.class_level === 12);
  const selCount = selectedChapters.size;
  const hasSel   = selCount > 0;
  const selQ     = chapters.filter(c => selectedChapters.has(c.id)).reduce((s, c) => s + (c.question_count ?? 0), 0);

  const toggle       = (id: string) => setSelectedChapters(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const selectAll    = (lvl: number) => { const chs = chapters.filter(ch => ch.class_level === lvl); setSelectedChapters(prev => { const n = new Set(prev); chs.forEach(c => n.add(c.id)); return n; }); };
  const clearCls     = (lvl: number) => { const chs = chapters.filter(ch => ch.class_level === lvl); setSelectedChapters(prev => { const n = new Set(prev); chs.forEach(c => n.delete(c.id)); return n; }); };
  const clearAll     = () => setSelectedChapters(new Set());
  const notify       = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  // Launch flow: show shloka IMMEDIATELY, fetch in background so there's zero perceived delay
  const launchBrowse = () => {
    if (loading) return;
    setLoading(true);
    setPendingMode('browse');
    setView('shloka'); // show shloka right away
    fetchQuestions(Array.from(selectedChapters))
      .then(qs => {
        if (qs.length === 0) { notify('No questions found for selected chapters yet.'); setView('landing'); }
        else setQuestions(qs);
      })
      .catch(() => { notify('Failed to load questions.'); setView('landing'); })
      .finally(() => setLoading(false));
  };

  const launchTestConfig = () => {
    if (selQ === 0) { notify('Selected chapters have no questions yet.'); return; }
    setShowTestConfig(true);
  };

  const startTest = (count: number) => {
    setShowTestConfig(false);
    if (loading) return;
    setLoading(true);
    setPendingMode('test');
    setView('shloka'); // show shloka right away
    fetchQuestions(Array.from(selectedChapters), count)
      .then(qs => {
        if (qs.length === 0) { notify('No questions found.'); setView('landing'); return; }
        const shuffled = qs.sort(() => Math.random() - 0.5).slice(0, count);
        setQuestions(shuffled);
      })
      .catch(() => { notify('Failed to load questions.'); setView('landing'); })
      .finally(() => setLoading(false));
  };

  // View routing
  if (view === 'shloka') return <ShlokaScreen onDone={onShlokaDone} />;
  if (view === 'browse') return <BrowseView questions={questions} chapters={chapters} onBack={() => setView('landing')} />;
  if (view === 'test')   return <TestView   questions={questions} onBack={() => setView('landing')} />;

  return (
    <>
      <style>{`
        @keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fadeUp  { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes pulse   { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#080a0f', color: '#fff', paddingBottom: hasSel ? 140 : 40 }}>

        {/* NAV */}
        <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(8,10,15,0.94)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', maxWidth: 900, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              {/* Custom crucible icon */}
              <div style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(160deg,#1a0a00 0%,#2d1200 100%)', border: '1px solid rgba(234,88,12,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 14px rgba(234,88,12,0.2), inset 0 1px 0 rgba(255,160,60,0.1)' }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="flame-grad" x1="11" y1="14" x2="11" y2="1" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#ea580c"/>
                      <stop offset="55%" stopColor="#f97316"/>
                      <stop offset="100%" stopColor="#fde68a"/>
                    </linearGradient>
                    <linearGradient id="vessel-grad" x1="11" y1="12" x2="11" y2="21" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#78350f"/>
                      <stop offset="100%" stopColor="#451a03"/>
                    </linearGradient>
                  </defs>
                  {/* Crucible vessel body */}
                  <path d="M5 13 Q4.5 21 11 21 Q17.5 21 17 13 Z" fill="url(#vessel-grad)" stroke="rgba(234,88,12,0.5)" strokeWidth="0.5"/>
                  {/* Vessel rim */}
                  <rect x="4" y="12" width="14" height="2" rx="1" fill="#92400e"/>
                  {/* Center flame */}
                  <path d="M11 13 C11 13 8.5 10 9 7 C9.5 4 11 2 11 2 C11 2 10 5 11.5 6.5 C12 5 12.5 3.5 13.5 3 C13 5 14 7 13 9 C14.5 7.5 15 5 14.5 3.5 C16 5.5 15.5 9 13.5 11 C14 10 14 9 13.5 8.5 C13 10 12 12 11 13 Z" fill="url(#flame-grad)"/>
                  {/* Left small flame */}
                  <path d="M8 13 C8 13 6.5 11 7 9 C7.5 7.5 8.5 7 8.5 7 C8 8.5 8.5 10 9.5 10.5 C9 9 9.5 7.5 10 7 C9.5 8.5 10 10.5 9 12 C9.5 11 9.5 10 9 9.5 C8.5 11 8.5 12 8 13 Z" fill="#f97316" opacity="0.7"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: '0.08em', background: 'linear-gradient(90deg,#fff 0%,rgba(255,255,255,0.85) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.1 }}>THE CRUCIBLE</div>
                <div style={{ fontSize: 8.5, letterSpacing: '0.18em', background: 'linear-gradient(90deg,#f97316,#fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', textTransform: 'uppercase', fontWeight: 700, marginTop: 1 }}>Forge Your Rank</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 600, textDecoration: 'none', transition: 'all 0.15s' }}>
                <ChevronLeft style={{ width: 13, height: 13 }} /> Home
              </a>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>Live</span>
              </div>
            </div>
          </div>
        </nav>

        <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 14px' }}>

          {/* GREETING */}
          <div style={{ marginBottom: 22, animation: 'fadeUp 0.3s ease' }}>
            <p style={{ fontSize: 11, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 4 }}>Chemistry PYQ Bank</p>
            <h1 style={{ fontSize: 'clamp(24px,6vw,34px)', fontWeight: 800, lineHeight: 1.2, margin: 0 }}>
              What will you<br />
              <em style={{ color: '#a78bfa', fontStyle: 'italic' }}>conquer today?</em>
            </h1>
          </div>

          {/* PROGRESS CARD */}
          <div style={{ marginBottom: 22 }}><ProgressCard isLoggedIn={isLoggedIn} /></div>

          {/* SELECT CHAPTERS LABEL */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
              {String.fromCodePoint(0x1F4DA)} Select Chapters
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            {hasSel && <span style={{ fontSize: 11, color: '#a78bfa', fontWeight: 600 }}>{selCount} ch · {selQ > 0 ? selQ.toLocaleString() + ' Qs' : ''}</span>}
          </div>

          {/* CLASS CARDS */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
            <ClassCard classLevel={11} chapters={class11} selected={selectedChapters} onOpen={() => setOpenSheet(11)} />
            <ClassCard classLevel={12} chapters={class12} selected={selectedChapters} onOpen={() => setOpenSheet(12)} />
          </div>

          {/* CLEAR ALL */}
          {hasSel && (
            <div style={{ textAlign: 'center', marginBottom: 18 }}>
              <button onClick={clearAll} style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Clear all selections</button>
            </div>
          )}

          {/* CATEGORY LEGEND */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginBottom: 28 }}>
            {Object.entries(CAT_COLOR).map(([cat, color]) => (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: color }} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{cat}</span>
              </div>
            ))}
          </div>

          {/* QUICK STATS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 28 }}>
            {([
              [String(chapters.length), 'Chapters', '#a78bfa'],
              [chapters.reduce((s,c) => s + (c.question_count ?? 0), 0).toLocaleString(), 'Total Qs', '#38bdf8'],
              [String(chapters.filter(c => (c.question_count ?? 0) > 0).length), 'Active', '#34d399'],
            ] as [string,string,string][]).map(([val, label, color]) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 12, padding: '12px 14px' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color, fontFamily: 'monospace', lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* QUOTE */}
          <div style={{ textAlign: 'center', padding: '0 16px' }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)', fontStyle: 'italic' }}>&ldquo;Sleep 7 hours. Eat healthy. Burnout is not a strategy.&rdquo;</p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.14)', marginTop: 4 }}>&mdash; Paaras Sir</p>
          </div>
        </div>

        {/* BOTTOM CTA BAR */}
        {hasSel && (
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 60, background: 'rgba(8,10,15,0.98)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.09)', padding: '10px 16px 28px' }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 99, overflow: 'hidden', fontSize: 12 }}>
                  <span style={{ padding: '5px 14px', background: '#38bdf8', color: '#000', fontWeight: 800, fontSize: 11, letterSpacing: '0.06em' }}>JEE MAINS</span>
                  <span style={{ padding: '5px 12px', color: 'rgba(255,255,255,0.7)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>{selCount} ch</span>
                  <span style={{ padding: '5px 12px', color: '#38bdf8', fontWeight: 700 }}>{selQ > 0 ? selQ.toLocaleString() : selCount} Qs</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={launchBrowse} disabled={loading} style={{ flex: 1, padding: '15px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)', color: loading ? 'rgba(255,255,255,0.3)' : '#fff', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <LayoutGrid style={{ width: 16, height: 16 }} /> Browse
                </button>
                <button onClick={launchTestConfig} disabled={loading} style={{ flex: 2, padding: '15px', borderRadius: 14, border: 'none', background: loading ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg,#7c3aed,#5b21b6)', color: '#fff', fontSize: 14, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: loading ? 'none' : '0 4px 20px rgba(124,58,237,0.4)' }}>
                  <Clock style={{ width: 16, height: 16 }} />
                  {loading ? 'Loading...' : 'Take Test →'}
                </button>
              </div>
              <div style={{ textAlign: 'center', marginTop: 7, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Browse hides solutions · Test is timed</div>
            </div>
          </div>
        )}

        {/* CHAPTER SHEETS */}
        {openSheet === 11 && <ChapterSheet classLevel={11} chapters={class11} selected={selectedChapters} onToggle={toggle} onClose={() => setOpenSheet(null)} onSelectAll={() => selectAll(11)} onClearClass={() => clearCls(11)} />}
        {openSheet === 12 && <ChapterSheet classLevel={12} chapters={class12} selected={selectedChapters} onToggle={toggle} onClose={() => setOpenSheet(null)} onSelectAll={() => selectAll(12)} onClearClass={() => clearCls(12)} />}

        {/* TEST CONFIG MODAL */}
        {showTestConfig && <TestConfigModal maxQ={selQ} onStart={startTest} onClose={() => setShowTestConfig(false)} />}

        {/* TOAST */}
        {toast && (
          <div style={{ position: 'fixed', bottom: hasSel ? 140 : 24, left: '50%', transform: 'translateX(-50%)', zIndex: 200, background: 'rgba(30,32,44,0.97)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '10px 18px', fontSize: 13, color: '#fff', fontWeight: 500, whiteSpace: 'nowrap', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
            {toast}
          </div>
        )}
      </div>
    </>
  );
}
