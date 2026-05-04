import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import FlashcardProgress, { IFlashcardSRS } from '@/lib/models/FlashcardProgress';
import { getAuthenticatedUser } from '@/lib/auth';

const MAX_BATCH_SIZE = 500;
const MAX_VERSION_RETRIES = 3;

interface FsrsStatePayload {
    due: number;
    stability: number;
    difficulty: number;
    elapsed_days: number;
    scheduled_days: number;
    learning_steps: number;
    reps: number;
    lapses: number;
    state: number;
    last_review?: number;
}

interface CardSRSPayload {
    cardId: string;
    easeFactor: number;
    interval: number;
    repetitions: number;
    nextReviewDate: string;
    lastReviewDate?: string;
    totalReviews?: number;
    correctReviews?: number;
    lapses?: number;
    updatedAt?: number;
    fsrs?: FsrsStatePayload;
}

function validateFsrs(f: unknown): FsrsStatePayload | null {
    if (!f || typeof f !== 'object') return null;
    const o = f as Record<string, unknown>;
    const numeric = ['due', 'stability', 'difficulty', 'elapsed_days', 'scheduled_days', 'reps', 'lapses', 'state'];
    for (const key of numeric) {
        if (typeof o[key] !== 'number' || !isFinite(o[key] as number)) return null;
    }
    return {
        due: o.due as number,
        stability: o.stability as number,
        difficulty: o.difficulty as number,
        elapsed_days: o.elapsed_days as number,
        scheduled_days: o.scheduled_days as number,
        learning_steps: typeof o.learning_steps === 'number' ? o.learning_steps : 0,
        reps: o.reps as number,
        lapses: o.lapses as number,
        state: o.state as number,
        last_review: typeof o.last_review === 'number' ? o.last_review : undefined
    };
}

function validateCard(c: unknown): CardSRSPayload | null {
    if (!c || typeof c !== 'object') return null;
    const o = c as Record<string, unknown>;
    if (typeof o.cardId !== 'string' || o.cardId.length === 0 || o.cardId.length > 200) return null;
    if (typeof o.easeFactor !== 'number' || !isFinite(o.easeFactor)) return null;
    if (typeof o.interval !== 'number' || !isFinite(o.interval) || o.interval < 0) return null;
    if (typeof o.repetitions !== 'number' || !isFinite(o.repetitions) || o.repetitions < 0) return null;
    if (typeof o.nextReviewDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(o.nextReviewDate)) return null;
    let fsrs: FsrsStatePayload | undefined;
    if (o.fsrs !== undefined) {
        const validated = validateFsrs(o.fsrs);
        if (!validated) return null;
        fsrs = validated;
    }
    return {
        cardId: o.cardId,
        easeFactor: Math.min(5, Math.max(1.3, o.easeFactor)),
        interval: Math.min(36500, Math.floor(o.interval)),
        repetitions: Math.min(100000, Math.floor(o.repetitions)),
        nextReviewDate: o.nextReviewDate,
        lastReviewDate: typeof o.lastReviewDate === 'string' && /^(\d{4}-\d{2}-\d{2})?$/.test(o.lastReviewDate) ? o.lastReviewDate : '',
        totalReviews: typeof o.totalReviews === 'number' ? Math.max(0, Math.floor(o.totalReviews)) : 0,
        correctReviews: typeof o.correctReviews === 'number' ? Math.max(0, Math.floor(o.correctReviews)) : 0,
        lapses: typeof o.lapses === 'number' ? Math.max(0, Math.floor(o.lapses)) : 0,
        updatedAt: typeof o.updatedAt === 'number' ? o.updatedAt : 0,
        fsrs
    };
}

interface StreakPayload {
    currentStreak: number;
    longestStreak: number;
    lastStudyDate: string;
    updatedAt: number;
}

