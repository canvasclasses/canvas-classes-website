import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import connectToDatabase from '@/lib/mongodb';
import TestResult from '@/lib/models/TestResult';
import { nanoid } from 'nanoid';

async function getUserId(req: NextRequest): Promise<string | null> {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;
    const token = authHeader.substring(7);
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) return null;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;
    return user.id;
}

// ─── POST /api/v2/test-results ───────────────────────────────────────────────
// Body: { chapter_id, test_config, questions, score, timing, saved_to_progress }
// Saves a complete test result for dashboard display
export async function POST(req: NextRequest) {
    try {
        const userId = await getUserId(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { chapter_id, test_config, questions, score, timing, saved_to_progress } = body;

        if (!chapter_id || !test_config || !questions || !score || !timing) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await connectToDatabase();

        const testResult = new TestResult({
            _id: nanoid(16), // Generate unique ID for this test result
            user_id: userId,
            chapter_id,
            test_config,
            questions,
            score,
            timing,
            saved_to_progress: saved_to_progress ?? false,
        });

        await testResult.save();

        return NextResponse.json({ 
            success: true, 
            test_result_id: testResult._id,
            message: 'Test result saved successfully' 
        });
    } catch (err) {
        console.error('[POST /api/v2/test-results]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// ─── GET /api/v2/test-results?chapterId=xxx&limit=10 ─────────────────────────
// Returns: list of test results for the user, optionally filtered by chapter
export async function GET(req: NextRequest) {
    try {
        const userId = await getUserId(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const chapterId = req.nextUrl.searchParams.get('chapterId');
        const limitParam = req.nextUrl.searchParams.get('limit');
        const limit = limitParam ? parseInt(limitParam, 10) : 20;

        await connectToDatabase();

        const query: any = { user_id: userId };
        if (chapterId) query.chapter_id = chapterId;

        const results = await TestResult.find(query)
            .sort({ created_at: -1 })
            .limit(limit)
            .lean();

        return NextResponse.json({ 
            success: true, 
            results,
            count: results.length 
        });
    } catch (err) {
        console.error('[GET /api/v2/test-results]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
