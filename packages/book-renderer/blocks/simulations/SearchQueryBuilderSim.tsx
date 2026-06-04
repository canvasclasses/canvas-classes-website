'use client';

// SearchQueryBuilderSim.tsx
// Class 9 ICT — Chapter 6 (Getting Connected: Internet).
// A Boolean-logic puzzle: build a query with AND / OR / "exact phrase" against a
// small mock result set and watch it filter live. Same operators power real
// search engines and AI prompts. No external facts to source.

import { useState, useMemo } from 'react';

const ACCENT = '#818cf8';

interface Doc { id: number; title: string; text: string; kw: string[]; }
const DOCS: Doc[] = [
  { id: 1, title: 'Youth volunteers clean a village pond', text: 'role of youth in nation building through service', kw: ['youth', 'nation', 'service'] },
  { id: 2, title: 'Smart farming with weather apps', text: 'technology helps farming and crop yield', kw: ['technology', 'farming'] },
  { id: 3, title: 'Students launch a space science club', text: 'youth and space exploration in schools', kw: ['youth', 'space'] },
  { id: 4, title: 'Nation celebrates Republic Day', text: 'the nation marks its constitution', kw: ['nation'] },
  { id: 5, title: 'Young farmers adopt drip irrigation', text: 'youth in farming and nation food security', kw: ['youth', 'farming', 'nation'] },
  { id: 6, title: 'A guide to space travel', text: 'space travel and rockets explained', kw: ['space'] },
  { id: 7, title: 'Coding clubs spread in rural schools', text: 'technology and youth learning to code', kw: ['technology', 'youth'] },
];
const VOCAB = ['youth', 'nation', 'farming', 'space', 'technology'];
type Op = 'AND' | 'OR' | 'PHRASE';

function matches(a: string, op: Op, b: string): number[] {
  return DOCS.filter(d => {
    if (op === 'AND') return d.kw.includes(a) && d.kw.includes(b);
    if (op === 'OR') return d.kw.includes(a) || d.kw.includes(b);
    return d.text.includes(`${a} ${b}`) || d.text.includes(`${b} ${a}`);
  }).map(d => d.id);
}

interface Challenge { goal: string; a: string; op: Op; b: string; }
const CHALLENGES: Challenge[] = [
  { goal: 'Find pages about BOTH youth AND farming.', a: 'youth', op: 'AND', b: 'farming' },
  { goal: 'Find pages about youth OR space (either one).', a: 'youth', op: 'OR', b: 'space' },
  { goal: 'Find the page with the exact phrase "space travel".', a: 'space', op: 'PHRASE', b: 'travel' },
];

export default function SearchQueryBuilderSim() {
  // Start on a broad, deliberately-NOT-solved query so the student has to build
  // the answer to challenge 1 (youth AND farming) themselves.
  const [a, setA] = useState('youth');
  const [op, setOp] = useState<Op>('OR');
  const [b, setB] = useState('nation');
  const [ci, setCi] = useState(0);

  // 'travel' is needed for the phrase challenge but isn't a keyword vocab term
  const vocabB = op === 'PHRASE' ? [...VOCAB, 'travel'] : VOCAB;
  const result = useMemo(() => matches(a, op, b), [a, op, b]);
  const ch = CHALLENGES[ci];
  const target = useMemo(() => matches(ch.a, ch.op, ch.b), [ch]);
  const solved = result.length === target.length && result.every(id => target.includes(id)) && result.length > 0;

  const phraseStr = op === 'PHRASE' ? `"${a} ${b}"` : `${a} ${op} ${b}`;

  return (
    <div className="p-4 md:p-6" style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="mb-3">
        <h1 className="text-3xl font-black tracking-tight text-white">Search Query <span style={{ color: ACCENT }}>Builder</span></h1>
        <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>Boolean Logic for Searching · Class 9 ICT</p>
      </div>

      {/* challenge */}
      <div className="rounded-xl p-3 mb-4 flex items-center justify-between gap-2 flex-wrap" style={{ background: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.25)' }}>
        <p className="text-sm font-bold" style={{ color: '#c4b5fd' }}>🎯 {ch.goal}</p>
        <button onClick={() => setCi(i => (i + 1) % CHALLENGES.length)} className="text-[10px] font-bold px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.06)', color: '#a5b4fc' }}>Next challenge →</button>
      </div>

      {/* query builder */}
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <select value={a} onChange={e => setA(e.target.value)} className="px-3 py-2 rounded-lg text-sm font-bold" style={{ background: '#0B0F15', border: '1px solid rgba(129,140,248,0.3)', color: '#e2e8f0' }}>
          {VOCAB.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
        <div className="flex gap-1">
          {(['AND', 'OR', 'PHRASE'] as Op[]).map(o => {
            const active = op === o;
            return <button key={o} onClick={() => setOp(o)} className="px-3 py-2 rounded-lg text-xs font-black" style={{ background: active ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${active ? 'rgba(251,191,36,0.5)' : 'rgba(255,255,255,0.08)'}`, color: active ? '#fbbf24' : '#94a3b8' }}>{o === 'PHRASE' ? '"phrase"' : o}</button>;
          })}
        </div>
        <select value={b} onChange={e => setB(e.target.value)} className="px-3 py-2 rounded-lg text-sm font-bold" style={{ background: '#0B0F15', border: '1px solid rgba(129,140,248,0.3)', color: '#e2e8f0' }}>
          {vocabB.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
      <p className="text-sm mb-1" style={{ color: '#94a3b8' }}>Your query: <span className="font-bold tabular-nums" style={{ color: ACCENT }}>{phraseStr}</span> → <span style={{ color: solved ? '#34d399' : '#e2e8f0' }} className="font-black">{result.length}</span> result{result.length === 1 ? '' : 's'}</p>
      {solved && <p className="text-sm font-black mb-3" style={{ color: '#34d399' }}>✓ Exactly the pages the challenge wanted!</p>}

      {/* results */}
      <div className="flex flex-col gap-1.5 mt-2">
        {DOCS.map(d => {
          const hit = result.includes(d.id);
          return (
            <div key={d.id} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: hit ? 'rgba(52,211,153,0.07)' : 'rgba(255,255,255,0.02)', border: `1px solid ${hit ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.05)'}`, opacity: hit ? 1 : 0.4 }}>
              <span className="text-sm font-semibold flex-1" style={{ color: hit ? '#e2e8f0' : '#64748b' }}>{d.title}</span>
              <span className="flex gap-1">
                {d.kw.map(k => <span key={k} className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(129,140,248,0.1)', color: '#818cf8' }}>{k}</span>)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="pt-4 mt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <h5 className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>Search Insight</h5>
        <p className="text-white text-base font-bold leading-tight italic">&ldquo;AND narrows, OR widens, and &ldquo;quotes&rdquo; demand an exact match. The same Boolean logic that filters a search also sharpens a prompt to an AI.&rdquo;</p>
      </div>
    </div>
  );
}
