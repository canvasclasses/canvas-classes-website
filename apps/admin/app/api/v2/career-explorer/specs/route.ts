// Admin CRUD for CareerSpec — the editorial Career Live Spec.
//
// GET  → list all specs (drafts + published) with summary fields for the listing page.
// POST → create a new spec. Body is field-whitelisted; the Mongoose schema does
//        per-field validation (required-ness, enums, regex on date fields, etc.).
//
// Public reads (the student-facing /career-guide page) live separately under
// apps/student — they only return `status: published` and a subset of fields.

import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import connectToDatabase from '@canvas/data/db/mongodb';
import { CareerSpec } from '@canvas/data/models/CareerSpec';
import { requireAdminUser, errorResponse } from '../_shared';

// Top-level field whitelist — mirrors the CareerSpec interface in
// packages/data/models/CareerSpec.ts. We never spread the raw body into Mongo
// (per §8 security rules). The Mongoose schema rejects malformed sub-fields.
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

// ── GET: list specs for the admin listing page ─────────────────────────────
export async function GET(request: NextRequest) {
  const guard = await requireAdminUser(request);
  if (!guard.ok) return guard.response;

  try {
    await connectToDatabase();
    // Projection picks only the fields the listing page actually shows — keeps
    // payload small even when individual specs grow to 30 KB each.
    const items = await CareerSpec.find({ deleted_at: null })
      .select('slug display_name category archetype status last_full_review next_review_due authors updated_at version')
      .sort({ updated_at: -1 })
      .limit(200)
      .lean();
    return NextResponse.json({ items });
  } catch (e) {
    console.error('GET /career-explorer/specs', e);
    return errorResponse('Failed to list career specs');
  }
}

// ── POST: create a new spec ─────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const guard = await requireAdminUser(request);
  if (!guard.ok) return guard.response;

  try {
    const raw = await request.json().catch(() => null);
    if (typeof raw !== 'object' || !raw) return errorResponse('Invalid payload', 400);
    const data = whitelist(raw as Record<string, unknown>);

    if (!data.slug || typeof data.slug !== 'string') {
      return errorResponse('slug is required', 400);
    }

    await connectToDatabase();

    // Slug uniqueness check before insert. The unique index handles the race
    // condition (E11000 → 409) — we just provide a friendlier message.
    const existing = await CareerSpec.findOne({ slug: data.slug, deleted_at: null }).lean();
    if (existing) return errorResponse('A career spec with that slug already exists', 409);

    const adminEmail = guard.user?.email || 'admin@canvasclasses.in';
    const created = await CareerSpec.create({
      _id: randomUUID(),
      ...data,
      created_by: adminEmail,
      updated_by: adminEmail,
      version: 1,
    });
    return NextResponse.json({ item: created.toObject() }, { status: 201 });
  } catch (e: unknown) {
    // Surface Mongoose validation errors as 400s with the safe field list so
    // the admin form can show useful errors — but never the raw error message
    // (could include internal field paths).
    if (e && typeof e === 'object' && (e as { name?: string }).name === 'ValidationError') {
      const errors = (e as { errors?: Record<string, { path: string; message: string }> }).errors || {};
      const fields = Object.values(errors).map((er) => ({ path: er.path, message: er.message }));
      return NextResponse.json({ error: 'Validation failed', fields }, { status: 400 });
    }
    if (e && typeof e === 'object' && (e as { code?: number }).code === 11000) {
      return errorResponse('A career spec with that slug already exists', 409);
    }
    console.error('POST /career-explorer/specs', e);
    return errorResponse('Failed to create career spec');
  }
}
