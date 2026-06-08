/**
 * POST /api/v2/user/tutor
 *
 * The guardrailed AI tutor (Phase 2b, ADR-011). Reads the authenticated
 * student's persona snapshot, asks Claude to interpret it, and returns
 * plain-language guidance + a deterministically-resolved next step.
 *
 * Safety / cost posture:
 *  - PER-USER → force-dynamic (CLAUDE.md §10.1); never edge-cached; behind auth.
 *  - Authenticated only; rate-limited per user (LLM calls cost money).
 *  - The snapshot is cached briefly per user (2c) so repeated asks don't recompute.
 *  - Model routing (2c): routine "what next" asks → cheap model; free-text
 *    questions → the strong model.
 *  - The AI can only pick a real skill id + a step type; the engine resolves the
 *    actual resource. Guardrail violations are surfaced in the response.
 */
import 'server-only';
import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { createRateLimiter } from '@canvas/core/rate-limit';
import { buildPersonaSnapshot, type PersonaSnapshot } from '@canvas/persona/persona-snapshot';
import { getResourceForConcept } from '@canvas/persona/recommendation-engine';
import {
  runTutor,
  type NextStep,
  type TutorComplete,
  type TutorResolvedResource,
} from '@canvas/persona/tutor';

export const dynamic = 'force-dynamic';

// Model routing (2c). Opus 4.8 is the strong tier; Haiku 4.5 handles routine
// "what should I do next" asks. These are the only two tiers; change here.
const TUTOR_MODELS = { routine: 'claude-haiku-4-5', strong: 'claude-opus-4-8' } as const;

// Per-user LLM rate limit. In-memory + per-instance (CLAUDE.md §8.11) — fine for
// this low-volume authenticated surface; move to Redis at scale.
const limiter = createRateLimiter({ max: 12, windowMs: 60_000 });

// Short per-user snapshot cache (2c) — avoids recomputing the projection on
// rapid repeat asks. Per-instance, best-effort.
const SNAPSHOT_TTL_MS = 60_000;
const snapshotCache = new Map<string, { at: number; snapshot: PersonaSnapshot }>();
const SNAPSHOT_CACHE_CAP = 2_000;

async function getSnapshotCached(userId: string): Promise<PersonaSnapshot> {
  const hit = snapshotCache.get(userId);
  const now = Date.now();
  if (hit && now - hit.at < SNAPSHOT_TTL_MS) return hit.snapshot;
  const snapshot = await buildPersonaSnapshot(userId);
  if (snapshotCache.size > SNAPSHOT_CACHE_CAP) snapshotCache.clear(); // crude cap
  snapshotCache.set(userId, { at: now, snapshot });
  return snapshot;
}

let anthropic: Anthropic | null = null;
function getClient(): Anthropic {
  if (!anthropic) anthropic = new Anthropic(); // reads ANTHROPIC_API_KEY from env
  return anthropic;
}

// The injected LLM call. Routes to the right model and constrains output to the
// tutor schema via structured outputs. Effort is Opus-only (Haiku 400s on it).
const complete: TutorComplete = async ({ system, user, schema, routine }) => {
  const model = routine ? TUTOR_MODELS.routine : TUTOR_MODELS.strong;
  const client = getClient();
  const res = await client.messages.create({
    model,
    max_tokens: 1024,
    system,
    messages: [{ role: 'user', content: user }],
    // Structured outputs — guarantees parseable JSON in the tutor schema shape.
    output_config: {
      format: { type: 'json_schema', schema: schema as Record<string, unknown> },
      ...(routine ? {} : { effort: 'medium' as const }),
    },
  } as Parameters<typeof client.messages.create>[0]);

  const block = (res as { content?: Array<{ type: string; text?: string }> }).content?.find(
    (b) => b.type === 'text',
  );
  return block?.text ?? '';
};

// The engine — NOT the AI — turns (skillId, step) into a real resource + URL.
async function resolveResource(
  skillId: string,
  step: NextStep,
): Promise<{ resource: TutorResolvedResource | null; action_url: string }> {
  const practiceUrl = skillId.startsWith('bk:')
    ? '/class-9'
    : `/the-crucible?focus=${encodeURIComponent(skillId)}`;

  if (step === 'practice' || !skillId) return { resource: null, action_url: practiceUrl };

  const preferred = step === 'watch' ? ('video_lecture' as never) : undefined;
  const r = await getResourceForConcept(skillId, preferred);
  if (!r) return { resource: null, action_url: practiceUrl }; // none exists → practice fallback
  return {
    resource: { type: r.type, title: r.title, url: r.url, duration_minutes: r.duration_minutes },
    action_url: r.url,
  };
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!limiter.check(userId).ok) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    // Validate the (small) body. Both fields optional; whitelist only.
    let focusSkillId: string | undefined;
    let question: string | undefined;
    try {
      const body = await req.json();
      if (body && typeof body === 'object') {
        if (typeof body.focus_skill_id === 'string') focusSkillId = body.focus_skill_id.slice(0, 128);
        if (typeof body.question === 'string') question = body.question.slice(0, 1000);
      }
    } catch {
      /* empty body is fine */
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'Tutor is not configured' }, { status: 503 });
    }

    const snapshot = await getSnapshotCached(userId);
    const result = await runTutor(snapshot, { focusSkillId, question }, complete, resolveResource);

    return NextResponse.json(result);
  } catch (err) {
    console.error('[POST /api/v2/user/tutor]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
