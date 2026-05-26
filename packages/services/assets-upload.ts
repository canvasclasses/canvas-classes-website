// POST /api/v2/assets/upload — upload an asset (image/svg/audio/video) to
// Cloudflare R2 + record in the Asset collection, optionally attached to a
// QuestionV2 doc.
//
// GET  /api/v2/assets/upload?question_id=... — list assets for a question.
//   (Note: admin UI calls `/api/v2/assets?question_id=` which maps to a
//   different path that does not exist — pre-existing dead end, not
//   introduced by extraction. The GET here is reachable only via
//   `/api/v2/assets/upload?...` and appears unused by either app's UI.
//   Preserved verbatim so behaviour is unchanged.)
//
// Auth (POST): localhost dev bypass → x-admin-secret header → Supabase
// session with email in SUPER_ADMIN_EMAILS OR canEditQuestion(email, chapter)
// where chapter is resolved from the required `questionId` form field.

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import crypto from 'crypto';
import connectToDatabase from '@canvas/data/db/mongodb';
import { Asset } from '@canvas/data/models/Asset';
import { AuditLog } from '@canvas/data/models/AuditLog';
import { uploadToR2, getExtensionFromMimeType, type AssetType } from '@canvas/core/r2-storage';
import { canEditQuestion, isSuperAdmin } from '@canvas/data/rbac';
import { QuestionV2 } from '@canvas/data/models/Question.v2';
import { fileTypeFromBuffer } from 'file-type';
import type { ServiceDeps } from './types';

function calculateChecksum(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function getAssetType(mimeType: string): AssetType {
  if (mimeType.includes('svg')) return 'svg';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('video/')) return 'video';
  return 'image';
}

