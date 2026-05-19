import { NextRequest } from 'next/server';

// Same-origin proxy for handwritten-notes PDFs stored in R2.
// We fetch the public R2 URL (no auth — bucket is public) and forward the
// bytes back from the same origin, so Chrome's PDF viewer + privacy-strict
// browsers (Brave, Safari ITP) don't block cross-origin embedding.
//
// Implementation note: we buffer the response into bytes rather than
// piping a stream. Streaming through the Web ReadableStream → Response
// path was unreliable in dev with `cache: 'force-cache'` (Next.js
// consumed the body for cache storage, leaving an empty stream). The
// buffered approach loads the full PDF into memory for the duration of
// the request — fine for our largest file (~57 MB) on Vercel Pro
// (1 GB function memory). If we ever serve much larger PDFs, switch to
// streaming via `r2Response.body` with `cache: 'no-store'`.

const ALLOWED_PREFIX = 'handwritten-notes/';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> },
) {
    const { path } = await params;

    // Strict whitelist — only handwritten-notes/* is reachable; reject
    // path-traversal attempts up front.
    const joined = path.map((seg) => decodeURIComponent(seg)).join('/');
    if (!joined || joined.includes('..') || joined.startsWith('/')) {
        return new Response('Not found', { status: 404 });
    }

    const r2Base = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '');
    if (!r2Base) {
        console.error('[notes-proxy] R2_PUBLIC_URL not set');
        return new Response('Storage not configured', { status: 500 });
    }
    const r2Url = `${r2Base}/${ALLOWED_PREFIX}${joined}`;

    // Forward Range so the browser's PDF viewer can request specific byte
    // ranges (some viewers do this for fast first-page render).
    const range = req.headers.get('range');
    const upstreamHeaders: HeadersInit = {};
    if (range) upstreamHeaders['Range'] = range;

    let r2Response: Response;
    try {
        r2Response = await fetch(r2Url, {
            headers: upstreamHeaders,
            cache: 'no-store',
        });
    } catch (err) {
        console.error('[notes-proxy] fetch error:', joined, err);
        return new Response('Upstream error', { status: 502 });
    }

    if (!r2Response.ok && r2Response.status !== 206) {
        console.warn('[notes-proxy] upstream', r2Response.status, joined);
        return new Response('Not found', { status: r2Response.status });
    }

    // Buffer the body so we can return a clean Response with our own headers.
    let bytes: ArrayBuffer;
    try {
        bytes = await r2Response.arrayBuffer();
    } catch (err) {
        console.error('[notes-proxy] body read failed:', joined, err);
        return new Response('Upstream stream error', { status: 502 });
    }

    const headers = new Headers({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Accept-Ranges': 'bytes',
    });
    const cr = r2Response.headers.get('content-range');
    if (cr) headers.set('Content-Range', cr);
    const etag = r2Response.headers.get('etag');
    if (etag) headers.set('ETag', etag);

    return new Response(bytes, {
        status: r2Response.status,
        headers,
    });
}

export async function HEAD(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> },
) {
    const res = await GET(req, { params });
    return new Response(null, { status: res.status, headers: res.headers });
}
