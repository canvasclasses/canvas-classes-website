// @ts-nocheck
'use client';

import { useEffect, useRef, useState } from 'react';
import { ElectrochemistryScene } from './ElectrochemistryScene';

/* ════ CONSTANTS ════ */
const R_GAS = 8.314, F_CONST = 96485, TEMP = 298.15;

interface HalfCell {
  name: string; symbol: string; ion: string; e0: number;
  electrodeColor: string; solutionColor: string;
  saltFormula: string; n: number;
  oxidationHalf: string; reductionHalf: string;
  ionColor: string;
}
interface Particle {
  progress: number; speed: number; lane: number; active: boolean;
  color: string; label: string; type: 'electron' | 'cation' | 'anion';
}
interface CellState {
  anodeIdx: number; cathodeIdx: number;
  concAnode: number; concCathode: number; extVoltage: number;
  time: number; particles: Particle[]; deposit: number; erosion: number;
}

const HALF_CELLS: HalfCell[] = [
  { name:'Zinc',      symbol:'Zn', ion:'Zn²⁺', e0:-0.76, electrodeColor:'#8B9EB5', solutionColor:'#b8d4a0', saltFormula:'Zn(NO₃)₂', n:2, oxidationHalf:'Zn(s) → Zn²⁺(aq) + 2e⁻', reductionHalf:'Zn²⁺(aq) + 2e⁻ → Zn(s)', ionColor:'#d4e8a0' },
  { name:'Copper',    symbol:'Cu', ion:'Cu²⁺', e0:+0.34, electrodeColor:'#B87333', solutionColor:'#9fd4e8', saltFormula:'Cu(NO₃)₂', n:2, oxidationHalf:'Cu(s) → Cu²⁺(aq) + 2e⁻', reductionHalf:'Cu²⁺(aq) + 2e⁻ → Cu(s)', ionColor:'#38bdf8' },
  { name:'Silver',    symbol:'Ag', ion:'Ag⁺',  e0:+0.80, electrodeColor:'#C0C0C0', solutionColor:'#d8d4f0', saltFormula:'AgNO₃',    n:1, oxidationHalf:'Ag(s) → Ag⁺(aq) + e⁻',      reductionHalf:'Ag⁺(aq) + e⁻ → Ag(s)',       ionColor:'#c4b5fd' },
  { name:'Iron',      symbol:'Fe', ion:'Fe²⁺', e0:-0.44, electrodeColor:'#6b7280', solutionColor:'#f0e8a0', saltFormula:'FeSO₄',    n:2, oxidationHalf:'Fe(s) → Fe²⁺(aq) + 2e⁻', reductionHalf:'Fe²⁺(aq) + 2e⁻ → Fe(s)', ionColor:'#fde68a' },
  { name:'Nickel',    symbol:'Ni', ion:'Ni²⁺', e0:-0.25, electrodeColor:'#4ade80', solutionColor:'#b8e8c8', saltFormula:'NiSO₄',    n:2, oxidationHalf:'Ni(s) → Ni²⁺(aq) + 2e⁻', reductionHalf:'Ni²⁺(aq) + 2e⁻ → Ni(s)', ionColor:'#86efac' },
  { name:'Lead',      symbol:'Pb', ion:'Pb²⁺', e0:-0.13, electrodeColor:'#94a3b8', solutionColor:'#f0c8c8', saltFormula:'Pb(NO₃)₂', n:2, oxidationHalf:'Pb(s) → Pb²⁺(aq) + 2e⁻', reductionHalf:'Pb²⁺(aq) + 2e⁻ → Pb(s)', ionColor:'#fda4af' },
  { name:'Magnesium', symbol:'Mg', ion:'Mg²⁺', e0:-2.37, electrodeColor:'#a1a1aa', solutionColor:'#d0f0d8', saltFormula:'MgSO₄',    n:2, oxidationHalf:'Mg(s) → Mg²⁺(aq) + 2e⁻', reductionHalf:'Mg²⁺(aq) + 2e⁻ → Mg(s)', ionColor:'#a7f3d0' },
  { name:'Aluminium', symbol:'Al', ion:'Al³⁺', e0:-1.66, electrodeColor:'#d4d4d8', solutionColor:'#e8e8e8', saltFormula:'AlCl₃',    n:3, oxidationHalf:'Al(s) → Al³⁺(aq) + 3e⁻', reductionHalf:'Al³⁺(aq) + 3e⁻ → Al(s)', ionColor:'#e2e8f0' },
  { name:'Iron(III)', symbol:'Pt', ion:'Fe³⁺', e0:+0.77, electrodeColor:'#d1d5db', solutionColor:'#f0dca0', saltFormula:'FeCl₃',    n:1, oxidationHalf:'Fe²⁺ → Fe³⁺ + e⁻',         reductionHalf:'Fe³⁺ + e⁻ → Fe²⁺',           ionColor:'#fcd34d' },
  { name:'Hydrogen',  symbol:'Pt', ion:'H⁺',   e0: 0.00, electrodeColor:'#e5e7eb', solutionColor:'#e8eef4', saltFormula:'HCl',      n:2, oxidationHalf:'H₂(g) → 2H⁺(aq) + 2e⁻',   reductionHalf:'2H⁺(aq) + 2e⁻ → H₂(g)',     ionColor:'#e0f2fe' },
];

const ELECTRODE_POTENTIALS = [
  { half:'Li⁺/Li',    e0:-3.04, color:'#a78bfa' }, { half:'K⁺/K',       e0:-2.93, color:'#a78bfa' },
  { half:'Ca²⁺/Ca',  e0:-2.87, color:'#818cf8' }, { half:'Na⁺/Na',     e0:-2.71, color:'#818cf8' },
  { half:'Mg²⁺/Mg',  e0:-2.37, color:'#94a3b8' }, { half:'Al³⁺/Al',  e0:-1.66, color:'#94a3b8' },
  { half:'Zn²⁺/Zn',  e0:-0.76, color:'#6ee7b7' }, { half:'Fe²⁺/Fe',  e0:-0.44, color:'#6ee7b7' },
  { half:'Ni²⁺/Ni',  e0:-0.25, color:'#6ee7b7' }, { half:'Pb²⁺/Pb',  e0:-0.13, color:'#6ee7b7' },
  { half:'H⁺/H₂',    e0: 0.00, color:'#cbd5e1' }, { half:'Cu²⁺/Cu',  e0:+0.34, color:'#f59e0b' },
  { half:'Fe³⁺/Fe²⁺', e0:+0.77, color:'#f59e0b' }, { half:'Ag⁺/Ag',    e0:+0.80, color:'#f59e0b' },
  { half:'Au³⁺/Au',  e0:+1.50, color:'#fbbf24' }, { half:'F₂/F⁻',  e0:+2.87, color:'#fbbf24' },
];

function nernstE(e0c:number,e0a:number,cc:number,ca:number,n:number){
  return (e0c-e0a)-(R_GAS*TEMP/(n*F_CONST))*Math.log(Math.max(1e-10,ca)/Math.max(1e-10,cc));
}
function lerp(a:number,b:number,t:number){ return a+(b-a)*Math.max(0,Math.min(1,t)); }
function hexRgb(hex:string){ const h=hex.replace('#',''); return {r:parseInt(h.slice(0,2),16)||180,g:parseInt(h.slice(2,4),16)||180,b:parseInt(h.slice(4,6),16)||180}; }
function rrect(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number){
  ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.arcTo(x+w,y,x+w,y+r,r);
  ctx.lineTo(x+w,y+h-r); ctx.arcTo(x+w,y+h,x+w-r,y+h,r);
  ctx.lineTo(x+r,y+h); ctx.arcTo(x,y+h,x,y+h-r,r);
  ctx.lineTo(x,y+r); ctx.arcTo(x,y,x+r,y,r); ctx.closePath();
}

