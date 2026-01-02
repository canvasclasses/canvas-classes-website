import { NextResponse } from 'next/server';
import { fetchSamplePapers } from '../../lib/samplePapersData';

export const revalidate = 3600;

export async function GET() {
    try {
        const data = await fetchSamplePapers();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching sample papers:', error);
        return NextResponse.json({ error: 'Failed to fetch sample papers' }, { status: 500 });
    }
}
