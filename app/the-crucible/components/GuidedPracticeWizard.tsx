"use client";

import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Check, Target, GraduationCap, Sparkles, X, ThumbsUp, ThumbsDown, Zap, Clock, Flame, BarChart3 } from 'lucide-react';
import { Chapter, Question } from './types';
import BrowseView from './BrowseView';
import AdaptiveSession from './guided-practice/AdaptiveSession';
import WorkedExamplesCarousel from './guided-practice/WorkedExamplesCarousel';
import { TAXONOMY_FROM_CSV } from '@/app/crucible/admin/taxonomy/taxonomyData_from_csv';
import { FEATURE_ADAPTIVE_PRACTICE } from '@/constants/adaptivePractice';

type GuidedStep = 'chapter' | 'loading' | 'path' | 'examples' | 'filters' | 'practice';
type LearningPath = 'fundamentals' | 'practice';
type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Challenging' | 'Mixed';
type FeedbackType = 'too_easy' | 'just_right' | 'too_hard';

const CAT_COLOR: Record<string, string> = {
  Physical: '#3b82f6', Organic: '#8b5cf6', Inorganic: '#10b981', Practical: '#f59e0b',
};
const CAT_ORDER = ['Physical', 'Inorganic', 'Organic', 'Practical'];

const DIFF_OPTIONS: { id: Difficulty; label: string; color: string }[] = [
  { id: 'Easy',        label: 'Easy',        color: '#34d399' },
  { id: 'Medium',      label: 'Medium',      color: '#fbbf24' },
  { id: 'Hard',        label: 'Hard',        color: '#f87171' },
  { id: 'Challenging', label: 'Challenging', color: '#c084fc' },
  { id: 'Mixed',  label: 'Mixed',  color: '#a78bfa' },
];

interface GuidedPracticeWizardProps {
  chapters: Chapter[];
  onBack: () => void;
  preSelectedChapterId?: string;
  preSelectedDifficulty?: 'Easy' | 'Medium' | 'Hard' | 'Challenging' | 'Mixed';
  preSelectedSessionLength?: number;
}

interface ConceptTag { id: string; name: string; count: number; }

interface SessionStats {
  totalAnswered: number;
  correctCount: number;
  lastFeedbackAt: number;
  currentDifficulty: Difficulty;
}

function getTagName(tagId: string): string {
  const node = TAXONOMY_FROM_CSV.find(n => n.id === tagId);
  return node?.name ?? tagId;
}

function extractTags(qs: Question[], chapterId: string): ConceptTag[] {
  const map = new Map<string, number>();
  for (const q of qs)
    for (const t of q.metadata.tags || [])
      map.set(t.tag_id, (map.get(t.tag_id) || 0) + 1);
  const chapterTagIds = new Set(
    TAXONOMY_FROM_CSV.filter(n => n.type === 'topic' && n.parent_id === chapterId).map(n => n.id)
  );
  return Array.from(map.entries())
    .filter(([id]) => chapterTagIds.has(id))
    .map(([id, count]) => ({ id, count, name: getTagName(id) }))
    .sort((a, b) => b.count - a.count);
}

function applyFilters(all: Question[], diff: Difficulty, tags: Set<string>, pyq: boolean): Question[] {
  let pool = all;
  if (diff !== 'Mixed') {
    if (diff === 'Easy')        pool = pool.filter(q => q.metadata.difficultyLevel <= 2);
    else if (diff === 'Medium')      pool = pool.filter(q => q.metadata.difficultyLevel === 3);
    else if (diff === 'Hard')        pool = pool.filter(q => q.metadata.difficultyLevel === 4);
    else if (diff === 'Challenging') pool = pool.filter(q => q.metadata.difficultyLevel === 5);
  }
  if (pyq) pool = pool.filter(q => q.metadata.is_pyq);
  if (tags.size > 0) pool = pool.filter(q => q.metadata.tags?.some(t => tags.has(t.tag_id)));
  return [...pool].sort(() => Math.random() - 0.5);
}

// Adaptive logic: adjust difficulty based on accuracy + user feedback
function getAdaptiveDifficulty(stats: SessionStats, feedback: FeedbackType | null): Difficulty {
  const accuracy = stats.totalAnswered > 0 ? stats.correctCount / stats.totalAnswered : 0.5;
  
  // User feedback takes priority
  if (feedback === 'too_easy') {
    if (stats.currentDifficulty === 'Easy') return 'Medium';
    if (stats.currentDifficulty === 'Medium') return 'Hard';
    if (stats.currentDifficulty === 'Hard') return 'Challenging';
    return 'Challenging';
  }
  if (feedback === 'too_hard') {
    if (stats.currentDifficulty === 'Challenging') return 'Hard';
    if (stats.currentDifficulty === 'Hard') return 'Medium';
    if (stats.currentDifficulty === 'Medium') return 'Easy';
    return 'Easy';
  }
  
  // Auto-adjust based on accuracy if user says "just right" or no feedback yet
  if (accuracy >= 0.8 && stats.currentDifficulty !== 'Challenging') {
    if (stats.currentDifficulty === 'Easy') return 'Medium';
    if (stats.currentDifficulty === 'Medium') return 'Hard';
    return 'Challenging';
  }
  if (accuracy <= 0.4 && stats.currentDifficulty !== 'Easy') {
    if (stats.currentDifficulty === 'Challenging') return 'Hard';
    if (stats.currentDifficulty === 'Hard') return 'Medium';
    return 'Easy';
  }
  
  return stats.currentDifficulty;
}

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ height: 2, borderRadius: 99, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', width: '100%' }}>
      <div style={{ height: '100%', borderRadius: 99, background: color, width: `${Math.max(value > 0 ? 2 : 0, value)}%`, transition: 'width 0.4s ease' }} />
    </div>
  );
}

