import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const filename = formData.get('filename') as string;

        if (!file || !filename) {
            return NextResponse.json(
                { error: 'File and filename are required' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure filename has an extension
        const finalFilename = filename.endsWith('.webm') ? filename : `${filename}.webm`;

        // Save to public/audio directory
        const publicPath = join(process.cwd(), 'public', 'audio');
        const filePath = join(publicPath, finalFilename);

        await writeFile(filePath, buffer);

        // Return the public URL
        const publicUrl = `/audio/${finalFilename}`;

        return NextResponse.json({
            success: true,
            url: publicUrl
        });

    } catch (error) {
        console.error('Error uploading audio:', error);
        return NextResponse.json(
            { error: 'Error uploading file' },
            { status: 500 }
        );
    }
}
