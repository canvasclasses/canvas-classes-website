"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Check, Timer, X } from 'lucide-react';
import { Question } from './types';
import MathRenderer from '@/app/crucible/admin/components/MathRenderer';

const DIFF_COLOR = (d: string) => d === 'Easy' ? '#34d399' : d === 'Medium' ? '#fbbf24' : '#f87171';

// Returns true when all 4 options are short enough for a 2×2 grid.
// Threshold is 28 chars (accounts for 20px font in half-width column ~220px).
const isShortOptions = (opts: any[]): boolean => {
  if (!opts || opts.length !== 4) return false;
  return opts.every(o => {
    const t = (o.text || '');
    if (t.includes('$') || t.includes('![')) return false;
    const plain = t.replace(/\*\*/g, '').replace(/\*/g, '').trim();
    return plain.length <= 28;
  });
};

export default function TestView({ questions, onBack }: { questions: Question[]; onBack: () => void }) {
  const [idx,         setIdx]         = useState(0);
  const [answers,     setAnswers]     = useState<Record<string, string>>({});
  const [marked,      setMarked]      = useState<Record<string, boolean>>({});
  const [nvtInputs,   setNvtInputs]   = useState<Record<string, string>>({});
  const [submitted,   setSubmitted]   = useState(false);
  const [seconds,     setSeconds]     = useState(Math.ceil(questions.length * 90));
  const [starred,     setStarred]     = useState<Set<string>>(new Set());
  const [reviewing,   setReviewing]   = useState(false);
  const [revIdx,      setRevIdx]      = useState(0);
  const [isMobile,    setIsMobile]    = useState(false);
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
          <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '12px 10px 60px' : '16px 20px 60px' }}>
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
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '12px 14px', marginBottom: 24 }}>
                <MathRenderer markdown={rq.question_text.markdown} className="text-base leading-relaxed" />
              </div>
              {rq.options && rq.options.length > 0 && (() => {
                const useGrid = isShortOptions(rq.options);
                return (
                  <div style={{ display: useGrid ? 'grid' : 'flex', gridTemplateColumns: useGrid ? '1fr 1fr' : undefined, flexDirection: useGrid ? undefined : 'column', gap: 8, marginBottom: 24 }}>
                    {rq.options.map((opt: any) => {
                      const sel = answers[rq.id] === opt.id;
                      const correct = opt.is_correct;
                      let borderC = 'rgba(255,255,255,0.1)', bgC = 'rgba(255,255,255,0.03)';
                      if (correct) { borderC = '#34d399'; bgC = 'rgba(52,211,153,0.1)'; }
                      else if (sel && !correct) { borderC = '#f87171'; bgC = 'rgba(248,113,113,0.08)'; }
                      return (
                        <div key={opt.id} style={{ padding: useGrid ? '10px 10px' : '12px 14px', borderRadius: 12, border: `1.5px solid ${borderC}`, background: bgC, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ width: 24, height: 24, borderRadius: 7, border: `1.5px solid ${borderC}`, background: correct ? '#34d399' : (sel ? '#f87171' : 'transparent'), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: (correct || sel) ? '#fff' : 'rgba(255,255,255,0.5)', flexShrink: 0 }}>
                            {correct ? <Check style={{ width: 12, height: 12 }} /> : opt.id.toUpperCase()}
                          </span>
                          <span style={{ flex: 1, color: '#fff', fontSize: 13 }}><MathRenderer markdown={opt.text || ''} className="text-sm" /></span>
                          {sel && !correct && !useGrid && <span style={{ fontSize: 10, color: '#f87171', flexShrink: 0 }}>Your answer</span>}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
              {rq.type === 'NVT' && (
                <div style={{ marginBottom: 24, padding: '14px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Your answer: <strong style={{ color: nvtInputs[rq.id] ? '#fff' : '#fbbf24' }}>{nvtInputs[rq.id] || 'Not attempted'}</strong></div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Correct answer: <strong style={{ color: '#34d399' }}>{rq.answer?.integer_value ?? '—'}</strong></div>
                </div>
              )}
              {rq.solution.text_markdown && (
                <div style={{ padding: '12px 14px', borderRadius: 14, background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.2)', marginBottom: 24 }}>
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
          {([['Correct', score, '#34d399'], ['Wrong', wrong, '#f87171'], ['Skipped', skipped, '#fbbf24']] as [string, number, string][]).map(([l, v, c]) => (
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

  const palettePanel = (
    <div style={{ padding: '16px 14px' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 10 }}>Overview</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {([
          [String(answeredCount), 'Answered', '#34d399'],
          [String(notVisitedCount), 'Not Visited', 'rgba(255,255,255,0.5)'],
          [String(markedCount), 'Marked', '#7c3aed'],
          ['0', 'Skipped', '#fbbf24'],
        ] as [string, string, string][]).map(([v, l, c]) => (
          <div key={l} style={{ textAlign: 'center', padding: '12px 6px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: c, fontFamily: 'monospace' }}>{v}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 3, textTransform: 'uppercase' }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>Question Palette</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 6 }}>
        {questions.map((_, i) => {
          const s = palStatus(i);
          return <button key={i} onClick={() => { setIdx(i); setShowPalette(false); }} style={{ width: '100%', aspectRatio: '1', borderRadius: 8, border: `1.5px solid ${s.border}`, background: s.bg, color: s.color, fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.1s' }}>{i + 1}</button>;
        })}
      </div>
      <button onClick={() => { if (confirm('Submit test? You cannot change answers after submission.')) setSubmitted(true); }}
        style={{ width: '100%', marginTop: 18, padding: '13px', borderRadius: 12, border: 'none', background: '#dc2626', color: '#fff', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>
        SUBMIT TEST
      </button>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: 6 }}>Once submitted, you cannot edit responses.</div>
    </div>
  );

  const questionBody = (
    <div style={{ maxWidth: isMobile ? 700 : 860, margin: '0 auto', padding: isMobile ? '12px 10px 120px' : '28px 32px 100px' }}>
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
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: isMobile ? '12px 12px' : '18px 22px', marginBottom: 16 }}>
        <MathRenderer markdown={q.question_text.markdown} className="leading-relaxed" fontSize={isMobile ? undefined : 20} />
      </div>
      {q.options && q.options.length > 0 && (() => {
        const useGrid = isShortOptions(q.options);
        return (
          <div style={{ display: useGrid ? 'grid' : 'flex', gridTemplateColumns: useGrid ? '1fr 1fr' : undefined, flexDirection: useGrid ? undefined : 'column', gap: 8, marginBottom: 16 }}>
            {q.options.map((opt: any) => {
              const sel = answers[q.id] === opt.id;
              return (
                <button key={opt.id} onClick={() => setAnswers(a => ({ ...a, [q.id]: opt.id }))}
                  style={{ padding: useGrid ? '12px 12px' : (isMobile ? '10px 11px' : '13px 16px'), borderRadius: 12, border: `1.5px solid ${sel ? '#3b82f6' : 'rgba(255,255,255,0.1)'}`, background: sel ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.03)', color: '#fff', fontSize: isMobile ? 13 : 17, textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                  <span style={{ width: 24, height: 24, borderRadius: 7, border: `1.5px solid ${sel ? '#3b82f6' : 'rgba(255,255,255,0.2)'}`, background: sel ? '#3b82f6' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{opt.id.toUpperCase()}</span>
                  <span style={{ flex: 1 }}><MathRenderer markdown={opt.text || ''} fontSize={isMobile ? undefined : 20} /></span>
                </button>
              );
            })}
          </div>
        );
      })()}
      {q.type === 'NVT' && (
        <input type="text" value={nvtInputs[q.id] || ''} onChange={e => setNvtInputs(n => ({ ...n, [q.id]: e.target.value }))}
          placeholder="Enter integer answer"
          style={{ width: '100%', padding: '13px 16px', borderRadius: 12, border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 15, outline: 'none', marginBottom: 16, boxSizing: 'border-box' }}
        />
      )}
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button onClick={() => { const n = { ...answers }; delete n[q.id]; setAnswers(n); const m = { ...nvtInputs }; delete m[q.id]; setNvtInputs(m); }}
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
      <header style={{ height: 48, borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(10,12,20,0.98)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', flexShrink: 0, gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <X style={{ width: 16, height: 16 }} />
          </button>
          {!isMobile && <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>Section 1: Chemistry</span>}
          {!isMobile && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)', fontWeight: 700, whiteSpace: 'nowrap' }}>SINGLE CORRECT</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: seconds < 300 ? '#f87171' : 'rgba(255,255,255,0.85)', fontSize: 15, fontWeight: 700, fontFamily: 'monospace', flexShrink: 0 }}>
          <Timer style={{ width: 13, height: 13 }} /> {fmt(seconds)}
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          {isMobile && (
            <button onClick={() => setShowPalette(v => !v)}
              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: showPalette ? 'rgba(255,255,255,0.1)' : 'transparent', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
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
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {questionBody}
        </div>
        {!isMobile && (
          <div style={{ width: 390, borderLeft: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', overflowY: 'auto', flexShrink: 0 }}>
            {palettePanel}
          </div>
        )}
        {isMobile && showPalette && (
          <>
            <div onClick={() => setShowPalette(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 50, background: '#12141f', borderTop: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px 16px 0 0', maxHeight: '75vh', overflowY: 'auto' }}>
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
