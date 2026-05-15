import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import connectToDatabase from '@/lib/mongodb';
import BitsatPlanProgress from '@/lib/models/BitsatPlanProgress';

const PLAN_VERSION = 'v1';
const TOTAL_DAYS = 30;
const MAX_MODULES = 500;
const MODULE_ID_RE = /^([1-9]|[12][0-9]|30)-(\d{1,2})$/;

async function getUserId(req: NextRequest): Promise<string | null> {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;
    const token = authHeader.slice(7);
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;
    return user.id;
}

function sanitizeDays(input: unknown): number[] {
    if (!Array.isArray(input)) return [];
    const set = new Set<number>();
    for (const d of input) {
        const n = Number(d);
        if (Number.isInteger(n) && n >= 1 && n <= TOTAL_DAYS) set.add(n);
    }
    return Array.from(set).sort((a, b) => a - b);
}

function sanitizeModules(input: unknown): string[] {
    if (!Array.isArray(input)) return [];
    const set = new Set<string>();
    for (const m of input) {
        if (typeof m !== 'string') continue;
        if (!MODULE_ID_RE.test(m)) continue;
        set.add(m);
        if (set.size >= MAX_MODULES) break;
    }
    return Array.from(set).sort();
}

export async function GET(req: NextRequest) {
    try {
        const userId = await getUserId(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectToDatabase();
        const doc = await BitsatPlanProgress.findById(userId).lean<{
            completed_days?: number[];
            completed_modules?: string[];
        } | null>();
        return NextResponse.json({
            completed_days: doc?.completed_days ?? [],
            completed_modules: doc?.completed_modules ?? [],
        });
    } catch (err) {
        console.error('[GET /api/bitsat-plan/progress]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const userId = await getUserId(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json().catch(() => null);
        if (!body || typeof body !== 'object') {
            return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
        }
        const completed_days = sanitizeDays((body as { completed_days?: unknown }).completed_days);
        const completed_modules = sanitizeModules(
            (body as { completed_modules?: unknown }).completed_modules
        );

        await connectToDatabase();

        const MAX_RETRIES = 3;
        for (let i = 0; i <= MAX_RETRIES; i++) {
            try {
                let doc = await BitsatPlanProgress.findById(userId);
                if (!doc) {
                    doc = new BitsatPlanProgress({
                        _id: userId,
                        completed_days,
                        completed_modules,
                        plan_version: PLAN_VERSION,
                    });
                } else {
                    doc.completed_days = completed_days;
                    doc.completed_modules = completed_modules;
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

        return NextResponse.json({ success: true, completed_days, completed_modules });
    } catch (err) {
        console.error('[PUT /api/bitsat-plan/progress]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
