import { NextResponse } from 'next/server';
import { fetchQuickRecapData, getQuickRecapStats } from '@/app/lib/quickRecapData';

export async function GET() {
    try {
        const videos = await fetchQuickRecapData();
        const stats = await getQuickRecapStats();

        return NextResponse.json({
            videos,
            stats,
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch quick recap data' },
            { status: 500 }
        );
    }
}

// Enable ISR - revalidate every 24 hours
export const revalidate = 86400;
