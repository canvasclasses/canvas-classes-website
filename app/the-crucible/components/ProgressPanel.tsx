"use client";

import { useEffect, useState } from 'react';
import { X, LogIn } from 'lucide-react';
import Link from 'next/link';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const PLACEHOLDER = { streak: 14, attempted: 1205, totalQ: 2530, mastered: 4, masteredOf: 28, accuracy: 72, activeDays: [0, 1, 2, 3, 4] };

interface ProgressPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
}

// Placeholder data used only on localhost for UI preview
const DEV_PLACEHOLDER_STATS = {
  stats: {
    total_questions_attempted: 247,
    total_correct: 182,
    overall_accuracy: 74,
    streak_days: 5,
  },
  mastered_chapters: 3,
  active_days: [0, 1, 2, 4, 5],
};

const DEV_PLACEHOLDER_TESTS = () => {
  const now = new Date();
  return [
    {
      _id: 'placeholder-1',
      chapter_id: 'ch11_goc',
      test_config: { count: 20, difficulty_mix: 'balanced', question_sort: 'random' },
      score: { correct: 15, total: 20, percentage: 75 },
      timing: { total_seconds: 1245 },
      created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      saved_to_progress: true,
    },
    {
      _id: 'placeholder-2',
      chapter_id: 'ch11_isomerism',
      test_config: { count: 10, difficulty_mix: 'easy', question_sort: 'difficulty' },
      score: { correct: 8, total: 10, percentage: 80 },
      timing: { total_seconds: 654 },
      created_at: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      saved_to_progress: true,
    },
    {
      _id: 'placeholder-3',
      chapter_id: 'ch12_carbonyl',
      test_config: { count: 15, difficulty_mix: 'hard', question_sort: 'topic' },
      score: { correct: 9, total: 15, percentage: 60 },
      timing: { total_seconds: 1890 },
      created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      saved_to_progress: false,
    },
  ];
};

