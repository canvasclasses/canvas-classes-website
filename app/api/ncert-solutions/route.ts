import { NextResponse } from 'next/server';
import { fetchNCERTData, getChapterGroups, getNCERTStats } from '@/app/lib/ncertData';

export async function GET() {
    try {
        const questions = await fetchNCERTData();
        const chapters = await getChapterGroups();
        const stats = await getNCERTStats();

        return NextResponse.json({
            questions,
            chapters,
            stats,
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch NCERT solutions data' },
            { status: 500 }
        );
    }
}

// Enable ISR - revalidate every hour
export const revalidate = 3600;
