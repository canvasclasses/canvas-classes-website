import { NextRequest, NextResponse } from 'next/server';
import { TAXONOMY_FROM_CSV } from '@/app/crucible/admin/taxonomy/taxonomyData_from_csv';

// GET - Fetch all chapters from the single source of truth: taxonomyData_from_csv.ts
// This is the same data the Taxonomy Manager page displays and edits.
// IDs (ch11_*, ch12_*) match metadata.chapter_id in every questions_v2 document.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const classLevel = searchParams.get('class_level');

    const chapters = TAXONOMY_FROM_CSV
      .filter(node => node.type === 'chapter')
      .filter(node => !classLevel || String(node.class_level) === classLevel)
      .sort((a, b) => (a.sequence_order ?? 99) - (b.sequence_order ?? 99))
      .map((node, idx) => ({
        _id: node.id,
        name: node.name,
        display_order: node.sequence_order ?? idx,
        class_level: String(node.class_level ?? ''),
        chapterType: node.chapterType ?? '',
        is_active: true,
      }));

    return NextResponse.json({
      success: true,
      data: chapters,
      total: chapters.length,
    });

  } catch (error) {
    console.error('Error fetching chapters:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chapters' },
      { status: 500 }
    );
  }
}
