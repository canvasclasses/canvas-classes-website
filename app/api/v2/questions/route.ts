import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import connectToDatabase from '@/lib/mongodb';
import { QuestionV2 } from '@/lib/models/Question.v2';
import { AuditLog } from '@/lib/models/AuditLog';
import { TAXONOMY_FROM_CSV } from '@/app/crucible/admin/taxonomy/taxonomyData_from_csv';
import { z } from 'zod';
import { createServerClient } from '@supabase/ssr';

// Canonical chapter_id → display_id prefix map (single source of truth: taxonomyData_from_csv.ts)
const CHAPTER_PREFIX_MAP: Record<string, string> = {
  ch11_atom: 'ATOM', ch11_bonding: 'BOND', ch11_chem_eq: 'CEQ', ch11_goc: 'GOC',
  ch11_hydrocarbon: 'HC', ch11_ionic_eq: 'IEQ', ch11_mole: 'MOLE', ch11_pblock: 'PB11',
  ch11_periodic: 'PERI', ch11_prac_org: 'POC', ch11_redox: 'RDX', ch11_thermo: 'THERMO',
  ch12_alcohols: 'ALCO', ch12_amines: 'AMIN', ch12_biomolecules: 'BIO',
  ch12_carbonyl: 'ALDO', ch12_coord: 'CORD', ch12_dblock: 'DNF', ch12_electrochem: 'EC',
  ch12_haloalkanes: 'HALO', ch12_kinetics: 'CK', ch12_pblock: 'PB12', ch12_phenols: 'PHEN',
  ch12_salt: 'SALT', ch12_solutions: 'SOL',
};

// Simple in-memory rate limiter (per IP, resets every minute)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 30;       // max requests per window
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

async function getAuthenticatedUser(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // If Supabase is not configured (local dev), treat as authenticated
  if (!supabaseUrl || !supabaseAnonKey) return { id: 'local', email: 'local' };
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: { getAll: () => request.cookies.getAll(), setAll: () => { } },
  });
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Validation schema
const QuestionSchema = z.object({
  display_id: z.string().optional(),
  question_text: z.object({
    markdown: z.string().min(10, 'Question text must be at least 10 characters'),
  }),
  type: z.enum(['SCQ', 'MCQ', 'NVT', 'AR', 'MST', 'MTC']),
  options: z.array(z.object({
    id: z.string(),
    text: z.string(),
    is_correct: z.boolean(),
    asset_ids: z.array(z.string()).optional()
  })).optional(),
  answer: z.object({
    integer_value: z.number().optional(),
    decimal_value: z.number().optional(),
    tolerance: z.number().optional(),
    unit: z.string().optional()
  }).optional(),
  solution: z.object({
    text_markdown: z.string().min(20, 'Solution must be at least 20 characters'),
    asset_ids: z.object({
      images: z.array(z.string()).optional(),
      svg: z.array(z.string()).optional(),
      audio: z.array(z.string()).optional()
    }).optional(),
    video_url: z.string().optional(),
    video_timestamp_start: z.number().optional()
  }),
  metadata: z.object({
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    chapter_id: z.string(),
    tags: z.array(z.object({
      tag_id: z.string(),
      weight: z.number().min(0).max(1)
    })),
    exam_source: z.object({
      exam: z.string(),
      year: z.number().optional(),
      month: z.string().optional(),
      day: z.number().optional(),
      shift: z.string().optional(),
      question_number: z.string().optional()
    }).optional(),
    is_pyq: z.boolean(),
    is_top_pyq: z.boolean()
  }),
  status: z.enum(['draft', 'review', 'published', 'archived']).optional()
});

