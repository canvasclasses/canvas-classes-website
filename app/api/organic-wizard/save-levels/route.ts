import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { requireAdmin } from '@/lib/bookAuth';

export async function POST(request: NextRequest) {
    const admin = await requireAdmin();
    if (!admin) {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Guard: filesystem writes are not available on serverless (Vercel)
    if (process.env.VERCEL === '1') {
        return NextResponse.json(
            { error: 'Filesystem writes not available in serverless. Migrate to database storage.' },
            { status: 503 }
        );
    }

    try {
        const body = await request.json();
        const { levels } = body;

        if (!levels || !Array.isArray(levels)) {
            return NextResponse.json(
                { error: 'Levels array is required' },
                { status: 400 }
            );
        }

        // Path to the data file
        const dataPath = join(process.cwd(), 'data', 'conversion_game_data.json');

        // Write to file with pretty formatting
        await writeFile(dataPath, JSON.stringify(levels, null, 4));

        return NextResponse.json({
            success: true,
            message: 'Levels saved successfully'
        });

    } catch (error) {
        console.error('Error saving levels:', error);
        return NextResponse.json(
            { error: 'Error saving levels data' },
            { status: 500 }
        );
    }
}
