// PUBLIC GET: lists active careers (optionally filtered by slug).
// Admin POST: creates a new career with the 9-layer taxonomy.

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectToDatabase from '@/lib/mongodb';
import { CareerPath } from '@/lib/models/CareerPath';
import { requireAdminUser, errorResponse, rateLimit, requestIp } from '../_shared';

export async function GET(request: NextRequest) {
  const ip = requestIp(request);
  const rl = rateLimit(`ce-c-${ip}`, 60);
  if (!rl.ok) return errorResponse('Too many requests', 429);

  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '100', 10) || 100, 200);
  const hiddenGem = url.searchParams.get('hidden_gem');
  const family = url.searchParams.get('family');
  const slug = url.searchParams.get('slug');

  try {
    await connectToDatabase();
    const q: Record<string, unknown> = { is_active: true };
    if (hiddenGem === 'true') q.hidden_gem = true;
    if (family) q.family = family;
    if (slug) q._id = slug;
    const items = await CareerPath.find(q).sort({ name: 1 }).limit(limit).lean();
    return NextResponse.json({ items });
  } catch (e) {
    console.error('GET /career-explorer/careers', e);
    return errorResponse('Failed to load careers');
  }
}

// Accept a free-form career object; the Mongoose schema does the field-level
// validation. We still whitelist the top-level keys so no stray fields leak in.
const ALLOWED_KEYS = new Set([
  '_id', 'name', 'family', 'one_liner', 'typical_titles',
  'riasec_primary', 'riasec_secondary', 'cognitive_styles', 'hard_filters',
  'indoor_outdoor', 'desk_field', 'solo_team', 'communication_intensity', 'public_facing',
  'travel', 'work_hours', 'physical_demand', 'stress_profile',
  'education_cost', 'education_duration_years', 'entry_salary_inr_lpa', 'mid_salary_inr_lpa',
  'top_salary_inr_lpa', 'roi_timeline_years', 'scholarship_availability', 'loan_worthiness',
  'india_market_depth', 'metro_concentration', 'international_mobility', 'top_destinations',
  'licensing_portability', 'remote_feasibility', 'immigration_pathway',
  'automation_vulnerability', 'demand_trajectory', 'supply_saturation', 'emerging_score',
  'hidden_gem', 'ten_year_outlook', 'disruption_risks', 'adjacent_pivots', 'last_future_review',
  'required_stream', 'entrance_exams', 'degree_paths', 'certifications', 'min_qualification',
  'alternative_paths',
  'job_stability', 'work_life_balance', 'social_prestige_india', 'autonomy',
  'creative_expression', 'impact',
  'day_in_life', 'misconceptions', 'what_people_love', 'burnout_triggers', 'role_models',
  'resource_links', 'is_active',
]);

function whitelist(obj: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) if (ALLOWED_KEYS.has(k)) out[k] = v;
  return out;
}

const SlugRegex = /^[a-z][a-z0-9-]{1,60}$/;

export async function POST(request: NextRequest) {
  const guard = await requireAdminUser(request);
  if (!guard.ok) return guard.response;

  try {
    const raw = await request.json();
    if (typeof raw !== 'object' || !raw) return errorResponse('Invalid payload', 400);
    const data = whitelist(raw as Record<string, unknown>);
    const slug = z.string().regex(SlugRegex).safeParse(data._id);
    if (!slug.success) return errorResponse('Invalid slug', 400);
    await connectToDatabase();
    const existing = await CareerPath.findById(slug.data).lean();
    if (existing) return errorResponse('Career already exists', 409);
    const created = await CareerPath.create({ ...data, is_active: true });
    return NextResponse.json({ item: created.toObject() }, { status: 201 });
  } catch (e) {
    console.error('POST /career-explorer/careers', e);
    return errorResponse('Failed to create career');
  }
}
