// Admin GET / PATCH / DELETE for a single CareerSpec.
//
// Routing by `_id` (UUID), NOT slug. Reason: a slug may change (an admin
// might rename "software-engineer-product" to "swe-product"), and we don't
// want admin URLs or edit-form deep links to break on rename. The public
// student route uses `slug` for friendly URLs (handled separately).

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@canvas/data/db/mongodb';
import { CareerSpec } from '@canvas/data/models/CareerSpec';
import { requireAdminUser, errorResponse } from '../../_shared';

// Same whitelist as the create route. Re-declared (not imported) because the
// allowed keys for PATCH could legitimately diverge in the future — e.g. we
// might forbid slug changes on PATCH if SEO / shared-link breakage becomes a concern.
const ALLOWED_KEYS = new Set([
  'slug', 'display_name', 'category', 'archetype', 'linked_career_path_slug',
  'one_line', 'what_it_is_today', 'what_parents_think_it_is', 'common_misconceptions',
  'income', 'sub_paths', 'ai_exposure', 'moat_skills', 'educational_path',
  'cons', 'india_context', 'adjacent_careers', 'example_paths',
  'sources', 'authors', 'last_full_review', 'next_review_due',
  'status', 'published_at',
]);

function whitelist(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) if (ALLOWED_KEYS.has(k)) out[k] = v;
  return out;
}

// ── GET one ─────────────────────────────────────────────────────────────────
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const guard = await requireAdminUser(request);
  if (!guard.ok) return guard.response;

  const { id } = await context.params;
  try {
    await connectToDatabase();
    const item = await CareerSpec.findOne({ _id: id, deleted_at: null }).lean();
    if (!item) return errorResponse('Not found', 404);
    return NextResponse.json({ item });
  } catch (e) {
    console.error('GET /career-explorer/specs/[id]', e);
    return errorResponse('Failed to load career spec');
  }
}

// ── PATCH ──────────────────────────────────────────────────────────────────
// Auto-publish guard: if the caller is flipping status to 'published' for the
// first time, we stamp `published_at` server-side. This keeps the lifecycle
// metadata honest even if the form forgets to send it.
export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const guard = await requireAdminUser(request);
  if (!guard.ok) return guard.response;

  const { id } = await context.params;
  try {
    const raw = await request.json().catch(() => null);
    if (typeof raw !== 'object' || !raw) return errorResponse('Invalid payload', 400);
    const data = whitelist(raw as Record<string, unknown>);

    await connectToDatabase();
    const existing = await CareerSpec.findOne({ _id: id, deleted_at: null });
    if (!existing) return errorResponse('Not found', 404);

    // Stamp published_at on the first transition to 'published'.
    const becomingPublished =
      data.status === 'published' && existing.status !== 'published' && !existing.published_at;
    if (becomingPublished) data.published_at = new Date();

    const adminEmail = guard.user?.email || 'admin@canvasclasses.in';

    // We assign + .save() (vs $set + findByIdAndUpdate) so the schema's
    // pre-save hook fires — that hook bumps `updated_at` and `version`.
    Object.assign(existing, data);
    existing.updated_by = adminEmail;
    await existing.save();

    return NextResponse.json({ item: existing.toObject() });
  } catch (e: unknown) {
    if (e && typeof e === 'object' && (e as { name?: string }).name === 'ValidationError') {
      const errors = (e as { errors?: Record<string, { path: string; message: string }> }).errors || {};
      const fields = Object.values(errors).map((er) => ({ path: er.path, message: er.message }));
      return NextResponse.json({ error: 'Validation failed', fields }, { status: 400 });
    }
    if (e && typeof e === 'object' && (e as { code?: number }).code === 11000) {
      return errorResponse('A career spec with that slug already exists', 409);
    }
    console.error('PATCH /career-explorer/specs/[id]', e);
    return errorResponse('Failed to update career spec');
  }
}

// ── DELETE ─────────────────────────────────────────────────────────────────
// Soft-delete only. Stamps `deleted_at` + `deleted_by` so we can restore later
// and so the audit trail remains. Mirror of the Question.v2 pattern.
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const guard = await requireAdminUser(request);
  if (!guard.ok) return guard.response;

  const { id } = await context.params;
  try {
    await connectToDatabase();
    const adminEmail = guard.user?.email || 'admin@canvasclasses.in';
    const res = await CareerSpec.findOneAndUpdate(
      { _id: id, deleted_at: null },
      { $set: { deleted_at: new Date(), deleted_by: adminEmail, status: 'archived' } },
    );
    if (!res) return errorResponse('Not found', 404);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('DELETE /career-explorer/specs/[id]', e);
    return errorResponse('Failed to delete career spec');
  }
}
