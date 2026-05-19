// PUBLIC GET: returns active questionnaire items for students. The matching
// admin POST (replace/upsert questionnaire) lives in apps/admin.

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@canvas/data/db/mongodb';
import { CareerQuestion } from '@canvas/data/models/CareerQuestion';
import { errorResponse, rateLimit, requestIp } from '../_shared';

export async function GET(request: NextRequest) {
  const ip = requestIp(request);
  const rl = rateLimit(`ce-q-${ip}`, 60);
  if (!rl.ok) return errorResponse('Too many requests', 429);

  try {
    await connectToDatabase();
    const items = await CareerQuestion.find({ is_active: true }).sort({ order: 1 }).limit(200).lean();
    return NextResponse.json({ items });
  } catch (e) {
    console.error('GET /career-explorer/questions', e);
    return errorResponse('Failed to load questions');
  }
}
