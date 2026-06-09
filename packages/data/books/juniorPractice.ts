// Shared mapping from a junior_questions document to the shape the
// JuniorPracticeRenderer plays (correct_index instead of per-option is_correct
// flags, option strings instead of objects). Used by the practice-read route
// in BOTH the student and admin apps so the shared renderer gets one shape.

export interface JuniorPracticeQuestion {
  id: string;
  format: 'mcq' | 'assertion_reason';
  question: string;
  assertion: string | null;
  reason: string | null;
  options: string[];
  correct_index: number;
  explanation: string;
  image_src: string | null;
  concept_tag: string;
  difficulty: number;
  topic: string | null;
  chapter_number: number;
}

interface RawOption { id?: string; text: string; is_correct: boolean }
interface RawJuniorDoc {
  display_id: string;
  format: 'mcq' | 'assertion_reason';
  question_text?: { markdown?: string };
  assertion?: string | null;
  reason?: string | null;
  options?: RawOption[];
  explanation?: { markdown?: string };
  image_src?: string | null;
  concept_tag: string;
  difficulty: number;
  topic?: string | null;
  chapter_number: number;
}

export function mapJuniorPracticeQuestions(docs: RawJuniorDoc[]): JuniorPracticeQuestion[] {
  return docs.map((q) => ({
    id: q.display_id,
    format: q.format,
    question: q.question_text?.markdown ?? '',
    assertion: q.assertion ?? null,
    reason: q.reason ?? null,
    options: (q.options ?? []).map((o) => o.text),
    correct_index: (q.options ?? []).findIndex((o) => o.is_correct),
    explanation: q.explanation?.markdown ?? '',
    image_src: q.image_src ?? null,
    concept_tag: q.concept_tag,
    difficulty: q.difficulty,
    topic: q.topic ?? null,
    chapter_number: q.chapter_number,
  }));
}
