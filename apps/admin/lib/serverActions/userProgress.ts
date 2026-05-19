'use server';

import connectToDatabase from '@canvas/data/db/mongodb';
import { UserProgress, IQuestionAttempt } from '@canvas/data/models/UserProgress';
import { revalidatePath } from 'next/cache';

// Admin-only server actions for inspecting and resetting student progress.
// Extracted from apps/student/features/crucible/server-actions/progress.ts so
// the admin app doesn't need to reach into student-app server actions across
// the app boundary. The student app keeps its own copy of student-attribution
// helpers (recordQuestionAttempt, getChapterProgress, startPracticeSession,
// etc.) — those stay where they are.

export interface ProgressSummary {
  totalAttempted: number;
  totalCorrect: number;
  overallAccuracy: number;
  streakDays: number;
  chaptersProgress: ChapterSummary[];
  recentActivity: RecentActivity[];
  weakAreas: WeakArea[];
  recommendations: string[];
}

export interface ChapterSummary {
  chapterId: string;
  chapterName: string;
  attempted: number;
  correct: number;
  accuracy: number;
  masteryLevel: string;
  lastPracticed: Date | null;
}

export interface RecentActivity {
  questionId: string;
  displayId: string;
  chapterId: string;
  isCorrect: boolean;
  attemptedAt: Date;
}

export interface WeakArea {
  tagId: string;
  tagName: string;
  accuracy: number;
  attempted: number;
}

export async function getUserProgressSummary(
  userId: string,
): Promise<ProgressSummary | null> {
  try {
    await connectToDatabase();

    const progress = await UserProgress.findById(userId);
    if (!progress) return null;

    const chaptersProgress: ChapterSummary[] = Array.from(
      progress.chapter_progress.entries() as IterableIterator<[string, { chapter_id: string; total_attempted: number; correct_count: number; accuracy_percentage: number; mastery_level: string; last_attempted_at: Date | null }]>
    ).map(([chapterId, data]) => ({
      chapterId,
      chapterName: data.chapter_id,
      attempted: data.total_attempted,
      correct: data.correct_count,
      accuracy: Math.round(data.accuracy_percentage),
      masteryLevel: data.mastery_level,
      lastPracticed: data.last_attempted_at,
    }));

    const recentActivity: RecentActivity[] = progress.recent_attempts
      .slice(0, 10)
      .map((attempt: IQuestionAttempt) => ({
        questionId: attempt.question_id,
        displayId: attempt.display_id,
        chapterId: attempt.chapter_id,
        isCorrect: attempt.is_correct,
        attemptedAt: attempt.attempted_at,
      }));

    const weakAreas: WeakArea[] = Array.from(
      progress.concept_mastery.entries() as IterableIterator<[string, { tag_name: string; total_attempted: number; accuracy_percentage: number }]>
    )
      .filter(([_, data]) => data.total_attempted >= 5 && data.accuracy_percentage < 50)
      .map(([tagId, data]) => ({
        tagId,
        tagName: data.tag_name,
        accuracy: Math.round(data.accuracy_percentage),
        attempted: data.total_attempted,
      }))
      .slice(0, 5);

    const recommendations: string[] = [];
    if (progress.stats.streak_days === 0) {
      recommendations.push('Start your practice streak today! Even 10 minutes helps.');
    } else if (progress.stats.streak_days < 3) {
      recommendations.push(`Keep going! You're on a ${progress.stats.streak_days}-day streak.`);
    } else {
      recommendations.push(`Amazing! ${progress.stats.streak_days}-day streak.`);
    }
    if (weakAreas.length > 0) {
      recommendations.push(`Focus on: ${weakAreas[0].tagName} — practice more questions in this area.`);
    }
    const lowAccuracyChapters = chaptersProgress.filter((c) => c.attempted > 5 && c.accuracy < 60);
    if (lowAccuracyChapters.length > 0) {
      recommendations.push('Review chapter concepts before attempting more questions.');
    }

    return {
      totalAttempted: progress.stats.total_questions_attempted,
      totalCorrect: progress.stats.total_correct,
      overallAccuracy: Math.round(progress.stats.overall_accuracy),
      streakDays: progress.stats.streak_days,
      chaptersProgress: chaptersProgress.sort((a, b) => b.attempted - a.attempted),
      recentActivity,
      weakAreas,
      recommendations,
    };
  } catch (error) {
    console.error('Error fetching progress:', error);
    return null;
  }
}

export async function resetUserProgress(
  userId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await connectToDatabase();
    await UserProgress.findByIdAndDelete(userId);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error resetting progress:', error);
    return { success: false, error: 'Failed to reset progress' };
  }
}
