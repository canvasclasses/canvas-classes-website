"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Check } from 'lucide-react';
import { Chapter, Question } from './types';
import MathRenderer from '@/app/crucible/admin/components/MathRenderer';

const DIFF_COLOR = (d: string) => d === 'Easy' ? '#34d399' : d === 'Medium' ? '#fbbf24' : '#f87171';
const PAGE_SIZE = 20;

export default function BrowseView({ questions, chapters, onBack }: { questions: Question[]; chapters: Chapter[]; onBack: () => void }) {
  const [selIdx, setSelIdx] = useState<number | null>(null);
  const [showSol, setShowSol] = useState(false);
  const [starred, setStarred] = useState<Set<string>>(new Set());
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [cardSol, setCardSol] = useState<Record<number, boolean>>({});
  const [cardOpt, setCardOpt] = useState<Record<number, string | null>>({});
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(questions.length / PAGE_SIZE);
  const pageQuestions = questions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const desktopIdx = selIdx ?? 0;
  const chName = (id: string) => chapters.find(c => c.id === id)?.name || id;
  const toggleStar = (id: string) => setStarred(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const goTo = (i: number) => { setSelIdx(i); setShowSol(false); setSelectedOpt(null); };

  const changePage = (newPage: number) => {
    setPage(newPage);
    setSelIdx(null);
    setShowSol(false);
    setSelectedOpt(null);
    setCardSol({});
    setCardOpt({});
  };

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
              <button key={opt.id}
                onClick={() => { if (!solShown) { setOptChosen(opt.id); setSolShown(true); } }}
                onPointerUp={e => { e.currentTarget.releasePointerCapture(e.pointerId); if (!solShown) { setOptChosen(opt.id); setSolShown(true); } }}
                style={{ padding: '11px 13px', borderRadius: 10, border: `1.5px solid ${bc}`, background: bg, display: 'flex', alignItems: 'center', gap: 10, cursor: solShown ? 'default' : 'pointer', textAlign: 'left', color: '#fff', fontSize: 13, width: '100%', minWidth: 0 }}>
                <span style={{ width: 24, height: 24, borderRadius: 6, border: `1.5px solid ${bc}`, background: sel ? (rev ? (correct ? '#34d399' : '#f87171') : '#3b82f6') : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: sel ? '#fff' : 'rgba(255,255,255,0.5)', flexShrink: 0 }}>
                  {rev && correct ? <Check style={{ width: 12, height: 12 }} /> : opt.id.toUpperCase()}
                </span>
                {/* overflowX:auto lets long equations scroll horizontally on narrow screens */}
                <span style={{ flex: 1, minWidth: 0, overflowX: 'auto', WebkitOverflowScrolling: 'touch' } as any}>
                  <MathRenderer markdown={opt.text || ''} className="text-sm" imageScale={qq.svg_scales?.[`option_${opt.id}`] ?? 100} />
                </span>
              </button>
            );
          })}
        </div>
      )}
      {qq.type === 'NVT' && !solShown && (
        <div style={{ marginBottom: 12 }}>
          <input type="text" placeholder="Enter integer answer" onKeyDown={e => { if (e.key === 'Enter') setSolShown(true); }} onChange={e => setOptChosen(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
          <button
            onClick={() => setSolShown(true)}
            onPointerUp={e => { e.currentTarget.releasePointerCapture(e.pointerId); setSolShown(true); }}
            style={{ marginTop: 8, padding: '10px 20px', borderRadius: 10, border: 'none', background: '#7c3aed', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Submit</button>
        </div>
      )}
      {/* View Solution — uses onPointerUp for reliable firing on real iOS/Android Safari
          where onClick inside a scrollable container can be swallowed by the scroll gesture */}
      <button
        onClick={e => { e.stopPropagation(); setSolShown(!solShown); }}
        onPointerUp={e => { e.stopPropagation(); e.currentTarget.releasePointerCapture(e.pointerId); setSolShown(!solShown); }}
        style={{ padding: '9px 16px', borderRadius: 9, border: '1px solid rgba(124,58,237,0.4)', background: solShown ? 'rgba(124,58,237,0.15)' : 'transparent', color: '#a78bfa', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6, touchAction: 'manipulation' }}>
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

  // Shared pagination bar — compact, never overflows on mobile
  const paginationBar = totalPages > 1 && (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.07)', flexShrink: 0, background: 'rgba(8,10,15,0.97)' }}>
      <button onClick={() => changePage(page - 1)} disabled={page === 0}
        style={{ padding: '8px 16px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: page === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600, cursor: page === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
        <ChevronLeft style={{ width: 14, height: 14 }} /> Prev
      </button>
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontFamily: 'monospace', flexShrink: 0 }}>
        {page + 1} / {totalPages}
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginLeft: 6 }}>({questions.length} Qs)</span>
      </span>
      <button onClick={() => changePage(page + 1)} disabled={page === totalPages - 1}
        style={{ padding: '8px 16px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.1)', background: page === totalPages - 1 ? 'rgba(255,255,255,0.03)' : 'rgba(124,58,237,0.15)', color: page === totalPages - 1 ? 'rgba(255,255,255,0.2)' : '#a78bfa', fontSize: 13, fontWeight: 600, cursor: page === totalPages - 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
        Next <ChevronRight style={{ width: 14, height: 14 }} />
      </button>
    </div>
  );

  if (isMobile) {
    return (
      <div style={{ height: '100vh', overflow: 'hidden', background: '#080a0f', color: '#fff', display: 'flex', flexDirection: 'column' }}>
        {sharedHeader}
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' } as any}>
          {pageQuestions.map((qq, i) => {
            const globalIdx = page * PAGE_SIZE + i;
            const expanded = selIdx === globalIdx;
            const solShown = cardSol[globalIdx] ?? false;
            const optChosen = cardOpt[globalIdx] ?? null;
            return (
              <div key={qq.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: expanded ? 'rgba(124,58,237,0.05)' : 'transparent', borderLeft: `3px solid ${expanded ? '#7c3aed' : 'transparent'}` }}>
                <div onClick={() => expanded ? setSelIdx(null) : goTo(globalIdx)}
                  style={{ padding: '13px 14px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ width: 28, height: 28, borderRadius: 8, background: expanded ? '#7c3aed' : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: expanded ? '#fff' : 'rgba(255,255,255,0.5)', flexShrink: 0 }}>Q{globalIdx + 1}</span>
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
                {expanded && (
                  <div style={{ padding: '0 14px 4px' }}>
                    {renderDetail(qq, solShown, (v) => setCardSol(s => ({ ...s, [globalIdx]: v })), optChosen, (v) => setCardOpt(s => ({ ...s, [globalIdx]: v })))}
                    <button onClick={() => setSelIdx(null)}
                      style={{ width: '100%', marginTop: 8, marginBottom: 12, padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: 'rgba(255,255,255,0.4)', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <ChevronRight style={{ width: 13, height: 13, transform: 'rotate(-90deg)' }} /> Collapse
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          <div style={{ height: 8 }} />
        </div>
        {paginationBar}
      </div>
    );
  }

  const dq = pageQuestions[desktopIdx - page * PAGE_SIZE] ?? pageQuestions[0];
  const dqGlobalIdx = desktopIdx;
  return (
    <div style={{ height: '100vh', overflow: 'hidden', background: '#080a0f', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      {sharedHeader}
      <div style={{ flex: 1, display: 'flex', width: '100%', overflow: 'hidden' }}>
        <div style={{ width: '38%', minWidth: 300, maxWidth: 480, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflowY: 'auto' }}>
          {pageQuestions.map((qq, i) => {
            const globalIdx = page * PAGE_SIZE + i;
            return (
            <div key={qq.id} onClick={() => goTo(globalIdx)} style={{ padding: '13px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', background: globalIdx === dqGlobalIdx ? 'rgba(124,58,237,0.1)' : 'transparent', borderLeft: globalIdx === dqGlobalIdx ? '3px solid #7c3aed' : '3px solid transparent', transition: 'background 0.1s' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ width: 26, height: 26, borderRadius: 7, background: globalIdx === dqGlobalIdx ? '#7c3aed' : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: globalIdx === dqGlobalIdx ? '#fff' : 'rgba(255,255,255,0.5)', flexShrink: 0 }}>Q{globalIdx + 1}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 5, marginBottom: 5 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: DIFF_COLOR(qq.metadata.difficulty), background: DIFF_COLOR(qq.metadata.difficulty) + '18', padding: '1px 7px', borderRadius: 99 }}>{qq.metadata.difficulty}</span>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.06)', padding: '1px 7px', borderRadius: 99 }}>{qq.type}</span>
                  </div>
                  <div style={{ fontSize: 12, color: globalIdx === dqGlobalIdx ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' } as any}>
                    <MathRenderer markdown={qq.question_text.markdown.slice(0, 120)} className="text-sm" />
                  </div>
                </div>
              </div>
            </div>
            );
          })}
          </div>
          {paginationBar}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px 60px' }}>
          {dq && (
            <div style={{ maxWidth: 680, margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <span style={{ fontSize: 16, fontWeight: 800 }}>Question {dqGlobalIdx + 1}</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginLeft: 10 }}>{chName(dq.metadata.chapter_id)}</span>
                </div>
                <button onClick={() => toggleStar(dq.id)} style={{ width: 34, height: 34, borderRadius: 8, background: starred.has(dq.id) ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.06)', border: `1px solid ${starred.has(dq.id) ? 'rgba(251,191,36,0.4)' : 'rgba(255,255,255,0.1)'}`, color: starred.has(dq.id) ? '#fbbf24' : 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Star style={{ width: 15, height: 15, fill: starred.has(dq.id) ? '#fbbf24' : 'none' }} />
                </button>
              </div>
              {renderDetail(dq, showSol, setShowSol, selectedOpt, setSelectedOpt)}
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                {dqGlobalIdx > 0 && (
                  <button onClick={() => {
                    const prev = dqGlobalIdx - 1;
                    const prevPage = Math.floor(prev / PAGE_SIZE);
                    if (prevPage !== page) changePage(prevPage);
                    goTo(prev);
                  }} style={{ padding: '10px 18px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ChevronLeft style={{ width: 14, height: 14 }} /> Prev
                  </button>
                )}
                {dqGlobalIdx < questions.length - 1 && (
                  <button onClick={() => {
                    const next = dqGlobalIdx + 1;
                    const nextPage = Math.floor(next / PAGE_SIZE);
                    if (nextPage !== page) changePage(nextPage);
                    goTo(next);
                  }} style={{ flex: 1, padding: '10px 18px', borderRadius: 10, border: 'none', background: '#3b82f6', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    Next <ChevronRight style={{ width: 14, height: 14 }} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
