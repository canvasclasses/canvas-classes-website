import { z } from 'zod';

// ============================================
// Junior Question — validation schemas (Zod)
// Shared by the admin create / bulk / patch API routes. Pure, no I/O.
// Mirrors packages/data/models/JuniorQuestion.ts.
// ============================================

export const JUNIOR_CONCEPT_TAGS = [
  'concept', 'application', 'numerical', 'reasoning', 'recall',
] as const;

const OptionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  is_correct: z.boolean(),
});

// Core fields a caller may set on create/patch. _id, display_id, created_by,
// updated_by, timestamps are assigned server-side — never trusted from the body.
const CoreFields = {
  grade: z.number().int().min(6).max(10),
  subject: z.string().min(1),
  book_slug: z.string().min(1).optional(),
  chapter_number: z.number().int().positive(),
  chapter_slug: z.string().min(1).optional(),
  topic: z.string().optional(),

  format: z.enum(['mcq', 'assertion_reason']),
  question_text: z.object({
    markdown: z.string().min(3),
    latex_validated: z.boolean().optional().default(false),
  }),
  assertion: z.string().optional(),
  reason: z.string().optional(),

  options: z.array(OptionSchema).min(2).max(6),
  explanation: z.object({ markdown: z.string() }).optional(),

  image_src: z.string().optional(),
  image_prompt: z.string().optional(),

  concept_tag: z.enum(JUNIOR_CONCEPT_TAGS),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),

  source: z.string().optional(),
  status: z.enum(['draft', 'published', 'flagged']).optional(),
};

// Exactly one correct option, and A/R must carry assertion + reason.
function refineQuestion<T extends {
  options: { is_correct: boolean }[];
  format: 'mcq' | 'assertion_reason';
  assertion?: string;
  reason?: string;
}>(schema: z.ZodType<T>) {
  return schema
    .refine((q) => q.options.filter((o) => o.is_correct).length === 1, {
      message: 'Exactly one option must be marked correct.',
      path: ['options'],
    })
    .refine(
      (q) => q.format !== 'assertion_reason' || (!!q.assertion && !!q.reason),
      { message: 'Assertion–Reason questions need both an assertion and a reason.', path: ['assertion'] },
    );
}

export const JuniorQuestionCreateSchema = refineQuestion(z.object(CoreFields));

// Bulk insert: an array, plus a shared display_id prefix for sequence generation.
export const JuniorQuestionBulkSchema = z.object({
  prefix: z.string().regex(/^[A-Z0-9-]{2,24}$/, 'prefix must be UPPER-CASE alphanumeric'),
  questions: z.array(JuniorQuestionCreateSchema).min(1).max(200),
});

// Patch: every field optional; still enforce the cross-field rules when present.
export const JuniorQuestionPatchSchema = z
  .object(CoreFields)
  .partial()
  .refine(
    (q) => !q.options || q.options.filter((o) => o.is_correct).length === 1,
    { message: 'Exactly one option must be marked correct.', path: ['options'] },
  );

export type JuniorQuestionCreateInput = z.infer<typeof JuniorQuestionCreateSchema>;
export type JuniorQuestionPatchInput = z.infer<typeof JuniorQuestionPatchSchema>;
