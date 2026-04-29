import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { unstable_cache, revalidateTag } from 'next/cache';
import connectToDatabase from '@/lib/mongodb';
import { QuestionV2 } from '@/lib/models/Question.v2';
import { AuditLog } from '@/lib/models/AuditLog';
import { trackServer } from '@/lib/analytics/mixpanel.server';
import { TAXONOMY_FROM_CSV } from '@/app/crucible/admin/taxonomy/taxonomyData_from_csv';
import { z } from 'zod';
import { getAuthenticatedUser } from '@/lib/auth';
import { getUserPermissions, getQuestionFilter, canEditQuestion, getSubjectFromChapterId } from '@/lib/rbac';
import { isLocalhostDev } from '@/lib/bookAuth';

// Mongo projection: when excludeSolutions=true, skip the heavy solution fields.
// solution.text_markdown alone is often 1.5–3 KB per question; on a 500-Q chapter
// this saves ~1MB of payload per fetch. video_url + asset_ids are also dropped —
// they're only needed when the user actually expands the solution card.
const PROJECTION_NO_SOLUTIONS = {
  'solution.text_markdown': 0,
  'solution.markdown': 0,
  'solution.video_url': 0,
  'solution.asset_ids': 0,
  'solution.video_timestamp_start': 0,
};

