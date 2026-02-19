import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import connectToDatabase from '@/lib/mongodb';
import { QuestionV2 } from '@/lib/models/Question.v2';
import { Chapter } from '@/lib/models/Chapter';
import { AuditLog } from '@/lib/models/AuditLog';

// Chapter prefix map — 4-char uppercase prefix for display_id generation
const CHAPTER_PREFIXES: Record<string, string> = {
  'chapter_some_basic_concepts':          'MOLE',
  'chapter_structure_of_atom':            'ATOM',
  'chapter_states_of_matter':             'GAS',
  'chapter_thermodynamics':               'THER',
  'chapter_equilibrium':                  'EQUI',
  'chapter_classification_of_elements':   'PERI',
  'chapter_chemical_bonding':             'BOND',
  'chapter_hydrogen':                     'H2',
  'chapter_s_block':                      'SBLO',
  'chapter_p_block_11':                   'PB11',
  'chapter_organic_chemistry_basic':      'GOC',
  'chapter_hydrocarbons':                 'HC',
  'chapter_environmental_chemistry':      'ENV',
  'chapter_solutions':                    'SOLN',
  'chapter_electrochemistry':             'ELEC',
  'chapter_chemical_kinetics':            'KINE',
  'chapter_surface_chemistry':            'SURF',
  'chapter_general_principles_processes': 'META',
  'chapter_p_block_12':                   'PB12',
  'chapter_d_f_block':                    'DFBL',
  'chapter_coordination_compounds':       'COOR',
  'chapter_haloalkanes_haloarenes':       'HALO',
  'chapter_alcohols_phenols_ethers':      'ALCO',
  'chapter_aldehydes_ketones':            'CARB',
  'chapter_amines':                       'AMIN',
  'chapter_biomolecules':                 'BIO',
  'chapter_polymers':                     'POLY',
  'chapter_chemistry_everyday_life':      'DAIL',
  'chapter_salt_analysis':                'SALT',
  'chapter_stereochemistry':              'STER',
  'chapter_aromatic_compounds':           'AROM',
  'chapter_redox_reactions':              'REDX',
  'chapter_ionic_equilibrium':            'ION',
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

    // 2. Load new chapter
    const newChapter = await Chapter.findById(new_chapter_id);
    if (!newChapter) {
      return NextResponse.json(
        { success: false, error: `Chapter "${new_chapter_id}" not found` },
        { status: 404 }
      );
    }

    // 3. Generate new display_id
    const prefix = CHAPTER_PREFIXES[new_chapter_id]
      || new_chapter_id.split('_').pop()!.toUpperCase().substring(0, 4);
    const newSequence = (newChapter.question_sequence || 0) + 1;
    const newDisplayId = `${prefix}-${String(newSequence).padStart(3, '0')}`;

    // 4. Check for display_id collision (safety net)
    const conflict = await QuestionV2.findOne({ display_id: newDisplayId });
    if (conflict) {
      return NextResponse.json(
        { success: false, error: `display_id "${newDisplayId}" already exists — chapter sequence out of sync` },
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

    // 6. Update old chapter stats (decrement)
    await Chapter.findByIdAndUpdate(oldChapterId, {
      $inc: {
        'stats.total_questions': -1,
        'stats.published_questions': question.status === 'published' ? -1 : 0,
        'stats.draft_questions': question.status === 'draft' ? -1 : 0,
        'stats.pyq_count': question.metadata?.is_pyq ? -1 : 0,
      }
    });

    // 7. Update new chapter stats + advance sequence
    await Chapter.findByIdAndUpdate(new_chapter_id, {
      $inc: {
        question_sequence: 1,
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
