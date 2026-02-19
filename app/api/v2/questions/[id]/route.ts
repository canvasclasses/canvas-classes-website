import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import connectToDatabase from '@/lib/mongodb';
import { QuestionV2 } from '@/lib/models/Question.v2';
import { Chapter } from '@/lib/models/Chapter';
import { AuditLog } from '@/lib/models/AuditLog';
import { createServerClient } from '@supabase/ssr';

async function getAuthenticatedUser(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // If Supabase is not configured (local dev), treat as authenticated
  if (!supabaseUrl || !supabaseAnonKey) return { id: 'local', email: 'local' };
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: { getAll: () => request.cookies.getAll(), setAll: () => {} },
  });
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// GET - Fetch single question by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    
    const question = await QuestionV2.findOne({
      _id: id,
      deleted_at: null
    }).lean();
    
    if (!question) {
      return NextResponse.json(
        { success: false, error: 'Question not found' },
        { status: 404 }
      );
    }
    
    // Strip solution for unauthenticated requests
    const user = await getAuthenticatedUser(request);
    const responseData = user ? question : (() => { const { solution, ...rest } = question as any; return rest; })();

    return NextResponse.json({
      success: true,
      data: responseData
    });
    
  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch question' },
      { status: 500 }
    );
  }
}

// PATCH - Update question
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication for all write operations
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const body = await request.json();
    const { id } = await params;
    
    // Get existing question
    const existingQuestion = await QuestionV2.findOne({
      _id: id,
      deleted_at: null
    });
    
    if (!existingQuestion) {
      return NextResponse.json(
        { success: false, error: 'Question not found' },
        { status: 404 }
      );
    }
    
    // Convert Mongoose document to plain object to avoid internal properties corrupting $set
    const existing = existingQuestion.toObject();
    
    // Track changes for audit log
    const changes: any[] = [];
    
    // Update fields
    const updates: any = {
      updated_at: new Date(),
      updated_by: 'admin'
    };
    
    if (body.type && body.type !== existing.type) {
      changes.push({
        field: 'type',
        old_value: existing.type,
        new_value: body.type
      });
      updates.type = body.type;
    }

    if (body.question_text) {
      changes.push({
        field: 'question_text.markdown',
        old_value: existing.question_text.markdown,
        new_value: body.question_text.markdown
      });
      updates.question_text = {
        ...existing.question_text,
        ...body.question_text,
        latex_validated: false
      };
    }
    
    if (body.solution) {
      changes.push({
        field: 'solution.text_markdown',
        old_value: existing.solution.text_markdown,
        new_value: body.solution.text_markdown
      });
      updates.solution = {
        ...existing.solution,
        ...body.solution,
        latex_validated: false
      };
    }
    
    if (body.options) {
      changes.push({
        field: 'options',
        old_value: JSON.stringify(existing.options),
        new_value: JSON.stringify(body.options)
      });
      updates.options = body.options;
    }
    
    if (body.answer) {
      changes.push({
        field: 'answer',
        old_value: JSON.stringify(existing.answer),
        new_value: JSON.stringify(body.answer)
      });
      updates.answer = body.answer;
    }
    
    if (body.metadata) {
      changes.push({
        field: 'metadata',
        old_value: JSON.stringify(existing.metadata),
        new_value: JSON.stringify(body.metadata)
      });
      updates.metadata = {
        ...existing.metadata,
        ...body.metadata
      };
    }
    
    if (body.status && body.status !== existing.status) {
      changes.push({
        field: 'status',
        old_value: existing.status,
        new_value: body.status
      });
      updates.status = body.status;
      
      // Update chapter stats
      const oldStatus = existing.status;
      const newStatus = body.status;
      
      const statsUpdate: any = {};
      if (oldStatus === 'draft') statsUpdate['stats.draft_questions'] = -1;
      if (oldStatus === 'published') statsUpdate['stats.published_questions'] = -1;
      if (newStatus === 'draft') statsUpdate['stats.draft_questions'] = 1;
      if (newStatus === 'published') statsUpdate['stats.published_questions'] = 1;
      
      await Chapter.findByIdAndUpdate(
        existing.metadata.chapter_id,
        { $inc: statsUpdate }
      );
    }
    
    // Increment version
    updates.version = existing.version + 1;
    
    // Update question
    const updatedQuestion = await QuestionV2.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );
    
    // Create audit log
    if (changes.length > 0) {
      const auditLog = new AuditLog({
        _id: uuidv4(),
        entity_type: 'question',
        entity_id: id,
        action: 'update',
        changes,
        user_id: 'admin',
        user_email: 'admin@canvasclasses.com',
        timestamp: new Date(),
        can_rollback: true,
        rollback_data: existingQuestion.toObject()
      });
      
      await auditLog.save();
    }
    
    return NextResponse.json({
      success: true,
      data: updatedQuestion,
      message: 'Question updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update question' },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete question
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication for delete
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const { id } = await params;
    
    const question = await QuestionV2.findOne({
      _id: id,
      deleted_at: null
    });
    
    if (!question) {
      return NextResponse.json(
        { success: false, error: 'Question not found' },
        { status: 404 }
      );
    }
    
    // Soft delete
    question.deleted_at = new Date();
    question.deleted_by = 'admin'; // TODO: Get from auth
    await question.save();
    
    // Update chapter stats
    const statsUpdate: any = { 'stats.total_questions': -1 };
    if (question.status === 'draft') statsUpdate['stats.draft_questions'] = -1;
    if (question.status === 'published') statsUpdate['stats.published_questions'] = -1;
    
    await Chapter.findByIdAndUpdate(
      question.metadata.chapter_id,
      { $inc: statsUpdate }
    );
    
    // Create audit log
    const auditLog = new AuditLog({
      _id: uuidv4(),
      entity_type: 'question',
      entity_id: id,
      action: 'delete',
      changes: [{
        field: 'deleted_at',
        old_value: null,
        new_value: new Date()
      }],
      user_id: 'admin',
      user_email: 'admin@canvasclasses.com',
      timestamp: new Date(),
      can_rollback: true,
      rollback_data: question.toObject()
    });
    
    await auditLog.save();
    
    return NextResponse.json({
      success: true,
      message: 'Question deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete question' },
      { status: 500 }
    );
  }
}
