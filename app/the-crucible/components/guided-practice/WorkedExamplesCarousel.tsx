"use client";

// WORKED EXAMPLES CAROUSEL — Phase 1 of the 4-phase guided practice flow.
// Shows WKEX documents one at a time before the student starts practice.
// Tracks: which examples were viewed, time spent per card, early exits.
// On completion: fires POST /api/v2/user/example-views (fire-and-forget)
// and calls onComplete(viewedMicroConcepts) to pass context to AdaptiveSession.

import { useState, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, ArrowRight, Lightbulb } from 'lucide-react';
import { Question } from '@/app/the-crucible/components/types';
import MathRenderer from '@/app/crucible/admin/components/MathRenderer';

interface WorkedExamplesCarouselProps {
  examples: Question[];                                        // pre-filtered WKEX docs
  chapterName: string;
  onComplete: (viewedMicroConcepts: Set<string>) => void;     // called on "I'm ready" or after last card
}

export default function WorkedExamplesCarousel({ examples, chapterName, onComplete }: WorkedExamplesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewedIndices, setViewedIndices] = useState<Set<number>>(new Set([0]));
  const [timePerCard, setTimePerCard] = useState<Record<number, number>>({});
  const cardStartTimeRef = useRef<number>(Date.now());
  const sessionIdRef = useRef<string>(`wkex-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

  const current = examples[currentIndex];
  const total = examples.length;

  // ── Time tracking ────────────────────────────────────────────────────────────

  const recordTimeForCurrent = useCallback(() => {
    const elapsed = Date.now() - cardStartTimeRef.current;
    setTimePerCard(prev => ({ ...prev, [currentIndex]: (prev[currentIndex] ?? 0) + elapsed }));
    cardStartTimeRef.current = Date.now();
  }, [currentIndex]);

  // ── Navigation ───────────────────────────────────────────────────────────────

  const goTo = useCallback((index: number) => {
    recordTimeForCurrent();
    setCurrentIndex(index);
    setViewedIndices(prev => new Set([...prev, index]));
    cardStartTimeRef.current = Date.now();
    // Scroll content area to top when switching cards
    document.getElementById('wkex-content')?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [recordTimeForCurrent]);

  // ── Completion ───────────────────────────────────────────────────────────────

  const handleComplete = useCallback(() => {
    recordTimeForCurrent();

    const finalTimePerCard: Record<number, number> = {};
    viewedIndices.forEach(i => {
      finalTimePerCard[i] = (timePerCard[i] ?? 0);
    });
    // Add time accumulated just now for current card
    finalTimePerCard[currentIndex] = (finalTimePerCard[currentIndex] ?? 0);

    const viewedMicroConcepts = new Set<string>();
    const payload = Array.from(viewedIndices).map(idx => {
      const mc = examples[idx]?.metadata.microConcept;
      if (mc) viewedMicroConcepts.add(mc);
      return { displayId: examples[idx]?.display_id, microConcept: mc ?? null, timeSpentMs: finalTimePerCard[idx] ?? 0 };
    });

    // Fire-and-forget — logging only, never blocks the student
    fetch('/api/v2/user/example-views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chapterId:     examples[0]?.metadata.chapter_id,
        sessionId:     sessionIdRef.current,
        viewedExamples: payload,
        completedAll:  viewedIndices.size === total,
      }),
    }).catch(() => { /* silently ignored */ });

    onComplete(viewedMicroConcepts);
  }, [recordTimeForCurrent, timePerCard, viewedIndices, currentIndex, examples, total, onComplete]);

  if (!current) return null;

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#07080f', color: '#fafafa', display: 'flex', flexDirection: 'column', zIndex: 50 }}>
      <style>{`
        @keyframes fadeUp { from { transform: translateY(10px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        #wkex-content { animation: fadeUp 0.25s ease-out; }
        #wkex-content h2 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.6rem; color: #fafafa; }
        #wkex-content h3 { font-size: 1rem; font-weight: 600; margin: 1.2rem 0 0.4rem; color: #e2e8f0; }
        #wkex-content p  { font-size: 0.875rem; line-height: 1.7; color: rgba(255,255,255,0.75); margin: 0 0 0.75rem; }
        #wkex-content strong { color: #e2e8f0; font-weight: 600; }
        #wkex-content blockquote { border-left: 3px solid #2dd4bf; padding: 10px 14px; margin: 16px 0; background: rgba(45,212,191,0.05); border-radius: 0 8px 8px 0; }
        #wkex-content blockquote p { color: rgba(255,255,255,0.7); margin: 0; font-size: 0.83rem; line-height: 1.6; }
        #wkex-content table { width: 100%; border-collapse: collapse; margin: 12px 0 16px; font-size: 0.82rem; }
        #wkex-content th { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.6); font-weight: 600; padding: 7px 10px; border-bottom: 1px solid rgba(255,255,255,0.1); text-align: left; }
        #wkex-content td { padding: 7px 10px; border-bottom: 1px solid rgba(255,255,255,0.05); color: rgba(255,255,255,0.75); vertical-align: top; }
        #wkex-content tr:last-child td { border-bottom: none; }
        #wkex-content .katex-display { overflow-x: auto; margin: 12px 0; }
        #wkex-content .katex { font-size: 1em; }
        #wkex-content hr { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 20px 0; }
      `}</style>

      {/* ── Sticky header ────────────────────────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(7,8,15,0.97)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 20, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(20,184,166,0.12)', border: '1px solid rgba(20,184,166,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <BookOpen style={{ width: 14, height: 14, color: '#2dd4bf' }} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fafafa' }}>{chapterName}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
              Worked Examples &nbsp;·&nbsp; {currentIndex + 1} of {total}
            </div>
          </div>
        </div>

        {/* Always-visible "I'm ready" CTA */}
        <button
          onClick={handleComplete}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.28)', color: '#34d399', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.2)'; e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.1)'; e.currentTarget.style.borderColor = 'rgba(16,185,129,0.28)'; }}
        >
          I&apos;m ready to practice <ArrowRight style={{ width: 12, height: 12 }} />
        </button>
      </div>

      {/* ── Progress bar ─────────────────────────────────────────────────────── */}
      <div style={{ height: 2, background: 'rgba(255,255,255,0.05)', flexShrink: 0 }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg, #2dd4bf, #10b981)', transition: 'width 0.35s ease', width: `${((currentIndex + 1) / total) * 100}%` }} />
      </div>

      {/* ── Scrollable content ───────────────────────────────────────────────── */}
      <div id="wkex-content" key={currentIndex} style={{ flex: 1, overflowY: 'auto', padding: '28px 20px 110px' }}>
        <div style={{ maxWidth: 740, margin: '0 auto' }}>

          {/* Micro-concept badge */}
          {current.metadata.microConcept && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.22)', marginBottom: 18 }}>
              <Lightbulb style={{ width: 10, height: 10, color: '#2dd4bf' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#5eead4', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {current.metadata.microConcept}
              </span>
            </div>
          )}

          {/* Question text — title + scenario */}
          <div style={{ marginBottom: 28 }}>
            <MathRenderer markdown={current.question_text.markdown} fontSize={15} />
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '0 0 24px' }} />

          {/* Solution — full stepped walkthrough */}
          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', padding: '22px 26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 10, color: '#2dd4bf', fontWeight: 800 }}>S</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Step-by-step walkthrough
              </span>
            </div>
            <MathRenderer markdown={current.solution.text_markdown} fontSize={14} />
          </div>

          {/* Viewed progress below content */}
          {viewedIndices.size > 0 && (
            <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
                {viewedIndices.size} of {total} viewed
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Fixed bottom navigation ───────────────────────────────────────────── */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, borderTop: '1px solid rgba(255,255,255,0.06)', padding: '12px 20px', background: 'rgba(7,8,15,0.97)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 20 }}>

        {/* Previous */}
        <button
          onClick={() => !isFirst && goTo(currentIndex - 1)}
          disabled={isFirst}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.09)', background: isFirst ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)', color: isFirst ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 600, cursor: isFirst ? 'not-allowed' : 'pointer', transition: 'all 0.15s' }}
          onMouseEnter={e => { if (!isFirst) e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
          onMouseLeave={e => { if (!isFirst) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
        >
          <ChevronLeft style={{ width: 14, height: 14 }} /> Previous
        </button>

        {/* Dot indicators */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {examples.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === currentIndex ? 22 : 8,
                height: 8,
                borderRadius: 4,
                background: i === currentIndex
                  ? '#2dd4bf'
                  : viewedIndices.has(i)
                    ? 'rgba(45,212,191,0.35)'
                    : 'rgba(255,255,255,0.13)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.22s ease',
                padding: 0,
              }}
              aria-label={`Go to example ${i + 1}`}
            />
          ))}
        </div>

        {/* Next / Start Practice */}
        {!isLast ? (
          <button
            onClick={() => goTo(currentIndex + 1)}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 10, border: '1px solid rgba(20,184,166,0.3)', background: 'rgba(20,184,166,0.09)', color: '#2dd4bf', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(20,184,166,0.17)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(20,184,166,0.09)'; }}
          >
            Next <ChevronRight style={{ width: 14, height: 14 }} />
          </button>
        ) : (
          <button
            onClick={handleComplete}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 16px', borderRadius: 10, border: '1px solid rgba(16,185,129,0.4)', background: 'rgba(16,185,129,0.12)', color: '#34d399', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.22)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.12)'; }}
          >
            Start Practice <ArrowRight style={{ width: 13, height: 13 }} />
          </button>
        )}
      </div>
    </div>
  );
}
