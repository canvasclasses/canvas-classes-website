import { NextRequest, NextResponse } from 'next/server';
import type { ServiceDeps } from './types';
import { v4 as uuidv4 } from 'uuid';
import { unstable_cache, revalidateTag } from 'next/cache';
import connectToDatabase from '@canvas/data/db/mongodb';
import { QuestionV2 } from '@canvas/data/models/Question.v2';
import { AuditLog } from '@canvas/data/models/AuditLog';
import { trackServer } from '@canvas/core/analytics/mixpanel.server';
import { TAXONOMY_FROM_CSV } from '@canvas/data/taxonomy/taxonomyData_from_csv';
import { getUserPermissions, getQuestionFilter, canEditQuestion, getSubjectFromChapterId } from '@canvas/data/rbac';
import { QuestionSchema } from '@canvas/data/schemas/question';
import { generateDisplayId, regenerateDisplayId } from '@canvas/data/id-generator';
import { createRateLimiter, getClientIp } from '@canvas/core/rate-limit';
import {
  buildMongoFilter,
  buildProjection,
  isSimpleChapterFetch,
  parseQuestionParams,
} from './questions-filters';

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

    const projection = buildProjection({ excludeSolutions });

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
  { revalidate: 3600, tags: ['questions'] },
);

const getCachedQuestionsByIds = unstable_cache(
  async (idsKey: string) => {
    await connectToDatabase();
    const ids = idsKey.split(',').filter(Boolean);
    const docs = await QuestionV2.find({ _id: { $in: ids }, deleted_at: null }).lean();
    return docs;
  },
  ['v2-questions-by-ids'],
  { revalidate: 3600, tags: ['questions'] },
);

const publicReadLimiter = createRateLimiter({ max: 30, windowMs: 60_000 });

// GET - Fetch all questions
export async function GET(request: NextRequest, deps: ServiceDeps) {
  try {
    const user = await deps.getAuthenticatedUser(request);
    const isLocalDev = await deps.isLocalhostDev();
    const isAuthenticated = !!user || isLocalDev;

    if (!isAuthenticated) {
      const ip = getClientIp(request);
      if (!publicReadLimiter.check(ip).ok) {
        return NextResponse.json(
          { success: false, error: 'Too many requests. Please slow down.' },
          { status: 429 },
        );
      }
    }

    const { searchParams } = new URL(request.url);
    const parsed = parseQuestionParams(searchParams);
    const { skip, isCountOnly, excludeSolutions, examBoard, is_top_pyq, idsParam, chapter_ids } = parsed;

    // Resolve the effective limit: unauthenticated requests (or count-only
    // queries from authed users) are capped at 50; authenticated reads default
    // to 5000 and honour whatever the caller asked for.
    const defaultLimit = isAuthenticated ? 5000 : 50;
    const requestedLimit = parsed.requestedLimit ?? defaultLimit;
    const limit = isAuthenticated && !isCountOnly ? requestedLimit : Math.min(requestedLimit, 50);

    // ── Fast path A: batch fetch by IDs (lazy solution loading) ──
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

    // ── Fast path B: simple chapter fetch (cached) ──
    // SECURITY: cache key doesn't include user email — RBAC is enforced before
    // serving cached data so admins restricted to certain subjects get [] for
    // chapters they can't access.
    if (isSimpleChapterFetch(parsed)) {
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

    let rbacFilter: Record<string, unknown> | undefined;
    if (isAuthenticated && user) {
      const permissions = await getUserPermissions(user.email!);
      if (permissions.role !== 'viewer') {
        rbacFilter = await getQuestionFilter(user.email!);
      }
    }

    const query = buildMongoFilter(parsed, { rbacFilter });
    const projection = buildProjection({ excludeSolutions });

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
        hasMore: skip + questions.length < total,
      },
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch questions' },
      { status: 500 },
    );
  }
}

