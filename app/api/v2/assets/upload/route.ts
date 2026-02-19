import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import crypto from 'crypto';
import connectToDatabase from '@/lib/mongodb';
import { Asset } from '@/lib/models/Asset';
import { AuditLog } from '@/lib/models/AuditLog';
import { uploadToR2, getExtensionFromMimeType, type AssetType } from '@/lib/r2Storage';

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
  try {
    await connectToDatabase();
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const questionId = formData.get('question_id') as string;
    const fieldType = formData.get('field_type') as string; // 'question', 'option', 'solution'
    const altText = formData.get('alt_text') as string;
    const caption = formData.get('caption') as string;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Validate file type
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'image/svg+xml',
      'audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/webm',
      'video/mp4', 'video/webm'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: `File type ${file.type} not allowed` },
        { status: 400 }
      );
    }
    
    // Validate file size (max 10MB for images/svg, 50MB for audio/video)
    const maxSize = file.type.startsWith('audio/') || file.type.startsWith('video/') 
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
    
    // Calculate checksum
    const checksum = calculateChecksum(buffer);
    
    // Check if file already exists (deduplication)
    const existingAsset = await Asset.findOne({ 'file.checksum': checksum });
    if (existingAsset && questionId) {
      // File already exists, just add reference to this question
      if (!existingAsset.used_in.questions.includes(questionId)) {
        existingAsset.used_in.questions.push(questionId);
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
    const assetType = getAssetType(file.type);
    const extension = getExtensionFromMimeType(file.type) || path.extname(file.name).replace('.', '') || 'bin';
    
    // Organised R2 path: questions/{question_id}/{type}/{timestamp}_{assetId}.{ext}
    // or shared/{type}/{timestamp}_{assetId}.{ext} for non-question assets
    const timestamp = Date.now();
    const safeOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/\.[^.]+$/, '');
    const filename = `${timestamp}_${safeOriginalName}_${assetId.slice(0, 8)}.${extension}`;
    const storagePath = questionId
      ? `questions/${questionId}/${assetType}/${filename}`
      : `shared/${assetType}/${filename}`;
    
    // Upload to Cloudflare R2 using the organised storage path
    const r2Result = await uploadToR2(buffer, filename, assetType, file.type, storagePath);
    if (!r2Result.success) {
      return NextResponse.json(
        { success: false, error: r2Result.error || 'R2 upload failed' },
        { status: 500 }
      );
    }
    
    const cdnUrl = r2Result.url!;
    
    // Create asset record
    const asset = new Asset({
      _id: assetId,
      type: assetType,
      file: {
        original_name: file.name,
        mime_type: file.type,
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
    
    const query: any = { deleted_at: null };
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
