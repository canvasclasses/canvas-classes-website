// PUBLIC: no auth required — returns the static college master list used by
// the predictor form (dropdowns) and the browse/compare views.

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { College } from '@/lib/models/College';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');     // NIT | IIIT | GFTI | IIT
    const region = searchParams.get('region'); // North | South | East | West | Central | Northeast

    await connectDB();

    const query: Record<string, unknown> = { is_active: true };
    if (type) query.type = type;
    if (region) query.region = region;

    const colleges = await College.find(query)
      .select(
        '_id name short_name type state city region established website ' +
        'nirf_rank_engineering nirf_rank_overall total_seats annual_fees',
      )
      .sort({ nirf_rank_engineering: 1, short_name: 1 })
      .limit(200)
      .lean();

    return NextResponse.json({
      success: true,
      total: colleges.length,
      colleges,
    });
  } catch (err) {
    console.error('Colleges list error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch colleges' },
      { status: 500 },
    );
  }
}
