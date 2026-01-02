import { NextResponse } from 'next/server';
import { fetch2MinData, get2MinStats } from '@/app/lib/twoMinData';

export async function GET() {
    try {
        const videos = await fetch2MinData();
        const stats = await get2MinStats();

        return NextResponse.json({
            videos,
            stats,
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch 2 minute chemistry data' },
            { status: 500 }
        );
    }
}

// Enable ISR - revalidate every hour
export const revalidate = 3600;
