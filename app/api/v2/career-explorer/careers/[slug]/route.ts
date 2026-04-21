import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { CareerPath } from '@/lib/models/CareerPath';
import { requireAdminUser, errorResponse, rateLimit, requestIp } from '../../_shared';

const ALLOWED_KEYS = new Set([
  'name', 'family', 'one_liner', 'typical_titles',
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

export async function GET(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const ip = requestIp(request);
  const rl = rateLimit(`ce-cs-${ip}`, 60);
  if (!rl.ok) return errorResponse('Too many requests', 429);

  const { slug } = await context.params;
  try {
    await connectToDatabase();
    const item = await CareerPath.findById(slug).lean<{ is_active?: boolean } | null>();
    if (!item || !item.is_active) return errorResponse('Not found', 404);
    return NextResponse.json({ item });
  } catch (e) {
    console.error('GET /career-explorer/careers/[slug]', e);
    return errorResponse('Failed to load career');
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const guard = await requireAdminUser(request);
  if (!guard.ok) return guard.response;

  const { slug } = await context.params;
  try {
    const raw = await request.json();
    const data = whitelist(raw as Record<string, unknown>);
    await connectToDatabase();
    const updated = await CareerPath.findByIdAndUpdate(
      slug,
      { $set: { ...data, updated_at: new Date() } },
      { new: true },
    ).lean();
    if (!updated) return errorResponse('Not found', 404);
    return NextResponse.json({ item: updated });
  } catch (e) {
    console.error('PATCH /career-explorer/careers/[slug]', e);
    return errorResponse('Failed to update career');
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const guard = await requireAdminUser(request);
  if (!guard.ok) return guard.response;

  const { slug } = await context.params;
  try {
    await connectToDatabase();
    const res = await CareerPath.findByIdAndUpdate(slug, { $set: { is_active: false, updated_at: new Date() } });
    if (!res) return errorResponse('Not found', 404);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('DELETE /career-explorer/careers/[slug]', e);
    return errorResponse('Failed to delete career');
  }
}
