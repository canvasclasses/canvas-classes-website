// PUBLIC GET: returns active questionnaire items for students.
// Admin POST: replaces the whole questionnaire with a fresh set (used by
// admin "reset to defaults" action).

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectToDatabase from '@/lib/mongodb';
import { CareerQuestion } from '@/lib/models/CareerQuestion';
import { requireAdminUser, errorResponse, rateLimit, requestIp } from '../_shared';

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

const QuestionUpsertSchema = z.object({
  _id: z.string().min(1).max(64),
  dimension: z.enum(['aptitude', 'interest', 'work_style', 'values', 'constraints', 'future']),
  sub_facet: z.string().max(64).optional(),
  order: z.number().int(),
  prompt: z.string().min(1).max(1000),
  help_text: z.string().max(500).optional(),
  format: z.enum(['force_choice', 'likert5', 'rank', 'single_select', 'slider']),
  mode: z.enum(['contribution', 'constraint']),
  constraint_key: z.string().max(64).optional(),
  options: z.array(z.object({
    id: z.string().min(1).max(32),
    label: z.string().min(1).max(500),
    contributes: z.record(z.string(), z.number()).optional(),
    value: z.union([z.string(), z.number(), z.boolean()]).optional(),
  })).min(2).max(10),
  is_active: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  const guard = await requireAdminUser(request);
  if (!guard.ok) return guard.response;

  try {
    const body = await request.json();
    const parsed = z.object({ items: z.array(QuestionUpsertSchema).min(1).max(200) }).safeParse(body);
    if (!parsed.success) return errorResponse('Invalid payload', 400);

    await connectToDatabase();
    // Upsert — do not drop existing items so the admin can layer changes.
    const ops = parsed.data.items.map((item) => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { ...item, is_active: item.is_active ?? true, updated_at: new Date() } },
        upsert: true,
      },
    }));
    await CareerQuestion.bulkWrite(ops);
    return NextResponse.json({ ok: true, count: ops.length });
  } catch (e) {
    console.error('POST /career-explorer/questions', e);
    return errorResponse('Failed to save questions');
  }
}
