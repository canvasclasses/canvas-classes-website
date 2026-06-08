import 'server-only';
import type { PersonaSnapshot, PersonaSkill } from './persona-snapshot';
import { PERSONA_SNAPSHOT_VERSION } from './persona-snapshot';

/**
 * AI TUTOR (Phase 2b, ADR-011) — the guardrailed interpreter layer.
 *
 * Split, by design (UNIFIED_LEARNER_PERSONA.md Layer 6 / CRUCIBLE_ARCHITECTURE.md §10):
 *   deterministic engine computes STATE → AI only INTERPRETS + COMMUNICATES.
 *
 * The AI reads a versioned persona snapshot and returns plain-language guidance
 * + a chosen *next skill*. It NEVER emits a resource URL and NEVER names a skill
 * that isn't in the snapshot — the guardrail is structural, not prompt-hoped:
 *   1. The prompt offers the AI ONLY the real skill ids from the snapshot.
 *   2. `validateTutorOutput` rejects any skill id outside that allowlist and
 *      falls back to the engine's top recommendation (recording a violation).
 *   3. The AI picks a skill + a step TYPE ('practice'|'read'|'watch'); the
 *      deterministic engine resolves the actual ResourceLink afterwards. The AI
 *      literally has no field in which to invent a resource.
 *
 * This module is PURE except `runTutor`, which takes an injected `complete`
 * function (DI, ADR-001) so the LLM call lives in the app layer and the prompt
 * + guardrail logic stay unit-testable with no API spend.
 */
export const TUTOR_VERSION = 1;

export type NextStep = 'practice' | 'read' | 'watch';

/** The strict JSON shape the model is constrained to emit. */
export interface TutorModelOutput {
  weakness_explanation: string;
  next_skill_id: string;
  next_step: NextStep;
  reason: string;
  encouragement: string;
}

/** JSON Schema handed to the Messages API `output_config.format`. */
export const TUTOR_OUTPUT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    weakness_explanation: { type: 'string' },
    next_skill_id: { type: 'string' },
    next_step: { type: 'string', enum: ['practice', 'read', 'watch'] },
    reason: { type: 'string' },
    encouragement: { type: 'string' },
  },
  required: ['weakness_explanation', 'next_skill_id', 'next_step', 'reason', 'encouragement'],
} as const;

export interface TutorOptions {
  /** Optional skill the student wants help on (must be a real skill id to take effect). */
  focusSkillId?: string;
  /** Optional free-text student question. Presence routes to the stronger model. */
  question?: string;
}

/** What the app injects: turn a built prompt into the raw model JSON string. */
export interface TutorLLMRequest {
  system: string;
  user: string;
  schema: typeof TUTOR_OUTPUT_SCHEMA;
  /** routine asks (no free-text question) → cheap model; hard asks → strong model. */
  routine: boolean;
}
export type TutorComplete = (req: TutorLLMRequest) => Promise<string>;

export interface TutorResolvedResource {
  type: string;
  title: string;
  url: string;
  duration_minutes?: number;
}

export interface TutorResponse {
  tutor_version: number;
  snapshot_version: number;
  generated_at: string;
  /** Plain-language explanation of the student's current weaknesses. */
  explanation: string;
  next: {
    skill_id: string;
    skill_name: string;
    step: NextStep;
    reason: string;
    /** Where to go — resolved DETERMINISTICALLY by the engine, never by the AI. */
    action_url: string;
    /** A real ResourceLink, or null when none exists (then step falls back to practice). */
    resource: TutorResolvedResource | null;
  };
  encouragement: string;
  /** Empty when the model stayed within the guardrail; populated when we corrected it. */
  guardrail_violations: string[];
  model_used: string;
  /** True when there was no signal to advise on (empty persona). */
  is_empty: boolean;
}

// ── Prompt construction (pure) ─────────────────────────────────────────────

const WEAKNESS_LABELS: Record<string, string> = {
  'concept-gap': "doesn't understand the underlying concept",
  'unclear-entry': 'enters answers in the wrong form',
  'calc-error': 'makes calculation/arithmetic slips',
  'time-pressure': 'runs out of time',
  'silly-mistake': 'makes careless mistakes',
};

/**
 * The compact list of skills the AI is allowed to choose from (real ids only).
 * When the student named a valid focus skill, it is guaranteed to be in the list
 * even if it falls outside the actionable top-N — otherwise the model couldn't
 * honour the request.
 */
export function tutorAllowedSkills(snapshot: PersonaSnapshot, focusSkillId?: string): PersonaSkill[] {
  // Prefer weak + due skills (the actionable ones); fall back to all tracked.
  const actionable = snapshot.skills.filter(
    (s) => s.proficiency === 'weak' || s.due_for_review,
  );
  const pool = actionable.length ? actionable : snapshot.skills;
  const capped = pool.slice(0, 25); // bound the prompt
  const focus = focusSkillId && snapshot.skills.find((s) => s.skill_id === focusSkillId);
  if (focus && !capped.some((s) => s.skill_id === focus.skill_id)) {
    return [focus, ...capped].slice(0, 25);
  }
  return capped;
}