// Cached chapter-question fetcher. Public student traffic (which is the only path
// that hits this) is deterministic by these params, so identical chapters served
// to multiple users come from Next.js's data cache instead of MongoDB.
//
// Cache is invalidated by `revalidateTag('questions')` when admins create/edit/
// delete questions. 1-hour fallback ensures eventual consistency if a tag bust
// is ever missed.
const getCachedChapterQuestions = unstable_cache(
  async (
    chapterId: string,
    examBoard: string | null,
    isTopPYQ: boolean,
    excludeSolutions: boolean,
    skip: number,
    limit: number,
  ) => {
    await connectToDatabase();
    const filter: Record<string, unknown> = {
      'metadata.chapter_id': chapterId,
      deleted_at: null,
    };
    if (examBoard) filter['metadata.applicableExams'] = examBoard;
    if (isTopPYQ) filter['metadata.is_top_pyq'] = true;

    const projection = excludeSolutions ? PROJECTION_NO_SOLUTIONS : {};

    const [total, docs] = await Promise.all([
      QuestionV2.countDocuments(filter),
      QuestionV2.find(filter, projection)
        .sort({ display_id: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    return { total, docs };
  },
  ['v2-chapter-questions-cached'],
  { revalidate: 3600, tags: ['questions'] }
);

// Cached batch-by-ID fetcher for lazy solution loading. Same cache invalidation
// rules. Up to 50 IDs per call.
const getCachedQuestionsByIds = unstable_cache(
  async (idsKey: string) => {
    await connectToDatabase();
    const ids = idsKey.split(',').filter(Boolean);
    const docs = await QuestionV2.find({ _id: { $in: ids }, deleted_at: null }).lean();
    return docs;
  },
  ['v2-questions-by-ids'],
  { revalidate: 3600, tags: ['questions'] }
);

// Canonical chapter_id → display_id prefix map (single source of truth: taxonomyData_from_csv.ts)
const CHAPTER_PREFIX_MAP: Record<string, string> = {
  // ── Chemistry (Class 11) ──
  ch11_atom: 'ATOM', ch11_bonding: 'BOND', ch11_chem_eq: 'CEQ', ch11_goc: 'GOC',
  ch11_hydrocarbon: 'HC', ch11_ionic_eq: 'IEQ', ch11_mole: 'MOLE', ch11_pblock: 'PB11',
  ch11_periodic: 'PERI', ch11_prac_org: 'POC', ch11_redox: 'RDX', ch11_thermo: 'THERMO',
  // ── Chemistry (Class 12) ──
  ch12_alcohols: 'ALCO', ch12_amines: 'AMIN', ch12_biomolecules: 'BIO',
  ch12_carbonyl: 'ALDO', ch12_coord: 'CORD', ch12_dblock: 'DNF', ch12_electrochem: 'EC',
  ch12_haloalkanes: 'HALO', ch12_kinetics: 'CK', ch12_pblock: 'PB12',
  ch12_salt: 'SALT', ch12_solutions: 'SOL',
  // ── Physics (Class 11) ──
  ph11_units: 'UNIT', ph11_kinematics1d: 'K1D', ph11_kinematics2d: 'K2D',
  ph11_nlm: 'NLM', ph11_wep: 'WEP', ph11_com_mom: 'COM', ph11_rotation: 'ROT',
  ph11_gravitation: 'GRAV', ph11_matter: 'MATT', ph11_thermo_phy: 'PHTH',
  ph11_shm: 'SHM', ph11_waves: 'WAVE',
  // ── Physics (Class 12) ──
  ph12_electrostatics: 'ELST', ph12_current: 'CURR', ph12_magnetism: 'MAG',
  ph12_emi: 'EMI', ph12_ac: 'ACE', ph12_ray_optics: 'ROPY',
  ph12_wave_optics: 'WVOP', ph12_modern: 'MOD', ph12_semiconductors: 'SEMI',
  // ── Mathematics (Competitive Syllabus) ──
  ma_basic_math: 'BOMA', ma_quadratic: 'QUAD', ma_complex: 'CMPL',
  ma_sequence: 'SQSR', ma_pnc: 'PMCM', ma_binomial: 'BNML',
  ma_reasoning: 'MRES', ma_statistics: 'STAT', ma_matrices: 'MTRX',
  ma_determinants: 'DTRM', ma_probability: 'PROB', ma_sets_rel: 'STRL',
  ma_functions: 'FUNC', ma_limits: 'LIMS', ma_continuity_diff: 'CTDF',
  ma_differentiation: 'DIFF', ma_aod: 'AODV', ma_indef_int: 'ININ',
  ma_def_int: 'DFIN', ma_auc: 'AUC', ma_diff_eq: 'DFEQ',
  ma_straight_lines: 'STLN', ma_circle: 'CRCL', ma_parabola: 'PRBL',
  ma_ellipse: 'ELPS', ma_hyperbola: 'HYPB', ma_trig_ratios: 'TRRI',
  ma_trig_eq: 'TREQ', ma_itf: 'ITF', ma_height_dist: 'HTDT',
  ma_triangle_prop: 'PRTR', ma_vector_algebra: 'VCAL', ma_3d_geom: 'TDGM',
};

// Simple in-memory rate limiter (per IP, resets every minute).
// NOTE: in a multi-instance deployment each instance has its own map, so
// effective limits are per-instance. For production at scale, swap for
// Redis-based rate limiting (e.g. Upstash @upstash/ratelimit).
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 30;           // max requests per window
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_ENTRIES = 5000; // cap map size to prevent memory leaks
let lastCleanup = Date.now();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();

  // Periodic cleanup: evict expired entries every 2 minutes to prevent
  // unbounded memory growth from unique IPs.
  if (now - lastCleanup > RATE_LIMIT_WINDOW_MS * 2) {
    for (const [key, val] of rateLimitMap) {
      if (now > val.resetAt) rateLimitMap.delete(key);
    }
    lastCleanup = now;
  }

  // Hard cap: if map is still huge after cleanup, reject unknown IPs
  if (rateLimitMap.size >= RATE_LIMIT_MAX_ENTRIES && !rateLimitMap.has(ip)) {
    return false;
  }

  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

/**
 * Atomically generates the next display_id for a given prefix.
 * Queries both active and soft-deleted questions to find the current max,
 * then returns the next sequence. Callers must retry on duplicate key error.
 */
async function generateNextDisplayId(prefix: string): Promise<string> {
  // Single query covering all documents (active + deleted) to find true max
  const lastQ = await QuestionV2.findOne(
    { display_id: { $regex: `^${prefix}-\\d+$` } },
    { display_id: 1 }
  ).sort({ display_id: -1 }).lean();

  const maxSeq = lastQ
    ? parseInt(((lastQ as Record<string, unknown>).display_id as string).split('-')[1], 10)
    : 0;
  return `${prefix}-${String(maxSeq + 1).padStart(3, '0')}`;
}

// Validation schema
const QuestionSchema = z.object({
  display_id: z.string().optional(),
  question_text: z.object({
    markdown: z.string().min(10, 'Question text must be at least 10 characters'),
  }),
  type: z.enum(['SCQ', 'MCQ', 'NVT', 'AR', 'MST', 'MTC', 'SUBJ']),
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
    difficultyLevel: z.number().min(1).max(5).default(3),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(), // DEPRECATED: kept for backward compat
    chapter_id: z.string(),
    subject: z.enum(['chemistry', 'physics', 'maths', 'biology']).optional(),
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
    // 3-tier exam taxonomy
    applicableExams: z
      .array(z.enum(['JEE', 'NEET', 'CBSE', 'State_Board', 'BITSAT', 'OLYMPIAD']))
      .min(1)
      .optional(),
    examBoard: z.enum(['JEE', 'NEET', 'CBSE', 'State_Board', 'BITSAT', 'OLYMPIAD']).optional(),
    sourceType: z.enum(['PYQ', 'NCERT_Textbook', 'NCERT_Exemplar', 'Practice', 'Mock']).optional(),
    examDetails: z.object({
      exam: z.enum(['JEE_Main', 'JEE_Advanced', 'NEET_UG', 'NEET_PG']).optional(),
      year: z.number().optional(),
      month: z.string().optional(),
      phase: z.string().optional(),
      shift: z.string().optional(),
      paper: z.string().optional(),
      question_number: z.string().optional(),
    }).optional(),
    is_pyq: z.boolean(),
    is_top_pyq: z.boolean()
  }),
  status: z.enum(['draft', 'review', 'published', 'archived']).optional()
});

// GET - Fetch all questions
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    const isLocalDev = await isLocalhostDev();
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

    const { searchParams } = new URL(request.url);
    const chapter_ids = searchParams.getAll('chapter_id');
    const subject = searchParams.get('subject');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const difficulty = searchParams.get('difficulty');
    const is_pyq = searchParams.get('is_pyq');
    const is_top_pyq = searchParams.get('is_top_pyq');
    const exam_level = searchParams.get('exam_level');
    const year = searchParams.get('year');
    const tag_id = searchParams.get('tag_id');
    const searchTerm = searchParams.get('search');
    const isCountOnly = searchParams.get('countOnly') === 'true';
    // NEW: Exam taxonomy filters
    const examBoard = searchParams.get('examBoard');
    const sourceType = searchParams.get('sourceType');
    const exam = searchParams.get('exam');
    // Field projection + batch-by-ID lookup (for lazy solution loading)
    const excludeSolutions = searchParams.get('excludeSolutions') === 'true';
    const idsParam = searchParams.get('ids');

    // Authenticated users (admin dashboard) get full list (unless counting); public gets max 50
    const requestedLimit = parseInt(searchParams.get('limit') || (isAuthenticated ? '5000' : '50'));
    const limit = isAuthenticated && !isCountOnly ? requestedLimit : Math.min(requestedLimit, 50); // cap public at 50
    const skip = parseInt(searchParams.get('skip') || '0');

    // ── Fast path A: batch fetch by IDs (used for lazy solution loading) ───────
    // Cache hit on these is huge: every page navigation in Browse mode that asks
    // for the same 15 solutions skips Mongo entirely.
    if (idsParam) {
      const ids = idsParam.split(',').map(s => s.trim()).filter(Boolean).slice(0, 50);
      if (ids.length === 0) {
        return NextResponse.json({ success: true, data: [], pagination: { total: 0, limit: 0, skip: 0, hasMore: false } });
      }
      const docs = await getCachedQuestionsByIds(ids.sort().join(','));
      return NextResponse.json({
        success: true,
        data: docs,
        pagination: { total: docs.length, limit: docs.length, skip: 0, hasMore: false },
      });
    }

    // ── Fast path B: simple chapter fetch (cached) ────────────────────────────
    // Single-chapter reads with no cross-cutting filters go through unstable_cache
    // (1-hour TTL, busted by `revalidateTag('questions')` on every write path —
    // POST/PATCH/DELETE in this file plus reclassify and flag/unflag routes).
    //
    // SECURITY: the cache key does NOT include the user's email — it would
    // explode cardinality and defeat the cache. RBAC is therefore enforced
    // *before* serving cached data: admins restricted to certain subjects get
    // an empty result for chapters they can't access. This matches the slow
    // path's behavior (which AND's `chapter_id IN [accessible]` into the query)
    // without leaking an existence signal.
    const isSimpleChapterFetch =
      chapter_ids.length === 1 &&
      !subject && !status && !type && !difficulty &&
      !is_pyq && !exam_level && !year && !tag_id && !searchTerm &&
      !sourceType && !exam && !isCountOnly;

    if (isSimpleChapterFetch) {
      // Admin/subject-admin RBAC gate. Viewers (no role row) and unauthenticated
      // users skip this — they're treated like public student traffic, which is
      // the same behavior the slow path provides via the
      // `if (permissions.role !== 'viewer')` guard below.
      if (isAuthenticated && user) {
        const permissions = await getUserPermissions(user.email!);
        if (permissions.role !== 'viewer') {
          const subj = getSubjectFromChapterId(chapter_ids[0]);
          if (!subj || !permissions.canAccessSubject(subj)) {
            return NextResponse.json({
              success: true,
              data: [],
              pagination: { total: 0, limit, skip, hasMore: false },
            });
          }
        }
      }

      const { total, docs } = await getCachedChapterQuestions(
        chapter_ids[0],
        examBoard,
        is_top_pyq === 'true',
        excludeSolutions,
        skip,
        limit,
      );
      return NextResponse.json({
        success: true,
        data: docs,
        pagination: {
          total,
          limit,
          skip,
          hasMore: skip + docs.length < total,
        },
      });
    }

    // ── Slow path: dynamic query for admin / search / multi-chapter / counts ──
    await connectToDatabase();

    // Build query with RBAC filtering
    let query: Record<string, unknown> = { deleted_at: null };

    // Apply subject-level access control for admin users only.
    // Regular students (role='viewer' or no UserRole row) must NOT be filtered here —
    // they should see the same questions as unauthenticated users do via the fast path.
    // RBAC chapter restrictions are an admin-panel concept; applying them to students
    // returns { _id: { $exists: false } } for anyone without a UserRole record.
    if (isAuthenticated && user) {
      const permissions = await getUserPermissions(user.email!);
      if (permissions.role !== 'viewer') {
        const rbacFilter = await getQuestionFilter(user.email!);
        query = { ...query, ...rbacFilter };
      }
    }

    if (chapter_ids.length === 1) query['metadata.chapter_id'] = chapter_ids[0];
    else if (chapter_ids.length > 1) query['metadata.chapter_id'] = { $in: chapter_ids };
    // subject filter — supports multi-subject future tests
    if (subject) {
      const subjects = subject.split(',').map(s => s.trim()).filter(Boolean);
      query['metadata.subject'] = subjects.length === 1 ? subjects[0] : { $in: subjects };
    }
    if (status) query.status = status;
    if (type) query.type = type;
    if (difficulty) {
      // Map old difficulty names to new levels for API compatibility
      const diffMap: Record<string, number> = { 'Easy': 2, 'Medium': 3, 'Hard': 4 };
      query['metadata.difficultyLevel'] = diffMap[difficulty] || Number(difficulty) || 3;
    }
    // NEW: Exam taxonomy filters (preferred).
    // The `examBoard=X` URL param is preserved for backward compatibility but
    // now matches against the multi-valued `applicableExams` array, so a single
    // question tagged for both JEE and NEET shows up in either filter.
    if (examBoard) query['metadata.applicableExams'] = examBoard;
    if (sourceType) query['metadata.sourceType'] = sourceType;
    if (exam) query['metadata.examDetails.exam'] = exam;
    if (year && (sourceType === 'PYQ' || examBoard)) {
      query['metadata.examDetails.year'] = Number(year);
    }

    // OLD: Legacy filters (backward compatibility)
    if (is_pyq === 'true') query['metadata.is_pyq'] = true;
    if (is_pyq === 'false') query['metadata.is_pyq'] = false;
    if (is_top_pyq === 'true') query['metadata.is_top_pyq'] = true;
    if (exam_level === 'mains') query['metadata.exam_source.exam'] = { $regex: /main/i };
    if (exam_level === 'adv') query['metadata.exam_source.exam'] = { $regex: /adv/i };
    if (year && !sourceType && !examBoard) query['metadata.exam_source.year'] = Number(year);
    if (tag_id) query['metadata.tags'] = { $elemMatch: { tag_id } };

    // SECURITY FIX: Escape regex special characters to prevent MongoDB injection
    if (searchTerm) {
      const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { display_id: { $regex: escapedSearchTerm, $options: 'i' } },
        { 'question_text.markdown': { $regex: escapedSearchTerm, $options: 'i' } }
      ];
    }

    // Run count + find in parallel — Mongo will execute them concurrently and
    // we save one round-trip's worth of latency per cold request. The cached
    // fast path above already does this; parity matters more in the slow path.
    const projection = excludeSolutions ? PROJECTION_NO_SOLUTIONS : {};
    const [total, questions] = await Promise.all([
      QuestionV2.countDocuments(query),
      isCountOnly
        ? Promise.resolve([] as unknown[])
        : QuestionV2.find(query, projection)
            .sort({ display_id: 1 })
            .limit(limit)
            .skip(skip)
            .lean(),
    ]);

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
    // Require authentication (safe localhost bypass for local dev only)
    const user = await getAuthenticatedUser(request);
    const isLocalDev = await isLocalhostDev();
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

    // Sync applicableExams ↔ examBoard. Callers may send either; keep both
    // populated so legacy readers and the new multikey index both work.
    {
      const m = data.metadata as Record<string, unknown>;
      const arr = m.applicableExams as string[] | undefined;
      const board = m.examBoard as string | undefined;
      if (arr && arr.length && !board) m.examBoard = arr[0];
      else if (board && (!arr || !arr.length)) m.applicableExams = [board];
    }

    // Check RBAC: Can user create questions in this chapter?
    if (user && !isLocalDev) {
      const hasPermission = await canEditQuestion(user.email!, data.metadata.chapter_id);
      if (!hasPermission) {
        return NextResponse.json(
          { success: false, error: 'Forbidden: You do not have permission to create questions in this subject' },
          { status: 403 }
        );
      }
    }

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

    // Resolve display_id: use caller-supplied value, or auto-generate from max existing sequence.
    // Auto-generation uses a retry loop to handle concurrent inserts that could
    // produce the same sequence number (race condition on the unique index).
    let display_id = data.display_id as string | undefined;
    let autoGeneratedPrefix: string | null = null;

    if (!display_id) {
      autoGeneratedPrefix = CHAPTER_PREFIX_MAP[data.metadata.chapter_id]
        ?? data.metadata.chapter_id.split('_').pop()!.toUpperCase().substring(0, 4);

      display_id = await generateNextDisplayId(autoGeneratedPrefix);
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
      created_by: user?.email ?? 'local-dev',
      updated_by: user?.email ?? 'local-dev',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      asset_ids
    };

    // Insert with retry: if display_id was auto-generated and a concurrent
    // request grabbed the same sequence number, regenerate and retry (up to 3 times).
    const col = QuestionV2.collection;
    const MAX_RETRIES = 3;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        await col.insertOne(questionDoc as unknown as Record<string, unknown>);
        break; // success
      } catch (insertErr: unknown) {
        const isDuplicateKey =
          insertErr instanceof Error &&
          (insertErr.message.includes('E11000') || (insertErr as { code?: number }).code === 11000);
        if (isDuplicateKey && autoGeneratedPrefix && attempt < MAX_RETRIES) {
          // Regenerate display_id and update the doc
          display_id = await generateNextDisplayId(autoGeneratedPrefix);
          questionDoc.display_id = display_id;
          continue;
        }
        throw insertErr; // not a dup key or out of retries
      }
    }

    // Chapter stats in MongoDB are no longer updated — taxonomy is code-based (taxonomyData_from_csv.ts).
    // Stats are computed on-demand by querying questions_v2 directly.

    // Create audit log (non-blocking)
    try {
      await AuditLog.collection.insertOne({
        _id: uuidv4(),
        entity_type: 'question',
        entity_id: questionId,
        action: 'create',
        changes: [{
          field: 'question',
          old_value: null,
          new_value: 'Created new question'
        }],
        user_id: user?.id ?? 'local-dev',
        user_email: user?.email ?? 'local-dev',
        timestamp: new Date(),
        can_rollback: false
      } as unknown as Record<string, unknown>);
    } catch (auditErr) {
      console.warn('Audit log creation failed (non-critical):', auditErr);
    }

    await trackServer(user?.id ?? 'local_dev', 'admin_action', {
      type: 'create',
      entity: 'question',
      entity_id: questionDoc._id,
    });

    // Bust the questions cache so students see the new content on next fetch
    revalidateTag('questions');

    return NextResponse.json({
      success: true,
      data: questionDoc,
      message: 'Question created successfully'
    }, { status: 201 });

  } catch (error: unknown) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create question' },
      { status: 500 }
    );
  }
}
