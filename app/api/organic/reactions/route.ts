import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'app', 'organic-master', 'reactions.json');
        const fileContent = await fs.readFile(filePath, 'utf8');
        const reactions = JSON.parse(fileContent);
        return NextResponse.json({ success: true, data: reactions });
    } catch (error) {
        console.error('Error reading reactions.json:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to read reactions' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        // Only allow updates in development to avoid production filesystem errors
        if (process.env.NODE_ENV === 'production') {
            return NextResponse.json(
                { success: false, error: 'Not allowed in production environment. Edit locally and push.' },
                { status: 403 }
            );
        }

        const { reactions } = await request.json();

        if (!Array.isArray(reactions)) {
            return NextResponse.json(
                { success: false, error: 'Invalid data format. Expected an array of reactions.' },
                { status: 400 }
            );
        }

        const filePath = path.join(process.cwd(), 'app', 'organic-master', 'reactions.json');
        await fs.writeFile(filePath, JSON.stringify(reactions, null, 2), 'utf8');

        return NextResponse.json({ success: true, message: 'Reactions updated successfully' });
    } catch (error) {
        console.error('Error writing reactions.json:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to write reactions' },
            { status: 500 }
        );
    }
}
