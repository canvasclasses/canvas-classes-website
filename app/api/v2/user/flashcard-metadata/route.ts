import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import FlashcardProgress, { IFlashcardMetadata } from '@/lib/models/FlashcardProgress';
import { getAuthenticatedUser } from '@/lib/auth';

const MAX_RETRIES = 3;
const MAX_METADATA_ENTRIES = 5000;

function validateMetadata(m: unknown): IFlashcardMetadata | null {
    if (!m || typeof m !== 'object') return null;
    const o = m as Record<string, unknown>;
    if (o.starred !== undefined && typeof o.starred !== 'boolean') return null;
    if (o.suspended !== undefined && typeof o.suspended !== 'boolean') return null;
    if (o.buriedUntil !== undefined && (typeof o.buriedUntil !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(o.buriedUntil))) return null;
    if (o.note !== undefined && (typeof o.note !== 'string' || o.note.length > 1000)) return null;
    if (typeof o.updatedAt !== 'number') return null;
    return {
        starred: o.starred as boolean | undefined,
        suspended: o.suspended as boolean | undefined,
        buriedUntil: o.buriedUntil as string | undefined,
        note: o.note as string | undefined,
        updatedAt: o.updatedAt
    };
}

/**
 * POST — replace this user's full metadata map. Body: { metadata: Record<cardId, CardMetadata> }
 * Per-card last-write-wins on updatedAt.
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

    const b = body as { metadata?: Record<string, unknown> };
    if (!b.metadata || typeof b.metadata !== 'object') {
        return NextResponse.json({ error: 'metadata required' }, { status: 400 });
    }

    const entries = Object.entries(b.metadata);
    if (entries.length > MAX_METADATA_ENTRIES) {
        return NextResponse.json({ error: `metadata limit ${MAX_METADATA_ENTRIES}` }, { status: 400 });
    }

    const validated: Record<string, IFlashcardMetadata> = {};
    for (const [cardId, meta] of entries) {
        if (typeof cardId !== 'string' || cardId.length === 0 || cardId.length > 200) {
            return NextResponse.json({ error: 'Invalid cardId' }, { status: 400 });
        }
        const v = validateMetadata(meta);
        if (!v) {
            return NextResponse.json({ error: 'Invalid metadata payload', cardId }, { status: 400 });
        }
        validated[cardId] = v;
    }

    try {
        await connectToDatabase();
        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            try {
                let doc = await FlashcardProgress.findOne({ user_id: user.id });
                if (!doc) {
                    doc = new FlashcardProgress({
                        user_id: user.id,
                        user_email: user.email ?? '',
                        cards: new Map(),
                        metadata: new Map()
                    });
                }
                Object.entries(validated).forEach(([cardId, meta]) => {
                    const existing = doc!.metadata.get(cardId);
                    if (existing && (existing.updatedAt ?? 0) > meta.updatedAt) return;
                    doc!.metadata.set(cardId, meta);
                });
                await doc.save();
                return NextResponse.json({ ok: true });
            } catch (err) {
                const error = err as { name?: string };
                if (error?.name === 'VersionError' && attempt < MAX_RETRIES - 1) continue;
                throw err;
            }
        }
        return NextResponse.json({ error: 'Conflict; please retry' }, { status: 409 });
    } catch (err) {
        console.error('POST /api/v2/user/flashcard-metadata failed:', err);
        return NextResponse.json({ error: 'Failed to save metadata' }, { status: 500 });
    }
}

/**
 * GET — return this user's metadata map.
 */
export async function GET(request: NextRequest) {
    const user = await getAuthenticatedUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await connectToDatabase();
        const doc = await FlashcardProgress.findOne({ user_id: user.id }).lean();
        if (!doc?.metadata) return NextResponse.json({ metadata: {} });

        const obj: Record<string, IFlashcardMetadata> = {};
        const meta = doc.metadata as unknown as Record<string, IFlashcardMetadata> | Map<string, IFlashcardMetadata>;
        if (meta instanceof Map) {
            meta.forEach((v, k) => { obj[k] = v; });
        } else {
            Object.assign(obj, meta);
        }
        return NextResponse.json({ metadata: obj });
    } catch (err) {
        console.error('GET /api/v2/user/flashcard-metadata failed:', err);
        return NextResponse.json({ error: 'Failed to load metadata' }, { status: 500 });
    }
}
