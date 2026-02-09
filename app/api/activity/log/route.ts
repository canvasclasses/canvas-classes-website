/**
 * The Crucible - Activity Logger API (MongoDB Edition)
 * 
 * POST /api/activity/log
 * 
 * Records every question attempt to MongoDB ActivityLog collection
 * and updates the UserMastery document in real-time.
 * 
 * HYBRID MODEL:
 * - Auth: Supabase (Gatekeeper)
 * - Data: MongoDB (Brain)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import connectToDatabase from '@/lib/mongodb';
import { Question, ActivityLog, UserMastery, IWeightedTag } from '@/lib/models';

// Types for the request
interface LogActivityRequest {
    questionId: string;
    isCorrect: boolean;
    timeSpentSec: number;
    selectedOptionId?: string;
    enteredAnswer?: string;
    sessionId?: string;
    mode?: 'practice' | 'exam' | 'review' | 'challenge';
}

// Mastery status thresholds
const MASTERY_THRESHOLDS = {
    GREEN: 80,  // ≥80% accuracy = GREEN
    YELLOW: 50, // ≥50% accuracy = YELLOW
    RED: 0      // <50% accuracy = RED
};

export async function POST(request: NextRequest) {
    try {
        // Connect to MongoDB (The Brain)
        const db = await connectToDatabase();
        if (!db) {
            return NextResponse.json(
                { error: 'MongoDB connection failed. Check MONGODB_URI in .env.local' },
                { status: 500 }
            );
        }

        // Check authentication via Supabase (The Gatekeeper)
        const supabase = await createClient();
        let userId = 'anonymous';

        if (supabase) {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                userId = user.id;
            }
        }

        const body: LogActivityRequest = await request.json();
        const {
            questionId,
            isCorrect,
            timeSpentSec,
            selectedOptionId,
            enteredAnswer,
            sessionId = `session_${Date.now()}`,
            mode = 'practice'
        } = body;

        // Validate required fields
        if (!questionId || typeof isCorrect !== 'boolean') {
            return NextResponse.json(
                { error: 'Missing required fields: questionId, isCorrect' },
                { status: 400 }
            );
        }

        // Fetch the question from MongoDB to get its tags
        let question = await Question.findById(questionId).lean();

        if (!question) {
            if (!supabase) {
                return NextResponse.json(
                    { error: 'Content DB unavailable' },
                    { status: 503 }
                );
            }

            // Updated Fallback: Fetch from Supabase (instead of local JSON)
            const { data: supaQuestion, error } = await supabase
                .from('questions')
                .select('*')
                .eq('id', questionId)
                .single();

            if (error || !supaQuestion) {
                return NextResponse.json(
                    { error: `Question not found: ${questionId}` },
                    { status: 404 }
                );
            }

            // Convert Supabase Snake_Case -> MongoDB Schema Format
            // Note: MongoDB 'tags' are weighted, Supabase 'concept_tags' are JSONB
            const conceptTags = supaQuestion.concept_tags || [];

            question = {
                _id: supaQuestion.id,
                tags: conceptTags.map((tag: any) => ({
                    tag_id: tag.tagId || tag.tag_id, // Handle likely variations
                    weight: tag.weight || 1.0
                })),
                meta: {
                    difficulty: supaQuestion.difficulty || 'Medium'
                }
            } as any;
        }

        // Extract tags
        const tagsAffected = question.tags?.map((t: IWeightedTag) => t.tag_id) || [];
        const tagWeights = question.tags || [];

        // Create activity log entry
        const activityLog = new ActivityLog({
            user_id: userId,
            question_id: questionId,
            session_id: sessionId,
            mode: mode,
            selected_option_id: selectedOptionId || null,
            entered_answer: enteredAnswer || null,
            is_correct: isCorrect,
            time_spent_sec: timeSpentSec || 0,
            tags_affected: tagsAffected,
            difficulty: question.meta?.difficulty || 'Medium',
            viewed_solution: false,
            marked_for_review: false,
            flagged_issue: false,
            attempted_at: new Date()
        });

        // Save to MongoDB
        await activityLog.save();

        // Update user's mastery map if logged in
        let masteryUpdates: Record<string, any> = {};

        if (userId !== 'anonymous') {
            // Find or create UserMastery document
            let userMastery = await UserMastery.findById(userId);

            if (!userMastery) {
                userMastery = new UserMastery({
                    _id: userId,
                    mastery_map: new Map(),
                    stats: {
                        total_questions_attempted: 0,
                        total_correct: 0,
                        total_time_spent_sec: 0,
                        current_streak: 0,
                        best_streak: 0
                    },
                    starred_questions: [],
                    mastered_questions: [],
                    notes: new Map()
                });
            }

            // Update mastery for each affected tag
            for (const tagWeight of tagWeights) {
                const tagId = tagWeight.tag_id;
                const weight = tagWeight.weight;

                const current = userMastery.mastery_map.get(tagId) || {
                    accuracy: 0,
                    attempts: 0,
                    correct: 0,
                    status: 'UNRATED',
                    ease_factor: 2.5,
                    interval_days: 1
                };

                // Calculate weighted attempt
                current.attempts += weight;
                if (isCorrect) current.correct += weight;
                current.accuracy = Math.round((current.correct / current.attempts) * 100);
                current.last_attempt = new Date();

                // Determine status
                if (current.attempts < 3) {
                    current.status = 'UNRATED';
                } else if (current.accuracy >= MASTERY_THRESHOLDS.GREEN) {
                    current.status = 'GREEN';
                } else if (current.accuracy >= MASTERY_THRESHOLDS.YELLOW) {
                    current.status = 'YELLOW';
                } else {
                    current.status = 'RED';
                }

                userMastery.mastery_map.set(tagId, current);
                masteryUpdates[tagId] = current;
            }

            // Update aggregate stats
            userMastery.stats.total_questions_attempted += 1;
            if (isCorrect) {
                userMastery.stats.total_correct += 1;
                userMastery.stats.current_streak += 1;
                userMastery.stats.best_streak = Math.max(
                    userMastery.stats.best_streak,
                    userMastery.stats.current_streak
                );
            } else {
                userMastery.stats.current_streak = 0;
            }
            userMastery.stats.total_time_spent_sec += timeSpentSec || 0;
            userMastery.stats.last_session_date = new Date();

            // Save
            await userMastery.save();
        }

        return NextResponse.json({
            success: true,
            logged: {
                question_id: questionId,
                is_correct: isCorrect,
                tags_affected: tagsAffected,
                session_id: sessionId
            },
            masteryUpdates: masteryUpdates,
            message: userId !== 'anonymous'
                ? `Activity logged and mastery updated for ${tagsAffected.length} tags`
                : 'Activity logged (anonymous - no mastery update)'
        });

    } catch (error) {
        console.error('Activity log error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: String(error) },
            { status: 500 }
        );
    }
}

// GET endpoint to fetch user's mastery map from MongoDB
export async function GET(request: NextRequest) {
    try {
        // Connect to MongoDB
        const db = await connectToDatabase();
        if (!db) {
            return NextResponse.json(
                { error: 'MongoDB connection failed' },
                { status: 500 }
            );
        }

        // Get user from Supabase
        const supabase = await createClient();
        if (!supabase) {
            return NextResponse.json(
                { error: 'Authentication service unavailable' },
                { status: 500 }
            );
        }

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Fetch mastery from MongoDB
        const userMastery = await UserMastery.findById(user.id).lean();

        if (!userMastery) {
            return NextResponse.json({
                masteryMap: {},
                stats: {
                    total_questions_attempted: 0,
                    total_correct: 0
                },
                summary: { total: 0, green: 0, yellow: 0, red: 0, unrated: 0 }
            });
        }

        // Convert Map to object for JSON
        const masteryMap = Object.fromEntries(userMastery.mastery_map || new Map());

        // Calculate summary
        const tags = Object.keys(masteryMap);
        const greenTags = tags.filter(t => masteryMap[t].status === 'GREEN').length;
        const yellowTags = tags.filter(t => masteryMap[t].status === 'YELLOW').length;
        const redTags = tags.filter(t => masteryMap[t].status === 'RED').length;
        const unratedTags = tags.filter(t => masteryMap[t].status === 'UNRATED').length;

        return NextResponse.json({
            masteryMap,
            stats: userMastery.stats,
            summary: {
                total: tags.length,
                green: greenTags,
                yellow: yellowTags,
                red: redTags,
                unrated: unratedTags
            }
        });

    } catch (error) {
        console.error('Mastery fetch error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
