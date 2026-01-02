import { NextResponse } from 'next/server';
import { fetchLecturesData, getLecturesStats } from '@/app/lib/lecturesData';

export async function GET() {
    try {
        const chapters = await fetchLecturesData();
        const stats = await getLecturesStats();

        return NextResponse.json({
            chapters,
            stats,
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch lectures data' },
            { status: 500 }
        );
    }
}

// Enable ISR - revalidate every hour
export const revalidate = 3600;
