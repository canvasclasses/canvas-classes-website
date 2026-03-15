"use client";

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Check, Timer, X, MonitorPlay, Volume2, ChevronUp, ChevronDown } from 'lucide-react';
import { Question } from './types';
import MathRenderer from '@/app/crucible/admin/components/MathRenderer';
import WatermarkOverlay from '@/components/WatermarkOverlay';
import { createClient as createSupabaseClient } from '@/app/utils/supabase/client';
import TestSaveModal from './TestSaveModal';

async function fetchOptionStats(questionId: string): Promise<Record<string, number>> {
  try {
    const res = await fetch(`/api/v2/questions/${questionId}/stats`);
    if (!res.ok) return {};
    const data = await res.json();
    return data.optionStats || {};
  } catch { return {}; }
}

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
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [marked, setMarked] = useState<Record<string, boolean>>({});
  const [nvtInputs, setNvtInputs] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [seconds, setSeconds] = useState(Math.ceil(questions.length * 90));
  const [starred, setStarred] = useState<Set<string>>(new Set());
  const [reviewing, setReviewing] = useState(false);
  const [revIdx, setRevIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [revStats, setRevStats] = useState<Record<string, number>>({});
  // Finish-test confirmation modal (shown when user hits 'Finish Test' on last question)
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [testStartTime] = useState(Date.now());
  const [questionStartTimes, setQuestionStartTimes] = useState<Record<string, number>>({});
  const [questionTimings, setQuestionTimings] = useState<Record<string, number>>({});
  const [isPaused, setIsPaused] = useState(false);
  const [showWarning, setShowWarning] = useState<'5min' | '1min' | null>(null);
  // Refs to track values inside intervals without causing re-renders
  const isPausedRef = useRef(false);
  const submittedRef = useRef(false);
  const questionStartTimesRef = useRef<Record<string, number>>({});
  // Video and audio expansion state for review section
  const [videoExpanded, setVideoExpanded] = useState<Record<number, boolean>>({});
  const [audioExpanded, setAudioExpanded] = useState<Record<string, boolean>>({});

  const toggleStar = (id: string) => setStarred(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Sync refs so interval callbacks always see latest values without being in deps
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  useEffect(() => { submittedRef.current = submitted; }, [submitted]);

  // Initialize timer when questions first arrive (handles async question loading)
  useEffect(() => {
    if (questions.length > 0) {
      setSeconds(prev => prev === 0 ? Math.ceil(questions.length * 90) : prev);
    }
  }, [questions.length]);

  // Timer — runs once, reads latest state via refs, never restarts on tick
  useEffect(() => {
    if (questions.length === 0) return;

    const t = setInterval(() => {
      if (submittedRef.current || isPausedRef.current) return;
      setSeconds(s => {
        if (s <= 1) {
          clearInterval(t);
          setSubmitted(true);
          submittedRef.current = true;
          setShowSaveModal(true);
          return 0;
        }
        // Trigger warnings at exact thresholds
        if (s === 301) setShowWarning('5min');
        if (s === 61) setShowWarning('1min');
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions.length]); // Only restart if question set changes, never on tick

  // Track time spent per question — uses ref to avoid re-running on every startTime update
  useEffect(() => {
    if (submitted || reviewing) return;
    const currentQ = questions[idx];
    if (!currentQ) return;

    // Record start time via ref (no state update = no re-render = no loop)
    if (!questionStartTimesRef.current[currentQ.id]) {
      questionStartTimesRef.current[currentQ.id] = Date.now();
      setQuestionStartTimes(prev => ({ ...prev, [currentQ.id]: Date.now() }));
    }

    return () => {
      // On cleanup (question change), accumulate time spent
      const startTime = questionStartTimesRef.current[currentQ.id];
      if (startTime) {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        setQuestionTimings(prev => ({
          ...prev,
          [currentQ.id]: (prev[currentQ.id] || 0) + timeSpent,
        }));
        // Reset so next visit starts fresh tracking
        delete questionStartTimesRef.current[currentQ.id];
      }
    };
  }, [idx, submitted, reviewing, questions]); // questionStartTimes intentionally excluded

  useEffect(() => {
    if (!reviewing) return;
    const rq = questions[revIdx];
    if (!rq) return;
    setRevStats({});
    fetchOptionStats(rq.id).then(setRevStats);
  }, [reviewing, revIdx, questions]);

  // Save progress to database (called when user clicks "Save Progress")
  const saveProgressToDatabase = async () => {
    try {
      const supabase = createSupabaseClient();
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;
      
      const chapterId = questions[0]?.metadata?.chapter_id;
      if (!chapterId) return;
      
      // Prepare batch attempts data
      const attempts = questions
        .filter(qq => !!(answers[qq.id] || (nvtInputs[qq.id] && nvtInputs[qq.id].trim())))
        .map(qq => {
          const isCorrect = isQuestionCorrect(qq);
          const selectedOption = qq.type === 'NVT'
            ? nvtInputs[qq.id] ?? null
            : (answers[qq.id] ?? null);
          
          return {
            question_id: qq.id,
            display_id: qq.display_id,
            chapter_id: qq.metadata.chapter_id,
            difficulty: qq.metadata.difficulty,
            concept_tags: qq.metadata.tags?.map((t: any) => t.tag_id) ?? [],
            is_correct: isCorrect,
            selected_option: selectedOption,
            source: 'test',
            time_spent_seconds: questionTimings[qq.id] || 0
          };
        });
      
      // Batch save all attempts (single API call)
      if (attempts.length > 0) {
        await fetch('/api/v2/user/progress/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
          body: JSON.stringify({ attempts }),
        });
      }
      
      // Save complete test result for dashboard
      const score = questions.filter(qq => isQuestionCorrect(qq)).length;
      const timeSpentMs = Date.now() - testStartTime;
      const totalSeconds = Math.floor(timeSpentMs / 1000);
      
      const testResultData = {
        chapter_id: chapterId,
        test_config: {
          count: questions.length,
          difficulty_mix: 'balanced', // TODO: Get from actual config
          question_sort: 'random', // TODO: Get from actual config
        },
        questions: questions.map(qq => {
          const hasAnswer = !!(answers[qq.id] || (nvtInputs[qq.id] && nvtInputs[qq.id].trim()));
          return {
            question_id: qq.id,
            display_id: qq.display_id,
            difficulty: qq.metadata.difficulty,
            is_correct: hasAnswer ? isQuestionCorrect(qq) : false,
            selected_option: qq.type === 'NVT' ? nvtInputs[qq.id] : answers[qq.id],
            time_spent_seconds: questionTimings[qq.id] || 0,
            marked_for_review: marked[qq.id] || false,
          };
        }),
        score: {
          correct: score,
          total: questions.length,
          percentage: Math.round((score / questions.length) * 100),
        },
        timing: {
          started_at: new Date(testStartTime),
          completed_at: new Date(),
          total_seconds: totalSeconds,
        },
        saved_to_progress: true,
      };
      
      await fetch('/api/v2/test-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify(testResultData),
      });
      
      // Record test session completion
      await fetch('/api/v2/user/test-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({
          chapter_id: chapterId,
          question_ids: questions.map(q => q.id),
          config: { count: questions.length, mix: 'balanced' },
        }),
      });
    } catch (err) {
      console.error('Failed to save progress:', err);
    }
  };
  
  const handleSaveProgress = async () => {
    await saveProgressToDatabase();
    setShowSaveModal(false);
    setReviewing(true);
  };
  
  const handleDiscardProgress = () => {
    setShowSaveModal(false);
    setReviewing(true);
  };

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const q = questions[idx];

  if (!questions || questions.length === 0 || !q) {
    return (
      <div style={{ minHeight: '100vh', background: '#080a0f', color: '#fff', display: 'flex', flexDirection: 'column' }}>
        <WatermarkOverlay />
        <header style={{ height: 48, borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(10,12,20,0.98)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', flexShrink: 0, gap: 8 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <X style={{ width: 16, height: 16 }} />
          </button>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Loading test…</span>
          <span />
        </header>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>Preparing your questions…</div>
          </div>
        </div>
      </div>
    );
  }

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

  // Helper: check if a question is answered correctly
  const isQuestionCorrect = (qq: Question): boolean => {
    if (qq.type === 'NVT') {
      const userInput = nvtInputs[qq.id]?.trim();
      // Require a non-empty answer; undefined===undefined must NOT count as correct
      if (!userInput) return false;
      return userInput === qq.answer?.integer_value?.toString();
    }
    if (qq.type === 'MCQ') {
      const userSel = Array.isArray(answers[qq.id]) ? (answers[qq.id] as string[]) : [];
      const correctIds = (qq.options || []).filter((o: any) => o.is_correct).map((o: any) => o.id);
      if (userSel.length !== correctIds.length) return false;
      return correctIds.every((id: string) => userSel.includes(id));
    }
    // SCQ
    return !!qq.options?.find((o: any) => o.id === answers[qq.id] && o.is_correct);
  };

  const score = submitted ? questions.filter(qq => isQuestionCorrect(qq)).length : 0;

  if (submitted) {
    const wrong = questions.filter(qq => {
      if (!answers[qq.id] && !nvtInputs[qq.id]) return false;
      if (qq.type === 'NVT') return nvtInputs[qq.id]?.trim() !== qq.answer?.integer_value?.toString();
      return !isQuestionCorrect(qq);
    }).length;
    const skipped = questions.length - answeredCount;

    if (reviewing) {
      const rq = questions[revIdx];
      const userAns = answers[rq.id] || nvtInputs[rq.id];
      const isCorrect = isQuestionCorrect(rq);
      const userSelArr: string[] = rq.type === 'MCQ' ? (Array.isArray(answers[rq.id]) ? answers[rq.id] as string[] : []) : (typeof answers[rq.id] === 'string' ? [answers[rq.id] as string] : []);

      return (
        <div style={{ minHeight: '100vh', background: '#080a0f', color: '#fff', display: 'flex', flexDirection: 'column' }}>
          <WatermarkOverlay />
          <header style={{ height: 48, borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(10,12,20,0.98)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div style={{ width: '100%', maxWidth: isMobile ? '100%' : 900, padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button onClick={() => setReviewing(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                <ChevronLeft style={{ width: 14, height: 14 }} /> Back to Results
              </button>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Review Solutions</span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{revIdx + 1}/{questions.length}</span>
                <button onClick={onBack} style={{ padding: '4px 10px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>🏠 Home</button>
              </div>
            </div>
          </header>
          <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '12px 10px 60px' : '24px 32px 80px' }}>
            <div style={{ maxWidth: isMobile ? 680 : 900, margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: isMobile ? 18 : 24, fontWeight: 800 }}>Q{revIdx + 1}</span>
                <span style={{ fontSize: isMobile ? 11 : 13, color: DIFF_COLOR(rq.metadata.difficulty), background: DIFF_COLOR(rq.metadata.difficulty) + '18', padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>{rq.metadata.difficulty}</span>
                {userAns ? (
                  <span style={{ fontSize: isMobile ? 11 : 13, padding: '2px 10px', borderRadius: 99, background: isCorrect ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)', color: isCorrect ? '#34d399' : '#f87171', fontWeight: 700 }}>{isCorrect ? 'Correct' : 'Wrong'}</span>
                ) : (
                  <span style={{ fontSize: isMobile ? 11 : 13, padding: '2px 10px', borderRadius: 99, background: 'rgba(251,191,36,0.15)', color: '#fbbf24', fontWeight: 700 }}>Skipped</span>
                )}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: isMobile ? '12px 14px' : '18px 22px', marginBottom: 24 }}>
                <MathRenderer markdown={rq.question_text.markdown} className="text-base leading-relaxed" fontSize={isMobile ? 14 : 19} imageScale={rq.svg_scales?.question || 100} />
              </div>
              {rq.options && rq.options.length > 0 && (() => {
                const useGrid = isShortOptions(rq.options);
                return (
                  <div style={{ display: useGrid ? 'grid' : 'flex', gridTemplateColumns: useGrid ? '1fr 1fr' : undefined, flexDirection: useGrid ? undefined : 'column', gap: 8, marginBottom: 24 }}>
                    {rq.options.map((opt: any) => {
                      const sel = userSelArr.includes(opt.id);
                      const correct = opt.is_correct;
                      let borderC = 'rgba(255,255,255,0.1)', bgC = 'rgba(255,255,255,0.03)';
                      if (correct) { borderC = '#34d399'; bgC = 'rgba(52,211,153,0.1)'; }
                      else if (sel && !correct) { borderC = '#f87171'; bgC = 'rgba(248,113,113,0.08)'; }
                      const pct = revStats[opt.id] ?? 0;
                      return (
                        <div key={opt.id} style={{ padding: useGrid ? (isMobile ? '10px 10px' : '14px 14px') : (isMobile ? '12px 14px' : '16px 18px'), borderRadius: 12, border: `1.5px solid ${borderC}`, background: bgC, display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ width: 24, height: 24, borderRadius: 7, border: `1.5px solid ${borderC}`, background: correct ? '#34d399' : (sel ? '#f87171' : 'transparent'), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: (correct || sel) ? '#fff' : 'rgba(255,255,255,0.5)', flexShrink: 0 }}>
                              {correct ? <Check style={{ width: 12, height: 12 }} /> : opt.id.toUpperCase()}
                            </span>
                            <span style={{ flex: 1, color: '#fff', fontSize: isMobile ? 14 : 17 }}><MathRenderer markdown={opt.text || ''} className="text-sm" fontSize={isMobile ? 14 : 17} imageScale={rq.svg_scales?.options || 100} /></span>
                            <span style={{ fontSize: isMobile ? 12 : 14, fontWeight: 700, color: correct ? '#34d399' : '#f87171', flexShrink: 0, minWidth: 36, textAlign: 'right' }}>{pct}%</span>
                          </div>
                          <div style={{ width: '100%', height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, borderRadius: 3, background: correct ? '#34d399' : '#f87171', transition: 'width 0.5s ease' }} />
                          </div>
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
              {(rq.solution.text_markdown || rq.solution.video_url || (rq.solution.asset_ids?.audio && rq.solution.asset_ids.audio.length > 0)) && (
                <div style={{ padding: isMobile ? '12px 14px' : '18px 22px', borderRadius: 14, background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.2)', marginBottom: 24 }}>
                  <div style={{ fontSize: isMobile ? 11 : 13, fontWeight: 700, color: '#a78bfa', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Solution</div>

                  {/* Media Controls Row - Video & Audio buttons */}
                  {(rq.solution?.video_url || (rq.solution?.asset_ids?.audio && rq.solution.asset_ids.audio.length > 0)) && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                      {/* Watch Video Solution Button */}
                      {rq.solution?.video_url && (
                        <button
                          onClick={() => setVideoExpanded(prev => ({ ...prev, [revIdx]: !prev[revIdx] }))}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '8px 14px',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                            border: 'none',
                            borderRadius: 8,
                            color: '#fff',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
                            transition: 'all 0.2s',
                          }}
                        >
                          <MonitorPlay style={{ width: 14, height: 14 }} />
                          <span>{videoExpanded[revIdx] ? 'Hide' : 'Watch'} Video</span>
                          {videoExpanded[revIdx] ? <ChevronUp style={{ width: 12, height: 12 }} /> : <ChevronDown style={{ width: 12, height: 12 }} />}
                        </button>
                      )}
                      
                      {/* Audio Note Button */}
                      {rq.solution?.asset_ids?.audio && rq.solution.asset_ids.audio.length > 0 && (
                        rq.solution.asset_ids.audio.map((url, idx) => (
                          url ? (
                            <button
                              key={idx}
                              onClick={() => setAudioExpanded(prev => ({ ...prev, [`${revIdx}-${idx}`]: !prev[`${revIdx}-${idx}`] }))}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '8px 14px',
                                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                                border: 'none',
                                borderRadius: 8,
                                color: '#fff',
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(168,85,247,0.3)',
                                transition: 'all 0.2s',
                              }}
                            >
                              <Volume2 style={{ width: 14, height: 14 }} />
                              <span>{audioExpanded[`${revIdx}-${idx}`] ? 'Hide' : 'Play'} Audio{rq.solution.asset_ids!.audio!.length > 1 ? ` ${idx + 1}` : ''}</span>
                              {audioExpanded[`${revIdx}-${idx}`] ? <ChevronUp style={{ width: 12, height: 12 }} /> : <ChevronDown style={{ width: 12, height: 12 }} />}
                            </button>
                          ) : null
                        ))
                      )}
                    </div>
                  )}

                  {/* Collapsible Video Player - Square Aspect Ratio */}
                  {rq.solution?.video_url && videoExpanded[revIdx] && (
                    <div style={{ marginBottom: 16, transition: 'all 0.3s ease-in-out' }}>
                      {rq.solution.video_url.includes('youtube.com') || rq.solution.video_url.includes('youtu.be') ? (
                        <div style={{ position: 'relative', paddingBottom: '100%', height: 0, overflow: 'hidden', borderRadius: 8, background: '#000' }}>
                          <iframe
                            src={rq.solution.video_url.replace('watch?v=', 'embed/').split('&')[0].replace('youtu.be/', 'youtube.com/embed/')}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <div style={{ aspectRatio: '1/1', borderRadius: 8, overflow: 'hidden', background: '#000' }}>
                          <video 
                            controls 
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            onKeyDown={(e) => {
                              if (e.key === ' ') {
                                e.preventDefault();
                                const video = e.currentTarget;
                                video.paused ? video.play() : video.pause();
                              } else if (e.key === 'ArrowRight') {
                                e.preventDefault();
                                e.currentTarget.currentTime += 5;
                              } else if (e.key === 'ArrowLeft') {
                                e.preventDefault();
                                e.currentTarget.currentTime -= 5;
                              }
                            }}
                          >
                            <source src={rq.solution.video_url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Collapsible Audio Players */}
                  {rq.solution?.asset_ids?.audio && rq.solution.asset_ids.audio.length > 0 && (
                    <div style={{ marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {rq.solution.asset_ids.audio.map((url, idx) => (
                        url && audioExpanded[`${revIdx}-${idx}`] ? (
                          <audio key={idx} controls style={{ width: '100%', height: 40, borderRadius: 8, transition: 'all 0.3s ease-in-out' }}>
                            <source src={url} type="audio/webm" />
                            <source src={url} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                        ) : null
                      ))}
                    </div>
                  )}

                  {rq.solution.text_markdown && (
                    <MathRenderer markdown={rq.solution.text_markdown} className="text-sm leading-relaxed" fontSize={isMobile ? 14 : 17} imageScale={rq.svg_scales?.solution || 100} />
                  )}
                </div>
              )}
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                {revIdx > 0 && <button onClick={() => { setRevIdx(i => i - 1); }} style={{ padding: '10px 18px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><ChevronLeft style={{ width: 14, height: 14 }} /> Prev</button>}
                {revIdx < questions.length - 1 && <button onClick={() => { setRevIdx(i => i + 1); }} style={{ flex: 1, padding: '10px 18px', borderRadius: 10, border: 'none', background: '#3b82f6', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>Next <ChevronRight style={{ width: 14, height: 14 }} /></button>}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div style={{ minHeight: '100vh', background: '#080a0f', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <WatermarkOverlay />
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
      <button onClick={() => { if (confirm('Submit test? You cannot change answers after submission.')) { setSubmitted(true); setShowSaveModal(true); } }}
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
        <MathRenderer markdown={q.question_text.markdown} className="leading-relaxed" fontSize={isMobile ? undefined : 20} imageScale={q.svg_scales?.question || 100} />
      </div>
      {q.options && q.options.length > 0 && (() => {
        const useGrid = isShortOptions(q.options);
        return (
          <div style={{ display: useGrid ? 'grid' : 'flex', gridTemplateColumns: useGrid ? '1fr 1fr' : undefined, flexDirection: useGrid ? undefined : 'column', gap: 8, marginBottom: 16 }}>
            {q.options.map((opt: any) => {
              const isMCQ = q.type === 'MCQ';
              const userSelArr: string[] = isMCQ ? (Array.isArray(answers[q.id]) ? answers[q.id] as string[] : []) : (typeof answers[q.id] === 'string' ? [answers[q.id] as string] : []);
              const sel = userSelArr.includes(opt.id);
              return (
                <button key={opt.id} onClick={() => {
                  if (isMCQ) {
                    const curArr = Array.isArray(answers[q.id]) ? (answers[q.id] as string[]) : [];
                    const newArr = sel ? curArr.filter(id => id !== opt.id) : [...curArr, opt.id];
                    setAnswers(a => ({ ...a, [q.id]: newArr }));
                  } else {
                    setAnswers(a => ({ ...a, [q.id]: opt.id }));
                  }
                }}
                  style={{ padding: useGrid ? '12px 12px' : (isMobile ? '10px 11px' : '13px 16px'), borderRadius: 12, border: `1.5px solid ${sel ? '#3b82f6' : 'rgba(255,255,255,0.1)'}`, background: sel ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.03)', color: '#fff', fontSize: isMobile ? 13 : 17, textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                  <span style={{ width: 24, height: 24, borderRadius: 7, border: `1.5px solid ${sel ? '#3b82f6' : 'rgba(255,255,255,0.2)'}`, background: sel ? '#3b82f6' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{opt.id.toUpperCase()}</span>
                  <span style={{ flex: 1 }}><MathRenderer markdown={opt.text || ''} fontSize={isMobile ? undefined : 20} imageScale={q.svg_scales?.options || 100} /></span>
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
        {idx < questions.length - 1 ? (
          <button onClick={() => setIdx(i => i + 1)}
            style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: 'none', background: '#3b82f6', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            Save & Next <ChevronRight style={{ width: 13, height: 13 }} />
          </button>
        ) : (
          // Last question — open summary modal instead of silently doing nothing
          <button onClick={() => setShowFinishModal(true)}
            style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: 'none', background: '#059669', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            Finish Test ✓
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ height: '100vh', overflow: 'hidden', background: '#0a0c14', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <WatermarkOverlay />
      <header style={{ height: 48, borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(10,12,20,0.98)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', flexShrink: 0, gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <X style={{ width: 16, height: 16 }} />
          </button>
          {!isMobile && <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>Section 1: Chemistry</span>}
          {!isMobile && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)', fontWeight: 700, whiteSpace: 'nowrap' }}>SINGLE CORRECT</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => setIsPaused(p => !p)}
            style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: isPaused ? 'rgba(251,191,36,0.15)' : 'transparent', color: isPaused ? '#fbbf24' : 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            {isPaused ? '▶' : '⏸'}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: seconds < 300 ? '#f87171' : 'rgba(255,255,255,0.85)', fontSize: 15, fontWeight: 700, fontFamily: 'monospace' }}>
            <Timer style={{ width: 13, height: 13 }} /> {fmt(seconds)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          {isMobile && (
            <button onClick={() => setShowPalette(v => !v)}
              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: showPalette ? 'rgba(255,255,255,0.1)' : 'transparent', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
              {answeredCount}/{questions.length}
            </button>
          )}
          <button onClick={() => { if (confirm('Submit test? You cannot change answers after submission.')) { setSubmitted(true); setShowSaveModal(true); } }}
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
      {/* Finish Test confirmation modal */}
      {showFinishModal && (() => {
        const skippedCount = questions.length - answeredCount;
        return (
          <>
            <div onClick={() => setShowFinishModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 300, backdropFilter: 'blur(4px)' }} />
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 301, background: '#12141f', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 18, padding: '28px 28px 22px', width: 'min(380px, 90vw)', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>
              <div style={{ fontSize: 32, textAlign: 'center', marginBottom: 8 }}>{skippedCount === 0 ? '✅' : '⚠️'}</div>
              <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 800, textAlign: 'center', margin: '0 0 8px' }}>
                {skippedCount === 0 ? 'All Questions Answered!' : `${skippedCount} Question${skippedCount > 1 ? 's' : ''} Skipped`}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, textAlign: 'center', margin: '0 0 20px', lineHeight: 1.6 }}>
                {skippedCount === 0
                  ? `You answered all ${questions.length} questions. Ready to submit?`
                  : `You answered ${answeredCount} of ${questions.length} questions. ${skippedCount} ${skippedCount > 1 ? 'are' : 'is'} still unanswered.`}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  onClick={() => { setShowFinishModal(false); setSubmitted(true); setShowSaveModal(true); }}
                  style={{ width: '100%', padding: '12px', borderRadius: 12, border: 'none', background: '#dc2626', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                  Submit Test Now
                </button>
                {skippedCount > 0 && (
                  <button
                    onClick={() => { setShowFinishModal(false); setShowPalette(true); }}
                    style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                    Review Unanswered ({skippedCount})
                  </button>
                )}
                <button onClick={() => setShowFinishModal(false)}
                  style={{ width: '100%', padding: '10px', borderRadius: 12, border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.3)', fontSize: 13, cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </div>
          </>
        );
      })()}

      {/* Timer Warning Notifications */}
      {showWarning && (
        <div style={{ position: 'fixed', top: 80, right: 20, zIndex: 200, background: showWarning === '1min' ? 'rgba(248,113,113,0.95)' : 'rgba(251,191,36,0.95)', border: `2px solid ${showWarning === '1min' ? '#f87171' : '#fbbf24'}`, borderRadius: 12, padding: '12px 16px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', animation: 'slideIn 0.3s ease-out' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 20 }}>{showWarning === '1min' ? '⚠️' : '⏰'}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#000', marginBottom: 2 }}>
                {showWarning === '1min' ? '1 Minute Remaining!' : '5 Minutes Remaining'}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.7)' }}>
                {showWarning === '1min' ? 'Test will auto-submit soon' : 'Time is running out'}
              </div>
            </div>
            <button
              onClick={() => setShowWarning(null)}
              style={{ background: 'rgba(0,0,0,0.2)', border: 'none', borderRadius: 6, padding: '4px 8px', color: '#000', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginLeft: 8 }}>
              OK
            </button>
          </div>
        </div>
      )}

      {/* Save/Discard Progress Modal */}
      {showSaveModal && (() => {
        const score = questions.filter(qq => isQuestionCorrect(qq)).length;
        const timeSpentMs = Date.now() - testStartTime;
        const timeSpentMin = Math.floor(timeSpentMs / 60000);
        const timeSpentSec = Math.floor((timeSpentMs % 60000) / 1000);
        const timeSpent = `${timeSpentMin}:${String(timeSpentSec).padStart(2, '0')}`;
        
        return (
          <TestSaveModal
            score={score}
            total={questions.length}
            timeSpent={timeSpent}
            onSave={handleSaveProgress}
            onDiscard={handleDiscardProgress}
          />
        );
      })()}
    </div>
  );
}
