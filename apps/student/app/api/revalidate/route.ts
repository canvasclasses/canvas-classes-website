import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// PUBLIC: intentionally open — only revalidates cached pages, no sensitive data
export async function POST(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
        return NextResponse.json({ error: 'Missing path param' }, { status: 400 });
    }

    revalidatePath(path);
    return NextResponse.json({ revalidated: true, path });
}