export async function POST(request: NextRequest, deps: ServiceDeps) {
  let formData: FormData | null = null;
  let file: File | null = null;

  try {
    await connectToDatabase();

    const isLocalDev = await deps.isLocalhostDev();
    const isScript = deps.hasScriptSecret(request);

    // Auth probe BEFORE parsing the body. Otherwise an unauthenticated POST
    // with a 50 MB body would be fully buffered into memory before the 401
    // fires — bandwidth-DoS risk. Localhost dev and script-secret callers
    // bypass the user lookup.
    let authedEmail: string | null = null;
    if (!isLocalDev && !isScript) {
      const user = await deps.getAuthenticatedUser(request);
      if (!user?.email) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized - Authentication required' },
          { status: 401 }
        );
      }
      authedEmail = user.email;
    }

    // Now safe to parse the body.
    formData = await request.formData();
    file = formData.get('file') as File;
    const questionId = formData.get('questionId') as string | null;
    const fieldType = formData.get('field_type') as string;
    const altText = formData.get('alt_text') as string;
    const caption = formData.get('caption') as string;
    const context = (formData.get('context') as string) || 'practice';

    // questionId is REQUIRED for normal users. Asset uploads must be tied to
    // a specific question so the chapter-level RBAC check has something to
    // gate on. Localhost dev and script-secret callers bypass this.
    if (!isLocalDev && !isScript) {
      if (!questionId) {
        return NextResponse.json(
          { success: false, error: 'questionId is required' },
          { status: 400 }
        );
      }
    }

    if (questionId) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(questionId)) {
        return NextResponse.json(
          { success: false, error: 'Invalid questionId format - must be a valid UUID' },
          { status: 400 }
        );
      }
    }

    // For non-bypass callers, gate on the question's chapter (super admins
    // skip the question lookup entirely).
    if (!isLocalDev && !isScript) {
      if (authedEmail && !isSuperAdmin(authedEmail)) {
        const targetQuestion = await QuestionV2.findOne(
          { _id: questionId, deleted_at: null },
          { 'metadata.chapter_id': 1 },
        ).lean<{ metadata: { chapter_id: string } } | null>();

        if (!targetQuestion) {
          return NextResponse.json(
            { success: false, error: 'Question not found' },
            { status: 404 }
          );
        }

        if (!targetQuestion?.metadata?.chapter_id) {
          return NextResponse.json(
            { success: false, error: 'Question has no chapter — cannot validate access' },
            { status: 500 }
          );
        }

        try {
          const allowed = await canEditQuestion(
            authedEmail,
            targetQuestion.metadata.chapter_id,
          );
          if (!allowed) {
            return NextResponse.json(
              { success: false, error: "Forbidden - You do not have edit access to this question's subject/chapter" },
              { status: 403 }
            );
          }
        } catch (rbacErr) {
          console.error('RBAC lookup failed during asset upload auth:', rbacErr);
          return NextResponse.json(
            { success: false, error: 'Forbidden - Permission check failed' },
            { status: 403 }
          );
        }
      }
    }

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    const baseFileType = file.type.split(';')[0].trim();
    const allowedBaseTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'image/svg+xml',
      'audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/webm', 'audio/mp4', 'audio/aac', 'audio/ogg',
      'video/mp4', 'video/webm',
    ];

    if (!allowedBaseTypes.includes(baseFileType)) {
      return NextResponse.json(
        { success: false, error: `File type ${file.type} not allowed` },
        { status: 400 }
      );
    }

    const maxSize = baseFileType.startsWith('audio/') || baseFileType.startsWith('video/')
      ? 50 * 1024 * 1024
      : 10 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: `File size exceeds ${maxSize / 1024 / 1024}MB limit` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const detectedType = await fileTypeFromBuffer(buffer);

    const isAudio = baseFileType.startsWith('audio/');
    const isSvg = baseFileType === 'image/svg+xml';

    if (!isSvg) {
      if (!detectedType) {
        if (!isAudio) {
          return NextResponse.json(
            { success: false, error: 'Unable to verify file type - file may be corrupted or invalid' },
            { status: 400 }
          );
        }
      } else {
        const detectedMime = detectedType.mime;

        const normalizedBase = baseFileType.replace('image/jpg', 'image/jpeg');
        const normalizedDetected = detectedMime.replace('image/jpg', 'image/jpeg');

        const isWebmEquivalent =
          (normalizedBase === 'audio/webm' && normalizedDetected === 'video/webm') ||
          (normalizedBase === 'video/webm' && normalizedDetected === 'audio/webm');

        const isMp4Equivalent =
          (normalizedBase === 'audio/mp4' && normalizedDetected === 'video/mp4') ||
          (normalizedBase === 'video/mp4' && normalizedDetected === 'audio/mp4');

        const isAudioCompatible = isAudio && detectedMime.startsWith('audio/');

        if (!isWebmEquivalent && !isMp4Equivalent && !isAudioCompatible && normalizedBase !== normalizedDetected) {
          return NextResponse.json(
            {
              success: false,
              error: `File type mismatch: claimed ${baseFileType} but detected ${detectedMime}. Possible file spoofing attempt.`,
            },
            { status: 400 }
          );
        }
      }
    }

    const checksum = calculateChecksum(buffer);

    const existingAsset = await Asset.findOne({ 'file.checksum': checksum });
    if (existingAsset && questionId) {
      await Asset.updateOne(
        { _id: existingAsset._id },
        { $addToSet: { 'used_in.questions': questionId } }
      );

      return NextResponse.json({
        success: true,
        data: existingAsset,
        message: 'File already exists, reference added',
      });
    }

    const assetId = uuidv4();
    const assetType = getAssetType(baseFileType);
    const extension = getExtensionFromMimeType(baseFileType) || path.extname(file.name).replace('.', '') || 'bin';

    const timestamp = Date.now();

    const safeOriginalName = file.name
      .replace(/[\/\\]/g, '')
      .replace(/\.\./g, '')
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/\.[^.]+$/, '')
      .slice(0, 50);

    const filename = `${timestamp}_${safeOriginalName}_${assetId.slice(0, 8)}.${extension}`;
    const storagePath = questionId
      ? `questions/${questionId}/${assetType}/${filename}`
      : `shared/${assetType}/${filename}`;

    console.log('Uploading to R2:', {
      filename,
      assetType,
      contentType: baseFileType,
      storagePath,
      size: buffer.length,
    });

    const r2Result = await uploadToR2(buffer, filename, assetType, baseFileType, storagePath);
    if (!r2Result.success) {
      console.error('R2 upload failed:', r2Result.error);
      return NextResponse.json(
        { success: false, error: r2Result.error || 'R2 upload failed' },
        { status: 500 }
      );
    }

    console.log('R2 upload successful:', r2Result.url);

    const cdnUrl = r2Result.url!;

    const asset = new Asset({
      _id: assetId,
      type: assetType,
      file: {
        original_name: file.name,
        mime_type: baseFileType,
        size_bytes: file.size,
        storage_path: r2Result.path || storagePath,
        cdn_url: cdnUrl,
        checksum,
      },
      used_in: {
        questions: questionId ? [questionId] : [],
        question_field: fieldType || 'unknown',
      },
      metadata: {
        alt_text: altText || '',
        caption: caption || '',
        context: context || 'practice',
      },
      version: 1,
      previous_versions: [],
      created_by: 'admin', // TODO: Get from auth
      processing_status: 'completed',
    });

    await asset.save();

    const auditLog = new AuditLog({
      _id: uuidv4(),
      entity_type: 'asset',
      entity_id: assetId,
      action: 'create',
      changes: [{
        field: 'asset',
        old_value: null,
        new_value: `Uploaded ${file.name}`,
      }],
      user_id: 'admin',
      user_email: 'admin@canvasclasses.com',
      timestamp: new Date(),
      can_rollback: false,
    });

    await auditLog.save();

    return NextResponse.json({
      success: true,
      data: asset,
      message: 'Asset uploaded successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error uploading asset:', error);
    console.error('Asset upload error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      fileName: file?.name || 'unknown',
      fileType: file?.type || 'unknown',
    });
    return NextResponse.json(
      { success: false, error: 'Failed to upload asset' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('question_id');
    const type = searchParams.get('type');

    const query: Record<string, unknown> = { deleted_at: null };
    if (questionId) query['used_in.questions'] = questionId;
    if (type) query.type = type;

    const limit = Math.min(parseInt(searchParams.get('limit') || '200', 10) || 200, 500);
    const skip = parseInt(searchParams.get('skip') || '0', 10) || 0;
    const assets = await Asset.find(query).sort({ created_at: -1 }).skip(skip).limit(limit).lean();

    return NextResponse.json({
      success: true,
      data: assets,
    });
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch assets' },
      { status: 500 }
    );
  }
}

// Runtime config — Next inherits these from the route.ts re-export site,
// not from this module. The wrappers in both apps must re-declare them.
