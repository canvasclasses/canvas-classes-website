import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@canvas/data/db/mongodb';
import FlashcardProgress, { IFlashcardSRS } from '@canvas/data/models/FlashcardProgress';
import { getAuthenticatedUser } from '@/lib/auth';

/**
 * Word Vault SRS state — per-user spaced-repetition progress for Live Books
 * vocabulary. Stored in the same `FlashcardProgress` document as the chemistry
 * flashcard deck, but under the independent `vaultCards` map so the two decks'
 * stats never mix. Structurally mirrors /api/v2/user/flashcard-progress.
 */

// Per-user data — never cache on shared caches.
export const dynamic = 'force-dynamic';
const PRIVATE_NO_STORE = {
  'Cache-Control': 'private, no-store, max-age=0, must-revalidate',
};

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
    last_review: typeof o.last_review === 'number' ? o.last_review : undefined,
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
    fsrs,
  };
}

/** GET — this user's vault SRS state. Empty object for first-time users. */
export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: PRIVATE_NO_STORE });
  }
  try {
    await connectToDatabase();
    const doc = await FlashcardProgress.findOne({ user_id: user.id }).lean();
    const cardsObj: Record<string, IFlashcardSRS> = {};
    if (doc?.vaultCards) {
      const cards = doc.vaultCards as unknown as Record<string, IFlashcardSRS> | Map<string, IFlashcardSRS>;
      if (cards instanceof Map) {
        cards.forEach((v, k) => { cardsObj[k] = v; });
      } else {
        Object.assign(cardsObj, cards);
      }
    }
    return NextResponse.json({ cards: cardsObj }, { headers: PRIVATE_NO_STORE });
  } catch (err) {
    console.error('GET /api/v2/user/word-vault failed:', err);
    return NextResponse.json({ error: 'Failed to load vault' }, { status: 500, headers: PRIVATE_NO_STORE });
  }
}

/**
 * POST — bulk upsert vault cards. Body: { cards: CardSRSPayload[] }.
 * Per-card last-write-wins on `updatedAt`.
 */
export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: PRIVATE_NO_STORE });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers: PRIVATE_NO_STORE });
  }
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Body must be an object' }, { status: 400, headers: PRIVATE_NO_STORE });
  }

  const b = body as { cards?: unknown };
  if (!Array.isArray(b.cards)) {
    return NextResponse.json({ error: 'cards array required' }, { status: 400, headers: PRIVATE_NO_STORE });
  }
  if (b.cards.length === 0) {
    return NextResponse.json({ error: 'Nothing to save' }, { status: 400, headers: PRIVATE_NO_STORE });
  }
  if (b.cards.length > MAX_BATCH_SIZE) {
    return NextResponse.json({ error: `Batch limit ${MAX_BATCH_SIZE}` }, { status: 400, headers: PRIVATE_NO_STORE });
  }

  const validatedCards: CardSRSPayload[] = [];
  for (const c of b.cards) {
    const v = validateCard(c);
    if (!v) {
      return NextResponse.json(
        { error: 'Invalid card payload', cardId: (c as { cardId?: string })?.cardId ?? null },
        { status: 400, headers: PRIVATE_NO_STORE }
      );
    }
    validatedCards.push(v);
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
            vaultCards: new Map(),
          });
        }
        if (!doc.vaultCards) doc.vaultCards = new Map();

        let cardsAccepted = 0;
        let cardsRejected = 0;
        for (const card of validatedCards) {
          const existing = doc.vaultCards.get(card.cardId);
          if (existing && (existing.updatedAt ?? 0) > (card.updatedAt ?? 0)) {
            cardsRejected++;
            continue;
          }
          doc.vaultCards.set(card.cardId, {
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
            fsrs: card.fsrs,
          });
          cardsAccepted++;
        }

        if (!doc.user_email && user.email) doc.user_email = user.email;
        doc.last_synced_at = new Date();

        await doc.save();
        return NextResponse.json({ ok: true, cardsAccepted, cardsRejected }, { headers: PRIVATE_NO_STORE });
      } catch (err) {
        const error = err as { name?: string };
        if (error?.name === 'VersionError' && attempt < MAX_VERSION_RETRIES - 1) continue;
        throw err;
      }
    }
    return NextResponse.json({ error: 'Conflict; please retry' }, { status: 409, headers: PRIVATE_NO_STORE });
  } catch (err) {
    console.error('POST /api/v2/user/word-vault failed:', err);
    return NextResponse.json({ error: 'Failed to save vault' }, { status: 500, headers: PRIVATE_NO_STORE });
  }
}
