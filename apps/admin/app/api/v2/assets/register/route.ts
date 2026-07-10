import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import connectToDatabase from '@canvas/data/db/mongodb';
import { Asset } from '@canvas/data/models/Asset';
import { AuditLog } from '@canvas/data/models/AuditLog';
import { type AssetType } from '@canvas/core/r2-storage';
import { requireAdmin } from '@/lib/auth';

export const runtime = 'nodejs';

// POST /api/v2/assets/register
// Step 2 of the direct-to-R2 upload (see ./presign). After the browser PUTs
// the file to R2, it calls this to record the Asset doc + audit entry, so the
// asset is tracked exactly like a proxied upload (delete-by-cdn_url, dedup,
// asset listing all keep working). The file bytes never transit Vercel; the
// SHA-256 checksum is computed in the browser and passed here for dedup.
//
// Body (JSON): { asset_id, key, cdn_url, asset_type, mime_type, file_name,
//                size_bytes, checksum, question_id?, field_type?, context?,
//                alt_text?, caption? }

const VALID_ASSET_TYPES: AssetType[] = ['image', 'svg', 'audio', 'video'];
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;

  let body: {
    asset_id?: string;
    key?: string;
    cdn_url?: string;
    asset_type?: AssetType;
    mime_type?: string;
    file_name?: string;
    size_bytes?: number;
    checksum?: string;
    question_id?: string;
    field_type?: string;
    context?: string;
    alt_text?: string;
    caption?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const {
    asset_id, key, cdn_url, asset_type, mime_type, file_name,
    size_bytes, checksum, question_id, field_type, context, alt_text, caption,
  } = body;

  // Explicit whitelist validation — never trust the body shape.
  if (!key || !cdn_url || !mime_type || !file_name || size_bytes == null) {
    return NextResponse.json(
      { success: false, error: 'key, cdn_url, mime_type, file_name, and size_bytes are required' },
      { status: 400 }
    );
  }
  if (!asset_type || !VALID_ASSET_TYPES.includes(asset_type)) {
    return NextResponse.json({ success: false, error: 'Invalid asset_type' }, { status: 400 });
  }
  if (question_id && !UUID_RE.test(question_id)) {
    return NextResponse.json({ success: false, error: 'Invalid question_id format' }, { status: 400 });
  }

  try {
    await connectToDatabase();

    // Dedup against the client-supplied checksum, matching the upload route.
    if (checksum) {
      const existing = await Asset.findOne({ 'file.checksum': checksum });
      if (existing) {
        if (question_id) {
          await Asset.updateOne(
            { _id: existing._id },
            { $addToSet: { 'used_in.questions': question_id } }
          );
        }
        return NextResponse.json({ success: true, data: existing, message: 'File already exists, reference added' });
      }
    }

    const assetId = asset_id && UUID_RE.test(asset_id) ? asset_id : uuidv4();

    const asset = new Asset({
      _id: assetId,
      type: asset_type,
      file: {
        original_name: file_name,
        mime_type,
        size_bytes,
        storage_path: key,
        cdn_url,
        // Direct uploads hash client-side; fall back to a non-empty marker so
        // the required field is satisfied when the browser couldn't hash.
        checksum: checksum || `direct-${assetId}`,
      },
      used_in: {
        questions: question_id ? [question_id] : [],
        question_field: field_type || 'unknown',
      },
      metadata: {
        alt_text: alt_text || '',
        caption: caption || '',
        context: context || 'practice',
      },
      version: 1,
      previous_versions: [],
      created_by: gate.user.email || 'admin',
      processing_status: 'completed',
    });

    await asset.save();

    await new AuditLog({
      _id: uuidv4(),
      entity_type: 'asset',
      entity_id: assetId,
      action: 'create',
      changes: [{ field: 'asset', old_value: null, new_value: `Uploaded ${file_name} (direct-to-R2)` }],
      user_id: gate.user.id || 'admin',
      user_email: gate.user.email || 'admin@canvasclasses.com',
      timestamp: new Date(),
      can_rollback: false,
    }).save();

    return NextResponse.json({ success: true, data: asset, message: 'Asset registered successfully' }, { status: 201 });
  } catch (error) {
    console.error('Asset register error:', error);
    return NextResponse.json({ success: false, error: 'Failed to register asset' }, { status: 500 });
  }
}