export default function ProgressPanel({ isOpen, onClose, isLoggedIn }: ProgressPanelProps) {
  // Check if local dev (bypass login + show placeholder data)
  // This variable is only ever true on localhost — safe for production deployment
  const isLocalDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';

  // Initialise with placeholder immediately on localhost so UI never shows empty state during load
  const [loading, setLoading] = useState(!isLocalDev);
  const [data, setData] = useState<{
    stats: { total_questions_attempted: number, total_correct: number, overall_accuracy: number, streak_days: number };
    mastered_chapters: number;
    active_days: number[];
  } | null>(isLocalDev ? DEV_PLACEHOLDER_STATS : null);
  const [testResults, setTestResults] = useState<any[]>(isLocalDev ? DEV_PLACEHOLDER_TESTS() : []);
  const [showTests, setShowTests] = useState(isLocalDev);

  // Fetch stats and test results when panel opens
  useEffect(() => {
    if (isOpen && (isLoggedIn || isLocalDev)) {
      setLoading(true);
      Promise.all([
        fetch('/api/v2/user/stats').then(res => res.json()).catch(() => ({ stats: null })),
        fetch('/api/v2/test-results?limit=5').then(res => res.json()).catch(() => ({ results: [] }))
      ])
        .then(([statsData, testsData]) => {
          // Use real data if available
          if (statsData.stats) {
            setData(statsData);
          } else if (isLocalDev) {
            // Placeholder data for localhost preview only
            setData({
              stats: {
                total_questions_attempted: 247,
                total_correct: 182,
                overall_accuracy: 74,
                streak_days: 5
              },
              mastered_chapters: 3,
              active_days: [0, 1, 2, 4, 5] // M, T, W, F, S
            });
          }
          
          if (testsData.results && testsData.results.length > 0) {
            setTestResults(testsData.results);
          } else if (isLocalDev) {
            // Placeholder test results for localhost preview only
            const now = new Date();
            setTestResults([
              {
                _id: 'placeholder-1',
                chapter_id: 'ch11_goc',
                test_config: { count: 20, difficulty_mix: 'balanced', question_sort: 'random' },
                score: { correct: 15, total: 20, percentage: 75 },
                timing: { total_seconds: 1245 },
                created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
                saved_to_progress: true
              },
              {
                _id: 'placeholder-2',
                chapter_id: 'ch11_isomerism',
                test_config: { count: 10, difficulty_mix: 'easy', question_sort: 'difficulty' },
                score: { correct: 8, total: 10, percentage: 80 },
                timing: { total_seconds: 654 },
                created_at: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
                saved_to_progress: true
              },
              {
                _id: 'placeholder-3',
                chapter_id: 'ch12_carbonyl',
                test_config: { count: 15, difficulty_mix: 'hard', question_sort: 'topic' },
                score: { correct: 9, total: 15, percentage: 60 },
                timing: { total_seconds: 1890 },
                created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
                saved_to_progress: false
              }
            ]);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen, isLoggedIn, isLocalDev]);
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const d = data || {
    stats: { total_questions_attempted: 0, total_correct: 0, overall_accuracy: 0, streak_days: 0 },
    mastered_chapters: 0,
    active_days: [],
  };

  const pct = 0; // The totalQ concept doesn't apply cleanly since we have 10k+ Qs across all chapters
  // But we can showaccuracy in the ring or just a fixed ring state for zero.
  const displayPct = d.stats.total_questions_attempted === 0 ? 0 : Math.round(d.stats.overall_accuracy);

  const R = 44;
  const C = 2 * Math.PI * R;

  const stats = [
    { val: d.stats.total_questions_attempted.toLocaleString(), label: 'Solved', color: '#a78bfa' },
    { val: d.stats.total_correct.toLocaleString(), label: 'Correct', color: '#38bdf8' },
    { val: d.mastered_chapters.toString(), label: 'Ch Mastered', color: '#34d399' },
    { val: `${Math.round(d.stats.overall_accuracy)}%`, label: 'Accuracy', color: '#fbbf24' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-lg animate-[fadeIn_0.2s_ease]"
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-[400px] z-[81] bg-[#050505] border-l border-white/[0.06] shadow-[-20px_0_60px_rgba(0,0,0,0.5)] flex flex-col animate-[slideInRight_0.3s_ease-out] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-[18px] px-5 border-b border-white/[0.06] shrink-0">
          <h2 className="text-[17px] font-semibold text-zinc-50 m-0 tracking-tight">
            My Progress
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/[0.06] text-slate-300/80 cursor-pointer flex items-center justify-center transition-all duration-150 hover:bg-white/[0.06]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 px-5 relative">
          {/* Blur overlay for logged-out users (skip on local dev) */}
          {!isLoggedIn && !isLocalDev && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/30 backdrop-blur-[2px] p-6">
              <div className="text-center">
                <h3 className="text-base font-semibold text-zinc-50 mb-2 tracking-tight">
                  Login to track progress
                </h3>
                <p className="text-xs text-slate-400/80 mb-5 leading-relaxed font-normal">
                  Sign in to save your progress and track streaks.
                </p>
                <Link
                  href="/login?next=/the-crucible"
                  className="inline-flex items-center gap-2 p-[11px] px-6 bg-blue-500/10 border border-blue-500/25 rounded-[10px] text-blue-400 text-[13px] font-semibold no-underline backdrop-blur-xl transition-all duration-150 hover:bg-blue-500/12"
                >
                  <LogIn className="w-4 h-4" /> Log in
                </Link>
              </div>
            </div>
          )}

          <div className={`${isLoggedIn || isLocalDev ? '' : 'blur-[6px] opacity-40 pointer-events-none'}`}>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              </div>
            ) : d.stats.total_questions_attempted === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                  <span className="text-2xl">🔥</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Ready to Forge Your Rank?</h3>
                <p className="text-sm text-slate-400 max-w-[240px] mx-auto mb-6">
                  Your progress dashboard is empty. Start practicing to track your accuracy,
                  streaks, and chapters mastered over time!
                </p>
                <button onClick={onClose} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-sm transition-colors">
                  Start Practice
                </button>
              </div>
            ) : !isLoggedIn && !isLocalDev ? (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                  <LogIn className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Login Required</h3>
                <p className="text-sm text-slate-400 max-w-[240px] mx-auto mb-6">
                  Sign in to track your progress, streaks, and test results.
                </p>
                <Link
                  href="/login?next=/the-crucible"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm transition-colors no-underline"
                >
                  <LogIn className="w-4 h-8" /> Log in
                </Link>
              </div>
            ) : (
              <>
                {/* Ring chart */}
                <div className="flex justify-center mb-7">
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                    <circle
                      cx="60" cy="60" r={R} fill="none"
                      stroke="url(#progress-grad)"
                      strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={C}
                      strokeDashoffset={displayPct === 0 ? C : C * (1 - displayPct / 100)}
                      transform="rotate(-90 60 60)"
                      style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)' }}
                    />
                    <defs>
                      <linearGradient id="progress-grad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                    <text x="60" y="55" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="800" fontFamily="monospace">{displayPct}%</text>
                    <text x="60" y="72" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="11" fontFamily="sans-serif">accuracy</text>
                  </svg>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-2.5 mb-5">
                  {stats.map(({ val, label, color }) => (
                    <div key={label} className="bg-white/[0.02] border border-white/[0.06] rounded-[10px] p-3.5 px-4 text-center backdrop-blur-xl">
                      <div className="text-[22px] font-bold leading-none" style={{ color }}>
                        {val}
                      </div>
                      <div className="text-[10px] text-slate-400/70 mt-1.5 font-medium">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Streak section */}
                <div className="bg-orange-600/[0.06] border border-orange-600/15 rounded-xl p-4 px-[18px] backdrop-blur-xl mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-orange-400 tracking-tight">
                      {String.fromCodePoint(0x1F525)} {d.stats.streak_days} day streak
                    </span>
                    <span className="text-[10px] text-slate-400/60 font-medium uppercase tracking-wider">
                      This week
                    </span>
                  </div>
                  <div className="flex gap-1.5 justify-between">
                    {DAYS.map((dayLabel, i) => (
                      <div
                        key={i}
                        className={`flex-1 aspect-square max-w-[40px] rounded-lg border flex items-center justify-center text-[11px] font-semibold transition-all duration-150 ${d.active_days.includes(i)
                          ? 'bg-orange-600/15 border-orange-600/30 text-orange-400'
                          : 'bg-white/[0.02] border-white/[0.06] text-slate-400/40'
                          }`}
                      >
                        {dayLabel}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Tests Section */}
                {testResults.length > 0 && (
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-zinc-50 tracking-tight">
                        🕐 Recent Tests
                      </h3>
                      <button
                        onClick={() => setShowTests(!showTests)}
                        className="text-[10px] text-blue-400 font-medium uppercase tracking-wider hover:text-blue-300 transition-colors"
                      >
                        {showTests ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    {showTests && (
                      <div className="space-y-2">
                        {testResults.slice(0, 3).map((test: any) => {
                          const percentage = test.score?.percentage || 0;
                          const color = percentage >= 70 ? '#34d399' : percentage >= 50 ? '#fbbf24' : '#f87171';
                          const date = new Date(test.created_at);
                          const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                          
                          return (
                            <div key={test._id} className="bg-white/[0.02] border border-white/[0.04] rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-zinc-300">
                                  {test.test_config?.count || 0}Q Test
                                </span>
                                <span className="text-[10px] text-slate-400">{dateStr}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-lg font-bold" style={{ color }}>
                                  {test.score?.correct}/{test.score?.total}
                                </div>
                                <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%`, background: color }}
                                  />
                                </div>
                                <div className="text-sm font-bold" style={{ color }}>
                                  {percentage}%
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </>
  );
}