export function buildTutorPrompt(
  snapshot: PersonaSnapshot,
  opts: TutorOptions,
): { system: string; user: string } {
  const allowed = tutorAllowedSkills(snapshot, opts.focusSkillId);
  const skillLines = allowed
    .map((s) => {
      const prob = s.mastery_prob != null ? `, mastery ${Math.round(s.mastery_prob * 100)}%` : '';
      const due = s.due_for_review ? ', DUE for review' : '';
      const traj = s.trajectory !== 'new' ? `, trending ${s.trajectory}` : '';
      return `- id="${s.skill_id}" | ${s.name} | ${s.proficiency}, ${s.accuracy}% accuracy over ${s.times_attempted} tries${prob}${due}${traj}`;
    })
    .join('\n');

  const weaknessLines = snapshot.weaknesses
    .map((w) => `- ${WEAKNESS_LABELS[w.type] ?? w.type} (seen ${w.count}×)`)
    .join('\n');

  const recLines = snapshot.recommended
    .map((r) => `- id="${r.skill_id ?? ''}" | ${r.name} | engine reason: ${r.reason}`)
    .join('\n');

  const system = [
    'You are a warm, encouraging JEE/NEET and school study coach for students in small-town India.',
    'You speak in plain, simple English — short sentences, no jargon, no condescension.',
    '',
    'You are given a STUDENT PERSONA computed by a deterministic engine. Your job is ONLY to interpret and communicate it:',
    '1) explain, in plain language, what the student is currently weak at and why,',
    '2) pick the single best NEXT skill for them to work on,',
    '3) choose whether they should practise it, read about it, or watch a lesson.',
    '',
    'HARD RULES (a violation makes your answer unusable):',
    '- You MUST set next_skill_id to one of the exact id="..." values listed below. Never invent an id, never modify one.',
    '- You do NOT choose any link, page, or resource. You only choose the skill and the step type; the system finds the real resource.',
    '- Base everything on the data given. Do not invent facts about the student.',
    '- Keep weakness_explanation to 2–4 short sentences. Keep reason and encouragement to one sentence each.',
  ].join('\n');

  const focusLine =
    opts.focusSkillId && allowed.some((s) => s.skill_id === opts.focusSkillId)
      ? `\nThe student specifically wants help with the skill id="${opts.focusSkillId}". Prefer it for next_skill_id unless another listed skill is clearly more urgent.`
      : '';

  const questionLine = opts.question
    ? `\nThe student also asked: "${opts.question.slice(0, 500)}". Address it briefly in weakness_explanation, but still obey the rules.`
    : '';

  const user = [
    `Overall accuracy so far: ${snapshot.summary.overall_accuracy}%. ` +
      `Skills tracked: ${snapshot.summary.total_skills_tracked} ` +
      `(${snapshot.summary.skills_weak} weak, ${snapshot.summary.skills_due_for_review} due for review).`,
    '',
    'SKILLS YOU MAY CHOOSE FROM (use one of these exact ids for next_skill_id):',
    skillLines || '(none yet)',
    '',
    weaknessLines ? `HOW THIS STUDENT TENDS TO GET THINGS WRONG:\n${weaknessLines}` : '',
    '',
    recLines ? `THE ENGINE ALREADY RANKS THESE AS TOP PICKS:\n${recLines}` : '',
    focusLine,
    questionLine,
  ]
    .filter(Boolean)
    .join('\n');

  return { system, user };
}

// ── Output validation (pure) — the structural guardrail ─────────────────────

/**
 * Parse + guardrail-check the model's raw JSON. Any skill id outside the
 * snapshot allowlist is rejected and replaced with the engine's safest pick,
 * with the substitution recorded in `violations`. Returns null only if the raw
 * string can't be parsed into the required shape at all.
 */