function validateStreak(s: unknown): StreakPayload | null {
    if (!s || typeof s !== 'object') return null;
    const o = s as Record<string, unknown>;
    if (typeof o.currentStreak !== 'number' || o.currentStreak < 0) return null;
    if (typeof o.longestStreak !== 'number' || o.longestStreak < 0) return null;
    if (typeof o.lastStudyDate !== 'string' || !/^(\d{4}-\d{2}-\d{2})?$/.test(o.lastStudyDate)) return null;
    if (typeof o.updatedAt !== 'number') return null;
    return {
        currentStreak: Math.min(100000, Math.floor(o.currentStreak)),
        longestStreak: Math.min(100000, Math.floor(o.longestStreak)),
        lastStudyDate: o.lastStudyDate,
        updatedAt: o.updatedAt
    };
}

/**
 * GET — fetch this user's flashcard SRS state. Returns an empty object if the
 * user has no record yet (first-time user).
 */
export async function GET(request: NextRequest) {
    const user = await getAuthenticatedUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await connectToDatabase();
        const doc = await FlashcardProgress.findOne({ user_id: user.id }).lean();
        if (!doc) {
            return NextResponse.json({
                cards: {},
                streak: { currentStreak: 0, longestStreak: 0, lastStudyDate: '', updatedAt: 0 }
            });
        }
        // Map fields don't serialize cleanly via .lean(); convert to plain object.
        const cardsObj: Record<string, IFlashcardSRS> = {};
        if (doc.cards) {
            const cards = doc.cards as unknown as Record<string, IFlashcardSRS> | Map<string, IFlashcardSRS>;
            if (cards instanceof Map) {
                cards.forEach((v, k) => { cardsObj[k] = v; });
            } else {
                Object.assign(cardsObj, cards);
            }
        }
        // Same conversion for metadata.
        const metadataObj: Record<string, unknown> = {};
        if (doc.metadata) {
            const meta = doc.metadata as unknown as Record<string, unknown> | Map<string, unknown>;
            if (meta instanceof Map) {
                meta.forEach((v, k) => { metadataObj[k] = v; });
            } else {
                Object.assign(metadataObj, meta);
            }
        }
        // Settings.perDeck is a Map too.
        let settings = doc.settings ?? null;
        if (settings && settings.perDeck instanceof Map) {
            const perDeckObj: Record<string, unknown> = {};
            settings.perDeck.forEach((v, k) => { perDeckObj[k] = v; });
            settings = { ...settings, perDeck: perDeckObj as unknown as typeof settings.perDeck };
        }

        return NextResponse.json({
            cards: cardsObj,
            metadata: metadataObj,
            streak: doc.streak ?? { currentStreak: 0, longestStreak: 0, lastStudyDate: '', updatedAt: 0 },
            settings,
            history: doc.history ?? []
        });
    } catch (err) {
        console.error('GET /api/v2/user/flashcard-progress failed:', err);
        return NextResponse.json({ error: 'Failed to load progress' }, { status: 500 });
    }
}

/**
 * POST — bulk upsert. Body: { cards?: CardSRSPayload[], streak?: StreakPayload, settings?: { newCardsPerDay?, reviewCardsPerDay? } }
 * Per-card last-write-wins on the updatedAt timestamp; the server will reject
 * an incoming card if its updatedAt is older than what's already stored.
 */
