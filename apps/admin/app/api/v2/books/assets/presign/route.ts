import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { getPresignedPutUrl, getExtensionFromMimeType, type AssetType } from '@canvas/core/r2-storage';
import { isAdminRequest } from '@/lib/adminAuth';

export const runtime = 'nodejs';

// Mirror the type/size tables from the upload route so validation is consistent.
const ALLOWED_TYPES: Record<string, AssetType> = {
  'image/jpeg': 'image', 'image/jpg': 'image', 'image/png': 'image',
  'image/webp': 'image', 'image/gif': 'image', 'image/svg+xml': 'svg',
  'audio/mpeg': 'audio', 'audio/mp3': 'audio', 'audio/mp4': 'audio',
  'audio/m4a': 'audio', 'audio/wav': 'audio', 'audio/x-wav': 'audio',
  'audio/ogg': 'audio', 'audio/webm': 'audio', 'audio/aac': 'audio',
  'video/mp4': 'video', 'video/webm': 'video', 'video/quicktime': 'video',
  'video/x-m4v': 'video', 'video/3gpp': 'video', 'video/3gpp2': 'video',
  'application/json': 'image',
};

const MAX_SIZE: Record<AssetType, number> = {
  image: 10 * 1024 * 1024,
  svg:    5 * 1024 * 1024,
  audio: 50 * 1024 * 1024,
  video: 200 * 1024 * 1024,
};

// POST /api/v2/books/assets/presign
// Body (JSON): { file_name, file_type, file_size, book_id, chapter_number, block_id }
// Returns:     { presignedUrl, publicUrl, key }
//
// The browser then PUTs the file directly to R2 using presignedUrl, which
// bypasses Vercel's 4.5 MB serverless function body limit entirely.
export async function POST(request: NextRequest) {
  const isAdmin = await isAdminRequest();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  let body: {
    file_name?: string;
    file_type?: string;
    file_size?: number;
    book_id?: string;
    chapter_number?: string;
    block_id?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { file_name, file_type, file_size, book_id, chapter_number, block_id } = body;

  if (!file_name || !file_type || file_size == null) {
    return NextResponse.json({ error: 'file_name, file_type, and file_size are required' }, { status: 400 });
  }

  const baseType = file_type.split(';')[0].trim();
  const assetType = ALLOWED_TYPES[baseType];
  if (!assetType) {
    return NextResponse.json({ error: `File type ${file_type} is not supported` }, { status: 400 });
  }

  if (file_size > MAX_SIZE[assetType]) {
    return NextResponse.json(
      { error: `File too large. Max size: ${MAX_SIZE[assetType] / 1024 / 1024}MB` },
      { status: 400 }
    );
  }

  // Build the same R2 key the upload route would have used.
  const ext =
    getExtensionFromMimeType(baseType) ||
    path.extname(file_name).replace('.', '') ||
    'bin';

  const safeName = file_name
    .replace(/[\/\\]/g, '')
    .replace(/\.\./g, '')
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\.[^.]+$/, '')
    .slice(0, 40);

  const fileId = block_id || uuidv4().slice(0, 8);
  const filename = `${fileId}_${safeName}.${ext}`;
  const chapterPart = chapter_number ? `ch${chapter_number}` : 'shared';
  const bookPart = book_id || 'shared';
  const key = `books/${bookPart}/${chapterPart}/${filename}`;

  const publicBase = process.env.R2_PUBLIC_URL || '';
  const publicUrl = `${publicBase}/${key}`;

  try {
    const presignedUrl = await getPresignedPutUrl(key, baseType);
    return NextResponse.json({ presignedUrl, publicUrl, key });
  } catch (error) {
    console.error('Presign error:', error);
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}
