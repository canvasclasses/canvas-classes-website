'use client';

import { useRouter } from 'next/navigation';
import StatsCard from './components/StatsCard';
import ChapterBreakdown from './components/ChapterBreakdown';
import RecentTests from './components/RecentTests';
import { calculateAnalytics } from './utils/calculateAnalytics';
import { ITestResult } from '@/lib/models/TestResult';

interface DashboardClientProps {
  testResults: any[];
  chapterMap: Record<string, string>;
  isLocalDev?: boolean;
}

export default function DashboardClient({ testResults, chapterMap, isLocalDev }: DashboardClientProps) {
  const router = useRouter();
  const analytics = calculateAnalytics(testResults as ITestResult[], chapterMap);

  if (isLocalDev) {
    return (
      <div style={{ minHeight: '100vh', background: '#080a0f', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Dashboard Preview</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 24 }}>
            Login to view your test performance and analytics
          </p>
          <button
            onClick={() => router.push('/the-crucible')}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg,#7c3aed,#5b21b6)',
              border: 'none',
              borderRadius: 12,
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Go to Crucible
          </button>
        </div>
      </div>
    );
  }

  if (testResults.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#080a0f', color: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>Test Dashboard</h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>Track your performance and progress</p>
          </div>

          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📝</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>No Tests Yet</h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 24 }}>
              Take your first test to see your performance analytics here
            </p>
            <button
              onClick={() => router.push('/the-crucible')}
              style={{
                padding: '14px 28px',
                background: 'linear-gradient(135deg,#7c3aed,#5b21b6)',
                border: 'none',
                borderRadius: 12,
                color: '#fff',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
              }}
            >
              Take a Test →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080a0f', color: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <h1 style={{ fontSize: 32, fontWeight: 900 }}>Test Dashboard</h1>
            <button
              onClick={() => router.push('/the-crucible')}
              style={{
                padding: '10px 20px',
                background: 'rgba(124,58,237,0.15)',
                border: '1px solid rgba(124,58,237,0.3)',
                borderRadius: 10,
                color: '#a78bfa',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Take New Test
            </button>
          </div>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
            Track your performance across {analytics.totalTests} tests
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}>
          <StatsCard
            icon="🎯"
            label="Tests Taken"
            value={analytics.totalTests}
            color="#7c3aed"
          />
          <StatsCard
            icon="📈"
            label="Overall Accuracy"
            value={`${analytics.overallAccuracy}%`}
            color="#34d399"
          />
          <StatsCard
            icon="⏱️"
            label="Avg Time/Question"
            value={`${Math.floor(analytics.avgTimePerQuestion / 60)}:${String(analytics.avgTimePerQuestion % 60).padStart(2, '0')}`}
            color="#60a5fa"
          />
          <StatsCard
            icon="🔥"
            label="Current Streak"
            value={`${analytics.currentStreak} days`}
            color="#fbbf24"
          />
        </div>

        {/* Chapter Breakdown & Recent Tests */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: 24,
        }}>
          <ChapterBreakdown
            chapters={analytics.chapterBreakdown}
            onChapterClick={(chapterId) => router.push(`/the-crucible/${chapterId}`)}
          />
          <RecentTests
            tests={testResults.slice(0, 5) as any}
            chapterMap={chapterMap}
            onRetake={(chapterId) => router.push(`/the-crucible/${chapterId}?mode=test`)}
          />
        </div>

        {/* Performance Insights */}
        {analytics.masteredChapters > 0 && (
          <div style={{
            marginTop: 32,
            padding: 20,
            background: 'rgba(52,211,153,0.1)',
            border: '1px solid rgba(52,211,153,0.2)',
            borderRadius: 16,
          }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>🎓</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#34d399', marginBottom: 4 }}>
              Great Progress!
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
              You've mastered {analytics.masteredChapters} chapter{analytics.masteredChapters !== 1 ? 's' : ''} with 90%+ accuracy. Keep it up!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
