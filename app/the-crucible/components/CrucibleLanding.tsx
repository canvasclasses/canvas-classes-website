"use client";

import { useState, useEffect, useCallback } from 'react';
import { Flame, ChevronLeft, ChevronRight, LogIn, LayoutGrid, Clock } from 'lucide-react';
import Link from 'next/link';
import { Chapter, Question } from './types';
import BrowseView from './BrowseView';
import TestView from './TestView';
import TestConfigModal, { DifficultyMix } from './TestConfigModal';

interface CrucibleLandingProps { chapters: Chapter[]; isLoggedIn: boolean; }
type View = 'landing' | 'shloka' | 'browse' | 'test' | 'test-config';

const CAT_COLOR: Record<string, string> = { Physical: '#38bdf8', Organic: '#a78bfa', Inorganic: '#34d399', Practical: '#fbbf24' };
const CLS_COLOR: Record<string, string> = { '11': '#38bdf8', '12': '#a78bfa' };
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const PLACEHOLDER = { streak: 14, attempted: 1205, totalQ: 2530, mastered: 4, masteredOf: 28, accuracy: 72, activeDays: [0, 1, 2, 3, 4] };

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
          {String.fromCodePoint(0x0909, 0x0926, 0x094D, 0x092F, 0x092E, 0x0947, 0x0928)} {String.fromCodePoint(0x0939, 0x093F)} {String.fromCodePoint(0x0938, 0x093F, 0x0927, 0x094D, 0x092F, 0x0928, 0x094D, 0x0924, 0x093F)}
        </p>
        <p style={{ fontSize: 'clamp(32px,7vw,52px)', fontWeight: 900, fontFamily: 'serif', lineHeight: 1.35, margin: 0, background: 'linear-gradient(180deg,#fde68a 0%,#f59e0b 50%,#b45309 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          {String.fromCodePoint(0x0915, 0x093E, 0x0930, 0x094D, 0x092F, 0x093E, 0x0923, 0x093F)} {String.fromCodePoint(0x0928)} {String.fromCodePoint(0x092E, 0x0928, 0x094B, 0x0930, 0x0925, 0x0948, 0x0903)}
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
  const R = 36; const C = 2 * Math.PI * R;
  const Rd = 44; const Cd = 2 * Math.PI * Rd;
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const ring = isMobile ? (
    <svg width="88" height="88" viewBox="0 0 88 88" style={{ flexShrink: 0 }}>
      <circle cx="44" cy="44" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
      <circle cx="44" cy="44" r={R} fill="none" stroke="url(#ring-grad)" strokeWidth="6" strokeLinecap="round"
        strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)}
        transform="rotate(-90 44 44)" style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)' }}
      />
      <defs><linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#38bdf8" /><stop offset="100%" stopColor="#818cf8" /></linearGradient></defs>
      <text x="44" y="40" textAnchor="middle" fill="#fff" fontSize="15" fontWeight="800" fontFamily="monospace">{pct}%</text>
      <text x="44" y="54" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="8" fontFamily="sans-serif">done</text>
    </svg>
  ) : (
    <svg width="108" height="108" viewBox="0 0 108 108" style={{ flexShrink: 0 }}>
      <circle cx="54" cy="54" r={Rd} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
      <circle cx="54" cy="54" r={Rd} fill="none" stroke="url(#ring-grad-d)" strokeWidth="7" strokeLinecap="round"
        strokeDasharray={Cd} strokeDashoffset={Cd * (1 - pct / 100)}
        transform="rotate(-90 54 54)" style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)' }}
      />
      <defs><linearGradient id="ring-grad-d" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#38bdf8" /><stop offset="100%" stopColor="#818cf8" /></linearGradient></defs>
      <text x="54" y="49" textAnchor="middle" fill="#fff" fontSize="19" fontWeight="800" fontFamily="monospace">{pct}%</text>
      <text x="54" y="65" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="sans-serif">done</text>
    </svg>
  );

  const stats = [
    { val: p.attempted.toLocaleString(), label: 'solved', color: '#a78bfa' },
    { val: `${p.totalQ.toLocaleString()}`, label: 'total Qs', color: '#38bdf8' },
    { val: `${p.mastered}/${p.masteredOf}`, label: 'ch mastered', color: '#34d399' },
    { val: `${p.accuracy}%`, label: 'accuracy', color: '#fbbf24' },
  ];

  const streakBlock = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'flex-start' : 'center', gap: 4 }}>
      <span style={{ fontSize: isMobile ? 11 : 13, fontWeight: 700, color: '#f97316', whiteSpace: 'nowrap' }}>{String.fromCodePoint(0x1F525)} {p.streak} day streak</span>
      <div style={{ display: 'flex', gap: isMobile ? 3 : 5 }}>
        {DAYS.map((d, i) => (
          <div key={i} style={{ width: isMobile ? 22 : 28, height: isMobile ? 22 : 28, borderRadius: isMobile ? 5 : 7, background: p.activeDays.includes(i) ? '#b45309' : 'rgba(255,255,255,0.07)', border: `1px solid ${p.activeDays.includes(i) ? '#d97706' : 'rgba(255,255,255,0.09)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isMobile ? 8 : 10, fontWeight: 700, color: p.activeDays.includes(i) ? '#fde68a' : 'rgba(255,255,255,0.25)' }}>{d}</div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ background: 'linear-gradient(145deg,rgba(30,20,60,0.9),rgba(15,12,30,0.95))', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 16, padding: '12px 16px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ filter: isLoggedIn ? 'none' : 'blur(6px)', opacity: isLoggedIn ? 1 : 0.4, transition: 'all 0.3s ease', pointerEvents: isLoggedIn ? 'auto' : 'none', userSelect: isLoggedIn ? 'auto' : 'none' }}>
        {isMobile ? (
          /* ── Mobile layout: ring left + 2×2 stat grid right, streak below ── */
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              {ring}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, flex: 1 }}>
                {stats.map(({ val, label, color }) => (
                  <div key={label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '7px 10px' }}>
                    <div style={{ fontSize: 17, fontWeight: 800, color, fontFamily: 'monospace', lineHeight: 1 }}>{val}</div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginTop: 3, whiteSpace: 'nowrap' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
            {streakBlock}
          </>
        ) : (
          /* ── Desktop layout: single row ring + 4 pills + streak ── */
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {ring}
            <div style={{ display: 'flex', gap: 6 }}>
              {stats.map(({ val, label, color }) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 16px' }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color, fontFamily: 'monospace', lineHeight: 1 }}>{val}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4, whiteSpace: 'nowrap' }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ flexShrink: 0, marginLeft: 'auto' }}>{streakBlock}</div>
          </div>
        )}
      </div>

      {!isLoggedIn && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ textAlign: 'center', padding: '0 20px' }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Login to save and view progress</h3>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>Tracking your solved questions and streaks helps you stay consistent.</p>
            <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px', background: '#7c3aed', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(124,58,237,0.4)', transition: 'transform 0.2s', textDecoration: 'none' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
              <LogIn style={{ width: 18, height: 18 }} /> Log in Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Chapter row inside bottom sheet ─────────────────────────────────────────
function ChapterRow({ ch, selected, onToggle }: { ch: Chapter; selected: Set<string>; onToggle: (id: string) => void }) {
  const isSel = selected.has(ch.id);
  const accent = CAT_COLOR[ch.category ?? 'Physical'];
  const qCount = ch.question_count ?? 0;
  return (
    <div onClick={() => onToggle(ch.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: isSel ? `${accent}12` : 'transparent', borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', transition: 'background 0.12s', userSelect: 'none' }}>
      <div style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, border: `1.5px solid ${isSel ? accent : 'rgba(255,255,255,0.25)'}`, background: isSel ? accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
        {isSel && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L4 7L9 1" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
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
  const color = CLS_COLOR[String(classLevel)];
  const selCount = chapters.filter(c => selected.has(c.id)).length;
  const totalQ = chapters.reduce((s, c) => s + (c.question_count ?? 0), 0);
  const selQ = chapters.filter(c => selected.has(c.id)).reduce((s, c) => s + (c.question_count ?? 0), 0);
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
  const color = CLS_COLOR[String(classLevel)];
  const selCount = chapters.filter(c => selected.has(c.id)).length;
  const totalQ = chapters.reduce((s, c) => s + (c.question_count ?? 0), 0);
  const selQ = chapters.filter(c => selected.has(c.id)).reduce((s, c) => s + (c.question_count ?? 0), 0);
  const pct = selCount > 0 ? Math.round((selCount / chapters.length) * 100) : 0;
  const active = selCount > 0;
  return (
    <div onClick={onOpen} style={{ padding: '11px 11px 10px', borderRadius: 14, cursor: 'pointer', background: active ? `${color}0d` : 'rgba(255,255,255,0.04)', border: `1.5px solid ${active ? color + '55' : 'rgba(255,255,255,0.09)'}`, transition: 'all 0.2s', userSelect: 'none', position: 'relative', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 800, color: active ? color : '#fff', lineHeight: 1.1 }}>Class {classLevel}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{chapters.length} chapters</div>
        </div>
        <ChevronRight style={{ width: 14, height: 14, color: active ? color : 'rgba(255,255,255,0.25)', flexShrink: 0 }} />
      </div>
      {/* Progress bar */}
      <Bar value={pct} color={color} h={2} />
      {/* Bottom: question count left, selection state right */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 8 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: active ? color : 'rgba(255,255,255,0.7)', fontFamily: 'monospace', lineHeight: 1 }}>{totalQ > 0 ? totalQ.toLocaleString() : '—'}</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.07em' }}>questions</div>
        </div>
        {active ? (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#fff', fontFamily: 'monospace', lineHeight: 1 }}>{selCount}/{chapters.length} ch</div>
            <div style={{ fontSize: 10, color, marginTop: 2, fontWeight: 700 }}>{selQ.toLocaleString()} Qs</div>
          </div>
        ) : (
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>tap to select</span>
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
    const easy = shuffle(all.filter(q => q.metadata.difficulty === 'Easy'));
    const medium = shuffle(all.filter(q => q.metadata.difficulty === 'Medium'));
    pool = [...easy, ...medium];
  } else if (mix === 'hard') {
    const medium = shuffle(all.filter(q => q.metadata.difficulty === 'Medium'));
    const hard = shuffle(all.filter(q => q.metadata.difficulty === 'Hard'));
    pool = [...medium, ...hard];
  } else {
    // balanced: ~30% easy, ~40% medium, ~30% hard — interleaved
    const easy = shuffle(all.filter(q => q.metadata.difficulty === 'Easy'));
    const medium = shuffle(all.filter(q => q.metadata.difficulty === 'Medium'));
    const hard = shuffle(all.filter(q => q.metadata.difficulty === 'Hard'));
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
  const res = await fetch(`/api/v2/questions?${params.toString()}`);
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
  const res = await fetch(`/api/v2/questions?${params.toString()}`);
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

// ── Bhagavad Gita shlokas (30 entries, rotated daily) ────────────────────────
const GITA_SHLOKAS = [
  { sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥', message: 'You have the right to perform your duty, but not to the fruits of your actions. Focus on the effort — results will follow.' },
  { sanskrit: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय।\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते॥', message: 'Perform your duties with equanimity. Whether you succeed or fail in an exam, maintain your balance — that steadiness is true yoga.' },
  { sanskrit: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥', message: 'Elevate yourself through your own effort. You are your own best friend — and your own worst enemy. Choose discipline.' },
  { sanskrit: 'श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्।\nस्वधर्मे निधनं श्रेयः परधर्मो भयावहः॥', message: 'Your own path, even if imperfect, is better than another\'s path perfectly followed. Study in your own way — don\'t just copy others.' },
  { sanskrit: 'नायमात्मा बलहीनेन लभ्यः।', message: 'The highest goals cannot be achieved by the weak-willed. Build mental strength every single day — one problem at a time.' },
  { sanskrit: 'व्यवसायात्मिका बुद्धिरेकेह कुरुनन्दन।\nबहुशाखा ह्यनन्ताश्च बुद्धयोऽव्यवसायिनाम्॥', message: 'The resolute mind is focused and single-pointed. The undecided mind scatters in endless directions. Commit to your preparation fully.' },
  { sanskrit: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥', message: 'Whenever there is a decline in effort and a rise in distraction, rise up again. Every new day is a chance to restart.' },
  { sanskrit: 'नहि कश्चित्क्षणमपि जातु तिष्ठत्यकर्मकृत्।', message: 'Not even for a moment can anyone remain without action. Use every moment of your day purposefully.' },
  { sanskrit: 'तस्माद्युध्यस्व भारत।', message: 'Therefore, fight. Face your syllabus, your doubts, your fears — and fight through them.' },
  { sanskrit: 'क्लैब्यं मा स्म गमः पार्थ नैतत्त्वय्युपपद्यते।\nक्षुद्रं हृदयदौर्बल्यं त्यक्त्वोत्तिष्ठ परन्तप॥', message: 'Do not yield to weakness. It does not become you. Cast off faint-heartedness and rise up, O conqueror of challenges.' },
  { sanskrit: 'अभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते।', message: 'The restless mind is controlled by practice and detachment. Regular study and freedom from distraction — that is the formula.' },
  { sanskrit: 'असंशयं महाबाहो मनो दुर्निग्रहं चलम्।\nअभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते॥', message: 'The mind is indeed restless and hard to control. But through consistent practice and letting go of distractions, it can be mastered.' },
  { sanskrit: 'ज्ञानं लब्ध्वा परां शान्तिमचिरेणाधिगच्छति।', message: 'Having gained knowledge, one quickly attains supreme peace. Every concept you master brings you closer to clarity and confidence.' },
  { sanskrit: 'श्रद्धावान्ल्लभते ज्ञानं तत्परः संयतेन्द्रियः।', message: 'One who has faith, is devoted, and has controlled the senses — that person attains knowledge. Believe in your preparation.' },
  { sanskrit: 'योगः कर्मसु कौशलम्।', message: 'Yoga is excellence in action. Whatever you do — practice, revision, tests — do it with full skill and attention.' },
  { sanskrit: 'सुखदुःखे समे कृत्वा लाभालाभौ जयाजयौ।\nततो युद्धाय युज्यस्व नैवं पापमवाप्स्यसि॥', message: 'Treat success and failure, gain and loss equally. Then engage in your work — this evenness of mind is the highest preparation.' },
  { sanskrit: 'धूमेनाव्रियते वह्निर्यथादर्शो मलेन च।\nयथोल्बेनावृतो गर्भस्तथा तेनेदमावृतम्॥', message: 'As fire is covered by smoke, a mirror by dust — so knowledge is covered by desire and distraction. Clear your mind to learn clearly.' },
  { sanskrit: 'इन्द्रियाणि पराण्याहुरिन्द्रियेभ्यः परं मनः।\nमनसस्तु परा बुद्धिर्यो बुद्धेः परतस्तु सः॥', message: 'The senses are higher than the body; the mind is higher than the senses; the intellect is higher than the mind. Train your intellect.' },
  { sanskrit: 'ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते।\nसङ्गात्सञ्जायते कामः कामात्क्रोधोऽभिजायते॥', message: 'Dwelling on distractions leads to attachment, then craving, then frustration. Guard what you give your attention to.' },
  { sanskrit: 'रसवर्जं रसोऽप्यस्य परं दृष्ट्वा निवर्तते।', message: 'When you experience the deeper joy of understanding, lesser distractions lose their pull. Fall in love with learning itself.' },
  { sanskrit: 'यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः।\nतत्र श्रीर्विजयो भूतिर्ध्रुवा नीतिर्मतिर्मम॥', message: 'Where there is focused effort and disciplined action, there is prosperity, victory, and success. That is certain.' },
  { sanskrit: 'न बुद्धिभेदं जनयेद्अज्ञानां कर्मसङ्गिनाम्।', message: 'Do not let the doubts of others disturb your focus. Stay on your path — your consistency will speak for itself.' },
  { sanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥', message: 'Let go of all confusion and surrender to the process. Trust your preparation completely — release the anxiety.' },
  { sanskrit: 'अनित्यमसुखं लोकमिमं प्राप्य भजस्व माम्।', message: 'This world of results is temporary and uncertain. Focus on the eternal — the knowledge you build within yourself.' },
  { sanskrit: 'पत्रं पुष्पं फलं तोयं यो मे भक्त्या प्रयच्छति।\nतदहं भक्त्युपहृतमश्नामि प्रयतात्मनः॥', message: 'Even a small offering made with sincerity is accepted. Every small study session done with genuine effort counts.' },
  { sanskrit: 'दैवी ह्येषा गुणमयी मम माया दुरत्यया।\nमामेव ये प्रपद्यन्ते मायामेतां तरन्ति ते॥', message: 'The illusion of shortcuts and easy success is hard to cross. Only those who commit fully to the process transcend it.' },
  { sanskrit: 'ज्ञानविज्ञानतृप्तात्मा कूटस्थो विजितेन्द्रियः।\nयुक्त इत्युच्यते योगी समलोष्टाश्मकाञ्चनः॥', message: 'One who is satisfied with knowledge and wisdom, who has conquered the senses — that person is truly prepared for any challenge.' },
  { sanskrit: 'सततं कीर्तयन्तो मां यतन्तश्च दृढव्रताः।\nनमस्यन्तश्च मां भक्त्या नित्ययुक्ता उपासते॥', message: 'Those who strive with firm resolve, with daily dedication — they are always on the path to excellence.' },
  { sanskrit: 'अपि चेदसि पापेभ्यः सर्वेभ्यः पापकृत्तमः।\nसर्वं ज्ञानप्लवेनैव वृजिनं सन्तरिष्यसि॥', message: 'Even if you have wasted time or made mistakes, the raft of knowledge will carry you across all difficulties. It is never too late.' },
  { sanskrit: 'उत्तिष्ठत जाग्रत प्राप्य वरान्निबोधत।', message: 'Arise, awake, and stop not till the goal is reached. Get up, stay alert, and keep moving forward — every single day.' },
];

// Returns today\'s shloka index (0-29) based on day of year
function getTodayShlokaIndex(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return dayOfYear % GITA_SHLOKAS.length;
}

// ── Daily Gita Shloka section (desktop only) ─────────────────────────────────
function DailyGitaShloka() {
  const idx = getTodayShlokaIndex();
  const shloka = GITA_SHLOKAS[idx];
  const lines = shloka.sanskrit.split('\n');
  return (
    <div style={{
      margin: '20px 0 0',
      padding: '12px 32px 14px',
      borderRadius: 16,
      background: 'linear-gradient(145deg, rgba(20,12,4,0.95) 0%, rgba(10,8,20,0.98) 100%)',
      border: '1px solid rgba(180,130,40,0.2)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Om symbol + day indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28, color: 'rgba(180,130,40,0.7)', fontFamily: 'serif', lineHeight: 1 }}>{String.fromCodePoint(0x0950)}</span>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: 'rgba(180,130,40,0.6)', textTransform: 'uppercase' }}>Bhagavad Gita</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>Daily Shloka · {idx + 1} of {GITA_SHLOKAS.length}</div>
          </div>
        </div>
        {/* Decorative divider dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: i === 1 ? 6 : 4, height: i === 1 ? 6 : 4, borderRadius: '50%', background: `rgba(180,130,40,${i === 1 ? 0.5 : 0.25})` }} />
          ))}
        </div>
      </div>

      {/* Sanskrit lines */}
      <div style={{ marginBottom: 8 }}>
        {lines.map((line, i) => (
          <p key={i} style={{
            fontSize: 'clamp(17px, 1.6vw, 21px)',
            fontFamily: 'serif',
            lineHeight: 1.55,
            margin: '0 0 1px',
            color: 'rgba(253,230,138,0.95)',
            letterSpacing: '0.02em',
            textAlign: 'center',
          }}>{line}</p>
        ))}
      </div>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 7 }}>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(180,130,40,0.3))' }} />
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(180,130,40,0.4)' }} />
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(180,130,40,0.3))' }} />
      </div>

      {/* Student message */}
      <p style={{
        fontSize: 'clamp(13px, 1.2vw, 15px)',
        color: 'rgba(255,255,255,0.72)',
        lineHeight: 1.55,
        textAlign: 'center',
        margin: 0,
        fontStyle: 'italic',
        maxWidth: 600,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>{shloka.message}</p>
    </div>
  );
}

// ── Main component ── (BrowseView/TestView/TestConfigModal imported above) ───
// ── Main component ───────────────────────────────────────────────────────────
export default function CrucibleLanding({ chapters, isLoggedIn }: CrucibleLandingProps) {
  const [selectedChapters, setSelectedChapters] = useState<Set<string>>(new Set());
  const [view, setView] = useState<View>('landing');
  const [openSheet, setOpenSheet] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [pendingMode, setPendingMode] = useState<'browse' | 'test' | null>(null);
  const [showTestConfig, setShowTestConfig] = useState(false);
  const [topPYQLoading, setTopPYQLoading] = useState(false);
  const [topPYQFilter, setTopPYQFilter] = useState(false);
  const [jeeMode, setJeeMode] = useState<'mains' | 'advanced'>('mains');

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

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
  const hasSel = selCount > 0;
  const selQ = chapters.filter(c => selectedChapters.has(c.id)).reduce((s, c) => s + (c.question_count ?? 0), 0);

  const toggle = (id: string) => setSelectedChapters(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const selectAll = (lvl: number) => { const chs = chapters.filter(ch => ch.class_level === lvl); setSelectedChapters(prev => { const n = new Set(prev); chs.forEach(c => n.add(c.id)); return n; }); };
  const clearCls = (lvl: number) => { const chs = chapters.filter(ch => ch.class_level === lvl); setSelectedChapters(prev => { const n = new Set(prev); chs.forEach(c => n.delete(c.id)); return n; }); };
  const clearAll = () => setSelectedChapters(new Set());
  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

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
  if (view === 'test') return <TestView questions={questions} onBack={() => setView('landing')} />;

  return (
    <>
      <style>{`
        @keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fadeUp  { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes pulse   { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
      `}</style>
      <style>{`
        @keyframes floatOrb1 { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(40px,-30px) scale(1.12); } 66% { transform: translate(-20px,35px) scale(0.92); } }
        @keyframes floatOrb2 { 0%,100% { transform: translate(0,0) scale(1); } 40% { transform: translate(-35px,20px) scale(1.08); } 75% { transform: translate(28px,-40px) scale(0.88); } }
        @keyframes floatOrb3 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(20px,30px) scale(1.15); } }
        @keyframes shimmerText { 0%,100% { opacity:1; } 50% { opacity:0.75; } }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#080a0f', color: '#fff', paddingBottom: hasSel ? 140 : 40, position: 'relative', overflow: 'hidden' }}>
        {/* Animated background orbs */}
        {!isMobile && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-5%', left: '-8%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, rgba(124,58,237,0.06) 40%, transparent 70%)', animation: 'floatOrb1 16s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', top: '30%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(56,189,248,0.05) 40%, transparent 70%)', animation: 'floatOrb2 20s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', bottom: '-5%', left: '25%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.14) 0%, rgba(167,139,250,0.04) 40%, transparent 70%)', animation: 'floatOrb3 24s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', top: '60%', left: '10%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 65%)', animation: 'floatOrb2 28s ease-in-out infinite reverse' }} />
          </div>
        )}

        {/* NAV */}
        <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(8,10,15,0.94)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '8px 14px' : '12px 28px', maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              {/* Custom crucible icon */}
              <div style={{ width: isMobile ? 30 : 38, height: isMobile ? 30 : 38, borderRadius: isMobile ? 9 : 11, background: 'linear-gradient(160deg,#1a0a00 0%,#2d1200 100%)', border: '1px solid rgba(234,88,12,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 14px rgba(234,88,12,0.2), inset 0 1px 0 rgba(255,160,60,0.1)', flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="flame-grad" x1="11" y1="14" x2="11" y2="1" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#ea580c" />
                      <stop offset="55%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#fde68a" />
                    </linearGradient>
                    <linearGradient id="vessel-grad" x1="11" y1="12" x2="11" y2="21" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#78350f" />
                      <stop offset="100%" stopColor="#451a03" />
                    </linearGradient>
                  </defs>
                  {/* Crucible vessel body */}
                  <path d="M5 13 Q4.5 21 11 21 Q17.5 21 17 13 Z" fill="url(#vessel-grad)" stroke="rgba(234,88,12,0.5)" strokeWidth="0.5" />
                  {/* Vessel rim */}
                  <rect x="4" y="12" width="14" height="2" rx="1" fill="#92400e" />
                  {/* Center flame */}
                  <path d="M11 13 C11 13 8.5 10 9 7 C9.5 4 11 2 11 2 C11 2 10 5 11.5 6.5 C12 5 12.5 3.5 13.5 3 C13 5 14 7 13 9 C14.5 7.5 15 5 14.5 3.5 C16 5.5 15.5 9 13.5 11 C14 10 14 9 13.5 8.5 C13 10 12 12 11 13 Z" fill="url(#flame-grad)" />
                  {/* Left small flame */}
                  <path d="M8 13 C8 13 6.5 11 7 9 C7.5 7.5 8.5 7 8.5 7 C8 8.5 8.5 10 9.5 10.5 C9 9 9.5 7.5 10 7 C9.5 8.5 10 10.5 9 12 C9.5 11 9.5 10 9 9.5 C8.5 11 8.5 12 8 13 Z" fill="#f97316" opacity="0.7" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: isMobile ? 15 : 20, fontWeight: 900, letterSpacing: '0.08em', background: 'linear-gradient(90deg,#fff 0%,rgba(255,255,255,0.85) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.1 }}>THE CRUCIBLE</div>
                <div style={{ fontSize: isMobile ? 8 : 10, letterSpacing: '0.18em', background: 'linear-gradient(90deg,#f97316,#fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', textTransform: 'uppercase', fontWeight: 700, marginTop: 2 }}>Forge Your Rank</div>
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

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '12px 14px' : '20px 28px' }}>

          {/* GREETING + animated orbs */}
          <div style={{ marginBottom: 12, animation: 'fadeUp 0.3s ease', position: 'relative' }}>
            {!isMobile && (
              <>
                <div style={{ position: 'absolute', top: -20, right: 60, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)', pointerEvents: 'none', animation: 'floatOrb1 9s ease-in-out infinite' }} />
                <div style={{ position: 'absolute', top: 10, right: 200, width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)', pointerEvents: 'none', animation: 'floatOrb2 12s ease-in-out infinite' }} />
              </>
            )}
            <p style={{ fontSize: 10, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ display: 'inline-block', width: 16, height: 1, background: 'rgba(255,255,255,0.2)' }} />
              Practice · Test · Improve
              <span style={{ display: 'inline-block', width: 16, height: 1, background: 'rgba(255,255,255,0.2)' }} />
            </p>
            <h1 style={{ fontSize: isMobile ? 'clamp(16px,4vw,20px)' : 'clamp(22px,2.5vw,34px)', fontWeight: 900, lineHeight: 1.15, margin: 0 }}>
              Master Chemistry,<br /><em style={{ color: '#a78bfa', fontStyle: 'italic', animation: 'shimmerText 4s ease-in-out infinite' }}>one question at a time.</em>
            </h1>
          </div>

          {/* PROGRESS CARD */}
          <div style={{ marginBottom: 12 }}><ProgressCard isLoggedIn={isLoggedIn} /></div>

          {/* SELECT CHAPTERS LABEL + LEGEND inline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              {String.fromCodePoint(0x1F4DA)} Select Chapters
            </span>
            <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.12)', flexShrink: 0 }} />
            {Object.entries(CAT_COLOR).map(([cat, color]) => (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>{cat}</span>
              </div>
            ))}
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            {hasSel && <span style={{ fontSize: 11, color: '#a78bfa', fontWeight: 600, whiteSpace: 'nowrap' }}>{selCount} ch · {selQ > 0 ? selQ.toLocaleString() + ' Qs' : ''}</span>}
          </div>
          {/* FILTER ROW: Top PYQs (left) + JEE Mains/Advanced segmented (right) */}
          <div style={{ display: 'flex', gap: isMobile ? 8 : 10, marginBottom: 10, flexDirection: isMobile ? 'row' : 'row' }}>
            {/* Top PYQs toggle */}
            <div onClick={() => setTopPYQFilter(f => !f)} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12, padding: isMobile ? '8px 10px' : '11px 16px', borderRadius: 12, background: topPYQFilter ? 'rgba(251,191,36,0.1)' : 'rgba(255,255,255,0.04)', border: `1.5px solid ${topPYQFilter ? 'rgba(251,191,36,0.4)' : 'rgba(255,255,255,0.08)'}`, cursor: 'pointer', transition: 'all 0.15s', userSelect: 'none' as const }}>
              <span style={{ fontSize: isMobile ? 14 : 18 }}>⭐</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: isMobile ? 12 : 15, fontWeight: 800, color: topPYQFilter ? '#fbbf24' : 'rgba(255,255,255,0.85)', lineHeight: 1.2 }}>Top PYQs only</div>
                <div style={{ fontSize: isMobile ? 10 : 11, color: topPYQFilter ? 'rgba(251,191,36,0.65)' : 'rgba(255,255,255,0.4)', marginTop: 2, whiteSpace: isMobile ? 'nowrap' : 'normal', overflow: 'hidden', textOverflow: 'ellipsis' }}>{topPYQFilter ? 'Active' : isMobile ? 'Hand-picked' : 'Final revision · hand-picked'}</div>
              </div>
              <div style={{ width: isMobile ? 32 : 38, height: isMobile ? 18 : 22, borderRadius: 99, background: topPYQFilter ? '#d97706' : 'rgba(255,255,255,0.12)', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: isMobile ? 2 : 3, left: topPYQFilter ? (isMobile ? 16 : 19) : 3, width: isMobile ? 14 : 16, height: isMobile ? 14 : 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }} />
              </div>
            </div>
            {/* JEE Mains / Advanced segmented control */}
            <div style={{ flex: 1, padding: isMobile ? '8px 10px' : '11px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: isMobile ? 11 : 13, fontWeight: 800, color: 'rgba(255,255,255,0.7)', marginBottom: isMobile ? 6 : 8, letterSpacing: '0.01em' }}>Exam</div>
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.07)', borderRadius: 8, padding: 2, gap: 2 }}>
                <button onClick={() => setJeeMode('mains')} style={{ flex: 1, padding: isMobile ? '5px 0' : '6px 0', borderRadius: 6, border: 'none', background: jeeMode === 'mains' ? '#3b82f6' : 'transparent', color: jeeMode === 'mains' ? '#fff' : 'rgba(255,255,255,0.45)', fontSize: isMobile ? 11 : 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>JEE Mains</button>
                <button onClick={() => setJeeMode('advanced')} style={{ flex: 1, padding: isMobile ? '5px 0' : '6px 0', borderRadius: 6, border: 'none', background: jeeMode === 'advanced' ? '#7c3aed' : 'transparent', color: jeeMode === 'advanced' ? '#fff' : 'rgba(255,255,255,0.45)', fontSize: isMobile ? 11 : 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>JEE Advanced</button>
              </div>
            </div>
          </div>

          {/* CLASS CARDS + MOCK TESTS */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr', gap: isMobile ? 8 : 10, marginBottom: 10 }}>
            <ClassCard classLevel={11} chapters={class11} selected={selectedChapters} onOpen={() => setOpenSheet(11)} />
            <ClassCard classLevel={12} chapters={class12} selected={selectedChapters} onOpen={() => setOpenSheet(12)} />
            {/* Mock Tests — Coming Soon — spans both columns on mobile */}
            <div style={{ padding: '11px 11px 10px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1.5px dashed rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gridColumn: isMobile ? '1 / -1' : undefined }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: 'rgba(255,255,255,0.3)', lineHeight: 1.1 }}>Mock Tests</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 2 }}>Full syllabus</div>
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#f97316', background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 6, padding: '3px 7px', textTransform: 'uppercase' }}>Soon</div>
              </div>
              <div style={{ height: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 99, marginBottom: 6 }} />
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'rgba(255,255,255,0.15)', fontFamily: 'monospace', lineHeight: 1 }}>—</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.07em' }}>questions</div>
                </div>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.15)', fontStyle: 'italic' }}>coming soon</span>
              </div>
            </div>
          </div>

          {/* CLEAR ALL */}
          {hasSel && (
            <div style={{ textAlign: 'center', marginBottom: 6 }}>
              <button onClick={clearAll} style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Clear all selections</button>
            </div>
          )}

          {/* QUICK STATS — full-width 3-col grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: isMobile ? 8 : 10, marginBottom: 12 }}>
            {([
              [String(chapters.length), 'Chapters', '#a78bfa'],
              [chapters.reduce((s, c) => s + (c.question_count ?? 0), 0).toLocaleString(), 'Total Qs', '#38bdf8'],
              [String(chapters.filter(c => (c.question_count ?? 0) > 0).length), 'Active', '#34d399'],
            ] as [string, string, string][]).map(([val, label, color]) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 12, padding: isMobile ? '10px 14px' : '12px 18px' }}>
                <div style={{ fontSize: isMobile ? 18 : 24, fontWeight: 800, color, fontFamily: 'monospace', lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 3 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* QUOTE (mobile) / GITA SHLOKA (desktop) */}
          {isMobile ? (
            <div style={{ textAlign: 'center', padding: '0 16px' }}>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)', fontStyle: 'italic' }}>&ldquo;Sleep 7 hours. Eat healthy. Burnout is not a strategy.&rdquo;</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.14)', marginTop: 4 }}>&mdash; Paaras Sir</p>
            </div>
          ) : (
            <DailyGitaShloka />
          )}
        </div>

        {/* BOTTOM CTA BAR */}
        {hasSel && (
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 60, background: 'rgba(8,10,15,0.98)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.09)', padding: '10px 16px 28px' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
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
