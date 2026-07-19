/**
 * Live Book page readiness engine.
 *
 * Single source of truth for "is this page ready to go public, and if not, what
 * is missing?". Pure, dependency-light logic (only imports the block validator
 * from this package) so it can run in the page-save handler, the recompute API,
 * and any aggregation endpoint without pulling in the DB or app-level code.
 *
 * The computed summary is stored on `BookPage.readiness` (updated on every save
 * + by the recompute backfill) so the readiness dashboard reads pre-computed
 * summaries instead of re-scanning every block on every visit — this is what
 * keeps the dashboard fast as the book database grows to thousands of pages.
 *
 * Human sign-off (`BookPage.review`) is separate from these automated checks and
 * is factored into the final stage: a page is only "reviewed" once a super-admin
 * has personally signed it off.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type ReadinessStage =
  | 'not_started' // stub — no real content yet
  | 'in_progress' // has content but hard blockers remain
  | 'content_complete' // all automated checks pass, awaiting human review
  | 'reviewed' // a human signed off — ready to publish
  | 'published'; // live to students

export interface PageReviewState {
  reviewed: boolean;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
}

export interface PageReadinessSummary {
  stage: ReadinessStage;
  hasContent: boolean;
  structureValid: boolean;
  latexValid: boolean;
  pendingImages: number;
  pendingAudio: number;
  hasQuiz: boolean;
  hasReasoning: boolean;
  hasHinglish: boolean;
  isChapterOpener: boolean;
  published: boolean;
  reviewed: boolean;
  /** Hard checks that must pass before this page can be published. */
  blockers: string[];
  /** Soft checks worth a look but not publish-blocking (audio, reasoning, Hinglish). */
  warnings: string[];
  computed_at: string;
}

export interface ReadinessInput {
  subject?: string;
  blocks?: unknown;
  hinglish_blocks?: unknown;
  published?: boolean;
  page_type?: string;
  // Only `reviewed` is read here; accept either the string- or Date-timestamped
  // shape (engine summary vs Mongoose model) without coupling to either.
  review?: { reviewed?: boolean } | null;
}

// ─── Detection constants ────────────────────────────────────────────────────

/** Assessment / check-for-understanding block types — a page "has a quiz" if any is present. */
const QUIZ_TYPES = new Set<string>([
  'inline_quiz',
  'classify_exercise',
  'reasoning_prompt',
  'comprehension_checkpoint',
  'chapter_practice',
  'junior_practice',
  'practice_bank',
  'apply_express',
  'reading_comprehension',
  'group_elements',
]);

/** Subjects whose pages carry LaTeX math worth validating (prose subjects skip it). */
const LATEX_SUBJECTS = new Set<string>([
  'chemistry',
  'physics',
  'mathematics',
  'science',
  'biology',
]);

/** Subjects for which a missing Hinglish twin is worth flagging as a warning. */
const HINGLISH_SUBJECTS = new Set<string>([
  'chemistry',
  'physics',
  'mathematics',
  'science',
  'biology',
]);

// ─── Small helpers ──────────────────────────────────────────────────────────

type AnyBlock = Record<string, unknown>;

/** A string field counts as "present" only when it is a non-empty, non-whitespace string. */
function empty(v: unknown): boolean {
  return typeof v !== 'string' || v.trim() === '';
}

function asArray(v: unknown): AnyBlock[] {
  return Array.isArray(v) ? (v.filter((b) => b && typeof b === 'object') as AnyBlock[]) : [];
}

/** Flatten one level of `section` columns into a flat list of leaf blocks (lenient). */
function flattenLoose(blocks: unknown): AnyBlock[] {
  const out: AnyBlock[] = [];
  for (const b of asArray(blocks)) {
    if (b.type === 'section' && Array.isArray(b.columns)) {
      for (const col of b.columns) out.push(...asArray(col));
    } else {
      out.push(b);
    }
  }
  return out;
}

// ─── Media pending counters ─────────────────────────────────────────────────

/**
 * Count image assets still to be produced on a block. An asset is "pending" when
 * a block whose purpose is the image (image/video/animation/gallery item) has an
 * empty src, or when a block carries a generation prompt but no matching asset URL.
 */
function pendingImagesOf(b: AnyBlock): number {
  switch (b.type) {
    case 'image':
    case 'interactive_image':
    case 'video':
    case 'animation':
      return empty(b.src) ? 1 : 0;
    case 'gallery':
      return asArray(b.items).filter((it) => empty(it.src)).length;
    case 'callout':
      return !empty(b.image_prompt) && empty(b.image_src) ? 1 : 0;
    case 'perspective_scenario':
    case 'you_solve_it':
      return !empty(b.image_prompt) && empty(b.image_src) ? 1 : 0;
    case 'cultural_context_card':
      return !empty(b.image_prompt) && empty(b.image_url) ? 1 : 0;
    case 'meet_a_scientist':
      return !empty(b.portrait_prompt) && empty(b.portrait_src) ? 1 : 0;
    case 'character_map':
      return asArray(b.characters).filter(
        (c) => !empty(c.portrait_prompt) && empty(c.portrait_url)
      ).length;
    default:
      return 0;
  }
}

