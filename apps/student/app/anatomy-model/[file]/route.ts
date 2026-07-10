import { NextRequest } from 'next/server';

// PUBLIC: no auth required.
// Serves immutable 3D model assets (.glb) from R2 SAME-ORIGIN. three.js loads
// models via fetch/XHR, which the browser blocks cross-origin unless the bucket
// sends CORS headers — R2's public pub-*.r2.dev URL does not. Proxying here makes
// the request same-origin (no CORS), and the immutable cache header means each
// client + the edge fetch it once. (If R2 bucket CORS is later enabled, the
// viewer can point straight at the R2 URL and this route can be removed.)

export const runtime = 'nodejs';

const R2_BASE = 'https://pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev/models/anatomy';
// Whitelist: a bare filename ending in .glb — no slashes, no traversal, fixed host.
const ALLOWED = /^[A-Za-z0-9._-]+\.glb$/;

export async function GET(_req: NextRequest, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!ALLOWED.test(file)) {
    return new Response('Not found', { status: 404 });
  }

  const upstream = await fetch(`${R2_BASE}/${file}`, { cache: 'force-cache' });
  if (!upstream.ok || !upstream.body) {
    return new Response('Not found', { status: 404 });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': 'model/gltf-binary',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
