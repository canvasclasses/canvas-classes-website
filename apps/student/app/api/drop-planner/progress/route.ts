import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import connectToDatabase from '@canvas/data/db/mongodb';
import DropPlannerProgress from '@canvas/data/models/DropPlannerProgress';
import { parseResourceUrl } from '@/app/study-planner/lib/toEmbed';

const PLAN_VERSION = 'v1';
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_COMPLETED = 600;
const MAX_REVISION = 600;
const MAX_CUSTOM_PER_CHAPTER = 10;
const MAX_CUSTOM_TOTAL = 200;
const MAX_KEYS = 200;

async function getUserId(req: NextRequest): Promise<string | null> {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;
    const token = authHeader.slice(7);
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser(token);
    if (error || !user) return null;
    return user.id;
}

const ResourceKind = z.enum(['lecture', 'notes', 'questions', 'flashcards', 'tool']);

const UserResource = z.object({
    id: z.string().min(1).max(64),
    label: z.string().min(1).max(120),
    kind: ResourceKind,
    url: z.string().url().max(2048),
    embeddable: z.boolean(),
    addedAt: z.string().max(40),
});

const cappedRecord = <V extends z.ZodTypeAny>(value: V) =>
    z.record(z.string().max(80), value).refine((r) => Object.keys(r).length <= MAX_KEYS, 'too many keys');

const RevisionEntry = z.object({
    stage: z.number().int().min(0).max(5),
    dueOn: z.string().regex(ISO_DATE),
    lastOn: z.string().regex(ISO_DATE),
});

// One mode slice. Same shape that was the entire StateSchema in v1.
const ModeStateSchema = z.object({
    currentSubject: z.enum(['chemistry', 'physics', 'math']).default('chemistry'),
    completed: z.array(z.string().max(120)).max(MAX_COMPLETED).default([]),
    deadlines: cappedRecord(z.string().regex(ISO_DATE)).default({}),
    chapterDays: cappedRecord(z.number().int().min(1).max(30)).default({}),
    diagnostic: cappedRecord(z.enum(['strong', 'weak', 'new'])).default({}),
    notes: cappedRecord(z.string().max(4000)).default({}),
    stars: cappedRecord(z.array(z.string().max(64)).max(40)).default({}),
    revisionStages: cappedRecord(RevisionEntry).default({}),
    weekActivity: z.array(z.string().regex(ISO_DATE)).max(MAX_REVISION).default([]),
    // roadmapOrder / bufferBlocks are per-subject (Record<subject, …>). Accept
    // the legacy flat shapes too (older clients) — the client migrates on read.
    roadmapOrder: z.union([
        z.array(z.string().max(80)).max(MAX_KEYS),
        z.record(z.string().max(20), z.array(z.string().max(80)).max(MAX_KEYS)),
    ]).default({}),
    bufferBlocks: z.union([
        z.record(z.string().max(20), cappedRecord(z.object({ days: z.number().int().min(1).max(14) }))),
        cappedRecord(z.object({ days: z.number().int().min(1).max(14) })),
    ]).default({}),
    lastAccessedChapter: z.string().max(80).nullable().default(null),
    customResources: cappedRecord(z.array(UserResource).max(MAX_CUSTOM_PER_CHAPTER)).default({}),
    settings: z
        .object({
            targetDate: z.string().regex(ISO_DATE).optional(),
            startDate: z.string().regex(ISO_DATE).optional(),
            track: z.enum(['jee_main', 'jee_advanced', 'neet']).optional(),
        })
        .default({}),
    streak: z
        .object({ count: z.number().int().min(0).max(100000), lastActiveDate: z.string().max(40) })
        .default({ count: 0, lastActiveDate: '' }),
});

const PlannerMode = z.enum(['class11', 'class12', 'dropper']);

