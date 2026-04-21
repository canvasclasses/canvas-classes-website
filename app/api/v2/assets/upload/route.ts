import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import crypto from 'crypto';
import connectToDatabase from '@/lib/mongodb';
import { Asset } from '@/lib/models/Asset';
import { AuditLog } from '@/lib/models/AuditLog';
import { uploadToR2, getExtensionFromMimeType, type AssetType } from '@/lib/r2Storage';
import { getUserPermissions } from '@/lib/rbac';
import { getAuthenticatedUser, isAdmin } from '@/lib/auth';
import { isLocalhostDev } from '@/lib/bookAuth';
import { fileTypeFromBuffer } from 'file-type';

// Configure route to handle large file uploads (videos up to 100MB)
export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds for video uploads

// Helper to calculate file checksum
function calculateChecksum(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

// Helper to determine asset type from mime type
function getAssetType(mimeType: string): AssetType {
  if (mimeType.includes('svg')) return 'svg';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('video/')) return 'video';
  return 'image'; // default
}

export async function POST(request: NextRequest) {
  let formData: FormData | null = null;
  let file: File | null = null;
  
  try {
    await connectToDatabase();
    
    // Auth order:
    //   1. Safe localhost dev bypass (hostname + NODE_ENV + non-Vercel).
    //   2. x-admin-secret header (CLI scripts).
    //   3. Supabase session — allow if email is in ADMIN_EMAILS OR RBAC grants
    //      canEditQuestions.
    let isAuthorized = await isLocalhostDev();

    if (!isAuthorized) {
      const adminSecret = request.headers.get('x-admin-secret');
      const envSecret = process.env.ADMIN_SECRET;
      if (envSecret && adminSecret === envSecret) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      const user = await getAuthenticatedUser(request);
      if (user?.email) {
        if (isAdmin(user.email)) {
          isAuthorized = true;
        } else {
          // Fall back to RBAC (UserRole collection) for non-ADMIN_EMAILS editors.
          try {
            const permissions = await getUserPermissions(user.email);
            if (permissions.canEditQuestions) {
              isAuthorized = true;
            }
          } catch (rbacErr) {
            console.error('RBAC lookup failed during asset upload auth:', rbacErr);
          }
        }

        if (!isAuthorized) {
          return NextResponse.json(
            { success: false, error: 'Forbidden - Insufficient permissions to upload assets' },
            { status: 403 }
          );
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }
    
    formData = await request.formData();
    file = formData.get('file') as File;
    const questionId = formData.get('questionId') as string | null;
    const fieldType = formData.get('field_type') as string; // 'question', 'option', 'solution'
    const altText = formData.get('alt_text') as string;
    const caption = formData.get('caption') as string;
    const context = (formData.get('context') as string) || 'practice'; // e.g. 'mock_test', 'practice'
    
    // SECURITY FIX: Validate questionId format to prevent path traversal
    if (questionId) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(questionId)) {
        return NextResponse.json(
          { success: false, error: 'Invalid questionId format - must be a valid UUID' },
          { status: 400 }
        );
      }
    }
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Validate file type
    // Strip codec suffix (e.g. 'audio/webm;codecs=opus' → 'audio/webm') for comparison
    const baseFileType = file.type.split(';')[0].trim();
    const allowedBaseTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'image/svg+xml',
      'audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/webm', 'audio/mp4', 'audio/aac', 'audio/ogg',
      'video/mp4', 'video/webm'
    ];
    
    if (!allowedBaseTypes.includes(baseFileType)) {
      return NextResponse.json(
        { success: false, error: `File type ${file.type} not allowed` },
        { status: 400 }
      );
    }
    
    // Validate file size (max 10MB for images/svg, 50MB for audio/video)
    const maxSize = baseFileType.startsWith('audio/') || baseFileType.startsWith('video/') 
      ? 50 * 1024 * 1024 
      : 10 * 1024 * 1024;
    
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: `File size exceeds ${maxSize / 1024 / 1024}MB limit` },
        { status: 400 }
      );
    }
    
    // Read file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // SECURITY: Verify actual file type using magic numbers (file signatures).
    // SVG files are XML-based and undetectable by magic bytes — skip for SVG.
    // Audio/video have nuanced rules: WebM and MP4 are container formats shared between
    // audio-only and video files, so `file-type` returns 'video/webm' even for audio-only blobs.
    const detectedType = await fileTypeFromBuffer(buffer);

    const isAudio = baseFileType.startsWith('audio/');
    const isVideo = baseFileType.startsWith('video/');
    const isSvg = baseFileType === 'image/svg+xml';

    if (!isSvg) {
      if (!detectedType) {
        // file-type can't detect some audio formats (ogg vorbis, aac, wav) — allow audio through
        // if they passed the MIME allowlist check above. Reject all undetectable non-audio.
        if (!isAudio) {
          return NextResponse.json(
            { success: false, error: 'Unable to verify file type - file may be corrupted or invalid' },
            { status: 400 }
          );
        }
        // For audio, trust the browser's declared MIME (it passed the allowlist)
      } else {
        const detectedMime = detectedType.mime;

        // Normalize jpg variations
        const normalizedBase = baseFileType.replace('image/jpg', 'image/jpeg');
        const normalizedDetected = detectedMime.replace('image/jpg', 'image/jpeg');

        // WebM is a shared container: audio/webm blobs are detected as video/webm
        const isWebmEquivalent =
          (normalizedBase === 'audio/webm' && normalizedDetected === 'video/webm') ||
          (normalizedBase === 'video/webm' && normalizedDetected === 'audio/webm');

        // MP4 is a shared container: audio/mp4 blobs are detected as video/mp4
        const isMp4Equivalent =
          (normalizedBase === 'audio/mp4' && normalizedDetected === 'video/mp4') ||
          (normalizedBase === 'video/mp4' && normalizedDetected === 'audio/mp4');

        // For audio files, also allow if detected is any audio type (handles format variations)
        const isAudioCompatible = isAudio && detectedMime.startsWith('audio/');

        if (!isWebmEquivalent && !isMp4Equivalent && !isAudioCompatible && normalizedBase !== normalizedDetected) {
          return NextResponse.json(
            {
              success: false,
              error: `File type mismatch: claimed ${baseFileType} but detected ${detectedMime}. Possible file spoofing attempt.`
            },
            { status: 400 }
          );
        }
      }
    }
    
    // Calculate checksum
    const checksum = calculateChecksum(buffer);
    
    // Check if file already exists (deduplication)
    const existingAsset = await Asset.findOne({ 'file.checksum': checksum });
    if (existingAsset && questionId) {
      // File already exists, just add reference to this question
      const questions = Array.isArray(existingAsset.used_in.questions) ? existingAsset.used_in.questions : [];
      if (!questions.includes(questionId)) {
        questions.push(questionId);
        await existingAsset.save();
      }
      
      return NextResponse.json({
        success: true,
        data: existingAsset,
        message: 'File already exists, reference added'
      });
    }
    
    // Generate asset ID and determine type
    const assetId = uuidv4();
    const assetType = getAssetType(baseFileType);
    const extension = getExtensionFromMimeType(baseFileType) || path.extname(file.name).replace('.', '') || 'bin';
    
    // Organised R2 path: questions/{question_id}/{type}/{timestamp}_{assetId}.{ext}
    // or shared/{type}/{timestamp}_{assetId}.{ext} for non-question assets
    const timestamp = Date.now();
    
    // SECURITY FIX: Sanitize filename to prevent path traversal
    // Remove any path separators and limit to safe characters
    const safeOriginalName = file.name
      .replace(/[\/\\]/g, '') // Remove path separators
      .replace(/\.\./g, '') // Remove parent directory references
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Only allow alphanumeric, dots, and hyphens
      .replace(/\.[^.]+$/, '') // Remove extension (we'll add our own)
      .slice(0, 50); // Limit length
    
    const filename = `${timestamp}_${safeOriginalName}_${assetId.slice(0, 8)}.${extension}`;
    const storagePath = questionId
      ? `questions/${questionId}/${assetType}/${filename}`
      : `shared/${assetType}/${filename}`;
    
    // Upload to Cloudflare R2 using the organised storage path
    console.log('Uploading to R2:', {
      filename,
      assetType,
      contentType: baseFileType,
      storagePath,
      size: buffer.length
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
    
    // Create asset record
    const asset = new Asset({
      _id: assetId,
      type: assetType,
      file: {
        original_name: file.name,
        mime_type: baseFileType,
        size_bytes: file.size,
        storage_path: r2Result.path || storagePath,
        cdn_url: cdnUrl,
        checksum
      },
      used_in: {
        questions: questionId ? [questionId] : [],
        question_field: fieldType || 'unknown'
      },
      metadata: {
        alt_text: altText || '',
        caption: caption || '',
        context: context || 'practice',
      },
      version: 1,
      previous_versions: [],
      created_by: 'admin', // TODO: Get from auth
      processing_status: 'completed'
    });
    
    await asset.save();
    
    // Create audit log
    const auditLog = new AuditLog({
      _id: uuidv4(),
      entity_type: 'asset',
      entity_id: assetId,
      action: 'create',
      changes: [{
        field: 'asset',
        old_value: null,
        new_value: `Uploaded ${file.name}`
      }],
      user_id: 'admin',
      user_email: 'admin@canvasclasses.com',
      timestamp: new Date(),
      can_rollback: false
    });
    
    await auditLog.save();
    
    return NextResponse.json({
      success: true,
      data: asset,
      message: 'Asset uploaded successfully'
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

// GET - Fetch assets for a question
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('question_id');
    const type = searchParams.get('type');
    
    const query: Record<string, unknown> = { deleted_at: null };
    if (questionId) query['used_in.questions'] = questionId;
    if (type) query.type = type;
    
    const assets = await Asset.find(query).sort({ created_at: -1 }).lean();
    
    return NextResponse.json({
      success: true,
      data: assets
    });
    
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch assets' },
      { status: 500 }
    );
  }
}
