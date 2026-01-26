import { createClient } from './supabase/client';
import { CardProgress, isCardDue } from '../lib/spacedRepetition';

type FeatureType = 'flashcard' | 'salt_mcq' | 'assertion_reason';

interface ProgressMap {
    [itemId: string]: CardProgress;
}

/**
 * Syncs local progress with Supabase
 * 
 * Strategy:
 * 1. Fetch cloud data
 * 2. Merge with local data 
 *    - If cloud has newer/more advanced progress, use cloud
 *    - If local has newer/more advanced progress, use local
 * 3. Save merged state back to both LocalStorage and Supabase
 */
export async function syncProgressWithCloud(
    featureType: FeatureType,
    localData: ProgressMap
): Promise<ProgressMap> {
    const supabase = createClient();

    // Check if user is logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
        return localData; // No sync if not logged in
    }

    const userId = session.user.id;

    try {
        // 1. Fetch cloud data
        const { data: cloudRecords, error } = await supabase
            .from('user_progress')
            .select('item_id, data, updated_at')
            .eq('user_id', userId)
            .eq('feature_type', featureType);

        if (error) {
            console.error('Error fetching cloud progress:', error);
            return localData;
        }

        const cloudMap: ProgressMap = {};
        cloudRecords?.forEach(record => {
            if (record.data && typeof record.data === 'object') {
                cloudMap[record.item_id] = record.data as CardProgress;
            }
        });

        // 2. Merge Data
        const mergedMap: ProgressMap = { ...localData };
        const updatesToPush: any[] = [];

        // Process cloud items -> Local
        Object.entries(cloudMap).forEach(([itemId, cloudProgress]) => {
            const localProgress = localData[itemId];

            if (!localProgress) {
                // New item from cloud
                mergedMap[itemId] = cloudProgress;
            } else {
                // Conflict resolution: prefer the one with more repetitions or more recent review
                // Simple heuristic: if cloud has more repetitions, it's "better" state
                if (cloudProgress.repetitions > localProgress.repetitions) {
                    mergedMap[itemId] = cloudProgress;
                } else if (cloudProgress.repetitions === localProgress.repetitions) {
                    // If reps are same, check dates. (This is a simplified check)
                    // In a real scenario we might compare 'last_reviewed' timestamps
                    // For now, we assume cloud is source of truth if equal to avoid unnecessary overwrites
                    mergedMap[itemId] = cloudProgress;
                }
            }
        });

        // Identify items that need to be pushed to Cloud (Local is newer or Cloud missed it)
        Object.entries(mergedMap).forEach(([itemId, progress]) => {
            const cloudProgress = cloudMap[itemId];
            const localProgress = localData[itemId];

            // Should upsert if:
            // 1. It's not in cloud yet
            // 2. OR Local version was authoritative and merged into map
            // Note: This logic is slightly simplified. To be robust, we essentially
            // upsert everything in 'mergedMap' that is different from 'cloudMap'.

            const isDifferent = JSON.stringify(progress) !== JSON.stringify(cloudProgress);

            if (isDifferent) {
                updatesToPush.push({
                    user_id: userId,
                    feature_type: featureType,
                    item_id: itemId,
                    data: progress,
                    mastery_level: getMasteryLevelForDb(progress),
                    next_review_at: progress.nextReviewDate ? new Date(progress.nextReviewDate).toISOString() : null,
                    updated_at: new Date().toISOString()
                });
            }
        });

        // 3. Push updates to Supabase
        if (updatesToPush.length > 0) {
            const { error: upsertError } = await supabase
                .from('user_progress')
                .upsert(updatesToPush, { onConflict: 'user_id, feature_type, item_id' });

            if (upsertError) {
                console.error('Error syncing to cloud:', upsertError);
            }
        }

        return mergedMap;

    } catch (err) {
        console.error('Unexpected error during sync:', err);
        return localData;
    }
}

/**
 * Saves a single progress item to Supabase (Optimistic update helper)
 */
export async function saveProgressItemToCloud(
    featureType: FeatureType,
    progress: CardProgress
) {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) return;

    const payload = {
        user_id: session.user.id,
        feature_type: featureType,
        item_id: progress.cardId, // Note: standardizing on 'cardId' property from shared interface
        data: progress,
        mastery_level: getMasteryLevelForDb(progress),
        next_review_at: progress.nextReviewDate ? new Date(progress.nextReviewDate).toISOString() : null,
        updated_at: new Date().toISOString()
    };

    // Fire and forget - don't await to keep UI snappy
    supabase
        .from('user_progress')
        .upsert(payload, { onConflict: 'user_id, feature_type, item_id' })
        .then(({ error }) => {
            if (error) console.error('Failed to save progress item:', error);
        });
}

// Helper to extract mastery level string
function getMasteryLevelForDb(progress: CardProgress): string {
    if (progress.repetitions === 0) return 'new';
    if (progress.interval < 2) return 'learning';
    if (progress.interval < 6) return 'reviewing';
    return 'mastered';
}
