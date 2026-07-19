import { timingSafeEqual } from 'crypto';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { createRateLimiter, getClientIp } from '@canvas/core/rate-limit';

// On-demand ISR invalidation bridge (see _agents/plans/CRUCIBLE_CACHE_SEO_REDESIGN.md).
// revalidatePath() only affects the deployment it runs in, so out-of-deployment
// writers (the admin app's question save paths, /scripts batch tools) call THIS
// endpoint on the student production domain to mark freshly-edited pages stale.
// The rebuild itself happens lazily on each page's next visit.
//
// Secured per CLAUDE.md §8.1: although this route touches no data, every call
// can trigger a paid function render + ISR write downstream — an open version
// of this endpoint is a billing-attack vector, not a harmless cache poke.

// Only page shapes whose content is driven by questions_v2 edits. Extend this
// list deliberately — never accept arbitrary paths.
const ALLOWED_PATHS: RegExp[] = [
  /^\/the-crucible$/,
  /^\/the-crucible\/[A-Za-z0-9_-]{1,64}$/,            // chapter pages (ch11_mole, ...)
  /^\/the-crucible\/q\/[A-Za-z0-9-]{1,128}$/,          // question detail (UUID slugs)
  /^\/jee-main-pyqs(\/chemistry)?$/,
  /^\/jee-main-pyqs\/chemistry\/[A-Za-z0-9_-]{1,64}(\/[A-Za-z0-9_-]{1,160})?$/,
  /^\/chemistry-questions$/,                           // legacy SEO surface, still live
  /^\/chemistry-questions\/[A-Za-z0-9_-]{1,64}(\/[A-Za-z0-9_-]{1,160})?$/,
];

const MAX_PATHS_PER_CALL = 50;

// Callers are our own admin app + operator scripts — 30/min per IP is generous
// while keeping secret brute-forcing impractical.
const revalidateLimiter = createRateLimiter({ max: 30, windowMs: 60_000 });

function secretMatches(provided: string | null): boolean {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  const { ok } = revalidateLimiter.check(getClientIp(request));
  if (!ok) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  if (!process.env.REVALIDATE_SECRET) {
    // Fail closed if the secret was never provisioned in this environment.
    console.error('[revalidate] REVALIDATE_SECRET is not set — endpoint disabled');
    return NextResponse.json({ error: 'Unavailable' }, { status: 503 });
  }

  if (!secretMatches(request.headers.get('x-revalidate-secret'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let paths: unknown;
  try {
    ({ paths } = await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!Array.isArray(paths) || paths.length === 0 || paths.length > MAX_PATHS_PER_CALL) {
    return NextResponse.json(
      { error: `Body must be { paths: string[] } with 1-${MAX_PATHS_PER_CALL} entries` },
      { status: 400 },
    );
  }

  const invalid = paths.filter(
    (p) => typeof p !== 'string' || !ALLOWED_PATHS.some((re) => re.test(p)),
  );
  if (invalid.length > 0) {
    // Caller is already authenticated; naming the rejects aids script debugging.
    return NextResponse.json({ error: 'Paths not allowed', invalid }, { status: 400 });
  }

  for (const path of paths as string[]) {
    revalidatePath(path);
  }

  return NextResponse.json({ revalidated: paths.length });
}
