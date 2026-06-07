import 'server-only';
import connectToDatabase from '@canvas/data/db/mongodb';
import { UserProgress, type IQuestionAttempt } from '@canvas/data/models/UserProgress';
import { resolveBookSkill } from '@canvas/data/skills';
import { applyAttemptToProgress } from './writer';
import { emitLearningEvent } from './learning-event';

/**
 * Phase 0b — route a Live Books practice attempt into the ONE unified persona.
 *
 * This is the seam that makes UserProgress.concept_mastery cross-surface. It
 * constructs a valid IQuestionAttempt tagged with the attempt's *global skill
 * id* (from the Skill Graph) and funnels it through the canonical writer
 * `applyAttemptToProgress` — never a direct UserProgress write (CRUCIBLE_
 * ARCHITECTURE.md §9 invariant). Book practice is deliberate practice, so it
 * is HIGH confidence and correctly moves mastery counters.
 *
 * Called fire-and-forget from the Live Books practice POST route, in ADDITION
 * to the existing book_practice_attempts write (dual-write during transition,
 * so the in-book adaptive selector keeps working). It must NEVER throw into the
 * student's practice flow — the route wraps it in .catch().
 *
 * Design: _agents/plans/UNIFIED_LEARNER_PERSONA.md (Layer 4) + ADR-011.
 */

// Parse `class9-english-kaveri` → { subject:'english', grade:9 }.
function parseBookSlug(bookSlug: string): { subject: string; grade: number } | null {
  const m = /^class(\d+)-([a-z]+)/.exec(bookSlug);
  if (!m) return null;
  return { grade: Number(m[1]), subject: m[2] };
}

export interface BookAttemptInput {
  userId: string;
  userEmail?: string;        // used only if a UserProgress doc must be created here
  bookSlug: string;
  chapter: number;
  conceptTag: string;        // 'comprehension' | 'grammar' | ...
  questionId: string;        // e.g. 'ch4-pr-03' / 'ch4-ae-02'
  isCorrect: boolean;
  difficulty?: number;       // 1–5 (Live Books scale; IQuestionAttempt accepts numeric)
  timeMs?: number;
}

const MAX_RETRIES = 3;

export async function recordBookAttempt(input: BookAttemptInput): Promise<void> {
  const meta = parseBookSlug(input.bookSlug);
  if (!meta) return; // unknown slug shape — skip the unified write (pilot scope)

  const subj = meta.subject === 'english' ? 'en' : meta.subject.slice(0, 2);
  const skillId = resolveBookSkill({
    subject: meta.subject, grade: meta.grade, chapter: input.chapter, conceptTag: input.conceptTag,
  });
  const chapterId = `bk:${subj}${meta.grade}:c${input.chapter}`; // book-chapter rollup key (no collision with Crucible ch ids)

  const attempt: IQuestionAttempt = {
    question_id: input.questionId,
    display_id: input.questionId.toUpperCase().slice(0, 16),
    chapter_id: chapterId,
    is_correct: input.isCorrect,
    time_spent_seconds: input.timeMs ? Math.round(input.timeMs / 1000) : 0,
    attempted_at: new Date(),
    difficulty: input.difficulty ?? 3,
    concept_tags: [skillId],
    source: 'book_practice',
    confidence: 'high', // deliberate practice → moves mastery counters
  };

  await connectToDatabase();
  for (let i = 0; i <= MAX_RETRIES; i++) {
    try {
      let progress = await UserProgress.findById(input.userId);
      if (!progress) {
        progress = new UserProgress({
          _id: input.userId,
          // user_email is `required` (non-empty) on the schema. A first-ever
          // book-practice user may have no UserProgress yet, so use a valid
          // placeholder; the writer never overwrites email on existing docs.
          user_email: input.userEmail || `${input.userId}@livebooks.local`,
          recent_attempts: [],
          all_attempted_ids: [],
          starred_questions: [],
          test_sessions: [],
          chapter_progress: new Map(),
          concept_mastery: new Map(),
          stats: {},
          current_session: null,
        });
      }
      applyAttemptToProgress(progress, attempt);
      await progress.save();
      // Emit to the immutable spine (Phase 1) — fire-and-forget.
      void emitLearningEvent({
        user_id: input.userId, surface: 'book', verb: 'answered',
        item_id: input.questionId, skill_ids: [skillId],
        correct: input.isCorrect, difficulty: input.difficulty,
        duration_ms: input.timeMs, confidence: 'high',
        chapter_id: chapterId, book_slug: input.bookSlug,
      });
      return;
    } catch (err) {
      if (err instanceof Error && err.name === 'VersionError' && i < MAX_RETRIES) continue;
      throw err;
    }
  }
}
