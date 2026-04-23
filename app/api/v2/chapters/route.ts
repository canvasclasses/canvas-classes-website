import { NextRequest, NextResponse } from 'next/server';
import { TAXONOMY_FROM_CSV } from '@/app/crucible/admin/taxonomy/taxonomyData_from_csv';
import connectDB from '@/lib/mongodb';
import { QuestionV2 } from '@/lib/models/Question.v2';
import { unstable_cache } from 'next/cache';

// Star-count aggregation is expensive and the result rarely changes (only
// when questions are added/edited). Cache for 1 hour, keyed by class level.
const getStarCounts = unstable_cache(
  async (): Promise<Record<string, number>> => {
    await connectDB();
    const rows = await QuestionV2.aggregate([
      { $match: { deleted_at: null, status: 'published', 'metadata.is_top_pyq': true } },
      { $group: { _id: '$metadata.chapter_id', count: { $sum: 1 } } },
    ]);
    const map: Record<string, number> = {};
    for (const r of rows) if (r._id) map[r._id] = r.count;
    return map;
  },
  ['chapters-star-counts'],
  { revalidate: 3600, tags: ['questions'] }
);

// GET - Fetch all chapters from the single source of truth: taxonomyData_from_csv.ts
// This is the same data the Taxonomy Manager page displays and edits.
// IDs (ch11_*, ch12_*) match metadata.chapter_id in every questions_v2 document.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const classLevel = searchParams.get('class_level');

    // Get base chapters from taxonomy
    const baseChapters = TAXONOMY_FROM_CSV
      .filter(node => node.type === 'chapter')
      .filter(node => !classLevel || String(node.class_level) === classLevel)
      .sort((a, b) => (a.sequence_order ?? 99) - (b.sequence_order ?? 99));

    const starCountMap = await getStarCounts();

    // Combine data
    const chapters = baseChapters.map((node, idx) => ({
      _id: node.id,
      name: node.name,
      display_order: node.sequence_order ?? idx,
      class_level: String(node.class_level ?? ''),
      chapterType: node.chapterType ?? '',
      is_active: true,
      star_question_count: starCountMap[node.id] ?? 0,
    }));

    return NextResponse.json(
      { success: true, data: chapters, total: chapters.length },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
    );

  } catch (error) {
    console.error('Error fetching chapters:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chapters' },
      { status: 500 }
    );
  }
}
