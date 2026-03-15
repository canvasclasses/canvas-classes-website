import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Asset } from '@/lib/models/Asset';
import { QuestionV2 } from '@/lib/models/Question.v2';
import { AuditLog } from '@/lib/models/AuditLog';
import { deleteFromR2 } from '@/lib/r2Storage';
import { v4 as uuidv4 } from 'uuid';

// DELETE - Delete asset from R2 and database
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    
    // Find the asset
    const asset = await Asset.findById(id);
    if (!asset) {
      return NextResponse.json(
        { success: false, error: 'Asset not found' },
        { status: 404 }
      );
    }
    
    // Delete from R2
    const r2Deleted = await deleteFromR2(asset.file.storage_path);
    if (!r2Deleted) {
      console.warn(`Failed to delete asset from R2: ${asset.file.storage_path}`);
      // Continue anyway - we'll mark as deleted in DB
    }
    
    // Remove asset reference from all questions that use it
    const questionIds = asset.used_in.questions;
    for (const questionId of questionIds) {
      const question = await QuestionV2.findById(questionId);
      if (question) {
        // Remove from asset_ids array
        if (question.asset_ids) {
          question.asset_ids = question.asset_ids.filter((aid: string) => aid !== id);
        }
        
        // If it's a video, clear video_url if it matches
        if (asset.type === 'video' && question.solution?.video_url === asset.file.cdn_url) {
          question.solution.video_url = undefined;
        }
        
        question.updated_at = new Date();
        await question.save();
      }
    }
    
    // Soft delete the asset
    asset.deleted_at = new Date();
    await asset.save();
    
    // Create audit log
    const auditLog = new AuditLog({
      _id: uuidv4(),
      entity_type: 'asset',
      entity_id: id,
      action: 'delete',
      changes: [{
        field: 'deleted_at',
        old_value: null,
        new_value: asset.deleted_at
      }],
      user_id: 'admin',
      user_email: 'admin@canvasclasses.com',
      timestamp: new Date(),
      can_rollback: false
    });
    await auditLog.save();
    
    return NextResponse.json({
      success: true,
      message: 'Asset deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting asset:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete asset' },
      { status: 500 }
    );
  }
}