export function validateTutorOutput(
  raw: string,
  snapshot: PersonaSnapshot,
): { output: TutorModelOutput; violations: string[] } | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== 'object') return null;
  const p = parsed as Record<string, unknown>;
  if (
    typeof p.weakness_explanation !== 'string' ||
    typeof p.next_skill_id !== 'string' ||
    typeof p.next_step !== 'string' ||
    typeof p.reason !== 'string' ||
    typeof p.encouragement !== 'string'
  ) {
    return null;
  }

  const violations: string[] = [];
  const validIds = new Set([
    ...snapshot.skills.map((s) => s.skill_id),
    ...snapshot.recommended.map((r) => r.skill_id).filter((x): x is string => !!x),
  ]);

  let nextSkillId = p.next_skill_id;
  if (!validIds.has(nextSkillId)) {
    // The model invented or mangled an id — fall back to the engine's pick.
    const fallback =
      snapshot.recommended[0]?.skill_id ??
      snapshot.skills.find((s) => s.proficiency === 'weak')?.skill_id ??
      snapshot.skills[0]?.skill_id;
    violations.push(`model returned off-list skill id "${nextSkillId}"; replaced with "${fallback ?? 'none'}"`);
    nextSkillId = fallback ?? '';
  }

  let nextStep = p.next_step as NextStep;
  if (nextStep !== 'practice' && nextStep !== 'read' && nextStep !== 'watch') {
    violations.push(`model returned invalid step "${p.next_step}"; defaulted to "practice"`);
    nextStep = 'practice';
  }

  return {
    output: {
      weakness_explanation: p.weakness_explanation,
      next_skill_id: nextSkillId,
      next_step: nextStep,
      reason: p.reason,
      encouragement: p.encouragement,
    },
    violations,
  };
}

// ── Orchestration ───────────────────────────────────────────────────────────

/**
 * Run the tutor end-to-end. `complete` is injected (DI) so the Anthropic call
 * lives in the app layer; `resolveResource` is injected so the engine — not the
 * AI — turns a (skillId, step) into a real ResourceLink + action URL.
 */
export async function runTutor(
  snapshot: PersonaSnapshot,
  opts: TutorOptions,
  complete: TutorComplete,
  resolveResource: (
    skillId: string,
    step: NextStep,
  ) => Promise<{ resource: TutorResolvedResource | null; action_url: string }>,
): Promise<TutorResponse> {
  const base = {
    tutor_version: TUTOR_VERSION,
    snapshot_version: snapshot.snapshot_version ?? PERSONA_SNAPSHOT_VERSION,
    generated_at: snapshot.generated_at,
  };

  // Empty persona → no LLM call, no spend.
  if (snapshot.skills.length === 0) {
    return {
      ...base,
      explanation:
        "You haven't practised enough yet for me to spot patterns. Try a few questions and I'll start guiding you.",
      next: { skill_id: '', skill_name: '', step: 'practice', reason: 'Start practising to build your profile.', action_url: '/the-crucible', resource: null },
      encouragement: 'Every expert started with question one. Begin now.',
      guardrail_violations: [],
      model_used: 'none',
      is_empty: true,
    };
  }

  const { system, user } = buildTutorPrompt(snapshot, opts);
  const routine = !opts.question; // free-text question → harder ask → stronger model
  const raw = await complete({ system, user, schema: TUTOR_OUTPUT_SCHEMA, routine });

  const validated = validateTutorOutput(raw, snapshot);
  if (!validated) {
    // Model produced unparseable output — degrade gracefully to the engine pick.
    const fallbackId = snapshot.recommended[0]?.skill_id ?? snapshot.skills[0].skill_id;
    const { resource, action_url } = await resolveResource(fallbackId, 'practice');
    const name = snapshot.skills.find((s) => s.skill_id === fallbackId)?.name ?? fallbackId;
    return {
      ...base,
      explanation:
        'Here is what to focus on next based on your recent practice.',
      next: { skill_id: fallbackId, skill_name: name, step: 'practice', reason: 'This is your weakest recent area.', action_url, resource },
      encouragement: 'Keep going — steady practice is what moves the needle.',
      guardrail_violations: ['model output could not be parsed; used engine fallback'],
      model_used: routine ? 'routine' : 'strong',
      is_empty: false,
    };
  }

  const { output, violations } = validated;
  const { resource, action_url } = await resolveResource(output.next_skill_id, output.next_step);
  const skillName =
    snapshot.skills.find((s) => s.skill_id === output.next_skill_id)?.name ??
    snapshot.recommended.find((r) => r.skill_id === output.next_skill_id)?.name ??
    output.next_skill_id;

  // If the AI said read/watch but no resource exists, the engine downgrades the
  // step to practice (resolveResource returns null) — record it transparently.
  const effectiveStep: NextStep = output.next_step !== 'practice' && !resource ? 'practice' : output.next_step;
  if (effectiveStep !== output.next_step) {
    violations.push(`no ${output.next_step} resource exists for "${output.next_skill_id}"; downgraded to practice`);
  }

  return {
    ...base,
    explanation: output.weakness_explanation,
    next: {
      skill_id: output.next_skill_id,
      skill_name: skillName,
      step: effectiveStep,
      reason: output.reason,
      action_url,
      resource,
    },
    encouragement: output.encouragement,
    guardrail_violations: violations,
    model_used: routine ? 'routine' : 'strong',
    is_empty: false,
  };
}
