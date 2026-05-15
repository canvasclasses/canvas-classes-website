import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { ActivityLog } from '@/lib/models';

/**
 * GET /api/v2/questions/[id]/stats
 * Returns per-option pick counts and total attempts for a question.
 * Used to render the option heatmap in practice and test review modes.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id: questionId } = await params;

    // Aggregate option pick counts from ActivityLog
    interface AggregationResult {
      _id: string;
      count: number;
    }
    const results = await ActivityLog.aggregate([
      { $match: { question_id: questionId, selected_option_id: { $ne: null } } },
      {
        $group: {
          _id: '$selected_option_id',
          count: { $sum: 1 },
        },
      },
    ]);

    const total = results.reduce((sum: number, r: unknown) => sum + ((r as AggregationResult).count || 0), 0);

    // Build map: optionId -> percentage (0-100, rounded)
    const optionStats: Record<string, number> = {};
    for (const r of results) {
      const result = r as AggregationResult;
      optionStats[result._id] = total > 0 ? Math.round((result.count / total) * 100) : 0;
    }

    return NextResponse.json({ optionStats, total });
  } catch (err: unknown) {
    console.error('Question stats error:', err);
    return NextResponse.json({ optionStats: {}, total: 0 });
  }
}