/** Count audio clips still to be recorded on a block (English/Hindi tracks). */
function pendingAudioOf(b: AnyBlock): number {
  switch (b.type) {
    case 'audio_note':
      return empty(b.src) ? 1 : 0;
    case 'narrated_passage': {
      let n = 0;
      for (const p of asArray(b.paragraphs))
        for (const s of asArray(p.sentences)) if (empty(s.audio_url)) n++;
      return n;
    }
    case 'vocabulary_lab':
      return asArray(b.cards).filter((c) => empty(c.audio_url)).length;
    case 'dialogue_role_play':
      return asArray(b.lines).filter((l) => empty(l.audio_url)).length;
    case 'pronunciation_drill':
      return asArray(b.words).filter((w) => empty(w.audio_url)).length;
    default:
      return 0;
  }
}

// ─── LaTeX sanity (lightweight — full validator lives in @canvas/core) ────────

/** Collect the markdown/text strings on a block worth LaTeX-checking. */
function textOf(b: AnyBlock): string[] {
  const out: string[] = [];
  for (const key of ['markdown', 'text', 'caption']) {
    if (typeof b[key] === 'string') out.push(b[key] as string);
  }
  return out;
}

/**
 * True unless a string looks like it has broken math: `$$` used (banned per
 * CLAUDE.md §4), or an odd number of `$` *while also* containing a LaTeX command
 * (`\frac`, `\Delta`, …) — the odd-$ alone is ignored so a literal `$` in prose
 * (currency, "the $5 note") is not mistaken for unclosed math.
 */
function latexOk(s: string): boolean {
  if (s.includes('$$')) return false;
  const dollars = (s.match(/\$/g) || []).length;
  if (dollars % 2 === 0) return true;
  return !/\\[a-zA-Z]/.test(s); // odd $ but no LaTeX command → treat as literal, not math
}

// ─── Main engine ─────────────────────────────────────────────────────────────

/**
 * Compute a page's readiness summary from its stored fields. Never throws —
 * malformed input degrades to sensible defaults (and surfaces as a blocker).
 */
export function computePageReadiness(
  page: ReadinessInput,
  validate?: (input: unknown) => { ok: boolean }
): PageReadinessSummary {
  const subject = page.subject || '';
  const flat = flattenLoose(page.blocks);
  const isChapterOpener = page.page_type === 'chapter_opener';
  const published = page.published === true;
  const reviewed = page.review?.reviewed === true;

  // Content: at least one text block with real markdown.
  const hasContent = flat.some(
    (b) => b.type === 'text' && typeof b.markdown === 'string' && b.markdown.trim().length > 0
  );

  // Structure: run the shared Zod validator when one is provided (server side).
  const structureValid = validate ? validate(page.blocks ?? []).ok : true;

  // LaTeX: only meaningful for math-bearing subjects; prose subjects skip it.
  let latexValid = true;
  if (LATEX_SUBJECTS.has(subject)) {
    latexValid = flat.every((b) => textOf(b).every(latexOk));
  }

  let pendingImages = 0;
  let pendingAudio = 0;
  let hasQuiz = false;
  let hasReasoning = false;
  for (const b of flat) {
    pendingImages += pendingImagesOf(b);
    pendingAudio += pendingAudioOf(b);
    if (typeof b.type === 'string' && QUIZ_TYPES.has(b.type)) hasQuiz = true;
    if (b.type === 'reasoning_prompt') hasReasoning = true;
  }

  const hasHinglish = asArray(page.hinglish_blocks).length > 0;

  // ── Hard blockers (must clear before publish — substantive gaps only) ──
  const blockers: string[] = [];
  if (!hasContent) blockers.push('No real content (stub page)');
  if (pendingImages > 0)
    blockers.push(`${pendingImages} image${pendingImages > 1 ? 's' : ''} pending`);
  if (!hasQuiz && !isChapterOpener) blockers.push('No quiz / checkpoint block');

  // ── Soft warnings (worth a look, not publish-blocking) ──
  // Schema/LaTeX live here, not in blockers: a strict-Zod miss is usually drift
  // (a null caption, an unlisted callout variant) on a page that renders fine —
  // a lint nit to fix at leisure, not a reason a finished chapter can't ship.
  const warnings: string[] = [];
  if (!structureValid) warnings.push('Block schema warning');
  if (!latexValid) warnings.push('LaTeX warning ($$ or unclosed $)');
  if (pendingAudio > 0)
    warnings.push(`${pendingAudio} audio clip${pendingAudio > 1 ? 's' : ''} not recorded`);
  if (!hasReasoning && !isChapterOpener) warnings.push('No reasoning block');
  if (!hasHinglish && HINGLISH_SUBJECTS.has(subject)) warnings.push('No Hinglish twin');

  // ── Stage ──
  let stage: ReadinessStage;
  if (published) stage = 'published';
  else if (reviewed) stage = 'reviewed';
  else if (hasContent && blockers.length === 0) stage = 'content_complete';
  else if (hasContent) stage = 'in_progress';
  else stage = 'not_started';

  return {
    stage,
    hasContent,
    structureValid,
    latexValid,
    pendingImages,
    pendingAudio,
    hasQuiz,
    hasReasoning,
    hasHinglish,
    isChapterOpener,
    published,
    reviewed,
    blockers,
    warnings,
    computed_at: new Date().toISOString(),
  };
}

/** Stage → display label + short description, shared by every UI surface. */
export const STAGE_META: Record<ReadinessStage, { label: string; hint: string }> = {
  not_started: { label: 'Not started', hint: 'Stub — no real content yet' },
  in_progress: { label: 'In progress', hint: 'Has content but blockers remain' },
  content_complete: { label: 'Content complete', hint: 'Automated checks pass — awaiting review' },
  reviewed: { label: 'Reviewed', hint: 'Signed off — ready to publish' },
  published: { label: 'Published', hint: 'Live to students' },
};
