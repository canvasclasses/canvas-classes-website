import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import connectToDatabase from '@/lib/mongodb';
import { QuestionV2 } from '@/lib/models/Question.v2';
import { Chapter } from '@/lib/models/Chapter';
import { AuditLog } from '@/lib/models/AuditLog';

// Chapter prefix map — CANONICAL prefixes matching actual display_id values in DB
// IDs MUST match taxonomyData_from_csv.ts chapter IDs (ch11_* / ch12_* scheme)
const CHAPTER_PREFIXES: Record<string, string> = {
  // Class 11
  'ch11_mole':        'MOLE',
  'ch11_atom':        'ATOM',
  'ch11_periodic':    'PERI',
  'ch11_bonding':     'BOND',
  'ch11_thermo':      'THERMO',
  'ch11_chem_eq':     'CEQ',
  'ch11_ionic_eq':    'IEQ',
  'ch11_redox':       'RDX',
  'ch11_pblock':      'PB11',
  'ch11_goc':         'GOC',
  'ch11_hydrocarbon': 'HC',
  'ch11_prac_org':    'POC',
  // Class 12
  'ch12_solutions':   'SOL',
  'ch12_electrochem': 'EC',
  'ch12_kinetics':    'CK',
  'ch12_pblock':      'PB12',
  'ch12_dblock':      'DNF',
  'ch12_coord':       'CORD',
  'ch12_haloalkanes': 'HALO',
  'ch12_alcohols':    'ALCO',
  'ch12_carbonyl':    'CARB',  // Unified: Aldehydes, Ketones and Carboxylic Acids (ALDO + CARB merged)
  'ch12_amines':      'AMIN',
  'ch12_biomolecules':'BIO',
  'ch12_salt':        'SALT',
  'ch12_prac_phys':   'PPHY',
  'ch12_phenols':     'PHEN',
};

/**
 * POST /api/v2/questions/[id]/reclassify
 * 
 * Moves a question to a new chapter:
 * - Generates new display_id (new prefix + next sequence in target chapter)
 * - Updates metadata.chapter_id
 * - Clears or replaces metadata.tags
 * - Updates stats on both old and new chapters
 * - Writes audit log
 * 
 * Body: { new_chapter_id: string, new_tags?: { tag_id: string, weight: number }[] }
 * Returns: { success, data: { new_display_id, new_chapter_id } }
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    await connectToDatabase();

    const questionId = params.id;
    const body = await request.json();
    const { new_chapter_id, new_tags = [] } = body;

    if (!new_chapter_id) {
      return NextResponse.json(
        { success: false, error: 'new_chapter_id is required' },
        { status: 400 }
      );
    }

    // 1. Load question
    const question = await QuestionV2.findById(questionId).lean() as any;
    if (!question) {
      return NextResponse.json(
        { success: false, error: 'Question not found' },
        { status: 404 }
      );
    }

    const oldChapterId = question.metadata.chapter_id;
    const oldDisplayId = question.display_id;

    if (oldChapterId === new_chapter_id) {
      return NextResponse.json(
        { success: false, error: 'Question is already in this chapter' },
        { status: 400 }
      );
    }

    // 2. Determine new prefix
    const prefix = CHAPTER_PREFIXES[new_chapter_id]
      || new_chapter_id.split('_').pop()!.toUpperCase().substring(0, 4);

    // 3. Generate new display_id by querying actual max in DB (never trust question_sequence)
    const prefixRegex = new RegExp(`^${prefix}-\\d+$`);
    const lastInChapter = await QuestionV2.findOne(
      { display_id: prefixRegex },
      { display_id: 1 }
    ).sort({ display_id: -1 }).lean() as any;

    let newSequence = 1;
    if (lastInChapter?.display_id) {
      const parts = lastInChapter.display_id.split('-');
      newSequence = parseInt(parts[parts.length - 1], 10) + 1;
    }
    const newDisplayId = `${prefix}-${String(newSequence).padStart(3, '0')}`;

    // 4. Check for display_id collision (safety net)
    const conflict = await QuestionV2.findOne({ display_id: newDisplayId });
    if (conflict) {
      return NextResponse.json(
        { success: false, error: `display_id "${newDisplayId}" already exists — please retry` },
        { status: 409 }
      );
    }

    // 5. Update question
    await QuestionV2.findByIdAndUpdate(questionId, {
      $set: {
        display_id: newDisplayId,
        'metadata.chapter_id': new_chapter_id,
        'metadata.tags': new_tags,
        updated_at: new Date(),
        updated_by: 'admin',
      }
    });

    // 6. Update old chapter stats (decrement) — best-effort, chapters collection may be stale
    await Chapter.findByIdAndUpdate(oldChapterId, {
      $inc: {
        'stats.total_questions': -1,
        'stats.published_questions': question.status === 'published' ? -1 : 0,
        'stats.draft_questions': question.status === 'draft' ? -1 : 0,
        'stats.pyq_count': question.metadata?.is_pyq ? -1 : 0,
      }
    });

    // 7. Update new chapter stats — best-effort
    await Chapter.findByIdAndUpdate(new_chapter_id, {
      $inc: {
        'stats.total_questions': 1,
        'stats.published_questions': question.status === 'published' ? 1 : 0,
        'stats.draft_questions': question.status === 'draft' ? 1 : 0,
        'stats.pyq_count': question.metadata?.is_pyq ? 1 : 0,
      }
    });

    // 8. Audit log
    await new AuditLog({
      _id: uuidv4(),
      entity_type: 'question',
      entity_id: questionId,
      action: 'update',
      changes: [
        { field: 'display_id', old_value: oldDisplayId, new_value: newDisplayId },
        { field: 'metadata.chapter_id', old_value: oldChapterId, new_value: new_chapter_id },
        { field: 'metadata.tags', old_value: question.metadata?.tags, new_value: new_tags },
      ],
      user_id: 'admin',
      user_email: 'admin@canvasclasses.com',
      timestamp: new Date(),
      can_rollback: true,
    }).save();

    return NextResponse.json({
      success: true,
      data: {
        new_display_id: newDisplayId,
        new_chapter_id,
        old_display_id: oldDisplayId,
        old_chapter_id: oldChapterId,
      },
      message: `Reclassified: ${oldDisplayId} → ${newDisplayId}`,
    });

  } catch (error) {
    console.error('Reclassify error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reclassify question' },
      { status: 500 }
    );
  }
}
