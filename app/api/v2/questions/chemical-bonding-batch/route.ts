import { NextRequest, NextResponse } from 'next/server';
import { QuestionV2 } from '@/lib/models/Question.v2';
import connectToDatabase from '@/lib/mongodb';
import { TAXONOMY_FROM_CSV } from '@/app/crucible/admin/taxonomy/taxonomyData_from_csv';

/**
 * GET /api/v2/questions/chemical-bonding-batch?batch=1
 * Fetches Chemical Bonding questions in batches for tagging
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const batchNumber = parseInt(searchParams.get('batch') || '1');
    const batchSize = 30;
    const skip = (batchNumber - 1) * batchSize;

    await connectToDatabase();

    const questions = await QuestionV2.find({
      'metadata.chapter_id': 'ch11_bonding',
      deleted_at: null,
    })
      .sort({ display_id: 1 })
      .skip(skip)
      .limit(batchSize)
      .lean();

    interface QuestionDoc {
      _id: string;
      metadata?: {
        tags?: Array<{ tag_id: string }>;
        microConcept?: string;
        cognitiveType?: string;
        calcLoad?: string;
        entryPoint?: string;
        isMultiConcept?: boolean;
      };
      question_text?: {
        markdown?: string;
      };
      display_id?: string;
      options?: unknown[];
      type?: string;
    }
    const summaries = questions.map((q: unknown) => {
      const question = q as QuestionDoc;
      const primaryTagId = question.metadata?.tags?.[0]?.tag_id || 'NONE';
      const primaryTagNode = TAXONOMY_FROM_CSV.find(n => n.id === primaryTagId);
      const primaryTagName = primaryTagNode?.name || primaryTagId;

      // Extract first 200 chars of question text
      const questionText = question.question_text?.markdown || '';
      const preview = questionText.substring(0, 200).replace(/\n/g, ' ');

      return {
        _id: question._id.toString(),
        display_id: question.display_id,
        question_text: questionText,
        question_text_preview: preview,
        options: question.options || [],
        type: question.type,
        current_primary_tag_id: primaryTagId,
        current_primary_tag: primaryTagName,
        current_micro_concept: question.metadata?.microConcept,
        current_cognitive_type: question.metadata?.cognitiveType,
        current_calc_load: question.metadata?.calcLoad,
        current_entry_point: question.metadata?.entryPoint,
        current_is_multi_concept: question.metadata?.isMultiConcept,
      };
    });

    return NextResponse.json({
      success: true,
      batch: batchNumber,
      total_in_batch: summaries.length,
      questions: summaries,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error fetching Chemical Bonding questions:', error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
