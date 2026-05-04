import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { UserProgress } from '@/lib/models/UserProgress';
import { StudentChapterProfile, IStudentChapterProfile } from '@/lib/models/StudentChapterProfile';
import { updateProfileFromAttempt, createEmptyProfile } from '@/lib/profileEngine';
import { getUserIdFromRequest } from '@/lib/auth';
import { getTagName } from '@/lib/taxonomyLookup';

// ─── POST /api/v2/user/progress/batch ────────────────────────────────────────
// Body: { attempts: Array<{ question_id, display_id, chapter_id, difficulty, 
//                           concept_tags, is_correct, selected_option, source }> }
// Batch saves multiple question attempts in a single transaction
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

        const now = new Date();
        // Retry loop: optimistic concurrency (via __v) detects concurrent
        // modifications. On VersionError we re-read and replay the batch.
        const MAX_RETRIES = 3;
        let totalAttempted = 0;
        let totalCorrect = 0;

        for (let retryNum = 0; retryNum <= MAX_RETRIES; retryNum++) {

        let progress = await UserProgress.findById(userId);
        if (!progress) {
            progress = new UserProgress({
                _id: userId,
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

        totalCorrect = 0;
        totalAttempted = 0;

        // Process each attempt
        const ALLOWED_CONFIDENCE = ['high', 'medium', 'low'] as const;
        for (const attempt of attempts) {
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
            } = attempt;

            if (!question_id || !chapter_id || is_correct === undefined) {
                continue; // Skip invalid attempts
            }

            // Tier resolution — see CRUCIBLE_ARCHITECTURE.md §3.2.
            const tier: 'high' | 'medium' | 'low' =
                ALLOWED_CONFIDENCE.includes(confidence)
                    ? confidence
                    : (source === 'test' || source === 'guided' ? 'high' : 'medium');
            const countsForMastery = tier === 'high';
            const countsForExposure = tier !== 'low';

            // Aggregate counters drive the global stats update below.
            if (countsForMastery) {
                totalAttempted++;
                if (is_correct) totalCorrect++;
            }

            // Update all_attempted_ids — populated for HIGH-confidence only
            // (mirrors the rule in recordAttempt). Browse-medium and casual
            // attempts must not burn a question for the test generator.
            if (countsForMastery) {
                interface AttemptedIdEntry {
                    question_id: string;
                    chapter_id: string;
                    difficulty?: string;
                    times_attempted?: number;
                    times_correct?: number;
                    last_correct_at?: Date;
                }
                const existingIdx = progress.all_attempted_ids.findIndex(
                    (e: AttemptedIdEntry) => e.question_id === question_id
                );
                if (existingIdx >= 0) {
                    const entry = progress.all_attempted_ids[existingIdx];
                    entry.times_attempted = (entry.times_attempted || 0) + 1;
                    if (is_correct) {
                        entry.times_correct = (entry.times_correct || 0) + 1;
                        entry.last_correct_at = now;
                    }
                } else {
                    progress.all_attempted_ids.push({
                        question_id,
                        chapter_id,
                        difficulty,
                        times_attempted: 1,
                        times_correct: is_correct ? 1 : 0,
                        last_correct_at: is_correct ? now : undefined,
                    });
                }
            }

            // recent_attempts always carries the attempt — drives the audit
            // feed and the reclassifyBrowseSession helper. Capped at 100 here
            // (recordAttempt caps at 200 elsewhere — keep aligned over time).
            progress.recent_attempts.unshift({
                question_id,
                display_id,
                chapter_id,
                difficulty,
                concept_tags,
                is_correct,
                selected_option,
                attempted_at: now,
                source,
                time_spent_seconds,
                confidence: tier,
                session_id: typeof session_id === 'string' ? session_id : undefined,
            });
            if (progress.recent_attempts.length > 100) {
                progress.recent_attempts = progress.recent_attempts.slice(0, 100);
            }

            // concept_mastery — tiered counters. Canonical shape, do not fork.
            // See IConceptMastery in lib/models/UserProgress.ts.
            for (const tagId of concept_tags) {
                if (!tagId) continue;
                const existing = progress.concept_mastery.get(tagId);
                if (existing) {
                    existing.last_attempted_at = now;
                    if (countsForExposure) existing.exposure_count = (existing.exposure_count ?? 0) + 1;
                    if (countsForMastery) {
                        existing.times_attempted = (existing.times_attempted || 0) + 1;
                        if (is_correct) existing.times_correct = (existing.times_correct || 0) + 1;
                        existing.accuracy_percentage = existing.times_attempted > 0
                            ? Math.round((existing.times_correct / existing.times_attempted) * 100)
                            : 0;
                    }
                } else {
                    progress.concept_mastery.set(tagId, {
                        tag_id: tagId,
                        tag_name: getTagName(tagId),
                        times_attempted: countsForMastery ? 1 : 0,
                        times_correct: countsForMastery && is_correct ? 1 : 0,
                        accuracy_percentage: countsForMastery ? (is_correct ? 100 : 0) : 0,
                        exposure_count: countsForExposure ? 1 : 0,
                        last_attempted_at: now,
                    });
                }
            }

            // chapter_progress — HIGH-confidence only, mirroring recordAttempt.
            // Previously OMITTED from the batch route, which meant test-mode
            // attempts never advanced mastery_level (audit, May 2026). Without
            // this update the dashboard's "Proficient/Mastered" chips stay
            // pinned to "Beginner" forever for test-driven users.
            interface ChapterProgressShape {
                chapter_id: string;
                total_attempted: number;
                correct_count: number;
                accuracy_percentage: number;
                last_attempted_at: Date;
                mastery_level: 'Beginner' | 'Learning' | 'Proficient' | 'Mastered';
            }
            if (countsForMastery) {
                const cp: ChapterProgressShape = progress.chapter_progress.get(chapter_id) ?? {
                    chapter_id,
                    total_attempted: 0,
                    correct_count: 0,
                    accuracy_percentage: 0,
                    last_attempted_at: now,
                    mastery_level: 'Beginner',
                };
                cp.total_attempted += 1;
                if (is_correct) cp.correct_count += 1;
                cp.accuracy_percentage = (cp.correct_count / cp.total_attempted) * 100;
                cp.last_attempted_at = now;
                if (cp.total_attempted >= 20 && cp.accuracy_percentage >= 80) cp.mastery_level = 'Mastered';
                else if (cp.total_attempted >= 10 && cp.accuracy_percentage >= 60) cp.mastery_level = 'Proficient';
                else if (cp.total_attempted >= 5) cp.mastery_level = 'Learning';
                progress.chapter_progress.set(chapter_id, cp);
            }
        }

        // Update global stats — only the HIGH-confidence aggregate (totalAttempted
        // / totalCorrect) is summed here, mirroring recordAttempt's tier rules.
        if (!progress.stats) progress.stats = {};
        progress.stats.total_questions_attempted = (progress.stats.total_questions_attempted || 0) + totalAttempted;
        progress.stats.total_correct = (progress.stats.total_correct || 0) + totalCorrect;
        progress.stats.overall_accuracy = progress.stats.total_questions_attempted > 0
            ? Math.round((progress.stats.total_correct / progress.stats.total_questions_attempted) * 100)
            : 0;

        // Update last_practice_date + streak. Was previously written as a
        // phantom `last_activity_at` field that doesn't exist in UserStatsSchema,
        // so the dashboard's streak chip never moved for test-only users.
        const prevPracticeDate = progress.stats.last_practice_date as Date | undefined;
        progress.stats.last_practice_date = now;
        const today = new Date(now); today.setHours(0, 0, 0, 0);
        if (prevPracticeDate) {
            const prev = new Date(prevPracticeDate); prev.setHours(0, 0, 0, 0);
            const daysDiff = Math.round((today.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
            if (daysDiff === 1) progress.stats.streak_days = (progress.stats.streak_days ?? 0) + 1;
            else if (daysDiff > 1) progress.stats.streak_days = 1;
            // daysDiff === 0 → same day, no change
        } else {
            progress.stats.streak_days = 1;
        }

        progress.updated_at = now;

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
                const tier =
                    (a.confidence === 'high' || a.confidence === 'medium' || a.confidence === 'low')
                        ? a.confidence
                        : (a.source === 'test' || a.source === 'guided' ? 'high' : 'medium');
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
                        if (!profile) profile = createEmptyProfile(userId, chapterId);
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
