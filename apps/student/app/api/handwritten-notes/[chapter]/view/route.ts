import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@canvas/data/db/mongodb';
import { ChapterView } from '@canvas/data/models/ChapterView';

// PUBLIC: no auth required.
//
// Fire-and-forget view increment for the chapter page trust strip
// ("X students visited this chapter"). The client dedups per session via
// sessionStorage so a reload doesn't double-count. We don't trust the
// client — anyone can POST, but this counter is a UX signal, not billing
// or rate-controlled data, so the noise is acceptable.
//
// Validates the chapter slug pattern so the endpoint can't be used to
// create arbitrary documents in the collection.

const SLUG_PATTERN = /^[a-z][a-z0-9-]{1,60}$/;

export async function POST(
    _request: NextRequest,
    { params }: { params: Promise<{ chapter: string }> }
) {
    try {
        const { chapter } = await params;

        if (!SLUG_PATTERN.test(chapter)) {
            // Generic error — don't echo the bad slug back.
            return NextResponse.json(
                { success: false, error: 'Invalid chapter' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Upsert + atomic increment. Avoids the read-modify-write race that
        // would lose increments under concurrent clients.
        await ChapterView.updateOne(
            { _id: chapter },
            {
                $inc: { count: 1 },
                $set: { updated_at: new Date() },
            },
            { upsert: true }
        );

        // No body needed — client doesn't use the response.
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Error incrementing chapter view counter:', error);
        // Silent failure — never block the page render on a counter hiccup.
        return new NextResponse(null, { status: 204 });
    }
}
