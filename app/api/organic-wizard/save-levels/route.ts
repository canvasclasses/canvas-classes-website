import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
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