// POST - Create new question
export async function POST(request: NextRequest, deps: ServiceDeps) {
  try {
    const user = await deps.getAuthenticatedUser(request);
    const isLocalDev = await deps.isLocalhostDev();
    if (!user && !isLocalDev) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const body = await request.json();

    const validation = QuestionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.error.issues },
        { status: 400 },
      );
    }
    const data = validation.data;

    if (user && !isLocalDev) {
      const hasPermission = await canEditQuestion(user.email!, data.metadata.chapter_id);
      if (!hasPermission) {
        return NextResponse.json(
          { success: false, error: 'Forbidden: You do not have permission to create questions in this subject' },
          { status: 403 },
        );
      }
    }

    const chapterNode = TAXONOMY_FROM_CSV.find(
      n => n.type === 'chapter' && n.id === data.metadata.chapter_id,
    );
    if (!chapterNode) {
      return NextResponse.json(
        { success: false, error: `Invalid chapter_id: '${data.metadata.chapter_id}' does not exist in taxonomy` },
        { status: 400 },
      );
    }

    // Resolve display_id: use caller-supplied value, or auto-generate.
    let display_id = data.display_id as string | undefined;
    let autoGeneratedPrefix: string | null = null;

    if (!display_id) {
      const result = await generateDisplayId(data.metadata.chapter_id);
      display_id = result.display_id;
      autoGeneratedPrefix = result.prefix;
    }

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

    const questionId = uuidv4();
    const questionDoc = {
      _id: questionId,
      display_id,
      question_text: {
        markdown: data.question_text.markdown,
        latex_validated: false,
      },
      type: data.type,
      options: data.options || [],
      answer: data.answer,
      solution: {
        text_markdown: data.solution.text_markdown,
        latex_validated: false,
        asset_ids: data.solution.asset_ids,
        video_url: data.solution.video_url,
        video_timestamp_start: data.solution.video_timestamp_start,
      },
      metadata: data.metadata,
      // Status policy (project decision 2026-05-07): new questions go directly
      // to 'published'. Problems are tagged via flags[], not held in 'review'.
      status: data.status || 'published',
      quality_score: 50,
      needs_review: false,
      version: 1,
      created_by: user?.email ?? 'local-dev',
      updated_by: user?.email ?? 'local-dev',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      asset_ids,
    };

    // Insert with retry on duplicate display_id (concurrent inserts race on the unique index).
    const col = QuestionV2.collection;
    const MAX_RETRIES = 3;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        await col.insertOne(questionDoc as unknown as Record<string, unknown>);
        break;
      } catch (insertErr: unknown) {
        const isDuplicateKey =
          insertErr instanceof Error &&
          (insertErr.message.includes('E11000') || (insertErr as { code?: number }).code === 11000);
        if (isDuplicateKey && autoGeneratedPrefix && attempt < MAX_RETRIES) {
          display_id = await regenerateDisplayId(autoGeneratedPrefix);
          questionDoc.display_id = display_id;
          continue;
        }
        throw insertErr;
      }
    }

    try {
      await AuditLog.collection.insertOne({
        _id: uuidv4(),
        entity_type: 'question',
        entity_id: questionId,
        action: 'create',
        changes: [{
          field: 'question',
          old_value: null,
          new_value: 'Created new question',
        }],
        user_id: user?.id ?? 'local-dev',
        user_email: user?.email ?? 'local-dev',
        timestamp: new Date(),
        can_rollback: false,
      } as unknown as Record<string, unknown>);
    } catch (auditErr) {
      console.warn('Audit log creation failed (non-critical):', auditErr);
    }

    await trackServer(user?.id ?? 'local_dev', 'admin_action', {
      type: 'create',
      entity: 'question',
      entity_id: questionDoc._id,
    });

    revalidateTag('questions');

    return NextResponse.json({
      success: true,
      data: questionDoc,
      message: 'Question created successfully',
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create question' },
      { status: 500 },
    );
  }
}