export async function POST(request: NextRequest) {
    const user = await getAuthenticatedUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    if (!body || typeof body !== 'object') {
        return NextResponse.json({ error: 'Body must be an object' }, { status: 400 });
    }

    const b = body as { cards?: unknown; streak?: unknown; settings?: unknown };

    let validatedCards: CardSRSPayload[] = [];
    if (Array.isArray(b.cards)) {
        if (b.cards.length > MAX_BATCH_SIZE) {
            return NextResponse.json({ error: `Batch limit ${MAX_BATCH_SIZE}` }, { status: 400 });
        }
        for (const c of b.cards) {
            const v = validateCard(c);
            if (!v) {
                return NextResponse.json({ error: 'Invalid card payload', cardId: (c as { cardId?: string })?.cardId ?? null }, { status: 400 });
            }
            validatedCards.push(v);
        }
    }

    let validatedStreak: StreakPayload | null = null;
    if (b.streak !== undefined) {
        validatedStreak = validateStreak(b.streak);
        if (!validatedStreak) {
            return NextResponse.json({ error: 'Invalid streak payload' }, { status: 400 });
        }
    }

    let validatedSettings: { newCardsPerDay?: number; reviewCardsPerDay?: number } | null = null;
    if (b.settings !== undefined) {
        if (!b.settings || typeof b.settings !== 'object') {
            return NextResponse.json({ error: 'Invalid settings payload' }, { status: 400 });
        }
        const s = b.settings as Record<string, unknown>;
        validatedSettings = {};
        if (s.newCardsPerDay !== undefined) {
            if (typeof s.newCardsPerDay !== 'number' || s.newCardsPerDay < 0 || s.newCardsPerDay > 1000) {
                return NextResponse.json({ error: 'Invalid newCardsPerDay' }, { status: 400 });
            }
            validatedSettings.newCardsPerDay = Math.floor(s.newCardsPerDay);
        }
        if (s.reviewCardsPerDay !== undefined) {
            if (typeof s.reviewCardsPerDay !== 'number' || s.reviewCardsPerDay < 0 || s.reviewCardsPerDay > 10000) {
                return NextResponse.json({ error: 'Invalid reviewCardsPerDay' }, { status: 400 });
            }
            validatedSettings.reviewCardsPerDay = Math.floor(s.reviewCardsPerDay);
        }
    }

    if (validatedCards.length === 0 && !validatedStreak && !validatedSettings) {
        return NextResponse.json({ error: 'Nothing to save' }, { status: 400 });
    }

    try {
        await connectToDatabase();

        for (let attempt = 0; attempt < MAX_VERSION_RETRIES; attempt++) {
            try {
                let doc = await FlashcardProgress.findOne({ user_id: user.id });
                if (!doc) {
                    doc = new FlashcardProgress({
                        user_id: user.id,
                        user_email: user.email ?? '',
                        cards: new Map(),
                        streak: { currentStreak: 0, longestStreak: 0, lastStudyDate: '', updatedAt: 0 }
                    });
                }

                // Per-card last-write-wins.
                let cardsAccepted = 0;
                let cardsRejected = 0;
                for (const card of validatedCards) {
                    const existing = doc.cards.get(card.cardId);
                    if (existing && (existing.updatedAt ?? 0) > (card.updatedAt ?? 0)) {
                        cardsRejected++;
                        continue;
                    }
                    doc.cards.set(card.cardId, {
                        cardId: card.cardId,
                        easeFactor: card.easeFactor,
                        interval: card.interval,
                        repetitions: card.repetitions,
                        nextReviewDate: card.nextReviewDate,
                        lastReviewDate: card.lastReviewDate ?? '',
                        totalReviews: card.totalReviews ?? 0,
                        correctReviews: card.correctReviews ?? 0,
                        lapses: card.lapses ?? 0,
                        updatedAt: card.updatedAt ?? Date.now(),
                        fsrs: card.fsrs
                    });
                    cardsAccepted++;
                }

                if (validatedStreak) {
                    const existingTs = doc.streak?.updatedAt ?? 0;
                    if (validatedStreak.updatedAt >= existingTs) {
                        doc.streak = validatedStreak;
                    }
                }

                if (validatedSettings) {
                    doc.settings = { ...(doc.settings ?? {}), ...validatedSettings };
                }

                if (!doc.user_email && user.email) doc.user_email = user.email;
                doc.last_synced_at = new Date();

                await doc.save();
                return NextResponse.json({ ok: true, cardsAccepted, cardsRejected });
            } catch (err) {
                const error = err as { name?: string };
                if (error?.name === 'VersionError' && attempt < MAX_VERSION_RETRIES - 1) {
                    continue;
                }
                throw err;
            }
        }

        return NextResponse.json({ error: 'Conflict; please retry' }, { status: 409 });
    } catch (err) {
        console.error('POST /api/v2/user/flashcard-progress failed:', err);
        return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 });
    }
}

/**
 * DELETE — wipe this user's flashcard progress. Used by the "reset all" button.
 */
export async function DELETE(request: NextRequest) {
    const user = await getAuthenticatedUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await connectToDatabase();
        await FlashcardProgress.deleteOne({ user_id: user.id });
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('DELETE /api/v2/user/flashcard-progress failed:', err);
        return NextResponse.json({ error: 'Failed to reset progress' }, { status: 500 });
    }
}