// GET - Fetch all questions
export async function GET(request: NextRequest) {
  try {
    // Check if request is from an authenticated admin (internal dashboard)
    const user = await getAuthenticatedUser(request);
    // Also treat localhost as authenticated (dev bypass — Supabase may be configured but no session cookie)
    const host = request.headers.get('host') || '';
    const isLocalDev = host.startsWith('localhost') || host.startsWith('127.0.0.1');
    const isAuthenticated = !!user || isLocalDev;

    // Rate limit unauthenticated requests
    if (!isAuthenticated) {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || request.headers.get('x-real-ip')
        || 'unknown';
      if (!checkRateLimit(ip)) {
        return NextResponse.json(
          { success: false, error: 'Too many requests. Please slow down.' },
          { status: 429 }
        );
      }
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const chapter_ids = searchParams.getAll('chapter_id');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const difficulty = searchParams.get('difficulty');
    const is_pyq = searchParams.get('is_pyq');
    const is_top_pyq = searchParams.get('is_top_pyq');
    // Authenticated users (admin dashboard) get full list; public gets max 50
    const requestedLimit = parseInt(searchParams.get('limit') || (isAuthenticated ? '5000' : '50'));
    const limit = isAuthenticated ? requestedLimit : Math.min(requestedLimit, 50); // cap public at 50
    const skip = parseInt(searchParams.get('skip') || '0');

    // Build query
    const query: any = { deleted_at: null };
    if (chapter_ids.length === 1) query['metadata.chapter_id'] = chapter_ids[0];
    else if (chapter_ids.length > 1) query['metadata.chapter_id'] = { $in: chapter_ids };
    if (status) query.status = status;
    if (type) query.type = type;
    if (difficulty) query['metadata.difficulty'] = difficulty;
    if (is_pyq === 'true') query['metadata.is_pyq'] = true;
    if (is_top_pyq === 'true') query['metadata.is_top_pyq'] = true;

    const questions = await QuestionV2.find(query)
      .sort({ created_at: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await QuestionV2.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: questions,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + questions.length < total
      }
    });

  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

// POST - Create new question
export async function POST(request: NextRequest) {
  try {
    // Require authentication (with localhost dev bypass)
    const user = await getAuthenticatedUser(request);
    const host = request.headers.get('host') || '';
    const isLocalDev = host.startsWith('localhost') || host.startsWith('127.0.0.1');
    if (!user && !isLocalDev) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const body = await request.json();

    // Validate input
    const validation = QuestionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Generate UUID
    const questionId = uuidv4();

    // Validate chapter_id against taxonomy (code is the single source of truth)
    const chapterNode = TAXONOMY_FROM_CSV.find(
      n => n.type === 'chapter' && n.id === data.metadata.chapter_id
    );
    if (!chapterNode) {
      return NextResponse.json(
        { success: false, error: `Invalid chapter_id: '${data.metadata.chapter_id}' does not exist in taxonomy` },
        { status: 400 }
      );
    }

    // Resolve display_id: use caller-supplied value, or auto-generate from max existing sequence
    let display_id = (data as any).display_id as string | undefined;

    if (!display_id) {
      const prefix = CHAPTER_PREFIX_MAP[data.metadata.chapter_id]
        ?? data.metadata.chapter_id.split('_').pop()!.toUpperCase().substring(0, 4);

      // Find the highest existing sequence number for this prefix by querying questions_v2
      const lastQ = await QuestionV2.findOne(
        { display_id: { $regex: `^${prefix}-\\d+$` }, deleted_at: null },
        { display_id: 1 }
      ).sort({ display_id: -1 }).lean();

      // Also check soft-deleted to avoid reusing a number
      const lastQAny = await QuestionV2.findOne(
        { display_id: { $regex: `^${prefix}-\\d+$` } },
        { display_id: 1 }
      ).sort({ display_id: -1 }).lean();

      const maxActive  = lastQ    ? parseInt((lastQ    as any).display_id.split('-')[1], 10) : 0;
      const maxAll     = lastQAny ? parseInt((lastQAny as any).display_id.split('-')[1], 10) : 0;
      const nextSeq    = Math.max(maxActive, maxAll) + 1;
      display_id = `${prefix}-${String(nextSeq).padStart(3, '0')}`;
    }

    // Collect all asset IDs
    const asset_ids: string[] = [];
    if (data.solution.asset_ids) {
      if (data.solution.asset_ids.images) asset_ids.push(...data.solution.asset_ids.images);
      if (data.solution.asset_ids.svg) asset_ids.push(...data.solution.asset_ids.svg);
      if (data.solution.asset_ids.audio) asset_ids.push(...data.solution.asset_ids.audio);
    }
    if (data.options) {
      data.options.forEach(opt => {
        if (opt.asset_ids) asset_ids.push(...opt.asset_ids);
      });
    }

    // Create question document
    const questionDoc = {
      _id: questionId,
      display_id,
      question_text: {
        markdown: data.question_text.markdown,
        latex_validated: false
      },
      type: data.type,
      options: data.options || [],
      answer: data.answer,
      solution: {
        text_markdown: data.solution.text_markdown,
        latex_validated: false,
        asset_ids: data.solution.asset_ids,
        video_url: data.solution.video_url,
        video_timestamp_start: data.solution.video_timestamp_start
      },
      metadata: data.metadata,
      status: data.status || 'draft',
      quality_score: 50,
      needs_review: false,
      version: 1,
      created_by: 'admin',
      updated_by: 'admin',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      asset_ids
    };

    // Use insertOne on the raw collection to avoid Mongoose middleware issues
    const col = QuestionV2.collection;
    await col.insertOne(questionDoc as any);

    // Chapter stats in MongoDB are no longer updated — taxonomy is code-based (taxonomyData_from_csv.ts).
    // Stats are computed on-demand by querying questions_v2 directly.

    // Create audit log (non-blocking)
    try {
      await AuditLog.collection.insertOne({
        _id: uuidv4() as any,
        entity_type: 'question',
        entity_id: questionId,
        action: 'create',
        changes: [{
          field: 'question',
          old_value: null,
          new_value: 'Created new question'
        }],
        user_id: 'admin',
        user_email: 'admin@canvasclasses.com',
        timestamp: new Date(),
        can_rollback: false
      });
    } catch (auditErr) {
      console.warn('Audit log creation failed (non-critical):', auditErr);
    }

    return NextResponse.json({
      success: true,
      data: questionDoc,
      message: 'Question created successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create question', detail: error?.message || String(error) },
      { status: 500 }
    );
  }
}
