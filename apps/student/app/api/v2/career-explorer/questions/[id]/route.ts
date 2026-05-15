import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectToDatabase from '@/lib/mongodb';
import { CareerQuestion } from '@/lib/models/CareerQuestion';
import { requireAdminUser, errorResponse } from '../../_shared';

const PatchSchema = z.object({
  prompt: z.string().min(1).max(1000).optional(),
  help_text: z.string().max(500).optional(),
  order: z.number().int().optional(),
  dimension: z.enum(['aptitude', 'interest', 'work_style', 'values', 'constraints', 'future']).optional(),
  sub_facet: z.string().max(64).optional(),
  format: z.enum(['force_choice', 'likert5', 'rank', 'single_select', 'slider']).optional(),
  mode: z.enum(['contribution', 'constraint']).optional(),
  constraint_key: z.string().max(64).optional(),
  options: z.array(z.object({
    id: z.string().min(1).max(32),
    label: z.string().min(1).max(500),
    contributes: z.record(z.string(), z.number()).optional(),
    value: z.union([z.string(), z.number(), z.boolean()]).optional(),
  })).min(2).max(10).optional(),
  is_active: z.boolean().optional(),
});

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const guard = await requireAdminUser(request);
  if (!guard.ok) return guard.response;

  const { id } = await context.params;
  try {
    const body = await request.json();
    const parsed = PatchSchema.safeParse(body);
    if (!parsed.success) return errorResponse('Invalid payload', 400);

    await connectToDatabase();
    const updated = await CareerQuestion.findByIdAndUpdate(
      id,
      { $set: { ...parsed.data, updated_at: new Date() } },
      { new: true },
    ).lean();
    if (!updated) return errorResponse('Not found', 404);
    return NextResponse.json({ item: updated });
  } catch (e) {
    console.error('PATCH /career-explorer/questions/[id]', e);
    return errorResponse('Failed to update question');
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const guard = await requireAdminUser(request);
  if (!guard.ok) return guard.response;

  const { id } = await context.params;
  try {
    await connectToDatabase();
    const res = await CareerQuestion.findByIdAndUpdate(id, { $set: { is_active: false, updated_at: new Date() } });
    if (!res) return errorResponse('Not found', 404);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('DELETE /career-explorer/questions/[id]', e);
    return errorResponse('Failed to delete question');
  }
}
