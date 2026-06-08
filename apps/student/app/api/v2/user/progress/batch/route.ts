import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@canvas/data/db/mongodb';
import { UserProgress, IQuestionAttempt } from '@canvas/data/models/UserProgress';
import { StudentChapterProfile, IStudentChapterProfile } from '@canvas/data/models/StudentChapterProfile';
import { updateProfileFromAttempt, createEmptyProfile } from '@canvas/persona/profile-engine';
import { getUserIdFromRequest } from '@/lib/auth';
import { applyAttemptToProgress, resolveConfidenceTier } from '@canvas/persona/writer';
import { emitLearningEvent } from '@canvas/persona/learning-event';
import { resolveTenantId } from '@canvas/data/tenancy';

// ─── POST /api/v2/user/progress/batch ────────────────────────────────────────
// Body: { attempts: Array<{ question_id, display_id, chapter_id, difficulty,
//                           concept_tags, is_correct, selected_option, source }> }
//
// Batch-records test-mode attempts. Each attempt is funnelled through the
// same `applyAttemptToProgress` helper as the single-attempt route, so the
// tiered counter contract (CRUCIBLE_ARCHITECTURE.md §3.2) has one home.
// A single `progress.save()` runs after the whole loop — N attempts ≠ N writes.
export async function POST(req: NextRequest) {
    try {
        const userId = await getUserIdFromRequest(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { attempts } = body;

        if (!Array.isArray(attempts) || attempts.length === 0) {
            return NextResponse.json({ error: 'Invalid attempts array' }, { status: 400 });
        }

        await connectToDatabase();
        // Resolve tenant once (Phase 3) — stamps a new persona doc, profiles,
        // and every learning event for this batch. Fail-safe to 'public'.
        const tenantId = await resolveTenantId(userId);

        const now = new Date();
        // Retry loop: optimistic concurrency (via __v) detects concurrent
        // modifications. On VersionError we re-read and replay the batch.
        const MAX_RETRIES = 3;
        let totalAttempted = 0;

        for (let retryNum = 0; retryNum <= MAX_RETRIES; retryNum++) {

            let progress = await UserProgress.findById(userId);
            if (!progress) {
                progress = new UserProgress({
                    _id: userId,
                    tenant_id: tenantId,
                    user_email: '',
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

            totalAttempted = 0;

            for (const raw of attempts) {
                const {
                    question_id,
                    display_id,
                    chapter_id,
                    difficulty,
                    concept_tags = [],
                    is_correct,
                    selected_option = null,
                    source = 'test',
                    time_spent_seconds = 0,
                    confidence,
                    session_id,
                } = raw;

                if (!question_id || !chapter_id || is_correct === undefined) {
                    continue; // Skip invalid attempts
                }

                const tier = resolveConfidenceTier(confidence, source);
                if (tier === 'high') totalAttempted += 1;

                const personaAttempt: IQuestionAttempt = {
                    question_id,
                    display_id: display_id ?? String(question_id).slice(0, 8).toUpperCase(),
                    chapter_id,
                    is_correct,
                    time_spent_seconds,
                    attempted_at: now,
                    difficulty: difficulty ?? 'Medium',
                    concept_tags,
                    source,
                    selected_option,
                    confidence: tier,
                    session_id: typeof session_id === 'string' ? session_id : undefined,
                };

                applyAttemptToProgress(progress, personaAttempt);
            }

            try {
                await progress.save();
                break; // success — exit retry loop
            } catch (saveErr: unknown) {
                const isVersionError =
                    saveErr instanceof Error && saveErr.name === 'VersionError';
                if (isVersionError && retryNum < MAX_RETRIES) {
                    continue; // re-read and replay
                }
                throw saveErr;
            }

        } // end retry loop

        // ── Persona unification (audit #5). Mirror HIGH-confidence attempts
        // into StudentChapterProfile so the multi-dimensional persona reflects
        // test signal too — not just guided practice. Grouped by chapter to
        // minimise round-trips (a typical test is single-chapter so this
        // collapses to one fetch + one update). Failure is non-fatal: the
        // primary UserProgress write already succeeded.
        interface ClientAttemptShape {
            question_id?: unknown;
            chapter_id?: unknown;
            is_correct?: unknown;
            confidence?: unknown;
            source?: unknown;
            micro_concept?: unknown;
        }
        try {
            const highByChapter = new Map<string, Array<{
                questionId: string;
                microConcept: string;
                answeredCorrectly: boolean;
                timestamp: Date;
            }>>();
            for (const a of (attempts as ClientAttemptShape[])) {
                const tier = resolveConfidenceTier(
                    a.confidence,
                    typeof a.source === 'string' ? a.source : undefined,
                );
                if (tier !== 'high') continue;
                const cid = typeof a.chapter_id === 'string' ? a.chapter_id : '';
                const qid = typeof a.question_id === 'string' ? a.question_id : '';
                if (!cid || !qid) continue;
                if (!highByChapter.has(cid)) highByChapter.set(cid, []);
                highByChapter.get(cid)!.push({
                    questionId: qid,
                    microConcept: typeof a.micro_concept === 'string' && a.micro_concept ? a.micro_concept : '_untagged',
                    answeredCorrectly: !!a.is_correct,
                    timestamp: now,
                });
            }

            for (const [chapterId, lites] of highByChapter.entries()) {
                for (let p = 0; p <= MAX_RETRIES; p++) {
                    try {
                        let profile = await StudentChapterProfile.findOne({
                            studentId: userId,
                            chapterId,
                        }).lean<IStudentChapterProfile | null>();
                        if (!profile) profile = createEmptyProfile(userId, chapterId, tenantId);
                        let working = profile as IStudentChapterProfile;
                        for (const lite of lites) {
                            working = updateProfileFromAttempt(working, { ...lite, confidence: 'high' });
                        }
                        await StudentChapterProfile.findOneAndUpdate(
                            { studentId: userId, chapterId },
                            { $set: working },
                            { upsert: true, new: true, setDefaultsOnInsert: true },
                        );
                        break;
                    } catch (e: unknown) {
                        if (e instanceof Error && e.name === 'VersionError' && p < MAX_RETRIES) continue;
                        throw e;
                    }
                }
            }
        } catch (profileErr) {
            console.error('[POST /api/v2/user/progress/batch] persona update failed (non-fatal)', profileErr);
        }

        // ── Unified event spine (ADR-011, Phase 1). Emit one immutable
        // learning_event per recorded attempt so a test sitting is visible to
        // the replay spine — the single-attempt + book routes already do this.
        // Fire-and-forget: emitLearningEvent never throws, but we also skip the
        // same invalid attempts the UserProgress loop above skipped, so the
        // event log matches what was actually recorded.
        for (const raw of attempts) {
            const {
                question_id, chapter_id, difficulty, concept_tags = [],
                is_correct, source = 'test', time_spent_seconds = 0,
                confidence, session_id,
            } = raw;
            if (!question_id || !chapter_id || is_correct === undefined) continue;
            void emitLearningEvent({
                user_id: userId, tenant_id: tenantId, surface: 'crucible', verb: 'answered',
                item_id: question_id,
                skill_ids: Array.isArray(concept_tags) ? concept_tags : [],
                correct: !!is_correct,
                difficulty: typeof difficulty === 'number' ? difficulty : undefined,
                duration_ms: typeof time_spent_seconds === 'number' ? time_spent_seconds * 1000 : undefined,
                confidence: resolveConfidenceTier(confidence, typeof source === 'string' ? source : undefined),
                chapter_id,
                session_id: typeof session_id === 'string' ? session_id : undefined,
            });
        }

        return NextResponse.json({
            success: true,
            processed: totalAttempted,
            message: `Saved ${totalAttempted} question attempts`
        });
    } catch (err) {
        console.error('[POST /api/v2/user/progress/batch]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
