"use client";

import { useState, useEffect, useCallback } from 'react';
import { Flame, ChevronLeft, ChevronRight, LogIn, LayoutGrid, Clock } from 'lucide-react';
import { Chapter, Question } from './types';
import BrowseView from './BrowseView';
import TestView from './TestView';
import TestConfigModal, { DifficultyMix } from './TestConfigModal';

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

// ── Progress card ─────────────────────────────────────────────────────────────
function ProgressCard({ isLoggedIn }: { isLoggedIn: boolean }) {
  const p = PLACEHOLDER;
  const pct = Math.round((p.attempted / p.totalQ) * 100);
  const R = 33; const C = 2 * Math.PI * R;
  return (
    <div style={{ background: 'linear-gradient(145deg,rgba(30,20,60,0.9),rgba(15,12,30,0.95))', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 16, padding: '12px 16px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />

      {/* Single compact row: ring + 4 stats + streak */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Ring — 80px */}
        <svg width="80" height="80" viewBox="0 0 80 80" style={{ flexShrink: 0 }}>
          <circle cx="40" cy="40" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6"/>
          <circle cx="40" cy="40" r={R} fill="none" stroke="url(#ring-grad)" strokeWidth="6" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)}
            transform="rotate(-90 40 40)" style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)' }}
          />
          <defs><linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#38bdf8"/><stop offset="100%" stopColor="#818cf8"/></linearGradient></defs>
          <text x="40" y="36" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="800" fontFamily="monospace">{pct}%</text>
          <text x="40" y="50" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="8" fontFamily="sans-serif">done</text>
        </svg>

        {/* Stats — 4 pills in a row */}
        <div style={{ display: 'flex', gap: 6, flex: 1, flexWrap: 'wrap' }}>
          {[
            { val: p.attempted.toLocaleString(), label: 'solved', color: '#a78bfa' },
            { val: `${p.totalQ.toLocaleString()}`, label: 'total Qs', color: '#38bdf8' },
            { val: `${p.mastered}/${p.masteredOf}`, label: 'chapters mastered', color: '#34d399' },
            { val: `${p.accuracy}%`, label: 'accuracy', color: '#fbbf24' },
          ].map(({ val, label, color }) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 12px', minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 19, fontWeight: 800, color, fontFamily: 'monospace', lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 3, whiteSpace: 'nowrap' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Streak + day dots — right side */}
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#f97316', whiteSpace: 'nowrap' }}>{String.fromCodePoint(0x1F525)} {p.streak}d</span>
          <div style={{ display: 'flex', gap: 3 }}>
            {DAYS.map((d, i) => (
              <div key={i} style={{ width: 20, height: 20, borderRadius: 5, background: p.activeDays.includes(i) ? '#b45309' : 'rgba(255,255,255,0.07)', border: `1px solid ${p.activeDays.includes(i) ? '#d97706' : 'rgba(255,255,255,0.09)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: p.activeDays.includes(i) ? '#fde68a' : 'rgba(255,255,255,0.25)' }}>{d}</div>
            ))}
          </div>
        </div>
      </div>

      {!isLoggedIn && (
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>Showing sample data</span>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(124,58,237,0.18)', border: '1px solid rgba(124,58,237,0.35)', borderRadius: 8, color: '#a78bfa', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
            <LogIn style={{ width: 12, height: 12 }} /> Log in to track real progress
          </button>
        </div>
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

// ── Class card ────────────────────────────────────────────────────────────────
function ClassCard({ classLevel, chapters, selected, onOpen }: {
  classLevel: number; chapters: Chapter[]; selected: Set<string>; onOpen: () => void;
}) {
  const color    = CLS_COLOR[String(classLevel)];
  const selCount = chapters.filter(c => selected.has(c.id)).length;
  const totalQ   = chapters.reduce((s, c) => s + (c.question_count ?? 0), 0);
  const selQ     = chapters.filter(c => selected.has(c.id)).reduce((s, c) => s + (c.question_count ?? 0), 0);
  const pct      = selCount > 0 ? Math.round((selCount / chapters.length) * 100) : 0;
  const active   = selCount > 0;
  return (
    <div onClick={onOpen} style={{ flex: 1, padding: '14px 14px 12px', borderRadius: 16, cursor: 'pointer', background: active ? `${color}0d` : 'rgba(255,255,255,0.04)', border: `1.5px solid ${active ? color + '55' : 'rgba(255,255,255,0.09)'}`, transition: 'all 0.2s', userSelect: 'none', position: 'relative', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: active ? color : '#fff', lineHeight: 1.1 }}>Class {classLevel}</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{chapters.length} chapters</div>
        </div>
        <ChevronRight style={{ width: 14, height: 14, color: active ? color : 'rgba(255,255,255,0.25)', flexShrink: 0 }} />
      </div>
      {/* Progress bar */}
      <Bar value={pct} color={color} h={2} />
      {/* Bottom: question count left, selection state right */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 8 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: active ? color : 'rgba(255,255,255,0.7)', fontFamily: 'monospace', lineHeight: 1 }}>{totalQ > 0 ? totalQ.toLocaleString() : '—'}</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.07em' }}>questions</div>
        </div>
        {active ? (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', fontFamily: 'monospace', lineHeight: 1 }}>{selCount}/{chapters.length} ch</div>
            <div style={{ fontSize: 9, color, marginTop: 2, fontWeight: 700 }}>{selQ.toLocaleString()} Qs selected</div>
          </div>
        ) : (
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>tap to select</span>
        )}
      </div>
    </div>
  );
}

// ── Smart question selector ──────────────────────────────────────────────────
// Strategy: filter by difficulty mix → shuffle within each bucket → interleave
// This guarantees variety across sessions while respecting the chosen difficulty.
function selectTestQuestions(all: Question[], count: number, mix: DifficultyMix): Question[] {
  const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

  let pool: Question[];
  if (mix === 'pyq') {
    pool = all.filter(q => q.metadata.is_pyq);
    if (pool.length === 0) pool = all; // fallback if no PYQs tagged yet
  } else if (mix === 'easy') {
    const easy   = shuffle(all.filter(q => q.metadata.difficulty === 'Easy'));
    const medium = shuffle(all.filter(q => q.metadata.difficulty === 'Medium'));
    pool = [...easy, ...medium];
  } else if (mix === 'hard') {
    const medium = shuffle(all.filter(q => q.metadata.difficulty === 'Medium'));
    const hard   = shuffle(all.filter(q => q.metadata.difficulty === 'Hard'));
    pool = [...medium, ...hard];
  } else {
    // balanced: ~30% easy, ~40% medium, ~30% hard — interleaved
    const easy   = shuffle(all.filter(q => q.metadata.difficulty === 'Easy'));
    const medium = shuffle(all.filter(q => q.metadata.difficulty === 'Medium'));
    const hard   = shuffle(all.filter(q => q.metadata.difficulty === 'Hard'));
    const eN = Math.round(count * 0.3), hN = Math.round(count * 0.3), mN = count - eN - hN;
    pool = [
      ...easy.slice(0, eN),
      ...medium.slice(0, mN),
      ...hard.slice(0, hN),
    ];
    // if any bucket was short, fill from the rest
    if (pool.length < count) {
      const used = new Set(pool.map(q => q.id));
      const rest = shuffle(all.filter(q => !used.has(q.id)));
      pool = [...pool, ...rest];
    }
    pool = shuffle(pool); // final shuffle so difficulties are interleaved
  }

  return pool.slice(0, count);
}

// ── Top PYQ fetcher — all chapters, is_top_pyq=true ─────────────────────────
async function fetchTopPYQs(): Promise<Question[]> {
  const params = new URLSearchParams();
  params.set('is_top_pyq', 'true');
  params.set('limit', '500');
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

// ── Shared question fetcher ──────────────────────────────────────────────────
async function fetchQuestions(chapterIds: string[], limit?: number, topPYQOnly?: boolean): Promise<Question[]> {
  const params = new URLSearchParams();
  chapterIds.forEach(id => params.append('chapter_id', id));
  params.set('limit', String(limit || 500));
  if (topPYQOnly) params.set('is_top_pyq', 'true');
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

// ── Main component ── (BrowseView/TestView/TestConfigModal imported above) ───
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
  const [topPYQLoading,    setTopPYQLoading]    = useState(false);
  const [topPYQFilter,     setTopPYQFilter]     = useState(false);

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

  // Top PYQs launch — fetches all is_top_pyq questions across all chapters
  const launchTopPYQs = (mode: 'browse' | 'test') => {
    if (topPYQLoading) return;
    setTopPYQLoading(true);
    setPendingMode(mode);
    setView('shloka');
    fetchTopPYQs()
      .then(qs => {
        if (qs.length === 0) { notify('Top PYQs not tagged yet — check back soon!'); setView('landing'); return; }
        if (mode === 'test') {
          setQuestions(selectTestQuestions(qs, Math.min(20, qs.length), 'pyq'));
        } else {
          setQuestions(qs);
        }
      })
      .catch(() => { notify('Failed to load Top PYQs.'); setView('landing'); })
      .finally(() => setTopPYQLoading(false));
  };

  // Launch flow: show shloka IMMEDIATELY, fetch in background so there's zero perceived delay
  const launchBrowse = () => {
    if (loading) return;
    setLoading(true);
    setPendingMode('browse');
    setView('shloka');
    const fetcher = topPYQFilter
      ? fetchQuestions(Array.from(selectedChapters), undefined, true)
      : fetchQuestions(Array.from(selectedChapters));
    fetcher
      .then(qs => {
        if (qs.length === 0) { notify(topPYQFilter ? 'No Top PYQs found for selected chapters yet.' : 'No questions found for selected chapters yet.'); setView('landing'); }
        else setQuestions(qs);
      })
      .catch(() => { notify('Failed to load questions.'); setView('landing'); })
      .finally(() => setLoading(false));
  };

  const launchTestConfig = () => {
    if (selQ === 0) { notify('Selected chapters have no questions yet.'); return; }
    setShowTestConfig(true);
  };

  const startTest = (count: number, mix: DifficultyMix) => {
    setShowTestConfig(false);
    if (loading) return;
    setLoading(true);
    setPendingMode('test');
    setView('shloka');
    const fetcher = topPYQFilter
      ? fetchQuestions(Array.from(selectedChapters), undefined, true)
      : fetchQuestions(Array.from(selectedChapters));
    fetcher
      .then(qs => {
        if (qs.length === 0) { notify('No questions found.'); setView('landing'); return; }
        const effectiveMix = topPYQFilter ? 'pyq' : mix;
        const selected = selectTestQuestions(qs, count, effectiveMix as DifficultyMix);
        setQuestions(selected);
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
          <div style={{ marginBottom: 18, animation: 'fadeUp 0.3s ease' }}>
            <p style={{ fontSize: 10, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ display: 'inline-block', width: 16, height: 1, background: 'rgba(255,255,255,0.2)' }} />
              Practice · Test · Improve
              <span style={{ display: 'inline-block', width: 16, height: 1, background: 'rgba(255,255,255,0.2)' }} />
            </p>
            <h1 style={{ fontSize: 'clamp(22px,5.5vw,32px)', fontWeight: 900, lineHeight: 1.2, margin: 0 }}>
              Master Chemistry,<br /><em style={{ color: '#a78bfa', fontStyle: 'italic' }}>one question at a time.</em>
            </h1>
          </div>

          {/* PROGRESS CARD */}
          <div style={{ marginBottom: 18 }}><ProgressCard isLoggedIn={isLoggedIn} /></div>

          {/* SELECT CHAPTERS LABEL + TOP PYQ FILTER TOGGLE */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
              {String.fromCodePoint(0x1F4DA)} Select Chapters
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            {hasSel && <span style={{ fontSize: 11, color: '#a78bfa', fontWeight: 600 }}>{selCount} ch · {selQ > 0 ? selQ.toLocaleString() + ' Qs' : ''}</span>}
          </div>
          {/* TOP PYQ FILTER — compact toggle pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, padding: '8px 12px', borderRadius: 12, background: topPYQFilter ? 'rgba(251,191,36,0.12)' : 'rgba(255,255,255,0.04)', border: `1.5px solid ${topPYQFilter ? 'rgba(251,191,36,0.45)' : 'rgba(255,255,255,0.08)'}`, cursor: 'pointer', transition: 'all 0.15s', userSelect: 'none' as const }} onClick={() => setTopPYQFilter(f => !f)}>
            <span style={{ fontSize: 13 }}>⭐</span>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: topPYQFilter ? '#fbbf24' : 'rgba(255,255,255,0.7)', letterSpacing: '0.04em' }}>Top PYQs only</span>
              <span style={{ fontSize: 11, color: topPYQFilter ? 'rgba(251,191,36,0.6)' : 'rgba(255,255,255,0.35)', marginLeft: 8 }}>{topPYQFilter ? 'Active — showing only must-do questions' : 'Final revision filter · hand-picked per chapter'}</span>
            </div>
            <div style={{ width: 36, height: 20, borderRadius: 99, background: topPYQFilter ? '#d97706' : 'rgba(255,255,255,0.12)', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 2, left: topPYQFilter ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.4)' }} />
            </div>
          </div>

          {/* CLASS CARDS */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
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
