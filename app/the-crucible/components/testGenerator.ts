/**
 * Smart Test Generator
 * ─────────────────────────────────────────────────────────────────────────────
 * Implements the scoring + topic-allocation + type-ratio + overlap algorithm
 * described in the Smart Practice Engine plan.
 *
 * Runs entirely client-side — no API calls here.
 * Inputs come from the already-fetched user progress and question list.
 */

import { Question } from './types';

export type DifficultyMix = 'balanced' | 'easy' | 'hard' | 'pyq';

/** Lightweight mirror of IAttemptedIdEntry (returned by the progress API) */
export interface AttemptedEntry {
    question_id: string;
    times_attempted: number;
    times_correct: number;
    last_correct_at?: string; // ISO string from JSON
}

export interface TestGeneratorInput {
    questions: Question[];
    count: number;
    mix: DifficultyMix;
    starredIds?: Set<string>;
    attempted?: AttemptedEntry[];
    /** question_ids from the last 3 tests on this chapter */
    last3Sessions?: string[][];
}

// JEE Main target question-type weights
const TYPE_WEIGHTS: Record<string, number> = {
    SCQ: 0.65,
    NVT: 0.20,
    MCQ: 0.10,
    AR: 0.03,
    MST: 0.01,
    MTC: 0.01,
};

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
}

/**
 * Compute a score for each question. Higher = more likely to be picked.
 */
function scoreQuestion(
    q: Question,
    mix: DifficultyMix,
    attemptedMap: Map<string, AttemptedEntry>,
    starredIds: Set<string>,
    recentSessionIds: Set<string>,
): number {
    let score = 100; // base

    // ── Attempt history bonuses / penalties ──────────────────────────────────
    const entry = attemptedMap.get(q.id);
    if (!entry) {
        score += 80; // unseen — strongly preferred
    } else {
        const gotWrong = entry.times_correct < entry.times_attempted;
        if (gotWrong) score += 60; // seen but failed — needs review

        // Penalise if answered correctly within the last 30 days
        if (entry.last_correct_at) {
            const age = Date.now() - new Date(entry.last_correct_at).getTime();
            if (age < THIRTY_DAYS_MS) score -= 90; // avoid — already mastered recently
        }
    }

    // ── Starred bonus ────────────────────────────────────────────────────────
    if (starredIds.has(q.id)) score += 40;

    // ── Recent session penalty ───────────────────────────────────────────────
    if (recentSessionIds.has(q.id)) score -= 50;

    // ── Difficulty multiplier ────────────────────────────────────────────────
    const diff = q.metadata.difficulty;
    if (mix === 'easy') {
        score *= diff === 'Easy' ? 1.8 : diff === 'Medium' ? 1.2 : 0.3;
    } else if (mix === 'hard') {
        score *= diff === 'Hard' ? 1.8 : diff === 'Medium' ? 1.2 : 0.3;
    } else if (mix === 'pyq') {
        if (!q.metadata.is_pyq) score -= 200; // heavily deprioritise non-PYQs
    }
    // 'balanced' — no multiplier

    return score;
}

/**
 * Main entry point.
 */