function FeedbackModal({ stats, onClose, onSubmit }: {
  stats: SessionStats;
  onClose: () => void;
  onSubmit: (feedback: FeedbackType) => void;
}) {
  const accuracy = stats.totalAnswered > 0 ? Math.round((stats.correctCount / stats.totalAnswered) * 100) : 0;
  
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}
      onClick={onClose}>
      <div style={{ maxWidth: 440, width: '100%', background: '#0f1117', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', padding: '28px 24px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fafafa', margin: '0 0 6px' }}>How are you feeling?</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
              You've answered {stats.totalAnswered} questions · {accuracy}% accuracy
            </p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}>
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        <div style={{ display: 'grid', gap: 12, marginBottom: 20 }}>
          <button onClick={() => onSubmit('too_easy')} style={{ padding: '18px 20px', borderRadius: 14, border: '1.5px solid rgba(52,211,153,0.3)', background: 'rgba(52,211,153,0.08)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(52,211,153,0.6)'; e.currentTarget.style.background = 'rgba(52,211,153,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(52,211,153,0.3)'; e.currentTarget.style.background = 'rgba(52,211,153,0.08)'; }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ThumbsUp style={{ width: 20, height: 20, color: '#34d399' }} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#34d399', marginBottom: 3 }}>Too Easy</div>
                <div style={{ fontSize: 12, color: 'rgba(52,211,153,0.7)' }}>Increase difficulty for next set</div>
              </div>
            </div>
          </button>

          <button onClick={() => onSubmit('just_right')} style={{ padding: '18px 20px', borderRadius: 14, border: '1.5px solid rgba(251,191,36,0.3)', background: 'rgba(251,191,36,0.08)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(251,191,36,0.6)'; e.currentTarget.style.background = 'rgba(251,191,36,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(251,191,36,0.3)'; e.currentTarget.style.background = 'rgba(251,191,36,0.08)'; }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap style={{ width: 20, height: 20, color: '#fbbf24' }} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fbbf24', marginBottom: 3 }}>Just Right</div>
                <div style={{ fontSize: 12, color: 'rgba(251,191,36,0.7)' }}>Keep current difficulty level</div>
              </div>
            </div>
          </button>

          <button onClick={() => onSubmit('too_hard')} style={{ padding: '18px 20px', borderRadius: 14, border: '1.5px solid rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.08)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(248,113,113,0.6)'; e.currentTarget.style.background = 'rgba(248,113,113,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(248,113,113,0.3)'; e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ThumbsDown style={{ width: 20, height: 20, color: '#f87171' }} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#f87171', marginBottom: 3 }}>Too Hard</div>
                <div style={{ fontSize: 12, color: 'rgba(248,113,113,0.7)' }}>Decrease difficulty for next set</div>
              </div>
            </div>
          </button>
        </div>

        <button onClick={onClose} style={{ width: '100%', padding: '11px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          Skip for now
        </button>
      </div>
    </div>
  );
}

export default function GuidedPracticeWizard({ chapters, onBack, preSelectedChapterId, preSelectedDifficulty, preSelectedSessionLength }: GuidedPracticeWizardProps) {
  const [step, setStep] = useState<GuidedStep>(preSelectedChapterId ? 'loading' : 'chapter');
  const [activeTab, setActiveTab] = useState<11 | 12>(11);
  const [selectedChapterId, setSelectedChapterId] = useState(preSelectedChapterId || '');
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [availableTags, setAvailableTags] = useState<ConceptTag[]>([]);
  const [conceptTags, setConceptTags] = useState<Set<string>>(new Set());
  const [difficulty, setDifficulty] = useState<Difficulty>(preSelectedDifficulty || 'Mixed');
  const [pyqOnly, setPyqOnly] = useState(false);
  const [practiceQuestions, setPracticeQuestions] = useState<Question[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // Session tracking for adaptive feedback
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalAnswered: 0,
    correctCount: 0,
    lastFeedbackAt: 0,
    currentDifficulty: preSelectedDifficulty || 'Mixed',
  });
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [sessionMaxQuestions, setSessionMaxQuestions] = useState(preSelectedSessionLength || 20);
  const [sessionKey, setSessionKey] = useState(0);           // bump to force AdaptiveSession re-mount
  const [reviewQuestionIds, setReviewQuestionIds] = useState<string[]>([]); // wrong Qs from previous session
  const [viewedExampleMicroConcepts, setViewedExampleMicroConcepts] = useState<Set<string>>(new Set());

  const fetchChapterQuestions = useCallback(async (chapterId: string) => {
    setStep('loading');
    setLoadError(null);
    try {
      const res = await fetch(`/api/v2/questions?chapter_id=${chapterId}&limit=500`);
      if (!res.ok) throw new Error('API error');
      const json = await res.json();
      if (!json.data || !Array.isArray(json.data)) throw new Error('Invalid data');
      const qs: Question[] = json.data.map((q: any) => ({
        id: q._id,
        display_id: q.display_id || q._id?.slice(0,8)?.toUpperCase() || 'Q',
        question_text: { markdown: q.question_text?.markdown || '' },
        type: q.type,
        options: q.options,
        answer: q.answer,
        solution: {
          text_markdown: q.solution?.text_markdown || '',
          video_url: q.solution?.video_url,
          asset_ids: q.solution?.asset_ids,
          latex_validated: q.solution?.latex_validated || false,
        },
        metadata: {
          difficultyLevel: q.metadata?.difficultyLevel ?? 3,
          chapter_id: q.metadata?.chapter_id || '',
          subject: q.metadata?.subject || 'chemistry',
          tags: q.metadata?.tags || [],
          microConcept: q.metadata?.microConcept,
          isMultiConcept: q.metadata?.isMultiConcept ?? false,
          is_pyq: q.metadata?.is_pyq || false,
          is_top_pyq: q.metadata?.is_top_pyq || false,
          exam_source: q.metadata?.exam_source,
        },
        svg_scales: q.svg_scales || {},
      }));
      setAllQuestions(qs);
      setAvailableTags(extractTags(qs, chapterId));
      setConceptTags(new Set());
      if (!preSelectedDifficulty) setDifficulty('Mixed');
      setPyqOnly(false);
      setSessionStats({ totalAnswered: 0, correctCount: 0, lastFeedbackAt: 0, currentDifficulty: preSelectedDifficulty || 'Mixed' });
      // In adaptive mode show the launch screen (path) so student can choose worked examples or jump to practice
      setStep('path');
    } catch (err) {
      console.error('Failed to load questions:', err);
      setLoadError('Failed to load questions. Please try again.');
      setStep('chapter');
    }
  }, [preSelectedDifficulty]);

  // Auto-fetch questions if preSelectedChapterId is provided
  useEffect(() => {
    if (preSelectedChapterId && step === 'loading') {
      fetchChapterQuestions(preSelectedChapterId);
    }
  }, [fetchChapterQuestions, preSelectedChapterId]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedChapter = chapters.find(c => c.id === selectedChapterId);
  const matchCount = applyFilters(allQuestions, difficulty, conceptTags, pyqOnly).length;
  const pyqCount = allQuestions.filter(q => q.metadata.is_pyq).length;

  const handleChapterSelect = (id: string) => { 
    setSelectedChapterId(id); 
    fetchChapterQuestions(id);
  };
  const toggleTag = (id: string) => setConceptTags(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const selectAllTags = () => setConceptTags(new Set(availableTags.map(t => t.id)));
  const clearAllTags = () => setConceptTags(new Set());

  const handleLaunch = () => {
    const result = applyFilters(allQuestions, difficulty, conceptTags, pyqOnly);
    if (result.length === 0) { setLoadError('No questions match your filters.'); return; }
    setLoadError(null);
    if (FEATURE_ADAPTIVE_PRACTICE) {
      // Session length already selected in filters - go straight to practice
      setStep('practice');
    } else {
      // Legacy batch mode: limit to 10 questions per batch
      setPracticeQuestions(result.slice(0, 10));
      setSessionStats(prev => ({ ...prev, currentDifficulty: difficulty }));
      setStep('practice');
    }
  };

  // Callback from BrowseView when user answers a question
  const handleQuestionAnswered = useCallback((isCorrect: boolean) => {
    setSessionStats(prev => {
      const newStats = {
        ...prev,
        totalAnswered: prev.totalAnswered + 1,
        correctCount: prev.correctCount + (isCorrect ? 1 : 0),
      };
      
      // Show feedback every 10 questions
      if (newStats.totalAnswered > 0 && newStats.totalAnswered % 10 === 0 && newStats.totalAnswered !== prev.lastFeedbackAt) {
        setTimeout(() => setShowFeedbackModal(true), 800);
        return { ...newStats, lastFeedbackAt: newStats.totalAnswered };
      }
      
      return newStats;
    });
  }, []);

  const handleFeedbackSubmit = useCallback((feedback: FeedbackType) => {
    setShowFeedbackModal(false);
    
    const newDiff = getAdaptiveDifficulty(sessionStats, feedback);
    // Get next batch of 10 questions with adjusted difficulty
    const nextBatch = applyFilters(allQuestions, newDiff, conceptTags, pyqOnly).slice(0, 10);
    if (nextBatch.length > 0) {
      setPracticeQuestions(nextBatch);
      setSessionStats(prev => ({ ...prev, currentDifficulty: newDiff, totalAnswered: 0, correctCount: 0, lastFeedbackAt: 0 }));
    } else {
      // No more questions, go back to filters
      setStep('filters');
    }
  }, [sessionStats, allQuestions, conceptTags, pyqOnly]);

  // Setup screen removed - session length now selected in filters screen

  if (step === 'practice') {
    // ── Adaptive mode (feature-flagged) ─────────────────────────────────────
    if (FEATURE_ADAPTIVE_PRACTICE && selectedChapterId && selectedChapter) {
      return (
        <AdaptiveSession
          key={sessionKey}
          chapter={{ id: selectedChapterId, name: selectedChapter.name }}
          chapters={chapters}
          allQuestions={allQuestions}
          initialDifficulty={difficulty}
          conceptTagFilter={conceptTags}
          pyqOnly={pyqOnly}
          sessionMaxQuestions={sessionMaxQuestions}
          priorityQuestionIds={reviewQuestionIds}
          viewedExampleMicroConcepts={viewedExampleMicroConcepts}
          onBack={() => { setReviewQuestionIds([]); setStep('filters'); }}
          onReviewMistakes={(wrongIds) => {
            setReviewQuestionIds(wrongIds);
            setSessionKey(k => k + 1);
          }}
        />
      );
    }
    // ── Legacy batch mode ────────────────────────────────────────────────────
    return (
      <>
        <BrowseView
          questions={practiceQuestions}
          chapters={chapters}
          onBack={() => setStep('filters')}
          chapterId={selectedChapterId}
          guidedMode
          onQuestionAnswered={handleQuestionAnswered}
        />
        {showFeedbackModal && (
          <FeedbackModal
            stats={sessionStats}
            onClose={() => setShowFeedbackModal(false)}
            onSubmit={handleFeedbackSubmit}
          />
        )}
      </>
    );
  }

  if (step === 'loading') return (
    <div style={{ position:'fixed', inset:0, background:'#07080f', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16, zIndex:50 }}>
      <div style={{ width:32, height:32, border:'2px solid #10b981', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>Loading {selectedChapter?.name ?? 'questions'}…</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const Nav = ({ title, sub, onBk }: { title: string; sub?: string; onBk: () => void }) => (
    <nav style={{ borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'12px 20px', display:'flex', alignItems:'center', gap:12, background:'rgba(7,8,15,0.97)', backdropFilter:'blur(20px)', position:'sticky', top:0, zIndex:20 }}>
      <button onClick={onBk} style={{ display:'flex', alignItems:'center', gap:4, padding:'6px 10px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.7)', fontSize:12, cursor:'pointer', fontWeight:500 }}>
        <ChevronLeft style={{ width:14, height:14 }} /> Back
      </button>
      <div style={{ display:'flex', alignItems:'center', gap:8, minWidth:0 }}>
        <div style={{ width:28, height:28, borderRadius:8, background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <BookOpen style={{ width:14, height:14, color:'#10b981' }} />
        </div>
        <div style={{ minWidth:0 }}>
          <div style={{ fontSize:14, fontWeight:600, color:'#fafafa', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{title}</div>
          {sub && <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>{sub}</div>}
        </div>
      </div>
    </nav>
  );

  if (step === 'path') return (
    <div style={{ position:'fixed', inset:0, background:'#07080f', color:'#fafafa', display:'flex', flexDirection:'column', zIndex:50 }}>
      <style>{`@keyframes fadeUp{from{transform:translateY(8px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
      <Nav title={selectedChapter?.name ?? 'Choose Path'} sub='How would you like to learn?' onBk={() => setStep('chapter')} />
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px 20px' }}>
        <div style={{ maxWidth:560, width:'100%', animation:'fadeUp 0.3s ease-out' }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <h2 style={{ fontSize:22, fontWeight:700, margin:'0 0 8px', color:'#fafafa' }}>Choose Your Learning Path</h2>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)', margin:0 }}>Build fundamentals first, or jump straight into practice</p>
          </div>
          <div style={{ display:'grid', gap:14 }}>
            <button onClick={() => {
                const workedExamples = allQuestions.filter(q => q.type === 'WKEX');
                if (workedExamples.length === 0) { setStep('filters'); return; }
                setStep('examples');
              }} style={{ padding:'22px 20px', borderRadius:16, border:'1px solid rgba(139,92,246,0.2)', background:'rgba(139,92,246,0.06)', cursor:'pointer', textAlign:'left', transition:'all 0.18s', position:'relative' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(139,92,246,0.45)'; e.currentTarget.style.background='rgba(139,92,246,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(139,92,246,0.2)'; e.currentTarget.style.background='rgba(139,92,246,0.06)'; }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:'rgba(139,92,246,0.12)', border:'1px solid rgba(139,92,246,0.25)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <GraduationCap style={{ width:22, height:22, color:'#a78bfa' }} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:16, fontWeight:700, color:'#fafafa', marginBottom:5 }}>Build Fundamentals</div>
                  <p style={{ fontSize:13, color:'rgba(255,255,255,0.45)', margin:'0 0 10px', lineHeight:1.6 }}>Learn through solved examples with step-by-step explanations. Master the methodology before attempting MCQs.</p>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                    {['Solved Examples','Step-by-Step','Concept Mastery'].map(t => <span key={t} style={{ fontSize:11, padding:'3px 8px', borderRadius:6, background:'rgba(139,92,246,0.1)', color:'#c4b5fd', border:'1px solid rgba(139,92,246,0.2)' }}>{t}</span>)}
                  </div>
                </div>
                <ChevronRight style={{ width:18, height:18, color:'rgba(139,92,246,0.5)', flexShrink:0, marginTop:4 }} />
              </div>
            </button>
            <button onClick={() => setStep('filters')} style={{ padding:'22px 20px', borderRadius:16, border:'1px solid rgba(16,185,129,0.25)', background:'rgba(16,185,129,0.08)', cursor:'pointer', textAlign:'left', transition:'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(16,185,129,0.5)'; e.currentTarget.style.background='rgba(16,185,129,0.13)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(16,185,129,0.25)'; e.currentTarget.style.background='rgba(16,185,129,0.08)'; }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Target style={{ width:22, height:22, color:'#10b981' }} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:16, fontWeight:700, color:'#fafafa', marginBottom:5, display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                    Practice Questions
                    <span style={{ fontSize:10, padding:'2px 7px', borderRadius:6, background:'rgba(16,185,129,0.15)', color:'#34d399', fontWeight:700 }}>RECOMMENDED</span>
                  </div>
                  <p style={{ fontSize:13, color:'rgba(255,255,255,0.45)', margin:'0 0 10px', lineHeight:1.6 }}>MCQs and numerical problems. Filter by concept, difficulty, and PYQ status. Adaptive guidance after every 10 questions.</p>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                    {['Smart Filters','Concept Tags','Instant Feedback'].map(t => <span key={t} style={{ fontSize:11, padding:'3px 8px', borderRadius:6, background:'rgba(16,185,129,0.1)', color:'#6ee7b7', border:'1px solid rgba(16,185,129,0.2)' }}>{t}</span>)}
                  </div>
                </div>
                <ChevronRight style={{ width:18, height:18, color:'rgba(16,185,129,0.5)', flexShrink:0, marginTop:4 }} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (step === 'examples') {
    const workedExamples = allQuestions.filter(q => q.type === 'WKEX');
    return (
      <WorkedExamplesCarousel
        examples={workedExamples}
        chapterName={selectedChapter?.name ?? ''}
        onComplete={(viewedMCs) => {
          setViewedExampleMicroConcepts(viewedMCs);
          setStep('filters');
        }}
      />
    );
  }

  if (step === 'filters') {
    const filterDesc = [
      difficulty !== 'Mixed' ? difficulty : null,
      pyqOnly ? 'PYQ only' : null,
      conceptTags.size > 0 ? `${conceptTags.size} concept${conceptTags.size > 1 ? 's' : ''}` : null,
    ].filter(Boolean).join(' · ') || 'All questions';

    // Compute difficulty distribution for the visual bar
    const diffCounts = { Easy: 0, Medium: 0, Hard: 0 };
    for (const q of allQuestions) {
      if (q.metadata.difficultyLevel <= 2) diffCounts.Easy++;
      else if (q.metadata.difficultyLevel === 3) diffCounts.Medium++;
      else if (q.metadata.difficultyLevel >= 4) diffCounts.Hard++;
    }
    const diffTotal = allQuestions.length || 1;

    // Max tag count for proportional bars
    const maxTagCount = availableTags.length > 0 ? Math.max(...availableTags.map(t => t.count)) : 1;

    return (
      <div style={{ position:'fixed', inset:0, background:'#07080f', color:'#fafafa', display:'flex', flexDirection:'column', zIndex:50 }}>
        <style>{`
          @keyframes fadeUp{from{transform:translateY(12px);opacity:0}to{transform:translateY(0);opacity:1}}
          @keyframes slideIn{from{transform:translateX(-8px);opacity:0}to{transform:translateX(0);opacity:1}}
          @keyframes pulseGlow{0%,100%{box-shadow:0 0 20px rgba(16,185,129,0.15)}50%{box-shadow:0 0 35px rgba(16,185,129,0.35)}}
          @keyframes countPop{0%{transform:scale(1)}50%{transform:scale(1.15)}100%{transform:scale(1)}}
          @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        `}</style>
        <Nav title={selectedChapter?.name ?? 'Filters'} sub={`${allQuestions.length} questions available`} onBk={preSelectedChapterId ? onBack : () => setStep('chapter')} />
        <div style={{ flex:1, overflowY:'auto', display:'flex', justifyContent:'center', padding:'20px 20px 180px' }}>
          <div style={{ maxWidth:640, width:'100%' }}>

            {/* ── Hero stats row ───────────────────────────────────────── */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10, marginBottom:28, animation:'fadeUp 0.3s ease-out' }}>
              {[
                { label:'Total', value:allQuestions.length, icon: BarChart3, color:'#38bdf8' },
                { label:'PYQ', value:pyqCount, icon: Flame, color:'#fbbf24' },
                { label:'Concepts', value:availableTags.length, icon: BookOpen, color:'#a78bfa' },
              ].map((stat, i) => (
                <div key={stat.label} style={{
                  padding:'14px 12px', borderRadius:14, textAlign:'center',
                  background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)',
                  animation:`fadeUp 0.35s ease-out ${i * 0.06}s both`,
                }}>
                  <stat.icon style={{ width:16, height:16, color:stat.color, margin:'0 auto 6px' }} />
                  <div style={{ fontSize:22, fontWeight:800, color:stat.color, letterSpacing:'-0.02em', lineHeight:1 }}>{stat.value}</div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', fontWeight:600, marginTop:4, textTransform:'uppercase', letterSpacing:'0.06em' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* ── Difficulty ─────────────────────────────────────────── */}
            <div style={{ marginBottom:28, animation:'fadeUp 0.35s ease-out 0.08s both' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                <Sparkles style={{ width:14, height:14, color:'#fbbf24' }} />
                <span style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.08em' }}>Difficulty</span>
              </div>
              {/* Segmented control with glow */}
              <div style={{ display:'flex', gap:0, background:'rgba(255,255,255,0.03)', borderRadius:14, padding:3, border:'1px solid rgba(255,255,255,0.06)' }}>
                {DIFF_OPTIONS.map(opt => {
                  const sel = difficulty === opt.id;
                  return (
                    <button key={opt.id} onClick={() => setDifficulty(opt.id)} style={{
                      flex:1, padding:'12px 8px', borderRadius:11, cursor:'pointer',
                      transition:'all 0.2s ease',
                      border:'none',
                      background: sel ? `${opt.color}18` : 'transparent',
                      boxShadow: sel ? `0 0 20px ${opt.color}20, inset 0 0 0 1.5px ${opt.color}40` : 'none',
                      color: sel ? opt.color : 'rgba(255,255,255,0.45)',
                      position:'relative', overflow:'hidden',
                    }}>
                      <div style={{ fontSize:13, fontWeight: sel ? 800 : 600, position:'relative', zIndex:1 }}>{opt.label}</div>
                      {sel && <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 50% 120%, ${opt.color}15, transparent 70%)` }} />}
                    </button>
                  );
                })}
              </div>
              {/* Distribution bar */}
              <div style={{ display:'flex', height:4, borderRadius:99, overflow:'hidden', marginTop:10, gap:1 }}>
                <div style={{ width:`${(diffCounts.Easy / diffTotal) * 100}%`, background:'#34d399', borderRadius:'99px 0 0 99px', transition:'width 0.4s ease', opacity: difficulty === 'Easy' || difficulty === 'Mixed' ? 1 : 0.25 }} />
                <div style={{ width:`${(diffCounts.Medium / diffTotal) * 100}%`, background:'#fbbf24', transition:'width 0.4s ease', opacity: difficulty === 'Medium' || difficulty === 'Mixed' ? 1 : 0.25 }} />
                <div style={{ width:`${(diffCounts.Hard / diffTotal) * 100}%`, background:'#f87171', borderRadius:'0 99px 99px 0', transition:'width 0.4s ease', opacity: difficulty === 'Hard' || difficulty === 'Mixed' ? 1 : 0.25 }} />
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
                {[
                  { label:'Easy', count:diffCounts.Easy, color:'#34d399' },
                  { label:'Medium', count:diffCounts.Medium, color:'#fbbf24' },
                  { label:'Hard', count:diffCounts.Hard, color:'#f87171' },
                ].map(d => (
                  <span key={d.label} style={{ fontSize:10, color: (difficulty === d.label || difficulty === 'Mixed') ? d.color : 'rgba(255,255,255,0.2)', fontWeight:600, transition:'color 0.2s' }}>
                    {d.count}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Question Source ────────────────────────────────────── */}
            <div style={{ marginBottom:28, animation:'fadeUp 0.35s ease-out 0.14s both' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                <Target style={{ width:14, height:14, color:'#38bdf8' }} />
                <span style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.08em' }}>Question Source</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {([
                  { val:false, label:'All Questions', count:allQuestions.length, color:'#a78bfa', desc:'Practice + PYQs', icon: BookOpen },
                  { val:true,  label:'PYQ Only',      count:pyqCount,            color:'#fbbf24', desc:'Past exam questions', icon: Flame },
                ] as const).map(opt => {
                  const sel = pyqOnly === opt.val;
                  return (
                    <button key={String(opt.val)} onClick={() => setPyqOnly(opt.val)} style={{
                      display:'flex', flexDirection:'column', gap:10,
                      padding:'16px 16px', borderRadius:14, cursor:'pointer',
                      transition:'all 0.2s ease', textAlign:'left', position:'relative', overflow:'hidden',
                      border:`1.5px solid ${sel ? opt.color + '45' : 'rgba(255,255,255,0.06)'}`,
                      background: sel ? `${opt.color}0a` : 'rgba(255,255,255,0.015)',
                      boxShadow: sel ? `0 4px 20px ${opt.color}12` : 'none',
                    }}>
                      {sel && <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, transparent, ${opt.color}, transparent)` }} />}
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{
                          width:36, height:36, borderRadius:10,
                          background: sel ? `${opt.color}15` : 'rgba(255,255,255,0.04)',
                          border:`1px solid ${sel ? `${opt.color}30` : 'rgba(255,255,255,0.06)'}`,
                          display:'flex', alignItems:'center', justifyContent:'center',
                          transition:'all 0.2s',
                        }}>
                          <opt.icon style={{ width:16, height:16, color: sel ? opt.color : 'rgba(255,255,255,0.3)' }} />
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:14, fontWeight:700, color: sel ? '#fafafa' : 'rgba(255,255,255,0.7)', marginBottom:2 }}>{opt.label}</div>
                          <div style={{ fontSize:11, color: sel ? `${opt.color}99` : 'rgba(255,255,255,0.3)' }}>{opt.desc}</div>
                        </div>
                      </div>
                      <div style={{
                        fontSize:20, fontWeight:800, color: sel ? opt.color : 'rgba(255,255,255,0.25)',
                        letterSpacing:'-0.02em', transition:'color 0.2s',
                      }}>
                        {opt.count}
                        <span style={{ fontSize:11, fontWeight:600, marginLeft:4, opacity:0.7 }}>questions</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Concept Focus ──────────────────────────────────────── */}
            {availableTags.length > 0 && (
              <div style={{ marginBottom:28, animation:'fadeUp 0.35s ease-out 0.2s both' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12, flexWrap:'wrap', gap:8 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <BookOpen style={{ width:14, height:14, color:'#10b981' }} />
                    <span style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.08em' }}>
                      Concept Focus
                    </span>
                    {conceptTags.size > 0 && (
                      <span style={{
                        fontSize:11, fontWeight:700, color:'#10b981',
                        background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.25)',
                        padding:'2px 8px', borderRadius:99,
                        animation:'countPop 0.3s ease',
                      }}>
                        {conceptTags.size} selected
                      </span>
                    )}
                  </div>
                  <div style={{ display:'flex', gap:6 }}>
                    {conceptTags.size > 0 && (
                      <button onClick={clearAllTags} style={{ fontSize:10, color:'rgba(255,255,255,0.35)', background:'none', border:'1px solid rgba(255,255,255,0.08)', cursor:'pointer', padding:'3px 10px', borderRadius:6, fontWeight:600, transition:'all 0.15s' }}>Clear</button>
                    )}
                    {conceptTags.size !== availableTags.length && (
                      <button onClick={selectAllTags} style={{ fontSize:10, color:'#10b981', background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', cursor:'pointer', padding:'3px 10px', borderRadius:6, fontWeight:700, transition:'all 0.15s' }}>Select All</button>
                    )}
                  </div>
                </div>
                <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)', margin:'0 0 10px', lineHeight:1.5 }}>Focus on specific topics or leave all unselected to cover everything.</p>
                {/* Concept tag cards with mini distribution bars */}
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  {availableTags.map((tag, i) => {
                    const sel = conceptTags.has(tag.id);
                    const pct = Math.round((tag.count / maxTagCount) * 100);
                    return (
                      <button key={tag.id} onClick={() => toggleTag(tag.id)} style={{
                        display:'flex', alignItems:'center', gap:10,
                        padding:'10px 14px', borderRadius:10, cursor:'pointer',
                        transition:'all 0.15s ease', textAlign:'left', position:'relative', overflow:'hidden',
                        border:`1.5px solid ${sel ? 'rgba(16,185,129,0.35)' : 'rgba(255,255,255,0.04)'}`,
                        background: sel ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.015)',
                        animation:`slideIn 0.25s ease-out ${Math.min(i * 0.03, 0.4)}s both`,
                      }}>
                        {/* Background fill bar */}
                        <div style={{
                          position:'absolute', left:0, top:0, bottom:0,
                          width:`${pct}%`,
                          background: sel ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.015)',
                          transition:'width 0.4s ease, background 0.2s',
                          borderRadius:10,
                        }} />
                        {/* Checkbox */}
                        <div style={{
                          width:20, height:20, borderRadius:6, flexShrink:0,
                          border:`1.5px solid ${sel ? '#10b981' : 'rgba(255,255,255,0.12)'}`,
                          background: sel ? 'rgba(16,185,129,0.25)' : 'transparent',
                          display:'flex', alignItems:'center', justifyContent:'center',
                          transition:'all 0.15s', position:'relative', zIndex:1,
                        }}>
                          {sel && <Check style={{ width:12, height:12, color:'#10b981' }} />}
                        </div>
                        {/* Tag name */}
                        <span style={{
                          flex:1, fontSize:13, fontWeight: sel ? 650 : 500,
                          color: sel ? '#e2e8f0' : 'rgba(255,255,255,0.55)',
                          position:'relative', zIndex:1, transition:'color 0.15s',
                          overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                        }}>
                          {tag.name}
                        </span>
                        {/* Count badge */}
                        <span style={{
                          fontSize:11, fontWeight:700, flexShrink:0,
                          color: sel ? '#10b981' : 'rgba(255,255,255,0.25)',
                          background: sel ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.04)',
                          padding:'2px 8px', borderRadius:6,
                          position:'relative', zIndex:1, transition:'all 0.15s',
                          fontFamily:'monospace',
                        }}>
                          {tag.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {loadError && <div style={{ padding:'12px 16px', background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.2)', borderRadius:10, fontSize:13, color:'#f87171' }}>{loadError}</div>}

            {/* ── Session Length ──────────────────────────────────────── */}
            {FEATURE_ADAPTIVE_PRACTICE && !preSelectedSessionLength && (
              <div style={{ marginBottom:28, animation:'fadeUp 0.35s ease-out 0.26s both' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                  <Clock style={{ width:14, height:14, color:'#10b981' }} />
                  <span style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.08em' }}>Session Length</span>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10 }}>
                  {[
                    { val:10, label:'Quick',    time:'~12 min', icon:'⚡' },
                    { val:20, label:'Standard', time:'~25 min', icon:'🎯' },
                    { val:30, label:'Deep',     time:'~40 min', icon:'🔥' },
                  ].map(opt => {
                    const sel = sessionMaxQuestions === opt.val;
                    return (
                      <button key={opt.val} onClick={() => setSessionMaxQuestions(opt.val)} style={{
                        padding:'18px 12px', borderRadius:14, cursor:'pointer',
                        transition:'all 0.2s ease', textAlign:'center', position:'relative', overflow:'hidden',
                        border:`1.5px solid ${sel ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.06)'}`,
                        background: sel ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.015)',
                        boxShadow: sel ? '0 4px 20px rgba(16,185,129,0.1)' : 'none',
                      }}>
                        {sel && <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg, transparent, #10b981, transparent)' }} />}
                        <div style={{ fontSize:14, marginBottom:6 }}>{opt.icon}</div>
                        <div style={{ fontSize:26, fontWeight:800, color: sel ? '#10b981' : 'rgba(255,255,255,0.4)', letterSpacing:'-0.03em', lineHeight:1, marginBottom:6, transition:'color 0.2s' }}>{opt.val}</div>
                        <div style={{ fontSize:12, fontWeight:700, color: sel ? '#10b981' : 'rgba(255,255,255,0.35)', marginBottom:2, transition:'color 0.2s' }}>{opt.label}</div>
                        <div style={{ fontSize:10, color: sel ? 'rgba(16,185,129,0.6)' : 'rgba(255,255,255,0.2)', transition:'color 0.2s' }}>{opt.time}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Sticky bottom launch bar ────────────────────────────── */}
        <div style={{
          position:'sticky', bottom:0, padding:'16px 20px 20px',
          background:'linear-gradient(to top, rgba(7,8,15,0.99) 60%, rgba(7,8,15,0.95) 80%, transparent)',
          backdropFilter:'blur(24px)',
        }}>
          <div style={{ maxWidth:640, margin:'0 auto' }}>
            {/* Live filter summary chips */}
            <div style={{ display:'flex', gap:6, marginBottom:10, flexWrap:'wrap' }}>
              {difficulty !== 'Mixed' && (
                <span style={{ fontSize:10, padding:'3px 8px', borderRadius:6, background:`${DIFF_OPTIONS.find(d => d.id === difficulty)?.color ?? '#a78bfa'}15`, color: DIFF_OPTIONS.find(d => d.id === difficulty)?.color ?? '#a78bfa', border:`1px solid ${DIFF_OPTIONS.find(d => d.id === difficulty)?.color ?? '#a78bfa'}30`, fontWeight:700 }}>
                  {difficulty}
                </span>
              )}
              {pyqOnly && (
                <span style={{ fontSize:10, padding:'3px 8px', borderRadius:6, background:'rgba(251,191,36,0.1)', color:'#fbbf24', border:'1px solid rgba(251,191,36,0.25)', fontWeight:700 }}>
                  PYQ Only
                </span>
              )}
              {conceptTags.size > 0 && (
                <span style={{ fontSize:10, padding:'3px 8px', borderRadius:6, background:'rgba(16,185,129,0.1)', color:'#10b981', border:'1px solid rgba(16,185,129,0.25)', fontWeight:700 }}>
                  {conceptTags.size} concept{conceptTags.size !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ flex:1, minWidth:120 }}>
                <div style={{
                  fontSize:18, fontWeight:800,
                  color: matchCount > 0 ? '#10b981' : '#f87171',
                  letterSpacing:'-0.02em',
                  animation: 'countPop 0.3s ease',
                }}>
                  {matchCount} question{matchCount !== 1 ? 's' : ''} ready
                </div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:2 }}>{filterDesc}</div>
              </div>
              <button onClick={handleLaunch} disabled={matchCount === 0} style={{
                padding:'15px 36px', borderRadius:14, border:'none',
                cursor: matchCount === 0 ? 'not-allowed' : 'pointer',
                background: matchCount === 0 ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg,#059669 0%,#10b981 50%,#34d399 100%)',
                color: matchCount === 0 ? 'rgba(255,255,255,0.2)' : '#fff',
                fontSize:15, fontWeight:800, display:'flex', alignItems:'center', gap:8,
                boxShadow: matchCount > 0 ? '0 8px 30px rgba(16,185,129,0.3)' : 'none',
                animation: matchCount > 0 ? 'pulseGlow 2.5s ease-in-out infinite' : 'none',
                transition:'all 0.2s ease',
              }}>
                Start Practice <ChevronRight style={{ width:18, height:18 }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const classChapters = chapters.filter(ch => ch.class_level === activeTab);
  const grouped: Record<string, Chapter[]> = {};
  classChapters.forEach(ch => { const cat = ch.category ?? 'Physical'; (grouped[cat] = grouped[cat] || []).push(ch); });

  return (
    <div style={{ position:'fixed', inset:0, background:'#07080f', color:'#fafafa', display:'flex', flexDirection:'column', zIndex:50 }}>
      <style>{`@keyframes fadeUp{from{transform:translateY(8px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
      <Nav title='Guided Practice' sub='Select a chapter to begin' onBk={onBack} />
      <div style={{ flex:1, overflowY:'auto', display:'flex', justifyContent:'center' }}>
        <div style={{ width:'100%', maxWidth:680 }}>
          <div style={{ padding:'12px 16px 0' }}>
            <div style={{ display:'flex', background:'rgba(255,255,255,0.02)', borderRadius:10, padding:3, gap:3, border:'1px solid rgba(255,255,255,0.06)' }}>
              {([11,12] as const).map(level => {
                const isActive = activeTab === level;
                const color = level === 11 ? '#38bdf8' : '#a78bfa';
                const count = chapters.filter(c => c.class_level === level).length;
                return (
                  <button key={level} onClick={() => setActiveTab(level)} style={{ flex:1, padding:'10px 8px', borderRadius:8, border:'none', cursor:'pointer', background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent', color: isActive ? '#fff' : 'rgba(255,255,255,0.4)', fontSize:13, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:7, transition:'all 0.15s' }}>
                    Class {level}
                    <span style={{ fontSize:11, color: isActive ? color : 'rgba(255,255,255,0.3)' }}>{count} ch</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ animation:'fadeUp 0.2s ease-out' }}>
            {loadError && <div style={{ margin:'12px 16px', padding:'10px 14px', background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.2)', borderRadius:10, fontSize:13, color:'#f87171' }}>{loadError}</div>}
            {CAT_ORDER.filter(cat => grouped[cat]?.length).map(cat => (
              <div key={cat}>
                <div style={{ padding:'8px 16px 5px', display:'flex', alignItems:'center', gap:8, position:'sticky', top:0, background:'rgba(7,8,15,0.97)', backdropFilter:'blur(12px)', zIndex:2, borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:CAT_COLOR[cat] }} />
                  <span style={{ fontSize:10, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', color:CAT_COLOR[cat] }}>{cat}</span>
                  <span style={{ fontSize:10, color:'rgba(255,255,255,0.28)', marginLeft:'auto' }}>{grouped[cat].reduce((s,c)=>s+(c.question_count??0),0)} Qs</span>
                </div>
                {grouped[cat].map(ch => {
                  const accent = CAT_COLOR[ch.category ?? 'Physical'];
                  const qCount = ch.question_count ?? 0;
                  return (
                    <div key={ch.id} onClick={() => handleChapterSelect(ch.id)}
                      onMouseEnter={e => (e.currentTarget.style.background = `${accent}09`)}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 16px', borderBottom:'1px solid rgba(255,255,255,0.03)', cursor:'pointer', transition:'background 0.12s' }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:5 }}>
                          <span style={{ fontSize:13, color:'rgba(255,255,255,0.88)', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', paddingRight:8 }}>{ch.name}</span>
                          <span style={{ fontSize:11, fontWeight:600, flexShrink:0, color: qCount>0 ? accent : 'rgba(148,163,184,0.4)', background: qCount>0 ? `${accent}0d` : 'transparent', padding:'1px 6px', borderRadius:4 }}>{qCount>0 ? qCount : '—'}</span>
                        </div>
                        <Bar value={qCount>0 ? Math.min(100,Math.round((qCount/300)*100)) : 0} color={accent} />
                      </div>
                      <ChevronRight style={{ width:14, height:14, color:'rgba(255,255,255,0.18)', flexShrink:0 }} />
                    </div>
                  );
                })}
              </div>
            ))}
            <div style={{ height:8 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
