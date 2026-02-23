'use client';

import { useState, useEffect, useRef } from 'react';
import { REACTIONS, QUICK_REF, TYPE_COLOR } from './data';
import type { Reaction } from './types';
import AcidityLab from './AcidityLab';

function typeStyle(type: string) {
  const c = TYPE_COLOR[type] ?? ['rgba(90,80,110,0.1)', 'rgba(90,80,110,0.3)', '#9890b0'];
  return { background: c[0], borderColor: c[1], color: c[2] };
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display:'flex', gap:14, padding:'9px 14px', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
      <span style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.38)', textTransform:'uppercase' as const, letterSpacing:'0.07em', minWidth:92, flexShrink:0, paddingTop:2 }}>{label}</span>
      <span style={{ fontSize:15, color:'rgba(255,255,255,0.78)', lineHeight:1.6, flex:1 }}>{value}</span>
    </div>
  );
}

function Panel({ variant, label, body }: { variant: 'stereo'|'mistake'|'hook'|'jee'; label: string; body: string }) {
  const s = { stereo:['rgba(70,120,170,0.08)','rgba(70,120,170,0.2)','#88b8d8'], mistake:['rgba(160,70,70,0.08)','rgba(160,70,70,0.2)','#d09090'], hook:['rgba(160,140,60,0.08)','rgba(160,140,60,0.2)','#d4c078'], jee:['rgba(100,85,145,0.08)','rgba(100,85,145,0.2)','#aea0d2'] }[variant];
  return (
    <div style={{ borderRadius:9, padding:'12px 15px', marginBottom:9, background:s[0], border:`1px solid ${s[1]}` }}>
      <div style={{ fontSize:11.5, fontWeight:700, letterSpacing:'0.09em', textTransform:'uppercase' as const, marginBottom:6, color:s[2] }}>{label}</div>
      <div style={{ fontSize:15, lineHeight:1.7, color:'rgba(255,255,255,0.7)' }}>{body}</div>
    </div>
  );
}

