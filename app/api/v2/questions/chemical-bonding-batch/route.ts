import { NextRequest, NextResponse } from 'next/server';
import { QuestionV2 } from '@/lib/models/Question.v2';
import dbConnect from '@/lib/dbConnect';
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

    await dbConnect();

    const questions = await QuestionV2.find({
      'metadata.chapter_id': 'ch11_bonding',
      deleted_at: null,
    })
      .sort({ display_id: 1 })
      .skip(skip)
      .limit(batchSize)
      .lean();

    const summaries = questions.map((q: any) => {
      const primaryTagId = q.metadata?.tags?.[0]?.tag_id || 'NONE';
      const primaryTagNode = TAXONOMY_FROM_CSV.find(n => n.id === primaryTagId);
      const primaryTagName = primaryTagNode?.name || primaryTagId;

      // Extract first 200 chars of question text
      const questionText = q.question_text?.markdown || '';
      const preview = questionText.substring(0, 200).replace(/\n/g, ' ');

      return {
        _id: q._id.toString(),
        display_id: q.display_id,
        question_text: questionText,
        question_text_preview: preview,
        options: q.options || [],
        type: q.type,
        current_primary_tag_id: primaryTagId,
        current_primary_tag: primaryTagName,
        current_micro_concept: q.metadata?.microConcept,
        current_cognitive_type: q.metadata?.cognitiveType,
        current_calc_load: q.metadata?.calcLoad,
        current_entry_point: q.metadata?.entryPoint,
        current_is_multi_concept: q.metadata?.isMultiConcept,
      };
    });

    return NextResponse.json({
      success: true,
      batch: batchNumber,
      total_in_batch: summaries.length,
      questions: summaries,
    });

  } catch (error: any) {
    console.error('Error fetching Chemical Bonding questions:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
