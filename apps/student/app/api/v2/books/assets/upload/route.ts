import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { uploadToR2, getExtensionFromMimeType, type AssetType } from '@/lib/r2Storage';
import { isAdminRequest } from '@/lib/bookAuth';

export const runtime = 'nodejs';
export const maxDuration = 60;

const ALLOWED_TYPES: Record<string, AssetType> = {
  // ── Images ──────────────────────────────────────────────────────────────
  'image/jpeg': 'image',
  'image/jpg': 'image',
  'image/png': 'image',
  'image/webp': 'image',
  'image/gif': 'image',
  'image/svg+xml': 'svg',
  // ── Audio — uploaded files ───────────────────────────────────────────────
  'audio/mpeg': 'audio',
  'audio/mp3': 'audio',
  'audio/mp4': 'audio',   // AAC in MP4 container (common upload format)
  'audio/m4a': 'audio',
  'audio/wav': 'audio',
  'audio/x-wav': 'audio',
  'audio/ogg': 'audio',   // Firefox default MediaRecorder output
  // ── Audio — browser MediaRecorder output ────────────────────────────────
  // Chrome / Edge record as audio/webm (codec suffix is stripped in baseType)
  'audio/webm': 'audio',
  // Safari records as audio/mp4 (already covered above) or audio/aac
  'audio/aac': 'audio',
  // ── Video ────────────────────────────────────────────────────────────────
  'video/mp4': 'video',
  'video/webm': 'video',
  // ── Lottie animations (JSON) ─────────────────────────────────────────────
  'application/json': 'image', // stored as-is, no R2 type restriction needed
};

const MAX_SIZE: Record<AssetType, number> = {
  image: 10 * 1024 * 1024,   // 10 MB
  svg: 5 * 1024 * 1024,       // 5 MB
  audio: 50 * 1024 * 1024,    // 50 MB
  video: 100 * 1024 * 1024,   // 100 MB
};

// POST /api/v2/books/assets/upload
// FormData fields:
//   file        — the file
//   book_id     — book UUID (used for R2 path)
//   chapter_number — number (used for R2 path)
//   block_id    — block ID (used in filename)
export async function POST(request: NextRequest) {
  const isAdmin = await isAdminRequest();
  if (!isAdmin) {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const bookId = formData.get('book_id') as string | null;
    const chapterNumber = formData.get('chapter_number') as string | null;
    const blockId = formData.get('block_id') as string | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const baseType = file.type.split(';')[0].trim();
    const assetType = ALLOWED_TYPES[baseType];

    if (!assetType) {
      return NextResponse.json(
        { success: false, error: `File type ${file.type} is not supported` },
        { status: 400 }
      );
    }

    const maxSize = MAX_SIZE[assetType];
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: `File too large. Max size: ${maxSize / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Build R2 path: books/{bookId}/{chapterNumber}/{blockId}_{safeName}.{ext}
    const ext =
      getExtensionFromMimeType(baseType) ||
      path.extname(file.name).replace('.', '') ||
      'bin';

    const safeName = file.name
      .replace(/[\/\\]/g, '')
      .replace(/\.\./g, '')
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/\.[^.]+$/, '')
      .slice(0, 40);

    const fileId = blockId || uuidv4().slice(0, 8);
    const filename = `${fileId}_${safeName}.${ext}`;

    const chapterPart = chapterNumber ? `ch${chapterNumber}` : 'shared';
    const bookPart = bookId || 'shared';
    const storagePath = `books/${bookPart}/${chapterPart}/${filename}`;

    const result = await uploadToR2(buffer, filename, assetType, baseType, storagePath);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      key: storagePath,
    }, { status: 201 });
  } catch (error) {
    console.error('Books asset upload error:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
