'use server';

import connectToDatabase from '@/lib/mongodb';
import { UserProgress, IQuestionAttempt } from '@/lib/models/UserProgress';
import { revalidatePath } from 'next/cache';

// ============================================
// USER PROGRESS SERVER ACTIONS
// Track practice sessions and generate reports
// ============================================

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

// ============================================
// CORE FUNCTIONS
// ============================================

/**
 * Record a question attempt
 */
export async function recordQuestionAttempt(
  userId: string,
  userEmail: string,
  attempt: {
    question_id: string;
    display_id: string;
    chapter_id: string;
    is_correct: boolean;
    time_spent_seconds: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    concept_tags: string[];
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    await connectToDatabase();

    // Find or create user progress
    let progress = await UserProgress.findById(userId);
    
    if (!progress) {
      progress = new UserProgress({
        _id: userId,
        user_email: userEmail,
        recent_attempts: [],
        chapter_progress: new Map(),
        concept_mastery: new Map(),
        stats: {
          total_questions_attempted: 0,
          total_correct: 0,
          overall_accuracy: 0,
          streak_days: 0,
          favorite_chapters: [],
          weakest_chapters: [],
        },
      });
    }

    // Record the attempt
    const questionAttempt: IQuestionAttempt = {
      ...attempt,
      attempted_at: new Date(),
    };

    await progress.recordAttempt(questionAttempt);

    revalidatePath('/crucible/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error recording attempt:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to record attempt' 
    };
  }
}

/**
 * Get user's progress summary for dashboard
 */
export async function getUserProgressSummary(
  userId: string
): Promise<ProgressSummary | null> {
  try {
    await connectToDatabase();

    const progress = await UserProgress.findById(userId);
    
    if (!progress) {
      return null;
    }

    // Transform chapter progress
    const chaptersProgress: ChapterSummary[] = Array.from(
      progress.chapter_progress.entries() as IterableIterator<[string, any]>
    ).map(([chapterId, data]) => ({
      chapterId,
      chapterName: data.chapter_id,
      attempted: data.total_attempted,
      correct: data.correct_count,
      accuracy: Math.round(data.accuracy_percentage),
      masteryLevel: data.mastery_level,
      lastPracticed: data.last_attempted_at,
    }));

    // Get recent activity
    const recentActivity: RecentActivity[] = progress.recent_attempts
      .slice(0, 10)
      .map((attempt: IQuestionAttempt) => ({
        questionId: attempt.question_id,
        displayId: attempt.display_id,
        chapterId: attempt.chapter_id,
        isCorrect: attempt.is_correct,
        attemptedAt: attempt.attempted_at,
      }));

    // Get weak areas (concepts with < 50% accuracy and > 5 attempts)
    const weakAreas: WeakArea[] = Array.from(
      progress.concept_mastery.entries() as IterableIterator<[string, any]>
    )
      .filter(([_, data]) => data.total_attempted >= 5 && data.accuracy_percentage < 50)
      .map(([tagId, data]) => ({
        tagId,
        tagName: data.tag_name,
        accuracy: Math.round(data.accuracy_percentage),
        attempted: data.total_attempted,
      }))
      .slice(0, 5);

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (progress.stats.streak_days === 0) {
      recommendations.push('Start your practice streak today! Even 10 minutes helps.');
    } else if (progress.stats.streak_days < 3) {
      recommendations.push(`Keep going! You're on a ${progress.stats.streak_days}-day streak.`);
    } else {
      recommendations.push(`Amazing! 🔥 ${progress.stats.streak_days}-day streak!`);
    }

    if (weakAreas.length > 0) {
      recommendations.push(`Focus on: ${weakAreas[0].tagName} - practice more questions in this area.`);
    }

    const lowAccuracyChapters = chaptersProgress.filter(c => c.attempted > 5 && c.accuracy < 60);
    if (lowAccuracyChapters.length > 0) {
      recommendations.push(`Review chapter concepts before attempting more questions.`);
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

/**
 * Get detailed progress for a specific chapter
 */
export async function getChapterProgress(
  userId: string,
  chapterId: string
): Promise<{
  totalAttempted: number;
  correctCount: number;
  accuracy: number;
  masteryLevel: string;
  weakConcepts: string[];
} | null> {
  try {
    await connectToDatabase();

    const progress = await UserProgress.findById(userId);
    if (!progress) return null;

    const chapterData = progress.chapter_progress.get(chapterId);
    if (!chapterData) return null;

    return {
      totalAttempted: chapterData.total_attempted,
      correctCount: chapterData.correct_count,
      accuracy: Math.round(chapterData.accuracy_percentage),
      masteryLevel: chapterData.mastery_level,
      weakConcepts: [], // TODO: Calculate from concept mastery
    };
  } catch (error) {
    console.error('Error fetching chapter progress:', error);
    return null;
  }
}

/**
 * Start a new practice session
 */
export async function startPracticeSession(
  userId: string,
  chapterIds: string[]
): Promise<{ success: boolean; sessionId?: string; error?: string }> {
  try {
    await connectToDatabase();

    const progress = await UserProgress.findById(userId);
    if (!progress) {
      return { success: false, error: 'User progress not found' };
    }

    progress.current_session = {
      started_at: new Date(),
      questions_attempted: 0,
      correct_count: 0,
      chapter_ids: chapterIds,
    };

    await progress.save();

    return { 
      success: true, 
      sessionId: `session_${Date.now()}` 
    };
  } catch (error) {
    console.error('Error starting session:', error);
    return { 
      success: false, 
      error: 'Failed to start session' 
    };
  }
}

/**
 * End current practice session
 */
export async function endPracticeSession(
  userId: string
): Promise<{ success: boolean; summary?: { attempted: number; correct: number; duration: number }; error?: string }> {
  try {
    await connectToDatabase();

    const progress = await UserProgress.findById(userId);
    if (!progress || !progress.current_session) {
      return { success: false, error: 'No active session' };
    }

    const session = progress.current_session;
    const duration = Math.floor(
      (Date.now() - new Date(session.started_at).getTime()) / 1000 / 60
    );

    const summary = {
      attempted: session.questions_attempted,
      correct: session.correct_count,
      duration,
    };

    progress.current_session = null;
    await progress.save();

    revalidatePath('/crucible/dashboard');
    return { success: true, summary };
  } catch (error) {
    console.error('Error ending session:', error);
    return { success: false, error: 'Failed to end session' };
  }
}

/**
 * Get leaderboard data (top users by streak and accuracy)
 */
export async function getLeaderboard(
  limit: number = 10
): Promise<Array<{
  userId: string;
  streakDays: number;
  totalCorrect: number;
  accuracy: number;
}>> {
  try {
    await connectToDatabase();

    const leaders = await UserProgress.find()
      .sort({ 'stats.streak_days': -1, 'stats.overall_accuracy': -1 })
      .limit(limit)
      .select('stats.streak_days stats.total_correct stats.overall_accuracy')
      .lean();

    return leaders.map((user: any) => ({
      userId: user._id,
      streakDays: user.stats.streak_days,
      totalCorrect: user.stats.total_correct,
      accuracy: Math.round(user.stats.overall_accuracy),
    }));
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

/**
 * Reset user progress (for testing or fresh start)
 */
export async function resetUserProgress(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await connectToDatabase();

    await UserProgress.findByIdAndDelete(userId);
    
    revalidatePath('/crucible/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error resetting progress:', error);
    return { success: false, error: 'Failed to reset progress' };
  }
}
