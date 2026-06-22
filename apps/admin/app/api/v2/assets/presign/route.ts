import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { getPresignedPutUrl, getExtensionFromMimeType, type AssetType } from '@canvas/core/r2-storage';
import { requireAdmin } from '@/lib/auth';

export const runtime = 'nodejs';

// POST /api/v2/assets/presign
// Step 1 of the direct-to-R2 upload used by VideoDropZone (Crucible/Mock-Test
// solution videos). The browser then PUTs the file straight to R2 via the
// returned presignedUrl — bypassing Vercel's ~4.5 MB serverless body limit —
// and finishes with POST /api/v2/assets/register to record the Asset doc.
//
// Body (JSON): { file_name, file_type, file_size, question_id?, field_type? }
// Returns:     { presignedUrl, cdn_url, key, asset_id, asset_type }

const ALLOWED_BASE_TYPES = [
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
  'image/svg+xml',
  'audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/webm', 'audio/mp4', 'audio/aac', 'audio/ogg',
  'video/mp4', 'video/webm',
];

function getAssetType(mimeType: string): AssetType {
  if (mimeType.includes('svg')) return 'svg';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('video/')) return 'video';
  return 'image';
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;

  let body: {
    file_name?: string;
    file_type?: string;
    file_size?: number;
    question_id?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const { file_name, file_type, file_size, question_id } = body;
  if (!file_name || !file_type || file_size == null) {
    return NextResponse.json(
      { success: false, error: 'file_name, file_type, and file_size are required' },
      { status: 400 }
    );
  }

  const baseType = file_type.split(';')[0].trim();
  if (!ALLOWED_BASE_TYPES.includes(baseType)) {
    return NextResponse.json({ success: false, error: `File type ${file_type} not allowed` }, { status: 400 });
  }

  if (question_id && !UUID_RE.test(question_id)) {
    return NextResponse.json({ success: false, error: 'Invalid question_id format - must be a valid UUID' }, { status: 400 });
  }

  // Match the size caps the upload route enforces.
  const maxSize = baseType.startsWith('audio/') || baseType.startsWith('video/')
    ? 50 * 1024 * 1024
    : 10 * 1024 * 1024;
  if (file_size > maxSize) {
    return NextResponse.json(
      { success: false, error: `File size exceeds ${maxSize / 1024 / 1024}MB limit` },
      { status: 400 }
    );
  }

  // Build the exact same R2 key shape the upload route uses, so assets land
  // in the same place regardless of which path created them.
  const assetId = uuidv4();
  const assetType = getAssetType(baseType);
  const extension = getExtensionFromMimeType(baseType) || path.extname(file_name).replace('.', '') || 'bin';
  const timestamp = Date.now();
  const safeOriginalName = file_name
    .replace(/[\/\\]/g, '')
    .replace(/\.\./g, '')
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\.[^.]+$/, '')
    .slice(0, 50);
  const filename = `${timestamp}_${safeOriginalName}_${assetId.slice(0, 8)}.${extension}`;
  const key = question_id
    ? `questions/${question_id}/${assetType}/${filename}`
    : `shared/${assetType}/${filename}`;

  const publicBase = process.env.R2_PUBLIC_URL || '';
  const cdn_url = `${publicBase}/${key}`;

  try {
    const presignedUrl = await getPresignedPutUrl(key, baseType);
    return NextResponse.json({ presignedUrl, cdn_url, key, asset_id: assetId, asset_type: assetType });
  } catch (error) {
    console.error('Asset presign error:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate upload URL' }, { status: 500 });
  }
}