/* ════ MAIN COMPONENT ════ */
export default function Electrochemistry() {
  const [anodeIdx,    setAnodeIdx]    = useState(0);
  const [cathodeIdx,  setCathodeIdx]  = useState(1);
  const [concAnode,   setConcAnode]   = useState(1.0);
  const [concCathode, setConcCathode] = useState(1.0);
  const [extVoltage,  setExtVoltage]  = useState(0);
  const [tab, setTab] = useState<'sim'|'howit'|'theory'>('sim');
  const [paused,    setPaused]    = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [showAtomicView, setShowAtomicView] = useState(false);

  const anode   = HALF_CELLS[anodeIdx];
  const cathode = HALF_CELLS[cathodeIdx];
  const n       = Math.max(anode.n, cathode.n);
  const eStd    = cathode.e0 - anode.e0;
  const eActual = nernstE(cathode.e0, anode.e0, concCathode, concAnode, n);
  const net     = eActual - extVoltage;
  const isGalv  = net > 0.001;
  const isElec  = extVoltage > eActual + 0.001;

  const TABS = [
    ['sim',     'Simulator'],
    ['howit',   'How It Works'],
    ['theory',  'Theory'],
  ] as const;


  return (
    <div className="ec-root">
      <style>{CSS}</style>

      {/* ── Header ── */}
      <div className="ec-header">
        <div>
          <p className="ec-bc">Physical Chemistry · Electrochemistry</p>
          <h1 className="ec-title">Electrochemical <em>Cells</em></h1>
        </div>
        <div className={`ec-badge ec-badge--${isGalv?'galv':isElec?'elec':'eq'}`}>
          {isGalv ? 'Galvanic' : isElec ? 'Electrolytic' : 'Equilibrium'}
        </div>
      </div>

      {/* ── Tabs ── */}
      <nav className="ec-tabs" role="tablist">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            className={`ec-tab${tab === id ? ' ec-tab--active' : ''}`}
            onClick={() => setTab(id as any)}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* ── Simulator Tab ── */}
      {tab === 'sim' && (
        <div className={`ec-sim${focusMode ? ' ec-sim--focus' : ''}`}>
          {/* Controls sidebar — hidden in focus mode */}
          {!focusMode && <aside className="ec-sidebar">
            <section className="ec-card">
              <h3 className="ec-card-title">Half-Cell Selection</h3>

              <label className="ec-flabel ec-flabel--anode">⊖ Anode · Oxidation</label>
              <select
                className="ec-sel ec-sel--anode"
                value={anodeIdx}
                onChange={e => { const v=+e.target.value; if(v!==cathodeIdx) setAnodeIdx(v); }}
              >
                {HALF_CELLS.map((h,i) => (
                  <option key={i} value={i} disabled={i===cathodeIdx}>
                    {h.symbol}/{h.ion} · E° = {(h.e0>=0?'+':'')+h.e0.toFixed(2)}V · {h.name}
                  </option>
                ))}
              </select>
              <p className="ec-hrxn ec-hrxn--anode">{anode.oxidationHalf}</p>

              <label className="ec-flabel ec-flabel--cathode" style={{marginTop:16}}>⊕ Cathode · Reduction</label>
              <select
                className="ec-sel ec-sel--cathode"
                value={cathodeIdx}
                onChange={e => { const v=+e.target.value; if(v!==anodeIdx) setCathodeIdx(v); }}
              >
                {HALF_CELLS.map((h,i) => (
                  <option key={i} value={i} disabled={i===anodeIdx}>
                    {h.symbol}/{h.ion} · E° = {(h.e0>=0?'+':'')+h.e0.toFixed(2)}V · {h.name}
                  </option>
                ))}
              </select>
              <p className="ec-hrxn ec-hrxn--cathode">{cathode.reductionHalf}</p>
            </section>

            <section className="ec-card">
              <h3 className="ec-card-title">Concentrations</h3>
              {[
                { lb:`[${anode.ion}]`,   v:concAnode,   s:setConcAnode,   cls:'anode' },
                { lb:`[${cathode.ion}]`, v:concCathode, s:setConcCathode, cls:'cathode' },
              ].map(({ lb, v, s, cls }) => (
                <div key={lb} className="ec-srow">
                  <span className="ec-sl">{lb}</span>
                  <span className="ec-sv">{v.toFixed(2)} M</span>
                  <input type="range" min="0.01" max="2" step="0.01" value={v}
                    onChange={e => s(+e.target.value)}
                    className={`ec-range ec-range--${cls}`}
                  />
                </div>
              ))}
            </section>

            <section className="ec-card">
              <h3 className="ec-card-title">External Battery</h3>
              <p className="ec-hint">E<sub>cell</sub> = {eActual.toFixed(3)} V · drag above to force electrolysis</p>
              <div className="ec-srow">
                <span className="ec-sl">V<sub>ext</sub></span>
                <span className="ec-sv" style={{color: extVoltage > 0 ? 'var(--ec-amber)' : 'var(--ec-muted)'}}>
                  {extVoltage.toFixed(2)} V
                </span>
                <input type="range" min="0" max="4" step="0.01" value={extVoltage}
                  onChange={e => setExtVoltage(+e.target.value)}
                  className="ec-range ec-range--ext"
                />
              </div>
              {extVoltage > 0 && (
                <button className="ec-btn-rm" onClick={() => setExtVoltage(0)}>
                  Remove Battery
                </button>
              )}
            </section>

            {/* Live readings */}
            <div className="ec-live">
              {[
                { lb: 'E°cell',         v: `${eStd>=0?'+':''}${eStd.toFixed(3)} V`,    ok: eStd > 0 },
                { lb: 'Ecell (Nernst)', v: `${eActual>=0?'+':''}${eActual.toFixed(3)} V`, ok: eActual > 0 },
                { lb: 'ΔG°',             v: `${(-n*F_CONST*eStd/1000).toFixed(1)} kJ/mol`, ok: eStd > 0 },
                { lb: 'Net driving',    v: `${net.toFixed(3)} V`,                        ok: isGalv },
              ].map(({ lb, v, ok }) => (
                <div key={lb} className="ec-lrow">
                  <span className="ec-llb">{lb}</span>
                  <span className="ec-lv" style={{color: ok ? 'var(--ec-teal)' : 'var(--ec-danger)'}}>
                    {v}
                  </span>
                </div>
              ))}
              <p className="ec-notation">
                {anode.symbol}|{anode.ion}({concAnode.toFixed(2)}M) ‖ {cathode.ion}({concCathode.toFixed(2)}M)|{cathode.symbol}
              </p>
            </div>
          </aside>}

          {/* 3D Scene + reaction box */}
          <div className="ec-canvas-col">
            <div className="ec-canvas-wrap">
              <div style={{width:'100%',height:'600px'}}>
                <ElectrochemistryScene
                  anode={anode}
                  cathode={cathode}
                  isGalv={isGalv}
                  isElec={isElec}
                  paused={paused}
                  eActual={eActual}
                  anodeIdx={anodeIdx}
                  cathodeIdx={cathodeIdx}
                />
              </div>
              <div className="ec-canvas-actions">
                <button
                  className="ec-action-btn"
                  onClick={() => setFocusMode(f => !f)}
                  title={focusMode ? 'Exit focus mode' : 'Focus mode — hide controls'}
                >
                  {focusMode ? '⊠ Exit Focus' : '⊡ Focus'}
                </button>
                <button
                  className="ec-action-btn"
                  onClick={() => setShowAtomicView(v => !v)}
                  title="Toggle atomic view"
                >
                  🔬 Atomic View
                </button>
                <button
                  className="ec-action-btn"
                  onClick={() => setPaused(p => !p)}
                >
                  {paused ? '▶ Resume' : '⏸ Pause'}
                </button>
              </div>
            </div>

            <div className={`ec-rxnbox ec-rxnbox--${isGalv?'galv':isElec?'elec':'eq'}`}>
              {isGalv && (
                <>
                  <strong>Oxidation at {anode.symbol} anode (−):</strong> {anode.oxidationHalf}<br/>
                  <strong>Reduction at {cathode.symbol} cathode (+):</strong> {cathode.reductionHalf}<br/>
                  <strong className="ec-highlight">Spontaneous — ΔG = −{(n*F_CONST*eActual/1000).toFixed(2)} kJ</strong>
                </>
              )}
              {isElec && (
                <>
                  <strong>Electrolytic mode</strong> — External {extVoltage.toFixed(2)} V forces non-spontaneous reaction.
                  Overvoltage = <strong className="ec-highlight-amber">{(extVoltage-eActual).toFixed(3)} V</strong>
                </>
              )}
              {!isGalv && !isElec && (
                <><strong>Equilibrium:</strong> V<sub>ext</sub> = E<sub>cell</sub> — no net current (potentiometer principle)</>
              )}
            </div>

            {/* Atomic View — side by side with canvas */}
            {showAtomicView && (
              <div className="ec-atomic-container">
                <div className="ec-atomic-close">
                  <button className="ec-action-btn" onClick={() => setShowAtomicView(false)}>✕ Close Atomic View</button>
                </div>
                <div className="ec-atomic-panels">
                  <div className="ec-atomic-panel">
                    <h4 className="ec-atomic-title" style={{color:'#f87171'}}>Anode — Oxidation at {anode.symbol}</h4>
                    <div className="ec-atomic-diagram">
                      <svg viewBox="0 0 260 180" className="ec-atomic-svg">
                        {/* Electrode surface background */}
                        <rect x="140" y="10" width="110" height="160" fill={anode.electrodeColor} opacity="0.25" rx="4"/>
                        
                        {/* Metal lattice atoms — 4x4 grid */}
                        {[0,1,2,3].map(row => 
                          [0,1,2,3].map(col => (
                            <circle
                              key={`a-${row}-${col}`}
                              cx={155 + col*24}
                              cy={30 + row*38}
                              r="10"
                              fill={anode.electrodeColor}
                              stroke="#fff"
                              strokeWidth="2"
                            />
                          ))
                        )}
                        
                        {/* Atom being oxidized (center) */}
                        <circle cx="203" cy="86" r="12" fill={anode.electrodeColor} stroke="#f87171" strokeWidth="3" strokeDasharray="4,2"/>
                        <text x="203" y="91" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">{anode.symbol}</text>
                        
                        {/* Electrons on metal surface (NOT in solution) */}
                        <circle cx="175" cy="60" r="5" fill="#60a5fa"/>
                        <text x="175" y="56" textAnchor="middle" fill="#93c5fd" fontSize="9" fontWeight="700">e⁻</text>
                        <circle cx="190" cy="55" r="5" fill="#60a5fa"/>
                        <text x="190" y="51" textAnchor="middle" fill="#93c5fd" fontSize="9" fontWeight="700">e⁻</text>
                        
                        {/* Arrow showing electrons moving toward wire on metal surface */}
                        <path d="M 175 70 L 175 45" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#ae-arrow)" fill="none"/>
                        <text x="135" y="50" fill="#60a5fa" fontSize="10" fontWeight="600">e⁻ → wire</text>
                        
                        {/* Wire connection point */}
                        <circle cx="203" cy="15" r="6" fill="#6b7280"/>
                        <text x="203" y="12" textAnchor="middle" fill="#fff" fontSize="8">wire</text>
                        
                        {/* Ion leaving into solution */}
                        <circle cx="75" cy="86" r="14" fill="none" stroke="#fbbf24" strokeWidth="2.5"/>
                        <text x="75" y="91" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="700">{anode.symbol}</text>
                        <text x="95" y="78" fill="#fbbf24" fontSize="13" fontWeight="700">{anode.n === 2 ? '²⁺' : anode.n === 3 ? '³⁺' : '⁺'}</text>
                        
                        {/* Arrow from electrode to solution (ion movement) */}
                        <path d="M 185 86 L 95 86" stroke="#fbbf24" strokeWidth="2.5" markerEnd="url(#ai-arrow)" fill="none" strokeDasharray="5,3"/>
                        
                        {/* Solution area label - LARGER FONT */}
                        <text x="40" y="30" fill="#9ca3af" fontSize="18" fontWeight="700">Solution</text>
                        <text x="40" y="52" fill="#94a3b8" fontSize="16" fontWeight="500">{anode.saltFormula}</text>
                        
                        <defs>
                          <marker id="ae-arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><polygon points="0 0, 10 3, 0 6" fill="#60a5fa"/></marker>
                          <marker id="ai-arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><polygon points="0 0, 10 3, 0 6" fill="#fbbf24"/></marker>
                        </defs>
                      </svg>
                    </div>
                    <div className="ec-atomic-explain">
                      <p className="ec-atomic-eq" style={{borderLeftColor:'#f87171'}}>{anode.oxidationHalf}</p>
                      <ul className="ec-atomic-steps">
                        <li>Metal atom at surface loses {anode.n} electron{anode.n > 1 ? 's' : ''}</li>
                        <li><strong>Electrons remain on metal</strong>, flow toward wire connection</li>
                        <li>Metal ion ({anode.ion}) enters solution</li>
                        <li>Electrode <strong>erodes</strong> as atoms dissolve</li>
                      </ul>
                    </div>
                  </div>

                  <div className="ec-atomic-panel">
                    <h4 className="ec-atomic-title" style={{color:'#60a5fa'}}>Cathode — Reduction at {cathode.symbol}</h4>
                    <div className="ec-atomic-diagram">
                      <svg viewBox="0 0 260 180" className="ec-atomic-svg">
                        {/* Electrode surface background */}
                        <rect x="140" y="10" width="110" height="160" fill={cathode.electrodeColor} opacity="0.25" rx="4"/>
                        
                        {/* Metal lattice atoms */}
                        {[0,1,2,3].map(row => 
                          [0,1,2,3].map(col => (
                            <circle
                              key={`c-${row}-${col}`}
                              cx={155 + col*24}
                              cy={30 + row*38}
                              r="10"
                              fill={cathode.electrodeColor}
                              stroke="#fff"
                              strokeWidth="2"
                            />
                          ))
                        )}
                        
                        {/* New atom depositing (center) */}
                        <circle cx="179" cy="86" r="12" fill={cathode.electrodeColor} stroke="#4ade80" strokeWidth="3" strokeDasharray="4,2"/>
                        <text x="179" y="91" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">{cathode.symbol}</text>
                        
                        {/* Electrons on metal surface (already present) */}
                        <circle cx="165" cy="115" r="5" fill="#60a5fa"/>
                        <text x="165" y="111" textAnchor="middle" fill="#93c5fd" fontSize="9" fontWeight="700">e⁻</text>
                        <circle cx="185" cy="120" r="5" fill="#60a5fa"/>
                        <text x="185" y="116" textAnchor="middle" fill="#93c5fd" fontSize="9" fontWeight="700">e⁻</text>
                        
                        {/* Arrow showing electrons moving on surface to deposit site */}
                        <path d="M 170 115 L 175 100" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#ce-arrow)" fill="none"/>
                        <text x="125" y="145" fill="#60a5fa" fontSize="10" fontWeight="600">e⁻ on metal surface</text>
                        
                        {/* Wire connection delivering electrons */}
                        <circle cx="179" cy="15" r="6" fill="#6b7280"/>
                        <text x="179" y="12" textAnchor="middle" fill="#fff" fontSize="8">wire</text>
                        <path d="M 179 25 L 179 35" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#cw-arrow)" fill="none"/>
                        <text x="195" y="32" fill="#60a5fa" fontSize="9">e⁻ from wire</text>
                        
                        {/* Ion approaching from solution */}
                        <circle cx="70" cy="86" r="14" fill="none" stroke="#60a5fa" strokeWidth="2.5"/>
                        <text x="70" y="91" textAnchor="middle" fill="#60a5fa" fontSize="12" fontWeight="700">{cathode.symbol}</text>
                        <text x="88" y="78" fill="#60a5fa" fontSize="13" fontWeight="700">{cathode.n === 2 ? '²⁺' : cathode.n === 3 ? '³⁺' : '⁺'}</text>
                        
                        {/* Arrow from solution to electrode */}
                        <path d="M 88 86 L 165 86" stroke="#60a5fa" strokeWidth="2.5" markerEnd="url(#ci-arrow)" fill="none" strokeDasharray="5,3"/>
                        
                        {/* Solution area - LARGER FONT */}
                        <text x="35" y="30" fill="#9ca3af" fontSize="18" fontWeight="700">Solution</text>
                        <text x="35" y="52" fill="#94a3b8" fontSize="16" fontWeight="500">{cathode.saltFormula}</text>
                        
                        <defs>
                          <marker id="ce-arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><polygon points="0 0, 10 3, 0 6" fill="#60a5fa"/></marker>
                          <marker id="cw-arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><polygon points="0 0, 10 3, 0 6" fill="#60a5fa"/></marker>
                          <marker id="ci-arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><polygon points="0 0, 10 3, 0 6" fill="#60a5fa"/></marker>
                        </defs>
                      </svg>
                    </div>
                    <div className="ec-atomic-explain">
                      <p className="ec-atomic-eq" style={{borderLeftColor:'#60a5fa'}}>{cathode.reductionHalf}</p>
                      <ul className="ec-atomic-steps">
                        <li>Metal ion ({cathode.ion}) approaches from solution</li>
                        <li>Ion absorbs {cathode.n} electron{cathode.n > 1 ? 's' : ''} <strong>from metal surface</strong></li>
                        <li>Neutral metal atom deposits on electrode</li>
                        <li>Electrode <strong>grows thicker</strong> as metal deposits</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'howit'   && <HowItWorksTab anode={anode} cathode={cathode}/>}
      {tab === 'theory'  && <TheoryTab/>}
    </div>
  );
}

/* ════ CANVAS DRAWING ════ */
function drawScene(ctx:CanvasRenderingContext2D, W:number, H:number, s:CellState) {
  const an = HALF_CELLS[s.anodeIdx], ca = HALF_CELLS[s.cathodeIdx];
  const n  = Math.max(an.n, ca.n);
  const eCell = nernstE(ca.e0, an.e0, s.concCathode, s.concAnode, n);
  const isGalv = (eCell - s.extVoltage) > 0.001;
  const isElec = s.extVoltage > eCell + 0.001;

  /* background */
  ctx.fillStyle = '#0f1319';
  ctx.fillRect(0, 0, W, H);

  const AX=155, CX=W-155, BW=168, BH=185, BT=H-222, WY=64, BMID=BT+36;

  drawBeaker(ctx, AX, BT, BW, BH, an, s.concAnode,   s.erosion,  0,         isGalv, isElec, true,  s.time);
  drawBeaker(ctx, CX, BT, BW, BH, ca, s.concCathode, 0,          s.deposit, isGalv, isElec, false, s.time);
  drawSaltBridge(ctx, AX, CX, BT, BW, BMID, isGalv, isElec, s.time);
  drawWire(ctx, AX, CX, BT, WY, W, isGalv);
  if (s.extVoltage > 0.001) drawBattery(ctx, W/2, WY, s.extVoltage, isElec);
  else drawVoltmeter(ctx, W/2, WY-14, eCell);
  tickParticles(s, isGalv, isElec, an, ca);
  drawParticles(ctx, s.particles, AX, CX, WY, BMID, BW, BT, isGalv, isElec);
  drawLabels(ctx, AX, CX, BT, BW, isGalv, isElec, an, ca);

  if ((isGalv || isElec) && s.time % 4 === 0) {
    if (isGalv) { s.deposit=Math.min(50,s.deposit+0.03); s.erosion=Math.min(35,s.erosion+0.02); }
    else        { s.deposit=Math.max(0,s.deposit-0.02);  s.erosion=Math.max(0,s.erosion-0.02);  }
  }
}

function drawBeaker(ctx, cx, top, bw, bh, cell:HalfCell, conc, erosion, deposit, isGalv, isElec, isAnode, time) {
  const bx=cx-bw/2, st=top+30, sh=bh-30;
  const al=Math.min(0.8, 0.3+conc*0.28);
  const sc=hexRgb(cell.solutionColor);

  /* solution fill */
  ctx.save();
  ctx.shadowColor='rgba(0,0,0,0.4)'; ctx.shadowBlur=14; ctx.shadowOffsetY=4;
  ctx.fillStyle=`rgba(${sc.r},${sc.g},${sc.b},${al})`;
  rrect(ctx, bx, st, bw, sh, 8); ctx.fill();
  ctx.restore();

  /* glass wall highlights — subtle */
  const gl = ctx.createLinearGradient(bx,0,bx+10,0);
  gl.addColorStop(0,'rgba(255,255,255,0.15)'); gl.addColorStop(1,'rgba(255,255,255,0)');
  ctx.fillStyle=gl; ctx.fillRect(bx, top, 6, bh);

  const gr = ctx.createLinearGradient(bx+bw-8,0,bx+bw,0);
  gr.addColorStop(0,'rgba(255,255,255,0)'); gr.addColorStop(1,'rgba(255,255,255,0.12)');
  ctx.fillStyle=gr; ctx.fillRect(bx+bw-6, top, 6, bh);

  /* beaker outline */
  ctx.strokeStyle='rgba(160,200,255,0.18)'; ctx.lineWidth=1.5;
  rrect(ctx, bx, top, bw, bh, 8); ctx.stroke();

  /* solution label — LARGER FONT for readability */
  const labelY = top+bh-15;
  const labelText = `1 M ${cell.saltFormula}(aq)`;
  ctx.font = 'bold 15px Inter,sans-serif';
  const tw = ctx.measureText(labelText).width;
  ctx.fillStyle = 'rgba(0,0,0,0.8)';
  rrect(ctx, cx-tw/2-12, labelY-18, tw+24, 26, 6); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.98)';
  ctx.textAlign='center';
  ctx.fillText(labelText, cx, labelY);

  drawElectrode(ctx, cx, top, bh, cell, erosion, deposit, isAnode, isGalv);
  
  /* Visual indicators for ion creation (anode) or consumption (cathode) */
  if (isGalv) {
    const ionColor = isAnode ? '#fbbf24' : '#60a5fa';
    const ionSymbol = isAnode ? (cell.n === 2 ? '²⁺' : cell.n === 3 ? '³⁺' : '⁺') : '';
    const ionText = isAnode ? `${cell.symbol}${ionSymbol}` : `${cell.symbol}²⁺`;
    
    /* Animated ions appearing (anode) or disappearing (cathode) */
    if (time % 60 < 45) {
      const floatY = (time % 60) * 1.5;
      ctx.fillStyle = ionColor;
      ctx.font = 'bold 11px Inter';
      ctx.textAlign = 'center';
      
      if (isAnode) {
        /* Zn²⁺ ions appearing and floating into solution */
        ctx.fillText(cell.symbol, cx - 25, top + 60 + floatY);
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('²⁺', cx - 15, top + 52 + floatY);
        
        ctx.fillStyle = ionColor;
        ctx.fillText(cell.symbol, cx + 30, top + 50 + floatY * 0.8);
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('²⁺', cx + 40, top + 42 + floatY * 0.8);
      } else {
        /* Cu²⁺ ions being consumed from solution */
        if (floatY < 40) {
          ctx.fillStyle = `rgba(96,165,250,${1 - floatY/40})`;
          ctx.fillText(cell.symbol, cx - 20, top + 55 - floatY);
          ctx.fillText('²⁺', cx - 10, top + 47 - floatY);
        }
      }
    }
    
    /* Label for ion activity */
    ctx.font = '10px Inter';
    ctx.fillStyle = isAnode ? 'rgba(251,191,36,0.7)' : 'rgba(96,165,250,0.7)';
    ctx.textAlign = 'center';
    ctx.fillText(isAnode ? '+ ions forming' : '- ions plating', cx, top + 45);
  }
}

function drawElectrode(ctx, cx, bTop, bh, cell:HalfCell, erosion, deposit, isAnode, isGalv) {
  const eW=22, eH=145-erosion, ex=cx-eW/2, ey=bTop-20;
  const ec=hexRgb(cell.electrodeColor);

  /* lead wire */
  ctx.strokeStyle='#6b7280'; ctx.lineWidth=2.5;
  ctx.beginPath(); ctx.moveTo(cx, bTop-36); ctx.lineTo(cx, ey); ctx.stroke();

  /* terminal dot */
  const tcol = isAnode ? (isGalv?'#e05252':'#4a90d9') : (isGalv?'#4a90d9':'#e05252');
  ctx.fillStyle=tcol; ctx.strokeStyle='rgba(255,255,255,0.4)'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.arc(cx, bTop-36, 6, 0, Math.PI*2); ctx.fill(); ctx.stroke();

  /* electrode body */
  const eg=ctx.createLinearGradient(ex,0,ex+eW,0);
  eg.addColorStop(0,`rgba(${Math.min(255,ec.r+40)},${Math.min(255,ec.g+40)},${Math.min(255,ec.b+40)},0.85)`);
  eg.addColorStop(0.5,`rgba(${ec.r},${ec.g},${ec.b},1)`);
  eg.addColorStop(1,`rgba(${Math.max(0,ec.r-30)},${Math.max(0,ec.g-30)},${Math.max(0,ec.b-30)},0.9)`);
  ctx.fillStyle=eg; ctx.shadowColor='transparent'; ctx.shadowBlur=0;
  rrect(ctx, ex, ey, eW, eH, 3); ctx.fill();

  /* highlight streak */
  ctx.fillStyle='rgba(255,255,255,0.15)';
  rrect(ctx, ex+3, ey+5, 3, eH-10, 2); ctx.fill();

  /* deposit layer */
  if (deposit > 0) {
    const dc=hexRgb(cell.electrodeColor), dh=Math.min(deposit,44);
    ctx.fillStyle=`rgba(${dc.r},${dc.g},${dc.b},0.6)`;
    rrect(ctx, ex-3, ey+eH-dh, eW+6, dh, 3); ctx.fill();
  }

  /* electrode label */
  ctx.fillStyle='rgba(255,255,255,0.9)'; ctx.font='bold 12px Inter,sans-serif';
  ctx.textAlign='center'; ctx.fillText(cell.symbol, cx, ey+eH/2+5);
}

function drawSaltBridge(ctx, AX, CX, BT, BW, midY, isGalv, isElec, time) {
  const lx=AX+BW/2-10, rx=CX-BW/2+10, R=13, D=46, midX=(lx+rx)/2;
  const topY = midY-D-R;
  const dipDepth = 35; /* How deep the bridge dips into solution */

  const path=()=>{
    ctx.beginPath();
    /* Start from inside left beaker solution, lower than before */
    ctx.moveTo(lx, BT+30);
    /* Curve up and out of left beaker */
    ctx.lineTo(lx, midY-D);
    ctx.arcTo(lx, topY, lx+R, topY, R);
    /* Top of bridge */
    ctx.lineTo(rx-R, topY);
    /* Curve down into right beaker */
    ctx.arcTo(rx, topY, rx, midY-D, R);
    /* Go down into right beaker solution */
    ctx.lineTo(rx, BT+30);
  };

  /* fill - wider for visibility */
  path();
  const bf=ctx.createLinearGradient(lx,0,rx,0);
  bf.addColorStop(0,'rgba(80,120,200,0.55)');
  bf.addColorStop(0.5,'rgba(110,160,240,0.65)');
  bf.addColorStop(1,'rgba(80,120,200,0.55)');
  ctx.strokeStyle=bf; ctx.lineWidth=R*2.5; ctx.lineCap='round'; ctx.stroke();

  /* inner highlight */
  path();
  ctx.strokeStyle='rgba(200,230,255,0.15)'; ctx.lineWidth=R*2-4; ctx.stroke();

  /* label above bridge - positioned higher to avoid overlap */
  ctx.fillStyle='rgba(148,197,253,0.9)'; ctx.font='bold 11px Inter,sans-serif';
  ctx.textAlign='center';
  ctx.fillText('salt bridge, KCl(aq)', midX, topY-18);

  /* animated ion direction indicators */
  if (isGalv || isElec) {
    const a=0.5+0.3*Math.sin(time*0.045), dir=isGalv?1:-1;
    ctx.fillStyle=`rgba(251,191,36,${a})`; ctx.font='bold 10px Inter,sans-serif';
    ctx.fillText(dir>0 ? 'K⁺ →' : '\u2190 K⁺', midX+20*dir, topY+R-2);
    ctx.fillStyle=`rgba(110,231,183,${a})`;
    ctx.fillText(dir>0 ? '\u2190 Cl⁻' : 'Cl⁻ →', midX-20*dir, topY+R+12);
  }
}

function drawWire(ctx, AX, CX, BT, WY, W, isGalv) {
  const mL=W/2-50, mR=W/2+50;
  ctx.lineWidth=3; ctx.lineCap='round';
  ctx.strokeStyle=isGalv?'#6b7280':'#c0392b';
  ctx.beginPath(); ctx.moveTo(AX,BT-36); ctx.lineTo(AX,WY); ctx.lineTo(mL,WY); ctx.stroke();
  ctx.strokeStyle=isGalv?'#c0392b':'#6b7280';
  ctx.beginPath(); ctx.moveTo(CX,BT-36); ctx.lineTo(CX,WY); ctx.lineTo(mR,WY); ctx.stroke();
}

function drawVoltmeter(ctx, cx, cy, ecell) {
  const W=88, H=56, x=cx-W/2, y=cy-H/2+16;
  /* body */
  ctx.fillStyle='#242c3a'; ctx.strokeStyle='#374151'; ctx.lineWidth=1;
  rrect(ctx, x, y, W, H, 8); ctx.fill(); ctx.stroke();
  /* screen */
  const sx=x+8, sy=y+8, sw=W-16, sh=H-24;
  ctx.fillStyle='#040d04';
  rrect(ctx, sx, sy, sw, sh, 4); ctx.fill();
  ctx.fillStyle='#00e000'; ctx.font='bold 17px "JetBrains Mono","Courier New",monospace';
  ctx.textAlign='center';
  ctx.fillText(Math.abs(ecell).toFixed(2), cx, sy+sh-4);
  /* knob */
  ctx.fillStyle='#1f2937'; ctx.strokeStyle='#374151';
  ctx.beginPath(); ctx.arc(cx, y+H-7, 5, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  /* label */
  ctx.fillStyle='#6b7280'; ctx.font='9px Inter,sans-serif';
  ctx.fillText('voltmeter', cx, y+H+13);
}

function drawBattery(ctx, cx, y, voltage, isElec) {
  const bw=82, bh=34, bx=cx-bw/2;
  const col = isElec ? '#d97706' : '#6b7280';
  ctx.fillStyle = isElec ? '#1c0f00' : '#1a1f2a';
  ctx.strokeStyle=col; ctx.lineWidth=1;
  rrect(ctx, bx, y-bh/2, bw, bh, 6); ctx.fill(); ctx.stroke();
  for (let i=-1; i<=1; i++) {
    const lx=cx+i*13; ctx.strokeStyle=col;
    ctx.lineWidth=i===0?3:1.5;
    ctx.beginPath(); ctx.moveTo(lx,y-(i===0?9:6)); ctx.lineTo(lx,y+(i===0?9:6)); ctx.stroke();
  }
  ctx.fillStyle=col; ctx.font='bold 11px "JetBrains Mono",monospace';
  ctx.textAlign='center';
  ctx.fillText(voltage.toFixed(2)+'V', cx, y+bh/2+14);
  ctx.fillStyle='#6b7280'; ctx.font='9px Inter,sans-serif';
  ctx.fillText('battery', cx, y+bh/2+25);
}

function drawLabels(ctx, AX, CX, BT, BW, isGalv, isElec, an:HalfCell, ca:HalfCell) {
  const ac = isGalv ? '#e57373' : '#5b9bd5';
  const cc = isGalv ? '#5b9bd5' : '#e57373';
  ctx.textAlign='center';

  /* anode label */
  ctx.fillStyle=ac; ctx.font='bold 13px Inter,sans-serif';
  ctx.fillText(an.symbol, AX-BW/2-28, BT+52);
  ctx.fillStyle='#9ca3af'; ctx.font='10px Inter,sans-serif';
  ctx.fillText('anode', AX-BW/2-28, BT+66);
  ctx.fillStyle=ac; ctx.font='bold 12px Inter,sans-serif';
  ctx.fillText(isGalv?'(−)':'(+)', AX-BW/2-28, BT+80);

  /* cathode label */
  ctx.fillStyle=cc; ctx.font='bold 13px Inter,sans-serif';
  ctx.fillText(ca.symbol, CX+BW/2+28, BT+52);
  ctx.fillStyle='#9ca3af'; ctx.font='10px Inter,sans-serif';
  ctx.fillText('cathode', CX+BW/2+28, BT+66);
  ctx.fillStyle=cc; ctx.font='bold 12px Inter,sans-serif';
  ctx.fillText(isGalv?'(+)':'(−)', CX+BW/2+28, BT+80);

  /* half-reaction text — solid background box for legibility */
  const drawRxnLabel = (text:string, x:number, col:string) => {
    ctx.font='13px Georgia,serif';
    const tw=ctx.measureText(text).width;
    ctx.fillStyle='rgba(0,0,0,0.7)';
    rrect(ctx, x-tw/2-10, BT+186, tw+20, 22, 4); ctx.fill();
    ctx.fillStyle=col; ctx.textAlign='center';
    ctx.fillText(text, x, BT+202);
  };
  drawRxnLabel(an.oxidationHalf, AX, 'rgba(229,115,115,0.95)');
  drawRxnLabel(ca.reductionHalf, CX, 'rgba(91,155,213,0.95)');
}

/* ════ PARTICLES ════ */
function tickParticles(s:CellState, isGalv:boolean, isElec:boolean, an:HalfCell, ca:HalfCell) {
  if (!isGalv && !isElec) { s.particles=[]; return; }
  s.particles = s.particles.filter(p => p.active);
  if (s.time%7===0 && s.particles.filter(p=>p.type==='electron').length < 10)
    s.particles.push({ progress:Math.random()*0.2, speed:0.005+Math.random()*0.003, lane:Math.floor(Math.random()*3)-1, active:true, type:'electron', color:'#60a5fa', label:'e⁻' });
  if (s.time%22===0 && s.particles.filter(p=>p.type==='cation').length < 3) {
    s.particles.push({ progress:Math.random(), speed:0.003+Math.random()*0.002, lane:0, active:true, type:'cation', color:'#fbbf24', label:'K⁺' });
    s.particles.push({ progress:Math.random(), speed:0.003+Math.random()*0.002, lane:1, active:true, type:'anion',  color:'#6ee7b7', label:'Cl⁻' });
  }
  s.particles.forEach(p => { p.progress+=p.speed; if (p.progress>=1) p.active=false; });
}

function drawParticles(ctx, particles:Particle[], AX, CX, WY, BMID, BW, BT, isGalv, isElec) {
  const fromX = isGalv?AX:CX, toX = isGalv?CX:AX;
  const lx=AX+BW/2-10, rx=CX-BW/2+10, D=46, R=13, bridgeY=BMID-D-R;
  particles.forEach(p => {
    if (!p.active) return;
    let px=0, py=0;
    if (p.type==='electron') {
      const lo=p.lane*5;
      if (p.progress<0.12)      { px=fromX; py=lerp(BT-36,WY+lo,p.progress/0.12); }
      else if (p.progress<0.88) { px=lerp(fromX,toX,(p.progress-0.12)/0.76); py=WY+lo; }
      else                      { px=toX;   py=lerp(WY+lo,BT-36,(p.progress-0.88)/0.12); }
      ctx.fillStyle='#93c5fd';
      ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(147,197,253,0.8)'; ctx.font='bold 8px Inter';
      ctx.textAlign='center'; ctx.fillText('e⁻', px, py-7);
    } else {
      const sx = p.type==='cation' ? (isGalv?lx:rx) : (isGalv?rx:lx);
      const ex = p.type==='cation' ? (isGalv?rx:lx) : (isGalv?lx:rx);
      px=lerp(sx,ex,p.progress); py=bridgeY+3+p.lane*8;
      ctx.fillStyle=p.color;
      ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle=p.color; ctx.font='bold 8px Inter';
      ctx.textAlign='center'; ctx.fillText(p.label, px, py-8);
    }
  });
}

/* ════ NERNST TAB ════ */
function NernstTab({ anode, cathode, n, concAnode, concCathode, eStd, eActual }) {
  const q    = concAnode / Math.max(1e-10, concCathode);
  const corr = -(R_GAS*TEMP/(n*F_CONST))*Math.log(q);
  return (
    <div className="ec-g2">
      <div className="ec-tc ec-tc--teal">
        <h4 className="ec-tct">Nernst Equation</h4>
        <div className="ec-eq">
          E<sub>cell</sub> = E°<sub>cell</sub> −{' '}
          <span className="ec-frac"><span>RT</span><span>nF</span></span> ln Q
        </div>
        <div className="ec-eq ec-eq--sm">
          At 25°C: E = E° −{' '}
          <span className="ec-frac"><span>0.0592</span><span>n</span></span> log Q
        </div>
        <div className="ec-numbox">
          <span className="ec-nv ec-nv--teal">{eActual.toFixed(4)} V</span>
          <span className="ec-op">=</span>
          <span className="ec-nv">{eStd.toFixed(4)}</span>
          <span className="ec-op">−</span>
          <span className="ec-nv ec-nv--amber">{Math.abs(corr).toFixed(4)}</span>
        </div>
        <p className="ec-sub">
          Q = {concAnode.toFixed(2)}/{concCathode.toFixed(2)} = {q.toFixed(4)}&nbsp;&nbsp;
          log Q = {Math.log10(q).toFixed(4)}&nbsp;&nbsp; n = {n}
        </p>
      </div>

      <div className="ec-tc ec-tc--purple">
        <h4 className="ec-tct">ΔG° and Equilibrium</h4>
        <div className="ec-eq">ΔG° = −nFE°<sub>cell</sub></div>
        <div className="ec-numbox">
          <span className="ec-nv ec-nv--purple">{(-n*F_CONST*eStd/1000).toFixed(2)} kJ/mol</span>
          <span className="ec-op">= −{n} × 96485 × {eStd.toFixed(3)}</span>
        </div>
        <div className="ec-eq" style={{marginTop:14}}>ΔG° = −RT ln K<sub>eq</sub></div>
        <p className="ec-sub">
          ln K = nFE°/RT = {(n*F_CONST*eStd/(R_GAS*TEMP)).toFixed(3)}<br/>
          K = {Math.pow(10, n*eStd/0.0592).toExponential(2)}
        </p>
        <div className="ec-infostrip">
          <span style={{color:'#4ade80'}}>ΔG° &lt; 0</span> → Spontaneous (galvanic)<br/>
          <span style={{color:'#f87171'}}>ΔG° &gt; 0</span> → Non-spontaneous (electrolytic)
        </div>
      </div>

      <div className="ec-tc ec-tc--amber" style={{gridColumn:'1/-1'}}>
        <h4 className="ec-tct">Standard Electrode Potentials (Reduction, 25°C)</h4>
        <p className="ec-sub" style={{marginBottom:14}}>
          Higher E° = stronger oxidising agent.&nbsp; SHE (H⁺/H₂) = 0.000 V reference.
        </p>
        <div className="ec-epgrid">
          {ELECTRODE_POTENTIALS.map((ep,i) => (
            <div key={i} className="ec-eprow">
              <span className="ec-ep-half" style={{color:ep.color}}>{ep.half}</span>
              <span className="ec-ep-val" style={{color:ep.e0>=0?'var(--ec-teal)':'var(--ec-danger)'}}>
                {ep.e0>=0?'+':''}{ep.e0.toFixed(2)} V
              </span>
              <div className="ec-epbar">
                <div style={{
                  position:'absolute', top:0, height:'100%', borderRadius:3,
                  left: ep.e0>=0 ? '50%' : `${50+ep.e0/3.04*50}%`,
                  width:`${Math.abs(ep.e0)/3.04*50}%`,
                  background: ep.e0>=0 ? 'var(--ec-teal)' : 'var(--ec-danger)',
                }}/>
                <div style={{position:'absolute',left:'50%',top:0,width:1,height:'100%',background:'rgba(255,255,255,0.1)'}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════ FARADAY TAB ════ */
function FaradayTab() {
  const [I, setI] = useState(2.0);
  const [t, setT] = useState(60);
  const [M, setM] = useState(63.5);
  const [nf,setNf]= useState(2);
  const Qc=I*t, mol=Qc/(nf*F_CONST), mass=mol*M;
  return (
    <div className="ec-g2">
      <div className="ec-tc ec-tc--teal">
        <h4 className="ec-tct">First Law — Mass ∝ Charge</h4>
        <div className="ec-eq">
          m = <span className="ec-frac"><span>M \u00b7 I \u00b7 t</span><span>n \u00b7 F</span></span>
        </div>
        <p style={{fontSize:13,color:'var(--ec-text2)',lineHeight:1.8,marginTop:12}}>
          Mass deposited/dissolved is <strong style={{color:'var(--ec-teal)'}}>directly proportional</strong> to
          charge Q = I×t and molar mass, and{' '}
          <strong style={{color:'var(--ec-amber)'}}>inversely proportional</strong> to n×F.<br/><br/>
          <strong>1 Faraday</strong> = 96485 C = charge of 1 mole of electrons<br/>
          <strong>1 Faraday</strong> deposits 1 gram-equivalent of any substance
        </p>
      </div>

      <div className="ec-tc ec-tc--purple">
        <h4 className="ec-tct">Second Law — Equivalent Masses</h4>
        <div className="ec-eq" style={{fontSize:20}}>
          m₁/m₂ = (M₁/n₁) / (M₂/n₂)
        </div>
        <p style={{fontSize:13,color:'var(--ec-text2)',lineHeight:1.8,marginTop:12}}>
          Same charge through different electrolytes in series → masses deposited are in ratio of their{' '}
          <strong style={{color:'var(--ec-purple)'}}>equivalent masses (M/n)</strong>.<br/><br/>
          <strong>Equivalent mass</strong> = Molar mass / valency (n-factor)
        </p>
      </div>

      <div className="ec-tc ec-tc--amber" style={{gridColumn:'1/-1'}}>
        <h4 className="ec-tct">Interactive Calculator</h4>
        <div className="ec-calclayout">
          <div>
            {[
              { lb:'Current (I)', unit:'A',     v:I,  s:setI,  mn:0.1, mx:20,   st:0.1, cls:'teal'   },
              { lb:'Time (t)',    unit:'s',     v:t,  s:setT,  mn:10,  mx:7200, st:10,  cls:'purple' },
              { lb:'Molar Mass',  unit:'g/mol', v:M,  s:setM,  mn:1,   mx:200,  st:0.5, cls:'amber'  },
              { lb:'Valency (n)', unit:'',      v:nf, s:setNf, mn:1,   mx:8,    st:1,   cls:'danger' },
            ].map(({ lb, unit, v, s, mn, mx, st, cls }) => (
              <div key={lb} className="ec-srow" style={{marginBottom:14}}>
                <span className="ec-sl">{lb}</span>
                <span className="ec-sv">{v} {unit}</span>
                <input type="range" min={mn} max={mx} step={st} value={v}
                  onChange={e => s(+e.target.value)}
                  className={`ec-range ec-range--${cls}`}
                />
              </div>
            ))}
          </div>
          <div className="ec-results">
            {[
              { lb:'Charge Q = I × t', v:`${Qc.toFixed(1)} C`,       cls:'teal'   },
              { lb:'Moles deposited',      v:`${mol.toFixed(6)} mol`,  cls:'purple' },
              { lb:'Mass deposited',       v:`${mass.toFixed(4)} g`,   cls:'amber'  },
              { lb:'Equivalent mass',      v:`${(M/nf).toFixed(2)} g/eq`, cls:'muted' },
            ].map(({ lb, v, cls }) => (
              <div key={lb} className="ec-rbox">
                <div className="ec-rlb">{lb}</div>
                <div className={`ec-rval ec-rval--${cls}`}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════ HOW IT WORKS TAB ════ */
function HowItWorksTab({ anode, cathode }) {
  return (
    <div>
      <div className="ec-herocard">
        <h2 className="ec-herotitle">How a Galvanic Cell Works</h2>
        <p className="ec-herotext">
          A galvanic (voltaic) cell converts <strong>chemical energy into electrical energy</strong> spontaneously.
          It has two half-cells connected by an external wire (electron flow) and a salt bridge (ion flow).
        </p>
        <div className="ec-steps">
          {[
            { n:'1', accent:'#e05252', t:`Oxidation at ${anode.symbol} Anode (−)`,
              d:`${anode.symbol} electrode dissolves: ${anode.oxidationHalf}. Metal loses electrons and enters solution as ${anode.ion} ions. The electrode erodes over time.` },
            { n:'2', accent:'#5b9bd5', t:'Electron Flow through External Wire',
              d:'Released electrons travel through the wire from anode → cathode. This electron flow IS the electric current. Direction of conventional current is opposite.' },
            { n:'3', accent:'#d97706', t:'Salt Bridge Maintains Electrical Neutrality',
              d:'KCl salt bridge: K⁺ migrates toward cathode half-cell; Cl⁻ migrates toward anode half-cell. This prevents charge buildup that would stop the cell.' },
            { n:'4', accent:'#2dd4bf', t:`Reduction at ${cathode.symbol} Cathode (+)`,
              d:`${cathode.ion} ions in solution gain electrons: ${cathode.reductionHalf}. ${cathode.symbol} deposits on the electrode, which grows thicker over time.` },
          ].map(s => (
            <div key={s.n} className="ec-step">
              <div className="ec-stepn" style={{background:`${s.accent}18`,color:s.accent,border:`1px solid ${s.accent}44`}}>{s.n}</div>
              <div>
                <p className="ec-stept" style={{color:s.accent}}>{s.t}</p>
                <p className="ec-stepd">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h3 className="ec-sectitle" style={{marginTop:28}}>Salt Bridge — Functions</h3>
      <div className="ec-g3">
        {[
          { t:'Maintains Electrical Neutrality', c:'var(--ec-teal)',
            d:'Without it, the anode solution accumulates excess positive charge and cathode accumulates negative charge. This quickly stops the cell.' },
          { t:'Completes the Circuit', c:'var(--ec-purple)',
            d:'External wire carries electrons; salt bridge carries ions. Removing the salt bridge stops current flow immediately.' },
          { t:'Prevents Direct Mixing', c:'var(--ec-amber)',
            d:'If solutions mixed directly, oxidising and reducing agents would react without electron flow — no useful electrical energy produced.' },
          { t:'Why KCl is Preferred', c:'var(--ec-danger)',
            d:'K⁺ and Cl⁻ have nearly equal ion mobilities, minimising liquid junction potential. Alternatives: NaCl, NH₄NO₃.' },
          { t:'Ion Migration Direction', c:'#60a5fa',
            d:'Cations (K⁺) migrate toward cathode; anions (Cl⁻) migrate toward anode. Rate equals electron flow to maintain instantaneous neutrality.' },
          { t:'EMF Stability', c:'#4ade80',
            d:'Proper ion migration allows the cell to maintain steady EMF throughout the reaction. Without salt bridge, EMF decays rapidly.' },
        ].map(c => (
          <div key={c.t} className="ec-infocard" style={{borderLeftColor:c.c}}>
            <p className="ec-infot" style={{color:c.c}}>{c.t}</p>
            <p className="ec-infod">{c.d}</p>
          </div>
        ))}
      </div>

      <h3 className="ec-sectitle" style={{marginTop:32}}>Galvanic vs Electrolytic Cell</h3>
      <div className="ec-cmptbl">
        <div className="ec-cmphdr">
          <span>Property</span>
          <span style={{color:'var(--ec-teal)'}}>Galvanic</span>
          <span style={{color:'var(--ec-amber)'}}>Electrolytic</span>
        </div>
        {[
          ['Energy conversion',   'Chemical → Electrical', 'Electrical → Chemical'],
          ['Spontaneity',         'Spontaneous (ΔG < 0)',  'Non-spontaneous (ΔG > 0)'],
          ['E°cell',             'Positive (> 0 V)',           'Negative or insufficient'],
          ['External energy',     'Not required',               'Required (battery/power supply)'],
          ['Anode polarity',      'Negative (−)',              'Positive (+)'],
          ['Cathode polarity',    'Positive (+)',               'Negative (−)'],
          ['Anode process',       'Oxidation (metal dissolves)','Oxidation (forced)'],
          ['Cathode process',     'Reduction (metal deposits)', 'Reduction (forced)'],
          ['Salt bridge',         'Required',                   'Not always required'],
          ['Examples',            'Daniel cell, dry cell, fuel cell', 'Electroplating, electrorefining, Hall\u2013H\u00e9roult'],
        ].map(([p,g,e],i) => (
          <div key={i} className={`ec-cmprow${i%2===0?' ec-cmprow--alt':''}`}>
            <span className="ec-cmpprop">{p}</span>
            <span style={{color:'#a7f3d0',fontSize:13}}>{g}</span>
            <span style={{color:'#fef3c7',fontSize:13}}>{e}</span>
          </div>
        ))}
      </div>

      <h3 className="ec-sectitle" style={{marginTop:36}}>Conceptual FAQ</h3>
      <p style={{fontSize:13,color:'var(--ec-muted)',marginTop:4,marginBottom:16}}>
        Questions students commonly get wrong — answered with precision.
      </p>
      <FaqSection />
    </div>
  );
}

/* ════ FAQ SECTION ════ */
function FaqSection() {
  const [open, setOpen] = useState<number|null>(null);
  const faqs = [
    {
      q: 'Why do electrons flow through the wire and NOT through the solution?',
      color: '#60a5fa',
      a: `Electrons are negatively charged particles that exist in the metallic lattice of conductors. In the external wire (copper), electrons are free to drift — this is metallic conduction.

In the electrolyte solution, there are no free electrons. The solution contains dissolved ions (Zn²⁺, Cu²⁺, NO₃⁻). These ions cannot leave the solution and enter the wire. Charge transport in solution happens only via ion migration, not electron flow.

If electrons tried to enter the solution, they would immediately react with nearby cations (reduction) rather than travel through it — there is no "electron sea" in ionic solutions.`,
    },
    {
      q: 'The circuit is closed — but how? Two different charge carriers are involved.',
      color: '#4ade80',
      a: `This is the key insight most students miss. The circuit is completed in two distinct segments:

① External circuit (wire): Electrons flow from anode → cathode. This is conventional current in the opposite direction (cathode → anode).

② Internal circuit (solution + salt bridge): Ions carry the charge. In the anode half-cell, Zn²⁺ ions form and accumulate. In the cathode half-cell, Cu²⁺ ions are consumed. The salt bridge (KCl) compensates: K⁺ migrates into the cathode half-cell (replacing consumed Cu²⁺ charge), and Cl⁻ migrates into the anode half-cell (neutralising excess Zn²⁺ charge).

Together, these two segments form one continuous closed loop of charge flow.`,
    },
    {
      q: 'Electrons flow from anode to cathode — but conventional current flows cathode to anode?',
      color: '#f59e0b',
      a: `Conventional current was defined by Benjamin Franklin before electrons were discovered — it was assumed positive charge flows from + to −. In a galvanic cell:

• Anode is − (electrons leave from here)
• Cathode is + (electrons arrive here)

So electrons (negative) flow: anode (−) → cathode (+) through the wire.
Conventional current (positive) flows: cathode (+) → anode (−) — the opposite direction.

This is exactly the same as in any conductor: conventional current is always opposite to electron flow.`,
    },
    {
      q: 'Why does removing the salt bridge stop the cell immediately?',
      color: '#a78bfa',
      a: `Without the salt bridge, the two half-cells cannot maintain electrical neutrality.

In the anode half-cell: Zn → Zn²⁺ + 2e⁻. Zn²⁺ ions accumulate → solution becomes positively charged. This positive charge repels further Zn²⁺ from forming — oxidation stops.

In the cathode half-cell: Cu²⁺ + 2e⁻ → Cu. Cu²⁺ ions are consumed → solution becomes negatively charged (excess NO₃⁻). This negative charge repels electrons from arriving — reduction stops.

The cell develops a counter-EMF equal to its own EMF within milliseconds, and current drops to zero. The salt bridge continuously neutralises these charge imbalances, allowing sustained current.`,
    },
    {
      q: 'The zinc electrode "erodes" — where exactly does the zinc go?',
      color: '#f87171',
      a: `Zinc atoms at the surface of the electrode undergo oxidation:

Zn(s) → Zn²⁺(aq) + 2e⁻

The zinc atom loses 2 electrons — these electrons remain on the metal and flow through the wire. The now-ionic Zn²⁺ breaks free from the metallic lattice and enters the aqueous solution, where it is stabilised by hydration (surrounded by water molecules).

Over time, the electrode literally dissolves from its surface inward. The mass lost from the electrode equals the mass of Zn²⁺ ions that entered solution. This is quantified by Faraday's First Law: m = MIt/nF.`,
    },
    {
      q: 'Why do copper ions deposit on the copper electrode and not anywhere else?',
      color: '#38bdf8',
      a: `Cu²⁺ ions in solution are attracted to the cathode because it carries a net negative charge (excess electrons arriving from the wire). The electrode surface acts as the electron donor.

At the cathode surface: Cu²⁺(aq) + 2e⁻ → Cu(s)

The driving force is the electrode potential difference. Cu²⁺ ions approaching the cathode encounter a region of high electron density and are reduced on contact. The newly formed Cu atom bonds to the existing copper lattice — this is why the deposit is coherent metal, not powder.

Ions cannot be reduced in the bulk solution because there is no electron source away from the electrode surface.`,
    },
    {
      q: 'What is the role of the KCl salt bridge specifically — why not just use a wire?',
      color: '#6ee7b7',
      a: `A metallic wire would create a short circuit — electrons would flow directly from one solution to the other, bypassing the external wire entirely, and the cell voltage would collapse to zero.

The salt bridge must allow ion migration (to complete the internal circuit) while preventing bulk mixing of the two electrolytes (which would allow direct chemical reaction without electrical work).

KCl is preferred because:
① K⁺ and Cl⁻ have nearly identical ionic mobilities (transport numbers ≈ 0.5 each), which minimises liquid junction potential — a source of EMF error.
② KCl is cheap, soluble, and inert toward most electrolytes.
③ The junction potential with KCl is typically < 1–2 mV, negligible for most measurements.`,
    },
    {
      q: 'Direction of current inside the cell vs outside — are they the same?',
      color: '#e879f9',
      a: `No — and this is a very common source of confusion.

Outside the cell (external circuit / wire):
Conventional current flows from cathode (+) to anode (−). Electrons flow anode → cathode.

Inside the cell (through the electrolyte and salt bridge):
Conventional current flows from anode to cathode — i.e., cations (Zn²⁺, K⁺) migrate toward the cathode half-cell; anions (NO₃⁻, Cl⁻) migrate toward the anode half-cell.

So inside the cell, current direction is anode → cathode; outside the cell, it is cathode → anode. Together they form one continuous loop — consistent with Kirchhoff's current law.`,
    },
  ];

  return (
    <div className="ec-faq">
      {faqs.map((faq, i) => (
        <div key={i} className={`ec-faq-item${open === i ? ' ec-faq-item--open' : ''}`} style={{'--faq-color': faq.color} as any}>
          <button className="ec-faq-q" onClick={() => setOpen(open === i ? null : i)}>
            <span className="ec-faq-icon">{open === i ? '−' : '+'}</span>
            <span>{faq.q}</span>
          </button>
          {open === i && (
            <div className="ec-faq-a">
              {faq.a.split('\n\n').map((para, j) => (
                <p key={j} style={{margin: j === 0 ? '0 0 12px' : '12px 0 0'}}>{para}</p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ════ THEORY TAB ════ */
function TheoryTab() {
  return (
    <div className="ec-g2">
      <div className="ec-tc ec-tc--teal">
        <h4 className="ec-tct">Cell Notation Convention</h4>
        <div className="ec-codebox">Zn | Zn²⁺ (1M) ‖ Cu²⁺ (1M) | Cu</div>
        <p style={{fontSize:13,color:'var(--ec-text2)',lineHeight:1.8,marginTop:10}}>
          <strong style={{color:'var(--ec-teal)'}}>|</strong> = phase boundary&nbsp;&nbsp;
          <strong style={{color:'var(--ec-teal)'}}>‖</strong> = salt bridge<br/>
          <strong>Left</strong> = anode (oxidation)&nbsp;&nbsp;
          <strong>Right</strong> = cathode (reduction)<br/>
          Concentration in parentheses. Anode written first.
        </p>
      </div>

      <div className="ec-tc ec-tc--purple">
        <h4 className="ec-tct">Conductance</h4>
        <div className="ec-codebox">κ = G × (l/A)&nbsp;&nbsp;|&nbsp;&nbsp;Λm = κ/C</div>
        <p style={{fontSize:13,color:'var(--ec-text2)',lineHeight:1.8,marginTop:10}}>
          <strong style={{color:'var(--ec-purple)'}}>G</strong> = conductance (S)&nbsp;&nbsp;
          <strong style={{color:'var(--ec-purple)'}}>κ</strong> = specific conductance (S/cm)<br/>
          <strong style={{color:'var(--ec-purple)'}}>Λm</strong> = molar conductance (S\u00b7cm²/mol)<br/>
          <strong>Kohlrausch:</strong> At infinite dilution, each ion contributes independently.
        </p>
        <div className="ec-codebox" style={{marginTop:10}}>
          Λ°m = λ°<sub>cation</sub> + λ°<sub>anion</sub>
        </div>
      </div>

      <div className="ec-tc ec-tc--amber">
        <h4 className="ec-tct">Corrosion — Electrochemical Process</h4>
        <p style={{fontSize:13,color:'var(--ec-text2)',lineHeight:1.8}}>
          Iron acts as <strong style={{color:'var(--ec-amber)'}}>anode</strong>;
          O₂ dissolved in water acts at <strong style={{color:'var(--ec-amber)'}}>cathode</strong>.
        </p>
        <div className="ec-codebox" style={{marginTop:8}}>Anode: Fe → Fe²⁺ + 2e⁻</div>
        <div className="ec-codebox" style={{marginTop:6}}>Cathode: O₂ + 2H₂O + 4e⁻ → 4OH⁻</div>
        <p style={{fontSize:13,color:'var(--ec-text2)',marginTop:8,lineHeight:1.6}}>
          Fe²⁺ + 2OH⁻ → Fe(OH)₂ → Fe₂O₃\u00b7xH₂O (rust)<br/>
          <strong>Prevention:</strong> galvanisation, alloying, cathodic protection
        </p>
      </div>

      <div className="ec-tc ec-tc--red">
        <h4 className="ec-tct">JEE / NEET Key Points</h4>
        <ul className="ec-keypoints">
          <li>E°cell = E°cathode − E°anode (both as reduction potentials)</li>
          <li>Nernst: E = E° − 0.0592/n × log Q at 25°C</li>
          <li>ΔG° = −nFE° = −2.303RT log K</li>
          <li>Daniel cell: E° = 0.34−(−0.76) = +1.10 V</li>
          <li>Faraday: m = (M×I×t) / (n×F)</li>
          <li>Molar conductance ↑ on dilution; specific conductance ↓</li>
          <li>Electroplating: object = cathode; plating metal = anode</li>
          <li>SHE = 0.000 V by convention at all conditions</li>
        </ul>
      </div>
    </div>
  );
}

/* ════ CSS ════ */
const CSS = `
  /* Design tokens */
  .ec-root {
    --ec-teal:   #2dd4bf;
    --ec-amber:  #f59e0b;
    --ec-purple: #a78bfa;
    --ec-danger: #e05252;
    --ec-muted:  #6b7280;
    --ec-text1:  #e2e8f0;
    --ec-text2:  #94a3b8;
    --ec-bg0:    #0f1319;
    --ec-bg1:    #161d28;
    --ec-bg2:    #1c2535;
    --ec-border: rgba(255,255,255,0.07);
    color: var(--ec-text1);
    font-family: Inter, system-ui, sans-serif;
  }

  /* Header */
  .ec-header { display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:24px; padding-bottom:20px; border-bottom:1px solid var(--ec-border); }
  .ec-bc     { font-size:11px; color:var(--ec-muted); letter-spacing:0.8px; text-transform:uppercase; font-weight:600; margin:0 0 4px; }
  .ec-title  { font-size:26px; font-weight:800; letter-spacing:-0.3px; margin:0; color:var(--ec-text1); }
  .ec-title em { color:var(--ec-teal); font-style:italic; font-family:'Crimson Pro',Georgia,serif; }
  .ec-badge  { font-size:11px; font-weight:700; padding:6px 14px; border-radius:20px; text-transform:uppercase; letter-spacing:0.8px; border:1px solid; transition:all 0.3s; flex-shrink:0; }
  .ec-badge--galv { background:rgba(45,212,191,0.08); color:var(--ec-teal);   border-color:rgba(45,212,191,0.25); }
  .ec-badge--elec { background:rgba(245,158,11,0.08);  color:var(--ec-amber); border-color:rgba(245,158,11,0.25); }
  .ec-badge--eq   { background:rgba(107,114,128,0.08); color:var(--ec-muted); border-color:rgba(107,114,128,0.2); }

  /* Tabs */
  .ec-tabs { display:flex; gap:4px; flex-wrap:wrap; border-bottom:1px solid var(--ec-border); padding-bottom:8px; margin-bottom:24px; }
  .ec-tab  { padding:7px 14px; border:none; border-radius:6px; background:transparent; color:var(--ec-muted); font-family:inherit; font-size:13px; font-weight:600; cursor:pointer; transition:color 0.15s,background 0.15s; }
  .ec-tab:hover       { color:var(--ec-text1); background:rgba(255,255,255,0.04); }
  .ec-tab--active     { color:var(--ec-teal); background:rgba(45,212,191,0.08); }

  /* Simulator layout */
  .ec-sim { display:grid; grid-template-columns:300px 1fr; gap:20px; align-items:start; }
  @media(max-width:880px) { .ec-sim { grid-template-columns:1fr; } }

  /* Sidebar */
  .ec-sidebar { display:flex; flex-direction:column; gap:12px; }
  .ec-card    { background:var(--ec-bg1); border:1px solid var(--ec-border); border-radius:12px; padding:16px; }
  .ec-card-title { font-size:11px; font-weight:700; color:var(--ec-muted); text-transform:uppercase; letter-spacing:0.8px; margin:0 0 12px; padding-bottom:8px; border-bottom:1px solid var(--ec-border); }
  .ec-flabel  { display:block; font-size:11px; font-weight:600; margin-bottom:6px; }
  .ec-flabel--anode   { color:#e05252; }
  .ec-flabel--cathode { color:#5b9bd5; }
  .ec-sel     { width:100%; background:var(--ec-bg2); border:1px solid var(--ec-border); border-left-width:2px; border-radius:7px; color:var(--ec-text1); font-family:inherit; font-size:12px; padding:7px 9px; outline:none; margin-bottom:6px; appearance:auto; }
  .ec-sel--anode   { border-left-color:#e05252; }
  .ec-sel--cathode { border-left-color:#5b9bd5; }
  .ec-sel:focus { border-color:var(--ec-teal); }
  .ec-hrxn    { font-size:13px; font-family:Georgia,serif; font-style:italic; padding:8px 11px; border-radius:7px; border:1px solid; background:rgba(0,0,0,0.25); line-height:1.6; margin:0; }
  .ec-hrxn--anode   { border-color:rgba(224,82,82,0.2); color:#fca5a5; }
  .ec-hrxn--cathode { border-color:rgba(91,155,213,0.2); color:#93c5fd; }
  .ec-hint    { font-size:11px; color:var(--ec-muted); margin:0 0 10px; line-height:1.5; }
  .ec-srow    { display:flex; align-items:center; gap:8px; margin-bottom:10px; }
  .ec-sl      { font-size:11px; font-weight:600; color:var(--ec-text2); min-width:62px; white-space:nowrap; }
  .ec-sv      { font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:700; color:var(--ec-text1); min-width:52px; text-align:right; }
  .ec-range   { flex:1; min-width:0; }
  .ec-range--anode   { accent-color:#e05252; }
  .ec-range--cathode { accent-color:#5b9bd5; }
  .ec-range--ext     { accent-color:var(--ec-amber); }
  .ec-range--teal    { accent-color:var(--ec-teal); }
  .ec-range--purple  { accent-color:var(--ec-purple); }
  .ec-range--amber   { accent-color:var(--ec-amber); }
  .ec-range--danger  { accent-color:var(--ec-danger); }
  .ec-btn-rm  { margin-top:4px; width:100%; background:transparent; color:#e05252; border:1px solid rgba(224,82,82,0.25); border-radius:6px; padding:6px 12px; font-size:12px; font-weight:600; cursor:pointer; transition:all 0.15s; font-family:inherit; }
  .ec-btn-rm:hover { background:rgba(224,82,82,0.1); }

  /* Live readings */
  .ec-live  { background:rgba(45,212,191,0.04); border:1px solid rgba(45,212,191,0.12); border-radius:12px; padding:14px; }
  .ec-lrow  { display:flex; justify-content:space-between; align-items:center; padding:5px 0; border-bottom:1px solid var(--ec-border); font-size:12px; }
  .ec-lrow:last-of-type { border:none; }
  .ec-llb   { color:var(--ec-text2); }
  .ec-lv    { font-family:'JetBrains Mono',monospace; font-size:13px; font-weight:700; }
  .ec-notation { font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--ec-muted); background:rgba(0,0,0,0.3); border-radius:5px; padding:6px 8px; text-align:center; word-break:break-all; margin-top:10px; }

  /* Canvas area */
  .ec-canvas-col  { display:flex; flex-direction:column; gap:12px; min-width:0; }
  .ec-canvas-wrap { position:relative; }
  .ec-canvas      { width:100%; height:auto; display:block; border-radius:12px; background:#0f1319; border:1px solid var(--ec-border); }
  .ec-canvas-actions { position:absolute; top:10px; right:10px; display:flex; gap:6px; z-index:10; }
  .ec-action-btn  { background:rgba(0,0,0,0.6); color:var(--ec-text2); border:1px solid var(--ec-border); border-radius:6px; padding:4px 10px; font-size:11px; font-weight:600; font-family:inherit; cursor:pointer; transition:all 0.15s; backdrop-filter:blur(4px); white-space:nowrap; }
  .ec-action-btn:hover { color:var(--ec-text1); background:rgba(0,0,0,0.8); }
  /* Focus mode — sidebar hidden, canvas takes full width */
  .ec-sim--focus { grid-template-columns:1fr; }
  .ec-rxnbox      { border-radius:10px; padding:14px 18px; font-size:15px; line-height:1.8; color:var(--ec-text1); min-height:80px; }
  .ec-rxnbox--galv { background:rgba(45,212,191,0.05); border:1px solid rgba(45,212,191,0.15); }
  .ec-rxnbox--elec { background:rgba(245,158,11,0.05);  border:1px solid rgba(245,158,11,0.15); }
  .ec-rxnbox--eq   { background:rgba(107,114,128,0.04); border:1px solid rgba(107,114,128,0.1); }
  .ec-highlight      { color:var(--ec-teal); }
  .ec-highlight-amber{ color:var(--ec-amber); }

  /* Content tabs shared */
  .ec-g2  { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .ec-g3  { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-top:14px; }
  @media(max-width:900px) { .ec-g2 { grid-template-columns:1fr; } .ec-g3 { grid-template-columns:1fr 1fr; } }
  @media(max-width:580px) { .ec-g3 { grid-template-columns:1fr; } }
  .ec-tc  { border-radius:12px; padding:20px; background:var(--ec-bg1); border:1px solid var(--ec-border); border-left-width:3px; }
  .ec-tc--teal   { border-left-color:var(--ec-teal); }
  .ec-tc--purple { border-left-color:var(--ec-purple); }
  .ec-tc--amber  { border-left-color:var(--ec-amber); }
  .ec-tc--red    { border-left-color:var(--ec-danger); }
  .ec-tct { font-size:10px; font-weight:700; color:var(--ec-muted); text-transform:uppercase; letter-spacing:0.8px; margin:0 0 14px; padding-bottom:8px; border-bottom:1px solid var(--ec-border); }
  .ec-eq  { font-family:'Crimson Pro',Georgia,serif; font-size:22px; font-style:italic; color:var(--ec-text1); text-align:center; padding:8px 0; }
  .ec-eq--sm { font-size:14px; color:var(--ec-text2); margin-top:2px; }
  .ec-frac { display:inline-flex; flex-direction:column; align-items:center; vertical-align:middle; margin:0 3px; }
  .ec-frac span:first-child { border-bottom:1.5px solid var(--ec-text2); padding:0 3px 2px; }
  .ec-frac span:last-child  { padding:2px 3px 0; }
  .ec-numbox { display:flex; align-items:center; justify-content:center; gap:8px; flex-wrap:wrap; background:rgba(0,0,0,0.25); border-radius:7px; padding:10px; margin-top:8px; }
  .ec-nv         { font-family:'JetBrains Mono',monospace; font-size:14px; font-weight:700; color:var(--ec-text1); }
  .ec-nv--teal   { color:var(--ec-teal); }
  .ec-nv--amber  { color:var(--ec-amber); }
  .ec-nv--purple { color:var(--ec-purple); }
  .ec-op  { color:var(--ec-muted); font-size:13px; }
  .ec-sub { font-size:12px; color:var(--ec-muted); margin-top:6px; line-height:1.6; }
  .ec-infostrip { margin-top:12px; background:rgba(0,0,0,0.2); border-radius:7px; padding:10px 12px; font-size:13px; color:var(--ec-text2); line-height:1.8; }
  .ec-codebox { background:rgba(0,0,0,0.3); border:1px solid var(--ec-border); border-radius:6px; padding:8px 14px; font-family:'Crimson Pro',Georgia,serif; font-size:16px; font-style:italic; color:var(--ec-text1); text-align:center; }

  /* Electrode potentials table */
  .ec-epgrid { display:flex; flex-direction:column; gap:4px; }
  .ec-eprow  { display:grid; grid-template-columns:120px 72px 1fr; gap:8px; align-items:center; padding:3px 0; }
  .ec-ep-half { font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:600; }
  .ec-ep-val  { font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:700; text-align:right; }
  .ec-epbar   { position:relative; height:7px; background:rgba(255,255,255,0.04); border-radius:3px; overflow:hidden; }

  /* Faraday calculator */
  .ec-calclayout { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
  @media(max-width:680px) { .ec-calclayout { grid-template-columns:1fr; } }
  .ec-results { display:flex; flex-direction:column; gap:10px; justify-content:center; }
  .ec-rbox    { background:rgba(0,0,0,0.25); border-radius:9px; padding:12px 14px; }
  .ec-rlb     { font-size:10px; font-weight:600; color:var(--ec-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px; }
  .ec-rval    { font-family:'JetBrains Mono',monospace; font-size:20px; font-weight:700; }
  .ec-rval--teal   { color:var(--ec-teal); }
  .ec-rval--purple { color:var(--ec-purple); }
  .ec-rval--amber  { color:var(--ec-amber); }
  .ec-rval--muted  { color:var(--ec-text2); }

  /* How It Works */
  .ec-herocard  { background:var(--ec-bg1); border:1px solid var(--ec-border); border-radius:14px; padding:24px; }
  .ec-herotitle { font-size:19px; font-weight:700; color:var(--ec-text1); margin:0 0 10px; }
  .ec-herotext  { font-size:14px; color:var(--ec-text2); line-height:1.75; margin:0 0 22px; }
  .ec-steps     { display:flex; flex-direction:column; gap:16px; }
  .ec-step      { display:flex; gap:14px; align-items:flex-start; }
  .ec-stepn     { width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:13px; flex-shrink:0; }
  .ec-stept     { font-size:14px; font-weight:700; margin:0 0 4px; }
  .ec-stepd     { font-size:13px; color:var(--ec-text2); line-height:1.7; margin:0; }
  .ec-sectitle  { font-size:16px; font-weight:700; color:var(--ec-text1); margin:0 0 4px; }
  .ec-infocard  { background:var(--ec-bg1); border:1px solid var(--ec-border); border-left-width:3px; border-radius:10px; padding:16px; }
  .ec-infot     { font-size:13px; font-weight:700; margin:0 0 7px; }
  .ec-infod     { font-size:13px; color:var(--ec-text2); line-height:1.7; margin:0; }

  /* Comparison table */
  .ec-cmptbl  { border-radius:12px; overflow:hidden; border:1px solid var(--ec-border); margin-top:14px; }
  .ec-cmphdr  { display:grid; grid-template-columns:1.2fr 1.5fr 1.5fr; background:var(--ec-bg2); padding:11px 14px; font-size:11px; font-weight:700; color:var(--ec-muted); text-transform:uppercase; letter-spacing:0.5px; border-bottom:1px solid var(--ec-border); gap:8px; }
  .ec-cmprow  { display:grid; grid-template-columns:1.2fr 1.5fr 1.5fr; padding:9px 14px; border-bottom:1px solid var(--ec-border); gap:8px; }
  .ec-cmprow--alt { background:rgba(255,255,255,0.015); }
  .ec-cmpprop { font-size:12px; font-weight:600; color:var(--ec-text2); }

  /* Theory keypoints */
  .ec-keypoints { font-size:13px; color:var(--ec-text2); line-height:2; padding-left:18px; margin:0; }
  .ec-keypoints li::marker { color:var(--ec-danger); }

  /* Atomic View Panels */
  .ec-atomic-container { background:var(--ec-bg1); border:1px solid var(--ec-border); border-radius:14px; padding:16px; margin-top:12px; }
  .ec-atomic-close { display:flex; justify-content:flex-end; margin-bottom:12px; }
  .ec-atomic-panels { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  @media(max-width:900px) { .ec-atomic-panels { grid-template-columns:1fr; } }
  .ec-atomic-panel { background:var(--ec-bg2); border:1px solid var(--ec-border); border-radius:12px; overflow:hidden; }
  .ec-atomic-title { font-size:14px; font-weight:700; margin:0; padding:12px 16px; border-bottom:1px solid var(--ec-border); background:rgba(0,0,0,0.2); }
  .ec-atomic-diagram { background:var(--ec-bg0); border-bottom:1px solid var(--ec-border); padding:16px; }
  .ec-atomic-svg { width:100%; height:auto; display:block; max-height:200px; }
  .ec-atomic-explain { padding:14px 16px; }
  .ec-atomic-eq { font-family:Georgia,serif; font-style:italic; font-size:15px; color:var(--ec-text1); background:rgba(0,0,0,0.25); padding:10px 14px; border-radius:6px; border-left:3px solid var(--ec-teal); margin:0 0 12px; }
  .ec-atomic-steps { margin:0; padding-left:18px; font-size:13px; color:var(--ec-text2); line-height:1.9; }
  .ec-atomic-steps li { margin-bottom:8px; }
  .ec-atomic-steps strong { color:var(--ec-text1); }
  /* Legacy atomic styles (keep for compatibility) */
  .ec-atomic-views { display:flex; flex-direction:column; gap:12px; margin-top:12px; }
  .ec-atomic-toggle { width:100%; background:transparent; border:none; color:var(--ec-text1); font-family:inherit; font-size:13px; font-weight:600; text-align:left; padding:12px 16px; cursor:pointer; transition:all 0.15s; display:flex; align-items:center; gap:8px; }
  .ec-atomic-toggle:hover { background:rgba(255,255,255,0.03); }
  .ec-atomic-content { display:grid; grid-template-columns:280px 1fr; gap:20px; padding:16px; border-top:1px solid var(--ec-border); }
  @media(max-width:720px) { .ec-atomic-content { grid-template-columns:1fr; } }

  /* FAQ Section */
  .ec-faq { display:flex; flex-direction:column; gap:8px; }
  .ec-faq-item { border-radius:10px; border:1px solid var(--ec-border); background:var(--ec-bg1); overflow:hidden; transition:border-color 0.2s; }
  .ec-faq-item--open { border-color:var(--faq-color,var(--ec-teal)); }
  .ec-faq-q { width:100%; background:transparent; border:none; display:flex; align-items:flex-start; gap:12px; padding:14px 16px; cursor:pointer; text-align:left; font-family:inherit; font-size:13.5px; font-weight:600; color:var(--ec-text1); line-height:1.5; transition:background 0.15s; }
  .ec-faq-q:hover { background:rgba(255,255,255,0.03); }
  .ec-faq-item--open .ec-faq-q { color:var(--faq-color,var(--ec-teal)); background:rgba(255,255,255,0.02); }
  .ec-faq-icon { flex-shrink:0; width:22px; height:22px; border-radius:50%; background:rgba(255,255,255,0.06); border:1px solid var(--ec-border); display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:400; color:var(--ec-muted); margin-top:1px; transition:background 0.15s, color 0.15s; }
  .ec-faq-item--open .ec-faq-icon { background:color-mix(in srgb, var(--faq-color,var(--ec-teal)) 18%, transparent); border-color:var(--faq-color,var(--ec-teal)); color:var(--faq-color,var(--ec-teal)); }
  .ec-faq-a { padding:0 16px 16px 50px; font-size:13px; color:var(--ec-text2); line-height:1.8; border-top:1px solid var(--ec-border); padding-top:14px; }
  .ec-faq-a p { margin:0; }
  .ec-faq-a p + p { margin-top:10px; }

  /* Mobile adjustments */
  @media(max-width:580px) {
    .ec-title { font-size:21px; }
    .ec-cmptbl { font-size:11px; }
    .ec-cmphdr, .ec-cmprow { grid-template-columns:1fr 1fr; }
    .ec-cmphdr span:first-child, .ec-cmprow span:first-child { display:none; }
  }
`;
