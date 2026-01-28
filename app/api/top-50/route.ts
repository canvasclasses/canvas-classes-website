import { NextResponse } from 'next/server';
import { fetchTop50Data, getTop50Stats } from '@/app/lib/top50Data';

export async function GET() {
    try {
        const concepts = await fetchTop50Data();
        const stats = await getTop50Stats();

        return NextResponse.json({
            concepts,
            stats,
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch top 50 concepts data' },
            { status: 500 }
        );
    }
}

// Enable ISR - revalidate every 24 hours
export const revalidate = 86400;
