import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { requireAdmin } from '@/lib/bookAuth';

export async function POST(request: NextRequest) {
    const admin = await requireAdmin();
    if (!admin) {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Guard: local filesystem writes are not available on serverless (Vercel).
    // Audio should be uploaded to R2 via /api/v2/assets/upload instead.
    if (process.env.VERCEL === '1') {
        return NextResponse.json(
            { error: 'Local audio upload not available in serverless. Use /api/v2/assets/upload for R2.' },
            { status: 503 }
        );
    }

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

        // Sanitize filename to prevent path traversal
        const safeName = filename
            .replace(/[/\\]/g, '')      // strip slashes
            .replace(/\.\./g, '')       // strip parent-dir refs
            .replace(/[^a-zA-Z0-9._-]/g, '_')  // whitelist safe chars
            .slice(0, 80);

        if (!safeName) {
            return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
        }

        const finalFilename = safeName.endsWith('.webm') ? safeName : `${safeName}.webm`;

        // Save to public/audio directory
        const publicPath = join(process.cwd(), 'public', 'audio');
        const filePath = join(publicPath, finalFilename);

        // Verify resolved path is still within the target directory
        const resolvedPath = join(publicPath, finalFilename);
        if (!resolvedPath.startsWith(publicPath)) {
            return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
        }

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