// v2 schema: whole-document state with per-mode slices.
// All three modes must be present in the payload. The client always sends
// the full document (`emptyFullState()` seeds the three modes on first run),
// so this is a hard requirement, not a defaulted one.
const FullStateSchema = z.object({
    currentMode: PlannerMode.default('dropper'),
    modes: z.object({
        class11: ModeStateSchema,
        class12: ModeStateSchema,
        dropper: ModeStateSchema,
    }),
    schemaVersion: z.literal(2).default(2),
});

// v1 legacy schema: flat single-mode. We migrate to v2 on the server too.
const LegacyStateSchema = ModeStateSchema.extend({ schemaVersion: z.literal(1).optional() });

// Accept either shape. Older clients that haven't picked up the new bundle
// can still write — we migrate v1 → v2 on the way in.
const StateSchema = z.union([FullStateSchema, LegacyStateSchema]).transform((parsed) => {
    if ('modes' in parsed) return parsed;
    // legacy → wrap into modes.dropper
    return {
        currentMode: 'dropper' as const,
        modes: {
            class11: ModeStateSchema.parse({}),
            class12: ModeStateSchema.parse({}),
            dropper: parsed,
        },
        schemaVersion: 2 as const,
    };
});

// Re-validate every student-added URL server-side: re-parse against the host
// allowlist and recompute `embeddable`. Anything that no longer parses is dropped.
// Never trust a client-supplied embed src.
type ModeCustomResources = z.infer<typeof ModeStateSchema>['customResources'];
function sanitizeCustomResources(input: ModeCustomResources, runningTotal: { n: number }): ModeCustomResources {
    const out: ModeCustomResources = {};
    for (const [chapterId, list] of Object.entries(input)) {
        const cleaned = [];
        for (const r of list) {
            if (runningTotal.n >= MAX_CUSTOM_TOTAL) break;
            const parsed = parseResourceUrl(r.url);
            if (!parsed.ok) continue;
            cleaned.push({ ...r, url: parsed.normalizedUrl, embeddable: parsed.embeddable });
            runningTotal.n++;
        }
        if (cleaned.length) out[chapterId] = cleaned;
    }
    return out;
}

export async function GET(req: NextRequest) {
    try {
        const userId = await getUserId(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        await connectToDatabase();
        const doc = await DropPlannerProgress.findById(userId).lean<{ state?: Record<string, unknown> } | null>();
        return NextResponse.json({ state: doc?.state ?? null });
    } catch (err) {
        console.error('[GET /api/drop-planner/progress]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const userId = await getUserId(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json().catch(() => null);
        const parsed = StateSchema.safeParse((body as { state?: unknown })?.state ?? body);
        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
        }
        // Sanitize per-mode customResources against the shared cap.
        const total = { n: 0 };
        const state = {
            ...parsed.data,
            modes: {
                class11: { ...parsed.data.modes.class11, customResources: sanitizeCustomResources(parsed.data.modes.class11.customResources, total) },
                class12: { ...parsed.data.modes.class12, customResources: sanitizeCustomResources(parsed.data.modes.class12.customResources, total) },
                dropper: { ...parsed.data.modes.dropper, customResources: sanitizeCustomResources(parsed.data.modes.dropper.customResources, total) },
            },
        };

        await connectToDatabase();

        const MAX_RETRIES = 3;
        for (let i = 0; i <= MAX_RETRIES; i++) {
            try {
                let doc = await DropPlannerProgress.findById(userId);
                if (!doc) {
                    doc = new DropPlannerProgress({ _id: userId, state, plan_version: PLAN_VERSION });
                } else {
                    doc.state = state;
                    doc.plan_version = PLAN_VERSION;
                }
                await doc.save();
                break;
            } catch (concurrencyErr: unknown) {
                const isVersionError =
                    concurrencyErr instanceof Error && concurrencyErr.name === 'VersionError';
                if (isVersionError && i < MAX_RETRIES) continue;
                throw concurrencyErr;
            }
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[PUT /api/drop-planner/progress]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
