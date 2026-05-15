/**
 * GET /api/v2/user/recommendations?limit=5&types=practice,read
 *
 * Returns the recommendation engine's current picks for this user. Today
 * always returns an empty `items` array — the engine bridge is in place but
 * the algorithm is gated until livebooks/lectures content is wired up.
 *
 * The UI is built against this contract today; flipping the engine on later
 * needs no client changes.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import {
  getRecommendations,
  RecommendationActionType,
  RecommendationItem,
} from '@/lib/recommendationEngine';

const ALLOWED_TYPES: RecommendationActionType[] = ['practice', 'read', 'watch'];

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = req.nextUrl.searchParams;
    const limit = Math.min(Math.max(parseInt(params.get('limit') ?? '5', 10) || 5, 1), 20);

    const typesParam = params.get('types');
    const types = typesParam
      ? typesParam
          .split(',')
          .map(s => s.trim())
          .filter((s): s is RecommendationActionType =>
            (ALLOWED_TYPES as string[]).includes(s),
          )
      : undefined;

    const items: RecommendationItem[] = await getRecommendations(userId, { limit, types });

    return NextResponse.json({
      items,
      // Surfaced to UI so it can show the right empty-state copy until the
      // engine is activated.
      engine_status: items.length === 0 ? 'awaiting_content' : 'active',
    });
  } catch (err) {
    console.error('[GET /api/v2/user/recommendations]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
