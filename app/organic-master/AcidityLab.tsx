'use client';

import { useState } from 'react';
import {
  GROUPS, DEFAULT_SLOTS, SLOT_COLORS, SLOT_BG, SLOT_BORDER,
  simPka, simLabel, BASE_PKA,
} from './acidity-data';
import type { SimSlot, Position } from './acidity-data';
import AcidPatternsTab from './AcidPatternsTab';
import QuizModeTab from './QuizModeTab';

function acidLabel(pka: number): { txt: string; col: string } {
  if (pka < 7) return { txt: 'Strong Acid', col: '#fb7185' };
  if (pka < 9) return { txt: 'Moderate Acid', col: '#fb923c' };
  if (pka < 11) return { txt: 'Weak Acid', col: '#4ade80' };
  return { txt: 'Very Weak Acid', col: '#60a5fa' };
}

// ─── Proper Kekulé benzene SVG ────────────────────────────────────────────────
function BenzeneSVG({ slot, slotIdx, onSetPos }: { slot: SimSlot; slotIdx: number; onSetPos: (p: Position) => void }) {
  const g = GROUPS.find(x => x.id === slot.group) ?? GROUPS[0];
  const col = SLOT_COLORS[slotIdx];
  const cx = 70, cy = 75, r = 32, bondOff = 4;
  const pts = Array.from({ length: 6 }, (_, k) => {
    const a = -Math.PI / 2 + k * Math.PI / 3;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as [number, number];
  });
  const bonds: React.ReactNode[] = [];
  for (let i = 0; i < 6; i++) {
    const a = pts[i], b = pts[(i + 1) % 6];
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    const idist = Math.sqrt((cx - mx) ** 2 + (cy - my) ** 2);
    const inx = (cx - mx) / idist, iny = (cy - my) / idist;
    const sh = 0.09, sh2 = 0.18;
    bonds.push(<line key={`b${i}`} x1={(a[0] + dx * sh).toFixed(1)} y1={(a[1] + dy * sh).toFixed(1)} x2={(b[0] - dx * sh).toFixed(1)} y2={(b[1] - dy * sh).toFixed(1)} stroke="rgba(255,255,255,0.72)" strokeWidth="1.8" />);
    if (i % 2 === 0) bonds.push(<line key={`d${i}`} x1={(a[0] + dx * sh2 + inx * bondOff).toFixed(1)} y1={(a[1] + dy * sh2 + iny * bondOff).toFixed(1)} x2={(b[0] - dx * sh2 + inx * bondOff).toFixed(1)} y2={(b[1] - dy * sh2 + iny * bondOff).toFixed(1)} stroke="rgba(255,255,255,0.72)" strokeWidth="1.8" />);
  }
  const [v0x, v0y] = pts[0];
  const posIdx = slot.pos === 'ortho' ? 1 : slot.pos === 'meta' ? 2 : 3;
  const [vsx, vsy] = pts[posIdx];
  const odx = vsx - cx, ody = vsy - cy, olen = Math.sqrt(odx ** 2 + ody ** 2);
  const ux = odx / olen, uy = ody / olen;
  const positions: Position[] = ['ortho', 'meta', 'para'];
  const ta = ux > 0.35 ? 'start' : ux < -0.35 ? 'end' : 'middle';
  return (
    <svg viewBox="0 0 140 160" width="140" height="150" style={{ overflow: 'visible', display: 'block', margin: '0 auto' }}>
      {bonds}
      <line x1={v0x.toFixed(1)} y1={(v0y - 2).toFixed(1)} x2={v0x.toFixed(1)} y2={(v0y - 18).toFixed(1)} stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" />
      <text x={v0x.toFixed(1)} y={(v0y - 24).toFixed(1)} textAnchor="middle" fontSize="12" fontWeight="700" fill="rgba(255,255,255,0.9)" fontFamily="DM Mono,monospace">OH</text>
      {slot.group !== 'H' && (<>
        <line x1={(vsx + ux * 4).toFixed(1)} y1={(vsy + uy * 4).toFixed(1)} x2={(vsx + ux * 22).toFixed(1)} y2={(vsy + uy * 22).toFixed(1)} stroke={col} strokeWidth="1.8" />
        <text x={(vsx + ux * 32).toFixed(1)} y={(vsy + uy * 32 + 4).toFixed(1)} textAnchor={ta} fontSize="12" fontWeight="700" fill={col} fontFamily="DM Mono,monospace">{g.sym}</text>
      </>)}
      {positions.map(p => {
        const vi = p === 'ortho' ? 1 : p === 'meta' ? 2 : 3;
        const [vx, vy] = pts[vi];
        const isActive = slot.pos === p;
        return <circle key={p} cx={vx.toFixed(1)} cy={vy.toFixed(1)} r={isActive ? 5.5 : 3.5} fill={isActive ? col : 'rgba(255,255,255,0.12)'} stroke={isActive ? 'none' : 'rgba(255,255,255,0.25)'} strokeWidth="1" style={{ cursor: 'pointer' }} onClick={() => onSetPos(p)} />;
      })}
    </svg>
  );
}

