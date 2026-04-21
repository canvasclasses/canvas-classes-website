// Admin-only: override the bucket of a computed match. Used by the admin
// panel to hand-correct the matcher while we\'re still tuning weights.

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectToDatabase from '@/lib/mongodb';
import { CareerMatch } from '@/lib/models/CareerMatch';
import { requireAdminUser, errorResponse } from '../../../_shared';

const OverrideSchema = z.object({
  bucket: z.enum(['strong_fit', 'hidden_gem', 'stretch', 'excluded']),
  note: z.string().max(500).optional(),
  clear: z.boolean().optional(),
});

export async function PATCH(request: NextRequest, context: { params: Promise<{ matchId: string }> }) {
  const guard = await requireAdminUser(request);
  if (!guard.ok) return guard.response;

  const { matchId } = await context.params;
  try {
    const body = await request.json();
    const parsed = OverrideSchema.safeParse(body);
    if (!parsed.success) return errorResponse('Invalid payload', 400);

    await connectToDatabase();
    const update = parsed.data.clear
      ? { $unset: { admin_override: '' }, $set: { updated_at: new Date() } }
      : {
          $set: {
            admin_override: {
              bucket: parsed.data.bucket,
              note: parsed.data.note,
              by: guard.user.email ?? guard.user.id,
              at: new Date(),
            },
            updated_at: new Date(),
          },
        };
    const updated = await CareerMatch.findByIdAndUpdate(matchId, update, { new: true }).lean();
    if (!updated) return errorResponse('Not found', 404);
    return NextResponse.json({ item: updated });
  } catch (e) {
    console.error('PATCH /career-explorer/matches/[matchId]/override', e);
    return errorResponse('Failed to override match');
  }
}
