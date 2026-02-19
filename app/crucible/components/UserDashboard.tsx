'use client';

import { useState, useEffect } from 'react';
import { getUserProgressSummary, ProgressSummary, resetUserProgress } from '../actions/progress';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar, 
  BookOpen, 
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Flame
} from 'lucide-react';
import Link from 'next/link';

// ============================================
// USER DASHBOARD COMPONENT
// Shows progress, streak, and recommendations
// ============================================

interface UserDashboardProps {
  userId: string;
  userEmail: string;
}

export default function UserDashboard({ userId, userEmail }: UserDashboardProps) {
  const [progress, setProgress] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    loadProgress();
  }, [userId]);

  const loadProgress = async () => {
    try {
      setLoading(true);
      const data = await getUserProgressSummary(userId);
      setProgress(data);
    } catch (err) {
      setError('Failed to load progress');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure? This will reset all your progress data.')) return;
    
    setResetting(true);
    try {
      const result = await resetUserProgress(userId);
      if (result.success) {
        await loadProgress();
      } else {
        setError(result.error || 'Reset failed');
      }
    } catch (err) {
      setError('Reset failed');
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-slate-800/50 rounded-xl p-8 text-center">
          <BookOpen className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No Progress Yet</h2>
          <p className="text-slate-400 mb-6">Start practicing questions to see your progress here!</p>
          <Link 
            href="/crucible"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            Start Practicing
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Progress Dashboard</h1>
          <p className="text-slate-400">Track your chemistry mastery journey</p>
        </div>
        <button
          onClick={handleReset}
          disabled={resetting}
          className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          {resetting ? 'Resetting...' : 'Reset Progress'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Target className="w-6 h-6" />}
          label="Questions Attempted"
          value={progress.totalAttempted}
          color="indigo"
        />
        <StatCard
          icon={<CheckCircle2 className="w-6 h-6" />}
          label="Correct Answers"
          value={progress.totalCorrect}
          color="emerald"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Accuracy"
          value={`${progress.overallAccuracy}%`}
          color="blue"
        />
        <StatCard
          icon={<Flame className="w-6 h-6" />}
          label="Day Streak"
          value={progress.streakDays}
          color="orange"
          highlight={progress.streakDays >= 7}
        />
      </div>

      {/* Recommendations */}
      {progress.recommendations.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-xl p-6 border border-indigo-500/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Recommendations
          </h3>
          <ul className="space-y-2">
            {progress.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-300">
                <span className="text-indigo-400 mt-1">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chapter Progress */}
        <div className="bg-slate-800/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            Chapter Progress
          </h3>
          
          {progress.chaptersProgress.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No chapters practiced yet</p>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {progress.chaptersProgress.map((chapter) => (
                <div 
                  key={chapter.chapterId}
                  className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-white font-medium truncate">
                      {chapter.chapterName}
                    </p>
                    <p className="text-sm text-slate-400">
                      {chapter.attempted} attempted • {chapter.correct} correct
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={`font-semibold ${
                        chapter.accuracy >= 70 ? 'text-emerald-400' :
                        chapter.accuracy >= 50 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {chapter.accuracy}%
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        chapter.masteryLevel === 'Mastered' ? 'bg-emerald-500/20 text-emerald-400' :
                        chapter.masteryLevel === 'Proficient' ? 'bg-blue-500/20 text-blue-400' :
                        chapter.masteryLevel === 'Learning' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {chapter.masteryLevel}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weak Areas */}
        <div className="bg-slate-800/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            Areas to Improve
          </h3>
          
          {progress.weakAreas.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <p className="text-slate-400">Great job! No weak areas detected.</p>
              <p className="text-sm text-slate-500 mt-1">Keep practicing to maintain your skills</p>
            </div>
          ) : (
            <div className="space-y-3">
              {progress.weakAreas.map((area) => (
                <div 
                  key={area.tagId}
                  className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                >
                  <div>
                    <p className="text-white font-medium">{area.tagName}</p>
                    <p className="text-sm text-slate-400">{area.attempted} attempts</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-400 font-semibold">{area.accuracy}%</p>
                    <p className="text-xs text-slate-500">accuracy</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      {progress.recentActivity.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            Recent Activity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {progress.recentActivity.slice(0, 10).map((activity, i) => (
              <div 
                key={i}
                className={`p-3 rounded-lg ${
                  activity.isCorrect ? 'bg-emerald-500/10' : 'bg-red-500/10'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {activity.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                  <span className="text-sm text-slate-300">{activity.displayId}</span>
                </div>
                <p className="text-xs text-slate-500">
                  {new Date(activity.attemptedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: 'indigo' | 'emerald' | 'blue' | 'orange';
  highlight?: boolean;
}

function StatCard({ icon, label, value, color, highlight }: StatCardProps) {
  const colorClasses = {
    indigo: 'bg-indigo-500/20 text-indigo-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    blue: 'bg-blue-500/20 text-blue-400',
    orange: 'bg-orange-500/20 text-orange-400',
  };

  return (
    <div className={`bg-slate-800/50 rounded-xl p-6 ${highlight ? 'ring-2 ring-orange-500/50' : ''}`}>
      <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
}
