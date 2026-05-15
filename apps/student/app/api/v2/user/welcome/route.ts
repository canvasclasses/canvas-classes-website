/**
 * GET /api/v2/user/welcome
 *
 * Single aggregator for the personalised "welcome back" dashboard. Returns
 * everything the home screen needs in ONE round-trip so the page feels
 * instant on return visits.
 *
 * Shape is the API contract the dashboard UI is built against. New surfaces
 * (recommendations panel, weak-area widget, streak ring) read off this
 * payload — keep it stable.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import { UserProgress } from '@/lib/models/UserProgress';
import TestResult from '@/lib/models/TestResult';
import { getRecommendations } from '@/lib/recommendationEngine';
import { getTagName } from '@/lib/taxonomyLookup';

export interface WelcomePayload {
  /** First name only — derived from supabase user metadata. */
  greeting_name: string | null;
  /** True for users with no recorded attempts at all. */
  is_first_visit: boolean;
  /** Local-time hour-bucket marker so UI can pick "Good morning"/"evening". */
  greeting_bucket: 'morning' | 'afternoon' | 'evening' | 'night';

  // ── Resume card — "Pick up where you left off" ────────────────────────
  resume: {
    chapter_id: string;
    chapter_name: string;
    last_attempted_at: string;          // ISO timestamp
    recent_correct: number;             // last 10 attempts in this chapter
    recent_total: number;
    deeplink_url: string;               // /the-crucible/<chapter>?mode=browse
  } | null;

  // ── Streak ─────────────────────────────────────────────────────────────
  streak: {
    days: number;
    is_active_today: boolean;
    last_practice_at: string | null;
  };

  // ── Top weak concepts (HIGH-confidence mastery signal only — see
  //    CRUCIBLE_ARCHITECTURE.md §4.2). times_attempted here is the mastery
  //    counter, NOT total exposure. ────────────────────────────────────
  weak_concepts: Array<{
    tag_id: string;
    tag_name: string;
    accuracy_percentage: number;
    times_attempted: number;     // HIGH-confidence count
  }>;

  // ── Exposure summary — counts ALL non-casual concept touches. Drives
  //    "you've explored N topics across M concepts" headline strip. Includes
  //    browse-medium attempts; mastery accuracy intentionally excluded. ──
  exposure_summary: {
    concepts_touched: number;
    total_exposures: number;
  };

  // ── Recent test history (last 3) ──────────────────────────────────────
  recent_tests: Array<{
    chapter_id: string;
    score_percentage: number;
    completed_at: string;
  }>;

  // ── Recommendation engine output (empty for now — bridge in place) ───
  recommendations: Awaited<ReturnType<typeof getRecommendations>>;
}

