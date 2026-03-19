// POST /api/v2/user/example-views
// Records which worked examples a student viewed before a practice session.
// Fire-and-forget from client — silently ignored on auth failure.

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import connectToDatabase from '@/lib/mongodb';
import mongoose from 'mongoose';

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

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { chapterId, sessionId, viewedExamples, completedAll } = body;

    if (!chapterId || !sessionId || !Array.isArray(viewedExamples)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();
    await mongoose.connection.db!.collection('example_view_sessions').insertOne({
      studentId:      userId,
      chapterId,
      sessionId,
      viewedExamples, // [{ displayId, microConcept, timeSpentMs }]
      completedAll:   !!completedAll,
      viewedAt:       new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[example-views] POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