// ─── Slot tile ────────────────────────────────────────────────────────────────
function SlotTile({ slot, slotIdx, isActive, onActivate, onSetPos }: { slot: SimSlot; slotIdx: number; isActive: boolean; onActivate: () => void; onSetPos: (p: Position) => void }) {
  const col = SLOT_COLORS[slotIdx];
  const pka = simPka(slot);
  const acL = acidLabel(pka);
  const delta = +(pka - BASE_PKA).toFixed(2);
  return (
    <div onClick={onActivate} style={{ borderRadius: 10, padding: '11px 11px 9px', background: isActive ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${isActive ? col : 'rgba(255,255,255,0.08)'}`, cursor: 'pointer', transition: 'all .2s' }}>
      <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' as const, color: isActive ? col : 'rgba(255,255,255,0.3)', marginBottom: 4 }}>Compound {slotIdx + 1}</div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4, marginBottom: 2 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'DM Mono,monospace', color: 'rgba(255,255,255,0.85)', lineHeight: 1.15 }}>{simLabel(slot)}</div>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: acL.col, marginTop: 1 }}>{acL.txt}</div>
        </div>
        <div style={{ textAlign: 'right' as const }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, opacity: 0.35, letterSpacing: '.05em', marginBottom: 1 }}>pKₐ</div>
          <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'DM Mono,monospace', color: isActive ? col : 'rgba(255,255,255,0.6)', lineHeight: 1 }}>{pka.toFixed(2)}</div>
        </div>
      </div>
      <BenzeneSVG slot={slot} slotIdx={slotIdx} onSetPos={onSetPos} />
      <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
        {(['ortho', 'meta', 'para'] as Position[]).map(p => {
          const isOn = slot.pos === p;
          return (
            <button key={p} onClick={e => { e.stopPropagation(); onSetPos(p); }}
              style={{
                flex: 1, padding: '5px 0', borderRadius: 5, fontSize: 10, fontFamily: 'DM Mono,monospace', fontWeight: isOn ? 700 : 500, cursor: 'pointer', letterSpacing: '.02em',
                border: `1px solid ${isOn ? col : 'rgba(255,255,255,0.12)'}`,
                background: isOn ? col : 'rgba(255,255,255,0.03)',
                color: isOn ? '#1a1a1a' : 'rgba(255,255,255,0.4)',
                transition: 'all .15s'
              }}>
              {p.charAt(0).toUpperCase() + p.slice(1, 4)}
            </button>
          );
        })}
      </div>
      <div style={{ height: 18 }}>
        {delta !== 0 && <div style={{ textAlign: 'center' as const, fontSize: 11, fontFamily: 'DM Mono,monospace', color: delta < 0 ? '#4ade80' : '#fb7185', marginTop: 6 }}>{delta > 0 ? '+' : ''}{delta.toFixed(2)} vs PhOH</div>}
      </div>
    </div>
  );
}

// ─── Group chip tray ──────────────────────────────────────────────────────────
function GroupChipTray({ activeGroup, onSelect }: { activeGroup: string; onSelect: (id: string) => void }) {
  const typeStyles = {
    ewg: { border: 'rgba(251, 146, 60, 0.15)', col: 'rgba(251, 146, 60, 0.55)', selBg: 'rgba(251, 146, 60, 0.12)', selBorder: 'rgba(251, 146, 60, 0.3)', selCol: '#fdba74' },
    edg: { border: 'rgba(16, 185, 129, 0.15)', col: 'rgba(16, 185, 129, 0.55)', selBg: 'rgba(16, 185, 129, 0.12)', selBorder: 'rgba(16, 185, 129, 0.3)', selCol: '#6ee7b7' },
    neutral: { border: 'rgba(99, 102, 241, 0.15)', col: 'rgba(99, 102, 241, 0.55)', selBg: 'rgba(99, 102, 241, 0.12)', selBorder: 'rgba(99, 102, 241, 0.3)', selCol: '#c7d2fe' },
  };
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)' }}>
          Substituent &nbsp;·&nbsp; <span style={{ color: '#fb923c' }}>● EWG</span> &nbsp; <span style={{ color: '#10b981' }}>● EDG</span> &nbsp; <span style={{ color: '#6366f1' }}>● Neutral</span>
        </div>
        <div style={{ fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 4, background: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.25)', letterSpacing: '.05em', textTransform: 'uppercase' }}>
          5.3M+ Combinations
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 5 }}>
        {GROUPS.map(g => {
          const ts = typeStyles[g.type];
          const isSel = g.id === activeGroup;
          return (
            <button key={g.id} onClick={() => onSelect(g.id)}
              style={{
                padding: '4px 9px', borderRadius: 6, fontSize: 11.5, fontFamily: 'DM Mono,monospace', cursor: 'pointer', fontWeight: isSel ? 700 : 500, letterSpacing: '.02em',
                border: `1px solid ${isSel ? ts.selBorder : ts.border}`,
                background: isSel ? ts.selBg : 'rgba(255,255,255,0.02)',
                color: isSel ? ts.selCol : ts.col,
                transition: 'all .15s'
              }}>
              {g.sym}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Compare rows ─────────────────────────────────────────────────────────────
function CompareRows({ slots }: { slots: SimSlot[] }) {
  const pkas = slots.map((sl, i) => ({ val: simPka(sl), label: simLabel(sl), col: SLOT_COLORS[i], i }));
  const pMin = Math.min(...pkas.map(x => x.val)), pMax = Math.max(...pkas.map(x => x.val));
  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>pKₐ Comparison</div>
      {pkas.map((p, idx) => {
        const acL = acidLabel(p.val);
        const w = pMax === pMin ? 60 : Math.round(30 + 60 * (pMax - p.val) / (pMax - pMin));
        return (
          <div key={p.i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: idx < pkas.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', minWidth: 24, fontFamily: 'DM Mono,monospace' }}>#{p.i + 1}</span>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.col, flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontFamily: 'DM Mono,monospace', color: 'rgba(255,255,255,0.8)', minWidth: 120, flexShrink: 0 }}>{p.label}</span>
            <div style={{ flex: 1, height: 28, background: 'rgba(255,255,255,0.04)', borderRadius: 6, overflow: 'hidden', position: 'relative' as const }}>
              <div style={{ height: '100%', width: `${w}%`, background: `linear-gradient(90deg, ${p.col}66, ${p.col}dd)`, borderRadius: 6, display: 'flex', alignItems: 'center', padding: '0 10px', transition: 'all .6s cubic-bezier(.34,1.56,.64,1)' }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: '#fff', fontFamily: 'DM Mono,monospace', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>{p.val.toFixed(2)}</span>
              </div>
            </div>
            <span style={{ fontSize: 10.5, fontWeight: 700, padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap' as const, minWidth: 90, textAlign: 'center' as const, color: acL.col, background: `${acL.col}15`, border: `1px solid ${acL.col}25` }}>{acL.txt}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── pKa number line ──────────────────────────────────────────────────────────
function PkaNumberLine({ slots }: { slots: SimSlot[] }) {
  const pkas = slots.map((sl, i) => ({ val: simPka(sl), col: SLOT_COLORS[i], i }));
  const allV = pkas.map(p => p.val);
  const lo = Math.min(...allV) - 0.8, hi = Math.max(...allV) + 0.8;
  const W = 520, H = 52, padL = 36, padR = 36, ty = 22, trackW = W - padL - padR;
  const xOf = (v: number) => padL + trackW * (v - lo) / (hi - lo);
  const ticks: React.ReactNode[] = [];
  for (let v = Math.ceil(lo); v <= Math.floor(hi); v++) {
    const x = xOf(v).toFixed(1);
    ticks.push(<g key={v}><line x1={x} y1={ty - 4} x2={x} y2={ty + 4} stroke="rgba(255,255,255,0.15)" strokeWidth="1" /><text x={x} y={ty + 17} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.3)" fontFamily="DM Mono,monospace">{v}</text></g>);
  }
  return (
    <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 600, letterSpacing: '.07em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>
        <span style={{ color: '#fb7185' }}>← stronger acid</span><span>pKₐ number line</span><span style={{ color: '#60a5fa' }}>weaker acid →</span>
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ overflow: 'visible' }}>
        <defs><linearGradient id="tg2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#d06060" stopOpacity={0.5} /><stop offset="100%" stopColor="#6080c0" stopOpacity={0.35} /></linearGradient></defs>
        <rect x={padL} y={ty - 2} width={trackW} height="4" rx="2" fill="url(#tg2)" />
        {ticks}
        {pkas.map((p, idx) => {
          const cx = xOf(p.val).toFixed(1);
          const near = pkas.filter(q => Math.abs(q.val - p.val) < 0.35);
          const mi = near.findIndex(q => q === p);
          const cy = mi % 2 === 0 ? ty : ty - 18;
          return <g key={idx}><line x1={cx} y1={ty} x2={cx} y2={cy} stroke={p.col} strokeWidth="1.5" opacity={0.4} /><circle cx={cx} cy={cy} r="10" fill={p.col} opacity={0.9} /><text x={cx} y={(+cy + 3.8).toFixed(1)} textAnchor="middle" fontSize="9" fontWeight="700" fill="white" fontFamily="DM Mono,monospace">{p.i + 1}</text></g>;
        })}
      </svg>
    </div>
  );
}

// ─── Detail strip ─────────────────────────────────────────────────────────────
function DetailStrip({ slots, activeSlot }: { slots: SimSlot[]; activeSlot: number }) {
  const slot = slots[activeSlot];
  const g = GROUPS.find(x => x.id === slot.group) ?? GROUPS[0];
  const pka = simPka(slot);
  const col = SLOT_COLORS[activeSlot];
  const typeCol = g.type === 'ewg' ? '#fb923c' : g.type === 'edg' ? '#10b981' : '#6366f1';
  const typeLabel = g.type === 'ewg' ? 'Electron-Withdrawing' : g.type === 'edg' ? 'Electron-Donating' : 'Neutral';
  const deltaRaw = -(g.delta[slot.pos[0] as 'o' | 'm' | 'p']);
  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 20, paddingTop: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' as const }}>
        <div>
          <div style={{ fontSize: 27, fontWeight: 800, fontFamily: 'DM Mono,monospace', lineHeight: 1, color: col }}>{g.sym}</div>
          <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' as const, marginTop: 4, color: typeCol }}>{typeLabel}</div>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 14.5, fontWeight: 650, color: 'rgba(255,255,255,0.85)', marginBottom: 2 }}>{g.label}</div>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>{slot.pos.charAt(0).toUpperCase() + slot.pos.slice(1)} substitution</div>
          <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, maxWidth: 500 }}>{g.effect}</div>
        </div>
        <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
          <div style={{ fontSize: 35, fontWeight: 800, fontFamily: 'DM Mono,monospace', lineHeight: 1, color: col }}>{pka.toFixed(2)}</div>
          <div style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>pKₐ</div>
          <div style={{ fontSize: 11, marginTop: 6, color: deltaRaw < 0 ? '#10b981' : '#fb923c', fontWeight: 600 }}>Δ {deltaRaw >= 0 ? '+' : ''}{deltaRaw.toFixed(2)} vs Phenol</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        {(['ortho', 'meta', 'para'] as const).map(p => {
          const sv = g.sigma[p[0] as 'o' | 'm' | 'p'];
          const sc = sv > 0.1 ? '#fb923c' : sv < -0.1 ? '#10b981' : '#a8a8cc';
          return (
            <div key={p} style={{ flex: 1, padding: '7px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' as const }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.08em', color: 'rgba(255,255,255,0.25)', marginBottom: 3 }}>Hammett σ {p}</div>
              <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'DM Mono,monospace', color: sc }}>{sv >= 0 ? '+' : ''}{sv.toFixed(2)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 1 — PHENOL LAB
// ═══════════════════════════════════════════════════════════════════════════════
function PhenolLab() {
  const [slots, setSlots] = useState<SimSlot[]>(DEFAULT_SLOTS.map(s => ({ ...s })));
  const [activeSlot, setActiveSlot] = useState(0);
  function setPos(i: number, pos: Position) { setSlots(prev => prev.map((s, idx) => idx === i ? { ...s, pos } : s)); }
  function setGroup(i: number, group: string) { setSlots(prev => prev.map((s, idx) => idx === i ? { ...s, group } : s)); }
  return (
    <div>
      <GroupChipTray activeGroup={slots[activeSlot].group} onSelect={g => setGroup(activeSlot, g)} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 28 }}>
        {slots.map((slot, i) => <SlotTile key={i} slot={slot} slotIdx={i} isActive={activeSlot === i} onActivate={() => setActiveSlot(i)} onSetPos={p => setPos(i, p)} />)}
      </div>
      <CompareRows slots={slots} />
      <PkaNumberLine slots={slots} />
      <DetailStrip slots={slots} activeSlot={activeSlot} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT — ACIDITY LAB (with sub-tab navigation)
// ═══════════════════════════════════════════════════════════════════════════════
type SubTab = 'phenol' | 'patterns' | 'quiz';

const SUB_TABS: { id: SubTab; label: string; desc: string }[] = [
  { id: 'phenol', label: 'Phenol Acidity Lab', desc: 'Interactive simulator with 5.3 Million+ comparison combinations' },
  { id: 'patterns', label: 'Acid Patterns & Trends', desc: 'pKa data table + trend analysis' },
  { id: 'quiz', label: 'Quiz Mode', desc: '10 questions with explanations' },
];

export default function AcidityLab() {
  const [sub, setSub] = useState<SubTab>('phenol');

  return (
    <div>
      {/* Sub-tab nav */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, padding: '4px', background: 'rgba(139,92,246,0.06)', borderRadius: 12, border: '1px solid rgba(139,92,246,0.18)', width: 'fit-content' }}>
        {SUB_TABS.map(t => {
          const isActive = sub === t.id;
          return (
            <button key={t.id} onClick={() => setSub(t.id)}
              style={{ padding: '9px 22px', borderRadius: 9, fontSize: 14, fontWeight: isActive ? 650 : 450, cursor: 'pointer', border: 'none', background: isActive ? 'rgba(139,92,246,0.25)' : 'transparent', color: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.45)', transition: 'all .18s', boxShadow: isActive ? '0 1px 8px rgba(139,92,246,0.3)' : 'none' }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}>
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Sub-tab description */}
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.32)', marginBottom: 24 }}>
        {SUB_TABS.find(t => t.id === sub)?.desc}
      </div>

      {/* Content */}
      {sub === 'phenol' && <PhenolLab />}
      {sub === 'patterns' && <AcidPatternsTab />}
      {sub === 'quiz' && <QuizModeTab />}
    </div>
  );
}
