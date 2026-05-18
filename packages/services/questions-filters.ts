/**
 * Pure helpers extracted from `questions.ts:GET` — URL-param parsing,
 * Mongo filter construction, and projection selection. Pulled out so they
 * can be unit-tested without the HTTP layer or Mongoose, and so the
 * legacy-param bridge has a single location to delete when CLAUDE.md §4.5
 * Phase 4 cleanup ships.
 */

/**
 * Mongo projection: when `excludeSolutions` is set, skip the heavy solution
 * fields. `solution.text_markdown` alone is often 1.5–3 KB per question; on a
 * 500-Q chapter this saves ~1 MB of payload per fetch.
 */
export const PROJECTION_NO_SOLUTIONS: Record<string, 0> = {
  'solution.text_markdown': 0,
  'solution.markdown': 0,
  'solution.video_url': 0,
  'solution.asset_ids': 0,
  'solution.video_timestamp_start': 0,
};

export interface ParsedQuestionFilters {
  chapter_ids: string[];
  subject: string | null;
  status: string | null;
  type: string | null;
  difficulty: string | null;
  is_pyq: string | null;
  is_top_pyq: string | null;
  exam_level: string | null;
  year: string | null;
  tag_id: string | null;
  searchTerm: string | null;
  isCountOnly: boolean;
  examBoard: string | null;
  sourceType: string | null;
  exam: string | null;
  excludeSolutions: boolean;
  idsParam: string | null;
  /** `null` when no `limit` param was supplied — caller picks the default. */
  requestedLimit: number | null;
  skip: number;
}

function toFiniteInt(value: string | null): number | null {
  if (!value) return null;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : null;
}

export function parseQuestionParams(searchParams: URLSearchParams): ParsedQuestionFilters {
  return {
    chapter_ids: searchParams.getAll('chapter_id'),
    subject: searchParams.get('subject'),
    status: searchParams.get('status'),
    type: searchParams.get('type'),
    difficulty: searchParams.get('difficulty'),
    is_pyq: searchParams.get('is_pyq'),
    is_top_pyq: searchParams.get('is_top_pyq'),
    exam_level: searchParams.get('exam_level'),
    year: searchParams.get('year'),
    tag_id: searchParams.get('tag_id'),
    searchTerm: searchParams.get('search'),
    isCountOnly: searchParams.get('countOnly') === 'true',
    examBoard: searchParams.get('examBoard'),
    sourceType: searchParams.get('sourceType'),
    exam: searchParams.get('exam'),
    excludeSolutions: searchParams.get('excludeSolutions') === 'true',
    idsParam: searchParams.get('ids'),
    requestedLimit: toFiniteInt(searchParams.get('limit')),
    skip: toFiniteInt(searchParams.get('skip')) ?? 0,
  };
}

/**
 * True when the request asks for a single chapter's questions with no
 * additional filters — eligible for the cached fast path.
 */
export function isSimpleChapterFetch(parsed: ParsedQuestionFilters): boolean {
  return (
    parsed.chapter_ids.length === 1 &&
    !parsed.subject &&
    !parsed.status &&
    !parsed.type &&
    !parsed.difficulty &&
    !parsed.is_pyq &&
    !parsed.exam_level &&
    !parsed.year &&
    !parsed.tag_id &&
    !parsed.searchTerm &&
    !parsed.sourceType &&
    !parsed.exam &&
    !parsed.isCountOnly
  );
}

/**
 * Build the slow-path Mongo filter from parsed params plus an optional
 * RBAC pre-filter. The caller is responsible for fetching RBAC state and
 * passing it in — this stays pure.
 */
export function buildMongoFilter(
  parsed: ParsedQuestionFilters,
  opts?: { rbacFilter?: Record<string, unknown> },
): Record<string, unknown> {
  const query: Record<string, unknown> = { deleted_at: null };

  if (opts?.rbacFilter) {
    Object.assign(query, opts.rbacFilter);
  }

  const {
    chapter_ids, subject, status, type, difficulty,
    is_pyq, is_top_pyq, exam_level, year, tag_id, searchTerm,
    examBoard, sourceType, exam,
  } = parsed;

  if (chapter_ids.length === 1) query['metadata.chapter_id'] = chapter_ids[0];
  else if (chapter_ids.length > 1) query['metadata.chapter_id'] = { $in: chapter_ids };

  if (subject) {
    const subjects = subject.split(',').map(s => s.trim()).filter(Boolean);
    query['metadata.subject'] = subjects.length === 1 ? subjects[0] : { $in: subjects };
  }
  if (status) query.status = status;
  if (type) query.type = type;
  if (difficulty) {
    const diffMap: Record<string, number> = { Easy: 2, Medium: 3, Hard: 4 };
    query['metadata.difficultyLevel'] = diffMap[difficulty] || Number(difficulty) || 3;
  }
  if (examBoard) query['metadata.applicableExams'] = examBoard;
  if (sourceType) query['metadata.sourceType'] = sourceType;
  if (exam) query['metadata.examDetails.exam'] = exam;
  if (year && (sourceType === 'PYQ' || examBoard)) {
    query['metadata.examDetails.year'] = Number(year);
  }

  // Legacy URL-param translation — accepts old param names for back-compat,
  // routes them to the canonical Mongo fields. After Phase 4 of the
  // 2026-05-07 cleanup (CLAUDE.md §4.5), this block can be deleted in one
  // place instead of hunting through the route handler.
  if (is_pyq === 'true') query['metadata.sourceType'] = 'PYQ';
  if (is_pyq === 'false') query['metadata.sourceType'] = { $ne: 'PYQ' };
  if (is_top_pyq === 'true') query['metadata.is_top_pyq'] = true;
  if (exam_level === 'mains') query['metadata.examDetails.exam'] = 'JEE_Main';
  if (exam_level === 'adv') query['metadata.examDetails.exam'] = 'JEE_Advanced';
  if (year && !sourceType && !examBoard) query['metadata.examDetails.year'] = Number(year);
  if (tag_id) query['metadata.tags'] = { $elemMatch: { tag_id } };

  if (searchTerm) {
    // SECURITY: escape regex special characters to prevent MongoDB injection.
    const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.$or = [
      { display_id: { $regex: escapedSearchTerm, $options: 'i' } },
      { 'question_text.markdown': { $regex: escapedSearchTerm, $options: 'i' } },
    ];
  }

  return query;
}

export function buildProjection(opts: { excludeSolutions: boolean }): Record<string, 0> {
  return opts.excludeSolutions ? PROJECTION_NO_SOLUTIONS : {};
}
