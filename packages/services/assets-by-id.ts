// DELETE /api/v2/assets/[id] — soft-delete an asset + remove references
// from any QuestionV2 that points at it, plus best-effort R2 deletion.
//
// Normalized auth: the pre-extraction routes called the per-app Supabase
// server client (`createClient` from `app/utils/supabase/server`); this
// extraction uses `deps.getAuthenticatedUser(request)` from each app's
// lib/auth.ts. Both walk the same cookie session — outcome is identical
// for browser callers. The pre-extraction code also had no Bearer-token
// branch; the deps version inherits one, which is strictly an upgrade
// (script callers with x-admin-secret already had `hasScriptSecret`).

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@canvas/data/db/mongodb';
import { Asset } from '@canvas/data/models/Asset';
import { QuestionV2 } from '@canvas/data/models/Question.v2';
import { AuditLog } from '@canvas/data/models/AuditLog';
import { deleteFromR2 } from '@canvas/core/r2-storage';
import { v4 as uuidv4 } from 'uuid';
import { isSuperAdmin } from '@canvas/data/rbac';
import type { ServiceDeps } from './types';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
  deps: ServiceDeps,
) {
  try {
    await connectToDatabase();

    const user = await deps.getAuthenticatedUser(request);
    if (!user || !user.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    if (!isSuperAdmin(user.email)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Only super admins can delete assets' },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const asset = await Asset.findById(id);
    if (!asset) {
      return NextResponse.json(
        { success: false, error: 'Asset not found' },
        { status: 404 }
      );
    }

    const r2Deleted = await deleteFromR2(asset.file.storage_path);
    if (!r2Deleted) {
      console.warn(`Failed to delete asset from R2: ${asset.file.storage_path}`);
      // Continue anyway - we'll mark as deleted in DB
    }

    const questionIds = asset.used_in.questions;
    for (const questionId of questionIds) {
      const question = await QuestionV2.findById(questionId);
      if (question) {
        if (question.asset_ids) {
          question.asset_ids = question.asset_ids.filter((aid: string) => aid !== id);
        }

        if (asset.type === 'video' && question.solution?.video_url === asset.file.cdn_url) {
          question.solution.video_url = undefined;
        }

        question.updated_at = new Date();
        await question.save();
      }
    }

    asset.deleted_at = new Date();
    await asset.save();

    const auditLog = new AuditLog({
      _id: uuidv4(),
      entity_type: 'asset',
      entity_id: id,
      action: 'delete',
      changes: [{
        field: 'deleted_at',
        old_value: null,
        new_value: asset.deleted_at,
      }],
      user_id: user.id,
      user_email: user.email,
      timestamp: new Date(),
      can_rollback: false,
    });
    await auditLog.save();

    return NextResponse.json({
      success: true,
      message: 'Asset deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting asset:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete asset' },
      { status: 500 }
    );
  }
}
