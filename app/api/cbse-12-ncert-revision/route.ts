import { NextResponse } from 'next/server';
import { fetchRevisionData } from '../../lib/revisionData';

// Revalidate every hour
export const revalidate = 3600;

export async function GET() {
    try {
        const revisionData = await fetchRevisionData();
        return NextResponse.json(revisionData);
    } catch (error) {
        console.error('Error fetching revision data:', error);
        return NextResponse.json({ error: 'Failed to fetch revision data' }, { status: 500 });
    }
}
