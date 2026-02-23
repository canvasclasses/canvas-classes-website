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
  if (pka < 7)  return { txt: 'Strong Acid',   col: '#e07070' };
  if (pka < 9)  return { txt: 'Moderate Acid', col: '#e09050' };
  if (pka < 11) return { txt: 'Weak Acid',      col: '#60b880' };
  return              { txt: 'Very Weak Acid', col: '#6090d0' };
}

// ─── Proper Kekulé benzene SVG ────────────────────────────────────────────────
function BenzeneSVG({ slot, slotIdx, onSetPos }: { slot: SimSlot; slotIdx: number; onSetPos: (p: Position) => void }) {
  const g = GROUPS.find(x => x.id === slot.group) ?? GROUPS[0];
  const col = SLOT_COLORS[slotIdx];
  const cx = 84, cy = 92, r = 44, bondOff = 5;
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
    bonds.push(<line key={`b${i}`} x1={(a[0]+dx*sh).toFixed(1)} y1={(a[1]+dy*sh).toFixed(1)} x2={(b[0]-dx*sh).toFixed(1)} y2={(b[1]-dy*sh).toFixed(1)} stroke="rgba(255,255,255,0.78)" strokeWidth="2.1"/>);
    if (i % 2 === 0) bonds.push(<line key={`d${i}`} x1={(a[0]+dx*sh2+inx*bondOff).toFixed(1)} y1={(a[1]+dy*sh2+iny*bondOff).toFixed(1)} x2={(b[0]-dx*sh2+inx*bondOff).toFixed(1)} y2={(b[1]-dy*sh2+iny*bondOff).toFixed(1)} stroke="rgba(255,255,255,0.78)" strokeWidth="2.1"/>);
  }
  const [v0x, v0y] = pts[0];
  const posIdx = slot.pos === 'ortho' ? 1 : slot.pos === 'meta' ? 2 : 3;
  const [vsx, vsy] = pts[posIdx];
  const odx = vsx - cx, ody = vsy - cy, olen = Math.sqrt(odx**2+ody**2);
  const ux = odx/olen, uy = ody/olen;
  const positions: Position[] = ['ortho','meta','para'];
  const ta = ux > 0.35 ? 'start' : ux < -0.35 ? 'end' : 'middle';
  return (
    <svg viewBox="0 0 168 200" width="168" height="200" style={{ overflow:'visible', display:'block', margin:'0 auto' }}>
      {bonds}
      <line x1={v0x.toFixed(1)} y1={(v0y-2).toFixed(1)} x2={v0x.toFixed(1)} y2={(v0y-24).toFixed(1)} stroke="rgba(255,255,255,0.65)" strokeWidth="2"/>
      <text x={v0x.toFixed(1)} y={(v0y-32).toFixed(1)} textAnchor="middle" fontSize="15" fontWeight="700" fill="rgba(255,255,255,0.92)" fontFamily="DM Mono,monospace">OH</text>
      {slot.group !== 'H' && (<>
        <line x1={(vsx+ux*4).toFixed(1)} y1={(vsy+uy*4).toFixed(1)} x2={(vsx+ux*30).toFixed(1)} y2={(vsy+uy*30).toFixed(1)} stroke={col} strokeWidth="2.3"/>
        <text x={(vsx+ux*44).toFixed(1)} y={(vsy+uy*44+4).toFixed(1)} textAnchor={ta} fontSize="15" fontWeight="700" fill={col} fontFamily="DM Mono,monospace">{g.sym}</text>
      </>)}
      {positions.map(p => {
        const vi = p==='ortho'?1:p==='meta'?2:3;
        const [vx,vy] = pts[vi];
        const isActive = slot.pos===p;
        return <circle key={p} cx={vx.toFixed(1)} cy={vy.toFixed(1)} r={isActive?7:4.5} fill={isActive?col:'rgba(255,255,255,0.15)'} stroke={isActive?'none':'rgba(255,255,255,0.3)'} strokeWidth="1" style={{cursor:'pointer'}} onClick={()=>onSetPos(p)}/>;
      })}
    </svg>
  );
}

