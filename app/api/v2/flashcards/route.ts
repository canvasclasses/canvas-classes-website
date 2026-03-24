import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Flashcard from '@/lib/models/Flashcard';
import { createClient } from '@/app/utils/supabase/server';

// Rate limiting map (in-memory, simple implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const UNAUTHENTICATED_LIMIT = 30;
const AUTHENTICATED_LIMIT = 300;

function getRateLimitKey(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';
  return ip;
}

function checkRateLimit(key: string, limit: number): boolean {
  const now = Date.now();
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

async function getAuthenticatedUser() {
  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // Local dev mode - bypass auth
    return { id: 'local', email: 'local' };
  }

  try {
    const supabase = await createClient();
    if (!supabase) return null;
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      return { id: session.user.id, email: session.user.email || '' };
    }
    return null;
  } catch (error) {
    console.error('Auth check failed:', error);
    return null;
  }
}

// GET /api/v2/flashcards - Fetch flashcards with optional filters
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Check authentication (bypass on localhost for development)
    const isLocalhost = req.headers.get('host')?.includes('localhost') || req.headers.get('host')?.includes('127.0.0.1');
    const user = await getAuthenticatedUser();
    const isAuthenticated = isLocalhost || !!user;

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
    const filter: any = { deleted_at: null };
    
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

    // Authenticated users: full access
    if (limit_param) {
      query = query.limit(parseInt(limit_param));
    }

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

    // Check authentication and admin (bypass for local development)
    const user = await getAuthenticatedUser();
    const isLocal = user?.id === 'local';
    
    if (!isLocal) {
      if (!user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim());
      if (!adminEmails.includes(user.email)) {
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

  } catch (error: any) {
    console.error('Error creating flashcard:', error);
    
    if (error.code === 11000) {
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
