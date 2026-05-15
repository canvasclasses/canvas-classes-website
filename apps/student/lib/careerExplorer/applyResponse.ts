// applyResponse — take a raw questionnaire answer and update a CareerProfile
// document in-place. Kept pure so both the API route and the seed/test
// scripts can use it.

import type { ICareerQuestion } from '@/lib/models/CareerQuestion';
import type {
  ICareerProfile,
  ICareerProfileScores,
  ICareerProfileConstraints,
  IProfileResponse,
} from '@/lib/models/CareerProfile';
import { EMPTY_SCORES } from './facets';

type ScoreDim = keyof ICareerProfileScores;
const SCORE_DIMS: ScoreDim[] = ['aptitude', 'interest', 'work_style', 'values', 'future'];

function isScoreDim(d: string): d is ScoreDim {
  return (SCORE_DIMS as string[]).includes(d);
}

export function ensureScores(profile: ICareerProfile): void {
  if (!profile.scores) profile.scores = EMPTY_SCORES();
  const empty = EMPTY_SCORES();
  for (const dim of SCORE_DIMS) {
    if (!profile.scores[dim]) profile.scores[dim] = empty[dim];
  }
}

interface ApplyInput {
  question: ICareerQuestion;
  option_id?: string;
  value?: unknown;
}

/**
 * Mutates profile. Returns nothing — caller persists.
 */
export function applyResponse(profile: ICareerProfile, input: ApplyInput): void {
  ensureScores(profile);

  // Upsert the response log.
  const existingIdx = profile.responses.findIndex((r) => r.question_id === input.question._id);
  const response: IProfileResponse = {
    question_id: input.question._id,
    option_id: input.option_id,
    value: input.value,
    answered_at: new Date(),
  };

  if (existingIdx >= 0) {
    reverseContribution(profile, input.question, profile.responses[existingIdx]);
    profile.responses[existingIdx] = response;
  } else {
    profile.responses.push(response);
  }

  // Apply new contribution.
  if (input.question.mode === 'contribution' && input.option_id) {
    const opt = input.question.options.find((o) => o.id === input.option_id);
    if (opt?.contributes && isScoreDim(input.question.dimension)) {
      const target = profile.scores[input.question.dimension];
      for (const [k, delta] of Object.entries(opt.contributes)) {
        target[k] = (target[k] ?? 0) + delta;
      }
    }
  }

  // Constraint capture.
  if (input.question.mode === 'constraint' && input.question.constraint_key) {
    const opt = input.question.options.find((o) => o.id === input.option_id);
    const key = input.question.constraint_key as keyof ICareerProfileConstraints;
    const store = profile.constraints as Record<string, unknown>;
    if (opt) {
      store[key] = opt.value;
    } else if (input.value !== undefined) {
      store[key] = input.value;
    }
  }
}

function reverseContribution(
  profile: ICareerProfile,
  question: ICareerQuestion,
  prev: IProfileResponse,
) {
  if (question.mode !== 'contribution' || !prev.option_id) return;
  const opt = question.options.find((o) => o.id === prev.option_id);
  if (!opt?.contributes) return;
  if (!isScoreDim(question.dimension)) return;
  const target = profile.scores[question.dimension];
  for (const [k, delta] of Object.entries(opt.contributes)) {
    target[k] = (target[k] ?? 0) - delta;
  }
}
