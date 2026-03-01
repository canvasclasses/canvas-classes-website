"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star, Check } from 'lucide-react';
import { Chapter, Question } from './types';
import MathRenderer from '@/app/crucible/admin/components/MathRenderer';
import WatermarkOverlay from '@/components/WatermarkOverlay';

async function fetchOptionStats(questionId: string): Promise<Record<string, number>> {
  try {
    const res = await fetch(`/api/v2/questions/${questionId}/stats`);
    if (!res.ok) return {};
    const data = await res.json();
    return data.optionStats || {};
  } catch { return {}; }
}

const DIFF_COLOR = (d: string) => d === 'Easy' ? '#34d399' : d === 'Medium' ? '#fbbf24' : '#f87171';
const PAGE_SIZE = 20;

// Returns true when all options are short enough to display in a 2×2 grid.
// Threshold is 28 chars (accounts for 20px font in half-width column ~220px).
const isShortOptions = (opts: any[]): boolean => {
  if (!opts || opts.length !== 4) return false;
  return opts.every(o => {
    const t = (o.text || '');
    if (t.includes('$') || t.includes('![')) return false; // has LaTeX or image
    const plain = t.replace(/\*\*/g, '').replace(/\*/g, '').trim();
    return plain.length <= 28;
  });
};

export default function BrowseView({ questions, chapters, onBack }: { questions: Question[]; chapters: Chapter[]; onBack: () => void }) {
  const [selIdx, setSelIdx] = useState<number | null>(null);
  const [showSol, setShowSol] = useState(false);
  const [starred, setStarred] = useState<Set<string>>(new Set());
  const [selectedOpt, setSelectedOpt] = useState<string | string[] | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [cardSol, setCardSol] = useState<Record<number, boolean>>({});
  const [cardOpt, setCardOpt] = useState<Record<number, string | string[] | null>>({});
  const [page, setPage] = useState(0);
  const [optionStats, setOptionStats] = useState<Record<string, number>>({});

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
  const goTo = (i: number) => {
    setSelIdx(i);
    setShowSol(false);
    setSelectedOpt(null);
    setOptionStats({});
    const qq = questions[i];
    if (qq) fetchOptionStats(qq.id).then(setOptionStats);
  };

  const changePage = (newPage: number) => {
    setPage(newPage);
    setSelIdx(null);
    setShowSol(false);
    setSelectedOpt(null);
    setCardSol({});
    setCardOpt({});
    setOptionStats({});
  };

  // Scroll the solution div into view after it renders
  const scrollSolutionIntoView = useCallback((solDivId: string) => {
    setTimeout(() => {
      const el = document.getElementById(solDivId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 80);
  }, []);

  const renderDetail = (qq: Question, solShown: boolean, setSolShown: (v: boolean) => void, optChosen: string | string[] | null, setOptChosen: (v: string | string[] | null) => void, solDivId: string, stats: Record<string, number> = {}) => {
    const isMCQ = qq.type === 'MCQ';
    // For MCQ, optChosen is string[]; for SCQ, it's string | null
    const chosenArr: string[] = isMCQ ? (Array.isArray(optChosen) ? optChosen : []) : (typeof optChosen === 'string' ? [optChosen] : []);
    return (
      <div>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 18px', marginBottom: 12 }}>
          <MathRenderer markdown={qq.question_text.markdown} className="text-sm leading-relaxed" fontSize={isMobile ? undefined : 20} imageScale={qq.svg_scales?.question ?? 100} />
        </div>
        {isMCQ && !solShown && <div style={{ fontSize: 11, color: '#fbbf24', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', padding: '6px 12px', borderRadius: 8, marginBottom: 8, fontWeight: 600 }}>MCQ — Select one or more correct options, then click Check Answer</div>}
        {qq.options && qq.options.length > 0 && (() => {
          const useGrid = isShortOptions(qq.options);
          return (
            <div style={{ display: useGrid ? 'grid' : 'flex', gridTemplateColumns: useGrid ? '1fr 1fr' : undefined, flexDirection: useGrid ? undefined : 'column', gap: 7, marginBottom: 12 }}>
              {qq.options.map((opt: any) => {
                const sel = chosenArr.includes(opt.id); const correct = opt.is_correct; const rev = solShown;
                let bc = sel ? '#3b82f6' : 'rgba(255,255,255,0.1)', bg = sel ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.03)';
                if (rev && correct) { bc = '#34d399'; bg = 'rgba(52,211,153,0.1)'; } else if (rev && sel && !correct) { bc = '#f87171'; bg = 'rgba(248,113,113,0.08)'; }
                const pct = stats[opt.id] ?? 0;
                return (
                  <button key={opt.id}
                    onClick={e => {
                      e.stopPropagation();
                      if (solShown) return;
                      if (isMCQ) {
                        // Toggle option in array
                        const newArr = sel ? chosenArr.filter(id => id !== opt.id) : [...chosenArr, opt.id];
                        setOptChosen(newArr);
                      } else {
                        // SCQ: select and reveal
                        setOptChosen(opt.id);
                        setSolShown(true);
                        scrollSolutionIntoView(solDivId);
                      }
                    }}
                    style={{ padding: useGrid ? '12px 12px' : '13px 16px', borderRadius: 10, border: `1.5px solid ${bc}`, background: bg, display: 'flex', flexDirection: 'column', gap: 6, cursor: solShown ? 'default' : 'pointer', textAlign: 'left', color: '#fff', fontSize: 17, width: '100%', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                      <span style={{ width: 22, height: 22, borderRadius: 6, border: `1.5px solid ${bc}`, background: sel ? (rev ? (correct ? '#34d399' : '#f87171') : '#3b82f6') : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: sel ? '#fff' : 'rgba(255,255,255,0.5)', flexShrink: 0 }}>
                        {rev && correct ? <Check style={{ width: 11, height: 11 }} /> : opt.id.toUpperCase()}
                      </span>
                      <span style={{ flex: 1, minWidth: 0, overflowX: 'auto', WebkitOverflowScrolling: 'touch' } as any}>
                        <MathRenderer markdown={opt.text || ''} className="text-sm" fontSize={isMobile ? undefined : 20} imageScale={qq.svg_scales?.[`option_${opt.id}`] ?? 100} />
                      </span>
                      {rev && <span style={{ fontSize: 12, fontWeight: 700, color: correct ? '#34d399' : '#f87171', flexShrink: 0, minWidth: 36, textAlign: 'right' }}>{pct}%</span>}
                    </div>
                    {rev && (
                      <div style={{ width: '100%', height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, borderRadius: 3, background: correct ? '#34d399' : '#f87171', transition: 'width 0.5s ease' }} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })()}
        {isMCQ && !solShown && chosenArr.length > 0 && (
          <button
            onClick={e => { e.stopPropagation(); setSolShown(true); scrollSolutionIntoView(solDivId); }}
            style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: '#3b82f6', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            Check Answer ({chosenArr.length} selected)
          </button>
        )}
        {qq.type === 'NVT' && !solShown && (
          <div style={{ marginBottom: 12 }}>
            <input type="text" placeholder="Enter integer answer" onKeyDown={e => { if (e.key === 'Enter') { setSolShown(true); scrollSolutionIntoView(solDivId); } }} onChange={e => setOptChosen(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            <button
              onClick={e => { e.stopPropagation(); setSolShown(true); scrollSolutionIntoView(solDivId); }}
              style={{ marginTop: 8, padding: '10px 20px', borderRadius: 10, border: 'none', background: '#7c3aed', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Submit</button>
          </div>
        )}
        <button
          onClick={e => { e.stopPropagation(); const next = !solShown; setSolShown(next); if (next) scrollSolutionIntoView(solDivId); }}
          style={{ padding: '9px 16px', borderRadius: 9, border: '1px solid rgba(124,58,237,0.4)', background: solShown ? 'rgba(124,58,237,0.15)' : 'transparent', color: '#a78bfa', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6, touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', userSelect: 'none' } as any}>
          <ChevronRight style={{ width: 13, height: 13, transform: solShown ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
          {solShown ? 'Hide Solution' : 'View Solution'}
        </button>
        {solShown && (
          <div id={solDivId} style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#a78bfa', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Solution</div>
            {qq.solution?.text_markdown ? (
              <MathRenderer markdown={qq.solution.text_markdown} className="text-sm leading-relaxed" fontSize={isMobile ? undefined : 20} imageScale={qq.svg_scales?.solution ?? 100} />
            ) : (
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>Solution not available for this question.</div>
            )}
          </div>
        )}
      </div>
    );
  };

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
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#080a0f', color: '#fff', display: 'flex', flexDirection: 'column', zIndex: 50 }}>
        <WatermarkOverlay />
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
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 5 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: DIFF_COLOR(qq.metadata.difficulty), background: DIFF_COLOR(qq.metadata.difficulty) + '18', padding: '1px 7px', borderRadius: 99 }}>{qq.metadata.difficulty}</span>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.06)', padding: '1px 7px', borderRadius: 99 }}>{qq.type}</span>
                      {qq.metadata.exam_source?.year && (
                        <span style={{ fontSize: 10, color: '#60a5fa', background: 'rgba(96,165,250,0.1)', padding: '1px 7px', borderRadius: 99, border: '1px solid rgba(96,165,250,0.2)' }}>
                          {qq.metadata.exam_source.exam ?? 'JEE Main'} {qq.metadata.exam_source.year}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' } as any}>
                      <MathRenderer markdown={qq.question_text.markdown.slice(0, 100)} className="text-sm" />
                    </div>
                  </div>
                  <ChevronRight style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.3)', flexShrink: 0, transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', marginTop: 6 }} />
                </div>
                {expanded && (
                  <div style={{ padding: '0 14px 4px' }} onClick={e => e.stopPropagation()}>
                    {renderDetail(qq, solShown, (v) => setCardSol(s => ({ ...s, [globalIdx]: v })), optChosen, (v) => setCardOpt(s => ({ ...s, [globalIdx]: v })), `sol-mobile-${globalIdx}`)}
                    <button onClick={(e) => { e.stopPropagation(); setSelIdx(null); }}
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
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#080a0f', color: '#fff', display: 'flex', flexDirection: 'column', zIndex: 50 }}>
      <WatermarkOverlay />
      {sharedHeader}
      <div style={{ flex: 1, display: 'flex', width: '100%', overflow: 'hidden' }}>
        <div style={{ width: '50%', minWidth: 400, maxWidth: 660, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {pageQuestions.map((qq, i) => {
              const globalIdx = page * PAGE_SIZE + i;
              return (
                <div key={qq.id} onClick={() => goTo(globalIdx)} style={{ padding: '17px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', background: globalIdx === dqGlobalIdx ? 'rgba(124,58,237,0.1)' : 'transparent', borderLeft: globalIdx === dqGlobalIdx ? '3px solid #7c3aed' : '3px solid transparent', transition: 'background 0.1s' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span style={{ width: 26, height: 26, borderRadius: 7, background: globalIdx === dqGlobalIdx ? '#7c3aed' : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: globalIdx === dqGlobalIdx ? '#fff' : 'rgba(255,255,255,0.5)', flexShrink: 0 }}>Q{globalIdx + 1}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: DIFF_COLOR(qq.metadata.difficulty), background: DIFF_COLOR(qq.metadata.difficulty) + '18', padding: '1px 7px', borderRadius: 99 }}>{qq.metadata.difficulty}</span>
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.06)', padding: '1px 7px', borderRadius: 99 }}>{qq.type}</span>
                        {qq.metadata.exam_source?.year && (
                          <span style={{ fontSize: 10, color: '#60a5fa', background: 'rgba(96,165,250,0.1)', padding: '1px 7px', borderRadius: 99, border: '1px solid rgba(96,165,250,0.2)' }}>
                            {qq.metadata.exam_source.exam ?? 'JEE Main'} {qq.metadata.exam_source.year}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 13, color: globalIdx === dqGlobalIdx ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)', lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' } as any}>
                        <MathRenderer markdown={qq.question_text.markdown.slice(0, 180)} className="text-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {paginationBar}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 48px 60px' }}>
          {dq && (
            <div style={{ maxWidth: 860, margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{ fontSize: 16, fontWeight: 800 }}>Question {dqGlobalIdx + 1}</span>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{chName(dq.metadata.chapter_id)}</span>
                    {dq.metadata.exam_source?.year && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#60a5fa', background: 'rgba(96,165,250,0.12)', padding: '2px 8px', borderRadius: 99, border: '1px solid rgba(96,165,250,0.25)' }}>
                        {dq.metadata.exam_source.exam ?? 'JEE Main'} {dq.metadata.exam_source.year}{dq.metadata.exam_source.month ? ` · ${dq.metadata.exam_source.month}` : ''}{dq.metadata.exam_source.shift ? ` (${dq.metadata.exam_source.shift[0]})` : ''}
                      </span>
                    )}
                  </div>
                </div>
                <button onClick={() => toggleStar(dq.id)} style={{ width: 34, height: 34, borderRadius: 8, background: starred.has(dq.id) ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.06)', border: `1px solid ${starred.has(dq.id) ? 'rgba(251,191,36,0.4)' : 'rgba(255,255,255,0.1)'}`, color: starred.has(dq.id) ? '#fbbf24' : 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Star style={{ width: 15, height: 15, fill: starred.has(dq.id) ? '#fbbf24' : 'none' }} />
                </button>
              </div>
              {renderDetail(dq, showSol, setShowSol, selectedOpt, setSelectedOpt, 'sol-desktop', optionStats)}
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
