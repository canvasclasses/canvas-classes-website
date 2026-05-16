// TODO (Phase 5.6): byte-for-byte duplicate of the matching student route.
// Both apps host this endpoint so admin UI can fetch it same-origin without
// crossing the security boundary into apps/student. Until the route's shared
// logic moves to a service-layer package (@canvas/data or @canvas/services),
// any changes here MUST be mirrored to apps/student/app/api/v2/... or a drift
// audit will catch them later. Only difference from student copy:
// `@/lib/bookAuth` rewritten to `@/lib/adminAuth`.

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { unstable_cache, revalidateTag } from 'next/cache';
import connectToDatabase from '@canvas/data/db/mongodb';
import { QuestionV2 } from '@canvas/data/models/Question.v2';
import { AuditLog } from '@canvas/data/models/AuditLog';
import { trackServer } from '@canvas/core/analytics/mixpanel.server';
import { TAXONOMY_FROM_CSV } from '@canvas/data/taxonomy/taxonomyData_from_csv';
import { getAuthenticatedUser } from '@/lib/auth';
import { getUserPermissions, getQuestionFilter, canEditQuestion, getSubjectFromChapterId } from '@/lib/rbac';
import { isLocalhostDev } from '@/lib/adminAuth';
import { QuestionSchema } from '@canvas/data/schemas/question';
import { generateDisplayId, regenerateDisplayId } from '@canvas/data/id-generator';
import { createRateLimiter, getClientIp } from '@canvas/core/rate-limit';

// Mongo projection: when excludeSolutions=true, skip the heavy solution fields.
// solution.text_markdown alone is often 1.5–3 KB per question; on a 500-Q chapter
// this saves ~1MB of payload per fetch.
const PROJECTION_NO_SOLUTIONS = {
  'solution.text_markdown': 0,
  'solution.markdown': 0,
  'solution.video_url': 0,
  'solution.asset_ids': 0,
  'solution.video_timestamp_start': 0,
};

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
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    const isLocalDev = await isLocalhostDev();
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
    const examBoard = searchParams.get('examBoard');
    const sourceType = searchParams.get('sourceType');
    const exam = searchParams.get('exam');
    const excludeSolutions = searchParams.get('excludeSolutions') === 'true';
    const idsParam = searchParams.get('ids');

    const requestedLimit = parseInt(searchParams.get('limit') || (isAuthenticated ? '5000' : '50'));
    const limit = isAuthenticated && !isCountOnly ? requestedLimit : Math.min(requestedLimit, 50);
    const skip = parseInt(searchParams.get('skip') || '0');

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
    const isSimpleChapterFetch =
      chapter_ids.length === 1 &&
      !subject && !status && !type && !difficulty &&
      !is_pyq && !exam_level && !year && !tag_id && !searchTerm &&
      !sourceType && !exam && !isCountOnly;

    if (isSimpleChapterFetch) {
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

    let query: Record<string, unknown> = { deleted_at: null };

    if (isAuthenticated && user) {
      const permissions = await getUserPermissions(user.email!);
      if (permissions.role !== 'viewer') {
        const rbacFilter = await getQuestionFilter(user.email!);
        query = { ...query, ...rbacFilter };
      }
    }

    if (chapter_ids.length === 1) query['metadata.chapter_id'] = chapter_ids[0];
    else if (chapter_ids.length > 1) query['metadata.chapter_id'] = { $in: chapter_ids };
    if (subject) {
      const subjects = subject.split(',').map(s => s.trim()).filter(Boolean);
      query['metadata.subject'] = subjects.length === 1 ? subjects[0] : { $in: subjects };
    }
    if (status) query.status = status;
    if (type) query.type = type;
    if (difficulty) {
      const diffMap: Record<string, number> = { 'Easy': 2, 'Medium': 3, 'Hard': 4 };
      query['metadata.difficultyLevel'] = diffMap[difficulty] || Number(difficulty) || 3;
    }
    if (examBoard) query['metadata.applicableExams'] = examBoard;
    if (sourceType) query['metadata.sourceType'] = sourceType;
    if (exam) query['metadata.examDetails.exam'] = exam;
    if (year && (sourceType === 'PYQ' || examBoard)) {
      query['metadata.examDetails.year'] = Number(year);
    }

    // Legacy URL-param translation — accepts old param names for back-compat,
    // but routes them to the canonical Mongo fields. After Phase 4 of the
    // 2026-05-07 cleanup, these filters can be deleted entirely.
    if (is_pyq === 'true') query['metadata.sourceType'] = 'PYQ';
    if (is_pyq === 'false') query['metadata.sourceType'] = { $ne: 'PYQ' };
    if (is_top_pyq === 'true') query['metadata.is_top_pyq'] = true;
    if (exam_level === 'mains') query['metadata.examDetails.exam'] = 'JEE_Main';
    if (exam_level === 'adv') query['metadata.examDetails.exam'] = 'JEE_Advanced';
    if (year && !sourceType && !examBoard) query['metadata.examDetails.year'] = Number(year);
    if (tag_id) query['metadata.tags'] = { $elemMatch: { tag_id } };

    // SECURITY: Escape regex special characters to prevent MongoDB injection
    if (searchTerm) {
      const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { display_id: { $regex: escapedSearchTerm, $options: 'i' } },
        { 'question_text.markdown': { $regex: escapedSearchTerm, $options: 'i' } },
      ];
    }

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
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    const isLocalDev = await isLocalhostDev();
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
