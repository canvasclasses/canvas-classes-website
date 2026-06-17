import { z } from 'zod';

export const QuestionSchema = z.object({
  display_id: z.string().optional(),
  question_text: z.object({
    markdown: z.string().min(10, 'Question text must be at least 10 characters'),
  }),
  type: z.enum(['SCQ', 'MCQ', 'NVT', 'AR', 'MST', 'MTC', 'SUBJ']),
  options: z.array(z.object({
    id: z.string(),
    text: z.string(),
    is_correct: z.boolean(),
    asset_ids: z.array(z.string()).optional(),
  })).optional(),
  answer: z.object({
    integer_value: z.number().optional(),
    decimal_value: z.number().optional(),
    tolerance: z.number().optional(),
    unit: z.string().optional(),
  }).optional(),
  solution: z.object({
    text_markdown: z.string().min(20, 'Solution must be at least 20 characters'),
    asset_ids: z.object({
      images: z.array(z.string()).optional(),
      svg: z.array(z.string()).optional(),
      audio: z.array(z.string()).optional(),
    }).optional(),
    video_url: z.string().optional(),
    video_timestamp_start: z.number().optional(),
  }),
  metadata: z.object({
    difficultyLevel: z.number().min(1).max(5).default(3),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
    chapter_id: z.string(),
    subject: z.enum(['chemistry', 'physics', 'maths', 'biology']).optional(),
    tags: z.array(z.object({
      tag_id: z.string(),
      weight: z.number().min(0).max(1),
    })),
    exam_source: z.object({
      exam: z.string(),
      year: z.number().optional(),
      month: z.string().optional(),
      day: z.number().optional(),
      shift: z.string().optional(),
      question_number: z.string().optional(),
    }).optional(),
    applicableExams: z
      .array(z.enum(['JEE', 'NEET', 'CBSE', 'State_Board', 'BITSAT', 'OLYMPIAD', 'WBJEE']))
      .min(1)
      .optional(),
    examBoard: z.enum(['JEE', 'NEET', 'CBSE', 'State_Board', 'BITSAT', 'OLYMPIAD', 'WBJEE']).optional(),
    sourceType: z.enum(['PYQ', 'NCERT_Textbook', 'NCERT_Exemplar', 'Practice', 'Mock']).optional(),
    examDetails: z.object({
      exam: z.enum(['JEE_Main', 'JEE_Advanced', 'NEET_UG', 'NEET_PG', 'WBJEE']).optional(),
      year: z.number().optional(),
      month: z.string().optional(),
      phase: z.string().optional(),
      shift: z.string().optional(),
      paper: z.string().optional(),
    }).optional(),
    ncert_reference: z.object({
      class: z.union([z.literal(11), z.literal(12)]),
      chapter_number: z.number().optional(),
      chapter_name: z.string().optional(),
      page: z.number().optional(),
      line: z.string().optional(),
      edition: z.string().optional(),
    }).optional(),
    is_pyq: z.boolean().optional(),
    is_top_pyq: z.boolean().optional(),
  }),
  status: z.enum(['draft', 'review', 'published', 'archived']).optional(),
});

export type QuestionInput = z.infer<typeof QuestionSchema>;
