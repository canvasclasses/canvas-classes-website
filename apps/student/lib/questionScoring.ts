/**
 * Single source of truth for "is this student answer correct?".
 *
 * Three callers pre-consolidation:
 *   - server: app/api/v2/test-results/route.ts (authoritative score recompute)
 *   - client: app/the-crucible/components/TestView.tsx
 *   - client: app/the-crucible/components/BrowseView.tsx
 *
 * If client and server disagree on correctness, the dashboard and the in-app
 * feedback diverge — students see "correct!" but their persona signal records
 * "wrong" (or vice versa). Funnelling all three through this helper closes
 * that risk by construction.
 *
 * Accepts `selected: unknown` so server callers (where the value came off the
 * wire) don't need to pre-validate. Clients can pass their typed state
 * directly.
 */

export type QuestionType = 'SCQ' | 'MCQ' | 'NVT' | 'AR' | 'MST' | 'MTC' | 'SUBJ' | 'WKEX';

export interface ScorableQuestion {
  type: QuestionType;
  options?: Array<{ id: string; is_correct: boolean }>;
  answer?: { integer_value?: number; correct_option?: string };
}

/**
 * Returns true iff `selected` is the correct answer for `question`.
 *
 *  - NVT  : numeric equality with `answer.integer_value`. Strings are trimmed
 *           and parsed; empty/non-numeric inputs are wrong.
 *  - MCQ  : selection must be an array of option ids exactly matching the set
 *           of `is_correct` options (order-insensitive, no extras).
 *  - SCQ / AR / MST / MTC : selection must be a single option id whose
 *           `is_correct` flag is true.
 *  - SUBJ / WKEX : not auto-scorable — always returns false.
 *
 * Empty / null / undefined selection is always wrong (a non-attempt is not a
 * correct answer).
 */
export function isAnswerCorrect(
  question: ScorableQuestion,
  selected: unknown,
): boolean {
  if (selected === null || selected === undefined || selected === '') return false;

  if (question.type === 'NVT') {
    const expected = question.answer?.integer_value;
    if (expected === undefined || expected === null) return false;
    const userNum = Number(typeof selected === 'string' ? selected.trim() : selected);
    return Number.isFinite(userNum) && userNum === expected;
  }

  if (question.type === 'MCQ') {
    const userArr = Array.isArray(selected)
      ? selected.filter((x): x is string => typeof x === 'string')
      : [];
    const correctIds = (question.options ?? []).filter(o => o.is_correct).map(o => o.id);
    if (userArr.length !== correctIds.length || correctIds.length === 0) return false;
    return correctIds.every(id => userArr.includes(id));
  }

  if (question.type === 'SUBJ' || question.type === 'WKEX') return false;

  // SCQ / AR / MST / MTC — single option id
  if (typeof selected !== 'string') return false;
  return !!question.options?.find(o => o.id === selected && o.is_correct);
}
