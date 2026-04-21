import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { fileTypeFromBuffer } from 'file-type';
import connectToDatabase from '@/lib/mongodb';
import { uploadToR2, getExtensionFromMimeType } from '@/lib/r2Storage';
import { getAuthenticatedUser, isAdmin, hasScriptSecret } from '@/lib/auth';
import { isLocalhostDev } from '@/lib/bookAuth';

export const runtime = 'nodejs';
export const maxDuration = 60;

async function authorize(request: NextRequest): Promise<{ ok: boolean; email: string } | null> {
  if (await isLocalhostDev()) return { ok: true, email: 'dev@localhost' };
  if (hasScriptSecret(request)) return { ok: true, email: 'script@canvas' };
  const user = await getAuthenticatedUser(request);
  if (user?.email && isAdmin(user.email)) return { ok: true, email: user.email };
  return null;
}

function sanitizeSlug(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || 'untitled';
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const auth = await authorize(request);
    if (!auth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const slugRaw = (formData.get('slug') as string | null) || 'general';
    const slug = sanitizeSlug(slugRaw);

    if (!file) return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });

    const baseType = file.type.split(';')[0].trim();
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowed.includes(baseType)) {
      return NextResponse.json({ success: false, error: `File type ${baseType} not allowed` }, { status: 400 });
    }

    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json({ success: false, error: 'File exceeds 10MB limit' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (baseType !== 'image/svg+xml') {
      const detected = await fileTypeFromBuffer(buffer);
      if (!detected) {
        return NextResponse.json({ success: false, error: 'Unable to verify file type' }, { status: 400 });
      }
      const normBase = baseType.replace('image/jpg', 'image/jpeg');
      const normDetected = detected.mime.replace('image/jpg', 'image/jpeg');
      if (normBase !== normDetected) {
        return NextResponse.json(
          { success: false, error: `Type mismatch: claimed ${baseType} detected ${detected.mime}` },
          { status: 400 }
        );
      }
    }

    const ext = getExtensionFromMimeType(baseType) || 'bin';
    const assetId = uuidv4().slice(0, 8);
    const timestamp = Date.now();
    const safeName = (file.name || 'image')
      .replace(/[\/\\]/g, '')
      .replace(/\.\./g, '')
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/\.[^.]+$/, '')
      .slice(0, 40);

    const storagePath = `blog/${slug}/${timestamp}_${safeName}_${assetId}.${ext}`;
    const assetType = baseType === 'image/svg+xml' ? 'svg' : 'image';
    const result = await uploadToR2(buffer, `${safeName}.${ext}`, assetType, baseType, storagePath);
    if (!result.success) {
      console.error('R2 upload failed:', result.error);
      return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        url: result.url,
        path: result.path,
        markdown: `![image](${result.url})`,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/blog/upload-image error:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
