import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@canvas/data/db/mongodb';
import { JuniorQuestion } from '@canvas/data/models/JuniorQuestion';
import { mapJuniorPracticeQuestions } from '@canvas/data/books/juniorPractice';

// PUBLIC: no auth required — the junior practice bank is identical for every
// reader. Cacheable; only changes when questions are re-authored in admin.
// Shape: { success, data: { questions } } — consumed by JuniorPracticeRenderer
// (shared book-renderer block), so the ADMIN app hosts an identical route.
export const revalidate = 3600;

const MAX = 200;

// GET /api/v2/junior-questions/practice?book_slug=class9-science&chapter_number=5
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const book_slug = sp.get('book_slug');
  const chapter_number = sp.get('chapter_number');
  const grade = sp.get('grade');

  if (!book_slug && !grade) {
    return NextResponse.json({ success: false, error: 'book_slug or grade required' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const filter: Record<string, unknown> = { status: 'published', deleted_at: null };
    if (book_slug) filter.book_slug = book_slug;
    if (grade) filter.grade = Number(grade);
    if (sp.get('subject')) filter.subject = sp.get('subject');
    if (chapter_number) filter.chapter_number = Number(chapter_number);

    const docs = await JuniorQuestion.find(filter)
      .select('display_id format question_text assertion reason options explanation image_src concept_tag difficulty topic chapter_number')
      .sort({ chapter_number: 1, display_id: 1 })
      .limit(MAX)
      .lean();

    return NextResponse.json({ success: true, data: { questions: mapJuniorPracticeQuestions(docs) } });
  } catch (err) {
    console.error('[junior-questions/practice GET]', err);
    return NextResponse.json({ success: false, error: 'Failed to load questions' }, { status: 500 });
  }
}
