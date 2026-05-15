import { ITestResult } from '@/lib/models/TestResult';

export interface ChapterStats {
  chapterId: string;
  chapterName: string;
  testsCount: number;
  questionsAttempted: number;
  accuracy: number;
  avgTime: number;
  trend: 'up' | 'down' | 'neutral';
  lastTestDate?: Date;
}

export interface TrendData {
  date: string;
  accuracy: number;
  testsCount: number;
}

export interface DashboardAnalytics {
  totalTests: number;
  totalQuestions: number;
  overallAccuracy: number;
  avgTimePerQuestion: number;
  currentStreak: number;
  longestStreak: number;
  masteredChapters: number;
  performanceTrend: TrendData[];
  chapterBreakdown: ChapterStats[];
}

export function calculateAnalytics(
  testResults: ITestResult[],
  chapterMap: Record<string, string> // chapterId -> chapterName
): DashboardAnalytics {
  if (testResults.length === 0) {
    return {
      totalTests: 0,
      totalQuestions: 0,
      overallAccuracy: 0,
      avgTimePerQuestion: 0,
      currentStreak: 0,
      longestStreak: 0,
      masteredChapters: 0,
      performanceTrend: [],
      chapterBreakdown: [],
    };
  }

  // Sort by date
  const sorted = [...testResults].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  // Calculate overall stats
  const totalTests = testResults.length;
  const totalQuestions = testResults.reduce((sum, t) => sum + t.score.total, 0);
  const totalCorrect = testResults.reduce((sum, t) => sum + t.score.correct, 0);
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  
  const totalTime = testResults.reduce((sum, t) => 
    sum + t.questions.reduce((qSum, q) => qSum + (q.time_spent_seconds || 0), 0), 0
  );
  const avgTimePerQuestion = totalQuestions > 0 ? Math.round(totalTime / totalQuestions) : 0;

  // Calculate streaks
  const { currentStreak, longestStreak } = calculateStreaks(sorted);

  // Calculate chapter breakdown
  const chapterBreakdown = calculateChapterBreakdown(testResults, chapterMap);
  const masteredChapters = chapterBreakdown.filter(c => c.accuracy >= 90).length;

  // Calculate performance trend (last 30 days)
  const performanceTrend = calculatePerformanceTrend(sorted);

  return {
    totalTests,
    totalQuestions,
    overallAccuracy,
    avgTimePerQuestion,
    currentStreak,
    longestStreak,
    masteredChapters,
    performanceTrend,
    chapterBreakdown,
  };
}

function calculateStreaks(sortedTests: ITestResult[]): { currentStreak: number; longestStreak: number } {
  if (sortedTests.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const testDates = sortedTests.map(t => {
    const d = new Date(t.created_at);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  });

  const uniqueDates = [...new Set(testDates)].sort((a, b) => a - b);
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTime = today.getTime();
  const oneDayMs = 24 * 60 * 60 * 1000;

  // Calculate longest streak
  for (let i = 1; i < uniqueDates.length; i++) {
    if (uniqueDates[i] - uniqueDates[i - 1] === oneDayMs) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  // Calculate current streak (working backwards from today)
  const lastTestDate = uniqueDates[uniqueDates.length - 1];
  if (todayTime - lastTestDate <= oneDayMs) {
    currentStreak = 1;
    for (let i = uniqueDates.length - 2; i >= 0; i--) {
      if (uniqueDates[i + 1] - uniqueDates[i] === oneDayMs) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  return { currentStreak, longestStreak };
}

function calculateChapterBreakdown(
  testResults: ITestResult[],
  chapterMap: Record<string, string>
): ChapterStats[] {
  const chapterData: Record<string, {
    tests: ITestResult[];
    totalCorrect: number;
    totalQuestions: number;
    totalTime: number;
  }> = {};

  testResults.forEach(test => {
    const chapterId = test.chapter_id;
    if (!chapterData[chapterId]) {
      chapterData[chapterId] = {
        tests: [],
        totalCorrect: 0,
        totalQuestions: 0,
        totalTime: 0,
      };
    }
    chapterData[chapterId].tests.push(test);
    chapterData[chapterId].totalCorrect += test.score.correct;
    chapterData[chapterId].totalQuestions += test.score.total;
    chapterData[chapterId].totalTime += test.questions.reduce((sum, q) => sum + (q.time_spent_seconds || 0), 0);
  });

  return Object.entries(chapterData).map(([chapterId, data]) => {
    const accuracy = data.totalQuestions > 0 
      ? Math.round((data.totalCorrect / data.totalQuestions) * 100) 
      : 0;
    const avgTime = data.totalQuestions > 0 
      ? Math.round(data.totalTime / data.totalQuestions) 
      : 0;

    // Calculate trend (compare last 2 tests)
    let trend: 'up' | 'down' | 'neutral' = 'neutral';
    if (data.tests.length >= 2) {
      const sorted = data.tests.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const lastAcc = sorted[0].score.percentage;
      const prevAcc = sorted[1].score.percentage;
      if (lastAcc > prevAcc + 5) trend = 'up';
      else if (lastAcc < prevAcc - 5) trend = 'down';
    }

    return {
      chapterId,
      chapterName: chapterMap[chapterId] || chapterId,
      testsCount: data.tests.length,
      questionsAttempted: data.totalQuestions,
      accuracy,
      avgTime,
      trend,
      lastTestDate: data.tests.length > 0 
        ? new Date(data.tests[data.tests.length - 1].created_at) 
        : undefined,
    };
  }).sort((a, b) => b.testsCount - a.testsCount); // Sort by test count
}

function calculatePerformanceTrend(sortedTests: ITestResult[]): TrendData[] {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentTests = sortedTests.filter(t => 
    new Date(t.created_at) >= thirtyDaysAgo
  );

  // Group by week
  const weeklyData: Record<string, { correct: number; total: number; count: number }> = {};

  recentTests.forEach(test => {
    const date = new Date(test.created_at);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
    weekStart.setHours(0, 0, 0, 0);
    const weekKey = weekStart.toISOString().split('T')[0];

    if (!weeklyData[weekKey]) {
      weeklyData[weekKey] = { correct: 0, total: 0, count: 0 };
    }
    weeklyData[weekKey].correct += test.score.correct;
    weeklyData[weekKey].total += test.score.total;
    weeklyData[weekKey].count += 1;
  });

  return Object.entries(weeklyData)
    .map(([date, data]) => ({
      date,
      accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
      testsCount: data.count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

export function getAccuracyColor(accuracy: number): string {
  if (accuracy >= 90) return '#34d399'; // Green - Mastered
  if (accuracy >= 70) return '#fbbf24'; // Yellow - Proficient
  if (accuracy >= 50) return '#fb923c'; // Orange - Learning
  return '#f87171'; // Red - Needs Practice
}

export function getAccuracyLabel(accuracy: number): string {
  if (accuracy >= 90) return 'Mastered';
  if (accuracy >= 70) return 'Proficient';
  if (accuracy >= 50) return 'Learning';
  return 'Needs Practice';
}