// ─── Slot tile ────────────────────────────────────────────────────────────────
function SlotTile({ slot, slotIdx, isActive, onActivate, onSetPos }: { slot: SimSlot; slotIdx: number; isActive: boolean; onActivate: ()=>void; onSetPos: (p: Position)=>void }) {
  const col = SLOT_COLORS[slotIdx];
  const pka = simPka(slot);
  const acL = acidLabel(pka);
  const delta = +(pka - BASE_PKA).toFixed(2);
  return (
    <div onClick={onActivate} style={{ borderRadius:14, padding:'16px 14px 12px', background: isActive ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)', border:`1.5px solid ${isActive ? col : 'rgba(255,255,255,0.1)'}`, cursor:'pointer', transition:'border-color .18s, background .18s' }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' as const, color: isActive ? col : 'rgba(255,255,255,0.4)', marginBottom:6 }}>Compound {slotIdx+1}</div>
      <div style={{ display:'flex', alignItems:'flex-start', gap:6, marginBottom:4 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:15, fontWeight:700, fontFamily:'DM Mono,monospace', color:'rgba(255,255,255,0.9)', lineHeight:1.2 }}>{simLabel(slot)}</div>
          <div style={{ fontSize:12, fontWeight:600, color:acL.col, marginTop:3 }}>{acL.txt}</div>
        </div>
        <div style={{ fontSize:28, fontWeight:800, fontFamily:'DM Mono,monospace', color: isActive ? col : 'rgba(255,255,255,0.75)', lineHeight:1 }}>{pka.toFixed(2)}</div>
      </div>
      <BenzeneSVG slot={slot} slotIdx={slotIdx} onSetPos={onSetPos}/>
      <div style={{ display:'flex', gap:5, marginTop:10 }}>
        {(['ortho','meta','para'] as Position[]).map(p => {
          const isOn = slot.pos===p;
          return (
            <button key={p} onClick={e=>{e.stopPropagation();onSetPos(p);}}
              style={{ flex:1, padding:'7px 0', borderRadius:6, fontSize:11.5, fontFamily:'DM Mono,monospace', fontWeight:isOn?700:500, cursor:'pointer', letterSpacing:'.04em',
                border:`1px solid ${isOn ? col : 'rgba(255,255,255,0.18)'}`,
                background: isOn ? col : 'rgba(255,255,255,0.05)',
                color: isOn ? '#fff' : 'rgba(255,255,255,0.55)',
                transition:'all .15s' }}>
              {p.charAt(0).toUpperCase()+p.slice(1,4)}
            </button>
          );
        })}
      </div>
      {delta!==0 && <div style={{ textAlign:'center' as const, fontSize:12, fontFamily:'DM Mono,monospace', color:delta<0?'#60b880':'#e07070', marginTop:7 }}>{delta>0?'+':''}{delta.toFixed(2)} vs PhOH</div>}
    </div>
  );
}