function greetingBucket(d: Date): WelcomePayload['greeting_bucket'] {
  const h = d.getHours();
  if (h < 5) return 'night';
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  if (h < 21) return 'evening';
  return 'night';
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();

    const progress = await UserProgress.findById(userId)
      .select('user_email recent_attempts chapter_progress concept_mastery stats')
      .lean<{
        user_email?: string;
        recent_attempts?: Array<{
          chapter_id: string;
          is_correct: boolean;
          attempted_at: Date | string;
        }>;
        chapter_progress?: Map<string, { chapter_id: string; last_attempted_at?: Date }> | Record<string, { chapter_id: string; last_attempted_at?: Date }>;
        concept_mastery?: Map<string, { tag_id: string; tag_name?: string; times_attempted: number; times_correct: number; accuracy_percentage: number; exposure_count?: number }> | Record<string, { tag_id: string; tag_name?: string; times_attempted: number; times_correct: number; accuracy_percentage: number; exposure_count?: number }>;
        stats?: { streak_days?: number; last_practice_date?: Date | string };
      }>();

    const isFirstVisit = !progress || (progress.recent_attempts?.length ?? 0) === 0;

    // ── Resume — most-recently attempted chapter ─────────────────────────
    let resume: WelcomePayload['resume'] = null;
    const recent = progress?.recent_attempts ?? [];
    if (recent.length > 0) {
      const lastChapterId = recent[0].chapter_id;
      const inChapter = recent.filter(a => a.chapter_id === lastChapterId).slice(0, 10);
      const correct = inChapter.filter(a => a.is_correct).length;
      resume = {
        chapter_id: lastChapterId,
        chapter_name: getTagName(lastChapterId),
        last_attempted_at: new Date(recent[0].attempted_at).toISOString(),
        recent_correct: correct,
        recent_total: inChapter.length,
        deeplink_url: `/the-crucible/${lastChapterId}?mode=browse`,
      };
    }

    // ── Weak concepts + exposure summary ─────────────────────────────────
    // Weak concepts use the HIGH-confidence MASTERY counters
    // (times_attempted, accuracy_percentage) — see CRUCIBLE_ARCHITECTURE.md
    // §4.2. Browse-mode attempts contribute to exposure_count instead and
    // never inflate the weak-spot widget.
    const conceptMap = progress?.concept_mastery;
    const conceptArr: WelcomePayload['weak_concepts'] = [];
    let conceptsTouched = 0;
    let totalExposures = 0;
    if (conceptMap) {
      const entries = conceptMap instanceof Map ? Array.from(conceptMap.values()) : Object.values(conceptMap);
      for (const c of entries) {
        if (!c) continue;
        const exposure = (c as { exposure_count?: number }).exposure_count ?? c.times_attempted ?? 0;
        if (exposure > 0) {
          conceptsTouched += 1;
          totalExposures += exposure;
        }
        if (c.times_attempted < 3) continue;       // not enough mastery signal
        if (c.accuracy_percentage >= 60) continue; // not weak
        conceptArr.push({
          tag_id: c.tag_id,
          tag_name: c.tag_name ?? getTagName(c.tag_id),
          accuracy_percentage: c.accuracy_percentage,
          times_attempted: c.times_attempted,
        });
      }
      conceptArr.sort((a, b) => a.accuracy_percentage - b.accuracy_percentage);
    }

    // ── Recent tests (last 3) ────────────────────────────────────────────
    const tests = await TestResult
      .find({ user_id: userId })
      .sort({ 'timing.completed_at': -1 })
      .limit(3)
      .select('chapter_id score timing.completed_at')
      .lean<Array<{ chapter_id: string; score?: { percentage?: number }; timing?: { completed_at?: Date | string } }>>();

    const recentTests = tests.map(t => ({
      chapter_id: t.chapter_id,
      score_percentage: t.score?.percentage ?? 0,
      completed_at: t.timing?.completed_at ? new Date(t.timing.completed_at).toISOString() : '',
    }));

    // ── Streak (read-only — fix-pass on the broken increment is in audit #18)
    const lastPractice = progress?.stats?.last_practice_date
      ? new Date(progress.stats.last_practice_date)
      : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isActiveToday = !!lastPractice && lastPractice >= today;

    // ── Recommendations (gates closed → empty) ──────────────────────────
    const recommendations = await getRecommendations(userId, { limit: 5 });

    const payload: WelcomePayload = {
      greeting_name: null,                 // populated below from supabase user
      is_first_visit: isFirstVisit,
      greeting_bucket: greetingBucket(new Date()),
      resume,
      streak: {
        days: progress?.stats?.streak_days ?? 0,
        is_active_today: isActiveToday,
        last_practice_at: lastPractice ? lastPractice.toISOString() : null,
      },
      weak_concepts: conceptArr.slice(0, 3),
      exposure_summary: {
        concepts_touched: conceptsTouched,
        total_exposures: totalExposures,
      },
      recent_tests: recentTests,
      recommendations,
    };

    // Optionally enrich greeting_name from supabase metadata if present
    // (cheap header peek — keeps this route a single network hop).
    const email = progress?.user_email;
    if (email) {
      const local = email.split('@')[0];
      payload.greeting_name = local
        ? local.charAt(0).toUpperCase() + local.slice(1)
        : null;
    }

    return NextResponse.json(payload);
  } catch (err) {
    console.error('[GET /api/v2/user/welcome]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
