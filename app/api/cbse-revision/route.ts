import { NextResponse } from 'next/server';
import { fetchRevisionData } from '@/app/lib/revisionData';

export const revalidate = 86400; // Revalidate every 24 hours

export async function GET() {
    try {
        const chapters = await fetchRevisionData();

        return NextResponse.json({
            chapters,
            stats: {
                totalChapters: chapters.length
            }
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch revision data' },
            { status: 500 }
        );
    }
}
