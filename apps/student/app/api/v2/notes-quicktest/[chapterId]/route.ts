import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import connectToDatabase from '@canvas/data/db/mongodb';
import { QuestionV2 } from '@canvas/data/models/Question.v2';

// PUBLIC: no auth required.
//
// Returns the curated "demo" subset of questions for a chapter — used by the
// side-by-side practice panel on /handwritten-notes/[chapter]. Edge-cached
// for 24 hours; admin mutations on demo questions revalidate this path
// explicitly (see app/api/v2/questions/[id]/route.ts).
//
// Response shape is intentionally minimal: only the fields the panel needs.
// ~10–20× smaller than the full questions_v2 doc.

export const revalidate = 86400; // 24h ISR

// Shape returned to the client. Keep this in sync with QuickTestQuestion in
// the SideBySidePractice component.
interface QuickTestQuestion {
  display_id: string;
  type: 'SCQ' | 'MCQ' | 'NVT' | 'AR' | 'MST' | 'MTC';
  difficultyLevel: number;
  question_text: { markdown: string };
  options: Array<{ id: string; text: string; is_correct: boolean }>;
  answer?: { integer_value?: number; decimal_value?: number; tolerance?: number; unit?: string };
  solution: { text_markdown: string };
}

interface QuickTestResponse {
  chapterId: string;
  count: number;
  questions: QuickTestQuestion[];
  generatedAt: string;
}

// Wrapped Mongo read so Next.js can memoise + tag-invalidate per chapter.
function getDemoQuestionsForChapter(chapterId: string) {
  return unstable_cache(
    async (): Promise<QuickTestResponse> => {
      await connectToDatabase();

      // Hard cap: 50. The curation target is ~25 per chapter; the cap is a
      // safety net in case the flag gets over-applied. The client may slice
      // further if needed.
      const docs = await QuestionV2.find(
        {
          'metadata.chapter_id': chapterId,
          'metadata.is_demo_question': true,
          status: 'published',
          deleted_at: null,
        },
        {
          display_id: 1,
          type: 1,
          'metadata.difficultyLevel': 1,
          'question_text.markdown': 1,
          'options.id': 1,
          'options.text': 1,
          'options.is_correct': 1,
          'answer.integer_value': 1,
          'answer.decimal_value': 1,
          'answer.tolerance': 1,
          'answer.unit': 1,
          'solution.text_markdown': 1,
        }
      )
        .sort({ display_id: 1 })
        .limit(50)
        .lean();

      interface RawDoc {
        display_id: string;
        type: QuickTestQuestion['type'];
        metadata?: { difficultyLevel?: number };
        question_text?: { markdown?: string };
        options?: Array<{ id?: string; text?: string; is_correct?: boolean }>;
        answer?: QuickTestQuestion['answer'];
        solution?: { text_markdown?: string };
      }

      const questions: QuickTestQuestion[] = (docs as unknown as RawDoc[]).map((d) => ({
        display_id: d.display_id,
        type: d.type,
        difficultyLevel: d.metadata?.difficultyLevel ?? 3,
        question_text: { markdown: d.question_text?.markdown ?? '' },
        options: Array.isArray(d.options)
          ? d.options.map((o) => ({
              id: o.id ?? '',
              text: o.text ?? '',
              is_correct: o.is_correct === true,
            }))
          : [],
        ...(d.answer ? { answer: d.answer } : {}),
        solution: { text_markdown: d.solution?.text_markdown ?? '' },
      }));

      return {
        chapterId,
        count: questions.length,
        questions,
        generatedAt: new Date().toISOString(),
      };
    },
    ['notes-quicktest', chapterId],
    {
      revalidate: 86400,
      tags: ['notes-quicktest', `notes-quicktest:${chapterId}`],
    }
  )();
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  try {
    const { chapterId } = await params;

    // Defensive validation — chapter IDs in this app look like 'ch11_atom',
    // 'ch12_solutions', etc. Reject anything else early.
    if (!/^ch\d{1,2}_[a-z_]{2,30}$/i.test(chapterId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid chapter id' },
        { status: 400 }
      );
    }

    const data = await getDemoQuestionsForChapter(chapterId);

    // Explicit CDN cache header — without this, Vercel treats route-handler
    // responses as no-store regardless of the `revalidate` directive above
    // (which only governs Next.js's internal data cache). At scale this is
    // the difference between "0 origin hits per minute" and "every visitor
    // hits Mongo." stale-while-revalidate=604800 means edge can serve a
    // 7-day-old copy while quietly refreshing in the background.
    return NextResponse.json(
        { success: true, ...data },
        {
            headers: {
                'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
            },
        }
    );
  } catch (error) {
    console.error('Error fetching notes quicktest:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quicktest questions' },
      { status: 500 }
    );
  }
}
