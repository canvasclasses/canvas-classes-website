import 'server-only';
import connectToDatabase from '@canvas/data/db/mongodb';
import LearningEvent, { type ILearningEvent } from '@canvas/data/models/LearningEvent';

/**
 * Emit one immutable learning event to the unified spine (ADR-011, Phase 1).
 *
 * Fire-and-forget: this NEVER throws into a caller's request flow — a failed
 * analytics write must not break a student's practice. Call as
 * `void emitLearningEvent({...})` from any surface that records an interaction.
 */
export type LearningEventInput = Pick<
  ILearningEvent,
  'user_id' | 'surface' | 'verb' | 'item_id' | 'skill_ids'
> &
  Partial<Pick<
    ILearningEvent,
    'tenant_id' | 'correct' | 'score' | 'difficulty' | 'duration_ms' |
    'confidence' | 'chapter_id' | 'book_slug' | 'session_id' | 'ts'
  >>;

export async function emitLearningEvent(input: LearningEventInput): Promise<void> {
  try {
    await connectToDatabase();
    await LearningEvent.create({ ts: new Date(), ...input });
  } catch (err) {
    // Analytics spine is best-effort — log and move on.
    console.error('emitLearningEvent failed (non-fatal):', err);
  }
}