function ReactionCard({ r, isOpen, onToggle }: { r: Reaction; isOpen: boolean; onToggle: () => void }) {
  const ts = typeStyle(r.type);
  const pb = r.priority==='high' ? {bg:'rgba(248,113,113,0.12)',c:'#fca5a5',bc:'rgba(248,113,113,0.3)'} : r.priority==='medium' ? {bg:'rgba(251,191,36,0.12)',c:'#fcd34d',bc:'rgba(251,191,36,0.3)'} : {bg:'rgba(52,211,153,0.12)',c:'#6ee7b7',bc:'rgba(52,211,153,0.28)'};
  const eb = r.exam==='both' ? {bg:'rgba(139,92,246,0.12)',c:'#c4b5fd',bc:'rgba(139,92,246,0.3)'} : r.exam==='advanced' ? {bg:'rgba(251,146,60,0.12)',c:'#fdba74',bc:'rgba(251,146,60,0.3)'} : {bg:'rgba(96,165,250,0.12)',c:'#93c5fd',bc:'rgba(96,165,250,0.28)'};
  const pLabel = r.priority==='high'?'High':r.priority==='medium'?'Medium':'Low';
  const eLabel = r.exam==='both'?'Mains + Adv':r.exam==='advanced'?'Adv only':'Mains';
  return (
    <div style={{ borderRadius:14, background:isOpen?'rgba(139,92,246,0.05)':'rgba(255,255,255,0.02)', border:`1px solid ${isOpen?'rgba(139,92,246,0.25)':'rgba(255,255,255,0.07)'}`, marginBottom:10, overflow:'hidden', transition:'border-color .2s, background .2s' }}>
      {/* Card header — always visible */}
      <div onClick={onToggle} style={{ padding:'16px 18px', cursor:'pointer', userSelect:'none' as const }}>
        <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8, flexWrap:'wrap' as const }}>
              <span style={{ fontSize:17, fontWeight:650, color:'rgba(255,255,255,0.95)', letterSpacing:'-0.01em' }}>{r.name}</span>
              {r.videoUrl && (
                <a href={r.videoUrl} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()}
                  title="Watch video explanation"
                  style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'2px 9px', borderRadius:5, fontSize:11.5, fontWeight:600, background:'rgba(220,70,70,0.1)', border:'1px solid rgba(220,70,70,0.22)', color:'rgba(220,120,110,0.9)', textDecoration:'none', flexShrink:0, letterSpacing:'.03em' }}>
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor"><path d="M6 4l7 4-7 4V4z"/></svg>
                  Video
                </a>
              )}
            </div>
            <div style={{ display:'flex', flexWrap:'wrap' as const, gap:5 }}>
              <span style={{ display:'inline-flex', padding:'3px 10px', borderRadius:6, fontSize:12, fontWeight:600, border:'1px solid', whiteSpace:'nowrap' as const, ...ts }}>{r.type}</span>
              <span style={{ display:'inline-flex', padding:'3px 10px', borderRadius:6, fontSize:12, color:'rgba(255,255,255,0.45)', border:'1px solid rgba(255,255,255,0.09)', background:'rgba(255,255,255,0.04)', whiteSpace:'nowrap' as const }}>{r.chapter}</span>
              <span style={{ display:'inline-flex', padding:'3px 10px', borderRadius:6, fontSize:12, fontWeight:600, whiteSpace:'nowrap' as const, background:pb.bg, color:pb.c, border:`1px solid ${pb.bc}` }}>{pLabel}</span>
              <span style={{ display:'inline-flex', padding:'3px 10px', borderRadius:6, fontSize:12, fontWeight:600, whiteSpace:'nowrap' as const, background:eb.bg, color:eb.c, border:`1px solid ${eb.bc}` }}>{eLabel}</span>
            </div>
          </div>
          <svg style={{ flexShrink:0, opacity:isOpen?0.6:0.3, transform:isOpen?'rotate(90deg)':'none', marginTop:4, transition:'transform 0.2s, opacity .2s' }} width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ fontSize:14.5, color:'rgba(255,255,255,0.58)', lineHeight:1.65, marginTop:9 }}>{r.summary}</div>
        {!isOpen && <div style={{ display:'flex', flexWrap:'wrap' as const, gap:4, marginTop:10 }}>{r.tags.slice(0,5).map(t=><span key={t} style={{ display:'inline-flex', padding:'2px 9px', borderRadius:5, fontSize:12, color:'rgba(255,255,255,0.32)', border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.03)' }}>{t}</span>)}</div>}
      </div>

      {/* Expanded content */}
      {isOpen && (
        <div style={{ borderTop:'1px solid rgba(139,92,246,0.15)', padding:'18px 18px 20px' }}>

          {/* SVG diagram slot */}
          {r.svgUrl ? (
            <div style={{ marginBottom:18, borderRadius:12, overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)', padding:'14px 18px', display:'flex', justifyContent:'center' }}>
              <img src={r.svgUrl} alt={`${r.name} reaction diagram`} style={{ maxWidth:'100%', maxHeight:220, objectFit:'contain' }}/>
            </div>
          ) : (
            <div style={{ marginBottom:18, borderRadius:12, border:'1px dashed rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.015)', padding:'14px 18px', display:'flex', alignItems:'center', gap:10 }}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ opacity:.3, flexShrink:0 }}><rect x="2" y="2" width="16" height="16" rx="2" stroke="white" strokeWidth="1.4"/><path d="M2 13l4-4 3 3 3-4 6 6" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span style={{ fontSize:12.5, color:'rgba(255,255,255,0.25)', fontStyle:'italic' }}>No reaction diagram yet — add <code style={{ fontFamily:'DM Mono,monospace', fontSize:11.5 }}>svgUrl</code> in data.ts</span>
            </div>
          )}

          {/* Info table */}
          <div style={{ borderRadius:10, border:'1px solid rgba(255,255,255,0.08)', overflow:'hidden', marginBottom:14 }}>
            <InfoRow label="Reactants" value={r.reactants} />
            <InfoRow label="Reagents" value={r.reagents} />
            <InfoRow label="Conditions" value={r.conditions} />
            <InfoRow label="Product" value={r.product} />
            <InfoRow label="Mechanism" value={r.mechanism} />
            <div style={{ display:'flex', gap:14, padding:'10px 15px' }}>
              <span style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.38)', textTransform:'uppercase' as const, letterSpacing:'0.07em', minWidth:92, flexShrink:0 }}>Difficulty</span>
              <span style={{ fontSize:15, color:'rgba(255,255,255,0.75)', textTransform:'capitalize' as const }}>{r.difficulty}</span>
            </div>
          </div>

          {r.stereo && <Panel variant="stereo" label="Stereochemistry" body={r.stereo} />}
          <Panel variant="mistake" label="Common Mistake" body={r.mistake} />
          <Panel variant="hook" label="Memory Hook" body={r.hook} />
          <Panel variant="jee" label="JEE Relevance" body={r.jee} />

          {/* Footer: tags + video link */}
          <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:14, flexWrap:'wrap' as const }}>
            <div style={{ display:'flex', flexWrap:'wrap' as const, gap:5, flex:1 }}>{r.tags.map(t=><span key={t} style={{ display:'inline-flex', padding:'2px 9px', borderRadius:5, fontSize:12, color:'rgba(255,255,255,0.35)', border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.03)' }}>{t}</span>)}</div>
            {r.videoUrl && (
              <a href={r.videoUrl} target="_blank" rel="noopener noreferrer"
                style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'7px 15px', borderRadius:8, fontSize:13, fontWeight:600, background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.3)', color:'#fca5a5', textDecoration:'none', flexShrink:0 }}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M6 4l7 4-7 4V4z"/></svg>
                Watch Explanation
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function chip(active: boolean, col?: string): React.CSSProperties {
  const base: React.CSSProperties = { padding:'6px 14px', borderRadius:7, border:'1px solid rgba(255,255,255,0.09)', background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.48)', fontSize:13.5, fontWeight:500, cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap' as const, transition:'all .15s' };
  if (!active) return base;
  const cols: Record<string,React.CSSProperties> = {
    blue:  { background:'rgba(96,165,250,0.15)', borderColor:'rgba(96,165,250,0.4)',  color:'#93c5fd' },
    red:   { background:'rgba(248,113,113,0.15)',borderColor:'rgba(248,113,113,0.4)', color:'#fca5a5' },
    green: { background:'rgba(52,211,153,0.15)', borderColor:'rgba(52,211,153,0.4)',  color:'#6ee7b7' },
    amber: { background:'rgba(251,191,36,0.15)', borderColor:'rgba(251,191,36,0.4)',  color:'#fcd34d' },
  };
  return { ...base, border:'1px solid rgba(139,92,246,0.45)', background:'rgba(139,92,246,0.18)', color:'rgba(255,255,255,0.92)', fontWeight:650, ...(col?cols[col]:{}) };
}

function NamedReactionsTab() {
  const [query, setQuery] = useState('');
  const [exam, setExam] = useState('all');
  const [prio, setPrio] = useState('all');
  const [type, setType] = useState('all');
  const [openId, setOpenId] = useState<string|null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key==='/' && document.activeElement!==searchRef.current) { e.preventDefault(); searchRef.current?.focus(); }
      if (e.key==='Escape') { setQuery(''); searchRef.current?.blur(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);
  const allTypes = Array.from(new Set(REACTIONS.map(r=>r.type))).sort();
  const visible = REACTIONS.filter(r => {
    if (exam!=='all' && r.exam!=='both' && r.exam!==exam) return false;
    if (prio!=='all' && r.priority!==prio) return false;
    if (type!=='all' && r.type!==type) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return r.name.toLowerCase().includes(q)||r.summary.toLowerCase().includes(q)||r.chapter.toLowerCase().includes(q)||r.tags.some(t=>t.toLowerCase().includes(q))||r.reactants.toLowerCase().includes(q)||r.reagents.toLowerCase().includes(q);
  });
  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:24, fontWeight:700, color:'rgba(255,255,255,0.92)', marginBottom:4, letterSpacing:'-0.01em' }}>Named Reactions</h2>
        <p style={{ fontSize:14, color:'rgba(255,255,255,0.38)' }}>{REACTIONS.length} reactions · click any card to expand full detail</p>
      </div>
      <div style={{ position:'relative', marginBottom:14 }}>
        <svg style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', opacity:0.3, pointerEvents:'none' }} width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="1.5"/><path d="M11 11L14 14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
        <input ref={searchRef} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search reactions, reagents, keywords…  / to focus" style={{ width:'100%', padding:'10px 36px', borderRadius:9, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.88)', fontSize:15, outline:'none', fontFamily:'inherit' }}/>
        {query && <button onClick={()=>setQuery('')} style={{ position:'absolute', right:11, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(255,255,255,0.35)', cursor:'pointer', fontSize:18 }}>×</button>}
      </div>
      <div style={{ marginBottom:18, display:'flex', flexDirection:'column' as const, gap:10, padding:'14px 16px', background:'rgba(255,255,255,0.025)', borderRadius:11, border:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:7, flexWrap:'wrap' as const }}>
          <span style={{ fontSize:11.5, fontWeight:700, color:'rgba(255,255,255,0.32)', textTransform:'uppercase' as const, letterSpacing:'0.09em', minWidth:56 }}>Exam</span>
          <button onClick={()=>setExam('all')} style={chip(exam==='all')}>All</button>
          <button onClick={()=>setExam('mains')} style={chip(exam==='mains','blue')}>JEE Mains</button>
          <button onClick={()=>setExam('advanced')} style={chip(exam==='advanced','red')}>JEE Advanced</button>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:7, flexWrap:'wrap' as const }}>
          <span style={{ fontSize:11.5, fontWeight:700, color:'rgba(255,255,255,0.32)', textTransform:'uppercase' as const, letterSpacing:'0.09em', minWidth:56 }}>Priority</span>
          <button onClick={()=>setPrio('all')} style={chip(prio==='all')}>All</button>
          <button onClick={()=>setPrio('high')} style={chip(prio==='high','red')}>High</button>
          <button onClick={()=>setPrio('medium')} style={chip(prio==='medium','amber')}>Medium</button>
          <button onClick={()=>setPrio('low')} style={chip(prio==='low','green')}>Low</button>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:7, flexWrap:'wrap' as const }}>
          <span style={{ fontSize:11.5, fontWeight:700, color:'rgba(255,255,255,0.32)', textTransform:'uppercase' as const, letterSpacing:'0.09em', minWidth:56 }}>Type</span>
          <button onClick={()=>setType('all')} style={chip(type==='all')}>All</button>
          {allTypes.map(t=><button key={t} onClick={()=>setType(t)} style={chip(type===t)}>{t}</button>)}
        </div>
      </div>
      <div style={{ fontSize:14, color:'rgba(255,255,255,0.35)', marginBottom:13 }}>
        <strong style={{ color:'rgba(255,255,255,0.65)', fontWeight:600 }}>{visible.length}</strong> of {REACTIONS.length} reactions
      </div>
      {visible.length===0 ? (
        <div style={{ textAlign:'center', padding:'52px 20px', color:'rgba(255,255,255,0.18)', fontSize:15 }}>No reactions match these filters.<br/><small style={{ color:'rgba(255,255,255,0.12)' }}>Try clearing a filter or adjusting your search.</small></div>
      ) : visible.map(r=><ReactionCard key={r.id} r={r} isOpen={openId===r.id} onToggle={()=>setOpenId(openId===r.id?null:r.id)}/>)}
    </div>
  );
}

function QuickReferenceTab() {
  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:24, fontWeight:700, color:'rgba(255,255,255,0.92)', marginBottom:4, letterSpacing:'-0.01em' }}>Quick Reference</h2>
        <p style={{ fontSize:14, color:'rgba(255,255,255,0.38)' }}>Essential tables for JEE revision</p>
      </div>
      {QUICK_REF.map(table=>(
        <div key={table.title} style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:11, overflow:'hidden', marginBottom:14 }}>
          <div style={{ padding:'13px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', fontSize:16, fontWeight:650, color:'rgba(255,255,255,0.88)' }}>{table.title}</div>
          {table.rows.map((row,i)=>(
            <div key={i} style={{ display:'flex', gap:12, padding:'10px 16px', borderBottom:i<table.rows.length-1?'1px solid rgba(255,255,255,0.04)':'none', alignItems:'baseline' }}>
              <span style={{ fontSize:15, color:'rgba(255,255,255,0.78)', flex:2 }}>{row[0]}</span>
              <span style={{ fontSize:14, color:'rgba(200,185,245,0.78)', fontFamily:'DM Mono,monospace', flex:1 }}>{row[1]}</span>
              <span style={{ fontSize:13.5, color:'rgba(255,255,255,0.42)', flex:2 }}>{row[2]}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function AcidityLabTab() {
  return <AcidityLab />;
}

function NavBtn({ active, onClick, icon, label, count }: { active:boolean; onClick:()=>void; icon:React.ReactNode; label:string; count:string }) {
  return (
    <button onClick={onClick} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'10px 12px', borderRadius:8, border:'none', background:active?'rgba(139,92,246,0.15)':'transparent', color:active?'rgba(255,255,255,0.95)':'rgba(255,255,255,0.45)', fontSize:14, fontWeight:active?600:450, cursor:'pointer', textAlign:'left' as const, boxShadow:active?'inset 2px 0 0 rgba(139,92,246,0.8)':'none', fontFamily:'inherit', transition:'background .15s, color .15s' }}>
      {icon}
      {label}
      <span style={{ marginLeft:'auto', fontSize:11.5, background:active?'rgba(139,92,246,0.2)':'rgba(255,255,255,0.05)', padding:'2px 8px', borderRadius:4, color:active?'rgba(196,181,253,0.9)':'rgba(255,255,255,0.3)', fontFamily:'DM Mono,monospace' }}>{count}</span>
    </button>
  );
}

type Section = 'named'|'lab'|'ref';

export default function OrganicMasterPage() {
  const [section, setSection] = useState<Section>('named');
  return (
    <div style={{ display:'flex', flexDirection:'column', background:'#0b0d12', color:'#d4d6e0', fontFamily:"'DM Sans',sans-serif", fontSize:16 }}>
      <style>{`*,*::before,*::after{box-sizing:border-box}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:rgba(139,92,246,0.2);border-radius:4px}::-webkit-scrollbar-thumb:hover{background:rgba(139,92,246,0.35)}button,input{font-family:inherit}`}</style>

      {/* Body — sidebar + main, sits below the fixed global Navbar (~72px tall) */}
      <div style={{ display:'flex', height:'calc(100vh - 72px)', marginTop:72, position:'sticky', top:72, overflow:'hidden' }}>
        {/* Sidebar */}
        <aside style={{ width:230, flexShrink:0, background:'rgba(255,255,255,0.02)', borderRight:'1px solid rgba(255,255,255,0.07)', padding:'16px 10px', display:'flex', flexDirection:'column', gap:2, overflowY:'auto' }}>
          <div style={{ fontSize:10.5, fontWeight:700, color:'rgba(255,255,255,0.25)', letterSpacing:'0.14em', textTransform:'uppercase', padding:'4px 12px 10px' }}>Organic Master</div>
          <NavBtn active={section==='named'} onClick={()=>setSection('named')} label="Named Reactions" count={String(REACTIONS.length)}
            icon={<svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M10 2L12.09 7.26L17.51 7.63L13.5 11.14L14.82 16.49L10 13.77L5.18 16.49L6.5 11.14L2.49 7.63L7.91 7.26L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>}/>
          <NavBtn active={section==='lab'} onClick={()=>setSection('lab')} label="Acidity Lab" count="∿"
            icon={<svg width="14" height="14" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.3"/></svg>}/>
          <NavBtn active={section==='ref'} onClick={()=>setSection('ref')} label="Quick Reference" count={String(QUICK_REF.length)}
            icon={<svg width="14" height="14" viewBox="0 0 20 20" fill="none"><rect x="3" y="5" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M7 5V3M13 5V3M3 9h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}/>
          <div style={{ marginTop:'auto', padding:'14px 12px 0', borderTop:'1px solid rgba(255,255,255,0.07)', fontSize:12, color:'rgba(255,255,255,0.22)', lineHeight:2.1 }}>
            <b style={{ color:'rgba(255,255,255,0.35)', display:'block', marginBottom:2 }}>Keyboard shortcuts</b>
            <span>/ — focus search</span><br/><span>Esc — clear</span>
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex:1, overflowY:'auto', padding:'28px 26px 100px' }}>
          <div style={{ maxWidth:880, margin:'0 auto' }}>
            {section==='named' && <NamedReactionsTab/>}
            {section==='lab'   && <AcidityLabTab/>}
            {section==='ref'   && <QuickReferenceTab/>}
          </div>
        </main>
      </div>
    </div>
  );
}
