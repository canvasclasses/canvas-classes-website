import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 });

  // Only allow fetching from known CDN domains (strict suffix/exact matching)
  let parsed: URL;
  try { parsed = new URL(url); } catch {
    return NextResponse.json({ error: 'Invalid url' }, { status: 400 });
  }
  // Only allow HTTPS to prevent internal network probing
  if (parsed.protocol !== 'https:') {
    return NextResponse.json({ error: 'Only HTTPS URLs allowed' }, { status: 403 });
  }
  const host = parsed.hostname.toLowerCase();
  const isAllowed =
    host.endsWith('.r2.dev') ||
    host.endsWith('.cloudflare.com') ||
    host.endsWith('.cloudflareinsights.com') ||
    host === 'canvasclasses.in' ||
    host.endsWith('.canvasclasses.in') ||
    host.endsWith('.r2.cloudflarestorage.com');
  if (!isAllowed) {
    return NextResponse.json({ error: 'Domain not allowed' }, { status: 403 });
  }

  try {
    // Strip conditional headers — prevents upstream returning 304 with no body
    const upstream = await fetch(url, {
      cache: 'no-store',
      headers: { 'Accept': 'image/svg+xml,*/*' },
    });
    if (!upstream.ok || upstream.status === 304) {
      return NextResponse.json({ error: `Upstream ${upstream.status}` }, { status: 502 });
    }
    const text = await upstream.text();
    return new NextResponse(text, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'no-store, no-cache',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch upstream resource' }, { status: 502 });
  }
}
