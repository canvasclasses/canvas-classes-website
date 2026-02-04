/**
 * The Crucible - Activity Logger API
 * 
 * POST /api/activity/log
 * 
 * Records every question attempt to the ActivityLog collection
 * and updates the User's mastery_map in real-time.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

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

// Types for question tags (from our migrated schema)
interface WeightedTag {
    tag_id: string;
    weight: number;
}

// Mastery status thresholds
const MASTERY_THRESHOLDS = {
    GREEN: 80,  // ≥80% accuracy = GREEN
    YELLOW: 50, // ≥50% accuracy = YELLOW
    RED: 0      // <50% accuracy = RED
};

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Guard against null supabase client
        if (!supabase) {
            return NextResponse.json(
                { error: 'Database connection failed' },
                { status: 500 }
            );
        }

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            // Allow anonymous logging but without mastery updates
            console.log('Anonymous activity log - mastery not updated');
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

        // Fetch the question to get its tags
        // In production, this would be from MongoDB. For now, we'll use the JSON file.
        const questionsData = await import('@/app/the-crucible/questions.json');
        const questions = questionsData.default as any[];
        const question = questions.find(q => q.id === questionId);

        if (!question) {
            return NextResponse.json(
                { error: `Question not found: ${questionId}` },
                { status: 404 }
            );
        }

        // Extract tags (handle both old and new schema)
        let tagsAffected: string[] = [];
        let tagWeights: WeightedTag[] = [];

        if (question.tags && Array.isArray(question.tags)) {
            // New schema with weighted tags
            tagWeights = question.tags;
            tagsAffected = question.tags.map((t: WeightedTag) => t.tag_id);
        } else if (question.tagId) {
            // Old schema with single tag
            const normalizedTag = 'TAG_' + question.tagId.toUpperCase().replace(/[^A-Z0-9]/g, '_');
            tagsAffected = [normalizedTag];
            tagWeights = [{ tag_id: normalizedTag, weight: 1.0 }];
        }

        // Create activity log entry
        const activityLog = {
            user_id: user?.id || 'anonymous',
            question_id: questionId,
            session_id: sessionId,
            mode: mode,
            selected_option_id: selectedOptionId || null,
            entered_answer: enteredAnswer || null,
            is_correct: isCorrect,
            time_spent_sec: timeSpentSec || 0,
            tags_affected: tagsAffected,
            difficulty: question.difficulty || question.meta?.difficulty || 'Medium',
            viewed_solution: false,
            marked_for_review: false,
            attempted_at: new Date().toISOString()
        };

        // Store in Supabase (activity_logs table)
        const { error: logError } = await supabase
            .from('activity_logs')
            .insert(activityLog);

        if (logError) {
            console.error('Failed to insert activity log:', logError);
            // Don't fail the request - continue to update mastery
        }

        // Update user's mastery_map if logged in
        let masteryUpdates: Record<string, any> = {};

        if (user) {
            // Fetch current user progress
            const { data: userProgress, error: progressError } = await supabase
                .from('user_progress')
                .select('data')
                .eq('user_id', user.id)
                .eq('feature_type', 'mastery_map')
                .eq('item_id', 'global')
                .single();

            // Get current mastery map or create new one
            const currentMastery: Record<string, any> = userProgress?.data || {};

            // Update mastery for each affected tag
            for (const tagWeight of tagWeights) {
                const tagId = tagWeight.tag_id;
                const weight = tagWeight.weight;

                const current = currentMastery[tagId] || {
                    accuracy: 0,
                    attempts: 0,
                    correct: 0,
                    status: 'UNRATED',
                    last_attempt: null
                };

                // Calculate weighted attempt (if a question is 80% Stoichiometry, count as 0.8 attempt)
                const weightedAttempt = weight;
                const weightedCorrect = isCorrect ? weight : 0;

                current.attempts += weightedAttempt;
                current.correct += weightedCorrect;
                current.accuracy = Math.round((current.correct / current.attempts) * 100);
                current.last_attempt = new Date().toISOString();

                // Determine status based on accuracy and minimum attempts
                if (current.attempts < 3) {
                    current.status = 'UNRATED';
                } else if (current.accuracy >= MASTERY_THRESHOLDS.GREEN) {
                    current.status = 'GREEN';
                } else if (current.accuracy >= MASTERY_THRESHOLDS.YELLOW) {
                    current.status = 'YELLOW';
                } else {
                    current.status = 'RED';
                }

                currentMastery[tagId] = current;
                masteryUpdates[tagId] = current;
            }

            // Upsert the mastery map
            const { error: upsertError } = await supabase
                .from('user_progress')
                .upsert({
                    user_id: user.id,
                    feature_type: 'mastery_map',
                    item_id: 'global',
                    data: currentMastery,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id, feature_type, item_id' });

            if (upsertError) {
                console.error('Failed to update mastery map:', upsertError);
            }
        }

        return NextResponse.json({
            success: true,
            logged: activityLog,
            masteryUpdates: masteryUpdates,
            message: user
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

// GET endpoint to fetch user's mastery map
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Guard against null supabase client
        if (!supabase) {
            return NextResponse.json(
                { error: 'Database connection failed' },
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

        // Fetch mastery map
        const { data: userProgress, error } = await supabase
            .from('user_progress')
            .select('data, updated_at')
            .eq('user_id', user.id)
            .eq('feature_type', 'mastery_map')
            .eq('item_id', 'global')
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        const masteryMap = userProgress?.data || {};

        // Calculate summary stats
        const tags = Object.keys(masteryMap);
        const greenTags = tags.filter(t => masteryMap[t].status === 'GREEN').length;
        const yellowTags = tags.filter(t => masteryMap[t].status === 'YELLOW').length;
        const redTags = tags.filter(t => masteryMap[t].status === 'RED').length;
        const unratedTags = tags.filter(t => masteryMap[t].status === 'UNRATED').length;

        return NextResponse.json({
            masteryMap,
            summary: {
                total: tags.length,
                green: greenTags,
                yellow: yellowTags,
                red: redTags,
                unrated: unratedTags
            },
            lastUpdated: userProgress?.updated_at
        });

    } catch (error) {
        console.error('Mastery fetch error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