export function buildSmartTest({
    questions,
    count,
    mix,
    starredIds = new Set(),
    attempted = [],
    last3Sessions = [],
}: TestGeneratorInput): Question[] {
    if (questions.length === 0) return [];
    const n = Math.min(count, questions.length);

    // ── Pre-build lookup structures ───────────────────────────────────────────
    const attemptedMap = new Map<string, AttemptedEntry>(
        attempted.map(e => [e.question_id, e])
    );
    const recentSessionIds = new Set<string>(last3Sessions.flat());

    // ── Score every question ──────────────────────────────────────────────────
    const scored = questions.map(q => ({
        q,
        score: scoreQuestion(q, mix, attemptedMap, starredIds, recentSessionIds),
    }));

    // ── Group by primary topic tag ────────────────────────────────────────────
    const byTopic = new Map<string, typeof scored>();
    for (const item of scored) {
        const topicId = item.q.metadata.tags?.[0]?.tag_id ?? '__untagged__';
        if (!byTopic.has(topicId)) byTopic.set(topicId, []);
        byTopic.get(topicId)!.push(item);
    }
    // Sort each topic bucket by score descending
    for (const bucket of byTopic.values()) {
        bucket.sort((a, b) => b.score - a.score);
    }

    // ── Topic slot allocation (proportional) ─────────────────────────────────
    const topicIds = [...byTopic.keys()];
    const totalQ = questions.length;
    const slotMap = new Map<string, number>(); // topic → slot count
    let allocated = 0;
    for (const tid of topicIds) {
        const tCount = byTopic.get(tid)!.length;
        const slots = Math.floor(n * (tCount / totalQ));
        slotMap.set(tid, slots);
        allocated += slots;
    }
    // Distribute remaining slots to the largest topics (highest question count)
    const remaining = n - allocated;
    const sortedTopics = [...topicIds].sort(
        (a, b) => byTopic.get(b)!.length - byTopic.get(a)!.length
    );
    for (let i = 0; i < remaining; i++) {
        const tid = sortedTopics[i % sortedTopics.length];
        slotMap.set(tid, (slotMap.get(tid) ?? 0) + 1);
    }

    // ── Pick questions by slot, respecting type ratio ─────────────────────────
    // Compute target counts per type across the whole test
    const typeTargets = new Map<string, number>();
    for (const [type, weight] of Object.entries(TYPE_WEIGHTS)) {
        typeTargets.set(type, Math.round(n * weight));
    }
    const typePicked = new Map<string, number>();

    const selected: Question[] = [];
    const usedIds = new Set<string>();

    // Slot-by-slot pick from each topic
    for (const [tid, slots] of slotMap.entries()) {
        const bucket = byTopic.get(tid)!;
        let filled = 0;
        for (const { q } of bucket) {
            if (filled >= slots) break;
            if (usedIds.has(q.id)) continue;

            // Enforce type quota — skip if that type is already full
            // (but never block if this is the only available question)
            const typeCount = typePicked.get(q.type) ?? 0;
            const typeTarget = typeTargets.get(q.type) ?? 0;
            const typeHasBudget = typeCount < typeTarget;
            const otherQsAvailable = bucket.length - filled > 1;
            if (!typeHasBudget && otherQsAvailable) continue;

            selected.push(q);
            usedIds.add(q.id);
            typePicked.set(q.type, typeCount + 1);
            filled++;
        }
    }

    // ── Fill any shortfall (type quota couldn't be satisfied) ─────────────────
    if (selected.length < n) {
        const remaining = scored
            .filter(({ q }) => !usedIds.has(q.id))
            .sort((a, b) => b.score - a.score);
        for (const { q } of remaining) {
            if (selected.length >= n) break;
            selected.push(q);
        }
    }

    // ── Overlap check — enforce <20% similarity with last 3 sessions ──────────
    for (const sessionIds of last3Sessions) {
        const sessionSet = new Set(sessionIds);
        const overlap = selected.filter(q => sessionSet.has(q.id)).length;
        const overlapPct = overlap / selected.length;
        if (overlapPct > 0.2) {
            // Swap out the lowest-scored overlapping questions with next-best unseen
            const overlapItems = selected
                .map((q, idx) => ({ q, idx, score: scored.find(s => s.q.id === q.id)?.score ?? 0 }))
                .filter(({ q }) => sessionSet.has(q.id))
                .sort((a, b) => a.score - b.score); // worst first

            const unused = scored
                .filter(({ q }) => !usedIds.has(q.id))
                .sort((a, b) => b.score - a.score);

            let unusedPtr = 0;
            for (const { idx } of overlapItems) {
                if (overlapPct <= 0.2 || unusedPtr >= unused.length) break;
                const replacement = unused[unusedPtr++];
                usedIds.delete(selected[idx].id);
                selected[idx] = replacement.q;
                usedIds.add(replacement.q.id);
            }
        }
    }

    // ── Final shuffle ─────────────────────────────────────────────────────────
    return shuffle(selected);
}
