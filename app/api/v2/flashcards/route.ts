import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Flashcard from '@/lib/models/Flashcard';
import { getAuthenticatedUser } from '@/lib/auth';
import { isLocalhostDev } from '@/lib/bookAuth';

// In-memory rate limiter with periodic cleanup to prevent memory leaks.
// NOTE: per-instance only — swap for Redis at scale.
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const UNAUTHENTICATED_LIMIT = 30;
const AUTHENTICATED_LIMIT = 300;
const RATE_LIMIT_MAX_ENTRIES = 5000;
let lastCleanup = Date.now();

function getRateLimitKey(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';
  return ip;
}

function checkRateLimit(key: string, limit: number): boolean {
  const now = Date.now();

  // Periodic cleanup: evict expired entries
  if (now - lastCleanup > RATE_LIMIT_WINDOW * 2) {
    for (const [k, v] of rateLimitMap) {
      if (now > v.resetTime) rateLimitMap.delete(k);
    }
    lastCleanup = now;
  }

  if (rateLimitMap.size >= RATE_LIMIT_MAX_ENTRIES && !rateLimitMap.has(key)) {
    return false;
  }

  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

// GET /api/v2/flashcards - Fetch flashcards with optional filters
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Check authentication (safe localhost bypass only)
    const user = await getAuthenticatedUser(req);
    const isAuthenticated = (await isLocalhostDev()) || !!user;

    // Rate limiting
    const rateLimitKey = getRateLimitKey(req);
    const limit = isAuthenticated ? AUTHENTICATED_LIMIT : UNAUTHENTICATED_LIMIT;
    
    if (!checkRateLimit(rateLimitKey, limit)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const chapterId = searchParams.get('chapter_id');
    const chapterName = searchParams.get('chapter');
    const category = searchParams.get('category');
    const topicName = searchParams.get('topic');
    const limit_param = searchParams.get('limit');
    const skip = searchParams.get('skip');

    // Build filter
    const filter: Record<string, unknown> = { deleted_at: null };
    
    if (chapterId) {
      filter['chapter.id'] = chapterId;
    }
    
    if (chapterName) {
      filter['chapter.name'] = chapterName;
    }
    
    if (category) {
      filter['chapter.category'] = category;
    }
    
    if (topicName) {
      filter['topic.name'] = topicName;
    }

    // Query flashcards
    let query = Flashcard.find(filter).sort({ 'metadata.created_at': -1 });

    // Apply pagination
    if (skip) {
      query = query.skip(parseInt(skip));
    }

    // Unauthenticated users: limit to 50 cards, strip answers
    if (!isAuthenticated) {
      query = query.limit(50);
      const flashcards = await query.lean();
      
      // Strip answers for unauthenticated users
      const sanitized = flashcards.map(card => ({
        ...card,
        answer: '🔒 Sign in to view answers',
      }));

      return NextResponse.json({
        flashcards: sanitized,
        total: Math.min(50, sanitized.length),
        authenticated: false,
        message: 'Limited to 50 flashcards. Sign in for full access.',
      });
    }

    // Authenticated users: cap at 1000 per request, default 500 if unspecified
    const requestedLimit = limit_param ? parseInt(limit_param, 10) : 500;
    const safeLimit = Math.min(Number.isFinite(requestedLimit) ? requestedLimit : 500, 1000);
    query = query.limit(safeLimit);

    const flashcards = await query.lean();
    const total = await Flashcard.countDocuments(filter);

    return NextResponse.json({
      flashcards,
      total,
      authenticated: true,
    });

  } catch (error) {
    console.error('Error fetching flashcards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flashcards' },
      { status: 500 }
    );
  }
}

// POST /api/v2/flashcards - Create new flashcard (Admin only)
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // Check authentication and admin (safe localhost bypass only)
    if (!(await isLocalhostDev())) {
      const user = await getAuthenticatedUser(req);
      if (!user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      // SECURITY FIX: Validate ADMIN_EMAILS properly
      const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(e => e.length > 0);
      if (adminEmails.length === 0) {
        console.error('ADMIN_EMAILS not configured');
        return NextResponse.json(
          { error: 'Admin system not configured' },
          { status: 500 }
        );
      }
      
      if (!user.email || !adminEmails.includes(user.email)) {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        );
      }
    }

    const body = await req.json();

    // Validate required fields
    if (!body.flashcard_id || !body.chapter || !body.question || !body.answer) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create flashcard
    const flashcard = await Flashcard.create({
      ...body,
      metadata: {
        ...body.metadata,
        created_at: new Date(),
        updated_at: new Date(),
      },
      deleted_at: null,
    });

    return NextResponse.json({
      success: true,
      flashcard,
    }, { status: 201 });

  } catch (error: unknown) {
    console.error('Error creating flashcard:', error);

    if (error instanceof Error && (error as Error & { code?: number }).code === 11000) {
      return NextResponse.json(
        { error: 'Flashcard ID already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create flashcard' },
      { status: 500 }
    );
  }
}