// ─── Group chip tray ──────────────────────────────────────────────────────────
function GroupChipTray({ activeGroup, onSelect }: { activeGroup: string; onSelect: (id: string)=>void }) {
  const typeStyles = {
    ewg:     { border:'rgba(220,130,120,0.22)', col:'rgba(220,140,130,0.72)', selBg:'rgba(200,80,70,0.18)', selBorder:'rgba(220,120,110,0.5)', selCol:'#e8a090' },
    edg:     { border:'rgba(100,190,140,0.22)', col:'rgba(100,190,140,0.72)', selBg:'rgba(60,160,100,0.18)', selBorder:'rgba(90,180,130,0.5)', selCol:'#78c898' },
    neutral: { border:'rgba(160,160,200,0.18)', col:'rgba(160,160,195,0.65)', selBg:'rgba(120,120,170,0.18)', selBorder:'rgba(150,150,200,0.45)', selCol:'#b0b0d8' },
  };
  return (
    <div style={{ marginBottom:24 }}>
      <div style={{ fontSize:12, fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase' as const, color:'rgba(255,255,255,0.42)', marginBottom:10 }}>
        Substituent &nbsp;·&nbsp; <span style={{color:'#e8a090'}}>● EWG</span> &nbsp; <span style={{color:'#78c898'}}>● EDG</span> &nbsp; <span style={{color:'#b0b0d8'}}>● Neutral</span>
      </div>
      <div style={{ display:'flex', flexWrap:'wrap' as const, gap:6 }}>
        {GROUPS.map(g => {
          const ts = typeStyles[g.type];
          const isSel = g.id===activeGroup;
          return (
            <button key={g.id} onClick={()=>onSelect(g.id)}
              style={{ padding:'5px 13px', borderRadius:6, fontSize:12.5, fontFamily:'DM Mono,monospace', cursor:'pointer', fontWeight:isSel?700:500, letterSpacing:'.02em',
                border:`1px solid ${isSel ? ts.selBorder : ts.border}`,
                background: isSel ? ts.selBg : 'rgba(255,255,255,0.03)',
                color: isSel ? ts.selCol : ts.col,
                transition:'all .15s' }}>
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
  const pkas = slots.map((sl,i)=>({ val:simPka(sl), label:simLabel(sl), col:SLOT_COLORS[i], i }));
  const sorted = [...pkas].sort((a,b)=>a.val-b.val);
  const pMin = Math.min(...pkas.map(x=>x.val)), pMax = Math.max(...pkas.map(x=>x.val));
  return (
    <div style={{ marginTop:28 }}>
      <div style={{ fontSize:12, fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase' as const, color:'rgba(255,255,255,0.42)', marginBottom:14 }}>pKₐ Comparison — most acidic first</div>
      {sorted.map((p,rank) => {
        const acL = acidLabel(p.val);
        const w = pMax===pMin ? 60 : Math.round(30+60*(pMax-p.val)/(pMax-pMin));
        return (
          <div key={p.i} style={{ display:'flex', alignItems:'center', gap:14, padding:'11px 0', borderBottom:rank<sorted.length-1?'1px solid rgba(255,255,255,0.07)':'none' }}>
            <span style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.38)', minWidth:26, fontFamily:'DM Mono,monospace' }}>#{rank+1}</span>
            <div style={{ width:10, height:10, borderRadius:'50%', background:p.col, flexShrink:0 }}/>
            <span style={{ fontSize:14, fontFamily:'DM Mono,monospace', color:'rgba(255,255,255,0.82)', minWidth:130, flexShrink:0 }}>{p.label}</span>
            <div style={{ flex:1, height:32, background:'rgba(255,255,255,0.05)', borderRadius:8, overflow:'hidden', position:'relative' as const }}>
              <div style={{ height:'100%', width:`${w}%`, background:`linear-gradient(90deg, ${p.col}55, ${p.col}cc)`, borderRadius:8, display:'flex', alignItems:'center', padding:'0 12px', transition:'width .5s cubic-bezier(.4,0,.2,1)' }}>
                <span style={{ fontSize:13.5, fontWeight:700, color:'#fff', fontFamily:'DM Mono,monospace', textShadow:'0 1px 3px rgba(0,0,0,0.5)' }}>{p.val.toFixed(2)}</span>
              </div>
            </div>
            <span style={{ fontSize:12, fontWeight:600, padding:'4px 12px', borderRadius:20, whiteSpace:'nowrap' as const, minWidth:100, textAlign:'center' as const, color:acL.col, background:`${acL.col}18`, border:`1px solid ${acL.col}35` }}>{acL.txt}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── pKa number line ──────────────────────────────────────────────────────────
function PkaNumberLine({ slots }: { slots: SimSlot[] }) {
  const pkas = slots.map((sl,i)=>({ val:simPka(sl), col:SLOT_COLORS[i], i }));
  const allV = pkas.map(p=>p.val);
  const lo = Math.min(...allV)-0.8, hi = Math.max(...allV)+0.8;
  const W=520, H=52, padL=36, padR=36, ty=22, trackW=W-padL-padR;
  const xOf = (v: number) => padL+trackW*(v-lo)/(hi-lo);
  const ticks: React.ReactNode[] = [];
  for (let v=Math.ceil(lo); v<=Math.floor(hi); v++) {
    const x=xOf(v).toFixed(1);
    ticks.push(<g key={v}><line x1={x} y1={ty-4} x2={x} y2={ty+4} stroke="rgba(255,255,255,0.15)" strokeWidth="1"/><text x={x} y={ty+17} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.3)" fontFamily="DM Mono,monospace">{v}</text></g>);
  }
  return (
    <div style={{ marginTop:20, paddingTop:16, borderTop:'1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, fontWeight:600, letterSpacing:'.07em', textTransform:'uppercase' as const, color:'rgba(255,255,255,0.35)', marginBottom:8 }}>
        <span style={{color:'#e07070'}}>← stronger acid</span><span>pKₐ number line</span><span style={{color:'#7090d0'}}>weaker acid →</span>
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{overflow:'visible'}}>
        <defs><linearGradient id="tg2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#d06060" stopOpacity={0.5}/><stop offset="100%" stopColor="#6080c0" stopOpacity={0.35}/></linearGradient></defs>
        <rect x={padL} y={ty-2} width={trackW} height="4" rx="2" fill="url(#tg2)"/>
        {ticks}
        {pkas.map((p,idx) => {
          const cx=xOf(p.val).toFixed(1);
          const near=pkas.filter(q=>Math.abs(q.val-p.val)<0.35);
          const mi=near.findIndex(q=>q===p);
          const cy=mi%2===0?ty:ty-18;
          return <g key={idx}><line x1={cx} y1={ty} x2={cx} y2={cy} stroke={p.col} strokeWidth="1.5" opacity={0.4}/><circle cx={cx} cy={cy} r="10" fill={p.col} opacity={0.9}/><text x={cx} y={(+cy+3.8).toFixed(1)} textAnchor="middle" fontSize="9" fontWeight="700" fill="white" fontFamily="DM Mono,monospace">{p.i+1}</text></g>;
        })}
      </svg>
    </div>
  );
}

// ─── Detail strip ─────────────────────────────────────────────────────────────
function DetailStrip({ slots, activeSlot }: { slots: SimSlot[]; activeSlot: number }) {
  const slot = slots[activeSlot];
  const g = GROUPS.find(x=>x.id===slot.group) ?? GROUPS[0];
  const pka = simPka(slot);
  const col = SLOT_COLORS[activeSlot];
  const typeCol = g.type==='ewg'?'#e08080':g.type==='edg'?'#60c080':'#a8a8cc';
  const typeLabel = g.type==='ewg'?'Electron-Withdrawing':g.type==='edg'?'Electron-Donating':'Neutral';
  const deltaRaw = -(g.delta[slot.pos[0] as 'o'|'m'|'p']);
  return (
    <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', marginTop:24, paddingTop:24 }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:20, flexWrap:'wrap' as const }}>
        <div>
          <div style={{ fontSize:34, fontWeight:800, fontFamily:'DM Mono,monospace', lineHeight:1, color:col }}>{g.sym}</div>
          <div style={{ fontSize:12, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase' as const, marginTop:5, color:typeCol }}>{typeLabel}</div>
        </div>
        <div style={{ flex:1, minWidth:200 }}>
          <div style={{ fontSize:17, fontWeight:600, color:'rgba(255,255,255,0.88)', marginBottom:3 }}>{g.label}</div>
          <div style={{ fontSize:13.5, color:'rgba(255,255,255,0.45)', marginBottom:10 }}>{slot.pos.charAt(0).toUpperCase()+slot.pos.slice(1)} substitution on phenol</div>
          <div style={{ fontSize:14.5, color:'rgba(255,255,255,0.65)', lineHeight:1.7 }}>{g.effect}</div>
        </div>
        <div style={{ textAlign:'right' as const, flexShrink:0 }}>
          <div style={{ fontSize:42, fontWeight:800, fontFamily:'DM Mono,monospace', lineHeight:1, color:col }}>{pka.toFixed(2)}</div>
          <div style={{ fontSize:12, letterSpacing:'.1em', textTransform:'uppercase' as const, color:'rgba(255,255,255,0.4)', marginTop:3 }}>pKₐ</div>
          <div style={{ fontSize:13, marginTop:7, color:'rgba(255,255,255,0.4)' }}>Δ {deltaRaw>=0?'+':''}{deltaRaw.toFixed(2)} from phenol</div>
        </div>
      </div>
      <div style={{ display:'flex', gap:10, marginTop:14 }}>
        {(['ortho','meta','para'] as const).map(p => {
          const sv = g.sigma[p[0] as 'o'|'m'|'p'];
          const sc = sv>0.1?'#e08080':sv<-0.1?'#60c080':'#a8a8cc';
          return <div key={p} style={{ flex:1, padding:12, borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.07)', textAlign:'center' as const }}><div style={{ fontSize:12, fontWeight:600, letterSpacing:'.06em', color:'rgba(255,255,255,0.4)', marginBottom:5 }}>Hammett σ {p}</div><div style={{ fontSize:19, fontWeight:700, fontFamily:'DM Mono,monospace', color:sc }}>{sv>=0?'+':''}{sv.toFixed(2)}</div></div>;
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 1 — PHENOL LAB
// ═══════════════════════════════════════════════════════════════════════════════
function PhenolLab() {
  const [slots, setSlots] = useState<SimSlot[]>(DEFAULT_SLOTS.map(s=>({...s})));
  const [activeSlot, setActiveSlot] = useState(0);
  function setPos(i: number, pos: Position) { setSlots(prev=>prev.map((s,idx)=>idx===i?{...s,pos}:s)); }
  function setGroup(i: number, group: string) { setSlots(prev=>prev.map((s,idx)=>idx===i?{...s,group}:s)); }
  return (
    <div>
      <GroupChipTray activeGroup={slots[activeSlot].group} onSelect={g=>setGroup(activeSlot,g)}/>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:28 }}>
        {slots.map((slot,i)=><SlotTile key={i} slot={slot} slotIdx={i} isActive={activeSlot===i} onActivate={()=>setActiveSlot(i)} onSetPos={p=>setPos(i,p)}/>)}
      </div>
      <CompareRows slots={slots}/>
      <PkaNumberLine slots={slots}/>
      <DetailStrip slots={slots} activeSlot={activeSlot}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT — ACIDITY LAB (with sub-tab navigation)
// ═══════════════════════════════════════════════════════════════════════════════
type SubTab = 'phenol' | 'patterns' | 'quiz';

const SUB_TABS: { id: SubTab; label: string; desc: string }[] = [
  { id: 'phenol',   label: 'Phenol Acidity Lab',    desc: 'Interactive substituent simulator' },
  { id: 'patterns', label: 'Acid Patterns & Trends', desc: 'pKa data table + trend analysis' },
  { id: 'quiz',     label: 'Quiz Mode',              desc: '10 questions with explanations' },
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
      {sub === 'phenol'   && <PhenolLab />}
      {sub === 'patterns' && <AcidPatternsTab />}
      {sub === 'quiz'     && <QuizModeTab />}
    </div>
  );
}
